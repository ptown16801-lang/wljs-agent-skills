# Run log: wolfram-data-repository, 2026-10-22

## 1. Skills used

1. `wolfram-data-repository` (local WLJS adaptation). Following it, I read `ROUTES.md`, the pinned upstream `SKILL.md`, and the upstream `docs/data-repository.md` and `examples/build.wls`.

No other skill was loaded.

## 2. Steps

1. I listed `work/`. It holds `work/Data/` with two literate-Markdown Data sources: `WallpaperGroups.md` and `TPTPProblemLibrary.md`. `TPTPProblemLibrary.md` pulls in its sidecar `TPTPProblemLibrary-index.wl` through `#| file:`. The folder also holds `WallpaperGroups-out.md` and `images/`, which are a generated round-trip twin, not a source.
   - The request says "the Markdown source", singular, but there are two sources. I built both. Each build writes a new `.nb` beside its source and changes nothing else.
2. I wrote `scratch/build-one.wls`. It loads the pinned `MarkdownToNotebook.wl` and runs `MarkdownToNotebook[src, out, "EvaluateSeparator" -> None, "UseCache" -> False]`, the same separator setting the upstream `build.wls` uses. It then checks the result: cell styles, Output cells, Message cells, `General::stop`, leftover `TemplateSlot`/`MTNUnfilled`, checkbox state, and `DefaultContent` cells.
   - **Engine:** a fresh kernel via `wolframscript`, inside `bwrap --unshare-net ...`, under `timeout -s KILL 600`, with `$AllowInternet = False` as the first line. Each source ran in its own kernel, one after the other.
   - **Why:** ROUTES.md and the skill say `.nb` builds must not run in WLJS (it hangs or loses cells there).
3. First WallpaperGroups build: it succeeded with 2 messages, `CheckboxesCell::autofail` for Categories and for ContentTypes. The Categories and Content Types grids were empty, which is the known offline gap.
4. Probe (`scratch/probe-checkbox.wls`, fresh `wolframscript` in the network cut): offline, `ResourceSystemClient`Private`resourceSortingProperties[]` stays unevaluated. `DefinitionNotebookClient`CheckboxesCell` does work offline when the item list is passed explicitly with an `"Items"` key.
5. I added a session-only override to `build-one.wls`. For Data Categories and ContentTypes, `fillCheckbox` now passes `"Items"`, using the official lists given in the skill (35 categories, 10 content types). It warns if a source value is not in the list; neither source triggered the warning. The pinned converter file is unchanged.
6. I rebuilt both notebooks with the override (fresh `wolframscript`, network cut, `$AllowInternet = False`):
   - **WallpaperGroups.nb:** 0 messages, 13.8 s. 12 Input and 10 Output cells, 7 `DefaultContent` cells, 0 `TemplateSlot`, no `General::stop`. Checked boxes: Mathematics; Entity Store, Numerical Data.
   - **TPTPProblemLibrary.nb:** 0 messages, 14.2 s. 17 Input and 13 Output cells, 8 `DefaultContent` cells. The 217 KB compressed index is embedded as an initialization cell. 0 `TemplateSlot`, no `General::stop`. Checked boxes: Computer Systems, Mathematics; Numerical Data, Text.
   - No orphaned `WolframNB` was left behind.
7. I inspected the outputs (`scratch/inspect.wls` and `scratch/inspect2.wls`, fresh `wolframscript` in the network cut, reading the built `.nb`). Every value recorded in the sources (`<!-- => -->`) matches: 17, `{0,0,0,0,0,0}`, `<|0 -> 17|>`, 26264, 4565, and `<|Min -> 0., Median -> 0.18, Max -> 1., Count -> 1207|>`.
8. I ran the upstream Check, `DefinitionNotebookClient`CheckDefinitionNotebook` (`scratch/check.wls`), on copies in `scratch/check/`, so the deliverables did not get the CellID stamp and save.
   - **Engine:** fresh `wolframscript` with `UsingFrontEnd`, in the network cut, `timeout 300`. Both notebooks ran one at a time and neither hung.
   - Hints are listed under Problems.
9. I made the WLJS summary page, which the skill requires.
   - **Engine:** WLJS kernel via `mcp__wljs__*`.
   - First a `kernel_evaluate` health check: `{2, False}`.
   - Then `new_notebook`, `add_cells_batch` (12 cells) and `evaluate_cell` on every cell, `.md` cells included. The cells cover the file list and notes, plus live key examples from both sources: lookup, lattice counts, BarChart, orbifold χ, TPTP index load, status counts, rating histogram, frontier and GRP stats.
   - All live values match the built notebooks. Data symbols use the private context `wdr``.
   - I saved with `NotebookSave[EvaluationNotebook[], ".../work/DataRepositoryBuildSummary.wln"]` from a cell.
   - I checked it visually with `capture-wljs-windows.sh` (window `llm-7cf.wln`). I also projected the BarChart cell with `project_cell` (window "Application") and captured it; the chart renders.
   - Afterwards I removed `wdr`orbifoldChi`, `wdr`tptpIndex` and `wdr`wallpaperGroups` from the shared kernel with `kernel_evaluate`.
   - No WLJS call came close to 220 s.

## 3. Files

Created in `work/`:

- `work/Data/WallpaperGroups.nb`: the deliverable.
- `work/Data/TPTPProblemLibrary.nb`: the deliverable.
- `work/DataRepositoryBuildSummary.wln`: the WLJS summary page.

Created in `scratch/`:

- `build-one.wls`, `probe-checkbox.wls`, `inspect.wls`, `inspect2.wls`, `check.wls`
- `build-WallpaperGroups.log`, `build-TPTPProblemLibrary.log`
- `check/WallpaperGroups.nb` and `check/TPTPProblemLibrary.nb`: Check copies, CellID-stamped.
- `cap/`, `cap2/`: window captures.

Also this file, `run-log.md`. No source file was changed.

## 4. WLJS notebook

`<repo>/tests/runs/2026-10-22/wolfram-data-repository/work/DataRepositoryBuildSummary.wln`

## 5. Answer

I built the Data Repository definition notebooks for both Markdown sources in `work/Data/`. They are the official Data template with the docked Deploy/Submit/Check toolbar.

- **`work/Data/WallpaperGroups.nb`**
  - Content: 1 primary payload and 2 named elements (ByLattice, ByPointGroup).
  - Examples: all four example sections filled, 8 example outputs evaluated.
  - Checkboxes ticked: Mathematics; Numerical Data and Entity Store.
- **`work/Data/TPTPProblemLibrary.nb`**
  - Content: the 26,264-entry index is embedded, with 4 named elements.
  - Examples: 11 evaluated. The tptp.org fetch example is left unevaluated, as the source marks it (`eval: false`).
  - Checkboxes ticked: Mathematics and Computer Systems; Numerical Data and Text.

Both builds finished with no messages, and every expected value written in the sources matches. The build ran offline. Because the category lists normally come from Wolfram's server, I gave the converter the official lists directly so the checkboxes are filled.

Before submitting:

- **Description too long (WallpaperGroups).** The Check's only Warning is `DescriptionTooLong`: 163 characters against a limit of 128. Shorten it in `WallpaperGroups.md` and rebuild.
- **Small suggestions (TPTP).** An ASCII "..." in the text should be "…", and the word "File" should be formatted as code.
- **Category and plot suggestions (both).** The Check flags the categories as invalid, probably only because it cannot reach the category list offline; this needs an online Check to confirm. It also suggests rasterizing dynamic content in the plots.
- **Empty optional sections.** Related Resource Objects and Submission Notes are empty in both notebooks, and WallpaperGroups also has no Author Notes. That book's AI-authorship disclosure normally goes in Author Notes.

`work/DataRepositoryBuildSummary.wln` lists the files and reruns the key examples live.

Nothing was deployed or submitted; that needs your OK.

## 6. Problems

- **Which source was meant.** The request named one source and the folder has two. I built both rather than stop to ask, since each build only adds a new `.nb`.
- **Checkbox workaround.**
  - Without it, the offline build raises `CheckboxesCell::autofail` twice and leaves the Categories and Content Types grids empty. That is the result of the first WallpaperGroups build, which I then overwrote with the second.
  - The workaround uses the item lists written in the skill, sorted alphabetically. The real template may order the boxes differently, and that was not checked online.
  - The skill says "exactly these 34" categories but lists 35 names. I used all 35.
- **Check results (offline, on copies):**
  - WallpaperGroups: Warning `DescriptionTooLong {128}`; Suggestion `RasterizeDynamics` (×3, same cells); Suggestion `InvalidCategory {"Mathematics"}`.
  - TPTP: Suggestions `ThreeDotEllipsis`, `FoundUnformattedCode {"File"}`, `RasterizeDynamics` (×4), and `InvalidCategories {"Computer Systems" and "Mathematics"}`.
  - I believe the invalid-category hints come from the registry being unavailable offline, since `resourceSortingProperties[]` returns unevaluated. This is not verified.
  - I did not edit the sources to fix any hint, because those are the owner's text.
- **Not checked.** The template placeholders (`MTNUnfilled`) for the optional slots were left by design. I made no visual check of the built `.nb` in a Mathematica front end; only the WLJS summary page was looked at.
- **Projected window.** The "Application" window from `project_cell` (the BarChart) is still open on the second monitor. In that small window the legend label "mirrors" wraps and the x labels are crowded.
- **WLJS.** No hang, timeout, or message during the WLJS calls.
