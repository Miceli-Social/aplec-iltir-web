import "server-only";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, isValidAdminToken } from "./admin-auth";
import type { RegistrationKind, RegistrationRecord } from "./aplec-2026-registration";
export async function isRegistrationAdmin() { return isValidAdminToken((await cookies()).get(ADMIN_COOKIE)?.value); }

export function registrationCsv(records: RegistrationRecord[], kind: RegistrationKind) {
  const keys: (keyof RegistrationRecord)[] = kind === "lunch"
    ? ["id", "createdAt", "firstName", "lastName", "email", "phone", "people", "vegetarian", "status", "notifications", "consentVersion"]
    : kind === "walk" ? ["id", "createdAt", "firstName", "lastName", "email", "phone", "notifications", "consentVersion"]
    : ["id", "createdAt", "firstName", "lastName", "age", "email", "phone", "days", "availability", "observations", "notifications", "consentVersion"];
  function cell(value: unknown) {
    const text = Array.isArray(value) ? value.join("; ") : value && typeof value === "object" ? JSON.stringify(value) : String(value ?? "");
    // Quoting alone does not prevent spreadsheet formula injection.
    const safe = /^[\s]*[=+\-@\t\r\n]/.test(text) ? `'${text}` : text;
    return `"${safe.replace(/"/g, '""')}"`;
  }
  if (kind === "football") {
    // One row per team; fixed player columns remain easy to filter in spreadsheets.
    // Legacy individual registrations remain visible without inventing an affiliation.
    const fields = ["firstName", "lastName", "age", "municipality", "dni"] as const;
    const headers = ["id", "createdAt", "registrationType", "teamName", "responsibleName", "email", "phone", "playerCount", ...Array.from({ length: 8 }, (_, index) => fields.map(field => `player${index + 1}_${field}`)).flat(), "notifications", "consentVersion"];
    const rows = records.map(record => {
      const players = record.players || [{ firstName: record.firstName, lastName: record.lastName, age: record.age, municipality: record.municipality, dni: record.dni }];
      return [record.id, record.createdAt, record.players ? "equip" : "individual anterior", record.teamName, record.responsibleName || `${record.firstName} ${record.lastName}`, record.email, record.phone, record.playerCount ?? 1, ...Array.from({ length: 8 }, (_, index) => fields.map(field => players[index]?.[field])).flat(), record.notifications, record.consentVersion];
    });
    return "\uFEFF" + [headers, ...rows].map(row => row.map(cell).join(",")).join("\r\n");
  }
  return "\uFEFF" + [keys.map(cell).join(","), ...records.map(record => keys.map(key => cell(record[key])).join(","))].join("\r\n");
}
