import type { SkillId } from "@/data/skills";
import generated from "@/data/projects.generated.json";

/**
 * A single curated project.
 *
 * Shape is produced by scripts/fetch-projects.mjs, which merges
 * projects.config.json overrides over live GitHub API metadata.
 */
export type Project = {
  /** GitHub repo slug — stable identity, used as the React key. */
  repo: string;
  /** Display name: the `displayName` override, else the repo name. */
  name: string;
  /** One-liner: the `tagline` override, else the GitHub description. */
  tagline: string;
  /** Raw GitHub description, kept so the card can show both if useful. */
  description: string;
  repoUrl: string;
  demoUrl: string | null;
  language: string | null;
  stars: number;
  /** ISO timestamp of the last push, or null if the API call failed. */
  pushedAt: string | null;
  topics: string[];
  /** Skill ids from skills.ts — drives the filter chips. */
  tags: SkillId[];
  pinned: boolean;
};

// The JSON is a build artifact with no literal types, so we assert the shape
// here. The script validates tags against skills.ts and warns on mismatches.
export const projects = generated as Project[];
