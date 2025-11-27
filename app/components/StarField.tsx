"use client";

import { useEffect, useRef } from "react";

/**
 * StarField – ruhiger Button-Hintergrund
 * -------------------------------------
 * Kontext:
 * - Läuft INSIDE eines Buttons (ModeAuraLayer),
 *   nicht mehr als globaler Vollbild-Effekt.
 * - Keine Maus-/Touch-Interaktion, nur sanftes Driften.
 * - Respektiert prefers-reduced-motion:
 *   → dann statisches Sternfeld ohne Animation.
 *
 * Stellschrauben (später leicht anpassbar):
 * - Dichte    → STAR_DENSITY
 * - Größe     → MIN_RADIUS / MAX_RADIUS
 * - Tempo     → BASE_SPEED
 * - Helligkeit→ MIN_ALPHA / MAX_ALPHA
 */
export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  type Particle = {
    x: number;
    y: number;
    r: number;
    alpha: number;
    driftX: number;
    driftY: number;
  };

  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Stellschrauben
    const STAR_DENSITY = 0.18; // Partikel pro px² (sehr niedrig gehalten)
    const MIN_RADIUS = 0.4;
    const MAX_RADIUS = 1.1;
    const MIN_ALPHA = 0.10;
    const MAX_ALPHA = 0.35;
    const BASE_SPEED = 0.06; // px pro Frame (sehr langsam)

    let width = 0;
    let height = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      const cssW = Math.max(1, rect.width);
      const cssH = Math.max(1, rect.height);

      canvas.width = Math.floor(cssW * dpr);
      canvas.height = Math.floor(cssH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      width = cssW;
      height = cssH;

      initParticles();
    };

    const randomBetween = (min: number, max: number) =>
      min + Math.random() * (max - min);

    const initParticles = () => {
      const area = width * height;
      const targetCount = Math.max(
        8,
        Math.floor(area * STAR_DENSITY * 0.001) // area-Normierung für kleine Buttons
      );

      const arr: Particle[] = [];
      for (let i = 0; i < targetCount; i++) {
        arr.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: randomBetween(MIN_RADIUS, MAX_RADIUS),
          alpha: randomBetween(MIN_ALPHA, MAX_ALPHA),
          driftX: randomBetween(-BASE_SPEED, BASE_SPEED),
          driftY: randomBetween(-BASE_SPEED * 0.3, BASE_SPEED * 0.6), // leicht nach unten
        });
      }
      particlesRef.current = arr;
    };

    const stepParticles = () => {
      const arr = particlesRef.current;
      for (const p of arr) {
        p.x += p.driftX;
        p.y += p.driftY;

        // sanftes Re-Wrapping, damit immer Sterne im Feld bleiben
        if (p.x < -4) p.x = width + 4;
        if (p.x > width + 4) p.x = -4;
        if (p.y < -4) p.y = height + 4;
        if (p.y > height + 4) p.y = -4;
      }
    };

    const renderFrame = () => {
      ctx.clearRect(0, 0, width, height);

      const arr = particlesRef.current;
      for (const p of arr) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
        ctx.fill();
      }

      stepParticles();
      rafRef.current = requestAnimationFrame(renderFrame);
    };

    resize();
    window.addEventListener("resize", resize);

    if (!prefersReducedMotion) {
      rafRef.current = requestAnimationFrame(renderFrame);
    } else {
      // Reduced Motion → nur einmal zeichnen, kein Loop
      ctx.clearRect(0, 0, width, height);
      for (const p of particlesRef.current) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
        ctx.fill();
      }
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
