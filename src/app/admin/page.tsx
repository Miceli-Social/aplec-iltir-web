import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import {
  addDocumentLink,
  addEvent,
  deleteEvent,
  loginAdmin,
  logoutAdmin,
  removeDocument,
  saveCircle,
  uploadDocument,
} from "@/app/admin/actions";
import { ADMIN_COOKIE, isAdminConfigured, isValidAdminToken } from "@/lib/admin-auth";
import { getEditorialState, hasContentStore } from "@/lib/content-store";
import { getWhatsappConsents } from "@/lib/consent-store";
import { getCircles, getEvents } from "@/lib/remote-content";
import { adminDateTimeFormatter, toDateTimeLocal } from "@/lib/date-time";

export const metadata: Metadata = {
  title: "Administració",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

const messages: Record<string, string> = {
  circle: "Els continguts del cercle s’han actualitzat.",
  event: "L’esdeveniment s’ha publicat.",
  "event-deleted": "L’esdeveniment s’ha eliminat.",
  document: "L’acta s’ha publicat.",
  "document-deleted": "El document s’ha retirat.",
};

const errors: Record<string, string> = {
  circle: "No s’ha pogut identificar el cercle.",
  event: "Revisa el títol, la data i el cercle de l’esdeveniment.",
  document: "El PDF ha de pesar menys de 8 MB.",
  "document-link": "L’enllaç ha de començar per https://.",
  "public-document": "Confirma que és una acta d’una sessió pública.",
  session: "La sessió ha caducat. Torna a entrar.",
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
    ok?: string;
    edit?: string;
    event?: string;
    documents?: string;
  }>;
}) {
  const configured = isAdminConfigured();
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  const loggedIn = isValidAdminToken(token);
  const params = await searchParams;

  if (!configured) {
    return (
      <div className="admin-login">
        <span className="eyebrow">Administració privada</span>
        <h1>Falta configurar l’accés.</h1>
        <p>Afegeix `ADMIN_PASSWORD` i `ADMIN_SESSION_SECRET` a l’entorn del projecte.</p>
      </div>
    );
  }

  if (!loggedIn) {
    return (
      <div className="admin-login">
        <span className="eyebrow">Administració privada</span>
        <h1>Entra al tauler d’Iltiŕ.</h1>
        <p>Aquest espai permet modificar directament la web pública.</p>
        <form action={loginAdmin}>
          <label htmlFor="password">Contrasenya</label>
          <input id="password" name="password" type="password" required autoComplete="current-password" />
          {params.error && <span className="form-error">La contrasenya no és correcta.</span>}
          <button className="button button-primary" type="submit">Entrar</button>
        </form>
      </div>
    );
  }

  const [circles, events, state, whatsappConsents] = await Promise.all([
    getCircles({ freshEditorial: true, includeHidden: true }),
    getEvents({ freshEditorial: true }),
    getEditorialState({ fresh: true }),
    getWhatsappConsents(),
  ]);
  const selectedCircle =
    circles.find((circle) => circle.slug === params.edit) || circles[0];
  const selectedEvent = events.find((event) => event.id === params.event);
  const selectedDocumentCircle =
    circles.find((circle) => circle.slug === params.documents) || circles[0];
  const editableDocumentUrls = new Set(
    (state.documents[selectedDocumentCircle.slug] || []).map((document) => document.url),
  );

  return (
    <div className="inner-page admin-page">
      <header className="admin-header">
        <div>
          <span className="eyebrow">Administració privada</span>
          <h1>Edita la web.</h1>
          <p>Els canvis es desen i apareixen directament a la pàgina pública.</p>
        </div>
        <form action={logoutAdmin}><button className="text-link" type="submit">Tancar sessió</button></form>
      </header>

      {!hasContentStore() && (
        <p className="admin-alert error">L’emmagatzematge no està connectat. Els formularis no podran desar canvis.</p>
      )}
      {params.ok && <p className="admin-alert success">{messages[params.ok] || "Canvis desats."}</p>}
      {params.error && params.error !== "1" && (
        <p className="admin-alert error">{errors[params.error] || "No s’ha pogut completar l’acció."}</p>
      )}

      <nav className="admin-section-nav" aria-label="Seccions de l’editor">
        <a href="#continguts">Continguts</a>
        <a href="#agenda-admin">Agenda</a>
        <a href="#actes-admin">Actes</a>
        <a href="#dades-admin">Protecció de dades</a>
        <Link href="/" target="_blank">Veure la web ↗</Link>
      </nav>

      <section id="continguts" className="admin-editor-section">
        <div className="admin-section-heading">
          <span className="eyebrow">01 · Continguts</span>
          <h2>Edita un cercle</h2>
          <p>Selecciona un espai i modifica els textos, els propers passos o l’accés a WhatsApp.</p>
        </div>
        <div className="admin-editor-layout">
          <aside className="admin-circle-picker">
            {circles.map((circle) => (
              <Link
                href={`/admin?edit=${circle.slug}#continguts`}
                className={circle.slug === selectedCircle.slug ? "active" : ""}
                key={circle.slug}
              >
                {circle.name}
              </Link>
            ))}
          </aside>
          <form action={saveCircle} className="admin-form" key={selectedCircle.slug}>
            <input type="hidden" name="slug" value={selectedCircle.slug} />
            <div className="form-heading">
              <div><span>Editant</span><h3>{selectedCircle.name}</h3></div>
              <Link href={`/cercles/${selectedCircle.slug}`} target="_blank">Previsualitza ↗</Link>
            </div>
            <label>Resum curt
              <textarea name="summary" rows={3} defaultValue={selectedCircle.summary} required />
            </label>
            <label>Propòsit
              <textarea name="purpose" rows={4} defaultValue={selectedCircle.purpose} required />
            </label>
            <div className="admin-form-columns">
              <label>En què estem <small>Una línia per element</small>
                <textarea name="workingOn" rows={7} defaultValue={selectedCircle.workingOn.join("\n")} />
              </label>
              <label>Propers passos <small>Una línia per element</small>
                <textarea name="nextSteps" rows={7} defaultValue={selectedCircle.nextSteps.join("\n")} />
              </label>
            </div>
            <label>Enllaç del grup de WhatsApp
              <input name="whatsappUrl" type="url" defaultValue={selectedCircle.whatsappUrl || ""} placeholder="https://chat.whatsapp.com/..." />
            </label>
            <label className="check-label">
              <input name="whatsappActive" type="checkbox" defaultChecked={selectedCircle.whatsappActive} />
              Mostrar el botó «Vull participar»
            </label>
            <button className="button button-primary" type="submit">Desar i publicar</button>
          </form>
        </div>
      </section>

      <section id="agenda-admin" className="admin-editor-section">
        <div className="admin-section-heading">
          <span className="eyebrow">02 · Agenda</span>
          <h2>Gestiona les trobades</h2>
          <p>Crea una trobada nova o edita qualsevol de les que ja estan publicades.</p>
        </div>
        <div className="admin-split">
          <form action={addEvent} className="admin-form" key={selectedEvent?.id || "new-event"}>
            {selectedEvent && <input type="hidden" name="eventId" value={selectedEvent.id} />}
            <div className="form-heading">
              <div>
                <span>{selectedEvent ? "Editant trobada" : "Nova trobada"}</span>
                <h3>{selectedEvent?.title || "Afegeix una trobada"}</h3>
              </div>
              {selectedEvent && <Link href="/admin#agenda-admin">Cancel·la</Link>}
            </div>
            <label>Títol
              <input name="title" required placeholder="Trobada oberta del cercle..." defaultValue={selectedEvent?.title || ""} />
            </label>
            <div className="admin-form-columns">
              <label>Data i hora
                <input name="start" type="datetime-local" required defaultValue={selectedEvent ? toDateTimeLocal(selectedEvent.start) : ""} />
              </label>
              <label>Lloc
                <input name="location" placeholder="Sala, municipi..." defaultValue={selectedEvent?.location || ""} />
              </label>
            </div>
            <label>Cercle
              <select name="circleSlug" required defaultValue={selectedEvent?.circleSlug || ""}>
                <option value="" disabled>Selecciona un cercle</option>
                {circles.map((circle) => <option value={circle.slug} key={circle.slug}>{circle.name}</option>)}
              </select>
            </label>
            <label>Informació complementària
              <textarea name="description" rows={3} defaultValue={selectedEvent?.description || ""} />
            </label>
            <label className="check-label">
              <input name="allDay" type="checkbox" defaultChecked={selectedEvent?.allDay} />
              Encara no hi ha hora confirmada
            </label>
            <button className="button button-primary" type="submit">
              {selectedEvent ? "Desar els canvis" : "Publicar trobada"}
            </button>
          </form>
          <div className="admin-current-list">
            <h3>Trobades publicades</h3>
            {events.length ? events.map((event) => (
              <article className={event.id === selectedEvent?.id ? "is-editing" : ""} key={event.id}>
                <div>
                  <strong>{event.title}</strong>
                  <small>{adminDateTimeFormatter.format(new Date(event.start))} · {circles.find((circle) => circle.slug === event.circleSlug)?.name || "Sense grup assignat"}</small>
                </div>
                <div className="admin-item-actions">
                  <Link href={`/admin?event=${encodeURIComponent(event.id)}#agenda-admin`}>Editar</Link>
                  {state.events.some((item) => item.id === event.id) && (
                    <form action={deleteEvent}>
                      <input type="hidden" name="id" value={event.id} />
                      <button type="submit">Eliminar</button>
                    </form>
                  )}
                </div>
              </article>
            )) : <p>Encara no hi ha cap trobada publicada.</p>}
          </div>
        </div>
      </section>

      <section id="actes-admin" className="admin-editor-section">
        <div className="admin-section-heading">
          <span className="eyebrow">03 · Actes públiques</span>
          <h2>Actes per grup de treball</h2>
          <p>Selecciona un grup per publicar-hi una acta i consultar només els documents que li corresponen.</p>
        </div>
        <nav className="admin-workgroup-tabs" aria-label="Grup de treball de les actes">
          {circles.map((circle) => (
            <Link
              href={`/admin?documents=${circle.slug}#actes-admin`}
              className={circle.slug === selectedDocumentCircle.slug ? "active" : ""}
              key={circle.slug}
            >
              {circle.name}
            </Link>
          ))}
        </nav>
        <div className="admin-split">
          <div className="document-form-stack">
            <form action={uploadDocument} className="admin-form">
              <h3>Pujar un PDF</h3>
              <input type="hidden" name="circleSlug" value={selectedDocumentCircle.slug} />
              <p className="form-context">Es publicarà a <strong>{selectedDocumentCircle.name}</strong>.</p>
              <label>Títol públic
                <input name="title" required placeholder="Acta de la trobada oberta..." />
              </label>
              <label>Fitxer PDF <small>Màxim 8 MB</small>
                <input name="file" type="file" accept="application/pdf" required />
              </label>
              <label className="check-label public-confirm">
                <input name="publicConfirmed" type="checkbox" required />
                Confirmo que és una sessió pública amb la població
              </label>
              <button className="button button-primary" type="submit">Pujar i publicar</button>
            </form>
            <form action={addDocumentLink} className="admin-form">
              <h3>O afegir un enllaç</h3>
              <input type="hidden" name="circleSlug" value={selectedDocumentCircle.slug} />
              <p className="form-context">Es publicarà a <strong>{selectedDocumentCircle.name}</strong>.</p>
              <label>Títol públic<input name="title" required /></label>
              <label>Enllaç de Google Docs o CryptPad<input name="url" type="url" required placeholder="https://..." /></label>
              <label className="check-label public-confirm">
                <input name="publicConfirmed" type="checkbox" required />
                Confirmo que és una sessió pública amb la població
              </label>
              <button className="button button-primary" type="submit">Publicar enllaç</button>
            </form>
          </div>
          <div className="admin-current-list">
            <h3>Actes de {selectedDocumentCircle.name}</h3>
            {selectedDocumentCircle.documents.length ? selectedDocumentCircle.documents.map((document) => (
              <article key={document.url}>
                <div>
                  <strong>{document.title}</strong>
                  <small>{document.date || selectedDocumentCircle.name}</small>
                </div>
                {editableDocumentUrls.has(document.url) ? (
                  <form action={removeDocument}>
                    <input type="hidden" name="circleSlug" value={selectedDocumentCircle.slug} />
                    <input type="hidden" name="url" value={document.url} />
                    <button type="submit">Retirar</button>
                  </form>
                ) : <a href={document.url} target="_blank" rel="noreferrer">Obrir ↗</a>}
              </article>
            )) : <p>Encara no hi ha cap acta publicada en aquest grup.</p>}
          </div>
        </div>
      </section>

      <section id="dades-admin" className="admin-editor-section">
        <div className="admin-section-heading">
          <span className="eyebrow">04 · Protecció de dades</span>
          <h2>Acceptacions per entrar als WhatsApp</h2>
          <p>Registre de persones que han confirmat el full de protecció de dades i drets d’imatge abans d’accedir a un grup.</p>
        </div>
        <div className="admin-consent-list">
          {whatsappConsents.length ? (
            [...whatsappConsents]
              .sort((a, b) => b.acceptedAt.localeCompare(a.acceptedAt))
              .map((consent) => (
                <article key={consent.id}>
                  <div>
                    <strong>{consent.name}</strong>
                    <span>{consent.dni}</span>
                  </div>
                <div>
                  <small>{consent.circleName}</small>
                  <time dateTime={consent.acceptedAt}>
                    {adminDateTimeFormatter.format(new Date(consent.acceptedAt))}
                  </time>
                  <small>{consent.userAgent || "Dispositiu no informat"}</small>
                  <small>{consent.ipAddress ? `IP: ${consent.ipAddress}` : "IP no informada"}</small>
                  <small>
                    {consent.driveSyncedAt
                      ? `Drive sincronitzat: ${adminDateTimeFormatter.format(new Date(consent.driveSyncedAt))}`
                      : `Drive pendent${consent.driveSyncError ? ` · ${consent.driveSyncError}` : ""}`}
                  </small>
                </div>
              </article>
              ))
          ) : (
            <p className="empty-state">Encara no hi ha cap acceptació registrada.</p>
          )}
        </div>
      </section>
    </div>
  );
}
