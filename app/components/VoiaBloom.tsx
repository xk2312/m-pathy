"use client";
import { useEffect, useRef } from "react";

/** Vollflächiger, interaktiver Hintergrund:
 *  - fixed hinter allem (-z-10)
 *  - pointer-events: none (klickt NICHT die UI weg)
 *  - DPR-aware, rAF-Loop, Auto-throttle bei Low FPS
 *  - Maus + Touch reaktiv; Resets bei Inaktivität
 *  - Respektiert prefers-reduced-motion
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
    const mediaRRM = window.matchMedia("(prefers-reduced-motion: reduce)");

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const { width: cssW, height: cssH } = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(cssW * dpr));
      canvas.height = Math.max(1, Math.floor(cssH * dpr));
      width = canvas.width / dpr;
      height = canvas.height / dpr;
      // Map device pixels -> CSS pixels
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const createParticle = (x: number, y: number) => ({
      x, y,
      r: Math.random() * 1.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      o: Math.random() * 0.5 + 0.5,
    });

    const init = (maxParticles: number) => {
      const arr = particlesRef.current;
      arr.length = 0;
      for (let i = 0; i < maxParticles; i++) {
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
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
          p.x = Math.random() * width;
          p.y = Math.random() * height;
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
          // throttle: Partikel reduzieren
          particlesRef.current.splice(0, 50);
        }
        frameCounter = 0;
        lastTs = now;
      }
      rafPerf.current = requestAnimationFrame(perf);
    };

    const spawnAt = (x: number, y: number) => {
      const rect = canvas.getBoundingClientRect();
      const cx = x - rect.left;
      const cy = y - rect.top;
      lastMove = Date.now();
      for (let i = 0; i < 5; i++) {
        particlesRef.current.push(createParticle(cx, cy));
        const cap = window.innerWidth < 600 ? 120 : 300;
        if (particlesRef.current.length > cap) particlesRef.current.shift();
      }
    };

    const onMouseMove = (e: MouseEvent) => spawnAt(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) spawnAt(t.clientX, t.clientY);
    };

    const inactivityTimer = window.setInterval(() => {
      if (Date.now() - lastMove > 60_000) {
        const cap = window.innerWidth < 600 ? 120 : 300;
        init(cap);
      }
    }, 10_000);

    // init
    resize();
    init(window.innerWidth < 600 ? 120 : 300);
    if (!mediaRRM.matches) {
      rafPaint.current = requestAnimationFrame(draw);
      rafPerf.current = requestAnimationFrame(perf);
      // WICHTIG: auf WINDOW lauschen → Canvas blockiert keine Klicks (pointer-events none)
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
      window.clearInterval(inactivityTimer);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      {/* Pulsierender Core (Deko, blockiert nie Eingaben) */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="w-[20vw] max-w-[180px] aspect-square rounded-full
                        bg-[radial-gradient(circle_at_center,#fff0f5,#9b59b6)]
                        shadow-[0_0_60px_rgba(255,255,255,0.30),inset_0_0_30px_rgba(155,89,182,0.50)]
                        motion-safe:animate-[bloomPulse_4s_ease-in-out_infinite]" />
      </div>

      {/* Canvas: malt die Partikel, fängt aber KEINE Pointer ab */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full filter blur-[0.5px] contrast-[110%] opacity-80"
      />

      <style jsx>{`
        @keyframes bloomPulse {
          0%,100% { transform: translate(-50%, -50%) scale(1); }
          50%     { transform: translate(-50%, -50%) scale(1.08); }
        }
      `}</style>
    </div>
  );
}
