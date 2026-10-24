"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { boutique } from "@/config/boutique";
import {
  COULEURS,
  photoDetouree,
  produits,
  stockDisponible,
  type CouleurId,
  type Produit,
  type Taille,
} from "@/data/produits";
import { formatFCFA } from "@/lib/format";
import { ajouterAuPanier, messageProduit, nombreArticles, usePanier } from "@/lib/panier";
import { lienWhatsApp } from "@/lib/whatsapp";
import { BoutonCommanderWhatsApp } from "./BoutonCommanderWhatsApp";
import { IconeFermer, IconeRetourner } from "./Icones";
import { Vetement } from "./Vetement";

/** Les vêtements suspendus au portant (dans l'ordre du catalogue). */
const SUR_PORTANT = produits.filter((p) => p.surPortant);

/** Nom partagé par le vêtement du portant et celui de la vue rapprochée pendant l'animation. */
const NOM_TRANSITION = "vetement-actif";
// Même taille de photo sur la tringle et dans la vue rapprochée : l'image est déjà chargée quand l'animation démarre.
const TAILLE_PHOTO = "(min-width: 768px) 320px, 260px";

function animationsAutorisees() {
  return (
    typeof document !== "undefined" &&
    typeof document.startViewTransition === "function" &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Le portant de la page d'accueil : les vêtements suspendus à une tringle.
 * Ordinateur : survol pour avancer un vêtement. Téléphone : défilement au doigt.
 * Un clic ou un toucher ouvre la vue rapprochée, avec une transition du portant vers le premier plan.
 */
export function Portant() {
  const [actif, setActif] = useState<string | null>(null);
  const [vedette, setVedette] = useState(SUR_PORTANT[Math.floor(SUR_PORTANT.length / 2)].slug);
  const dialogue = useRef<HTMLDialogElement>(null);
  const piste = useRef<HTMLDivElement>(null);
  const visuels = useRef(new Map<string, HTMLElement>());

  // Sur téléphone, le vêtement arrêté au centre de la tringle devient la vedette.
  useEffect(() => {
    const racine = piste.current;
    if (!racine) return;
    // Sur un écran étroit, on démarre au milieu de la tringle : des vêtements des deux côtés.
    racine.scrollLeft = (racine.scrollWidth - racine.clientWidth) / 2;
    const observateur = new IntersectionObserver(
      (entrees) => {
        for (const entree of entrees) {
          const slug = (entree.target as HTMLElement).dataset.slug;
          if (entree.isIntersecting && slug) setVedette(slug);
        }
      },
      { root: racine, rootMargin: "0px -45% 0px -45%" },
    );
    racine.querySelectorAll("[data-slug]").forEach((el) => observateur.observe(el));
    return () => observateur.disconnect();
  }, []);

  function ouvrir(slug: string) {
    const visuel = visuels.current.get(slug);
    const appliquer = () => {
      flushSync(() => setActif(slug));
      dialogue.current?.showModal();
    };
    if (!visuel || !animationsAutorisees()) return appliquer();
    visuel.style.viewTransitionName = NOM_TRANSITION;
    document.startViewTransition(() => {
      visuel.style.viewTransitionName = "";
      appliquer();
    });
  }

  function fermer() {
    const visuel = actif ? visuels.current.get(actif) : undefined;
    const appliquer = () => {
      dialogue.current?.close();
      flushSync(() => setActif(null));
    };
    if (!visuel || !animationsAutorisees()) return appliquer();
    const transition = document.startViewTransition(() => {
      appliquer();
      visuel.style.viewTransitionName = NOM_TRANSITION;
    });
    transition.finished.finally(() => {
      visuel.style.viewTransitionName = "";
    });
  }

  const produitVedette = SUR_PORTANT.find((p) => p.slug === vedette) ?? SUR_PORTANT[0];
  const produitActif = SUR_PORTANT.find((p) => p.slug === actif);

  return (
    <div className="flex flex-col gap-3">
      <div ref={piste} className="portant-piste">
        <div className="portant-rang">
          {SUR_PORTANT.map((p) => (
            <button
              key={p.slug}
              type="button"
              data-slug={p.slug}
              data-vedette={vedette === p.slug}
              aria-label={`${p.nom}, ${formatFCFA(p.prix)} : voir de près`}
              onPointerEnter={() => setVedette(p.slug)}
              onFocus={() => setVedette(p.slug)}
              onClick={() => ouvrir(p.slug)}
              className="portant-cintre"
            >
              <span
                ref={(el) => {
                  if (el) visuels.current.set(p.slug, el);
                  else visuels.current.delete(p.slug);
                }}
                className="portant-visuel block"
              >
                <Vetement
                  silhouette={p.illustration.silhouette}
                  motif={p.illustration.motif}
                  couleur={p.couleurs[0]}
                  photo={photoDetouree(p, p.couleurs[0], "recto")}
                  chargement="eager"
                  sizes={TAILLE_PHOTO}
                  className="block h-auto w-full"
                />
              </span>
            </button>
          ))}
        </div>
      </div>

      <p className="text-center text-sm" aria-hidden="true">
        <span className="font-semibold">{produitVedette.nom}</span>
        <span className="text-doux"> · {formatFCFA(produitVedette.prix)}</span>
      </p>
      <p className="text-center text-xs text-attenue">
        <span className="pointer-fine:hidden">Touchez</span>
        <span className="hidden pointer-fine:inline">Cliquez sur</span> un vêtement pour le voir de près
      </p>

      <dialog
        ref={dialogue}
        aria-labelledby="titre-vue-rapprochee"
        className="portant-dialogue"
        onCancel={(e) => {
          e.preventDefault();
          fermer();
        }}
        onClose={() => setActif(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) fermer();
        }}
      >
        {produitActif && <VueRapprochee key={produitActif.slug} produit={produitActif} onFermer={fermer} />}
      </dialog>
    </div>
  );
}

function VueRapprochee({ produit, onFermer }: { produit: Produit; onFermer: () => void }) {
  const [couleur, setCouleur] = useState<CouleurId>(produit.couleurs[0]);
  const [face, setFace] = useState<"recto" | "verso">("recto");
  const [taille, setTaille] = useState<Taille | null>(null);
  const [erreur, setErreur] = useState(false);
  const [ajoute, setAjoute] = useState(false);
  const articles = nombreArticles(usePanier());

  const disponibles = produit.tailles.filter((t) => t.stock > 0).map((t) => t.taille);
  const lien = lienWhatsApp(boutique.whatsapp, messageProduit(produit.slug, couleur, taille));
  // Avec une photo de face mais sans photo de dos, on ne propose pas le dos (le dessin jurerait).
  const photoFace = photoDetouree(produit, couleur, "recto");
  const photoDos = photoDetouree(produit, couleur, "verso");
  const dosDisponible = !photoFace || !!photoDos;

  function ajouter() {
    if (!taille) {
      setErreur(true);
      return;
    }
    ajouterAuPanier({ slug: produit.slug, couleur, taille, quantite: 1 });
    setAjoute(true);
  }

  return (
    <div className="flex min-h-full flex-col">
      <div className="sticky top-0 z-10 flex justify-end p-2">
        <button
          type="button"
          autoFocus
          onClick={onFermer}
          aria-label="Fermer et revenir au portant"
          className="flex size-11 items-center justify-center rounded-full bg-white/80 shadow-sm hover:bg-white"
        >
          <IconeFermer className="size-5" />
        </button>
      </div>

      <div className="grid flex-1 gap-6 px-5 pb-8 md:grid-cols-[1.1fr_1fr] md:items-center md:gap-10 md:px-10 md:pb-10">
        <div className="relative mx-auto w-full max-w-[260px] pt-2 md:max-w-[320px]">
          <div aria-hidden="true" className="portant-barre absolute inset-x-[-30%] top-2" />
          <div className="vue-rapprochee-scene" style={{ viewTransitionName: NOM_TRANSITION }}>
            <div className="vue-rapprochee-retourne" data-face={face}>
              <div className="vue-rapprochee-face">
                <Vetement
                  silhouette={produit.illustration.silhouette}
                  motif={produit.illustration.motif}
                  couleur={couleur}
                  face="recto"
                  photo={photoFace}
                  chargement="eager"
                  sizes={TAILLE_PHOTO}
                  titre={`${produit.nom}, ${COULEURS[couleur].nom}, vu de face`}
                  className="block h-auto w-full"
                />
              </div>
              <div className="vue-rapprochee-face vue-rapprochee-dos">
                <Vetement
                  silhouette={produit.illustration.silhouette}
                  motif={produit.illustration.motif}
                  couleur={couleur}
                  face="verso"
                  photo={photoDos}
                  sizes={TAILLE_PHOTO}
                  titre={`${produit.nom}, ${COULEURS[couleur].nom}, vu de dos`}
                  className="block h-auto w-full"
                />
              </div>
            </div>
          </div>

          <div aria-hidden="true" className="etiquette">
            <p className="text-[9px] font-bold tracking-[0.18em] uppercase">{boutique.nom}</p>
            <p className="mt-1 text-[11px] leading-tight font-medium">{produit.nom}</p>
            <p className="mt-1.5 font-titre text-sm font-extrabold">{formatFCFA(produit.prix)}</p>
            <p className="mt-1 text-[10px] text-doux">{disponibles.join(" · ") || "Épuisé"}</p>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <h2 id="titre-vue-rapprochee" className="font-titre text-2xl leading-tight font-bold md:text-3xl">
              {produit.nom}
            </h2>
            <p className="text-xl font-bold">{formatFCFA(produit.prix)}</p>
          </div>

          {dosDisponible && (
            <button
              type="button"
              onClick={() => setFace(face === "recto" ? "verso" : "recto")}
              aria-pressed={face === "verso"}
              className="inline-flex h-11 items-center gap-2 self-start rounded-full border border-zinc-300 bg-white px-4 text-sm font-semibold hover:border-encre"
            >
              <IconeRetourner className="size-4.5" />
              {face === "recto" ? "Voir le dos" : "Voir le devant"}
            </button>
          )}

          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-sm font-semibold">
              Couleur : <span className="font-normal text-doux">{COULEURS[couleur].nom}</span>
            </legend>
            <div className="flex gap-2">
              {produit.couleurs.map((id) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={couleur === id}
                  aria-label={COULEURS[id].nom}
                  onClick={() => setCouleur(id)}
                  className={`flex size-11 items-center justify-center rounded-full border-2 ${
                    couleur === id ? "border-marque" : "border-zinc-200 hover:border-zinc-400"
                  }`}
                >
                  <span className="size-8 rounded-full border border-zinc-300" style={{ backgroundColor: COULEURS[id].hex }} />
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-2" aria-describedby="aide-taille-portant">
            <legend className="mb-2 text-sm font-semibold">Taille</legend>
            <div className="flex flex-wrap gap-2">
              {produit.tailles.map(({ taille: t }) => {
                const epuise = stockDisponible(produit, t) === 0;
                return (
                  <button
                    key={t}
                    type="button"
                    disabled={epuise}
                    aria-pressed={taille === t}
                    aria-label={epuise ? `${t}, épuisé` : `Taille ${t}`}
                    onClick={() => {
                      setTaille(t);
                      setErreur(false);
                      setAjoute(false);
                    }}
                    className={`h-11 min-w-12 rounded-xl border-[1.5px] px-3 font-semibold ${
                      epuise
                        ? "cursor-not-allowed border-zinc-200 text-zinc-400 line-through"
                        : taille === t
                          ? "border-marque bg-marque text-white"
                          : "border-zinc-300 bg-white hover:border-encre"
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
            <p id="aide-taille-portant" className={`text-sm ${erreur ? "font-semibold text-erreur" : "text-attenue"}`}>
              {erreur ? "Choisissez une taille pour ajouter l'article au panier." : "Choisissez votre taille."}
            </p>
          </fieldset>

          <div className="flex flex-col gap-3">
            {ajoute ? (
              <Link
                href="/panier"
                className="flex h-13 items-center justify-center rounded-full bg-marque px-5 font-semibold text-white hover:bg-marque/90"
              >
                Ajouté · Voir le panier ({articles})
              </Link>
            ) : (
              <button
                type="button"
                onClick={ajouter}
                className="h-13 rounded-full bg-marque px-5 font-semibold text-white hover:bg-marque/90"
              >
                Ajouter au panier
              </button>
            )}
            <BoutonCommanderWhatsApp lien={lien} libelle="Commander sur WhatsApp" />
            <Link
              href={`/produit/${produit.slug}`}
              className="inline-flex h-11 items-center justify-center text-sm font-semibold underline"
            >
              Voir la fiche complète
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
