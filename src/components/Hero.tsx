"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { ParticleField } from "@/components/ParticleField";

const ROLES = [
  "AI & LLM Engineer",
  "Full-Stack Developer",
  "RAG & Agent Builder",
  "CS Master's @ UMBC",
];

const TYPE_MS = 65;
const DELETE_MS = 32;
const HOLD_MS = 1600;

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeToMotionPref(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * Reads the OS reduced-motion setting. useSyncExternalStore rather than an
 * effect so there is no hydration mismatch: the server snapshot says "motion
 * is fine" and the client corrects it on hydration.
 */
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToMotionPref,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );
}

type TypeState = { index: number; text: string; deleting: boolean };

/** Types one role out, holds, deletes it, moves to the next — forever. */
function useTypewriter(words: string[], enabled: boolean) {
  const [state, setState] = useState<TypeState>({
    index: 0,
    text: "",
    deleting: false,
  });

  useEffect(() => {
    if (!enabled) return;

    const word = words[state.index];
    const fullyTyped = !state.deleting && state.text === word;
    const delay = fullyTyped ? HOLD_MS : state.deleting ? DELETE_MS : TYPE_MS;

    // Every transition happens in the timer callback — the timer is the
    // external system this effect is synchronising with.
    const timer = setTimeout(() => {
      setState((current) => {
        const target = words[current.index];
        if (!current.deleting && current.text === target) {
          return { ...current, deleting: true };
        }
        if (current.deleting && current.text === "") {
          return {
            index: (current.index + 1) % words.length,
            text: "",
            deleting: false,
          };
        }
        return {
          ...current,
          text: current.deleting
            ? target.slice(0, current.text.length - 1)
            : target.slice(0, current.text.length + 1),
        };
      });
    }, delay);

    return () => clearTimeout(timer);
  }, [state, words, enabled]);

  // With reduced motion we skip the animation and just show the first role.
  return enabled ? state.text : words[0];
}

export function Hero() {
  const reduced = usePrefersReducedMotion();
  const typed = useTypewriter(ROLES, !reduced);

  return (
    <section
      id="top"
      className="relative isolate flex min-h-[82vh] w-full items-center overflow-hidden"
    >
      <ParticleField />
      {/* Softens the field behind the text so the copy always wins. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background"
      />

      <div className="relative mx-auto w-full max-w-4xl px-6 py-20">
        <p className="font-mono text-sm text-accent">Hi, my name is</p>
        <h1 className="mt-4 text-5xl font-bold tracking-tight sm:text-7xl">
          Anupreet Singh
        </h1>

        <p className="mt-4 flex h-9 items-center font-mono text-lg text-foreground/70 sm:text-2xl">
          {/* aria-live so screen readers announce each role once it settles. */}
          <span aria-live="polite">{typed}</span>
          <span
            aria-hidden="true"
            className="ml-1 inline-block w-[2px] animate-pulse self-stretch bg-accent"
          />
        </p>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-foreground/70">
          I build AI-driven systems and the full-stack apps that put them in
          front of people.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <a
            href="#projects"
            className="rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-85"
          >
            View projects
          </a>
          <a
            href="#about"
            className="rounded-md border border-foreground/20 px-5 py-2.5 text-sm font-medium transition-colors hover:border-foreground/50"
          >
            About me
          </a>
          <a
            href="https://github.com/anupreetsingh"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-foreground/20 px-5 py-2.5 text-sm font-medium transition-colors hover:border-foreground/50"
          >
            GitHub ↗
          </a>
        </div>
      </div>
    </section>
  );
}
