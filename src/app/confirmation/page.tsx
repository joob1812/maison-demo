import type { Metadata } from "next";
import { Confirmation } from "@/components/Confirmation";

export const metadata: Metadata = { title: "Commande confirmée", robots: { index: false } };

export default function PageConfirmation() {
  return (
    <div className="px-4 py-8 md:py-12">
      <Confirmation />
    </div>
  );
}
