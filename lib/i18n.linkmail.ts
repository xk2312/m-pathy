// ===============================================
// i18n.linkmail.ts — 13 languages
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
  // ENGLISH — MASTER
  // --------------------------------------
  en: {
    linkmail: {
      subject: "Your sign-in link for m-pathy",
      headline: "Welcome back to m-pathy",
      body: {
        main: "Here is your secure sign-in link.\nClick the button below to access your account.",
        fallback: "If the button doesn’t work, copy and paste this link into your browser:",
        security:
          "This link is valid for 15 minutes and can only be used once.\nIf you didn’t request it, you can safely ignore this email.",
      },
      button: {
        label: "Sign in",
      },
      footer:
        "Made with clarity and intention — m-pathy.ai\nThis email was sent because someone requested a sign-in link for this address.\nIf this wasn’t you, you can safely ignore it — your account remains secure.\nThis mailbox is not monitored. Please do not reply to this message.",
    },
  },

  // --------------------------------------
  // GERMAN — DEUTSCH
  // --------------------------------------
  de: {
    linkmail: {
      subject: "Dein Anmeldelink für m-pathy",
      headline: "Willkommen zurück bei m-pathy",
      body: {
        main: "Hier ist dein sicherer Anmeldelink.\nKlicke auf den Button unten, um auf dein Konto zuzugreifen.",
        fallback: "Falls der Button nicht funktioniert, kopiere diesen Link und füge ihn in deinen Browser ein:",
        security:
          "Dieser Link ist 15 Minuten gültig und kann nur einmal verwendet werden.\nWenn du ihn nicht angefordert hast, kannst du diese E-Mail ignorieren.",
      },
      button: {
        label: "Anmelden",
      },
      footer:
        "Mit Klarheit und Intention — m-pathy.ai\nDiese E-Mail wurde gesendet, weil jemand einen Anmeldelink für diese Adresse angefordert hat.\nWenn du das nicht warst, kannst du diese Nachricht ignorieren — dein Konto bleibt sicher.\nDieses Postfach wird nicht überwacht. Bitte antworte nicht auf diese Nachricht.",
    },
  },

  // --------------------------------------
  // FRENCH — FRANÇAIS
  // --------------------------------------
  fr: {
    linkmail: {
      subject: "Votre lien de connexion pour m-pathy",
      headline: "Bon retour sur m-pathy",
      body: {
        main: "Voici votre lien de connexion sécurisé.\nCliquez sur le bouton ci-dessous pour accéder à votre compte.",
        fallback: "Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :",
        security:
          "Ce lien est valable 15 minutes et ne peut être utilisé qu’une seule fois.\nSi vous n’en êtes pas à l’origine, ignorez simplement cet e-mail.",
      },
      button: {
        label: "Se connecter",
      },
      footer:
        "Créé avec clarté et intention — m-pathy.ai\nCet e-mail a été envoyé car quelqu’un a demandé un lien de connexion pour cette adresse.\nSi ce n’était pas vous, ignorez-le — votre compte reste sécurisé.\nCette boîte mail n’est pas surveillée. Merci de ne pas répondre.",
    },
  },

  // --------------------------------------
  // SPANISH — ESPAÑOL
  // --------------------------------------
  es: {
    linkmail: {
      subject: "Tu enlace de acceso para m-pathy",
      headline: "Bienvenido de nuevo a m-pathy",
      body: {
        main: "Aquí tienes tu enlace de acceso seguro.\nHaz clic en el botón de abajo para entrar a tu cuenta.",
        fallback: "Si el botón no funciona, copia y pega este enlace en tu navegador:",
        security:
          "Este enlace es válido por 15 minutos y solo puede usarse una vez.\nSi no lo solicitaste, puedes ignorar este correo.",
      },
      button: {
        label: "Acceder",
      },
      footer:
        "Hecho con claridad e intención — m-pathy.ai\nEste correo fue enviado porque alguien solicitó un enlace de acceso para esta dirección.\nSi no fuiste tú, ignóralo — tu cuenta sigue segura.\nEste buzón no se supervisa. Por favor, no respondas a este mensaje.",
    },
  },

  // --------------------------------------
  // ITALIAN — ITALIANO
  // --------------------------------------
  it: {
    linkmail: {
      subject: "Il tuo link di accesso per m-pathy",
      headline: "Bentornato su m-pathy",
      body: {
        main: "Ecco il tuo link di accesso sicuro.\nClicca il pulsante qui sotto per accedere al tuo account.",
        fallback: "Se il pulsante non funziona, copia e incolla questo link nel browser:",
        security:
          "Questo link è valido per 15 minuti e può essere utilizzato una sola volta.\nSe non l’hai richiesto tu, ignora questa email.",
      },
      button: {
        label: "Accedi",
      },
      footer:
        "Creato con chiarezza e intenzione — m-pathy.ai\nQuesta email è stata inviata perché qualcuno ha richiesto un link di accesso per questo indirizzo.\nSe non sei stato tu, puoi ignorarla — il tuo account è al sicuro.\nQuesta casella non è monitorata. Non rispondere a questo messaggio.",
    },
  },

  // --------------------------------------
  // PORTUGUESE — PORTUGUÊS
  // --------------------------------------
  pt: {
    linkmail: {
      subject: "Seu link de acesso para m-pathy",
      headline: "Bem-vindo de volta ao m-pathy",
      body: {
        main: "Aqui está seu link seguro de acesso.\nClique no botão abaixo para entrar em sua conta.",
        fallback: "Se o botão não funcionar, copie e cole este link no navegador:",
        security:
          "Este link é válido por 15 minutos e só pode ser usado uma vez.\nSe você não solicitou, ignore este e-mail.",
      },
      button: {
        label: "Entrar",
      },
      footer:
        "Feito com clareza e intenção — m-pathy.ai\nEste e-mail foi enviado porque alguém solicitou um link de acesso para este endereço.\nSe não foi você, ignore — sua conta continua segura.\nEsta caixa de e-mail não é monitorada. Não responda a esta mensagem.",
    },
  },

  // --------------------------------------
  // DUTCH — NEDERLANDS
  // --------------------------------------
  nl: {
    linkmail: {
      subject: "Je aanmeldlink voor m-pathy",
      headline: "Welkom terug bij m-pathy",
      body: {
        main: "Hier is je beveiligde aanmeldlink.\nKlik op de knop hieronder om toegang te krijgen tot je account.",
        fallback: "Als de knop niet werkt, kopieer en plak dan deze link in je browser:",
        security:
          "Deze link is 15 minuten geldig en kan slechts één keer worden gebruikt.\nAls jij dit niet hebt aangevraagd, kun je deze e-mail negeren.",
      },
      button: {
        label: "Inloggen",
      },
      footer:
        "Gemaakt met helderheid en intentie — m-pathy.ai\nDeze e-mail is verzonden omdat iemand een aanmeldlink voor dit adres heeft aangevraagd.\nAls jij dit niet was, kun je het negeren — je account blijft veilig.\nDeze mailbox wordt niet bewaakt. Reageer niet op dit bericht.",
    },
  },

  // --------------------------------------
  // RUSSIAN — РУССКИЙ
  // --------------------------------------
  ru: {
    linkmail: {
      subject: "Ваша ссылка для входа в m-pathy",
      headline: "С возвращением в m-pathy",
      body: {
        main: "Вот ваша безопасная ссылка для входа.\nНажмите кнопку ниже, чтобы получить доступ к своей учётной записи.",
        fallback: "Если кнопка не работает, скопируйте ссылку и вставьте её в браузер:",
        security:
          "Эта ссылка действительна 15 минут и может быть использована только один раз.\nЕсли вы не запрашивали её, просто проигнорируйте письмо.",
      },
      button: {
        label: "Войти",
      },
      footer:
        "Создано с ясностью и намерением — m-pathy.ai\nЭто письмо отправлено, потому что кто-то запросил ссылку для входа для этого адреса.\nЕсли это были не вы, просто проигнорируйте — ваш аккаунт остаётся в безопасности.\nЭта почта не просматривается. Пожалуйста, не отвечайте.",
    },
  },

  // --------------------------------------
  // CHINESE (Simplified) — 简体中文
  // --------------------------------------
  zh: {
    linkmail: {
      subject: "你在 m-pathy 的登录链接",
      headline: "欢迎回到 m-pathy",
      body: {
        main: "这是你的安全登录链接。\n点击下方按钮进入你的账户。",
        fallback: "如果按钮无法使用，请将以下链接复制到浏览器中：",
        security:
          "该链接有效期为 15 分钟，并且只能使用一次。\n如果不是你本人请求的，请忽略此邮件。",
      },
      button: {
        label: "登录",
      },
      footer:
        "以清晰与意图打造 — m-pathy.ai\n此邮件是因为有人为该邮箱请求了登录链接。\n如果不是你本人，请忽略此邮件 — 你的账户仍然安全。\n此邮箱无人监控，请勿回复。",
    },
  },

  // --------------------------------------
  // JAPANESE — 日本語
  // --------------------------------------
  ja: {
    linkmail: {
      subject: "m-pathy のサインインリンク",
      headline: "m-pathy へお帰りなさい",
      body: {
        main: "こちらがあなたの安全なサインインリンクです。\n下のボタンをクリックしてアカウントにアクセスしてください。",
        fallback: "ボタンが機能しない場合は、このリンクをブラウザにコピー＆ペーストしてください：",
        security:
          "このリンクは 15 分間有効で、一度しか使用できません。\n心当たりがない場合は無視してください。",
      },
      button: {
        label: "サインイン",
      },
      footer:
        "明確さと意図を込めて — m-pathy.ai\nこのメールは、このアドレス宛にサインインリンクがリクエストされたため送信されました。\n心当たりがない場合は無視してください — あなたのアカウントは安全です。\nこのメールボックスは監視されていません。返信しないでください。",
    },
  },

  // --------------------------------------
  // KOREAN — 한국어
  // --------------------------------------
  ko: {
    linkmail: {
      subject: "m-pathy 로그인 링크",
      headline: "m-pathy에 다시 오신 것을 환영합니다",
      body: {
        main: "보안 로그인 링크입니다.\n아래 버튼을 눌러 계정에 접속하세요.",
        fallback: "버튼이 작동하지 않으면 아래 링크를 브라우저에 복사∙붙여넣기 하세요:",
        security:
          "이 링크는 15분 동안만 유효하며 한 번만 사용할 수 있습니다.\n요청하지 않은 경우 이 이메일은 무시해도 됩니다.",
      },
      button: {
        label: "로그인",
      },
      footer:
        "명확함과 의도를 담아 — m-pathy.ai\n이 이메일은 이 주소로 로그인 링크가 요청되어 전송되었습니다.\n본인이 아니라면 무시하세요 — 계정은 안전합니다.\n이 메일함은 모니터링되지 않습니다. 회신하지 마세요.",
    },
  },

  // --------------------------------------
  // ARABIC — العربية (RTL)
  // --------------------------------------
  ar: {
    linkmail: {
      subject: "رابط تسجيل الدخول إلى m-pathy",
      headline: "مرحبًا بعودتك إلى m-pathy",
      body: {
        main: "إليك رابط تسجيل الدخول الآمن الخاص بك.\nاضغط على الزر أدناه للوصول إلى حسابك.",
        fallback: "إذا لم يعمل الزر، انسخ الرابط التالي وضعه في متصفحك:",
        security:
          "هذا الرابط صالح لمدة 15 دقيقة ويمكن استخدامه مرة واحدة فقط.\nإذا لم تطلبه، يمكنك تجاهل هذه الرسالة.",
      },
      button: {
        label: "تسجيل الدخول",
      },
      footer:
        "صُمم بوضوح ونية — m-pathy.ai\nتم إرسال هذه الرسالة لأن شخصًا ما طلب رابط تسجيل دخول لهذا البريد.\nإذا لم تكن أنت، تجاهل الرسالة — حسابك آمن.\nهذا البريد غير مراقب. الرجاء عدم الرد.",
    },
  },

  // --------------------------------------
  // HINDI — हिन्दी
  // --------------------------------------
  hi: {
    linkmail: {
      subject: "m-pathy के लिए आपका साइन-इन लिंक",
      headline: "m-pathy में फिर से स्वागत है",
      body: {
        main: "यह आपका सुरक्षित साइन-इन लिंक है।\nअपने खाते तक पहुँचने के लिए नीचे दिए गए बटन पर क्लिक करें।",
        fallback: "यदि बटन काम नहीं करता है, तो इस लिंक को ब्राउज़र में चिपकाएँ:",
        security:
          "यह लिंक 15 मिनट तक मान्य है और केवल एक बार उपयोग किया जा सकता है।\nयदि आपने इसे अनुरोध नहीं किया है, तो आप इस ई-मेल को अनदेखा कर सकते हैं।",
      },
      button: {
        label: "साइन इन",
      },
      footer:
        "स्पष्टता और इरादे के साथ बनाया गया — m-pathy.ai\nयह ई-मेल इसलिए भेजा गया क्योंकि किसी ने इस पते के लिए साइन-इन लिंक का अनुरोध किया था।\nयदि यह आपने नहीं किया, तो बस अनदेखा करें — आपका खाता सुरक्षित है।\nइस मेलबॉक्स की निगरानी नहीं की जाती। कृपया उत्तर न दें.",
    },
  },
} satisfies Record<string, LinkmailLocale>;

// Alias – exakt wie in Navigation
export const dict = i18nLinkmail;
