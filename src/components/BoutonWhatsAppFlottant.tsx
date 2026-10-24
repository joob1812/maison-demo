import { boutique } from "@/config/boutique";
import { lienWhatsApp } from "@/lib/whatsapp";
import { IconeMessage } from "./Icones";

/** Bouton de contact rond en bas à droite. N'apparaît que si le numéro est configuré. */
export function BoutonWhatsAppFlottant() {
  const lien = lienWhatsApp(boutique.whatsapp, `Bonjour ${boutique.nom}, j'ai une question.`);
  if (!lien) return null;

  return (
    <a
      href={lien}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Écrire à ${boutique.nom} sur WhatsApp`}
      className="fixed right-4 bottom-6 z-20 flex size-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-lg shadow-black/20 hover:brightness-110"
    >
      <IconeMessage className="size-7" />
    </a>
  );
}
