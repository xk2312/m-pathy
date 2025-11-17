// lib/i18n.navigation.ts
// GPTM-Galaxy+ · Navigation i18n (V1)
// Domain: NUR Navigationstexte (keine Hero/CTA/Security/etc.)

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

export type NavLocale = {
  nav: {
    links: NavLinks;
    language: NavLanguage;
    aria: NavAria;
  };
};

// Hinweis:
// - Step 01: nur EN befüllt.
// - Step 02: alle 13 Sprachen ergänzen (gleiche Struktur, gleiche Keys).
// - Zugriff (später in navigation.tsx / LanguageSwitcher):
//     import { dict as navDict } from "@/lib/i18n.navigation";
//     const locale = navDict[lang] ?? navDict.en;

export const dict: { [lang: string]: NavLocale } = {
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
    },
  },

  de: {
    nav: {
      links: {
        subscription: "Subscription",
        chat: "Chat",
        account: "Konto",
      },
      language: {
        label: "Sprache",
        select_label: "Sprache auswählen",
        dropdown_label: "Sprachauswahl öffnen",
      },
      aria: {
        menu: "Hauptnavigation",
        language: "Sprache ändern",
      },
    },
  },

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
        dropdown_label: "Ouvrir la sélection de la langue",
      },
      aria: {
        menu: "Navigation principale",
        language: "Changer de langue",
      },
    },
  },

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
    },
  },

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
        dropdown_label: "Apri selezione lingua",
      },
      aria: {
        menu: "Navigazione principale",
        language: "Cambia lingua",
      },
    },
  },

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
        language: "Mudar idioma",
      },
    },
  },

  nl: {
    nav: {
      links: {
        subscription: "Abonnement",
        chat: "Chat",
        account: "Account",
      },
      language: {
        label: "Taal",
        select_label: "Selecteer taal",
        dropdown_label: "Taalkeuze openen",
      },
      aria: {
        menu: "Hoofdnavigatie",
        language: "Taal wijzigen",
      },
    },
  },

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
    },
  },

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
        language: "更改语言",
      },
    },
  },

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
    },
  },

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
    },
  },

  ar: {
    nav: {
      links: {
        subscription: "الاشتراك",
        chat: "الدردشة",
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
    },
  },

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
    },
  },
};
