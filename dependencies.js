// The modules a Foundry module needs, read from its manifest (relationships.requires).
// Only modules count: the system is already given by the card's group.
export function requiredModules(manifest) {
  const requires = manifest?.relationships?.requires ?? [];
  return requires
    .filter((relation) => relation.id && (relation.type ?? "module") === "module")
    .map((relation) => ({ id: relation.id, minimum: relation.compatibility?.minimum ?? null }));
}

// A dependency shown on the page links to its card, under its title; any other keeps its id.
export function describeDependencies(required, modules, lang) {
  return required.map((dependency) => {
    const mod = modules.find((entry) => entry.repo === dependency.id);
    if (mod) {
      return { id: dependency.id, title: mod.text[lang].title, href: `#${mod.repo}`, minimum: dependency.minimum };
    }
    return { id: dependency.id, title: dependency.id, href: null, minimum: dependency.minimum };
  });
}
