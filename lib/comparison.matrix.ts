export type ProviderKey =
  | "maios"
  | "mpathy"
  | "chatgpt"
  | "copilot"
  | "gemini";

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
      chatgpt: false,
      copilot: true,
      gemini: true,
    },
    role_separation: {
      maios: true,
      mpathy: true,
      chatgpt: false,
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
