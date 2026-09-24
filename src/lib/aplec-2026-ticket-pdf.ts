import "server-only";
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ticketHeadings, pendingPaymentNotice, type Ticket } from "./aplec-2026-registration";

export async function createTicketPdf(ticket: Ticket) {
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  const font = await pdf.embedFont(await readFile(join(process.cwd(), "src/assets/fonts/LiberationSans-Regular.ttf")), { subset: true });
  const page = pdf.addPage([595, 842]);
  const ink = rgb(0.09, 0.23, 0.2);
  page.drawRectangle({ x: 0, y: 0, width: 595, height: 842, color: rgb(0.96, 0.94, 0.9) });
  let y = 785;
  function line(text: string, size = 13) {
    // Wrap even long unbroken names; never clip or lose a surname.
    let current = "";
    for (const word of text.split(" ")) {
      const candidate = current ? `${current} ${word}` : word;
      if (font.widthOfTextAtSize(candidate, size) <= 495) { current = candidate; continue; }
      if (current) { page.drawText(current, { x: 50, y, size, font, color: ink }); y -= size + 7; }
      current = "";
      for (const character of word) {
        if (font.widthOfTextAtSize(current + character, size) > 495) { page.drawText(current, { x: 50, y, size, font, color: ink }); y -= size + 7; current = ""; }
        current += character;
      }
    }
    if (current) { page.drawText(current, { x: 50, y, size, font, color: ink }); y -= size + 7; }
    y -= 9;
  }
  line(ticketHeadings[ticket.status ?? "pending"], 16);
  line("Aplec Iltiŕ 2026", 28); line("Dinar popular", 22);
  line("Diumenge 18 d’octubre de 2026"); line("14.30 h · Sala de Cabanelles");
  line(`Número de reserva: ${ticket.id}`, 15);
  line(`Nom: ${ticket.firstName} ${ticket.lastName}`);
  line(`Nombre total de persones: ${ticket.people}`);
  line(`Nombre de menús vegetarians: ${ticket.vegetarian}`);
  line("15 € per persona — pendent de confirmació");
  y -= 12;
  if ((ticket.status ?? "pending") === "pending") line(pendingPaymentNotice, 16);
  pdf.setTitle(`Reserva ${ticket.id} · Aplec Iltiŕ 2026`);
  return pdf.save();
}
