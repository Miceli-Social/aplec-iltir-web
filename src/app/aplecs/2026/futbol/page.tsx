import type { Metadata } from "next";
import Link from "next/link";
import { RegistrationForm } from "@/components/aplec-2026-registration-form";

export const metadata: Metadata = {
  title: "Inscripció al Torneig de Futbol ILTIŔ · Aplec Iltiŕ 2026",
  robots: { index: false, follow: false },
};

export default function FootballPage() {
  return (
    <article className="aplec-2026-form-page aplec-2026-football-page section-shell">
      <Link className="text-link" href="/aplecs/2026">
        ← Torna a la programació
      </Link>

      <header>
        <span className="eyebrow">Aplec Iltiŕ 2026 · Inscripció prèvia</span>
        <h1>Inscripció al Torneig de Futbol ILTIŔ</h1>
        <h2>Benvinguts al primer Torneig de Futbol ILTIŔ!</h2>
        <p>Aquest torneig busca reivindicar el rol d’unió i la importància que té aquest esport al territori de Lladó, Navata i Cabanelles. Coincidint amb el 90è aniversari de la Unió Esportiva Lladó i la voluntat de l’entitat de renovar el camp, tots els beneficis de l’activitat serviran a aquest propòsit.</p>
        <p>El torneig serà de futbol 5 i de caire festiu.</p>
        <h2>Requisits per formar un equip:</h2>
        <ol>
          <li>Un mínim de 5 persones majors de 16 anys i un màxim de 8.</li>
          <li>Tenir a l’equip representació de dos dels tres pobles: Cabanelles, Lladó o Navata.</li>
        </ol>
        <p>Ens veiem el dia <strong>16 d’octubre de 20 h a 22 h al camp de futbol de la UE Lladó</strong>.</p>
        <p>La inscripció és de <strong>3 € per participant</strong> i inclou l’assegurança i el sopar.</p>
      </header>

      <RegistrationForm kind="football" />
    </article>
  );
}