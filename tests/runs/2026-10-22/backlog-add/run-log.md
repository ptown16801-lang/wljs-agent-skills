# Run log: backlog-add, 2026-10-22

## 1. Skills used

1. `backlog-add` (local WLJS adaptation, `~/.claude/skills/backlog-add/SKILL.md`), which pointed to `ROUTES.md` and the pinned upstream `backlog-add/SKILL.md` (Wolfram Institute plugin, commit 82d9e00d). Both were read in full. The upstream template `project-create/assets/work_item_template.md` was read too; the `project-create` skill itself was not loaded.

## 2. Steps

1. Read `ROUTES.md`, the upstream `backlog-add` SKILL.md and the work-item template.
2. Looked at the project: `Work/README.md`, the four existing `Backlog/` items (to match their task and routing style), `Wiki/Index.md`, `Wiki/Status.md`, the start of `Wiki/Concepts/ItemFileFormat.md`, and `Research/Artifacts/SidonBound_260821.md`, the project's earlier note on Sidon sets in Z_n (bound b(n), checked to n = 40, failures at 22, 32, 33, 34, Singer left as an unread "[lookup]"). There is no `CLAUDE.md`, so no prompt-tracking ledger and no semantic-line-break setting. I kept the one-sentence-per-line style the existing items use.
3. Upstream step 1 (Draft) says to ask for a CamelCase name and a one-line goal. No user was available, so I picked a provisional name, `SidonConstructions`, used the request itself as the goal, and listed the name as open question 5.
4. Wrote `Work/Backlog/SidonConstructions.md` from the template. It has all ten sections. The request is the first line of Prompt history, verbatim and dated. Technical details covers the requirements (cyclic setting reusing the existing note's code; Singer, Bose–Chowla, Ruzsa, transfer from a smaller modulus, greedy, exhaustive optimum), the design, edge cases and five open questions. The Tasks section holds five proposed tasks with routing annotations (T1, T2, T4 opus/xhigh; T3 sonnet/high; T5 human) and says it is not yet approved.
5. Updated the sentence in `Work/README.md` that lists the `Backlog/` items. The index tables (Active/UnderReview/Ready) were not changed, because a Backlog item does not go in them.
6. Upstream step 2 (Present and wait): stopped here. The item stays in `Backlog/`. It was not moved to `Ready/` or `Active/` and not committed. Step 3 (final task decomposition after approval) was not done; the task list is only a proposal.
7. Built the WLJS summary page that the local adaptation asks for, from a Markdown source in the scratchpad, using `python3 tools/md2wln.py` (read before running). The output has 4 input cells.

**Wolfram evaluations: none.** No engine was used, because planning a work item needs no computation. I did not time the n = 41–50 exhaustive search; that is left to T3 and listed as a risk. The small checks in the Spec (b(n) at the construction moduli, the transfer rule n ≥ 2m−1) were worked out by hand, not in a kernel.

## 3. Files

- Created: `<repo>/tests/runs/2026-10-22/backlog-add/work/project/Work/Backlog/SidonConstructions.md`
- Changed: `<repo>/tests/runs/2026-10-22/backlog-add/work/project/Work/README.md` (one sentence)
- Created: `<repo>/tests/runs/2026-10-22/backlog-add/work/project/Work/Artifacts/SidonConstructions_filed.wln` (new `Work/Artifacts/` folder)
- Created (scratch, outside the project): `<scratch>/summary.md` (source of the .wln)
- This log.

## 4. WLJS notebook

`<repo>/tests/runs/2026-10-22/backlog-add/work/project/Work/Artifacts/SidonConstructions_filed.wln`. Written by `md2wln.py` from Markdown, not saved from a live kernel, and never opened in a window.

## 5. Answer

I drafted the work item "A notebook comparing Sidon-set constructions for n up to 50" in `Work/Backlog/SidonConstructions.md` and added it to the Backlog sentence in `Work/README.md`. It builds on the project's existing Sidon note (`Research/Artifacts/SidonBound_260821.md`). The plan compares Singer, Bose–Chowla, Ruzsa, transfer from a smaller modulus, greedy, and the exact optimum against the counting bound, for Z_n with 3 ≤ n ≤ 50. The exact optimum for 41–50 is new work.

Five tasks are proposed:
- T1: read sources and state the constructions.
- T2: implement and verify them.
- T3: exact search for 41–50, with a cross-check.
- T4: build the WLJS notebook.
- T5: your review.

The item stays in Backlog until you approve the Spec and the task list. I need your answers to:

1. Setting: cyclic groups Z_n (continues the existing note), subsets of {1,…,n} (Golomb-ruler setting), or both?
2. Constructions: the six listed, or also Erdős–Turán or others?
3. May a session download a source (for example O'Bryant's Sidon-set survey on arXiv) so the constructions can be cited? Without one they can be checked by computation but not cited.
4. Form: research notebook in `Research/`, or a paper notebook under the writing guide?
5. Name: keep `SidonConstructions`?
6. Do you approve the Spec and the proposed tasks with their routing (opus/xhigh for T1, T2, T4; sonnet/high for T3)? On approval the item moves to `Ready/`, or to `Active/` if work starts right away.

## 6. Problems

- The upstream skill asks the user for the name and goal. No user was available, so the name is provisional.
- The construction moduli and sizes in the Spec (Singer n = 7, 13, 21, 31; Bose n = 3, 8, 15, 24, 48; Ruzsa n = 6, 20, 42) are from memory. The Spec marks them unverified, and T1 checks them.
- The survey suggested in open question 3 (O'Bryant's annotated bibliography) is named from memory; it was not looked up.
- How long the exhaustive search to n = 50 will take is unknown. A failing case at k = 7 has to search everything. I did not test it, to avoid tying up the shared kernel during planning.
- The `.wln` summary was not opened or screenshotted, because the ground rules forbid opening windows, so how it renders was not checked. Per ROUTES.md, md2wln.py writes the layout WLJS 3.1.4 uses.
- `Work/Artifacts/` did not exist before this run. I created it under the project's folder rule (one-offs go in `Artifacts/`). Putting the summary page there was my own choice.
- Nothing was committed. The skill does not require a commit, and none was asked for.
- No warnings or errors came up. The md2wln run printed only "wrote …".
