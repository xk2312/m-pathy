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
      line1: "Ihre Ergebnisse sind dauerhaft Ihnen zuordenbar, auch Jahre später.",
      line2: "Ihre Daten werden nicht gespeichert, weiterverwendet oder überwacht.",
      line3: "Das System ist auf Nachvollziehbarkeit ausgelegt, nicht auf Extraktion.",
      label: "- m-pathy -",
    },
  },

  fr: {
    space: {
      line1: "Vos résultats vous sont attribuables, même des années plus tard.",
      line2: "Vos données ne sont ni conservées, ni réutilisées, ni observées.",
      line3: "Le système est conçu pour la responsabilité, pas pour l’extraction.",
      label: "- m-pathy -",
    },
  },

  es: {
    space: {
      line1: "Sus resultados son atribuibles a usted, incluso años después.",
      line2: "Sus datos no se almacenan, reutilizan ni supervisan.",
      line3: "El sistema está diseñado para responsabilidad, no para extracción.",
      label: "- m-pathy -",
    },
  },

  it: {
    space: {
      line1: "I Suoi risultati restano attribuibili a Lei, anche dopo anni.",
      line2: "I Suoi dati non vengono conservati, riutilizzati o osservati.",
      line3: "Il sistema è progettato per responsabilità, non per estrazione.",
      label: "- m-pathy -",
    },
  },

  pt: {
    space: {
      line1: "Os seus resultados permanecem atribuíveis, mesmo anos depois.",
      line2: "Os seus dados não são retidos, reutilizados ou monitorados.",
      line3: "O sistema é projetado para responsabilidade, não para extração.",
      label: "- m-pathy -",
    },
  },

  nl: {
    space: {
      line1: "Uw resultaten blijven aan u toewijsbaar, zelfs jaren later.",
      line2: "Uw gegevens worden niet opgeslagen, hergebruikt of geobserveerd.",
      line3: "Het systeem is ontworpen voor verantwoording, niet voor extractie.",
      label: "- m-pathy -",
    },
  },

  ru: {
    space: {
      line1: "Ваши результаты остаются за вами, даже спустя годы.",
      line2: "Ваши данные не хранятся, не используются повторно и не отслеживаются.",
      line3: "Система создана для подотчетности, а не для извлечения.",
      label: "- m-pathy -",
    },
  },

  zh: {
    space: {
      line1: "您的结果始终可归属给您，即使多年之后。",
      line2: "您的数据不会被保存、再利用或监控。",
      line3: "系统旨在实现可追责性，而非数据提取。",
      label: "- m-pathy -",
    },
  },

  ja: {
    space: {
      line1: "成果は、何年後でもお客様に帰属します。",
      line2: "データは保存、再利用、監視されません。",
      line3: "本システムは説明責任のために設計されています。",
      label: "- m-pathy -",
    },
  },

  ko: {
    space: {
      line1: "결과는 수년이 지나도 귀하에게 귀속됩니다.",
      line2: "데이터는 저장, 재사용 또는 감시되지 않습니다.",
      line3: "시스템은 책임성을 위해 설계되었습니다.",
      label: "- m-pathy -",
    },
  },

  ar: {
    space: {
      line1: "تبقى النتائج منسوبة إليكم حتى بعد سنوات.",
      line2: "لا يتم الاحتفاظ ببياناتكم أو إعادة استخدامها أو مراقبتها.",
      line3: "تم تصميم النظام للمساءلة، لا للاستخراج.",
      label: "- m-pathy -",
    },
  },

  hi: {
    space: {
      line1: "परिणाम वर्षों बाद भी आपके नाम से जुड़े रहते हैं।",
      line2: "डेटा न संग्रहीत किया जाता है, न पुनः उपयोग होता है, न निगरानी होती है।",
      line3: "प्रणाली जवाबदेही के लिए है, निष्कर्षण के लिए नहीं।",
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
