import { test } from "node:test";
import assert from "node:assert/strict";
import { describeDependencies, requiredModules } from "../dependencies.js";

test("reads the modules a Foundry manifest requires, with their minimum version", () => {
  const manifest = {
    relationships: {
      systems: [{ id: "demonlord", type: "system" }],
      requires: [{ id: "sodl-trade", type: "module", compatibility: { minimum: "1.2.0" } }, { id: "lib-wrapper", type: "module" }]
    }
  };

  assert.deepEqual(requiredModules(manifest), [{ id: "sodl-trade", minimum: "1.2.0" }, { id: "lib-wrapper", minimum: null }]);
});

test("a manifest without required modules has no dependency", () => {
  assert.deepEqual(requiredModules({ relationships: { systems: [{ id: "demonlord", type: "system" }] } }), []);
  assert.deepEqual(requiredModules({}), []);
  assert.deepEqual(requiredModules(null), []);
});

test("a dependency on this page points to its card, under its title; any other keeps its id", () => {
  const modules = [{ repo: "sodl-trade", text: { fr: { title: "Échanges et artisanat" }, en: { title: "Trades and Crafting" } } }];
  const required = [{ id: "sodl-trade", minimum: "1.2.0" }, { id: "lib-wrapper", minimum: null }];

  assert.deepEqual(describeDependencies(required, modules, "fr"), [
    { id: "sodl-trade", title: "Échanges et artisanat", href: "#sodl-trade", minimum: "1.2.0" },
    { id: "lib-wrapper", title: "lib-wrapper", href: null, minimum: null }
  ]);
});
