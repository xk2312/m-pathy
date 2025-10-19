// components/LogoM.tsx
"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import type { MVariant } from "@/config/mLogoConfig";

type Phase = "idle" | "thinking" | "ready";

type Props = {
  size?: number;          // px – wird im Theater skaliert, 160 ist fein
  active?: boolean;       // true → Denken
  variant?: MVariant;     // zentrale Umschaltstelle kommt aus config
};

export default function LogoM({
  size = 160,
  active = false,
  variant = "goldenRebirth",
}: Props) {
  const stroke = "#60E6FF";

  // Phase-Automat (ready = kurzer, beruhigender Abschluss nach Denken)
  const prevActive = useRef(active);
  const [phase, setPhase] = useState<Phase>(active ? "thinking" : "idle");

  useEffect(() => {
    if (active) {
      setPhase("thinking");
    } else if (prevActive.current && !active) {
      setPhase("ready");
      const t = setTimeout(() => setPhase("idle"), 1100); // sanfte Rückkehr
      return () => clearTimeout(t);
    } else {
      setPhase("idle");
    }
    prevActive.current = active;
  }, [active]);

  // Variantenset – alles ruhig, keine „Zitteraal“-Energie
  const cfg = useMemo(() => {
    switch (variant) {
      case "goldenRebirth":
        return {
          idlePulseAmp: 1.03,      // sanftes Atmen
          thinkSpinSec: 7.5,       // ruhige Spiral-Drehung (Uhrzeigersinn)
          readyGlowMs: 900,
        };
      case "ocean":
        return { idlePulseAmp: 1.02, thinkSpinSec: 9, readyGlowMs: 800 };
      case "body":
        return { idlePulseAmp: 1.025, thinkSpinSec: 8, readyGlowMs: 900 };
      case "loop":
        return { idlePulseAmp: 1.02, thinkSpinSec: 10, readyGlowMs: 800 };
      case "balance":
        return { idlePulseAmp: 1.02, thinkSpinSec: 8.8, readyGlowMs: 900 };
      case "power":
        return { idlePulseAmp: 1.035, thinkSpinSec: 7, readyGlowMs: 850 };
      case "oracle":
        return { idlePulseAmp: 1.03, thinkSpinSec: 8.4, readyGlowMs: 900 };
      case "minimal":
      default:
        return { idlePulseAmp: 1.015, thinkSpinSec: 9.5, readyGlowMs: 700 };
    }
  }, [variant]);

  const isIdle = phase === "idle";
  const isThinking = phase === "thinking";
  const isReady = phase === "ready";

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

            /* ruhiges Atmen (nur in idle) */
            @keyframes mIdlePulse {
              from { transform: scale(1); }
              to   { transform: scale(${cfg.idlePulseAmp}); }
            }

            /* Uhrzeiger-Spirale – dezent, smooth */
            @keyframes mSpiralRotate {
              from { transform: rotate(0deg); }
              to   { transform: rotate(360deg); }
            }

            /* Ready-Moment: kurzes, weiches Aufleuchten */
            @keyframes mReadyGlow {
              0%   { opacity: 0; transform: scale(0.98); }
              40%  { opacity: .9; transform: scale(1.02); }
              100% { opacity: 0; transform: scale(1.00); }
            }

            /* „Ready“-Text sanft ein-/ausblenden */
            @keyframes mReadyText {
              0%   { opacity: 0; transform: translateY(4px); }
              35%  { opacity: .9; transform: translateY(0); }
              100% { opacity: 0; transform: translateY(-2px); }
            }
          `}</style>
        </defs>

        {/* Spiral-Layer (nur beim Denken sichtbar) */}
        <g
          aria-hidden="true"
          style={{
            transformOrigin: "72px 72px",
            animation: isThinking ? `mSpiralRotate ${cfg.thinkSpinSec}s linear infinite` : "none",
            opacity: isThinking ? 0.35 : 0,
            transition: "opacity .4s ease",
          }}
        >
          <circle cx="72" cy="72" r="56" fill="none" stroke={stroke} strokeOpacity="0.08" strokeWidth="2" strokeDasharray="6 10" />
          <circle cx="72" cy="72" r="40" fill="none" stroke={stroke} strokeOpacity="0.10" strokeWidth="2" strokeDasharray="4 8" />
          <circle cx="72" cy="72" r="24" fill="none" stroke={stroke} strokeOpacity="0.12" strokeWidth="2" strokeDasharray="2 6" />
        </g>

        {/* M-Form – atmet nur im Idle, bleibt ruhig beim Denken */}
        <g
          className="m-glow"
          style={{
            transformOrigin: "72px 72px",
            animation: isIdle ? "mIdlePulse 1800ms ease-in-out infinite alternate" : "none",
          }}
        >
          <path className="m-stroke" d="M24 116V34" />
          <path className="m-stroke" d="M120 116V34" />
          <path className="m-stroke" d="M24 34l48 58 48-58" />
        </g>

        {/* Ready-Halo */}
        <g
          aria-hidden="true"
          style={{
            opacity: isReady ? 1 : 0,
            animation: isReady ? `mReadyGlow ${cfg.readyGlowMs}ms ease-out` : "none",
            transformOrigin: "72px 72px",
          }}
        >
          <circle cx="72" cy="72" r="62" fill="none" stroke={stroke} strokeOpacity="0.22" strokeWidth="3" />
          <circle cx="72" cy="72" r="68" fill="none" stroke={stroke} strokeOpacity="0.12" strokeWidth="2" />
        </g>

        {/* Ready-Text (sprachneutral – UI setzt Text daneben, hier minimalistisch) */}
        {isReady && (
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
        )}
      </svg>
    </div>
  );
}
