"use client";

import Link from "next/link";
import { COULEURS, libelleTaille, produitsAssocies, trouverProduit } from "@/data/produits";
import { formatFCFA } from "@/lib/format";
import { nombreArticles, sousTotal, usePanier } from "@/lib/panier";
import { fermerTiroir, useTiroir } from "@/lib/tiroir";
import { BarreLivraisonOfferte } from "./BarreLivraisonOfferte";
import { CarteProduit } from "./CarteProduit";
import { IconeFermer, IconeValide } from "./Icones";
import { Panneau } from "./Panneau";
import { VisuelProduit } from "./VisuelProduit";

/** Mini-panier qui s'ouvre après un ajout : confirmation, livraison offerte, suggestions. */
export function TiroirPanier() {
  const { ouvert, dernier } = useTiroir();
  const panier = usePanier();
  const produit = dernier ? trouverProduit(dernier.slug) : undefined;
  const st = sousTotal(panier);
  const n = nombreArticles(panier);
  const suggestions = produit ? produitsAssocies(produit).slice(0, 2) : [];

  return (
    <Panneau ouvert={ouvert} onFermer={fermerTiroir} cote="droite" titre="Article ajouté au panier">
      <div className="flex min-h-full flex-col">
        <div className="flex h-16 items-center justify-between border-b border-ligne px-4">
          <p className="flex items-center gap-2 font-semibold">
            <span className="flex size-7 items-center justify-center rounded-full bg-whatsapp text-white">
              <IconeValide className="size-4" />
            </span>
            Ajouté au panier
          </p>
          <button
            type="button"
            autoFocus
            onClick={fermerTiroir}
            aria-label="Fermer"
            className="flex size-11 items-center justify-center rounded-full hover:bg-fond"
          >
            <IconeFermer className="size-5" />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-4">
          {produit && dernier && (
            <div className="flex gap-3">
              <VisuelProduit produit={produit} couleur={dernier.couleur} sizes="80px" className="aspect-[4/5] w-20" />
              <div className="flex flex-col gap-1">
                <p className="font-semibold">{produit.nom}</p>
                <p className="text-sm text-attenue">
                  {COULEURS[dernier.couleur].nom} · {libelleTaille(dernier.taille)}
                </p>
                <p className="font-bold">{formatFCFA(produit.prix)}</p>
              </div>
            </div>
          )}

          <BarreLivraisonOfferte sousTotal={st} />

          {suggestions.length > 0 && (
            <section className="flex flex-col gap-3" aria-labelledby="titre-suggestions-tiroir">
              <h2 id="titre-suggestions-tiroir" className="font-titre text-lg font-bold">
                Complétez le look
              </h2>
              <div className="grid grid-cols-2 gap-3" onClick={fermerTiroir}>
                {suggestions.map((p) => (
                  <CarteProduit key={p.slug} produit={p} sansFavori />
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="flex flex-col gap-3 border-t border-ligne p-4">
          <p className="flex justify-between">
            <span className="text-doux">
              Panier · {n} article{n > 1 ? "s" : ""}
            </span>
            <span className="font-bold">{formatFCFA(st)}</span>
          </p>
          <Link
            href="/panier"
            onClick={fermerTiroir}
            className="flex h-13 items-center justify-center rounded-full bg-marque font-semibold text-white hover:bg-marque/90"
          >
            Voir le panier et commander
          </Link>
          <button
            type="button"
            onClick={fermerTiroir}
            className="h-12 rounded-full border-[1.5px] border-zinc-300 font-semibold hover:border-encre"
          >
            Continuer mes achats
          </button>
        </div>
      </div>
    </Panneau>
  );
}
