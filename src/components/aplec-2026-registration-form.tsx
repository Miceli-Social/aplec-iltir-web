"use client";
import { useEffect, useRef, useState } from "react";
import { consentText, volunteerDays, LUNCH_CAPACITY, type FormResult, type RegistrationKind } from "@/lib/aplec-2026-registration";
import { RegistrationPrivacy } from "./aplec-2026-privacy";

export function RegistrationForm({ kind }: { kind: RegistrationKind }) {
  const [result, setResult] = useState<FormResult>({});
  const [pending, setPending] = useState(false);
  const [places, setPlaces] = useState<{ remaining: number; closed: boolean } | null>(null);
  const busy = useRef(false);
  const requestId = useRef("");
  const feedback = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (kind !== "lunch") return;
    let active = true;
    const refresh = async () => {
      try { const response = await fetch("/api/aplec-2026/lunch", { cache: "no-store" }); if (active && response.ok) setPlaces(await response.json()); } catch { /* Submission will verify availability on the server. */ }
    };
    void refresh(); const timer = setInterval(refresh, 30000);
    return () => { active = false; clearInterval(timer); };
  }, [kind]);
  useEffect(() => { if (result.ok || result.errors || result.message) feedback.current?.focus(); }, [result]);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy.current) return;
    busy.current = true; setPending(true); setResult({});
    if (!requestId.current) requestId.current = crypto.randomUUID();
    const form = new FormData(event.currentTarget);
    const payload = { ...Object.fromEntries(form), days: form.getAll("days"), consent: form.get("consent") === "on", requestId: requestId.current };
    try {
      const response = await fetch(`/api/aplec-2026/${kind}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data: FormResult = await response.json();
      setResult(data);
    } catch { setResult({ message: "No hem pogut confirmar l’enviament. Conservem les dades al formulari: torna-ho a provar sense recarregar la pàgina." }); }
    finally { busy.current = false; setPending(false); }
  }
  const errors = result.errors || {};
  const blocked = kind === "lunch" && places && (places.closed || places.remaining === 0);
  function field(name: string, label: string, type = "text", maxLength = 100, min?: number, max?: number, autoComplete?: string) {
    return <div className="aplec-2026-field"><label htmlFor={name}>{label}</label><input id={name} name={name} type={type} required maxLength={maxLength} min={min} max={max} step={type === "number" ? 1 : undefined} autoComplete={autoComplete} aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? `${name}-error` : undefined} defaultValue={name === "vegetarian" ? 0 : name === "people" ? 1 : undefined} />{errors[name] && <p className="form-error" id={`${name}-error`}>{errors[name]}</p>}</div>;
  }
  return <>
    <div ref={feedback} tabIndex={-1} role={result.ok ? "status" : "alert"} className="aplec-2026-form-feedback">
      {result.ok ? <><h2>{kind === "lunch" ? "Reserva registrada — pendent de pagament" : kind === "walk" ? "Hem rebut correctament la teva inscripció" : "Hem rebut la teva disponibilitat"}</h2><p>{kind === "lunch" ? "La reserva no acredita el pagament. Desa el tiquet per consultar les dades de la reserva." : kind === "walk" ? "La teva inscripció a la caminada ha quedat registrada." : "L’organització es posarà en contacte amb tu. Encara no tens cap torn assignat."}</p>{result.ticketUrl && <a className="button button-primary" href={result.ticketUrl}>Veure i descarregar el tiquet</a>}</> : <>{result.message && <p>{result.message}</p>}{result.errors && <><p>Revisa els camps indicats.</p><ul>{Object.entries(errors).map(([key, error]) => <li key={key}><a href={key === "form" || key === "requestId" ? "#registration-form" : `#${key}`}>{error}</a></li>)}</ul></>}</>}
    </div>
    {!result.ok && <form id="registration-form" className="aplec-2026-form" onSubmit={submit} aria-busy={pending}>
      {kind === "lunch" && <p role="status">{places ? places.closed ? "El termini de reserva ha finalitzat." : places.remaining === 0 ? "Reserves completes" : `Queden ${places.remaining} places` : "Comprovarem les places disponibles en enviar la reserva."}</p>}
      <p>{kind === "volunteers" ? "Tots els camps són obligatoris, excepte les observacions." : "Tots els camps són obligatoris."}</p>
      <div className="aplec-2026-form-grid">
        {field("firstName", "Nom", "text", 80, undefined, undefined, "given-name")}
        {field("lastName", "Cognoms", "text", 100, undefined, undefined, "family-name")}
        {field("email", "Correu electrònic", "email", 254, undefined, undefined, "email")}
        {field("phone", "Telèfon", "tel", 30, undefined, undefined, "tel")}
        {kind === "volunteers" ? field("age", "Edat", "number", 3, 1, 120) : kind === "lunch" ? <>{field("people", "Nombre total de persones", "number", 3, 1, places?.remaining ?? LUNCH_CAPACITY)}{field("vegetarian", "Nombre de menús vegetarians", "number", 3, 0, LUNCH_CAPACITY)}</> : null}
      </div>
      {kind === "volunteers" && <>
        <fieldset id="days" aria-describedby={errors.days ? "days-error" : undefined}><legend>Disponibilitat per dies</legend>{volunteerDays.map(day => <label className="aplec-2026-check" key={day}><input type="checkbox" name="days" value={day} />{day}</label>)}{errors.days && <p id="days-error" className="form-error">{errors.days}</p>}</fieldset>
        <label htmlFor="availability">Disponibilitat aproximada / franges horàries</label><textarea id="availability" name="availability" required rows={3} maxLength={500} aria-invalid={Boolean(errors.availability)} aria-describedby={errors.availability ? "availability-error" : undefined} />{errors.availability && <p id="availability-error" className="form-error">{errors.availability}</p>}
        <label htmlFor="observations">Observacions (opcional)</label><textarea id="observations" name="observations" rows={3} maxLength={1500} aria-invalid={Boolean(errors.observations)} aria-describedby={errors.observations ? "observations-error" : undefined} />{errors.observations && <p id="observations-error" className="form-error">{errors.observations}</p>}
      </>}
      <div className="aplec-2026-honeypot" aria-hidden="true"><label htmlFor="website">Deixa aquest camp buit</label><input id="website" name="website" tabIndex={-1} autoComplete="off" /></div>
      <RegistrationPrivacy kind={kind} />
      <label className="aplec-2026-check" htmlFor="consent"><input id="consent" name="consent" type="checkbox" required aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? "consent-error" : undefined} />{consentText[kind]}</label>
      {errors.consent && <p id="consent-error" className="form-error">{errors.consent}</p>}
      <button className="button button-primary" disabled={pending || Boolean(blocked)} type="submit">{pending ? "Desant…" : kind === "lunch" ? "Reserva el dinar" : kind === "walk" ? "Envia la inscripció" : "Envia la disponibilitat"}</button>
    </form>}
  </>;
}
