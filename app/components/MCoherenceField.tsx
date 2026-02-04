"use client";

import React, { useEffect, useMemo, useRef } from "react";

type LineState = {
  id: number;

  basePhase: number;
  baseFrequency: number;
  baseAmplitude: number;

  drift: number;

  noiseSeed: number;

  opacityBias: number;
  strokeBias: number;

  chaosMixA: number;
  chaosMixB: number;
  chaosMixC: number;

  coherentOffset: number;
};

type Props = {
  paths?: number; // default 16
  points?: number; // default 240
  width?: number; // default 1200
  height?: number; // default 320
  durationToCoherenceSec?: number; // default 18
  maxAmplitude?: number; // default 34
};

function clamp01(x: number): number {
  if (x < 0) return 0;
  if (x > 1) return 1;
  return x;
}

function smoothstep01(x: number): number {
  const t = clamp01(x);
  return t * t * (3 - 2 * t);
}

function easeInOutSine01(x: number): number {
  const t = clamp01(x);
  return 0.5 - 0.5 * Math.cos(Math.PI * t);
}

function mix(a: number, b: number, t: number): number {
  return a * (1 - t) + b * t;
}

/**
 * Deterministic PRNG (Mulberry32).
 * Stable across mounts as long as the seed is stable.
 */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash1(n: number): number {
  const x = Math.sin(n) * 43758.5453123;
  return x - Math.floor(x);
}

/**
 * 1D value noise: deterministic, smooth enough for "foggy" chaos.
 */
function noise1D(x: number, seed: number): number {
  const xi = Math.floor(x);
  const xf = x - xi;

  const a = hash1((xi + 0) * 12.9898 + seed * 78.233);
  const b = hash1((xi + 1) * 12.9898 + seed * 78.233);

  const u = xf * xf * (3 - 2 * xf);
  return mix(a, b, u) * 2 - 1; // -1..1
}

/**
 * Fractal noise: few octaves for richer chaos without looking "gamey".
 */
function fbm1D(x: number, seed: number): number {
  let v = 0;
  let amp = 0.55;
  let freq = 1.0;

  for (let o = 0; o < 4; o++) {
    v += noise1D(x * freq, seed + o * 19.19) * amp;
    freq *= 2.0;
    amp *= 0.5;
  }
  return v;
}

function makeLines(count: number, seed: number): LineState[] {
  const rnd = mulberry32(seed);

  const lines: LineState[] = [];
  for (let i = 0; i < count; i++) {
    const r1 = rnd();
    const r2 = rnd();
    const r3 = rnd();
    const r4 = rnd();
    const r5 = rnd();
    const r6 = rnd();
    const r7 = rnd();
    const r8 = rnd();
    const r9 = rnd();
    const r10 = rnd();
    const r11 = rnd();
    const r12 = rnd();

    lines.push({
      id: i,

      basePhase: r1 * Math.PI * 2,
      baseFrequency: 2.5 + r2 * 6.0,
      baseAmplitude: 10 + r3 * 20,

      drift: 0.55 + r4 * 1.4,

      noiseSeed: Math.floor((r5 * 1e6) % 999999),

      opacityBias: 0.18 + r6 * 0.55,
      strokeBias: 0.8 + r7 * 1.35,

      chaosMixA: 0.6 + r8 * 0.7,
      chaosMixB: 0.6 + r9 * 0.7,
      chaosMixC: 0.6 + r10 * 0.7,

      coherentOffset: (r11 - 0.5) * 12 + (i - (count - 1) / 2) * (2.0 + r12 * 0.8),
    });
  }

  return lines;
}

export default function MCoherenceField(props: Props) {
  const {
    paths = 16,
    points = 240,
    width = 1200,
    height = 320,
    durationToCoherenceSec = 18,
    maxAmplitude = 34,
  } = props;

  const svgRef = useRef<SVGSVGElement | null>(null);
  const pathRefs = useRef<Array<SVGPathElement | null>>([]);

  const lines = useMemo(() => {
    // Stable seed. You can later thread this from a canonical MAIOS seed.
    return makeLines(Math.max(12, Math.min(18, paths)), 13371337);
  }, [paths]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    // Guard: ensure all path refs exist
    const ready = lines.every((_, idx) => !!pathRefs.current[idx]);
    if (!ready) return;

    let rafId = 0;
    let startTs = 0;

    // Shared coherent law
    const coherentBaseFreq = 2.25;
    const coherentPhaseSpeed = 0.42;
    const coherentAmp = Math.min(22, maxAmplitude * 0.65);

    // Chaos law (problem state)
    const chaosGlobalSpeed = 1.35;

    // End state micro drift (very small, very slow)
    const microDriftSpeed = 0.08;
    const microDriftAmp = 2.2;

    // Spatial settings
    const centerY = height / 2;
    const xScale = width;
    const yScale = 1;

    // Coherence ramp settings
    const durationMs = Math.max(8000, durationToCoherenceSec * 1000);
    const holdAfter = true;

    const buildPathD = (line: LineState, T: number, C: number): string => {
      let d = "M ";

      // local time for this line
      const tLocal = T * line.drift + line.basePhase;

      // coherent phase (shared), with tiny line offset
      const phi = T * coherentPhaseSpeed + line.coherentOffset * 0.01;

      // A: chaotic components (incompatible layers)
      // Use p-space to induce local order but global conflict
      for (let i = 0; i <= points; i++) {
        const p = i / points;
        const x = p * xScale;

        const wA = Math.sin((p * line.baseFrequency * 2.6 + tLocal * chaosGlobalSpeed) * 1.0);
        const wB = Math.sin((p * (line.baseFrequency * 0.9 + 4.2) - tLocal * 0.72) * 1.0);
        const wC = Math.sin((p * (line.baseFrequency * 0.35 + 7.8) + tLocal * 0.33) * 1.0);

        const n = fbm1D(p * 6.0 + T * 0.22, line.noiseSeed) * 1.0;

        const chaos =
          wA * (line.baseAmplitude * line.chaosMixA) +
          wB * (line.baseAmplitude * 0.7 * line.chaosMixB) +
          wC * (line.baseAmplitude * 0.5 * line.chaosMixC) +
          n * (line.baseAmplitude * 0.55);

        // B: coherent target (shared channel, stable)
        const coherent =
          Math.sin(p * Math.PI * 2 * coherentBaseFreq + phi) * coherentAmp +
          Math.sin(p * Math.PI * 2 * (coherentBaseFreq * 0.5) + phi * 0.7) * (coherentAmp * 0.22);

        // micro drift remains in end state (very small)
        const micro =
          Math.sin(p * Math.PI * 2 * 0.9 + T * microDriftSpeed + line.basePhase) * microDriftAmp;

        // reduce chaos amplitude as coherence rises
        const chaosDamped = chaos * (1 - C);

        // coherent dominates as C rises, micro always present but subtle
        const y =
          centerY +
          (chaosDamped + coherent * C + micro) * yScale;

        d += `${x.toFixed(2)},${y.toFixed(2)} `;
      }

      return d;
    };

    const applyStyle = (line: LineState, C: number, idx: number) => {
      const p = pathRefs.current[idx];
      if (!p) return;

      // In chaos, opacity varies more across lines; in coherence it homogenizes.
      const chaosOpacity = 0.12 + line.opacityBias * 0.55;
      const coherentOpacity = 0.28 + 0.18 * (1 - Math.abs((idx - (lines.length - 1) / 2) / lines.length));

      const opacity = mix(chaosOpacity, coherentOpacity, C);

      // Stroke width stabilizes and compresses as coherence rises.
      const chaosStroke = 0.8 + line.strokeBias * 0.9;
      const coherentStroke = 1.15 + (idx % 3) * 0.15;

      const strokeWidth = mix(chaosStroke, coherentStroke, C);

      p.style.opacity = `${opacity.toFixed(3)}`;
      p.style.strokeWidth = `${strokeWidth.toFixed(2)}`;
    };

    const frame = (ts: number) => {
      if (!startTs) startTs = ts;

      const elapsed = ts - startTs;

      // Global time in seconds, calm pace
      const T = elapsed / 1000;

      // Coherence ramp: 0..1, monotonic, no return
      // Use easing so the transition feels like "it always worked".
      const raw = elapsed / durationMs;
      const eased = easeInOutSine01(raw);
      const C = holdAfter ? clamp01(eased) : eased;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const p = pathRefs.current[i];
        if (!p) continue;

        applyStyle(line, C, i);

        const d = buildPathD(line, T, C);
        p.setAttribute("d", d);
      }

      rafId = requestAnimationFrame(frame);
    };

    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [lines, points, width, height, durationToCoherenceSec, maxAmplitude]);

  const viewBox = `0 0 ${width} ${height}`;

  return (
    <section className="pt-[160px] pb-[160px] relative overflow-hidden">
      <div className="page-center max-w-[1200px]">
        <div className="relative h-[320px]">
          <svg
            ref={svgRef}
            width="100%"
            height={height}
            viewBox={viewBox}
            preserveAspectRatio="none"
            className="overflow-visible"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="cohFieldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                <stop offset="18%" stopColor="rgba(140,180,255,0.18)" />
                <stop offset="50%" stopColor="rgba(120,160,255,0.85)" />
                <stop offset="82%" stopColor="rgba(140,180,255,0.18)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>

              <filter id="cohFieldGlow">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {lines.map((line, idx) => {
              return (
                <path
                  key={line.id}
                  ref={(el) => {
                    pathRefs.current[idx] = el;
                  }}
                  d=""
                  fill="none"
                  stroke="url(#cohFieldGradient)"
                  filter="url(#cohFieldGlow)"
                  strokeLinecap="round"
                />
              );
            })}
          </svg>
        </div>
      </div>
    </section>
  );
}
