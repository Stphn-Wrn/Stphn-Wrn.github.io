// Marche à suivre affichée dans la section Installation, une entrée par plateforme
// (mêmes clés que PLATFORM_STRATEGIES dans app.js). **texte** = libellé d'interface, en gras.

export const INSTALL_GUIDE = {
  foundry: {
    fr: {
      steps: [
        "Sur la carte du module, cliquez sur **Copier** pour copier l'URL du manifest.",
        "Dans l'écran d'accueil de Foundry, ouvrez l'onglet **Modules**, puis **Installer un module**.",
        "Collez l'URL dans le champ **URL du Manifeste**, en bas de la fenêtre, puis cliquez sur **Installer**.",
        "Lancez votre monde, puis **Paramètres de la partie**, **Gestion des modules** : cochez le module et sauvegardez.",
      ],
      note: "Les mises à jour arrivent par Foundry : onglet **Modules**, bouton **Mettre à jour**.",
    },
    en: {
      steps: [
        "On the module's card, click **Copy** to copy the manifest URL.",
        "On Foundry's setup screen, open the **Add-on Modules** tab, then **Install Module**.",
        "Paste the URL into the **Manifest URL** field at the bottom of the window, then click **Install**.",
        "Launch your world, then **Game Settings**, **Manage Modules**: tick the module and save.",
      ],
      note: "Updates come through Foundry: **Add-on Modules** tab, **Update** button.",
    },
  },
  roll20: {
    fr: {
      steps: [
        "Les scripts Mod demandent un abonnement **Pro** sur le compte qui a créé la partie.",
        "Sur la carte du module, téléchargez le fichier **.js**.",
        "Sur la page de la partie, ouvrez **Paramètres**, puis **Scripts Mod (API)**, puis **New Script**.",
        "Collez le contenu du fichier, donnez un nom au script et cliquez sur **Save Script**.",
        "Pour Curse of Strahd: Reloaded pour Roll20, assurez-vous d'exécuter la commande **!cosr import**.",
      ],
      note: "Pour mettre à jour, remplacez le contenu du script par celui de la nouvelle version.",
    },
    en: {
      steps: [
        "Mod scripts need a **Pro** subscription on the account that created the game.",
        "On the module's card, download the **.js** file.",
        "On the game's page, open **Settings**, then **Mod (API) Scripts**, then **New Script**.",
        "Paste the file's content, name the script and click **Save Script**.",
        "For Curse of Strahd: Reloaded for Roll20, make sure to run the **!cosr import** command.",
      ],
      note: "To update, replace the script's content with the new version's.",
    },
  },
};
