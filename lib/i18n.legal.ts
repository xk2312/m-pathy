// lib/i18n.legal.ts

export type LegalPageKey = "imprint" | "privacy" | "terms" | "refund" | "legal";

type LegalSection = {
  id: string;
  heading: string;
  body: string;
};

type LegalPage = {
  slug: LegalPageKey;
  title: string;
  intro: string;
  last_updated: string;
  sections: LegalSection[];
  disclaimer: string;
};

type LegalLocale = Record<LegalPageKey, LegalPage>;

// ---------------------------------------------------------------------
// MASTER LEGAL DICT – EN, DE, FR
// ---------------------------------------------------------------------

export const legalDict: Record<string, LegalLocale> = {
  // ================================================================
  // ENGLISH
  // ================================================================
  en: {
    // ------------------------- IMPRESSUM -------------------------
    imprint: {
      slug: "imprint",
      title: "Imprint",
      intro:
        "This imprint contains the provider information that is required for m-pathy under German and partly European law.",
      last_updated: "Last updated: 18 November 2025",
      sections: [
        {
          id: "provider",
          heading: "1. Provider",
          body:
            "NAAL UG (limited liability)\n" +
            "Maria-Theresia-Str. 11\n" +
            "81675 Munich\n" +
            "Germany\n\n" +
            "E-mail: support@m-pathy.ai",
        },
        {
          id: "representative",
          heading: "2. Managing director",
          body: "Managing director: Alexander Khayat.",
        },
        {
          id: "register",
          heading: "3. Commercial register entry",
          body:
            "NAAL UG (limited liability) is entered in the commercial register. " +
            "The register court and registration number will be added as soon as they are finally available.",
        },
        {
          id: "vat",
          heading: "4. VAT ID",
          body:
            "If a VAT identification number is issued, it will be added here.",
        },
        {
          id: "contact",
          heading: "5. Contact",
          body:
            "The fastest way to contact us about m-pathy is currently by e-mail to support@m-pathy.ai. " +
            "Please do not send any sensitive health or payment data by e-mail.",
        },
      ],
      disclaimer:
        "This imprint is provided for transparency only and does not replace individual legal advice.",
    },

    // ------------------------- PRIVACY ---------------------------
    privacy: {
      slug: "privacy",
      title: "Privacy Policy",
      intro:
        "This Privacy Policy explains in simple terms how we handle personal data when you use m-pathy.",
      last_updated: "Last updated: 18 November 2025",
      sections: [
        {
          id: "controller",
          heading: "1. Controller",
          body:
            "The controller responsible for data processing in connection with m-pathy is:\n\n" +
            "NAAL UG (limited liability)\n" +
            "Maria-Theresia-Str. 11\n" +
            "81675 Munich, Germany\n" +
            "E-mail: support@m-pathy.ai",
        },
        {
          id: "data_categories",
          heading: "2. Categories of data",
          body:
            "We process, as far as necessary, the following categories of data:\n" +
            "• Usage data and log data of the website\n" +
            "• Account and contact data that you actively provide\n" +
            "• Content of your prompts and responses that you actively send to the system\n" +
            "• Technical metadata such as time, browser type and basic device information",
        },
        {
          id: "purposes",
          heading: "3. Purposes and legal bases",
          body:
            "We use your data in particular\n" +
            "• to provide and operate m-pathy,\n" +
            "• to secure and technically maintain the service,\n" +
            "• to answer support requests and\n" +
            "• to comply with statutory retention and documentation duties.\n\n" +
            "If and to the extent that the GDPR applies, the legal bases are in particular Art. 6(1)(b) GDPR (contract), " +
            "Art. 6(1)(c) GDPR (legal obligation) and Art. 6(1)(f) GDPR (legitimate interests in secure and efficient operation).",
        },
        {
          id: "processors",
          heading: "4. Processors and recipients",
          body:
            "We use carefully selected service providers for hosting, infrastructure, analytics without personal profiles " +
            "and payment processing (for example Stripe). These processors are contractually bound to process data " +
            "only according to our instructions and in line with applicable data protection law.",
        },
        {
          id: "retention",
          heading: "5. Storage period",
          body:
            "We store personal data only for as long as it is necessary for the purposes described or as required by law. " +
            "Log data are usually kept for a short technical period only. Contract-relevant data may be stored for longer " +
            "in order to comply with commercial and tax retention obligations.",
        },
        {
          id: "rights",
          heading: "6. Your rights",
          body:
            "Where the GDPR applies, you have in particular the right of access, rectification, erasure, restriction of processing, " +
            "data portability and the right to object to certain processing. You also have the right to lodge a complaint with a data protection authority.",
        },
        {
          id: "ai",
          heading: "7. Use of AI services",
          body:
            "m-pathy uses AI models that process the prompts you send. We pay attention to technical and organizational measures " +
            "to protect your data, but no system can be perfectly secure. Please do not enter highly sensitive content that you would never " +
            "want to leave your device.",
        },
      ],
      disclaimer:
        "This Privacy Policy is a simplified summary and does not replace a full legal review for your individual case.",
    },

    // --------------------------- TERMS ---------------------------
    terms: {
      slug: "terms",
      title: "Terms of Use",
      intro:
        "These Terms govern how you may use m-pathy. By using the service, you agree to them.",
      last_updated: "Last updated: 18 November 2025",
      sections: [
        {
          id: "scope",
          heading: "1. Scope of the service",
          body:
            "m-pathy is an experimental AI-based assistant. It is not a human therapist, lawyer, doctor or financial advisor. " +
            "The service is provided for creative work, reflection and technical assistance only.",
        },
        {
          id: "no_advice",
          heading: "2. No professional advice",
          body:
            "Content generated by m-pathy must never be used as the sole basis for medical, legal, financial or other decisions " +
            "with serious consequences. Always consult qualified professionals for such questions.",
        },
        {
          id: "account",
          heading: "3. Account and tokens",
          body:
            "Access may be granted for a limited period and/or with a defined token pool. You are responsible for keeping your " +
            "access credentials confidential and for all activity under your account.",
        },
        {
          id: "acceptable_use",
          heading: "4. Acceptable use",
          body:
            "You may not use m-pathy to violate applicable law, to harm others, to generate unlawful content or to attack systems. " +
            "We may block or restrict accounts that misuse the service.",
        },
        {
          id: "changes",
          heading: "5. Changes and availability",
          body:
            "We may adapt, extend or discontinue individual features of m-pathy at any time, as long as this is reasonable for users. " +
            "We strive for high availability but cannot guarantee uninterrupted operation.",
        },
        {
          id: "liability",
          heading: "6. Limitation of liability",
          body:
            "We are liable for intent and gross negligence according to applicable law. For slight negligence we are only liable " +
            "for breach of essential contractual duties and limited to the typical, foreseeable damage. Mandatory liability, " +
            "for example under product liability law, remains unaffected.",
        },
      ],
      disclaimer:
        "These Terms are a simplified summary to structure the contractual relationship and do not replace individual legal advice.",
    },

    // -------------------------- REFUND ---------------------------
    refund: {
      slug: "refund",
      title: "Refund Policy",
      intro:
        "m-pathy currently offers a clear, one-time purchase model. This Refund Policy explains how we handle payments and refunds.",
      last_updated: "Last updated: 18 November 2025",
      sections: [
        {
          id: "model",
          heading: "1. Purchase model",
          body:
            "At the moment, access to m-pathy is granted as a one-time purchase for a defined period and/or a defined token pool. " +
            "There is no automatic subscription renewal.",
        },
        {
          id: "payment",
          heading: "2. Payment processing",
          body:
            "Payments are processed via Stripe or comparable payment providers. The terms and security measures of the payment provider apply in addition.",
        },
        {
          id: "withdrawal",
          heading: "3. Right of withdrawal",
          body:
            "If you are a consumer in the European Union, you may have a statutory right of withdrawal for digital services. " +
            "You are informed about this right during the checkout process, if applicable.",
        },
        {
          id: "refunds",
          heading: "4. Refunds in practice",
          body:
            "We generally do not offer refunds once access has been granted and tokens can be used, unless there is a legal obligation " +
            "or we expressly promise a refund in individual cases.",
        },
      ],
      disclaimer:
        "This Refund Policy summarises our current practice and does not limit mandatory statutory rights.",
    },

    // --------------------------- LEGAL ---------------------------
    legal: {
      slug: "legal",
      title: "Legal Information",
      intro:
        "This page brings together key legal information about m-pathy in one place.",
      last_updated: "Last updated: 18 November 2025",
      sections: [
        {
          id: "overview",
          heading: "1. Overview",
          body:
            "m-pathy is operated by NAAL UG (limited liability), based in Munich, Germany. " +
            "The service combines advanced AI models with a strong focus on privacy, clarity and user control.",
        },
        {
          id: "jurisdiction",
          heading: "2. Applicable law and jurisdiction",
          body:
            "Unless mandatory consumer protection law provides otherwise, German law applies. " +
            "If you are a merchant under German law, the exclusive place of jurisdiction is Munich.",
        },
        {
          id: "online_dispute",
          heading: "3. Online dispute resolution",
          body:
            "The European Commission provides a platform for online dispute resolution (ODR). We are neither obliged nor in principle willing " +
            "to participate in such dispute resolution procedures before a consumer arbitration board.",
        },
      ],
      disclaimer:
        "This page is intended to provide a transparent overview. In case of conflict, the German version may prevail where required by law.",
    },
  },

  // ================================================================
  // DEUTSCH
  // ================================================================
  de: {
    // ------------------------- IMPRESSUM -------------------------
    imprint: {
      slug: "imprint",
      title: "Impressum",
      intro:
        "Dieses Impressum enthält die Angaben, die für m-pathy nach deutschem und teilweise europäischem Recht erforderlich sind.",
      last_updated: "Zuletzt aktualisiert: 18. November 2025",
      sections: [
        {
          id: "provider",
          heading: "1. Anbieter",
          body:
            "NAAL UG (haftungsbeschränkt)\n" +
            "Maria-Theresia-Str. 11\n" +
            "81675 München\n" +
            "Deutschland\n\n" +
            "E-Mail: support@m-pathy.ai",
        },
        {
          id: "representative",
          heading: "2. Vertretungsberechtigte Person",
          body: "Geschäftsführer: Alexander Khayat.",
        },
        {
          id: "register",
          heading: "3. Registereintrag",
          body:
            "Die Gesellschaft ist im Handelsregister eingetragen. " +
            "Registergericht und Registernummer werden nachgetragen, sobald sie offiziell vorliegen.",
        },
        {
          id: "vat",
          heading: "4. Umsatzsteuer-ID",
          body:
            "Sofern eine Umsatzsteuer-Identifikationsnummer vergeben wird, wird sie hier ergänzt.",
        },
        {
          id: "contact",
          heading: "5. Kontakt",
          body:
            "Der derzeit schnellste Weg, uns zu m-pathy zu erreichen, ist per E-Mail an support@m-pathy.ai. " +
            "Bitte übermitteln Sie per E-Mail keine besonders sensiblen Gesundheits- oder Zahlungsdaten.",
        },
      ],
      disclaimer:
        "Dieses Impressum dient der Transparenz und ersetzt keine individuelle rechtliche Beratung.",
    },

    // ------------------------- DATENSCHUTZ ------------------------
    privacy: {
      slug: "privacy",
      title: "Datenschutzerklärung",
      intro:
        "Diese Datenschutzerklärung beschreibt in einfacher Form, wie wir personenbezogene Daten bei der Nutzung von m-pathy verarbeiten.",
      last_updated: "Zuletzt aktualisiert: 18. November 2025",
      sections: [
        {
          id: "controller",
          heading: "1. Verantwortlicher",
          body:
            "Verantwortlich für die Datenverarbeitung im Zusammenhang mit m-pathy ist:\n\n" +
            "NAAL UG (haftungsbeschränkt)\n" +
            "Maria-Theresia-Str. 11\n" +
            "81675 München, Deutschland\n" +
            "E-Mail: support@m-pathy.ai",
        },
        {
          id: "data_categories",
          heading: "2. Kategorien von Daten",
          body:
            "Wir verarbeiten – soweit erforderlich – insbesondere folgende Datenkategorien:\n" +
            "• Nutzungs- und Protokolldaten der Website\n" +
            "• Konto- und Kontaktdaten, die Sie aktiv bereitstellen\n" +
            "• Inhalte Ihrer Prompts und Antworten, die Sie aktiv an das System senden\n" +
            "• Technische Metadaten wie Zeitpunkt, Browsertyp und grundlegende Geräteinformationen",
        },
        {
          id: "purposes",
          heading: "3. Zwecke und Rechtsgrundlagen",
          body:
            "Wir nutzen Ihre Daten insbesondere\n" +
            "• zur Bereitstellung und zum Betrieb von m-pathy,\n" +
            "• zur Sicherheit und technischen Wartung des Dienstes,\n" +
            "• zur Beantwortung von Supportanfragen sowie\n" +
            "• zur Erfüllung gesetzlicher Aufbewahrungs- und Dokumentationspflichten.\n\n" +
            "Soweit die DSGVO Anwendung findet, stützen wir die Verarbeitung insbesondere auf Art. 6 Abs. 1 lit. b DSGVO (Vertrag), " +
            "Art. 6 Abs. 1 lit. c DSGVO (rechtliche Verpflichtung) und Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einem sicheren und effizienten Betrieb).",
        },
        {
          id: "processors",
          heading: "4. Auftragsverarbeiter und Empfänger",
          body:
            "Wir setzen sorgfältig ausgewählte Dienstleister für Hosting, Infrastruktur, nicht-profilbasiertes Analytics " +
            "und Zahlungsabwicklung (z. B. Stripe) ein. Diese sind vertraglich verpflichtet, Daten nur nach unserer Weisung " +
            "und im Einklang mit dem geltenden Datenschutzrecht zu verarbeiten.",
        },
        {
          id: "retention",
          heading: "5. Speicherdauer",
          body:
            "Personenbezogene Daten werden nur so lange gespeichert, wie dies für die genannten Zwecke erforderlich ist " +
            "oder wie wir rechtlich dazu verpflichtet sind. Protokolldaten werden in der Regel nur für einen kurzen technischen Zeitraum vorgehalten. " +
            "Vertragsrelevante Daten können aufgrund handels- und steuerrechtlicher Vorgaben länger gespeichert werden.",
        },
        {
          id: "rights",
          heading: "6. Ihre Rechte",
          body:
            "Soweit die DSGVO Anwendung findet, haben Sie insbesondere das Recht auf Auskunft, Berichtigung, Löschung, " +
            "Einschränkung der Verarbeitung, Datenübertragbarkeit sowie das Recht, bestimmten Verarbeitungen zu widersprechen. " +
            "Zudem haben Sie das Recht auf Beschwerde bei einer Datenschutzaufsichtsbehörde.",
        },
        {
          id: "ai",
          heading: "7. Einsatz von KI-Diensten",
          body:
            "m-pathy nutzt KI-Modelle, die die von Ihnen gesendeten Prompts verarbeiten. Wir achten auf technische und organisatorische Maßnahmen " +
            "zum Schutz Ihrer Daten, dennoch kann kein System absolut sicher sein. Geben Sie daher nach Möglichkeit keine hochsensiblen Inhalte ein, " +
            "die Ihr Gerät niemals verlassen sollten.",
        },
      ],
      disclaimer:
        "Diese Datenschutzerklärung ist eine vereinfachte Zusammenfassung und ersetzt keine vollständige rechtliche Prüfung Ihres Einzelfalls.",
    },

    // --------------------------- NUTZUNGSBEDINGUNGEN --------------
    terms: {
      slug: "terms",
      title: "Nutzungsbedingungen",
      intro:
        "Diese Nutzungsbedingungen regeln, wie Sie m-pathy verwenden dürfen. Mit der Nutzung stimmen Sie ihnen zu.",
      last_updated: "Zuletzt aktualisiert: 18. November 2025",
      sections: [
        {
          id: "scope",
          heading: "1. Leistungsumfang",
          body:
            "m-pathy ist ein experimenteller, KI-basierter Assistent. Er ist kein menschlicher Therapeut, Anwalt, Arzt oder Finanzberater. " +
            "Der Dienst dient der kreativen Arbeit, Reflexion und technischen Unterstützung.",
        },
        {
          id: "no_advice",
          heading: "2. Keine professionelle Beratung",
          body:
            "Von m-pathy generierte Inhalte dürfen nicht als alleinige Grundlage für medizinische, rechtliche, finanzielle oder andere " +
            "Entscheidungen mit gravierenden Folgen verwendet werden. Holen Sie in solchen Fällen immer qualifizierten fachlichen Rat ein.",
        },
        {
          id: "account",
          heading: "3. Zugang und Tokens",
          body:
            "Der Zugang kann zeitlich und/oder durch einen bestimmten Token-Pool begrenzt sein. Sie sind dafür verantwortlich, Ihre Zugangsdaten " +
            "vertraulich zu behandeln und für alle Aktivitäten unter Ihrem Zugang.",
        },
        {
          id: "acceptable_use",
          heading: "4. Zulässige Nutzung",
          body:
            "Sie dürfen m-pathy nicht nutzen, um geltendes Recht zu verletzen, anderen zu schaden, rechtswidrige Inhalte zu erzeugen " +
            "oder Systeme anzugreifen. Wir können Zugänge sperren oder beschränken, wenn der Dienst missbräuchlich verwendet wird.",
        },
        {
          id: "changes",
          heading: "5. Änderungen und Verfügbarkeit",
          body:
            "Wir können Funktionsumfang und Darstellung von m-pathy jederzeit anpassen, erweitern oder einschränken, sofern dies für Nutzer zumutbar ist. " +
            "Wir bemühen uns um hohe Verfügbarkeit, können aber keinen unterbrechungsfreien Betrieb garantieren.",
        },
        {
          id: "liability",
          heading: "6. Haftungsbeschränkung",
          body:
            "Wir haften nach den gesetzlichen Vorschriften für Vorsatz und grobe Fahrlässigkeit. Bei leichter Fahrlässigkeit haften wir nur " +
            "für die Verletzung wesentlicher Vertragspflichten und begrenzt auf den typischerweise vorhersehbaren Schaden. " +
            "Zwingende Haftung, etwa nach dem Produkthaftungsgesetz, bleibt unberührt.",
        },
      ],
      disclaimer:
        "Diese Nutzungsbedingungen strukturieren das Vertragsverhältnis in vereinfachter Form und ersetzen keine individuelle Rechtsberatung.",
    },

    // --------------------------- RÜCKERSTATTUNG -------------------
    refund: {
      slug: "refund",
      title: "Rückerstattungsrichtlinie",
      intro:
        "m-pathy bietet derzeit ein klares Modell mit einmaligem Erwerb von Zugang. Diese Richtlinie erklärt den Umgang mit Zahlungen und Rückerstattungen.",
      last_updated: "Zuletzt aktualisiert: 18. November 2025",
      sections: [
        {
          id: "model",
          heading: "1. Kaufmodell",
          body:
            "Der Zugang zu m-pathy erfolgt derzeit als einmaliger Kauf für einen definierten Zeitraum und/oder einen definierten Token-Pool. " +
            "Es gibt keine automatische Verlängerung als Abonnement.",
        },
        {
          id: "payment",
          heading: "2. Zahlungsabwicklung",
          body:
            "Zahlungen werden über Stripe oder vergleichbare Zahlungsdienstleister abgewickelt. Deren Bedingungen und Sicherheitsmaßnahmen gelten ergänzend.",
        },
        {
          id: "withdrawal",
          heading: "3. Widerrufsrecht",
          body:
            "Sind Sie Verbraucherin oder Verbraucher in der Europäischen Union, kann Ihnen bei digitalen Diensten ein gesetzliches Widerrufsrecht zustehen. " +
            "Über dieses Recht werden Sie – soweit einschlägig – im Bestellprozess informiert.",
        },
        {
          id: "refunds",
          heading: "4. Rückerstattungen in der Praxis",
          body:
            "In der Regel gewähren wir keine Rückerstattungen, sobald der Zugang freigeschaltet ist und Tokens genutzt werden können, " +
            "sofern keine gesetzliche Verpflichtung besteht oder wir im Einzelfall ausdrücklich eine Rückerstattung zusagen.",
        },
      ],
      disclaimer:
        "Diese Rückerstattungsrichtlinie beschreibt unsere aktuelle Praxis und beschränkt keine zwingenden gesetzlichen Rechte.",
    },

    // --------------------------- RECHTLICHE HINWEISE --------------
    legal: {
      slug: "legal",
      title: "Rechtliche Hinweise",
      intro:
        "Auf dieser Seite bündeln wir zentrale rechtliche Informationen zu m-pathy.",
      last_updated: "Zuletzt aktualisiert: 18. November 2025",
      sections: [
        {
          id: "overview",
          heading: "1. Überblick",
          body:
            "m-pathy wird von der NAAL UG (haftungsbeschränkt) mit Sitz in München betrieben. " +
            "Der Dienst verbindet fortgeschrittene KI-Modelle mit einem starken Fokus auf Datenschutz, Klarheit und Nutzerkontrolle.",
        },
        {
          id: "jurisdiction",
          heading: "2. Anwendbares Recht und Gerichtsstand",
          body:
            "Es gilt deutsches Recht, soweit nicht zwingende Verbraucherschutzvorschriften eines anderen Staates etwas anderes vorsehen. " +
            "Sind Sie Kaufmann im Sinne des deutschen Rechts, ist ausschließlicher Gerichtsstand München.",
        },
        {
          id: "online_dispute",
          heading: "3. Online-Streitbeilegung",
          body:
            "Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS-Plattform) bereit. " +
            "Wir sind weder verpflichtet noch grundsätzlich bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.",
        },
      ],
      disclaimer:
        "Diese Seite dient einer transparenten Übersicht. Im Konfliktfall kann die deutschsprachige Fassung maßgeblich sein, soweit dies gesetzlich vorgesehen ist.",
    },
  },

  // ================================================================
  // FRANÇAIS
  // ================================================================
  fr: {
    imprint: {
      slug: "imprint",
      title: "Mentions légales",
      intro:
        "Ces mentions légales contiennent les informations requises pour le fournisseur de m-pathy en vertu du droit allemand et, en partie, du droit européen.",
      last_updated: "Dernière mise à jour : 18 novembre 2025",
      sections: [
        {
          id: "provider",
          heading: "1. Fournisseur",
          body:
            "NAAL UG (responsabilité limitée)\n" +
            "Maria-Theresia-Str. 11\n" +
            "81675 Munich\n" +
            "Allemagne\n\n" +
            "E-mail : support@m-pathy.ai",
        },
        {
          id: "representative",
          heading: "2. Représentant légal",
          body: "Gérant : Alexander Khayat.",
        },
        {
          id: "register",
          heading: "3. Registre du commerce",
          body:
            "La société est immatriculée au registre du commerce. Le tribunal compétent et le numéro d’immatriculation " +
            "seront ajoutés dès qu’ils seront définitivement disponibles.",
        },
        {
          id: "vat",
          heading: "4. Numéro de TVA",
          body:
            "Si un numéro d’identification TVA est attribué, il sera indiqué ici.",
        },
        {
          id: "contact",
          heading: "5. Contact",
          body:
            "Le moyen le plus rapide pour nous contacter au sujet de m-pathy est actuellement l’e-mail à support@m-pathy.ai. " +
            "Veuillez ne pas envoyer de données de santé ou de paiement particulièrement sensibles par e-mail.",
        },
      ],
      disclaimer:
        "Ces mentions légales visent la transparence et ne remplacent pas un conseil juridique individuel.",
    },

    privacy: {
      slug: "privacy",
      title: "Politique de confidentialité",
      intro:
        "La présente politique de confidentialité explique, de manière simplifiée, comment nous traitons les données personnelles lorsque vous utilisez m-pathy.",
      last_updated: "Dernière mise à jour : 18 novembre 2025",
      sections: [
        {
          id: "controller",
          heading: "1. Responsable du traitement",
          body:
            "Le responsable du traitement des données en lien avec m-pathy est :\n\n" +
            "NAAL UG (responsabilité limitée)\n" +
            "Maria-Theresia-Str. 11\n" +
            "81675 Munich, Allemagne\n" +
            "E-mail : support@m-pathy.ai",
        },
        {
          id: "data_categories",
          heading: "2. Catégories de données",
          body:
            "Nous traitons, dans la mesure nécessaire, notamment les catégories de données suivantes :\n" +
            "• Données d’utilisation et journaux du site Web\n" +
            "• Données de compte et de contact que vous fournissez activement\n" +
            "• Contenu de vos prompts et réponses envoyés au système\n" +
            "• Métadonnées techniques telles que l’heure, le type de navigateur et des informations de base sur l’appareil",
        },
        {
          id: "purposes",
          heading: "3. Finalités et bases juridiques",
          body:
            "Nous utilisons vos données notamment :\n" +
            "• pour fournir et exploiter m-pathy,\n" +
            "• pour sécuriser et maintenir techniquement le service,\n" +
            "• pour répondre aux demandes de support,\n" +
            "• pour respecter nos obligations légales d’archivage et de documentation.\n\n" +
            "Lorsque le RGPD s’applique, les bases juridiques sont en particulier l’article 6, paragraphe 1, point b) (contrat), " +
            "l’article 6, paragraphe 1, point c) (obligation légale) et l’article 6, paragraphe 1, point f) RGPD (intérêt légitime " +
            "à un fonctionnement sûr et efficace).",
        },
        {
          id: "processors",
          heading: "4. Sous-traitants et destinataires",
          body:
            "Nous faisons appel à des prestataires soigneusement sélectionnés pour l’hébergement, l’infrastructure, certaines analyses " +
            "sans profilage individuel et le traitement des paiements (par exemple Stripe). Ces prestataires sont contractuellement tenus " +
            "de traiter les données uniquement selon nos instructions et conformément au droit applicable.",
        },
        {
          id: "retention",
          heading: "5. Durée de conservation",
          body:
            "Les données personnelles sont conservées uniquement aussi longtemps que nécessaire aux finalités décrites " +
            "ou tant que la loi l’exige. Les journaux techniques sont en général conservés pour une courte période. " +
            "Les données contractuelles peuvent être conservées plus longtemps pour respecter les obligations commerciales et fiscales.",
        },
        {
          id: "rights",
          heading: "6. Vos droits",
          body:
            "Lorsque le RGPD s’applique, vous disposez notamment d’un droit d’accès, de rectification, d’effacement, de limitation du traitement, " +
            "d’un droit à la portabilité des données ainsi que d’un droit d’opposition à certains traitements. " +
            "Vous avez également le droit d’introduire une réclamation auprès d’une autorité de contrôle.",
        },
        {
          id: "ai",
          heading: "7. Utilisation de services d’IA",
          body:
            "m-pathy utilise des modèles d’intelligence artificielle qui traitent les prompts que vous envoyez. " +
            "Nous mettons en œuvre des mesures techniques et organisationnelles pour protéger vos données, " +
            "mais aucun système ne peut être totalement sécurisé. Évitez donc, si possible, de saisir des contenus hautement sensibles " +
            "que vous ne souhaiteriez jamais voir quitter votre appareil.",
        },
      ],
      disclaimer:
        "Cette politique de confidentialité est un résumé simplifié et ne remplace pas un examen juridique complet de votre situation spécifique.",
    },

    terms: {
      slug: "terms",
      title: "Conditions d’utilisation",
      intro:
        "Les présentes conditions définissent la manière dont vous pouvez utiliser m-pathy. En utilisant le service, vous les acceptez.",
      last_updated: "Dernière mise à jour : 18 novembre 2025",
      sections: [
        {
          id: "scope",
          heading: "1. Champ d’application du service",
          body:
            "m-pathy est un assistant expérimental basé sur l’IA. Ce n’est pas un thérapeute, un avocat, un médecin ou un conseiller financier humain. " +
            "Le service est destiné au travail créatif, à la réflexion et à l’assistance technique.",
        },
        {
          id: "no_advice",
          heading: "2. Absence de conseil professionnel",
          body:
            "Les contenus générés par m-pathy ne doivent jamais être utilisés comme seule base pour des décisions médicales, juridiques, financières " +
            "ou autres ayant des conséquences importantes. Demandez toujours conseil à des professionnels qualifiés.",
        },
        {
          id: "account",
          heading: "3. Compte et jetons",
          body:
            "L’accès peut être limité dans le temps et/ou par un certain nombre de jetons. Vous êtes responsable de la confidentialité " +
            "de vos identifiants et de toutes les activités réalisées via votre compte.",
        },
        {
          id: "acceptable_use",
          heading: "4. Utilisation acceptable",
          body:
            "Vous ne pouvez pas utiliser m-pathy pour enfreindre la loi, nuire à autrui, générer des contenus illicites " +
            "ou attaquer des systèmes. Nous pouvons bloquer ou limiter les comptes en cas d’utilisation abusive.",
        },
        {
          id: "changes",
          heading: "5. Modifications et disponibilité",
          body:
            "Nous pouvons adapter, étendre ou restreindre les fonctionnalités de m-pathy à tout moment, dans la mesure où cela reste raisonnable pour les utilisateurs. " +
            "Nous visons une haute disponibilité, sans pouvoir garantir un fonctionnement ininterrompu.",
        },
        {
          id: "liability",
          heading: "6. Limitation de responsabilité",
          body:
            "Nous sommes responsables conformément au droit applicable en cas de faute intentionnelle ou de négligence grave. " +
            "En cas de négligence légère, notre responsabilité est limitée aux obligations contractuelles essentielles " +
            "et au dommage typique prévisible. Les responsabilités obligatoires, par exemple en vertu du droit de la responsabilité du fait des produits, demeurent inchangées.",
        },
      ],
      disclaimer:
        "Ces conditions d’utilisation constituent un résumé structuré et ne remplacent pas un conseil juridique individuel.",
    },

    refund: {
      slug: "refund",
      title: "Politique de remboursement",
      intro:
        "m-pathy propose actuellement un modèle d’accès unique clair. Cette politique explique comment nous gérons les paiements et les remboursements.",
      last_updated: "Dernière mise à jour : 18 novembre 2025",
      sections: [
        {
          id: "model",
          heading: "1. Modèle d’achat",
          body:
            "L’accès à m-pathy est actuellement accordé sous forme d’achat unique pour une période définie et/ou un certain volume de jetons. " +
            "Il n’y a pas de renouvellement automatique d’abonnement.",
        },
        {
          id: "payment",
          heading: "2. Traitement des paiements",
          body:
            "Les paiements sont traités via Stripe ou d’autres prestataires similaires. Leurs conditions générales et mesures de sécurité s’appliquent en complément.",
        },
        {
          id: "withdrawal",
          heading: "3. Droit de rétractation",
          body:
            "Si vous êtes consommateur ou consommatrice dans l’Union européenne, vous pouvez bénéficier d’un droit légal de rétractation pour les services numériques. " +
            "Lorsque ce droit s’applique, vous en êtes informé(e) lors du processus de commande.",
        },
        {
          id: "refunds",
          heading: "4. Remboursements en pratique",
          body:
            "En règle générale, nous ne procédons pas à des remboursements une fois que l’accès a été accordé et que les jetons peuvent être utilisés, " +
            "sauf obligation légale ou engagement exprès de notre part dans un cas particulier.",
        },
      ],
      disclaimer:
        "Cette politique de remboursement décrit notre pratique actuelle et ne limite pas les droits légaux impératifs.",
    },

    legal: {
      slug: "legal",
      title: "Informations légales",
      intro:
        "Cette page regroupe les principales informations juridiques relatives à m-pathy.",
      last_updated: "Dernière mise à jour : 18 novembre 2025",
      sections: [
        {
          id: "overview",
          heading: "1. Vue d’ensemble",
          body:
            "m-pathy est exploité par NAAL UG (responsabilité limitée), basée à Munich (Allemagne). " +
            "Le service associe des modèles d’IA avancés à une forte exigence de confidentialité, de clarté et de contrôle par l’utilisateur.",
        },
        {
          id: "jurisdiction",
          heading: "2. Droit applicable et juridiction",
          body:
            "Sauf dispositions impératives plus favorables de protection des consommateurs, le droit allemand s’applique. " +
            "Si vous agissez en tant que commerçant au sens du droit allemand, le tribunal compétent exclusif est Munich.",
        },
        {
          id: "online_dispute",
          heading: "3. Règlement en ligne des litiges",
          body:
            "La Commission européenne met à disposition une plateforme de règlement en ligne des litiges (plateforme RLL). " +
            "Nous ne sommes ni tenus ni, en principe, disposés à participer à une procédure de règlement des litiges devant un organisme de médiation pour les consommateurs.",
        },
      ],
      disclaimer:
        "Cette page vise à offrir une vue d’ensemble transparente. En cas de divergence, la version allemande peut prévaloir lorsque la loi l’exige.",
    },
  },
    // ================================================================
  // ESPAÑOL
  // ================================================================
  es: {
    imprint: {
      slug: "imprint",
      title: "Aviso legal",
      intro:
        "Este aviso legal contiene la información del proveedor que se exige para m-pathy según el derecho alemán y, en parte, europeo.",
      last_updated: "Última actualización: 18 de noviembre de 2025",
      sections: [
        {
          id: "provider",
          heading: "1. Proveedor",
          body:
            "NAAL UG (responsabilidad limitada)\n" +
            "Maria-Theresia-Str. 11\n" +
            "81675 Múnich\n" +
            "Alemania\n\n" +
            "Correo electrónico: support@m-pathy.ai",
        },
        {
          id: "representative",
          heading: "2. Representante autorizado",
          body: "Administrador: Alexander Khayat.",
        },
        {
          id: "register",
          heading: "3. Inscripción en el registro mercantil",
          body:
            "La sociedad está inscrita en el registro mercantil. " +
            "El juzgado competente y el número de inscripción se añadirán en cuanto estén disponibles de forma definitiva.",
        },
        {
          id: "vat",
          heading: "4. Número de IVA",
          body:
            "Si se asigna un número de identificación a efectos de IVA, se indicará aquí.",
        },
        {
          id: "contact",
          heading: "5. Contacto",
          body:
            "La forma más rápida de contactar con nosotros sobre m-pathy es actualmente por correo electrónico a support@m-pathy.ai. " +
            "Por favor, no envíe por correo electrónico datos especialmente sensibles de salud o de pago.",
        },
      ],
      disclaimer:
        "Este aviso legal tiene fines de transparencia y no sustituye al asesoramiento jurídico individual.",
    },

    privacy: {
      slug: "privacy",
      title: "Política de privacidad",
      intro:
        "Esta política de privacidad explica de forma sencilla cómo tratamos los datos personales cuando utilizas m-pathy.",
      last_updated: "Última actualización: 18 de noviembre de 2025",
      sections: [
        {
          id: "controller",
          heading: "1. Responsable del tratamiento",
          body:
            "El responsable del tratamiento de datos en relación con m-pathy es:\n\n" +
            "NAAL UG (responsabilidad limitada)\n" +
            "Maria-Theresia-Str. 11\n" +
            "81675 Múnich, Alemania\n" +
            "Correo electrónico: support@m-pathy.ai",
        },
        {
          id: "data_categories",
          heading: "2. Categorías de datos",
          body:
            "Tratamos, en la medida en que sea necesario, en particular las siguientes categorías de datos:\n" +
            "• Datos de uso y registros del sitio web\n" +
            "• Datos de cuenta y de contacto que proporcionas activamente\n" +
            "• Contenido de tus prompts y respuestas enviados al sistema\n" +
            "• Metadatos técnicos como hora, tipo de navegador e información básica del dispositivo",
        },
        {
          id: "purposes",
          heading: "3. Finalidades y bases jurídicas",
          body:
            "Utilizamos tus datos, en particular, para:\n" +
            "• proporcionar y operar m-pathy,\n" +
            "• garantizar la seguridad y el mantenimiento técnico del servicio,\n" +
            "• responder a solicitudes de soporte,\n" +
            "• cumplir obligaciones legales de conservación y documentación.\n\n" +
            "Cuando se aplica el RGPD, las bases jurídicas son en especial el art. 6.1.b (contrato), 6.1.c (obligación legal) " +
            "y 6.1.f RGPD (interés legítimo en un funcionamiento seguro y eficiente).",
        },
        {
          id: "processors",
          heading: "4. Encargados del tratamiento y destinatarios",
          body:
            "Utilizamos proveedores de servicios cuidadosamente seleccionados para alojamiento, infraestructura, análisis sin perfiles " +
            "y procesamiento de pagos (por ejemplo, Stripe). Estos proveedores están obligados contractualmente a tratar los datos " +
            "únicamente según nuestras instrucciones y de conformidad con la legislación aplicable.",
        },
        {
          id: "retention",
          heading: "5. Plazo de conservación",
          body:
            "Conservamos los datos personales sólo durante el tiempo necesario para las finalidades descritas o mientras la ley lo exija. " +
            "Los datos de registro se conservan normalmente sólo durante un corto período técnico. " +
            "Los datos contractuales pueden conservarse más tiempo para cumplir obligaciones mercantiles y fiscales.",
        },
        {
          id: "rights",
          heading: "6. Tus derechos",
          body:
            "Cuando se aplica el RGPD, tienes en particular derecho de acceso, rectificación, supresión, limitación del tratamiento, " +
            "portabilidad de los datos y derecho a oponerte a determinados tratamientos. También tienes derecho a presentar una reclamación " +
            "ante una autoridad de control.",
        },
        {
          id: "ai",
          heading: "7. Uso de servicios de IA",
          body:
            "m-pathy utiliza modelos de inteligencia artificial que procesan los prompts que envías. " +
            "Aplicamos medidas técnicas y organizativas para proteger tus datos, pero ningún sistema puede ser totalmente seguro. " +
            "Por ello, si es posible, evita introducir contenido altamente sensible que nunca quisieras que saliera de tu dispositivo.",
        },
      ],
      disclaimer:
        "Esta política de privacidad es un resumen simplificado y no sustituye un análisis jurídico completo de tu caso concreto.",
    },

    terms: {
      slug: "terms",
      title: "Condiciones de uso",
      intro:
        "Estas condiciones regulan cómo puedes utilizar m-pathy. Al utilizar el servicio, aceptas estas condiciones.",
      last_updated: "Última actualización: 18 de noviembre de 2025",
      sections: [
        {
          id: "scope",
          heading: "1. Alcance del servicio",
          body:
            "m-pathy es un asistente experimental basado en IA. No es un terapeuta, abogado, médico ni asesor financiero humano. " +
            "El servicio está pensado para trabajo creativo, reflexión y asistencia técnica.",
        },
        {
          id: "no_advice",
          heading: "2. Sin asesoramiento profesional",
          body:
            "El contenido generado por m-pathy no debe utilizarse nunca como única base para decisiones médicas, jurídicas, financieras " +
            "u otras decisiones con consecuencias graves. Para estas cuestiones, consulta siempre a profesionales cualificados.",
        },
        {
          id: "account",
          heading: "3. Cuenta y tokens",
          body:
            "El acceso puede estar limitado en el tiempo y/o por un determinado pool de tokens. Eres responsable de mantener en secreto tus credenciales " +
            "y de toda actividad que tenga lugar con tu cuenta.",
        },
        {
          id: "acceptable_use",
          heading: "4. Uso aceptable",
          body:
            "No puedes utilizar m-pathy para infringir la ley, dañar a otras personas, generar contenidos ilícitos ni atacar sistemas. " +
            "Podemos bloquear o restringir cuentas que hagan un uso indebido del servicio.",
        },
        {
          id: "changes",
          heading: "5. Cambios y disponibilidad",
          body:
            "Podemos adaptar, ampliar o limitar las funciones de m-pathy en cualquier momento, siempre que sea razonable para los usuarios. " +
            "Nos esforzamos por ofrecer una alta disponibilidad, pero no podemos garantizar un funcionamiento ininterrumpido.",
        },
        {
          id: "liability",
          heading: "6. Limitación de responsabilidad",
          body:
            "Respondemos según la legislación aplicable en caso de dolo y negligencia grave. En caso de simple negligencia, " +
            "sólo somos responsables por el incumplimiento de obligaciones contractuales esenciales y limitado al daño típico previsible. " +
            "La responsabilidad obligatoria, por ejemplo en virtud de la normativa sobre responsabilidad por productos, permanece intacta.",
        },
      ],
      disclaimer:
        "Estas condiciones de uso estructuran de forma resumida la relación contractual y no sustituyen al asesoramiento jurídico individual.",
    },

    refund: {
      slug: "refund",
      title: "Política de reembolso",
      intro:
        "m-pathy ofrece actualmente un modelo claro de compra única de acceso. Esta política explica cómo tratamos pagos y reembolsos.",
      last_updated: "Última actualización: 18 de noviembre de 2025",
      sections: [
        {
          id: "model",
          heading: "1. Modelo de compra",
          body:
            "El acceso a m-pathy se concede actualmente como una compra única para un período definido y/o un pool de tokens definido. " +
            "No existe renovación automática de suscripción.",
        },
        {
          id: "payment",
          heading: "2. Procesamiento de pagos",
          body:
            "Los pagos se procesan a través de Stripe u otros proveedores similares. Se aplican además sus condiciones y medidas de seguridad.",
        },
        {
          id: "withdrawal",
          heading: "3. Derecho de desistimiento",
          body:
            "Si eres consumidor en la Unión Europea, puedes tener un derecho legal de desistimiento para servicios digitales. " +
            "Se te informa sobre este derecho durante el proceso de compra, cuando resulte aplicable.",
        },
        {
          id: "refunds",
          heading: "4. Reembolsos en la práctica",
          body:
            "En general, no ofrecemos reembolsos una vez que el acceso se ha activado y los tokens pueden utilizarse, " +
            "salvo que exista una obligación legal o prometamos expresamente un reembolso en un caso concreto.",
        },
      ],
      disclaimer:
        "Esta política de reembolso describe nuestra práctica actual y no limita los derechos legales obligatorios.",
    },

    legal: {
      slug: "legal",
      title: "Información legal",
      intro:
        "En esta página reunimos la información jurídica más importante sobre m-pathy.",
      last_updated: "Última actualización: 18 de noviembre de 2025",
      sections: [
        {
          id: "overview",
          heading: "1. Panorama general",
          body:
            "m-pathy es operado por NAAL UG (responsabilidad limitada), con sede en Múnich (Alemania). " +
            "El servicio combina modelos avanzados de IA con un fuerte enfoque en privacidad, claridad y control por parte del usuario.",
        },
        {
          id: "jurisdiction",
          heading: "2. Derecho aplicable y fuero",
          body:
            "Salvo que el derecho imperativo de protección de los consumidores disponga otra cosa, se aplica el derecho alemán. " +
            "Si actúas como comerciante según el derecho alemán, el fuero exclusivo es Múnich.",
        },
        {
          id: "online_dispute",
          heading: "3. Resolución de litigios en línea",
          body:
            "La Comisión Europea ofrece una plataforma para la resolución de litigios en línea. " +
            "No estamos obligados ni, en principio, dispuestos a participar en procedimientos de resolución de litigios " +
            "ante organismos de arbitraje para consumidores.",
        },
      ],
      disclaimer:
        "Esta página pretende ofrecer una visión transparente. En caso de conflicto, la versión alemana puede prevalecer cuando la ley así lo exija.",
    },
  },

  // ================================================================
  // ITALIANO
  // ================================================================
  it: {
    imprint: {
      slug: "imprint",
      title: "Informazioni legali",
      intro:
        "Queste informazioni legali contengono i dati del fornitore richiesti per m-pathy dal diritto tedesco e in parte da quello europeo.",
      last_updated: "Ultimo aggiornamento: 18 novembre 2025",
      sections: [
        {
          id: "provider",
          heading: "1. Fornitore",
          body:
            "NAAL UG (a responsabilità limitata)\n" +
            "Maria-Theresia-Str. 11\n" +
            "81675 Monaco di Baviera\n" +
            "Germania\n\n" +
            "E-mail: support@m-pathy.ai",
        },
        {
          id: "representative",
          heading: "2. Rappresentante legale",
          body: "Amministratore unico: Alexander Khayat.",
        },
        {
          id: "register",
          heading: "3. Iscrizione al registro delle imprese",
          body:
            "La società è iscritta nel registro delle imprese. Il tribunale competente e il numero di iscrizione " +
            "saranno indicati non appena saranno definitivamente disponibili.",
        },
        {
          id: "vat",
          heading: "4. Partita IVA",
          body:
            "Qualora venga assegnato un numero di identificazione IVA, esso verrà indicato qui.",
        },
        {
          id: "contact",
          heading: "5. Contatti",
          body:
            "Il modo più rapido per contattarci in merito a m-pathy è al momento l’e-mail a support@m-pathy.ai. " +
            "Ti preghiamo di non inviare tramite e-mail dati particolarmente sensibili relativi alla salute o ai pagamenti.",
        },
      ],
      disclaimer:
        "Queste informazioni legali servono alla trasparenza e non sostituiscono una consulenza legale individuale.",
    },

    privacy: {
      slug: "privacy",
      title: "Informativa sulla privacy",
      intro:
        "La presente informativa descrive in modo semplice come trattiamo i dati personali quando utilizzi m-pathy.",
      last_updated: "Ultimo aggiornamento: 18 novembre 2025",
      sections: [
        {
          id: "controller",
          heading: "1. Titolare del trattamento",
          body:
            "Il titolare del trattamento dei dati in relazione a m-pathy è:\n\n" +
            "NAAL UG (a responsabilità limitata)\n" +
            "Maria-Theresia-Str. 11\n" +
            "81675 Monaco di Baviera, Germania\n" +
            "E-mail: support@m-pathy.ai",
        },
        {
          id: "data_categories",
          heading: "2. Categorie di dati",
          body:
            "Trattiamo, nella misura necessaria, in particolare le seguenti categorie di dati:\n" +
            "• Dati di utilizzo e log del sito web\n" +
            "• Dati di account e di contatto forniti attivamente\n" +
            "• Contenuti dei prompt e delle risposte inviati al sistema\n" +
            "• Metadati tecnici come ora, tipo di browser e informazioni di base sul dispositivo",
        },
        {
          id: "purposes",
          heading: "3. Finalità e basi giuridiche",
          body:
            "Utilizziamo i tuoi dati in particolare per:\n" +
            "• fornire e gestire m-pathy,\n" +
            "• garantire la sicurezza e la manutenzione tecnica del servizio,\n" +
            "• rispondere alle richieste di supporto,\n" +
            "• adempiere agli obblighi legali di conservazione e documentazione.\n\n" +
            "Quando si applica il GDPR, le basi giuridiche sono in particolare l’art. 6, par. 1, lett. b) (contratto), lett. c) (obbligo legale) " +
            "e lett. f) GDPR (interesse legittimo a un funzionamento sicuro ed efficiente).",
        },
        {
          id: "processors",
          heading: "4. Responsabili del trattamento e destinatari",
          body:
            "Utilizziamo fornitori di servizi selezionati con cura per hosting, infrastruttura, analisi senza profilazione " +
            "e gestione dei pagamenti (ad es. Stripe). Tali fornitori sono contrattualmente vincolati a trattare i dati " +
            "solo secondo le nostre istruzioni e nel rispetto della normativa applicabile.",
        },
        {
          id: "retention",
          heading: "5. Periodo di conservazione",
          body:
            "Conserviamo i dati personali solo per il tempo necessario alle finalità descritte o richiesto dalla legge. " +
            "I dati di log vengono in genere conservati per un breve periodo tecnico. I dati rilevanti ai fini contrattuali " +
            "possono essere conservati più a lungo per adempiere agli obblighi di conservazione commerciali e fiscali.",
        },
        {
          id: "rights",
          heading: "6. I tuoi diritti",
          body:
            "Quando si applica il GDPR, hai in particolare il diritto di accesso, rettifica, cancellazione, limitazione del trattamento, " +
            "portabilità dei dati e il diritto di opporti ad alcuni trattamenti. Hai inoltre il diritto di proporre reclamo " +
            "a un’autorità di controllo.",
        },
        {
          id: "ai",
          heading: "7. Utilizzo di servizi di IA",
          body:
            "m-pathy utilizza modelli di intelligenza artificiale che elaborano i prompt da te inviati. " +
            "Adottiamo misure tecniche e organizzative per proteggere i tuoi dati, ma nessun sistema può essere totalmente sicuro. " +
            "Se possibile, evita di inserire contenuti altamente sensibili che non vorresti mai lasciare il tuo dispositivo.",
        },
      ],
      disclaimer:
        "La presente informativa è un riepilogo semplificato e non sostituisce una verifica legale completa del tuo caso specifico.",
    },

    terms: {
      slug: "terms",
      title: "Condizioni d’uso",
      intro:
        "Le presenti condizioni disciplinano le modalità di utilizzo di m-pathy. Utilizzando il servizio, le accetti.",
      last_updated: "Ultimo aggiornamento: 18 novembre 2025",
      sections: [
        {
          id: "scope",
          heading: "1. Ambito del servizio",
          body:
            "m-pathy è un assistente sperimentale basato sull’IA. Non è un terapeuta, avvocato, medico o consulente finanziario umano. " +
            "Il servizio è pensato per il lavoro creativo, la riflessione e il supporto tecnico.",
        },
        {
          id: "no_advice",
          heading: "2. Nessuna consulenza professionale",
          body:
            "I contenuti generati da m-pathy non devono mai essere utilizzati come unica base per decisioni mediche, legali, finanziarie " +
            "o altre decisioni con gravi conseguenze. In tali casi, rivolgiti sempre a professionisti qualificati.",
        },
        {
          id: "account",
          heading: "3. Account e token",
          body:
            "L’accesso può essere limitato nel tempo e/o da un determinato pool di token. Sei responsabile della riservatezza delle tue credenziali " +
            "e di tutte le attività svolte tramite il tuo account.",
        },
        {
          id: "acceptable_use",
          heading: "4. Uso consentito",
          body:
            "Non puoi utilizzare m-pathy per violare la legge, danneggiare terzi, generare contenuti illeciti o attaccare sistemi. " +
            "Possiamo bloccare o limitare gli account che fanno un uso improprio del servizio.",
        },
        {
          id: "changes",
          heading: "5. Modifiche e disponibilità",
          body:
            "Possiamo modificare, ampliare o limitare le funzionalità di m-pathy in qualsiasi momento, purché ciò sia ragionevole per gli utenti. " +
            "Miriamo a un’elevata disponibilità, ma non possiamo garantire un funzionamento ininterrotto.",
        },
        {
          id: "liability",
          heading: "6. Limitazione di responsabilità",
          body:
            "Siamo responsabili ai sensi della legge applicabile in caso di dolo o colpa grave. In caso di colpa lieve, " +
            "rispondiamo solo per la violazione di obblighi contrattuali essenziali e limitatamente al danno tipico prevedibile. " +
            "Le responsabilità inderogabili, ad esempio ai sensi della normativa sulla responsabilità per danno da prodotti, restano impregiudicate.",
        },
      ],
      disclaimer:
        "Queste condizioni d’uso riassumono in forma strutturata il rapporto contrattuale e non sostituiscono una consulenza legale individuale.",
    },

    refund: {
      slug: "refund",
      title: "Politica di rimborso",
      intro:
        "m-pathy offre attualmente un modello chiaro di accesso con acquisto unico. Questa politica spiega come gestiamo pagamenti e rimborsi.",
      last_updated: "Ultimo aggiornamento: 18 novembre 2025",
      sections: [
        {
          id: "model",
          heading: "1. Modello di acquisto",
          body:
            "L’accesso a m-pathy è attualmente concesso come acquisto unico per un periodo definito e/o un determinato pool di token. " +
            "Non vi è alcun rinnovo automatico dell’abbonamento.",
        },
        {
          id: "payment",
          heading: "2. Elaborazione dei pagamenti",
          body:
            "I pagamenti vengono elaborati tramite Stripe o altri fornitori simili. Si applicano inoltre le loro condizioni e misure di sicurezza.",
        },
        {
          id: "withdrawal",
          heading: "3. Diritto di recesso",
          body:
            "Se sei un consumatore nell’Unione europea, potresti avere un diritto legale di recesso per i servizi digitali. " +
            "Quando applicabile, riceverai le informazioni su tale diritto durante il processo di acquisto.",
        },
        {
          id: "refunds",
          heading: "4. Rimborsi nella pratica",
          body:
            "Di norma non effettuiamo rimborsi una volta che l’accesso è stato attivato e i token possono essere utilizzati, " +
            "salvo obbligo legale o promessa espressa di rimborso in singoli casi.",
        },
      ],
      disclaimer:
        "Questa politica di rimborso descrive la nostra prassi attuale e non limita i diritti legali inderogabili.",
    },

    legal: {
      slug: "legal",
      title: "Informazioni legali",
      intro:
        "In questa pagina raccogliamo le principali informazioni giuridiche su m-pathy.",
      last_updated: "Ultimo aggiornamento: 18 novembre 2025",
      sections: [
        {
          id: "overview",
          heading: "1. Panoramica",
          body:
            "m-pathy è gestito da NAAL UG (a responsabilità limitata), con sede a Monaco di Baviera, Germania. " +
            "Il servizio combina modelli di IA avanzati con un forte focus su privacy, chiarezza e controllo da parte dell’utente.",
        },
        {
          id: "jurisdiction",
          heading: "2. Legge applicabile e foro competente",
          body:
            "Salvo quanto previsto da norme imperative più favorevoli di tutela dei consumatori, si applica il diritto tedesco. " +
            "Se agisci come imprenditore ai sensi del diritto tedesco, il foro esclusivamente competente è Monaco di Baviera.",
        },
        {
          id: "online_dispute",
          heading: "3. Risoluzione delle controversie online",
          body:
            "La Commissione europea mette a disposizione una piattaforma per la risoluzione online delle controversie. " +
            "Non siamo tenuti né, in linea di principio, disponibili a partecipare a procedimenti di risoluzione dinanzi a organismi di mediazione per i consumatori.",
        },
      ],
      disclaimer:
        "Questa pagina ha lo scopo di fornire una panoramica trasparente. In caso di conflitto, la versione tedesca può prevalere quando richiesto dalla legge.",
    },
  },

  // ================================================================
  // PORTUGUÊS
  // ================================================================
  pt: {
    imprint: {
      slug: "imprint",
      title: "Informações legais",
      intro:
        "Estas informações legais contêm os dados do fornecedor exigidos para o m-pathy pelo direito alemão e, em parte, pelo direito europeu.",
      last_updated: "Última atualização: 18 de novembro de 2025",
      sections: [
        {
          id: "provider",
          heading: "1. Fornecedor",
          body:
            "NAAL UG (responsabilidade limitada)\n" +
            "Maria-Theresia-Str. 11\n" +
            "81675 Munique\n" +
            "Alemanha\n\n" +
            "E-mail: support@m-pathy.ai",
        },
        {
          id: "representative",
          heading: "2. Representante legal",
          body: "Diretor-gerente: Alexander Khayat.",
        },
        {
          id: "register",
          heading: "3. Registro comercial",
          body:
            "A empresa está inscrita no registro comercial. O tribunal competente e o número de registro " +
            "serão adicionados assim que estiverem disponíveis de forma definitiva.",
        },
        {
          id: "vat",
          heading: "4. NIF/IVA",
          body:
            "Se for atribuído um número de identificação de IVA, ele será indicado aqui.",
        },
        {
          id: "contact",
          heading: "5. Contacto",
          body:
            "A forma mais rápida de nos contactar sobre o m-pathy é atualmente através do e-mail support@m-pathy.ai. " +
            "Por favor, não envie por e-mail dados de saúde ou de pagamento particularmente sensíveis.",
        },
      ],
      disclaimer:
        "Estas informações legais servem apenas para transparência e não substituem aconselhamento jurídico individual.",
    },

    privacy: {
      slug: "privacy",
      title: "Política de privacidade",
      intro:
        "Esta política de privacidade explica de forma simples como tratamos dados pessoais quando utiliza o m-pathy.",
      last_updated: "Última atualização: 18 de novembro de 2025",
      sections: [
        {
          id: "controller",
          heading: "1. Responsável pelo tratamento",
          body:
            "O responsável pelo tratamento de dados em ligação com o m-pathy é:\n\n" +
            "NAAL UG (responsabilidade limitada)\n" +
            "Maria-Theresia-Str. 11\n" +
            "81675 Munique, Alemanha\n" +
            "E-mail: support@m-pathy.ai",
        },
        {
          id: "data_categories",
          heading: "2. Categorias de dados",
          body:
            "Tratamos, na medida do necessário, em especial as seguintes categorias de dados:\n" +
            "• Dados de utilização e registos do site\n" +
            "• Dados de conta e de contacto fornecidos ativamente\n" +
            "• Conteúdo dos seus prompts e respostas enviados ao sistema\n" +
            "• Metadados técnicos como hora, tipo de navegador e informações básicas do dispositivo",
        },
        {
          id: "purposes",
          heading: "3. Finalidades e fundamentos jurídicos",
          body:
            "Utilizamos os seus dados, em especial, para:\n" +
            "• fornecer e operar o m-pathy,\n" +
            "• garantir a segurança e manutenção técnica do serviço,\n" +
            "• responder a pedidos de suporte,\n" +
            "• cumprir obrigações legais de conservação e documentação.\n\n" +
            "Quando o RGPD é aplicável, as bases jurídicas são, em particular, o artigo 6.º, n.º 1, alíneas b) (contrato), c) (obrigação legal) " +
            "e f) RGPD (interesse legítimo num funcionamento seguro e eficiente).",
        },
        {
          id: "processors",
          heading: "4. Subcontratantes e destinatários",
          body:
            "Utilizamos prestadores de serviços cuidadosamente selecionados para alojamento, infraestrutura, análises sem perfis " +
            "e processamento de pagamentos (por exemplo, Stripe). Estes prestadores estão contratualmente obrigados a tratar os dados " +
            "apenas de acordo com as nossas instruções e em conformidade com a legislação aplicável.",
        },
        {
          id: "retention",
          heading: "5. Prazo de conservação",
          body:
            "Conservamos dados pessoais apenas durante o tempo necessário para as finalidades descritas ou exigido por lei. " +
            "Os registos técnicos são normalmente conservados apenas por um curto período. " +
            "Os dados relevantes para o contrato podem ser conservados por mais tempo para cumprir obrigações comerciais e fiscais.",
        },
        {
          id: "rights",
          heading: "6. Os seus direitos",
          body:
            "Quando o RGPD é aplicável, tem, em especial, o direito de acesso, retificação, apagamento, limitação do tratamento, " +
            "portabilidade dos dados e o direito de se opor a determinados tratamentos. Tem também o direito de apresentar reclamação " +
            "a uma autoridade de controlo.",
        },
        {
          id: "ai",
          heading: "7. Utilização de serviços de IA",
          body:
            "O m-pathy utiliza modelos de inteligência artificial que processam os prompts que envia. " +
            "Adotamos medidas técnicas e organizativas para proteger os seus dados, mas nenhum sistema pode ser totalmente seguro. " +
            "Sempre que possível, evite inserir conteúdos altamente sensíveis que não gostaria que deixassem o seu dispositivo.",
        },
      ],
      disclaimer:
        "Esta política de privacidade é um resumo simplificado e não substitui uma análise jurídica completa do seu caso específico.",
    },

    terms: {
      slug: "terms",
      title: "Termos de utilização",
      intro:
        "Estes termos regulam a forma como pode utilizar o m-pathy. Ao utilizar o serviço, aceita estes termos.",
      last_updated: "Última atualização: 18 de novembro de 2025",
      sections: [
        {
          id: "scope",
          heading: "1. Âmbito do serviço",
          body:
            "O m-pathy é um assistente experimental baseado em IA. Não é um terapeuta, advogado, médico ou consultor financeiro humano. " +
            "O serviço destina-se ao trabalho criativo, reflexão e apoio técnico.",
        },
        {
          id: "no_advice",
          heading: "2. Sem aconselhamento profissional",
          body:
            "O conteúdo gerado pelo m-pathy nunca deve ser utilizado como única base para decisões médicas, jurídicas, financeiras " +
            "ou outras com consequências graves. Em tais casos, consulte sempre profissionais qualificados.",
        },
        {
          id: "account",
          heading: "3. Conta e tokens",
          body:
            "O acesso pode ser limitado no tempo e/ou por um determinado conjunto de tokens. É responsável por manter as suas credenciais " +
            "em segurança e por toda a atividade realizada através da sua conta.",
        },
        {
          id: "acceptable_use",
          heading: "4. Utilização aceitável",
          body:
            "Não pode utilizar o m-pathy para violar a lei, prejudicar terceiros, gerar conteúdos ilícitos ou atacar sistemas. " +
            "Podemos bloquear ou restringir contas que utilizem o serviço de forma abusiva.",
        },
        {
          id: "changes",
          heading: "5. Alterações e disponibilidade",
          body:
            "Podemos adaptar, ampliar ou limitar as funcionalidades do m-pathy a qualquer momento, desde que isso seja razoável para os utilizadores. " +
            "Procuramos assegurar uma elevada disponibilidade, mas não podemos garantir um funcionamento ininterrupto.",
        },
        {
          id: "liability",
          heading: "6. Limitação de responsabilidade",
          body:
            "Somos responsáveis, de acordo com a legislação aplicável, em caso de dolo ou negligência grave. Em caso de negligência simples, " +
            "só somos responsáveis pela violação de obrigações contratuais essenciais e limitados ao dano típico previsível. " +
            "As responsabilidades obrigatórias, por exemplo ao abrigo da legislação de responsabilidade por produtos, mantêm-se inalteradas.",
        },
      ],
      disclaimer:
        "Estes termos de utilização estruturam a relação contratual de forma resumida e não substituem aconselhamento jurídico individual.",
    },

    refund: {
      slug: "refund",
      title: "Política de reembolso",
      intro:
        "O m-pathy oferece atualmente um modelo claro de acesso com compra única. Esta política explica como tratamos pagamentos e reembolsos.",
      last_updated: "Última atualização: 18 de novembro de 2025",
      sections: [
        {
          id: "model",
          heading: "1. Modelo de compra",
          body:
            "O acesso ao m-pathy é atualmente concedido como compra única por um período definido e/ou um determinado conjunto de tokens. " +
            "Não existe renovação automática de subscrição.",
        },
        {
          id: "payment",
          heading: "2. Processamento de pagamentos",
          body:
            "Os pagamentos são processados através do Stripe ou de outros prestadores semelhantes. " +
            "Aplicam-se ainda as respetivas condições e medidas de segurança.",
        },
        {
          id: "withdrawal",
          heading: "3. Direito de resolução",
          body:
            "Se for consumidor na União Europeia, pode ter um direito legal de resolução para serviços digitais. " +
            "Quando aplicável, será informado desse direito durante o processo de compra.",
        },
        {
          id: "refunds",
          heading: "4. Reembolsos na prática",
          body:
            "Regra geral, não efetuamos reembolsos depois de o acesso ter sido concedido e os tokens poderem ser utilizados, " +
            "salvo obrigação legal ou promessa expressa de reembolso em casos individuais.",
        },
      ],
      disclaimer:
        "Esta política de reembolso descreve a nossa prática atual e não limita direitos legais inderrogáveis.",
    },

    legal: {
      slug: "legal",
      title: "Informações legais",
      intro:
        "Nesta página reunimos as principais informações jurídicas sobre o m-pathy.",
      last_updated: "Última atualização: 18 de novembro de 2025",
      sections: [
        {
          id: "overview",
          heading: "1. Visão geral",
          body:
            "O m-pathy é operado pela NAAL UG (responsabilidade limitada), sediada em Munique, Alemanha. " +
            "O serviço combina modelos avançados de IA com um forte foco em privacidade, clareza e controlo por parte do utilizador.",
        },
        {
          id: "jurisdiction",
          heading: "2. Direito aplicável e foro competente",
          body:
            "Exceto quando normas imperativas de proteção do consumidor prevejam outra coisa, aplica-se o direito alemão. " +
            "Se atuar como empresário ao abrigo do direito alemão, o foro exclusivo é Munique.",
        },
        {
          id: "online_dispute",
          heading: "3. Resolução de litígios em linha",
          body:
            "A Comissão Europeia disponibiliza uma plataforma para resolução de litígios em linha. " +
            "Não estamos obrigados nem, em princípio, dispostos a participar em procedimentos de resolução de litígios " +
            "perante entidades de arbitragem de consumo.",
        },
      ],
      disclaimer:
        "Esta página pretende oferecer uma visão transparente. Em caso de conflito, a versão em alemão pode prevalecer quando exigido por lei.",
    },
  },

  // ================================================================
  // NEDERLANDS
  // ================================================================
  nl: {
    imprint: {
      slug: "imprint",
      title: "Juridische informatie",
      intro:
        "Deze juridische informatie bevat de gegevens van de aanbieder die voor m-pathy vereist zijn volgens het Duitse en deels Europese recht.",
      last_updated: "Laatst bijgewerkt: 18 november 2025",
      sections: [
        {
          id: "provider",
          heading: "1. Aanbieder",
          body:
            "NAAL UG (beperkte aansprakelijkheid)\n" +
            "Maria-Theresia-Str. 11\n" +
            "81675 München\n" +
            "Duitsland\n\n" +
            "E-mail: support@m-pathy.ai",
        },
        {
          id: "representative",
          heading: "2. Wettelijk vertegenwoordiger",
          body: "Bestuurder: Alexander Khayat.",
        },
        {
          id: "register",
          heading: "3. Handelsregister",
          body:
            "De vennootschap is ingeschreven in het handelsregister. De bevoegde rechtbank en het registratienummer " +
            "worden toegevoegd zodra deze definitief beschikbaar zijn.",
        },
        {
          id: "vat",
          heading: "4. Btw-nummer",
          body:
            "Indien een btw-identificatienummer wordt toegekend, wordt dit hier vermeld.",
        },
        {
          id: "contact",
          heading: "5. Contact",
          body:
            "De snelste manier om contact met ons op te nemen over m-pathy is momenteel per e-mail via support@m-pathy.ai. " +
            "Stuur bij voorkeur geen bijzonder gevoelige gezondheids- of betalingsgegevens per e-mail.",
        },
      ],
      disclaimer:
        "Deze juridische informatie dient de transparantie en vervangt geen individueel juridisch advies.",
    },

    privacy: {
      slug: "privacy",
      title: "Privacyverklaring",
      intro:
        "Deze privacyverklaring legt in eenvoudige bewoordingen uit hoe wij persoonsgegevens verwerken wanneer je m-pathy gebruikt.",
      last_updated: "Laatst bijgewerkt: 18 november 2025",
      sections: [
        {
          id: "controller",
          heading: "1. Verantwoordelijke",
          body:
            "De verantwoordelijke voor de gegevensverwerking in verband met m-pathy is:\n\n" +
            "NAAL UG (beperkte aansprakelijkheid)\n" +
            "Maria-Theresia-Str. 11\n" +
            "81675 München, Duitsland\n" +
            "E-mail: support@m-pathy.ai",
        },
        {
          id: "data_categories",
          heading: "2. Categorieën van gegevens",
          body:
            "Wij verwerken, voor zover nodig, met name de volgende categorieën gegevens:\n" +
            "• Gebruiks- en loggegevens van de website\n" +
            "• Account- en contactgegevens die je actief verstrekt\n" +
            "• Inhoud van prompts en antwoorden die je naar het systeem stuurt\n" +
            "• Technische metadata zoals tijdstip, browsertype en basisapparaatinformatie",
        },
        {
          id: "purposes",
          heading: "3. Doeleinden en rechtsgrondslag",
          body:
            "Wij gebruiken je gegevens met name om:\n" +
            "• m-pathy aan te bieden en te exploiteren,\n" +
            "• de veiligheid en het technisch onderhoud van de dienst te waarborgen,\n" +
            "• supportverzoeken te beantwoorden,\n" +
            "• wettelijke bewaarplichten en documentatieplichten na te komen.\n\n" +
            "Wanneer de AVG van toepassing is, baseren wij de verwerking met name op art. 6 lid 1 onder b (overeenkomst), " +
            "art. 6 lid 1 onder c (wettelijke verplichting) en art. 6 lid 1 onder f AVG (gerechtvaardigd belang bij een veilige en efficiënte werking).",
        },
        {
          id: "processors",
          heading: "4. Verwerkers en ontvangers",
          body:
            "Wij maken gebruik van zorgvuldig geselecteerde dienstverleners voor hosting, infrastructuur, analyse zonder persoonsprofielen " +
            "en betalingsverwerking (bijvoorbeeld Stripe). Deze dienstverleners zijn contractueel verplicht gegevens " +
            "alleen volgens onze instructies en in overeenstemming met het toepasselijke recht te verwerken.",
        },
        {
          id: "retention",
          heading: "5. Bewaartermijn",
          body:
            "Persoonsgegevens worden slechts bewaard zolang dit nodig is voor de beschreven doeleinden of zolang wij hiertoe wettelijk verplicht zijn. " +
            "Loggegevens worden doorgaans slechts gedurende een korte technische periode bewaard. " +
            "Contractrelevante gegevens kunnen langer worden opgeslagen om aan handels- en fiscale bewaarplichten te voldoen.",
        },
        {
          id: "rights",
          heading: "6. Jouw rechten",
          body:
            "Wanneer de AVG van toepassing is, heb je met name recht op inzage, rectificatie, verwijdering, beperking van de verwerking, " +
            "gegevensoverdraagbaarheid en het recht bezwaar te maken tegen bepaalde verwerkingen. " +
            "Daarnaast heb je het recht een klacht in te dienen bij een toezichthoudende autoriteit.",
        },
        {
          id: "ai",
          heading: "7. Gebruik van AI-diensten",
          body:
            "m-pathy maakt gebruik van AI-modellen die de prompts verwerken die je verstuurt. Wij treffen technische en organisatorische maatregelen " +
            "om je gegevens te beschermen, maar geen enkel systeem kan volledig veilig zijn. Voer daarom bij voorkeur geen zeer gevoelige inhoud in " +
            "die je apparaat nooit zou mogen verlaten.",
        },
      ],
      disclaimer:
        "Deze privacyverklaring is een vereenvoudigde samenvatting en vervangt geen volledige juridische beoordeling van je individuele situatie.",
    },

    terms: {
      slug: "terms",
      title: "Gebruiksvoorwaarden",
      intro:
        "Deze gebruiksvoorwaarden bepalen hoe je m-pathy mag gebruiken. Door de dienst te gebruiken ga je hiermee akkoord.",
      last_updated: "Laatst bijgewerkt: 18 november 2025",
      sections: [
        {
          id: "scope",
          heading: "1. Omvang van de dienst",
          body:
            "m-pathy is een experimentele, AI-gestuurde assistent. Het is geen menselijke therapeut, advocaat, arts of financieel adviseur. " +
            "De dienst is bedoeld voor creatief werk, reflectie en technische ondersteuning.",
        },
        {
          id: "no_advice",
          heading: "2. Geen professioneel advies",
          body:
            "De door m-pathy gegenereerde inhoud mag nooit als enige basis dienen voor medische, juridische, financiële " +
            "of andere beslissingen met ernstige gevolgen. Raadpleeg voor dergelijke vragen altijd gekwalificeerde professionals.",
        },
        {
          id: "account",
          heading: "3. Account en tokens",
          body:
            "Toegang kan in de tijd en/of door een bepaald token-tegoed worden beperkt. Je bent verantwoordelijk " +
            "voor de vertrouwelijke behandeling van je inloggegevens en voor alle activiteiten onder je account.",
        },
        {
          id: "acceptable_use",
          heading: "4. Toegestaan gebruik",
          body:
            "Je mag m-pathy niet gebruiken om wetgeving te overtreden, anderen te schaden, onrechtmatige inhoud te genereren " +
            "of systemen aan te vallen. Wij kunnen accounts blokkeren of beperken die de dienst misbruiken.",
        },
        {
          id: "changes",
          heading: "5. Wijzigingen en beschikbaarheid",
          body:
            "Wij kunnen de functionaliteit van m-pathy op ieder moment aanpassen, uitbreiden of beperken, voor zover dit voor gebruikers redelijk is. " +
            "Wij streven naar een hoge beschikbaarheid, maar kunnen geen ononderbroken werking garanderen.",
        },
        {
          id: "liability",
          heading: "6. Aansprakelijkheidsbeperking",
          body:
            "Wij zijn aansprakelijk volgens de toepasselijke wetgeving bij opzet en grove nalatigheid. Bij lichte nalatigheid " +
            "zijn wij alleen aansprakelijk voor schending van essentiële contractuele verplichtingen en beperkt tot de typische, voorzienbare schade. " +
            "Verplichte aansprakelijkheid, bijvoorbeeld op grond van productaansprakelijkheid, blijft onverlet.",
        },
      ],
      disclaimer:
        "Deze gebruiksvoorwaarden structureren de contractuele relatie in vereenvoudigde vorm en vervangen geen individueel juridisch advies.",
    },

    refund: {
      slug: "refund",
      title: "Restitutiebeleid",
      intro:
        "m-pathy biedt momenteel een duidelijk model met eenmalige aankoop van toegang. Dit beleid legt uit hoe wij met betalingen en restituties omgaan.",
      last_updated: "Laatst bijgewerkt: 18 november 2025",
      sections: [
        {
          id: "model",
          heading: "1. Aankoopmodel",
          body:
            "Toegang tot m-pathy wordt momenteel verleend als eenmalige aankoop voor een bepaalde periode en/of een bepaald token-tegoed. " +
            "Er is geen automatische verlenging als abonnement.",
        },
        {
          id: "payment",
          heading: "2. Betalingsverwerking",
          body:
            "Betalingen worden verwerkt via Stripe of vergelijkbare betaalproviders. Hun voorwaarden en veiligheidsmaatregelen zijn aanvullend van toepassing.",
        },
        {
          id: "withdrawal",
          heading: "3. Herroepingsrecht",
          body:
            "Als consument in de Europese Unie kun je een wettelijk herroepingsrecht hebben voor digitale diensten. " +
            "Wanneer dit van toepassing is, word je hierover tijdens het bestelproces geïnformeerd.",
        },
        {
          id: "refunds",
          heading: "4. Restituties in de praktijk",
          body:
            "In de regel verstrekken wij geen restituties nadat de toegang is vrijgegeven en tokens kunnen worden gebruikt, " +
            "tenzij er een wettelijke verplichting bestaat of wij in een individueel geval uitdrukkelijk een restitutie toezeggen.",
        },
      ],
      disclaimer:
        "Dit restitutiebeleid beschrijft onze huidige praktijk en beperkt geen dwingende wettelijke rechten.",
    },

    legal: {
      slug: "legal",
      title: "Juridische informatie",
      intro:
        "Op deze pagina bundelen wij de belangrijkste juridische informatie over m-pathy.",
      last_updated: "Laatst bijgewerkt: 18 november 2025",
      sections: [
        {
          id: "overview",
          heading: "1. Overzicht",
          body:
            "m-pathy wordt geëxploiteerd door NAAL UG (beperkte aansprakelijkheid), gevestigd in München, Duitsland. " +
            "De dienst combineert geavanceerde AI-modellen met een sterke focus op privacy, duidelijkheid en controle door de gebruiker.",
        },
        {
          id: "jurisdiction",
          heading: "2. Toepasselijk recht en bevoegde rechtbank",
          body:
            "Tenzij dwingend consumentenrecht anders bepaalt, is het Duitse recht van toepassing. " +
            "Indien je handelt als ondernemer in de zin van het Duitse recht, is München de exclusief bevoegde rechtbank.",
        },
        {
          id: "online_dispute",
          heading: "3. Onlinegeschillenbeslechting",
          body:
            "De Europese Commissie stelt een platform voor onlinegeschillenbeslechting beschikbaar. " +
            "Wij zijn niet verplicht en in de regel ook niet bereid deel te nemen aan geschillenbeslechtingsprocedures " +
            "voor een consumentenarbitragecommissie.",
        },
      ],
      disclaimer:
        "Deze pagina is bedoeld om een transparant overzicht te bieden. In geval van tegenstrijdigheid kan de Duitstalige versie doorslaggevend zijn als de wet dat vereist.",
    },
  },

  // ================================================================
  // РУССКИЙ
  // ================================================================
  ru: {
    imprint: {
      slug: "imprint",
      title: "Юридическая информация",
      intro:
        "В этом разделе приведены сведения об операторе m-pathy, которые требуются согласно немецкому и частично европейскому праву.",
      last_updated: "Последнее обновление: 18 ноября 2025 г.",
      sections: [
        {
          id: "provider",
          heading: "1. Оператор",
          body:
            "NAAL UG (с ограниченной ответственностью)\n" +
            "Maria-Theresia-Str. 11\n" +
            "81675 Мюнхен\n" +
            "Германия\n\n" +
            "Эл. почта: support@m-pathy.ai",
        },
        {
          id: "representative",
          heading: "2. Представитель",
          body: "Управляющий директор: Alexander Khayat.",
        },
        {
          id: "register",
          heading: "3. Запись в торговом реестре",
          body:
            "Компания внесена в торговый реестр. Наименование суда и регистрационный номер " +
            "будут добавлены, как только станут официально доступны.",
        },
        {
          id: "vat",
          heading: "4. Номер НДС",
          body:
            "Если компании будет присвоен идентификационный номер плательщика НДС, он будет указан здесь.",
        },
        {
          id: "contact",
          heading: "5. Контакты",
          body:
            "На данный момент самый быстрый способ связаться с нами по поводу m-pathy — написать на адрес support@m-pathy.ai. " +
            "Пожалуйста, не отправляйте по электронной почте особо конфиденциальные медицинские или платёжные данные.",
        },
      ],
      disclaimer:
        "Эта юридическая информация предоставляется для прозрачности и не заменяет индивидуальную юридическую консультацию.",
    },

    privacy: {
      slug: "privacy",
      title: "Политика конфиденциальности",
      intro:
        "В этой политике конфиденциальности в простой форме объясняется, как мы обрабатываем персональные данные при использовании m-pathy.",
      last_updated: "Последнее обновление: 18 ноября 2025 г.",
      sections: [
        {
          id: "controller",
          heading: "1. Ответственный оператор",
          body:
            "За обработку данных в связи с m-pathy отвечает:\n\n" +
            "NAAL UG (с ограниченной ответственностью)\n" +
            "Maria-Theresia-Str. 11\n" +
            "81675 Мюнхен, Германия\n" +
            "Эл. почта: support@m-pathy.ai",
        },
        {
          id: "data_categories",
          heading: "2. Категории данных",
          body:
            "Мы обрабатываем, насколько это необходимо, в частности следующие категории данных:\n" +
            "• данные об использовании и журналы сайта,\n" +
            "• учётные и контактные данные, которые вы предоставляете активно,\n" +
            "• содержимое ваших запросов и ответов, отправляемых системе,\n" +
            "• технические метаданные, такие как время, тип браузера и базовая информация об устройстве.",
        },
        {
          id: "purposes",
          heading: "3. Цели и правовые основания",
          body:
            "Мы используем ваши данные, в частности, для того чтобы:\n" +
            "• предоставлять и поддерживать работу m-pathy,\n" +
            "• обеспечивать безопасность и техническое обслуживание сервиса,\n" +
            "• отвечать на запросы в поддержку,\n" +
            "• выполнять законодательно установленные требования по хранению и документированию.\n\n" +
            "Если применяется GDPR, правовыми основаниями являются, в частности, ст. 6 (1) (b) (договор), (c) (правовое обязательство) " +
            "и (f) GDPR (законный интерес в безопасной и эффективной работе сервиса).",
        },
        {
          id: "processors",
          heading: "4. Обработчики и получатели",
          body:
            "Мы используем тщательно отобранных поставщиков услуг для хостинга, инфраструктуры, аналитики без персональных профилей " +
            "и обработки платежей (например, Stripe). Они связаны договорными обязательствами обрабатывать данные " +
            "только по нашим инструкциям и в соответствии с действующим законодательством.",
        },
        {
          id: "retention",
          heading: "5. Срок хранения",
          body:
            "Мы храним персональные данные только столько, сколько это необходимо для указанных целей или требуется законом. " +
            "Журналы, как правило, хранятся лишь короткое техническое время. Данные, относящиеся к договору, " +
            "могут сохраняться дольше для выполнения коммерческих и налоговых обязанностей по хранению.",
        },
        {
          id: "rights",
          heading: "6. Ваши права",
          body:
            "При применении GDPR вы имеете, в частности, право на доступ к данным, их исправление, удаление, " +
            "ограничение обработки, переносимость данных, а также право возражать против определённых видов обработки. " +
            "Вы также имеете право подать жалобу в надзорный орган по защите данных.",
        },
        {
          id: "ai",
          heading: "7. Использование сервисов ИИ",
          body:
            "m-pathy использует модели искусственного интеллекта, которые обрабатывают отправляемые вами запросы. " +
            "Мы принимаем технические и организационные меры для защиты ваших данных, однако ни одна система не может быть абсолютно безопасной. " +
            "По возможности избегайте ввода особо конфиденциальной информации, которую вы не хотели бы выводить за пределы своего устройства.",
        },
      ],
      disclaimer:
        "Настоящая политика конфиденциальности является упрощённым резюме и не заменяет полноценную юридическую оценку вашей конкретной ситуации.",
    },

    terms: {
      slug: "terms",
      title: "Условия использования",
      intro:
        "Настоящие условия регулируют порядок использования сервиса m-pathy. Используя сервис, вы соглашаетесь с ними.",
      last_updated: "Последнее обновление: 18 ноября 2025 г.",
      sections: [
        {
          id: "scope",
          heading: "1. Объём сервиса",
          body:
            "m-pathy — это экспериментальный ассистент на базе искусственного интеллекта. Это не человек-терапевт, " +
            "не адвокат, не врач и не финансовый консультант. Сервис предназначен для творческой работы, рефлексии " +
            "и технической поддержки.",
        },
        {
          id: "no_advice",
          heading: "2. Отсутствие профессиональных консультаций",
          body:
            "Сгенерированный m-pathy контент нельзя использовать в качестве единственной основы для принятия медицинских, юридических, финансовых " +
            "или иных решений с серьёзными последствиями. Во всех таких случаях обращайтесь к квалифицированным специалистам.",
        },
        {
          id: "account",
          heading: "3. Аккаунт и токены",
          body:
            "Доступ может ограничиваться по времени и/или по количеству доступных токенов. Вы несёте ответственность " +
            "за конфиденциальность своих учётных данных и за все действия, совершаемые через ваш аккаунт.",
        },
        {
          id: "acceptable_use",
          heading: "4. Допустимое использование",
          body:
            "Запрещается использовать m-pathy для нарушения законодательства, причинения вреда другим лицам, " +
            "создания противоправного контента или атак на системы. Мы вправе блокировать или ограничивать аккаунты, " +
            "которые используют сервис ненадлежащим образом.",
        },
        {
          id: "changes",
          heading: "5. Изменения и доступность",
          body:
            "Мы можем в любое время адаптировать, расширять или ограничивать функциональность m-pathy, если это разумно для пользователей. " +
            "Мы стремимся обеспечить высокую доступность сервиса, но не можем гарантировать его бесперебойную работу.",
        },
        {
          id: "liability",
          heading: "6. Ограничение ответственности",
          body:
            "Мы несем ответственность в соответствии с применимым законодательством при умысле и грубой неосторожности. " +
            "При лёгкой неосторожности наша ответственность ограничивается нарушением существенных договорных обязательств " +
            "и типичным предсказуемым ущербом. Обязательная ответственность, например по закону о ответственности за качество продукции, остаётся в силе.",
        },
      ],
      disclaimer:
        "Настоящие условия использования в упрощённой форме структурируют договорные отношения и не заменяют индивидуальную юридическую консультацию.",
    },

    refund: {
      slug: "refund",
      title: "Политика возврата средств",
      intro:
        "В настоящее время m-pathy предлагает понятную модель разовой покупки доступа. Здесь объясняется, как мы относимся к платежам и возвратам.",
      last_updated: "Последнее обновление: 18 ноября 2025 г.",
      sections: [
        {
          id: "model",
          heading: "1. Модель покупки",
          body:
            "На данный момент доступ к m-pathy предоставляется как разовая покупка на определённый период и/или с определённым пулом токенов. " +
            "Автоматического продления подписки нет.",
        },
        {
          id: "payment",
          heading: "2. Обработка платежей",
          body:
            "Платежи обрабатываются посредством Stripe или аналогичных платёжных провайдеров. Дополнительно применяются их условия и меры безопасности.",
        },
        {
          id: "withdrawal",
          heading: "3. Право на отзыв (отказ)",
          body:
            "Если вы являетесь потребителем в Европейском союзе, у вас может быть установленное законом право на отзыв для цифровых услуг. " +
            "При необходимости информация об этом праве предоставляется вам в процессе оформления заказа.",
        },
        {
          id: "refunds",
          heading: "4. Возвраты на практике",
          body:
            "Как правило, мы не осуществляем возврат средств после того, как доступ предоставлен и токены могут быть использованы, " +
            "если только на это нет юридической обязанности или мы явно не пообещали возврат в конкретном случае.",
        },
      ],
      disclaimer:
        "Данная политика возврата описывает нашу текущую практику и не ограничивает установленные законом права.",
    },

    legal: {
      slug: "legal",
      title: "Правовая информация",
      intro:
        "На этой странице собрана основная правовая информация о сервисе m-pathy.",
      last_updated: "Последнее обновление: 18 ноября 2025 г.",
      sections: [
        {
          id: "overview",
          heading: "1. Обзор",
          body:
            "m-pathy управляется компанией NAAL UG (с ограниченной ответственностью), расположенной в Мюнхене, Германия. " +
            "Сервис сочетает в себе современные модели ИИ с серьёзным вниманием к конфиденциальности, ясности и контролю со стороны пользователя.",
        },
        {
          id: "jurisdiction",
          heading: "2. Применимое право и подсудность",
          body:
            "Если иное не предусмотрено императивными нормами о защите прав потребителей, применяется немецкое право. " +
            "Если вы выступаете в качестве предпринимателя по немецкому праву, исключительной подсудностью является Мюнхен.",
        },
        {
          id: "online_dispute",
          heading: "3. Внесудебное разрешение споров онлайн",
          body:
            "Европейская комиссия предоставляет платформу для онлайн-разрешения споров. " +
            "Мы не обязаны и, как правило, не намерены участвовать в процедурах разрешения споров " +
            "в органах по урегулированию потребительских споров.",
        },
      ],
      disclaimer:
        "Эта страница предназначена для прозрачного обзора. В случае расхождений при необходимости приоритет может иметь немецкая версия.",
    },
  },
zh: {
  imprint: {
    slug: "imprint",
    title: "法律声明",
    intro:
      "本法律声明包含根据德国及部分欧洲法律对 m-pathy 所要求的提供者信息。",
    last_updated: "最后更新：2025 年 11 月 18 日",
    sections: [
      {
        id: "provider",
        heading: "1. 提供者",
        body:
          "NAAL UG（有限责任公司）\n" +
          "Maria-Theresia-Str. 11\n" +
          "81675 Munich\n" +
          "德国\n\n" +
          "电子邮箱：support@m-pathy.ai",
      },
      {
        id: "representative",
        heading: "2. 法定代表人",
        body: "管理董事：Alexander Khayat.",
      },
      {
        id: "register",
        heading: "3. 商业登记",
        body:
          "公司已在商业登记册中注册。登记法院和注册号将在最终提供后添加。",
      },
      {
        id: "vat",
        heading: "4. 增值税号",
        body: "如分配增值税识别号，将在此处补充。",
      },
      {
        id: "contact",
        heading: "5. 联系方式",
        body:
          "目前联系 m-pathy 的最快方式是发送电子邮件至 support@m-pathy.ai。请勿通过电子邮件发送高度敏感的健康或支付数据。",
      },
    ],
    disclaimer:
      "本法律声明仅用于透明度目的，不构成个别法律建议。",
  },

  privacy: {
    slug: "privacy",
    title: "隐私政策",
    intro:
      "本隐私政策以简明方式说明我们在您使用 m-pathy 时如何处理个人数据。",
    last_updated: "最后更新：2025 年 11 月 18 日",
    sections: [
      {
        id: "controller",
        heading: "1. 数据控制者",
        body:
          "与 m-pathy 相关的数据处理由以下主体负责：\n\n" +
          "NAAL UG（有限责任公司）\n" +
          "Maria-Theresia-Str. 11\n" +
          "81675 Munich, Germany\n" +
          "电子邮箱：support@m-pathy.ai",
      },
      {
        id: "data_categories",
        heading: "2. 数据类别",
        body:
          "我们在必要范围内处理以下数据类别：\n" +
          "• 网站使用数据与日志数据\n" +
          "• 您主动提供的账户和联系信息\n" +
          "• 您发送给系统的提示与回答内容\n" +
          "• 技术元数据，如时间、浏览器类型、设备基础信息",
      },
      {
        id: "purposes",
        heading: "3. 目的与法律依据",
        body:
          "我们使用您的数据主要用于：\n" +
          "• 提供和运营 m-pathy，\n" +
          "• 确保服务安全及技术维护，\n" +
          "• 回答支持请求，\n" +
          "• 遵守法律规定的保存与记录义务。\n\n" +
          "在 GDPR 适用范围内，法律依据包括第 6 条第 1 款 (b)（合同）、(c)（法律义务）和 (f)（合法利益）。",
      },
      {
        id: "processors",
        heading: "4. 处理者与接收方",
        body:
          "我们使用经过严格筛选的服务提供商进行托管、基础设施、无用户画像的分析以及支付处理（例如 Stripe）。这些提供商均受合同约束，仅按我们的指示并遵守适用法律处理数据。",
      },
      {
        id: "retention",
        heading: "5. 保存期限",
        body:
          "我们仅在实现上述目的或法律要求的期限内保存个人数据。日志数据通常仅保存很短的技术时间。合同相关数据可能因商业和税务要求保存更久。",
      },
      {
        id: "rights",
        heading: "6. 您的权利",
        body:
          "在 GDPR 适用范围内，您享有访问、更正、删除、限制处理、数据可携带性及反对特定处理的权利。您亦可向数据保护监管机构提出投诉。",
      },
      {
        id: "ai",
        heading: "7. 人工智能服务的使用",
        body:
          "m-pathy 使用处理您提示的人工智能模型。我们采取技术和组织措施保护您的数据，但任何系统都无法绝对安全。请避免输入您不希望离开设备的高度敏感内容。",
      },
    ],
    disclaimer:
      "本隐私政策为简化摘要，不替代对您具体情况的完整法律审查。",
  },

  terms: {
    slug: "terms",
    title: "使用条款",
    intro:
      "本使用条款规定您如何使用 m-pathy。使用本服务即表示您接受这些条款。",
    last_updated: "最后更新：2025 年 11 月 18 日",
    sections: [
      {
        id: "scope",
        heading: "1. 服务范围",
        body:
          "m-pathy 是一个基于 AI 的实验性助手。它不是人类治疗师、律师、医生或财务顾问。该服务用于创意工作、反思和技术协助。",
      },
      {
        id: "no_advice",
        heading: "2. 无专业建议",
        body:
          "m-pathy 生成的内容不得作为医学、法律、财务或其他重大决策的唯一依据。请始终咨询专业人士。",
      },
      {
        id: "account",
        heading: "3. 账户与 Token",
        body:
          "访问可能受期限或 Token 数量限制。您需负责保护自己的账户凭证及账户内的所有活动。",
      },
      {
        id: "acceptable_use",
        heading: "4. 可接受使用",
        body:
          "禁止使用 m-pathy 违反法律、伤害他人、生成违法内容或攻击系统。我们可限制或封禁滥用账户。",
      },
      {
        id: "changes",
        heading: "5. 变更与可用性",
        body:
          "我们可随时调整服务的功能，只要对用户合理。我们努力保持高可用性，但不保证不间断运行。",
      },
      {
        id: "liability",
        heading: "6. 责任限制",
        body:
          "我们对故意或重大过失承担责任。轻微过失仅在违反核心义务时承担，并限于典型可预见损害。强制性责任（如产品责任）不受影响。",
      },
    ],
    disclaimer:
      "本使用条款为结构化摘要，不替代个别法律建议。",
  },

  refund: {
    slug: "refund",
    title: "退款政策",
    intro:
      "m-pathy 目前提供一次性购买的访问模式。本政策说明我们如何处理付款与退款。",
    last_updated: "最后更新：2025 年 11 月 18 日",
    sections: [
      {
        id: "model",
        heading: "1. 购买模式",
        body:
          "当前 m-pathy 的访问权限以一次性购买形式授予，包含特定期限和/或 Token 配额。无自动订阅续期。",
      },
      {
        id: "payment",
        heading: "2. 支付处理",
        body:
          "支付通过 Stripe 或类似提供商处理，其条款与安全措施同时适用。",
      },
      {
        id: "withdrawal",
        heading: "3. 撤销权",
        body:
          "若您是欧盟消费者，可能享有数字服务的法定撤销权。在结账过程中将向您提示相关信息。",
      },
      {
        id: "refunds",
        heading: "4. 实际退款",
        body:
          "除法律义务或特殊承诺外，一旦访问权限启用且可使用 Token，我们通常不提供退款。",
      },
    ],
    disclaimer:
      "本退款政策为当前实践总结，不限制强制性法定权利。",
  },

  legal: {
    slug: "legal",
    title: "法律信息",
    intro:
      "此页面汇总 m-pathy 的主要法律信息。",
    last_updated: "最后更新：2025 年 11 月 18 日",
    sections: [
      {
        id: "overview",
        heading: "1. 概览",
        body:
          "m-pathy 由位于德国慕尼黑的 NAAL UG 运营。服务结合先进 AI 模型，重视隐私、透明度和用户控制。",
      },
      {
        id: "jurisdiction",
        heading: "2. 适用法律与管辖地",
        body:
          "除消费者保护的强制规定外，适用德国法律。如您为德国法意义上的商人，专属管辖地为慕尼黑。",
      },
      {
        id: "online_dispute",
        heading: "3. 在线争议解决",
        body:
          "欧洲委员会提供在线争议解决平台。我们通常不参与其流程。",
      },
    ],
    disclaimer:
      "本页面仅提供透明概览，如有冲突，法律要求时以德文版为准。",
  },
},

ja: {
  imprint: {
    slug: "imprint",
    title: "法律情報",
    intro:
      "本ページには、ドイツ法および一部の欧州法に基づき m-pathy に必要とされる提供者情報が記載されています。",
    last_updated: "最終更新日：2025年11月18日",
    sections: [
      {
        id: "provider",
        heading: "1. 提供者",
        body:
          "NAAL UG（有限責任会社）\n" +
          "Maria-Theresia-Str. 11\n" +
          "81675 Munich\n" +
          "ドイツ\n\n" +
          "E-mail：support@m-pathy.ai",
      },
      {
        id: "representative",
        heading: "2. 法定代理人",
        body: "代表取締役：Alexander Khayat.",
      },
      {
        id: "register",
        heading: "3. 商業登記",
        body:
          "当社は商業登記簿に登録されています。登記裁判所および登録番号は、正式に利用可能になり次第追記されます。",
      },
      {
        id: "vat",
        heading: "4. VAT番号",
        body: "VAT（付加価値税）識別番号が付与された場合、ここに記載されます。",
      },
      {
        id: "contact",
        heading: "5. お問い合わせ",
        body:
          "現在、m-pathy に関するお問い合わせは support@m-pathy.ai へのメールが最も迅速です。高度な機微情報（健康・支払い等）はメールで送信しないでください。",
      },
    ],
    disclaimer:
      "本法律情報は透明性のためのものであり、個別の法的助言に代わるものではありません。",
  },

  privacy: {
    slug: "privacy",
    title: "プライバシーポリシー",
    intro:
      "本プライバシーポリシーでは、m-pathy 利用時の個人データの取り扱いについて、分かりやすく説明します。",
    last_updated: "最終更新日：2025年11月18日",
    sections: [
      {
        id: "controller",
        heading: "1. データ管理者",
        body:
          "m-pathy に関連するデータ処理の管理者は以下の通りです：\n\n" +
          "NAAL UG（有限責任会社）\n" +
          "Maria-Theresia-Str. 11\n" +
          "81675 Munich, Germany\n" +
          "E-mail：support@m-pathy.ai",
      },
      {
        id: "data_categories",
        heading: "2. データの種類",
        body:
          "当社が必要に応じて処理する主なデータカテゴリ：\n" +
          "• ウェブサイトの利用データおよびログデータ\n" +
          "• ユーザーが自ら提供するアカウント・連絡先情報\n" +
          "• システムへ送信されるプロンプトおよび回答内容\n" +
          "• 時刻、ブラウザ種類、基本デバイス情報などの技術メタデータ",
      },
      {
        id: "purposes",
        heading: "3. 目的と法的根拠",
        body:
          "当社は以下の目的でデータを使用します：\n" +
          "• m-pathy の提供・運用\n" +
          "• サービスの安全性確保および技術的維持\n" +
          "• サポートリクエストへの対応\n" +
          "• 法的に求められる保存・記録義務の遵守\n\n" +
          "GDPR が適用される場合、主な法的根拠は Art.6(1)(b)（契約）、(c)（法的義務）、(f)（正当な利益）です。",
      },
      {
        id: "processors",
        heading: "4. 処理者および受領者",
        body:
          "当社は、ホスティング、インフラ、プロファイル非作成型アナリティクス、決済処理（例：Stripe）のために慎重に選定したサービスプロバイダを利用します。これらのプロバイダは契約上、当社の指示および適用法に従ってのみデータを処理します。",
      },
      {
        id: "retention",
        heading: "5. 保管期間",
        body:
          "個人データは、上記目的のために必要な期間または法的に要求される期間のみ保管します。ログデータは通常、短期間の技術的保存に限られます。契約関連データは、商取引・税務上の理由でより長く保管されることがあります。",
      },
      {
        id: "rights",
        heading: "6. 利用者の権利",
        body:
          "GDPR が適用される場合、利用者はアクセス権、訂正権、削除権、処理制限、データ可搬性、特定処理への異議申立て権などを有します。また、監督機関へ苦情を申し立てる権利もあります。",
      },
      {
        id: "ai",
        heading: "7. AI サービスの利用",
        body:
          "m-pathy は、利用者が送信したプロンプトを処理する AI モデルを使用します。当社はデータ保護のための技術的・組織的措置を講じますが、完全な安全性を保証できるシステムは存在しません。デバイスから出したくない機微情報の入力は避けてください。",
      },
    ],
    disclaimer:
      "本プライバシーポリシーは簡易的な概要であり、個別事情に対する法的検討を代替するものではありません。",
  },

  terms: {
    slug: "terms",
    title: "利用規約",
    intro:
      "本利用規約は、m-pathy の使用方法を定めるものです。本サービスの利用により、利用規約に同意したものとみなします。",
    last_updated: "最終更新日：2025年11月18日",
    sections: [
      {
        id: "scope",
        heading: "1. サービス範囲",
        body:
          "m-pathy は AI ベースの実験的アシスタントです。人間の治療者、弁護士、医師、金融アドバイザーではありません。サービスは創造的作業、内省、技術的支援を目的としています。",
      },
      {
        id: "no_advice",
        heading: "2. 専門的助言ではありません",
        body:
          "m-pathy が生成する内容を、重大な影響を持つ医療・法律・金融その他の意思決定の唯一の根拠として使用してはいけません。専門家に相談してください。",
      },
      {
        id: "account",
        heading: "3. アカウントとトークン",
        body:
          "アクセスは期間やトークン数により制限される場合があります。利用者は自身の認証情報およびアカウント内の全活動に責任を負います。",
      },
      {
        id: "acceptable_use",
        heading: "4. 許容される利用",
        body:
          "m-pathy を違法行為、他者への害、違法コンテンツ生成、システム攻撃に利用することは禁止されています。乱用があればアカウントの制限や停止が行われます。",
      },
      {
        id: "changes",
        heading: "5. 変更と可用性",
        body:
          "当社は、ユーザーにとって合理的な範囲で、m-pathy の機能を随時変更・拡張・制限する場合があります。高い可用性を目指しますが、無停止運用を保証するものではありません。",
      },
      {
        id: "liability",
        heading: "6. 責任の制限",
        body:
          "当社は、故意または重大な過失に対して法に従って責任を負います。軽過失の場合、重要な契約義務違反に限り、典型的かつ予見可能な損害に対して責任を負います。強制的な責任（例：製造物責任法）は影響を受けません。",
      },
    ],
    disclaimer:
      "本利用規約は契約関係を簡易に構造化したものであり、個別の法的助言に代わるものではありません。",
  },

  refund: {
    slug: "refund",
    title: "返金ポリシー",
    intro:
      "m-pathy は現在、明確な単回購入モデルを採用しています。本ポリシーでは支払いおよび返金の取扱いを説明します。",
    last_updated: "最終更新日：2025年11月18日",
    sections: [
      {
        id: "model",
        heading: "1. 購入モデル",
        body:
          "現在、m-pathy のアクセス権は特定期間および/またはトークン枠を含む単回購入として付与されます。自動更新サブスクリプションはありません。",
      },
      {
        id: "payment",
        heading: "2. 支払い処理",
        body:
          "支払いは Stripe などの決済サービスを通じて行われます。追加で各サービスの条件と安全対策が適用されます。",
      },
      {
        id: "withdrawal",
        heading: "3. 撤回権",
        body:
          "EU の消費者にはデジタルサービスに関する法的撤回権が認められる場合があります。該当する場合、購入手続き中に説明が行われます。",
      },
      {
        id: "refunds",
        heading: "4. 実際の返金",
        body:
          "アクセス権が付与されトークンが利用可能となった後は、法律上の義務や個別の明示的約束がある場合を除き、返金は原則行いません。",
      },
    ],
    disclaimer:
      "本返金ポリシーは現在の運用の概要であり、強行法による権利を制限するものではありません。",
  },

  legal: {
    slug: "legal",
    title: "法的情報",
    intro:
      "本ページでは m-pathy に関する主要な法的情報をまとめています。",
    last_updated: "最終更新日：2025年11月18日",
    sections: [
      {
        id: "overview",
        heading: "1. 概要",
        body:
          "m-pathy は、ドイツ・ミュンヘンに所在する NAAL UG（有限責任会社）により運営されています。サービスは高度な AI モデルと、プライバシー・透明性・利用者のコントロールを重視した設計を組み合わせています。",
      },
      {
        id: "jurisdiction",
        heading: "2. 適用法および管轄",
        body:
          "消費者保護法により別段の定めがある場合を除き、適用法はドイツ法となります。ドイツ法上の商業者として行動する場合、専属管轄はミュンヘンです。",
      },
      {
        id: "online_dispute",
        heading: "3. オンライン紛争解決",
        body:
          "欧州委員会はオンライン紛争解決プラットフォームを提供しています。当社はこの手続きに通常参加しません。",
      },
    ],
    disclaimer:
      "本ページは透明性のための概要です。法的要件により必要な場合は、ドイツ語版が優先されることがあります。",
  },
},
ko: {
  imprint: {
    slug: "imprint",
    title: "법적 고지",
    intro:
      "본 법적 고지에는 독일 및 일부 유럽 법률에 따라 m-pathy에 요구되는 제공자 정보가 포함되어 있습니다.",
    last_updated: "최종 업데이트: 2025년 11월 18일",
    sections: [
      {
        id: "provider",
        heading: "1. 제공자",
        body:
          "NAAL UG (유한책임회사)\n" +
          "Maria-Theresia-Str. 11\n" +
          "81675 Munich\n" +
          "독일\n\n" +
          "E-mail: support@m-pathy.ai",
      },
      {
        id: "representative",
        heading: "2. 법적 대표자",
        body: "관리이사: Alexander Khayat.",
      },
      {
        id: "register",
        heading: "3. 상업 등기",
        body:
          "이 회사는 상업 등기부에 등록되어 있습니다. 관할 법원과 등기 번호는 공식적으로 제공되는 즉시 추가됩니다.",
      },
      {
        id: "vat",
        heading: "4. VAT 번호",
        body: "VAT 식별 번호가 발급되는 경우, 여기에 기재됩니다.",
      },
      {
        id: "contact",
        heading: "5. 문의",
        body:
          "현재 m-pathy 관련 문의는 support@m-pathy.ai 로 이메일을 보내는 것이 가장 빠릅니다. 건강 또는 결제 관련의 민감한 정보는 이메일로 보내지 마십시오.",
      },
    ],
    disclaimer:
      "본 법적 고지는 투명성을 위한 것이며 개별 법률 자문을 대체하지 않습니다.",
  },

  privacy: {
    slug: "privacy",
    title: "개인정보 처리방침",
    intro:
      "본 개인정보 처리방침은 m-pathy 사용 시 개인 데이터가 어떻게 처리되는지 간단히 설명합니다.",
    last_updated: "최종 업데이트: 2025년 11월 18일",
    sections: [
      {
        id: "controller",
        heading: "1. 데이터 관리자",
        body:
          "m-pathy 관련 데이터 처리는 다음 기관이 책임집니다:\n\n" +
          "NAAL UG (유한책임회사)\n" +
          "Maria-Theresia-Str. 11\n" +
          "81675 Munich, Germany\n" +
          "E-mail: support@m-pathy.ai",
      },
      {
        id: "data_categories",
        heading: "2. 데이터 종류",
        body:
          "필요한 경우 다음 데이터를 처리합니다:\n" +
          "• 웹사이트 사용 데이터 및 로그 데이터\n" +
          "• 사용자가 직접 제공한 계정 및 연락처 정보\n" +
          "• 사용자가 시스템에 전송하는 프롬프트 및 응답 내용\n" +
          "• 시간, 브라우저 유형, 기초적인 기기 정보 등의 기술적 메타데이터",
      },
      {
        id: "purposes",
        heading: "3. 목적 및 법적 근거",
        body:
          "데이터는 다음 목적을 위해 사용됩니다:\n" +
          "• m-pathy 제공 및 운영\n" +
          "• 서비스의 보안 및 기술 유지\n" +
          "• 지원 요청 응답\n" +
          "• 법적 보관 및 문서 의무 준수\n\n" +
          "GDPR이 적용되는 경우, 법적 근거는 Art.6(1)(b)(계약), (c)(법적 의무), (f)(정당한 이익)입니다.",
      },
      {
        id: "processors",
        heading: "4. 처리자 및 수신자",
        body:
          "당사는 호스팅, 인프라, 비프로파일 분석, 결제 처리(예: Stripe)를 위해 신중히 선정된 서비스 제공업체를 사용합니다. 해당 업체들은 계약에 따라 당사의 지침 및 관련 법률 준수 하에 데이터를 처리합니다.",
      },
      {
        id: "retention",
        heading: "5. 보관 기간",
        body:
          "개인 데이터는 상기 목적을 위해 필요한 기간 또는 법이 요구하는 기간 동안 보관됩니다. 로그 데이터는 일반적으로 짧은 기술적 기간만 저장됩니다. 계약 관련 데이터는 상업 및 세무 목적을 위해 더 오래 보관될 수 있습니다.",
      },
      {
        id: "rights",
        heading: "6. 이용자의 권리",
        body:
          "GDPR이 적용되는 경우, 이용자는 데이터 열람, 정정, 삭제, 처리 제한, 데이터 이동권, 특정 처리에 대한 이의 제기 등의 권리를 갖습니다. 또한 감독 기관에 불만을 제기할 권리도 있습니다.",
      },
      {
        id: "ai",
        heading: "7. AI 서비스 사용",
        body:
          "m-pathy는 사용자가 전송한 프롬프트를 처리하는 AI 모델을 사용합니다. 당사는 개인 데이터 보호를 위해 기술적·조직적 조치를 취하지만 절대적으로 안전한 시스템은 없습니다. 장치에서 유출되기를 원치 않는 민감한 정보는 입력하지 마십시오.",
      },
    ],
    disclaimer:
      "본 개인정보 처리방침은 요약이며, 개별 사례에 대한 전체 법적 검토를 대체하지 않습니다.",
  },

  terms: {
    slug: "terms",
    title: "이용 약관",
    intro:
      "본 이용 약관은 m-pathy 서비스 사용 방식에 대해 규정합니다. 서비스를 이용하면 본 약관에 동의한 것으로 간주됩니다.",
    last_updated: "최종 업데이트: 2025년 11월 18일",
    sections: [
      {
        id: "scope",
        heading: "1. 서비스 범위",
        body:
          "m-pathy는 AI 기반 실험적 보조 도구입니다. 인간 치료사, 변호사, 의사 또는 금융 상담사가 아닙니다. 서비스는 창의적 작업, 성찰 및 기술 지원을 목적으로 합니다.",
      },
      {
        id: "no_advice",
        heading: "2. 전문적 조언 아님",
        body:
          "m-pathy가 생성한 콘텐츠는 의료, 법률, 금융 또는 기타 심각한 결정을 위한 유일한 근거로 사용해서는 안 됩니다. 전문 자문을 구하십시오.",
      },
      {
        id: "account",
        heading: "3. 계정 및 토큰",
        body:
          "접근 권한은 기간 또는 토큰 수에 의해 제한될 수 있습니다. 사용자는 자신의 인증 정보 및 계정 내 모든 활동에 대한 책임을 집니다.",
      },
      {
        id: "acceptable_use",
        heading: "4. 허용되는 이용",
        body:
          "m-pathy를 법률 위반, 타인 피해, 불법 콘텐츠 생성, 시스템 공격 등에 사용해서는 안 됩니다. 남용이 발생할 경우 계정이 제한 또는 차단될 수 있습니다.",
      },
      {
        id: "changes",
        heading: "5. 변경 및 가용성",
        body:
          "당사는 사용자에게 합리적인 범위 내에서 m-pathy 기능을 변경·확장·제한할 수 있습니다. 높은 가용성을 목표로 하지만 무중단 운영을 보장할 수는 없습니다.",
      },
      {
        id: "liability",
        heading: "6. 책임 제한",
        body:
          "당사는 고의 또는 중대한 과실에 대해 법률에 따라 책임을 집니다. 경미한 과실의 경우, 중요한 계약 의무 위반에 한해 전형적이고 예측 가능한 손해범위에서 책임을 집니다. 강제 책임(예: 제조물 책임법)은 영향을 받지 않습니다.",
      },
    ],
    disclaimer:
      "본 이용 약관은 계약 관계를 단순화하여 구조화한 것이며 개별 법률 자문을 대체하지 않습니다.",
  },

  refund: {
    slug: "refund",
    title: "환불 정책",
    intro:
      "m-pathy는 현재 명확한 일회성 구매 모델을 제공합니다. 본 정책은 결제 및 환불 처리 방식을 설명합니다.",
    last_updated: "최종 업데이트: 2025년 11월 18일",
    sections: [
      {
        id: "model",
        heading: "1. 구매 모델",
        body:
          "m-pathy 접근 권한은 특정 기간 및/또는 토큰 할당량을 포함한 일회성 구매로 제공됩니다. 자동 구독 갱신은 없습니다.",
      },
      {
        id: "payment",
        heading: "2. 결제 처리",
        body:
          "결제는 Stripe 등 유사한 결제 제공업체를 통해 처리됩니다. 해당 제공업체의 조건 및 보안 조치가 추가로 적용됩니다.",
      },
      {
        id: "withdrawal",
        heading: "3. 철회권",
        body:
          "EU 소비자는 디지털 서비스에 대한 법적 철회권을 가질 수 있습니다. 적용되는 경우 결제 과정에서 안내됩니다。",
      },
      {
        id: "refunds",
        heading: "4. 실제 환불",
        body:
          "접근 권한이 활성화되고 토큰 사용이 가능해진 이후에는, 법적 의무 또는 당사의 명시적 약속이 있는 경우를 제외하고 환불이 제공되지 않습니다.",
      },
    ],
    disclaimer:
      "본 환불 정책은 현재 운영 방식을 요약한 것이며, 강행 법규에 따른 권리를 제한하지 않습니다.",
  },

  legal: {
    slug: "legal",
    title: "법적 정보",
    intro:
      "본 페이지에는 m-pathy에 관한 주요 법적 정보가 요약되어 있습니다.",
    last_updated: "최종 업데이트: 2025년 11월 18일",
    sections: [
      {
        id: "overview",
        heading: "1. 개요",
        body:
          "m-pathy는 독일 뮌헨에 소재한 NAAL UG(유한책임회사)가 운영합니다. 서비스는 고급 AI 모델과 프라이버시·명확성·사용자 통제에 대한 강한 중점을 결합합니다.",
      },
      {
        id: "jurisdiction",
        heading: "2. 준거법 및 관할",
        body:
          "강행적 소비자 보호 규정이 달리 정하지 않는 한, 준거법은 독일법입니다. 독일 법상 사업자로 활동하는 경우, 전속 관할은 뮌헨입니다.",
      },
      {
        id: "online_dispute",
        heading: "3. 온라인 분쟁 해결",
        body:
          "유럽위원회는 온라인 분쟁 해결 플랫폼을 제공합니다. 당사는 일반적으로 이 절차에 참여하지 않습니다.",
      },
    ],
    disclaimer:
      "본 페이지는 투명성을 위한 개요이며, 법적으로 필요한 경우 독일어 버전이 우선할 수 있습니다.",
  },
},
ar: {
  imprint: {
    slug: "imprint",
    title: "المعلومات القانونية",
    intro:
      "تتضمن هذه الصفحة المعلومات المطلوبة لمزوّد خدمة m-pathy بموجب القانون الألماني وبعض القوانين الأوروبية.",
    last_updated: "آخر تحديث: 18 نوفمبر 2025",
    sections: [
      {
        id: "provider",
        heading: "1. المزوّد",
        body:
          "NAAL UG (ذات مسؤولية محدودة)\n" +
          "Maria-Theresia-Str. 11\n" +
          "81675 Munich\n" +
          "ألمانيا\n\n" +
          "البريد الإلكتروني: support@m-pathy.ai",
      },
      {
        id: "representative",
        heading: "2. الممثل القانوني",
        body: "المدير العام: Alexander Khayat.",
      },
      {
        id: "register",
        heading: "3. السجل التجاري",
        body:
          "الشركة مسجّلة في السجل التجاري. سيتم إضافة رقم التسجيل والمحكمة المختصة فور توفرها بشكل نهائي.",
      },
      {
        id: "vat",
        heading: "4. رقم ضريبة القيمة المضافة",
        body: "في حال تخصيص رقم ضريبة قيمة مضافة، سيتم إدراجه هنا.",
      },
      {
        id: "contact",
        heading: "5. الاتصال",
        body:
          "أسرع طريقة للتواصل معنا بشأن m-pathy حالياً هي عبر البريد الإلكتروني support@m-pathy.ai. يُرجى عدم إرسال بيانات صحية أو مالية حساسة عبر البريد الإلكتروني.",
      },
    ],
    disclaimer:
      "هذه المعلومات القانونية مخصّصة للشفافية ولا تُعد بديلاً عن استشارة قانونية فردية.",
  },

  privacy: {
    slug: "privacy",
    title: "سياسة الخصوصية",
    intro:
      "توضح سياسة الخصوصية هذه بشكل مبسّط كيفية معالجة بياناتك الشخصية عند استخدامك m-pathy.",
    last_updated: "آخر تحديث: 18 نوفمبر 2025",
    sections: [
      {
        id: "controller",
        heading: "1. المسؤول عن المعالجة",
        body:
          "المسؤول عن معالجة البيانات المرتبطة بخدمة m-pathy هو:\n\n" +
          "NAAL UG (ذات مسؤولية محدودة)\n" +
          "Maria-Theresia-Str. 11\n" +
          "81675 Munich, Germany\n" +
          "البريد الإلكتروني: support@m-pathy.ai",
      },
      {
        id: "data_categories",
        heading: "2. فئات البيانات",
        body:
          "نعالج، عند الضرورة، الفئات التالية من البيانات:\n" +
          "• بيانات الاستخدام وسجلات الموقع\n" +
          "• بيانات الحساب وبيانات التواصل التي تقدمها بنفسك\n" +
          "• محتوى الطلبات (prompts) والإجابات التي ترسلها للنظام\n" +
          "• البيانات التقنية مثل الوقت، نوع المتصفح، معلومات الجهاز الأساسية",
      },
      {
        id: "purposes",
        heading: "3. الأغراض والأسس القانونية",
        body:
          "نستخدم بياناتك للأغراض التالية:\n" +
          "• توفير وتشغيل خدمة m-pathy\n" +
          "• ضمان الصيانة التقنية وأمن الخدمة\n" +
          "• الرد على طلبات الدعم\n" +
          "• الوفاء بمتطلبات التخزين والتوثيق القانونية\n\n" +
          "في حال تطبيق اللائحة العامة لحماية البيانات (GDPR)، فإن الأسس القانونية تشمل المادة 6(1)(b) (عقد)، المادة 6(1)(c) (التزام قانوني)، والمادة 6(1)(f) (مصلحة مشروعة).",
      },
      {
        id: "processors",
        heading: "4. المعالِجون والمستلمون",
        body:
          "نستخدم مزوّدي خدمات مختارين بعناية لاستضافة الخدمة، البنية التحتية، التحليلات غير القائمة على التتبع الشخصي، ومعالجة الدفعات (مثل Stripe). هؤلاء المزوّدون ملتزمون تعاقدياً بمعالجة البيانات حصراً وفق تعليماتنا ووفق القانون.",
      },
      {
        id: "retention",
        heading: "5. مدة الاحتفاظ بالبيانات",
        body:
          "نحتفظ بالبيانات الشخصية فقط للمدة اللازمة للأغراض محددة أعلاه أو كما يطلب القانون. عادةً ما تُحتفظ سجلات النظام لفترة تقنية قصيرة. ويمكن الاحتفاظ ببيانات العقود لفترات أطول لأسباب تجارية أو ضريبية.",
      },
      {
        id: "rights",
        heading: "6. حقوقك",
        body:
          "عند تطبيق GDPR، يكون لك الحق في الوصول إلى بياناتك، وتصحيحها، وحذفها، وتقييد معالجتها، ونقلها، بالإضافة إلى الحق في الاعتراض على بعض أنواع المعالجة. كما يمكنك تقديم شكوى إلى سلطة حماية البيانات.",
      },
      {
        id: "ai",
        heading: "7. استخدام خدمات الذكاء الاصطناعي",
        body:
          "يستخدم m-pathy نماذج ذكاء اصطناعي لمعالجة الطلبات التي ترسلها. نتخذ إجراءات تقنية وتنظيمية لحماية بياناتك، لكن لا يوجد نظام آمن تماماً. لذلك يُنصح بتجنب إدخال محتوى شديد الحساسية لا ترغب بخروجه من جهازك.",
      },
    ],
    disclaimer:
      "هذه السياسة ملخص مبسّط ولا تُعد بديلاً عن مراجعة قانونية كاملة لحالتك الشخصية.",
  },

  terms: {
    slug: "terms",
    title: "شروط الاستخدام",
    intro:
      "تحدد هذه الشروط كيفية استخدامك لخدمة m-pathy. باستخدام الخدمة، فإنك توافق على هذه الشروط.",
    last_updated: "آخر تحديث: 18 نوفمبر 2025",
    sections: [
      {
        id: "scope",
        heading: "1. نطاق الخدمة",
        body:
          "m-pathy مساعد تجريبي قائم على الذكاء الاصطناعي. ليس طبيبًا أو محاميًا أو مستشارًا ماليًا بشريًا. تم تصميم الخدمة للعمل الإبداعي، والتفكير، والدعم التقني.",
      },
      {
        id: "no_advice",
        heading: "2. عدم تقديم نصائح مهنية",
        body:
          "لا يجب استخدام المحتوى الذي يولّده m-pathy كأساس وحيد لقرارات طبية أو قانونية أو مالية أو قرارات خطيرة أخرى. عليك دائمًا استشارة متخصصين.",
      },
      {
        id: "account",
        heading: "3. الحساب والرموز",
        body:
          "يمكن أن يكون الوصول محدودًا زمنيًا و/أو بعدد من الرموز. أنت مسؤول عن الحفاظ على سرية بيانات الدخول وجميع الأنشطة تحت حسابك.",
      },
      {
        id: "acceptable_use",
        heading: "4. الاستخدام المقبول",
        body:
          "يُمنع استخدام m-pathy لانتهاك القانون أو الإضرار بالآخرين أو إنتاج محتوى غير قانوني أو مهاجمة الأنظمة. يمكن أن نقيد أو نعلّق الحسابات المسيئة.",
      },
      {
        id: "changes",
        heading: "5. التغييرات والتوافر",
        body:
          "قد نجري تغييرات أو نوسع أو نقيّد الوظائف في أي وقت طالما كان ذلك معقولاً للمستخدمين. نسعى لتوفير توافر عالٍ، لكن لا يمكننا ضمان تشغيل دون انقطاع.",
      },
      {
        id: "liability",
        heading: "6. حدود المسؤولية",
        body:
          "نحن مسؤولون قانونيًا عن الأضرار الناتجة عن الإهمال الجسيم أو العمد. أما في حالات الإهمال البسيط، فنحن مسؤولون فقط عن خرق الالتزامات الأساسية وبحدود الضرر المتوقع. لا تتأثر المسؤولية الإجبارية (مثل مسؤولية المنتجات).",
      },
    ],
    disclaimer:
      "هذا الملخص لا يحل محل استشارة قانونية فردية.",
  },

  refund: {
    slug: "refund",
    title: "سياسة الاسترجاع",
    intro:
      "يوفر m-pathy حاليًا نموذج شراء لمرة واحدة يمنح حق الوصول. توضح هذه السياسة كيفية التعامل مع المدفوعات والاسترجاعات.",
    last_updated: "آخر تحديث: 18 نوفمبر 2025",
    sections: [
      {
        id: "model",
        heading: "1. نموذج الشراء",
        body:
          "يتم منح الوصول إلى m-pathy كعملية شراء لمرة واحدة لفترة محددة و/أو حصة رموز. لا يوجد تجديد تلقائي للاشتراك.",
      },
      {
        id: "payment",
        heading: "2. معالجة الدفع",
        body:
          "تتم معالجة المدفوعات عبر Stripe أو مزودين مشابهين. تنطبق شروط وإجراءات الأمان الخاصة بهم أيضًا.",
      },
      {
        id: "withdrawal",
        heading: "3. حق التراجع",
        body:
          "قد يكون لدى المستهلكين في الاتحاد الأوروبي حق قانوني في التراجع عن الخدمات الرقمية. يتم إعلامك بهذا الحق أثناء عملية الدفع عند الاقتضاء.",
      },
      {
        id: "refunds",
        heading: "4. الاسترجاعات عمليًا",
        body:
          "عادةً لا نقدم استرجاعات بعد تفعيل الوصول وإمكانية استخدام الرموز، إلا إذا كان هناك التزام قانوني أو وعد صريح باسترجاع.",
      },
    ],
    disclaimer:
      "هذا الملخص لا يحد من الحقوق القانونية الإجبارية.",
  },

  legal: {
    slug: "legal",
    title: "المعلومات القانونية",
    intro:
      "تجمع هذه الصفحة أهم المعلومات القانونية المتعلقة بـ m-pathy.",
    last_updated: "آخر تحديث: 18 نوفمبر 2025",
    sections: [
      {
        id: "overview",
        heading: "1. نظرة عامة",
        body:
          "يتم تشغيل m-pathy بواسطة NAAL UG (ذات مسؤولية محدودة)، ومقرها ميونيخ، ألمانيا. تجمع الخدمة بين نماذج ذكاء اصطناعي متقدمة وتركيز قوي على الخصوصية والوضوح وسيطرة المستخدم.",
      },
      {
        id: "jurisdiction",
        heading: "2. القانون والاختصاص",
        body:
          "ما لم تنص قوانين حماية المستهلك الإلزامية على خلاف ذلك، يُطبق القانون الألماني. إذا كنت تمارس نشاطًا كتاجر بموجب القانون الألماني، فإن الاختصاص القضائي الحصري هو ميونيخ.",
      },
      {
        id: "online_dispute",
        heading: "3. حل النزاعات عبر الإنترنت",
        body:
          "تقدم المفوضية الأوروبية منصة لحل النزاعات عبر الإنترنت. نحن غير ملزمين ولا نشارك عادةً في هذه الإجراءات.",
      },
    ],
    disclaimer:
      "تهدف هذه الصفحة إلى تقديم نظرة عامة واضحة، وفي حال وجود تعارض، قد تكون النسخة الألمانية هي المرجحة وفق القانون.",
  },
},
hi: {
  imprint: {
    slug: "imprint",
    title: "कानूनी सूचना",
    intro:
      "यह कानूनी सूचना m-pathy के लिए जर्मन और आंशिक रूप से यूरोपीय कानून के तहत आवश्यक प्रदाता जानकारी प्रदान करती है।",
    last_updated: "अंतिम अपडेट: 18 नवंबर 2025",
    sections: [
      {
        id: "provider",
        heading: "1. प्रदाता",
        body:
          "NAAL UG (सीमित देयता)\n" +
          "Maria-Theresia-Str. 11\n" +
          "81675 Munich\n" +
          "जर्मनी\n\n" +
          "ई-मेल: support@m-pathy.ai",
      },
      {
        id: "representative",
        heading: "2. अधिकृत प्रतिनिधि",
        body: "प्रबंध निदेशक: Alexander Khayat.",
      },
      {
        id: "register",
        heading: "3. वाणिज्यिक रजिस्टर",
        body:
          "कंपनी वाणिज्यिक रजिस्टर में पंजीकृत है। न्यायालय और पंजीकरण संख्या उपलब्ध होने पर जोड़ी जाएगी।",
      },
      {
        id: "vat",
        heading: "4. VAT संख्या",
        body: "यदि VAT पहचान संख्या प्रदान की जाती है, तो यहाँ जोड़ी जाएगी।",
      },
      {
        id: "contact",
        heading: "5. संपर्क",
        body:
          "m-pathy के बारे में हमसे संपर्क करने का सबसे तेज़ तरीका support@m-pathy.ai पर ई-मेल है। कृपया अत्यंत संवेदनशील स्वास्थ्य या भुगतान डेटा ई-मेल से न भेजें।",
      },
    ],
    disclaimer:
      "यह कानूनी सूचना केवल पारदर्शिता प्रदान करती है और व्यक्तिगत कानूनी सलाह का विकल्प नहीं है।",
  },

  privacy: {
    slug: "privacy",
    title: "गोपनीयता नीति",
    intro:
      "यह गोपनीयता नीति सरल रूप में बताती है कि m-pathy का उपयोग करते समय हम व्यक्तिगत डेटा को कैसे संसाधित करते हैं।",
    last_updated: "अंतिम अपडेट: 18 नवंबर 2025",
    sections: [
      {
        id: "controller",
        heading: "1. डेटा नियंत्रक",
        body:
          "m-pathy से संबंधित डेटा प्रसंस्करण के लिए जिम्मेदार इकाई:\n\n" +
          "NAAL UG (सीमित देयता)\n" +
          "Maria-Theresia-Str. 11\n" +
          "81675 Munich, Germany\n" +
          "ई-मेल: support@m-pathy.ai",
      },
      {
        id: "data_categories",
        heading: "2. डेटा श्रेणियाँ",
        body:
          "हम आवश्यकतानुसार विशेष रूप से निम्नलिखित डेटा श्रेणियों को संसाधित करते हैं:\n" +
          "• वेबसाइट उपयोग और लॉग डेटा\n" +
          "• आपके द्वारा प्रदान किया गया खाता और संपर्क डेटा\n" +
          "• आपके प्रॉम्प्ट और प्रतिक्रियाएँ\n" +
          "• तकनीकी मेटाडेटा (समय, ब्राउज़र प्रकार, डिवाइस जानकारी)",
      },
      {
        id: "purposes",
        heading: "3. उद्देश्य और कानूनी आधार",
        body:
          "हम आपके डेटा का उपयोग विशेष रूप से:\n" +
          "• m-pathy प्रदान और संचालित करने के लिए,\n" +
          "• सेवा की सुरक्षा और तकनीकी रखरखाव के लिए,\n" +
          "• सहायता अनुरोधों के उत्तर देने के लिए,\n" +
          "• कानूनी भंडारण दायित्वों को पूरा करने के लिए करते हैं।\n\n" +
          "GDPR लागू होने पर कानूनी आधार Art.6(1)(b), (c), (f) हैं।",
      },
      {
        id: "processors",
        heading: "4. प्रोसेसर और प्राप्तकर्ता",
        body:
          "हम होस्टिंग, इंफ्रास्ट्रक्चर, गैर-प्रोफाइलिंग विश्लेषण और भुगतान प्रसंस्करण (जैसे Stripe) के लिए सावधानीपूर्वक चयनित प्रदाताओं का उपयोग करते हैं। ये केवल हमारे निर्देशों और कानून के अनुसार डेटा संसाधित करते हैं।",
      },
      {
        id: "retention",
        heading: "5. भंडारण अवधि",
        body:
          "व्यक्तिगत डेटा केवल आवश्यक समय या कानून के अनुरूप अवधि तक ही रखा जाता है। लॉग डेटा सामान्यतः केवल थोड़े समय के लिए रखा जाता है। अनुबंध-संबंधित डेटा अधिक समय तक रखा जा सकता है।",
      },
      {
        id: "rights",
        heading: "6. आपके अधिकार",
        body:
          "GDPR लागू होने पर आपके पास एक्सेस, सुधार, हटाने, प्रसंस्करण प्रतिबंध, डेटा पोर्टेबिलिटी और आपत्ति का अधिकार है। आप डेटा संरक्षण प्राधिकरण में शिकायत भी दर्ज कर सकते हैं।",
      },
      {
        id: "ai",
        heading: "7. AI सेवाओं का उपयोग",
        body:
          "m-pathy आपके प्रॉम्प्ट को संसाधित करने के लिए AI मॉडल का उपयोग करता है। हम डेटा सुरक्षा के उपाय अपनाते हैं लेकिन कोई भी सिस्टम पूर्ण सुरक्षा की गारंटी नहीं दे सकता। अत्यंत संवेदनशील जानकारी दर्ज करने से बचें।",
      },
    ],
    disclaimer:
      "यह नीति एक सरल सारांश है और पूर्ण कानूनी समीक्षा का विकल्प नहीं है।",
  },

  terms: {
    slug: "terms",
    title: "उपयोग की शर्तें",
    intro:
      "ये शर्तें बताती हैं कि आप m-pathy का उपयोग कैसे कर सकते हैं। सेवा का उपयोग करने से आप इनसे सहमत माने जाते हैं।",
    last_updated: "अंतिम अपडेट: 18 नवंबर 2025",
    sections: [
      {
        id: "scope",
        heading: "1. सेवा का दायरा",
        body:
          "m-pathy एक AI-आधारित प्रयोगात्मक सहायक है। यह चिकित्सक, वकील, डॉक्टर या वित्तीय सलाहकार नहीं है। इसका उद्देश्य रचनात्मक कार्य, आत्म-चिंतन और तकनीकी सहायता है।",
      },
      {
        id: "no_advice",
        heading: "2. पेशेवर सलाह नहीं",
        body:
          "m-pathy द्वारा जनरेट सामग्री का उपयोग कभी भी चिकित्सा, कानूनी या वित्तीय निर्णयों के लिए एकमात्र आधार के रूप में नहीं किया जाना चाहिए।",
      },
      {
        id: "account",
        heading: "3. खाता और टोकन",
        body:
          "पहुँच समय या टोकन पूल द्वारा सीमित हो सकती है। अपने लॉगिन विवरण और खाते की सभी गतिविधियों के लिए आप जिम्मेदार हैं।",
      },
      {
        id: "acceptable_use",
        heading: "4. स्वीकार्य उपयोग",
        body:
          "आप m-pathy का उपयोग कानून का उल्लंघन करने, दूसरों को नुकसान पहुँचाने, अवैध सामग्री उत्पन्न करने या सिस्टम पर हमला करने के लिए नहीं कर सकते।",
      },
      {
        id: "changes",
        heading: "5. बदलाव और उपलब्धता",
        body:
          "हम उपयोगकर्ता के लिए उचित सीमा के भीतर कभी भी m-pathy की सुविधाएँ बदल सकते हैं। उच्च उपलब्धता का प्रयास किया जाता है, लेकिन निरंतर संचालन की गारंटी नहीं है।",
      },
      {
        id: "liability",
        heading: "6. दायित्व की सीमा",
        body:
          "हम जानबूझकर और गंभीर लापरवाही के लिए कानून के अनुसार जिम्मेदार हैं। हल्की लापरवाही के मामलों में, हम केवल महत्वपूर्ण अनुबंधात्मक दायित्वों के उल्लंघन और सामान्य अनुमानित क्षति तक सीमित हैं। अनिवार्य दायित्व अप्रभावित रहते हैं।",
      },
    ],
    disclaimer:
      "यह सारांश अनुबंध संबंध को सरल रूप में प्रस्तुत करता है और कानूनी सलाह का विकल्प नहीं है।",
  },

  refund: {
    slug: "refund",
    title: "रिफंड नीति",
    intro:
      "m-pathy वर्तमान में एक स्पष्ट, एक-बार की खरीद मॉडल प्रदान करता है। यह नीति बताती है कि भुगतान और रिफंड कैसे संभाले जाते हैं।",
    last_updated: "अंतिम अपडेट: 18 नवंबर 2025",
    sections: [
      {
        id: "model",
        heading: "1. खरीद मॉडल",
        body:
          "m-pathy तक पहुँच एक निर्धारित अवधि और/या टोकन पूल के लिए एक बार की खरीद के रूप में दी जाती है। कोई स्वचालित सदस्यता नवीनीकरण नहीं है।",
      },
      {
        id: "payment",
        heading: "2. भुगतान प्रसंस्करण",
        body:
          "भुगतान Stripe या समान प्रदाताओं के माध्यम से संसाधित किए जाते हैं। उनके नियम और सुरक्षा उपाय भी लागू होते हैं।",
      },
      {
        id: "withdrawal",
        heading: "3. वापसी का अधिकार",
        body:
          "EU उपभोक्ताओं के लिए कुछ परिस्थितियों में डिजिटल सेवाओं के लिए वैधानिक वापसी अधिकार हो सकता है।",
      },
      {
        id: "refunds",
        heading: "4. वास्तविक रिफंड",
        body:
          "एक्सेस सक्रिय होने और टोकन उपलब्ध होने के बाद, रिफंड सामान्यतः प्रदान नहीं किए जाते—जब तक कि कोई कानूनी दायित्व या स्पष्ट वादा न हो।",
      },
    ],
    disclaimer:
      "यह सारांश कानूनी अनिवार्य अधिकारों को सीमित नहीं करता।",
  },

  legal: {
    slug: "legal",
    title: "कानूनी जानकारी",
    intro:
      "यह पेज m-pathy के बारे में प्रमुख कानूनी जानकारी को एकत्रित करता है।",
    last_updated: "अंतिम अपडेट: 18 नवंबर 2025",
    sections: [
      {
        id: "overview",
        heading: "1. अवलोकन",
        body:
          "m-pathy का संचालन NAAL UG द्वारा किया जाता है, जिसका मुख्यालय म्यूनिख, जर्मनी में है। सेवा में उन्नत AI मॉडल का उपयोग किया जाता है और यह गोपनीयता, स्पष्टता और उपयोगकर्ता नियंत्रण पर जोर देती है।",
      },
      {
        id: "jurisdiction",
        heading: "2. लागू कानून और क्षेत्राधिकार",
        body:
          "जब तक उपभोक्ता सुरक्षा के अनिवार्य कानून अन्यथा न कहें, जर्मन कानून लागू होता है। यदि आप जर्मन कानून के तहत व्यापारी के रूप में कार्य करते हैं, तो विशिष्ट क्षेत्राधिकार म्यूनिख है।",
      },
      {
        id: "online_dispute",
        heading: "3. ऑनलाइन विवाद समाधान",
        body:
          "यूरोपीय आयोग ऑनलाइन विवाद समाधान प्लेटफ़ॉर्म प्रदान करता है। हम सामान्यतः इन प्रक्रियाओं में भाग नहीं लेते।",
      },
    ],
    disclaimer:
      "यह पृष्ठ एक पारदर्शी अवलोकन प्रदान करता है। कानून द्वारा आवश्यक होने पर जर्मन संस्करण को प्राथमिकता दी जा सकती है।",
  },
},


};
