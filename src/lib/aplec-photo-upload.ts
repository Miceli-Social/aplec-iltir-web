"use client";

import { upload } from "@vercel/blob/client";
import { cleanPhotoName, MAX_PHOTO_BYTES, PHOTO_TYPES, photoPrefix } from "./aplec-2026-returns";

export async function uploadAplecPhoto(file: File, activityId: string) {
  if (!PHOTO_TYPES.includes(file.type) || file.size === 0 || file.size > MAX_PHOTO_BYTES) {
    throw new Error("Utilitza JPEG, PNG, WebP, AVIF o GIF de fins a 15 MB per foto.");
  }
  const blob = await upload(`${photoPrefix(activityId)}${cleanPhotoName(file.name)}`, file, {
    access: "public", handleUploadUrl: "/admin/aplec-photos", clientPayload: activityId,
  });
  return blob.url;
}
