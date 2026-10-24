"use client";

import { trouverProduit, type Produit } from "@/data/produits";
import { useVusRecemment } from "@/lib/preferences";
import { CarteProduit } from "./CarteProduit";

/** Les derniers articles consultés (sauf celui affiché), pour reprendre là où on s'était arrêté. */
export function VusRecemment({ sauf }: { sauf?: string }) {
  const liste = useVusRecemment()
    .filter((s) => s !== sauf)
    .map(trouverProduit)
    .filter((p): p is Produit => !!p)
    .slice(0, 8);

  if (!liste.length) return null;

  return (
    <section className="flex flex-col gap-5" aria-labelledby="titre-vus">
      <h2 id="titre-vus" className="font-titre text-2xl font-bold">
        Vus récemment
      </h2>
      <div className="rangee">
        {liste.map((p) => (
          <CarteProduit key={p.slug} produit={p} />
        ))}
      </div>
    </section>
  );
}
