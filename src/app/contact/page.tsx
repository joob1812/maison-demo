import type { Metadata } from "next";
import { IconeHorloge, IconeLieu, IconeMessage } from "@/components/Icones";
import { PageTexte } from "@/components/PageTexte";
import { boutique } from "@/config/boutique";
import { afficherNumero, lienWhatsApp, normaliserNumero } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contact et horaires",
  description: `Adresse, horaires et contact WhatsApp de ${boutique.nom} à Dakar.`,
};

export default function Contact() {
  const numero = normaliserNumero(boutique.whatsapp);
  const lien = lienWhatsApp(boutique.whatsapp, `Bonjour ${boutique.nom}, j'ai une question.`);

  return (
    <PageTexte
      surtitre="Contact"
      titre="Passez nous voir"
      intro="Essayez les pièces en boutique, ou écrivez-nous : nous répondons sur WhatsApp pendant les heures d'ouverture."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <section className="flex flex-col gap-3 rounded-2xl bg-fond p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <IconeLieu className="size-6" /> La boutique
          </h2>
          <p className="text-doux">{boutique.adresse}</p>
          <a
            href={boutique.lienCarte}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center self-start font-semibold underline"
          >
            Ouvrir dans Google Maps
          </a>
        </section>
        <section className="flex flex-col gap-3 rounded-2xl bg-fond p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <IconeHorloge className="size-6" /> Horaires
          </h2>
          <dl className="flex flex-col gap-1.5">
            {boutique.horaires.map((h) => (
              <div key={h.jours} className="flex justify-between gap-4">
                <dt className="text-doux">{h.jours}</dt>
                <dd className="font-semibold">{h.heures}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      <section className="flex flex-col items-start gap-4 rounded-2xl border border-ligne p-6">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <IconeMessage className="size-6" /> WhatsApp
        </h2>
        {lien && numero ? (
          <>
            <p className="text-doux">
              Une question sur une taille, un tissu ou une commande ? Écrivez-nous au {afficherNumero(numero)}.
            </p>
            <a
              href={lien}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-13 items-center gap-2 rounded-full bg-whatsapp px-6 font-semibold text-white hover:brightness-110"
            >
              <IconeMessage className="size-5" /> Nous écrire sur WhatsApp
            </a>
          </>
        ) : (
          <p className="text-doux">Numéro WhatsApp à configurer (fichier .env.local).</p>
        )}
        {boutique.email && (
          <p className="text-doux">
            Par e-mail :{" "}
            <a href={`mailto:${boutique.email}`} className="font-semibold underline">
              {boutique.email}
            </a>
          </p>
        )}
      </section>
    </PageTexte>
  );
}
