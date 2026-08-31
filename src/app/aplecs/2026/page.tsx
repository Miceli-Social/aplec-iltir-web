import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aplec Iltiŕ 2026",
  description:
    "L’Aplec Iltiŕ 2026 se celebrarà el 16, 17 i 18 d’octubre a Cabanelles, Navata i Lladó.",
};

export default function Aplec2026Page() {
  return (
    <article className="aplec-2026-page">
      <header className="aplec-2026-hero">
        <div className="aplec-2026-hero-copy">
          <span className="eyebrow light">La trobada dels pobles</span>
          <h1>Aplec Iltiŕ <em>2026</em></h1>
          <div className="aplec-2026-when">
            <p>16 · 17 · 18</p>
            <span>d’octubre de 2026</span>
          </div>
          <p className="aplec-2026-where">Cabanelles · Navata · Lladó</p>
        </div>
        <div className="aplec-2026-intro">
          <span aria-hidden="true">Iltiŕ</span>
          <p>
            Una trobada per compartir les propostes de resiliència que es
            treballen des dels pobles, generar aprenentatges, expressar el
            vincle amb el territori i celebrar la cultura arrelada al lloc.
          </p>
        </div>
      </header>

      <section
        className="aplec-2026-poster section-shell"
        aria-labelledby="aplec-2026-poster-title"
      >
        <div className="aplec-2026-section-heading">
          <span className="eyebrow">01 · Imatge de l’edició</span>
          <h2 id="aplec-2026-poster-title">Cartell oficial</h2>
        </div>
        <div className="aplec-2026-poster-frame" aria-label="Cartell oficial, properament">
          <div className="aplec-2026-poster-mark" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <p>Properament</p>
          <span>El cartell de l’Aplec Iltiŕ 2026 es publicarà aquí.</span>
        </div>
      </section>

      <section
        className="aplec-2026-program"
        aria-labelledby="aplec-2026-program-title"
      >
        <div className="aplec-2026-program-inner">
          <div className="aplec-2026-section-heading aplec-2026-program-heading">
            <span className="eyebrow light">02 · Tres dies de trobada</span>
            <h2 id="aplec-2026-program-title">Programa de l’Aplec</h2>
          </div>
          <div className="aplec-2026-program-state">
            <span className="aplec-2026-coming">Properament</span>
            <p>
              Estem acabant de preparar el programa dels tres dies. Ben aviat
              podràs consultar aquí totes les activitats.
            </p>
          </div>
          <div className="aplec-2026-days" aria-label="Dies del programa">
            <div><span>Divendres</span><strong>16</strong></div>
            <div><span>Dissabte</span><strong>17</strong></div>
            <div><span>Diumenge</span><strong>18</strong></div>
          </div>
        </div>
      </section>
    </article>
  );
}
