/*** =======================================================================
 *  INVENTUS INDEX — lib/i18n.ts
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
    "Explain me the build function and the commands I need to know to build efficiently with you. Show a table.",

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
    "All set — tell me what you want to build (app, flow, feature …).",

  // CTA labels (Säule header button etc.)
  "cta.build": "Build",
  "cta.export": "Export",
  "cta.clear": "Clear chat",

  // Pillar sections (Smooth Operator)
  "pillar.section.header": "Modes & experts header",
  "pillar.section.modesTitle": "MODES",
  "pillar.section.modes": "Modes",
  "pillar.section.experts": "Experts",
  "pillar.section.systemTitle": "SYSTEM",
  "pillar.section.system": "System status",
  "pillar.section.actionsTitle": "ACTIONS",
  "pillar.section.utility": "Actions & export",

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
  columnAria: "Column — Controls & Selection",
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
    "Erkläre mir die Build-Funktion und die Befehle, die ich kennen muss, um effizient mit dir zu entwickeln. Bitte mit Tabelle.",

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
    "Alles bereit — sag mir einfach, was du bauen möchtest (App, Flow, Feature …).",

  // CTA labels
  "cta.build": "Bauen",
  "cta.export": "Exportieren",
  "cta.clear": "Chat löschen",

  // Pillar sections (Smooth Operator)
  "pillar.section.header": "Modi & Experten",
  "pillar.section.modesTitle": "Modi",
  "pillar.section.modes": "Modi",
  "pillar.section.experts": "Experten",
  "pillar.section.systemTitle": "System",
  "pillar.section.system": "Systemstatus",
  "pillar.section.actionsTitle": "Aktionen",
  "pillar.section.utility": "Aktionen & Export",

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
  columnAria: "Seitenleiste — Steuerung & Auswahl",
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
    "Explique-moi la fonction build et les commandes essentielles pour construire efficacement avec toi. Présente-les sous forme de tableau.",

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
    "Tout est prêt — dis-moi ce que tu veux créer (application, flow, fonctionnalité…).",

  // CTA labels
  "cta.build": "Construire",
  "cta.export": "Exporter",
  "cta.clear": "Effacer le chat",

  // Pillar sections (Smooth Operator)
  "pillar.section.header": "Modes & experts",
  "pillar.section.modesTitle": "Modes",
  "pillar.section.modes": "Modes",
  "pillar.section.experts": "Experts",
  "pillar.section.systemTitle": "Système",
  "pillar.section.system": "État du système",
  "pillar.section.actionsTitle": "Actions",
  "pillar.section.utility": "Actions & export",

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
  columnAria: "Panneau — Commandes et sélection",
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
    "Explícame la función build y los comandos esenciales para trabajar contigo de forma eficiente. Muéstralos en una tabla.",

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
  "modes.category.core": "Núcleo",
  "modes.category.intellectual": "Intelectual",
  "modes.category.creator": "Creador",
  "modes.category.heart": "Corazón",
  "modes.category.spirit": "Espíritu",

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
    "Todo listo — cuéntame qué quieres construir (app, flujo, funcionalidad…).",

  // CTA labels
  "cta.build": "Construir",
  "cta.export": "Exportar",
  "cta.clear": "Borrar chat",

  // Pillar sections
  "pillar.section.header": "Modos y expertos",
  "pillar.section.modesTitle": "Modos",
  "pillar.section.modes": "Modos",
  "pillar.section.experts": "Expertos",
  "pillar.section.systemTitle": "Sistema",
  "pillar.section.system": "Estado del sistema",
  "pillar.section.actionsTitle": "Acciones",
  "pillar.section.utility": "Acciones y exportación",

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
  columnAria: "Panel — Controles y selección",
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
    "Spiegami la funzione build e i comandi essenziali per collaborare con efficienza. Mostra una tabella.",

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
  "modes.category.core": "Nucleo",
  "modes.category.intellectual": "Intellettuale",
  "modes.category.creator": "Creatore",
  "modes.category.heart": "Cuore",
  "modes.category.spirit": "Spirito",

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
    "Tutto pronto — dimmi cosa desideri creare (app, flusso, funzionalità…).",

  // CTA labels
  "cta.build": "Crea",
  "cta.export": "Esporta",
  "cta.clear": "Cancella chat",

  // Pillar sections (Smooth Operator)
  "pillar.section.header": "Modalità ed esperti",
  "pillar.section.modesTitle": "Modalità",
  "pillar.section.modes": "Modalità",
  "pillar.section.experts": "Esperti",
  "pillar.section.systemTitle": "Sistema",
  "pillar.section.system": "Stato del sistema",
  "pillar.section.actionsTitle": "Azioni",
  "pillar.section.utility": "Azioni e esportazione",

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
  columnAria: "Pannello — Controlli e selezione",
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
    "Explique a função build e os comandos essenciais para trabalharmos juntos com eficiência. Mostre em formato de tabela.",

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
  "modes.category.core": "Núcleo",
  "modes.category.intellectual": "Intelectual",
  "modes.category.creator": "Criador",
  "modes.category.heart": "Coração",
  "modes.category.spirit": "Espírito",

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
    "Tudo pronto — diga o que você deseja criar (app, fluxo, funcionalidade…).",

  // CTA labels
  "cta.build": "Criar",
  "cta.export": "Exportar",
  "cta.clear": "Limpar chat",

  // Pillar sections (Smooth Operator)
  "pillar.section.header": "Modos e especialistas",
  "pillar.section.modesTitle": "Modos",
  "pillar.section.modes": "Modos",
  "pillar.section.experts": "Especialistas",
  "pillar.section.systemTitle": "Sistema",
  "pillar.section.system": "Estado do sistema",
  "pillar.section.actionsTitle": "Ações",
  "pillar.section.utility": "Ações e exportação",

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
  columnAria: "Painel — Controles e seleção",
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
    "Leg de build-functie uit en de belangrijkste commando’s die ik moet kennen om efficiënt met je samen te werken. Toon dit in een tabel.",

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
    "Alles is klaar — vertel me wat je wilt bouwen (app, flow, functie…).",

  // CTA labels
  "cta.build": "Bouwen",
  "cta.export": "Exporteren",
  "cta.clear": "Chat wissen",

  // Pillar sections (Smooth Operator)
  "pillar.section.header": "Modi & experts",
  "pillar.section.modesTitle": "Modi",
  "pillar.section.modes": "Modi",
  "pillar.section.experts": "Experts",
  "pillar.section.systemTitle": "Systeem",
  "pillar.section.system": "Systeemstatus",
  "pillar.section.actionsTitle": "Acties",
  "pillar.section.utility": "Acties & export",

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
  columnAria: "Zijlijn — Bediening & selectie",
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
    "Объясни функцию build и основные команды, которые нужно знать для эффективной работы с тобой. Покажи таблицу.",

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
  "modes.category.core": "Основа",
  "modes.category.intellectual": "Интеллект",
  "modes.category.creator": "Созидание",
  "modes.category.heart": "Сердце",
  "modes.category.spirit": "Дух",

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
    "Все готово — расскажи, что ты хочешь создать (приложение, поток, функцию…).",

  // CTA labels
  "cta.build": "Создать",
  "cta.export": "Экспорт",
  "cta.clear": "Очистить чат",

  // Pillar sections (Smooth Operator)
  "pillar.section.header": "Режимы и эксперты",
  "pillar.section.modesTitle": "Режимы",
  "pillar.section.modes": "Режимы",
  "pillar.section.experts": "Эксперты",
  "pillar.section.systemTitle": "Система",
  "pillar.section.system": "Состояние системы",
  "pillar.section.actionsTitle": "Действия",
  "pillar.section.utility": "Действия и экспорт",

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
  columnAria: "Боковая панель — управление и выбор",
  mobileOverlayLabel: "Мобильная версия панели",
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

/** Set current locale (persists on client) — explizites Override */
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
