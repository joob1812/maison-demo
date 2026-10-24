"use client";

import Link from "next/link";
import { boutique, trouverMoyenPaiement, trouverZone } from "@/config/boutique";
import { formatFCFA } from "@/lib/format";
import { messageCommande, useDerniereCommande } from "@/lib/panier";
import { useEstClient } from "@/lib/stockage";
import { lienWhatsApp } from "@/lib/whatsapp";
import { BoutonCommanderWhatsApp } from "./BoutonCommanderWhatsApp";
import { IconeMessage, IconeValide } from "./Icones";

export function Confirmation() {
  const estClient = useEstClient();
  const commande = useDerniereCommande();

  if (!estClient) return <div className="h-96 animate-pulse rounded-2xl bg-fond" aria-hidden="true" />;

  if (!commande) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-fond px-4 py-14 text-center">
        <p className="text-lg font-semibold">Aucune commande récente</p>
        <Link
          href="/catalogue"
          className="inline-flex h-12 items-center rounded-full bg-marque px-6 font-semibold text-white hover:bg-marque/90"
        >
          Voir le catalogue
        </Link>
      </div>
    );
  }

  const moyen = trouverMoyenPaiement(commande.paiement);
  const zone = trouverZone(commande.client.zone);
  const message = messageCommande(commande);
  const lien = lienWhatsApp(boutique.whatsapp, message);
  const payee = moyen.mobileMoney;

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex size-17 items-center justify-center rounded-full bg-marque text-white">
          <IconeValide className="size-9" />
        </div>
        <h1 className="font-titre text-3xl font-extrabold">{payee ? "Commande confirmée" : "Commande enregistrée"}</h1>
        <p className="max-w-sm leading-relaxed text-doux">
          Merci {commande.client.nom.split(" ")[0]} ! Envoyez le récapitulatif à la boutique sur WhatsApp : elle vous
          répond pour organiser la livraison.
        </p>
      </div>

      <section aria-label="Détails de la commande" className="flex flex-col gap-2.5 rounded-2xl bg-fond p-5 text-sm">
        <div className="flex justify-between gap-3">
          <span className="text-doux">Commande</span>
          <span className="font-semibold">{commande.numero}</span>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-doux">Paiement</span>
          <span className="text-right font-semibold">
            {payee ? `${formatFCFA(commande.total)} · ${moyen.nom}` : `${formatFCFA(commande.total)} à la livraison`}
          </span>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-doux">Livraison</span>
          <span className="text-right font-semibold">
            {zone.nom} · {zone.delai.toLowerCase()}
          </span>
        </div>
        {boutique.modePaiement === "demo" && payee && (
          <p className="mt-1 border-t border-zinc-300 pt-3 text-alerte">Démonstration : aucun paiement n&apos;a été effectué.</p>
        )}
      </section>

      <section className="flex flex-col gap-2.5">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-doux">
          <IconeMessage className="size-4.5" />
          Message qui sera envoyé à la boutique
        </h2>
        <div className="rounded-2xl bg-[#E8EDE6] p-4">
          <p className="max-w-sm rounded-[4px_14px_14px_14px] bg-white px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line shadow-sm">
            {message}
          </p>
        </div>
      </section>

      <div className="flex flex-col gap-3">
        <BoutonCommanderWhatsApp lien={lien} libelle="Envoyer le récapitulatif sur WhatsApp" plein />
        <Link
          href="/"
          className="flex h-13 items-center justify-center rounded-full border-[1.5px] border-zinc-300 font-semibold hover:border-encre"
        >
          Retour à la boutique
        </Link>
      </div>
    </div>
  );
}
