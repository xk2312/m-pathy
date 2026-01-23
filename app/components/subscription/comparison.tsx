/*** =======================================================================
 *  INVENTUS INDEX - app/.../comparison.tsx
 *  Providervergleich · Matrix · Quellen-Overlay
 * ======================================================================= 
 *
 *  [ANCHOR:0]  IMPORTS
 *              - React
 *              - useLang aus LanguageProvider
 *              - comparisonDict aus lib/i18n.comparison
 *              - ProviderKey aus lib/comparison.matrix
 *              - comparisonSources aus lib/comparison.sources
 *              → Komponente hängt an:
 *                a) eigenem i18n Vergleichsdict
 *                b) Provider-Key Typen aus der Matrix
 *                c) separatem Quellenmodul für Nachweise.
 *
 *  [ANCHOR:1]  PROVIDERLISTE
 *              const providers: ProviderKey[] = [
 *                "maios", "mpathy", "chatgpt", "copilot", "gemini"
 *              ]
 *              → Zentrale Spaltenachse der Tabelle.
 *                Reihenfolge und Inhalt müssen mit:
 *                - comparisonMatrix Keys
 *                - i18n.table.columns
 *                - comparisonSources.providers.key
 *                konsistent bleiben.
 *
 *  [ANCHOR:2]  comparisonMatrix (lokale Bewertungsmatrix)
 *              - Struktur:
 *                Record<
 *                  string, // groupKey z. B. "governance"
 *                  Record<
 *                    string, // rowKey z. B. "purpose"
 *                    Record<ProviderKey, boolean> // true/false je Provider
 *                  >
 *                >
 *              - Gruppen:
 *                governance, transparency, oversight, risk, data, post_market
 *              - Jede Gruppe hat 5 Kriterienzeilen.
 *              → Lokale, deterministische Bewertung ohne direkte Kopplung
 *                an die Quellenstruktur. Tabelle liest hieraus die Checks.
 *
 *  [ANCHOR:3]  COMPONENT CellMark
 *              function CellMark({ supported }: { supported: boolean })
 *              - Rendert ein kreisrundes Badge:
 *                - "✓" bei true, "×" bei false
 *                - Visuelle Differenzierung via Tailwind Klassen
 *              → Reine Darstellungskomponente, kapselt das Ja/Nein Badge.
 *
 *  [ANCHOR:4]  COMPONENT Comparison - LOCALE SETUP
 *              const { lang } = useLang()
 *              - Guard:
 *                if (!lang || !comparisonDict[lang]) return null
 *              - locale = comparisonDict[lang]
 *              → Diese Komponente nutzt ein eigenes i18n Dict
 *                (comparisonDict) und NICHT das generelle dict der App.
 *                Sprache hängt an useLang().lang.
 *
 *  [ANCHOR:5]  GROUP NORMALISIERUNG
 *              const rawGroups = locale?.groups
 *              const groups =
 *                rawGroups && typeof rawGroups === "object" && !Array.isArray(rawGroups)
 *                  ? rawGroups
 *                  : {}
 *
 *              const tableGroups = Object.entries(groups).filter(
 *                ([_, group]) =>
 *                  group &&
 *                  typeof group === "object" &&
 *                  "rows" in group &&
 *                  group.rows &&
 *                  typeof group.rows === "object" &&
 *                  !Array.isArray(group.rows)
 *              ) as [string, { title: string; rows: Record<string, string> }][]
 *
 *              → defensive Programmierung:
 *                - toleriert fehlende oder falsch strukturierte groups
 *                - filtert nur die Gruppen mit valider rows Map heraus
 *              → tableGroups ist die finale Datengrundlage für Rendering.
 *
 *  [ANCHOR:6]  TABLE HEADER
 *              - section mit padding und page-center
 *              - table min-w-[900px] für horizontales Scrolling
 *              - Kopfzeile:
 *                  erste Spalte: locale.table.columns.criterion
 *                  weitere Spalten: locale.table.columns[p] pro Provider
 *              → Kopplung:
 *                - Provider Keys müssen in locale.table.columns existieren.
 *
 *  [ANCHOR:7]  TABLE BODY - GRUPPEN UND ZEILEN
 *              - Iteration über tableGroups:
 *                  - optionaler Spacer zwischen Gruppen (leere Zeile)
 *                  - Gruppenzeile: Titel in kleiner, uppercase Typografie
 *              - Pro group.rows:
 *                  - rowKey, label
 *                  - row = comparisonMatrix[groupKey]?.[rowKey]
 *                  - Tabellenzeile:
 *                      erste Spalte: label aus i18n
 *                      weitere Spalten: CellMark(Boolean(row?.[p]))
 *              → Koppelt drei Ebenen:
 *                1) i18n.groups[groupKey].rows[rowKey] → Label
 *                2) comparisonMatrix[groupKey][rowKey][providerKey] → Wert
 *                3) providers Array → Spaltenreihenfolge
 *              → Jede Inkonsistenz bei groupKey/rowKey oder ProviderKey
 *                führt zu fehlenden oder leeren Zeilen.
 *
 *  [ANCHOR:8]  FOOTER - QUELLENBEREICH
 *              <section className="max-w-4xl mx-auto mt-20 text-sm text-white/60">
 *                <details> / <summary>
 *                  - Titel: locale.footer.sources_title
 *                  - Inhalt: Liste der Providerquellen
 *                    comparisonSources.providers.map(p => ...)
 *                      - <strong>{p.name}</strong>
 *                      - darunter Liste der sources:
 *                        {s.title} ({s.reference})
 *              → Verbindung zu lib/comparison.sources:
 *                - p.key sollte einem ProviderKey in providers entsprechen
 *                - p.name ist Anzeige
 *                - s.title und s.reference spiegeln die hinterlegte SourceEntry Struktur.
 *
 *  [ANCHOR:9]  INTERPLAY I18N · MATRIX · SOURCES
 *              - I18n:
 *                  locale.table.columns
 *                  locale.groups[groupKey].title
 *                  locale.groups[groupKey].rows[rowKey]
 *                  locale.footer.sources_title
 *              - Matrix:
 *                  comparisonMatrix[groupKey][rowKey][providerKey] als boolean
 *              - Sources:
 *                  comparisonSources.providers mit key, name, sources
 *              → Für ein stimmiges Bild müssen alle drei Ebenen
 *                dieselben Provider und Kategorien begreifen, sonst:
 *                - visuell gesetzte Haken ohne nachvollziehbare Quellen
 *                - Quellen, die auf Kriterien verweisen, die in der Matrix
 *                  anders oder gar nicht modelliert sind.
 *
 * =======================================================================
 *  ERKENNBARER FEHLER- UND DRIFTRISIKO-BEREICH (Inventur, ohne Lösung)
 *
 *  1) Abweichung zwischen Matrix und i18n
 *     - Wenn groupKey oder rowKey in comparisonMatrix
 *       nicht exakt den Keys in locale.groups entsprechen,
 *       entstehen stille Inkonsistenzen:
 *       - Labels ohne Matrixdaten
 *       - Matrixdaten, die nicht gerendert werden.
 *
 *  2) Provider Alignment
 *     - providers Array, comparisonMatrix Keys und
 *       comparisonSources.providers.key müssen identisch sein.
 *     - Schon eine abweichende Schreibweise (z. B. "gpt4" vs "chatgpt")
 *       führt zu leeren Zellen oder verwaisten Quellen.
 *
 *  3) Nachvollziehbarkeit der Bewertungen
 *     - Aktuelle Struktur zeigt nur Ja/Nein pro Feld,
 *       ohne direkte Verlinkung auf konkrete SourceEntry IDs.
 *     - Risiko:
 *       - Nutzer sehen Haken, können aber nicht eindeutig nachvollziehen,
 *         aus welcher Quelle welche Bewertung stammt.
 *       - Für MAIOS Reports ist eine engere Kopplung
 *         zwischen Matrixeintrag und SourceEntry.id erforderlich.
 *
 * ======================================================================= */

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

  if (!lang || !comparisonDict[lang]) {
    return null;
  }

  const locale = comparisonDict[lang];


const rawGroups = locale?.groups;
const groups =
  rawGroups && typeof rawGroups === "object" && !Array.isArray(rawGroups)
    ? rawGroups
    : {};

const tableGroups = Object.entries(groups).filter(
  ([_, group]) =>
    group &&
    typeof group === "object" &&
    "rows" in group &&
    group.rows &&
    typeof group.rows === "object" &&
    !Array.isArray(group.rows)
) as [string, { title: string; rows: Record<string, string> }][];



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
