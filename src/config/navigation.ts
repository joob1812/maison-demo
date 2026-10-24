/** Pages d'information, partagées par le menu mobile et le pied de page. */
export const PAGES_INFO = [
  { href: "/a-propos", nom: "Notre histoire" },
  { href: "/livraison-retours", nom: "Livraison et retours" },
  { href: "/guide-des-tailles", nom: "Guide des tailles" },
  { href: "/faq", nom: "Questions fréquentes" },
  { href: "/contact", nom: "Contact et horaires" },
] as const;

export const PAGES_LEGALES = [
  { href: "/conditions-de-vente", nom: "Conditions de vente" },
  { href: "/mentions-legales", nom: "Mentions légales" },
] as const;

/** Adresse publique du site (sitemap, robots, partages). Réglée dans .env.local. */
export const URL_SITE = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
