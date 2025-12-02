// ===============================================
// i18n.navigation.ts — 3 languages (en, de, fr)
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

export type NavLocale = {
  nav: {
    links: NavLinks;
    language: NavLanguage;
    aria: NavAria;
    account_state: NavAccountState;
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
        verifying: "Vérification de l’e-mail",
        account: "Compte",
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
    },
  },

  // --------------------------------------
  // ARABIC — العربية  (RTL-ready)
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
    },
  },

} satisfies Record<string, NavLocale>;
