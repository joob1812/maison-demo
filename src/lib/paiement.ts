import { boutique, type MoyenPaiement } from "@/config/boutique";

export type ResultatPaiement = { statut: "paye" | "a-la-livraison" };

/**
 * Point d'entrée unique du paiement côté navigateur.
 *
 * Mode "demo" : le paiement est simulé, aucun argent ne circule.
 *
 * Mode "reel" (à construire par client, voir CLAUDE.md) : cette fonction appelle
 * une route serveur (ex. POST /api/paiement) qui recalcule le total à partir du
 * catalogue, crée la session chez le fournisseur (Wave Checkout, PayTech…) et
 * renvoie l'URL de paiement. La commande n'est marquée payée qu'à réception du
 * webhook signé du fournisseur, jamais sur la seule foi du navigateur.
 */
export async function payer(moyen: MoyenPaiement): Promise<ResultatPaiement> {
  if (moyen.id === "livraison") return { statut: "a-la-livraison" };

  if (boutique.modePaiement !== "demo") {
    throw new Error("Paiement réel non branché : voir CLAUDE.md, section Paiement.");
  }

  await new Promise((resoudre) => setTimeout(resoudre, 1200));
  return { statut: "paye" };
}
