// ===============================================
// i18n.accountpanel.ts — 13 languages
// ===============================================

export type AccountStatus = {
  label: string;
  loggedIn: string;
};

export type AccountTokens = {
  label: string;
  loading: string;
};

export type AccountInfo = {
  freegate: string;
};

export type AccountButton = {
  logout: string;
};

export type AccountEmail = {
  unknown: string;
};

export type AccountAria = {
  dialogLabel: string;
};

export type AccountLocale = {
  account: {
    title: string;
    loggedInAs: string;
    status: AccountStatus;
    tokens: AccountTokens;
    info: AccountInfo;
    button: AccountButton;
    email: AccountEmail;
    aria: AccountAria;
  };
};

// ---- LOCALES ----
export const i18nAccountPanel = {
  // --------------------------------------
  // ENGLISH — MASTER
  // --------------------------------------
  en: {
    account: {
      title: "Your account",
      loggedInAs: "Signed in as:",
      status: {
        label: "Status",
        loggedIn: "Logged in",
      },
      tokens: {
        label: "Your tokens",
        loading: "... loading",
      },
      info: {
        freegate:
          "You are signed in and using your token balance. FreeGate applies to anonymous users only.",
      },
      button: {
        logout: "Log out",
      },
      email: {
        unknown: "Unknown email",
      },
      aria: {
        dialogLabel: "Account panel",
      },
    },
  },

  // --------------------------------------
  // GERMAN — DEUTSCH
  // --------------------------------------
  de: {
    account: {
      title: "Dein Account",
      loggedInAs: "Angemeldet als:",
      status: {
        label: "Status",
        loggedIn: "Eingeloggt",
      },
      tokens: {
        label: "Deine Tokens",
        loading: "… lädt",
      },
      info: {
        freegate:
          "Du bist eingeloggt und nutzt dein Token-Konto. FreeGate gilt nur für anonyme Nutzer.",
      },
      button: {
        logout: "Abmelden",
      },
      email: {
        unknown: "Unbekannte E-Mail",
      },
      aria: {
        dialogLabel: "Account",
      },
    },
  },

  // --------------------------------------
  // FRENCH — FRANÇAIS
  // --------------------------------------
  fr: {
    account: {
      title: "Votre compte",
      loggedInAs: "Connecté en tant que :",
      status: {
        label: "Statut",
        loggedIn: "Connecté",
      },
      tokens: {
        label: "Vos jetons",
        loading: "… chargement",
      },
      info: {
        freegate:
          "Vous êtes connecté et utilisez votre compte de jetons. FreeGate ne s’applique qu’aux utilisateurs anonymes.",
      },
      button: {
        logout: "Se déconnecter",
      },
      email: {
        unknown: "E-mail inconnu",
      },
      aria: {
        dialogLabel: "Panneau de compte",
      },
    },
  },

  // --------------------------------------
  // SPANISH — ESPAÑOL
  // --------------------------------------
  es: {
    account: {
      title: "Tu cuenta",
      loggedInAs: "Conectado como:",
      status: {
        label: "Estado",
        loggedIn: "Conectado",
      },
      tokens: {
        label: "Tus tokens",
        loading: "… cargando",
      },
      info: {
        freegate:
          "Has iniciado sesión y usas tu saldo de tokens. FreeGate solo se aplica a usuarios anónimos.",
      },
      button: {
        logout: "Cerrar sesión",
      },
      email: {
        unknown: "Correo desconocido",
      },
      aria: {
        dialogLabel: "Panel de cuenta",
      },
    },
  },

  // --------------------------------------
  // ITALIAN — ITALIANO
  // --------------------------------------
  it: {
    account: {
      title: "Il tuo account",
      loggedInAs: "Accesso come:",
      status: {
        label: "Stato",
        loggedIn: "Connesso",
      },
      tokens: {
        label: "I tuoi token",
        loading: "… caricamento",
      },
      info: {
        freegate:
          "Sei connesso e stai usando il tuo saldo token. FreeGate si applica solo agli utenti anonimi.",
      },
      button: {
        logout: "Disconnetti",
      },
      email: {
        unknown: "E-mail sconosciuta",
      },
      aria: {
        dialogLabel: "Pannello account",
      },
    },
  },

  // --------------------------------------
  // PORTUGUESE — PORTUGUÊS
  // --------------------------------------
  pt: {
    account: {
      title: "Sua conta",
      loggedInAs: "Conectado como:",
      status: {
        label: "Status",
        loggedIn: "Conectado",
      },
      tokens: {
        label: "Seus tokens",
        loading: "… carregando",
      },
      info: {
        freegate:
          "Você está conectado e usando seu saldo de tokens. FreeGate se aplica apenas a usuários anônimos.",
      },
      button: {
        logout: "Sair",
      },
      email: {
        unknown: "E-mail desconhecido",
      },
      aria: {
        dialogLabel: "Painel da conta",
      },
    },
  },

  // --------------------------------------
  // DUTCH — NEDERLANDS
  // --------------------------------------
  nl: {
    account: {
      title: "Je account",
      loggedInAs: "Ingelogd als:",
      status: {
        label: "Status",
        loggedIn: "Ingelogd",
      },
      tokens: {
        label: "Je tokens",
        loading: "… laden",
      },
      info: {
        freegate:
          "Je bent ingelogd en gebruikt je token-saldo. FreeGate geldt alleen voor anonieme gebruikers.",
      },
      button: {
        logout: "Uitloggen",
      },
      email: {
        unknown: "Onbekend e-mailadres",
      },
      aria: {
        dialogLabel: "Accountpaneel",
      },
    },
  },

  // --------------------------------------
  // RUSSIAN — РУССКИЙ
  // --------------------------------------
  ru: {
    account: {
      title: "Ваш аккаунт",
      loggedInAs: "Вы вошли как:",
      status: {
        label: "Статус",
        loggedIn: "В системе",
      },
      tokens: {
        label: "Ваши токены",
        loading: "… загрузка",
      },
      info: {
        freegate:
          "Вы вошли в систему и используете свой токен-счёт. FreeGate действует только для анонимных пользователей.",
      },
      button: {
        logout: "Выйти",
      },
      email: {
        unknown: "Неизвестный e-mail",
      },
      aria: {
        dialogLabel: "Панель аккаунта",
      },
    },
  },

  // --------------------------------------
  // CHINESE (Simplified) — 简体中文
  // --------------------------------------
  zh: {
    account: {
      title: "你的账户",
      loggedInAs: "登录邮箱：",
      status: {
        label: "状态",
        loggedIn: "已登录",
      },
      tokens: {
        label: "你的代币",
        loading: "… 加载中",
      },
      info: {
        freegate:
          "你已登录并正在使用代币账户。FreeGate 仅适用于匿名用户。",
      },
      button: {
        logout: "退出登录",
      },
      email: {
        unknown: "未知邮箱",
      },
      aria: {
        dialogLabel: "账户面板",
      },
    },
  },

  // --------------------------------------
  // JAPANESE — 日本語
  // --------------------------------------
  ja: {
    account: {
      title: "あなたのアカウント",
      loggedInAs: "ログイン中のメール:",
      status: {
        label: "ステータス",
        loggedIn: "ログイン済み",
      },
      tokens: {
        label: "あなたのトークン",
        loading: "… 読み込み中",
      },
      info: {
        freegate:
          "あなたはログインしてトークン残高を使用しています。FreeGate は匿名ユーザーにのみ適用されます。",
      },
      button: {
        logout: "ログアウト",
      },
      email: {
        unknown: "不明なメール",
      },
      aria: {
        dialogLabel: "アカウントパネル",
      },
    },
  },

  // --------------------------------------
  // KOREAN — 한국어
  // --------------------------------------
  ko: {
    account: {
      title: "내 계정",
      loggedInAs: "로그인 이메일:",
      status: {
        label: "상태",
        loggedIn: "로그인됨",
      },
      tokens: {
        label: "내 토큰",
        loading: "… 불러오는 중",
      },
      info: {
        freegate:
          "현재 로그인되어 토큰 잔액을 사용 중입니다. FreeGate는 익명 사용자에게만 적용됩니다.",
      },
      button: {
        logout: "로그아웃",
      },
      email: {
        unknown: "알 수 없는 이메일",
      },
      aria: {
        dialogLabel: "계정 패널",
      },
    },
  },

  // --------------------------------------
  // ARABIC — العربية (RTL-ready)
  // --------------------------------------
  ar: {
    account: {
      title: "حسابك",
      loggedInAs: "مسجّل الدخول باسم:",
      status: {
        label: "الحالة",
        loggedIn: "مسجّل الدخول",
      },
      tokens: {
        label: "رموزك",
        loading: "… جارٍ التحميل",
      },
      info: {
        freegate:
          "أنت مسجّل الدخول وتستخدم رصيد الرموز الخاص بك. ينطبق FreeGate فقط على المستخدمين المجهولين.",
      },
      button: {
        logout: "تسجيل الخروج",
      },
      email: {
        unknown: "بريد إلكتروني غير معروف",
      },
      aria: {
        dialogLabel: "لوحة الحساب",
      },
    },
  },

  // --------------------------------------
  // HINDI — हिन्दी
  // --------------------------------------
  hi: {
    account: {
      title: "आपका अकाउंट",
      loggedInAs: "लॉगिन ईमेल:",
      status: {
        label: "स्थिति",
        loggedIn: "लॉगिन है",
      },
      tokens: {
        label: "आपके टोकन",
        loading: "… लोड हो रहा है",
      },
      info: {
        freegate:
          "आप लॉगिन हैं और अपना टोकन-खाता उपयोग कर रहे हैं। FreeGate केवल गुमनाम उपयोगकर्ताओं पर लागू होता है।",
      },
      button: {
        logout: "लॉगआउट",
      },
      email: {
        unknown: "अज्ञात ई-मेल",
      },
      aria: {
        dialogLabel: "अकाउंट पैनल",
      },
    },
  },
} satisfies Record<string, AccountLocale>;

// Alias wie bei i18n.navigation.ts
export const dict = i18nAccountPanel;
