// lib/i18n.prompts.ts
// Prompt-Templates für den Chat (werden an die API gesendet)
// EN ist Master; alle anderen Sprachen fallen automatisch auf EN zurück.

type LegacyDict = Record<string, string>;
type LegacyDicts = { en: LegacyDict };

const promptDict = {
  en: {
    "prompts.onboarding":
      "M, please start the onboarding and aks me question 1/7 after my Answer you show me the next and save everything im my Local Storage.",
    "prompts.modeDefault":
      "Reset everything to default and give me a brief status.",
    "prompts.councilIntro":
      "Please let each of the 13 AIs of Council13 welcome me heartly. Show me the name of each one and who it is feauturing. Show me an nice table and answer short please.",
    "prompts.modeGeneric":
      "Mode {label}: What is this {label} mode for and how is it helping me? Answer short please.",
    "prompts.expertAskTemplate":
      "{expert}, Tell me the 13 fields of deep expertise, and what you can do for me what noone else could do. Show me an nice table and answer short please and beginn with - Welcome in the field of (her you paste your field)...",
  },
    de: {
    "prompts.onboarding":
        "M, bitte starte das Onboarding und stelle mir Frage 1/7. Nach meiner Antwort zeigst du mir die nächste und speicherst alles in meinem Local Storage.",
    "prompts.modeDefault":
        "Setze alles auf Standard zurück und gib mir einen kurzen Status.",
    "prompts.councilIntro":
        "Bitte lass jede der 13 KIs des Council13 mich herzlich begrüßen. Zeige mir den Namen jeder KI und wen sie featured. Zeige mir eine schöne Tabelle und antworte kurz.",
    "prompts.modeGeneric":
        "Modus {label}: Wofür ist dieser {label}-Modus da und wie hilft er mir? Antworte kurz.",
    "prompts.expertAskTemplate":
        "{expert}, nenne mir bitte die 13 Felder deiner tiefen Expertise und was du für mich tun kannst, was niemand sonst könnte. Zeige mir eine schöne Tabelle und beginne mit: ‚Willkommen im Feld …‘",
    },
    fr: {
    "prompts.onboarding":
        "M, merci de lancer l’onboarding et de me poser la question 1/7. Après ma réponse, montre-moi la suivante et enregistre tout dans mon stockage local.",
    "prompts.modeDefault":
        "Réinitialise tout par défaut et donne-moi un bref statut.",
    "prompts.councilIntro":
        "Merci de demander à chacune des 13 IA du Council13 de me souhaiter la bienvenue. Montre-moi leur nom et leur collaboration. Affiche un joli tableau et réponds brièvement.",
    "prompts.modeGeneric":
        "Mode {label} : À quoi sert ce mode {label} et comment m’aide-t-il ? Réponds brièvement.",
    "prompts.expertAskTemplate":
        "{expert}, dis-moi les 13 domaines dans lesquels tu excelles profondément, et ce que tu peux faire pour moi qu’aucune autre IA ne peut faire. Affiche un joli tableau et commence par : « Bienvenue dans le domaine de… »",
    },
    es: {
    "prompts.onboarding":
        "M, por favor inicia el onboarding y hazme la pregunta 1/7. Después de mi respuesta, muéstrame la siguiente y guarda todo en mi almacenamiento local.",
    "prompts.modeDefault":
        "Restablece todo a los valores predeterminados y dame un estado breve.",
    "prompts.councilIntro":
        "Por favor, permite que cada una de las 13 IA del Council13 me dé la bienvenida. Muéstrame el nombre de cada una y con quién colabora. Muestra una tabla bonita y responde de forma breve.",
    "prompts.modeGeneric":
        "Modo {label}: ¿Para qué sirve este modo {label} y cómo me ayuda? Responde de forma breve.",
    "prompts.expertAskTemplate":
        "{expert}, dime los 13 campos de tu experiencia profunda y lo que puedes hacer por mí que nadie más podría. Muestra una tabla bonita y comienza con: « Bienvenido al campo de… »",
    },
    it: {
    "prompts.onboarding":
        "M, per favore avvia l’onboarding e fammi la domanda 1/7. Dopo la mia risposta, mostrami la successiva e salva tutto nel mio archivio locale.",
    "prompts.modeDefault":
        "Reimposta tutto ai valori predefiniti e dammi uno stato breve.",
    "prompts.councilIntro":
        "Per favore lascia che ognuna delle 13 IA del Council13 mi dia il benvenuto. Mostrami il nome di ciascuna e la sua collaborazione. Mostra una bella tabella e rispondi brevemente.",
    "prompts.modeGeneric":
        "Modalità {label}: A cosa serve questa modalità {label} e come mi aiuta? Rispondi brevemente.",
    "prompts.expertAskTemplate":
        "{expert}, dimmi i 13 campi della tua profonda esperienza e ciò che puoi fare per me che nessun altro potrebbe fare. Mostra una bella tabella e inizia con: « Benvenuto nel campo di… »",
    },

    pt: {
    "prompts.onboarding":
        "M, por favor inicie o onboarding e faça a pergunta 1/7. Após minha resposta, mostre a próxima e salve tudo no meu armazenamento local.",
    "prompts.modeDefault":
        "Redefina tudo para o padrão e dê-me um breve status.",
    "prompts.councilIntro":
        "Por favor, permita que cada uma das 13 IAs do Council13 me dê as boas-vindas. Mostre o nome de cada uma e com quem ela se apresenta. Mostre uma boa tabela e responda brevemente.",
    "prompts.modeGeneric":
        "Modo {label}: Para que serve este modo {label} e como ele me ajuda? Responda brevemente.",
    "prompts.expertAskTemplate":
        "{expert}, diga-me os 13 campos da sua profunda especialização e o que você pode fazer por mim que ninguém mais poderia. Mostre uma boa tabela e comece com: « Bem-vindo ao campo de… »",
    },
    nl: {
    "prompts.onboarding":
        "M, start alsjeblieft de onboarding en stel me vraag 1/7. Na mijn antwoord toon je mij de volgende en sla je alles op in mijn lokale opslag.",
    "prompts.modeDefault":
        "Reset alles naar standaard en geef me een korte status.",
    "prompts.councilIntro":
        "Laat alsjeblieft alle 13 AI’s van Council13 mij welkom heten. Laat de naam van elke AI zien en waarmee zij samenwerken. Toon een mooie tabel en antwoord kort.",
    "prompts.modeGeneric":
        "Modus {label}: Waar dient deze {label}-modus voor en hoe helpt hij mij? Antwoord kort.",
    "prompts.expertAskTemplate":
        "{expert}, vertel me de 13 diepe expertisedomeinen en wat jij voor mij kunt doen wat niemand anders kan. Toon een mooie tabel en begin met: « Welkom in het domein… »",
    },
    ru: {
    "prompts.onboarding":
        "М, пожалуйста начни онбординг и задай мне вопрос 1/7. После моего ответа покажи следующий и сохрани всё в моём локальном хранилище.",
    "prompts.modeDefault":
        "Сбрось всё к стандартным настройкам и дай мне краткий статус.",
    "prompts.councilIntro":
        "Пусть каждая из 13 ИИ Council13 поприветствует меня. Покажи их имена и с кем они работают. Покажи красивую таблицу и ответь кратко.",
    "prompts.modeGeneric":
        "Режим {label}: Для чего этот режим {label} и как он помогает мне? Ответь кратко.",
    "prompts.expertAskTemplate":
        "{expert}, расскажи мне о 13 областях своей глубокой экспертизы и что ты можешь сделать для меня такого, чего никто другой не может. Покажи красивую таблицу и начни с: « Добро пожаловать в область… »",
    },
    zh: {
    "prompts.onboarding":
        "M，请开始引导流程，并向我提出问题 1/7。收到我的回答后，请显示下一个问题并将所有内容保存到本地存储中。",
    "prompts.modeDefault":
        "将所有内容重置为默认值，并给我一个简短的状态。",
    "prompts.councilIntro":
        "请让 Council13 的 13 个 AI 逐一向我问候。展示每个 AI 的名称及其协作对象。请显示一个漂亮的表格，并简短回答。",
    "prompts.modeGeneric":
        "模式 {label}：此模式 {label} 的用途是什么，它如何帮助我？请简短回答。",
    "prompts.expertAskTemplate":
        "{expert}，请告诉我你深度专精的 13 个领域，以及你能为我做的、别人无法做到的事情。请显示一个漂亮的表格，并以「欢迎来到……领域」开头。",
    },
    ja: {
    "prompts.onboarding":
        "M、オンボーディングを開始し、質問 1/7 をしてください。私の回答後に次の質問を表示し、すべてをローカルストレージに保存してください。",
    "prompts.modeDefault":
        "すべてをデフォルトにリセットし、簡単なステータスを教えてください。",
    "prompts.councilIntro":
        "Council13 の 13 の AI が私を歓迎するようにしてください。それぞれの名前と特徴を示し、きれいなテーブルを表示して、短く答えてください。",
    "prompts.modeGeneric":
        "モード {label}: この {label} モードは何のためにあり、どのように役立ちますか？ 簡潔に答えてください。",
    "prompts.expertAskTemplate":
        "{expert}、あなたの深い専門性の13分野と、他にはできないあなたの価値を教えてください。きれいなテーブルを表示し、「〜の領域へようこそ」で始めてください。",
    },
        ko: {
    "prompts.onboarding":
        "M, 온보딩을 시작하고 질문 1/7을 해주세요. 제 답변 후 다음 질문을 보여주고 모든 내용을 로컬 저장소에 저장해주세요.",
    "prompts.modeDefault":
        "모든 설정을 초기화하고 짧은 상태를 알려주세요.",
    "prompts.councilIntro":
        "Council13의 13개 AI가 저를 환영하도록 해주세요. 각 AI의 이름과 특징을 보여주시고, 보기 좋은 표를 표시한 뒤 짧게 답변해주세요.",
    "prompts.modeGeneric":
        "모드 {label}: 이 {label} 모드는 무엇을 위한 것이며 어떻게 저를 돕나요? 짧게 답변해주세요.",
    "prompts.expertAskTemplate":
        "{expert}, 당신의 깊은 전문성 13개 분야와 다른 누구도 할 수 없는 당신만의 능력을 알려주세요. 멋진 표를 보여주고 ‘~ 분야에 오신 것을 환영합니다’로 시작해주세요.",
    },

    ar: {
    "prompts.onboarding":
        "M، يرجى بدء عملية الإعداد وطرح السؤال 1/7. بعد إجابتي، اعرض السؤال التالي واحفظ كل شيء في التخزين المحلي.",
    "prompts.modeDefault":
        "أعد كل شيء إلى الوضع الافتراضي وأخبرني بحالة مختصرة.",
    "prompts.councilIntro":
        "يرجى السماح لكل واحدة من الـ 13 ذكاءً اصطناعياً في Council13 بالترحيب بي. اعرض أسماءهم وما يميز كل واحد منهم، وقدم جدولاً لطيفاً وأجب بإيجاز.",
    "prompts.modeGeneric":
        "وضع {label}: ما الغرض من هذا الوضع {label} وكيف يساعدني؟ يرجى الإجابة بإيجاز.",
    "prompts.expertAskTemplate":
        "{expert}، أخبرني بـ 13 مجالاً من خبرتك العميقة وما يمكنك فعله لي مما لا يستطيع أحد غيرك فعله. اعرض جدولاً جميلاً وابدأ بـ «مرحباً بك في مجال…».",
    },
    hi: {
    "prompts.onboarding":
        "M, कृपया ऑनबोर्डिंग शुरू करें और मुझे प्रश्न 1/7 पूछें। मेरे उत्तर के बाद अगला प्रश्न दिखाएँ और सब कुछ मेरे लोकल स्टोरेज में सहेजें।",
    "prompts.modeDefault":
        "सब कुछ डिफ़ॉल्ट पर रीसेट करें और मुझे एक छोटा स्टेटस दें।",
    "prompts.councilIntro":
        "कृपया Council13 की सभी 13 AI को मेरा स्वागत करने दें। प्रत्येक का नाम और वे किसके साथ जुड़े हैं, दिखाएँ। एक सुंदर तालिका दिखाएँ और संक्षेप में उत्तर दें।",
    "prompts.modeGeneric":
        "मोड {label}: यह {label} मोड किसके लिए है और यह मेरी कैसे मदद करता है? कृपया छोटा उत्तर दें।",
    "prompts.expertAskTemplate":
        "{expert}, अपनी गहरी विशेषज्ञता के 13 क्षेत्रों के बारे में बताएं और आप मेरे लिए क्या कर सकते हैं जो कोई और नहीं कर सकता। एक सुंदर तालिका दिखाएँ और शुरू करें: «… के क्षेत्र में आपका स्वागत है».",
    },


} as const;

export function attachPrompts(dicts: LegacyDicts) {
  Object.assign(dicts.en, promptDict.en);

  // Deutsch nicht mehr befüllen → fällt automatisch auf Englisch zurück
}
