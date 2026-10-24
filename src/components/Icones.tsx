/** Icônes au trait, décoratives : le texte ou l'aria-label du bouton porte le sens. */

import type { ReactNode } from "react";

type Props = { className?: string };

function Svg({ className = "size-6", children }: Props & { children: ReactNode }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function IconePanier(p: Props) {
  return (
    <Svg {...p}>
      <path d="M6 8h12l-1 12H7L6 8z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </Svg>
  );
}

export function IconeMessage(p: Props) {
  return (
    <Svg {...p}>
      <path d="M4 20l1.3-3.9A8 8 0 1 1 8 19.1L4 20z" />
      <path d="M9 10.5h6M9 13.5h4" />
    </Svg>
  );
}

export function IconeRetour(p: Props) {
  return (
    <Svg {...p}>
      <path d="M15 5l-7 7 7 7" />
    </Svg>
  );
}

export function IconeFleche(p: Props) {
  return (
    <Svg {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </Svg>
  );
}

export function IconeVetement(p: Props) {
  return (
    <Svg {...p}>
      <path d="M8.5 4 4 6.5l1.8 4L8 9.5V20h8V9.5l2.2 1 1.8-4L15.5 4c-.8 1.4-2 2.1-3.5 2.1S9.3 5.4 8.5 4z" />
    </Svg>
  );
}

export function IconeMoins(p: Props) {
  return (
    <Svg {...p}>
      <path d="M5 12h14" />
    </Svg>
  );
}

export function IconePlus(p: Props) {
  return (
    <Svg {...p}>
      <path d="M12 5v14M5 12h14" />
    </Svg>
  );
}

export function IconeCorbeille(p: Props) {
  return (
    <Svg {...p}>
      <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
    </Svg>
  );
}

export function IconeValide(p: Props) {
  return (
    <Svg {...p}>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </Svg>
  );
}

export function IconeTelephone(p: Props) {
  return (
    <Svg {...p}>
      <rect x="7" y="3" width="10" height="18" rx="2" />
      <path d="M11 18h2" />
    </Svg>
  );
}

export function IconeLivraison(p: Props) {
  return (
    <Svg {...p}>
      <path d="M3 7h11v9H3z" />
      <path d="M14 10h4l3 3v3h-7" />
      <circle cx="7" cy="17.5" r="1.5" />
      <circle cx="17" cy="17.5" r="1.5" />
    </Svg>
  );
}

export function IconeCadenas(p: Props) {
  return (
    <Svg {...p}>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </Svg>
  );
}

export function IconeInfo(p: Props) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5M12 16.5v.01" />
    </Svg>
  );
}

export function IconeFermer(p: Props) {
  return (
    <Svg {...p}>
      <path d="M6 6l12 12M18 6L6 18" />
    </Svg>
  );
}

export function IconeRetourner(p: Props) {
  return (
    <Svg {...p}>
      <path d="M4 12a8 8 0 0 1 13.7-5.6L20 9" />
      <path d="M20 4v5h-5" />
      <path d="M20 12a8 8 0 0 1-13.7 5.6L4 15" />
      <path d="M4 20v-5h5" />
    </Svg>
  );
}

export function IconeMenu(p: Props) {
  return (
    <Svg {...p}>
      <path d="M4 7h16M4 12h16M4 17h10" />
    </Svg>
  );
}

export function IconeRecherche(p: Props) {
  return (
    <Svg {...p}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4 4" />
    </Svg>
  );
}

export function IconeCoeur({ plein = false, ...p }: Props & { plein?: boolean }) {
  return (
    <svg
      className={p.className ?? "size-6"}
      viewBox="0 0 24 24"
      fill={plein ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
    </svg>
  );
}

export function IconePartage(p: Props) {
  return (
    <Svg {...p}>
      <circle cx="18" cy="5.5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="18.5" r="2.5" />
      <path d="M8.2 10.8l7.6-4M8.2 13.2l7.6 4" />
    </Svg>
  );
}

export function IconeRegle(p: Props) {
  return (
    <Svg {...p}>
      <rect x="3" y="8" width="18" height="8" rx="1.5" />
      <path d="M7 8v3M11 8v4M15 8v3M19 8v2" />
    </Svg>
  );
}

export function IconeRetours(p: Props) {
  return (
    <Svg {...p}>
      <path d="M9 14L4 9l5-5" />
      <path d="M4 9h11a5 5 0 0 1 0 10h-3" />
    </Svg>
  );
}

export function IconeHorloge(p: Props) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </Svg>
  );
}

export function IconeLieu(p: Props) {
  return (
    <Svg {...p}>
      <path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.3" />
    </Svg>
  );
}

export function IconeAiguille(p: Props) {
  return (
    <Svg {...p}>
      <path d="M19 5L7 17" />
      <path d="M5 19l2-2" />
      <ellipse cx="18.2" cy="5.8" rx="1.4" ry="2.4" transform="rotate(45 18.2 5.8)" />
      <path d="M8 7c-3 1-4 4-2 6s5 1 6-2" />
    </Svg>
  );
}
