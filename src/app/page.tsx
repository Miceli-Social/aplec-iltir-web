import Link from "next/link";
import Image from "next/image";
import { GovernanceMap } from "@/components/governance-map";
import { ArrowIcon } from "@/components/icons";
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
          <h1>I si fos possible construir el propi destí?</h1>
          <p className="hero-lead">
            Tres municipis treballem per desenvolupar més sobirania, resiliència i subsidiarietat amb el lloc on habitem. La governança territorial és el camí i l’Aplec, la celebració del procés.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/governanca">Descobreix la governança <ArrowIcon /></Link>
            <Link className="text-link" href="/agenda">Veure les properes trobades <span>↗</span></Link>
          </div>
        </div>
      </section>

      <section id="aplec" className="aplec-overview">
        <Link
          className="aplec-overview-main aplec-overview-link"
          href="/aplecs"
          aria-label="Descobreix l’Aplec Iltiŕ 2026 i les edicions anteriors"
        >
          <div className="aplec-overview-heading">
            <span className="eyebrow">Què és l’Aplec?</span>
            <h2>L’Aplec Iltiŕ</h2>
            <div className="aplec-2026-highlight">
              <span className="aplec-2026-label">Aplec Iltiŕ 2026</span>
              <strong className="aplec-2026-date">
                16, 17 i 18 d’octubre de 2026
              </strong>
              <span className="aplec-2026-location">
                Als municipis de Cabanelles · Navata · Lladó
              </span>
            </div>
            <p>
              Una trobada per compartir les propostes de resiliència que es treballen des dels pobles, compartir aprenentatges, expressar el vincle amb el territori i celebrar la cultura arrelada al lloc.
            </p>
            <span className="aplec-overview-cta">
              <span>
                <strong>Descobreix l’Aplec 2026</strong>
                <small>Dates, municipis i edicions anteriors</small>
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
              title: "EVOLUCIÓ DEMOCRÀTICA",
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

      <section className="architecture section-shell">
        <GovernanceMap circles={circles} />
        <SectorialsHome circles={circles} />
      </section>

      <section className="closing-method">
        <div className="closing-method-inner">
          <div className="section-heading compact-heading closing-method-heading">
            <div>
              <span className="eyebrow">La manera de fer</span>
              <h2>
                Arrels locals,
                <br />
                mirada bioregional.
              </h2>
            </div>
          </div>
          <aside className="word-origin closing-word-origin">
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
        </div>
      </section>
    </>
  );
}
