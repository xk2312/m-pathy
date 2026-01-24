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
    governance: { title: "Governance und Verantwortlichkeit" },
    transparency: { title: "Transparenz und Informationspflichten" },
    oversight: { title: "Menschliche Aufsicht und Kontrolle" },
    risk: { title: "Risikomanagement und Schadensminderung" },
    data: { title: "Datenverarbeitung und Nachvollziehbarkeit" },
    post_market: { title: "Marktüberwachung und Compliance-Unterstützung" }
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
      "MAIOS ist ein KI-Betriebssystem, das Governance-, Nachvollziehbarkeits- und Compliance-Grundlagen bereitstellt, die von Clients wie m-pathy übernommen werden."
  }
},
fr: {
  kicker: "CONFORMITÉ AU EU AI ACT",
  title: "Comparaison des capacités réglementaires",
  intro:
    "Cette comparaison met en regard des capacités documentées avec des exigences dérivées du règlement européen sur l’IA. Elle est fondée sur des preuves et limitée dans le temps.",

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
    governance: { title: "Gouvernance et responsabilité" },
    transparency: { title: "Transparence et obligations d’information" },
    oversight: { title: "Supervision humaine et contrôle" },
    risk: { title: "Gestion des risques et réduction des préjudices" },
    data: { title: "Traitement des données et traçabilité" },
    post_market: { title: "Surveillance post-commercialisation et conformité" }
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
      "MAIOS est un système d’exploitation pour l’IA fournissant des bases de gouvernance, de traçabilité et de conformité héritées par des clients comme m-pathy."
  }
}
,es: {
  kicker: "ALINEACIÓN CON LA LEY DE IA DE LA UE",
  title: "Comparación de capacidades regulatorias",
  intro:
    "Esta comparación relaciona capacidades documentadas con requisitos derivados de la Ley de IA de la UE. Se basa en evidencias y está limitada en el tiempo.",

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
    governance: { title: "Gobernanza y responsabilidad" },
    transparency: { title: "Transparencia y deberes de información" },
    oversight: { title: "Supervisión humana y control" },
    risk: { title: "Gestión de riesgos y mitigación de daños" },
    data: { title: "Gestión de datos y trazabilidad" },
    post_market: { title: "Supervisión posterior al mercado y cumplimiento" }
  },

  legend: {
    supported: "Compatible",
    not_supported: "No compatible"
  },

  footer: {
    sources_title: "Fuentes y verificación",
    sources_note:
      "Todas las entradas se basan en evidencias documentadas disponibles en la fecha de verificación.",
    verification_date_label: "Fecha de verificación"
  },

  maios_note: {
    title: "Acerca de MAIOS",
    body:
      "MAIOS es un sistema operativo de IA que proporciona fundamentos de gobernanza, trazabilidad y cumplimiento heredados por clientes como m-pathy."
  }
}
,
it: {
  kicker: "ALLINEAMENTO ALL’EU AI ACT",
  title: "Confronto delle capacità regolatorie",
  intro:
    "Questo confronto mette in relazione capacità documentate con requisiti derivati dall’EU AI Act. È basato su evidenze ed è limitato nel tempo.",

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
    governance: { title: "Governance e responsabilità" },
    transparency: { title: "Trasparenza e obblighi informativi" },
    oversight: { title: "Supervisione e controllo umano" },
    risk: { title: "Gestione del rischio e mitigazione dei danni" },
    data: { title: "Gestione dei dati e tracciabilità" },
    post_market: { title: "Monitoraggio post commercializzazione e conformità" }
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
      "MAIOS è un sistema operativo di intelligenza artificiale che fornisce basi di governance, tracciabilità e conformità ereditate da client come m-pathy."
  }
}
,pt: {
  kicker: "ALINHAMENTO COM O EU AI ACT",
  title: "Comparação de capacidades regulatórias",
  intro:
    "Esta comparação relaciona capacidades documentadas com requisitos derivados do EU AI Act. É baseada em evidências e limitada no tempo.",

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
    governance: { title: "Governança e responsabilidade" },
    transparency: { title: "Transparência e deveres de informação" },
    oversight: { title: "Supervisão e controle humano" },
    risk: { title: "Gestão de riscos e mitigação de danos" },
    data: { title: "Gestão de dados e rastreabilidade" },
    post_market: { title: "Monitoramento pós mercado e conformidade" }
  },

  legend: {
    supported: "Suportado",
    not_supported: "Não suportado"
  },

  footer: {
    sources_title: "Fontes e verificação",
    sources_note:
      "Todas as entradas baseiam-se em evidências documentadas disponíveis na data de verificação.",
    verification_date_label: "Data de verificação"
  },

  maios_note: {
    title: "Sobre o MAIOS",
    body:
      "MAIOS é um sistema operacional de IA que fornece fundamentos de governança, rastreabilidade e conformidade herdados por clientes como o m-pathy."
  }
}
,
nl: {
  kicker: "EU AI ACT AFSTEMMING",
  title: "Vergelijking van regelgevende capaciteiten",
  intro:
    "Deze vergelijking koppelt gedocumenteerde capaciteiten aan vereisten die zijn afgeleid van de EU AI Act. Ze is op bewijs gebaseerd en tijdsgebonden.",

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
    governance: { title: "Governance en verantwoordelijkheid" },
    transparency: { title: "Transparantie en informatieplichten" },
    oversight: { title: "Menselijk toezicht en controle" },
    risk: { title: "Risicobeheer en schadebeperking" },
    data: { title: "Gegevensbeheer en traceerbaarheid" },
    post_market: { title: "Post-market monitoring en compliance" }
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
      "MAIOS is een AI besturingssysteem dat governance-, traceerbaarheids- en compliancefundamenten biedt die worden geërfd door clients zoals m-pathy."
  }
}
,
ru: {
  kicker: "СООТВЕТСТВИЕ EU AI ACT",
  title: "Сравнение регуляторных возможностей",
  intro:
    "Данное сравнение соотносит документированные возможности с требованиями, вытекающими из EU AI Act. Оно основано на доказательствах и ограничено по времени.",

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
    governance: { title: "Управление и ответственность" },
    transparency: { title: "Прозрачность и обязанности по информированию" },
    oversight: { title: "Человеческий надзор и контроль" },
    risk: { title: "Управление рисками и снижение вреда" },
    data: { title: "Обработка данных и отслеживаемость" },
    post_market: { title: "Пострыночный мониторинг и соответствие" }
  },

  legend: {
    supported: "Поддерживается",
    not_supported: "Не поддерживается"
  },

  footer: {
    sources_title: "Источники и проверка",
    sources_note:
      "Все данные основаны на документированных доказательствах, доступных на дату проверки.",
    verification_date_label: "Дата проверки"
  },

  maios_note: {
    title: "О MAIOS",
    body:
      "MAIOS представляет собой операционную систему ИИ, обеспечивающую основы управления, отслеживаемости и соответствия, унаследованные клиентами, такими как m-pathy."
  }
}
,
zh: {
  kicker: "欧盟人工智能法案对齐",
  title: "监管能力比较",
  intro:
    "本比较将已记录的能力与源自欧盟人工智能法案的要求进行对照。该比较基于证据并具有时间限制。",

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
    governance: { title: "治理与责任" },
    transparency: { title: "透明度与信息义务" },
    oversight: { title: "人工监督与控制" },
    risk: { title: "风险管理与危害缓解" },
    data: { title: "数据处理与可追溯性" },
    post_market: { title: "上市后监控与合规支持" }
  },

  legend: {
    supported: "支持",
    not_supported: "不支持"
  },

  footer: {
    sources_title: "来源与验证",
    sources_note:
      "所有条目均基于验证日期时可获得的书面证据。",
    verification_date_label: "验证日期"
  },

  maios_note: {
    title: "关于 MAIOS",
    body:
      "MAIOS 是一种人工智能操作系统，为 m-pathy 等客户端提供继承的治理、可追溯性和合规基础。"
  }
}
,
ja: {
  kicker: "EU AI 法への適合",
  title: "規制対応能力の比較",
  intro:
    "本比較は、文書化された能力を EU AI 法から導かれた要件と照合します。証拠に基づき、時点限定で行われます。",

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
    governance: { title: "ガバナンスと責任" },
    transparency: { title: "透明性と情報提供義務" },
    oversight: { title: "人による監督と管理" },
    risk: { title: "リスク管理と被害軽減" },
    data: { title: "データ管理とトレーサビリティ" },
    post_market: { title: "市場投入後の監視とコンプライアンス" }
  },

  legend: {
    supported: "対応済み",
    not_supported: "未対応"
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
      "MAIOS は、m-pathy などのクライアントに継承されるガバナンス、トレーサビリティ、コンプライアンス基盤を提供する AI オペレーティングシステムです。"
  }
}
,
ko: {
  kicker: "EU AI 법 정합성",
  title: "규제 역량 비교",
  intro:
    "이 비교는 문서화된 역량을 EU AI 법에서 도출된 요구 사항과 대조합니다. 증거 기반이며 시점에 한정됩니다.",

  table: {
    columns: {
      criterion: "요구 사항",
      maios: "MAIOS",
      mpathy: "m-pathy",
      chatgpt: "ChatGPT Enterprise",
      copilot: "Microsoft Copilot",
      gemini: "Gemini for Workspace"
    }
  },

  groups: {
    governance: { title: "거버넌스 및 책임" },
    transparency: { title: "투명성 및 정보 제공 의무" },
    oversight: { title: "인적 감독 및 통제" },
    risk: { title: "위험 관리 및 피해 완화" },
    data: { title: "데이터 처리 및 추적성" },
    post_market: { title: "사후 시장 모니터링 및 규정 준수" }
  },

  legend: {
    supported: "지원됨",
    not_supported: "지원되지 않음"
  },

  footer: {
    sources_title: "출처 및 검증",
    sources_note:
      "모든 항목은 검증일 기준으로 이용 가능한 문서화된 증거를 기반으로 합니다.",
    verification_date_label: "검증일"
  },

  maios_note: {
    title: "MAIOS 소개",
    body:
      "MAIOS는 m-pathy와 같은 클라이언트가 상속하는 거버넌스, 추적성 및 규정 준수 기반을 제공하는 AI 운영 체제입니다."
  }
}
,ar: {
  kicker: "التوافق مع قانون الذكاء الاصطناعي الأوروبي",
  title: "مقارنة القدرات التنظيمية",
  intro:
    "تربط هذه المقارنة القدرات الموثقة بالمتطلبات المستمدة من قانون الذكاء الاصطناعي الأوروبي. وهي قائمة على الأدلة ومحددة زمنياً.",

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
    governance: { title: "الحوكمة والمسؤولية" },
    transparency: { title: "الشفافية وواجبات الإفصاح" },
    oversight: { title: "الإشراف والتحكم البشري" },
    risk: { title: "إدارة المخاطر وتخفيف الأضرار" },
    data: { title: "إدارة البيانات وإمكانية التتبع" },
    post_market: { title: "المراقبة بعد طرح المنتج والامتثال" }
  },

  legend: {
    supported: "مدعوم",
    not_supported: "غير مدعوم"
  },

  footer: {
    sources_title: "المصادر والتحقق",
    sources_note:
      "تعتمد جميع الإدخالات على أدلة موثقة متاحة في تاريخ التحقق.",
    verification_date_label: "تاريخ التحقق"
  },

  maios_note: {
    title: "حول MAIOS",
    body:
      "MAIOS هو نظام تشغيل للذكاء الاصطناعي يوفر أسس الحوكمة وإمكانية التتبع والامتثال التي ترثها أنظمة مثل m-pathy."
  }
}
,hi: {
  kicker: "ईयू एआई अधिनियम के साथ संरेखण",
  title: "नियामक क्षमताओं की तुलना",
  intro:
    "यह तुलना दस्तावेजीकृत क्षमताओं को ईयू एआई अधिनियम से निकली आवश्यकताओं के साथ संबद्ध करती है। यह साक्ष्य आधारित और समयबद्ध है।",

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
    governance: { title: "शासन और जवाबदेही" },
    transparency: { title: "पारदर्शिता और सूचना दायित्व" },
    oversight: { title: "मानव पर्यवेक्षण और नियंत्रण" },
    risk: { title: "जोखिम प्रबंधन और क्षति न्यूनीकरण" },
    data: { title: "डेटा प्रबंधन और अनुरेखणीयता" },
    post_market: { title: "बाजार पश्चात निगरानी और अनुपालन" }
  },

  legend: {
    supported: "समर्थित",
    not_supported: "समर्थित नहीं"
  },

  footer: {
    sources_title: "स्रोत और सत्यापन",
    sources_note:
      "सभी प्रविष्टियाँ सत्यापन तिथि पर उपलब्ध दस्तावेजीकृत साक्ष्यों पर आधारित हैं।",
    verification_date_label: "सत्यापन तिथि"
  },

  maios_note: {
    title: "MAIOS के बारे में",
    body:
      "MAIOS एक एआई ऑपरेटिंग सिस्टम है जो m-pathy जैसे क्लाइंट द्वारा विरासत में लिए गए शासन, अनुरेखणीयता और अनुपालन के आधार प्रदान करता है।"
  }
}

}