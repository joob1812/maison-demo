import type { Metadata } from "next";
import { Panier } from "@/components/Panier";

export const metadata: Metadata = { title: "Mon panier", robots: { index: false } };

export default function PagePanier() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 md:py-10">
      <h1 className="font-titre text-3xl font-extrabold">Mon panier</h1>
      <Panier />
    </div>
  );
}
