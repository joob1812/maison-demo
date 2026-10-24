import type { MetadataRoute } from "next";
import { PAGES_INFO, PAGES_LEGALES, URL_SITE } from "@/config/navigation";
import { CATEGORIES, produits } from "@/data/produits";

export default function sitemap(): MetadataRoute.Sitemap {
  const chemins = [
    "",
    "/catalogue",
    ...CATEGORIES.map((c) => `/catalogue/${c.id}`),
    ...produits.map((p) => `/produit/${p.slug}`),
    ...PAGES_INFO.map((p) => p.href),
    ...PAGES_LEGALES.map((p) => p.href),
  ];
  return chemins.map((chemin) => ({ url: `${URL_SITE}${chemin}` }));
}
