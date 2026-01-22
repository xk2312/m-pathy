"use client";

import { useLang } from "@/app/providers/LanguageProvider";
import { dict as comparisonDict } from "@/lib/i18n.comparison";
import { comparisonMatrix, ProviderKey } from "@/lib/comparison.matrix";
import { comparisonSources } from "@/lib/comparison.sources";

const providers: ProviderKey[] = [
  "maios",
  "mpathy",
  "chatgpt",
  "copilot",
  "gemini",
];

export default function Comparison() {
  const { lang } = useLang();
  const locale =
    comparisonDict[lang] ?? comparisonDict.en;

  const groups = locale.groups as Record<
    string,
    { title: string } & (
      | { rows: Record<string, string> }
      | { body: string }
    )
  >;

  const tableGroups = Object.entries(groups).filter(
    ([_, group]) => "rows" in group
  ) as [
    string,
    { title: string; rows: Record<string, string> }
  ][];

  return (
    <section
      className="pt-[var(--h-space-a2-section)] pb-[var(--h-space-a2-section)]"
      aria-labelledby="comparison-heading"
    >
      <div
        className="page-center"
        style={{ maxWidth: "calc(var(--page-inner-max) * 1.31)" }}
      >
        {/* HEADER */}
        <header className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-white/50 text-sm tracking-wide mb-3">
            {locale.kicker}
          </p>
          <h2
            id="comparison-heading"
            className="text-white text-[clamp(34px,6vw,52px)] font-semibold mb-4"
          >
            {locale.title}
          </h2>
          <p className="text-white/70">
            {locale.intro}
          </p>
        </header>

        {/* TABLE */}
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
              {tableGroups.map(
                ([groupKey, group]) => (
                  <>
                    {/* GROUP TITLE */}
                    <tr key={groupKey}>
                      <td
                        colSpan={providers.length + 1}
                        className="pt-10 pb-3 text-white/80 font-medium"
                      >
                        {group.title}
                      </td>
                    </tr>

                    {/* ROWS */}
                    {Object.entries(group.rows).map(
                      ([rowKey, label]) => {
                        const row =
                          comparisonMatrix[groupKey]?.[rowKey];

                        return (
                          <tr
                            key={`${groupKey}-${rowKey}`}
                            className="border-t border-white/5 text-white/70"
                          >
                            <td className="py-4">
                              {label}
                            </td>

                            {providers.map((p) => (
                              <td
                                key={p}
                                className="py-4 text-center"
                              >
                                {row?.[p]
                                  ? locale.legend.supported
                                  : locale.legend.not_supported}
                              </td>
                            ))}
                          </tr>
                        );
                      }
                    )}
                  </>
                )
              )}
            </tbody>
          </table>
        </div>

        {/* SOURCES */}
        <section className="max-w-4xl mx-auto mt-20 text-sm text-white/60">
          <h3 className="text-white/80 mb-3">
            {locale.footer.sources_title}
          </h3>
          <p className="mb-4">
            {locale.footer.sources_note}
          </p>

          <ul className="space-y-3">
            {comparisonSources.providers.map((p) => (
              <li key={p.key}>
                <strong>{p.name}</strong>
                <ul className="ml-4 list-disc">
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
        </section>
      </div>
    </section>
  );
}
