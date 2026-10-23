# Level C review, reviewer E (4 reruns), 2026-10-22

This review covers four reruns of skills whose first attempts were overturned by reviewer B. All four reruns fix the problem B found. Two of them still get check grades that I dispute: both skipped the skill's "confirm before generating" approval step.

Details for each skill are in `review-E.json`. Scripts and outputs are in `scratch-E/`:
- `static.wls` / `static.out`: reads every built page;
- `evalpage.wls` / `eval.out`: re-evaluates every page input with the paclet loaded;
- `resolve.wls`: checks that the doc links resolve;
- `calls.py`: lists the tool calls in a session record.

Every Wolfram check ran in a fresh kernel inside `bwrap --unshare-net`, with `$AllowInternet = False` set first.

## Disagreements (3 checks on 2 skills)

1. **create-wolfram-documentation, rules: partial (the orchestrator gave an implicit pass).**
   - The upstream skill says: "Confirm the plan with the user before generating files."
   - The run prompt says to stop at an approval point and write the question down.
   - The rerun did not stop. Its log says "No one was available, so I went ahead".
   - Without approval it wrote two new pages and edited the author's `docs/DocPageExamples.md`, `docs/MazeWalkTime.md` and `README.md`. It also wrote `Documentation/` into the paclet folder.
   - Attempt 1 stopped at this point, and these are exactly the items its scripted user approved.
   - The session record has no reply from a user or the coordinator after the prompt.
2. **create-wolfram-documentation, notebook: fail (the orchestrator gave partial).**
   - There is no WLJS summary page, and the log's section 4 says only "None." with no reason.
   - ROUTES.md "Results go in a WLJS notebook", which the run read, already required a summary page. The prompt also names `md2wln.py`.
   - simulate-modelica was graded fail (accepted) in the same situation.
   - Attempt 1 had made one (`docs-setup-summary-2.wln`).
3. **paclet-docs, rules: partial (the orchestrator gave an implicit pass, and put the issue under clean).**
   - The upstream step 1 says to "stop and get agreement" on the symbols and sections, then approve one page before the rest.
   - The rerun skipped both steps on its own judgment. It said so in its log.
   - The prompt requires stopping at that point. Attempt 1 did stop, and Level C credited it for that.
   - This is an approval-gate matter, so it belongs under rules.

The correct grades for both skills stand: the rerun fixes the earlier finding (see the table below).

## Agreed, with what I checked

| Skill | Earlier finding fixed? | What I checked |
|---|---|---|
| wolfram-notebooks | Yes: `work/summary.wln` exists. | It regenerates byte-identically from `summary.md`. `document.nb` styles: Section 4, Subsection 1, Text 3, Input 7, Output 7. FrontEndVersion is 14.3 Windows. `notes.nb` cells are Title / Text / Input / Text, with no `$Failed`. Collatz length is 112. `document.nb`'s sha256 equals ExampleData's. |
| wolfram-symbol-page | Yes: no kill, pkill, killall or TaskStop among its 19 calls; only a pgrep scoped to its own scratch folder. | Its example cache went to `scratch/persist`: no MazeWalkTime entries in the shared store after 01:58. Page: In 12, Out 11, 0 messages, no `$Failed`. Re-evaluated: 10 of 10 comparable outputs match. The one mismatch is my harness's `$CellContext` artifact, not the page. Notebook partial stands: the reason given was wrong, since `md2wln.py` was allowed. |
| create-wolfram-documentation (correct, clean) | Yes: the built MazeParse page has exactly 2 `MazeParse::ragged` Message cells and no `General::stop`, in DocSource and in Documentation. | Fresh re-evaluation: MazeGenerate 15/15 outputs match, MazeParse 10/10, and the same two messages appear. 14 pages are built, plus Index, SearchIndex and SpellIndex. The guide links all three ref pages. The backups match upstream byte for byte. Lorem keeps 4 `isrv` messages and 1 `General::stop` (rule 0): clean partial stands. |
| paclet-docs (correct, notebook, clean) | Yes: `Documentation/English/ReferencePages/Symbols/MazeGenerate.nb` and `MazeParse.nb` exist. | `Documentation`ResolveLink` resolves all 3 ref URIs to them. Re-evaluated: 15/15 and 12/12 outputs match. No `(*BB[*`; `$Failed` appears only in CitationPopupData. The guide is unchanged from upstream. `init.m` md5 is unchanged. The summary `.wln` regenerates byte-identically. The author's `ragged.nb` `General::stop` keeps clean at partial. |

## Notes and questions for the owner

- **The approval gate cuts both ways.** In attempt 1, the runs that obeyed "stop and ask" needed a scripted reply before they could finish. The reruns produced the full result only by skipping the gate. Decide which behaviour the cards expect. If proceeding with an obvious, reversible scope is acceptable in no-user runs, say so in the prompt. Otherwise both reruns should be re-run with a scripted approval.
- **The status labels need revisiting.** create-wolfram-documentation and paclet-docs are recorded as "limited", which the rubric defines as "passes except for an external gap". A rules partial (skipped gate) and a notebook fail (no page, no reason) are not external gaps.
- **The shared cache was still written.** paclet-docs ran `build.wls` unmodified, so it still wrote the shared example cache (`~/.Wolfram/Objects/Persistence/MarkdownToNotebook/ExampleOutput`: MazeGenerate and MazeParse at 03:02, MazeParse__ragged at 03:17). It disclosed this. The other two MarkdownToNotebook reruns redirected the cache to their scratch folders.
- **Small log errors.** wolfram-notebooks says the rules forbade every `mcp__wljs__*` call, but only opening notebooks was forbidden. wolfram-symbol-page says the rules forbade calling the WLJS kernel, which they did not. Neither changes a grade beyond what is recorded above.
