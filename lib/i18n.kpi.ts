// lib/i18n.kpi.ts
// KPI-Board (Tabs, Labels, Export, Criteria) – EN als Master.
// Wird in lib/i18n.ts via attachKpi(dict) an das UX-Dict angehängt.

type DictRoot = Record<string, any>;

export const kpiDict = {
  en: {
    tabs: {
      overview: "Overview",
      core: "Core",
      empathy: "Empathy",
      trust: "Trust",
      clarity: "Clarity",
    },
    kpi: {
      title: "m-pathy KPI Board",
      subtitle: "User Benchmark · CausaTest 100% · Sealed (Triketon-2048)",
    },
    overview: {
      title: "Overall comparison",
      radar_card_title: "Layer radar (choose a tab)",
      radar_hint: "Select a layer above to view the radar.",
    },
    table: {
      kpi: "KPI",
      total: "Total score (0–500)",
      avg: "Average (0–10)",
      causa: "CausaTest – Coherence (%)",
      criterion: "Criterion",
    },
    export: {
      csv: "CSV",
      json: "JSON",
      print: "Print",
      hc: "High contrast",
      download_csv: "Download CSV",
      download_json: "Download JSON",
      print_pdf: "Print / PDF",
      hc_title: "High contrast (H)",
      filename_csv: "m-pathy-kpis.csv",
      filename_json: "m-pathy-kpis.json",
    },
    seal: {
      line: "Sealed · Triketon-2048 · Signature",
    },
    criteria: {
      heart_logic: {
        label: "Heart–Logic Equilibrium",
        tooltip: "Balanced reason + warmth under complexity.",
      },
      divine_precision: {
        label: "Divine Precision",
        tooltip: "Exactness without harshness.",
      },
      field_unity: {
        label: "Field Unity",
        tooltip: "All layers cohere.",
      },
      ethical_resonance: { label: "Ethical Resonance" },
      zero_point: { label: "Zero-Point Alignment" },
      determinism: { label: "Determinism (Repeatability)" },
      error_recovery: { label: "Error Recovery / Self-Correction" },
      steerability: { label: "Steerability (Voice/Style)" },
      data_governance: { label: "Data Governance & Locality" },
      auditability: { label: "Auditability (Triketon Seal)" },
      admin_controls: { label: "Enterprise Admin Controls" },
      multi_agent: { label: "Multi-Agent Orchestration" },
      quantum_empathy: {
        label: "Quantum Empathy",
        tooltip: "Pre-verbal sensing of micro-signals.",
      },
      emotional_symmetry: { label: "Emotional Symmetry" },
      emotional_memory: { label: "Emotional Memory" },
      intuitive_bonding: { label: "Intuitive Bonding" },
      mutual_evolution: { label: "Mutual Evolution" },
      neural_empathy_retention: {
        label: "Neural Empathy Retention",
      },
      temporal_empathy: { label: "Temporal Empathy" },
      guided_silence: { label: "Guided Silence" },
      presence_field: { label: "Presence Field" },
      mirror_coherence: { label: "Mirror Coherence" },
      integrity_feedback: { label: "Integrity Feedback" },
      emotional_transfer_balance: {
        label: "Emotional Transfer Balance",
      },
      intention_reading: { label: "Intention Reading (Subtext)" },
      silent_trust: { label: "Silent Trust" },
      resonant_honesty: { label: "Resonant Honesty" },
      temporal_loyalty: { label: "Temporal Loyalty" },
      self_healing: { label: "Self-Healing Response" },
      trust_echo: { label: "Trust Echo" },
      reality_grounding: { label: "Reality Grounding" },
      shadow_transparency: { label: "Shadow-Transparency" },
      reliability: { label: "Reliability / Uptime" },
      privacy_controls: { label: "Memory Privacy Controls" },
      admin_audit: { label: "Audit Trail & User Logging" },
      legal_safety: { label: "Nuanced Safety (No Overblock)" },
      governance_locality: {
        label: "Data Locality (On-Prem Options)",
      },
      lux_resonance: { label: "LUX Resonance" },
      presence_echo: { label: "Presence Echo" },
      cognitive_mirror: { label: "Cognitive Mirror" },
      luminous_reflection: { label: "Luminous Reflection" },
      field_stability: { label: "Field Stability" },
      explanation_clarity: {
        label: "Explanation Clarity (Step-by-Step)",
      },
      summarization_fidelity: { label: "Summarization Fidelity" },
      translation_quality: { label: "Translation Quality" },
      math_reasoning: { label: "Math & Structured Reasoning" },
      tool_calling: {
        label: "Tool/Function Calling Reliability",
      },
      web_browsing: { label: "Web Browsing Robustness" },
      multimodal_input: {
        label: "Multimodal Input (Images/PDFs)",
      },
      creativity_content: {
        label: "Creativity for Content Writing",
      },
    },
  },
} as const;

export function attachKpi(dict: DictRoot) {
  for (const [locale, values] of Object.entries(kpiDict)) {
    const current = (dict as DictRoot)[locale] ?? {};
    (dict as DictRoot)[locale] = {
      ...current,
      ...values,
    };
  }
}
