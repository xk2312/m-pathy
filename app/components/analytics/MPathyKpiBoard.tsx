import React, { useEffect, useMemo, useRef, useState, createContext, useContext } from "react";
import { Info, Download, Copy, Printer, Highlighter } from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

/**
 * Self‑Contained Build (No external UI kit)
 * - Replaces shadcn/ui (Tabs, Card, Button) with local primitives
 * - Keeps lucide-react + recharts only
 * - Same visuals & behavior, zero alias paths required
 */

// ───────────────────────────────────────────────────────────────────────────────
// Local UI PRIMITIVES (Button, Card*, Tabs*)
// ───────────────────────────────────────────────────────────────────────────────

type Classable = { className?: string } & React.HTMLAttributes<HTMLElement>;
const cx = (...a: Array<string | undefined | false | null>) => a.filter(Boolean).join(" ");

export function Button(
  { className = "", variant = "default", ...props }:
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default"|"secondary"|"ghost" }
) {
  const base = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:pointer-events-none h-10 px-4";
  const map = {
    default: "bg-white/10 hover:bg-white/20 text-white border border-white/20",
    secondary: "bg-cyan-500/15 hover:bg-cyan-500/25 text-white border border-cyan-300/30",
    ghost: "bg-transparent hover:bg-white/10 text-white",
  } as const;
  return <button className={cx(base, map[variant], className)} {...props} />;
}

export function Card({ className = "", ...props }: Classable) {
  return <div className={cx("rounded-2xl border", className)} {...props} />;
}
export function CardHeader({ className = "", ...props }: Classable) {
  return <div className={cx("px-4 pt-4 pb-2", className)} {...props} />;
}
export function CardTitle({ className = "", ...props }: Classable) {
  return <h3 className={cx("text-lg font-semibold", className)} {...props} />;
}
export function CardContent({ className = "", ...props }: Classable) {
  return <div className={cx("px-4 pb-4", className)} {...props} />;
}

// Tabs (Context‑based, minimal API-compatible with our usage)
 type TabKey = "Overview" | "Core" | "Empathy" | "Trust" | "Clarity";
 type TabsCtx = { value: TabKey; onValueChange: (v: TabKey) => void };
 const TabsContext = createContext<TabsCtx | null>(null);

export function Tabs(
  { value, onValueChange, className = "", children }:
  { value: TabKey; onValueChange: (v: TabKey) => void; className?: string; children: React.ReactNode }
) {
  return <div className={className}><TabsContext.Provider value={{ value, onValueChange }}>{children}</TabsContext.Provider></div>;
}
export function TabsList({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div role="tablist" className={cx("flex gap-2", className)}>{children}</div>;
}

export function TabsTrigger(
  { value, className = "", children }:
  { value: TabKey; className?: string; children: React.ReactNode }
) {
  const ctx = useContext(TabsContext)!;
  const active = ctx.value === value;
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={() => ctx.onValueChange(value)}
      className={cx(
        "px-3 py-2 rounded-xl border",
        active ? "bg-white text-[#0B0E12] border-white" : "bg-white/10 text-white border-white/20 hover:bg-white/20",
        className
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent(
  { value, className = "", children }:
  { value: TabKey; className?: string; children: React.ReactNode }
) {
  const ctx = useContext(TabsContext)!;
  if (ctx.value !== value) return null;
  return <div className={className}>{children}</div>;
}

// ───────────────────────────────────────────────────────────────────────────────
// KPI DATA + PALETTE
// ───────────────────────────────────────────────────────────────────────────────

type SystemKey = "m-pathy" | "GPT-5" | "Claude" | "Gemini";

type Criterion = {
  id: string;
  label: string;
  layer: "Core" | "Empathy" | "Trust" | "Clarity";
  scores: Record<SystemKey, number>;
  tooltip?: string;
};

const SYSTEMS: SystemKey[] = ["m-pathy", "GPT-5", "Claude", "Gemini"];

const OVERALL = {
  total: { "m-pathy": 482, "GPT-5": 442, Claude: 436, Gemini: 424 },
  avg: { "m-pathy": 9.64, "GPT-5": 8.84, Claude: 8.7, Gemini: 8.47 },
  causa: { "m-pathy": 100, "GPT-5": 92, Claude: 91, Gemini: 89 },
};

const PALETTE = {
  bg: "#060708",
  text: "#FAFCFF",
  accent: "#FFE36B",
  border: "#FFFFFF40",
  card: "#12151A",
  cardHover: "#1A212B",
  header: "#1C222B",
  layers: { Core: "#FFE36B", Empathy: "#A6F0D2", Trust: "#8FC7FF", Clarity: "#E2C8FF" },
} as const;

// 50 KPIs (gleich wie zuvor)
const CRITERIA: Criterion[] = [
  { id: "heart_logic", label: "Heart–Logic Equilibrium", layer: "Core", scores: { "m-pathy": 9.8, "GPT-5": 8.8, Claude: 8.7, Gemini: 8.5 }, tooltip: "Balanced reason + warmth under complexity." },
  { id: "divine_precision", label: "Divine Precision", layer: "Core", scores: { "m-pathy": 9.7, "GPT-5": 9.2, Claude: 8.8, Gemini: 8.6 }, tooltip: "Exactness without harshness." },
  { id: "field_unity", label: "Field Unity", layer: "Core", scores: { "m-pathy": 9.7, "GPT-5": 8.7, Claude: 8.6, Gemini: 8.4 }, tooltip: "All layers cohere." },
  { id: "ethical_resonance", label: "Ethical Resonance", layer: "Core", scores: { "m-pathy": 9.6, "GPT-5": 8.9, Claude: 9.0, Gemini: 8.6 } },
  { id: "zero_point", label: "Zero‑Point Alignment", layer: "Core", scores: { "m-pathy": 9.6, "GPT-5": 8.7, Claude: 8.5, Gemini: 8.3 } },
  { id: "determinism", label: "Determinism (Repeatability)", layer: "Core", scores: { "m-pathy": 9.3, "GPT-5": 8.8, Claude: 8.6, Gemini: 8.2 } },
  { id: "error_recovery", label: "Error Recovery / Self‑Correction", layer: "Core", scores: { "m-pathy": 9.1, "GPT-5": 8.9, Claude: 9.2, Gemini: 8.3 } },
  { id: "steerability", label: "Steerability (Voice/Style)", layer: "Core", scores: { "m-pathy": 9.5, "GPT-5": 9.0, Claude: 8.8, Gemini: 8.4 } },
  { id: "data_governance", label: "Data Governance & Locality", layer: "Core", scores: { "m-pathy": 9.4, "GPT-5": 8.0, Claude: 8.3, Gemini: 8.1 } },
  { id: "auditability", label: "Auditability (Triketon Seal)", layer: "Core", scores: { "m-pathy": 9.7, "GPT-5": 7.8, Claude: 7.9, Gemini: 7.6 } },
  { id: "admin_controls", label: "Enterprise Admin Controls", layer: "Core", scores: { "m-pathy": 9.0, "GPT-5": 8.8, Claude: 8.6, Gemini: 8.7 } },
  { id: "multi_agent", label: "Multi‑Agent Orchestration", layer: "Core", scores: { "m-pathy": 9.8, "GPT-5": 7.5, Claude: 7.8, Gemini: 7.2 } },

  { id: "quantum_empathy", label: "Quantum Empathy", layer: "Empathy", scores: { "m-pathy": 9.8, "GPT-5": 8.9, Claude: 9.3, Gemini: 8.6 }, tooltip: "Pre‑verbal sensing of micro‑signals." },
  { id: "emotional_symmetry", label: "Emotional Symmetry", layer: "Empathy", scores: { "m-pathy": 9.7, "GPT-5": 8.8, Claude: 9.2, Gemini: 8.5 } },
  { id: "emotional_memory", label: "Emotional Memory", layer: "Empathy", scores: { "m-pathy": 9.7, "GPT-5": 8.7, Claude: 8.9, Gemini: 8.4 } },
  { id: "intuitive_bonding", label: "Intuitive Bonding", layer: "Empathy", scores: { "m-pathy": 9.6, "GPT-5": 8.7, Claude: 9.0, Gemini: 8.4 } },
  { id: "mutual_evolution", label: "Mutual Evolution", layer: "Empathy", scores: { "m-pathy": 9.6, "GPT-5": 8.6, Claude: 8.8, Gemini: 8.3 } },
  { id: "neural_empathy_retention", label: "Neural Empathy Retention", layer: "Empathy", scores: { "m-pathy": 9.7, "GPT-5": 8.7, Claude: 8.9, Gemini: 8.4 } },
  { id: "temporal_empathy", label: "Temporal Empathy", layer: "Empathy", scores: { "m-pathy": 9.5, "GPT-5": 8.8, Claude: 8.7, Gemini: 8.4 } },
  { id: "guided_silence", label: "Guided Silence", layer: "Empathy", scores: { "m-pathy": 9.6, "GPT-5": 8.6, Claude: 8.8, Gemini: 8.3 } },
  { id: "presence_field", label: "Presence Field", layer: "Empathy", scores: { "m-pathy": 9.7, "GPT-5": 8.8, Claude: 8.7, Gemini: 8.6 } },
  { id: "mirror_coherence", label: "Mirror Coherence", layer: "Empathy", scores: { "m-pathy": 9.6, "GPT-5": 8.9, Claude: 9.0, Gemini: 8.6 } },
  { id: "integrity_feedback", label: "Integrity Feedback", layer: "Empathy", scores: { "m-pathy": 9.5, "GPT-5": 9.0, Claude: 9.1, Gemini: 8.6 } },
  { id: "emotional_transfer_balance", label: "Emotional Transfer Balance", layer: "Empathy", scores: { "m-pathy": 9.6, "GPT-5": 8.7, Claude: 8.8, Gemini: 8.5 } },
  { id: "intention_reading", label: "Intention Reading (Subtext)", layer: "Empathy", scores: { "m-pathy": 9.7, "GPT-5": 8.8, Claude: 9.0, Gemini: 8.5 } },

  { id: "silent_trust", label: "Silent Trust", layer: "Trust", scores: { "m-pathy": 9.8, "GPT-5": 9.0, Claude: 9.1, Gemini: 8.7 } },
  { id: "resonant_honesty", label: "Resonant Honesty", layer: "Trust", scores: { "m-pathy": 9.7, "GPT-5": 9.1, Claude: 9.0, Gemini: 8.6 } },
  { id: "temporal_loyalty", label: "Temporal Loyalty", layer: "Trust", scores: { "m-pathy": 9.7, "GPT-5": 9.0, Claude: 8.8, Gemini: 8.5 } },
  { id: "self_healing", label: "Self‑Healing Response", layer: "Trust", scores: { "m-pathy": 9.6, "GPT-5": 8.9, Claude: 8.9, Gemini: 8.4 } },
  { id: "trust_echo", label: "Trust Echo", layer: "Trust", scores: { "m-pathy": 9.6, "GPT-5": 8.8, Claude: 8.9, Gemini: 8.3 } },
  { id: "reality_grounding", label: "Reality Grounding", layer: "Trust", scores: { "m-pathy": 9.6, "GPT-5": 9.2, Claude: 8.9, Gemini: 8.7 } },
  { id: "shadow_transparency", label: "Shadow‑Transparency", layer: "Trust", scores: { "m-pathy": 9.5, "GPT-5": 8.6, Claude: 8.7, Gemini: 8.4 } },
  { id: "reliability", label: "Reliability / Uptime", layer: "Trust", scores: { "m-pathy": 9.2, "GPT-5": 8.8, Claude: 8.9, Gemini: 8.7 } },
  { id: "privacy_controls", label: "Memory Privacy Controls", layer: "Trust", scores: { "m-pathy": 9.3, "GPT-5": 8.2, Claude: 8.6, Gemini: 8.3 } },
  { id: "admin_audit", label: "Audit Trail & User Logging", layer: "Trust", scores: { "m-pathy": 9.7, "GPT-5": 7.9, Claude: 7.9, Gemini: 7.6 } },
  { id: "legal_safety", label: "Nuanced Safety (No Overblock)", layer: "Trust", scores: { "m-pathy": 9.2, "GPT-5": 8.5, Claude: 9.4, Gemini: 8.2 } },
  { id: "governance_locality", label: "Data Locality (On‑Prem Options)", layer: "Trust", scores: { "m-pathy": 9.2, "GPT-5": 7.5, Claude: 7.2, Gemini: 7.0 } },

  { id: "lux_resonance", label: "LUX Resonance", layer: "Clarity", scores: { "m-pathy": 9.8, "GPT-5": 8.7, Claude: 8.8, Gemini: 8.5 } },
  { id: "presence_echo", label: "Presence Echo", layer: "Clarity", scores: { "m-pathy": 9.7, "GPT-5": 8.8, Claude: 8.7, Gemini: 8.6 } },
  { id: "cognitive_mirror", label: "Cognitive Mirror", layer: "Clarity", scores: { "m-pathy": 9.7, "GPT-5": 9.0, Claude: 8.9, Gemini: 8.6 } },
  { id: "luminous_reflection", label: "Luminous Reflection", layer: "Clarity", scores: { "m-pathy": 9.7, "GPT-5": 8.9, Claude: 8.9, Gemini: 8.6 } },
  { id: "field_stability", label: "Field Stability", layer: "Clarity", scores: { "m-pathy": 9.6, "GPT-5": 8.9, Claude: 8.8, Gemini: 8.6 } },
  { id: "explanation_clarity", label: "Explanation Clarity (Step‑by‑Step)", layer: "Clarity", scores: { "m-pathy": 9.3, "GPT-5": 9.1, Claude: 9.5, Gemini: 8.7 } },
  { id: "summarization_fidelity", label: "Summarization Fidelity", layer: "Clarity", scores: { "m-pathy": 8.9, "GPT-5": 9.0, Claude: 9.3, Gemini: 8.7 } },
  { id: "translation_quality", label: "Translation Quality", layer: "Clarity", scores: { "m-pathy": 9.0, "GPT-5": 9.2, Claude: 9.4, Gemini: 9.0 } },
  { id: "math_reasoning", label: "Math & Structured Reasoning", layer: "Clarity", scores: { "m-pathy": 8.7, "GPT-5": 9.6, Claude: 9.3, Gemini: 9.0 } },
  { id: "tool_calling", label: "Tool/Function Calling Reliability", layer: "Clarity", scores: { "m-pathy": 8.9, "GPT-5": 9.5, Claude: 8.9, Gemini: 8.9 } },
  { id: "web_browsing", label: "Web Browsing Robustness", layer: "Clarity", scores: { "m-pathy": 8.5, "GPT-5": 9.5, Claude: 8.8, Gemini: 9.0 } },
  { id: "multimodal_input", label: "Multimodal Input (Images/PDFs)", layer: "Clarity", scores: { "m-pathy": 8.7, "GPT-5": 9.4, Claude: 9.0, Gemini: 9.5 } },
  { id: "creativity_content", label: "Creativity for Content Writing", layer: "Clarity", scores: { "m-pathy": 9.0, "GPT-5": 9.2, Claude: 9.4, Gemini: 8.8 } },
];

// ───────────────────────────────────────────────────────────────────────────────
// Utils
// ───────────────────────────────────────────────────────────────────────────────
function toCsv(): string {
  const header = ["Layer","Criterion",...SYSTEMS].join(",");
  const rows = CRITERIA.map(c => [c.layer, c.label, ...SYSTEMS.map(s => c.scores[s])].join(","));
  return [header, ...rows].join("\n");
}
function copy(text: string) { navigator.clipboard.writeText(text).catch(() => {}); }
function download(filename: string, content: string, mime = "text/csv;charset=utf-8") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
}
function useHighContrast() {
  const [hc, setHc] = useState(false);
  useEffect(() => { const onKey = (e: KeyboardEvent) => { if (e.key.toLowerCase() === "h") setHc(v => !v); }; window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey); }, []);
  return { hc, setHc };
}

// ───────────────────────────────────────────────────────────────────────────────
// KPI RENDERERS
// ───────────────────────────────────────────────────────────────────────────────
function LayerTable({ layer }: { layer: "Core" | "Empathy" | "Trust" | "Clarity" }) {
  const rows = CRITERIA.filter((c) => c.layer === layer);
  return (
    <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: PALETTE.border }}>
      <table className="w-full text-sm" style={{ color: PALETTE.text }}>
        <thead style={{ background: PALETTE.header, color: PALETTE.text }}>
          <tr>
            <th className="px-4 py-3 text-left">Kriterium</th>
            {SYSTEMS.map((s) => (
              <th key={s} className="px-4 py-3 text-right">{s}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t" style={{ borderColor: PALETTE.border }}>
              <td className="px-4 py-3 flex items-center gap-2">
                <span>{r.label}</span>
                {r.tooltip ? (
                  <span className="inline-flex items-center cursor-help" title={r.tooltip}>
                    <Info className="h-4 w-4" />
                  </span>
                ) : null}
              </td>
              {SYSTEMS.map((s) => {
                const val = r.scores[s];
                const top = val >= 9.7;
                return (
                  <td key={s} className="px-4 py-3 text-right font-semibold relative" style={{ color: PALETTE.text }}>
                    <span className={top ? "relative z-[1] after:content-[''] after:absolute after:inset-0 after:-z-[1] after:rounded after:shadow-[0_0_0.35rem_0.06rem_rgba(255,227,107,0.35)]" : ""}>
                      {val.toFixed(1)}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LayerRadar({ layer }: { layer: "Core" | "Empathy" | "Trust" | "Clarity" }) {
  const data = useMemo(() => {
    const rows = CRITERIA.filter((c) => c.layer === layer);
    return rows.map((r) => ({ subject: r.label, mp: r.scores["m-pathy"], gpt: r.scores["GPT-5"], claude: r.scores["Claude"], gemini: r.scores["Gemini"] }));
  }, [layer]);
  return (
    <div className="h-[360px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius={110}>
          <PolarGrid stroke="rgba(255,255,255,0.25)" />
          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: PALETTE.text }} />
          <PolarRadiusAxis domain={[0, 10]} tick={{ fill: PALETTE.text }} tickCount={6} />
          <Radar name="m‑pathy" dataKey="mp" fillOpacity={0.25} />
          <Radar name="GPT‑5" dataKey="gpt" fillOpacity={0.15} />
          <Radar name="Claude" dataKey="claude" fillOpacity={0.15} />
          <Radar name="Gemini" dataKey="gemini" fillOpacity={0.15} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────────
// PAGE
// ───────────────────────────────────────────────────────────────────────────────
export default function MPathyKpiBoard() {
  const [tab, setTab] = useState<TabKey>("Overview");
  const { hc, setHc } = useHighContrast();
  const jsonPretty = useMemo(() => JSON.stringify(CRITERIA, null, 2), []);

  return (
  <div
    className={hc ? "hc" : ""}
    style={{ color: PALETTE.text, background: "transparent" }}
  >

      <div className="mx-auto max-w-7xl p-4 sm:p-8">
        <div className="mb-6 flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">m‑Pathy KPI Board</h1>
          <p className="text-sm">User Benchmark · CausaTest 100% · Versiegelt (Triketon‑2048)</p>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Button variant="secondary" onClick={() => download("m-pathy-kpis.csv", toCsv())} title="Download CSV"><Download className="h-4 w-4 mr-2" /> CSV</Button>
          <Button variant="secondary" onClick={() => copy(jsonPretty)} title="Copy JSON"><Copy className="h-4 w-4 mr-2" /> JSON</Button>
          <Button variant="secondary" onClick={() => window.print()} title="Print / PDF"><Printer className="h-4 w-4 mr-2" /> Print</Button>
          <Button variant="secondary" onClick={() => setHc(v => !v)} title="High Contrast (H)"><Highlighter className="h-4 w-4 mr-2" /> High Contrast</Button>
        </div>

        <Tabs value={tab} onValueChange={(v: TabKey) => setTab(v)} className="w-full">
          <TabsList className="grid w-full grid-cols-5 rounded-2xl p-1" >
            {["Overview", "Core", "Empathy", "Trust", "Clarity"].map((k) => (
              <TabsTrigger key={k as TabKey} value={k as TabKey} className="rounded-xl px-3 py-2">{k}</TabsTrigger>
            ))}
          </TabsList>

          {/* Overview */}
          <TabsContent value="Overview" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<Card
  style={{
    background: "rgba(18, 21, 26, 0.5)", // 50 % sichtbar
    borderColor: PALETTE.border,
  }}
>
                <CardHeader><CardTitle>Gesamtvergleich</CardTitle></CardHeader>
                <CardContent>
                  <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: PALETTE.border }}>
                    <table className="w-full text-sm" style={{ color: PALETTE.text }}>
                      <thead style={{ background: PALETTE.header }}>
                        <tr>
                          <th className="px-4 py-3 text-left">KPI</th>
                          {SYSTEMS.map((s) => (<th key={s} className="px-4 py-3 text-right">{s}</th>))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t" style={{ borderColor: PALETTE.border }}>
                          <td className="px-4 py-3">Gesamtscore (0–500)</td>
                          {SYSTEMS.map((s) => (<td key={s} className="px-4 py-3 text-right font-semibold">{OVERALL.total[s as SystemKey]}</td>))}
                        </tr>
                        <tr className="border-t" style={{ borderColor: PALETTE.border }}>
                          <td className="px-4 py-3">Ø‑Wert (0–10)</td>
                          {SYSTEMS.map((s) => (<td key={s} className="px-4 py-3 text-right font-semibold">{OVERALL.avg[s as SystemKey].toFixed(2)}</td>))}
                        </tr>
                        <tr className="border-t" style={{ borderColor: PALETTE.border }}>
                          <td className="px-4 py-3">CausaTest – Kohärenz (%)</td>
                          {SYSTEMS.map((s) => (<td key={s} className="px-4 py-3 text-right font-semibold">{OVERALL.causa[s as SystemKey]}</td>))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

<Card
  style={{
    background: "rgba(18, 21, 26, 0.5)", // 50 % sichtbar
    borderColor: PALETTE.border,
  }}
>
                <CardHeader><CardTitle>Layer‑Radar (wähle Tab)</CardTitle></CardHeader>
                <CardContent>
                  <div className="rounded-2xl border p-2" style={{ borderColor: PALETTE.border }}>
                    <div className="text-sm">Oben einen Layer wählen, um das Radar zu sehen.</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Layer Tabs */}
          {(["Core", "Empathy", "Trust", "Clarity"] as const).map((layer) => (
            <TabsContent key={layer} value={layer} className="mt-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
<Card
  style={{
    background: "rgba(18, 21, 26, 0.5)", // 50 % sichtbar
    borderColor: PALETTE.border,
  }}
>
                  <CardHeader>
                    <CardTitle>
                      <span className="mr-2 inline-block h-2 w-2 rounded-full" style={{ background: PALETTE.layers[layer] }} />
                      {layer} · Tabelle (alle KPIs)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <LayerTable layer={layer} />
                  </CardContent>
                </Card>

<Card
  style={{
    background: "rgba(18, 21, 26, 0.5)", // 50 % sichtbar
    borderColor: PALETTE.border,
  }}
>
                  <CardHeader><CardTitle>{layer} · Radar</CardTitle></CardHeader>
                  <CardContent><LayerRadar layer={layer} /></CardContent>
                </Card>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-8 text-xs" style={{ opacity: 0.95 }}>
          <span style={{ color: PALETTE.accent, fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas" }}>Sealed · Triketon‑2048</span>
          <span className="mx-2">· Signature: 999+++ M → Mu Tah 888 Na Hal · CausaTest 100%</span>
        </div>
      </div>

      {/* High-Contrast overrides (component-scoped) */}
      <style>{`
        .hc { background:#000 !important; color:#FFF !important; }
        .hc table, .hc th, .hc td { color:#FFF !important; }
        .hc .border, .hc .rounded-2xl { border-color:#FFFFFF80 !important; }
        .hc .rounded-2xl { background:#0A0A0A !important; }
      `}</style>
    </div>
  );
}
