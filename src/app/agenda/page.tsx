import type { Metadata } from "next";
import Link from "next/link";
import { AgendaFilter } from "@/components/agenda-filter";
import { getCircles, getEvents } from "@/lib/remote-content";

export const metadata: Metadata = {
  title: "Agenda oberta",
  description:
    "Trobades, sessions de treball i actes de la xarxa Iltiŕ.",
};
export const revalidate = 300;

export default async function AgendaPage() {
  const [circles, events] = await Promise.all([getCircles(), getEvents()]);
  const isPublicActa = (title: string, url: string) => {
    const text = `${title} ${url}`
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
    return ![
      "proteccio-de-dades",
      "proteccio de dades",
      "drets-imatge",
      "drets d'imatge",
      "drets imatge",
      "totes les actes",
    ].some((blocked) => text.includes(blocked));
  };
  const latestDocuments = circles
    .flatMap((circle) =>
      circle.documents
        .filter((document) => isPublicActa(document.title, document.url))
        .map((document) => ({
          ...document,
          circleName: circle.name,
          circleSlug: circle.slug,
        })),
    )
    .reverse()
    .slice(0, 4);

  return (
    <main className="inner-page agenda-page">
      <header className="page-intro">
        <span className="eyebrow">Agenda oberta</span>
        <h1>On ens trobem?</h1>
        <p>
          Reunions obertes, sessions de treball i moments per pensar i actuar plegats.
        </p>
      </header>

      <AgendaFilter events={events} />

      {!process.env.GOOGLE_CALENDAR_ICS_URL && (
        <p className="demo-note">
          Agenda de mostra. Connecteu `GOOGLE_CALENDAR_ICS_URL` per publicar les dates reals.
        </p>
      )}

      {latestDocuments.length > 0 && (
        <section className="latest-documents">
          <div className="latest-documents-heading">
            <span className="eyebrow">Últimes notícies</span>
            <h3>Últimes actes penjades</h3>
          </div>
          <div className="latest-documents-list">
            {latestDocuments.map((document) => (
              <Link href={document.url} target="_blank" rel="noreferrer" key={`${document.circleSlug}-${document.url}`}>
                <span>
                  <strong>{document.title}</strong>
                  <small>{document.circleName}</small>
                </span>
                <span aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
