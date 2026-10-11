import { OWNER, GROUPS, MODULES } from "./modules.js";

const LANG_KEY = "modules-page-lang";

const UI = {
  fr: {
    tagline: "Modules et outils pour Foundry VTT et Roll20, en français et en anglais.",
    intro: "Tout est gratuit et open source. Pour installer un module Foundry, copiez l'URL de son manifest dans Foundry : Modules, Installer un module, puis Manifest.",
    manifest: "URL du manifest",
    copy: "Copier",
    copied: "Copié",
    download: "Télécharger",
    source: "Code source",
    releases: "Versions",
    foundry: "Foundry VTT",
    roll20: "Roll20",
    compat: "Foundry",
    latest: "Dernière version",
    loading: "Chargement…",
    footer: "Fait par Courbette. Un problème ou une idée ? Ouvrez une issue sur le dépôt du module.",
  },
  en: {
    tagline: "Modules and tools for Foundry VTT and Roll20, in English and French.",
    intro: "Everything is free and open source. To install a Foundry module, paste its manifest URL in Foundry: Add-on Modules, Install Module, then Manifest URL.",
    manifest: "Manifest URL",
    copy: "Copy",
    copied: "Copied",
    download: "Download",
    source: "Source code",
    releases: "Releases",
    foundry: "Foundry VTT",
    roll20: "Roll20",
    compat: "Foundry",
    latest: "Latest version",
    loading: "Loading…",
    footer: "Made by Courbette. Found a bug or have an idea? Open an issue on the module's repository.",
  },
};

const repoUrl = (mod) => `https://github.com/${OWNER}/${mod.repo}`;

// Strategy : chaque plateforme sait lire ses métadonnées et proposer son installation.
const PLATFORM_STRATEGIES = {
  foundry: {
    icon: "fa-dice-d20",
    manifestUrl(mod) {
      let file = "module.json";
      if (mod.manifestFile) {
        file = mod.manifestFile;
      }
      return `https://raw.githubusercontent.com/${OWNER}/${mod.repo}/main/${file}`;
    },
    async loadMeta(mod) {
      const manifest = await fetchJson(this.manifestUrl(mod));
      const compat = manifest.compatibility || {};
      let compatibility = null;
      if (compat.minimum) {
        compatibility = `v${Math.floor(Number(compat.minimum))}+`;
      }
      return { version: manifest.version, compatibility };
    },
    renderInstall(mod, t) {
      const url = this.manifestUrl(mod);
      const box = el("div", "install");
      box.append(el("span", "install-label", t.manifest));
      const row = el("div", "install-row");
      const code = el("code", "install-url", url);
      const button = el("button", "copy-button");
      button.type = "button";
      setButtonLabel(button, "fa-copy", t.copy);
      button.addEventListener("click", () => copyToClipboard(url, button, t));
      row.append(code, button);
      box.append(row);
      return box;
    },
  },
  roll20: {
    icon: "fa-dice",
    async loadMeta(mod) {
      const release = await fetchJson(`https://api.github.com/repos/${OWNER}/${mod.repo}/releases/latest`);
      const assets = release.assets.filter((asset) => asset.name.endsWith(".js"));
      return { version: release.tag_name.replace(/^v/, ""), compatibility: null, assets };
    },
    renderInstall(mod, t) {
      const box = el("div", "install");
      box.append(el("span", "install-label", t.download));
      const row = el("div", "install-row install-downloads");
      row.append(linkButton(`${repoUrl(mod)}/releases/latest`, "fa-download", t.releases));
      box.append(row);
      return box;
    },
    fillInstall(card, meta) {
      const row = card.querySelector(".install-downloads");
      if (!row || !meta.assets || meta.assets.length === 0) {
        return;
      }
      row.replaceChildren(
        ...meta.assets.map((asset) => linkButton(asset.browser_download_url, "fa-download", asset.name)),
      );
    },
  },
};

const metaCache = new Map();

function loadMeta(mod) {
  if (!metaCache.has(mod.repo)) {
    const strategy = PLATFORM_STRATEGIES[mod.platform];
    metaCache.set(mod.repo, strategy.loadMeta(mod).catch(() => null));
  }
  return metaCache.get(mod.repo);
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${response.status} ${url}`);
  }
  return response.json();
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) {
    node.className = className;
  }
  if (text !== undefined) {
    node.textContent = text;
  }
  return node;
}

function icon(name) {
  let className = `fa-solid ${name}`;
  if (name.startsWith("fa-brands")) {
    className = name;
  }
  const node = el("i", className);
  node.setAttribute("aria-hidden", "true");
  return node;
}

function setButtonLabel(button, iconName, label) {
  button.replaceChildren(icon(iconName), el("span", null, label));
}

function linkButton(href, iconName, label) {
  const link = el("a", "button-link");
  link.href = href;
  link.rel = "noopener";
  setButtonLabel(link, iconName, label);
  return link;
}

async function copyToClipboard(text, button, t) {
  try {
    await navigator.clipboard.writeText(text);
    setButtonLabel(button, "fa-check", t.copied);
    button.classList.add("is-done");
  } catch {
    window.prompt(t.manifest, text);
    return;
  }
  setTimeout(() => {
    setButtonLabel(button, "fa-copy", t.copy);
    button.classList.remove("is-done");
  }, 1800);
}

// Factory : construit la carte d'un module à partir de son entrée du catalogue.
function createModuleCard(mod, lang) {
  const t = UI[lang];
  const text = mod.text[lang];
  const strategy = PLATFORM_STRATEGIES[mod.platform];

  const card = el("article", "card");
  card.id = mod.repo;

  const head = el("header", "card-head");
  const badge = el("div", "card-icon");
  badge.append(icon(mod.icon));
  const titles = el("div", "card-titles");
  titles.append(el("h3", null, text.title));
  const tags = el("div", "tags");
  const platformTag = el("span", "tag");
  platformTag.append(icon(strategy.icon), el("span", null, t[mod.platform]));
  const versionTag = el("span", "tag tag-version", t.loading);
  tags.append(platformTag, versionTag);
  titles.append(tags);
  head.append(badge, titles);
  card.append(head);

  card.append(el("p", "summary", text.summary));

  if (text.features.length > 0) {
    const list = el("ul", "features");
    for (const feature of text.features) {
      list.append(el("li", null, feature));
    }
    card.append(list);
  }

  card.append(strategy.renderInstall(mod, t));

  const links = el("footer", "card-links");
  links.append(
    linkButton(repoUrl(mod), "fa-brands fa-github", t.source),
    linkButton(`${repoUrl(mod)}/releases`, "fa-tags", t.releases),
  );
  card.append(links);

  loadMeta(mod).then((meta) => {
    if (!meta) {
      versionTag.remove();
      return;
    }
    let label = `v${meta.version}`;
    if (meta.compatibility) {
      label = `${label} · ${t.compat} ${meta.compatibility}`;
    }
    versionTag.textContent = label;
    versionTag.title = t.latest;
    if (strategy.fillInstall) {
      strategy.fillInstall(card, meta);
    }
  });

  return card;
}

function createGroupSection(group, lang) {
  const text = group.text[lang];
  const section = el("section", "group");
  section.id = group.id;
  const head = el("div", "group-head");
  const title = el("h2");
  title.append(icon(group.icon), el("span", null, text.title));
  head.append(title, el("p", null, text.intro));
  section.append(head);

  const grid = el("div", "grid");
  for (const mod of MODULES.filter((entry) => entry.group === group.id)) {
    grid.append(createModuleCard(mod, lang));
  }
  section.append(grid);
  return section;
}

function createNav(lang) {
  const nav = el("nav", "group-nav");
  for (const group of GROUPS) {
    const link = el("a", null, group.text[lang].title);
    link.href = `#${group.id}`;
    nav.append(link);
  }
  return nav;
}

function readStoredLang() {
  try {
    return localStorage.getItem(LANG_KEY);
  } catch {
    return null;
  }
}

function storeLang(lang) {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {
    // Stockage indisponible : la langue ne sera simplement pas mémorisée.
  }
}

function initialLang() {
  const stored = readStoredLang();
  if (stored && UI[stored]) {
    return stored;
  }
  if (navigator.language.toLowerCase().startsWith("fr")) {
    return "fr";
  }
  return "en";
}

function render(lang) {
  const t = UI[lang];
  document.documentElement.lang = lang;
  document.querySelector("[data-i18n=tagline]").textContent = t.tagline;
  document.querySelector("[data-i18n=intro]").textContent = t.intro;
  document.querySelector("[data-i18n=footer]").textContent = t.footer;

  for (const button of document.querySelectorAll("[data-lang]")) {
    button.setAttribute("aria-pressed", String(button.dataset.lang === lang));
  }

  document.querySelector("#nav").replaceChildren(createNav(lang));
  document.querySelector("#groups").replaceChildren(...GROUPS.map((group) => createGroupSection(group, lang)));
}

for (const button of document.querySelectorAll("[data-lang]")) {
  button.addEventListener("click", () => {
    storeLang(button.dataset.lang);
    render(button.dataset.lang);
  });
}

render(initialLang());
