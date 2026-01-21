// lib/i18n.testimonials.ts
// Bottom-USP Raum (keine Social Proof Testimonials)
// EN als Master. 13 Sprachen, einzeilig, ruhig, besitz- & vertrauensbasiert.

type DictRoot = Record<string, any>;

export const testimonialsDict = {
  en: {
    space: {
      line1: "Your outputs are provable as yours — even years later.",
      line2: "Your data is not retained, repurposed, or observed.",
      line3: "The system is designed for accountability, not extraction.",
      label: "- m-pathy -",
    },
  },


de: {
  space: {
    line1: "Deine Ausgaben sind dir zuordenbar — selbst nach Jahren.",
    line2: "Deine Daten werden nicht gespeichert, weiterverwendet oder beobachtet.",
    line3: "Das System ist auf Rechenschaft ausgelegt, nicht auf Extraktion.",
    label: "- m-pathy -",
  },
},

fr: {
  space: {
    line1: "Vos résultats sont attribuables à vous — même des années plus tard.",
    line2: "Vos données ne sont ni conservées, ni réutilisées, ni observées.",
    line3: "Le système est conçu pour la responsabilité, pas pour l’extraction.",
    label: "- m-pathy -",
  },
},

es: {
  space: {
    line1: "Tus resultados son demostrables como tuyos — incluso años después.",
    line2: "Tus datos no se almacenan, reutilizan ni observan.",
    line3: "El sistema está diseñado para la responsabilidad, no para la extracción.",
    label: "- m-pathy -",
  },
},

it: {
  space: {
    line1: "I tuoi risultati sono dimostrabili come tuoi — anche dopo anni.",
    line2: "I tuoi dati non vengono memorizzati, riutilizzati o osservati.",
    line3: "Il sistema è progettato per la responsabilità, non per l’estrazione.",
    label: "- m-pathy -",
  },
},

pt: {
  space: {
    line1: "Os seus resultados são comprováveis como seus — mesmo após anos.",
    line2: "Os seus dados não são armazenados, reutilizados ou observados.",
    line3: "O sistema é concebido para responsabilidade, não para extração.",
    label: "- m-pathy -",
  },
},

nl: {
  space: {
    line1: "Uw resultaten blijven aantoonbaar van u — zelfs jaren later.",
    line2: "Uw gegevens worden niet opgeslagen, hergebruikt of geobserveerd.",
    line3: "Het systeem is ontworpen voor verantwoording, niet voor extractie.",
    label: "- m-pathy -",
  },
},

ru: {
  space: {
    line1: "Ваши результаты доказуемо принадлежат вам — даже спустя годы.",
    line2: "Ваши данные не сохраняются, не используются повторно и не наблюдаются.",
    line3: "Система создана для подотчётности, а не для извлечения.",
    label: "- m-pathy -",
  },
},

zh: {
  space: {
    line1: "你的输出可被证明属于你——即使多年之后。",
    line2: "你的数据不会被存储、复用或监控。",
    line3: "该系统为问责而设计，而非数据提取。",
    label: "- m-pathy -",
  },
},

ja: {
  space: {
    line1: "あなたの出力は、何年後でもあなたのものだと証明できます。",
    line2: "あなたのデータは保存・再利用・監視されません。",
    line3: "このシステムは抽出ではなく、説明責任のために設計されています。",
    label: "- m-pathy -",
  },
},

ko: {
  space: {
    line1: "당신의 결과물은 수년이 지나도 당신의 것임이 입증됩니다.",
    line2: "당신의 데이터는 저장·재사용·관찰되지 않습니다.",
    line3: "이 시스템은 추출이 아닌 책임을 위해 설계되었습니다.",
    label: "- m-pathy -",
  },
},

ar: {
  space: {
    line1: "يمكن إثبات أن مخرجاتك تعود لك — حتى بعد سنوات.",
    line2: "لا يتم حفظ بياناتك أو إعادة استخدامها أو مراقبتها.",
    line3: "تم تصميم النظام للمساءلة، لا للاستخراج.",
    label: "- m-pathy -",
  },
},

hi: {
  space: {
    line1: "आपके परिणाम वर्षों बाद भी आपके होने के रूप में सिद्ध किए जा सकते हैं।",
    line2: "आपका डेटा न तो संग्रहीत किया जाता है, न पुनः उपयोग किया जाता है, न निगरानी होती है।",
    line3: "यह प्रणाली उत्तरदायित्व के लिए बनाई गई है, न कि निष्कर्षण के लिए।",
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
