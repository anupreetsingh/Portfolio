"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalArrow } from "@/components/ui";
import { socialLinks } from "@/data/social";

/**
 * "Social" dropdown in the nav — outbound links, not a scroll target.
 *
 * Deliberately rendered as a sibling of the section-link <ul> rather than an
 * item inside it: that list is `overflow-x-auto` on small screens, and when one
 * overflow axis is non-visible CSS computes the other to `auto` too, which
 * would clip this panel vertically on mobile.
 */
export function SocialMenu() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Bound only while open, so a closed menu leaves no document listeners behind.
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      // Escape must not strand focus on a node that just unmounted.
      buttonRef.current?.focus();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((isOpen) => !isOpen)}
        aria-expanded={open}
        aria-haspopup="true"
        className={`flex items-center gap-1 transition-colors ${
          open ? "text-accent" : "text-foreground/70 hover:text-foreground"
        }`}
      >
        Social
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 7.5 10 12.5 15 7.5" />
        </svg>
      </button>

      {open && (
        <ul className="animate-reveal absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-lg border border-foreground/10 bg-background py-1 shadow-lg">
          {socialLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                // Deferred: closing synchronously unmounts this <a> during the
                // click, and the browser won't follow a link that has left the
                // DOM — which silently swallowed the mailto: handoff.
                onClick={() => setTimeout(() => setOpen(false), 0)}
                className="block px-3 py-2 text-sm text-foreground/80 transition-colors hover:bg-surface hover:text-foreground"
              >
                {link.label}
                <ExternalArrow className="text-foreground/40" />
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
