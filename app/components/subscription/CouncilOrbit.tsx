"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLang } from "@/app/providers/LanguageProvider";
import { i18n } from "@/lib/i18n";

type CouncilItem = {
  title: string;
  subtitle: string;
  kpi?: { superpower: string; focus: string; signal: string };
};

const CX = 500,
  CY = 500;

// Krone um 80 % verkleinert
const R_LABEL = 264;     // 330 * 0.8
const R_TICK_IN = 224;   // 280 * 0.8
const R_TICK_OUT = 376;  // 470 * 0.8

const INNER_R = 160;     // Center-Panel bleibt unverändert


const COUNCIL_IDS = [
  "m",
  "m-pathy",
  "m-ocean",
  "m-inent",
  "m-erge",
  "m-power",
  "m-body",
  "m-beded",
  "m-loop",
  "m-pire",
  "m-bassy",
  "m-ballance",
] as const;
type CouncilId = (typeof COUNCIL_IDS)[number];

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
    () =>
      COUNCIL_IDS.map((id, i) => ({
        id,
        theta: i * (360 / COUNCIL_IDS.length),
      })),
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
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
        animRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetAngle]);

  const toRad = (deg: number) => (deg - 90) * (Math.PI / 180);
  const posOnCircle = (thetaDeg: number, r: number) => {
    const a = toRad(thetaDeg);
    return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) };
  };

  const onSelect = (id: CouncilId) => {
    const base = itemAngles.find((a) => a.id === id)?.theta ?? 0;
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
  <div className="mx-auto w-full max-w-[900px] px-2 py-4">
      <svg
        viewBox="0 0 1000 1000"
        className="block h-auto w-full"
        role="img"
        aria-label="Council of 12"
      >
                <defs>
          {/* sehr leichter globaler Wash – Voia bleibt Bühne */}
          <radialGradient id="wash" cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor="#000" stopOpacity="0.03" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.06" />
          </radialGradient>

          {/* Highlight für die kleinen Arcs hinter den Labels */}
          <linearGradient id="hl" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0.85" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>

          {/* Mercury-Pulse – flüssiger Silber-Halo hinter den KI-Labels */}
          <radialGradient id="mercuryGradient" cx="50%" cy="50%" r="0.9">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#e5f7ff" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#00ffff" stopOpacity="0.0" />
          </radialGradient>

          <style>
            {`
              .label {
                transition:
                  transform .22s cubic-bezier(0.25, 0.8, 0.25, 1),
                  opacity .22s cubic-bezier(0.25, 0.8, 0.25, 1),
                  letter-spacing .22s cubic-bezier(0.25, 0.8, 0.25, 1);
                transform-box: fill-box;
                transform-origin: center;
              }
              .label.hover {
                transform: translateY(-2px) scale(1.04);
                letter-spacing: .3px;
              }

              .tick {
                transition: opacity .22s cubic-bezier(0.25, 0.8, 0.25, 1);
              }
              .tick.hover {
                opacity: .95;
              }

              .arc {
                opacity: 0;
                transition: opacity .22s cubic-bezier(0.25, 0.8, 0.25, 1);
              }
              .arc.show {
                opacity: .9;
              }

              .center-card {
                transition:
                  opacity .22s cubic-bezier(0.25, 0.8, 0.25, 1),
                  transform .28s cubic-bezier(0.25, 0.8, 0.25, 1);
              }

              /* Mercury-Halo hinter den KI-Labels */
              .halo {
                fill: url(#mercuryGradient);
                opacity: 0.32;
                transform-box: fill-box;
                transform-origin: center;
                transition:
                  opacity .6s cubic-bezier(0.25, 0.8, 0.25, 1),
                  transform .6s cubic-bezier(0.25, 0.8, 0.25, 1);
              }
              .halo-pulse {
                animation: haloPulse 5.2s ease-in-out infinite;
              }

              @keyframes haloPulse {
                0%   { transform: scale(1);    opacity: 0.26; }
                40%  { transform: scale(1.06); opacity: 0.40; }
                100% { transform: scale(1);    opacity: 0.26; }
              }

              /* KPI-HTML im foreignObject */
              .kpi {
                color: rgba(255,255,255,0.88);
                font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, "Liberation Mono", Consolas, monospace;
                font-size: 13px;
                line-height: 1.45;
                text-align: left;
                word-break: break-word;
                hyphens: auto;
                text-shadow: 0 0 3px rgba(255,255,255,0.15);
                margin-bottom: 0;
              }
              .kpi p { margin: 0; }
              .kpi p + p { margin-top: 8px; }
            `}
          </style>
        </defs>


        {/* sanfter Hintergrund – Voia bleibt im Lead */}
        <rect x="0" y="0" width="1000" height="1000" fill="url(#wash)" />

                {/* Orbit */}
        <g transform={`rotate(${angle} ${CX} ${CY})`}>
 {/* Ticks / Strahlen */}
{Array.from({ length: 60 }).map((_, i) => {
  const theta = i * 6;

  // Basislängen
  const fullLength = R_TICK_OUT - R_TICK_IN;
  const lengthWhite = fullLength * 0.2*0.618;      // weiße = 20 % der alten Länge
  const lengthCyan = lengthWhite * 1.382;    // cyan ≈ 1.382 × weiß

  const thick = i % 5 === 0;

  const p1 = posOnCircle(theta, R_TICK_IN);
  const p2 = posOnCircle(
    theta,
    R_TICK_IN + (thick ? lengthWhite : lengthCyan)
  );

  const isHovered = (() => {
    if (!hoverId) return false;
    const base = itemAngles.find((a) => a.id === hoverId)?.theta ?? 0;
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
      x1={p1.x}
      y1={p1.y}
      x2={p2.x}
      y2={p2.y}
      stroke={thick ? "#ffffff" : "#00ffff"}
      strokeOpacity={thick ? 0.8 : 0.35}
      strokeWidth={thick ? 1.6 : 0.5}
      className={`tick ${isHovered ? "hover" : ""}`}
      strokeLinecap="round"
    />
  );
})}


          {/* Labels & Arcs */}
          {itemAngles.map(({ id, theta }) => {
            const item = getItem(id as CouncilId);
            const labelPos = posOnCircle(theta, R_LABEL);

            const arcInner = 300,
              arcOuter = 350;
            const a1 = theta - 10,
              a2 = theta + 10;
            const a1i = posOnCircle(a1, arcInner),
              a1o = posOnCircle(a1, arcOuter);
            const a2i = posOnCircle(a2, arcInner),
              a2o = posOnCircle(a2, arcOuter);
            const largeArc = Math.abs(a2 - a1) > 180 ? 1 : 0;
            const hovered = hoverId === id;

            return (
              <g key={id}>
            
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
                    if (e.key === "Enter" || e.key === " ")
                      onSelect(id as CouncilId);
                  }}
                >
                  {/* Mercury-Pulse-Halo hinter Titel & Subtitle */}
<rect
  className={`halo ${
    hovered || focused === (id as CouncilId)
      ? "halo-pulse"
      : ""
  }`}
  x={-120}
  y={-30}
  width={240}
  height={60}   // unten mehr Raum
  rx={24}
/>

<text
  className={`label ${hovered ? "hover" : ""}`}
  y={-2}
  textAnchor="middle"
  fill="var(--pp-cyan-line, #22d3ee)"
  opacity={0.95}
  fontFamily="Garamond, serif"
  fontSize={20}
>
  {item.title}
</text>
<text
  className={`label ${hovered ? "hover" : ""}`}
  y={18}
  textAnchor="middle"
  fill="var(--pp-cyan-line, #22d3ee)"
  opacity={0.8}
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

        {/* Center-Panel – 30px nach oben verschoben */}
       {focusedItem && (
  <g
    className="center-card"
    opacity={1}
    transform={`translate(${CX} ${CY - 60})`}
  >

            <circle
              r={INNER_R}
              fill="rgba(0,0,0,0.55)"
              stroke="#00ff88"
              strokeOpacity="0.08"
            />

                        {/* Titel & Subtitle der KI */}
            <text
              x={0}
              y={-30}
              textAnchor="middle"
              fill="var(--pp-cyan-line, #22d3ee)"
              fontFamily='ui-monospace, SFMono-Regular, Menlo, Monaco, "Liberation Mono", Consolas, monospace'
              fontSize={22}
              style={{ textShadow: "0 0 6px rgba(34,211,238,0.35)" }}
            >
              {focusedItem.title}
            </text>
            <text
              x={0}
              y={-8}
              textAnchor="middle"
              fill="var(--pp-cyan-line, #22d3ee)"
              fontFamily='ui-monospace, SFMono-Regular, Menlo, Monaco, "Liberation Mono", Consolas, monospace'
              fontSize={13}
              opacity={0.9}
            >
              {focusedItem.subtitle}
            </text>


            {/* HTML + Button in EINEM foreignObject = Flow funktioniert */}
<foreignObject
  x={-INNER_R + 18}
  y={8}
  width={INNER_R * 2 - 36}
  height={INNER_R * 2 - 20}
>
  {/* viel mehr Raum */}
  <div style={{ display: "flex", flexDirection: "column" }}>

    <div className="kpi">
      <p>{`> superpower: ${focusedKpi.superpower}`}</p>
      <p>{`> focus: ${focusedKpi.focus}`}</p>
      <p>{`> signal: ${focusedKpi.signal}`}</p>
    </div>

    {/* ECHTER Buffer */}
    <div style={{ height: "20px" }} />

    {/* CTA-BUTTON */}
    <button
      style={{
        alignSelf: "center",
        padding: "16px 26px",
        borderRadius: "16px",
        border: "1px solid var(--pp-cyan-line, #22d3ee)",
        background: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(6px)",
        color: "var(--pp-cyan-line, #22d3ee)",
        fontFamily:
          'ui-monospace, SFMono-Regular, Menlo, Monaco, "Liberation Mono", Consolas, monospace',
        fontSize: "18px",
        cursor: "pointer",
        boxShadow: "0 0 20px rgba(34,211,238,0.5)",
        transition: "box-shadow .18s ease, transform .18s ease",
      }}
    >
      {(active["council.visit_label"] ?? "Visit {{name}}").replace(
        "{{name}}",
        focusedItem?.title ?? ""
      )}
    </button>
  </div>
</foreignObject>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "24px",
                }}
              >
                <button
                  style={{
                    padding: "16px 26px",
                    borderRadius: "16px",
                    border: "1px solid var(--pp-cyan-line, #22d3ee)",
                    background: "rgba(0,0,0,0.45)",
                    backdropFilter: "blur(6px)",
                    color: "var(--pp-cyan-line, #22d3ee)",
                    fontFamily:
                      'ui-monospace, SFMono-Regular, Menlo, Monaco, "Liberation Mono", Consolas, monospace',
                    fontSize: "18px",
                    cursor: "pointer",
                    boxShadow: "0 0 20px rgba(34,211,238,0.5)",
                    transition: "box-shadow .18s ease, transform .18s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 0 26px rgba(34,211,238,0.65)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 0 20px rgba(34,211,238,0.5)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                  onClick={() => {
                    const name = focusedItem?.title ?? "";
                    const tmpl =
                      active["council.prompt_template"] ?? "@{{name}}";
                    const final = tmpl.replace("{{name}}", name);
                    const encoded = encodeURIComponent(final);
                    window.location.href = `/page2?prefill=${encoded}`;
                  }}
                >
                  {(active["council.visit_label"] ?? "Visit {{name}}").replace(
                    "{{name}}",
                    focusedItem?.title ?? ""
                  )}
                </button>
              </div>

            {/* Close-Button */}
            <g
              transform={`translate(${INNER_R - 18} ${-INNER_R + 18})`}
              onClick={onClose}
              role="button"
              tabIndex={0}
              style={{ cursor: "pointer" }}
            >
              <circle r="12" fill="var(--pp-cyan-line, #22d3ee)" />
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
