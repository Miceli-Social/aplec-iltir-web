import Image from "next/image";
import Link from "next/link";
import { CookieSettingsButton } from "@/components/cookie-settings-button";

type LogoVariant =
  | "anigami"
  | "habitats"
  | "eu-cofunded"
  | "generalitat"
  | "escola-administracio-publica"
  | "diputacio";

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
    name: "Ajuntament de Cabanelles",
    logo: "/logos/ajuntament-cabanelles.png",
    href: "https://www.cabanelles.cat/",
    showName: true,
  },
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
];

const europeanSupporter: FooterLogoProps = {
  name: "Cofinançat per la Unió Europea",
  logo: "/logos/support/eu-cofunded-footer.png",
  href: "https://new-european-bauhaus.europa.eu/index_en",
  variant: "eu-cofunded",
};

const generalitatSupporter: FooterLogoProps = {
  name: "Generalitat de Catalunya",
  logo: "/logos/support/generalitat-catalunya-footer-white.png",
  href: "https://web.gencat.cat/",
  variant: "generalitat",
};

const sharedSupporters: FooterLogoProps[] = [
  {
    name: "Diputació de Girona",
    logo: "/logos/support/diputacio-girona-footer-white.png",
    href: "https://www.ddgi.cat/",
    variant: "diputacio",
  },
  {
    name: "Escola d’Administració Pública de Catalunya",
    logo: "/logos/support/escola-administracio-publica-footer-white.png",
    href: "https://eapc.gencat.cat/ca/escola",
    variant: "escola-administracio-publica",
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
          <Link href="/cookies">Política de cookies</Link>
          <CookieSettingsButton className="cookie-footer-button" />
          <a href="mailto:info@miceli.social">Contacte</a>
          <Link href="/admin">Accés intern</Link>
        </nav>

        <div className="footer-entities">
          <section className="footer-entity-group footer-promoted">
            <h2>Impulsat per Miceli i els consells de poble de Cabanelles, Navata i Lladó</h2>
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

          <section className="footer-entity-group footer-supporters" aria-label="Suports institucionals">
            <div className="footer-support-grid">
              <div className="footer-support-block footer-support-block--eu">
                <p>Cofinançat per la Unió Europea</p>
                <FooterLogo {...europeanSupporter} />
              </div>

              <div className="footer-support-block footer-support-block--generalitat">
                <p>Amb el suport de la Generalitat de Catalunya</p>
                <FooterLogo {...generalitatSupporter} />
              </div>

              <div className="footer-support-block footer-support-block--shared">
                <p>Amb el suport de</p>
                <div className="footer-support-logos">
                  {sharedSupporters.map((supporter) => (
                    <FooterLogo key={supporter.name} {...supporter} />
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </footer>
  );
}
