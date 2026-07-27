"use client";

import { useEffect, useState } from "react";
import {
  COOKIE_CONSENT_CHANGE_EVENT,
  CookieConsentPreferences,
  readCookieConsent,
  writeCookieConsent,
} from "@/lib/cookie-consent";

export function ConsentYoutubeEmbed({
  videoId,
  title,
  start,
}: {
  videoId: string;
  title: string;
  start?: number;
}) {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    setAllowed(readCookieConsent()?.externalMedia ?? false);
    const handleChange = (event: Event) => {
      const preferences = (event as CustomEvent<CookieConsentPreferences>).detail;
      setAllowed(preferences.externalMedia);
    };
    window.addEventListener(COOKIE_CONSENT_CHANGE_EVENT, handleChange);
    return () => window.removeEventListener(COOKIE_CONSENT_CHANGE_EVENT, handleChange);
  }, []);

  const embedParams = new URLSearchParams({ rel: "0" });
  const watchParams = new URLSearchParams({ v: videoId });
  if (start) {
    embedParams.set("start", String(start));
    watchParams.set("t", `${start}s`);
  }

  const acceptExternalMedia = () => {
    const current = readCookieConsent();
    writeCookieConsent({
      analytics: current?.analytics ?? false,
      externalMedia: true,
    });
  };

  if (allowed) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?${embedParams.toString()}`}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    );
  }

  return (
    <div className="cookie-youtube-placeholder">
      <strong>Contingut extern de YouTube</strong>
      <p>Per reproduir aquest vídeo cal acceptar la categoria de contingut extern.</p>
      <div className="cookie-youtube-actions">
        <button type="button" onClick={acceptExternalMedia}>Acceptar i veure el vídeo</button>
        <a
          href={`https://www.youtube.com/watch?${watchParams.toString()}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Veure’l a YouTube
        </a>
      </div>
    </div>
  );
}
