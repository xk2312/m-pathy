README
Registry & LogBook Benchmark
Version: 1.0

1. Purpose

This document defines the benchmark for the two most critical system layers:

- Registry
- LogBook

These two layers are the trust core of the system.

2. Core Principle

The LLM is not the authority.

The LLM may only make a proposal.

The server decides.

3. The Two Critical Layers

3.1 Registry

The Registry is the truth about what is allowed.

It defines:
- which agents exist
- which version each agent has
- which domain each agent belongs to
- which rights each agent has
- which actions are allowed
- which triggers are valid

If an agent is not in the Registry, it must not run.

3.2 LogBook

The LogBook is the truth about what happened.

It records:
- what was proposed
- what was approved
- what was denied
- what was executed
- who or what acted
- which Registry version was active

If the LogBook is manipulated, the past can be rewritten.

4. Authority Model

4.1 LLM

The LLM can:
- read disclosed runtime truth
- make proposals

The LLM cannot:
- register agents
- grant rights
- change the Registry
- change the LogBook
- execute sensitive actions by itself

4.2 Server

The server can:
- validate proposals
- compare proposals against the Registry
- approve or deny execution
- write to the LogBook

4.3 Human Admin

The human admin can:
- approve new agents
- approve Registry changes
- revoke agents
- change rights

5. Version 1 Rules

1. The LLM cannot register agents.
2. New agents are added only by manual approval.
3. Every Registry entry must contain the agent version.
4. Every Registry and LogBook entry must use a fixed JSON schema.
5. Registry and LogBook must be cryptographically chained.
6. No agent may run unless it exists in the approved Registry.
7. No critical action may execute without server validation.
8. The model only sees a read-only disclosure of the Registry, never the writable source.

6. Why Cryptographic Chaining Matters

6.1 Registry Chain

The Registry chain protects the future.

It makes unauthorized changes visible.

If someone inserts a fake agent or changes rights, the chain breaks.

6.2 LogBook Chain

The LogBook chain protects the past.

It makes rewriting history visible.

If someone changes an old event, the chain breaks.

7. Identity Model

Identity should come from one shared source.

7.1 In the Registry

Use:
- entity_id
- entity_type
- entity_version

7.2 In the LogBook

Use:
- actor_id
- actor_type

The names differ by context, but the identity source is the same.

8. Fixed JSON Only

No free text commands.

No hidden execution strings.

No fuzzy parsing.

Everything that matters must be passed as fixed JSON with strict validation.

9. Benchmark Invariants

9.1 Registry Invariants

- No unknown agent may run.
- No agent may run with an unknown version.
- No Registry change is valid without approval.
- Every Registry entry must match schema.
- Every Registry change must extend the chain.

9.2 LogBook Invariants

- No event may be silently changed.
- No event may be deleted in normal operation.
- Every event must match schema.
- Every event must extend the chain.
- Every execution decision must be logged.

9.3 System Invariants

- Proposal is not execution.
- Validation is mandatory.
- Approval rules are server-side.
- The Registry defines permission.
- The LogBook defines history.

10. Minimal Execution Flow

1. User sends request.
2. LLM returns a proposal.
3. Server parses the proposal.
4. Server checks it against the Registry.
5. Server decides:
   - allow
   - deny
   - require approval
6. Server writes the result to the LogBook.
7. Only then may execution happen.

11. Benchmark Sentence

Registry = what is allowed
LogBook = what happened
LLM = what is proposed
Server = what is decided