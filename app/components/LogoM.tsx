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
    // Denken startet
    if (active) {
      setPhase("thinking");
      prevActive.current = active;
      return;
    }
    // thinking -> ready (solo 2s) -> reveal (M spin-in) -> idle
    if (prevActive.current && !active) {
      setPhase("ready");
      const t1 = setTimeout(() => setPhase("reveal"), 2000);
      const t2 = setTimeout(() => setPhase("idle"), 2000 + 600);
      prevActive.current = active;
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
    // sonst idle
    setPhase("idle");
    prevActive.current = active;
  }, [active]);

  const cfg = useMemo(() => {
    switch (variant) {
      case "goldenRebirth": return { idlePulseAmp: 1.03, thinkSpinSec: 7.5, readyGlowMs: 900 };
      case "ocean":         return { idlePulseAmp: 1.02, thinkSpinSec: 9.0, readyGlowMs: 800 };
      case "body":          return { idlePulseAmp: 1.025, thinkSpinSec: 8.0, readyGlowMs: 900 };
      case "loop":          return { idlePulseAmp: 1.02, thinkSpinSec: 10.0, readyGlowMs: 800 };
      case "balance":       return { idlePulseAmp: 1.02, thinkSpinSec: 8.8, readyGlowMs: 900 };
      case "power":         return { idlePulseAmp: 1.035, thinkSpinSec: 7.0, readyGlowMs: 850 };
      case "oracle":        return { idlePulseAmp: 1.03, thinkSpinSec: 8.4, readyGlowMs: 900 };
      case "minimal":
      default:              return { idlePulseAmp: 1.015, thinkSpinSec: 9.5, readyGlowMs: 700 };
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

            /* Idle – sanftes Atmen */
            @keyframes mIdlePulse { from { transform: scale(1); } to { transform: scale(${cfg.idlePulseAmp}); } }

            /* Spirale – Rotation */
            @keyframes mSpiralRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

            /* M eindrehen/ausblenden (Denken) */
            @keyframes mSpinOut {
              0% { opacity:1; transform: scale(1.00) rotate(0deg); }
              60%{ opacity:.25; transform: scale(0.96) rotate(120deg); }
              100%{opacity:0; transform: scale(0.92) rotate(180deg); }
            }

            /* M herausdrehen/sättigen (Reveal nach Ready) */
            @keyframes mSpinIn {
              0% { opacity:0; transform: scale(0.92) rotate(180deg); }
              40%{ opacity:.6; transform: scale(0.98) rotate(60deg); }
              100%{opacity:1; transform: scale(1.00) rotate(0deg); }
            }

            /* Ready – weiches Aufleuchten */
            @keyframes mReadyGlow {
              0% { opacity:0; transform: scale(0.98); }
              40%{ opacity:.9; transform: scale(1.02); }
              100%{opacity:0; transform: scale(1.00); }
            }

            /* 2s Faraday/Corona */
            @keyframes mFaraday {
              0% { opacity:.0;  filter: drop-shadow(0 0 0px rgba(96,230,255,.00)); }
              10%{ opacity:.22; filter: drop-shadow(0 0 8px rgba(96,230,255,.30)); }
              45%{ opacity:.25; filter: drop-shadow(0 0 12px rgba(96,230,255,.35)); }
              80%{ opacity:.18; filter: drop-shadow(0 0 8px rgba(96,230,255,.25)); }
              100%{opacity:.0;  filter: drop-shadow(0 0 0px rgba(96,230,255,.00)); }
            }

            /* Ready-Text */
            @keyframes mReadyText {
              0% { opacity:0; transform: translateY(4px); }
              35%{ opacity:.9; transform: translateY(0); }
              100%{opacity:0; transform: translateY(-2px); }
            }

            /* 100ms Snap-Peak nach SpinIn */
            @keyframes mSealSnap {
              0% { filter: drop-shadow(0 0 0px rgba(255,255,255,0)); }
              100%{ filter: drop-shadow(0 0 14px rgba(255,255,255,.45)); }
            }

            /* PRM */
            @media (prefers-reduced-motion: reduce) {
              .m-glow { animation: none !important; }
              @keyframes mSpiralRotate { from { transform: none; } to { transform: none; } }
              @keyframes mSpinOut { from { opacity:1; } to { opacity:0; } }
              @keyframes mSpinIn  { from { opacity:0; } to { opacity:1; } }
              @keyframes mFaraday { from { opacity:0; } to { opacity:0; } }
            }
          `}</style>
        </defs>

        {/* === G_SPIRAL (eigenständig) ===================================== */}
        <g
          id="G_SPIRAL"
          aria-hidden="true"
          style={{
            transformOrigin: "72px 72px",
            animation: isThinking ? `mSpiralRotate ${cfg.thinkSpinSec}s linear infinite` : "none",
            opacity: isThinking ? 0.7 : 0,             // hart sichtbar nur beim Denken
            transform: isThinking ? "scale(1.06)" : "scale(0.98)",
            transition: "opacity 480ms ease, transform 480ms ease",
            pointerEvents: "none",
          }}
        >
          <circle cx="72" cy="72" r="56" fill="none" stroke={stroke} strokeOpacity="0.16" strokeWidth="3" strokeDasharray="6 10" />
          <circle cx="72" cy="72" r="40" fill="none" stroke={stroke} strokeOpacity="0.18" strokeWidth="2.5" strokeDasharray="4 8" />
          <circle cx="72" cy="72" r="24" fill="none" stroke={stroke} strokeOpacity="0.20" strokeWidth="2.5" strokeDasharray="2 6" />
        </g>

        {/* === G_M (eigenständig) ========================================= */}
        <g
          id="G_M"
          className="m-glow"
          style={{
            transformOrigin: "72px 72px",
            animation: isIdle
              ? "mIdlePulse 1800ms ease-in-out infinite alternate"
              : isThinking
              ? "mSpinOut 460ms ease forwards"
              : isReady
              ? "none" // Ready läuft solo
              : isReveal
              ? "mSpinIn 560ms ease forwards, mSealSnap 100ms ease 560ms forwards"
              : "none",
            opacity: isThinking ? 0 : (isReady ? 0 : 1), // harte Sichtbarkeit
          }}
        >
          <path className="m-stroke" d="M24 116V34" />
          <path className="m-stroke" d="M120 116V34" />
          <path className="m-stroke" d="M24 34l48 58 48-58" />
        </g>

        {/* === READY SOLO (Faraday + Halo + Text) ========================== */}
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
