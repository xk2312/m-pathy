// lib/i18n.testimonials.ts
// Bottom-USP Raum (keine Social Proof Testimonials)
// EN als Master. 13 Sprachen, einzeilig, ruhig, besitz- & vertrauensbasiert.

type DictRoot = Record<string, any>;

export const testimonialsDict = {
  en: {
    space: {
  line1: "Provable as yours – even years later.",
  line2: "Not retained. Not repurposed. Not observed.",
  line3: "Designed for accountability, not extraction.",
  label: "- m-pathy -",
},

 },

de: {
  space: {
    line1: "Als deine belegbar – selbst nach Jahren.",
    line2: "Nicht gespeichert. Nicht weiterverwendet. Nicht beobachtet.",
    line3: "Für Rechenschaft entworfen – nicht für Extraktion.",
    label: "- m-pathy -",
  },
},

fr: {
  space: {
    line1: "Attribuable à vous — même des années plus tard.",
    line2: "Non conservé. Non réutilisé. Non observé.",
    line3: "Conçu pour la responsabilité, pas pour l’extraction.",
    label: "- m-pathy -",
  },
},

es: {
  space: {
    line1: "Demostrable como suyo — incluso años después.",
    line2: "No almacenado. No reutilizado. No observado.",
    line3: "Diseñado para la responsabilidad, no para la extracción.",
    label: "- m-pathy -",
  },
},

it: {
  space: {
    line1: "Dimostrabile come tuo — anche dopo anni.",
    line2: "Non memorizzato. Non riutilizzato. Non osservato.",
    line3: "Progettato per la responsabilità, non per l’estrazione.",
    label: "- m-pathy -",
  },
},

pt: {
  space: {
    line1: "Comprovável como seu — mesmo após anos.",
    line2: "Não armazenado. Não reutilizado. Não observado.",
    line3: "Projetado para responsabilidade, não para extração.",
    label: "- m-pathy -",
  },
},

nl: {
  space: {
    line1: "Als van u aantoonbaar — zelfs jaren later.",
    line2: "Niet opgeslagen. Niet hergebruikt. Niet geobserveerd.",
    line3: "Ontworpen voor verantwoording, niet voor extractie.",
    label: "- m-pathy -",
  },
},

ru: {
  space: {
    line1: "Доказуемо ваше — даже спустя годы.",
    line2: "Не сохраняется. Не используется повторно. Не наблюдается.",
    line3: "Создано для подотчётности, а не для извлечения.",
    label: "- m-pathy -",
  },
},

zh: {
  space: {
    line1: "即使多年之后，仍可证明归你所有。",
    line2: "不存储。不复用。不监控。",
    line3: "为问责而设计，而非数据提取。",
    label: "- m-pathy -",
  },
},

ja: {
  space: {
    line1: "何年後でも、あなたのものだと証明できます。",
    line2: "保存しない。再利用しない。監視しない。",
    line3: "抽出のためではなく、説明責任のために設計。",
    label: "- m-pathy -",
  },
},

ko: {
  space: {
    line1: "수년이 지나도 당신의 것임을 증명할 수 있습니다.",
    line2: "저장하지 않습니다. 재사용하지 않습니다. 관찰하지 않습니다.",
    line3: "추출이 아닌 책임을 위해 설계되었습니다.",
    label: "- m-pathy -",
  },
},

ar: {
  space: {
    line1: "قابل للإثبات بأنه لك — حتى بعد سنوات.",
    line2: "غير مخزن. غير معاد استخدامه. غير مراقب.",
    line3: "مصمم للمساءلة، لا للاستخراج.",
    label: "- m-pathy -",
  },
},

hi: {
  space: {
    line1: "कई वर्षों बाद भी, इसे आपका साबित किया जा सकता है।",
    line2: "संग्रहीत नहीं। पुनः उपयोग नहीं। निगरानी नहीं।",
    line3: "उत्तरदायित्व के लिए डिज़ाइन किया गया, निष्कर्षण के लिए नहीं।",
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
