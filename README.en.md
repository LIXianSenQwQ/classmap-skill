# Classmap Skill

[中文](README.md) | English

**Reduce repeated exploration. Help AI coding assistants distinguish code responsibilities.**

Classmap Skill keeps verified business entrypoints, code locations, and responsibility boundaries in a lightweight `CLASSMAP.md`. A later session or another coding assistant can use those findings as a starting point and check them against current code.

Free and open source. Maintained in Markdown. Works alongside the agent's existing code search and reading tools.

## Why Use It

When maintaining an existing project, the same questions recur across tasks:

- **Exploring the same module again:** a previous session traced the login flow, but the next session starts over with directories and keywords.
- **Finding files without knowing who owns what:** login validation, token refresh, and page redirects live in different modules with overlapping names or keywords.
- **Translating business language into code:** "return to the original page after login expires" may involve session management, a request interceptor, and a route guard.

Classmap Skill records reusable findings as "feature or change cue → code location → responsibility and boundary." Future tasks use those clues to choose where to read first, then verify the current implementation.

Its value comes from retaining project knowledge and reducing repeated exploration.

## Reuse What You Have Learned

### Two skills, one map

| Skill | Responsibility |
|---|---|
| `classmap-maintain` | Records verified entrypoints and responsibilities in a map; creates, updates, or inspects it as requested. |
| `classmap-target` | Reuses map clues, reads current code, and confirms which responsibilities the request involves; continues into implementation when requested. |

### A small table of reusable responsibilities

This illustrative map shows the format; actual entries must come from verified project code:

```md
# CLASSMAP.md

Use this index to choose candidate files, then verify current code. Entries cover the main behaviors, not every file.

| Feature / change cue | Primary code | Responsibility and boundary |
|---|---|---|
| Login validation, failed-login policy | `src/auth/LoginService.ts` | Coordinates login checks; token creation belongs to TokenService. |
| Token creation, refresh | `src/auth/TokenService.ts` | Owns token generation and refresh rules. |
```

Prioritize common business entrypoints, confusing responsibilities, and key handoffs between modules. Use repository-relative paths and add symbol names when useful. Preserve helpful manual notes and keep the map small rather than listing every file.

### Start with known clues, then check current code

Usually, consult the map and then read candidate code. When the user supplies a specific file or symbol, start there and consult the map as useful.

After verification, a short note can be enough:

```md
- Start with `src/auth/LoginService.ts`: its login flow coordinates credential checks and failed-login policy.
- Also inspect `src/auth/AuthController.ts` if request or response fields change; it owns the HTTP contract.
```

This example separates login rules from the HTTP contract, helping a later task choose a starting point based on the requested change. Keep the output focused on useful responsibilities, related files, and unresolved questions. Locating responsible code does not prove a bug's root cause.

A missing map entry does not mean the code is absent. When candidates do not explain the behavior, follow entrypoints and callers, then expand to module searches or repository-wide targeted searches as needed. If no likely module is known, search directly. When the map is missing, complete the current routing task without creating it.

### Clear write boundaries and focused updates

| User request | Behavior |
|---|---|
| Location, explanation, analysis, review, or drift inspection only | Read-only; report routing evidence, unresolved questions, and discrepancies. |
| Implement or fix a feature | Complete the request; synchronize relevant entries in an existing map when routing facts change. |
| Create, refresh, or repair the map | Use `classmap-maintain` within the requested scope. |

During implementation, synchronize an existing map only when verified changes to responsibilities, paths, or entrypoints affect future routing. Internal fixes within an unchanged responsibility need no update. Maintain only relevant entries verified during the task; map creation and broader refreshes do not block it.

## Working with the Agent's Existing Tools

| Approach | Classmap Skill's role |
|---|---|
| Agent search and code reading | Supplies previously verified clues; the agent still reads current implementations, follows calls, and resolves ambiguity. |
| README / CODEMAP / directory structure | Adds behavior-to-code responsibilities, prioritizing boundaries that are easy to confuse. |
| Symbol indexes / dependency graphs | Works alongside them: symbols and calls help trace implementations, while responsibility notes help choose a starting point. |

`CLASSMAP.md` stores responsibilities and routing clues. Keep terminology, architecture decisions, and plans in existing project documents. Maps can be incomplete or stale; current code takes precedence. Use appropriate tools for complete dependency queries or strict impact analysis.

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

- People who use AI to maintain the same project and want to reuse exploration results across sessions.
- Teams with several modules, similar names, or old and new implementations whose responsibilities need to be distinguished.
- Projects willing to maintain a small set of key entrypoints and boundaries in Markdown.

A tiny demo with only a few files usually does not need a separate map. Complete dependency queries, strict impact analysis, and fully automatic zero-maintenance indexing are also outside this project's scope.

Results depend on project complexity, map quality, and reuse. No measured speed or accuracy comparison is available yet.

## Star

If the map helps you avoid exploring a module again or clarify a confusing responsibility boundary, please consider giving the project a Star.
