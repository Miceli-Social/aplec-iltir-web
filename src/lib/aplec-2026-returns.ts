import { aplec2026Program } from "./aplec-2026-program";

export type ActivityReturn = {
  activityId: string;
  photos: string[];
  cover: string;
  credit: string;
  ideas: string[];
  quote: string;
  videoUrl: string;
};
export type AplecReturns = Record<string, ActivityReturn>;
export const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];
export const MAX_PHOTO_BYTES = 15 * 1024 * 1024;
export const MAX_PHOTOS = 10;
export const photoPrefix = (id: string) => `iltir/aplec-2026/photos/${id}/`;
export const activityUrl = (id: string) => `/aplecs/2026/activitats/${id}`;
export function findActivity(id: string) {
  for (const day of aplec2026Program) {
    const activity = day.activities.find((item) => item.id === id);
    if (activity) return { day, activity };
  }
}
export const hasPhotos = (item?: ActivityReturn) => Boolean(item?.photos.length);
export function publishedDays(returns: AplecReturns) {
  return aplec2026Program.map((day) => ({ ...day,
    activities: day.activities.filter((activity) => hasPhotos(returns[activity.id])),
  }));
}
export const hasPublishedReturns = (returns: AplecReturns) =>
  publishedDays(returns).some((day) => day.activities.length > 0);
export function activityDetail(id: string, returns: AplecReturns) {
  const program = findActivity(id);
  return program ? { ...program, editorial: returns[id] } : undefined;
}
export function cleanPhotoName(name: string) {
  return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9.-]+/g, "-").replace(/^[.-]+/, "").slice(-100) || "foto";
}
export function validateReturn(value: ActivityReturn): ActivityReturn {
  if (!findActivity(value.activityId)) throw new Error("Activitat desconeguda.");
  if (!Array.isArray(value.photos) || value.photos.length < 1 || value.photos.length > MAX_PHOTOS ||
      new Set(value.photos).size !== value.photos.length || !value.photos.includes(value.cover)) {
    throw new Error(`Tria entre 1 i ${MAX_PHOTOS} fotos i una foto principal de la galeria.`);
  }
  if (!Array.isArray(value.ideas) || value.ideas.length > 3) throw new Error("Màxim 3 idees clau.");
  for (const text of [value.credit, value.quote, value.videoUrl, ...value.ideas]) {
    if (typeof text !== "string" || text.length > 2000) throw new Error("Revisa els textos (màxim 2.000 caràcters).");
  }
  if (!value.credit.trim()) throw new Error("Indica el crèdit fotogràfic.");
  if (value.videoUrl && new URL(value.videoUrl).protocol !== "https:") throw new Error("El vídeo ha de tenir una URL https://.");
  return { activityId: value.activityId, photos: value.photos, cover: value.cover,
    credit: value.credit.trim(), ideas: value.ideas.map((text) => text.trim()).filter(Boolean),
    quote: value.quote.trim(), videoUrl: value.videoUrl.trim() };
}
