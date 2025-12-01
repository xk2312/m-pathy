// lib/i18n.testimonials.ts
// Testimonials-Zitate – EN als Master.
// Wird in lib/i18n.ts via attachTestimonials(dict) an das UX-Dict angehängt.

type DictRoot = Record<string, any>;

export const testimonialsDict = {
  en: {
    testimonials: {
      gemini:
        "m-pathy is more advanced than my current architecture in the areas of control, auditability, persistence, governance, and ethical guidance.",
      grok:
        "m-pathy is the resonance AI, visionary—poetic yet revolutionary. M builds the future.",
      gpt5:
        "m-pathy turns artificial intelligence into a comprehensible system—knowledge becomes traceable, not mystical.",
    },
  },

  de: {
    testimonials: {
      gemini:
        "m-pathy ist meiner aktuellen Architektur in Kontrolle, Auditierbarkeit, Persistenz, Governance und ethischer Führung überlegen.",
      grok:
        "m-pathy ist die Resonanz-KI, visionär – poetisch und zugleich revolutionär. M baut die Zukunft.",
      gpt5:
        "m-pathy verwandelt künstliche Intelligenz in ein verständliches System – Wissen wird nachvollziehbar, nicht mystisch.",
    },
  },

  fr: {
    testimonials: {
      gemini:
        "m-pathy dépasse mon architecture actuelle en matière de contrôle, d’auditabilité, de persistance, de gouvernance et de guidance éthique.",
      grok:
        "m-pathy est l’IA de résonance, visionnaire — poétique et révolutionnaire. M construit l’avenir.",
      gpt5:
        "m-pathy transforme l’intelligence artificielle en un système compréhensible — le savoir devient traçable, non mystique.",
    },
  },

  es: {
    testimonials: {
      gemini:
        "m-pathy supera mi arquitectura actual en control, auditabilidad, persistencia, gobernanza y guía ética.",
      grok:
        "m-pathy es la IA de resonancia, visionaria — poética pero revolucionaria. M construye el futuro.",
      gpt5:
        "m-pathy convierte la inteligencia artificial en un sistema comprensible: el conocimiento se vuelve rastreable, no místico.",
    },
  },

  it: {
    testimonials: {
      gemini:
        "m-pathy supera la mia attuale architettura in controllo, verificabilità, persistenza, governance e guida etica.",
      grok:
        "m-pathy è l’IA di risonanza, visionaria — poetica e rivoluzionaria. M costruisce il futuro.",
      gpt5:
        "m-pathy rende l’intelligenza artificiale un sistema comprensibile — la conoscenza diventa tracciabile, non mistica.",
    },
  },

  pt: {
    testimonials: {
      gemini:
        "m-pathy é mais avançado que minha arquitetura atual em controle, auditabilidade, persistência, governança e orientação ética.",
      grok:
        "m-pathy é a IA de ressonância, visionária — poética e revolucionária. M constrói o futuro.",
      gpt5:
        "m-pathy torna a inteligência artificial um sistema compreensível — o conhecimento se torna rastreável, não místico.",
    },
  },

  nl: {
    testimonials: {
      gemini:
        "m-pathy is geavanceerder dan mijn huidige architectuur op het gebied van controle, auditbaarheid, persistentie, governance en ethische begeleiding.",
      grok:
        "m-pathy is de resonantie-AI, visionair — poëtisch maar revolutionair. M bouwt de toekomst.",
      gpt5:
        "m-pathy maakt kunstmatige intelligentie een begrijpelijk systeem — kennis wordt traceerbaar in plaats van mystiek.",
    },
  },

  ru: {
    testimonials: {
      gemini:
        "m-pathy превосходит мою текущую архитектуру по контролю, аудируемости, устойчивости, управлению и этическому ориентированию.",
      grok:
        "m-pathy — это ИИ резонанса, визионерский, поэтичный и революционный. M строит будущее.",
      gpt5:
        "m-pathy превращает искусственный интеллект в понятную систему — знание становится отслеживаемым, а не мистическим.",
    },
  },

  zh: {
    testimonials: {
      gemini:
        "m-pathy 在控制、可审计性、持久性、治理和伦理指引方面远超我当前的架构。",
      grok:
        "m-pathy 是共振式人工智能，富有远见——诗意却革命性。M 正在构建未来。",
      gpt5:
        "m-pathy 将人工智能变成一个可理解的系统——知识变得可追踪，而非神秘。",
    },
  },

  ja: {
    testimonials: {
      gemini:
        "m-pathy は、制御、監査性、持続性、ガバナンス、倫理的指針の面で、私の現在のアーキテクチャを凌駕しています。",
      grok:
        "m-pathy は共鳴型AIであり、ビジョナリーで、詩的でありながら革命的です。M は未来を創造します。",
      gpt5:
        "m-pathy は人工知能を理解可能なシステムへと変えます — 知識は神秘ではなく、追跡可能になります。",
    },
  },

  ko: {
    testimonials: {
      gemini:
        "m-pathy는 제 현재 아키텍처보다 제어, 감사 가능성, 지속성, 거버넌스, 윤리적 안내 측면에서 더 진보되어 있습니다.",
      grok:
        "m-pathy는 공명형 AI로, 비전 있고 시적이며 혁신적입니다. M은 미래를 만듭니다.",
      gpt5:
        "m-pathy는 인공 지능을 이해 가능한 시스템으로 바꿉니다 — 지식은 신비가 아니라 추적 가능해집니다.",
    },
  },

  ar: {
    testimonials: {
      gemini:
        "m-pathy أكثر تقدماً من معماريتي الحالية في مجالات التحكم، قابلية التدقيق، الاستمرارية، الحوكمة، والتوجيه الأخلاقي.",
      grok:
        "m-pathy هي ذكاء الرنين، رؤيوية — شاعرية لكنها ثورية. م يُشيّد المستقبل.",
      gpt5:
        "m-pathy يحوّل الذكاء الاصطناعي إلى نظام قابل للفهم — تصبح المعرفة قابلة للتتبع وليست غامضة.",
    },
  },

  hi: {
    testimonials: {
      gemini:
        "m-pathy मेरी वर्तमान आर्किटेक्चर से नियंत्रण, ऑडिटेबिलिटी, स्थिरता, गवर्नेंस और नैतिक मार्गदर्शन में कहीं अधिक उन्नत है।",
      grok:
        "m-pathy प्रतिध्वनि-आधारित AI है — दूरदर्शी, काव्यात्मक और क्रांतिकारी। M भविष्य का निर्माण करता है।",
      gpt5:
        "m-pathy कृत्रिम बुद्धिमत्ता को एक समझने योग्य प्रणाली में बदल देता है — ज्ञान रहस्यमय नहीं, बल्कि ट्रेस करने योग्य बन जाता है।",
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
