# README_M13_API_020526.md

## Status

This document freezes the current architectural understanding.
It is not the final implementation contract.
It is not a patch plan.
It is not a route specification ready for coding.

Purpose of this document:

- preserve the current M13 API architecture state
- prevent drift between future chats and implementation steps
- mark open decisions exactly where they block further work
- define the API Space without touching existing production logic

---

# 1. Core Claim

M13 is nothing, so it can become everything.

Meaning:

- M13 must not hardcode industries
- M13 must not hardcode medical, insurance, legal, banking, or consulting objects
- M13 must provide infrastructure, not domain conclusions
- domain reality is built later through extensions, Python files, developers, and domain experts
- the Core remains generic
- the Envelope remains strict
- the Chain remains modular
- the Ledger remains auditable

Canonical rule:

```txt
M13 does not define the content of a process.
M13 defines the conditions under which a process can be executed, documented, billed, stored, audited, and extended.
```

---

# 2. Existing System Boundary

The current m-pathy Chat Space already exists and must not be touched.

Existing production logic includes:

- current `/api/chat` route
- current GPT 4.1 based chat flow
- current Triketon ledger
- current IRSS handling in chat
- current user registry
- current IndexedDB and localStorage structures
- current FreeGate logic for chat guests

Hard rule:

```txt
Existing production persistence is taboo.
No migration.
No payload modification.
No Triketon refactor.
No hidden coupling.
```

The new API must be built beside the existing system.

---

# 3. New API Space

The new route is planned as:

```txt
app/api/m13/llm/route.ts
```

External path:

```txt
POST /api/m13/llm
```

This route is not a second chat route.
It is a new M13 API Execution Space.

Primary purpose:

- controlled LLM execution
- chain based work
- artifact generation
- server side IRSS generation
- token usage accounting
- run based aggregation
- local first persistence
- optional server sync later
- modular extension enablement

The API Space is structurally different from the Chat Space.

Chat Space:

```txt
conversation
message
assistant response
IRSS
Triketon
truth hash
public key
visible output
```

API Space:

```txt
run
stage
operation
artifact
server IRSS
usage
billing
logbook entry
optional sync status
```

Audit resonance is required.
Technical coupling to the existing Triketon is forbidden.

---

# 4. Schooling Extension as Required Entry Point

API usage does not start through a raw external API call.

API usage can only begin through the Schooling Extension.

The Schooling Extension is the authorized initialization path for API usage.

It is not only training.
It is setup, qualification, initialization, and controlled entry.

The Schooling Extension must provide or initialize:

- API readiness
- Public Key creation or validation
- local API Space creation
- first run structure
- first artifact structure
- first logbook structure
- first server side IRSS example
- token visibility
- example API call
- example Python chain usage
- example output artifact
- developer guidance

Hard rule:

```txt
No direct API usage without Schooling Extension initialization.
```

---

# 5. Access and Release Model

The API is not openly available to all users.

The public website may provide:

- waitlist
- controlled access request
- manual or semi automatic approval
- account preparation
- token purchase path
- Schooling Extension entry

The API route itself must not contain a Guest FreeGate path.

Hard decision:

```txt
/api/m13/llm has no FreeGate.
```

Reason:

- external API calls are automatable
- chains may trigger multiple steps
- high risk B2B usage requires controlled access
- free guest prompts create abuse risk
- billing must be reliable

The existing FreeGate may remain in `/api/chat`.
It must not be copied into `/api/m13/llm`.

---

# 6. Identity and Public Key

Current understanding:

- the user has a Public Key on the device
- the Public Key is created with the first m-pathy prompt or through the Schooling Extension
- the Public Key may become the API identity anchor
- the Public Key may connect local ledger, API logbook, and account identity

Open decision at this layer:

```txt
OPEN DECISION:
Is the Public Key sufficient as API authentication key, or does it require server side registration, signing, or account binding?
```

C6 note:

A Public Key is strong as a device and ledger anchor.
For billing, the server still needs a reliable mapping:

```txt
public_key -> user account -> token balance -> debit authority
```

This must be validated before production API billing.

---

# 7. Billing Model

The client must never decide whether billing applies.

Forbidden request logic:

```json
{
  "billing": false
}
```

Server rule:

```txt
Billing is server authoritative.
```

Current direction:

- billing is aggregated per run
- actual LLM calls are usage events inside a run
- non LLM steps may be documented inside the run
- token deduction should be based on real LLM usage
- later service fees may be added separately, but must not be disguised as token usage

Open decision at this layer:

```txt
OPEN DECISION:
Should non LLM chain steps ever consume credits, or should only real LLM usage consume tokens?
```

Current recommendation:

```txt
Tokens only for real LLM usage.
Runs aggregate real LLM usage.
Non LLM steps are documented, not token billed.
```

---

# 8. Persistence Model

The API Space follows local first persistence.

Current rule:

```txt
Local first.
Server second.
```

Meaning:

1. `/api/m13/llm` executes the operation
2. the route returns content, artifact, usage, billing, and logbook entry
3. the client stores the entry locally
4. optional server sync may happen after local persistence
5. sync status is written back into the local entry

The API route cannot write directly into browser IndexedDB.
It can only return the data required for client side persistence.

Storage naming direction:

Because the API may be used inside external customer systems, storage should avoid unnecessary m-pathy branding.

Preferred system naming:

```txt
M13
```

Possible local structures:

```txt
M13Runtime
M13ApiRuntime
M13Logbook
M13Artifacts
```

Open decision at this layer:

```txt
OPEN DECISION:
Should the API Space use a separate IndexedDB database or new stores inside the existing runtime database?
```

Current recommendation:

```txt
Use a clearly separated M13 API Space.
Do not touch existing production stores.
```

---

# 9. Server Sync and Settings Space

The current Settings Space already contains a placeholder for server URL and key.

Existing direction:

- the user may later configure server sync
- server sync may apply to Triketon related chat persistence
- API Logbook needs a separate sync meaning

Important distinction:

```txt
Triketon sync and API Logbook sync are not the same semantic operation.
```

Future Settings may need separate server targets:

```json
{
  "infrastructure": {
    "servers": {
      "triketon": {
        "enabled": false,
        "url": "",
        "api_key": "",
        "status": "unknown"
      },
      "api_logbook": {
        "enabled": false,
        "url": "",
        "api_key": "",
        "status": "unknown"
      }
    }
  }
}
```

Open decision at this layer:

```txt
OPEN DECISION:
Should Settings keep one generic server entry, or evolve into separated server targets for Triketon and API Logbook?
```

C6 note:

A single generic server field is simpler now but may create semantic drift later.
Separate targets are clearer for audit.

---

# 10. IRSS Rule for the API Space

IRSS should always be present when it is generated by the server from reliable runtime data.

The user should not decide whether IRSS is included.

Hard rule:

```txt
/api/m13/llm generates IRSS server side.
The client cannot disable it.
The LLM must not generate it.
```

Reason:

- LLM generated IRSS can be forgotten
- LLM generated IRSS can be mistranslated
- LLM generated IRSS can become structurally invalid under large input
- server side runtime data is more reliable for chain execution

In chain execution the server already knows:

- operation
- run id
- stage
- model configuration
- artifact status
- usage
- billing state
- timestamp
- drift status if detected by the server

Therefore IRSS for API Space should be computed, not prompted.

Open decision at this layer:

```txt
OPEN DECISION:
Define the exact server generated IRSS schema for API Space without modifying existing chat IRSS.
```

---

# 11. Triketon Boundary

The existing Triketon must not be changed.

Hard rule:

```txt
No changes to existing Triketon production persistence.
```

The API Space may be inspired by Triketon principles:

- chainability
- truth hash
- public key
- timestamp
- tamper evidence
- audit readability

But it must not write into the existing Triketon store and must not require a migration.

Current decision:

```txt
Build a new API Ledger Space beside Triketon.
```

Open decision at this layer:

```txt
OPEN DECISION:
Should the API Ledger later support a separate tamper evident seal comparable to Triketon, without touching the current Triketon implementation?
```

---

# 12. Command Layer and Model Layer

Important correction:

Commands and model slots must not use the same semantic names.
That would create drift.

Example of drift risk:

```txt
command: reasoning
model_slot: reasoning
```

This is dangerous because it becomes unclear whether reasoning means:

- user intent
- model class
- thought depth
- provider
- internal orchestration mode

Therefore the README does not freeze final command names or final model slot names.

It freezes the required separation:

```txt
Command Layer = what work should be done
Model Layer = what technical capability should execute it
Mapping Layer = how the server connects both
```

Open decision at this layer:

```txt
OPEN DECISION:
Final command names must be defined so they do not duplicate model slot semantics.
```

Current working intent types:

- reasoning style work
- challenge style work
- summary style work

These are not final external API command names.

Current required model capability classes:

- deep reasoning capable model
- large context summary capable model
- very fast simple task model

These are not final model slot names.

Hard rule:

```txt
Public API commands describe intent.
Model capability slots describe execution resource.
Server mapping connects them.
```

---

# 13. Model Strategy

The API should use models that are popular, known, strong, and available through Azure Foundry without special approval where possible.

The model strategy is capability based, not vendor based.

Required capability classes:

1. a model that follows the system prompt exactly and supports deep reasoning
2. a model optimized for summaries and large text volumes
3. a model optimized for simple tasks with maximum speed

Open decision at this layer:

```txt
OPEN DECISION:
Which concrete Azure Foundry models and deployments are available in the target subscription and region without approval?
```

Technical risk:

Different Azure Foundry model families may require different adapters.

Current architectural requirement:

```txt
Prepare a model adapter layer.
Do not hardcode the new route as GPT only.
```

Possible adapter categories:

```txt
azure_openai_chat_compatible
azure_foundry_model_adapter
```

Open decision at this layer:

```txt
OPEN DECISION:
Can all v1 models be called through one chat compatible adapter, or do we need multiple provider adapters immediately?
```

---

# 14. Artifact Envelope

M13 must never hardcode domain objects in the Core.

Forbidden Core examples:

```txt
patient
prescription
diagnosis
claim
contract
policy
case
```

Allowed Core concepts:

```txt
object_ref
process_ref
chain_id
run_id
stage
artifact
usage
billing
governance
irss
truth_hash
timestamp
```

The Core should standardize the Envelope, not the industry content.

Possible generic artifact envelope:

```json
{
  "artifact_type": "generic",
  "artifact_version": "v1",
  "object_ref": {},
  "process_ref": {},
  "payload": {},
  "status": "created"
}
```

Open decision at this layer:

```txt
OPEN DECISION:
Define the minimal artifact envelope required for audit without restricting extension specific payloads.
```

Hard rule:

```txt
No Fachcodes in Core.
```

---

# 15. API Ledger Entry Direction

The API Ledger Entry should document execution, not conversation.

Candidate structure, not final contract:

```json
{
  "id": "uuid",
  "space": "api",
  "entry_type": "llm_execution",
  "run_id": "run_id",
  "stage": "stage_id",
  "operation": "not_final_command_name",
  "model_capability": "not_final_model_slot_name",
  "irss": {},
  "artifact": {},
  "usage": {
    "prompt_tokens": 0,
    "completion_tokens": 0,
    "cached_tokens": 0,
    "tokens_used": 0
  },
  "billing": {
    "required": true,
    "debited": true,
    "amount": 0,
    "balance_after": 0
  },
  "truth_hash": "sha256",
  "public_key": "public_key",
  "timestamp": "iso_date",
  "sync_status": "local_only"
}
```

Open decision at this layer:

```txt
OPEN DECISION:
Define the final API Ledger Entry schema and how chain_prev or equivalent linking is calculated.
```

---

# 16. Python Chain Principle

Python files are a major power layer of M13.

They can:

- validate data
- transform data
- prepare prompts
- call external domain APIs if permitted
- generate files
- build artifacts
- structure outputs
- orchestrate local chain steps

But production LLM calls should not bypass M13 API governance.

Hard rule:

```txt
Python may prepare everything.
Productive LLM calls should run through the M13 API layer.
```

Reason:

- billing must remain reliable
- IRSS must be server generated
- artifacts must be standardizable
- logbook entries must be consistent
- model access must be controlled

Open decision at this layer:

```txt
OPEN DECISION:
Define how Python scripts authenticate against /api/m13/llm after the Schooling Extension has initialized the API key or Public Key.
```

---

# 17. Extension Relation

The new API is not initially the full Extension API.

Current separation:

```txt
/api/m13/llm
= LLM execution gateway

future extension API
= extension discovery, extension runs, extension registry access
```

Open decision at this layer:

```txt
OPEN DECISION:
Should future external access to extensions use this same route, or should extension discovery and execution get dedicated API routes?
```

Current recommendation:

```txt
Keep /api/m13/llm focused on LLM execution.
Plan extension access as a separate API area later.
```

Reason:

- avoids overloading the LLM route
- keeps command contracts clean
- allows extension governance separately
- protects the API Space from becoming a second chat route

---

# 18. B2B and High Risk Industry Value

The API is not merely text generation.

It is infrastructure for atomic, auditable, modular enterprise process documentation.

Examples are not Core definitions, but they illustrate the power:

- a medical practice can later build patient related chains
- an insurer can later build claim related chains
- a law firm can later build contract review chains
- a bank can later build risk review chains
- a consultancy can later build audit and transformation chains

The Core must not hardcode these examples.

The Core only provides:

```txt
execution
artifact
ledger
identity
usage
billing
IRSS
audit envelope
sync readiness
```

The domain meaning comes from extensions.

---

# 19. Current Non Negotiable Rules

1. No FreeGate in the new API route.
2. No modification of existing Triketon production logic.
3. No Fachcodes in Core.
4. No LLM generated IRSS for API Space.
5. IRSS is server generated and not user optional.
6. Billing is server authoritative.
7. API usage starts through the Schooling Extension.
8. Local first persistence.
9. Optional server sync later.
10. Commands and model slots must not share the same semantics.
11. The API Space is separate from the Chat Space.
12. Python may prepare work, but productive LLM calls must be governed.
13. Model selection must be capability based and adapter ready.

---

# 20. Open Decisions Required Before Implementation

The following decisions block final implementation:

## 20.1 Identity

```txt
Does the Public Key alone authenticate API use, or must it be registered and bound to a server side account token?
```

## 20.2 Billing

```txt
Are only real LLM calls token billed, while non LLM steps are documented without token cost?
```

## 20.3 Storage

```txt
Should the API Space use a separate IndexedDB database or new isolated stores in the existing runtime database?
```

## 20.4 Server Sync

```txt
Should Settings evolve from one server field into separated targets for Triketon and API Logbook?
```

## 20.5 IRSS Schema

```txt
What is the exact server generated IRSS schema for API Space?
```

## 20.6 API Ledger Schema

```txt
What is the final minimal API Ledger Entry schema?
```

## 20.7 Artifact Envelope

```txt
What is the minimal generic artifact envelope that supports audit without limiting extensions?
```

## 20.8 Command Names

```txt
What are the final external command names, and how do they avoid semantic overlap with model capability names?
```

## 20.9 Model Capability Names

```txt
What are the final model capability slot names, and which Azure Foundry deployments map to them?
```

## 20.10 Adapter Layer

```txt
Can v1 use one Azure OpenAI compatible adapter, or must the adapter layer support multiple Foundry invocation styles immediately?
```

## 20.11 Python Authentication

```txt
How does a Python chain authenticate against /api/m13/llm after Schooling Extension setup?
```

## 20.12 Extension API Boundary

```txt
Will external extension discovery and execution be separate routes, or later connected to the API Space?
```

---

# 21. Next Sprint Direction

The next sprint should not start with code.

It should first define:

1. identity and authentication contract
2. final API Space storage names
3. server generated IRSS schema
4. API Ledger Entry schema
5. artifact envelope
6. command layer names
7. model capability names
8. Azure Foundry model availability
9. adapter layer shape
10. Schooling Extension setup flow

Only after those are confirmed should patches begin.

---

# 22. Final Freeze Statement

This README freezes the current architectural understanding of the M13 API Space as of 2026 05 02.

It intentionally preserves open decisions inside their structural context.

It must be used as the reference point for the next planning step.

Canonical closing rule:

```txt
M13 is nothing, so it can become everything.
Core empty.
Envelope strict.
Extensions free.
Audit stable.
```

# 23. Confirmed LLM Expansion After Initial API Freeze

After the initial API architecture freeze, the LLM expansion layer was implemented and tested independently before starting the real production API route.

This was done deliberately to avoid building the API route on unverified model assumptions.

Confirmed principle:

```txt
First close the model layer.
Then close the adapter layer.
Then plan the production API route.
````

No production route was created during this phase.

No existing `/api/chat` logic was changed.

No existing Triketon logic was changed.

No existing production persistence was changed.

---

# 24. Confirmed v1 Commands

The v1 command layer is now confirmed.

Final v1 commands:

```txt
reasoning
challenge
summary
fast
```

These commands are public intent commands.

They do not expose internal C levels.

They do not expose provider names.

They do not expose fallback logic.

Rule:

```txt
Public commands describe intent.
The server owns the model mapping.
```

---

# 25. Fixed Command to Model Mapping

The v1 mapping is fixed and deterministic.

```txt
reasoning -> claude-sonnet-4-6
challenge -> claude-opus-4-6
summary   -> gpt-4.1-mini
fast      -> claude-haiku-4-5
```

Hard rule:

```txt
One command.
One model.
One adapter.
One audit path. 
```

There is no automatic model escalation in v1.

There is no fallback model switching in v1.

Reason:

```txt
Dynamic model switching creates drift in behavior, cost, audit, and reproducibility.
```

---

# 26. Confirmed v1 Models

All four v1 models were deployed and tested successfully.

| Command     | Model               | Runtime model name          | Status    |
| ----------- | ------------------- | --------------------------- | --------- |
| `reasoning` | `claude-sonnet-4-6` | `claude-sonnet-4-6`         | confirmed |
| `challenge` | `claude-opus-4-6`   | `claude-opus-4-6`           | confirmed |
| `summary`   | `gpt-4.1-mini`      | `gpt-4.1-mini-2025-04-14`   | confirmed |
| `fast`      | `claude-haiku-4-5`  | `claude-haiku-4-5-20251001` | confirmed |

Confirmed behavior:

```txt
All four models respond successfully.
German output works when server-side M13 context is provided.
Usage metadata is returned by all four models.
```

---

# 27. Confirmed Adapter Layer

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

Confirmed adapters:

```txt
anthropic_foundry
azure_openai_chat
```

Adapter mapping:

```txt
claude-sonnet-4-6 -> anthropic_foundry
claude-opus-4-6   -> anthropic_foundry
claude-haiku-4-5  -> anthropic_foundry
gpt-4.1-mini      -> azure_openai_chat
```

Boundary:

```txt
Provider SDK calls belong inside adapters.
Provider response parsing belongs inside adapters.
Usage normalization belongs inside adapters.
Command-to-model mapping belongs inside registry.
```

The production route must not reimplement these responsibilities.

---

# 28. Confirmed Usage Normalization

The adapter layer normalizes provider-specific usage formats into one M13 usage object.

Claude Foundry usage source:

```txt
input_tokens
output_tokens
cache_creation_input_tokens
cache_read_input_tokens
```

Azure OpenAI usage source:

```txt
prompt_tokens
completion_tokens
prompt_tokens_details.cached_tokens
```

Normalized M13 usage target:

```txt
inputTokens
outputTokens
cachedInputTokens
cacheCreationInputTokens
totalTokens
billableTokens
```

Confirmed result:

```txt
billableTokens is available for all four commands.
```

This is required for later server-side billing.

---

# 29. Confirmed ENV Expansion

The shared environment file was expanded for the M13 LLM Gateway.

Used production/staging ENV path:

```txt
/srv/app/shared/.env
```

Confirmed command bindings:

```env
M13_LLM_COMMAND_REASONING=claude_sonnet_4_6
M13_LLM_COMMAND_CHALLENGE=claude_opus_4_6
M13_LLM_COMMAND_SUMMARY=gpt_4_1_mini
M13_LLM_COMMAND_FAST=claude_haiku_4_5
```

Confirmed model adapter bindings:

```env
M13_CLAUDE_SONNET_4_6_ADAPTER=anthropic_foundry
M13_CLAUDE_OPUS_4_6_ADAPTER=anthropic_foundry
M13_CLAUDE_HAIKU_4_5_ADAPTER=anthropic_foundry
M13_GPT_4_1_MINI_ADAPTER=azure_openai_chat
```

The existing GPT 4.1 chat configuration remains untouched.

---

# 30. Confirmed Token and Limit Policy

The M13 LLM limits were aligned with the existing GPT 4.1 chat setup.

Existing chat limit reference:

```env
CHAT_CONCURRENCY=1
MODEL_MAX_TOKENS=8192
GPTX_MAX_CHARS=200000
MAX_CONTEXT_MESSAGES=15
```

M13 API LLM limits:

```env
M13_LLM_CONCURRENCY=1

M13_REASONING_MAX_TOKENS=8192
M13_CHALLENGE_MAX_TOKENS=8192
M13_SUMMARY_MAX_TOKENS=8192
M13_FAST_MAX_TOKENS=2048

M13_LLM_MAX_INPUT_CHARS=200000
M13_LLM_MAX_MESSAGES=15
```

Reasoning, challenge, and summary share the same output ceiling as the existing GPT 4.1 chat route.

Fast remains smaller by design.

Rule:

```txt
fast must remain fast.
fast must not become hidden reasoning.
```

---

# 31. Confirmed Runtime Test Route

A temporary Next.js test route was added:

```txt
app/api/m13/llm-test/route.ts
```

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

The route is temporary and must not be treated as production API.

---

# 32. Test Route Placement Correction

The test route was initially placed incorrectly under:

```txt
lib/m13/llm-test/route.ts
```

This produced:

```txt
HTTP/1.1 404 Not Found
```

Reason:

```txt
Next.js only recognizes API routes under app/api/.../route.ts.
```

Correct placement:

```txt
app/api/m13/llm-test/route.ts
```

After moving the file, the test route became reachable.

---

# 33. Runtime Validation Results

All four commands were validated through the temporary Next.js runtime test route.

| Command     | Adapter             | Model                       | Status    |
| ----------- | ------------------- | --------------------------- | --------- |
| `reasoning` | `anthropic_foundry` | `claude-sonnet-4-6`         | confirmed |
| `challenge` | `anthropic_foundry` | `claude-opus-4-6`           | confirmed |
| `summary`   | `azure_openai_chat` | `gpt-4.1-mini-2025-04-14`   | confirmed |
| `fast`      | `anthropic_foundry` | `claude-haiku-4-5-20251001` | confirmed |

Confirmed:

```txt
callM13Llm() works in real Next server runtime.
Both adapters work.
All four commands resolve correctly.
Usage normalization works.
billableTokens is available.
```

---

# 34. Server-Side M13 Context Finding

The adapter layer does not automatically provide M13 identity.

Observed issue:

```txt
Without explicit M13 context, Claude interpreted M13 as a biological bacteriophage.
```

Corrective rule:

```txt
Every production API call must receive server-owned M13 system context.
```

The user must not be responsible for providing the M13 identity context.

The production route must inject the minimal M13 context before calling `callM13Llm()`.

---

# 35. Registry Default Correction

The test route initially forced local defaults:

```txt
maxTokens: 300
temperature: 0.2
```

This prevented ENV and registry defaults from being used.

Observed issue:

```txt
challenge stopped with stop_reason: max_tokens
```

Correction:

```txt
The test route now forwards maxTokens and temperature only when explicitly provided.
```

Result:

```txt
If maxTokens is absent, registry and ENV defaults apply.
```

Commit title used:

```txt
test: let M13 LLM test route use registry defaults
```

---

# 36. Current Safe Boundary After LLM Expansion

The LLM layer is now ready as infrastructure.

Completed:

```txt
model deployments
ENV expansion
adapter layer
registry mapping
runtime test route
usage normalization
token limit alignment
four-command runtime verification
```

Not started:

```txt
production API route
auth
public key binding
billing debit
server-side IRSS generation
API ledger
run aggregation
local-first logbook contract
Schooling Extension integration
```

Boundary:

```txt
The LLM layer is ready.
The API route is not started.
The next sprint begins with route contract design.
```

---

# 37. Temporary Test Route Status

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

# 38. Remaining Route-Blocking Decisions

The original open decisions remain mostly valid, but the model and adapter decisions are now closed.

Still route-blocking:

```txt
1. How exactly does API authentication work?
2. How is Public Key bound to account and token balance?
3. What is the exact server-generated API IRSS schema?
4. What is the exact API Ledger Entry schema?
5. What is the minimal generic Artifact Envelope?
6. How does run aggregation and billing debit work?
7. How does the Schooling Extension initialize and authorize API usage?
```

No production route should be implemented before these seven points are resolved.

---

# 39. Updated Next Sprint Direction

The next sprint should begin with the seven route-blocking decisions.

Order:

```txt
1. identity and authentication
2. public key account binding
3. server-side IRSS schema
4. API ledger entry
5. artifact envelope
6. billing and run aggregation
7. Schooling Extension handoff
```

Only after these are frozen should coding begin on:

```txt
app/api/m13/llm/route.ts
```

---

# 40. Updated Final Freeze Statement

This README now freezes both:

```txt
the original M13 API architecture space
and the confirmed M13 LLM expansion state
```

The production route remains intentionally unbuilt.

The system is ready for route contract design.

Canonical closing rule remains:

```txt
M13 is nothing, so it can become everything.
Core empty.
Envelope strict.
Extensions free.
Audit stable.
```

# 41. Resolved Route Blocking Decisions

The seven route blocking decisions for the future production route are now resolved.

Production route target:

```txt
app/api/m13/llm/route.ts
````

External path:

```txt
POST /api/m13/llm
```

The production route is still not implemented.

This section closes the decision layer that previously blocked route planning.

Resolved decisions:

```txt
1. API Authentication
2. Public Key Binding
3. Server Side API IRSS
4. API Ledger Entry
5. Generic Artifact Envelope
6. Run Aggregation and Billing Debit
7. Schooling Extension Initialization
```

Canonical rule:

```txt
No production implementation before these seven decisions are frozen.
```

Status:

```txt
The seven decisions are frozen.
The route contract may now be planned.
Code patches still require exact file inspection before implementation.
```

---

# 42. Decision 1: API Authentication

## 42.1 Final Decision

API authentication v1 is based on server generated API Keys.

A registered user can become an API user when all required conditions are satisfied.

Required conditions:

```txt
1. User Account exists
2. API Credit is available
3. Schooling Extension is completed
```

After successful completion:

```txt
API Workspace is created
API Key is created server side
Public Key is bound as Audit Anchor
API Access is enabled
```

## 42.2 User Account Meaning

In v1, User Account means:

```txt
registered mail account
```

There is no Corporate Account layer in v1.

There is no Organization layer in v1.

There is no SSO in v1.

There is no Team or Role system in v1.

## 42.3 API Access Flow

The API access flow is separate from the normal Chat flow.

Canonical v1 path:

```txt
API Access Page
→ Login or Mail Account
→ API Credit through Stripe or manual grant
→ Schooling Extension
→ API Workspace
→ API Key
→ Proof Run
→ /api/m13/llm usage
```

The normal Chat Settings Space does not activate API usage directly.

The API Access Space is its own controlled entry path.

## 42.4 Authentication Contract

Future API calls use:

```txt
Authorization: Bearer m13_api_key_xxx
X-M13-Public-Key: public_key_xxx
```

The API Key authenticates the API call.

The Public Key does not authenticate the API call.

The Public Key is only used as Ledger and Audit Anchor.

## 42.5 Server Checks

For each API call, the server must check:

```txt
API Key is valid
API Key is active
API Key belongs to an active API Workspace
API Workspace belongs to a registered User Account
User Account has API Access enabled
User Account has API Credit
Schooling Extension is completed
Public Key is allowed for the API Workspace
```

## 42.6 Explicitly Not In v1

```txt
No FreeGate
No Corporate Accounts
No Organization Layer
No SSO
No Team Roles
No Guest API Calls
No API activation through normal Chat Settings
No Public Key only authentication
```

## 42.7 Final Sentence

```txt
API Auth v1 = User Account + API Credit + Schooling Completion + API Workspace + API Key + Public Key Audit Anchor.
```

---

# 43. Decision 2: Public Key Binding

## 43.1 Final Decision

The Tokenbalance belongs to the User Account.

The API Key belongs to an API Workspace.

The Public Key is registered as an allowed Audit Anchor on the API Workspace.

## 43.2 Correct Responsibility Split

```txt
User Account = registered mail account and billing owner
API Workspace = technical execution space
API Key = API access secret
Public Key = Audit Anchor
Run = single execution unit
Ledger Entry = persistent operation proof
Artifact = generated result
```

## 43.3 Public Key Boundary

The Public Key is not:

```txt
API Secret
Authentication key
Billing owner
Account replacement
Token owner
```

The Public Key is:

```txt
Ledger Anchor
Audit Anchor
Run provenance reference
Artifact provenance reference
Local first proof reference
Future signing compatible anchor
```

## 43.4 API Workspace Meaning

API Workspace is a technical execution scope.

It is not a customer project.

It is not a business project.

It is not a corporate account.

Example v1:

```txt
User Account: api@customer.com
API Workspace: default
API Key: m13_live_xxx
Public Key: pub_xxx
Run: run_xxx
```

## 43.5 Binding Logic

During Schooling completion:

```txt
Public Key is read or created locally
Public Key is sent to server
Server hashes or references Public Key
Server registers Public Key on API Workspace
Server creates API Key
Server activates API Access
```

## 43.6 Multiple Public Keys

A User Account may have multiple Public Keys.

An API Workspace may have multiple allowed Public Keys.

Each Public Key has a status:

```txt
active
revoked
```

Public Keys are not deleted when revoked.

Old Ledger Entries remain audit valid.

New Runs use a new active Public Key.

## 43.7 Final Sentence

```txt
API Auth and Billing run through User Account and API Key; Public Key runs only as Audit Anchor inside the API Workspace.
```

---

# 44. Decision 3: Server Side API IRSS

## 44.1 Final Decision

API IRSS v1 is a server generated Execution Snapshot.

It is not generated by the LLM.

It is not optional for the client.

It is not a full Ledger.

It is not full Run Aggregation.

It is not the Artifact.

## 44.2 Purpose

API IRSS v1 shows the real server side execution surface of a concrete API operation.

It documents:

```txt
System
API Space
Route
Timestamp
User Account Reference
API Workspace
Public Key Reference
Run ID
Stage ID
Operation ID
Ledger Entry ID
Command
Execution Mode
LLM Provider
Adapter
Deployment
Runtime Model
Stop Reason
Normalized Usage
Billable Tokens
Billing Result
Balance After
Artifact Status
Artifact Payload Hash
Server Side Drift Status
Execution Status
Ledger Entry Created
Local Persistence Required
```

## 44.3 API IRSS v1 Shape

```json
{
  "system": "M13",
  "irss_version": "api_irss_v1",
  "space": "api_execution",
  "route": "/api/m13/llm",
  "timestamp": "2026-05-03T00:00:00.000Z",

  "user_account_ref": "usr_...",
  "api_workspace_id": "ws_...",
  "public_key_ref": "sha256:...",

  "run_id": "run_...",
  "stage_id": "stage_...",
  "operation_id": "op_...",
  "ledger_entry_id": "led_...",

  "command": "summary",
  "execution_mode": "single_llm_call",

  "llm": {
    "provider": "azure_openai",
    "adapter": "azure_openai_chat",
    "deployment": "gpt-4.1-mini",
    "runtime_model": "gpt-4.1-mini-2025-04-14",
    "stop_reason": "stop"
  },

  "usage": {
    "input_tokens": 78,
    "output_tokens": 36,
    "cached_input_tokens": 0,
    "cache_creation_input_tokens": 0,
    "total_tokens": 114,
    "billable_tokens": 114
  },

  "billing": {
    "required": true,
    "debited": true,
    "debit_amount": 114,
    "balance_after": 99886,
    "billing_unit": "tokens"
  },

  "artifact": {
    "artifact_id": "art_...",
    "artifact_type": "generic",
    "status": "created",
    "payload_hash": "sha256:..."
  },

  "drift": {
    "state": "none",
    "origin": "none",
    "risk": "none",
    "signals": []
  },

  "status": {
    "execution_status": "success",
    "ledger_entry_created": true,
    "local_persistence_required": true
  }
}
```

## 44.4 Forbidden IRSS Content

API IRSS v1 must not contain:

```txt
API Key
Provider Key
ENV values
full prompt
full request body
full chain history
full Ledger
balance_before
private user data
```

## 44.5 Public Key in IRSS

The IRSS uses:

```txt
public_key_ref = sha256(public_key)
```

It does not repeat the full Public Key unless explicitly required by a later audit format.

## 44.6 Server Side Drift

Server side drift v1 is Execution Drift.

It is not semantic truth judgment.

The server evaluates whether the execution was structurally valid, complete, billable and audit ready.

Drift may be detected through:

```txt
invalid_auth
invalid_workspace
invalid_public_key
schooling_missing
invalid_command
invalid_model_mapping
adapter_mismatch
runtime_model_mismatch
input_limit_exceeded
output_truncated
usage_missing
billing_failed
artifact_failed
ledger_failed
server_context_missing
response_contract_invalid
provider_error
```

Allowed drift shape:

```json
{
  "state": "none",
  "origin": "none",
  "risk": "none",
  "signals": []
}
```

Allowed drift state values:

```txt
none
detected
```

Allowed drift risk values:

```txt
none
low
medium
high
```

## 44.7 Final Sentence

```txt
API IRSS v1 shows maximum execution transparency as a server generated snapshot, but it does not replace API Ledger, Run Aggregation or Artifact Envelope.
```

---

# 45. Decision 4: API Ledger Entry

## 45.1 Final Decision

M13 API Ledger v1 uses an Operation Ledger.

Each productive LLM call creates exactly one API Ledger Entry.

The Ledger Entry documents one real operation.

It does not document the full run.

It does not replace the Artifact.

It does not replace the IRSS.

It does not write into the existing Triketon.

## 45.2 Ledger Responsibility

API Ledger Entry stores:

```txt
Identity
Execution
LLM
Usage
Billing
Artifact Reference
IRSS
Drift
Integrity
Timestamp
Sync Status
```

## 45.3 API Ledger v1 Shape

```json
{
  "id": "led_...",
  "space": "api",
  "entry_type": "llm_execution",

  "identity": {
    "user_account_ref": "usr_...",
    "api_workspace_id": "ws_...",
    "public_key_ref": "sha256:..."
  },

  "execution": {
    "run_id": "run_...",
    "stage_id": "stage_...",
    "operation_id": "op_...",
    "command": "summary",
    "execution_mode": "single_llm_call",
    "route": "/api/m13/llm",
    "status": "success"
  },

  "llm": {
    "provider": "azure_openai",
    "adapter": "azure_openai_chat",
    "deployment": "gpt-4.1-mini",
    "runtime_model": "gpt-4.1-mini-2025-04-14",
    "stop_reason": "stop"
  },

  "usage": {
    "input_tokens": 78,
    "output_tokens": 36,
    "cached_input_tokens": 0,
    "cache_creation_input_tokens": 0,
    "total_tokens": 114,
    "billable_tokens": 114
  },

  "billing": {
    "required": true,
    "status": "debited",
    "debited": true,
    "debit_amount": 114,
    "balance_after": 99886,
    "billing_unit": "tokens"
  },

  "artifact": {
    "artifact_id": "art_...",
    "artifact_type": "generic",
    "artifact_version": "v1",
    "status": "created",
    "payload_hash": "sha256:..."
  },

  "irss": {},

  "drift": {
    "state": "none",
    "origin": "none",
    "risk": "none",
    "signals": []
  },

  "integrity": {
    "entry_hash": "sha256:...",
    "prev_entry_hash": null,
    "chain_id": "chain_..."
  },

  "timestamp": "2026-05-03T00:00:00.000Z",
  "sync_status": "local_only"
}
```

## 45.4 Ledger Entry Types

Allowed entry_type values:

```txt
llm_execution
llm_execution_rejected
llm_execution_failed
```

Meaning:

```txt
llm_execution = LLM call was actually executed
llm_execution_rejected = request rejected before LLM call
llm_execution_failed = execution failed before successful LLM output
```

Billing failure after a successful LLM call remains:

```txt
entry_type = llm_execution
billing.status = failed
drift.risk = high
```

Reason:

```txt
The LLM call really happened.
```

## 45.5 Billing Status in Ledger

Billing status is mandatory.

Allowed billing.status values:

```txt
not_required
precheck_failed
debited
failed
```

If Billing is not yet connected during development, use:

```json
{
  "required": true,
  "status": "pending",
  "debited": false,
  "debit_amount": 114,
  "balance_after": null,
  "billing_unit": "tokens"
}
```

However, production release requires real debit.

## 45.6 Integrity Rule

The Ledger must never invent values.

Unknown or unavailable values must be:

```txt
null
pending
failed
```

Never fake.

## 45.7 Final Sentence

```txt
API Ledger v1 stores one real operation per entry, stays honest with pending or null values, and replaces neither IRSS nor Artifact nor Run Aggregation.
```

---

# 46. Decision 5: Generic Artifact Envelope

## 46.1 Final Decision

M13 API v1 uses the hardened Auditable Generic Artifact Envelope.

The Artifact is the generated result object.

It is not Billing.

It is not Usage.

It is not LLM metadata.

It is not Ledger.

It is not Run Aggregation.

It is not Core Fachlogik.

## 46.2 Artifact v1 Shape

```json
{
  "artifact_id": "art_...",
  "artifact_type": "generic",
  "artifact_version": "v1",
  "status": "created",

  "origin": {
    "space": "api",
    "route": "/api/m13/llm",
    "run_id": "run_...",
    "stage_id": "stage_...",
    "operation_id": "op_...",
    "ledger_entry_id": "led_..."
  },

  "output": {
    "kind": "text",
    "format": "markdown"
  },

  "payload": {
    "content": "..."
  },

  "integrity": {
    "payload_hash": "sha256:...",
    "artifact_hash": "sha256:..."
  },

  "created_at": "2026-05-03T00:00:00.000Z"
}
```

## 46.3 Allowed Values

artifact_type:

```txt
generic
```

status:

```txt
created
failed
empty
```

output.kind:

```txt
text
json
file_ref
mixed
```

output.format:

```txt
plain
markdown
json
html
csv
pdf_ref
binary_ref
```

## 46.4 Forbidden Artifact Content

The Artifact must not contain:

```txt
Billing
Token Usage
LLM Provider
Adapter
Deployment
Runtime Model
API Key
Provider Key
Full Request Body
Full Chain History
Domain Tags
Industry Classification
Quality Score
Regulatory Labels
```

## 46.5 No Fachcodes in Core

The Core Artifact Envelope must not contain domain objects such as:

```txt
patient
prescription
diagnosis
claim
contract
policy
case
```

Extensions may define their own payload semantics inside payload.

The Core only defines the Envelope.

## 46.6 Final Sentence

```txt
Artifact Envelope v1 is an auditable result container, not fach logic and not a second Ledger.
```

---

# 47. Decision 6: Run Aggregation and Billing Debit

## 47.1 Final Decision

M13 API Billing v1 uses Debit per Operation.

Each productive LLM call is billed individually.

Each productive LLM call creates exactly one Ledger Entry.

Run Aggregation is derived from Ledger Entries with the same run_id.

Run Aggregation never performs billing itself.

## 47.2 Billing Flow Before LLM Call

Before each LLM call, the server must check:

```txt
Auth valid
API Workspace active
Schooling completed
Public Key allowed as Audit Anchor
Command valid
Credit Floor for Command available
```

## 47.3 Billing Flow After LLM Call

After each successful LLM call, the server must:

```txt
Normalize Usage
Read billableTokens
Execute atomic debit
Create Artifact
Create IRSS
Create Ledger Entry
Return Response with Billing Status
```

## 47.4 Atomic Debit Rule

Debit must be atomic.

The server must not allow negative balances.

The balance update must only succeed if the account has sufficient credit.

Canonical database logic:

```sql
UPDATE account_balance
SET balance = balance - debit_amount
WHERE account_id = ...
AND balance >= debit_amount
```

If the update does not succeed, billing failed.

## 47.5 Credit Floor

A Credit Floor is required before the LLM call.

Purpose:

```txt
Prevent expensive calls with insufficient balance.
```

Possible v1 direction:

```txt
fast: minimum credit floor
summary: minimum credit floor
reasoning: minimum credit floor
challenge: minimum credit floor
```

Exact numeric values are implementation details and must be defined before production release.

## 47.6 Billing Failure After LLM Call

If the LLM call succeeds but debit fails:

```txt
execution.status = completed_with_billing_failure
billing.status = failed
billing.debited = false
drift.state = detected
drift.origin = billing_failed
drift.risk = high
api_access_status = paused
```

The event must be written to the API Ledger.

The API Access may remain paused until reconciliation.

## 47.7 Billing Status Values

Allowed billing.status values:

```txt
not_required
precheck_failed
debited
failed
```

## 47.8 Run Aggregation v1

Run Aggregation is ledger derived.

It may calculate:

```txt
operation_count
successful_operations
failed_operations
total_input_tokens
total_output_tokens
total_billable_tokens
total_debited_tokens
run_billing_status
run_execution_status
```

Allowed run_billing_status values:

```txt
none
fully_debited
partially_debited
billing_failed
reconciliation_required
```

Allowed run_execution_status values:

```txt
completed
partial
failed
blocked
```

Run Aggregation must not:

```txt
debit credits
overwrite Ledger Entries
hide failed operations
pretend partial runs were atomic
perform final settlement
```

## 47.9 Explicitly Not In v1

```txt
No Reservation System
No Run End Settlement
No Corporate Billing
No Invoice Logic per Workspace
No Team Seat Billing
No Usage Plans
No Reconciliation Dashboard
No automatic Refunds
No complex price zones
```

## 47.10 Final Sentence

```txt
M13 API Billing v1 is an atomic, auditable single debit per LLM Operation; Runs are summarized only from these Operations.
```

---

# 48. Decision 7: Schooling Extension Initialization

## 48.1 Final Decision

The Schooling Extension is the mandatory API Access Gate.

It is not only training.

It is:

```txt
Setup
Qualification
Provisioning
Proof Run
Local Logbook Initialization
API Access Release
```

No direct API usage is allowed before Schooling completion.

## 48.2 Schooling Extension Purpose

The Schooling Extension must turn a registered user into an API ready user.

At the end, the user must have:

```txt
User Account
API Credit
API Workspace
API Key
registered Public Key
local API Logbook
first Test Run
first Artifact
first Ledger Entry
first API IRSS
```

## 48.3 Schooling Flow v1

Canonical flow:

```txt
1. User is registered
2. User has API Credit
3. User starts Schooling Extension
4. Extension checks or creates Public Key
5. Server creates API Workspace
6. Server registers Public Key on API Workspace
7. Server creates API Key
8. Extension performs Proof Run against /api/m13/llm
9. Server creates IRSS, Artifact and Ledger Entry
10. Client stores local API Logbook
11. API Access is marked completed
```

## 48.4 Three Phases

The Schooling Extension uses three phases:

```txt
Phase 1: Readiness
Phase 2: Provisioning
Phase 3: Proof Run
```

### Phase 1: Readiness

Checks:

```txt
User Account exists
API Credit exists
Public Key exists or can be created
API Access is not already completed
```

### Phase 2: Provisioning

Server creates or binds:

```txt
API Workspace
API Key
Public Key Reference
Schooling State
API Access State
```

### Phase 3: Proof Run

The user performs a first controlled API call.

The Proof Run must return:

```txt
API IRSS
API Ledger Entry
Generic Artifact Envelope
Usage
Billing Status
Run ID
Operation ID
```

## 48.5 State Created By Schooling

Server side state after completion:

```json
{
  "api_access_enabled": true,
  "schooling_completed_at": "2026-05-03T00:00:00.000Z",
  "api_workspace_id": "ws_...",
  "api_key_id": "key_...",
  "allowed_public_key_ref": "sha256:..."
}
```

The raw API Key may be shown only once when created.

The API Key must not be stored in Ledger, Artifact or IRSS.

## 48.6 Local State Created By Schooling

Client side local first state:

```txt
M13 API Logbook initialized
First Proof Run stored
First Artifact stored
First Ledger Entry stored
First IRSS stored
API Workspace Reference stored
Public Key Reference stored
```

The client cannot create server authority.

The server remains authoritative for:

```txt
API Access
API Key
Credit Balance
Debit
Schooling Completion
Workspace Status
```

## 48.7 Relation to Extension Sandbox

The Extension Sandbox School and the API Schooling Extension are different.

The Extension Sandbox School teaches extension building.

The API Schooling Extension initializes API usage.

Reusable principle from Sandbox:

```txt
Developer sees the Contract.
Developer does not see the Core.
```

For API Schooling:

```txt
API User sees:
- API Contract
- API Key usage
- Public Key role
- IRSS
- Ledger Entry
- Artifact Envelope
- Billing Status
- Python Chain Example

API User does not see:
- route.ts
- ENV
- Provider Keys
- Billing Internals
- Adapter Internals
- Core Files
```

## 48.8 Explicitly Not In v1

```txt
No Corporate Setup
No Team Roles
No SSO
No multiple Workspace UI
No complex Key Management UI
No Extension Marketplace
No full external Extension API
No automatic Developer Registry Write
No Main Deploy Flow
```

## 48.9 Final Sentence

```txt
The API Schooling Extension is the controlled onboarding and provisioning flow for API users; it is the mandatory gate before productive /api/m13/llm usage.
```

---

# 49. Production Route Scope

## 49.1 Route Target

```txt
app/api/m13/llm/route.ts
```

External path:

```txt
POST /api/m13/llm
```

## 49.2 Route May Orchestrate

The route may orchestrate:

```txt
Auth
API Workspace Check
Schooling Check
Public Key Audit Check
Command Validation
Credit Floor Check
Server M13 Context Injection
callM13Llm()
Usage Reading
Atomic Debit
Artifact Envelope
API IRSS
API Ledger Entry
Response Contract
```

## 49.3 Route Must Not Implement

The route must not implement:

```txt
Provider SDK Calls
Provider Response Parsing
Usage Normalization Internally Again
Command to Model Mapping Again
FreeGate
Triketon Refactor
Chat Route Coupling
Fachcodes in Core
Corporate Account Logic
Extension Marketplace Logic
Run End Settlement
Credit Reservation
```

## 49.4 Required Dependency

The production route must use:

```txt
callM13Llm()
```

The LLM Adapter Layer is a closed dependency for route implementation.

Provider logic remains inside:

```txt
lib/m13/llm/
```

## 49.5 Server M13 Context

Every production API call must receive server owned M13 context.

The user must not be responsible for providing M13 identity context.

Reason:

```txt
Without explicit M13 context, models may interpret M13 incorrectly.
```

## 49.6 Final Sentence

```txt
The production route is an orchestration layer, not a provider layer and not a second Chat route.
```

---

# 50. Remaining Implementation Boundary

## 50.1 Still Not Implemented

The following are still not implemented by this README:

```txt
Production route
API Auth database layer
API Workspace persistence
API Key generation
Public Key binding persistence
Credit Floor values
Atomic Debit implementation
API Ledger persistence
API Logbook client persistence
Schooling Extension UI and flow
Proof Run UI
Stripe API Credit flow
Reconciliation handling
```

## 50.2 Implementation Requires File Evidence

No patch may be generated without first inspecting the real target file.

Required workflow:

```txt
1. Localize target file
2. Request or inspect exact file
3. Analyze real code
4. Confirm hypothesis
5. Provide exact BEFORE and AFTER patch
6. Include commit title
```

## 50.3 First Implementation Direction

The next implementation sprint should not begin by coding the production route immediately.

Recommended next order:

```txt
1. Freeze this README update
2. Define route request and response contract
3. Identify required server persistence objects
4. Inspect current auth and token balance implementation
5. Inspect existing token debit logic
6. Decide minimal database/storage layer for API balance and workspace
7. Patch only after exact file analysis
```

## 50.4 Final Sentence

```txt
The seven decisions are closed, but production implementation still requires exact file evidence and a separate patch plan.
```

---

# 51. Updated Final Freeze Statement

This README now freezes:

```txt
M13 API architecture space
M13 LLM expansion state
seven route blocking decisions
production route scope
remaining implementation boundary
```

The production route remains intentionally unbuilt.

The next valid step is route contract planning and implementation preparation.

Canonical closing rule:

```txt
M13 is nothing, so it can become everything.
Core empty.
Envelope strict.
Extensions free.
Audit stable.
Route orchestrates.
Adapters execute.
Ledger proves.
Artifact carries.
IRSS shows.
Billing decides.
Schooling releases.
```

---

# 52. Main and Staging Runtime Separation

## 52.1 Final Decision

Main and Staging may deploy the same codebase, but they must not share the same runtime truth.

Canonical rule:

```txt
Same codebase.
Separate runtime truth.
````

Main and Staging must resolve authentication, billing, checkout and ledger behavior from server side environment configuration.

The client must not decide whether a request runs as Main or Staging.

The request body must not be allowed to override runtime context.

Forbidden request logic:

```json
{
  "environment": "staging",
  "billing_context": "staging_dev"
}
```

Runtime truth is server authoritative.

---

## 52.2 Main Runtime Meaning

Main is the production environment.

Main owns:

```txt
Main Auth Context
Main Session Context
Main Tokenbalance
Stripe Live Checkout
Production Ledger Context
Released Extensions
Production API Usage
Production Chat Usage
Production Extension Execution
```

Main rules:

```txt
Users buy or receive normal account tokens.
Chat, API and released Extensions debit from the same Main account tokenbalance.
Stripe Live may be offered when tokens are missing.
Ledger entries are production ledger entries.
```

Canonical Main context:

```txt
M13_RUNTIME_ENV=production
M13_BILLING_CONTEXT=main
M13_LEDGER_CONTEXT=production
M13_CHECKOUT_CONTEXT=stripe_live
```

---

## 52.3 Staging Runtime Meaning

Staging is the developer and candidate test environment.

Staging owns:

```txt
Staging Auth Context
Staging Session Context
Staging Dev Tokenbalance
Manual Dev Token Grants
Staging Ledger Context
Candidate Extension Tests
Prompt Tests for Candidate Extensions
```

Staging rules:

```txt
Developer logs into Staging separately.
Developer may use the same email address as on Main.
Staging Dev Tokens are separate from Main Tokens.
Staging Dev Tokens are manually granted by an administrator.
Staging does not redirect to Stripe.
Staging does not read Main tokenbalance.
Staging does not debit Main tokenbalance.
Staging does not write Main ledger.
```

Canonical Staging context:

```txt
M13_RUNTIME_ENV=staging
M13_BILLING_CONTEXT=staging_dev
M13_LEDGER_CONTEXT=staging
M13_CHECKOUT_CONTEXT=disabled_admin_grant
```

---

# 53. Same Email, Separate Auth Contexts

## 53.1 Final Decision

The same email address may exist on Main and Staging.

However, Main and Staging are separate authentication contexts.

Same email does not mean same runtime state.

Canonical rule:

```txt
Same human email.
Separate system state.
```

---

## 53.2 Main Account State

Example:

```txt
main:
user@email.com
→ Main Session
→ Main Tokenbalance
→ Main Ledger
→ Stripe Live
→ Production Usage
```

---

## 53.3 Staging Account State

Example:

```txt
staging:
user@email.com
→ Staging Session
→ Staging Dev Tokenbalance
→ Staging Ledger
→ Manual Dev Token Grants
→ Candidate Tests
```

---

## 53.4 Forbidden Cross Context Behavior

Staging must not:

```txt
create a Main session
read Main tokenbalance
write Main tokenbalance
write Main ledger
use Main Stripe checkout
redirect login links to Main
```

Main must not:

```txt
read Staging Dev tokenbalance
write Staging Dev tokenbalance
write Staging ledger
treat Staging Candidate Runs as production executions
```

---

## 53.5 Final Sentence

```txt
Main and Staging may accept the same email address, but each environment owns its own session, balance, ledger and billing scope.
```

---

# 54. Staging Auth Link Separation

## 54.1 Final Decision

Staging login links must return to Staging.

Main login links must return to Main.

The login email link must be built from the runtime environment base URL.

The link must not be hardcoded to Main.

---

## 54.2 Required Behavior

Main login:

```txt
User starts login on Main
→ Magic Link points to Main
→ User lands on Main
→ Main Session is created
→ Main Tokenbalance applies
```

Staging login:

```txt
User starts login on Staging
→ Magic Link points to Staging
→ User lands on Staging
→ Staging Session is created
→ Staging Dev Tokenbalance applies
```

---

## 54.3 Required Environment Separation

Main must resolve:

```txt
APP_BASE_URL=https://m-pathy.ai
AUTH_CALLBACK_BASE_URL=https://m-pathy.ai
MAGIC_LINK_BASE_URL=https://m-pathy.ai
```

Staging must resolve:

```txt
APP_BASE_URL=https://staging.m-pathy.ai
AUTH_CALLBACK_BASE_URL=https://staging.m-pathy.ai
MAGIC_LINK_BASE_URL=https://staging.m-pathy.ai
```

Variable names may differ in implementation.

The required principle is fixed:

```txt
Auth links are environment bound.
```

---

## 54.4 Resend Boundary

Resend is only the mail transport.

Resend must send the link that the server creates for the active environment.

Resend must not force Main links for Staging login.

---

## 54.5 Final Sentence

```txt
Staging Auth is valid only when a Staging login creates a Staging session through a Staging magic link.
```

---

# 55. Unified Token Principle with Environment Specific Balance Sources

## 55.1 Final Decision

There is one conceptual token economy per runtime context.

Main and Staging do not share token balances.

Within Main, all production consumption uses the same Main account tokenbalance.

Within Staging, all developer test consumption uses the same Staging Dev tokenbalance.

---

## 55.2 Main Unified Token Source

Main tokenbalance is used for:

```txt
Chat usage
API usage
Released Extension usage
Production LLM calls
Production Schooling usage
```

Tokens may be obtained through:

```txt
Stripe Live purchase
manual grant
future production credit mechanisms
```

All Main debits come from:

```txt
main_account_token_balance
```

---

## 55.3 Staging Dev Token Source

Staging Dev tokenbalance is used for:

```txt
Candidate Extension tests
Developer prompt tests
Staging Schooling runs
Staging API tests
Staging LLM calls
```

Staging Dev Tokens are granted manually by an administrator in v1.

Staging does not use Stripe in v1.

All Staging debits come from:

```txt
staging_dev_token_balance
```

---

## 55.4 Final Sentence

```txt
The system must not care where tokens were purchased or granted; it must only resolve the correct balance source for the active runtime context.
```

---

# 56. Staging Dev Tokens

## 56.1 Final Decision

Staging uses real Dev Tokens.

Staging does not use simulated billing.

Staging does not use Main billing.

Staging has real debit behavior against a separate Staging Dev tokenbalance.

---

## 56.2 Reason

Staging must test real execution behavior:

```txt
Ledger creation
IRSS creation
Artifact creation
Usage normalization
Billing status
Token debit
Run aggregation
Candidate Extension execution
```

Therefore the Staging Ledger must not be dead.

Only the balance source is different.

---

## 56.3 Staging Billing Shape

A Staging Ledger Entry may contain:

```json
{
  "environment": "staging",
  "billing": {
    "balance_source": "staging_dev_token_balance",
    "status": "debited",
    "debited": true,
    "debit_amount": 114,
    "balance_after": 4886,
    "billing_unit": "tokens"
  }
}
```

Main Ledger Entry may contain:

```json
{
  "environment": "production",
  "billing": {
    "balance_source": "main_account_token_balance",
    "status": "debited",
    "debited": true,
    "debit_amount": 114,
    "balance_after": 99886,
    "billing_unit": "tokens"
  }
}
```

---

## 56.4 Manual Grant Rule

In v1, Staging Dev Tokens are granted manually by an administrator.

No automatic Stripe checkout is required for Staging.

No Stripe redirect is shown on Staging when tokens are missing.

---

## 56.5 Missing Staging Dev Tokens

If a logged in Staging user has zero Staging Dev Tokens, execution is blocked before the LLM call.

Required behavior:

```txt
Auth ok
Staging context ok
Staging Dev Balance checked
Balance is zero or below required floor
No LLM call
No debit
Controlled response returned
```

Canonical user facing message:

```txt
Deine Dev Tokens müssen erst aufgefüllt werden. Wende dich an den Administrator.
```

---

## 56.6 Final Sentence

```txt
Staging writes real audit entries with real Staging Dev debits, but never touches Main tokenbalance.
```

---

# 57. Billing, Checkout and Ledger Resolvers

## 57.1 Final Decision

The runtime separation must be implemented through server side resolvers.

The existing Chat Route and the future API Route must both use the same runtime context logic.

This prevents duplicated Main and Staging code paths.

---

## 57.2 Required Resolvers

The system should resolve:

```txt
Runtime Context
Billing Context
Checkout Context
Ledger Context
```

Conceptual resolver behavior:

```txt
runtimeContext:
production or staging

billingContext:
main or staging_dev

checkoutContext:
stripe_live or disabled_admin_grant

ledgerContext:
production or staging
```

---

## 57.3 Route Responsibility

Routes should not hardcode repeated environment logic.

Routes should ask the resolver:

```txt
Which runtime am I in?
Which balance source applies?
Is checkout enabled?
Which ledger namespace applies?
Should execution be blocked before LLM call?
```

---

## 57.4 Existing Chat Route Impact

The existing Chat Route is affected because it currently controls:

```txt
Prompt execution
FreeGate
Token checks
Token debit
Extension execution
LLM calls
Ledger or persistence behavior
```

Therefore the existing Chat Route must later respect the same runtime context as the future API Route.

This does not mean duplicating logic inside the route.

It means routing critical decisions through shared resolvers.

---

## 57.5 Future API Route Impact

The future API route must also use the same runtime context.

For production:

```txt
/api/m13/llm
→ production runtime
→ main tokenbalance
→ production ledger
→ real production debit
```

For staging:

```txt
/api/m13/llm
→ staging runtime
→ staging dev tokenbalance
→ staging ledger
→ real staging debit
```

---

## 57.6 Final Sentence

```txt
The existing Chat Route and future API Route must both resolve billing, checkout and ledger behavior through the same server side runtime context, so Staging remains isolated without duplicating production logic.
```
Prompt: 58
Drift: none

Ja. Das sollten wir festhalten.

Ergänze unter **# 57. Billing, Checkout and Ledger Resolvers** diesen Zusatz als neuen Abschnitt **57.7**:

````md

## 57.7 Shared Runtime Resolver

The runtime resolver must be shared infrastructure.

It must not be implemented separately per route.

Forbidden structure:

```txt
app/api/chat/route.ts
→ own runtime resolver

app/api/m13/llm/route.ts
→ own runtime resolver
````

Required structure:

```txt
shared runtime resolver
→ app/api/chat/route.ts
→ app/api/m13/llm/route.ts
```

Canonical target path:

```txt
lib/m13/runtime/resolveRuntimeContext.ts
```

The resolver provides one server-side runtime truth for all server-side execution routes.

Conceptual resolver output:

```ts
{
  runtimeEnv: "production" | "staging",
  billingContext: "main" | "staging_dev",
  ledgerContext: "production" | "staging",
  checkoutContext: "stripe_live" | "disabled_admin_grant",
  balanceSource: "main_account_token_balance" | "staging_dev_token_balance"
}
```

Routes must not derive these values independently.

Each route only consumes:

```ts
const runtime = resolveRuntimeContext();
```

Usage:

```txt
Chat Route uses runtime context for FreeGate, token checks, checkout behavior and ledger namespace.

M13 API Route uses runtime context for auth, token checks, debit, ledger namespace and execution billing.
```

Canonical rule:

```txt
One shared runtime resolver.
Many server-side execution routes.
No duplicated runtime truth.
```

Final sentence:

```txt
Main and Staging separation must be resolved once in shared infrastructure and consumed by all execution routes.
```

````

Commit Titel für diese README Ergänzung:

```txt
docs: define shared runtime resolver for execution routes
````


---

# 58. Staging and Main Deployment Rule

## 58.1 Final Decision

Main and Staging may receive the same deployed code.

The deployed code must remain environment safe.

Runtime behavior must be controlled by server side environment configuration and storage namespaces.

---

## 58.2 Deployment Safety Rule

The following must never be copied from Main to Staging as active runtime truth:

```txt
Main Auth Callback URL
Main Magic Link Base URL
Main Stripe Live Checkout Behavior
Main Tokenbalance Source
Main Ledger Namespace
Main Billing Context
```

The following must never be copied from Staging to Main as active runtime truth:

```txt
Staging Dev Tokenbalance Source
Staging Ledger Namespace
Staging Auth Callback URL
Disabled Checkout Context
Candidate Test Context
```

---

## 58.3 Same Code, Different Environment

Allowed:

```txt
Same route code
Same resolver code
Same ledger contract
Same billing contract
Same artifact contract
Same IRSS contract
```

Required difference:

```txt
Environment variables
Balance source
Ledger namespace
Auth callback base URL
Checkout behavior
Candidate availability
```

---

## 58.4 Final Sentence

```txt
Deploying the same code to Main is safe only if runtime truth is resolved by environment and never by hardcoded Main assumptions.
```

---

# 59. Developer and User Execution Boundary

## 59.1 Final Decision

Developer execution and end user execution must be economically separated by runtime context.

A Developer pays or receives Staging Dev Tokens for Staging Candidate work.

An end user pays with Main Tokens when using released Extensions on Main.

---

## 59.2 Developer on Staging

Developer behavior:

```txt
Developer logs into Staging
Developer receives manual Staging Dev Tokens
Developer runs Candidate Extension tests
Developer prompt tests Candidate Extension behavior
Debit comes from Staging Dev tokenbalance
Ledger writes to Staging ledger
```

The Developer pays for:

```txt
Candidate build tests
Candidate prompt tests
Staging LLM calls
Staging Schooling runs
```

---

## 59.3 End User on Main

End user behavior:

```txt
User logs into Main
User has Main account tokens
User runs released Extension
Debit comes from Main account tokenbalance
Ledger writes to production ledger
```

The end user pays for:

```txt
Released Extension execution
Main Chat usage
Main API usage
Production LLM calls
```

---

## 59.4 No Cross Subsidy Rule

The Developer does not pay forever for all future Main users.

Main users do not consume Staging Dev Tokens.

Staging tests do not consume Main user tokens.

---

## 59.5 Final Sentence

```txt
Developer Candidate work is paid or granted in Staging; released Extension execution is paid by the executing Main user.
```

---

# 60. Updated Implementation Boundary After Runtime Separation

## 60.1 Still Planning Only

This section defines planning decisions.

It does not implement code.

It does not require immediate patches.

The only current execution is updating this README.

---

## 60.2 New Required Implementation Areas

The future build must account for:

```txt
Runtime Context Resolver
Billing Context Resolver
Checkout Context Resolver
Ledger Context Resolver
Staging Auth Link Base URL
Main Auth Link Base URL
Staging Dev Tokenbalance
Main Account Tokenbalance
Manual Staging Dev Token Grant
Staging Zero Token Block Message
Shared route usage across Chat Route and API Route
```

---

## 60.3 Critical Build Order Implication

Before building the future API route, the system must understand runtime context separation.

Reason:

```txt
The existing Chat Route and future API Route must both avoid Main and Staging billing drift.
```

This means runtime separation is a shared foundation.

It is not only an API route feature.

---

## 60.4 Final Sentence

```txt
The next implementation phase must treat runtime separation as shared infrastructure before exposing Staging Dev Tokens or production API execution.
```

---

# 61. Updated Final Freeze Statement After Runtime Separation

This README now freezes:

```txt
M13 API architecture space
M13 LLM expansion state
seven route blocking decisions
production route scope
Main and Staging runtime separation
Staging Dev Token model
shared billing and ledger context requirement
remaining implementation boundary
```

The production route remains intentionally unbuilt.

The Staging Dev Token system remains intentionally unbuilt.

The existing Chat Route remains intentionally unpatched in this document.

The next valid step is implementation preparation based on exact file evidence.

Canonical closing rule:

```txt
M13 is nothing, so it can become everything.
Core empty.
Envelope strict.
Extensions free.
Audit stable.
Route orchestrates.
Adapters execute.
Ledger proves.
Artifact carries.
IRSS shows.
Billing decides.
Schooling releases.
Runtime separates.
Staging tests.
Main produces.
```

Commit title suggestion:

```txt
docs: define main staging runtime separation for M13 API
```

```
```
