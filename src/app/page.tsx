import Image from "next/image";
import Link from "next/link";
import { boutique } from "@/config/boutique";
import { inspirations } from "@/data/ambiances";
import { CATEGORIES, produits } from "@/data/produits";
import { BandeauDefilant } from "@/components/BandeauDefilant";
import { BoutonWhatsAppFlottant } from "@/components/BoutonWhatsAppFlottant";
import { CarteProduit } from "@/components/CarteProduit";
import {
  IconeFleche,
  IconeLivraison,
  IconeMessage,
  IconeRetours,
  IconeTelephone,
} from "@/components/Icones";
import { FondWax, ImageAmbiance } from "@/components/ImageAmbiance";
import { Portant } from "@/components/Portant";
import { VisuelProduit } from "@/components/VisuelProduit";
import { formatFCFA } from "@/lib/format";
import { lienWhatsApp } from "@/lib/whatsapp";

export default function Accueil() {
  const nouveautes = produits.filter((p) => p.nouveaute).slice(0, 8);
  const photosInspiration = inspirations();
  const lienNouveautes = lienWhatsApp(
    boutique.whatsapp,
    `Bonjour ${boutique.nom}, je souhaite recevoir vos nouveautés sur WhatsApp.`,
  );

  // Données structurées pour Google : la boutique, son adresse et ses horaires.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    name: boutique.nom,
    description: boutique.description,
    address: { "@type": "PostalAddress", streetAddress: boutique.adresse, addressCountry: "SN" },
    currenciesAccepted: "XOF",
    paymentAccepted: "Wave, Orange Money, espèces",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      {/* 1. Le portant */}
      <section aria-labelledby="titre-collection" className="flex flex-col gap-4 bg-[#f3f1ec] pt-8 md:pt-12">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 px-4 text-center">
          <p className="text-xs font-semibold tracking-[0.16em] text-doux uppercase">Nouvelle collection</p>
          <h1 id="titre-collection" className="font-titre text-4xl leading-[1.05] font-extrabold md:text-6xl">
            {boutique.slogan}
          </h1>
        </div>
        <Portant />
        <BandeauDefilant />
      </section>

      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-4 pt-12 pb-8 md:gap-20">
        {/* 2. La campagne */}
        <section aria-labelledby="titre-campagne">
          <div className="relative overflow-hidden rounded-3xl text-white">
            <ImageAmbiance
              nom="campagne"
              alt="Une femme en robe en wax dans une rue colorée de Dakar"
              sizes="(min-width: 1152px) 1152px, 100vw"
              position="50% 35%"
              className="aspect-[4/5] sm:aspect-[16/9]"
              repli={<FondWax />}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex max-w-xl flex-col gap-3 p-6 md:p-10">
              <p className="text-xs font-semibold tracking-[0.16em] uppercase">Pour les fêtes et les cérémonies</p>
              <h2 id="titre-campagne" className="font-titre text-3xl leading-tight font-extrabold md:text-5xl">
                Brillez en wax et en bazin
              </h2>
              <Link
                href="/catalogue"
                className="mt-1 inline-flex h-12 items-center gap-2 self-start rounded-full bg-white px-6 font-semibold text-encre hover:bg-white/90"
              >
                Découvrir la collection
                <IconeFleche className="size-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* 3. Les catégories */}
        <section aria-labelledby="titre-categories" className="flex flex-col gap-5">
          <h2 id="titre-categories" className="font-titre text-2xl font-bold md:text-3xl">
            Par où commencer ?
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {CATEGORIES.map((c) => {
              const exemple = produits.find((p) => p.categorie === c.id)!;
              return (
                <Link key={c.id} href={`/catalogue/${c.id}`} className="group relative overflow-hidden rounded-2xl">
                  <ImageAmbiance
                    nom={`categorie-${c.id}`}
                    alt=""
                    sizes="(min-width: 640px) 33vw, 100vw"
                    className="aspect-[4/3] transition-transform duration-500 group-hover:scale-[1.03] sm:aspect-[3/4]"
                    repli={
                      <div className="absolute inset-0">
                        <VisuelProduit produit={exemple} sizes="(min-width: 640px) 33vw, 100vw" className="h-full rounded-none" />
                      </div>
                    }
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 text-white">
                    <span className="flex flex-col">
                      <span className="font-titre text-2xl font-extrabold">{c.nom}</span>
                      <span className="text-sm text-white/85">{c.accroche}</span>
                    </span>
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-encre">
                      <IconeFleche className="size-5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 4. Les nouveautés */}
        <section className="flex flex-col gap-5" aria-labelledby="titre-nouveautes">
          <div className="flex items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h2 id="titre-nouveautes" className="font-titre text-2xl font-bold md:text-3xl">
                Les nouveautés
              </h2>
              <p className="text-sm text-doux">Arrivées cette semaine à la boutique.</p>
            </div>
            <Link href="/catalogue" className="inline-flex h-11 shrink-0 items-center text-sm font-semibold underline">
              Tout voir
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 lg:grid-cols-4">
            {nouveautes.map((p) => (
              <CarteProduit key={p.slug} produit={p} />
            ))}
          </div>
        </section>

        {/* 5. L'atelier */}
        <section aria-labelledby="titre-atelier" className="grid items-center gap-6 md:grid-cols-2 md:gap-12">
          <ImageAmbiance
            nom="atelier"
            alt="Les mains d'une couturière piquant un tissu wax à la machine"
            sizes="(min-width: 768px) 50vw, 100vw"
            className="aspect-[4/3] rounded-3xl"
            repli={<FondWax teinte="#8a5912" />}
          />
          <div className="flex flex-col gap-4">
            <p className="text-xs font-semibold tracking-[0.16em] text-doux uppercase">Notre atelier</p>
            <h2 id="titre-atelier" className="font-titre text-3xl leading-tight font-extrabold md:text-4xl">
              Coupé et cousu à Dakar
            </h2>
            <p className="leading-relaxed text-doux">
              Chaque pièce est taillée dans des tissus choisis au marché HLM puis assemblée dans notre atelier. Une
              retouche à faire ? Nos couturiers ajustent la longueur ou la taille avant la livraison.
            </p>
            <Link
              href="/a-propos"
              className="inline-flex h-12 items-center gap-2 self-start rounded-full border-[1.5px] border-encre px-6 font-semibold hover:bg-encre hover:text-white"
            >
              Notre histoire
              <IconeFleche className="size-5" />
            </Link>
          </div>
        </section>

        {/* 6. Les inspirations */}
        {photosInspiration.length > 0 && (
          <section aria-labelledby="titre-inspirations" className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <h2 id="titre-inspirations" className="font-titre text-2xl font-bold md:text-3xl">
                Inspirations
              </h2>
              <p className="text-sm text-doux">Nos pièces, portées à Dakar.</p>
            </div>
            <div className="rangee">
              {photosInspiration.map((src, i) => (
                <Link
                  key={src}
                  href="/catalogue"
                  className="relative aspect-[3/4] overflow-hidden rounded-2xl"
                  aria-label={`Inspiration ${i + 1} : voir le catalogue`}
                >
                  <Image src={src} alt="" fill sizes="(min-width: 768px) 25vw, 46vw" className="object-cover transition-transform duration-500 hover:scale-[1.03]" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 7. Les engagements */}
        <section aria-label="Nos engagements" className="grid gap-px overflow-hidden rounded-2xl bg-ligne sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icone: <IconeLivraison className="size-7" />,
              titre: "Livraison rapide",
              texte: `Dakar sous 24 à 48 h, offerte dès ${formatFCFA(boutique.livraisonOfferte.seuil)}.`,
            },
            {
              icone: <IconeTelephone className="size-7" />,
              titre: "Paiement facile",
              texte: "Wave, Orange Money ou en espèces à la livraison.",
            },
            {
              icone: <IconeRetours className="size-7" />,
              titre: "Échange possible",
              texte: `Une taille qui ne va pas ? Échange ou retour sous ${boutique.retoursJours} jours.`,
            },
            {
              icone: <IconeMessage className="size-7" />,
              titre: "Conseil sur WhatsApp",
              texte: "Une question sur une taille ou un tissu ? On vous répond.",
            },
          ].map((e) => (
            <div key={e.titre} className="flex flex-col gap-2 bg-fond p-5">
              {e.icone}
              <p className="font-semibold">{e.titre}</p>
              <p className="text-sm leading-relaxed text-doux">{e.texte}</p>
            </div>
          ))}
        </section>

        {/* 8. Les nouveautés sur WhatsApp */}
        {lienNouveautes && (
          <section
            aria-labelledby="titre-whatsapp"
            className="flex flex-col items-start gap-4 rounded-3xl bg-encre p-6 text-white md:flex-row md:items-center md:justify-between md:p-10"
          >
            <div className="flex flex-col gap-2">
              <h2 id="titre-whatsapp" className="font-titre text-2xl font-extrabold md:text-3xl">
                Les nouveautés en avant-première
              </h2>
              <p className="text-white/80">Recevez les nouvelles pièces sur WhatsApp avant tout le monde.</p>
            </div>
            <a
              href={lienNouveautes}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-13 shrink-0 items-center gap-2 rounded-full bg-whatsapp px-6 font-semibold text-white hover:brightness-110"
            >
              <IconeMessage className="size-5" />
              Je m&apos;abonne sur WhatsApp
            </a>
          </section>
        )}
      </div>
      <BoutonWhatsAppFlottant />
    </>
  );
}
