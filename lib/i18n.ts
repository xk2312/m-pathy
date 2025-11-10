// lib/i18n.ts
// Minimal, SSR-safe i18n helper with browser + localStorage detection.

type Dict = Record<string, string>;

/** English dictionary (source of truth for keys) */
const en = {
  // Input / messaging
  writeMessage: "Write a message…",
  send: "Send",

  // Input helpers
  tools: "Tools",
  newline: "New line",
  comingUpload: "Upload",
  comingVoice: "Voice",
  comingFunctions: "Options",

  // Overlay header / buttons (mobile)
  mobileNav: "Mobile navigation",
  close: "Close",

  // Sidebar / Column 
  columnTitle: "Column",
  sectionControl: "Controls",
  onboarding: "ONBOARDING",
  mDefault: "M · Default",
  selectMode: "Choose mode",
  council13: "COUNCIL13",
  selectAI: "Choose AI",
  modules: "Modules",
  coming: "Coming",

  // Sidebar additions (experts & CTA)
  selectExpert: "Choose expert",
  statusExpert: "Expert:",
  clearChat: "Clear chat",
  startBuilding: "Start building",
  startBuildingMsg:
    "What can you build here, and how can I help? I'll answer briefly and with empathy.",

  // Actions / footer
  export: "Export",
  levels: "Levels",
  levelsComing: "Levels coming soon",
  threadExported: "Thread exported.",

  // Status bar
  statusMode: "Mode:",
  statusAgent: "Agent:",

  // Backward-compat alias (if some code still uses statusAI)
  statusAI: "Agent:",

  // Status texts
  "status.modeSet": "Mode set: {label}.",

  // Prompt texts
  "prompts.onboarding": "Hey! 👋 Who are you and how will you guide me here step by step?",
  "prompts.modeDefault": "Reset everything to default and give me a brief status.",
  "prompts.councilIntro": "Each AI please introduce yourself and say how you can help right now.",
  "prompts.modeGeneric": "Mode {label}: What are you and where will you help me best?",
  "prompts.expertAskTemplate": "{expert}, who are you and what can you do for me?",
  // Experts (used by Saeule.tsx)
  "experts.title": "Experts",
  "experts.choose": "Choose expert",
  "experts.askTemplate": "{expert}, who are you and what can you do for me?",
  "experts.askTemplateDefault": "{expert}, who are you and what can you do for me?",

  // CTA fallback
  "cta.fallback": "All set — tell me what you want to build (app, flow, feature …).",

  // ARIA / A11y
  conversationAria: "Chat log",
  assistantSays: "Assistant message",
  youSaid: "Your message",
  columnAria: "Column — Controls & Selection",
  mobileOverlayLabel: "Mobile column overlay",
} as const;

/** German dictionary */
const de: Dict = {
  // Input / messaging
  writeMessage: "Nachricht schreiben…",
  send: "Senden",

  // Eingabe-Hilfen
  tools: "Werkzeuge",
  newline: "Neue Zeile",
  comingUpload: "Upload",
  comingVoice: "Sprache",
  comingFunctions: "Optionen",

  // Overlay header / buttons (mobile)
  mobileNav: "Mobile Navigation",
  close: "Schließen",

  // Sidebar / Column
  columnTitle: "Säule",
  sectionControl: "Steuerung",
  onboarding: "ONBOARDING",
  mDefault: "M · Default",
  selectMode: "Modus wählen",
  council13: "COUNCIL13",
  selectAI: "KI wählen",
  modules: "Module",
  coming: "Coming",

  

  // Ergänzungen (Experten & CTA)
  selectExpert: "Experte wählen",
  statusExpert: "Experte:",
  clearChat: "Chat leeren",
  startBuilding: "Jetzt bauen",
  startBuildingMsg:
    "Was kannst du hier entwickeln und wie kann ich dir helfen? Ich antworte minimalistisch und empathisch.",

  // Actions / footer
  export: "Export",
  levels: "Levels",
  levelsComing: "Levels kommen bald",
  threadExported: "Thread exportiert.",

  // Status bar
  statusMode: "Modus:",
  statusAgent: "KI:",

  // Backward-compat alias
  statusAI: "KI:",
  // Status-Texte
  "status.modeSet": "Modus gesetzt: {label}.",

  // Prompt-Texte
  "prompts.onboarding": "Hey! 👋 Wer bist du und wie begleitest du mich hier Schritt für Schritt?",
  "prompts.modeDefault": "Setze alles auf Standard zurück und sag mir kurz den Status.",
  "prompts.councilIntro": "Alle KIs bitte kurz vorstellen und sagen, wobei ihr sofort helfen könnt.",
  "prompts.modeGeneric": "Modus {label}: Was bist du und wobei unterstützt du mich am besten?",
  "prompts.expertAskTemplate": "{expert}, wer bist du und was kannst du für mich tun?",
  // Experten (wird von Saeule.tsx genutzt)
  "experts.title": "Experten",
  "experts.choose": "Experten wählen",
  "experts.askTemplate": "{expert}, wer bist du und was kannst du für mich tun?",
  "experts.askTemplateDefault": "{expert}, wer bist du und was kannst du für mich tun?",

  // CTA Fallback
  "cta.fallback": "Alles klar – sag mir einfach, was du bauen möchtest (App, Flow, Feature …).",

  // ARIA / A11y
  conversationAria: "Chat-Verlauf",
  assistantSays: "Assistenten-Nachricht",
  youSaid: "Deine Nachricht",
  columnAria: "Säule – Steuerung & Auswahl",
  mobileOverlayLabel: "Mobiles Säulen-Overlay",
};

const DICTS = { en: en as Dict, de } as const;
export type Locale = keyof typeof DICTS;

const STORAGE_KEY = "mpathy:locale";

/** Mappt "de-AT" → "de", "pt-BR" → "pt" etc. */
function toBase(tag: string): string {
  return String(tag || "").toLowerCase().split("-")[0];
}

/** Aushandlung aus navigator.languages, navigator.language, <html lang> */
function negotiateLocaleFromBrowser(): string {
  try {
    // 1) navigator.languages (höchste Präferenz)
    if (typeof navigator !== "undefined" && Array.isArray((navigator as any).languages)) {
      for (const l of (navigator as any).languages) {
        const base = toBase(l);
        if (base in DICTS) return base;
      }
    }

    // 2) navigator.language
    if (typeof navigator !== "undefined" && navigator.language) {
      const base = toBase(navigator.language);
      if (base in DICTS) return base;
    }

    // 3) <html lang>
    if (typeof document !== "undefined" && document.documentElement?.lang) {
      const base = toBase(document.documentElement.lang);
      if (base in DICTS) return base;
    }
  } catch {
    /* noop */
  }
  return "en"; // Fallback
}

/** SSR-safe locale initialization */
function detectInitialLocale(): Locale {
  // 1) explizit gesetzte Locale (nur wenn zuvor über setLocale gesetzt)
  if (typeof window !== "undefined") {
    const explicit = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (explicit && explicit in DICTS) return explicit;
  }

  // 2) Browser-/Dokumentsprache aushandeln
  const negotiated = negotiateLocaleFromBrowser();
  if (negotiated in DICTS) return negotiated as Locale;

  // 3) Fallback
  return "en";
}

let currentLocale: Locale = detectInitialLocale();

/** Read current locale */
export function getLocale(): Locale {
  return currentLocale;
}

/** Set current locale (persists on client) — explizites Override */
export function setLocale(locale: Locale) {
  if (!(locale in DICTS)) return;
  currentLocale = locale;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, locale); // explizites Override
    window.dispatchEvent(new CustomEvent("mpathy:i18n:change", { detail: { locale } }));
    window.dispatchEvent(new CustomEvent("mpathy:i18n:explicit")); // signalisiere Override
  }
}

/**
 * Translate key. Falls back to English, then to the key itself.
 * Keep the type open so unknown keys don't break the build.
 */
export function t(key: string): string {
  const dict = DICTS[currentLocale] || en;
  if (key in dict) return dict[key];
  if (key in en) return (en as Dict)[key];
  return key;
}

/** Übersetzen mit Fallback-Text und einfachen Platzhaltern {name} */
export function tr(key: string, fallback: string, vars?: Record<string, string>): string {
  let out = t(key);
  if (out === key) out = fallback; // Fallback verwenden, wenn Key fehlt
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      out = out.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    }
  }
  return out;
}

/** Optional helper: list of available locales (automatisch aus DICTS) */
export const availableLocales: Locale[] = Object.keys(DICTS) as Locale[];

/** Reagiert auf Sprachwechsel im Browser/Dokument (ohne explizites Override) */
function attachLocaleWatchers() {
  if (typeof window === "undefined") return;

  // Wenn USER später setLocale() aufruft, setzen wir ein explizites Override.
  // Solange nicht explizit gesetzt, folgen wir Browser/DOM.
  let explicit = !!window.localStorage.getItem(STORAGE_KEY);

  // Beobachte Änderungen an <html lang="">
  try {
    const mo = new MutationObserver(() => {
      if (explicit) return;
      const next = negotiateLocaleFromBrowser() as Locale;
      if (next !== currentLocale) {
        currentLocale = next;
        window.dispatchEvent(new CustomEvent("mpathy:i18n:change", { detail: { locale: next } }));
      }
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  } catch { /* noop */ }

  // Reagiere auf Browser-Event languagechange (z. B. iOS/Android)
  window.addEventListener("languagechange", () => {
    if (explicit) return;
    const next = negotiateLocaleFromBrowser() as Locale;
    if (next !== currentLocale) {
      currentLocale = next;
      window.dispatchEvent(new CustomEvent("mpathy:i18n:change", { detail: { locale: next } }));
    }
  });

  // Wenn jemand später setLocale() nutzt, merken wir uns das als explizit.
  window.addEventListener("mpathy:i18n:explicit", () => {
    explicit = true;
  });
}

// --- Auto-Init (Client): folge Browser/DOM-Sprache, bis Nutzer explizit setLocale() ruft ---
if (typeof window !== "undefined") {
  // Falls <html lang> leer ist, mit Browser-Grundsprache befüllen (kosmetisch)
  try {
    if (!document.documentElement.lang) {
      document.documentElement.lang = toBase(negotiateLocaleFromBrowser());
    }
  } catch { /* noop */ }

  attachLocaleWatchers();
}
export const dict = {
  en: {
    hero_title: "Your Operating System for Creation",
    hero_sub: "From idea to impact in minutes.",
    hero_cta: "Begin your journey",
    s1_title: "start agency",
    s1_sub: "Launch campaigns that learn.",
    s2_title: "NEM — Biology × Chemistry",
    s2_sub: "Design new entities safely.",
    s2_why: "Why possible on m-pathy.ai? Orchestrated roles, constraint checks, symbolic proof.",
    s3_title: "GalaxyEducation — Blockchain",
    s3_sub: "Understand blockchain in 60s.",
    council_hint: "Tap a light to meet the council.",
    modes_hint: "Modes adapt to you — automatically.",
    trust_title: "Own your data.",
    trust_sub: "One-tap JSON export & delete.",
    cta_title: "Start with GalaxyBuilder",
    cta_sub: "Build the future with clarity.",
    cta_btn_primary: "Get started",
    cta_btn_secondary: "See pricing",
  },
  de: {
    hero_title: "Dein Betriebssystem für Schöpfung",
    hero_sub: "Von der Idee zur Wirkung in Minuten.",
    hero_cta: "Jetzt beginnen",
    s1_title: "start agency",
    s1_sub: "Starte Kampagnen, die lernen.",
    s2_title: "NEM — Biologie × Chemie",
    s2_sub: "Entwickle neue Einheiten sicher.",
    s2_why: "Warum auf m-pathy.ai? Orchestrierte Rollen, Constraint-Checks, symbolischer Proof.",
    s3_title: "GalaxyEducation — Blockchain",
    s3_sub: "Verstehe Blockchain in 60s.",
    council_hint: "Tippe ein Licht an, um den Rat zu treffen.",
    modes_hint: "Modi passen sich automatisch an.",
    trust_title: "Du besitzt deine Daten.",
    trust_sub: "JSON-Export & Löschen mit einem Tipp.",
    cta_title: "Starte mit GalaxyBuilder",
    cta_sub: "Baue die Zukunft mit Klarheit.",
    cta_btn_primary: "Loslegen",
    cta_btn_secondary: "Preise ansehen",
  },
  fr: {
    hero_title: "Le système d’exploitation de la création",
    hero_sub: "De l’idée à l’impact en quelques minutes.",
    hero_cta: "Commencer votre voyage",
    s1_title: "start agency",
    s1_sub: "Lancez des campagnes qui apprennent.",
    s2_title: "NEM — Biologie × Chimie",
    s2_sub: "Concevez de nouvelles entités en toute sécurité.",
    s2_why: "Pourquoi sur m-pathy.ai ? Rôles orchestrés, contrôles des contraintes, preuve symbolique.",
    s3_title: "GalaxyEducation — Blockchain",
    s3_sub: "Comprendre la blockchain en 60 s.",
    council_hint: "Touchez une lumière pour rencontrer le conseil.",
    modes_hint: "Les modes s’adaptent à vous — automatiquement.",
    trust_title: "Vos données vous appartiennent.",
    trust_sub: "Export JSON et suppression en un tap.",
    cta_title: "Commencez avec GalaxyBuilder",
    cta_sub: "Construisez l’avenir avec clarté.",
    cta_btn_primary: "Commencer",
    cta_btn_secondary: "Voir les tarifs",
  },
  es: {
    hero_title: "El sistema operativo para la creación",
    hero_sub: "De la idea al impacto en minutos.",
    hero_cta: "Comienza tu viaje",
    s1_title: "start agency",
    s1_sub: "Lanza campañas que aprenden.",
    s2_title: "NEM — Biología × Química",
    s2_sub: "Diseña nuevas entidades de forma segura.",
    s2_why: "¿Por qué en m-pathy.ai? Roles orquestados, controles de restricciones, prueba simbólica.",
    s3_title: "GalaxyEducation — Blockchain",
    s3_sub: "Entiende blockchain en 60 s.",
    council_hint: "Toca una luz para conocer al consejo.",
    modes_hint: "Los modos se adaptan a ti — automáticamente.",
    trust_title: "Tus datos te pertenecen.",
    trust_sub: "Exportación JSON y borrado con un toque.",
    cta_title: "Empieza con GalaxyBuilder",
    cta_sub: "Construye el futuro con claridad.",
    cta_btn_primary: "Empezar",
    cta_btn_secondary: "Ver precios",
  },
  it: {
    hero_title: "Il sistema operativo per la creazione",
    hero_sub: "Dall’idea all’impatto in pochi minuti.",
    hero_cta: "Inizia il tuo viaggio",
    s1_title: "start agency",
    s1_sub: "Lancia campagne che imparano.",
    s2_title: "NEM — Biologia × Chimica",
    s2_sub: "Progetta nuove entità in sicurezza.",
    s2_why: "Perché su m-pathy.ai? Ruoli orchestrati, controlli dei vincoli, prova simbolica.",
    s3_title: "GalaxyEducation — Blockchain",
    s3_sub: "Comprendi la blockchain in 60 s.",
    council_hint: "Tocca una luce per incontrare il consiglio.",
    modes_hint: "Le modalità si adattano a te — automaticamente.",
    trust_title: "I tuoi dati sono tuoi.",
    trust_sub: "Export JSON e cancellazione con un tocco.",
    cta_title: "Inizia con GalaxyBuilder",
    cta_sub: "Costruisci il futuro con chiarezza.",
    cta_btn_primary: "Inizia",
    cta_btn_secondary: "Vedi prezzi",
  },
  pt: {
    hero_title: "O sistema operacional da criação",
    hero_sub: "Da ideia ao impacto em minutos.",
    hero_cta: "Iniciar a jornada",
    s1_title: "start agency",
    s1_sub: "Lance campanhas que aprendem.",
    s2_title: "NEM — Biologia × Química",
    s2_sub: "Projete novas entidades com segurança.",
    s2_why: "Por que no m-pathy.ai? Papéis orquestrados, verificações de restrições, prova simbólica.",
    s3_title: "GalaxyEducation — Blockchain",
    s3_sub: "Entenda blockchain em 60 s.",
    council_hint: "Toque uma luz para conhecer o conselho.",
    modes_hint: "Os modos se adaptam a você — automaticamente.",
    trust_title: "Seus dados são seus.",
    trust_sub: "Exportação JSON e exclusão com um toque.",
    cta_title: "Comece com o GalaxyBuilder",
    cta_sub: "Construa o futuro com clareza.",
    cta_btn_primary: "Começar",
    cta_btn_secondary: "Ver preços",
  },
  nl: {
    hero_title: "Het besturingssysteem voor creatie",
    hero_sub: "Van idee naar impact in minuten.",
    hero_cta: "Begin je reis",
    s1_title: "start agency",
    s1_sub: "Lanceer campagnes die leren.",
    s2_title: "NEM — Biologie × Chemie",
    s2_sub: "Ontwerp nieuwe entiteiten veilig.",
    s2_why: "Waarom op m-pathy.ai? Georkestreerde rollen, constraint-checks, symbolisch bewijs.",
    s3_title: "GalaxyEducation — Blockchain",
    s3_sub: "Begrijp blockchain in 60 s.",
    council_hint: "Tik op een licht om de raad te ontmoeten.",
    modes_hint: "Modi passen zich automatisch aan.",
    trust_title: "Jij bezit je data.",
    trust_sub: "JSON-export en verwijderen met één tik.",
    cta_title: "Start met GalaxyBuilder",
    cta_sub: "Bouw de toekomst met helderheid.",
    cta_btn_primary: "Starten",
    cta_btn_secondary: "Prijzen bekijken",
  },
  ru: {
    hero_title: "Операционная система для созидания",
    hero_sub: "От идеи до результата за минуты.",
    hero_cta: "Начать путь",
    s1_title: "start agency",
    s1_sub: "Запускайте обучающиеся кампании.",
    s2_title: "NEM — Биология × Химия",
    s2_sub: "Проектируйте новые сущности безопасно.",
    s2_why: "Почему на m-pathy.ai? Оркестровка ролей, проверки ограничений, символическое доказательство.",
    s3_title: "GalaxyEducation — Блокчейн",
    s3_sub: "Понять блокчейн за 60 с.",
    council_hint: "Нажмите на огонёк, чтобы познакомиться с советом.",
    modes_hint: "Режимы подстраиваются под вас — автоматически.",
    trust_title: "Вы владеете своими данными.",
    trust_sub: "Экспорт JSON и удаление в один тап.",
    cta_title: "Начните с GalaxyBuilder",
    cta_sub: "Стройте будущее ясно.",
    cta_btn_primary: "Начать",
    cta_btn_secondary: "Посмотреть цены",
  },
  zh: {
    hero_title: "创造的操作系统",
    hero_sub: "从想法到影响只需数分钟。",
    hero_cta: "开始旅程",
    s1_title: "start agency",
    s1_sub: "启动会学习的营销活动。",
    s2_title: "NEM — 生物学 × 化学",
    s2_sub: "安全地设计新的实体。",
    s2_why: "为什么在 m-pathy.ai？角色编排、约束校验、符号性证明。",
    s3_title: "GalaxyEducation — 区块链",
    s3_sub: "60 秒理解区块链。",
    council_hint: "点亮一束光，认识议会。",
    modes_hint: "模式会自动适应你。",
    trust_title: "你的数据你做主。",
    trust_sub: "一键导出 JSON 与删除。",
    cta_title: "从 GalaxyBuilder 开始",
    cta_sub: "以清晰构建未来。",
    cta_btn_primary: "开始",
    cta_btn_secondary: "查看定价",
  },
  ja: {
    hero_title: "創造のためのオペレーティングシステム",
    hero_sub: "アイデアからインパクトまで数分で。",
    hero_cta: "旅を始める",
    s1_title: "start agency",
    s1_sub: "学習するキャンペーンを起動。",
    s2_title: "NEM — 生物学 × 化学",
    s2_sub: "安全に新しいエンティティを設計。",
    s2_why: "なぜ m-pathy.ai で？ 役割のオーケストレーション、制約チェック、象徴的な証明。",
    s3_title: "GalaxyEducation — ブロックチェーン",
    s3_sub: "60 秒でブロックチェーンを理解。",
    council_hint: "光をタップして評議会を知る。",
    modes_hint: "モードはあなたに自動で適応します。",
    trust_title: "あなたのデータはあなたのもの。",
    trust_sub: "ワンタップで JSON エクスポートと削除。",
    cta_title: "GalaxyBuilder で始める",
    cta_sub: "明晰さで未来を築く。",
    cta_btn_primary: "はじめる",
    cta_btn_secondary: "料金を見る",
  },
  ko: {
    hero_title: "창조를 위한 운영체제",
    hero_sub: "아이디어에서 임팩트까지 몇 분.",
    hero_cta: "여정을 시작하기",
    s1_title: "start agency",
    s1_sub: "학습하는 캠페인을 시작하세요.",
    s2_title: "NEM — 생물학 × 화학",
    s2_sub: "안전하게 새로운 엔티티를 설계하세요.",
    s2_why: "왜 m-pathy.ai인가? 역할 오케스트레이션, 제약 검사, 상징적 증명.",
    s3_title: "GalaxyEducation — 블록체인",
    s3_sub: "60초 만에 블록체인 이해.",
    council_hint: "빛을 탭하여 의회를 만나세요.",
    modes_hint: "모드는 자동으로 당신에 맞춰집니다.",
    trust_title: "데이터의 소유자는 당신입니다.",
    trust_sub: "원탭 JSON 내보내기·삭제.",
    cta_title: "GalaxyBuilder로 시작",
    cta_sub: "명료함으로 미래를 빚다.",
    cta_btn_primary: "시작하기",
    cta_btn_secondary: "가격 보기",
  },
  ar: {
    hero_title: "نظام التشغيل للإبداع",
    hero_sub: "من الفكرة إلى الأثر خلال دقائق.",
    hero_cta: "ابدأ رحلتك",
    s1_title: "start agency",
    s1_sub: "أطلق حملات تتعلّم.",
    s2_title: "NEM — الأحياء × الكيمياء",
    s2_sub: "صمّم كيانات جديدة بأمان.",
    s2_why: "لماذا على m-pathy.ai؟ تنسيق الأدوار، فحوص القيود، برهان رمزي.",
    s3_title: "GalaxyEducation — البلوكچين",
    s3_sub: "افهم البلوكچين خلال 60 ثانية.",
    council_hint: "اضغط على ضوء للتعرّف على المجلس.",
    modes_hint: "الأوضاع تتكيّف معك تلقائيًا.",
    trust_title: "بياناتك ملكك.",
    trust_sub: "تصدير JSON وحذف بنقرة واحدة.",
    cta_title: "ابدأ مع GalaxyBuilder",
    cta_sub: "ابنِ المستقبل بوضوح.",
    cta_btn_primary: "ابدأ",
    cta_btn_secondary: "شاهد الأسعار",
  },
  hi: {
    hero_title: "सृजन के लिए ऑपरेटिंग सिस्टम",
    hero_sub: "आइडिया से प्रभाव तक, मिनटों में।",
    hero_cta: "अपनी यात्रा शुरू करें",
    s1_title: "start agency",
    s1_sub: "सीखने वाली कैंपेन शुरू करें।",
    s2_title: "NEM — जीवविज्ञान × रसायन",
    s2_sub: "सुरक्षित रूप से नई इकाइयाँ डिज़ाइन करें।",
    s2_why: "m-pathy.ai पर क्यों? भूमिकाओं का ऑर्केस्ट्रेशन, बाधा-जाँच, प्रतीकात्मक प्रमाण।",
    s3_title: "GalaxyEducation — ब्लॉकचेन",
    s3_sub: "60 सेकंड में ब्लॉकचेन समझें।",
    council_hint: "एक रोशनी पर टैप करें और परिषद से मिलें।",
    modes_hint: "मोड अपने आप आप के अनुसार ढलते हैं।",
    trust_title: "आपका डेटा — आपका अधिकार।",
    trust_sub: "एक टैप में JSON एक्सपोर्ट और डिलीट।",
    cta_title: "GalaxyBuilder से शुरुआत करें",
    cta_sub: "स्पष्टता के साथ भविष्य बनाएं।",
    cta_btn_primary: "शुरू करें",
    cta_btn_secondary: "कीमतें देखें",
  },
} as const;

export type UIDict = typeof dict;
