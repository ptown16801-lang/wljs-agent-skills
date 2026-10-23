# Run log: document-revise (2026-10-22)

## 1. Skills used
- document-revise (local WLJS adaptation; I read ROUTES.md, the pinned upstream SKILL.md and round.md, and the "Document provenance" section of project-provenance/SKILL.md, plus paper-create-notebook/fingerprint.md for the fingerprint check)

## 2. Steps
1. Found the document. The only annotated research document is `Research/Artifacts/SidonBound_260821.md`. It has two notes: L14 in the Abstract and L105 in the Outlook. The paired `SidonBound_260821.nb` has no `<< >>` notes and no `SourceLines`, though it does have a `ResearchNotebook` fingerprint. The other grep hits are skill and docs text in the plugin, not owner notes. `git status` was clean, so version 1 (notes included) was already committed in the fixture commit and no "v1 notes" commit was needed. No earlier versions and no provenance file existed.
2. Hand-edit check on the `.nb`. Ran `scratch/check_v1.wls` in a **fresh kernel (wolframscript inside bwrap --unshare-net, `$AllowInternet = False`, under timeout)**. A fresh kernel was used because ROUTES says `.nb` reading and writing must not run in the WLJS kernel, which redefines the notebook symbols. Result: all 38 recorded cell hashes match, with 0 added and 0 deleted cells, so there are no hand edits. The `.md` has no baseline because its only commit already carries the notes.
3. Checked the claim behind the N2 sentence in the **WLJS kernel via `mcp__wljs__kernel_evaluate`**, a short computation the user did not need to see. Results: `$AllowInternet` False; b(22) = 5; 5*4 = 20 <= 21; 0 of the 5985 five-element subsets of Z_22 containing 0 are Sidon; {0,1,3,7} is Sidon.
4. Wrote `SidonBound_260821_2.md` by copy then Edit, bottom-up. Changes:
   - N2: one new paragraph after the Question.
   - N1: the Abstract sentence now ends with ":" and is followed by `$$|A| \le \frac{1 + \sqrt{4n - 3}}{2}.$$`.
   `git diff --no-index` shows only these two passages, and no `<< >>` remains.
5. Wrote `SidonBound_260821_2.nb` with `scratch/build_v2.wls`, in a **fresh kernel (wolframscript in bwrap, network cut, `$AllowInternet = False`)** for the same reason as step 2. I followed upstream's "notebook without source lines" path:
   - Abstract cell 7 split into Text (7) + DisplayFormula (50) + Text (51).
   - New Text cell 52 after the Question cell (40).
   - Boxes copied from the notebook's own existing cells.
   - Exported, re-imported, fingerprint re-stamped from the round trip (the same 38 keys plus 50/51/52), exported again.
   Checks: drift after stamp {}; versus v1 only cell 7 changed and 50/51/52 are new, nothing missing; cell order correct; 0 notes left. No cells were evaluated.
6. Created `SidonBound_260821.provenance.md`. It has an empty Rules section, records the request, and has round r2 with N1, N2 and H.
7. Built a WLJS summary notebook with `mcp__wljs__new_notebook`, `add_cells_batch` and `evaluate_cell`, all in the **WLJS kernel**:
   - `.md` cells: the note table, and the two revised passages rendered.
   - One Input cell: the step-3 check, run live with the same result.
   Saved with `NotebookSave[EvaluationNotebook[], ...]`. Captured with `capture-wljs-windows.sh` and `project_cell`. The first capture showed the `|A|` pipes breaking the Markdown table, so I switched that table cell to `\lvert A\rvert`, re-evaluated and re-saved. I also separated the `$$` display with blank lines in the summary cell, because WLJS drew it inline.
8. Committed v2 with `git commit` (local only, no push): `57b80f8 docs(revise): SidonBound_260821 v2`. It stages only the `_2.md` and the provenance file, by name. Per upstream, the generated `.nb` was not committed. The summary `.wln` was not committed either.

## 3. Files
Created in `work/project/Research/Artifacts/`:
- `SidonBound_260821_2.md`
- `SidonBound_260821_2.nb`
- `SidonBound_260821.provenance.md`
- `SidonBound_260821_r2-summary.wln`

Created in `scratch/`:
- `check_v1.wls`
- `build_v2.wls`
- `cap/`, `cap2/`, `cap3/` (window captures)

Changed: the project git repo has one new local commit, 57b80f8.

Unchanged: `SidonBound_260821.md` and `SidonBound_260821.nb` (version 1).

## 4. WLJS notebook
`<repo>/tests/runs/2026-10-22/document-revise/work/project/Research/Artifacts/SidonBound_260821_r2-summary.wln` (open on the second monitor, plus two projected "Application" windows for cells 176 and 177).

## 5. Answer
Revision round r2 is done: `SidonBound_260821_2.md` and `_2.nb` are beside version 1, which is untouched.

| Note | Done |
|---|---|
| `<< state the bound as a single displayed inequality here >>` (Abstract) | The sentence now ends with a colon, followed by the display \|A\| <= (1 + sqrt(4n-3))/2. This is Thm:Bound written for a Sidon set A, since the abstract does not define s(n). |
| `<< add one sentence on what the first failure tells us >>` (Outlook) | Added after the Question: "The first failure shows that counting alone does not decide s(n): at n = 22 the 5·4 = 20 differences of a five-element set would fit among the 21 nonzero residues, yet no five-element subset of Z_22 is a Sidon set." I re-checked this in the kernel (0 of 5985 candidates). |

- No rules were added, since both notes are one-off content changes.
- No hand edits were found in the `.nb`. The `.md` had no baseline to compare against.
- No Output cells are stale, because neither change touched code.
- The provenance file now records the round.
- v2 is committed as `docs(revise): SidonBound_260821 v2`.

Your next notes go in `_2.md` (or `_2.nb`) for round 3.

## 6. Problems
- **Notes location.** The notes were in the `.md` source, not the `.nb`. Upstream's notebook path expects them in the `.nb`. I treated the `.md` as the annotated text file and carried the `.nb` along by in-place cell edits. Because it has no `SourceLines`, `_2.nb` has no line anchors, as with v1.
- **Abstract display.** "State the bound" became the real-valued inequality for |A|, matching Thm:Bound. The floor form b(n) and s(n) are both defined only later in the paper. If you want `s(n) \le \lfloor\cdot\rfloor` in the abstract, that is a note for the next round.
- **New sentence placement.** I put it as its own paragraph rather than on the Question line, so the `{#Q:Finite}` tag stays at the end of its block.
- **New `.nb` cells.** Their boxes were hand-built in the same style as the existing cells, rather than generated by MarkdownToNotebook/MathNotebookDocument, which was not used. The Abstract display uses the style "DisplayFormula", which the notebook's private stylesheet does not define, so it relies on Default.nb.
- **No visual check of `_2.nb`.** No Mathematica front end was opened, and Rasterize in a network-cut fresh kernel is known to hang. Only the structural checks were run.
- **v1 fingerprint coverage.** The v1 fingerprint covers 38 of 49 cells: grouped Input/Output cells and the Initialization section are not covered (the known level-{1} issue in fingerprint.md). I kept the same coverage plus the new cells rather than widening it.
- **Unresolved `[Eq:Bound]`.** The v1 `.nb` shows a literal "[Eq:Bound]" in the Theorem proof (an unresolved reference in v1). I left it as it was, since no note asked for a change.
- **Commit.** Committing is part of the upstream round, so I made one local commit. Nothing was pushed.
- **WLJS rendering.** The summary notebook first rendered the table badly, because of the `|` in math; this is fixed. WLJS shows `.md` cell sources above the rendered output.
