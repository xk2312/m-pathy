// components/LogoM.tsx
"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import type { MVariant } from "@/config/mLogoConfig";

type Phase = "idle" | "thinking" | "ready" | "reveal";

type Props = {
  size?: number;        // px – wird im Theater skaliert
  active?: boolean;     // true => Denken
  variant?: MVariant;   // zentrale Umschaltstelle aus config
};

export default function LogoM({
  size = 160,
  active = false,
  variant = "goldenRebirth",
}: Props) {
  // 🔽 responsive Anpassung: kleiner auf Mobile
  const finalSize =
    typeof window !== "undefined" && window.innerWidth < 768 ? size * 0.55 : size;

  const stroke = "#60E6FF";

  // Phase-Automat
  const prevActive = useRef(active);
  const [phase, setPhase] = useState<Phase>(active ? "thinking" : "idle");

  useEffect(() => {
    if (active) {
      setPhase("thinking");
      prevActive.current = active;
      return;
    }
    if (prevActive.current && !active) {
      setPhase("ready"); // Ready solo (2s), dann Reveal (M spin-in), dann Idle
      const t1 = setTimeout(() => setPhase("reveal"), 2000);
      const t2 = setTimeout(() => setPhase("idle"),   2000 + 600);
      prevActive.current = active;
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
    setPhase("idle");
    prevActive.current = active;
  }, [active]);

  const cfg = useMemo(() => {
    switch (variant) {
      case "goldenRebirth": return { idlePulseAmp: 1.03, thinkSpinSec: 7.5, readyGlowMs: 900 };
      case "ocean":         return { idlePulseAmp: 1.02, thinkSpinSec: 9.0, readyGlowMs: 800 };
      case "body":          return { idlePulseAmp: 1.025, thinkSpinSec: 8.0, readyGlowMs: 900 };
      case "loop":          return { idlePulseAmp: 1.02,  thinkSpinSec: 10.0, readyGlowMs: 800 };
      case "balance":       return { idlePulseAmp: 1.02,  thinkSpinSec: 8.8,  readyGlowMs: 900 };
      case "power":         return { idlePulseAmp: 1.035, thinkSpinSec: 7.0,  readyGlowMs: 850 };
      case "oracle":        return { idlePulseAmp: 1.03,  thinkSpinSec: 8.4,  readyGlowMs: 900 };
      case "minimal":
      default:              return { idlePulseAmp: 1.015, thinkSpinSec: 9.5,  readyGlowMs: 700 };
    }
  }, [variant]);

  const isIdle    = phase === "idle";
  const isThinking= phase === "thinking";
  const isReady   = phase === "ready";
  const isReveal  = phase === "reveal";

  return (
    <div
  role="img"
  aria-label="M"
  style={{
    width: finalSize,
    height: finalSize,

        display: "block",
        filter: isReady
          ? "drop-shadow(0 0 22px rgba(96,230,255,0.55))"
          : isThinking
          ? "drop-shadow(0 0 16px rgba(96,230,255,0.42))"
          : "drop-shadow(0 0 9px rgba(96,230,255,0.28))",
        transition: "filter .35s ease", 
      }}
    >
      <svg
        viewBox="0 0 144 144"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <filter id="g" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" /><feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <style>{`
            .m-stroke { fill:none; stroke:${stroke}; stroke-width:8; stroke-linecap:round; stroke-linejoin:round; stroke-opacity:.95; }
            .m-glow   { filter:url(#g); }

            /* Idle – sanftes Atmen (nur Transform, kein Opacity an der Gruppe) */
            @keyframes mIdlePulse { from { transform: scale(1); } to { transform: scale(${cfg.idlePulseAmp}); } }

            /* Spirale – Rotation (nur Transform an der Gruppe) */
            @keyframes mSpiralRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

            /* Spirale – zarte Glow-Pulse-Aura */
            @keyframes mSpiralPulse {
              0%, 100% { filter: drop-shadow(0 0 6px rgba(96,230,255,0.25)); }
              50%      { filter: drop-shadow(0 0 12px rgba(96,230,255,0.45)); }
            }

            /* M eindrehen (Denken) – NUR Transform an der Gruppe) */
            @keyframes mSpinOut {
              0%   { transform: scale(1.00) rotate(0deg); }
              60%  { transform: scale(0.96) rotate(120deg); }
              100% { transform: scale(0.92) rotate(180deg); }
            }

            /* M herausdrehen (Reveal) – NUR Transform an der Gruppe */
            @keyframes mSpinIn {
              0%   { transform: scale(0.92) rotate(180deg); }
              40%  { transform: scale(0.98) rotate(60deg);  }
              100% { transform: scale(1.00) rotate(0deg);   }
            }

            /* Ready – weiches Aufleuchten */
            @keyframes mReadyGlow {
              0%   { opacity:0; transform: scale(0.98); }
              40%  { opacity:.9; transform: scale(1.02); }
              100% { opacity:0; transform: scale(1.00); }
            }

            /* 2s Faraday/Corona */
            @keyframes mFaraday {
              0%   { opacity:.0;  filter: drop-shadow(0 0 0px rgba(96,230,255,.00)); }
              10%  { opacity:.22; filter: drop-shadow(0 0 8px rgba(96,230,255,.30)); }
              45%  { opacity:.25; filter: drop-shadow(0 0 12px rgba(96,230,255,.35)); }
              80%  { opacity:.18; filter: drop-shadow(0 0 8px rgba(96,230,255,.25)); }
              100% { opacity:.0;  filter: drop-shadow(0 0 0px rgba(96,230,255,.00)); }
            }

            /* Ready-Text */
            @keyframes mReadyText {
              0%   { opacity:0; transform: translateY(4px); }
              35%  { opacity:.9; transform: translateY(0); }
              100% { opacity:0; transform: translateY(-2px); }
            }
            /* Smooth Fade-In fürs M nach Ready (kein Drehen) */
            @keyframes fadeIn {
              from { opacity: 0; transform: scale(0.94); }
              to   { opacity: 1; transform: scale(1.00); }
            }

            /* 100ms Snap-Peak nach SpinIn (nur Glanz, kein Visibility) */
            @keyframes mSealSnap {
              0%   { filter: drop-shadow(0 0 0px rgba(255,255,255,0)); }
              100% { filter: drop-shadow(0 0 14px rgba(255,255,255,.45)); }
            }

            /* PRM */
            @media (prefers-reduced-motion: reduce) {
              .m-glow { animation: none !important; }
              @keyframes mSpiralRotate { from { transform: none; } to { transform: none; } }
              @keyframes mSpiralPulse { from { filter: none; } to { filter: none; } }
              @keyframes mSpinOut { from { transform: none; } to { transform: none; } }
              @keyframes mSpinIn  { from { transform: none; } to { transform: none; } }
              @keyframes mFaraday { from { opacity:0; } to { opacity:0; } }
            }
          `}</style>
        </defs>

   {/* === G_SPIRAL — Starlight Filament (true spiral + dash trail) ======= */}
<g
  id="G_SPIRAL"
  className="m-glow"
  aria-hidden="true"
  style={{
    transformOrigin: "72px 72px",
    animation: isThinking ? `mSpiralRotate ${cfg.thinkSpinSec}s linear infinite` : "none",
    transform: isThinking ? "scale(1.05)" : "scale(0.98)",
    transition: "transform 480ms ease",
    pointerEvents: "none",
  }}
>
  <defs>
    <linearGradient id="filamentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%"   stopColor="#60E6FF" stopOpacity="0" />
      <stop offset="50%"  stopColor="#60E6FF" stopOpacity="0.95" />
      <stop offset="100%" stopColor="#60E6FF" stopOpacity="0" />
    </linearGradient>
  </defs>

  <path
    d={
      (() => {
        const cx = 72, cy = 72;
        const a = 3.2, b = 0.20, rMax = 52, turns = 3.2, steps = 240;
        let d = "", started = false;
        for (let i = 0; i <= steps; i++) {
          const t = (i / steps) * (Math.PI * 2 * turns);
          const r = a * Math.exp(b * t);
          if (r > rMax) break;
          const x = cx + r * Math.cos(t);
          const y = cy + r * Math.sin(t);
          d += (started ? ` L ${x.toFixed(2)} ${y.toFixed(2)}` : `M ${x.toFixed(2)} ${y.toFixed(2)}`);
          started = true;
        }
        return d;
      })()
    }
    fill="none"
    stroke="url(#filamentGradient)"
    strokeWidth={4}
    strokeLinecap="round"
    strokeLinejoin="round"
    vectorEffect="non-scaling-stroke"
    strokeDasharray="28 420"
    strokeDashoffset={isThinking ? 0 : 448}
    style={{
      opacity: isThinking ? 0.95 : 0,
      transition: "opacity 320ms ease, stroke-dashoffset 2.2s linear",
      animation: isThinking ? "dashMove 2.2s linear infinite" : "none",
    }}
  />

  <style>{`
    @keyframes dashMove {
      from { stroke-dashoffset: 448; }
      to   { stroke-dashoffset: 0; }
    }
  `}</style>
</g>
        {/* === G_M (Parent bleibt sichtbar; Kinder regeln Sichtbarkeit) ======= */}
        <g
          id="G_M"
          className="m-glow"
          style={{
            transformOrigin: "72px 72px",
            animation: isIdle
            ? "mIdlePulse 1800ms ease-in-out infinite alternate"
            : isThinking
            ? "mSpinOut 460ms ease forwards"             // M ausblenden beim Denken
            : isReady
            ? "none"                                      // Ready läuft solo (Faraday + Text)
            : isReveal
            ? "fadeIn 600ms ease forwards"                // ← nur sanftes Einblenden, kein Spin/Snap
            : "none",
          opacity: isReveal ? 0 : undefined,
          }}
        >
          <path
            className="m-stroke" d="M24 116V34"
            style={{ opacity: (isThinking || isReady) ? 0 : 1, transition: "opacity 200ms ease" }}
          />
          <path
            className="m-stroke" d="M120 116V34"
            style={{ opacity: (isThinking || isReady) ? 0 : 1, transition: "opacity 200ms ease" }}
          />
          <path
            className="m-stroke" d="M24 34l48 58 48-58"
            style={{ opacity: (isThinking || isReady) ? 0 : 1, transition: "opacity 200ms ease" }}
          />
        </g>

        {/* === READY SOLO (Faraday + Text only, no Halo/Circle) ============== */}
{isReady && (
  <>
    {/* Faraday/Corona – kurzer elektrischer Effekt */}
    <g aria-hidden="true" style={{ animation: "mFaraday 2000ms ease-out forwards" }}>
      {Array.from({ length: 16 }).map((_, i) => {
        const a = (i / 16) * Math.PI * 2;
        const x1 = 72 + Math.cos(a) * 30;
        const y1 = 72 + Math.sin(a) * 30;
        const x2 = 72 + Math.cos(a) * 68;
        const y2 = 72 + Math.sin(a) * 68;
        return (
          <line
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={stroke}
            strokeOpacity={0.22}
            strokeWidth={1.5}
            strokeDasharray="2 6"
          />
        );
      })}
    </g>

    {/* Ready-Text */}
    <g style={{ animation: "mReadyText 900ms ease-out forwards" }}>
      <text
        x="72"
        y="78"
        textAnchor="middle"
        fontSize="18"
        fontWeight="600"
        fill={stroke}
        fillOpacity="0.9"
        style={{ letterSpacing: "0.6px" }}
      >
        Ready
      </text>
    </g>
  </>
)}
      </svg>
    </div>
  );
}
