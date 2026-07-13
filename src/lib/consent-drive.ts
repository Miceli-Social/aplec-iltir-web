import type { WhatsappConsent } from "@/lib/types";

export const hasConsentDriveSync = () => Boolean(process.env.CONSENT_GOOGLE_SCRIPT_URL);

export async function syncConsentToDrive(consent: WhatsappConsent) {
  const url = process.env.CONSENT_GOOGLE_SCRIPT_URL;
  if (!url) return { syncedAt: undefined, error: "CONSENT_GOOGLE_SCRIPT_URL no configurat" };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        secret: process.env.CONSENT_GOOGLE_SCRIPT_SECRET || "",
        ...consent,
      }),
    });
    if (!response.ok) {
      return { syncedAt: undefined, error: `Google Script HTTP ${response.status}` };
    }
    return { syncedAt: new Date().toISOString(), error: undefined };
  } catch (error) {
    return {
      syncedAt: undefined,
      error: error instanceof Error ? error.message : "Error desconegut sincronitzant amb Drive",
    };
  }
}
