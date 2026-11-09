import { ConsentYoutubeEmbed } from "@/components/consent-youtube-embed";

export function AplecSummaryVideo() {
  return (
    <section className="aplec-summary-video" aria-labelledby="aplec-summary-video-title">
      <h2 id="aplec-summary-video-title">L’Aplec Iltiŕ 2026, en imatges</h2>
      <div className="aplec-video-frame">
        <ConsentYoutubeEmbed
          videoId="3j5WWBguHGA"
          title="Vídeo resum de l’Aplec Iltiŕ 2026"
        />
      </div>
    </section>
  );
}
