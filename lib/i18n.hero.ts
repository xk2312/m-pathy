// lib/i18n.hero.ts
// Hero-Copy für Subscription/Landing – EN als Master.
// Neuer Anker: ruhig, klar, nicht performativ.

type DictRoot = Record<string, any>;

export const heroDict = {
  en: {
    hero_title: "Verified by design. Gentle by nature.",
    hero_sub: "Trust is built in — not asked for.",
    hero_cta: "Begin here",
  },

  de: {
    hero_title: "Geprüft im Design. Sanft im Wesen.",
    hero_sub: "Vertrauen ist eingebaut — nicht eingefordert.",
    hero_cta: "Hier beginnen",
  },

  fr: {
    hero_title: "Vérifié par conception. Doux par nature.",
    hero_sub: "La confiance est intégrée — pas exigée.",
    hero_cta: "Commencer ici",
  },

  es: {
    hero_title: "Verificado por diseño. Suave por naturaleza.",
    hero_sub: "La confianza está integrada — no se exige.",
    hero_cta: "Empezar aquí",
  },

  it: {
    hero_title: "Verificato nel design. Gentile per natura.",
    hero_sub: "La fiducia è integrata — non richiesta.",
    hero_cta: "Inizia qui",
  },

  pt: {
    hero_title: "Verificado por design. Gentil por natureza.",
    hero_sub: "A confiança é integrada — não exigida.",
    hero_cta: "Começar aqui",
  },

  nl: {
    hero_title: "Ontworpen met verificatie. Zacht van aard.",
    hero_sub: "Vertrouwen is ingebouwd — niet gevraagd.",
    hero_cta: "Hier beginnen",
  },

  ru: {
    hero_title: "Проверено по замыслу. Мягко по своей природе.",
    hero_sub: "Доверие заложено — его не требуют.",
    hero_cta: "Начать здесь",
  },

  zh: {
    hero_title: "以验证为设计。以温和为本质。",
    hero_sub: "信任已内建——无需索取。",
    hero_cta: "从这里开始",
  },

  ja: {
    hero_title: "検証を前提に設計。やさしさを本質に。",
    hero_sub: "信頼は組み込まれている——求められるものではありません。",
    hero_cta: "ここから始める",
  },

  ko: {
    hero_title: "검증을 바탕으로 설계. 본질은 부드러움.",
    hero_sub: "신뢰는 이미 내재되어 있습니다 — 요구하지 않습니다.",
    hero_cta: "여기서 시작하기",
  },

  ar: {
    hero_title: "مُتحقَّق منه في التصميم. لطيف في جوهره.",
    hero_sub: "الثقة مدمجة — لا يُطلب إثباتها.",
    hero_cta: "ابدأ من هنا",
  },

  hi: {
    hero_title: "डिज़ाइन में सत्यापित। स्वभाव में सौम्य।",
    hero_sub: "विश्वास अंतर्निहित है — माँगा नहीं जाता।",
    hero_cta: "यहीं से शुरू करें",
  },
} as const;

export function attachHero(dict: DictRoot) {
  for (const [locale, values] of Object.entries(heroDict)) {
    const current = (dict as DictRoot)[locale] ?? {};
    (dict as DictRoot)[locale] = {
      ...current,
      ...values,
    };
  }
}
