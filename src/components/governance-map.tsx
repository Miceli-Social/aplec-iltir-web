import Link from "next/link";
import Image from "next/image";
import type { Circle } from "@/lib/types";
import { municipalities } from "@/lib/content";
import { ArrowIcon } from "@/components/icons";
import { CircleLink } from "@/components/circle-link";

export function GovernanceMap({ circles }: { circles: Circle[] }) {
  const localFor = (municipality: string) =>
    circles.filter((circle) => circle.kind === "local" && circle.municipality === municipality);
  const sectorials = circles.filter((circle) => circle.kind === "sectorial");

  return (
    <div className="governance-map">
      <div className="scale-explanation local-scale-explanation">
        <span className="local-scale-index">Base local</span>
        <div>
          <h3>Consells de Poble</h3>
        </div>
        <p>
          Espais oberts de cada municipi per posar en comú què passa, ordenar prioritats i activar grups de treball quan una qüestió necessita continuïtat.
        </p>
      </div>
      <div className="municipality-grid">
        {municipalities.map((municipality) => (
          <article className={`municipality-card municipality-card-${municipality.slug}`} key={municipality.slug}>
            <div className="municipality-photo">
              <Image
                src={`/images/${municipality.slug}.jpg`}
                alt={`Paisatge de ${municipality.name}`}
                fill
                sizes="(max-width: 1050px) 100vw, 33vw"
              />
              <div className="municipality-top">
                <span>Consell de Poble</span>
                <Link href={`/municipis/${municipality.slug}`} aria-label={`Obrir ${municipality.name}`}>
                  <ArrowIcon />
                </Link>
              </div>
              <h3>{municipality.name}</h3>
            </div>
            <div className="local-circles">
              {localFor(municipality.slug).map((circle) => <CircleLink key={circle.slug} circle={circle} compact />)}
            </div>
          </article>
        ))}
      </div>

      <div className="map-connectors" aria-hidden="true">
        <span /><span /><span />
      </div>

      <section className="aplec-base">
        <Image className="aplec-photo" src="/images/aplec.jpg" alt="" fill sizes="100vw" />
        <div className="aplec-overlay" />
        <div className="aplec-content">
          <div className="aplec-intro">
            <div className="aplec-intro-title">
              <h3>Aplec Iltiŕ</h3>
              <span>Cabanelles · Lladó · Navata</span>
            </div>
            <p>Una trobada per compartir propostes de resiliència treballades des dels pobles, aprenentatges, vincle amb el territori i cultura arrelada al lloc.</p>
          </div>
          <div className="aplec-pillars">
            <span><strong>01</strong> Informació clara i oberta</span>
            <span><strong>02</strong> Connexions quan fan falta</span>
            <span><strong>03</strong> Cada poble manté la seva veu</span>
          </div>
          <div className="sectorial-heading">
            <span>Sectorials compartides</span>
            <small>6 àmbits activats a ritmes diferents</small>
          </div>
          <div className="sectorial-grid">
            {sectorials.map((circle) => (
              <div className={`sectorial-item ${circle.status === "emergent" ? "is-emergent" : ""}`} key={circle.slug}>
                <CircleLink circle={circle} compact />
                {circle.status === "emergent" && <span className="status-label">Quan calgui</span>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
