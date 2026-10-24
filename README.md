# Maison Démo : boutique en ligne de démonstration

Boutique de mode fictive qui sert de démo pour les rendez-vous prospects et de base réutilisable pour chaque client :
catalogue avec filtres, fiche produit, panier, paiement Wave / Orange Money / à la livraison (simulé),
et commande par WhatsApp réelle.

## Lancer le projet sur Windows

Prérequis : [Node.js](https://nodejs.org) 20.9 ou plus récent, et Git.

Dans PowerShell, depuis ce dossier :

```powershell
npm install
Copy-Item .env.example .env.local
notepad .env.local      # mettez votre numéro WhatsApp, ex. 77 123 45 67
npm run dev
```

Ouvrez ensuite http://localhost:3000.

### Montrer la démo sur un téléphone

Le téléphone et le PC doivent être sur le même Wi-Fi (pas un réseau « invités », qui isole les appareils).

1. Lancez `npm run dev`.
2. Tapez `ipconfig` et notez l'« Adresse IPv4 » de la **carte Wi-Fi** (ex. 192.168.1.20).
   Ignorez les cartes « VirtualBox Host-Only » (192.168.56.1) et « vEthernet » : le téléphone ne peut pas les joindre.
3. Sur le téléphone, ouvrez `http://192.168.1.20:3000` (avec `http://` et `:3000`).

Si la page ne charge pas, c'est presque toujours le pare-feu Windows. Dans PowerShell **en administrateur** :

```powershell
Get-NetConnectionProfile                                              # le Wi-Fi doit être « Private »
Set-NetConnectionProfile -InterfaceAlias "Wi-Fi" -NetworkCategory Private   # seulement pour votre Wi-Fi de confiance
New-NetFirewallRule -DisplayName "Next.js dev 3000" -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow -Profile Private
```

Pour un rendez-vous chez un commerçant, le plus simple reste de mettre la démo en ligne : elle s'ouvre alors
sur n'importe quel téléphone, en 4G, sans dépendre du PC.

Avec votre numéro dans `.env.local`, les boutons « Commander sur WhatsApp » ouvrent WhatsApp avec la commande
déjà rédigée, adressée à vous. C'est le moment fort de la démo : le commerçant voit la commande qu'il recevrait.

## Adapter la boutique pour un client

1. `src/config/boutique.ts` : nom, slogan, couleur, zones et frais de livraison, moyens de paiement,
   crédit « Site réalisé par » en bas de page.
2. `src/data/produits.ts` : produits, prix en FCFA, tailles et stock, couleurs, forme et tissu du dessin.
3. `public/produits/` : photos détourées pour le portant (`detoure`, voir plus bas) et, si besoin,
   photos portées pour le catalogue (`images`).
4. `.env.local` : numéro WhatsApp du commerçant.
5. `npm run lint` puis `npm run build` : les deux doivent passer.

## Le portant de la page d'accueil

Les vêtements sont suspendus à une tringle. Sur ordinateur, le vêtement survolé s'avance ; sur téléphone,
on fait défiler la tringle au doigt. Un toucher ouvre la vue rapprochée : étiquette, devant et dos, couleurs,
tailles, panier et WhatsApp. Les animations s'arrêtent si le téléphone demande de limiter les mouvements.

Tant qu'il n'y a pas de photos, les vêtements sont **dessinés** (`src/components/Vetement.tsx`) d'après la forme et le
tissu indiqués dans `illustration` (`src/data/produits.ts`).

### Photos du portant (vrais vêtements du client)

1. Photographiez chaque vêtement **sur un cintre**, devant un mur uni, en format portrait, toujours à la même distance :
   une photo de face, une de dos.
2. Retirez le fond avec Photoroom ou remove.bg, puis exportez en WebP (ou PNG) transparent, au format 5 × 8
   (ex. 1000 × 1600 px), le crochet du cintre en haut au centre. Visez moins de 150 Ko par image.
3. Déposez les fichiers dans `public/produits/` et indiquez-les dans `src/data/produits.ts` :
   `detoure: { recto: "/produits/robe-recto.webp", verso: "/produits/robe-verso.webp" }`.

Sans photo de dos, le bouton « Voir le dos » disparaît. Les photos remplacent aussi les dessins dans le catalogue.

## Générer les visuels avec Grok (démo uniquement)

Le script `scripts/generer_visuels.py` crée avec Grok Imagine toutes les images de la démo et les branche
sur le site, sans code à modifier :

- **photos produits** : vêtement sur cintre (ou sandales à plat), fond retiré, cadré au format du portant
  (`public/produits/`, `src/data/photos-detourees.json`). La face de la 1re couleur est générée, les autres couleurs
  et les dos sont obtenus en **éditant** cette image, pour garder la même coupe ;
- **photos portées** (`--portes`) : la photo produit est éditée pour qu'un mannequin fictif porte l'article.
  Elle apparaît dans la galerie de la fiche et au survol des cartes ;
- **ambiances** (`--ambiances`) : campagne de l'accueil, tuiles des catégories, atelier, boutique, inspirations
  (`public/ambiance/`, `src/data/ambiances.json`).

Tant qu'une image manque, le site affiche un repli soigné (dessin, motif wax) : rien n'est jamais cassé.

**À faire une seule fois** (PowerShell) :

```powershell
py --version                               # Python 3.10 ou plus récent ; sinon l'installer depuis python.org
py -m pip install "rembg[cpu]" pillow      # outil de détourage (télécharge environ 180 Mo au premier usage)
$cle = Read-Host "Clé xAI" -AsSecureString # la clé tapée reste masquée
[Environment]::SetEnvironmentVariable("XAI_API_KEY", [Net.NetworkCredential]::new("", $cle).Password, "User")
```

Fermez puis rouvrez le terminal. Ne collez jamais la clé dans une conversation ni dans un fichier du projet.

**Ensuite**, depuis le dossier `maison-demo`, dans cet ordre :

```powershell
py scripts/generer_visuels.py --essai      # 1 image pour tester, environ 0,04 $
py scripts/generer_visuels.py              # photos produits manquantes, toutes les couleurs
py scripts/generer_visuels.py --portes     # une photo portée par produit, environ 0,06 $ l'unité
py scripts/generer_visuels.py --ambiances  # 10 images d'ambiance, environ 0,40 $
py scripts/generer_visuels.py --dos        # facultatif : les dos des vêtements
py scripts/generer_visuels.py --produit kaftan-homme --refaire          # refaire un produit raté
py scripts/generer_visuels.py --produit foulard-tete-wax --couleur ocre --refaire   # une seule couleur
py scripts/generer_visuels.py --ambiances --nom campagne --refaire     # refaire une ambiance
```

Le script annonce le prix et demande confirmation avant de dépenser. Il ne refait jamais une image existante
sans `--refaire`. Les descriptions sont dans `scripts/visuels.json` (une option `cadre` par produit change la
mise en scène, `cadrage: "centre"` sert aux articles posés à plat), l'historique des prompts dans
`scripts/visuels-journal.json`. Pour retirer une image ratée, supprimez sa ligne dans
`src/data/photos-detourees.json` ou `src/data/ambiances.json` : le repli revient.

**Important :** ces images montrent des vêtements qui n'existent pas. Elles conviennent à Maison Démo, boutique fictive.
Pour la boutique d'un vrai client, les fiches produits doivent montrer les vrais articles (voir « Photos du portant ») :
le client doit recevoir ce qu'il a vu.

## Ce que fait le mode démonstration

- Le paiement Wave ou Orange Money est **simulé** : un bandeau le signale et aucun argent ne circule.
- Le panier et la dernière commande sont gardés dans le navigateur du client.
- La commande WhatsApp, elle, est réelle.

Le paiement réel (Wave Checkout ou agrégateur) demande une route serveur, un webhook signé et une base de données :
la marche à suivre est dans `CLAUDE.md`, section « Paiement réel ».

## Avec Claude Code

- `CLAUDE.md` décrit le projet, ses règles et la marche à suivre pour le paiement réel.
- `.claude/skills/commande-whatsapp/` est le premier skill maison de l'agence.
- `docs/projets-claude.md` donne les instructions à coller dans vos Projets Claude.

## Mise en ligne (Vercel)

1. Code sur GitHub (dépôt **privé**) : `git init`, `git add .`, `git commit -m "…"`, puis `git push`.
   Le `.gitignore` écarte déjà `.env.local`, `node_modules`, `.next` et les images brutes de Grok.
2. Sur vercel.com : « Add New… » → « Project » → importer le dépôt. Next.js est détecté tout seul.
3. Avant le premier déploiement, dans « Environment Variables » :
   - `NEXT_PUBLIC_WHATSAPP_BOUTIQUE` : le numéro qui reçoit les commandes ;
   - `NEXT_PUBLIC_SITE_URL` : l'adresse du site, ex. `https://maison-demo.vercel.app`.
   Ces variables sont figées au moment du build : après une modification, relancez un déploiement (« Redeploy »).
4. Ensuite, chaque `git push` met le site à jour en une minute environ.

`boutique.demonstration` (dans `src/config/boutique.ts`) : `true` pour la démo de l'agence, qui n'est pas référencée
par Google et se partage par lien ; `false` pour un vrai client, dont le site doit apparaître dans les recherches.

Le plan gratuit Hobby de Vercel est réservé à un usage personnel et non commercial. Une démo dont personne ne tire
d'argent y est acceptée ; un site client facturé demande le plan Pro (20 $ par mois) ou un autre hébergeur.
Vérifiez les conditions au moment de la mise en ligne : elles changent.
