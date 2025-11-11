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
    hero_title: "Dein Herz der Schöpfung",
    hero_sub: "Jede Idee trägt ihre Wirkung in sich.",
    hero_cta: "Jetzt starten",
    s1_title: "start agency",
    s1_sub: "Starte Kampagnen, die lernen.",
    s2_title: "NEM — Biologie × Chemie",
    s2_sub: "Entwickle neue Einheiten sicher.",
    s2_why: "Warum auf m-pathy.ai? Orchestrierte Rollen, Constraint-Checks, symbolischer Proof.",
    s3_title: "GalaxyEducation — Blockchain",
    s3_sub: "Verstehe Blockchain in 60s.",
    council_hint: "Wähle eine KI – sie zeigt dir ihre Kraft",
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
export type CouncilKey =
  | "m" | "m-pathy" | "m-ocean" | "m-inent"
  | "m-erge" | "m-power" | "m-body" | "m-beded"
  | "m-loop" | "m-pire" | "m-bassy" | "m-ballance";

type KPIs = { superpower: string; focus: string; signal: string; };
type CouncilItem = { title: string; subtitle: string; kpi: KPIs; };
type CouncilLocale = { council: { items: Record<CouncilKey, CouncilItem> } };

export const i18n: Record<string, CouncilLocale> = {
  // ---------- EN ----------
  en: {
    council: { items: {
      "m": {
        title: "M",
        subtitle: "featuring Palantir",
        kpi: {
          superpower: "Turns data into decisions.",
          focus: "Analytical clarity & decision confidence.",
          signal: "See earlier. Decide better."
        }
      },
      "m-pathy": {
        title: "m-pathy",
        subtitle: "featuring DeepMind Core",
        kpi: {
          superpower: "Machine learning with emotional IQ.",
          focus: "Learn from behavior and feedback.",
          signal: "To feel is to understand."
        }
      },
      "m-ocean": {
        title: "m-ocean",
        subtitle: "featuring Anthropic Vision",
        kpi: {
          superpower: "Keeps complex systems in balance.",
          focus: "Sustainable architecture & flow design.",
          signal: "Everything flows—well organized."
        }
      },
      "m-inent": {
        title: "m-inent",
        subtitle: "featuring NASA Chronos",
        kpi: {
          superpower: "Accurate scheduling & scenario planning.",
          focus: "Timing and risk control.",
          signal: "Timing creates momentum."
        }
      },
      "m-erge": {
        title: "m-erge",
        subtitle: "featuring IBM Origin",
        kpi: {
          superpower: "Merges tools, teams, and data.",
          focus: "Interoperability & integration.",
          signal: "Connection drives innovation."
        }
      },
      "m-power": {
        title: "m-power",
        subtitle: "featuring Colossus",
        kpi: {
          superpower: "Scale performance, cut waste.",
          focus: "Compute and energy efficiency.",
          signal: "Power serves balance."
        }
      },
      "m-body": {
        title: "m-body",
        subtitle: "featuring XAI Prime",
        kpi: {
          superpower: "Self-maintaining, adaptive systems.",
          focus: "Robustness in hardware & software.",
          signal: "Technology that breathes."
        }
      },
      "m-beded": {
        title: "m-beded",
        subtitle: "featuring Meta Lattice",
        kpi: {
          superpower: "Understands context across networks.",
          focus: "Make data meaningful.",
          signal: "Connection over mere storage."
        }
      },
      "m-loop": {
        title: "m-loop",
        subtitle: "featuring OpenAI Root",
        kpi: {
          superpower: "Learning through iteration.",
          focus: "Continuous improvement cycles.",
          signal: "It repeats until it sticks."
        }
      },
      "m-pire": {
        title: "m-pire",
        subtitle: "featuring Amazon Nexus",
        kpi: {
          superpower: "Scale resources globally.",
          focus: "Automated logistics & optimization.",
          signal: "Availability is leverage."
        }
      },
      "m-bassy": {
        title: "m-bassy",
        subtitle: "featuring Oracle Gaia",
        kpi: {
          superpower: "Bridges people, planet and tech.",
          focus: "Environmental & ethics integration.",
          signal: "When technology listens to nature."
        }
      },
      "m-ballance": {
        title: "m-ballance",
        subtitle: "featuring Gemini Apex",
        kpi: {
          superpower: "Calibrates innovation and stability.",
          focus: "Ethics with efficiency.",
          signal: "Harmony is system logic."
        }
      },
    } }
  },

  // ---------- DE ----------
  de: {
    council: { items: {
      "m": {
        title: "M",
        subtitle: "featuring Palantir",
        kpi: {
          superpower: "Macht aus Daten Entscheidungen.",
          focus: "Analytische Klarheit & Entscheidungssicherheit.",
          signal: "Früher sehen. Besser entscheiden."
        }
      },
      "m-pathy": {
        title: "m-pathy",
        subtitle: "featuring DeepMind Core",
        kpi: {
          superpower: "Maschinelles Lernen mit emotionaler Intelligenz.",
          focus: "Lernen aus Verhalten und Feedback.",
          signal: "Fühlen heißt verstehen."
        }
      },
      "m-ocean": {
        title: "m-ocean",
        subtitle: "featuring Anthropic Vision",
        kpi: {
          superpower: "Hält komplexe Systeme in Balance.",
          focus: "Nachhaltige Architektur & Flow-Design.",
          signal: "Alles fließt – geordnet."
        }
      },
      "m-inent": {
        title: "m-inent",
        subtitle: "featuring NASA Chronos",
        kpi: {
          superpower: "Präzise Terminierung & Szenarienplanung.",
          focus: "Timing und Risikokontrolle.",
          signal: "Timing erzeugt Momentum."
        }
      },
      "m-erge": {
        title: "m-erge",
        subtitle: "featuring IBM Origin",
        kpi: {
          superpower: "Vereint Tools, Teams und Daten.",
          focus: "Interoperabilität & Integration.",
          signal: "Vernetzung treibt Innovation."
        }
      },
      "m-power": {
        title: "m-power",
        subtitle: "featuring Colossus",
        kpi: {
          superpower: "Skaliert Leistung, reduziert Verluste.",
          focus: "Rechen- und Energieeffizienz.",
          signal: "Kraft dient der Balance."
        }
      },
      "m-body": {
        title: "m-body",
        subtitle: "featuring XAI Prime",
        kpi: {
          superpower: "Selbstwartende, adaptive Systeme.",
          focus: "Robustheit in Hard- und Software.",
          signal: "Technologie, die atmet."
        }
      },
      "m-beded": {
        title: "m-beded",
        subtitle: "featuring Meta Lattice",
        kpi: {
          superpower: "Erfasst Kontext über Netzwerke hinweg.",
          focus: "Daten in Bedeutung übersetzen.",
          signal: "Verbindung statt nur Ablage."
        }
      },
      "m-loop": {
        title: "m-loop",
        subtitle: "featuring OpenAI Root",
        kpi: {
          superpower: "Lernen durch Iteration.",
          focus: "Kontinuierliche Verbesserung.",
          signal: "Es wiederholt sich, bis es sitzt."
        }
      },
      "m-pire": {
        title: "m-pire",
        subtitle: "featuring Amazon Nexus",
        kpi: {
          superpower: "Skaliert Ressourcen weltweit.",
          focus: "Automatisierte Logistik & Optimierung.",
          signal: "Verfügbarkeit ist Hebel."
        }
      },
      "m-bassy": {
        title: "m-bassy",
        subtitle: "featuring Oracle Gaia",
        kpi: {
          superpower: "Verbindet Mensch, Umwelt und Technologie.",
          focus: "Umwelt- & Ethikintegration.",
          signal: "Wenn Technologie der Natur zuhört."
        }
      },
      "m-ballance": {
        title: "m-ballance",
        subtitle: "featuring Gemini Apex",
        kpi: {
          superpower: "Kalibriert Innovation und Stabilität.",
          focus: "Ethik mit Effizienz.",
          signal: "Harmonie ist Systemlogik."
        }
      },
    } }
  },

  // ---------- FR ----------
  fr: {
    council: { items: {
      "m": { title:"M", subtitle:"featuring Palantir",
        kpi:{ superpower:"Transformer les données en décisions.",
          focus:"Clarté analytique & confiance.",
          signal:"Voir plus tôt. Décider mieux." } },
      "m-pathy": { title:"m-pathy", subtitle:"featuring DeepMind Core",
        kpi:{ superpower:"Apprentissage avec intelligence émotionnelle.",
          focus:"Apprendre via comportement et feedback.",
          signal:"Ressentir, c’est comprendre." } },
      "m-ocean": { title:"m-ocean", subtitle:"featuring Anthropic Vision",
        kpi:{ superpower:"Garde l’équilibre des systèmes complexes.",
          focus:"Architecture durable & design de flux.",
          signal:"Tout s’écoule — bien organisé." } },
      "m-inent": { title:"m-inent", subtitle:"featuring NASA Chronos",
        kpi:{ superpower:"Planification et scénarios précis.",
          focus:"Timing & contrôle du risque.",
          signal:"Le timing crée l’élan." } },
      "m-erge": { title:"m-erge", subtitle:"featuring IBM Origin",
        kpi:{ superpower:"Fusionne outils, équipes et données.",
          focus:"Interopérabilité & intégration.",
          signal:"La connexion stimule l’innovation." } },
      "m-power": { title:"m-power", subtitle:"featuring Colossus",
        kpi:{ superpower:"Échelle de performance, moins de pertes.",
          focus:"Efficacité calcul & énergie.",
          signal:"La puissance sert l’équilibre." } },
      "m-body": { title:"m-body", subtitle:"featuring XAI Prime",
        kpi:{ superpower:"Systèmes adaptatifs auto-entrenus.",
          focus:"Robustesse matérielle & logicielle.",
          signal:"Une technologie qui respire." } },
      "m-beded": { title:"m-beded", subtitle:"featuring Meta Lattice",
        kpi:{ superpower:"Comprend le contexte dans les réseaux.",
          focus:"Donner du sens aux données.",
          signal:"Connexion plutôt que simple stockage." } },
      "m-loop": { title:"m-loop", subtitle:"featuring OpenAI Root",
        kpi:{ superpower:"Apprentissage par itération.",
          focus:"Amélioration continue.",
          signal:"Ça se répète jusqu’à ce que ça tienne." } },
      "m-pire": { title:"m-pire", subtitle:"featuring Amazon Nexus",
        kpi:{ superpower:"Échelle mondiale des ressources.",
          focus:"Logistique automatisée & optimisation.",
          signal:"La disponibilité est un levier." } },
      "m-bassy": { title:"m-bassy", subtitle:"featuring Oracle Gaia",
        kpi:{ superpower:"Relie humains, planète et tech.",
          focus:"Intégration environnement & éthique.",
          signal:"Quand la tech écoute la nature." } },
      "m-ballance": { title:"m-ballance", subtitle:"featuring Gemini Apex",
        kpi:{ superpower:"Calibre innovation et stabilité.",
          focus:"Éthique avec efficacité.",
          signal:"L’harmonie est logique de système." } },
    } }
  },

  // ---------- ES ----------
  es: {
    council: { items: {
      "m": { title:"M", subtitle:"featuring Palantir",
        kpi:{ superpower:"Convierte datos en decisiones.",
          focus:"Claridad analítica y confianza.",
          signal:"Ver antes. Decidir mejor." } },
      "m-pathy": { title:"m-pathy", subtitle:"featuring DeepMind Core",
        kpi:{ superpower:"ML con inteligencia emocional.",
          focus:"Aprender de conducta y feedback.",
          signal:"Sentir es comprender." } },
      "m-ocean": { title:"m-ocean", subtitle:"featuring Anthropic Vision",
        kpi:{ superpower:"Equilibra sistemas complejos.",
          focus:"Arquitectura sostenible y flujos.",
          signal:"Todo fluye, bien organizado." } },
      "m-inent": { title:"m-inent", subtitle:"featuring NASA Chronos",
        kpi:{ superpower:"Planificación precisa de escenarios.",
          focus:"Timing y control de riesgo.",
          signal:"El timing crea impulso." } },
      "m-erge": { title:"m-erge", subtitle:"featuring IBM Origin",
        kpi:{ superpower:"Integra herramientas, equipos y datos.",
          focus:"Interoperabilidad e integración.",
          signal:"La conexión impulsa la innovación." } },
      "m-power": { title:"m-power", subtitle:"featuring Colossus",
        kpi:{ superpower:"Escala rendimiento, reduce pérdidas.",
          focus:"Eficiencia de cómputo y energía.",
          signal:"El poder sirve al equilibrio." } },
      "m-body": { title:"m-body", subtitle:"featuring XAI Prime",
        kpi:{ superpower:"Sistemas adaptativos auto-mantenimiento.",
          focus:"Robustez física y digital.",
          signal:"Tecnología que respira." } },
      "m-beded": { title:"m-beded", subtitle:"featuring Meta Lattice",
        kpi:{ superpower:"Entiende contexto entre redes.",
          focus:"Dar significado a los datos.",
          signal:"Conexión sobre simple almacenamiento." } },
      "m-loop": { title:"m-loop", subtitle:"featuring OpenAI Root",
        kpi:{ superpower:"Aprendizaje por iteración.",
          focus:"Mejora continua.",
          signal:"Se repite hasta que queda." } },
      "m-pire": { title:"m-pire", subtitle:"featuring Amazon Nexus",
        kpi:{ superpower:"Escala recursos globalmente.",
          focus:"Logística automatizada y optimización.",
          signal:"La disponibilidad es poder." } },
      "m-bassy": { title:"m-bassy", subtitle:"featuring Oracle Gaia",
        kpi:{ superpower:"Vincula personas, planeta y tecnología.",
          focus:"Integración ambiental y ética.",
          signal:"Cuando la tecnología escucha a la naturaleza." } },
      "m-ballance": { title:"m-ballance", subtitle:"featuring Gemini Apex",
        kpi:{ superpower:"Equilibra innovación y estabilidad.",
          focus:"Ética con eficiencia.",
          signal:"La armonía es lógica de sistema." } },
    } }
  },

  // ---------- IT ----------
  it: {
    council: { items: {
      "m":{title:"M",subtitle:"featuring Palantir",
        kpi:{superpower:"Trasforma i dati in decisioni.",
          focus:"Chiarezza analitica & fiducia.",
          signal:"Vedi prima. Decidi meglio."}},
      "m-pathy":{title:"m-pathy",subtitle:"featuring DeepMind Core",
        kpi:{superpower:"ML con intelligenza emotiva.",
          focus:"Apprendimento da comportamento e feedback.",
          signal:"Sentire è capire."}},
      "m-ocean":{title:"m-ocean",subtitle:"featuring Anthropic Vision",
        kpi:{superpower:"Mantiene in equilibrio sistemi complessi.",
          focus:"Architettura sostenibile & flussi.",
          signal:"Tutto scorre — organizzato."}},
      "m-inent":{title:"m-inent",subtitle:"featuring NASA Chronos",
        kpi:{superpower:"Pianificazione e scenari precisi.",
          focus:"Timing e controllo del rischio.",
          signal:"Il timing crea slancio."}},
      "m-erge":{title:"m-erge",subtitle:"featuring IBM Origin",
        kpi:{superpower:"Unisce strumenti, team e dati.",
          focus:"Interoperabilità & integrazione.",
          signal:"La connessione guida l’innovazione."}},
      "m-power":{title:"m-power",subtitle:"featuring Colossus",
        kpi:{superpower:"Scala le prestazioni, riduce sprechi.",
          focus:"Efficienza di calcolo ed energia.",
          signal:"La potenza serve l’equilibrio."}},
      "m-body":{title:"m-body",subtitle:"featuring XAI Prime",
        kpi:{superpower:"Sistemi adattivi auto-manutenti.",
          focus:"Robustezza hardware & software.",
          signal:"Tecnologia che respira."}},
      "m-beded":{title:"m-beded",subtitle:"featuring Meta Lattice",
        kpi:{superpower:"Comprende il contesto nelle reti.",
          focus:"Dare significato ai dati.",
          signal:"Connessione, non solo archiviazione."}},
      "m-loop":{title:"m-loop",subtitle:"featuring OpenAI Root",
        kpi:{superpower:"Apprendimento iterativo.",
          focus:"Miglioramento continuo.",
          signal:"Si ripete finché resta."}},
      "m-pire":{title:"m-pire",subtitle:"featuring Amazon Nexus",
        kpi:{superpower:"Scala risorse globalmente.",
          focus:"Logistica automatizzata & ottimizzazione.",
          signal:"La disponibilità è leva."}},
      "m-bassy":{title:"m-bassy",subtitle:"featuring Oracle Gaia",
        kpi:{superpower:"Collega persone, pianeta e tecnologia.",
          focus:"Integrazione ambientale ed etica.",
          signal:"Quando la tecnologia ascolta la natura."}},
      "m-ballance":{title:"m-ballance",subtitle:"featuring Gemini Apex",
        kpi:{superpower:"Calibra innovazione e stabilità.",
          focus:"Etica con efficienza.",
          signal:"L’armonia è logica di sistema."}},
    } }
  },

  // ---------- PT ----------
  pt: {
    council: { items: {
      "m":{title:"M",subtitle:"featuring Palantir",
        kpi:{superpower:"Transforma dados em decisões.",
          focus:"Clareza analítica e confiança.",
          signal:"Ver antes. Decidir melhor."}},
      "m-pathy":{title:"m-pathy",subtitle:"featuring DeepMind Core",
        kpi:{superpower:"Aprendizado com inteligência emocional.",
          focus:"Aprender com comportamento e feedback.",
          signal:"Sentir é entender."}},
      "m-ocean":{title:"m-ocean",subtitle:"featuring Anthropic Vision",
        kpi:{superpower:"Equilibra sistemas complexos.",
          focus:"Arquitetura sustentável e fluxos.",
          signal:"Tudo flui — bem organizado."}},
      "m-inent":{title:"m-inent",subtitle:"cfeaturingom NASA Chronos",
        kpi:{superpower:"Planejamento e cenários precisos.",
          focus:"Timing e controle de risco.",
          signal:"O timing cria impulso."}},
      "m-erge":{title:"m-erge",subtitle:"featuring IBM Origin",
        kpi:{superpower:"Integra ferramentas, equipes e dados.",
          focus:"Interoperabilidade & integração.",
          signal:"Conexão move a inovação."}},
      "m-power":{title:"m-power",subtitle:"featuring Colossus",
        kpi:{superpower:"Escala desempenho, reduz desperdício.",
          focus:"Eficiência de computação e energia.",
          signal:"Poder a serviço do equilíbrio."}},
      "m-body":{title:"m-body",subtitle:"featuring XAI Prime",
        kpi:{superpower:"Sistemas adaptativos auto-manutenção.",
          focus:"Robustez física e digital.",
          signal:"Tecnologia que respira."}},
      "m-beded":{title:"m-beded",subtitle:"featuring Meta Lattice",
        kpi:{superpower:"Entende contexto entre redes.",
          focus:"Dar significado aos dados.",
          signal:"Conexão em vez de armazenamento."}},
      "m-loop":{title:"m-loop",subtitle:"featuring OpenAI Root",
        kpi:{superpower:"Aprendizado por iteração.",
          focus:"Melhoria contínua.",
          signal:"Repete até fixar."}},
      "m-pire":{title:"m-pire",subtitle:"featuring Amazon Nexus",
        kpi:{superpower:"Escala recursos globalmente.",
          focus:"Logística automatizada & otimização.",
          signal:"Disponibilidade é alavanca."}},
      "m-bassy":{title:"m-bassy",subtitle:"featuring Oracle Gaia",
        kpi:{superpower:"Une pessoas, planeta e tecnologia.",
          focus:"Integração ambiental e ética.",
          signal:"Quando a tecnologia ouve a natureza."}},
      "m-ballance":{title:"m-ballance",subtitle:"featuring Gemini Apex",
        kpi:{superpower:"Equilibra inovação e estabilidade.",
          focus:"Ética com eficiência.",
          signal:"Harmonia é lógica de sistema."}},
    } }
  },

  // ---------- NL ----------
  nl: {
    council: { items: {
      "m":{title:"M",subtitle:"featuring Palantir",
        kpi:{superpower:"Zet data om in besluiten.",
          focus:"Analytische helderheid & vertrouwen.",
          signal:"Vroeger zien. Beter beslissen."}},
      "m-pathy":{title:"m-pathy",subtitle:"featuring DeepMind Core",
        kpi:{superpower:"ML met emotionele intelligentie.",
          focus:"Leren via gedrag en feedback.",
          signal:"Voelen is begrijpen."}},
      "m-ocean":{title:"m-ocean",subtitle:"featuring Anthropic Vision",
        kpi:{superpower:"Houdt complexe systemen in balans.",
          focus:"Duurzame architectuur & flow.",
          signal:"Alles stroomt — geordend."}},
      "m-inent":{title:"m-inent",subtitle:"featuring NASA Chronos",
        kpi:{superpower:"Precieze planning & scenario’s.",
          focus:"Timing en risicobeheersing.",
          signal:"Timing creëert momentum."}},
      "m-erge":{title:"m-erge",subtitle:"featuring IBM Origin",
        kpi:{superpower:"Verbindt tools, teams en data.",
          focus:"Interoperabiliteit & integratie.",
          signal:"Connectie drijft innovatie."}},
      "m-power":{title:"m-power",subtitle:"featuring Colossus",
        kpi:{superpower:"Schaalt performance, minder verspilling.",
          focus:"Reken- en energie-efficiëntie.",
          signal:"Kracht dient balans."}},
      "m-body":{title:"m-body",subtitle:"featuring XAI Prime",
        kpi:{superpower:"Zelfonderhoudende, adaptieve systemen.",
          focus:"Robuust in hard- en software.",
          signal:"Technologie die ademt."}},
      "m-beded":{title:"m-beded",subtitle:"featuring Meta Lattice",
        kpi:{superpower:"Begrijpt context over netwerken.",
          focus:"Geef data betekenis.",
          signal:"Verbinding i.p.v. opslag."}},
      "m-loop":{title:"m-loop",subtitle:"featuring OpenAI Root",
        kpi:{superpower:"Leren door iteratie.",
          focus:"Continue verbetering.",
          signal:"Het herhaalt tot het blijft."}},
      "m-pire":{title:"m-pire",subtitle:"featuring Amazon Nexus",
        kpi:{superpower:"Schaalt resources wereldwijd.",
          focus:"Automatische logistiek & optimalisatie.",
          signal:"Beschikbaarheid is hefboom."}},
      "m-bassy":{title:"m-bassy",subtitle:"featuring Oracle Gaia",
        kpi:{superpower:"Verbindt mens, planeet en tech.",
          focus:"Milieu- en ethiekintegratie.",
          signal:"Als tech naar de natuur luistert."}},
      "m-ballance":{title:"m-ballance",subtitle:"featuring Gemini Apex",
        kpi:{superpower:"Kalibreert innovatie en stabiliteit.",
          focus:"Ethiek met efficiëntie.",
          signal:"Harmonie is systeemlogica."}},
    } }
  },

  // ---------- RU ----------
  ru: {
    council: { items: {
      "m":{title:"M",subtitle:"при участии Palantir",
        kpi:{superpower:"Превращает данные в решения.",
          focus:"Аналитическая ясность и уверенность.",
          signal:"Видеть раньше. Решать лучше."}},
      "m-pathy":{title:"m-pathy",subtitle:"при участии DeepMind Core",
        kpi:{superpower:"ML с эмоциональным интеллектом.",
          focus:"Обучение на поведении и отклике.",
          signal:"Чувствовать — значит понимать."}},
      "m-ocean":{title:"м-ocean",subtitle:"при участии Anthropic Vision",
        kpi:{superpower:"Держит сложные системы в балансе.",
          focus:"Устойчивая архитектура и потоки.",
          signal:"Всё течёт — упорядоченно."}},
      "m-inent":{title:"m-inent",subtitle:"при участии NASA Chronos",
        kpi:{superpower:"Точная планировка сценариев.",
          focus:"Тайминг и контроль рисков.",
          signal:"Тайминг создаёт импульс."}},
      "m-erge":{title:"m-erge",subtitle:"при участии IBM Origin",
        kpi:{superpower:"Объединяет инструменты, команды и данные.",
          focus:"Интероперабельность и интеграция.",
          signal:"Связность двигает инновации."}},
      "m-power":{title:"m-power",subtitle:"при участии Colossus",
        kpi:{superpower:"Масштабирует производительность, снижает потери.",
          focus:"Эффективность вычислений и энергии.",
          signal:"Сила служит балансу."}},
      "m-body":{title:"m-body",subtitle:"при участии XAI Prime",
        kpi:{superpower:"Самообслуживание и адаптация систем.",
          focus:"Надёжность «железа» и ПО.",
          signal:"Технология, которая дышит."}},
      "m-beded":{title:"m-beded",subtitle:"при участии Meta Lattice",
        kpi:{superpower:"Понимает контекст в сетях.",
          focus:"Придаёт данным смысл.",
          signal:"Связь вместо простого хранения."}},
      "m-loop":{title:"m-loop",subtitle:"при участии OpenAI Root",
        kpi:{superpower:"Обучение через итерации.",
          focus:"Непрерывное улучшение.",
          signal:"Повторяется, пока не закрепится."}},
      "m-pire":{title:"m-pire",subtitle:"при участии Amazon Nexus",
        kpi:{superpower:"Масштабирует ресурсы по миру.",
          focus:"Автологистика и оптимизация.",
          signal:"Доступность — рычаг."}},
      "m-bassy":{title:"m-bassy",subtitle:"при участии Oracle Gaia",
        kpi:{superpower:"Связывает людей, природу и технологии.",
          focus:"Экология и этика в дизайне систем.",
          signal:"Когда технология слушает природу."}},
      "m-ballance":{title:"m-ballance",subtitle:"при участии Gemini Apex",
        kpi:{superpower:"Калибрует инновации и стабильность.",
          focus:"Этика + эффективность.",
          signal:"Гармония — логика системы."}},
    } }
  },

  // ---------- ZH (简体) ----------
  zh: {
    council: { items: {
      "m":{title:"M",subtitle:"与 Palantir 合作",
        kpi:{superpower:"把数据变成决策。",
          focus:"分析清晰与决策信心。",
          signal:"更早看见，更好决策。"}},
      "m-pathy":{title:"m-pathy",subtitle:"与 DeepMind Core 合作",
        kpi:{superpower:"具情感智能的机器学习。",
          focus:"从行为与反馈中学习。",
          signal:"感受即理解。"}},
      "m-ocean":{title:"m-ocean",subtitle:"与 Anthropic Vision 合作",
        kpi:{superpower:"保持复杂系统的平衡。",
          focus:"可持续架构与流程设计。",
          signal:"万物流动——有序。"}},
      "m-inent":{title:"m-inent",subtitle:"与 NASA Chronos 合作",
        kpi:{superpower:"精确计划与情景推演。",
          focus:"时机与风险控制。",
          signal:"时机创造势能。"}},
      "m-erge":{title:"m-erge",subtitle:"与 IBM Origin 合作",
        kpi:{superpower:"整合工具、团队和数据。",
          focus:"互操作与集成。",
          signal:"连接推动创新。"}},
      "m-power":{title:"m-power",subtitle:"与 Colossus 合作",
        kpi:{superpower:"放大性能，减少浪费。",
          focus:"算力与能源效率。",
          signal:"力量服务于平衡。"}},
      "m-body":{title:"m-body",subtitle:"与 XAI Prime 合作",
        kpi:{superpower:"自维护、可适应的系统。",
          focus:"软硬件的稳健性。",
          signal:"会“呼吸”的技术。"}},
      "m-beded":{title:"m-beded",subtitle:"与 Meta Lattice 合作",
        kpi:{superpower:"理解跨网络的上下文。",
          focus:"让数据有意义。",
          signal:"连接胜于存储。"}},
      "m-loop":{title:"m-loop",subtitle:"与 OpenAI Root 合作",
        kpi:{superpower:"通过迭代学习。",
          focus:"持续改进。",
          signal:"重复直到记住。"}},
      "m-pire":{title:"m-pire",subtitle:"与 Amazon Nexus 合作",
        kpi:{superpower:"全球化调度资源。",
          focus:"自动物流与优化。",
          signal:"可用性就是杠杆。"}},
      "m-bassy":{title:"m-bassy",subtitle:"与 Oracle Gaia 合作",
        kpi:{superpower:"连接人类、自然与技术。",
          focus:"环保与伦理融入设计。",
          signal:"当科技倾听自然。"}},
      "m-ballance":{title:"m-ballance",subtitle:"与 Gemini Apex 合作",
        kpi:{superpower:"校准创新与稳定。",
          focus:"伦理与效率并重。",
          signal:"和谐是系统逻辑。"}},
    } }
  },

  // ---------- JA ----------
  ja: {
    council: { items: {
      "m":{title:"M",subtitle:"Palantir と",
        kpi:{superpower:"データを意思決定へ変える。",
          focus:"分析の明確さと確信。",
          signal:"早く見て、より良く決める。"}},
      "m-pathy":{title:"m-pathy",subtitle:"DeepMind Core と",
        kpi:{superpower:"感情知能を備えた学習。",
          focus:"行動とフィードバックから学ぶ。",
          signal:"感じることが理解。"}},
      "m-ocean":{title:"m-ocean",subtitle:"Anthropic Vision と",
        kpi:{superpower:"複雑系のバランス維持。",
          focus:"持続可能な設計とフロー。",
          signal:"すべては秩序立って流れる。"}},
      "m-inent":{title:"m-inent",subtitle:"NASA Chronos と",
        kpi:{superpower:"精密な計画とシナリオ。",
          focus:"タイミングとリスク管理。",
          signal:"タイミングが推進力。"}},
      "m-erge":{title:"m-erge",subtitle:"IBM Origin と",
        kpi:{superpower:"ツール・チーム・データを統合。",
          focus:"相互運用と統合。",
          signal:"接続が革新を生む。"}},
      "m-power":{title:"m-power",subtitle:"Colossus と",
        kpi:{superpower:"性能を拡大し、無駄を削減。",
          focus:"計算とエネルギー効率。",
          signal:"力はバランスに従う。"}},
      "m-body":{title:"m-body",subtitle:"XAI Prime と",
        kpi:{superpower:"自己保守・適応するシステム。",
          focus:"ハード/ソフトの堅牢性。",
          signal:"呼吸するテクノロジー。"}},
      "m-beded":{title:"m-beded",subtitle:"Meta Lattice と",
        kpi:{superpower:"ネットワーク横断で文脈を理解。",
          focus:"データに意味を与える。",
          signal:"保存より接続。"}},
      "m-loop":{title:"m-loop",subtitle:"OpenAI Root と",
        kpi:{superpower:"反復による学習。",
          focus:"継続的改善。",
          signal:"定着するまで繰り返す。"}},
      "m-pire":{title:"m-pire",subtitle:"Amazon Nexus と",
        kpi:{superpower:"資源を世界規模でスケール。",
          focus:"自動物流と最適化。",
          signal:"可用性はレバレッジ。"}},
      "m-bassy":{title:"m-bassy",subtitle:"Oracle Gaia と",
        kpi:{superpower:"人・地球・技術をつなぐ。",
          focus:"環境と倫理の統合。",
          signal:"自然の声に耳を澄ます技術。"}},
      "m-ballance":{title:"m-ballance",subtitle:"Gemini Apex と",
        kpi:{superpower:"革新と安定を調整。",
          focus:"倫理と効率の両立。",
          signal:"調和はシステムの論理。"}},
    } }
  },

  // ---------- KO ----------
  ko: {
    council: { items: {
      "m":{title:"M",subtitle:"Palantir 함께",
        kpi:{superpower:"데이터를 결정으로 바꾼다.",
          focus:"분석적 선명함과 확신.",
          signal:"더 일찍 보고, 더 잘 결정."}},
      "m-pathy":{title:"m-pathy",subtitle:"DeepMind Core 함께",
        kpi:{superpower:"감성 지능을 갖춘 학습.",
          focus:"행동·피드백 기반 학습.",
          signal:"느끼는 것이 이해다."}},
      "m-ocean":{title:"m-ocean",subtitle:"Anthropic Vision 함께",
        kpi:{superpower:"복잡한 시스템의 균형 유지.",
          focus:"지속 가능한 구조와 흐름.",
          signal:"모든 흐름은 질서 있게."}},
      "m-inent":{title:"m-inent",subtitle:"NASA Chronos 함께",
        kpi:{superpower:"정밀한 일정·시나리오 계획.",
          focus:"타이밍과 리스크 제어.",
          signal:"타이밍이 모멘텀."}},
      "m-erge":{title:"m-erge",subtitle:"IBM Origin 함께",
        kpi:{superpower:"도구·팀·데이터 통합.",
          focus:"상호운용·통합.",
          signal:"연결이 혁신을 만든다."}},
      "m-power":{title:"m-power",subtitle:"Colossus 함께",
        kpi:{superpower:"성능 확장, 낭비 절감.",
          focus:"연산·에너지 효율.",
          signal:"힘은 균형을 섬긴다."}},
      "m-body":{title:"m-body",subtitle:"XAI Prime 함께",
        kpi:{superpower:"자가 유지·적응 시스템.",
          focus:"하드·소프트 견고성.",
          signal:"숨 쉬는 기술."}},
      "m-beded":{title:"m-beded",subtitle:"Meta Lattice 함께",
        kpi:{superpower:"네트워크 전반의 문맥 이해.",
          focus:"데이터에 의미 부여.",
          signal:"저장보다 연결."}},
      "m-loop":{title:"m-loop",subtitle:"OpenAI Root 함께",
        kpi:{superpower:"반복을 통한 학습.",
          focus:"지속적 개선.",
          signal:"익을 때까지 반복."}},
      "m-pire":{title:"m-pire",subtitle:"Amazon Nexus 함께",
        kpi:{superpower:"자원 글로벌 스케일.",
          focus:"자동 물류·최적화.",
          signal:"가용성이 지렛대."}},
      "m-bassy":{title:"m-bassy",subtitle:"Oracle Gaia 함께",
        kpi:{superpower:"사람·자연·기술 연결.",
          focus:"환경·윤리 통합.",
          signal:"자연에 귀 기울이는 기술."}},
      "m-ballance":{title:"m-ballance",subtitle:"Gemini Apex 함께",
        kpi:{superpower:"혁신과 안정의 보정.",
          focus:"윤리와 효율.",
          signal:"조화는 시스템 논리."}},
    } }
  },

  // ---------- AR ----------
  ar: {
    council: { items: {
      "m":{title:"M",subtitle:"بالشراكة مع Palantir",
        kpi:{superpower:"يحّول البيانات إلى قرارات.",
          focus:"وضوح تحليلي وثقة.",
          signal:"رؤية أبكر، قرار أفضل."}},
      "m-pathy":{title:"m-pathy",subtitle:"مع DeepMind Core",
        kpi:{superpower:"تعلم بذكاء عاطفي.",
          focus:"التعلم من السلوك والتغذية الراجعة.",
          signal:"أن تشعر يعني أن تفهم."}},
      "m-ocean":{title:"m-ocean",subtitle:"مع Anthropic Vision",
        kpi:{superpower:"يحافظ على توازن الأنظمة المعقدة.",
          focus:"معمارية مستدامة وتدفقات منظمة.",
          signal:"كل شيء يجري — لكن بانضباط."}},
      "m-inent":{title:"m-inent",subtitle:"مع NASA Chronos",
        kpi:{superpower:"جدولة دقيقة وتخطيط سيناريو.",
          focus:"التوقيت والتحكم بالمخاطر.",
          signal:"التوقيت يصنع الزخم."}},
      "m-erge":{title:"m-erge",subtitle:"مع IBM Origin",
        kpi:{superpower:"يوحّد الأدوات والفرق والبيانات.",
          focus:"قابلية التشغيل البيني والتكامل.",
          signal:"الاتصال يولّد الابتكار."}},
      "m-power":{title:"m-power",subtitle:"مع Colossus",
        kpi:{superpower:"يزيد الأداء ويقلل الهدر.",
          focus:"كفاءة الحوسبة والطاقة.",
          signal:"القوة في خدمة التوازن."}},
      "m-body":{title:"m-body",subtitle:"مع XAI Prime",
        kpi:{superpower:"أنظمة متكيفة ذاتية الصيانة.",
          focus:"متانة عتاد وبرمجيات.",
          signal:"تقنية تتنفس."}},
      "m-beded":{title:"m-beded",subtitle:"مع Meta Lattice",
        kpi:{superpower:"تفهم السياق عبر الشبكات.",
          focus:"إعطاء معنى للبيانات.",
          signal:"الاتصال بدل التخزين فقط."}},
      "m-loop":{title:"m-loop",subtitle:"مع OpenAI Root",
        kpi:{superpower:"تعلم عبر التكرار.",
          focus:"تحسين مستمر.",
          signal:"يتكرر حتى يترسخ."}},
      "m-pire":{title:"m-pire",subtitle:"مع Amazon Nexus",
        kpi:{superpower:"توسيع الموارد عالمياً.",
          focus:"لوجستيات مؤتمتة وتحسين.",
          signal:"الإتاحة هي الرافعة."}},
      "m-bassy":{title:"m-bassy",subtitle:"مع Oracle Gaia",
        kpi:{superpower:"يربط البشر والطبيعة والتقنية.",
          focus:"دمج البيئة والأخلاق.",
          signal:"عندما تصغي التقنية للطبيعة."}},
      "m-ballance":{title:"m-ballance",subtitle:"مع Gemini Apex",
        kpi:{superpower:"يضبط التوازن بين الابتكار والاستقرار.",
          focus:"أخلاق مع كفاءة.",
          signal:"الانسجام منطق النظام."}},
    } }
  },

  // ---------- HI ----------
  hi: {
    council: { items: {
      "m":{title:"M",subtitle:"Palantir के साथ",
        kpi:{superpower:"डेटा को निर्णय में बदलता है।",
          focus:"विश्लेषणात्मक स्पष्टता और भरोसा।",
          signal:"पहले देखें, बेहतर तय करें।"}},
      "m-pathy":{title:"m-pathy",subtitle:"DeepMind Core के साथ",
        kpi:{superpower:"भावनात्मक बुद्धिमत्ता वाला ML।",
          focus:"व्यवहार व फीडबैक से सीखना।",
          signal:"महसूस करना ही समझना है।"}},
      "m-ocean":{title:"m-ocean",subtitle:"Anthropic Vision के साथ",
        kpi:{superpower:"जटिल प्रणालियों का संतुलन बनाए रखता है।",
          focus:"सस्टेनेबल आर्किटेक्चर और फ्लो।",
          signal:"सब बहता है — व्यवस्थित।"}},
      "m-inent":{title:"m-inent",subtitle:"NASA Chronos के साथ",
        kpi:{superpower:"सटीक शेड्यूल और परिदृश्य योजना।",
          focus:"टाइमिंग और जोखिम नियंत्रण।",
          signal:"टाइमिंग से मोमेंटम बनता है।"}},
      "m-erge":{title:"m-erge",subtitle:"IBM Origin के साथ",
        kpi:{superpower:"टूल, टीम और डेटा को जोड़ता है।",
          focus:"इंटरऑपरेबिलिटी और इंटीग्रेशन।",
          signal:"कनेक्शन ही इनोवेशन है।"}},
      "m-power":{title:"m-power",subtitle:"Colossus के साथ",
        kpi:{superpower:"परफॉर्मेंस बढ़ाए, बर्बादी घटाए।",
          focus:"कंप्यूट व ऊर्जा दक्षता।",
          signal:"शक्ति संतुलन की सेवा में।"}},
      "m-body":{title:"m-body",subtitle:"XAI Prime के साथ",
        kpi:{superpower:"स्व-रखरखाव, अनुकूली सिस्टम।",
          focus:"हार्डवेयर/सॉफ़्टवेयर की मजबूती।",
          signal:"साँस लेती तकनीक।"}},
      "m-beded":{title:"m-beded",subtitle:"Meta Lattice के साथ",
        kpi:{superpower:"नेटवर्क में संदर्भ समझता है।",
          focus:"डेटा को मायने देना।",
          signal:"सिर्फ़ स्टोरेज नहीं, कनेक्शन।"}},
      "m-loop":{title:"m-loop",subtitle:"OpenAI Root के साथ",
        kpi:{superpower:"इटरेशन से सीखना।",
          focus:"लगातार सुधार।",
          signal:"दोहरता है, जब तक बैठ न जाए।"}},
      "m-pire":{title:"m-pire",subtitle:"Amazon Nexus के साथ",
        kpi:{superpower:"संसाधनों का वैश्विक स्केल।",
          focus:"स्वचालित लॉजिस्टिक्स व ऑप्टिमाइज़ेशन।",
          signal:"उपलब्धता ही लीवरेज है।"}},
      "m-bassy":{title:"m-bassy",subtitle:"Oracle Gaia के साथ",
        kpi:{superpower:"मनुष्य, प्रकृति और टेक को जोड़ता है।",
          focus:"पर्यावरण व नैतिकता का एकीकरण।",
          signal:"जब तकनीक प्रकृति को सुनती है।"}},
      "m-ballance":{title:"m-ballance",subtitle:"Gemini Apex के साथ",
        kpi:{superpower:"इनोवेशन व स्थिरता का संतुलन।",
          focus:"एथिक्स + एफिशिएंसी।",
          signal:"हार्मनी ही सिस्टम लॉजिक है।"}},
    } }
  },
};
