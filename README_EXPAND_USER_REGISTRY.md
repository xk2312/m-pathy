# README_M13_ENGINE_AND_EXTENSIONS.md

## 🧠 Purpose

This document explains the **current state of the M13 Engine and Extension system**.

It is designed for developers who need to:

* understand how the Engine works
* build or extend Extensions
* work with routing and execution
* safely extend the user registry

This is a **source-of-truth document** for the current architecture.

---

# 🧩 SYSTEM ARCHITECTURE

M13 is built as a **strictly separated 3-layer system**:

### 1. Engine (Control Layer)

* Processes steps
* Stores all data in `collectedData`
* Controls flow (routing)
* DOES NOT persist to DB or files

---

### 2. Execution (Persistence Layer)

* Runs via shell (`run.sh`)
* Receives `01_input.json`
* Creates artifacts (e.g. `01_user_registry.json`)
* Owns ALL file persistence

---

### 3. Route (Bridge Layer)

* Connects Engine ↔ Execution ↔ Frontend
* Builds final response
* Merges execution artifacts into API response

---

# 🔄 REAL DATA FLOW (CURRENT)

```
Extension (Step)
        ↓
engine.ts → collectedData
        ↓
route.ts → 01_input.json
        ↓
run.sh → Python steps
        ↓
Artifacts (e.g. 01_user_registry.json)
        ↓
route.ts (merge)
        ↓
API response
        ↓
Frontend → IndexedDB
```

---

# ⚙️ ENGINE – CURRENT LOGIC

File:

```
/lib/m13/engine.ts
```

---

## 🔹 Core Responsibilities

* Maintain `state`
* Maintain `collectedData`
* Process steps deterministically
* Resolve next step

---

## 🔹 Step Types

```ts
selection
question (legacy)
action
execution
```

---

## 🔹 Data Handling

### Standard Steps

```ts
key → stored in collectedData
```

Example:

```ts
"key": "user.name"
```

---

### Execution Steps

Use `persist` mapping:

```json
"persist": {
  "user_registry.profile.name": "user.name"
}
```

Engine does NOT write this.

It only ensures the data exists in `collectedData`.

---

# 🔀 ROUTING LOGIC (CRITICAL)

---

## 1. Non-selection steps

```ts
next = currentStep.next
```

---

## 2. Selection – Linear

```json
"next": "1.12"
```

→ every option leads to same step

---

## 3. Selection – Branching

```json
"next_map": {
  "1": "1.12",
  "2": null
}
```

---

### Behavior

| Input     | Result        |
| --------- | ------------- |
| valid key | mapped step   |
| `null`    | explicit exit |
| invalid   | error + stay  |

---

## 🔥 IMPORTANT RULE

```text
next_map overrides next
```

---

## 🛑 EXIT LOGIC

```json
"2": null
```

means:

* Engine stops
* Flow ends intentionally
* NOT an error

---

# 🌳 MULTI-PATH ARCHITECTURE (NEW CAPABILITY)

Selections are now **routing nodes**, not just UI choices.

Example:

```json
"1.11": {
  "type": "selection",
  "next_map": {
    "1": "1.11.1",
    "2": "1.11.2"
  }
}
```

---

### This enables:

* fully independent paths
* separate execution chains
* tree-like structures

---

### Mental Model

```
Root
 ├── Path A → Execution A
 └── Path B → Execution B
```

---

# 📁 EXTENSION RULES (MANDATORY)

---

## 1. Selection Types

### Use `next` when:

* all options share same path

---

### Use `next_map` when:

* options lead to different paths
* cancellation exists
* logic differs per choice

---

## 2. NEVER create ambiguity

❌ invalid:

```json
"next": "1.12",
"next_map": { "1": "1.13" }
```

---

## 3. Selection = routing node

Not just UI.

---

## 4. Step IDs

Recommended:

```text
1.11 → 1.11.1 → 1.11.2
```

NOT:

```text
1 → 2 → 3 → random jumps
```

---

## 5. Each branch may have its own:

* flow
* execution
* end state

---

# 🧾 USER REGISTRY – CURRENT STATE

---

## Structure

```json
{
  "profile": {
    "name": "M",
    "tone": "2"
  },
  "security": {
    "public_key": "..."
  },
  "infrastructure": {
    "server": null
  },
  "items": [
    "settings",
    "archive",
    "new_chat",
    "csv_download",
    "json_download"
  ],
  "updated_at": "timestamp"
}
```

---

## ⚠️ IMPORTANT

### DO NOT store semantic values

```json
❌ "tone": "personal"
✅ "tone": "2"
```

---

# 🔄 USER REGISTRY FLOW (REAL)

---

## 1. Frontend

* collects `public_key`
* sends via request

---

## 2. route.ts

* injects into `collectedData.user`

---

## 3. Engine

* passes data forward

---

## 4. Execution

* creates `01_user_registry.json`

---

## 5. Route merge

```ts
user_registry = executionArtifact.data.user_registry
```

---

## 6. Frontend

```ts
window.dispatchEvent("mpathy:registry:update")
```

---

## 7. IndexedDB

* stores final state

---

# ⚠️ CRITICAL RULES

---

## 1. Engine NEVER writes files

---

## 2. Execution OWNS persistence

---

## 3. Route is ONLY merge point

---

## 4. Extensions DEFINE structure

---

## 5. LLM NEVER sees raw codes

Mapping happens before rendering

---

# 🧠 LESSONS LEARNED

---

## ❌ Wrong assumptions (past)

* Engine persists → false
* Route can fake structure → dangerous
* Selection always linear → false

---

## ✅ Truth

* Engine = state machine
* Execution = truth layer
* Route = translator
* Selection = router

---

## 🔥 Key Insight

The system is **declarative**:

```text
Extension defines reality
Engine executes it
Execution materializes it
Route exposes it
```

---

# 🚀 HOW TO EXTEND SYSTEM

---

## Example: Add new field

---

### Step 1 → Extension

```json
"persist": {
  "user_registry.security.public_key": "user.public_key"
}
```

---

### Step 2 → Ensure collectedData

```ts
collectedData.user.public_key
```

---

### Step 3 → Execution

No change if generic

---

### Step 4 → Route

Only if structure changes

---

# 🧭 FINAL STATUS

---

✅ Engine supports branching
✅ Clean routing logic established
✅ User registry fully integrated
✅ Execution stable
✅ Frontend sync working

---

# 🧱 FOUNDATION COMPLETE

This system is now:

* deterministic
* extensible
* branch-capable
* production-ready

---

**Next evolution (only when needed):**

* recursive flows
* reusable subflows
* dynamic routing conditions

---

End of document.
