# Keep the Work index in step with the item files

*[[ LLM Generated ]]*

> Type: refactor

## Summary

`Work/README.md` lists each Active item's next task, but two lines no longer match the item files.
This item brings the index back in line.

## Motivation

- A stale index sends sessions to the wrong task.
- Two test runs on Oct 22, 2026 found the drift independently.

## Acceptance criteria

- Every Active row in `Work/README.md` names the first unchecked task of its item file.

## Prompt history

- 2026-10-22 — "Work the next task" (test card for backlog-run)

## Technical details

Compare each `Work/Active/<Item>.md` first unchecked `- [ ] Tk` with its row in `Work/README.md`; correct the row.
Found so far: DocumentationSite (index says T2, file says T3) and ParallelSessions (index says T3, file says T6).

## Tasks

- [ ] T1 (model: opus, effort: high — small, checkable) — correct the Active rows of `Work/README.md`.

### Done

## Hand-off

(nothing yet)

## Decisions

| Date | Decision | Rationale |
|---|---|---|

## Progress
