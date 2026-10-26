import Image from "next/image";
import Link from "next/link";
import { FlickrAlbumLinks } from "@/components/aplec-return-public";
import { aplecPhotoSizes } from "@/lib/aplec-photo-sizes";
import { getAplecReturns } from "@/lib/content-store";
import { activityUrl, hasPublishedReturns, publishedDays } from "@/lib/aplec-2026-returns";

export const dynamic = "force-dynamic";
export const metadata = { title: "Reviu l’Aplec Iltiŕ 2026" };
export default async function ReviuPage() {
  const returns = await getAplecReturns();
  return <article className="inner-page aplec-reviu-page">
    <Link href="/aplecs/2026">← Programa 2026</Link>
    <header className="aplec-memory-header">
      <span className="eyebrow">16–18 d’octubre · Lladó, Navata i Cabanelles</span>
      <h1>REVIU L’APLEC<br />ILTIŔ 2026</h1>
      <p>Tres dies, tres pobles i moltes maneres de fer comunitat. L’Aplec Iltiŕ 2026 ens ha deixat trobades, converses, celebracions i moments compartits. Recupera’ls a través de les imatges.</p>
      <span className="aplec-memory-symbol" aria-hidden="true" />
    </header>
    <section className="aplec-memory-albums" aria-labelledby="aplec-day-by-day-title">
      <h2 id="aplec-day-by-day-title">L’Aplec, dia a dia</h2>
      <p className="aplec-flickr-note">Àlbums a Flickr · S’obren en una pestanya nova.</p>
      <FlickrAlbumLinks />
    </section>
    {hasPublishedReturns(returns) && <h2 className="aplec-editorial-title">Retorns de les activitats</h2>}
    {publishedDays(returns).map((day) => day.activities.length > 0 && <section key={day.id}>
      <h2>{day.heading}</h2>
      <div className="aplec-photo-grid">{day.activities.map((activity) => <Link className="aplec-photo-card" key={activity.id} href={activityUrl(activity.id)}>
        <Image src={returns[activity.id].cover} alt={activity.title} width={800} height={600} sizes={aplecPhotoSizes(day.activities.length, "card")} />
        <p>{activity.time}</p><h3>{activity.title}</h3><span>Veure fotos i retorn →</span>
      </Link>)}</div>
    </section>)}
  </article>;
}
