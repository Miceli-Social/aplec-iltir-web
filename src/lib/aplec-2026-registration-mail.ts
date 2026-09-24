import "server-only";
import { ticketHeadings, pendingPaymentNotice, type NotificationState, type RegistrationRecord } from "./aplec-2026-registration";
import { updateNotifications } from "./aplec-2026-registration-store";

export function ticketLink(record: RegistrationRecord) {
  // Fragment credentials are not sent in URL requests, server logs or referrers.
  return `/aplecs/2026/dinar/tiquet#${record.id}/${record.ticketToken}`;
}

async function send(to: string, subject: string, text: string, key: string): Promise<NotificationState> {
  if (!process.env.RESEND_API_KEY || !process.env.REGISTRATION_FROM_EMAIL) return "pending";
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST", headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json", "Idempotency-Key": key },
      // Plain text email: user input is never interpolated into HTML.
      body: JSON.stringify({ from: process.env.REGISTRATION_FROM_EMAIL, to: [to], subject, text }),
      signal: AbortSignal.timeout(8000),
    });
    return response.ok ? "sent" : "failed";
  } catch { return "failed"; }
}

export async function notifyRegistration(record: RegistrationRecord) {
  if (record.status === "cancelled") return false;
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://apleciltir.cat").replace(/\/$/, "");
  const fullName = `${record.firstName} ${record.lastName}`;
  const detail = record.kind === "lunch"
    ? `${record.id}\nPersones: ${record.people}\nMenús vegetarians: ${record.vegetarian}\n${ticketHeadings[record.status ?? "pending"]}`
    : record.kind === "walk" ? "Caminada popular sobre biodiversitat i plantes aromàtiques del territori. Diumenge 18 d’octubre · 10.00 h." : `Dies: ${record.days?.join(", ")}`;
  const title = record.kind === "lunch" ? "Reserva del dinar · Aplec Iltiŕ 2026" : record.kind === "walk" ? "Inscripció a la caminada · Aplec Iltiŕ 2026" : "Inscripció de voluntariat · Aplec Iltiŕ 2026";
  const participantText = record.kind === "lunch"
    ? `Hem rebut la teva reserva, ${fullName}.\n${detail}${(record.status ?? "pending") === "pending" ? `\n\n${pendingPaymentNotice}` : ""}\n\nTiquet privat (no comparteixis aquest enllaç):\n${base}${ticketLink(record)}`
    : record.kind === "walk" ? `Hola, ${fullName}.\nHem rebut correctament la teva inscripció a la caminada de l’Aplec Iltiŕ 2026.\n${detail}` : `Hola, ${fullName}.\nHem rebut la teva disponibilitat per fer voluntariat a l’Aplec Iltiŕ 2026. L’organització es posarà en contacte amb tu. Encara no tens cap torn assignat.\n${detail}`;
  const notifications = { ...record.notifications };
  const recipient = record.kind === "walk" ? process.env.REGISTRATION_WALK_NOTIFY_EMAIL || "lluis.arambilet@gmail.com" : process.env.REGISTRATION_NOTIFY_EMAIL || "carla@resilience.earth";
  if (notifications.organization !== "sent") notifications.organization = await send(recipient, title, `${fullName}\nCorreu: ${record.email}\nTelèfon: ${record.phone}\n${detail}\n\nAdministració: ${base}/admin#inscripcions-aplec`, `${record.id}-organization`);
  if (notifications.participant !== "sent") notifications.participant = await send(record.email, title, participantText, `${record.id}-participant`);
  try { await updateNotifications(record.kind, record.id, notifications); return true; } catch {
    // The durable record remains pending if the status write fails. Never log PII
    // or turn a successfully saved registration into a public submission error.
    return false;
  }
}
