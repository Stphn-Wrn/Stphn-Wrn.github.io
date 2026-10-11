// Builds catalog.json from the site.json of every repository tagged with the TOPIC topic.
// Run by the deploy workflow; set GITHUB_TOKEN to avoid the anonymous API rate limit.
//
//   node tools/update-catalog.mjs
import { writeFile } from "node:fs/promises";
import { GROUPS, OWNER } from "../modules.js";
import { buildCatalog, parseDescriptor } from "./catalog.mjs";

const TOPIC = "courbette-module";
const OUTPUT = new URL("../catalog.json", import.meta.url);

function apiHeaders() {
  const headers = { Accept: "application/vnd.github+json", "User-Agent": `${OWNER}.github.io` };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

async function getJson(url) {
  const response = await fetch(url, { headers: apiHeaders() });
  if (!response.ok) {
    throw new Error(`GitHub ${response.status} (${url})`);
  }
  return response.json();
}

async function listModuleRepos() {
  const repos = [];
  for (let page = 1; ; page++) {
    const batch = await getJson(`https://api.github.com/users/${OWNER}/repos?type=owner&per_page=100&page=${page}`);
    repos.push(...batch);
    if (batch.length < 100) {
      break;
    }
  }
  return repos.filter((repo) => !repo.archived && repo.topics.includes(TOPIC));
}

async function readDescriptor(repo) {
  const url = `https://raw.githubusercontent.com/${OWNER}/${repo.name}/${repo.default_branch}/site.json`;
  const response = await fetch(url);
  if (response.status === 404) {
    throw new Error(`${repo.name}: has the ${TOPIC} topic but no site.json on ${repo.default_branch}`);
  }
  if (!response.ok) {
    throw new Error(`${repo.name}: site.json returned ${response.status}`);
  }
  try {
    return await response.json();
  } catch (error) {
    throw new Error(`${repo.name}: site.json is not valid JSON (${error.message})`);
  }
}

async function main() {
  const repos = await listModuleRepos();
  const entries = await Promise.all(
    repos.map(async (repo) => parseDescriptor(repo.name, await readDescriptor(repo), GROUPS))
  );
  const modules = buildCatalog(entries, GROUPS);
  await writeFile(OUTPUT, `${JSON.stringify({ modules }, null, 2)}\n`);
  console.log(`catalog.json: ${modules.map((module) => module.repo).join(", ")}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
