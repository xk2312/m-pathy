// lib/i18n.hero.ts
// Hero-Copy für Subscription/Landing – EN als Master.
// Wird in lib/i18n.ts via attachHero(dict) an das UX-Dict angehängt.

type DictRoot = Record<string, any>;

export const heroDict = {
  en: {
    hero_title: "Create at the Speed of Thought",
    hero_sub: "Your mind becomes the interface, the system does the rest",
    hero_cta: "Start thinking",
  },

  de: {
    hero_title: "Mach aus Gedanken Realität",
    hero_sub: "Dein Geist wird zur Schnittstelle, das System übernimmt den Rest",
    hero_cta: "Denk los",
  },

  fr: {
    hero_title: "Crée à la vitesse de la pensée",
    hero_sub: "Ton esprit devient l’interface, le système fait le reste",
    hero_cta: "Commence à penser",
  },

  es: {
    hero_title: "Crea a la velocidad del pensamiento",
    hero_sub: "Tu mente se convierte en la interfaz y el sistema hace el resto",
    hero_cta: "Empieza a pensar",
  },

  it: {
    hero_title: "Crea alla velocità del pensiero",
    hero_sub: "La tua mente diventa l’interfaccia e il sistema fa il resto",
    hero_cta: "Inizia a pensare",
  },

  pt: {
    hero_title: "Crie na velocidade do pensamento",
    hero_sub: "Sua mente se torna a interface e o sistema faz o resto",
    hero_cta: "Comece a pensar",
  },

  nl: {
    hero_title: "Creëer met de snelheid van gedachten",
    hero_sub: "Je geest wordt de interface, het systeem doet de rest",
    hero_cta: "Begin met denken",
  },

  ru: {
    hero_title: "Создавайте со скоростью мысли",
    hero_sub: "Ваш разум становится интерфейсом, а система делает остальное",
    hero_cta: "Начните думать",
  },

  zh: {
    hero_title: "以思维的速度创造",
    hero_sub: "你的大脑成为界面，系统完成其余的一切",
    hero_cta: "开始思考",
  },

  ja: {
    hero_title: "思考の速さで創造する",
    hero_sub: "あなたの心がインターフェースとなり、あとはシステムが担います",
    hero_cta: "考えることから始める",
  },

  ko: {
    hero_title: "생각의 속도로 창조하세요",
    hero_sub: "당신의 마음이 인터페이스가 되고, 나머지는 시스템이 맡습니다",
    hero_cta: "생각을 시작하기",
  },

  ar: {
    hero_title: "اخلق بسرعة الفكر",
    hero_sub: "عقلك يصبح الواجهة، والنظام يتولى الباقي",
    hero_cta: "ابدأ التفكير",
  },

  hi: {
    hero_title: "सोच की गति से निर्माण करें",
    hero_sub: "आपका मन इंटरफ़ेस बन जाता है, और सिस्टम बाकी सब कर देता है",
    hero_cta: "सोचना शुरू करें",
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
