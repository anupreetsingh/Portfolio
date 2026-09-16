import type { ReactNode } from "react";

/**
 * Shared visual primitives.
 *
 * These exist because the same class strings were being copy-pasted across
 * sections, which meant a restyle had to be applied in several places and
 * silently drifted when it wasn't. Anything used by two or more sections
 * belongs here; anything used once stays inline in its own component.
 */

/**
 * Small uppercase pill — Experience's role kind, Education's GPA.
 */
export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full bg-surface px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-foreground/60 ring-1 ring-foreground/10">
      {children}
    </span>
  );
}

/**
 * Soft tag — Skills' skill names, Education's coursework.
 *
 * `as` exists because the two callers sit in different containers: a <dd> of
 * spans in Skills, a <ul> of list items in Education. Same look, correct
 * semantics in both.
 */
export function Chip({
  as: Tag = "span",
  children,
}: {
  as?: "span" | "li";
  children: ReactNode;
}) {
  return (
    <Tag className="rounded-md bg-surface px-2.5 py-1 text-sm text-foreground/80 ring-1 ring-foreground/10">
      {children}
    </Tag>
  );
}

/**
 * The vertical rule that Experience and Education both hang entries from.
 *
 * Extracted so the two adjacent sections cannot drift apart visually — they're
 * meant to read as a pair, and that was previously enforced only by a comment.
 */
export function Timeline({ children }: { children: ReactNode }) {
  return (
    <ol className="relative border-l border-foreground/15 pl-6 sm:pl-8">
      {children}
    </ol>
  );
}

/**
 * One entry on the rule, including its marker dot.
 *
 * `active` lights the marker in the accent colour — Experience uses it for the
 * expanded entry; Education has nothing to expand and leaves it false.
 */
export function TimelineItem({
  active = false,
  children,
}: {
  active?: boolean;
  children: ReactNode;
}) {
  return (
    <li className="pb-8 last:pb-0">
      {/* Timeline marker, centred on the rule. */}
      <span
        aria-hidden="true"
        className={`absolute -left-[5px] mt-2.5 h-[9px] w-[9px] rounded-full ring-4 ring-background transition-colors ${
          active ? "bg-accent" : "bg-foreground/30"
        }`}
      />
      {children}
    </li>
  );
}

/**
 * The "Jan 2025 – Present · Baltimore, MD" line under a timeline heading.
 */
export function TimelineMeta({
  period,
  location,
}: {
  period: string;
  location: string;
}) {
  return (
    <p className="mt-1 font-mono text-xs text-foreground/50">
      {period} · {location}
    </p>
  );
}
