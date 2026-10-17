# Classmap Skill

[中文](README.md) | English

## One-liner

Classmap Skill uses one `CLASSMAP.md` to help AI coding assistants locate code responsibilities: which code owns a behavior, which file to inspect first, and which boundaries are easy to confuse.

The map records "feature or change cue → code location → responsibility." The assistant verifies current code before recommending a target and proceeds to implementation only when requested.

## Problem

Users usually know what should change, but may not know where the behavior lives:

- Requests such as "change login logic," "add a payment callback," or "fix an order status bug" first need the responsible code.
- Similarly named classes, components, or modules can have different responsibilities; keyword matches still need interpretation.
- After files move or responsibilities shift, outdated documentation can send the next task to the wrong location.

Classmap Skill provides a lightweight, human-maintainable responsibility index to narrow the reading scope.

## Features

### Two skills, one map

| Skill | Responsibility |
|---|---|
| `classmap-maintain` | Creates, refreshes, or inspects the map as requested; inspection-only tasks are read-only, and it does not implement business features. |
| `classmap-target` | Selects candidate code and verifies it before recommending targets; continues into implementation when requested and synchronizes relevant entries in an existing map when needed. |

### Three pieces of information by default

This illustrative map shows the format; actual entries must come from verified project code:

```md
# CLASSMAP.md

Use this index to choose candidate files, then verify current code. Entries cover the main behaviors, not every file.

| Feature / change cue | Primary code | Responsibility and boundary |
|---|---|---|
| Login validation, failed-login policy | `src/auth/LoginService.ts` | Coordinates login checks; token creation belongs to TokenService. |
| Token creation, refresh | `src/auth/TokenService.ts` | Owns token generation and refresh rules. |
```

Paths are relative to the repository root; add a symbol name when a file has several responsibilities. Describe boundaries only where they prevent confusion. Record callers, dependencies, and tests only when they help locate code; no additional fixed fields are required. For unconfirmed responsibilities, describe the missing evidence instead of assigning confidence scores.

Prioritize common business entrypoints, core implementations, easily confused responsibilities, and key handoffs between modules. Do not inventory routine DTOs, wrappers, helpers, or tests. A first map can stop once the identified main behaviors are covered, briefly noting uncovered areas when needed.

Preserve useful existing layouts and manual notes. There is no mandatory format migration or duplicate set of per-file details.

### Verify before recommending targets

Usually, consult the map and then read candidate code. When the user supplies a specific file or symbol, start there and consult the map as useful.

After verification, a short note can be enough:

```md
- Start with `src/auth/LoginService.ts`: its login flow coordinates credential checks and failed-login policy.
- Also inspect `src/auth/AuthController.ts` if request or response fields change; it owns the HTTP contract.
```

Add related files or exclusion reasons only when useful. Fixed primary/secondary/excluded sections and search-budget reports are unnecessary. Distinguish verified responsibilities from unresolved candidates; locating responsible code does not prove a bug's root cause.

A missing map entry does not mean the code is absent. When candidates do not explain the behavior, follow entrypoints and callers, then expand to module searches or repository-wide targeted searches as needed. If no likely module is known, search directly. When the map is missing, complete the current routing task without creating it.

### Clear write boundaries and focused updates

| User request | Behavior |
|---|---|
| Location, explanation, analysis, review, or drift inspection only | Read-only; report routing evidence, unresolved questions, and discrepancies. |
| Implement or fix a feature | Complete the request; synchronize relevant entries in an existing map when routing facts change. |
| Create, refresh, or repair the map | Use `classmap-maintain` within the requested scope. |

Update an existing map only when future routing is affected: an important responsibility is added, transferred, or removed; a move, rename, or deletion affects an existing path; a primary entrypoint changes; or the task confirms an incorrect routing entry.

Routine helpers or tests, internal dependency changes, and fixes within an unchanged responsibility do not independently trigger updates. Update only relevant entries verified during the task and report drift outside its scope. Map creation and broader refreshes do not block the current task.

### Clear documentation boundaries

`CLASSMAP.md` stores responsibilities and routing clues only. Keep terminology, architecture decisions, and task plans in existing domain docs such as `CONTEXT.md`, design docs or `docs/adr/`, and task docs respectively. The skills do not create those documents automatically.

## Working with Other Approaches

| Approach | Classmap Skill's role |
|---|---|
| README / CODEMAP / directory structure | Adds behavior-to-code responsibilities and easily confused boundaries to existing project documentation. |
| Keyword search | Supplies candidates, then uses code reads and targeted searches to verify or extend them. |
| Dependency graphs / impact analysis systems | Focuses on everyday responsibility lookup without maintaining complete call relationships or providing complete impact analysis. |

## Quick Start

### Installation

Use npm with `npx` for one-command installation:

```bash
npx @qingyuwanan/classmap-skill install
```

By default, the installer copies both skills into `~/.agents/skills`:

- `~/.agents/skills/classmap-maintain`
- `~/.agents/skills/classmap-target`

If those directories already exist, the installer overwrites them directly. It only touches those two fixed skill directories and does not delete or modify other skills under `~/.agents/skills`.

To install into another skills directory, pass `--target`:

```bash
npx @qingyuwanan/classmap-skill install --target ~/.codex/skills
```

### Usage

#### 1. Create or refresh the map

Inside an existing project, run:

```txt
/classmap-maintain
```

With no additional request, this defaults to creating or refreshing `CLASSMAP.md`. You can also limit maintenance to one module.

#### 2. Locate code without modifying it

```txt
/classmap-target I want to add email verification to login. Only identify the relevant code; do not modify anything yet.
```

Expected flow:

```txt
Read the map or start from a supplied file
-> Read candidate code and use targeted search if needed
-> Report verified responsibilities, locations, and remaining uncertainty
-> Stop without modifying code or the map
```

#### 3. Locate and implement

```txt
/classmap-target Add email verification to login. First locate the relevant code, then implement the change.
```

Continue into implementation after verifying the targets. Synchronize relevant entries in an existing map only when future routing is affected. A missing map is not created automatically.

#### 4. Inspect or repair stale entries

Inspect without writing files:

```txt
/classmap-maintain Check the login module's CLASSMAP.md entries for drift and report only.
```

Explicitly request a repair:

```txt
/classmap-maintain Verify and update stale entries for the login module, preserving other modules.
```

## Who It Is For

- People who frequently use AI to modify existing projects and want to retain key code responsibilities across sessions.
- Teams with several modules or easily confused responsibilities that want less routing noise.
- Projects that want a small set of reliable entrypoints maintained in Markdown without a complete code index.

A tiny demo with only a few files usually does not need a separate map. Complete dependency queries, strict impact analysis, and fully automatic zero-maintenance indexing are also outside this project's scope.

## Star

If this saves you from even one "I can describe the change but do not know which file to edit" moment, please consider giving the project a Star.
