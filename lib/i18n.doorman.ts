// lib/i18n.doorman.ts
// Doorman-Copy – EN als Master, alle 13 Sprachen konsistent.
// Ziel: ruhig, erlaubend, kein Leistungsimpuls.

type DictRoot = Record<string, any>;

export const doormanDict = {
  en: {
    "prompt.doorman.main": "You can start.",
    "prompt.doorman.sub": "Wherever you are.",
  },

  de: {
    "prompt.doorman.main": "Du kannst beginnen.",
    "prompt.doorman.sub": "Wo auch immer du gerade bist.",
  },

  fr: {
    "prompt.doorman.main": "Tu peux commencer.",
    "prompt.doorman.sub": "Là où tu en es.",
  },

  es: {
    "prompt.doorman.main": "Puedes empezar.",
    "prompt.doorman.sub": "Dondequiera que estés.",
  },

  it: {
    "prompt.doorman.main": "Puoi iniziare.",
    "prompt.doorman.sub": "Da dove sei.",
  },

  pt: {
    "prompt.doorman.main": "Você pode começar.",
    "prompt.doorman.sub": "De onde você estiver.",
  },

  nl: {
    "prompt.doorman.main": "Je kunt beginnen.",
    "prompt.doorman.sub": "Waar je ook bent.",
  },

  ru: {
    "prompt.doorman.main": "Ты можешь начать.",
    "prompt.doorman.sub": "С того места, где ты сейчас.",
  },

  zh: {
    "prompt.doorman.main": "你可以开始。",
    "prompt.doorman.sub": "就在你所在的地方。",
  },

  ja: {
    "prompt.doorman.main": "ここから始められます。",
    "prompt.doorman.sub": "今のあなたの場所から。",
  },

  ko: {
    "prompt.doorman.main": "지금 시작해도 됩니다.",
    "prompt.doorman.sub": "당신이 있는 바로 그 자리에서.",
  },

  ar: {
    "prompt.doorman.main": "يمكنك أن تبدأ.",
    "prompt.doorman.sub": "من حيث أنت الآن.",
  },

  hi: {
    "prompt.doorman.main": "तुम शुरू कर सकते हो।",
    "prompt.doorman.sub": "जहाँ तुम अभी हो।",
  },
} as const;

export function attachDoorman(dict: DictRoot) {
  for (const [locale, values] of Object.entries(doormanDict)) {
    const current = (dict as DictRoot)[locale] ?? {};
    (dict as DictRoot)[locale] = {
      ...current,
      ...values,
    };
  }
}
