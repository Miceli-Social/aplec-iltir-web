import type { Metadata } from "next";
import { GovernanceExplainer } from "@/components/governance-explainer";
import { GovernanceMap } from "@/components/governance-map";
import { getCircles } from "@/lib/remote-content";

export const metadata: Metadata = {
  title: "Governança",
  description:
    "La governança territorial i bioregional de Cabanelles, Lladó i Navata.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function GovernancePage() {
  const circles = await getCircles();

  return (
    <main className="inner-page governance-page">
      <header className="governance-page-hero">
        <div className="governance-page-heading">
          <span className="eyebrow">Governança</span>
          <h1>Caminem cap a l’evolució democràtica i el govern obert.</h1>
        </div>
        <aside className="governance-page-summary">
          <span>Governança bioregional</span>
          <p>
            La mirada no està en els límits administratius, treballem des del lloc i potenciant la creativitat arrelada, relacionant-nos amb altres pobles i amb qui té les competències i els coneixements necessaris per desenvolupar propostes singulars i innovadores per articular-nos.
          </p>
        </aside>
      </header>

      <GovernanceExplainer />
      <GovernanceMap circles={circles} />
    </main>
  );
}
