import Image from "next/image";
import { CircleLink } from "@/components/circle-link";
import type { Circle } from "@/lib/types";

export function AplecParticipation({ circles }: { circles: Circle[] }) {
  const sectorials = circles.filter((circle) => circle.kind === "sectorial");

  return (
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
  );
}
