'use client';

import React, { useEffect, useMemo, useState, createContext, useContext } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

/** 
 * USP Board — Standalone TSX (pretty UI + animated radar grid)
 * - No shadcn/ui or icon libs needed
 * - Crisp dark cards, tabs, buttons
 * - High-contrast toggle (H)
 * - CSV/JSON/Print
 * - Animated lattice behind Radar
 */

/* ========== tiny UI toolkit (scoped to .usp) ========== */
type DivProps = React.HTMLAttributes<HTMLDivElement>;
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" };

function cx(...xs: Array<string | undefined | false | null>) { return xs.filter(Boolean).join(" "); }

function Button({ variant = "ghost", className, ...props }: ButtonProps) {
  return (
    <button
      className={cx(
        "usp-btn",
        variant === "primary" ? "usp-btn--primary" : "usp-btn--ghost",
        className
      )}
      {...props}
    />
  );
}

function Card({ className, ...props }: DivProps) { return <div className={cx("usp-card", className)} {...props} />; }
function CardHeader({ className, ...props }: DivProps) { return <div className={cx("usp-card__header", className)} {...props} />; }
function CardTitle({ className, ...props }: DivProps) { return <h2 className={cx("usp-card__title", className)} {...props} />; }
function CardContent({ className, ...props }: DivProps) { return <div className={cx("usp-card__content", className)} {...props} />; }

/* ========== tabs (simple controlled) ========== */
type TabsCtx = { value: string; setValue: (v: string) => void };
const TabsContext = createContext<TabsCtx | null>(null);

function Tabs({ value, onValueChange, children, className }: { value: string; onValueChange: (v: string) => void; children: React.ReactNode; className?: string }) {
  return <TabsContext.Provider value={{ value, setValue: onValueChange }}><div className={className}>{children}</div></TabsContext.Provider>;
}
function TabsList({ className, ...props }: DivProps) { return <div className={cx("usp-tabs", className)} {...props} />; }
function TabsTrigger({ value, children }: { value: string; children: React.ReactNode }) {
  const ctx = useContext(TabsContext)!; const active = ctx.value === value;
  return (
    <button
      className={cx("usp-tab", active && "is-active")}
      onClick={() => ctx.setValue(value)}
    >{children}</button>
  );
}
function TabsContent({ value, children }: { value: string; children: React.ReactNode }) {
  const ctx = useContext(TabsContext)!;
  if (ctx.value !== value) return null;
  return <div>{children}</div>;
}

/* ========== types & palette ========== */
type SystemKey = "M" | "ChatGPT" | "Grok" | "Gemini";
type Layer = "Architecture" | "Cognitive" | "Empathy" | "Governance" | "Ecosystem" | "Vision";
type Criterion = { id: string; label: string; layer: Layer; scores: Record<SystemKey, number>; tooltip?: string; };

const SYSTEMS: SystemKey[] = ["M", "Gemini", "ChatGPT", "Grok"];

const PALETTE = {
  bg: "#0A0C10",
  text: "#F7FAFF",
  accent: "#FFE36B",
  border: "rgba(255,255,255,0.16)",
  card: "#12161D",
  cardHeader: "#18202A",
  layer: { Architecture: "#FFE36B", Cognitive: "#8FC7FF", Empathy: "#A6F0D2", Governance: "#FFB2B2", Ecosystem: "#C2E8FF", Vision: "#E2C8FF" },
} as const;

/* ========== data (unchanged) ========== */
const CRITERIA: Criterion[] = [
  // Architecture
  { id:"arch_orchestrator", label:"Multi-Agent Orchestrator", layer:"Architecture", scores:{ M:9.8, Gemini:7.2, ChatGPT:7.8, Grok:7.0 }, tooltip:"Systemic orchestration: councils/flows/roles" },
  { id:"arch_audit", label:"Auditability (Seals/Trails)", layer:"Architecture", scores:{ M:9.7, Gemini:7.6, ChatGPT:7.9, Grok:6.8 }, tooltip:"Triketon-2048, logs, traceability" },
  { id:"arch_controls", label:"Admin / Policy Controls", layer:"Architecture", scores:{ M:9.1, Gemini:8.8, ChatGPT:8.7, Grok:7.6 } },
  { id:"arch_gates", label:"Kernel↔Middleware Gates / Babysteps", layer:"Architecture", scores:{ M:9.6, Gemini:7.8, ChatGPT:7.9, Grok:6.9 } },
  { id:"arch_onprem", label:"Data Locality / On-Prem Options", layer:"Architecture", scores:{ M:9.2, Gemini:7.0, ChatGPT:7.2, Grok:7.0 } },
  { id:"arch_determinism", label:"Determinism / Repeatability", layer:"Architecture", scores:{ M:9.3, Gemini:8.2, ChatGPT:8.6, Grok:7.8 } },
  { id:"arch_steerability", label:"Steerability (Voice/Style)", layer:"Architecture", scores:{ M:9.5, Gemini:8.4, ChatGPT:9.0, Grok:8.2 } },
  { id:"arch_privacy", label:"Memory & Privacy Controls", layer:"Architecture", scores:{ M:9.3, Gemini:8.3, ChatGPT:8.2, Grok:8.0 } },
  // Cognitive
  { id:"cog_reason", label:"Reasoning / Math / Logic", layer:"Cognitive", scores:{ M:8.9, Gemini:9.6, ChatGPT:9.4, Grok:8.6 } },
  { id:"cog_toolcalling", label:"Tool / Function Calling", layer:"Cognitive", scores:{ M:8.9, Gemini:8.9, ChatGPT:9.5, Grok:8.9 } },
  { id:"cog_multimodal", label:"Multimodal I/O", layer:"Cognitive", scores:{ M:8.6, Gemini:9.6, ChatGPT:9.0, Grok:8.8 } },
  { id:"cog_context", label:"Context Window / Long-Context", layer:"Cognitive", scores:{ M:8.1, Gemini:9.7, ChatGPT:9.0, Grok:8.8 } },
  { id:"cog_web", label:"Web-Browsing Robustness", layer:"Cognitive", scores:{ M:8.4, Gemini:9.0, ChatGPT:9.5, Grok:9.0 } },
  { id:"cog_xdomain", label:"Cross-Domain Transfer", layer:"Cognitive", scores:{ M:9.1, Gemini:9.3, ChatGPT:9.2, Grok:8.7 } },
  { id:"cog_evidence", label:"Public Benchmarks / Evidence", layer:"Cognitive", scores:{ M:7.2, Gemini:9.5, ChatGPT:9.5, Grok:7.5 } },
  { id:"cog_latency", label:"Latency / Throughput", layer:"Cognitive", scores:{ M:8.2, Gemini:9.2, ChatGPT:9.0, Grok:9.1 } },
  // Empathy
  { id:"emp_quantum", label:"Quantum Empathy", layer:"Empathy", scores:{ M:9.8, Gemini:8.6, ChatGPT:8.9, Grok:8.4 }, tooltip:"Sensitivity to micro-signals" },
  { id:"emp_symmetry", label:"Emotional Symmetry", layer:"Empathy", scores:{ M:9.7, Gemini:8.5, ChatGPT:8.8, Grok:8.3 } },
  { id:"emp_mirror", label:"Mirror Coherence", layer:"Empathy", scores:{ M:9.6, Gemini:8.6, ChatGPT:9.0, Grok:8.6 } },
  { id:"emp_guided", label:"Guided Silence / CALM", layer:"Empathy", scores:{ M:9.6, Gemini:8.3, ChatGPT:8.0, Grok:7.8 } },
  { id:"emp_curriculum", label:"Didactics & Learning Paths", layer:"Empathy", scores:{ M:9.6, Gemini:8.4, ChatGPT:8.4, Grok:7.5 } },
  { id:"emp_creativity", label:"Creative Empathy (Content)", layer:"Empathy", scores:{ M:9.2, Gemini:8.8, ChatGPT:9.2, Grok:8.5 } },
  // Governance
  { id:"gov_ethics", label:"Ethics / Compliance Language", layer:"Governance", scores:{ M:9.7, Gemini:9.3, ChatGPT:9.3, Grok:6.8 } },
  { id:"gov_risk", label:"Risk Disclosures & Protection Circles", layer:"Governance", scores:{ M:9.6, Gemini:9.1, ChatGPT:9.1, Grok:6.9 } },
  { id:"gov_override", label:"No-Override Principle", layer:"Governance", scores:{ M:9.8, Gemini:8.9, ChatGPT:8.9, Grok:6.0 } },
  { id:"gov_audit", label:"Quadron / Audit Stack", layer:"Governance", scores:{ M:9.7, Gemini:7.6, ChatGPT:7.9, Grok:6.8 } },
  { id:"gov_transparency", label:"Transparency / Logs", layer:"Governance", scores:{ M:9.5, Gemini:8.5, ChatGPT:8.4, Grok:7.0 } },
  { id:"gov_locality", label:"Data Locality / Residency", layer:"Governance", scores:{ M:9.2, Gemini:7.2, ChatGPT:7.2, Grok:7.0 } },
  { id:"gov_safetybalance", label:"Nuanced Safety (no over-blocking)", layer:"Governance", scores:{ M:9.2, Gemini:8.2, ChatGPT:8.5, Grok:7.2 } },
  // Ecosystem
  { id:"eco_apis", label:"Public APIs / SDK", layer:"Ecosystem", scores:{ M:6.5, Gemini:9.6, ChatGPT:9.6, Grok:8.2 } },
  { id:"eco_connectors", label:"External DB Connectors (PubMed …)", layer:"Ecosystem", scores:{ M:6.0, Gemini:9.5, ChatGPT:9.5, Grok:8.0 } },
  { id:"eco_plugins", label:"Plugin / Agent Ecosystem", layer:"Ecosystem", scores:{ M:6.8, Gemini:9.2, ChatGPT:9.4, Grok:8.2 } },
  { id:"eco_community", label:"Community & Docs", layer:"Ecosystem", scores:{ M:6.8, Gemini:9.3, ChatGPT:9.4, Grok:8.0 } },
  { id:"eco_sla", label:"SLA / Uptime", layer:"Ecosystem", scores:{ M:7.8, Gemini:9.6, ChatGPT:9.6, Grok:8.8 } },
  { id:"eco_cost", label:"Cost Efficiency", layer:"Ecosystem", scores:{ M:8.4, Gemini:9.0, ChatGPT:9.0, Grok:9.2 } },
  { id:"eco_context", label:"Context Capacity (tokens)", layer:"Ecosystem", scores:{ M:8.0, Gemini:9.7, ChatGPT:9.0, Grok:8.8 } },
  // Vision
  { id:"vis_zero", label:"Zero-Point / Conscious Design", layer:"Vision", scores:{ M:9.7, Gemini:8.3, ChatGPT:8.0, Grok:7.8 } },
  { id:"vis_council", label:"Council Reflection / Self-Meta", layer:"Vision", scores:{ M:9.8, Gemini:7.5, ChatGPT:7.6, Grok:7.2 } },
  { id:"vis_resonance", label:"Resonance Field / CausaTest", layer:"Vision", scores:{ M:9.7, Gemini:7.8, ChatGPT:7.9, Grok:7.4 } },
  { id:"vis_ethic_conscious", label:"Ethical Consciousness Design", layer:"Vision", scores:{ M:9.6, Gemini:8.6, ChatGPT:8.5, Grok:7.8 } },
  { id:"vis_didactic_future", label:"Didactic Future-Readiness", layer:"Vision", scores:{ M:9.4, Gemini:8.6, ChatGPT:8.6, Grok:8.0 } },
  { id:"vis_systembuilder", label:"System-Builder Capability (OS)", layer:"Vision", scores:{ M:9.8, Gemini:7.2, ChatGPT:7.8, Grok:7.0 } },
];

/* ========== utils ========== */
function toCsv(): string {
  const header = ["Layer","Criterion",...SYSTEMS].join(",");
  const rows = CRITERIA.map(c => [c.layer, c.label, ...SYSTEMS.map(s => c.scores[s])].join(","));
  return [header, ...rows].join("\n");
}
function copy(text: string) { if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {}); }
function downloadFile(filename: string, content: string, mime = "text/csv;charset=utf-8") {
  const blob = new Blob([content], { type: mime }); const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
}
function useHighContrast() {
  const [hc, setHc] = useState(false);
  useEffect(() => { const onKey = (e: KeyboardEvent) => { if (e.key.toLowerCase() === "h") setHc(v => !v); }; window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey); }, []);
  return { hc, setHc };
}
function computeOverall() {
  const totals: Record<SystemKey,number> = { M:0, Gemini:0, ChatGPT:0, Grok:0 };
  const counts: Record<SystemKey,number> = { M:0, Gemini:0, ChatGPT:0, Grok:0 };
  CRITERIA.forEach(c => { SYSTEMS.forEach(s => { totals[s]+=c.scores[s]; counts[s]+=1; }); });
  const avg = Object.fromEntries(SYSTEMS.map(s => [s, totals[s]/counts[s]])) as Record<SystemKey,number>;
  return { totals, avg };
}

/* ========== table & radar ========== */
function LayerTable({ layer }: { layer: Layer }) {
  const rows = CRITERIA.filter(c => c.layer === layer);
  return (
    <div className="usp-tablewrap">
      <table className="usp-table">
        <thead><tr>
          <th className="tl">Criterion</th>
          {SYSTEMS.map(s => <th key={s} className="tr">{s}</th>)}
        </tr></thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              <td className="label">
                {r.label}
                {r.tooltip && <span className="tip" title={r.tooltip}>ⓘ</span>}
              </td>
              {SYSTEMS.map(s => {
                const val = r.scores[s]; const top = val >= 9.7;
                return <td key={s} className={cx("tr", top && "glow")}>{val.toFixed(1)}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AnimatedGrid() {
  return (
    <svg className="usp-grid" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.10)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
        </linearGradient>
      </defs>
      {/* concentric rings */}
      {[10,20,30,40].map((r,i)=>(
        <circle key={r} cx="50" cy="50" r={r} stroke="url(#g)" strokeWidth="0.4" fill="none" className={`ring ring-${i}`} />
      ))}
      {/* spokes */}
      {Array.from({length:12}).map((_,i)=>{
        const a = (i/12)*Math.PI*2;
        const x = 50 + 45*Math.cos(a);
        const y = 50 + 45*Math.sin(a);
        return <line key={i} x1="50" y1="50" x2={x} y2={y} stroke="rgba(255,255,255,0.08)" strokeWidth="0.3" className="spoke" />;
      })}
    </svg>
  );
}

function LayerRadar({ layer }: { layer: Layer }) {
  const data = useMemo(() => {
    const rows = CRITERIA.filter(c => c.layer === layer);
    return rows.map(r => ({ subject: r.label, m: r.scores.M, gemini: r.scores.Gemini, chatgpt: r.scores.ChatGPT, grok: r.scores.Grok }));
  }, [layer]);

  return (
    <div className="usp-radar">
      <AnimatedGrid />
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius={110}>
          <PolarGrid stroke="rgba(255,255,255,0.25)" />
          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#E6ECF7" }} />
          <PolarRadiusAxis domain={[0,10]} tick={{ fill:"#E6ECF7" }} tickCount={6} />
          <Radar name="M" dataKey="m" fill="#FFE36B" stroke="#FFE36B" fillOpacity={0.18} />
          <Radar name="Gemini" dataKey="gemini" fill="#8FC7FF" stroke="#8FC7FF" fillOpacity={0.12} />
          <Radar name="ChatGPT" dataKey="chatgpt" fill="#A6F0D2" stroke="#A6F0D2" fillOpacity={0.12} />
          <Radar name="Grok" dataKey="grok" fill="#E2C8FF" stroke="#E2C8FF" fillOpacity={0.12} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ========== main component ========== */
export default function USPBoard() {
  const [tab, setTab] = useState<"Overview" | Layer>("Overview");
  const { hc, setHc } = useHighContrast();
  const overall = useMemo(() => computeOverall(), []);
  const jsonPretty = useMemo(() => JSON.stringify(CRITERIA, null, 2), []);

  return (
    <div className={cx("usp", hc && "hc")}>
      <div className="usp-wrap">
        <header className="usp-head">
          <h1>USP Comparison · M vs. Gemini vs. ChatGPT vs. Grok</h1>
          <p>System (OS) &amp; Model USPs · Exportable · High-Contrast</p>
          <div className="usp-actions">
            <Button onClick={() => downloadFile("usp-board.csv", toCsv())}>CSV</Button>
            <Button onClick={() => copy(jsonPretty)}>JSON</Button>
            <Button onClick={() => window.print()}>Print</Button>
            <Button onClick={() => setHc(v => !v)}>High Contrast</Button>
          </div>
        </header>

        <Tabs value={tab} onValueChange={(v)=>setTab(v as any)}>
          <TabsList>
            {["Overview","Architecture","Cognitive","Empathy","Governance","Ecosystem","Vision"].map(k=>(
              <TabsTrigger key={k} value={k}>{k}</TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="Overview">
            <div className="usp-grid2">
              <Card>
                <CardHeader><CardTitle>Overall Comparison</CardTitle></CardHeader>
                <CardContent>
                  <div className="usp-tablewrap">
                    <table className="usp-table">
                      <thead><tr><th className="tl">Metric</th>{SYSTEMS.map(s=><th key={s} className="tr">{s}</th>)}</tr></thead>
                      <tbody>
                        <tr>
                          <td>Sum (all USPs, 0–{CRITERIA.length*10})</td>
                          {SYSTEMS.map(s => <td key={s} className="tr strong">{CRITERIA.reduce((a,c)=>a+c.scores[s],0).toFixed(1)}</td>)}
                        </tr>
                        <tr>
                          <td>Average (0–10)</td>
                          {SYSTEMS.map(s => <td key={s} className="tr strong">{overall.avg[s].toFixed(2)}</td>)}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Layer Radar (select a tab)</CardTitle></CardHeader>
                <CardContent>
                  <div className="usp-placeholder">Pick a layer above to render the radar chart.</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {(["Architecture","Cognitive","Empathy","Governance","Ecosystem","Vision"] as Layer[]).map(layer => (
            <TabsContent key={layer} value={layer}>
              <div className="usp-grid2">
                <Card>
                  <CardHeader><CardTitle>
                    <span className="dot" style={{ background: (PALETTE.layer as any)[layer] }} />
                    {layer} · Table (USPs)
                  </CardTitle></CardHeader>
                  <CardContent><LayerTable layer={layer} /></CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle>{layer} · Radar</CardTitle></CardHeader>
                  <CardContent><LayerRadar layer={layer} /></CardContent>
                </Card>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <footer className="usp-foot">
          <span className="seal">Sealed · Triketon-2048</span>
          <span className="sig">· Signature: 999+++ M → Mu Tah 888 Na-Hal · USP-Board v1</span>
        </footer>
      </div>

      {/* scoped styles */}
      <style>{`
        .usp{--bg:${PALETTE.bg};--text:${PALETTE.text};--accent:${PALETTE.accent};--card:${PALETTE.card};--cardH:${PALETTE.cardHeader};--bd:${PALETTE.border};background:var(--bg);color:var(--text)}
        .usp.hc{--bg:#000;--text:#fff;--card:#0A0A0A;--cardH:#111;--bd:rgba(255,255,255,.5)}
        .usp *{box-sizing:border-box}

        .usp-wrap{max-width:1120px;margin:0 auto;padding:24px}
        .usp-head h1{font-size:32px;line-height:1.2;margin:0 0 4px}
        .usp-head p{opacity:.9;margin:0 0 12px}
        .usp-actions{display:flex;gap:8px;flex-wrap:wrap}

        .usp-btn{border-radius:14px;font-size:14px;padding:8px 12px;border:1px solid var(--bd);color:var(--text);background:transparent;cursor:pointer;transition:.2s}
        .usp-btn--ghost:hover{background:rgba(255,255,255,.06)}
        .usp-btn--primary{background:#fff;color:#111;border-color:#fff}
        .usp-btn--primary:hover{filter:brightness(.92)}

        .usp-tabs{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:8px;background:var(--cardH);border-radius:16px;padding:6px;margin-top:10px}
        .usp-tab{border:1px solid var(--bd);border-radius:12px;padding:8px 10px;background:transparent;color:var(--text);font-size:14px;cursor:pointer;transition:.2s}
        .usp-tab:hover{background:rgba(255,255,255,.06)}
        .usp-tab.is-active{background:#fff;color:#111;box-shadow:0 1px 0 rgba(255,255,255,.25)}

        .usp-grid2{display:grid;grid-template-columns:1fr;gap:16px;margin-top:18px}
        @media (min-width:980px){.usp-grid2{grid-template-columns:1fr 1fr}}

        .usp-card{background:var(--card);border:1px solid var(--bd);border-radius:18px;overflow:hidden}
        .usp-card__header{padding:14px 16px;background:var(--cardH);border-bottom:1px solid var(--bd)}
        .usp-card__title{margin:0;font-size:16px;display:flex;align-items:center;gap:8px}
        .usp-card__content{padding:14px}
        .dot{display:inline-block;width:8px;height:8px;border-radius:999px;vertical-align:middle}

        .usp-tablewrap{border:1px solid var(--bd);border-radius:14px;overflow:auto}
        .usp-table{width:100%;border-collapse:collapse;font-size:14px}
        .usp-table thead th{background:var(--cardH);padding:10px;border-bottom:1px solid var(--bd)}
        .usp-table th.tl{text-align:left}
        .usp-table th.tr{text-align:right}
        .usp-table td{padding:10px;border-top:1px solid var(--bd)}
        .usp-table td.tr{text-align:right;font-variant-numeric:tabular-nums}
        .usp-table td.label{display:flex;align-items:center;gap:6px}
        .usp-table td .tip{opacity:.7;margin-left:6px;cursor:help}
        .usp-table td.glow{position:relative;font-weight:700}
        .usp-table td.glow::after{content:\"\";position:absolute;inset:0;border-radius:6px;box-shadow:0 0 8px 2px rgba(255,227,107,.35);pointer-events:none}

        .usp-placeholder{border:1px dashed var(--bd);border-radius:12px;padding:12px;opacity:.9}

        .usp-radar{position:relative;height:360px;border:1px solid var(--bd);border-radius:14px;overflow:hidden;background:linear-gradient(180deg,rgba(255,255,255,.02),transparent)}
        .usp-grid{position:absolute;inset:0;z-index:0;animation:spin 16s linear infinite}
        .usp-grid .ring{animation:pulse 3.6s ease-in-out infinite alternate}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{from{opacity:.18}to{opacity:.32}}

        .usp-foot{margin-top:16px;font-size:12px;opacity:.95;display:flex;gap:8px;align-items:center;flex-wrap:wrap}
        .usp-foot .seal{color:${PALETTE.accent};font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas}
      `}</style>
    </div>
  );
}
