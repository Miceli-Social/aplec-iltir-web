import Image from "next/image";
import Link from "next/link";

type LogoVariant = "anigami" | "habitats" | "new-european-bauhaus";

type FooterLogoProps = {
  name: string;
  logo: string;
  href?: string;
  variant?: LogoVariant;
  showName?: boolean;
};

const cooperatives: FooterLogoProps[] = [
  {
    name: "Resilience.Earth",
    logo: "/logos/footer/resilience-earth-white.png",
    href: "https://resilience.earth/",
  },
  {
    name: "Anigami Experiències",
    logo: "/logos/footer/anigami-dark.jpg",
    href: "https://www.anigami.cat/",
    variant: "anigami",
  },
  {
    name: "Chapter #2",
    logo: "/logos/footer/chapter2-white.png",
    href: "https://www.chapter2.cat/",
  },
  {
    name: "Hàbitats Col·lectius",
    logo: "/logos/footer/habitats-collectius.png",
    variant: "habitats",
  },
  {
    name: "Mixité",
    logo: "/logos/footer/mixite-footer-white.png",
    href: "https://www.mixite.cat/ca/portada/",
  },
];

const collaborators: FooterLogoProps[] = [
  {
    name: "Ajuntament de Navata",
    logo: "/logos/ajuntament-navata.png",
    href: "https://www.navata.cat/",
    showName: true,
  },
  {
    name: "Ajuntament de Lladó",
    logo: "/logos/ajuntament-llado.png",
    href: "https://www.llado.cat/",
    showName: true,
  },
  {
    name: "Ajuntament de Cabanelles",
    logo: "/logos/ajuntament-cabanelles.png",
    href: "https://www.cabanelles.cat/",
    showName: true,
  },
];

const supporters: FooterLogoProps[] = [
  {
    name: "Generalitat de Catalunya",
    logo: "/logos/support/generalitat-catalunya-footer-white.png",
    href: "https://web.gencat.cat/",
  },
  {
    name: "Diputació de Girona",
    logo: "/logos/support/diputacio-girona-footer-white.png",
    href: "https://www.ddgi.cat/",
  },
  {
    name: "Departament de Cultura",
    logo: "/logos/support/departament-cultura-footer-white.png",
    href: "https://cultura.gencat.cat/",
  },
  {
    name: "New European Bauhaus",
    logo: "/logos/footer/new-european-bauhaus-footer-corrected.png",
    href: "https://new-european-bauhaus.europa.eu/index_en",
    variant: "new-european-bauhaus",
  },
];

function FooterLogo({ name, logo, href, variant, showName = false }: FooterLogoProps) {
  const className = ["footer-entity", variant && `footer-entity--${variant}`]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      <span className="footer-entity-image">
        <Image src={logo} alt={name} width={260} height={120} />
      </span>
      {showName && <span className="footer-entity-name">{name}</span>}
    </>
  );

  if (href) {
    return (
      <a className={className} href={href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return <div className={className}>{content}</div>;
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
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
          <p>
            Un espai compartit per entendre què passa, participar i col·laborar des del territori.
          </p>
        </div>

        <nav className="footer-links" aria-label="Peu de pàgina">
          <Link href="/#arquitectura">Organització</Link>
          <Link href="/agenda">Agenda</Link>
          <Link href="/credits">Crèdits</Link>
          <a href="mailto:contacte@iltir.cat">Contacte</a>
          <Link href="/admin">Accés intern</Link>
        </nav>

        <div className="footer-entities">
          <section className="footer-entity-group footer-promoted">
            <h2>Impulsat per</h2>
            <FooterLogo
              name="Miceli"
              logo="/logos/footer/miceli-white.png"
              href="https://miceli.social/"
            />
          </section>

          <section className="footer-entity-group footer-cooperatives">
            <h2>Micelis que nodreixen l’Aplec Iltiŕ</h2>
            <div className="footer-cooperative-grid">
              {cooperatives.map((cooperative) => (
                <FooterLogo key={cooperative.name} {...cooperative} />
              ))}
            </div>
          </section>

          <section className="footer-entity-group footer-collaborators">
            <h2>Amb la col·laboració de</h2>
            <div className="footer-collaborator-grid">
              {collaborators.map((collaborator) => (
                <FooterLogo key={collaborator.name} {...collaborator} />
              ))}
            </div>
          </section>

          <section className="footer-entity-group footer-supporters">
            <h2>Amb el suport de</h2>
            <div className="footer-support-grid">
              {supporters.map((supporter) => (
                <FooterLogo key={supporter.name} {...supporter} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </footer>
  );
}
