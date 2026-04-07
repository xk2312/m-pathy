README_EXECUTION_BAR_FULL.txt
Version: final hardened
Status: binding full project handoff

PART 1
EXECUTION BAR CONTRACT SPACE

README_EXECUTION_BAR.txt
Version: final C6 rewrite hardened
Status: binding contract

1. Purpose

This document defines the full binding contract for the execution bar object.
This document is specification only.
This document is not implementation.

The execution bar must appear during execution, must reflect process state through the fixed rules in this document, and must disappear only after real completion.

2. Structural Authority

2.1 Fixed authority order
page.tsx is the sole orchestration instance.
The execution bar component is the sole visual child.
The shell is the sole transcript source for visible phase mapping.

2.2 Fixed authority boundaries
page.tsx owns control.
The component owns rendering.
The shell owns transcript generation.

2.3 Forbidden authority overlap
The component must not parse logs.
The component must not calculate time.
The component must not calculate progress.
The component must not know shell, engine, registry, API, or request logic.
page.tsx must not duplicate component animation logic.
The shell must not own frontend state.

3. Existence Rule

3.1 Existence condition
The execution bar exists only while an execution request is active and the final output has not yet completed its exit transition.

3.2 Visibility rule
The component is visible only while visible = true.
The component is absent only while visible = false.

4. State Contract

4.1 Fixed visible state set
Only the following visible states are valid:
a. initializing
b. validating_location
c. ai_analysis
d. refining
e. finalizing

4.2 Fixed internal completion states
Only the following internal completion states are valid:
a. done
b. hidden

done is internal only.
hidden is internal only.
Neither done nor hidden may be rendered as visible status text.

4.3 Fixed transition order
Only the following forward order is valid:
initializing -> validating_location -> ai_analysis -> refining -> finalizing -> done -> hidden

4.4 Invalid transitions
Backward transitions are invalid.
Skipped visible states are invalid.
Repeated state setting without a new valid trigger is invalid.
Any state not listed in sections 4.1 and 4.2 is invalid.

5. Trigger Contract

5.1 Start trigger
Request start sets:
state = initializing
progress = 0
visible = true

5.2 Transcript trigger mapping
Only the following shell transcript markers may change visible state:
"STEP START: ReverseGeocode" -> validating_location
"STEP START: FirstCall" -> ai_analysis
"STEP START: C6Challenge1" -> refining
"STEP START: FinalizeOutput" -> finalizing

5.3 Ignored transcript lines
All transcript lines other than the four markers in section 5.2 are ignored for visible state control.
Duration lines are ignored.
Completion print lines are ignored.
Separator lines are ignored.
Python print lines are ignored.
JSON markers are ignored.

5.4 Completion trigger
Full response received sets:
state = done

5.5 Exit trigger
Exit completion sets:
state = hidden
visible = false

6. Text Mapping Contract

6.1 Fixed mapping
Only the following visible text mapping is valid:
initializing -> ...starting
validating_location -> ...processing location
ai_analysis -> ...analyzing
refining -> ...refining
finalizing -> ...finalizing

6.2 Text rules
Exactly one visible status text is allowed at a time.
Status text must be derived only from the current visible state.
No additional explanatory text is allowed.
No raw transcript line may be shown.
No derived status wording outside section 6.1 is allowed.

7. Progress Contract

7.1 Progress nature
Progress is time driven and completion bound.
Progress is not step counted.
Progress is not transcript counted.
Progress never moves backward.

7.2 Fixed progress ranges
Only the following progress ranges are valid:
a. 0 to 80 percent = active movement
b. 80 to 95 percent = slowed approach
c. 95 to 100 percent = completion only

7.3 Active movement range
Progress moves from 0 to 80 percent across exactly 20 seconds.
This movement starts immediately when state becomes initializing.
This movement must be continuous.

7.4 Slowed approach range
After reaching 80 percent, progress may continue only through a slowed non linear forward approach toward 95 percent.
This range must not communicate guaranteed immediate completion.
A hard freeze before completion is invalid.
A hard jump before completion is invalid.

7.5 Completion range
Progress may move from 95 to 100 percent only after the full response has actually been received.
This completion movement must last not less than 150 milliseconds and not more than 250 milliseconds.

7.6 Hard progress rules
100 percent before real completion is invalid.
Backward motion is invalid.
Reset during the same request is invalid.

8. Motion Contract

8.1 Fixed motion hierarchy
Only the following motion hierarchy is valid:
a. progress bar = primary motion
b. status text transition = secondary motion
c. three dots = tertiary motion

8.2 Progress bar motion
The progress bar carries the main movement.
It must remain continuous.
It must remain controlled.
It must not blink.
It must not pulse aggressively.
It must not segment.
It must not reset during visible state changes.

8.3 Status text motion
Status text may change only when the visible state changes.
The text transition must remain inside the same visual area.
Slide in from outside is invalid.
Bounce is invalid.
Typewriter effect is invalid.

8.4 Three dot motion
The three dots are an activity signal only.
They remain subordinate to the progress bar.
They must animate softly.
Jumping is invalid.
Flashing is invalid.
Dominating the object is invalid.

8.5 Removed motion
Light sweep is forbidden.
Scan effect is forbidden.
Decorative motion without process meaning is forbidden.

9. Exit Contract

9.1 Exit condition
Exit begins only after both conditions are true:
a. the full response has been received
b. progress has reached 100 percent

9.2 Exit behavior
The object must disappear through a short controlled exit.
A soft opacity reduction is allowed.
A minimal scale reduction is allowed.

9.3 Forbidden exit behavior
Abrupt removal is invalid.
Rotation is invalid.
Strong blur is invalid.
Long theatrical exit is invalid.

9.4 Exit result
After exit completion:
state = hidden
visible = false
The component is removed.

10. Component Contract

10.1 Component role
The component is purely visual and reactive.

10.2 Fixed input props
The component accepts exactly:
a. state
b. progress
c. visible

10.3 Component responsibilities
The component may only:
a. render the object
b. render the internal divider
c. render the progress bar
d. map visible state to the fixed text in section 6.1
e. animate text transitions
f. animate the three dots
g. animate exit

10.4 Forbidden component responsibilities
The component must not:
a. parse logs
b. calculate progress
c. calculate timing
d. call APIs
e. mutate orchestration state
f. infer new states
g. know transcript semantics

11. Integration Contract for page.tsx

11.1 Orchestration role
page.tsx is the sole control instance for the execution bar.

11.2 Required ownership
page.tsx owns exactly:
a. state
b. progress
c. visible

11.3 Required tasks
page.tsx must:
a. start execution
b. set initializing at request start
c. start progress movement
d. receive transcript data
e. map allowed transcript markers to visible states
f. trigger completion when the full response arrives
g. trigger exit
h. remove the component after exit

11.4 Forbidden tasks
page.tsx must not embed component animation choreography.
page.tsx must not create alternative visible states.
page.tsx must not interpret transcript lines beyond the fixed mapping.

12. Shell Transcript Contract

12.1 Transcript source of truth
The shell is the sole transcript source for visible phase mapping.

12.2 Contract relevance
Only the transcript lines in section 5.2 are relevant for visible state switching.

12.3 Non relevant shell output
Duration lines are non relevant.
Completion prints are non relevant.
Separators are non relevant.
All other shell lines are non relevant.
Python prints are non relevant.

13. Object Form Contract

13.1 Visual object
The execution bar is one centered object.

13.2 Fixed size target
Width target = 250 pixels.
Height target = 150 pixels.

13.3 Internal layout
The object is horizontally divided.
The upper area contains the progress bar.
The lower area contains exactly one active status line.

13.4 Lower area rule
The lower area must not render a list.
The lower area must not render stacked phases.
The lower area renders one active phase only.

14. Determinism Rules

14.1 Same trigger sequence
The same valid trigger sequence must produce the same visible state sequence.

14.2 Same progress law
The same running time before completion must produce the same progress behavior.

14.3 Same completion
The same completion event must produce the same 95 to 100 percent finish and the same exit trigger behavior.

15. Final Target State

The target state is one complete, isolated, deterministic, bounded execution object.
Its control belongs only to page.tsx.
Its visible phase mapping is anchored only in the shell transcript.
Its movement is governed only by the fixed motion and progress rules in this document.
Its visible life cycle begins only at request start and ends only after real completion and controlled exit.

PART 2
IMPLEMENTATION SURFACE AND TEAM HANDOFF

README_EXECUTION_BAR_PART2.txt
Version: final hardened
Status: binding implementation surface

1. Purpose

This document defines the remaining implementation surface required to realize the execution bar project.
This part does not redefine the execution bar contracts.
This part defines which files are relevant, what each file is responsible for, what must be changed, what must stay unchanged, and what result is required.

The dev team must be able to complete the project without follow up questions.

2. Scope Boundary

2.1 In scope
Only the following implementation surface is in scope:
a. the extension
b. the shell transcript
c. route.ts
d. page.tsx
e. the execution bar component

2.2 Out of scope
The following are out of scope:
a. engine redesign
b. registry redesign
c. shell pipeline redesign
d. Python step redesign
e. new states, new animations, new process phases, or new semantics not already defined

2.3 Non expansion rule
No new concept may be introduced beyond what has already been defined in this chat.
No new user visible phase may be invented.
No new process semantic may be inferred.

3. Canonical Project Goal

The project goal is one lightweight centered execution object during execution.
The object is controlled only by page.tsx.
Its visible state is derived only from the fixed shell transcript markers.
Its progress follows only the fixed progress contract.
Its visible text follows only the fixed text mapping.
It disappears only after real completion.

4. Canonical Relevant Files

4.1 Extension
Relevant file:
extensions/baz_sach_helfer.json

4.2 Shell
Relevant file:
app/doctors-advisor/execution-space/bin/run.sh

4.3 API route
Relevant file:
route.ts

4.4 Frontend orchestrator
Relevant file:
page.tsx

4.5 Visual child component
Relevant file:
The execution bar component file imported by page.tsx.
The exact filename was not fixed in this chat.
No filename may be invented inside this document.

5. Extension Contract Surface

5.1 Role of the extension
The extension defines the user flow that leads into execution.
It collects the required data.
It ends in the execution step.

5.2 What already exists
The extension already contains:
a. one entry selection
b. multiple input steps
c. one final execution step

5.3 What must stay unchanged
The extension must remain the point that gathers the input data required for execution.
The execution bar must not change extension logic.
The execution bar must not add extension states.
The execution bar must not alter user questions.

5.4 Required result
The extension must continue to trigger execution exactly as before.
The execution bar project must not break the extension path.

6. Shell Contract Surface

6.1 Role of the shell
The shell is the sole transcript source for visible phase mapping.
The shell remains the deterministic orchestrator of the execution pipeline.

6.2 What already exists
run.sh already executes the pipeline in fixed order.
run.sh already prints step start lines.
run.sh already prints step end lines.
The shell output already contains the markers used for visible phase mapping.

6.3 Contract relevant markers
Only the following transcript markers are visible phase triggers:
a. STEP START: ReverseGeocode
b. STEP START: FirstCall
c. STEP START: C6Challenge1
d. STEP START: FinalizeOutput

6.4 What must stay unchanged
The shell must remain the only source for phase transcript mapping.
No Python step may become the source of visible phase semantics.
No alternative transcript source may be introduced.

6.5 What is forbidden
Transcript authority must not move from shell to Python.
User visible phase logic must not be added inside Python steps.
UI semantics must not be derived from Python prints.
UI semantics must not be derived from duration lines.
UI semantics must not be derived from JSON markers.

6.6 Required result
The shell must continue to run the same deterministic sequence.
The execution bar must consume only the fixed transcript markers already defined.

7. route.ts Contract Surface

7.1 Role of route.ts
route.ts is the server side execution gate.
It triggers execution.
It creates the run space.
It writes the collected input.
It runs the shell.
It receives the shell output.
It returns the final response.

7.2 What already exists
route.ts already:
a. calls the engine
b. detects the execution step
c. creates a unique run path
d. writes 01_input.json
e. executes run.sh through execSync
f. receives shell output
g. extracts the final JSON
h. returns the assistant response

7.3 Current execution fact
route.ts is currently block based because it uses execSync.
No live frontend event stream exists in the current state.
The current project state allows only transcript use after shell completion unless route.ts is changed.
This document does not authorize SSE, WebSockets, or spawn based redesign because those were not fixed in this chat.

7.4 Required addition
route.ts must expose the shell transcript information needed by page.tsx to perform the fixed state mapping.
This addition must not change the defined execution logic.

7.5 What must stay unchanged
Execution must stay process bound.
The final response must still come from the execution pipeline.
The execution bar project must not redefine execution.
The execution bar project may only add controlled visibility over the already running process.

7.6 What is forbidden
route.ts must not invent new visible states.
route.ts must not own animation logic.
route.ts must not reinterpret the contracts already fixed for page.tsx.

7.7 Required result
route.ts must return enough information for page.tsx to:
a. know execution has started
b. know the transcript markers
c. know the final response has completed

8. page.tsx Contract Surface

8.1 Role of page.tsx
page.tsx is the sole control instance for the execution bar.
It owns the UI state.
It owns progress.
It owns visibility.
It owns transcript mapping.
It mounts and removes the component.

8.2 Required state ownership
page.tsx must own exactly:
a. state
b. progress
c. visible

8.3 Required tasks
page.tsx must:
a. start the execution bar at request start
b. set state = initializing
c. set progress = 0
d. set visible = true
e. consume the transcript information returned by route.ts
f. map the fixed shell markers to the fixed visible states
g. drive progress according to the progress contract
h. finish progress only on real completion
i. trigger exit after real completion
j. remove the component after exit

8.4 Forbidden tasks
page.tsx must not create new states.
page.tsx must not show raw transcript lines.
page.tsx must not duplicate component animation choreography.
page.tsx must not reinterpret the fixed mapping.

8.5 Required result
page.tsx becomes the complete orchestration owner of the execution bar life cycle.

9. Component Contract Surface

9.1 Role of the component
The component is the visual child object rendered by page.tsx.
It is reactive only.

9.2 Fixed component inputs
The component accepts exactly:
a. state
b. progress
c. visible

9.3 Required component behavior
The component must:
a. render the centered object
b. render the upper progress area
c. render the lower single active status line
d. apply the fixed text mapping
e. apply the motion contract
f. apply the exit contract

9.4 Forbidden component behavior
The component must not parse transcript lines.
The component must not know shell steps.
The component must not compute progress.
The component must not decide life cycle.

9.5 Required result
The component remains a pure child object controlled entirely by page.tsx.

10. End to End Implementation Sequence

10.1 First layer
Keep the extension path unchanged.
Keep execution triggering unchanged.

10.2 Second layer
Make the shell transcript available to the frontend through route.ts.

10.3 Third layer
Implement the execution bar component as a pure child component.

10.4 Fourth layer
Integrate the component into page.tsx.

10.5 Fifth layer
Bind page.tsx to the fixed transcript mapping, fixed progress law, fixed state contract, fixed text mapping, fixed motion contract, and fixed exit contract.

11. Deterministic Expected Final Behavior

11.1 Start
When execution begins, the object appears centered.
It becomes visible immediately.
It starts in initializing.
Its progress begins at 0.

11.2 During execution
The object remains singular.
It shows exactly one active status line.
It changes visible state only when the fixed shell markers are reached.
It does not show raw shell output.

11.3 Completion
When the final response is truly complete, the progress completes.
The object exits in a controlled way.
The final output takes over.

12. Final Delivery Rule

The dev team must be able to complete the project by touching only the relevant implementation surface defined above and by following the already fixed execution bar contracts in Part 1.
No additional concept is required.
No additional phase logic is required.
No redesign outside the defined surface is required.
