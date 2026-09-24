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
  return "\uFEFF" + [keys.map(cell).join(","), ...records.map(record => keys.map(key => cell(record[key])).join(","))].join("\r\n");
}
