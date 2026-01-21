// lib/i18n.hero.ts
// Hero-Copy für Subscription/Landing – EN als Master.
// Neuer Anker: ruhig, klar, nicht performativ.

type DictRoot = Record<string, any>;

export const heroDict = {
  en: {
    hero_title: "Built for the EU AI Act — by architecture.",
    hero_sub:
      "A professional AI workspace for regulated environments. Designed for compliant reasoning, analysis, and decision-making without data extraction, hidden training, or surveillance.",

    hero_proof_1: "Data minimization by architecture, not policy",
    hero_proof_2: "No training on your data — ever",
    hero_proof_3: "Non-retentive, session-bound reasoning",
    hero_proof_4: "Human-controlled interaction, no manipulation loops",
    hero_proof_5: "Outputs designed for auditability and accountability",
    hero_price_monthly: "€179 / month",
    hero_price_yearly: "€1,932 / year · 10% discount (annual)",
    hero_cta: "Start professional access",
  },

 de: {
  hero_title: "Strikt in der Sicherheit. Sanft im Wesen.",
  hero_sub: "Ein Ort zum Denken — ohne beobachtet zu werden.",
  hero_cta: "Hier beginnen",
},


  fr: {
    hero_title: "Vérifié par conception. Doux par nature.",
    hero_sub: "Un lieu pour penser — sans être observé.",
    hero_cta: "Commencer ici",
  },

  es: {
    hero_title: "Verificado por diseño. Suave por naturaleza.",
    hero_sub: "Un lugar para pensar — sin ser observado.",
    hero_cta: "Empezar aquí",
  },

  it: {
    hero_title: "Verificato nel design. Gentile per natura.",
    hero_sub: "Un luogo per pensare — senza essere osservati.",
    hero_cta: "Inizia qui",
  },

  pt: {
    hero_title: "Verificado por design. Gentil por natureza.",
    hero_sub: "Um lugar para pensar — sem ser observado.",
    hero_cta: "Começar aqui",
  },

  nl: {
    hero_title: "Ontworpen met verificatie. Zacht van aard.",
    hero_sub: "Een plek om te denken — zonder bekeken te worden.",
    hero_cta: "Hier beginnen",
  },

  ru: {
    hero_title: "Проверено по замыслу. Мягко по своей природе.",
    hero_sub: "Место для мышления — без наблюдения.",
    hero_cta: "Начать здесь",
  },

  zh: {
    hero_title: "以验证为设计。以温和为本质。",
    hero_sub: "一个用于思考的空间——不被观察。",
    hero_cta: "从这里开始",
  },

  ja: {
    hero_title: "検証を前提に設計。やさしさを本質に。",
    hero_sub: "見られることなく、考えるための場所。",
    hero_cta: "ここから始める",
  },

  ko: {
    hero_title: "검증을 바탕으로 설계. 본질은 부드러움.",
    hero_sub: "관찰되지 않고 생각할 수 있는 공간.",
    hero_cta: "여기서 시작하기",
  },

  ar: {
    hero_title: "مُتحقَّق منه في التصميم. لطيف في جوهره.",
    hero_sub: "مكان للتفكير — دون أن يراقبك أحد.",
    hero_cta: "ابدأ من هنا",
  },

  hi: {
    hero_title: "डिज़ाइन में सत्यापित। स्वभाव में सौम्य।",
    hero_sub: "सोचने के लिए एक स्थान — बिना निगरानी के।",
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
