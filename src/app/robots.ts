import type { MetadataRoute } from "next";
import { boutique } from "@/config/boutique";
import { URL_SITE } from "@/config/navigation";

export default function robots(): MetadataRoute.Robots {
  // Boutique de démonstration : rien n'est référencé, on la partage par lien.
  if (boutique.demonstration) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/panier", "/paiement", "/confirmation", "/favoris"] },
    sitemap: `${URL_SITE}/sitemap.xml`,
  };
}
