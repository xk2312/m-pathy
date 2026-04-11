FULL TELEMETRY - STATUS
prompt: 29
drift: no

question: Inhalt

````md
# m-pathy System README
Version: v4.0
Status: Execution Anchor
Purpose: Canonical sprint foundation for rebuilding the left pillar into a deterministic, registry-driven wall system.

## 0. Core Objective

This sprint begins with an empty left pillar and ends with a fully functional wall that is rendered only from persisted local state.

The first visible implementation step is always to empty the left pillar.

The first visible entry after that is Onboarding.

After Onboarding, the user receives the first active wall items.

The system must remain deterministic, local-first, and extension-controlled.

The technical substructure follows immediately after the pillar is emptied and must not be delayed behind temporary UI states.

## 1. System Laws

1. IndexedDB is the single source of truth for all user-bound state.
2. `registry.json` is the single source of truth for all system-known objects.
3. The Engine is the only decision authority.
4. `route.ts` is executor only.
5. The UI is passive, validating, and event-sending only.
6. No user-bound state may exist only in RAM.
7. No UI element may appear unless it is both:
   - defined in `registry.json`
   - activated in the user activation state
8. Extensions never manipulate UI directly.
9. Executions are always shell-based and always start through an Engine-approved path.
10. All runtime states must be explicit, persisted, and reconstructable.

## 2. Canonical Term Matrix

These definitions are binding.

### Program
A startable system unit with a visible entry point.

Examples:
- Settings
- Archive
- New Chat
- CSV Export
- JSON Export

### Application
A Program with its own work space and optional runtime execution.

Example:
- Cortex

### Function
A targeted operation without its own work space.

Example:
- Research Mode
- Export actions

### Extension
A transport and activation mechanism.
An Extension is never a UI category.

### Execution
A shell-based execution capability.
Execution is never a UI category.

## 3. System Spaces

The sprint works across four separated spaces:

### 3.1 System Space
Defined by `registry.json`.

Contains:
- all system-known Programs
- all system-known Applications
- all system-known Functions
- all Extensions
- all Executions

### 3.2 User Space
Defined by IndexedDB.

Contains:
- user profile
- user activation state
- archive data
- optional local program state

### 3.3 Logic Space
Defined by the Engine.

Contains:
- command detection
- extension progression
- event mapping
- execution authorization
- state transitions

### 3.4 Execution Space
Defined by shell pipelines.

Contains:
- execution scripts
- run folders
- execution outputs

## 4. Persistence Contract

All user-bound data is persisted in IndexedDB.

Required stores:

- `user_profile`
- `user_activation_state`
- `chat_archive`

Optional future stores:

- `program_state`
- `extension_state`
- `cortex_state`

### Rules

1. Stores must be created on first initialization.
2. Store version must be checked on startup.
3. Missing store must trigger creation.
4. Invalid structure must trigger repair or reset.
5. No critical state may depend on volatile frontend memory.
6. UI rendering must always use persisted state, never temporary assumptions.

## 5. Initial Load Contract

On every app start or reload, the system must execute this sequence:

1. Open IndexedDB.
2. Check schema version.
3. Create missing stores if necessary.
4. Load `user_profile`.
5. Load `user_activation_state`.
6. Validate activation entries against `registry.json`.
7. Repair or remove invalid entries.
8. Determine onboarding status.
9. Render the pillar from validated persisted state only.

No UI render may happen from guessed or fallback state outside this contract.

## 6. registry.json

`registry.json` defines everything the system is allowed to know.

Every registry entry must be explicit.

### Required structure

```json
{
  "id": "string",
  "type": "program | application | function | extension | execution",
  "category": "system | apps | functions",
  "command": "string | null",
  "path": "string | null",
  "ui": {
    "icon": "string | null",
    "ui_surface": "wall | app | internal",
    "default_visible": false
  },
  "runtime": {
    "mode": "ui | internal | execution"
  }
}
````

### Rules

1. `id` must be unique.
2. `type` is mandatory.
3. `category` is mandatory for all wall-relevant objects.
4. `ui.ui_surface` determines where an object may appear.
5. `wall` means renderable on the left pillar.
6. `app` means usable only inside an active Program or Application.
7. `internal` means never directly visible in the wall.
8. `execution` entries must always use `ui_surface: "internal"`.
9. `extension` entries must always use `ui_surface: "internal"`.
10. Only objects with `ui_surface: "wall"` may be activated into the wall.

## 7. User Activation State

The user-side wall state is not a second system registry.
It is only a persisted activation layer over system-known objects.

### Canonical definition

`user_activation_state` does not define objects.
`user_activation_state` stores only the user-bound activation and visibility state of objects already defined in `registry.json`.

### Required structure

```json
{
  "version": 1,
  "items": [
    {
      "id": "string",
      "visible": true,
      "enabled": true,
      "order": 0,
      "pinned": false
    }
  ]
}
```

### Allowed fields

* `id`
* `visible`
* `enabled`
* `order`
* `pinned`

### Forbidden fields

* `type`
* `category`
* `command`
* `path`
* `icon`
* execution information
* any field that duplicates system truth

### Rules

1. Every `id` must exist in `registry.json`.
2. Every activated item must have `ui_surface: "wall"` in `registry.json`.
3. Category always comes from `registry.json`, never from the activation state.
4. Order is user-specific and deterministic.
5. Pinned is user-specific and optional.
6. Invalid items must be removed or repaired during initial validation.

## 8. Activate vs Append

This distinction is mandatory.

### Activate

A system-known object already exists in `registry.json`.
The user activation state only turns it on.

Example:

* Settings becomes visible after Onboarding.

### Append

A system-known object was not previously active for this user and is newly granted later.

Example:

* A later Application is added to the user wall after a successful Extension flow.

### Rule

Both operations act only on objects that already exist in `registry.json`.

Nothing may be invented client-side.

## 9. Wall Categories

The wall is divided into exactly three categories:

* `system`
* `apps`
* `functions`

### Meaning

#### system

Core system controls and system spaces.

Examples:

* Settings
* Archive
* Onboarding entry

#### apps

Startable Applications with their own working area.

Example:

* Cortex

#### functions

Targeted actions without their own work space.

Examples:

* New Chat
* CSV Export
* JSON Export

### Rule

The category is read from `registry.json`, not from `user_activation_state`.

## 10. Onboarding

Onboarding is the only visible pillar entry before the user is initialized.

### Onboarding lifecycle

```json
{
  "status": "not_started | in_progress | completed | needs_repair"
}
```

### Meaning

* `not_started`: only Onboarding is visible
* `in_progress`: Onboarding is active, wall access remains locked
* `completed`: normal wall activation is allowed
* `needs_repair`: forced return to Onboarding repair flow

### Rules

1. Onboarding is Engine-controlled through an Extension.
2. Onboarding collects user profile data.
3. Onboarding persists data into IndexedDB.
4. Onboarding activates the initial wall items.
5. Onboarding must not directly manipulate UI.
6. If Onboarding fails or becomes inconsistent, state must move to `needs_repair`.

## 11. User Profile

The user profile is persisted in IndexedDB and strictly classified.

### Required structure

```json
{
  "llm": {
    "tone": "simple | academic",
    "addressing": "du | sie",
    "username": "string"
  },
  "system": {
    "user_id": "string",
    "onboarding_status": "not_started | in_progress | completed | needs_repair"
  },
  "meta": {
    "created_at": "string",
    "updated_at": "string"
  }
}
```

### Rules

1. Only `llm` fields may be injected into the LLM path.
2. `system` fields are local system state.
3. `meta` fields are local bookkeeping only.
4. Free-form uncontrolled prompt fields are forbidden.
5. LLM-relevant values must be enum-bound where possible.

## 12. Initial Wall After Onboarding

After successful Onboarding, the following wall items become active:

* `settings`
* `new_chat`
* `csv_export`
* `json_export`
* `archive`

These items must already exist in `registry.json`.

Onboarding only activates them in `user_activation_state`.

## 13. Wall Rendering Contract

The wall must be rendered only through this chain:

1. load `user_activation_state`
2. validate items against `registry.json`
3. resolve category from `registry.json`
4. sort by `order`
5. filter `visible === true`
6. render grouped by category

### Rules

1. No hardcoded fallback wall items.
2. No rendering from temporary component state.
3. No item may appear without both system definition and user activation.
4. Empty activation state produces an empty wall except for the Onboarding gate when onboarding is not completed.

## 14. Icon Contract

Icons are not stored in the user activation state.
They are resolved from `registry.json`.

### Wall-relevant registry items must provide

```json
{
  "ui": {
    "icon": "string",
    "ui_surface": "wall"
  }
}
```

### Rules

1. Icon source is system-defined.
2. User state controls visibility, not identity.
3. UI may not invent icon mappings outside system definition.

## 15. Action Contract

The visible wall items can trigger three behavior classes:

### Program

Opens a visible system unit or space.

### Application

Opens an active work environment.

### Function

Runs a direct user action.

### Initial action mapping

* `settings` -> open settings overlay
* `archive` -> open archive space
* `new_chat` -> create new chat
* `csv_export` -> export current chat as CSV
* `json_export` -> export current chat as JSON

These actions are defined by system logic and must remain deterministic.

## 16. Settings Overlay

The Settings overlay is a Program.

### Responsibilities

* read `user_profile`
* edit allowed profile values
* persist changes directly into IndexedDB

### Rules

1. It does not define wall items.
2. It does not modify system registry.
3. It may update LLM-relevant profile fields.
4. Changes must persist immediately and deterministically.

## 17. LLM Context Injection

The server must never infer user state from IndexedDB.
The client must send only the required LLM snapshot.

### Canonical allowed snapshot

```json
{
  "llm_context": {
    "tone": "simple | academic",
    "addressing": "du | sie",
    "username": "string"
  }
}
```

### Rules

1. Only values from `user_profile.llm` may be sent.
2. No `system` fields may be sent into LLM context.
3. No `meta` fields may be sent into LLM context.
4. The snapshot must be explicit per request.
5. The server validates structure before use.

## 18. Client to Server Snapshot Contract

The client sends only the minimal explicit runtime snapshot required for the current request.

### Allowed request additions

```json
{
  "llm_context": {},
  "active_program": "string | null",
  "event": {
    "event": "string",
    "program": "string",
    "payload": {}
  }
}
```

### Rules

1. The client does not send full IndexedDB state.
2. The client does not send registry truth.
3. The server never trusts the client for system capability.
4. The client provides user state only.
5. The server resolves capability only through `registry.json`.

## 19. Extension System

Extensions are activated through command detection and run through the Engine.

### Rules

1. Every Extension must be declared in `registry.json`.
2. Every Extension command must be intentionally unnatural to avoid accidental triggering.
3. Exact command match only.
4. No fuzzy matching.
5. No LLM-based trigger detection.

### Extension authority

Extensions may:

* collect structured data
* advance deterministic step flows
* emit activation intent
* emit execution intent

Extensions may not:

* directly write UI state
* directly execute shell
* directly render wall elements
* define new system truth

### Critical rule

Extensions never write `user_activation_state` directly.

Only the Engine may validate and persist an activation change.

## 20. Execution System

Execution is always shell-based.

### Canonical execution object

```json
{
  "execution_id": "string",
  "trigger_type": "command | event",
  "payload": {}
}
```

### Rules

1. Execution must always refer to a valid `execution` entry in `registry.json`.
2. Execution may only be emitted by the Engine.
3. Execution never starts directly from UI.
4. Execution never starts directly from an Extension.
5. `route.ts` executes only validated execution objects.

## 21. Event System

Events exist for runtime behavior inside active Programs or Applications.

### Canonical event object

```json
{
  "event": "string",
  "program": "string",
  "payload": {}
}
```

### Required governance fields in system definition

Each allowed event must have:

* event name
* owning program
* allowed source
* payload schema
* execution mapping or action mapping

### Rules

1. Events must be schema-validated.
2. A Program may only emit its own allowed events.
3. Unknown events are rejected.
4. Invalid payloads are rejected.
5. Event mapping belongs to Engine logic, not UI logic.
6. Runtime events and command triggers must converge into the same execution standard.

## 22. Unified Execution Flow

There are two allowed trigger origins:

### Command path

User prompt -> Engine -> execution object -> route -> shell

### Event path

UI event -> Engine -> execution object -> route -> shell

### Rule

From the moment an execution object exists, both paths are identical.

## 23. route.ts

Target role: executor only.

### Final contract

`route.ts` may:

* receive validated requests
* pass request state into Engine
* execute shell from Engine-approved execution object
* return structured result

`route.ts` may not:

* decide system capability
* invent execution mappings
* inspect UI meaning
* bypass Engine authority

## 24. Current vs Target

### Current state

* `route.ts` still contains more logic than the target model
* some execution handling still lives too high in the stack
* event governance is not yet fully formalized

### Target state

* Engine owns all decision logic
* `route.ts` becomes execution-only
* wall rendering is fully activation-state driven
* all runtime executions converge into one standard path

## 25. Migration Path for the Sprint

This sprint must follow this order:

1. Empty the left pillar.
2. Leave Onboarding as the only visible entry.
3. Formalize registry categories and `ui_surface`.
4. Create IndexedDB persistence contract and stores.
5. Implement `user_profile`.
6. Implement `user_activation_state`.
7. Implement initial load validation.
8. Build the Onboarding Extension.
9. Persist Onboarding lifecycle state.
10. Activate the first five wall items through Engine-validated activation.
11. Render the wall only from validated persisted activation state.
12. Bind the initial Program and Function actions.
13. Implement the Settings overlay.
14. Inject only allowed `llm_context`.
15. Introduce the unified event-to-execution path for future runtime systems such as Cortex.

## 26. Sprint End State

The sprint is complete only when all of the following are true:

1. The pillar is empty before Onboarding.
2. Onboarding is the only initial entry.
3. Onboarding persists the profile locally.
4. The first wall items are activated, not invented.
5. The wall renders only from persisted activation state.
6. Category resolution comes only from `registry.json`.
7. The UI contains no hidden fallback items.
8. Extensions do not write UI state directly.
9. The Engine is the only decision authority.
10. All future runtime executions can enter through the unified execution standard.

## 27. Final Architectural Statement

This system separates four truths:

* system truth in `registry.json`
* user truth in IndexedDB
* decision truth in the Engine
* execution truth in shell pipelines

Nothing visible may bypass that separation.

That is the foundation of the sprint.

```
```
