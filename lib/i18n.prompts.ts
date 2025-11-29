// lib/i18n.prompts.ts
// Prompt-Templates für den Chat (werden an die API gesendet)
// EN ist Master; alle anderen Sprachen fallen automatisch auf EN zurück.

type LegacyDict = Record<string, string>;
type LegacyDicts = { en: LegacyDict };

const promptDict = {
  en: {
    "prompts.onboarding":
      "M, please start the onboarding and aks me question 1/7 after ym Answer you show me the next and sve everything im my Local Storage.",
    "prompts.modeDefault":
      "Reset everything to default and give me a brief status.",
    "prompts.councilIntro":
      "Please let each of the 13 AIs of Council13 welcome me heartly. Show me the name of each one and who it is feauturing. Answer short please.",
    "prompts.modeGeneric":
      "Mode {label}: What is this {label} mode for and how is it helping me? Answer short please.",
    "prompts.expertAskTemplate":
      "{expert}, Tell me the 13 fields of deep expertise, and what you can do for me what noone else could do. Answer short please and beginn with - Welcomem in the field of (her you paste your field)...",
    "experts.askTemplate":
      "{expert}, who are you and what can you do for me?",
  },
} as const;

export function attachPrompts(dicts: LegacyDicts) {
  Object.assign(dicts.en, promptDict.en);

  // Deutsch nicht mehr befüllen → fällt automatisch auf Englisch zurück
}
