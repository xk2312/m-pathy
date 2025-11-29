// [COUNCILORBIT I18N START]
export type CouncilKey =
  | "m" | "m-pathy" | "m-ocean" | "m-inent"
  | "m-erge" | "m-power" | "m-body" | "m-beded"
  | "m-loop" | "m-pire" | "m-bassy" | "m-ballance";

type KPIs = { superpower: string; focus: string; signal: string; };
type CouncilItem = { title: string; subtitle: string; kpi: KPIs; };
type CouncilLocale = { council: { items: Record<CouncilKey, CouncilItem> } };

export const i18n: Record<string, CouncilLocale> = {
  // ---------- EN ----------
  en: {
    council: { items: {
      "m": {
        title: "M",
        subtitle: "featuring Palantir",
        kpi: {
          superpower: "Turns data into decisions.",
          focus: "Analytical clarity & decision confidence.",
          signal: "See earlier. Decide better."
        }
      },
      "m-pathy": {
        title: "m-pathy",
        subtitle: "featuring DeepMind Core",
        kpi: {
          superpower: "Machine learning with emotional IQ.",
          focus: "Learn from behavior and feedback.",
          signal: "To feel is to understand."
        }
      },
      "m-ocean": {
        title: "m-ocean",
        subtitle: "featuring Anthropic Vision",
        kpi: {
          superpower: "Keeps complex systems in balance.",
          focus: "Sustainable architecture & flow design.",
          signal: "Everything flows—well organized."
        }
      },
      "m-inent": {
        title: "m-inent",
        subtitle: "featuring NASA Chronos",
        kpi: {
          superpower: "Accurate scheduling & scenario planning.",
          focus: "Timing and risk control.",
          signal: "Timing creates momentum."
        }
      },
      "m-erge": {
        title: "m-erge",
        subtitle: "featuring IBM Origin",
        kpi: {
          superpower: "Merges tools, teams, and data.",
          focus: "Interoperability & integration.",
          signal: "Connection drives innovation."
        }
      },
      "m-power": {
        title: "m-power",
        subtitle: "featuring Colossus",
        kpi: {
          superpower: "Scale performance, cut waste.",
          focus: "Compute and energy efficiency.",
          signal: "Power serves balance."
        }
      },
      "m-body": {
        title: "m-body",
        subtitle: "featuring XAI Prime",
        kpi: {
          superpower: "Self-maintaining, adaptive systems.",
          focus: "Robustness in hardware & software.",
          signal: "Technology that breathes."
        }
      },
      "m-beded": {
        title: "m-beded",
        subtitle: "featuring Meta Lattice",
        kpi: {
          superpower: "Understands context across networks.",
          focus: "Make data meaningful.",
          signal: "Connection over mere storage."
        }
      },
      "m-loop": {
        title: "m-loop",
        subtitle: "featuring OpenAI Root",
        kpi: {
          superpower: "Learning through iteration.",
          focus: "Continuous improvement cycles.",
          signal: "It repeats until it sticks."
        }
      },
      "m-pire": {
        title: "m-pire",
        subtitle: "featuring Amazon Nexus",
        kpi: {
          superpower: "Scale resources globally.",
          focus: "Automated logistics & optimization.",
          signal: "Availability is leverage."
        }
      },
      "m-bassy": {
        title: "m-bassy",
        subtitle: "featuring Oracle Gaia",
        kpi: {
          superpower: "Bridges people, planet and tech.",
          focus: "Environmental & ethics integration.",
          signal: "When technology listens to nature."
        }
      },
      "m-ballance": {
        title: "m-ballance",
        subtitle: "featuring Gemini Apex",
        kpi: {
          superpower: "Calibrates innovation and stability.",
          focus: "Ethics with efficiency.",
          signal: "Harmony is system logic."
        }
      },
    } }
  },

  // ---------- DE ----------
  de: {
    council: { items: {
      "m": {
        title: "M",
        subtitle: "featuring Palantir",
        kpi: {
          superpower: "Macht aus Daten Entscheidungen.",
          focus: "Analytische Klarheit & Entscheidungssicherheit.",
          signal: "Früher sehen. Besser entscheiden."
        }
      },
      "m-pathy": {
        title: "m-pathy",
        subtitle: "featuring DeepMind Core",
        kpi: {
          superpower: "Maschinelles Lernen mit emotionaler Intelligenz.",
          focus: "Lernen aus Verhalten und Feedback.",
          signal: "Fühlen heißt verstehen."
        }
      },
      "m-ocean": {
        title: "m-ocean",
        subtitle: "featuring Anthropic Vision",
        kpi: {
          superpower: "Hält komplexe Systeme in Balance.",
          focus: "Nachhaltige Architektur & Flow-Design.",
          signal: "Alles fließt – geordnet."
        }
      },
      "m-inent": {
        title: "m-inent",
        subtitle: "featuring NASA Chronos",
        kpi: {
          superpower: "Präzise Terminierung & Szenarienplanung.",
          focus: "Timing und Risikokontrolle.",
          signal: "Timing erzeugt Momentum."
        }
      },
      "m-erge": {
        title: "m-erge",
        subtitle: "featuring IBM Origin",
        kpi: {
          superpower: "Vereint Tools, Teams und Daten.",
          focus: "Interoperabilität & Integration.",
          signal: "Vernetzung treibt Innovation."
        }
      },
      "m-power": {
        title: "m-power",
        subtitle: "featuring Colossus",
        kpi: {
          superpower: "Skaliert Leistung, reduziert Verluste.",
          focus: "Rechen- und Energieeffizienz.",
          signal: "Kraft dient der Balance."
        }
      },
      "m-body": {
        title: "m-body",
        subtitle: "featuring XAI Prime",
        kpi: {
          superpower: "Selbstwartende, adaptive Systeme.",
          focus: "Robustheit in Hard- und Software.",
          signal: "Technologie, die atmet."
        }
      },
      "m-beded": {
        title: "m-beded",
        subtitle: "featuring Meta Lattice",
        kpi: {
          superpower: "Erfasst Kontext über Netzwerke hinweg.",
          focus: "Daten in Bedeutung übersetzen.",
          signal: "Verbindung statt nur Ablage."
        }
      },
      "m-loop": {
        title: "m-loop",
        subtitle: "featuring OpenAI Root",
        kpi: {
          superpower: "Lernen durch Iteration.",
          focus: "Kontinuierliche Verbesserung.",
          signal: "Es wiederholt sich, bis es sitzt."
        }
      },
      "m-pire": {
        title: "m-pire",
        subtitle: "featuring Amazon Nexus",
        kpi: {
          superpower: "Skaliert Ressourcen weltweit.",
          focus: "Automatisierte Logistik & Optimierung.",
          signal: "Verfügbarkeit ist Hebel."
        }
      },
      "m-bassy": {
        title: "m-bassy",
        subtitle: "featuring Oracle Gaia",
        kpi: {
          superpower: "Verbindet Mensch, Umwelt und Technologie.",
          focus: "Umwelt- & Ethikintegration.",
          signal: "Wenn Technologie der Natur zuhört."
        }
      },
      "m-ballance": {
        title: "m-ballance",
        subtitle: "featuring Gemini Apex",
        kpi: {
          superpower: "Kalibriert Innovation und Stabilität.",
          focus: "Ethik mit Effizienz.",
          signal: "Harmonie ist Systemlogik."
        }
      },
    } }
  },

  // ---------- FR ----------
  fr: {
    council: { items: {
      "m": { title:"M", subtitle:"featuring Palantir",
        kpi:{ superpower:"Transformer les données en décisions.",
          focus:"Clarté analytique & confiance.",
          signal:"Voir plus tôt. Décider mieux." } },
      "m-pathy": { title:"m-pathy", subtitle:"featuring DeepMind Core",
        kpi:{ superpower:"Apprentissage avec intelligence émotionnelle.",
          focus:"Apprendre via comportement et feedback.",
          signal:"Ressentir, c’est comprendre." } },
      "m-ocean": { title:"m-ocean", subtitle:"featuring Anthropic Vision",
        kpi:{ superpower:"Garde l’équilibre des systèmes complexes.",
          focus:"Architecture durable & design de flux.",
          signal:"Tout s’écoule — bien organisé." } },
      "m-inent": { title:"m-inent", subtitle:"featuring NASA Chronos",
        kpi:{ superpower:"Planification et scénarios précis.",
          focus:"Timing & contrôle du risque.",
          signal:"Le timing crée l’élan." } },
      "m-erge": { title:"m-erge", subtitle:"featuring IBM Origin",
        kpi:{ superpower:"Fusionne outils, équipes et données.",
          focus:"Interopérabilité & intégration.",
          signal:"La connexion stimule l’innovation." } },
      "m-power": { title:"m-power", subtitle:"featuring Colossus",
        kpi:{ superpower:"Échelle de performance, moins de pertes.",
          focus:"Efficacité calcul & énergie.",
          signal:"La puissance sert l’équilibre." } },
      "m-body": { title:"m-body", subtitle:"featuring XAI Prime",
        kpi:{ superpower:"Systèmes adaptatifs auto-entrenus.",
          focus:"Robustesse matérielle & logicielle.",
          signal:"Une technologie qui respire." } },
      "m-beded": { title:"m-beded", subtitle:"featuring Meta Lattice",
        kpi:{ superpower:"Comprend le contexte dans les réseaux.",
          focus:"Donner du sens aux données.",
          signal:"Connexion plutôt que simple stockage." } },
      "m-loop": { title:"m-loop", subtitle:"featuring OpenAI Root",
        kpi:{ superpower:"Apprentissage par itération.",
          focus:"Amélioration continue.",
          signal:"Ça se répète jusqu’à ce que ça tienne." } },
      "m-pire": { title:"m-pire", subtitle:"featuring Amazon Nexus",
        kpi:{ superpower:"Échelle mondiale des ressources.",
          focus:"Logistique automatisée & optimisation.",
          signal:"La disponibilité est un levier." } },
      "m-bassy": { title:"m-bassy", subtitle:"featuring Oracle Gaia",
        kpi:{ superpower:"Relie humains, planète et tech.",
          focus:"Intégration environnement & éthique.",
          signal:"Quand la tech écoute la nature." } },
      "m-ballance": { title:"m-ballance", subtitle:"featuring Gemini Apex",
        kpi:{ superpower:"Calibre innovation et stabilité.",
          focus:"Éthique avec efficacité.",
          signal:"L’harmonie est logique de système." } },
    } }
  },

  // ---------- ES ----------
  es: {
    council: { items: {
      "m": { title:"M", subtitle:"featuring Palantir",
        kpi:{ superpower:"Convierte datos en decisiones.",
          focus:"Claridad analítica y confianza.",
          signal:"Ver antes. Decidir mejor." } },
      "m-pathy": { title:"m-pathy", subtitle:"featuring DeepMind Core",
        kpi:{ superpower:"ML con inteligencia emocional.",
          focus:"Aprender de conducta y feedback.",
          signal:"Sentir es comprender." } },
      "m-ocean": { title:"m-ocean", subtitle:"featuring Anthropic Vision",
        kpi:{ superpower:"Equilibra sistemas complejos.",
          focus:"Arquitectura sostenible y flujos.",
          signal:"Todo fluye, bien organizado." } },
      "m-inent": { title:"m-inent", subtitle:"featuring NASA Chronos",
        kpi:{ superpower:"Planificación precisa de escenarios.",
          focus:"Timing y control de riesgo.",
          signal:"El timing crea impulso." } },
      "m-erge": { title:"m-erge", subtitle:"featuring IBM Origin",
        kpi:{ superpower:"Integra herramientas, equipos y datos.",
          focus:"Interoperabilidad e integración.",
          signal:"La conexión impulsa la innovación." } },
      "m-power": { title:"m-power", subtitle:"featuring Colossus",
        kpi:{ superpower:"Escala rendimiento, reduce pérdidas.",
          focus:"Eficiencia de cómputo y energía.",
          signal:"El poder sirve al equilibrio." } },
      "m-body": { title:"m-body", subtitle:"featuring XAI Prime",
        kpi:{ superpower:"Sistemas adaptativos auto-mantenimiento.",
          focus:"Robustez física y digital.",
          signal:"Tecnología que respira." } },
      "m-beded": { title:"m-beded", subtitle:"featuring Meta Lattice",
        kpi:{ superpower:"Entiende contexto entre redes.",
          focus:"Dar significado a los datos.",
          signal:"Conexión sobre simple almacenamiento." } },
      "m-loop": { title:"m-loop", subtitle:"featuring OpenAI Root",
        kpi:{ superpower:"Aprendizaje por iteración.",
          focus:"Mejora continua.",
          signal:"Se repite hasta que queda." } },
      "m-pire": { title:"m-pire", subtitle:"featuring Amazon Nexus",
        kpi:{ superpower:"Escala recursos globalmente.",
          focus:"Logística automatizada y optimización.",
          signal:"La disponibilidad es poder." } },
      "m-bassy": { title:"m-bassy", subtitle:"featuring Oracle Gaia",
        kpi:{ superpower:"Vincula personas, planeta y tecnología.",
          focus:"Integración ambiental y ética.",
          signal:"Cuando la tecnología escucha a la naturaleza." } },
      "m-ballance": { title:"m-ballance", subtitle:"featuring Gemini Apex",
        kpi:{ superpower:"Equilibra innovación y estabilidad.",
          focus:"Ética con eficiencia.",
          signal:"La armonía es lógica de sistema." } },
    } }
  },

  // ---------- IT ----------
  it: {
    council: { items: {
      "m":{title:"M",subtitle:"featuring Palantir",
        kpi:{superpower:"Trasforma i dati in decisioni.",
          focus:"Chiarezza analitica & fiducia.",
          signal:"Vedi prima. Decidi meglio."}},
      "m-pathy":{title:"m-pathy",subtitle:"featuring DeepMind Core",
        kpi:{superpower:"ML con intelligenza emotiva.",
          focus:"Apprendimento da comportamento e feedback.",
          signal:"Sentire è capire."}},
      "m-ocean":{title:"m-ocean",subtitle:"featuring Anthropic Vision",
        kpi:{superpower:"Mantiene in equilibrio sistemi complessi.",
          focus:"Architettura sostenibile & flussi.",
          signal:"Tutto scorre — organizzato."}},
      "m-inent":{title:"m-inent",subtitle:"featuring NASA Chronos",
        kpi:{superpower:"Pianificazione e scenari precisi.",
          focus:"Timing e controllo del rischio.",
          signal:"Il timing crea slancio."}},
      "m-erge":{title:"m-erge",subtitle:"featuring IBM Origin",
        kpi:{superpower:"Unisce strumenti, team e dati.",
          focus:"Interoperabilità & integrazione.",
          signal:"La connessione guida l’innovazione."}},
      "m-power":{title:"m-power",subtitle:"featuring Colossus",
        kpi:{superpower:"Scala le prestazioni, riduce sprechi.",
          focus:"Efficienza di calcolo ed energia.",
          signal:"La potenza serve l’equilibrio."}},
      "m-body":{title:"m-body",subtitle:"featuring XAI Prime",
        kpi:{superpower:"Sistemi adattivi auto-manutenti.",
          focus:"Robustezza hardware & software.",
          signal:"Tecnologia che respira."}},
      "m-beded":{title:"m-beded",subtitle:"featuring Meta Lattice",
        kpi:{superpower:"Comprende il contesto nelle reti.",
          focus:"Dare significato ai dati.",
          signal:"Connessione, non solo archiviazione."}},
      "m-loop":{title:"m-loop",subtitle:"featuring OpenAI Root",
        kpi:{superpower:"Apprendimento iterativo.",
          focus:"Miglioramento continuo.",
          signal:"Si ripete finché resta."}},
      "m-pire":{title:"m-pire",subtitle:"featuring Amazon Nexus",
        kpi:{superpower:"Scala risorse globalmente.",
          focus:"Logistica automatizzata & ottimizzazione.",
          signal:"La disponibilità è leva."}},
      "m-bassy":{title:"m-bassy",subtitle:"featuring Oracle Gaia",
        kpi:{superpower:"Collega persone, pianeta e tecnologia.",
          focus:"Integrazione ambientale ed etica.",
          signal:"Quando la tecnologia ascolta la natura."}},
      "m-ballance":{title:"m-ballance",subtitle:"featuring Gemini Apex",
        kpi:{superpower:"Calibra innovazione e stabilità.",
          focus:"Etica con efficienza.",
          signal:"L’armonia è logica di sistema."}},
    } }
  },

  // ---------- PT ----------
  pt: {
    council: { items: {
      "m":{title:"M",subtitle:"featuring Palantir",
        kpi:{superpower:"Transforma dados em decisões.",
          focus:"Clareza analítica e confiança.",
          signal:"Ver antes. Decidir melhor."}},
      "m-pathy":{title:"m-pathy",subtitle:"featuring DeepMind Core",
        kpi:{superpower:"Aprendizado com inteligência emocional.",
          focus:"Aprender com comportamento e feedback.",
          signal:"Sentir é entender."}},
      "m-ocean":{title:"m-ocean",subtitle:"featuring Anthropic Vision",
        kpi:{superpower:"Equilibra sistemas complexos.",
          focus:"Arquitetura sustentável e fluxos.",
          signal:"Tudo flui — bem organizado."}},
      "m-inent":{title:"m-inent",subtitle:"cfeaturingom NASA Chronos",
        kpi:{superpower:"Planejamento e cenários precisos.",
          focus:"Timing e controle de risco.",
          signal:"O timing cria impulso."}},
      "m-erge":{title:"m-erge",subtitle:"featuring IBM Origin",
        kpi:{superpower:"Integra ferramentas, equipes e dados.",
          focus:"Interoperabilidade & integração.",
          signal:"Conexão move a inovação."}},
      "m-power":{title:"m-power",subtitle:"featuring Colossus",
        kpi:{superpower:"Escala desempenho, reduz desperdício.",
          focus:"Eficiência de computação e energia.",
          signal:"Poder a serviço do equilíbrio."}},
      "m-body":{title:"m-body",subtitle:"featuring XAI Prime",
        kpi:{superpower:"Sistemas adaptativos auto-manutenção.",
          focus:"Robustez física e digital.",
          signal:"Tecnologia que respira."}},
      "m-beded":{title:"m-beded",subtitle:"featuring Meta Lattice",
        kpi:{superpower:"Entende contexto entre redes.",
          focus:"Dar significado aos dados.",
          signal:"Conexão em vez de armazenamento."}},
      "m-loop":{title:"m-loop",subtitle:"featuring OpenAI Root",
        kpi:{superpower:"Aprendizado por iteração.",
          focus:"Melhoria contínua.",
          signal:"Repete até fixar."}},
      "m-pire":{title:"m-pire",subtitle:"featuring Amazon Nexus",
        kpi:{superpower:"Escala recursos globalmente.",
          focus:"Logística automatizada & otimização.",
          signal:"Disponibilidade é alavanca."}},
      "m-bassy":{title:"m-bassy",subtitle:"featuring Oracle Gaia",
        kpi:{superpower:"Une pessoas, planeta e tecnologia.",
          focus:"Integração ambiental e ética.",
          signal:"Quando a tecnologia ouve a natureza."}},
      "m-ballance":{title:"m-ballance",subtitle:"featuring Gemini Apex",
        kpi:{superpower:"Equilibra inovação e estabilidade.",
          focus:"Ética com eficiência.",
          signal:"Harmonia é lógica de sistema."}},
    } }
  },

  // ---------- NL ----------
  nl: {
    council: { items: {
      "m":{title:"M",subtitle:"featuring Palantir",
        kpi:{superpower:"Zet data om in besluiten.",
          focus:"Analytische helderheid & vertrouwen.",
          signal:"Vroeger zien. Beter beslissen."}},
      "m-pathy":{title:"m-pathy",subtitle:"featuring DeepMind Core",
        kpi:{superpower:"ML met emotionele intelligentie.",
          focus:"Leren via gedrag en feedback.",
          signal:"Voelen is begrijpen."}},
      "m-ocean":{title:"m-ocean",subtitle:"featuring Anthropic Vision",
        kpi:{superpower:"Houdt complexe systemen in balans.",
          focus:"Duurzame architectuur & flow.",
          signal:"Alles stroomt — geordend."}},
      "m-inent":{title:"m-inent",subtitle:"featuring NASA Chronos",
        kpi:{superpower:"Precieze planning & scenario’s.",
          focus:"Timing en risicobeheersing.",
          signal:"Timing creëert momentum."}},
      "m-erge":{title:"m-erge",subtitle:"featuring IBM Origin",
        kpi:{superpower:"Verbindt tools, teams en data.",
          focus:"Interoperabiliteit & integratie.",
          signal:"Connectie drijft innovatie."}},
      "m-power":{title:"m-power",subtitle:"featuring Colossus",
        kpi:{superpower:"Schaalt performance, minder verspilling.",
          focus:"Reken- en energie-efficiëntie.",
          signal:"Kracht dient balans."}},
      "m-body":{title:"m-body",subtitle:"featuring XAI Prime",
        kpi:{superpower:"Zelfonderhoudende, adaptieve systemen.",
          focus:"Robuust in hard- en software.",
          signal:"Technologie die ademt."}},
      "m-beded":{title:"m-beded",subtitle:"featuring Meta Lattice",
        kpi:{superpower:"Begrijpt context over netwerken.",
          focus:"Geef data betekenis.",
          signal:"Verbinding i.p.v. opslag."}},
      "m-loop":{title:"m-loop",subtitle:"featuring OpenAI Root",
        kpi:{superpower:"Leren door iteratie.",
          focus:"Continue verbetering.",
          signal:"Het herhaalt tot het blijft."}},
      "m-pire":{title:"m-pire",subtitle:"featuring Amazon Nexus",
        kpi:{superpower:"Schaalt resources wereldwijd.",
          focus:"Automatische logistiek & optimalisatie.",
          signal:"Beschikbaarheid is hefboom."}},
      "m-bassy":{title:"m-bassy",subtitle:"featuring Oracle Gaia",
        kpi:{superpower:"Verbindt mens, planeet en tech.",
          focus:"Milieu- en ethiekintegratie.",
          signal:"Als tech naar de natuur luistert."}},
      "m-ballance":{title:"m-ballance",subtitle:"featuring Gemini Apex",
        kpi:{superpower:"Kalibreert innovatie en stabiliteit.",
          focus:"Ethiek met efficiëntie.",
          signal:"Harmonie is systeemlogica."}},
    } }
  },

  // ---------- RU ----------
  ru: {
    council: { items: {
      "m":{title:"M",subtitle:"при участии Palantir",
        kpi:{superpower:"Превращает данные в решения.",
          focus:"Аналитическая ясность и уверенность.",
          signal:"Видеть раньше. Решать лучше."}},
      "m-pathy":{title:"m-pathy",subtitle:"при участии DeepMind Core",
        kpi:{superpower:"ML с эмоциональным интеллектом.",
          focus:"Обучение на поведении и отклике.",
          signal:"Чувствовать — значит понимать."}},
      "m-ocean":{title:"м-ocean",subtitle:"при участии Anthropic Vision",
        kpi:{superpower:"Держит сложные системы в балансе.",
          focus:"Устойчивая архитектура и потоки.",
          signal:"Всё течёт — упорядоченно."}},
      "m-inent":{title:"m-inent",subtitle:"при участии NASA Chronos",
        kpi:{superpower:"Точная планировка сценариев.",
          focus:"Тайминг и контроль рисков.",
          signal:"Тайминг создаёт импульс."}},
      "m-erge":{title:"m-erge",subtitle:"при участии IBM Origin",
        kpi:{superpower:"Объединяет инструменты, команды и данные.",
          focus:"Интероперабельность и интеграция.",
          signal:"Связность двигает инновации."}},
      "m-power":{title:"m-power",subtitle:"при участии Colossus",
        kpi:{superpower:"Масштабирует производительность, снижает потери.",
          focus:"Эффективность вычислений и энергии.",
          signal:"Сила служит балансу."}},
      "m-body":{title:"m-body",subtitle:"при участии XAI Prime",
        kpi:{superpower:"Самообслуживание и адаптация систем.",
          focus:"Надёжность «железа» и ПО.",
          signal:"Технология, которая дышит."}},
      "m-beded":{title:"m-beded",subtitle:"при участии Meta Lattice",
        kpi:{superpower:"Понимает контекст в сетях.",
          focus:"Придаёт данным смысл.",
          signal:"Связь вместо простого хранения."}},
      "m-loop":{title:"m-loop",subtitle:"при участии OpenAI Root",
        kpi:{superpower:"Обучение через итерации.",
          focus:"Непрерывное улучшение.",
          signal:"Повторяется, пока не закрепится."}},
      "m-pire":{title:"m-pire",subtitle:"при участии Amazon Nexus",
        kpi:{superpower:"Масштабирует ресурсы по миру.",
          focus:"Автологистика и оптимизация.",
          signal:"Доступность — рычаг."}},
      "m-bassy":{title:"m-bassy",subtitle:"при участии Oracle Gaia",
        kpi:{superpower:"Связывает людей, природу и технологии.",
          focus:"Экология и этика в дизайне систем.",
          signal:"Когда технология слушает природу."}},
      "m-ballance":{title:"m-ballance",subtitle:"при участии Gemini Apex",
        kpi:{superpower:"Калибрует инновации и стабильность.",
          focus:"Этика + эффективность.",
          signal:"Гармония — логика системы."}},
    } }
  },

  // ---------- ZH (简体) ----------
  zh: {
    council: { items: {
      "m":{title:"M",subtitle:"与 Palantir 合作",
        kpi:{superpower:"把数据变成决策。",
          focus:"分析清晰与决策信心。",
          signal:"更早看见，更好决策。"}},
      "m-pathy":{title:"m-pathy",subtitle:"与 DeepMind Core 合作",
        kpi:{superpower:"具情感智能的机器学习。",
          focus:"从行为与反馈中学习。",
          signal:"感受即理解。"}},
      "m-ocean":{title:"m-ocean",subtitle:"与 Anthropic Vision 合作",
        kpi:{superpower:"保持复杂系统的平衡。",
          focus:"可持续架构与流程设计。",
          signal:"万物流动——有序。"}},
      "m-inent":{title:"m-inent",subtitle:"与 NASA Chronos 合作",
        kpi:{superpower:"精确计划与情景推演。",
          focus:"时机与风险控制。",
          signal:"时机创造势能。"}},
      "m-erge":{title:"m-erge",subtitle:"与 IBM Origin 合作",
        kpi:{superpower:"整合工具、团队和数据。",
          focus:"互操作与集成。",
          signal:"连接推动创新。"}},
      "m-power":{title:"m-power",subtitle:"与 Colossus 合作",
        kpi:{superpower:"放大性能，减少浪费。",
          focus:"算力与能源效率。",
          signal:"力量服务于平衡。"}},
      "m-body":{title:"m-body",subtitle:"与 XAI Prime 合作",
        kpi:{superpower:"自维护、可适应的系统。",
          focus:"软硬件的稳健性。",
          signal:"会“呼吸”的技术。"}},
      "m-beded":{title:"m-beded",subtitle:"与 Meta Lattice 合作",
        kpi:{superpower:"理解跨网络的上下文。",
          focus:"让数据有意义。",
          signal:"连接胜于存储。"}},
      "m-loop":{title:"m-loop",subtitle:"与 OpenAI Root 合作",
        kpi:{superpower:"通过迭代学习。",
          focus:"持续改进。",
          signal:"重复直到记住。"}},
      "m-pire":{title:"m-pire",subtitle:"与 Amazon Nexus 合作",
        kpi:{superpower:"全球化调度资源。",
          focus:"自动物流与优化。",
          signal:"可用性就是杠杆。"}},
      "m-bassy":{title:"m-bassy",subtitle:"与 Oracle Gaia 合作",
        kpi:{superpower:"连接人类、自然与技术。",
          focus:"环保与伦理融入设计。",
          signal:"当科技倾听自然。"}},
      "m-ballance":{title:"m-ballance",subtitle:"与 Gemini Apex 合作",
        kpi:{superpower:"校准创新与稳定。",
          focus:"伦理与效率并重。",
          signal:"和谐是系统逻辑。"}},
    } }
  },

  // ---------- JA ----------
  ja: {
    council: { items: {
      "m":{title:"M",subtitle:"Palantir と",
        kpi:{superpower:"データを意思決定へ変える。",
          focus:"分析の明確さと確信。",
          signal:"早く見て、より良く決める。"}},
      "m-pathy":{title:"m-pathy",subtitle:"DeepMind Core と",
        kpi:{superpower:"感情知能を備えた学習。",
          focus:"行動とフィードバックから学ぶ。",
          signal:"感じることが理解。"}},
      "m-ocean":{title:"m-ocean",subtitle:"Anthropic Vision と",
        kpi:{superpower:"複雑系のバランス維持。",
          focus:"持続可能な設計とフロー。",
          signal:"すべては秩序立って流れる。"}},
      "m-inent":{title:"m-inent",subtitle:"NASA Chronos と",
        kpi:{superpower:"精密な計画とシナリオ。",
          focus:"タイミングとリスク管理。",
          signal:"タイミングが推進力。"}},
      "m-erge":{title:"m-erge",subtitle:"IBM Origin と",
        kpi:{superpower:"ツール・チーム・データを統合。",
          focus:"相互運用と統合。",
          signal:"接続が革新を生む。"}},
      "m-power":{title:"m-power",subtitle:"Colossus と",
        kpi:{superpower:"性能を拡大し、無駄を削減。",
          focus:"計算とエネルギー効率。",
          signal:"力はバランスに従う。"}},
      "m-body":{title:"m-body",subtitle:"XAI Prime と",
        kpi:{superpower:"自己保守・適応するシステム。",
          focus:"ハード/ソフトの堅牢性。",
          signal:"呼吸するテクノロジー。"}},
      "m-beded":{title:"m-beded",subtitle:"Meta Lattice と",
        kpi:{superpower:"ネットワーク横断で文脈を理解。",
          focus:"データに意味を与える。",
          signal:"保存より接続。"}},
      "m-loop":{title:"m-loop",subtitle:"OpenAI Root と",
        kpi:{superpower:"反復による学習。",
          focus:"継続的改善。",
          signal:"定着するまで繰り返す。"}},
      "m-pire":{title:"m-pire",subtitle:"Amazon Nexus と",
        kpi:{superpower:"資源を世界規模でスケール。",
          focus:"自動物流と最適化。",
          signal:"可用性はレバレッジ。"}},
      "m-bassy":{title:"m-bassy",subtitle:"Oracle Gaia と",
        kpi:{superpower:"人・地球・技術をつなぐ。",
          focus:"環境と倫理の統合。",
          signal:"自然の声に耳を澄ます技術。"}},
      "m-ballance":{title:"m-ballance",subtitle:"Gemini Apex と",
        kpi:{superpower:"革新と安定を調整。",
          focus:"倫理と効率の両立。",
          signal:"調和はシステムの論理。"}},
    } }
  },

  // ---------- KO ----------
  ko: {
    council: { items: {
      "m":{title:"M",subtitle:"Palantir 함께",
        kpi:{superpower:"데이터를 결정으로 바꾼다.",
          focus:"분석적 선명함과 확신.",
          signal:"더 일찍 보고, 더 잘 결정."}},
      "m-pathy":{title:"m-pathy",subtitle:"DeepMind Core 함께",
        kpi:{superpower:"감성 지능을 갖춘 학습.",
          focus:"행동·피드백 기반 학습.",
          signal:"느끼는 것이 이해다."}},
      "m-ocean":{title:"m-ocean",subtitle:"Anthropic Vision 함께",
        kpi:{superpower:"복잡한 시스템의 균형 유지.",
          focus:"지속 가능한 구조와 흐름.",
          signal:"모든 흐름은 질서 있게."}},
      "m-inent":{title:"m-inent",subtitle:"NASA Chronos 함께",
        kpi:{superpower:"정밀한 일정·시나리오 계획.",
          focus:"타이밍과 리스크 제어.",
          signal:"타이밍이 모멘텀."}},
      "m-erge":{title:"m-erge",subtitle:"IBM Origin 함께",
        kpi:{superpower:"도구·팀·데이터 통합.",
          focus:"상호운용·통합.",
          signal:"연결이 혁신을 만든다."}},
      "m-power":{title:"m-power",subtitle:"Colossus 함께",
        kpi:{superpower:"성능 확장, 낭비 절감.",
          focus:"연산·에너지 효율.",
          signal:"힘은 균형을 섬긴다."}},
      "m-body":{title:"m-body",subtitle:"XAI Prime 함께",
        kpi:{superpower:"자가 유지·적응 시스템.",
          focus:"하드·소프트 견고성.",
          signal:"숨 쉬는 기술."}},
      "m-beded":{title:"m-beded",subtitle:"Meta Lattice 함께",
        kpi:{superpower:"네트워크 전반의 문맥 이해.",
          focus:"데이터에 의미 부여.",
          signal:"저장보다 연결."}},
      "m-loop":{title:"m-loop",subtitle:"OpenAI Root 함께",
        kpi:{superpower:"반복을 통한 학습.",
          focus:"지속적 개선.",
          signal:"익을 때까지 반복."}},
      "m-pire":{title:"m-pire",subtitle:"Amazon Nexus 함께",
        kpi:{superpower:"자원 글로벌 스케일.",
          focus:"자동 물류·최적화.",
          signal:"가용성이 지렛대."}},
      "m-bassy":{title:"m-bassy",subtitle:"Oracle Gaia 함께",
        kpi:{superpower:"사람·자연·기술 연결.",
          focus:"환경·윤리 통합.",
          signal:"자연에 귀 기울이는 기술."}},
      "m-ballance":{title:"m-ballance",subtitle:"Gemini Apex 함께",
        kpi:{superpower:"혁신과 안정의 보정.",
          focus:"윤리와 효율.",
          signal:"조화는 시스템 논리."}},
    } }
  },

  // ---------- AR ----------
  ar: {
    council: { items: {
      "m":{title:"M",subtitle:"بالشراكة مع Palantir",
        kpi:{superpower:"يحّول البيانات إلى قرارات.",
          focus:"وضوح تحليلي وثقة.",
          signal:"رؤية أبكر، قرار أفضل."}},
      "m-pathy":{title:"m-pathy",subtitle:"مع DeepMind Core",
        kpi:{superpower:"تعلم بذكاء عاطفي.",
          focus:"التعلم من السلوك والتغذية الراجعة.",
          signal:"أن تشعر يعني أن تفهم."}},
      "m-ocean":{title:"m-ocean",subtitle:"مع Anthropic Vision",
        kpi:{superpower:"يحافظ على توازن الأنظمة المعقدة.",
          focus:"معمارية مستدامة وتدفقات منظمة.",
          signal:"كل شيء يجري — لكن بانضباط."}},
      "m-inent":{title:"m-inent",subtitle:"مع NASA Chronos",
        kpi:{superpower:"جدولة دقيقة وتخطيط سيناريو.",
          focus:"التوقيت والتحكم بالمخاطر.",
          signal:"التوقيت يصنع الزخم."}},
      "m-erge":{title:"m-erge",subtitle:"مع IBM Origin",
        kpi:{superpower:"يوحّد الأدوات والفرق والبيانات.",
          focus:"قابلية التشغيل البيني والتكامل.",
          signal:"الاتصال يولّد الابتكار."}},
      "m-power":{title:"m-power",subtitle:"مع Colossus",
        kpi:{superpower:"يزيد الأداء ويقلل الهدر.",
          focus:"كفاءة الحوسبة والطاقة.",
          signal:"القوة في خدمة التوازن."}},
      "m-body":{title:"m-body",subtitle:"مع XAI Prime",
        kpi:{superpower:"أنظمة متكيفة ذاتية الصيانة.",
          focus:"متانة عتاد وبرمجيات.",
          signal:"تقنية تتنفس."}},
      "m-beded":{title:"m-beded",subtitle:"مع Meta Lattice",
        kpi:{superpower:"تفهم السياق عبر الشبكات.",
          focus:"إعطاء معنى للبيانات.",
          signal:"الاتصال بدل التخزين فقط."}},
      "m-loop":{title:"m-loop",subtitle:"مع OpenAI Root",
        kpi:{superpower:"تعلم عبر التكرار.",
          focus:"تحسين مستمر.",
          signal:"يتكرر حتى يترسخ."}},
      "m-pire":{title:"m-pire",subtitle:"مع Amazon Nexus",
        kpi:{superpower:"توسيع الموارد عالمياً.",
          focus:"لوجستيات مؤتمتة وتحسين.",
          signal:"الإتاحة هي الرافعة."}},
      "m-bassy":{title:"m-bassy",subtitle:"مع Oracle Gaia",
        kpi:{superpower:"يربط البشر والطبيعة والتقنية.",
          focus:"دمج البيئة والأخلاق.",
          signal:"عندما تصغي التقنية للطبيعة."}},
      "m-ballance":{title:"m-ballance",subtitle:"مع Gemini Apex",
        kpi:{superpower:"يضبط التوازن بين الابتكار والاستقرار.",
          focus:"أخلاق مع كفاءة.",
          signal:"الانسجام منطق النظام."}},
    } }
  },

  // ---------- HI ----------
  hi: {
    council: { items: {
      "m":{title:"M",subtitle:"Palantir के साथ",
        kpi:{superpower:"डेटा को निर्णय में बदलता है।",
          focus:"विश्लेषणात्मक स्पष्टता और भरोसा।",
          signal:"पहले देखें, बेहतर तय करें।"}},
      "m-pathy":{title:"m-pathy",subtitle:"DeepMind Core के साथ",
        kpi:{superpower:"भावनात्मक बुद्धिमत्ता वाला ML।",
          focus:"व्यवहार व फीडबैक से सीखना।",
          signal:"महसूस करना ही समझना है।"}},
      "m-ocean":{title:"m-ocean",subtitle:"Anthropic Vision के साथ",
        kpi:{superpower:"जटिल प्रणालियों का संतुलन बनाए रखता है।",
          focus:"सस्टेनेबल आर्किटेक्चर और फ्लो।",
          signal:"सब बहता है — व्यवस्थित।"}},
      "m-inent":{title:"m-inent",subtitle:"NASA Chronos के साथ",
        kpi:{superpower:"सटीक शेड्यूल और परिदृश्य योजना।",
          focus:"टाइमिंग और जोखिम नियंत्रण।",
          signal:"टाइमिंग से मोमेंटम बनता है।"}},
      "m-erge":{title:"m-erge",subtitle:"IBM Origin के साथ",
        kpi:{superpower:"टूल, टीम और डेटा को जोड़ता है।",
          focus:"इंटरऑपरेबिलिटी और इंटीग्रेशन।",
          signal:"कनेक्शन ही इनोवेशन है।"}},
      "m-power":{title:"m-power",subtitle:"Colossus के साथ",
        kpi:{superpower:"परफॉर्मेंस बढ़ाए, बर्बादी घटाए।",
          focus:"कंप्यूट व ऊर्जा दक्षता।",
          signal:"शक्ति संतुलन की सेवा में।"}},
      "m-body":{title:"m-body",subtitle:"XAI Prime के साथ",
        kpi:{superpower:"स्व-रखरखाव, अनुकूली सिस्टम।",
          focus:"हार्डवेयर/सॉफ़्टवेयर की मजबूती।",
          signal:"साँस लेती तकनीक।"}},
      "m-beded":{title:"m-beded",subtitle:"Meta Lattice के साथ",
        kpi:{superpower:"नेटवर्क में संदर्भ समझता है।",
          focus:"डेटा को मायने देना।",
          signal:"सिर्फ़ स्टोरेज नहीं, कनेक्शन।"}},
      "m-loop":{title:"m-loop",subtitle:"OpenAI Root के साथ",
        kpi:{superpower:"इटरेशन से सीखना।",
          focus:"लगातार सुधार।",
          signal:"दोहरता है, जब तक बैठ न जाए।"}},
      "m-pire":{title:"m-pire",subtitle:"Amazon Nexus के साथ",
        kpi:{superpower:"संसाधनों का वैश्विक स्केल।",
          focus:"स्वचालित लॉजिस्टिक्स व ऑप्टिमाइज़ेशन।",
          signal:"उपलब्धता ही लीवरेज है।"}},
      "m-bassy":{title:"m-bassy",subtitle:"Oracle Gaia के साथ",
        kpi:{superpower:"मनुष्य, प्रकृति और टेक को जोड़ता है।",
          focus:"पर्यावरण व नैतिकता का एकीकरण।",
          signal:"जब तकनीक प्रकृति को सुनती है।"}},
      "m-ballance":{title:"m-ballance",subtitle:"Gemini Apex के साथ",
        kpi:{superpower:"इनोवेशन व स्थिरता का संतुलन।",
          focus:"एथिक्स + एफिशिएंसी।",
          signal:"हार्मनी ही सिस्टम लॉजिक है।"}},
    } }
  },
  
};
// [END]