import Link from "next/link";
import Image from "next/image";
import { GovernanceMap } from "@/components/governance-map";
import { EventCard } from "@/components/event-card";
import { ArrowIcon } from "@/components/icons";
import { GovernanceExplainer } from "@/components/governance-explainer";
import { ManifestoSlider } from "@/components/manifesto-slider";
import { upcomingEvents } from "@/lib/event-utils";
import { getCircles, getEvents } from "@/lib/remote-content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const [circles, events] = await Promise.all([getCircles(), getEvents()]);
  const nextEvents = upcomingEvents(events);
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
    <>
      <section className="hero">
        <div className="hero-media" aria-hidden="true">
          <video
            className="hero-video"
            poster="/images/video-capcalera-aplec-iltir-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
          >
            <source
              src="/images/video-capcalera-aplec-iltir-web.mp4"
              type="video/mp4"
              media="(min-width: 721px) and (prefers-reduced-motion: no-preference)"
            />
          </video>
          <Image
            className="hero-video-poster"
            src="/images/video-capcalera-aplec-iltir-poster.jpg"
            alt=""
            fill
            sizes="100vw"
            priority
          />
        </div>
        <div className="hero-copy">
          <span className="eyebrow hero-places">CABANELLES · LLADÓ · NAVATA</span>
          <h1>Tres pobles,<br />una xarxa viva.</h1>
          <p className="hero-lead">
            Ens organitzem des del territori per guanyar capacitat, autonomia i resiliència. La governança compartida és el camí i l’Aplec és la celebració del procés.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" href="#arquitectura">Descobreix la xarxa <ArrowIcon /></Link>
            <Link className="text-link" href="/agenda">Veure les properes trobades <span>↗</span></Link>
          </div>
        </div>
      </section>

      <section className="aplec-overview">
        <div className="aplec-overview-main">
          <div className="aplec-overview-heading">
            <span className="eyebrow">Què és l’Aplec?</span>
            <h2>L’Aplec Iltiŕ</h2>
            <p>
              Una trobada per compartir les propostes de resiliència que es treballen des dels pobles, compartir aprenentatges, expressar el vincle amb el territori i celebrar la cultura arrelada al lloc.
            </p>
          </div>
          <div className="aplec-symbol-card" aria-hidden="true">
            <Image
              src="/images/iltir-symbol.png"
              alt=""
              width={900}
              height={897}
              sizes="(max-width: 720px) 160px, 260px"
            />
          </div>
        </div>
        <div className="aplec-principles" aria-label="Principis de l’Aplec Iltiŕ">
          {[
            {
              number: "01",
              title: "DEMOCRÀCIA",
              text: "Crear condicions perquè la comunitat pugui orientar, decidir i assumir responsabilitats sobre allò que afecta la vida del poble.",
            },
            {
              number: "02",
              title: "REGENERACIÓ",
              text: "Augmentar la vitalitat del territori: cuidar relacions, sòls, aigua, cultura i capacitat d’organitzar-nos.",
            },
            {
              number: "03",
              title: "BIOREGIÓ",
              text: "Llegir els pobles com a part d’un mateix sistema viu, on paisatge, economia, cultura i ecologia es condicionen mútuament.",
            },
          ].map(({ number, title, text }) => (
            <article key={title}>
              <span>{number}</span>
              <strong>{title}</strong>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <ManifestoSlider />

      <section id="arquitectura" className="architecture section-shell">
        <div className="section-heading architecture-heading">
          <div><span className="eyebrow">Com ens organitzem</span><h2>Una estructura adaptativa per a una realitat complexa</h2></div>
          <div className="architecture-summary">
            <span>Una xarxa adaptativa</span>
            <p>Cada poble treballa els seus propis reptes i es coordina amb els altres quan compartir informació o actuar plegats pot reforçar el procés.</p>
          </div>
        </div>
        <GovernanceExplainer />
        <GovernanceMap circles={circles} />
      </section>

      <section className="principles section-shell">
        <div className="section-heading compact-heading">
          <div><span className="eyebrow">La manera de fer</span><h2>Arrels locals,<br />mirada bioregional.</h2></div>
        </div>
        <aside className="word-origin">
          <span className="word-origin-mark word-origin-symbol" aria-hidden="true">
            <Image src="/images/iltir-symbol.png" alt="" width={900} height={897} />
          </span>
          <div>
            <span className="eyebrow">D’on ve el nom?</span>
            <h3>Iltiŕ, poble o comunitat.</h3>
            <p>
              Iltiŕ és una paraula d’origen iber. Segons la interpretació que
              ens va compartir l’Institut d’Estudis Íbers, podria haver
              significat «poble» o «comunitat»: una manera de posar al centre
              les persones i el territori que compartim.
            </p>
          </div>
        </aside>
      </section>

      <section className="upcoming section-shell">
        <div className="section-heading">
          <div><span className="eyebrow">Agenda oberta</span><h2>On ens trobem?</h2></div>
          <Link className="text-link" href="/agenda">Veure tota l’agenda <ArrowIcon /></Link>
        </div>
        <div className="agenda-grid">
          {nextEvents.slice(0, 3).map((event) => <EventCard key={event.id} event={event} />)}
        </div>
        {latestDocuments.length > 0 && (
          <div className="latest-documents">
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
          </div>
        )}
      </section>

      <section className="closing-cta">
        <span className="eyebrow light">La xarxa creix quan hi entres</span>
        <h2>Hi ha moltes maneres<br />de fer territori.</h2>
        <p>Troba el cercle que et mou, consulta què s’hi està treballant i suma’t a la conversa.</p>
        <Link className="button button-light" href="#arquitectura">Explora els cercles <ArrowIcon /></Link>
      </section>
    </>
  );
}
