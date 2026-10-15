import Image from "next/image";
import Link from "next/link";
import { getAplecReturns } from "@/lib/content-store";
import { activityUrl, hasPublishedReturns, publishedDays } from "@/lib/aplec-2026-returns";

export const dynamic = "force-dynamic";
export const metadata = { title: "Reviu l’Aplec Iltiŕ 2026" };
export default async function ReviuPage() {
  const returns = await getAplecReturns();
  return <article className="inner-page aplec-reviu-page">
    <Link href="/aplecs/2026">← Programa 2026</Link>
    <h1>Reviu l’Aplec Iltiŕ 2026</h1>
    {!hasPublishedReturns(returns) && <p>Les fotografies de les activitats es publicaran aquí.</p>}
    {publishedDays(returns).map((day) => day.activities.length > 0 && <section key={day.id}>
      <h2>{day.heading}</h2>
      <div className="aplec-photo-grid">{day.activities.map((activity) => <Link className="aplec-photo-card" key={activity.id} href={activityUrl(activity.id)}>
        <Image src={returns[activity.id].cover} alt={activity.title} width={800} height={600} unoptimized />
        <p>{activity.time}</p><h3>{activity.title}</h3><span>Veure fotos i retorn →</span>
      </Link>)}</div>
    </section>)}
  </article>;
}
