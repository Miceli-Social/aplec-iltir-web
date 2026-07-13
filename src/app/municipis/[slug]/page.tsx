import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CircleLink } from "@/components/circle-link";
import { EventCard } from "@/components/event-card";
import { ArrowIcon } from "@/components/icons";
import { getMunicipality, municipalities } from "@/lib/content";
import { upcomingEvents } from "@/lib/event-utils";
import { getCircles, getEvents } from "@/lib/remote-content";

export const revalidate = 300;

export function generateStaticParams() {
  return municipalities.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const municipality = getMunicipality((await params).slug);
  return municipality ? { title: municipality.name, description: municipality.intro } : {};
}

export default async function MunicipalityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const municipality = getMunicipality(slug);
  if (!municipality) notFound();
  const [circles, events] = await Promise.all([getCircles(), getEvents()]);
  const localCircles = circles.filter((circle) => circle.municipality === municipality.slug);
  const localEvents = upcomingEvents(events.filter((event) => event.tags.includes(municipality.slug)));

  return (
    <div className={`inner-page municipality-page municipality-${municipality.slug}`}>
      <div className="breadcrumb"><Link href="/">Iltiŕ</Link><span>/</span><span>{municipality.name}</span></div>
      <header className="page-intro wide">
        <span className="eyebrow">Consell de Poble</span>
        <h1>{municipality.name}</h1>
        <p>{municipality.intro}</p>
      </header>
      <section className="detail-grid">
        <div><span className="eyebrow">Com s’organitza</span><h2>Un lloc per compartir què passa i treballar plegats.</h2></div>
        <ul className="focus-list">{municipality.councilFocus.map((item) => <li key={item}>{item}</li>)}</ul>
      </section>
      <section className="page-section">
        <div className="section-heading"><div><span className="eyebrow">Cercles locals</span><h2>On passen les coses.</h2></div></div>
        <div className="circle-detail-grid">{localCircles.map((circle) => <CircleLink key={circle.slug} circle={circle} />)}</div>
      </section>
      <section className="page-section">
        <div className="section-heading"><div><span className="eyebrow">Properes trobades</span><h2>Agenda de {municipality.name}</h2></div><Link className="text-link" href="/agenda">Agenda completa <ArrowIcon /></Link></div>
        <div className="agenda-grid">
          {localEvents.length ? localEvents.map((event) => <EventCard key={event.id} event={event} />) : <p className="empty-state">Encara no hi ha cap propera trobada publicada.</p>}
        </div>
      </section>
    </div>
  );
}
