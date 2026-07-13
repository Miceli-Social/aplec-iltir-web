import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";
import { put } from "@vercel/blob";
import type { WhatsappConsent } from "@/lib/types";

const CONSENT_PATH = "iltir/private/whatsapp-consents.enc.json";

type EncryptedPayload = {
  version: 1;
  iv: string;
  tag: string;
  data: string;
};

export class ConsentDecryptionError extends Error {
  constructor() {
    super("No s'han pogut desxifrar els consentiments existents.");
    this.name = "ConsentDecryptionError";
  }
}

export const isConsentDecryptionError = (error: unknown) =>
  error instanceof ConsentDecryptionError;

const getStoreIdFromToken = () => {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  const storeId = token?.split("_")[3];
  return storeId || undefined;
};

const getConsentUrl = () => {
  const storeId = getStoreIdFromToken();
  if (!storeId) return undefined;
  return `https://${storeId}.public.blob.vercel-storage.com/${CONSENT_PATH}`;
};

const getEncryptionKey = () => {
  const secret = process.env.CONSENT_ENCRYPTION_SECRET || process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("Falta configurar CONSENT_ENCRYPTION_SECRET o ADMIN_SESSION_SECRET.");
  }
  return createHash("sha256").update(secret).digest();
};

const encryptConsents = (consents: WhatsappConsent[]): EncryptedPayload => {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getEncryptionKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(consents), "utf8"),
    cipher.final(),
  ]);
  return {
    version: 1,
    iv: iv.toString("base64"),
    tag: cipher.getAuthTag().toString("base64"),
    data: encrypted.toString("base64"),
  };
};

const decryptConsents = (payload: EncryptedPayload): WhatsappConsent[] => {
  const decipher = createDecipheriv(
    "aes-256-gcm",
    getEncryptionKey(),
    Buffer.from(payload.iv, "base64"),
  );
  decipher.setAuthTag(Buffer.from(payload.tag, "base64"));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(payload.data, "base64")),
    decipher.final(),
  ]).toString("utf8");
  return JSON.parse(decrypted) as WhatsappConsent[];
};

export const hasConsentStore = () =>
  Boolean(process.env.BLOB_READ_WRITE_TOKEN && (process.env.CONSENT_ENCRYPTION_SECRET || process.env.ADMIN_SESSION_SECRET));

export async function getWhatsappConsents(options?: {
  failOnUnreadable?: boolean;
}): Promise<WhatsappConsent[]> {
  if (!hasConsentStore()) return [];
  const url = getConsentUrl();
  if (!url) return [];
  const response = await fetch(url, { cache: "no-store" });
  if (response.status === 404 || !response.ok) return [];
  try {
    return decryptConsents((await response.json()) as EncryptedPayload);
  } catch (error) {
    console.warn("No s'han pogut desxifrar els consentiments existents.", error);
    if (options?.failOnUnreadable) {
      throw new ConsentDecryptionError();
    }
    return [];
  }
}

export async function saveWhatsappConsents(consents: WhatsappConsent[]) {
  if (!hasConsentStore()) {
    throw new Error("L’emmagatzematge xifrat d’acceptacions no està configurat.");
  }
  await put(CONSENT_PATH, JSON.stringify(encryptConsents(consents)), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json; charset=utf-8",
    cacheControlMaxAge: 0,
  });
}
