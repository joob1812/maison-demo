"use client";

import { IconePartage } from "./Icones";

/** « Demander l'avis d'une amie » : partage la page dans WhatsApp (choix du contact). */
export function PartageWhatsApp({ nom }: { nom: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        const texte = `Regarde ce que j'ai trouvé : ${nom} ${window.location.href}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(texte)}`, "_blank", "noopener");
      }}
      className="inline-flex h-11 items-center gap-2 rounded-full px-1 text-sm font-semibold text-doux hover:text-encre"
    >
      <IconePartage className="size-5" />
      Demander l&apos;avis d&apos;une amie
    </button>
  );
}
