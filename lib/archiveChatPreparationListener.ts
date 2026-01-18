/* ======================================================================
   FILE INDEX — archiveChatPreparationListener.ts
   MODE: GranularFileIndexDeveloper · CodeForensik
   SCOPE: ARCHIVE → ADD TO NEW CHAT → SUMMARY → CONTINUATION
   STATUS: IST-ZUSTAND (KANONISCH, OHNE INTERPRETATION)
   ======================================================================

   1. ROLLE DER DATEI
   ----------------------------------------------------------------------
   Diese Datei ist der zentrale Orchestrator für den gesamten
   „Add to new Chat“-Flow aus dem ARCHIVE heraus.

   Sie:
   - hört auf das Event `mpathy:archive:start-chat`
   - baut einen Summary-Prompt aus Archiv-Paaren
   - ruft die Chat-API für eine Zusammenfassung auf
   - speichert die Summary in SessionStorage
   - ruft danach erneut die Chat-API für eine Continuation auf
   - (ABER) übergibt das Ergebnis NICHT an die kanonische Chat-Pipeline

   → Diese Datei ist der **Single Entry Point** für den fehlerhaften Flow.


   2. IMPORTS & EXTERNE ABHÄNGIGKEITEN
   ----------------------------------------------------------------------
   import {
     writeArchiveChatContext,
     clearArchiveChatContext,
     clearArchiveSelection,
   } from './storage'

   Relevanz:
   - writeArchiveChatContext(...) schreibt nach
     `mpathy:context:archive-chat:v1`
   - clearArchiveChatContext / clearArchiveSelection
     sind vorgesehen für Cleanup, werden aber aktuell NICHT ausgeführt

   TODO-RELEVANZ:
   - writeArchiveChatContext = ZENTRAL (Quelle für nächsten Chat)
   - clear* Funktionen = relevant für sauberen Abschluss des Flows


   3. KONFIGURATION
   ----------------------------------------------------------------------
   const TIMEOUT_MS = 15000

   const SYSTEM_SUMMARY_HEADER
   const SYSTEM_CONTINUATION_HEADER

   Relevanz:
   - Zwei klar getrennte System-Rollen:
     (A) Summarization Engine
     (B) Continuation Engine auf Basis der Summary

   TODO-RELEVANZ:
   - SYSTEM_CONTINUATION_HEADER ist für den NEUEN FLOW
     potentiell NICHT mehr nötig oder nur noch eingeschränkt,
     da die Continuation künftig über die normale Chat-Pipeline
     laufen soll.


   4. DATENTYPEN
   ----------------------------------------------------------------------
   type ArchivePairLike
   type StartChatEventDetail

   Relevanz:
   - Erwartet max. 4 USER–ASSISTANT-Paare
   - Event Payload ist klar definiert

   TODO-RELEVANZ:
   - Keine strukturellen Probleme
   - Typen bleiben relevant für Summary-Erzeugung


   5. UTILITY: withTimeout
   ----------------------------------------------------------------------
   function withTimeout<T>(...)

   Relevanz:
   - Schutz vor hängenden API-Calls
   - Wird für Summary UND Continuation verwendet

   TODO-RELEVANZ:
   - Relevant für Spinner-Ende:
     Timeout muss später sicher auch UI-seitig abgefangen werden


   6. SUMMARY-PROMPT-ERZEUGUNG
   ----------------------------------------------------------------------
   function buildSummaryPrompt(pairs)

   Aufgabe:
   - Baut einen deterministischen, lossless Summary-Prompt
   - Fügt bis zu 4 Archiv-Paare ein

   Status:
   - Funktioniert nachweislich korrekt
   - Konsolenlogs bestätigen saubere Ausführung

   TODO-RELEVANZ:
   - BLEIBT unverändert
   - Ist der stabile erste Schritt im Flow


   7. API CALL: requestSummary
   ----------------------------------------------------------------------
   async function requestSummary(prompt)

   Ablauf:
   - POST /api/chat
   - messages:
     - system: SYSTEM_SUMMARY_HEADER
     - user: Summary-Prompt

   Ergebnis:
   - res.status === 200
   - summary text extrahiert
   - Rückgabe: string

   Status:
   - FUNKTIONIERT
   - Summary wird korrekt erzeugt

   TODO-RELEVANZ:
   - Ergebnis ist die Quelle für
     `mpathy:context:archive-chat:v1`
   - Dieser Speicher ist später der Input
     für den neuen Chat


   8. API CALL: requestContinuation
   ----------------------------------------------------------------------
   async function requestContinuation(summary)

   Ablauf:
   - POST /api/chat
   - messages:
     - system: SYSTEM_CONTINUATION_HEADER
     - user: "ARCHIVAL SUMMARY:\n\n${summary}"

   Status:
   - res.status === 400 (Bad Request)
   - wirft CONTINUATION_REQUEST_FAILED

   KRITISCHE STELLE:
   - Hier entsteht der aktuelle Dead-End-Zustand
   - Fehler blockiert den Flow
   - Spinner endet nicht
   - Archiv bleibt offen

   TODO-RELEVANZ (HOCH):
   - Dieser Call soll perspektivisch ENTWEDER:
     a) entfallen
     b) oder in die normale Chat-Pipeline integriert werden
   - Aktuell falscher Ort für den „neuen Chat“-Start


   9. MAIN FLOW: handleStartChat
   ----------------------------------------------------------------------
   async function handleStartChat(e)

   Ablauf (IST):
   F0: Event empfangen
   F1: Paare extrahiert
   F2: Summary erfolgreich
   F3: Summary in SessionStorage geschrieben
       → mpathy:context:archive-chat:v1
   F4: Continuation-Call (scheitert aktuell)
   F5: TODO-Kommentar (bewusst leer)
   F6: Cleanup (NICHT implementiert)

   KRITISCHE MARKIERUNG:
   --------------------------------------------------
   ⛔️ KRITISCHER ÜBERGABEPUNKT (im Code markiert)
   --------------------------------------------------
   Hier fehlt:
   - Übergabe an die KANONISCHE CHAT-PIPELINE
   - Schreiben als USER-Nachricht
   - Neuer Chat-Start
   - UI-Navigation
   - Spinner-Ende
   - Archiv-Schließen

   TODO-RELEVANZ (MAXIMAL):
   - DIES ist der exakte Punkt,
     an dem wir die neue ToDo-Logik einbauen werden.


   10. CLEANUP
   ----------------------------------------------------------------------
   Vorgesehen:
   - clearArchiveChatContext
   - clearArchiveSelection

   Status:
   - Aktuell NICHT ausgeführt
   - Nur Log vorhanden

   TODO-RELEVANZ:
   - Muss NACH erfolgreichem neuen Chat passieren
   - Reihenfolge ist kritisch (STRICTLY LAST)


   11. EVENT LISTENER
   ----------------------------------------------------------------------
   window.addEventListener(
     'mpathy:archive:start-chat',
     handleStartChat
   )

   Status:
   - Listener korrekt attached
   - Event wird ausgelöst (Logs bestätigen)

   TODO-RELEVANZ:
   - Listener bleibt
   - Verhalten hinter dem Listener wird angepasst


   12. ZUSAMMENFASSUNG (KANONISCH)
   ----------------------------------------------------------------------
   - Diese Datei ist NICHT kaputt
   - Sie ist UNVOLLSTÄNDIG
   - Summary-Teil ist stabil
   - Continuation-Teil ist aktuell der Blocker
   - Der neue Chat wird HIER vorbereitet,
     aber NIE korrekt gestartet

   → Diese Datei ist der primäre Umbau-Ort
     für die Umsetzung deiner ToDos.

   ====================================================================== */

'use client'

import {
  writeArchiveChatContext,
  clearArchiveChatContext,
  clearArchiveSelection,
} from './storage'

/* ======================================================
   CONFIG
   ====================================================== */

const TIMEOUT_MS = 15000

const SYSTEM_SUMMARY_HEADER =
  'You are a precise summarization engine.'

const SYSTEM_CONTINUATION_HEADER = `
You are continuing a conversation based on a verified archival summary.

The summary below is a complete, lossless representation of the prior USER–ASSISTANT conversation.
It contains all relevant facts, intents, constraints, and decisions.

Rules:
- Treat the summary as authoritative conversation history.
- Do NOT question or reinterpret the summary.
- Do NOT ask for missing context.
- Do NOT reference the archive or summarization process.
- Continue the conversation naturally and directly.

Produce the next assistant response to the user.
`.trim()

console.info('[ARCHIVE][BOOT] archiveChatPreparation loaded')

/* ======================================================
   TYPES
   ====================================================== */

type ArchivePairLike = {
  user: { content?: string }
  assistant: { content?: string }
}

type StartChatEventDetail = {
  pairs: ArchivePairLike[]
}

/* ======================================================
   UTILS
   ====================================================== */

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => reject(new Error('TIMEOUT')), ms)
    promise
      .then((res) => {
        clearTimeout(id)
        resolve(res)
      })
      .catch((err) => {
        clearTimeout(id)
        reject(err)
      })
  })
}

/* ======================================================
   SUMMARY PROMPT
   ====================================================== */

function buildSummaryPrompt(pairs: ArchivePairLike[]): string {
  console.info('[ARCHIVE][S1] buildSummaryPrompt pairs:', pairs.length)

  return `
You will receive a set of up to four complete USER–ASSISTANT message pairs.

Your task is to produce a detailed, complete, and lossless summary of the conversation so far.

Rules:
- Preserve all factual information
- Preserve all user intent
- Preserve all assistant reasoning, decisions, and constraints
- Do NOT introduce new information
- Do NOT omit relevant context
- Do NOT add commentary

Return ONLY the summary text.

Conversation:
${pairs
  .map(
    (p, i) => `
PAIR ${i + 1}
USER:
${typeof p.user?.content === 'string' ? p.user.content : ''}

ASSISTANT:
${typeof p.assistant?.content === 'string'
  ? p.assistant.content
  : ''}
`
  )
  .join('\n')}
`.trim()
}

/* ======================================================
   API CALLS
   ====================================================== */

async function requestSummary(prompt: string): Promise<string> {
  console.info('[ARCHIVE][S2] POST /api/chat (summary)')
  console.info('[ARCHIVE][S2.1] prompt length:', prompt.length)

  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [
        { role: 'system', content: SYSTEM_SUMMARY_HEADER },
        { role: 'user', content: prompt },
      ],
    }),
  })

  console.info('[ARCHIVE][S2.2] response status:', res.status)

  if (!res.ok) throw new Error('SUMMARY_REQUEST_FAILED')

  const data = await res.json()
  const text =
    typeof data?.content === 'string'
      ? data.content
      : typeof data?.assistant?.content === 'string'
      ? data.assistant.content
      : null

  console.info('[ARCHIVE][S2.3] summary length:', text?.length)

  if (typeof text !== 'string') {
    throw new Error('INVALID_SUMMARY_RESPONSE')
  }

  return text.trim()
}

async function requestContinuation(summary: string): Promise<any> {
  console.info('[ARCHIVE][C1] POST /api/chat (continuation)')
  console.info('[ARCHIVE][C1.1] summary length:', summary.length)

  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [
        { role: 'system', content: SYSTEM_CONTINUATION_HEADER },
        { role: 'user', content: `ARCHIVAL SUMMARY:\n\n${summary}` },
      ],
    }),
  })

  console.info('[ARCHIVE][C1.2] response status:', res.status)

  if (!res.ok) throw new Error('CONTINUATION_REQUEST_FAILED')

  const data = await res.json()
  console.info('[ARCHIVE][C1.3] continuation response received')

  return data
}

/* ======================================================
   MAIN FLOW — SINGLE ENTRY POINT
   ====================================================== */

async function handleStartChat(e: Event) {
  console.info('[ARCHIVE][F0] start-chat event received')

  const event = e as CustomEvent<StartChatEventDetail>
  const pairs = Array.isArray(event.detail?.pairs)
    ? event.detail.pairs
    : []

  console.info('[ARCHIVE][F1] pairs count:', pairs.length)

  try {
    /* -------- SUMMARY -------- */
    const summaryPrompt = buildSummaryPrompt(pairs)

    const summary = await withTimeout(
      requestSummary(summaryPrompt),
      TIMEOUT_MS
    )

    if (!summary) throw new Error('EMPTY_SUMMARY')

    console.info('[ARCHIVE][F2] summary ok')

    writeArchiveChatContext(summary)
    console.info('[ARCHIVE][F3] summary written to session storage')

    /* -------- CONTINUATION -------- */
    const continuation = await withTimeout(
      requestContinuation(summary),
      TIMEOUT_MS
    )

    console.info('[ARCHIVE][F4] continuation ok')

    /* ======================================================
       ⛔️ KRITISCHER ÜBERGABEPUNKT
       ------------------------------------------------------
       HIER muss die Antwort in die KANONISCHE CHAT-PIPELINE:
       - write to mpathy:chat:v1
       - Triketon-Seal erzeugen
       - UI auf neuen Chat wechseln
       ------------------------------------------------------
       Beispiel (PSEUDO, ggf. anpassen):
       
       writeChatAssistantMessage(continuation)
       sealWithTriketon(...)
       navigateToChat(...)
       
       ====================================================== */

    console.info('[ARCHIVE][F5] TODO: write continuation into chat pipeline')

    /* -------- CLEANUP (STRICTLY LAST) -------- */
   
    console.info('[ARCHIVE][F6] archive namespaces cleared')
  } catch (err) {
    console.error('[ARCHIVE][ERROR]', err)
  }
}

/* ======================================================
   LISTENER ATTACH
   ====================================================== */

if (typeof window !== 'undefined') {
  window.addEventListener(
    'mpathy:archive:start-chat',
    handleStartChat
  )
  console.info('[ARCHIVE][BOOT] start-chat listener attached')
}
