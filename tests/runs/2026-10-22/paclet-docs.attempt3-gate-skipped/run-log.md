# Run log: paclet-docs, "Document the exported functions of DocPageExamples as reference pages" (2026-10-22)

## 1. Skills used

1. `paclet-docs` (local WLJS adaptation; read ROUTES.md and the pinned upstream `paclet-docs/SKILL.md`, plus the *Docs-resolution check* section of upstream `paclet-build/SKILL.md`)
2. `wolfram-symbol-page` (local WLJS adaptation; read the pinned upstream SKILL.md and the paclet copy of `MarkdownToNotebook/docs/doc-pages.md` for the page conventions)

## 2. Steps

1. **Found the paclet**: `work/MarkdownToNotebook/examples/Paclet/DocPageExamples/` (paclet dir `DocPageExamples/`, `PacletInfo.wl`). It builds its documentation from Markdown (`docs/*.md` + `build.wls` → `build/DocSource` → `DocumentationBuild` → `DocPageExamples/Documentation/`), so I used that route. I did not use `CreateSymbolDoc`.
2. **Scope**: I took the exported symbols from the `"Symbols"` list of the `Kernel` extension in `PacletInfo.wl`: `MazeGenerate`, `MazeParse`, `MazeWalkTime`. `docs/MazeWalkTime.md` already existed, so I wrote pages for the other two. Upstream asks you to agree the list with the author and get one page's layout approved before writing the rest. No user was available, and the request named the scope ("the exported functions"), so I went ahead. I followed the layout of the existing MazeWalkTime page and left both pages open to revision.
3. **Checked behaviour before writing any examples.** Engine: fresh kernel, `wolframscript` inside `bwrap --unshare-net`, `$AllowInternet = False` first, under `timeout` (`scratch/probe.wls`, `scratch/probe2.wls`). Why: loading the paclet registers a format, a service, a device class and an entity store, and I did not want to do that blindly in the shared WLJS kernel. A fresh kernel is also what the doc build uses. Findings that went into the pages:
   - `MazeGenerate[{1,1}]` has no `"S"` because the goal overwrites the start, so `MazeWalkTime` gives `Missing["NotReachable"]`.
   - Arguments that are not positive integers leave the call unevaluated.
   - A maze of r×c cells has 2rc−1 open squares, and its open squares form a tree.
   - `MazeParse` cuts lines longer than the first line, and its message then names line 1.
   - `MazeParse` leaves a single string unevaluated.
   - Round trips through `MazeParse` and the `"MAZE"` format both work.
4. **Wrote** `docs/MazeGenerate.md` and `docs/MazeParse.md` (Template: Symbol). Each has Usage, Details & Options, Basic Examples, Scope, Applications, Properties and Relations, and Possible Issues. MazeGenerate also has Neat Examples. Frontmatter includes Keywords, SeeAlso and `RelatedGuides: [DocPageExamples]`.
5. **Built** with the paclet's own `build.wls`. Engine: fresh kernel, `wolframscript` in the network cut, with a wrapper `scratch/runbuild.wls` that sets `$AllowInternet = False` and then `Get`s `build.wls`. Run 1 (about 4 min, exit 0):
   - The built MazeParse page had a stray `General::stop` message cell. MarkdownToNotebook evaluates the whole page in one session and `build.wls` converts each page twice.
   - The Guides folder of `Documentation/` came out empty. The guide was in `build/DocSource` but not in the built tree, and the log of run 1 holds only the first few lines (WFRCrosslinks messages). Cause not established.
   - Fix: I wrapped the second unquieted `MazeParse::ragged` example (Possible Issues) in `Quiet[..., MazeParse::ragged]`, so the page shows that message only once, in Basic Examples.
   - Run 2 (exit 0): built 14 documentation notebooks plus Index and SearchIndex, this time including `Guides/DocPageExamples.nb`.
6. **Checked the built pages** in a fresh kernel with network cut (`scratch/check.wls`, `outs.wls`, `resolve.wls`):
   - MazeGenerate: 127 cells, 15 example outputs, 0 message cells.
   - MazeParse: 101 cells, 11 outputs, 1 message cell (the intended `MazeParse::ragged`), no `General::stop`.
   - MazeWalkTime: 118 cells, 11 outputs, 0 messages.
   - No WLJS `(*BB[*)` markup on any page. Each page has exactly one `$Failed`, which is `CitationPopupData -> $Failed` in the page metadata (offline build).
   - Every output matches the values from step 3 (for example `{7, 9}`, `7.14286 s`, `Missing["NotReachable"]`, `True` ×4, `4.28571 s`).
   - Links in the pages go to the paclet URIs for paclet symbols and to `paclet:ref/...` for System symbols.
   - With `PacletDirectoryLoad` of the paclet folder and `PacletDataRebuild[]`, `Documentation`ResolveLink` returns an existing file for all 6 URIs: guide/DocPageExamples, ref/MazeGenerate, ref/MazeParse, ref/MazeWalkTime, ref/message/MazeParse/ragged, ref/program/mazegen.
   - I left no `WolframNB` processes behind.
7. **WLJS summary notebook.** Engine: WLJS kernel via `mcp__wljs__*`, because the owner should see the result.
   - `new_notebook`, then a `.md` cell summarising the pages, then three live example cells: a seeded MazeGenerate ArrayPlot, MazeWalkTime of a generated maze, and MazeParse of a ragged maze (shows the message).
   - All cells evaluated, then saved with `NotebookSave[EvaluationNotebook[], ...]`.
   - I captured the window and checked it. I projected the plot cell into its own window and checked it too: the maze draws correctly, with the green start and red goal.
   - A `kernel_evaluate` at the start confirmed that `$AllowInternet` is False in the WLJS kernel.

## 3. Files

Created:
- `work/MarkdownToNotebook/examples/Paclet/DocPageExamples/docs/MazeGenerate.md`
- `work/MarkdownToNotebook/examples/Paclet/DocPageExamples/docs/MazeParse.md`
- `work/DocPageExamples-ReferencePages.wln`
- Build outputs, all gitignored and regenerated by `build.wls`:
  - `work/MarkdownToNotebook/examples/Paclet/DocPageExamples/build/DocSource/**` (14 authoring notebooks)
  - `work/MarkdownToNotebook/examples/Paclet/DocPageExamples/DocPageExamples/Documentation/**` (14 pages + Index/SearchIndex/SpellIndex), including `ReferencePages/Symbols/MazeGenerate.nb`, `MazeParse.nb` and `MazeWalkTime.nb`
  - `work/MarkdownToNotebook/examples/Paclet/DocPageExamples/DocPageExamples/ResourceDefinition.nb` (`build.wls` always builds it)
- Scratch: `scratch/probe.wls`, `probe2.wls`, `msgtest.wls`, `runbuild.wls`, `check.wls`, `seq.wls`, `outs.wls`, `resolve.wls`, `build.log`, `build1.log`, `cap/`, `cap2/`
- This log: `run-log.md`

Written outside the working folder by the tools, not by me directly:
- The MarkdownToNotebook evaluation cache in `~/.Wolfram/Objects/Persistence/MarkdownToNotebook/ExampleOutput/{MazeGenerate,MazeParse,MazeParse__ragged,...}`
- Paclet manager and front end cache files in `~/.Wolfram/` (normal kernel/front end bookkeeping)

Not changed: `PacletInfo.wl` (it already declares the `Documentation` extension), the kernel code, `build.wls`, `docs/MazeWalkTime.md` and the guide `docs/DocPageExamples.md`.

## 4. WLJS notebook

`<repo>/tests/runs/2026-10-22/paclet-docs/work/DocPageExamples-ReferencePages.wln` (left open, plus one projected "Application" window of the maze plot that I opened).

## 5. Answer

The paclet exports three functions: MazeGenerate, MazeParse and MazeWalkTime. MazeWalkTime already had a reference page source, so I wrote the two that were missing:

- `docs/MazeGenerate.md` → `DocPageExamples/Documentation/English/ReferencePages/Symbols/MazeGenerate.nb`
  - Sections: Usage, Details & Options, Basic Examples, Scope, Applications, Properties and Relations, Possible Issues, Neat Examples.
  - 15 example outputs, all evaluated.
- `docs/MazeParse.md` → `.../Symbols/MazeParse.nb`
  - Sections: the same, without Neat Examples.
  - 11 example outputs, plus the `MazeParse::ragged` message, shown once on purpose.

I built them with the paclet's own `build.wls` in an offline fresh kernel, and the whole documentation tree was rebuilt.

**Checks:**
- Every example output matches what the functions return.
- No error or stray `General::stop` cells.
- With the paclet folder loaded, all 6 `paclet:` links the new pages use resolve to existing files.

**Things you may want to change, all in the existing material:**
- `MazeGenerate[{1,1}]` produces a maze with no start, because the goal overwrites it.
- `MazeParse` silently cuts lines longer than the first line. Its `::ragged` message then says "Line 1 is shorter", which is misleading.

  Both pages document these under Possible Issues instead of changing the code.
- The guide `docs/DocPageExamples.md` lists MazeGenerate and MazeParse as plain text, and MazeWalkTime in backticks, rather than as links to the new pages. I left the guide alone because the skill treats guide pages as the author's to write.
- `docs/MazeWalkTime.md` mentions MazeGenerate and MazeParse in backticks. Those could now be links.

**Still outstanding:**
- Check the page layout before treating it as final (the skill's one-page-first review).
- Press F1 on MazeGenerate in Mathematica and search the Documentation Center for it. This cannot be checked headlessly.
- A resolution check from an *installed* paclet, which needs your OK to install.
- Nothing was published.

## 6. Problems

- **Stray `General::stop` (fixed).** The first build put a stray `General::stop` cell on the MazeParse page. I fixed it by quieting the second `MazeParse::ragged` example. The counting mechanism is not fully understood:
  - In a test, quieted messages did not count towards the limit.
  - `build.wls` converts each page twice in one kernel.
  - The MarkdownToNotebook evaluation cache in `~/.Wolfram/Objects/Persistence` is shared with other sessions and may also play a part.
- **Run 1 dropped the guide; cause unknown.** Run 1's built tree had no `Guides/DocPageExamples.nb`, and `build.log` captured only the first 7 lines, although the exit code was 0. Run 2 built all 14 notebooks. It may have been a front-end hiccup or concurrency with other sessions.
- **Warnings from the offline build** (expected, from the network cut and `$AllowInternet = False`):
  - `PacletInstall::notavail` / `Get::noopen` / `Needs::nocont` for WFRCrosslinks
  - `EntityValue::conopen`/`nodat`, plus a cascade of `KeyTake`/`Lookup`/`Values` messages from `DocumentationSearch` processing WolframLanguageData (search index step)
  - `Localized::nokey` for non-symbol page types
  - `CheckboxesCell::autofail` (ResourceDefinition)
  - Many "autorelease() called with no AutoreleasePool" lines from the front end

  The search index was still written.
- **`$Failed` in page metadata.** Each built page has `CitationPopupData -> $Failed` in its metadata, from the offline build. MazeWalkTime has it too.
- **Scope and layout agreement skipped.** Upstream wants agreement on the symbol list and approval of one page before generating the rest; no user was available. What I would ask:
  - "Do you want pages for exactly MazeGenerate and MazeParse (MazeWalkTime already exists)?"
  - "Is this section layout right before I treat it as final?"
- **Not done: install-based resolution check.** It needs `PacletInstall` of the built archive, which needs the owner's OK. I checked resolution only with the folder loaded.
- **Not done: visual check of the built `.nb` pages.** A headless front-end rasterize risks hangs (ROUTES.md). The WLJS notebook plot was checked visually.
- **Shared WLJS kernel side effects.** The WLJS notebook loaded the paclet into the shared WLJS kernel, which registers the MAZE format, the Lorem service, the RandomSignal device class and the WallpaperGroup entity store there for the rest of the session. I used `BlockRandom` so the shared random state was not changed.
