import Link from "next/link";
import Image from "next/image";
import type { Circle } from "@/lib/types";
import { municipalities } from "@/lib/content";
import { ArrowIcon } from "@/components/icons";
import { CircleLink } from "@/components/circle-link";

export function GovernanceMap({ circles }: { circles: Circle[] }) {
  const localFor = (municipality: string) =>
    circles.filter((circle) => circle.kind === "local" && circle.municipality === municipality);

  return (
    <div className="governance-map">
      <div className="scale-explanation local-scale-explanation">
        <span className="local-scale-index">Base local</span>
        <div>
          <h3>Consells de poble</h3>
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
    </div>
  );
}
