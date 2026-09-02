import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { syncConsentToDrive } from "@/lib/consent-drive";
import {
  getWhatsappConsents,
  hasConsentStore,
  isConsentDecryptionError,
  saveWhatsappConsents,
} from "@/lib/consent-store";
import { getCircles, safeWhatsappUrl } from "@/lib/remote-content";

const CONSENT_VERSION = "MIC-2025-drets-imatge-proteccio-dades";
const CONSENT_ENTITY = "Miceli Rural Coop, SCCL (Miceli Social) · NIF F10983864";

const cleanText = (value: unknown) =>
  String(value || "")
    .replace(/\s+/g, " ")
    .trim();

export async function POST(request: Request) {
  const body = await request.json().catch(() => undefined) as
    | {
        circleSlug?: string;
        name?: string;
        dni?: string;
        accepted?: boolean;
      }
    | undefined;

  const circleSlug = cleanText(body?.circleSlug);
  const name = cleanText(body?.name);
  const dni = cleanText(body?.dni).toUpperCase();

  if (!circleSlug || name.length < 3 || dni.length < 5 || body?.accepted !== true) {
    return NextResponse.json(
      { ok: false, error: "Revisa el nom, el DNI/NIE i l’acceptació." },
      { status: 400 },
    );
  }

  const circles = await getCircles({ freshEditorial: true });
  const circle = circles.find((item) => item.slug === circleSlug);
  const whatsappUrl = safeWhatsappUrl(circle?.whatsappUrl);
  if (!circle || !circle.whatsappActive || !whatsappUrl) {
    return NextResponse.json(
      { ok: false, error: "Aquest grup no està disponible." },
      { status: 404 },
    );
  }

  if (!hasConsentStore()) {
    console.error(
      "El registre v2 de consentiments de WhatsApp no està configurat. Cal BLOB_READ_WRITE_TOKEN i CONSENT_ENCRYPTION_SECRET.",
    );
    return NextResponse.json(
      { ok: false, error: "Ara mateix no podem registrar l’acceptació. Torna-ho a provar més tard." },
      { status: 503 },
    );
  }

  let consents;
  try {
    consents = await getWhatsappConsents({ failOnUnreadable: true });
  } catch (error) {
    if (isConsentDecryptionError(error)) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Ara mateix no podem registrar l’acceptació. Torna-ho a provar més tard.",
        },
        { status: 503 },
      );
    }
    throw error;
  }
  const acceptedAt = new Date().toISOString();
  const forwardedFor = request.headers.get("x-forwarded-for") || "";
  const ipAddress =
    request.headers.get("x-real-ip") ||
    forwardedFor.split(",")[0]?.trim() ||
    request.headers.get("x-vercel-forwarded-for") ||
    undefined;
  const existingIndex = consents.findIndex(
    (item) => item.circleSlug === circleSlug && item.dni === dni,
  );
  const consent = {
    id:
      existingIndex >= 0
        ? consents[existingIndex].id
        : `whatsapp-consent-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    circleSlug,
    circleName: circle.name,
    name,
    dni,
    acceptedAt,
    consentVersion: CONSENT_VERSION,
    consentEntity: CONSENT_ENTITY,
    userAgent: request.headers.get("user-agent") || undefined,
    ipAddress,
    acceptLanguage: request.headers.get("accept-language") || undefined,
  };
  const driveSync = await syncConsentToDrive(consent);
  const storedConsent = {
    ...consent,
    driveSyncedAt: driveSync.syncedAt,
    driveSyncError: driveSync.error,
  };

  if (existingIndex >= 0) {
    consents[existingIndex] = storedConsent;
  } else {
    consents.push(storedConsent);
  }

  try {
    await saveWhatsappConsents(consents);
  } catch (error) {
    console.error("No s’ha pogut desar el consentiment de WhatsApp.", error);
    return NextResponse.json(
      { ok: false, error: "Ara mateix no podem registrar l’acceptació. Torna-ho a provar més tard." },
      { status: 503 },
    );
  }
  revalidatePath("/admin");

  return NextResponse.json({ ok: true, url: whatsappUrl });
}
