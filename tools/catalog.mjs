// Validation and ordering of the module catalog, built from each repository's site.json.

export const PLATFORMS = ["foundry", "roll20"];
const LANGUAGES = ["fr", "en"];
const DEFAULT_ORDER = 1000;

function fail(repo, field, expected) {
  throw new Error(`${repo}: ${field} must be ${expected}`);
}

function isText(value) {
  return typeof value === "string" && value.trim() !== "";
}

function checkText(repo, text) {
  for (const lang of LANGUAGES) {
    const entry = text?.[lang];
    if (!entry) {
      fail(repo, `text.${lang}`, "an object with title, summary and features");
    }
    for (const field of ["title", "summary"]) {
      if (!isText(entry[field])) {
        fail(repo, `text.${lang}.${field}`, "a non-empty string");
      }
    }
    if (!Array.isArray(entry.features) || !entry.features.every(isText)) {
      fail(repo, `text.${lang}.features`, "a list of non-empty strings");
    }
  }
}

export function parseDescriptor(repo, descriptor, groups) {
  const groupIds = groups.map((group) => group.id);
  if (!groupIds.includes(descriptor.group)) {
    fail(repo, "group", `one of ${groupIds.join(", ")}`);
  }
  if (!PLATFORMS.includes(descriptor.platform)) {
    fail(repo, "platform", `one of ${PLATFORMS.join(", ")}`);
  }
  if (!isText(descriptor.icon) || !descriptor.icon.startsWith("fa-")) {
    fail(repo, "icon", 'a Font Awesome class starting with "fa-"');
  }
  if (descriptor.order !== undefined && typeof descriptor.order !== "number") {
    fail(repo, "order", "a number");
  }
  if (descriptor.manifestFile !== undefined && !isText(descriptor.manifestFile)) {
    fail(repo, "manifestFile", "a file name");
  }
  checkText(repo, descriptor.text);
  return { repo, ...descriptor };
}

export function buildCatalog(entries, groups) {
  if (entries.length === 0) {
    throw new Error("no module found: refusing to publish an empty page");
  }
  const groupRank = (entry) => groups.findIndex((group) => group.id === entry.group);
  const orderOf = (entry) => entry.order ?? DEFAULT_ORDER;
  return [...entries].sort((a, b) => {
    const byGroup = groupRank(a) - groupRank(b);
    if (byGroup !== 0) {
      return byGroup;
    }
    const byOrder = orderOf(a) - orderOf(b);
    if (byOrder !== 0) {
      return byOrder;
    }
    return a.repo.localeCompare(b.repo);
  });
}
