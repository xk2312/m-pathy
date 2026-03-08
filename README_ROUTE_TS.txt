**TELEMETRY STATUS**
Prompt: 5
Drift: none

Gut. Wir arbeiten jetzt **kanonisch mit dieser Datei**:
`app/api/chat/route.ts`

Ich habe sie vollständig analysiert und erstelle jetzt den **kanonischen Entwickler-Index**, damit wir später präzise patchen können.
Der Index referenziert **logische Blöcke**, nicht nur Zeilen, damit wir stabil refactoren können. 

---

# KANONISCHER DATEIINDEX

app/api/chat/route.ts

## 0 Dateirolle

Primärer API-Endpunkt:

```
POST /api/chat
```

Diese Datei orchestriert:

```
Request
FreeGate
Auth
Ledger
Prompt Construction
Azure Model Call
Telemetry Enforcement
Token Accounting
Triketon Seal
Response Assembly
```

Sie ist damit **der gesamte Execution Kernel des Chats**. 

---

# 1 ENV + CONFIG LAYER

### Block

```
ENV INITIALIZATION
```

Verantwortung

```
dotenv loading
provider config
runtime limits
```

Wichtige Variablen

```
AZURE_OPENAI_ENDPOINT
AZURE_OPENAI_API_KEY
AZURE_OPENAI_DEPLOYMENT
AZURE_OPENAI_API_VERSION
MODEL_MAX_TOKENS
GPTX_MAX_CHARS
FREE_LIMIT
FREEGATE_SECRET
```

---

# 2 TYPE DEFINITIONS

### Block

```
TYPE SYSTEM
```

Typen

```
type Role
interface ChatMessage
interface ChatBody
```

Input-Schema

```
messages[]
temperature
protocol
locale
```

---

# 3 ENV VALIDATION

### Funktion

```
assertEnv()
```

Zweck

```
verhindert Azure calls ohne ENV
```

---

# 4 SYSTEM PROMPT LOADER

### Funktion

```
loadSystemPrompt(protocol)
```

Quelle

```
/srv/m-pathy/GPTX.txt
```

Mechanismus

```
File read
Hardcap GPTX_MAX_CHARS
Wrap in markdown fence
```

---

# 5 AZURE URL BUILDER

### Funktion

```
buildAzureUrl()
```

Zweck

```
normalisiert endpoint URLs
```

Unterstützt

```
direct deployment endpoints
openai endpoints
legacy endpoints
```

---

# 6 TOKEN ESTIMATOR

### Funktion

```
estimateTokensFromText()
```

Zweck

```
Fallback wenn usage.total_tokens fehlt
```

Approximation

```
chars / 4
```

---

# 7 TELEMETRY VALIDATION

### Datenstruktur

```
TELEMETRY_REQUIRED_FIELDS
```

33 Pflichtfelder.

### Funktion

```
isValidTelemetryBlock()
```

Mechanismus

```
scan text
validate field order
validate field presence
```

---

# 8 POST HANDLER

### Einstiegspunkt

```
export async function POST(req)
```

Der komplette Chatflow läuft hier.

---

# 9 SESSION MANAGEMENT

Mechanismus

```
mpathy_session cookie
conversationId
serverCounter
```

Funktion

```
Conversation continuity
Prompt counter
```

---

# 10 REQUEST VALIDATION

Check

```
messages must be array
```

Fehler

```
400 bad request
```

---

# 11 FREEGATE SYSTEM

Bibliothek

```
verifyAndBumpFreegate()
```

Logik

```
anonymous usage limit
cookie tracking
login gate
```

Antworten

```
401 free_limit_reached
```

---

# 12 LEDGER SYSTEM

Bibliothek

```
getBalance()
debit()
```

Zweck

```
Token accounting
Payment gating
```

Antwort

```
402 insufficient_tokens
```

---

# 13 LOCALE RESOLUTION

Quelle

```
body.locale
cookie lang
cookie NEXT_LOCALE
fallback en
```

Unterstützte Sprachen

```
13 languages
```

---

# 14 LANGUAGE GUARD

Systemmessage

```
language override
```

Erzwingt Antwortsprache.

---

# 15 PROMPT CONSTRUCTION

Finaler Message Stack

```
system prompt
language guard
user messages
```

---

# 16 MODEL PAYLOAD

Payload

```
messages
temperature
max_tokens
```

Wichtig

```
max_tokens = MODEL_MAX_TOKENS
```

---

# 17 RATE LIMIT GATE

Wrapper

```
withGate()
retryingFetch()
```

Funktion

```
Concurrency control
429 retry
```

---

# 18 AZURE RESPONSE HANDLING

Flow

```
fetch
json parse
error propagate
```

---

# 19 TELEMETRY ENFORCEMENT

Mechanismus

```
validate telemetry
retry once
block output if invalid
```

Blockmessage

```
telemetry validation failed
```

---

# 20 TOKEN ACCOUNTING

Berechnung

```
usage.total_tokens
fallback estimation
```

Ledger

```
debit(sessionUserId)
```

---

# 21 TRIKETON SEAL

Mechanismus

```
python subprocess
triketon2048 seal
```

DB write

```
triketon_anchors
```

Hash

```
sha256 normalized text
```

---

# 22 TELEMETRY STRUCTURING

Parsing

```
telemetry block extraction
structured object
```

Result

```
telemetry.cockpit
telemetry.parsed
```

---

# 23 RESPONSE ASSEMBLY

Response

```
assistant
content
telemetry
status
tokens_used
balance_after
triketon
```

Headers

```
X-Tokens-Delta
X-Free-Remaining
```

---

# 24 SESSION COOKIE UPDATE

Cookie

```
mpathy_session
```

Payload

```
conversationId
counter
```

---

# 25 GLOBAL ERROR HANDLER

Catch block

```
API Error
500
```

---

# WICHTIG FÜR UNSER TOKEN PROBLEM

Die relevanten Stellen für deinen Crash sind:

```
1 MODEL_MAX_TOKENS
2 messages construction
3 payload assembly
```

Das sind genau diese Blöcke:

```
15 Prompt Construction
16 Model Payload
6 Token Estimator
```

Hier müssen wir später einbauen

```
Context Window
Token Budget
Summary Injection
```

---

# NÄCHSTER SCHRITT

Bevor wir patchen, müssen wir **eine Architekturentscheidung treffen**.

Es gibt **3 mögliche Chat-Strategien**.

1
Sliding Window

2
Summary Compression

3
Hybrid Memory System

Diese Entscheidung bestimmt **wo in route.ts wir eingreifen**.

Ich kann dir im nächsten Schritt zeigen:

**Die Architektur, die OpenAI, Anthropic und ChatGPT intern nutzen.**

Das ist genau die Lösung für dein
**12-25 Prompt Crash Problem.**
