import type { Metadata } from "next";
import Link from "next/link";
import { RegistrationForm } from "@/components/aplec-2026-registration-form";
export const metadata: Metadata = { title: "Reserva del dinar · Aplec Iltiŕ 2026" };
export default function LunchPage() {
  return <article className="aplec-2026-form-page section-shell">
    <Link className="text-link" href="/aplecs/2026">← Torna a la programació</Link>
    <header><span className="eyebrow">Aplec Iltiŕ 2026 · Dinar popular</span><h1>Reserva el dinar</h1><p><strong>Diumenge 18 d’octubre de 2026 · 14.30 h · Sala de Cabanelles</strong></p></header>
    <div className="aplec-2026-registration">
      <p>Paella de mar i muntanya amb trompetes de la mort, aigua i vi, amb postres de Làctics Tramuntana, elaborada per Cuinats Siseta. Hi haurà menú de paella de mar i muntanya i opció vegetariana.</p>
      <p><strong>Preu previst: 15 € per persona — pendent de confirmació.</strong></p>
      <p>Aforament màxim: 120 persones. Es pot reservar fins al dissabte 17 d’octubre de 2026, sempre que quedin places. Venda física de tiquets a la Sala de Cabanelles.</p>
      <p><strong>La reserva online NO implica pagament. La reserva queda pendent de pagament.</strong> L’import s’haurà d’abonar segons les indicacions de l’organització.</p>
    </div>
    <RegistrationForm kind="lunch" />
  </article>;
}
