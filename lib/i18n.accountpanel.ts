// ===============================================
// i18n.accountpanel.ts - 13 languages
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
  // ENGLISH - MASTER
  // --------------------------------------
  en: {
  account: {
    title: "Workspace status",
    loggedInAs: "Workspace secured for:",
    status: {
      label: "Workspace status",
      loggedIn: "Active",
    },
    tokens: {
      label: "Available reasoning capacity",
      loading: "... loading",
    },
    info: {
      freegate:
        "You are working in authenticated mode. Usage is tracked against your available reasoning capacity.",
    },
    button: {
      logout: "Sign out",
    },
    email: {
      unknown: "Unknown email",
    },
    aria: {
      dialogLabel: "Workspace status panel",
    },
  },
},

  // --------------------------------------
// GERMAN - DEUTSCH
// --------------------------------------
de: {
  account: {
    title: "Arbeitsbereich-Status",
    loggedInAs: "Arbeitsbereich gesichert für:",
    status: {
      label: "Arbeitsbereich-Status",
      loggedIn: "Aktiv",
    },
    tokens: {
      label: "Verfügbare Reasoning-Kapazität",
      loading: "… lädt",
    },
    info: {
      freegate:
        "Du arbeitest im authentifizierten Modus. Die Nutzung wird gegen deine verfügbare Reasoning-Kapazität erfasst.",
    },
    button: {
      logout: "Abmelden",
    },
    email: {
      unknown: "Unbekannte E-Mail",
    },
    aria: {
      dialogLabel: "Arbeitsbereich-Status",
    },
  },
},

// --------------------------------------
// FRENCH - FRANÇAIS
// --------------------------------------
fr: {
  account: {
    title: "Statut de l’espace de travail",
    loggedInAs: "Espace de travail sécurisé pour :",
    status: {
      label: "Statut de l’espace de travail",
      loggedIn: "Actif",
    },
    tokens: {
      label: "Capacité de raisonnement disponible",
      loading: "… chargement",
    },
    info: {
      freegate:
        "Vous travaillez en mode authentifié. L’utilisation est comptabilisée par rapport à votre capacité de raisonnement disponible.",
    },
    button: {
      logout: "Se déconnecter",
    },
    email: {
      unknown: "Adresse e-mail inconnue",
    },
    aria: {
      dialogLabel: "Panneau de statut de l’espace de travail",
    },
  },
},

// --------------------------------------
// SPANISH - ESPAÑOL
// --------------------------------------
es: {
  account: {
    title: "Estado del espacio de trabajo",
    loggedInAs: "Espacio de trabajo asegurado para:",
    status: {
      label: "Estado del espacio de trabajo",
      loggedIn: "Activo",
    },
    tokens: {
      label: "Capacidad de razonamiento disponible",
      loading: "… cargando",
    },
    info: {
      freegate:
        "Estás trabajando en modo autenticado. El uso se registra en función de tu capacidad de razonamiento disponible.",
    },
    button: {
      logout: "Cerrar sesión",
    },
    email: {
      unknown: "Correo electrónico desconocido",
    },
    aria: {
      dialogLabel: "Panel de estado del espacio de trabajo",
    },
  },
},

// --------------------------------------
// ITALIAN - ITALIANO
// --------------------------------------
it: {
  account: {
    title: "Stato dello spazio di lavoro",
    loggedInAs: "Spazio di lavoro protetto per:",
    status: {
      label: "Stato dello spazio di lavoro",
      loggedIn: "Attivo",
    },
    tokens: {
      label: "Capacità di ragionamento disponibile",
      loading: "… caricamento",
    },
    info: {
      freegate:
        "Stai lavorando in modalità autenticata. L’utilizzo viene registrato rispetto alla capacità di ragionamento disponibile.",
    },
    button: {
      logout: "Disconnetti",
    },
    email: {
      unknown: "Email sconosciuta",
    },
    aria: {
      dialogLabel: "Pannello stato spazio di lavoro",
    },
  },
},

// --------------------------------------
// PORTUGUESE - PORTUGUÊS
// --------------------------------------
pt: {
  account: {
    title: "Estado do espaço de trabalho",
    loggedInAs: "Espaço de trabalho protegido para:",
    status: {
      label: "Estado do espaço de trabalho",
      loggedIn: "Ativo",
    },
    tokens: {
      label: "Capacidade de raciocínio disponível",
      loading: "… carregando",
    },
    info: {
      freegate:
        "Você está trabalhando em modo autenticado. O uso é contabilizado em relação à capacidade de raciocínio disponível.",
    },
    button: {
      logout: "Terminar sessão",
    },
    email: {
      unknown: "Email desconhecido",
    },
    aria: {
      dialogLabel: "Painel de estado do espaço de trabalho",
    },
  },
},

// --------------------------------------
// DUTCH - NEDERLANDS
// --------------------------------------
nl: {
  account: {
    title: "Werkruimte-status",
    loggedInAs: "Werkruimte beveiligd voor:",
    status: {
      label: "Werkruimte-status",
      loggedIn: "Actief",
    },
    tokens: {
      label: "Beschikbare redeneercapaciteit",
      loading: "… laden",
    },
    info: {
      freegate:
        "Je werkt in geauthenticeerde modus. Het gebruik wordt bijgehouden ten opzichte van je beschikbare redeneercapaciteit.",
    },
    button: {
      logout: "Afmelden",
    },
    email: {
      unknown: "Onbekend e-mailadres",
    },
    aria: {
      dialogLabel: "Werkruimte-statuspaneel",
    },
  },
},

// --------------------------------------
// RUSSIAN - РУССКИЙ
// --------------------------------------
ru: {
  account: {
    title: "Статус рабочего пространства",
    loggedInAs: "Рабочее пространство защищено для:",
    status: {
      label: "Статус рабочего пространства",
      loggedIn: "Активно",
    },
    tokens: {
      label: "Доступная вычислительная ёмкость мышления",
      loading: "… загрузка",
    },
    info: {
      freegate:
        "Вы работаете в аутентифицированном режиме. Использование учитывается относительно доступной вычислительной ёмкости мышления.",
    },
    button: {
      logout: "Выйти",
    },
    email: {
      unknown: "Неизвестный адрес электронной почты",
    },
    aria: {
      dialogLabel: "Панель статуса рабочего пространства",
    },
  },
},

// --------------------------------------
// CHINESE - 简体中文
// --------------------------------------
zh: {
  account: {
    title: "工作空间状态",
    loggedInAs: "工作空间已为以下账户保护：",
    status: {
      label: "工作空间状态",
      loggedIn: "活跃",
    },
    tokens: {
      label: "可用推理容量",
      loading: "… 加载中",
    },
    info: {
      freegate:
        "你正在以已验证模式工作。使用情况将根据可用推理容量进行记录。",
    },
    button: {
      logout: "退出登录",
    },
    email: {
      unknown: "未知邮箱",
    },
    aria: {
      dialogLabel: "工作空间状态面板",
    },
  },
},

// --------------------------------------
// JAPANESE - 日本語
// --------------------------------------
ja: {
  account: {
    title: "ワークスペースの状態",
    loggedInAs: "ワークスペースが保護されています：",
    status: {
      label: "ワークスペースの状態",
      loggedIn: "有効",
    },
    tokens: {
      label: "利用可能な推論容量",
      loading: "… 読み込み中",
    },
    info: {
      freegate:
        "認証済みモードで作業しています。使用量は利用可能な推論容量に基づいて記録されます。",
    },
    button: {
      logout: "サインアウト",
    },
    email: {
      unknown: "不明なメールアドレス",
    },
    aria: {
      dialogLabel: "ワークスペース状態パネル",
    },
  },
},

// --------------------------------------
// KOREAN - 한국어
// --------------------------------------
ko: {
  account: {
    title: "작업 공간 상태",
    loggedInAs: "작업 공간이 보호된 계정:",
    status: {
      label: "작업 공간 상태",
      loggedIn: "활성",
    },
    tokens: {
      label: "사용 가능한 추론 용량",
      loading: "… 로딩 중",
    },
    info: {
      freegate:
        "인증된 모드로 작업 중입니다. 사용량은 사용 가능한 추론 용량을 기준으로 기록됩니다.",
    },
    button: {
      logout: "로그아웃",
    },
    email: {
      unknown: "알 수 없는 이메일",
    },
    aria: {
      dialogLabel: "작업 공간 상태 패널",
    },
  },
},

// --------------------------------------
// ARABIC - العربية
// --------------------------------------
ar: {
  account: {
    title: "حالة مساحة العمل",
    loggedInAs: "تم تأمين مساحة العمل لـ:",
    status: {
      label: "حالة مساحة العمل",
      loggedIn: "نشط",
    },
    tokens: {
      label: "سعة التفكير المتاحة",
      loading: "… جارٍ التحميل",
    },
    info: {
      freegate:
        "أنت تعمل في وضع مصادق عليه. يتم تتبع الاستخدام بناءً على سعة التفكير المتاحة.",
    },
    button: {
      logout: "تسجيل الخروج",
    },
    email: {
      unknown: "بريد إلكتروني غير معروف",
    },
    aria: {
      dialogLabel: "لوحة حالة مساحة العمل",
    },
  },
},

// --------------------------------------
// HINDI - हिन्दी
// --------------------------------------
hi: {
  account: {
    title: "वर्कस्पेस स्थिति",
    loggedInAs: "वर्कस्पेस सुरक्षित है:",
    status: {
      label: "वर्कस्पेस स्थिति",
      loggedIn: "सक्रिय",
    },
    tokens: {
      label: "उपलब्ध तर्क क्षमता",
      loading: "… लोड हो रहा है",
    },
    info: {
      freegate:
        "आप प्रमाणित मोड में कार्य कर रहे हैं। उपयोग को उपलब्ध तर्क क्षमता के आधार पर ट्रैक किया जाता है।",
    },
    button: {
      logout: "साइन आउट",
    },
    email: {
      unknown: "अज्ञात ईमेल",
    },
    aria: {
      dialogLabel: "वर्कस्पेस स्थिति पैनल",
    },
  },
},

} satisfies Record<string, AccountLocale>;

// Alias wie bei i18n.navigation.ts
export const dict = i18nAccountPanel;
