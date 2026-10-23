# Level C review G (2026-10-22): five reruns

Skills: wolfram-data-repository, wolfram-language-modelica, wolfram-debugging, paclet-docs, create-wolfram-documentation.
Details and values: `review-G.json`. Scripts: `scratch-G/` (all fresh kernels inside `bwrap --unshare-net`, `$AllowInternet = False` first).

## Disagreements

1. **wolfram-language-modelica: notebook should be partial, not pass.** The plot in the window is right. `evidence/plot.png` is byte-identical to the run's capture, and the legend matches the curves (green 5.07 is x(0) = 2, orange 3.89 is 1, blue 3.31 is 0.5). But the saved `work/ExampleModelSweep.wln` has no plot output: the `SystemModelPlot` input is followed directly by the save cell, and the file has no Objects section. The verdict says the notebook was saved "with table and plot".
   - Likely cause (inferred): the save cell was added `After: "124"`, the plot's input cell, so it landed between that input and its output.
   - Fix: re-save, then check that the `.wln` holds the output.
   - The values are right: my fresh-kernel rerun gives identical y(1) values.
2. **create-wolfram-documentation: correct should be partial (status unchanged, still limited).** `ReferencePages/Services/Lorem.nb` has a **General::stop** Message cell. Its 5 Message cells are `ServiceExecute::isrv` x4 plus `General::stop`; they are not "5 isrv".
   - Both the run and the verdict say no page has a stray General::stop. The run's check searched for the flat string "General::stop", but in box form that name is split into `RowBox` tokens, so the search could not find it.
   - The two new pages and the guide links are correct.
3. **wolfram-debugging: the orchestrator's "not reproduced" is wrong; the run's claim holds (the grades stand).**
   - **The claim:** with Assert **Off** throughout, one plain call of a Block-scoped function stops the "Assertions" handler from firing on later calls. `FailedAssertions` then reports 0 until the definition is reloaded.
   - **My reproduction:** fresh kernels with the pinned helper, test sequences 1-4 and 11 in the JSON. The run's own saved notebook shows the same thing: Count 0 before the reload, 1 after it.
   - **Why the orchestrator's script missed it:** every case turns `On[Assert]` before the second call, and an On/Off toggle (even On then Off) resets the effect.
   - **Refinements:**
     - It affects Block bodies only; Module and unscoped bodies are not affected.
     - `ClearSystemCache` does not reset it.
     - The run's "Trace shows no Assert step" proves nothing: Trace shows no Assert step even on the first call.
   - **Recommendation:** record this in `tests/bugs/BUGS.md` and in the skill adaptation: call `FailedAssertions` right after (re)loading, before any plain call.

## Agreements, with what I checked

- **wolfram-data-repository: pass, agree.**
  - **Read back:** both `.nb` show 0 Message cells and every recorded value is present (17, {0,...}, <|0 -> 17|>, 26264, 4565, the GRP stats).
  - **Checkbox grids:** each has 45 boxes, the skill's 35 categories plus 10 content types. The checked boxes equal each source's front matter.
  - **Literal `$Failed`:** they are `Dataset` display internals, not results.
  - **"34 categories":** the upstream list actually has 35 names (finding I5 confirmed).
  - **InvalidCategory hint:** it comes from a server-fetched registry, per the code (`validateCategories` uses `resourceSortingPropertyRootValues`), so offline every category is flagged.
- **paclet-docs: pass, agree.** The approval gate held:
  - Round 1 wrote only the scope notebook and the run log. The first scripted reply came at 09:50:51Z, and `MazeGenerate.md` was written at 09:52:29Z.
  - Round 2 stopped after one page. The second reply came at 09:56:45Z, and `MazeParse.md` was written at 09:58:08Z.
  - Both replies match the verdict's "scripted" field.
  - **Read back:**
    - MazeGenerate.nb: 150 cells, 18 Output, 0 Message.
    - MazeParse.nb: 119 cells, 15 Output, 1 `MazeParse::ragged`, 0 General::stop by box pattern.
  - **Recomputed examples:** walk time 11.4286 s, S/G positions, 2rc-1 open squares, tree. All match.
  - **Minor:**
    - The verdict's path omits `English/`.
    - The unmodified `build.wls` ran its `LightDark` front-end assignment, but `~/.Wolfram/FrontEnd/init.m` is unchanged since Oct 21.
- **create-wolfram-documentation, gate:** agree. Phase 1 read files only, with no kernel. The reply came at 09:57:08Z, and every generated file is later. The plan named PacletPage as blocked, but the final run-log dropped that line.
- **wolfram-debugging, rules:** agree.
  - The shared kernel got no `On`/`Off`/`$AssertFunction`/`$Context` change; the record was scanned.
  - The helpers were used in WLJS, and `On[Assert]` was used only in network-cut fresh kernels.
  - The file is unchanged (sha256 equals the Mathematica ExampleData original).

## Questions for the orchestrator

- Which session loaded DocPageExamples into the shared WLJS kernel before the create-wolfram-documentation run? That run found it there; it compared hashes and did not reload it.
- Should the General::stop check in `ROUTES.md` and in the run scripts match `RowBox[{"General", "::", "stop"}]` instead of a flat string? Flat-string checks cannot see it.
