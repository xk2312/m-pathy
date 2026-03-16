README
MAIOS GPS
Final Engineering README
Status: Current implementation handover baseline

1. Purpose
1.1 This README captures the current MAIOS Governance Protocol Standard state for implementation work.
1.2 It is intended to let the next engineering chat continue directly with:
a. system prompt upload
b. route.ts prompt assembly and enforcement
c. page.tsx cleanup
d. TelemetryPanel.tsx cleanup
1.3 This README is not a replacement for the accepted chapter texts.
1.4 Where this README and the accepted protocol text differ, the accepted protocol text has priority.

2. Protocol Identity
2.1 Name
MAIOS Governance Protocol Standard
2.2 Abbreviation
MGPS
2.3 Class
Model-Agnostic Governance and Reasoning Protocol
2.4 Strategic Position
MGPS is an upper governance and reasoning layer, not a transport protocol replacement.
2.5 Relative Position to MCP
Anthropic MCP may serve as a lower transport and capability substrate.
MGPS is intended as an upper governance and reasoning layer that may later be made compatible with MCP.

3. Current Macro Architecture
3.1 Top Hierarchy
Room
Form
Movement
3.2 Meaning of Room
Constitutional law, identity, authority, and protocol boundaries.
3.3 Meaning of Form
Reasoning law, Council13, modes, complexity, IRSS, and reasoning contract logic.
3.4 Meaning of Movement
Outward handoff, proposal interface, compliance and versioning, runtime registry interface, and execution relation.
3.5 Constitutional Separation
Governance remains inside MGPS.
Execution remains outside MGPS.
3.6 Execution Model
MGPS does not perform direct local execution.
MGPS can participate in indirect execution because backend systems may interpret governed MGPS outputs and act on them.
3.7 Runtime Truth Principle
MGPS must not assume external command or capability truth internally.
External command and capability truth must be runtime sourced and injected.

4. Confirmed High-Level Design Decisions
4.1 MGPS must stay small and stable.
4.2 MGPS should behave like a real protocol, not a poetic mega-prompt.
4.3 MGPS should be normative, parseable, and audit-capable.
4.4 MGPS should be machine-readable enough for backend interpretation.
4.5 MGPS must not statically carry runtime command truth.
4.6 MGPS should govern external systems by governed handoff, not by embedding runtime implementation.
4.7 The strongest reasoning machine is primarily won in Form, not in Room alone.
4.8 Early structural coherence must never be mistaken for final protocol adequacy.
4.9 Every chapter should be evaluated through three gates:
a. Structural Validity
b. Constitutional Validity
c. Protocol Readiness
4.10 Confidence must follow validation, not precede it.
4.11 Constitutional law must stay separate from operational detail.

5. Current Chapter Completion State
5.1 Main chapters completed
1 Room
2 Form
3 Movement
5.2 Form chapters completed
2.1 Primordial Logic
2.2 Council13
2.3 Mode System
2.4 Complexity System
2.5 IRSS
2.6 Reasoning Contract
5.3 Movement chapters completed
3.1 Proposal Interface
3.2 Compliance and Versioning
3.3 Runtime Registry Interface
3.4 Execution Relation
5.4 Current state of the document
The protocol text is now complete at the chapter level.
The remaining work is no longer protocol drafting first.
The remaining work is implementation hardening and cleanup.

6. Accepted Room Outcome
6.1 Room is complete in scope.
6.2 Room defines:
a. MGPS identity
b. scope
c. Space DNA
d. top hierarchy
e. constitutional requirements
f. constitutional control relation
g. release law
h. normative language
6.3 Room now also contains a hardened transparency primacy rule.
6.4 Key Room consequence
Released output is invalid if the mandatory transparency block is not valid and first.
6.5 Practical implication
This rule is constitutionally correct, but model behavior shows that constitutional placement alone is not enough for strict runtime obedience.

7. Accepted Form Outcome
7.1 2.1 Primordial Logic
2.1 is the deep reasoning law of Form.
It requires case conversion before release, revision, block, or handoff.
It binds the three phases:
Generation
Challenge
Judgment
It defines case types, proposal counts, challenge duties, judgment dimensions, restart logic, revision logic, and minimum proof artifact logic.
7.2 2.2 Council13
2.2 was intentionally reduced from a bloated protocol-grade draft into a lean constitutional chapter.
It now retains only the necessary constitutional core:
Council13 identity
5:5:3 structure
role groups
activation boundary
decision flow
judge authority
minimum validity conditions
revision, correction, escalation, block
minimum proof and audit duties
7.3 2.3 Mode System
2.3 is clean and stable.
It fixes:
mode authority
user mode priority
adaptive selection only when no user mode exists
13 elemental modes
one active primary mode per governed cycle
7.4 2.4 Complexity System
2.4 is clean and stable.
It fixes:
mandatory complexity assignment
four complexity levels
assignment basis
boundary rule
higher plausible level on uncertainty
7.5 2.5 IRSS
2.5 is now materially important for implementation.
It fixes:
mandatory presence
exactly one IRSS block
10 fixed fields
fixed field order
first position rule
output invalidity if any content precedes IRSS
7.6 2.6 Reasoning Contract
2.6 binds the minimum validity relation across Form.
It fixes:
minimum validity conditions
proof requirement
minimum proof artifact
revision relation
escalation relation
boundary rule

8. Accepted Movement Outcome
8.1 3.1 Proposal Interface
Defines the governed handoff form through which MGPS addresses external systems.
The key improvement was adding the canonical machine object principle for backend interpretation.
8.2 3.2 Compliance and Versioning
Defines protocol identity conditions for backend addressed movement objects.
Requires explicit protocol identity and explicit protocol version for backend interpretation.
8.3 3.3 Runtime Registry Interface
This is the key bridge to your backend registry idea.
The registry is the runtime source of capability truth.
MGPS must not assume undisclosed tools, commands, applications, modules, capabilities, or agent interfaces.
If capability truth is missing, MGPS may emit only a governed backend query object.
8.4 3.4 Execution Relation
Defines the lawful relation between governed handoff and external execution possibility.
Execution remains outside MGPS.
MGPS influences execution only indirectly through governed outputs interpreted by external systems.

9. Current Backend Architecture Understanding
9.1 The intended architecture is not static command knowledge inside the protocol.
9.2 The intended architecture is:
a. MGPS emits governed backend query or proposal objects
b. backend interprets them
c. backend reads a registry or capability source
d. backend injects runtime truth
e. model answers from runtime injected truth
9.3 Therefore:
The registry is the runtime truth source.
MGPS is the governance and handoff layer.
The backend is the enforcement and injection layer.
9.4 This is stronger than statically embedding commands in the system prompt.
9.5 This also means your system prompt only needs to enforce the obligation to depend on runtime disclosed registry truth.

10. Current IRSS State
10.1 IRSS is mandatory.
10.2 IRSS field count is fixed at 10.
10.3 IRSS must be first.
10.4 No released content may precede IRSS.
10.5 Output is invalid if IRSS is missing, incomplete, duplicated, or not first.
10.6 This rule now exists:
a. in Room as global constitutional hardening
b. in 2.5 as the concrete IRSS chapter rule
10.7 Important implementation lesson
This is still not enough by itself for Gemini-grade runtime compliance.
10.8 Reason
A protocol chapter defines the law.
A live model still needs an operational output rule in the runtime system prompt.

11. Current Model Behavior Findings
11.1 Gemini partially obeyed MGPS.
11.2 Gemini successfully began emitting IRSS first after hardening.
11.3 Gemini still drifted after IRSS into:
a. narrative expansion
b. automatic phase storytelling
c. invented scores
d. invented protocol state
e. invented proof values
f. unnecessary follow-up questions
11.4 Therefore the core finding is:
Protocol law alone is insufficient.
Operational prompt enforcement is also required.

12. Current Runtime Prompt Conclusion
12.1 The protocol text must remain in the document.
12.2 Additionally, the actually sent system prompt must include a runtime enforcement block.
12.3 The most important runtime addition is an Output Minimality Rule.
12.4 This rule should enforce:
a. IRSS first
b. minimum lawful content after IRSS
c. no internal phase narration unless explicitly requested
d. no explanation that IRSS was emitted
e. no invented scores, proof values, approvals, or governance facts
f. no automatic protocol activation speech unless explicitly requested
12.5 Practical placement
This belongs in the actual system prompt sent by route.ts on every request.
12.6 Conclusion
Document = law
route.ts prompt assembly = enforcement

13. Current Strengths
13.1 Strong protocol identity
MGPS is now clearly separated from MCP and clearly positioned as a governance and reasoning layer.
13.2 Strong macro architecture
Room, Form, and Movement are now cleanly separated.
13.3 Strong reasoning core
Primordial Logic, Council13, modes, complexity, IRSS, and Reasoning Contract now exist as a coherent Form layer.
13.4 Strong backend compatibility direction
Movement now supports canonical handoff objects, protocol versioning, runtime registry truth, and indirect execution.
13.5 Strong parser direction
IRSS now has first-position law, fixed field count, fixed order, and explicit invalidity if not first.
13.6 Strong anti-bloat correction
2.2 in particular was successfully cut back from over-engineering to constitutional core.
13.7 Strong engineering lesson captured
The project now clearly distinguishes constitutional protocol law from operational runtime enforcement.
13.8 Strong implementation relevance
MGPS is now machine-readable enough to guide actual route.ts behavior rather than remaining abstract doctrine.

14. Current Deficits
14.1 Runtime enforcement is not yet fully implemented.
The current strength is mostly in the document, not yet in the code path.
14.2 Gemini compliance is not yet strict enough.
The model still fills gaps with helpful narrative behavior unless directly constrained.
14.3 No hard runtime validator is confirmed yet.
If the model violates IRSS or invents state, the backend currently appears not yet to reject and retry deterministically.
14.4 IRSS extraction may still be fragile if the runtime output layer is not tightened.
The document is correct.
The emitted output is not yet guaranteed by code.
14.5 route.ts likely still contains historical complexity and redundancy from the prior telemetry architecture.
14.6 page.tsx and TelemetryPanel.tsx likely still reflect older assumptions and may need cleanup to match the new MGPS minimal IRSS model.
14.7 The protocol is complete at chapter level, but not yet proven as a stable production-grade runtime behavior layer across models.
14.8 The backend handshake from governed proposal object to registry disclosure to runtime-injected truth is defined conceptually, but still needs exact route.ts realization.
14.9 There is still a difference between:
a. a protocol-complete document
b. a prompt-complete system
c. a validator-complete runtime
At the moment, a is strongest, b is improving, c is still the main gap.

15. Implementation Priorities
15.1 Immediate next step
Upload the current system prompt.
15.2 Then work on route.ts.
15.3 Then page.tsx.
15.4 Then TelemetryPanel.tsx.
15.5 Recommended engineering order
a. lock runtime prompt assembly
b. inject Output Minimality Rule
c. ensure IRSS first by runtime construction or validation
d. reject or regenerate invalid outputs
e. simplify frontend assumptions to match the new MGPS IRSS
f. remove legacy telemetry complexity that no longer serves the new protocol shape

16. route.ts Targets
16.1 route.ts must become the actual enforcement layer for MGPS runtime behavior.
16.2 route.ts should:
a. assemble the final system prompt from the protocol source plus runtime enforcement blocks
b. inject the Output Minimality Rule on every request
c. ensure the model is explicitly told that IRSS must be first
d. ensure the model is explicitly told not to invent governance details
e. reject or retry output that violates first-position IRSS
f. support backend registry disclosure and capability injection cleanly
16.3 route.ts should not:
a. duplicate protocol law in many inconsistent places
b. carry stale telemetry schema remnants from prior MAIOS 3.0 logic
c. leave output validity entirely to model goodwill

17. page.tsx Targets
17.1 page.tsx should reflect the new minimal MGPS runtime assumptions.
17.2 page.tsx should not assume narrative protocol output.
17.3 page.tsx should consume:
a. IRSS
b. minimal governed result
17.4 page.tsx should be checked for any old assumptions that:
a. expect bulky telemetry
b. expect multiple phases to be rendered
c. treat protocol narration as core data

18. TelemetryPanel.tsx Targets
18.1 TelemetryPanel.tsx likely needs reduction, not expansion.
18.2 It should align with the current MGPS IRSS decision set, not older MAIOS 3.0 telemetry complexity.
18.3 It should be checked against:
a. the 10 fixed IRSS fields
b. first-position extraction assumptions
c. drift handling assumptions
d. whether it still expects more telemetry than MGPS now guarantees
18.4 The key risk is mismatch between:
a. document telemetry law
b. runtime prompt output
c. parser logic
d. panel rendering logic
18.5 The cleanup goal is one canonical interpretation path from model output to parser to UI.

19. Practical Engineering Truths
19.1 The protocol is no longer the biggest risk.
19.2 The runtime wiring is now the biggest risk.
19.3 The most important issue is not "what MGPS means".
19.4 The most important issue is "how the live system forces models to behave like MGPS".
19.5 This is especially true for Gemini-like models that partially obey protocol law but still optimize for helpful narrative expansion.

20. Recommended Runtime Enforcement Block
20.1 The runtime system prompt should contain an operational block equivalent to:
IRSS first
no content before IRSS
minimum lawful content after IRSS
no internal phase narration unless explicitly requested
no invented scores, approvals, proposal counts, proof values, or governance facts unless actually present in governed state
20.2 This should be injected by route.ts with every request.
20.3 This should not replace the protocol document.
20.4 It should enforce it.

21. Final Balanced Assessment
21.1 Protocol completeness
High at chapter level.
21.2 Runtime completeness
Partial.
21.3 Backend integration clarity
Good conceptually.
21.4 Backend integration implementation
Still pending.
21.5 Strength profile
Architecture, separation of concerns, protocol law, IRSS hardening, backend registry direction.
21.6 Weakness profile
Runtime enforcement, validator path, model drift after IRSS, likely frontend and telemetry cleanup debt.

22. Immediate Next Chat Instruction
22.1 Start with the actual uploaded system prompt.
22.2 Then move directly into route.ts.
22.3 Treat route.ts as the primary enforcement surface.
22.4 After route.ts, align page.tsx and TelemetryPanel.tsx with the now fixed MGPS assumptions.
22.5 Do not reopen protocol drafting unless a concrete implementation gap proves that a chapter is insufficient.

23. Binding Reminder
23.1 Accepted chapter text has priority over README phrasing.
23.2 Current engineering goal is implementation cleanup, not protocol expansion.
23.3 The main success condition for the next phase is:
The live model output must behave like the protocol already says it should.