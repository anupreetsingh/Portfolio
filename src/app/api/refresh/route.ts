import { NextResponse } from "next/server";

/**
 * Daily Vercel Cron target (see vercel.json).
 *
 * Project metadata is baked in at build time by scripts/fetch-projects.mjs, so
 * refreshing it means triggering a new deploy. This route pings a Vercel Deploy
 * Hook to do exactly that.
 *
 * Set both env vars in the Vercel dashboard:
 *   CRON_SECRET        — Vercel sends it as `Authorization: Bearer <secret>`
 *   DEPLOY_HOOK_URL    — Settings → Git → Deploy Hooks
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const authorized =
    !secret || request.headers.get("authorization") === `Bearer ${secret}`;

  if (!authorized) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const hook = process.env.DEPLOY_HOOK_URL;
  if (!hook) {
    return NextResponse.json(
      { ok: false, reason: "DEPLOY_HOOK_URL is not set" },
      { status: 200 },
    );
  }

  const res = await fetch(hook, { method: "POST" });
  return NextResponse.json({ ok: res.ok, status: res.status });
}
