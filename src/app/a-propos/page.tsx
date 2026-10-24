import type { Metadata } from "next";
import Link from "next/link";
import { FondWax, ImageAmbiance } from "@/components/ImageAmbiance";
import { IconeAiguille, IconeFleche, IconeMessage, IconeRetours } from "@/components/Icones";
import { boutique } from "@/config/boutique";

export const metadata: Metadata = {
  title: "Notre histoire",
  description: `L'histoire de ${boutique.nom} : un atelier de couture à Dakar devenu boutique de wax et de bazin.`,
};

export default function APropos() {
  return (
    <div className="flex flex-col gap-16 pb-8">
      <section className="relative overflow-hidden bg-encre text-white">
        <ImageAmbiance
          nom="boutique"
          alt={`L'intérieur de la boutique ${boutique.nom}, vêtements en wax sur des portants`}
          sizes="100vw"
          priorite
          className="absolute inset-0"
          repli={<FondWax className="opacity-60" />}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />
        <div className="relative mx-auto flex min-h-[60vh] max-w-6xl flex-col justify-end gap-4 px-4 py-12">
          <p className="text-xs font-semibold tracking-[0.16em] uppercase">Notre histoire</p>
          <h1 className="max-w-2xl font-titre text-4xl leading-tight font-extrabold md:text-6xl">
            Du petit atelier de quartier à votre garde-robe
          </h1>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 md:grid-cols-2 md:gap-14">
        <div className="flex flex-col gap-4 text-lg leading-relaxed text-doux">
          <p>
            Tout a commencé dans un atelier de couture de Sacré-Cœur, avec deux machines et une passion : le wax et le
            bazin, portés avec élégance au quotidien comme les jours de fête.
          </p>
          <p>
            Aujourd&apos;hui, {boutique.nom} propose des pièces prêtes à porter, coupées et cousues à Dakar, pour que
            chacun trouve sa tenue sans attendre des semaines chez le tailleur.
          </p>
          <p>
            Nos tissus sont choisis un par un au marché HLM. Nos couturiers contrôlent chaque finition, et ajustent
            la longueur ou la taille si vous le demandez.
          </p>
        </div>
        <ImageAmbiance
          nom="atelier"
          alt="Les mains d'une couturière piquant un tissu wax à la machine"
          sizes="(min-width: 768px) 50vw, 100vw"
          className="aspect-[4/5] rounded-3xl"
          repli={<FondWax teinte="#8a5912" />}
        />
      </div>

      <section aria-labelledby="titre-valeurs" className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4">
        <h2 id="titre-valeurs" className="font-titre text-3xl font-extrabold">
          Ce qui compte pour nous
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              icone: <IconeAiguille className="size-8" />,
              titre: "Le travail bien fait",
              texte: "Coutures doublées, ourlets finis main : nos pièces sont faites pour durer et être reportées.",
            },
            {
              icone: <IconeRetours className="size-8" />,
              titre: "La bonne taille",
              texte: `Un doute ? Échange sous ${boutique.retoursJours} jours, ou retouche avant livraison.`,
            },
            {
              icone: <IconeMessage className="size-8" />,
              titre: "Un vrai conseil",
              texte: "Sur WhatsApp ou en boutique, on vous aide à choisir le tissu, la coupe et la taille.",
            },
          ].map((v) => (
            <div key={v.titre} className="flex flex-col gap-3 rounded-2xl bg-fond p-6">
              {v.icone}
              <h3 className="text-lg font-bold">{v.titre}</h3>
              <p className="leading-relaxed text-doux">{v.texte}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/catalogue"
            className="inline-flex h-13 items-center gap-2 rounded-full bg-marque px-6 font-semibold text-white hover:bg-marque/90"
          >
            Découvrir la collection <IconeFleche className="size-5" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex h-13 items-center rounded-full border-[1.5px] border-encre px-6 font-semibold hover:bg-encre hover:text-white"
          >
            Venir à la boutique
          </Link>
        </div>
      </section>
    </div>
  );
}
