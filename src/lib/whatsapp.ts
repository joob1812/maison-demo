/**
 * Commande par WhatsApp avec des liens wa.me (click-to-chat).
 * Pas de compte Meta, pas de vérification, pas de frais : le client ouvre
 * WhatsApp avec un message déjà rédigé et appuie lui-même sur « Envoyer ».
 *
 * Format attendu par wa.me : chiffres uniquement, indicatif compris, sans « + »,
 * sans espaces ni tirets. Exemple : https://wa.me/221771234567?text=Bonjour
 */

/**
 * Normalise un numéro sénégalais au format international sans « + ».
 * Accepte « 77 123 45 67 », « +221 77 123 45 67 », « 00221771234567 », « 221771234567 ».
 * Renvoie null si le numéro n'est pas un numéro sénégalais valide (9 chiffres commençant par 7 ou 3).
 */
export function normaliserNumero(saisie: string): string | null {
  let chiffres = saisie.replace(/\D/g, "");
  if (chiffres.startsWith("00")) chiffres = chiffres.slice(2);
  if (chiffres.length === 9) chiffres = `221${chiffres}`;
  if (!/^221[37]\d{8}$/.test(chiffres)) return null;
  return chiffres;
}

/** Affiche un numéro normalisé de façon lisible : « 221771234567 » -> « 77 123 45 67 ». */
export function afficherNumero(numeroNormalise: string): string {
  const local = numeroNormalise.startsWith("221") ? numeroNormalise.slice(3) : numeroNormalise;
  const m = local.match(/^(\d{2})(\d{3})(\d{2})(\d{2})$/);
  return m ? `${m[1]} ${m[2]} ${m[3]} ${m[4]}` : local;
}

/**
 * Construit le lien wa.me vers la boutique avec un message pré-rempli.
 * Renvoie null si le numéro de la boutique n'est pas configuré ou invalide :
 * l'interface doit alors désactiver le bouton plutôt que d'envoyer au hasard.
 */
export function lienWhatsApp(numeroBoutique: string, message: string): string | null {
  const numero = normaliserNumero(numeroBoutique);
  if (!numero) return null;
  return `https://wa.me/${numero}?text=${encodeURIComponent(message)}`;
}
