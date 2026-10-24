import type { ReactNode } from "react";

/** Gabarit des pages d'information : titre, introduction, contenu lisible. */
export function PageTexte({ surtitre, titre, intro, children }: { surtitre?: string; titre: string; intro?: string; children: ReactNode }) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-10 md:py-14">
      <header className="flex flex-col gap-3">
        {surtitre && <p className="text-xs font-semibold tracking-[0.16em] text-doux uppercase">{surtitre}</p>}
        <h1 className="font-titre text-4xl leading-tight font-extrabold">{titre}</h1>
        {intro && <p className="text-lg leading-relaxed text-doux">{intro}</p>}
      </header>
      <div className="contenu-texte flex flex-col gap-8">{children}</div>
    </div>
  );
}

export function Bloc({ titre, children }: { titre: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-titre text-2xl font-bold">{titre}</h2>
      <div className="flex flex-col gap-3 leading-relaxed text-doux">{children}</div>
    </section>
  );
}

/** Information que le commerçant doit fournir (NINEA, RCCM, hébergeur…). Jamais inventée. */
export function ACompleter({ quoi }: { quoi: string }) {
  return <mark className="rounded bg-alerte-fond px-1 text-alerte">[{quoi} à compléter]</mark>;
}

export function AvisModele() {
  return (
    <p className="rounded-xl bg-alerte-fond px-4 py-3 text-sm font-medium text-alerte">
      Modèle à adapter : le commerçant complète les passages surlignés et fait relire le texte avant la mise en ligne.
    </p>
  );
}
