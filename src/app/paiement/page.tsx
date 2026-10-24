import type { Metadata } from "next";
import { Paiement } from "@/components/Paiement";

export const metadata: Metadata = { title: "Paiement", robots: { index: false } };

export default function PagePaiement() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 md:py-10">
      <h1 className="font-titre text-3xl font-extrabold">Paiement</h1>
      <Paiement />
    </div>
  );
}
