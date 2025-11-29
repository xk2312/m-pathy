// lib/i18n.prompts.ts
// Prompt-Templates für den Chat (werden an die API gesendet)
// EN ist Master; alle anderen Sprachen fallen automatisch auf EN zurück.

type LegacyDict = Record<string, string>;
type LegacyDicts = { en: LegacyDict };

const promptDict = {
  en: {
    "prompts.onboarding":
      "Hey! 👋 Who are you and how will you guide me here step by step?",
    "prompts.modeDefault":
      "Reset everything to default and give me a brief status.",
    "prompts.councilIntro":
      "Each AI please introduce yourself and say how you can help right now.",
    "prompts.modeGeneric":
      "Mode {label}: What are you and where will you help me best?",
    "prompts.expertAskTemplate":
      "{expert}, who are you and what can you do for me?",
    "experts.askTemplate":
      "{expert}, who are you and what can you do for me?",
    "experts.askTemplateDefault":
      "{expert}, who are you and what can you do for me?",
    "cta.fallback":
      "All set — tell me what you want to build (app, flow, feature …).",
  },
} as const;

export function attachPrompts(dicts: LegacyDicts) {
  Object.assign(dicts.en, promptDict.en);

  // Deutsch nicht mehr befüllen → fällt automatisch auf Englisch zurück
}
