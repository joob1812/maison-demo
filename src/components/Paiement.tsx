"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { boutique, fraisLivraison, trouverMoyenPaiement, trouverZone } from "@/config/boutique";
import { formatFCFA } from "@/lib/format";
import { nombreArticles, sousTotal, usePanier, useZone, validerCommande } from "@/lib/panier";
import { payer } from "@/lib/paiement";
import { lireClientMemorise, memoriserClient } from "@/lib/preferences";
import { useEstClient } from "@/lib/stockage";
import { afficherNumero, normaliserNumero } from "@/lib/whatsapp";
import { ChoixZone } from "./ChoixZone";
import { IconeCadenas, IconeInfo } from "./Icones";

type Erreurs = Partial<Record<"nom" | "telephone" | "adresse" | "paiement", string>>;

const champ =
  "h-13 w-full rounded-xl border-[1.5px] border-zinc-300 bg-white px-4 text-base placeholder:text-attenue aria-[invalid=true]:border-erreur";

export function Paiement() {
  const router = useRouter();
  const estClient = useEstClient();
  const panier = usePanier();
  const zone = trouverZone(useZone());

  // Coordonnées de la dernière commande, déjà remplies (gardées sur ce téléphone uniquement).
  const [nom, setNom] = useState(() => lireClientMemorise()?.nom ?? "");
  const [telephone, setTelephone] = useState(() => {
    const client = lireClientMemorise();
    return client ? afficherNumero(client.telephone) : "";
  });
  const [adresse, setAdresse] = useState(() => lireClientMemorise()?.adresse ?? "");
  const [note, setNote] = useState("");
  const [moyenId, setMoyenId] = useState<string>(boutique.moyensPaiement[0].id);
  const [erreurs, setErreurs] = useState<Erreurs>({});
  const [etat, setEtat] = useState<"saisie" | "envoi" | "termine">("saisie");

  const moyen = trouverMoyenPaiement(moyenId);

  if (!estClient) return <div className="h-96 animate-pulse rounded-2xl bg-fond" aria-hidden="true" />;

  if (etat === "termine") {
    return <p className="py-16 text-center text-doux">Commande enregistrée, redirection…</p>;
  }

  if (panier.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-fond px-4 py-14 text-center">
        <p className="text-lg font-semibold">Votre panier est vide</p>
        <Link
          href="/catalogue"
          className="inline-flex h-12 items-center rounded-full bg-marque px-6 font-semibold text-white hover:bg-marque/90"
        >
          Voir le catalogue
        </Link>
      </div>
    );
  }

  const st = sousTotal(panier);
  const frais = fraisLivraison(zone, st);
  const total = st + frais;
  const n = nombreArticles(panier);

  async function envoyer(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const numero = normaliserNumero(telephone);
    const nouvelles: Erreurs = {};
    if (nom.trim().length < 2) nouvelles.nom = "Indiquez votre nom.";
    if (!numero) nouvelles.telephone = "Numéro sénégalais à 9 chiffres, ex. 77 123 45 67.";
    if (zone.adresseRequise && adresse.trim().length < 3) nouvelles.adresse = "Indiquez votre quartier et un repère.";
    setErreurs(nouvelles);
    if (Object.keys(nouvelles).length || !numero) return;

    setEtat("envoi");
    try {
      await payer(moyen);
      const adresseLivraison = zone.adresseRequise ? adresse.trim() : "";
      validerCommande(
        panier,
        { nom: nom.trim(), telephone: numero, zone: zone.id, adresse: adresseLivraison, note: note.trim() || undefined },
        moyen.id,
      );
      memoriserClient({ nom: nom.trim(), telephone: numero, adresse: adresse.trim() });
      setEtat("termine");
      router.push("/confirmation");
    } catch (err) {
      setErreurs({ paiement: err instanceof Error ? err.message : "Le paiement n'a pas abouti. Réessayez." });
      setEtat("saisie");
    }
  }

  const libelleBouton =
    etat === "envoi"
      ? moyen.mobileMoney
        ? `Paiement ${moyen.nom} en cours…`
        : "Enregistrement…"
      : moyen.mobileMoney
        ? `Payer ${formatFCFA(total)} avec ${moyen.nom}`
        : "Confirmer la commande";

  return (
    <form onSubmit={envoyer} noValidate className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
      <div className="flex flex-col gap-8">
        {boutique.modePaiement === "demo" && (
          <p className="flex items-center gap-3 rounded-xl bg-alerte-fond px-4 py-3 text-sm font-medium text-alerte">
            <IconeInfo className="size-5 shrink-0" />
            Mode démonstration : aucun paiement n&apos;est effectué.
          </p>
        )}

        <fieldset className="flex flex-col gap-4">
          <legend className="mb-2 text-base font-semibold">Vos coordonnées</legend>
          <div className="flex flex-col gap-2">
            <label htmlFor="champ-nom" className="text-sm font-semibold">
              Nom complet
            </label>
            <input
              id="champ-nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              autoComplete="name"
              aria-invalid={!!erreurs.nom}
              aria-describedby={erreurs.nom ? "erreur-nom" : undefined}
              className={champ}
            />
            {erreurs.nom && (
              <p id="erreur-nom" className="text-sm font-medium text-erreur">
                {erreurs.nom}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="champ-telephone" className="text-sm font-semibold">
              Téléphone
            </label>
            <div className="flex items-center gap-2">
              <span aria-hidden="true" className="text-base font-semibold text-doux">
                +221
              </span>
              <input
                id="champ-telephone"
                type="tel"
                inputMode="tel"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                autoComplete="tel-national"
                placeholder="77 123 45 67"
                aria-invalid={!!erreurs.telephone}
                aria-describedby="aide-telephone"
                className={champ}
              />
            </div>
            <p
              id="aide-telephone"
              className={`text-sm ${erreurs.telephone ? "font-medium text-erreur" : "text-attenue"}`}
            >
              {erreurs.telephone ??
                (moyen.mobileMoney
                  ? `La demande de paiement ${moyen.nom} est envoyée sur ce numéro.`
                  : "La boutique vous contacte sur ce numéro pour la livraison.")}
            </p>
          </div>
        </fieldset>

        <ChoixZone />

        {zone.adresseRequise && (
          <div className="flex flex-col gap-2">
            <label htmlFor="champ-adresse" className="text-sm font-semibold">
              Adresse de livraison
            </label>
            <input
              id="champ-adresse"
              value={adresse}
              onChange={(e) => setAdresse(e.target.value)}
              autoComplete="street-address"
              placeholder="Quartier, rue, repère (ex. Sacré-Cœur 3, près de la pharmacie)"
              aria-invalid={!!erreurs.adresse}
              aria-describedby={erreurs.adresse ? "erreur-adresse" : undefined}
              className={champ}
            />
            {erreurs.adresse && (
              <p id="erreur-adresse" className="text-sm font-medium text-erreur">
                {erreurs.adresse}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label htmlFor="champ-note" className="text-sm font-semibold">
            Une précision pour la boutique ? <span className="font-normal text-attenue">(facultatif)</span>
          </label>
          <textarea
            id="champ-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            maxLength={300}
            placeholder="Ex. : livrer après 18 h, c'est un cadeau…"
            className="rounded-xl border-[1.5px] border-zinc-300 bg-white px-4 py-3 text-base placeholder:text-attenue"
          />
        </div>

        <fieldset className="flex flex-col gap-2.5">
          <legend className="mb-2 text-base font-semibold">Moyen de paiement</legend>
          {boutique.moyensPaiement.map((m) => {
            const actif = m.id === moyenId;
            return (
              <label
                key={m.id}
                className={`flex min-h-17 cursor-pointer items-center gap-3 rounded-xl border-[1.5px] px-4 py-3 ${
                  actif ? "border-marque bg-fond" : "border-ligne hover:border-zinc-400"
                }`}
              >
                <input
                  type="radio"
                  name="paiement"
                  value={m.id}
                  checked={actif}
                  onChange={() => setMoyenId(m.id)}
                  className="size-5 shrink-0 accent-marque"
                />
                <span className="flex flex-col gap-0.5">
                  <span className="font-semibold">{m.nom}</span>
                  <span className="text-sm leading-snug text-attenue">{m.description}</span>
                </span>
              </label>
            );
          })}
        </fieldset>
      </div>

      <aside className="flex flex-col gap-4 lg:sticky lg:top-24">
        <section aria-label="Montant" className="flex flex-col gap-1 rounded-2xl bg-fond p-5">
          <p className="text-sm text-doux">Total à payer</p>
          <p className="font-titre text-3xl font-extrabold">{formatFCFA(total)}</p>
          <p className="text-sm text-doux">
            {n} article{n > 1 ? "s" : ""} · {zone.nom}
            {zone.frais > 0 && frais === 0 ? " · livraison offerte" : ""}
          </p>
        </section>
        {erreurs.paiement && (
          <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-erreur">
            {erreurs.paiement}
          </p>
        )}
        <button
          type="submit"
          disabled={etat === "envoi"}
          className="h-13 rounded-full bg-marque px-5 text-base font-semibold text-white hover:bg-marque/90 disabled:opacity-60"
        >
          {libelleBouton}
        </button>
        <p className="flex items-start gap-2.5 text-sm leading-relaxed text-doux">
          <IconeCadenas className="mt-0.5 size-4.5 shrink-0" />
          La boutique ne voit jamais votre code secret. Vous recevez le récapitulatif de la commande sur WhatsApp.
        </p>
      </aside>
    </form>
  );
}
