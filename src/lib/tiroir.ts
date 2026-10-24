import { useSyncExternalStore } from "react";
import type { CouleurId, Taille } from "@/data/produits";

/** État du mini-panier qui s'ouvre après un ajout (non conservé entre les visites). */
export type EtatTiroir = { ouvert: boolean; dernier: { slug: string; couleur: CouleurId; taille: Taille } | null };

const FERME: EtatTiroir = { ouvert: false, dernier: null };
let etat = FERME;
const abonnes = new Set<() => void>();

function changer(suivant: EtatTiroir) {
  etat = suivant;
  abonnes.forEach((f) => f());
}

export function ouvrirTiroir(dernier: EtatTiroir["dernier"]) {
  changer({ ouvert: true, dernier });
}

export function fermerTiroir() {
  changer({ ...etat, ouvert: false });
}

export function useTiroir(): EtatTiroir {
  return useSyncExternalStore(
    (f) => {
      abonnes.add(f);
      return () => abonnes.delete(f);
    },
    () => etat,
    () => FERME,
  );
}
