// components/LogoM.tsx
import React from "react";

type Props = {
  size?: number;      // px, default 160
  active?: boolean;   // true => Puls-Animation
};

export default function LogoM({ size = 160, active = false }: Props) {
  const stroke = "#60E6FF";
  const dash = "0 10";

  return (
    <div
      role="img"
      aria-label="M"
      style={{
        width: size,
        height: size,
        display: "block",
        filter: active
          ? "drop-shadow(0 0 14px rgba(96,230,255,0.45))"
          : "drop-shadow(0 0 8px rgba(96,230,255,0.25))",
        transition: "filter .3s ease, transform .3s ease",
        animation: active ? "mPulse 1200ms ease-in-out infinite alternate" : "none",
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
            .d { fill:none; stroke:${stroke}; stroke-width:8; stroke-linecap:round; stroke-linejoin:round; stroke-opacity:.95; stroke-dasharray:${dash}; }
            .g { filter:url(#g); }
          `}</style>
        </defs>
        <g className="g">
          <path className="d" d="M24 116V34" />
          <path className="d" d="M120 116V34" />
          <path className="d" d="M24 34l48 58 48-58" />
        </g>
      </svg>
      <style jsx>{`
        @keyframes mPulse {
          from { transform: scale(1); }
          to   { transform: scale(1.03); }
        }
      `}</style>
    </div>
  );
}
