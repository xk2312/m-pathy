"use client";

import { useEffect, useRef } from "react";

type LineState = "GROW_LEFT" | "GATE_CHECK" | "ACCEPTING" | "REJECTING" | "RETRYING" | "DONE";

type LineAgent = {
  id: number;

  // position and motion
  x: number; // current head x in world units (0..W)
  xTarget: number; // where the head is allowed to grow to this phase
  speed: number;

  baseY: number;

  // chaos signal
  p1: number;
  p2: number;
  p3: number;

  // phase control
  state: LineState;
  attempt: 1 | 2;
  rejectedUntil: number; // timestamp (ms) until which it bounces back
  coherence: number; // 0..1
  whiteness: number; // 0..1

  // acceptance decision locked
  accepted: boolean;
};

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function easeInOut(t: number) {
  t = clamp01(t);
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function rgba(r: number, g: number, b: number, a: number) {
  return `rgba(${r},${g},${b},${a})`;
}

export default function MGovernanceField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    if (!canvas) return;

    let raf = 0;
    const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));

    // World size (logical). Render scales to actual CSS box.
    const W = 1200;
    const H = 320;

    // Zones
    const leftEnd = Math.floor(W * 0.35);
    const gateStart = Math.floor(W * 0.35);
    const gateEnd = Math.floor(W * 0.55);
    const rightStart = gateEnd;

    // Visual tuning
    const lineCount = 14;
    const sampleCount = 180; // points along each polyline
    const strokeBase = 1.6;

    // Timing
    const spawnStaggerMs = 90;
    const rejectHoldMs = 650;
    const retryDelayMs = 220;
    const settleHoldMs = 1200;

    // Deterministic acceptance: first 7 pass on attempt 1, rest rejected once, then pass.
    const passesOnFirstAttempt = new Set<number>(Array.from({ length: 7 }, (_, i) => i));

    // Layout (fixed)
    const topPad = 26;
    const bottomPad = 26;
    const usableH = H - topPad - bottomPad;
    const laneGap = usableH / (lineCount + 1);

    // Agents
    const agents: LineAgent[] = [];
    const startTime = performance.now();

    function initAgents() {
      agents.length = 0;

      for (let i = 0; i < lineCount; i++) {
        const baseY = topPad + laneGap * (i + 1);

        // deterministic phase offsets
        const p1 = i * 0.77 + 1.3;
        const p2 = i * 0.41 + 2.1;
        const p3 = i * 0.93 + 0.6;

        agents.push({
          id: i,
          x: 0,
          xTarget: 0,
          speed: 2.1 + (i % 4) * 0.25,

          baseY,

          p1,
          p2,
          p3,

          state: "GROW_LEFT",
          attempt: 1,
          rejectedUntil: 0,

          coherence: 0,
          whiteness: 0,

          accepted: false,
        });
      }
    }

    initAgents();

    function resizeToBox() {
      const rect = canvas.getBoundingClientRect();
      const cssW = Math.max(1, Math.floor(rect.width));
      const cssH = Math.max(1, Math.floor(rect.height));

      canvas.width = cssW * dpr;
      canvas.height = cssH * dpr;
    }

    resizeToBox();
    const ro = new ResizeObserver(() => resizeToBox());
    ro.observe(canvas);

    // Helpers
    function chaosY(a: LineAgent, p: number, t: number) {
      // p is normalized 0..1 along current line length
      // Three layered waves, chaos is strongest when coherence is low.
      const w1 = Math.sin(p * 18 + t * 1.9 + a.p1) * 18;
      const w2 = Math.sin(p * 7 - t * 1.2 + a.p2) * 11;
      const w3 = Math.sin(p * 3.5 + t * 0.7 + a.p3) * 8;

      const chaos = w1 + w2 + w3;
      const smooth = Math.sin(p * Math.PI * 2 + t * 0.9 + a.p2) * 10;

      return a.baseY + chaos * (1 - a.coherence) + smooth * a.coherence;
    }

    function colorFor(a: LineAgent, alpha: number) {
      // left is grey, accepted transitions toward white, with a calm cool tint
      const grey = { r: 220, g: 225, b: 235 };
      const white = { r: 255, g: 255, b: 255 };
      const tint = { r: 120, g: 160, b: 255 };

      const w = clamp01(a.whiteness);
      const t = clamp01(a.coherence);

      // mix: grey -> tinted -> white
      const midR = lerp(grey.r, tint.r, 0.28);
      const midG = lerp(grey.g, tint.g, 0.28);
      const midB = lerp(grey.b, tint.b, 0.28);

      const r1 = lerp(grey.r, midR, t);
      const g1 = lerp(grey.g, midG, t);
      const b1 = lerp(grey.b, midB, t);

      const r = Math.round(lerp(r1, white.r, w));
      const g = Math.round(lerp(g1, white.g, w));
      const b = Math.round(lerp(b1, white.b, w));

      return rgba(r, g, b, alpha);
    }

    function drawGlowStroke(
      ctx: CanvasRenderingContext2D,
      points: Array<{ x: number; y: number }>,
      a: LineAgent
    ) {
      // main stroke
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // soft glow layers
      const alphaBase = 0.32 + a.whiteness * 0.22;

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      ctx.strokeStyle = colorFor(a, alphaBase * 0.28);
      ctx.lineWidth = strokeBase * 6.0;
      ctx.beginPath();
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();

      ctx.strokeStyle = colorFor(a, alphaBase * 0.45);
      ctx.lineWidth = strokeBase * 3.0;
      ctx.beginPath();
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();

      ctx.restore();

      // core stroke
      ctx.strokeStyle = colorFor(a, 0.92);
      ctx.lineWidth = strokeBase;
      ctx.beginPath();
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
    }

    // Simulation control
    let allDoneAt: number | null = null;
    let frozen = false;

    function step(now: number) {
      const elapsed = now - startTime;

      // If we freeze, we still draw once, then stop.
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Map world -> canvas pixels
      const rect = canvas.getBoundingClientRect();
      const cssW = Math.max(1, rect.width);
      const cssH = Math.max(1, rect.height);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cssW, cssH);

      // world scale
      const sx = cssW / W;
      const sy = cssH / H;

      ctx.save();
      ctx.scale(sx, sy);

      // background is transparent; page provides the dark
      // gate hint line (very subtle)
      ctx.save();
      ctx.globalAlpha = 0.06;
      ctx.strokeStyle = "white";
      ctx.lineWidth = 1;
      ctx.setLineDash([6, 10]);
      ctx.beginPath();
      ctx.moveTo(gateStart, 0);
      ctx.lineTo(gateStart, H);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // Update agents
      if (!frozen) {
        for (const a of agents) {
          const spawnDelay = a.id * spawnStaggerMs;
          if (elapsed < spawnDelay) continue;

          // Phase targets
          if (a.state === "GROW_LEFT") {
            a.xTarget = leftEnd;
          } else if (a.state === "ACCEPTING") {
            a.xTarget = W;
          } else if (a.state === "REJECTING") {
            a.xTarget = 0;
          } else if (a.state === "RETRYING") {
            a.xTarget = W;
          } else if (a.state === "DONE") {
            a.xTarget = W;
          }

          // State transitions
          if (a.state === "GROW_LEFT") {
            a.x = Math.min(a.x + a.speed, a.xTarget);

            // chaos stays chaotic while growing
            a.coherence = lerp(a.coherence, 0.0, 0.06);
            a.whiteness = lerp(a.whiteness, 0.0, 0.06);

            if (a.x >= leftEnd - 0.5) {
              a.state = "GATE_CHECK";
            }
          }

          if (a.state === "GATE_CHECK") {
            // Deterministic decision: attempt 1 only
            if (a.attempt === 1) {
              const pass = passesOnFirstAttempt.has(a.id);
              a.accepted = pass;

              if (pass) {
                a.state = "ACCEPTING";
              } else {
                a.state = "REJECTING";
                a.rejectedUntil = now + rejectHoldMs;
              }
            } else {
              // attempt 2: always accept
              a.accepted = true;
              a.state = "RETRYING";
            }
          }

          if (a.state === "ACCEPTING") {
            // push through gate and right
            a.x = Math.min(a.x + a.speed * 1.15, a.xTarget);

            // coherence rises smoothly as it passes the gate
            const gateT = clamp01((a.x - gateStart) / Math.max(1, gateEnd - gateStart));
            const cohTarget = 0.35 + 0.65 * easeInOut(gateT);
            a.coherence = lerp(a.coherence, cohTarget, 0.07);

            const whiteTarget = easeInOut(clamp01((a.x - gateStart) / (W - gateStart)));
            a.whiteness = lerp(a.whiteness, whiteTarget, 0.06);

            if (a.x >= W - 0.8) {
              a.state = "DONE";
              a.coherence = 1;
              a.whiteness = 1;
            }
          }

          if (a.state === "REJECTING") {
            // hold a moment (bounce) then return
            if (now < a.rejectedUntil) {
              // small visual tension: coherence dips slightly
              a.coherence = lerp(a.coherence, 0.08, 0.08);
              a.whiteness = lerp(a.whiteness, 0.0, 0.08);
            } else {
              // return to far left
              a.x = Math.max(a.x - a.speed * 1.35, 0);

              // chaos is damped on return
              a.coherence = lerp(a.coherence, 0.18, 0.06);
              a.whiteness = lerp(a.whiteness, 0.0, 0.06);

              if (a.x <= 0.8) {
                a.attempt = 2;
                // short delay before retry to feel like governance loop
                a.rejectedUntil = now + retryDelayMs;
                a.state = "GROW_LEFT";
                a.x = 0;
              }
            }
          }

          if (a.state === "RETRYING") {
            a.x = Math.min(a.x + a.speed * 1.2, a.xTarget);

            // second attempt is calmer sooner
            const gateT = clamp01((a.x - gateStart) / Math.max(1, gateEnd - gateStart));
            const cohTarget = 0.55 + 0.45 * easeInOut(gateT);
            a.coherence = lerp(a.coherence, cohTarget, 0.08);

            const whiteTarget = easeInOut(clamp01((a.x - gateStart) / (W - gateStart)));
            a.whiteness = lerp(a.whiteness, whiteTarget, 0.07);

            if (a.x >= W - 0.8) {
              a.state = "DONE";
              a.coherence = 1;
              a.whiteness = 1;
            }
          }

          if (a.state === "DONE") {
            a.x = W;
            a.coherence = 1;
            a.whiteness = 1;
          }
        }

        const doneCount = agents.filter((a) => a.state === "DONE").length;
        if (doneCount === lineCount) {
          if (allDoneAt === null) allDoneAt = now;
          if (allDoneAt !== null && now - allDoneAt > settleHoldMs) {
            frozen = true;
          }
        }
      }

      // Draw agents
      const t = (now - startTime) * 0.001;

      for (const a of agents) {
        const spawnDelay = a.id * spawnStaggerMs;
        if (elapsed < spawnDelay) continue;

        // When bouncing (hold), keep a.x clamped at leftEnd for a moment
        let xHead = a.x;
        if (a.state === "REJECTING" && now < a.rejectedUntil) {
          xHead = leftEnd;
        }

        // Only draw inside allowed progression
        const xLen = Math.max(0, Math.min(xHead, W));

        // Build polyline points from x=0 to x=xLen
        const pts: Array<{ x: number; y: number }> = [];
        const segs = Math.max(2, Math.floor(sampleCount * (xLen / W)));
        const n = Math.max(18, segs);

        for (let i = 0; i <= n; i++) {
          const nx = i / n;
          const x = nx * xLen;

          const p = xLen <= 1 ? 0 : x / xLen;
          const y = chaosY(a, p, t);

          pts.push({ x, y });
        }

        // If the head has not reached the gate yet, draw only in left zone.
        // This keeps the right side empty at start, by construction.
        if (xLen <= 0.5) continue;

        // Gate shaping: add a crisp alignment after gateEnd
        // The line slowly snaps to its lane after the gate.
        if (xLen > gateEnd) {
          const snapT = clamp01((xLen - gateEnd) / (W - gateEnd));
          const snap = easeInOut(snapT);

          // overwrite last third of points toward stable lane
          const startSnapX = gateEnd;
          for (let i = 0; i < pts.length; i++) {
            const px = pts[i].x;
            if (px < startSnapX) continue;

            const local = clamp01((px - startSnapX) / Math.max(1, xLen - startSnapX));
            const s = snap * easeInOut(local);

            pts[i].y = lerp(pts[i].y, a.baseY, s);
          }
        }

        // Rejected bounce visual: small kink at gate boundary
        if (a.state === "REJECTING" && now < a.rejectedUntil) {
          const kinkX = gateStart + 6;
          for (let i = 0; i < pts.length; i++) {
            const px = pts[i].x;
            if (px < gateStart - 6 || px > kinkX + 10) continue;
            const local = clamp01((px - (gateStart - 6)) / 22);
            const bump = Math.sin(local * Math.PI) * 8;
            pts[i].y += bump * 0.45;
          }
        }

        drawGlowStroke(ctx, pts, a);
      }

      ctx.restore();

      if (!frozen) {
        raf = requestAnimationFrame(step);
      }
    }

    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <section className="pt-[160px] pb-[160px] relative overflow-hidden">
      <div className="page-center max-w-[1200px]">
        <div className="relative h-[320px]">
          <canvas
            ref={canvasRef}
            className="w-full h-full overflow-visible"
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}
