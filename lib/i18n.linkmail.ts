// ===============================================
// i18n.linkmail.ts - 13 languages
// ===============================================

export type LinkmailLocale = {
  linkmail: {
    subject: string;
    headline: string;
    body: {
      main: string;
      fallback: string;
      security: string;
    };
    button: {
      label: string;
    };
    footer: string;
  };
};

// ---- LOCALES ----
export const i18nLinkmail = {
  // --------------------------------------
  // ENGLISH - MASTER
  // --------------------------------------
 en: {
  linkmail: {
    subject: "Secure access to your m-pathy workspace",
    headline: "Welcome back to m-pathy",
    body: {
      main: "This link secures your workspace and lets you continue where you left off.\nUse the button below to sign in.",
      fallback: "If the button does not work, copy and paste this link into your browser:",
      security:
        "This link is valid for 15 minutes and can be used once.\nIf you did not request this, you can safely ignore this email.",
    },
    button: {
      label: "Secure access",
    },
    footer:
      "After signing in, you will return to the chat.\nType OK in the prompt to proceed to payment.\n\nMade with clarity and intention\nm-pathy.ai\n\nThis email was sent because a secure sign in was requested for this address.\nThis mailbox is not monitored. Please do not reply.",
  },
},


  // --------------------------------------
  // GERMAN - DEUTSCH
  // --------------------------------------
  de: {
  linkmail: {
    subject: "Sicherer Zugriff auf deinen m-pathy Arbeitsbereich",
    headline: "Willkommen zurück bei m-pathy",
    body: {
      main: "Dieser Link sichert deinen Arbeitsbereich und lässt dich dort weitermachen, wo du aufgehört hast.\nNutze den Button unten, um dich anzumelden.",
      fallback: "Falls der Button nicht funktioniert, kopiere diesen Link und füge ihn in deinen Browser ein:",
      security:
        "Dieser Link ist 15 Minuten gültig und kann nur einmal verwendet werden.\nWenn du diese Anfrage nicht gestellt hast, kannst du diese E-Mail ignorieren.",
    },
    button: {
      label: "Sicheren Zugriff starten",
    },
    footer:
      "Nach der Anmeldung kehrst du in den Chat zurück.\nGib OK in das Eingabefeld ein, um zur Zahlung weiterzugehen.\n\nMade with clarity and intention\nm-pathy.ai\n\nDiese E-Mail wurde versendet, weil ein sicherer Login für diese Adresse angefordert wurde.\nBitte antworte nicht auf diese Nachricht.",
  },
},


  // --------------------------------------
  // FRENCH - FRANÇAIS
  // --------------------------------------
  fr: {
  linkmail: {
    subject: "Accès sécurisé à votre espace de travail m-pathy",
    headline: "Bon retour sur m-pathy",
    body: {
      main: "Ce lien sécurise votre espace de travail et vous permet de reprendre là où vous vous êtes arrêté.\nUtilisez le bouton ci-dessous pour vous connecter.",
      fallback: "Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :",
      security:
        "Ce lien est valable 15 minutes et ne peut être utilisé qu’une seule fois.\nSi vous n’êtes pas à l’origine de cette demande, vous pouvez ignorer cet e-mail.",
    },
    button: {
      label: "Accès sécurisé",
    },
    footer:
      "Après la connexion, vous retournerez dans le chat.\nSaisissez OK dans le champ de saisie pour accéder au paiement.\n\nMade with clarity and intention\nm-pathy.ai\n\nCet e-mail a été envoyé suite à une demande d’accès sécurisé pour cette adresse.\nMerci de ne pas répondre à ce message.",
  },
},


  // --------------------------------------
  // SPANISH - ESPAÑOL
  // --------------------------------------
 es: {
  linkmail: {
    subject: "Acceso seguro a tu espacio de trabajo de m-pathy",
    headline: "Bienvenido de nuevo a m-pathy",
    body: {
      main: "Este enlace asegura tu espacio de trabajo y te permite continuar donde lo dejaste.\nUtiliza el botón de abajo para iniciar sesión.",
      fallback: "Si el botón no funciona, copia y pega este enlace en tu navegador:",
      security:
        "Este enlace es válido durante 15 minutos y solo puede usarse una vez.\nSi no solicitaste esto, puedes ignorar este correo.",
    },
    button: {
      label: "Acceso seguro",
    },
    footer:
      "Después de iniciar sesión, volverás al chat.\nEscribe OK en el campo de entrada para continuar al pago.\n\nMade with clarity and intention\nm-pathy.ai\n\nEste correo se envió porque se solicitó un acceso seguro para esta dirección.\nNo respondas a este mensaje.",
  },
},


  // --------------------------------------
  // ITALIAN - ITALIANO
  // --------------------------------------
  it: {
  linkmail: {
    subject: "Accesso sicuro al tuo spazio di lavoro m-pathy",
    headline: "Bentornato su m-pathy",
    body: {
      main: "Questo link protegge il tuo spazio di lavoro e ti consente di continuare da dove avevi interrotto.\nUsa il pulsante qui sotto per accedere.",
      fallback: "Se il pulsante non funziona, copia e incolla questo link nel browser:",
      security:
        "Questo link è valido per 15 minuti e può essere utilizzato una sola volta.\nSe non hai richiesto questo accesso, puoi ignorare questa email.",
    },
    button: {
      label: "Accesso sicuro",
    },
    footer:
      "Dopo l’accesso, tornerai nella chat.\nDigita OK nel campo di input per procedere al pagamento.\n\nMade with clarity and intention\nm-pathy.ai\n\nQuesta email è stata inviata a seguito di una richiesta di accesso sicuro per questo indirizzo.\nNon rispondere a questo messaggio.",
  },
},


  // --------------------------------------
  // PORTUGUESE - PORTUGUÊS
  // --------------------------------------
  pt: {
  linkmail: {
    subject: "Acesso seguro ao seu espaço de trabalho m-pathy",
    headline: "Bem-vindo de volta ao m-pathy",
    body: {
      main: "Este link protege o seu espaço de trabalho e permite continuar de onde parou.\nUse o botão abaixo para entrar.",
      fallback: "Se o botão não funcionar, copie e cole este link no seu navegador:",
      security:
        "Este link é válido por 15 minutos e só pode ser usado uma vez.\nSe não solicitou este acesso, pode ignorar este email.",
    },
    button: {
      label: "Acesso seguro",
    },
    footer:
      "Após iniciar sessão, você retornará ao chat.\nDigite OK no campo de entrada para prosseguir para o pagamento.\n\nMade with clarity and intention\nm-pathy.ai\n\nEste email foi enviado porque foi solicitado um acesso seguro para este endereço.\nNão responda a esta mensagem.",
  },
},


  // --------------------------------------
  // DUTCH - NEDERLANDS
  // --------------------------------------
  nl: {
  linkmail: {
    subject: "Beveiligde toegang tot je m-pathy werkruimte",
    headline: "Welkom terug bij m-pathy",
    body: {
      main: "Deze link beveiligt je werkruimte en laat je verdergaan waar je was gebleven.\nGebruik de knop hieronder om in te loggen.",
      fallback: "Als de knop niet werkt, kopieer en plak deze link in je browser:",
      security:
        "Deze link is 15 minuten geldig en kan slechts één keer worden gebruikt.\nAls je dit niet hebt aangevraagd, kun je deze e-mail negeren.",
    },
    button: {
      label: "Beveiligde toegang",
    },
    footer:
      "Na het inloggen keer je terug naar de chat.\nTyp OK in het invoerveld om door te gaan naar betaling.\n\nMade with clarity and intention\nm-pathy.ai\n\nDeze e-mail is verzonden omdat er een beveiligde toegang werd aangevraagd voor dit adres.\nBeantwoord dit bericht niet.",
  },
},


  // --------------------------------------
  // RUSSIAN - РУССКИЙ
  // --------------------------------------
 ru: {
  linkmail: {
    subject: "Защищённый доступ к вашему рабочему пространству m-pathy",
    headline: "С возвращением в m-pathy",
    body: {
      main: "Эта ссылка защищает ваше рабочее пространство и позволяет продолжить с того места, где вы остановились.\nИспользуйте кнопку ниже, чтобы войти.",
      fallback: "Если кнопка не работает, скопируйте и вставьте эту ссылку в браузер:",
      security:
        "Ссылка действительна 15 минут и может быть использована только один раз.\nЕсли вы не запрашивали доступ, можете игнорировать это письмо.",
    },
    button: {
      label: "Защищённый доступ",
    },
    footer:
      "После входа вы вернётесь в чат.\nВведите OK в поле ввода, чтобы перейти к оплате.\n\nMade with clarity and intention\nm-pathy.ai\n\nЭто письмо отправлено по запросу защищённого доступа для данного адреса.\nНе отвечайте на это сообщение.",
  },
},


  // --------------------------------------
  // CHINESE (Simplified) - 简体中文
  // --------------------------------------
  zh: {
  linkmail: {
    subject: "访问你的 m-pathy 工作空间的安全链接",
    headline: "欢迎回到 m-pathy",
    body: {
      main: "此链接可保护你的工作空间，并让你从上次中断处继续。\n请使用下方按钮登录。",
      fallback: "如果按钮无法使用，请将以下链接复制到浏览器中：",
      security:
        "此链接在 15 分钟内有效，且只能使用一次。\n如果你未请求此操作，可忽略此邮件。",
    },
    button: {
      label: "安全访问",
    },
    footer:
      "登录后，你将返回聊天界面。\n在输入框中输入 OK 以继续支付。\n\nMade with clarity and intention\nm-pathy.ai\n\n此邮件因请求安全访问而发送。\n请勿回复此消息。",
  },
},


  // --------------------------------------
  // JAPANESE - 日本語
  // --------------------------------------
  ja: {
  linkmail: {
    subject: "m-pathy ワークスペースへの安全なアクセス",
    headline: "m-pathy へお帰りなさい",
    body: {
      main: "このリンクはあなたのワークスペースを保護し、途中から再開できるようにします。\n下のボタンを使ってログインしてください。",
      fallback: "ボタンが機能しない場合は、このリンクをブラウザに貼り付けてください：",
      security:
        "このリンクは 15 分間有効で、1 回のみ使用できます。\n心当たりがない場合は、このメールを無視してください。",
    },
    button: {
      label: "安全にアクセス",
    },
    footer:
      "ログイン後、チャットに戻ります。\n入力欄に OK と入力して支払いに進んでください。\n\nMade with clarity and intention\nm-pathy.ai\n\nこのメールは安全なアクセス要求に基づいて送信されました。\n返信しないでください。",
  },
},


  // --------------------------------------
  // KOREAN - 한국어
  // --------------------------------------
  ko: {
  linkmail: {
    subject: "m-pathy 작업 공간에 대한 보안 액세스",
    headline: "m-pathy에 다시 오신 것을 환영합니다",
    body: {
      main: "이 링크는 작업 공간을 보호하고 중단한 지점에서 계속할 수 있게 합니다.\n아래 버튼을 눌러 로그인하세요.",
      fallback: "버튼이 작동하지 않으면 이 링크를 브라우저에 복사해 붙여넣으세요:",
      security:
        "이 링크는 15분 동안 유효하며 한 번만 사용할 수 있습니다.\n요청한 적이 없다면 이 이메일을 무시하셔도 됩니다.",
    },
    button: {
      label: "보안 액세스",
    },
    footer:
      "로그인 후 채팅으로 돌아옵니다.\n입력창에 OK를 입력하면 결제로 이동합니다.\n\nMade with clarity and intention\nm-pathy.ai\n\n이 이메일은 보안 액세스 요청으로 발송되었습니다.\n회신하지 마세요.",
  },
},


  // --------------------------------------
  // ARABIC - العربية (RTL)
  // --------------------------------------
  ar: {
  linkmail: {
    subject: "وصول آمن إلى مساحة عمل m-pathy",
    headline: "مرحبًا بعودتك إلى m-pathy",
    body: {
      main: "هذا الرابط يؤمّن مساحة عملك ويتيح لك المتابعة من حيث توقفت.\nاستخدم الزر أدناه لتسجيل الدخول.",
      fallback: "إذا لم يعمل الزر، انسخ هذا الرابط والصقه في المتصفح:",
      security:
        "هذا الرابط صالح لمدة 15 دقيقة ويمكن استخدامه مرة واحدة فقط.\nإذا لم تطلب هذا الوصول، يمكنك تجاهل هذه الرسالة.",
    },
    button: {
      label: "وصول آمن",
    },
    footer:
      "بعد تسجيل الدخول، ستعود إلى المحادثة.\nاكتب OK في حقل الإدخال للمتابعة إلى الدفع.\n\nMade with clarity and intention\nm-pathy.ai\n\nتم إرسال هذا البريد بسبب طلب وصول آمن لهذا العنوان.\nيرجى عدم الرد على هذه الرسالة.",
  },
},


  // --------------------------------------
  // HINDI - हिन्दी
  // --------------------------------------
  hi: {
  linkmail: {
    subject: "आपके m-pathy कार्यक्षेत्र के लिए सुरक्षित एक्सेस",
    headline: "m-pathy में आपका फिर से स्वागत है",
    body: {
      main: "यह लिंक आपके कार्यक्षेत्र को सुरक्षित करता है और आपको वहीं से आगे बढ़ने देता है जहाँ आप रुके थे।\nलॉग इन करने के लिए नीचे दिए गए बटन का उपयोग करें।",
      fallback: "यदि बटन काम नहीं करता है, तो इस लिंक को कॉपी करके अपने ब्राउज़र में पेस्ट करें:",
      security:
        "यह लिंक 15 मिनट के लिए मान्य है और केवल एक बार उपयोग किया जा सकता है।\nयदि आपने इसका अनुरोध नहीं किया है, तो आप इस ईमेल को अनदेखा कर सकते हैं।",
    },
    button: {
      label: "सुरक्षित एक्सेस",
    },
    footer:
      "लॉग इन करने के बाद, आप चैट पर वापस आएँगे।\nभुगतान के लिए आगे बढ़ने हेतु इनपुट फ़ील्ड में OK लिखें।\n\nMade with clarity and intention\nm-pathy.ai\n\nयह ईमेल सुरक्षित एक्सेस के अनुरोध के कारण भेजा गया है।\nकृपया इस संदेश का उत्तर न दें।",
  },
},

} satisfies Record<string, LinkmailLocale>;

// Alias – exakt wie in Navigation
export const dict = i18nLinkmail;
