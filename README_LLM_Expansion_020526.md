# README_LLM_Expansion_020526.md

## Status

Status: Zwischenstand  
Datum: 2026-05-02  
Scope: M13 LLM Expansion  
Zweck: Technische Dokumentation der Modellanbindung, Adapterlogik, ENV Erweiterung und Testergebnisse  
Nicht enthalten: Finale API Route, finaler Patchplan, finale Billing Implementierung

Dieses Dokument friert den aktuellen technischen Erkenntnisstand zur Erweiterung der LLM Anbindung ein. Es ist modular aufgebaut und soll fortlaufend ergänzt werden, sobald weitere Modelle, Adapter, Tests oder Billing Details bestätigt sind.

---

## 1. Ausgangslage

Die bestehende produktive Chat Route nutzt bereits ein GPT 4.1 Deployment über Azure OpenAI.

Bestehender Bereich:

```txt
/api/chat
Azure OpenAI
GPT 4.1
bestehender Chat Space
bestehender Triketon Space
bestehende Tokenlogik
```

Dieser bestehende Raum wird nicht verändert.

Die LLM Expansion dient der Vorbereitung der neuen M13 API Route:

```txt
app/api/m13/llm/route.ts
```

Diese neue Route soll später einen eigenen API Execution Space bedienen und andere Modelladapter kontrolliert nutzen können.

---

## 2. Grundregel der Expansion

Keine bestehende produktive Logik wird verändert.

Die Expansion wird daneben aufgebaut:

```txt
Bestehende Chat Route bleibt stabil.
Bestehender GPT 4.1 Block bleibt stabil.
Bestehender Triketon bleibt unangetastet.
Neue Modelle erhalten eigene ENV Keys.
Neue Modelle erhalten eigene Adapterlogik.
```

---

## 3. Zielmodell der M13 API

Die M13 API soll später mehrere klare LLM Einstiege haben.

Aktueller Zielstand:

| Command | Modell | Zweck | Status |
|---|---|---|---|
| reasoning | claude-sonnet-4-6 | Standard Chain Reasoning | Sonnet deployed und getestet |
| challenge | claude-opus-4-6 | harte Challenge, C6, High Risk Review | offen |
| summary | gpt-4.1-mini | Zusammenfassung, Long Context, Kostenanker | offen |
| fast | claude-haiku-4-5 | schnelle einfache Aufgaben | offen, Kostenangabe in Foundry UI unklar |

Wichtig: Jeder Command soll exakt ein Modell haben.

Keine automatische Hochstufung.  
Keine alternative KI pro Command.  
Keine dynamische Modellwahl in v1.

---

## 4. Command Regel

Commands beschreiben die Arbeitsabsicht.

Aktueller v1 Stand:

```txt
reasoning
challenge
summary
fast
```

Die Commands enthalten keine C-Level im öffentlichen Contract.

Nicht verwenden:

```txt
reasoning_c4
challenge_c6
```

Begründung:

Interne M13 Thought Depth kann sich später ändern. Der externe API Contract soll stabil bleiben.

---

## 5. Aktuelle ENV Erweiterung

Die neue ENV Struktur wurde unterhalb des bestehenden Azure OpenAI Blocks ergänzt.

Bestehender Block bleibt unverändert:

```env
AZURE_OPENAI_ENDPOINT=...
AZURE_OPENAI_API_KEY=...
AZURE_OPENAI_DEPLOYMENT=gpt-4.1
AZURE_OPENAI_API_VERSION=...
```

Neuer Block:

```env
# --- M13 API LLM Gateway ---
M13_LLM_ENABLED=true

# Commands
M13_LLM_COMMAND_REASONING=claude_sonnet_4_6
M13_LLM_COMMAND_CHALLENGE=
M13_LLM_COMMAND_SUMMARY=gpt_4_1_mini
M13_LLM_COMMAND_FAST=

# Claude Sonnet 4.6 via Azure Foundry Anthropic Adapter
M13_CLAUDE_SONNET_4_6_ENDPOINT=https://mutah-resource.services.ai.azure.com/anthropic/
M13_CLAUDE_SONNET_4_6_API_KEY=...
M13_CLAUDE_SONNET_4_6_DEPLOYMENT=claude-sonnet-4-6
M13_CLAUDE_SONNET_4_6_ADAPTER=anthropic_foundry

# GPT 4.1 Mini via Azure OpenAI Adapter
M13_GPT_4_1_MINI_ENDPOINT=
M13_GPT_4_1_MINI_API_KEY=
M13_GPT_4_1_MINI_DEPLOYMENT=gpt-4.1-mini
M13_GPT_4_1_MINI_API_VERSION=2025-03-01-preview
M13_GPT_4_1_MINI_ADAPTER=azure_openai_chat
```

Produktive Staging ENV liegt aktuell unter:

```txt
/srv/app/shared/.env
```

Nicht unter:

```txt
/srv/app/current/.env.production
```

---

## 6. Bestätigter ENV Test

Befehl:

```bash
cd /srv/app/current

node -e "require('dotenv').config({ path: '/srv/app/shared/.env' }); console.log({
  enabled: process.env.M13_LLM_ENABLED,
  endpoint: process.env.M13_CLAUDE_SONNET_4_6_ENDPOINT,
  deployment: process.env.M13_CLAUDE_SONNET_4_6_DEPLOYMENT,
  adapter: process.env.M13_CLAUDE_SONNET_4_6_ADAPTER,
  hasKey: Boolean(process.env.M13_CLAUDE_SONNET_4_6_API_KEY)
})"
```

Ergebnis:

```json
{
  "enabled": "true",
  "endpoint": "https://mutah-resource.services.ai.azure.com/anthropic/",
  "deployment": "claude-sonnet-4-6",
  "adapter": "anthropic_foundry",
  "hasKey": true
}
```

Bewertung:

```txt
ENV korrekt geladen.
Sonnet Konfiguration vorhanden.
Key vorhanden.
```

---

## 7. Claude Sonnet 4.6 Deployment

Deployment in Azure Foundry:

```txt
Modell: claude-sonnet-4-6
Bereitstellungsname: claude-sonnet-4-6
Bereitstellungstyp: Globaler Standard
Authentifizierungstyp: Schlüssel
Ressourcenspeicherort: Sweden Central
Inhaltssicherheit: DefaultV2
```

Foundry Code Hinweis:

```txt
SDK: Anthropic SDK
Endpoint: https://mutah-resource.services.ai.azure.com/anthropic/
deployment_name: claude-sonnet-4-6
```

C6 Befund:

Claude Sonnet 4.6 läuft nicht über den bestehenden Azure OpenAI Chat Completions Adapter.

Es läuft über:

```txt
adapter: anthropic_foundry
SDK: @anthropic-ai/sdk
endpoint: /anthropic/
```

---

## 8. Installiertes SDK

Es wurde installiert:

```bash
pnpm add @anthropic-ai/sdk
```

Bestätigter Paketstand:

```txt
@anthropic-ai/sdk 0.92.0
```

Prüfung:

```bash
node -e "console.log(require.resolve('@anthropic-ai/sdk'))"
```

Ergebnis:

```txt
/srv/app/releases/20260427203343/node_modules/.pnpm/@anthropic-ai+sdk@0.92.0/node_modules/@anthropic-ai/sdk/index.js
```

Bewertung:

```txt
SDK installiert.
SDK ist auflösbar.
```

---

## 9. Erfolgreicher Claude Terminaltest

Testbefehl:

```bash
cd /srv/app/current

node <<'NODE'
require("dotenv").config({ path: "/srv/app/shared/.env" });

const Anthropic = require("@anthropic-ai/sdk");

const client = new Anthropic({
  apiKey: process.env.M13_CLAUDE_SONNET_4_6_API_KEY,
  baseURL: process.env.M13_CLAUDE_SONNET_4_6_ENDPOINT,
});

(async () => {
  const response = await client.messages.create({
    model: process.env.M13_CLAUDE_SONNET_4_6_DEPLOYMENT,
    max_tokens: 300,
    temperature: 0.2,
    system: "Antworte ausschließlich auf Deutsch. Antworte kurz, präzise und ohne Englisch.",
    messages: [
      {
        role: "user",
        content: "Fasse in drei Sätzen zusammen, warum Auditierbarkeit für KI Chains wichtig ist."
      }
    ]
  });

  console.log(JSON.stringify({
    id: response.id,
    model: response.model,
    type: response.type,
    stop_reason: response.stop_reason,
    usage: response.usage,
    content: response.content
  }, null, 2));
})().catch((err) => {
  console.error("CLAUDE_TEST_FAILED");
  console.error(err);
  process.exit(1);
});
NODE
```

Ergebnis:

```json
{
  "id": "msg_01Tn2VT8E5FGBbpCnVoMqU9E",
  "model": "claude-sonnet-4-6",
  "type": "message",
  "stop_reason": "end_turn",
  "usage": {
    "input_tokens": 65,
    "cache_creation_input_tokens": 0,
    "cache_read_input_tokens": 0,
    "cache_creation": {
      "ephemeral_5m_input_tokens": 0,
      "ephemeral_1h_input_tokens": 0
    },
    "output_tokens": 155,
    "service_tier": "standard",
    "inference_geo": "not_available"
  },
  "content": [
    {
      "type": "text",
      "text": "Auditierbarkeit ermöglicht es, die Entscheidungsprozesse einer KI-Chain nachzuvollziehen und Fehler oder unerwünschte Ausgaben auf ihren Ursprung zurückzuführen. Sie schafft Vertrauen bei Nutzern und Regulierungsbehörden, da nachgewiesen werden kann, dass das System regelkonform und transparent arbeitet. Zudem erleichtert sie die kontinuierliche Verbesserung des Systems, indem Schwachstellen in einzelnen Verarbeitungsschritten gezielt identifiziert und behoben werden können."
    }
  ]
}
```

Bestätigt:

```txt
ENV funktioniert.
Anthropic SDK funktioniert.
Azure Foundry Claude Adapter funktioniert.
Deployment claude-sonnet-4-6 funktioniert.
Deutsch funktioniert.
Usage Werte werden geliefert.
```

---

## 10. Usage Schema für Claude

Claude liefert nicht dasselbe Usage Schema wie Azure OpenAI Chat Completions.

Claude Usage:

```json
{
  "input_tokens": 65,
  "output_tokens": 155,
  "cache_creation_input_tokens": 0,
  "cache_read_input_tokens": 0
}
```

Nicht vorhanden:

```txt
prompt_tokens
completion_tokens
```

Billing Konsequenz:

```txt
Claude Adapter muss input_tokens und output_tokens auswerten.
Azure OpenAI Adapter muss prompt_tokens und completion_tokens auswerten.
Billing darf nicht adapterblind implementiert werden.
```

---

## 11. Adapter Konsequenz

Für `app/api/m13/llm/route.ts` braucht es mindestens zwei Adapterformen.

Aktuell bestätigt:

```txt
anthropic_foundry
azure_openai_chat
```

### Adapter: anthropic_foundry

Verwendet für:

```txt
claude-sonnet-4-6
```

Nutzt:

```txt
@anthropic-ai/sdk
client.messages.create(...)
```

Output Inhalt:

```txt
response.content[0].text
```

Usage:

```txt
response.usage.input_tokens
response.usage.output_tokens
response.usage.cache_creation_input_tokens
response.usage.cache_read_input_tokens
```

### Adapter: azure_openai_chat

Verwendet bisher für:

```txt
gpt-4.1
```

Vorgesehen für:

```txt
gpt-4.1-mini
```

Nutzt:

```txt
/openai/deployments/{deployment}/chat/completions
```

Output Inhalt:

```txt
data.choices[0].message.content
```

Usage:

```txt
data.usage.prompt_tokens
data.usage.completion_tokens
data.usage.prompt_tokens_details.cached_tokens
```

---

## 12. Deutsch Test

Azure Foundry UI zeigt bei Claude nicht ausdrücklich Deutsch in der Sprachliste.

Der reale Terminaltest hat aber bestätigt:

```txt
Claude Sonnet 4.6 antwortet sauber auf Deutsch.
```

Status:

```txt
Deutsch für claude-sonnet-4-6 praktisch bestätigt.
Weitere Langinput Tests stehen noch aus.
```

---

## 13. Aktive Modelle und offene Modelle

### Aktiv bestätigt

```txt
claude-sonnet-4-6
```

### Bestehend im System

```txt
gpt-4.1
```

### Geplant, aber noch nicht bestätigt

```txt
claude-opus-4-6
gpt-4.1-mini
claude-haiku-4-5
```

### Offene Prüfung je Modell

Für jedes weitere Modell muss geprüft werden:

```txt
Ist es deployed?
Welcher Endpoint?
Welcher API Key?
Welcher Adapter?
Welches Usage Schema?
Funktioniert Deutsch?
Gibt es Kostenangaben?
Liefert es stabile Response Felder?
```

---

## 14. Nächste Erweiterungskandidaten

### gpt-4.1-mini

Zweck:

```txt
summary
long context
cost anchor
```

Erwarteter Adapter:

```txt
azure_openai_chat
```

Status:

```txt
offen
```

### claude-opus-4-6

Zweck:

```txt
challenge
hard review
C6 style validation
high risk industries
```

Erwarteter Adapter:

```txt
anthropic_foundry
```

Status:

```txt
offen
```

### claude-haiku-4-5

Zweck:

```txt
fast
small tasks
routing
light extraction
quick checks
```

Erwarteter Adapter:

```txt
anthropic_foundry
```

Status:

```txt
offen
```

Offener Kostenpunkt:

```txt
Azure Foundry UI zeigte keine Kostenangabe für Haiku.
Vor produktiver Nutzung muss die Kostenlage bestätigt werden.
```

---

## 15. Billing Folgerung

Die spätere API Route darf nicht nur einen Tokenzähler kennen.

Sie braucht normalisierte Usage.

Empfohlene interne Normalisierung:

```json
{
  "adapter": "anthropic_foundry",
  "input_tokens": 65,
  "output_tokens": 155,
  "cached_input_tokens": 0,
  "total_billable_tokens": 220,
  "raw_usage": {}
}
```

Für Azure OpenAI:

```json
{
  "adapter": "azure_openai_chat",
  "input_tokens": 0,
  "output_tokens": 0,
  "cached_input_tokens": 0,
  "total_billable_tokens": 0,
  "raw_usage": {}
}
```

Die genaue Berechnung muss später adapterabhängig definiert werden.

---

## 16. Keine Codeänderung an bestehender Route

Bis zu diesem Stand wurde keine Änderung an der bestehenden Chat Route vorgenommen.

Der erfolgreiche Test war rein:

```txt
ENV
SDK Installation
Terminal Call
```

Keine Änderung an:

```txt
/api/chat
Triketon
FreeGate
Ledger
Frontend
IndexedDB
```

---

## 17. Offene Entscheidungen

### 17.1 Adapter Implementierung

Offen:

```txt
Soll der Adapter zuerst als separate Hilfsdatei entstehen oder direkt in app/api/m13/llm/route.ts?
```

Empfehlung:

```txt
Separate Adapterdatei, damit route.ts klein bleibt.
```

Möglicher Pfad:

```txt
lib/m13/llm/adapters/anthropicFoundry.ts
lib/m13/llm/adapters/azureOpenAIChat.ts
```

### 17.2 GPT 4.1 Mini Deployment

Offen:

```txt
Ist gpt-4.1-mini bereits deployed?
Welche ENV Werte nutzt es?
Kann es den bestehenden Azure OpenAI Key und Endpoint nutzen?
```

### 17.3 Claude Opus 4.6 Deployment

Offen:

```txt
Deployment anlegen.
Terminaltest wiederholen.
Usage prüfen.
Deutsch prüfen.
```

### 17.4 Claude Haiku 4.5 Deployment

Offen:

```txt
Deployment anlegen.
Kostenlage klären.
Terminaltest wiederholen.
Usage prüfen.
Deutsch prüfen.
```

### 17.5 Billing Mapping

Offen:

```txt
Wie werden Tokens zwischen Anthropic Usage und Azure OpenAI Usage kanonisch normalisiert?
Wie wird pro Run aggregiert?
Wann wird gebucht?
```

### 17.6 Route Contract

Offen:

```txt
Finaler Request und Response Contract für app/api/m13/llm/route.ts.
```

---

## 18. C6 Zusammenfassung

Der erste Modelladapter wurde erfolgreich validiert.

Claude Sonnet 4.6 ist damit der erste bestätigte neue M13 API LLM Einstieg.

Der wichtigste technische Befund:

```txt
M13 braucht keinen einzelnen LLM Adapter.
M13 braucht einen Adapter Layer.
```

Der wichtigste Architekturgrundsatz bleibt:

```txt
Bestehendes Produkt bleibt unberührt.
Neue LLM Expansion wird daneben aufgebaut.
```

---

## 19. Commit Titel Vorschlag

```txt
docs: freeze M13 LLM expansion adapter findings
```
## 20. Model Expansion Status After Initial README

After the initial README freeze, the model expansion sprint continued with the remaining planned v1 models.

The goal was to verify each model independently before touching the new API route.

No route changes were made.

No existing chat route was changed.

No existing Triketon logic was changed.

No existing production persistence was changed.

---

## 21. Confirmed v1 Model Entrypoints

The M13 API model layer now has four confirmed model entrypoints.

| Command | Model | Adapter | Status |
|---|---|---|---|
| `reasoning` | `claude-sonnet-4-6` | `anthropic_foundry` | confirmed |
| `challenge` | `claude-opus-4-6` | `anthropic_foundry` | confirmed |
| `summary` | `gpt-4.1-mini` | `azure_openai_chat` | confirmed |
| `fast` | `claude-haiku-4-5` | `anthropic_foundry` | confirmed |

Core rule:

```txt
One command.
One model.
One adapter.
One audit path.
No internal model escalation.
No fallback model switching in v1.
````

---

## 22. Confirmed Command to Model Mapping

The public command layer remains simple and stable.

```txt
reasoning
challenge
summary
fast
```

The internal model mapping is fixed for v1:

```txt
reasoning  -> claude-sonnet-4-6
challenge  -> claude-opus-4-6
summary    -> gpt-4.1-mini
fast       -> claude-haiku-4-5
```

Reasoning commands do not dynamically switch between Sonnet and Opus.

Challenge commands do not fall back to Sonnet.

Summary commands do not fall back to Claude.

Fast commands do not fall back to GPT.

This avoids drift in cost, behavior, audit, and reproducibility.

---

## 23. Claude Opus 4.6 Result

Claude Opus 4.6 was deployed and tested successfully through Azure Foundry Anthropic.

Configured endpoint base:

```txt
https://mutah-resource.services.ai.azure.com/anthropic/
```

Foundry displayed the full messages endpoint:

```txt
https://mutah-resource.services.ai.azure.com/anthropic/v1/messages
```

The SDK configuration uses the base endpoint, because the Anthropic SDK appends the message route internally.

Confirmed deployment:

```txt
claude-opus-4-6
```

Confirmed adapter:

```txt
anthropic_foundry
```

Confirmed usage schema:

```txt
input_tokens
output_tokens
cache_creation_input_tokens
cache_read_input_tokens
```

Observed successful test:

```txt
input_tokens: 69
output_tokens: 270
cache_creation_input_tokens: 0
cache_read_input_tokens: 0
```

Result:

```txt
challenge -> claude-opus-4-6 -> confirmed
```

---

## 24. Claude Haiku 4.5 Result

Claude Haiku 4.5 was deployed and tested successfully through Azure Foundry Anthropic.

Configured endpoint base:

```txt
https://mutah-resource.services.ai.azure.com/anthropic/
```

Confirmed deployment:

```txt
claude-haiku-4-5
```

Observed runtime model name:

```txt
claude-haiku-4-5-20251001
```

Confirmed adapter:

```txt
anthropic_foundry
```

Confirmed usage schema:

```txt
input_tokens
output_tokens
cache_creation_input_tokens
cache_read_input_tokens
```

Observed successful test:

```txt
input_tokens: 58
output_tokens: 57
cache_creation_input_tokens: 0
cache_read_input_tokens: 0
```

Result:

```txt
fast -> claude-haiku-4-5 -> confirmed
```

---

## 25. GPT 4.1 Mini Result

GPT 4.1 Mini was deployed and tested successfully through Azure OpenAI Chat Completions.

Configured endpoint:

```txt
https://mutah-resource.cognitiveservices.azure.com/
```

Confirmed deployment:

```txt
gpt-4.1-mini
```

Observed runtime model name:

```txt
gpt-4.1-mini-2025-04-14
```

Confirmed adapter:

```txt
azure_openai_chat
```

Confirmed usage schema:

```txt
prompt_tokens
completion_tokens
total_tokens
prompt_tokens_details.cached_tokens
```

Observed successful test:

```txt
prompt_tokens: 47
completion_tokens: 49
total_tokens: 96
cached_tokens: 0
```

Result:

```txt
summary -> gpt-4.1-mini -> confirmed
```

---

## 26. Confirmed ENV Expansion

The shared environment file now contains the M13 LLM Gateway block.

Production path used during validation:

```txt
/srv/app/shared/.env
```

The existing Azure OpenAI configuration remains untouched.

The M13 LLM Gateway block adds independent model configuration for the new API model layer.

Confirmed command bindings:

```env
M13_LLM_COMMAND_REASONING=claude_sonnet_4_6
M13_LLM_COMMAND_CHALLENGE=claude_opus_4_6
M13_LLM_COMMAND_SUMMARY=gpt_4_1_mini
M13_LLM_COMMAND_FAST=claude_haiku_4_5
```

Confirmed model adapter types:

```env
M13_CLAUDE_SONNET_4_6_ADAPTER=anthropic_foundry
M13_CLAUDE_OPUS_4_6_ADAPTER=anthropic_foundry
M13_CLAUDE_HAIKU_4_5_ADAPTER=anthropic_foundry
M13_GPT_4_1_MINI_ADAPTER=azure_openai_chat
```

---

## 27. Adapter Layer Status

The adapter layer was created under:

```txt
lib/m13/llm/
```

Current files:

```txt
lib/m13/llm/types.ts
lib/m13/llm/adapters/anthropicFoundry.ts
lib/m13/llm/adapters/azureOpenAIChat.ts
lib/m13/llm/registry.ts
lib/m13/llm/index.ts
```

Purpose:

```txt
Normalize different provider responses into one M13 LLM response format.
```

Confirmed provider differences:

```txt
Claude Foundry:
content[] text blocks
usage.input_tokens
usage.output_tokens

Azure OpenAI:
choices[0].message.content
usage.prompt_tokens
usage.completion_tokens
```

The adapter layer must remain isolated from:

```txt
app/api/chat/route.ts
Triketon
Billing
IRSS
Frontend UI
Engine state logic
```

---

## 28. Required Registry Update

The current `registry.ts` initially activated only:

```txt
reasoning
summary
```

Now that Opus and Haiku are confirmed, `registry.ts` must be updated to activate:

```txt
challenge
fast
```

Required mapping:

```txt
challenge -> claude_opus_4_6 -> anthropic_foundry
fast      -> claude_haiku_4_5 -> anthropic_foundry
```

This must be done as a separate code step with exact BEFORE and AFTER patch.

No route work should begin before this registry update is complete.

---

## 29. Updated Technical Status

| Layer                                  | Status            |
| -------------------------------------- | ----------------- |
| Sonnet deployment                      | confirmed         |
| Opus deployment                        | confirmed         |
| Haiku deployment                       | confirmed         |
| GPT 4.1 Mini deployment                | confirmed         |
| Anthropic Foundry SDK                  | confirmed         |
| Azure OpenAI Chat endpoint             | confirmed         |
| Usage schema discovery                 | confirmed         |
| German output behavior                 | confirmed         |
| Adapter file structure                 | created           |
| Adapter runtime through `callM13Llm()` | not yet confirmed |
| New API route                          | not started       |
| Billing integration                    | not started       |
| IRSS server generation                 | not started       |
| API Ledger Space                       | not started       |

---

## 30. Next Immediate Step

The next immediate step is not the API route.

The next immediate step is:

```txt
Update lib/m13/llm/registry.ts
```

Goal:

```txt
Activate challenge and fast commands.
```

After that:

```txt
Test callM13Llm() through a clean Next-compatible path.
```

Only after the adapter layer is fully validated should the new route be planned.

---

## 31. Updated Commit Title Suggestions

For the completed model deployment and testing documentation:

```txt
docs: document confirmed M13 LLM model expansion
```

For the upcoming registry activation patch:

```txt
feat: activate M13 challenge and fast LLM mappings
```

For the current adapter layer already committed:

```txt
feat: add isolated M13 LLM adapter layer
```

## 32. Runtime Adapter Test Route

After all four model deployments were confirmed independently, a temporary Next.js test route was added to validate the M13 LLM adapter layer inside the real server runtime.

Test route:

```txt
app/api/m13/llm-test/route.ts
````

Purpose:

```txt
Validate callM13Llm() through the actual Next.js server runtime.
```

Scope:

```txt
No billing.
No IRSS.
No logbook.
No public API contract.
No Triketon.
No chat route changes.
```

This route is temporary and exists only to prove that the adapter layer works before the real API route is built.

---

## 33. Test Route Placement Correction

The route was first placed incorrectly under:

```txt
lib/m13/llm-test/route.ts
```

This did not work because Next.js only recognizes API routes under:

```txt
app/api/.../route.ts
```

Result of incorrect placement:

```txt
HTTP/1.1 404 Not Found
```

Correct placement:

```txt
app/api/m13/llm-test/route.ts
```

After moving the file, the route became reachable.

---

## 34. Confirmed Runtime Test: reasoning

Command:

```txt
reasoning
```

Expected mapping:

```txt
reasoning -> claude-sonnet-4-6 -> anthropic_foundry
```

First test result:

```txt
HTTP 200
adapter: anthropic_foundry
model: claude-sonnet-4-6
usage: normalized
```

Initial content issue:

```txt
The model interpreted M13 as the biological bacteriophage.
```

Reason:

```txt
The test prompt did not provide enough system context.
```

Corrected test added explicit M13 context:

```txt
M13 is a modular AI architecture by m-pathy, not a biological phage.
```

Corrected result:

```txt
command: reasoning
adapter: anthropic_foundry
model: claude-sonnet-4-6
content: correct M13 context
billableTokens: 232
stop_reason: end_turn
```

Conclusion:

```txt
reasoning is confirmed through callM13Llm() in Next runtime.
```

---

## 35. Confirmed Runtime Test: challenge

Command:

```txt
challenge
```

Expected mapping:

```txt
challenge -> claude-opus-4-6 -> anthropic_foundry
```

Confirmed result:

```txt
command: challenge
adapter: anthropic_foundry
model: claude-opus-4-6
usage: normalized
billableTokens: 404
```

Observed issue:

```txt
stop_reason: max_tokens
```

Reason:

```txt
The test used maxTokens: 300.
The output was cut off.
```

Implication:

```txt
The adapter works.
The test max token limit was too low for challenge behavior.
```

Recommendation for future defaults:

```txt
M13_CHALLENGE_MAX_TOKENS should likely be 1200 to 1500.
```

Conclusion:

```txt
challenge is confirmed through callM13Llm() in Next runtime.
```

---

## 36. Confirmed Runtime Test: summary

Command:

```txt
summary
```

Expected mapping:

```txt
summary -> gpt-4.1-mini -> azure_openai_chat
```

Confirmed result:

```txt
command: summary
adapter: azure_openai_chat
model: gpt-4.1-mini-2025-04-14
usage: normalized
billableTokens: 114
stop_reason: stop
```

Observed normalized usage:

```txt
inputTokens: 78
outputTokens: 36
cachedInputTokens: 0
cacheCreationInputTokens: 0
totalTokens: 114
billableTokens: 114
```

Conclusion:

```txt
summary is confirmed through callM13Llm() in Next runtime.
```

---

## 37. Confirmed Runtime Test: fast

Command:

```txt
fast
```

Expected mapping:

```txt
fast -> claude-haiku-4-5 -> anthropic_foundry
```

Confirmed result:

```txt
command: fast
adapter: anthropic_foundry
model: claude-haiku-4-5-20251001
usage: normalized
billableTokens: 164
stop_reason: end_turn
```

Observed normalized usage:

```txt
inputTokens: 70
outputTokens: 94
cachedInputTokens: 0
cacheCreationInputTokens: 0
totalTokens: 164
billableTokens: 164
```

Conclusion:

```txt
fast is confirmed through callM13Llm() in Next runtime.
```

---

## 38. Fully Confirmed Adapter Layer Matrix

The adapter layer is now confirmed through the real Next.js runtime for all four v1 commands.

| Command     | Model                       | Adapter             | Runtime Status |
| ----------- | --------------------------- | ------------------- | -------------- |
| `reasoning` | `claude-sonnet-4-6`         | `anthropic_foundry` | confirmed      |
| `challenge` | `claude-opus-4-6`           | `anthropic_foundry` | confirmed      |
| `summary`   | `gpt-4.1-mini-2025-04-14`   | `azure_openai_chat` | confirmed      |
| `fast`      | `claude-haiku-4-5-20251001` | `anthropic_foundry` | confirmed      |

Confirmed technical properties:

```txt
callM13Llm() works in Next server runtime.
Anthropic Foundry adapter works.
Azure OpenAI Chat adapter works.
Usage is normalized.
billableTokens is produced for all commands.
German output works when sufficient system context is provided.
```

---

## 39. Important Runtime Finding

The adapter layer does not automatically provide M13 system identity.

If the system prompt is too generic, a model may interpret “M13” as something outside the m-pathy context.

Example issue:

```txt
Claude interpreted M13 as a biological bacteriophage.
```

Corrective rule:

```txt
Every real API call must include server-side M13 system context.
```

This should not be left to the user.

The future production route must inject a minimal server-owned M13 context before calling the adapter layer.

---

## 40. Updated Status After Runtime Tests

| Layer                        | Status      |
| ---------------------------- | ----------- |
| Four model deployments       | confirmed   |
| Shared ENV expansion         | confirmed   |
| Anthropic SDK access         | confirmed   |
| Azure OpenAI Chat access     | confirmed   |
| Adapter files                | created     |
| Registry mappings            | activated   |
| Test route placement         | corrected   |
| callM13Llm runtime execution | confirmed   |
| Normalized usage             | confirmed   |
| billableTokens               | confirmed   |
| Server-side M13 context need | confirmed   |
| Production API route         | not started |
| Billing integration          | not started |
| Server-side IRSS generation  | not started |
| API Ledger Space             | not started |

---

## 41. Current Safe Boundary

The model and adapter layer is now ready.

The production API route is not yet ready.

The next architectural layer must not start by adding more model logic.

The next architectural layer must use the adapter layer as a closed dependency.

Boundary:

```txt
Model adapters are now infrastructure.
The next sprint is route orchestration.
```

The production route must not reimplement:

```txt
provider SDK calls
provider response parsing
usage normalization
command to model mapping
```

It must only orchestrate:

```txt
auth
command validation
server M13 context
callM13Llm()
server-side IRSS
billing
run aggregation
logbook entry
response contract
```

---

## 42. Temporary Test Route Status

The temporary route may remain during development, but it must be treated as non-production.

Current route:

```txt
app/api/m13/llm-test/route.ts
```

Status:

```txt
temporary
internal
adapter validation only
not public API
not billing safe
not auth safe
not final contract
```

Before production release, one of the following must happen:

```txt
remove the route
or protect it strictly
or keep it only behind development/staging guards
```

---

## 43. Next Recommended Step

The next intelligent move is to freeze the LLM expansion state and then plan the real route.

Immediate next step:

```txt
Commit this README expansion.
```

After that:

```txt
Plan app/api/m13/llm/route.ts
```

The route plan must begin with contract definition, not code.

Required route planning sections:

```txt
Auth and API key relation to Public Key
Command validation
Server-side M13 context injection
Server-side IRSS generation
Billing and run aggregation
API Ledger Entry shape
Local-first response contract
Error contract
Staging-only test strategy
```

---

## 44. Commit Title Suggestion

For this README expansion:

```txt
docs: add M13 LLM runtime adapter test results
```