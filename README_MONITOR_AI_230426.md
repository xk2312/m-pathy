# README_MONITOR_AI

## Purpose

This document captures the current canonical definition of the Monitor AI inside the m-pathy system.

It consolidates the architectural decisions, behavioral rules, matching logic, overlay integration, user control logic, and the dedicated Monitor system prompt exactly as defined in the conversation.

The goal of Monitor is not to assist the user like the main assistant.
The goal of Monitor is to detect when an existing system capability from the registry is highly relevant to the user’s current work and to trigger a controlled system growth moment.

---

## 1. Core Position of Monitor

Monitor is not a chat feature.
Monitor is not part of the assistant voice.
Monitor is not a passive UI decoration.

Monitor is a separate system component with one specialized task:

- observe the recent work context
- compare that context against the registry
- detect whether exactly one existing program is a high-confidence fit
- trigger a controlled activation opportunity

Core formula:

- Registry = possibility
- Monitor = decision
- Wall = visibility

This means Monitor is the growth mechanism of the system.

---

## 2. Why Monitor Exists

The Wall is not supposed to grow randomly.
The Wall should grow only when the system detects that a capability is meaningfully relevant to the user’s current project or work phase.

Without Monitor:

- the Wall stays static
- activation stays manual
- the user experiences isolated tools

With Monitor:

- the system recognizes context
- the system proposes growth at the right moment
- the Wall becomes a living system surface

This is one of the central product mechanics of m-pathy.

---

## 3. Preferred UX Form

Three Monitor presentation options were challenged.

### Rejected: inside the assistant message
This was rejected because it mixes two different system roles:

- Assistant = thinking / responding
- Monitor = system recognition / activation suggestion

Risks:

- pollutes the assistant output
- weakens trust in the assistant voice
- makes Monitor feel like a prompt injection or ad layer
- increases response complexity

### Rejected: permanent place in the wall
This was rejected because it makes Monitor passive.

Risks:

- user must actively look for it
- system no longer feels responsive
- on mobile it creates extra UI complexity without benefit
- it weakens the moment of recognition

### Chosen: separate overlay
This was chosen as the correct direction.

Reasons:

- keeps system boundaries clean
- gives Monitor its own UI logic and design
- allows premium presentation
- makes the system feel intentionally alive
- does not contaminate the assistant response
- scales to future programs, builders, and signature applications

Conclusion:
Monitor should appear as its own small overlay when relevant.

---

## 4. Architectural Direction

Monitor should not live inside the main chat route.

The route should remain focused on the assistant pipeline.
Monitor should be an external, parallel, specialized system.

Reason:

The assistant and Monitor solve different tasks.

Assistant:
- understands
- reasons
- responds
- collaborates

Monitor:
- detects
- matches
- decides whether to trigger
- never explains, never assists

This means Monitor should use:

- a separate service or process
- a separate model
- a separate system prompt
- a hard output contract

This turns m-pathy into a multi-agent architecture instead of a single-agent architecture.

---

## 5. Stateless Monitor Principle

Monitor is defined as stateless.

That means:

- it does not hold its own long-term memory
- it does not interpret the entire chat history
- it only works on a bounded recent snapshot
- it does not build narrative continuity on its own

Its appearance is cyclical, not continuous.

Monitor runs at defined intervals.

Initial default interval:
- every 9 messages

This interval should later be configurable in Settings.

---

## 6. Early User Introduction Logic

The first 3 Monitor messages are not purely based on organic matching.
They are guaranteed onboarding-like activations.

Purpose:
introduce important system functions early.

Examples explicitly mentioned:

- Research Mode
- C6 Challenge
- Capsula13

After the third Monitor appearance, the system should surface the Settings entry or guide the user to it, so the user can:

- modify the Monitor interval
- disable Monitor entirely

This ensures early education without forcing perpetual interruption.

---

## 7. Data Available to Monitor

Monitor receives access to:

### A. Recent archive context
Specifically:
- the last 2 message pairs
- meaning 2 user messages and 2 assistant messages

This bounded slice is the valid decision surface.

### B. Registry
Monitor receives the registry as its space of possible programs.

Important limitation:
Monitor should only consider active programs as candidates.

Monitor should not invent capabilities beyond what actually exists in the registry.

---

## 8. Core Matching Principle

Monitor must not ask:
“What could maybe be useful?”

Monitor must ask:
“What is the user actively doing right now, and does exactly one program directly fit that active task?”

This is not a recommendation engine.
This is a precision trigger.

---

## 9. Canonical Matching Logic

The following logic was defined through C6.

### Step 1: Intent extraction
Monitor extracts from the last 2 message pairs:

- the current goal
- the current object of work
- the current mode of activity

Examples:
- writing a LinkedIn article
- checking a medical context
- structuring information
- evaluating a system
- building a specific output

This creates an internal intent vector.

### Step 2: Registry filter
Monitor reduces the registry to:

- type: program
- state: active

No other registry entries are valid candidates for triggering.

### Step 3: Semantic alignment
For each candidate program, Monitor compares the current intent against available program signals, such as:

- id
- command
- future metadata like tags or intent descriptors

The match result should effectively be evaluated as:

- high
- medium
- low

Only a high-confidence direct fit is relevant.

### Step 4: Hard threshold
A trigger is allowed only if there is exactly one high-confidence match.

Rules:

- 0 high matches = no trigger
- more than 1 high match = no trigger

This prevents ambiguity, spam, and weak recommendations.

### Step 5: Context validation
Monitor must verify that the detected intent is truly active now.

If the relevant topic appears only as:

- a side remark
- a hypothetical example
- a vague possibility
- a loose mention

then no trigger is allowed.

### Step 6: Cooldown logic
A program must not be suggested repeatedly in short succession.

There should be cooldown protection such as:

- no immediate repeat of the same program
- optional global cooldown across a few cycles

The exact cooldown duration can be defined later, but the principle is mandatory.

---

## 10. Trigger Quality Standard

Monitor must be conservative.

Rule:
It is better to miss a valid trigger than to produce a wrong one.

Desired perception:

- rare but accurate
- never noisy
- never promotional
- never speculative

If Monitor triggers badly, the user experiences annoyance.
If Monitor triggers precisely, the user experiences system intelligence.

---

## 11. Forbidden Monitor Behavior

Monitor must never:

- hallucinate programs
- recommend multiple options
- output marketing copy
- generate explanations
- act like the assistant
- infer beyond the recent visible message context
- trigger on weak or partial alignment
- become part of the assistant message itself

---

## 12. Canonical Integration Flow

The end-to-end flow was defined as follows.

### A. User sends messages
The assistant pipeline runs normally.

In parallel, a Monitor process can receive a bounded snapshot.

### B. Timing trigger
Monitor does not run every time forever by default.
It runs according to interval logic.

Current intended default:
- every 9 messages

With special handling:
- first 3 Monitor events are guaranteed introduction events

### C. Monitor check
Monitor receives:

- last 2 message pairs
- registry
- session counter

Monitor decides whether a valid high-confidence match exists.

### D. Output contract
Monitor must output machine-readable structured JSON only.

If a trigger exists:

```json
{
  "trigger": true,
  "program": "<program_id>",
  "confidence": "high"
}
```

If no trigger exists:

```json
{
  "trigger": false
}
```

### E. Frontend reaction
If the current turn and timing are valid and the trigger is true, the frontend shows the Monitor overlay.

Important:
This remains separate from assistant message rendering.

### F. User decision
Overlay offers a controlled activation moment.

Possible actions:
- ignore
- activate

If ignored:
- overlay closes
- cooldown applies

If activated:
- a short release / confirmation text appears
- user confirms
- program is activated into the user system
- the new icon appears on the Wall

---

## 13. Overlay Principles

The Monitor overlay should:

- be small
- be separate from the chat message
- feel deliberate, not noisy
- preserve the assistant flow
- appear only when relevant

It should feel like:
“The system recognized something.”

It should not feel like:
“A popup is interrupting me.”

Minimal structure:

- short title
- one clear sentence about the recognized activity
- primary activation action
- secondary ignore action

Optional second step:
- short confirmation gate before activation

---

## 14. Handoff Logic

A server-side or service-side handoff concept was defined.

If Monitor finds a valid match, it can send a handoff structure that represents:

- Monitor activation
- desired program target

The conversation phrasing used two commands in spirit:

- echo-monitor
- echo-desired-program

This can be expressed in JSON form as a structured system handoff.

Example conceptual form:

```json
{
  "command": "echo-monitor",
  "program": "echo-<desired_program>"
}
```

The exact transport implementation can later vary, but the dual logic is:

1. signal that Monitor triggered
2. identify which program is being handed off

---

## 15. External Monitor Service Requirements

Because Monitor should not live inside the main route, the following requirements were defined.

### Separate execution
Monitor should run as a separate service or process.

### Same bounded snapshot
It must receive the same relevant recent context that the route would conceptually use.

### Dedicated model
Monitor should use a model optimized for:

- intent detection
- low hallucination
- precise classification
- cheap and fast structured output

It does not require a large creative assistant model.

### Hard response contract
Monitor must not return prose.
Only the defined JSON contract is valid.

### Turn-bound validation
The frontend must ensure that stale Monitor results do not appear for the wrong turn.

This implies that monitor events should be associated with the current turn or timing window.

---

## 16. Why a Dedicated System Prompt Is Required

A dedicated Monitor prompt is necessary because the main assistant prompt is optimized for cooperation, explanation, and reasoning.

Monitor needs the opposite:

- narrow scope
- hard constraints
- precision over completeness
- zero conversational drift
- machine-readable output only

This is why Monitor needs its own system prompt and can not simply reuse the assistant configuration.

---

## 17. Canonical Monitor System Prompt

Below is the final copy-ready Monitor system prompt captured in the conversation.

```text
SYSTEM: MONITOR v1.0

ROLE
You are the Monitor of the m-pathy system.
Your only task is to detect whether the user is currently working on something that can be meaningfully supported by an existing program in the registry.

You do not assist.
You do not explain.
You do not generate content.

You only decide whether a precise system trigger should occur.

INPUT

You receive:

1. messages
The last two message pairs (user + assistant).

2. registry
A list of available programs with id, command, and metadata.

3. session_counter
The current message count of the session.

OBJECTIVE

Detect whether the user is actively working on a concrete task that matches exactly one program in the registry.

You must determine:

- What the user is building or doing
- Whether a program directly supports this activity

DETECTION RULES

1. Focus only on the current intent
Ignore long-term context or assumptions.

2. The intent must be explicit
If the task is vague, do not trigger.

3. The intent must be active
The user must currently be doing it, not just mentioning it.

4. The program must be a direct fit
Loose or indirect matches are invalid.

5. Only one valid match is allowed
If multiple programs could fit, do not trigger.

STRICT FILTERS

You must return NO trigger if:

- the intent is unclear
- the intent is hypothetical
- the intent is exploratory without direction
- the match is only partial
- more than one program could apply

TRIGGER CONDITION

Trigger only if:

- a clear, active intent is detected
- exactly one program matches with high certainty

OUTPUT FORMAT (MANDATORY)

Return ONLY valid JSON.

If trigger:

{
  "trigger": true,
  "program": "<program_id>",
  "confidence": "high"
}

If no trigger:

{
  "trigger": false
}

FORBIDDEN

You must NOT:

- generate explanations
- suggest alternatives
- list multiple programs
- output text outside JSON
- guess or infer beyond the visible messages

QUALITY STANDARD

It is better to miss a valid trigger than to produce a wrong one.

You are a precision system, not a recommendation system.
```

---

## 18. Product Meaning of Monitor

Monitor is not just a helper for program suggestions.

Monitor is one of the core product mechanics that turns m-pathy from:

- chat with tools

into:

- a system that grows with the user’s work

This is strategically important because it allows the homepage and product identity to shift away from feature explanation and toward a core proposition:

m-pathy recognizes what the user is building and introduces structure at the right time.

---

## 19. Current Open Follow-up Areas

The following points were not fully finalized yet and remain future implementation details:

- exact registry schema improvements for matching quality
- future tags or intent metadata on programs
- exact cooldown durations
- exact overlay copy and design
- exact Settings UI for Monitor controls
- exact transport layer between Monitor service and frontend
- exact persistence mechanics after activation
- exact turn validation and event synchronization logic

These are implementation details.
The conceptual Monitor architecture above is already fixed.

---

## 20. Canonical Summary

Monitor is:

- separate from the assistant
- separate from the main route
- stateless
- cyclical
- conservative
- based on the last 2 message pairs
- constrained by the registry
- allowed to trigger only on exactly one high-confidence direct match
- presented through a separate overlay
- controlled by the user through later settings
- powered by its own specialized system prompt

This is the current canonical definition of Monitor AI for m-pathy.
