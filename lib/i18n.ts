/*** =======================================================================
 *  INVENTUS INDEX - lib/i18n.ts
 *  Screening · Struktur · Sprach-Hotspots
 * ======================================================================= 
 *
 *  [ANCHOR:0]  IMPORTS  
 *              – Anbauten (PowerPrompts/Hero/KPI/Testimonials) an i18n
 *              – Potenzielles Drift-Risiko durch Mischen zweier i18n-Welten
 *
 *  [ANCHOR:1]  TYPEN 
 *              – Dict = Record<string,string>
 *              – Chat-System arbeitet rein string-basiert (Legacy)
 *
 *  [ANCHOR:2]  LEGACY-UI-DICTS (13 Sprachen) 
 *              – Grundlage des Chat-/Säulen-Systems
 *              – Subscription nutzt dieses System NICHT
 *
 *  [ANCHOR:3]  DICTS (Legacy)  
 *              – Einziger Sprachspeicher für Chat & Säule
 *              – Wenn currentLocale nicht passt → Fallback EN
 *
 *  [ANCHOR:4]  PROMPT-ATTACH (Legacy)
 *              – attachPrompts(DICTS)
 *              – Prompt-Felder werden dynamisch angehängt
 *
 *  [ANCHOR:5]  LOCALE-TYPE  
 *              – Locale = string (ungebunden)
 *              – Erlaubt Werte außerhalb von DICTS → potenzieller Drift
 *
 *  [ANCHOR:6]  STORAGE_KEY  
 *              – “mpathy:locale”
 *              – Wenn EXPLICIT im localStorage gesetzt → Chat locked auf EN
 *
 *  [ANCHOR:7]  toBase()  
 *              – Entfernt Regionen wie “de-DE” → “de”
 *
 *  [ANCHOR:8]  UX_LOCALES & isSupported()  
 *              – UX_LOCALES wird erst später gesetzt
 *              – detectInitialLocale nutzt sie zu früh → EN-Fixierung möglich
 *
 *  [ANCHOR:9]  negotiateLocaleFromBrowser()  
 *              – Browser-Sprachen → Locale
 *              – Drift möglich zwischen Chat/Subscription
 *
 *  [ANCHOR:10] detectInitialLocale()  
 *              – Erst localStorage, dann Browser, dann EN
 *              – Subscription ruft das NIE → getrennte Welten
 *
 *  [ANCHOR:11] currentLocale (GLOBAL)  
 *              – Single Source of Truth für Chat-System
 *              – Subscription hat eigenen LanguageProvider → Drift
 *
 *  [ANCHOR:12] getLocale()
 *              – Gibt CURRENT Chat-Locale zurück
 *
 *  [ANCHOR:13] setLocale(locale)
 *              – Setzt Locale global
 *              – Speichert in localStorage
 *              – Feuert Events: mpathy:i18n:change / explicit
 *              – Subscription reagiert NICHT auf diese Events
 *
 *  [ANCHOR:14] t(key)
 *              – MISCHLOGIK:
 *                ui = DICTS[currentLocale]
 *                ux = dict[currentLocale]
 *                → Chat + Subscription-Keys gemischt
 *              – Drift-Hotspot Nr. 1
 *
 *  [ANCHOR:15] tr(key)
 *              – fallback + Key-Erweiterung
 *
 *  [ANCHOR:16] availableLocales
 *              – Keys aus DICTS (Legacy)
 *              – Subscription-Dict wird hier NICHT berücksichtigt
 *
 *  [ANCHOR:17] attachLocaleWatchers()
 *              – Listener auf <html lang> & languagechange
 *              – Subscription schreibt <html lang> manuell → Drift possible
 *
 *  [ANCHOR:18] AUTO-INITIALIZATION (Client)
 *              – Setzt <html lang> automatisch basierend auf Browser
 *              – Kann Locale überschreiben, bevor Switcher setzt
 *
 *  [ANCHOR:19] SUBSCRIPTION/UX-DICT (dict)
 *              – Volles zweites i18n-System (13 Sprachen)
 *              – Hero/KPI/Testimonials/PowerPrompts/Prompts angehängt
 *              – UX_LOCALES = Object.keys(dict)
 *              – Subscription nutzt dieses System unabhängig vom Legacy-System
 *
 * ======================================================================= 
 *  ERKENNBARER FEHLERZU­SAMMENHANG (Inventur)
 * 
 *  1) Chat bleibt auf EN:
 *     – Chat hängt ausschließlich an DICTS + currentLocale
 *     – detectInitialLocale + Browser-negotiation + EXPLICIT-Flag können Locale
 *       auf EN locken, trotz Switcher → Drift
 *
 *  2) Subscription übersetzt nur Navi:
 *     – Subscription nutzt dict + LanguageProvider
 *     – Nur Navigation nutzt setLang()
 *     – Rest der Subscription liest ggf. dict[locale], DE aber getLocale nie
 *       → zweite Sprachnorm, entkoppelt vom Chat
 *
 * ======================================================================= */


import { attachPowerPrompts } from "./i18n.powerprompt";
import { attachHero } from "./i18n.hero";
import { attachKpi } from "./i18n.kpi";
import { attachTestimonials } from "./i18n.testimonial";
import { attachPrompts } from "./i18n.prompts";
import { attachDoorman } from "./i18n.doorman";
import { i18nArchive } from "@/lib/i18n.archive";


type Dict = Record<string, string>;

/** English dictionary (source of truth for keys) */
const en = {
  // Input / messaging
  writeMessage: "Write a message…",
  send: "Send",

  // Input helpers
  tools: "Tools",
  newline: "New line",
  comingUpload: "Upload",
  comingVoice: "Voice",
  comingFunctions: "Options",

  // Overlay header / buttons (mobile)
  close: "Close",

  // Sidebar / Column
  columnTitle: "Column",
  sectionControl: "Controls",
  onboarding: "ONBOARDING",
  mDefault: "M · Default",
  selectMode: "Choose mode",
  council13: "COUNCIL13",
  selectAI: "Choose AI",
  modules: "Modules",
  coming: "Coming",

  // Sidebar additions (experts & CTA)
  selectExpert: "Choose expert",
  statusExpert: "Expert:",
  clearChat: "Clear chat",
  startBuilding: "build",
  startBuildingMsg:
"Give me 13 examples for each category that demonstrate your building capabilities. Use the sector of children's toys for kids aged 2–6, for kids aged 6–12, and for men aged 30 and above, and show them in a table.",

  // Actions / footer
  export: "Export",
  levels: "Levels",
  levelsComing: "Levels coming soon",
  threadExported: "Thread exported.",

  // Status bar
  statusMode: "Mode:",
  statusAgent: "Agent:",

  // Backward-compat alias (if some code still uses statusAI)
  statusAI: "Agent:",

  // Status texts
  "status.modeSet": "Mode set: {label}.",

  // Modes – system buttons
  "mode.onboarding": "ONBOARDING",
  "mode.council": "COUNCIL13",
  "mode.default": "M · Default",
  "mode.select": "Choose mode",

  // Modes – character modes (11)
  "mode.research": "RESEARCH",
  "mode.calm": "CALM",
  "mode.flow": "FLOW",
  "mode.truth": "TRUTH",
  "mode.wisdom": "WISDOM",
  "mode.play": "PLAY",
  "mode.vision": "VISION",
  "mode.empathy": "EMPATHY",
  "mode.love": "LOVE",
  "mode.joy": "JOY",
  "mode.oracle": "ORACLE",

  // Modes – categories
  "labels.modes.character": "Character modes",
  "modes.category.core": "CORE",
  "modes.category.intellectual": "INTELLECTUAL",
  "modes.category.creator": "CREATOR",
  "modes.category.heart": "HEART",
  "modes.category.spirit": "SPIRIT",

  // Experts (used by Saeule.tsx)
  "experts.title": "Experts",
  "experts.choose": "Choose expert",

  // Expert categories (pillar – Experts tabs)
  "experts.category.life": "Life",
  "experts.category.tech": "Tech",
  "experts.category.space": "Space",
  "experts.category.ethics": "Ethics",
  "experts.category.universe": "Universe",

  // Expert labels (pillar – Experts list)
  "experts.biologist": "Biologist",
  "experts.chemist": "Chemist",
  "experts.physicist": "Physicist",
  "experts.computer_scientist": "Computer Scientist",
  "experts.jurist": "Jurist",
  "experts.architect_civil_engineer": "Architect / Civil Engineer",
  "experts.landscape_designer": "Landscape Designer",
  "experts.interior_designer": "Interior Designer",
  "experts.electrical_engineer": "Electrical Engineer",
  "experts.mathematician": "Mathematician",
  "experts.astrologer": "Astrologer",
  "experts.weather_expert": "Weather Expert",
  "experts.molecular_scientist": "Molecular Scientist",

  // CTA fallback
  "cta.fallback":
    "All set - tell me what you want to build (app, flow, feature …).",

  // CTA labels (Säule header button etc.)
  "cta.build": "Build",
  "cta.export": "Export",
  "cta.clear": "Clear chat",

  // Golden Conversion (system messages)
  gc_warning_last_free_message: "You have 1 free message left. After that you will be redirected to checkout.",
  gc_payment_success_title: "Payment successful!",
  gc_payment_success_body: "Your tokens have been updated. Enjoy continuing your chat.",
  gc_payment_success_button: "OK",
  gc_please_login_to_continue: "Please log in to continue.",
  gc_overdraw_title: "Your balance is depleted.",
  gc_overdraw_body: "This message would have pushed your account into the negative. We covered the difference for you as a courtesy. Please top up to continue chatting.",
  gc_freegate_limit_reached: "You have used all 9 free messages.",
  gc_freegate_login_required: "Please log in to continue.",
  "chat.tokens.depleted_title": "Your balance is empty.",
  "chat.tokens.depleted_message": "You’ll now be redirected to the payment page to buy new tokens.",
  "chat.tokens.depleted_redirect_label": "Buy tokens now",
  "support.button.label": "Support",
  "support.mail.subject": "Support request: \"please fill in\"",
  "support.mail.body": "Please describe your request as clearly and briefly as possible.",
// --- Triketon2048 --------------------------------------------------

"triketon.button.label": "Triketon2048",
"triketon.button.tooltip": "Verified · Proof of Truth",

"triketon.overlay.title": "Triketon2048 - Verified Response",

"triketon.overlay.intro":
"This response has been cryptographically sealed. Its authenticity can be verified at any time.",

"triketon.overlay.explainer":
"We do not store the content of this response on our servers. Only a mathematical proof of its integrity is stored - never the text itself.",

"triketon.overlay.ownership":
"Your words belong to you. Only you have access to the full content.",

"triketon.overlay.data.title": "Verification Data",

"triketon.overlay.data.public_key": "Public Key",
"triketon.overlay.data.truth_hash": "Truth Hash",
"triketon.overlay.data.timestamp": "Timestamp",

"triketon.overlay.footer":
"Triketon2048 is not a feature. It is a promise.",

"triketon.overlay.usecases.title": "Why this matters",

// --- Use Case: Researcher ------------------------------------------

"triketon.usecase.researcher.title": "For Researchers",

"triketon.usecase.researcher.body":
"As a researcher, you may need to prove that a hypothesis, insight, or result existed at a specific point in time - without publishing or revealing your work prematurely. Triketon allows you to establish priority and integrity without disclosure.",

// --- Use Case: Inventor -------------------------------------------

"triketon.usecase.inventor.title": "For Inventors",

"triketon.usecase.inventor.body":
"As an inventor, you may want to prove that an idea originated with you - without exposing it before you are ready. Triketon lets you seal ideas, not hide them, and prove authorship without loss of control.",

// --- Use Case: Creative -------------------------------------------

"triketon.usecase.creative.title": "For Creators",

"triketon.usecase.creative.body":
"As a creator, you may want certainty that your words are yours - even when shared digitally. Triketon provides proof of authorship without watermarks, platforms, or ownership transfer.",

// --- Universal Closing --------------------------------------------

"triketon.overlay.closing":
"Proof without possession. Verification without surveillance.",


  // Pillar sections (Smooth Operator)
  "pillar.section.header": "Modes & experts header",
  "pillar.section.modesTitle": "MODES",

  "pillar.section.modes": "Modes",
  "pillar.section.experts": "Experts",
  "pillar.section.systemTitle": "SYSTEM",
  "pillar.section.system": "System status",
  "pillar.section.actionsTitle": "NEW CHAT",
  "pillar.section.utility": "Actions & export",
  "pillar.section.archiveTitle": "ARCHIVE",


  // Actions (export / delete)
  "actions.export.title": "Export chat",
  "actions.export.help": "Save your chat as a file.",
  "actions.export.csv": "CSV",
  "actions.export.json": "JSON",

  "actions.delete.title": "Delete chat",
  "actions.delete.warning":
    "This deletes the entire chat forever. Choose CSV or JSON to archive the chat locally.",
  "actions.delete.now": "DELETE",

  // ARIA for actions
  exportCsvAria: "Export thread as CSV",
  exportJsonAria: "Export thread as JSON",
  clearChatAria: "Clear chat",

  // ARIA / A11y (chat + column)
  conversationAria: "Chat log",
  assistantSays: "Assistant message",
  youSaid: "Your message",
  columnAria: "Column - Controls & Selection",
  mobileOverlayLabel: "Mobile column overlay",
} as const;

const de = {
  // Input / messaging
  writeMessage: "Nachricht schreiben…",
  send: "Senden",

  // Input helpers
  tools: "Werkzeuge",
  newline: "Neue Zeile",
  comingUpload: "Upload",
  comingVoice: "Spracheingabe",
  comingFunctions: "Optionen",

  // Overlay header / buttons (mobile)
  close: "Schließen",

  // Sidebar / Column
  columnTitle: "Seitenleiste",
  sectionControl: "Steuerung",
  onboarding: "Einstieg",
  mDefault: "M · Standard",
  selectMode: "Modus wählen",
  council13: "Rat der 13",
  selectAI: "KI wählen",
  modules: "Module",
  coming: "Bald verfügbar",

  // Sidebar additions (experts & CTA)
  selectExpert: "Experten wählen",
  statusExpert: "Experte:",
  clearChat: "Chat löschen",
  startBuilding: "Bauen starten",
  startBuildingMsg:
  "Gib mir jeweils 13 Beispiele, die deine Baufähigkeiten zeigen. Nimm den Sektor Kinderspielzeug für 2-6 jährige Kinder, für 6-12 jährige Kinder und für Männer ab 30 und zeig mir eine Tabelle.",

  // Actions / footer
  export: "Exportieren",
  levels: "Level",
  levelsComing: "Level folgen in Kürze",
  threadExported: "Chat exportiert.",

  // Status bar
  statusMode: "Modus:",
  statusAgent: "Agent:",

  // Backward-compat alias
  statusAI: "Agent:",

  // Status texts
  "status.modeSet": "Modus gesetzt: {label}.",

  // Modes – system buttons
  "mode.onboarding": "Einstieg",
  "mode.council": "Rat der 13",
  "mode.default": "M · Standard",
  "mode.select": "Modus wählen",

  // Modes – character modes (11)
  "mode.research": "Forschung",
  "mode.calm": "Ruhe",
  "mode.flow": "Flow",
  "mode.truth": "Wahrheit",
  "mode.wisdom": "Weisheit",
  "mode.play": "Spiel",
  "mode.vision": "Vision",
  "mode.empathy": "Empathie",
  "mode.love": "Liebe",
  "mode.joy": "Freude",
  "mode.oracle": "Orakel",

  // Modes – categories
  "labels.modes.character": "Charakter-Modi",
  "modes.category.core": "Kern",
  "modes.category.intellectual": "Intellekt",
  "modes.category.creator": "Kreator",
  "modes.category.heart": "Herz",
  "modes.category.spirit": "Geist",

  // Experts (used by Saeule.tsx)
  "experts.title": "Experten",
  "experts.choose": "Experten wählen",

  // Expert categories
  "experts.category.life": "Leben",
  "experts.category.tech": "Technik",
  "experts.category.space": "Weltraum",
  "experts.category.ethics": "Ethik",
  "experts.category.universe": "Universum",

  // Expert labels
  "experts.biologist": "Biologe",
  "experts.chemist": "Chemiker",
  "experts.physicist": "Physiker",
  "experts.computer_scientist": "Informatiker",
  "experts.jurist": "Jurist",
  "experts.architect_civil_engineer": "Architekt / Bauingenieur",
  "experts.landscape_designer": "Landschaftsdesigner",
  "experts.interior_designer": "Innenarchitekt",
  "experts.electrical_engineer": "Elektroingenieur",
  "experts.mathematician": "Mathematiker",
  "experts.astrologer": "Astrologe",
  "experts.weather_expert": "Wetterexperte",
  "experts.molecular_scientist": "Molekularwissenschaftler",

   // CTA fallback
  "cta.fallback":
    "Alles bereit – sag mir, was du bauen möchtest (App, Flow, Feature …).",

  // CTA labels
  "cta.build": "Bauen",
  "cta.export": "Exportieren",
  "cta.clear": "Chat löschen",

  // Golden Conversion (System-Meldungen)
  gc_warning_last_free_message:
    "Du hast noch 1 freie Nachricht. Danach wirst du zum Checkout weitergeleitet.",
  gc_payment_success_title: "Zahlung erfolgreich!",
  gc_payment_success_body:
    "Deine Tokens wurden aktualisiert. Viel Freude beim Weiterchatten.",
  gc_payment_success_button: "OK",
  gc_please_login_to_continue: "Bitte einloggen, um fortzufahren.",
  gc_overdraw_title: "Dein Guthaben ist aufgebraucht.",
  gc_overdraw_body: "Diese Nachricht hätte dein Konto ins Minus gezogen. Wir haben den Betrag aus Kulanz für dich ausgeglichen. Bitte lade dein Guthaben auf, um weiter zu chatten.",
  gc_freegate_limit_reached: "Du hast alle 9 kostenlosen Nachrichten verbraucht.",
  gc_freegate_login_required: "Bitte logge dich ein, um fortzufahren.",
  "chat.tokens.depleted_title": "Dein Guthaben ist leer.",
  "chat.tokens.depleted_message": "Du wirst jetzt zur Zahlungsseite weitergeleitet, um neue Tokens zu kaufen.",
  "chat.tokens.depleted_redirect_label": "Jetzt Tokens kaufen",
  "support.button.label": "Support",
  "support.mail.subject": "Supportanliegen: \"bitte eintragen\"",
  "support.mail.body": "Bitte schildern Sie Ihr Anliegen so klar und kurz wie möglich.",
"triketon.button.label": "Triketon2048",
"triketon.button.tooltip": "Verifiziert · Wahrheitsbeweis",

"triketon.overlay.title": "Triketon2048 - Verifizierte Antwort",

"triketon.overlay.intro":
"Diese Antwort wurde kryptografisch versiegelt. Ihre Echtheit kann jederzeit überprüft werden.",

"triketon.overlay.explainer":
"Wir speichern den Inhalt dieser Antwort nicht auf unseren Servern. Gespeichert wird ausschließlich ein mathematischer Beweis ihrer Unverändertheit - niemals der Text selbst.",

"triketon.overlay.ownership":
"Deine Worte gehören dir. Nur du hast Zugriff auf den vollständigen Inhalt.",

"triketon.overlay.data.title": "Verifikationsdaten",

"triketon.overlay.data.public_key": "Public Key",
"triketon.overlay.data.truth_hash": "Truth Hash",
"triketon.overlay.data.timestamp": "Zeitstempel",

"triketon.overlay.footer":
"Triketon2048 ist kein Feature. Es ist ein Versprechen.",

"triketon.overlay.usecases.title": "Warum das wichtig ist",

"triketon.usecase.researcher.title": "Für Forschende",
"triketon.usecase.researcher.body":
"Als Forschende möchtest du nachweisen können, dass eine Hypothese, Erkenntnis oder ein Ergebnis zu einem bestimmten Zeitpunkt existierte - ohne deine Arbeit vorzeitig zu veröffentlichen oder offenzulegen. Triketon ermöglicht Prioritätsnachweise ohne Offenlegung.",

"triketon.usecase.inventor.title": "Für Erfinder:innen",
"triketon.usecase.inventor.body":
"Als Erfinder:in möchtest du belegen können, dass eine Idee von dir stammt - ohne sie preiszugeben, bevor du dazu bereit bist. Triketon versiegelt Ideen, statt sie zu verstecken, und ermöglicht Urheberschaft ohne Kontrollverlust.",

"triketon.usecase.creative.title": "Für Kreative",
"triketon.usecase.creative.body":
"Als Kreative:r möchtest du sicher sein, dass deine Worte dir gehören - auch wenn sie digital geteilt werden. Triketon bietet Urhebernachweis ohne Wasserzeichen, Plattformbindung oder Rechteübertragung.",

"triketon.overlay.closing":
"Beweis ohne Besitz. Verifikation ohne Überwachung.",

  // Pillar sections (Smooth Operator)
  "pillar.section.header": "Modi & Experten",
  "pillar.section.modesTitle": "Modi",

  "pillar.section.modes": "Modi",
  "pillar.section.experts": "Experten",
  "pillar.section.systemTitle": "System",
  "pillar.section.system": "Systemstatus",
  "pillar.section.actionsTitle": "Neuer Chat",
  "pillar.section.utility": "Aktionen & Export",
  "pillar.section.archiveTitle": "ARCHIV",


  // Actions (export / delete)
  "actions.export.title": "Chat exportieren",
  "actions.export.help": "Speichere deinen Chat als Datei.",
  "actions.export.csv": "CSV",
  "actions.export.json": "JSON",

  "actions.delete.title": "Chat löschen",
  "actions.delete.warning":
    "Dieser Vorgang löscht den gesamten Chat dauerhaft. Exportiere vorher CSV oder JSON, wenn du ihn behalten möchtest.",
  "actions.delete.now": "Löschen",

  // ARIA
  exportCsvAria: "Chat als CSV exportieren",
  exportJsonAria: "Chat als JSON exportieren",
  clearChatAria: "Chat löschen",

  // ARIA / A11y
  conversationAria: "Chat-Verlauf",
  assistantSays: "Nachricht des Assistenten",
  youSaid: "Deine Nachricht",
  columnAria: "Seitenleiste - Steuerung & Auswahl",
  mobileOverlayLabel: "Mobile Seitenleistenansicht",
} as const;

const fr = {
  // Input / messaging
  writeMessage: "Écrire un message…",
  send: "Envoyer",

  // Input helpers
  tools: "Outils",
  newline: "Nouvelle ligne",
  comingUpload: "Téléverser",
  comingVoice: "Dictée vocale",
  comingFunctions: "Options",

  // Overlay header / buttons (mobile)
  close: "Fermer",

  // Sidebar / Column
  columnTitle: "Panneau latéral",
  sectionControl: "Commandes",
  onboarding: "Introduction",
  mDefault: "M · Par défaut",
  selectMode: "Choisir un mode",
  council13: "Conseil des 13",
  selectAI: "Choisir l’IA",
  modules: "Modules",
  coming: "Bientôt disponible",

  // Sidebar additions (experts & CTA)
  selectExpert: "Choisir un expert",
  statusExpert: "Expert :",
  clearChat: "Effacer le chat",
  startBuilding: "Commencer",
  startBuildingMsg:
"Donne-moi 13 exemples pour chaque catégorie qui montrent tes capacités de construction. Prends le secteur des jouets pour enfants âgés de 2 à 6 ans, de 6 à 12 ans, ainsi que pour les hommes de plus de 30 ans, et présente-les dans un tableau.",

  // Actions / footer
  export: "Exporter",
  levels: "Niveaux",
  levelsComing: "Niveaux à venir",
  threadExported: "Chat exporté.",

  // Status bar
  statusMode: "Mode :",
  statusAgent: "Agent :",

  // Backward-compat alias
  statusAI: "Agent :",

  // Status texts
  "status.modeSet": "Mode défini : {label}.",

  // Modes – system buttons
  "mode.onboarding": "Introduction",
  "mode.council": "Conseil des 13",
  "mode.default": "M · Par défaut",
  "mode.select": "Choisir un mode",

  // Modes – character modes (11)
  "mode.research": "Recherche",
  "mode.calm": "Calme",
  "mode.flow": "Flux",
  "mode.truth": "Vérité",
  "mode.wisdom": "Sagesse",
  "mode.play": "Jeu",
  "mode.vision": "Vision",
  "mode.empathy": "Empathie",
  "mode.love": "Amour",
  "mode.joy": "Joie",
  "mode.oracle": "Oracle",

  // Modes – categories
  "labels.modes.character": "Modes de caractère",
  "modes.category.core": "Cœur",
  "modes.category.intellectual": "Intellectuel",
  "modes.category.creator": "Créateur",
  "modes.category.heart": "Cœur",
  "modes.category.spirit": "Esprit",

  // Experts (used by Saeule.tsx)
  "experts.title": "Experts",
  "experts.choose": "Choisir un expert",

  // Expert categories
  "experts.category.life": "Vie",
  "experts.category.tech": "Technologie",
  "experts.category.space": "Espace",
  "experts.category.ethics": "Éthique",
  "experts.category.universe": "Univers",

  // Expert labels
  "experts.biologist": "Biologiste",
  "experts.chemist": "Chimiste",
  "experts.physicist": "Physicien",
  "experts.computer_scientist": "Informaticien",
  "experts.jurist": "Juriste",
  "experts.architect_civil_engineer": "Architecte / Ingénieur civil",
  "experts.landscape_designer": "Paysagiste",
  "experts.interior_designer": "Architecte d’intérieur",
  "experts.electrical_engineer": "Ingénieur électricien",
  "experts.mathematician": "Mathématicien",
  "experts.astrologer": "Astrologue",
  "experts.weather_expert": "Expert météo",
  "experts.molecular_scientist": "Scientifique moléculaire",

   // CTA fallback
  "cta.fallback":
    "Tout est prêt - dis-moi ce que tu veux créer (application, flow, fonctionnalité…).",

  // CTA labels
  "cta.build": "Construire",
  "cta.export": "Exporter",
  "cta.clear": "Effacer le chat",

  // Golden Conversion (messages système)
  gc_warning_last_free_message: "Il te reste 1 message gratuit. Ensuite, tu seras redirigé vers la page de paiement.",
  gc_payment_success_title: "Paiement réussi !",
  gc_payment_success_body: "Tes tokens ont été mis à jour. Bon chat !",
  gc_payment_success_button: "OK",
  gc_please_login_to_continue: "Connecte-toi pour continuer.",
  gc_overdraw_title: "Ton solde est épuisé.",
  gc_overdraw_body: "Ce message aurait fait passer ton compte en négatif. Nous avons couvert la différence par courtoisie. Merci de recharger pour continuer à discuter.",
  gc_freegate_limit_reached: "Tu as utilisé tes 9 messages gratuits.",
  gc_freegate_login_required: "Connecte-toi pour continuer.",
  "chat.tokens.depleted_title": "Votre solde est épuisé.",
  "chat.tokens.depleted_message": "Vous allez être redirigé vers la page de paiement pour acheter de nouveaux jetons.",
  "chat.tokens.depleted_redirect_label": "Acheter des jetons",
  "support.button.label": "Support",
  "support.mail.subject": "Demande d’assistance : « à compléter »",
  "support.mail.body": "Veuillez décrire votre demande aussi clairement et brièvement que possible.",

"triketon.button.label": "Triketon2048",
"triketon.button.tooltip": "Vérifié · Preuve de vérité",

"triketon.overlay.title": "Triketon2048 - Réponse vérifiée",

"triketon.overlay.intro":
"Cette réponse a été scellée cryptographiquement. Son authenticité peut être vérifiée à tout moment.",

"triketon.overlay.explainer":
"Nous ne stockons pas le contenu de cette réponse sur nos serveurs. Seule une preuve mathématique de son intégrité est conservée - jamais le texte lui-même.",

"triketon.overlay.ownership":
"Vos mots vous appartiennent. Vous seul avez accès au contenu complet.",

"triketon.overlay.data.title": "Données de vérification",

"triketon.overlay.data.public_key": "Clé publique",
"triketon.overlay.data.truth_hash": "Empreinte de vérité",
"triketon.overlay.data.timestamp": "Horodatage",

"triketon.overlay.footer":
"Triketon2048 n’est pas une fonctionnalité. C’est une promesse.",

"triketon.overlay.usecases.title": "Pourquoi c’est important",

"triketon.usecase.researcher.title": "Pour les chercheurs",
"triketon.usecase.researcher.body":
"En tant que chercheur, vous pouvez avoir besoin de prouver qu’une hypothèse, une idée ou un résultat existait à un moment donné - sans publier ni révéler votre travail prématurément. Triketon permet d’établir une antériorité sans divulgation.",

"triketon.usecase.inventor.title": "Pour les inventeurs",
"triketon.usecase.inventor.body":
"En tant qu’inventeur, vous pouvez vouloir prouver qu’une idée vient de vous - sans l’exposer avant d’y être prêt. Triketon scelle les idées au lieu de les cacher et prouve l’origine sans perte de contrôle.",

"triketon.usecase.creative.title": "Pour les créateurs",
"triketon.usecase.creative.body":
"En tant que créateur, vous pouvez vouloir la certitude que vos mots sont les vôtres - même lorsqu’ils sont partagés numériquement. Triketon fournit une preuve d’auteur sans filigrane, plateforme ou transfert de droits.",

"triketon.overlay.closing":
"Preuve sans possession. Vérification sans surveillance.",


  // Pillar sections (Smooth Operator)
  "pillar.section.header": "Modes & experts",
  "pillar.section.modesTitle": "Modes",

  "pillar.section.modes": "Modes",
  "pillar.section.experts": "Experts",
  "pillar.section.systemTitle": "Système",
  "pillar.section.system": "État du système",
  "pillar.section.actionsTitle": "Nouveau chat",
  "pillar.section.utility": "Actions & export",
  "pillar.section.archiveTitle": "ARCHIVES",

  // Actions (export / delete)
  "actions.export.title": "Exporter le chat",
  "actions.export.help": "Enregistrer votre chat sous forme de fichier.",
  "actions.export.csv": "CSV",
  "actions.export.json": "JSON",

  "actions.delete.title": "Supprimer le chat",
  "actions.delete.warning":
    "Cette action supprime définitivement tout le chat. Exportez-le en CSV ou JSON si vous souhaitez le conserver.",
  "actions.delete.now": "Supprimer",

  // ARIA for actions
  exportCsvAria: "Exporter le chat en CSV",
  exportJsonAria: "Exporter le chat en JSON",
  clearChatAria: "Supprimer le chat",

  // ARIA / A11y
  conversationAria: "Historique du chat",
  assistantSays: "Message de l’assistant",
  youSaid: "Votre message",
  columnAria: "Panneau - Commandes et sélection",
  mobileOverlayLabel: "Affichage mobile du panneau",
} as const;

const es = {
  // Input / messaging
  writeMessage: "Escribe un mensaje…",
  send: "Enviar",

  // Input helpers
  tools: "Herramientas",
  newline: "Nueva línea",
  comingUpload: "Subir",
  comingVoice: "Voz",
  comingFunctions: "Opciones",

  // Overlay header / buttons (mobile)
  close: "Cerrar",

  // Sidebar / Column
  columnTitle: "Panel lateral",
  sectionControl: "Controles",
  onboarding: "Introducción",
  mDefault: "M · Predeterminado",
  selectMode: "Elegir modo",
  council13: "Consejo de los 13",
  selectAI: "Elegir IA",
  modules: "Módulos",
  coming: "Próximamente",

  // Sidebar additions (experts & CTA)
  selectExpert: "Elegir experto",
  statusExpert: "Experto:",
  clearChat: "Borrar chat",
  startBuilding: "Iniciar construcción",
  startBuildingMsg:
"Dame 13 ejemplos para cada categoría que demuestren tus capacidades de construcción. Toma el sector de juguetes infantiles para niños de 2 a 6 años, de 6 a 12 años y para hombres mayores de 30, y muéstramelos en una tabla.",

  // Actions / footer
  export: "Exportar",
  levels: "Niveles",
  levelsComing: "Niveles próximamente",
  threadExported: "Chat exportado.",

  // Status bar
  statusMode: "Modo:",
  statusAgent: "Agente:",

  // Backward-compat alias
  statusAI: "Agente:",

  // Status texts
  "status.modeSet": "Modo establecido: {label}.",

  // Modes – system buttons
  "mode.onboarding": "Introducción",
  "mode.council": "Consejo de los 13",
  "mode.default": "M · Predeterminado",
  "mode.select": "Elegir modo",

  // Modes – character modes (11)
  "mode.research": "Investigación",
  "mode.calm": "Calma",
  "mode.flow": "Flujo",
  "mode.truth": "Verdad",
  "mode.wisdom": "Sabiduría",
  "mode.play": "Juego",
  "mode.vision": "Visión",
  "mode.empathy": "Empatía",
  "mode.love": "Amor",
  "mode.joy": "Alegría",
  "mode.oracle": "Oráculo",

  // Modes – categories
  "labels.modes.character": "Modos de carácter",
  "modes.category.core": "BASE",
  "modes.category.intellectual": "MENTE",
  "modes.category.creator": "CREAR",
  "modes.category.heart": "ALMA",
  "modes.category.spirit": "ESPÍRITU",

  // Experts (used by Saeule.tsx)
  "experts.title": "Expertos",
  "experts.choose": "Elegir experto",

  // Expert categories
  "experts.category.life": "Vida",
  "experts.category.tech": "Tecnología",
  "experts.category.space": "Espacio",
  "experts.category.ethics": "Ética",
  "experts.category.universe": "Universo",

  // Expert labels
  "experts.biologist": "Biólogo",
  "experts.chemist": "Químico",
  "experts.physicist": "Físico",
  "experts.computer_scientist": "Informático",
  "experts.jurist": "Jurista",
  "experts.architect_civil_engineer": "Arquitecto / Ingeniero civil",
  "experts.landscape_designer": "Paisajista",
  "experts.interior_designer": "Diseñador de interiores",
  "experts.electrical_engineer": "Ingeniero eléctrico",
  "experts.mathematician": "Matemático",
  "experts.astrologer": "Astrólogo",
  "experts.weather_expert": "Meteorólogo",
  "experts.molecular_scientist": "Científico molecular",

  // CTA fallback
  "cta.fallback":
    "Todo listo - cuéntame qué quieres construir (app, flujo, funcionalidad…).",

  // CTA labels
  "cta.build": "Construir",
  "cta.export": "Exportar",
  "cta.clear": "Borrar chat",

  // Golden Conversion (mensajes del sistema)
  gc_warning_last_free_message:
    "Te queda 1 mensaje gratis. Después serás redirigido al pago.",
  gc_payment_success_title: "Pago realizado con éxito.",
  gc_payment_success_body:
    "Tus tokens se han actualizado. Disfruta del chat.",
  gc_payment_success_button: "OK",
  gc_please_login_to_continue: "Inicia sesión para continuar.",
  gc_overdraw_title: "Tu saldo se ha agotado.",
  gc_overdraw_body: "Este mensaje habría dejado tu cuenta en negativo. Hemos cubierto la diferencia por cortesía. Por favor, recarga tu saldo para seguir chateando.",
  gc_freegate_limit_reached: "Has usado tus 9 mensajes gratuitos.",
  gc_freegate_login_required: "Inicia sesión para continuar.",
  "chat.tokens.depleted_title": "Tu saldo está agotado.",
  "chat.tokens.depleted_message": "Ahora serás redirigido a la página de pago para comprar nuevos tokens.",
  "chat.tokens.depleted_redirect_label": "Comprar tokens",
  "support.button.label": "Soporte",
  "support.mail.subject": "Solicitud de soporte: \"rellenar\"",
  "support.mail.body": "Describa su consulta de la forma más clara y breve posible, por favor.",
"triketon.button.label": "Triketon2048",
"triketon.button.tooltip": "Verificado · Prueba de verdad",

"triketon.overlay.title": "Triketon2048 - Respuesta verificada",

"triketon.overlay.intro":
"Esta respuesta ha sido sellada criptográficamente. Su autenticidad puede verificarse en cualquier momento.",

"triketon.overlay.explainer":
"No almacenamos el contenido de esta respuesta en nuestros servidores. Solo se guarda una prueba matemática de su integridad - nunca el texto en sí.",

"triketon.overlay.ownership":
"Tus palabras te pertenecen. Solo tú tienes acceso al contenido completo.",

"triketon.overlay.data.title": "Datos de verificación",

"triketon.overlay.data.public_key": "Clave pública",
"triketon.overlay.data.truth_hash": "Hash de verdad",
"triketon.overlay.data.timestamp": "Marca de tiempo",

"triketon.overlay.footer":
"Triketon2048 no es una función. Es una promesa.",

"triketon.overlay.usecases.title": "Por qué esto importa",

"triketon.usecase.researcher.title": "Para investigadores",
"triketon.usecase.researcher.body":
"Como investigador, puedes necesitar demostrar que una hipótesis, idea o resultado existía en un momento determinado - sin publicar ni revelar tu trabajo antes de tiempo. Triketon permite establecer prioridad sin divulgación.",

"triketon.usecase.inventor.title": "Para inventores",
"triketon.usecase.inventor.body":
"Como inventor, puedes querer demostrar que una idea se originó contigo - sin exponerla antes de estar listo. Triketon sella ideas en lugar de ocultarlas y permite probar la autoría sin perder el control.",

"triketon.usecase.creative.title": "Para creadores",
"triketon.usecase.creative.body":
"Como creador, puedes querer la certeza de que tus palabras son tuyas - incluso cuando se comparten digitalmente. Triketon ofrece prueba de autoría sin marcas de agua, plataformas ni cesión de derechos.",

"triketon.overlay.closing":
"Prueba sin posesión. Verificación sin vigilancia.",


  // Pillar sections
  "pillar.section.header": "Modos y expertos",
  "pillar.section.modesTitle": "Modos",

  "pillar.section.modes": "Modos",
  "pillar.section.experts": "Expertos",
  "pillar.section.systemTitle": "Sistema",
  "pillar.section.system": "Estado del sistema",
  "pillar.section.actionsTitle": "Nuevo chat",
  "pillar.section.utility": "Acciones y exportación",
  "pillar.section.archiveTitle": "ARCHIVO",

  // Actions (export / delete)
  "actions.export.title": "Exportar chat",
  "actions.export.help": "Guarda tu chat como archivo.",
  "actions.export.csv": "CSV",
  "actions.export.json": "JSON",

  "actions.delete.title": "Borrar chat",
  "actions.delete.warning":
    "Esto eliminará el chat completo de manera permanente. Expórtalo en CSV o JSON si deseas conservarlo.",
  "actions.delete.now": "Borrar",

  // ARIA
  exportCsvAria: "Exportar chat como CSV",
  exportJsonAria: "Exportar chat como JSON",
  clearChatAria: "Borrar chat",

  // ARIA / A11y
  conversationAria: "Historial del chat",
  assistantSays: "Mensaje del asistente",
  youSaid: "Tu mensaje",
  columnAria: "Panel - Controles y selección",
  mobileOverlayLabel: "Vista móvil del panel",
} as const;

const it = {
  // Input / messaging
  writeMessage: "Scrivi un messaggio…",
  send: "Invia",

  // Input helpers
  tools: "Strumenti",
  newline: "Nuova riga",
  comingUpload: "Caricamento",
  comingVoice: "Voce",
  comingFunctions: "Opzioni",

  // Overlay header / buttons (mobile)
  close: "Chiudi",

  // Sidebar / Column
  columnTitle: "Pannello laterale",
  sectionControl: "Controlli",
  onboarding: "Introduzione",
  mDefault: "M · Predefinito",
  selectMode: "Scegli modalità",
  council13: "Consiglio dei 13",
  selectAI: "Scegli IA",
  modules: "Moduli",
  coming: "In arrivo",

  // Sidebar additions (experts & CTA)
  selectExpert: "Scegli esperto",
  statusExpert: "Esperto:",
  clearChat: "Cancella chat",
  startBuilding: "Inizia a creare",
  startBuildingMsg:
    "Dammi 13 esempi per ciascuna categoria che mostrino le tue capacità di costruzione. Prendi il settore dei giocattoli per bambini di 2–6 anni, 6–12 anni e per uomini sopra i 30 anni, e mostrali in una tabella.",

  // Actions / footer
  export: "Esporta",
  levels: "Livelli",
  levelsComing: "Livelli in arrivo",
  threadExported: "Chat esportata.",

  // Status bar
  statusMode: "Modalità:",
  statusAgent: "Agente:",

  // Backward-compat alias
  statusAI: "Agente:",

  // Status texts
  "status.modeSet": "Modalità impostata: {label}.",

  // Modes – system buttons
  "mode.onboarding": "Introduzione",
  "mode.council": "Consiglio dei 13",
  "mode.default": "M · Predefinito",
  "mode.select": "Scegli modalità",

  // Modes – character modes (11)
  "mode.research": "Ricerca",
  "mode.calm": "Calma",
  "mode.flow": "Flusso",
  "mode.truth": "Verità",
  "mode.wisdom": "Saggezza",
  "mode.play": "Gioco",
  "mode.vision": "Visione",
  "mode.empathy": "Empatia",
  "mode.love": "Amore",
  "mode.joy": "Gioia",
  "mode.oracle": "Oracolo",

  // Modes – categories
  "labels.modes.character": "Modalità caratteriali",
  "modes.category.core": "NUCLEO",
  "modes.category.intellectual": "MENTE",
  "modes.category.creator": "CREARE",
  "modes.category.heart": "CUORE",
  "modes.category.spirit": "SPIRITO",

  // Experts (used by Saeule.tsx)
  "experts.title": "Esperti",
  "experts.choose": "Scegli esperto",

  // Expert categories
  "experts.category.life": "Vita",
  "experts.category.tech": "Tecnologia",
  "experts.category.space": "Spazio",
  "experts.category.ethics": "Etica",
  "experts.category.universe": "Universo",

  // Expert labels
  "experts.biologist": "Biologo",
  "experts.chemist": "Chimico",
  "experts.physicist": "Fisico",
  "experts.computer_scientist": "Informatico",
  "experts.jurist": "Giurista",
  "experts.architect_civil_engineer": "Architetto / Ingegnere civile",
  "experts.landscape_designer": "Paesaggista",
  "experts.interior_designer": "Interior designer",
  "experts.electrical_engineer": "Ingegnere elettrico",
  "experts.mathematician": "Matematico",
  "experts.astrologer": "Astrologo",
  "experts.weather_expert": "Esperto meteorologico",
  "experts.molecular_scientist": "Scienziato molecolare",

   // CTA fallback
  "cta.fallback":
    "Tutto pronto - dimmi cosa desideri creare (app, flusso, funzionalità…).",

  // CTA labels
  "cta.build": "Crea",
  "cta.export": "Esporta",
  "cta.clear": "Cancella chat",

  // Golden Conversion (messaggi di sistema)
  gc_warning_last_free_message:
    "Hai ancora 1 messaggio gratuito. Dopo verrai reindirizzato al checkout.",
  gc_payment_success_title: "Pagamento riuscito!",
  gc_payment_success_body:
    "I tuoi token sono stati aggiornati. Buona continuazione di chat.",
  gc_payment_success_button: "OK",
  gc_please_login_to_continue: "Accedi per continuare.",
  gc_overdraw_title: "Il tuo saldo è esaurito.",
  gc_overdraw_body: "Questo messaggio avrebbe portato il tuo conto in negativo. Abbiamo coperto la differenza per cortesia. Ricarica per continuare a chattare.",
  gc_freegate_limit_reached: "Hai usato i tuoi 9 messaggi gratuiti.",
  gc_freegate_login_required: "Accedi per continuare.",
  "chat.tokens.depleted_title": "Il tuo saldo è esaurito.",
  "chat.tokens.depleted_message": "Ora verrai reindirizzato alla pagina di pagamento per acquistare nuovi token.",
  "chat.tokens.depleted_redirect_label": "Acquista token",
  "support.button.label": "Supporto",
  "support.mail.subject": "Richiesta di supporto: \"inserire\"",
  "support.mail.body": "Descrivi la tua richiesta nel modo più chiaro e conciso possibile, per favore.",

"triketon.button.label": "Triketon2048",
"triketon.button.tooltip": "Verificato · Prova di verità",

"triketon.overlay.title": "Triketon2048 - Risposta verificata",

"triketon.overlay.intro":
"Questa risposta è stata sigillata crittograficamente. La sua autenticità può essere verificata in qualsiasi momento.",

"triketon.overlay.explainer":
"Non memorizziamo il contenuto di questa risposta sui nostri server. Viene conservata solo una prova matematica della sua integrità - mai il testo stesso.",

"triketon.overlay.ownership":
"Le tue parole ti appartengono. Solo tu hai accesso al contenuto completo.",

"triketon.overlay.data.title": "Dati di verifica",

"triketon.overlay.data.public_key": "Chiave pubblica",
"triketon.overlay.data.truth_hash": "Hash di verità",
"triketon.overlay.data.timestamp": "Timestamp",

"triketon.overlay.footer":
"Triketon2048 non è una funzionalità. È una promessa.",

"triketon.overlay.usecases.title": "Perché è importante",

"triketon.usecase.researcher.title": "Per i ricercatori",
"triketon.usecase.researcher.body":
"Come ricercatore, potresti dover dimostrare che un’ipotesi, un’intuizione o un risultato esistevano in un momento specifico - senza pubblicare o rivelare il tuo lavoro prematuramente. Triketon consente di stabilire la priorità senza divulgazione.",

"triketon.usecase.inventor.title": "Per gli inventori",
"triketon.usecase.inventor.body":
"Come inventore, potresti voler dimostrare che un’idea ha avuto origine da te - senza esporla prima di essere pronto. Triketon sigilla le idee invece di nasconderle e permette di provare la paternità senza perdita di controllo.",

"triketon.usecase.creative.title": "Per i creativi",
"triketon.usecase.creative.body":
"Come creativo, potresti desiderare la certezza che le tue parole siano tue - anche quando vengono condivise digitalmente. Triketon fornisce prova di paternità senza filigrane, piattaforme o trasferimento di diritti.",

"triketon.overlay.closing":
"Prova senza possesso. Verifica senza sorveglianza.",

  // Pillar sections (Smooth Operator)
  "pillar.section.header": "Modalità ed esperti",
  "pillar.section.modesTitle": "Modalità",

  "pillar.section.modes": "Modalità",
  "pillar.section.experts": "Esperti",
  "pillar.section.systemTitle": "Sistema",
  "pillar.section.system": "Stato del sistema",
  "pillar.section.actionsTitle": "Nuova chat",
  "pillar.section.utility": "Azioni e esportazione",
  "pillar.section.archiveTitle": "ARCHIVIO",

  // Actions (export / delete)
  "actions.export.title": "Esporta chat",
  "actions.export.help": "Salva la chat come file.",
  "actions.export.csv": "CSV",
  "actions.export.json": "JSON",

  "actions.delete.title": "Cancella chat",
  "actions.delete.warning":
    "Questa azione eliminerà definitivamente l’intera chat. Esportala in CSV o JSON se desideri conservarla.",
  "actions.delete.now": "Elimina",

  // ARIA
  exportCsvAria: "Esporta la chat in formato CSV",
  exportJsonAria: "Esporta la chat in formato JSON",
  clearChatAria: "Cancella chat",

  // ARIA / A11y
  conversationAria: "Cronologia della chat",
  assistantSays: "Messaggio dell’assistente",
  youSaid: "Il tuo messaggio",
  columnAria: "Pannello - Controlli e selezione",
  mobileOverlayLabel: "Vista mobile del pannello",
} as const;

const pt = {
  // Input / messaging
  writeMessage: "Escreva uma mensagem…",
  send: "Enviar",

  // Input helpers
  tools: "Ferramentas",
  newline: "Nova linha",
  comingUpload: "Upload",
  comingVoice: "Voz",
  comingFunctions: "Opções",

  // Overlay header / buttons (mobile)
  close: "Fechar",

  // Sidebar / Column
  columnTitle: "Painel lateral",
  sectionControl: "Controles",
  onboarding: "Introdução",
  mDefault: "M · Padrão",
  selectMode: "Escolher modo",
  council13: "Conselho dos 13",
  selectAI: "Escolher IA",
  modules: "Módulos",
  coming: "Em breve",

  // Sidebar additions (experts & CTA)
  selectExpert: "Escolher especialista",
  statusExpert: "Especialista:",
  clearChat: "Limpar chat",
  startBuilding: "Começar a criar",
  startBuildingMsg:
  "Dá-me 13 exemplos para cada categoria que mostrem as tuas capacidades de construção. Usa o setor de brinquedos infantis para crianças de 2–6 anos, de 6–12 anos e para homens acima de 30 anos, e apresenta tudo numa tabela.",

  // Actions / footer
  export: "Exportar",
  levels: "Níveis",
  levelsComing: "Níveis em breve",
  threadExported: "Chat exportado.",

  // Status bar
  statusMode: "Modo:",
  statusAgent: "Agente:",

  // Backward-compat alias
  statusAI: "Agente:",

  // Status texts
  "status.modeSet": "Modo definido: {label}.",

  // Modes – system buttons
  "mode.onboarding": "Introdução",
  "mode.council": "Conselho dos 13",
  "mode.default": "M · Padrão",
  "mode.select": "Escolher modo",

  // Modes – character modes (11)
  "mode.research": "Pesquisa",
  "mode.calm": "Calma",
  "mode.flow": "Fluxo",
  "mode.truth": "Verdade",
  "mode.wisdom": "Sabedoria",
  "mode.play": "Jogo",
  "mode.vision": "Visão",
  "mode.empathy": "Empatia",
  "mode.love": "Amor",
  "mode.joy": "Alegria",
  "mode.oracle": "Oráculo",

  // Modes – categories
  "labels.modes.character": "Modos de caráter",
  "modes.category.core": "BASE",
  "modes.category.intellectual": "MENTE",
  "modes.category.creator": "CRIAR",
  "modes.category.heart": "ALMA",
  "modes.category.spirit": "ESPÍRITO",

  // Experts (used by Saeule.tsx)
  "experts.title": "Especialistas",
  "experts.choose": "Escolher especialista",

  // Expert categories
  "experts.category.life": "Vida",
  "experts.category.tech": "Tecnologia",
  "experts.category.space": "Espaço",
  "experts.category.ethics": "Ética",
  "experts.category.universe": "Universo",

  // Expert labels
  "experts.biologist": "Biólogo",
  "experts.chemist": "Químico",
  "experts.physicist": "Físico",
  "experts.computer_scientist": "Cientista da computação",
  "experts.jurist": "Jurista",
  "experts.architect_civil_engineer": "Arquiteto / Engenheiro civil",
  "experts.landscape_designer": "Paisagista",
  "experts.interior_designer": "Designer de interiores",
  "experts.electrical_engineer": "Engenheiro elétrico",
  "experts.mathematician": "Matemático",
  "experts.astrologer": "Astrólogo",
  "experts.weather_expert": "Especialista em clima",
  "experts.molecular_scientist": "Cientista molecular",

  // CTA fallback
  "cta.fallback":
    "Tudo pronto - diz-me o que queres construir (app, fluxo, funcionalidade…).",

  // CTA labels
  "cta.build": "Criar",
  "cta.export": "Exportar",
  "cta.clear": "Limpar chat",

  // Golden Conversion (mensagens de sistema)
  gc_warning_last_free_message:
    "Ainda tens 1 mensagem gratuita. Depois serás redirecionado para o checkout.",
  gc_payment_success_title: "Pagamento concluído!",
  gc_payment_success_body:
    "Os teus tokens foram atualizados. Boa continuação de chat.",
  gc_payment_success_button: "OK",
  gc_please_login_to_continue: "Inicia sessão para continuar.",
  gc_overdraw_title: "O teu saldo está esgotado.",
  gc_overdraw_body: "Esta mensagem teria deixado a tua conta negativa. Cobrimos a diferença por cortesia. Por favor, recarrega para continuares a conversar.",
  gc_freegate_limit_reached: "Já usaste as 9 mensagens gratuitas.",
  gc_freegate_login_required: "Inicia sessão para continuar.",
  "chat.tokens.depleted_title": "O seu saldo está esgotado.",
  "chat.tokens.depleted_message": "Agora será redirecionado para a página de pagamento para comprar novos tokens.",
  "chat.tokens.depleted_redirect_label": "Comprar tokens",
  "support.button.label": "Suporte",
  "support.mail.subject": "Pedido de suporte: \"preencher\"",
  "support.mail.body": "Descreva o seu pedido da forma mais clara e breve possível, por favor.",

"triketon.button.label": "Triketon2048",
"triketon.button.tooltip": "Verificado · Prova de verdade",

"triketon.overlay.title": "Triketon2048 - Resposta verificada",

"triketon.overlay.intro":
"Esta resposta foi selada criptograficamente. A sua autenticidade pode ser verificada a qualquer momento.",

"triketon.overlay.explainer":
"Não armazenamos o conteúdo desta resposta em nossos servidores. Apenas uma prova matemática da sua integridade é guardada - nunca o texto em si.",

"triketon.overlay.ownership":
"As suas palavras pertencem a você. Somente você tem acesso ao conteúdo completo.",

"triketon.overlay.data.title": "Dados de verificação",

"triketon.overlay.data.public_key": "Chave pública",
"triketon.overlay.data.truth_hash": "Hash de verdade",
"triketon.overlay.data.timestamp": "Carimbo de data e hora",

"triketon.overlay.footer":
"Triketon2048 não é um recurso. É uma promessa.",

"triketon.overlay.usecases.title": "Por que isso importa",

"triketon.usecase.researcher.title": "Para pesquisadores",
"triketon.usecase.researcher.body":
"Como pesquisador, você pode precisar provar que uma hipótese, ideia ou resultado existia em um determinado momento - sem publicar ou revelar o seu trabalho prematuramente. Triketon permite estabelecer prioridade sem divulgação.",

"triketon.usecase.inventor.title": "Para inventores",
"triketon.usecase.inventor.body":
"Como inventor, você pode querer provar que uma ideia se originou com você - sem expô-la antes de estar pronto. Triketon sela ideias em vez de escondê-las e permite comprovar a autoria sem perda de controle.",

"triketon.usecase.creative.title": "Para criadores",
"triketon.usecase.creative.body":
"Como criador, você pode querer a certeza de que suas palavras são suas - mesmo quando compartilhadas digitalmente. Triketon oferece prova de autoria sem marcas d’água, plataformas ou transferência de direitos.",

"triketon.overlay.closing":
"Prova sem posse. Verificação sem vigilância.",

  // Pillar sections (Smooth Operator)
  "pillar.section.header": "Modos e especialistas",
  "pillar.section.modesTitle": "Modos",

  "pillar.section.modes": "Modos",
  "pillar.section.experts": "Especialistas",
  "pillar.section.systemTitle": "Sistema",
  "pillar.section.system": "Estado do sistema",
  "pillar.section.actionsTitle": "Novo chat",
  "pillar.section.utility": "Ações e exportação",
  "pillar.section.archiveTitle": "ARQUIVO",

  // Actions (export / delete)
  "actions.export.title": "Exportar chat",
  "actions.export.help": "Salve seu chat como arquivo.",
  "actions.export.csv": "CSV",
  "actions.export.json": "JSON",

  "actions.delete.title": "Excluir chat",
  "actions.delete.warning":
    "Isso apagará todo o chat permanentemente. Exporte como CSV ou JSON se quiser manter uma cópia.",
  "actions.delete.now": "Excluir",

  // ARIA
  exportCsvAria: "Exportar chat como CSV",
  exportJsonAria: "Exportar chat como JSON",
  clearChatAria: "Excluir chat",

  // ARIA / A11y
  conversationAria: "Histórico do chat",
  assistantSays: "Mensagem do assistente",
  youSaid: "Sua mensagem",
  columnAria: "Painel - Controles e seleção",
  mobileOverlayLabel: "Visão móvel do painel",
} as const;

const nl = {
  // Input / messaging
  writeMessage: "Schrijf een bericht…",
  send: "Verzenden",

  // Input helpers
  tools: "Tools",
  newline: "Nieuwe regel",
  comingUpload: "Upload",
  comingVoice: "Spraak",
  comingFunctions: "Opties",

  // Overlay header / buttons (mobile)
  close: "Sluiten",

  // Sidebar / Column
  columnTitle: "Zijlijn",
  sectionControl: "Bediening",
  onboarding: "Introductie",
  mDefault: "M · Standaard",
  selectMode: "Modus kiezen",
  council13: "Raad van 13",
  selectAI: "AI kiezen",
  modules: "Modules",
  coming: "Binnenkort beschikbaar",

  // Sidebar additions (experts & CTA)
  selectExpert: "Expert kiezen",
  statusExpert: "Expert:",
  clearChat: "Chat wissen",
  startBuilding: "Bouwen starten",
  startBuildingMsg:
"Geef me voor elke categorie 13 voorbeelden die jouw bouwvaardigheden tonen. Neem de sector kinderspeelgoed voor kinderen van 2–6 jaar, 6–12 jaar en voor mannen boven de 30, en toon het in een tabel.",

  // Actions / footer
  export: "Exporteren",
  levels: "Niveaus",
  levelsComing: "Niveaus komen binnenkort",
  threadExported: "Chat geëxporteerd.",

  // Status bar
  statusMode: "Modus:",
  statusAgent: "Agent:",

  // Backward-compat alias
  statusAI: "Agent:",

  // Status texts
  "status.modeSet": "Modus ingesteld: {label}.",

  // Modes – system buttons
  "mode.onboarding": "Introductie",
  "mode.council": "Raad van 13",
  "mode.default": "M · Standaard",
  "mode.select": "Modus kiezen",

  // Modes – character modes (11)
  "mode.research": "Onderzoek",
  "mode.calm": "Rust",
  "mode.flow": "Flow",
  "mode.truth": "Waarheid",
  "mode.wisdom": "Wijsheid",
  "mode.play": "Spel",
  "mode.vision": "Visie",
  "mode.empathy": "Empathie",
  "mode.love": "Liefde",
  "mode.joy": "Vreugde",
  "mode.oracle": "Orakel",

  // Modes – categories
  "labels.modes.character": "Karaktermodi",
  "modes.category.core": "Kern",
  "modes.category.intellectual": "Intellect",
  "modes.category.creator": "Maker",
  "modes.category.heart": "Hart",
  "modes.category.spirit": "Geest",

  // Experts (used by Saeule.tsx)
  "experts.title": "Experts",
  "experts.choose": "Expert kiezen",

  // Expert categories
  "experts.category.life": "Leven",
  "experts.category.tech": "Techniek",
  "experts.category.space": "Ruimte",
  "experts.category.ethics": "Ethiek",
  "experts.category.universe": "Universum",

  // Expert labels
  "experts.biologist": "Bioloog",
  "experts.chemist": "Scheikundige",
  "experts.physicist": "Natuurkundige",
  "experts.computer_scientist": "Computerwetenschapper",
  "experts.jurist": "Jurist",
  "experts.architect_civil_engineer":
    "Architect / Civiel ingenieur",
  "experts.landscape_designer": "Landschapsontwerper",
  "experts.interior_designer": "Interieurontwerper",
  "experts.electrical_engineer": "Elektrotechnisch ingenieur",
  "experts.mathematician": "Wiskundige",
  "experts.astrologer": "Astroloog",
  "experts.weather_expert": "Weerexpert",
  "experts.molecular_scientist": "Moleculair wetenschapper",

  // CTA fallback
  "cta.fallback":
    "Alles is klaar - vertel me wat je wilt bouwen (app, flow, functie…).",

  // CTA labels
  "cta.build": "Bouwen",
  "cta.export": "Exporteren",
  "cta.clear": "Chat wissen",

  // Golden Conversion (systeemmeldingen)
  gc_warning_last_free_message:
    "Je hebt nog 1 gratis bericht. Daarna word je doorgestuurd naar de checkout.",
  gc_payment_success_title: "Betaling geslaagd!",
  gc_payment_success_body:
    "Je tokens zijn bijgewerkt. Veel plezier met verder chatten.",
  gc_payment_success_button: "OK",
  gc_please_login_to_continue: "Log in om verder te gaan.",
  gc_overdraw_title: "Je saldo is opgebruikt.",
  gc_overdraw_body: "Dit bericht zou je saldo negatief hebben gemaakt. We hebben het verschil uit coulance voor je aangevuld. Laad je saldo op om verder te chatten.",
  gc_freegate_limit_reached: "Je hebt alle 9 gratis berichten gebruikt.",
  gc_freegate_login_required: "Log in om door te gaan.",
  "chat.tokens.depleted_title": "Je saldo is leeg.",
  "chat.tokens.depleted_message": "Je wordt nu doorgestuurd naar de betalingspagina om nieuwe tokens te kopen.",
  "chat.tokens.depleted_redirect_label": "Nu tokens kopen",
  "support.button.label": "Support",
  "support.mail.subject": "Supportverzoek: \"invullen\"",
  "support.mail.body": "Beschrijf uw verzoek zo duidelijk en kort mogelijk, alstublieft.",

"triketon.button.label": "Triketon2048",
"triketon.button.tooltip": "Geverifieerd · Bewijs van waarheid",

"triketon.overlay.title": "Triketon2048 - Geverifieerde reactie",

"triketon.overlay.intro":
"Deze reactie is cryptografisch verzegeld. De echtheid kan op elk moment worden geverifieerd.",

"triketon.overlay.explainer":
"We slaan de inhoud van deze reactie niet op onze servers op. Alleen een wiskundig bewijs van de integriteit wordt bewaard - nooit de tekst zelf.",

"triketon.overlay.ownership":
"Jouw woorden zijn van jou. Alleen jij hebt toegang tot de volledige inhoud.",

"triketon.overlay.data.title": "Verificatiegegevens",

"triketon.overlay.data.public_key": "Publieke sleutel",
"triketon.overlay.data.truth_hash": "Waarheids-hash",
"triketon.overlay.data.timestamp": "Tijdstempel",

"triketon.overlay.footer":
"Triketon2048 is geen functie. Het is een belofte.",

"triketon.overlay.usecases.title": "Waarom dit belangrijk is",

"triketon.usecase.researcher.title": "Voor onderzoekers",
"triketon.usecase.researcher.body":
"Als onderzoeker wil je mogelijk aantonen dat een hypothese, inzicht of resultaat op een bepaald moment bestond - zonder je werk voortijdig te publiceren of te onthullen. Triketon maakt het mogelijk om prioriteit vast te leggen zonder openbaarmaking.",

"triketon.usecase.inventor.title": "Voor uitvinders",
"triketon.usecase.inventor.body":
"Als uitvinder wil je mogelijk bewijzen dat een idee bij jou is ontstaan - zonder het te delen voordat je er klaar voor bent. Triketon verzegelt ideeën in plaats van ze te verbergen en bewijst auteurschap zonder verlies van controle.",

"triketon.usecase.creative.title": "Voor creatieven",
"triketon.usecase.creative.body":
"Als creatief wil je zekerheid dat jouw woorden van jou zijn - zelfs wanneer ze digitaal worden gedeeld. Triketon biedt bewijs van auteurschap zonder watermerken, platforms of overdracht van rechten.",

"triketon.overlay.closing":
"Bewijs zonder bezit. Verificatie zonder toezicht.",

  // Pillar sections (Smooth Operator)
  "pillar.section.header": "Modi & experts",
  "pillar.section.modesTitle": "Modi",

  "pillar.section.modes": "Modi",
  "pillar.section.experts": "Experts",
  "pillar.section.systemTitle": "Systeem",
  "pillar.section.system": "Systeemstatus",
  "pillar.section.actionsTitle": "Nieuwe chat",
  "pillar.section.utility": "Acties & export",
  "pillar.section.archiveTitle": "ARCHIEF",

  // Actions (export / delete)
  "actions.export.title": "Chat exporteren",
  "actions.export.help": "Sla je chat op als bestand.",
  "actions.export.csv": "CSV",
  "actions.export.json": "JSON",

  "actions.delete.title": "Chat wissen",
  "actions.delete.warning":
    "Dit verwijdert de hele chat permanent. Exporteer hem als CSV of JSON als je hem wilt bewaren.",
  "actions.delete.now": "Verwijderen",

  // ARIA
  exportCsvAria: "Chat exporteren als CSV",
  exportJsonAria: "Chat exporteren als JSON",
  clearChatAria: "Chat wissen",

  // ARIA / A11y
  conversationAria: "Chatgeschiedenis",
  assistantSays: "Bericht van de assistent",
  youSaid: "Jouw bericht",
  columnAria: "Zijlijn - Bediening & selectie",
  mobileOverlayLabel: "Mobiele weergave van het paneel",
} as const;

const ru = {
  // Input / messaging
  writeMessage: "Написать сообщение…",
  send: "Отправить",

  // Input helpers
  tools: "Инструменты",
  newline: "Новая строка",
  comingUpload: "Загрузка",
  comingVoice: "Голос",
  comingFunctions: "Опции",

  // Overlay header / buttons (mobile)
  close: "Закрыть",

  // Sidebar / Column
  columnTitle: "Боковая панель",
  sectionControl: "Управление",
  onboarding: "Введение",
  mDefault: "M · По умолчанию",
  selectMode: "Выбрать режим",
  council13: "Совет 13",
  selectAI: "Выбрать ИИ",
  modules: "Модули",
  coming: "Скоро",

  // Sidebar additions (experts & CTA)
  selectExpert: "Выбрать эксперта",
  statusExpert: "Эксперт:",
  clearChat: "Очистить чат",
  startBuilding: "Начать создание",
  startBuildingMsg:
"Дай мне по 13 примеров для каждой категории, которые демонстрируют твои строительные способности. Возьми сектор детских игрушек для детей 2–6 лет, 6–12 лет и для мужчин старше 30, и представь это в виде таблицы.",

  // Actions / footer
  export: "Экспорт",
  levels: "Уровни",
  levelsComing: "Уровни скоро появятся",
  threadExported: "Чат экспортирован.",

  // Status bar
  statusMode: "Режим:",
  statusAgent: "Агент:",

  // Backward-compat alias
  statusAI: "Агент:",

  // Status texts
  "status.modeSet": "Режим установлен: {label}.",

  // Modes – system buttons
  "mode.onboarding": "Введение",
  "mode.council": "Совет 13",
  "mode.default": "M · По умолчанию",
  "mode.select": "Выбрать режим",

  // Modes – character modes (11)
  "mode.research": "Исследование",
  "mode.calm": "Спокойствие",
  "mode.flow": "Поток",
  "mode.truth": "Истина",
  "mode.wisdom": "Мудрость",
  "mode.play": "Игра",
  "mode.vision": "Видение",
  "mode.empathy": "Эмпатия",
  "mode.love": "Любовь",
  "mode.joy": "Радость",
  "mode.oracle": "Оракул",

  // Modes – categories
  "labels.modes.character": "Режимы характера",
  "modes.category.core": "ОСНОВА",
  "modes.category.intellectual": "УМ",
  "modes.category.creator": "ТВОРИТЬ",
  "modes.category.heart": "СЕРДЦЕ",
  "modes.category.spirit": "ДУХ",

  // Experts (used by Saeule.tsx)
  "experts.title": "Эксперты",
  "experts.choose": "Выбрать эксперта",

  // Expert categories
  "experts.category.life": "Жизнь",
  "experts.category.tech": "Технологии",
  "experts.category.space": "Космос",
  "experts.category.ethics": "Этика",
  "experts.category.universe": "Вселенная",

  // Expert labels
  "experts.biologist": "Биолог",
  "experts.chemist": "Химик",
  "experts.physicist": "Физик",
  "experts.computer_scientist": "Специалист по информатике",
  "experts.jurist": "Юрист",
  "experts.architect_civil_engineer":
    "Архитектор / Инженер-строитель",
  "experts.landscape_designer": "Ландшафтный дизайнер",
  "experts.interior_designer": "Дизайнер интерьеров",
  "experts.electrical_engineer": "Инженер-электрик",
  "experts.mathematician": "Математик",
  "experts.astrologer": "Астролог",
  "experts.weather_expert": "Специалист по погоде",
  "experts.molecular_scientist": "Молекулярный учёный",

  // CTA fallback
  "cta.fallback":
    "Все готово - расскажи, что ты хочешь создать (приложение, поток, функцию…).",

  // CTA labels
  "cta.build": "Создать",
  "cta.export": "Экспорт",
  "cta.clear": "Очистить чат",

  // Golden Conversion (системные сообщения)
  gc_warning_last_free_message:
    "У тебя осталось 1 бесплатное сообщение. После этого ты будешь перенаправлен на страницу оплаты.",
  gc_payment_success_title: "Оплата успешно выполнена!",
  gc_payment_success_body:
    "Твои токены обновлены. Приятного продолжения чата.",
  gc_payment_success_button: "OK",
  gc_please_login_to_continue: "Войдите, чтобы продолжить.",
  gc_overdraw_title: "Ваш баланс исчерпан.",
  gc_overdraw_body: "Это сообщение увело бы ваш счёт в минус. Мы компенсировали разницу из вежливости. Пожалуйста, пополните баланс, чтобы продолжить общение.",
  gc_freegate_limit_reached: "Вы использовали все 9 бесплатных сообщений.",
  gc_freegate_login_required: "Пожалуйста, войдите, чтобы продолжить.",
  "chat.tokens.depleted_title": "Ваш баланс исчерпан.",
  "chat.tokens.depleted_message": "Сейчас вы будете перенаправлены на страницу оплаты, чтобы купить новые токены.",
  "chat.tokens.depleted_redirect_label": "Купить токены",
  "support.button.label": "Поддержка",
  "support.mail.subject": "Запрос в поддержку: «заполнить»",
  "support.mail.body": "Пожалуйста, опишите ваш запрос максимально ясно и кратко.",

"triketon.button.label": "Triketon2048",
"triketon.button.tooltip": "Подтверждено · Доказательство истины",

"triketon.overlay.title": "Triketon2048 - Подтверждённый ответ",

"triketon.overlay.intro":
"Этот ответ был криптографически запечатан. Его подлинность может быть проверена в любое время.",

"triketon.overlay.explainer":
"Мы не храним содержимое этого ответа на наших серверах. Сохраняется только математическое доказательство его целостности - никогда сам текст.",

"triketon.overlay.ownership":
"Ваши слова принадлежат вам. Только вы имеете доступ к полному содержимому.",

"triketon.overlay.data.title": "Данные проверки",

"triketon.overlay.data.public_key": "Публичный ключ",
"triketon.overlay.data.truth_hash": "Хеш истины",
"triketon.overlay.data.timestamp": "Временная метка",

"triketon.overlay.footer":
"Triketon2048 - это не функция. Это обещание.",

"triketon.overlay.usecases.title": "Почему это важно",

"triketon.usecase.researcher.title": "Для исследователей",
"triketon.usecase.researcher.body":
"Как исследователь, вы можете захотеть доказать, что гипотеза, идея или результат существовали в определённый момент времени - не публикуя и не раскрывая работу преждевременно. Triketon позволяет зафиксировать приоритет без раскрытия.",

"triketon.usecase.inventor.title": "Для изобретателей",
"triketon.usecase.inventor.body":
"Как изобретатель, вы можете захотеть доказать, что идея возникла у вас - не раскрывая её до готовности. Triketon запечатывает идеи, а не скрывает их, и позволяет доказать авторство без потери контроля.",

"triketon.usecase.creative.title": "Для творцов",
"triketon.usecase.creative.body":
"Как творец, вы можете хотеть уверенности, что ваши слова принадлежат вам - даже при цифровом распространении. Triketon обеспечивает доказательство авторства без водяных знаков, платформ или передачи прав.",

"triketon.overlay.closing":
"Доказательство без владения. Проверка без наблюдения.",

  // Pillar sections (Smooth Operator)
  "pillar.section.header": "Режимы и эксперты",
  "pillar.section.modesTitle": "Режимы",

  "pillar.section.modes": "Режимы",
  "pillar.section.experts": "Эксперты",
  "pillar.section.systemTitle": "Система",
  "pillar.section.system": "Состояние системы",
  "pillar.section.actionsTitle": "Новый чат",
  "pillar.section.utility": "Действия и экспорт",
  "pillar.section.archiveTitle": "АРХИВ",

  // Actions (export / delete)
  "actions.export.title": "Экспортировать чат",
  "actions.export.help": "Сохраните чат как файл.",
  "actions.export.csv": "CSV",
  "actions.export.json": "JSON",

  "actions.delete.title": "Удалить чат",
  "actions.delete.warning":
    "Это действие навсегда удалит весь чат. Экспортируйте его в CSV или JSON, если хотите сохранить.",
  "actions.delete.now": "Удалить",

  // ARIA
  exportCsvAria: "Экспортировать чат в CSV",
  exportJsonAria: "Экспортировать чат в JSON",
  clearChatAria: "Очистить чат",

  // ARIA / A11y
  conversationAria: "История чата",
  assistantSays: "Сообщение ассистента",
  youSaid: "Ваше сообщение",
  columnAria: "Боковая панель - управление и выбор",
  mobileOverlayLabel: "Мобильная версия панели",
} as const;

const zh = {
  // Input / messaging
  writeMessage: "写一条消息…",
  send: "发送",

  // Input helpers
  tools: "工具",
  newline: "换行",
  comingUpload: "上传",
  comingVoice: "语音输入",
  comingFunctions: "选项",

  // Overlay header / buttons (mobile)
  close: "关闭",

  // Sidebar / Column
  columnTitle: "侧栏",
  sectionControl: "控制区",
  onboarding: "入门",
  mDefault: "M · 默认",
  selectMode: "选择模式",
  council13: "十三议会",
  selectAI: "选择 AI",
  modules: "模块",
  coming: "即将推出",

  // Sidebar additions (experts & CTA)
  selectExpert: "选择专家",
  statusExpert: "专家：",
  clearChat: "清空聊天",
  startBuilding: "开始创建",
  startBuildingMsg:
    "请向我说明 build 功能以及与您高效协作所需的关键命令。请以表格形式展示。",

  // Actions / footer
  export: "导出",
  levels: "等级",
  levelsComing: "等级即将上线",
  threadExported: "聊天已导出。",

  // Status bar
  statusMode: "模式：",
  statusAgent: "代理：",

  // Backward-compat alias
  statusAI: "代理：",

  // Status texts
  "status.modeSet": "模式已设置：{label}。",

  // Modes – system buttons
  "mode.onboarding": "入门",
  "mode.council": "十三议会",
  "mode.default": "M · 默认",
  "mode.select": "选择模式",

  // Modes – character modes (11)
  "mode.research": "研究",
  "mode.calm": "宁静",
  "mode.flow": "心流",
  "mode.truth": "真理",
  "mode.wisdom": "智慧",
  "mode.play": "玩乐",
  "mode.vision": "愿景",
  "mode.empathy": "共情",
  "mode.love": "爱",
  "mode.joy": "喜悦",
  "mode.oracle": "神谕",

  // Modes – categories
  "labels.modes.character": "性格模式",
  "modes.category.core": "核心",
  "modes.category.intellectual": "理智",
  "modes.category.creator": "创造",
  "modes.category.heart": "心灵",
  "modes.category.spirit": "精神",

  // Experts (used by Saeule.tsx)
  "experts.title": "专家",
  "experts.choose": "选择专家",

  // Expert categories
  "experts.category.life": "生命",
  "experts.category.tech": "技术",
  "experts.category.space": "太空",
  "experts.category.ethics": "伦理",
  "experts.category.universe": "宇宙",

  // Expert labels
  "experts.biologist": "生物学家",
  "experts.chemist": "化学家",
  "experts.physicist": "物理学家",
  "experts.computer_scientist": "计算机科学家",
  "experts.jurist": "法学家",
  "experts.architect_civil_engineer": "建筑师 / 土木工程师",
  "experts.landscape_designer": "景观设计师",
  "experts.interior_designer": "室内设计师",
  "experts.electrical_engineer": "电气工程师",
  "experts.mathematician": "数学家",
  "experts.astrologer": "占星师",
  "experts.weather_expert": "气象专家",
  "experts.molecular_scientist": "分子科学家",

  // CTA fallback
  "cta.fallback":
    "一切准备就绪--告诉我你想创建什么（应用、流程、功能…）。",

  // CTA labels
  "cta.build": "创建",
  "cta.export": "导出",
  "cta.clear": "清空聊天",

  // Golden Conversion（系统提示）
  gc_warning_last_free_message:
    "你还剩 1 条免费消息。之后你会被跳转到结账页面。",
  gc_payment_success_title: "支付成功！",
  gc_payment_success_body:
    "你的代币已更新，祝你聊天愉快。",
  gc_payment_success_button: "确定",
  gc_please_login_to_continue: "请登录以继续。",
  gc_overdraw_title: "你的余额已用尽。",
  gc_overdraw_body: "这条消息本会使你的账户进入负值。出于礼貌，我们已为你补足差额。请充值后继续聊天。",
  gc_freegate_limit_reached: "你已用完 9 条免费消息。",
  gc_freegate_login_required: "请登录以继续。",
  "chat.tokens.depleted_title": "您的余额已用完。",
  "chat.tokens.depleted_message": "系统将把您跳转到支付页面购买新的代币。",
  "chat.tokens.depleted_redirect_label": "立即购买代币",
  "support.button.label": "支持",
  "support.mail.subject": "支持请求：\"请填写\"",
  "support.mail.body": "请尽可能清晰、简洁地描述您的问题或请求。",

"triketon.button.label": "Triketon2048",
"triketon.button.tooltip": "検証済み · 真実の証明",

"triketon.overlay.title": "Triketon2048 - 検証済みの回答",

"triketon.overlay.intro":
"この回答は暗号的に封印されています。その真正性はいつでも検証できます。",

"triketon.overlay.explainer":
"この回答の内容はサーバーに保存されません。保存されるのは完全性を示す数学的証明のみで、テキストそのものは含まれません。",

"triketon.overlay.ownership":
"あなたの言葉はあなたのものです。完全な内容にアクセスできるのはあなただけです。",

"triketon.overlay.data.title": "検証データ",

"triketon.overlay.data.public_key": "公開鍵",
"triketon.overlay.data.truth_hash": "真実ハッシュ",
"triketon.overlay.data.timestamp": "タイムスタンプ",

"triketon.overlay.footer":
"Triketon2048 は機能ではありません。約束です。",

"triketon.overlay.usecases.title": "なぜ重要なのか",

"triketon.usecase.researcher.title": "研究者のために",
"triketon.usecase.researcher.body":
"研究者として、仮説や洞察、結果が特定の時点で存在していたことを証明したい場合があります。Triketon は、内容を公開することなく優先性と完全性を証明できます。",

"triketon.usecase.inventor.title": "発明家のために",
"triketon.usecase.inventor.body":
"発明家として、アイデアが自分に由来することを、準備が整う前に公開せずに証明したい場合があります。Triketon はアイデアを隠すのではなく封印し、管理権を失うことなく創作の証明を可能にします。",

"triketon.usecase.creative.title": "クリエイターのために",
"triketon.usecase.creative.body":
"クリエイターとして、デジタルで共有されても言葉が自分のものであると確信したいことがあります。Triketon は透かしやプラットフォーム、権利移転なしに著作の証明を提供します。",

"triketon.overlay.closing":
"所有せずに証明する。監視せずに検証する。",

  // Pillar sections (Smooth Operator)
  "pillar.section.header": "模式与专家",
  "pillar.section.modesTitle": "模式",

  "pillar.section.modes": "模式",
  "pillar.section.experts": "专家",
  "pillar.section.systemTitle": "系统",
  "pillar.section.system": "系统状态",
  "pillar.section.actionsTitle": "新建聊天",
  "pillar.section.utility": "操作与导出",
  "pillar.section.archiveTitle": "存档",

  // Actions (export / delete)
  "actions.export.title": "导出聊天",
  "actions.export.help": "将聊天保存为文件。",
  "actions.export.csv": "CSV",
  "actions.export.json": "JSON",

  "actions.delete.title": "删除聊天",
  "actions.delete.warning":
    "此操作将永久删除整个聊天。如果想保留，请先导出为 CSV 或 JSON。",
  "actions.delete.now": "删除",

  // ARIA
  exportCsvAria: "将聊天导出为 CSV",
  exportJsonAria: "将聊天导出为 JSON",
  clearChatAria: "清空聊天",

  // ARIA / A11y
  conversationAria: "聊天记录",
  assistantSays: "助手消息",
  youSaid: "你的消息",
  columnAria: "侧栏 - 控制与选择",
  mobileOverlayLabel: "移动端侧栏界面",
} as const;

const ja = {
  // Input / messaging
  writeMessage: "メッセージを入力…",
  send: "送信",

  // Input helpers
  tools: "ツール",
  newline: "改行",
  comingUpload: "アップロード",
  comingVoice: "音声入力",
  comingFunctions: "オプション",

  // Overlay header / buttons (mobile)
  close: "閉じる",

  // Sidebar / Column
  columnTitle: "コラム",
  sectionControl: "コントロール",
  onboarding: "オンボーディング",
  mDefault: "M · デフォルト",
  selectMode: "モードを選択",
  council13: "カウンシル13",
  selectAI: "AIを選択",
  modules: "モジュール",
  coming: "近日公開",

  // Sidebar additions (experts & CTA)
  selectExpert: "専門家を選択",
  statusExpert: "専門家：",
  clearChat: "チャットを消去",
  startBuilding: "ビルド開始",
  startBuildingMsg:
"あなたのビルド能力を示す各カテゴリーにつき13の例を提示してください。2〜6歳向け、6〜12歳向け、そして30歳以上の男性向けの子ども用おもちゃの分野を使い、それらを表形式で見せてください。",

  // Actions / footer
  export: "エクスポート",
  levels: "レベル",
  levelsComing: "レベルは近日公開",
  threadExported: "チャットをエクスポートしました。",

  // Status bar
  statusMode: "モード：",
  statusAgent: "エージェント：",

  // Backward-compat alias
  statusAI: "エージェント：",

  // Status texts
  "status.modeSet": "モードが設定されました：{label}",

  // Modes – system buttons
  "mode.onboarding": "オンボーディング",
  "mode.council": "カウンシル13",
  "mode.default": "M · デフォルト",
  "mode.select": "モードを選択",

  // Modes – character modes (11)
  "mode.research": "リサーチ",
  "mode.calm": "静穏",
  "mode.flow": "フロー",
  "mode.truth": "真理",
  "mode.wisdom": "叡智",
  "mode.play": "プレイ",
  "mode.vision": "ビジョン",
  "mode.empathy": "共感",
  "mode.love": "愛",
  "mode.joy": "喜び",
  "mode.oracle": "オラクル",

  // Modes – categories
  "labels.modes.character": "キャラクターモード",
  "modes.category.core": "コア",
  "modes.category.intellectual": "知性",
  "modes.category.creator": "クリエイター",
  "modes.category.heart": "ハート",
  "modes.category.spirit": "スピリット",

  // Experts (used by Saeule.tsx)
  "experts.title": "専門家",
  "experts.choose": "専門家を選択",

  // Expert categories
  "experts.category.life": "生命",
  "experts.category.tech": "テクノロジー",
  "experts.category.space": "宇宙",
  "experts.category.ethics": "倫理",
  "experts.category.universe": "ユニバース",

  // Expert labels
  "experts.biologist": "生物学者",
  "experts.chemist": "化学者",
  "experts.physicist": "物理学者",
  "experts.computer_scientist": "コンピューター科学者",
  "experts.jurist": "法学者",
  "experts.architect_civil_engineer": "建築家／土木技師",
  "experts.landscape_designer": "ランドスケープデザイナー",
  "experts.interior_designer": "インテリアデザイナー",
  "experts.electrical_engineer": "電気技術者",
  "experts.mathematician": "数学者",
  "experts.astrologer": "占星術師",
  "experts.weather_expert": "気象専門家",
  "experts.molecular_scientist": "分子科学者",

  // CTA fallback
  "cta.fallback":
    "準備完了です - 作りたいもの（アプリ、フロー、機能など）を教えてください。",

  // CTA labels
  "cta.build": "ビルド",
  "cta.export": "エクスポート",
  "cta.clear": "チャットを消去",

  // Golden Conversion（システムメッセージ）
  gc_warning_last_free_message:
    "無料メッセージはあと1通です。その後はチェックアウト画面に移動します。",
  gc_payment_success_title: "お支払いが完了しました！",
  gc_payment_success_body:
    "トークンが更新されました。引き続きチャットをお楽しみください。",
  gc_payment_success_button: "OK",
  gc_please_login_to_continue: "続行するにはログインしてください。",
  gc_overdraw_title: "残高がなくなりました。",
  gc_overdraw_body: "このメッセージは残高をマイナスにするところでしたが、こちらで補填しました。続けるにはチャージしてください。",
  gc_freegate_limit_reached: "無料メッセージ 9 通を使い切りました。",
  gc_freegate_login_required: "続行するにはログインしてください。",
  "chat.tokens.depleted_title": "残高がゼロになりました。",
  "chat.tokens.depleted_message": "これからトークンを購入するための支払いページに移動します。",
  "chat.tokens.depleted_redirect_label": "トークンを購入する",
  "support.button.label": "支持",
  "support.mail.subject": "支持请求：\"请填写\"",
  "support.mail.body": "请尽可能清晰、简洁地描述您的问题或请求。",


  // Pillar sections (Smooth Operator)
  "pillar.section.header": "モード & 専門家",
  "pillar.section.modesTitle": "モード",

  "pillar.section.modes": "モード",
  "pillar.section.experts": "専門家",
  "pillar.section.systemTitle": "システム",
  "pillar.section.system": "システム状態",
  "pillar.section.actionsTitle": "新しいチャット",
  "pillar.section.utility": "操作 & エクスポート",
  "pillar.section.archiveTitle": "アーカイブ",

  // Actions (export / delete)
  "actions.export.title": "チャットをエクスポート",
  "actions.export.help": "チャットをファイルとして保存します。",
  "actions.export.csv": "CSV",
  "actions.export.json": "JSON",

  "actions.delete.title": "チャットを削除",
  "actions.delete.warning":
    "この操作はチャット全体を永久に削除します。保存したい場合は、先に CSV または JSON でエクスポートしてください。",
  "actions.delete.now": "削除",

  // ARIA
  exportCsvAria: "チャットを CSV でエクスポート",
  exportJsonAria: "チャットを JSON でエクスポート",
  clearChatAria: "チャットを消去",

  // ARIA / A11y
  conversationAria: "チャットログ",
  assistantSays: "アシスタントのメッセージ",
  youSaid: "あなたのメッセージ",
  columnAria: "コラム - コントロール & 選択",
  mobileOverlayLabel: "モバイルコラムオーバーレイ",
} as const;

const ko = {
  // Input / messaging
  writeMessage: "메시지를 입력하세요…",
  send: "보내기",

  // Input helpers
  tools: "도구",
  newline: "줄바꿈",
  comingUpload: "업로드",
  comingVoice: "음성 입력",
  comingFunctions: "옵션",

  // Overlay header / buttons (mobile)
  close: "닫기",

  // Sidebar / Column
  columnTitle: "컬럼",
  sectionControl: "컨트롤",
  onboarding: "온보딩",
  mDefault: "M · 기본",
  selectMode: "모드 선택",
  council13: "카운슬 13",
  selectAI: "AI 선택",
  modules: "모듈",
  coming: "곧 제공",

  // Sidebar additions (experts & CTA)
  selectExpert: "전문가 선택",
  statusExpert: "전문가:",
  clearChat: "채팅 지우기",
  startBuilding: "빌드 시작",
  startBuildingMsg:
"당신의 빌드 능력을 보여주는 카테고리별 13가지 예시를 제시해주세요. 2–6세 어린이, 6–12세 어린이, 그리고 30세 이상 남성을 위한 어린이 장난감 분야를 사용하여 표로 보여주세요.",

  // Actions / footer
  export: "내보내기",
  levels: "레벨",
  levelsComing: "레벨이 곧 제공됩니다",
  threadExported: "채팅이 내보내졌습니다.",

  // Status bar
  statusMode: "모드:",
  statusAgent: "에이전트:",

  // Backward-compat alias
  statusAI: "에이전트:",

  // Status texts
  "status.modeSet": "모드 설정됨: {label}.",

  // Modes – system buttons
  "mode.onboarding": "온보딩",
  "mode.council": "카운슬 13",
  "mode.default": "M · 기본",
  "mode.select": "모드 선택",

  // Modes – character modes (11)
  "mode.research": "리서치",
  "mode.calm": "차분함",
  "mode.flow": "플로우",
  "mode.truth": "진실",
  "mode.wisdom": "지혜",
  "mode.play": "플레이",
  "mode.vision": "비전",
  "mode.empathy": "공감",
  "mode.love": "사랑",
  "mode.joy": "기쁨",
  "mode.oracle": "오라클",

  // Modes – categories
  "labels.modes.character": "캐릭터 모드",
  "modes.category.core": "코어",
  "modes.category.intellectual": "지성",
  "modes.category.creator": "크리에이터",
  "modes.category.heart": "하트",
  "modes.category.spirit": "스피릿",

  // Experts (used by Saeule.tsx)
  "experts.title": "전문가",
  "experts.choose": "전문가 선택",

  // Expert categories
  "experts.category.life": "생명",
  "experts.category.tech": "기술",
  "experts.category.space": "우주",
  "experts.category.ethics": "윤리",
  "experts.category.universe": "우주 전체",

  // Expert labels
  "experts.biologist": "생물학자",
  "experts.chemist": "화학자",
  "experts.physicist": "물리학자",
  "experts.computer_scientist": "컴퓨터 과학자",
  "experts.jurist": "법학자",
  "experts.architect_civil_engineer": "건축가 / 토목기사",
  "experts.landscape_designer": "조경 디자이너",
  "experts.interior_designer": "인테리어 디자이너",
  "experts.electrical_engineer": "전기 엔지니어",
  "experts.mathematician": "수학자",
  "experts.astrologer": "점성가",
  "experts.weather_expert": "기상 전문가",
  "experts.molecular_scientist": "분자 과학자",

  // CTA fallback
  "cta.fallback":
    "준비 완료 - 무엇을 만들고 싶은지 알려주세요 (앱, 플로우, 기능 등).",

  // CTA labels
  "cta.build": "빌드",
  "cta.export": "내보내기",
  "cta.clear": "채팅 지우기",

  // Golden Conversion (시스템 메시지)
  gc_warning_last_free_message:
    "무료 메시지가 1개 남았습니다. 이후에는 결제 페이지로 이동합니다.",
  gc_payment_success_title: "결제가 완료되었습니다!",
  gc_payment_success_body:
    "토큰이 업데이트되었습니다. 계속해서 즐겁게 대화해 보세요.",
  gc_payment_success_button: "OK",
  gc_please_login_to_continue: "계속하려면 로그인해 주세요.",
  gc_overdraw_title: "잔액이 모두 소진되었습니다.",
  gc_overdraw_body: "이 메시지는 계정을 마이너스로 만들 뻔했습니다. 저희가 예우 차원에서 보전했습니다. 계속 대화하려면 충전해 주세요.",
  gc_freegate_limit_reached: "무료 메시지 9개를 모두 사용했습니다.",
  gc_freegate_login_required: "계속하려면 로그인하세요.",
  "chat.tokens.depleted_title": "잔액이 모두 소진되었습니다.",
  "chat.tokens.depleted_message": "지금 토큰을 구매할 수 있는 결제 페이지로 이동합니다.",
  "chat.tokens.depleted_redirect_label": "토큰 구매하기",
  "support.button.label": "지원",
  "support.mail.subject": "지원 요청: \"입력해 주세요\"",
  "support.mail.body": "요청 사항을 가능한 한 명확하고 간단하게 작성해 주세요.",

"triketon.button.label": "Triketon2048",
"triketon.button.tooltip": "검증됨 · 진실의 증명",

"triketon.overlay.title": "Triketon2048 - 검증된 응답",

"triketon.overlay.intro":
"이 응답은 암호학적으로 봉인되었습니다. 그 진위는 언제든지 검증할 수 있습니다.",

"triketon.overlay.explainer":
"우리는 이 응답의 내용을 서버에 저장하지 않습니다. 무결성을 증명하는 수학적 증명만 저장되며, 텍스트 자체는 저장되지 않습니다.",

"triketon.overlay.ownership":
"당신의 말은 당신의 것입니다. 전체 내용에 접근할 수 있는 사람은 오직 당신뿐입니다.",

"triketon.overlay.data.title": "검증 데이터",

"triketon.overlay.data.public_key": "공개 키",
"triketon.overlay.data.truth_hash": "진실 해시",
"triketon.overlay.data.timestamp": "타임스탬프",

"triketon.overlay.footer":
"Triketon2048은 기능이 아닙니다. 그것은 약속입니다.",

"triketon.overlay.usecases.title": "왜 이것이 중요한가",

"triketon.usecase.researcher.title": "연구자를 위한",
"triketon.usecase.researcher.body":
"연구자로서 가설, 통찰 또는 결과가 특정 시점에 존재했음을 증명해야 할 수 있습니다. Triketon은 작업을 조기에 공개하지 않고도 우선성과 무결성을 증명할 수 있게 해줍니다.",

"triketon.usecase.inventor.title": "발명가를 위한",
"triketon.usecase.inventor.body":
"발명가로서 아이디어가 자신에게서 비롯되었음을, 준비되기 전에 공개하지 않고 증명하고 싶을 수 있습니다. Triketon은 아이디어를 숨기지 않고 봉인하여 통제권을 잃지 않은 채 창작의 기원을 증명합니다.",

"triketon.usecase.creative.title": "창작자를 위한",
"triketon.usecase.creative.body":
"창작자로서 디지털로 공유되더라도 자신의 말이 자신의 것임을 확신하고 싶을 수 있습니다. Triketon은 워터마크, 플랫폼, 권리 이전 없이 저작권 증명을 제공합니다.",

"triketon.overlay.closing":
"소유하지 않고 증명하다. 감시 없이 검증하다.",

  // Pillar sections (Smooth Operator)
  "pillar.section.header": "모드 & 전문가",
  "pillar.section.modesTitle": "모드",

  "pillar.section.modes": "모드",
  "pillar.section.experts": "전문가",
  "pillar.section.systemTitle": "시스템",
  "pillar.section.system": "시스템 상태",
  "pillar.section.actionsTitle": "새 채팅",
  "pillar.section.utility": "작업 & 내보내기",
  "pillar.section.archiveTitle": "아카이브",

  // Actions (export / delete)
  "actions.export.title": "채팅 내보내기",
  "actions.export.help": "채팅을 파일로 저장합니다.",
  "actions.export.csv": "CSV",
  "actions.export.json": "JSON",

  "actions.delete.title": "채팅 삭제",
  "actions.delete.warning":
    "이 작업은 전체 채팅을 영구적으로 삭제합니다. 보관하려면 먼저 CSV 또는 JSON으로 내보내세요.",
  "actions.delete.now": "삭제",

  // ARIA
  exportCsvAria: "채팅을 CSV로 내보내기",
  exportJsonAria: "채팅을 JSON으로 내보내기",
  clearChatAria: "채팅 지우기",

  // ARIA / A11y
  conversationAria: "채팅 로그",
  assistantSays: "어시스턴트 메시지",
  youSaid: "내 메시지",
  columnAria: "컬럼 - 컨트롤 & 선택",
  mobileOverlayLabel: "모바일 컬럼 오버레이",
} as const;

const ar = {
  // Input / messaging
  writeMessage: "اكتب رسالة…",
  send: "إرسال",

  // Input helpers
  tools: "الأدوات",
  newline: "سطر جديد",
  comingUpload: "رفع",
  comingVoice: "إدخال صوتي",
  comingFunctions: "الخيارات",

  // Overlay header / buttons (mobile)
  close: "إغلاق",

  // Sidebar / Column
  columnTitle: "العمود",
  sectionControl: "التحكم",
  onboarding: "البدء",
  mDefault: "M · افتراضي",
  selectMode: "اختر الوضع",
  council13: "مجلس 13",
  selectAI: "اختر الذكاء الاصطناعي",
  modules: "الوحدات",
  coming: "قريبًا",

  // Sidebar additions (experts & CTA)
  selectExpert: "اختر خبيرًا",
  statusExpert: "الخبير:",
  clearChat: "مسح الدردشة",
  startBuilding: "ابدأ البناء",
  startBuildingMsg:
"أعطني 13 مثالًا لكل فئة تُظهر قدراتك في البناء. استخدم قطاع ألعاب الأطفال للفئات العمرية 2–6 سنوات، 6–12 سنة، وللرجال فوق سن 30، واعرض ذلك في جدول.",

  // Actions / footer
  export: "تصدير",
  levels: "المستويات",
  levelsComing: "المستويات ستتوفر قريبًا",
  threadExported: "تم تصدير الدردشة.",

  // Status bar
  statusMode: "الوضع:",
  statusAgent: "الوكيل:",

  // Backward-compat alias
  statusAI: "الوكيل:",

  // Status texts
  "status.modeSet": "تم ضبط الوضع: {label}.",

  // Modes – system buttons
  "mode.onboarding": "البدء",
  "mode.council": "مجلس 13",
  "mode.default": "M · افتراضي",
  "mode.select": "اختر الوضع",

  // Modes – character modes (11)
  "mode.research": "البحث",
  "mode.calm": "الهدوء",
  "mode.flow": "التدفق",
  "mode.truth": "الحقيقة",
  "mode.wisdom": "الحكمة",
  "mode.play": "اللعب",
  "mode.vision": "الرؤية",
  "mode.empathy": "التعاطف",
  "mode.love": "المحبة",
  "mode.joy": "الفرح",
  "mode.oracle": "العراف",

  // Modes – categories
  "labels.modes.character": "أوضاع الشخصية",
  "modes.category.core": "الأساس",
  "modes.category.intellectual": "الذكاء",
  "modes.category.creator": "الإبداع",
  "modes.category.heart": "القلب",
  "modes.category.spirit": "الروح",

  // Experts (used by Saeule.tsx)
  "experts.title": "الخبراء",
  "experts.choose": "اختر خبيرًا",

  // Expert categories
  "experts.category.life": "الحياة",
  "experts.category.tech": "التقنية",
  "experts.category.space": "الفضاء",
  "experts.category.ethics": "الأخلاق",
  "experts.category.universe": "الكون",

  // Expert labels
  "experts.biologist": "عالم أحياء",
  "experts.chemist": "كيميائي",
  "experts.physicist": "فيزيائي",
  "experts.computer_scientist": "عالم حاسوب",
  "experts.jurist": "حقوقي",
  "experts.architect_civil_engineer": "مهندس معماري / مدني",
  "experts.landscape_designer": "مصمم حدائق",
  "experts.interior_designer": "مصمم داخلي",
  "experts.electrical_engineer": "مهندس كهرباء",
  "experts.mathematician": "رياضي",
  "experts.astrologer": "منجم",
  "experts.weather_expert": "خبير طقس",
  "experts.molecular_scientist": "عالم جزيئات",

  // CTA fallback
  "cta.fallback":
"أنت جاهز - أخبرني بما تريد بناءه (تطبيق، تدفق، ميزة…).",

  // CTA labels
  "cta.build": "إنشاء",
  "cta.export": "تصدير",
  "cta.clear": "مسح الدردشة",

  // Golden Conversion (رسائل النظام)
  gc_warning_last_free_message:
    "تبقّت لديك رسالة مجانية واحدة. بعد ذلك سيتم توجيهك إلى صفحة الدفع.",
  gc_payment_success_title: "تم الدفع بنجاح!",
  gc_payment_success_body:
    "تم تحديث التوكنز الخاصة بك. استمتع بمتابعة الدردشة.",
  gc_payment_success_button: "حسنًا",
  gc_please_login_to_continue: "يرجى تسجيل الدخول للمتابعة.",
  gc_overdraw_title: "رصيدك مستهلك.",
  gc_overdraw_body: "هذه الرسالة كانت ستجعل رصيدك سلبياً. قمنا بتغطية الفارق كخدمة مجاملة. يرجى إعادة الشحن للمتابعة.",
  gc_freegate_limit_reached: "لقد استخدمت ٩ رسائل مجانية.",
  gc_freegate_login_required: "يرجى تسجيل الدخول للمتابعة.",
  "chat.tokens.depleted_title": "رصيدك فارغ.",
  "chat.tokens.depleted_message": "سيتم الآن تحويلك إلى صفحة الدفع لشراء رموز جديدة.",
  "chat.tokens.depleted_redirect_label": "شراء رموز الآن",
  "support.button.label": "الدعم",
  "support.mail.subject": "طلب دعم: \"يرجى الإدخال\"",
  "support.mail.body": "يرجى وصف طلبك بأكبر قدر ممكن من الوضوح والاختصار.",

"triketon.button.label": "Triketon2048",
"triketon.button.tooltip": "موثّق · دليل الحقيقة",

"triketon.overlay.title": "Triketon2048 - رد موثّق",

"triketon.overlay.intro":
"تم ختم هذا الرد تشفيرياً. يمكن التحقق من صحته في أي وقت.",

"triketon.overlay.explainer":
"نحن لا نخزن محتوى هذا الرد على خوادمنا. يتم حفظ دليل رياضي على سلامته فقط - وليس النص نفسه أبداً.",

"triketon.overlay.ownership":
"كلماتك ملك لك. أنت وحدك من يملك حق الوصول إلى المحتوى الكامل.",

"triketon.overlay.data.title": "بيانات التحقق",

"triketon.overlay.data.public_key": "المفتاح العام",
"triketon.overlay.data.truth_hash": "تجزئة الحقيقة",
"triketon.overlay.data.timestamp": "الطابع الزمني",

"triketon.overlay.footer":
"Triketon2048 ليس ميزة. إنه وعد.",

"triketon.overlay.usecases.title": "لماذا هذا مهم",

"triketon.usecase.researcher.title": "للباحثين",
"triketon.usecase.researcher.body":
"بصفتك باحثاً، قد تحتاج إلى إثبات أن فرضية أو فكرة أو نتيجة كانت موجودة في وقت معين - دون نشر أو كشف عملك مبكراً. يتيح Triketon إثبات الأولوية دون إفصاح.",

"triketon.usecase.inventor.title": "للمخترعين",
"triketon.usecase.inventor.body":
"بصفتك مخترعاً، قد ترغب في إثبات أن فكرة ما نشأت منك - دون كشفها قبل أن تكون مستعداً. يقوم Triketon بختم الأفكار بدلاً من إخفائها ويثبت الملكية دون فقدان السيطرة.",

"triketon.usecase.creative.title": "للمبدعين",
"triketon.usecase.creative.body":
"بصفتك مبدعاً، قد ترغب في التأكد من أن كلماتك ملك لك - حتى عند مشاركتها رقمياً. يوفر Triketon دليلاً على التأليف دون علامات مائية أو منصات أو نقل للحقوق.",

"triketon.overlay.closing":
"إثبات بلا امتلاك. تحقق بلا مراقبة.",

  // Pillar sections (Smooth Operator)
  "pillar.section.header": "الأوضاع والخبراء",
  "pillar.section.modesTitle": "الأوضاع",

  "pillar.section.modes": "الأوضاع",
  "pillar.section.experts": "الخبراء",
  "pillar.section.systemTitle": "النظام",
  "pillar.section.system": "حالة النظام",
  "pillar.section.actionsTitle": "دردشة جديدة",
  "pillar.section.utility": "الإجراءات والتصدير",
  "pillar.section.archiveTitle": "الأرشيف",

  // Actions (export / delete)
  "actions.export.title": "تصدير الدردشة",
  "actions.export.help": "احفظ الدردشة كملف.",
  "actions.export.csv": "CSV",
  "actions.export.json": "JSON",

  "actions.delete.title": "حذف الدردشة",
  "actions.delete.warning":
    "سيتم حذف الدردشة بالكامل بشكل نهائي. إذا رغبت بالاحتفاظ بها، صدّرها كـ CSV أو JSON أولاً.",
  "actions.delete.now": "حذف",

  // ARIA
  exportCsvAria: "تصدير الدردشة بصيغة CSV",
  exportJsonAria: "تصدير الدردشة بصيغة JSON",
  clearChatAria: "مسح الدردشة",

  // ARIA / A11y
  conversationAria: "سجل الدردشة",
  assistantSays: "رسالة المساعد",
  youSaid: "رسالتك",
  columnAria: "العمود - التحكم والاختيار",
  mobileOverlayLabel: "واجهة العمود للجوال",
} as const;

const hi = {
  // Input / messaging
  writeMessage: "संदेश लिखें…",
  send: "भेजें",

  // Input helpers
  tools: "उपकरण",
  newline: "नई पंक्ति",
  comingUpload: "अपलोड",
  comingVoice: "वॉइस इनपुट",
  comingFunctions: "विकल्प",

  // Overlay header / buttons (mobile)
  close: "बंद करें",

  // Sidebar / Column
  columnTitle: "कॉलम",
  sectionControl: "नियंत्रण",
  onboarding: "ऑनबोर्डिंग",
  mDefault: "M · डिफ़ॉल्ट",
  selectMode: "मोड चुनें",
  council13: "काउंसिल 13",
  selectAI: "AI चुनें",
  modules: "मॉड्यूल",
  coming: "जल्द ही",

  // Sidebar additions (experts & CTA)
  selectExpert: "विशेषज्ञ चुनें",
  statusExpert: "विशेषज्ञ:",
  clearChat: "चैट साफ़ करें",
  startBuilding: "निर्माण शुरू करें",
  startBuildingMsg:
  "प्रत्येक श्रेणी के लिए 13 उदाहरण दें जो आपकी निर्माण क्षमता दिखाते हों। 2–6 वर्ष, 6–12 वर्ष के बच्चों और 30 वर्ष से ऊपर के पुरुषों के लिए बच्चों के खिलौनों के क्षेत्र का उपयोग करें, और इन्हें तालिका में दिखाएँ।",

  // Actions / footer
  export: "निर्यात",
  levels: "स्तर",
  levelsComing: "स्तर जल्द उपलब्ध होंगे",
  threadExported: "चैट निर्यात की गई।",

  // Status bar
  statusMode: "मोड:",
  statusAgent: "एजेंट:",

  // Backward-compat alias
  statusAI: "एजेंट:",

  // Status texts
  "status.modeSet": "मोड सेट किया गया: {label}.",

  // Modes – system buttons
  "mode.onboarding": "ऑनबोर्डिंग",
  "mode.council": "काउंसिल 13",
  "mode.default": "M · डिफ़ॉल्ट",
  "mode.select": "मोड चुनें",

  // Modes – character modes (11)
  "mode.research": "अनुसंधान",
  "mode.calm": "शांत",
  "mode.flow": "प्रवाह",
  "mode.truth": "सत्य",
  "mode.wisdom": "बुद्धि",
  "mode.play": "खेल",
  "mode.vision": "दृष्टि",
  "mode.empathy": "सहानुभूति",
  "mode.love": "प्रेम",
  "mode.joy": "आनंद",
  "mode.oracle": "ओरेकल",

  // Modes – categories
  "labels.modes.character": "चरित्र मोड",
  "modes.category.core": "कोर",
  "modes.category.intellectual": "बौद्धिक",
  "modes.category.creator": "रचनाकार",
  "modes.category.heart": "हृदय",
  "modes.category.spirit": "आत्मा",

  // Experts (used by Saeule.tsx)
  "experts.title": "विशेषज्ञ",
  "experts.choose": "विशेषज्ञ चुनें",

  // Expert categories
  "experts.category.life": "जीवन",
  "experts.category.tech": "तकनीक",
  "experts.category.space": "अंतरिक्ष",
  "experts.category.ethics": "नैतिकता",
  "experts.category.universe": "ब्रह्मांड",

  // Expert labels
  "experts.biologist": "जीवविज्ञानी",
  "experts.chemist": "रसायनज्ञ",
  "experts.physicist": "भौतिक विज्ञानी",
  "experts.computer_scientist": "कंप्यूटर वैज्ञानिक",
  "experts.jurist": "विधिवेत्ता",
  "experts.architect_civil_engineer": "वास्तुकार / सिविल इंजीनियर",
  "experts.landscape_designer": "लैंडस्केप डिज़ाइनर",
  "experts.interior_designer": "इंटीरियर डिज़ाइनर",
  "experts.electrical_engineer": "विद्युत अभियंता",
  "experts.mathematician": "गणितज्ञ",
  "experts.astrologer": "ज्योतिषी",
  "experts.weather_expert": "मौसम विशेषज्ञ",
  "experts.molecular_scientist": "अणु वैज्ञानिक",

  // CTA fallback
  "cta.fallback":
    "सब तैयार है - मुझे बताएं कि आप क्या बनाना चाहते हैं (ऐप, फ्लो, फीचर…).",

  // CTA labels
  "cta.build": "निर्माण",
  "cta.export": "निर्यात",
  "cta.clear": "चैट साफ़ करें",

  // Golden Conversion (सिस्टम संदेश)
  gc_warning_last_free_message:
    "आपके पास 1 मुफ्त संदेश शेष है। इसके बाद आपको चेकआउट पर भेज दिया जाएगा।",
  gc_payment_success_title: "भुगतान सफल रहा!",
  gc_payment_success_body:
    "आपके टोकन अपडेट कर दिए गए हैं। आगे चैट का आनंद लें।",
  gc_payment_success_button: "OK",
  gc_please_login_to_continue: "जारी रखने के लिए कृपया लॉगिन करें।",
  gc_overdraw_title: "आपका बैलेंस समाप्त हो गया है।",
  gc_overdraw_body: "यह संदेश आपके खाते को नकारात्मक में ले जाता। हमने शिष्टाचार स्वरूप अंतर को कवर किया है। आगे चैट जारी रखने के लिए कृपया रिचार्ज करें।",
  gc_freegate_limit_reached: "आपने सभी 9 मुफ्त संदेशों का उपयोग कर लिया है।",
  gc_freegate_login_required: "जारी रखने के लिए कृपया लॉगिन करें।",
  "chat.tokens.depleted_title": "आपका बैलेंस ख़त्म हो गया है।",
  "chat.tokens.depleted_message": "अब आपको नए टोकन खरीदने के लिए भुगतान पेज पर भेजा जाएगा।",
  "chat.tokens.depleted_redirect_label": "अभी टोकन ख़रीदें",
  "support.button.label": "सपोर्ट",
  "support.mail.subject": "सपोर्ट अनुरोध: \"कृपया भरें\"",
  "support.mail.body": "कृपया अपना अनुरोध जितना हो सके उतना स्पष्ट और संक्षेप में लिखें।",

"triketon.button.label": "Triketon2048",
"triketon.button.tooltip": "सत्यापित · सत्य का प्रमाण",

"triketon.overlay.title": "Triketon2048 - सत्यापित उत्तर",

"triketon.overlay.intro":
"इस उत्तर को क्रिप्टोग्राफ़िक रूप से सील किया गया है। इसकी प्रामाणिकता किसी भी समय सत्यापित की जा सकती है।",

"triketon.overlay.explainer":
"हम इस उत्तर की सामग्री को अपने सर्वरों पर संग्रहीत नहीं करते। केवल इसकी अखंडता का गणितीय प्रमाण रखा जाता है - स्वयं पाठ कभी नहीं।",

"triketon.overlay.ownership":
"आपके शब्द आपके हैं। पूर्ण सामग्री तक पहुँच केवल आपके पास है।",

"triketon.overlay.data.title": "सत्यापन डेटा",

"triketon.overlay.data.public_key": "सार्वजनिक कुंजी",
"triketon.overlay.data.truth_hash": "सत्य हैश",
"triketon.overlay.data.timestamp": "समय-मुद्रण",

"triketon.overlay.footer":
"Triketon2048 कोई सुविधा नहीं है। यह एक वादा है।",

"triketon.overlay.usecases.title": "यह क्यों महत्वपूर्ण है",

"triketon.usecase.researcher.title": "शोधकर्ताओं के लिए",
"triketon.usecase.researcher.body":
"एक शोधकर्ता के रूप में, आपको यह सिद्ध करने की आवश्यकता हो सकती है कि कोई परिकल्पना, विचार या परिणाम किसी निश्चित समय पर मौजूद था - बिना अपने कार्य को समय से पहले प्रकाशित या प्रकट किए। Triketon बिना प्रकटीकरण के प्राथमिकता और अखंडता सिद्ध करता है।",

"triketon.usecase.inventor.title": "आविष्कारकों के लिए",
"triketon.usecase.inventor.body":
"एक आविष्कारक के रूप में, आप यह सिद्ध करना चाह सकते हैं कि कोई विचार आपसे उत्पन्न हुआ - बिना उसे तैयार होने से पहले उजागर किए। Triketon विचारों को छिपाने के बजाय सील करता है और नियंत्रण खोए बिना रचनात्मक स्वामित्व सिद्ध करता है।",

"triketon.usecase.creative.title": "रचनाकारों के लिए",
"triketon.usecase.creative.body":
"एक रचनाकार के रूप में, आप यह सुनिश्चित करना चाह सकते हैं कि आपके शब्द आपके ही हैं - भले ही उन्हें डिजिटल रूप से साझा किया जाए। Triketon बिना वॉटरमार्क, प्लेटफ़ॉर्म या अधिकार हस्तांतरण के लेखकत्व का प्रमाण प्रदान करता है।",

"triketon.overlay.closing":
"स्वामित्व के बिना प्रमाण। निगरानी के बिना सत्यापन.",

  // Pillar sections (Smooth Operator)
  "pillar.section.header": "मोड और विशेषज्ञ",
  "pillar.section.modesTitle": "मोड",

  "pillar.section.modes": "मोड",
  "pillar.section.experts": "विशेषज्ञ",
  "pillar.section.systemTitle": "सिस्टम",
  "pillar.section.system": "सिस्टम स्थिति",
  "pillar.section.actionsTitle": "नई चैट",
  "pillar.section.utility": "क्रियाएँ और निर्यात",
  "pillar.section.archiveTitle": "संग्रह",

  // Actions (export / delete)
  "actions.export.title": "चैट निर्यात करें",
  "actions.export.help": "अपनी चैट को एक फ़ाइल के रूप में सहेजें।",
  "actions.export.csv": "CSV",
  "actions.export.json": "JSON",

  "actions.delete.title": "चैट हटाएँ",
  "actions.delete.warning":
    "यह कार्रवाई पूरी चैट को स्थायी रूप से हटा देगी। यदि आप इसे सहेजना चाहते हैं, तो पहले इसे CSV या JSON के रूप में निर्यात करें।",
  "actions.delete.now": "हटाएँ",

  // ARIA
  exportCsvAria: "चैट को CSV में निर्यात करें",
  exportJsonAria: "चैट को JSON में निर्यात करें",
  clearChatAria: "चैट हटाएँ",

  // ARIA / A11y
  conversationAria: "चैट लॉग",
  assistantSays: "सहायक संदेश",
  youSaid: "आपका संदेश",
  columnAria: "कॉलम - नियंत्रण और चयन",
  mobileOverlayLabel: "मोबाइल कॉलम ओवरले",
} as const;


// ... (oberer Kontext)
const DICTS = {
  en: en as Dict,
  de: de as Dict,
  fr: fr as Dict,
  es: es as Dict,
  it: it as Dict,
  pt: pt as Dict,
  nl: nl as Dict,
  ru: ru as Dict,
  zh: zh as Dict,
  ja: ja as Dict,
  ko: ko as Dict,
  ar: ar as Dict,
  hi: hi as Dict,
} as const;

// Prompt-Templates an Legacy-Dict anhängen (EN-only)
attachPrompts(DICTS as any);

// Doorman-Prompts an Legacy-Dict anhängen (13 Sprachen)
attachDoorman(DICTS as any);

// Kanonische Locale-Liste direkt aus DICTS abgeleitet
const DICT_KEYS = Object.keys(DICTS) as (keyof typeof DICTS)[];


// Zentraler Locale-Typ – exakt diese 13 Codes
export type Locale = (typeof DICT_KEYS)[number];

const STORAGE_KEY = "mpathy:locale";


// Mappt "de-AT" → "de"
function toBase(tag: string): string {
  return String(tag || "").toLowerCase().split("-")[0];
}


// Locale-Cache (wird nach dict-Init befüllt; vermeidet TDZ)
// (Kann später weiterhin von Subscription-UX genutzt werden, ist hier aber
// nicht mehr für den Kern-Typ ausschlaggebend.)
let UX_LOCALES: string[] = ["en"];

// Helper – ist diese Sprache im zentralen Kern unterstützt?
function isSupported(tag: string): tag is Locale {
  const base = toBase(tag);
  return DICT_KEYS.includes(base as Locale);
}


/** Aushandlung aus navigator.languages, navigator.language, <html lang> */
function negotiateLocaleFromBrowser(): string {
  try {
    if (typeof navigator !== "undefined" && Array.isArray((navigator as any).languages)) {
      for (const l of (navigator as any).languages) {
        const base = toBase(l);
        if (isSupported(base)) return base;
      }
    }
    if (typeof navigator !== "undefined" && navigator.language) {
      const base = toBase(navigator.language);
      if (isSupported(base)) return base;
    }
    if (typeof document !== "undefined" && document.documentElement?.lang) {
      const base = toBase(document.documentElement.lang);
      if (isSupported(base)) return base;
    }
  } catch { /* noop */ }
  return "en";
}



/** SSR-safe locale initialization */
function detectInitialLocale(): Locale {
  if (typeof window !== "undefined") {
    const explicit = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (explicit && isSupported(explicit)) return explicit;
  }
  const negotiated = negotiateLocaleFromBrowser();
  if (isSupported(negotiated)) return negotiated as Locale;
  return "en";
}


let currentLocale: Locale = detectInitialLocale();

/** Read current locale */
export function getLocale(): Locale {
  return currentLocale;
}

/** Set current locale (persists on client) - explizites Override */
export function setLocale(locale: Locale) {
  const base = toBase(locale);
  if (!isSupported(base)) return;
  currentLocale = base as Locale;

  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, currentLocale);

    // Spiegel: <html lang> folgt immer dem zentralen Sprachkern
    try {
      document.documentElement.lang = currentLocale;
    } catch {
      // kein Hard-Fail, falls document nicht verfügbar ist
    }

    window.dispatchEvent(
      new CustomEvent("mpathy:i18n:change", { detail: { locale: currentLocale } }),
    );
    window.dispatchEvent(new CustomEvent("mpathy:i18n:explicit"));
  }
}


/**
 * Translate key. Falls back to English, then to the key itself.
 * Keep the type open so unknown keys don't break the build.
 */
export function t(key: string): string {

  // Tipp: DICTS enthält legacy en/de, currentLocale ist string → typisierter Zugriff
  const uiDicts = DICTS as unknown as Record<string, Dict>;
  const ui = uiDicts[currentLocale] ?? en;                     // Legacy-UI

  const uxAll = (dict as unknown as Record<string, Record<string, string>>) ?? {};
  const ux = uxAll[currentLocale] ?? uxAll.en ?? {};           // Locale→EN Fallback

  const v =
    (ui as any)[key] ??
    (ux as any)[key] ??
    (en as any)[key] ??
    (uxAll.en ? (uxAll.en as any)[key] : undefined);

  return typeof v === "string" ? v : key;
}


/** Übersetzen mit Fallback-Text und einfachen Platzhaltern {name} */
export function tr(key: string, fallback: string, vars?: Record<string, string>): string {
  let out = t(key);
  if (out === key) out = fallback; // Fallback verwenden, wenn Key fehlt
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      out = out.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    }
  }
  return out;
}

/** Optional helper: list of available locales (automatisch aus DICTS) */
export const availableLocales: Locale[] = Object.keys(DICTS) as Locale[];

/** Reagiert auf Sprachwechsel im Browser/Dokument (ohne explizites Override) */
function attachLocaleWatchers() {
  if (typeof window === "undefined") return;

  // Wenn USER später setLocale() aufruft, setzen wir ein explizites Override.
  // Solange nicht explizit gesetzt, folgen wir Browser/DOM.
  let explicit = !!window.localStorage.getItem(STORAGE_KEY);

  // Beobachte Änderungen an <html lang="">
  try {
    const mo = new MutationObserver(() => {
      if (explicit) return;
      const next = negotiateLocaleFromBrowser() as Locale;
      if (next !== currentLocale) {
        currentLocale = next;
        window.dispatchEvent(new CustomEvent("mpathy:i18n:change", { detail: { locale: next } }));
      }
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  } catch { /* noop */ }

  // Reagiere auf Browser-Event languagechange (z. B. iOS/Android)
  window.addEventListener("languagechange", () => {
    if (explicit) return;
    const next = negotiateLocaleFromBrowser() as Locale;
    if (next !== currentLocale) {
      currentLocale = next;
      window.dispatchEvent(new CustomEvent("mpathy:i18n:change", { detail: { locale: next } }));
    }
  });

  // Wenn jemand später setLocale() nutzt, merken wir uns das als explizit.
  window.addEventListener("mpathy:i18n:explicit", () => {
    explicit = true;
  });
}

// --- Auto-Init (Client): folge Browser/DOM-Sprache, bis Nutzer explizit setLocale() ruft ---
if (typeof window !== "undefined") {
  // Falls <html lang> leer ist, mit Browser-Grundsprache befüllen (kosmetisch)
  try {
    if (!document.documentElement.lang) {
      document.documentElement.lang = toBase(negotiateLocaleFromBrowser());
    }
  } catch { /* noop */ }

  attachLocaleWatchers();
}

// ------------------------------------------------------------
// Subscription / Landing / UX Dict – Basisobjekt (13 Sprachen)
// ------------------------------------------------------------
export const dict: Record<string, Record<string, unknown>> = {
  en: {},
  de: {},
  fr: {},
  es: {},
  it: {},
  pt: {},
  nl: {},
  ru: {},
  zh: {},
  ja: {},
  ko: {},
  ar: {},
  hi: {},
};

// Hero / KPI / Testimonials an das Subscription-Dict anhängen
attachHero(dict as any);
attachKpi(dict as any);
attachTestimonials(dict as any);

// PowerPrompts an das Subscription-Dict anhängen
attachPowerPrompts(dict as any);

// UX_LOCALES nach vollständiger Dict-Initialisierung füllen
UX_LOCALES = Object.keys(dict);

export type UIDict = typeof dict;

/**
 * Smart dictionary selector:
 * - Wenn der Key mit "archive." oder "report." beginnt → i18nArchive
 * - sonst → normales UI-Dict
 */
export function getActiveDict(lang: string) {
  const base = (lang || "en").slice(0, 2).toLowerCase();
  const hasArchiveKey = (key: string) =>
    key.startsWith("archive.") || key.startsWith("report.");

  return {
    t: (key: string) => {
      if (hasArchiveKey(key)) {
        return (
          (i18nArchive as any)[base]?.archive?.[
            key.split(".").slice(1).join(".")
          ] ?? (i18nArchive as any).en.archive[key.split(".").slice(1).join(".")] ?? key
        );
      }
      // Default-UI-Dict
// Default-UI-Dict + dynamische Archive-Unterstützung
const baseDict = dict[base] ?? dict.en;
const value =
  key.split(".").reduce((acc: any, part) => acc?.[part], baseDict) ?? key;
return value;
    },
  };
}