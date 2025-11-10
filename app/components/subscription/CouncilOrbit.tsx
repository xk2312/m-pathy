"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Council = {
  id: string;
  title: string;
  subtitle: string;
};

const COUNCILS: Council[] = [
  { id: "m",          title: "M",          subtitle: "featuring Palantir" },
  { id: "m-pathy",    title: "m-pathy",    subtitle: "featuring DeepMind Core" },
  { id: "m-ocean",    title: "m-ocean",    subtitle: "featuring Anthropic Vision" },
  { id: "m-inent",    title: "m-inent",    subtitle: "featuring NASA Chronos" },
  { id: "m-erge",     title: "m-erge",     subtitle: "featuring IBM Q-Origin" },
  { id: "m-power",    title: "m-power",    subtitle: "featuring Colossus" },
  { id: "m-body",     title: "m-body",     subtitle: "featuring XAI Prime" },
  { id: "m-beded",    title: "m-beded",    subtitle: "featuring Meta Lattice" },
  { id: "m-loop",     title: "m-loop",     subtitle: "featuring OpenAI Root" },
  { id: "m-pire",     title: "m-pire",     subtitle: "featuring Amazon Nexus" },
  { id: "m-bassy",    title: "m-bassy",    subtitle: "featuring Oracle Gaia" },
  { id: "m-ballance", title: "m-ballance", subtitle: "featuring Gemini Apex" },
];

// Geometrie-Konstanten
const CX = 500, CY = 500;
const R_LABEL   = 330;  // Radius für Labels
const R_TICK_IN = 280;  // Linien innen
const R_TICK_OUT= 470;  // Linien außen
const INNER_R   = 160;  // Center-Kreis

export default function CouncilOrbit() {
  // globaler Rotationswinkel (deg)
  const [angle, setAngle] = useState(0);
  const [targetAngle, setTargetAngle] = useState<number | null>(null);
  const animRef = useRef<number | null>(null);

  // welcher Rat ist fokussiert (zeigt Panel)?
  const [focused, setFocused] = useState<Council | null>(null);
  // Hover für Microeffekt
  const [hoverId, setHoverId] = useState<string | null>(null);
  // Center-Zustand: Disc (sichtbar) oder Panel
  const [centerMode, setCenterMode] = useState<"disc" | "panel">("disc");

  // 12 Basiswinkel (0° = 12 Uhr, im Uhrzeigersinn)
  const itemAngles = useMemo(() => {
    const step = 360 / COUNCILS.length; // 30°
    return COUNCILS.map((c, i) => ({ id: c.id, theta: i * step }));
  }, []);

  // rAF: immer rechtsrum zum Ziel drehen
  useEffect(() => {
    if (targetAngle == null) return;

    let current = angle % 360;
    if (current < 0) current += 360;

    let target = targetAngle % 360;
    if (target < 0) target += 360;

    // rechtsrum erzwingen
    if (target <= current) target += 360;

    const speed = 2.4; // deg pro Frame (~144 deg/s @60fps)

    const tick = () => {
      current += speed;
      if (current >= target) {
        const final = target % 360;
        setAngle(final);
        setTargetAngle(null);
        animRef.current = null;
        return;
      }
      setAngle(current);
      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      animRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetAngle]);

  // Sobald Drehung fertig und etwas fokussiert ist → Panel einblenden
  useEffect(() => {
    if (targetAngle === null && focused) {
      setCenterMode("panel");
    }
  }, [targetAngle, focused]);

  // Helpers
  const toRad = (deg: number) => (deg - 90) * (Math.PI / 180);
  const posOnCircle = (thetaDeg: number, r: number) => {
    const a = toRad(thetaDeg);
    return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) };
    };

  const onHover = (id: string | null) => setHoverId(id);

  const onSelect = (c: Council) => {
    // Panel erst nach Ankunft → vorerst Disc
    setCenterMode("disc");
    setFocused(c);

    // Zielwinkel bestimmen: Item oben (0°) → angle_target = -base
    const base = itemAngles.find(a => a.id === c.id)?.theta ?? 0;
    setTargetAngle(-base);
  };

  const onClose = () => {
    // Panel aus, Disc zurück; Orbit richtet sich auf 0°
    setFocused(null);
    setCenterMode("disc");
    setTargetAngle(0);
  };

  return (
    <div className="mx-auto w-full max-w-[900px] p-4">
      <svg
        viewBox="0 0 1000 1000"
        role="img"
        aria-label="Council of 12"
        className="block w-full h-auto"
      >
        <defs>
          {/* sanft getönter Hintergrund (13%) */}
          <radialGradient id="wash" cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor="#000" stopOpacity="0.13" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.13" />
          </radialGradient>

          {/* Hover-Arc Highlight */}
          <linearGradient id="hl" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0"   stopColor="#fff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0.85" />
            <stop offset="1"   stopColor="#fff" stopOpacity="0" />
          </linearGradient>

          <style>
            {`
              .label { transition: transform .18s ease, opacity .18s ease, letter-spacing .18s ease; transform-box: fill-box; transform-origin: center; }
              .label.hover { transform: translateY(-2px) scale(1.04); letter-spacing: .3px; }
              .tick { transition: opacity .18s ease; }
              .tick.hover { opacity: .95; }
              .arc { opacity: 0; transition: opacity .18s ease; }
              .arc.show { opacity: .9; }

              .center-disc, .center-card { transform-origin: ${CX}px ${CY}px; }
              .center-disc { transition: transform .28s ease, opacity .28s ease; }
              .center-disc.hide { transform: scale(0.75); opacity: 0; }
              .center-disc.show { transform: scale(1);    opacity: .95; }

              .center-card { transition: transform .25s ease, opacity .2s ease; }
              .center-card.enter { transform: scale(1);   opacity: 1; }
              .center-card.exit  { transform: scale(.95); opacity: 0; }
            `}
          </style>
        </defs>

        {/* leicht abgetönter Panel-Hintergrund */}
        <rect x="0" y="0" width="1000" height="1000" fill="url(#wash)" />

        {/* ORBIT – rotiert komplett */}
        <g transform={`rotate(${angle} ${CX} ${CY})`}>
          {/* 60 Linien (Iris) */}
          {Array.from({ length: 60 }).map((_, i) => {
            const theta = i * 6; // 6° Schritt
            const p1 = posOnCircle(theta, R_TICK_IN);
            const p2 = posOnCircle(theta, R_TICK_OUT);
            const thick = i % 5 === 0;

            const isHovered = (() => {
              if (!hoverId) return false;
              const base = itemAngles.find(a => a.id === hoverId)?.theta ?? 0;
              const local = (base + angle) % 360; // aktueller Winkel im gedrehten Raum
              const diff = Math.min(
                Math.abs(((theta - local + 360) % 360)),
                Math.abs(((local - theta + 360) % 360))
              );
              return diff < 7.6; // ~±7.5°
            })();

            return (
              <line
                key={`tick-${i}`}
                x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                stroke={thick ? "#ffffff" : "#00ffff"}
                strokeOpacity={thick ? 0.75 : 0.35}
                strokeWidth={thick ? 1.6 : 0.5}
                className={`tick ${isHovered ? "hover" : ""}`}
                strokeLinecap="round"
              />
            );
          })}

          {/* 12 Räte */}
          {COUNCILS.map((c, idx) => {
            const base = itemAngles[idx].theta;
            const labelPos = posOnCircle(base, R_LABEL);

            // kleiner Arc-Sweep unter dem Label (±10°)
            const arcInner = 300, arcOuter = 350;
            const a1 = base - 10, a2 = base + 10;
            const a1i = posOnCircle(a1, arcInner), a1o = posOnCircle(a1, arcOuter);
            const a2i = posOnCircle(a2, arcInner), a2o = posOnCircle(a2, arcOuter);
            const largeArc = Math.abs(a2 - a1) > 180 ? 1 : 0;

            const hovered = hoverId === c.id;

            return (
              <g key={c.id}>
                {/* Hover-Arc */}
                <path
                  d={`M ${a1i.x} ${a1i.y}
                      A ${arcInner} ${arcInner} 0 ${largeArc} 1 ${a2i.x} ${a2i.y}
                      L ${a2o.x} ${a2o.y}
                      A ${arcOuter} ${arcOuter} 0 ${largeArc} 0 ${a1o.x} ${a1o.y}
                      Z`}
                  fill="url(#hl)"
                  className={`arc ${hovered ? "show" : ""}`}
                />

                {/* Label – horizontal halten: Konterrotation -angle */}
                <g
                  transform={`translate(${labelPos.x} ${labelPos.y}) rotate(${-angle} 0 0)`}
                  style={{ cursor: "pointer" }}
                  aria-label={c.title}
                  role="button"
                  tabIndex={0}
                  onMouseEnter={() => onHover(c.id)}
                  onMouseLeave={() => onHover(null)}
                  onClick={() => onSelect(c)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") onSelect(c);
                  }}
                >
                  <text
                    className={`label ${hovered ? "hover" : ""}`}
                    textAnchor="middle"
                    fill="#fff"
                    fontFamily="Garamond, serif"
                    fontSize={20}
                  >
                    {c.title}
                  </text>
                  <text
                    className={`label ${hovered ? "hover" : ""}`}
                    y={20}
                    textAnchor="middle"
                    fill="#fff"
                    opacity={0.9}
                    fontFamily="Garamond, serif"
                    fontSize={14}
                  >
                    {c.subtitle}
                  </text>
                </g>

                {/* größere unsichtbare Trefferfläche */}
                <circle
                  cx={labelPos.x}
                  cy={labelPos.y - 6}
                  r={32}
                  fill="transparent"
                  onMouseEnter={() => onHover(c.id)}
                  onMouseLeave={() => onHover(null)}
                  onClick={() => onSelect(c)}
                />
              </g>
            );
          })}
        </g>

        {/* CENTER: Disc ist im Idle sichtbar, verschwindet wenn Panel aktiv wird */}
        <g className={`center-disc ${centerMode === "disc" ? "show" : "hide"}`}>
          <circle cx={CX} cy={CY} r={INNER_R} fill="rgba(255,255,255,.03)" />
          <circle cx={CX} cy={CY} r={INNER_R - 1} stroke="#fff" strokeOpacity=".06" fill="none" />
        </g>

        {/* CENTER: Panel erscheint erst nach Drehende */}
        {focused && centerMode === "panel" && (
          <g className="center-card enter" transform={`translate(${CX} ${CY})`}>
            <circle r={INNER_R} fill="rgba(0,0,0,0.55)" stroke="#fff" strokeOpacity="0.06" />
            <text
              x={0}
              y={-10}
              textAnchor="middle"
              fill="#fff"
              fontFamily="Garamond, serif"
              fontSize={26}
            >
              {focused.title}
            </text>
            <text
              x={0}
              y={20}
              textAnchor="middle"
              fill="#C7C7C7"
              fontFamily="Garamond, serif"
              fontSize={16}
            >
              {focused.subtitle}
            </text>

            {/* Close */}
            <g
              transform={`translate(${INNER_R - 18} ${-INNER_R + 18})`}
              role="button"
              tabIndex={0}
              style={{ cursor: "pointer" }}
              onClick={onClose}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClose(); }}
            >
              <circle r="12" fill="#fff" fillOpacity="0.9" />
              <text
                y="4"
                textAnchor="middle"
                fontFamily="system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
                fontSize="14"
                fill="#000"
              >
                ×
              </text>
            </g>
          </g>
        )}
      </svg>
    </div>
  );
}
