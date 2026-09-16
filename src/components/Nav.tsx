"use client";

import { useEffect, useState } from "react";
import { SocialMenu } from "@/components/SocialMenu";
import { ExternalArrow } from "@/components/ui";
import { resumeUrl } from "@/data/social";
import resumeMeta from "@/data/resume.generated.json";

/**
 * The PDF is fetched into public/ at build time, so this is same-origin —
 * which is what makes the browser open it in its own viewer (with a download
 * button) instead of saving it. If that fetch failed, fall back to GitHub.
 */
const resumeHref = resumeMeta.available
  ? "/Anupreet-Singh-Resume.pdf"
  : resumeUrl;

const navLinks = [
  { href: "#experience", label: "Experience" },
  { href: "#education", label: "Education" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
];

/**
 * Highlights the nav link for whichever section is currently on screen.
 * Uses a band across the upper-middle of the viewport as the trigger line, so
 * the highlight flips when a section genuinely takes over the view.
 */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const onScreen = entries.filter((e) => e.isIntersecting);
        if (onScreen.length === 0) return;
        // Topmost visible section wins when two straddle the band.
        const top = onScreen.reduce((a, b) =>
          a.boundingClientRect.top <= b.boundingClientRect.top ? a : b,
        );
        setActive(top.target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

const SECTION_IDS = [
  "experience",
  "education",
  "skills",
  "projects",
];

export function Nav() {
  const active = useActiveSection(SECTION_IDS);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-foreground/10 bg-background/70 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <a href="#top" className="font-semibold tracking-tight">
          <span className="sm:hidden">AS</span>
          <span className="hidden sm:inline">Anupreet Singh</span>
        </a>
        <div className="flex min-w-0 items-center gap-4 text-xs sm:gap-6 sm:text-sm">
          <ul className="no-scrollbar flex min-w-0 items-center gap-4 overflow-x-auto sm:gap-6 sm:overflow-visible">
            {navLinks.map((link) => {
              const isActive = active === link.href.slice(1);
              return (
                <li key={link.href} className="shrink-0">
                  <a
                    href={link.href}
                    aria-current={isActive ? "true" : undefined}
                    className={`transition-colors ${
                      isActive
                        ? "text-accent"
                        : "text-foreground/70 hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
          {/* Outbound, so it sits outside navLinks — that list drives the
              in-page scroll-spy. */}
          <a
            href={resumeHref}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-foreground/70 transition-colors hover:text-foreground"
          >
            Resume
            <ExternalArrow className="text-foreground/40" />
          </a>
          <SocialMenu />
        </div>
      </div>
    </nav>
  );
}
