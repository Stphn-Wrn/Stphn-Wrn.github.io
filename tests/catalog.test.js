import { test } from "node:test";
import assert from "node:assert/strict";
import { buildCatalog, parseDescriptor } from "../tools/catalog.mjs";

function groups() {
  return [{ id: "sodl" }, { id: "strahd" }];
}

function descriptor(overrides = {}) {
  return {
    group: "strahd",
    platform: "foundry",
    icon: "fa-diamond",
    text: {
      fr: { title: "Tirage", summary: "Résumé", features: ["Un"] },
      en: { title: "Reading", summary: "Summary", features: ["One"] }
    },
    ...overrides
  };
}

test("turns a repository's site.json into a catalog entry named after the repository", () => {
  const entry = parseDescriptor("tarokka-reading", descriptor({ order: 30 }), groups());

  assert.deepEqual(entry, { repo: "tarokka-reading", order: 30, ...descriptor() });
});

test("keeps the optional manifest file name of Foundry modules", () => {
  const entry = parseDescriptor("sodl-qol", descriptor({ manifestFile: "module-v14.json" }), groups());

  assert.equal(entry.manifestFile, "module-v14.json");
});

test("rejects descriptors the page could not display, naming the repository and the field", () => {
  const cases = [
    [descriptor({ group: "nope" }), /tarokka-reading: group/],
    [descriptor({ platform: "fantasy-grounds" }), /tarokka-reading: platform/],
    [descriptor({ icon: "diamond" }), /tarokka-reading: icon/],
    [descriptor({ order: "first" }), /tarokka-reading: order/],
    [descriptor({ text: { fr: descriptor().text.fr } }), /tarokka-reading: text\.en/],
    [descriptor({ text: { ...descriptor().text, en: { title: "x", summary: "y", features: "z" } } }), /tarokka-reading: text\.en\.features/]
  ];

  for (const [input, message] of cases) {
    assert.throws(() => parseDescriptor("tarokka-reading", input, groups()), message);
  }
});

test("sorts the catalog by group, then order, then repository name", () => {
  const entries = [
    { repo: "tarokka-reading", group: "strahd", order: 30 },
    { repo: "cos-reloaded-roll20", group: "strahd", order: 20 },
    { repo: "sodl-trade", group: "sodl" },
    { repo: "sodl-custom", group: "sodl", order: 10 },
    { repo: "cos-reloaded-importer", group: "strahd", order: 20 }
  ];

  const catalog = buildCatalog(entries, groups());

  assert.deepEqual(
    catalog.map((entry) => entry.repo),
    ["sodl-custom", "sodl-trade", "cos-reloaded-importer", "cos-reloaded-roll20", "tarokka-reading"]
  );
});

test("refuses an empty catalog rather than publishing a page without modules", () => {
  assert.throws(() => buildCatalog([], groups()), /no module/);
});
