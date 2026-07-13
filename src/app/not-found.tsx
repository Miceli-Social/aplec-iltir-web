import Link from "next/link";

export default function NotFound() {
  return <div className="not-found"><span className="eyebrow">404</span><h1>Aquest camí no porta enlloc.</h1><p>Potser el cercle ha canviat de lloc o l’enllaç no és correcte.</p><Link className="button button-primary" href="/">Tornar a la xarxa</Link></div>;
}
