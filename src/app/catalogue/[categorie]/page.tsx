import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Catalogue } from "@/components/Catalogue";
import { BoutonWhatsAppFlottant } from "@/components/BoutonWhatsAppFlottant";
import { CATEGORIES } from "@/data/produits";

type Params = PageProps<"/catalogue/[categorie]">["params"];

export async function generateStaticParams() {
  return CATEGORIES.map((c) => ({ categorie: c.id }));
}

function trouverCategorie(id: string) {
  return CATEGORIES.find((c) => c.id === id);
}

export async function generateMetadata({ params }: PageProps<"/catalogue/[categorie]">): Promise<Metadata> {
  const categorie = trouverCategorie((await params).categorie);
  return categorie ? { title: `${categorie.nom} · Catalogue` } : {};
}

// L'URL est lue sous <Suspense> pour que la navigation reste instantanée (Next.js 16, Cache Components).
export default function PageCategorie({ params }: PageProps<"/catalogue/[categorie]">) {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 md:py-10">
      <Suspense fallback={<SqueletteCategorie />}>
        <ContenuCategorie params={params} />
      </Suspense>
      <BoutonWhatsAppFlottant />
    </div>
  );
}

async function ContenuCategorie({ params }: { params: Params }) {
  const categorie = trouverCategorie((await params).categorie);
  if (!categorie) notFound();

  return (
    <>
      <h1 className="font-titre text-3xl font-extrabold">{categorie.nom}</h1>
      <Catalogue categorie={categorie.id} />
    </>
  );
}

function SqueletteCategorie() {
  return (
    <div className="flex flex-col gap-6" aria-hidden="true">
      <div className="h-9 w-40 animate-pulse rounded-lg bg-fond" />
      <div className="flex gap-2">
        <div className="h-11 w-20 animate-pulse rounded-full bg-fond" />
        <div className="h-11 w-24 animate-pulse rounded-full bg-fond" />
        <div className="h-11 w-24 animate-pulse rounded-full bg-fond" />
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="aspect-[4/5] animate-pulse rounded-2xl bg-fond" />
        ))}
      </div>
    </div>
  );
}
