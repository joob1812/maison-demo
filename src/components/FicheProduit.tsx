"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { boutique } from "@/config/boutique";
import {
  COULEURS,
  libelleTaille,
  photoDetouree,
  stockDisponible,
  trouverProduit,
  type CouleurId,
  type Taille,
} from "@/data/produits";
import { formatFCFA } from "@/lib/format";
import { ajouterAuPanier, messageProduit } from "@/lib/panier";
import { noterVu } from "@/lib/preferences";
import { ouvrirTiroir } from "@/lib/tiroir";
import { lienWhatsApp } from "@/lib/whatsapp";
import { BoutonCommanderWhatsApp } from "./BoutonCommanderWhatsApp";
import { BoutonFavori } from "./BoutonFavori";
import { Galerie } from "./Galerie";
import { GuideTailles } from "./GuideTailles";
import { IconeLivraison, IconeRetours, IconeTelephone } from "./Icones";
import { PartageWhatsApp } from "./PartageWhatsApp";
import { VisuelProduit } from "./VisuelProduit";

export function FicheProduit({ slug }: { slug: string }) {
  const produit = trouverProduit(slug);
  const [couleur, setCouleur] = useState<CouleurId>(produit?.couleurs[0] ?? "noir");
  const tailleUnique = produit?.tailles.length === 1 ? produit.tailles[0].taille : null;
  const [taille, setTaille] = useState<Taille | null>(tailleUnique);
  const [erreur, setErreur] = useState(false);

  // Retient l'article pour « Vus récemment » (écrit dans le stockage du navigateur, pas dans l'état React).
  useEffect(() => {
    noterVu(slug);
  }, [slug]);

  if (!produit) return null;

  const stock = taille ? stockDisponible(produit, taille) : null;
  const epuisees = produit.tailles.filter((t) => t.stock === 0).map((t) => t.taille);
  const lien = lienWhatsApp(boutique.whatsapp, messageProduit(produit.slug, couleur, taille));
  const chaussures = produit.tailles.some((t) => /^\d+$/.test(t.taille));
  const motTaille = chaussures ? "pointure" : "taille";

  // Vues : face, dos (sauf photo de face sans photo de dos), puis photos portées.
  const dosCoherent = !photoDetouree(produit, couleur, "recto") || !!photoDetouree(produit, couleur, "verso");
  const vues = [
    <VisuelProduit key="face" produit={produit} couleur={couleur} sizes="(min-width: 768px) 50vw, 100vw" priorite className="aspect-[4/5] w-full" />,
    ...(dosCoherent
      ? [<VisuelProduit key="dos" produit={produit} couleur={couleur} face="verso" sizes="(min-width: 768px) 50vw, 100vw" className="aspect-[4/5] w-full" />]
      : []),
    ...produit.images.map((src, i) => (
      <div key={src} className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-fond">
        <Image src={src} alt={`${produit.nom}, porté (${i + 1})`} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
      </div>
    )),
  ];
  const libelles = ["de face", ...(dosCoherent ? ["de dos"] : []), ...produit.images.map(() => "porté")];

  function ajouter() {
    if (!taille) {
      setErreur(true);
      return;
    }
    ajouterAuPanier({ slug: produit!.slug, couleur, taille, quantite: 1 });
    ouvrirTiroir({ slug: produit!.slug, couleur, taille });
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 md:gap-12">
      <div className="md:sticky md:top-24 md:self-start">
        <Galerie vues={vues} libelles={libelles} />
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-2">
            <h1 className="font-titre text-2xl leading-tight font-bold md:text-3xl">{produit.nom}</h1>
            <p className="text-xl font-bold">{formatFCFA(produit.prix)}</p>
            {stock !== null && stock > 0 && (
              <p className="flex items-center gap-2 text-sm font-medium text-whatsapp">
                <span aria-hidden="true" className="size-2 rounded-full bg-whatsapp" />
                {stock <= 2 ? `Plus que ${stock} en stock` : "En stock, prêt à être livré"}
              </p>
            )}
          </div>
          <BoutonFavori slug={produit.slug} nom={produit.nom} variante="fiche" />
        </div>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-sm font-semibold">
            Couleur : <span className="font-normal text-doux">{COULEURS[couleur].nom}</span>
          </legend>
          <div className="flex gap-2">
            {produit.couleurs.map((id) => (
              <button
                key={id}
                type="button"
                aria-pressed={couleur === id}
                aria-label={COULEURS[id].nom}
                onClick={() => setCouleur(id)}
                className={`flex size-12 items-center justify-center rounded-full border-2 ${
                  couleur === id ? "border-marque" : "border-zinc-200 hover:border-zinc-400"
                }`}
              >
                <span className="size-9 rounded-full border border-zinc-300" style={{ backgroundColor: COULEURS[id].hex }} />
              </button>
            ))}
          </div>
        </fieldset>

        {tailleUnique ? (
          <p className="text-sm text-doux">{libelleTaille(tailleUnique)}</p>
        ) : (
          <fieldset className="flex flex-col gap-2" aria-describedby="aide-taille">
            <legend className="mb-2 flex w-full items-center justify-between text-sm font-semibold">
              {chaussures ? "Pointure" : "Taille"}
            </legend>
            <div className="flex flex-wrap gap-2">
              {produit.tailles.map(({ taille: t, stock: s }) => {
                const actif = taille === t;
                return (
                  <button
                    key={t}
                    type="button"
                    disabled={s === 0}
                    aria-pressed={actif}
                    aria-label={s === 0 ? `${libelleTaille(t)}, épuisée` : libelleTaille(t)}
                    onClick={() => {
                      setTaille(t);
                      setErreur(false);
                    }}
                    className={`h-12 min-w-14 rounded-xl border-[1.5px] px-4 text-base font-semibold ${
                      s === 0
                        ? "cursor-not-allowed border-zinc-200 text-zinc-400 line-through"
                        : actif
                          ? "border-marque bg-marque text-white"
                          : "border-zinc-300 hover:border-encre"
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
            <p id="aide-taille" className={`text-sm ${erreur ? "font-semibold text-erreur" : "text-attenue"}`}>
              {erreur
                ? `Choisissez une ${motTaille} pour ajouter l'article au panier.`
                : epuisees.length
                  ? `Épuisé en ${epuisees.join(", ")} pour le moment.`
                  : `Choisissez votre ${motTaille}.`}
            </p>
            <GuideTailles chaussures={chaussures} />
          </fieldset>
        )}

        <div className="sticky bottom-0 z-10 -mx-4 flex flex-col gap-3 border-t border-ligne bg-white px-4 py-3 md:static md:mx-0 md:border-0 md:p-0">
          <button
            type="button"
            onClick={ajouter}
            className="h-13 rounded-full bg-marque px-5 text-base font-semibold text-white hover:bg-marque/90"
          >
            Ajouter au panier · {formatFCFA(produit.prix)}
          </button>
          <BoutonCommanderWhatsApp lien={lien} libelle="Commander sur WhatsApp" />
        </div>

        <ul className="flex flex-col gap-3 rounded-2xl bg-fond p-4 text-sm">
          <li className="flex items-start gap-3">
            <IconeLivraison className="mt-0.5 size-5 shrink-0" />
            <span>
              Livraison à Dakar sous 24 à 48 h, <strong>offerte dès {formatFCFA(boutique.livraisonOfferte.seuil)}</strong>.
              Régions sous 2 à 4 jours.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <IconeTelephone className="mt-0.5 size-5 shrink-0" />
            <span>Paiement Wave, Orange Money ou à la livraison.</span>
          </li>
          <li className="flex items-start gap-3">
            <IconeRetours className="mt-0.5 size-5 shrink-0" />
            <span>Échange ou retour sous {boutique.retoursJours} jours.</span>
          </li>
        </ul>

        <div className="flex flex-col gap-2">
          <h2 className="text-base font-semibold">Description</h2>
          <p className="leading-relaxed text-doux">{produit.description}</p>
          <ul className="mt-1 list-disc pl-5 text-doux">
            {produit.details.map((d) => (
              <li key={d} className="py-0.5">
                {d}
              </li>
            ))}
          </ul>
        </div>

        <PartageWhatsApp nom={produit.nom} />
      </div>
    </div>
  );
}
