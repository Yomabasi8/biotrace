"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type DnaHelixProps = {
  className?: string;
  style?: React.CSSProperties;
  /** Full turns of the helix per second */
  speed?: number;
  /** Starting phase so multiple helices don't spin in lockstep */
  phase?: number;
};

const STRAND = { base: "#2f7fd6", light: "#b8dcff", dark: "#0b3f86" };
const BASES = [
  { base: "#e0893c", light: "#ffd2a3", dark: "#8a4410" },
  { base: "#6b4fbf", light: "#c9b8ff", dark: "#311d73" },
  { base: "#25ae9e", light: "#a8f0e6", dark: "#0b5a50" },
  { base: "#d4bb3e", light: "#fff1a6", dark: "#7a6510" },
];
// Complementary pairs, like A–T / C–G
const PAIRS: [number, number][] = [
  [0, 1],
  [2, 3],
  [1, 0],
  [3, 2],
  [2, 3],
  [0, 1],
];

type Swatch = (typeof BASES)[number];

function sphere(c: Swatch, px: number) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = px;
  const g = canvas.getContext("2d")!;
  const grd = g.createRadialGradient(px * 0.36, px * 0.32, px * 0.04, px * 0.5, px * 0.5, px * 0.5);
  grd.addColorStop(0, c.light);
  grd.addColorStop(0.45, c.base);
  grd.addColorStop(1, c.dark);
  g.fillStyle = grd;
  g.beginPath();
  g.arc(px / 2, px / 2, px / 2, 0, Math.PI * 2);
  g.fill();
  return canvas;
}

// A bead made of a cluster of tiny spheres, for the granular look of the reference art
function beaded(c: Swatch, px: number) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = px;
  const g = canvas.getContext("2d")!;
  const small = sphere(c, Math.round(px * 0.44));
  const s = small.width;
  const ring = Array.from({ length: 8 }, (_, i) => (i / 8) * Math.PI * 2);
  for (const a of ring) {
    g.drawImage(small, px / 2 + Math.cos(a) * px * 0.27 - s / 2, px / 2 + Math.sin(a) * px * 0.27 - s / 2);
  }
  g.drawImage(small, px / 2 - s / 2, px / 2 - s / 2);
  return canvas;
}

const smooth = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

// A procedurally drawn double helix that rotates around its own axis.
// Drawn along the x-axis; rotate the element with CSS to angle it.
export function DnaHelix({ className, style, speed = 0.1, phase = 0 }: DnaHelixProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let W = 0;
    let H = 0;
    let strandSprite: HTMLCanvasElement;
    let baseSprites: HTMLCanvasElement[] = [];

    const resize = () => {
      W = wrap.clientWidth;
      H = wrap.clientHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const spritePx = Math.max(16, Math.round(H * 0.2 * dpr));
      strandSprite = beaded(STRAND, spritePx);
      baseSprites = BASES.map((b) => beaded(b, Math.round(spritePx * 0.7)));
    };

    type Item = { x: number; y: number; z: number; size: number; alpha: number; sprite: HTMLCanvasElement };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, W, H);
      // A collapsed or detached element (e.g. mid page navigation) reports 0×0. Every spacing
      // below scales with H, so a zero height would make the loops step by 0 and never end.
      if (W < 4 || H < 4) return;
      const cy = H / 2;
      const amp = H * 0.3;
      const wavelength = H * 1.7;
      const spin = phase + (time / 1000) * speed * Math.PI * 2;
      const fadeLen = W * 0.16;
      const pad = H * 0.12;
      const items: Item[] = [];

      // Backbones: two strands half a turn apart
      const step = Math.max(2.5, H * 0.032);
      const strandSize = H * 0.17;
      for (let x = pad; x <= W - pad; x += step) {
        const theta = (x / wavelength) * Math.PI * 2 + spin;
        const s = Math.sin(theta);
        const c = Math.cos(theta);
        const fade = smooth(pad, pad + fadeLen, x) * smooth(pad, pad + fadeLen, W - x);
        if (fade <= 0) continue;
        items.push({ x, y: cy + amp * s, z: c, size: strandSize, alpha: fade, sprite: strandSprite });
        items.push({ x, y: cy - amp * s, z: -c, size: strandSize, alpha: fade, sprite: strandSprite });
      }

      // Base pairs: ~10 rungs per turn, each split into two complementary halves
      const rungGap = Math.max(4, wavelength / 10);
      const beadsPerRung = 8;
      const rungSize = H * 0.1;
      let k = 0;
      for (let x = pad + rungGap / 2; x <= W - pad; x += rungGap, k++) {
        const theta = (x / wavelength) * Math.PI * 2 + spin;
        const s = Math.sin(theta);
        const c = Math.cos(theta);
        const fade = smooth(pad, pad + fadeLen, x) * smooth(pad, pad + fadeLen, W - x);
        if (fade <= 0) continue;
        const y1 = cy + amp * s;
        const y2 = cy - amp * s;
        const [a, b] = PAIRS[k % PAIRS.length];
        for (let j = 0; j < beadsPerRung; j++) {
          const t = (j + 0.5) / beadsPerRung;
          items.push({
            x,
            y: y1 + (y2 - y1) * t,
            z: c * (1 - 2 * t),
            size: rungSize,
            alpha: fade,
            sprite: baseSprites[t < 0.5 ? a : b],
          });
        }
      }

      // Painter's algorithm: far side first so the near strand overlaps correctly
      items.sort((p, q) => p.z - q.z);
      for (const it of items) {
        const depth = (it.z + 1) / 2;
        const size = it.size * (0.72 + 0.28 * depth);
        ctx.globalAlpha = it.alpha * (0.4 + 0.6 * depth);
        ctx.drawImage(it.sprite, it.x - size / 2, it.y - size / 2, size, size);
      }
      ctx.globalAlpha = 1;
    };

    resize();
    const ro = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
    ro.observe(wrap);

    if (reduceMotion) {
      draw(0);
      return () => ro.disconnect();
    }

    // Only animate while on screen
    let raf = 0;
    let visible = false;
    const loop = (t: number) => {
      draw(t);
      raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !visible) {
        visible = true;
        raf = requestAnimationFrame(loop);
      } else if (!entry.isIntersecting && visible) {
        visible = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(wrap);
    draw(performance.now());

    return () => {
      ro.disconnect();
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [reduceMotion, speed, phase]);

  return (
    <div ref={wrapRef} aria-hidden style={style} className={cn("pointer-events-none", className)}>
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
