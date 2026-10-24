import type { Metadata } from "next";
import Link from "next/link";
import { Bloc, PageTexte } from "@/components/PageTexte";
import { TableauTailles } from "@/components/TableauTailles";
import { boutique } from "@/config/boutique";

export const metadata: Metadata = {
  title: "Guide des tailles",
  description: `Trouvez votre taille et votre pointure chez ${boutique.nom} : mesures en centimètres et conseils.`,
};

export default function GuideDesTailles() {
  return (
    <PageTexte
      surtitre="Aide"
      titre="Guide des tailles"
      intro="Munissez-vous d'un mètre de couturière : quelques mesures suffisent pour choisir la bonne taille."
    >
      <TableauTailles />
      <Bloc titre="Toujours un doute ?">
        <p>
          Envoyez-nous vos mesures sur WhatsApp : nous vous conseillons la taille, et nos couturiers peuvent ajuster la
          pièce avant la livraison. En cas d&apos;erreur, l&apos;échange est possible sous {boutique.retoursJours} jours (
          <Link href="/livraison-retours" className="font-semibold text-encre underline">
            conditions
          </Link>
          ).
        </p>
      </Bloc>
    </PageTexte>
  );
}
