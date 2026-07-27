"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  COOKIE_CONSENT_CHANGE_EVENT,
  COOKIE_SETTINGS_OPEN_EVENT,
  CookieConsentPreferences,
  readCookieConsent,
  writeCookieConsent,
} from "@/lib/cookie-consent";

export function CookieConsent() {
  const [preferences, setPreferences] = useState<CookieConsentPreferences | null>(null);
  const [ready, setReady] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [externalMedia, setExternalMedia] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const stored = readCookieConsent();
    setPreferences(stored);
    setAnalytics(stored?.analytics ?? false);
    setExternalMedia(stored?.externalMedia ?? false);
    setReady(true);

    const handleChange = (event: Event) => {
      const next = (event as CustomEvent<CookieConsentPreferences>).detail;
      setPreferences(next);
      setAnalytics(next.analytics);
      setExternalMedia(next.externalMedia);
    };
    const handleOpen = () => {
      returnFocusRef.current = document.activeElement as HTMLElement | null;
      const current = readCookieConsent();
      setAnalytics(current?.analytics ?? false);
      setExternalMedia(current?.externalMedia ?? false);
      setSettingsOpen(true);
    };

    window.addEventListener(COOKIE_CONSENT_CHANGE_EVENT, handleChange);
    window.addEventListener(COOKIE_SETTINGS_OPEN_EVENT, handleOpen);
    return () => {
      window.removeEventListener(COOKIE_CONSENT_CHANGE_EVENT, handleChange);
      window.removeEventListener(COOKIE_SETTINGS_OPEN_EVENT, handleOpen);
    };
  }, []);

  useEffect(() => {
    if (!settingsOpen) return;
    const dialog = dialogRef.current;
    const firstControl = dialog?.querySelector<HTMLElement>(
      "input:not([disabled]), button, a[href]",
    );
    firstControl?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSettingsOpen(false);
        setAnalytics(preferences?.analytics ?? false);
        setExternalMedia(preferences?.externalMedia ?? false);
        returnFocusRef.current?.focus();
      }
      if (event.key === "Tab" && dialog) {
        const controls = Array.from(
          dialog.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        );
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [preferences, settingsOpen]);

  const save = (nextAnalytics: boolean, nextExternalMedia: boolean) => {
    const next = writeCookieConsent({
      analytics: nextAnalytics,
      externalMedia: nextExternalMedia,
    });
    setPreferences(next);
    setSettingsOpen(false);
    returnFocusRef.current?.focus();
  };

  const closeSettings = () => {
    setSettingsOpen(false);
    setAnalytics(preferences?.analytics ?? false);
    setExternalMedia(preferences?.externalMedia ?? false);
    returnFocusRef.current?.focus();
  };

  const openSettingsFromBanner = (element: HTMLElement) => {
    returnFocusRef.current = element;
    setSettingsOpen(true);
  };

  if (!ready) return null;

  return (
    <>
      {!preferences && !settingsOpen && (
        <aside className="cookie-banner" aria-labelledby="cookie-banner-title">
          <div className="cookie-banner-copy">
            <h2 id="cookie-banner-title">Utilitzem cookies i tecnologies similars</h2>
            <p>
              Les necessàries permeten que el web funcioni. Amb el teu permís, també utilitzarem Google Analytics per entendre com es consulta el web i contingut extern de YouTube per mostrar els vídeos.
            </p>
            <Link href="/cookies">Consulta la política de cookies</Link>
          </div>
          <div className="cookie-banner-actions">
            <button type="button" onClick={() => save(true, true)}>Acceptar-ho tot</button>
            <button type="button" onClick={() => save(false, false)}>Rebutjar-ho tot</button>
            <button
              className="cookie-button-secondary"
              type="button"
              onClick={(event) => openSettingsFromBanner(event.currentTarget)}
            >
              Configurar
            </button>
          </div>
        </aside>
      )}

      {settingsOpen && (
        <div className="cookie-modal">
          <button
            className="cookie-backdrop"
            type="button"
            aria-label="Tancar la configuració de cookies"
            onClick={closeSettings}
          />
          <div
            className="cookie-dialog"
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-settings-title"
            aria-describedby="cookie-settings-description"
          >
            <div className="cookie-dialog-heading">
              <span className="eyebrow">Preferències</span>
              <h2 id="cookie-settings-title">Configuració de cookies</h2>
              <p id="cookie-settings-description">
                Pots acceptar o rebutjar les categories opcionals de manera independent.
              </p>
            </div>
            <div className="cookie-category">
              <div>
                <h3>Cookies necessàries</h3>
                <p>Inclouen la preferència de consentiment i la sessió de l’accés intern.</p>
              </div>
              <strong>Sempre actives</strong>
            </div>
            <label className="cookie-category cookie-category-editable">
              <span>
                <strong>Analítica</strong>
                <small>Permet utilitzar Google Analytics per obtenir estadístiques agregades sobre l’ús del web.</small>
              </span>
              <input
                type="checkbox"
                checked={analytics}
                onChange={(event) => setAnalytics(event.target.checked)}
                aria-label="Permetre l’analítica"
              />
            </label>
            <label className="cookie-category cookie-category-editable">
              <span>
                <strong>Contingut extern</strong>
                <small>Permet carregar els vídeos incrustats de YouTube.</small>
              </span>
              <input
                type="checkbox"
                checked={externalMedia}
                onChange={(event) => setExternalMedia(event.target.checked)}
                aria-label="Permetre el contingut extern de YouTube"
              />
            </label>
            <div className="cookie-dialog-actions">
              <button type="button" onClick={() => save(analytics, externalMedia)}>
                Desar la selecció
              </button>
              <button type="button" onClick={() => save(true, true)}>Acceptar-ho tot</button>
              <button type="button" onClick={() => save(false, false)}>Rebutjar-ho tot</button>
            </div>
            <button className="cookie-dialog-close" type="button" onClick={closeSettings}>
              Tancar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
