import { CONSEILS_MESURE, GUIDE_CHAUSSURES, GUIDE_VETEMENTS } from "@/data/tailles";

type Guide = { colonnes: string[]; lignes: string[][] };

function Tableau({ guide, legende }: { guide: Guide; legende: string }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-ligne">
      <table className="w-full text-left text-sm">
        <caption className="px-4 pt-3 text-left font-semibold">{legende}</caption>
        <thead>
          <tr className="border-b border-ligne">
            {guide.colonnes.map((c) => (
              <th key={c} scope="col" className="px-4 py-3 font-semibold whitespace-nowrap text-doux">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {guide.lignes.map((l) => (
            <tr key={l[0]} className="border-b border-ligne last:border-0">
              {l.map((v, i) =>
                i === 0 ? (
                  <th key={i} scope="row" className="px-4 py-3 font-bold">
                    {v}
                  </th>
                ) : (
                  <td key={i} className="px-4 py-3 whitespace-nowrap">
                    {v}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Tableaux des tailles et conseils de mesure (fiche produit et page dédiée). */
export function TableauTailles({ chaussures = true, vetements = true }: { chaussures?: boolean; vetements?: boolean }) {
  return (
    <div className="flex flex-col gap-5">
      {vetements && <Tableau guide={GUIDE_VETEMENTS} legende="Vêtements (mesures du corps, en cm)" />}
      {chaussures && <Tableau guide={GUIDE_CHAUSSURES} legende="Chaussures" />}
      <ul className="flex list-disc flex-col gap-1.5 pl-5 text-sm text-doux">
        {CONSEILS_MESURE.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
    </div>
  );
}
