import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://iltir.example.org"),
  title: { default: "MVP - Iltiŕ Canalla", template: "%s · MVP - Iltiŕ Canalla" },
  description:
    "Cabanelles, Lladó i Navata s’organitzen per guanyar autonomia, sobirania i resiliència des del territori.",
  openGraph: {
    title: "MVP - Iltiŕ Canalla",
    description: "Tres pobles. Una xarxa viva. Capacitat compartida per transformar el territori.",
    locale: "ca_ES",
    type: "website",
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
