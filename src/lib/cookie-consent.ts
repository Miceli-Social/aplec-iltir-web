export const COOKIE_CONSENT_STORAGE_KEY = "iltir_cookie_consent_v1";
export const COOKIE_CONSENT_VERSION = 1;
export const COOKIE_CONSENT_CHANGE_EVENT = "iltir-cookie-consent-change";
export const COOKIE_SETTINGS_OPEN_EVENT = "iltir-cookie-settings-open";

export type CookieConsentPreferences = {
  version: 1;
  analytics: boolean;
  externalMedia: boolean;
  decidedAt: string;
  expiresAt: string;
};

export type CookieConsentSelection = Pick<
  CookieConsentPreferences,
  "analytics" | "externalMedia"
>;

const isValidDate = (value: unknown): value is string =>
  typeof value === "string" && !Number.isNaN(Date.parse(value));

export function readCookieConsent(): CookieConsentPreferences | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = JSON.parse(
      window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY) || "null",
    ) as Partial<CookieConsentPreferences> | null;

    if (
      !stored ||
      stored.version !== COOKIE_CONSENT_VERSION ||
      typeof stored.analytics !== "boolean" ||
      typeof stored.externalMedia !== "boolean" ||
      !isValidDate(stored.decidedAt) ||
      !isValidDate(stored.expiresAt) ||
      Date.parse(stored.expiresAt) <= Date.now()
    ) {
      return null;
    }

    return stored as CookieConsentPreferences;
  } catch {
    return null;
  }
}

export function writeCookieConsent(
  selection: CookieConsentSelection,
): CookieConsentPreferences {
  const decidedAt = new Date();
  const expiresAt = new Date(decidedAt);
  expiresAt.setFullYear(expiresAt.getFullYear() + 1);

  const preferences: CookieConsentPreferences = {
    version: COOKIE_CONSENT_VERSION,
    analytics: selection.analytics,
    externalMedia: selection.externalMedia,
    decidedAt: decidedAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };

  window.localStorage.setItem(
    COOKIE_CONSENT_STORAGE_KEY,
    JSON.stringify(preferences),
  );
  window.dispatchEvent(
    new CustomEvent<CookieConsentPreferences>(COOKIE_CONSENT_CHANGE_EVENT, {
      detail: preferences,
    }),
  );

  return preferences;
}

export function openCookieSettings() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(COOKIE_SETTINGS_OPEN_EVENT));
  }
}
