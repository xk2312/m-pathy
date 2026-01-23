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
   COMPARISON DATA
   ====================================================== */

const comparisonMatrix: Record<
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

/* ======================================================
   CELL MARK
   ====================================================== */

function CellMark({ supported }: { supported: boolean }) {
  return (
    <span className="inline-block w-6 text-center">
      {supported ? "✓" : "✕"}
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
      <div className="page-center max-w-[1400px] mx-auto">
        {/* HEADER */}
        <header className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-white/50 text-sm tracking-wide mb-3">
            {locale.kicker}
          </p>
          <h2
            id="comparison-heading"
            className="text-white text-[clamp(32px,5vw,48px)] font-semibold mb-4"
          >
            {locale.title}
          </h2>
          <p className="text-white/70">
            {locale.intro}
          </p>
        </header>

        {/* LEGEND */}
        <div className="flex justify-center gap-10 mb-10 text-sm text-white/60">
          <span>✓ {locale.legend.supported}</span>
          <span>✕ {locale.legend.not_supported}</span>
        </div>

        {/* TABLE WRAPPER */}
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table
            className="w-full min-w-[980px] border-collapse text-sm"
            style={{ tableLayout: "fixed" }}
          >
            <thead className="bg-white/[0.03]">
              <tr className="border-b border-white/10 text-white/70">
                <th className="px-4 py-4 text-left w-[340px]">
                  {locale.table.columns.criterion}
                </th>
                {providers.map((p) => (
                  <th
                    key={p}
                    className="px-2 py-4 text-center w-[128px]"
                  >
                    {locale.table.columns[p]}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {tableGroups.map(([groupKey, group]) => (
                <React.Fragment key={groupKey}>
                  {/* GROUP TITLE */}
                  <tr className="bg-white/[0.02]">
                    <td
                      colSpan={providers.length + 1}
                      className="px-4 py-3 text-xs uppercase tracking-wide text-white/60"
                    >
                      {group.title}
                    </td>
                  </tr>

                  {/* ROWS */}
                  {Object.entries(group.rows).map(([rowKey, label]) => {
                    const row = comparisonMatrix[groupKey]?.[rowKey];

                    return (
                      <tr
                        key={`${groupKey}-${rowKey}`}
                        className="border-b border-white/5 text-white/75"
                      >
                        <td className="px-4 py-3">
                          {label}
                        </td>

                        {providers.map((p) => (
                          <td
                            key={p}
                            className="px-2 py-3 text-center"
                          >
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

        {/* SOURCES */}
        <section className="max-w-4xl mx-auto mt-16 text-sm text-white/60">
          <details className="rounded-xl border border-white/10 bg-white/[0.02] px-5 py-4">
            <summary className="cursor-pointer text-white/80 font-medium">
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
