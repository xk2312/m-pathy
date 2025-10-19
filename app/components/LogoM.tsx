// components/LogoM.tsx
"use client";
import React, { useMemo } from "react";

type Variant = "pulse" | "spiral" | "snake" | "auto";
type Intensity = "normal" | "strong";

type Props = {
  size?: number;       // px, default 160
  active?: boolean;    // true => Thinking-Animation(en)
  variant?: Variant;   // "auto": idle=pulse, active=spiral+snake
  intensity?: Intensity;
};

export default function LogoM({
  size = 160,
  active = false,
  variant = "auto",
  intensity = "strong",
}: Props) {
  const stroke = "#60E6FF";
  const dashBase = "0 10";

  // Verhalten je Zustand
  const v = useMemo<Variant>(() => {
    if (variant !== "auto") return variant;
    return active ? "snake" : "pulse"; // + Spiral-Overlay (siehe below)
  }, [variant, active]);

  const amp = intensity === "strong" ? 1.06 : 1.03;         // Pump-Stärke
  const pulseAnim = active || v === "pulse" ? "mPulse 1100ms ease-in-out infinite alternate" : "none";
  const snakeAnim = active && (v === "snake" || variant === "auto") ? "mSnake 1200ms linear infinite" : "none";
  const spiralAnim = active && (v === "spiral" || variant === "auto") ? "mSpiral 2600ms ease-in-out infinite" : "none";

  return (
    <div
      role="img"
      aria-label="M"
      style={{
        width: size,
        height: size,
        display: "block",
        // Glow kräftiger, wenn aktiv
        filter: active
          ? "drop-shadow(0 0 18px rgba(96,230,255,0.55))"
          : "drop-shadow(0 0 9px rgba(96,230,255,0.28))",
        transition: "filter .25s ease",
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
            .d { fill: none; stroke: ${stroke}; stroke-width: 8; stroke-linecap: round; stroke-linejoin: round; stroke-opacity: .95; stroke-dasharray: ${dashBase}; }
            .g { filter: url(#g); }
          `}</style>
        </defs>

        {/* Spiral-Overlay (dezent), rotiert nur im Active-State */}
        <g style={{ animation: spiralAnim, transformOrigin: "72px 72px" }} aria-hidden="true">
          <circle cx="72" cy="72" r="56" fill="none" stroke={stroke} strokeOpacity="0.08" strokeWidth="2" strokeDasharray="6 10" />
          <circle cx="72" cy="72" r="40" fill="none" stroke={stroke} strokeOpacity="0.10" strokeWidth="2" strokeDasharray="4 8" />
          <circle cx="72" cy="72" r="24" fill="none" stroke={stroke} strokeOpacity="0.12" strokeWidth="2" strokeDasharray="2 6" />
        </g>

        {/* Das M – Puls + Snake laufen auf der Form, nicht am Container */}
        <g className="g" style={{ animation: pulseAnim, transformOrigin: "72px 72px" }}>
          <path className="d" style={{ animation: snakeAnim }} d="M24 116V34" />
          <path className="d" style={{ animation: snakeAnim }} d="M120 116V34" />
          <path className="d" style={{ animation: snakeAnim }} d="M24 34l48 58 48-58" />
        </g>
      </svg>

      <style jsx>{`
        /* Kräftigeres Atmen – skaliert die innere SVG-Gruppe (kein Layout-Jank) */
        @keyframes mPulse {
          from { transform: scale(1); }
          to   { transform: scale(${amp}); }
        }

        /* Snake: wandernde Strichkante auf den M-Pfaden */
        @keyframes mSnake {
          from { stroke-dashoffset: 0; }
          to   { stroke-dashoffset: -180; }
        }

        /* Spiral: sanfte Rotation + leichtes Atmen der Ringschichten */
        @keyframes mSpiral {
          0%   { transform: rotate(0deg) scale(1);    opacity: .9; }
          50%  { transform: rotate(180deg) scale(1.02); opacity: .95; }
          100% { transform: rotate(360deg) scale(1);   opacity: .9; }
        }
      `}</style>
    </div>
  );
}
