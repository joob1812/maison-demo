/**
 * Configuration de la boutique.
 * C'est le premier fichier à modifier pour chaque nouveau client :
 * nom, couleur, numéro WhatsApp, zones de livraison et moyens de paiement.
 */

export type ZoneLivraison = {
  id: string;
  nom: string;
  delai: string;
  /** Frais en FCFA (entier). 0 = gratuit. */
  frais: number;
  /** true si une adresse de livraison est nécessaire. */
  adresseRequise: boolean;
};

export type MoyenPaiement = {
  id: "wave" | "orange-money" | "livraison";
  nom: string;
  description: string;
  /** true si le paiement se fait par mobile money (numéro demandé). */
  mobileMoney: boolean;
};

export const boutique = {
  nom: "Maison Démo",
  slogan: "Wax, bazin et prêt-à-porter",
  description:
    "Boutique de mode à Dakar : wax, bazin et prêt-à-porter, livrés partout au Sénégal. Paiement Wave, Orange Money ou à la livraison.",
  /** Couleur principale de la marque (boutons, accents). Le texte blanc doit rester lisible dessus. */
  couleurPrincipale: "#23308C",
  /** Préfixe des numéros de commande, ex. MD-4K7Q2. */
  prefixeCommande: "MD",
  /**
   * Numéro WhatsApp qui reçoit les commandes, au format 221XXXXXXXXX.
   * Il se règle dans .env.local (NEXT_PUBLIC_WHATSAPP_BOUTIQUE) pour ne jamais
   * envoyer de test vers le numéro d'un inconnu.
   */
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_BOUTIQUE ?? "",
  zonesLivraison: [
    { id: "dakar", nom: "Livraison à Dakar", delai: "Sous 24 à 48 h", frais: 1500, adresseRequise: true },
    { id: "regions", nom: "Livraison en régions", delai: "Sous 2 à 4 jours", frais: 3000, adresseRequise: true },
    { id: "retrait", nom: "Retrait en boutique", delai: "Dès demain", frais: 0, adresseRequise: false },
  ] satisfies ZoneLivraison[],
  moyensPaiement: [
    { id: "wave", nom: "Wave", description: "Vous confirmez le paiement dans votre application Wave.", mobileMoney: true },
    {
      id: "orange-money",
      nom: "Orange Money",
      description: "Vous validez le paiement sur votre téléphone avec votre code Orange Money.",
      mobileMoney: true,
    },
    {
      id: "livraison",
      nom: "Paiement à la livraison",
      description: "En espèces ou par mobile money, à la réception du colis.",
      mobileMoney: false,
    },
  ] satisfies MoyenPaiement[],
  /**
   * "demo" : le paiement est simulé et aucun argent ne circule.
   * Le paiement réel (Wave Checkout, agrégateur) demande des route handlers serveur : voir le README.
   */
  modePaiement: "demo" as "demo" | "reel",
  /**
   * true pour la boutique fictive de l'agence : le site n'est pas référencé par Google
   * (on le montre par lien aux prospects) et le pied de page signale la démonstration.
   * false pour la boutique d'un vrai client.
   */
  demonstration: true,
  /** Messages du bandeau défilant de la page d'accueil. */
  bandeau: [
    "Nouvelle collection",
    "Livraison partout au Sénégal",
    "Paiement Wave et Orange Money",
    "Commande sur WhatsApp",
  ],
  /** Adresse de la boutique (affichée sur la page Contact et dans le pied de page). */
  adresse: "Sacré-Cœur 3, Dakar",
  /** Lien « Ouvrir dans Google Maps ». */
  lienCarte: "https://www.google.com/maps/search/?api=1&query=Sacr%C3%A9-C%C5%93ur+3%2C+Dakar",
  horaires: [
    { jours: "Lundi au samedi", heures: "10 h – 20 h" },
    { jours: "Dimanche", heures: "15 h – 19 h" },
  ],
  /** Adresse e-mail de contact. Vide = non affichée. */
  email: "",
  /** Liens des réseaux sociaux. Vide = non affiché. */
  reseaux: { instagram: "", tiktok: "", facebook: "" },
  /** Livraison offerte à partir d'un montant d'achat (FCFA), dans les zones listées. */
  livraisonOfferte: { seuil: 50000, zones: ["dakar"] },
  /** Délai pour échanger ou retourner un article (jours). */
  retoursJours: 7,
  /** Crédit affiché en bas de page, ex. "Votre Agence · votreagence.sn". Vide = rien n'est affiché. */
  realisePar: "",
};

export function trouverZone(id: string): ZoneLivraison {
  return boutique.zonesLivraison.find((z) => z.id === id) ?? boutique.zonesLivraison[0];
}

export function trouverMoyenPaiement(id: string): MoyenPaiement {
  return boutique.moyensPaiement.find((m) => m.id === id) ?? boutique.moyensPaiement[0];
}

/** Frais de livraison réels : offerts dans les zones concernées au-delà du seuil d'achat. */
export function fraisLivraison(zone: ZoneLivraison, sousTotal: number): number {
  const { seuil, zones } = boutique.livraisonOfferte;
  return zones.includes(zone.id) && sousTotal >= seuil ? 0 : zone.frais;
}
