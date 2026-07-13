import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE = "iltir_admin";

const secret = () =>
  process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";

export const isAdminConfigured = () => Boolean(process.env.ADMIN_PASSWORD && secret());

export const createAdminToken = () =>
  createHmac("sha256", secret()).update("iltir-admin-session-v1").digest("hex");

export const isValidAdminToken = (value?: string) => {
  if (!value || !isAdminConfigured()) return false;
  const expected = createAdminToken();
  if (value.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(value), Buffer.from(expected));
};
