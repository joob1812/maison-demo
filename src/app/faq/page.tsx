import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { PageTexte } from "@/components/PageTexte";
import { boutique } from "@/config/boutique";
import { formatFCFA } from "@/lib/format";

export const metadata: Metadata = {
  title: "Questions fréquentes",
  description: `Commande, paiement, livraison, tailles, entretien : les réponses aux questions fréquentes sur ${boutique.nom}.`,
};

const lien = "font-semibold text-encre underline";

const QUESTIONS: { q: string; r: ReactNode; texte: string }[] = [
  {
    q: "Comment passer commande ?",
    texte:
      "Choisissez votre article, sa couleur et sa taille, puis ajoutez-le au panier. Vous payez sur le site, ou vous envoyez la commande sur WhatsApp et la boutique vous confirme la disponibilité.",
    r: (
      <p>
        Choisissez votre article, sa couleur et sa taille, puis ajoutez-le au panier. Vous payez sur le site, ou vous
        envoyez la commande sur WhatsApp et la boutique vous confirme la disponibilité.
      </p>
    ),
  },
  {
    q: "Quels sont les moyens de paiement ?",
    texte: "Wave, Orange Money, ou à la livraison en espèces ou par mobile money.",
    r: <p>Wave, Orange Money, ou à la livraison en espèces ou par mobile money. La boutique ne voit jamais votre code secret.</p>,
  },
  {
    q: "Combien coûte la livraison ?",
    texte: boutique.zonesLivraison
      .map((z) => `${z.nom} : ${z.frais ? formatFCFA(z.frais) : "gratuit"}, ${z.delai.toLowerCase()}.`)
      .join(" "),
    r: (
      <>
        <ul className="flex list-disc flex-col gap-1 pl-5">
          {boutique.zonesLivraison.map((z) => (
            <li key={z.id}>
              {z.nom} : {z.frais ? formatFCFA(z.frais) : "gratuit"}, {z.delai.toLowerCase()}.
            </li>
          ))}
        </ul>
        <p>La livraison à Dakar est offerte dès {formatFCFA(boutique.livraisonOfferte.seuil)} d&apos;achat.</p>
      </>
    ),
  },
  {
    q: "Comment choisir ma taille ?",
    texte: "Consultez le guide des tailles. Entre deux tailles, prenez la plus grande ou écrivez-nous sur WhatsApp.",
    r: (
      <p>
        Consultez le{" "}
        <Link href="/guide-des-tailles" className={lien}>
          guide des tailles
        </Link>
        . Entre deux tailles, prenez la plus grande ou écrivez-nous sur WhatsApp : nous vous conseillons.
      </p>
    ),
  },
  {
    q: "Puis-je échanger ou retourner un article ?",
    texte: `Oui, sous ${boutique.retoursJours} jours après la réception, si l'article n'a pas été porté ni lavé.`,
    r: (
      <p>
        Oui, sous {boutique.retoursJours} jours après la réception, si l&apos;article n&apos;a pas été porté ni lavé.
        Voir{" "}
        <Link href="/livraison-retours" className={lien}>
          livraison et retours
        </Link>
        .
      </p>
    ),
  },
  {
    q: "Faites-vous des retouches ou du sur-mesure ?",
    texte:
      "Oui. Nos couturiers ajustent la longueur ou la taille avant la livraison. Pour une pièce sur mesure, écrivez-nous sur WhatsApp avec le modèle et vos mesures.",
    r: (
      <p>
        Oui. Nos couturiers ajustent la longueur ou la taille avant la livraison. Pour une pièce sur mesure,
        écrivez-nous sur WhatsApp avec le modèle et vos mesures.
      </p>
    ),
  },
  {
    q: "Comment entretenir le wax et le bazin ?",
    texte:
      "Lavez à 30 °C maximum, sur l'envers, sans eau de Javel. Séchez à l'ombre pour garder l'éclat des couleurs, puis repassez sur l'envers. Le bazin brodé se lave de préférence à la main.",
    r: (
      <p>
        Lavez à 30 °C maximum, sur l&apos;envers, sans eau de Javel. Séchez à l&apos;ombre pour garder
        l&apos;éclat des couleurs, puis repassez sur l&apos;envers. Le bazin brodé se lave de préférence à la main.
      </p>
    ),
  },
  {
    q: "Puis-je essayer les articles en boutique ?",
    texte: `Bien sûr : nous sommes à ${boutique.adresse}. ${boutique.horaires.map((h) => `${h.jours} : ${h.heures}`).join(", ")}.`,
    r: (
      <p>
        Bien sûr : nous sommes à {boutique.adresse}.{" "}
        <Link href="/contact" className={lien}>
          Horaires et itinéraire
        </Link>
        .
      </p>
    ),
  },
  {
    q: "Que faites-vous de mes informations ?",
    texte:
      "Votre nom, votre numéro et votre adresse servent uniquement à préparer et livrer votre commande. Vos favoris et votre panier restent sur votre téléphone.",
    r: (
      <p>
        Votre nom, votre numéro et votre adresse servent uniquement à préparer et livrer votre commande. Vos favoris et
        votre panier restent sur votre téléphone.
      </p>
    ),
  },
];

export default function Faq() {
  // Données structurées : Google peut afficher les réponses directement dans les résultats.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: QUESTIONS.map(({ q, texte }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: texte },
    })),
  };

  return (
    <PageTexte surtitre="Aide" titre="Questions fréquentes" intro="Vous ne trouvez pas votre réponse ? Écrivez-nous sur WhatsApp.">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="flex flex-col border-t border-ligne">
        {QUESTIONS.map(({ q, r }) => (
          <details key={q} className="group border-b border-ligne">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 text-lg font-semibold [&::-webkit-details-marker]:hidden">
              {q}
              <span
                aria-hidden="true"
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-fond text-xl leading-none transition-transform group-open:rotate-45 motion-reduce:transition-none"
              >
                +
              </span>
            </summary>
            <div className="flex flex-col gap-2 pb-5 leading-relaxed text-doux">{r}</div>
          </details>
        ))}
      </div>
    </PageTexte>
  );
}
