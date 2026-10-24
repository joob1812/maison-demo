"use client";

import Link from "next/link";
import { useState } from "react";
import { boutique } from "@/config/boutique";
import { PAGES_INFO } from "@/config/navigation";
import { CATEGORIES } from "@/data/produits";
import { lienWhatsApp } from "@/lib/whatsapp";
import { IconeFermer, IconeHorloge, IconeMenu, IconeMessage } from "./Icones";
import { Panneau } from "./Panneau";

export function MenuMobile() {
  const [ouvert, setOuvert] = useState(false);
  const fermer = () => setOuvert(false);
  const lien = lienWhatsApp(boutique.whatsapp, `Bonjour ${boutique.nom}, j'ai une question.`);

  return (
    <>
      <button
        type="button"
        onClick={() => setOuvert(true)}
        aria-label="Ouvrir le menu"
        className="inline-flex size-11 items-center justify-center rounded-full hover:bg-fond md:hidden"
      >
        <IconeMenu />
      </button>
      <Panneau ouvert={ouvert} onFermer={fermer} cote="gauche" titre="Menu">
        <div className="flex min-h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b border-ligne px-4">
            <p className="font-titre font-extrabold tracking-[0.16em] uppercase">{boutique.nom}</p>
            <button
              type="button"
              autoFocus
              onClick={fermer}
              aria-label="Fermer le menu"
              className="flex size-11 items-center justify-center rounded-full hover:bg-fond"
            >
              <IconeFermer className="size-5" />
            </button>
          </div>
          <nav aria-label="Menu" className="flex flex-1 flex-col gap-8 px-4 py-6">
            <div className="flex flex-col">
              <Link href="/catalogue" onClick={fermer} className="py-3 font-titre text-2xl font-bold">
                Tout le catalogue
              </Link>
              {CATEGORIES.map((c) => (
                <Link key={c.id} href={`/catalogue/${c.id}`} onClick={fermer} className="flex flex-col py-3">
                  <span className="font-titre text-2xl font-bold">{c.nom}</span>
                  <span className="text-sm text-attenue">{c.accroche}</span>
                </Link>
              ))}
              <Link href="/favoris" onClick={fermer} className="py-3 font-titre text-2xl font-bold">
                Mes favoris
              </Link>
            </div>
            <div className="flex flex-col border-t border-ligne pt-4">
              {PAGES_INFO.map((p) => (
                <Link key={p.href} href={p.href} onClick={fermer} className="py-2.5 text-doux hover:text-encre">
                  {p.nom}
                </Link>
              ))}
            </div>
            <div className="mt-auto flex flex-col gap-3 rounded-2xl bg-fond p-4 text-sm">
              <p className="flex items-center gap-2 font-semibold">
                <IconeHorloge className="size-5" /> Horaires de la boutique
              </p>
              {boutique.horaires.map((h) => (
                <p key={h.jours} className="flex justify-between text-doux">
                  <span>{h.jours}</span>
                  <span>{h.heures}</span>
                </p>
              ))}
              {lien && (
                <a
                  href={lien}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 flex h-12 items-center justify-center gap-2 rounded-full bg-whatsapp font-semibold text-white"
                >
                  <IconeMessage className="size-5" /> Nous écrire sur WhatsApp
                </a>
              )}
            </div>
          </nav>
        </div>
      </Panneau>
    </>
  );
}
