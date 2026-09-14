"use client";

import { useEffect, useRef } from "react";

type Particle = { x: number; y: number; vx: number; vy: number; r: number };

const LINK_DISTANCE = 120; // px within which two particles get a connecting line
const SPEED = 0.14; // px per frame — slow enough to read as ambient, not busy
const DENSITY = 16000; // one particle per N css pixels of area
const MAX_PARTICLES = 90;

/**
 * Ambient drifting constellation, drawn on a canvas behind the hero.
 *
 * Deliberately quiet: particles inherit the page text colour at low alpha, so
 * it reads as texture rather than decoration and works in both themes. It
 * stops entirely for `prefers-reduced-motion` (drawing one static frame) and
 * pauses whenever the tab or the element itself is off-screen.
 */
export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    let particles: Particle[] = [];
    let frame = 0;
    let width = 0;
    let height = 0;
    let rgb = "127,127,127";
    let running = true;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Canvas can't use `currentColor`, so read the inherited colour and reuse
    // its channels at low alpha. Recomputed whenever the colour scheme flips.
    const readColor = () => {
      const computed = getComputedStyle(canvas).color;
      const match = computed.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/);
      if (match) rgb = `${match[1]},${match[2]},${match[3]}`;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(
        MAX_PARTICLES,
        Math.floor((width * height) / DENSITY),
      );
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * SPEED * 2,
        vy: (Math.random() - 0.5) * SPEED * 2,
        r: Math.random() * 1.4 + 0.6,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Lines first so dots sit on top of their own connections.
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist > LINK_DISTANCE) continue;
          // Fade the line out as the pair drifts apart.
          const alpha = (1 - dist / LINK_DISTANCE) * 0.18;
          ctx.strokeStyle = `rgba(${rgb},${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }

      ctx.fillStyle = `rgba(${rgb},0.42)`;
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const step = () => {
      if (!running) return;
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        // Bounce off the edges rather than wrapping, which would make
        // particles pop in and out at the borders.
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }
      draw();
      frame = requestAnimationFrame(step);
    };

    const start = () => {
      if (running || reduceMotion.matches) return;
      running = true;
      frame = requestAnimationFrame(step);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    readColor();
    resize();

    if (reduceMotion.matches) {
      running = false;
      draw(); // one static frame — the texture without the movement
    } else {
      frame = requestAnimationFrame(step);
    }

    const onResize = () => {
      resize();
      if (!running) draw();
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    const onScheme = () => {
      readColor();
      if (!running) draw();
    };

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(parent);

    // Don't burn frames animating something scrolled out of view.
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 },
    );
    intersectionObserver.observe(canvas);

    const scheme = window.matchMedia("(prefers-color-scheme: dark)");
    scheme.addEventListener("change", onScheme);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      scheme.removeEventListener("change", onScheme);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
