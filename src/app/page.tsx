import Link from "next/link";
import Image from "next/image";
import { GovernanceMap } from "@/components/governance-map";
import { ArrowIcon } from "@/components/icons";
import { GovernanceExplainer } from "@/components/governance-explainer";
import { ManifestoSlider } from "@/components/manifesto-slider";
import { SectorialsHome } from "@/components/sectorials-home";
import { getCircles } from "@/lib/remote-content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const circles = await getCircles();

  return (
    <>
      <section className="hero">
        <div className="hero-media" aria-hidden="true">
          <video
            className="hero-video"
            poster="/images/video-capcalera-aplec-iltir-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
          >
            <source
              src="/images/video-capcalera-aplec-iltir-web.mp4"
              type="video/mp4"
              media="(min-width: 721px) and (prefers-reduced-motion: no-preference)"
            />
          </video>
          <Image
            className="hero-video-poster"
            src="/images/video-capcalera-aplec-iltir-poster.jpg"
            alt=""
            fill
            sizes="100vw"
            priority
          />
        </div>
        <div className="hero-copy">
          <span className="eyebrow hero-places">CABANELLES · LLADÓ · NAVATA</span>
          <h1>Tres pobles,<br />una xarxa viva.</h1>
          <p className="hero-lead">
            Ens organitzem des del territori per guanyar capacitat, autonomia i resiliència. La governança compartida és el camí i l’Aplec és la celebració del procés.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" href="#arquitectura">Descobreix la xarxa <ArrowIcon /></Link>
            <Link className="text-link" href="/agenda">Veure les properes trobades <span>↗</span></Link>
          </div>
        </div>
      </section>

      <section className="aplec-overview">
        <Link
          className="aplec-overview-main aplec-overview-link"
          href="/aplecs"
          aria-label="Descobreix els Aplecs Iltiŕ i mira els vídeos de les edicions anteriors"
        >
          <div className="aplec-overview-heading">
            <span className="eyebrow">Què és l’Aplec?</span>
            <h2>L’Aplec Iltiŕ</h2>
            <p>
              Una trobada per compartir les propostes de resiliència que es treballen des dels pobles, compartir aprenentatges, expressar el vincle amb el territori i celebrar la cultura arrelada al lloc.
            </p>
            <span className="aplec-overview-cta">
              <span>
                <strong>Descobreix els Aplecs</strong>
                <small>Vídeos 2023 · 2024 · 2025</small>
              </span>
              <ArrowIcon />
            </span>
          </div>
          <div className="aplec-symbol-card" aria-hidden="true">
            <Image
              src="/images/iltir-symbol.png"
              alt=""
              width={900}
              height={897}
              sizes="(max-width: 720px) 160px, 260px"
            />
            <span className="aplec-play-badge" aria-hidden="true" />
          </div>
        </Link>
        <div className="aplec-principles" aria-label="Principis de l’Aplec Iltiŕ">
          {[
            {
              number: "01",
              title: "DEMOCRÀCIA",
              text: "Crear condicions perquè la comunitat pugui orientar, decidir i assumir responsabilitats sobre allò que afecta la vida del poble.",
            },
            {
              number: "02",
              title: "REGENERACIÓ",
              text: "Augmentar la vitalitat del territori: cuidar relacions, sòls, aigua, cultura i capacitat d’organitzar-nos.",
            },
            {
              number: "03",
              title: "BIOREGIÓ",
              text: "Llegir els pobles com a part d’un mateix sistema viu, on paisatge, economia, cultura i ecologia es condicionen mútuament.",
            },
          ].map(({ number, title, text }) => (
            <article key={title}>
              <span>{number}</span>
              <strong>{title}</strong>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <ManifestoSlider />

      <section id="arquitectura" className="architecture section-shell">
        <div className="section-heading architecture-heading">
          <div><span className="eyebrow">Com ens organitzem</span><h2>Una estructura adaptativa per a una realitat complexa</h2></div>
          <div className="architecture-summary">
            <span>Una xarxa adaptativa</span>
            <p>Cada poble treballa els seus propis reptes i es coordina amb els altres quan compartir informació o actuar plegats pot reforçar el procés.</p>
          </div>
        </div>
        <GovernanceExplainer />
        <GovernanceMap circles={circles} />
        <SectorialsHome circles={circles} />
      </section>

      <section className="principles section-shell">
        <div className="section-heading compact-heading">
          <div><span className="eyebrow">La manera de fer</span><h2>Arrels locals,<br />mirada bioregional.</h2></div>
        </div>
        <aside className="word-origin">
          <span className="word-origin-mark word-origin-symbol" aria-hidden="true">
            <Image src="/images/iltir-symbol.png" alt="" width={900} height={897} />
          </span>
          <div>
            <span className="eyebrow">D’on ve el nom?</span>
            <h3>Iltiŕ, poble o comunitat.</h3>
            <p>
              Iltiŕ és una paraula d’origen iber. Segons la interpretació que
              ens va compartir l’Institut d’Estudis Íbers, podria haver
              significat «poble» o «comunitat»: una manera de posar al centre
              les persones i el territori que compartim.
            </p>
          </div>
        </aside>
      </section>

      <section className="closing-cta">
        <span className="eyebrow light">La xarxa creix quan hi entres</span>
        <h2>Hi ha moltes maneres<br />de fer territori.</h2>
        <p>Troba el cercle que et mou, consulta què s’hi està treballant i suma’t a la conversa.</p>
        <Link className="button button-light" href="#arquitectura">Explora els cercles <ArrowIcon /></Link>
      </section>
    </>
  );
}
