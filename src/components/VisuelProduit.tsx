import Image from "next/image";
import { COULEURS, estSuspendu, photoDetouree, type CouleurId, type Produit } from "@/data/produits";
import { Vetement } from "./Vetement";

type Props = {
  produit: Produit;
  /** Couleur affichée ; par défaut la première du produit. */
  couleur?: CouleurId;
  /** Attribut sizes de next/image, pour charger la bonne taille de photo. */
  sizes: string;
  priorite?: boolean;
  /** Montre la photo portée au survol (ordinateur), s'il y en a une. */
  porteAuSurvol?: boolean;
  /** Face du vêtement (le dos n'existe qu'en dessin ou en photo détourée). */
  face?: "recto" | "verso";
  className?: string;
};

/**
 * Visuel d'un produit, par ordre de préférence :
 * 1. sa photo détourée sur cintre, dans la couleur choisie (`detoure`) ;
 * 2. sa première photo (`images` : photo portée ou mise en scène) ;
 * 3. le vêtement dessiné, dans la couleur choisie.
 */
export function VisuelProduit({
  produit,
  couleur,
  sizes,
  priorite = false,
  porteAuSurvol = false,
  face = "recto",
  className = "",
}: Props) {
  const choix = couleur ?? produit.couleurs[0];
  const detoure = photoDetouree(produit, choix, face);
  const photo = face === "recto" ? produit.images[0] : undefined;
  const suspendu = estSuspendu(produit);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${className}`}
      style={{ backgroundColor: COULEURS[choix].teinte }}
    >
      {photo && !detoure ? (
        <Image src={photo} alt={produit.nom} fill sizes={sizes} priority={priorite} className="object-cover" />
      ) : (
        <>
          {suspendu && (
            <div aria-hidden="true" className="portant-barre absolute inset-x-0 top-[7%] !h-[4px] opacity-70" />
          )}
          <div
            className={`absolute inset-x-0 flex justify-center ${suspendu ? "top-[7%] bottom-[3%]" : "inset-y-[6%] items-center"}`}
          >
            <Vetement
              silhouette={produit.illustration.silhouette}
              motif={produit.illustration.motif}
              couleur={choix}
              face={face}
              photo={detoure}
              chargement={priorite ? "eager" : "lazy"}
              className="h-full w-auto drop-shadow-[0_10px_12px_rgba(0,0,0,0.16)]"
            />
          </div>
          {porteAuSurvol && photo && (
            <Image
              src={photo}
              alt=""
              fill
              sizes={sizes}
              className="object-cover opacity-0 transition-opacity duration-500 pointer-fine:group-hover:opacity-100"
            />
          )}
        </>
      )}
    </div>
  );
}
