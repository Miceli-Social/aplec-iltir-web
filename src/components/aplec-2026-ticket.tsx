"use client";
import { useEffect, useState } from "react";
import { ticketHeadings, pendingPaymentNotice, type Ticket } from "@/lib/aplec-2026-registration";
export function LunchTicket() {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  function credentials() { const [id, token] = window.location.hash.slice(1).split("/"); return { id, token }; }
  useEffect(() => {
    const controller = new AbortController();
    void fetch("/api/aplec-2026/ticket", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(credentials()), signal: controller.signal }).then(async response => {
      const data = await response.json(); if (!response.ok) throw new Error(data.message); setTicket(data.ticket);
    }).catch(error => { if (!controller.signal.aborted) setError(error instanceof Error ? error.message : "No s’ha pogut recuperar el tiquet."); });
    return () => controller.abort();
  }, []);
  async function download() {
    setPending(true); setError("");
    try {
      const response = await fetch("/api/aplec-2026/ticket", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...credentials(), format: "pdf" }) });
      if (!response.ok) throw new Error("No s’ha pogut descarregar el PDF. Torna-ho a provar.");
      const url = URL.createObjectURL(await response.blob()); const link = document.createElement("a"); link.href = url; link.download = `${ticket!.id}.pdf`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (error) { setError(error instanceof Error ? error.message : "No s’ha pogut descarregar el PDF."); }
    finally { setPending(false); }
  }
  return <>
    {error && <p role="alert">{error}</p>}
    {!ticket && !error && <p role="status">Carregant el tiquet…</p>}
    {ticket && <><section className="aplec-2026-ticket">
      <p className="aplec-2026-ticket-warning">{ticketHeadings[ticket.status ?? "pending"]}</p>
      <h2>Aplec Iltiŕ 2026 · Dinar popular</h2><p>Diumenge 18 d’octubre de 2026<br />14.30 h · Sala de Cabanelles</p>
      <dl><dt>Número de reserva</dt><dd>{ticket.id}</dd><dt>Nom</dt><dd>{ticket.firstName} {ticket.lastName}</dd><dt>Nombre total de persones</dt><dd>{ticket.people}</dd><dt>Menús vegetarians</dt><dd>{ticket.vegetarian}</dd></dl>
      <p>15 € per persona — pendent de confirmació</p>
      {(ticket.status ?? "pending") === "pending" && <p><strong>{pendingPaymentNotice}</strong></p>}
    </section><button className="button button-primary" onClick={download} disabled={pending}>{pending ? "Preparant el PDF…" : "Descarrega el tiquet PDF"}</button><p>Desa aquest enllaç privat o el PDF. No comparteixis l’enllaç: dona accés a les dades del teu tiquet.</p></>}
  </>;
}
