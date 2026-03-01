/*# 📑 FILE INDEX - archiveVerifyListener.ts

## FILE

`archiveVerifyListener.ts`

## ROLE (1 Satz)

Zentraler **Verify-Orchestrator** für das Archiv: verarbeitet selektierte Nachrichtenpaare, erzeugt kanonischen Wahrheitstext, führt Server-Seal durch und erzeugt einen unveränderlichen Verifikationsreport.

## TOUCH

**NEIN - streng gesperrt**

Diese Datei ist **nicht zu verändern** im Rahmen der Injection-Arbeit. Sie dient als **Referenz- und Schutzkomponente**.

---

## WHY (Warum diese Datei relevant ist)

* Sie erklärt **warum aktuell ein Klick auf „Add to new chat“ trotzdem Verify auslöst**.
* Sie definiert den kompletten Verify-Flow inkl.:

  * Kanonisierung
  * Server-Kommunikation
  * Report-Erzeugung
  * Event-Rückkanäle
* Sie ist das **Gegenstück** zur geplanten Injection-Logik.

---

## DANGERS (Absolute No-Gos)

❌ Kein Umbennen von `EVENT_NAME`
❌ Keine Erweiterung um `inject`-Logik
❌ Keine Wiederverwendung für andere Intents
❌ Keine Änderung an Kanonisierung oder Sortierung
❌ Keine Änderung an Server-Endpoint oder Payload
❌ Keine Vermischung mit Session-Storage

Diese Datei ist **beweis- und sicherheitskritisch**.

---

## ANCHORS (Relevante Codebereiche)

### 1️⃣ Globales Event & Intent-Gate

```ts
const EVENT_NAME = 'mpathy:archive:verify'
```

```ts
const intent = custom.detail?.intent
if (intent !== 'verify') return
```

* **JEDES** Event mit diesem Namen und `intent: 'verify'` löst den Verify-Prozess aus.
* Genau deshalb triggert aktuell auch der „Add to new chat“-Button Verify.

➡️ Lösung erfolgt **nicht hier**, sondern durch **neues Event** im Overlay.

---

### 2️⃣ Auswahl der Paare (Prioritätslogik)

```ts
const selectionFromSS = readArchiveSelection().pairs ?? []
const selectionFromEvent = custom.detail?.pairs ?? []
const selection = selectionFromSS.length > 0
  ? selectionFromSS
  : selectionFromEvent
```

* Session Storage hat Vorrang vor Event-Payload.
* Garantiert Stabilität bei UI-Race-Conditions.

➡️ Injection darf **nicht** diese Logik nutzen.

---

### 3️⃣ Kanonisierung (Truth Text)

```ts
buildCanonicalTruthText(pairs)
```

* Sortierung nach `pair_id`
* USER / ASSISTANT strikt alternierend
* Whitespace-normalisiert

➡️ Diese Funktion ist **nur für Verify**.

---

### 4️⃣ Device-bound Public Key

```ts
mpathy:triketon:device_public_key_2048
```

* Bindet Verify an ein physisches Gerät
* Zentral für Beweiskette und Patentlogik

➡️ Injection darf diesen Key **nicht benötigen**.

---

### 5️⃣ Server-Seal (WRITE / SEAL)

```ts
fetch('/api/triketon/seal', { intent: 'seal' })
```

* Server berechnet Wahrheitshash
* Hash wird **nicht clientseitig berechnet**
* Client sendet bewusst Decoy-Hashes

➡️ Injection **nutzt keinen Seal-Endpoint**.

---

### 6️⃣ Result Handling: IGNORED vs SEALED

* `IGNORED` → bereits verifiziert, kein neuer Report
* `SEALED` → neuer Report wird gebaut

➡️ Injection kennt **keine Reports**.

---

### 7️⃣ Report-Erzeugung & Persistenz

```ts
persistReport(report)
```

* Append-only
* Speicherort: `mpathy:verification:reports:v1`

➡️ Injection darf hier **niemals** schreiben.

---

### 8️⃣ UI-Rückkanäle (Events)

```ts
mpathy:archive:verify:error
mpathy:archive:verify:info
mpathy:archive:verify:report
mpathy:archive:verify:success
```

* Steuern UI-Wechsel (CHAT → REPORTS)
* Löschen Selection

➡️ Injection bekommt **eigene Event-Namespace**.

---

## Relevanz für Injection (klar abgegrenzt)

**Diese Datei ist relevant für:**

* Verständnis des bestehenden Verify-Flows
* Erklärung des aktuellen Fehlverhaltens

**Diese Datei ist NICHT zuständig für:**

* Summary-Erzeugung
* Session-Storage
* Chat-Initialisierung
* UI-Loading-States

---

## Kurzfazit (für Dev-Team)

`archiveVerifyListener.ts` ist ein **abgeschlossener, geschützter Prozess**.

➡️ Verify = Versiegelung + Beweis
➡️ Injection = Kontextaufbereitung + Chatstart

**Beides darf sich nicht berühren.**
*/

import { readArchiveSelection } from '@/lib/storage'
import { storageVault } from '@/lib/storageVault'
import type { ArchivePair } from '@/lib/storage'
import type { TVerificationReport } from '@/lib/types'

const EVENT_NAME = 'mpathy:archive:verify'

type VerifyEventDetail = {
  intent: 'verify'
  pairs?: ArchivePair[]
}


let isInitialized = false

function buildCanonicalTruthText(pairs: ArchivePair[]): string {
  return pairs
    .slice()
    .sort((a, b) => a.pair_id.localeCompare(b.pair_id))
    .map(
      (p) =>
        `USER:\n${p.user.content}\n\nASSISTANT:\n${p.assistant.content}`,
    )
    .join('\n\n')
    .trim()
}

async function persistReport(report: TVerificationReport) {
  const key = 'mpathy:verification:reports:v1'
  const existing =
    ((await storageVault.get(key)) as TVerificationReport[] | undefined) ?? []
  await storageVault.put(key, [...existing, report])
}

function resolveLang(): string {
  if (typeof document !== 'undefined' && document.documentElement.lang) {
    return document.documentElement.lang.split('-')[0]
  }
  if (typeof navigator !== 'undefined' && navigator.language) {
    return navigator.language.split('-')[0]
  }
  return 'en'
}

const VERIFY_MESSAGES: Record<
  string,
  Record<string, string>
> = {
  en: {
    NO_SELECTION: 'No selection made.',
    EMPTY_TEXT: 'Selected content is empty.',
    SEAL_FAILED: 'Verification failed. Please try again.',
    BAD_SERVER_RESULT: 'Unexpected server result.',
    ALREADY_VERIFIED: 'This selection has already been verified.',
  },
  de: {
    NO_SELECTION: 'Keine Auswahl getroffen.',
    EMPTY_TEXT: 'Der ausgewählte Inhalt ist leer.',
    SEAL_FAILED: 'Verifizierung fehlgeschlagen. Bitte erneut versuchen.',
    BAD_SERVER_RESULT: 'Unerwartete Server-Antwort.',
    ALREADY_VERIFIED: 'Diese Auswahl wurde bereits verifiziert.',
  },
  fr: {
  NO_SELECTION: 'Aucune sélection effectuée.',
  EMPTY_TEXT: 'Le contenu sélectionné est vide.',
  SEAL_FAILED: 'La vérification a échoué. Veuillez réessayer.',
  BAD_SERVER_RESULT: 'Résultat du serveur inattendu.',
  ALREADY_VERIFIED: 'Cette sélection a déjà été vérifiée.',
},

es: {
  NO_SELECTION: 'No se ha realizado ninguna selección.',
  EMPTY_TEXT: 'El contenido seleccionado está vacío.',
  SEAL_FAILED: 'La verificación falló. Por favor, inténtalo de nuevo.',
  BAD_SERVER_RESULT: 'Resultado del servidor inesperado.',
  ALREADY_VERIFIED: 'Esta selección ya ha sido verificada.',
},

it: {
  NO_SELECTION: 'Nessuna selezione effettuata.',
  EMPTY_TEXT: 'Il contenuto selezionato è vuoto.',
  SEAL_FAILED: 'Verifica non riuscita. Riprova.',
  BAD_SERVER_RESULT: 'Risultato del server inatteso.',
  ALREADY_VERIFIED: 'Questa selezione è già stata verificata.',
},

pt: {
  NO_SELECTION: 'Nenhuma seleção feita.',
  EMPTY_TEXT: 'O conteúdo selecionado está vazio.',
  SEAL_FAILED: 'A verificação falhou. Tente novamente.',
  BAD_SERVER_RESULT: 'Resultado inesperado do servidor.',
  ALREADY_VERIFIED: 'Esta seleção já foi verificada.',
},

nl: {
  NO_SELECTION: 'Geen selectie gemaakt.',
  EMPTY_TEXT: 'De geselecteerde inhoud is leeg.',
  SEAL_FAILED: 'Verificatie mislukt. Probeer het opnieuw.',
  BAD_SERVER_RESULT: 'Onverwacht serverresultaat.',
  ALREADY_VERIFIED: 'Deze selectie is al geverifieerd.',
},

ru: {
  NO_SELECTION: 'Выбор не сделан.',
  EMPTY_TEXT: 'Выбранный контент пуст.',
  SEAL_FAILED: 'Ошибка проверки. Пожалуйста, попробуйте снова.',
  BAD_SERVER_RESULT: 'Неожиданный результат сервера.',
  ALREADY_VERIFIED: 'Этот выбор уже был проверен.',
},

zh: {
  NO_SELECTION: '未进行选择。',
  EMPTY_TEXT: '所选内容为空。',
  SEAL_FAILED: '验证失败。请重试。',
  BAD_SERVER_RESULT: '服务器返回异常结果。',
  ALREADY_VERIFIED: '该选择已被验证。',
},

ja: {
  NO_SELECTION: '選択が行われていません。',
  EMPTY_TEXT: '選択された内容が空です。',
  SEAL_FAILED: '検証に失敗しました。もう一度お試しください。',
  BAD_SERVER_RESULT: '予期しないサーバー結果です。',
  ALREADY_VERIFIED: 'この選択はすでに検証されています。',
},

ko: {
  NO_SELECTION: '선택이 이루어지지 않았습니다.',
  EMPTY_TEXT: '선택된 콘텐츠가 비어 있습니다.',
  SEAL_FAILED: '검증에 실패했습니다. 다시 시도해주세요.',
  BAD_SERVER_RESULT: '예상치 못한 서버 결과입니다.',
  ALREADY_VERIFIED: '이 선택은 이미 검증되었습니다.',
},

ar: {
  NO_SELECTION: 'لم يتم إجراء أي تحديد.',
  EMPTY_TEXT: 'المحتوى المحدد فارغ.',
  SEAL_FAILED: 'فشلت عملية التحقق. يرجى المحاولة مرة أخرى.',
  BAD_SERVER_RESULT: 'نتيجة غير متوقعة من الخادم.',
  ALREADY_VERIFIED: 'تم التحقق من هذا التحديد بالفعل.',
},

hi: {
  NO_SELECTION: 'कोई चयन नहीं किया गया है।',
  EMPTY_TEXT: 'चयनित सामग्री खाली है।',
  SEAL_FAILED: 'सत्यापन विफल रहा। कृपया पुनः प्रयास करें।',
  BAD_SERVER_RESULT: 'सर्वर से अप्रत्याशित परिणाम।',
  ALREADY_VERIFIED: 'यह चयन पहले ही सत्यापित किया जा चुका है।',
},

}

function msg(code: string): string {
  const lang = resolveLang()
  return (
    VERIFY_MESSAGES[lang]?.[code] ??
    VERIFY_MESSAGES.en[code] ??
    code
  )
}

export function initArchiveVerifyListener() {
  if (isInitialized) return
  isInitialized = true

  window.addEventListener(EVENT_NAME, async (event: Event) => {
    const custom = event as CustomEvent<VerifyEventDetail>
    const intent = custom.detail?.intent

    if (intent !== 'verify') return

    const selectionFromSS = readArchiveSelection().pairs ?? []
const selectionFromEvent = custom.detail?.pairs ?? []
const selection: ArchivePair[] =
  selectionFromSS.length > 0 ? selectionFromSS : selectionFromEvent

    if (!selection || selection.length === 0) {
      window.dispatchEvent(
  new CustomEvent('mpathy:archive:verify:error', {
    detail: {
      code: 'NO_SELECTION',
      message: msg('NO_SELECTION'),
    },
  }),
)


      return
    }

    const canonicalText = buildCanonicalTruthText(selection)
    if (!canonicalText) {
    window.dispatchEvent(
  new CustomEvent('mpathy:archive:verify:error', {
    detail: {
      code: 'EMPTY_TEXT',
      message: msg('EMPTY_TEXT'),
    },
  }),
)


      return
    }

  const publicKey =
  ((await storageVault.get(
    'mpathy:triketon:device_public_key_2048',
  )) as string | undefined) ??
  localStorage.getItem('mpathy:triketon:device_public_key_2048')

if (!publicKey || typeof publicKey !== 'string') {
  console.error(
    '[ArchiveVerify] Device public key missing or invalid',
  )
  return
}


    // 4. Send WRITE / SEAL request to server
   // --- decoy hashes (client-side distraction only) ---
const decoyHash1 = crypto.randomUUID().replace(/-/g, '')
const decoyHash2 = crypto.randomUUID().replace(/-/g, '')

const response = await fetch('/api/triketon/seal', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    intent: 'seal',
    publicKey,
    text: canonicalText,

    // noise / distraction (server MUST ignore)
    truthHash: decoyHash1,
    truthHash2: decoyHash2,

    protocol_version: 'v1',
    source: 'archive-selection',
  }),
})

if (!response.ok) {
 window.dispatchEvent(
  new CustomEvent('mpathy:archive:verify:error', {
    detail: {
      code: 'SEAL_FAILED',
      message: msg('SEAL_FAILED'),
    },
  }),
)


  return
}

const result = await response.json()
if (result?.result !== 'SEALED' && result?.result !== 'IGNORED') {
 window.dispatchEvent(
  new CustomEvent('mpathy:archive:verify:error', {
    detail: {
      code: 'BAD_SERVER_RESULT',
      message: msg('BAD_SERVER_RESULT'),
    },
  }),
)


  return
}

// ─────────────────────────────
// NEW: already verified → no new report
// ─────────────────────────────
if (result?.result === 'IGNORED') {
 window.dispatchEvent(
  new CustomEvent('mpathy:archive:verify:info', {
    detail: {
      code: 'ALREADY_VERIFIED',
      message: msg('ALREADY_VERIFIED'),
    },
  }),
)



  // Clear selection even if no report is created
  window.dispatchEvent(
    new CustomEvent('mpathy:archive:selection:clear'),
  )
  return
}

// ─────────────────────────────
// SEALED → build report
// ─────────────────────────────
const report: TVerificationReport = {
  protocol_version: 'v1',
  generated_at: new Date().toISOString(),
  source: 'archive-selection',

  pair_count: selection.length,
  status: 'verified',
  last_verified_at: new Date().toISOString(),
  public_key: publicKey,

  content: {
    canonical_text: canonicalText,
    pairs: selection.map((p) => ({
      pair_id: p.pair_id,
      user: {
        content: p.user.content,
        timestamp: p.user.timestamp,
      },
      assistant: {
        content: p.assistant.content,
        timestamp: p.assistant.timestamp,
      },
    })),
  },

  truth_hash: result?.truth_hash,
  hash_profile: result?.hash_profile,
  key_profile: result?.key_profile,
  seal_timestamp: result?.timestamp,
}

// Persist report (append-only)
await persistReport(report)
// Notify UI
window.dispatchEvent(
  new CustomEvent('mpathy:archive:verify:report', {
    detail: report,
  }),
)

// Explicit verify success signal (CHAT → REPORTS)
window.dispatchEvent(
  new CustomEvent('mpathy:archive:verify:success', {
    detail: {
      at: new Date().toISOString(),
    },
  }),
)



// Clear selection AFTER report is safely stored
window.dispatchEvent(
  new CustomEvent('mpathy:archive:selection:clear'),
)



  })
}
