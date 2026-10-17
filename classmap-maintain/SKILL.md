---
name: classmap-maintain
description: Create, refresh, or inspect CLASSMAP.md, a lightweight code responsibility index. Use when the task calls for building a code map, updating it after responsibility changes, or checking whether it still matches the code. Inspection-only requests are read-only; this skill does not implement business features.
---

# classmap-maintain

Maintain `CLASSMAP.md` so an agent can answer: "Which code should I inspect for this behavior, and where does its responsibility end?"

Keep it a small, human-readable index of useful entrypoints and responsibilities.

## Scope

- A request limited to inspection, explanation, or drift checking is read-only. Report discrepancies without editing the map.
- A request to create, refresh, or repair the map authorizes maintenance within that scope. A bare invocation uses the default create-or-refresh task.
- A missing or stale map alone does not authorize creating or updating it during another task.
- Prefer code evidence over asking the user. Ask only when an important ambiguity cannot be resolved from code and relevant docs.
- Trust current code when it conflicts with the map. Do not implement business features as part of map maintenance.

## Workflow

1. Confirm the project and requested scope. Read the existing `CLASSMAP.md` and inspect the relevant source/module structure. Consult `README.md`, `CODEMAP.md`, `CONTEXT.md`, or specific docs only where they help identify entrypoints; do not read all documentation by default.
2. Start from the main behaviors in scope and follow their entrypoints into the responsible code. Ignore generated, vendor, dependency, and build output.
3. Verify paths and responsibilities in code. Use existing docs as navigation clues. Describe specific uncertainty when a responsibility cannot be confirmed; do not guess or assign confidence scores.
4. For inspection, report the verified findings. For maintenance, make targeted edits, preserving useful manual notes and existing layout unless they contradict code. Do not convert a useful existing map solely to match the example below.
5. For a first map, stop when the identified main behaviors have reliable entrypoints and important boundaries are clear. Briefly note uncovered areas if coverage is partial; exhaustive file coverage is unnecessary. For an existing map, stop when the requested scope is checked or updated.

## What to Include

Include code that helps a future task choose where to look:

- Business entrypoints and core implementations that commonly receive behavior changes.
- Code units whose similar names or shared workflows make their responsibilities easy to confuse.
- Key handoffs between modules when they explain where a responsibility moves.
- Configuration, tests, or supporting code only when they materially affect locating the behavior.

Do not inventory routine DTOs, wrappers, helpers, or tests. Include one only when its responsibility is useful for routing. Record callers or dependencies only when they clarify where to look next, not as a complete relationship list.

## Map Format

For a new map, default to one table with three pieces of information: a feature or change cue, the primary code path, and its responsibility. Add a boundary only when it prevents confusion. For example:

```md
# CLASSMAP.md

Use this index to choose candidate files, then verify current code. Entries cover the main behaviors, not every file.

| Feature / change cue | Primary code | Responsibility and boundary |
|---|---|---|
| Login validation, failed-login policy | `src/auth/LoginService.ts` | Coordinates login checks; token creation belongs to TokenService. |
| Token creation, refresh | `src/auth/TokenService.ts` | Owns token generation and refresh rules. |
```

Use repository-relative paths, adding a symbol name when a file has several distinct responsibilities. Follow the project's documentation language. The example paths are illustrative; use verified project paths in the actual map.

Add short notes or feature groupings only when they help navigation. Avoid duplicating the table in a second set of per-file entries. Kind, caller lists, dependency lists, tests, confidence labels, and positive/negative change conditions are not required fields.

## Documentation Boundaries

Keep only facts that help locate code or distinguish responsibilities. Leave terminology in existing domain docs such as `CONTEXT.md`, decisions in design docs or `docs/adr/`, and plans in task docs. Do not create those documents as part of this skill.

Keep maintenance in Markdown; no dependency graph, full call-chain catalog, or automated indexing infrastructure is needed.
