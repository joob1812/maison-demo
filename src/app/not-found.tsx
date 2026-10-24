import Link from "next/link";

export default function PageIntrouvable() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-20 text-center">
      <h1 className="font-titre text-3xl font-extrabold">Page introuvable</h1>
      <p className="text-doux">Cet article n&apos;existe plus ou l&apos;adresse est incorrecte.</p>
      <Link
        href="/catalogue"
        className="inline-flex h-12 items-center rounded-full bg-marque px-6 font-semibold text-white hover:bg-marque/90"
      >
        Voir le catalogue
      </Link>
    </div>
  );
}
