// Shared public constants and types. Never put credentials or stored records here.
export const LUNCH_CAPACITY = 120;
// Midnight after 17 October in Europe/Madrid (CEST, UTC+2).
export const LUNCH_DEADLINE = "2026-10-17T22:00:00.000Z";
export const CONSENT_VERSION = "2026-09-24-v1";
export const volunteerDays = ["Divendres 16 d’octubre", "Dissabte 17 d’octubre", "Diumenge 18 d’octubre"] as const;
export type RegistrationKind = "volunteers" | "lunch" | "walk" | "football";
export function isRegistrationKind(value: unknown): value is RegistrationKind {
  return value === "volunteers" || value === "lunch" || value === "walk" || value === "football";
}
export type LunchStatus = "pending" | "paid" | "cancelled";
export const lunchStatusLabels: Record<LunchStatus, string> = { pending: "Pendent de pagament", paid: "Pagat", cancelled: "Cancel·lat" };
export const ticketHeadings: Record<LunchStatus, string> = {
  pending: "RESERVA ONLINE — PENDENT DE PAGAMENT",
  paid: "RESERVA CONFIRMADA — PAGADA",
  cancelled: "RESERVA CANCEL·LADA — SENSE PLAÇA RESERVADA",
};
export const pendingPaymentNotice = "Aquesta reserva no acredita el pagament. L’import s’haurà d’abonar segons les indicacions de l’organització.";
export const consentPurpose = {
  volunteers: "Gestionar la inscripció, organització i contacte amb les persones voluntàries de l’Aplec Iltiŕ 2026.",
  lunch: "Gestionar la reserva, contacte i organització del dinar popular de l’Aplec Iltiŕ 2026.",
  walk: "Gestionar la inscripció i contactar amb la persona en relació amb la caminada de l’Aplec Iltiŕ 2026.",
  football: "Gestionar la inscripció dels equips, el contacte amb la persona responsable i la participació i assegurança dels jugadors del Torneig de Futbol ILTIŔ.",
};
export const consentText = {
  volunteers: "He llegit la informació sobre protecció de dades i autoritzo el tractament de les meves dades per gestionar la meva inscripció, organització i contacte com a persona voluntària de l’Aplec Iltiŕ 2026.",
  lunch: "He llegit la informació sobre protecció de dades i autoritzo el tractament de les meves dades per gestionar la reserva, contacte i organització del dinar popular de l’Aplec Iltiŕ 2026.",
  walk: "He llegit la informació sobre protecció de dades i autoritzo el tractament de les meves dades per gestionar la meva inscripció i contactar amb mi en relació amb la caminada de l’Aplec Iltiŕ 2026.",
  football: "He llegit la informació sobre protecció de dades i autoritzo el tractament de les meves dades per gestionar la inscripció de l’equip al Torneig de Futbol ILTIŔ. Confirmo que he informat tots els jugadors i disposo de la seva autorització per facilitar les seves dades per a la participació i l’assegurança.",
};
export type NotificationState = "pending" | "sent" | "failed";
export type Notifications = { organization: NotificationState; participant: NotificationState };
export const FOOTBALL_CONSENT_VERSION = "2026-10-08-football-teams-v1";
export type FootballPlayer = { firstName: string; lastName: string; age: number; municipality: string; dni: string };
export type RegistrationInput = {
  teamName?: string;
  responsibleName?: string;
  playerCount?: number;
  players?: FootballPlayer[];
  requestId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  age?: number;
  municipality?: string;
  dni?: string;
  days?: string[];
  availability?: string;
  observations?: string;
  people?: number;
  vegetarian?: number;
};
export type RegistrationRecord = RegistrationInput & {
  id: string; kind: RegistrationKind; createdAt: string; consentVersion: string;
  consentText: string; notifications: Notifications;
  status?: LunchStatus; ticketToken?: string;
};
export type Ticket = Pick<RegistrationRecord, "id" | "firstName" | "lastName" | "people" | "vegetarian" | "status">;
export type FormResult = { ok?: boolean; errors?: Record<string, string>; message?: string; ticketUrl?: string };

export function validateRegistration(kind: RegistrationKind, body: Record<string, unknown>) {
  const errors: Record<string, string> = {};
  function text(key: string, max: number, required = true, source: Record<string, unknown> = body, errorKey = key) {
    const value = typeof source[key] === "string" ? source[key].trim().normalize("NFC") : "";
    if ((required && !value) || value.length > max || /[\u0000-\u0008\u000b-\u001f\u007f]/u.test(value)) errors[errorKey] = `Introdueix un valor vàlid (màxim ${max} caràcters).`;
    if (!["availability", "observations"].includes(key) && /[\r\n\t]/.test(value)) errors[errorKey] = "Introdueix el valor en una sola línia.";
    return value;
  }
  const phone = text("phone", 30).replace(/[\s().-]/g, "");

const input: RegistrationInput = {
  requestId: text("requestId", 36),
  firstName: kind === "football" ? "" : text("firstName", 80),
  lastName: kind === "football" ? "" : text("lastName", 100),
  email: text("email", 254).toLowerCase(),
  phone: phone || undefined,
};
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input.requestId)) errors.requestId = "Recarrega la pàgina i torna-ho a provar.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) errors.email = "Introdueix un correu electrònic vàlid.";
  if (kind === "football" && !input.phone) errors.phone = "Introdueix un telèfon de contacte.";
  if (input.phone && !/^\+?[0-9]{7,15}$/.test(input.phone)) {
  errors.phone = "Introdueix un telèfon vàlid, amb prefix si cal.";
}
  if (body.consent !== true) errors.consent = "Cal acceptar el tractament de dades per gestionar la inscripció.";
  if (body.website) errors.form = "No s’ha pogut validar el formulari.";
  function integer(key: string, min: number, max: number, source: Record<string, unknown> = body, errorKey = key) {
    const raw = source[key];
    const value = typeof raw === "string" && /^\d+$/.test(raw) ? Number(raw) : typeof raw === "number" ? raw : NaN;
    if (!Number.isSafeInteger(value) || value < min || value > max) errors[errorKey] = `Introdueix un nombre enter entre ${min} i ${max}.`;
    return value;
    }
  if (kind === "volunteers") {
  input.age = integer("age", 1, 120);
  input.days = Array.isArray(body.days)
    ? [...new Set(body.days.filter((d): d is string => typeof d === "string"))]
    : [];

  if (
    !input.days.length ||
    input.days.some(d => !volunteerDays.some(day => day === d))
  ) {
    errors.days = "Selecciona almenys un dels tres dies.";
  }

  input.availability = text("availability", 500);
  input.observations = text("observations", 1500, false);

} else if (kind === "lunch") {
  input.people = integer("people", 1, LUNCH_CAPACITY);
  input.vegetarian = integer("vegetarian", 0, LUNCH_CAPACITY);

  if (input.vegetarian > input.people) {
    errors.vegetarian =
      "Els menús vegetarians no poden superar el nombre total de persones.";
  }

} else if (kind === "football") {
  input.teamName = text("teamName", 100);
  input.responsibleName = text("responsibleName", 180);
  input.playerCount = integer("playerCount", 5, 8);
  const players = Array.isArray(body.players) ? body.players : [];
  if (players.length !== input.playerCount || players.length < 5 || players.length > 8) errors.players = "L’equip ha de tenir entre 5 i 8 jugadors i coincidir amb el nombre seleccionat.";
  input.players = players.slice(0, 8).map((raw, index) => {
    const player = raw && typeof raw === "object" && !Array.isArray(raw) ? raw as Record<string, unknown> : {};
    const key = (field: string) => `players.${index}.${field}`;
    const dni = text("dni", 20, true, player, key("dni")).toUpperCase();
    if (!/^[A-Z0-9-]{5,20}$/.test(dni)) errors[key("dni")] = "Introdueix un DNI o document identificatiu vàlid.";
    return {
      firstName: text("firstName", 80, true, player, key("firstName")),
      lastName: text("lastName", 100, true, player, key("lastName")),
      age: integer("age", 17, 120, player, key("age")),
      municipality: text("municipality", 100, true, player, key("municipality")),
      dni,
    };
  });
  const towns = new Set(input.players.map(p => p.municipality.toLocaleLowerCase("ca")).filter(town => ["cabanelles", "lladó", "navata"].includes(town)));
  if (towns.size < 2) errors.players = "Cal representació d’almenys dos pobles: Cabanelles, Lladó o Navata.";
}

return { input, errors };
}
