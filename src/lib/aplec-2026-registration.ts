// Shared public constants and types. Never put credentials or stored records here.
export const LUNCH_CAPACITY = 120;
// Midnight after 17 October in Europe/Madrid (CEST, UTC+2).
export const LUNCH_DEADLINE = "2026-10-17T22:00:00.000Z";
export const CONSENT_VERSION = "2026-09-24-v1";
export const volunteerDays = ["Divendres 16 d’octubre", "Dissabte 17 d’octubre", "Diumenge 18 d’octubre"] as const;
export type RegistrationKind = "volunteers" | "lunch" | "walk";
export function isRegistrationKind(value: unknown): value is RegistrationKind {
  return value === "volunteers" || value === "lunch" || value === "walk";
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
};
export const consentText = {
  volunteers: "He llegit la informació sobre protecció de dades i autoritzo el tractament de les meves dades per gestionar la meva inscripció, organització i contacte com a persona voluntària de l’Aplec Iltiŕ 2026.",
  lunch: "He llegit la informació sobre protecció de dades i autoritzo el tractament de les meves dades per gestionar la reserva, contacte i organització del dinar popular de l’Aplec Iltiŕ 2026.",
  walk: "He llegit la informació sobre protecció de dades i autoritzo el tractament de les meves dades per gestionar la meva inscripció i contactar amb mi en relació amb la caminada de l’Aplec Iltiŕ 2026.",
};
export type NotificationState = "pending" | "sent" | "failed";
export type Notifications = { organization: NotificationState; participant: NotificationState };
export type RegistrationInput = {
  requestId: string; firstName: string; lastName: string; email: string; phone: string;
  age?: number; days?: string[]; availability?: string; observations?: string;
  people?: number; vegetarian?: number;
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
  function text(key: string, max: number, required = true) {
    const value = typeof body[key] === "string" ? body[key].trim().normalize("NFC") : "";
    if ((required && !value) || value.length > max || /[\u0000-\u0008\u000b-\u001f\u007f]/u.test(value)) errors[key] = `Introdueix un valor vàlid (màxim ${max} caràcters).`;
    if (!["availability", "observations"].includes(key) && /[\r\n\t]/.test(value)) errors[key] = "Introdueix el valor en una sola línia.";
    return value;
  }
  const input: RegistrationInput = {
    requestId: text("requestId", 36), firstName: text("firstName", 80), lastName: text("lastName", 100),
    email: text("email", 254).toLowerCase(), phone: text("phone", 30).replace(/[\s().-]/g, ""),
  };
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input.requestId)) errors.requestId = "Recarrega la pàgina i torna-ho a provar.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) errors.email = "Introdueix un correu electrònic vàlid.";
  if (!/^\+?[0-9]{7,15}$/.test(input.phone)) errors.phone = "Introdueix un telèfon vàlid, amb prefix si cal.";
  if (body.consent !== true) errors.consent = "Cal acceptar el tractament de dades per gestionar la inscripció.";
  if (body.website) errors.form = "No s’ha pogut validar el formulari.";
  function integer(key: string, min: number, max: number) {
    const raw = body[key];
    const value = typeof raw === "string" && /^\d+$/.test(raw) ? Number(raw) : typeof raw === "number" ? raw : NaN;
    if (!Number.isSafeInteger(value) || value < min || value > max) errors[key] = `Introdueix un nombre enter entre ${min} i ${max}.`;
    return value;
  }
  if (kind === "volunteers") {
    input.age = integer("age", 1, 120);
    input.days = Array.isArray(body.days) ? [...new Set(body.days.filter((d): d is string => typeof d === "string"))] : [];
    if (!input.days.length || input.days.some(d => !volunteerDays.some(day => day === d))) errors.days = "Selecciona almenys un dels tres dies.";
    input.availability = text("availability", 500);
    input.observations = text("observations", 1500, false);
  } else if (kind === "lunch") {
    input.people = integer("people", 1, LUNCH_CAPACITY);
    input.vegetarian = integer("vegetarian", 0, LUNCH_CAPACITY);
    if (input.vegetarian > input.people) errors.vegetarian = "Els menús vegetarians no poden superar el nombre total de persones.";
  }
  return { input, errors };
}
