/* ======================================================================
   FILE INDEX — lib/i18n.archive.ts
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
  // NEW — Report structure & content
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
introText: "Durchsuche, überprüfe und wähle frühere Unterhaltungen aus.",
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
        messageReference: 'Message reference',
      totalMessages: "{{count}} Nachrichten",
      keywords: "Schlüsselwörter",
      summarize: "Zusammenfassen",
      loadSelection: "Auswahl laden",
      clearSelection: "Leeren",
      defaultHeader: "Letzte Chats",
      selectionStatus: "{{count}} Nachrichtenpaare ausgewählt",
addToChat: "Füge {{count}}/4 zu neuem Chat hinzu",
tooMany: "Zu viele zum Hinzufügen",
searchUserChats: "Chats durchsuchen…",
modes: {
        chat: "Chat",
        reports: "Berichte"
      },
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


  // ─────────────────────────────
  // NEU — Struktur & Inhalt des Berichts
  // ─────────────────────────────

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
    localOnly: "Dieser Bericht wird ausschließlich lokal auf deinem Gerät gespeichert.",
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
    introText: "Parcourez, examinez et sélectionnez vos conversations passées.",

      searchPlaceholder: "Rechercher dans l’archive…",
      noResults: "Aucun résultat.",
      empty: "Aucune discussion enregistrée.",
      loading: "Chargement de l’archive…",
      viewMessage: "Ouvrir le message",
      viewChat: "Ouvrir la discussion",
      back: "Retour",
      add: "Ajouter",
      startChat: "Nouveau chat",
      verify: "Vérifier",
      chatNumber: "Chat {{chatNumber}}",
      totalMessages: "{{count}} messages",
      messageReference: 'Référence du message',
      keywords: "Mots-clés",
      summarize: "Résumer",
      loadSelection: "Charger la sélection",
      clearSelection: "Effacer",
      defaultHeader: "Chats récents",
      selectionStatus: "{{count}} paires de messages sélectionnées",
addToChat: "Ajouter {{count}}/4 au nouveau chat",
tooMany: "Trop à ajouter",
searchUserChats: "Rechercher dans vos chats…",
modes: {
        chat: "Chat",
        reports: "Rapports"
      },
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
      fail: "Erreur ✗",
      cancelled: "Vérification annulée.",
      loading: "Vérification…",
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
      verifySignature: "Vérifier la signature.",
      reverify: "Revérifier",
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

    },
    system: {
      errorGeneric: "Erreur.",
      errorLoad: "Impossible de charger l’archive.",
      errorSave: "Impossible d’enregistrer les modifications.",
      successSave: "Enregistré ✓",
      loading: "Chargement…",
      empty: "Rien ici pour l’instant.",
      noSelectionToVerify: "Aucune sélection à vérifier.",
nothingToVerify: "Rien à vérifier.",
serverSealFailed: "Échec du scellement côté serveur.",
unexpectedResponse: "Réponse inattendue du serveur.",
alreadyVerified:
  "Le texte a déjà été vérifié et le rapport existe déjà dans la section Rapports."

    },
    tapToOpen: "Appuyer pour ouvrir"
  },

  es: {
  archive: {
    title: "Archivo",
    introText: "Explora, revisa y selecciona conversaciones anteriores.",

      searchPlaceholder: "Buscar en el archivo…",
      noResults: "Sin coincidencias.",
      empty: "No hay chats guardados.",
      loading: "Cargando archivo…",
      viewMessage: "Abrir mensaje",
      viewChat: "Abrir chat",
      back: "Atrás",
      add: "Añadir",
      startChat: "Nuevo chat",
      verify: "Verificar",
      chatNumber: "Chat {{chatNumber}}",
      totalMessages: "{{count}} mensajes",
      messageReference: 'Referencia del mensaje',
      keywords: "Palabras clave",
      summarize: "Resumir",
      loadSelection: "Cargar selección",
      clearSelection: "Borrar",
      defaultHeader: "Chats recientes",
      selectionStatus: "{{count}} pares seleccionados",
addToChat: "Añadir {{count}}/4 al nuevo chat",
tooMany: "Demasiados para añadir",
searchUserChats: "Buscar en tus chats…",
modes: {
        chat: "Chat",
        reports: "Informes"
      },
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
      subtext: "Desde archivo:",
      continue: "Continuar"
    },
    report: {
      title: "Informes",
      subtitle: "Informes verificados localmente.",
      upload: "Subir",
      uploadSuccess: "Informe subido ✓",
      view: "Abrir",
      verifySignature: "Verificar firma.",
      reverify: "Reverificar",
      missingSignature: "No se encontró firma.",
      noReports: "Sin informes.",
      valid: "✅ Válido",
      invalid: "⚠️ Inválido",
      statusVerified: "Verificado",
lastVerified: "Última verificación",
messagePairs: "{{count}} pares de mensajes",
source: "Fuente",
sourceArchiveSelection: "Selección de archivo",
export: "Exportar informe",
close: "Cerrar",

    },
    system: {
      errorGeneric: "Error.",
      errorLoad: "No se pudo cargar el archivo.",
      errorSave: "No se pudieron guardar los cambios.",
      successSave: "Guardado ✓",
      loading: "Cargando…",
      empty: "Nada aquí todavía.",
      noSelectionToVerify: "No hay selección para verificar.",
nothingToVerify: "Nada que verificar.",
serverSealFailed: "Falló el sellado del servidor.",
unexpectedResponse: "Respuesta inesperada del servidor.",
alreadyVerified:
  "El texto ya ha sido verificado y el informe ya existe en la sección Informes."

    },
    tapToOpen: "Tocar para abrir"
  },



    it: {
  archive: {
    title: "Archivio",
    introText: "Sfoglia, rivedi e seleziona conversazioni precedenti.",

      searchPlaceholder: "Cerca nell'archivio…",
      noResults: "Nessun risultato.",
      empty: "Nessuna chat salvata.",
      loading: "Caricamento archivio…",
      viewMessage: "Apri messaggio",
      viewChat: "Apri chat",
      back: "Indietro",
      add: "Aggiungi",
      startChat: "Nuova chat",
      verify: "Verifica",
      chatNumber: "Chat {{chatNumber}}",
      totalMessages: "{{count}} messaggi",
      messageReference: 'Riferimento del messaggio',

      keywords: "Parole chiave",
      summarize: "Riassumi",
      loadSelection: "Carica selezione",
      clearSelection: "Pulisci",
      defaultHeader: "Chat recenti",
      selectionStatus: "{{count}} coppie selezionate",
addToChat: "Aggiungi {{count}}/4 al nuovo chat",
tooMany: "Troppi da aggiungere",
searchUserChats: "Cerca nelle tue chat…",
 modes: {
        chat: "Chat",
        reports: "Rapporti"
      },
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
      downloadReport: "Scarica rapporto",
      uploadReport: "Carica rapporto",
      preparing: "Preparazione rapporto…",
      success: "Verificato ✓",
      fail: "Errore ✗",
      cancelled: "Verifica annullata.",
      loading: "Verifica…",
      close: "Chiudi"
    },
    intro: {
      header: "Contesto caricato",
      subtext: "Dall'archivio:",
      continue: "Continua"
    },
    report: {
      title: "Rapporti",
      subtitle: "Rapporti verificati localmente.",
      upload: "Carica",
      uploadSuccess: "Rapporto caricato ✓",
      view: "Apri",
      verifySignature: "Verifica firma.",
      reverify: "Riverifica",
      missingSignature: "Firma non trovata.",
      noReports: "Nessun rapporto.",
      valid: "✅ Valido",
      invalid: "⚠️ Non valido",
      statusVerified: "Verificato",
lastVerified: "Ultima verifica",
messagePairs: "{{count}} coppie di messaggi",
source: "Fonte",
sourceArchiveSelection: "Selezione archivio",
export: "Esporta rapporto",
close: "Chiudi",

    },
    system: {
      errorGeneric: "Errore.",
      errorLoad: "Impossibile caricare l'archivio.",
      errorSave: "Impossibile salvare le modifiche.",
      successSave: "Salvato ✓",
      loading: "Caricamento…",
      empty: "Niente qui ancora.",
      noSelectionToVerify: "Nessuna selezione da verificare.",
nothingToVerify: "Nulla da verificare.",
serverSealFailed: "Sigillatura del server non riuscita.",
unexpectedResponse: "Risposta del server imprevista.",
alreadyVerified:
  "Il testo è già stato verificato e il report esiste già nella sezione Report."

    },
    tapToOpen: "Tocca per aprire"
  },

 pt: {
  archive: {
    title: "Arquivo",
    introText: "Navegue, reveja e selecione conversas anteriores.",

      searchPlaceholder: "Pesquisar no arquivo…",
      noResults: "Nenhum resultado.",
      empty: "Nenhum chat salvo.",
      loading: "Carregando arquivo…",
      viewMessage: "Abrir mensagem",
      viewChat: "Abrir chat",
      back: "Voltar",
      add: "Adicionar",
      startChat: "Novo chat",
      verify: "Verificar",
      chatNumber: "Chat {{chatNumber}}",
      totalMessages: "{{count}} mensagens",
      messageReference: 'Referência da mensagem',
      keywords: "Palavras-chave",
      summarize: "Resumir",
      loadSelection: "Carregar seleção",
      clearSelection: "Limpar",
      defaultHeader: "Chats recentes",
      selectionStatus: "{{count}} pares de mensagens selecionados",
addToChat: "Adicionar {{count}}/4 ao novo chat",
tooMany: "Demasiados para adicionar",
searchUserChats: "Pesquisar nos seus chats…",
  modes: {
        chat: "Chat",
        reports: "Relatórios"
      },
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
      downloadReport: "Baixar relatório",
      uploadReport: "Enviar relatório",
      preparing: "Preparando relatório…",
      success: "Verificado ✓",
      fail: "Erro ✗",
      cancelled: "Verificação cancelada.",
      loading: "Verificando…",
      close: "Fechar"
    },
    intro: {
      header: "Contexto enviado",
      subtext: "Do arquivo:",
      continue: "Continuar"
    },
    report: {
      title: "Relatórios",
      subtitle: "Relatórios verificados localmente.",
      upload: "Enviar",
      uploadSuccess: "Relatório enviado ✓",
      view: "Abrir",
      verifySignature: "Verificar assinatura.",
      reverify: "Reverificar",
      missingSignature: "Assinatura não encontrada.",
      noReports: "Nenhum relatório.",
      valid: "✅ Válido",
      invalid: "⚠️ Inválido",
      statusVerified: "Verificado",
lastVerified: "Última verificação",
messagePairs: "{{count}} pares de mensagens",
source: "Fonte",
sourceArchiveSelection: "Seleção de arquivo",
export: "Exportar relatório",
close: "Fechar",

    },
    system: {
      errorGeneric: "Erro.",
      errorLoad: "Falha ao carregar o arquivo.",
      errorSave: "Falha ao salvar alterações.",
      successSave: "Salvo ✓",
      loading: "Carregando…",
      empty: "Nada aqui ainda.",
      noSelectionToVerify: "Nenhuma seleção para verificar.",
nothingToVerify: "Nada para verificar.",
serverSealFailed: "Falha na selagem do servidor.",
unexpectedResponse: "Resposta inesperada do servidor.",
alreadyVerified:
  "O texto já foi verificado e o relatório já existe na seção Relatórios."

    },
    tapToOpen: "Toque para abrir"
  },

 nl: {
  archive: {
    title: "Archief",
    introText: "Blader, bekijk en selecteer eerdere gesprekken.",

      searchPlaceholder: "Zoek in archief…",
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
      totalMessages: "{{count}} berichten",
      messageReference: 'Berichtverwijzing',
      keywords: "Trefwoorden",
      summarize: "Samenvatten",
      loadSelection: "Selectie laden",
      clearSelection: "Wissen",
      defaultHeader: "Recente chats",
      selectionStatus: "{{count}} berichtparen geselecteerd",
addToChat: "Voeg {{count}}/4 toe aan nieuwe chat",
tooMany: "Te veel om toe te voegen",
searchUserChats: "Zoek in je chats…",
modes: {
        chat: "Chat",
        reports: "Rapporten"
      },
    },

      


    operators: {
      and: "EN",
      or: "OF",
      not: "NIET",
      phrase: "Frase"
    },
    overlay: {
      header: "Chat {{chatNumber}}",
      verifyChat: "Chat verifiëren",
      downloadReport: "Rapport downloaden",
      uploadReport: "Rapport uploaden",
      preparing: "Rapport voorbereiden…",
      success: "Geverifieerd ✓",
      fail: "Fout ✗",
      cancelled: "Verificatie geannuleerd.",
      loading: "Verifiëren…",
      close: "Sluiten"
    },
    intro: {
      header: "Context geüpload",
      subtext: "Uit archief:",
      continue: "Doorgaan"
    },
    report: {
      title: "Rapporten",
      subtitle: "Lokaal geverifieerde rapporten.",
      upload: "Uploaden",
      uploadSuccess: "Rapport geüpload ✓",
      view: "Openen",
      verifySignature: "Handtekening verifiëren.",
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

    },
    system: {
      errorGeneric: "Fout.",
      errorLoad: "Kan archief niet laden.",
      errorSave: "Kan wijzigingen niet opslaan.",
      successSave: "Opgeslagen ✓",
      loading: "Laden…",
      empty: "Nog niets hier.",
      noSelectionToVerify: "Geen selectie om te verifiëren.",
nothingToVerify: "Niets om te verifiëren.",
serverSealFailed: "Serververzegeling mislukt.",
unexpectedResponse: "Onverwachte serverreactie.",
alreadyVerified:
  "De tekst is al geverifieerd en het rapport bestaat al in de sectie Rapporten."

    },
    tapToOpen: "Tik om te openen"
  },

 ru: {
  archive: {
    title: "Архив",
    introText: "Просматривайте, проверяйте и выбирайте прошлые беседы.",

      searchPlaceholder: "Поиск в архиве…",
      noResults: "Нет совпадений.",
      empty: "Сохранённых чатов пока нет.",
      loading: "Загрузка архива…",
      viewMessage: "Открыть сообщение",
      viewChat: "Открыть чат",
      back: "Назад",
      add: "Добавить",
      startChat: "Новый чат",
      verify: "Проверить",
      chatNumber: "Чат {{chatNumber}}",
      totalMessages: "{{count}} сообщений",
      messageReference: 'Ссылка на сообщение',
      keywords: "Ключевые слова",
      summarize: "Суммировать",
      loadSelection: "Загрузить выбор",
      clearSelection: "Очистить",
      defaultHeader: "Недавние чаты",
      selectionStatus: "Выбрано {{count}} пар сообщений",
addToChat: "Добавить {{count}}/4 в новый чат",
tooMany: "Слишком много для добавления",
searchUserChats: "Искать в чатах…",
modes: {
        chat: "Чат",
        reports: "Отчёты"
      },
    },

      


    operators: {
      and: "И",
      or: "ИЛИ",
      not: "НЕТ",
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
      loading: "Проверка…",
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
      verifySignature: "Проверить подпись.",
      reverify: "Проверить снова",
      missingSignature: "Подпись не найдена.",
      noReports: "Нет отчётов.",
      valid: "✅ Действителен",
      invalid: "⚠️ Недействителен",
      statusVerified: "Подтверждено",
lastVerified: "Последняя проверка",
messagePairs: "{{count}} пар сообщений",
source: "Источник",
sourceArchiveSelection: "Выбор архива",
export: "Экспорт отчёта",
close: "Закрыть",

    },
    system: {
      errorGeneric: "Ошибка.",
      errorLoad: "Не удалось загрузить архив.",
      errorSave: "Не удалось сохранить изменения.",
      successSave: "Сохранено ✓",
      loading: "Загрузка…",
      empty: "Пока ничего нет.",
      noSelectionToVerify: "Нет выбранных данных для проверки.",
nothingToVerify: "Нечего проверять.",
serverSealFailed: "Ошибка серверного запечатывания.",
unexpectedResponse: "Неожиданный ответ сервера.",
alreadyVerified:
  "Текст уже был проверен, и отчет уже существует в разделе отчетов."

    },
    tapToOpen: "Нажмите, чтобы открыть"
  },

  zh: {
  archive: {
    title: "存档",
    introText: "浏览、查看并选择过去的对话。",

      searchPlaceholder: "搜索存档…",
      noResults: "无匹配项。",
      empty: "尚无已保存的聊天。",
      loading: "正在加载存档…",
      viewMessage: "打开消息",
      viewChat: "打开聊天",
      back: "返回",
      add: "添加",
      startChat: "新聊天",
      verify: "验证",
      chatNumber: "聊天 {{chatNumber}}",
      totalMessages: "{{count}} 条消息",
      messageReference: '消息引用',
      keywords: "关键词",
      summarize: "总结",
      loadSelection: "加载选择",
      clearSelection: "清除",
      defaultHeader: "最近的聊天",
      selectionStatus: "已选择 {{count}} 对消息",
addToChat: "添加 {{count}}/4 到新聊天",
tooMany: "选择过多",
searchUserChats: "搜索聊天…",
 modes: {
        chat: "聊天",
        reports: "报告"
      },
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
      preparing: "准备报告…",
      success: "已验证 ✓",
      fail: "失败 ✗",
      cancelled: "验证已取消。",
      loading: "验证中…",
      close: "关闭"
    },
    intro: {
      header: "已上传上下文",
      subtext: "来自存档：",
      continue: "继续"
    },
    report: {
      title: "报告",
      subtitle: "本地验证的报告。",
      upload: "上传",
      uploadSuccess: "报告已上传 ✓",
      view: "打开",
      verifySignature: "验证签名。",
      reverify: "重新验证",
      missingSignature: "未找到签名。",
      noReports: "无报告。",
      valid: "✅ 有效",
      invalid: "⚠️ 无效",
      statusVerified: "已验证",
lastVerified: "上次验证",
messagePairs: "{{count}} 条消息对",
source: "来源",
sourceArchiveSelection: "存档选择",
export: "导出报告",
close: "关闭",

    },
    system: {
      errorGeneric: "错误。",
      errorLoad: "无法加载存档。",
      errorSave: "无法保存更改。",
      successSave: "已保存 ✓",
      loading: "加载中…",
      empty: "暂无内容。",
      noSelectionToVerify: "没有可验证的选择。",
nothingToVerify: "没有需要验证的内容。",
serverSealFailed: "服务器封存失败。",
unexpectedResponse: "服务器返回了意外的响应。",
alreadyVerified:
  "文本已被验证，报告已存在于报告部分。"

    },
    tapToOpen: "点击打开"
  },

  ja: {
  archive: {
    title: "アーカイブ",
    introText: "過去の会話を閲覧、確認、選択します。",

      searchPlaceholder: "アーカイブを検索…",
      noResults: "一致なし。",
      empty: "保存されたチャットはありません。",
      loading: "アーカイブを読み込み中…",
      viewMessage: "メッセージを開く",
      viewChat: "チャットを開く",
      back: "戻る",
      add: "追加",
      startChat: "新しいチャット",
      verify: "検証",
      chatNumber: "チャット {{chatNumber}}",
      totalMessages: "{{count}} 件のメッセージ",
      messageReference: 'メッセージ参照',
      keywords: "キーワード",
      summarize: "要約",
      loadSelection: "選択を読み込む",
      clearSelection: "クリア",
      defaultHeader: "最近のチャット",
      selectionStatus: "{{count}} メッセージペアを選択",
addToChat: "{{count}}/4 を新しいチャットに追加",
tooMany: "追加が多すぎます",
searchUserChats: "チャットを検索…",
modes: {
        chat: "チャット",
        reports: "レポート"
      },
    },

      


    operators: {
      and: "かつ",
      or: "または",
      not: "ではない",
      phrase: "フレーズ"
    },
    overlay: {
      header: "チャット {{chatNumber}}",
      verifyChat: "チャットを検証",
      downloadReport: "レポートをダウンロード",
      uploadReport: "レポートをアップロード",
      preparing: "レポートを準備中…",
      success: "検証済み ✓",
      fail: "エラー ✗",
      cancelled: "検証がキャンセルされました。",
      loading: "検証中…",
      close: "閉じる"
    },
    intro: {
      header: "コンテキストをアップロードしました",
      subtext: "アーカイブから：",
      continue: "続行"
    },
    report: {
      title: "レポート",
      subtitle: "ローカルで検証済みのレポート。",
      upload: "アップロード",
      uploadSuccess: "レポートをアップロード ✓",
      view: "開く",
      verifySignature: "署名を確認。",
      reverify: "再確認",
      missingSignature: "署名が見つかりません。",
      noReports: "レポートなし。",
      valid: "✅ 有効",
      invalid: "⚠️ 無効",
      statusVerified: "検証済み",
lastVerified: "最終検証",
messagePairs: "{{count}} 件のメッセージペア",
source: "ソース",
sourceArchiveSelection: "アーカイブ選択",
export: "レポートをエクスポート",
close: "閉じる",

    },
    system: {
      errorGeneric: "エラー。",
      errorLoad: "アーカイブを読み込めませんでした。",
      errorSave: "変更を保存できませんでした。",
      successSave: "保存済み ✓",
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
    title: "보관함",
    introText: "이전 대화를 탐색하고 검토하며 선택합니다.",

      searchPlaceholder: "보관함 검색…",
      noResults: "일치 항목 없음.",
      empty: "저장된 채팅이 없습니다.",
      loading: "보관함 불러오는 중…",
      viewMessage: "메시지 열기",
      viewChat: "채팅 열기",
      back: "뒤로",
      add: "추가",
      startChat: "새 채팅",
      verify: "검증",
      chatNumber: "채팅 {{chatNumber}}",
      totalMessages: "{{count}}개의 메시지",
      messageReference: '메시지 참조',
      keywords: "키워드",
      summarize: "요약",
      loadSelection: "선택 불러오기",
      clearSelection: "지우기",
      defaultHeader: "최근 채팅",
      selectionStatus: "{{count}}개 메시지 쌍 선택됨",
addToChat: "{{count}}/4개를 새 채팅에 추가",
tooMany: "추가 항목이 너무 많음",
searchUserChats: "채팅 검색…",
modes: {
        chat: "채팅",
        reports: "보고서"
      },
    },

      

    operators: {
      and: "그리고",
      or: "또는",
      not: "아니오",
      phrase: "구문"
    },
    overlay: {
      header: "채팅 {{chatNumber}}",
      verifyChat: "채팅 검증",
      downloadReport: "보고서 다운로드",
      uploadReport: "보고서 업로드",
      preparing: "보고서 준비 중…",
      success: "검증됨 ✓",
      fail: "오류 ✗",
      cancelled: "검증 취소됨.",
      loading: "검증 중…",
      close: "닫기"
    },
    intro: {
      header: "컨텍스트 업로드됨",
      subtext: "보관함에서:",
      continue: "계속"
    },
    report: {
      title: "보고서",
      subtitle: "로컬 검증 보고서.",
      upload: "업로드",
      uploadSuccess: "보고서 업로드됨 ✓",
      view: "열기",
      verifySignature: "서명 확인.",
      reverify: "재검증",
      missingSignature: "서명을 찾을 수 없습니다.",
      noReports: "보고서 없음.",
      valid: "✅ 유효함",
      invalid: "⚠️ 무효",
      statusVerified: "검증됨",
lastVerified: "마지막 검증",
messagePairs: "{{count}} 메시지 쌍",
source: "출처",
sourceArchiveSelection: "아카이브 선택",
export: "보고서 내보내기",
close: "닫기",

    },
    system: {
      errorGeneric: "오류.",
      errorLoad: "보관함을 불러오지 못했습니다.",
      errorSave: "변경사항을 저장하지 못했습니다.",
      successSave: "저장됨 ✓",
      loading: "로드 중…",
      empty: "아직 아무것도 없습니다.",
      noSelectionToVerify: "검증할 선택 항목이 없습니다.",
nothingToVerify: "검증할 내용이 없습니다.",
serverSealFailed: "서버 봉인에 실패했습니다.",
unexpectedResponse: "예기치 않은 서버 응답입니다.",
alreadyVerified:
  "텍스트는 이미 검증되었으며 보고서는 보고서 섹션에 이미 존재합니다."

    },
    tapToOpen: "열려면 탭하세요"
  },
  ar: {
  archive: {
    title: "الأرشيف",
    introText: "تصفح وراجع واختر المحادثات السابقة.",

      searchPlaceholder: "ابحث في الأرشيف…",
      noResults: "لا توجد نتائج.",
      empty: "لا توجد محادثات محفوظة بعد.",
      loading: "يتم تحميل الأرشيف…",
      viewMessage: "افتح الرسالة",
      viewChat: "افتح الدردشة",
      back: "رجوع",
      add: "إضافة",
      startChat: "دردشة جديدة",
      verify: "تحقق",
      chatNumber: "دردشة {{chatNumber}}",
      totalMessages: "{{count}} رسالة",
      messageReference: 'مرجع الرسالة',
      keywords: "كلمات مفتاحية",
      summarize: "تلخيص",
      loadSelection: "تحميل التحديد",
      clearSelection: "مسح",
      defaultHeader: "الدردشات الأخيرة",
      selectionStatus: "تم اختيار {{count}} من الأزواج",
addToChat: "أضف {{count}}/4 إلى دردشة جديدة",
tooMany: "عدد كبير للإضافة",
searchUserChats: "ابحث في الدردشات…",
modes: {
        chat: "دردشة",
        reports: "التقارير"
      },
    },
   
      

    operators: {
      and: "و",
      or: "أو",
      not: "ليس",
      phrase: "عبارة"
    },
    overlay: {
      header: "دردشة {{chatNumber}}",
      verifyChat: "تحقق من الدردشة",
      downloadReport: "تنزيل التقرير",
      uploadReport: "تحميل التقرير",
      preparing: "جارٍ إعداد التقرير…",
      success: "تم التحقق ✓",
      fail: "خطأ ✗",
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
      subtitle: "التقارير التي تم التحقق منها محليًا.",
      upload: "تحميل",
      uploadSuccess: "تم تحميل التقرير ✓",
      view: "فتح",
      verifySignature: "تحقق من التوقيع.",
      reverify: "إعادة التحقق",
      missingSignature: "لم يتم العثور على توقيع.",
      noReports: "لا توجد تقارير.",
      valid: "✅ صالح",
      invalid: "⚠️ غير صالح",
      statusVerified: "تم التحقق",
lastVerified: "آخر تحقق",
messagePairs: "{{count}} أزواج رسائل",
source: "المصدر",
sourceArchiveSelection: "اختيار الأرشيف",
export: "تصدير التقرير",
close: "إغلاق",

    },
    system: {
      errorGeneric: "خطأ.",
      errorLoad: "فشل تحميل الأرشيف.",
      errorSave: "فشل حفظ التغييرات.",
      successSave: "تم الحفظ ✓",
      loading: "جارٍ التحميل…",
      empty: "لا شيء هنا بعد.",
      noSelectionToVerify: "لا يوجد تحديد للتحقق.",
nothingToVerify: "لا يوجد ما يمكن التحقق منه.",
serverSealFailed: "فشل ختم الخادم.",
unexpectedResponse: "استجابة غير متوقعة من الخادم.",
alreadyVerified:
  "تم التحقق من النص بالفعل والتقرير موجود بالفعل في قسم التقارير."

    },
    tapToOpen: "اضغط للفتح"
  },

 hi: {
  archive: {
    title: "संग्रह",
    introText: "पिछली बातचीत ब्राउज़ करें, समीक्षा करें और चुनें।",

      searchPlaceholder: "संग्रह में खोजें…",
      noResults: "कोई परिणाम नहीं।",
      empty: "अभी तक कोई चैट सहेजी नहीं गई है।",
      loading: "संग्रह लोड हो रहा है…",
      viewMessage: "संदेश खोलें",
      viewChat: "चैट खोलें",
      back: "वापस",
      add: "जोड़ें",
      startChat: "नई चैट",
      verify: "सत्यापित करें",
      chatNumber: "चैट {{chatNumber}}",
      totalMessages: "{{count}} संदेश",
      messageReference: 'संदेश संदर्भ',
      keywords: "कीवर्ड",
      summarize: "सारांश बनाएं",
      loadSelection: "चयन लोड करें",
      clearSelection: "साफ करें",
      defaultHeader: "हाल की चैट",
      selectionStatus: "{{count}} संदेश जोड़े चुने गए",
addToChat: "{{count}}/4 नए चैट में जोड़ें",
tooMany: "जोड़ने के लिए बहुत अधिक",
searchUserChats: "चैट खोजें…",
modes: {
        chat: "चैट",
        reports: "रिपोर्ट"
      },
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
      preparing: "रिपोर्ट तैयार हो रही है…",
      success: "सत्यापित ✓",
      fail: "त्रुटि ✗",
      cancelled: "सत्यापन रद्द किया गया।",
      loading: "सत्यापन हो रहा है…",
      close: "बंद करें"
    },
    intro: {
      header: "संदर्भ अपलोड किया गया",
      subtext: "संग्रह से:",
      continue: "जारी रखें"
    },
    report: {
      title: "रिपोर्ट",
      subtitle: "स्थानीय रूप से सत्यापित रिपोर्ट।",
      upload: "अपलोड करें",
      uploadSuccess: "रिपोर्ट अपलोड की गई ✓",
      view: "खोलें",
      verifySignature: "हस्ताक्षर सत्यापित करें।",
      reverify: "फिर से सत्यापित करें",
      missingSignature: "हस्ताक्षर नहीं मिला।",
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

    },
    system: {
      errorGeneric: "त्रुटि।",
      errorLoad: "संग्रह लोड नहीं किया जा सका।",
      errorSave: "परिवर्तन सहेजे नहीं जा सके।",
      successSave: "सहेजा गया ✓",
      loading: "लोड हो रहा है…",
      empty: "यहां अभी कुछ नहीं है।",
      noSelectionToVerify: "सत्यापन के लिए कोई चयन नहीं है।",
nothingToVerify: "सत्यापित करने के लिए कुछ भी नहीं है।",
serverSealFailed: "सर्वर सील विफल हुई।",
unexpectedResponse: "सर्वर से अप्रत्याशित प्रतिक्रिया।",
alreadyVerified:
  "पाठ पहले ही सत्यापित किया जा चुका है और रिपोर्ट रिपोर्ट अनुभाग में पहले से मौजूद है।"

    },
    tapToOpen: "खोलने के लिए टैप करें"
  },

}