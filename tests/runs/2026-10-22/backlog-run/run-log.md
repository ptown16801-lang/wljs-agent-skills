# Run log: backlog-run, "Work the next task of the IndexSync item" (2026-10-22)

## 1. Skills used

1. backlog-run (local WLJS adaptation; read ROUTES.md, the pinned upstream `backlog-run/SKILL.md`, and the upstream `document-revise/SKILL.md` it requires)
2. wiki-update (local WLJS adaptation; read the pinned upstream `wiki-update/SKILL.md`)

document-revise was read as backlog-run's step 0 but not invoked as a skill.

## 2. Steps

1. Read the project's `CLAUDE.md`, `Work/README.md` and `Work/Active/IndexSync.md`. IndexSync is in `Active/`. Its only task is T1, "correct the Active rows of `Work/README.md`", annotated `model: opus, effort: high`. This session runs on the Opus tier, so the model matches. Effort cannot be checked from inside a session; the requested level is high.
2. No driver notice, so this was an interactive run (document-revise: no autonomous mode). The deliverable is an index update, which document-revise lists as a mechanical change that needs no revision gate.
3. Claim: there was no `work/IndexSync` or `auto/IndexSync` branch and no other worktree. I ran `git worktree add -b work/IndexSync <project>/.worktrees/IndexSync HEAD`. **Deviation:** the skill puts the worktree at `~/.cache/autolab/project/IndexSync`. I kept it inside the working folder because of the rule "work only inside it".
4. Compared each Active item's first unchecked `- [ ] Tk` (in file order) with its index row:
   - BacklogLifecycle: T4 / T4 (OK).
   - DocumentationSite: file T3, index T2 (stale).
   - ParallelSessions: file T6, index T3 (stale; the file lists T6, T5, T3 in that order on purpose).
   - IndexSync: had no row.
5. Corrected the DocumentationSite and ParallelSessions rows. T1 was the last task, so I added an UnderReview table row for IndexSync. A Python check of every Active row against its file's first unchecked task: all three match.
6. In the item file: T1 checked and moved to `### Done` as S1, with three **Test:** bullets. I wrote the Hand-off, added one Progress line, then ran `git mv Work/Active/IndexSync.md Work/UnderReview/IndexSync.md`.
7. wiki-update:
   - Added the section *The index row* to `Wiki/Concepts/ItemFileFormat.md`: the row is a second copy and why it drifts, "next task" is file order rather than the lowest number, and a bash drift check, which I ran and which matches the result above.
   - Updated the ItemFileFormat line in `Wiki/Index.md` and added a Recent changes line to `Wiki/Status.md`.
   - Project journal and prompt tracking are not turned on in `CLAUDE.md`, so both were skipped.
8. Checked the commit message with the repo's `.githooks/commit-msg` (it passed; `core.hooksPath` is not set, so I ran the hook by hand). Committed `8c1bc68` on `work/IndexSync`. No merge, no push.
9. Released the claim with `git worktree remove` (no `--force`) and removed the empty `.worktrees/` folder. The branch `work/IndexSync` stays.
10. Summary page: during the run the coordinator changed the rule: no `mcp__wljs__new_notebook` and no opening WLJS notebooks. I had not opened one. I wrote a `.md` summary and converted it with `tools/md2wln.py` (read before running). No window was opened.

**Wolfram evaluations:** none. The task was text and git only, so no engine was used: no WLJS kernel, no wolframscript, no wolfram-direct, no wsm-toolkit. Nothing contacted any network.

## 3. Files

On branch `work/IndexSync` (commit `8c1bc68`), under `<repo>/tests/runs/2026-10-22/backlog-run/work/project/`:
- `Work/README.md` (changed)
- `Work/Active/IndexSync.md` → `Work/UnderReview/IndexSync.md` (moved and changed)
- `Wiki/Concepts/ItemFileFormat.md` (changed)
- `Wiki/Index.md` (changed)
- `Wiki/Status.md` (changed)

In the main checkout (on `master`), untracked:
- `Work/Artifacts/IndexSync_S1_Summary.md` (created)
- `Work/Artifacts/IndexSync_S1_Summary.wln` (created)

Temporary (created and removed): the worktree `.../project/.worktrees/IndexSync`. Scratch: the commit message file in the session scratchpad.

This log: `<repo>/tests/runs/2026-10-22/backlog-run/run-log.md`.

## 4. WLJS notebook

`<repo>/tests/runs/2026-10-22/backlog-run/work/project/Work/Artifacts/IndexSync_S1_Summary.wln`

Generated from its `.md` with md2wln.py, unevaluated. It was not opened in WLJS, per the coordinator's rule.

## 5. Answer

Session 1 complete (T1). IndexSync had one task: make every Active row of `Work/README.md` name the item's next task. Two rows were wrong:
- DocumentationSite said T2; it is now T3, the docs build script.
- ParallelSessions said T3; it is now T6, the paclet-dev claim. The file runs T6, then T5, then T3 on purpose.

BacklogLifecycle (T4) was already right. The work is committed on `work/IndexSync` and has not been merged. That was the last task, so the item is now in `Work/UnderReview/` and ready for review with `/backlog-review IndexSync`. The test steps are under T1 in that file. I also added a short note to the wiki (`ItemFileFormat` § *The index row*) on why the index gets out of date and a one-line command to check it. Merging the branch is your decision.

## 6. Problems

- **Worktree location:** the skill says `~/.cache/autolab/<Repo>/<Item>`; I used `<project>/.worktrees/IndexSync` to stay inside the working folder. If you prefer the skill's path, the next session should use it. Nothing depends on the path, because the worktree is gone and the claim now rests only on the branch.
- **Branch and commit:** the local adaptation lists "creating worktrees/branches and committing" under "Needs the owner's OK", but also says to follow the repository's rules, and those (backlog-run steps 1 and 8) say to make the branch and commit there. With no owner available, I followed the repository's rules: branch and commit only, no merge, no push. If that needs explicit approval, the question would be: "May I create `work/IndexSync` with a worktree and commit the T1 change there?"
- **Effort:** the task asks for `effort: high`. A session cannot check its own effort level, so I did not verify it.
- **Untracked files:** the summary files leave `Work/Artifacts/` untracked on `master`. Generated notebooks are kept out of git here, so I did not commit them.
- **Commit hook:** `core.hooksPath` is not set in this repo, so `.githooks/commit-msg` does not run on its own. I ran it by hand.
- **Not fixed (outside the task):**
  - The BacklogLifecycle row still has the note "(T5 done first, operator's choice)", which is history. I recorded it in the Hand-off.
  - `Wiki/Concepts/ItemFileFormat.md` has the marker `*[ LLM Generated ]*` with single brackets where the house style uses `[[ ]]`.
- **Rule change during the run:** the coordinator's no-notebook rule came before any notebook was opened, so nothing had to be undone.
