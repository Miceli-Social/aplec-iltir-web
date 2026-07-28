"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  COOKIE_CONSENT_CHANGE_EVENT,
  CookieConsentPreferences,
  readCookieConsent,
} from "@/lib/cookie-consent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

const removeAnalyticsCookies = () => {
  const names = document.cookie
    .split(";")
    .map((cookie) => cookie.split("=")[0].trim())
    .filter((name) => name.startsWith("_ga"));
  const hostname = window.location.hostname;
  const rootDomain = hostname.split(".").slice(-2).join(".");
  const domains = ["", hostname, `.${hostname}`, rootDomain, `.${rootDomain}`];

  names.forEach((name) => {
    domains.forEach((domain) => {
      document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax${domain ? `; domain=${domain}` : ""}`;
    });
  });
};

export function GoogleAnalytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [allowed, setAllowed] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const allowedRef = useRef(false);
  const readyRef = useRef(false);
  const configuredRef = useRef(false);
  const lastPageRef = useRef("");

  const sendPageView = () => {
    if (!measurementId || !allowedRef.current || !readyRef.current || !window.gtag) return;
    const pagePath = `${window.location.pathname}${window.location.search}`;
    if (lastPageRef.current === pagePath) return;
    lastPageRef.current = pagePath;
    window.gtag("event", "page_view", {
      page_path: pagePath,
      page_location: window.location.href,
      page_title: document.title,
    });
  };

  useEffect(() => {
    if (!measurementId) return;
    setAllowed(readCookieConsent()?.analytics ?? false);
    setInitialized(true);
    const handleChange = (event: Event) => {
      const preferences = (event as CustomEvent<CookieConsentPreferences>).detail;
      allowedRef.current = preferences.analytics;
      setAllowed(preferences.analytics);
    };
    window.addEventListener(COOKIE_CONSENT_CHANGE_EVENT, handleChange);
    return () => window.removeEventListener(COOKIE_CONSENT_CHANGE_EVENT, handleChange);
  }, [measurementId]);

  useEffect(() => {
    if (!measurementId || !initialized) return;
    const disableKey = `ga-disable-${measurementId}` as const;
    allowedRef.current = allowed;

    if (!allowed) {
      window[disableKey] = true;
      lastPageRef.current = "";
      if (window.gtag) {
        window.gtag("consent", "update", { analytics_storage: "denied" });
      }
      removeAnalyticsCookies();
      return;
    }

    window[disableKey] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() {
      window.dataLayer?.push(arguments);
    };
    window.gtag("consent", "default", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "granted",
    });
    window.gtag("consent", "update", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "granted",
    });

    const configure = () => {
      if (!allowedRef.current) return;
      readyRef.current = true;
      if (!configuredRef.current) {
        window.gtag?.("js", new Date());
        window.gtag?.("config", measurementId, {
          allow_google_signals: false,
          allow_ad_personalization_signals: false,
          send_page_view: false,
        });
        configuredRef.current = true;
      }
      sendPageView();
    };

    const existing = document.querySelector<HTMLScriptElement>(
      `script[data-iltir-ga="${measurementId}"]`,
    );
    if (existing) {
      if (existing.dataset.loaded === "true") configure();
      else existing.addEventListener("load", configure, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    script.dataset.iltirGa = measurementId;
    script.addEventListener("load", () => {
      script.dataset.loaded = "true";
      configure();
    }, { once: true });
    document.head.appendChild(script);
  }, [allowed, initialized, measurementId]);

  useEffect(() => {
    if (allowed) sendPageView();
  }, [allowed, pathname, searchParams, measurementId]);

  return null;
}
