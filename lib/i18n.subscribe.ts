// lib/i18n.subscribe.ts
// Subscribe-Section (Kicker → Preis → Tokens → Benefits → Safety → CTA → Fußnoten)

export const subscribeDict = {
  // 🇬🇧 English – Master
  en: {
    subscribe: {
      // A. Header
      kicker: "ENTRY PACKAGE",
      title: "One clear month with M.",
      subtitle:
        "A single, quiet decision: unlock a full month of m-pathy with enough tokens for a real project — no subscription, no renewal trap.",

      // B. Price & package
      badge_label: "Launch access",
      badge_value: "One-time only",

      price_main: "17,99 €",
      price_period: "for 30 days of access to M",

      token_headline: "Token pool for your work",
      token_value: "Up to 1,000,000 tokens for this month",
      token_subline:
        "Enough capacity for deep explorations, long sessions and real builds — without counting every single request.",

      // C. Benefits
      benefits_title: "What this month gives you",
      benefit_1:
        "Space to explore M in depth — at your own pace, without pressure.",
      benefit_2:
        "A stable field for one focused project: from first spark to concrete results.",
      benefit_3:
        "Emotional clarity and technical power in one place — guided, but always under your control.",
      benefit_4:
        "Time to feel if M fits into your life and work before you decide on anything long term.",

      // D. Safety / Conditions
      safety_title: "Clarity & safety",
      safety_no_subscription:
        "No subscription, no automatic renewal, no hidden steps.",
      safety_one_month:
        "Access simply ends after one month. If you want more, you decide consciously.",
      safety_control:
        "You stay in full control of your time, your money and your access — nothing runs away from you.",
      safety_data:
        "Your conversations follow the same security principles as the rest of m-pathy: calm, controlled and as private as possible.",

      // E. CTA
      cta_preline: "Ready to enter for one month?",
      cta_label: "Enter M now",
      cta_subline: "One month. One decision. No subscription.",
      cta_aria:
        "Start one month of access to m-pathy with up to one million tokens for 14.99 euros.",

      // F. Footnotes
      footnote_1:
        "Token usage depends on model, prompt length and features. Intense use will consume the pool faster.",
      footnote_2:
        "Exact details of token accounting and limits will be documented clearly in the upcoming technical overview."
    }
  },

  // 🇩🇪 German
  de: {
    subscribe: {
      // A. Header
      kicker: "EINSTIEGSPAKET",
      title: "Ein klarer Monat mit M.",
      subtitle:
        "Eine stille, bewusste Entscheidung: ein voller Monat m-pathy mit genug Tokens für ein echtes Projekt – kein Abo, keine Verlängerungsfalle.",

      // B. Preis & Paket
      badge_label: "Launch-Zugang",
      badge_value: "Einmalig",

      price_main: "17,99 €",
      price_period: "für 30 Tage Zugang zu M",

      token_headline: "Tokenpool für deine Arbeit",
      token_value: "Bis zu 1.000.000 Tokens für diesen Monat",
      token_subline:
        "Genug Kapazität für tiefe Erkundungen, lange Sessions und echte Builds – ohne jede einzelne Anfrage mitzuzählen.",

      // C. Benefits
      benefits_title: "Was dir dieser Monat schenkt",
      benefit_1:
        "Raum, M in Ruhe und Tiefe zu erleben – in deinem Tempo, ohne Druck.",
      benefit_2:
        "Ein stabiles Feld für ein fokussiertes Projekt: vom ersten Funken bis zu greifbaren Ergebnissen.",
      benefit_3:
        "Emotionale Klarheit und technische Power an einem Ort – geführt, aber immer unter deiner Kontrolle.",
      benefit_4:
        "Zeit, um zu fühlen, ob M in dein Leben und Arbeiten passt, bevor du irgendetwas Langfristiges entscheidest.",

      // D. Safety / Konditionen
      safety_title: "Klarheit & Sicherheit",
      safety_no_subscription:
        "Kein Abo, keine automatische Verlängerung, keine versteckten Schritte.",
      safety_one_month:
        "Der Zugang endet einfach nach einem Monat. Wenn du weitermachen möchtest, entscheidest du erneut – bewusst.",
      safety_control:
        "Du behältst die volle Kontrolle über Zeit, Geld und Zugang – nichts läuft dir davon.",
      safety_data:
        "Deine Gespräche folgen denselben Sicherheitsprinzipien wie der Rest von m-pathy: ruhig, kontrolliert und so privat wie möglich.",

      // E. CTA
      cta_preline: "Bereit für einen Monat mit M?",
      cta_label: "Jetzt M betreten",
      cta_subline: "Ein Monat. Eine Entscheidung. Kein Abo.",
      cta_aria:
        "Starte einen Monat Zugang zu m-pathy mit bis zu einer Million Tokens für 17,99 Euro.",

      // F. Fußnoten
      footnote_1:
        "Der Tokenverbrauch hängt von Modell, Promptlänge und Features ab. Intensive Nutzung verbraucht den Pool schneller.",
      footnote_2:
        "Die technischen Details zur Token-Verrechnung und zu Limits werden in einer klaren, verständlichen Übersicht dokumentiert."
    }
  },

  // ─────────────────────────────
  // Block 1 – fr, es, it, pt
  // ─────────────────────────────

  // 🇫🇷 French
  fr: {
    subscribe: {
      kicker: "OFFRE D’ENTRÉE",
      title: "Un mois clair avec M.",
      subtitle:
        "Une décision calme et unique : débloquer un mois complet de m-pathy avec assez de tokens pour un vrai projet — sans abonnement, sans reconduction automatique.",

      badge_label: "Accès lancement",
      badge_value: "Paiement unique",

      price_main: "17,99 €",
      price_period: "pour 30 jours d’accès à M",

      token_headline: "Pool de tokens pour votre travail",
      token_value: "Jusqu’à 1 000 000 de tokens pour ce mois",
      token_subline:
        "Suffisamment de capacité pour des explorations profondes, de longues sessions et de vraies créations — sans compter chaque requête.",

      benefits_title: "Ce que ce mois vous apporte",
      benefit_1:
        "De l’espace pour explorer M en profondeur — à votre rythme, sans pression.",
      benefit_2:
        "Un champ stable pour un projet focalisé : de la première étincelle aux résultats concrets.",
      benefit_3:
        "Clarté émotionnelle et puissance technique réunies — guidées, mais toujours sous votre contrôle.",
      benefit_4:
        "Du temps pour ressentir si M a sa place dans votre vie et votre travail avant toute décision à long terme.",

      safety_title: "Clarté & sécurité",
      safety_no_subscription:
        "Aucun abonnement, aucune reconduction automatique, aucune étape cachée.",
      safety_one_month:
        "L’accès se termine simplement après un mois. Si vous voulez continuer, vous décidez à nouveau — en conscience.",
      safety_control:
        "Vous gardez le contrôle complet sur votre temps, votre budget et votre accès — rien ne vous échappe.",
      safety_data:
        "Vos conversations suivent les mêmes principes de sécurité que le reste de m-pathy : calmes, maîtrisées et aussi privées que possible.",

      cta_preline: "Prêt·e pour un mois avec M ?",
      cta_label: "Entrer chez M maintenant",
      cta_subline: "Un mois. Une décision. Aucun abonnement.",
      cta_aria:
        "Démarrer un mois d’accès à m-pathy avec jusqu’à un million de tokens pour 17,99 euros.",

      footnote_1:
        "L’utilisation des tokens dépend du modèle, de la longueur des prompts et des fonctionnalités. Un usage intensif consommera le pool plus rapidement.",
      footnote_2:
        "Les détails exacts de la comptabilisation des tokens et des limites seront clarifiés dans une documentation technique à venir."
    }
  },

  // 🇪🇸 Spanish
  es: {
    subscribe: {
      kicker: "PAQUETE DE ENTRADA",
      title: "Un mes claro con M.",
      subtitle:
        "Una decisión tranquila y única: desbloquear un mes completo de m-pathy con suficientes tokens para un proyecto real — sin suscripción ni renovación automática.",

      badge_label: "Acceso de lanzamiento",
      badge_value: "Pago único",

      price_main: "17,99 €",
      price_period: "por 30 días de acceso a M",

      token_headline: "Pool de tokens para tu trabajo",
      token_value: "Hasta 1.000.000 de tokens para este mes",
      token_subline:
        "Suficiente capacidad para exploraciones profundas, sesiones largas y construcciones reales — sin contar cada solicitud.",

      benefits_title: "Lo que te ofrece este mes",
      benefit_1:
        "Espacio para explorar M en profundidad — a tu ritmo, sin presión.",
      benefit_2:
        "Un campo estable para un proyecto enfocado: desde la primera chispa hasta resultados concretos.",
      benefit_3:
        "Claridad emocional y potencia técnica en un mismo lugar — guiadas, pero siempre bajo tu control.",
      benefit_4:
        "Tiempo para sentir si M encaja en tu vida y en tu trabajo antes de decidir algo a largo plazo.",

      safety_title: "Claridad y seguridad",
      safety_no_subscription:
        "Sin suscripción, sin renovación automática, sin pasos ocultos.",
      safety_one_month:
        "El acceso simplemente termina después de un mes. Si quieres seguir, decides de nuevo — de forma consciente.",
      safety_control:
        "Mantienes el control total sobre tu tiempo, tu dinero y tu acceso — nada se te escapa.",
      safety_data:
        "Tus conversaciones siguen los mismos principios de seguridad que el resto de m-pathy: calma, control y máxima privacidad posible.",

      cta_preline: "¿Listo/a para un mes con M?",
      cta_label: "Entrar en M ahora",
      cta_subline: "Un mes. Una decisión. Sin suscripción.",
      cta_aria:
        "Iniciar un mes de acceso a m-pathy con hasta un millón de tokens por 17,99 euros.",

      footnote_1:
        "El uso de tokens depende del modelo, la longitud de los prompts y las funciones. Un uso intenso consumirá el pool más rápido.",
      footnote_2:
        "Los detalles exactos sobre el conteo de tokens y los límites se documentarán claramente en una próxima vista técnica."
    }
  },

  // 🇮🇹 Italian
  it: {
    subscribe: {
      kicker: "PACCHETTO DI INGRESSO",
      title: "Un mese chiaro con M.",
      subtitle:
        "Una decisione calma e unica: sbloccare un mese intero di m-pathy con abbastanza token per un progetto reale — senza abbonamento, senza rinnovo automatico.",

      badge_label: "Accesso lancio",
      badge_value: "Una sola volta",

      price_main: "17,99 €",
      price_period: "per 30 giorni di accesso a M",

      token_headline: "Pool di token per il tuo lavoro",
      token_value: "Fino a 1.000.000 di token per questo mese",
      token_subline:
        "Capacità sufficiente per esplorazioni profonde, sessioni lunghe e veri sviluppi — senza contare ogni singola richiesta.",

      benefits_title: "Cosa ti offre questo mese",
      benefit_1:
        "Spazio per esplorare M in profondità — al tuo ritmo, senza pressione.",
      benefit_2:
        "Un campo stabile per un progetto focalizzato: dalla prima scintilla ai risultati concreti.",
      benefit_3:
        "Chiarezza emotiva e potenza tecnica nello stesso luogo — guidate, ma sempre sotto il tuo controllo.",
      benefit_4:
        "Tempo per sentire se M si inserisce nella tua vita e nel tuo lavoro prima di decidere qualcosa a lungo termine.",

      safety_title: "Chiarezza e sicurezza",
      safety_no_subscription:
        "Nessun abbonamento, nessun rinnovo automatico, nessun passaggio nascosto.",
      safety_one_month:
        "L’accesso termina semplicemente dopo un mese. Se vuoi continuare, decidi di nuovo — in modo consapevole.",
      safety_control:
        "Rimani in pieno controllo del tuo tempo, del tuo denaro e del tuo accesso — niente ti sfugge.",
      safety_data:
        "Le tue conversazioni seguono gli stessi principi di sicurezza del resto di m-pathy: calma, controllo e la massima privacy possibile.",

      cta_preline: "Pronto/a per un mese con M?",
      cta_label: "Entra ora in M",
      cta_subline: "Un mese. Una decisione. Nessun abbonamento.",
      cta_aria:
        "Avvia un mese di accesso a m-pathy con fino a un milione di token per 17,99 euro.",

      footnote_1:
        "L’utilizzo dei token dipende dal modello, dalla lunghezza dei prompt e dalle funzionalità. Un uso intenso consumerà il pool più rapidamente.",
      footnote_2:
        "I dettagli esatti sul conteggio dei token e sui limiti saranno documentati chiaramente in una prossima panoramica tecnica."
    }
  },

  // 🇵🇹 Portuguese
  pt: {
    subscribe: {
      kicker: "PACOTE DE ENTRADA",
      title: "Um mês claro com M.",
      subtitle:
        "Uma decisão tranquila e única: desbloquear um mês completo de m-pathy com tokens suficientes para um projeto real — sem assinatura e sem renovação automática.",

      badge_label: "Acesso de lançamento",
      badge_value: "Pagamento único",

      price_main: "17,99 €",
      price_period: "por 30 dias de acesso a M",

      token_headline: "Pool de tokens para o seu trabalho",
      token_value: "Até 1.000.000 de tokens neste mês",
      token_subline:
        "Capacidade suficiente para explorações profundas, sessões longas e construções reais — sem contar cada requisição.",

      benefits_title: "O que este mês te oferece",
      benefit_1:
        "Espaço para explorar M em profundidade — no seu ritmo, sem pressão.",
      benefit_2:
        "Um campo estável para um projeto focado: da primeira faísca aos resultados concretos.",
      benefit_3:
        "Clareza emocional e potência técnica no mesmo lugar — guiadas, mas sempre sob o seu controlo.",
      benefit_4:
        "Tempo para sentir se M cabe na sua vida e no seu trabalho antes de decidir algo de longo prazo.",

      safety_title: "Clareza e segurança",
      safety_no_subscription:
        "Sem assinatura, sem renovação automática, sem etapas escondidas.",
      safety_one_month:
        "O acesso simplesmente termina após um mês. Se quiser continuar, você decide de novo — conscientemente.",
      safety_control:
        "Você mantém controlo total sobre o seu tempo, o seu dinheiro e o seu acesso — nada foge de você.",
      safety_data:
        "As suas conversas seguem os mesmos princípios de segurança do restante m-pathy: calmas, controladas e o mais privadas possível.",

      cta_preline: "Pronto/a para um mês com M?",
      cta_label: "Entrar em M agora",
      cta_subline: "Um mês. Uma decisão. Sem assinatura.",
      cta_aria:
        "Comece um mês de acesso ao m-pathy com até um milhão de tokens por 17,99 euros.",

      footnote_1:
        "O uso de tokens depende do modelo, do tamanho dos prompts e das funcionalidades. Uso intenso consome o pool mais rapidamente.",
      footnote_2:
        "Os detalhes exatos sobre contabilização de tokens e limites serão explicados de forma clara numa visão técnica futura."
    }
  },

  // ─────────────────────────────
  // Block 2 – nl, ru, zh, ja
  // ─────────────────────────────

  // 🇳🇱 Dutch
  nl: {
    subscribe: {
      kicker: "INSTAPPakket",
      title: "Eén heldere maand met M.",
      subtitle:
        "Eén rustige, bewuste keuze: een volle maand m-pathy met genoeg tokens voor een echt project — geen abonnement, geen automatische verlenging.",

      badge_label: "Launch-toegang",
      badge_value: "Eenmalig",

      price_main: "17,99 €",
      price_period: "voor 30 dagen toegang tot M",

      token_headline: "Tokenpool voor jouw werk",
      token_value: "Tot 1.000.000 tokens voor deze maand",
      token_subline:
        "Voldoende capaciteit voor diepe verkenningen, lange sessies en echte builds — zonder elke aanvraag te moeten tellen.",

      benefits_title: "Wat deze maand je geeft",
      benefit_1:
        "Ruimte om M in alle rust en diepte te verkennen — in je eigen tempo, zonder druk.",
      benefit_2:
        "Een stabiel veld voor één gefocust project: van eerste idee tot concrete resultaten.",
      benefit_3:
        "Emotionele helderheid en technische kracht op één plek — begeleid, maar altijd onder jouw controle.",
      benefit_4:
        "Tijd om te voelen of M in jouw leven en werk past, vóór je iets voor de lange termijn beslist.",

      safety_title: "Helderheid & veiligheid",
      safety_no_subscription:
        "Geen abonnement, geen automatische verlenging, geen verborgen stappen.",
      safety_one_month:
        "De toegang stopt gewoon na één maand. Als je verder wilt, kies je opnieuw — bewust.",
      safety_control:
        "Jij houdt de volledige controle over je tijd, je geld en je toegang — niets loopt weg.",
      safety_data:
        "Je gesprekken volgen dezelfde veiligheidsprincipes als de rest van m-pathy: rustig, gecontroleerd en zo privé mogelijk.",

      cta_preline: "Klaar voor een maand met M?",
      cta_label: "Nu M binnenstappen",
      cta_subline: "Eén maand. Eén beslissing. Geen abonnement.",
      cta_aria:
        "Start een maand toegang tot m-pathy met tot één miljoen tokens voor 17,99 euro.",

      footnote_1:
        "Het tokenverbruik hangt af van model, promptlengte en functies. Intensief gebruik verbruikt de pool sneller.",
      footnote_2:
        "De exacte details van token-telling en limieten worden binnenkort duidelijk vastgelegd in een technische overzichtspagina."
    }
  },

  // 🇷🇺 Russian
  ru: {
    subscribe: {
      kicker: "СТАРТОВЫЙ ПАКЕТ",
      title: "Один ясный месяц с M.",
      subtitle:
        "Спокойное, разовое решение: открыть полный месяц m-pathy с достаточным количеством токенов для реального проекта — без подписки и без автопродления.",

      badge_label: "Стартовый доступ",
      badge_value: "Разовый платеж",

      price_main: "17,99 €",
      price_period: "за 30 дней доступа к M",

      token_headline: "Пул токенов для вашей работы",
      token_value: "До 1 000 000 токенов на этот месяц",
      token_subline:
        "Достаточно ресурсов для глубоких исследований, долгих сессий и реальных решений — без подсчёта каждой заявки.",

      benefits_title: "Что даёт вам этот месяц",
      benefit_1:
        "Пространство, чтобы спокойно и глубоко познакомиться с M — в своём темпе, без давления.",
      benefit_2:
        "Стабильное поле для одного сфокусированного проекта: от первой искры до конкретных результатов.",
      benefit_3:
        "Эмоциональная ясность и техническая мощь в одном месте — с поддержкой, но под вашим полным контролем.",
      benefit_4:
        "Время почувствовать, подходит ли M вашей жизни и работе, до того как принимать долгосрочные решения.",

      safety_title: "Ясность и безопасность",
      safety_no_subscription:
        "Никакой подписки, никакого автопродления, никаких скрытых шагов.",
      safety_one_month:
        "Доступ просто заканчивается через месяц. Если вы хотите продолжить, вы решаете об этом заново — осознанно.",
      safety_control:
        "Вы полностью контролируете своё время, деньги и доступ — ничего не уходит из-под контроля.",
      safety_data:
        "Ваши беседы подчиняются тем же принципам безопасности, что и остальная часть m-pathy: спокойно, управляемо и максимально конфиденциально.",

      cta_preline: "Готовы к одному месяцу с M?",
      cta_label: "Войти к M сейчас",
      cta_subline: "Один месяц. Одно решение. Без подписки.",
      cta_aria:
        "Начните месяц доступа к m-pathy с пулом до одного миллиона токенов за 17,99 евро.",

      footnote_1:
        "Расход токенов зависит от модели, длины запросов и набора функций. Интенсивное использование быстрее расходует пул.",
      footnote_2:
        "Точные детали учёта токенов и ограничений будут ясно описаны в отдельном техническом обзоре."
    }
  },

  // 🇨🇳 Chinese (Simplified)
  zh: {
    subscribe: {
      kicker: "入门套餐",
      title: "与 M 的清晰一月。",
      subtitle:
        "一次安静而清醒的选择：解锁整整一个月的 m-pathy，并获得足够的 Tokens 来完成一个真实项目——没有订阅，没有自动续费。",

      badge_label: "启动访问",
      badge_value: "一次性",

      price_main: "17,99 €",
      price_period: "享有 30 天 M 的访问权",

      token_headline: "为你工作准备的 Token 池",
      token_value: "本月最多可用 1,000,000 个 Tokens",
      token_subline:
        "足够支撑深入探索、长时间会话和真实构建——无需计算每一次请求。",

      benefits_title: "这个月能给你什么",
      benefit_1:
        "空间，让你以自己的节奏、在没有压力的状态下深入体验 M。",
      benefit_2:
        "一个稳定的场域，用于专注于一个项目：从第一个灵感到具体结果。",
      benefit_3:
        "情绪清晰与技术力量汇聚在同一处——在引导下，但始终由你掌控。",
      benefit_4:
        "时间，让你在做出任何长期决定之前，先感受 M 是否适合你的生活和工作。",

      safety_title: "清晰与安全",
      safety_no_subscription:
        "无订阅、无自动续费、无隐藏步骤。",
      safety_one_month:
        "访问将在一个月后自然结束。若你想继续，你会再次做出清醒的选择。",
      safety_control:
        "你始终掌控自己的时间、金钱和访问权限——一切都在你手中。",
      safety_data:
        "你的对话遵循与 m-pathy 其他部分相同的安全原则：平静、可控、尽可能私密。",

      cta_preline: "准备好与 M 共度一个月了吗？",
      cta_label: "现在进入 M",
      cta_subline: "一个月。一 个决定。无订阅。",
      cta_aria:
        "以 17,99 欧元获得一个月的 m-pathy 访问权，包含最多一百万 Tokens。",

      footnote_1:
        "Token 消耗取决于模型、提示长度和功能。高强度使用会更快耗尽 Token 池。",
      footnote_2:
        "关于 Token 计费方式和限制的详细说明，将在后续技术概览中清晰呈现。"
    }
  },

  // 🇯🇵 Japanese
  ja: {
    subscribe: {
      kicker: "エントリーパッケージ",
      title: "M と過ごす、澄んだ 1 か月。",
      subtitle:
        "静かで意識的なひとつの選択：本物のプロジェクトに十分なトークンとともに、m-pathy を 1 か月まるごと解放する — サブスクリプションなし、自動更新なし。",

      badge_label: "ローンチアクセス",
      badge_value: "一度きりの支払い",

      price_main: "17,99 €",
      price_period: "M への 30 日間アクセス",

      token_headline: "あなたのためのトークンプール",
      token_value: "この 1 か月で最大 1,000,000 トークン",
      token_subline:
        "深い探求、長いセッション、本格的なビルドに十分な容量 — 1 回ごとのリクエストを数える必要はありません。",

      benefits_title: "この 1 か月がもたらすもの",
      benefit_1:
        "自分のペースで、プレッシャーなく、M を深く体験するためのスペース。",
      benefit_2:
        "ひとつのフォーカスしたプロジェクトのための安定したフィールド：最初のひらめきから具体的な結果まで。",
      benefit_3:
        "感情の明晰さと技術的なパワーがひとつの場所に集約 — ガイドはあるが、コントロールは常にあなたにある。",
      benefit_4:
        "長期的な決断をする前に、M があなたの人生と仕事にフィットするかどうかを感じる時間。",

      safety_title: "明瞭さと安全性",
      safety_no_subscription:
        "サブスクリプションなし、自動更新なし、隠れたステップなし。",
      safety_one_month:
        "アクセスは 1 か月後に自然に終了します。続けたい場合は、再び意識的に選択します。",
      safety_control:
        "あなたは時間、お金、アクセスを完全にコントロールし続けます — 何も勝手に進みません。",
      safety_data:
        "あなたの会話は、m-pathy の他の部分と同じセキュリティ原則に従います：静かに、コントロールされた状態で、可能な限りプライベートに。",

      cta_preline: "M と過ごす 1 か月の準備はできましたか？",
      cta_label: "今すぐ M に入る",
      cta_subline: "1 か月。1 つの決断。サブスクリプションなし。",
      cta_aria:
        "17,99 ユーロで、最大 100 万トークン付きの m-pathy 1 か月アクセスを開始します。",

      footnote_1:
        "トークンの消費は、モデル、プロンプトの長さ、機能によって変わります。集中的な利用ではプールがより早く消費されます。",
      footnote_2:
        "トークンのカウント方法と制限の詳細は、今後公開される技術概要で明確に説明されます。"
    }
  },

  // ─────────────────────────────
  // Block 3 – ko, ar, hi
  // ─────────────────────────────

  // 🇰🇷 Korean
  ko: {
    subscribe: {
      kicker: "입문 패키지",
      title: "M과 함께하는 선명한 한 달.",
      subtitle:
        "한 번의 차분하고 의식적인 선택: 실제 프로젝트를 위한 충분한 토큰과 함께, m-pathy를 한 달 내내 열어 두는 것 — 구독 없음, 자동 갱신 없음.",

      badge_label: "런치 액세스",
      badge_value: "한 번 결제",

      price_main: "17,99 €",
      price_period: "M에 30일 동안 접근",

      token_headline: "당신의 작업을 위한 토큰 풀",
      token_value: "이번 달 최대 1,000,000 토큰",
      token_subline:
        "깊은 탐색, 긴 세션, 실제 빌드를 위한 충분한 용량 — 각 요청을 일일이 세지 않아도 됩니다.",

      benefits_title: "이 한 달이 선물하는 것",
      benefit_1:
        "당신의 속도에 맞춰, 압박 없이 M을 깊이 경험할 수 있는 공간.",
      benefit_2:
        "하나의 집중된 프로젝트를 위한 안정된 필드: 첫 영감부터 구체적인 결과까지.",
      benefit_3:
        "감정적 명료성과 기술적 파워가 한 곳에 모인 공간 — 가이드는 있지만, 컨트롤은 항상 당신에게 있습니다.",
      benefit_4:
        "장기적인 결정을 내리기 전에, M이 당신의 삶과 일에 맞는지 느껴 볼 수 있는 시간.",

      safety_title: "명료함과 안전",
      safety_no_subscription:
        "구독 없음, 자동 갱신 없음, 숨겨진 단계 없음.",
      safety_one_month:
        "접근은 한 달 후 자연스럽게 종료됩니다. 계속하고 싶다면, 다시 의식적으로 선택합니다.",
      safety_control:
        "당신은 시간, 비용, 접근 권한을 완전히 스스로 통제합니다 — 아무것도 당신 모르게 진행되지 않습니다.",
      safety_data:
        "당신의 대화는 m-pathy의 다른 부분과 동일한 보안 원칙을 따릅니다: 차분함, 통제, 가능한 최대한의 프라이버시.",

      cta_preline: "M과 함께하는 한 달을 시작할 준비가 되었나요?",
      cta_label: "지금 M에 들어가기",
      cta_subline: "한 달. 하나의 결정. 구독 없음.",
      cta_aria:
        "17,99유로에 최대 백만 개의 토큰이 포함된 m-pathy 한 달 이용을 시작합니다.",

      footnote_1:
        "토큰 사용량은 모델, 프롬프트 길이 및 기능에 따라 달라집니다. 강도 높은 사용은 토큰 풀을 더 빨리 소모합니다.",
      footnote_2:
        "토큰 집계 방식과 한도에 대한 자세한 내용은 추후 제공될 기술 개요에서 명확하게 안내됩니다."
    }
  },

  // 🇦🇪 Arabic
  ar: {
    subscribe: {
      kicker: "حزمة الدخول",
      title: "شهر واضح مع M.",
      subtitle:
        "قرار هادئ وواعٍ واحد: فتح شهر كامل من m-pathy مع عدد كافٍ من التوكنات لمشروع حقيقي — بدون اشتراك، وبدون تجديد تلقائي.",

      badge_label: "وصول الإطلاق",
      badge_value: "دفعة واحدة",

      price_main: "17,99 €",
      price_period: "لمدة 30 يومًا من الوصول إلى M",

      token_headline: "مخزون التوكنات لعملك",
      token_value: "حتى 1,000,000 توكن لهذا الشهر",
      token_subline:
        "سعة كافية لاستكشافات عميقة، وجلسات طويلة، وبناء حقيقي — دون الحاجة لعدّ كل طلب.",

      benefits_title: "ماذا يمنحك هذا الشهر",
      benefit_1:
        "مساحة لتجربة M بعمق — وفق إيقاعك أنت، دون ضغط.",
      benefit_2:
        "حقل ثابت لمشروع واحد مركّز: من أول شرارة حتى النتائج الملموسة.",
      benefit_3:
        "وضوح عاطفي وقوة تقنية في مكان واحد — بتوجيه، لكن تحت سيطرتك الكاملة دائمًا.",
      benefit_4:
        "وقت لتشعر إن كان M مناسبًا لحياتك وعملك قبل اتخاذ أي قرار طويل المدى.",

      safety_title: "الوضوح والأمان",
      safety_no_subscription:
        "لا اشتراك، لا تجديد تلقائي، ولا خطوات مخفية.",
      safety_one_month:
        "ينتهي الوصول ببساطة بعد شهر واحد. إذا أردت الاستمرار، فأنت من يقرر من جديد — بوعي.",
      safety_control:
        "تبقى متحكمًا تمامًا في وقتك ومالك ووصولك — لا شيء يخرج عن يدك.",
      safety_data:
        "تتبع محادثاتك نفس مبادئ الأمان في باقي نظام m-pathy: هدوء، سيطرة، وأقصى قدر ممكن من الخصوصية.",

      cta_preline: "هل أنت مستعد لشهر مع M؟",
      cta_label: "ادخل إلى M الآن",
      cta_subline: "شهر واحد. قرار واحد. بلا اشتراك.",
      cta_aria:
        "ابدأ شهرًا من الوصول إلى m-pathy مع ما يصل إلى مليون توكن مقابل 17,99 يورو.",

      footnote_1:
        "استهلاك التوكنات يعتمد على النموذج وطول الطلبات والخصائص المستخدمة. الاستخدام المكثف يستهلك المخزون بشكل أسرع.",
      footnote_2:
        "سيتم توضيح التفاصيل الدقيقة لكيفية احتساب التوكنات والحدود في عرض تقني قادم وبأسلوب واضح."
    }
  },

  // 🇮🇳 Hindi
  hi: {
    subscribe: {
      kicker: "एंट्री पैकेज",
      title: "M के साथ एक साफ़-सुथरा महीना।",
      subtitle:
        "एक शांत और सजग निर्णय: m-pathy का पूरा एक महीना खोलना, इतना टोकन-पूल कि आप एक असली प्रोजेक्ट चला सकें — बिना सब्सक्रिप्शन, बिना ऑटो-रिन्युअल।",

      badge_label: "लॉन्च एक्सेस",
      badge_value: "केवल एक बार भुगतान",

      price_main: "17,99 €",
      price_period: "M तक 30 दिनों की पहुँच",

      token_headline: "आपके काम के लिए टोकन-पूल",
      token_value: "इस महीने के लिए अधिकतम 1,000,000 टोकन",
      token_subline:
        "गहरी खोज, लंबी सेशन्स और असली बिल्ड्स के लिए पर्याप्त क्षमता — हर रिक्वेस्ट को अलग-अलग गिनने की ज़रूरत नहीं।",

      benefits_title: "यह महीना आपको क्या देता है",
      benefit_1:
        "अपनी गति से, बिना किसी दबाव के M को गहराई से अनुभव करने की जगह।",
      benefit_2:
        "एक फ़ोकस्ड प्रोजेक्ट के लिए स्थिर फ़ील्ड: पहली चिंगारी से लेकर ठोस नतीजों तक।",
      benefit_3:
        "भावनात्मक स्पष्टता और टेक्निकल पावर एक ही जगह — गाइडेड, लेकिन पूरा नियंत्रण आपके हाथ में।",
      benefit_4:
        "लंबी अवधि का निर्णय लेने से पहले यह महसूस करने का समय कि M आपके जीवन और काम में फिट बैठता है या नहीं।",

      safety_title: "स्पष्टता और सुरक्षा",
      safety_no_subscription:
        "कोई सब्सक्रिप्शन नहीं, कोई ऑटो-रिन्युअल नहीं, कोई छुपा हुआ क़दम नहीं।",
      safety_one_month:
        "एक महीने के बाद पहुँच बस समाप्त हो जाती है। अगर आप जारी रखना चाहें, तो आप दोबारा — सजग होकर — निर्णय लेते हैं।",
      safety_control:
        "समय, पैसा और पहुँच — सब पर पूरा नियंत्रण आपके पास रहता है, कुछ भी अपने-आप नहीं चलता।",
      safety_data:
        "आपकी बातचीत m-pathy के बाक़ी हिस्सों की तरह ही सुरक्षा सिद्धांतों का पालन करती है: शांत, नियंत्रित और जितनी संभव हो उतनी निजी।",

      cta_preline: "क्या आप M के साथ एक महीने के लिए तैयार हैं?",
      cta_label: "अभी M में प्रवेश करें",
      cta_subline: "एक महीना। एक निर्णय। कोई सब्सक्रिप्शन नहीं।",
      cta_aria:
        "17,99 यूरो में अधिकतम दस लाख टोकन के साथ m-pathy के एक महीने के एक्सेस की शुरुआत करें।",

      footnote_1:
        "टोकन उपयोग मॉडल, प्रॉम्प्ट की लंबाई और फीचर्स पर निर्भर करता है। गहन उपयोग से टोकन-पूल ज़्यादा तेज़ी से ख़र्च होगा.",
      footnote_2:
        "टोकन की गिनती और लिमिट्स से जुड़ी सटीक जानकारी आने वाले टेक्निकल ओवरव्यू में साफ़-साफ़ समझाई जाएगी।"
    }
  }
};
