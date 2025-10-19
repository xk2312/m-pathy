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
        width: size,
        height: size,
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

        {/* === G_SPIRAL — Golden Helix (Aurea) =================================== */}
<g
  id="G_SPIRAL"
  className="m-glow"
  aria-hidden="true"
  style={{
    transformOrigin: "72px 72px",
    animation: isThinking
      ? `mSpiralRotate ${cfg.thinkSpinSec}s linear infinite, mSpiralPulse 2.8s ease-in-out infinite`
      : "none",
    transform: isThinking ? "scale(1.06)" : "scale(0.98)",
    transition: "transform 480ms ease",
    pointerEvents: "none",
  }}
>
  <path
    d="
      M72,72
      m0,-56
      a56,56 0 1,1 0.001,112
      a34,34 0 1,0 0,-68
      a21,21 0 1,1 0,42
      a13,13 0 1,0 0,-26
    "
    fill="none"
    stroke={stroke}
    strokeWidth="3.5"
    strokeOpacity="0.45"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{
      opacity: isThinking ? 0.85 : 0,
      transition: "opacity 400ms ease",
      filter: "drop-shadow(0 0 10px rgba(96,230,255,0.45))",
    }}
  />
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
              ? "mSpinOut 460ms ease forwards"           // nur Transform
              : isReady
              ? "none"                                    // Ready solo
              : isReveal
              ? "mSpinIn 560ms ease forwards, mSealSnap 100ms ease 560ms forwards"
              : "none",
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

        {/* === READY SOLO (Faraday + Halo + Text) ============================ */}
        {isReady && (
          <>
            {/* Faraday/Corona */}
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

            {/* Ready-Halo */}
            <g aria-hidden="true" style={{ animation: `mReadyGlow ${cfg.readyGlowMs}ms ease-out` }}>
              <circle cx="72" cy="72" r="62" fill="none" stroke={stroke} strokeOpacity="0.22" strokeWidth="3" />
              <circle cx="72" cy="72" r="68" fill="none" stroke={stroke} strokeOpacity="0.12" strokeWidth="2" />
            </g>

            {/* Ready-Text */}
            <g style={{ animation: "mReadyText 900ms ease-out forwards" }}>
              <text
                x="72" y="78"
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
