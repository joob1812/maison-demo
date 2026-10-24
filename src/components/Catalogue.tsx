"use client";

import Link from "next/link";
import { useState } from "react";
import { CATEGORIES, COULEURS, TAILLES, produits, type Categorie, type CouleurId, type Taille } from "@/data/produits";
import { sansAccents } from "@/lib/format";
import { CarteProduit } from "./CarteProduit";

type Props = { categorie: Categorie | null };

/** Liste des produits avec filtres par taille, couleur et recherche, entièrement côté navigateur. */
export function Catalogue({ categorie }: Props) {
  const [taille, setTaille] = useState<Taille | null>(null);
  const [couleur, setCouleur] = useState<CouleurId | null>(null);
  const [recherche, setRecherche] = useState("");
  const [tri, setTri] = useState<"nouveautes" | "prix-croissant" | "prix-decroissant">("nouveautes");

  const dansCategorie = produits.filter((p) => !categorie || p.categorie === categorie);
  const couleursPresentes = (Object.keys(COULEURS) as CouleurId[]).filter((c) =>
    dansCategorie.some((p) => p.couleurs.includes(c)),
  );
  const taillesPresentes = TAILLES.filter((t) => dansCategorie.some((p) => p.tailles.some((x) => x.taille === t)));

  const terme = sansAccents(recherche.trim());
  const resultats = dansCategorie
    .filter(
      (p) =>
        (!taille || p.tailles.some((t) => t.taille === taille && t.stock > 0)) &&
        (!couleur || p.couleurs.includes(couleur)) &&
        (!terme || sansAccents(p.nom).includes(terme)),
    )
    .sort((a, b) =>
      tri === "prix-croissant"
        ? a.prix - b.prix
        : tri === "prix-decroissant"
          ? b.prix - a.prix
          : Number(b.nouveaute) - Number(a.nouveaute),
    );
  const filtreActif = !!(taille || couleur || terme);

  const puce = (actif: boolean) =>
    `inline-flex h-11 shrink-0 items-center rounded-full border px-4 text-sm font-semibold whitespace-nowrap ${
      actif ? "border-marque bg-marque text-white" : "border-zinc-300 bg-white text-encre hover:border-encre"
    }`;

  return (
    <div className="flex flex-col gap-6">
      <nav aria-label="Catégories" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        <Link href="/catalogue" aria-current={!categorie ? "page" : undefined} className={puce(!categorie)}>
          Tout
        </Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c.id}
            href={`/catalogue/${c.id}`}
            aria-current={categorie === c.id ? "page" : undefined}
            className={puce(categorie === c.id)}
          >
            {c.nom}
          </Link>
        ))}
      </nav>

      <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-end">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-doux">Rechercher</span>
          <input
            type="search"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Robe, chemise, bazin…"
            className="h-12 rounded-xl border border-zinc-300 bg-white px-4 text-base placeholder:text-attenue"
          />
        </label>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-sm font-semibold text-doux">Taille</legend>
          <div className="flex flex-wrap gap-2">
            {taillesPresentes.map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={taille === t}
                onClick={() => setTaille(taille === t ? null : t)}
                className={`min-w-12 ${puce(taille === t)}`}
              >
                {t}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-sm font-semibold text-doux">Couleur</legend>
          <div className="flex flex-wrap gap-1">
            {couleursPresentes.map((id) => {
              const c = COULEURS[id];
              const actif = couleur === id;
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={actif}
                  aria-label={c.nom}
                  title={c.nom}
                  onClick={() => setCouleur(actif ? null : id)}
                  className={`flex size-11 items-center justify-center rounded-full border-2 ${
                    actif ? "border-marque" : "border-transparent hover:border-zinc-300"
                  }`}
                >
                  <span className="size-8 rounded-full border border-zinc-300" style={{ backgroundColor: c.hex }} />
                </button>
              );
            })}
          </div>
        </fieldset>
      </div>

      <div className="flex min-h-11 items-center justify-between border-t border-ligne pt-3">
        <p className="text-sm text-doux" aria-live="polite">
          {resultats.length === 0 ? "Aucun article" : `${resultats.length} article${resultats.length > 1 ? "s" : ""}`}
        </p>
        <div className="flex items-center gap-1">
          {filtreActif && (
            <button
              type="button"
              onClick={() => {
                setTaille(null);
                setCouleur(null);
                setRecherche("");
              }}
              className="h-11 px-1 text-sm font-semibold underline"
            >
              Effacer les filtres
            </button>
          )}
          <label className="flex items-center gap-2 text-sm">
            <span className="sr-only">Trier par</span>
            <select
              value={tri}
              onChange={(e) => setTri(e.target.value as typeof tri)}
              className="h-11 rounded-full border border-zinc-300 bg-white px-3 text-sm font-semibold"
            >
              <option value="nouveautes">Nouveautés</option>
              <option value="prix-croissant">Prix croissant</option>
              <option value="prix-decroissant">Prix décroissant</option>
            </select>
          </label>
        </div>
      </div>

      {resultats.length === 0 ? (
        <p className="rounded-2xl bg-fond px-4 py-10 text-center text-sm text-doux">
          Aucun article ne correspond à ces filtres.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
          {resultats.map((p, i) => (
            <CarteProduit key={p.slug} produit={p} priorite={i < 2} />
          ))}
        </div>
      )}
    </div>
  );
}
