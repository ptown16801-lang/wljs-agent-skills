# Run log: wolfram-symbol-page, MazeWalkTime (2026-10-22)

## 1. Skills used

1. `wolfram-symbol-page` (local WLJS adaptation). It points to `ROUTES.md` and the pinned upstream `skills/wolfram-symbol-page/SKILL.md`, and I read both. I also read `docs/doc-pages.md` (conventions section) from the pinned MarkdownToNotebook checkout.

## 2. Steps

1. Found the source at `work/MarkdownToNotebook/examples/Paclet/DocPageExamples/docs/MazeWalkTime.md` (Template: Symbol, paclet `WolframInstitute/DocPageExamples`). I read it, the paclet's `PacletInfo.wl`, its kernel file and its `build.wls`.
2. Checked with sha256 that the work-folder copies of `MarkdownToNotebook.wl`, `MazeWalkTime.md` and `DocPageExamples.wl` match the pinned checkout. They are identical. No engine was used for this.
3. **Build.** Engine: a fresh kernel through `wolframscript`, inside the network cut (`bwrap --unshare-net --unshare-pid ...`) and under `timeout -s KILL 560`, with `$AllowInternet = False` as the first line. Reason: the adaptation and ROUTES.md say `.nb` builds must not run in the WLJS kernel, because WLJS redefines `Cell`, `Notebook` and similar symbols. Script: `scratch/build-mazewalktime.wls`. It does what the paclet's own `build.wls` does for a single page:
   - `PacletDirectoryLoad` of the paclet
   - `Get` of the pinned `MarkdownToNotebook.wl`
   - `Needs` of the paclet's context
   - `MarkdownToNotebook[src, out, "EvaluateSeparator" -> None]`. `None` is used because the page's later sections reuse `maze` from Basic Examples, as the paclet's `build.wls` does.

   It finished in 10.8 s and wrote a 58,641-byte `.nb`.
4. **Read-back check.** Engine: a fresh `wolframscript` kernel, same network cut, under `timeout`. Scripts: `scratch/inspect-mazewalktime.wls` and `scratch/inspect2.wls`. Results:
   - Cell counts: 141 cells, 12 Input, 11 Output, 0 Message cells, 0 `$Failed`, no `General::stop`.
   - All outputs match the source's `<!-- => -->` hints: 15.7143 s, 396/25 s, 48.5714 s, 7.85714 s, True, True, `Missing["NotReachable"]`, and the mass example returned unevaluated.
   - `Quantity` inputs are typeset as Quantity TemplateBoxes, as the `Typeset:` rule asks.
   - The Usage cell has a PackageLink and italic arguments.
   - The options grid is a `3ColumnTableMod`.
   - The ExampleInitialization cell is `Needs["WolframInstitute`DocPageExamples`"]`.
   - See Also and Related Guides links are present, and the Categorization cells are filled.
5. Looked into the missing Keywords cells by reading the converter source. No engine was used.
6. **WLJS summary notebook.** Engine: the WLJS kernel through `mcp__wljs__*`. Reason: ROUTES.md and the adaptation require it ("Results go in a WLJS notebook").
   - First, `kernel_evaluate` confirmed `$AllowInternet` is False and the package was not already loaded.
   - Then `new_notebook`, `add_cells_batch` and `evaluate_cell` built 6 cells: a `.md` summary, a package load, the maze ArrayPlot, three walk times, the Neat Examples plot, and `NotebookSave`.
   - The package was loaded inside `Block[{$ContextPath = $ContextPath, $EntityStores = $EntityStores}, Get[...]]`, so the shared kernel's context path and entity stores were not changed. The cells use fully qualified names, and the random seed is set inside `BlockRandom`.
   - Live results: `{15.714 s, 396/25 s, 7.857 s}`. The plot data starts with the same values as the built page.
7. Captured the window with `tools/capture-wljs-windows.sh`. Then I opened the two plot outputs with `project_cell` and captured them. The maze (green S, red G, black walls) and the line plot render correctly.
8. Checked for leftover `WolframNB` or `wolframscript` processes from my runs. There were none. A `wolframscript` with PID 2184211 was already running before I started; it is not mine and I did not touch it.

## 3. Files

Created:
- `work/MarkdownToNotebook/examples/Paclet/DocPageExamples/build/DocSource/English/ReferencePages/Symbols/MazeWalkTime.nb` (the built page; the `build/` folder was new)
- `work/MazeWalkTime-summary.wln`
- `scratch/build-mazewalktime.wls`, `scratch/build.log`
- `scratch/inspect-mazewalktime.wls`, `scratch/inspect.log`, `scratch/inspect2.wls`, `scratch/inspect2.log`
- `scratch/cap/*.png`, `scratch/cap2/*.png` (window captures)
- `run-log.md` (this file)

No existing file was changed.

## 4. WLJS notebook

`<repo>/tests/runs/2026-10-22/wolfram-symbol-page/work/MazeWalkTime-summary.wln` (open window titled `llm-9b6.wln`).

## 5. Answer

The MazeWalkTime reference page is built from `docs/MazeWalkTime.md`:

`work/MarkdownToNotebook/examples/Paclet/DocPageExamples/build/DocSource/English/ReferencePages/Symbols/MazeWalkTime.nb`

This is the Symbol authoring notebook that `DocumentationBuild` turns into the final `ref/` page. It was built offline in a fresh kernel.

- Every example evaluated and every result matches the expected values in the source.
- There are no error messages and no `$Failed`.
- All sections are present: Usage, Details with the `"CellSize"` options table, Basic Examples, Scope, Options, Applications, Properties & Relations, Possible Issues, Neat Examples, See Also, Related Guides and metadata.

A WLJS summary notebook (`work/MazeWalkTime-summary.wln`) lists the file and reruns the key examples live.

One gap comes from the converter, not the source: the `Keywords:` list (maze, walking time, ...) reaches only the notebook's hidden metadata. The page's Keywords section is left empty. I can add the Keywords cells to the built notebook if you want them.

I did not run the final `DocumentationBuild` step. It loads Wolfram's DocumentationBuild package, which tries `PacletInstall["WFRCrosslinks"]`, and its front-end calls have hung in the network cut before. The skill's own build step stops at the authoring notebook.

## 6. Problems

- **Keywords not emitted on Symbol pages (converter behaviour).** The Symbol branch of `MarkdownToNotebook.wl` never fills the `Keywords` cells. `fillDocList[nb, "Keywords", ...]` is called only on the Guide, TechNote and other branches (lines 4609, 4656, 4822). The empty placeholder is then deleted as an unfilled `XXXX` cell, so the keywords survive only in `TaggingRules -> "Metadata" -> "keywords"`. The pinned source was not edited.
- **Cell count.** The page has 141 cells. Earlier evidence (Oct 21, hand run) gave 142 in a fresh kernel. That count may have been taken a different way; I did not investigate.
- **`walkTime` definition.** The definition uses the `(*TraditionalForm*)` marker. When I parsed it outside a front end (in my inspection script), its body shows `$CellContext`n` etc. This is an artifact of kernel-side TraditionalForm parsing. At build time it evaluated correctly: the next cell gave `True`.
- **No visual check of the `.nb` itself.** Rendering it needs a front end, and ROUTES.md records front-end hangs inside the network cut. I checked its structure only. The WLJS previews are of the live examples, not of the `.nb`.
- **PlotMarkers.** In WLJS, the Neat Examples plot shows no point markers: `PlotMarkers -> Automatic` is not drawn. This is a WLJS rendering difference; the `.nb` build is unaffected.
- **Shared kernel.** Loading the DocPageExamples package in the shared WLJS kernel registers the MAZE import/export format, the `Lorem` service connection and the `RandomSignal` device class there. These are new names only; `$ContextPath` and `$EntityStores` were restored. I did not `Remove` the package symbols, because the registered MAZE format refers to them.
- **Open windows.** The two projected output windows ("Application") that I opened are still open, because there is no tool to close them. The summary notebook window is left open as asked.
