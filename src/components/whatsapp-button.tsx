"use client";

import { FormEvent, useState } from "react";

export function WhatsappButton({
  url,
  active,
  circleSlug,
  circleName,
}: {
  url?: string;
  active: boolean;
  circleSlug: string;
  circleName: string;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [dni, setDni] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (active && !url) {
    return (
      <span className="button button-disabled" aria-disabled="true" title="Enllaç pendent de publicar">
        Cercle activat · enllaç pendent
      </span>
    );
  }
  if (!active || !url) {
    return (
      <span className="button button-disabled" aria-disabled="true" title="Enllaç pendent d’activació">
        Grup pendent d’activació
      </span>
    );
  }

  const submitConsent = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/whatsapp-consent", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          circleSlug,
          name,
          dni,
          accepted,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok || !result.url) {
        throw new Error(result.error || "No s’ha pogut registrar l’acceptació.");
      }
      window.location.assign(result.url);
      setOpen(false);
      setName("");
      setDni("");
      setAccepted(false);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No s’ha pogut registrar l’acceptació.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button className="button button-whatsapp" type="button" onClick={() => setOpen(true)}>
        Vull participar <span aria-hidden="true">↗</span>
      </button>
      {open && (
        <div className="consent-modal" role="dialog" aria-modal="true" aria-labelledby="consent-title">
          <button className="consent-backdrop" type="button" aria-label="Tancar" onClick={() => setOpen(false)} />
          <form className="consent-dialog" onSubmit={submitConsent}>
            <div className="consent-heading">
              <span className="eyebrow">Protecció de dades</span>
              <h2 id="consent-title">Abans d’entrar al WhatsApp</h2>
              <p>
                Per participar al grup <strong>{circleName}</strong>, cal confirmar que acceptes el tractament de les teves dades segons el full de protecció de dades i drets d’imatge de Miceli Rural Coop, SCCL.
              </p>
            </div>
            <div className="consent-summary">
              <p>
                Les dades s’utilitzaran per gestionar la participació en el procés Iltiŕ i les activitats vinculades. Pots exercir els drets d’accés, rectificació, supressió, oposició, limitació i portabilitat escrivint a <a href="mailto:info@miceli.social">info@miceli.social</a>.
              </p>
              <a href="/documents/drets-imatge-proteccio-dades-miceli-2025.odt" target="_blank" rel="noreferrer">
                Descarregar el full complet de protecció de dades ↗
              </a>
            </div>
            <label>Nom i cognoms
              <input value={name} onChange={(event) => setName(event.target.value)} required autoComplete="name" />
            </label>
            <label>DNI/NIE
              <input value={dni} onChange={(event) => setDni(event.target.value)} required autoComplete="off" />
            </label>
            <label className="check-label consent-check">
              <input checked={accepted} onChange={(event) => setAccepted(event.target.checked)} type="checkbox" required />
              Confirmo que he llegit i accepto el full de protecció de dades i drets d’imatge.
            </label>
            {error && <p className="form-error">{error}</p>}
            <div className="consent-actions">
              <button className="text-link" type="button" onClick={() => setOpen(false)}>Cancel·lar</button>
              <button className="button button-primary" type="submit" disabled={submitting}>
                {submitting ? "Registrant..." : "Acceptar i obrir WhatsApp"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
