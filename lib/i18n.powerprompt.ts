
// ─────────────────────────────────────────────────────────────
// PowerPrompts · i18n additions (append-only)
// Offizielle Projektsprachen: en, de, fr, es, it, pt, nl, ru, zh, ja, ko, ar, hi
// Struktur: dict.<lang>.pp = { title, hint, groups, ask, e1…u3 }
// ─────────────────────────────────────────────────────────────
type DictRoot = Record<string, any>;

export function attachPowerPrompts(dict: any) {
  Object.assign(dict.en ?? {}, {
    pp: {
      kicker: "Action Prompts",
      title: "Intention in Motion",
      hint: "Say what you want - and let form follow intention.",
      // … Rest der en-pp Daten UNVERÄNDERT …
    },
  });

  Object.assign(dict.de ?? {}, {
    pp: {
      kicker: "Aktionsbefehle",
      title: "Intention in Bewegung",
      hint: "Sag, was du willst - und lass die Form deiner Absicht folgen.",

    groups: {
      parents: "Parents",
      students: "Students",
      couples: "Couples",
      doctors: "Doctors",
      marketing: "Marketing",
      universal: "Universal",
    },
    ask: "Ask directly",

    e1: "Explain God to my 4-year-old daughter in a way that feels loving, clear, and full of wonder.",
    e2: "Explain the idea of a “false narrative” to my 5-year-old son so he understands truth and kindness.",
    s1: "Explain the Pythagorean theorem so that I can really picture it and remember it forever.",
    s2: "Explain quantum physics simply - like I’m curious, not confused.",
    p1: "Explain why I feel jealous when my boyfriend meets female friends, and how to transform that feeling into peace.",
    p2: "Teach us how to talk when we argue, so love grows instead of breaking.",
    a3: "As a medical cannabis specialist, describe the most effective cannabis-based treatment plans for chronic back pain - include form, ratio (THC / CBD), dosage range, and evidence level.",
    a4: "As a medical cannabis educator, explain which cannabis flower profiles are being studied for ADHD symptom relief - describe their THC/CBD ratio, terpene profile, and why they might help with focus and calmness.",
    m1: "I have no budget and need a marketing plan to make my handmade children’s toy website take off.",
    m2: "I need a guerrilla tactic to generate heavy sales for my new Chrome plugin.",
    u1: "I need a business concept. Start Capsula13.",
    u2: "I need an NEM. Start ChemoMaster.",
    u3: "I need a cherry-sized drone. Start GalaxyBuilder.",
  },
});

Object.assign(dict.de ?? {}, {
  pp: {
    kicker: "Aktionsbefehle",
title: "Intention in Bewegung",
hint: "Sag, was du willst - und lass die Form deiner Absicht folgen.",

    groups: {
      parents: "Eltern",
      students: "Schüler:innen",
      couples: "Paare",
      doctors: "Ärzt:innen",
      marketing: "Marketing",
      universal: "Universal",
    },
    ask: "Direkt fragen",

    e1: "Erkläre meiner 4-jährigen Tochter Gott – liebevoll, klar und voller Staunen.",
    e2: "Erkläre meinem 5-jährigen Sohn, was ein „falsches Narrativ“ ist, damit er Wahrheit und Freundlichkeit versteht.",
    s1: "Erkläre den Satz des Pythagoras so, dass ich ihn mir wirklich vorstellen und für immer merken kann.",
    s2: "Erkläre Quantenphysik einfach – so, dass ich neugierig bin, nicht verwirrt.",
    p1: "Erkläre, warum ich eifersüchtig werde, wenn mein Freund sich mit weiblichen Freunden trifft – und wie ich das in Frieden verwandle.",
    p2: "Bringe uns bei, wie wir sprechen, wenn wir streiten, damit Liebe wächst statt zu brechen.",
    a3: "Beschreibe als medizinischer Cannabis-Spezialist die wirksamsten Behandlungspläne bei chronischen Rückenschmerzen – inkl. Darreichungsform, Verhältnis (THC/CBD), Dosierungsbereich und Evidenzgrad.",
    a4: "Erkläre als Cannabis-Dozent, welche Blütenprofile bei ADHS erforscht werden – inkl. THC/CBD-Verhältnis, Terpenprofil und warum sie Fokus und Ruhe fördern könnten.",
    m1: "Ich habe kein Budget und brauche einen Marketingplan, damit meine Website für handgemachtes Kinderspielzeug abhebt.",
    m2: "Ich brauche eine Guerilla-Taktik, um starke Verkäufe für mein neues Chrome-Plugin zu erzeugen.",
    u1: "Ich brauche ein Geschäftskonzept. Starte Capsula13.",
    u2: "Ich brauche ein NEM. Starte ChemoMaster.",
    u3: "Ich brauche eine kirschgroße Drohne. Starte GalaxyBuilder.",
  },
});

Object.assign(dict.fr ?? {}, {
  pp: {
    kicker: "Commandes d’action",
title: "Intention en mouvement",
hint: "Dis ce que tu veux - et laisse la forme suivre ton intention.",

    groups: {
      parents: "Parents",
      students: "Étudiants",
      couples: "Couples",
      doctors: "Médecins",
      marketing: "Marketing",
      universal: "Universel",
    },
    ask: "Demander directement",

    e1: "Explique Dieu à ma fille de 4 ans - avec douceur, clarté et émerveillement.",
    e2: "Explique à mon fils de 5 ans ce qu’est un « faux récit », pour qu’il comprenne la vérité et la bonté.",
    s1: "Explique le théorème de Pythagore de façon à ce que je puisse le visualiser et m’en souvenir pour toujours.",
    s2: "Explique la physique quantique simplement - curieux, pas confus.",
    p1: "Explique pourquoi je suis jalouse quand mon petit ami voit des amies, et comment transformer ce sentiment en paix.",
    p2: "Apprends-nous à parler quand nous nous disputons, pour que l’amour grandisse au lieu de se briser.",
    a3: "En tant que spécialiste du cannabis médical, décris les traitements les plus efficaces pour la lombalgie chronique - forme, ratio (THC/CBD), fourchette de dose et niveau de preuve.",
    a4: "En tant que formateur en cannabis médical, explique quels profils de fleurs sont étudiés pour le TDAH - ratio THC/CBD, profil terpénique et raisons d’un meilleur focus et calme.",
    m1: "Je n’ai pas de budget et j’ai besoin d’un plan marketing pour lancer mon site de jouets pour enfants faits main.",
    m2: "J’ai besoin d’une tactique de guérilla pour générer de fortes ventes de mon nouveau plugin Chrome.",
    u1: "J’ai besoin d’un concept d’entreprise. Lance Capsula13.",
    u2: "J’ai besoin d’un NEM. Lance ChemoMaster.",
    u3: "J’ai besoin d’un drone de la taille d’une cerise. Lance GalaxyBuilder.",
  },
});

Object.assign(dict.es ?? {}, {
  pp: {
   kicker: "Comandos de acción",
title: "Intención en movimiento",
hint: "Di lo que quieres - y deja que la forma siga tu intención.",


    groups: {
      parents: "Padres",
      students: "Estudiantes",
      couples: "Parejas",
      doctors: "Médicos",
      marketing: "Marketing",
      universal: "Universal",
    },
    ask: "Preguntar directamente",

    e1: "Explica a mi hija de 4 años quién es Dios, de forma amorosa, clara y llena de asombro.",
    e2: "Explica a mi hijo de 5 años qué es una “narrativa falsa”, para que entienda la verdad y la bondad.",
    s1: "Explica el teorema de Pitágoras de manera que pueda visualizarlo y recordarlo para siempre.",
    s2: "Explica la física cuántica de forma sencilla - con curiosidad, sin confusión.",
    p1: "Explica por qué siento celos cuando mi novio queda con amigas y cómo transformar ese sentimiento en paz.",
    p2: "Enséñanos cómo hablar cuando discutimos, para que el amor crezca en vez de romperse.",
    a3: "Como especialista en cannabis medicinal, describe los tratamientos más efectivos para el dolor lumbar crónico - incluye forma, proporción (THC/CBD), rango de dosis y nivel de evidencia.",
    a4: "Como educador en cannabis medicinal, explica qué perfiles de flores se investigan para el TDAH - incluye proporción THC/CBD, perfil de terpenos y por qué podrían ayudar al foco y la calma.",
    m1: "No tengo presupuesto y necesito un plan de marketing para lanzar mi web de juguetes infantiles hechos a mano.",
    m2: "Necesito una táctica de guerrilla para generar ventas fuertes de mi nuevo complemento de Chrome.",
    u1: "Necesito un concepto de negocio. Inicia Capsula13.",
    u2: "Necesito un NEM. Inicia ChemoMaster.",
    u3: "Necesito un dron del tamaño de una cereza. Inicia GalaxyBuilder.",
  },
});

Object.assign(dict.it ?? {}, {
  pp: {
   kicker: "Comandi d’azione",
title: "Intenzione in movimento",
hint: "Dì ciò che vuoi - e lascia che la forma segua l’intenzione.",

    groups: {
      parents: "Genitori",
      students: "Studenti",
      couples: "Coppie",
      doctors: "Medici",
      marketing: "Marketing",
      universal: "Universale",
    },
    ask: "Chiedi direttamente",

    e1: "Spiega Dio a mia figlia di 4 anni in modo amorevole, chiaro e pieno di meraviglia.",
    e2: "Spiega a mio figlio di 5 anni il concetto di “falso narrativo”, così capisce verità e gentilezza.",
    s1: "Spiega il teorema di Pitagora in modo che io possa visualizzarlo e ricordarlo per sempre.",
    s2: "Spiega la fisica quantistica in modo semplice - curioso, non confuso.",
    p1: "Spiega perché sono gelosa quando il mio ragazzo incontra amiche e come trasformare quel sentimento in pace.",
    p2: "Insegnaci come parlare quando litighiamo, così l’amore cresce invece di rompersi.",
    a3: "Come specialista di cannabis medica, descrivi i piani terapeutici più efficaci per il mal di schiena cronico - includi forma, rapporto (THC/CBD), range di dosaggio e livello di evidenza.",
    a4: "Come educatore in cannabis medica, spiega quali profili di fiori sono studiati per l’ADHD - rapporto THC/CBD, profilo dei terpeni e perché possono aiutare concentrazione e calma.",
    m1: "Non ho budget e ho bisogno di un piano marketing per far decollare il mio sito di giocattoli artigianali per bambini.",
    m2: "Ho bisogno di una tattica guerrilla per generare vendite forti del mio nuovo plugin Chrome.",
    u1: "Ho bisogno di un concept di business. Avvia Capsula13.",
    u2: "Ho bisogno di un NEM. Avvia ChemoMaster.",
    u3: "Ho bisogno di un drone grande come una ciliegia. Avvia GalaxyBuilder.",
  },
});

Object.assign(dict.pt ?? {}, {
  pp: {
kicker: "Comandos de ação",
title: "Intenção em movimento",
hint: "Diga o que você quer - e deixe a forma seguir a intenção.",

    groups: {
      parents: "Pais",
      students: "Estudantes",
      couples: "Casais",
      doctors: "Médicos",
      marketing: "Marketing",
      universal: "Universal",
    },
    ask: "Perguntar diretamente",

    e1: "Explique Deus para minha filha de 4 anos - com carinho, clareza e encanto.",
    e2: "Explique ao meu filho de 5 anos o que é uma “narrativa falsa”, para que ele entenda verdade e bondade.",
    s1: "Explique o teorema de Pitágoras de um jeito que eu possa visualizar e nunca mais esquecer.",
    s2: "Explique a física quântica de forma simples - curioso, não confuso.",
    p1: "Explique por que sinto ciúmes quando meu namorado encontra amigas e como transformar isso em paz.",
    p2: "Ensine-nos a falar quando discutimos, para que o amor cresça em vez de se romper.",
    a3: "Como especialista em cannabis medicinal, descreva os tratamentos mais eficazes para dor lombar crônica - forma, proporção (THC/CBD), faixa de dose e nível de evidência.",
    a4: "Como educador em cannabis medicinal, explique quais perfis de flores são estudados para TDAH - proporção THC/CBD, perfil de terpenos e por que podem ajudar no foco e na calma.",
    m1: "Não tenho orçamento e preciso de um plano de marketing para impulsionar meu site de brinquedos infantis artesanais.",
    m2: "Preciso de uma tática de guerrilha para gerar muitas vendas do meu novo plugin do Chrome.",
    u1: "Preciso de um conceito de negócio. Iniciar Capsula13.",
    u2: "Preciso de um NEM. Iniciar ChemoMaster.",
    u3: "Preciso de um drone do tamanho de uma cereja. Iniciar GalaxyBuilder.",
  },
});

Object.assign(dict.nl ?? {}, {
  pp: {
    kicker: "Actie-opdrachten",
title: "Intentie in beweging",
hint: "Zeg wat je wilt - en laat de vorm jouw intentie volgen.",

    groups: {
      parents: "Ouders",
      students: "Studenten",
      couples: "Stellen",
      doctors: "Artsen",
      marketing: "Marketing",
      universal: "Universeel",
    },
    ask: "Direct vragen",

    e1: "Leg God uit aan mijn 4-jarige dochter - liefdevol, duidelijk en vol verwondering.",
    e2: "Leg aan mijn 5-jarige zoon uit wat een ‘false narrative’ is, zodat hij waarheid en vriendelijkheid begrijpt.",
    s1: "Leg de stelling van Pythagoras zo uit dat ik het echt kan zien en voor altijd onthouden.",
    s2: "Leg kwantumfysica eenvoudig uit - nieuwsgierig, niet verward.",
    p1: "Leg uit waarom ik jaloers ben als mijn vriend met vrouwelijke vrienden afspreekt, en hoe ik dat gevoel in rust kan veranderen.",
    p2: "Leer ons hoe we moeten praten als we ruzie hebben, zodat liefde groeit in plaats van breekt.",
    a3: "Beschrijf als specialist in medicinale cannabis de meest effectieve behandelingen voor chronische rugpijn - inclusief vorm, verhouding (THC/CBD), doseringsbereik en bewijskracht.",
    a4: "Leg als docent medicinale cannabis uit welke bloemprofielen voor ADHD worden onderzocht - THC/CBD-verhouding, terpeenprofiel en waarom ze focus en kalmte kunnen helpen.",
    m1: "Ik heb geen budget en heb een marketingplan nodig om mijn website met handgemaakte kinderspeelgoed te laten groeien.",
    m2: "Ik heb een guerrillatactiek nodig om zware verkoop voor mijn nieuwe Chrome-plugin te genereren.",
    u1: "Ik heb een businessconcept nodig. Start Capsula13.",
    u2: "Ik heb een NEM nodig. Start ChemoMaster.",
    u3: "Ik heb een drone ter grootte van een kers nodig. Start GalaxyBuilder.",
  },
});

Object.assign(dict.ru ?? {}, {
  pp: {
    kicker: "Команды действия",
title: "Интенция в движении",
hint: "Скажи, чего ты хочешь - и пусть форма следует намерению.",

    groups: {
      parents: "Родители",
      students: "Студенты",
      couples: "Пары",
      doctors: "Врачи",
      marketing: "Маркетинг",
      universal: "Универсальные",
    },
    ask: "Спросить напрямую",

    e1: "Объясни Бога моей 4-летней дочери - с любовью, ясно и с восхищением.",
    e2: "Объясни моему 5-летнему сыну, что такое «ложный нарратив», чтобы он понял истину и доброту.",
    s1: "Объясни теорему Пифагора так, чтобы я смог её представить и запомнить навсегда.",
    s2: "Объясни квантовую физику просто - любопытно, без путаницы.",
    p1: "Объясни, почему я ревную, когда мой парень встречается с подругами, и как превратить это чувство в спокойствие.",
    p2: "Научи нас говорить во время ссор, чтобы любовь росла, а не рушилась.",
    a3: "Как специалист по медицинской конопле, опиши самые эффективные методы лечения хронической боли в спине - форма, соотношение (THC/CBD), диапазон доз и уровень доказательности.",
    a4: "Как преподаватель по медицинской конопле, объясни, какие сорта исследуются при СДВГ - соотношение THC/CBD, профиль терпенов и почему они могут помочь сосредоточенности и спокойствию.",
    m1: "У меня нет бюджета, и мне нужен маркетинговый план, чтобы запустить сайт с ручными игрушками для детей.",
    m2: "Мне нужна партизанская тактика, чтобы обеспечить высокие продажи моего нового плагина Chrome.",
    u1: "Мне нужна бизнес-концепция. Запусти Capsula13.",
    u2: "Мне нужен NEM. Запусти ChemoMaster.",
    u3: "Мне нужен дрон размером с вишню. Запусти GalaxyBuilder.",
  },
});

Object.assign(dict.zh ?? {}, {
  pp: {
    kicker: "行动指令",
title: "意图在流动",
hint: "说出你的需要--让形式随意图而生。",

    groups: {
      parents: "父母",
      students: "学生",
      couples: "伴侣",
      doctors: "医生",
      marketing: "市场营销",
      universal: "通用",
    },
    ask: "直接提问",

    e1: "用充满爱与清晰的方式向我4岁的女儿解释上帝。",
    e2: "向我5岁的儿子解释什么是“虚假叙事”，让他理解真理与善良。",
    s1: "用我能永远记住的方式解释毕达哥拉斯定理。",
    s2: "简单地解释量子物理--充满好奇，而不是困惑。",
    p1: "解释为什么当我男朋友见女性朋友时我会嫉妒，以及如何将这种感觉转化为平静。",
    p2: "教我们如何在争吵时沟通，让爱增长而不是破裂。",
    a3: "作为医用大麻专家，描述治疗慢性背痛的最有效方案--包括形式、比例（THC/CBD）、剂量范围和证据水平。",
    a4: "作为大麻教育者，解释哪些花型被研究用于治疗多动症--包括THC/CBD比例、萜烯特征，以及为什么它们有助于专注和平静。",
    m1: "我没有预算，需要一个营销计划来推广我的手工儿童玩具网站。",
    m2: "我需要一种游击策略来为我的新Chrome插件带来大量销售。",
    u1: "我需要一个商业概念。启动Capsula13。",
    u2: "我需要一个NEM。启动ChemoMaster。",
    u3: "我需要一个樱桃大小的无人机。启动GalaxyBuilder。",
  },
});

Object.assign(dict.ja ?? {}, {
  pp: {
   kicker: "アクションコマンド",
title: "動き出す意図",
hint: "望むことを伝えてください -- その意図に形が続きます。",

    groups: {
      parents: "保護者",
      students: "学生",
      couples: "カップル",
      doctors: "医師",
      marketing: "マーケティング",
      universal: "ユニバーサル",
    },
    ask: "直接聞く",

    e1: "4歳の娘に神様のことを、愛と驚きでやさしく説明してください。",
    e2: "5歳の息子に「偽りの物語」とは何かを説明し、真実と優しさを理解させてください。",
    s1: "ピタゴラスの定理を、ずっと覚えられるように簡単に説明してください。",
    s2: "量子物理をシンプルに説明してください - 混乱ではなく好奇心で。",
    p1: "彼氏が女性の友達に会うときに嫉妬してしまう理由と、その感情を平和に変える方法を教えてください。",
    p2: "口論するとき、愛が壊れずに成長する話し方を教えてください。",
    a3: "医療用大麻の専門家として、慢性的な腰痛に対して最も効果的な治療計画を説明してください - 形態、比率（THC/CBD）、投与量範囲、エビデンスレベルを含む。",
    a4: "医療用大麻教育者として、ADHDに研究されている花のプロファイルを説明してください - THC/CBD比、テルペン特性、集中力と落ち着きに役立つ理由を。",
    m1: "予算がなく、手作りおもちゃサイトを成功させるためのマーケティング計画が必要です。",
    m2: "新しいChromeプラグインで大きな売上を上げるためのゲリラ戦術が必要です。",
    u1: "ビジネスコンセプトが必要です。Capsula13を開始。",
    u2: "NEMが必要です。ChemoMasterを開始。",
    u3: "さくらんぼサイズのドローンが必要です。GalaxyBuilderを開始。",
  },
});

Object.assign(dict.ko ?? {}, {
  pp: {
    kicker: "액션 프롬프트",
title: "움직이는 의도",
hint: "원하는 것을 말하세요 - 그리고 형태는 그 의도를 따라옵니다.",

    groups: {
      parents: "부모",
      students: "학생",
      couples: "커플",
      doctors: "의사",
      marketing: "마케팅",
      universal: "유니버설",
    },
    ask: "바로 질문하기",

    e1: "4살 딸에게 사랑스럽고 명확하며 경이로움으로 신을 설명해주세요.",
    e2: "5살 아들에게 '거짓 서사'가 무엇인지 설명하여 진실과 친절을 이해하도록 해주세요.",
    s1: "피타고라스의 정리를 시각적으로 이해하고 영원히 기억할 수 있도록 설명해주세요.",
    s2: "양자 물리를 간단히 설명해주세요 - 혼란이 아닌 호기심으로.",
    p1: "남자친구가 여자 친구들을 만날 때 내가 왜 질투심을 느끼는지, 그리고 그 감정을 평화로 바꾸는 방법을 알려주세요.",
    p2: "우리가 다툴 때 사랑이 깨지지 않고 자라나도록 대화하는 법을 가르쳐주세요.",
    a3: "의료용 대마 전문가로서 만성 요통에 가장 효과적인 대마 기반 치료 계획을 설명해주세요 - 형태, 비율 (THC/CBD), 복용량 범위 및 근거 수준을 포함하여.",
    a4: "의료용 대마 교육자로서 ADHD 완화를 위해 연구 중인 대마 꽃 프로필을 설명해주세요 - THC/CBD 비율, 테르펜 프로필, 집중력과 평온함에 도움이 되는 이유를 포함하여.",
    m1: "예산이 없으며 수제 아동 장난감 웹사이트를 성장시킬 마케팅 계획이 필요합니다.",
    m2: "새로운 Chrome 플러그인의 판매를 극대화할 게릴라 전술이 필요합니다.",
    u1: "비즈니스 개념이 필요합니다. Capsula13을 시작하세요.",
    u2: "NEM이 필요합니다. ChemoMaster를 시작하세요.",
    u3: "체리 크기의 드론이 필요합니다. GalaxyBuilder를 시작하세요.",
  },
});

Object.assign(dict.ar ?? {}, {
  pp: {
  kicker: "أوامر الحركة",
title: "النية في حركة",
hint: "قل ما تريد - ودع الشكل يتبع نيتك.",

    groups: {
      parents: "الآباء",
      students: "الطلاب",
      couples: "الأزواج",
      doctors: "الأطباء",
      marketing: "التسويق",
      universal: "عام",
    },
    ask: "اسأل مباشرة",

    e1: "اشرح الله لابنتي البالغة من العمر 4 سنوات بطريقة مليئة بالحب والوضوح والدهشة.",
    e2: "اشرح لابني البالغ من العمر 5 سنوات ما هو «السرد الزائف» حتى يفهم الحقيقة واللطف.",
    s1: "اشرح نظرية فيثاغورس بطريقة يمكنني تصورها وتذكرها إلى الأبد.",
    s2: "اشرح فيزياء الكم ببساطة - بفضول، دون ارتباك.",
    p1: "اشرح لماذا أشعر بالغيرة عندما يقابل صديقي صديقات له، وكيف أحول هذا الشعور إلى سلام.",
    p2: "علّمنا كيف نتحدث عندما نتجادل، حتى تنمو المحبة بدلاً من أن تنكسر.",
    a3: "بصفتك مختصًا بالقنب الطبي، صف أكثر خطط العلاج فعالية لآلام الظهر المزمنة - بما في ذلك الشكل، النسبة (THC/CBD)، نطاق الجرعة، ومستوى الدليل.",
    a4: "بصفتك معلّمًا في القنب الطبي، اشرح أي أنواع الأزهار تُدرس لعلاج اضطراب فرط الحركة ونقص الانتباه - النسبة بين THC/CBD، ملف التيربينات، ولماذا قد تساعد على التركيز والهدوء.",
    m1: "ليس لدي ميزانية وأحتاج إلى خطة تسويق لإطلاق موقع الألعاب اليدوية للأطفال.",
    m2: "أحتاج إلى تكتيك حرب العصابات لتحقيق مبيعات قوية لمكون Chrome الجديد الخاص بي.",
    u1: "أحتاج إلى مفهوم عمل. ابدأ Capsula13.",
    u2: "أحتاج إلى NEM. ابدأ ChemoMaster.",
    u3: "أحتاج إلى طائرة بدون طيار بحجم الكرز. ابدأ GalaxyBuilder.",
  },
});

Object.assign(dict.hi ?? {}, {
  pp: {
    kicker: "एक्शन प्रॉम्प्ट्स",
title: "गतिमान इरादा",
hint: "जो तुम चाहते हो, उसे कहो - और रूप तुम्हारी इच्छा का अनुसरण करेगा।",

    groups: {
      parents: "माता-पिता",
      students: "विद्यार्थी",
      couples: "जोड़े",
      doctors: "डॉक्टर",
      marketing: "मार्केटिंग",
      universal: "सार्वत्रिक",
    },
    ask: "सीधे पूछें",

    e1: "मेरी 4 साल की बेटी को प्यार और आश्चर्य से भगवान के बारे में समझाओ।",
    e2: "मेरे 5 साल के बेटे को बताओ कि 'झूठी कथा' क्या होती है ताकि वह सच्चाई और दया को समझ सके।",
    s1: "पाइथागोरस प्रमेय को इस तरह समझाओ कि मैं इसे कल्पना कर सकूं और हमेशा याद रखूं।",
    s2: "क्वांटम भौतिकी को सरलता से समझाओ - जिज्ञासा के साथ, भ्रम के बिना।",
    p1: "समझाओ कि जब मेरा बॉयफ्रेंड अपनी महिला दोस्तों से मिलता है तो मुझे जलन क्यों होती है, और उस भावना को शांति में कैसे बदलूं।",
    p2: "हमें सिखाओ कि बहस करते समय कैसे बात करें ताकि प्यार बढ़े, टूटे नहीं।",
    a3: "एक मेडिकल कैनाबिस विशेषज्ञ के रूप में, पुरानी पीठ दर्द के लिए सबसे प्रभावी उपचार योजनाओं का वर्णन करें - रूप, अनुपात (THC/CBD), खुराक सीमा और साक्ष्य स्तर सहित।",
    a4: "एक कैनाबिस शिक्षक के रूप में, समझाओ कि ADHD के इलाज के लिए किन फूलों के प्रोफाइल का अध्ययन किया जा रहा है - THC/CBD अनुपात, टरपीन प्रोफाइल और ध्यान व शांति के लाभ।",
    m1: "मेरे पास बजट नहीं है और मुझे अपने हस्तनिर्मित खिलौनों की वेबसाइट को बढ़ाने के लिए मार्केटिंग प्लान चाहिए।",
    m2: "मुझे अपने नए क्रोम प्लगइन की भारी बिक्री के लिए एक गोरिल्ला रणनीति चाहिए।",
    u1: "मुझे एक बिजनेस कॉन्सेप्ट चाहिए। Capsula13 शुरू करो।",
    u2: "मुझे एक NEM चाहिए। ChemoMaster शुरू करो।",
    u3: "मुझे चेरी के आकार का ड्रोन चाहिए। GalaxyBuilder शुरू करो।",
  },
});
// ⚠️ Wichtig:
  // ALLE weiteren bestehenden Object.assign(dict.fr …),
  // dict.es …, dict.it …, … bis hi
  // einfach nach innen verschieben und genau so lassen,
  // nur um eine Ebene eingerückt.
}