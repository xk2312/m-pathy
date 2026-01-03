# m-pathy Archive System — README (Archive v1)

## Purpose

The Archive system is a **deterministic, read-only projection** of the Triketon ledger.  
Its sole responsibility is **display, search, selection, and context transfer** of past chats and messages.

> **Core Principle**  
> Triketon is the single source of truth.  
> The Archive is a projection — never an authority.

This document is intended to be **handed back verbatim** in future sessions to restore full system context.

---

## Core Invariants (Non-Negotiable)

1. **Triketon Ledger (`mpathy:triketon:v1`)**
   - Append-only
   - Never overwritten
   - Defines chat boundaries via `chain_id`
   - Cryptographically sealed

2. **Archive (`mpathy:archive:v1`)**
   - Derived exclusively from Triketon
   - Contains no original truth
   - May be fully rebuilt at any time
   - UI-oriented representation only

3. **No Heuristics**
   - No time-window guessing
   - No message counting
   - No UI-driven inference
   - Only explicit chain semantics

---

## Storage Namespaces (LocalStorage)

### Triketon Ledger
```
mpathy:triketon:v1
```

**Type:** `TriketonAnchor[]`  
**Written by:** API / Server  
**Meaning:** Canonical, verifiable truth ledger

Each anchor represents one message (user or assistant).

---

### Archive Projection
```
mpathy:archive:v1
```

**Type:** `ArchivChat[]`  
**Written by:** `syncArchiveFromTriketon()`  
**Meaning:** Chat-level projection for UI, search, and selection

---

### Archive Internal Keys
```
mpathy:archive:chat_counter
mpathy:archive:chat_map
```

- `chat_counter`  
  → Human-readable chat numbering (1, 2, 3, …)

- `chat_map`  
  → Mapping:
  ```
  chain_id (string) → chat_id (number)
  ```

These keys are **derived state** and may be safely deleted.

---

## Key Concepts & Semantics

### `chain_id` (Critical)

- Assigned **only in Triketon**
- Represents **exactly one chat**
- Must change when a new chat starts
- All anchors with the same `chain_id` belong to the same chat

**Invariant:**
```
One chat = one chain_id
```

If `chain_id` does not change, the system will (correctly) assume the chat continues.

---

### `chain_prev`

- References the `truth_hash` of the previous message
- Only valid **within the same chain_id**
- Must be `null` / `undefined` on the first message of a new chat

---

### `truth_hash`

- Cryptographic hash of the message content
- Used for verification and chain linking
- Immutable

---

## Data Structures

### TriketonAnchor (Ledger Entry)

```ts
type TriketonAnchor = {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
  truth_hash: string
  public_key?: string
  chain_id: string
  chain_prev?: string
  orbit_context: 'chat'
  version: 'v1'
}
```

---

### ArchivChat (Archive Projection)

```ts
interface ArchivChat {
  chat_id: number                // human-readable (1, 2, 3, …)
  first_timestamp: string
  last_timestamp: string
  keywords: string[]             // top 7 extracted keywords
  entries: {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: string
  }[]
}
```

---

## File Hierarchy & Responsibilities

### Ledger & Truth

- `app/api/chat/route.ts`
  - Receives chat messages
  - Triggers Triketon sealing
  - Supplies `chain_id` and `chain_prev`

- `triketon.py`
  - Cryptographic sealing
  - Truth hash generation
  - Ledger append logic

---

### Local Storage Abstraction

- `lib/storage.ts`
  - Typed LocalStorage access
  - Enforces Triketon append-only invariant
  - Shared by chat, archive, verification

---

### Archive Core (Projection Layer)

- `lib/archiveProjection.ts`
  - Reads `mpathy:triketon:v1`
  - Groups anchors by `chain_id`
  - Assigns numeric `chat_id`
  - Extracts keywords
  - Writes `mpathy:archive:v1`

- `lib/archiveIndex.ts`
  - Index helpers for search & ordering

- `lib/archiveWrite.ts`
  - Controlled archive writes (projection only)

---

### UI / Interaction Layer

- `ArchiveInit.tsx`
  - Initializes archive sync on load

- `ArchiveOverlay.tsx`
  - Default view: last N chats (usually 7)

- `ArchiveSearch.tsx`
  - Search across all messages
  - Activated after ≥ 3 characters

- `ArchiveSelection.tsx`
  - Selection of chats or messages
  - Drives summary & context injection

- `ArchiveTrigger.tsx`
  - Entry point to open the archive UI

---

## Runtime Flow (End-to-End)

1. **Chat message is sent**
2. API seals message into Triketon
   - Assigns `chain_id`
   - Assigns `chain_prev`
3. Triketon ledger grows (append-only)
4. `syncArchiveFromTriketon()` runs
5. Archive projection is rebuilt
6. UI reads from `mpathy:archive:v1`

At no point does the UI or Archive modify Triketon.

---

## Chat Lifecycle Semantics

### New Chat

- Chat storage is cleared
- `mpathy:chat:chain_id` is removed
- Next message:
  - Generates a new `chain_id`
  - Starts a new Triketon chain
  - Archive creates a new `chat_id`

### Continuing Chat

- Same `chain_id`
- `chain_prev` links messages
- Archive appends to the same chat

---

## What the Archive Is NOT

- ❌ Not a truth source
- ❌ Not a ledger
- ❌ Not allowed to guess chat boundaries
- ❌ Not allowed to mutate Triketon
- ❌ Not allowed to invent IDs

---

## Design Summary

- **Truth lives in Triketon**
- **Structure lives in chain_id**
- **Meaningful numbering lives in the Archive**
- **UI only reads projections**
- **Everything is rebuildable**

---

## Usage Contract

When resuming work on the Archive system:

1. Provide this `readme_archive.md`
2. Provide current versions of:
   - `archiveProjection.ts`
   - `storage.ts`
   - Triketon writer (API or server)
3. State the goal

No assumptions beyond this document are required.

---

**Status:**  
Archive v1 is stable, deterministic, and correctly chained to Triketon.

**Last verified invariant:**  
_New chat ⇒ new chain_id ⇒ new archive chat_

