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

  // Sidebar additions (experts & CTA)
  clearChat: "Clear chat",
  startBuilding: "build",
  startBuildingMsg: "Start Council13 – Truth Mode\n\nAsk me what I want to create first.\n\nAfter I answered, execute this:\n\n\"go into a Develop in exactly 13 iterations.\n\nCouncil13 governance: 10 members propose, 3 members act as jury, decisions require 2/3 jury consensus, jury votes must be explicitly reasoned.\n\nPer iteration: proposals may affect formula or production process. End each iteration with a KPI table using the same fixed KPIs and scale: Market Readiness, Completeness, Legal Readiness, Patentability, Causality.\n\nRules (Truth Mode): evidence-based only, no medical claims, no boundary crossing. If evidence is weak or emerging, state it explicitly.\n\nStart with Iteration 1 and guide me through the full process.\"",

 
  threadExported: "Thread exported.",

  // Modes – character modes (12)
  "mode.research": "RESEARCH",
  "mode.calm": "CALM",
  "mode.truth": "TRUTH",
  "mode.wisdom": "WISDOM",
  "mode.play": "PLAY",
  "mode.empathy": "EMPATHY",
  "mode.joy": "JOY",
  "mode.safety": "Safety",
  "mode.recovery":"Recovery",
  "mode.onboarding": "Onboarding",
  "mode.council": "Governance -> Council13",


  "labels.purpose": "Purpose:",
  "modes.notes": "Select mode by prompting “set MODENAME mode”.",

  "mode.onboarding.purpose":
  "You can ask about system features, available commands, or request step-by-step guidance for initial setup and usage.",

  "mode.research.purpose":
  "Executes the sealed evaluation loop - each input rated for clarity and meaning (1-10) with three outputs: understanding, insight, and comment.",

  "mode.truth.purpose":
  "Delivers verified, traceable facts for business decisions, ensuring auditability and regulatory transparency in every statement.",

  "mode.empathy.purpose":
  "Adapts responses to human tone and context, improving collaboration and clarity in emotionally charged or complex exchanges.",

  "mode.wisdom.purpose":
  "Synthesizes multiple viewpoints into balanced guidance - ideal for decision rounds or evaluating competing project directions.",

  "mode.calm.purpose":
  "Stabilizes workflows in high-load or uncertain situations, simplifying complex input to maintain operational clarity and focus.",

  "mode.safety.purpose":
  "Protects against unintended outputs or regulatory violations by enforcing strict compliance filters and real-time content control.",

  "mode.recovery.purpose":
  "Restores the workspace to a consistent, verifiable state after errors or interruptions, preserving data integrity and continuity.",

  "mode.play.purpose":
  "Enables exploratory ideation and prototyping without operational risk - ideal for testing logic, prompts, and creative hypotheses safely.",

  "mode.governance.purpose":
  "Provides an impartial evaluation of complex options through thirteen fixed perspectives - observation, comparison, and transparent reasoning only.",



  // Experts (used by Saeule.tsx)
  "experts.title": "Experts",

  "experts.descriptive.intro":
  "Select expert by prompting “consult EXPERTNAME expert”.",

  "experts.additional":
  "Additional experts: Biology, Chemistry, Physics, Molecular Science, Systems Theory, Mathematics, Statistics, Risk Analysis, Electrical Engineering, Meteorology, Architecture, Geopolitics.",


  // Expert labels (pillar – Experts list)
  "experts.computer-science.title": "Computer Science",
  "experts.computer-science.purpose":
  "Provides structured reasoning on algorithms, systems architecture, data structures, and software design.",

  "experts.psychology.title": "Psychology",
  "experts.psychology.purpose":
  "Supports analysis of human behavior, cognition, motivation, and decision-making contexts.",

  "experts.law.title": "Law",
  "experts.law.purpose":
  "Ensures legal reasoning, regulatory awareness, and compliance-oriented evaluation.",

  "experts.economics.title": "Economics",
  "experts.economics.purpose":
  "Analyzes incentives, trade-offs, markets, and economic impact of decisions.",

  "experts.engineering.title": "Engineering",
  "experts.engineering.purpose":
  "Applies practical problem-solving, system constraints, and feasibility analysis.",

  "experts.medicine.title": "Medicine",
  "experts.medicine.purpose":
  "Offers medically grounded context while strictly avoiding diagnosis or treatment claims.",

  "experts.information-security.title": "Information Security",
  "experts.information-security.purpose":
  "Evaluates risks, threat models, and safeguards related to data, systems, and operations.",


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
  gc_freegate_limit_reached: "Your exploratory access for today is complete.",
  gc_freegate_login_required: "You can continue tomorrow or log in to secure this workspace. After returning, type OK in the prompt to proceed to payment.",

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
  "This action permanently deletes the entire chat. Export CSV or JSON first if you want to keep it.",
"actions.delete.now": "Delete",


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
// Seitenleiste (Experten & CTA)
clearChat: "Chat löschen",
startBuilding: "Erstellen",
startBuildingMsg: "Starte Council13 – Wahrheitsmodus\n\nFrage mich zuerst, was ich erschaffen möchte.\n\nNachdem ich geantwortet habe, führe Folgendes aus:\n\n„Wechsle in einen Entwicklungsprozess mit genau 13 Iterationen.\n\nCouncil13-Governance: 10 Mitglieder schlagen vor, 3 Mitglieder agieren als Jury, Entscheidungen erfordern 2/3-Jurykonsens; Jury-Stimmen müssen begründet sein.\n\nPro Iteration: Vorschläge dürfen Formel oder Produktionsprozess beeinflussen. Beende jede Iteration mit einer KPI-Tabelle anhand fester Kennzahlen: Marktreife, Vollständigkeit, rechtliche Reife, Patentfähigkeit, Kausalität.\n\nRegeln (Wahrheitsmodus): Nur evidenzbasiert, keine medizinischen Aussagen, keine Grenzüberschreitungen. Wenn Evidenz schwach oder neu ist, muss dies ausdrücklich genannt werden.\n\nBeginne mit Iteration 1 und führe mich durch den gesamten Prozess.\"",

threadExported: "Thread exportiert.",

// Modi – Charaktermodi (12)
"mode.research": "RESEARCH",
"mode.calm": "RUHE",
"mode.truth": "WAHRHEIT",
"mode.wisdom": "WEISHEIT",
"mode.play": "SPIEL",
"mode.empathy": "EMPATHIE",
"mode.joy": "FREUDE",
"mode.safety": "SICHERHEIT",
"mode.recovery": "WIEDERHERSTELLUNG",
"mode.onboarding": "EINSTIEG",
"mode.council": "Governance → Council13",

"labels.purpose": "Zweck:",
"modes.notes": "Wähle einen Modus durch den Befehl „set MODENAME mode“.",

"mode.onboarding.purpose":
"Ermöglicht Fragen zu Systemfunktionen, verfügbaren Befehlen oder eine schrittweise Einführung.",

"mode.research.purpose":
"Führt den versiegelten Bewertungszyklus aus – jeder Input wird nach Klarheit und Bedeutung (1–10) bewertet, mit drei Ausgaben: Verständnis, Einsicht und Kommentar.",

"mode.truth.purpose":
"Liefert verifizierte, nachvollziehbare Fakten für Geschäftsentscheidungen – auditierbar und regelkonform.",

"mode.empathy.purpose":
"Passt Antworten an Tonfall und Kontext an – verbessert Zusammenarbeit und Klarheit in komplexen Situationen.",

"mode.wisdom.purpose":
"Verbindet verschiedene Perspektiven zu ausgewogener Orientierung – hilfreich für Entscheidungsrunden.",

"mode.calm.purpose":
"Stabilisiert Arbeitsabläufe bei hoher Belastung oder Unsicherheit – reduziert Komplexität und erhält Fokus.",

"mode.safety.purpose":
"Schützt vor fehlerhaften oder regelwidrigen Ausgaben durch Compliance-Filter in Echtzeit.",

"mode.recovery.purpose":
"Stellt nach Fehlern oder Unterbrechungen einen konsistenten Zustand wieder her und bewahrt Datenintegrität.",

"mode.play.purpose":
"Ermöglicht kreatives, risikofreies Erkunden und Prototyping von Ideen.",

"mode.governance.purpose":
"Bietet eine unparteiische Bewertung komplexer Optionen durch dreizehn feste Perspektiven – Beobachtung, Vergleich und transparente Begründung.",

// Experten (verwendet in Saeule.tsx)
"experts.title": "Experten",

// de
"experts.descriptive.intro":
  "Expertenauswahl durch Eingabe von „konsultiere EXPERTENNAME experte“.",



"experts.additional":
"Weitere Experten: Biologie, Chemie, Physik, Molekularwissenschaft, Systemtheorie, Mathematik, Statistik, Risikoanalyse, Elektrotechnik, Meteorologie, Architektur, Geopolitik.",

// Expertenbezeichnungen (Säule – Expertenliste)
"experts.computer-science.title": "Informatik",
"experts.computer-science.purpose":
"Bietet strukturierte Analysen zu Algorithmen, Systemarchitekturen, Datenstrukturen und Software-Design.",

"experts.psychology.title": "Psychologie",
"experts.psychology.purpose":
"Unterstützt die Analyse menschlichen Verhaltens, Denkens und Entscheidens im Kontext.",

"experts.law.title": "Recht",
"experts.law.purpose":
"Sichert juristische Argumentation, Regulierungsbewusstsein und Compliance-Bewertung.",

"experts.economics.title": "Ökonomie",
"experts.economics.purpose":
"Analysiert Anreize, Märkte und wirtschaftliche Auswirkungen von Entscheidungen.",

"experts.engineering.title": "Ingenieurwesen",
"experts.engineering.purpose":
"Bewertet technische Systeme, Machbarkeit und Prozesslogik.",

"experts.medicine.title": "Medizin",
"experts.medicine.purpose":
"Stellt wissenschaftlichen Kontext medizinischer Daten bereit, ohne Diagnosen oder Therapien.",

"experts.information-security.title": "Informationssicherheit",
"experts.information-security.purpose":
"Bewertet Risiken, Bedrohungsmodelle und Schutzmechanismen von Daten und Systemen.",


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
  gc_freegate_limit_reached: "Dein explorativer Zugang für heute ist abgeschlossen.",
  gc_freegate_login_required: "Du kannst morgen fortfahren oder dich einloggen, um diesen Arbeitsbereich zu sichern. Nach der Rückkehr gib OK in das Eingabefeld ein, um zur Zahlung weiterzugehen.",

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
"actions.export.help": "Speichern Sie Ihren Chat als Datei.",
"actions.export.csv": "CSV",
"actions.export.json": "JSON",

"actions.delete.title": "Chat löschen",
"actions.delete.warning":
  "Dieser Vorgang löscht den gesamten Chat dauerhaft. Exportieren Sie zuvor CSV oder JSON, wenn Sie ihn behalten möchten.",
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

  // Ajouts à la barre latérale (experts et CTA)
clearChat: "Effacer la conversation",
startBuilding: "Construire",
startBuildingMsg: "Démarrer Council13 – Mode Vérité\n\nDemande-moi d'abord ce que je veux créer.\n\nAprès ma réponse, exécute ceci :\n\n« Entre en développement en exactement 13 itérations.\n\nGouvernance Council13 : 10 membres proposent, 3 membres agissent comme jury, les décisions nécessitent un consensus de 2/3 du jury ; les votes doivent être explicitement motivés.\n\nPar itération : les propositions peuvent affecter la formule ou le processus de production. Termine chaque itération par un tableau KPI avec ces indicateurs fixes : Préparation du marché, Complétude, Conformité légale, Brevetabilité, Causalité.\n\nRègles (Mode Vérité) : uniquement fondé sur des preuves, sans allégations médicales ni dépassement de limites. Si les preuves sont faibles ou émergentes, indique-le clairement.\n\nCommence avec l’itération 1 et guide-moi à travers tout le processus. »",

threadExported: "Fil exporté.",

// Modes – modes de caractère (12)
"mode.research": "RECHERCHE",
"mode.calm": "CALME",
"mode.truth": "VÉRITÉ",
"mode.wisdom": "SAGESSE",
"mode.play": "JEU",
"mode.empathy": "EMPATIE",
"mode.joy": "JOIE",
"mode.safety": "SÉCURITÉ",
"mode.recovery": "RÉTABLISSEMENT",
"mode.onboarding": "INTRODUCTION",
"mode.council": "Gouvernance → Council13",

"labels.purpose": "But :",
"modes.notes": "Sélectionne un mode avec la commande « set MODENAME mode ».",

"mode.onboarding.purpose":
"Permet de découvrir les fonctions du système, les commandes disponibles et une assistance étape par étape.",

"mode.research.purpose":
"Exécute le cycle d’évaluation scellé – chaque entrée est notée pour clarté et signification (1–10) avec trois sorties : compréhension, aperçu et commentaire.",

"mode.truth.purpose":
"Fournit des faits vérifiés et traçables pour la prise de décision, garantissant auditabilité et transparence réglementaire.",

"mode.empathy.purpose":
"Adapte les réponses au ton et au contexte humain pour améliorer la communication et la coopération.",

"mode.wisdom.purpose":
"Combine plusieurs perspectives pour offrir des conseils équilibrés et réfléchis.",

"mode.calm.purpose":
"Stabilise les flux de travail en cas de surcharge ou d’incertitude – simplifie et préserve la clarté opérationnelle.",

"mode.safety.purpose":
"Protège contre les sorties involontaires ou non conformes via des filtres de conformité en temps réel.",

"mode.recovery.purpose":
"Restaure l’environnement de travail à un état cohérent et vérifiable après une erreur ou une interruption.",

"mode.play.purpose":
"Favorise l’exploration créative et la conception de prototypes sans risque opérationnel.",

"mode.governance.purpose":
"Fournit une évaluation impartiale des options complexes via treize perspectives fixes – observation, comparaison et raisonnement transparent uniquement.",

// Experts (utilisé par Saeule.tsx)
"experts.title": "Experts",

// fr
"experts.descriptive.intro":
  "Sélectionnez un expert en saisissant « consulter NOM_EXPERT expert ».",



"experts.additional":
"Autres experts : Biologie, Chimie, Physique, Science moléculaire, Théorie des systèmes, Mathématiques, Statistiques, Analyse des risques, Génie électrique, Météorologie, Architecture, Géopolitique.",

// Libellés d’experts (colonne – liste des experts)
"experts.computer-science.title": "Informatique",
"experts.computer-science.purpose":
"Fournit une analyse structurée des algorithmes, architectures systèmes, structures de données et conception logicielle.",

"experts.psychology.title": "Psychologie",
"experts.psychology.purpose":
"Soutient l’analyse du comportement humain, de la cognition et des processus décisionnels.",

"experts.law.title": "Droit",
"experts.law.purpose":
"Assure le raisonnement juridique, la connaissance réglementaire et l’évaluation de conformité.",

"experts.economics.title": "Économie",
"experts.economics.purpose":
"Analyse les incitations, les marchés et l’impact économique des décisions.",

"experts.engineering.title": "Génie",
"experts.engineering.purpose":
"Évalue les systèmes techniques, la faisabilité et la logique des processus.",

"experts.medicine.title": "Médecine",
"experts.medicine.purpose":
"Fournit un contexte scientifique médical sans diagnostic ni recommandation thérapeutique.",

"experts.information-security.title": "Sécurité de l’information",
"experts.information-security.purpose":
"Évalue les risques, modèles de menace et mesures de protection des données et systèmes.",


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
  gc_freegate_limit_reached: "Votre accès exploratoire pour aujourd’hui est terminé.",
  gc_freegate_login_required: "Vous pouvez continuer demain ou vous connecter pour sécuriser cet espace de travail. Après votre retour, saisissez OK dans le champ de saisie pour accéder au paiement.",

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
"actions.export.help": "Enregistrez votre chat en tant que fichier.",
"actions.export.csv": "CSV",
"actions.export.json": "JSON",

"actions.delete.title": "Supprimer le chat",
"actions.delete.warning":
  "Cette action supprime définitivement l’intégralité du chat. Exportez en CSV ou JSON si vous souhaitez le conserver.",
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

  // Barra lateral (expertos y CTA)
clearChat: "Borrar chat",
startBuilding: "Construir",
startBuildingMsg: "Iniciar Council13 – Modo Verdad\n\nPregúntame primero qué quiero crear.\n\nDespués de responder, ejecuta lo siguiente:\n\n«Entrar en desarrollo en exactamente 13 iteraciones.\n\nGobernanza Council13: 10 miembros proponen, 3 miembros actúan como jurado, las decisiones requieren consenso de 2/3; los votos del jurado deben estar razonados explícitamente.\n\nPor iteración: las propuestas pueden afectar la fórmula o el proceso de producción. Termina cada iteración con una tabla KPI usando estas métricas fijas: Preparación de mercado, Integridad, Conformidad legal, Patentabilidad, Causalidad.\n\nReglas (Modo Verdad): solo basado en evidencia, sin afirmaciones médicas ni cruces de límites. Si la evidencia es débil o emergente, indícalo claramente.\n\nComienza con la Iteración 1 y guíame a través de todo el proceso.»",

threadExported: "Hilo exportado.",

// Modos – modos de carácter (12)
"mode.research": "INVESTIGACIÓN",
"mode.calm": "CALMA",
"mode.truth": "VERDAD",
"mode.wisdom": "SABIDURÍA",
"mode.play": "JUEGO",
"mode.empathy": "EMPATÍA",
"mode.joy": "ALEGRÍA",
"mode.safety": "SEGURIDAD",
"mode.recovery": "RECUPERACIÓN",
"mode.onboarding": "INICIO",
"mode.council": "Gobernanza → Council13",

"labels.purpose": "Propósito:",
"modes.notes": "Selecciona un modo usando «set MODENAME mode».",

"mode.onboarding.purpose":
"Permite preguntar sobre funciones del sistema, comandos disponibles o recibir orientación paso a paso.",

"mode.research.purpose":
"Ejecuta el ciclo de evaluación sellado: cada entrada se califica por claridad y significado (1–10) con tres salidas: comprensión, conocimiento y comentario.",

"mode.truth.purpose":
"Entrega hechos verificados y trazables para decisiones empresariales, asegurando auditoría y transparencia regulatoria.",

"mode.empathy.purpose":
"Adapta las respuestas al tono y contexto humano para mejorar la colaboración y la claridad.",

"mode.wisdom.purpose":
"Combina múltiples perspectivas para ofrecer orientación equilibrada y reflexiva.",

"mode.calm.purpose":
"Estabiliza flujos de trabajo en situaciones de alta carga o incertidumbre, manteniendo claridad operativa.",

"mode.safety.purpose":
"Protege contra salidas involuntarias o incumplimientos mediante filtros de cumplimiento en tiempo real.",

"mode.recovery.purpose":
"Restaura el entorno de trabajo a un estado coherente y verificable después de errores o interrupciones.",

"mode.play.purpose":
"Facilita la ideación creativa y la creación de prototipos sin riesgo operativo.",

"mode.governance.purpose":
"Ofrece evaluación imparcial de opciones complejas a través de trece perspectivas fijas: observación, comparación y razonamiento transparente.",

// Expertos (usado en Saeule.tsx)
"experts.title": "Expertos",

// es
"experts.descriptive.intro":
  "Seleccione un experto escribiendo « consultar NOMBRE_EXPERTO experto ».",


"experts.additional":
"Expertos adicionales: Biología, Química, Física, Ciencia Molecular, Teoría de Sistemas, Matemáticas, Estadística, Análisis de Riesgos, Ingeniería Eléctrica, Meteorología, Arquitectura, Geopolítica.",

// Etiquetas de expertos (columna – lista de expertos)
"experts.computer-science.title": "Informática",
"experts.computer-science.purpose":
"Proporciona razonamiento estructurado sobre algoritmos, arquitecturas de sistemas y diseño de software.",

"experts.psychology.title": "Psicología",
"experts.psychology.purpose":
"Apoya el análisis del comportamiento humano, la cognición y la toma de decisiones.",

"experts.law.title": "Derecho",
"experts.law.purpose":
"Garantiza razonamiento jurídico, conocimiento normativo y evaluación de cumplimiento.",

"experts.economics.title": "Economía",
"experts.economics.purpose":
"Analiza incentivos, mercados e impactos económicos de las decisiones.",

"experts.engineering.title": "Ingeniería",
"experts.engineering.purpose":
"Evalúa sistemas técnicos, viabilidad y lógica de procesos.",

"experts.medicine.title": "Medicina",
"experts.medicine.purpose":
"Ofrece contexto médico basado en evidencia sin diagnóstico ni tratamiento.",

"experts.information-security.title": "Seguridad de la Información",
"experts.information-security.purpose":
"Evalúa riesgos, modelos de amenazas y medidas de protección de datos y sistemas.",


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
  gc_freegate_limit_reached: "Tu acceso exploratorio por hoy ha finalizado.",
  gc_freegate_login_required: "Puedes continuar mañana o iniciar sesión para asegurar este espacio de trabajo. Al volver, escribe OK en el campo de entrada para continuar con el pago.",

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
"actions.export.help": "Guarde su chat como archivo.",
"actions.export.csv": "CSV",
"actions.export.json": "JSON",

"actions.delete.title": "Eliminar chat",
"actions.delete.warning":
  "Esta acción elimina permanentemente todo el chat. Exporte en CSV o JSON si desea conservarlo.",
"actions.delete.now": "Eliminar",


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

  // Barra laterale (esperti e CTA)
clearChat: "Cancella chat",
startBuilding: "Crea",
startBuildingMsg: "Avvia Council13 – Modalità Verità\n\nChiedimi prima cosa voglio creare.\n\nDopo la mia risposta, esegui quanto segue:\n\n«Entra in sviluppo in esattamente 13 iterazioni.\n\nGovernance Council13: 10 membri propongono, 3 membri fungono da giuria; le decisioni richiedono il consenso dei 2/3 della giuria e ogni voto deve essere motivato.\n\nPer ogni iterazione: le proposte possono influenzare la formula o il processo produttivo. Concludi ogni iterazione con una tabella KPI basata su metriche fisse: Prontezza al mercato, Completezza, Conformità legale, Brevettabilità, Causalità.\n\nRegole (Modalità Verità): solo basato su prove, nessuna affermazione medica o oltrepassamento di limiti. Se le prove sono deboli o emergenti, dichiaralo chiaramente.\n\nInizia con l’Iterazione 1 e guidami attraverso l’intero processo.»",

threadExported: "Thread esportato.",

// Modalità – modalità caratteriali (12)
"mode.research": "RICERCA",
"mode.calm": "CALMA",
"mode.truth": "VERITÀ",
"mode.wisdom": "SAGGEZZA",
"mode.play": "GIOCO",
"mode.empathy": "EMPATIA",
"mode.joy": "GIOIA",
"mode.safety": "SICUREZZA",
"mode.recovery": "RECUPERO",
"mode.onboarding": "INTRODUZIONE",
"mode.council": "Governance → Council13",

"labels.purpose": "Scopo:",
"modes.notes": "Seleziona una modalità con «set MODENAME mode».",

"mode.onboarding.purpose":
"Consente di esplorare le funzioni del sistema, i comandi disponibili o una guida passo dopo passo.",

"mode.research.purpose":
"Esegue il ciclo di valutazione sigillato – ogni input è valutato per chiarezza e significato (1–10) con tre output: comprensione, intuizione e commento.",

"mode.truth.purpose":
"Fornisce fatti verificati e tracciabili per decisioni aziendali, garantendo auditabilità e trasparenza normativa.",

"mode.empathy.purpose":
"Adatta le risposte al tono e al contesto umano per migliorare collaborazione e chiarezza.",

"mode.wisdom.purpose":
"Unisce diverse prospettive per offrire una guida equilibrata e ponderata.",

"mode.calm.purpose":
"Stabilizza i flussi di lavoro in situazioni di stress o incertezza, mantenendo la chiarezza operativa.",

"mode.safety.purpose":
"Protegge da output involontari o non conformi grazie a filtri di conformità in tempo reale.",

"mode.recovery.purpose":
"Ripristina l’ambiente di lavoro a uno stato coerente e verificabile dopo errori o interruzioni.",

"mode.play.purpose":
"Permette l’esplorazione creativa e la prototipazione senza rischi operativi.",

"mode.governance.purpose":
"Offre una valutazione imparziale di opzioni complesse attraverso tredici prospettive fisse: osservazione, confronto e ragionamento trasparente.",

// Esperti (usato in Saeule.tsx)
"experts.title": "Esperti",

// it
"experts.descriptive.intro":
  "Seleziona un esperto digitando « consulta NOME_ESPERTO esperto ».",


"experts.additional":
"Altri esperti: Biologia, Chimica, Fisica, Scienza Molecolare, Teoria dei Sistemi, Matematica, Statistica, Analisi del Rischio, Ingegneria Elettrica, Meteorologia, Architettura, Geopolitica.",

// Etichette esperti (colonna – lista esperti)
"experts.computer-science.title": "Informatica",
"experts.computer-science.purpose":
"Fornisce analisi strutturate di algoritmi, architetture di sistema e progettazione software.",

"experts.psychology.title": "Psicologia",
"experts.psychology.purpose":
"Sostiene l’analisi del comportamento umano, della cognizione e dei processi decisionali.",

"experts.law.title": "Diritto",
"experts.law.purpose":
"Assicura il ragionamento giuridico, la consapevolezza normativa e la valutazione di conformità.",

"experts.economics.title": "Economia",
"experts.economics.purpose":
"Analizza incentivi, mercati e impatti economici delle decisioni.",

"experts.engineering.title": "Ingegneria",
"experts.engineering.purpose":
"Valuta sistemi tecnici, fattibilità e logica dei processi.",

"experts.medicine.title": "Medicina",
"experts.medicine.purpose":
"Offre contesto medico scientifico senza diagnosi o trattamenti.",

"experts.information-security.title": "Sicurezza delle Informazioni",
"experts.information-security.purpose":
"Valuta rischi, modelli di minaccia e misure di protezione dei dati e dei sistemi.",


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
  gc_freegate_limit_reached: "Il tuo accesso esplorativo per oggi è terminato.",
  gc_freegate_login_required: "Puoi continuare domani oppure accedere per proteggere questo spazio di lavoro. Al ritorno, digita OK nel campo di input per procedere al pagamento.",

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
"actions.export.help": "Salvi il chat come file.",
"actions.export.csv": "CSV",
"actions.export.json": "JSON",

"actions.delete.title": "Elimina chat",
"actions.delete.warning":
  "Questa azione elimina definitivamente l’intero chat. Esporti CSV o JSON se desidera conservarlo.",
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

  // Barra lateral (especialistas e CTA)
clearChat: "Limpar chat",
startBuilding: "Criar",
startBuildingMsg: "Iniciar Council13 – Modo Verdade\n\nPergunta-me primeiro o que quero criar.\n\nDepois da resposta, executa o seguinte:\n\n«Entrar em desenvolvimento em exatamente 13 iterações.\n\nGovernança Council13: 10 membros propõem, 3 membros atuam como júri; as decisões requerem consenso de 2/3 do júri e cada voto deve ser justificado.\n\nPor iteração: as propostas podem afetar a fórmula ou o processo de produção. Termina cada iteração com uma tabela KPI usando estas métricas fixas: Prontidão de mercado, Completude, Conformidade legal, Patenteabilidade, Causalidade.\n\nRegras (Modo Verdade): baseado apenas em evidências, sem afirmações médicas ou ultrapassar limites. Se as evidências forem fracas ou emergentes, indica isso claramente.\n\nComeça com a Iteração 1 e guia-me por todo o processo.»",

threadExported: "Tópico exportado.",

// Modos – modos de caráter (12)
"mode.research": "PESQUISA",
"mode.calm": "CALMA",
"mode.truth": "VERDADE",
"mode.wisdom": "SABEDORIA",
"mode.play": "JOGO",
"mode.empathy": "EMPATIA",
"mode.joy": "ALEGRIA",
"mode.safety": "SEGURANÇA",
"mode.recovery": "RECUPERAÇÃO",
"mode.onboarding": "INTRODUÇÃO",
"mode.council": "Governança → Council13",

"labels.purpose": "Propósito:",
"modes.notes": "Seleciona um modo usando «set MODENAME mode».",

"mode.onboarding.purpose":
"Permite explorar as funções do sistema, comandos disponíveis ou receber orientação passo a passo.",

"mode.research.purpose":
"Executa o ciclo de avaliação selado – cada entrada é classificada por clareza e significado (1–10) com três saídas: compreensão, perceção e comentário.",

"mode.truth.purpose":
"Fornece factos verificados e rastreáveis para decisões empresariais, garantindo auditoria e transparência regulatória.",

"mode.empathy.purpose":
"Adapta respostas ao tom e contexto humanos, melhorando colaboração e clareza.",

"mode.wisdom.purpose":
"Combina várias perspetivas para fornecer orientação equilibrada e refletida.",

"mode.calm.purpose":
"Estabiliza fluxos de trabalho sob carga ou incerteza, mantendo a clareza operacional.",

"mode.safety.purpose":
"Protege contra saídas indesejadas ou não conformes com filtros de conformidade em tempo real.",

"mode.recovery.purpose":
"Restaura o ambiente de trabalho a um estado coerente e verificável após erros ou interrupções.",

"mode.play.purpose":
"Permite exploração criativa e prototipagem sem risco operacional.",

"mode.governance.purpose":
"Fornece uma avaliação imparcial de opções complexas através de treze perspetivas fixas – observação, comparação e raciocínio transparente apenas.",

// Especialistas (utilizado em Saeule.tsx)
"experts.title": "Especialistas",

// pt
"experts.descriptive.intro":
  "Selecione um especialista digitando « consultar NOME_ESPECIALISTA especialista ».",


"experts.additional":
"Outros especialistas: Biologia, Química, Física, Ciência Molecular, Teoria de Sistemas, Matemática, Estatística, Análise de Risco, Engenharia Elétrica, Meteorologia, Arquitetura, Geopolítica.",

// Etiquetas de especialistas (coluna – lista de especialistas)
"experts.computer-science.title": "Informática",
"experts.computer-science.purpose":
"Fornece raciocínio estruturado sobre algoritmos, arquitetura de sistemas e design de software.",

"experts.psychology.title": "Psicologia",
"experts.psychology.purpose":
"Apoia a análise do comportamento humano, cognição e tomada de decisões.",

"experts.law.title": "Direito",
"experts.law.purpose":
"Garante raciocínio jurídico, conhecimento regulatório e avaliação de conformidade.",

"experts.economics.title": "Economia",
"experts.economics.purpose":
"Analisa incentivos, mercados e impactos económicos das decisões.",

"experts.engineering.title": "Engenharia",
"experts.engineering.purpose":
"Avalia sistemas técnicos, viabilidade e lógica de processos.",

"experts.medicine.title": "Medicina",
"experts.medicine.purpose":
"Fornece contexto médico científico sem diagnóstico ou tratamento.",

"experts.information-security.title": "Segurança da Informação",
"experts.information-security.purpose":
"Avalia riscos, modelos de ameaças e medidas de proteção de dados e sistemas.",


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
  gc_freegate_limit_reached: "O seu acesso exploratório de hoje foi concluído.",
  gc_freegate_login_required: "Você pode continuar amanhã ou fazer login para proteger este espaço de trabalho. Ao retornar, digite OK no campo de entrada para prosseguir para o pagamento.",

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
"actions.export.help": "Guarde seu chat como arquivo.",
"actions.export.csv": "CSV",
"actions.export.json": "JSON",

"actions.delete.title": "Excluir chat",
"actions.delete.warning":
  "Esta ação exclui permanentemente todo o chat. Exporte CSV ou JSON se desejar mantê-lo.",
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

  // Zijbalk (experts en CTA)
clearChat: "Chat wissen",
startBuilding: "Bouwen",
startBuildingMsg: "Start Council13 – Waarheidsmodus\n\nVraag me eerst wat ik wil creëren.\n\nNa mijn antwoord voer je het volgende uit:\n\n«Ga de ontwikkelingsfase in met precies 13 iteraties.\n\nCouncil13-governance: 10 leden doen voorstellen, 3 leden fungeren als jury; beslissingen vereisen tweederdemeerderheid van de jury en alle stemmen moeten worden gemotiveerd.\n\nPer iteratie: voorstellen kunnen de formule of het productieproces beïnvloeden. Sluit elke iteratie af met een KPI-tabel met vaste indicatoren: Marktrijpheid, Volledigheid, Juridische gereedheid, Octrooieerbaarheid, Oorzakelijkheid.\n\nRegels (Waarheidsmodus): alleen op bewijs gebaseerd, geen medische claims of grensoverschrijdingen. Als bewijs zwak of opkomend is, geef dat expliciet aan.\n\nBegin met Iteratie 1 en leid me door het hele proces.»",

threadExported: "Thread geëxporteerd.",

// Modi – karaktermodi (12)
"mode.research": "ONDERZOEK",
"mode.calm": "KALMTE",
"mode.truth": "WAARHEID",
"mode.wisdom": "WIJSHEID",
"mode.play": "SPEL",
"mode.empathy": "EMPATHIE",
"mode.joy": "VREUGDE",
"mode.safety": "VEILIGHEID",
"mode.recovery": "HERSTEL",
"mode.onboarding": "INTRODUCTIE",
"mode.council": "Governance → Council13",

"labels.purpose": "Doel:",
"modes.notes": "Selecteer een modus met «set MODENAME mode».",

"mode.onboarding.purpose":
"Maakt het mogelijk om te vragen naar systeemfuncties, beschikbare commando’s of stapsgewijze begeleiding.",

"mode.research.purpose":
"Voert de verzegelde evaluatielus uit – elke invoer wordt beoordeeld op duidelijkheid en betekenis (1–10) met drie resultaten: begrip, inzicht en commentaar.",

"mode.truth.purpose":
"Levert geverifieerde, traceerbare feiten voor zakelijke beslissingen, met auditbaarheid en transparantie.",

"mode.empathy.purpose":
"Past antwoorden aan toon en context aan om samenwerking en duidelijkheid te verbeteren.",

"mode.wisdom.purpose":
"Combineert meerdere perspectieven om evenwichtige en doordachte begeleiding te bieden.",

"mode.calm.purpose":
"Stabiliseert workflows bij hoge belasting of onzekerheid en behoudt operationele helderheid.",

"mode.safety.purpose":
"Beschermt tegen ongewenste of niet-conforme output via realtime nalevingsfilters.",

"mode.recovery.purpose":
"Herstelt de werkomgeving naar een consistente, verifieerbare staat na fouten of onderbrekingen.",

"mode.play.purpose":
"Stimuleert creatieve verkenning en prototyping zonder operationeel risico.",

"mode.governance.purpose":
"Biedt een onpartijdige evaluatie van complexe opties via dertien vaste perspectieven – observatie, vergelijking en transparant redeneren.",

// Experts (gebruikt in Saeule.tsx)
"experts.title": "Experts",

// nl
"experts.descriptive.intro":
  "Selecteer een expert door « raadpleeg EXPERTNAAM expert » in te voeren.",

"experts.additional":
"Aanvullende experts: Biologie, Chemie, Fysica, Moleculaire Wetenschap, Systeemtheorie, Wiskunde, Statistiek, Risicoanalyse, Elektrotechniek, Meteorologie, Architectuur, Geopolitiek.",

// Expertlabels (kolom – lijst experts)
"experts.computer-science.title": "Informatica",
"experts.computer-science.purpose":
"Levert gestructureerd inzicht in algoritmen, systeemarchitecturen en softwareontwerp.",

"experts.psychology.title": "Psychologie",
"experts.psychology.purpose":
"Ondersteunt de analyse van menselijk gedrag, cognitie en besluitvorming.",

"experts.law.title": "Recht",
"experts.law.purpose":
"Zorgt voor juridische redenering, kennis van regelgeving en nalevingsbeoordeling.",

"experts.economics.title": "Economie",
"experts.economics.purpose":
"Analyseert prikkels, markten en economische gevolgen van beslissingen.",

"experts.engineering.title": "Techniek",
"experts.engineering.purpose":
"Evalueert technische systemen, haalbaarheid en proceslogica.",

"experts.medicine.title": "Geneeskunde",
"experts.medicine.purpose":
"Biedt wetenschappelijke medische context zonder diagnose of behandeling.",

"experts.information-security.title": "Informatieveiligheid",
"experts.information-security.purpose":
"Beoordeelt risico’s, dreigingsmodellen en beveiligingsmaatregelen voor gegevens en systemen.",


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
  gc_freegate_limit_reached: "Je verkennende toegang voor vandaag is voltooid.",
  gc_freegate_login_required: "Je kunt morgen verdergaan of inloggen om deze werkruimte te beveiligen. Typ na terugkeer OK in het invoerveld om door te gaan naar betaling.",

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
"actions.export.help": "Sla uw chat op als bestand.",
"actions.export.csv": "CSV",
"actions.export.json": "JSON",

"actions.delete.title": "Chat verwijderen",
"actions.delete.warning":
  "Deze actie verwijdert de volledige chat permanent. Exporteer eerst CSV of JSON als u deze wilt behouden.",
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

  // Боковая панель (эксперты и CTA)
clearChat: "Очистить чат",
startBuilding: "Создать",
startBuildingMsg: "Запуск Council13 – Режим Истина\n\nСначала спроси, что я хочу создать.\n\nПосле ответа выполни следующее:\n\n«Перейди в разработку ровно на 13 итераций.\n\nУправление Council13: 10 участников предлагают идеи, 3 выступают в роли жюри; решения принимаются при консенсусе 2/3, голоса должны быть обоснованы.\n\nНа каждой итерации предложения могут влиять на формулу или производственный процесс. Заверши итерацию таблицей KPI с фиксированными показателями: Рыночная готовность, Полнота, Юридическая готовность, Патентоспособность, Причинность.\n\nПравила (Режим Истина): только на основе доказательств, без медицинских утверждений или нарушений границ. Если доказательства слабы или новые, укажи это явно.\n\nНачни с Итерации 1 и проведи меня через весь процесс.»",

threadExported: "Тред экспортирован.",

// Режимы – характерные режимы (12)
"mode.research": "ИССЛЕДОВАНИЕ",
"mode.calm": "СПОКОЙСТВИЕ",
"mode.truth": "ИСТИНА",
"mode.wisdom": "МУДРОСТЬ",
"mode.play": "ИГРА",
"mode.empathy": "ЭМПАТИЯ",
"mode.joy": "РАДОСТЬ",
"mode.safety": "БЕЗОПАСНОСТЬ",
"mode.recovery": "ВОССТАНОВЛЕНИЕ",
"mode.onboarding": "ВВЕДЕНИЕ",
"mode.council": "Управление → Council13",

"labels.purpose": "Цель:",
"modes.notes": "Выбери режим командой «set MODENAME mode».",

"mode.onboarding.purpose":
"Позволяет задавать вопросы о функциях системы, доступных командах или получать пошаговую инструкцию.",

"mode.research.purpose":
"Выполняет запечатанный цикл оценки — каждый ввод оценивается по ясности и значимости (1–10) с тремя результатами: понимание, инсайт и комментарий.",

"mode.truth.purpose":
"Предоставляет проверенные, отслеживаемые факты для бизнес-решений, обеспечивая аудит и прозрачность.",

"mode.empathy.purpose":
"Адаптирует ответы к человеческому тону и контексту, улучшая сотрудничество и понимание.",

"mode.wisdom.purpose":
"Объединяет разные точки зрения для сбалансированных рекомендаций.",

"mode.calm.purpose":
"Стабилизирует рабочие процессы при перегрузках или неопределённости, сохраняя ясность.",

"mode.safety.purpose":
"Защищает от непреднамеренных или несоответствующих выходных данных с помощью фильтров соответствия в реальном времени.",

"mode.recovery.purpose":
"Восстанавливает рабочую среду до согласованного и проверяемого состояния после ошибок или сбоев.",

"mode.play.purpose":
"Позволяет безопасно исследовать и создавать прототипы без операционного риска.",

"mode.governance.purpose":
"Обеспечивает беспристрастную оценку сложных вариантов через 13 фиксированных перспектив — наблюдение, сравнение и прозрачное рассуждение.",

// Эксперты (используется в Saeule.tsx)
"experts.title": "Эксперты",

// ru
"experts.descriptive.intro":
  "Выберите эксперта, введя « консультировать ИМЯ_ЭКСПЕРТА эксперт ».",


"experts.additional":
"Другие эксперты: Биология, Химия, Физика, Молекулярная наука, Теория систем, Математика, Статистика, Анализ рисков, Электротехника, Метеорология, Архитектура, Геополитика.",

// Метки экспертов (колонка – список экспертов)
"experts.computer-science.title": "Информатика",
"experts.computer-science.purpose":
"Предоставляет структурированный анализ алгоритмов, системной архитектуры и разработки ПО.",

"experts.psychology.title": "Психология",
"experts.psychology.purpose":
"Поддерживает анализ человеческого поведения, когниции и принятия решений.",

"experts.law.title": "Право",
"experts.law.purpose":
"Обеспечивает юридическое рассуждение, знание норм и оценку соответствия.",

"experts.economics.title": "Экономика",
"experts.economics.purpose":
"Анализирует стимулы, рынки и экономические последствия решений.",

"experts.engineering.title": "Инжиниринг",
"experts.engineering.purpose":
"Оценивает технические системы, реализуемость и логику процессов.",

"experts.medicine.title": "Медицина",
"experts.medicine.purpose":
"Предоставляет научный медицинский контекст без диагностики и лечения.",

"experts.information-security.title": "Информационная безопасность",
"experts.information-security.purpose":
"Анализирует риски, модели угроз и защитные меры для данных и систем.",


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
  gc_freegate_limit_reached: "Ваш исследовательский доступ на сегодня завершён.",
  gc_freegate_login_required: "Вы можете продолжить завтра или войти, чтобы защитить это рабочее пространство. После возврата введите OK в поле ввода, чтобы перейти к оплате.",

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
"actions.export.title": "Экспорт чата",
"actions.export.help": "Сохраните чат в виде файла.",
"actions.export.csv": "CSV",
"actions.export.json": "JSON",

"actions.delete.title": "Удалить чат",
"actions.delete.warning":
  "Это действие навсегда удаляет весь чат. Экспортируйте CSV или JSON, если хотите его сохранить.",
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

  // 侧边栏（专家与CTA）
clearChat: "清除聊天",
startBuilding: "开始构建",
startBuildingMsg: "启动 Council13 – 真理模式\n\n请先问我想要创造什么。\n\n在我回答后执行以下命令：\n\n「进入为期13次迭代的开发阶段。\n\nCouncil13治理：10名成员提出建议，3名成员担任评审；决策需三分之二评审同意，所有投票需有明确理由。\n\n每次迭代：提案可影响公式或生产流程。每次迭代结束时请提供KPI表，指标包括：市场成熟度、完整性、法律合规性、可专利性、因果性。\n\n规则（真理模式）：仅基于证据，无医疗声明，不越界。如果证据薄弱或尚不确定，请明确说明。\n\n从第1次迭代开始，引导我完成整个过程。」",

threadExported: "线程已导出。",

// 模式 – 特征模式 (12)
"mode.research": "研究",
"mode.calm": "冷静",
"mode.truth": "真理",
"mode.wisdom": "智慧",
"mode.play": "探索",
"mode.empathy": "共情",
"mode.joy": "喜悦",
"mode.safety": "安全",
"mode.recovery": "恢复",
"mode.onboarding": "入门",
"mode.council": "治理 → Council13",

"labels.purpose": "目的：",
"modes.notes": "通过命令「set MODENAME mode」选择模式。",

"mode.onboarding.purpose":
"允许你询问系统功能、可用命令，或获取分步引导。",

"mode.research.purpose":
"执行封闭评估循环——每个输入按清晰度和意义（1–10）评分，并生成三项输出：理解、洞察与评论。",

"mode.truth.purpose":
"提供可验证、可追溯的事实，用于商业决策，确保可审计性与合规透明。",

"mode.empathy.purpose":
"根据语气与语境调整回答，以提升协作与清晰度。",

"mode.wisdom.purpose":
"融合多种观点，提供平衡且深思的指导。",

"mode.calm.purpose":
"在高负荷或不确定情境下稳定流程，保持操作清晰。",

"mode.safety.purpose":
"通过实时合规过滤器防止错误或违规输出。",

"mode.recovery.purpose":
"在错误或中断后将工作区恢复为一致且可验证的状态。",

"mode.play.purpose":
"支持创意探索与原型设计，无操作风险。",

"mode.governance.purpose":
"通过十三个固定视角提供客观评估——仅限观察、比较与透明推理。",

// 专家 (用于 Saeule.tsx)
"experts.title": "专家",

// zh
"experts.descriptive.intro":
  "通过输入“咨询 专家名称 专家”来选择专家。",


"experts.additional":
"其他专家：生物学、化学、物理学、分子科学、系统理论、数学、统计学、风险分析、电气工程、气象学、建筑学、地缘政治。",

// 专家标签（列 – 专家列表）
"experts.computer-science.title": "计算机科学",
"experts.computer-science.purpose":
"提供关于算法、系统架构和软件设计的结构化推理。",

"experts.psychology.title": "心理学",
"experts.psychology.purpose":
"支持对人类行为、认知和决策过程的分析。",

"experts.law.title": "法律",
"experts.law.purpose":
"确保法律推理、法规理解与合规评估。",

"experts.economics.title": "经济学",
"experts.economics.purpose":
"分析激励、市场与决策的经济影响。",

"experts.engineering.title": "工程学",
"experts.engineering.purpose":
"评估技术系统、可行性与流程逻辑。",

"experts.medicine.title": "医学",
"experts.medicine.purpose":
"提供医学背景与科学信息，但不做诊断或治疗。",

"experts.information-security.title": "信息安全",
"experts.information-security.purpose":
"评估数据与系统的风险、威胁模型及保护措施。",


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
  gc_freegate_limit_reached: "您今天的探索访问已结束。",
  gc_freegate_login_required: "您可以明天继续，或登录以保护此工作空间。返回后，在输入框中输入 OK 以进入支付流程。",

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
  "此操作将永久删除整个聊天。如需保留，请先导出 CSV 或 JSON。",
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

  // サイドバー（エキスパートとCTA）
clearChat: "チャットを消去",
startBuilding: "構築を開始",
startBuildingMsg: "Council13を起動 – トゥルースモード\n\nまず、私が何を作りたいのかを尋ねてください。\n\n回答後、次を実行します:\n\n「正確に13回のイテレーションで開発に入る。\n\nCouncil13ガバナンス: 10人のメンバーが提案し、3人が審査員として行動。決定には3分の2の同意が必要で、すべての票には理由が明示されなければならない。\n\n各イテレーションでは、提案が数式や生産プロセスに影響を与えることができます。各サイクルの終わりに、固定KPI（市場適合性、完全性、法的準備度、特許可能性、因果性）を使用してKPI表を作成します。\n\nルール（トゥルースモード）: 証拠に基づくのみ。医療的主張や境界越えは禁止。証拠が弱い、または新しい場合は明示すること。\n\nイテレーション1から開始し、全プロセスを案内してください。」",

threadExported: "スレッドをエクスポートしました。",

// モード – キャラクターモード (12)
"mode.research": "リサーチ",
"mode.calm": "カーム",
"mode.truth": "トゥルース",
"mode.wisdom": "ウィズダム",
"mode.play": "プレイ",
"mode.empathy": "エンパシー",
"mode.joy": "ジョイ",
"mode.safety": "セーフティ",
"mode.recovery": "リカバリー",
"mode.onboarding": "オンボーディング",
"mode.council": "ガバナンス → Council13",

"labels.purpose": "目的:",
"modes.notes": "「set MODENAME mode」でモードを選択します。",

"mode.onboarding.purpose":
"システム機能、利用可能なコマンド、またはステップごとのガイドを確認できます。",

"mode.research.purpose":
"封印された評価ループを実行します。各入力は明確さと意味（1–10）で評価され、3つの出力（理解・洞察・コメント）が生成されます。",

"mode.truth.purpose":
"監査可能で規制に準拠した、検証可能なビジネス意思決定のための事実を提供します。",

"mode.empathy.purpose":
"トーンと文脈に応じて応答を調整し、共感と明確さを高めます。",

"mode.wisdom.purpose":
"複数の視点を統合し、バランスの取れた洞察を提供します。",

"mode.calm.purpose":
"負荷や不確実性が高い状況でワークフローを安定させ、明確さを維持します。",

"mode.safety.purpose":
"リアルタイムのコンプライアンスフィルターで、誤ったまたは不適切な出力を防ぎます。",

"mode.recovery.purpose":
"エラーや中断後に、作業環境を一貫性のある検証済み状態に戻します。",

"mode.play.purpose":
"リスクのない創造的な探求とプロトタイピングを促進します。",

"mode.governance.purpose":
"13の固定された視点を通して複雑な選択肢を公平に評価します。観察、比較、透明な推論のみ。",

// エキスパート (Saeule.tsxで使用)
"experts.title": "エキスパート",

// ja
"experts.descriptive.intro":
  "「専門家名 の専門家に相談」と入力して専門家を選択します。",


"experts.additional":
"その他のエキスパート: 生物学、化学、物理学、分子科学、システム理論、数学、統計学、リスク分析、電気工学、気象学、建築学、地政学。",

// エキスパートラベル（カラム – エキスパートリスト）
"experts.computer-science.title": "コンピュータサイエンス",
"experts.computer-science.purpose":
"アルゴリズム、システムアーキテクチャ、ソフトウェア設計に関する構造的な分析を提供します。",

"experts.psychology.title": "心理学",
"experts.psychology.purpose":
"人間の行動、認知、意思決定プロセスの分析を支援します。",

"experts.law.title": "法律",
"experts.law.purpose":
"法的推論、規制理解、コンプライアンス評価を保証します。",

"experts.economics.title": "経済学",
"experts.economics.purpose":
"意思決定におけるインセンティブ、市場、経済的影響を分析します。",

"experts.engineering.title": "工学",
"experts.engineering.purpose":
"技術システム、実現可能性、プロセスロジックを評価します。",

"experts.medicine.title": "医学",
"experts.medicine.purpose":
"診断や治療を行わずに、医学的・科学的な文脈を提供します。",

"experts.information-security.title": "情報セキュリティ",
"experts.information-security.purpose":
"データとシステムに関するリスク、脅威モデル、保護対策を評価します。",


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
  gc_freegate_limit_reached: "本日の探索アクセスは終了しました。",
  gc_freegate_login_required: "明日続行することも、この作業スペースを保護するためにログインすることもできます。戻った後、入力欄に OK と入力して支払いに進んでください。",

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
  "この操作はチャット全体を完全に削除します。保持する場合は事前に CSV または JSON をエクスポートしてください。",
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

  // 사이드바 (전문가 및 CTA)
clearChat: "채팅 지우기",
startBuilding: "빌드 시작",
startBuildingMsg: "Council13 시작 – 진리 모드\n\n먼저 내가 무엇을 만들고 싶은지 물어보세요.\n\n내가 대답한 후 다음을 실행하세요:\n\n「정확히 13회의 반복으로 개발 단계에 들어갑니다.\n\nCouncil13 거버넌스: 10명의 구성원이 제안하고, 3명이 심사위원으로 활동합니다. 결정은 3분의 2 이상의 동의가 필요하며, 모든 투표에는 명확한 이유가 있어야 합니다.\n\n각 반복에서 제안은 공식이나 생산 프로세스에 영향을 줄 수 있습니다. 각 반복이 끝나면 다음 고정 KPI로 표를 작성하세요: 시장 준비도, 완전성, 법적 준비도, 특허 가능성, 인과성.\n\n규칙 (진리 모드): 증거 기반만 허용하며, 의학적 주장이나 경계 침범은 금지됩니다. 증거가 약하거나 초기 단계일 경우 명확히 표시하세요.\n\n1회차부터 시작해 전체 과정을 안내하세요.」",

threadExported: "스레드가 내보내졌습니다.",

// 모드 – 성격 모드 (12)
"mode.research": "리서치",
"mode.calm": "차분함",
"mode.truth": "진리",
"mode.wisdom": "지혜",
"mode.play": "플레이",
"mode.empathy": "공감",
"mode.joy": "기쁨",
"mode.safety": "안전",
"mode.recovery": "복구",
"mode.onboarding": "온보딩",
"mode.council": "거버넌스 → Council13",

"labels.purpose": "목적:",
"modes.notes": "「set MODENAME mode」 명령으로 모드를 선택하세요.",

"mode.onboarding.purpose":
"시스템 기능, 사용 가능한 명령 또는 단계별 가이드를 요청할 수 있습니다.",

"mode.research.purpose":
"봉인된 평가 루프를 실행합니다. 각 입력은 명확성과 의미(1–10)로 평가되며 세 가지 출력(이해, 통찰, 코멘트)을 생성합니다.",

"mode.truth.purpose":
"비즈니스 결정을 위한 검증된 사실을 제공하여 감사 가능성과 규제 투명성을 보장합니다.",

"mode.empathy.purpose":
"응답을 사람의 톤과 문맥에 맞게 조정하여 협업과 명확성을 높입니다.",

"mode.wisdom.purpose":
"여러 관점을 통합하여 균형 잡힌 조언과 통찰을 제공합니다.",

"mode.calm.purpose":
"과부하나 불확실한 상황에서 워크플로를 안정시키고 명확성을 유지합니다.",

"mode.safety.purpose":
"실시간 규정 준수 필터를 통해 오류나 비준수 출력을 방지합니다.",

"mode.recovery.purpose":
"오류나 중단 후 작업 환경을 일관되고 검증 가능한 상태로 복원합니다.",

"mode.play.purpose":
"운영상의 위험 없이 창의적인 탐구와 프로토타이핑을 가능하게 합니다.",

"mode.governance.purpose":
"13개의 고정된 관점에서 복잡한 선택지를 공정하게 평가합니다 – 관찰, 비교 및 투명한 추론만 허용.",

// 전문가 (Saeule.tsx에서 사용)
"experts.title": "전문가",

// ko
"experts.descriptive.intro":
  "“전문가이름 전문가 상담”을 입력하여 전문가를 선택하세요.",


"experts.additional":
"기타 전문가: 생물학, 화학, 물리학, 분자 과학, 시스템 이론, 수학, 통계학, 위험 분석, 전기공학, 기상학, 건축학, 지정학.",

// 전문가 라벨 (열 – 전문가 목록)
"experts.computer-science.title": "컴퓨터 과학",
"experts.computer-science.purpose":
"알고리즘, 시스템 아키텍처 및 소프트웨어 설계에 대한 구조적 분석을 제공합니다.",

"experts.psychology.title": "심리학",
"experts.psychology.purpose":
"인간의 행동, 인지 및 의사 결정 과정을 분석합니다.",

"experts.law.title": "법학",
"experts.law.purpose":
"법적 추론, 규제 이해 및 준수 평가를 제공합니다.",

"experts.economics.title": "경제학",
"experts.economics.purpose":
"의사 결정의 유인, 시장 및 경제적 영향을 분석합니다.",

"experts.engineering.title": "공학",
"experts.engineering.purpose":
"기술 시스템, 실행 가능성 및 프로세스 논리를 평가합니다.",

"experts.medicine.title": "의학",
"experts.medicine.purpose":
"진단이나 치료 없이 의학적 맥락과 과학적 정보를 제공합니다.",

"experts.information-security.title": "정보 보안",
"experts.information-security.purpose":
"데이터 및 시스템의 위험, 위협 모델 및 보호 조치를 평가합니다.",


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
  gc_freegate_limit_reached: "오늘의 탐색 접근이 완료되었습니다.",
  gc_freegate_login_required: "내일 계속하거나 이 작업 공간을 보호하기 위해 로그인할 수 있습니다. 돌아온 후 입력창에 OK를 입력하면 결제로 이동합니다.",

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

  // साइडबार (विशेषज्ञ और CTA)
clearChat: "चैट साफ करें",
startBuilding: "निर्माण प्रारंभ करें",
startBuildingMsg: "Council13 प्रारंभ करें – सत्य मोड\n\nपहले मुझसे पूछें कि मैं क्या बनाना चाहता हूँ।\n\nउत्तर देने के बाद निम्नलिखित निष्पादित करें:\n\n«13 पुनरावृत्तियों में विकास चरण में प्रवेश करें।\n\nCouncil13 शासन: 10 सदस्य प्रस्ताव देते हैं, 3 सदस्य जूरी के रूप में कार्य करते हैं; निर्णय के लिए दो-तिहाई सहमति आवश्यक है और प्रत्येक वोट का स्पष्ट कारण होना चाहिए।\n\nप्रत्येक पुनरावृत्ति में प्रस्ताव सूत्र या उत्पादन प्रक्रिया को प्रभावित कर सकते हैं। प्रत्येक पुनरावृत्ति को इन स्थिर KPI के साथ समाप्त करें: बाजार तत्परता, पूर्णता, कानूनी तत्परता, पेटेंट योग्यता, कारणता।\n\nनियम (सत्य मोड): केवल साक्ष्य आधारित, कोई चिकित्सीय दावे या सीमाओं का उल्लंघन नहीं। यदि साक्ष्य कमजोर या उभरते हुए हैं, तो इसे स्पष्ट रूप से बताएं।\n\nपहली पुनरावृत्ति से प्रारंभ करें और मुझे पूरे प्रक्रिया में मार्गदर्शन करें।»",

threadExported: "थ्रेड निर्यात किया गया।",

// मोड्स – कैरेक्टर मोड्स (12)
"mode.research": "अनुसंधान",
"mode.calm": "शांत",
"mode.truth": "सत्य",
"mode.wisdom": "बुद्धि",
"mode.play": "खेल",
"mode.empathy": "सहानुभूति",
"mode.joy": "आनंद",
"mode.safety": "सुरक्षा",
"mode.recovery": "पुनर्प्राप्ति",
"mode.onboarding": "प्रारंभ",
"mode.council": "शासन → Council13",

"labels.purpose": "उद्देश्य:",
"modes.notes": "«set MODENAME mode» कमांड द्वारा मोड चुनें।",

"mode.onboarding.purpose":
"सिस्टम सुविधाओं, उपलब्ध आदेशों या चरण-दर-चरण मार्गदर्शन के बारे में पूछें।",

"mode.research.purpose":
"सीलबंद मूल्यांकन चक्र चलाता है – प्रत्येक इनपुट को स्पष्टता और अर्थ (1–10) पर अंकित करता है, तीन परिणामों के साथ: समझ, अंतर्दृष्टि, टिप्पणी।",

"mode.truth.purpose":
"व्यवसायिक निर्णयों के लिए सत्यापित और ट्रेस करने योग्य तथ्य प्रदान करता है, पारदर्शिता और अनुपालन सुनिश्चित करता है।",

"mode.empathy.purpose":
"उत्तर को मानवीय स्वर और संदर्भ के अनुरूप बनाता है, सहयोग और स्पष्टता को बढ़ाता है।",

"mode.wisdom.purpose":
"कई दृष्टिकोणों को संतुलित मार्गदर्शन में जोड़ता है।",

"mode.calm.purpose":
"उच्च भार या अनिश्चित स्थिति में कार्यप्रवाह को स्थिर करता है और स्पष्टता बनाए रखता है।",

"mode.safety.purpose":
"रीयल-टाइम अनुपालन फ़िल्टर के माध्यम से अनुचित या असुरक्षित आउटपुट से बचाता है।",

"mode.recovery.purpose":
"त्रुटियों या रुकावटों के बाद कार्यक्षेत्र को सुसंगत और सत्यापन योग्य स्थिति में पुनर्स्थापित करता है।",

"mode.play.purpose":
"रचनात्मक खोज और प्रोटोटाइपिंग की अनुमति देता है, बिना किसी संचालन जोखिम के।",

"mode.governance.purpose":
"तेरह स्थायी दृष्टिकोणों के माध्यम से जटिल विकल्पों का निष्पक्ष मूल्यांकन प्रदान करता है – केवल अवलोकन, तुलना और पारदर्शी तर्क।",

// विशेषज्ञ (Saeule.tsx में उपयोग किया गया)
"experts.title": "विशेषज्ञ",

// ar
"experts.descriptive.intro":
  "اختر خبيرًا عن طريق إدخال « استشارة اسم_الخبير خبير ».",


"experts.additional":
"अन्य विशेषज्ञ: जीवविज्ञान, रसायन विज्ञान, भौतिकी, आणविक विज्ञान, प्रणाली सिद्धांत, गणित, सांख्यिकी, जोखिम विश्लेषण, विद्युत अभियांत्रिकी, मौसम विज्ञान, वास्तुकला, भू-राजनीति।",

// विशेषज्ञ लेबल (कॉलम – विशेषज्ञ सूची)
"experts.computer-science.title": "कंप्यूटर विज्ञान",
"experts.computer-science.purpose":
"एल्गोरिदम, सिस्टम आर्किटेक्चर और सॉफ्टवेयर डिज़ाइन पर संरचित विश्लेषण प्रदान करता है।",

"experts.psychology.title": "मनोविज्ञान",
"experts.psychology.purpose":
"मानव व्यवहार, संज्ञान और निर्णय-प्रक्रिया के विश्लेषण में सहायता करता है।",

"experts.law.title": "कानून",
"experts.law.purpose":
"कानूनी तर्क, नियामक समझ और अनुपालन मूल्यांकन सुनिश्चित करता है।",

"experts.economics.title": "अर्थशास्त्र",
"experts.economics.purpose":
"प्रोत्साहन, बाजार और निर्णयों के आर्थिक प्रभाव का विश्लेषण करता है।",

"experts.engineering.title": "अभियांत्रिकी",
"experts.engineering.purpose":
"तकनीकी प्रणालियों, व्यवहार्यता और प्रक्रिया तर्क का मूल्यांकन करता है।",

"experts.medicine.title": "चिकित्सा",
"experts.medicine.purpose":
"निदान या उपचार के बिना वैज्ञानिक चिकित्सा संदर्भ प्रदान करता है।",

"experts.information-security.title": "सूचना सुरक्षा",
"experts.information-security.purpose":
"डेटा और प्रणालियों के जोखिम, खतरों के मॉडल और सुरक्षा उपायों का मूल्यांकन करता है।",


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
  gc_freegate_limit_reached: "انتهى الوصول الاستكشافي لليوم.",
  gc_freegate_login_required: "يمكنك المتابعة غدًا أو تسجيل الدخول لتأمين مساحة العمل هذه. بعد العودة، اكتب OK في حقل الإدخال للانتقال إلى الدفع.",

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
  "يؤدي هذا الإجراء إلى حذف الدردشة بالكامل بشكل دائم. صدّر CSV أو JSON إذا رغبت في الاحتفاظ بها.",
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

  // साइडबार (विशेषज्ञ और CTA)
clearChat: "चैट साफ करें",
startBuilding: "निर्माण प्रारंभ करें",
startBuildingMsg: "Council13 प्रारंभ करें – सत्य मोड\n\nपहले मुझसे पूछें कि मैं क्या बनाना चाहता हूँ।\n\nउत्तर देने के बाद निम्नलिखित निष्पादित करें:\n\n«13 पुनरावृत्तियों में विकास चरण में प्रवेश करें।\n\nCouncil13 शासन: 10 सदस्य प्रस्ताव देते हैं, 3 सदस्य जूरी के रूप में कार्य करते हैं; निर्णय के लिए दो-तिहाई सहमति आवश्यक है और प्रत्येक वोट का स्पष्ट कारण होना चाहिए।\n\nप्रत्येक पुनरावृत्ति में प्रस्ताव सूत्र या उत्पादन प्रक्रिया को प्रभावित कर सकते हैं। प्रत्येक पुनरावृत्ति को इन स्थिर KPI के साथ समाप्त करें: बाजार तत्परता, पूर्णता, कानूनी तत्परता, पेटेंट योग्यता, कारणता।\n\nनियम (सत्य मोड): केवल साक्ष्य आधारित, कोई चिकित्सीय दावे या सीमाओं का उल्लंघन नहीं। यदि साक्ष्य कमजोर या उभरते हुए हैं, तो इसे स्पष्ट रूप से बताएं।\n\nपहली पुनरावृत्ति से प्रारंभ करें और मुझे पूरे प्रक्रिया में मार्गदर्शन करें।»",

threadExported: "थ्रेड निर्यात किया गया।",

// मोड्स – कैरेक्टर मोड्स (12)
"mode.research": "अनुसंधान",
"mode.calm": "शांत",
"mode.truth": "सत्य",
"mode.wisdom": "बुद्धि",
"mode.play": "खेल",
"mode.empathy": "सहानुभूति",
"mode.joy": "आनंद",
"mode.safety": "सुरक्षा",
"mode.recovery": "पुनर्प्राप्ति",
"mode.onboarding": "प्रारंभ",
"mode.council": "शासन → Council13",

"labels.purpose": "उद्देश्य:",
"modes.notes": "«set MODENAME mode» कमांड द्वारा मोड चुनें।",

"mode.onboarding.purpose":
"सिस्टम सुविधाओं, उपलब्ध आदेशों या चरण-दर-चरण मार्गदर्शन के बारे में पूछें।",

"mode.research.purpose":
"सीलबंद मूल्यांकन चक्र चलाता है – प्रत्येक इनपुट को स्पष्टता और अर्थ (1–10) पर अंकित करता है, तीन परिणामों के साथ: समझ, अंतर्दृष्टि, टिप्पणी।",

"mode.truth.purpose":
"व्यवसायिक निर्णयों के लिए सत्यापित और ट्रेस करने योग्य तथ्य प्रदान करता है, पारदर्शिता और अनुपालन सुनिश्चित करता है।",

"mode.empathy.purpose":
"उत्तर को मानवीय स्वर और संदर्भ के अनुरूप बनाता है, सहयोग और स्पष्टता को बढ़ाता है।",

"mode.wisdom.purpose":
"कई दृष्टिकोणों को संतुलित मार्गदर्शन में जोड़ता है।",

"mode.calm.purpose":
"उच्च भार या अनिश्चित स्थिति में कार्यप्रवाह को स्थिर करता है और स्पष्टता बनाए रखता है।",

"mode.safety.purpose":
"रीयल-टाइम अनुपालन फ़िल्टर के माध्यम से अनुचित या असुरक्षित आउटपुट से बचाता है।",

"mode.recovery.purpose":
"त्रुटियों या रुकावटों के बाद कार्यक्षेत्र को सुसंगत और सत्यापन योग्य स्थिति में पुनर्स्थापित करता है।",

"mode.play.purpose":
"रचनात्मक खोज और प्रोटोटाइपिंग की अनुमति देता है, बिना किसी संचालन जोखिम के।",

"mode.governance.purpose":
"तेरह स्थायी दृष्टिकोणों के माध्यम से जटिल विकल्पों का निष्पक्ष मूल्यांकन प्रदान करता है – केवल अवलोकन, तुलना और पारदर्शी तर्क।",

// विशेषज्ञ (Saeule.tsx में उपयोग किया गया)
"experts.title": "विशेषज्ञ",

// hi
"experts.descriptive.intro":
  "« विशेषज्ञ_नाम विशेषज्ञ से परामर्श » लिखकर विशेषज्ञ चुनें।",

"experts.additional":
"अन्य विशेषज्ञ: जीवविज्ञान, रसायन विज्ञान, भौतिकी, आणविक विज्ञान, प्रणाली सिद्धांत, गणित, सांख्यिकी, जोखिम विश्लेषण, विद्युत अभियांत्रिकी, मौसम विज्ञान, वास्तुकला, भू-राजनीति।",

// विशेषज्ञ लेबल (कॉलम – विशेषज्ञ सूची)
"experts.computer-science.title": "कंप्यूटर विज्ञान",
"experts.computer-science.purpose":
"एल्गोरिदम, सिस्टम आर्किटेक्चर और सॉफ्टवेयर डिज़ाइन पर संरचित विश्लेषण प्रदान करता है।",

"experts.psychology.title": "मनोविज्ञान",
"experts.psychology.purpose":
"मानव व्यवहार, संज्ञान और निर्णय-प्रक्रिया के विश्लेषण में सहायता करता है।",

"experts.law.title": "कानून",
"experts.law.purpose":
"कानूनी तर्क, नियामक समझ और अनुपालन मूल्यांकन सुनिश्चित करता है।",

"experts.economics.title": "अर्थशास्त्र",
"experts.economics.purpose":
"प्रोत्साहन, बाजार और निर्णयों के आर्थिक प्रभाव का विश्लेषण करता है।",

"experts.engineering.title": "अभियांत्रिकी",
"experts.engineering.purpose":
"तकनीकी प्रणालियों, व्यवहार्यता और प्रक्रिया तर्क का मूल्यांकन करता है।",

"experts.medicine.title": "चिकित्सा",
"experts.medicine.purpose":
"निदान या उपचार के बिना वैज्ञानिक चिकित्सा संदर्भ प्रदान करता है।",

"experts.information-security.title": "सूचना सुरक्षा",
"experts.information-security.purpose":
"डेटा और प्रणालियों के जोखिम, खतरों के मॉडल और सुरक्षा उपायों का मूल्यांकन करता है।",

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
  gc_freegate_limit_reached: "आज के लिए आपका अन्वेषणात्मक एक्सेस समाप्त हो गया है।",
  gc_freegate_login_required: "आप कल जारी रख सकते हैं या इस कार्यक्षेत्र को सुरक्षित करने के लिए लॉग इन कर सकते हैं। वापस आने के बाद, भुगतान के लिए आगे बढ़ने हेतु इनपुट फ़ील्ड में OK लिखें।",

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
"actions.export.help": "चैट को फ़ाइल के रूप में सहेजें।",
"actions.export.csv": "CSV",
"actions.export.json": "JSON",

"actions.delete.title": "चैट हटाएँ",
"actions.delete.warning":
  "यह कार्रवाई पूरी चैट को स्थायी रूप से हटा देती है। यदि रखना चाहते हैं तो पहले CSV या JSON निर्यात करें।",
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