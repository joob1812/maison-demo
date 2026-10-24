import type { Metadata } from "next";
import { Catalogue } from "@/components/Catalogue";
import { BoutonWhatsAppFlottant } from "@/components/BoutonWhatsAppFlottant";

export const metadata: Metadata = {
  title: "Catalogue",
  description: "Tous nos vêtements : wax, bazin et prêt-à-porter, livrés partout au Sénégal.",
};

export default function PageCatalogue() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 md:py-10">
      <h1 className="font-titre text-3xl font-extrabold">Catalogue</h1>
      <Catalogue categorie={null} />
      <BoutonWhatsAppFlottant />
    </div>
  );
}
