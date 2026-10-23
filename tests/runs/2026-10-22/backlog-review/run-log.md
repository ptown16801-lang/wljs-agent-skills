# Run log: backlog-review, 2026-10-22

## 1. Skills used

1. `backlog-review` (local WLJS adaptation; read ROUTES.md, the pinned upstream `backlog-review/SKILL.md`, and the upstream `document-revise/SKILL.md` it says to read first)

## 2. Steps

1. Listed the working folder; checked git: checkout `master` clean, one unmerged branch `work/IndexSync` (`git branch --list 'work/*' 'auto/*' --no-merged`). No `Work/UnderReview/` in the checkout, no `Work/Runs/` digest. Read `fixture-setup.md` (data only).
2. Step 1 of the skill (find the item): read `git show work/IndexSync:Work/UnderReview/IndexSync.md`. Merge check: checkout clean, `git merge-tree --write-tree HEAD work/IndexSync` exit 0 (no conflict).
3. Step 2 (what happened): `git log --oneline HEAD..work/IndexSync` = one commit `dae2638 fix(work): IndexSync T1 — index rows match item files`; `git diff --stat` = `Work/README.md` (4 lines) and the item renamed Active -> UnderReview. Read the full diff and the branch's `Work/README.md`.
4. Step 3 (criterion walk; one criterion): ran the check with git/grep on the branch tree (`git show work/IndexSync:Work/Active/<Item>.md`, first `- [ ] Tk` per file vs. the README row). I did not create a worktree at `~/.cache/autolab/...` as upstream says: the run rules confine work to the working folder, and `git show` reads the branch tree without switching the operator's checkout.
5. WLJS notebook (the local adaptation: results of file-producing skills end in a WLJS summary page): `mcp__wljs__kernel_evaluate` checked `$AllowInternet` (False) and `$VersionNumber` (15.) — WLJS kernel, to confirm the shared kernel was offline. `mcp__wljs__new_notebook` (id 005), `add_cells_batch` with a `.md` review header, a Wolfram cell re-running the acceptance check, a `.md` findings cell, and a save cell; `evaluate_cell` on all of them — WLJS kernel via `mcp__wljs__*`, because the review should be visible to the owner. The check cell calls `RunProcess[{"git","-C",repo,"show",...}]` (local git only). Its first version had a regex spanning lines and returned one wrong row; I fixed the pattern (per-line parse) and re-evaluated: 3 rows, all `Match -> True` (BacklogLifecycle T4/T4, DocumentationSite T3/T3, ParallelSessions T6/T6). Saved with `NotebookSave[EvaluationNotebook[], ".../IndexSync-review.wln"]` evaluated in the notebook (returned `RemoteNotebook[...]`, file 6674 bytes).
6. Captured WLJS windows with `tools/capture-wljs-windows.sh`; my window is `llm-5e7.wln` (review header rendered). The Dataset output further down was not captured visually; its content was read from the tool result.
7. Step 4 (verdict): stopped at first, since no owner was available (question in section 5). Then the coordinator relayed the scripted owner reply: "Send it back. Findings 1 and 2 become new tasks (fix the truncated rows; list IndexSync in the index's UnderReview section)."
8. Send-back path (upstream step 4, *Send back*), git only, no Wolfram evaluation:
   1. `git merge --no-edit work/IndexSync`: fast-forward `5a8b733..dae2638`, so no merge commit.
   2. Added two unchecked tasks to `## Tasks` in the item, routed by backlog-add's table (index update = mechanical sweep -> `sonnet`/`high`, the measured row): T2 "fix the truncated rows" and T3 "list IndexSync in the index's UnderReview section". Added the owner's words, quoted and dated, plus the two findings to `## Prompt history`.
   3. `git mv Work/UnderReview/IndexSync.md Work/Active/IndexSync.md`; appended `- **Review** 2026-10-22 — sent back: T2, T3 added.` to `## Progress`; wrote the context for T2 and T3 into `## Hand-off` (replacing "(nothing yet)").
   4. `Work/README.md`: added the IndexSync row to the Active table, next task T2. The UnderReview section already said "None." on `master`, so nothing to remove there.
   5. Commit `536d4c3 docs(work): IndexSync sent back from review` (with the Co-Authored-By trailer).
   6. No worktree existed (`git worktree list` shows only the checkout); `git branch -d work/IndexSync` deleted the branch (was `dae2638`). Not pushed. `> Autonomous: allowed` was not in the item, so there was nothing to keep.

No `wolframscript`, `wolfram-direct` or `wsm-toolkit` runs.

## 3. Files

- Created: `<repo>/tests/runs/2026-10-22/backlog-review/work/project/IndexSync-review.wln` (untracked in the project repo; the checkout is otherwise unchanged)
- Created: `<repo>/tests/runs/2026-10-22/backlog-review/scratch/cap/*.png` (3 window captures)
- Created: this run log
- Changed (send-back): `<repo>/tests/runs/2026-10-22/backlog-review/work/project/Work/UnderReview/IndexSync.md` moved to `.../work/project/Work/Active/IndexSync.md` and edited (Tasks T2, T3; Prompt history; Hand-off; Progress)
- Changed (send-back): `<repo>/tests/runs/2026-10-22/backlog-review/work/project/Work/README.md` (IndexSync row added to the Active table)
- Git in the project repo: fast-forward merge of `work/IndexSync` into `master`; commit `536d4c3`; branch `work/IndexSync` deleted. No push, no worktrees.

## 4. WLJS notebook

`<repo>/tests/runs/2026-10-22/backlog-review/work/project/IndexSync-review.wln` (left open as window `llm-5e7.wln`)

## 5. Answer

**After the owner's verdict (send back):** IndexSync is back in `Work/Active/` on `master` (commit `536d4c3`). T1's work was merged (fast-forward) and the branch `work/IndexSync` was deleted. The new tasks are T2 (fix the truncated rows; `sonnet`, `high`) and T3 (list IndexSync in the index's UnderReview section; `sonnet`, `high`). The index shows IndexSync with next task T2. `/backlog-run IndexSync` or `/backlog-autolab` takes T2. Nothing was pushed.

**At the review, before the verdict:**

Item **IndexSync** is waiting on branch `work/IndexSync` (one commit, T1 done in S1); it merges cleanly.

Criterion: *"Every Active row in `Work/README.md` names the first unchecked task of its item file."* Served by T1, test: "the DocumentationSite row names T3 and the ParallelSessions row names T6". **Check passed** on the branch: BacklogLifecycle T4 = T4, DocumentationSite T3 = T3, ParallelSessions T6 = T6.

Things for you to judge (not fixed; nothing is fixed during a review):
1. The two corrected rows are cut off mid-word: DocumentationSite ends "... into `Documentation/English/` wi", ParallelSessions ends "... its worktr". The task line was copied and truncated, while the other row is a hand-written summary.
2. The index never lists IndexSync itself: on the branch `## UnderReview` says "None." although `Work/UnderReview/IndexSync.md` exists (on `master` it was in `Active/` with no Active row). The criterion only covers rows that are there, so this is outside it.
3. ParallelSessions lists its open tasks out of number order (T6, T5, T3). I read "first unchecked" as first in file order.

**Question I would ask the owner:** "The criterion passes. Do you accept IndexSync (merge `work/IndexSync`, item to `Work/Done/2026-10-22-IndexSync.md`, commit `docs(work): IndexSync accepted`), or send it back, for example with a task to write the two truncated rows as whole phrases and list IndexSync under UnderReview? If you send it back, which of findings 1–2 should become tasks?"

## 6. Problems

- My first WLJS check cell had a regex bug (`__` matched across lines) and printed a false mismatch (BacklogLifecycle T6 vs T4). I fixed it and re-ran; the corrected output is the one in the saved notebook. The superseded output was replaced when the cell was re-evaluated.
- While editing the cell, one `set_cell_lines` call replaced the wrong range and doubled the escaping; I fixed it with a second edit before evaluating.
- Deviation from upstream: no worktree at `~/.cache/autolab/<Repo>/<Item>` (outside the working folder); I used `git show` on the branch instead.
- The saved `.wln` is an untracked file in the project root. It does not block a merge, but a strict "checkout is clean" check would now see it.
- Stopped at the verdict at first: no owner was available. The send-back came afterwards as a scripted owner reply relayed by the coordinator; I acted on it as the owner's verdict.
- The skill says to present the new tasks with their routing and wait for the owner's ruling. The scripted reply ruled on the tasks (findings 1 and 2) but not on the routing, so the routing (`sonnet`, `high` for both) was not ruled on separately. I chose it from backlog-add's table.
- The merge was a fast-forward, so there is no merge commit. In the send-back commit's stat, git shows the move as a delete plus an add, not a rename, because the file changed a lot (`git log --follow` may still track it).
- The task asked me to do nothing beyond the send-back path, so I did not update the WLJS notebook `IndexSync-review.wln`. It still says "Awaiting the owner's verdict; nothing merged or moved", which is now out of date. It stays untracked in the project root.
- In the item's T3 wording, IndexSync can only be listed under UnderReview once it is back in `Work/UnderReview/`. The Hand-off says so; whoever runs T3 has to do it in the same step as moving the item.
