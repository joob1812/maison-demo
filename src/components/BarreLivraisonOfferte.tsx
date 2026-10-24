import { boutique } from "@/config/boutique";
import { formatFCFA } from "@/lib/format";
import { IconeLivraison } from "./Icones";

/** « Plus que X FCFA pour la livraison offerte à Dakar », avec une jauge. */
export function BarreLivraisonOfferte({ sousTotal }: { sousTotal: number }) {
  const { seuil } = boutique.livraisonOfferte;
  const reste = Math.max(0, seuil - sousTotal);
  const part = Math.min(100, Math.round((sousTotal / seuil) * 100));

  return (
    <div className="flex flex-col gap-2 rounded-2xl bg-fond px-4 py-3">
      <p className="flex items-center gap-2 text-sm">
        <IconeLivraison className="size-5 shrink-0" />
        {reste > 0 ? (
          <span>
            Plus que <strong>{formatFCFA(reste)}</strong> pour la livraison offerte à Dakar
          </span>
        ) : (
          <strong className="text-whatsapp">Livraison offerte à Dakar</strong>
        )}
      </p>
      <div
        className="h-1.5 overflow-hidden rounded-full bg-zinc-200"
        role="progressbar"
        aria-label="Progression vers la livraison offerte"
        aria-valuenow={part}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full rounded-full transition-[width] duration-500 ${reste > 0 ? "bg-marque" : "bg-whatsapp"}`}
          style={{ width: `${part}%` }}
        />
      </div>
    </div>
  );
}
