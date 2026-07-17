import type { Metadata } from "next";
import { ArrowIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Reviu els Aplecs Iltiŕ",
  description:
    "Vídeos i informació de les edicions 2023, 2024 i 2025 de l’Aplec Iltiŕ.",
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
          <span className="eyebrow light">Edicions anteriors</span>
          <h1>Reviu els Aplecs Iltiŕ</h1>
          <p>
            Tres edicions per tornar a veure com els pobles es troben,
            comparteixen aprenentatges i celebren el territori.
          </p>
        </div>
      </header>

      <section className="aplecs-archive section-shell">
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
