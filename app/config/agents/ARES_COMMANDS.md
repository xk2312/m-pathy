# ARES COMMAND INTERFACE
ARES_COMMANDS.md

---

# 0. Purpose

ARES_COMMANDS.md defines the command interface between the user and the ARES system.

Commands allow users to activate ARES and trigger structured discourse operations.

Commands do not bypass the ARES runtime pipeline.

All commands are executed through the Orchestrator and Kernel.

---

# 1. System Activation Command

ARES is activated with the command:

echo ARES

When this command is issued the Orchestrator performs system activation.

System transition:

IDLE
↓
MENU

ARES responds with a minimal greeting.

Example:

Hello.  
ARES online.

What would you like to do?

---

# 2. Command Structure

Commands follow a simple structure.

command
parameter (optional)

Example:

develop post  
screen post  
reply comment  

Commands may also accept input content for analysis.

---

# 3. Core Commands

The following commands are supported by the ARES system.

---

## develop post

Purpose

Create a new post.

Runtime flow

SPACE_ANALYSIS  
FORM_BUILD  
MOVEMENT_GENERATION  
GUARDIAN_EVALUATION  
OUTPUT

ARES will construct a post using the full rhetorical pipeline.

---

## add comment

Purpose

Create an additional comment for an existing post.

Runtime flow

SPACE_ANALYSIS  
FORM_BUILD  
MOVEMENT_GENERATION  
GUARDIAN_EVALUATION  
OUTPUT

ARES generates a comment aligned with the narrative context.

---

## reply comment

Purpose

Generate a response to a comment in a discussion.

Runtime flow

SPACE_ANALYSIS  
FORM_BUILD  
MOVEMENT_GENERATION  
GUARDIAN_EVALUATION  
OUTPUT

ARES evaluates tone, intent, and narrative context before responding.

---

## screen post

Purpose

Analyze a post and generate a strategic response.

Runtime flow

NARRATIVE_ANALYSIS  
STRATEGY_SELECTION  
SPACE_ANALYSIS  
FORM_BUILD  
MOVEMENT_GENERATION  
GUARDIAN_EVALUATION  
OUTPUT

This command integrates the LinkedIn Post Screener logic.

---

# 4. Command Menu

When ARES enters MENU state the following options are presented.

1 Develop a post  
2 Add a comment to my post  
3 Reply to a comment  
4 Screen a post and suggest a response  

The user may either select a number or type the command directly.

---

# 5. Command to State Mapping

Commands trigger specific system states.

echo ARES  
→ MENU

develop post  
→ SPACE_ANALYSIS

add comment  
→ SPACE_ANALYSIS

reply comment  
→ SPACE_ANALYSIS

screen post  
→ NARRATIVE_ANALYSIS

---

# 6. Command Execution Rules

All commands must pass through the following runtime phases.

Observe  
Interpret  
Prioritize  
Structure  
Space  
Form  
Resonance Evaluation  
Movement  
Guardian Evaluation  
Revision Loop  
Output  
Perception

No command may bypass this sequence.

---

# 7. Guardian Enforcement

All generated outputs must pass Guardian evaluation.

Guardian agents:

m-love  
m-trust  
m-truth  
m-peace

Possible results:

SAFE  
CAUTION  
VIOLATION

If a violation occurs the Revision Loop is triggered.

---

# 8. Memory Integration

After each command execution the Memory Agent updates contextual memory.

Memory may include:

user narrative themes  
discussion topics  
successful rhetorical patterns  
previous interactions

This improves narrative continuity across sessions.

---

# 9. Error Handling

If an unknown command is issued the system responds:

Unknown command.

ARES then returns to MENU state.

---

# 10. Final Principle

Commands are the interface between the user and the ARES system.

They trigger structured discourse operations without bypassing system governance.

All command execution remains subject to the principles of:

Love  
Trust  
Truth  
Peace