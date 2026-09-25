import { aplec2026OtherActivities, aplec2026Program, type ProgramActivity } from "./aplec-2026-program";

type UpcomingActivity = ProgramActivity & { municipality: string };
export type ActivitySlot = { startsAt: string; date: string; activities: UpcomingActivity[] };

// Compare civil dates in Catalunya, independently of the server's timezone.
function madridDateTime(now: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Madrid", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
  }).formatToParts(now);
  const value = (type: string) => parts.find((part) => part.type === type)!.value;
  return `${value("year")}-${value("month")}-${value("day")}T${value("hour")}:${value("minute")}:${value("second")}`;
}

export function getUpcomingAplecActivities(now = new Date()) {
  const slots = new Map<string, ActivitySlot>();
  function add(date: string, municipality: string, activities: ProgramActivity[]) {
    let previousStart = "";
    for (const activity of activities) {
      let activityDate = date;
      if (activity.nextDay) {
        const followingDay = new Date(`${date}T12:00:00Z`);
        followingDay.setUTCDate(followingDay.getUTCDate() + 1);
        activityDate = followingDay.toISOString().slice(0, 10);
      }
      // A continuation belongs to the preceding slot; it has no invented time.
      const startsAt = activity.time === "Tot seguit"
        ? previousStart
        : `${activityDate}T${activity.time.slice(0, 5).replace(".", ":")}:00`;
      if (!startsAt) throw new Error("A continuation needs a preceding activity");
      previousStart = startsAt;
      const slot = slots.get(startsAt) ?? { startsAt, date: startsAt.slice(0, 10), activities: [] };
      slot.activities.push({ ...activity, municipality });
      slots.set(startsAt, slot);
    }
  }
  for (const day of aplec2026Program) add(day.dateISO, day.municipality, day.activities);
  for (const activity of aplec2026OtherActivities) add(activity.dateISO, activity.municipality, [activity]);
  const current = madridDateTime(now);
  return {
    slots: [...slots.values()].sort((a, b) => a.startsAt.localeCompare(b.startsAt))
      .filter((slot) => slot.startsAt >= current).slice(0, 3),
    // No closing duration is supplied: announce the end once the final day is over.
    finished: current.slice(0, 10) > aplec2026Program.at(-1)!.dateISO,
  };
}
