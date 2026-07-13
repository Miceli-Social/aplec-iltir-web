import Link from "next/link";
import type { Circle } from "@/lib/types";
import { ArrowIcon } from "@/components/icons";

export function CircleLink({ circle, compact = false }: { circle: Circle; compact?: boolean }) {
  return (
    <Link
      href={`/cercles/${circle.slug}`}
      className={`circle-link theme-${circle.theme} ${compact ? "compact" : ""}`}
    >
      <span className="circle-dot" />
      <span>
        <strong>{circle.shortName}</strong>
        {!compact && <small>{circle.summary}</small>}
      </span>
      <ArrowIcon className="circle-arrow" />
    </Link>
  );
}
