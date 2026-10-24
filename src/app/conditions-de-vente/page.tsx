import type { Metadata } from "next";
import Link from "next/link";
import { ACompleter, AvisModele, Bloc, PageTexte } from "@/components/PageTexte";
import { boutique } from "@/config/boutique";
import { formatFCFA } from "@/lib/format";

export const metadata: Metadata = {
  title: "Conditions de vente",
  description: `Conditions générales de vente de ${boutique.nom}.`,
};

export default function ConditionsDeVente() {
  return (
    <PageTexte surtitre="Informations légales" titre="Conditions générales de vente">
      <AvisModele />
      <Bloc titre="1. Le vendeur">
        <p>
          Les ventes sont conclues avec {boutique.nom}, <ACompleter quoi="forme juridique" />, {boutique.adresse}, NINEA{" "}
          <ACompleter quoi="NINEA" />, RCCM <ACompleter quoi="RCCM" />.
        </p>
      </Bloc>
      <Bloc titre="2. Les articles et les prix">
        <p>
          Les articles sont décrits et photographiés avec le plus grand soin. De légères différences de teinte peuvent
          exister selon l&apos;écran et le tissu. Les prix sont indiqués en francs CFA (FCFA). Les frais de livraison
          sont affichés avant la validation de la commande.
        </p>
      </Bloc>
      <Bloc titre="3. La commande">
        <p>
          La commande est passée sur le site ou envoyée sur WhatsApp. Elle est confirmée par la boutique, qui vérifie la
          disponibilité de l&apos;article dans la couleur et la taille choisies. Un article indisponible est remboursé
          ou remplacé, selon votre choix.
        </p>
      </Bloc>
      <Bloc titre="4. Le paiement">
        <p>
          Le paiement se fait par Wave, par Orange Money, ou à la livraison en espèces ou par mobile money. La boutique
          n&apos;a jamais accès à votre code secret.
        </p>
      </Bloc>
      <Bloc titre="5. La livraison">
        <ul className="flex list-disc flex-col gap-1 pl-5">
          {boutique.zonesLivraison.map((z) => (
            <li key={z.id}>
              {z.nom} : {z.delai.toLowerCase()}, {z.frais ? formatFCFA(z.frais) : "gratuit"}.
            </li>
          ))}
        </ul>
        <p>
          La livraison à Dakar est offerte dès {formatFCFA(boutique.livraisonOfferte.seuil)} d&apos;achat. Les délais
          sont indicatifs ; en cas de retard, la boutique vous prévient.
        </p>
      </Bloc>
      <Bloc titre="6. Échanges et retours">
        <p>
          Vous disposez de {boutique.retoursJours} jours après la réception pour échanger ou retourner un article
          propre, non porté et non lavé. Les pièces retouchées ou faites sur mesure à votre demande ne sont ni reprises
          ni échangées. Le remboursement se fait par le moyen de paiement utilisé, ou par Wave ou Orange Money.{" "}
          <Link href="/livraison-retours" className="font-semibold text-encre underline">
            Comment faire
          </Link>
          .
        </p>
      </Bloc>
      <Bloc titre="7. Réclamations">
        <p>
          Pour toute réclamation, contactez la boutique sur WhatsApp ou en magasin. Nous cherchons toujours une
          solution à l&apos;amiable.
        </p>
      </Bloc>
    </PageTexte>
  );
}
