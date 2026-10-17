import Link from "next/link";
import Image from "next/image";
import { activityUrl, hasPhotos, publishedDays, type ActivityReturn, type AplecReturns } from "@/lib/aplec-2026-returns";

export function ActivityPhotoLink({ editorial }: { editorial?: ActivityReturn }) {
  return hasPhotos(editorial) ? <p><Link className="text-link" href={activityUrl(editorial!.activityId)}>Fotos disponibles · Veure fotos →</Link></p> : null;
}
export function ReviuHome({ returns }: { returns: AplecReturns }) {
  // Publication dates are not exposed by the return model: use programme order.
  const activity = publishedDays(returns).flatMap((day) => day.activities).at(-1);
  if (!activity) return null;
  return <section className="section-shell aplec-reviu-home" aria-labelledby="aplec-reviu-home-title">
    <div className="aplec-reviu-home-photo">
      <Image src={returns[activity.id].cover} alt={`Fotografia de ${activity.title}`} width={1200} height={900}
        sizes="(max-width: 720px) calc(100vw - 32px), (max-width: 1448px) calc((100vw - 48px) * 0.6), 840px" />
    </div>
    <div className="aplec-reviu-home-copy">
      <h2 id="aplec-reviu-home-title">REVIU L’APLEC ILTIŔ 2026</h2>
      <p className="aplec-reviu-home-lead">Les primeres imatges de l’Aplec ja són aquí.</p>
      <Link className="button button-primary" href="/aplecs/2026/reviu">Veure fotos i retorns →</Link>
      <p className="aplec-reviu-home-caption"><span>{activity.time}</span>{activity.title}</p>
    </div>
  </section>;
}
