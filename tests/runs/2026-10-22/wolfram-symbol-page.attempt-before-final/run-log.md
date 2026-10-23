# Run log: wolfram-symbol-page, MazeWalkTime (2026-10-22)

## 1. Skills used

1. `wolfram-symbol-page` (local WLJS adaptation). Following its instructions I read `ROUTES.md`, the pinned upstream `SKILL.md` (`markdown-to-notebook/4d1e139.../skills/wolfram-symbol-page/SKILL.md`), and the relevant parts of the converter's `docs/doc-pages.md`.

No other skills were loaded.

## 2. Steps

1. Found the source at `work/MarkdownToNotebook/examples/Paclet/DocPageExamples/docs/MazeWalkTime.md` (Template: Symbol, Context `WolframInstitute`DocPageExamples``). Read the paclet's `README.md`, `PacletInfo.wl` and `build.wls` to see how the project builds its pages.
2. Chose the build route.
   - The upstream skill's Build step calls the cloud-deployed `ResourceFunction[...MarkdownToNotebook]`. That would contact wolframcloud.com, which the owner's rule forbids, so I did not use it.
   - I used the local converter in the work folder (`work/MarkdownToNotebook/MarkdownToNotebook.wl`, the same revision as the pinned one, 4d1e139).
   - I ran it in a **fresh kernel via `wolframscript`**, as ROUTES.md and the skill adaptation require: in the WLJS kernel, `.nb` builds lose sections. WLJS was not to be used in this run anyway.
   - I copied the project's own `build.wls` settings: load the paclet with `PacletDirectoryLoad` first, use `"EvaluateSeparator" -> None` (the page uses `maze` from Basic Examples in later sections), and write the output to `build/DocSource/English/ReferencePages/Symbols/MazeWalkTime.nb`.
   - I also set `"UseCache" -> False` so every example was evaluated fresh. I pointed the converter's example-output cache (`$cacheLocation`) at `scratch/persist`, so the shared user PersistentObjects store was not touched.
3. **Evaluation 1 (fresh kernel, `wolframscript`)**: ran `scratch/build-mazewalktime.wls`.
   - It ran inside `timeout -k 10 600 bwrap --unshare-net --unshare-pid --die-with-parent ...` with `$AllowInternet = False` as its first line.
   - It built the page and then read it back: cell counts, styles, `$Failed` count, Message cells, `General::stop`, every Output cell, and the section list.
   - Exit code 0; the conversion took 11.9 s.
4. **Evaluation 2 (fresh kernel, `wolframscript`, same network cut and `timeout 120`)**: ran `scratch/inspect.wls`.
   - It read back the Usage, See Also, Related Guides, ExampleInitialization and Categorization cells, plus sample Input cells, to check that the links and the Quantity typesetting are right.
   - Then I used grep on the `.nb` to confirm that the `(*TraditionalForm*)` definition was typeset as `FractionBox[n s, v]` in `TraditionalForm`.
5. Checked for leftover processes started from this run's scratch folder: none.

## 3. Files

Created:
- `work/MarkdownToNotebook/examples/Paclet/DocPageExamples/build/DocSource/English/ReferencePages/Symbols/MazeWalkTime.nb` (the built page, 58,641 bytes). Its directories `build/DocSource/English/ReferencePages/Symbols/` were created too.
- `scratch/build-mazewalktime.wls`
- `scratch/inspect.wls`
- `scratch/build.log`
- `scratch/persist/MarkdownToNotebook/ExampleOutput/MazeWalkTime/*` (the converter's per-cell example cache, written by the build)
- `run-log.md` (this file)

No existing file was changed. The full paths are under `<repo>/tests/runs/2026-10-22/wolfram-symbol-page/`.

## 4. WLJS notebook

None. The task rules forbid opening WLJS notebooks and calling the WLJS kernel in this run, and the deliverable is a Mathematica `.nb`.

## 5. Answer

I built the MazeWalkTime reference page from `docs/MazeWalkTime.md`:

`work/MarkdownToNotebook/examples/Paclet/DocPageExamples/build/DocSource/English/ReferencePages/Symbols/MazeWalkTime.nb`

How it was built: with the local MarkdownToNotebook converter, in a fresh offline Wolfram kernel (no network, `$AllowInternet = False`). The paclet was loaded first, so every example ran for real against `MazeWalkTime`. I did not use the cloud converter the upstream skill calls for, because it would contact Wolfram's cloud.

What I checked in the built page:
- 147 cells in total, counting nested cells and cell groups.
- 12 example inputs and 11 outputs. The one input without an output is the `walkTime` definition, which is expected.
- No `$Failed`, no message cells and no `General::stop` cell.
- Every output matches the source's expected value:
  - 15.7143 s
  - 396/25 s, exact
  - 48.5714 s
  - 7.85714 s
  - {15.7143 s, 6.28571 s}
  - True, True
  - `Missing["NotReachable"]`
  - the kilogram call left unevaluated, as the Possible Issues section says
  - the maze ArrayPlot and the Neat Examples line plot both came out as graphics
- The rest of the page is in order:
  - The Usage signature links to the paclet ref page and shows *maze* and *speed* in italics.
  - The options table is built.
  - See Also links to the system ref pages for Quantity, UnitConvert, GraphDistance and FindShortestPath.
  - Related Guides links to `paclet:WolframInstitute/DocPageExamples/guide/DocPageExamples`.
  - The initialization cell is `Needs["WolframInstitute`DocPageExamples`"]`.
  - Quantities in the inputs are typeset in StandardForm, as the `Typeset:` rule asks.
  - The `walkTime` definition is typeset as a fraction in TraditionalForm.

This is the authoring (DocSource) notebook. To turn it into the final installed doc page with the navigation and search index, run `DocumentationBuild` (as the project's `build.wls` does for the whole paclet). I did not run that step. It needs a front end, which has hung in offline runs, and it loads a package that tries to install `WFRCrosslinks`. Tell me if you want it run.

## 6. Problems

- None of the evaluations failed or printed a warning or message.
- The upstream skill's Build step (`ResourceFunction` from wolframcloud.com) was replaced with the local converter, because of the no-Wolfram-servers rule.
- The upstream doc-pages guide says to avoid `EvaluateSeparator -> None`. I used it anyway because the page depends on it: `maze` is defined once in Basic Examples and used in later sections, and the project's own `build.wls` uses `None`.
- Not done: a visual check of the rendered page. That would need a front end (rasterizing or opening the notebook), and ROUTES.md reports front-end hangs inside the network cut. Everything was checked from the notebook expression only.
- Not done: `DocumentationBuild` (see Answer).
- The cell count (147) is not comparable to the earlier test records (141/142 cells): those used a different counting method. My count is every `Cell[_, __]` at any depth, including CellGroupData wrappers.
- Every Input cell has `CellLabel -> "In[1]:= "`. That is how the converter writes them. I did not investigate whether `DocumentationBuild` normalises it.
