import Link from "next/link";
import { AplecHomePhotoCarousel } from "@/components/aplec-home-photo-carousel";
import { activityUrl, hasPhotos, homeCarouselPhotos, type ActivityReturn, type AplecReturns } from "@/lib/aplec-2026-returns";

const flickrAlbums = [
  { day: "16", weekday: "Divendres", town: "Lladó", tone: "orange", url: "https://www.flickr.com/photos/205079672@N03/albums/72177720336326467/" },
  { day: "17", weekday: "Dissabte", town: "Navata", tone: "blue", url: "https://www.flickr.com/photos/205079672@N03/albums/72177720336327130/" },
  { day: "18", weekday: "Diumenge", town: "Cabanelles", tone: "lime", url: "https://www.flickr.com/photos/205079672@N03/albums/72177720336334041/" },
];

export function FlickrAlbumLinks() {
  return <>
    <ul className="aplec-album-grid">
      {flickrAlbums.map(({ day, weekday, town, tone, url }) => <li className={`aplec-album-card aplec-album-${tone}`} key={day}>
        <div className="aplec-album-date"><span className="aplec-album-number" aria-hidden="true">{day}</span><time dateTime={`2026-10-${day}`}>{weekday} {day} d’octubre</time></div>
        <h3>{town}</h3>
        <a href={url} target="_blank" rel="noopener noreferrer" aria-label={`Veure totes les fotografies de ${weekday.toLowerCase()} a ${town} (Flickr, pestanya nova)`}>Veure totes les fotografies <span aria-hidden="true">↗</span></a>
      </li>)}
    </ul>
    <p className="aplec-flickr-note">Àlbums a Flickr · S’obren en una pestanya nova.</p>
  </>;
}

export function ActivityPhotoLink({ editorial }: { editorial?: ActivityReturn }) {
  return hasPhotos(editorial) ? <p><Link className="text-link" href={activityUrl(editorial!.activityId)}>Fotos disponibles · Veure fotos →</Link></p> : null;
}
export function ReviuHome({ returns }: { returns: AplecReturns }) {
  const slides = homeCarouselPhotos(returns);
  if (slides.length === 0) return null;
  return <section className="section-shell aplec-reviu-home" aria-labelledby="aplec-reviu-home-title">
    <AplecHomePhotoCarousel slides={slides} />
    <div className="aplec-reviu-home-copy">
      <h2 id="aplec-reviu-home-title">La memòria de les activitats</h2>
      <p className="aplec-reviu-home-lead">Records i veus de l’Aplec que hem compartit.</p>
      <Link className="text-link" href="/aplecs/2026/reviu">Veure fotos i retorns →</Link>

    </div>
  </section>;
}
