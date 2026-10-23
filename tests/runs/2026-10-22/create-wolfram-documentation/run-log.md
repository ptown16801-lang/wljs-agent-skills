# Run log: create-wolfram-documentation, "Set up documentation for the DocPageExamples paclet"

Date: 2026-10-22. Two phases.
- **Phase 1:** survey and plan, then stop for confirmation, as the local skill requires.
- **Phase 2:** after the scripted user reply ("1) just the two new symbol pages plus the guide update; 2) building into the paclet's own folder is fine; 3) accept the Lorem failures and note them; 4) accept the missing WFRCrosslinks, keep the network cut; 5) nothing deployed or published. Go ahead"), the work itself.

## 1. Skills used

1. `create-wolfram-documentation` (local adaptation, then `ROUTES.md` and the pinned upstream SKILL.md)
2. `wolfram-symbol-page` (local adaptation, then the pinned upstream SKILL.md, `docs/doc-pages.md` and `docs/examples.md`)
3. `wolfram-guide-page` (local adaptation, then the pinned upstream SKILL.md)

## 2. Steps

### Phase 1: survey (read-only, no Wolfram evaluation)

- Read `ROUTES.md` and the pinned upstream skill. Surveyed `work/MarkdownToNotebook/examples/Paclet/DocPageExamples/`: `PacletInfo.wl`, `Kernel/DocPageExamples.wl`, `docs/*.md`, `ResourceDefinition.md`, `build.wls`, `deploy.wls`, `.gitignore`.
- Findings:
  - The paclet exports 3 symbols. The guide and 11 other pages already had markdown sources, and there were no `.nb` docs, so the backup and port steps (workflow steps 3 and 4) were no-ops.
  - Gap: `MazeGenerate` and `MazeParse` had no symbol pages.
- Wrote the plan and five questions, then stopped.

### Phase 2: work

1. **Probed the two functions' behaviour.** Engine: a fresh kernel (`wolframscript` under `bwrap --unshare-net`, `$AllowInternet = False`, `timeout 120`). Script `scratch/probe.wl`. Why: real outputs for the expected-result hints, without loading the paclet into the shared WLJS kernel.
   - Found two edge cases, now documented as Possible Issues:
     - `MazeGenerate[{1, 1}]` shows only `"G"`, because the goal overwrites the start in a 1-cell maze.
     - `MazeParse` cuts a line longer than the first line to the first line's width, and its `::ragged` message then names line 1 as the "shorter" one.
2. **Wrote `docs/MazeGenerate.md` and `docs/MazeParse.md`** following `wolfram-symbol-page` and `doc-pages.md`: Usage in the `<code>[Sym]()[*args*]</code>` form, Details, one captioned demonstration per cell, `---` between siblings, `<!-- => -->` hints taken from the probe, no `Needs`.
3. **Updated the guide `docs/DocPageExamples.md`.** Changed the two plain-text items to `` `MazeGenerate` `` and `` `MazeParse` `` chips, the form `wolfram-guide-page` specifies, so they link to the new pages.
4. **Built the authoring notebooks.** Engine: a fresh kernel per page (`wolframscript` in the network cut, `$AllowInternet = False`, `timeout 300`), run sequentially, through `scratch/build-page.wl`.
   - Why a fresh kernel: ROUTES.md says `.nb` builds belong in a fresh kernel, not WLJS.
   - Why one page per kernel: the paclet's `build.wls` converts every page twice in one evaluation, and the `MazeParse::ragged` messages from the ragged page and the new MazeParse page would add up to a `General::stop`.
   - The script replicates `build.wls`'s output paths and `"EvaluateSeparator" -> None`.
   - It drops `build.wls`'s `CurrentValue[$FrontEnd, LightDark] = "Light"`, which writes a front-end preference.
   - It passes `"UseCache" -> False` and points the converter's example cache (`$cacheLocation`) at `scratch/example-cache`.
   - Result: all 14 pages converted in 4.6–14.2 s each, with no kernel messages.
5. **Built `ResourceDefinition.nb`.** Engine: a fresh kernel, `wolframscript` in the network cut (`scratch/build-rd.wl`), `"EvaluateSeparator" -> Automatic` as in `build.wls`. One message: `CheckboxesCell::autofail` (Categories checkbox for the Paclet type).
6. **Ran `DocumentationBuild`.** Engine: a fresh kernel, `wolframscript` in the network cut (`scratch/build-docbuild.wl`, the same call as `build.wls`), with `timeout 600`.
   - Run 1 (217 s): `Failure`, "92.8571% (13/14) of files were processed successfully". The guide was missing and there was no SearchIndex. No page-specific message; earlier test runs saw the same intermittent drop.
   - Following ROUTES.md (one retry is reasonable), I retried once.
   - Run 2 (59.5 s): `Success`, 14 notebooks plus Index, SearchIndex and SpellIndex.
7. **Checked the pages.** Engine: a fresh kernel, `wolframscript` in the network cut (`scratch/inspect*.wl`), reading both `build/DocSource` and the final `DocPageExamples/Documentation`.
   - No `General::stop` cell on any of the 14 pages, in either tree.
   - Message cells: MazeParse 2 (intended), MazeParse::ragged 2 (intended), Lorem 5 (`ServiceExecute::isrv`, accepted); none elsewhere.
   - MazeGenerate: 11 outputs; MazeParse: 10 outputs. Every output matches the probe and the hints, for example `{9, 15}`, `True` x3, `10 s`, `2 s`, and the unevaluated `MazeGenerate[{0, 3}]` and `MazeParse["#S.G#"]`.
   - The guide now links `paclet:WolframInstitute/DocPageExamples/ref/MazeGenerate`, `.../MazeParse` and `.../MazeWalkTime`.
   - Each final page holds one or more literal `$Failed` symbols. In the authoring notebooks, `WallpaperGroup` and `FilterADataset` hold them inside `Dataset` display boxes (a `TypeSystem` internal), not as results. I did not trace the copy that `DocumentationBuild` adds to every final page.
8. **Made the WLJS summary notebook.** Engine: WLJS kernel via `mcp__wljs__*`. Why: ROUTES.md says results go in a WLJS notebook.
   - First checked through `mcp__wljs__kernel_evaluate` that the shared kernel already had the paclet loaded by another session, with definitions identical to this folder's source. The `Hash` of the DownValues of all 3 symbols equals a fresh-kernel load of `work/.../Kernel/DocPageExamples.wl`. So I did not reload it.
   - The notebook's load cell only calls `Get` when the package is absent.
   - Example cells use `BlockRandom` so they leave the shared kernel's random state alone.
   - Created with `new_notebook`, added 17 cells with `add_cells_batch`, evaluated each with `evaluate_cell` (the `.md` cells too), and saved with `NotebookSave[EvaluationNotebook[], ".../work/DocPageExamples-docs.wln"]`.
   - Outputs: the Grid, the ArrayPlot, `True`, the ragged message plus the padded Grid, `Quantity[2, "Seconds"]`, and the path plot.
   - Checked visually with `tools/capture-wljs-windows.sh` (top of the notebook) and with `mcp__wljs__project_cell` on the Neat Example cell. The projected "Application" window shows the maze with the orange start-to-goal path.

## 3. Files

Created or changed in the paclet (`work/MarkdownToNotebook/examples/Paclet/DocPageExamples/`):
- Created: `docs/MazeGenerate.md`, `docs/MazeParse.md`
- Changed: `docs/DocPageExamples.md` (2 lines in "Symbols": plain text changed to linked `` `MazeGenerate` `` and `` `MazeParse` ``)
- Generated (gitignored build output):
  - `build/DocSource/English/**` (14 authoring `.nb`)
  - `DocPageExamples/Documentation/English/**` (14 `.nb` plus `Index/`, `SearchIndex/`, `SpellIndex/`)
  - `DocPageExamples/ResourceDefinition.nb`

Other:
- Created: `work/DocPageExamples-docs.wln` (the WLJS summary notebook)
- Changed: `run-log.md` (this file)
- Scratch (`scratch/`):
  - Scripts: `probe.wl`, `build-page.wl`, `build-rd.wl`, `build-docbuild.wl`, `inspect.wl`, `inspect2.wl`, `inspect3.wl`, `inspect-final.wl`, `hash.wl`
  - Logs: `log-*.txt`, `src.lst`, `dst.lst`
  - Captures: `cap/`, `cap2/`
  - Probe output and cache: `t.maze` (probe), `example-cache/`
- Outside the working folder (unintended): the first `MazeGenerate` build wrote example-cache entries into the shared MarkdownToNotebook cache, `~/.Wolfram/Objects/Persistence/MarkdownToNotebook/ExampleOutput/MazeGenerate/`. My first redirect, setting `$LocalBase`, had no effect. Every later build used `scratch/example-cache`. I left those entries in place: they belong to a shared cache that other sessions also write, and deleting them was not asked for.

## 4. WLJS notebook

`<repo>/tests/runs/2026-10-22/create-wolfram-documentation/work/DocPageExamples-docs.wln`

It holds:
- A summary `.md` cell: the built files, the checks and the accepted limitations.
- The load cell.
- Live MazeGenerate and MazeParse examples, including the Neat Example path plot.
- The save cell.

It is left open, along with one projected "Application" window for the path plot. I closed nothing.

## 5. Answer

I added DocPageExamples' two missing reference pages, `docs/MazeGenerate.md` and `docs/MazeParse.md`, and linked both from the guide. I then built all 14 documentation pages and `ResourceDefinition.nb` offline, in the paclet's own folder.

- **Built:** 14 pages in `DocPageExamples/Documentation/English/`, plus the Index, SearchIndex and SpellIndex. The authoring notebooks are in `build/DocSource/English/`, and `DocPageExamples/ResourceDefinition.nb` is built too.
- **Checks:** no page has a stray `General::stop` cell. Every example on the two new pages evaluated, and the results match the expected values.
- **New pages:** each covers Usage, Details, Basic Examples, Scope, Properties & Relations and Possible Issues; MazeGenerate also has a Neat Example. They also document two real quirks:
  - A 1x1 maze shows only `G`.
  - `MazeParse` cuts a line that is longer than the first line, and its message then names line 1.
- **Lorem page:** as agreed, it shows 5 `ServiceExecute::isrv` failures instead of placeholder text.
- **Missing WFRCrosslinks:** links to the system documentation may be missing.
- **Search index:** it may have fewer entries, because `EntityValue` lookups could not run offline.
- **Retry:** the first documentation build dropped the guide; one retry built everything.
- **Not deployed:** nothing was deployed, published or submitted.
- **WLJS summary:** `work/DocPageExamples-docs.wln` lists the built files and runs the key examples live.

## 6. Problems

- **The first `DocumentationBuild` failed** (13/14, guide missing, no SearchIndex) with no page-specific message. A single retry succeeded. The cause is not established; earlier test runs saw the same intermittent drop.
- **Offline messages, all expected:**
  - `PacletInstall::notavail` for WFRCrosslinks, followed by `Get::noopen` and `Needs::nocont` (the missing paclet, accepted).
  - `EntityValue::conopen` and `EntityValue::nodat`, plus the `WolframLanguageData`/`KeyTake`/`Lookup` messages that follow from them, in the search-index step.
  - `Localized::nokey` for the non-symbol page types (run 1).
  - About 2200 lines of `autorelease() called with no AutoreleasePool` noise in run 2.
  - None of these blocked the build.
- **`ResourceDefinition.nb`:** `CheckboxesCell::autofail` for the Paclet Categories property. Not investigated, since it only matters for submission, which was not requested.
- **`$Failed` symbols:** every final page holds at least one literal `$Failed`, and the authoring notebooks of `WallpaperGroup` and `FilterADataset` hold them too. In those two authoring notebooks they sit inside `Dataset` display boxes; I judged these harmless but did not trace the copy that `DocumentationBuild` adds to every final page.
- **Deviation from `build.wls`:** I did not run the paclet's `build.wls` as-is. I ran the same steps through scratch scripts, one fresh kernel per page, to avoid `General::stop` accumulation across its double conversion, the LightDark preference write and the shared example cache. The user approved this "safer variant" as part of the plan.
- **Example cache:** the first MazeGenerate build wrote entries into the shared `~/.Wolfram/Objects/Persistence/MarkdownToNotebook` cache before the redirect worked (see Files).
- **Visual check of the built Mathematica `.nb` pages: not done.** Rasterizing them needs the front end inside the network cut, which has hung before (ROUTES.md), and opening them in WLJS would convert them in place. They were checked structurally (cell styles, messages, outputs, links). The examples were checked visually in the WLJS notebook.
- **Possible paclet bug:** `MazeParse`'s handling of over-long lines (silent truncation, and a misleading line number in `::ragged`) looks like a bug in the paclet code. I documented it as a Possible Issue and did not change the code, because that was outside the agreed scope.
- **Process found:** a `wolframscript` process (pid 2184211, started 05:25, before this run) is still running. It is not mine, so I left it alone. Every process I started has exited.
