#!/usr/bin/env python3
"""
Génère les visuels de démonstration avec Grok Imagine (xAI).

Trois familles d'images :
  1. Les photos produits détourées (portant, fiches) : la face de la 1re couleur est générée,
     les autres couleurs et les dos sont obtenus en ÉDITANT cette image (même coupe, même cintre).
  2. Les photos portées (--portes) : la photo produit est éditée pour qu'un mannequin fictif la porte.
  3. Les images d'ambiance (--ambiances) : campagne, catégories, atelier, boutique, inspirations.

  py scripts/generer_visuels.py --essai               1 image pour tester, environ 0,04 $
  py scripts/generer_visuels.py                       photos produits manquantes, toutes les couleurs
  py scripts/generer_visuels.py --dos                 ajoute aussi les dos
  py scripts/generer_visuels.py --portes              photos portées (une par produit)
  py scripts/generer_visuels.py --ambiances           images d'ambiance du site
  py scripts/generer_visuels.py --produit kaftan-homme --refaire
  py scripts/generer_visuels.py --produit foulard-tete-wax --couleur ocre --refaire
  py scripts/generer_visuels.py --ambiances --nom campagne --refaire
  py scripts/generer_visuels.py --detourer            refait seulement détourage et compression (gratuit)

Le coût est toujours annoncé avant de dépenser, avec une confirmation.

Prérequis (une seule fois) :
  py -m pip install "rembg[cpu]" pillow
  La clé dans la variable d'environnement XAI_API_KEY. Ne jamais écrire la clé dans un fichier.

Descriptions : scripts/visuels.json. Images : public/produits/ et public/ambiance/.
Le site lit src/data/photos-detourees.json et src/data/ambiances.json, mis à jour à chaque image réussie.
"""

import argparse
import base64
import datetime
import io
import json
import os
import sys
import urllib.error
import urllib.request
from pathlib import Path

RACINE = Path(__file__).resolve().parent.parent
CONFIG = RACINE / "scripts" / "visuels.json"
BRUTS = RACINE / "scripts" / "visuels-bruts"
PUBLIC = RACINE / "public" / "produits"
PUBLIC_AMBIANCE = RACINE / "public" / "ambiance"
MANIFESTE = RACINE / "src" / "data" / "photos-detourees.json"
MANIFESTE_AMBIANCES = RACINE / "src" / "data" / "ambiances.json"
JOURNAL = RACINE / "scripts" / "visuels-journal.json"
API = "https://api.x.ai/v1"
LARGEUR, HAUTEUR = 750, 1200  # format 5:8 du portant


class ErreurApi(Exception):
    def __init__(self, code, message):
        super().__init__(f"xAI {code} : {message}")
        self.code = code
        self.message = message


# ---------- Fichiers ----------


def lire_json(chemin, defaut):
    try:
        return json.loads(chemin.read_text(encoding="utf-8"))
    except FileNotFoundError:
        return defaut


def ecrire_json(chemin, valeur):
    chemin.parent.mkdir(parents=True, exist_ok=True)
    chemin.write_text(json.dumps(valeur, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def nom_fichier(slug, couleur, face):
    return f"{slug}-{couleur}-{face}"


# ---------- API xAI ----------


def cle_api():
    cle = os.environ.get("XAI_API_KEY")
    if not cle:
        sys.exit(
            "Clé XAI_API_KEY introuvable.\n"
            "Enregistrez-la comme variable d'environnement, puis fermez et rouvrez le terminal."
        )
    return cle


def appeler(chemin, corps):
    requete = urllib.request.Request(
        API + chemin,
        data=json.dumps(corps).encode(),
        method="POST",
        headers={"Authorization": f"Bearer {cle_api()}", "Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(requete, timeout=300) as reponse:
            return json.load(reponse)
    except urllib.error.HTTPError as e:
        raise ErreurApi(e.code, e.read().decode(errors="replace")[:800])
    except urllib.error.URLError as e:
        raise ErreurApi(0, f"connexion impossible ({e.reason})")


def octets_image(reponse):
    donnee = (reponse.get("data") or [{}])[0]
    if donnee.get("b64_json"):
        return base64.b64decode(donnee["b64_json"])
    if donnee.get("url"):  # URL temporaire : on télécharge tout de suite
        with urllib.request.urlopen(donnee["url"], timeout=120) as r:
            return r.read()
    raise ErreurApi(0, "réponse sans image : " + json.dumps(reponse)[:400])


def generer(modele, prompt, format_image="2:3"):
    corps = {
        "model": modele,
        "prompt": prompt,
        "aspect_ratio": format_image,
        "resolution": "1k",
        "n": 1,
        "response_format": "b64_json",
    }
    return octets_image(appeler("/images/generations", corps))


def editer(modele, source_png, prompt):
    uri = "data:image/png;base64," + base64.b64encode(source_png).decode()
    corps = {
        "model": modele,
        "prompt": prompt,
        "image": {"url": uri, "type": "image_url"},
        "response_format": "b64_json",
    }
    try:
        return octets_image(appeler("/images/edits", corps))
    except ErreurApi as e:
        # Si l'édition n'accepte pas response_format, on redemande une URL.
        if e.code == 400 and "response_format" in e.message:
            corps.pop("response_format")
            return octets_image(appeler("/images/edits", corps))
        raise


# ---------- Traitement des images ----------

_session = None
MODELE_DETOURAGE = "isnet-general-use"


def modele_detourage_present():
    """Vrai si le modèle de détourage a déjà été téléchargé (emplacements actuels et anciens de rembg)."""
    fichier = f"{MODELE_DETOURAGE}.onnx"
    xdg = os.getenv("XDG_DATA_HOME")
    racines = [Path(os.environ[v]).expanduser() for v in ("REMBG_HOME", "U2NET_HOME") if os.getenv(v)]
    racines.append(Path(xdg) / "rembg" if xdg else Path.home() / ".rembg")
    racines.append(Path(xdg or Path.home()) / ".u2net")
    return any((r / "models" / MODELE_DETOURAGE / fichier).exists() or (r / fichier).exists() for r in racines)


def verifier_dependances(detourage):
    try:
        import numpy  # noqa: F401
        from PIL import Image  # noqa: F401

        if detourage:
            from rembg import new_session, remove  # noqa: F401
    except ImportError:
        sys.exit("Il manque des outils. Lancez une fois :  py -m pip install \"rembg[cpu]\" pillow")


def en_png(octets):
    from PIL import Image

    image = Image.open(io.BytesIO(octets)).convert("RGB")
    tampon = io.BytesIO()
    image.save(tampon, "PNG")
    return tampon.getvalue()


def detourer(brut, sortie, cadrage="crochet"):
    """
    Retire le fond, recadre sur l'article et le place sur un canevas 5:8.
    cadrage "crochet" : crochet du cintre en haut au centre (articles suspendus au portant).
    cadrage "centre"  : article centré avec une marge (chaussures posées à plat).
    """
    import numpy as np
    from PIL import Image
    from rembg import new_session, remove

    global _session
    if _session is None:
        if not modele_detourage_present():
            print("  (première utilisation : téléchargement du modèle de détourage, environ 180 Mo)", flush=True)
        _session = new_session(MODELE_DETOURAGE)

    decoupe = remove(Image.open(brut).convert("RGBA"), session=_session)
    alpha = np.array(decoupe.getchannel("A"))
    alpha[alpha < 16] = 0  # supprime le halo presque transparent
    decoupe.putalpha(Image.fromarray(alpha))

    boite = decoupe.getchannel("A").getbbox()
    if not boite:
        raise RuntimeError("le détourage n'a rien gardé")
    decoupe = decoupe.crop(boite)
    alpha = np.array(decoupe.getchannel("A"))
    largeur, hauteur = decoupe.size

    if cadrage == "centre":
        marge = 0.1
        h_toile = int(max(hauteur / (1 - 2 * marge), (largeur / (1 - 2 * marge)) * 8 / 5))
        l_toile = int(h_toile * 5 / 8)
        position = ((l_toile - largeur) // 2, (h_toile - hauteur) // 2)
    else:
        # Position du crochet : centre des pixels opaques tout en haut.
        haut = alpha[: max(2, hauteur // 40)]
        xs = np.nonzero(haut > 64)[1]
        crochet = int(xs.mean()) if xs.size else largeur // 2
        demi = max(crochet, largeur - crochet)  # demi-largeur nécessaire autour du crochet
        marge_haut, marge_bas, marge_cote = 0.012, 0.02, 0.04
        h_toile = int(max(hauteur / (1 - marge_haut - marge_bas), (2 * demi / (1 - 2 * marge_cote)) * 8 / 5))
        l_toile = int(h_toile * 5 / 8)
        position = (l_toile // 2 - crochet, int(h_toile * marge_haut))

    toile = Image.new("RGBA", (l_toile, h_toile), (0, 0, 0, 0))
    toile.paste(decoupe, position, decoupe)
    toile = toile.resize((LARGEUR, HAUTEUR), Image.LANCZOS)
    sortie.parent.mkdir(parents=True, exist_ok=True)
    toile.save(sortie, "WEBP", quality=86, method=6)


def compresser(brut, sortie, cote_max):
    """Image d'ambiance : redimensionnée (plus grand côté = cote_max) et compressée en WebP, sans détourage."""
    from PIL import Image

    image = Image.open(brut).convert("RGB")
    image.thumbnail((cote_max, cote_max), Image.LANCZOS)
    sortie.parent.mkdir(parents=True, exist_ok=True)
    image.save(sortie, "WEBP", quality=80, method=6)


# ---------- Plan de travail ----------
# Chaque tâche : nom, libellé, mode ("generation" ou "edition"), prompt, format, source (édition),
# brut (PNG d'origine), sortie (WebP publié), traiter(brut, sortie) et enregistrer().


def taches_produits(config, args, manifeste):
    taches = []
    for slug, produit in config["produits"].items():
        if args.produit and slug != args.produit:
            continue
        couleurs = list(produit["couleurs"])
        cadre = produit.get("cadre", config["cadre"])
        cadrage = produit.get("cadrage", "crochet")
        faces = ["recto", "verso"] if args.dos and produit.get("dos") else ["recto"]
        for i, couleur in enumerate(couleurs):
            if args.couleur and couleur != args.couleur:
                continue
            for face in faces:
                nom = nom_fichier(slug, couleur, face)
                if face == "recto" and i == 0:
                    mode, source = "generation", None
                    prompt = f"{config['debut']} {produit['vetement']} Fabric or material: {produit['couleurs'][couleur]}. {cadre}"
                elif face == "recto":
                    mode, source = "edition", BRUTS / f"{nom_fichier(slug, couleurs[0], 'recto')}.png"
                    prompt = (
                        "Keep exactly the same item, cut, shape, folds, hanger or support, camera angle, framing, "
                        f"lighting and background. Change only the fabric or material to: {produit['couleurs'][couleur]}. "
                        f"{config['interdits']}"
                    )
                else:
                    mode, source = "edition", BRUTS / f"{nom_fichier(slug, couleur, 'recto')}.png"
                    prompt = (
                        "Show the back of this exact same garment, hanging on the same hanger in the same position, "
                        "with the same fabric and colours, the same framing, lighting and background. "
                        f"{produit['dos']} {config['interdits']}"
                    )

                def enregistrer(slug=slug, couleur=couleur, face=face, nom=nom):
                    # Le site n'utilise un dos que si la face de la même couleur existe.
                    manifeste.setdefault(slug, {}).setdefault(couleur, {})[face] = f"/produits/{nom}.webp"
                    ecrire_json(MANIFESTE, manifeste)

                taches.append({
                    "nom": nom,
                    "libelle": f"{slug} · {couleur} · {'face' if face == 'recto' else 'dos'}",
                    "mode": mode,
                    "prompt": prompt,
                    "format": "2:3",
                    "source": source,
                    "brut": BRUTS / f"{nom}.png",
                    "sortie": PUBLIC / f"{nom}.webp",
                    "traiter": lambda brut, sortie, cadrage=cadrage: detourer(brut, sortie, cadrage),
                    "enregistrer": enregistrer,
                    "detourage": True,
                })
    return taches


def taches_portes(config, args, ambiances):
    reglages = config["portes"]
    taches = []
    for slug, produit in config["produits"].items():
        if args.produit and slug != args.produit:
            continue
        if not produit.get("porte"):
            continue
        couleur = next(iter(produit["couleurs"]))
        nom = f"porte-{slug}"

        def enregistrer(nom=nom):
            ambiances[nom] = f"/ambiance/{nom}.webp"
            ecrire_json(MANIFESTE_AMBIANCES, ambiances)

        taches.append({
            "nom": nom,
            "libelle": f"{slug} · porté",
            "mode": "edition",
            "prompt": f"{reglages['debut']} {produit['porte']} {reglages['fin']}",
            "format": "2:3",
            "source": BRUTS / f"{nom_fichier(slug, couleur, 'recto')}.png",
            "brut": BRUTS / "ambiance" / f"{nom}.png",
            "sortie": PUBLIC_AMBIANCE / f"{nom}.webp",
            "traiter": lambda brut, sortie: compresser(brut, sortie, reglages["cote_max"]),
            "enregistrer": enregistrer,
            "detourage": False,
        })
    return taches


def taches_ambiances(config, args, ambiances):
    reglages = config["ambiances"]
    taches = []
    for nom, image in reglages["images"].items():
        if args.nom and nom != args.nom:
            continue

        def enregistrer(nom=nom):
            ambiances[nom] = f"/ambiance/{nom}.webp"
            ecrire_json(MANIFESTE_AMBIANCES, ambiances)

        taches.append({
            "nom": nom,
            "libelle": f"ambiance · {nom}",
            "mode": "generation",
            "prompt": f"{image['prompt']} {reglages['fin']}",
            "format": image["format"],
            "source": None,
            "brut": BRUTS / "ambiance" / f"{nom}.png",
            "sortie": PUBLIC_AMBIANCE / f"{nom}.webp",
            "traiter": lambda brut, sortie, cote=image.get("cote_max", reglages["cote_max"]): compresser(brut, sortie, cote),
            "enregistrer": enregistrer,
            "detourage": False,
        })
    return taches


# ---------- Exécution ----------


def main():
    parser = argparse.ArgumentParser(description="Visuels de démonstration avec Grok Imagine")
    parser.add_argument("--essai", action="store_true", help="une seule image pour tester")
    parser.add_argument("--dos", action="store_true", help="générer aussi les dos des vêtements")
    parser.add_argument("--portes", action="store_true", help="photos portées par un mannequin fictif")
    parser.add_argument("--ambiances", action="store_true", help="images d'ambiance du site")
    parser.add_argument("--produit", help="un seul produit (slug)")
    parser.add_argument("--couleur", help="une seule couleur du produit (avec --produit), ex. ocre")
    parser.add_argument("--nom", help="une seule image d'ambiance (ex. campagne)")
    parser.add_argument("--refaire", action="store_true", help="refaire même si l'image existe déjà")
    parser.add_argument("--detourer", action="store_true", help="retraiter les images déjà générées (gratuit)")
    parser.add_argument("--oui", action="store_true", help="ne pas demander de confirmation")
    args = parser.parse_args()

    config = lire_json(CONFIG, None) or sys.exit(f"Fichier introuvable : {CONFIG}")
    if args.produit and args.produit not in config["produits"]:
        sys.exit(f"Produit inconnu : {args.produit}. Choix : {', '.join(config['produits'])}")
    if args.couleur and not args.produit:
        sys.exit("--couleur s'utilise avec --produit, ex. --produit foulard-tete-wax --couleur ocre")
    if args.couleur and args.couleur not in config["produits"][args.produit]["couleurs"]:
        couleurs = ", ".join(config["produits"][args.produit]["couleurs"])
        sys.exit(f"Couleur inconnue pour {args.produit} : {args.couleur}. Choix : {couleurs}")
    if args.nom and args.nom not in config["ambiances"]["images"]:
        sys.exit(f"Ambiance inconnue : {args.nom}. Choix : {', '.join(config['ambiances']['images'])}")

    manifeste = lire_json(MANIFESTE, {})
    ambiances = lire_json(MANIFESTE_AMBIANCES, {})
    journal = lire_json(JOURNAL, [])
    modele = config["modele"]
    prix = config["prix_estime_usd"]

    if args.ambiances:
        taches = taches_ambiances(config, args, ambiances)
    elif args.portes:
        taches = taches_portes(config, args, ambiances)
    else:
        taches = taches_produits(config, args, manifeste)
    if args.essai:
        taches = taches[:1]

    print("Chargement des outils… (1 à 2 minutes la toute première fois)", flush=True)
    verifier_dependances(any(t["detourage"] for t in taches))

    # Mode gratuit : on retravaille les images brutes existantes.
    if args.detourer:
        for t in taches:
            if t["brut"].exists():
                t["traiter"](t["brut"], t["sortie"])
                t["enregistrer"]()
                print("ok", t["brut"].name, flush=True)
        return

    a_faire = []
    for t in taches:
        if t["sortie"].exists() and not args.refaire:
            continue
        t["payant"] = args.refaire or not t["brut"].exists()
        a_faire.append(t)

    if not a_faire:
        print("Rien à faire : toutes les images demandées existent déjà (--refaire pour les régénérer).")
        return

    payants = [t for t in a_faire if t["payant"]]
    cout = sum(prix[t["mode"]] for t in payants)
    print(f"{len(a_faire)} image(s) à préparer, dont {len(payants)} appel(s) payant(s) à Grok : environ {cout:.2f} $.")
    for t in a_faire:
        print(f"  - {t['libelle']}{'' if t['payant'] else ' (déjà générée, traitement seulement)'}")
    if len(payants) > 1 and not args.oui:
        if input("Continuer ? (o/N) ").strip().lower() not in ("o", "oui", "y", "yes"):
            print("Annulé, rien n'a été dépensé.")
            return

    depense = 0.0
    reussies = 0
    for t in a_faire:
        print(f"> {t['nom']}", flush=True)
        try:
            if t["payant"]:
                if t["mode"] == "edition" and not t["source"].exists():
                    print(f"  ignoré : il faut d'abord la photo de départ ({t['source'].name}).")
                    print("  Lancez d'abord le script sans option pour générer les photos produits.")
                    continue
                print("  Grok crée l'image… (10 à 40 s)", flush=True)
                if t["mode"] == "generation":
                    octets = generer(modele, t["prompt"], t["format"])
                else:
                    octets = editer(modele, t["source"].read_bytes(), t["prompt"])
                depense += prix[t["mode"]]
                t["brut"].parent.mkdir(parents=True, exist_ok=True)
                t["brut"].write_bytes(en_png(octets))
                journal.append({
                    "date": datetime.datetime.now().isoformat(timespec="seconds"),
                    "fichier": t["nom"], "mode": t["mode"], "modele": modele, "prompt": t["prompt"],
                    "genere_par_ia": True,
                })
                ecrire_json(JOURNAL, journal)
            print("  détourage et cadrage…" if t["detourage"] else "  compression…", flush=True)
            t["traiter"](t["brut"], t["sortie"])
            t["enregistrer"]()
            reussies += 1
            print(f"  ok : {t['sortie'].relative_to(RACINE).as_posix()}", flush=True)
        except ErreurApi as e:
            print(f"  échec : {e}")
            if e.code in (401, 403):
                sys.exit("Clé refusée : vérifiez XAI_API_KEY sur console.x.ai.")
            if e.code in (402, 429):
                sys.exit("Crédits épuisés ou trop de requêtes : vérifiez votre solde sur console.x.ai.")
        except RuntimeError as e:
            print(f"  traitement impossible : {e}")

    print(f"Terminé : {reussies} image(s). Dépense estimée : {depense:.2f} $.")
    print("Si le site tourne déjà, arrêtez-le (Ctrl+C) puis relancez `npm run dev`.")


if __name__ == "__main__":
    main()
