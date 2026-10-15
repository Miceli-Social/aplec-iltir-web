"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { ADMIN_COOKIE, isValidAdminToken } from "@/lib/admin-auth";
import { saveAplecReturn } from "@/lib/content-store";
import { activityUrl, type ActivityReturn } from "@/lib/aplec-2026-returns";

export async function publishAplecReturn(value: ActivityReturn) {
  if (!isValidAdminToken((await cookies()).get(ADMIN_COOKIE)?.value)) {
    return { error: "La sessió ha caducat. Torna a entrar a /admin." };
  }
  try {
    await saveAplecReturn(value);
  } catch (error) {
    console.error("Aplec return publication failed", error);
    return { error: "No s’ha pogut publicar. Revisa les fotos, el crèdit i l’enllaç del vídeo i torna-ho a provar." };
  }
  for (const path of ["/", "/aplecs/2026", "/aplecs/2026/reviu", activityUrl(value.activityId), "/admin"]) {
    revalidatePath(path);
  }
  return { ok: true };
}
