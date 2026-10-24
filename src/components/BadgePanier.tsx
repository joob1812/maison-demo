"use client";

import Link from "next/link";
import { nombreArticles, usePanier } from "@/lib/panier";
import { IconePanier } from "./Icones";

export function BadgePanier() {
  const n = nombreArticles(usePanier());

  return (
    <Link
      href="/panier"
      aria-label={n ? `Panier, ${n} article${n > 1 ? "s" : ""}` : "Panier vide"}
      className="relative inline-flex size-11 items-center justify-center rounded-full hover:bg-fond"
    >
      <IconePanier />
      {n > 0 && (
        <span className="absolute top-1 right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-marque px-1 text-[11px] font-bold text-white">
          {n}
        </span>
      )}
    </Link>
  );
}
