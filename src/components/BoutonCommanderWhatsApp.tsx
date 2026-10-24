import { IconeMessage } from "./Icones";

type Props = { lien: string | null; libelle: string; plein?: boolean };

/**
 * Lien vers WhatsApp avec le message pré-rempli. Si le numéro de la boutique
 * n'est pas configuré, le bouton est désactivé avec une explication.
 */
export function BoutonCommanderWhatsApp({ lien, libelle, plein = false }: Props) {
  const style = `flex h-13 w-full items-center justify-center gap-2 rounded-full px-5 text-base font-semibold ${
    plein ? "bg-whatsapp text-white hover:brightness-110" : "border-2 border-whatsapp text-whatsapp hover:bg-whatsapp/5"
  }`;

  if (!lien) {
    return (
      <div className="flex flex-col gap-1">
        <button type="button" disabled className={`${style} cursor-not-allowed opacity-50`}>
          <IconeMessage className="size-5" />
          {libelle}
        </button>
        <p className="text-center text-xs text-attenue">
          Numéro WhatsApp de la boutique à configurer (fichier .env.local).
        </p>
      </div>
    );
  }

  return (
    <a href={lien} target="_blank" rel="noopener noreferrer" className={style}>
      <IconeMessage className="size-5" />
      {libelle}
    </a>
  );
}
