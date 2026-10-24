"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  ouvert: boolean;
  onFermer: () => void;
  /** Côté d'où glisse le panneau. */
  cote: "droite" | "gauche" | "haut" | "centre";
  /** Nom du panneau pour les lecteurs d'écran. */
  titre: string;
  className?: string;
  children: ReactNode;
};

/** Panneau modal natif (<dialog>) : focus piégé, Échap et clic sur le fond referment. */
export function Panneau({ ouvert, onFermer, cote, titre, className = "", children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialogue = ref.current;
    if (!dialogue) return;
    if (ouvert && !dialogue.open) dialogue.showModal();
    if (!ouvert && dialogue.open) dialogue.close();
  }, [ouvert]);

  return (
    <dialog
      ref={ref}
      aria-label={titre}
      className={`panneau panneau-${cote} ${className}`}
      onClose={onFermer}
      onClick={(e) => {
        if (e.target === e.currentTarget) onFermer();
      }}
    >
      {ouvert && children}
    </dialog>
  );
}
