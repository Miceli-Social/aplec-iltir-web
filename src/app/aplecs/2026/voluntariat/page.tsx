import type { Metadata } from "next";
import Link from "next/link";
import { RegistrationForm } from "@/components/aplec-2026-registration-form";
export const metadata: Metadata = { title: "Voluntariat · Aplec Iltiŕ 2026" };
export default function VolunteerPage() {
  return <article className="aplec-2026-form-page section-shell">
    <Link className="text-link" href="/aplecs/2026">← Torna a la programació</Link>
    <header><span className="eyebrow">Aplec Iltiŕ 2026 · Fem l’Aplec plegats</span><h1>Participa com a voluntari/ària</h1><p>Necessitem persones voluntàries els dies 16, 17 i 18 d’octubre a Lladó, Navata i Cabanelles. Comparteix la teva disponibilitat i l’organització es posarà en contacte amb tu.</p></header>
    <RegistrationForm kind="volunteers" />
  </article>;
}
