// Groupes affichés sur la page. Les modules eux-mêmes viennent de catalog.json,
// généré à la publication depuis le site.json de chaque dépôt (voir tools/update-catalog.mjs).

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
