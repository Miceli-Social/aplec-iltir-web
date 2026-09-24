import type { Metadata } from "next";
import Image from "next/image";
import { aplec2026Program, aplec2026OtherActivities, volunteerRegistration, type ProgramRegistration } from "@/lib/aplec-2026-program";

function RegistrationNotice({ registration }: { registration: ProgramRegistration }) {
  return (
    <div className="aplec-2026-registration">
      {registration.url ? (
        <a href={registration.url}>{registration.label}</a>
      ) : (
        <strong>{registration.label}</strong>
      )}
      <p>{registration.information}</p>
    </div>
  );
}

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
        <a
          className="aplec-2026-poster-frame"
          href="/images/aplec-iltir-2026-cartell.png"
          aria-label="Obre el cartell oficial de l’Aplec Iltiŕ 2026 a mida completa"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/images/aplec-iltir-2026-cartell.png"
            alt="Cartell oficial de l’Aplec Iltiŕ 2026, del 16 al 18 d’octubre a Cabanelles, Navata i Lladó"
            width={1080}
            height={1350}
            sizes="(max-width: 720px) calc(100vw - 32px), (max-width: 1050px) calc((100vw - 98px) * 0.675), (max-width: 1240px) calc((91vw - 48px) * 0.64), 620px"
          />
        </a>
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
          <nav className="aplec-2026-day-links" aria-label="Dies del programa">
            {aplec2026Program.map((day) => (
              <a key={day.id} href={`#${day.id}`}>{day.heading}</a>
            ))}
          </nav>
          {aplec2026Program.map((day) => (
            <section className="aplec-2026-day" key={day.id} aria-labelledby={day.id}>
              <h3 id={day.id}>{day.heading}</h3>
              <ol className="aplec-2026-activities">
                {day.activities.map((activity) => (
                  <li className="aplec-2026-activity" key={`${activity.time}-${activity.title}`}>
                    <p className="aplec-2026-activity-time">{activity.time}</p>
                    <div className="aplec-2026-activity-body">
                      <h4>{activity.title}</h4>
                      {activity.location && <p className="aplec-2026-activity-location">{activity.location}</p>}
                      {activity.information && <p className="aplec-2026-activity-copy">{activity.information}</p>}
                      {activity.status && <p className="aplec-2026-activity-status">{activity.status}</p>}
                      {activity.moreInfo && (
                        <details className="aplec-2026-details">
                          <summary aria-label={`Més informació sobre ${activity.title}`}>Més informació</summary>
                          <p className="aplec-2026-activity-copy">{activity.moreInfo}</p>
                        </details>
                      )}
                      {activity.registration && <RegistrationNotice registration={activity.registration} />}
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          ))}
          <section className="aplec-2026-other-activities" aria-labelledby="aplec-2026-other-title">
            <h3 id="aplec-2026-other-title">Altres activitats…</h3>
            {aplec2026OtherActivities.map(activity => (
              <article key={activity.title}>
                <p><strong>{activity.date} · {activity.time}</strong></p>
                <h4>{activity.title}</h4>
                <p>{activity.location}</p>
              </article>
            ))}
          </section>
        </div>
      </section>
      <section className="aplec-2026-volunteer section-shell" aria-labelledby="aplec-2026-volunteer-title">
        <div className="aplec-2026-section-heading">
          <span className="eyebrow">03 · Fem l’Aplec plegats</span>
          <h2 id="aplec-2026-volunteer-title">Suma’t al voluntariat</h2>
        </div>
        <div>
          <p>Necessitem persones voluntàries els dies 16, 17 i 18 d’octubre a Lladó, Navata i Cabanelles. Ajuda’ns a fer possible la trobada dels pobles.</p>
          <RegistrationNotice registration={volunteerRegistration} />
        </div>
      </section>
    </article>
  );
}
