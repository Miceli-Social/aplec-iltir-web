import type { CalendarEvent } from "@/lib/types";

const DAY_MS = 24 * 60 * 60 * 1000;

const eventEndTime = (event: CalendarEvent) => {
  if (event.end) return new Date(event.end).getTime();
  const start = new Date(event.start).getTime();
  return event.allDay ? start + DAY_MS : start;
};

export const isUpcomingEvent = (event: CalendarEvent, now = new Date()) =>
  eventEndTime(event) >= now.getTime();

export const sortEventsByStart = (events: CalendarEvent[]) =>
  [...events].sort((first, second) => first.start.localeCompare(second.start));

export const upcomingEvents = (events: CalendarEvent[], now = new Date()) =>
  sortEventsByStart(events.filter((event) => isUpcomingEvent(event, now)));

export const pastEvents = (events: CalendarEvent[], now = new Date()) =>
  sortEventsByStart(events.filter((event) => !isUpcomingEvent(event, now))).reverse();
