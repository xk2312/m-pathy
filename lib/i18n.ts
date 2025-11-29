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

  // Experts (used by Saeule.tsx)
  "experts.title": "Experts",
  "experts.choose": "Choose expert",

  // CTA fallback
  "cta.fallback": "All set — tell me what you want to build (app, flow, feature …).",

   // ARIA / A11y
  conversationAria: "Chat log",
  assistantSays: "Assistant message",
  youSaid: "Your message",
  columnAria: "Column — Controls & Selection",
  mobileOverlayLabel: "Mobile column overlay",

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
  
} as const;

const de: Dict = {
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
  startBuilding: "bauen",
  startBuildingMsg:
    "Erkläre mir die Build-Funktion und die Befehle, die ich kennen muss, um effizient mit dir zu bauen. Zeige eine Tabelle.",

  // Actions / footer
  export: "Export",
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

  // Experts (used by Saeule.tsx)
  "experts.title": "Experten",
  "experts.choose": "Experten wählen",

  // CTA fallback
  "cta.fallback":
    "Alles klar — sag mir einfach, was du bauen möchtest (App, Flow, Feature …).",

  // ARIA / A11y
  conversationAria: "Chat-Verlauf",
  assistantSays: "Assistenten-Nachricht",
  youSaid: "Deine Nachricht",
  columnAria: "Säule — Steuerung & Auswahl",
  mobileOverlayLabel: "Mobiles Säulen-Overlay",

  // Expert categories (pillar – Experts tabs)
  "experts.category.life": "Leben",
  "experts.category.tech": "Technik",
  "experts.category.space": "Raum",
  "experts.category.ethics": "Ethik",
  "experts.category.universe": "Universum",

  // Expert labels (pillar – Experts list)
  "experts.biologist": "Biologe",
  "experts.chemist": "Chemiker",
  "experts.physicist": "Physiker",
  "experts.computer_scientist": "Informatiker",
  "experts.jurist": "Jurist",
  "experts.architect_civil_engineer": "Architekt / Bauingenieur",
  "experts.landscape_designer": "Landschaftsdesigner",
  "experts.interior_designer": "Interior Designer",
  "experts.electrical_engineer": "Elektroingenieur",
  "experts.mathematician": "Mathematiker",
  "experts.astrologer": "Astrologe",
  "experts.weather_expert": "Wetterexperte",
  "experts.molecular_scientist": "Molekularwissenschaftler",
} as const;

const fr: Dict = {
  // Input / messaging
  writeMessage: "Écrire un message…",
  send: "Envoyer",

  // Input helpers
  tools: "Outils",
  newline: "Nouvelle ligne",
  comingUpload: "Upload",
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
  selectAI: "Choisir une IA",
  modules: "Modules",
  coming: "Bientôt",

  // Sidebar additions (experts & CTA)
  selectExpert: "Choisir un expert",
  statusExpert: "Expert :",
  clearChat: "Vider le chat",
  startBuilding: "build",
  startBuildingMsg:
    "Explique-moi la fonction build et les commandes que je dois connaître pour construire efficacement avec toi. Affiche un tableau.",

  // Actions / footer
  export: "Exporter",
  levels: "Niveaux",
  levelsComing: "Les niveaux arrivent bientôt",
  threadExported: "Chat exporté.",

  // Status bar
  statusMode: "Mode :",
  statusAgent: "Agent :",

  // Backward-compat alias
  statusAI: "Agent :",

  // Status texts
  "status.modeSet": "Mode défini : {label}.",

  // Experts (used by Saeule.tsx)
  "experts.title": "Experts",
  "experts.choose": "Choisir un expert",

  // CTA fallback
  "cta.fallback":
    "Parfait — dis-moi simplement ce que tu veux construire (app, flow, fonctionnalité…).",

  // ARIA / A11y
  conversationAria: "Historique du chat",
  assistantSays: "Message de l’assistant",
  youSaid: "Ton message",
  columnAria: "Colonne — Contrôles et sélection",
  mobileOverlayLabel: "Overlay de colonne mobile",

  // Expert categories (pillar – Experts tabs)
  "experts.category.life": "Vie",
  "experts.category.tech": "Tech",
  "experts.category.space": "Espace",
  "experts.category.ethics": "Éthique",
  "experts.category.universe": "Univers",

  // Expert labels (pillar – Experts list)
  "experts.biologist": "Biologiste",
  "experts.chemist": "Chimiste",
  "experts.physicist": "Physicien",
  "experts.computer_scientist": "Informaticien",
  "experts.jurist": "Juriste",
  "experts.architect_civil_engineer": "Architecte / Ingénieur civil",
  "experts.landscape_designer": "Paysagiste",
  "experts.interior_designer": "Designer d’intérieur",
  "experts.electrical_engineer": "Ingénieur électricien",
  "experts.mathematician": "Mathématicien",
  "experts.astrologer": "Astrologue",
  "experts.weather_expert": "Expert météo",
  "experts.molecular_scientist": "Scientifique moléculaire",
} as const;

const es: Dict = {
  // Input / messaging
  writeMessage: "Escribe un mensaje…",
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
  startBuilding: "construir",
  startBuildingMsg:
    "Explícame la función de build y los comandos que necesito conocer para construir contigo de forma eficiente. Muestra una tabla.",

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

  // Experts (used by Saeule.tsx)
  "experts.title": "Expertos",
  "experts.choose": "Elegir experto",

  // CTA fallback
  "cta.fallback":
    "Todo listo — dime qué quieres construir (app, flujo, funcionalidad …).",

  // ARIA / A11y
  conversationAria: "Historial de chat",
  assistantSays: "Mensaje del asistente",
  youSaid: "Tu mensaje",
  columnAria: "Columna — Controles y selección",
  mobileOverlayLabel: "Superposición móvil de la columna",

  // Expert categories (pillar – Experts tabs)
  "experts.category.life": "Vida",
  "experts.category.tech": "Tecnología",
  "experts.category.space": "Espacio",
  "experts.category.ethics": "Ética",
  "experts.category.universe": "Universo",

  // Expert labels (pillar – Experts list)
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
  "experts.weather_expert": "Experto en meteorología",
  "experts.molecular_scientist": "Científico molecular",
} as const;

const it: Dict = {
  // Input / messaging
  writeMessage: "Scrivi un messaggio…",
  send: "Invia",

  // Input helpers
  tools: "Strumenti",
  newline: "Nuova riga",
  comingUpload: "Upload",
  comingVoice: "Voce",
  comingFunctions: "Opzioni",

  // Overlay header / buttons (mobile)
  close: "Chiudi",

  // Sidebar / Column
  columnTitle: "Colonna",
  sectionControl: "Controlli",
  onboarding: "ONBOARDING",
  mDefault: "M · Predefinito",
  selectMode: "Seleziona modalità",
  council13: "COUNCIL13",
  selectAI: "Seleziona IA",
  modules: "Moduli",
  coming: "In arrivo",

  // Sidebar additions (experts & CTA)
  selectExpert: "Seleziona esperto",
  statusExpert: "Esperto:",
  clearChat: "Svuota chat",
  startBuilding: "costruire",
  startBuildingMsg:
    "Spiegami la funzione di build e i comandi che devo conoscere per costruire in modo efficiente con te. Mostra una tabella.",

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

  // Experts (used by Saeule.tsx)
  "experts.title": "Esperti",
  "experts.choose": "Seleziona esperto",

  // CTA fallback
  "cta.fallback":
    "Tutto pronto — dimmi cosa vuoi costruire (app, flow, funzionalità …).",

  // ARIA / A11y
  conversationAria: "Cronologia della chat",
  assistantSays: "Messaggio dell’assistente",
  youSaid: "Il tuo messaggio",
  columnAria: "Colonna — Controlli e selezione",
  mobileOverlayLabel: "Overlay mobile della colonna",

  // Expert categories (pillar – Experts tabs)
  "experts.category.life": "Vita",
  "experts.category.tech": "Tecnologia",
  "experts.category.space": "Spazio",
  "experts.category.ethics": "Etica",
  "experts.category.universe": "Universo",

  // Expert labels (pillar – Experts list)
  "experts.biologist": "Biologo",
  "experts.chemist": "Chimico",
  "experts.physicist": "Fisico",
  "experts.computer_scientist": "Ingegnere informatico",
  "experts.jurist": "Giurista",
  "experts.architect_civil_engineer": "Architetto / Ingegnere civile",
  "experts.landscape_designer": "Landscape designer",
  "experts.interior_designer": "Interior designer",
  "experts.electrical_engineer": "Ingegnere elettrico",
  "experts.mathematician": "Matematico",
  "experts.astrologer": "Astrologo",
  "experts.weather_expert": "Esperto meteo",
  "experts.molecular_scientist": "Scienziato molecolare",
} as const;

const pt: Dict = {
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
  startBuilding: "construir",
  startBuildingMsg:
    "Explique-me a função de build e os comandos que preciso conhecer para construir contigo de forma eficiente. Mostre uma tabela.",

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

  // Experts (used by Saeule.tsx)
  "experts.title": "Especialistas",
  "experts.choose": "Escolher especialista",

  // CTA fallback
  "cta.fallback":
    "Tudo pronto — diga-me o que deseja construir (app, fluxo, funcionalidade …).",

  // ARIA / A11y
  conversationAria: "Histórico do chat",
  assistantSays: "Mensagem do assistente",
  youSaid: "A sua mensagem",
  columnAria: "Coluna — Controlo e seleção",
  mobileOverlayLabel: "Overlay móvel da coluna",

  // Expert categories (pillar – Experts tabs)
  "experts.category.life": "Vida",
  "experts.category.tech": "Tecnologia",
  "experts.category.space": "Espaço",
  "experts.category.ethics": "Ética",
  "experts.category.universe": "Universo",

  // Expert labels (pillar – Experts list)
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
} as const;

const nl: Dict = {
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
  columnTitle: "Kolom",
  sectionControl: "Bediening",
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
  clearChat: "Chat legen",
  startBuilding: "bouwen",
  startBuildingMsg:
    "Leg mij de build-functie uit en de commando’s die ik moet kennen om efficiënt met je te bouwen. Toon een tabel.",

  // Actions / footer
  export: "Exporteren",
  levels: "Niveaus",
  levelsComing: "Niveaus binnenkort",
  threadExported: "Chat geëxporteerd.",

  // Status bar
  statusMode: "Modus:",
  statusAgent: "Agent:",

  // Backward-compat alias
  statusAI: "Agent:",

  // Status texts
  "status.modeSet": "Modus ingesteld: {label}.",

  // Experts (used by Saeule.tsx)
  "experts.title": "Experten",
  "experts.choose": "Expert kiezen",

  // CTA fallback
  "cta.fallback":
    "Alles klaar — vertel me wat je wilt bouwen (app, flow, feature …).",

  // ARIA / A11y
  conversationAria: "Chatlog",
  assistantSays: "Bericht van de assistent",
  youSaid: "Jouw bericht",
  columnAria: "Kolom — Bediening & selectie",
  mobileOverlayLabel: "Mobiele kolom-overlay",

  // Expert categories (pillar – Experts tabs)
  "experts.category.life": "Leven",
  "experts.category.tech": "Tech",
  "experts.category.space": "Ruimte",
  "experts.category.ethics": "Ethiek",
  "experts.category.universe": "Universum",

  // Expert labels (pillar – Experts list)
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
} as const;

const ru: Dict = {
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
  columnTitle: "Колонна",
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
  startBuilding: "создать",
  startBuildingMsg:
    "Объясни мне функцию build и команды, которые мне нужно знать, чтобы эффективно создавать вместе с тобой. Покажи таблицу.",

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

  // Experts (used by Saeule.tsx)
  "experts.title": "Эксперты",
  "experts.choose": "Выбрать эксперта",

  // CTA fallback
  "cta.fallback":
    "Все готово — расскажи, что ты хочешь создать (приложение, поток, функцию …).",

  // ARIA / A11y
  conversationAria: "История чата",
  assistantSays: "Сообщение ассистента",
  youSaid: "Ваше сообщение",
  columnAria: "Колонна — Управление и выбор",
  mobileOverlayLabel: "Мобильное оверлей-меню колонны",

  // Expert categories (pillar – Experts tabs)
  "experts.category.life": "Жизнь",
  "experts.category.tech": "Техника",
  "experts.category.space": "Пространство",
  "experts.category.ethics": "Этика",
  "experts.category.universe": "Вселенная",

  // Expert labels (pillar – Experts list)
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
} as const;

const zh: Dict = {
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
  startBuilding: "构建",
  startBuildingMsg:
    "请向我解释 build 功能以及我需要掌握的指令，以便与你高效构建。请展示一个表格。",

  // Actions / footer
  export: "导出",
  levels: "等级",
  levelsComing: "等级即将推出",
  threadExported: "聊天记录已导出。",

  // Status bar
  statusMode: "模式：",
  statusAgent: "代理：",

  // Backward-compat alias
  statusAI: "代理：",

  // Status texts
  "status.modeSet": "模式已设置：{label}。",

  // Experts (used by Saeule.tsx)
  "experts.title": "专家",
  "experts.choose": "选择专家",

  // CTA fallback
  "cta.fallback":
    "一切就绪 — 告诉我你想构建什么（应用、流程、功能…）。",

  // ARIA / A11y
  conversationAria: "聊天记录",
  assistantSays: "助手消息",
  youSaid: "你的消息",
  columnAria: "侧栏 — 控制与选择",
  mobileOverlayLabel: "移动侧栏覆盖层",

  // Expert categories (pillar – Experts tabs)
  "experts.category.life": "生命",
  "experts.category.tech": "技术",
  "experts.category.space": "空间",
  "experts.category.ethics": "伦理",
  "experts.category.universe": "宇宙",

  // Expert labels (pillar – Experts list)
  "experts.biologist": "生物学家",
  "experts.chemist": "化学家",
  "experts.physicist": "物理学家",
  "experts.computer_scientist": "计算机科学家",
  "experts.jurist": "法律专家",
  "experts.architect_civil_engineer": "建筑师 / 土木工程师",
  "experts.landscape_designer": "景观设计师",
  "experts.interior_designer": "室内设计师",
  "experts.electrical_engineer": "电气工程师",
  "experts.mathematician": "数学家",
  "experts.astrologer": "占星师",
  "experts.weather_expert": "气象专家",
  "experts.molecular_scientist": "分子科学家",
} as const;

const ja: Dict = {
  // Input / messaging
  writeMessage: "メッセージを書く…",
  send: "送信",

  // Input helpers
  tools: "ツール",
  newline: "改行",
  comingUpload: "アップロード",
  comingVoice: "ボイス",
  comingFunctions: "オプション",

  // Overlay header / buttons (mobile)
  close: "閉じる",

  // Sidebar / Column
  columnTitle: "コラム",
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
  clearChat: "チャットをクリア",
  startBuilding: "ビルド",
  startBuildingMsg:
    "効率的に一緒にビルドできるよう、build 機能と必要なコマンドを説明してください。表を表示してください。",

  // Actions / footer
  export: "エクスポート",
  levels: "レベル",
  levelsComing: "レベルは近日公開予定",
  threadExported: "チャットがエクスポートされました。",

  // Status bar
  statusMode: "モード：",
  statusAgent: "エージェント：",

  // Backward-compat alias
  statusAI: "エージェント：",

  // Status texts
  "status.modeSet": "モードが設定されました：{label}。",

  // Experts (used by Saeule.tsx)
  "experts.title": "エキスパート",
  "experts.choose": "エキスパートを選択",

  // CTA fallback
  "cta.fallback":
    "準備完了 — 作りたいものを教えてください（アプリ、フロー、機能など）。",

  // ARIA / A11y
  conversationAria: "チャット履歴",
  assistantSays: "アシスタントのメッセージ",
  youSaid: "あなたのメッセージ",
  columnAria: "コラム — コントロール & 選択",
  mobileOverlayLabel: "モバイル・コラム・オーバーレイ",

  // Expert categories (pillar – Experts tabs)
  "experts.category.life": "生命",
  "experts.category.tech": "技術",
  "experts.category.space": "空間",
  "experts.category.ethics": "倫理",
  "experts.category.universe": "宇宙",

  // Expert labels (pillar – Experts list)
  "experts.biologist": "生物学者",
  "experts.chemist": "化学者",
  "experts.physicist": "物理学者",
  "experts.computer_scientist": "コンピューターサイエンティスト",
  "experts.jurist": "法律専門家",
  "experts.architect_civil_engineer": "建築家 / 土木技師",
  "experts.landscape_designer": "ランドスケープデザイナー",
  "experts.interior_designer": "インテリアデザイナー",
  "experts.electrical_engineer": "電気技術者",
  "experts.mathematician": "数学者",
  "experts.astrologer": "占星術師",
  "experts.weather_expert": "気象専門家",
  "experts.molecular_scientist": "分子科学者",
} as const;

const ko: Dict = {
  // Input / messaging
  writeMessage: "메시지를 입력하세요…",
  send: "전송",

  // Input helpers
  tools: "도구",
  newline: "줄 바꿈",
  comingUpload: "업로드",
  comingVoice: "음성",
  comingFunctions: "옵션",

  // Overlay header / buttons (mobile)
  close: "닫기",

  // Sidebar / Column
  columnTitle: "컬럼",
  sectionControl: "컨트롤",
  onboarding: "ONBOARDING",
  mDefault: "M · 기본값",
  selectMode: "모드 선택",
  council13: "COUNCIL13",
  selectAI: "AI 선택",
  modules: "모듈",
  coming: "곧 제공",

  // Sidebar additions (experts & CTA)
  selectExpert: "전문가 선택",
  statusExpert: "전문가:",
  clearChat: "채팅 지우기",
  startBuilding: "빌드",
  startBuildingMsg:
    "효율적으로 함께 빌드할 수 있도록 build 기능과 필요한 명령어를 설명해 주세요. 표로 보여주세요.",

  // Actions / footer
  export: "내보내기",
  levels: "레벨",
  levelsComing: "레벨 준비 중",
  threadExported: "채팅이 내보내졌습니다.",

  // Status bar
  statusMode: "모드:",
  statusAgent: "에이전트:",

  // Backward-compat alias
  statusAI: "에이전트:",

  // Status texts
  "status.modeSet": "모드가 설정되었습니다: {label}.",

  // Experts (used by Saeule.tsx)
  "experts.title": "전문가",
  "experts.choose": "전문가 선택",

  // CTA fallback
  "cta.fallback":
    "준비되었습니다 — 무엇을 만들고 싶은지 알려주세요 (앱, 플로우, 기능 등).",

  // ARIA / A11y
  conversationAria: "채팅 기록",
  assistantSays: "어시스턴트 메시지",
  youSaid: "사용자 메시지",
  columnAria: "컬럼 — 컨트롤 & 선택",
  mobileOverlayLabel: "모바일 컬럼 오버레이",

  // Expert categories (pillar – Experts tabs)
  "experts.category.life": "생명",
  "experts.category.tech": "기술",
  "experts.category.space": "공간",
  "experts.category.ethics": "윤리",
  "experts.category.universe": "우주",

  // Expert labels (pillar – Experts list)
  "experts.biologist": "생물학자",
  "experts.chemist": "화학자",
  "experts.physicist": "물리학자",
  "experts.computer_scientist": "컴퓨터 과학자",
  "experts.jurist": "법률 전문가",
  "experts.architect_civil_engineer": "건축가 / 토목 엔지니어",
  "experts.landscape_designer": "조경 디자이너",
  "experts.interior_designer": "인테리어 디자이너",
  "experts.electrical_engineer": "전기 기술자",
  "experts.mathematician": "수학자",
  "experts.astrologer": "점성술가",
  "experts.weather_expert": "기상 전문가",
  "experts.molecular_scientist": "분자 과학자",
} as const;

const ar: Dict = {
  // Input / messaging
  writeMessage: "اكتب رسالة…",
  send: "إرسال",

  // Input helpers
  tools: "أدوات",
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
  mDefault: "M · افتراضي",
  selectMode: "اختر الوضع",
  council13: "COUNCIL13",
  selectAI: "اختر الذكاء الاصطناعي",
  modules: "الوحدات",
  coming: "قريباً",

  // Sidebar additions (experts & CTA)
  selectExpert: "اختر الخبير",
  statusExpert: "الخبير:",
  clearChat: "مسح المحادثة",
  startBuilding: "إنشاء",
  startBuildingMsg:
    "اشرح لي وظيفة build والأوامر التي يجب أن أعرفها لبناء المشاريع معك بكفاءة. اعرض جدولاً.",

  // Actions / footer
  export: "تصدير",
  levels: "المستويات",
  levelsComing: "المستويات ستتوفر قريباً",
  threadExported: "تم تصدير المحادثة.",

  // Status bar
  statusMode: "الوضع:",
  statusAgent: "الوكيل:",

  // Backward-compat alias
  statusAI: "الوكيل:",

  // Status texts
  "status.modeSet": "تم تعيين الوضع: {label}.",

  // Experts (used by Saeule.tsx)
  "experts.title": "الخبراء",
  "experts.choose": "اختر الخبير",

  // CTA fallback
  "cta.fallback":
    "كل شيء جاهز — أخبرني بما تريد إنشاءه (تطبيق، تدفق، ميزة…).",

  // ARIA / A11y
  conversationAria: "سجل المحادثة",
  assistantSays: "رسالة من المساعد",
  youSaid: "رسالتك",
  columnAria: "العمود — التحكم والاختيار",
  mobileOverlayLabel: "واجهة العمود في الهاتف",

  // Expert categories (pillar – Experts tabs)
  "experts.category.life": "الحياة",
  "experts.category.tech": "التقنية",
  "experts.category.space": "الفضاء",
  "experts.category.ethics": "الأخلاق",
  "experts.category.universe": "الكون",

  // Expert labels (pillar – Experts list)
  "experts.biologist": "عالم أحياء",
  "experts.chemist": "كيميائي",
  "experts.physicist": "فيزيائي",
  "experts.computer_scientist": "عالم حاسوب",
  "experts.jurist": "قانوني",
  "experts.architect_civil_engineer": "مهندس معماري / مهندس مدني",
  "experts.landscape_designer": "مصمم مناظر طبيعية",
  "experts.interior_designer": "مصمم داخلي",
  "experts.electrical_engineer": "مهندس كهرباء",
  "experts.mathematician": "رياضياتي",
  "experts.astrologer": "منجم",
  "experts.weather_expert": "خبير طقس",
  "experts.molecular_scientist": "عالم جزيئات",
} as const;

const hi: Dict = {
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
  columnTitle: "स्तंभ",
  sectionControl: "नियंत्रण",
  onboarding: "ONBOARDING",
  mDefault: "M · डिफ़ॉल्ट",
  selectMode: "मोड चुनें",
  council13: "COUNCIL13",
  selectAI: "AI चुनें",
  modules: "मॉड्यूल",
  coming: "जल्द ही",

  // Sidebar additions (experts & CTA)
  selectExpert: "विशेषज्ञ चुनें",
  statusExpert: "विशेषज्ञ:",
  clearChat: "चैट साफ़ करें",
  startBuilding: "बिल्ड",
  startBuildingMsg:
    "मुझे build फ़ंक्शन और वे कमांड समझाएँ जो आपके साथ प्रभावी ढंग से बिल्ड करने के लिए ज़रूरी हैं। कृपया एक तालिका दिखाएँ।",

  // Actions / footer
  export: "एक्सपोर्ट",
  levels: "स्तर",
  levelsComing: "स्तर जल्द ही उपलब्ध होंगे",
  threadExported: "चैट एक्सपोर्ट किया गया।",

  // Status bar
  statusMode: "मोड:",
  statusAgent: "एजेंट:",

  // Backward-compat alias
  statusAI: "एजेंट:",

  // Status texts
  "status.modeSet": "मोड सेट किया गया: {label}.",

  // Experts (used by Saeule.tsx)
  "experts.title": "विशेषज्ञ",
  "experts.choose": "विशेषज्ञ चुनें",

  // CTA fallback
  "cta.fallback":
    "सब तैयार है — बताइए, आप क्या बनाना चाहते हैं (ऐप, फ्लो, फीचर …)।",

  // ARIA / A11y
  conversationAria: "चैट इतिहास",
  assistantSays: "सहायक का संदेश",
  youSaid: "आपका संदेश",
  columnAria: "स्तंभ — नियंत्रण और चयन",
  mobileOverlayLabel: "मोबाइल स्तंभ ओवरले",

  // Expert categories (pillar – Experts tabs)
  "experts.category.life": "जीवन",
  "experts.category.tech": "तकनीक",
  "experts.category.space": "अंतरिक्ष",
  "experts.category.ethics": "नैतिकता",
  "experts.category.universe": "ब्रह्मांड",

  // Expert labels (pillar – Experts list)
  "experts.biologist": "जीवविज्ञानी",
  "experts.chemist": "रसायनशास्त्री",
  "experts.physicist": "भौतिक विज्ञानी",
  "experts.computer_scientist": "कंप्यूटर वैज्ञानिक",
  "experts.jurist": "क़ानूनी विशेषज्ञ",
  "experts.architect_civil_engineer": "वास्तुकार / सिविल इंजीनियर",
  "experts.landscape_designer": "लैंडस्केप डिज़ाइनर",
  "experts.interior_designer": "इंटीरियर डिज़ाइनर",
  "experts.electrical_engineer": "इलेक्ट्रिकल इंजीनियर",
  "experts.mathematician": "गणितज्ञ",
  "experts.astrologer": "ज्योतिषी",
  "experts.weather_expert": "मौसम विशेषज्ञ",
  "experts.molecular_scientist": "आणविक वैज्ञानिक",
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

// ⚠️ WICHTIG: Für die neue UI akzeptieren wir ALLE Locales, die im `dict` definiert sind.
export type Locale = string;

const STORAGE_KEY = "mpathy:locale";

// Mappt "de-AT" → "de"
function toBase(tag: string): string {
  return String(tag || "").toLowerCase().split("-")[0];
}

// Locale-Cache (wird nach dict-Init befüllt; vermeidet TDZ)
let UX_LOCALES: string[] = ["en"];

// Neu: helper – ist diese Sprache irgendwo unterstützt (dict ODER legacy)?
function isSupported(tag: string): boolean {
  const base = toBase(tag);
  return (base in DICTS) || UX_LOCALES.includes(base);
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
  if (!isSupported(locale)) return;
  currentLocale = toBase(locale);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, currentLocale);
    window.dispatchEvent(new CustomEvent("mpathy:i18n:change", { detail: { locale: currentLocale } }));
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
