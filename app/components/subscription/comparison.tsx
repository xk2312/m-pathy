"use client";

import React from "react";
import { useLang } from "@/app/providers/LanguageProvider";
import { dict as comparisonDict } from "@/lib/i18n.comparison";
import { comparisonSources } from "@/lib/comparison.sources";

/* ======================================================
   LOCAL TYPES (FULL ISOLATION)
   ====================================================== */

type ProviderKey =
  | "maios"
  | "mpathy"
  | "chatgpt"
  | "copilot"
  | "gemini";

const providers: ProviderKey[] = [
  "maios",
  "mpathy",
  "chatgpt",
  "copilot",
  "gemini",
];

/* ======================================================
   COMPARISON DATA INSERT POINT
   Source: former comparison.matrix.ts
   Note: Data is intentionally local for deterministic render
   ====================================================== */

export const comparisonMatrix: Record<
  string,
  Record<string, Record<ProviderKey, boolean>>
> = {
  governance: {
    purpose: {
      maios: true,
      mpathy: true,
      chatgpt: true,
      copilot: true,
      gemini: true,
    },
    accountability: {
      maios: true,
      mpathy: true,
      chatgpt: true,
      copilot: true,
      gemini: true,
    },
    role_separation: {
      maios: true,
      mpathy: true,
      chatgpt: true,
      copilot: true,
      gemini: true,
    },
    architecture: {
      maios: true,
      mpathy: true,
      chatgpt: false,
      copilot: false,
      gemini: false,
    },
    change_management: {
      maios: true,
      mpathy: true,
      chatgpt: false,
      copilot: false,
      gemini: false,
    },
  },

  transparency: {
    awareness: {
      maios: true,
      mpathy: true,
      chatgpt: true,
      copilot: true,
      gemini: true,
    },
    disclosure: {
      maios: true,
      mpathy: true,
      chatgpt: true,
      copilot: true,
      gemini: true,
    },
    explainability: {
      maios: true,
      mpathy: true,
      chatgpt: false,
      copilot: false,
      gemini: false,
    },
    non_deceptive: {
      maios: true,
      mpathy: true,
      chatgpt: true,
      copilot: true,
      gemini: true,
    },
    audit_info: {
      maios: true,
      mpathy: true,
      chatgpt: false,
      copilot: true,
      gemini: true,
    },
  },

  oversight: {
    oversight: {
      maios: true,
      mpathy: true,
      chatgpt: false,
      copilot: true,
      gemini: true,
    },
    override: {
      maios: true,
      mpathy: true,
      chatgpt: false,
      copilot: true,
      gemini: true,
    },
    overreliance: {
      maios: true,
      mpathy: true,
      chatgpt: false,
      copilot: false,
      gemini: false,
    },
    decision_support: {
      maios: true,
      mpathy: true,
      chatgpt: true,
      copilot: true,
      gemini: true,
    },
    escalation: {
      maios: true,
      mpathy: true,
      chatgpt: false,
      copilot: false,
      gemini: false,
    },
  },

  risk: {
    risk_process: {
      maios: true,
      mpathy: true,
      chatgpt: true,
      copilot: true,
      gemini: true,
    },
    psychological: {
      maios: true,
      mpathy: true,
      chatgpt: false,
      copilot: false,
      gemini: false,
    },
    misuse: {
      maios: true,
      mpathy: true,
      chatgpt: true,
      copilot: true,
      gemini: true,
    },
    bias: {
      maios: false,
      mpathy: false,
      chatgpt: true,
      copilot: true,
      gemini: true,
    },
    safety_testing: {
      maios: true,
      mpathy: true,
      chatgpt: true,
      copilot: true,
      gemini: true,
    },
  },

  data: {
    logging: {
      maios: true,
      mpathy: true,
      chatgpt: false,
      copilot: true,
      gemini: true,
    },
    traceability: {
      maios: true,
      mpathy: true,
      chatgpt: false,
      copilot: false,
      gemini: false,
    },
    minimization: {
      maios: true,
      mpathy: true,
      chatgpt: false,
      copilot: false,
      gemini: false,
    },
    retention: {
      maios: true,
      mpathy: true,
      chatgpt: false,
      copilot: true,
      gemini: true,
    },
    security: {
      maios: true,
      mpathy: true,
      chatgpt: true,
      copilot: true,
      gemini: true,
    },
  },

  post_market: {
    monitoring: {
      maios: true,
      mpathy: true,
      chatgpt: true,
      copilot: true,
      gemini: true,
    },
    incidents: {
      maios: true,
      mpathy: true,
      chatgpt: true,
      copilot: true,
      gemini: true,
    },
    corrective: {
      maios: true,
      mpathy: true,
      chatgpt: true,
      copilot: true,
      gemini: true,
    },
    documentation: {
      maios: true,
      mpathy: true,
      chatgpt: true,
      copilot: true,
      gemini: true,
    },
    updates: {
      maios: true,
      mpathy: true,
      chatgpt: false,
      copilot: false,
      gemini: false,
    },
  },
};


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
        aria-label={supported ? "Supported" : "Not supported"}
        title={supported ? "Supported" : "Not supported"}
      >
        {supported ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M20 6L9 17l-5-5"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 6L6 18"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
            />
            <path
              d="M6 6l12 12"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
            />
          </svg>
        )}
      </span>
      <span className="sr-only">
        {supported ? "Supported" : "Not supported"}
      </span>
    </span>
  );
}

export default function Comparison() {
  const { lang } = useLang();
  const locale = comparisonDict[lang] ?? comparisonDict.en;

  const groups = locale.groups as Record<
    string,
    { title: string } & (
      | { rows: Record<string, string> }
      | { body: string }
    )
  >;

  const tableGroups = Object.entries(groups).filter(
    ([_, group]) => "rows" in group
  ) as [string, { title: string; rows: Record<string, string> }][];

  return (
    <section
      data-comparison-root
      className="pt-[var(--h-space-a2-section)] pb-[var(--h-space-a2-section)]"
      aria-labelledby="comparison-heading"
    >
      <div
        className="page-center"
        style={{ maxWidth: "calc(var(--page-inner-max) * 1.31)" }}
      >
        <header className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-white/50 text-sm tracking-wide mb-3">
            {locale.kicker}
          </p>
          <h2
            id="comparison-heading"
            className="text-white text-[clamp(34px,6vw,52px)] font-semibold mb-4"
          >
            {locale.title}
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            {locale.intro}
          </p>
        </header>

        <div className="flex items-center justify-center gap-6 mb-10 text-sm text-white/60">
          <div className="inline-flex items-center gap-2">
            <CellMark supported />
            <span>{locale.legend.supported}</span>
          </div>
          <div className="inline-flex items-center gap-2">
            <CellMark supported={false} />
            <span>{locale.legend.not_supported}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
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
                      <td colSpan={providers.length + 1} className="pt-10">
                        <div className="h-px bg-white/10" />
                      </td>
                    </tr>
                  )}

                  <tr>
                    <td
                      colSpan={providers.length + 1}
                      className="pt-8 pb-4 text-white/85 font-medium tracking-wide"
                    >
                      <span className="text-xs uppercase text-white/55">
                        {group.title}
                      </span>
                    </td>
                  </tr>

                  {Object.entries(group.rows).map(([rowKey, label]) => {
                    const row = comparisonMatrix[groupKey]?.[rowKey];

                    return (
                      <tr
                        key={`${groupKey}-${rowKey}`}
                        className="border-t border-white/5 text-white/70 even:bg-white/[0.03]"
                      >
                        <td className="py-4 pr-6">
                          <span className="text-white/75">{label}</span>
                        </td>

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
        </div>

        <section className="max-w-4xl mx-auto mt-20 text-sm text-white/60">
          <details className="rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-4">
            <summary className="cursor-pointer select-none text-white/80 font-medium">
              {locale.footer.sources_title}
            </summary>

            <div className="pt-4">
              <p className="mb-4 text-white/60">
                {locale.footer.sources_note}
              </p>

              <ul className="space-y-4">
                {comparisonSources.providers.map((p) => (
                  <li key={p.key}>
                    <strong className="text-white/80">{p.name}</strong>
                    <ul className="ml-5 mt-2 list-disc space-y-1">
                      {p.sources.map((s) => (
                        <li key={s.id}>
                          {s.title}
                          <span className="text-white/40">
                            {" "}
                            ({s.reference})
                          </span>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>

              <p className="mt-6 text-xs text-white/40">
                {locale.footer.verification_date_label}:{" "}
                {comparisonSources.verificationDate}
              </p>
            </div>
          </details>
        </section>
      </div>
    </section>
  );
}