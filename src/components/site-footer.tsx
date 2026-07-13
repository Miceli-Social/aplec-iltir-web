import Image from "next/image";
import Link from "next/link";

const promotedBy = [
  {
    name: "Miceli Social",
    logo: "/logos/miceli.png",
    href: "#",
  },
];

const collaborators = [
  {
    name: "Ajuntament de Navata",
    logo: "/logos/ajuntament-navata.png",
    href: "https://www.navata.cat/",
  },
  {
    name: "Ajuntament de Lladó",
    logo: "/logos/ajuntament-llado.png",
    href: "https://www.llado.cat/",
  },
  {
    name: "Ajuntament de Cabanelles",
    logo: "/logos/ajuntament-cabanelles.png",
    href: "https://www.cabanelles.cat/",
  },
];

const supporters = [
  {
    name: "Generalitat de Catalunya",
    logo: "/logos/support/generalitat.svg",
    href: "https://web.gencat.cat/",
  },
  {
    name: "Diputació de Girona",
    logo: "/logos/support/diputacio-girona.svg",
    href: "https://www.ddgi.cat/",
  },
  {
    name: "Departament de Cultura",
    logo: "/logos/support/departament-cultura.svg",
    href: "https://cultura.gencat.cat/",
  },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-about">
        <div className="footer-brand">
          <Image
            className="footer-logo"
            src="/images/iltir-logo.png"
            alt="Iltiŕ"
            width={3090}
            height={2699}
          />
          <Image
            className="footer-symbol"
            src="/images/iltir-symbol.png"
            alt=""
            width={900}
            height={897}
          />
        </div>
        <p>Un espai compartit per entendre què passa, participar i col·laborar des del territori.</p>
      </div>
      <nav className="footer-links" aria-label="Peu de pàgina">
        <Link href="/#arquitectura">Organització</Link>
        <Link href="/agenda">Agenda</Link>
        <Link href="/credits">Crèdits</Link>
        <a href="mailto:contacte@iltir.cat">Contacte</a>
      </nav>
      <section className="footer-partners" aria-label="Impulsat per">
        <div className="footer-partner-group footer-promoted">
          <span>Impulsat per</span>
          {promotedBy.map((partner) => (
            <a
              className="partner-logo"
              href={partner.href}
              target={partner.href === "#" ? undefined : "_blank"}
              rel={partner.href === "#" ? undefined : "noreferrer"}
              key={partner.name}
              aria-label={partner.name}
            >
              <Image src={partner.logo} alt={partner.name} width={220} height={120} />
            </a>
          ))}
        </div>
        <div className="footer-partner-group footer-collaborators">
          <span>Amb la col·laboració de</span>
          <div>
            {collaborators.map((partner) => (
              <a
                className="partner-logo"
                href={partner.href}
                target="_blank"
                rel="noreferrer"
                key={partner.name}
                aria-label={partner.name}
              >
                <Image src={partner.logo} alt={partner.name} width={180} height={110} />
              </a>
            ))}
          </div>
        </div>
        <div className="footer-partner-group footer-supporters">
          <span>Amb el suport de</span>
          <div>
            {supporters.map((partner) => (
              <a
                className="partner-logo"
                href={partner.href}
                target="_blank"
                rel="noreferrer"
                key={partner.name}
                aria-label={partner.name}
              >
                <Image src={partner.logo} alt={partner.name} width={260} height={90} />
              </a>
            ))}
          </div>
        </div>
      </section>
    </footer>
  );
}
