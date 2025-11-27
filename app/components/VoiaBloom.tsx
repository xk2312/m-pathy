"use client";

import { useEffect, useRef } from "react";

/**
 * StarField – ruhig + Parallax + Breathing
 * ----------------------------------------
 * Kontext:
 * - Läuft inside eines Wrappers (Hero, Button, Säule).
 * - Kein Input, nur sanftes Driften.
 * - Respektiert prefers-reduced-motion → statisches Feld.
 *
 * Stellschrauben:
 * - STAR_DENSITY     → Menge der Sterne
 * - MIN/MAX_RADIUS   → Größe der Sterne
 * - MIN/MAX_ALPHA    → Helligkeit der Sterne
 * - BASE_SPEED       → Grundtempo des Drifts
 * - DEPTH_MIN/MAX    → Parallax-Stärke (Layer-Tiefe)
 * - BREATH_PERIOD_MS → Dauer eines „Atems“ (Helligkeitszyklus)
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
    depth: number; // Parallax-Tiefe (nah/fern)
  };

  const particlesRef = useRef<Particle[]>([]);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Stellschrauben – golden flavored, aber physikalisch korrekt
    const STAR_DENSITY = 0.218; // relativ zur Fläche
    const MIN_RADIUS = 0.0618;
    const MAX_RADIUS = 1.382;
    const MIN_ALPHA = 0.218;
    const MAX_ALPHA = 1.0; // Alpha darf max. 1 sein
    const BASE_SPEED = 0.0618; // px / Frame (sehr ruhig)

    const DEPTH_MIN = 0.6; // ferne Sterne
    const DEPTH_MAX = 1.4; // nahe Sterne (minimal schneller)
    const BREATH_PERIOD_MS = 8000; // 8s für einen „Atem“

    let width = 0;
    let height = 0;

    const randomBetween = (min: number, max: number) =>
      min + Math.random() * (max - min);

    const initParticles = () => {
      const area = width * height;
      const targetCount = Math.max(
        8,
        Math.floor(area * STAR_DENSITY * 0.001) // Normierung für kleine Bereiche
      );

      const arr: Particle[] = [];
      for (let i = 0; i < targetCount; i++) {
        const depth = randomBetween(DEPTH_MIN, DEPTH_MAX);
        const base = BASE_SPEED * depth;

        arr.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: randomBetween(MIN_RADIUS, MAX_RADIUS) * depth,
          alpha: randomBetween(MIN_ALPHA, MAX_ALPHA),
          driftX: randomBetween(-base, base),
          driftY: randomBetween(-base * 0.3, base * 0.6),
          depth,
        });
      }
      particlesRef.current = arr;
    };

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
      if (startTimeRef.current == null) {
        startTimeRef.current = performance.now();
      }
      const now = performance.now();
      const t = now - startTimeRef.current;

      // Breath-Faktor: sehr sanfte globale Helligkeitsmodulation
      const breathPhase = (t % BREATH_PERIOD_MS) / BREATH_PERIOD_MS;
      const breathing = 0.9 + 0.1 * Math.sin(breathPhase * 2 * Math.PI);

      ctx.clearRect(0, 0, width, height);

      /* 🌑 Universum-Schwarz Hintergrund */
      ctx.fillStyle = "#04060a"; // deep cosmic black
      ctx.fillRect(0, 0, width, height);

      const arr = particlesRef.current;
      for (const p of arr) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);

        const effectiveAlpha = Math.min(
          1,
          Math.max(0, p.alpha * breathing)
        );

        ctx.fillStyle = `rgba(255,255,255,${effectiveAlpha})`;
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
      // Reduced Motion → einmaliges, statisches Feld
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#04060a";
      ctx.fillRect(0, 0, width, height);

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
