// components/LogoM.tsx
"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import type { MVariant } from "@/config/mLogoConfig";

type Phase = "idle" | "thinking" | "ready" | "reveal";

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
  // Denken startet
  if (active) {
    setPhase("thinking");
    prevActive.current = active;
    return;
  }

  // Wechsel von thinking -> ready -> reveal -> idle
  if (prevActive.current && !active) {
    setPhase("ready");                     // Ready SOLO
    const t1 = setTimeout(() => setPhase("reveal"), 2000);  // 2s Faraday/Ready
    const t2 = setTimeout(() => setPhase("idle"),   2000 + 600); // 600ms SpinIn
    prevActive.current = active;
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }

  // sonst: idle
  setPhase("idle");
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
  const isReveal = phase === "reveal";

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

            /* M: Eindrehen & Verblassen → Denken beginnt */
            @keyframes mSpinOut {
              0%   { opacity: 1;   transform: scale(1.00) rotate(0deg);    }
              60%  { opacity: .25; transform: scale(0.96) rotate(120deg);  }
              100% { opacity: 0;   transform: scale(0.92) rotate(180deg);  }
            }

            /* Accessibility: reduziere Bewegungen */
            @media (prefers-reduced-motion: reduce) {
              @keyframes mSpinOut { from { opacity:1; } to { opacity:0; } }
              @keyframes mSpinIn  { from { opacity:0; } to { opacity:1; } }
              @keyframes mSpiralRotate { from { transform: none; } to { transform: none; } }
            }

            /* Ready-Moment: kurzes, weiches Aufleuchten */
            @keyframes mReadyGlow {
              0%   { opacity: 0; transform: scale(0.98); }
              40%  { opacity: .9; transform: scale(1.02); }
              100% { opacity: 0; transform: scale(1.00); }
            }

                        /* M: Herausdrehen & Sättigen → Antwort da (Ready) */
            @keyframes mSpinIn {
              0%   { opacity: 0;   transform: scale(0.92) rotate(180deg); }
              40%  { opacity: .6;  transform: scale(0.98) rotate(60deg);  }
              100% { opacity: 1;   transform: scale(1.00) rotate(0deg);   }
            }

            /* 2s Faraday/E-Halo – dezente elektrische Corona */
            @keyframes mFaraday {
              0%   { opacity: .0;  filter: drop-shadow(0 0 0px rgba(96,230,255,.00)); }
              10%  { opacity: .22; filter: drop-shadow(0 0 8px rgba(96,230,255,.30)); }
              45%  { opacity: .25; filter: drop-shadow(0 0 12px rgba(96,230,255,.35)); }
              80%  { opacity: .18; filter: drop-shadow(0 0 8px rgba(96,230,255,.25)); }
              100% { opacity: .0;  filter: drop-shadow(0 0 0px rgba(96,230,255,.00)); }
            }

            /* Still-Frame-Siegel – 100ms Peak direkt nach SpinIn */
            @keyframes mSealSnap {
              0%   { filter: drop-shadow(0 0 0px rgba(255,255,255,0)); }
              100% { filter: drop-shadow(0 0 14px rgba(255,255,255,.45)); }
            }

          `}</style>
        </defs>

        {/* Spiral-Layer (nur beim Denken sichtbar, weicher Übergang) */}
        <g
            aria-hidden="true"
            style={{
              transformOrigin: "72px 72px",
              animation: isThinking ? `mSpiralRotate ${cfg.thinkSpinSec}s linear infinite` : "none",
              opacity: isThinking ? 0.7 : (isReady ? 0 : 0),
              transform: isThinking ? "scale(1.06)" : "scale(0.98)",
              transition: "opacity 480ms ease, transform 480ms ease",
            }}
          >



                    <circle cx="72" cy="72" r="56" fill="none" stroke={stroke} strokeOpacity="0.16" strokeWidth="3" strokeDasharray="6 10" />
                    <circle cx="72" cy="72" r="40" fill="none" stroke={stroke} strokeOpacity="0.18" strokeWidth="2.5" strokeDasharray="4 8" />
                    <circle cx="72" cy="72" r="24" fill="none" stroke={stroke} strokeOpacity="0.20" strokeWidth="2.5" strokeDasharray="2 6" />
                  </g>

                  {/* M-Form – atmet im Idle, bewegt sich ruhig beim Denken */}
                <g
            className="m-glow"
            style={{
              transformOrigin: "72px 72px",
              animation: isIdle
              ? "mIdlePulse 1800ms ease-in-out infinite alternate"
              : isThinking
              ? "mSpinOut 460ms ease forwards"
              : isReady
              ? "none"                                // Ready läuft solo!
              : isReveal
              ? "mSpinIn 560ms ease forwards, mSealSnap 100ms ease 560ms forwards"
              : "none",

            }}
          >


          <path className="m-stroke" d="M24 116V34" />
          <path className="m-stroke" d="M120 116V34" />
          <path className="m-stroke" d="M24 34l48 58 48-58" />
        </g>

            
              {/* Faraday/E-Halo – 2s nach Antwort, dezent */}
              {isReady && (
                <g aria-hidden="true" style={{ animation: "mFaraday 2000ms ease-out forwards" }}>
                  {Array.from({ length: 16 }).map((_, i) => {
                    const angle = (i / 16) * Math.PI * 2;
                    const x1 = 72 + Math.cos(angle) * 30;
                    const y1 = 72 + Math.sin(angle) * 30;
                    const x2 = 72 + Math.cos(angle) * 68;
                    const y2 = 72 + Math.sin(angle) * 68;
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
              )}

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

        {/* Ready-Text */}
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
