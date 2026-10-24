import type { Metadata } from "next";
import Link from "next/link";
import { Bloc, PageTexte } from "@/components/PageTexte";
import { boutique } from "@/config/boutique";
import { formatFCFA } from "@/lib/format";

export const metadata: Metadata = {
  title: "Livraison et retours",
  description: `Délais, frais de livraison et échanges chez ${boutique.nom}. Livraison offerte à Dakar dès ${formatFCFA(boutique.livraisonOfferte.seuil)}.`,
};

export default function LivraisonRetours() {
  const { seuil } = boutique.livraisonOfferte;
  return (
    <PageTexte
      surtitre="Aide"
      titre="Livraison et retours"
      intro={`Livraison partout au Sénégal, offerte à Dakar dès ${formatFCFA(seuil)} d'achat. Échange ou retour sous ${boutique.retoursJours} jours.`}
    >
      <Bloc titre="Délais et frais">
        <div className="overflow-x-auto rounded-2xl border border-ligne">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ligne text-doux">
                <th scope="col" className="px-4 py-3 font-semibold">Mode</th>
                <th scope="col" className="px-4 py-3 font-semibold">Délai</th>
                <th scope="col" className="px-4 py-3 font-semibold">Frais</th>
              </tr>
            </thead>
            <tbody className="text-encre">
              {boutique.zonesLivraison.map((z) => (
                <tr key={z.id} className="border-b border-ligne last:border-0">
                  <th scope="row" className="px-4 py-3 font-semibold">{z.nom}</th>
                  <td className="px-4 py-3 whitespace-nowrap">{z.delai}</td>
                  <td className="px-4 py-3">
                    {z.frais === 0 ? "Gratuit" : formatFCFA(z.frais)}
                    {boutique.livraisonOfferte.zones.includes(z.id) && (
                      <span className="block text-xs text-doux">Offerte dès {formatFCFA(seuil)}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Le livreur vous appelle avant de passer. Vous pouvez payer à la réception, en espèces ou par mobile
          money, ou à la commande avec Wave ou Orange Money.
        </p>
      </Bloc>

      <Bloc titre="Échanges et retours">
        <p>
          Une taille qui ne va pas, une couleur qui ne vous plaît pas ? Vous avez {boutique.retoursJours} jours après
          la réception pour échanger ou retourner un article.
        </p>
        <ol className="flex list-decimal flex-col gap-2 pl-5">
          <li>Écrivez-nous sur WhatsApp avec votre numéro de commande.</li>
          <li>Rapportez l&apos;article en boutique, ou remettez-le au livreur lors de l&apos;échange.</li>
          <li>Nous vous donnons la nouvelle taille, un autre article, ou un remboursement par Wave ou Orange Money.</li>
        </ol>
        <p>
          L&apos;article doit être propre, non porté et non lavé. Les pièces retouchées ou faites sur mesure à votre
          demande ne sont ni reprises ni échangées.
        </p>
      </Bloc>

      <Bloc titre="Une retouche ?">
        <p>
          Nos couturiers peuvent ajuster la longueur ou la taille avant la livraison. Indiquez-le dans la case
          « Une précision pour la boutique ? » au moment de commander, ou consultez le{" "}
          <Link href="/guide-des-tailles" className="font-semibold text-encre underline">
            guide des tailles
          </Link>
          .
        </p>
      </Bloc>
    </PageTexte>
  );
}
