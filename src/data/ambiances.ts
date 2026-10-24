import brut from "./ambiances.json";

/**
 * Images d'ambiance (campagne, catégories, atelier, inspirations, photos portées).
 * Générées par scripts/generer_visuels.py --ambiances / --portes, ou fournies par le client
 * et déclarées à la main dans src/data/ambiances.json : { "nom": "/ambiance/fichier.webp" }.
 * Chaque emplacement du site a un repli soigné tant que son image manque.
 */
const images = brut as Record<string, string>;

export type NomAmbiance =
  | "campagne"
  | "categorie-femme"
  | "categorie-homme"
  | "categorie-accessoires"
  | "atelier"
  | "boutique"
  | "inspiration-1"
  | "inspiration-2"
  | "inspiration-3"
  | "inspiration-4";

export function ambiance(nom: NomAmbiance): string | undefined {
  return images[nom];
}

/** Les inspirations disponibles, dans l'ordre. */
export function inspirations(): string[] {
  return (["inspiration-1", "inspiration-2", "inspiration-3", "inspiration-4"] as const)
    .map((n) => images[n])
    .filter((x): x is string => !!x);
}

/** Photos portées d'un produit : « porte-<slug> », « porte-<slug>-2 »… */
export function photosPortees(slug: string): string[] {
  return Object.keys(images)
    .filter((cle) => cle === `porte-${slug}` || cle.startsWith(`porte-${slug}-`))
    .sort()
    .map((cle) => images[cle]);
}
