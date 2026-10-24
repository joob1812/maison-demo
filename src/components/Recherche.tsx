"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CATEGORIES, produits } from "@/data/produits";
import { formatFCFA, sansAccents } from "@/lib/format";
import { IconeFermer, IconeRecherche } from "./Icones";
import { Panneau } from "./Panneau";
import { VisuelProduit } from "./VisuelProduit";

/** Recherche instantanée dans le catalogue : nom, catégorie, tissu, description. */
export function Recherche() {
  const router = useRouter();
  const [ouvert, setOuvert] = useState(false);
  const [terme, setTerme] = useState("");

  const fermer = () => {
    setOuvert(false);
    setTerme("");
  };

  const mots = sansAccents(terme).split(/\s+/).filter(Boolean);
  const resultats = mots.length
    ? produits.filter((p) => {
        const texte = sansAccents(
          `${p.nom} ${CATEGORIES.find((c) => c.id === p.categorie)?.nom} ${p.illustration.motif} ${p.description}`,
        );
        return mots.every((m) => texte.includes(m));
      })
    : [];

  return (
    <>
      <button
        type="button"
        onClick={() => setOuvert(true)}
        aria-label="Rechercher"
        className="inline-flex size-11 items-center justify-center rounded-full hover:bg-fond"
      >
        <IconeRecherche />
      </button>
      <Panneau ouvert={ouvert} onFermer={fermer} cote="haut" titre="Recherche">
        <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 pt-3 pb-6">
          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              if (resultats[0]) {
                router.push(`/produit/${resultats[0].slug}`);
                fermer();
              }
            }}
            className="flex items-center gap-2"
          >
            <label className="flex h-13 flex-1 items-center gap-3 rounded-full border-[1.5px] border-zinc-300 bg-white px-4 focus-within:border-encre">
              <IconeRecherche className="size-5 shrink-0 text-attenue" />
              <span className="sr-only">Rechercher un article</span>
              <input
                type="search"
                autoFocus
                value={terme}
                onChange={(e) => setTerme(e.target.value)}
                placeholder="Robe, bazin, sandales…"
                className="h-full min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-attenue"
              />
            </label>
            <button
              type="button"
              onClick={fermer}
              aria-label="Fermer la recherche"
              className="flex size-11 shrink-0 items-center justify-center rounded-full hover:bg-fond"
            >
              <IconeFermer className="size-5" />
            </button>
          </form>

          {!mots.length ? (
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold text-doux">Parcourir</p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <Link
                    key={c.id}
                    href={`/catalogue/${c.id}`}
                    onClick={fermer}
                    className="inline-flex h-11 items-center rounded-full border border-zinc-300 px-4 text-sm font-semibold hover:border-encre"
                  >
                    {c.nom}
                  </Link>
                ))}
              </div>
            </div>
          ) : resultats.length ? (
            <ul className="flex flex-col divide-y divide-ligne" aria-label={`${resultats.length} résultat(s)`}>
              {resultats.map((p) => (
                <li key={p.slug}>
                  <Link href={`/produit/${p.slug}`} onClick={fermer} className="flex items-center gap-3 py-2.5">
                    <VisuelProduit produit={p} sizes="56px" className="aspect-[4/5] w-14 shrink-0 rounded-xl" />
                    <span className="flex flex-1 flex-col">
                      <span className="font-semibold">{p.nom}</span>
                      <span className="text-sm text-attenue">
                        {CATEGORIES.find((c) => c.id === p.categorie)?.nom}
                      </span>
                    </span>
                    <span className="font-bold whitespace-nowrap">{formatFCFA(p.prix)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-2xl bg-fond px-4 py-6 text-center text-sm text-doux">
              Aucun article pour « {terme} ». Essayez « robe », « bazin » ou « wax ».
            </p>
          )}
        </div>
      </Panneau>
    </>
  );
}
