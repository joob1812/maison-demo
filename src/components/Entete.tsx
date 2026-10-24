import Link from "next/link";
import { boutique } from "@/config/boutique";
import { CATEGORIES } from "@/data/produits";
import { formatFCFA } from "@/lib/format";
import { BadgePanier } from "./BadgePanier";
import { LienFavoris } from "./LienFavoris";
import { MenuMobile } from "./MenuMobile";
import { Recherche } from "./Recherche";

export function Entete() {
  return (
    <>
      <p className="bg-encre px-4 py-2 text-center text-xs font-medium text-white">
        Livraison offerte à Dakar dès {formatFCFA(boutique.livraisonOfferte.seuil)}
        <span className="hidden sm:inline"> · Paiement Wave, Orange Money ou à la livraison</span>
      </p>
      <header className="sticky top-0 z-30 border-b border-ligne bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-2 sm:px-4">
          <div className="flex items-center gap-1">
            <MenuMobile />
            <Link
              href="/"
              className="px-1 font-titre text-base font-extrabold tracking-[0.16em] whitespace-nowrap uppercase sm:text-lg"
            >
              {boutique.nom}
            </Link>
          </div>
          <nav aria-label="Navigation principale" className="hidden items-center gap-1 md:flex">
            {CATEGORIES.map((c) => (
              <Link
                key={c.id}
                href={`/catalogue/${c.id}`}
                className="inline-flex h-11 items-center rounded-full px-4 text-sm font-semibold hover:bg-fond"
              >
                {c.nom}
              </Link>
            ))}
            <Link
              href="/a-propos"
              className="inline-flex h-11 items-center rounded-full px-4 text-sm font-semibold hover:bg-fond"
            >
              Notre histoire
            </Link>
          </nav>
          <div className="flex items-center">
            <Recherche />
            <LienFavoris />
            <BadgePanier />
          </div>
        </div>
      </header>
    </>
  );
}
