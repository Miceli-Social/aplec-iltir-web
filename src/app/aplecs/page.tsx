import type { Metadata } from "next";
import { ArrowIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Els Aplecs Iltiŕ",
  description:
    "Descobreix l’Aplec Iltiŕ 2026, que se celebrarà el 16, 17 i 18 d’octubre, i l’arxiu de les edicions anteriors.",
};

const editions = [
  {
    id: "aplec-2025",
    year: "2025",
    title: "Aplec Iltiŕ 2025",
    text: "Vídeo resum de l’edició 2025.",
    youtubeId: "NFfQnizlCIk",
    moreUrl: "https://balkar.earth/apleciltir/",
  },
  {
    id: "aplec-2024",
    year: "2024",
    title: "Aplec Iltiŕ 2024",
    text: "Vídeo resum de l’edició 2024.",
    youtubeId: "o1QDd4wzJ4Q",
    start: 6,
    moreUrl: "https://balkar.earth/apleciltir-2024/",
  },
  {
    id: "aplec-2023",
    year: "2023",
    title: "Aplec Iltiŕ 2023",
    text: "Vídeo resum de l’edició 2023.",
    youtubeId: "5bQgsoT8nts",
    start: 22,
    moreUrl: "https://balkar.earth/iltirfestival/",
  },
];

export default function AplecsPage() {
  return (
    <main className="aplecs-page">
      <header className="aplecs-hero">
        <div className="aplecs-hero-content">
          <span className="eyebrow light">Aplec Iltiŕ</span>
          <h1>Els Aplecs Iltiŕ</h1>
          <p>
            Una trobada compartida perquè els pobles es trobin, generin
            aprenentatges i celebrin el vincle amb el territori.
          </p>
        </div>
      </header>

      <section
        className="aplecs-current-section section-shell"
        aria-labelledby="aplecs-current-title"
      >
        <div className="aplecs-current-card">
          <div className="aplecs-current-heading">
            <span className="aplecs-current-label">Proper Aplec</span>
            <h2 id="aplecs-current-title">Aplec Iltiŕ 2026</h2>
            <p>
              Tres dies per compartir les propostes treballades des dels pobles,
              generar nous aprenentatges i celebrar el vincle amb el territori.
            </p>
          </div>
          <div className="aplecs-current-details">
            <div className="aplecs-current-date">
              <strong>16 · 17 · 18</strong>
              <span>octubre de 2026</span>
            </div>
            <p className="aplecs-current-municipalities">
              Cabanelles · Navata · Lladó
            </p>
            <p className="aplecs-current-note">
              Properament, més informació i programa complet.
            </p>
          </div>
        </div>
      </section>

      <section
        className="aplecs-archive section-shell"
        aria-labelledby="aplecs-archive-title"
      >
        <div className="section-heading">
          <div>
            <span className="eyebrow">Edicions anteriors</span>
            <h2 id="aplecs-archive-title">Reviu els Aplecs Iltiŕ</h2>
          </div>
          <p>Vídeos i informació de les edicions 2025, 2024 i 2023.</p>
        </div>
        {editions.map((edition) => {
          const params = new URLSearchParams({ rel: "0" });
          if (edition.start) {
            params.set("start", String(edition.start));
          }

          return (
            <article className="aplec-edition" id={edition.id} key={edition.id}>
              <div className="aplec-video-frame">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${edition.youtubeId}?${params.toString()}`}
                  title={edition.title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
              <div className="aplec-edition-copy">
                <span className="eyebrow">Edició {edition.year}</span>
                <h2>{edition.title}</h2>
                <p>{edition.text}</p>
                <a
                  className="aplec-more-link"
                  href={edition.moreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Més informació sobre l’Aplec Iltiŕ {edition.year}
                  <ArrowIcon />
                </a>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
