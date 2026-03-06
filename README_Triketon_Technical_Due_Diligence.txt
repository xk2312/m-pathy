# README - Triketon Cryptography, Chain Architecture, Security Posture, and EU AI Act Relevance

Version: Snapshot based on current project state after the SHA-256, canonical state hashing, and LocalStorage / IndexedDB investigations.
Audience: Engineering, Security Review, Technical Due Diligence, Architecture Review, Compliance Review.
Scope: This document explains how Triketon currently works, which files are involved, what is cryptographically protected, what is relevant for EU AI Act alignment, and which limits / open issues remain.

-------------------------------------------------------------------------------
1. Executive Summary
-------------------------------------------------------------------------------

Triketon is a deterministic, append-only, hash-chained conversation ledger for AI interactions.
Its design objective is to make each message entry tamper-evident, reconstructable, and auditable.

Current high-level properties:
- Every message is stored as a ledger anchor.
- Every anchor carries a SHA-256-based truth_hash.
- Every non-genesis anchor carries chain_prev, pointing to the previous anchor hash.
- Hash computation now uses canonicalized state, not only plain content.
- Canonical state includes content, role, timestamp, public_key, chain_prev, chain_id, and telemetry.
- Object keys are recursively sorted before JSON serialization to make hashing deterministic.
- The device identity is represented by a persistent device-bound public_key string.
- The ledger is persisted through a LocalStorage / IndexedDB architecture using StorageVault.

Important architectural conclusion:
Triketon is no longer only a content-integrity system.
It is now a state-bound integrity ledger.
This materially strengthens auditability and incident reconstruction.

-------------------------------------------------------------------------------
2. What Triketon is trying to prove
-------------------------------------------------------------------------------

Triketon is designed to prove three things:

2.1 Message Integrity
A stored entry can be checked against the exact state used at write time.
If any bound field changes, the truth_hash changes.

2.2 Chain Integrity
Every new entry points to the previous entry through chain_prev.
This creates a linear, append-only history.
Reordering or insertion becomes detectable.

2.3 System-State Integrity
The hash does not only cover user-visible content.
It also covers system-relevant state fields, including telemetry.
This is crucial for forensics, governance, and human-in-the-loop reconstruction.

-------------------------------------------------------------------------------
3. Current cryptographic model
-------------------------------------------------------------------------------

3.1 Hash algorithm
Current truth_hash generation uses SHA-256.
The output is represented as a 64-character hexadecimal digest.
In parts of the current codebase the digest is prefixed with "T" for legacy compatibility in verification helpers.
Operationally, the security-relevant property is the SHA-256 digest itself.

3.2 Canonical state hashing
Triketon no longer hashes only normalized content.
Instead, it canonicalizes a message state object and hashes the deterministic serialized form.

Current canonical state fields:
- role
- content
- timestamp
- public_key
- chain_prev
- chain_id
- telemetry

3.3 Canonicalization
Before hashing, Triketon:
- normalizes text content
- recursively sorts all object keys
- serializes the state with JSON.stringify after sorting

This is necessary because JSON key order is otherwise not guaranteed across object construction paths.
Without deterministic ordering, the same logical telemetry object could hash differently.

3.4 Chain linkage
Each entry after the first contains:
- chain_prev = truth_hash(previous entry)

Therefore the chain is logically:
- H0 = hash(state0)
- H1 references H0 through chain_prev
- H2 references H1 through chain_prev
- etc.

Note carefully:
The current observed ledger is a forward-linked chain via explicit chain_prev fields stored in the entry state.
The project discussion also considered binding previous_hash directly into the next hash payload as an additional strengthening step. If implemented, that would increase resistance against certain reconstruction / insertion classes. This README distinguishes clearly between:
- current guaranteed property: explicit forward linking by chain_prev inside the canonical state
- discussed hardening path: direct previous-hash binding into the hash input itself

3.5 Device identity
Triketon uses a persistent device-bound public_key string. This is not currently an asymmetric keypair used for digital signatures in the strict PKI sense. It is a deterministic device identifier derived locally and used as a stable identity anchor inside the ledger.

-------------------------------------------------------------------------------
4. Files involved and their roles
-------------------------------------------------------------------------------

4.1 lib/triketonVerify.ts
This is the cryptographic core.
Responsibilities:
- normalizeForTruthHash()
- sortKeys() for canonical deterministic object ordering
- canonicalizeTruthState()
- computeTruthHash()
- verification helpers (verifyEntry, verifyPair, verifyChat, verifyAll)
- generatePublicKey2048()
- getOrCreateDevicePublicKey2048()

This file is the root of truth-hash semantics.
Any change here changes ledger semantics globally.

4.2 app/page2/page.tsx
This is the main runtime chat pipeline.
Responsibilities relevant to Triketon:
- create user and assistant message objects
- append user anchors to the ledger
- append assistant anchors to the ledger
- attach chain_prev for linear conversation continuity
- pass telemetry and other state fields into the anchor payload

This file is the runtime source of anchor creation.

4.3 lib/chatStorage.ts
This is the operational storage and append layer for chat runtime.
Responsibilities relevant to Triketon:
- appendTriketonLedgerEntry(...)
- ensureTriketonLedgerReady(...)
- verifyOrResetTriketonLedger(...)
- hardClearChat(...)

This file is where anchors become persisted ledger rows.

4.4 lib/storageVault.ts
This is the LocalStorage / IndexedDB synchronization layer.
Responsibilities:
- IndexedDB as master store
- mirroring or hydrating selected keys to LocalStorage
- merge strategy decisions per key
- writeLsRaw() behavior

This file is not cryptographic by itself, but it is operationally critical because persistence bugs here can corrupt the observable runtime path or create divergence between LS and IDB.

4.5 lib/archivePairProjection.ts
Derived layer.
Builds question-answer pairs from Triketon.
Depends on ledger integrity but is not the root of cryptographic truth.

4.6 lib/archiveProjection.ts
Derived archive-level projection from the ledger.
Consumes timestamps, chain grouping, and message ordering.
Not the source of truth, but a downstream auditor / presentation layer.

4.7 lib/archiveIndex.ts
Read layer for archive chat views.
Not the source of truth.
Exposes derived data to the UI.

4.8 UI and overlays
Examples:
- ChatDetailView
- Triketon overlay payload builders
These are not ledger roots. They consume or display already-generated state.

-------------------------------------------------------------------------------
5. End-to-end chain flow
-------------------------------------------------------------------------------

5.1 User sends a message
- page2/page.tsx creates a user message
- runtime constructs ledger anchor fields
- canonical state is prepared
- truth_hash is computed via lib/triketonVerify.ts
- appendTriketonLedgerEntry stores the anchor

5.2 Assistant response arrives
- page2/page.tsx builds assistant message
- assistant receives chain_prev = truth_hash(user)
- telemetry is attached when present
- canonical state is prepared
- truth_hash is computed via lib/triketonVerify.ts
- appendTriketonLedgerEntry stores the assistant anchor

5.3 Next user message
- next user anchor gets chain_prev = truth_hash(previous assistant)
- this continues the linear conversation chain

5.4 Storage
- Local runtime writes flow through chatStorage and StorageVault
- IndexedDB is the intended master persistence layer
- LocalStorage is used as fast-access cache / compatibility layer, depending on the active storage path and vault logic

-------------------------------------------------------------------------------
6. What exactly is protected by the hash now
-------------------------------------------------------------------------------

Protected fields in the canonical state:
- role
- normalized content
- timestamp
- public_key
- chain_prev
- chain_id
- telemetry

Security consequence:
If any of these fields are modified after the fact, the recomputed truth_hash will differ.

Examples of detectable changes:
- user content edited after storage
- assistant answer altered
- timestamp changed
- telemetry modified
- public_key swapped
- chain_prev changed
- chain_id rewritten

This is a major improvement over content-only hashing.

-------------------------------------------------------------------------------
7. Why telemetry inclusion matters
-------------------------------------------------------------------------------

Telemetry inclusion is the key architectural move for regulated AI evidence.
Without telemetry in the hash, a reviewer can prove only that content existed.
With telemetry in the hash, a reviewer can prove both:
- what was said
- under what recorded system state it was said

This matters in exactly the kind of incident you described:
- there is a drift question
- a human in the loop continued operating
- harm occurs
- later investigators ask whether the system exposed drift, risk, or blocked-state signals at the time

If telemetry is part of the canonical hash state, then telemetry becomes tamper-evident rather than merely informative metadata.

-------------------------------------------------------------------------------
8. EU AI Act relevance
-------------------------------------------------------------------------------

This section is intentionally precise.
Triketon by itself does not make the entire product automatically compliant with the EU AI Act.
Compliance is a system-level and organizational property.
However, Triketon directly supports several requirements or expectations that are highly relevant under the AI Act, especially for high-risk or governance-sensitive deployments.

8.1 Record-keeping support
Triketon materially supports automated event logging and evidence retention by creating append-only state-bound ledger entries. This aligns strongly with the AI Act’s emphasis on record-keeping and automatically generated logs for high-risk systems. See the AI Act record-keeping and logging requirements. citeturn0search2turn0search12turn0search1

8.2 Technical documentation support
Because Triketon captures deterministic chain structure, state-bound hashing, and telemetry-linked evidence, it can serve as part of the technical documentation and post-incident reconstruction package expected under the Act. That supports, but does not replace, the broader technical documentation obligations. citeturn0search1turn0search13

8.3 Human oversight support
The AI Act requires human oversight measures that help prevent or minimize risks. A ledger that preserves the system state and drift context present at decision time materially strengthens evidence around whether a human operator ignored or acted on warnings. citeturn0search4turn0search6

8.4 Transparency to deployers
The Act expects deployers to receive information sufficient to interpret outputs, limitations, and risks. Triketon does not itself satisfy all transparency obligations, but it supports provable reconstruction of what the system state was when a given output was produced. citeturn0search0turn0search8

8.5 Accuracy, robustness, cybersecurity support
Triketon contributes to tamper evidence, post hoc validation, and forensic robustness. That is supportive of the broader robustness and cybersecurity expectations, though it is not itself a complete cybersecurity program. citeturn0search8turn0search14

8.6 What Triketon does not guarantee by itself
Triketon alone does not provide:
- formal conformity assessment
- risk management process compliance
- data governance compliance
- post-market monitoring process completeness
- organizational controls
- legal classification of the system under the AI Act

Therefore the correct due diligence statement is:
Triketon is a strong compliance-enabling evidence and audit subsystem, not a standalone legal compliance certificate.

-------------------------------------------------------------------------------
9. Security posture
-------------------------------------------------------------------------------

9.1 Strengths
- SHA-256 based hashing
- deterministic canonicalization
- telemetry included in hash state
- linear chain via chain_prev
- device-bound identity anchor via public_key
- append-only operational model
- easy integrity re-checking
- good forensic readability

9.2 Threats it helps detect
- after-the-fact modification of message content
- after-the-fact modification of telemetry
- timestamp rewriting
- chain reordering
- identity substitution via public_key replacement
- insertion of anchors without fixing the chain

9.3 Threats it does not fully solve alone
- full endpoint compromise before write time
- malicious code changing state before canonicalization
- malicious deletion of the entire ledger if storage access is fully compromised
- server-side trust issues outside the client ledger domain
- legal non-compliance in documentation, risk management, or operational governance

9.4 Important note on signatures
Current Triketon uses a device-bound public_key string as identity material, but this is not the same as a full digital signature architecture with private-key signing and third-party verifiable signatures. For many audit and forensic use cases the current model is already strong. For non-repudiation against a stronger adversary, actual signatures would be the next architectural step.

-------------------------------------------------------------------------------
10. Persistence architecture and why it matters for cryptography
-------------------------------------------------------------------------------

Triketon’s trustworthiness depends not only on hashing, but on storage correctness.
The LocalStorage / IndexedDB split introduced operational complexity.

Observed architecture:
- IndexedDB intended as master
- LocalStorage used as cache / compatibility layer
- StorageVault mediates mirroring and hydration

Observed risk from the recent debugging cycle:
- changes in StorageVault can silently break LocalStorage visibility while IndexedDB still contains correct data
- this can make the system appear empty or inconsistent even when the ledger itself is intact
- double-serialization bugs in writeLsRaw() can corrupt string values if strings are serialized twice

This does not necessarily break the cryptographic chain itself, but it can break the operational observability and UI behavior around the chain.

For due diligence, this distinction is critical:
- cryptographic integrity can still be correct
- persistence architecture can still be broken

-------------------------------------------------------------------------------
11. Known issues and hard truths
-------------------------------------------------------------------------------

11.1 verifyEntry / verifyPair / verifyChat semantics may require review
The helper functions in triketonVerify.ts were originally designed around content-only hashing. Now that truth_hash semantics include full canonical state, some verification helpers may no longer reflect the true ledger semantics unless the same canonical state is reconstructed during verification.

This is not a cosmetic issue.
It is a semantic migration issue.

11.2 Prefixing conventions should be rationalized
The file still documents legacy "T-prefixed" semantics in comments while the active hashing logic is SHA-256-based. The comments and implementation should be brought into full alignment.

11.3 Device public_key is identity material, not full PKI
It is strong as a stable identifier, but it is not the same as a signed ledger entry.

11.4 Current chain model versus stronger chaining
The project discussion explored a stronger design where previous_hash is explicitly bound into the next hash input. If that is not yet fully implemented at all write points, it remains an open hardening path.

-------------------------------------------------------------------------------
12. Current due diligence assessment
-------------------------------------------------------------------------------

Technical quality of the current Triketon design:
- Strong for deterministic audit logging
- Strong for tamper evidence inside client-controlled state
- Strong for conversation reconstruction
- Strong for state-bound evidence around telemetry and drift
- Architecturally useful for human-in-the-loop incident reconstruction

Best current description for DD:
Triketon is a deterministic, canonicalized, SHA-256-based, telemetry-bound conversation ledger with forward chain references via chain_prev and stable device identity binding via public_key. It materially strengthens auditability, incident reconstruction, and evidence generation for AI operations, and strongly supports AI Act-relevant logging, transparency, and human-oversight workflows. It is a compliance-enabling subsystem, not by itself a complete conformity framework.

-------------------------------------------------------------------------------
13. Recommended next steps
-------------------------------------------------------------------------------

Priority 1
Bring verification helpers into full state-bound parity.
verifyEntry, verifyPair, and verifyChat should reconstruct the same canonical state that was hashed at write time.

Priority 2
Decide whether to upgrade from identity binding to real signature binding.
That would require a private key and entry signatures.

Priority 3
Stabilize StorageVault and document source-of-truth behavior formally.
DD reviewers will ask whether IDB or LS is authoritative and whether divergence is possible.

Priority 4
Consider whole-chat root hashing or Merkle roots for export-time proofs.
This would improve batch verification and external attestation.

Priority 5
Align all comments, README text, and code semantics so there is no remaining mismatch between legacy wording and actual SHA-256 state-bound logic.

-------------------------------------------------------------------------------
14. One-line architecture statement
-------------------------------------------------------------------------------

Triketon is a deterministic, SHA-256-based, canonical-state, telemetry-bound conversation ledger that makes AI interaction histories tamper-evident and materially supports forensic auditability and EU AI Act-relevant evidence generation.

