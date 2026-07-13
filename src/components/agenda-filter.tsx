"use client";

import { useMemo, useState } from "react";
import { EventCard } from "@/components/event-card";
import { pastEvents, upcomingEvents } from "@/lib/event-utils";
import type { CalendarEvent } from "@/lib/types";

const filters = [
  ["tots", "Tot"],
  ["cabanelles", "Cabanelles"],
  ["llado", "Lladó"],
  ["navata", "Navata"],
  ["sectorial", "Sectorials"],
] as const;

export function AgendaFilter({ events }: { events: CalendarEvent[] }) {
  const [filter, setFilter] = useState("tots");
  const visible = useMemo(
    () => filter === "tots" ? events : events.filter((event) => event.tags.includes(filter)),
    [events, filter],
  );
  const future = useMemo(() => upcomingEvents(visible), [visible]);
  const past = useMemo(() => pastEvents(visible), [visible]);

  return (
    <>
      <div className="filter-bar" role="group" aria-label="Filtra l’agenda">
        {filters.map(([value, label]) => (
          <button key={value} className={filter === value ? "active" : ""} onClick={() => setFilter(value)}>{label}</button>
        ))}
      </div>

      <section className="agenda-block">
        <div className="section-heading compact-heading">
          <div><span className="eyebrow">Properes trobades</span><h2>El que ve ara</h2></div>
        </div>
        <div className="agenda-grid">
          {future.length ? future.map((event) => <EventCard key={event.id} event={event} />) : <p className="empty-state">No hi ha properes trobades programades en aquest àmbit.</p>}
        </div>
      </section>

      <section className="agenda-block past-agenda-block">
        <div className="section-heading compact-heading">
          <div><span className="eyebrow">Totes les trobades</span><h2>Històric</h2></div>
        </div>
        <div className="agenda-grid">
          {past.length ? past.map((event) => <EventCard key={event.id} event={event} />) : <p className="empty-state">Encara no hi ha trobades passades en aquest àmbit.</p>}
        </div>
      </section>
    </>
  );
}
