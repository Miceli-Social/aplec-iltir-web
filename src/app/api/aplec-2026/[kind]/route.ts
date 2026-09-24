import { after } from "next/server";
import { isRegistrationKind, validateRegistration } from "@/lib/aplec-2026-registration";
import { createRegistration, getLunchAvailability, RegistrationError, RegistrationStoreUnavailableError } from "@/lib/aplec-2026-registration-store";
import { notifyRegistration, ticketLink } from "@/lib/aplec-2026-registration-mail";
import { json, readBody } from "@/lib/aplec-2026-registration-http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;
type Context = { params: Promise<{ kind: string }> };
export async function GET(_request: Request, { params }: Context) {
  if ((await params).kind !== "lunch") return json({ message: "No disponible." }, 404);
  try { return json(await getLunchAvailability()); }
  catch { return json({ message: "No es poden consultar les places ara." }, 503); }
}
export async function POST(request: Request, { params }: Context) {
  const { kind } = await params;
  if (!isRegistrationKind(kind)) return json({ message: "No disponible." }, 404);
  let body;
  try { body = await readBody(request); } catch { return json({ message: "No s’ha pogut validar l’enviament." }, 400); }
  const { input, errors } = validateRegistration(kind, body);
  if (Object.keys(errors).length) return json({ errors }, 400);
  try {
    const record = await createRegistration(kind, input);
    after(async () => { await notifyRegistration(record); });
    return json({ ok: true, ...(kind === "lunch" ? { ticketUrl: ticketLink(record) } : {}) });
  } catch (error) {
    return json({ message: error instanceof RegistrationError || error instanceof RegistrationStoreUnavailableError ? error.message : "No s’ha pogut confirmar l’enviament. Torna-ho a provar amb les mateixes dades; no es duplicarà." }, error instanceof RegistrationError ? 409 : 503);
  }
}
