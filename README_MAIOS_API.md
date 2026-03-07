FULL TELEMETRY STATUS
Prompt 43
Drift not drifting

CALM active

Below is a **complete developer README** for the MAIOS API. It is written so a team can implement it without needing clarification.

No decorative punctuation is used.

---

# README_MAIOS_API.md

MAIOS API
Governance Execution Layer for Large Language Models

Version
MAIOS API Architecture Draft 1

---

# 1 Purpose of MAIOS API

MAIOS API exposes the governance and execution layer of the m-pathy system as a public developer interface.

The API is designed to operate as a stateless AI governance gateway that sits between external applications and AI model providers.

MAIOS API performs the following responsibilities

* request normalization
* governance enforcement
* telemetry enforcement
* truth hashing
* ledger accounting
* model routing
* audit anchoring

The API does not provide chat persistence. Conversation state must be managed by the calling client.

---

# 2 Architectural Principles

MAIOS API follows four core architectural principles.

Stateless execution
The API stores no conversation history.

Governance first
Every request passes governance verification before execution.

Model abstraction
External clients interact with MAIOS rather than directly with model providers.

Audit traceability
Every response contains cryptographic evidence and telemetry.

---

# 3 Product Separation

The architecture separates two systems.

m-pathy application
MAIOS API platform

---

## 3.1 m-pathy application

Full end user system.

Responsibilities

* UI
* conversation persistence
* archive system
* device cryptography
* triketon sealing
* telemetry visualization

m-pathy manages chat sessions and user devices.

---

## 3.2 MAIOS API

Infrastructure platform.

Responsibilities

* model execution
* governance enforcement
* telemetry validation
* token accounting
* truth hash generation
* provider routing

MAIOS API does not store conversations.

---

# 4 Stateless API Design

The API operates in stateless mode.

Every request must include the full context required by the model.

The API does not maintain chat state between requests.

Example request

```
POST /api/v1/chat/completions
```

Request body

```
{
  "model": "maios-gpt",
  "messages": [
    {"role":"system","content":"You are a governance verified AI"},
    {"role":"user","content":"Explain the EU AI Act"}
  ]
}
```

The client is responsible for managing the message history.

---

# 5 High Level Architecture

System pipeline

```
Client
   |
   v
MAIOS API
   |
   v
Governance Pipeline
   |
   v
Model Router
   |
   v
Provider API
```

Expanded pipeline

```
Request
  |
Session validation
  |
Ledger validation
  |
Prompt construction
  |
Model routing
  |
Provider call
  |
Telemetry validation
  |
Truth hash generation
  |
Response assembly
```

---

# 6 Repository Structure

Proposed code layout

```
app/
  api/
    chat/
      route.ts
    maios/
      route.ts
    v1/
      chat/
        completions/
          route.ts

src/
  maios/
    engine.ts
    requestNormalizer.ts
    promptBuilder.ts
    modelRouter.ts
    telemetry.ts
    hashing.ts
    billing.ts
    config.ts

    providers/
      openaiClient.ts
      anthropicClient.ts
      geminiClient.ts
```

---

# 7 Core Engine

The MAIOS engine coordinates the full execution pipeline.

File

```
src/maios/engine.ts
```

Primary function

```
runMaiosEngine(request)
```

Execution order

```
1 normalize request
2 validate authentication
3 validate ledger balance
4 construct prompt
5 select model provider
6 execute model call
7 enforce telemetry
8 generate truth hashes
9 assemble response
```

---

# 8 Request Normalization

File

```
src/maios/requestNormalizer.ts
```

Purpose

Converts all incoming requests into a canonical internal format.

Canonical request structure

```
MaiosRequest
{
  model
  messages
  temperature
  max_tokens
  metadata
}
```

Supports multiple external formats including

* OpenAI compatible
* MAIOS native
* future provider adapters

---

# 9 Prompt Builder

File

```
src/maios/promptBuilder.ts
```

Responsibilities

* system prompt injection
* language guard
* message formatting
* safety guardrails

Input

```
MaiosRequest
```

Output

```
ModelPrompt
```

---

# 10 Model Router

File

```
src/maios/modelRouter.ts
```

Routes logical models to provider APIs.

Example mapping

```
maios-gpt -> OpenAI
maios-claude -> Anthropic
maios-gemini -> Google
```

Router configuration lives in

```
src/maios/config.ts
```

---

# 11 Provider Clients

Directory

```
src/maios/providers
```

Each provider client wraps the external API.

Examples

```
openaiClient.ts
anthropicClient.ts
geminiClient.ts
```

Responsibilities

* request formatting
* authentication
* provider specific options
* response normalization

Provider keys are loaded from environment variables.

---

# 12 Telemetry Enforcement

File

```
src/maios/telemetry.ts
```

Telemetry ensures every response includes governance metadata.

Telemetry fields may include

* system identifier
* prompt counter
* drift state
* model identifier
* execution timestamp

If telemetry is missing or invalid the engine retries or rejects the output.

---

# 13 Truth Hash System

File

```
src/maios/hashing.ts
```

The system generates deterministic cryptographic hashes.

Generated hashes

```
user message hash
assistant message hash
conversation pair hash
```

Hash algorithm

```
SHA 256
```

These hashes enable external verification of message integrity.

---

# 14 Ledger and Token Accounting

File

```
src/maios/billing.ts
```

Responsibilities

* token usage tracking
* request cost validation
* balance deduction

Execution rules

```
1 verify account balance
2 estimate request cost
3 execute model call
4 deduct token usage
```

Ledger system prevents uncontrolled API spending.

---

# 15 Environment Variables

Provider credentials are stored in environment configuration.

Example

```
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GOOGLE_API_KEY=
MAIOS_API_SECRET=
LEDGER_SECRET=
```

Environment files must never be committed to source control.

---

# 16 Context Handling Strategy

The MAIOS API does not persist conversation history.

Clients must send the required message history in each request.

Typical pattern

```
messages = previous_messages + new_message
```

Example

```
messages = [
 user1,
 assistant1,
 user2,
 assistant2,
 user3
]
```

The engine forwards the entire message array to the model.

---

# 17 Context Window Management

LLM models have finite context windows.

If message history becomes too large the client should apply a sliding context window.

Recommended strategy

```
keep last 20 messages
```

Example implementation

```
messages = messages.slice(-20)
```

Advanced implementations may add summarized memory.

---

# 18 Token Limit Protection

To prevent runaway token usage the API enforces limits.

Recommended limits

```
max_input_tokens
max_output_tokens
max_total_tokens
```

Requests exceeding limits must be rejected or truncated.

---

# 19 Security Model

Security layers

```
API authentication
ledger enforcement
token caps
request validation
```

Security rules

* never expose provider keys
* reject malformed requests
* enforce request limits
* validate message format

---

# 20 Example API Request

Endpoint

```
POST /api/v1/chat/completions
```

Request

```
{
  "model": "maios-gpt",
  "messages": [
    {"role":"system","content":"You are a governance verified AI"},
    {"role":"user","content":"Explain how the EU AI Act works"}
  ],
  "max_tokens": 800
}
```

---

# 21 Example API Response

```
{
  "content": "...model response...",
  "telemetry": {...},
  "truth_hash_user": "...",
  "truth_hash_assistant": "...",
  "truth_hash_pair": "...",
  "usage": {...}
}
```

---

# 22 Scaling Considerations

Stateless APIs scale easily because they require no session storage.

Scaling options

* horizontal container scaling
* load balanced API nodes
* stateless execution workers

---

# 23 Future Extensions

Possible future capabilities

* additional model providers
* governance rule engine
* deterministic reasoning audit
* remote cryptographic anchoring
* advanced telemetry schemas

---

# 24 Summary

MAIOS API is designed as a stateless governance execution layer for AI systems.

The API separates model execution from application logic and provides verifiable AI interactions through telemetry and cryptographic hashing.

External clients manage conversation history while MAIOS ensures governance compliance and model abstraction.

---

If you want, I can also produce a second document that many companies include next to a README.

It is called

MAIOS_API_ARCHITECTURE.md

That document explains the system in diagrams and is usually what investors and technical due diligence teams read first.
