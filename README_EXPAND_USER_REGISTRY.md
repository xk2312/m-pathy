# README_EXPAND_USER_REGISTRY.md

## 🧠 Purpose

This document describes the **user registry persistence system** in M13.
It defines how onboarding data is collected, transformed, executed, and stored.

It also defines **how to safely extend the system** (e.g. adding public key, settings, etc.).

---

# 🧩 SYSTEM OVERVIEW

The system is split into three strict layers:

### 1. Engine (Data Collection)

* Collects structured user input
* Stores data in `collectedData`
* Does NOT write files
* Does NOT transform semantics

### 2. Execution (Shell Pipeline)

* Receives `01_input.json`
* Creates system artifacts (e.g. `01_user_registry.json`)
* Owns all file persistence

### 3. Route (Bridge Layer)

* Connects Engine → Execution → Frontend
* Builds final `user_registry`
* Sends structured data to UI

---

# 🔄 CURRENT DATA FLOW

```
Onboarding Extension (Step 1.12)
        ↓
engine.ts → collectedData.user
        ↓
route.ts → 01_input.json
        ↓
run.sh → Python steps
        ↓
01_user_registry.json
        ↓
route.ts (merge layer)
        ↓
Frontend (IndexedDB)
```

---

# 📁 INVOLVED FILES

## 🔹 Extension

```
/extensions/onboarding_extension.json
```

Relevant:

* Step `1.12`
* Contains `persist` mapping

---

## 🔹 Engine

```
/lib/m13/engine.ts
```

Responsibility:

* Maintains `collectedData`
* Passes data forward
* DOES NOT persist to DB or files

---

## 🔹 Route

```
/app/api/chat/route.ts
```

Critical responsibilities:

### 1. Input creation

```ts
const inputPayload = ...
fs.writeFileSync("01_input.json")
```

### 2. Execution trigger

```ts
execSync("run.sh")
```

### 3. Artifact parsing

```ts
const executionArtifact = ...
```

### 4. Final merge (IMPORTANT)

```ts
user_registry = {
  profile: { name, tone },
  items: [...],
  updated_at: ...
}
```

---

## 🔹 Execution Space

### Shell

```
/app/user-onboarding/execution-space/bin/run.sh
```

### Steps

```
/app/user-onboarding/execution-space/steps/
```

Important:

* `01_UserRegistryInitPY.py`
* `FinalizeOutputPY.py`

### Output

```
/runs/<run_id>/01_user_registry.json
```

---

## 🔹 Frontend

### Storage / Sync

```
/app/page.tsx
/app/components/... (Saeule, Archive, etc.)
```

### IndexedDB

```
Triketon DB
Key: "registry"
```

---

# 🧾 CURRENT STRUCTURE

```json
{
  "profile": {
    "name": "M",
    "tone": "2"
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

# ⚠️ IMPORTANT ARCHITECTURE RULES

### 1. DO NOT store semantic values in DB

```json
❌ "tone": "personal"
✅ "tone": "2"
```

---

### 2. DO NOT write inside engine

Engine = logic only

---

### 3. ALL persistence happens in execution layer

---

### 4. Route is the ONLY merge point

---

### 5. LLM NEVER receives raw codes

Mapping happens before injection:

```ts
"2" → "personal"
```

---

# 🚀 HOW TO EXTEND USER REGISTRY

## Example: Add Public Key

---

## STEP 1 → Extend Extension (Step 1.12)

```json
"persist": {
  "user_registry.profile.name": "user.name",
  "user_registry.profile.tone": "user.tone",
  "user_registry.security.public_key": "user.public_key"
}
```

---

## STEP 2 → Ensure collectedData contains value

Example:

```ts
collectedData.user.public_key = "abc123"
```

---

## STEP 3 → Execution layer automatically receives it

No change required if generic

---

## STEP 4 → Route merge (if needed)

If structure changes:

```ts
profile: { ... },
security: { public_key }
```

---

## RESULT

```json
{
  "profile": {
    "name": "M",
    "tone": "2"
  },
  "security": {
    "public_key": "abc123"
  }
}
```

---

# 🧠 DESIGN PRINCIPLE

👉 Extensions DEFINE data
👉 Engine PASSES data
👉 Execution BUILDS artifacts
👉 Route MERGES truth

---

# 🔥 CORE INSIGHT

The system is **declarative**:

You do NOT change logic
You EXTEND mappings

---

# 🧾 SUMMARY

* user_registry is now fully functional
* onboarding data is persisted
* architecture is cleanly separated
* extension system is scalable
* future fields can be added via `persist`

---

# 🧭 NEXT POSSIBLE EXTENSIONS

* public_key
* user roles
* permissions
* feature flags
* subscription state
* audit identifiers

All via:

```
persist → extension → execution → route merge
```

---

# ✅ STATUS

System is stable and ready for extension.
