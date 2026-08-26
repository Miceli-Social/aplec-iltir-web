"use client";

import { useMemo, useState } from "react";
import type { CalendarEvent } from "@/lib/types";
import { SITE_TIME_ZONE } from "@/lib/date-time";

const weekdayLabels = ["Dl", "Dt", "Dc", "Dj", "Dv", "Ds", "Dg"];

const monthFormatter = new Intl.DateTimeFormat("ca-ES", {
  timeZone: SITE_TIME_ZONE,
  month: "long",
});

const dayKeyFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: SITE_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const timeFormatter = new Intl.DateTimeFormat("ca-ES", {
  timeZone: SITE_TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const longDayFormatter = new Intl.DateTimeFormat("ca-ES", {
  timeZone: "UTC",
  weekday: "long",
  day: "numeric",
  month: "long",
});

type CalendarDay = {
  date: Date;
  key: string;
  day: number;
  inMonth: boolean;
};

const dateKey = (date: Date) => dayKeyFormatter.format(date);

const utcDateKey = (date: Date) =>
  `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;

const currentMonth = () => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: SITE_TIME_ZONE,
    year: "numeric",
    month: "numeric",
  }).formatToParts(new Date());
  return {
    year: Number(parts.find((part) => part.type === "year")?.value),
    month: Number(parts.find((part) => part.type === "month")?.value) - 1,
  };
};

const buildMonthDays = (year: number, month: number): CalendarDay[] => {
  const firstDay = new Date(Date.UTC(year, month, 1, 12));
  const mondayOffset = (firstDay.getUTCDay() + 6) % 7;
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0, 12)).getUTCDate();
  const cellCount = Math.ceil((mondayOffset + daysInMonth) / 7) * 7;

  return Array.from({ length: cellCount }, (_, index) => {
    const date = new Date(Date.UTC(year, month, index - mondayOffset + 1, 12));
    return {
      date,
      key: utcDateKey(date),
      day: date.getUTCDate(),
      inMonth: date.getUTCMonth() === month,
    };
  });
};

function CalendarEventItem({ event }: { event: CalendarEvent }) {
  return (
    <article className="monthly-calendar-event">
      <time dateTime={event.start}>
        {event.allDay ? "Hora pendent" : timeFormatter.format(new Date(event.start))}
      </time>
      <span>{event.title}</span>
    </article>
  );
}

export function MonthlyCalendar({ events }: { events: CalendarEvent[] }) {
  const todayMonth = currentMonth();
  const [view, setView] = useState(todayMonth);
  const todayKey = dateKey(new Date());
  const days = useMemo(() => buildMonthDays(view.year, view.month), [view]);
  const eventsByDay = useMemo(() => {
    const grouped = new Map<string, CalendarEvent[]>();
    events.forEach((event) => {
      const key = dateKey(new Date(event.start));
      grouped.set(key, [...(grouped.get(key) || []), event]);
    });
    grouped.forEach((dayEvents) =>
      dayEvents.sort((first, second) => first.start.localeCompare(second.start)),
    );
    return grouped;
  }, [events]);
  const weeks = useMemo(
    () => Array.from({ length: days.length / 7 }, (_, index) => days.slice(index * 7, index * 7 + 7)),
    [days],
  );

  const moveMonth = (offset: number) => {
    const target = new Date(Date.UTC(view.year, view.month + offset, 1, 12));
    setView({ year: target.getUTCFullYear(), month: target.getUTCMonth() });
  };

  const monthName = monthFormatter.format(new Date(Date.UTC(view.year, view.month, 1, 12)));
  const monthLabel = `${monthName.charAt(0).toLocaleUpperCase("ca-ES")}${monthName.slice(1)} de ${view.year}`;

  return (
    <section className="monthly-calendar" aria-labelledby="monthly-calendar-title">
      <header className="monthly-calendar-header">
        <div>
          <span className="eyebrow">Calendari mensual</span>
          <h2 id="monthly-calendar-title">{monthLabel}</h2>
        </div>
        <div className="monthly-calendar-actions">
          <button type="button" onClick={() => moveMonth(-1)} aria-label="Mes anterior">←</button>
          <button type="button" className="monthly-calendar-today" onClick={() => setView(currentMonth())}>Avui</button>
          <button type="button" onClick={() => moveMonth(1)} aria-label="Mes següent">→</button>
        </div>
      </header>

      <div className="monthly-calendar-desktop">
        <div className="monthly-calendar-weekdays" aria-hidden="true">
          {weekdayLabels.map((day) => <span key={day}>{day}</span>)}
        </div>
        <div className="monthly-calendar-grid">
          {days.map((day) => {
            const dayEvents = eventsByDay.get(day.key) || [];
            const isPast = day.key < todayKey;
            return (
              <div
                className={`monthly-calendar-day${day.inMonth ? "" : " is-outside"}${day.key === todayKey ? " is-today" : ""}${isPast ? " is-past" : ""}`}
                key={day.key}
              >
                <time className="monthly-calendar-day-number" dateTime={day.key}>{day.day}</time>
                <div className="monthly-calendar-day-events">
                  {dayEvents.map((event) => <CalendarEventItem event={event} key={event.id} />)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="monthly-calendar-mobile">
        {weeks.map((week) => {
          const activeDays = week.filter((day) => (eventsByDay.get(day.key) || []).length > 0);
          return (
            <section className="monthly-calendar-mobile-week" key={week[0].key}>
              <div className="monthly-calendar-mobile-strip">
                {week.map((day, index) => {
                  const hasEvents = (eventsByDay.get(day.key) || []).length > 0;
                  return (
                    <div className={`${day.inMonth ? "" : "is-outside"}${day.key === todayKey ? " is-today" : ""}${hasEvents ? " has-events" : ""}`} key={day.key}>
                      <span>{weekdayLabels[index]}</span>
                      <time dateTime={day.key}>{day.day}</time>
                    </div>
                  );
                })}
              </div>
              {activeDays.length > 0 && (
                <div className="monthly-calendar-mobile-events">
                  {activeDays.map((day) => (
                    <section className="monthly-calendar-mobile-day" key={day.key}>
                      <h3>{longDayFormatter.format(day.date)}</h3>
                      {(eventsByDay.get(day.key) || []).map((event) => <CalendarEventItem event={event} key={event.id} />)}
                    </section>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </section>
  );
}
