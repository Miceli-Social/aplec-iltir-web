import Link from "next/link";
import type { SVGProps } from "react";
import { ArrowIcon } from "@/components/icons";
import type { Circle } from "@/lib/types";

const sectorialOrder = [
  "sectorial-energia",
  "sectorial-cultura",
  "sectorial-comunicacio",
  "sectorial-esports",
  "sectorial-habitatge",
  "sectorial-territori",
];

type SectorialSymbolProps = {
  theme: string;
};

function SectorialSymbol({ theme }: SectorialSymbolProps) {
  const commonProps: SVGProps<SVGSVGElement> = {
    width: 30,
    height: 30,
    viewBox: "0 0 30 30",
    fill: "none",
    "aria-hidden": true,
  };

  switch (theme) {
    case "energia":
      return (
        <svg {...commonProps}>
          <path d="M14.8 24.5c-5.5-.4-8.9-4.2-9.1-10.3 6-.5 10.4 2.6 10.9 8.1" />
          <path d="M15.8 21.9c3.8-1 6.8-4.1 8.5-8.9" />
          <path d="m17.2 5.2-4 7.3h4.3l-3.2 6.2" />
        </svg>
      );
    case "cultura":
      return (
        <svg {...commonProps}>
          <circle cx="8.2" cy="12.2" r="2.2" />
          <circle cx="15" cy="8.5" r="2.2" />
          <circle cx="21.8" cy="12.2" r="2.2" />
          <path d="M6.2 21.9c.8-3 2.6-4.6 5.2-4.8" />
          <path d="M11.4 18.7c1-2.3 2.2-3.3 3.6-3.3s2.6 1 3.6 3.3" />
          <path d="M18.6 17.1c2.6.2 4.4 1.8 5.2 4.8" />
          <path d="M8.1 23.2c4.2 2.2 9.6 2.2 13.8 0" />
        </svg>
      );
    case "comunicacio":
      return (
        <svg {...commonProps}>
          <path d="M7.1 8.2h15.8c1.4 0 2.4 1 2.4 2.4v7.6c0 1.4-1 2.4-2.4 2.4h-6.7l-5.6 4.1v-4.1H7.1c-1.4 0-2.4-1-2.4-2.4v-7.6c0-1.4 1-2.4 2.4-2.4z" />
          <path d="M9.6 13.2h10.8M9.6 16.6h6.8" />
        </svg>
      );
    case "esports":
      return (
        <svg {...commonProps}>
          <circle cx="17.6" cy="6.4" r="2.3" />
          <path d="m14.8 11 4.2 2.3 3.6-2.1" />
          <path d="m16.9 12.1-3.8 4.5 3.1 2.9-2.4 5.1" />
          <path d="m12.7 16.7-4.8-.2" />
          <path d="m16.2 19.5 5.7 4" />
        </svg>
      );
    case "habitatge":
      return (
        <svg {...commonProps}>
          <path d="M5.8 14.3 15 6.4l9.2 7.9" />
          <path d="M8.2 12.9v11h13.6v-11" />
          <path d="M12.4 23.9v-6.1h5.2v6.1" />
        </svg>
      );
    case "territori":
      return (
        <svg {...commonProps}>
          <path d="M3.8 22.8h22.4" />
          <path d="M4.6 19.7c3.2-3.6 6.2-4 9.4-.8 2.7-3 5.6-3.6 9.2-.4" />
          <path d="M6.8 16.2c2.2-2.8 4.3-3.2 6.7-.7" />
          <circle cx="21.6" cy="8.4" r="2.4" />
          <path d="M21.6 3.9v-1.6M21.6 14.5v-1.6M17.1 8.4h-1.6M27.7 8.4h-1.6" />
        </svg>
      );
    default:
      return (
        <svg {...commonProps}>
          <circle cx="15" cy="15" r="8.5" />
          <path d="M15 10.2v9.6M10.2 15h9.6" />
        </svg>
      );
  }
}

export function SectorialsHome({ circles }: { circles: Circle[] }) {
  const sectorials = sectorialOrder
    .map((slug) => circles.find((circle) => circle.kind === "sectorial" && circle.slug === slug))
    .filter((circle): circle is Circle => Boolean(circle));

  if (sectorials.length === 0) return null;

  return (
    <section className="sectorials-home" aria-labelledby="sectorials-home-title">
      <div className="sectorials-home-separator">
        <span>COMPROMÍS COMPARTIT</span>
      </div>
      <div className="sectorials-home-panel">
        <div className="sectorials-home-copy">
          <span className="sectorials-home-kicker">Sectorials</span>
          <h3 id="sectorials-home-title">Sectorials compartides</h3>
          <p>
            Espais temàtics comuns per enfortir el treball conjunt, compartir coneixement i impulsar projectes que
            beneficien tot el territori.
          </p>
          <strong>Quan sumem capacitats, generem més oportunitats per a tothom.</strong>
        </div>
        <div className="sectorials-home-grid">
          {sectorials.map((circle) => (
            <Link
              className={`sectorials-home-card sectorials-home-theme-${circle.theme}`}
              href={`/cercles/${circle.slug}`}
              key={circle.slug}
            >
              <span className="sectorials-home-symbol">
                <SectorialSymbol theme={circle.theme} />
              </span>
              <span className="sectorials-home-card-text">
                <strong>{circle.shortName}</strong>
                {circle.status === "emergent" && <small>Quan calgui</small>}
              </span>
              <ArrowIcon className="sectorials-home-arrow" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
