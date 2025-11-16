// lib/i18n.security.ts (Inhaltsvorschlag)

export const security = {
  en: {
    // Section Header
    kicker: "SECURITY BY DESIGN",
    title: "Your Digital Safety Layers",
    intro:
      "See how m-pathy protects your conversations — emotionally, technically and cryptographically, always under your control.",

    // Gemeinsames CTA-Label (wird per i18n angezeigt)
    cta_label: "Ask Digital Security Expert",

    // Vier Sicherheits-Felder
    cards: {
      emotional: {
        title: "Emotional Security",
        body:
          "m-pathy protects your emotional state: no judgment, no pressure, and automatic CALM mode when overload is detected. Your space stays steady, gentle and safe.",
        prefill:
          "@Digital Security Expert: tell me everything about emotional security on m-pathy.ai."
      },

      local_only: {
        title: "Local-Only Conversations",
        body:
          "m-pathy stores no chats or personal data on servers. Everything stays on your device — invisible to us and fully under your control.",
        prefill:
          "@Digital Security Expert: tell me about m-pathy.ai and no server-side storage."
      },

      deletion: {
        title: "Total Deletion Control",
        body:
          "You can delete any thread at any time. Deletion is final: no copies, no shadows, no backups. Your data disappears completely.",
        prefill:
          "@Digital Security Expert: tell me about deletability and the “forever mutable” principle on m-pathy.ai."
      },

      triketon: {
        title: "Triketon Encryption",
        body:
          "Triketon seals your actions with triple-256 hashing and a dynamic salt of time, page and context parameters. It ensures integrity, authenticity and tamper-proof proof of origin.",
        prefill:
          "@Digital Security Expert: tell me about Triketon on m-pathy.ai."
      }
    }
  },

  // Platzhalter für weitere Sprachen – füllst du später
  de: {
    kicker: "",
    title: "",
    intro: "",
    cta_label: "",
    cards: {
      emotional: { title: "", body: "", prefill: "" },
      local_only: { title: "", body: "", prefill: "" },
      deletion: { title: "", body: "", prefill: "" },
      triketon: { title: "", body: "", prefill: "" }
    }
  },

  fr: { /* same structure, empty for now */ },
  es: { /* … */ },
  it: { /* … */ },
  pt: { /* … */ },
  nl: { /* … */ },
  ru: { /* … */ },
  zh: { /* … */ },
  ja: { /* … */ },
  ko: { /* … */ },
  ar: { /* … */ },
  hi: { /* … */ }
};
