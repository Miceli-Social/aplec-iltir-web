import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EventCard } from "@/components/event-card";
import { WhatsappButton } from "@/components/whatsapp-button";
import { fallbackCircles, municipalities } from "@/lib/content";
import { upcomingEvents } from "@/lib/event-utils";
import { getCircles, getEvents, hiddenPublicCircleSlugs } from "@/lib/remote-content";

export const revalidate = 300;

export function generateStaticParams() {
  return fallbackCircles
    .filter(({ slug }) => !hiddenPublicCircleSlugs.has(slug))
    .map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const circle = (await getCircles()).find((item) => item.slug === slug);
  return circle ? { title: circle.name, description: circle.summary } : {};
}

export default async function CirclePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [circles, events] = await Promise.all([getCircles(), getEvents()]);
  const circle = circles.find((item) => item.slug === slug);
  if (!circle) notFound();
  const municipality = municipalities.find((item) => item.slug === circle.municipality);
  const linked = circles.filter((item) => circle.linkedCircleSlugs?.includes(item.slug));
  const circleEvents = upcomingEvents(events.filter((event) => event.circleSlug === circle.slug));
  const hideParticipation = ["llado-coordinacio", "cabanelles-coordinacio"].includes(circle.slug);

  return (
    <div className={`inner-page circle-page theme-page-${circle.theme}`}>
      <div className="breadcrumb"><Link href="/">Iltiŕ</Link><span>/</span>{municipality && <><Link href={`/municipis/${municipality.slug}`}>{municipality.name}</Link><span>/</span></>}<span>{circle.shortName}</span></div>
      <header className={`circle-hero ${hideParticipation ? "circle-hero-closed" : ""}`}>
        <div>
          <span className="eyebrow">{circle.kind === "local" ? `Cercle local · ${municipality?.name}` : "Sectorial de l’Aplec"}</span>
          <h1>{circle.shortName}</h1>
          <p>{circle.summary}</p>
        </div>
        {!hideParticipation && (
          <div className="circle-participate">
            <p>Aquest cercle és obert. Entra al grup per seguir la conversa i participar en les properes trobades.</p>
            <WhatsappButton
              url={circle.whatsappUrl}
              active={circle.whatsappActive}
              circleSlug={circle.slug}
              circleName={circle.name}
            />
          </div>
        )}
      </header>
      <section className="purpose-block"><span className="eyebrow light">El propòsit</span><blockquote>{circle.purpose}</blockquote></section>
      {circle.slug === "sectorial-cultura" && (
        <figure className="culture-feature">
          <Image
            src="/images/cultura-popular-llado.jpg"
            alt="Trobada de cultura popular a Lladó"
            width={1800}
            height={1200}
            sizes="(max-width: 720px) calc(100vw - 32px), 1200px"
          />
          <figcaption>
            <span className="eyebrow">Cultura arrelada al lloc</span>
            <p>La cultura com a vincle viu: memòria, festa, pràctica compartida i capacitat de trobar-nos al territori.</p>
          </figcaption>
        </figure>
      )}
      <section className="detail-columns">
        <div><span className="eyebrow">En què estem</span><h2>Treball obert</h2><ul className="focus-list">{circle.workingOn.map((item) => <li key={item}>{item}</li>)}</ul></div>
        <div><span className="eyebrow">Què ve ara</span><h2>Propers passos</h2><ol className="steps-list">{circle.nextSteps.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span>{item}</li>)}</ol></div>
      </section>
      <section className="page-section">
        <div className="section-heading"><div><span className="eyebrow">Agenda</span><h2>Properes trobades</h2></div></div>
        <div className="agenda-grid">
          {circleEvents.length ? circleEvents.map((event) => <EventCard key={event.id} event={event} />) : <p className="empty-state">Encara no hi ha cap propera trobada publicada per aquest cercle.</p>}
        </div>
      </section>
      <section className="page-section documents-section">
        <div><span className="eyebrow">Transparència</span><h2>Actes i documents</h2><p>Materials públics per seguir el procés i entendre què s’ha treballat.</p></div>
        <div className="documents-list">
          {circle.documents.length ? circle.documents.map((document) => <a key={document.url} href={document.url} target="_blank" rel="noreferrer"><span>{document.title}</span><span>Obrir ↗</span></a>) : <p className="empty-state">Encara no hi ha documents públics en aquest espai.</p>}
        </div>
      </section>
      {linked.length > 0 && <section className="linked-section"><span className="eyebrow">Una xarxa, dues escales</span><h2>{circle.kind === "local" ? "Connectat amb la mirada territorial." : "Connectat amb cada poble."}</h2><div className="linked-grid">{linked.map((item) => <Link key={item.slug} href={`/cercles/${item.slug}`}>{item.name}<span>→</span></Link>)}</div></section>}
    </div>
  );
}
