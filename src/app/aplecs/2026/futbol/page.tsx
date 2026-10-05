import type { Metadata } from "next";
import Link from "next/link";
import { RegistrationForm } from "@/components/aplec-2026-registration-form";

export const metadata: Metadata = {
  title: "Inscripció al Torneig de Futbol ILTIŔ · Aplec Iltiŕ 2026",
  robots: { index: false, follow: false },
};

export default function FootballPage() {
  return (
    <article className="aplec-2026-form-page section-shell">
      <Link className="text-link" href="/aplecs/2026">
        ← Torna a la programació
      </Link>

      <header>
        <span className="eyebrow">Aplec Iltiŕ 2026 · Inscripció prèvia</span>
        <h1>Inscripció al Torneig de Futbol ILTIŔ</h1>
        <p>
          <strong>Divendres 16 d’octubre · 20.00 h</strong>
        </p>
        <p>Inscripció individual per jugador.</p>
      </header>

      <RegistrationForm kind="football" />
    </article>
  );
}