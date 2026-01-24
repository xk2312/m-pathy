/* ======================================================================
   FILE INDEX - lib/i18n.archive.ts
   ======================================================================

   ROLLE DER DATEI
   ----------------------------------------------------------------------
   Zentrale i18n-Definitionsdatei für alle ARCHIVE-bezogenen UI-Texte.
   Sie stellt:
   - Labels
   - Platzhalter
   - Statusmeldungen
   - Modus-Titel
   - Report-Texte
   in 13 Sprachen bereit.

   Diese Datei:
   - enthält KEINE Logik
   - enthält KEINE Bedingungen
   - enthält KEIN State
   - ist reine Konfigurations- und Textquelle

   ----------------------------------------------------------------------
   STRUKTUR (TOP-LEVEL)
   ----------------------------------------------------------------------
   export const i18nArchive = {
     <languageCode>: {
       archive: { … }
       operators: { … }
       overlay: { … }
       intro: { … }
       report: { … }
       system: { … }
       tapToOpen: string
     }
   }

   Unterstützte Sprachen:
   en, de, fr, es, it, pt, nl, ru, zh, ja, ko, ar, hi

   ----------------------------------------------------------------------
   ARCHIVE-BEREICH
   ----------------------------------------------------------------------
   archive:
     - title
     - searchPlaceholder
     - noResults
     - empty
     - loading
     - viewMessage
     - viewChat
     - add
     - startChat
     - verify
     - chatNumber
     - messageReference
     - totalMessages
     - keywords
     - summarize
     - loadSelection
     - clearSelection
     - defaultHeader

   Zusätzlich (nur EN):
     archive.modes:
       - chat
       - reports

   ----------------------------------------------------------------------
   OPERATORS (SEARCH)
   ----------------------------------------------------------------------
   operators:
     - and
     - or
     - not
     - phrase

   Wird für die intelligente Suchsyntax im Archive verwendet.

   ----------------------------------------------------------------------
   OVERLAY-BEREICH
   ----------------------------------------------------------------------
   overlay:
     - header
     - verifyChat
     - downloadReport
     - uploadReport
     - preparing
     - success
     - fail
     - cancelled
     - loading
     - close

   Verwendung:
   - Verify-Flow
   - Report-Erstellung
   - Statusanzeigen

   ----------------------------------------------------------------------
   INTRO-BEREICH (CONTEXT INJECTION)
   ----------------------------------------------------------------------
   intro:
     - header
     - subtext
     - continue

   Wird nach dem Laden von Kontext aus dem Archive angezeigt.

   ----------------------------------------------------------------------
   REPORT-BEREICH (KERNRELEVANZ)
   ----------------------------------------------------------------------
   report:
     - title
     - subtitle
     - upload
     - uploadSuccess
     - view
     - verifySignature
     - reverify
     - missingSignature
     - noReports
     - valid
     - invalid

   WICHTIG:
   - 'noReports' ist ein reiner Text
   - KEINE Bedingung
   - KEINE Logik
   - Die Entscheidung, ob dieser Text angezeigt wird,
     liegt vollständig in den React-Komponenten (z. B. ReportList).

   ----------------------------------------------------------------------
   ERWEITERTE REPORT-STRUKTUR (EN + DE)
   ----------------------------------------------------------------------
   report.sections:
     - summary
     - proof
     - content
     - metadata

   report.summary:
     - status
     - verifiedAt
     - pairCount
     - source
     - publicKey

   report.proof:
     - truthHash
     - hashProfile
     - keyProfile
     - protocolVersion
     - timestamp

   report.content:
     - title
     - description
     - user
     - assistant

   report.explanations:
     - localOnly
     - reproducible

   ----------------------------------------------------------------------
   SYSTEM-BEREICH
   ----------------------------------------------------------------------
   system:
     - errorGeneric
     - errorLoad
     - errorSave
     - successSave
     - loading
     - empty

   Allgemeine Status- und Fehlermeldungen für Archive/Reports.

   ----------------------------------------------------------------------
   RELEVANZ FÜR REPORTS-PROBLEM
   ----------------------------------------------------------------------
   - Diese Datei entscheidet NICHT:
       ❌ ob Reports existieren
       ❌ ob Reports geladen werden
       ❌ ob Reports gerendert werden
   - Sie liefert ausschließlich die Texte,
     die angezeigt werden, WENN eine UI-Komponente
     sich für einen bestimmten Zustand entscheidet.

   ----------------------------------------------------------------------
   AUSSCHLUSS
   ----------------------------------------------------------------------
   ❌ Keine Storage-Keys
   ❌ Kein Zugriff auf LocalStorage
   ❌ Kein Event-Handling
   ❌ Kein Mode-Switch
   ❌ Kein Einfluss auf Datenfluss

   ====================================================================== */


export const i18nArchive = {
  en: {
    archive: {
title: "Archive",
introText: "Browse, review, and select past conversations.",
  searchPlaceholder: "Search archive…",
  noResults: "No matches.",
  empty: "No saved chats yet.",
  loading: "Loading archive…",
  viewMessage: "Open message",
  viewChat: "Open chat",
  back: "Back",
  add: "Add",
  startChat: "New chat",
  verify: "Verify",
  chatNumber: "Chat {{chatNumber}}",
  messageReference: 'Message reference',
  totalMessages: "{{count}} msgs",
  keywords: "Keywords",
  summarize: "Summarize",
  loadSelection: "Load selection",
  clearSelection: "Clear",
  defaultHeader: "Recent chats",

  selectionStatus: "{{count}} message pairs selected",
  addToChat: "Add {{count}}/4 to new chat",
  tooMany: "Too many to add",
  searchUserChats: "Search your chats…",

  modes: {
    chat: "Chat",
    reports: "Reports"
  }
}
,
    operators: {
  and: "AND",
  or: "OR",
  not: "NOT",
  phrase: "Phrase"
},
overlay: {
  header: "Chat {{chatNumber}}",
  verifyChat: "Verify chat",
  downloadReport: "Download report",
  uploadReport: "Upload report",
  preparing: "Preparing report…",
  success: "Verified ✓",
  fail: "Verify ✗",
  cancelled: "Verification cancelled.",
  loading: "Verifying…",
  close: "Close"
},

intro: {
  header: "Context uploaded",
  subtext: "From archive:",
  continue: "Continue"
},

report: {
  title: "Reports",
  subtitle: "Local verified reports.",
  upload: "Upload",
  uploadSuccess: "Report uploaded ✓",
  view: "Open",
  verifySignature: "Verify sign.",
  reverify: "Re-verify",
  missingSignature: "No signature found.",
  noReports: "No reports.",
  valid: "✅ Valid",
  invalid: "⚠️ Invalid",
  statusVerified: "Verified",
lastVerified: "Last verified",
messagePairs: "{{count}} message pairs",
source: "Source",
sourceArchiveSelection: "Archive selection",
export: "Export report",
close: "Close",


  // ─────────────────────────────
  // NEW - Report structure & content
  // ─────────────────────────────

  sections: {
    summary: "Summary",
    proof: "Verification proof",
    content: "Verified content",
    metadata: "Metadata"
  },

  summary: {
    status: "Status",
    verifiedAt: "Verified at",
    pairCount: "Verified message pairs",
    source: "Source",
    publicKey: "Public key"
  },

  proof: {
    truthHash: "Truth hash",
    hashProfile: "Hash profile",
    keyProfile: "Key profile",
    protocolVersion: "Protocol version",
    timestamp: "Seal timestamp"
  },

  content: {
    title: "Verified content",
    description: "This content was used to generate the verification hash.",
    user: "User",
    assistant: "Assistant"
  },

  explanations: {
    localOnly: "This report is stored locally on your device.",
    reproducible: "Anyone can re-verify this report using its content and proof."
  }
},

system: {
  errorGeneric: "Error.",
  errorLoad: "Failed to load archive data.",
  errorSave: "Could not save changes.",
  successSave: "Saved ✓",
  loading: "Loading…",
  empty: "Nothing here yet.",

  noSelectionToVerify: "No selection to verify.",
  nothingToVerify: "Nothing to verify.",
  serverSealFailed: "Server seal failed.",
  unexpectedResponse: "Unexpected server response.",
  alreadyVerified:
    "The text has already been verified and the report already exists in the Reports section."
}
,

tapToOpen: "Tap to open"

  },

 de: {
  archive: {
    title: "Archiv",
    introText: "Durchsuchen, prüfen und wählen Sie frühere Unterhaltungen aus.",
    searchPlaceholder: "Archiv durchsuchen…",
    noResults: "Keine Treffer.",
    empty: "Noch keine gespeicherten Chats.",
    loading: "Archiv wird geladen…",
    viewMessage: "Nachricht öffnen",
    viewChat: "Chat öffnen",
    back: "Zurück",
    add: "Hinzufügen",
    startChat: "Neuer Chat",
    verify: "Prüfen",
    chatNumber: "Chat {{chatNumber}}",
    messageReference: "Nachrichtenreferenz",
    totalMessages: "{{count}} Nachrichten",
    keywords: "Schlüsselwörter",
    summarize: "Zusammenfassen",
    loadSelection: "Auswahl laden",
    clearSelection: "Leeren",
    defaultHeader: "Letzte Chats",
    selectionStatus: "{{count}} Nachrichtenpaare ausgewählt",
    addToChat: "{{count}}/4 zu neuem Chat hinzufügen",
    tooMany: "Zu viele zum Hinzufügen",
    searchUserChats: "Chats durchsuchen…",
    modes: {
      chat: "Chat",
      reports: "Berichte"
    }
  },

  operators: {
    and: "UND",
    or: "ODER",
    not: "NICHT",
    phrase: "Phrase"
  },

  overlay: {
    header: "Chat {{chatNumber}}",
    verifyChat: "Chat prüfen",
    downloadReport: "Bericht herunterladen",
    uploadReport: "Bericht hochladen",
    preparing: "Bericht wird vorbereitet…",
    success: "Verifiziert ✓",
    fail: "Fehler ✗",
    cancelled: "Überprüfung abgebrochen.",
    loading: "Überprüfung läuft…",
    close: "Schließen"
  },

  intro: {
    header: "Kontext geladen",
    subtext: "Aus Archiv:",
    continue: "Weiter"
  },

  report: {
    title: "Berichte",
    subtitle: "Lokal verifizierte Berichte.",
    upload: "Hochladen",
    uploadSuccess: "Bericht hochgeladen ✓",
    view: "Öffnen",
    verifySignature: "Signatur prüfen",
    reverify: "Erneut prüfen",
    missingSignature: "Keine Signatur gefunden.",
    noReports: "Keine Berichte.",
    valid: "✅ Gültig",
    invalid: "⚠️ Ungültig",
    statusVerified: "Verifiziert",
    lastVerified: "Zuletzt verifiziert",
    messagePairs: "{{count}} Nachrichtenpaare",
    source: "Quelle",
    sourceArchiveSelection: "Archiv-Auswahl",
    export: "Bericht exportieren",
    close: "Schließen",

    sections: {
      summary: "Zusammenfassung",
      proof: "Verifikationsnachweis",
      content: "Verifizierter Inhalt",
      metadata: "Metadaten"
    },

    summary: {
      status: "Status",
      verifiedAt: "Verifiziert am",
      pairCount: "Verifizierte Nachrichtenpaare",
      source: "Quelle",
      publicKey: "Öffentlicher Schlüssel"
    },

    proof: {
      truthHash: "Truth-Hash",
      hashProfile: "Hash-Profil",
      keyProfile: "Schlüssel-Profil",
      protocolVersion: "Protokollversion",
      timestamp: "Zeitpunkt der Versiegelung"
    },

    content: {
      title: "Verifizierter Inhalt",
      description: "Dieser Inhalt wurde zur Erzeugung des Verifikations-Hashs verwendet.",
      user: "Nutzer",
      assistant: "Assistent"
    },

    explanations: {
      localOnly: "Dieser Bericht wird ausschließlich lokal auf Ihrem Gerät gespeichert.",
      reproducible: "Jede Person kann diesen Bericht anhand von Inhalt und Nachweis erneut verifizieren."
    }
  },

  system: {
    errorGeneric: "Fehler.",
    errorLoad: "Archiv konnte nicht geladen werden.",
    errorSave: "Änderungen konnten nicht gespeichert werden.",
    successSave: "Gespeichert ✓",
    loading: "Lädt…",
    empty: "Noch nichts hier.",
    noSelectionToVerify: "Keine Auswahl zum Verifizieren.",
    nothingToVerify: "Nichts zu verifizieren.",
    serverSealFailed: "Server-Versiegelung fehlgeschlagen.",
    unexpectedResponse: "Unerwartete Serverantwort.",
    alreadyVerified:
      "Der Text wurde bereits verifiziert und der Bericht existiert bereits im Bereich Berichte."
  },

  tapToOpen: "Tippen zum Öffnen"
},


  fr: {
  archive: {
    title: "Archive",
    introText: "Parcourez, examinez et sélectionnez des conversations précédentes.",
    searchPlaceholder: "Rechercher dans l’archive…",
    noResults: "Aucun résultat.",
    empty: "Aucune conversation enregistrée pour le moment.",
    loading: "Chargement de l’archive…",
    viewMessage: "Ouvrir le message",
    viewChat: "Ouvrir le chat",
    back: "Retour",
    add: "Ajouter",
    startChat: "Nouveau chat",
    verify: "Vérifier",
    chatNumber: "Chat {{chatNumber}}",
    messageReference: "Référence du message",
    totalMessages: "{{count}} messages",
    keywords: "Mots-clés",
    summarize: "Résumer",
    loadSelection: "Charger la sélection",
    clearSelection: "Effacer",
    defaultHeader: "Chats récents",
    selectionStatus: "{{count}} paires de messages sélectionnées",
    addToChat: "Ajouter {{count}}/4 à un nouveau chat",
    tooMany: "Trop d’éléments à ajouter",
    searchUserChats: "Rechercher dans vos chats…",
    modes: {
      chat: "Chat",
      reports: "Rapports"
    }
  },

  operators: {
    and: "ET",
    or: "OU",
    not: "NON",
    phrase: "Phrase"
  },

  overlay: {
    header: "Chat {{chatNumber}}",
    verifyChat: "Vérifier le chat",
    downloadReport: "Télécharger le rapport",
    uploadReport: "Téléverser le rapport",
    preparing: "Préparation du rapport…",
    success: "Vérifié ✓",
    fail: "Échec ✗",
    cancelled: "Vérification annulée.",
    loading: "Vérification en cours…",
    close: "Fermer"
  },

  intro: {
    header: "Contexte chargé",
    subtext: "Depuis l’archive :",
    continue: "Continuer"
  },

  report: {
    title: "Rapports",
    subtitle: "Rapports vérifiés localement.",
    upload: "Téléverser",
    uploadSuccess: "Rapport téléversé ✓",
    view: "Ouvrir",
    verifySignature: "Vérifier la signature",
    reverify: "Vérifier à nouveau",
    missingSignature: "Aucune signature trouvée.",
    noReports: "Aucun rapport.",
    valid: "✅ Valide",
    invalid: "⚠️ Invalide",
    statusVerified: "Vérifié",
    lastVerified: "Dernière vérification",
    messagePairs: "{{count}} paires de messages",
    source: "Source",
    sourceArchiveSelection: "Sélection d’archive",
    export: "Exporter le rapport",
    close: "Fermer",

    sections: {
      summary: "Résumé",
      proof: "Preuve de vérification",
      content: "Contenu vérifié",
      metadata: "Métadonnées"
    },

    summary: {
      status: "Statut",
      verifiedAt: "Vérifié le",
      pairCount: "Paires de messages vérifiées",
      source: "Source",
      publicKey: "Clé publique"
    },

    proof: {
      truthHash: "Hash de vérité",
      hashProfile: "Profil de hash",
      keyProfile: "Profil de clé",
      protocolVersion: "Version du protocole",
      timestamp: "Horodatage du scellement"
    },

    content: {
      title: "Contenu vérifié",
      description: "Ce contenu a été utilisé pour générer le hash de vérification.",
      user: "Utilisateur",
      assistant: "Assistant"
    },

    explanations: {
      localOnly: "Ce rapport est stocké uniquement sur votre appareil.",
      reproducible: "Toute personne peut revérifier ce rapport à partir de son contenu et de sa preuve."
    }
  },

  system: {
    errorGeneric: "Erreur.",
    errorLoad: "Impossible de charger l’archive.",
    errorSave: "Impossible d’enregistrer les modifications.",
    successSave: "Enregistré ✓",
    loading: "Chargement…",
    empty: "Rien ici pour le moment.",
    noSelectionToVerify: "Aucune sélection à vérifier.",
    nothingToVerify: "Rien à vérifier.",
    serverSealFailed: "Échec du scellement serveur.",
    unexpectedResponse: "Réponse serveur inattendue.",
    alreadyVerified:
      "Le texte a déjà été vérifié et le rapport existe déjà dans la section Rapports."
  },

  tapToOpen: "Appuyer pour ouvrir"
},


  es: {
  archive: {
    title: "Archivo",
    introText: "Examine, verifique y seleccione conversaciones anteriores.",
    searchPlaceholder: "Buscar en el archivo…",
    noResults: "Sin resultados.",
    empty: "Aún no hay chats guardados.",
    loading: "Cargando archivo…",
    viewMessage: "Abrir mensaje",
    viewChat: "Abrir chat",
    back: "Atrás",
    add: "Añadir",
    startChat: "Nuevo chat",
    verify: "Verificar",
    chatNumber: "Chat {{chatNumber}}",
    messageReference: "Referencia del mensaje",
    totalMessages: "{{count}} mensajes",
    keywords: "Palabras clave",
    summarize: "Resumir",
    loadSelection: "Cargar selección",
    clearSelection: "Limpiar",
    defaultHeader: "Chats recientes",
    selectionStatus: "{{count}} pares de mensajes seleccionados",
    addToChat: "Añadir {{count}}/4 a un nuevo chat",
    tooMany: "Demasiados para añadir",
    searchUserChats: "Buscar en sus chats…",
    modes: {
      chat: "Chat",
      reports: "Informes"
    }
  },

  operators: {
    and: "Y",
    or: "O",
    not: "NO",
    phrase: "Frase"
  },

  overlay: {
    header: "Chat {{chatNumber}}",
    verifyChat: "Verificar chat",
    downloadReport: "Descargar informe",
    uploadReport: "Subir informe",
    preparing: "Preparando informe…",
    success: "Verificado ✓",
    fail: "Error ✗",
    cancelled: "Verificación cancelada.",
    loading: "Verificando…",
    close: "Cerrar"
  },

  intro: {
    header: "Contexto cargado",
    subtext: "Desde el archivo:",
    continue: "Continuar"
  },

  report: {
    title: "Informes",
    subtitle: "Informes verificados localmente.",
    upload: "Subir",
    uploadSuccess: "Informe subido ✓",
    view: "Abrir",
    verifySignature: "Verificar firma",
    reverify: "Verificar de nuevo",
    missingSignature: "No se encontró firma.",
    noReports: "Sin informes.",
    valid: "✅ Válido",
    invalid: "⚠️ No válido",
    statusVerified: "Verificado",
    lastVerified: "Última verificación",
    messagePairs: "{{count}} pares de mensajes",
    source: "Fuente",
    sourceArchiveSelection: "Selección del archivo",
    export: "Exportar informe",
    close: "Cerrar",

    sections: {
      summary: "Resumen",
      proof: "Prueba de verificación",
      content: "Contenido verificado",
      metadata: "Metadatos"
    },

    summary: {
      status: "Estado",
      verifiedAt: "Verificado el",
      pairCount: "Pares de mensajes verificados",
      source: "Fuente",
      publicKey: "Clave pública"
    },

    proof: {
      truthHash: "Hash de verdad",
      hashProfile: "Perfil de hash",
      keyProfile: "Perfil de clave",
      protocolVersion: "Versión del protocolo",
      timestamp: "Marca de tiempo del sello"
    },

    content: {
      title: "Contenido verificado",
      description: "Este contenido se utilizó para generar el hash de verificación.",
      user: "Usuario",
      assistant: "Asistente"
    },

    explanations: {
      localOnly: "Este informe se almacena únicamente en su dispositivo.",
      reproducible: "Cualquiera puede volver a verificar este informe usando su contenido y la prueba."
    }
  },

  system: {
    errorGeneric: "Error.",
    errorLoad: "No se pudo cargar el archivo.",
    errorSave: "No se pudieron guardar los cambios.",
    successSave: "Guardado ✓",
    loading: "Cargando…",
    empty: "Aún no hay nada.",
    noSelectionToVerify: "No hay selección para verificar.",
    nothingToVerify: "Nada que verificar.",
    serverSealFailed: "Falló el sellado del servidor.",
    unexpectedResponse: "Respuesta inesperada del servidor.",
    alreadyVerified:
      "El texto ya ha sido verificado y el informe ya existe en la sección Informes."
  },

  tapToOpen: "Toque para abrir"
},




    it: {
  archive: {
    title: "Archivio",
    introText: "Esamini, verifichi e selezioni conversazioni precedenti.",
    searchPlaceholder: "Cerca nell’archivio…",
    noResults: "Nessun risultato.",
    empty: "Nessuna chat salvata al momento.",
    loading: "Caricamento dell’archivio…",
    viewMessage: "Apri messaggio",
    viewChat: "Apri chat",
    back: "Indietro",
    add: "Aggiungi",
    startChat: "Nuova chat",
    verify: "Verifica",
    chatNumber: "Chat {{chatNumber}}",
    messageReference: "Riferimento del messaggio",
    totalMessages: "{{count}} messaggi",
    keywords: "Parole chiave",
    summarize: "Riepiloga",
    loadSelection: "Carica selezione",
    clearSelection: "Cancella",
    defaultHeader: "Chat recenti",
    selectionStatus: "{{count}} coppie di messaggi selezionate",
    addToChat: "Aggiungi {{count}}/4 a una nuova chat",
    tooMany: "Troppi elementi da aggiungere",
    searchUserChats: "Cerca nelle chat…",
    modes: {
      chat: "Chat",
      reports: "Report"
    }
  },

  operators: {
    and: "E",
    or: "O",
    not: "NON",
    phrase: "Frase"
  },

  overlay: {
    header: "Chat {{chatNumber}}",
    verifyChat: "Verifica chat",
    downloadReport: "Scarica report",
    uploadReport: "Carica report",
    preparing: "Preparazione del report…",
    success: "Verificato ✓",
    fail: "Errore ✗",
    cancelled: "Verifica annullata.",
    loading: "Verifica in corso…",
    close: "Chiudi"
  },

  intro: {
    header: "Contesto caricato",
    subtext: "Dall’archivio:",
    continue: "Continua"
  },

  report: {
    title: "Report",
    subtitle: "Report verificati localmente.",
    upload: "Carica",
    uploadSuccess: "Report caricato ✓",
    view: "Apri",
    verifySignature: "Verifica firma",
    reverify: "Verifica di nuovo",
    missingSignature: "Nessuna firma trovata.",
    noReports: "Nessun report.",
    valid: "✅ Valido",
    invalid: "⚠️ Non valido",
    statusVerified: "Verificato",
    lastVerified: "Ultima verifica",
    messagePairs: "{{count}} coppie di messaggi",
    source: "Fonte",
    sourceArchiveSelection: "Selezione archivio",
    export: "Esporta report",
    close: "Chiudi",

    sections: {
      summary: "Riepilogo",
      proof: "Prova di verifica",
      content: "Contenuto verificato",
      metadata: "Metadati"
    },

    summary: {
      status: "Stato",
      verifiedAt: "Verificato il",
      pairCount: "Coppie di messaggi verificate",
      source: "Fonte",
      publicKey: "Chiave pubblica"
    },

    proof: {
      truthHash: "Truth hash",
      hashProfile: "Profilo hash",
      keyProfile: "Profilo chiave",
      protocolVersion: "Versione del protocollo",
      timestamp: "Timestamp del sigillo"
    },

    content: {
      title: "Contenuto verificato",
      description: "Questo contenuto è stato utilizzato per generare l’hash di verifica.",
      user: "Utente",
      assistant: "Assistente"
    },

    explanations: {
      localOnly: "Questo report è archiviato esclusivamente sul Suo dispositivo.",
      reproducible: "Chiunque può verificare nuovamente questo report utilizzando il contenuto e la prova."
    }
  },

  system: {
    errorGeneric: "Errore.",
    errorLoad: "Impossibile caricare l’archivio.",
    errorSave: "Impossibile salvare le modifiche.",
    successSave: "Salvato ✓",
    loading: "Caricamento…",
    empty: "Ancora vuoto.",
    noSelectionToVerify: "Nessuna selezione da verificare.",
    nothingToVerify: "Nulla da verificare.",
    serverSealFailed: "Sigillatura del server non riuscita.",
    unexpectedResponse: "Risposta del server inattesa.",
    alreadyVerified:
      "Il testo è già stato verificato e il report esiste già nella sezione Report."
  },

  tapToOpen: "Tocchi per aprire"
},


 pt: {
  archive: {
    title: "Arquivo",
    introText: "Examine, verifique e selecione conversas anteriores.",
    searchPlaceholder: "Pesquisar no arquivo…",
    noResults: "Nenhum resultado.",
    empty: "Ainda não há chats salvos.",
    loading: "Carregando arquivo…",
    viewMessage: "Abrir mensagem",
    viewChat: "Abrir chat",
    back: "Voltar",
    add: "Adicionar",
    startChat: "Novo chat",
    verify: "Verificar",
    chatNumber: "Chat {{chatNumber}}",
    messageReference: "Referência da mensagem",
    totalMessages: "{{count}} mensagens",
    keywords: "Palavras-chave",
    summarize: "Resumir",
    loadSelection: "Carregar seleção",
    clearSelection: "Limpar",
    defaultHeader: "Chats recentes",
    selectionStatus: "{{count}} pares de mensagens selecionados",
    addToChat: "Adicionar {{count}}/4 a um novo chat",
    tooMany: "Demasiados para adicionar",
    searchUserChats: "Pesquisar nos seus chats…",
    modes: {
      chat: "Chat",
      reports: "Relatórios"
    }
  },

  operators: {
    and: "E",
    or: "OU",
    not: "NÃO",
    phrase: "Frase"
  },

  overlay: {
    header: "Chat {{chatNumber}}",
    verifyChat: "Verificar chat",
    downloadReport: "Descarregar relatório",
    uploadReport: "Carregar relatório",
    preparing: "A preparar relatório…",
    success: "Verificado ✓",
    fail: "Erro ✗",
    cancelled: "Verificação cancelada.",
    loading: "A verificar…",
    close: "Fechar"
  },

  intro: {
    header: "Contexto carregado",
    subtext: "Do arquivo:",
    continue: "Continuar"
  },

  report: {
    title: "Relatórios",
    subtitle: "Relatórios verificados localmente.",
    upload: "Carregar",
    uploadSuccess: "Relatório carregado ✓",
    view: "Abrir",
    verifySignature: "Verificar assinatura",
    reverify: "Verificar novamente",
    missingSignature: "Nenhuma assinatura encontrada.",
    noReports: "Sem relatórios.",
    valid: "✅ Válido",
    invalid: "⚠️ Inválido",
    statusVerified: "Verificado",
    lastVerified: "Última verificação",
    messagePairs: "{{count}} pares de mensagens",
    source: "Fonte",
    sourceArchiveSelection: "Seleção do arquivo",
    export: "Exportar relatório",
    close: "Fechar",

    sections: {
      summary: "Resumo",
      proof: "Prova de verificação",
      content: "Conteúdo verificado",
      metadata: "Metadados"
    },

    summary: {
      status: "Estado",
      verifiedAt: "Verificado em",
      pairCount: "Pares de mensagens verificados",
      source: "Fonte",
      publicKey: "Chave pública"
    },

    proof: {
      truthHash: "Hash de verdade",
      hashProfile: "Perfil de hash",
      keyProfile: "Perfil de chave",
      protocolVersion: "Versão do protocolo",
      timestamp: "Marca temporal do selo"
    },

    content: {
      title: "Conteúdo verificado",
      description: "Este conteúdo foi utilizado para gerar o hash de verificação.",
      user: "Utilizador",
      assistant: "Assistente"
    },

    explanations: {
      localOnly: "Este relatório é armazenado exclusivamente no seu dispositivo.",
      reproducible: "Qualquer pessoa pode verificar novamente este relatório usando o conteúdo e a prova."
    }
  },

  system: {
    errorGeneric: "Erro.",
    errorLoad: "Não foi possível carregar o arquivo.",
    errorSave: "Não foi possível guardar as alterações.",
    successSave: "Guardado ✓",
    loading: "A carregar…",
    empty: "Ainda não há nada.",
    noSelectionToVerify: "Nenhuma seleção para verificar.",
    nothingToVerify: "Nada para verificar.",
    serverSealFailed: "Falha na selagem do servidor.",
    unexpectedResponse: "Resposta inesperada do servidor.",
    alreadyVerified:
      "O texto já foi verificado e o relatório já existe na secção Relatórios."
  },

  tapToOpen: "Toque para abrir"
},


 nl: {
  archive: {
    title: "Archief",
    introText: "Bekijk, controleer en selecteer eerdere gesprekken.",
    searchPlaceholder: "Archief doorzoeken…",
    noResults: "Geen resultaten.",
    empty: "Nog geen opgeslagen chats.",
    loading: "Archief laden…",
    viewMessage: "Bericht openen",
    viewChat: "Chat openen",
    back: "Terug",
    add: "Toevoegen",
    startChat: "Nieuwe chat",
    verify: "Verifiëren",
    chatNumber: "Chat {{chatNumber}}",
    messageReference: "Berichtreferentie",
    totalMessages: "{{count}} berichten",
    keywords: "Trefwoorden",
    summarize: "Samenvatten",
    loadSelection: "Selectie laden",
    clearSelection: "Wissen",
    defaultHeader: "Recente chats",
    selectionStatus: "{{count}} berichtparen geselecteerd",
    addToChat: "{{count}}/4 aan nieuwe chat toevoegen",
    tooMany: "Te veel om toe te voegen",
    searchUserChats: "Uw chats doorzoeken…",
    modes: {
      chat: "Chat",
      reports: "Rapporten"
    }
  },

  operators: {
    and: "EN",
    or: "OF",
    not: "NIET",
    phrase: "Zin"
  },

  overlay: {
    header: "Chat {{chatNumber}}",
    verifyChat: "Chat verifiëren",
    downloadReport: "Rapport downloaden",
    uploadReport: "Rapport uploaden",
    preparing: "Rapport wordt voorbereid…",
    success: "Geverifieerd ✓",
    fail: "Mislukt ✗",
    cancelled: "Verificatie geannuleerd.",
    loading: "Verificatie bezig…",
    close: "Sluiten"
  },

  intro: {
    header: "Context geladen",
    subtext: "Uit archief:",
    continue: "Doorgaan"
  },

  report: {
    title: "Rapporten",
    subtitle: "Lokaal geverifieerde rapporten.",
    upload: "Uploaden",
    uploadSuccess: "Rapport geüpload ✓",
    view: "Openen",
    verifySignature: "Handtekening verifiëren",
    reverify: "Opnieuw verifiëren",
    missingSignature: "Geen handtekening gevonden.",
    noReports: "Geen rapporten.",
    valid: "✅ Geldig",
    invalid: "⚠️ Ongeldig",
    statusVerified: "Geverifieerd",
    lastVerified: "Laatst geverifieerd",
    messagePairs: "{{count}} berichtparen",
    source: "Bron",
    sourceArchiveSelection: "Archiefselectie",
    export: "Rapport exporteren",
    close: "Sluiten",

    sections: {
      summary: "Samenvatting",
      proof: "Verificatiebewijs",
      content: "Geverifieerde inhoud",
      metadata: "Metadata"
    },

    summary: {
      status: "Status",
      verifiedAt: "Geverifieerd op",
      pairCount: "Geverifieerde berichtparen",
      source: "Bron",
      publicKey: "Openbare sleutel"
    },

    proof: {
      truthHash: "Truth-hash",
      hashProfile: "Hashprofiel",
      keyProfile: "Sleutelprofiel",
      protocolVersion: "Protocolversie",
      timestamp: "Tijdstip van verzegeling"
    },

    content: {
      title: "Geverifieerde inhoud",
      description: "Deze inhoud is gebruikt om de verificatie-hash te genereren.",
      user: "Gebruiker",
      assistant: "Assistent"
    },

    explanations: {
      localOnly: "Dit rapport wordt uitsluitend lokaal op uw apparaat opgeslagen.",
      reproducible: "Iedereen kan dit rapport opnieuw verifiëren met behulp van de inhoud en het bewijs."
    }
  },

  system: {
    errorGeneric: "Fout.",
    errorLoad: "Archief kon niet worden geladen.",
    errorSave: "Wijzigingen konden niet worden opgeslagen.",
    successSave: "Opgeslagen ✓",
    loading: "Laden…",
    empty: "Nog niets hier.",
    noSelectionToVerify: "Geen selectie om te verifiëren.",
    nothingToVerify: "Niets te verifiëren.",
    serverSealFailed: "Serververzegeling mislukt.",
    unexpectedResponse: "Onverwachte serverreactie.",
    alreadyVerified:
      "De tekst is al geverifieerd en het rapport bestaat al in de sectie Rapporten."
  },

  tapToOpen: "Tikken om te openen"
},

 ru: {
  archive: {
    title: "Архив",
    introText: "Просматривайте, проверяйте и выбирайте предыдущие диалоги.",
    searchPlaceholder: "Поиск в архиве…",
    noResults: "Совпадений нет.",
    empty: "Сохранённых чатов пока нет.",
    loading: "Загрузка архива…",
    viewMessage: "Открыть сообщение",
    viewChat: "Открыть чат",
    back: "Назад",
    add: "Добавить",
    startChat: "Новый чат",
    verify: "Проверить",
    chatNumber: "Чат {{chatNumber}}",
    messageReference: "Ссылка на сообщение",
    totalMessages: "{{count}} сообщений",
    keywords: "Ключевые слова",
    summarize: "Сводка",
    loadSelection: "Загрузить выбор",
    clearSelection: "Очистить",
    defaultHeader: "Недавние чаты",
    selectionStatus: "Выбрано пар сообщений: {{count}}",
    addToChat: "Добавить {{count}}/4 в новый чат",
    tooMany: "Слишком много для добавления",
    searchUserChats: "Поиск по вашим чатам…",
    modes: {
      chat: "Чат",
      reports: "Отчёты"
    }
  },

  operators: {
    and: "И",
    or: "ИЛИ",
    not: "НЕ",
    phrase: "Фраза"
  },

  overlay: {
    header: "Чат {{chatNumber}}",
    verifyChat: "Проверить чат",
    downloadReport: "Скачать отчёт",
    uploadReport: "Загрузить отчёт",
    preparing: "Подготовка отчёта…",
    success: "Проверено ✓",
    fail: "Ошибка ✗",
    cancelled: "Проверка отменена.",
    loading: "Идёт проверка…",
    close: "Закрыть"
  },

  intro: {
    header: "Контекст загружен",
    subtext: "Из архива:",
    continue: "Продолжить"
  },

  report: {
    title: "Отчёты",
    subtitle: "Локально проверенные отчёты.",
    upload: "Загрузить",
    uploadSuccess: "Отчёт загружен ✓",
    view: "Открыть",
    verifySignature: "Проверить подпись",
    reverify: "Проверить повторно",
    missingSignature: "Подпись не найдена.",
    noReports: "Отчётов нет.",
    valid: "✅ Действителен",
    invalid: "⚠️ Недействителен",
    statusVerified: "Проверен",
    lastVerified: "Последняя проверка",
    messagePairs: "{{count}} пар сообщений",
    source: "Источник",
    sourceArchiveSelection: "Выбор из архива",
    export: "Экспорт отчёта",
    close: "Закрыть",

    sections: {
      summary: "Сводка",
      proof: "Доказательство проверки",
      content: "Проверенный контент",
      metadata: "Метаданные"
    },

    summary: {
      status: "Статус",
      verifiedAt: "Проверено",
      pairCount: "Проверенные пары сообщений",
      source: "Источник",
      publicKey: "Открытый ключ"
    },

    proof: {
      truthHash: "Truth-hash",
      hashProfile: "Профиль хэша",
      keyProfile: "Профиль ключа",
      protocolVersion: "Версия протокола",
      timestamp: "Время запечатывания"
    },

    content: {
      title: "Проверенный контент",
      description: "Этот контент использовался для формирования хэша проверки.",
      user: "Пользователь",
      assistant: "Ассистент"
    },

    explanations: {
      localOnly: "Этот отчёт хранится исключительно локально на вашем устройстве.",
      reproducible: "Любой может повторно проверить этот отчёт, используя контент и доказательство."
    }
  },

  system: {
    errorGeneric: "Ошибка.",
    errorLoad: "Не удалось загрузить архив.",
    errorSave: "Не удалось сохранить изменения.",
    successSave: "Сохранено ✓",
    loading: "Загрузка…",
    empty: "Пока здесь пусто.",
    noSelectionToVerify: "Нет выбора для проверки.",
    nothingToVerify: "Нечего проверять.",
    serverSealFailed: "Ошибка серверного запечатывания.",
    unexpectedResponse: "Неожиданный ответ сервера.",
    alreadyVerified:
      "Текст уже проверен, и отчёт уже существует в разделе Отчёты."
  },

  tapToOpen: "Нажмите, чтобы открыть"
},

  zh: {
  archive: {
    title: "存档",
    introText: "浏览、审查并选择以往的对话。",
    searchPlaceholder: "搜索存档…",
    noResults: "未找到匹配项。",
    empty: "尚无已保存的聊天。",
    loading: "正在加载存档…",
    viewMessage: "打开消息",
    viewChat: "打开聊天",
    back: "返回",
    add: "添加",
    startChat: "新建聊天",
    verify: "验证",
    chatNumber: "聊天 {{chatNumber}}",
    messageReference: "消息引用",
    totalMessages: "{{count}} 条消息",
    keywords: "关键词",
    summarize: "摘要",
    loadSelection: "加载选择",
    clearSelection: "清除",
    defaultHeader: "最近的聊天",
    selectionStatus: "已选择 {{count}} 对消息",
    addToChat: "添加 {{count}}/4 到新聊天",
    tooMany: "添加数量过多",
    searchUserChats: "搜索您的聊天…",
    modes: {
      chat: "聊天",
      reports: "报告"
    }
  },

  operators: {
    and: "与",
    or: "或",
    not: "非",
    phrase: "短语"
  },

  overlay: {
    header: "聊天 {{chatNumber}}",
    verifyChat: "验证聊天",
    downloadReport: "下载报告",
    uploadReport: "上传报告",
    preparing: "正在准备报告…",
    success: "已验证 ✓",
    fail: "验证失败 ✗",
    cancelled: "验证已取消。",
    loading: "正在验证…",
    close: "关闭"
  },

  intro: {
    header: "上下文已加载",
    subtext: "来自存档：",
    continue: "继续"
  },

  report: {
    title: "报告",
    subtitle: "本地验证的报告。",
    upload: "上传",
    uploadSuccess: "报告已上传 ✓",
    view: "打开",
    verifySignature: "验证签名",
    reverify: "重新验证",
    missingSignature: "未找到签名。",
    noReports: "暂无报告。",
    valid: "✅ 有效",
    invalid: "⚠️ 无效",
    statusVerified: "已验证",
    lastVerified: "上次验证",
    messagePairs: "{{count}} 对消息",
    source: "来源",
    sourceArchiveSelection: "存档选择",
    export: "导出报告",
    close: "关闭",

    sections: {
      summary: "摘要",
      proof: "验证证明",
      content: "已验证内容",
      metadata: "元数据"
    },

    summary: {
      status: "状态",
      verifiedAt: "验证时间",
      pairCount: "已验证的消息对",
      source: "来源",
      publicKey: "公钥"
    },

    proof: {
      truthHash: "真值哈希",
      hashProfile: "哈希配置",
      keyProfile: "密钥配置",
      protocolVersion: "协议版本",
      timestamp: "封存时间戳"
    },

    content: {
      title: "已验证内容",
      description: "该内容用于生成验证哈希。",
      user: "用户",
      assistant: "助手"
    },

    explanations: {
      localOnly: "此报告仅存储在您的设备本地。",
      reproducible: "任何人都可以使用内容和证明重新验证此报告。"
    }
  },

  system: {
    errorGeneric: "错误。",
    errorLoad: "无法加载存档。",
    errorSave: "无法保存更改。",
    successSave: "已保存 ✓",
    loading: "加载中…",
    empty: "此处暂无内容。",
    noSelectionToVerify: "没有可验证的选择。",
    nothingToVerify: "没有需要验证的内容。",
    serverSealFailed: "服务器封存失败。",
    unexpectedResponse: "服务器返回了意外的响应。",
    alreadyVerified:
      "文本已被验证，且报告已存在于报告部分。"
  },

  tapToOpen: "点击打开"
},

  ja: {
  archive: {
    title: "アーカイブ",
    introText: "過去の会話を参照、確認、選択できます。",
    searchPlaceholder: "アーカイブを検索…",
    noResults: "一致する結果はありません。",
    empty: "保存されたチャットはまだありません。",
    loading: "アーカイブを読み込み中…",
    viewMessage: "メッセージを開く",
    viewChat: "チャットを開く",
    back: "戻る",
    add: "追加",
    startChat: "新しいチャット",
    verify: "検証",
    chatNumber: "チャット {{chatNumber}}",
    messageReference: "メッセージ参照",
    totalMessages: "{{count}} 件のメッセージ",
    keywords: "キーワード",
    summarize: "要約",
    loadSelection: "選択を読み込む",
    clearSelection: "クリア",
    defaultHeader: "最近のチャット",
    selectionStatus: "{{count}} 件のメッセージペアを選択",
    addToChat: "新しいチャットに {{count}}/4 を追加",
    tooMany: "追加数が多すぎます",
    searchUserChats: "チャットを検索…",
    modes: {
      chat: "チャット",
      reports: "レポート"
    }
  },

  operators: {
    and: "AND",
    or: "OR",
    not: "NOT",
    phrase: "フレーズ"
  },

  overlay: {
    header: "チャット {{chatNumber}}",
    verifyChat: "チャットを検証",
    downloadReport: "レポートをダウンロード",
    uploadReport: "レポートをアップロード",
    preparing: "レポートを準備中…",
    success: "検証済み ✓",
    fail: "失敗 ✗",
    cancelled: "検証がキャンセルされました。",
    loading: "検証中…",
    close: "閉じる"
  },

  intro: {
    header: "コンテキストが読み込まれました",
    subtext: "アーカイブから:",
    continue: "続行"
  },

  report: {
    title: "レポート",
    subtitle: "ローカルで検証されたレポート。",
    upload: "アップロード",
    uploadSuccess: "レポートをアップロードしました ✓",
    view: "開く",
    verifySignature: "署名を検証",
    reverify: "再検証",
    missingSignature: "署名が見つかりません。",
    noReports: "レポートはありません。",
    valid: "✅ 有効",
    invalid: "⚠️ 無効",
    statusVerified: "検証済み",
    lastVerified: "最終検証",
    messagePairs: "{{count}} 件のメッセージペア",
    source: "ソース",
    sourceArchiveSelection: "アーカイブ選択",
    export: "レポートをエクスポート",
    close: "閉じる",

    sections: {
      summary: "要約",
      proof: "検証証明",
      content: "検証済みコンテンツ",
      metadata: "メタデータ"
    },

    summary: {
      status: "ステータス",
      verifiedAt: "検証日時",
      pairCount: "検証済みメッセージペア",
      source: "ソース",
      publicKey: "公開鍵"
    },

    proof: {
      truthHash: "Truth ハッシュ",
      hashProfile: "ハッシュプロファイル",
      keyProfile: "キープロファイル",
      protocolVersion: "プロトコルバージョン",
      timestamp: "封印タイムスタンプ"
    },

    content: {
      title: "検証済みコンテンツ",
      description: "このコンテンツは検証ハッシュの生成に使用されました。",
      user: "ユーザー",
      assistant: "アシスタント"
    },

    explanations: {
      localOnly: "このレポートはお使いのデバイスにのみローカル保存されます。",
      reproducible: "内容と証明を用いて、誰でもこのレポートを再検証できます。"
    }
  },

  system: {
    errorGeneric: "エラー。",
    errorLoad: "アーカイブを読み込めませんでした。",
    errorSave: "変更を保存できませんでした。",
    successSave: "保存しました ✓",
    loading: "読み込み中…",
    empty: "まだ何もありません。",
    noSelectionToVerify: "検証する選択がありません。",
    nothingToVerify: "検証するものがありません。",
    serverSealFailed: "サーバーの封印に失敗しました。",
    unexpectedResponse: "予期しないサーバー応答です。",
    alreadyVerified:
      "テキストはすでに検証されており、レポートはレポートセクションに存在します。"
  },

  tapToOpen: "タップして開く"
},


  ko: {
  archive: {
    title: "아카이브",
    introText: "이전 대화를 탐색하고 검토하며 선택할 수 있습니다.",
    searchPlaceholder: "아카이브 검색…",
    noResults: "일치하는 결과가 없습니다.",
    empty: "저장된 채팅이 아직 없습니다.",
    loading: "아카이브를 불러오는 중…",
    viewMessage: "메시지 열기",
    viewChat: "채팅 열기",
    back: "뒤로",
    add: "추가",
    startChat: "새 채팅",
    verify: "검증",
    chatNumber: "채팅 {{chatNumber}}",
    messageReference: "메시지 참조",
    totalMessages: "{{count}}개 메시지",
    keywords: "키워드",
    summarize: "요약",
    loadSelection: "선택 불러오기",
    clearSelection: "지우기",
    defaultHeader: "최근 채팅",
    selectionStatus: "{{count}}개 메시지 쌍 선택됨",
    addToChat: "새 채팅에 {{count}}/4 추가",
    tooMany: "추가하기에 너무 많습니다",
    searchUserChats: "채팅 검색…",
    modes: {
      chat: "채팅",
      reports: "보고서"
    }
  },

  operators: {
    and: "AND",
    or: "OR",
    not: "NOT",
    phrase: "구문"
  },

  overlay: {
    header: "채팅 {{chatNumber}}",
    verifyChat: "채팅 검증",
    downloadReport: "보고서 다운로드",
    uploadReport: "보고서 업로드",
    preparing: "보고서 준비 중…",
    success: "검증됨 ✓",
    fail: "실패 ✗",
    cancelled: "검증이 취소되었습니다.",
    loading: "검증 중…",
    close: "닫기"
  },

  intro: {
    header: "컨텍스트가 업로드되었습니다",
    subtext: "아카이브에서:",
    continue: "계속"
  },

  report: {
    title: "보고서",
    subtitle: "로컬에서 검증된 보고서.",
    upload: "업로드",
    uploadSuccess: "보고서가 업로드되었습니다 ✓",
    view: "열기",
    verifySignature: "서명 검증",
    reverify: "재검증",
    missingSignature: "서명을 찾을 수 없습니다.",
    noReports: "보고서가 없습니다.",
    valid: "✅ 유효",
    invalid: "⚠️ 유효하지 않음",
    statusVerified: "검증됨",
    lastVerified: "마지막 검증",
    messagePairs: "{{count}}개 메시지 쌍",
    source: "출처",
    sourceArchiveSelection: "아카이브 선택",
    export: "보고서 내보내기",
    close: "닫기",

    sections: {
      summary: "요약",
      proof: "검증 증명",
      content: "검증된 콘텐츠",
      metadata: "메타데이터"
    },

    summary: {
      status: "상태",
      verifiedAt: "검증 시각",
      pairCount: "검증된 메시지 쌍",
      source: "출처",
      publicKey: "공개 키"
    },

    proof: {
      truthHash: "Truth 해시",
      hashProfile: "해시 프로필",
      keyProfile: "키 프로필",
      protocolVersion: "프로토콜 버전",
      timestamp: "봉인 타임스탬프"
    },

    content: {
      title: "검증된 콘텐츠",
      description: "이 콘텐츠는 검증 해시를 생성하는 데 사용되었습니다.",
      user: "사용자",
      assistant: "어시스턴트"
    },

    explanations: {
      localOnly: "이 보고서는 사용자 기기에만 로컬로 저장됩니다.",
      reproducible: "누구나 콘텐츠와 증명을 사용해 이 보고서를 다시 검증할 수 있습니다."
    }
  },

  system: {
    errorGeneric: "오류.",
    errorLoad: "아카이브를 불러오지 못했습니다.",
    errorSave: "변경 사항을 저장하지 못했습니다.",
    successSave: "저장됨 ✓",
    loading: "로딩 중…",
    empty: "아직 아무것도 없습니다.",
    noSelectionToVerify: "검증할 선택 항목이 없습니다.",
    nothingToVerify: "검증할 내용이 없습니다.",
    serverSealFailed: "서버 봉인에 실패했습니다.",
    unexpectedResponse: "예기치 않은 서버 응답입니다.",
    alreadyVerified:
      "텍스트는 이미 검증되었으며 보고서는 보고서 섹션에 이미 존재합니다."
  },

  tapToOpen: "탭하여 열기"
},

  ar: {
  archive: {
    title: "الأرشيف",
    introText: "تصفح وراجع وحدد المحادثات السابقة.",
    searchPlaceholder: "ابحث في الأرشيف…",
    noResults: "لا توجد نتائج.",
    empty: "لا توجد محادثات محفوظة بعد.",
    loading: "جارٍ تحميل الأرشيف…",
    viewMessage: "فتح الرسالة",
    viewChat: "فتح المحادثة",
    back: "رجوع",
    add: "إضافة",
    startChat: "محادثة جديدة",
    verify: "تحقق",
    chatNumber: "المحادثة {{chatNumber}}",
    messageReference: "مرجع الرسالة",
    totalMessages: "{{count}} رسالة",
    keywords: "الكلمات المفتاحية",
    summarize: "تلخيص",
    loadSelection: "تحميل التحديد",
    clearSelection: "مسح",
    defaultHeader: "المحادثات الأخيرة",
    selectionStatus: "تم تحديد {{count}} زوج من الرسائل",
    addToChat: "إضافة {{count}}/4 إلى محادثة جديدة",
    tooMany: "عدد كبير للإضافة",
    searchUserChats: "ابحث في محادثاتك…",
    modes: {
      chat: "محادثة",
      reports: "تقارير"
    }
  },

  operators: {
    and: "و",
    or: "أو",
    not: "ليس",
    phrase: "عبارة"
  },

  overlay: {
    header: "المحادثة {{chatNumber}}",
    verifyChat: "تحقق من المحادثة",
    downloadReport: "تنزيل التقرير",
    uploadReport: "رفع التقرير",
    preparing: "جارٍ إعداد التقرير…",
    success: "تم التحقق ✓",
    fail: "فشل ✗",
    cancelled: "تم إلغاء التحقق.",
    loading: "جارٍ التحقق…",
    close: "إغلاق"
  },

  intro: {
    header: "تم تحميل السياق",
    subtext: "من الأرشيف:",
    continue: "متابعة"
  },

  report: {
    title: "التقارير",
    subtitle: "تقارير تم التحقق منها محليًا.",
    upload: "رفع",
    uploadSuccess: "تم رفع التقرير ✓",
    view: "فتح",
    verifySignature: "التحقق من التوقيع",
    reverify: "إعادة التحقق",
    missingSignature: "لم يتم العثور على توقيع.",
    noReports: "لا توجد تقارير.",
    valid: "✅ صالح",
    invalid: "⚠️ غير صالح",
    statusVerified: "تم التحقق",
    lastVerified: "آخر تحقق",
    messagePairs: "{{count}} زوج من الرسائل",
    source: "المصدر",
    sourceArchiveSelection: "تحديد من الأرشيف",
    export: "تصدير التقرير",
    close: "إغلاق",

    sections: {
      summary: "ملخص",
      proof: "دليل التحقق",
      content: "محتوى تم التحقق منه",
      metadata: "البيانات الوصفية"
    },

    summary: {
      status: "الحالة",
      verifiedAt: "تم التحقق في",
      pairCount: "أزواج الرسائل التي تم التحقق منها",
      source: "المصدر",
      publicKey: "المفتاح العام"
    },

    proof: {
      truthHash: "تجزئة الحقيقة",
      hashProfile: "ملف التجزئة",
      keyProfile: "ملف المفتاح",
      protocolVersion: "إصدار البروتوكول",
      timestamp: "طابع الختم الزمني"
    },

    content: {
      title: "محتوى تم التحقق منه",
      description: "تم استخدام هذا المحتوى لإنشاء تجزئة التحقق.",
      user: "المستخدم",
      assistant: "المساعد"
    },

    explanations: {
      localOnly: "يتم تخزين هذا التقرير محليًا فقط على جهازك.",
      reproducible: "يمكن لأي شخص إعادة التحقق من هذا التقرير باستخدام المحتوى والدليل."
    }
  },

  system: {
    errorGeneric: "خطأ.",
    errorLoad: "تعذر تحميل الأرشيف.",
    errorSave: "تعذر حفظ التغييرات.",
    successSave: "تم الحفظ ✓",
    loading: "جارٍ التحميل…",
    empty: "لا يوجد شيء هنا بعد.",
    noSelectionToVerify: "لا يوجد تحديد للتحقق.",
    nothingToVerify: "لا يوجد ما يتم التحقق منه.",
    serverSealFailed: "فشل ختم الخادم.",
    unexpectedResponse: "استجابة خادم غير متوقعة.",
    alreadyVerified:
      "تم التحقق من النص بالفعل والتقرير موجود في قسم التقارير."
  },

  tapToOpen: "اضغط للفتح"
},

 hi: {
  archive: {
    title: "आर्काइव",
    introText: "पिछली बातचीत देखें, जाँचें और चुनें।",
    searchPlaceholder: "आर्काइव खोजें…",
    noResults: "कोई परिणाम नहीं।",
    empty: "अभी तक कोई सहेजे गए चैट नहीं हैं।",
    loading: "आर्काइव लोड हो रहा है…",
    viewMessage: "संदेश खोलें",
    viewChat: "चैट खोलें",
    back: "वापस",
    add: "जोड़ें",
    startChat: "नया चैट",
    verify: "सत्यापित करें",
    chatNumber: "चैट {{chatNumber}}",
    messageReference: "संदेश संदर्भ",
    totalMessages: "{{count}} संदेश",
    keywords: "कीवर्ड",
    summarize: "सारांश",
    loadSelection: "चयन लोड करें",
    clearSelection: "साफ़ करें",
    defaultHeader: "हाल के चैट",
    selectionStatus: "{{count}} संदेश जोड़े चयनित",
    addToChat: "नए चैट में {{count}}/4 जोड़ें",
    tooMany: "जोड़ने के लिए बहुत अधिक",
    searchUserChats: "अपने चैट खोजें…",
    modes: {
      chat: "चैट",
      reports: "रिपोर्ट"
    }
  },

  operators: {
    and: "और",
    or: "या",
    not: "नहीं",
    phrase: "वाक्यांश"
  },

  overlay: {
    header: "चैट {{chatNumber}}",
    verifyChat: "चैट सत्यापित करें",
    downloadReport: "रिपोर्ट डाउनलोड करें",
    uploadReport: "रिपोर्ट अपलोड करें",
    preparing: "रिपोर्ट तैयार की जा रही है…",
    success: "सत्यापित ✓",
    fail: "विफल ✗",
    cancelled: "सत्यापन रद्द किया गया।",
    loading: "सत्यापन जारी है…",
    close: "बंद करें"
  },

  intro: {
    header: "संदर्भ लोड हो गया",
    subtext: "आर्काइव से:",
    continue: "जारी रखें"
  },

  report: {
    title: "रिपोर्ट",
    subtitle: "स्थानीय रूप से सत्यापित रिपोर्ट।",
    upload: "अपलोड",
    uploadSuccess: "रिपोर्ट अपलोड हुई ✓",
    view: "खोलें",
    verifySignature: "हस्ताक्षर सत्यापित करें",
    reverify: "पुनः सत्यापित करें",
    missingSignature: "कोई हस्ताक्षर नहीं मिला।",
    noReports: "कोई रिपोर्ट नहीं।",
    valid: "✅ मान्य",
    invalid: "⚠️ अमान्य",
    statusVerified: "सत्यापित",
    lastVerified: "अंतिम सत्यापन",
    messagePairs: "{{count}} संदेश जोड़े",
    source: "स्रोत",
    sourceArchiveSelection: "आर्काइव चयन",
    export: "रिपोर्ट निर्यात करें",
    close: "बंद करें",

    sections: {
      summary: "सारांश",
      proof: "सत्यापन प्रमाण",
      content: "सत्यापित सामग्री",
      metadata: "मेटाडेटा"
    },

    summary: {
      status: "स्थिति",
      verifiedAt: "सत्यापित समय",
      pairCount: "सत्यापित संदेश जोड़े",
      source: "स्रोत",
      publicKey: "सार्वजनिक कुंजी"
    },

    proof: {
      truthHash: "ट्रुथ हैश",
      hashProfile: "हैश प्रोफ़ाइल",
      keyProfile: "कुंजी प्रोफ़ाइल",
      protocolVersion: "प्रोटोकॉल संस्करण",
      timestamp: "सील समय-चिह्न"
    },

    content: {
      title: "सत्यापित सामग्री",
      description: "इस सामग्री का उपयोग सत्यापन हैश बनाने के लिए किया गया था।",
      user: "उपयोगकर्ता",
      assistant: "सहायक"
    },

    explanations: {
      localOnly: "यह रिपोर्ट केवल आपके डिवाइस पर स्थानीय रूप से संग्रहीत होती है।",
      reproducible: "कोई भी व्यक्ति सामग्री और प्रमाण का उपयोग करके इस रिपोर्ट को पुनः सत्यापित कर सकता है।"
    }
  },

  system: {
    errorGeneric: "त्रुटि।",
    errorLoad: "आर्काइव लोड नहीं हो सका।",
    errorSave: "परिवर्तन सहेजे नहीं जा सके।",
    successSave: "सहेजा गया ✓",
    loading: "लोड हो रहा है…",
    empty: "यहाँ अभी कुछ नहीं है।",
    noSelectionToVerify: "सत्यापित करने के लिए कोई चयन नहीं।",
    nothingToVerify: "सत्यापित करने के लिए कुछ नहीं।",
    serverSealFailed: "सर्वर सील विफल हुई।",
    unexpectedResponse: "अप्रत्याशित सर्वर प्रतिक्रिया।",
    alreadyVerified:
      "पाठ पहले ही सत्यापित किया जा चुका है और रिपोर्ट पहले से ही रिपोर्ट अनुभाग में मौजूद है।"
  },

  tapToOpen: "खोलने के लिए टैप करें"
},


}