"use client";

import Image from "next/image";

import { useId, type ReactNode } from "react";
import type { CouleurId, Motif, Silhouette } from "@/data/produits";

/**
 * Vêtement dessiné sur son cintre (viewBox 200 × 320, crochet en haut au centre).
 * Sert tant que le client n'a pas fourni de photos détourées : passez `photo` pour
 * afficher la photo à la place, avec le même cadrage.
 */

type Face = "recto" | "verso";
type Palette = { fond: string; clair: string; fonce: string; accent: string; contour: string };

const PALETTES: Record<CouleurId, Palette> = {
  indigo: { fond: "#2B3A8C", clair: "#6675C9", fonce: "#19235F", accent: "#E3AA3C", contour: "#121948" },
  ocre: { fond: "#C98A2B", clair: "#EBC071", fonce: "#8A5912", accent: "#26347F", contour: "#6A440E" },
  noir: { fond: "#26262B", clair: "#56565F", fonce: "#121214", accent: "#D19A3E", contour: "#000000" },
  blanc: { fond: "#F6F3EC", clair: "#FFFFFF", fonce: "#DDD6C7", accent: "#B4955C", contour: "#BDB4A1" },
};

type Forme = {
  corps: string;
  plis: string[];
  /** classique : cintre en bois ; pinces : cintre à jupe ; crochet : crochet seul ; aucun : posé à plat. */
  cintre: "classique" | "pinces" | "crochet" | "aucun";
  recto: (p: Palette) => ReactNode;
  verso: (p: Palette) => ReactNode;
  /** Éléments dessinés hors de la forme (anses, attaches). */
  horsForme?: (p: Palette) => ReactNode;
};

const ligne = (d: string, opacite = 0.35, epaisseur = 1.5, couleur = "#000") => (
  <path d={d} fill="none" stroke={couleur} strokeOpacity={opacite} strokeWidth={epaisseur} strokeLinecap="round" />
);

const FORMES: Record<Silhouette, Forme> = {
  chemise: {
    corps:
      "M66 46 L88 38 Q100 48 112 38 L134 46 L170 64 L192 148 L170 156 L150 98 L152 226 Q100 236 48 226 L50 98 L30 156 L8 148 L30 64 Z",
    plis: ["M72 118 Q69 170 73 222", "M128 118 Q131 170 127 222", "M22 92 Q18 120 16 146", "M178 92 Q182 120 184 146"],
    cintre: "classique",
    recto: (p) => (
      <>
        <path d="M86 38 Q100 54 114 38 L113 29 Q100 42 87 29 Z" fill={p.fonce} />
        {ligne("M96 50 V229", 0.28)}
        {ligne("M104 50 V229", 0.28)}
        {[66, 94, 122, 150, 178, 206].map((y) => (
          <circle key={y} cx="100" cy={y} r="2.3" fill={p.clair} stroke={p.contour} strokeOpacity="0.6" strokeWidth="0.8" />
        ))}
        <path d="M60 90 h22 v19 q-11 5 -22 0 Z" fill="none" stroke="#000" strokeOpacity="0.22" strokeWidth="1.4" />
        {ligne("M12 136 L33 144", 0.3, 1.6)}
        {ligne("M188 136 L167 144", 0.3, 1.6)}
      </>
    ),
    verso: () => (
      <>
        {ligne("M88 38 Q100 45 112 38", 0.3)}
        {ligne("M56 68 Q100 80 144 68", 0.28)}
        {ligne("M100 75 V100", 0.25)}
        {ligne("M12 136 L33 144", 0.3, 1.6)}
        {ligne("M188 136 L167 144", 0.3, 1.6)}
      </>
    ),
  },

  robe: {
    corps:
      "M70 46 L88 38 Q100 46 112 38 L130 46 L164 64 L180 128 L160 134 L144 92 L138 126 Q150 210 176 298 Q100 310 24 298 Q50 210 62 126 L56 92 L40 134 L20 128 L36 64 Z",
    plis: ["M60 160 Q52 230 44 296", "M140 160 Q148 230 156 296", "M86 150 Q82 222 78 302", "M114 150 Q118 222 122 302"],
    cintre: "classique",
    recto: (p) => (
      <>
        <path d="M88 38 Q100 46 112 38 L100 76 Z" fill={p.fonce} fillOpacity="0.7" />
        {ligne("M88 38 L121 123", 0.45, 2)}
        {ligne("M112 38 L80 125", 0.3, 1.6)}
        <path d="M61 119 Q100 128 139 119 L140 132 Q100 141 60 132 Z" fill={p.fonce} />
        <path d="M128 126 q14 -12 21 -2 q-7 9 -21 2 Z" fill={p.fonce} />
        <path d="M128 127 q-12 -11 -19 -1 q7 8 19 1 Z" fill={p.fonce} />
        <path d="M127 131 q6 20 -2 46" fill="none" stroke={p.fonce} strokeWidth="4.5" strokeLinecap="round" />
        <path d="M130 131 q12 18 12 42" fill="none" stroke={p.fonce} strokeWidth="4.5" strokeLinecap="round" />
        {ligne("M138 136 Q128 222 112 304", 0.35)}
      </>
    ),
    verso: (p) => (
      <>
        {ligne("M88 38 Q100 50 112 38", 0.3)}
        <path d="M61 121 Q100 130 139 121 L140 131 Q100 140 60 131 Z" fill={p.fonce} fillOpacity="0.8" />
        {ligne("M100 50 V120", 0.3, 1.4)}
      </>
    ),
  },

  boubou: {
    corps: "M84 38 Q100 48 116 38 L186 70 L196 300 Q100 314 4 300 L14 70 Z",
    plis: ["M40 92 Q34 200 30 300", "M68 84 Q64 200 60 306", "M132 84 Q136 200 140 306", "M160 92 Q166 200 170 300"],
    cintre: "classique",
    recto: (p) => (
      <>
        <path d="M84 38 Q100 48 116 38 Q100 76 84 38 Z" fill={p.fonce} fillOpacity="0.75" />
        <path d="M78 40 Q100 90 122 40" fill="none" stroke={p.accent} strokeWidth="3.2" />
        <path d="M73 42 Q100 99 127 42" fill="none" stroke={p.accent} strokeWidth="1.3" strokeDasharray="2 3" />
        {[104, 118, 132, 146, 160].map((y) => (
          <path key={y} d={`M100 ${y - 6} L106 ${y} L100 ${y + 6} L94 ${y} Z`} fill="none" stroke={p.accent} strokeWidth="1.6" />
        ))}
        {[111, 125, 139, 153].map((y) => (
          <circle key={y} cx="100" cy={y} r="1.4" fill={p.accent} />
        ))}
      </>
    ),
    verso: () => <>{ligne("M84 38 Q100 50 116 38", 0.3)}</>,
  },

  kaftan: {
    corps:
      "M84 38 Q100 46 116 38 L140 46 L180 64 L190 130 L162 136 L148 98 L150 300 Q100 308 50 300 L52 98 L38 136 L10 130 L20 64 L60 46 Z",
    plis: ["M76 140 Q72 220 70 300", "M124 140 Q128 220 130 300", "M100 130 Q99 220 100 304"],
    cintre: "classique",
    recto: (p) => (
      <>
        <path d="M88 39 Q100 46 112 39 L100 92 Z" fill={p.fonce} fillOpacity="0.85" />
        <path d="M84 40 L100 102 L116 40" fill="none" stroke={p.accent} strokeWidth="3.2" strokeLinejoin="round" />
        <path d="M80 42 L100 112 L120 42" fill="none" stroke={p.accent} strokeWidth="1.2" strokeDasharray="1.5 3" />
        {ligne("M12 122 L40 128", 1, 2.6, p.accent)}
        {ligne("M188 122 L160 128", 1, 2.6, p.accent)}
        {ligne("M52 262 V300", 0.4)}
        {ligne("M148 262 V300", 0.4)}
      </>
    ),
    verso: (p) => (
      <>
        {ligne("M84 38 Q100 50 116 38", 0.3)}
        {ligne("M12 122 L40 128", 1, 2.6, p.accent)}
        {ligne("M188 122 L160 128", 1, 2.6, p.accent)}
      </>
    ),
  },

  ensemble: {
    corps:
      "M72 46 L88 38 Q100 48 112 38 L128 46 L156 58 L166 86 L146 92 L138 74 L140 116 Q158 126 168 142 Q100 154 32 142 Q42 126 60 116 L62 74 L54 92 L34 86 L44 58 Z M60 158 H140 L148 298 Q100 306 52 298 Z",
    plis: ["M78 180 Q76 240 74 296", "M122 180 Q124 240 126 296", "M80 124 Q76 134 70 146", "M120 124 Q124 134 130 146"],
    cintre: "classique",
    recto: (p) => (
      <>
        <path d="M88 38 Q100 46 112 38 Q100 58 88 38 Z" fill={p.fonce} fillOpacity="0.75" />
        {ligne("M60 116 Q100 124 140 116", 0.35)}
        <path d="M60 158 H140 L140.6 168 H59.4 Z" fill={p.fonce} fillOpacity="0.6" />
        {ligne("M100 272 V302", 0.35)}
      </>
    ),
    verso: (p) => (
      <>
        {ligne("M88 38 Q100 46 112 38", 0.3)}
        <path d="M60 158 H140 L140.6 168 H59.4 Z" fill={p.fonce} fillOpacity="0.6" />
        {ligne("M100 168 V206", 0.35, 1.4)}
      </>
    ),
    horsForme: () => <path d="M66 141 V159 M134 141 V159" stroke="#6B6F76" strokeWidth="1.6" strokeLinecap="round" />,
  },

  jupe: {
    corps: "M60 50 H140 L174 286 Q100 300 26 286 Z",
    plis: ["M76 100 Q66 200 54 288", "M124 100 Q134 200 146 288", "M100 90 Q99 200 100 296"],
    cintre: "pinces",
    recto: (p) => (
      <>
        <path d="M60 50 H140 L141.5 63 H58.5 Z" fill={p.fonce} />
        {ligne("M84 63 Q78 180 66 290", 0.22)}
        {ligne("M116 63 Q122 180 134 290", 0.22)}
      </>
    ),
    verso: (p) => (
      <>
        <path d="M60 50 H140 L141.5 63 H58.5 Z" fill={p.fonce} />
        {ligne("M100 63 V112", 0.4, 1.4)}
      </>
    ),
  },

  sac: {
    corps: "M40 112 H160 L170 294 Q100 306 30 294 Z",
    plis: ["M72 140 Q67 220 62 292", "M128 140 Q133 220 138 292"],
    cintre: "crochet",
    recto: (p) => (
      <>
        <path d="M40 112 H160 L161.6 130 H38.4 Z" fill={p.fonce} />
        {ligne("M44 136 H156", 0.3, 1.2, "#fff")}
      </>
    ),
    verso: (p) => (
      <>
        <path d="M40 112 H160 L161.6 130 H38.4 Z" fill={p.fonce} />
        {ligne("M84 160 H116 V188 H84 Z", 0.3)}
      </>
    ),
    horsForme: (p) => (
      <>
        <path d="M60 116 Q66 46 100 33 Q134 46 140 116" fill="none" stroke={p.fonce} strokeWidth="7" strokeLinecap="round" />
        <path
          d="M60 116 Q66 46 100 33 Q134 46 140 116"
          fill="none"
          stroke={p.clair}
          strokeWidth="2"
          strokeDasharray="3 4"
          strokeLinecap="round"
        />
      </>
    ),
  },

  foulard: {
    corps: "M64 50 Q100 44 136 50 L141 298 L119 290 L100 304 L81 290 L59 298 Z",
    plis: ["M82 80 Q78 190 80 288", "M118 80 Q122 190 120 288"],
    cintre: "classique",
    recto: () => (
      <>
        {ligne("M64 64 Q100 74 136 64", 0.35, 1.6)}
        {ligne("M68 70 L72 292", 0.18, 1)}
        {ligne("M132 70 L128 292", 0.18, 1)}
      </>
    ),
    verso: () => <>{ligne("M64 64 Q100 74 136 64", 0.35, 1.6)}</>,
  },

  sandales: {
    corps:
      "M62 70 C42 70 34 96 36 128 C38 160 44 176 42 206 C40 236 40 268 62 280 C84 268 86 236 82 206 C80 176 86 160 88 128 C90 96 82 70 62 70 Z M138 86 C158 86 166 112 164 144 C162 176 156 192 158 222 C160 252 160 284 138 296 C116 284 114 252 118 222 C120 192 114 176 112 144 C110 112 118 86 138 86 Z",
    plis: [],
    cintre: "aucun",
    recto: (p) => (
      <>
        {[0, 76].map((dx, i) => (
          <g key={dx} transform={`translate(${dx} ${i * 16})`}>
            <path d="M34 104 L90 146 M90 104 L34 146" stroke={p.fonce} strokeWidth="11" strokeLinecap="round" />
            <path d="M34 104 L90 146 M90 104 L34 146" stroke={p.clair} strokeWidth="2" strokeDasharray="3 5" />
            <path d="M36 176 H88" stroke={p.fonce} strokeWidth="13" strokeLinecap="round" />
            <path d="M36 176 H88" stroke={p.clair} strokeWidth="2" strokeDasharray="3 5" />
          </g>
        ))}
      </>
    ),
    verso: (p) => (
      <>
        {[0, 76].map((dx, i) =>
          [100, 124, 148, 172, 196, 220, 244, 268].map((y) => (
            <path
              key={`${dx}-${y}`}
              d={`M${36 + dx} ${y + i * 16} H${88 + dx}`}
              stroke={p.fonce}
              strokeOpacity="0.55"
              strokeWidth="3"
            />
          )),
        )}
      </>
    ),
  },
};

function Tissu({ id, motif, p }: { id: string; motif: Motif; p: Palette }) {
  switch (motif) {
    case "wax":
      return (
        <pattern id={id} width="30" height="30" patternUnits="userSpaceOnUse" patternTransform="rotate(18)">
          <rect width="30" height="30" fill={p.fond} />
          <circle cx="15" cy="15" r="9.5" fill="none" stroke={p.accent} strokeWidth="2.6" />
          <circle cx="15" cy="15" r="4.4" fill={p.clair} />
          <circle cx="15" cy="15" r="1.6" fill={p.accent} />
          {[0, 30].map((x) => [0, 30].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="4" fill={p.fonce} />))}
          <circle cx="15" cy="0" r="1.4" fill={p.clair} />
          <circle cx="15" cy="30" r="1.4" fill={p.clair} />
          <circle cx="0" cy="15" r="1.4" fill={p.clair} />
          <circle cx="30" cy="15" r="1.4" fill={p.clair} />
        </pattern>
      );
    case "bazin":
      return (
        <pattern id={id} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="14" height="14" fill={p.fond} />
          <rect x="4" y="4" width="6" height="6" fill="none" stroke={p.clair} strokeOpacity="0.35" strokeWidth="1" />
        </pattern>
      );
    case "bogolan":
      return (
        <pattern id={id} width="36" height="36" patternUnits="userSpaceOnUse">
          <rect width="36" height="36" fill={p.fond} />
          <path d="M0 9 L4.5 4 L9 9 L13.5 4 L18 9 L22.5 4 L27 9 L31.5 4 L36 9" fill="none" stroke={p.fonce} strokeWidth="2.2" />
          <path d="M6 24 h6 M9 21 v6 M24 24 h6 M27 21 v6" stroke={p.clair} strokeWidth="1.8" />
          <circle cx="18" cy="31" r="1.5" fill={p.fonce} />
          <circle cx="0" cy="31" r="1.5" fill={p.fonce} />
          <circle cx="36" cy="31" r="1.5" fill={p.fonce} />
        </pattern>
      );
    case "lin":
      return (
        <pattern id={id} width="5" height="5" patternUnits="userSpaceOnUse">
          <rect width="5" height="5" fill={p.fond} />
          <path d="M0 2.5 H5" stroke="#000" strokeOpacity="0.05" />
          <path d="M2.5 0 V5" stroke="#fff" strokeOpacity="0.08" />
        </pattern>
      );
    default:
      return (
        <pattern id={id} width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill={p.fond} />
          <path d="M0 8 L8 0" stroke="#000" strokeOpacity="0.05" />
        </pattern>
      );
  }
}

function Cintre({ type }: { type: Forme["cintre"] }) {
  if (type === "crochet" || type === "aucun") return null;
  if (type === "pinces") {
    return (
      <g>
        <rect x="40" y="32" width="120" height="7" rx="3.5" fill="#9A6B43" stroke="#7A5232" strokeWidth="1" />
        <rect x="56" y="36" width="12" height="20" rx="2" fill="#6B6F76" />
        <rect x="132" y="36" width="12" height="20" rx="2" fill="#6B6F76" />
      </g>
    );
  }
  return (
    <path
      d="M100 30 L50 52 C45 54 46 58 51 58 L149 58 C154 58 155 54 150 52 Z"
      fill="#9A6B43"
      stroke="#7A5232"
      strokeWidth="1"
    />
  );
}

type Props = {
  silhouette: Silhouette;
  motif: Motif;
  couleur: CouleurId;
  face?: Face;
  /** Photo détourée qui remplace le dessin. */
  photo?: string;
  /** "eager" pour une photo visible dès l'arrivée sur la page (portant), "lazy" sinon. */
  chargement?: "eager" | "lazy";
  /** Largeur affichée de la photo (attribut sizes) : le navigateur télécharge une version à la bonne taille. */
  sizes?: string;
  /** Texte alternatif. Sans titre, l'image est décorative. */
  titre?: string;
  className?: string;
};

export function Vetement({
  silhouette,
  motif,
  couleur,
  face = "recto",
  photo,
  chargement = "lazy",
  sizes = "(min-width: 768px) 25vw, 50vw",
  titre,
  className = "",
}: Props) {
  const brut = useId().replace(/[^a-zA-Z0-9_-]/g, "");

  if (photo) {
    return (
      // Photo détourée 750 × 1200, servie à la taille d'affichage (souvent 4 à 8 fois plus légère sur téléphone).
      <Image
        src={photo}
        alt={titre ?? ""}
        width={750}
        height={1200}
        sizes={sizes}
        loading={chargement}
        draggable={false}
        className={`object-contain ${className}`}
      />
    );
  }

  const forme = FORMES[silhouette];
  const p = PALETTES[couleur];
  const id = (nom: string) => `v${brut}-${nom}`;
  const url = (nom: string) => `url(#${id(nom)})`;

  return (
    <svg
      viewBox="0 0 200 320"
      className={className}
      role={titre ? "img" : undefined}
      aria-label={titre}
      aria-hidden={titre ? undefined : true}
    >
      <defs>
        <Tissu id={id("tissu")} motif={motif} p={p} />
        <clipPath id={id("forme")}>
          <path d={forme.corps} />
        </clipPath>
        <linearGradient id={id("volume")} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.24" />
          <stop offset="0.2" stopColor="#000" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.08" />
          <stop offset="0.8" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.24" />
        </linearGradient>
        <linearGradient id={id("ombre")} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.1" />
          <stop offset="0.25" stopColor="#000" stopOpacity="0" />
          <stop offset="0.8" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.14" />
        </linearGradient>
        {motif === "bazin" && (
          <linearGradient id={id("brillance")} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0.38" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0.3" />
            <stop offset="0.62" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        )}
      </defs>

      <Cintre type={forme.cintre} />

      <g clipPath={url("forme")}>
        <rect width="200" height="320" fill={url("tissu")} />
        {forme.plis.map((d) => (
          <g key={d}>
            <path d={d} fill="none" stroke="#000" strokeOpacity="0.13" strokeWidth="4" strokeLinecap="round" />
            <path
              d={d}
              transform="translate(3 0)"
              fill="none"
              stroke="#fff"
              strokeOpacity="0.1"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>
        ))}
        {motif === "bazin" && <rect width="200" height="320" fill={url("brillance")} />}
        {face === "recto" ? forme.recto(p) : forme.verso(p)}
        <rect width="200" height="320" fill={url("volume")} />
        <rect width="200" height="320" fill={url("ombre")} />
      </g>
      <path d={forme.corps} fill="none" stroke={p.contour} strokeOpacity="0.55" strokeWidth="1.2" strokeLinejoin="round" />
      {forme.horsForme?.(p)}

      {forme.cintre !== "aucun" && (
        <path
          d="M100 34 V22 C100 16 107 14 107 8 C107 3 103.5 1 100 1 C96.5 1 94 3.5 94 6.5"
          fill="none"
          stroke="#6B6F76"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}
