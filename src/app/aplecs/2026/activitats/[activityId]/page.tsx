import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAplecReturns } from "@/lib/content-store";
import { activityDetail, findActivity } from "@/lib/aplec-2026-returns";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ activityId: string }> };
export async function generateMetadata({ params }: Props) {
  const { activityId } = await params;
  return { title: findActivity(activityId)?.activity.title || "Activitat no trobada" };
}
export default async function ActivityPage({ params }: Props) {
  const { activityId } = await params;
  if (!findActivity(activityId)) notFound();
  const detail = activityDetail(activityId, await getAplecReturns())!;
  const { day, activity, editorial } = detail;
  const photos = editorial ? [editorial.cover, ...editorial.photos.filter((photo) => photo !== editorial.cover)] : [];
  return <article className="inner-page aplec-reviu-page">
    <nav><Link href="/aplecs/2026/reviu">← Reviu l’Aplec</Link> · <Link href="/aplecs/2026">Programa</Link></nav>
    <p className="eyebrow">{day.heading} · {activity.time}</p>
    <h1>{activity.title}</h1><p>{activity.location}</p>
    {photos.length > 0 ? <section aria-label="Fotografies de l’activitat">
      <p>Obre qualsevol fotografia per veure i desar l’original.</p>
      <div className="aplec-photo-gallery">{photos.map((url, index) => <a href={url} key={url} target="_blank" rel="noopener noreferrer" aria-label={`Obre la fotografia ${index + 1} a mida completa`}>
        <Image src={url} alt={`${activity.title} · Fotografia ${index + 1}`} width={1200} height={800} unoptimized loading={index === 0 ? "eager" : "lazy"} />
      </a>)}</div><p>Fotografies: {editorial!.credit}</p>
    </section> : <p>Encara no s’han publicat fotografies d’aquesta activitat.</p>}
    {editorial?.ideas.length ? <section><h2>Idees clau</h2><ul>{editorial.ideas.map((idea, index) => <li key={index}>{idea}</li>)}</ul></section> : null}
    {editorial?.quote && <blockquote>{editorial.quote}</blockquote>}
    {editorial?.videoUrl && <p><a href={editorial.videoUrl} target="_blank" rel="noopener noreferrer">Veure el vídeo ↗</a></p>}
    <section className="aplec-return-description"><h2>Sobre l’activitat</h2>
      {activity.information && <p>{activity.information}</p>}
      {activity.moreInfoLead && <p><strong>{activity.moreInfoLead}</strong></p>}
      {activity.moreInfo && <p>{activity.moreInfo}</p>}
    </section>
  </article>;
}
