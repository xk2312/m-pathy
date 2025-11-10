"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLang } from "@/app/providers/LanguageProvider";
import { i18n } from "@/lib/i18n";

type CouncilItem = {
  title: string;
  subtitle: string;
  kpi?: { superpower: string; focus: string; signal: string };
};

const CX = 500, CY = 500;
const R_LABEL = 330;
const R_TICK_IN = 280;
const R_TICK_OUT = 470;
const INNER_R = 160;

const COUNCIL_IDS = [
  "m", "m-pathy", "m-ocean", "m-inent", "m-erge", "m-power",
  "m-body", "m-beded", "m-loop", "m-pire", "m-bassy", "m-ballance",
] as const;
type CouncilId = typeof COUNCIL_IDS[number];

export default function CouncilOrbit() {
  const { lang } = useLang();
  const active =
    (i18n as Record<string, any>)[(lang || "en").slice(0, 2)] ?? i18n.en;

  const getItem = (id: CouncilId): CouncilItem =>
    active?.council?.items?.[id] ?? { title: id, subtitle: "" };

  const [angle, setAngle] = useState(0);
  const [targetAngle, setTargetAngle] = useState<number | null>(null);
  const animRef = useRef<number | null>(null);

  const [focused, setFocused] = useState<CouncilId | null>(null);
  const [hoverId, setHoverId] = useState<CouncilId | null>(null);

  const itemAngles = useMemo(
    () => COUNCIL_IDS.map((id, i) => ({ id, theta: i * (360 / COUNCIL_IDS.length) })),
    []
  );

  useEffect(() => {
    if (targetAngle == null) return;

    let current = angle % 360;
    if (current < 0) current += 360;

    let target = targetAngle % 360;
    if (target < 0) target += 360;
    if (target <= current) target += 360;

    const speed = 2.4;
    const tick = () => {
      current += speed;
      if (current >= target) {
        setAngle(target % 360);
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

  const toRad = (deg: number) => (deg - 90) * (Math.PI / 180);
  const posOnCircle = (thetaDeg: number, r: number) => {
    const a = toRad(thetaDeg);
    return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) };
  };

  const onSelect = (id: CouncilId) => {
    const base = itemAngles.find(a => a.id === id)?.theta ?? 0;
    const desired = -base;
    setTargetAngle(desired);
    setFocused(id);
  };
  const onClose = () => {
    setFocused(null);
    setTargetAngle(0);
  };

  const focusedItem: CouncilItem | null = focused ? getItem(focused) : null;
  const focusedKpi = focusedItem?.kpi ?? {
    superpower: "",
    focus: "",
    signal: "",
  };

  return (
    <div className="mx-auto w-full max-w-[900px] p-4">
      <svg
        viewBox="0 0 1000 1000"
        className="block w-full h-auto"
        role="img"
        aria-label="Council of 12"
      >
        <defs>
          <radialGradient id="wash" cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor="#000" stopOpacity="0.13" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.13" />
          </radialGradient>

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
              .center-card { transition: opacity .18s ease, transform .25s ease; }

              /* KPI-HTML im foreignObject */
              .kpi {
                color: #7CFF7C;
                font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, "Liberation Mono", Consolas, monospace;
                font-size: 13px;
                line-height: 1.45;
                text-align: left;
                word-break: break-word;
                hyphens: auto;
                text-shadow: 0 0 4px rgba(0,255,120,0.25);
              }
              .kpi p { margin: 0; }
              .kpi p + p { margin-top: 6px; }
            `}
          </style>
        </defs>

        {/* sanfter Hintergrund */}
        <rect x="0" y="0" width="1000" height="1000" fill="url(#wash)" />

        {/* Orbit */}
        <g transform={`rotate(${angle} ${CX} ${CY})`}>
          {Array.from({ length: 60 }).map((_, i) => {
            const theta = i * 6;
            const p1 = posOnCircle(theta, R_TICK_IN);
            const p2 = posOnCircle(theta, R_TICK_OUT);
            const thick = i % 5 === 0;

            const isHovered = (() => {
              if (!hoverId) return false;
              const base = itemAngles.find(a => a.id === hoverId)?.theta ?? 0;
              const local = (base + angle) % 360;
              const diff = Math.min(
                Math.abs(((theta - local + 360) % 360)),
                Math.abs(((local - theta + 360) % 360))
              );
              return diff < 7.6;
            })();

            return (
              <line
                key={`t-${i}`}
                x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                stroke={thick ? "#ffffff" : "#00ffff"}
                strokeOpacity={thick ? 0.75 : 0.35}
                strokeWidth={thick ? 1.6 : 0.5}
                className={`tick ${isHovered ? "hover" : ""}`}
                strokeLinecap="round"
              />
            );
          })}

          {itemAngles.map(({ id, theta }) => {
            const item = getItem(id as CouncilId);
            const labelPos = posOnCircle(theta, R_LABEL);

            const arcInner = 300, arcOuter = 350;
            const a1 = theta - 10, a2 = theta + 10;
            const a1i = posOnCircle(a1, arcInner), a1o = posOnCircle(a1, arcOuter);
            const a2i = posOnCircle(a2, arcInner), a2o = posOnCircle(a2, arcOuter);
            const largeArc = Math.abs(a2 - a1) > 180 ? 1 : 0;
            const hovered = hoverId === id;

            return (
              <g key={id}>
                <path
                  d={`M ${a1i.x} ${a1i.y}
                      A ${arcInner} ${arcInner} 0 ${largeArc} 1 ${a2i.x} ${a2i.y}
                      L ${a2o.x} ${a2o.y}
                      A ${arcOuter} ${arcOuter} 0 ${largeArc} 0 ${a1o.x} ${a1o.y}
                      Z`}
                  fill="url(#hl)"
                  className={`arc ${hovered ? "show" : ""}`}
                />

                {/* Gegenrotation, damit Labels horizontal bleiben */}
                <g
                  transform={`translate(${labelPos.x} ${labelPos.y}) rotate(${-angle} 0 0)`}
                  style={{ cursor: "pointer" }}
                  aria-label={item.title}
                  role="button"
                  tabIndex={0}
                  onMouseEnter={() => setHoverId(id as CouncilId)}
                  onMouseLeave={() => setHoverId(null)}
                  onClick={() => onSelect(id as CouncilId)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") onSelect(id as CouncilId);
                  }}
                >
                  <text
                    className={`label ${hovered ? "hover" : ""}`}
                    textAnchor="middle"
                    fill="#fff"
                    fontFamily="Garamond, serif"
                    fontSize={20}
                  >
                    {item.title}
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
                    {item.subtitle}
                  </text>
                </g>

                {/* größerer Hotspot */}
                <circle
                  cx={labelPos.x}
                  cy={labelPos.y - 6}
                  r={32}
                  fill="transparent"
                  onMouseEnter={() => setHoverId(id as CouncilId)}
                  onMouseLeave={() => setHoverId(null)}
                  onClick={() => onSelect(id as CouncilId)}
                />
              </g>
            );
          })}
        </g>

        {/* Center-Panel */}
        {focusedItem && (
          <g className="center-card" opacity={1} transform={`translate(${CX} ${CY})`}>
            <circle r={INNER_R} fill="rgba(0,0,0,0.55)" stroke="#00ff88" strokeOpacity="0.08" />

            <text
              x={0}
              y={-30}
              textAnchor="middle"
              fill="#9AFB8F"
              fontFamily='ui-monospace, SFMono-Regular, Menlo, Monaco, "Liberation Mono", Consolas, monospace'
              fontSize={22}
              style={{ textShadow: "0 0 6px rgba(0,255,120,0.35)" }}
            >
              {focusedItem.title}
            </text>
            <text
              x={0}
              y={-8}
              textAnchor="middle"
              fill="#BFFFC2"
              fontFamily='ui-monospace, SFMono-Regular, Menlo, Monaco, "Liberation Mono", Consolas, monospace'
              fontSize={13}
              opacity={0.9}
            >
              {focusedItem.subtitle}
            </text>

            {/* HTML im Kreis – bricht automatisch um */}
            <foreignObject
              x={-INNER_R + 18}
              y={8}
              width={INNER_R * 2 - 36}
              height={INNER_R * 2 - 56}
            >
              <div className="kpi">
                <p>{`> superpower: ${focusedKpi.superpower}`}</p>
                <p>{`> focus: ${focusedKpi.focus}`}</p>
                <p>{`> signal: ${focusedKpi.signal}`}</p>
              </div>
            </foreignObject>

            {/* Close */}
            <g
              transform={`translate(${INNER_R - 18} ${-INNER_R + 18})`}
              onClick={onClose}
              role="button"
              tabIndex={0}
              style={{ cursor: "pointer" }}
            >
              <circle r="12" fill="#7CFF7C" />
              <text
                y="4"
                textAnchor="middle"
                fontFamily='ui-monospace, SFMono-Regular, Menlo, Monaco, "Liberation Mono", Consolas, monospace'
                fontSize="14"
                fill="#001b0b"
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
