# Stphn-Wrn.github.io

[English version](README.md)

Page qui regroupe mes modules Foundry VTT et Roll20 : **https://stphn-wrn.github.io**

## Ce que montre la page

- Les modules, rangés par groupe (L'Ombre du Seigneur Démon, Curse of Strahd, Outils de table), en français ou en anglais selon la langue du navigateur, avec un bouton FR / EN.
- Pour chaque module : description, fonctionnalités, captures d'écran facultatives, version actuelle, liens vers le code source et les versions.
- L'installation propre à chaque plateforme : URL du manifest à copier pour Foundry, boutons de téléchargement des scripts pour Roll20.

La liste des modules se met à jour toute seule : à chaque publication, l'action **Deploy site** cherche les dépôts qui portent le topic `courbette-module`, lit leur `site.json` et génère `catalog.json`. Elle tourne à chaque push sur ce dépôt, chaque nuit, et à la demande (onglet Actions, **Run workflow**). La version, la compatibilité Foundry et les fichiers Roll20 sont lus en direct par la page, à chaque visite.

## Ajouter un module

Dans le dépôt du module :

1. Ajouter le topic `courbette-module` (page du dépôt, roue dentée à côté de **About**, champ **Topics**).
2. Ajouter un fichier `site.json` à la racine, sur la branche par défaut :

```json
{
  "group": "strahd",
  "platform": "foundry",
  "icon": "fa-diamond",
  "order": 30,
  "text": {
    "fr": { "title": "…", "summary": "…", "features": ["…", "…"] },
    "en": { "title": "…", "summary": "…", "features": ["…", "…"] }
  }
}
```

- `group` : l'`id` d'un groupe de `GROUPS` dans `modules.js`.
- `platform` : `foundry` ou `roll20`.
- `icon` : une icône Font Awesome (`fa-…`, ou `fa-brands …`).
- `order` (facultatif) : position dans le groupe, du plus petit au plus grand ; à égalité, ordre alphabétique du dépôt.
- `manifestFile` (facultatif, Foundry) : nom du manifest s'il ne s'appelle pas `module.json`.
- `images` (facultatif) : captures affichées en vignettes dans la carte, agrandies au clic. Chaque image a un `src` (chemin dans le dépôt du module, par exemple `docs/clocks.png`, ou URL en `https://`) et un `alt` en `fr` et en `en`, qui sert aussi de légende :

```json
"images": [
  { "src": "docs/clocks.png", "alt": { "fr": "Trois horloges ouvertes", "en": "Three open clocks" } }
]
```

  Les chemins sont lus sur la branche par défaut du dépôt du module. Format conseillé : PNG ou WebP, environ 1280 px de large, en 16:10 (les vignettes sont recadrées à ce format), moins de 300 Ko.

Le module apparaît à la publication suivante : au plus tard la nuit suivante, ou tout de suite avec **Run workflow**. Pour changer ses textes, modifier son `site.json`. Pour le retirer, enlever le topic ou archiver le dépôt.

Un `site.json` invalide fait échouer la publication avec le nom du dépôt et du champ en cause : le site en ligne reste alors tel quel.

Selon la plateforme, la page lit :

- **Foundry** : le manifest sur la branche `main` (`version`, `compatibility.minimum`). C'est aussi l'URL proposée à l'installation.
- **Roll20** : la dernière release GitHub. Chaque fichier `.js` qui y est joint devient un bouton de téléchargement.

La section **Installation**, en bas de page, vient de `install-guide.js` : une entrée par plateforme (`steps` et `note`, en `fr` et `en`) ; `**texte**` s'affiche en gras.

Un nouveau groupe s'ajoute dans `GROUPS` (`id`, `icon`, `text.fr` et `text.en` avec `title` et `intro`) ; il apparaît aussi dans la navigation.

## Ajouter une plateforme

Chaque plateforme est une stratégie dans `PLATFORM_STRATEGIES` (`app.js`) :

- `icon` : icône du badge de plateforme ;
- `loadMeta(mod)` : renvoie `{ version, compatibility, ... }` ;
- `renderInstall(mod, t)` : construit le bloc d'installation de la carte ;
- `fillInstall(card, meta)` (facultatif) : complète ce bloc une fois les données chargées.

Ajouter aussi sa marche à suivre dans `install-guide.js`, son libellé dans `UI.fr` et `UI.en`, sous la même clé que la plateforme, et son nom dans `PLATFORMS` (`tools/catalog.mjs`).

## Limites

Les données en direct passent par le navigateur du visiteur. Pour Roll20, la page interroge l'API GitHub, limitée à 60 requêtes par heure et par adresse IP sans connexion. Si la limite est atteinte ou si un dépôt est privé, la carte reste affichée sans version et garde le lien vers la page des versions.

## Aperçu et mise en ligne

Site statique, sans build côté page. La page a besoin d'un `catalog.json` (non versionné) : le générer, puis lancer un serveur local.

```sh
GITHUB_TOKEN=… node tools/update-catalog.mjs   # le token est facultatif, il évite la limite de l'API
python3 -m http.server 8000
```

puis ouvrir http://localhost:8000. Tests du catalogue : `node --test "tests/**/*.test.js"`.

La mise en ligne passe par l'action **Deploy site** (réglage **Settings > Pages > Source : GitHub Actions**).
