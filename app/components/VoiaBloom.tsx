"use client";
import { useEffect, useRef } from "react";

/**
 * Vollflächiger, interaktiver Hintergrund:
 * - fixed hinter allem (z-0)
 * - pointer-events: none (UI bleibt klickbar)
 * - DPR-aware Canvas, rAF-Loop, Auto-Throttle bei Low FPS
 * - reagiert auf Maus/Touch (Events auf window), respektiert RRM
 */
export default function VoiaBloom() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafPaint = useRef<number | null>(null);
  const rafPerf = useRef<number | null>(null);
  const particlesRef = useRef<
    { x: number; y: number; r: number; vx: number; vy: number; o: number }[]
  >([]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let width = 0, height = 0;
    let lastMove = Date.now();
    let frameCounter = 0;
    let lastTs = performance.now();
    const rrm = window.matchMedia("(prefers-reduced-motion: reduce)");

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const { width: cssW, height: cssH } = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(cssW * dpr));
      canvas.height = Math.max(1, Math.floor(cssH * dpr));
      width = canvas.width / dpr;
      height = canvas.height / dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const createParticle = (x: number, y: number) => ({
      x, y,
      r: Math.random() * 1.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      o: Math.random() * 0.5 + 0.5,
    });

    const init = (cap: number) => {
      const arr = particlesRef.current;
      arr.length = 0;
      for (let i = 0; i < cap; i++) {
        arr.push(createParticle(Math.random() * width, Math.random() * height));
      }
    };

    const draw = () => {
      const arr = particlesRef.current;
      ctx.clearRect(0, 0, width, height);
      for (const p of arr) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.o})`;
        ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
          p.x = Math.random() * width; p.y = Math.random() * height;
        }
      }
      rafPaint.current = requestAnimationFrame(draw);
    };

    const perf = () => {
      const now = performance.now();
      const delta = now - lastTs;
      frameCounter++;
      if (delta >= 1000) {
        const fps = (frameCounter / delta) * 1000;
        if (fps < 30 && particlesRef.current.length > 100) {
          particlesRef.current.splice(0, 50);
        }
        frameCounter = 0;
        lastTs = now;
      }
      rafPerf.current = requestAnimationFrame(perf);
    };

    const spawnAt = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      lastMove = Date.now();
      for (let i = 0; i < 5; i++) {
        particlesRef.current.push(createParticle(x, y));
        const cap = window.innerWidth < 600 ? 120 : 300;
        if (particlesRef.current.length > cap) particlesRef.current.shift();
      }
    };

    const onMouseMove = (e: MouseEvent) => spawnAt(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0]; if (t) spawnAt(t.clientX, t.clientY);
    };

    const inactivity = window.setInterval(() => {
      if (Date.now() - lastMove > 60_000) {
        init(window.innerWidth < 600 ? 120 : 300);
      }
    }, 10_000);

    // init
    resize();
    init(window.innerWidth < 600 ? 120 : 300);
    if (!rrm.matches) {
      rafPaint.current = requestAnimationFrame(draw);
      rafPerf.current = requestAnimationFrame(perf);
      // Events auf window → Canvas bleibt „durchklickbar“
      window.addEventListener("mousemove", onMouseMove, { passive: true });
      window.addEventListener("touchmove", onTouchMove, { passive: true });
    }

    window.addEventListener("resize", resize);
    return () => {
      if (rafPaint.current) cancelAnimationFrame(rafPaint.current);
      if (rafPerf.current) cancelAnimationFrame(rafPerf.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.clearInterval(inactivity);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="h-full w-full"
      />
    </div>
  );
}

