"use client";
import { usePathname } from "next/navigation";
import { GoogleAnalytics } from "./google-analytics";
export function PrivacyAwareAnalytics() {
  const pathname = usePathname();
  // Do not load analytics on registration/admin surfaces, especially ticket
  // pages whose fragment contains a private bearer credential.
  if (pathname.startsWith("/admin") || pathname.startsWith("/aplecs/2026/dinar") || pathname.startsWith("/aplecs/2026/voluntariat") || pathname.startsWith("/aplecs/2026/caminada")) return null;
  return <GoogleAnalytics />;
}
