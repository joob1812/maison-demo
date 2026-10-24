import Link from "next/link";
import { taillesDisponibles, type Produit } from "@/data/produits";
import { formatFCFA } from "@/lib/format";
import { BoutonFavori } from "./BoutonFavori";
import { VisuelProduit } from "./VisuelProduit";

type Props = { produit: Produit; priorite?: boolean; sansFavori?: boolean };

export function CarteProduit({ produit, priorite = false, sansFavori = false }: Props) {
  const disponibles = taillesDisponibles(produit);
  const stock = produit.tailles.reduce((n, t) => n + t.stock, 0);
  const badge = !stock ? "Épuisé" : stock <= 3 ? `Plus que ${stock}` : produit.nouveaute ? "Nouveau" : null;
  const libelleTailles =
    disponibles.length === 1 && disponibles[0] === "Unique"
      ? "Taille unique"
      : disponibles.length
        ? `${/^\d/.test(disponibles[0]) ? "Pointures" : "Tailles"} ${
            disponibles.length > 4 ? `${disponibles[0]} à ${disponibles.at(-1)}` : disponibles.join(" · ")
          }`
        : "Épuisé";

  return (
    <div className="group relative flex flex-col gap-1.5">
      <Link href={`/produit/${produit.slug}`} className="flex flex-col gap-1.5">
        <div className="relative">
          <VisuelProduit
            produit={produit}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            priorite={priorite}
            porteAuSurvol
            className="aspect-[4/5]"
          />
          {badge && (
            <span
              className={`absolute top-2.5 left-2.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                badge === "Nouveau" ? "bg-white text-encre" : "bg-encre text-white"
              }`}
            >
              {badge}
            </span>
          )}
        </div>
        <span className="mt-1 text-sm leading-snug font-medium group-hover:underline">{produit.nom}</span>
        <span className="text-xs text-attenue">{libelleTailles}</span>
        <span className="text-sm font-bold">{formatFCFA(produit.prix)}</span>
      </Link>
      {!sansFavori && (
        <div className="absolute top-1.5 right-1.5">
          <BoutonFavori slug={produit.slug} nom={produit.nom} />
        </div>
      )}
    </div>
  );
}
