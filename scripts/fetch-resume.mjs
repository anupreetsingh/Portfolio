// Build-time resume fetch.
//
// Pulls the resume PDF out of its own repo and drops it in public/, so Vercel's
// CDN serves it from this domain with a real application/pdf type. That matters:
// raw.githubusercontent.com returns application/octet-stream, which browsers
// download instead of rendering, and GitHub can't be framed cross-origin anyway.
//
// Uses the GitHub Contents API rather than a raw.githubusercontent URL, because
// the API works identically whether the source repo is public or private — the
// only difference is whether GITHUB_TOKEN is required. With no `ref` parameter
// it always returns the default branch's latest commit.
//
// Runs as `prebuild` and `predev`, and must NEVER fail the build — if the fetch
// fails we write availability:false and the Resume section links out instead.

import { writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PDF_OUT = resolve(ROOT, "public/Anupreet-Singh-Resume.pdf");
const META_OUT = resolve(ROOT, "src/data/resume.generated.json");

const OWNER = "anupreetsingh";
const REPO = "Public-Resume";
const PATH = "Anupreet Resume.pdf";

// Vercel injects env vars directly; locally they live in the gitignored
// .env.local, which a bare `node` process does not read on its own.
if (!process.env.GITHUB_TOKEN) {
  try {
    process.loadEnvFile(resolve(ROOT, ".env.local"));
  } catch {
    // No .env.local — fine while the source repo is still public.
  }
}
const token = process.env.GITHUB_TOKEN;

async function writeMeta(available) {
  await mkdir(dirname(META_OUT), { recursive: true });
  await writeFile(
    META_OUT,
    JSON.stringify({ available, fetchedAt: new Date().toISOString() }, null, 2) + "\n",
    "utf8",
  );
}

async function main() {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(PATH)}`;
  const headers = {
    // Returns the file bytes rather than the base64 JSON envelope, which is
    // also what lifts the 1 MB size ceiling on this endpoint.
    Accept: "application/vnd.github.raw",
    "User-Agent": "portfolio-build-script",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, { headers });
  if (!res.ok) {
    const hint =
      res.status === 404 && !token
        ? " — repo may be private; set GITHUB_TOKEN"
        : res.status === 404
          ? " — token may lack Contents:read on this repo"
          : "";
    throw new Error(`${res.status} ${res.statusText}${hint}`);
  }

  const bytes = Buffer.from(await res.arrayBuffer());
  // A 404 page or an LFS pointer would not start with %PDF.
  if (!bytes.subarray(0, 4).equals(Buffer.from("%PDF"))) {
    throw new Error("response is not a PDF");
  }

  await mkdir(dirname(PDF_OUT), { recursive: true });
  await writeFile(PDF_OUT, bytes);
  await writeMeta(true);
  console.log(
    `Wrote ${(bytes.length / 1024).toFixed(0)} KB to public/Anupreet-Singh-Resume.pdf` +
      ` (${token ? "authenticated" : "unauthenticated"})`,
  );
}

main().catch(async (err) => {
  console.warn(`fetch-resume failed: ${err.message}`);
  console.warn("Resume section will link out to GitHub instead.");
  await writeMeta(false);
});
