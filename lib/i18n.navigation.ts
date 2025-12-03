// ===============================================
// i18n.navigation.ts — 13 languages
// ===============================================

// ---- Types ----
export type NavLinks = {
  subscription: string;
  chat: string;
  account: string;
};

export type NavLanguage = {
  label: string;
  select_label: string;
  dropdown_label: string;
};

export type NavAria = {
  menu: string;
  language: string;
};

export type NavAccountState = {
  login: string;
  verifying: string;
  account: string;
};

export type NavAuth = {
  promptEmail: string;
  sendError: string;
  sendSuccess: string;
  unexpectedError: string;
};

export type NavLocale = {
  nav: {
    links: NavLinks;
    language: NavLanguage;
    aria: NavAria;
    account_state: NavAccountState;
    auth: NavAuth;
  };
};

// ---- LOCALES ----
export const i18nNavigation = {
  // --------------------------------------
  // ENGLISH — MASTER
  // --------------------------------------
  en: {
    nav: {
      links: {
        subscription: "Subscription",
        chat: "Chat",
        account: "Account",
      },
      language: {
        label: "Language",
        select_label: "Select language",
        dropdown_label: "Open language selection",
      },
      aria: {
        menu: "Main navigation",
        language: "Change language",
      },
      account_state: {
        login: "Login",
        verifying: "Check Mail",
        account: "Account",
      },
      auth: {
        promptEmail:
          "Please enter your email address for the magic login link:",
        sendError: "Sending the magic link failed. Please try again.",
        sendSuccess:
          "Magic link created. Please check your inbox and spam folder.",
        unexpectedError:
          "Unexpected error while sending the magic link.",
      },
    },
  },

  // --------------------------------------
  // GERMAN — DEUTSCH
  // --------------------------------------
  de: {
    nav: {
      links: {
        subscription: "Abo",
        chat: "Chat",
        account: "Account",
      },
      language: {
        label: "Sprache",
        select_label: "Sprache wählen",
        dropdown_label: "Sprachauswahl öffnen",
      },
      aria: {
        menu: "Hauptnavigation",
        language: "Sprache ändern",
      },
      account_state: {
        login: "Login",
        verifying: "E-Mail prüfen",
        account: "Account",
      },
      auth: {
        promptEmail:
          "Bitte E-Mail-Adresse für den Magic-Login-Link eingeben:",
        sendError:
          "Das Senden des Magic-Links ist fehlgeschlagen. Bitte erneut versuchen.",
        sendSuccess:
          "Magic-Link wurde erzeugt. Bitte Posteingang und Spam-Ordner prüfen.",
        unexpectedError:
          "Unerwarteter Fehler beim Senden des Magic-Links.",
      },
    },
  },

  // --------------------------------------
  // FRENCH — FRANÇAIS
  // --------------------------------------
  fr: {
    nav: {
      links: {
        subscription: "Abonnement",
        chat: "Chat",
        account: "Compte",
      },
      language: {
        label: "Langue",
        select_label: "Choisir la langue",
        dropdown_label: "Ouvrir la sélection de langue",
      },
      aria: {
        menu: "Navigation principale",
        language: "Changer la langue",
      },
      account_state: {
        login: "Connexion",
        verifying: "Vérifier l’e-mail",
        account: "Compte",
      },
      auth: {
        promptEmail:
          "Veuillez saisir votre adresse e-mail pour le lien de connexion magique :",
        sendError:
          "L’envoi du lien magique a échoué. Veuillez réessayer.",
        sendSuccess:
          "Le lien magique a été créé. Veuillez vérifier votre boîte de réception et le dossier spam.",
        unexpectedError:
          "Erreur inattendue lors de l’envoi du lien magique.",
      },
    },
  },

  // --------------------------------------
  // SPANISH — ESPAÑOL
  // --------------------------------------
  es: {
    nav: {
      links: {
        subscription: "Suscripción",
        chat: "Chat",
        account: "Cuenta",
      },
      language: {
        label: "Idioma",
        select_label: "Seleccionar idioma",
        dropdown_label: "Abrir selección de idioma",
      },
      aria: {
        menu: "Navegación principal",
        language: "Cambiar idioma",
      },
      account_state: {
        login: "Iniciar sesión",
        verifying: "Revisar correo",
        account: "Cuenta",
      },
      auth: {
        promptEmail:
          "Introduce tu correo electrónico para el enlace de inicio de sesión mágico:",
        sendError:
          "Error al enviar el enlace mágico. Vuelve a intentarlo.",
        sendSuccess:
          "Enlace mágico creado. Revisa tu bandeja de entrada y la carpeta de spam.",
        unexpectedError:
          "Error inesperado al enviar el enlace mágico.",
      },
    },
  },

  // --------------------------------------
  // ITALIAN — ITALIANO
  // --------------------------------------
  it: {
    nav: {
      links: {
        subscription: "Abbonamento",
        chat: "Chat",
        account: "Account",
      },
      language: {
        label: "Lingua",
        select_label: "Seleziona lingua",
        dropdown_label: "Apri selezione della lingua",
      },
      aria: {
        menu: "Navigazione principale",
        language: "Cambia lingua",
      },
      account_state: {
        login: "Accedi",
        verifying: "Controlla l’e-mail",
        account: "Account",
      },
      auth: {
        promptEmail:
          "Inserisci il tuo indirizzo e-mail per il link di accesso magico:",
        sendError:
          "Invio del link magico non riuscito. Riprova.",
        sendSuccess:
          "Link magico creato. Controlla la posta in arrivo e la cartella spam.",
        unexpectedError:
          "Errore imprevisto durante l’invio del link magico.",
      },
    },
  },

  // --------------------------------------
  // PORTUGUESE — PORTUGUÊS
  // --------------------------------------
  pt: {
    nav: {
      links: {
        subscription: "Assinatura",
        chat: "Chat",
        account: "Conta",
      },
      language: {
        label: "Idioma",
        select_label: "Selecionar idioma",
        dropdown_label: "Abrir seleção de idioma",
      },
      aria: {
        menu: "Navegação principal",
        language: "Alterar idioma",
      },
      account_state: {
        login: "Entrar",
        verifying: "Verificar e-mail",
        account: "Conta",
      },
      auth: {
        promptEmail:
          "Insira seu endereço de e-mail para o link de login mágico:",
        sendError:
          "Falha ao enviar o link mágico. Tente novamente.",
        sendSuccess:
          "Link mágico criado. Verifique sua caixa de entrada e a pasta de spam.",
        unexpectedError:
          "Erro inesperado ao enviar o link mágico.",
      },
    },
  },

  // --------------------------------------
  // DUTCH — NEDERLANDS
  // --------------------------------------
  nl: {
    nav: {
      links: {
        subscription: "Abonnement",
        chat: "Chat",
        account: "Account",
      },
      language: {
        label: "Taal",
        select_label: "Taal kiezen",
        dropdown_label: "Taalmenu openen",
      },
      aria: {
        menu: "Hoofdnavigatie",
        language: "Taal wijzigen",
      },
      account_state: {
        login: "Inloggen",
        verifying: "E-mail controleren",
        account: "Account",
      },
      auth: {
        promptEmail:
          "Voer je e-mailadres in voor de magische inloglink:",
        sendError:
          "Het verzenden van de magische link is mislukt. Probeer het opnieuw.",
        sendSuccess:
          "Magische link aangemaakt. Controleer je inbox en je spammap.",
        unexpectedError:
          "Onverwachte fout bij het verzenden van de magische link.",
      },
    },
  },

  // --------------------------------------
  // RUSSIAN — РУССКИЙ
  // --------------------------------------
  ru: {
    nav: {
      links: {
        subscription: "Подписка",
        chat: "Чат",
        account: "Аккаунт",
      },
      language: {
        label: "Язык",
        select_label: "Выбрать язык",
        dropdown_label: "Открыть выбор языка",
      },
      aria: {
        menu: "Основная навигация",
        language: "Изменить язык",
      },
      account_state: {
        login: "Войти",
        verifying: "Проверьте почту",
        account: "Аккаунт",
      },
      auth: {
        promptEmail:
          "Введите свой адрес электронной почты для магической ссылки входа:",
        sendError:
          "Не удалось отправить магическую ссылку. Попробуйте ещё раз.",
        sendSuccess:
          "Магическая ссылка создана. Проверьте входящие и папку «Спам».",
        unexpectedError:
          "Непредвиденная ошибка при отправке магической ссылки.",
      },
    },
  },

  // --------------------------------------
  // CHINESE (Simplified) — 简体中文
  // --------------------------------------
  zh: {
    nav: {
      links: {
        subscription: "订阅",
        chat: "聊天",
        account: "账户",
      },
      language: {
        label: "语言",
        select_label: "选择语言",
        dropdown_label: "打开语言选择",
      },
      aria: {
        menu: "主导航",
        language: "切换语言",
      },
      account_state: {
        login: "登录",
        verifying: "检查邮箱",
        account: "账户",
      },
      auth: {
        promptEmail:
          "请输入用于接收魔法登录链接的邮箱地址：",
        sendError: "发送魔法链接失败，请重试。",
        sendSuccess:
          "魔法链接已生成，请检查收件箱和垃圾邮件文件夹。",
        unexpectedError:
          "发送魔法链接时发生意外错误。",
      },
    },
  },

  // --------------------------------------
  // JAPANESE — 日本語
  // --------------------------------------
  ja: {
    nav: {
      links: {
        subscription: "サブスクリプション",
        chat: "チャット",
        account: "アカウント",
      },
      language: {
        label: "言語",
        select_label: "言語を選択",
        dropdown_label: "言語選択を開く",
      },
      aria: {
        menu: "メインナビゲーション",
        language: "言語を変更",
      },
      account_state: {
        login: "ログイン",
        verifying: "メール確認",
        account: "アカウント",
      },
      auth: {
        promptEmail:
          "マジックログインリンクを送るメールアドレスを入力してください。",
        sendError:
          "マジックリンクの送信に失敗しました。もう一度お試しください。",
        sendSuccess:
          "マジックリンクを作成しました。受信ボックスと迷惑メールフォルダを確認してください。",
        unexpectedError:
          "マジックリンク送信中に予期しないエラーが発生しました。",
      },
    },
  },

  // --------------------------------------
  // KOREAN — 한국어
  // --------------------------------------
  ko: {
    nav: {
      links: {
        subscription: "구독",
        chat: "채팅",
        account: "계정",
      },
      language: {
        label: "언어",
        select_label: "언어 선택",
        dropdown_label: "언어 선택 열기",
      },
      aria: {
        menu: "메인 내비게이션",
        language: "언어 변경",
      },
      account_state: {
        login: "로그인",
        verifying: "메일 확인",
        account: "계정",
      },
      auth: {
        promptEmail:
          "매직 로그인 링크를 받을 이메일 주소를 입력하세요:",
        sendError:
          "매직 링크 전송에 실패했습니다. 다시 시도해 주세요.",
        sendSuccess:
          "매직 링크가 생성되었습니다. 받은편지함과 스팸함을 확인해 주세요.",
        unexpectedError:
          "매직 링크 전송 중 예기치 않은 오류가 발생했습니다.",
      },
    },
  },

  // --------------------------------------
  // ARABIC — العربية (RTL)
  // --------------------------------------
  ar: {
    nav: {
      links: {
        subscription: "الاشتراك",
        chat: "المحادثة",
        account: "الحساب",
      },
      language: {
        label: "اللغة",
        select_label: "اختر اللغة",
        dropdown_label: "فتح اختيار اللغة",
      },
      aria: {
        menu: "التنقل الرئيسي",
        language: "تغيير اللغة",
      },
      account_state: {
        login: "تسجيل الدخول",
        verifying: "تحقق من البريد",
        account: "الحساب",
      },
      auth: {
        promptEmail:
          "يرجى إدخال عنوان بريدك الإلكتروني للحصول على رابط تسجيل الدخول السحري:",
        sendError:
          "فشل إرسال الرابط السحري. يرجى المحاولة مرة أخرى.",
        sendSuccess:
          "تم إنشاء الرابط السحري. يرجى التحقق من صندوق الوارد ومجلد الرسائل غير المرغوب فيها.",
        unexpectedError:
          "حدث خطأ غير متوقع أثناء إرسال الرابط السحري.",
      },
    },
  },

  // --------------------------------------
  // HINDI — हिन्दी
  // --------------------------------------
  hi: {
    nav: {
      links: {
        subscription: "सदस्यता",
        chat: "चैट",
        account: "खाता",
      },
      language: {
        label: "भाषा",
        select_label: "भाषा चुनें",
        dropdown_label: "भाषा चयन खोलें",
      },
      aria: {
        menu: "मुख्य नेविगेशन",
        language: "भाषा बदलें",
      },
      account_state: {
        login: "लॉगिन",
        verifying: "मेल जांचें",
        account: "खाता",
      },
      auth: {
        promptEmail:
          "मैजिक लॉगिन लिंक के लिए कृपया अपना ई-मेल पता दर्ज करें:",
        sendError:
          "मैजिक लिंक भेजने में विफलता हुई। कृपया दोबारा प्रयास करें।",
        sendSuccess:
          "मैजिक लिंक बना दिया गया है। कृपया इनबॉक्स और स्पैम फ़ोल्डर दोनों जाँचें।",
        unexpectedError:
          "मैजिक लिंक भेजते समय एक अप्रत्याशित त्रुटि हुई।",
      },
    },
  },
} satisfies Record<string, NavLocale>;

// Alias to keep existing imports working
export const dict = i18nNavigation;
