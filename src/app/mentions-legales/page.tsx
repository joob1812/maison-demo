import type { Metadata } from "next";
import { ACompleter, AvisModele, Bloc, PageTexte } from "@/components/PageTexte";
import { boutique } from "@/config/boutique";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: `Mentions légales et données personnelles de ${boutique.nom}.`,
};

export default function MentionsLegales() {
  return (
    <PageTexte surtitre="Informations légales" titre="Mentions légales">
      <AvisModele />
      <Bloc titre="Éditeur du site">
        <p>
          {boutique.nom}, <ACompleter quoi="forme juridique" />
          <br />
          {boutique.adresse}
          <br />
          NINEA : <ACompleter quoi="NINEA" /> · RCCM : <ACompleter quoi="RCCM" />
          <br />
          Responsable de la publication : <ACompleter quoi="nom du responsable" />
        </p>
      </Bloc>
      <Bloc titre="Hébergement">
        <p>
          <ACompleter quoi="nom et adresse de l'hébergeur" />
        </p>
      </Bloc>
      <Bloc titre="Réalisation">
        <p>{boutique.realisePar ? `Site réalisé par ${boutique.realisePar}.` : <ACompleter quoi="agence" />}</p>
      </Bloc>
      <Bloc titre="Données personnelles">
        <p>
          Les informations demandées à la commande (nom, téléphone, adresse) servent uniquement à préparer, livrer et
          suivre votre commande. Elles ne sont ni vendues ni cédées.
        </p>
        <p>
          Votre panier, vos favoris et vos coordonnées pré-remplies sont enregistrés sur votre téléphone, dans le
          navigateur, et non sur un serveur. Vous pouvez les effacer à tout moment en vidant les données du site.
        </p>
        <p>
          Conformément à la loi sénégalaise n° 2008-12 sur la protection des données à caractère personnel, vous pouvez
          demander l&apos;accès, la rectification ou la suppression de vos données en contactant la boutique.
        </p>
      </Bloc>
      {boutique.demonstration && (
        <Bloc titre="Boutique de démonstration">
          <p>
            Ce site est une démonstration : aucun paiement n&apos;est encaissé et les photos des articles et des
            ambiances sont générées par intelligence artificielle.
          </p>
        </Bloc>
      )}
    </PageTexte>
  );
}
