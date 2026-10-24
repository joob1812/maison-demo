"use client";

import { boutique, fraisLivraison, trouverMoyenPaiement, trouverZone } from "@/config/boutique";
import {
  COULEURS,
  libelleTaille,
  stockDisponible,
  trouverProduit,
  type CouleurId,
  type Taille,
} from "@/data/produits";
import { formatFCFA } from "@/lib/format";
import { afficherNumero } from "@/lib/whatsapp";
import { creerStockage } from "@/lib/stockage";

export type LignePanier = {
  slug: string;
  couleur: CouleurId;
  taille: Taille;
  quantite: number;
};

export type InfosClient = {
  nom: string;
  /** Numéro normalisé 221XXXXXXXXX. */
  telephone: string;
  zone: string;
  adresse: string;
  /** Précision libre pour la boutique (repère, heure de passage…). */
  note?: string;
};

export type Commande = {
  numero: string;
  date: string;
  lignes: LignePanier[];
  client: InfosClient;
  paiement: string;
  sousTotal: number;
  frais: number;
  total: number;
};

const VIDE: LignePanier[] = [];

/** Ne garde que les lignes qui correspondent encore au catalogue actuel. */
function validerPanier(brut: unknown): LignePanier[] {
  if (!Array.isArray(brut)) return VIDE;
  const lignes = brut.filter((l): l is LignePanier => {
    if (!l || typeof l !== "object") return false;
    const { slug, couleur, taille, quantite } = l as Record<string, unknown>;
    if (typeof slug !== "string" || typeof couleur !== "string" || typeof taille !== "string") return false;
    if (typeof quantite !== "number" || !Number.isInteger(quantite) || quantite < 1) return false;
    const produit = trouverProduit(slug);
    return (
      !!produit &&
      produit.couleurs.includes(couleur as CouleurId) &&
      produit.tailles.some((t) => t.taille === taille)
    );
  });
  return lignes.length ? lignes : VIDE;
}

function validerCommandeStockee(brut: unknown): Commande | null {
  if (!brut || typeof brut !== "object") return null;
  const c = brut as Partial<Commande>;
  if (typeof c.numero !== "string" || typeof c.total !== "number" || !c.client) return null;
  return { ...(c as Commande), lignes: validerPanier(c.lignes) };
}

function validerZone(brut: unknown): string {
  return typeof brut === "string" && boutique.zonesLivraison.some((z) => z.id === brut)
    ? brut
    : boutique.zonesLivraison[0].id;
}

const panierStockage = creerStockage<LignePanier[]>("maison-demo:panier", VIDE, validerPanier);
const commandeStockage = creerStockage<Commande | null>("maison-demo:derniere-commande", null, validerCommandeStockee);
const zoneStockage = creerStockage<string>("maison-demo:zone", boutique.zonesLivraison[0].id, validerZone);

export const usePanier = panierStockage.useValeur;
export const useDerniereCommande = commandeStockage.useValeur;
/** Zone de livraison choisie, partagée entre le panier et le paiement. */
export const useZone = zoneStockage.useValeur;
export const choisirZone = zoneStockage.ecrire;

function memeLigne(a: LignePanier, b: Omit<LignePanier, "quantite">) {
  return a.slug === b.slug && a.couleur === b.couleur && a.taille === b.taille;
}

/** Quantité maximale commandable : le stock de la taille, plafonné à 9. */
export function quantiteMax(ligne: Omit<LignePanier, "quantite">): number {
  const produit = trouverProduit(ligne.slug);
  return produit ? Math.min(9, stockDisponible(produit, ligne.taille)) : 0;
}

export function ajouterAuPanier(ligne: LignePanier) {
  const panier = panierStockage.lire();
  const max = quantiteMax(ligne);
  const existante = panier.find((l) => memeLigne(l, ligne));
  const suivant = existante
    ? panier.map((l) => (memeLigne(l, ligne) ? { ...l, quantite: Math.min(max, l.quantite + ligne.quantite) } : l))
    : [...panier, { ...ligne, quantite: Math.min(max, ligne.quantite) }];
  panierStockage.ecrire(suivant);
}

export function changerQuantite(ligne: Omit<LignePanier, "quantite">, quantite: number) {
  const max = quantiteMax(ligne);
  const panier = panierStockage.lire();
  const suivant =
    quantite <= 0
      ? panier.filter((l) => !memeLigne(l, ligne))
      : panier.map((l) => (memeLigne(l, ligne) ? { ...l, quantite: Math.min(max, quantite) } : l));
  panierStockage.ecrire(suivant);
}

export function viderPanier() {
  panierStockage.ecrire(VIDE);
}

export function nombreArticles(panier: LignePanier[]): number {
  return panier.reduce((n, l) => n + l.quantite, 0);
}

export function sousTotal(panier: LignePanier[]): number {
  return panier.reduce((total, l) => total + (trouverProduit(l.slug)?.prix ?? 0) * l.quantite, 0);
}

function genererNumero(): string {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let code = "";
  const aleatoire = new Uint32Array(5);
  crypto.getRandomValues(aleatoire);
  aleatoire.forEach((n) => (code += alphabet[n % alphabet.length]));
  return `${boutique.prefixeCommande}-${code}`;
}

/** Enregistre la commande (côté navigateur), vide le panier et renvoie la commande. */
export function validerCommande(panier: LignePanier[], client: InfosClient, paiement: string): Commande {
  const zone = trouverZone(client.zone);
  const st = sousTotal(panier);
  const frais = fraisLivraison(zone, st);
  const commande: Commande = {
    numero: genererNumero(),
    date: new Date().toISOString(),
    lignes: panier,
    client,
    paiement,
    sousTotal: st,
    frais,
    total: st + frais,
  };
  commandeStockage.ecrire(commande);
  viderPanier();
  return commande;
}

function descriptionLigne(l: LignePanier): string {
  const produit = trouverProduit(l.slug);
  const nom = produit?.nom ?? l.slug;
  const prix = produit ? formatFCFA(produit.prix * l.quantite) : "";
  return `• ${nom} · ${COULEURS[l.couleur].nom} · ${libelleTaille(l.taille)} × ${l.quantite} — ${prix}`;
}

function libelleFrais(fraisZone: number, frais: number): string {
  if (!fraisZone) return "";
  return frais ? ` (${formatFCFA(frais)})` : " (offerte)";
}

/** Message envoyé à la boutique quand le client commande depuis son panier, sans payer en ligne. */
export function messagePanier(panier: LignePanier[], zoneId: string): string {
  const zone = trouverZone(zoneId);
  const st = sousTotal(panier);
  const frais = fraisLivraison(zone, st);
  return [
    `Bonjour ${boutique.nom}, je souhaite commander :`,
    ...panier.map(descriptionLigne),
    `Livraison : ${zone.nom}${libelleFrais(zone.frais, frais)}`,
    `Total : ${formatFCFA(st + frais)}`,
    "Merci de me confirmer la disponibilité.",
  ].join("\n");
}

/** Message envoyé à la boutique pour un seul article, depuis la fiche produit. */
export function messageProduit(slug: string, couleur: CouleurId, taille: Taille | null): string {
  const produit = trouverProduit(slug);
  if (!produit) return `Bonjour ${boutique.nom}, je souhaite commander un article.`;
  return [
    `Bonjour ${boutique.nom}, je souhaite commander :`,
    `• ${produit.nom} · ${COULEURS[couleur].nom} · ${taille ? minusculeInitiale(libelleTaille(taille)) : "taille à préciser"} — ${formatFCFA(produit.prix)}`,
    "Merci de me confirmer la disponibilité.",
  ].join("\n");
}

/** Récapitulatif complet d'une commande validée, pour le suivi sur WhatsApp. */
export function messageCommande(commande: Commande): string {
  const zone = trouverZone(commande.client.zone);
  const paiement = trouverMoyenPaiement(commande.paiement);
  const statutPaiement =
    paiement.id === "livraison"
      ? "Paiement à la livraison"
      : `${paiement.nom}${boutique.modePaiement === "demo" ? " (paiement de démonstration)" : ""}`;
  return [
    `Commande ${commande.numero}`,
    ...commande.lignes.map(descriptionLigne),
    `Livraison : ${zone.nom}${commande.client.adresse ? `, ${commande.client.adresse}` : ""}${
      zone.frais && !commande.frais ? " (offerte)" : ""
    }`,
    `Total : ${formatFCFA(commande.total)}`,
    `Paiement : ${statutPaiement}`,
    `Client : ${commande.client.nom} · ${afficherNumero(commande.client.telephone)}`,
    ...(commande.client.note ? [`Note : ${commande.client.note}`] : []),
  ].join("\n");
}

/** « Taille XL » → « taille XL » (sans toucher à la taille elle-même). */
function minusculeInitiale(texte: string): string {
  return texte.charAt(0).toLowerCase() + texte.slice(1);
}
