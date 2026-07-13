import type { Metadata } from "next";
import { AgendaFilter } from "@/components/agenda-filter";
import { getEvents } from "@/lib/remote-content";

export const metadata: Metadata = { title: "Agenda" };
export const revalidate = 300;

export default async function AgendaPage() {
  const events = await getEvents();
  return (
    <div className="inner-page">
      <header className="page-intro">
        <span className="eyebrow">Agenda compartida</span>
        <h1>La xarxa es troba aquí.</h1>
        <p>Reunions obertes, sessions de treball i moments per pensar i actuar plegats.</p>
      </header>
      <AgendaFilter events={events} />
      {!process.env.GOOGLE_CALENDAR_ICS_URL && <p className="demo-note">Agenda de mostra. Connecteu `GOOGLE_CALENDAR_ICS_URL` per publicar les dates reals.</p>}
    </div>
  );
}
