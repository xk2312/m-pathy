export const dict = {
  en: {
    kicker: "EU AI ACT ALIGNMENT",
    title: "Regulatory capability comparison",
    intro:
      "This comparison maps documented capabilities against EU AI Act derived requirements. It is evidence based and time bound.",
    table: {
      columns: {
        criterion: "Requirement",
        maios: "MAIOS",
        mpathy: "m-pathy",
        chatgpt: "ChatGPT Enterprise",
        copilot: "Microsoft Copilot",
        gemini: "Gemini for Workspace"
      }
    },
    groups: {
      governance: {
        title: "Governance and accountability",
        rows: {
          purpose: "Clear system purpose definition",
          accountability: "Accountability attribution",
          role_separation: "Role separation between provider and organization",
          architecture: "Documented system architecture",
          change_management: "Change management and version traceability"
        }
      },

      transparency: {
        title: "Transparency and information duties",
        rows: {
          awareness: "User awareness of AI interaction",
          disclosure: "Disclosure of capabilities and limitations",
          explainability: "Functional explainability of system behavior",
          non_deceptive: "Absence of deceptive or manipulative behavior",
          audit_info: "Information availability for auditors and regulators"
        }
      },

      oversight: {
        title: "Human oversight and control",
        rows: {
          oversight: "Availability of human oversight mechanisms",
          override: "Ability to intervene or override outputs",
          overreliance: "Measures to prevent over reliance",
          decision_support: "Support for informed human decision making",
          escalation: "Escalation and fallback mechanisms"
        }
      },

      risk: {
        title: "Risk management and harm mitigation",
        rows: {
          risk_process: "Risk identification and assessment processes",
          psychological: "Mitigation of psychological or cognitive harm",
          misuse: "Safeguards against misuse",
          bias: "Awareness and handling of bias or unfair outcomes",
          safety_testing: "Safety testing and evaluation procedures"
        }
      },

      data: {
        title: "Data handling and traceability",
        rows: {
          logging: "Logging of system interactions",
          traceability: "Traceability of outputs to system state",
          minimization: "Data minimization principles",
          retention: "Retention and deletion controls",
          security: "Secure data handling practices"
        }
      },

      post_market: {
        title: "Post market monitoring and compliance support",
        rows: {
          monitoring: "Monitoring of real world system performance",
          incidents: "Incident reporting capability",
          corrective: "Corrective action mechanisms",
          documentation: "Availability of compliance documentation",
          updates: "Update and improvement traceability"
        }
      }
    },
        legend: {
      supported: "Supported",
      not_supported: "Not supported"
    },

    footer: {
      sources_title: "Sources and verification",
      sources_note:
        "All entries are based on documented evidence available at the verification date.",
      verification_date_label: "Verification date"
    },

    maios_note: {
      title: "About MAIOS",
      body:
        "MAIOS is an AI operating system that provides governance, traceability and compliance primitives inherited by client systems such as m-pathy."
    }
    },
    de: {
  kicker: "EU AI ACT AUSRICHTUNG",
  title: "Vergleich regulatorischer Fähigkeiten",
  intro:
    "Dieser Vergleich ordnet dokumentierte Fähigkeiten den aus dem EU AI Act abgeleiteten Anforderungen zu. Er ist evidenzbasiert und zeitgebunden.",
  table: {
    columns: {
      criterion: "Anforderung",
      maios: "MAIOS",
      mpathy: "m-pathy",
      chatgpt: "ChatGPT Enterprise",
      copilot: "Microsoft Copilot",
      gemini: "Gemini for Workspace"
    }
  },
  groups: {
    governance: {
      title: "Governance und Verantwortlichkeit",
      rows: {
        purpose: "Klare Definition des Systemzwecks",
        accountability: "Zurechenbarkeit von Verantwortung",
        role_separation: "Rollentrennung zwischen Anbieter und Organisation",
        architecture: "Dokumentierte Systemarchitektur",
        change_management: "Änderungsmanagement und Versionsnachvollziehbarkeit"
      }
    },

    transparency: {
      title: "Transparenz und Informationspflichten",
      rows: {
        awareness: "Transparenz über die Nutzung von KI",
        disclosure: "Offenlegung von Fähigkeiten und Einschränkungen",
        explainability: "Funktionale Erklärbarkeit des Systemverhaltens",
        non_deceptive: "Vermeidung täuschender oder manipulativer Verhaltensweisen",
        audit_info: "Informationsverfügbarkeit für Prüfer und Aufsichtsbehörden"
      }
    },

    oversight: {
      title: "Menschliche Aufsicht und Kontrolle",
      rows: {
        oversight: "Vorhandensein menschlicher Aufsichtsmechanismen",
        override: "Möglichkeit zum Eingreifen oder Übersteuern von Ausgaben",
        overreliance: "Maßnahmen zur Vermeidung von Übervertrauen",
        decision_support: "Unterstützung informierter menschlicher Entscheidungen",
        escalation: "Eskalations und Fallback Mechanismen"
      }
    },

    risk: {
      title: "Risikomanagement und Schadensminderung",
      rows: {
        risk_process: "Prozesse zur Risikoidentifikation und Bewertung",
        psychological: "Minderung psychologischer oder kognitiver Schäden",
        misuse: "Schutzmaßnahmen gegen Missbrauch",
        bias: "Umgang mit Verzerrungen oder unfairen Ergebnissen",
        safety_testing: "Sicherheitsprüfung und Evaluationsverfahren"
      }
    },

    data: {
      title: "Datenverarbeitung und Nachvollziehbarkeit",
      rows: {
        logging: "Protokollierung von Systeminteraktionen",
        traceability: "Rückverfolgbarkeit von Ausgaben zum Systemzustand",
        minimization: "Prinzipien der Datenminimierung",
        retention: "Regelungen zu Aufbewahrung und Löschung",
        security: "Sichere Datenverarbeitung"
      }
    },

    post_market: {
      title: "Marktüberwachung und Compliance Unterstützung",
      rows: {
        monitoring: "Überwachung der Systemleistung im realen Einsatz",
        incidents: "Fähigkeit zur Meldung von Vorfällen",
        corrective: "Korrektur und Abhilfemaßnahmen",
        documentation: "Verfügbarkeit von Compliance Dokumentation",
        updates: "Nachvollziehbarkeit von Aktualisierungen und Verbesserungen"
      }
    }
  },
  legend: {
    supported: "Unterstützt",
    not_supported: "Nicht unterstützt"
  },
  footer: {
    sources_title: "Quellen und Verifikation",
    sources_note:
      "Alle Einträge basieren auf dokumentierter Evidenz zum Zeitpunkt der Verifikation.",
    verification_date_label: "Verifikationsdatum"
  },
  maios_note: {
    title: "Über MAIOS",
    body:
      "MAIOS ist ein KI Betriebssystem, das Governance, Nachvollziehbarkeit und Compliance Grundlagen bereitstellt, die von Clients wie m-pathy übernommen werden."
  }
},
fr: {
  kicker: "CONFORMITÉ AU EU AI ACT",
  title: "Comparaison des capacités réglementaires",
  intro:
    "Cette comparaison met en relation des capacités documentées avec des exigences dérivées du règlement européen sur l’IA. Elle est fondée sur des preuves et limitée dans le temps.",
  table: {
    columns: {
      criterion: "Exigence",
      maios: "MAIOS",
      mpathy: "m-pathy",
      chatgpt: "ChatGPT Enterprise",
      copilot: "Microsoft Copilot",
      gemini: "Gemini for Workspace"
    }
  },
  groups: {
    governance: {
      title: "Gouvernance et responsabilité",
      rows: {
        purpose: "Définition claire de l’objectif du système",
        accountability: "Attribution des responsabilités",
        role_separation: "Séparation des rôles entre fournisseur et organisation",
        architecture: "Architecture du système documentée",
        change_management: "Gestion des changements et traçabilité des versions"
      }
    },

    transparency: {
      title: "Transparence et obligations d’information",
      rows: {
        awareness: "Information de l’utilisateur sur l’interaction avec l’IA",
        disclosure: "Divulgation des capacités et des limites",
        explainability: "Explicabilité fonctionnelle du comportement du système",
        non_deceptive: "Absence de comportements trompeurs ou manipulateurs",
        audit_info: "Disponibilité des informations pour les auditeurs et les autorités"
      }
    },

    oversight: {
      title: "Supervision humaine et contrôle",
      rows: {
        oversight: "Disponibilité de mécanismes de supervision humaine",
        override: "Capacité d’intervenir ou de remplacer les résultats",
        overreliance: "Mesures visant à prévenir une dépendance excessive",
        decision_support: "Soutien à une prise de décision humaine éclairée",
        escalation: "Mécanismes d’escalade et de repli"
      }
    },

    risk: {
      title: "Gestion des risques et atténuation des préjudices",
      rows: {
        risk_process: "Processus d’identification et d’évaluation des risques",
        psychological: "Atténuation des dommages psychologiques ou cognitifs",
        misuse: "Garanties contre les usages abusifs",
        bias: "Gestion des biais ou des résultats injustes",
        safety_testing: "Procédures de tests et d’évaluation de la sécurité"
      }
    },

    data: {
      title: "Traitement des données et traçabilité",
      rows: {
        logging: "Journalisation des interactions du système",
        traceability: "Traçabilité des résultats par rapport à l’état du système",
        minimization: "Principes de minimisation des données",
        retention: "Contrôles de conservation et de suppression",
        security: "Traitement sécurisé des données"
      }
    },

    post_market: {
      title: "Surveillance post-commercialisation et support de conformité",
      rows: {
        monitoring: "Surveillance des performances du système en conditions réelles",
        incidents: "Capacité de signalement des incidents",
        corrective: "Mécanismes de correction",
        documentation: "Disponibilité de la documentation de conformité",
        updates: "Traçabilité des mises à jour et améliorations"
      }
    }
  },
  legend: {
    supported: "Pris en charge",
    not_supported: "Non pris en charge"
  },
  footer: {
    sources_title: "Sources et vérification",
    sources_note:
      "Toutes les entrées reposent sur des preuves documentées disponibles à la date de vérification.",
    verification_date_label: "Date de vérification"
  },
  maios_note: {
    title: "À propos de MAIOS",
    body:
      "MAIOS est un système d’exploitation pour l’IA qui fournit des fondations de gouvernance, de traçabilité et de conformité héritées par des clients tels que m-pathy."
  }
},
es: {
  kicker: "CUMPLIMIENTO DEL EU AI ACT",
  title: "Comparación de capacidades regulatorias",
  intro:
    "Esta comparación relaciona capacidades documentadas con requisitos derivados del Reglamento Europeo de IA. Se basa en evidencia y está limitada en el tiempo.",
  table: {
    columns: {
      criterion: "Requisito",
      maios: "MAIOS",
      mpathy: "m-pathy",
      chatgpt: "ChatGPT Enterprise",
      copilot: "Microsoft Copilot",
      gemini: "Gemini for Workspace"
    }
  },
  groups: {
    governance: {
      title: "Gobernanza y responsabilidad",
      rows: {
        purpose: "Definición clara del propósito del sistema",
        accountability: "Asignación de responsabilidades",
        role_separation: "Separación de roles entre proveedor y organización",
        architecture: "Arquitectura del sistema documentada",
        change_management: "Gestión de cambios y trazabilidad de versiones"
      }
    },

    transparency: {
      title: "Transparencia y deberes de información",
      rows: {
        awareness: "Concienciación del usuario sobre la interacción con IA",
        disclosure: "Divulgación de capacidades y limitaciones",
        explainability: "Explicabilidad funcional del comportamiento del sistema",
        non_deceptive: "Ausencia de comportamientos engañosos o manipuladores",
        audit_info: "Disponibilidad de información para auditores y reguladores"
      }
    },

    oversight: {
      title: "Supervisión y control humano",
      rows: {
        oversight: "Disponibilidad de mecanismos de supervisión humana",
        override: "Capacidad de intervenir o anular los resultados",
        overreliance: "Medidas para prevenir la dependencia excesiva",
        decision_support: "Apoyo a la toma de decisiones humanas informadas",
        escalation: "Mecanismos de escalado y contingencia"
      }
    },

    risk: {
      title: "Gestión de riesgos y mitigación de daños",
      rows: {
        risk_process: "Procesos de identificación y evaluación de riesgos",
        psychological: "Mitigación de daños psicológicos o cognitivos",
        misuse: "Salvaguardas contra usos indebidos",
        bias: "Gestión de sesgos o resultados injustos",
        safety_testing: "Procedimientos de prueba y evaluación de seguridad"
      }
    },

    data: {
      title: "Gestión de datos y trazabilidad",
      rows: {
        logging: "Registro de interacciones del sistema",
        traceability: "Trazabilidad de los resultados respecto al estado del sistema",
        minimization: "Principios de minimización de datos",
        retention: "Controles de retención y eliminación",
        security: "Tratamiento seguro de los datos"
      }
    },

    post_market: {
      title: "Supervisión posterior a la comercialización y soporte de cumplimiento",
      rows: {
        monitoring: "Supervisión del rendimiento del sistema en uso real",
        incidents: "Capacidad de notificación de incidentes",
        corrective: "Mecanismos de corrección",
        documentation: "Disponibilidad de documentación de cumplimiento",
        updates: "Trazabilidad de actualizaciones y mejoras"
      }
    }
  },
  legend: {
    supported: "Compatible",
    not_supported: "No compatible"
  },
  footer: {
    sources_title: "Fuentes y verificación",
    sources_note:
      "Todas las entradas se basan en evidencia documentada disponible en la fecha de verificación.",
    verification_date_label: "Fecha de verificación"
  },
  maios_note: {
    title: "Acerca de MAIOS",
    body:
      "MAIOS es un sistema operativo de IA que proporciona fundamentos de gobernanza, trazabilidad y cumplimiento heredados por clientes como m-pathy."
  }
},

it: {
  kicker: "CONFORMITÀ ALL’EU AI ACT",
  title: "Confronto delle capacità normative",
  intro:
    "Questo confronto mette in relazione capacità documentate con requisiti derivati dal Regolamento europeo sull’IA. È basato su evidenze ed è limitato nel tempo.",
  table: {
    columns: {
      criterion: "Requisito",
      maios: "MAIOS",
      mpathy: "m-pathy",
      chatgpt: "ChatGPT Enterprise",
      copilot: "Microsoft Copilot",
      gemini: "Gemini for Workspace"
    }
  },
  groups: {
    governance: {
      title: "Governance e responsabilità",
      rows: {
        purpose: "Definizione chiara dello scopo del sistema",
        accountability: "Attribuzione delle responsabilità",
        role_separation: "Separazione dei ruoli tra fornitore e organizzazione",
        architecture: "Architettura del sistema documentata",
        change_management: "Gestione delle modifiche e tracciabilità delle versioni"
      }
    },

    transparency: {
      title: "Trasparenza e obblighi informativi",
      rows: {
        awareness: "Consapevolezza dell’utente sull’interazione con l’IA",
        disclosure: "Divulgazione di capacità e limitazioni",
        explainability: "Spiegabilità funzionale del comportamento del sistema",
        non_deceptive: "Assenza di comportamenti ingannevoli o manipolativi",
        audit_info: "Disponibilità di informazioni per auditor e autorità"
      }
    },

    oversight: {
      title: "Supervisione e controllo umano",
      rows: {
        oversight: "Disponibilità di meccanismi di supervisione umana",
        override: "Capacità di intervenire o sovrascrivere i risultati",
        overreliance: "Misure per prevenire un eccessivo affidamento",
        decision_support: "Supporto a decisioni umane informate",
        escalation: "Meccanismi di escalation e fallback"
      }
    },

    risk: {
      title: "Gestione dei rischi e mitigazione dei danni",
      rows: {
        risk_process: "Processi di identificazione e valutazione dei rischi",
        psychological: "Mitigazione dei danni psicologici o cognitivi",
        misuse: "Salvaguardie contro l’uso improprio",
        bias: "Gestione di bias o risultati iniqui",
        safety_testing: "Procedure di test e valutazione della sicurezza"
      }
    },

    data: {
      title: "Gestione dei dati e tracciabilità",
      rows: {
        logging: "Registrazione delle interazioni del sistema",
        traceability: "Tracciabilità dei risultati rispetto allo stato del sistema",
        minimization: "Principi di minimizzazione dei dati",
        retention: "Controlli di conservazione ed eliminazione",
        security: "Trattamento sicuro dei dati"
      }
    },

    post_market: {
      title: "Monitoraggio post-commercializzazione e supporto alla conformità",
      rows: {
        monitoring: "Monitoraggio delle prestazioni del sistema in condizioni reali",
        incidents: "Capacità di segnalazione degli incidenti",
        corrective: "Meccanismi correttivi",
        documentation: "Disponibilità della documentazione di conformità",
        updates: "Tracciabilità degli aggiornamenti e dei miglioramenti"
      }
    }
  },
  legend: {
    supported: "Supportato",
    not_supported: "Non supportato"
  },
  footer: {
    sources_title: "Fonti e verifica",
    sources_note:
      "Tutte le voci si basano su evidenze documentate disponibili alla data di verifica.",
    verification_date_label: "Data di verifica"
  },
  maios_note: {
    title: "Informazioni su MAIOS",
    body:
      "MAIOS è un sistema operativo per l’IA che fornisce basi di governance, tracciabilità e conformità ereditate da client come m-pathy."
  }
},
pt: {
  kicker: "CONFORMIDADE COM O EU AI ACT",
  title: "Comparação de capacidades regulatórias",
  intro:
    "Esta comparação relaciona capacidades documentadas com requisitos derivados do Regulamento Europeu de IA. É baseada em evidências e limitada no tempo.",
  table: {
    columns: {
      criterion: "Requisito",
      maios: "MAIOS",
      mpathy: "m-pathy",
      chatgpt: "ChatGPT Enterprise",
      copilot: "Microsoft Copilot",
      gemini: "Gemini for Workspace"
    }
  },
  groups: {
    governance: {
      title: "Governança e responsabilidade",
      rows: {
        purpose: "Definição clara do propósito do sistema",
        accountability: "Atribuição de responsabilidades",
        role_separation: "Separação de papéis entre fornecedor e organização",
        architecture: "Arquitetura do sistema documentada",
        change_management: "Gestão de mudanças e rastreabilidade de versões"
      }
    },

    transparency: {
      title: "Transparência e deveres de informação",
      rows: {
        awareness: "Conscientização do usuário sobre a interação com IA",
        disclosure: "Divulgação de capacidades e limitações",
        explainability: "Explicabilidade funcional do comportamento do sistema",
        non_deceptive: "Ausência de comportamentos enganosos ou manipuladores",
        audit_info: "Disponibilidade de informações para auditores e reguladores"
      }
    },

    oversight: {
      title: "Supervisão e controle humano",
      rows: {
        oversight: "Disponibilidade de mecanismos de supervisão humana",
        override: "Capacidade de intervir ou substituir resultados",
        overreliance: "Medidas para evitar dependência excessiva",
        decision_support: "Apoio à tomada de decisões humanas informadas",
        escalation: "Mecanismos de escalonamento e contingência"
      }
    },

    risk: {
      title: "Gestão de riscos e mitigação de danos",
      rows: {
        risk_process: "Processos de identificação e avaliação de riscos",
        psychological: "Mitigação de danos psicológicos ou cognitivos",
        misuse: "Salvaguardas contra uso indevido",
        bias: "Gestão de vieses ou resultados injustos",
        safety_testing: "Procedimentos de teste e avaliação de segurança"
      }
    },

    data: {
      title: "Gestão de dados e rastreabilidade",
      rows: {
        logging: "Registro de interações do sistema",
        traceability: "Rastreabilidade dos resultados em relação ao estado do sistema",
        minimization: "Princípios de minimização de dados",
        retention: "Controles de retenção e exclusão",
        security: "Tratamento seguro de dados"
      }
    },

    post_market: {
      title: "Monitoramento pós-comercialização e suporte à conformidade",
      rows: {
        monitoring: "Monitoramento do desempenho do sistema em uso real",
        incidents: "Capacidade de notificação de incidentes",
        corrective: "Mecanismos corretivos",
        documentation: "Disponibilidade de documentação de conformidade",
        updates: "Rastreabilidade de atualizações e melhorias"
      }
    }
  },
  legend: {
    supported: "Compatível",
    not_supported: "Não compatível"
  },
  footer: {
    sources_title: "Fontes e verificação",
    sources_note:
      "Todas as entradas são baseadas em evidências documentadas disponíveis na data de verificação.",
    verification_date_label: "Data de verificação"
  },
  maios_note: {
    title: "Sobre o MAIOS",
    body:
      "MAIOS é um sistema operacional de IA que fornece fundamentos de governança, rastreabilidade e conformidade herdados por clientes como m-pathy."
  }
},

nl: {
  kicker: "EU AI ACT NALEVING",
  title: "Vergelijking van regelgevende capaciteiten",
  intro:
    "Deze vergelijking brengt gedocumenteerde capaciteiten in kaart ten opzichte van vereisten die zijn afgeleid van de Europese AI-verordening. Ze is op bewijs gebaseerd en tijdgebonden.",
  table: {
    columns: {
      criterion: "Vereiste",
      maios: "MAIOS",
      mpathy: "m-pathy",
      chatgpt: "ChatGPT Enterprise",
      copilot: "Microsoft Copilot",
      gemini: "Gemini for Workspace"
    }
  },
  groups: {
    governance: {
      title: "Governance en verantwoordelijkheid",
      rows: {
        purpose: "Duidelijke definitie van het doel van het systeem",
        accountability: "Toewijzing van verantwoordelijkheid",
        role_separation: "Rolafbakening tussen aanbieder en organisatie",
        architecture: "Gedocumenteerde systeemarchitectuur",
        change_management: "Wijzigingsbeheer en versie-traceerbaarheid"
      }
    },

    transparency: {
      title: "Transparantie en informatieplichten",
      rows: {
        awareness: "Bewustzijn van de gebruiker over AI-interactie",
        disclosure: "Openbaarmaking van capaciteiten en beperkingen",
        explainability: "Functionele uitlegbaarheid van systeemgedrag",
        non_deceptive: "Afwezigheid van misleidend of manipulatief gedrag",
        audit_info: "Beschikbaarheid van informatie voor auditors en toezichthouders"
      }
    },

    oversight: {
      title: "Menselijk toezicht en controle",
      rows: {
        oversight: "Beschikbaarheid van mechanismen voor menselijk toezicht",
        override: "Mogelijkheid om outputs te wijzigen of te overrulen",
        overreliance: "Maatregelen om overmatige afhankelijkheid te voorkomen",
        decision_support: "Ondersteuning van geïnformeerde menselijke besluitvorming",
        escalation: "Escalatie- en fallbackmechanismen"
      }
    },

    risk: {
      title: "Risicobeheer en schadebeperking",
      rows: {
        risk_process: "Processen voor risico-identificatie en -beoordeling",
        psychological: "Beperking van psychologische of cognitieve schade",
        misuse: "Waarborgen tegen misbruik",
        bias: "Omgang met bias of oneerlijke uitkomsten",
        safety_testing: "Procedures voor veiligheids- en evaluatietests"
      }
    },

    data: {
      title: "Gegevensverwerking en traceerbaarheid",
      rows: {
        logging: "Loggen van systeeminteracties",
        traceability: "Traceerbaarheid van outputs naar de systeemtoestand",
        minimization: "Principes van dataminimalisatie",
        retention: "Bewaar- en verwijderingscontroles",
        security: "Veilige gegevensverwerking"
      }
    },

    post_market: {
      title: "Post-market monitoring en compliance-ondersteuning",
      rows: {
        monitoring: "Monitoring van systeemprestaties in de praktijk",
        incidents: "Mogelijkheid tot incidentmelding",
        corrective: "Correctiemechanismen",
        documentation: "Beschikbaarheid van compliancedocumentatie",
        updates: "Traceerbaarheid van updates en verbeteringen"
      }
    }
  },
  legend: {
    supported: "Ondersteund",
    not_supported: "Niet ondersteund"
  },
  footer: {
    sources_title: "Bronnen en verificatie",
    sources_note:
      "Alle vermeldingen zijn gebaseerd op gedocumenteerd bewijs dat beschikbaar was op de verificatiedatum.",
    verification_date_label: "Verificatiedatum"
  },
  maios_note: {
    title: "Over MAIOS",
    body:
      "MAIOS is een AI-besturingssysteem dat governance-, traceerbaarheids- en compliancefundamenten biedt die worden geërfd door clients zoals m-pathy."
  }
},
ru: {
  kicker: "СООТВЕТСТВИЕ EU AI ACT",
  title: "Сравнение регуляторных возможностей",
  intro:
    "Данное сравнение сопоставляет задокументированные возможности с требованиями, вытекающими из Регламента ЕС об ИИ. Оно основано на доказательствах и ограничено по времени.",
  table: {
    columns: {
      criterion: "Требование",
      maios: "MAIOS",
      mpathy: "m-pathy",
      chatgpt: "ChatGPT Enterprise",
      copilot: "Microsoft Copilot",
      gemini: "Gemini for Workspace"
    }
  },
  groups: {
    governance: {
      title: "Управление и ответственность",
      rows: {
        purpose: "Четкое определение назначения системы",
        accountability: "Распределение ответственности",
        role_separation: "Разделение ролей между поставщиком и организацией",
        architecture: "Документированная архитектура системы",
        change_management: "Управление изменениями и отслеживаемость версий"
      }
    },

    transparency: {
      title: "Прозрачность и информационные обязанности",
      rows: {
        awareness: "Информирование пользователя о взаимодействии с ИИ",
        disclosure: "Раскрытие возможностей и ограничений",
        explainability: "Функциональная объяснимость поведения системы",
        non_deceptive: "Отсутствие вводящего в заблуждение или манипулятивного поведения",
        audit_info: "Доступность информации для аудиторов и регуляторов"
      }
    },

    oversight: {
      title: "Человеческий надзор и контроль",
      rows: {
        oversight: "Наличие механизмов человеческого надзора",
        override: "Возможность вмешательства или переопределения результатов",
        overreliance: "Меры по предотвращению чрезмерной зависимости",
        decision_support: "Поддержка информированного принятия решений человеком",
        escalation: "Механизмы эскалации и резервирования"
      }
    },

    risk: {
      title: "Управление рисками и снижение вреда",
      rows: {
        risk_process: "Процессы выявления и оценки рисков",
        psychological: "Снижение психологического или когнитивного вреда",
        misuse: "Меры защиты от неправомерного использования",
        bias: "Управление смещениями или несправедливыми результатами",
        safety_testing: "Процедуры тестирования и оценки безопасности"
      }
    },

    data: {
      title: "Обработка данных и отслеживаемость",
      rows: {
        logging: "Журналирование взаимодействий системы",
        traceability: "Отслеживаемость результатов относительно состояния системы",
        minimization: "Принципы минимизации данных",
        retention: "Контроль хранения и удаления",
        security: "Безопасная обработка данных"
      }
    },

    post_market: {
      title: "Пострыночный мониторинг и поддержка соответствия",
      rows: {
        monitoring: "Мониторинг работы системы в реальных условиях",
        incidents: "Возможность сообщения об инцидентах",
        corrective: "Корректирующие механизмы",
        documentation: "Доступность документации по соответствию",
        updates: "Отслеживаемость обновлений и улучшений"
      }
    }
  },
  legend: {
    supported: "Поддерживается",
    not_supported: "Не поддерживается"
  },
  footer: {
    sources_title: "Источники и проверка",
    sources_note:
      "Все позиции основаны на задокументированных доказательствах, доступных на дату проверки.",
    verification_date_label: "Дата проверки"
  },
  maios_note: {
    title: "О MAIOS",
    body:
      "MAIOS — это операционная система для ИИ, предоставляющая основы управления, отслеживаемости и соответствия, которые наследуются клиентами, такими как m-pathy."
  }
},
zh: {
  kicker: "符合 EU AI ACT",
  title: "监管能力比较",
  intro:
    "本比较将已记录的能力与源自欧盟人工智能法规的要求进行对照。比较基于证据，且具有时效性。",
  table: {
    columns: {
      criterion: "要求",
      maios: "MAIOS",
      mpathy: "m-pathy",
      chatgpt: "ChatGPT Enterprise",
      copilot: "Microsoft Copilot",
      gemini: "Gemini for Workspace"
    }
  },
  groups: {
    governance: {
      title: "治理与问责",
      rows: {
        purpose: "系统目的的清晰定义",
        accountability: "责任归属",
        role_separation: "提供方与组织之间的角色分离",
        architecture: "系统架构文档化",
        change_management: "变更管理与版本可追溯性"
      }
    },

    transparency: {
      title: "透明度与信息义务",
      rows: {
        awareness: "用户对 AI 交互的知情",
        disclosure: "能力与限制的披露",
        explainability: "系统行为的功能性可解释性",
        non_deceptive: "不存在欺骗或操纵性行为",
        audit_info: "向审计人员和监管机构提供信息的可用性"
      }
    },

    oversight: {
      title: "人工监督与控制",
      rows: {
        oversight: "人工监督机制的可用性",
        override: "干预或覆盖输出的能力",
        overreliance: "防止过度依赖的措施",
        decision_support: "支持知情的人类决策",
        escalation: "升级与回退机制"
      }
    },

    risk: {
      title: "风险管理与危害缓解",
      rows: {
        risk_process: "风险识别与评估流程",
        psychological: "心理或认知危害的缓解",
        misuse: "防止滥用的保障措施",
        bias: "对偏见或不公平结果的处理",
        safety_testing: "安全测试与评估程序"
      }
    },

    data: {
      title: "数据处理与可追溯性",
      rows: {
        logging: "系统交互的记录",
        traceability: "输出与系统状态的可追溯性",
        minimization: "数据最小化原则",
        retention: "保留与删除控制",
        security: "安全的数据处理"
      }
    },

    post_market: {
      title: "上市后监测与合规支持",
      rows: {
        monitoring: "真实环境中的系统性能监测",
        incidents: "事件报告能力",
        corrective: "纠正机制",
        documentation: "合规文档的可用性",
        updates: "更新与改进的可追溯性"
      }
    }
  },
  legend: {
    supported: "支持",
    not_supported: "不支持"
  },
  footer: {
    sources_title: "来源与验证",
    sources_note:
      "所有条目均基于验证日期可获得的书面证据。",
    verification_date_label: "验证日期"
  },
  maios_note: {
    title: "关于 MAIOS",
    body:
      "MAIOS 是一款人工智能操作系统，提供治理、可追溯性与合规基础，并由 m-pathy 等客户端继承使用。"
  }
},

ja: {
  kicker: "EU AI ACT 準拠",
  title: "規制能力の比較",
  intro:
    "本比較は、文書化された能力を EU AI 規則に基づく要件と照合します。証拠に基づき、期間を限定しています。",
  table: {
    columns: {
      criterion: "要件",
      maios: "MAIOS",
      mpathy: "m-pathy",
      chatgpt: "ChatGPT Enterprise",
      copilot: "Microsoft Copilot",
      gemini: "Gemini for Workspace"
    }
  },
  groups: {
    governance: {
      title: "ガバナンスと説明責任",
      rows: {
        purpose: "システム目的の明確な定義",
        accountability: "責任の帰属",
        role_separation: "提供者と組織間の役割分離",
        architecture: "文書化されたシステムアーキテクチャ",
        change_management: "変更管理およびバージョン追跡性"
      }
    },

    transparency: {
      title: "透明性と情報提供義務",
      rows: {
        awareness: "AI との対話に関するユーザーの認識",
        disclosure: "機能および制限の開示",
        explainability: "システム挙動の機能的説明可能性",
        non_deceptive: "欺瞞的または操作的行為の不在",
        audit_info: "監査人および規制当局向け情報の提供"
      }
    },

    oversight: {
      title: "人による監督と管理",
      rows: {
        oversight: "人による監督メカニズムの有無",
        override: "出力を介入または上書きする能力",
        overreliance: "過度な依存を防止する措置",
        decision_support: "十分な情報に基づく人間の意思決定支援",
        escalation: "エスカレーションおよびフォールバック機構"
      }
    },

    risk: {
      title: "リスク管理および被害軽減",
      rows: {
        risk_process: "リスクの特定および評価プロセス",
        psychological: "心理的または認知的被害の軽減",
        misuse: "不正使用に対する保護措置",
        bias: "偏りまたは不公平な結果への対応",
        safety_testing: "安全性テストおよび評価手順"
      }
    },

    data: {
      title: "データ処理および追跡可能性",
      rows: {
        logging: "システム相互作用の記録",
        traceability: "システム状態に対する出力の追跡可能性",
        minimization: "データ最小化の原則",
        retention: "保持および削除の管理",
        security: "安全なデータ処理"
      }
    },

    post_market: {
      title: "上市後の監視およびコンプライアンス支援",
      rows: {
        monitoring: "実運用環境におけるシステム性能の監視",
        incidents: "インシデント報告能力",
        corrective: "是正措置メカニズム",
        documentation: "コンプライアンス文書の可用性",
        updates: "更新および改善の追跡可能性"
      }
    }
  },
  legend: {
    supported: "対応",
    not_supported: "非対応"
  },
  footer: {
    sources_title: "情報源と検証",
    sources_note:
      "すべての項目は、検証日時点で入手可能な文書化された証拠に基づいています。",
    verification_date_label: "検証日"
  },
  maios_note: {
    title: "MAIOS について",
    body:
      "MAIOS は、ガバナンス、追跡可能性、コンプライアンスの基盤を提供し、m-pathy などのクライアントに継承される AI オペレーティングシステムです。"
  }
},
ko: {
  kicker: "EU AI ACT 준수",
  title: "규제 역량 비교",
  intro:
    "본 비교는 문서화된 역량을 EU 인공지능 규정에서 도출된 요구사항과 대조합니다. 증거 기반이며 시간적으로 제한됩니다.",
  table: {
    columns: {
      criterion: "요구사항",
      maios: "MAIOS",
      mpathy: "m-pathy",
      chatgpt: "ChatGPT Enterprise",
      copilot: "Microsoft Copilot",
      gemini: "Gemini for Workspace"
    }
  },
  groups: {
    governance: {
      title: "거버넌스 및 책임",
      rows: {
        purpose: "시스템 목적의 명확한 정의",
        accountability: "책임의 귀속",
        role_separation: "제공자와 조직 간 역할 분리",
        architecture: "문서화된 시스템 아키텍처",
        change_management: "변경 관리 및 버전 추적성"
      }
    },

    transparency: {
      title: "투명성 및 정보 제공 의무",
      rows: {
        awareness: "AI 상호작용에 대한 사용자 인식",
        disclosure: "기능 및 제한 사항 공개",
        explainability: "시스템 동작의 기능적 설명 가능성",
        non_deceptive: "기만적 또는 조작적 행위의 부재",
        audit_info: "감사자 및 규제 기관을 위한 정보 제공"
      }
    },

    oversight: {
      title: "인간 감독 및 통제",
      rows: {
        oversight: "인간 감독 메커니즘의 제공",
        override: "출력을 개입하거나 재정의할 수 있는 능력",
        overreliance: "과도한 의존을 방지하기 위한 조치",
        decision_support: "정보에 기반한 인간 의사결정 지원",
        escalation: "에스컬레이션 및 폴백 메커니즘"
      }
    },

    risk: {
      title: "위험 관리 및 피해 완화",
      rows: {
        risk_process: "위험 식별 및 평가 프로세스",
        psychological: "심리적 또는 인지적 피해 완화",
        misuse: "오용 방지를 위한 보호 조치",
        bias: "편향 또는 불공정한 결과에 대한 대응",
        safety_testing: "안전성 테스트 및 평가 절차"
      }
    },

    data: {
      title: "데이터 처리 및 추적 가능성",
      rows: {
        logging: "시스템 상호작용 기록",
        traceability: "시스템 상태에 대한 출력 추적 가능성",
        minimization: "데이터 최소화 원칙",
        retention: "보존 및 삭제 제어",
        security: "안전한 데이터 처리"
      }
    },

    post_market: {
      title: "시판 후 모니터링 및 규정 준수 지원",
      rows: {
        monitoring: "실제 환경에서의 시스템 성능 모니터링",
        incidents: "사건 보고 능력",
        corrective: "시정 메커니즘",
        documentation: "규정 준수 문서의 가용성",
        updates: "업데이트 및 개선의 추적 가능성"
      }
    }
  },
  legend: {
    supported: "지원됨",
    not_supported: "지원되지 않음"
  },
  footer: {
    sources_title: "출처 및 검증",
    sources_note:
      "모든 항목은 검증 시점에 उपलब्ध한 문서화된 증거를 기반으로 합니다.",
    verification_date_label: "검증 날짜"
  },
  maios_note: {
    title: "MAIOS 소개",
    body:
      "MAIOS는 거버넌스, 추적 가능성 및 규정 준수 기반을 제공하는 AI 운영체제로, m-pathy와 같은 클라이언트에 의해 상속됩니다."
  }
},
ar: {
  kicker: "الامتثال لقانون الذكاء الاصطناعي الأوروبي",
  title: "مقارنة القدرات التنظيمية",
  intro:
    "تقارن هذه المقارنة القدرات الموثقة بالمتطلبات المستمدة من لائحة الاتحاد الأوروبي للذكاء الاصطناعي. وهي قائمة على الأدلة ومحددة زمنياً.",
  table: {
    columns: {
      criterion: "المتطلب",
      maios: "MAIOS",
      mpathy: "m-pathy",
      chatgpt: "ChatGPT Enterprise",
      copilot: "Microsoft Copilot",
      gemini: "Gemini for Workspace"
    }
  },
  groups: {
    governance: {
      title: "الحوكمة والمساءلة",
      rows: {
        purpose: "تحديد واضح لغرض النظام",
        accountability: "إسناد المسؤوليات",
        role_separation: "فصل الأدوار بين المزوّد والمنظمة",
        architecture: "توثيق بنية النظام",
        change_management: "إدارة التغييرات وتتبع الإصدارات"
      }
    },

    transparency: {
      title: "الشفافية وواجبات المعلومات",
      rows: {
        awareness: "وعي المستخدم بالتفاعل مع الذكاء الاصطناعي",
        disclosure: "الإفصاح عن القدرات والقيود",
        explainability: "قابلية تفسير السلوك الوظيفي للنظام",
        non_deceptive: "غياب السلوكيات الخادعة أو التلاعبية",
        audit_info: "توافر المعلومات للمدققين والجهات التنظيمية"
      }
    },

    oversight: {
      title: "الإشراف والتحكم البشري",
      rows: {
        oversight: "توافر آليات الإشراف البشري",
        override: "القدرة على التدخل أو تجاوز المخرجات",
        overreliance: "تدابير لمنع الاعتماد المفرط",
        decision_support: "دعم اتخاذ القرارات البشرية المستنيرة",
        escalation: "آليات التصعيد والبدائل"
      }
    },

    risk: {
      title: "إدارة المخاطر والتخفيف من الأضرار",
      rows: {
        risk_process: "عمليات تحديد المخاطر وتقييمها",
        psychological: "التخفيف من الأضرار النفسية أو المعرفية",
        misuse: "ضمانات ضد سوء الاستخدام",
        bias: "التعامل مع التحيز أو النتائج غير العادلة",
        safety_testing: "إجراءات اختبار وتقييم السلامة"
      }
    },

    data: {
      title: "معالجة البيانات وقابلية التتبع",
      rows: {
        logging: "تسجيل تفاعلات النظام",
        traceability: "قابلية تتبع المخرجات إلى حالة النظام",
        minimization: "مبادئ تقليل البيانات",
        retention: "ضوابط الاحتفاظ والحذف",
        security: "المعالجة الآمنة للبيانات"
      }
    },

    post_market: {
      title: "المراقبة بعد طرح المنتج ودعم الامتثال",
      rows: {
        monitoring: "مراقبة أداء النظام في الاستخدام الفعلي",
        incidents: "القدرة على الإبلاغ عن الحوادث",
        corrective: "آليات الإجراءات التصحيحية",
        documentation: "توافر وثائق الامتثال",
        updates: "قابلية تتبع التحديثات والتحسينات"
      }
    }
  },
  legend: {
    supported: "مدعوم",
    not_supported: "غير مدعوم"
  },
  footer: {
    sources_title: "المصادر والتحقق",
    sources_note:
      "تعتمد جميع البنود على أدلة موثقة متاحة في تاريخ التحقق.",
    verification_date_label: "تاريخ التحقق"
  },
  maios_note: {
    title: "حول MAIOS",
    body:
      "MAIOS هو نظام تشغيل للذكاء الاصطناعي يوفر أسس الحوكمة وقابلية التتبع والامتثال التي ترثها عملاء مثل m-pathy."
  }
},
hi: {
  kicker: "EU AI ACT अनुपालन",
  title: "नियामक क्षमताओं की तुलना",
  intro:
    "यह तुलना प्रलेखित क्षमताओं को यूरोपीय एआई विनियमन से निकाली गई आवश्यकताओं के साथ संबद्ध करती है। यह साक्ष्य आधारित और समय-सीमित है।",
  table: {
    columns: {
      criterion: "आवश्यकता",
      maios: "MAIOS",
      mpathy: "m-pathy",
      chatgpt: "ChatGPT Enterprise",
      copilot: "Microsoft Copilot",
      gemini: "Gemini for Workspace"
    }
  },
  groups: {
    governance: {
      title: "शासन और जवाबदेही",
      rows: {
        purpose: "प्रणाली के उद्देश्य की स्पष्ट परिभाषा",
        accountability: "जवाबदेही का निर्धारण",
        role_separation: "प्रदाता और संगठन के बीच भूमिका विभाजन",
        architecture: "प्रलेखित प्रणाली संरचना",
        change_management: "परिवर्तन प्रबंधन और संस्करण अनुरेखण"
      }
    },

    transparency: {
      title: "पारदर्शिता और सूचना दायित्व",
      rows: {
        awareness: "एआई के साथ अंतःक्रिया के प्रति उपयोगकर्ता की जागरूकता",
        disclosure: "क्षमताओं और सीमाओं का प्रकटीकरण",
        explainability: "प्रणाली व्यवहार की कार्यात्मक व्याख्येयता",
        non_deceptive: "भ्रामक या हेरफेरकारी व्यवहार का अभाव",
        audit_info: "ऑडिटरों और नियामकों के लिए जानकारी की उपलब्धता"
      }
    },

    oversight: {
      title: "मानवीय निगरानी और नियंत्रण",
      rows: {
        oversight: "मानवीय निगरानी तंत्र की उपलब्धता",
        override: "आउटपुट में हस्तक्षेप या उसे ओवरराइड करने की क्षमता",
        overreliance: "अत्यधिक निर्भरता को रोकने के उपाय",
        decision_support: "सूचित मानवीय निर्णय लेने में समर्थन",
        escalation: "एस्केलेशन और फॉलबैक तंत्र"
      }
    },

    risk: {
      title: "जोखिम प्रबंधन और हानि न्यूनीकरण",
      rows: {
        risk_process: "जोखिम की पहचान और मूल्यांकन की प्रक्रियाएँ",
        psychological: "मनोवैज्ञानिक या संज्ञानात्मक हानि का न्यूनीकरण",
        misuse: "दुरुपयोग के विरुद्ध सुरक्षा उपाय",
        bias: "पक्षपात या अनुचित परिणामों से निपटना",
        safety_testing: "सुरक्षा परीक्षण और मूल्यांकन प्रक्रियाएँ"
      }
    },

    data: {
      title: "डेटा प्रबंधन और अनुरेखणीयता",
      rows: {
        logging: "प्रणाली अंतःक्रियाओं का लॉगिंग",
        traceability: "प्रणाली स्थिति के सापेक्ष आउटपुट की अनुरेखणीयता",
        minimization: "डेटा न्यूनतमकरण के सिद्धांत",
        retention: "संरक्षण और हटाने के नियंत्रण",
        security: "सुरक्षित डेटा प्रबंधन"
      }
    },

    post_market: {
      title: "बाज़ारोत्तर निगरानी और अनुपालन समर्थन",
      rows: {
        monitoring: "वास्तविक उपयोग में प्रणाली प्रदर्शन की निगरानी",
        incidents: "घटनाओं की रिपोर्ट करने की क्षमता",
        corrective: "सुधारात्मक तंत्र",
        documentation: "अनुपालन प्रलेखन की उपलब्धता",
        updates: "अपडेट और सुधारों की अनुरेखणीयता"
      }
    }
  },
  legend: {
    supported: "समर्थित",
    not_supported: "समर्थित नहीं"
  },
  footer: {
    sources_title: "स्रोत और सत्यापन",
    sources_note:
      "सभी प्रविष्टियाँ सत्यापन तिथि पर उपलब्ध प्रलेखित साक्ष्यों पर आधारित हैं।",
    verification_date_label: "सत्यापन तिथि"
  },
  maios_note: {
    title: "MAIOS के बारे में",
    body:
      "MAIOS एक एआई ऑपरेटिंग सिस्टम है जो शासन, अनुरेखणीयता और अनुपालन की नींव प्रदान करता है, जिन्हें m-pathy जैसे क्लाइंट विरासत में लेते हैं।"
  }
},

}