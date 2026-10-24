import { boutique } from "@/config/boutique";

/** Bandeau aux couleurs de la marque qui défile en continu (immobile si l'utilisateur limite les animations). */
export function BandeauDefilant() {
  // Messages répétés pour que chaque moitié dépasse la largeur d'un grand écran.
  const messages = [...boutique.bandeau, ...boutique.bandeau];

  return (
    <div className="overflow-hidden bg-marque py-3 text-white">
      <p className="sr-only">{boutique.bandeau.join(". ")}</p>
      <div className="bandeau-piste flex w-max" aria-hidden="true">
        {[0, 1].map((copie) => (
          <div key={copie} className="flex shrink-0 items-center">
            {messages.map((texte, i) => (
              <span
                key={i}
                className="flex items-center gap-6 pr-6 text-xs font-semibold tracking-[0.14em] whitespace-nowrap uppercase"
              >
                {texte}
                <span className="text-white/60">•</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
