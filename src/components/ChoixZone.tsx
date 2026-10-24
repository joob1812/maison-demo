"use client";

import { boutique, fraisLivraison } from "@/config/boutique";
import { formatFCFA } from "@/lib/format";
import { choisirZone, sousTotal, usePanier, useZone } from "@/lib/panier";

/** Choix de la zone de livraison, partagé entre le panier et le paiement. */
export function ChoixZone() {
  const zone = useZone();
  const total = sousTotal(usePanier());

  return (
    <fieldset className="flex flex-col gap-2.5">
      <legend className="mb-2 text-base font-semibold">Livraison</legend>
      {boutique.zonesLivraison.map((z) => {
        const actif = z.id === zone;
        return (
          <label
            key={z.id}
            className={`flex min-h-16 cursor-pointer items-center gap-3 rounded-xl border-[1.5px] px-4 py-3 ${
              actif ? "border-marque bg-fond" : "border-ligne hover:border-zinc-400"
            }`}
          >
            <input
              type="radio"
              name="zone"
              value={z.id}
              checked={actif}
              onChange={() => choisirZone(z.id)}
              className="size-5 shrink-0 accent-marque"
            />
            <span className="flex flex-1 flex-col">
              <span className="text-sm font-semibold">{z.nom}</span>
              <span className="text-sm text-attenue">{z.delai}</span>
            </span>
            {z.frais > 0 && fraisLivraison(z, total) === 0 ? (
              // Seuil de livraison offerte atteint : le prix barré montre l'économie.
              <span className="flex flex-col items-end text-sm whitespace-nowrap">
                <s className="text-attenue">{formatFCFA(z.frais)}</s>
                <span className="font-semibold text-whatsapp">Offerte</span>
              </span>
            ) : (
              <span className="text-sm font-semibold whitespace-nowrap">{z.frais ? formatFCFA(z.frais) : "Gratuit"}</span>
            )}
          </label>
        );
      })}
    </fieldset>
  );
}
