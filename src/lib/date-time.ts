export const SITE_TIME_ZONE = "Europe/Madrid";

export const eventDateTimeFormatter = new Intl.DateTimeFormat("ca-ES", {
  timeZone: SITE_TIME_ZONE,
  weekday: "short",
  day: "numeric",
  month: "long",
  hour: "2-digit",
  minute: "2-digit",
});

export const eventDayFormatter = new Intl.DateTimeFormat("ca-ES", {
  timeZone: SITE_TIME_ZONE,
  weekday: "long",
  day: "numeric",
  month: "long",
});

export const adminDateTimeFormatter = new Intl.DateTimeFormat("ca-ES", {
  timeZone: SITE_TIME_ZONE,
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export const toDateTimeLocal = (date: string) =>
  new Intl.DateTimeFormat("sv-SE", {
    timeZone: SITE_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .format(new Date(date))
    .replace(" ", "T");

export function localDateTimeToIso(value: string) {
  const normalized = value.length === 16 ? `${value}:00` : value;
  const probe = new Date(`${normalized}Z`);
  const zoneName = new Intl.DateTimeFormat("en-US", {
    timeZone: SITE_TIME_ZONE,
    timeZoneName: "longOffset",
  })
    .formatToParts(probe)
    .find((part) => part.type === "timeZoneName")?.value;
  const offset = zoneName?.replace("GMT", "") || "+01:00";
  return new Date(`${normalized}${offset}`).toISOString();
}
