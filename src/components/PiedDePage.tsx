import Link from "next/link";
import { boutique } from "@/config/boutique";
import { PAGES_INFO, PAGES_LEGALES } from "@/config/navigation";
import { CATEGORIES } from "@/data/produits";
import { afficherNumero, lienWhatsApp, normaliserNumero } from "@/lib/whatsapp";
import { IconeHorloge, IconeLieu, IconeMessage } from "./Icones";

const lienPied = "inline-flex min-h-10 items-center text-doux hover:text-encre hover:underline";

export function PiedDePage() {
  const numero = normaliserNumero(boutique.whatsapp);
  const lien = lienWhatsApp(boutique.whatsapp, `Bonjour ${boutique.nom}, j'ai une question.`);
  const reseaux = Object.entries(boutique.reseaux).filter(([, url]) => url);
  const nomsReseaux: Record<string, string> = { instagram: "Instagram", tiktok: "TikTok", facebook: "Facebook" };

  return (
    <footer className="mt-16 border-t border-ligne bg-fond">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-4 gap-y-8 px-4 py-12 text-sm lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div className="col-span-2 flex flex-col gap-3 lg:col-span-1">
          <p className="font-titre text-base font-extrabold tracking-[0.16em] uppercase">{boutique.nom}</p>
          <p className="max-w-xs leading-relaxed text-doux">{boutique.description}</p>
          {reseaux.length > 0 && (
            <div className="flex flex-wrap gap-x-4">
              {reseaux.map(([id, url]) => (
                <a key={id} href={url} target="_blank" rel="noopener noreferrer" className={lienPied}>
                  {nomsReseaux[id] ?? id}
                </a>
              ))}
            </div>
          )}
        </div>

        <nav aria-label="La boutique" className="flex flex-col">
          <p className="mb-1 font-semibold">La boutique</p>
          <Link href="/catalogue" className={lienPied}>
            Toute la collection
          </Link>
          {CATEGORIES.map((c) => (
            <Link key={c.id} href={`/catalogue/${c.id}`} className={lienPied}>
              {c.nom}
            </Link>
          ))}
          <Link href="/favoris" className={lienPied}>
            Mes favoris
          </Link>
        </nav>

        <nav aria-label="Aide" className="flex flex-col">
          <p className="mb-1 font-semibold">Aide</p>
          {PAGES_INFO.map((p) => (
            <Link key={p.href} href={p.href} className={lienPied}>
              {p.nom}
            </Link>
          ))}
        </nav>

        <div className="col-span-2 flex flex-col gap-3 sm:col-span-1">
          <p className="font-semibold">Nous trouver</p>
          <a href={boutique.lienCarte} target="_blank" rel="noopener noreferrer" className="flex gap-2 text-doux hover:text-encre">
            <IconeLieu className="mt-0.5 size-4.5 shrink-0" />
            <span className="underline-offset-2 hover:underline">{boutique.adresse}</span>
          </a>
          <div className="flex gap-2 text-doux">
            <IconeHorloge className="mt-0.5 size-4.5 shrink-0" />
            <ul>
              {boutique.horaires.map((h) => (
                <li key={h.jours}>
                  {h.jours} : {h.heures}
                </li>
              ))}
            </ul>
          </div>
          {lien && numero ? (
            <a
              href={lien}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 self-start rounded-full bg-whatsapp px-4 font-semibold text-white hover:brightness-110"
            >
              <IconeMessage className="size-4.5" />
              {afficherNumero(numero)}
            </a>
          ) : (
            <p className="text-doux">Numéro WhatsApp à configurer</p>
          )}
          <p className="text-doux">Wave, Orange Money ou paiement à la livraison</p>
        </div>
      </div>

      <div className="border-t border-ligne">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 text-xs text-attenue sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-x-4">
            {PAGES_LEGALES.map((p) => (
              <Link key={p.href} href={p.href} className="inline-flex min-h-10 items-center hover:text-encre hover:underline">
                {p.nom}
              </Link>
            ))}
          </div>
          <p>
            {boutique.demonstration && "Boutique de démonstration · photos générées par IA"}
            {boutique.demonstration && boutique.realisePar && " · "}
            {boutique.realisePar && `Site réalisé par ${boutique.realisePar}`}
          </p>
        </div>
      </div>
    </footer>
  );
}
