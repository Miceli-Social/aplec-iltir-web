import { isRegistrationAdmin, registrationCsv } from "@/lib/aplec-2026-registration-admin";
import { getRegistrations, updateLunchStatus, updatePhysicalPlaces, RegistrationError, RegistrationStoreUnavailableError } from "@/lib/aplec-2026-registration-store";
import { notifyRegistration } from "@/lib/aplec-2026-registration-mail";
import { json, privateHeaders } from "@/lib/aplec-2026-registration-http";
import { revalidatePath } from "next/cache";
import { isRegistrationKind } from "@/lib/aplec-2026-registration";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;
export async function GET(request: Request) {
  if (!(await isRegistrationAdmin())) return json({ message: "Accés no autoritzat." }, 401);
  const kind = new URL(request.url).searchParams.get("kind");
  if (!isRegistrationKind(kind)) return json({ message: "Selecció no vàlida." }, 400);
  try { return new Response(registrationCsv(await getRegistrations(kind), kind), { headers: { ...privateHeaders, "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="iltir-2026-${kind}.csv"` } }); }
  catch { return json({ message: "No s’han pogut llegir les inscripcions." }, 503); }
}
export async function POST(request: Request) {
  if (!(await isRegistrationAdmin())) return json({ message: "Accés no autoritzat." }, 401);
  if (request.headers.get("origin") !== new URL(request.url).origin) return json({ message: "Origen no vàlid." }, 403);
  const form = await request.formData();
  const id = String(form.get("id") || "");
  let result = "saved";
  try {
    if (form.get("action") === "physical") {
      const raw = String(form.get("physicalPlaces") || "");
      await updatePhysicalPlaces(/^\d+$/.test(raw) ? Number(raw) : NaN);
    } else if (form.get("action") === "notify") {
      const kind = form.get("kind");
      if (!isRegistrationKind(kind)) return json({}, 400);
      const record = (await getRegistrations(kind)).find(r => r.id === id);
      if (!record) throw new RegistrationError("No s’ha trobat la inscripció.", "not-found");
      if (record.status === "cancelled") throw new RegistrationError("No es reenvien correus de reserves cancel·lades.", "cancelled");
      if (!(await notifyRegistration(record))) throw new RegistrationStoreUnavailableError("No s’ha pogut desar l’estat dels correus.");
    } else {
      const status = form.get("status");
      if (status !== "pending" && status !== "paid" && status !== "cancelled") return json({}, 400);
      await updateLunchStatus(id, status);
    }
  } catch (error) {
    if (!(error instanceof RegistrationError)) return json({ message: "L’emmagatzematge d’inscripcions no està disponible. Torna a l’admin i prova-ho més endavant." }, 503);
    result = error.code;
  }
  revalidatePath("/admin");
  return Response.redirect(new URL(`/admin?registrations=${result}#inscripcions-aplec`, request.url), 303);
}
