import Link from "next/link";
import type { CalendarEvent } from "@/lib/types";
import { CalendarIcon, PinIcon } from "@/components/icons";
import { eventDateTimeFormatter, eventDayFormatter } from "@/lib/date-time";

export function EventCard({ event }: { event: CalendarEvent }) {
  const content = (
    <>
      <div className="event-date"><CalendarIcon /><span>{event.allDay ? eventDayFormatter.format(new Date(event.start)) : eventDateTimeFormatter.format(new Date(event.start))}</span></div>
      <h3>{event.title}</h3>
      {event.location && <p><PinIcon />{event.location}</p>}
      <div className="event-tags">{event.tags.slice(0, 3).map((tag) => <span key={tag}>{tag.replaceAll("-", " ")}</span>)}</div>
    </>
  );
  return event.circleSlug ? <Link href={`/cercles/${event.circleSlug}`} className="event-card">{content}</Link> : <article className="event-card">{content}</article>;
}
