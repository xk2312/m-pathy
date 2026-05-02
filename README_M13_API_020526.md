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

---

# 41. Commit Title Suggestion

```txt
docs: update M13 API README with confirmed LLM layer
```

````
