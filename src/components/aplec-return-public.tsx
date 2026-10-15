import Link from "next/link";
import { activityUrl, hasPhotos, hasPublishedReturns, type ActivityReturn, type AplecReturns } from "@/lib/aplec-2026-returns";

export function ActivityPhotoLink({ editorial }: { editorial?: ActivityReturn }) {
  return hasPhotos(editorial) ? <p><Link className="text-link" href={activityUrl(editorial!.activityId)}>Fotos disponibles · Veure fotos →</Link></p> : null;
}
export function ReviuHome({ returns }: { returns: AplecReturns }) {
  return hasPublishedReturns(returns) ? <section className="section-shell aplec-reviu-home">
    <span className="eyebrow">Fotos i retorns</span>
    <h2>Reviu l’Aplec Iltiŕ 2026</h2>
    <p>Ja pots veure les fotografies i els primers retorns de les activitats.</p>
    <Link className="button button-primary" href="/aplecs/2026/reviu">Veure fotos i retorns →</Link>
  </section> : null;
}
