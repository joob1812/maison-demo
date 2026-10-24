"use client";

import { useState } from "react";
import { IconeFermer, IconeRegle } from "./Icones";
import { Panneau } from "./Panneau";
import { TableauTailles } from "./TableauTailles";

/** Bouton « Guide des tailles » qui ouvre les tableaux dans un panneau. */
export function GuideTailles({ chaussures }: { chaussures: boolean }) {
  const [ouvert, setOuvert] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOuvert(true)}
        className="inline-flex h-11 items-center gap-2 self-start text-sm font-semibold underline"
      >
        <IconeRegle className="size-5" />
        Guide des tailles
      </button>
      <Panneau ouvert={ouvert} onFermer={() => setOuvert(false)} cote="centre" titre="Guide des tailles">
        <div className="flex flex-col gap-4 p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-titre text-xl font-bold">Guide des tailles</h2>
            <button
              type="button"
              autoFocus
              onClick={() => setOuvert(false)}
              aria-label="Fermer le guide"
              className="flex size-11 items-center justify-center rounded-full hover:bg-fond"
            >
              <IconeFermer className="size-5" />
            </button>
          </div>
          <TableauTailles chaussures={chaussures} vetements={!chaussures} />
        </div>
      </Panneau>
    </>
  );
}
