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
