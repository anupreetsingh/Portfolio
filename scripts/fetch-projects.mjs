// Build-time project metadata fetch.
//
// Reads the curated allowlist in projects.config.json, asks the GitHub API for
// each repo's live metadata, merges the two (overrides win), and writes
// src/data/projects.generated.json — a gitignored build artifact consumed by
// src/data/projects.ts.
//
// Runs as `prebuild` and `predev`. It must NEVER fail the build: if GitHub is
// down, rate-limited, or the repo is missing, we fall back to the config entry
// alone so the site still renders.

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CONFIG_PATH = resolve(ROOT, "projects.config.json");
const SKILLS_PATH = resolve(ROOT, "src/data/skills.ts");
const OUT_PATH = resolve(ROOT, "src/data/projects.generated.json");

const token = process.env.GITHUB_TOKEN;

/** Pull the canonical skill ids out of skills.ts so bad tags surface loudly. */
async function readSkillIds() {
  try {
    const src = await readFile(SKILLS_PATH, "utf8");
    return new Set([...src.matchAll(/\bid:\s*"([^"]+)"/g)].map((m) => m[1]));
  } catch {
    return null; // Can't validate; not a reason to fail.
  }
}

async function fetchRepo(owner, repo) {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "portfolio-build-script",
  };
  // Authenticated calls get 5000 req/hr instead of 60 — matters on Vercel,
  // where many builds share one egress IP.
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers,
  });
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }
  return res.json();
}

function merge(entry, api, owner) {
  // Overrides beat the API; the API beats nothing.
  return {
    repo: entry.repo,
    name: entry.displayName ?? api?.name ?? entry.repo,
    tagline: entry.tagline ?? api?.description ?? "",
    description: api?.description ?? "",
    repoUrl: api?.html_url ?? `https://github.com/${owner}/${entry.repo}`,
    // GitHub returns "" (not null) for an unset homepage, so `??` is not enough.
    demoUrl: entry.demoUrl || api?.homepage || null,
    language: api?.language ?? null,
    stars: api?.stargazers_count ?? 0,
    pushedAt: api?.pushed_at ?? null,
    topics: api?.topics ?? [],
    tags: entry.tags ?? [],
    pinned: entry.pinned === true,
  };
}

async function main() {
  const config = JSON.parse(await readFile(CONFIG_PATH, "utf8"));
  const { owner, projects: entries } = config;
  const skillIds = await readSkillIds();

  if (skillIds) {
    for (const entry of entries) {
      for (const tag of entry.tags ?? []) {
        if (!skillIds.has(tag)) {
          console.warn(
            `  ! ${entry.repo}: tag "${tag}" is not a skill id in skills.ts — the filter chip will never match it.`,
          );
        }
      }
    }
  }

  console.log(
    `Fetching ${entries.length} repos for ${owner} (${token ? "authenticated" : "unauthenticated — 60 req/hr"})`,
  );

  const projects = await Promise.all(
    entries.map(async (entry) => {
      try {
        const api = await fetchRepo(owner, entry.repo);
        console.log(`  ok   ${entry.repo}  ★${api.stargazers_count}`);
        return merge(entry, api, owner);
      } catch (err) {
        console.warn(
          `  warn ${entry.repo}: ${err.message} — using config values only`,
        );
        return merge(entry, null, owner);
      }
    }),
  );

  // Pinned first, then most recently pushed. Repos with no pushedAt sink.
  projects.sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return (b.pushedAt ?? "").localeCompare(a.pushedAt ?? "");
  });

  await mkdir(dirname(OUT_PATH), { recursive: true });
  await writeFile(OUT_PATH, JSON.stringify(projects, null, 2) + "\n", "utf8");
  console.log(`Wrote ${projects.length} projects to src/data/projects.generated.json`);
}

main().catch(async (err) => {
  // Last-resort guard: a broken config must not take the deploy down.
  console.error(`fetch-projects failed: ${err.message}`);
  console.error("Writing an empty project list so the build can continue.");
  await mkdir(dirname(OUT_PATH), { recursive: true });
  await writeFile(OUT_PATH, "[]\n", "utf8");
});
