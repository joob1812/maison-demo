"use client";

import { useRef, useState, type ReactNode } from "react";
import { IconeFleche, IconeRetour } from "./Icones";

/** Galerie qui défile au doigt (une vue à la fois), avec points et flèches sur ordinateur. */
export function Galerie({ vues, libelles }: { vues: ReactNode[]; libelles: string[] }) {
  const piste = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  function aller(i: number) {
    const el = piste.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  }

  return (
    <div className="relative" role="region" aria-roledescription="galerie" aria-label="Photos du produit">
      <div
        ref={piste}
        className="galerie rounded-2xl"
        onScroll={(e) => {
          const el = e.currentTarget;
          setIndex(Math.round(el.scrollLeft / el.clientWidth));
        }}
      >
        {vues.map((vue, i) => (
          <div key={i} role="group" aria-roledescription="vue" aria-label={`${i + 1} sur ${vues.length} : ${libelles[i]}`}>
            {vue}
          </div>
        ))}
      </div>
      {vues.length > 1 && (
        <>
          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5" aria-hidden="true">
            {vues.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${i === index ? "w-5 bg-encre" : "w-1.5 bg-encre/30"}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => aller(Math.max(0, index - 1))}
            disabled={index === 0}
            aria-label="Vue précédente"
            className="absolute top-1/2 left-3 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-sm disabled:opacity-0 md:flex"
          >
            <IconeRetour className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => aller(Math.min(vues.length - 1, index + 1))}
            disabled={index === vues.length - 1}
            aria-label="Vue suivante"
            className="absolute top-1/2 right-3 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-sm disabled:opacity-0 md:flex"
          >
            <IconeFleche className="size-5" />
          </button>
        </>
      )}
    </div>
  );
}
