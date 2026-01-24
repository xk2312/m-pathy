// lib/comparison.sources.ts

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