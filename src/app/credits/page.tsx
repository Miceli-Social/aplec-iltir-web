import type { Metadata } from "next";

export const metadata: Metadata = { title: "Crèdits" };

const credits = [
  {
    place: "Cabanelles",
    title: "Església de Santa Coloma de Cabanelles - façana1.jpg",
    author: "Arnaugir",
    license: "CC BY-SA 4.0",
    url: "https://commons.wikimedia.org/wiki/File:Esgl%C3%A9sia_de_Santa_Coloma_de_Cabanelles_-_fa%C3%A7ana1.jpg",
  },
  {
    place: "Lladó",
    title: "Vista de Lladó mirant la plana",
    author: "Jordi Puig",
    license: "Cedida per al projecte",
    url: "/images/llado.jpg",
  },
  {
    place: "Lladó",
    title: "Cultura popular a Lladó",
    author: "Jordi Puig",
    license: "Cedida per al projecte",
    url: "/images/cultura-popular-llado.jpg",
  },
  {
    place: "Paisatge compartit",
    title: "Carretera i paisatge obert",
    author: "Jordi Puig",
    license: "Cedida per al projecte",
    url: "/images/paisatge-obert.jpg",
  },
  {
    place: "Navata",
    title: "Navata6.jpg",
    author: "Eixida",
    license: "Domini públic",
    url: "https://commons.wikimedia.org/wiki/File:Navata6.jpg",
  },
  {
    place: "Mare de Déu del Mont",
    title: "Mare de Déu del Mont 1.jpg",
    author: "DavidianSkitzou",
    license: "CC BY-SA 3.0",
    url: "https://commons.wikimedia.org/wiki/File:Mare_de_D%C3%A9u_del_Mont_1.jpg",
  },
];

export default function CreditsPage() {
  return (
    <div className="inner-page">
      <header className="page-intro">
        <span className="eyebrow">Crèdits</span>
        <h1>Imatges del territori.</h1>
        <p>Fotografies i imatges utilitzades a la web, amb autoria i origen perquè el procés sigui transparent.</p>
      </header>
      <div className="credits-list">
        {credits.map((credit) => (
          <a href={credit.url} target="_blank" rel="noreferrer" key={credit.place}>
            <strong>{credit.place}</strong>
            <span>{credit.title}</span>
            <small>{credit.author} · {credit.license} ↗</small>
          </a>
        ))}
      </div>
    </div>
  );
}
