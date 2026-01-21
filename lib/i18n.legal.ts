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
      last_updated: "Last updated: 11 January 2026",
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
            "NAAL UG (limited liability) is entered in the commercial register of the Amtsgericht München under HRB 288710.",
        },
        {
          id: "vat",
          heading: "4. VAT ID",
          body: "xe",
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
      last_updated: "Last updated: 11 January 2026",
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
          id: "principles",
          heading: "2. Privacy by design",
          body:
            "m-pathy follows privacy by design and by default.\n\n" +
            "• Data is processed only when necessary\n" +
            "• Processing scope and duration are minimised\n" +
            "• No implicit user profiles are created\n\n" +
            "Privacy is enforced architecturally, not situationally.",
        },
        {
          id: "data_categories",
          heading: "3. Categories of data",
          body:
            "Depending on usage, the following categories of data may be involved:\n" +
            "• account and contact data (if actively provided),\n" +
            "• technical usage data (security and stability only),\n" +
            "• payment data (processed by external providers),\n" +
            "• user prompts and responses (technical processing only).\n\n" +
            "Prompt content is not used for profiling, advertising, behavioural analysis, or training.",
        },
        {
          id: "local_processing",
          heading: "4. Local processing and storage",
          body:
            "Prompt content is processed locally or transiently and is not permanently stored on " +
            "servers in identifiable or reconstructable form.",
        },
        {
          id: "archive",
          heading: "5. Local archive and context injection",
          body:
            "m-pathy allows users to store selected content locally in an archive.\n\n" +
            "Users may explicitly select archived items and inject them into a new chat.\n\n" +
            "• operates exclusively on local storage,\n" +
            "• requires deliberate user action,\n" +
            "• injected context is fully visible,\n" +
            "• no automatic or implicit memory exists.",
        },
        {
          id: "verification",
          heading: "6. Verification and Triketon",
          body:
            "When users verify content (e.g. news articles), m-pathy uses Triketon.\n\n" +
            "• content is transmitted to the server solely for verification,\n" +
            "• a cryptographic truth hash is computed,\n" +
            "• a public verification key is generated or associated,\n" +
            "• the original content is not stored,\n" +
            "• only hash, public key, and minimal technical metadata are retained.\n\n" +
            "Stored data does not allow reconstruction of the original content.",
        },
        {
          id: "prompt_integrity",
          heading: "7. Prompt normalisation and drift prevention",
          body:
            "Before execution, MAIOS 2.0 analyses prompts.\n\n" +
            "If a prompt is structurally ambiguous, inconsistent, or drift-prone, " +
            "the system may restructure the phrasing.\n\n" +
            "• user intent is preserved,\n" +
            "• only structure and safety clarity are adjusted,\n" +
            "• no prompt is stored,\n" +
            "• no learning or profiling occurs.",
        },
        {
          id: "devices",
          heading: "8. Local storage and devices",
          body:
            "All user-generated content is stored exclusively in local storage on the user’s device.\n\n" +
            "• local storage is persistent until deleted by the user,\n" +
            "• deleting local storage results in irreversible data loss,\n" +
            "• no server-side backups exist.\n\n" +
            "Each device receives a distinct public key. Data is isolated per device.",
        },
      ],
      disclaimer:
        "This Privacy Policy is provided for transparency and does not replace individual legal advice.",
    },

    // --------------------------- TERMS ---------------------------
    terms: {
      slug: "terms",
      title: "Terms of Use",
      intro:
        "These Terms govern how you may use m-pathy. By using the service, you agree to them.",
      last_updated: "Last updated: 11 January 2026",
      sections: [
        {
          id: "scope",
          heading: "1. Scope of the service",
          body:
            "m-pathy is an experimental AI-based assistant. It is not a human therapist, lawyer, doctor or financial advisor.",
        },
        {
          id: "no_advice",
          heading: "2. No professional advice",
          body:
            "Content generated by m-pathy must never be used as the sole basis for medical, legal, financial or other decisions.",
        },
        {
          id: "modes",
          heading: "3. Mode-based system governance",
          body:
            "m-pathy operates with a defined set of internal system modes.\n\n" +
            "Mode switching is session-bound, deterministic and does not constitute user profiling.",
        },
        {
          id: "liability",
          heading: "4. Limitation of liability",
          body:
            "Liability is governed by applicable law. Mandatory liability remains unaffected.",
        },
      ],
      disclaimer:
        "These Terms structure the contractual relationship and do not replace legal advice.",
    },

    // -------------------------- REFUND ---------------------------
    refund: {
      slug: "refund",
      title: "Refund Policy",
      intro:
        "This Refund Policy explains how payments and refunds are handled.",
      last_updated: "Last updated: 11 January 2026",
      sections: [
        {
          id: "model",
          heading: "1. Purchase model",
          body:
            "Access is granted as a one-time purchase for a defined period and/or token pool.",
        },
        {
          id: "withdrawal",
          heading: "2. Right of withdrawal",
          body:
            "Statutory rights of withdrawal for digital services apply where required by law.",
        },
        {
          id: "refunds",
          heading: "3. Refunds",
          body:
            "Refunds are granted only where legally required or explicitly promised.",
        },
      ],
      disclaimer:
        "This policy does not limit mandatory statutory rights.",
    },

    // --------------------------- LEGAL ---------------------------
    legal: {
      slug: "legal",
      title: "Legal Information",
      intro:
        "This page provides an overview of the legal framework governing m-pathy.",
      last_updated: "Last updated: 11 January 2026",
      sections: [
        {
          id: "jurisdiction",
          heading: "1. Applicable law and jurisdiction",
          body:
            "Unless mandatory consumer protection law provides otherwise, German law applies. " +
            "For merchants, the exclusive place of jurisdiction is Munich.",
        },
      ],
      disclaimer:
        "This page is provided for transparency. In case of conflict, mandatory law prevails.",
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
        "Dieses Impressum enthält die gesetzlich vorgeschriebenen Anbieterinformationen für m-pathy nach deutschem und teilweise europäischem Recht.",
      last_updated: "Zuletzt aktualisiert: 11. Januar 2026",
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
          heading: "2. Geschäftsführung",
          body: "Geschäftsführer: Alexander Khayat.",
        },
        {
          id: "register",
          heading: "3. Handelsregistereintrag",
          body:
            "NAAL UG (haftungsbeschränkt) ist im Handelsregister des Amtsgerichts München unter HRB 288710 eingetragen.",
        },
        {
          id: "vat",
          heading: "4. Umsatzsteuer-ID",
          body: "xe",
        },
        {
          id: "contact",
          heading: "5. Kontakt",
          body:
            "Der schnellste Weg, m-pathy zu kontaktieren, ist derzeit per E-Mail an support@m-pathy.ai. " +
            "Bitte senden Sie keine sensiblen Gesundheits- oder Zahlungsdaten per E-Mail.",
        },
      ],
      disclaimer:
        "Dieses Impressum dient der Transparenz und ersetzt keine individuelle Rechtsberatung.",
    },

    // ------------------------- DATENSCHUTZ ------------------------
    privacy: {
      slug: "privacy",
      title: "Datenschutzerklärung",
      intro:
        "Diese Datenschutzerklärung erläutert in verständlicher Form, wie wir personenbezogene Daten bei der Nutzung von m-pathy verarbeiten.",
      last_updated: "Zuletzt aktualisiert: 11. Januar 2026",
      sections: [
        {
          id: "controller",
          heading: "1. Verantwortlicher",
          body:
            "Verantwortlich für die Datenverarbeitung im Zusammenhang mit m-pathy ist:\n\n" +
            "NAAL UG (haftungsbeschränkt)\n" +
            "Maria-Theresia-Str. 11\n" +
            "81675 München\n" +
            "Deutschland\n" +
            "E-Mail: support@m-pathy.ai",
        },
        {
          id: "principles",
          heading: "2. Datenschutz durch Technikgestaltung",
          body:
            "m-pathy folgt dem Prinzip Privacy by Design und Privacy by Default.\n\n" +
            "• Daten werden nur verarbeitet, wenn dies erforderlich ist\n" +
            "• Umfang und Dauer der Verarbeitung werden minimiert\n" +
            "• Es werden keine impliziten Nutzerprofile erstellt\n\n" +
            "Datenschutz ist architektonisch verankert und nicht situationsabhängig.",
        },
        {
          id: "data_categories",
          heading: "3. Datenkategorien",
          body:
            "Je nach Nutzung können folgende Datenkategorien verarbeitet werden:\n" +
            "• Account- und Kontaktdaten (sofern aktiv angegeben),\n" +
            "• technische Nutzungsdaten (Sicherheit und Stabilität),\n" +
            "• Zahlungsdaten (über externe Zahlungsdienstleister),\n" +
            "• Inhalte von Prompts und Antworten (rein technisch verarbeitet).\n\n" +
            "Prompt-Inhalte werden nicht zu Profiling-, Werbe- oder Trainingszwecken verwendet.",
        },
        {
          id: "local_processing",
          heading: "4. Lokale Verarbeitung",
          body:
            "Prompt-Inhalte werden lokal oder nur kurzfristig verarbeitet und nicht dauerhaft " +
            "in identifizierbarer oder rekonstruierbarer Form auf Servern gespeichert.",
        },
        {
          id: "archive",
          heading: "5. Lokales Archiv und Kontextübernahme",
          body:
            "m-pathy ermöglicht es Nutzern, ausgewählte Inhalte lokal in einem Archiv zu speichern.\n\n" +
            "Archivierte Inhalte können bewusst ausgewählt und in einen neuen Chat eingebracht werden.\n\n" +
            "• ausschließlich lokale Speicherung,\n" +
            "• erfordert aktive Nutzerentscheidung,\n" +
            "• übernommener Kontext ist vollständig sichtbar,\n" +
            "• keine automatische oder implizite Erinnerung.",
        },
        {
          id: "verification",
          heading: "6. Verifikation und Triketon",
          body:
            "Bei der Verifikation von Inhalten (z. B. Nachrichtenartikeln) nutzt m-pathy Triketon.\n\n" +
            "• Inhalte werden ausschließlich zur Verifikation an den Server übertragen,\n" +
            "• ein kryptografischer Truth-Hash wird berechnet,\n" +
            "• ein öffentlicher Verifikationsschlüssel wird erzeugt oder zugeordnet,\n" +
            "• der ursprüngliche Inhalt wird nicht gespeichert,\n" +
            "• gespeichert werden nur Hash, Public Key und minimale technische Metadaten.\n\n" +
            "Eine Rekonstruktion der Originalinhalte ist nicht möglich.",
        },
        {
          id: "prompt_integrity",
          heading: "7. Prompt-Normalisierung und Drift-Prävention",
          body:
            "Vor der Ausführung analysiert MAIOS 2.0 Prompts strukturell.\n\n" +
            "Sind Prompts mehrdeutig, inkonsistent oder driftanfällig, kann die Formulierung angepasst werden.\n\n" +
            "• Die Nutzerintention bleibt erhalten,\n" +
            "• angepasst werden nur Struktur und Sicherheitsklarheit,\n" +
            "• Prompts werden nicht gespeichert,\n" +
            "• es findet kein Lernen oder Profiling statt.",
        },
        {
          id: "devices",
          heading: "8. Lokaler Speicher und Geräte",
          body:
            "Alle nutzergenerierten Inhalte werden ausschließlich im lokalen Speicher des jeweiligen Geräts abgelegt.\n\n" +
            "• Lokaler Speicher bleibt bestehen, bis er vom Nutzer gelöscht wird,\n" +
            "• eine Löschung führt zu unwiederbringlichem Datenverlust,\n" +
            "• es existieren keine serverseitigen Backups.\n\n" +
            "Jedes Gerät erhält einen eigenen Public Key. Daten sind strikt gerätegebunden.",
        },
      ],
      disclaimer:
        "Diese Datenschutzerklärung dient der Transparenz und ersetzt keine individuelle Rechtsberatung.",
    },

    // --------------------------- NUTZUNGSBEDINGUNGEN ----------------
    terms: {
      slug: "terms",
      title: "Nutzungsbedingungen",
      intro:
        "Diese Nutzungsbedingungen regeln die Verwendung von m-pathy. Mit der Nutzung stimmen Sie ihnen zu.",
      last_updated: "Zuletzt aktualisiert: 11. Januar 2026",
      sections: [
        {
          id: "scope",
          heading: "1. Leistungsumfang",
          body:
            "m-pathy ist ein experimenteller KI-gestützter Assistent und kein menschlicher Therapeut, Anwalt, Arzt oder Finanzberater.",
        },
        {
          id: "no_advice",
          heading: "2. Keine professionelle Beratung",
          body:
            "Von m-pathy erzeugte Inhalte dürfen nicht als alleinige Entscheidungsgrundlage für medizinische, rechtliche, finanzielle oder andere folgenschwere Entscheidungen genutzt werden.",
        },
        {
          id: "modes",
          heading: "3. Modusbasierte Systemsteuerung",
          body:
            "m-pathy nutzt interne Systemmodi zur Selbststeuerung.\n\n" +
            "Moduswechsel sind sitzungsgebunden, deterministisch und stellen kein Nutzerprofiling dar.",
        },
        {
          id: "liability",
          heading: "4. Haftungsbeschränkung",
          body:
            "Die Haftung richtet sich nach den gesetzlichen Bestimmungen. Zwingende Haftungstatbestände bleiben unberührt.",
        },
      ],
      disclaimer:
        "Diese Nutzungsbedingungen strukturieren das Vertragsverhältnis und ersetzen keine Rechtsberatung.",
    },

    // -------------------------- RÜCKERSTATTUNG ---------------------
    refund: {
      slug: "refund",
      title: "Rückerstattungsrichtlinie",
      intro:
        "Diese Richtlinie erläutert, wie Zahlungen und Rückerstattungen bei m-pathy gehandhabt werden.",
      last_updated: "Zuletzt aktualisiert: 11. Januar 2026",
      sections: [
        {
          id: "model",
          heading: "1. Kaufmodell",
          body:
            "Der Zugang erfolgt als einmaliger Kauf für einen definierten Zeitraum und/oder ein definiertes Token-Kontingent.",
        },
        {
          id: "withdrawal",
          heading: "2. Widerrufsrecht",
          body:
            "Gesetzliche Widerrufsrechte für digitale Dienstleistungen gelten, sofern gesetzlich vorgeschrieben.",
        },
        {
          id: "refunds",
          heading: "3. Rückerstattungen",
          body:
            "Rückerstattungen erfolgen nur, wenn eine gesetzliche Verpflichtung besteht oder ausdrücklich zugesagt wurde.",
        },
      ],
      disclaimer:
        "Diese Richtlinie schränkt zwingende gesetzliche Rechte nicht ein.",
    },

    // --------------------------- RECHTLICHES -----------------------
    legal: {
      slug: "legal",
      title: "Rechtliche Hinweise",
      intro:
        "Diese Seite gibt einen Überblick über den rechtlichen Rahmen von m-pathy.",
      last_updated: "Zuletzt aktualisiert: 11. Januar 2026",
      sections: [
        {
          id: "jurisdiction",
          heading: "1. Anwendbares Recht und Gerichtsstand",
          body:
            "Sofern zwingende Verbraucherschutzvorschriften nichts anderes vorsehen, gilt deutsches Recht. " +
            "Für Kaufleute ist München ausschließlicher Gerichtsstand.",
        },
      ],
      disclaimer:
        "Diese Angaben dienen der Transparenz. Zwingendes Recht hat Vorrang.",
    },

  },

   // ================================================================
  // FRANÇAIS
  // ================================================================
  fr: {
    // ------------------------- MENTIONS LÉGALES -------------------
    imprint: {
      slug: "imprint",
      title: "Mentions légales",
      intro:
        "Ces mentions légales contiennent les informations relatives au fournisseur de m-pathy, conformément au droit allemand et, le cas échéant, au droit européen.",
      last_updated: "Dernière mise à jour : 11 janvier 2026",
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
          heading: "2. Direction",
          body: "Gérant : Alexander Khayat.",
        },
        {
          id: "register",
          heading: "3. Inscription au registre du commerce",
          body:
            "NAAL UG (responsabilité limitée) est inscrite au registre du commerce du tribunal d’instance de Munich sous le numéro HRB 288710.",
        },
        {
          id: "vat",
          heading: "4. Numéro de TVA",
          body: "xe",
        },
        {
          id: "contact",
          heading: "5. Contact",
          body:
            "Le moyen le plus rapide de contacter m-pathy est actuellement par e-mail à support@m-pathy.ai. " +
            "Veuillez ne pas transmettre de données sensibles, notamment de santé ou de paiement, par e-mail.",
        },
      ],
      disclaimer:
        "Ces mentions légales sont fournies à titre d’information et ne remplacent pas un conseil juridique individuel.",
    },

    // ------------------------- CONFIDENTIALITÉ --------------------
    privacy: {
      slug: "privacy",
      title: "Politique de confidentialité",
      intro:
        "Cette politique de confidentialité explique de manière claire comment les données personnelles sont traitées lors de l’utilisation de m-pathy.",
      last_updated: "Dernière mise à jour : 11 janvier 2026",
      sections: [
        {
          id: "controller",
          heading: "1. Responsable du traitement",
          body:
            "Le responsable du traitement des données en lien avec m-pathy est :\n\n" +
            "NAAL UG (responsabilité limitée)\n" +
            "Maria-Theresia-Str. 11\n" +
            "81675 Munich\n" +
            "Allemagne\n" +
            "E-mail : support@m-pathy.ai",
        },
        {
          id: "principles",
          heading: "2. Protection des données dès la conception",
          body:
            "m-pathy applique les principes de Privacy by Design et Privacy by Default.\n\n" +
            "• Les données sont traitées uniquement lorsque cela est nécessaire\n" +
            "• L’étendue et la durée du traitement sont minimisées\n" +
            "• Aucun profil utilisateur implicite n’est créé\n\n" +
            "La protection des données est intégrée à l’architecture du système.",
        },
        {
          id: "data_categories",
          heading: "3. Catégories de données",
          body:
            "Selon l’utilisation, les catégories de données suivantes peuvent être concernées :\n" +
            "• données de compte et de contact (si fournies volontairement),\n" +
            "• données techniques d’utilisation (sécurité et stabilité),\n" +
            "• données de paiement (via des prestataires externes),\n" +
            "• contenus des prompts et réponses (traitement purement technique).\n\n" +
            "Les contenus des prompts ne sont pas utilisés à des fins de profilage, de publicité ou d’entraînement.",
        },
        {
          id: "local_processing",
          heading: "4. Traitement local",
          body:
            "Les contenus des prompts sont traités localement ou de manière transitoire et ne sont pas stockés " +
            "de façon permanente sur des serveurs sous une forme identifiable ou reconstructible.",
        },
        {
          id: "archive",
          heading: "5. Archivage local et injection de contexte",
          body:
            "m-pathy permet aux utilisateurs de conserver certains contenus localement dans une archive.\n\n" +
            "Les éléments archivés peuvent être sélectionnés volontairement et réinjectés dans une nouvelle conversation.\n\n" +
            "• stockage exclusivement local,\n" +
            "• action volontaire de l’utilisateur,\n" +
            "• contexte injecté entièrement visible,\n" +
            "• aucune mémoire automatique ou implicite.",
        },
        {
          id: "verification",
          heading: "6. Vérification et Triketon",
          body:
            "Lors de la vérification de contenus (par exemple des articles de presse), m-pathy utilise Triketon.\n\n" +
            "• les contenus sont transmis au serveur uniquement à des fins de vérification,\n" +
            "• un hash cryptographique de vérité est calculé,\n" +
            "• une clé publique de vérification est générée ou associée,\n" +
            "• le contenu original n’est pas stocké,\n" +
            "• seuls le hash, la clé publique et des métadonnées techniques minimales sont conservés.\n\n" +
            "Aucune reconstitution du contenu original n’est possible.",
        },
        {
          id: "prompt_integrity",
          heading: "7. Normalisation des prompts et prévention du drift",
          body:
            "Avant l’exécution, MAIOS 2.0 analyse la structure des prompts.\n\n" +
            "Si un prompt est ambigu, incohérent ou sujet au drift, sa formulation peut être ajustée.\n\n" +
            "• l’intention de l’utilisateur est préservée,\n" +
            "• seules la structure et la clarté de sécurité sont adaptées,\n" +
            "• aucun prompt n’est stocké,\n" +
            "• aucun apprentissage ni profilage n’a lieu.",
        },
        {
          id: "devices",
          heading: "8. Stockage local et appareils",
          body:
            "Tous les contenus générés par l’utilisateur sont stockés exclusivement dans le stockage local de l’appareil utilisé.\n\n" +
            "• le stockage local persiste jusqu’à suppression par l’utilisateur,\n" +
            "• la suppression entraîne une perte définitive des données,\n" +
            "• aucune sauvegarde côté serveur n’existe.\n\n" +
            "Chaque appareil reçoit une clé publique distincte. Les données sont strictement liées à l’appareil.",
        },
      ],
      disclaimer:
        "Cette politique de confidentialité est fournie à titre informatif et ne remplace pas un avis juridique individuel.",
    },

    // ------------------------- CONDITIONS -------------------------
    terms: {
      slug: "terms",
      title: "Conditions d’utilisation",
      intro:
        "Ces conditions d’utilisation régissent l’accès et l’utilisation de m-pathy. En utilisant le service, vous les acceptez.",
      last_updated: "Dernière mise à jour : 11 janvier 2026",
      sections: [
        {
          id: "scope",
          heading: "1. Champ d’application",
          body:
            "m-pathy est un assistant expérimental basé sur l’IA et ne remplace pas un thérapeute, un avocat, un médecin ou un conseiller financier humain.",
        },
        {
          id: "no_advice",
          heading: "2. Absence de conseil professionnel",
          body:
            "Les contenus générés par m-pathy ne doivent pas être utilisés comme seule base pour des décisions médicales, juridiques, financières ou autres ayant des conséquences importantes.",
        },
        {
          id: "modes",
          heading: "3. Gouvernance par modes système",
          body:
            "m-pathy utilise des modes internes pour l’auto-gouvernance du système.\n\n" +
            "Les changements de mode sont limités à la session, déterministes et ne constituent pas un profilage de l’utilisateur.",
        },
        {
          id: "liability",
          heading: "4. Limitation de responsabilité",
          body:
            "La responsabilité est régie par les dispositions légales applicables. Les régimes de responsabilité obligatoires demeurent inchangés.",
        },
      ],
      disclaimer:
        "Ces conditions visent à structurer la relation contractuelle et ne remplacent pas un conseil juridique.",
    },

    // ------------------------- REMBOURSEMENT ----------------------
    refund: {
      slug: "refund",
      title: "Politique de remboursement",
      intro:
        "Cette politique décrit la manière dont les paiements et les remboursements sont traités pour m-pathy.",
      last_updated: "Dernière mise à jour : 11 janvier 2026",
      sections: [
        {
          id: "model",
          heading: "1. Modèle d’achat",
          body:
            "L’accès à m-pathy est accordé via un achat unique pour une durée déterminée et/ou un contingent de tokens défini.",
        },
        {
          id: "withdrawal",
          heading: "2. Droit de rétractation",
          body:
            "Les droits légaux de rétractation applicables aux services numériques s’appliquent lorsque la loi l’exige.",
        },
        {
          id: "refunds",
          heading: "3. Remboursements",
          body:
            "Les remboursements ne sont accordés que lorsqu’une obligation légale existe ou lorsqu’ils ont été expressément promis.",
        },
      ],
      disclaimer:
        "Cette politique n’affecte pas les droits légaux impératifs.",
    },

    // ------------------------- JURIDIQUE --------------------------
    legal: {
      slug: "legal",
      title: "Informations juridiques",
      intro:
        "Cette section fournit une vue d’ensemble du cadre juridique applicable à m-pathy.",
      last_updated: "Dernière mise à jour : 11 janvier 2026",
      sections: [
        {
          id: "jurisdiction",
          heading: "1. Droit applicable et juridiction compétente",
          body:
            "Sauf dispositions impératives contraires en matière de protection des consommateurs, le droit allemand s’applique. " +
            "Pour les professionnels, le tribunal compétent est celui de Munich.",
        },
      ],
      disclaimer:
        "Ces informations sont fournies à titre de transparence. Le droit impératif prévaut.",
    },

  },
  // ================================================================
  // ESPAÑOL
  // ================================================================
  es: {
    // ------------------------- AVISO LEGAL ------------------------
    imprint: {
      slug: "imprint",
      title: "Aviso legal",
      intro:
        "Este aviso legal contiene la información del proveedor requerida para m-pathy conforme al derecho alemán y, en su caso, al derecho europeo.",
      last_updated: "Última actualización: 11 de enero de 2026",
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
          heading: "2. Dirección",
          body: "Director gerente: Alexander Khayat.",
        },
        {
          id: "register",
          heading: "3. Inscripción en el registro mercantil",
          body:
            "NAAL UG (responsabilidad limitada) está inscrita en el registro mercantil del Juzgado de Múnich bajo el número HRB 288710.",
        },
        {
          id: "vat",
          heading: "4. Número de IVA",
          body: "xe",
        },
        {
          id: "contact",
          heading: "5. Contacto",
          body:
            "La forma más rápida de contactar con m-pathy es actualmente por correo electrónico a support@m-pathy.ai. " +
            "Por favor, no envíe datos sensibles, en particular datos de salud o de pago, por correo electrónico.",
        },
      ],
      disclaimer:
        "Este aviso legal se proporciona a efectos informativos y no sustituye el asesoramiento jurídico individual.",
    },

    // ------------------------- PRIVACIDAD -------------------------
    privacy: {
      slug: "privacy",
      title: "Política de privacidad",
      intro:
        "Esta política de privacidad explica de forma clara cómo se tratan los datos personales al utilizar m-pathy.",
      last_updated: "Última actualización: 11 de enero de 2026",
      sections: [
        {
          id: "controller",
          heading: "1. Responsable del tratamiento",
          body:
            "El responsable del tratamiento de los datos en relación con m-pathy es:\n\n" +
            "NAAL UG (responsabilidad limitada)\n" +
            "Maria-Theresia-Str. 11\n" +
            "81675 Múnich\n" +
            "Alemania\n" +
            "Correo electrónico: support@m-pathy.ai",
        },
        {
          id: "principles",
          heading: "2. Protección de datos desde el diseño",
          body:
            "m-pathy aplica los principios de privacidad desde el diseño y por defecto.\n\n" +
            "• Los datos se tratan únicamente cuando es necesario\n" +
            "• El alcance y la duración del tratamiento se minimizan\n" +
            "• No se crean perfiles implícitos de usuarios\n\n" +
            "La protección de datos está integrada en la arquitectura del sistema.",
        },
        {
          id: "data_categories",
          heading: "3. Categorías de datos",
          body:
            "Según el uso, pueden tratarse las siguientes categorías de datos:\n" +
            "• datos de cuenta y contacto (si se facilitan voluntariamente),\n" +
            "• datos técnicos de uso (seguridad y estabilidad),\n" +
            "• datos de pago (a través de proveedores externos),\n" +
            "• contenidos de los prompts y respuestas (tratamiento puramente técnico).\n\n" +
            "Los contenidos de los prompts no se utilizan para fines de perfilado, publicidad ni entrenamiento.",
        },
        {
          id: "local_processing",
          heading: "4. Tratamiento local",
          body:
            "Los contenidos de los prompts se tratan de forma local o transitoria y no se almacenan " +
            "de manera permanente en servidores en forma identificable o reconstruible.",
        },
        {
          id: "archive",
          heading: "5. Archivo local e inyección de contexto",
          body:
            "m-pathy permite a los usuarios almacenar determinados contenidos de forma local en un archivo.\n\n" +
            "Los elementos archivados pueden seleccionarse de forma consciente e introducirse en una nueva conversación.\n\n" +
            "• almacenamiento exclusivamente local,\n" +
            "• acción deliberada del usuario,\n" +
            "• contexto introducido completamente visible,\n" +
            "• sin memoria automática ni implícita.",
        },
        {
          id: "verification",
          heading: "6. Verificación y Triketon",
          body:
            "Al verificar contenidos (por ejemplo, artículos de prensa), m-pathy utiliza Triketon.\n\n" +
            "• los contenidos se transmiten al servidor únicamente con fines de verificación,\n" +
            "• se calcula un hash criptográfico de verdad,\n" +
            "• se genera o asocia una clave pública de verificación,\n" +
            "• el contenido original no se almacena,\n" +
            "• solo se conservan el hash, la clave pública y metadatos técnicos mínimos.\n\n" +
            "No es posible reconstruir el contenido original.",
        },
        {
          id: "prompt_integrity",
          heading: "7. Normalización de prompts y prevención de deriva",
          body:
            "Antes de la ejecución, MAIOS 2.0 analiza estructuralmente los prompts.\n\n" +
            "Si un prompt es ambiguo, incoherente o propenso a la deriva, su formulación puede ajustarse.\n\n" +
            "• se conserva la intención del usuario,\n" +
            "• solo se ajustan la estructura y la claridad de seguridad,\n" +
            "• no se almacenan prompts,\n" +
            "• no tiene lugar ningún aprendizaje ni perfilado.",
        },
        {
          id: "devices",
          heading: "8. Almacenamiento local y dispositivos",
          body:
            "Todos los contenidos generados por el usuario se almacenan exclusivamente en el almacenamiento local del dispositivo utilizado.\n\n" +
            "• el almacenamiento local persiste hasta que el usuario lo elimina,\n" +
            "• la eliminación implica la pérdida irreversible de los datos,\n" +
            "• no existen copias de seguridad en el servidor.\n\n" +
            "Cada dispositivo recibe una clave pública distinta. Los datos están estrictamente vinculados al dispositivo.",
        },
      ],
      disclaimer:
        "Esta política de privacidad se proporciona a efectos informativos y no sustituye el asesoramiento jurídico individual.",
    },

    // ------------------------- CONDICIONES ------------------------
    terms: {
      slug: "terms",
      title: "Condiciones de uso",
      intro:
        "Estas condiciones de uso regulan el acceso y la utilización de m-pathy. Al utilizar el servicio, usted las acepta.",
      last_updated: "Última actualización: 11 de enero de 2026",
      sections: [
        {
          id: "scope",
          heading: "1. Ámbito del servicio",
          body:
            "m-pathy es un asistente experimental basado en IA y no sustituye a un terapeuta, abogado, médico o asesor financiero humano.",
        },
        {
          id: "no_advice",
          heading: "2. Ausencia de asesoramiento profesional",
          body:
            "Los contenidos generados por m-pathy no deben utilizarse como única base para decisiones médicas, jurídicas, financieras u otras con consecuencias significativas.",
        },
        {
          id: "modes",
          heading: "3. Gobernanza mediante modos del sistema",
          body:
            "m-pathy utiliza modos internos para la autogobernanza del sistema.\n\n" +
            "Los cambios de modo están limitados a la sesión, son deterministas y no constituyen perfilado del usuario.",
        },
        {
          id: "liability",
          heading: "4. Limitación de responsabilidad",
          body:
            "La responsabilidad se rige por la legislación aplicable. Los regímenes de responsabilidad obligatorios permanecen inalterados.",
        },
      ],
      disclaimer:
        "Estas condiciones estructuran la relación contractual y no sustituyen el asesoramiento jurídico.",
    },

    // ------------------------- REEMBOLSOS -------------------------
    refund: {
      slug: "refund",
      title: "Política de reembolsos",
      intro:
        "Esta política describe cómo se gestionan los pagos y los reembolsos en m-pathy.",
      last_updated: "Última actualización: 11 de enero de 2026",
      sections: [
        {
          id: "model",
          heading: "1. Modelo de compra",
          body:
            "El acceso a m-pathy se concede mediante una compra única por un período definido y/o un conjunto de tokens determinado.",
        },
        {
          id: "withdrawal",
          heading: "2. Derecho de desistimiento",
          body:
            "Los derechos legales de desistimiento aplicables a los servicios digitales se aplican cuando la ley así lo exija.",
        },
        {
          id: "refunds",
          heading: "3. Reembolsos",
          body:
            "Los reembolsos solo se conceden cuando existe una obligación legal o cuando se han prometido expresamente.",
        },
      ],
      disclaimer:
        "Esta política no limita los derechos legales imperativos.",
    },

    // ------------------------- JURÍDICO ---------------------------
    legal: {
      slug: "legal",
      title: "Información legal",
      intro:
        "Esta sección ofrece una visión general del marco jurídico aplicable a m-pathy.",
      last_updated: "Última actualización: 11 de enero de 2026",
      sections: [
        {
          id: "jurisdiction",
          heading: "1. Derecho aplicable y jurisdicción",
          body:
            "Salvo disposición imperativa en materia de protección de los consumidores, se aplica el derecho alemán. " +
            "Para los profesionales, el fuero competente es Múnich.",
        },
      ],
      disclaimer:
        "Esta información se facilita a efectos de transparencia. El derecho imperativo prevalece.",
    },

  },

    // ================================================================
  // ITALIANO
  // ================================================================
  it: {
    // ------------------------- NOTE LEGALI ------------------------
    imprint: {
      slug: "imprint",
      title: "Note legali",
      intro:
        "Le presenti note legali contengono le informazioni sul fornitore richieste per m-pathy ai sensi del diritto tedesco e, ove applicabile, del diritto europeo.",
      last_updated: "Ultimo aggiornamento: 11 gennaio 2026",
      sections: [
        {
          id: "provider",
          heading: "1. Fornitore",
          body:
            "NAAL UG (responsabilità limitata)\n" +
            "Maria-Theresia-Str. 11\n" +
            "81675 Monaco di Baviera\n" +
            "Germania\n\n" +
            "E-mail: support@m-pathy.ai",
        },
        {
          id: "representative",
          heading: "2. Direzione",
          body: "Amministratore: Alexander Khayat.",
        },
        {
          id: "register",
          heading: "3. Iscrizione al registro delle imprese",
          body:
            "NAAL UG (responsabilità limitata) è iscritta al registro delle imprese presso il Tribunale di Monaco di Baviera con il numero HRB 288710.",
        },
        {
          id: "vat",
          heading: "4. Partita IVA",
          body: "xe",
        },
        {
          id: "contact",
          heading: "5. Contatto",
          body:
            "Il modo più rapido per contattare m-pathy è attualmente tramite e-mail all’indirizzo support@m-pathy.ai. " +
            "Si prega di non inviare dati sensibili, in particolare dati sanitari o di pagamento, tramite e-mail.",
        },
      ],
      disclaimer:
        "Le presenti note legali sono fornite a scopo informativo e non sostituiscono una consulenza legale individuale.",
    },

    // ------------------------- PRIVACY ----------------------------
    privacy: {
      slug: "privacy",
      title: "Informativa sulla privacy",
      intro:
        "La presente informativa sulla privacy spiega in modo chiaro come vengono trattati i dati personali durante l’utilizzo di m-pathy.",
      last_updated: "Ultimo aggiornamento: 11 gennaio 2026",
      sections: [
        {
          id: "controller",
          heading: "1. Titolare del trattamento",
          body:
            "Il titolare del trattamento dei dati in relazione a m-pathy è:\n\n" +
            "NAAL UG (responsabilità limitata)\n" +
            "Maria-Theresia-Str. 11\n" +
            "81675 Monaco di Baviera\n" +
            "Germania\n" +
            "E-mail: support@m-pathy.ai",
        },
        {
          id: "principles",
          heading: "2. Protezione dei dati fin dalla progettazione",
          body:
            "m-pathy applica i principi di Privacy by Design e Privacy by Default.\n\n" +
            "• I dati sono trattati solo quando necessario\n" +
            "• L’estensione e la durata del trattamento sono ridotte al minimo\n" +
            "• Non vengono creati profili utente impliciti\n\n" +
            "La protezione dei dati è integrata nell’architettura del sistema.",
        },
        {
          id: "data_categories",
          heading: "3. Categorie di dati",
          body:
            "A seconda dell’utilizzo, possono essere trattate le seguenti categorie di dati:\n" +
            "• dati dell’account e di contatto (se forniti volontariamente),\n" +
            "• dati tecnici di utilizzo (sicurezza e stabilità),\n" +
            "• dati di pagamento (tramite fornitori esterni),\n" +
            "• contenuti di prompt e risposte (trattamento esclusivamente tecnico).\n\n" +
            "I contenuti dei prompt non sono utilizzati per finalità di profilazione, pubblicità o addestramento.",
        },
        {
          id: "local_processing",
          heading: "4. Trattamento locale",
          body:
            "I contenuti dei prompt sono trattati localmente o in modo transitorio e non vengono archiviati " +
            "in modo permanente su server in forma identificabile o ricostruibile.",
        },
        {
          id: "archive",
          heading: "5. Archivio locale e iniezione del contesto",
          body:
            "m-pathy consente agli utenti di salvare localmente determinati contenuti in un archivio.\n\n" +
            "Gli elementi archiviati possono essere selezionati consapevolmente e inseriti in una nuova conversazione.\n\n" +
            "• archiviazione esclusivamente locale,\n" +
            "• azione volontaria dell’utente,\n" +
            "• contesto inserito completamente visibile,\n" +
            "• nessuna memoria automatica o implicita.",
        },
        {
          id: "verification",
          heading: "6. Verifica e Triketon",
          body:
            "Durante la verifica dei contenuti (ad esempio articoli di stampa), m-pathy utilizza Triketon.\n\n" +
            "• i contenuti sono trasmessi al server esclusivamente ai fini della verifica,\n" +
            "• viene calcolato un hash crittografico di verità,\n" +
            "• viene generata o associata una chiave pubblica di verifica,\n" +
            "• il contenuto originale non viene memorizzato,\n" +
            "• sono conservati solo l’hash, la chiave pubblica e metadati tecnici minimi.\n\n" +
            "Non è possibile ricostruire il contenuto originale.",
        },
        {
          id: "prompt_integrity",
          heading: "7. Normalizzazione dei prompt e prevenzione del drift",
          body:
            "Prima dell’esecuzione, MAIOS 2.0 analizza strutturalmente i prompt.\n\n" +
            "Se un prompt è ambiguo, incoerente o soggetto a drift, la formulazione può essere adattata.\n\n" +
            "• l’intenzione dell’utente è preservata,\n" +
            "• vengono adattate solo la struttura e la chiarezza di sicurezza,\n" +
            "• nessun prompt viene memorizzato,\n" +
            "• non avviene alcun apprendimento né profilazione.",
        },
        {
          id: "devices",
          heading: "8. Archiviazione locale e dispositivi",
          body:
            "Tutti i contenuti generati dall’utente sono archiviati esclusivamente nella memoria locale del dispositivo utilizzato.\n\n" +
            "• la memoria locale persiste fino alla cancellazione da parte dell’utente,\n" +
            "• la cancellazione comporta la perdita irreversibile dei dati,\n" +
            "• non esistono backup lato server.\n\n" +
            "Ogni dispositivo riceve una chiave pubblica distinta. I dati sono strettamente legati al dispositivo.",
        },
      ],
      disclaimer:
        "La presente informativa sulla privacy è fornita a scopo informativo e non sostituisce una consulenza legale individuale.",
    },

    // ------------------------- CONDIZIONI -------------------------
    terms: {
      slug: "terms",
      title: "Condizioni d’uso",
      intro:
        "Le presenti condizioni d’uso disciplinano l’accesso e l’utilizzo di m-pathy. Utilizzando il servizio, l’utente le accetta.",
      last_updated: "Ultimo aggiornamento: 11 gennaio 2026",
      sections: [
        {
          id: "scope",
          heading: "1. Ambito del servizio",
          body:
            "m-pathy è un assistente sperimentale basato su IA e non sostituisce un terapeuta, un avvocato, un medico o un consulente finanziario umano.",
        },
        {
          id: "no_advice",
          heading: "2. Assenza di consulenza professionale",
          body:
            "I contenuti generati da m-pathy non devono essere utilizzati come unica base per decisioni mediche, legali, finanziarie o altre decisioni con conseguenze rilevanti.",
        },
        {
          id: "modes",
          heading: "3. Governance tramite modalità di sistema",
          body:
            "m-pathy utilizza modalità interne per l’autogovernance del sistema.\n\n" +
            "I cambi di modalità sono limitati alla sessione, deterministici e non costituiscono profilazione dell’utente.",
        },
        {
          id: "liability",
          heading: "4. Limitazione di responsabilità",
          body:
            "La responsabilità è disciplinata dalle disposizioni di legge applicabili. I regimi di responsabilità obbligatori restano invariati.",
        },
      ],
      disclaimer:
        "Le presenti condizioni strutturano il rapporto contrattuale e non sostituiscono una consulenza legale.",
    },

    // ------------------------- RIMBORSI ---------------------------
    refund: {
      slug: "refund",
      title: "Politica di rimborso",
      intro:
        "La presente politica descrive le modalità di gestione dei pagamenti e dei rimborsi per m-pathy.",
      last_updated: "Ultimo aggiornamento: 11 gennaio 2026",
      sections: [
        {
          id: "model",
          heading: "1. Modello di acquisto",
          body:
            "L’accesso a m-pathy è concesso tramite un acquisto una tantum per un periodo definito e/o un contingente di token prestabilito.",
        },
        {
          id: "withdrawal",
          heading: "2. Diritto di recesso",
          body:
            "I diritti legali di recesso applicabili ai servizi digitali si applicano ove previsto dalla legge.",
        },
        {
          id: "refunds",
          heading: "3. Rimborsi",
          body:
            "I rimborsi sono concessi solo in presenza di un obbligo legale o se espressamente promessi.",
        },
      ],
      disclaimer:
        "La presente politica non limita i diritti legali inderogabili.",
    },

    // ------------------------- GIURIDICO --------------------------
    legal: {
      slug: "legal",
      title: "Informazioni legali",
      intro:
        "Questa sezione fornisce una panoramica del quadro giuridico applicabile a m-pathy.",
      last_updated: "Ultimo aggiornamento: 11 gennaio 2026",
      sections: [
        {
          id: "jurisdiction",
          heading: "1. Legge applicabile e foro competente",
          body:
            "Salvo disposizioni inderogabili in materia di tutela dei consumatori, si applica il diritto tedesco. " +
            "Per i professionisti, il foro competente è Monaco di Baviera.",
        },
      ],
      disclaimer:
        "Le presenti informazioni sono fornite a fini di trasparenza. Il diritto inderogabile prevale.",
    },

  },

  // ================================================================
  // PORTUGUÊS
  // ================================================================
  pt: {
    // ------------------------- AVISO LEGAL ------------------------
    imprint: {
      slug: "imprint",
      title: "Aviso legal",
      intro:
        "Este aviso legal contém as informações do fornecedor exigidas para o m-pathy de acordo com o direito alemão e, quando aplicável, o direito europeu.",
      last_updated: "Última atualização: 11 de janeiro de 2026",
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
          heading: "2. Direção",
          body: "Diretor-gerente: Alexander Khayat.",
        },
        {
          id: "register",
          heading: "3. Registo comercial",
          body:
            "A NAAL UG (responsabilidade limitada) encontra-se registada no registo comercial do Tribunal de Munique sob o número HRB 288710.",
        },
        {
          id: "vat",
          heading: "4. Número de IVA",
          body: "xe",
        },
        {
          id: "contact",
          heading: "5. Contacto",
          body:
            "A forma mais rápida de contactar o m-pathy é atualmente por e-mail para support@m-pathy.ai. " +
            "Por favor, não envie dados sensíveis, em especial dados de saúde ou de pagamento, por e-mail.",
        },
      ],
      disclaimer:
        "Este aviso legal é fornecido para fins informativos e não substitui aconselhamento jurídico individual.",
    },

    // ------------------------- PRIVACIDADE ------------------------
    privacy: {
      slug: "privacy",
      title: "Política de privacidade",
      intro:
        "Esta política de privacidade explica de forma clara como os dados pessoais são tratados ao utilizar o m-pathy.",
      last_updated: "Última atualização: 11 de janeiro de 2026",
      sections: [
        {
          id: "controller",
          heading: "1. Responsável pelo tratamento",
          body:
            "O responsável pelo tratamento de dados em relação ao m-pathy é:\n\n" +
            "NAAL UG (responsabilidade limitada)\n" +
            "Maria-Theresia-Str. 11\n" +
            "81675 Munique\n" +
            "Alemanha\n" +
            "E-mail: support@m-pathy.ai",
        },
        {
          id: "principles",
          heading: "2. Proteção de dados desde a conceção",
          body:
            "O m-pathy aplica os princípios de Privacy by Design e Privacy by Default.\n\n" +
            "• Os dados são tratados apenas quando necessário\n" +
            "• O âmbito e a duração do tratamento são minimizados\n" +
            "• Não são criados perfis implícitos de utilizadores\n\n" +
            "A proteção de dados está integrada na arquitetura do sistema.",
        },
        {
          id: "data_categories",
          heading: "3. Categorias de dados",
          body:
            "Dependendo da utilização, podem ser tratadas as seguintes categorias de dados:\n" +
            "• dados de conta e contacto (quando fornecidos voluntariamente),\n" +
            "• dados técnicos de utilização (segurança e estabilidade),\n" +
            "• dados de pagamento (através de prestadores externos),\n" +
            "• conteúdos de prompts e respostas (tratamento exclusivamente técnico).\n\n" +
            "Os conteúdos dos prompts não são utilizados para fins de perfilização, publicidade ou treino.",
        },
        {
          id: "local_processing",
          heading: "4. Tratamento local",
          body:
            "Os conteúdos dos prompts são tratados localmente ou de forma transitória e não são armazenados " +
            "de forma permanente em servidores de forma identificável ou reconstruível.",
        },
        {
          id: "archive",
          heading: "5. Arquivo local e injeção de contexto",
          body:
            "O m-pathy permite aos utilizadores armazenar determinados conteúdos localmente num arquivo.\n\n" +
            "Os elementos arquivados podem ser selecionados conscientemente e inseridos numa nova conversa.\n\n" +
            "• armazenamento exclusivamente local,\n" +
            "• ação deliberada do utilizador,\n" +
            "• contexto inserido totalmente visível,\n" +
            "• sem memória automática ou implícita.",
        },
        {
          id: "verification",
          heading: "6. Verificação e Triketon",
          body:
            "Ao verificar conteúdos (por exemplo, artigos de notícias), o m-pathy utiliza o Triketon.\n\n" +
            "• os conteúdos são transmitidos ao servidor exclusivamente para fins de verificação,\n" +
            "• é calculado um hash criptográfico de verdade,\n" +
            "• é gerada ou associada uma chave pública de verificação,\n" +
            "• o conteúdo original não é armazenado,\n" +
            "• apenas o hash, a chave pública e metadados técnicos mínimos são conservados.\n\n" +
            "Não é possível reconstruir o conteúdo original.",
        },
        {
          id: "prompt_integrity",
          heading: "7. Normalização de prompts e prevenção de drift",
          body:
            "Antes da execução, o MAIOS 2.0 analisa estruturalmente os prompts.\n\n" +
            "Se um prompt for ambíguo, incoerente ou suscetível a drift, a formulação pode ser ajustada.\n\n" +
            "• a intenção do utilizador é preservada,\n" +
            "• apenas a estrutura e a clareza de segurança são ajustadas,\n" +
            "• nenhum prompt é armazenado,\n" +
            "• não ocorre qualquer aprendizagem ou perfilização.",
        },
        {
          id: "devices",
          heading: "8. Armazenamento local e dispositivos",
          body:
            "Todos os conteúdos gerados pelo utilizador são armazenados exclusivamente no armazenamento local do dispositivo utilizado.\n\n" +
            "• o armazenamento local persiste até ser eliminado pelo utilizador,\n" +
            "• a eliminação implica a perda irreversível dos dados,\n" +
            "• não existem cópias de segurança no servidor.\n\n" +
            "Cada dispositivo recebe uma chave pública distinta. Os dados estão estritamente associados ao dispositivo.",
        },
      ],
      disclaimer:
        "Esta política de privacidade é fornecida para fins de transparência e não substitui aconselhamento jurídico individual.",
    },

    // ------------------------- CONDIÇÕES --------------------------
    terms: {
      slug: "terms",
      title: "Termos de utilização",
      intro:
        "Estes termos de utilização regulam o acesso e a utilização do m-pathy. Ao utilizar o serviço, o utilizador concorda com os mesmos.",
      last_updated: "Última atualização: 11 de janeiro de 2026",
      sections: [
        {
          id: "scope",
          heading: "1. Âmbito do serviço",
          body:
            "O m-pathy é um assistente experimental baseado em IA e não substitui um terapeuta, advogado, médico ou consultor financeiro humano.",
        },
        {
          id: "no_advice",
          heading: "2. Ausência de aconselhamento profissional",
          body:
            "Os conteúdos gerados pelo m-pathy não devem ser utilizados como única base para decisões médicas, jurídicas, financeiras ou outras com consequências significativas.",
        },
        {
          id: "modes",
          heading: "3. Governação por modos do sistema",
          body:
            "O m-pathy utiliza modos internos para a autogovernação do sistema.\n\n" +
            "As mudanças de modo são limitadas à sessão, determinísticas e não constituem perfilização do utilizador.",
        },
        {
          id: "liability",
          heading: "4. Limitação de responsabilidade",
          body:
            "A responsabilidade é regida pela legislação aplicável. Os regimes de responsabilidade obrigatórios permanecem inalterados.",
        },
      ],
      disclaimer:
        "Estes termos estruturam a relação contratual e não substituem aconselhamento jurídico.",
    },

    // ------------------------- REEMBOLSOS --------------------------
    refund: {
      slug: "refund",
      title: "Política de reembolsos",
      intro:
        "Esta política descreve como os pagamentos e os reembolsos são tratados no m-pathy.",
      last_updated: "Última atualização: 11 de janeiro de 2026",
      sections: [
        {
          id: "model",
          heading: "1. Modelo de compra",
          body:
            "O acesso ao m-pathy é concedido através de uma compra única por um período definido e/ou um conjunto de tokens determinado.",
        },
        {
          id: "withdrawal",
          heading: "2. Direito de livre resolução",
          body:
            "Os direitos legais de livre resolução aplicáveis aos serviços digitais aplicam-se quando exigido por lei.",
        },
        {
          id: "refunds",
          heading: "3. Reembolsos",
          body:
            "Os reembolsos são concedidos apenas quando existe uma obrigação legal ou quando foram expressamente prometidos.",
        },
      ],
      disclaimer:
        "Esta política não limita direitos legais imperativos.",
    },

    // ------------------------- JURÍDICO ---------------------------
    legal: {
      slug: "legal",
      title: "Informações legais",
      intro:
        "Esta secção fornece uma visão geral do enquadramento jurídico aplicável ao m-pathy.",
      last_updated: "Última atualização: 11 de janeiro de 2026",
      sections: [
        {
          id: "jurisdiction",
          heading: "1. Direito aplicável e foro competente",
          body:
            "Salvo disposições imperativas em matéria de proteção dos consumidores, aplica-se o direito alemão. " +
            "Para profissionais, o foro competente é Munique.",
        },
      ],
      disclaimer:
        "Estas informações são fornecidas para fins de transparência. O direito imperativo prevalece.",
    },

  },

    // ================================================================
  // NEDERLANDS
  // ================================================================
  nl: {
    // ------------------------- COLOFON ----------------------------
    imprint: {
      slug: "imprint",
      title: "Colofon",
      intro:
        "Deze colofon bevat de wettelijk vereiste informatie over de aanbieder van m-pathy volgens het Duitse en, voor zover van toepassing, het Europese recht.",
      last_updated: "Laatst bijgewerkt: 11 januari 2026",
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
          heading: "2. Directie",
          body: "Directeur: Alexander Khayat.",
        },
        {
          id: "register",
          heading: "3. Handelsregister",
          body:
            "NAAL UG (beperkte aansprakelijkheid) is ingeschreven in het handelsregister bij het Amtsgericht München onder nummer HRB 288710.",
        },
        {
          id: "vat",
          heading: "4. BTW-nummer",
          body: "xe",
        },
        {
          id: "contact",
          heading: "5. Contact",
          body:
            "De snelste manier om contact op te nemen met m-pathy is momenteel per e-mail via support@m-pathy.ai. " +
            "Stuur geen gevoelige gegevens, met name gezondheids- of betalingsgegevens, per e-mail.",
        },
      ],
      disclaimer:
        "Deze colofon is bedoeld ter informatie en vervangt geen individueel juridisch advies.",
    },

    // ------------------------- PRIVACY ----------------------------
    privacy: {
      slug: "privacy",
      title: "Privacyverklaring",
      intro:
        "Deze privacyverklaring legt op duidelijke wijze uit hoe persoonsgegevens worden verwerkt bij het gebruik van m-pathy.",
      last_updated: "Laatst bijgewerkt: 11 januari 2026",
      sections: [
        {
          id: "controller",
          heading: "1. Verwerkingsverantwoordelijke",
          body:
            "De verwerkingsverantwoordelijke voor de gegevensverwerking in verband met m-pathy is:\n\n" +
            "NAAL UG (beperkte aansprakelijkheid)\n" +
            "Maria-Theresia-Str. 11\n" +
            "81675 München\n" +
            "Duitsland\n" +
            "E-mail: support@m-pathy.ai",
        },
        {
          id: "principles",
          heading: "2. Privacy by Design en by Default",
          body:
            "m-pathy past de beginselen van Privacy by Design en Privacy by Default toe.\n\n" +
            "• Gegevens worden alleen verwerkt wanneer dat noodzakelijk is\n" +
            "• Omvang en duur van de verwerking worden geminimaliseerd\n" +
            "• Er worden geen impliciete gebruikersprofielen aangemaakt\n\n" +
            "Gegevensbescherming is structureel ingebouwd in de systeemarchitectuur.",
        },
        {
          id: "data_categories",
          heading: "3. Categorieën van gegevens",
          body:
            "Afhankelijk van het gebruik kunnen de volgende categorieën gegevens worden verwerkt:\n" +
            "• account- en contactgegevens (indien vrijwillig verstrekt),\n" +
            "• technische gebruiksgegevens (uitsluitend voor veiligheid en stabiliteit),\n" +
            "• betalingsgegevens (via externe dienstverleners),\n" +
            "• inhoud van prompts en antwoorden (uitsluitend technische verwerking).\n\n" +
            "Promptinhoud wordt niet gebruikt voor profilering, reclame of training.",
        },
        {
          id: "local_processing",
          heading: "4. Lokale verwerking",
          body:
            "De inhoud van prompts wordt lokaal of tijdelijk verwerkt en niet permanent " +
            "op servers opgeslagen in identificeerbare of reconstrueerbare vorm.",
        },
        {
          id: "archive",
          heading: "5. Lokaal archief en contextinjectie",
          body:
            "m-pathy stelt gebruikers in staat geselecteerde inhoud lokaal in een archief op te slaan.\n\n" +
            "Gearchiveerde items kunnen bewust door de gebruiker worden geselecteerd en in een nieuwe chat worden ingevoegd.\n\n" +
            "• uitsluitend lokale opslag,\n" +
            "• expliciete handeling door de gebruiker,\n" +
            "• volledig zichtbare ingevoegde context,\n" +
            "• geen automatische of impliciete geheugenfunctie.",
        },
        {
          id: "verification",
          heading: "6. Verificatie en Triketon",
          body:
            "Bij het verifiëren van inhoud (bijvoorbeeld nieuwsartikelen) maakt m-pathy gebruik van Triketon.\n\n" +
            "• inhoud wordt uitsluitend voor verificatiedoeleinden naar de server verzonden,\n" +
            "• er wordt een cryptografische waarheidshash berekend,\n" +
            "• er wordt een publieke verificatiesleutel gegenereerd of gekoppeld,\n" +
            "• de oorspronkelijke inhoud wordt niet opgeslagen,\n" +
            "• alleen de hash, de publieke sleutel en minimale technische metadata worden bewaard.\n\n" +
            "De oorspronkelijke inhoud kan niet worden gereconstrueerd.",
        },
        {
          id: "prompt_integrity",
          heading: "7. Prompt-normalisatie en driftpreventie",
          body:
            "Voor uitvoering analyseert MAIOS 2.0 prompts op structureel niveau.\n\n" +
            "Indien een prompt ambigu, inconsistent of driftgevoelig is, kan de formulering worden aangepast.\n\n" +
            "• de intentie van de gebruiker blijft behouden,\n" +
            "• alleen structuur en veiligheidsduidelijkheid worden aangepast,\n" +
            "• geen prompts worden opgeslagen,\n" +
            "• er vindt geen leren of profilering plaats.",
        },
        {
          id: "devices",
          heading: "8. Lokale opslag en apparaten",
          body:
            "Alle door de gebruiker gegenereerde inhoud wordt uitsluitend opgeslagen in de lokale opslag van het gebruikte apparaat.\n\n" +
            "• lokale opslag blijft bestaan totdat deze door de gebruiker wordt verwijderd,\n" +
            "• verwijdering leidt tot onomkeerbaar verlies van gegevens,\n" +
            "• er bestaan geen server-side back-ups.\n\n" +
            "Elk apparaat ontvangt een eigen publieke sleutel. Gegevens zijn strikt apparaatspecifiek.",
        },
      ],
      disclaimer:
        "Deze privacyverklaring is bedoeld ter transparantie en vervangt geen individueel juridisch advies.",
    },

    // ------------------------- VOORWAARDEN ------------------------
    terms: {
      slug: "terms",
      title: "Gebruiksvoorwaarden",
      intro:
        "Deze gebruiksvoorwaarden regelen de toegang tot en het gebruik van m-pathy. Door het gebruik van de dienst gaat u hiermee akkoord.",
      last_updated: "Laatst bijgewerkt: 11 januari 2026",
      sections: [
        {
          id: "scope",
          heading: "1. Omvang van de dienst",
          body:
            "m-pathy is een experimentele AI-gebaseerde assistent en vervangt geen menselijke therapeut, advocaat, arts of financieel adviseur.",
        },
        {
          id: "no_advice",
          heading: "2. Geen professioneel advies",
          body:
            "Inhoud die door m-pathy wordt gegenereerd mag niet worden gebruikt als enige basis voor medische, juridische, financiële of andere beslissingen met aanzienlijke gevolgen.",
        },
        {
          id: "modes",
          heading: "3. Systeemgestuurde modi",
          body:
            "m-pathy maakt gebruik van interne systeemmodi voor zelfbesturing.\n\n" +
            "Moduswisselingen zijn sessiegebonden, deterministisch en vormen geen gebruikersprofilering.",
        },
        {
          id: "liability",
          heading: "4. Aansprakelijkheidsbeperking",
          body:
            "Aansprakelijkheid is geregeld volgens de toepasselijke wetgeving. Dwingende aansprakelijkheidsregelingen blijven onverkort van kracht.",
        },
      ],
      disclaimer:
        "Deze voorwaarden structureren de contractuele relatie en vervangen geen juridisch advies.",
    },

    // ------------------------- TERUGBETALING ----------------------
    refund: {
      slug: "refund",
      title: "Restitutiebeleid",
      intro:
        "Dit beleid beschrijft hoe betalingen en restituties binnen m-pathy worden afgehandeld.",
      last_updated: "Laatst bijgewerkt: 11 januari 2026",
      sections: [
        {
          id: "model",
          heading: "1. Aankoopmodel",
          body:
            "Toegang tot m-pathy wordt verleend via een eenmalige aankoop voor een bepaalde periode en/of een vast tokenaantal.",
        },
        {
          id: "withdrawal",
          heading: "2. Herroepingsrecht",
          body:
            "Wettelijke herroepingsrechten voor digitale diensten zijn van toepassing indien wettelijk vereist.",
        },
        {
          id: "refunds",
          heading: "3. Restituties",
          body:
            "Restituties worden uitsluitend verleend indien er een wettelijke verplichting bestaat of indien dit uitdrukkelijk is toegezegd.",
        },
      ],
      disclaimer:
        "Dit beleid beperkt geen dwingende wettelijke rechten.",
    },

    // ------------------------- JURIDISCH --------------------------
    legal: {
      slug: "legal",
      title: "Juridische informatie",
      intro:
        "Deze sectie geeft een overzicht van het juridische kader dat van toepassing is op m-pathy.",
      last_updated: "Laatst bijgewerkt: 11 januari 2026",
      sections: [
        {
          id: "jurisdiction",
          heading: "1. Toepasselijk recht en bevoegde rechter",
          body:
            "Tenzij dwingende consumentenbeschermingsbepalingen anders voorschrijven, is Duits recht van toepassing. " +
            "Voor handelaren is München de exclusief bevoegde rechtbank.",
        },
      ],
      disclaimer:
        "Deze informatie wordt verstrekt ter transparantie. Dwingend recht heeft voorrang.",
    },

  },

    // ================================================================
  // РУССКИЙ
  // ================================================================
  ru: {
    // ------------------------- ИМПРЕССУМ --------------------------
    imprint: {
      slug: "imprint",
      title: "Выходные данные",
      intro:
        "Настоящие выходные данные содержат сведения о поставщике m-pathy, требуемые в соответствии с законодательством Германии и, при необходимости, Европейского союза.",
      last_updated: "Последнее обновление: 11 января 2026 г.",
      sections: [
        {
          id: "provider",
          heading: "1. Поставщик",
          body:
            "NAAL UG (общество с ограниченной ответственностью)\n" +
            "Maria-Theresia-Str. 11\n" +
            "81675 Мюнхен\n" +
            "Германия\n\n" +
            "E-mail: support@m-pathy.ai",
        },
        {
          id: "representative",
          heading: "2. Руководство",
          body: "Управляющий директор: Alexander Khayat.",
        },
        {
          id: "register",
          heading: "3. Торговый реестр",
          body:
            "Компания NAAL UG (общество с ограниченной ответственностью) зарегистрирована в торговом реестре при Amtsgericht München под номером HRB 288710.",
        },
        {
          id: "vat",
          heading: "4. Идентификационный номер НДС",
          body: "xe",
        },
        {
          id: "contact",
          heading: "5. Контактная информация",
          body:
            "Наиболее быстрый способ связаться с m-pathy в настоящее время - по электронной почте support@m-pathy.ai. " +
            "Пожалуйста, не направляйте по электронной почте конфиденциальные данные, в частности медицинские или платежные данные.",
        },
      ],
      disclaimer:
        "Настоящие выходные данные предоставлены исключительно в информационных целях и не заменяют индивидуальную юридическую консультацию.",
    },

    // ------------------------- КОНФИДЕНЦИАЛЬНОСТЬ -----------------
    privacy: {
      slug: "privacy",
      title: "Политика конфиденциальности",
      intro:
        "Настоящая политика конфиденциальности в доступной форме разъясняет, каким образом обрабатываются персональные данные при использовании m-pathy.",
      last_updated: "Последнее обновление: 11 января 2026 г.",
      sections: [
        {
          id: "controller",
          heading: "1. Ответственный за обработку данных",
          body:
            "Лицом, ответственным за обработку персональных данных в связи с m-pathy, является:\n\n" +
            "NAAL UG (общество с ограниченной ответственностью)\n" +
            "Maria-Theresia-Str. 11\n" +
            "81675 Мюнхен\n" +
            "Германия\n" +
            "E-mail: support@m-pathy.ai",
        },
        {
          id: "principles",
          heading: "2. Защита данных по замыслу и по умолчанию",
          body:
            "m-pathy реализует принципы Privacy by Design и Privacy by Default.\n\n" +
            "• данные обрабатываются только при наличии необходимости,\n" +
            "• объем и продолжительность обработки минимизируются,\n" +
            "• скрытые пользовательские профили не создаются.\n\n" +
            "Защита данных является неотъемлемой частью архитектуры системы.",
        },
        {
          id: "data_categories",
          heading: "3. Категории данных",
          body:
            "В зависимости от использования могут обрабатываться следующие категории данных:\n" +
            "• данные учетной записи и контактные данные (если предоставлены добровольно),\n" +
            "• технические данные использования (исключительно для обеспечения безопасности и стабильности),\n" +
            "• платежные данные (через внешних поставщиков услуг),\n" +
            "• содержание запросов и ответов (исключительно для технической обработки).\n\n" +
            "Содержание запросов не используется для профилирования, рекламы или обучения.",
        },
        {
          id: "local_processing",
          heading: "4. Локальная обработка",
          body:
            "Содержание запросов обрабатывается локально либо временно и не сохраняется " +
            "на серверах в идентифицируемой или восстанавливаемой форме.",
        },
        {
          id: "archive",
          heading: "5. Локальный архив и внедрение контекста",
          body:
            "m-pathy позволяет пользователям сохранять выбранный контент локально в архиве.\n\n" +
            "Заархивированные элементы могут быть сознательно выбраны пользователем и добавлены в новый диалог.\n\n" +
            "• исключительно локальное хранение,\n" +
            "• осознанное действие пользователя,\n" +
            "• полностью видимый внедряемый контекст,\n" +
            "• отсутствие автоматической или скрытой памяти.",
        },
        {
          id: "verification",
          heading: "6. Проверка и Triketon",
          body:
            "При проверке контента (например, новостных материалов) m-pathy использует Triketon.\n\n" +
            "• контент передается на сервер исключительно для целей проверки,\n" +
            "• вычисляется криптографический хэш достоверности,\n" +
            "• генерируется или связывается публичный ключ проверки,\n" +
            "• исходный контент не сохраняется,\n" +
            "• сохраняются только хэш, публичный ключ и минимальные технические метаданные.\n\n" +
            "Восстановление исходного контента невозможно.",
        },
        {
          id: "prompt_integrity",
          heading: "7. Нормализация запросов и предотвращение дрейфа",
          body:
            "Перед выполнением MAIOS 2.0 анализирует запросы на структурном уровне.\n\n" +
            "Если запрос является неоднозначным, несогласованным или подверженным дрейфу, формулировка может быть скорректирована.\n\n" +
            "• намерение пользователя сохраняется,\n" +
            "• изменяются только структура и ясность с точки зрения безопасности,\n" +
            "• запросы не сохраняются,\n" +
            "• обучение или профилирование не осуществляется.",
        },
        {
          id: "devices",
          heading: "8. Локальное хранилище и устройства",
          body:
            "Весь контент, созданный пользователем, хранится исключительно в локальном хранилище используемого устройства.\n\n" +
            "• локальное хранилище сохраняется до его удаления пользователем,\n" +
            "• удаление приводит к безвозвратной потере данных,\n" +
            "• серверные резервные копии отсутствуют.\n\n" +
            "Каждому устройству присваивается отдельный публичный ключ. Данные строго изолированы по устройствам.",
        },
      ],
      disclaimer:
        "Настоящая политика конфиденциальности предоставлена в целях прозрачности и не заменяет индивидуальную юридическую консультацию.",
    },

    // ------------------------- УСЛОВИЯ ----------------------------
    terms: {
      slug: "terms",
      title: "Условия использования",
      intro:
        "Настоящие условия использования регулируют доступ к m-pathy и его использование. Используя сервис, пользователь соглашается с ними.",
      last_updated: "Последнее обновление: 11 января 2026 г.",
      sections: [
        {
          id: "scope",
          heading: "1. Область применения сервиса",
          body:
            "m-pathy является экспериментальным ассистентом на базе ИИ и не заменяет консультации врача, юриста, терапевта или финансового консультанта.",
        },
        {
          id: "no_advice",
          heading: "2. Отсутствие профессиональных рекомендаций",
          body:
            "Контент, создаваемый m-pathy, не должен использоваться как единственная основа для медицинских, юридических, финансовых или иных решений с существенными последствиями.",
        },
        {
          id: "modes",
          heading: "3. Управление посредством системных режимов",
          body:
            "m-pathy использует внутренние системные режимы для самоуправления.\n\n" +
            "Переключение режимов ограничено рамками сессии, является детерминированным и не представляет собой профилирование пользователя.",
        },
        {
          id: "liability",
          heading: "4. Ограничение ответственности",
          body:
            "Ответственность регулируется применимым законодательством. Обязательные режимы ответственности остаются неизменными.",
        },
      ],
      disclaimer:
        "Настоящие условия структурируют договорные отношения и не заменяют юридическую консультацию.",
    },

    // ------------------------- ВОЗВРАТ СРЕДСТВ --------------------
    refund: {
      slug: "refund",
      title: "Политика возврата средств",
      intro:
        "Настоящая политика описывает порядок обработки платежей и возвратов в рамках m-pathy.",
      last_updated: "Последнее обновление: 11 января 2026 г.",
      sections: [
        {
          id: "model",
          heading: "1. Модель приобретения",
          body:
            "Доступ к m-pathy предоставляется посредством разовой покупки на определенный период и/или с установленным объемом токенов.",
        },
        {
          id: "withdrawal",
          heading: "2. Право на отказ",
          body:
            "Применимые законные права на отказ от цифровых услуг действуют в случаях, предусмотренных законом.",
        },
        {
          id: "refunds",
          heading: "3. Возвраты",
          body:
            "Возврат средств осуществляется только при наличии законного обязательства либо при прямом обещании возврата.",
        },
      ],
      disclaimer:
        "Настоящая политика не ограничивает императивные законные права.",
    },

    // ------------------------- ЮРИДИЧЕСКАЯ ИНФОРМАЦИЯ -------------
    legal: {
      slug: "legal",
      title: "Юридическая информация",
      intro:
        "В данном разделе представлен обзор правовой базы, применимой к m-pathy.",
      last_updated: "Последнее обновление: 11 января 2026 г.",
      sections: [
        {
          id: "jurisdiction",
          heading: "1. Применимое право и подсудность",
          body:
            "Если иное не предусмотрено обязательными нормами защиты прав потребителей, применяется право Германии. " +
            "Для коммерческих пользователей исключительной подсудностью является город Мюнхен.",
        },
      ],
      disclaimer:
        "Настоящая информация предоставлена в целях прозрачности. Императивные нормы права имеют приоритет.",
    },
  },

  // ================================================================
  // 中文（简体）
  // ================================================================
  zh: {
    // ------------------------- 法律声明 ---------------------------
    imprint: {
      slug: "imprint",
      title: "法律声明",
      intro:
        "本法律声明包含根据德国法律及在适用情况下根据欧洲法律对 m-pathy 所要求披露的提供方信息。",
      last_updated: "最后更新：2026年1月11日",
      sections: [
        {
          id: "provider",
          heading: "1. 提供方",
          body:
            "NAAL UG（有限责任公司）\n" +
            "Maria-Theresia-Str. 11\n" +
            "81675 慕尼黑\n" +
            "德国\n\n" +
            "电子邮件：support@m-pathy.ai",
        },
        {
          id: "representative",
          heading: "2. 管理层",
          body: "执行董事：Alexander Khayat。",
        },
        {
          id: "register",
          heading: "3. 商业登记",
          body:
            "NAAL UG（有限责任公司）已在慕尼黑地方法院（Amtsgericht München）商业登记册中注册，注册号为 HRB 288710。",
        },
        {
          id: "vat",
          heading: "4. 增值税识别号",
          body: "xe",
        },
        {
          id: "contact",
          heading: "5. 联系方式",
          body:
            "目前联系 m-pathy 的最快方式是通过电子邮件 support@m-pathy.ai。 " +
            "请勿通过电子邮件发送敏感信息，尤其是健康数据或支付数据。",
        },
      ],
      disclaimer:
        "本法律声明仅用于信息披露，不构成或替代个别法律咨询。",
    },

    // ------------------------- 隐私政策 ---------------------------
    privacy: {
      slug: "privacy",
      title: "隐私政策",
      intro:
        "本隐私政策以清晰易懂的方式说明在使用 m-pathy 过程中个人数据如何被处理。",
      last_updated: "最后更新：2026年1月11日",
      sections: [
        {
          id: "controller",
          heading: "1. 数据处理负责人",
          body:
            "与 m-pathy 相关的数据处理负责人为：\n\n" +
            "NAAL UG（有限责任公司）\n" +
            "Maria-Theresia-Str. 11\n" +
            "81675 慕尼黑\n" +
            "德国\n" +
            "电子邮件：support@m-pathy.ai",
        },
        {
          id: "principles",
          heading: "2. 隐私设计与默认保护",
          body:
            "m-pathy 贯彻“隐私设计（Privacy by Design）”和“隐私默认（Privacy by Default）”原则。\n\n" +
            "• 仅在必要时处理数据\n" +
            "• 将处理范围和持续时间降至最低\n" +
            "• 不创建隐含的用户画像\n\n" +
            "隐私保护作为系统架构的组成部分被强制执行。",
        },
        {
          id: "data_categories",
          heading: "3. 数据类别",
          body:
            "根据使用情况，可能涉及以下数据类别：\n" +
            "• 账户和联系方式数据（仅在用户主动提供时），\n" +
            "• 技术使用数据（仅用于安全与稳定性），\n" +
            "• 支付数据（通过外部服务提供商处理），\n" +
            "• 提示词与回复内容（仅用于技术处理）。\n\n" +
            "提示词内容不用于用户画像、广告或模型训练。",
        },
        {
          id: "local_processing",
          heading: "4. 本地处理",
          body:
            "提示词内容在本地或短暂处理过程中使用，不会以可识别或可重建的形式永久存储在服务器上。",
        },
        {
          id: "archive",
          heading: "5. 本地归档与上下文注入",
          body:
            "m-pathy 允许用户将选定内容本地存储于归档中。\n\n" +
            "归档内容仅在用户明确选择的情况下，才可被注入到新的对话中。\n\n" +
            "• 仅限本地存储，\n" +
            "• 需用户主动操作，\n" +
            "• 注入内容完全可见，\n" +
            "• 不存在自动或隐式记忆。",
        },
        {
          id: "verification",
          heading: "6. 验证与 Triketon",
          body:
            "在验证内容（例如新闻文章）时，m-pathy 使用 Triketon 机制。\n\n" +
            "• 内容仅为验证目的传输至服务器，\n" +
            "• 计算加密的真实性哈希值，\n" +
            "• 生成或关联一个公共验证密钥，\n" +
            "• 原始内容不会被存储，\n" +
            "• 仅保留哈希值、公钥及最少的技术元数据。\n\n" +
            "无法通过所存储的数据还原原始内容。",
        },
        {
          id: "prompt_integrity",
          heading: "7. 提示词规范化与漂移防护",
          body:
            "在执行前，MAIOS 2.0 会对提示词进行结构性分析。\n\n" +
            "若提示词存在歧义、不一致或潜在漂移风险，系统可能对其表达进行重构。\n\n" +
            "• 用户意图保持不变，\n" +
            "• 仅调整结构与安全清晰度，\n" +
            "• 不存储提示词，\n" +
            "• 不进行学习或用户画像。",
        },
        {
          id: "devices",
          heading: "8. 本地存储与设备隔离",
          body:
            "所有用户生成内容仅存储于所使用设备的本地存储中。\n\n" +
            "• 本地存储在用户未删除前持续存在，\n" +
            "• 删除将导致数据不可恢复，\n" +
            "• 不存在服务器端备份。\n\n" +
            "每个设备都会获得一个独立的公钥，数据严格按设备隔离。",
        },
      ],
      disclaimer:
        "本隐私政策用于信息透明披露，不构成或替代个别法律咨询。",
    },

    // ------------------------- 使用条款 ---------------------------
    terms: {
      slug: "terms",
      title: "使用条款",
      intro:
        "本使用条款规范对 m-pathy 的访问和使用。使用本服务即表示您同意这些条款。",
      last_updated: "最后更新：2026年1月11日",
      sections: [
        {
          id: "scope",
          heading: "1. 服务范围",
          body:
            "m-pathy 是一款实验性人工智能助手，并不替代人类治疗师、律师、医生或财务顾问。",
        },
        {
          id: "no_advice",
          heading: "2. 非专业建议",
          body:
            "m-pathy 生成的内容不得作为医疗、法律、财务或其他具有重大后果决策的唯一依据。",
        },
        {
          id: "modes",
          heading: "3. 系统模式治理",
          body:
            "m-pathy 使用内部系统模式进行自我治理。\n\n" +
            "模式切换仅限于当前会话，具有确定性，不构成用户画像。",
        },
        {
          id: "liability",
          heading: "4. 责任限制",
          body:
            "责任范围依据适用法律确定。强制性责任规定不受影响。",
        },
      ],
      disclaimer:
        "本条款用于规范合同关系，不替代法律咨询。",
    },

    // ------------------------- 退款政策 ---------------------------
    refund: {
      slug: "refund",
      title: "退款政策",
      intro:
        "本政策说明 m-pathy 中付款和退款的处理方式。",
      last_updated: "最后更新：2026年1月11日",
      sections: [
        {
          id: "model",
          heading: "1. 购买模式",
          body:
            "m-pathy 的访问权限通过一次性购买获得，适用于限定期限和/或固定数量的代币。",
        },
        {
          id: "withdrawal",
          heading: "2. 撤销权",
          body:
            "如法律要求，适用于数字服务的法定撤销权将得到保障。",
        },
        {
          id: "refunds",
          heading: "3. 退款",
          body:
            "仅在存在法律义务或明确承诺的情况下提供退款。",
        },
      ],
      disclaimer:
        "本政策不限制任何强制性的法定权利。",
    },

    // ------------------------- 法律信息 ---------------------------
    legal: {
      slug: "legal",
      title: "法律信息",
      intro:
        "本部分概述适用于 m-pathy 的法律框架。",
      last_updated: "最后更新：2026年1月11日",
      sections: [
        {
          id: "jurisdiction",
          heading: "1. 适用法律与管辖权",
          body:
            "除非消费者保护的强制性规定另有要求，否则适用德国法律。 " +
            "对于商业用户，慕尼黑为专属管辖地。",
        },
      ],
      disclaimer:
        "本信息用于透明披露。强制性法律优先适用。",
    },

},

  // ================================================================
  // 日本語
  // ================================================================
  ja: {
    // ------------------------- 法的表示 ---------------------------
    imprint: {
      slug: "imprint",
      title: "法的表示",
      intro:
        "本法的表示は、ドイツ法および適用される場合には欧州法に基づき、m-pathy に求められる提供者情報を記載しています。",
      last_updated: "最終更新日：2026年1月11日",
      sections: [
        {
          id: "provider",
          heading: "1. 提供者",
          body:
            "NAAL UG（有限責任会社）\n" +
            "Maria-Theresia-Str. 11\n" +
            "81675 ミュンヘン\n" +
            "ドイツ\n\n" +
            "Eメール：support@m-pathy.ai",
        },
        {
          id: "representative",
          heading: "2. 代表者",
          body: "代表取締役：Alexander Khayat。",
        },
        {
          id: "register",
          heading: "3. 商業登記",
          body:
            "NAAL UG（有限責任会社）は、ミュンヘン地方裁判所（Amtsgericht München）の商業登記簿に HRB 288710 として登録されています。",
        },
        {
          id: "vat",
          heading: "4. 付加価値税識別番号",
          body: "xe",
        },
        {
          id: "contact",
          heading: "5. 連絡先",
          body:
            "現在、m-pathy への最も迅速な連絡方法は support@m-pathy.ai 宛のEメールです。 " +
            "健康情報や支払情報などの機微なデータは、Eメールで送信しないでください。",
        },
      ],
      disclaimer:
        "本法的表示は情報提供を目的とするものであり、個別の法的助言に代わるものではありません。",
    },

    // ------------------------- プライバシー -----------------------
    privacy: {
      slug: "privacy",
      title: "プライバシーポリシー",
      intro:
        "本プライバシーポリシーは、m-pathy の利用に際して個人データがどのように取り扱われるかを分かりやすく説明します。",
      last_updated: "最終更新日：2026年1月11日",
      sections: [
        {
          id: "controller",
          heading: "1. データ管理者",
          body:
            "m-pathy に関連するデータ処理の管理者は以下のとおりです。\n\n" +
            "NAAL UG（有限責任会社）\n" +
            "Maria-Theresia-Str. 11\n" +
            "81675 ミュンヘン\n" +
            "ドイツ\n" +
            "Eメール：support@m-pathy.ai",
        },
        {
          id: "principles",
          heading: "2. プライバシー・バイ・デザインおよびデフォルト",
          body:
            "m-pathy は Privacy by Design および Privacy by Default の原則を採用しています。\n\n" +
            "• 必要な場合にのみデータを処理します\n" +
            "• 処理範囲および期間を最小限に抑えます\n" +
            "• 暗黙的なユーザープロファイルは作成しません\n\n" +
            "プライバシー保護はシステム設計に組み込まれています。",
        },
        {
          id: "data_categories",
          heading: "3. データの種類",
          body:
            "利用状況に応じて、以下のデータが関与する場合があります。\n" +
            "• アカウントおよび連絡先情報（ユーザーが自主的に提供した場合）\n" +
            "• 技術的利用データ（安全性および安定性のためのみ）\n" +
            "• 支払データ（外部決済事業者を通じて処理）\n" +
            "• プロンプトおよび応答内容（技術的処理のみ）\n\n" +
            "プロンプト内容は、プロファイリング、広告、学習目的には使用されません。",
        },
        {
          id: "local_processing",
          heading: "4. ローカル処理",
          body:
            "プロンプト内容はローカルまたは一時的に処理され、識別可能または再構築可能な形でサーバーに恒久的に保存されることはありません。",
        },
        {
          id: "archive",
          heading: "5. ローカルアーカイブとコンテキスト注入",
          body:
            "m-pathy は、選択したコンテンツをローカルにアーカイブとして保存することを可能にします。\n\n" +
            "アーカイブされた項目は、ユーザーが明示的に選択した場合にのみ、新しいチャットへ注入されます。\n\n" +
            "• 完全にローカル保存\n" +
            "• ユーザーによる明示的操作\n" +
            "• 注入されたコンテキストは完全に可視\n" +
            "• 自動的または暗黙的なメモリは存在しません。",
        },
        {
          id: "verification",
          heading: "6. 検証および Triketon",
          body:
            "ニュース記事などのコンテンツを検証する際、m-pathy は Triketon を使用します。\n\n" +
            "• 検証目的のみにコンテンツがサーバーへ送信されます\n" +
            "• 暗号学的な真実性ハッシュが計算されます\n" +
            "• 公開検証キーが生成または関連付けられます\n" +
            "• 元のコンテンツは保存されません\n" +
            "• ハッシュ、公開キー、最小限の技術的メタデータのみが保持されます\n\n" +
            "保存された情報から元の内容を復元することはできません。",
        },
        {
          id: "prompt_integrity",
          heading: "7. プロンプト正規化とドリフト防止",
          body:
            "実行前に、MAIOS 2.0 はプロンプトを構造的に分析します。\n\n" +
            "曖昧、不整合、またはドリフトの恐れがある場合、表現が再構成されることがあります。\n\n" +
            "• ユーザーの意図は保持されます\n" +
            "• 構造と安全性の明確化のみが調整されます\n" +
            "• プロンプトは保存されません\n" +
            "• 学習やプロファイリングは行われません。",
        },
        {
          id: "devices",
          heading: "8. ローカル保存とデバイス",
          body:
            "ユーザーが生成したすべてのコンテンツは、使用中のデバイスのローカルストレージにのみ保存されます。\n\n" +
            "• ローカルストレージはユーザーが削除するまで保持されます\n" +
            "• 削除するとデータは復元できません\n" +
            "• サーバー側のバックアップは存在しません\n\n" +
            "各デバイスには固有の公開キーが割り当てられ、データはデバイス単位で厳密に分離されます。",
        },
      ],
      disclaimer:
        "本プライバシーポリシーは透明性確保を目的とするものであり、個別の法的助言に代わるものではありません。",
    },

    // ------------------------- 利用規約 ---------------------------
    terms: {
      slug: "terms",
      title: "利用規約",
      intro:
        "本利用規約は、m-pathy へのアクセスおよび利用条件を定めるものです。本サービスを利用することで、これらの条件に同意したものとみなされます。",
      last_updated: "最終更新日：2026年1月11日",
      sections: [
        {
          id: "scope",
          heading: "1. サービスの範囲",
          body:
            "m-pathy は実験的なAIアシスタントであり、人間の治療者、弁護士、医師、または金融アドバイザーに代わるものではありません。",
        },
        {
          id: "no_advice",
          heading: "2. 専門的助言ではありません",
          body:
            "m-pathy が生成する内容は、医療、法律、金融、その他重大な結果を伴う判断の唯一の根拠として使用してはなりません。",
        },
        {
          id: "modes",
          heading: "3. システムモードによるガバナンス",
          body:
            "m-pathy は自己制御のために内部システムモードを使用します。\n\n" +
            "モードの切り替えはセッション内に限定され、決定論的であり、ユーザープロファイリングには該当しません。",
        },
        {
          id: "liability",
          heading: "4. 責任の制限",
          body:
            "責任は適用法令に基づいて定められます。強行規定による責任は影響を受けません。",
        },
      ],
      disclaimer:
        "本規約は契約関係を整理するためのものであり、法的助言に代わるものではありません。",
    },

    // ------------------------- 返金 -------------------------------
    refund: {
      slug: "refund",
      title: "返金ポリシー",
      intro:
        "本ポリシーは、m-pathy における支払いおよび返金の取り扱いについて説明します。",
      last_updated: "最終更新日：2026年1月11日",
      sections: [
        {
          id: "model",
          heading: "1. 購入モデル",
          body:
            "m-pathy へのアクセスは、一定期間および／または定められたトークン数に対する一回限りの購入により提供されます。",
        },
        {
          id: "withdrawal",
          heading: "2. 取消権",
          body:
            "デジタルサービスに関する法定の取消権は、法律で要求される場合に適用されます。",
        },
        {
          id: "refunds",
          heading: "3. 返金",
          body:
            "返金は、法的義務がある場合、または明示的に約束された場合にのみ行われます。",
        },
      ],
      disclaimer:
        "本ポリシーはいかなる強行的な法的権利も制限するものではありません。",
    },

    // ------------------------- 法律情報 ---------------------------
    legal: {
      slug: "legal",
      title: "法律情報",
      intro:
        "本セクションは、m-pathy に適用される法的枠組みの概要を示します。",
      last_updated: "最終更新日：2026年1月11日",
      sections: [
        {
          id: "jurisdiction",
          heading: "1. 準拠法および管轄",
          body:
            "消費者保護に関する強行規定が別途定める場合を除き、ドイツ法が適用されます。 " +
            "事業者に対しては、ミュンヘンが専属管轄となります。",
        },
      ],
      disclaimer:
        "本情報は透明性確保のために提供されます。強行法規が優先されます。",
    },
},

  // ================================================================
  // 한국어
  // ================================================================
  ko: {
    // ------------------------- 법적 고지 --------------------------
    imprint: {
      slug: "imprint",
      title: "법적 고지",
      intro:
        "본 법적 고지는 독일 법률 및 적용되는 경우 유럽 법률에 따라 m-pathy에 요구되는 제공자 정보를 포함합니다.",
      last_updated: "최종 업데이트: 2026년 1월 11일",
      sections: [
        {
          id: "provider",
          heading: "1. 제공자",
          body:
            "NAAL UG (유한책임회사)\n" +
            "Maria-Theresia-Str. 11\n" +
            "81675 뮌헨\n" +
            "독일\n\n" +
            "이메일: support@m-pathy.ai",
        },
        {
          id: "representative",
          heading: "2. 경영진",
          body: "대표이사: Alexander Khayat.",
        },
        {
          id: "register",
          heading: "3. 상업 등기",
          body:
            "NAAL UG(유한책임회사)는 뮌헨 지방법원(Amtsgericht München) 상업등기부에 HRB 288710 번호로 등록되어 있습니다.",
        },
        {
          id: "vat",
          heading: "4. 부가가치세 식별번호",
          body: "xe",
        },
        {
          id: "contact",
          heading: "5. 연락처",
          body:
            "현재 m-pathy에 가장 빠르게 연락하는 방법은 support@m-pathy.ai 로 이메일을 보내는 것입니다. " +
            "건강 정보나 결제 정보 등 민감한 데이터는 이메일로 보내지 마시기 바랍니다.",
        },
      ],
      disclaimer:
        "본 법적 고지는 정보 제공을 목적으로 하며, 개별적인 법률 자문을 대체하지 않습니다.",
    },

    // ------------------------- 개인정보 보호 ----------------------
    privacy: {
      slug: "privacy",
      title: "개인정보 처리방침",
      intro:
        "본 개인정보 처리방침은 m-pathy 이용 시 개인정보가 어떻게 처리되는지를 명확하게 설명합니다.",
      last_updated: "최종 업데이트: 2026년 1월 11일",
      sections: [
        {
          id: "controller",
          heading: "1. 개인정보 처리 책임자",
          body:
            "m-pathy와 관련된 개인정보 처리 책임자는 다음과 같습니다.\n\n" +
            "NAAL UG (유한책임회사)\n" +
            "Maria-Theresia-Str. 11\n" +
            "81675 뮌헨\n" +
            "독일\n" +
            "이메일: support@m-pathy.ai",
        },
        {
          id: "principles",
          heading: "2. 설계 단계부터의 개인정보 보호",
          body:
            "m-pathy는 Privacy by Design 및 Privacy by Default 원칙을 적용합니다.\n\n" +
            "• 필요한 경우에만 데이터를 처리합니다\n" +
            "• 처리 범위와 기간을 최소화합니다\n" +
            "• 암묵적인 사용자 프로파일을 생성하지 않습니다\n\n" +
            "개인정보 보호는 시스템 아키텍처에 구조적으로 통합되어 있습니다.",
        },
        {
          id: "data_categories",
          heading: "3. 데이터 범주",
          body:
            "이용 방식에 따라 다음과 같은 데이터 범주가 처리될 수 있습니다.\n" +
            "• 계정 및 연락처 데이터(사용자가 자발적으로 제공한 경우)\n" +
            "• 기술적 이용 데이터(보안 및 안정성 목적에 한함)\n" +
            "• 결제 데이터(외부 결제 서비스 제공자를 통해 처리)\n" +
            "• 프롬프트 및 응답 내용(기술적 처리 목적에 한함)\n\n" +
            "프롬프트 내용은 프로파일링, 광고 또는 학습에 사용되지 않습니다.",
        },
        {
          id: "local_processing",
          heading: "4. 로컬 처리",
          body:
            "프롬프트 내용은 로컬 또는 일시적으로 처리되며, 식별 가능하거나 재구성 가능한 형태로 서버에 영구 저장되지 않습니다.",
        },
        {
          id: "archive",
          heading: "5. 로컬 아카이브 및 컨텍스트 주입",
          body:
            "m-pathy는 사용자가 선택한 콘텐츠를 로컬 아카이브에 저장할 수 있도록 합니다.\n\n" +
            "아카이브된 항목은 사용자가 명시적으로 선택한 경우에만 새로운 대화에 주입됩니다.\n\n" +
            "• 전적으로 로컬 저장\n" +
            "• 사용자에 의한 명확한 행위\n" +
            "• 주입된 컨텍스트는 완전히 표시됨\n" +
            "• 자동적이거나 암묵적인 메모리는 존재하지 않음",
        },
        {
          id: "verification",
          heading: "6. 검증 및 Triketon",
          body:
            "뉴스 기사 등의 콘텐츠를 검증할 때 m-pathy는 Triketon을 사용합니다.\n\n" +
            "• 검증 목적에 한해 콘텐츠가 서버로 전송됩니다\n" +
            "• 암호학적 진실 해시가 계산됩니다\n" +
            "• 공개 검증 키가 생성되거나 연결됩니다\n" +
            "• 원본 콘텐츠는 저장되지 않습니다\n" +
            "• 해시, 공개 키 및 최소한의 기술적 메타데이터만 보관됩니다\n\n" +
            "저장된 정보로부터 원본 콘텐츠를 복원할 수 없습니다.",
        },
        {
          id: "prompt_integrity",
          heading: "7. 프롬프트 정규화 및 드리프트 방지",
          body:
            "실행 전에 MAIOS 2.0은 프롬프트를 구조적으로 분석합니다.\n\n" +
            "프롬프트가 모호하거나 일관성이 없거나 드리프트 위험이 있는 경우, 표현이 재구성될 수 있습니다.\n\n" +
            "• 사용자의 의도는 유지됩니다\n" +
            "• 구조 및 안전 명확성만 조정됩니다\n" +
            "• 프롬프트는 저장되지 않습니다\n" +
            "• 학습 또는 프로파일링은 이루어지지 않습니다",
        },
        {
          id: "devices",
          heading: "8. 로컬 저장소 및 기기",
          body:
            "사용자가 생성한 모든 콘텐츠는 사용 중인 기기의 로컬 저장소에만 저장됩니다.\n\n" +
            "• 로컬 저장소는 사용자가 삭제할 때까지 유지됩니다\n" +
            "• 삭제 시 데이터는 복구할 수 없습니다\n" +
            "• 서버 측 백업은 존재하지 않습니다\n\n" +
            "각 기기에는 고유한 공개 키가 부여되며, 데이터는 기기 단위로 엄격히 분리됩니다.",
        },
      ],
      disclaimer:
        "본 개인정보 처리방침은 투명성을 위한 것이며, 개별적인 법률 자문을 대체하지 않습니다.",
    },

    // ------------------------- 이용약관 ---------------------------
    terms: {
      slug: "terms",
      title: "이용약관",
      intro:
        "본 이용약관은 m-pathy의 접근 및 이용 조건을 규정합니다. 서비스를 이용함으로써 귀하는 본 약관에 동의하게 됩니다.",
      last_updated: "최종 업데이트: 2026년 1월 11일",
      sections: [
        {
          id: "scope",
          heading: "1. 서비스 범위",
          body:
            "m-pathy는 실험적인 AI 기반 보조 도구로, 인간 치료사, 변호사, 의사 또는 재무 상담사를 대체하지 않습니다.",
        },
        {
          id: "no_advice",
          heading: "2. 전문적 조언 아님",
          body:
            "m-pathy가 생성한 콘텐츠는 의료, 법률, 재정 또는 기타 중대한 결과를 수반하는 결정의 유일한 근거로 사용되어서는 안 됩니다.",
        },
        {
          id: "modes",
          heading: "3. 시스템 모드 기반 거버넌스",
          body:
            "m-pathy는 시스템 자율 제어를 위해 내부 시스템 모드를 사용합니다.\n\n" +
            "모드 전환은 세션 단위로 제한되며, 결정론적이고 사용자 프로파일링에 해당하지 않습니다.",
        },
        {
          id: "liability",
          heading: "4. 책임의 제한",
          body:
            "책임은 적용 법률에 따라 규율됩니다. 강행 규정에 따른 책임은 영향을 받지 않습니다.",
        },
      ],
      disclaimer:
        "본 약관은 계약 관계를 정리하기 위한 것이며 법률 자문을 대체하지 않습니다.",
    },

    // ------------------------- 환불 -------------------------------
    refund: {
      slug: "refund",
      title: "환불 정책",
      intro:
        "본 정책은 m-pathy에서의 결제 및 환불 처리 방식을 설명합니다.",
      last_updated: "최종 업데이트: 2026년 1월 11일",
      sections: [
        {
          id: "model",
          heading: "1. 구매 모델",
          body:
            "m-pathy에 대한 접근은 정해진 기간 및/또는 정해진 토큰 수량에 대한 일회성 구매를 통해 제공됩니다.",
        },
        {
          id: "withdrawal",
          heading: "2. 철회권",
          body:
            "디지털 서비스에 대한 법정 철회권은 법률에서 요구되는 경우 적용됩니다.",
        },
        {
          id: "refunds",
          heading: "3. 환불",
          body:
            "환불은 법적 의무가 있거나 명시적으로 약속된 경우에만 제공됩니다.",
        },
      ],
      disclaimer:
        "본 정책은 어떠한 강행적인 법적 권리도 제한하지 않습니다.",
    },

    // ------------------------- 법률 정보 --------------------------
    legal: {
      slug: "legal",
      title: "법률 정보",
      intro:
        "본 섹션은 m-pathy에 적용되는 법적 프레임워크를 개괄합니다.",
      last_updated: "최종 업데이트: 2026년 1월 11일",
      sections: [
        {
          id: "jurisdiction",
          heading: "1. 준거법 및 관할",
          body:
            "소비자 보호에 관한 강행 규정이 달리 정하는 경우를 제외하고, 독일 법이 적용됩니다. " +
            "사업자에 대해서는 뮌헨이 전속 관할입니다.",
        },
      ],
      disclaimer:
        "본 정보는 투명성을 위해 제공됩니다. 강행법이 우선 적용됩니다.",
    },
},

  // ================================================================
  // العربية
  // ================================================================
  ar: {
    // ------------------------- البيانات القانونية -----------------
    imprint: {
      slug: "imprint",
      title: "البيانات القانونية",
      intro:
        "تتضمن هذه البيانات القانونية معلومات مزوّد الخدمة المطلوبة لمنصة m-pathy وفقًا للقانون الألماني، وعند الاقتضاء، القانون الأوروبي.",
      last_updated: "آخر تحديث: 11 يناير 2026",
      sections: [
        {
          id: "provider",
          heading: "1. مزوّد الخدمة",
          body:
            "NAAL UG (شركة ذات مسؤولية محدودة)\n" +
            "Maria-Theresia-Str. 11\n" +
            "81675 ميونخ\n" +
            "ألمانيا\n\n" +
            "البريد الإلكتروني: support@m-pathy.ai",
        },
        {
          id: "representative",
          heading: "2. الإدارة",
          body: "المدير التنفيذي: Alexander Khayat.",
        },
        {
          id: "register",
          heading: "3. السجل التجاري",
          body:
            "شركة NAAL UG (شركة ذات مسؤولية محدودة) مسجلة في السجل التجاري لدى محكمة ميونخ المحلية (Amtsgericht München) تحت الرقم HRB 288710.",
        },
        {
          id: "vat",
          heading: "4. رقم التعريف الضريبي (VAT)",
          body: "xe",
        },
        {
          id: "contact",
          heading: "5. معلومات الاتصال",
          body:
            "حاليًا، أسرع طريقة للتواصل مع m-pathy هي عبر البريد الإلكتروني support@m-pathy.ai. " +
            "يرجى عدم إرسال أي بيانات حساسة، ولا سيما البيانات الصحية أو بيانات الدفع، عبر البريد الإلكتروني.",
        },
      ],
      disclaimer:
        "يتم تقديم هذه البيانات القانونية لأغراض الشفافية فقط ولا تُعد بديلاً عن استشارة قانونية فردية.",
    },

    // ------------------------- الخصوصية ----------------------------
    privacy: {
      slug: "privacy",
      title: "سياسة الخصوصية",
      intro:
        "توضح سياسة الخصوصية هذه بطريقة واضحة كيفية معالجة البيانات الشخصية عند استخدام m-pathy.",
      last_updated: "آخر تحديث: 11 يناير 2026",
      sections: [
        {
          id: "controller",
          heading: "1. المسؤول عن معالجة البيانات",
          body:
            "المسؤول عن معالجة البيانات فيما يتعلق بـ m-pathy هو:\n\n" +
            "NAAL UG (شركة ذات مسؤولية محدودة)\n" +
            "Maria-Theresia-Str. 11\n" +
            "81675 ميونخ\n" +
            "ألمانيا\n" +
            "البريد الإلكتروني: support@m-pathy.ai",
        },
        {
          id: "principles",
          heading: "2. حماية البيانات حسب التصميم والإعداد الافتراضي",
          body:
            "تطبق m-pathy مبادئ حماية البيانات حسب التصميم (Privacy by Design) وحماية البيانات حسب الإعداد الافتراضي (Privacy by Default).\n\n" +
            "• تتم معالجة البيانات فقط عند الضرورة\n" +
            "• يتم تقليل نطاق ومدة المعالجة إلى الحد الأدنى\n" +
            "• لا يتم إنشاء ملفات تعريف مستخدم ضمنية\n\n" +
            "حماية البيانات مدمجة هيكليًا في بنية النظام.",
        },
        {
          id: "data_categories",
          heading: "3. فئات البيانات",
          body:
            "اعتمادًا على طريقة الاستخدام، قد تتم معالجة الفئات التالية من البيانات:\n" +
            "• بيانات الحساب وبيانات الاتصال (إذا تم تقديمها طوعًا)،\n" +
            "• بيانات الاستخدام التقنية (لأغراض الأمان والاستقرار فقط)،\n" +
            "• بيانات الدفع (تُعالج عبر مزودي خدمات خارجيين)،\n" +
            "• محتوى الأوامر (prompts) والاستجابات (للمعالجة التقنية فقط).\n\n" +
            "لا يتم استخدام محتوى الأوامر لأغراض التوصيف أو الإعلان أو التدريب.",
        },
        {
          id: "local_processing",
          heading: "4. المعالجة المحلية",
          body:
            "تتم معالجة محتوى الأوامر محليًا أو بشكل مؤقت ولا يتم تخزينه بشكل دائم على الخوادم " +
            "بصيغة قابلة للتعريف أو إعادة البناء.",
        },
        {
          id: "archive",
          heading: "5. الأرشيف المحلي وحقن السياق",
          body:
            "تتيح m-pathy للمستخدمين حفظ محتوى محدد محليًا في أرشيف.\n\n" +
            "يمكن إدخال العناصر المؤرشفة في محادثة جديدة فقط عند اختيارها صراحة من قبل المستخدم.\n\n" +
            "• تخزين محلي حصريًا،\n" +
            "• إجراء صريح من المستخدم،\n" +
            "• السياق المُدخل مرئي بالكامل،\n" +
            "• لا توجد ذاكرة تلقائية أو ضمنية.",
        },
        {
          id: "verification",
          heading: "6. التحقق و Triketon",
          body:
            "عند التحقق من المحتوى (مثل المقالات الإخبارية)، تستخدم m-pathy آلية Triketon.\n\n" +
            "• يتم إرسال المحتوى إلى الخادم لغرض التحقق فقط،\n" +
            "• يتم حساب تجزئة (هاش) مشفرة للحقيقة،\n" +
            "• يتم إنشاء أو ربط مفتاح تحقق عام،\n" +
            "• لا يتم تخزين المحتوى الأصلي،\n" +
            "• يتم الاحتفاظ فقط بالتجزئة والمفتاح العام والحد الأدنى من البيانات التقنية.\n\n" +
            "لا يمكن إعادة بناء المحتوى الأصلي من البيانات المخزنة.",
        },
        {
          id: "prompt_integrity",
          heading: "7. توحيد الأوامر ومنع الانحراف",
          body:
            "قبل التنفيذ، يقوم MAIOS 2.0 بتحليل الأوامر هيكليًا.\n\n" +
            "إذا كان الأمر غامضًا أو غير متسق أو عرضة للانحراف، فقد تتم إعادة صياغته.\n\n" +
            "• يتم الحفاظ على نية المستخدم،\n" +
            "• يتم تعديل البنية ووضوح الأمان فقط،\n" +
            "• لا يتم تخزين الأوامر،\n" +
            "• لا يحدث تعلم أو توصيف للمستخدم.",
        },
        {
          id: "devices",
          heading: "8. التخزين المحلي والأجهزة",
          body:
            "يتم تخزين جميع المحتويات التي ينشئها المستخدم حصريًا في التخزين المحلي للجهاز المستخدم.\n\n" +
            "• يستمر التخزين المحلي حتى يقوم المستخدم بحذفه،\n" +
            "• يؤدي الحذف إلى فقدان البيانات بشكل غير قابل للاسترجاع،\n" +
            "• لا توجد نسخ احتياطية على الخادم.\n\n" +
            "يتم تخصيص مفتاح عام فريد لكل جهاز، وتكون البيانات معزولة حسب الجهاز.",
        },
      ],
      disclaimer:
        "يتم تقديم سياسة الخصوصية هذه لأغراض الشفافية ولا تُعد بديلاً عن استشارة قانونية فردية.",
    },

    // ------------------------- شروط الاستخدام ---------------------
    terms: {
      slug: "terms",
      title: "شروط الاستخدام",
      intro:
        "تنظم شروط الاستخدام هذه الوصول إلى m-pathy واستخدامه. باستخدام الخدمة، يوافق المستخدم على هذه الشروط.",
      last_updated: "آخر تحديث: 11 يناير 2026",
      sections: [
        {
          id: "scope",
          heading: "1. نطاق الخدمة",
          body:
            "m-pathy هو مساعد تجريبي قائم على الذكاء الاصطناعي ولا يُعد بديلاً عن معالج أو محامٍ أو طبيب أو مستشار مالي بشري.",
        },
        {
          id: "no_advice",
          heading: "2. عدم تقديم استشارة مهنية",
          body:
            "لا يجوز استخدام المحتوى الذي يولده m-pathy كأساس وحيد لاتخاذ قرارات طبية أو قانونية أو مالية أو غيرها من القرارات ذات العواقب الجسيمة.",
        },
        {
          id: "modes",
          heading: "3. الحوكمة عبر أوضاع النظام",
          body:
            "تستخدم m-pathy أوضاع نظام داخلية للتحكم الذاتي.\n\n" +
            "تكون تغييرات الأوضاع مقيدة بالجلسة، وحتمية، ولا تشكل توصيفًا للمستخدم.",
        },
        {
          id: "liability",
          heading: "4. تحديد المسؤولية",
          body:
            "تخضع المسؤولية لأحكام القانون المعمول به. ولا تتأثر أحكام المسؤولية الإلزامية.",
        },
      ],
      disclaimer:
        "تهدف هذه الشروط إلى تنظيم العلاقة التعاقدية ولا تحل محل الاستشارة القانونية.",
    },

    // ------------------------- سياسة الاسترداد -------------------
    refund: {
      slug: "refund",
      title: "سياسة الاسترداد",
      intro:
        "توضح هذه السياسة كيفية التعامل مع المدفوعات وعمليات الاسترداد في m-pathy.",
      last_updated: "آخر تحديث: 11 يناير 2026",
      sections: [
        {
          id: "model",
          heading: "1. نموذج الشراء",
          body:
            "يتم منح الوصول إلى m-pathy من خلال عملية شراء لمرة واحدة لفترة محددة و/أو عدد محدد من الرموز.",
        },
        {
          id: "withdrawal",
          heading: "2. حق العدول",
          body:
            "تُطبق حقوق العدول القانونية الخاصة بالخدمات الرقمية عندما يفرضها القانون.",
        },
        {
          id: "refunds",
          heading: "3. الاسترداد",
          body:
            "يتم تقديم الاسترداد فقط في حال وجود التزام قانوني أو وعد صريح بذلك.",
        },
      ],
      disclaimer:
        "لا تحد هذه السياسة من أي حقوق قانونية إلزامية.",
    },

    // ------------------------- معلومات قانونية -------------------
    legal: {
      slug: "legal",
      title: "معلومات قانونية",
      intro:
        "يوفر هذا القسم نظرة عامة على الإطار القانوني المطبق على m-pathy.",
      last_updated: "آخر تحديث: 11 يناير 2026",
      sections: [
        {
          id: "jurisdiction",
          heading: "1. القانون الواجب التطبيق والاختصاص القضائي",
          body:
            "ما لم تنص قواعد حماية المستهلك الإلزامية على خلاف ذلك، يخضع هذا النظام للقانون الألماني. " +
            "وبالنسبة للمستخدمين التجاريين، يكون الاختصاص القضائي الحصري في مدينة ميونخ.",
        },
      ],
      disclaimer:
        "يتم تقديم هذه المعلومات لأغراض الشفافية. وتعلو القواعد القانونية الإلزامية.",
    },

},
  // ================================================================
  // हिन्दी
  // ================================================================
  hi: {
    // ------------------------- कानूनी सूचना -----------------------
    imprint: {
      slug: "imprint",
      title: "कानूनी सूचना",
      intro:
        "यह कानूनी सूचना m-pathy के लिए जर्मन क़ानून तथा जहाँ लागू हो वहाँ यूरोपीय क़ानून के अंतर्गत आवश्यक प्रदाता जानकारी प्रदान करती है।",
      last_updated: "अंतिम अद्यतन: 11 जनवरी 2026",
      sections: [
        {
          id: "provider",
          heading: "1. प्रदाता",
          body:
            "NAAL UG (सीमित दायित्व कंपनी)\n" +
            "Maria-Theresia-Str. 11\n" +
            "81675 म्यूनिख\n" +
            "जर्मनी\n\n" +
            "ई-मेल: support@m-pathy.ai",
        },
        {
          id: "representative",
          heading: "2. प्रबंधन",
          body: "प्रबंध निदेशक: Alexander Khayat।",
        },
        {
          id: "register",
          heading: "3. वाणिज्यिक पंजीकरण",
          body:
            "NAAL UG (सीमित दायित्व कंपनी) म्यूनिख की स्थानीय अदालत (Amtsgericht München) के वाणिज्यिक रजिस्टर में HRB 288710 के अंतर्गत पंजीकृत है।",
        },
        {
          id: "vat",
          heading: "4. वैट पहचान संख्या",
          body: "xe",
        },
        {
          id: "contact",
          heading: "5. संपर्क",
          body:
            "वर्तमान में m-pathy से संपर्क करने का सबसे तेज़ तरीका ई-मेल support@m-pathy.ai है। " +
            "कृपया ई-मेल के माध्यम से कोई भी संवेदनशील डेटा, विशेष रूप से स्वास्थ्य या भुगतान संबंधी जानकारी, न भेजें।",
        },
      ],
      disclaimer:
        "यह कानूनी सूचना केवल जानकारी के उद्देश्य से प्रदान की गई है और व्यक्तिगत कानूनी परामर्श का स्थान नहीं लेती।",
    },

    // ------------------------- गोपनीयता ---------------------------
    privacy: {
      slug: "privacy",
      title: "गोपनीयता नीति",
      intro:
        "यह गोपनीयता नीति स्पष्ट रूप से बताती है कि m-pathy का उपयोग करते समय व्यक्तिगत डेटा कैसे संसाधित किया जाता है।",
      last_updated: "अंतिम अद्यतन: 11 जनवरी 2026",
      sections: [
        {
          id: "controller",
          heading: "1. डेटा नियंत्रक",
          body:
            "m-pathy से संबंधित डेटा प्रसंस्करण के लिए उत्तरदायी संस्था है:\n\n" +
            "NAAL UG (सीमित दायित्व कंपनी)\n" +
            "Maria-Theresia-Str. 11\n" +
            "81675 म्यूनिख\n" +
            "जर्मनी\n" +
            "ई-मेल: support@m-pathy.ai",
        },
        {
          id: "principles",
          heading: "2. डिज़ाइन और डिफ़ॉल्ट द्वारा गोपनीयता",
          body:
            "m-pathy Privacy by Design और Privacy by Default के सिद्धांतों का पालन करता है।\n\n" +
            "• डेटा केवल आवश्यकता होने पर ही संसाधित किया जाता है\n" +
            "• प्रसंस्करण का दायरा और अवधि न्यूनतम रखी जाती है\n" +
            "• कोई निहित उपयोगकर्ता प्रोफ़ाइल नहीं बनाई जाती\n\n" +
            "गोपनीयता सुरक्षा सिस्टम की संरचना में अंतर्निहित है।",
        },
        {
          id: "data_categories",
          heading: "3. डेटा की श्रेणियाँ",
          body:
            "उपयोग के आधार पर निम्नलिखित डेटा श्रेणियाँ शामिल हो सकती हैं:\n" +
            "• खाता और संपर्क डेटा (यदि स्वेच्छा से प्रदान किया गया हो),\n" +
            "• तकनीकी उपयोग डेटा (केवल सुरक्षा और स्थिरता के लिए),\n" +
            "• भुगतान डेटा (बाहरी सेवा प्रदाताओं के माध्यम से),\n" +
            "• प्रॉम्प्ट और उत्तर की सामग्री (केवल तकनीकी प्रसंस्करण के लिए)।\n\n" +
            "प्रॉम्प्ट की सामग्री का उपयोग प्रोफाइलिंग, विज्ञापन या प्रशिक्षण के लिए नहीं किया जाता।",
        },
        {
          id: "local_processing",
          heading: "4. स्थानीय प्रसंस्करण",
          body:
            "प्रॉम्प्ट की सामग्री को स्थानीय रूप से या अस्थायी रूप से संसाधित किया जाता है और " +
            "इसे पहचान योग्य या पुनर्निर्माण योग्य रूप में सर्वरों पर स्थायी रूप से संग्रहीत नहीं किया जाता।",
        },
        {
          id: "archive",
          heading: "5. स्थानीय अभिलेख और संदर्भ इंजेक्शन",
          body:
            "m-pathy उपयोगकर्ताओं को चयनित सामग्री को स्थानीय रूप से एक अभिलेख में संग्रहीत करने की अनुमति देता है।\n\n" +
            "अभिलेखित सामग्री को केवल उपयोगकर्ता की स्पष्ट सहमति से ही नए चैट में जोड़ा जा सकता है।\n\n" +
            "• केवल स्थानीय संग्रहण,\n" +
            "• उपयोगकर्ता की स्पष्ट कार्रवाई,\n" +
            "• जोड़ा गया संदर्भ पूरी तरह दृश्य,\n" +
            "• कोई स्वचालित या निहित मेमोरी नहीं।",
        },
        {
          id: "verification",
          heading: "6. सत्यापन और Triketon",
          body:
            "सामग्री (जैसे समाचार लेख) के सत्यापन के लिए m-pathy Triketon का उपयोग करता है।\n\n" +
            "• सामग्री केवल सत्यापन के उद्देश्य से सर्वर पर भेजी जाती है,\n" +
            "• एक क्रिप्टोग्राफ़िक सत्य हैश की गणना की जाती है,\n" +
            "• एक सार्वजनिक सत्यापन कुंजी उत्पन्न या संबद्ध की जाती है,\n" +
            "• मूल सामग्री संग्रहीत नहीं की जाती,\n" +
            "• केवल हैश, सार्वजनिक कुंजी और न्यूनतम तकनीकी मेटाडेटा रखा जाता है।\n\n" +
            "संग्रहीत डेटा से मूल सामग्री को पुनर्निर्मित नहीं किया जा सकता।",
        },
        {
          id: "prompt_integrity",
          heading: "7. प्रॉम्प्ट सामान्यीकरण और ड्रिफ्ट रोकथाम",
          body:
            "निष्पादन से पहले, MAIOS 2.0 प्रॉम्प्ट का संरचनात्मक विश्लेषण करता है।\n\n" +
            "यदि कोई प्रॉम्प्ट अस्पष्ट, असंगत या ड्रिफ्ट-संभावित है, तो उसकी अभिव्यक्ति को पुनर्गठित किया जा सकता है।\n\n" +
            "• उपयोगकर्ता की मंशा सुरक्षित रहती है,\n" +
            "• केवल संरचना और सुरक्षा स्पष्टता समायोजित की जाती है,\n" +
            "• कोई प्रॉम्प्ट संग्रहीत नहीं होता,\n" +
            "• कोई सीखने या प्रोफाइलिंग नहीं होती।",
        },
        {
          id: "devices",
          heading: "8. स्थानीय संग्रहण और डिवाइस",
          body:
            "उपयोगकर्ता द्वारा बनाई गई सभी सामग्री केवल उपयोग किए गए डिवाइस के स्थानीय संग्रहण में रखी जाती है।\n\n" +
            "• स्थानीय संग्रहण तब तक रहता है जब तक उपयोगकर्ता इसे हटाता नहीं,\n" +
            "• हटाने पर डेटा स्थायी रूप से नष्ट हो जाता है,\n" +
            "• सर्वर-साइड बैकअप उपलब्ध नहीं हैं।\n\n" +
            "प्रत्येक डिवाइस को एक विशिष्ट सार्वजनिक कुंजी दी जाती है और डेटा डिवाइस-स्तर पर अलग रहता है।",
        },
      ],
      disclaimer:
        "यह गोपनीयता नीति पारदर्शिता के लिए प्रदान की गई है और व्यक्तिगत कानूनी सलाह का स्थान नहीं लेती।",
    },

    // ------------------------- उपयोग की शर्तें --------------------
    terms: {
      slug: "terms",
      title: "उपयोग की शर्तें",
      intro:
        "ये उपयोग की शर्तें m-pathy तक पहुँच और उसके उपयोग को नियंत्रित करती हैं। सेवा का उपयोग करके आप इन शर्तों से सहमत होते हैं।",
      last_updated: "अंतिम अद्यतन: 11 जनवरी 2026",
      sections: [
        {
          id: "scope",
          heading: "1. सेवा का दायरा",
          body:
            "m-pathy एक प्रायोगिक AI-आधारित सहायक है और किसी मानव चिकित्सक, वकील, डॉक्टर या वित्तीय सलाहकार का विकल्प नहीं है।",
        },
        {
          id: "no_advice",
          heading: "2. पेशेवर सलाह नहीं",
          body:
            "m-pathy द्वारा उत्पन्न सामग्री का उपयोग चिकित्सा, कानूनी, वित्तीय या अन्य गंभीर परिणाम वाले निर्णयों के लिए एकमात्र आधार के रूप में नहीं किया जाना चाहिए।",
        },
        {
          id: "modes",
          heading: "3. सिस्टम मोड द्वारा शासन",
          body:
            "m-pathy स्व-नियंत्रण के लिए आंतरिक सिस्टम मोड का उपयोग करता है।\n\n" +
            "मोड परिवर्तन सत्र-सीमित, निर्धारक हैं और उपयोगकर्ता प्रोफाइलिंग का गठन नहीं करते।",
        },
        {
          id: "liability",
          heading: "4. दायित्व की सीमा",
          body:
            "दायित्व लागू क़ानून के अनुसार निर्धारित किया जाता है। अनिवार्य दायित्व प्रावधान अप्रभावित रहते हैं।",
        },
      ],
      disclaimer:
        "ये शर्तें संविदात्मक संबंध को संरचित करती हैं और कानूनी परामर्श का स्थान नहीं लेतीं।",
    },

    // ------------------------- धनवापसी ----------------------------
    refund: {
      slug: "refund",
      title: "धनवापसी नीति",
      intro:
        "यह नीति m-pathy में भुगतान और धनवापसी की प्रक्रिया का वर्णन करती है।",
      last_updated: "अंतिम अद्यतन: 11 जनवरी 2026",
      sections: [
        {
          id: "model",
          heading: "1. खरीद मॉडल",
          body:
            "m-pathy तक पहुँच एक बार की खरीद के माध्यम से दी जाती है, जो निर्धारित अवधि और/या निर्धारित टोकन मात्रा के लिए होती है।",
        },
        {
          id: "withdrawal",
          heading: "2. वापसी का अधिकार",
          body:
            "डिजिटल सेवाओं के लिए लागू वैधानिक वापसी अधिकार क़ानून द्वारा आवश्यक होने पर लागू होते हैं।",
        },
        {
          id: "refunds",
          heading: "3. धनवापसी",
          body:
            "धनवापसी केवल तभी दी जाती है जब कोई कानूनी दायित्व हो या स्पष्ट रूप से वादा किया गया हो।",
        },
      ],
      disclaimer:
        "यह नीति किसी भी अनिवार्य वैधानिक अधिकार को सीमित नहीं करती।",
    },

    // ------------------------- कानूनी -----------------------------
    legal: {
      slug: "legal",
      title: "कानूनी जानकारी",
      intro:
        "यह अनुभाग m-pathy पर लागू कानूनी ढाँचे का संक्षिप्त विवरण प्रदान करता है।",
      last_updated: "अंतिम अद्यतन: 11 जनवरी 2026",
      sections: [
        {
          id: "jurisdiction",
          heading: "1. लागू क़ानून और क्षेत्राधिकार",
          body:
            "जब तक उपभोक्ता संरक्षण से संबंधित अनिवार्य प्रावधान अन्यथा न हों, जर्मन क़ानून लागू होगा। " +
            "व्यावसायिक उपयोगकर्ताओं के लिए म्यूनिख अनन्य क्षेत्राधिकार है।",
        },
      ],
      disclaimer:
        "यह जानकारी पारदर्शिता के उद्देश्य से प्रदान की गई है। अनिवार्य क़ानून को प्राथमिकता प्राप्त है।",
    },

},


};
