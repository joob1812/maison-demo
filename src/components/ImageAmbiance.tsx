import Image from "next/image";
import type { ReactNode } from "react";
import { ambiance, type NomAmbiance } from "@/data/ambiances";

type Props = {
  nom: NomAmbiance;
  /** Description de l'image pour les lecteurs d'écran. */
  alt: string;
  sizes: string;
  priorite?: boolean;
  /** Cadrage de la photo dans son cadre (ex. "50% 30%"). */
  position?: string;
  className?: string;
  /** Affiché tant que l'image n'existe pas. */
  repli: ReactNode;
};

/** Image d'ambiance plein cadre, ou un repli soigné tant qu'elle n'a pas été générée ou fournie. */
export function ImageAmbiance({ nom, alt, sizes, priorite = false, position = "50% 50%", className = "", repli }: Props) {
  const src = ambiance(nom);
  // Le cadre est positionné (relative) sauf s'il l'est déjà (ex. absolute inset-0 en fond de section).
  const positionCadre = /\b(absolute|fixed)\b/.test(className) ? "" : "relative";
  return (
    <div className={`${positionCadre} overflow-hidden ${className}`}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priorite}
          className="object-cover"
          style={{ objectPosition: position }}
        />
      ) : (
        repli
      )}
    </div>
  );
}

/** Fond « tissu wax » en CSS, utilisé comme repli des grandes images. */
export function FondWax({ className = "", teinte }: { className?: string; teinte?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 bg-marque ${className}`}
      style={{
        backgroundColor: teinte,
        backgroundImage:
          "radial-gradient(circle at 50% 50%, rgb(227 170 60 / 0.9) 0 18%, transparent 19% 27%, rgb(227 170 60 / 0.55) 28% 31%, transparent 32%)",
        backgroundSize: "56px 56px",
      }}
    />
  );
}
