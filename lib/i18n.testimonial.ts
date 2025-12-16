// lib/i18n.testimonials.ts
// Raum-States (keine Social Proof Testimonials mehr)
// EN als Master. 13 Sprachen, zustandsbasiert, ruhig.

type DictRoot = Record<string, any>;

export const testimonialsDict = {
  en: {
    space: {
      arrive: "I can come as I am",
      stay: "I can pause",
      anchor: "I trust the ground beneath my thoughts.",
    },
  },

  de: {
    space: {
      arrive: "Ich kann so kommen, wie ich bin",
      stay: "Ich kann innehalten",
      anchor: "Ich vertraue dem Boden unter meinen Gedanken.",
    },
  },

  fr: {
    space: {
      arrive: "Je peux venir tel que je suis",
      stay: "Je peux faire une pause",
      anchor: "Je fais confiance au sol sous mes pensées.",
    },
  },

  es: {
    space: {
      arrive: "Puedo venir tal como soy",
      stay: "Puedo pausar",
      anchor: "Confío en el suelo bajo mis pensamientos.",
    },
  },

  it: {
    space: {
      arrive: "Posso arrivare così come sono",
      stay: "Posso fermarmi un momento",
      anchor: "Mi fido del terreno sotto i miei pensieri.",
    },
  },

  pt: {
    space: {
      arrive: "Posso chegar como eu sou",
      stay: "Posso pausar",
      anchor: "Confio no chão sob meus pensamentos.",
    },
  },

  nl: {
    space: {
      arrive: "Ik kan komen zoals ik ben",
      stay: "Ik kan pauzeren",
      anchor: "Ik vertrouw op de grond onder mijn gedachten.",
    },
  },

  ru: {
    space: {
      arrive: "Я могу прийти таким, какой я есть",
      stay: "Я могу сделать паузу",
      anchor: "Я доверяю опоре под своими мыслями.",
    },
  },

  zh: {
    space: {
      arrive: "我可以如我所是地到来",
      stay: "我可以停一停",
      anchor: "我信任承载我思绪的根基。",
    },
  },

  ja: {
    space: {
      arrive: "ありのままの自分で来ていい",
      stay: "立ち止まってもいい",
      anchor: "思考の下にある確かな土台を信頼できる。",
    },
  },

  ko: {
    space: {
      arrive: "있는 그대로 올 수 있어요",
      stay: "잠시 멈춰도 됩니다",
      anchor: "내 생각 아래의 토대를 신뢰합니다.",
    },
  },

  ar: {
    space: {
      arrive: "يمكنني أن آتي كما أنا",
      stay: "يمكنني أن أتوقف قليلاً",
      anchor: "أثق بالأرض التي تحمل أفكاري.",
    },
  },

  hi: {
    space: {
      arrive: "मैं जैसा हूँ वैसा आ सकता हूँ",
      stay: "मैं रुक सकता हूँ",
      anchor: "मैं अपने विचारों के नीचे की ज़मीन पर भरोसा करता हूँ।",
    },
  },
} as const;

export function attachTestimonials(dict: DictRoot) {
  for (const [locale, values] of Object.entries(testimonialsDict)) {
    const current = (dict as DictRoot)[locale] ?? {};
    (dict as DictRoot)[locale] = {
      ...current,
      ...values,
    };
  }
}
