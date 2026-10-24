import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CarteProduit } from "@/components/CarteProduit";
import { FicheProduit } from "@/components/FicheProduit";
import { IconeRetour } from "@/components/Icones";
import { VusRecemment } from "@/components/VusRecemment";
import { CATEGORIES, photoDetouree, produits, produitsAssocies, trouverProduit } from "@/data/produits";

type Params = PageProps<"/produit/[slug]">["params"];

export async function generateStaticParams() {
  return produits.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/produit/[slug]">): Promise<Metadata> {
  const produit = trouverProduit((await params).slug);
  if (!produit) return {};
  // Image d'aperçu quand le lien est partagé sur WhatsApp ou les réseaux.
  const image = photoDetouree(produit, produit.couleurs[0], "recto") ?? produit.images[0];
  return {
    title: produit.nom,
    description: produit.description,
    openGraph: { title: produit.nom, description: produit.description, images: image ? [image] : undefined },
  };
}

// L'URL est lue sous <Suspense> : la navigation affiche tout de suite le squelette,
// puis la fiche (règle « instant navigation » de Next.js 16 avec Cache Components).
export default function PageProduit({ params }: PageProps<"/produit/[slug]">) {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-4 md:py-8">
      <Suspense fallback={<SqueletteProduit />}>
        <ContenuProduit params={params} />
      </Suspense>
    </div>
  );
}

async function ContenuProduit({ params }: { params: Params }) {
  const produit = trouverProduit((await params).slug);
  if (!produit) notFound();

  const categorie = CATEGORIES.find((c) => c.id === produit.categorie)!;
  const associes = produitsAssocies(produit);
  const similaires = produits
    .filter((p) => p.categorie === produit.categorie && p.slug !== produit.slug && !produit.associes.includes(p.slug))
    .slice(0, 4);

  // Données structurées pour Google (prix en XOF, disponibilité).
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: produit.nom,
    description: produit.description,
    offers: {
      "@type": "Offer",
      price: produit.prix,
      priceCurrency: "XOF",
      availability: produit.tailles.some((t) => t.stock > 0)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <div className="flex flex-col gap-4">
        <Link
          href={`/catalogue/${categorie.id}`}
          className="-ml-2 inline-flex h-11 items-center gap-1 self-start rounded-full pr-3 pl-1 text-sm font-semibold hover:bg-fond"
        >
          <IconeRetour className="size-5" />
          {categorie.nom}
        </Link>
        <FicheProduit slug={produit.slug} />
      </div>

      {associes.length > 0 && (
        <section className="flex flex-col gap-5" aria-labelledby="titre-look">
          <h2 id="titre-look" className="font-titre text-2xl font-bold">
            Complétez le look
          </h2>
          <div className="rangee">
            {associes.map((p) => (
              <CarteProduit key={p.slug} produit={p} />
            ))}
          </div>
        </section>
      )}

      {similaires.length > 0 && (
        <section className="flex flex-col gap-5" aria-labelledby="titre-similaires">
          <h2 id="titre-similaires" className="font-titre text-2xl font-bold">
            Vous aimerez aussi
          </h2>
          <div className="rangee">
            {similaires.map((p) => (
              <CarteProduit key={p.slug} produit={p} />
            ))}
          </div>
        </section>
      )}

      <VusRecemment sauf={produit.slug} />
    </>
  );
}

function SqueletteProduit() {
  return (
    <div className="flex flex-col gap-4" aria-hidden="true">
      <div className="h-11 w-28 animate-pulse rounded-full bg-fond" />
      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        <div className="aspect-[4/5] w-full animate-pulse rounded-2xl bg-fond" />
        <div className="flex flex-col gap-4">
          <div className="h-8 w-3/4 animate-pulse rounded-lg bg-fond" />
          <div className="h-7 w-1/3 animate-pulse rounded-lg bg-fond" />
          <div className="mt-4 h-12 w-40 animate-pulse rounded-full bg-fond" />
          <div className="h-12 w-56 animate-pulse rounded-xl bg-fond" />
          <div className="mt-4 h-13 w-full animate-pulse rounded-full bg-fond" />
        </div>
      </div>
    </div>
  );
}
