# Portfolio — Anupreet Singh

Personal portfolio built with Next.js (App Router), TypeScript and Tailwind CSS,
deployed on Vercel.

## Running locally

```bash
npm install
npm run dev
```

`predev` runs the project fetch script first, so the site has data on the very
first run. Open <http://localhost:3000>.

## How project data works

Projects are **curated, not auto-listed**.

1. [`projects.config.json`](projects.config.json) is the source of truth — an
   allowlist of GitHub repo slugs plus optional overrides (`displayName`,
   `tagline`, `demoUrl`, `tags`, `pinned`).
2. [`scripts/fetch-projects.mjs`](scripts/fetch-projects.mjs) calls the GitHub
   API for each entry and merges the live metadata (description, language,
   stars, `pushed_at`, topics) with the overrides — **overrides win**.
3. It writes `src/data/projects.generated.json`, a gitignored build artifact.
4. [`src/data/projects.ts`](src/data/projects.ts) types that artifact and is
   what the components import.

The script runs as `prebuild` and `predev`. It never fails the build: if the
GitHub API is unreachable or rate-limited, it falls back to the config values
alone so the site still renders.

### Adding a project

Push the repo to GitHub, add its slug to `projects.config.json`, push. Vercel
redeploys automatically.

`tags` must be skill ids from [`src/data/skills.ts`](src/data/skills.ts) — they
drive the filter chips. The fetch script warns on any tag that isn't a real id.

## Environment variables

Set these in the Vercel dashboard; locally use a gitignored `.env.local`.

| Variable | Required | Purpose |
| --- | --- | --- |
| `GITHUB_TOKEN` | No | Raises the GitHub API limit from 60 to 5,000 req/hr. Without it the build still works. |
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
