"use client";

import Link from "next/link";
import { boutique, fraisLivraison, trouverZone } from "@/config/boutique";
import { COULEURS, libelleTaille, produits, trouverProduit } from "@/data/produits";
import { formatFCFA } from "@/lib/format";
import {
  changerQuantite,
  messagePanier,
  nombreArticles,
  quantiteMax,
  sousTotal,
  usePanier,
  useZone,
} from "@/lib/panier";
import { useEstClient } from "@/lib/stockage";
import { lienWhatsApp } from "@/lib/whatsapp";
import { BarreLivraisonOfferte } from "./BarreLivraisonOfferte";
import { BoutonCommanderWhatsApp } from "./BoutonCommanderWhatsApp";
import { CarteProduit } from "./CarteProduit";
import { ChoixZone } from "./ChoixZone";
import { IconeCorbeille, IconeMoins, IconePanier, IconePlus } from "./Icones";
import { VisuelProduit } from "./VisuelProduit";

export function Panier() {
  const estClient = useEstClient();
  const panier = usePanier();
  const zone = trouverZone(useZone());

  if (!estClient) return <div className="h-96 animate-pulse rounded-2xl bg-fond" aria-hidden="true" />;

  if (panier.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-fond px-4 py-14 text-center">
        <IconePanier className="size-10 text-attenue" />
        <p className="text-lg font-semibold">Votre panier est vide</p>
        <Link
          href="/catalogue"
          className="inline-flex h-12 items-center rounded-full bg-marque px-6 font-semibold text-white hover:bg-marque/90"
        >
          Voir le catalogue
        </Link>
      </div>
    );
  }

  const st = sousTotal(panier);
  const frais = fraisLivraison(zone, st);
  // Accessoires pas encore dans le panier : la petite touche finale.
  const suggestions = produits
    .filter((p) => p.categorie === "accessoires" && !panier.some((l) => l.slug === p.slug))
    .slice(0, 4);
  const n = nombreArticles(panier);
  const lien = lienWhatsApp(boutique.whatsapp, messagePanier(panier, zone.id));

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
      <section aria-label="Articles" className="flex flex-col">
        {panier.map((l) => {
          const produit = trouverProduit(l.slug)!;
          const max = quantiteMax(l);
          return (
            <div key={`${l.slug}-${l.couleur}-${l.taille}`} className="flex gap-3 border-b border-ligne py-4">
              <Link href={`/produit/${l.slug}`} className="w-22 shrink-0">
                <VisuelProduit produit={produit} couleur={l.couleur} sizes="88px" className="aspect-[4/5] rounded-xl" />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link href={`/produit/${l.slug}`} className="text-sm leading-snug font-semibold hover:underline">
                      {produit.nom}
                    </Link>
                    <p className="text-sm text-attenue">
                      {COULEURS[l.couleur].nom} · {libelleTaille(l.taille)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => changerQuantite(l, 0)}
                    aria-label={`Retirer ${produit.nom} du panier`}
                    className="-mt-2 -mr-2 flex size-11 shrink-0 items-center justify-center rounded-full text-attenue hover:bg-fond hover:text-encre"
                  >
                    <IconeCorbeille className="size-5" />
                  </button>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex h-11 items-center rounded-full border border-zinc-300">
                    <button
                      type="button"
                      onClick={() => changerQuantite(l, l.quantite - 1)}
                      disabled={l.quantite <= 1}
                      aria-label="Diminuer la quantité"
                      className="flex size-11 items-center justify-center disabled:text-zinc-300"
                    >
                      <IconeMoins className="size-4" />
                    </button>
                    <span className="min-w-6 text-center font-semibold" aria-live="polite">
                      {l.quantite}
                    </span>
                    <button
                      type="button"
                      onClick={() => changerQuantite(l, l.quantite + 1)}
                      disabled={l.quantite >= max}
                      aria-label="Augmenter la quantité"
                      className="flex size-11 items-center justify-center disabled:text-zinc-300"
                    >
                      <IconePlus className="size-4" />
                    </button>
                  </div>
                  <p className="font-bold whitespace-nowrap">{formatFCFA(produit.prix * l.quantite)}</p>
                </div>
              </div>
            </div>
          );
        })}
        <div className="mt-6">
          <ChoixZone />
        </div>
        {suggestions.length > 0 && (
          <section className="mt-10 flex flex-col gap-4" aria-labelledby="titre-touche-finale">
            <h2 id="titre-touche-finale" className="font-titre text-xl font-bold">
              La touche finale
            </h2>
            <div className="rangee">
              {suggestions.map((p) => (
                <CarteProduit key={p.slug} produit={p} />
              ))}
            </div>
          </section>
        )}
      </section>

      <aside className="flex flex-col gap-4 lg:sticky lg:top-24">
        <BarreLivraisonOfferte sousTotal={st} />
        <section aria-label="Récapitulatif" className="flex flex-col gap-2.5 rounded-2xl bg-fond p-5">
          <div className="flex justify-between text-sm text-doux">
            <span>
              Sous-total · {n} article{n > 1 ? "s" : ""}
            </span>
            <span>{formatFCFA(st)}</span>
          </div>
          <div className="flex justify-between text-sm text-doux">
            <span>Livraison</span>
            <span>{frais ? formatFCFA(frais) : zone.frais ? "Offerte" : "Gratuit"}</span>
          </div>
          <div className="mt-1 flex items-baseline justify-between border-t border-zinc-300 pt-3">
            <span className="font-semibold">Total</span>
            <span className="font-titre text-2xl font-extrabold">{formatFCFA(st + frais)}</span>
          </div>
        </section>
        <Link
          href="/paiement"
          className="flex h-13 items-center justify-center rounded-full bg-marque px-5 text-base font-semibold text-white hover:bg-marque/90"
        >
          Passer au paiement
        </Link>
        <BoutonCommanderWhatsApp lien={lien} libelle="Envoyer la commande sur WhatsApp" />
      </aside>
    </div>
  );
}
