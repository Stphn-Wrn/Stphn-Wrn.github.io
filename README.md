# Stphn-Wrn.github.io

[Version française](README.fr.md)

A page gathering my Foundry VTT and Roll20 modules: **https://stphn-wrn.github.io**

## What the page shows

- The modules, sorted by group (Shadow of the Demon Lord, Curse of Strahd, Table tools), in French or English depending on the browser language, with an FR / EN switch.
- For each module: description, features, optional screenshots, current version, links to the source code and the releases.
- Installation for each platform: manifest URL to copy for Foundry, script download buttons for Roll20.

The module list updates itself: on every publish, the **Deploy site** action looks for the repositories with the `courbette-module` topic, reads their `site.json` and generates `catalog.json`. It runs on every push to this repository, every night, and on demand (Actions tab, **Run workflow**). The version, the Foundry compatibility and the Roll20 files are read live by the page, on every visit.

## Adding a module

In the module's repository:

1. Add the `courbette-module` topic (repository page, gear next to **About**, **Topics** field).
2. Add a `site.json` file at the root, on the default branch:

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

- `group`: the `id` of a group in `GROUPS` in `modules.js`.
- `platform`: `foundry` or `roll20`.
- `icon`: a Font Awesome icon (`fa-…`, or `fa-brands …`).
- `order` (optional): position in the group, smallest first; on a tie, alphabetical order of the repository.
- `manifestFile` (optional, Foundry): name of the manifest if it is not `module.json`.
- `images` (optional): screenshots shown as thumbnails in the card, enlarged on click. Each image has a `src` (a path in the module's repository, for example `docs/clocks.png`, or an `https://` URL) and an `alt` in `fr` and `en`, which is also used as the caption:

```json
"images": [
  { "src": "docs/clocks.png", "alt": { "fr": "Trois horloges ouvertes", "en": "Three open clocks" } }
]
```

  Paths are read from the default branch of the module's repository. Recommended format: PNG or WebP, about 1280 px wide, 16:10 (thumbnails are cropped to that ratio), under 300 KB.

The module shows up on the next publish: the following night at the latest, or right away with **Run workflow**. To change its texts, edit its `site.json`. To remove it, remove the topic or archive the repository.

An invalid `site.json` makes the publish fail with the name of the repository and of the faulty field: the live site then stays as it was.

Depending on the platform, the page reads:

- **Foundry**: the manifest on the `main` branch (`version`, `compatibility.minimum`). It is also the URL offered for installation.
- **Roll20**: the latest GitHub release. Each `.js` file attached to it becomes a download button.

The **Installation** section, at the bottom of the page, comes from `install-guide.js`: one entry per platform (`steps` and `note`, in `fr` and `en`); `**text**` is shown in bold.

A new group is added in `GROUPS` (`id`, `icon`, `text.fr` and `text.en` with `title` and `intro`); it also appears in the navigation.

## Adding a platform

Each platform is a strategy in `PLATFORM_STRATEGIES` (`app.js`):

- `icon`: icon of the platform badge;
- `loadMeta(mod)`: returns `{ version, compatibility, ... }`;
- `renderInstall(mod, t)`: builds the card's installation block;
- `fillInstall(card, meta)` (optional): completes that block once the data has loaded.

Also add its steps in `install-guide.js`, its label in `UI.fr` and `UI.en` under the same key as the platform, and its name in `PLATFORMS` (`tools/catalog.mjs`).

## Limits

Live data goes through the visitor's browser. For Roll20, the page queries the GitHub API, limited to 60 requests per hour per IP address without signing in. If the limit is reached or a repository is private, the card is still shown without a version and keeps the link to the releases page.

## Preview and publishing

A static site, with no build step for the page. The page needs a `catalog.json` (not versioned): generate it, then start a local server.

```sh
GITHUB_TOKEN=… node tools/update-catalog.mjs   # the token is optional, it avoids the API limit
python3 -m http.server 8000
```

then open http://localhost:8000. Catalog tests: `node --test "tests/**/*.test.js"`.

Publishing goes through the **Deploy site** action (setting **Settings > Pages > Source: GitHub Actions**).
