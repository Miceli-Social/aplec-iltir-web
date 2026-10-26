import Link from "next/link";
import { AplecHomePhotoCarousel } from "@/components/aplec-home-photo-carousel";
import { activityUrl, hasPhotos, homeCarouselPhotos, type ActivityReturn, type AplecReturns } from "@/lib/aplec-2026-returns";

export function FlickrAlbumLinks() {
  return <ul className="aplec-flickr-links">
    <li><a className="text-link" href="https://www.flickr.com/photos/205079672@N03/albums/72177720336326467/" target="_blank" rel="noopener noreferrer">Divendres — Lladó</a></li>
    <li><a className="text-link" href="https://www.flickr.com/photos/205079672@N03/albums/72177720336327130/" target="_blank" rel="noopener noreferrer">Dissabte — Navata</a></li>
    <li><a className="text-link" href="https://www.flickr.com/photos/205079672@N03/albums/72177720336334041/" target="_blank" rel="noopener noreferrer">Diumenge — Cabanelles</a></li>
  </ul>;
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
      <h2 id="aplec-reviu-home-title">REVIU L’APLEC ILTIŔ 2026</h2>
      <p className="aplec-reviu-home-lead">Les primeres imatges de l’Aplec ja són aquí.</p>
      <Link className="button button-primary" href="/aplecs/2026/reviu">Veure fotos i retorns →</Link>
      <div className="aplec-flickr-home">
        <p className="aplec-flickr-note">Àlbums a Flickr · S’obren en una pestanya nova.</p>
        <FlickrAlbumLinks />
      </div>
    </div>
  </section>;
}
