import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label="Iltiŕ, inici">
        <Image
          className="brand-logo"
          src="/images/iltir-logo.png"
          alt="Iltiŕ"
          width={3090}
          height={2699}
          priority
        />
        <Image
          className="brand-symbol"
          src="/images/iltir-symbol.png"
          alt=""
          width={900}
          height={897}
          priority
        />
      </Link>
      <nav aria-label="Navegació principal">
        <details className="municipalities-menu">
          <summary>Municipis</summary>
          <div className="municipalities-list">
            <Link href="/municipis/cabanelles">Cabanelles</Link>
            <Link href="/municipis/llado">Lladó</Link>
            <Link href="/municipis/navata">Navata</Link>
          </div>
        </details>
        <Link href="/governanca">Governança</Link>
        <Link href="/agenda">Agenda oberta</Link>
        <Link href="/#aplec">Aplec</Link>
        <Link
          href="/aplecs"
          target="_blank"
          rel="noopener noreferrer"
        >
          Edicions anteriors
        </Link>
      </nav>
    </header>
  );
}
