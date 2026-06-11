---
name: classmap-maintain
description: Create, repair, and maintain CLASSMAP.md, a lightweight code responsibility map for a project. Use when onboarding to an existing codebase, when CLASSMAP.md is missing, stale, incomplete, or contradicts code, after major refactors, after adding important modules, or when the user asks to refresh the code map. This skill maps code ownership; do not use it to implement feature changes directly.
---

# classmap-maintain

Maintain `CLASSMAP.md`: a lightweight, human-readable code responsibility map for AI coding sessions.

The goal is to help future agents locate the right classes, modules, components, services, controllers, repositories, hooks, stores, APIs, and tests without broad repository search.

## Core Rule

Prefer reading code over asking the user.

Ask only when code and existing docs cannot resolve an important ambiguity. If code and `CLASSMAP.md` disagree, trust code and update `CLASSMAP.md`.

## Responsibilities

Use this skill to:

- Create `CLASSMAP.md` when it does not exist.
- Repair stale, incomplete, or inaccurate entries.
- Add important newly discovered code units.
- Mark unclear or mixed responsibilities instead of guessing.
- Preserve useful manual notes unless they contradict code.
- Keep the map useful for future AI coding tasks.

Do not:

- Implement feature changes.
- Rewrite unrelated business code.
- Turn `CLASSMAP.md` into a glossary.
- Put domain terminology explanations in `CLASSMAP.md`; use `CONTEXT.md`.
- Put architecture decisions in `CLASSMAP.md`; use `docs/adr/` or design docs.
- Put task plans, PRDs, issue text, or source-code dumps in `CLASSMAP.md`.

## Workflow

1. Inspect existing context:
   - `CLASSMAP.md`
   - `CODEMAP.md`
   - `CONTEXT.md`
   - `README.md`
   - `docs/`
   - package/module structure

2. Detect the project shape:
   - frontend, backend, full-stack, library, monorepo
   - main frameworks
   - source directories
   - test directories
   - generated, vendor, dependency, and build directories to ignore

3. Build or update the map:
   - Start from high-level features and entrypoints.
   - Identify important code units, not every tiny helper.
   - For each code unit, capture ownership, non-ownership, dependencies, callers, related tests, and change triggers.
   - Ground every entry in code or existing docs.

4. Keep edits scoped:
   - For a missing map, create a useful first version.
   - For a stale map, prefer accurate targeted updates over broad speculative rewrites.
   - For unclear ownership, mark uncertainty explicitly.

5. Mark confidence and drift:
   - `Confidence: high`
   - `Confidence: medium`
   - `Confidence: low`
   - `unclear responsibility`
   - `mixed responsibility`
   - `possible doc/code drift`

## CLASSMAP.md Contract

Use this structure:

```md
# CLASSMAP.md

## Purpose

This file maps project features to code units so future AI coding sessions can locate the right files without broad repository search.

## How to Use

- Start here before changing behavior.
- Use the Feature Index to find candidate code.
- Use Code Unit Entries to understand ownership and non-ownership.
- If this file disagrees with code, trust code and update this file.

## Feature Index

### Feature Name

| Responsibility | Primary code | Related code | Change when |
|---|---|---|---|

## Code Unit Entries

### `path/to/File.ext`

**Kind:** service / controller / repository / component / hook / store / model / utility / test / config / other

**Owns:**
- ...

**Does not own:**
- ...

**Called by:**
- ...

**Depends on:**
- ...

**Change this when:**
- ...

**Do not change this when:**
- ...

**Related tests:**
- ...

**Confidence:** high / medium / low
```

## Documentation Boundaries

Keep responsibilities separated:

- Business terminology -> `CONTEXT.md`
- Architecture decisions -> `docs/adr/`
- Code responsibilities and routing -> `CLASSMAP.md`
- Task plans, PRDs, issue narratives -> issue / PRD / task docs

When unsure whether something belongs in `CLASSMAP.md`, include only facts that help an agent answer: "Which code unit should I inspect or change for this behavior?"
