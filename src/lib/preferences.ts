import { trouverProduit } from "@/data/produits";
import { creerStockage } from "./stockage";

/**
 * Ce que le navigateur retient pour la cliente : favoris, articles vus récemment
 * et coordonnées de la dernière commande (pour ne pas les retaper).
 * Tout reste sur son téléphone : rien n'est envoyé à un serveur.
 */

const AUCUN: string[] = [];

function validerSlugs(brut: unknown): string[] {
  if (!Array.isArray(brut)) return AUCUN;
  const slugs = brut.filter((s): s is string => typeof s === "string" && !!trouverProduit(s));
  return slugs.length ? [...new Set(slugs)] : AUCUN;
}

const favoris = creerStockage<string[]>("maison-demo:favoris", AUCUN, validerSlugs);
export const useFavoris = favoris.useValeur;

export function basculerFavori(slug: string): boolean {
  const liste = favoris.lire();
  const present = liste.includes(slug);
  favoris.ecrire(present ? liste.filter((s) => s !== slug) : [slug, ...liste]);
  return !present;
}

const vus = creerStockage<string[]>("maison-demo:vus", AUCUN, validerSlugs);
export const useVusRecemment = vus.useValeur;

/** Retient un article consulté (8 au plus, le plus récent d'abord). */
export function noterVu(slug: string) {
  const liste = vus.lire();
  if (liste[0] === slug) return;
  vus.ecrire([slug, ...liste.filter((s) => s !== slug)].slice(0, 8));
}

export type ClientMemorise = { nom: string; telephone: string; adresse: string };

function validerClient(brut: unknown): ClientMemorise | null {
  if (!brut || typeof brut !== "object") return null;
  const { nom, telephone, adresse } = brut as Record<string, unknown>;
  if (typeof nom !== "string" || typeof telephone !== "string") return null;
  return { nom, telephone, adresse: typeof adresse === "string" ? adresse : "" };
}

const client = creerStockage<ClientMemorise | null>("maison-demo:client", null, validerClient);
export const useClientMemorise = client.useValeur;
export const memoriserClient = client.ecrire;
export const lireClientMemorise = client.lire;
