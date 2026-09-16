"use client";

import { useState } from "react";
import { Section } from "@/components/Section";
import { Badge, ExternalArrow, Timeline, TimelineItem, TimelineMeta } from "@/components/ui";
import { experience, experienceKindLabels } from "@/data/experience";

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className={`h-4 w-4 shrink-0 text-foreground/40 transition-transform duration-200 group-hover:text-accent ${
        open ? "rotate-180" : ""
      }`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 7.5 10 12.5 15 7.5" />
    </svg>
  );
}

export function Experience() {
  // Independent toggles rather than an accordion — comparing two roles
  // shouldn't mean losing the first one.
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setOpenIds((current) => {
      const next = new Set(current);
      if (!next.delete(id)) next.add(id);
      return next;
    });

  return (
    <Section id="experience" title="Experience">
      {/* Single reverse-chronological timeline rather than the resume's
          industry/academic split — the `kind` badge keeps the distinction
          visible without breaking the chronology. */}
      <Timeline>
        {experience.map((role) => {
          const open = openIds.has(role.id);
          const panelId = `experience-${role.id}`;

          return (
            <TimelineItem key={role.id} active={open}>
              <button
                type="button"
                onClick={() => toggle(role.id)}
                aria-expanded={open}
                aria-controls={panelId}
                className="group flex w-full items-center gap-3 text-left"
              >
                <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-lg font-semibold tracking-tight transition-colors group-hover:text-accent">
                    {role.role}
                  </span>
                  <Badge>{experienceKindLabels[role.kind]}</Badge>
                </span>
                <span className="ml-auto flex items-center gap-2">
                  <span className="hidden font-mono text-[10px] uppercase tracking-widest text-foreground/40 group-hover:text-accent sm:inline">
                    {open ? "Hide" : `${role.highlights.length} detail${role.highlights.length === 1 ? "" : "s"}`}
                  </span>
                  <Chevron open={open} />
                </span>
              </button>

              {/* Outside the button: the org link must stay clickable as a link,
                  and stay visible whether or not the entry is expanded. */}
              <p className="mt-1 text-foreground/80">
                {role.orgUrl ? (
                  <a
                    href={role.orgUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-foreground/25 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
                  >
                    {role.org}
                    <ExternalArrow />
                  </a>
                ) : (
                  role.org
                )}
              </p>

              <TimelineMeta period={role.period} location={role.location} />

              {open && (
                <ul id={panelId} className="animate-reveal mt-4 flex flex-col gap-2">
                  {role.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="relative pl-5 text-sm leading-6 text-foreground/70 before:absolute before:left-0 before:text-accent before:content-['—']"
                    >
                      {highlight}
                    </li>
                  ))}
                </ul>
              )}
            </TimelineItem>
          );
        })}
      </Timeline>
    </Section>
  );
}
