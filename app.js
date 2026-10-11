import { OWNER, GROUPS } from "./modules.js";
import { INSTALL_GUIDE } from "./install-guide.js";

const LANG_KEY = "modules-page-lang";

const UI = {
  fr: {
    tagline: "Modules et outils pour Foundry VTT et Roll20, en français et en anglais.",
    intro: "Tout est gratuit et open source. Chaque carte donne de quoi installer le module ; la marche à suivre est détaillée plus bas.",
    installTitle: "Installation",
    installIntro: "Pas besoin d'aller sur GitHub : tout ce qu'il faut est sur cette page.",
    howToInstall: "Comment installer ?",
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
    catalogError: "Impossible de charger la liste des modules. Réessayez dans un instant.",
    enlarge: "Agrandir : {alt}",
    close: "Fermer",
    previous: "Image précédente",
    next: "Image suivante",
  },
  en: {
    tagline: "Modules and tools for Foundry VTT and Roll20, in English and French.",
    intro: "Everything is free and open source. Each card has what you need to install the module; the steps are below.",
    installTitle: "Installation",
    installIntro: "No need to visit GitHub: everything you need is on this page.",
    howToInstall: "How to install?",
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
    catalogError: "The module list could not be loaded. Please try again in a moment.",
    enlarge: "Enlarge: {alt}",
    close: "Close",
    previous: "Previous image",
    next: "Next image",
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
      box.append(installLabel(t.manifest, t));
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
      box.append(installLabel(t.download, t));
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

function installLabel(text, t) {
  const row = el("div", "install-head");
  const help = el("a", "install-help", t.howToInstall);
  help.href = "#installation";
  row.append(el("span", "install-label", text), help);
  return row;
}

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

function wrapIndex(index, length) {
  return (index + length) % length;
}

function navButton(className, iconName, label) {
  const button = el("button", className);
  button.type = "button";
  button.setAttribute("aria-label", label);
  button.append(icon(iconName));
  return button;
}

let lightbox = null;

function getLightbox() {
  if (lightbox) {
    return lightbox;
  }
  const dialog = el("dialog", "lightbox");
  const close = navButton("lightbox-close", "fa-xmark", "");
  const prev = navButton("lightbox-nav lightbox-prev", "fa-chevron-left", "");
  const next = navButton("lightbox-nav lightbox-next", "fa-chevron-right", "");
  const figure = el("figure");
  const img = el("img");
  const caption = el("figcaption");
  figure.append(img, caption);
  dialog.append(figure, prev, next, close);

  lightbox = { dialog, close, prev, next, img, caption, images: [], index: 0, lang: "fr" };

  close.addEventListener("click", () => dialog.close());
  prev.addEventListener("click", () => showInLightbox(lightbox.index - 1));
  next.addEventListener("click", () => showInLightbox(lightbox.index + 1));
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      showInLightbox(lightbox.index - 1);
    }
    if (event.key === "ArrowRight") {
      showInLightbox(lightbox.index + 1);
    }
  });
  // Un clic sur le fond (hors de l'image) referme, comme Échap.
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });
  document.body.append(dialog);
  return lightbox;
}

function showInLightbox(index) {
  const box = getLightbox();
  box.index = wrapIndex(index, box.images.length);
  const image = box.images[box.index];
  const alt = image.alt[box.lang];
  box.img.src = image.src;
  box.img.alt = alt;
  let caption = alt;
  if (box.images.length > 1) {
    caption = `${box.index + 1} / ${box.images.length} · ${alt}`;
  }
  box.caption.textContent = caption;
}

function openLightbox(images, index, lang) {
  const box = getLightbox();
  const t = UI[lang];
  box.images = images;
  box.lang = lang;
  box.close.setAttribute("aria-label", t.close);
  box.prev.setAttribute("aria-label", t.previous);
  box.next.setAttribute("aria-label", t.next);
  box.prev.hidden = images.length < 2;
  box.next.hidden = images.length < 2;
  showInLightbox(index);
  box.dialog.showModal();
}

// Une image à la fois, en pleine largeur ; flèches et points quand il y en a plusieurs.
function createGallery(images, lang) {
  const t = UI[lang];
  const gallery = el("div", "gallery");
  const stage = el("div", "gallery-stage");
  const open = el("button", "gallery-open");
  open.type = "button";
  const img = el("img");
  img.loading = "lazy";
  img.decoding = "async";
  open.append(img);
  stage.append(open);
  gallery.append(stage);

  let index = 0;
  const dots = [];

  function show(newIndex) {
    index = wrapIndex(newIndex, images.length);
    const alt = images[index].alt[lang];
    img.src = images[index].src;
    img.alt = alt;
    open.setAttribute("aria-label", t.enlarge.replace("{alt}", alt));
    dots.forEach((dot, dotIndex) => {
      dot.setAttribute("aria-current", String(dotIndex === index));
    });
  }

  open.addEventListener("click", () => openLightbox(images, index, lang));

  if (images.length > 1) {
    const prev = navButton("gallery-nav gallery-prev", "fa-chevron-left", t.previous);
    const next = navButton("gallery-nav gallery-next", "fa-chevron-right", t.next);
    prev.addEventListener("click", () => show(index - 1));
    next.addEventListener("click", () => show(index + 1));
    stage.append(prev, next);

    const dotRow = el("div", "gallery-dots");
    images.forEach((image, dotIndex) => {
      const dot = navButton("gallery-dot", "fa-circle", image.alt[lang]);
      dot.addEventListener("click", () => show(dotIndex));
      dots.push(dot);
      dotRow.append(dot);
    });
    gallery.append(dotRow);
  }

  show(0);
  return gallery;
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

  if (mod.images && mod.images.length > 0) {
    card.append(createGallery(mod.images, lang));
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

let MODULES = [];
let catalogLoaded = false;

// catalog.json is generated at deploy time from each repository's site.json.
async function loadCatalog() {
  try {
    const catalog = await fetchJson("catalog.json");
    MODULES = catalog.modules;
    catalogLoaded = true;
  } catch {
    MODULES = [];
  }
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
  const install = el("a", "nav-install");
  install.href = "#installation";
  install.append(icon("fa-download"), el("span", null, UI[lang].installTitle));
  nav.append(install);
  return nav;
}

// "**Copier**" devient <strong>Copier</strong> ; le reste reste du texte.
function richText(tag, text) {
  const node = el(tag);
  text.split("**").forEach((part, index) => {
    if (index % 2 === 1) {
      node.append(el("strong", null, part));
      return;
    }
    node.append(part);
  });
  return node;
}

function createInstallGuide(lang) {
  const t = UI[lang];
  const section = el("section", "group install-guide");
  section.id = "installation";
  const head = el("div", "group-head");
  const title = el("h2");
  title.append(icon("fa-download"), el("span", null, t.installTitle));
  head.append(title, el("p", null, t.installIntro));
  section.append(head);

  const grid = el("div", "guide-grid");
  for (const [platform, guide] of Object.entries(INSTALL_GUIDE)) {
    const text = guide[lang];
    const card = el("article", "guide-card");
    const heading = el("h3");
    heading.append(icon(PLATFORM_STRATEGIES[platform].icon), el("span", null, t[platform]));
    const steps = el("ol", "guide-steps");
    for (const step of text.steps) {
      const item = el("li");
      item.append(richText("span", step));
      steps.append(item);
    }
    const note = richText("p", text.note);
    note.className = "guide-note";
    card.append(heading, steps, note);
    grid.append(card);
  }
  section.append(grid);
  return section;
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

  if (!catalogLoaded) {
    document.querySelector("#nav").replaceChildren();
    document.querySelector("#groups").replaceChildren(el("p", "catalog-error", t.catalogError));
    return;
  }
  document.querySelector("#nav").replaceChildren(createNav(lang));
  document.querySelector("#groups").replaceChildren(
    ...GROUPS.map((group) => createGroupSection(group, lang)),
    createInstallGuide(lang),
  );
}

for (const button of document.querySelectorAll("[data-lang]")) {
  button.addEventListener("click", () => {
    storeLang(button.dataset.lang);
    render(button.dataset.lang);
  });
}

await loadCatalog();
render(initialLang());
