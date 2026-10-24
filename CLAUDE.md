@AGENTS.md

# Maison Démo : modèle de boutique en ligne de l'agence

Modèle réutilisable pour les boutiques de commerçants au Sénégal (vêtements, couture, restauration…).
Chaque nouveau client part d'une copie de ce dépôt.

## Commandes

- `npm run dev` : serveur de développement sur http://localhost:3000
- `npm run lint` puis `npm run build` : avant chaque livraison, les deux doivent passer sans erreur.

## Pile

Next.js 16 (App Router, Cache Components et Partial Prefetching activés), React 19, TypeScript strict,
Tailwind CSS v4, polices auto-hébergées (`@fontsource-variable`).
Avant d'utiliser une API Next.js, lire la doc embarquée dans `node_modules/next/dist/docs/` (voir AGENTS.md).

## Où se trouve quoi

- `src/config/boutique.ts` : nom, couleur, zones de livraison, moyens de paiement, mode de paiement. Premier fichier à adapter.
- `src/data/produits.ts` : catalogue, couleurs, tailles, stock. Photos dans `public/produits/`.
- `src/lib/panier.ts` : panier, zone, dernière commande (stockés dans le navigateur) et messages WhatsApp.
- `src/lib/whatsapp.ts` : normalisation des numéros et liens wa.me.
- `src/lib/paiement.ts` : point d'entrée unique du paiement (simulé en mode `demo`).
- `src/lib/format.ts` : montants en FCFA.
- `src/lib/stockage.ts` : état persistant côté navigateur (`useSyncExternalStore`).
- `src/components/Portant.tsx` : tringle de la page d'accueil et vue rapprochée (dialogue natif, View Transitions).
- `src/components/Vetement.tsx` : vêtements dessinés en SVG (forme, tissu, couleur, recto/verso), remplacés par
  les photos détourées `detoure` quand elles existent.
- `scripts/generer_visuels.py` + `scripts/visuels.json` : photos de démonstration générées avec Grok Imagine
  (clé `XAI_API_KEY` en variable d'environnement, jamais dans un fichier), branchées via `src/data/photos-detourees.json`.
- `src/components/` : écrans ; `src/app/` : routes.

## Règles du projet

- Interface en français, vouvoiement, phrases courtes.
- Montants en FCFA : entiers, jamais de décimales, toujours via `formatFCFA` (espace fine insécable entre les milliers).
- Numéros : stockés au format `221XXXXXXXXX`, affichés `77 123 45 67` via `afficherNumero`.
- Mobile d'abord : vérifier à 390 px de large, cibles tactiles de 44 px minimum, aucun défilement horizontal.
- Cache Components : pas de `searchParams`, `cookies()`, `headers()` ni `new Date()` dans un composant serveur
  hors `<Suspense>`. Chaque route dynamique a un `generateStaticParams`.
- L'état du navigateur passe par `creerStockage` (src/lib/stockage.ts), jamais par `useEffect` + `setState`.
  Les valeurs relues sont validées : un ancien panier ne doit jamais faire planter une page.
- Next.js garde les pages visitées montées mais cachées : dans les tests, cibler les éléments visibles.
- Images générées par IA : seulement pour la démo et l'ambiance. Les produits d'un vrai client sont montrés
  avec des photos des vrais articles. Toujours annoncer le coût avant un appel payant.
- Animations : toujours une version immobile sous `prefers-reduced-motion`, et jamais d'effet qui retarde
  l'accès au panier ou à WhatsApp. Pages légères : pas de 3D ni de vidéo lourde, la clientèle est en 4G.

## Paiement réel (à construire pour chaque client)

Le mode `demo` simule le paiement. Pour encaisser réellement :

1. Route serveur `src/app/api/paiement/route.ts` qui recalcule le total depuis `src/data/produits.ts`.
   Ne jamais faire confiance au montant envoyé par le navigateur.
2. Création de la session chez le fournisseur (Wave Checkout, ou un agrégateur : PayTech, PayDunya, CinetPay, Bictorys),
   puis redirection vers l'URL de paiement. Selon la doc Wave, `wave_launch_url` s'ouvre dans le navigateur,
   pas dans une webview intégrée : à tester depuis un lien ouvert dans WhatsApp.
3. Route webhook qui vérifie la signature sur le corps brut (`await request.text()` avant tout `JSON.parse`),
   rejette les événements trop anciens, répond vite en 2xx et ignore les doublons (même identifiant d'événement).
4. La commande n'est marquée payée qu'à réception d'un webhook valide. Il faut alors une base de données
   (ex. Supabase) : le stockage du navigateur ne suffit plus.
5. Clés API uniquement dans `.env.local`, jamais dans le code ni dans un skill. Clés de test pendant le développement.

Toujours vérifier endpoints, signatures et frais dans la documentation officielle du fournisseur au moment
de l'intégration : ces informations changent.

## Skills du projet

- `.claude/skills/commande-whatsapp` : liens, messages et boutons de commande WhatsApp.
