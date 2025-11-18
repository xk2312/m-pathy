// lib/i18n.legal.ts

export type LegalPageKey = "privacy" | "terms" | "refund" | "legal" | "imprint";

export type LegalSection = {
  id: string;
  heading: string;
  body: string;
};

export type LegalPageContent = {
  slug: LegalPageKey;
  title: string;
  intro: string;
  last_updated: string;
  sections: LegalSection[];
  disclaimer: string;
};

export type LegalLocale = Record<LegalPageKey, LegalPageContent>;

/**
 * legalDict
 *
 * - EN ist Master-Text
 * - DE ist vorsichtig formulierte Übersetzung
 * - Alle anderen Sprachen fallen aktuell auf EN zurück (siehe LegalPage).
 *
 * Hinweis: Kein Rechtsrat, nur Produkt-Information.
 */
export const legalDict: Record<string, LegalLocale> = {
  // ───────────────────────────────────────────────────────────────
  // ENGLISH – MASTER
  // ───────────────────────────────────────────────────────────────
  en: {
    privacy: {
      slug: "privacy",
      title: "Privacy Policy",
      intro:
        "This page explains how m-pathy processes personal data when you visit our site, use the product or contact us. We deliberately collect as little data as possible and use it only where it is necessary for operating and improving the service.",
      last_updated: "Last updated: 18 November 2025",
      sections: [
        {
          id: "controller",
          heading: "1. Controller and contact",
          body:
            "The controller under EU/UK data protection law is NAAL UG (limited liability), Maria-Theresia-Str. 11, 81675 Munich, Germany. For all privacy questions you can contact us at support@m-pathy.ai. We are currently building the full support infrastructure – you can always reach us via this email.",
        },
        {
          id: "data_what",
          heading: "2. What data we process",
          body:
            "We process (a) technical usage data (IP address, browser type, basic device information, timestamps, pages visited), (b) content you actively send to m-pathy (prompts, messages, files you choose to upload), (c) billing data for payments via Stripe (name, email, payment method tokens, transaction IDs) and (d) basic communication data if you contact us. We do not train a public model on your individual conversations and do not sell personal data.",
        },
        {
          id: "purposes",
          heading: "3. Purposes and legal bases",
          body:
            "We use your data to (a) provide the service and operate the technical infrastructure (Art. 6(1)(b) GDPR – performance of contract), (b) protect the platform against abuse, security incidents and fraud (Art. 6(1)(f) GDPR – legitimate interest in a secure service), (c) process payments and fulfil accounting obligations (Art. 6(1)(b) and (c) GDPR) and (d) respond to your requests (Art. 6(1)(b) and (f) GDPR). Wherever we rely on legitimate interests, we balance those interests against your rights and expectations and minimise data accordingly.",
        },
        {
          id: "ai_providers",
          heading: "4. AI infrastructure and processors",
          body:
            "m-pathy uses infrastructure and AI models provided by external vendors (for example cloud hosting providers and AI API providers). These vendors act as data processors and are bound by data processing agreements according to Art. 28 GDPR. We only share the data that is technically required to run the service. Where providers are located outside the EU/EEA, we use the mechanisms foreseen by the GDPR (for example the EU Standard Contractual Clauses) to safeguard international transfers.",
        },
        {
          id: "retention",
          heading: "5. Storage period",
          body:
            "We keep personal data only for as long as it is necessary for the respective purpose. Usage logs are retained for a limited period to ensure security and traceability, then either deleted or anonymised. Billing data is stored for the statutory retention period required by tax and commercial law. Conversation content may be stored longer if this is necessary to provide you with a coherent product experience, unless you ask us to delete specific content where we are not legally obliged to keep it.",
        },
        {
          id: "rights",
          heading: "6. Your rights",
          body:
            "You have the rights granted by applicable data protection law, in particular the right of access, rectification, erasure, restriction of processing, data portability and the right to object to certain processing based on legitimate interests. You also have the right to lodge a complaint with a supervisory authority, especially in the EU or UK member state of your habitual residence or place of work. To exercise your rights, contact us at support@m-pathy.ai – we will handle your request with care and within the legally required time limits.",
        },
      ],
      disclaimer:
        "This Privacy Policy is provided for transparency about m-pathy and does not constitute individual legal advice.",
    },

    terms: {
      slug: "terms",
      title: "Terms of Service",
      intro:
        "These Terms govern the use of m-pathy. By accessing or using the service you accept these Terms. We keep them intentionally clear and minimal – whenever something is unclear, the safer interpretation for the user applies.",
      last_updated: "Last updated: 18 November 2025",
      sections: [
        {
          id: "scope",
          heading: "1. Scope of the service",
          body:
            "m-pathy provides access to AI-supported tools for text generation, analysis and related functionality. The service is offered on a best-effort basis; we continuously improve the system but do not promise specific outcomes, availability levels or compatibility with your infrastructure. You are responsible for how you use the outputs in your own projects and for compliance with applicable law in your jurisdiction.",
        },
        {
          id: "accounts_use",
          heading: "2. Acceptable use",
          body:
            "You agree not to misuse the service, in particular not to use it for illegal activities, harassment, dissemination of harmful content, automated high-volume abuse or attempts to attack the underlying infrastructure. We may suspend or restrict access where this is necessary to protect the platform, other users or third parties. In case of doubt we choose the solution that protects people and infrastructure first.",
        },
        {
          id: "ip_content",
          heading: "3. Content and intellectual property",
          body:
            "You remain the owner of the input you provide. Subject to applicable law and the terms of our infrastructure providers, you may generally use the outputs for your own projects. You are responsible for checking whether third-party rights might be affected in your specific use case. The m-pathy brand, design elements and underlying software remain the intellectual property of NAAL UG or its licensors and may not be copied, resold or presented as your own product.",
        },
        {
          id: "no_warranty",
          heading: "4. No warranty, limitation of liability",
          body:
            "m-pathy is a complex AI system that can make mistakes, hallucinate or be incomplete. The service is provided “as is” and “as available” without guarantees regarding correctness, fitness for a particular purpose or availability. To the extent permitted by law, NAAL UG is liable only for intent and gross negligence, for damage to life, body or health and under mandatory product liability rules. In all other cases, liability for slight negligence is excluded.",
        },
        {
          id: "changes",
          heading: "5. Changes to the service and to these Terms",
          body:
            "We may adapt or extend m-pathy over time and may update these Terms where necessary, for example when features change or legal requirements evolve. For material changes we will notify you in a reasonable form. If you continue to use the service after the effective date of updated Terms, this is deemed acceptance. If you do not agree, you may stop using the service at any time.",
        },
      ],
      disclaimer:
        "These Terms summarise how m-pathy is offered. They are drafted to be fair and balanced but do not replace individual legal review for your specific use case.",
    },

    refund: {
      slug: "refund",
      title: "Refund Policy",
      intro:
        "m-pathy currently offers a clear, single-purchase model: one month of access with a defined token pool, no subscription and no automatic renewal. This Refund Policy explains how we handle payments and refunds.",
      last_updated: "Last updated: 18 November 2025",
      sections: [
        {
          id: "no_subscription",
          heading: "1. No subscription, no auto-renewal",
          body:
            "Each purchase unlocks a defined period of access and a token pool for that period. There is no ongoing subscription and no automatic renewal. When the period ends or the token pool is used, access simply expires. You will never be charged automatically for a renewal.",
        },
        {
          id: "refund_rules",
          heading: "2. Refund rules",
          body:
            "Because m-pathy is a digital service that becomes usable immediately after purchase, refunds are generally not offered once you have started using the product, except where required by applicable consumer law or where we decide to grant a goodwill refund. If technical issues on our side make reasonable use of the service impossible for you, please contact us – we will review the situation fairly and in line with the law.",
        },
        {
          id: "stripe",
          heading: "3. Payments via Stripe",
          body:
            "Payments are processed securely via Stripe. We do not store full payment instrument details on our own servers. Refunds, where granted, are processed through the same Stripe infrastructure and are subject to Stripe’s technical and banking timelines.",
        },
      ],
      disclaimer:
        "This Refund Policy describes our current practice for a simple one-month access model. If our pricing model changes in the future, this Policy will be updated accordingly.",
    },

    legal: {
      slug: "legal",
      title: "Legal Notice",
      intro:
        "This page summarises key legal information about m-pathy, intellectual property and applicable law.",
      last_updated: "Last updated: 18 November 2025",
      sections: [
        {
          id: "provider",
          heading: "1. Service provider",
          body:
            "The service m-pathy is operated by NAAL UG (limited liability), Maria-Theresia-Str. 11, 81675 Munich, Germany. Further company information, including registration details, will be added as the corporate structure evolves.",
        },
        {
          id: "ip",
          heading: "2. Intellectual property",
          body:
            "All rights in the m-pathy platform, including the underlying software, design, logo, texts, graphics and other content created by us, remain with NAAL UG or its licensors. You may not reproduce, distribute or publicly display substantial parts of the service without our consent, except where such use is clearly permitted by law.",
        },
        {
          id: "links",
          heading: "3. External links",
          body:
            "Where m-pathy links to external websites or resources, these are provided for convenience only. We have no influence over their content and do not adopt them as our own. At the time the link was created, no unlawful content was recognisable. Should we become aware of legal issues, we will remove the respective links where reasonably possible.",
        },
        {
          id: "law",
          heading: "4. Applicable law and disputes",
          body:
            "Unless mandatory consumer protection rules of your home country state otherwise, the laws of the Federal Republic of Germany apply, excluding the conflict-of-laws rules. For business users the place of jurisdiction is Munich, Germany. For consumers within the EU or UK the statutory venue rules apply.",
        },
      ],
      disclaimer:
        "This Legal Notice provides high-level information about the provider and legal framework of m-pathy and does not replace personalised legal advice.",
    },

    imprint: {
      slug: "imprint",
      title: "Imprint",
      intro:
        "This imprint contains the information required for service providers under German and certain EU/EEA laws.",
      last_updated: "Last updated: 18 November 2025",
      sections: [
        {
          id: "company",
          heading: "1. Provider",
          body:
            "NAAL UG (haftungsbeschränkt)\nMaria-Theresia-Str. 11\n81675 München\nDeutschland",
        },
        {
          id: "contact",
          heading: "2. Contact",
          body: "E-Mail: support@m-pathy.ai\nFurther contact channels will be added as the infrastructure matures.",
        },
        {
          id: "representative",
          heading: "3. Legal representative",
          body:
            "Managing director (Geschäftsführer): will be specified in the final commercial register entry once the incorporation steps are completed.",
        },
        {
          id: "register",
          heading: "4. Commercial register",
          body:
            "Registration at the local commercial register (Handelsregister) is in preparation. The register court and registration number will be added as soon as they are officially available.",
        },
      ],
      disclaimer:
        "This imprint will be updated as soon as additional company details (for example register number) become available.",
    },
  },

  // ───────────────────────────────────────────────────────────────
  // DEUTSCH – VORSICHTIG, BENUTZERFREUNDLICH
  // ───────────────────────────────────────────────────────────────
  de: {
    privacy: {
      slug: "privacy",
      title: "Datenschutzerklärung",
      intro:
        "Auf dieser Seite erklären wir, welche personenbezogenen Daten m-pathy verarbeitet, wenn du unsere Seite besuchst, das Produkt nutzt oder mit uns Kontakt aufnimmst. Wir erheben bewusst so wenig Daten wie möglich und nutzen sie nur dort, wo es für Betrieb und Verbesserung des Dienstes nötig ist.",
      last_updated: "Zuletzt aktualisiert: 18. November 2025",
      sections: [
        {
          id: "controller",
          heading: "1. Verantwortlicher und Kontakt",
          body:
            "Verantwortlicher im Sinne der DSGVO ist die NAAL UG (haftungsbeschränkt), Maria-Theresia-Str. 11, 81675 München, Deutschland. Für alle Datenschutz-Anliegen kannst du uns unter support@m-pathy.ai erreichen. Die vollständige Support-Infrastruktur befindet sich im Aufbau – diese Adresse ist dein sicherer Einstiegspunkt.",
        },
        {
          id: "data_what",
          heading: "2. Welche Daten wir verarbeiten",
          body:
            "Wir verarbeiten (a) technische Nutzungsdaten (IP-Adresse, Browsertyp, einfache Geräte-Infos, Zeitstempel, besuchte Seiten), (b) Inhalte, die du aktiv an m-pathy sendest (Prompts, Nachrichten, von dir hochgeladene Dateien), (c) Abrechnungsdaten für Zahlungen über Stripe (Name, E-Mail, Zahlungs-Token, Transaktions-IDs) und (d) Basis-Kommunikationsdaten, wenn du uns kontaktierst. Wir trainieren kein öffentliches Modell auf deinen individuellen Gesprächen und verkaufen keine personenbezogenen Daten.",
        },
        {
          id: "purposes",
          heading: "3. Zwecke und Rechtsgrundlagen",
          body:
            "Wir nutzen deine Daten, um (a) den Dienst bereitzustellen und die technische Infrastruktur zu betreiben (Art. 6 Abs. 1 lit. b DSGVO – Vertragserfüllung), (b) die Plattform vor Missbrauch, Sicherheitsvorfällen und Betrug zu schützen (Art. 6 Abs. 1 lit. f DSGVO – berechtigtes Interesse an einem sicheren Dienst), (c) Zahlungen abzuwickeln und gesetzliche Aufbewahrungspflichten zu erfüllen (Art. 6 Abs. 1 lit. b und c DSGVO) und (d) auf deine Anfragen zu antworten (Art. 6 Abs. 1 lit. b und f DSGVO). Wo wir uns auf berechtigte Interessen stützen, nehmen wir eine sorgfältige Interessenabwägung vor und minimieren die Daten.",
        },
        {
          id: "ai_providers",
          heading: "4. KI-Infrastruktur und Auftragsverarbeiter",
          body:
            "m-pathy nutzt Infrastruktur und KI-Modelle externer Anbieter (z. B. Cloud-Hoster und KI-API-Provider). Diese handeln als Auftragsverarbeiter nach Art. 28 DSGVO und sind vertraglich gebunden. Wir geben nur die Daten weiter, die technisch zur Erbringung des Dienstes erforderlich sind. Bei Anbietern außerhalb der EU/des EWR nutzen wir die von der DSGVO vorgesehenen Mechanismen (z. B. EU-Standardvertragsklauseln), um internationale Datentransfers abzusichern.",
        },
        {
          id: "retention",
          heading: "5. Speicherdauer",
          body:
            "Wir speichern personenbezogene Daten nur so lange, wie es für den jeweiligen Zweck erforderlich ist. Nutzungsprotokolle werden für eine begrenzte Zeit zur Sicherstellung von Sicherheit und Nachvollziehbarkeit aufbewahrt und anschließend gelöscht oder anonymisiert. Abrechnungsdaten werden für die gesetzlich vorgeschriebenen Zeiträume nach Handels- und Steuerrecht gespeichert. Gesprächsinhalte können länger gespeichert werden, soweit dies für eine konsistente Produkt-Erfahrung erforderlich ist, sofern du nicht die Löschung bestimmter Inhalte verlangst und keine gesetzlichen Aufbewahrungspflichten entgegenstehen.",
        },
        {
          id: "rights",
          heading: "6. Deine Rechte",
          body:
            "Du hast die gesetzlichen Betroffenenrechte, insbesondere auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit sowie das Recht, bestimmten Verarbeitungen aus Gründen deiner besonderen Situation zu widersprechen. Außerdem hast du das Recht auf Beschwerde bei einer Datenschutz-Aufsichtsbehörde, insbesondere in dem EU- oder UK-Mitgliedstaat deines gewöhnlichen Aufenthalts oder deines Arbeitsplatzes. Für die Ausübung deiner Rechte kannst du uns jederzeit unter support@m-pathy.ai kontaktieren.",
        },
      ],
      disclaimer:
        "Diese Datenschutzerklärung informiert über die Verarbeitung bei m-pathy und stellt keine individuelle Rechtsberatung dar.",
    },

    terms: {
      slug: "terms",
      title: "Nutzungsbedingungen",
      intro:
        "Diese Bedingungen regeln die Nutzung von m-pathy. Mit Zugriff auf den Dienst akzeptierst du diese Regeln. Wir halten sie bewusst klar und schlank – im Zweifel wählen wir die nutzerfreundlichere Auslegung.",
      last_updated: "Zuletzt aktualisiert: 18. November 2025",
      sections: [
        {
          id: "scope",
          heading: "1. Leistungsumfang",
          body:
            "m-pathy stellt KI-gestützte Werkzeuge für Textgenerierung, Analyse und verwandte Funktionen bereit. Der Dienst wird nach dem Prinzip „best effort“ erbracht; wir verbessern das System laufend, versprechen aber keine bestimmten Ergebnisse, Verfügbarkeiten oder Kompatibilität mit deiner Infrastruktur. Du bist selbst dafür verantwortlich, wie du die Ausgaben in deinen Projekten einsetzt und ob dies mit den in deinem Land geltenden Vorschriften vereinbar ist.",
        },
        {
          id: "acceptable_use",
          heading: "2. Zulässige Nutzung",
          body:
            "Du verpflichtest dich, den Dienst nicht missbräuchlich zu nutzen, insbesondere nicht für rechtswidrige Aktivitäten, Belästigung, die Verbreitung schädlicher Inhalte, automatisierte Massenabfragen oder Angriffe auf die Infrastruktur. Wir können den Zugang sperren oder einschränken, wenn dies erforderlich ist, um die Plattform, andere Nutzer oder Dritte zu schützen. Im Zweifel wählen wir die Variante, die Menschen und Infrastruktur zuerst schützt.",
        },
        {
          id: "ip_content",
          heading: "3. Inhalte und Schutzrechte",
          body:
            "Du bleibst Inhaber der Inhalte, die du eingibst. Vorbehaltlich der Regeln unserer Infrastruktur-Anbieter darfst du die Ausgaben in der Regel für deine Projekte nutzen. Du bist dafür verantwortlich zu prüfen, ob in deinem konkreten Use Case Rechte Dritter betroffen sein könnten. Marke, Design und zugrundeliegende Software von m-pathy bleiben geistiges Eigentum der NAAL UG oder ihrer Lizenzgeber und dürfen ohne Zustimmung nicht als eigenes Produkt ausgegeben oder weiterverkauft werden.",
        },
        {
          id: "no_warranty",
          heading: "4. Haftungsausschluss",
          body:
            "m-pathy ist ein komplexes KI-System und kann Fehler machen, Halluzinationen erzeugen oder unvollständig sein. Der Dienst wird „wie besehen“ und „wie verfügbar“ bereitgestellt, ohne Garantie für Richtigkeit, Eignung für einen bestimmten Zweck oder Verfügbarkeit. Soweit gesetzlich zulässig, haftet die NAAL UG nur bei Vorsatz und grober Fahrlässigkeit, bei Schäden an Leben, Körper oder Gesundheit sowie nach zwingenden Produkthaftungsregeln. Im Übrigen ist die Haftung für einfache Fahrlässigkeit ausgeschlossen.",
        },
        {
          id: "changes",
          heading: "5. Änderungen am Dienst und an diesen Bedingungen",
          body:
            "Wir können m-pathy im Laufe der Zeit anpassen oder erweitern und diese Bedingungen bei Bedarf aktualisieren, etwa wenn sich Funktionen ändern oder neue rechtliche Anforderungen gelten. Bei wesentlichen Änderungen informieren wir dich in angemessener Form. Wenn du den Dienst danach weiter nutzt, gilt dies als Zustimmung. Wenn du nicht einverstanden bist, kannst du die Nutzung jederzeit beenden.",
        },
      ],
      disclaimer:
        "Diese Nutzungsbedingungen sollen fair und ausgewogen sein, ersetzen aber keine individuelle rechtliche Prüfung deines konkreten Einsatzes.",
    },

    refund: {
      slug: "refund",
      title: "Rückerstattungsrichtlinie",
      intro:
        "m-pathy bietet aktuell ein klares Einmal-Modell: ein Monat Zugang mit definiertem Token-Pool, kein Abo, keine automatische Verlängerung. Diese Richtlinie erklärt, wie wir mit Zahlungen und Erstattungen umgehen.",
      last_updated: "Zuletzt aktualisiert: 18. November 2025",
      sections: [
        {
          id: "no_subscription",
          heading: "1. Kein Abo, keine automatische Verlängerung",
          body:
            "Mit jedem Kauf wird ein definierter Zeitraum und ein Token-Pool für diesen Zeitraum freigeschaltet. Es gibt kein laufendes Abonnement und keine automatische Verlängerung. Wenn der Zeitraum endet oder der Token-Pool verbraucht ist, läuft der Zugang einfach aus. Es erfolgen keine automatischen Abbuchungen.",
        },
        {
          id: "refund_rules",
          heading: "2. Regeln für Rückerstattungen",
          body:
            "Da es sich um einen digitalen Dienst handelt, der unmittelbar nach dem Kauf nutzbar ist, werden in der Regel keine Rückerstattungen gewährt, sobald du mit der Nutzung begonnen hast – außer dort, wo zwingende Verbraucherschutzvorschriften etwas anderes verlangen oder wir aus Kulanz eine Erstattung anbieten. Falls technische Probleme auf unserer Seite eine sinnvolle Nutzung unmöglich machen, melde dich bitte bei uns – wir prüfen den Fall fair und im Rahmen der gesetzlichen Vorgaben.",
        },
        {
          id: "stripe",
          heading: "3. Zahlungen über Stripe",
          body:
            "Zahlungen werden sicher über Stripe verarbeitet. Wir speichern keine vollständigen Zahlungsdaten auf unseren eigenen Servern. Rückerstattungen, sofern gewährt, werden über dieselbe Infrastruktur abgewickelt und unterliegen den technischen Abläufen von Stripe und den beteiligten Banken.",
        },
      ],
      disclaimer:
        "Diese Rückerstattungsrichtlinie beschreibt das aktuelle Modell eines einfachen Monatszugangs. Ändert sich unser Preismodell, wird diese Richtlinie entsprechend angepasst.",
    },

    legal: {
      slug: "legal",
      title: "Rechtliche Hinweise",
      intro:
        "Diese Seite fasst zentrale rechtliche Informationen zu m-pathy, geistigem Eigentum und anwendbarem Recht zusammen.",
      last_updated: "Zuletzt aktualisiert: 18. November 2025",
      sections: [
        {
          id: "provider",
          heading: "1. Diensteanbieter",
          body:
            "Der Dienst m-pathy wird betrieben von NAAL UG (haftungsbeschränkt), Maria-Theresia-Str. 11, 81675 München, Deutschland. Weitere Unternehmensangaben, einschließlich Registerdaten, werden ergänzt, sobald die entsprechende Struktur finalisiert ist.",
        },
        {
          id: "ip",
          heading: "2. Geistiges Eigentum",
          body:
            "Sämtliche Rechte an der Plattform m-pathy, insbesondere Software, Layout, Logo, Texte, Grafiken und sonstige von uns erstellte Inhalte, stehen der NAAL UG oder ihren Lizenzgebern zu. Eine Vervielfältigung, Verbreitung oder öffentliche Zugänglichmachung wesentlicher Teile des Dienstes ist ohne unsere Zustimmung nicht gestattet, soweit nicht das Gesetz im Einzelfall etwas anderes erlaubt.",
        },
        {
          id: "links",
          heading: "3. Externe Links",
          body:
            "Soweit m-pathy auf externe Webseiten oder Ressourcen verlinkt, dienen diese Links lediglich der Orientierung. Auf deren Inhalte haben wir keinen Einfluss und machen sie uns nicht zu eigen. Zum Zeitpunkt der Verlinkung waren keine Rechtsverstöße erkennbar. Sollten wir von Rechtsverstößen erfahren, entfernen wir die betreffenden Links im Rahmen des Zumutbaren.",
        },
        {
          id: "law",
          heading: "4. Anwendbares Recht und Streitbeilegung",
          body:
            "Es gilt das Recht der Bundesrepublik Deutschland, soweit nicht zwingende Verbraucherschutzvorschriften deines Heimatlandes etwas anderes bestimmen. Für Unternehmer ist Gerichtsstand München. Für Verbraucher innerhalb der EU bzw. des UK gelten die gesetzlichen Gerichtsstandsregelungen.",
        },
      ],
      disclaimer:
        "Diese rechtlichen Hinweise bieten einen Überblick über Rahmenbedingungen von m-pathy und ersetzen keine individuelle Rechtsberatung.",
    },

    imprint: {
      slug: "imprint",
      title: "Impressum",
      intro:
        "Dieses Impressum enthält die Angaben, die für Diensteanbieter nach deutschem und teilweise europäischem Recht erforderlich sind.",
      last_updated: "Zuletzt aktualisiert: 18. November 2025",
      sections: [
        {
          id: "company",
          heading: "1. Anbieter",
          body:
            "NAAL UG (haftungsbeschränkt)\nMaria-Theresia-Str. 11\n81675 München\nDeutschland",
        },
        {
          id: "contact",
          heading: "2. Kontakt",
          body:
            "E-Mail: support@m-pathy.ai\nWeitere Kontaktwege werden ergänzt, sobald die Infrastruktur steht.",
        },
        {
          id: "representative",
          heading: "3. Vertretungsberechtigte Person",
          body:
            "Geschäftsführer: wird nachgetragen, sobald der Handelsregistereintrag endgültig vorliegt.",
        },
        {
          id: "register",
          heading: "4. Registereintrag",
          body:
            "Die Eintragung im Handelsregister ist in Vorbereitung. Registergericht und Registernummer werden nachgetragen, sobald sie offiziell vorliegen.",
        },
      ],
      disclaimer:
        "Dieses Impressum wird aktualisiert, sobald weitere Unternehmensdaten (z. B. Registernummer) vorliegen.",
    },
  },
};
