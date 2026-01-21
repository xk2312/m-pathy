// lib/i18n.testimonials.ts
// Bottom-USP Raum (keine Social Proof Testimonials)
// EN als Master. 13 Sprachen, einzeilig, ruhig, besitz- & vertrauensbasiert.

type DictRoot = Record<string, any>;

export const testimonialsDict = {
  en: {
    space: {
      line1: "Your thoughts stay with you.",
      line2: "Unread by anyone.",
      line3: "Provable as yours - even years later.",
      label: "- m-pathy -",
    },
  },

  de: {
    space: {
      line1: "Deine Gedanken bleiben bei dir.",
      line2: "Von niemandem gelesen.",
      line3: "Als deine belegbar - selbst nach Jahren.",
      label: "- m-pathy -",
    },
  },

  fr: {
    space: {
      line1: "Tes pensées restent avec toi.",
      line2: "Lues par personne.",
      line3: "Attribuables à toi - même des années plus tard.",
      label: "- m-pathy -",
    },
  },

  es: {
    space: {
      line1: "Tus pensamientos permanecen contigo.",
      line2: "No leídos por nadie.",
      line3: "Demostrables como tuyos - incluso años después.",
      label: "- m-pathy -",
    },
  },

  it: {
    space: {
      line1: "I tuoi pensieri restano con te.",
      line2: "Non letti da nessuno.",
      line3: "Dimostrabili come tuoi - anche dopo anni.",
      label: "- m-pathy -",
    },
  },

  pt: {
    space: {
      line1: "Seus pensamentos ficam com você.",
      line2: "Não lidos por ninguém.",
      line3: "Comprováveis como seus - mesmo anos depois.",
      label: "- m-pathy -",
    },
  },

  nl: {
    space: {
      line1: "Je gedachten blijven bij jou.",
      line2: "Door niemand gelezen.",
      line3: "Als van jou te bewijzen - zelfs jaren later.",
      label: "- m-pathy -",
    },
  },

  ru: {
    space: {
      line1: "Твои мысли остаются с тобой.",
      line2: "Никем не прочитаны.",
      line3: "Доказуемо принадлежат тебе - даже спустя годы.",
      label: "- m-pathy -",
    },
  },

  zh: {
    space: {
      line1: "你的思绪始终属于你。",
      line2: "无人读取。",
      line3: "多年之后，仍可证明归你所有。",
      label: "- m-pathy -",
    },
  },

  ja: {
    space: {
      line1: "あなたの思考は、あなたと共にあります。",
      line2: "誰にも読まれません。",
      line3: "何年後でも、あなたのものだと証明できます。",
      label: "- m-pathy -",
    },
  },

  ko: {
    space: {
      line1: "당신의 생각은 당신과 함께 남아 있습니다.",
      line2: "그 누구도 읽지 않습니다.",
      line3: "수년이 지나도 당신의 것임을 증명할 수 있습니다.",
      label: "- m-pathy -",
    },
  },

  ar: {
    space: {
      line1: "أفكارك تبقى معك.",
      line2: "لا يقرأها أحد.",
      line3: "يمكن إثبات أنها لك - حتى بعد سنوات.",
      label: "- m-pathy -",
    },
  },

  hi: {
    space: {
      line1: "आपके विचार आपके साथ ही रहते हैं।",
      line2: "किसी द्वारा पढ़े नहीं जाते।",
      line3: "सालों बाद भी, आपके होने का प्रमाण दिया जा सकता है।",
      label: "- m-pathy -",
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
