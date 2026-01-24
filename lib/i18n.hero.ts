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
    hero_entry_note_prefix: "Start by using the chat. You can explore the system freely. ",
    hero_entry_note_highlight: "Exploratory access is limited",
    hero_entry_note_suffix: ", after which you can continue tomorrow or log in and subscribe.",

  },

 de: {
  hero_title: "Für den EU AI Act gebaut, architektonisch.",
  hero_sub:
    "Professioneller KI-Arbeitsraum für regulierte Umgebungen. Entwickelt für konformes Denken, Analyse und Entscheidungsfindung, ohne Datenextraktion, verstecktes Training oder Überwachung.",

  hero_proof_1: "Datenminimierung durch Architektur, nicht durch Richtlinien",
  hero_proof_2: "Kein Training mit Ihren Daten, zu keinem Zeitpunkt",
  hero_proof_3: "Nicht-persistente, sitzungsgebundene Verarbeitung",
  hero_proof_4: "Menschlich kontrollierte Interaktion ohne Manipulationsmechanismen",
  hero_proof_5: "Ausgaben für Nachvollziehbarkeit und Rechenschaftspflicht ausgelegt",

  hero_price_monthly: "179 € pro Monat",
  hero_cta: "Professionellen Zugang starten",
  hero_entry_note_prefix: "Starten Sie im Chat. Sie können das System frei erkunden. ",
  hero_entry_note_highlight: "Der explorative Zugang ist begrenzt",
  hero_entry_note_suffix:
    ", anschließend können Sie zu einem späteren Zeitpunkt fortfahren oder sich einloggen und abonnieren.",
},


fr: {
    hero_title: "Conçu pour l’EU AI Act, par l’architecture.",
    hero_sub:
      "Espace de travail IA professionnel pour environnements réglementés. Conçu pour une réflexion, une analyse et une prise de décision conformes, sans extraction de données, entraînement caché ni surveillance.",

    hero_proof_1: "Minimisation des données par l’architecture, non par des politiques",
    hero_proof_2: "Aucun entraînement avec vos données, à aucun moment",
    hero_proof_3: "Traitement non persistant, lié à la session",
    hero_proof_4: "Interaction contrôlée par l’humain, sans mécanismes de manipulation",
    hero_proof_5: "Résultats conçus pour la traçabilité et la responsabilité",

    hero_price_monthly: "179 € par mois",
    hero_cta: "Démarrer l’accès professionnel",
    hero_entry_note_prefix: "Commencez dans le chat. Vous pouvez explorer le système librement. ",
    hero_entry_note_highlight: "L’accès exploratoire est limité",
    hero_entry_note_suffix:
      ", ensuite vous pouvez reprendre ultérieurement ou vous connecter et vous abonner.",
  },

  es: {
    hero_title: "Construido para el EU AI Act, por arquitectura.",
    hero_sub:
      "Espacio de trabajo profesional de IA para entornos regulados. Diseñado para pensamiento conforme, análisis y toma de decisiones, sin extracción de datos, entrenamiento oculto ni vigilancia.",

    hero_proof_1: "Minimización de datos mediante arquitectura, no mediante políticas",
    hero_proof_2: "Ningún entrenamiento con sus datos, en ningún momento",
    hero_proof_3: "Procesamiento no persistente y vinculado a la sesión",
    hero_proof_4: "Interacción controlada por humanos, sin mecanismos de manipulación",
    hero_proof_5: "Resultados diseñados para trazabilidad y responsabilidad",

    hero_price_monthly: "179 € por mes",
    hero_cta: "Iniciar acceso profesional",
    hero_entry_note_prefix: "Comience en el chat. Puede explorar el sistema libremente. ",
    hero_entry_note_highlight: "El acceso exploratorio es limitado",
    hero_entry_note_suffix:
      ", posteriormente puede continuar más tarde o iniciar sesión y suscribirse.",
  },

  it: {
    hero_title: "Costruito per l’EU AI Act, per architettura.",
    hero_sub:
      "Spazio di lavoro IA professionale per ambienti regolamentati. Progettato per pensiero conforme, analisi e decisioni, senza estrazione dei dati, addestramento nascosto o sorveglianza.",

    hero_proof_1: "Minimizzazione dei dati tramite architettura, non tramite policy",
    hero_proof_2: "Nessun addestramento con i Suoi dati, in nessun momento",
    hero_proof_3: "Elaborazione non persistente e basata sulla sessione",
    hero_proof_4: "Interazione controllata dall’uomo, senza meccanismi di manipolazione",
    hero_proof_5: "Output progettati per tracciabilità e responsabilità",

    hero_price_monthly: "179 € al mese",
    hero_cta: "Avviare l’accesso professionale",
    hero_entry_note_prefix: "Inizi dalla chat. Può esplorare il sistema liberamente. ",
    hero_entry_note_highlight: "L’accesso esplorativo è limitato",
    hero_entry_note_suffix:
      ", successivamente può riprendere in un secondo momento o accedere e abbonarsi.",
  },

  pt: {
    hero_title: "Construído para o EU AI Act, por arquitetura.",
    hero_sub:
      "Espaço de trabalho profissional de IA para ambientes regulados. Desenvolvido para pensamento conforme, análise e tomada de decisão, sem extração de dados, treino oculto ou vigilância.",

    hero_proof_1: "Minimização de dados por arquitetura, não por políticas",
    hero_proof_2: "Nenhum treino com os seus dados, em momento algum",
    hero_proof_3: "Processamento não persistente e baseado na sessão",
    hero_proof_4: "Interação controlada por humanos, sem mecanismos de manipulação",
    hero_proof_5: "Resultados concebidos para rastreabilidade e responsabilização",

    hero_price_monthly: "179 € por mês",
    hero_cta: "Iniciar acesso profissional",
    hero_entry_note_prefix: "Comece no chat. Pode explorar o sistema livremente. ",
    hero_entry_note_highlight: "O acesso exploratório é limitado",
    hero_entry_note_suffix:
      ", depois pode retomar mais tarde ou iniciar sessão e subscrever.",
  },

  nl: {
    hero_title: "Gebouwd voor de EU AI Act, door architectuur.",
    hero_sub:
      "Professionele AI-werkruimte voor gereguleerde omgevingen. Ontworpen voor conforme denkwijzen, analyse en besluitvorming, zonder data-extractie, verborgen training of toezicht.",

    hero_proof_1: "Dataminimalisatie door architectuur, niet door beleid",
    hero_proof_2: "Geen training met uw gegevens, op geen enkel moment",
    hero_proof_3: "Niet-persistente, sessiegebonden verwerking",
    hero_proof_4: "Door mensen gecontroleerde interactie, zonder manipulatiemechanismen",
    hero_proof_5: "Output ontworpen voor traceerbaarheid en verantwoording",

    hero_price_monthly: "€ 179 per maand",
    hero_cta: "Professionele toegang starten",
    hero_entry_note_prefix: "Start in de chat. U kunt het systeem vrij verkennen. ",
    hero_entry_note_highlight: "De verkennende toegang is beperkt",
    hero_entry_note_suffix:
      ", daarna kunt u later verdergaan of inloggen en een abonnement afsluiten.",
  },

  ru: {
    hero_title: "Создано для EU AI Act на уровне архитектуры.",
    hero_sub:
      "Профессиональная рабочая среда ИИ для регулируемых условий. Предназначена для соответствующего мышления, анализа и принятия решений без извлечения данных, скрытого обучения или наблюдения.",

    hero_proof_1: "Минимизация данных за счет архитектуры, а не правил",
    hero_proof_2: "Никакого обучения на ваших данных, никогда",
    hero_proof_3: "Непостоянная обработка, привязанная к сессии",
    hero_proof_4: "Взаимодействие под человеческим контролем без механизмов манипуляции",
    hero_proof_5: "Результаты, ориентированные на прослеживаемость и подотчетность",

    hero_price_monthly: "179 € в месяц",
    hero_cta: "Начать профессиональный доступ",
    hero_entry_note_prefix: "Начните в чате. Вы можете свободно исследовать систему. ",
    hero_entry_note_highlight: "Исследовательский доступ ограничен",
    hero_entry_note_suffix:
      ", затем вы сможете продолжить позже или войти и оформить подписку.",
  },

  zh: {
    hero_title: "以架构方式构建，符合 EU AI Act。",
    hero_sub:
      "面向受监管环境的专业人工智能工作空间。用于合规思考、分析与决策，不进行数据提取、隐性训练或监控。",

    hero_proof_1: "通过架构实现数据最小化，而非通过政策",
    hero_proof_2: "从不使用您的数据进行训练",
    hero_proof_3: "非持久化、会话级处理",
    hero_proof_4: "人工可控的交互，不含操纵机制",
    hero_proof_5: "为可追溯性与问责而设计的输出",

    hero_price_monthly: "每月 179 欧元",
    hero_cta: "开始专业访问",
    hero_entry_note_prefix: "从聊天开始。您可以自由探索系统。 ",
    hero_entry_note_highlight: "探索性访问是有限的",
    hero_entry_note_suffix:
      "，随后您可以稍后继续，或登录并订阅。",
  },

  ja: {
    hero_title: "EU AI Act に対応するため、アーキテクチャとして設計。",
    hero_sub:
      "規制環境向けのプロフェッショナルAIワークスペース。データ抽出、隠れた学習、監視を行わず、適合した思考、分析、意思決定のために設計されています。",

    hero_proof_1: "方針ではなくアーキテクチャによるデータ最小化",
    hero_proof_2: "お客様のデータを用いた学習は一切行いません",
    hero_proof_3: "非永続的かつセッション単位の処理",
    hero_proof_4: "操作的要素のない、人による制御下の対話",
    hero_proof_5: "追跡性と説明責任のために設計された出力",

    hero_price_monthly: "月額 179 ユーロ",
    hero_cta: "プロフェッショナルアクセスを開始",
    hero_entry_note_prefix: "チャットから開始できます。システムを自由に確認できます。 ",
    hero_entry_note_highlight: "探索的アクセスには制限があります",
    hero_entry_note_suffix:
      "。その後、後日再開するか、ログインしてご契約いただけます。",
  },

  ko: {
    hero_title: "EU AI Act를 위해 아키텍처로 설계되었습니다.",
    hero_sub:
      "규제 환경을 위한 전문 AI 워크스페이스입니다. 데이터 추출, 숨겨진 학습 또는 감시 없이, 규정에 부합하는 사고, 분석 및 의사결정을 위해 설계되었습니다.",

    hero_proof_1: "정책이 아닌 아키텍처를 통한 데이터 최소화",
    hero_proof_2: "귀하의 데이터를 사용한 학습은 절대 없습니다",
    hero_proof_3: "비영속적이며 세션 기반 처리",
    hero_proof_4: "조작 메커니즘 없는 인간 통제 상호작용",
    hero_proof_5: "추적성과 책임성을 위해 설계된 출력",

    hero_price_monthly: "월 179유로",
    hero_cta: "전문가용 접근 시작",
    hero_entry_note_prefix: "채팅에서 시작하십시오. 시스템을 자유롭게 탐색할 수 있습니다. ",
    hero_entry_note_highlight: "탐색 접근은 제한적입니다",
    hero_entry_note_suffix:
      ", 이후 다시 진행하거나 로그인하여 구독할 수 있습니다.",
  },

  ar: {
    hero_title: "مُصمم للامتثال لـ EU AI Act من خلال البنية.",
    hero_sub:
      "مساحة عمل احترافية للذكاء الاصطناعي مخصصة للبيئات الخاضعة للتنظيم. صُممت للتفكير والتحليل واتخاذ القرار المتوافق، دون استخراج بيانات أو تدريب خفي أو مراقبة.",

    hero_proof_1: "تقليل البيانات عبر البنية وليس عبر السياسات",
    hero_proof_2: "لا يتم تدريب النظام على بياناتكم في أي وقت",
    hero_proof_3: "معالجة غير دائمة ومرتبطة بالجلسة",
    hero_proof_4: "تفاعل خاضع للتحكم البشري دون آليات تلاعب",
    hero_proof_5: "مخرجات مصممة للتتبع والمساءلة",

    hero_price_monthly: "179 يورو شهرياً",
    hero_cta: "بدء الوصول المهني",
    hero_entry_note_prefix: "ابدأوا من الدردشة. يمكنكم استكشاف النظام بحرية. ",
    hero_entry_note_highlight: "الوصول الاستكشافي محدود",
    hero_entry_note_suffix:
      "، وبعد ذلك يمكنكم المتابعة لاحقاً أو تسجيل الدخول والاشتراك.",
  },

  hi: {
    hero_title: "EU AI Act के लिए वास्तुकला द्वारा निर्मित।",
    hero_sub:
      "नियामक परिवेशों के लिए पेशेवर AI कार्यक्षेत्र। अनुपालक सोच, विश्लेषण और निर्णय हेतु विकसित, बिना डेटा निष्कर्षण, छिपे प्रशिक्षण या निगरानी के।",

    hero_proof_1: "नीतियों के बजाय वास्तुकला द्वारा डेटा न्यूनतमकरण",
    hero_proof_2: "आपके डेटा पर किसी भी समय प्रशिक्षण नहीं",
    hero_proof_3: "गैर-स्थायी, सत्र-आधारित प्रसंस्करण",
    hero_proof_4: "मानव-नियंत्रित इंटरैक्शन, बिना हेरफेर तंत्र",
    hero_proof_5: "अनुरेखणीयता और जवाबदेही के लिए डिज़ाइन किए गए आउटपुट",

    hero_price_monthly: "179 € प्रति माह",
    hero_cta: "पेशेवर पहुँच प्रारंभ करें",
    hero_entry_note_prefix: "चैट से प्रारंभ करें। आप प्रणाली को स्वतंत्र रूप से देख सकते हैं। ",
    hero_entry_note_highlight: "अन्वेषणात्मक पहुँच सीमित है",
    hero_entry_note_suffix:
      ", इसके बाद आप बाद में जारी रख सकते हैं या लॉग इन कर सदस्यता ले सकते हैं।",
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
