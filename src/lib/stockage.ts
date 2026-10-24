import { useSyncExternalStore } from "react";

/**
 * Petite valeur persistée dans le localStorage du navigateur, partagée entre
 * composants et onglets. Côté serveur (et pendant l'hydratation), la valeur
 * par défaut est utilisée, ce qui évite les écarts d'affichage.
 */
export function creerStockage<T>(
  cle: string,
  valeurParDefaut: T,
  /**
   * Vérifie ce qui a été relu du navigateur (ancienne version du site, catalogue
   * modifié, valeur corrompue) et renvoie une valeur sûre.
   */
  valider: (brut: unknown) => T = (brut) => brut as T,
) {
  let cache: T | undefined;
  const abonnes = new Set<() => void>();

  function lire(): T {
    if (cache === undefined) {
      try {
        const brut = window.localStorage.getItem(cle);
        cache = brut ? valider(JSON.parse(brut)) : valeurParDefaut;
      } catch {
        cache = valeurParDefaut;
      }
    }
    return cache;
  }

  function ecrire(valeur: T) {
    cache = valeur;
    try {
      window.localStorage.setItem(cle, JSON.stringify(valeur));
    } catch {
      // Stockage indisponible (navigation privée, quota) : la valeur reste en mémoire.
    }
    abonnes.forEach((notifier) => notifier());
  }

  function sAbonner(notifier: () => void) {
    abonnes.add(notifier);
    const surStockage = (evenement: StorageEvent) => {
      if (evenement.key === cle) {
        cache = undefined;
        notifier();
      }
    };
    window.addEventListener("storage", surStockage);
    return () => {
      abonnes.delete(notifier);
      window.removeEventListener("storage", surStockage);
    };
  }

  function useValeur(): T {
    return useSyncExternalStore(sAbonner, lire, () => valeurParDefaut);
  }

  return { lire, ecrire, useValeur };
}

const sAbonnerARien = () => () => {};

/**
 * false pendant le rendu serveur et l'hydratation, true ensuite.
 * Permet d'afficher un squelette au lieu d'un « panier vide » qui clignote
 * avant que le navigateur ait relu le stockage.
 */
export function useEstClient(): boolean {
  return useSyncExternalStore(
    sAbonnerARien,
    () => true,
    () => false,
  );
}
