// lib/i18n.maios.ts

export const dict = {
en: {
  hero: {
    title: "MAIOS",
    subtitle: "Modular Artificial Intelligence Operating System",
    intro: "Inner infrastructure for governed AI systems"
  },

  clarification: {
    title: "Important clarification",
    body: [
      "m-pathy is not MAIOS.",
      "m-pathy is a professional AI workspace.",
      "MAIOS is the inner operating system that governs how AI is allowed to reason.",
      "What you see on m-pathy.ai is a client implementation.",
      "What you read on this page is the system behind it.",
      "m-pathy uses MAIOS.",
      "MAIOS exists independently of m-pathy.",
      "This page is about MAIOS."
    ]
  },

  problem_statement: {
    title: "Your AI already makes decisions",
    subtitle: "You just cannot defend how they were made.",
    body: [
      "AI outputs influence hiring, legal judgment, strategy, and risk every day.",
      "Most organizations cannot explain under which system conditions these outputs were produced, which rules applied, or who was responsible.",
      "This is not a model problem.",
      "This is not a tooling problem.",
      "This is an inner infrastructure problem."
    ]
  },

  problems: {
    title: "The problems MAIOS solves",
    items: [
      { title: "We cannot explain our AI outputs when it matters", accordion: "explanation" },
      { title: "Governance exists on paper, not in execution", accordion: "explanation" },
      { title: "Responsibility inside AI systems is structurally unclear", accordion: "explanation" },
      { title: "AI behavior drifts without visibility", accordion: "explanation" },
      { title: "Expert reasoning and system behavior are mixed", accordion: "explanation" },
      { title: "Telemetry is treated as logging, not as control", accordion: "explanation" }
    ]
  },

  what_it_is: {
    title: "What MAIOS is",
    body: [
      "MAIOS is an inner operating system that enforces how AI is allowed to reason before any output exists.",
      "MAIOS governs how reasoning may start, under which modes behavior is framed, which experts may analyze, when governance is invoked, and whether an output is allowed to exist.",
      "MAIOS does not replace your AI.",
      "MAIOS governs your AI."
    ],
    accordion: "how MAIOS works internally"
  },

  what_it_is_not: {
    title: "What MAIOS is not",
    body: [
      "MAIOS does not store data.",
      "MAIOS does not persist telemetry.",
      "MAIOS does not manage infrastructure.",
      "MAIOS does not certify compliance.",
      "MAIOS enforces admissible outputs.",
      "Compliance happens in your system."
    ]
  },

  audience: {
    title: "Who MAIOS is designed for",
    body: [
      "MAIOS is designed for organizations operating in high risk and regulated AI environments.",
      "This includes environments where AI outputs influence people’s rights, safety, access, or legal standing."
    ],
    sectors: [
      "Medical and healthcare systems",
      "Government and public sector institutions",
      "Legal and judicial environments",
      "Financial services and insurance",
      "Critical infrastructure and security domains",
      "Enterprise organizations at scale"
    ],
    footer: [
      "MAIOS does not certify compliance.",
      "MAIOS enables systems to operate in compliance."
    ],
    accordion: "sector specific depth"
  },

  offering: {
    title: "The MAIOS offering",
    core: {
      title: "MAIOS Core",
      body: [
        "MAIOS Core is the universal inner layer.",
        "It provides deterministic system space, mandatory telemetry contract, output blocking execution rule, explicit start and completion logic, drift exposure, and responsibility separation.",
        "MAIOS Core has no predefined agents.",
        "MAIOS Core has no predefined experts.",
        "MAIOS Core has no predefined governance models.",
        "MAIOS Core is sufficient for small and mid sized organizations."
      ]
    },
    inventory: {
      title: "MAIOS Inventory Mapping",
      body: [
        "MAIOS Inventory Mapping adapts MAIOS to existing systems.",
        "It declares existing agents, experts, and systems, binds them to MAIOS telemetry, and maps governance and responsibility structures.",
        "MAIOS Inventory Mapping requires MAIOS Core.",
        "MAIOS does not impose an inventory.",
        "MAIOS references what already exists."
      ]
    },
    accordion: "implementation details"
  },

  proof: {
    title: "m-pathy as proof",
    body: [
      "m-pathy is a governed AI workspace built on MAIOS.",
      "It demonstrates that governed AI infrastructure can be built, operated, and verified in production.",
      "MAIOS works without m-pathy."
    ],
    accordion: "archive, truth hash, sealing, chaining"
  },

  consulting: {
    title: "Implementation and governance consulting",
    body: [
      "For organizations operating at scale or under regulation.",
      "We support integration, inventory mapping, audit design, cryptographic sealing strategies, governance design, and preparation for audits and regulators.",
      "This is not onboarding.",
      "This is inner infrastructure work."
    ],
    accordion: "consulting scope"
  },

  contact: {
    title: "Send us a message",
    eyebrow: "Controlled system entry",

    body: [
      "Start a focused conversation about your system."
    ],

    toggle: {
      open: "Open message form",
      close: "Close message form"
    },

    fields: [
      "Message type",
      "Message",
      "Email address",
      "Company (optional)",
      "Role (optional)"
    ],

    messageTypes: {
      consulting_inquiry: "Consulting inquiry",
      governance_assessment: "Governance assessment",
      system_integration: "System integration",
      audit_preparation: "Audit preparation",
      technical_question: "Technical question",
      support_or_other: "Support or other"
    },

    actions: {
      submit: "Send message"
    },

    feedback: {
      success: "Message sent successfully.",
      error: "Sending failed. Please try again.",
      captcha_missing: "Captcha configuration missing."
    },

    placeholders: {
      message: "Describe your request",
      email: "you@example.com",
      company: "Company name",
      role: "Your role"
    },

    validation: {
      required: "This field is required.",
      email_invalid: "Please enter a valid email address."
    },

    footer: [
      "Messages are sent by email and stored in our system.",
      "No automated responses.",
      "No marketing follow ups."
    ]
  },

  closing: {
    body: [
      "m-pathy shows what is possible.",
      "MAIOS makes it possible everywhere."
    ]
  }
},
de: {
  hero: {
    title: "MAIOS",
    subtitle: "Modulares Betriebssystem für Künstliche Intelligenz",
    intro: "Innere Infrastruktur für gesteuerte KI-Systeme"
  },

  clarification: {
    title: "Wichtige Klarstellung",
    body: [
      "m-pathy ist nicht MAIOS.",
      "m-pathy ist ein professioneller KI-Arbeitsraum.",
      "MAIOS ist das innere Betriebssystem, das festlegt, wie KI denken darf.",
      "Was du auf m-pathy.ai siehst, ist eine Client-Implementierung.",
      "Was du hier liest, ist das zugrunde liegende System.",
      "m-pathy nutzt MAIOS.",
      "MAIOS existiert unabhängig von m-pathy.",
      "Diese Seite beschreibt MAIOS."
    ]
  },

  problem_statement: {
    title: "Deine KI trifft bereits Entscheidungen",
    subtitle: "Du kannst sie nur nicht begründen.",
    body: [
      "KI-Ausgaben beeinflussen täglich Einstellung, Recht, Strategie und Risiko.",
      "Die meisten Organisationen können nicht erklären, unter welchen Systembedingungen diese Ergebnisse entstanden sind, welche Regeln galten oder wer verantwortlich war.",
      "Das ist kein Modellproblem.",
      "Das ist kein Toolproblem.",
      "Das ist ein Infrastrukturproblem."
    ]
  },

  problems: {
    title: "Welche Probleme MAIOS löst",
    items: [
      { title: "KI-Ergebnisse sind nicht erklärbar, wenn es zählt", accordion: "Erklärung" },
      { title: "Governance existiert auf Papier, nicht im Betrieb", accordion: "Erklärung" },
      { title: "Verantwortung in KI-Systemen ist unklar", accordion: "Erklärung" },
      { title: "KI-Verhalten driftet ohne Sichtbarkeit", accordion: "Erklärung" },
      { title: "Expertenlogik und Systemverhalten sind vermischt", accordion: "Erklärung" },
      { title: "Telemetry wird als Logging gesehen, nicht als Kontrolle", accordion: "Erklärung" }
    ]
  },

  what_it_is: {
    title: "Was MAIOS ist",
    body: [
      "MAIOS ist ein inneres Betriebssystem, das festlegt, wie KI denken darf, bevor ein Ergebnis entsteht.",
      "MAIOS steuert Startbedingungen, Modi, beteiligte Experten, Governance-Zeitpunkte und ob ein Ergebnis überhaupt existieren darf.",
      "MAIOS ersetzt keine KI.",
      "MAIOS steuert KI."
    ],
    accordion: "interne Funktionsweise"
  },

  what_it_is_not: {
    title: "Was MAIOS nicht ist",
    body: [
      "MAIOS speichert keine Daten.",
      "MAIOS speichert keine Telemetrie.",
      "MAIOS betreibt keine Infrastruktur.",
      "MAIOS zertifiziert keine Compliance.",
      "MAIOS erzwingt zulässige Ausgaben.",
      "Compliance entsteht im Zielsystem."
    ]
  },

  audience: {
    title: "Für wen MAIOS entwickelt wurde",
    body: [
      "MAIOS ist für Organisationen in risikoreichen und regulierten KI-Umfeldern konzipiert.",
      "Dazu zählen Systeme, deren KI-Ergebnisse Rechte, Sicherheit, Zugang oder Rechtsstatus beeinflussen."
    ],
    sectors: [
      "Medizin und Gesundheitswesen",
      "Behörden und öffentlicher Sektor",
      "Recht und Justiz",
      "Finanzen und Versicherungen",
      "Kritische Infrastruktur und Sicherheit",
      "Große Unternehmen"
    ],
    footer: [
      "MAIOS zertifiziert keine Compliance.",
      "MAIOS ermöglicht regelkonformen Betrieb."
    ],
    accordion: "branchenspezifische Tiefe"
  },

  offering: {
    title: "Das MAIOS-Angebot",
    core: {
      title: "MAIOS Core",
      body: [
        "MAIOS Core ist die universelle Basisschicht.",
        "Sie bietet deterministischen Systemraum, verpflichtende Telemetrie, Ausgabesperren, klare Start- und Endlogik, Drift-Sichtbarkeit und Rollentrennung.",
        "MAIOS Core enthält keine Agenten.",
        "MAIOS Core enthält keine Experten.",
        "MAIOS Core enthält keine Governance-Modelle.",
        "MAIOS Core reicht für kleine und mittlere Organisationen."
      ]
    },
    inventory: {
      title: "MAIOS Inventory Mapping",
      body: [
        "Inventory Mapping passt MAIOS an bestehende Systeme an.",
        "Es erfasst Agenten, Experten und Systeme, bindet sie an MAIOS-Telemetrie und ordnet Governance und Verantwortung zu.",
        "Inventory Mapping benötigt MAIOS Core.",
        "MAIOS erzwingt kein Inventar.",
        "MAIOS referenziert Bestehendes."
      ]
    },
    accordion: "Implementierungsdetails"
  },

  proof: {
    title: "m-pathy als Beweis",
    body: [
      "m-pathy ist ein gesteuerter KI-Arbeitsraum auf Basis von MAIOS.",
      "Er zeigt, dass gesteuerte KI-Infrastruktur produktiv betrieben und überprüft werden kann.",
      "MAIOS funktioniert auch ohne m-pathy."
    ],
    accordion: "Archiv, Truth Hash, Versiegelung, Verkettung"
  },

  consulting: {
    title: "Implementierungs- und Governance-Beratung",
    body: [
      "Für Organisationen im regulierten oder skalierenden Betrieb.",
      "Wir unterstützen Integration, Inventory Mapping, Audit-Design, kryptografische Versiegelung, Governance-Struktur und Vorbereitung auf Prüfungen.",
      "Das ist kein Onboarding.",
      "Das ist Infrastrukturarbeit."
    ],
    accordion: "Beratungsumfang"
  },

  contact: {
    title: "Nachricht senden",
    eyebrow: "Gesteuerter Systemzugang",

    body: [
      "Starte eine fokussierte Anfrage zu deinem System."
    ],

    toggle: {
      open: "Formular öffnen",
      close: "Formular schließen"
    },

    fields: [
      "Nachrichtentyp",
      "Nachricht",
      "E-Mail-Adresse",
      "Unternehmen (optional)",
      "Rolle (optional)"
    ],

    messageTypes: {
      consulting_inquiry: "Beratungsanfrage",
      governance_assessment: "Governance-Prüfung",
      system_integration: "Systemintegration",
      audit_preparation: "Auditvorbereitung",
      technical_question: "Technische Frage",
      support_or_other: "Support oder Sonstiges"
    },

    actions: {
      submit: "Nachricht senden"
    },

    feedback: {
      success: "Nachricht gesendet.",
      error: "Senden fehlgeschlagen.",
      captcha_missing: "Captcha-Konfiguration fehlt."
    },

    placeholders: {
      message: "Anliegen beschreiben",
      email: "du@beispiel.de",
      company: "Unternehmen",
      role: "Deine Rolle"
    },

    validation: {
      required: "Pflichtfeld.",
      email_invalid: "Ungültige E-Mail-Adresse."
    },

    footer: [
      "Nachrichten werden per E-Mail gesendet und gespeichert.",
      "Keine automatischen Antworten.",
      "Kein Marketing."
    ]
  },

  closing: {
    body: [
      "m-pathy zeigt, was möglich ist.",
      "MAIOS macht es überall möglich."
    ]
  }
},

fr: {
  hero: {
    title: "MAIOS",
    subtitle: "Système d’exploitation modulaire pour l’intelligence artificielle",
    intro: "Infrastructure interne pour des systèmes d’IA gouvernés"
  },

  clarification: {
    title: "Clarification importante",
    body: [
      "m-pathy n’est pas MAIOS.",
      "m-pathy est un espace de travail IA professionnel.",
      "MAIOS est le système interne qui définit comment l’IA peut raisonner.",
      "Ce que vous voyez sur m-pathy.ai est une implémentation client.",
      "Ce que vous lisez ici est le système sous-jacent.",
      "m-pathy utilise MAIOS.",
      "MAIOS existe indépendamment de m-pathy.",
      "Cette page concerne MAIOS."
    ]
  },

  problem_statement: {
    title: "Votre IA prend déjà des décisions",
    subtitle: "Vous ne pouvez simplement pas les défendre.",
    body: [
      "Les sorties d’IA influencent chaque jour le recrutement, le droit, la stratégie et le risque.",
      "La plupart des organisations ne peuvent pas expliquer dans quelles conditions système ces résultats ont été produits, quelles règles s’appliquaient ou qui en était responsable.",
      "Ce n’est pas un problème de modèle.",
      "Ce n’est pas un problème d’outil.",
      "C’est un problème d’infrastructure."
    ]
  },

  problems: {
    title: "Les problèmes que MAIOS résout",
    items: [
      { title: "Les résultats d’IA ne sont pas explicables quand cela compte", accordion: "explication" },
      { title: "La gouvernance existe sur le papier, pas en pratique", accordion: "explication" },
      { title: "La responsabilité dans les systèmes IA est floue", accordion: "explication" },
      { title: "Le comportement de l’IA dérive sans visibilité", accordion: "explication" },
      { title: "Le raisonnement expert et le comportement système sont mêlés", accordion: "explication" },
      { title: "La télémétrie est traitée comme du logging, pas comme du contrôle", accordion: "explication" }
    ]
  },

  what_it_is: {
    title: "Ce qu’est MAIOS",
    body: [
      "MAIOS est un système interne qui définit comment l’IA peut raisonner avant qu’un résultat n’existe.",
      "MAIOS gouverne les conditions de départ, les modes, les experts impliqués, les points de gouvernance et l’autorisation même d’un résultat.",
      "MAIOS ne remplace pas votre IA.",
      "MAIOS gouverne votre IA."
    ],
    accordion: "fonctionnement interne"
  },

  what_it_is_not: {
    title: "Ce que MAIOS n’est pas",
    body: [
      "MAIOS ne stocke pas de données.",
      "MAIOS ne persiste pas la télémétrie.",
      "MAIOS ne gère pas l’infrastructure.",
      "MAIOS ne certifie pas la conformité.",
      "MAIOS impose des sorties admissibles.",
      "La conformité se fait dans votre système."
    ]
  },

  audience: {
    title: "À qui MAIOS est destiné",
    body: [
      "MAIOS est conçu pour des organisations opérant dans des environnements IA à haut risque et réglementés.",
      "Cela inclut les contextes où les sorties d’IA influencent les droits, la sécurité, l’accès ou le statut légal."
    ],
    sectors: [
      "Médecine et santé",
      "Gouvernements et secteur public",
      "Droit et justice",
      "Services financiers et assurance",
      "Infrastructures critiques et sécurité",
      "Grandes entreprises"
    ],
    footer: [
      "MAIOS ne certifie pas la conformité.",
      "MAIOS permet un fonctionnement conforme."
    ],
    accordion: "détails sectoriels"
  },

  offering: {
    title: "L’offre MAIOS",
    core: {
      title: "MAIOS Core",
      body: [
        "MAIOS Core est la couche interne universelle.",
        "Elle fournit un espace système déterministe, une télémétrie obligatoire, un blocage des sorties, une logique claire de début et de fin, une visibilité du drift et une séparation des responsabilités.",
        "MAIOS Core n’inclut pas d’agents.",
        "MAIOS Core n’inclut pas d’experts.",
        "MAIOS Core n’inclut pas de modèles de gouvernance.",
        "MAIOS Core suffit aux petites et moyennes organisations."
      ]
    },
    inventory: {
      title: "MAIOS Inventory Mapping",
      body: [
        "Inventory Mapping adapte MAIOS aux systèmes existants.",
        "Il déclare agents, experts et systèmes, les lie à la télémétrie MAIOS et mappe gouvernance et responsabilités.",
        "Inventory Mapping requiert MAIOS Core.",
        "MAIOS n’impose aucun inventaire.",
        "MAIOS référence l’existant."
      ]
    },
    accordion: "détails d’implémentation"
  },

  proof: {
    title: "m-pathy comme preuve",
    body: [
      "m-pathy est un espace de travail IA gouverné, construit sur MAIOS.",
      "Il démontre qu’une infrastructure IA gouvernée peut être construite, exploitée et vérifiée en production.",
      "MAIOS fonctionne sans m-pathy."
    ],
    accordion: "archive, truth hash, scellement, chaînage"
  },

  consulting: {
    title: "Conseil en implémentation et gouvernance",
    body: [
      "Pour les organisations en environnement réglementé ou à grande échelle.",
      "Nous accompagnons l’intégration, l’inventory mapping, la conception d’audits, le scellement cryptographique, la gouvernance et la préparation aux contrôles.",
      "Ce n’est pas de l’onboarding.",
      "C’est du travail d’infrastructure."
    ],
    accordion: "périmètre du conseil"
  },

  contact: {
    title: "Envoyer un message",
    eyebrow: "Accès système gouverné",

    body: [
      "Démarrez un échange ciblé sur votre système."
    ],

    toggle: {
      open: "Ouvrir le formulaire",
      close: "Fermer le formulaire"
    },

    fields: [
      "Type de message",
      "Message",
      "Adresse e-mail",
      "Entreprise (optionnel)",
      "Rôle (optionnel)"
    ],

    messageTypes: {
      consulting_inquiry: "Demande de conseil",
      governance_assessment: "Évaluation de gouvernance",
      system_integration: "Intégration système",
      audit_preparation: "Préparation d’audit",
      technical_question: "Question technique",
      support_or_other: "Support ou autre"
    },

    actions: {
      submit: "Envoyer le message"
    },

    feedback: {
      success: "Message envoyé.",
      error: "Échec de l’envoi.",
      captcha_missing: "Configuration captcha manquante."
    },

    placeholders: {
      message: "Décrivez votre demande",
      email: "vous@exemple.fr",
      company: "Entreprise",
      role: "Votre rôle"
    },

    validation: {
      required: "Champ requis.",
      email_invalid: "Adresse e-mail invalide."
    },

    footer: [
      "Les messages sont envoyés par e-mail et stockés.",
      "Aucune réponse automatique.",
      "Aucun marketing."
    ]
  },

  closing: {
    body: [
      "m-pathy montre ce qui est possible.",
      "MAIOS le rend possible partout."
    ]
  }
},

es: {
  hero: {
    title: "MAIOS",
    subtitle: "Sistema operativo modular para inteligencia artificial",
    intro: "Infraestructura interna para sistemas de IA gobernados"
  },

  clarification: {
    title: "Aclaración importante",
    body: [
      "m-pathy no es MAIOS.",
      "m-pathy es un espacio de trabajo profesional de IA.",
      "MAIOS es el sistema interno que define cómo puede razonar la IA.",
      "Lo que ves en m-pathy.ai es una implementación cliente.",
      "Lo que lees aquí es el sistema subyacente.",
      "m-pathy usa MAIOS.",
      "MAIOS existe de forma independiente de m-pathy.",
      "Esta página trata sobre MAIOS."
    ]
  },

  problem_statement: {
    title: "Tu IA ya toma decisiones",
    subtitle: "Simplemente no puedes defender cómo se hicieron.",
    body: [
      "Las salidas de IA influyen a diario en contratación, derecho, estrategia y riesgo.",
      "La mayoría de las organizaciones no pueden explicar en qué condiciones del sistema se produjeron, qué reglas aplicaron o quién fue responsable.",
      "No es un problema de modelo.",
      "No es un problema de herramientas.",
      "Es un problema de infraestructura."
    ]
  },

  problems: {
    title: "Los problemas que MAIOS resuelve",
    items: [
      { title: "Los resultados de IA no son explicables cuando importa", accordion: "explicación" },
      { title: "La gobernanza existe en papel, no en la ejecución", accordion: "explicación" },
      { title: "La responsabilidad en sistemas de IA es poco clara", accordion: "explicación" },
      { title: "El comportamiento de la IA deriva sin visibilidad", accordion: "explicación" },
      { title: "El razonamiento experto y el comportamiento del sistema se mezclan", accordion: "explicación" },
      { title: "La telemetría se trata como registro, no como control", accordion: "explicación" }
    ]
  },

  what_it_is: {
    title: "Qué es MAIOS",
    body: [
      "MAIOS es un sistema interno que define cómo puede razonar la IA antes de que exista un resultado.",
      "MAIOS gobierna condiciones de inicio, modos, expertos implicados, puntos de gobernanza y si un resultado puede existir.",
      "MAIOS no reemplaza tu IA.",
      "MAIOS gobierna tu IA."
    ],
    accordion: "funcionamiento interno"
  },

  what_it_is_not: {
    title: "Qué no es MAIOS",
    body: [
      "MAIOS no almacena datos.",
      "MAIOS no persiste telemetría.",
      "MAIOS no gestiona infraestructura.",
      "MAIOS no certifica cumplimiento.",
      "MAIOS impone salidas admisibles.",
      "El cumplimiento ocurre en tu sistema."
    ]
  },

  audience: {
    title: "Para quién está diseñado MAIOS",
    body: [
      "MAIOS está diseñado para organizaciones en entornos de IA de alto riesgo y regulados.",
      "Incluye contextos donde las salidas de IA influyen en derechos, seguridad, acceso o estatus legal."
    ],
    sectors: [
      "Medicina y salud",
      "Gobierno y sector público",
      "Derecho y justicia",
      "Servicios financieros y seguros",
      "Infraestructura crítica y seguridad",
      "Grandes empresas"
    ],
    footer: [
      "MAIOS no certifica el cumplimiento.",
      "MAIOS permite operar conforme."
    ],
    accordion: "detalle por sector"
  },

  offering: {
    title: "La oferta MAIOS",
    core: {
      title: "MAIOS Core",
      body: [
        "MAIOS Core es la capa interna universal.",
        "Proporciona espacio de sistema determinista, telemetría obligatoria, bloqueo de salidas, lógica clara de inicio y fin, visibilidad del drift y separación de responsabilidades.",
        "MAIOS Core no incluye agentes.",
        "MAIOS Core no incluye expertos.",
        "MAIOS Core no incluye modelos de gobernanza.",
        "MAIOS Core es suficiente para organizaciones pequeñas y medianas."
      ]
    },
    inventory: {
      title: "MAIOS Inventory Mapping",
      body: [
        "Inventory Mapping adapta MAIOS a sistemas existentes.",
        "Declara agentes, expertos y sistemas, los vincula a la telemetría MAIOS y mapea gobernanza y responsabilidades.",
        "Inventory Mapping requiere MAIOS Core.",
        "MAIOS no impone inventarios.",
        "MAIOS referencia lo existente."
      ]
    },
    accordion: "detalles de implementación"
  },

  proof: {
    title: "m-pathy como prueba",
    body: [
      "m-pathy es un espacio de trabajo de IA gobernado, construido sobre MAIOS.",
      "Demuestra que una infraestructura de IA gobernada puede construirse, operarse y verificarse en producción.",
      "MAIOS funciona sin m-pathy."
    ],
    accordion: "archivo, truth hash, sellado, encadenado"
  },

  consulting: {
    title: "Consultoría de implementación y gobernanza",
    body: [
      "Para organizaciones reguladas o a escala.",
      "Apoyamos integración, inventory mapping, diseño de auditorías, sellado criptográfico, gobernanza y preparación para revisiones.",
      "No es onboarding.",
      "Es trabajo de infraestructura."
    ],
    accordion: "alcance de la consultoría"
  },

  contact: {
    title: "Enviar un mensaje",
    eyebrow: "Acceso al sistema gobernado",

    body: [
      "Inicia una conversación enfocada sobre tu sistema."
    ],

    toggle: {
      open: "Abrir formulario",
      close: "Cerrar formulario"
    },

    fields: [
      "Tipo de mensaje",
      "Mensaje",
      "Dirección de correo",
      "Empresa (opcional)",
      "Rol (opcional)"
    ],

    messageTypes: {
      consulting_inquiry: "Consulta",
      governance_assessment: "Evaluación de gobernanza",
      system_integration: "Integración del sistema",
      audit_preparation: "Preparación de auditoría",
      technical_question: "Pregunta técnica",
      support_or_other: "Soporte u otro"
    },

    actions: {
      submit: "Enviar mensaje"
    },

    feedback: {
      success: "Mensaje enviado.",
      error: "Error al enviar.",
      captcha_missing: "Falta la configuración de captcha."
    },

    placeholders: {
      message: "Describe tu solicitud",
      email: "tu@ejemplo.es",
      company: "Empresa",
      role: "Tu rol"
    },

    validation: {
      required: "Campo obligatorio.",
      email_invalid: "Correo no válido."
    },

    footer: [
      "Los mensajes se envían por correo y se almacenan.",
      "Sin respuestas automáticas.",
      "Sin marketing."
    ]
  },

  closing: {
    body: [
      "m-pathy muestra lo posible.",
      "MAIOS lo hace posible en todas partes."
    ]
  }
},
it: {
  hero: {
    title: "MAIOS",
    subtitle: "Sistema operativo modulare per l’intelligenza artificiale",
    intro: "Infrastruttura interna per sistemi di IA governati"
  },

  clarification: {
    title: "Chiarimento importante",
    body: [
      "m-pathy non è MAIOS.",
      "m-pathy è uno spazio di lavoro IA professionale.",
      "MAIOS è il sistema interno che definisce come l’IA può ragionare.",
      "Ciò che vedi su m-pathy.ai è un’implementazione client.",
      "Ciò che leggi qui è il sistema sottostante.",
      "m-pathy usa MAIOS.",
      "MAIOS esiste indipendentemente da m-pathy.",
      "Questa pagina riguarda MAIOS."
    ]
  },

  problem_statement: {
    title: "La tua IA prende già decisioni",
    subtitle: "Non puoi difendere come sono state prese.",
    body: [
      "Le uscite IA influenzano ogni giorno assunzioni, diritto, strategia e rischio.",
      "La maggior parte delle organizzazioni non sa spiegare in quali condizioni di sistema sono nate, quali regole si applicavano o chi fosse responsabile.",
      "Non è un problema di modello.",
      "Non è un problema di strumenti.",
      "È un problema di infrastruttura."
    ]
  },

  problems: {
    title: "I problemi che MAIOS risolve",
    items: [
      { title: "I risultati IA non sono spiegabili quando conta", accordion: "spiegazione" },
      { title: "La governance esiste sulla carta, non nell’esecuzione", accordion: "spiegazione" },
      { title: "La responsabilità nei sistemi IA è poco chiara", accordion: "spiegazione" },
      { title: "Il comportamento dell’IA deriva senza visibilità", accordion: "spiegazione" },
      { title: "Ragionamento degli esperti e comportamento di sistema sono mescolati", accordion: "spiegazione" },
      { title: "La telemetria è trattata come log, non come controllo", accordion: "spiegazione" }
    ]
  },

  what_it_is: {
    title: "Cos’è MAIOS",
    body: [
      "MAIOS è un sistema interno che definisce come l’IA può ragionare prima che esista un risultato.",
      "MAIOS governa condizioni iniziali, modalità, esperti coinvolti, punti di governance e se un risultato può esistere.",
      "MAIOS non sostituisce la tua IA.",
      "MAIOS governa la tua IA."
    ],
    accordion: "funzionamento interno"
  },

  what_it_is_not: {
    title: "Cosa MAIOS non è",
    body: [
      "MAIOS non archivia dati.",
      "MAIOS non persiste la telemetria.",
      "MAIOS non gestisce l’infrastruttura.",
      "MAIOS non certifica la conformità.",
      "MAIOS impone solo uscite ammissibili.",
      "La conformità avviene nel tuo sistema."
    ]
  },

  audience: {
    title: "Per chi è progettato MAIOS",
    body: [
      "MAIOS è progettato per organizzazioni in ambienti IA ad alto rischio e regolati.",
      "Include contesti in cui le uscite IA influenzano diritti, sicurezza, accesso o status legale."
    ],
    sectors: [
      "Medicina e sanità",
      "Governo e settore pubblico",
      "Diritto e giustizia",
      "Servizi finanziari e assicurazioni",
      "Infrastrutture critiche e sicurezza",
      "Grandi aziende"
    ],
    footer: [
      "MAIOS non certifica la conformità.",
      "MAIOS consente operatività conforme."
    ],
    accordion: "dettaglio per settore"
  },

  offering: {
    title: "L’offerta MAIOS",
    core: {
      title: "MAIOS Core",
      body: [
        "MAIOS Core è il livello interno universale.",
        "Fornisce spazio di sistema deterministico, telemetria obbligatoria, blocco delle uscite, logica chiara di inizio e fine, visibilità del drift e separazione delle responsabilità.",
        "MAIOS Core non include agenti.",
        "MAIOS Core non include esperti.",
        "MAIOS Core non include modelli di governance.",
        "MAIOS Core è sufficiente per organizzazioni piccole e medie."
      ]
    },
    inventory: {
      title: "MAIOS Inventory Mapping",
      body: [
        "Inventory Mapping adatta MAIOS ai sistemi esistenti.",
        "Dichiara agenti, esperti e sistemi, li collega alla telemetria MAIOS e mappa governance e responsabilità.",
        "Inventory Mapping richiede MAIOS Core.",
        "MAIOS non impone inventari.",
        "MAIOS fa riferimento all’esistente."
      ]
    },
    accordion: "dettagli di implementazione"
  },

  proof: {
    title: "m-pathy come prova",
    body: [
      "m-pathy è uno spazio di lavoro IA governato, basato su MAIOS.",
      "Dimostra che un’infrastruttura IA governata può essere costruita, gestita e verificata in produzione.",
      "MAIOS funziona senza m-pathy."
    ],
    accordion: "archivio, truth hash, sigillatura, concatenazione"
  },

  consulting: {
    title: "Consulenza di implementazione e governance",
    body: [
      "Per organizzazioni regolamentate o su larga scala.",
      "Supportiamo integrazione, inventory mapping, progettazione audit, sigillatura crittografica, governance e preparazione alle verifiche.",
      "Non è onboarding.",
      "È lavoro di infrastruttura."
    ],
    accordion: "ambito della consulenza"
  },

  contact: {
    title: "Invia un messaggio",
    eyebrow: "Accesso al sistema governato",

    body: [
      "Avvia una richiesta mirata sul tuo sistema."
    ],

    toggle: {
      open: "Apri modulo",
      close: "Chiudi modulo"
    },

    fields: [
      "Tipo di messaggio",
      "Messaggio",
      "Indirizzo email",
      "Azienda (opzionale)",
      "Ruolo (opzionale)"
    ],

    messageTypes: {
      consulting_inquiry: "Richiesta di consulenza",
      governance_assessment: "Valutazione di governance",
      system_integration: "Integrazione di sistema",
      audit_preparation: "Preparazione audit",
      technical_question: "Domanda tecnica",
      support_or_other: "Supporto o altro"
    },

    actions: {
      submit: "Invia messaggio"
    },

    feedback: {
      success: "Messaggio inviato.",
      error: "Invio non riuscito.",
      captcha_missing: "Configurazione captcha mancante."
    },

    placeholders: {
      message: "Descrivi la richiesta",
      email: "tu@esempio.it",
      company: "Azienda",
      role: "Il tuo ruolo"
    },

    validation: {
      required: "Campo obbligatorio.",
      email_invalid: "Email non valida."
    },

    footer: [
      "I messaggi vengono inviati via email e archiviati.",
      "Nessuna risposta automatica.",
      "Nessun marketing."
    ]
  },

  closing: {
    body: [
      "m-pathy mostra cosa è possibile.",
      "MAIOS lo rende possibile ovunque."
    ]
  }
},

pt: {
  hero: {
    title: "MAIOS",
    subtitle: "Sistema operacional modular para inteligência artificial",
    intro: "Infraestrutura interna para sistemas de IA governados"
  },

  clarification: {
    title: "Esclarecimento importante",
    body: [
      "m-pathy não é MAIOS.",
      "m-pathy é um espaço de trabalho profissional de IA.",
      "MAIOS é o sistema interno que define como a IA pode raciocinar.",
      "O que você vê em m-pathy.ai é uma implementação cliente.",
      "O que você lê aqui é o sistema subjacente.",
      "m-pathy usa MAIOS.",
      "MAIOS existe de forma independente de m-pathy.",
      "Esta página é sobre MAIOS."
    ]
  },

  problem_statement: {
    title: "Sua IA já toma decisões",
    subtitle: "Você apenas não consegue defendê-las.",
    body: [
      "Saídas de IA influenciam diariamente contratação, direito, estratégia e risco.",
      "A maioria das organizações não consegue explicar em quais condições de sistema esses resultados foram produzidos, quais regras se aplicaram ou quem foi responsável.",
      "Não é um problema de modelo.",
      "Não é um problema de ferramenta.",
      "É um problema de infraestrutura."
    ]
  },

  problems: {
    title: "Os problemas que o MAIOS resolve",
    items: [
      { title: "Resultados de IA não são explicáveis quando importa", accordion: "explicação" },
      { title: "Governança existe no papel, não na execução", accordion: "explicação" },
      { title: "Responsabilidade em sistemas de IA é pouco clara", accordion: "explicação" },
      { title: "O comportamento da IA deriva sem visibilidade", accordion: "explicação" },
      { title: "Raciocínio de especialistas e comportamento do sistema se misturam", accordion: "explicação" },
      { title: "Telemetria é tratada como log, não como controle", accordion: "explicação" }
    ]
  },

  what_it_is: {
    title: "O que é MAIOS",
    body: [
      "MAIOS é um sistema interno que define como a IA pode raciocinar antes de existir um resultado.",
      "MAIOS governa condições iniciais, modos, especialistas envolvidos, pontos de governança e se um resultado pode existir.",
      "MAIOS não substitui sua IA.",
      "MAIOS governa sua IA."
    ],
    accordion: "funcionamento interno"
  },

  what_it_is_not: {
    title: "O que MAIOS não é",
    body: [
      "MAIOS não armazena dados.",
      "MAIOS não persiste telemetria.",
      "MAIOS não gerencia infraestrutura.",
      "MAIOS não certifica conformidade.",
      "MAIOS impõe saídas admissíveis.",
      "A conformidade ocorre no seu sistema."
    ]
  },

  audience: {
    title: "Para quem o MAIOS foi projetado",
    body: [
      "MAIOS é projetado para organizações em ambientes de IA de alto risco e regulados.",
      "Inclui contextos onde saídas de IA influenciam direitos, segurança, acesso ou status legal."
    ],
    sectors: [
      "Medicina e saúde",
      "Governo e setor público",
      "Direito e justiça",
      "Serviços financeiros e seguros",
      "Infraestrutura crítica e segurança",
      "Grandes empresas"
    ],
    footer: [
      "MAIOS não certifica conformidade.",
      "MAIOS permite operação conforme."
    ],
    accordion: "detalhe por setor"
  },

  offering: {
    title: "A oferta MAIOS",
    core: {
      title: "MAIOS Core",
      body: [
        "MAIOS Core é a camada interna universal.",
        "Fornece espaço de sistema determinístico, telemetria obrigatória, bloqueio de saídas, lógica clara de início e fim, visibilidade de drift e separação de responsabilidades.",
        "MAIOS Core não inclui agentes.",
        "MAIOS Core não inclui especialistas.",
        "MAIOS Core não inclui modelos de governança.",
        "MAIOS Core é suficiente para organizações pequenas e médias."
      ]
    },
    inventory: {
      title: "MAIOS Inventory Mapping",
      body: [
        "Inventory Mapping adapta o MAIOS a sistemas existentes.",
        "Declara agentes, especialistas e sistemas, vincula-os à telemetria MAIOS e mapeia governança e responsabilidades.",
        "Inventory Mapping requer MAIOS Core.",
        "MAIOS não impõe inventários.",
        "MAIOS referencia o que já existe."
      ]
    },
    accordion: "detalhes de implementação"
  },

  proof: {
    title: "m-pathy como prova",
    body: [
      "m-pathy é um espaço de trabalho de IA governado, construído sobre o MAIOS.",
      "Demonstra que uma infraestrutura de IA governada pode ser construída, operada e verificada em produção.",
      "MAIOS funciona sem m-pathy."
    ],
    accordion: "arquivo, truth hash, selagem, encadeamento"
  },

  consulting: {
    title: "Consultoria de implementação e governança",
    body: [
      "Para organizações reguladas ou em escala.",
      "Apoiamos integração, inventory mapping, desenho de auditorias, selagem criptográfica, governança e preparação para revisões.",
      "Não é onboarding.",
      "É trabalho de infraestrutura."
    ],
    accordion: "escopo da consultoria"
  },

  contact: {
    title: "Enviar mensagem",
    eyebrow: "Acesso ao sistema governado",

    body: [
      "Inicie uma conversa focada sobre seu sistema."
    ],

    toggle: {
      open: "Abrir formulário",
      close: "Fechar formulário"
    },

    fields: [
      "Tipo de mensagem",
      "Mensagem",
      "Endereço de e-mail",
      "Empresa (opcional)",
      "Função (opcional)"
    ],

    messageTypes: {
      consulting_inquiry: "Consulta",
      governance_assessment: "Avaliação de governança",
      system_integration: "Integração de sistema",
      audit_preparation: "Preparação de auditoria",
      technical_question: "Pergunta técnica",
      support_or_other: "Suporte ou outro"
    },

    actions: {
      submit: "Enviar mensagem"
    },

    feedback: {
      success: "Mensagem enviada.",
      error: "Falha no envio.",
      captcha_missing: "Configuração de captcha ausente."
    },

    placeholders: {
      message: "Descreva sua solicitação",
      email: "voce@exemplo.pt",
      company: "Empresa",
      role: "Sua função"
    },

    validation: {
      required: "Campo obrigatório.",
      email_invalid: "E-mail inválido."
    },

    footer: [
      "Mensagens são enviadas por e-mail e armazenadas.",
      "Sem respostas automáticas.",
      "Sem marketing."
    ]
  },

  closing: {
    body: [
      "m-pathy mostra o que é possível.",
      "MAIOS torna isso possível em qualquer lugar."
    ]
  }
},

nl: {
  hero: {
    title: "MAIOS",
    subtitle: "Modulair besturingssysteem voor kunstmatige intelligentie",
    intro: "Interne infrastructuur voor aangestuurde AI-systemen"
  },

  clarification: {
    title: "Belangrijke verduidelijking",
    body: [
      "m-pathy is geen MAIOS.",
      "m-pathy is een professionele AI-werkruimte.",
      "MAIOS is het interne systeem dat bepaalt hoe AI mag redeneren.",
      "Wat je op m-pathy.ai ziet is een client-implementatie.",
      "Wat je hier leest is het onderliggende systeem.",
      "m-pathy gebruikt MAIOS.",
      "MAIOS bestaat los van m-pathy.",
      "Deze pagina gaat over MAIOS."
    ]
  },

  problem_statement: {
    title: "Je AI neemt al beslissingen",
    subtitle: "Je kunt ze alleen niet verantwoorden.",
    body: [
      "AI-uitkomsten beïnvloeden dagelijks werving, recht, strategie en risico.",
      "De meeste organisaties kunnen niet uitleggen onder welke systeemcondities deze resultaten ontstonden, welke regels golden of wie verantwoordelijk was.",
      "Dit is geen modelprobleem.",
      "Dit is geen toolprobleem.",
      "Dit is een infrastructuurprobleem."
    ]
  },

  problems: {
    title: "De problemen die MAIOS oplost",
    items: [
      { title: "AI-uitkomsten zijn niet uitlegbaar wanneer het telt", accordion: "uitleg" },
      { title: "Governance bestaat op papier, niet in uitvoering", accordion: "uitleg" },
      { title: "Verantwoordelijkheid in AI-systemen is onduidelijk", accordion: "uitleg" },
      { title: "AI-gedrag drijft zonder zichtbaarheid", accordion: "uitleg" },
      { title: "Expertredenering en systeemgedrag lopen door elkaar", accordion: "uitleg" },
      { title: "Telemetrie wordt gezien als logging, niet als controle", accordion: "uitleg" }
    ]
  },

  what_it_is: {
    title: "Wat MAIOS is",
    body: [
      "MAIOS is een intern besturingssysteem dat bepaalt hoe AI mag redeneren voordat er een resultaat is.",
      "MAIOS stuurt startcondities, modi, betrokken experts, governance-momenten en of een resultaat mag bestaan.",
      "MAIOS vervangt je AI niet.",
      "MAIOS stuurt je AI."
    ],
    accordion: "interne werking"
  },

  what_it_is_not: {
    title: "Wat MAIOS niet is",
    body: [
      "MAIOS slaat geen data op.",
      "MAIOS bewaart geen telemetrie.",
      "MAIOS beheert geen infrastructuur.",
      "MAIOS certificeert geen compliance.",
      "MAIOS dwingt toegestane uitkomsten af.",
      "Compliance ontstaat in je eigen systeem."
    ]
  },

  audience: {
    title: "Voor wie MAIOS is ontworpen",
    body: [
      "MAIOS is bedoeld voor organisaties in risicovolle en gereguleerde AI-omgevingen.",
      "Dit omvat contexten waar AI-uitkomsten rechten, veiligheid, toegang of juridische status beïnvloeden."
    ],
    sectors: [
      "Zorg en gezondheidszorg",
      "Overheid en publieke sector",
      "Recht en justitie",
      "Financiële diensten en verzekeringen",
      "Kritieke infrastructuur en veiligheid",
      "Grote organisaties"
    ],
    footer: [
      "MAIOS certificeert geen compliance.",
      "MAIOS maakt compliant werken mogelijk."
    ],
    accordion: "sectorale verdieping"
  },

  offering: {
    title: "Het MAIOS-aanbod",
    core: {
      title: "MAIOS Core",
      body: [
        "MAIOS Core is de universele interne laag.",
        "Het biedt deterministische systeemruimte, verplichte telemetrie, outputblokkering, duidelijke start- en eindlogica, drift-zichtbaarheid en rol­splitsing.",
        "MAIOS Core bevat geen agenten.",
        "MAIOS Core bevat geen experts.",
        "MAIOS Core bevat geen governance-modellen.",
        "MAIOS Core volstaat voor kleine en middelgrote organisaties."
      ]
    },
    inventory: {
      title: "MAIOS Inventory Mapping",
      body: [
        "Inventory Mapping past MAIOS aan bestaande systemen aan.",
        "Het legt agenten, experts en systemen vast, koppelt ze aan MAIOS-telemetrie en brengt governance en verantwoordelijkheid in kaart.",
        "Inventory Mapping vereist MAIOS Core.",
        "MAIOS legt geen inventaris op.",
        "MAIOS verwijst naar wat al bestaat."
      ]
    },
    accordion: "implementatiedetails"
  },

  proof: {
    title: "m-pathy als bewijs",
    body: [
      "m-pathy is een aangestuurde AI-werkruimte gebouwd op MAIOS.",
      "Het toont aan dat aangestuurde AI-infrastructuur in productie kan draaien en verifieerbaar is.",
      "MAIOS werkt ook zonder m-pathy."
    ],
    accordion: "archief, truth hash, verzegeling, koppeling"
  },

  consulting: {
    title: "Implementatie- en governance-advies",
    body: [
      "Voor organisaties onder regulering of op schaal.",
      "We ondersteunen integratie, inventory mapping, auditontwerp, cryptografische verzegeling, governance en auditvoorbereiding.",
      "Dit is geen onboarding.",
      "Dit is infrastructuurwerk."
    ],
    accordion: "adviesomvang"
  },

  contact: {
    title: "Bericht sturen",
    eyebrow: "Aangestuurde systeemtoegang",

    body: [
      "Start een gerichte conversatie over je systeem."
    ],

    toggle: {
      open: "Formulier openen",
      close: "Formulier sluiten"
    },

    fields: [
      "Berichttype",
      "Bericht",
      "E-mailadres",
      "Bedrijf (optioneel)",
      "Rol (optioneel)"
    ],

    messageTypes: {
      consulting_inquiry: "Consultvraag",
      governance_assessment: "Governance-beoordeling",
      system_integration: "Systeemintegratie",
      audit_preparation: "Auditvoorbereiding",
      technical_question: "Technische vraag",
      support_or_other: "Support of anders"
    },

    actions: {
      submit: "Bericht sturen"
    },

    feedback: {
      success: "Bericht verzonden.",
      error: "Verzenden mislukt.",
      captcha_missing: "Captcha-configuratie ontbreekt."
    },

    placeholders: {
      message: "Beschrijf je vraag",
      email: "jij@voorbeeld.nl",
      company: "Bedrijf",
      role: "Jouw rol"
    },

    validation: {
      required: "Verplicht veld.",
      email_invalid: "Ongeldig e-mailadres."
    },

    footer: [
      "Berichten worden per e-mail verzonden en opgeslagen.",
      "Geen automatische antwoorden.",
      "Geen marketing."
    ]
  },

  closing: {
    body: [
      "m-pathy laat zien wat mogelijk is.",
      "MAIOS maakt het overal mogelijk."
    ]
  }
},

ru: {
  hero: {
    title: "MAIOS",
    subtitle: "Модульная операционная система для искусственного интеллекта",
    intro: "Внутренняя инфраструктура для управляемых ИИ-систем"
  },

  clarification: {
    title: "Важное пояснение",
    body: [
      "m-pathy не является MAIOS.",
      "m-pathy — профессиональная рабочая среда ИИ.",
      "MAIOS — внутренняя система, определяющая, как ИИ может рассуждать.",
      "То, что вы видите на m-pathy.ai, — клиентская реализация.",
      "То, что вы читаете здесь, — базовая система.",
      "m-pathy использует MAIOS.",
      "MAIOS существует независимо от m-pathy.",
      "Эта страница о MAIOS."
    ]
  },

  problem_statement: {
    title: "Ваш ИИ уже принимает решения",
    subtitle: "Вы просто не можете их обосновать.",
    body: [
      "Результаты ИИ ежедневно влияют на найм, право, стратегию и риск.",
      "Большинство организаций не могут объяснить, при каких условиях системы они были получены, какие правила действовали и кто был ответственен.",
      "Это не проблема модели.",
      "Это не проблема инструментов.",
      "Это проблема инфраструктуры."
    ]
  },

  problems: {
    title: "Проблемы, которые решает MAIOS",
    items: [
      { title: "Результаты ИИ нельзя объяснить, когда это важно", accordion: "пояснение" },
      { title: "Говернанс есть на бумаге, но не в работе", accordion: "пояснение" },
      { title: "Ответственность в ИИ-системах неясна", accordion: "пояснение" },
      { title: "Поведение ИИ дрейфует без видимости", accordion: "пояснение" },
      { title: "Экспертное мышление и поведение системы смешаны", accordion: "пояснение" },
      { title: "Телеметрия рассматривается как логирование, а не контроль", accordion: "пояснение" }
    ]
  },

  what_it_is: {
    title: "Что такое MAIOS",
    body: [
      "MAIOS — внутренняя система, определяющая, как ИИ может рассуждать до появления результата.",
      "MAIOS управляет условиями старта, режимами, участвующими экспертами, моментами говернанса и допустимостью результата.",
      "MAIOS не заменяет ваш ИИ.",
      "MAIOS управляет ИИ."
    ],
    accordion: "внутреннее устройство"
  },

  what_it_is_not: {
    title: "Чем MAIOS не является",
    body: [
      "MAIOS не хранит данные.",
      "MAIOS не сохраняет телеметрию.",
      "MAIOS не управляет инфраструктурой.",
      "MAIOS не сертифицирует соответствие.",
      "MAIOS принуждает допустимые результаты.",
      "Соответствие обеспечивается в вашей системе."
    ]
  },

  audience: {
    title: "Для кого предназначен MAIOS",
    body: [
      "MAIOS предназначен для организаций в высокорисковых и регулируемых ИИ-средах.",
      "Сюда входят контексты, где результаты ИИ влияют на права, безопасность, доступ или правовой статус."
    ],
    sectors: [
      "Медицина и здравоохранение",
      "Государственный и публичный сектор",
      "Право и суд",
      "Финансы и страхование",
      "Критическая инфраструктура и безопасность",
      "Крупные организации"
    ],
    footer: [
      "MAIOS не сертифицирует соответствие.",
      "MAIOS позволяет работать в соответствии."
    ],
    accordion: "отраслевая глубина"
  },

  offering: {
    title: "Предложение MAIOS",
    core: {
      title: "MAIOS Core",
      body: [
        "MAIOS Core — универсальный внутренний слой.",
        "Он обеспечивает детерминированное пространство системы, обязательную телеметрию, блокировку результатов, четкую логику начала и завершения, видимость дрейфа и разделение ответственности.",
        "MAIOS Core не содержит агентов.",
        "MAIOS Core не содержит экспертов.",
        "MAIOS Core не содержит моделей говернанса.",
        "MAIOS Core подходит для малых и средних организаций."
      ]
    },
    inventory: {
      title: "MAIOS Inventory Mapping",
      body: [
        "Inventory Mapping адаптирует MAIOS к существующим системам.",
        "Он описывает агентов, экспертов и системы, связывает их с телеметрией MAIOS и отображает говернанс и ответственность.",
        "Inventory Mapping требует MAIOS Core.",
        "MAIOS не навязывает инвентарь.",
        "MAIOS ссылается на существующее."
      ]
    },
    accordion: "детали внедрения"
  },

  proof: {
    title: "m-pathy как доказательство",
    body: [
      "m-pathy — управляемая рабочая среда ИИ на базе MAIOS.",
      "Она показывает, что управляемая ИИ-инфраструктура может работать и проверяться в продакшене.",
      "MAIOS работает и без m-pathy."
    ],
    accordion: "архив, truth hash, запечатывание, связность"
  },

  consulting: {
    title: "Консалтинг по внедрению и говернансу",
    body: [
      "Для регулируемых или масштабных организаций.",
      "Мы поддерживаем интеграцию, inventory mapping, дизайн аудитов, криптографическое запечатывание, говернанс и подготовку к проверкам.",
      "Это не онбординг.",
      "Это инфраструктурная работа."
    ],
    accordion: "область консалтинга"
  },

  contact: {
    title: "Отправить сообщение",
    eyebrow: "Управляемый доступ к системе",

    body: [
      "Начните целевой диалог о вашей системе."
    ],

    toggle: {
      open: "Открыть форму",
      close: "Закрыть форму"
    },

    fields: [
      "Тип сообщения",
      "Сообщение",
      "Адрес электронной почты",
      "Компания (необязательно)",
      "Роль (необязательно)"
    ],

    messageTypes: {
      consulting_inquiry: "Запрос на консультацию",
      governance_assessment: "Оценка говернанса",
      system_integration: "Интеграция системы",
      audit_preparation: "Подготовка к аудиту",
      technical_question: "Технический вопрос",
      support_or_other: "Поддержка или другое"
    },

    actions: {
      submit: "Отправить сообщение"
    },

    feedback: {
      success: "Сообщение отправлено.",
      error: "Ошибка отправки.",
      captcha_missing: "Отсутствует настройка captcha."
    },

    placeholders: {
      message: "Опишите запрос",
      email: "you@example.ru",
      company: "Компания",
      role: "Ваша роль"
    },

    validation: {
      required: "Обязательное поле.",
      email_invalid: "Неверный адрес электронной почты."
    },

    footer: [
      "Сообщения отправляются по электронной почте и сохраняются.",
      "Без автоматических ответов.",
      "Без маркетинга."
    ]
  },

  closing: {
    body: [
      "m-pathy показывает возможное.",
      "MAIOS делает это возможным везде."
    ]
  }
},

zh: {
  hero: {
    title: "MAIOS",
    subtitle: "模块化人工智能操作系统",
    intro: "用于受控 AI 系统的内部基础设施"
  },

  clarification: {
    title: "重要说明",
    body: [
      "m-pathy 不是 MAIOS。",
      "m-pathy 是一个专业的 AI 工作空间。",
      "MAIOS 是定义 AI 如何推理的内部系统。",
      "你在 m-pathy.ai 看到的是客户端实现。",
      "你在此阅读的是底层系统。",
      "m-pathy 使用 MAIOS。",
      "MAIOS 独立于 m-pathy 存在。",
      "本页面介绍 MAIOS。"
    ]
  },

  problem_statement: {
    title: "你的 AI 已在做出决策",
    subtitle: "但你无法为其辩护。",
    body: [
      "AI 输出每天影响招聘、法律、战略和风险。",
      "大多数组织无法解释这些结果在何种系统条件下产生、适用了哪些规则或由谁负责。",
      "这不是模型问题。",
      "这不是工具问题。",
      "这是基础设施问题。"
    ]
  },

  problems: {
    title: "MAIOS 解决的问题",
    items: [
      { title: "关键时刻无法解释 AI 输出", accordion: "说明" },
      { title: "治理只存在于纸面，而非执行", accordion: "说明" },
      { title: "AI 系统中的责任结构不清晰", accordion: "说明" },
      { title: "AI 行为在无可见性的情况下漂移", accordion: "说明" },
      { title: "专家推理与系统行为混杂", accordion: "说明" },
      { title: "遥测被当作日志，而非控制", accordion: "说明" }
    ]
  },

  what_it_is: {
    title: "什么是 MAIOS",
    body: [
      "MAIOS 是在结果产生之前定义 AI 如何推理的内部系统。",
      "MAIOS 管理启动条件、模式、参与专家、治理节点以及结果是否被允许。",
      "MAIOS 不替代你的 AI。",
      "MAIOS 约束你的 AI。"
    ],
    accordion: "内部工作方式"
  },

  what_it_is_not: {
    title: "MAIOS 不是什么",
    body: [
      "MAIOS 不存储数据。",
      "MAIOS 不持久化遥测。",
      "MAIOS 不管理基础设施。",
      "MAIOS 不认证合规性。",
      "MAIOS 强制可接受的输出。",
      "合规性发生在你的系统中。"
    ]
  },

  audience: {
    title: "MAIOS 的适用对象",
    body: [
      "MAIOS 面向高风险和受监管的 AI 环境中的组织。",
      "包括 AI 输出影响权利、安全、访问或法律地位的场景。"
    ],
    sectors: [
      "医疗与健康",
      "政府与公共部门",
      "法律与司法",
      "金融与保险",
      "关键基础设施与安全",
      "大型企业"
    ],
    footer: [
      "MAIOS 不认证合规。",
      "MAIOS 支持合规运行。"
    ],
    accordion: "行业细节"
  },

  offering: {
    title: "MAIOS 产品",
    core: {
      title: "MAIOS Core",
      body: [
        "MAIOS Core 是通用的内部层。",
        "它提供确定性的系统空间、强制遥测、输出阻断、清晰的开始与结束逻辑、漂移可见性以及责任分离。",
        "MAIOS Core 不包含代理。",
        "MAIOS Core 不包含专家。",
        "MAIOS Core 不包含治理模型。",
        "MAIOS Core 适用于中小型组织。"
      ]
    },
    inventory: {
      title: "MAIOS Inventory Mapping",
      body: [
        "Inventory Mapping 将 MAIOS 适配到现有系统。",
        "它声明代理、专家和系统，将其绑定到 MAIOS 遥测，并映射治理与责任。",
        "Inventory Mapping 需要 MAIOS Core。",
        "MAIOS 不强制清单。",
        "MAIOS 引用既有内容。"
      ]
    },
    accordion: "实施细节"
  },

  proof: {
    title: "m-pathy 作为证明",
    body: [
      "m-pathy 是基于 MAIOS 构建的受控 AI 工作空间。",
      "它证明受控 AI 基础设施可以在生产中运行并被验证。",
      "MAIOS 无需 m-pathy 也可运行。"
    ],
    accordion: "归档、truth hash、封装、链式"
  },

  consulting: {
    title: "实施与治理咨询",
    body: [
      "适用于受监管或规模化组织。",
      "我们支持集成、inventory mapping、审计设计、加密封装、治理以及审查准备。",
      "这不是入门培训。",
      "这是基础设施工作。"
    ],
    accordion: "咨询范围"
  },

  contact: {
    title: "发送消息",
    eyebrow: "受控系统入口",

    body: [
      "开启一次针对你系统的专注对话。"
    ],

    toggle: {
      open: "打开表单",
      close: "关闭表单"
    },

    fields: [
      "消息类型",
      "消息内容",
      "电子邮箱",
      "公司（可选）",
      "角色（可选）"
    ],

    messageTypes: {
      consulting_inquiry: "咨询请求",
      governance_assessment: "治理评估",
      system_integration: "系统集成",
      audit_preparation: "审计准备",
      technical_question: "技术问题",
      support_or_other: "支持或其他"
    },

    actions: {
      submit: "发送消息"
    },

    feedback: {
      success: "消息已发送。",
      error: "发送失败。",
      captcha_missing: "缺少验证码配置。"
    },

    placeholders: {
      message: "描述你的请求",
      email: "you@example.cn",
      company: "公司",
      role: "你的角色"
    },

    validation: {
      required: "必填字段。",
      email_invalid: "无效的邮箱地址。"
    },

    footer: [
      "消息将通过电子邮件发送并保存。",
      "无自动回复。",
      "无营销。"
    ]
  },

  closing: {
    body: [
      "m-pathy 展示了可能性。",
      "MAIOS 让这一切在任何地方成为可能。"
    ]
  }
},

ja: {
  hero: {
    title: "MAIOS",
    subtitle: "モジュール型人工知能オペレーティングシステム",
    intro: "統制されたAIシステムのための内部基盤"
  },

  clarification: {
    title: "重要な説明",
    body: [
      "m-pathy は MAIOS ではありません。",
      "m-pathy はプロフェッショナル向けAIワークスペースです。",
      "MAIOS は AI がどのように推論できるかを定める内部システムです。",
      "m-pathy.ai で見えるものはクライアント実装です。",
      "ここに記されているのは基盤となるシステムです。",
      "m-pathy は MAIOS を使用しています。",
      "MAIOS は m-pathy とは独立して存在します。",
      "このページは MAIOS についてです。"
    ]
  },

  problem_statement: {
    title: "AI はすでに意思決定を行っています",
    subtitle: "しかし、その根拠を説明できません。",
    body: [
      "AI の出力は日々、採用、法務、戦略、リスクに影響を与えています。",
      "多くの組織は、それらがどのシステム条件で生成され、どのルールが適用され、誰が責任を負うのかを説明できません。",
      "これはモデルの問題ではありません。",
      "ツールの問題でもありません。",
      "内部インフラの問題です。"
    ]
  },

  problems: {
    title: "MAIOS が解決する課題",
    items: [
      { title: "重要な場面で AI 出力を説明できない", accordion: "説明" },
      { title: "ガバナンスは文書上にあり、運用にない", accordion: "説明" },
      { title: "AI システム内の責任が不明確", accordion: "説明" },
      { title: "可視性のないまま AI の挙動がドリフトする", accordion: "説明" },
      { title: "専門家の推論とシステム挙動が混在している", accordion: "説明" },
      { title: "テレメトリが制御ではなくログとして扱われている", accordion: "説明" }
    ]
  },

  what_it_is: {
    title: "MAIOS とは",
    body: [
      "MAIOS は結果が生成される前に、AI の推論方法を定める内部システムです。",
      "MAIOS は開始条件、モード、関与する専門家、ガバナンスポイント、結果の可否を制御します。",
      "MAIOS は AI を置き換えません。",
      "MAIOS は AI を制御します。"
    ],
    accordion: "内部の仕組み"
  },

  what_it_is_not: {
    title: "MAIOS ではないもの",
    body: [
      "MAIOS はデータを保存しません。",
      "MAIOS はテレメトリを保持しません。",
      "MAIOS はインフラを管理しません。",
      "MAIOS はコンプライアンスを認証しません。",
      "MAIOS は許容される出力のみを強制します。",
      "コンプライアンスは利用側システムで実現されます。"
    ]
  },

  audience: {
    title: "MAIOS の対象",
    body: [
      "MAIOS は高リスクかつ規制された AI 環境で運用する組織向けです。",
      "AI 出力が権利、安全、アクセス、法的地位に影響する環境を含みます。"
    ],
    sectors: [
      "医療・ヘルスケア",
      "政府・公共部門",
      "法務・司法",
      "金融・保険",
      "重要インフラ・セキュリティ",
      "大規模組織"
    ],
    footer: [
      "MAIOS はコンプライアンスを認証しません。",
      "MAIOS は準拠運用を可能にします。"
    ],
    accordion: "業界別詳細"
  },

  offering: {
    title: "MAIOS の提供内容",
    core: {
      title: "MAIOS Core",
      body: [
        "MAIOS Core は汎用の内部レイヤーです。",
        "決定論的なシステム空間、必須テレメトリ、出力ブロック、明確な開始・終了ロジック、ドリフト可視化、責任分離を提供します。",
        "MAIOS Core にはエージェントは含まれません。",
        "MAIOS Core には専門家は含まれません。",
        "MAIOS Core にはガバナンスモデルは含まれません。",
        "MAIOS Core は中小規模の組織に十分です。"
      ]
    },
    inventory: {
      title: "MAIOS Inventory Mapping",
      body: [
        "Inventory Mapping は MAIOS を既存システムに適合させます。",
        "エージェント、専門家、システムを定義し、MAIOS テレメトリに結び付け、ガバナンスと責任を整理します。",
        "Inventory Mapping には MAIOS Core が必要です。",
        "MAIOS はインベントリを強制しません。",
        "MAIOS は既存要素を参照します。"
      ]
    },
    accordion: "実装詳細"
  },

  proof: {
    title: "証明としての m-pathy",
    body: [
      "m-pathy は MAIOS 上に構築された統制型 AI ワークスペースです。",
      "統制された AI インフラが本番環境で運用・検証可能であることを示します。",
      "MAIOS は m-pathy なしでも機能します。"
    ],
    accordion: "アーカイブ、truth hash、封印、連鎖"
  },

  consulting: {
    title: "実装・ガバナンス支援",
    body: [
      "規制下または大規模運用の組織向け。",
      "統合、inventory mapping、監査設計、暗号封印、ガバナンス、審査準備を支援します。",
      "オンボーディングではありません。",
      "インフラ作業です。"
    ],
    accordion: "支援範囲"
  },

  contact: {
    title: "メッセージ送信",
    eyebrow: "統制システム入口",

    body: [
      "あなたのシステムについて集中的な対話を始めましょう。"
    ],

    toggle: {
      open: "フォームを開く",
      close: "フォームを閉じる"
    },

    fields: [
      "メッセージ種別",
      "メッセージ",
      "メールアドレス",
      "会社（任意）",
      "役割（任意）"
    ],

    messageTypes: {
      consulting_inquiry: "相談依頼",
      governance_assessment: "ガバナンス評価",
      system_integration: "システム統合",
      audit_preparation: "監査準備",
      technical_question: "技術的な質問",
      support_or_other: "サポート・その他"
    },

    actions: {
      submit: "送信"
    },

    feedback: {
      success: "送信しました。",
      error: "送信に失敗しました。",
      captcha_missing: "Captcha 設定がありません。"
    },

    placeholders: {
      message: "内容を入力",
      email: "you@example.jp",
      company: "会社名",
      role: "役割"
    },

    validation: {
      required: "必須項目です。",
      email_invalid: "無効なメールアドレスです。"
    },

    footer: [
      "メッセージはメール送信され保存されます。",
      "自動返信はありません。",
      "マーケティングは行いません。"
    ]
  },

  closing: {
    body: [
      "m-pathy は可能性を示します。",
      "MAIOS はそれをどこでも可能にします。"
    ]
  }
},

ko: {
  hero: {
    title: "MAIOS",
    subtitle: "모듈형 인공지능 운영체제",
    intro: "통제된 AI 시스템을 위한 내부 인프라"
  },

  clarification: {
    title: "중요한 설명",
    body: [
      "m-pathy는 MAIOS가 아닙니다.",
      "m-pathy는 전문 AI 작업 공간입니다.",
      "MAIOS는 AI가 어떻게 추론할 수 있는지를 정의하는 내부 시스템입니다.",
      "m-pathy.ai에서 보이는 것은 클라이언트 구현입니다.",
      "여기에서 읽는 내용은 기반 시스템입니다.",
      "m-pathy는 MAIOS를 사용합니다.",
      "MAIOS는 m-pathy와 독립적으로 존재합니다.",
      "이 페이지는 MAIOS에 관한 것입니다."
    ]
  },

  problem_statement: {
    title: "당신의 AI는 이미 결정을 내리고 있습니다",
    subtitle: "하지만 그 근거를 설명할 수 없습니다.",
    body: [
      "AI 출력은 매일 채용, 법률, 전략, 위험에 영향을 미칩니다.",
      "대부분의 조직은 어떤 시스템 조건에서 결과가 생성되었는지, 어떤 규칙이 적용되었는지, 누가 책임자인지 설명하지 못합니다.",
      "이는 모델 문제가 아닙니다.",
      "도구 문제도 아닙니다.",
      "인프라 문제입니다."
    ]
  },

  problems: {
    title: "MAIOS가 해결하는 문제",
    items: [
      { title: "중요할 때 AI 출력을 설명할 수 없음", accordion: "설명" },
      { title: "거버넌스는 문서에만 있고 실행에는 없음", accordion: "설명" },
      { title: "AI 시스템 내 책임 구조가 불분명함", accordion: "설명" },
      { title: "가시성 없이 AI 동작이 드리프트함", accordion: "설명" },
      { title: "전문가 추론과 시스템 동작이 혼합됨", accordion: "설명" },
      { title: "텔레메트리가 제어가 아닌 로그로 취급됨", accordion: "설명" }
    ]
  },

  what_it_is: {
    title: "MAIOS란",
    body: [
      "MAIOS는 결과가 생성되기 전에 AI의 추론 방식을 정의하는 내부 시스템입니다.",
      "MAIOS는 시작 조건, 모드, 참여 전문가, 거버넌스 시점, 결과 허용 여부를 관리합니다.",
      "MAIOS는 AI를 대체하지 않습니다.",
      "MAIOS는 AI를 통제합니다."
    ],
    accordion: "내부 동작"
  },

  what_it_is_not: {
    title: "MAIOS가 아닌 것",
    body: [
      "MAIOS는 데이터를 저장하지 않습니다.",
      "MAIOS는 텔레메트리를 보존하지 않습니다.",
      "MAIOS는 인프라를 관리하지 않습니다.",
      "MAIOS는 컴플라이언스를 인증하지 않습니다.",
      "MAIOS는 허용된 출력만 강제합니다.",
      "컴플라이언스는 사용자 시스템에서 이루어집니다."
    ]
  },

  audience: {
    title: "MAIOS의 대상",
    body: [
      "MAIOS는 고위험 및 규제된 AI 환경에서 운영하는 조직을 위해 설계되었습니다.",
      "AI 출력이 권리, 안전, 접근성 또는 법적 지위에 영향을 미치는 환경을 포함합니다."
    ],
    sectors: [
      "의료 및 헬스케어",
      "정부 및 공공 부문",
      "법률 및 사법",
      "금융 및 보험",
      "핵심 인프라 및 보안",
      "대규모 조직"
    ],
    footer: [
      "MAIOS는 컴플라이언스를 인증하지 않습니다.",
      "MAIOS는 준수 운영을 가능하게 합니다."
    ],
    accordion: "산업별 세부"
  },

  offering: {
    title: "MAIOS 제공 내용",
    core: {
      title: "MAIOS Core",
      body: [
        "MAIOS Core는 범용 내부 레이어입니다.",
        "결정론적 시스템 공간, 필수 텔레메트리, 출력 차단, 명확한 시작·종료 로직, 드리프트 가시성, 책임 분리를 제공합니다.",
        "MAIOS Core에는 에이전트가 없습니다.",
        "MAIOS Core에는 전문가가 없습니다.",
        "MAIOS Core에는 거버넌스 모델이 없습니다.",
        "MAIOS Core는 중소 규모 조직에 충분합니다."
      ]
    },
    inventory: {
      title: "MAIOS Inventory Mapping",
      body: [
        "Inventory Mapping은 MAIOS를 기존 시스템에 적용합니다.",
        "에이전트, 전문가, 시스템을 정의하고 MAIOS 텔레메트리에 연결하여 거버넌스와 책임을 매핑합니다.",
        "Inventory Mapping에는 MAIOS Core가 필요합니다.",
        "MAIOS는 인벤토리를 강제하지 않습니다.",
        "MAIOS는 기존 요소를 참조합니다."
      ]
    },
    accordion: "구현 세부"
  },

  proof: {
    title: "증명으로서의 m-pathy",
    body: [
      "m-pathy는 MAIOS 기반의 통제된 AI 작업 공간입니다.",
      "통제된 AI 인프라가 실제 운영 환경에서 검증 가능함을 보여줍니다.",
      "MAIOS는 m-pathy 없이도 작동합니다."
    ],
    accordion: "아카이브, truth hash, 봉인, 체인"
  },

  consulting: {
    title: "구현 및 거버넌스 컨설팅",
    body: [
      "규제 환경 또는 대규모 조직을 위한 서비스입니다.",
      "통합, inventory mapping, 감사 설계, 암호화 봉인, 거버넌스, 심사 준비를 지원합니다.",
      "온보딩이 아닙니다.",
      "인프라 작업입니다."
    ],
    accordion: "컨설팅 범위"
  },

  contact: {
    title: "메시지 보내기",
    eyebrow: "통제된 시스템 진입",

    body: [
      "시스템에 대한 집중된 대화를 시작하세요."
    ],

    toggle: {
      open: "양식 열기",
      close: "양식 닫기"
    },

    fields: [
      "메시지 유형",
      "메시지",
      "이메일 주소",
      "회사(선택)",
      "역할(선택)"
    ],

    messageTypes: {
      consulting_inquiry: "상담 요청",
      governance_assessment: "거버넌스 평가",
      system_integration: "시스템 통합",
      audit_preparation: "감사 준비",
      technical_question: "기술 질문",
      support_or_other: "지원 또는 기타"
    },

    actions: {
      submit: "메시지 전송"
    },

    feedback: {
      success: "메시지가 전송되었습니다.",
      error: "전송에 실패했습니다.",
      captcha_missing: "Captcha 설정이 없습니다."
    },

    placeholders: {
      message: "요청 내용을 입력하세요",
      email: "you@example.kr",
      company: "회사명",
      role: "역할"
    },

    validation: {
      required: "필수 항목입니다.",
      email_invalid: "유효하지 않은 이메일 주소입니다."
    },

    footer: [
      "메시지는 이메일로 전송되고 저장됩니다.",
      "자동 응답은 없습니다.",
      "마케팅은 하지 않습니다."
    ]
  },

  closing: {
    body: [
      "m-pathy는 가능성을 보여줍니다.",
      "MAIOS는 이를 어디서나 가능하게 합니다."
    ]
  }
},

ar: {
  hero: {
    title: "MAIOS",
    subtitle: "نظام تشغيل معياري للذكاء الاصطناعي",
    intro: "بنية داخلية لأنظمة ذكاء اصطناعي مُحكومة"
  },

  clarification: {
    title: "توضيح مهم",
    body: [
      "m-pathy ليس MAIOS.",
      "m-pathy مساحة عمل احترافية للذكاء الاصطناعي.",
      "MAIOS هو النظام الداخلي الذي يحدد كيف يمكن للذكاء الاصطناعي أن يستدل.",
      "ما تراه على m-pathy.ai هو تنفيذ للعميل.",
      "ما تقرأه هنا هو النظام الأساسي.",
      "m-pathy يستخدم MAIOS.",
      "MAIOS موجود بشكل مستقل عن m-pathy.",
      "هذه الصفحة عن MAIOS."
    ]
  },

  problem_statement: {
    title: "الذكاء الاصطناعي لديك يتخذ قرارات بالفعل",
    subtitle: "لكن لا يمكنك تبريرها.",
    body: [
      "مخرجات الذكاء الاصطناعي تؤثر يوميًا على التوظيف والقانون والاستراتيجية والمخاطر.",
      "معظم المؤسسات لا تستطيع شرح الشروط النظامية التي أُنتجت فيها النتائج، أو القواعد المطبقة، أو من يتحمل المسؤولية.",
      "ليست مشكلة نموذج.",
      "وليست مشكلة أداة.",
      "إنها مشكلة بنية تحتية."
    ]
  },

  problems: {
    title: "المشكلات التي يحلها MAIOS",
    items: [
      { title: "لا يمكن شرح مخرجات الذكاء الاصطناعي عند الحاجة", accordion: "شرح" },
      { title: "الحوكمة موجودة على الورق فقط", accordion: "شرح" },
      { title: "المسؤولية داخل أنظمة الذكاء الاصطناعي غير واضحة", accordion: "شرح" },
      { title: "سلوك الذكاء الاصطناعي ينحرف دون رؤية", accordion: "شرح" },
      { title: "اختلاط تفكير الخبراء بسلوك النظام", accordion: "شرح" },
      { title: "يتم التعامل مع القياس كتوثيق لا كتحكم", accordion: "شرح" }
    ]
  },

  what_it_is: {
    title: "ما هو MAIOS",
    body: [
      "MAIOS هو نظام داخلي يحدد كيفية استدلال الذكاء الاصطناعي قبل ظهور أي ناتج.",
      "MAIOS يحكم شروط البدء، والأوضاع، والخبراء المشاركين، ونقاط الحوكمة، وإمكانية وجود الناتج.",
      "MAIOS لا يستبدل الذكاء الاصطناعي لديك.",
      "MAIOS يحكم الذكاء الاصطناعي لديك."
    ],
    accordion: "العمل الداخلي"
  },

  what_it_is_not: {
    title: "ما ليس MAIOS",
    body: [
      "MAIOS لا يخزن بيانات.",
      "MAIOS لا يحتفظ بالقياس.",
      "MAIOS لا يدير البنية التحتية.",
      "MAIOS لا يصادق على الامتثال.",
      "MAIOS يفرض المخرجات المسموح بها.",
      "الامتثال يتم داخل نظامك."
    ]
  },

  audience: {
    title: "لمن صُمم MAIOS",
    body: [
      "صُمم MAIOS للمؤسسات العاملة في بيئات ذكاء اصطناعي عالية المخاطر وخاضعة للتنظيم.",
      "يشمل ذلك الحالات التي تؤثر فيها مخرجات الذكاء الاصطناعي على الحقوق أو السلامة أو الوصول أو الوضع القانوني."
    ],
    sectors: [
      "الطب والرعاية الصحية",
      "الحكومات والقطاع العام",
      "القانون والقضاء",
      "الخدمات المالية والتأمين",
      "البنية التحتية الحيوية والأمن",
      "المؤسسات الكبرى"
    ],
    footer: [
      "MAIOS لا يصادق على الامتثال.",
      "MAIOS يمكّن التشغيل المتوافق."
    ],
    accordion: "تفصيل حسب القطاع"
  },

  offering: {
    title: "عرض MAIOS",
    core: {
      title: "MAIOS Core",
      body: [
        "MAIOS Core هو الطبقة الداخلية العامة.",
        "يوفر مساحة نظام حتمية، وقياسًا إلزاميًا، وحظر المخرجات، ومنطق بدء وإنهاء واضح، ورؤية الانحراف، وفصل المسؤوليات.",
        "MAIOS Core لا يتضمن وكلاء.",
        "MAIOS Core لا يتضمن خبراء.",
        "MAIOS Core لا يتضمن نماذج حوكمة.",
        "MAIOS Core كافٍ للمؤسسات الصغيرة والمتوسطة."
      ]
    },
    inventory: {
      title: "MAIOS Inventory Mapping",
      body: [
        "Inventory Mapping يكيّف MAIOS مع الأنظمة القائمة.",
        "يحدد الوكلاء والخبراء والأنظمة ويربطهم بقياس MAIOS ويخَطِّط الحوكمة والمسؤوليات.",
        "Inventory Mapping يتطلب MAIOS Core.",
        "MAIOS لا يفرض جردًا.",
        "MAIOS يشير إلى الموجود."
      ]
    },
    accordion: "تفاصيل التنفيذ"
  },

  proof: {
    title: "m-pathy كدليل",
    body: [
      "m-pathy مساحة عمل ذكاء اصطناعي مُحكومة مبنية على MAIOS.",
      "تُظهر أن بنية ذكاء اصطناعي مُحكومة يمكن تشغيلها والتحقق منها في الإنتاج.",
      "MAIOS يعمل بدون m-pathy."
    ],
    accordion: "الأرشيف، truth hash، الختم، السلسلة"
  },

  consulting: {
    title: "استشارات التنفيذ والحوكمة",
    body: [
      "للمؤسسات الخاضعة للتنظيم أو العاملة على نطاق واسع.",
      "ندعم التكامل، وinventory mapping، وتصميم التدقيق، والختم التشفيري، والحوكمة، والاستعداد للمراجعات.",
      "هذا ليس تهيئة.",
      "هذا عمل بنية تحتية."
    ],
    accordion: "نطاق الاستشارة"
  },

  contact: {
    title: "إرسال رسالة",
    eyebrow: "دخول نظام مُحكم",

    body: [
      "ابدأ حوارًا مركّزًا حول نظامك."
    ],

    toggle: {
      open: "فتح النموذج",
      close: "إغلاق النموذج"
    },

    fields: [
      "نوع الرسالة",
      "الرسالة",
      "البريد الإلكتروني",
      "الشركة (اختياري)",
      "الدور (اختياري)"
    ],

    messageTypes: {
      consulting_inquiry: "طلب استشارة",
      governance_assessment: "تقييم الحوكمة",
      system_integration: "تكامل النظام",
      audit_preparation: "تحضير التدقيق",
      technical_question: "سؤال تقني",
      support_or_other: "دعم أو غير ذلك"
    },

    actions: {
      submit: "إرسال الرسالة"
    },

    feedback: {
      success: "تم إرسال الرسالة.",
      error: "فشل الإرسال.",
      captcha_missing: "إعداد captcha مفقود."
    },

    placeholders: {
      message: "صف طلبك",
      email: "you@example.ar",
      company: "الشركة",
      role: "الدور"
    },

    validation: {
      required: "حقل مطلوب.",
      email_invalid: "بريد إلكتروني غير صالح."
    },

    footer: [
      "يتم إرسال الرسائل عبر البريد الإلكتروني وتخزينها.",
      "لا توجد ردود آلية.",
      "لا يوجد تسويق."
    ]
  },

  closing: {
    body: [
      "m-pathy يوضح ما هو ممكن.",
      "MAIOS يجعل ذلك ممكنًا في كل مكان."
    ]
  }
},

hi: {
  hero: {
    title: "MAIOS",
    subtitle: "कृत्रिम बुद्धिमत्ता के लिए मॉड्यूलर ऑपरेटिंग सिस्टम",
    intro: "शासित AI सिस्टमों के लिए आंतरिक अवसंरचना"
  },

  clarification: {
    title: "महत्वपूर्ण स्पष्टीकरण",
    body: [
      "m-pathy, MAIOS नहीं है।",
      "m-pathy एक पेशेवर AI कार्यक्षेत्र है।",
      "MAIOS वह आंतरिक सिस्टम है जो निर्धारित करता है कि AI कैसे तर्क कर सकता है।",
      "m-pathy.ai पर जो आप देखते हैं वह एक क्लाइंट कार्यान्वयन है।",
      "यहाँ जो आप पढ़ते हैं वह मूल सिस्टम है।",
      "m-pathy, MAIOS का उपयोग करता है।",
      "MAIOS, m-pathy से स्वतंत्र रूप से मौजूद है।",
      "यह पृष्ठ MAIOS के बारे में है।"
    ]
  },

  problem_statement: {
    title: "आपकी AI पहले से निर्णय ले रही है",
    subtitle: "लेकिन आप उन्हें समझा नहीं सकते।",
    body: [
      "AI आउटपुट हर दिन भर्ती, कानून, रणनीति और जोखिम को प्रभावित करते हैं।",
      "अधिकांश संगठन यह नहीं बता सकते कि ये परिणाम किन सिस्टम परिस्थितियों में बने, कौन से नियम लागू थे या जिम्मेदार कौन था।",
      "यह मॉडल की समस्या नहीं है।",
      "यह टूल की समस्या नहीं है।",
      "यह अवसंरचना की समस्या है।"
    ]
  },

  problems: {
    title: "MAIOS जिन समस्याओं को हल करता है",
    items: [
      { title: "महत्वपूर्ण समय पर AI आउटपुट समझाए नहीं जा सकते", accordion: "व्याख्या" },
      { title: "गवर्नेंस कागज़ पर है, संचालन में नहीं", accordion: "व्याख्या" },
      { title: "AI सिस्टम में जिम्मेदारी अस्पष्ट है", accordion: "व्याख्या" },
      { title: "बिना दृश्यता के AI व्यवहार भटकता है", accordion: "व्याख्या" },
      { title: "विशेषज्ञ तर्क और सिस्टम व्यवहार मिश्रित हैं", accordion: "व्याख्या" },
      { title: "टेलीमेट्री को नियंत्रण नहीं, लॉग माना जाता है", accordion: "व्याख्या" }
    ]
  },

  what_it_is: {
    title: "MAIOS क्या है",
    body: [
      "MAIOS एक आंतरिक सिस्टम है जो आउटपुट बनने से पहले AI के तर्क को निर्धारित करता है।",
      "MAIOS प्रारंभ शर्तों, मोड, शामिल विशेषज्ञों, गवर्नेंस बिंदुओं और आउटपुट की अनुमति को नियंत्रित करता है।",
      "MAIOS आपकी AI को प्रतिस्थापित नहीं करता।",
      "MAIOS आपकी AI को नियंत्रित करता है।"
    ],
    accordion: "आंतरिक कार्यप्रणाली"
  },

  what_it_is_not: {
    title: "MAIOS क्या नहीं है",
    body: [
      "MAIOS डेटा संग्रहित नहीं करता।",
      "MAIOS टेलीमेट्री संग्रहीत नहीं करता।",
      "MAIOS अवसंरचना प्रबंधित नहीं करता।",
      "MAIOS अनुपालन प्रमाणित नहीं करता।",
      "MAIOS केवल अनुमत आउटपुट लागू करता है।",
      "अनुपालन आपके सिस्टम में होता है।"
    ]
  },

  audience: {
    title: "MAIOS किसके लिए है",
    body: [
      "MAIOS उच्च-जोखिम और विनियमित AI वातावरण में कार्यरत संगठनों के लिए है।",
      "इसमें वे संदर्भ शामिल हैं जहाँ AI आउटपुट अधिकारों, सुरक्षा, पहुँच या कानूनी स्थिति को प्रभावित करते हैं।"
    ],
    sectors: [
      "चिकित्सा और स्वास्थ्य",
      "सरकार और सार्वजनिक क्षेत्र",
      "कानून और न्याय",
      "वित्त और बीमा",
      "महत्वपूर्ण अवसंरचना और सुरक्षा",
      "बड़े संगठन"
    ],
    footer: [
      "MAIOS अनुपालन प्रमाणित नहीं करता।",
      "MAIOS अनुरूप संचालन संभव बनाता है।"
    ],
    accordion: "क्षेत्र-विशेष विवरण"
  },

  offering: {
    title: "MAIOS प्रस्ताव",
    core: {
      title: "MAIOS Core",
      body: [
        "MAIOS Core सार्वभौमिक आंतरिक परत है।",
        "यह निर्धारक सिस्टम स्पेस, अनिवार्य टेलीमेट्री, आउटपुट अवरोध, स्पष्ट प्रारंभ-समाप्ति तर्क, ड्रिफ्ट दृश्यता और जिम्मेदारी विभाजन प्रदान करता है।",
        "MAIOS Core में एजेंट नहीं होते।",
        "MAIOS Core में विशेषज्ञ नहीं होते।",
        "MAIOS Core में गवर्नेंस मॉडल नहीं होते।",
        "MAIOS Core छोटे और मध्यम संगठनों के लिए पर्याप्त है।"
      ]
    },
    inventory: {
      title: "MAIOS Inventory Mapping",
      body: [
        "Inventory Mapping, MAIOS को मौजूदा सिस्टमों के अनुसार ढालता है।",
        "यह एजेंटों, विशेषज्ञों और सिस्टमों को परिभाषित करता है, उन्हें MAIOS टेलीमेट्री से जोड़ता है और गवर्नेंस व जिम्मेदारी को मैप करता है।",
        "Inventory Mapping के लिए MAIOS Core आवश्यक है।",
        "MAIOS कोई इन्वेंटरी बाध्य नहीं करता।",
        "MAIOS मौजूदा संरचना को संदर्भित करता है।"
      ]
    },
    accordion: "कार्यान्वयन विवरण"
  },

  proof: {
    title: "m-pathy प्रमाण के रूप में",
    body: [
      "m-pathy, MAIOS पर आधारित एक शासित AI कार्यक्षेत्र है।",
      "यह दिखाता है कि शासित AI अवसंरचना को उत्पादन में चलाया और सत्यापित किया जा सकता है।",
      "MAIOS, m-pathy के बिना भी काम करता है।"
    ],
    accordion: "आर्काइव, truth hash, सीलिंग, चेनिंग"
  },

  consulting: {
    title: "कार्यान्वयन और गवर्नेंस परामर्श",
    body: [
      "विनियमित या बड़े पैमाने पर काम करने वाले संगठनों के लिए।",
      "हम एकीकरण, inventory mapping, ऑडिट डिज़ाइन, क्रिप्टोग्राफ़िक सीलिंग, गवर्नेंस और समीक्षा तैयारी में सहायता करते हैं।",
      "यह ऑनबोर्डिंग नहीं है।",
      "यह अवसंरचना कार्य है।"
    ],
    accordion: "परामर्श क्षेत्र"
  },

  contact: {
    title: "संदेश भेजें",
    eyebrow: "शासित सिस्टम प्रवेश",

    body: [
      "अपने सिस्टम पर एक केंद्रित बातचीत शुरू करें।"
    ],

    toggle: {
      open: "फ़ॉर्म खोलें",
      close: "फ़ॉर्म बंद करें"
    },

    fields: [
      "संदेश प्रकार",
      "संदेश",
      "ईमेल पता",
      "कंपनी (वैकल्पिक)",
      "भूमिका (वैकल्पिक)"
    ],

    messageTypes: {
      consulting_inquiry: "परामर्श अनुरोध",
      governance_assessment: "गवर्नेंस मूल्यांकन",
      system_integration: "सिस्टम एकीकरण",
      audit_preparation: "ऑडिट तैयारी",
      technical_question: "तकनीकी प्रश्न",
      support_or_other: "समर्थन या अन्य"
    },

    actions: {
      submit: "संदेश भेजें"
    },

    feedback: {
      success: "संदेश भेजा गया।",
      error: "भेजने में विफल।",
      captcha_missing: "Captcha कॉन्फ़िगरेशन नहीं है।"
    },

    placeholders: {
      message: "अपना अनुरोध लिखें",
      email: "you@example.in",
      company: "कंपनी",
      role: "आपकी भूमिका"
    },

    validation: {
      required: "यह फ़ील्ड आवश्यक है।",
      email_invalid: "अमान्य ईमेल पता।"
    },

    footer: [
      "संदेश ईमेल द्वारा भेजे जाते हैं और संग्रहीत किए जाते हैं।",
      "कोई स्वचालित उत्तर नहीं।",
      "कोई मार्केटिंग नहीं।"
    ]
  },

  closing: {
    body: [
      "m-pathy दिखाता है कि क्या संभव है।",
      "MAIOS इसे हर जगह संभव बनाता है।"
    ]
  }
}

};
