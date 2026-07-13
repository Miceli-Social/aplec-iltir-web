import { fallbackCircles, fallbackEvents, municipalities } from "@/lib/content";
import { getEditorialState } from "@/lib/content-store";
import type { CalendarEvent, Circle, DocumentLink } from "@/lib/types";
import { localDateTimeToIso } from "@/lib/date-time";

let lastValidCircles: Circle[] = fallbackCircles;
let lastValidEvents: CalendarEvent[] = fallbackEvents;

export const hiddenPublicCircleSlugs = new Set(["navata-coordinacio"]);

const requiredEvents: CalendarEvent[] = [
  {
    id: "sectorial-energia-2026-07-03-llado",
    title: "Trobada de la Sectorial d’Energia",
    start: "2026-07-03T18:00:00+02:00",
    location: "Sala Sant Joan de Lladó",
    description: "Trobada de treball de la sectorial d’energia.",
    tags: ["energia", "sectorial", "llado"],
    circleSlug: "sectorial-energia",
  },
  {
    id: "cabanelles-coordinacio-2026-07-15-espinavessa",
    title: "Tercera trobada del Consell de Poble de Cabanelles",
    start: "2026-07-15T19:00:00+02:00",
    location: "Local de l’Associació de Veïns i Veïnes d’Espinavessa",
    description:
      "Sessió per continuar la lectura del municipi i treballar les dimensions econòmica, d’habitatge i sociocultural.",
    tags: ["cabanelles", "coordinacio", "consell-de-poble"],
    circleSlug: "cabanelles-coordinacio",
  },
];

const fixedCircleCorrections: Record<string, Partial<Circle>> = {
  "sectorial-comunicacio": {
    whatsappUrl: "https://chat.whatsapp.com/HUNDtS8Mn80AI0irO9hCmn",
    whatsappActive: true,
  },
  "sectorial-energia": {
    whatsappUrl: "https://chat.whatsapp.com/EQ9j4JfLkWZE9PociVmTDt",
    whatsappActive: true,
  },
  "sectorial-habitatge": {
    whatsappUrl: "https://chat.whatsapp.com/IK15KQvhOKKL11YMJsmarN",
    whatsappActive: true,
  },
  "sectorial-esports": {
    status: "actiu",
    whatsappUrl: "https://chat.whatsapp.com/DzMzD3q7Sm3Ky9Ppx8AweD",
    whatsappActive: true,
  },
  "sectorial-territori": {
    status: "actiu",
    whatsappActive: true,
  },
};

const fixedEventCorrections: Record<string, Partial<CalendarEvent>> = {
  "manual-1782375467125": {
    start: "2026-06-30T16:00:00.000Z",
  },
};

const normalizeForMatch = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const polishDocumentTitle = (circleSlug: string, document: DocumentLink): DocumentLink => {
  const title = document.title.trim();
  const normalized = normalizeForMatch(`${title} ${document.url}`);

  if (
    circleSlug === "cabanelles-coordinacio" &&
    normalized.includes("cabanelles") &&
    (normalized.includes("#3") || normalized.includes(" 3") || normalized.includes("-3"))
  ) {
    return {
      ...document,
      title: "Acta #2 - Consell de Poble de Cabanelles",
      date: document.date || "4 de juliol de 2026",
    };
  }

  if (
    circleSlug === "cabanelles-coordinacio" &&
    normalized.includes("cabanelles") &&
    normalized.includes("acta 1")
  ) {
    return {
      ...document,
      title: "Acta #1 - Consell de Poble de Cabanelles",
    };
  }

  if (
    circleSlug === "llado-coordinacio" &&
    normalized.includes("docs.google.com/document")
  ) {
    return {
      ...document,
      title: "Totes les actes del Consell de Poble de Lladó",
    };
  }

  if (
    circleSlug === "cabanelles-coordinacio" &&
    normalized.includes("docs.google.com/document")
  ) {
    return {
      ...document,
      title: "Totes les actes del Consell de Poble de Cabanelles",
    };
  }

  if (
    circleSlug === "llado-coordinacio" &&
    normalized.includes("consell de poble de llado") &&
    normalized.includes("#1")
  ) {
    return {
      ...document,
      title: "Acta #1 - Consell de Poble de Lladó",
      date: document.date || "30 de juny de 2026",
    };
  }

  return {
    ...document,
    title,
  };
};

const documentOrder = (document: DocumentLink) => {
  const normalized = normalizeForMatch(`${document.title} ${document.url}`);
  if (normalized.includes("totes les actes")) return 1000;

  const actNumber = normalized.match(/acta\s*#?\s*(\d+)/)?.[1];
  if (actNumber) return 100 - Number(actNumber);

  return 500;
};

const mergeDocuments = (circleSlug: string, documents: DocumentLink[]) => {
  const seen = new Set<string>();
  return documents
    .map((document) => polishDocumentTitle(circleSlug, document))
    .filter((document) => {
      const key = document.url.trim();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((first, second) => documentOrder(first) - documentOrder(second));
};

const splitCsvLine = (line: string) => {
  const values: string[] = [];
  let value = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"') {
      if (quoted && line[index + 1] === '"') {
        value += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === "," && !quoted) {
      values.push(value.trim());
      value = "";
    } else {
      value += char;
    }
  }
  values.push(value.trim());
  return values;
};

const parseList = (value?: string) =>
  value
    ? value
        .split("|")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

const parseDocuments = (value?: string): DocumentLink[] =>
  parseList(value).flatMap((item) => {
    const [title, url] = item.split("::").map((part) => part.trim());
    return title && /^https:\/\//.test(url || "") ? [{ title, url }] : [];
  });

const safeWhatsappUrl = (value?: string) =>
  value && /^https:\/\/(chat\.whatsapp\.com|wa\.me)\//.test(value) ? value : undefined;

const mergeCircleRows = (csv: string): Circle[] => {
  const lines = csv.replace(/\r/g, "").split("\n").filter(Boolean);
  if (lines.length < 2) return fallbackCircles;

  const headers = splitCsvLine(lines[0]);
  const rows = lines.slice(1).map((line) => {
    const values = splitCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, values[index] || ""]));
  });

  return fallbackCircles.map((circle) => {
    const row = rows.find((candidate) => candidate.slug === circle.slug);
    if (!row) return circle;
    const whatsappUrl = safeWhatsappUrl(row.whatsappUrl);
    return {
      ...circle,
      name: row.name || circle.name,
      summary: row.summary || circle.summary,
      purpose: row.purpose || circle.purpose,
      workingOn: parseList(row.workingOn).length ? parseList(row.workingOn) : circle.workingOn,
      nextSteps: parseList(row.nextSteps).length ? parseList(row.nextSteps) : circle.nextSteps,
      documents: parseDocuments(row.documents).length
        ? parseDocuments(row.documents)
        : circle.documents,
      whatsappUrl,
      whatsappActive: row.whatsappActive.toLowerCase() === "true" && Boolean(whatsappUrl),
    };
  });
};

const unfoldIcs = (ics: string) => ics.replace(/\r?\n[ \t]/g, "");

const parseIcsDate = (raw: string) => {
  const value = raw.split(":").at(-1) || "";
  if (/^\d{8}$/.test(value)) {
    return localDateTimeToIso(
      `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}T09:00:00`,
    );
  }
  const match = value.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z?$/);
  if (!match) return undefined;
  const [, year, month, day, hour, minute, second] = match;
  if (value.endsWith("Z")) {
    return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}Z`).toISOString();
  }
  return localDateTimeToIso(
    `${year}-${month}-${day}T${hour}:${minute}:${second}`,
  );
};

const cleanIcsValue = (value = "") =>
  value.replace(/\\n/g, " ").replace(/\\,/g, ",").replace(/\\;/g, ";").trim();

const parseTags = (title: string, description: string) => {
  const matches = `${title} ${description}`.match(/\[([^\]]+)\]/g) || [];
  return matches.map((tag) =>
    tag
      .slice(1, -1)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\s+/g, "-"),
  );
};

const parseIcs = (ics: string): CalendarEvent[] => {
  const blocks = unfoldIcs(ics).split("BEGIN:VEVENT").slice(1);
  const now = Date.now() - 24 * 60 * 60 * 1000;
  return blocks
    .map((block): CalendarEvent | undefined => {
      const value = (key: string) => {
        const line = block.split("\n").find((entry) => entry.startsWith(key));
        return line?.slice(line.indexOf(":") + 1);
      };
      const startLine = block.split("\n").find((entry) => entry.startsWith("DTSTART"));
      const start = startLine ? parseIcsDate(startLine) : undefined;
      const title = cleanIcsValue(value("SUMMARY"));
      if (!start || !title || new Date(start).getTime() < now) return undefined;
      const description = cleanIcsValue(value("DESCRIPTION"));
      const tags = parseTags(title, description);
      const municipality = municipalities.find((item) => tags.includes(item.slug));
      const theme = fallbackCircles
        .filter((circle) => circle.kind === "sectorial")
        .find((circle) => tags.includes(circle.theme));
      const knownSlug =
        municipality && theme
          ? `${municipality.slug}-${theme.theme}`
          : theme
            ? theme.slug
            : undefined;
      return {
        id: value("UID") || `${start}-${title}`,
        title: title.replace(/\[[^\]]+\]\s*/g, ""),
        start,
        end: block.split("\n").find((entry) => entry.startsWith("DTEND"))
          ? parseIcsDate(block.split("\n").find((entry) => entry.startsWith("DTEND"))!)
          : undefined,
        location: cleanIcsValue(value("LOCATION")),
        description,
        tags,
        circleSlug: knownSlug,
        allDay: /^\d{8}$/.test((startLine || "").split(":").at(-1) || ""),
      };
    })
    .filter((event): event is CalendarEvent => Boolean(event))
    .sort((a, b) => a.start.localeCompare(b.start));
};

export async function getCircles(options?: {
  freshEditorial?: boolean;
  includeHidden?: boolean;
}): Promise<Circle[]> {
  const url = process.env.GOOGLE_SHEET_CSV_URL;
  if (url) {
    try {
      const response = await fetch(url, { next: { revalidate: 300 } });
      if (!response.ok) throw new Error("Google Sheet unavailable");
      const circles = mergeCircleRows(await response.text());
      if (circles.length === fallbackCircles.length) lastValidCircles = circles;
    } catch {
      // The last valid version remains available on this warm server instance.
    }
  }
  const state = await getEditorialState({ fresh: options?.freshEditorial });
  return lastValidCircles
    .filter((circle) => options?.includeHidden || !hiddenPublicCircleSlugs.has(circle.slug))
    .map((circle) => ({
      ...circle,
      ...state.circleOverrides[circle.slug],
      ...fixedCircleCorrections[circle.slug],
      documents: mergeDocuments(circle.slug, [
        ...circle.documents,
        ...(state.documents[circle.slug] || []),
      ]),
    }));
}

export async function getEvents(options?: {
  freshEditorial?: boolean;
}): Promise<CalendarEvent[]> {
  const url = process.env.GOOGLE_CALENDAR_ICS_URL;
  if (url) {
    try {
      const response = await fetch(url, { next: { revalidate: 300 } });
      if (!response.ok) throw new Error("Google Calendar unavailable");
      const events = parseIcs(await response.text());
      if (events.length) lastValidEvents = events;
    } catch {
      // The last valid version remains available on this warm server instance.
    }
  }
  const state = await getEditorialState({ fresh: options?.freshEditorial });
  const mergedEvents = [...lastValidEvents, ...state.events];
  for (const event of requiredEvents) {
    if (!mergedEvents.some((item) => item.id === event.id)) {
      mergedEvents.push(event);
    }
  }
  return mergedEvents
    .map((event) => ({
      ...event,
      ...state.eventOverrides[event.id],
      ...fixedEventCorrections[event.id],
      id: event.id,
    }))
    .sort((a, b) => a.start.localeCompare(b.start));
}
