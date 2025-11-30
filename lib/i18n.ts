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
  comingVoice: "Sprache",
  comingFunctions: "Optionen",

  // Overlay header / buttons (mobile)
  close: "Schließen",

  // Sidebar / Column
  columnTitle: "Säule",
  sectionControl: "Steuerung",
  onboarding: "ONBOARDING",
  mDefault: "M · Standard",
  selectMode: "Modus wählen",
  council13: "COUNCIL13",
  selectAI: "KI wählen",
  modules: "Module",
  coming: "Bald",

  // Sidebar additions (experts & CTA)
  selectExpert: "Experten wählen",
  statusExpert: "Experte:",
  clearChat: "Chat leeren",
  startBuilding: "Bauen",
  startBuildingMsg:
    "Erkläre mir die Build-Funktion und die Befehle, die ich kennen muss, um effizient mit dir zu bauen. Zeige eine Tabelle.",

  // Actions / footer
  export: "Exportieren",
  levels: "Level",
  levelsComing: "Level kommen bald",
  threadExported: "Chat exportiert.",

  // Status bar
  statusMode: "Modus:",
  statusAgent: "Agent:",

  // Backward-compat alias
  statusAI: "Agent:",

  // Status texts
  "status.modeSet": "Modus gesetzt: {label}.",

  // Modes – system buttons
  "mode.onboarding": "ONBOARDING",
  "mode.council": "COUNCIL13",
  "mode.default": "M · Standard",
  "mode.select": "Modus wählen",

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
  "labels.modes.character": "Charakter-Modi",
  "modes.category.core": "CORE",
  "modes.category.intellectual": "INTELLEKTUELL",
  "modes.category.creator": "CREATOR",
  "modes.category.heart": "HERZ",
  "modes.category.spirit": "SPIRIT",

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
    "Alles bereit — sag mir, was du bauen möchtest (App, Flow, Feature …).",

  // CTA labels (Säule header button etc.)
  "cta.build": "Bauen",
  "cta.export": "Exportieren",
  "cta.clear": "Chat leeren",

  // Pillar sections
  "pillar.section.header": "Modi- & Experten-Header",
  "pillar.section.modesTitle": "MODES",
  "pillar.section.modes": "Modi",
  "pillar.section.experts": "Experten",
  "pillar.section.systemTitle": "SYSTEM",
  "pillar.section.system": "Systemstatus",
  "pillar.section.actionsTitle": "ACTIONS",
  "pillar.section.utility": "Aktionen & Export",

  // Actions (export / delete)
  "actions.export.title": "Chat exportieren",
  "actions.export.help": "Speichere deinen Chat als Datei.",
  "actions.export.csv": "CSV",
  "actions.export.json": "JSON",

  "actions.delete.title": "Chat löschen",
  "actions.delete.warning":
    "Dies löscht den gesamten Chat endgültig. Exportiere ihn vorher als CSV oder JSON, wenn du ihn sichern möchtest.",
  "actions.delete.now": "LÖSCHEN",

  // ARIA for actions
  exportCsvAria: "Thread als CSV exportieren",
  exportJsonAria: "Thread als JSON exportieren",
  clearChatAria: "Chat leeren",

  // ARIA / A11y (chat + column)
  conversationAria: "Chat-Verlauf",
  assistantSays: "Assistent-Nachricht",
  youSaid: "Deine Nachricht",
  columnAria: "Säule — Steuerung & Auswahl",
  mobileOverlayLabel: "Mobiles Spalten-Overlay",
} as const;

const fr = {
  // Input / messaging
  writeMessage: "Écrire un message…",
  send: "Envoyer",

  // Input helpers
  tools: "Outils",
  newline: "Nouvelle ligne",
  comingUpload: "Téléchargement",
  comingVoice: "Voix",
  comingFunctions: "Options",

  // Overlay header / buttons (mobile)
  close: "Fermer",

  // Sidebar / Column
  columnTitle: "Colonne",
  sectionControl: "Contrôles",
  onboarding: "ONBOARDING",
  mDefault: "M · Par défaut",
  selectMode: "Choisir un mode",
  council13: "COUNCIL13",
  selectAI: "Choisir l’IA",
  modules: "Modules",
  coming: "Bientôt",

  // Sidebar additions (experts & CTA)
  selectExpert: "Choisir un expert",
  statusExpert: "Expert :",
  clearChat: "Effacer le chat",
  startBuilding: "Construire",
  startBuildingMsg:
    "Explique-moi la fonction build et les commandes nécessaires pour construire efficacement avec toi. Affiche un tableau.",

  // Actions / footer
  export: "Exporter",
  levels: "Niveaux",
  levelsComing: "Niveaux bientôt disponibles",
  threadExported: "Chat exporté.",

  // Status bar
  statusMode: "Mode :",
  statusAgent: "Agent :",

  // Backward-compat alias
  statusAI: "Agent :",

  // Status texts
  "status.modeSet": "Mode défini : {label}.",

  // Modes – system buttons
  "mode.onboarding": "ONBOARDING",
  "mode.council": "COUNCIL13",
  "mode.default": "M · Par défaut",
  "mode.select": "Choisir un mode",

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
  "labels.modes.character": "Modes de caractère",
  "modes.category.core": "CORE",
  "modes.category.intellectual": "INTELLECTUEL",
  "modes.category.creator": "CRÉATEUR",
  "modes.category.heart": "CŒUR",
  "modes.category.spirit": "ESPRIT",

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
    "Tout est prêt — dites-moi ce que vous souhaitez créer (application, flux, fonctionnalité…).",

  // CTA labels
  "cta.build": "Construire",
  "cta.export": "Exporter",
  "cta.clear": "Effacer le chat",

  // Pillar sections
  "pillar.section.header": "En-tête des modes et experts",
  "pillar.section.modesTitle": "MODES",
  "pillar.section.modes": "Modes",
  "pillar.section.experts": "Experts",
  "pillar.section.systemTitle": "SYSTEME",
  "pillar.section.system": "Statut du système",
  "pillar.section.actionsTitle": "ACTIONS",
  "pillar.section.utility": "Actions et export",

  // Actions (export / delete)
  "actions.export.title": "Exporter le chat",
  "actions.export.help": "Enregistrer votre chat en tant que fichier.",
  "actions.export.csv": "CSV",
  "actions.export.json": "JSON",

  "actions.delete.title": "Supprimer le chat",
  "actions.delete.warning":
    "Cela supprimera définitivement tout le chat. Exportez-le en CSV ou JSON si vous souhaitez le conserver.",
  "actions.delete.now": "SUPPRIMER",

  // ARIA
  exportCsvAria: "Exporter le thread en CSV",
  exportJsonAria: "Exporter le thread en JSON",
  clearChatAria: "Effacer le chat",

  // ARIA / A11y (chat + column)
  conversationAria: "Historique du chat",
  assistantSays: "Message de l’assistant",
  youSaid: "Votre message",
  columnAria: "Colonne — Contrôles et sélection",
  mobileOverlayLabel: "Superposition mobile de la colonne",
} as const;

const es = {
  // Input / messaging
  writeMessage: "Escribir un mensaje…",
  send: "Enviar",

  // Input helpers
  tools: "Herramientas",
  newline: "Nueva línea",
  comingUpload: "Subida",
  comingVoice: "Voz",
  comingFunctions: "Opciones",

  // Overlay header / buttons (mobile)
  close: "Cerrar",

  // Sidebar / Column
  columnTitle: "Columna",
  sectionControl: "Controles",
  onboarding: "ONBOARDING",
  mDefault: "M · Predeterminado",
  selectMode: "Elegir modo",
  council13: "COUNCIL13",
  selectAI: "Elegir IA",
  modules: "Módulos",
  coming: "Próximamente",

  // Sidebar additions (experts & CTA)
  selectExpert: "Elegir experto",
  statusExpert: "Experto:",
  clearChat: "Borrar chat",
  startBuilding: "Construir",
  startBuildingMsg:
    "Explícame la función build y los comandos que necesito para construir contigo de forma eficiente. Muestra una tabla.",

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
  "mode.onboarding": "ONBOARDING",
  "mode.council": "COUNCIL13",
  "mode.default": "M · Predeterminado",
  "mode.select": "Elegir modo",

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
  "labels.modes.character": "Modos de carácter",
  "modes.category.core": "CORE",
  "modes.category.intellectual": "INTELECTUAL",
  "modes.category.creator": "CREADOR",
  "modes.category.heart": "CORAZÓN",
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
  "experts.weather_expert": "Experto meteorológico",
  "experts.molecular_scientist": "Científico molecular",

  // CTA fallback
  "cta.fallback":
    "Todo listo — dime qué quieres construir (app, flujo, funcionalidad…).",

  // CTA labels
  "cta.build": "Construir",
  "cta.export": "Exportar",
  "cta.clear": "Borrar chat",

  // Pillar sections
  "pillar.section.header": "Encabezado de modos y expertos",
  "pillar.section.modesTitle": "MODES",
  "pillar.section.modes": "Modos",
  "pillar.section.experts": "Expertos",
  "pillar.section.systemTitle": "SISTEMA",
  "pillar.section.system": "Estado del sistema",
  "pillar.section.actionsTitle": "ACCIONES",
  "pillar.section.utility": "Acciones y exportación",

  // Actions (export / delete)
  "actions.export.title": "Exportar chat",
  "actions.export.help": "Guarda tu chat como archivo.",
  "actions.export.csv": "CSV",
  "actions.export.json": "JSON",

  "actions.delete.title": "Eliminar chat",
  "actions.delete.warning":
    "Esto eliminará todo el chat para siempre. Expórtalo como CSV o JSON si deseas conservarlo.",
  "actions.delete.now": "ELIMINAR",

  // ARIA
  exportCsvAria: "Exportar hilo en CSV",
  exportJsonAria: "Exportar hilo en JSON",
  clearChatAria: "Borrar chat",

  // ARIA / A11y
  conversationAria: "Historial del chat",
  assistantSays: "Mensaje del asistente",
  youSaid: "Tu mensaje",
  columnAria: "Columna — Controles y selección",
  mobileOverlayLabel: "Superposición móvil de la columna",
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
  columnTitle: "Colonna",
  sectionControl: "Controlli",
  onboarding: "ONBOARDING",
  mDefault: "M · Predefinito",
  selectMode: "Scegli modalità",
  council13: "COUNCIL13",
  selectAI: "Scegli IA",
  modules: "Moduli",
  coming: "Prossimamente",

  // Sidebar additions (experts & CTA)
  selectExpert: "Scegli esperto",
  statusExpert: "Esperto:",
  clearChat: "Cancella chat",
  startBuilding: "Costruire",
  startBuildingMsg:
    "Spiegami la funzione build e i comandi necessari per costruire in modo efficiente con te. Mostra una tabella.",

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
  "mode.onboarding": "ONBOARDING",
  "mode.council": "COUNCIL13",
  "mode.default": "M · Predefinito",
  "mode.select": "Scegli modalità",

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
  "labels.modes.character": "Modalità caratteriali",
  "modes.category.core": "CORE",
  "modes.category.intellectual": "INTELLETTUALE",
  "modes.category.creator": "CREATOR",
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
  "experts.landscape_designer": "Progettista paesaggista",
  "experts.interior_designer": "Designer d’interni",
  "experts.electrical_engineer": "Ingegnere elettrico",
  "experts.mathematician": "Matematico",
  "experts.astrologer": "Astrologo",
  "experts.weather_expert": "Esperto meteorologico",
  "experts.molecular_scientist": "Scienziato molecolare",

  // CTA fallback
  "cta.fallback":
    "Tutto pronto — dimmi cosa vuoi costruire (app, flusso, funzionalità…).",

  // CTA labels
  "cta.build": "Costruire",
  "cta.export": "Esporta",
  "cta.clear": "Cancella chat",

  // Pillar sections
  "pillar.section.header": "Intestazione modalità ed esperti",
  "pillar.section.modesTitle": "MODES",
  "pillar.section.modes": "Modalità",
  "pillar.section.experts": "Esperti",
  "pillar.section.systemTitle": "SISTEMA",
  "pillar.section.system": "Stato del sistema",
  "pillar.section.actionsTitle": "AZIONI",
  "pillar.section.utility": "Azioni ed esportazione",

  // Actions (export / delete)
  "actions.export.title": "Esporta chat",
  "actions.export.help": "Salva la chat come file.",
  "actions.export.csv": "CSV",
  "actions.export.json": "JSON",

  "actions.delete.title": "Cancella chat",
  "actions.delete.warning":
    "Questo eliminerà definitivamente l’intera chat. Esportala in CSV o JSON se desideri conservarla.",
  "actions.delete.now": "ELIMINA",

  // ARIA
  exportCsvAria: "Esporta thread in CSV",
  exportJsonAria: "Esporta thread in JSON",
  clearChatAria: "Cancella chat",

  // ARIA / A11y
  conversationAria: "Cronologia chat",
  assistantSays: "Messaggio dell’assistente",
  youSaid: "Il tuo messaggio",
  columnAria: "Colonna — Controlli e selezione",
  mobileOverlayLabel: "Overlay mobile della colonna",
} as const;

const pt = {
  // Input / messaging
  writeMessage: "Escrever uma mensagem…",
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
  columnTitle: "Coluna",
  sectionControl: "Controlo",
  onboarding: "ONBOARDING",
  mDefault: "M · Padrão",
  selectMode: "Escolher modo",
  council13: "COUNCIL13",
  selectAI: "Escolher IA",
  modules: "Módulos",
  coming: "Em breve",

  // Sidebar additions (experts & CTA)
  selectExpert: "Escolher especialista",
  statusExpert: "Especialista:",
  clearChat: "Limpar chat",
  startBuilding: "Construir",
  startBuildingMsg:
    "Explica-me a função build e os comandos que preciso para construir contigo de forma eficiente. Mostra uma tabela.",

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
  "mode.onboarding": "ONBOARDING",
  "mode.council": "COUNCIL13",
  "mode.default": "M · Padrão",
  "mode.select": "Escolher modo",

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
  "labels.modes.character": "Modos de caráter",
  "modes.category.core": "CORE",
  "modes.category.intellectual": "INTELECTUAL",
  "modes.category.creator": "CREATOR",
  "modes.category.heart": "CORAÇÃO",
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
  "experts.landscape_designer": "Designer de paisagem",
  "experts.interior_designer": "Designer de interiores",
  "experts.electrical_engineer": "Engenheiro elétrico",
  "experts.mathematician": "Matemático",
  "experts.astrologer": "Astrólogo",
  "experts.weather_expert": "Especialista em meteorologia",
  "experts.molecular_scientist": "Cientista molecular",

  // CTA fallback
  "cta.fallback":
    "Tudo pronto — diga-me o que quer construir (app, fluxo, funcionalidade…).",

  // CTA labels
  "cta.build": "Construir",
  "cta.export": "Exportar",
  "cta.clear": "Limpar chat",

  // Pillar sections
  "pillar.section.header": "Cabeçalho de modos e especialistas",
  "pillar.section.modesTitle": "MODES",
  "pillar.section.modes": "Modos",
  "pillar.section.experts": "Especialistas",
  "pillar.section.systemTitle": "SISTEMA",
  "pillar.section.system": "Estado do sistema",
  "pillar.section.actionsTitle": "AÇÕES",
  "pillar.section.utility": "Ações e exportação",

  // Actions (export / delete)
  "actions.export.title": "Exportar chat",
  "actions.export.help": "Guarde o seu chat como ficheiro.",
  "actions.export.csv": "CSV",
  "actions.export.json": "JSON",

  "actions.delete.title": "Eliminar chat",
  "actions.delete.warning":
    "Isto eliminará todo o chat de forma permanente. Exporte-o em CSV ou JSON se quiser mantê-lo.",
  "actions.delete.now": "ELIMINAR",

  // ARIA
  exportCsvAria: "Exportar thread em CSV",
  exportJsonAria: "Exportar thread em JSON",
  clearChatAria: "Limpar chat",

  // ARIA / A11y
  conversationAria: "Histórico do chat",
  assistantSays: "Mensagem do assistente",
  youSaid: "A sua mensagem",
  columnAria: "Coluna — Controlo e seleção",
  mobileOverlayLabel: "Overlay móvel da coluna",
} as const;

const nl = {
  // Input / messaging
  writeMessage: "Schrijf een bericht…",
  send: "Verzenden",

  // Input helpers
  tools: "Hulpmiddelen",
  newline: "Nieuwe regel",
  comingUpload: "Upload",
  comingVoice: "Spraak",
  comingFunctions: "Opties",

  // Overlay header / buttons (mobile)
  close: "Sluiten",

  // Sidebar / Column
  columnTitle: "Kolom",
  sectionControl: "Besturing",
  onboarding: "ONBOARDING",
  mDefault: "M · Standaard",
  selectMode: "Modus kiezen",
  council13: "COUNCIL13",
  selectAI: "AI kiezen",
  modules: "Modules",
  coming: "Binnenkort",

  // Sidebar additions (experts & CTA)
  selectExpert: "Expert kiezen",
  statusExpert: "Expert:",
  clearChat: "Chat wissen",
  startBuilding: "Bouwen",
  startBuildingMsg:
    "Leg de build-functie uit en de commando’s die ik moet kennen om efficiënt met je te bouwen. Toon een tabel.",

  // Actions / footer
  export: "Exporteren",
  levels: "Niveaus",
  levelsComing: "Niveaus binnenkort beschikbaar",
  threadExported: "Chat geëxporteerd.",

  // Status bar
  statusMode: "Modus:",
  statusAgent: "Agent:",

  // Backward-compat alias
  statusAI: "Agent:",

  // Status texts
  "status.modeSet": "Modus ingesteld: {label}.",

  // Modes – system buttons
  "mode.onboarding": "ONBOARDING",
  "mode.council": "COUNCIL13",
  "mode.default": "M · Standaard",
  "mode.select": "Modus kiezen",

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
  "labels.modes.character": "Karaktermodi",
  "modes.category.core": "CORE",
  "modes.category.intellectual": "INTELLECTUEEL",
  "modes.category.creator": "CREATOR",
  "modes.category.heart": "HART",
  "modes.category.spirit": "SPIRIT",

  // Experts (used by Saeule.tsx)
  "experts.title": "Experts",
  "experts.choose": "Expert kiezen",

  // Expert categories
  "experts.category.life": "Leven",
  "experts.category.tech": "Technologie",
  "experts.category.space": "Ruimte",
  "experts.category.ethics": "Ethiek",
  "experts.category.universe": "Universum",

  // Expert labels
  "experts.biologist": "Bioloog",
  "experts.chemist": "Chemicus",
  "experts.physicist": "Natuurkundige",
  "experts.computer_scientist": "Computerwetenschapper",
  "experts.jurist": "Jurist",
  "experts.architect_civil_engineer": "Architect / Civiel ingenieur",
  "experts.landscape_designer": "Landschapsontwerper",
  "experts.interior_designer": "Interieurontwerper",
  "experts.electrical_engineer": "Elektrotechnisch ingenieur",
  "experts.mathematician": "Wiskundige",
  "experts.astrologer": "Astroloog",
  "experts.weather_expert": "Weerexpert",
  "experts.molecular_scientist": "Moleculair wetenschapper",

  // CTA fallback
  "cta.fallback":
    "Alles klaar — vertel me wat je wilt bouwen (app, flow, functie…).",

  // CTA labels
  "cta.build": "Bouwen",
  "cta.export": "Exporteren",
  "cta.clear": "Chat wissen",

  // Pillar sections
  "pillar.section.header": "Hoofding modes en experts",
  "pillar.section.modesTitle": "MODES",
  "pillar.section.modes": "Modi",
  "pillar.section.experts": "Experts",
  "pillar.section.systemTitle": "SYSTEEM",
  "pillar.section.system": "Systeemstatus",
  "pillar.section.actionsTitle": "ACTIES",
  "pillar.section.utility": "Acties & export",

  // Actions (export / delete)
  "actions.export.title": "Chat exporteren",
  "actions.export.help": "Sla je chat op als bestand.",
  "actions.export.csv": "CSV",
  "actions.export.json": "JSON",

  "actions.delete.title": "Chat verwijderen",
  "actions.delete.warning":
    "Dit verwijdert de gehele chat permanent. Exporteer als CSV of JSON als je deze wilt bewaren.",
  "actions.delete.now": "VERWIJDEREN",

  // ARIA
  exportCsvAria: "Thread als CSV exporteren",
  exportJsonAria: "Thread als JSON exporteren",
  clearChatAria: "Chat wissen",

  // ARIA / A11y
  conversationAria: "Chatgeschiedenis",
  assistantSays: "Bericht van de assistent",
  youSaid: "Jouw bericht",
  columnAria: "Kolom — Besturing & selectie",
  mobileOverlayLabel: "Mobiele kolom-overlay",
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
  columnTitle: "Колонка",
  sectionControl: "Управление",
  onboarding: "ONBOARDING",
  mDefault: "M · По умолчанию",
  selectMode: "Выбрать режим",
  council13: "COUNCIL13",
  selectAI: "Выбрать ИИ",
  modules: "Модули",
  coming: "Скоро",

  // Sidebar additions (experts & CTA)
  selectExpert: "Выбрать эксперта",
  statusExpert: "Эксперт:",
  clearChat: "Очистить чат",
  startBuilding: "Создать",
  startBuildingMsg:
    "Объясни мне функцию build и команды, которые нужно знать, чтобы эффективно строить вместе с тобой. Покажи таблицу.",

  // Actions / footer
  export: "Экспорт",
  levels: "Уровни",
  levelsComing: "Уровни скоро будут доступны",
  threadExported: "Чат экспортирован.",

  // Status bar
  statusMode: "Режим:",
  statusAgent: "Агент:",

  // Backward-compat alias
  statusAI: "Агент:",

  // Status texts
  "status.modeSet": "Режим установлен: {label}.",

  // Modes – system buttons
  "mode.onboarding": "ONBOARDING",
  "mode.council": "COUNCIL13",
  "mode.default": "M · По умолчанию",
  "mode.select": "Выбрать режим",

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
  "labels.modes.character": "Режимы характера",
  "modes.category.core": "CORE",
  "modes.category.intellectual": "ИНТЕЛЛЕКТ",
  "modes.category.creator": "CREATOR",
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
  "experts.architect_civil_engineer": "Архитектор / Инженер-строитель",
  "experts.landscape_designer": "Ландшафтный дизайнер",
  "experts.interior_designer": "Дизайнер интерьеров",
  "experts.electrical_engineer": "Инженер-электрик",
  "experts.mathematician": "Математик",
  "experts.astrologer": "Астролог",
  "experts.weather_expert": "Специалист по погоде",
  "experts.molecular_scientist": "Молекулярный учёный",

  // CTA fallback
  "cta.fallback":
    "Всё готово — расскажите, что вы хотите создать (приложение, поток, функцию…).",

  // CTA labels
  "cta.build": "Создать",
  "cta.export": "Экспортировать",
  "cta.clear": "Очистить чат",

  // Pillar sections
  "pillar.section.header": "Заголовок режимов и экспертов",
  "pillar.section.modesTitle": "MODES",
  "pillar.section.modes": "Режимы",
  "pillar.section.experts": "Эксперты",
  "pillar.section.systemTitle": "СИСТЕМА",
  "pillar.section.system": "Состояние системы",
  "pillar.section.actionsTitle": "ДЕЙСТВИЯ",
  "pillar.section.utility": "Действия и экспорт",

  // Actions (export / delete)
  "actions.export.title": "Экспортировать чат",
  "actions.export.help": "Сохраните чат в виде файла.",
  "actions.export.csv": "CSV",
  "actions.export.json": "JSON",

  "actions.delete.title": "Удалить чат",
  "actions.delete.warning":
    "Это навсегда удалит весь чат. Экспортируйте его в CSV или JSON, если хотите сохранить.",
  "actions.delete.now": "УДАЛИТЬ",

  // ARIA
  exportCsvAria: "Экспортировать тред в CSV",
  exportJsonAria: "Экспортировать тред в JSON",
  clearChatAria: "Очистить чат",

  // ARIA / A11y
  conversationAria: "История чата",
  assistantSays: "Сообщение ассистента",
  youSaid: "Ваше сообщение",
  columnAria: "Колонка — Управление и выбор",
  mobileOverlayLabel: "Мобильное наложение колонки",
} as const;

const zh = {
  // Input / messaging
  writeMessage: "写一条消息…",
  send: "发送",

  // Input helpers
  tools: "工具",
  newline: "新行",
  comingUpload: "上传",
  comingVoice: "语音",
  comingFunctions: "选项",

  // Overlay header / buttons (mobile)
  close: "关闭",

  // Sidebar / Column
  columnTitle: "侧栏",
  sectionControl: "控制",
  onboarding: "ONBOARDING",
  mDefault: "M · 默认",
  selectMode: "选择模式",
  council13: "COUNCIL13",
  selectAI: "选择 AI",
  modules: "模块",
  coming: "即将推出",

  // Sidebar additions (experts & CTA)
  selectExpert: "选择专家",
  statusExpert: "专家：",
  clearChat: "清空聊天",
  startBuilding: "开始构建",
  startBuildingMsg:
    "请向我解释 build 功能以及我需要掌握的命令，好能高效地和你一起构建。请显示一张表格。",

  // Actions / footer
  export: "导出",
  levels: "级别",
  levelsComing: "级别即将推出",
  threadExported: "聊天已导出。",

  // Status bar
  statusMode: "模式：",
  statusAgent: "代理：",

  // Backward-compat alias
  statusAI: "代理：",

  // Status texts
  "status.modeSet": "模式已设置：{label}。",

  // Modes – system buttons
  "mode.onboarding": "ONBOARDING",
  "mode.council": "COUNCIL13",
  "mode.default": "M · 默认",
  "mode.select": "选择模式",

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
  "labels.modes.character": "性格模式",
  "modes.category.core": "CORE",
  "modes.category.intellectual": "理性",
  "modes.category.creator": "CREATOR",
  "modes.category.heart": "内心",
  "modes.category.spirit": "精神",

  // Experts (used by Saeule.tsx)
  "experts.title": "专家",
  "experts.choose": "选择专家",

  // Expert categories
  "experts.category.life": "生命",
  "experts.category.tech": "科技",
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
  "experts.weather_expert": "天气专家",
  "experts.molecular_scientist": "分子科学家",

  // CTA fallback
  "cta.fallback":
    "一切就绪 —— 告诉我你想构建什么（应用、流程、功能……）。",

  // CTA labels
  "cta.build": "开始构建",
  "cta.export": "导出",
  "cta.clear": "清空聊天",

  // Pillar sections
  "pillar.section.header": "模式与专家标题",
  "pillar.section.modesTitle": "MODES",
  "pillar.section.modes": "模式",
  "pillar.section.experts": "专家",
  "pillar.section.systemTitle": "SYSTEM",
  "pillar.section.system": "系统状态",
  "pillar.section.actionsTitle": "ACTIONS",
  "pillar.section.utility": "操作与导出",

  // Actions (export / delete)
  "actions.export.title": "导出聊天",
  "actions.export.help": "将聊天保存为文件。",
  "actions.export.csv": "CSV",
  "actions.export.json": "JSON",

  "actions.delete.title": "删除聊天",
  "actions.delete.warning":
    "这将永久删除整个聊天。如需保留，请先导出为 CSV 或 JSON。",
  "actions.delete.now": "删除",

  // ARIA
  exportCsvAria: "将会话导出为 CSV",
  exportJsonAria: "将会话导出为 JSON",
  clearChatAria: "清空聊天",

  // ARIA / A11y
  conversationAria: "聊天记录",
  assistantSays: "助手消息",
  youSaid: "你的消息",
  columnAria: "侧栏 — 控制与选择",
  mobileOverlayLabel: "移动端侧栏覆盖层",
} as const;

const ja = {
  // Input / messaging
  writeMessage: "メッセージを入力…",
  send: "送信",

  // Input helpers
  tools: "ツール",
  newline: "改行",
  comingUpload: "アップロード",
  comingVoice: "音声",
  comingFunctions: "オプション",

  // Overlay header / buttons (mobile)
  close: "閉じる",

  // Sidebar / Column
  columnTitle: "カラム",
  sectionControl: "コントロール",
  onboarding: "ONBOARDING",
  mDefault: "M · デフォルト",
  selectMode: "モードを選択",
  council13: "COUNCIL13",
  selectAI: "AI を選択",
  modules: "モジュール",
  coming: "近日公開",

  // Sidebar additions (experts & CTA)
  selectExpert: "エキスパートを選択",
  statusExpert: "エキスパート：",
  clearChat: "チャットを削除",
  startBuilding: "ビルド開始",
  startBuildingMsg:
    "build 機能と、一緒に効率よく構築するために必要なコマンドを説明してください。表形式で表示してください。",

  // Actions / footer
  export: "エクスポート",
  levels: "レベル",
  levelsComing: "レベルは近日公開予定",
  threadExported: "チャットをエクスポートしました。",

  // Status bar
  statusMode: "モード：",
  statusAgent: "エージェント：",

  // Backward-compat alias
  statusAI: "エージェント：",

  // Status texts
  "status.modeSet": "モードを設定しました：{label}。",

  // Modes – system buttons
  "mode.onboarding": "ONBOARDING",
  "mode.council": "COUNCIL13",
  "mode.default": "M · デフォルト",
  "mode.select": "モードを選択",

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
  "labels.modes.character": "キャラクターモード",
  "modes.category.core": "CORE",
  "modes.category.intellectual": "知性",
  "modes.category.creator": "CREATOR",
  "modes.category.heart": "ハート",
  "modes.category.spirit": "スピリット",

  // Experts (used by Saeule.tsx)
  "experts.title": "エキスパート",
  "experts.choose": "エキスパートを選択",

  // Expert categories
  "experts.category.life": "生命",
  "experts.category.tech": "テクノロジー",
  "experts.category.space": "宇宙",
  "experts.category.ethics": "倫理",
  "experts.category.universe": "宇宙全体",

  // Expert labels
  "experts.biologist": "生物学者",
  "experts.chemist": "化学者",
  "experts.physicist": "物理学者",
  "experts.computer_scientist": "コンピューターサイエンティスト",
  "experts.jurist": "法学者",
  "experts.architect_civil_engineer": "建築家／土木技師",
  "experts.landscape_designer": "ランドスケープデザイナー",
  "experts.interior_designer": "インテリアデザイナー",
  "experts.electrical_engineer": "電気技術者",
  "experts.mathematician": "数学者",
  "experts.astrologer": "占星術師",
  "experts.weather_expert": "気象エキスパート",
  "experts.molecular_scientist": "分子科学者",

  // CTA fallback
  "cta.fallback":
    "準備完了です —— 何を構築したいか教えてください（アプリ、フロー、機能など）。",

  // CTA labels
  "cta.build": "ビルド開始",
  "cta.export": "エクスポート",
  "cta.clear": "チャットを削除",

  // Pillar sections
  "pillar.section.header": "モード＆エキスパート見出し",
  "pillar.section.modesTitle": "MODES",
  "pillar.section.modes": "モード",
  "pillar.section.experts": "エキスパート",
  "pillar.section.systemTitle": "SYSTEM",
  "pillar.section.system": "システムステータス",
  "pillar.section.actionsTitle": "ACTIONS",
  "pillar.section.utility": "アクションとエクスポート",

  // Actions (export / delete)
  "actions.export.title": "チャットをエクスポート",
  "actions.export.help": "チャットをファイルとして保存します。",
  "actions.export.csv": "CSV",
  "actions.export.json": "JSON",

  "actions.delete.title": "チャットを削除",
  "actions.delete.warning":
    "チャット全体が完全に削除されます。保存したい場合は、事前に CSV か JSON にエクスポートしてください。",
  "actions.delete.now": "削除",

  // ARIA
  exportCsvAria: "スレッドを CSV としてエクスポート",
  exportJsonAria: "スレッドを JSON としてエクスポート",
  clearChatAria: "チャットを削除",

  // ARIA / A11y
  conversationAria: "チャット履歴",
  assistantSays: "アシスタントのメッセージ",
  youSaid: "あなたのメッセージ",
  columnAria: "カラム — コントロール＆選択",
  mobileOverlayLabel: "モバイルカラムのオーバーレイ",
} as const;

const ko = {
  // Input / messaging
  writeMessage: "메시지를 입력하세요…",
  send: "보내기",

  // Input helpers
  tools: "도구",
  newline: "새 줄",
  comingUpload: "업로드",
  comingVoice: "음성",
  comingFunctions: "옵션",

  // Overlay header / buttons (mobile)
  close: "닫기",

  // Sidebar / Column
  columnTitle: "컬럼",
  sectionControl: "컨트롤",
  onboarding: "ONBOARDING",
  mDefault: "M · 기본",
  selectMode: "모드 선택",
  council13: "COUNCIL13",
  selectAI: "AI 선택",
  modules: "모듈",
  coming: "곧 제공 예정",

  // Sidebar additions (experts & CTA)
  selectExpert: "전문가 선택",
  statusExpert: "전문가:",
  clearChat: "채팅 지우기",
  startBuilding: "빌드 시작",
  startBuildingMsg:
    "build 기능과, 너와 함께 효율적으로 빌드하기 위해 알아야 할 명령어를 설명해 주세요. 표로 보여주세요.",

  // Actions / footer
  export: "내보내기",
  levels: "레벨",
  levelsComing: "레벨은 곧 제공됩니다",
  threadExported: "채팅이 내보내졌습니다.",

  // Status bar
  statusMode: "모드:",
  statusAgent: "에이전트:",

  // Backward-compat alias
  statusAI: "에이전트:",

  // Status texts
  "status.modeSet": "모드가 설정되었습니다: {label}.",

  // Modes – system buttons
  "mode.onboarding": "ONBOARDING",
  "mode.council": "COUNCIL13",
  "mode.default": "M · 기본",
  "mode.select": "모드 선택",

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
  "labels.modes.character": "캐릭터 모드",
  "modes.category.core": "CORE",
  "modes.category.intellectual": "지성",
  "modes.category.creator": "CREATOR",
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
    "준비가 끝났어요 — 무엇을 만들고 싶은지 알려 주세요 (앱, 플로우, 기능 등).",

  // CTA labels
  "cta.build": "빌드 시작",
  "cta.export": "내보내기",
  "cta.clear": "채팅 지우기",

  // Pillar sections
  "pillar.section.header": "모드 및 전문가 헤더",
  "pillar.section.modesTitle": "MODES",
  "pillar.section.modes": "모드",
  "pillar.section.experts": "전문가",
  "pillar.section.systemTitle": "SYSTEM",
  "pillar.section.system": "시스템 상태",
  "pillar.section.actionsTitle": "ACTIONS",
  "pillar.section.utility": "작업 및 내보내기",

  // Actions (export / delete)
  "actions.export.title": "채팅 내보내기",
  "actions.export.help": "채팅을 파일로 저장합니다.",
  "actions.export.csv": "CSV",
  "actions.export.json": "JSON",

  "actions.delete.title": "채팅 삭제",
  "actions.delete.warning":
    "전체 채팅이 영구적으로 삭제됩니다. 보관하려면 먼저 CSV 또는 JSON으로 내보내세요.",
  "actions.delete.now": "삭제",

  // ARIA
  exportCsvAria: "스레드를 CSV로 내보내기",
  exportJsonAria: "스레드를 JSON으로 내보내기",
  clearChatAria: "채팅 지우기",

  // ARIA / A11y
  conversationAria: "채팅 기록",
  assistantSays: "어시스턴트 메시지",
  youSaid: "사용자 메시지",
  columnAria: "컬럼 — 컨트롤 및 선택",
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
  comingVoice: "صوت",
  comingFunctions: "خيارات",

  // Overlay header / buttons (mobile)
  close: "إغلاق",

  // Sidebar / Column
  columnTitle: "العمود",
  sectionControl: "التحكم",
  onboarding: "ONBOARDING",
  mDefault: "M · الوضع الافتراضي",
  selectMode: "اختر الوضع",
  council13: "COUNCIL13",
  selectAI: "اختر الذكاء الاصطناعي",
  modules: "الوحدات",
  coming: "قريبًا",

  // Sidebar additions (experts & CTA)
  selectExpert: "اختر الخبير",
  statusExpert: "الخبير:",
  clearChat: "مسح المحادثة",
  startBuilding: "ابدأ البناء",
  startBuildingMsg:
    "اشرح لي وظيفة build والأوامر التي أحتاج إلى معرفتها للعمل معك بكفاءة. اعرض جدولًا.",

  // Actions / footer
  export: "تصدير",
  levels: "المستويات",
  levelsComing: "المستويات قيد الإضافة",
  threadExported: "تم تصدير المحادثة.",

  // Status bar
  statusMode: "الوضع:",
  statusAgent: "الوكيل:",

  // Backward-compat alias
  statusAI: "الوكيل:",

  // Status texts
  "status.modeSet": "تم تعيين الوضع: {label}.",

  // Modes – system buttons
  "mode.onboarding": "ONBOARDING",
  "mode.council": "COUNCIL13",
  "mode.default": "M · الوضع الافتراضي",
  "mode.select": "اختر الوضع",

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
  "labels.modes.character": "أوضاع الشخصية",
  "modes.category.core": "CORE",
  "modes.category.intellectual": "الفكر",
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
  "experts.biologist": "عالِم أحياء",
  "experts.chemist": "كيميائي",
  "experts.physicist": "فيزيائي",
  "experts.computer_scientist": "عالِم حاسوب",
  "experts.jurist": "قانوني",
  "experts.architect_civil_engineer": "مهندس معماري / مدني",
  "experts.landscape_designer": "مصمم مناظر طبيعية",
  "experts.interior_designer": "مصمم داخلي",
  "experts.electrical_engineer": "مهندس كهرباء",
  "experts.mathematician": "رياضياتي",
  "experts.astrologer": "منجّم",
  "experts.weather_expert": "خبير طقس",
  "experts.molecular_scientist": "عالِم جزيئات",

  // CTA fallback
  "cta.fallback":
    "كل شيء جاهز — أخبرني بما تريد بناءه (تطبيق، مسار، ميزة…).",

  // CTA labels
  "cta.build": "ابدأ البناء",
  "cta.export": "تصدير",
  "cta.clear": "مسح المحادثة",

  // Pillar sections
  "pillar.section.header": "رأس الأوضاع والخبراء",
  "pillar.section.modesTitle": "MODES",
  "pillar.section.modes": "الأوضاع",
  "pillar.section.experts": "الخبراء",
  "pillar.section.systemTitle": "SYSTEM",
  "pillar.section.system": "حالة النظام",
  "pillar.section.actionsTitle": "ACTIONS",
  "pillar.section.utility": "الإجراءات والتصدير",

  // Actions (export / delete)
  "actions.export.title": "تصدير المحادثة",
  "actions.export.help": "احفظ المحادثة كملف.",
  "actions.export.csv": "CSV",
  "actions.export.json": "JSON",

  "actions.delete.title": "مسح المحادثة",
  "actions.delete.warning":
    "سيتم حذف المحادثة بالكامل بشكل دائم. إذا أردت الاحتفاظ بها، قم بتصديرها أولاً.",
  "actions.delete.now": "حذف",

  // ARIA
  exportCsvAria: "تصدير المحادثة بصيغة CSV",
  exportJsonAria: "تصدير المحادثة بصيغة JSON",
  clearChatAria: "مسح المحادثة",

  // ARIA / A11y
  conversationAria: "سجل المحادثة",
  assistantSays: "رسالة من المساعد",
  youSaid: "رسالتك",
  columnAria: "العمود — التحكم والاختيار",
  mobileOverlayLabel: "غطاء العمود في الهاتف",
} as const;

const hi = {
  // Input / messaging
  writeMessage: "संदेश लिखें…",
  send: "भेजें",

  // Input helpers
  tools: "उपकरण",
  newline: "नई पंक्ति",
  comingUpload: "अपलोड",
  comingVoice: "आवाज़",
  comingFunctions: "विकल्प",

  // Overlay header / buttons (mobile)
  close: "बंद करें",

  // Sidebar / Column
  columnTitle: "कॉलम",
  sectionControl: "नियंत्रण",
  onboarding: "ONBOARDING",
  mDefault: "M · डिफ़ॉल्ट",
  selectMode: "मोड चुनें",
  council13: "COUNCIL13",
  selectAI: "AI चुनें",
  modules: "मॉड्यूल",
  coming: "जल्द आ रहा है",

  // Sidebar additions (experts & CTA)
  selectExpert: "विशेषज्ञ चुनें",
  statusExpert: "विशेषज्ञ:",
  clearChat: "चैट साफ़ करें",
  startBuilding: "बिल्ड शुरू करें",
  startBuildingMsg:
    "कृपया मुझे build फ़ंक्शन और वे कमांड समझाएँ जिन्हें जानना आवश्यक है ताकि हम साथ में कुशलता से काम कर सकें। एक तालिका दिखाएँ।",

  // Actions / footer
  export: "निर्यात",
  levels: "स्तर",
  levelsComing: "स्तर जल्द उपलब्ध होंगे",
  threadExported: "चैट निर्यात हो गई।",

  // Status bar
  statusMode: "मोड:",
  statusAgent: "एजेंट:",

  // Backward-compat alias
  statusAI: "एजेंट:",

  // Status texts
  "status.modeSet": "मोड सेट किया गया: {label}.",

  // Modes – system buttons
  "mode.onboarding": "ONBOARDING",
  "mode.council": "COUNCIL13",
  "mode.default": "M · डिफ़ॉल्ट",
  "mode.select": "मोड चुनें",

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
  "labels.modes.character": "चरित्र मोड",
  "modes.category.core": "CORE",
  "modes.category.intellectual": "बौद्धिक",
  "modes.category.creator": "CREATOR",
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
  "experts.category.universe": "ब्रह्माण्ड",

  // Expert labels
  "experts.biologist": "जीवविज्ञानी",
  "experts.chemist": "रसायनज्ञ",
  "experts.physicist": "भौतिक विज्ञानी",
  "experts.computer_scientist": "कंप्यूटर वैज्ञानिक",
  "experts.jurist": "क़ानून विशेषज्ञ",
  "experts.architect_civil_engineer": "वास्तुकार / सिविल इंजीनियर",
  "experts.landscape_designer": "लैंडस्केप डिज़ाइनर",
  "experts.interior_designer": "इंटीरियर डिज़ाइनर",
  "experts.electrical_engineer": "इलेक्ट्रिकल इंजीनियर",
  "experts.mathematician": "गणितज्ञ",
  "experts.astrologer": "ज्योतिषी",
  "experts.weather_expert": "मौसम विशेषज्ञ",
  "experts.molecular_scientist": "अणु वैज्ञानिक",

  // CTA fallback
  "cta.fallback":
    "सब तैयार है — बताइए आप क्या बनाना चाहते हैं (ऐप, फ्लो, फीचर…).",

  // CTA labels
  "cta.build": "बिल्ड शुरू करें",
  "cta.export": "निर्यात",
  "cta.clear": "चैट साफ़ करें",

  // Pillar sections
  "pillar.section.header": "मोड और विशेषज्ञ — हेडर",
  "pillar.section.modesTitle": "MODES",
  "pillar.section.modes": "मोड",
  "pillar.section.experts": "विशेषज्ञ",
  "pillar.section.systemTitle": "SYSTEM",
  "pillar.section.system": "सिस्टम स्थिति",
  "pillar.section.actionsTitle": "ACTIONS",
  "pillar.section.utility": "कार्रवाई और निर्यात",

  // Actions (export / delete)
  "actions.export.title": "चैट निर्यात करें",
  "actions.export.help": "चैट को फ़ाइल के रूप में सहेजें।",
  "actions.export.csv": "CSV",
  "actions.export.json": "JSON",

  "actions.delete.title": "चैट हटाएँ",
  "actions.delete.warning":
    "यह पूरी चैट को स्थायी रूप से हटा देगा। यदि आप इसे सुरक्षित रखना चाहते हैं, तो पहले CSV या JSON में निर्यात करें।",
  "actions.delete.now": "हटाएँ",

  // ARIA
  exportCsvAria: "संवाद को CSV के रूप में निर्यात करें",
  exportJsonAria: "संवाद को JSON के रूप में निर्यात करें",
  clearChatAria: "चैट हटाएँ",

  // ARIA / A11y
  conversationAria: "चैट लॉग",
  assistantSays: "सहायक का संदेश",
  youSaid: "आपका संदेश",
  columnAria: "कॉलम — नियंत्रण और चयन",
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
