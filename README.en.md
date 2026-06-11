# Classmap Skill

[中文](README.md) | English

## One-liner

Classmap Skill is a lightweight skill workflow that helps AI coding assistants identify code responsibilities before changing code.

It connects features, code units, responsibilities, dependencies, callers, and change triggers through one `CLASSMAP.md`, so an AI coding assistant can route a request even when the user only describes the change and does not know which files should be edited.

## Problem

Every time an AI assistant starts by searching the whole repository, locating the right files becomes painful. The common failure mode in AI coding is not code generation; it is that the user knows what should change, but not where that behavior lives:

- The user says "change login behavior", "add a payment callback", or "fix the order status bug", but the assistant does not know which class to inspect first.
- If the assistant relies only on keyword search, it can hit many similarly named files with different responsibilities.
- Similar class names and mixed responsibilities make the agent confuse controllers, services, repositories, and UI components.
- After a code change, the documentation is not updated, so the next agent starts from stale context.
- Full-repo search is noisy, while a real knowledge graph is often too expensive to build and maintain.

Classmap Skill keeps the solution small:

> Use Markdown as an AI-readable code responsibility map, so every coding task starts with routing, not guessing.

## Features

### Two skills, one map

- `classmap-maintain`
  - Creates, repairs, and maintains `CLASSMAP.md`.
  - Use it when onboarding to a project, after major refactors, after adding important modules, or when the map is missing or stale.
  - It maps code ownership. It does not implement feature changes directly.

- `classmap-target`
  - Reads `CLASSMAP.md` and routes a feature request, bug report, or refactor to the most relevant code units.
  - Use it before day-to-day coding work.
  - It may update `CLASSMAP.md` only for files inspected, changed, or created during the current task.

### Route first, code second

`classmap-target` produces a routing note before implementation:

```md
## Target recommendation

### Primary targets

1. `src/auth/LoginService.ts`
   - Reason: owns login business flow.
   - Change here if: login rules or failed-login policy changes.

### Secondary targets

1. `src/auth/AuthController.ts`
   - Reason: HTTP entrypoint for login.
   - Touch only if: request or response contract changes.

### Probably not targets

- `src/auth/JwtProvider.ts`
  - Avoid unless: token claims or signing behavior changes.
```

The agent clarifies what to change, what to inspect later, and what to avoid before touching code.

### Clear documentation boundaries

`CLASSMAP.md` is only for code ownership and routing:

- Code responsibilities, dependencies, callers -> `CLASSMAP.md`
- Business terminology -> `CONTEXT.md`
- Architecture decisions -> `docs/adr/`
- Task plans -> issues, PRDs, or task docs

This keeps the map from becoming a noisy README, glossary, or TODO list.

## Comparison

| Approach | Pros | Cons | Classmap Skill's role |
|---|---|---|---|
| Regular README | Easy for humans to read and good for project introduction | Usually too broad to tell an agent which class owns a behavior | README explains the project; `CLASSMAP.md` routes code changes |
| CODEMAP / directory map | Useful for module and folder structure | Often stops at module level and misses responsibility boundaries | Adds owns / does not own / change when for important code units |
| Keyword search / full-repo search | Fast and requires no maintenance | Matches text, not ownership; noisy context and easy false positives | Read the map first and map natural-language requests to responsible code units |
| Knowledge graph | Precise relationships, queryable, visualizable | Needs schema, extraction pipeline, storage, and maintenance | Use a Markdown-based lightweight graph to solve everyday code targeting with lower maintenance cost |

Classmap Skill is not a replacement for a full knowledge graph. It is a low-cost, human-maintainable navigation layer optimized for AI coding sessions.

## Quick Start

### Installation

Use npm with `npx` for one-command installation:

```bash
npx @lixiansen/classmap-skill install
```

By default, the installer copies both skills into `~/.agents/skills`:

- `~/.agents/skills/classmap-maintain`
- `~/.agents/skills/classmap-target`

If those directories already exist, the installer overwrites them directly. It only touches those two fixed skill directories and does not delete or modify other skills under `~/.agents/skills`.

To install into another skills directory, pass `--target`:

```bash
npx @lixiansen/classmap-skill install --target ~/.codex/skills
```

To uninstall, delete the installed skill directories:

```bash
rm -rf ~/.agents/skills/classmap-maintain ~/.agents/skills/classmap-target
```

Before publishing, verify the packed package locally:

```bash
npm pack
npx ./lixiansen-classmap-skill-0.1.0.tgz install --target ./tmp-skills
```

Publish to npm:

```bash
npm publish --access public
```

### Usage

#### 1. Create the first code responsibility map

Inside an existing project, run:

```txt
/classmap-maintain
```

It will inspect the project structure and important code, then create or refresh `CLASSMAP.md`.

#### 2. Route changes before coding

Example:

```txt
/classmap-target I want to add email verification to login. First identify which classes should change.
```

Expected flow:

```txt
Read CLASSMAP.md
-> Produce Primary / Secondary / Probably not targets
-> Verify by reading a small set of candidate files
-> Continue into implementation
-> Incrementally update CLASSMAP.md if the task changes responsibilities
```

#### 3. Refresh stale maps

When `CLASSMAP.md` no longer matches the code, or after a large refactor:

```txt
/classmap-maintain Check whether this project's CLASSMAP.md is stale and refresh it.
```

## Who It Is For

Use this if you:

- Often use AI agents to modify existing codebases.
- Want fewer broad searches and fewer wrong-file edits.
- Maintain projects in any programming language; the larger and more modular the project is, the more useful the map becomes.
- Want a lightweight code knowledge map while avoiding the maintenance cost of a graph database or AST pipeline.

This is less useful when:

- The project is only a tiny demo.
- Your team already has mature automated dependency and impact analysis.
- You need a fully automated code intelligence system with strict machine-queryable relationships.

## Star

If this saves you from even one "I can describe the change but do not know which file to edit" moment, please consider giving the project a Star.

More Stars make it easier to justify adding real-world examples, `CLASSMAP.md` templates, and setup notes for more coding agents.
