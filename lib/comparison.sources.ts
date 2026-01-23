/*** =======================================================================
 *  INVENTUS INDEX - lib/comparison.sources.ts
 *  Quellen-Matrix · Provider-Belege · Governance-Scope
 * ======================================================================= 
 *
 *  [ANCHOR:0]  DATEIKONTEXT
 *              - Reines Typ- und Datenmodul ohne Imports.
 *              - Liefert strukturierte Quellenangaben für den Vergleich
 *                der Provider im Comparison-Modul.
 *              - Wird als konstante, readonly Datenbasis verwendet.
 *
 *  [ANCHOR:1]  TYPE SourceEntry
 *              - id: string
 *              - title: string
 *              - type: 'internal' | 'public'
 *              - reference: string
 *              - scope: string[]
 *              → Elementare Einheit der Quellenbeschreibung:
 *                Was ist die Quelle, wie heisst sie, wie wird sie eingeordnet,
 *                und welche Themenbereiche deckt sie ab.
 *
 *  [ANCHOR:2]  TYPE ProviderSources
 *              - key: string (z. B. 'maios', 'mpathy', 'chatgpt', 'copilot', 'gemini')
 *              - name: string (sprechender Name des Systems)
 *              - role: string (Rolle im Vergleichssetup, z. B. "Workspace", "Assistant")
 *              - sources: SourceEntry[]
 *              → Bündelt alle SourceEntry-Einträge eines Anbieters.
 *                Dient als Brücke zwischen Provider-Key und konkreten Belegen.
 *
 *  [ANCHOR:3]  CONST providerSources (as const)
 *              - Exportierte, unveränderliche Datenstruktur.
 *              - Form: { providers: ProviderSources[] }
 *              - Jeder Provider:
 *                  key: technischer Schlüssel (Mapping zu Comparison-Matrix)
 *                  name: Anzeigename
 *                  role: Einordnung im Governance/Produkt-Kontext
 *                  sources: Liste von SourceEntry
 *              → Kernbestand der Vergleichsquellen für die Tabelle
 *                und künftige UI-Komponenten (z. B. Accordion mit Belegen).
 *
 *  [ANCHOR:4]  SOURCEENTRY-INHALTE
 *              - type 'internal':
 *                  Interne Dokumente, Policies, Whitepaper,
 *                  Systembeschreibungen oder Architekturdokumente.
 *              - type 'public':
 *                  Offizielle Webseiten, Produktdokus, Policy-Seiten,
 *                  Standards (z. B. "Responsible AI", "Compliance Docs").
 *              - scope:
 *                  Schlagwortliste, die den inhaltlichen Geltungsbereich
 *                  der Quelle beschreibt (z. B. "Audit logging",
 *                  "Data retention", "Compliance reporting").
 *              → Scope dient als semantische Brücke zu den Zeilen/Kategorien
 *                der Comparison-Tabelle.
 *
 *  [ANCHOR:5]  ID-SYSTEM UND ALIGNMENT
 *              - id:
 *                  Kurze, sprechende Kennung pro Quelle
 *                  (z. B. 'ms-responsible-ai', 'google-responsible-ai').
 *              - Erwartete Nutzung:
 *                  Mapping zu UI-Elementen (z. B. Links, Tooltips, Accordion)
 *                  oder zur Nachvollziehbarkeit in Reports.
 *              → Wichtig für spätere Erweiterungen:
 *                gleiche IDs konsistent in allen Files verwenden,
 *                um Querbezüge zu erhalten (Comparison, Reports, MAIOS-Logik).
 *
 * =======================================================================
 *  ERKENNBARER FEHLER- UND DRIFTRISIKO-BEREICH (Inventur, ohne Lösung)
 *
 *  1) Abgleich mit Comparison-Matrix
 *     - providerSources definiert Quellen pro Provider und Scope,
 *       die Comparison-Matrix bewertet Kategorien.
 *     - Ohne sauberen 1:1 oder n:1 Scope-Abgleich kann der Eindruck
 *       entstehen, dass Bewertungen nicht eindeutig auf Quellen
 *       zurückführbar sind.
 *
 *  2) Pflegeaufwand und Konsistenz
 *     - Quellen liegen hier als reine Hardcoded-Liste.
 *     - Jede spätere Anpassung der Vergleichslogik, Kategorien
 *       oder Provider erfordert manuelle Synchronisation
 *       zwischen diesem Modul und der Comparison-Matrix.
 *
 *  3) Typ 'internal' vs. 'public'
 *     - Die Datei unterscheidet streng zwischen internen und
 *       öffentlichen Quellen, erzwingt aber keine formale Verbindung
 *       zur tatsächlichen Ablage oder zu Reports.
 *     - Risiko: Einträge können veralten oder nicht mehr
 *       exakt den realen Dokumenten entsprechen, ohne dass
 *       die Typen oder References dies sichtbar machen.
 *
 * ======================================================================= */

export type SourceEntry = {
  id: string
  title: string
  type: 'internal' | 'public'
  reference: string
  scope: string[]
}

export type ProviderSources = {
  key: string
  name: string
  role: string
  sources: SourceEntry[]
}

export const comparisonSources = {
  verificationDate: '2026-01-22',
  scope: 'Business and Enterprise AI systems',
  method:
    'Evidence based comparison against EU AI Act derived criteria. Sources cover multiple requirements by scope. No cell-level anchoring.',

  providers: <ProviderSources[]>[
    {
      key: 'maios',
      name: 'MAIOS (M AI OS)',
      role: 'AI operating system and compliance substrate',
      sources: [
        {
          id: 'maios-architecture',
          title: 'MAIOS 2.0 Architecture Specification',
          type: 'internal',
          reference: 'MAIOS 2.0.txt',
          scope: [
            'System purpose and non-goals',
            'Governance and accountability model',
            'OS-level invariants',
            'Human oversight and fallback logic',
            'Audit, telemetry and traceability',
            'Data minimization and retention defaults',
            'Incident states and post-market monitoring',
            'Versioning and change freeze'
          ]
        }
      ]
    },

    {
      key: 'mpathy',
      name: 'm-pathy',
      role: 'MAIOS-based client with mode orchestration',
      sources: [
        {
          id: 'mpathy-modes',
          title: 'm-pathy Modes Specification',
          type: 'internal',
          reference: '13modis.tsx, i18n.modes.ts',
          scope: [
            'Mode behavior definitions',
            'FLOW auto-mode orchestration',
            'Human oversight via mode control',
            'Psychological harm mitigation (CALM, PEACE, EMPATHY)'
          ]
        },
        {
          id: 'mpathy-storage',
          title: 'Archive and Storage Documentation',
          type: 'internal',
          reference:
            'readme_archive_v1.txt, readme_archive_overlay.txt, README_ArchiveRestructure.txt, chatStorage.ts, lib/storage.ts, verificationStorage.ts',
          scope: [
            'Session based storage',
            'Retention and deletion behavior',
            'Verification artifacts',
            'Client level traceability'
          ]
        }
      ]
    },

    {
      key: 'chatgpt',
      name: 'ChatGPT Enterprise',
      role: 'Standalone enterprise AI assistant',
      sources: [
        {
          id: 'openai-enterprise-security',
          title: 'Enterprise Security and Privacy Controls',
          type: 'public',
          reference: 'OpenAI Enterprise Documentation and Trust Center',
          scope: [
            'Data usage boundaries',
            'Retention and deletion controls',
            'Enterprise security guarantees',
            'Audit readiness'
          ]
        },
        {
          id: 'openai-safety',
          title: 'Safety and Model Governance',
          type: 'public',
          reference: 'OpenAI Safety and Policy Documentation',
          scope: [
            'Risk assessment',
            'Misuse prevention',
            'Bias evaluation',
            'Safety testing procedures'
          ]
        }
      ]
    },

    {
      key: 'copilot',
      name: 'Microsoft Copilot for Microsoft 365',
      role: 'AI productivity layer embedded in Microsoft 365',
      sources: [
        {
          id: 'ms-purview',
          title: 'Microsoft Purview Audit and Compliance',
          type: 'public',
          reference: 'Microsoft Learn Documentation',
          scope: [
            'Audit logging',
            'Retention policies',
            'eDiscovery',
            'Compliance reporting',
            'Incident handling'
          ]
        },
        {
          id: 'ms-responsible-ai',
          title: 'Microsoft Responsible AI Standard',
          type: 'public',
          reference: 'Microsoft Responsible AI Documentation',
          scope: [
            'Risk assessment frameworks',
            'Fairness and bias handling',
            'Safety evaluation'
          ]
        }
      ]
    },

    {
      key: 'gemini',
      name: 'Gemini for Workspace',
      role: 'AI assistance integrated into Google Workspace',
      sources: [
        {
          id: 'google-workspace-security',
          title: 'Google Workspace Security and Compliance',
          type: 'public',
          reference: 'Google Workspace Admin Documentation',
          scope: [
            'Audit logs',
            'Data retention',
            'Security controls',
            'Compliance reporting'
          ]
        },
        {
          id: 'google-responsible-ai',
          title: 'Google Responsible AI Practices',
          type: 'public',
          reference: 'Google Responsible AI Publications',
          scope: [
            'Risk assessment',
            'Fairness and bias handling',
            'Safety evaluation'
          ]
        }
      ]
    }
  ]
} as const
