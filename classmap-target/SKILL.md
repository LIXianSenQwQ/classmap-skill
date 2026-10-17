---
name: classmap-target
description: Locate the code responsible for a behavior using CLASSMAP.md and focused code verification. Use to locate files for feature changes, bug fixes, or refactors, or to answer which code owns a behavior. Location-only requests are read-only; implementation tasks may synchronize relevant routing facts in an existing map.
---

# classmap-target

Use `CLASSMAP.md` to choose candidate code, then verify its responsibilities in the current source.

The result should explain where to look first and any boundary that matters to the request. Locating responsible code does not by itself establish a bug's root cause.

## Scope

- Requests limited to location, explanation, analysis, or review are read-only, including the map. Report any drift without repairing it.
- Continue into implementation only when the user requests it, following the project's normal coding workflow. This skill adds routing guidance, not a separate implementation process.
- During implementation, synchronize an existing map only under the incremental rule below and within the user's authorized scope.
- Creating or broadly refreshing a map belongs to `classmap-maintain` when requested. Do not make it a prerequisite for the current task.

## Workflow

1. Identify the requested behavior and useful clues, such as a feature name, symptom, route, event, or symbol. Distinguish a location-only request from an implementation request.
2. If the user supplied a specific file or symbol, start there and consult the map as useful. Otherwise, read relevant parts of `CLASSMAP.md` to select candidates. If the map is missing, briefly say so and use focused search for this task; do not create it.
3. Read candidate code before presenting a recommendation. Verify the paths and responsibilities, following relevant entrypoints or callers where needed. Trust code over the map and state any remaining uncertainty.
4. If the candidates do not explain the behavior, expand search as described below.
5. Output a concise, verified routing note. For a location-only request, stop after the recommendation and any verification limits. For implementation, continue with the requested change, then consider a scoped map update.

## Search When Needed

An absent map entry is not evidence that the behavior is absent from the project.

Follow relevant entrypoints, callers, and implementations; search within the likely module, then use repository-wide targeted search if the location is still unresolved. Use request clues and code evidence as search terms. Skip a narrower step when there is no useful module or candidate to start from.

Avoid aimless repository exploration. A precise repository-wide search can be appropriate even when a map exists. Stop expanding once the relevant responsibility is sufficiently supported by code; no fixed file or search-count budget is required.

If the responsible code cannot be confirmed, report what was checked and what remains unresolved rather than presenting a guess as verified.

## Routing Note

Name the primary file or files and explain the responsibility verified in code. Add relevant symbols or locations when useful. Include related files only with a reason or condition for inspecting them. Mention excluded candidates only when they resolve a real ambiguity.

Keep the format proportional to the request. For example, after checking the relevant code:

```md
- Start with `src/auth/LoginService.ts`: its login flow coordinates credential checks and failed-login policy.
- Also inspect `src/auth/AuthController.ts` if request or response fields change; it owns the HTTP contract.
```

Do not generate empty primary/secondary/excluded sections or a search-budget report. Separate verified responsibilities from unresolved candidates; describe the specific missing evidence instead of assigning confidence scores.

## Incremental Map Updates

After an implementation task, update an existing `CLASSMAP.md` only when verified facts in the task's scope would otherwise cause a future agent to look in the wrong place, miss an entrypoint, or misunderstand a responsibility:

- An important responsibility was added, transferred, or removed.
- A file was moved, renamed, or deleted, affecting an existing routing path.
- A feature's primary entrypoint changed.
- The task confirmed that an existing routing entry was wrong.

Adding routine helpers or tests, changing an internal dependency, or fixing behavior within an unchanged responsibility does not by itself require an update.

Update only affected entries whose facts were verified during this task, including obsolete paths confirmed through the move or deletion. Preserve the existing useful layout and manual notes; do not migrate formats or rebuild the map. Use feature/change cues, code paths, and concise responsibilities, adding boundaries only where helpful.

Report drift outside the task's scope without fixing it. When the map is missing or needs broader maintenance, suggest `classmap-maintain` as a separate task and continue the current work without that dependency.
