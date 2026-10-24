"use client";

import Link from "next/link";
import { boutique } from "@/config/boutique";
import { trouverProduit, type Produit } from "@/data/produits";
import { formatFCFA } from "@/lib/format";
import { useFavoris } from "@/lib/preferences";
import { useEstClient } from "@/lib/stockage";
import { lienWhatsApp } from "@/lib/whatsapp";
import { CarteProduit } from "./CarteProduit";
import { IconeCoeur, IconeMessage } from "./Icones";

/** Les articles mis de côté avec le cœur, gardés sur ce téléphone. */
export function ListeFavoris() {
  const estClient = useEstClient();
  const favoris = useFavoris()
    .map(trouverProduit)
    .filter((p): p is Produit => !!p);

  if (!estClient) return <div className="h-80 animate-pulse rounded-2xl bg-fond" aria-hidden="true" />;

  if (favoris.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-fond px-4 py-14 text-center">
        <IconeCoeur className="size-10 text-attenue" />
        <p className="text-lg font-semibold">Aucun favori pour l&apos;instant</p>
        <p className="max-w-sm text-doux">Touchez le cœur sur un article pour le mettre de côté et le retrouver ici.</p>
        <Link
          href="/catalogue"
          className="inline-flex h-12 items-center rounded-full bg-marque px-6 font-semibold text-white hover:bg-marque/90"
        >
          Voir le catalogue
        </Link>
      </div>
    );
  }

  const message = [
    `Bonjour ${boutique.nom}, ces articles m'intéressent :`,
    ...favoris.map((p) => `• ${p.nom} (${formatFCFA(p.prix)})`),
    "Sont-ils disponibles ?",
  ].join("\n");
  const lien = lienWhatsApp(boutique.whatsapp, message);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-doux" aria-live="polite">
          {favoris.length} article{favoris.length > 1 ? "s" : ""} mis de côté
        </p>
        {lien && (
          <a
            href={lien}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-whatsapp px-5 text-sm font-semibold text-white hover:brightness-110"
          >
            <IconeMessage className="size-4.5" />
            Demander la disponibilité
          </a>
        )}
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {favoris.map((p) => (
          <CarteProduit key={p.slug} produit={p} />
        ))}
      </div>
    </div>
  );
}
