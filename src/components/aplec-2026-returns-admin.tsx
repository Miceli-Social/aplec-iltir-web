"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { aplecPhotoSizes } from "@/lib/aplec-photo-sizes";
import { aplec2026Program, type ProgramActivity } from "@/lib/aplec-2026-program";
import { activityUrl, MAX_PHOTOS, type ActivityReturn, type AplecReturns } from "@/lib/aplec-2026-returns";
import { uploadAplecPhoto } from "@/lib/aplec-photo-upload";
import { publishAplecReturn } from "@/app/admin/aplec-return-actions";

function ReturnEditor({ activity, initial }: { activity: ProgramActivity; initial?: ActivityReturn }) {
  const [photos, setPhotos] = useState(initial?.photos ?? []);
  const [cover, setCover] = useState(initial?.cover ?? "");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function uploadPhotos(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const files = new FormData(form).getAll("photos").filter((file): file is File => file instanceof File && file.size > 0);
    if (!files.length || photos.length + files.length > MAX_PHOTOS) { setMessage(`Selecciona fotos fins a un màxim de ${MAX_PHOTOS} en total.`); return; }
    setBusy(true);
    try {
      for (const [index, file] of files.entries()) {
        setMessage(`Pujant fotografia ${index + 1} de ${files.length}…`);
        const url = await uploadAplecPhoto(file, activity.id);
        setPhotos((previous) => [...previous, url]);
        setCover((previous) => previous || url);
      }
      form.reset();
      setMessage("Fotos pujades. Tria la principal, indica el crèdit i desa per publicar.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "La pujada ha fallat. Les fotos ja pujades es conserven; selecciona només les pendents.");
    } finally { setBusy(false); }
  }
  async function publish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setBusy(true); setMessage("Publicant…");
    try {
      const result = await publishAplecReturn({ activityId: activity.id, photos, cover,
        credit: String(data.get("credit") || ""),
        ideas: [0, 1, 2].map((index) => String(data.get(`idea${index}`) || "")),
        quote: String(data.get("quote") || ""), videoUrl: String(data.get("videoUrl") || "") });
      setMessage(result.error || "Publicat. Les fotos i el retorn ja es poden consultar al web.");
    } catch { setMessage("No s’ha pogut publicar. Conservem les dades perquè ho tornis a provar."); }
    finally { setBusy(false); }
  }
  return <div className="aplec-return-editor">
    <p>{activity.time} · {activity.location}</p>
    <form onSubmit={uploadPhotos} className="admin-form">
      <label>Fotografies (fins a {MAX_PHOTOS} fotos; màxim 15 MB per foto)
        <input name="photos" type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif,image/gif" required disabled={busy} />
      </label>
      <button className="button button-primary" disabled={busy || photos.length >= MAX_PHOTOS}>Pujar fotografies seleccionades</button>
    </form>
    <form onSubmit={publish} className="admin-form">
      <fieldset disabled={busy}>
        <legend>Foto principal i galeria</legend>
        <div className="aplec-photo-grid">
          {photos.map((url, index) => <div key={url}>
            <label><Image src={url} alt={`Fotografia ${index + 1}`} width={480} height={320} sizes={aplecPhotoSizes(photos.length, "admin")} />
              <input type="radio" name="cover" checked={cover === url} onChange={() => setCover(url)} /> Principal · Foto {index + 1}
            </label>
            <button type="button" onClick={() => { setPhotos(photos.filter((photo) => photo !== url)); if (cover === url) setCover(photos.find((photo) => photo !== url) || ""); }}>Retirar de la galeria</button>
          </div>)}
        </div>
        <label>Autoria / crèdit fotogràfic<input name="credit" required maxLength={2000} defaultValue={initial?.credit} /></label>
        {[0, 1, 2].map((index) => <label key={index}>Idea clau {index + 1} (opcional)<input name={`idea${index}`} maxLength={2000} defaultValue={initial?.ideas[index]} /></label>)}
        <label>Cita destacada (opcional)<textarea name="quote" maxLength={2000} defaultValue={initial?.quote} /></label>
        <label>URL del vídeo (opcional)<input name="videoUrl" type="url" placeholder="https://…" maxLength={2000} defaultValue={initial?.videoUrl} /></label>
      </fieldset>
      <button className="button button-primary" disabled={busy || !photos.length}>Desar i publicar</button>
    </form>
    <p role="status" aria-live="polite">{message}</p>
    <a href={activityUrl(activity.id)} target="_blank" rel="noopener noreferrer">Veure la fitxa pública ↗</a>
  </div>;
}

export function AplecReturnsAdmin({ returns }: { returns: AplecReturns }) {
  return <section id="retorns-aplec" className="admin-editor-section">
    <h2>Aplec 2026 · Fotos i retorns</h2>
    <p>Selecciona una activitat, puja les fotos i publica el retorn. Les fotografies pujades són públiques.</p>
    {aplec2026Program.map((day) => <section key={day.id}>
      <h3>{day.heading}</h3>
      {day.activities.map((activity) => <details className="aplec-return-picker" key={activity.id}>
        <summary>{activity.time} · {activity.title}{returns[activity.id] ? " · Publicat" : ""}</summary>
        <ReturnEditor activity={activity} initial={returns[activity.id]} />
      </details>)}
    </section>)}
  </section>;
}
