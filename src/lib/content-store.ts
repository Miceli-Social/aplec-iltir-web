import { head, list, put } from "@vercel/blob";
import { randomUUID } from "node:crypto";
import { type ActivityReturn, type AplecReturns, findActivity, photoPrefix, PHOTO_TYPES, MAX_PHOTO_BYTES, validateReturn } from "./aplec-2026-returns";
import type { CalendarEvent, Circle, DocumentLink } from "@/lib/types";

const STATE_PREFIX = "iltir/editorial-state/";
const STATE_PATH = `${STATE_PREFIX}state.json`;
const STATE_CACHE_TTL_MS = 10 * 60 * 1000;

export type EditorialState = {
  circleOverrides: Record<
    string,
    Partial<
      Pick<
        Circle,
        | "summary"
        | "purpose"
        | "workingOn"
        | "nextSteps"
        | "whatsappUrl"
        | "whatsappActive"
      >
    >
  >;
  events: CalendarEvent[];
  eventOverrides: Record<string, Partial<CalendarEvent>>;
  documents: Record<string, DocumentLink[]>;
};

type CachedState = {
  expiresAt: number;
  state: EditorialState;
};

let cachedState: CachedState | undefined;
let pendingStatePromise: Promise<EditorialState> | undefined;

const emptyState = (): EditorialState => ({
  circleOverrides: {},
  events: [],
  eventOverrides: {},
  documents: {},
});

export const hasContentStore = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

const cloneState = (state: EditorialState): EditorialState => ({
  circleOverrides: structuredClone(state.circleOverrides),
  events: structuredClone(state.events),
  eventOverrides: structuredClone(state.eventOverrides),
  documents: structuredClone(state.documents),
});

const normalizeState = (state: Partial<EditorialState>): EditorialState => ({
  circleOverrides: state.circleOverrides || {},
  events: state.events || [],
  eventOverrides: state.eventOverrides || {},
  documents: state.documents || {},
});

const getStoreIdFromToken = () => {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  const storeId = token?.split("_")[3];
  return storeId || undefined;
};

const getFixedStateUrl = () => {
  const storeId = getStoreIdFromToken();
  if (!storeId) return undefined;
  return `https://${storeId}.public.blob.vercel-storage.com/${STATE_PATH}`;
};

async function fetchStateJson(url: string, fresh: boolean) {
  const response = await fetch(
    url,
    fresh ? { cache: "no-store" } : { next: { revalidate: 600 } },
  );
  if (!response.ok) return undefined;
  return normalizeState((await response.json()) as Partial<EditorialState>);
}

async function findLegacyState(fresh: boolean) {
  const result = await list({ prefix: STATE_PREFIX, limit: 100 });
  const blob = [...result.blobs].sort(
    (a, b) =>
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
  )[0];
  if (!blob) return undefined;
  return fetchStateJson(blob.url, fresh);
}

async function readEditorialState(
  fresh: boolean,
  required: boolean,
): Promise<EditorialState> {
  if (!hasContentStore()) {
    if (required) {
      throw new Error("L’emmagatzematge editorial no està configurat.");
    }
    return emptyState();
  }
  try {
    const fixedUrl = getFixedStateUrl();
    const state = fixedUrl ? await fetchStateJson(fixedUrl, fresh) : undefined;
    if (state) return state;

    const legacyState = await findLegacyState(fresh);
    if (legacyState) {
      await saveEditorialState(legacyState);
      return legacyState;
    }
    return emptyState();
  } catch (error) {
    if (required) throw error;
    return emptyState();
  }
}

export async function getEditorialState(options?: {
  fresh?: boolean;
  required?: boolean;
}): Promise<EditorialState> {
  const fresh = options?.fresh === true;
  const required = options?.required === true;
  const now = Date.now();

  if (!fresh && !required && cachedState && cachedState.expiresAt > now) {
    return cloneState(cachedState.state);
  }

  if (!fresh && !required && pendingStatePromise) {
    return cloneState(await pendingStatePromise);
  }

  pendingStatePromise = readEditorialState(fresh, required).then((state) => {
    cachedState = {
      state,
      expiresAt: Date.now() + STATE_CACHE_TTL_MS,
    };
    return state;
  }).finally(() => {
    pendingStatePromise = undefined;
  });

  return cloneState(await pendingStatePromise);
}

export async function saveEditorialState(state: EditorialState) {
  if (!hasContentStore()) {
    throw new Error("L’emmagatzematge editorial no està configurat.");
  }
  const savedState = normalizeState(state);
  await put(STATE_PATH, JSON.stringify(savedState, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json; charset=utf-8",
    cacheControlMaxAge: 60,
  });
  cachedState = {
    state: savedState,
    expiresAt: Date.now() + STATE_CACHE_TTL_MS,
  };
}

export async function uploadPublicDocument(file: File, title: string) {
  if (!hasContentStore()) {
    throw new Error("L’emmagatzematge editorial no està configurat.");
  }
  const cleanName = file.name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^-|-$/g, "");
  return put(`iltir/actes/${Date.now()}-${cleanName}`, file, {
    access: "public",
    addRandomSuffix: true,
    contentType: file.type || "application/pdf",
  }).then(
    (blob): DocumentLink => ({
      title,
      url: blob.url,
    }),
  );
}

// Immutable per-activity revisions avoid both overwritten-JSON CDN staleness and
// unrelated editors overwriting each other's circles/events/activities.
const RETURNS_PREFIX = "iltir/aplec-2026/returns/";
async function readAplecReturns(): Promise<AplecReturns> {
  if (!hasContentStore()) return {};
  const latest = new Map<string, { pathname: string; url: string }>();
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: RETURNS_PREFIX, cursor, limit: 1000,
      token: process.env.BLOB_READ_WRITE_TOKEN });
    for (const blob of page.blobs) {
      const id = blob.pathname.slice(RETURNS_PREFIX.length).split("/")[0];
      if (!findActivity(id)) continue;
      const previous = latest.get(id);
      if (!previous || blob.pathname > previous.pathname) latest.set(id, blob);
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  const entries = await Promise.all([...latest].map(async ([id, blob]) => {
    const response = await fetch(blob.url, { cache: "no-store" });
    if (!response.ok) throw new Error("No s’han pogut llegir els retorns de l’Aplec.");
    const value = validateReturn(await response.json());
    if (value.activityId !== id) throw new Error("Retorn editorial inconsistent.");
    return [id, value] as const;
  }));
  return Object.fromEntries(entries);
}

export async function getAplecReturns(): Promise<AplecReturns> {
  try {
    return await readAplecReturns();
  } catch (error) {
    console.error("Aplec return read failed", error);
    // Keep the programme and existing site usable during a storage outage.
    return {};
  }
}

export async function saveAplecReturn(input: ActivityReturn) {
  if (!hasContentStore()) throw new Error("L’emmagatzematge editorial no està configurat.");
  const value = validateReturn(input);
  // Only accept actual photos in this activity's public editorial store.
  await Promise.all(value.photos.map(async (url) => {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" || !parsed.hostname.endsWith(".public.blob.vercel-storage.com") ||
        parsed.port || parsed.username || parsed.password || parsed.search || parsed.hash ||
        !parsed.pathname.startsWith(`/${photoPrefix(value.activityId)}`)) {
      throw new Error("La fotografia no pertany a aquesta activitat.");
    }
    // Authenticate against the configured editorial store without parsing its token.
    const photo = await head(url, { token: process.env.BLOB_READ_WRITE_TOKEN });
    if (!PHOTO_TYPES.includes(photo.contentType) || photo.size > MAX_PHOTO_BYTES || photo.size === 0) {
      throw new Error("Format o mida de fotografia no vàlids.");
    }
  }));
  await put(`${RETURNS_PREFIX}${value.activityId}/${Date.now()}-${randomUUID()}.json`, JSON.stringify(value), {
    access: "public", addRandomSuffix: false, contentType: "application/json",
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
}
