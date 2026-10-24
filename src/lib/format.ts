/**
 * Formate un montant en FCFA : 18500 -> "18 500 FCFA".
 * Les montants XOF n'ont jamais de décimales.
 * Le formatage est fait à la main (et non avec toLocaleString) pour donner
 * exactement le même texte côté serveur et côté navigateur.
 */
export function formatFCFA(montant: number): string {
  const entier = Math.round(montant);
  const groupes = String(Math.abs(entier)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${entier < 0 ? "-" : ""}${groupes} FCFA`;
}

/** Texte comparable pour la recherche : sans accents ni majuscules (« Boubou brodé » -> « boubou brode »). */
export function sansAccents(texte: string): string {
  return texte.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}
