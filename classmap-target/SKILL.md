---
name: classmap-target
description: Use CLASSMAP.md to route feature requests, bug reports, refactors, and behavior changes to the smallest accurate set of relevant code units. Use before coding when the user asks where to change behavior, which class or file owns a feature, where a bug may live, or how to implement a change with minimal search. This skill may incrementally update CLASSMAP.md only for files inspected, changed, or created during the current task.
---

# classmap-target

Use `CLASSMAP.md` as the first navigation layer for AI coding.

The goal is to map the user's request to the smallest accurate set of classes, modules, components, services, controllers, repositories, hooks, stores, APIs, and tests.

## Core Rule

Read `CLASSMAP.md` first.

Do not begin with broad repository search. Use the map to choose likely files, then verify with small focused code reads.

## Responsibilities

Use this skill to:

- Parse the user's requested feature, bug, refactor, or behavior change.
- Find the most relevant code units from `CLASSMAP.md`.
- Explain why each candidate is or is not a target.
- Read primary target files before searching elsewhere.
- Use focused search only when the map is missing, incomplete, or suspicious.
- Implement the requested code change when the user asked for coding.
- Incrementally update `CLASSMAP.md` only for files changed, created, or directly verified during this task.

Do not:

- Rebuild the entire `CLASSMAP.md`.
- Scan the whole repository by default.
- Rewrite unrelated classmap sections.
- Update entries for files you did not inspect or touch.
- Treat `CLASSMAP.md` as authoritative when code contradicts it.
- Ignore the actual code when the map and code disagree.

## Workflow

1. Parse the request:
   - feature
   - behavior
   - bug symptom
   - domain nouns
   - UI entrypoint
   - API endpoint
   - event, job, or handler
   - data model
   - expected change

2. Read `CLASSMAP.md`.

3. Produce a target recommendation before coding.

4. Verify by reading primary target files.

5. Use limited search only if needed:
   - Search for names, methods, routes, events, or concepts discovered from `CLASSMAP.md`.
   - Avoid broad exploratory search unless `CLASSMAP.md` is missing or clearly stale.

6. Make the code change if the user requested implementation.

7. After code changes, update `CLASSMAP.md` only for the current task scope.

## Target Recommendation Format

Before coding, output a concise routing note:

```md
## Target recommendation

### Primary targets

1. `path/to/File.ext`
   - Reason:
   - Change here if:

### Secondary targets

1. `path/to/File.ext`
   - Reason:
   - Touch only if:

### Probably not targets

- `path/to/File.ext`
  - Avoid unless:

### Search budget

- Start with the primary targets.
- Use focused search only if these files do not explain the behavior.
```

If the user explicitly asked for only a location/routing answer, stop after the recommendation and verification summary. If the user asked for implementation, continue after the routing note.

## Incremental CLASSMAP Update Rule

After modifying code, update `CLASSMAP.md` if and only if one of these happened:

- A new class, module, component, service, controller, repository, hook, store, API, job, event handler, or test was added.
- A touched file's responsibility changed.
- A new dependency or caller relationship was introduced.
- A feature now maps to a different primary file.
- The existing map was clearly wrong for the touched files.

Do not update unrelated entries.

If broader drift is found, mention it in the final response instead of repairing the whole map:

```txt
CLASSMAP.md appears stale beyond this task. Run /classmap-maintain for a broader refresh.
```

## Drift Handling

If `CLASSMAP.md` conflicts with code:

- Trust the code.
- Mention the mismatch.
- Fix the entry only if it is inside the current task scope.
- Otherwise recommend `classmap-maintain`.

Example:

```txt
CLASSMAP drift detected:
- CLASSMAP.md says `LoginService` owns token creation.
- Code shows token creation is now in `TokenService`.
- This task only touches login validation, so do not rewrite the token entries now.
```

## Missing CLASSMAP.md

If `CLASSMAP.md` is missing:

- Say that the routing map is unavailable.
- Use focused repository search for the current task only.
- Recommend running `classmap-maintain` after the task to create the map.
- Do not create a full `CLASSMAP.md` from this skill unless the current task itself adds or verifies enough entries for a small scoped update.
