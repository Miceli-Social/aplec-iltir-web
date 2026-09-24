import type { Metadata } from "next";
import Link from "next/link";
import { RegistrationForm } from "@/components/aplec-2026-registration-form";

export const metadata: Metadata = {
  title: "Inscripció a la caminada · Aplec Iltiŕ 2026",
  robots: { index: false, follow: false },
};

export default function WalkPage() {
  return <article className="aplec-2026-form-page section-shell">
    <Link className="text-link" href="/aplecs/2026">← Torna a la programació</Link>
    <header>
      <span className="eyebrow">Aplec Iltiŕ 2026 · Inscripció prèvia</span>
      <h1>Inscripció a la caminada</h1>
      <p><strong>Diumenge 18 d’octubre · 10.00 h</strong></p>
      <p>Caminada popular sobre biodiversitat i plantes aromàtiques del territori.</p>
    </header>
    <RegistrationForm kind="walk" />
  </article>;
}
