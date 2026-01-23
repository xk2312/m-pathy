"use client";

import React from "react";
import { useLang } from "@/app/providers/LanguageProvider";
import { dict as comparisonDict } from "@/lib/i18n.comparison";
import type { ProviderKey } from "@/lib/comparison.matrix";
import { comparisonSources } from "@/lib/comparison.sources";

const providers: ProviderKey[] = [
  "maios",
  "mpathy",
  "chatgpt",
  "copilot",
  "gemini",
];

/* ======================================================
   COMPARISON DATA
   Local, isolated, deterministic
   ====================================================== */

const comparisonMatrix: Record<
  string,
  Record<string, Record<ProviderKey, boolean>>
> = {
  governance: {
    purpose: { maios: true, mpathy: true, chatgpt: true, copilot: true, gemini: true },
    accountability: { maios: true, mpathy: true, chatgpt: true, copilot: true, gemini: true },
    role_separation: { maios: true, mpathy: true, chatgpt: true, copilot: true, gemini: true },
    architecture: { maios: true, mpathy: true, chatgpt: false, copilot: false, gemini: false },
    change_management: { maios: true, mpathy: true, chatgpt: false, copilot: false, gemini: false },
  },

  transparency: {
    awareness: { maios: true, mpathy: true, chatgpt: true, copilot: true, gemini: true },
    disclosure: { maios: true, mpathy: true, chatgpt: true, copilot: true, gemini: true },
    explainability: { maios: true, mpathy: true, chatgpt: false, copilot: false, gemini: false },
    non_deceptive: { maios: true, mpathy: true, chatgpt: true, copilot: true, gemini: true },
    audit_info: { maios: true, mpathy: true, chatgpt: false, copilot: true, gemini: true },
  },

  oversight: {
    oversight: { maios: true, mpathy: true, chatgpt: false, copilot: true, gemini: true },
    override: { maios: true, mpathy: true, chatgpt: false, copilot: true, gemini: true },
    overreliance: { maios: true, mpathy: true, chatgpt: false, copilot: false, gemini: false },
    decision_support: { maios: true, mpathy: true, chatgpt: true, copilot: true, gemini: true },
    escalation: { maios: true, mpathy: true, chatgpt: false, copilot: false, gemini: false },
  },

  risk: {
    risk_process: { maios: true, mpathy: true, chatgpt: true, copilot: true, gemini: true },
    psychological: { maios: true, mpathy: true, chatgpt: false, copilot: false, gemini: false },
    misuse: { maios: true, mpathy: true, chatgpt: true, copilot: true, gemini: true },
    bias: { maios: false, mpathy: false, chatgpt: true, copilot: true, gemini: true },
    safety_testing: { maios: true, mpathy: true, chatgpt: true, copilot: true, gemini: true },
  },

  data: {
    logging: { maios: true, mpathy: true, chatgpt: false, copilot: true, gemini: true },
    traceability: { maios: true, mpathy: true, chatgpt: false, copilot: false, gemini: false },
    minimization: { maios: true, mpathy: true, chatgpt: false, copilot: false, gemini: false },
    retention: { maios: true, mpathy: true, chatgpt: false, copilot: true, gemini: true },
    security: { maios: true, mpathy: true, chatgpt: true, copilot: true, gemini: true },
  },

  post_market: {
    monitoring: { maios: true, mpathy: true, chatgpt: true, copilot: true, gemini: true },
    incidents: { maios: true, mpathy: true, chatgpt: true, copilot: true, gemini: true },
    corrective: { maios: true, mpathy: true, chatgpt: true, copilot: true, gemini: true },
    documentation: { maios: true, mpathy: true, chatgpt: true, copilot: true, gemini: true },
    updates: { maios: true, mpathy: true, chatgpt: false, copilot: false, gemini: false },
  },
};

/* ======================================================
   CELL MARK
   ====================================================== */

function CellMark({ supported }: { supported: boolean }) {
  return (
    <span className="inline-flex items-center justify-center">
      <span
        className={[
          "inline-flex items-center justify-center",
          "w-7 h-7 rounded-full",
          supported
            ? "bg-cyan-400/20 text-white border border-cyan-300/30"
            : "border border-white/20 text-white/30",
        ].join(" ")}
      >
        {supported ? "✓" : "×"}
      </span>
    </span>
  );
}

/* ======================================================
   COMPONENT
   ====================================================== */

export default function Comparison() {
  const { lang } = useLang();
  const locale = comparisonDict[lang] ?? comparisonDict.en;

  const groups = locale.groups as Record<
    string,
    { title: string; rows: Record<string, string> }
  >;

  const tableGroups = Object.entries(groups);

  return (
    <section className="py-24">
      <div className="page-center overflow-x-auto">
        <table className="min-w-[900px] w-full border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-white/60 text-sm">
              <th className="py-4 text-left">
                {locale.table.columns.criterion}
              </th>
              {providers.map((p) => (
                <th key={p} className="py-4 text-center">
                  {locale.table.columns[p]}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {tableGroups.map(([groupKey, group], idx) => (
              <React.Fragment key={groupKey}>
                {idx > 0 && (
                  <tr>
                    <td colSpan={providers.length + 1} className="pt-10" />
                  </tr>
                )}

                <tr>
                  <td
                    colSpan={providers.length + 1}
                    className="pt-6 pb-2 text-xs uppercase text-white/50"
                  >
                    {group.title}
                  </td>
                </tr>

                {Object.entries(group.rows).map(([rowKey, label]) => {
                  const row = comparisonMatrix[groupKey]?.[rowKey];
                  return (
                    <tr
                      key={rowKey}
                      className="border-t border-white/5 even:bg-white/[0.03]"
                    >
                      <td className="py-4 pr-6 text-white/75">{label}</td>
                      {providers.map((p) => (
                        <td key={p} className="py-4 text-center">
                          <CellMark supported={Boolean(row?.[p])} />
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        <section className="max-w-4xl mx-auto mt-20 text-sm text-white/60">
          <details className="rounded-xl border border-white/10 px-5 py-4">
            <summary className="cursor-pointer text-white/80">
              {locale.footer.sources_title}
            </summary>
            <div className="pt-4">
              <ul className="space-y-4">
                {comparisonSources.providers.map((p) => (
                  <li key={p.key}>
                    <strong>{p.name}</strong>
                    <ul className="ml-5 list-disc">
                      {p.sources.map((s) => (
                        <li key={s.id}>
                          {s.title} ({s.reference})
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          </details>
        </section>
      </div>
    </section>
  );
}
