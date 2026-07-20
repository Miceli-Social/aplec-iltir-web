import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const siteTitle = "Aplec Iltir 2026";
const siteDescription =
  "Cabanelles, Lladó i Navata s'organitzen per guanyar autonomia, sobirania i resiliència des del territori.";
const socialDescription =
  "Tres pobles. Una xarxa viva. Capacitat compartida per transformar el territori.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://apleciltir.cat"),
  title: { default: siteTitle, template: `%s · ${siteTitle}` },
  description: siteDescription,
  icons: {
    icon: "/images/iltir-symbol.png",
    shortcut: "/images/iltir-symbol.png",
    apple: "/images/iltir-symbol.png",
  },
  openGraph: {
    title: siteTitle,
    description: socialDescription,
    siteName: siteTitle,
    locale: "ca_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: socialDescription,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ca">
      <body>
        <a className="skip-link" href="#contingut">Salta al contingut</a>
        <SiteHeader />
        <main id="contingut">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
