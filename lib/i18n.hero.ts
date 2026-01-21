// lib/i18n.hero.ts
// Hero-Copy für Subscription/Landing – EN als Master.
// Neuer Anker: ruhig, klar, nicht performativ.

type DictRoot = Record<string, any>;

export const heroDict = {
  en: {
    hero_title: "Built for the EU AI Act - by architecture.",
    hero_sub:
      "A professional AI workspace for regulated environments. Designed for compliant reasoning, analysis, and decision-making without data extraction, hidden training, or surveillance.",

    hero_proof_1: "Data minimization by architecture, not policy",
    hero_proof_2: "No training on your data - ever",
    hero_proof_3: "Non-retentive, session-bound reasoning",
    hero_proof_4: "Human-controlled interaction, no manipulation loops",
    hero_proof_5: "Outputs designed for auditability and accountability",
    hero_price_monthly: "€179 / month",
    hero_cta: "Start professional access",
    hero_entry_note_prefix: "Start by using the chat. You can explore the system freely. After ",
    hero_entry_note_highlight: "9 responses",
    hero_entry_note_suffix: ", you’ll be asked to choose a subscription to continue.",

  },

 de: {
  hero_title: "Für den EU AI Act gebaut – architektonisch.",
  hero_sub:
    "Professioneller KI-Arbeitsraum für regulierte Umgebungen. Für konformes Denken, Analyse und Entscheidungen – ohne Datenextraktion, verstecktes Training oder Überwachung.",

  hero_proof_1: "Datenminimierung durch Architektur, nicht durch Richtlinien",
  hero_proof_2: "Kein Training mit deinen Daten – jemals",
  hero_proof_3: "Nicht-persistente, sitzungsgebundene Verarbeitung",
  hero_proof_4: "Menschlich kontrollierte Interaktion, keine Manipulationsmechanismen",
  hero_proof_5: "Ausgaben für Nachvollziehbarkeit und Rechenschaft ausgelegt",

  hero_price_monthly: "179 € / Monat",
  hero_cta: "Professionellen Zugang starten",
  hero_entry_note_prefix:
    "Beginne mit dem Chat. Du kannst das System frei erkunden. Nach ",
  hero_entry_note_highlight: "9 Antworten",
  hero_entry_note_suffix:
    " wirst du aufgefordert, ein Abonnement auszuwählen, um fortzufahren.",
},

fr: {
  hero_title: "Conçu pour l’AI Act européen — par architecture.",
  hero_sub:
    "Espace de travail IA professionnel pour environnements réglementés. Conçu pour l’analyse et la décision conformes, sans extraction de données ni entraînement caché.",

  hero_proof_1: "Minimisation des données par architecture, non par politique",
  hero_proof_2: "Aucun entraînement sur vos données — jamais",
  hero_proof_3: "Raisonnement non persistant, limité à la session",
  hero_proof_4: "Interaction contrôlée par l’humain, sans mécanismes de manipulation",
  hero_proof_5: "Résultats conçus pour l’auditabilité et la responsabilité",

  hero_price_monthly: "179 € / mois",
  hero_cta: "Démarrer l’accès professionnel",
  hero_entry_note_prefix:
    "Commencez par utiliser le chat. Vous pouvez explorer librement le système. Après ",
  hero_entry_note_highlight: "9 réponses",
  hero_entry_note_suffix:
    ", un abonnement sera requis pour continuer.",
},

es: {
  hero_title: "Creado para la Ley Europea de IA — por arquitectura.",
  hero_sub:
    "Espacio de trabajo de IA profesional para entornos regulados. Diseñado para análisis y decisiones conformes, sin extracción de datos ni entrenamiento oculto.",

  hero_proof_1: "Minimización de datos por arquitectura, no por política",
  hero_proof_2: "Sin entrenamiento con tus datos — nunca",
  hero_proof_3: "Razonamiento no persistente, limitado a la sesión",
  hero_proof_4: "Interacción controlada por humanos, sin bucles de manipulación",
  hero_proof_5: "Resultados diseñados para auditoría y responsabilidad",

  hero_price_monthly: "179 € / mes",
  hero_cta: "Iniciar acceso profesional",
  hero_entry_note_prefix:
    "Empieza usando el chat. Puedes explorar el sistema libremente. Después de ",
  hero_entry_note_highlight: "9 respuestas",
  hero_entry_note_suffix:
    ", se te pedirá elegir una suscripción para continuar.",
},

it: {
  hero_title: "Progettato per l’AI Act UE — per architettura.",
  hero_sub:
    "Spazio di lavoro IA professionale per ambienti regolamentati. Pensato per analisi e decisioni conformi, senza estrazione dei dati o addestramento nascosto.",

  hero_proof_1: "Minimizzazione dei dati per architettura, non per policy",
  hero_proof_2: "Nessun addestramento sui tuoi dati — mai",
  hero_proof_3: "Ragionamento non persistente, limitato alla sessione",
  hero_proof_4: "Interazione controllata dall’uomo, senza meccanismi manipolativi",
  hero_proof_5: "Output progettati per auditabilità e responsabilità",

  hero_price_monthly: "179 € / mese",
  hero_cta: "Avvia accesso professionale",
  hero_entry_note_prefix:
    "Inizia usando la chat. Puoi esplorare liberamente il sistema. Dopo ",
  hero_entry_note_highlight: "9 risposte",
  hero_entry_note_suffix:
    ", sarà richiesto un abbonamento per continuare.",
},

pt: {
  hero_title: "Construído para o AI Act da UE — por arquitetura.",
  hero_sub:
    "Espaço de trabalho de IA profissional para ambientes regulados. Criado para análise e decisões conformes, sem extração de dados ou treino oculto.",

  hero_proof_1: "Minimização de dados por arquitetura, não por política",
  hero_proof_2: "Nenhum treino com os seus dados — nunca",
  hero_proof_3: "Raciocínio não persistente, limitado à sessão",
  hero_proof_4: "Interação controlada por humanos, sem ciclos de manipulação",
  hero_proof_5: "Resultados concebidos para auditoria e responsabilização",

  hero_price_monthly: "179 € / mês",
  hero_cta: "Iniciar acesso profissional",
  hero_entry_note_prefix:
    "Comece usando o chat. Pode explorar o sistema livremente. Após ",
  hero_entry_note_highlight: "9 respostas",
  hero_entry_note_suffix:
    ", será solicitado escolher uma subscrição para continuar.",
},

nl: {
  hero_title: "Gebouwd voor de EU AI Act — door architectuur.",
  hero_sub:
    "Professionele AI-werkruimte voor gereguleerde omgevingen. Ontworpen voor conforme analyse en besluitvorming, zonder data-extractie of verborgen training.",

  hero_proof_1: "Dataminimalisatie door architectuur, niet door beleid",
  hero_proof_2: "Geen training op jouw data — ooit",
  hero_proof_3: "Niet-persistente, sessiegebonden verwerking",
  hero_proof_4: "Menselijk gecontroleerde interactie, zonder manipulatieve lussen",
  hero_proof_5: "Uitvoer ontworpen voor auditbaarheid en verantwoording",

  hero_price_monthly: "€179 / maand",
  hero_cta: "Professionele toegang starten",
  hero_entry_note_prefix:
    "Begin met de chat. Je kunt het systeem vrij verkennen. Na ",
  hero_entry_note_highlight: "9 antwoorden",
  hero_entry_note_suffix:
    " wordt gevraagd een abonnement te kiezen om door te gaan.",
},

ru: {
  hero_title: "Создано для EU AI Act — на уровне архитектуры.",
  hero_sub:
    "Профессиональная ИИ-среда для регулируемых сфер. Предназначена для корректного анализа и решений без извлечения данных или скрытого обучения.",

  hero_proof_1: "Минимизация данных на уровне архитектуры, а не политики",
  hero_proof_2: "Никакого обучения на ваших данных — никогда",
  hero_proof_3: "Непостоянная обработка, ограниченная сессией",
  hero_proof_4: "Взаимодействие под контролем человека, без манипуляций",
  hero_proof_5: "Результаты, пригодные для аудита и подотчётности",

  hero_price_monthly: "179 € / месяц",
  hero_cta: "Начать профессиональный доступ",
  hero_entry_note_prefix:
    "Начните с чата. Вы можете свободно изучать систему. После ",
  hero_entry_note_highlight: "9 ответов",
  hero_entry_note_suffix:
    " потребуется выбрать подписку для продолжения.",
},

zh: {
  hero_title: "为欧盟 AI 法规而建 —— 架构层面。",
  hero_sub:
    "面向受监管环境的专业 AI 工作空间。用于合规分析与决策，不进行数据提取或隐性训练。",

  hero_proof_1: "通过架构实现的数据最小化，而非政策",
  hero_proof_2: "绝不使用你的数据进行训练",
  hero_proof_3: "非持久、会话级推理",
  hero_proof_4: "人类可控的交互，无操纵机制",
  hero_proof_5: "输出为审计与问责而设计",

  hero_price_monthly: "€179 / 月",
  hero_cta: "开始专业访问",
  hero_entry_note_prefix:
    "从聊天开始。你可以自由探索系统。在 ",
  hero_entry_note_highlight: "9 次回复",
  hero_entry_note_suffix:
    " 后，将提示你选择订阅以继续。",
},

ja: {
  hero_title: "EU AI 法に対応 ― アーキテクチャ設計。",
  hero_sub:
    "規制環境向けのプロフェッショナルAIワークスペース。データ抽出や隠れた学習を行わず、適正な分析と判断を支援します。",

  hero_proof_1: "方針ではなく、アーキテクチャによるデータ最小化",
  hero_proof_2: "あなたのデータで学習しません — 決して",
  hero_proof_3: "非永続・セッション単位の推論",
  hero_proof_4: "人が制御する対話、操作的ループなし",
  hero_proof_5: "監査と説明責任を前提とした出力",

  hero_price_monthly: "€179 / 月",
  hero_cta: "プロフェッショナル利用を開始",
  hero_entry_note_prefix:
    "まずはチャットから始めてください。自由に試すことができます。 ",
  hero_entry_note_highlight: "9 回の応答",
  hero_entry_note_suffix:
    "後、継続するにはサブスクリプションが必要です。",
},

ko: {
  hero_title: "EU AI 법을 위해 설계된 아키텍처.",
  hero_sub:
    "규제 환경을 위한 전문 AI 작업 공간. 데이터 추출이나 숨겨진 학습 없이, 준법적 분석과 결정을 지원합니다.",

  hero_proof_1: "정책이 아닌 아키텍처 기반 데이터 최소화",
  hero_proof_2: "사용자 데이터로 학습하지 않음 — 절대",
  hero_proof_3: "비영속적, 세션 단위 추론",
  hero_proof_4: "사람이 통제하는 상호작용, 조작 루프 없음",
  hero_proof_5: "감사 및 책임을 고려한 출력",

  hero_price_monthly: "€179 / 월",
  hero_cta: "전문가용 액세스 시작",
  hero_entry_note_prefix:
    "채팅으로 시작하세요. 시스템을 자유롭게 탐색할 수 있습니다. ",
  hero_entry_note_highlight: "9회 응답",
  hero_entry_note_suffix:
    " 후 계속하려면 구독을 선택해야 합니다.",
},

ar: {
  hero_title: "مصمم لقانون الذكاء الاصطناعي الأوروبي — بالمعمارية.",
  hero_sub:
    "مساحة عمل احترافية للذكاء الاصطناعي في البيئات المنظمة. مخصصة للتحليل واتخاذ القرار المتوافق، دون استخراج بيانات أو تدريب مخفي.",

  hero_proof_1: "تقليل البيانات عبر المعمارية لا عبر السياسات",
  hero_proof_2: "لا تدريب على بياناتك — أبداً",
  hero_proof_3: "معالجة غير دائمة ومقيدة بالجلسة",
  hero_proof_4: "تفاعل تحت سيطرة الإنسان دون حلقات تلاعب",
  hero_proof_5: "مخرجات مصممة للتدقيق والمساءلة",

  hero_price_monthly: "179 € / شهرياً",
  hero_cta: "بدء الوصول الاحترافي",
  hero_entry_note_prefix:
    "ابدأ باستخدام الدردشة. يمكنك استكشاف النظام بحرية. بعد ",
  hero_entry_note_highlight: "9 ردود",
  hero_entry_note_suffix:
    " سيُطلب منك اختيار اشتراك للمتابعة.",
},

hi: {
  hero_title: "EU AI अधिनियम के लिए निर्मित — संरचना द्वारा।",
  hero_sub:
    "नियंत्रित परिवेशों के लिए पेशेवर AI कार्यक्षेत्र। डेटा निष्कर्षण या छिपे प्रशिक्षण के बिना, अनुरूप विश्लेषण और निर्णय हेतु।",

  hero_proof_1: "नीति नहीं, संरचना द्वारा डेटा न्यूनतमकरण",
  hero_proof_2: "आपके डेटा पर कोई प्रशिक्षण नहीं — कभी नहीं",
  hero_proof_3: "अस्थायी, सत्र-आधारित तर्क",
  hero_proof_4: "मानव-नियंत्रित अंतःक्रिया, बिना हेरफेर",
  hero_proof_5: "ऑडिट और जवाबदेही हेतु डिज़ाइन किए गए आउटपुट",

  hero_price_monthly: "€179 / माह",
  hero_cta: "पेशेवर एक्सेस शुरू करें",
  hero_entry_note_prefix:
    "चैट से शुरुआत करें। आप सिस्टम को स्वतंत्र रूप से देख सकते हैं। ",
  hero_entry_note_highlight: "9 प्रतिक्रियाओं",
  hero_entry_note_suffix:
    " के बाद जारी रखने के लिए सदस्यता चुननी होगी।",
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
