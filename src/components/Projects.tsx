"use client";

import { useMemo, useState } from "react";
import { Section } from "@/components/Section";
import { projects } from "@/data/projects";
import { skills, type SkillId } from "@/data/skills";

const ALL = "all" as const;

function formatPushed(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export function Projects() {
  const [active, setActive] = useState<SkillId | typeof ALL>(ALL);

  // Only offer chips for skills at least one project actually uses, so the
  // filter never has a dead option.
  const available = useMemo(() => {
    const used = new Set(projects.flatMap((p) => p.tags));
    return skills.filter((skill) => used.has(skill.id));
  }, []);

  const visible = useMemo(
    () =>
      active === ALL
        ? projects
        : projects.filter((p) => p.tags.includes(active)),
    [active],
  );

  return (
    <Section id="projects" title="Projects">
      <div className="mb-8 flex flex-wrap gap-2">
        {[{ id: ALL, label: "All" }, ...available].map((chip) => {
          const isActive = active === chip.id;
          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => setActive(chip.id as SkillId | typeof ALL)}
              aria-pressed={isActive}
              className={`rounded-full px-3 py-1 text-sm transition-colors ${
                isActive
                  ? "bg-foreground text-background"
                  : "bg-surface text-foreground/70 ring-1 ring-foreground/10 hover:text-foreground"
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      <ul className="grid gap-5 sm:grid-cols-2">
        {visible.map((project) => (
          <li
            key={project.repo}
            className="group flex flex-col rounded-lg bg-surface p-5 ring-1 ring-foreground/10 transition-colors hover:ring-foreground/30"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-lg font-semibold tracking-tight">
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors group-hover:text-accent"
                >
                  {project.name}
                </a>
              </h3>
              {project.pinned && (
                <span className="shrink-0 rounded font-mono text-[10px] uppercase tracking-widest text-accent">
                  Featured
                </span>
              )}
            </div>

            <p className="mt-2 flex-1 text-sm leading-6 text-foreground/70">
              {project.tagline}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-foreground/50">
              {project.language && <span>{project.language}</span>}
              {project.stars > 0 && <span>★ {project.stars}</span>}
              {formatPushed(project.pushedAt) && (
                <span>Updated {formatPushed(project.pushedAt)}</span>
              )}
            </div>

            {/* Only worth showing as a pair. With no demo, "Code" would be a
                second link to wherever the card title already points. */}
            {project.demoUrl && (
              <div className="mt-4 flex gap-4 text-sm">
                {[
                  { label: "Code", href: project.repoUrl },
                  { label: "Demo", href: project.demoUrl },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground/80 underline-offset-4 hover:text-accent hover:underline"
                  >
                    {link.label} ↗
                  </a>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>

      {visible.length === 0 && (
        <p className="text-sm text-foreground/60">
          No projects tagged with that skill yet.
        </p>
      )}
    </Section>
  );
}
