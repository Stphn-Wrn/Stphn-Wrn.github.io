// Catalogue des modules affichés sur la page.
// La version et la compatibilité sont lues en direct depuis chaque dépôt (voir app.js) :
// il suffit d'ajouter une entrée ici pour publier un nouveau module.

export const OWNER = "Stphn-Wrn";

export const GROUPS = [
  {
    id: "sodl",
    icon: "fa-skull",
    text: {
      fr: { title: "L'Ombre du Seigneur Démon", intro: "Modules pour le système demonlord de Foundry VTT." },
      en: { title: "Shadow of the Demon Lord", intro: "Modules for the demonlord system on Foundry VTT." },
    },
  },
  {
    id: "strahd",
    icon: "fa-chess-rook",
    text: {
      fr: { title: "Curse of Strahd", intro: "Outils pour mener la campagne en Barovie, quel que soit le système." },
      en: { title: "Curse of Strahd", intro: "Tools for running the Barovia campaign, whatever the system." },
    },
  },
];

export const MODULES = [
  {
    repo: "sodl-custom",
    group: "sodl",
    platform: "foundry",
    icon: "fa-gauge-high",
    text: {
      fr: {
        title: "Compagnon",
        summary: "L'aide de jeu complète pour la table : HUD de combat, réserve de Fortune du groupe et tableau de bord du MJ.",
        features: [
          "HUD de combat personnalisable avec barre de favoris",
          "Réserve de Fortune partagée et aide de jeu consultable",
          "Tableau de bord du groupe et rappels de round pour le MJ",
          "Horloge à dés et lecteur YouTube synchronisé",
        ],
      },
      en: {
        title: "Companion",
        summary: "The all-in-one table helper: combat HUD, shared Fortune pool and GM dashboard.",
        features: [
          "Customisable combat HUD with a favourites bar",
          "Shared Fortune pool and searchable rules reference",
          "Party dashboard and round reminders for the GM",
          "Dice clock and synced YouTube player",
        ],
      },
    },
  },
  {
    repo: "sodl-qol",
    group: "sodl",
    platform: "foundry",
    icon: "fa-screwdriver-wrench",
    text: {
      fr: {
        title: "Améliorations",
        summary: "Corrections et confort de jeu pour le système demonlord sous Foundry v14.",
        features: [
          "Talents appliqués aux attaques et aux sorts, dégâts compris",
          "Faveurs et pénalités lues dans les textes des sorts et talents",
          "Encombrement qui ne se cumule plus",
          "Types d'effets du système rétablis",
        ],
      },
      en: {
        title: "Improvements",
        summary: "Fixes and quality of life for the demonlord system on Foundry v14.",
        features: [
          "Talents applied to weapon and spell attacks, damage included",
          "Boons and banes read from spell and talent texts",
          "Encumbrance no longer stacks",
          "System effect modes restored",
        ],
      },
    },
  },
  {
    repo: "sodl-trade",
    group: "sodl",
    platform: "foundry",
    icon: "fa-right-left",
    text: {
      fr: {
        title: "Échanges",
        summary: "Échanges entre joueurs approuvés par le MJ, butin commun et boutiques.",
        features: [
          "Négociation d'objets et d'argent entre personnages",
          "Butin commun dévoilé au fil de la partie, argent partagé",
          "Boutiques avec prix, disponibilité et stock",
        ],
      },
      en: {
        title: "Trade",
        summary: "GM-approved trades between players, shared loot and shops.",
        features: [
          "Item and money negotiation between characters",
          "Shared loot revealed as you play, money split evenly",
          "Shops with prices, availability and stock",
        ],
      },
    },
  },
  {
    repo: "sodl-traduction-FR",
    group: "sodl",
    platform: "foundry",
    icon: "fa-language",
    text: {
      fr: {
        title: "Traduction FR",
        summary: "Traduction française du compendium du livre de base, via Babele.",
        features: [
          "84 voies",
          "269 talents avec leurs descriptions",
          "339 sorts avec tous leurs champs",
        ],
      },
      en: {
        title: "French translation",
        summary: "French translation of the core book compendium, through Babele.",
        features: [
          "84 paths",
          "269 talents with their descriptions",
          "339 spells with all their fields",
        ],
      },
    },
  },
  {
    repo: "cos-reloaded-importer",
    group: "strahd",
    platform: "foundry",
    icon: "fa-book-open",
    text: {
      fr: {
        title: "Curse of Strahd: Reloaded",
        summary: "Importe le guide de DragnaCarta en journaux structurés et reliés, et les tient à jour.",
        features: [
          "Un journal par arc, une page par section, liens internes résolus",
          "Mise à jour quand le guide évolue, sans écraser vos retouches",
          "Version française complète du guide",
        ],
      },
      en: {
        title: "Curse of Strahd: Reloaded",
        summary: "Imports DragnaCarta's guide into structured, linked journals and keeps them up to date.",
        features: [
          "One journal per arc, one page per section, links resolved",
          "Updates when the guide changes, without overwriting your edits",
          "Full French version of the guide",
        ],
      },
    },
  },
  {
    repo: "cos-reloaded-roll20",
    group: "strahd",
    platform: "roll20",
    icon: "fa-scroll",
    text: {
      fr: {
        title: "Curse of Strahd: Reloaded pour Roll20",
        summary: "Script Mod (API) Roll20 qui importe le guide en handouts reliés.",
        features: [
          "Même conversion que la version Foundry",
          "Script prêt à l'emploi en anglais ou en français",
          "Nécessite Roll20 Pro",
        ],
      },
      en: {
        title: "Curse of Strahd: Reloaded for Roll20",
        summary: "Roll20 Mod (API) script that imports the guide into linked handouts.",
        features: [
          "Same conversion as the Foundry version",
          "Ready-made script in English or French",
          "Requires Roll20 Pro",
        ],
      },
    },
  },
  {
    repo: "tarokka-reading",
    group: "strahd",
    platform: "foundry",
    icon: "fa-diamond",
    text: {
      fr: {
        title: "Tirage du Tarokka",
        summary: "Tirage de Tarokka immersif, révélé carte par carte chez tous les joueurs. Tous systèmes.",
        features: [
          "Tirage préparé ou au hasard",
          "Cartes distribuées face cachée, retournées au rythme du MJ",
          "Cartes personnalisables avec vos propres images",
        ],
      },
      en: {
        title: "Tarokka Reading",
        summary: "Immersive Tarokka reading, revealed card by card for every player. Any system.",
        features: [
          "Prepared or random draw",
          "Cards dealt face down, turned at the GM's pace",
          "Cards customisable with your own images",
        ],
      },
    },
  },
];
