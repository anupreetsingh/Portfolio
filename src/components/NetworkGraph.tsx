"use client";

import { useEffect, useRef } from "react";

/**
 * Ambient graph suggesting a clustered knowledge base / distributed system.
 *
 * Deliberately NOT a proximity constellation: the topology is generated once
 * and stays fixed, so edges remain bound to the same nodes. Structure comes
 * from clusters (each with a hub and its leaves) joined by a sparse backbone,
 * and life comes from packets traversing edges and lighting up nodes on
 * arrival — the part that reads as traffic rather than decoration.
 *
 * Inherits the page text colour for structure and `--accent` for traffic, so
 * both themes work. Draws one static frame under `prefers-reduced-motion`, and
 * pauses whenever the tab or the element is off-screen.
 */

type GraphNode = {
  /** Home position; the node orbits this rather than wandering off. */
  hx: number;
  hy: number;
  x: number;
  y: number;
  r: number;
  phase: number;
  hub: boolean;
  /** 0..1, decays after a packet arrives. */
  flash: number;
};

type Edge = { a: number; b: number; backbone: boolean };

type Packet = { edge: number; from: number; to: number; t: number; speed: number };

const DRIFT_AMPLITUDE = 5; // px of orbit around the home position
const EDGE_ALPHA = 0.13;
const BACKBONE_ALPHA = 0.22;
const NODE_ALPHA = 0.32;
const HUB_ALPHA = 0.55;
const PACKET_ALPHA = 0.75;
/** Chance a packet continues to an adjacent edge instead of respawning. */
const CONTINUE_CHANCE = 0.72;

function hexToRgb(hex: string): string | null {
  const clean = hex.trim().replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  if (full.length !== 6) return null;
  const n = Number.parseInt(full, 16);
  if (Number.isNaN(n)) return null;
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
}

export function NetworkGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    let nodes: GraphNode[] = [];
    let edges: Edge[] = [];
    let adjacency: number[][] = [];
    let packets: Packet[] = [];
    let frame = 0;
    let width = 0;
    let height = 0;
    let tick = 0;
    // Last size the topology was generated for, so small resizes don't
    // reshuffle the whole graph (mobile URL-bar collapse fires resize).
    let builtWidth = -1;
    let builtHeight = -1;
    let rgb = "127,127,127";
    let accentRgb = "160,150,40";
    let running = true;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const readColors = () => {
      const styles = getComputedStyle(canvas);
      const fg = styles.color.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/);
      if (fg) rgb = `${fg[1]},${fg[2]},${fg[3]}`;
      const accent = hexToRgb(styles.getPropertyValue("--accent"));
      if (accent) accentRgb = accent;
    };

    const buildTopology = () => {
      nodes = [];
      edges = [];
      packets = [];

      // Clusters read as shards / knowledge domains. Scale with width so a
      // phone gets a legible 2-cluster graph rather than a crowded one.
      const clusterCount = Math.min(6, Math.max(2, Math.round(width / 300)));
      const hubIndices: number[] = [];

      for (let c = 0; c < clusterCount; c++) {
        const cx = ((c + 0.5) / clusterCount) * width;
        // Keep hubs off the exact vertical centre, where the copy sits.
        const cy = height * (0.26 + Math.random() * 0.48);

        hubIndices.push(nodes.length);
        nodes.push({
          hx: cx,
          hy: cy,
          x: cx,
          y: cy,
          r: 3.9,
          phase: Math.random() * Math.PI * 2,
          hub: true,
          flash: 0,
        });

        const leafCount = 5 + Math.floor(Math.random() * 4);
        for (let i = 0; i < leafCount; i++) {
          const angle = Math.random() * Math.PI * 2;
          const radius = 28 + Math.random() * 54;
          const leafIndex = nodes.length;
          nodes.push({
            hx: cx + Math.cos(angle) * radius,
            hy: cy + Math.sin(angle) * radius * 0.75,
            x: 0,
            y: 0,
            r: 1.5 + Math.random() * 0.9,
            phase: Math.random() * Math.PI * 2,
            hub: false,
            flash: 0,
          });
          edges.push({ a: hubIndices[c], b: leafIndex, backbone: false });

          // An occasional leaf-to-leaf link keeps clusters from looking like
          // perfect stars.
          if (i > 0 && Math.random() < 0.5) {
            edges.push({ a: leafIndex, b: leafIndex - 1, backbone: false });
          }
        }
      }

      // Sparse backbone between hubs — the "distributed" part.
      for (let c = 0; c < hubIndices.length - 1; c++) {
        edges.push({ a: hubIndices[c], b: hubIndices[c + 1], backbone: true });
      }
      if (hubIndices.length > 2 && Math.random() < 0.7) {
        edges.push({
          a: hubIndices[0],
          b: hubIndices[hubIndices.length - 1],
          backbone: true,
        });
      }

      adjacency = nodes.map(() => []);
      edges.forEach((edge, i) => {
        adjacency[edge.a].push(i);
        adjacency[edge.b].push(i);
      });

      const packetCount = Math.min(12, Math.max(3, Math.round(edges.length / 4)));
      for (let i = 0; i < packetCount; i++) packets.push(spawnPacket());
    };

    function spawnPacket(): Packet {
      const edgeIndex = Math.floor(Math.random() * edges.length);
      const edge = edges[edgeIndex];
      const forward = Math.random() < 0.5;
      return {
        edge: edgeIndex,
        from: forward ? edge.a : edge.b,
        to: forward ? edge.b : edge.a,
        t: Math.random(),
        speed: 0.0035 + Math.random() * 0.0055,
      };
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Regenerate only on a meaningful size change; otherwise keep the graph
      // the visitor is already looking at and just re-scale the canvas.
      const changed =
        Math.abs(width - builtWidth) > 40 || Math.abs(height - builtHeight) > 120;
      if (changed || nodes.length === 0) {
        builtWidth = width;
        builtHeight = height;
        buildTopology();
      }
      positionNodes();
    };

    const positionNodes = () => {
      for (const node of nodes) {
        node.x = node.hx + Math.sin(tick * 0.0007 + node.phase) * DRIFT_AMPLITUDE;
        node.y = node.hy + Math.cos(tick * 0.0009 + node.phase) * DRIFT_AMPLITUDE;
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (const edge of edges) {
        const a = nodes[edge.a];
        const b = nodes[edge.b];
        ctx.strokeStyle = `rgba(${rgb},${edge.backbone ? BACKBONE_ALPHA : EDGE_ALPHA})`;
        ctx.lineWidth = edge.backbone ? 1.1 : 0.8;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      for (const node of nodes) {
        const base = node.hub ? HUB_ALPHA : NODE_ALPHA;
        ctx.fillStyle = `rgba(${rgb},${base})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        ctx.fill();

        // Brief halo where a packet just landed.
        if (node.flash > 0.01) {
          ctx.strokeStyle = `rgba(${accentRgb},${node.flash * 0.5})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.r + 3 + (1 - node.flash) * 7, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      ctx.fillStyle = `rgba(${accentRgb},${PACKET_ALPHA})`;
      for (const packet of packets) {
        const from = nodes[packet.from];
        const to = nodes[packet.to];
        const x = from.x + (to.x - from.x) * packet.t;
        const y = from.y + (to.y - from.y) * packet.t;
        ctx.beginPath();
        ctx.arc(x, y, 1.7, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const step = () => {
      if (!running) return;
      tick += 16;
      positionNodes();

      for (const node of nodes) {
        if (node.flash > 0) node.flash = Math.max(0, node.flash - 0.016);
      }

      for (let i = 0; i < packets.length; i++) {
        const packet = packets[i];
        packet.t += packet.speed;
        if (packet.t < 1) continue;

        nodes[packet.to].flash = 1;

        // Propagate onward where possible, so traffic looks like it's
        // traversing the graph rather than teleporting.
        const options = adjacency[packet.to].filter((e) => e !== packet.edge);
        if (options.length > 0 && Math.random() < CONTINUE_CHANCE) {
          const nextEdge = options[Math.floor(Math.random() * options.length)];
          const edge = edges[nextEdge];
          packets[i] = {
            edge: nextEdge,
            from: packet.to,
            to: edge.a === packet.to ? edge.b : edge.a,
            t: 0,
            speed: packet.speed,
          };
        } else {
          packets[i] = spawnPacket();
          packets[i].t = 0;
        }
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

    readColors();
    resize();

    if (reduceMotion.matches) {
      running = false;
      draw(); // one static frame — the topology without the traffic
    } else {
      frame = requestAnimationFrame(step);
    }

    const onResize = () => {
      resize();
      if (!running) draw();
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    const onScheme = () => {
      readColors();
      if (!running) draw();
    };

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(parent);

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
