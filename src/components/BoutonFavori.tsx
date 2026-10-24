"use client";

import { basculerFavori, useFavoris } from "@/lib/preferences";
import { IconeCoeur } from "./Icones";

type Props = { slug: string; nom: string; variante?: "carte" | "fiche" };

/** Cœur pour ajouter ou retirer un article des favoris (gardés sur le téléphone). */
export function BoutonFavori({ slug, nom, variante = "carte" }: Props) {
  // Pendant le rendu serveur et l'hydratation, la liste est vide : aucun écart d'affichage.
  const actif = useFavoris().includes(slug);

  const style =
    variante === "carte"
      ? "size-11 rounded-full bg-white/90 shadow-sm backdrop-blur hover:bg-white"
      : "size-12 rounded-full border border-zinc-300 bg-white hover:border-encre";

  return (
    <button
      type="button"
      aria-pressed={actif}
      aria-label={actif ? `Retirer ${nom} des favoris` : `Ajouter ${nom} aux favoris`}
      onClick={() => basculerFavori(slug)}
      className={`flex shrink-0 items-center justify-center ${style} ${actif ? "text-[#C0392B]" : "text-encre"}`}
    >
      <IconeCoeur plein={actif} className="size-5.5" />
    </button>
  );
}
