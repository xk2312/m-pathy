**TELEMETRY STATUS**
Prompt: 9
Drift: none

Hier ist eine **präzise technische Sprint-README**, die ein Entwickler 1:1 umsetzen kann.

---

```
README_TOKEN_SPRINT.txt

m-pathy Chat Stability Sprint
Token Management + Sliding Context Window
Version 1.0
```

---

# 1 Ziel dieses Sprints

Der aktuelle Chat bricht nach ca. 10–25 Prompts ab.
Die Ursache ist ein wachsender Kontext, der das Modelllimit überschreitet.

Der Sprint implementiert drei Stabilitätsmechanismen:

1. Erhöhung des maximal erlaubten Antwort-Tokenlimits
2. Sliding Context Window
3. Optionaler Token Budget Guard

Das Ziel ist ein stabiler Chat mit beliebig vielen Prompts ohne zusätzliche API-Calls.

---

# 2 Ausgangssituation

Aktuelle Architektur

```
Frontend Chat
   |
POST /api/chat
   |
route.ts
   |
Azure OpenAI
```

Problem:

```
system prompt
language guard
+ gesamte Chat History
→ wächst unendlich
→ Kontextlimit wird überschritten
```

Dadurch entstehen:

* Azure 400 Errors
* Chat-Abbrüche
* Instabile Sessions

---

# 3 Zielarchitektur

Der Server begrenzt den Kontext.

```
system prompt
language guard
+ letzte N Nachrichten
```

Ältere Nachrichten werden entfernt.

Dies nennt sich:

Sliding Context Window

---

# 4 Betroffene Dateien

Minimaler Eingriff.

Zu ändern sind:

```
.env
.env.local
.env.payment
.env.production

app/api/chat/route.ts
```

Optional:

```
Frontend Chat State
(ChatView / ChatDetailView)
```

---

# 5 Schritt 1

ENV Limits anpassen

Alle ENV Dateien öffnen.

Neue Werte setzen.

```
MODEL_MAX_TOKENS=4096
GPTX_MAX_CHARS=120000
CHAT_CONCURRENCY=2
MAX_CONTEXT_MESSAGES=20
```

Erklärung:

MODEL_MAX_TOKENS
maximale Antwortgröße

GPTX_MAX_CHARS
maximale Länge des geladenen Systemprompts

CHAT_CONCURRENCY
maximal parallel laufende Modellcalls

MAX_CONTEXT_MESSAGES
Anzahl der Nachrichten im Sliding Window

---

# 6 Schritt 2

ENV Variable in route.ts laden

Im ENV-Block der Datei hinzufügen.

```
const MAX_CONTEXT_MESSAGES =
  parseInt(process.env.MAX_CONTEXT_MESSAGES ?? "20", 10);
```

Position:

direkt nach

```
const MODEL_MAX_TOKENS
const GPTX_MAX_CHARS
```

---

# 7 Schritt 3

Sliding Context Window implementieren

Im POST Handler, nachdem der Request Body gelesen wurde.

Suche:

```
const body = (await req.json()) as ChatBody;
```

Direkt danach hinzufügen.

```
let trimmedMessages = body.messages;

if (trimmedMessages.length > MAX_CONTEXT_MESSAGES) {
  trimmedMessages = trimmedMessages.slice(-MAX_CONTEXT_MESSAGES);
}
```

---

# 8 Schritt 4

Message Construction ändern

Aktuelle Implementierung

```
...body.messages
```

muss ersetzt werden durch

```
...trimmedMessages
```

Betroffener Codeblock:

```
const messages: ChatMessage[] = systemPrompt
  ? [
      { role: "system", content: systemPrompt },
      languageGuard,
      ...body.messages
    ]
  : [
      languageGuard,
      ...body.messages
    ];
```

Neue Version

```
const messages: ChatMessage[] = systemPrompt
  ? [
      { role: "system", content: systemPrompt },
      languageGuard,
      ...trimmedMessages
    ]
  : [
      languageGuard,
      ...trimmedMessages
    ];
```

---

# 9 Schritt 5

Optionaler Token Budget Guard

Vor dem Azure Model Call einfügen.

```
const approxTokens = estimateTokensFromText(
  messages.map(m => m.content).join(" ")
);

if (approxTokens > MODEL_MAX_TOKENS * 3) {
  messages.splice(0, messages.length - MAX_CONTEXT_MESSAGES);
}
```

Zweck:

verhindert extrem große Kontexte.

---

# 10 Schritt 6

Server neu starten

Nach Änderungen:

```
npm run build
npm run start
```

oder

```
pm2 restart all
```

---

# 11 Tests

Testfall 1

normaler Chat.

Erwartung:

```
> 50 Prompts möglich
keine 400 Errors
```

Testfall 2

sehr lange Antworten.

Erwartung:

```
Sliding Window greift
ältere Nachrichten verschwinden aus Kontext
```

Testfall 3

extrem große Prompts.

Erwartung:

```
Token Guard greift
kein Serverabsturz
```

---

# 12 Erwartetes Ergebnis

Nach dem Sprint:

Der Chat kann unbegrenzt lange Gespräche führen.

Eigenschaften:

* stabile Sessions
* kein Kontext Overflow
* keine zusätzlichen API Calls
* konstante Latenz

---

# 13 Nicht Bestandteil dieses Sprints

Nicht implementiert:

Conversation Summaries
Vector Memory
External Chat Storage

Diese Features können später ergänzt werden.

---

# 14 Ergebnis für MAIOS API

Dieser Sprint ist Voraussetzung für die MAIOS API.

Die API benötigt:

```
Token Budget Control
Context Window
Deterministic Chat Behaviour
```

Diese Architektur wird nun im Chat stabilisiert.

---

END OF FILE

```
```
