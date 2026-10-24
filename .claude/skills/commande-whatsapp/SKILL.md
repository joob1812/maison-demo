---
name: commande-whatsapp
description: Ajoute ou modifie la commande par WhatsApp dans une boutique Next.js de l'agence (liens wa.me, message de commande en français, numéros sénégalais, bouton « Commander sur WhatsApp »). À utiliser dès qu'une demande parle de WhatsApp, de bouton de commande, de message envoyé au commerçant, de récapitulatif de commande ou du numéro de la boutique, même si le mot « skill » n'apparaît pas.
---

# Commande par WhatsApp

## Choix par défaut : liens wa.me

Le client ouvre WhatsApp avec un message déjà rédigé et appuie lui-même sur « Envoyer ».
Aucun compte Meta, aucune vérification, aucun frais. C'est la solution par défaut pour les petits commerces.

## Fonctions existantes (ne pas les recoder ailleurs)

- `src/lib/whatsapp.ts` : `normaliserNumero`, `afficherNumero`, `lienWhatsApp`.
- `src/lib/panier.ts` : `messageProduit`, `messagePanier`, `messageCommande`.
- `src/components/BoutonCommanderWhatsApp.tsx` : bouton désactivé avec explication si le numéro manque.

Un nouveau type de message (réservation, devis couture, commande de repas) s'ajoute dans `src/lib/panier.ts`
ou dans un fichier voisin, sur le même modèle, puis passe par `lienWhatsApp`.

## Format des messages

- Première ligne : `Bonjour {nom de la boutique}, …`.
- Une ligne par article : `• Nom · Couleur · Taille × quantité — prix`.
- Puis livraison, total, et coordonnées du client si elles sont connues.
- Montants avec `formatFCFA`, numéros avec `afficherNumero`.
- Tant que `boutique.modePaiement` vaut `"demo"`, le message le dit : « (paiement de démonstration) ».
- Couture : ajouter les mesures et la date d'essayage souhaitée. Restaurant : plats, options, heure de retrait.

## Numéros

- Sénégal : 9 chiffres commençant par 7 ou 3, indicatif 221. wa.me attend les chiffres seuls, sans « + » ni espaces.
- Le numéro de la boutique vient de `NEXT_PUBLIC_WHATSAPP_BOUTIQUE` dans `.env.local`.
  Ne jamais écrire un numéro réel dans le code ; pour une démo, utiliser le sien.
- Les variables `NEXT_PUBLIC_*` sont figées à la compilation : relancer `npm run dev` ou `npm run build` après un changement.

## Quand proposer l'API WhatsApp Business (Cloud API)

Seulement si le commerçant veut des confirmations automatiques, envoyées sans action du client.
Contraintes à exposer avant toute décision : compte Meta Business, modèles de messages approuvés,
limites d'envoi pour un nouveau compte, facturation par message en EUR ou USD
(Meta a élargi la facturation des messages utilitaires au 1er octobre 2026).
Vérifier les tarifs du moment sur developers.facebook.com et ne rien activer sans l'accord du client.

## Vérifier avant de livrer

1. Le lien commence par `https://wa.me/221` suivi de 9 chiffres, puis `?text=`.
2. Le texte décodé (`decodeURIComponent`) est lisible : accents, puces et montants corrects.
3. Sur un vrai téléphone, le bouton ouvre WhatsApp avec le bon message, vers le bon numéro.
4. Sans numéro configuré, le bouton est désactivé et explique pourquoi.
