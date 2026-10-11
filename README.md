# Stphn-Wrn.github.io

Page qui regroupe mes modules Foundry VTT et Roll20 : **https://stphn-wrn.github.io**

## Ce que montre la page

- Les modules, rangés par groupe (L'Ombre du Seigneur Démon, Curse of Strahd), en français ou en anglais selon la langue du navigateur, avec un bouton FR / EN.
- Pour chaque module : description, fonctionnalités, version actuelle, liens vers le code source et les versions.
- L'installation propre à chaque plateforme : URL du manifest à copier pour Foundry, boutons de téléchargement des scripts pour Roll20.

La version, la compatibilité Foundry et les fichiers Roll20 sont lus en direct sur GitHub : une nouvelle release apparaît sur la page sans la modifier. Les textes, eux, sont écrits dans `modules.js` et sont à mettre à jour quand les fonctionnalités d'un module changent.

## Ajouter un module

Ajouter une entrée dans `MODULES`, dans `modules.js` :

```js
{
  repo: "tarokka-reading",       // nom du dépôt sur github.com/Stphn-Wrn
  group: "strahd",               // id d'un groupe de GROUPS
  platform: "foundry",           // "foundry" ou "roll20"
  icon: "fa-diamond",            // icône Font Awesome (fa-brands ... accepté)
  // manifestFile: "module.json", // Foundry uniquement, si le manifest a un autre nom
  text: {
    fr: { title: "…", summary: "…", features: ["…", "…"] },
    en: { title: "…", summary: "…", features: ["…", "…"] },
  },
},
```

Selon la plateforme, la page lit :

- **Foundry** : le manifest sur la branche `main` (`version`, `compatibility.minimum`). C'est aussi l'URL proposée à l'installation.
- **Roll20** : la dernière release GitHub. Chaque fichier `.js` qui y est joint devient un bouton de téléchargement.

Un nouveau groupe s'ajoute de la même façon dans `GROUPS` (`id`, `icon`, `text.fr` et `text.en` avec `title` et `intro`) ; il apparaît aussi dans la navigation.

## Ajouter une plateforme

Chaque plateforme est une stratégie dans `PLATFORM_STRATEGIES` (`app.js`) :

- `icon` : icône du badge de plateforme ;
- `loadMeta(mod)` : renvoie `{ version, compatibility, ... }` ;
- `renderInstall(mod, t)` : construit le bloc d'installation de la carte ;
- `fillInstall(card, meta)` (facultatif) : complète ce bloc une fois les données chargées.

Ajouter aussi son libellé dans `UI.fr` et `UI.en`, sous la même clé que la plateforme.

## Limites

Les données en direct passent par le navigateur du visiteur. Pour Roll20, la page interroge l'API GitHub, limitée à 60 requêtes par heure et par adresse IP sans connexion. Si la limite est atteinte ou si un dépôt est privé, la carte reste affichée sans version et garde le lien vers la page des versions.

## Aperçu et mise en ligne

Site statique, sans build ni dépendance :

```sh
python3 -m http.server 8000
```

puis ouvrir http://localhost:8000. Un push sur `main` met le site en ligne via GitHub Pages en une minute environ (`.nojekyll` désactive le traitement Jekyll).
