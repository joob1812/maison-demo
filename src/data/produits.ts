import photosGenerees from "./photos-detourees.json";
import { photosPortees } from "./ambiances";

/**
 * Catalogue de la boutique.
 * Pour un client : remplacez ces produits par les siens et déposez ses photos
 * dans public/produits/ (puis indiquez-les dans `images`, ex. "/produits/robe-1.jpg").
 */

export type CouleurId = "indigo" | "ocre" | "noir" | "blanc";
export type Taille = "S" | "M" | "L" | "XL" | "38" | "39" | "40" | "41" | "42" | "43" | "44" | "Unique";
export type Categorie = "femme" | "homme" | "accessoires";

export type Couleur = {
  id: CouleurId;
  nom: string;
  /** Couleur de la pastille. */
  hex: string;
  /** Fond clair utilisé tant qu'il n'y a pas de photo. */
  teinte: string;
};

export type PhotosDetourees = Partial<Record<CouleurId, { recto?: string; verso?: string }>>;

/** Forme du vêtement dessiné, utilisé tant qu'il n'y a pas de photo détourée. */
export type Silhouette = "robe" | "boubou" | "ensemble" | "chemise" | "kaftan" | "jupe" | "sac" | "foulard" | "sandales";
/** Tissu du vêtement dessiné. */
export type Motif = "wax" | "bazin" | "bogolan" | "lin" | "uni";

export type Produit = {
  slug: string;
  nom: string;
  categorie: Categorie;
  /** Dessin affiché sur le portant et dans les vignettes tant qu'il n'y a pas de photo. */
  illustration: { silhouette: Silhouette; motif: Motif };
  /**
   * Photos détourées (fond transparent, WebP ou PNG) du vêtement sur son cintre, par couleur,
   * ex. { indigo: { recto: "/produits/robe-indigo-recto.webp", verso: "/produits/robe-indigo-verso.webp" } }.
   * Elles remplacent le dessin. Celles générées par scripts/generer_visuels.py sont ajoutées
   * automatiquement depuis src/data/photos-detourees.json. Voir le README, « Photos du portant ».
   */
  detoure?: PhotosDetourees;
  /** Prix en FCFA (entier). */
  prix: number;
  couleurs: CouleurId[];
  /** Stock par taille. 0 = épuisé. */
  tailles: { taille: Taille; stock: number }[];
  description: string;
  details: string[];
  /** Chemins dans public/, ex. "/produits/robe-1.jpg". Vide = image de remplacement. */
  images: string[];
  nouveaute: boolean;
  /** Suspendu au portant de la page d'accueil. */
  surPortant: boolean;
  /** « Complétez le look » : produits proposés avec celui-ci (slugs). */
  associes: string[];
};

export const COULEURS: Record<CouleurId, Couleur> = {
  indigo: { id: "indigo", nom: "Indigo", hex: "#2B3A8C", teinte: "#E4E7F4" },
  ocre: { id: "ocre", nom: "Ocre", hex: "#C98A2B", teinte: "#F4EBDD" },
  noir: { id: "noir", nom: "Noir", hex: "#1A1A1A", teinte: "#E3E3E5" },
  blanc: { id: "blanc", nom: "Blanc", hex: "#FFFFFF", teinte: "#F3F3F1" },
};

/** Ordre d'affichage des tailles dans les filtres. */
export const TAILLES: Taille[] = ["S", "M", "L", "XL", "38", "39", "40", "41", "42", "43", "44", "Unique"];

export const CATEGORIES: { id: Categorie; nom: string; accroche: string }[] = [
  { id: "femme", nom: "Femme", accroche: "Robes, ensembles et jupes" },
  { id: "homme", nom: "Homme", accroche: "Boubous, kaftans et chemises" },
  { id: "accessoires", nom: "Accessoires", accroche: "Sacs, foulards et sandales" },
];

const catalogue: Produit[] = [
  {
    slug: "robe-portefeuille-wax",
    nom: "Robe portefeuille en wax",
    categorie: "femme",
    illustration: { silhouette: "robe", motif: "wax" },
    prix: 18500,
    couleurs: ["indigo", "ocre"],
    tailles: [
      { taille: "S", stock: 3 },
      { taille: "M", stock: 4 },
      { taille: "L", stock: 2 },
      { taille: "XL", stock: 0 },
    ],
    description:
      "Coupe portefeuille qui s'ajuste à toutes les silhouettes, ceinture à nouer et manches trois-quarts. Une pièce facile à porter, au bureau comme en cérémonie.",
    details: ["Wax 100 % coton", "Lavage à 30 °C, à l'envers", "Confection à Dakar"],
    images: [],
    nouveaute: true,
    surPortant: true,
    associes: ["foulard-tete-wax", "sandales-cuir-tressees", "sac-cabas-wax"],
  },
  {
    slug: "boubou-bazin-brode",
    nom: "Boubou bazin brodé",
    categorie: "homme",
    illustration: { silhouette: "boubou", motif: "bazin" },
    prix: 35000,
    couleurs: ["blanc", "indigo"],
    tailles: [
      { taille: "M", stock: 2 },
      { taille: "L", stock: 3 },
      { taille: "XL", stock: 1 },
    ],
    description:
      "Grand boubou en bazin riche, broderie ton sur ton au col et sur la poitrine. Pensé pour les cérémonies et les jours de fête.",
    details: ["Bazin riche", "Broderie à l'encolure", "Pantalon assorti inclus"],
    images: [],
    nouveaute: true,
    surPortant: true,
    associes: ["sandales-cuir-tressees", "chemise-lin"],
  },
  {
    slug: "ensemble-pagne-deux-pieces",
    nom: "Ensemble pagne deux pièces",
    categorie: "femme",
    illustration: { silhouette: "ensemble", motif: "wax" },
    prix: 22000,
    couleurs: ["ocre", "indigo"],
    tailles: [
      { taille: "S", stock: 2 },
      { taille: "M", stock: 3 },
      { taille: "L", stock: 3 },
      { taille: "XL", stock: 1 },
    ],
    description:
      "Haut ajusté et jupe droite taillés dans le même pagne. Un ensemble prêt à porter, sans passer par le tailleur.",
    details: ["Pagne 100 % coton", "Fermeture éclair au dos", "Confection à Dakar"],
    images: [],
    nouveaute: true,
    surPortant: true,
    associes: ["foulard-tete-wax", "sandales-cuir-tressees", "sac-cabas-wax"],
  },
  {
    slug: "chemise-lin",
    nom: "Chemise en lin",
    categorie: "homme",
    illustration: { silhouette: "chemise", motif: "lin" },
    prix: 12500,
    couleurs: ["blanc", "noir"],
    tailles: [
      { taille: "M", stock: 5 },
      { taille: "L", stock: 4 },
      { taille: "XL", stock: 2 },
    ],
    description: "Chemise en lin léger, col mao et coupe droite. Elle respire, même au plus fort de la saison chaude.",
    details: ["Lin lavé", "Col mao", "Manches longues à retrousser"],
    images: [],
    nouveaute: true,
    surPortant: true,
    associes: ["sandales-cuir-tressees", "chemise-wax-manches-courtes"],
  },
  {
    slug: "kaftan-homme",
    nom: "Kaftan homme",
    categorie: "homme",
    illustration: { silhouette: "kaftan", motif: "uni" },
    prix: 27500,
    couleurs: ["noir", "indigo"],
    tailles: [
      { taille: "L", stock: 2 },
      { taille: "XL", stock: 2 },
    ],
    description: "Kaftan long à manches larges, finitions brodées à l'encolure. Sobre, élégant et facile à porter.",
    details: ["Coton épais", "Broderie à l'encolure", "Poches latérales"],
    images: [],
    nouveaute: false,
    surPortant: true,
    associes: ["sandales-cuir-tressees", "boubou-bazin-brode"],
  },
  {
    slug: "jupe-longue-bogolan",
    nom: "Jupe longue bogolan",
    categorie: "femme",
    illustration: { silhouette: "jupe", motif: "bogolan" },
    prix: 15000,
    couleurs: ["ocre"],
    tailles: [
      { taille: "S", stock: 2 },
      { taille: "M", stock: 1 },
    ],
    description: "Jupe longue taille haute en bogolan, aux motifs teints à la terre selon la tradition malienne.",
    details: ["Bogolan teint à la terre", "Taille élastiquée", "Doublure en coton"],
    images: [],
    nouveaute: false,
    surPortant: true,
    associes: ["foulard-tete-wax", "sac-cabas-wax", "sandales-cuir-tressees"],
  },
  {
    slug: "robe-longue-bazin",
    nom: "Robe longue en bazin brodé",
    categorie: "femme",
    illustration: { silhouette: "kaftan", motif: "bazin" },
    prix: 32000,
    couleurs: ["ocre", "indigo"],
    tailles: [
      { taille: "S", stock: 2 },
      { taille: "M", stock: 3 },
      { taille: "L", stock: 2 },
      { taille: "XL", stock: 1 },
    ],
    description:
      "Robe longue et fluide en bazin riche, broderie dorée à l'encolure et aux poignets. La tenue des grandes occasions : baptêmes, mariages, Korité.",
    details: ["Bazin riche", "Broderie au fil doré", "Coupe ample, longueur cheville"],
    images: [],
    nouveaute: true,
    surPortant: true,
    associes: ["sandales-cuir-tressees", "sac-cabas-wax", "foulard-tete-wax"],
  },
  {
    slug: "chemise-wax-manches-courtes",
    nom: "Chemise en wax manches courtes",
    categorie: "homme",
    illustration: { silhouette: "chemise", motif: "wax" },
    prix: 14500,
    couleurs: ["indigo", "ocre"],
    tailles: [
      { taille: "M", stock: 4 },
      { taille: "L", stock: 4 },
      { taille: "XL", stock: 2 },
    ],
    description:
      "Chemise décontractée en wax, col classique et manches courtes. Pour le week-end, les sorties et les jours de grande chaleur.",
    details: ["Wax 100 % coton", "Coupe droite", "Boutons nacrés"],
    images: [],
    nouveaute: true,
    surPortant: true,
    associes: ["sandales-cuir-tressees", "chemise-lin"],
  },
  {
    slug: "sac-cabas-wax",
    nom: "Sac cabas en wax",
    categorie: "accessoires",
    illustration: { silhouette: "sac", motif: "wax" },
    prix: 9500,
    couleurs: ["indigo", "ocre"],
    tailles: [{ taille: "Unique", stock: 6 }],
    description:
      "Grand cabas en wax doublé, anses en coton tressé et poche intérieure zippée. Assez grand pour le marché comme pour la plage.",
    details: ["Wax doublé coton", "Poche intérieure zippée", "40 × 35 cm"],
    images: [],
    nouveaute: true,
    surPortant: false,
    associes: ["foulard-tete-wax", "robe-portefeuille-wax"],
  },
  {
    slug: "foulard-tete-wax",
    nom: "Foulard de tête en wax",
    categorie: "accessoires",
    illustration: { silhouette: "foulard", motif: "wax" },
    prix: 5000,
    couleurs: ["ocre", "indigo"],
    tailles: [{ taille: "Unique", stock: 10 }],
    description:
      "Foulard long à nouer en turban ou en headwrap, dans le même wax que nos robes pour composer un ensemble assorti.",
    details: ["Wax 100 % coton", "180 × 50 cm", "Ourlets finis à la main"],
    images: [],
    nouveaute: false,
    surPortant: false,
    associes: ["sac-cabas-wax", "ensemble-pagne-deux-pieces"],
  },
  {
    slug: "sandales-cuir-tressees",
    nom: "Sandales en cuir tressé",
    categorie: "accessoires",
    illustration: { silhouette: "sandales", motif: "uni" },
    prix: 16000,
    couleurs: ["ocre", "noir"],
    tailles: [
      { taille: "38", stock: 1 },
      { taille: "39", stock: 2 },
      { taille: "40", stock: 3 },
      { taille: "41", stock: 3 },
      { taille: "42", stock: 2 },
      { taille: "43", stock: 1 },
      { taille: "44", stock: 0 },
    ],
    description:
      "Sandales plates en cuir tressé à la main, semelle en cuir et caoutchouc antidérapant. Confortables du matin au soir, en ville comme en cérémonie.",
    details: ["Cuir de vachette", "Tressage artisanal", "Semelle antidérapante"],
    images: [],
    nouveaute: true,
    surPortant: false,
    associes: ["sac-cabas-wax", "robe-longue-bazin", "kaftan-homme"],
  },
];

/** Le catalogue, complété par les photos générées (src/data/photos-detourees.json). */
export const produits: Produit[] = catalogue.map((p) => ({
  ...p,
  detoure: p.detoure ?? (photosGenerees as Record<string, PhotosDetourees>)[p.slug],
  // Photos portées générées (ambiance), ajoutées après celles fournies par le client.
  images: [...p.images, ...photosPortees(p.slug)],
}));

/**
 * Photo détourée d'un produit dans une couleur, ou undefined (le dessin prend alors le relais).
 * Un dos n'est utilisé que si la face existe, pour ne jamais mélanger photo et dessin.
 */
export function photoDetouree(produit: Produit, couleur: CouleurId, face: "recto" | "verso"): string | undefined {
  const photos = produit.detoure?.[couleur];
  if (!photos?.recto) return undefined;
  return face === "recto" ? photos.recto : photos.verso;
}

export function trouverProduit(slug: string): Produit | undefined {
  return produits.find((p) => p.slug === slug);
}

export function stockDisponible(produit: Produit, taille: Taille): number {
  return produit.tailles.find((t) => t.taille === taille)?.stock ?? 0;
}

/** Produits proposés pour compléter le look, dans l'ordre choisi. */
export function produitsAssocies(produit: Produit): Produit[] {
  return produit.associes.map(trouverProduit).filter((p): p is Produit => !!p && p.slug !== produit.slug);
}

/** Toutes les tailles en stock d'un produit, dans l'ordre d'affichage. */
export function taillesDisponibles(produit: Produit): Taille[] {
  return produit.tailles.filter((t) => t.stock > 0).map((t) => t.taille);
}

/** Vrai si le visuel est suspendu (cintre ou crochet) ; faux pour un article posé à plat (chaussures). */
export function estSuspendu(produit: Produit): boolean {
  return produit.illustration.silhouette !== "sandales";
}

/** « Taille M », « Pointure 40 » ou « Taille unique ». */
export function libelleTaille(taille: Taille): string {
  if (taille === "Unique") return "Taille unique";
  return /^\d+$/.test(taille) ? `Pointure ${taille}` : `Taille ${taille}`;
}
