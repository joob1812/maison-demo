"use client";

import Link from "next/link";
import { useFavoris } from "@/lib/preferences";
import { IconeCoeur } from "./Icones";

export function LienFavoris() {
  const n = useFavoris().length;
  return (
    <Link
      href="/favoris"
      aria-label={n ? `Favoris, ${n} article${n > 1 ? "s" : ""}` : "Favoris"}
      className="relative inline-flex size-11 items-center justify-center rounded-full hover:bg-fond"
    >
      <IconeCoeur className="size-6" />
      {n > 0 && (
        <span className="absolute top-1 right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-encre px-1 text-[11px] font-bold text-white">
          {n}
        </span>
      )}
    </Link>
  );
}
