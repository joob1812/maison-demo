import type { Metadata, Viewport } from "next";
import type { CSSProperties } from "react";
import "@fontsource-variable/inter";
import "@fontsource-variable/archivo";
import "./globals.css";
import { boutique } from "@/config/boutique";
import { URL_SITE } from "@/config/navigation";
import { ambiance } from "@/data/ambiances";
import { Entete } from "@/components/Entete";
import { PiedDePage } from "@/components/PiedDePage";
import { TiroirPanier } from "@/components/TiroirPanier";

export const metadata: Metadata = {
  metadataBase: new URL(URL_SITE),
  title: { default: `${boutique.nom} · ${boutique.slogan}`, template: `%s · ${boutique.nom}` },
  description: boutique.description,
  // Démonstration : pages exclues des moteurs de recherche (voir boutique.demonstration).
  robots: boutique.demonstration ? { index: false, follow: false } : undefined,
  openGraph: {
    type: "website",
    locale: "fr_SN",
    siteName: boutique.nom,
    images: ambiance("campagne") ? [ambiance("campagne")!] : undefined,
  },
};

export const viewport: Viewport = {
  themeColor: boutique.couleurPrincipale,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" style={{ "--marque": boutique.couleurPrincipale } as CSSProperties}>
      <body className="flex min-h-dvh flex-col font-sans antialiased">
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:font-semibold"
        >
          Aller au contenu
        </a>
        <Entete />
        <main id="contenu" className="flex-1">
          {children}
        </main>
        <PiedDePage />
        <TiroirPanier />
      </body>
    </html>
  );
}
