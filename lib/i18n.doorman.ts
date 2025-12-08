// lib/i18n.doorman.ts
// Doorman-Copy – EN als Master, alle 13 Sprachen konsistent.
// Wird in lib/i18n.ts via attachDoorman(DICTS) ans Legacy-Chat-Dict angehängt.

type DictRoot = Record<string, any>;

export const doormanDict = {
  en: {
    "prompt.doorman.main": "You are the origin.",
    "prompt.doorman.sub": "Press “+” and “BUILD” and let worlds assemble.",
  },

  de: {
    "prompt.doorman.main": "Du bist der Ursprung.",
    "prompt.doorman.sub": "Drücke „+“ und „BUILD“ und lass Welten entstehen.",
  },

  fr: {
    "prompt.doorman.main": "Tu es l’origine.",
    "prompt.doorman.sub": "Appuie sur « + » puis « BUILD » et laisse des mondes se former.",
  },

  es: {
    "prompt.doorman.main": "Tú eres el origen.",
    "prompt.doorman.sub": "Pulsa « + » y « BUILD » y deja que los mundos tomen forma.",
  },

  it: {
    "prompt.doorman.main": "Tu sei l'origine.",
    "prompt.doorman.sub": "Premi « + » e « BUILD » e lascia che i mondi si assemblino.",
  },

  pt: {
    "prompt.doorman.main": "Você é a origem.",
    "prompt.doorman.sub": "Pressione « + » e « BUILD » e deixe mundos se formarem.",
  },

  nl: {
    "prompt.doorman.main": "Jij bent de oorsprong.",
    "prompt.doorman.sub": "Druk op ‘+’ en ‘BUILD’ en laat werelden ontstaan.",
  },

  ru: {
    "prompt.doorman.main": "Ты — источник.",
    "prompt.doorman.sub": "Нажми «+» и «BUILD» — и пусть миры складываются.",
  },

  zh: {
    "prompt.doorman.main": "你就是起源。",
    "prompt.doorman.sub": "按下「+」与「BUILD」，让世界自行组装。",
  },

  ja: {
    "prompt.doorman.main": "あなたが起源です。",
    "prompt.doorman.sub": "「+」と「BUILD」を押して、世界が組み上がるのを見てください。",
  },

  ko: {
    "prompt.doorman.main": "당신이 바로 기원입니다。",
    "prompt.doorman.sub": "‘+’와 ‘BUILD’를 눌러 세계가 조립되는 순간을 보세요。",
  },

  ar: {
    "prompt.doorman.main": "أنت الأصل.",
    "prompt.doorman.sub": "اضغط «BUILD» ثم «+» ودَع العوالم تتكوّن.",
  },

  hi: {
    "prompt.doorman.main": "तुम ही मूल हो।",
    "prompt.doorman.sub": "«+» और «BUILD» दबाओ और दुनिया-ओं को बनते देखो।",
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
