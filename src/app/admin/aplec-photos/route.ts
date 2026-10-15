import { cookies } from "next/headers";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { ADMIN_COOKIE, isValidAdminToken } from "@/lib/admin-auth";
import { cleanPhotoName, findActivity, MAX_PHOTO_BYTES, PHOTO_TYPES, photoPrefix } from "@/lib/aplec-2026-returns";

export async function POST(request: Request) {
  try {
    const body = await request.json() as HandleUploadBody;
    const result = await handleUpload({
      request, body, token: process.env.BLOB_READ_WRITE_TOKEN,
      onBeforeGenerateToken: async (pathname, activityId) => {
        if (!isValidAdminToken((await cookies()).get(ADMIN_COOKIE)?.value)) throw new Error("Accés denegat.");
        if (!activityId || !findActivity(activityId)) throw new Error("Activitat desconeguda.");
        const prefix = photoPrefix(activityId);
        const filename = pathname.slice(prefix.length);
        if (!pathname.startsWith(prefix) || !filename || filename !== cleanPhotoName(filename)) throw new Error("Nom de fotografia no vàlid.");
        return { allowedContentTypes: PHOTO_TYPES, maximumSizeInBytes: MAX_PHOTO_BYTES,
          addRandomSuffix: true, allowOverwrite: false, validUntil: Date.now() + 15 * 60 * 1000 };
      },
    });
    return Response.json(result);
  } catch {
    return Response.json({ error: "No s’ha pogut autoritzar la pujada. Revisa la sessió i la fotografia." }, { status: 400 });
  }
}
