import { json, privateHeaders, readBody } from "@/lib/aplec-2026-registration-http";
import { readTicket } from "@/lib/aplec-2026-registration-store";
import { createTicketPdf } from "@/lib/aplec-2026-ticket-pdf";
export const runtime = "nodejs";
export async function POST(request: Request) {
  let body;
  try { body = await readBody(request); } catch { return json({ message: "Enllaç no vàlid." }, 400); }
  try {
    const ticket = await readTicket(String(body.id || ""), String(body.token || ""));
    if (!ticket) return json({ message: "No s’ha trobat el tiquet o l’enllaç no és vàlid." }, 404);
    if (body.format === "pdf") return new Response(Buffer.from(await createTicketPdf(ticket)), { headers: { ...privateHeaders, "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="${ticket.id}.pdf"` } });
    return json({ ticket });
  } catch { return json({ message: "No s’ha pogut recuperar el tiquet. Torna-ho a provar." }, 503); }
}
