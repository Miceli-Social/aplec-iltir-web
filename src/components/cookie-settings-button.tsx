"use client";

import { openCookieSettings } from "@/lib/cookie-consent";

export function CookieSettingsButton({
  className,
}: {
  className?: string;
}) {
  return (
    <button className={className} type="button" onClick={openCookieSettings}>
      Configurar cookies
    </button>
  );
}
