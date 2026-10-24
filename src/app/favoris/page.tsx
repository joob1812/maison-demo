import type { Metadata } from "next";
import { ListeFavoris } from "@/components/ListeFavoris";
import { VusRecemment } from "@/components/VusRecemment";

export const metadata: Metadata = { title: "Mes favoris", robots: { index: false } };

export default function PageFavoris() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-8 md:py-12">
      <div className="flex flex-col gap-6">
        <h1 className="font-titre text-3xl font-extrabold md:text-4xl">Mes favoris</h1>
        <ListeFavoris />
      </div>
      <VusRecemment />
    </div>
  );
}
