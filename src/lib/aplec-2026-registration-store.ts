import "server-only";
import { get, put, BlobPreconditionFailedError } from "@vercel/blob";
import { randomBytes, timingSafeEqual } from "node:crypto";
import { CONSENT_VERSION, consentText, LUNCH_CAPACITY, LUNCH_DEADLINE, type RegistrationInput, type RegistrationKind, type RegistrationRecord, type LunchStatus, type Notifications } from "./aplec-2026-registration";

type Ledger = { version: 1; records: RegistrationRecord[]; physicalPlaces?: number };
export class RegistrationError extends Error {
  constructor(message: string, public readonly code: "conflict" | "capacity" | "not-found" | "invalid" | "cancelled" = "conflict") { super(message); }
}
export class RegistrationStoreUnavailableError extends Error {}
export const hasRegistrationStore = () => Boolean(process.env.REGISTRATION_BLOB_READ_WRITE_TOKEN && process.env.REGISTRATION_BLOB_READ_WRITE_TOKEN !== process.env.BLOB_READ_WRITE_TOKEN);
function token() {
  if (!hasRegistrationStore()) throw new RegistrationStoreUnavailableError("Les inscripcions no estan disponibles ara. Torna-ho a provar més endavant.");
  return process.env.REGISTRATION_BLOB_READ_WRITE_TOKEN!;
}
const path = (kind: RegistrationKind) => `iltir-2026/${kind}/registrations.json`;

async function read(kind: RegistrationKind): Promise<{ ledger: Ledger; etag?: string }> {
  const result = await get(path(kind), { access: "private", token: token(), useCache: false });
  if (!result) return { ledger: { version: 1, records: [] } };
  if (result.statusCode !== 200) throw new Error("Registration storage unavailable");
  const ledger = await new Response(result.stream).json() as Ledger;
  if (ledger.version !== 1 || !Array.isArray(ledger.records)) throw new Error("Invalid registration storage");
  return { ledger, etag: result.blob.etag };
}

// One private ledger per collection: record + capacity + idempotency are committed
// together. Never count a Blob list or use an in-process lock for capacity.
// Origin reads and conditional writes protect across concurrent Vercel instances.
async function mutate<T>(kind: RegistrationKind, update: (ledger: Ledger) => T): Promise<T> {
  for (let attempt = 0; attempt < 8; attempt++) {
    const { ledger, etag } = await read(kind);
    const result = update(ledger);
    try {
      await put(path(kind), JSON.stringify(ledger), {
        access: "private", token: token(), addRandomSuffix: false,
        contentType: "application/json", allowOverwrite: Boolean(etag),
        ...(etag ? { ifMatch: etag } : {}),
      });
      return result;
    } catch (error) {
      // A concurrent first writer may create the ledger between read and put.
      // Verify that it now exists rather than swallowing arbitrary storage errors.
      if (!(error instanceof BlobPreconditionFailedError) && (etag || !(await read(kind)).etag)) throw error;
      await new Promise(resolve => setTimeout(resolve, 40 * (attempt + 1) + Math.random() * 80));
    }
  }
  throw new RegistrationError("Hi ha altres reserves en curs. Torna-ho a provar; no es duplicarà la teva inscripció.");
}

export const getRegistrations = async (kind: RegistrationKind) => (await read(kind)).ledger.records;
export const reservedPlaces = (records: RegistrationRecord[]) => records.reduce((sum, r) => sum + (r.status === "cancelled" ? 0 : r.people || 0), 0);
export async function getLunchSummary() {
  const { ledger } = await read("lunch");
  return { records: ledger.records, physicalPlaces: ledger.physicalPlaces || 0, reserved: reservedPlaces(ledger.records) + (ledger.physicalPlaces || 0) };
}
export async function getLunchAvailability() {
  const remaining = LUNCH_CAPACITY - (await getLunchSummary()).reserved;
  return { remaining, closed: Date.now() >= Date.parse(LUNCH_DEADLINE) };
}

export async function createRegistration(kind: RegistrationKind, input: RegistrationInput) {
  // Generate once outside retry loop. These values never depend on personal data.
  const id = kind === "lunch" ? `ILTIR-DINAR-${randomBytes(6).toString("hex").toUpperCase()}` : `ILTIR-${kind === "walk" ? "CAMINADA" : "VOL"}-${randomBytes(12).toString("hex")}`;
  const ticketToken = kind === "lunch" ? randomBytes(32).toString("hex") : undefined;
  return mutate(kind, ledger => {
    const existing = ledger.records.find(r => r.requestId === input.requestId);
    if (existing) {
      // Same request key may only replay the exact same normalized submission.
      for (const key of Object.keys(input) as (keyof RegistrationInput)[]) {
        if (JSON.stringify(existing[key]) !== JSON.stringify(input[key])) throw new RegistrationError("Aquest enviament ja s’ha registrat amb altres dades. Recarrega la pàgina per fer una nova inscripció.");
      }
      return existing;
    }
    if (ledger.records.some(r => r.id === id)) throw new RegistrationError("Torna-ho a provar.");
    if (kind === "lunch") {
      if (Date.now() >= Date.parse(LUNCH_DEADLINE)) throw new RegistrationError("El termini de reserva ha finalitzat.");
      const remaining = LUNCH_CAPACITY - reservedPlaces(ledger.records) - (ledger.physicalPlaces || 0);
      if (input.people! > remaining) throw new RegistrationError(remaining ? `Queden ${remaining} places. Redueix el nombre de persones.` : "Reserves completes", "capacity");
    }
    const record: RegistrationRecord = { ...input, id, kind, createdAt: new Date().toISOString(), consentVersion: CONSENT_VERSION, consentText: consentText[kind], notifications: { organization: "pending", participant: "pending" }, ...(kind === "lunch" ? { status: "pending", ticketToken } : {}) };
    ledger.records.push(record);
    return record;
  });
}

export async function updateLunchStatus(id: string, status: LunchStatus) {
  return mutate("lunch", ledger => {
    const record = ledger.records.find(r => r.id === id);
    if (!record) throw new RegistrationError("No s’ha trobat la reserva.", "not-found");
    if (record.status === "cancelled" && status !== "cancelled" && reservedPlaces(ledger.records) + (ledger.physicalPlaces || 0) + record.people! > LUNCH_CAPACITY) throw new RegistrationError("No hi ha prou places per reactivar aquesta reserva.", "capacity");
    record.status = status;
  });
}

export async function updatePhysicalPlaces(places: number) {
  if (!Number.isSafeInteger(places) || places < 0 || places > LUNCH_CAPACITY) throw new RegistrationError("Nombre de places no vàlid.", "invalid");
  await mutate("lunch", ledger => {
    if (places + reservedPlaces(ledger.records) > LUNCH_CAPACITY) throw new RegistrationError("Les vendes físiques superarien l’aforament.", "capacity");
    ledger.physicalPlaces = places;
  });
}

export async function updateNotifications(kind: RegistrationKind, id: string, notifications: Notifications) {
  await mutate(kind, ledger => {
    const record = ledger.records.find(r => r.id === id);
    if (!record) throw new Error("Registration missing");
    for (const target of ["organization", "participant"] as const) {
      // A slower failed attempt must not overwrite a successful concurrent send.
      if (record.notifications[target] !== "sent") record.notifications[target] = notifications[target];
    }
  });
}

export async function readTicket(id: string, credential: string) {
  if (!/^ILTIR-DINAR-[A-F0-9]{12}$/.test(id) || !/^[a-f0-9]{64}$/.test(credential)) return null;
  const record = (await getRegistrations("lunch")).find(r => r.id === id);
  if (!record?.ticketToken || !timingSafeEqual(Buffer.from(record.ticketToken), Buffer.from(credential))) return null;
  return { id: record.id, firstName: record.firstName, lastName: record.lastName, people: record.people, vegetarian: record.vegetarian, status: record.status };
}
