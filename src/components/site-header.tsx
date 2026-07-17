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
        <Link href="/#arquitectura" className="nav-mobile-hidden">
          Com ens organitzem
        </Link>
        <details className="municipalities-menu">
          <summary>Municipis</summary>
          <div className="municipalities-list">
            <Link href="/municipis/cabanelles">Cabanelles</Link>
            <Link href="/municipis/llado">Lladó</Link>
            <Link href="/municipis/navata">Navata</Link>
          </div>
        </details>
        <Link href="/agenda">Agenda</Link>
        <Link href="/#relat" className="nav-mobile-hidden">
          El projecte
        </Link>
        <Link href="/aplecs">Edicions anteriors</Link>
      </nav>
    </header>
  );
}
