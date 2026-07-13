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
        <Link href="/#arquitectura">Com ens organitzem</Link>
        <Link href="/agenda">Agenda</Link>
        <Link href="/#relat">El projecte</Link>
      </nav>
    </header>
  );
}
