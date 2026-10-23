"use client";
import { useEffect, useRef, useState } from "react";
import type { MotionValue } from "motion/react";

interface Props {
  progress: MotionValue<number>;
  reduced?: boolean;
}

export default function PhotoReveal({ progress, reduced = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef  = useRef<number>(0);
  const imgs = useRef<{ before: HTMLImageElement | null; after: HTMLImageElement | null }>({
    before: null,
    after: null,
  });
  const particles = useRef<
    { x: number; y: number; vx: number; vy: number; life: number; r: number }[]
  >([]);
  const [ready, setReady] = useState(false);

  // ── Load images ────────────────────────────────────────────────────────────
  useEffect(() => {
    let disposed = false;
    let loaded = 0;
    const onLoad = () => { if (++loaded === 2 && !disposed) setReady(true); };
    const before = new Image();
    const after  = new Image();
    before.onload = onLoad;
    after.onload  = onLoad;
    before.src = "/images/transformation-before.webp";
    after.src  = "/images/transformation-after.webp";
    imgs.current = { before, after };
    return () => { disposed = true; };
  }, []);

  // ── Resize canvas to fill container ────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const host = canvas.parentElement ?? canvas;
    const ro = new ResizeObserver(() => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width  = host.clientWidth  * dpr;
      canvas.height = host.clientHeight * dpr;
      canvas.style.width  = `${host.clientWidth}px`;
      canvas.style.height = `${host.clientHeight}px`;
    });
    ro.observe(host);
    const dpr = Math.min(window.devicePixelRatio, 2);
    canvas.width  = host.clientWidth  * dpr;
    canvas.height = host.clientHeight * dpr;
    canvas.style.width  = `${host.clientWidth}px`;
    canvas.style.height = `${host.clientHeight}px`;
    return () => ro.disconnect();
  }, []);

  // ── Draw loop ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let disposed = false;

    const draw = () => {
      if (disposed) return;
      const { before, after } = imgs.current;
      if (!before || !after) return;

      const p    = reduced ? 1 : progress.get();
      const W    = canvas.width;
      const H    = canvas.height;
      const wipeX = p * W;

      // ── 1. DIRTY LAYER – draw before image with heavy contamination filter ─
      // At p=0: desaturated, brownish, dark.  At p=1: hidden under clean layer.
      ctx.save();
      const saturation  = Math.max(0.05, 1 - p * 5);     // 0.05 → 0 quickly
      const brightness  = 0.60 + p * 0.10;               // 0.60 → 0.70
      const sepia       = Math.max(0, 0.55 - p * 5.5);   // 0.55 → 0 quickly
      ctx.filter = `brightness(${brightness}) saturate(${saturation}) sepia(${sepia}) contrast(1.08)`;
      ctx.drawImage(before, 0, 0, W, H);
      ctx.restore();

      // Dirt overlay: semi-transparent warm grime that fades as p increases
      if (p < 0.95) {
        const dirtAlpha = Math.max(0, (1 - p * 1.5) * 0.28);
        ctx.save();
        ctx.globalAlpha = dirtAlpha;
        ctx.fillStyle   = "rgba(60,40,15,1)";
        ctx.fillRect(0, 0, W, H);
        ctx.restore();
      }

      // ── 2. CLEAN LAYER – reveal after image from left to right ────────────
      if (wipeX > 0.5) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, wipeX, H);
        ctx.clip();
        // Slight vibrancy boost on the clean side
        ctx.filter = `brightness(1.05) saturate(1.12) contrast(1.04)`;
        ctx.drawImage(after, 0, 0, W, H);
        ctx.restore();
      }

      // ── 3. PRESSURE-WASHER BEAM ───────────────────────────────────────────
      if (p > 0.005 && p < 0.998) {
        const beamHalf = Math.round(W * 0.035); // ~3.5% of width

        // Outer soft glow
        const outerGrad = ctx.createLinearGradient(wipeX - beamHalf * 3, 0, wipeX + beamHalf * 3, 0);
        outerGrad.addColorStop(0,    "rgba(140,200,255,0)");
        outerGrad.addColorStop(0.25, "rgba(160,220,255,0.25)");
        outerGrad.addColorStop(0.45, "rgba(210,240,255,0.60)");
        outerGrad.addColorStop(0.5,  "rgba(255,255,255,0.95)");
        outerGrad.addColorStop(0.55, "rgba(210,240,255,0.60)");
        outerGrad.addColorStop(0.75, "rgba(160,220,255,0.25)");
        outerGrad.addColorStop(1,    "rgba(140,200,255,0)");
        ctx.fillStyle = outerGrad;
        ctx.fillRect(wipeX - beamHalf * 3, 0, beamHalf * 6, H);

        // Sharp core streak
        const coreGrad = ctx.createLinearGradient(wipeX - 3, 0, wipeX + 3, 0);
        coreGrad.addColorStop(0,   "rgba(255,255,255,0)");
        coreGrad.addColorStop(0.4, "rgba(255,255,255,0.8)");
        coreGrad.addColorStop(0.5, "rgba(255,255,255,1)");
        coreGrad.addColorStop(0.6, "rgba(255,255,255,0.8)");
        coreGrad.addColorStop(1,   "rgba(255,255,255,0)");
        ctx.fillStyle = coreGrad;
        ctx.fillRect(wipeX - 3, 0, 6, H);

        // ── 4. SPARKLE PARTICLES ────────────────────────────────────────────
        // Spawn new particles along the wipe edge
        if (p > 0.01 && p < 0.97 && !reduced) {
          const spawnCount = 3;
          for (let i = 0; i < spawnCount; i++) {
            particles.current.push({
              x:    wipeX + (Math.random() - 0.5) * 6,
              y:    Math.random() * H,
              vx:   (Math.random() - 0.3) * 2.5,
              vy:   (Math.random() - 0.5) * 2.0,
              life: 1,
              r:    0.8 + Math.random() * 2.2,
            });
          }
        }
      }

      // ── 5. UPDATE & DRAW PARTICLES ────────────────────────────────────────
      if (!reduced) {
        particles.current = particles.current.filter((pt) => pt.life > 0);
        for (const pt of particles.current) {
          pt.x    += pt.vx;
          pt.y    += pt.vy;
          pt.life -= 0.035;
          pt.vy   += 0.04; // gravity

          ctx.save();
          ctx.globalAlpha = Math.max(0, pt.life * 0.9);
          ctx.fillStyle   = `rgba(220,240,255,1)`;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.r * pt.life, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // ── 6. VIGNETTE – edges always darkened for depth ─────────────────────
      const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, H * 0.85);
      const vigStrength = 0.52 - p * 0.18; // darker when dirty, lighter when clean
      vig.addColorStop(0,   "rgba(0,0,0,0)");
      vig.addColorStop(0.6, "rgba(0,0,0,0)");
      vig.addColorStop(1,   `rgba(0,0,0,${vigStrength})`);
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);

      // ── 7. BEFORE/AFTER LABEL ─────────────────────────────────────────────
      if (p > 0.02 && p < 0.97) {
        const dpr = Math.min(window.devicePixelRatio, 2);
        const fontSize = Math.round(10 * dpr);
        ctx.font        = `600 ${fontSize}px 'Inter', sans-serif`;
        ctx.letterSpacing = "0.14em";

        // "BEFORE" label on right (dirty) side
        if (wipeX < W * 0.85) {
          ctx.save();
          ctx.globalAlpha = Math.min(1, (1 - p) * 4);
          ctx.fillStyle   = "rgba(255,255,255,0.55)";
          const bText = "BEFORE";
          const bx = Math.min(wipeX + 28, W - 80);
          ctx.fillText(bText, bx, H - Math.round(28 * dpr));
          ctx.restore();
        }

        // "AFTER" label on left (clean) side
        if (wipeX > W * 0.08) {
          ctx.save();
          ctx.globalAlpha = Math.min(1, p * 4);
          ctx.fillStyle   = "rgba(255,255,255,0.7)";
          const aText = "AFTER";
          const ax = Math.max(16, wipeX - 80);
          ctx.fillText(aText, ax, H - Math.round(28 * dpr));
          ctx.restore();
        }
      }
    };

    // ── Animation driver: redraw on progress change + continuous for particles
    let animating = false;
    const loop = () => {
      if (disposed) return;
      draw();
      // Keep animating while particles are alive or wipe is mid-transition
      const p = progress.get();
      if (
        (particles.current.length > 0 || (p > 0.01 && p < 0.99)) &&
        !reduced
      ) {
        frameRef.current = requestAnimationFrame(loop);
        animating = true;
      } else {
        animating = false;
      }
    };

    const onProgressChange = () => {
      if (!animating) loop();
    };

    const unsub = progress.on("change", onProgressChange);
    loop(); // initial render

    return () => {
      disposed = true;
      cancelAnimationFrame(frameRef.current);
      unsub();
    };
  }, [ready, progress, reduced]);

  return (
    <canvas
      ref={canvasRef}
      className="photo-reveal-canvas"
      role="img"
      aria-label="Real before-and-after car detailing transformation: scroll to reveal the clean ceramic finish"
    />
  );
}
