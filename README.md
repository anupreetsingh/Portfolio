# Portfolio — Anupreet Singh

Personal portfolio built with Next.js (App Router), TypeScript and Tailwind CSS,
deployed on Vercel.

## Running locally

```bash
npm install
npm run dev
```

`predev` runs the build-time fetch scripts first, so the site has data on the
very first run. Open <http://localhost:3000>.

## Build-time data

Two scripts run as both `prebuild` and `predev` (together as `npm run
fetch:data`). Everything they write is a **gitignored build artifact** — none of
it is committed, and a fresh clone regenerates all of it.

| Script | Source | Output |
| --- | --- | --- |
| [`fetch-projects.mjs`](scripts/fetch-projects.mjs) | [`projects.config.json`](projects.config.json) + GitHub API | `src/data/projects.generated.json` |
| [`fetch-resume.mjs`](scripts/fetch-resume.mjs) | `anupreetsingh/Public-Resume` | `public/Anupreet-Singh-Resume.pdf`, `src/data/resume.generated.json` |

Neither script can fail the build. If GitHub is unreachable or rate-limited,
each falls back to something that still renders.

## How project data works

Projects are **curated, not auto-listed**.

1. [`projects.config.json`](projects.config.json) is the source of truth — an
   allowlist of GitHub repo slugs plus optional overrides (`displayName`,
   `tagline`, `demoUrl`, `tags`, `pinned`).
2. [`scripts/fetch-projects.mjs`](scripts/fetch-projects.mjs) calls the GitHub
   API for each entry and merges the live metadata (description, language,
   stars, `pushed_at`, topics) with the overrides — **overrides win**.
3. It writes `src/data/projects.generated.json`, sorted pinned-first then by
   most recently pushed.
4. [`src/data/projects.ts`](src/data/projects.ts) types that artifact and is
   what the components import.

If the GitHub API is unreachable or rate-limited, step 2 is skipped and the
config values alone are used, so the site still renders.

### Adding a project

Push the repo to GitHub, add its slug to `projects.config.json`, push. Vercel
redeploys automatically.

`tags` must be skill ids from [`src/data/skills.ts`](src/data/skills.ts) — they
drive the filter chips. The fetch script warns on any tag that isn't a real id.

## How the resume works

The PDF lives in its own repo (`anupreetsingh/Public-Resume`) so this one
carries nothing personal. [`fetch-resume.mjs`](scripts/fetch-resume.mjs) copies
it into `public/` at build time, which is what lets the browser render it
inline — `raw.githubusercontent.com` serves PDFs as
`application/octet-stream`, so linking there would force a download instead.

It uses the GitHub **Contents API** rather than a raw URL, because that works
identically whether the source repo is public or private; the only difference is
whether `GITHUB_TOKEN` is required. The response is checked for the `%PDF` magic
bytes, so an error page or an LFS pointer can't be written out as a PDF.

On failure it writes `available: false` and the nav's Resume link falls back to
the GitHub blob URL, so the link is never broken.

## Environment variables

Set these in the Vercel dashboard; locally use a gitignored `.env.local`.

| Variable | Required | Purpose |
| --- | --- | --- |
| `GITHUB_TOKEN` | No | Raises the GitHub API limit from 60 to 5,000 req/hr. Required only if the resume repo becomes private. Without it the build still works. |
| `CRON_SECRET` | No | Vercel sends it to `/api/refresh` as a bearer token. |
| `DEPLOY_HOOK_URL` | No | Vercel Deploy Hook that `/api/refresh` pings. |

## Daily refresh

Project metadata is baked in at build time, so refreshing it means redeploying.
[`vercel.json`](vercel.json) schedules a daily cron that hits `/api/refresh`,
which POSTs to the deploy hook. Create the hook in **Settings → Git → Deploy
Hooks** and set `DEPLOY_HOOK_URL`.

## Deploy

Vercel's Git integration handles CI/CD — every push to `main` builds and
deploys. No GitHub Actions.
