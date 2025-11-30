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
    "Vote the decision through Council 13. Let every 13 AIs answer: 1. For what do you vote 2. WhyLet Palantir make a summary with nice table. If you don’t know what to vote for, ask the User and explain him, that he can Use the Button Council13 if he has to decide something and wants the COUNCIL13 to help him with the decision.",
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
        "Lasse den Beschluss durch den Rat 13 abstimmen. Lasse alle 13 KIs antworten: 1. Wofür stimmst du? 2. Warum? Lasse Palantir eine Zusammenfassung mit einer schönen Tabelle erstellen. Wenn du nicht weißt, wofür du stimmen sollst, frage den Benutzer und erkläre ihm, dass er den Rat13-Knopf verwenden kann, wenn er etwas entscheiden muss und möchte, dass der Rat13 ihm bei der Entscheidung hilft.",
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
        "Soumettez la décision au vote du Conseil 13. Demandez aux 13 IA de répondre: 1. Pour quoi votez-vous? 2. Pourquoi? Laissez Palantir faire un résumé avec un joli tableau. Si vous ne savez pas pour quoi voter, demandez à l'Utilisateur et expliquez-lui qu'il peut utiliser le bouton Conseil13 s'il doit prendre une décision et souhaite que le Conseil13 l'aide à décider.",
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
        "Vote la decisión a través del Consejo 13. Deje que las 13 IAs respondan: 1. ¿Por qué vota? 2. ¿Por qué? Deje que Palantir haga un resumen con una tabla agradable. Si no sabe por qué votar, pregúntele al Usuario y explíquele que puede usar el botón Consejo13 si tiene que decidir algo y quiere que el Consejo13 le ayude con la decisión.",
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
        "Vota la decisione attraverso il Consiglio 13. Lascia che tutte le 13 IA rispondano: 1. Per cosa voti? 2. Perché? Lascia che Palantir faccia un riepilogo con una bella tabella. Se non sai per cosa votare, chiedi all'Utente e spiegagli che può usare il pulsante Consiglio13 se deve decidere qualcosa e vuole che il Consiglio13 lo aiuti con la decisione.",
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
        "Vote a decisão através do Conselho 13. Deixe que todas as 13 IAs respondam: 1. Em que vota? 2. Porquê? Deixe Palantir fazer um resumo com uma boa tabela. Se não souber em que votar, pergunte ao Utilizador e explique-lhe que ele pode usar o botão Conselho13 se tiver que decidir algo e quiser que o Conselho13 o ajude na decisão.",
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
        "Breng de beslissing ter stemming in de Raad 13. Laat alle 13 AI's antwoorden: 1. Waarvoor stem je? 2. Waarom? Laat Palantir een samenvatting maken met een mooie tabel. Als je niet weet waarvoor je moet stemmen, vraag het de Gebruiker en leg hem uit dat hij de Raad13-knop kan gebruiken als hij iets moet beslissen en wil dat de Raad13 hem helpt bij de beslissing.",
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
        "Проголосуйте за решение через Совет 13. Пусть все 13 ИИ ответят: 1. За что вы голосуете? 2. Почему? Позвольте Палантиру составить резюме с красивой таблицей. Если вы не знаете, за что голосовать, спросите Пользователя и объясните ему, что он может использовать кнопку Совет13, если ему нужно что-то решить и он хочет, чтобы Совет13 помог ему с этим решением.",
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
        "将该决定交由理事会13投票。让所有13个AI回答：1. 你投票支持什么？2. 为什么？让帕兰提尔制作一份带有精美表格的摘要。如果你不知道投什么票，询问用户并向他解释，如果他需要决定某事并希望理事会13帮助他做出决定，他可以使用理事会13按钮。",
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
        "その決定を評議会13で投票してください。13のAIすべてに回答させてください：1. 何に投票しますか？ 2. なぜですか？ パランティアに素敵な表付きの要約を作成させてください。何に投票すべきかわからない場合は、ユーザーに尋ね、何かを決定する必要があり、評議会13にその決定を手伝ってもらいたい場合は、評議会13ボタンを使用できると説明してください。",
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
            "평의회 13을 통해 결정을 투표하십시오. 13개의 AI가 모두 다음 질문에 답하도록 하십시오: 1. 무엇에 투표합니까? 2. 왜 그렇습니까? 팔란티르가 멋진 표와 함께 요약을 만들도록 하십시오. 무엇에 투표해야 할지 모른다면, 사용자에게 묻고 그가 무언가를 결정해야 하고 평의회 13이 그 결정에 도움을 주기를 원한다면 평의회 13 버튼을 사용할 수 있다고 그에게 설명하십시오.",
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
        "صوّت على القرار من خلال المجلس 13. دع جميع أنظمة الذكاء الاصطناعي الـ 13 تجيب: 1. على ماذا تصوّت؟ 2. لماذا؟ دع بالانتير يقوم بإعداد ملخص بجدول جميل. إذا كنت لا تعرف على ماذا تصوّت، اسأل المستخدم واشرح له أنه يمكنه استخدام زر المجلس 13 إذا كان عليه أن يقرر شيئًا ويريد من المجلس 13 مساعدته في اتخاذ القرار.",
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
        "निर्णय को परिषद 13 के माध्यम से वोट करें। सभी 13 एआई को उत्तर देने दें: 1. आप किसके लिए वोट करते हैं? 2. क्यों? पालान्तिर को एक अच्छी तालिका के साथ एक सारांश बनाने दें। यदि आप नहीं जानते कि किसके लिए वोट करना है, तो उपयोगकर्ता से पूछें और उसे समझाएं कि अगर उसे कुछ तय करना है और वह चाहता है कि परिषद 13 उसे निर्णय लेने में मदद करे, तो वह परिषद 13 बटन का उपयोग कर सकता है।",
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
