# Run log: paclet-docs, "Document the exported functions of DocPageExamples as reference pages" (2026-10-22)

## 1. Skills used

1. `paclet-docs` (local WLJS adaptation; read `ROUTES.md` and the pinned upstream `skills/paclet-docs/SKILL.md`)
2. `wolfram-symbol-page` (round 2; local WLJS adaptation; read the pinned upstream `wolfram-symbol-page/SKILL.md` and the work copy's `MarkdownToNotebook/docs/doc-pages.md` and `docs/examples.md`)

## 2. Steps

### Round 1: scope gate

1. Read `ROUTES.md`, the pinned upstream `paclet-docs/SKILL.md`, and the run logs of the earlier attempts (`tests/runs/2026-10-22/paclet-docs.attempt*`).
2. Found the paclet at `work/MarkdownToNotebook/examples/Paclet/DocPageExamples/` and read its README, `build.wls`, `deploy.wls` (not run, because it does a `CloudDeploy`), `PacletInfo.wl`, `Kernel/DocPageExamples.wl`, `docs/MazeWalkTime.md`, and the maze lines of the guide.
3. Scope: the `"Symbols"` list of the `Kernel` extension exports `MazeGenerate`, `MazeParse` and `MazeWalkTime`. `MazeWalkTime` already has a Symbol page; the other two have none. The `Documentation` extension is already declared.
4. Stopped at upstream step 1 ("stop and get agreement on the list and on which sections each page will carry") before generating anything.
5. **WLJS kernel via `mcp__wljs__kernel_evaluate`:** `$AllowInternet` gave `False`. Why: to confirm the offline rule.
6. **WLJS kernel via `mcp__wljs__*`:** notebook 080, with a `.md` cell holding the proposal and three questions, saved to `work/DocPageExamples-docs-scope.wln`. Why: the owner should see the proposal.

### Round 2: after the owner's answers

The owner's answers (scripted for this test, relayed by the coordinator):
1. Pages for MazeGenerate and MazeParse only, and leave `MazeWalkTime.md` as it is.
2. The sections are right.
3. Write and build `MazeGenerate.md` first, show it (summary in the WLJS notebook), then stop for the owner's OK before MazeParse. No install, and skip the F1 / Documentation Center checks.

What I did:

7. Loaded `wolfram-symbol-page` and read the upstream skill, `doc-pages.md` and `examples.md`.
8. **Probed MazeGenerate in a fresh kernel via `wolframscript`**, inside `bwrap --unshare-net`, with `$AllowInternet = False` first and under `timeout` (scripts `scratch/probe.wls` and `scratch/probebody.wl`). Why: loading the paclet registers a format, a service, a device class and an entity store, which should not be done in the shared WLJS kernel; it is also the kernel type the build uses.
   - Results: 20 cases and no messages (`$MessageList` was `{}`).
   - Findings:
     - A maze of r×c cells is a (2r+1)×(2c+1) matrix.
     - `MazeGenerate[{1,1}]` has `G` but no `S`, so `MazeWalkTime` gives `Missing["NotReachable"]`.
     - Sizes that are not positive integers stay unevaluated, with no message.
     - The maze has 2rc−1 open squares, and they form a tree.
     - Round trips through `MazeParse` and through the MAZE format both work.
     - The seeded 3×5 maze takes 11.4286 s to walk at 1.4 m/s.
     - A 40×40 maze takes 0.04 s to generate.
9. Wrote `docs/MazeGenerate.md` (Template: Symbol), modelled on `MazeWalkTime.md`, with every random example seeded:
   - Usage: `MazeGenerate[{r, c}]`.
   - Details & Options: 8 notes.
   - 18 examples: Basic Examples 2, Scope 3, Applications 2, Properties and Relations 6, Possible Issues 4, Neat Examples 1.
   - See Also, Keywords, and RelatedGuides set to DocPageExamples.
10. **Built with the paclet's own `build.wls`** through a wrapper, `scratch/runbuild.wls`, which sets `$AllowInternet = False` and then `Get`s the unmodified `build.wls`. Engine: **fresh kernel via `wolframscript`**, network cut, `timeout 1500`. Why: `ROUTES.md` and the adaptation require `.nb` builds in a fresh kernel and say to run the paclet's own build so the page lands in `Documentation/`.
    - Exit code 0, one run.
    - All 13 pages were converted, then `DocumentationBuild` reported "built 13 documentation notebooks (+ Index / SearchIndex)". There was no `DocumentationBuild::error`.
    - Log: `scratch/build.log`.
11. **Read back the built page in a fresh kernel via `wolframscript`**, network cut (`scratch/check.wls`, `scratch/check2.wls`). Why: to check the real `.nb` and not trust the build's exit code. Results for `Documentation/English/ReferencePages/Symbols/MazeGenerate.nb`:
    - 149 cells: 20 Input, 18 Output, 8 Notes, 1 Usage. No Message cells, no `General::stop`, no `(*BB[*)` markup, 3 graphics outputs.
    - All 18 outputs match the fresh-kernel probes.
    - The only `$Failed` is `"CitationPopupData" -> $Failed` in the page metadata, from building offline.
    - The usage line is a template with the arguments `{r, c}` in italics.
    - With `PacletDirectoryLoad` and `PacletDataRebuild[]`, `Documentation`ResolveLink` resolves `ref/MazeGenerate`, `ref/MazeWalkTime`, `ref/program/mazegen` and `guide/DocPageExamples`.
    - `ref/MazeParse` gives `Null`: that page does not exist yet.
    - No `WolframNB` process was left behind.
12. **WLJS summary via `mcp__wljs__*`** in the same notebook 080. Why: the owner asked for the summary in the WLJS notebook.
    - Added a `.md` summary of round 2 (sections, checks, open items and the approval question).
    - Added an `ArrayPlot` of the page's first Basic Example, drawn from the page's output text so that the paclet is not loaded into the shared kernel.
    - Added a save cell, and evaluated all three.
    - The first evaluation of the `.md` cell failed with WLX parser messages (`ast::nonballanced`, `StringTake::take`, `StringDrop::drop`), caused by a literal `<< >>` in the text. I reworded that line, evaluated the cell again (it rendered), and saved again.
    - Saved with `NotebookSave[EvaluationNotebook[], ".../work/DocPageExamples-MazeGenerate-review.wln"]`; the file contains the fixed text. The round-1 file `DocPageExamples-docs-scope.wln` is unchanged.
    - Checked visually with `tools/capture-wljs-windows.sh`, after projecting the plot cell and the summary cell with `mcp__wljs__project_cell`: the maze draws correctly (green S, red G) and the summary table renders.
13. Stopped for the owner's OK before writing `MazeParse.md`.

### Round 3: after the owner approved the MazeGenerate page

The owner's answer (scripted for this test, relayed by the coordinator; it arrived twice): the MazeGenerate page shape is right. Write `MazeParse.md` the same way, rebuild, check that the MazeParse links on the MazeGenerate page now resolve, update the WLJS summary notebook under a new name, and update this log. No install, no F1 checks.

14. **Probed MazeParse in a fresh kernel via `wolframscript`**, inside the network cut, with `$AllowInternet = False` and under `timeout` (`scratch/probe2.wls` + `scratch/probebody2.wl`, then `scratch/probe3.wls` for one changed example). Why: the same isolation reason as step 8. Findings:
    - A short line is padded with `#`, and the message names the shortest line.
    - When several lines are short, there is one message.
    - A line longer than the first is cut, which can drop `G`, and the message then says "Line 1 is shorter than the header row".
    - An empty line becomes a row of walls.
    - A single string, `{}`, or a non-string element leaves the call unevaluated.
    - Other characters are kept.
    - `ImportString[..., "MAZE"]` does not pad ragged text (`MatrixQ` is `False`).
    - Round trips work.

    In the probe script (one top-level evaluation), the third `MazeParse::ragged` produced `General::stop`, which confirmed the counting risk.
15. Wrote `docs/MazeParse.md` (Template: Symbol) in the approved shape:
    - Usage: `MazeParse[lines]`.
    - Details & Options: 7 notes, with a link to the `::ragged` message page.
    - 15 examples: Basic Examples 2, Scope 3, Applications 2, Properties and Relations 5, Possible Issues 3.
    - See Also and the guide link.
    - The `MazeParse::ragged` message is shown unquieted once, in Basic Examples. The other ragged examples are wrapped in `Quiet[..., MazeParse::ragged]`, so the build session cannot reach a third message and add `General::stop`.
    - Before building, I made three changes:
      - Simplified the usage signature from a math list to `*lines*`, to avoid an untested `\ldots` form.
      - Dropped an example that would have read `$MessageList`, which is unreliable in the one-evaluation build.
      - Changed the truncation example to one that really loses `G`.
16. **Rebuilt with `build.wls`** through the same wrapper, `scratch/runbuild.wls`. Engine: **fresh kernel via `wolframscript`**, network cut, `timeout 1500`. Why: the same as step 10.
    - Exit 0. All 14 pages were converted, and the log says "built 14 documentation notebooks (+ Index / SearchIndex)".
    - No `DocumentationBuild::warning` or `::error`. The round-2 warning about the MazeParse See Also link is gone.
    - Log: `scratch/build2.log`.
17. **Read back all three symbol pages and resolved the links** in a fresh kernel via `wolframscript`, network cut (`scratch/check3.wls`):
    - **MazeParse.nb**:
      - 119 cells: 15 Output, 7 Notes, exactly 1 Message cell (the intended `MazeParse::ragged: Line 3 is shorter…`).
      - No `General::stop`, no `(*BB[*)`.
      - The only `$Failed` is `CitationPopupData`.
      - All 15 outputs match the probes.
    - **MazeGenerate.nb**: 150 cells, 18 outputs (the same as round 2), no Message cells. Its See Also now lists MazeParse, MazeWalkTime, SeedRandom, BlockRandom, RandomSample and ArrayPlot.
    - **MazeWalkTime.nb** (the author's): 11 outputs, no messages.
    - **Link resolution**, with `PacletDirectoryLoad` + `PacletDataRebuild[]`: `Documentation`ResolveLink` returns an existing file for all 6 `paclet:WolframInstitute/...` URIs on the two new pages. These include **ref/MazeParse**, which the MazeGenerate page links to; it gave `Null` in round 2. The other five are ref/MazeGenerate, ref/MazeWalkTime, ref/message/MazeParse/ragged, ref/program/mazegen and guide/DocPageExamples.
    - The author's `ragged.nb` has 2 message cells and **no** `General::stop` in this build. Round 2's build had one.
18. **WLJS summary via `mcp__wljs__*`**, in the same notebook 080. Why: the owner asked for an updated summary notebook.
    - Added a round-3 `.md` summary (sections, checks, link resolution, what was not done).
    - Added an `ArrayPlot` of MazeParse's padded Basic Example, drawn from the page's output, so the paclet is not loaded into the shared kernel.
    - Added a save cell. All three evaluated without messages.
    - Saved under a new name with `NotebookSave[EvaluationNotebook[], ".../work/DocPageExamples-reference-pages-review_3.wln"]`. The earlier files `DocPageExamples-docs-scope.wln` and `DocPageExamples-MazeGenerate-review.wln` are unchanged.
    - Projected both new cells with `mcp__wljs__project_cell` and captured them (`scratch/cap5/`). The summary renders, and the plot shows the padded maze (green S, red G, the padded third row as walls).
19. Process hygiene:
    - A wait loop of mine never ended, because its `pgrep -f runbuild.wls` matched its own command line. I stopped it with `pkill`; the background task then reported exit code 144, which appears to be that kill (the build had already finished).
    - A `WolframNB` front end and its kernel were running afterwards. They started at 06:05:46, after my build had finished (05:59), so they belong to another session, and I left them alone.
    - No processes of mine remain.

## 3. Files

Created:
- `<repo>/tests/runs/2026-10-22/paclet-docs/work/MarkdownToNotebook/examples/Paclet/DocPageExamples/docs/MazeGenerate.md` (page source)
- `<repo>/tests/runs/2026-10-22/paclet-docs/work/DocPageExamples-docs-scope.wln` (round 1 proposal notebook)
- `<repo>/tests/runs/2026-10-22/paclet-docs/work/DocPageExamples-MazeGenerate-review.wln` (round 2 review notebook)
- `<repo>/tests/runs/2026-10-22/paclet-docs/work/MarkdownToNotebook/examples/Paclet/DocPageExamples/docs/MazeParse.md` (round 3 page source)
- `<repo>/tests/runs/2026-10-22/paclet-docs/work/DocPageExamples-reference-pages-review_3.wln` (round 3 review notebook)
- Build outputs from `build.wls`. None existed before this run, and all are in the paclet's `.gitignore`. Round 3 regenerated them:
  - `.../DocPageExamples/build/DocSource/English/**` (14 authoring notebooks)
  - `.../DocPageExamples/DocPageExamples/Documentation/English/**` (14 built pages + Index, SearchIndex, SpellIndex), including **`ReferencePages/Symbols/MazeGenerate.nb`** and **`ReferencePages/Symbols/MazeParse.nb`**
  - `.../DocPageExamples/DocPageExamples/ResourceDefinition.nb` (`build.wls` always builds it)
- Scratch (`tests/runs/2026-10-22/paclet-docs/scratch/`):
  - Round 2: `probe.wls`, `probebody.wl`, `runbuild.wls`, `build.log`, `check.wls`, `check2.wls`
  - Round 3: `probe2.wls`, `probebody2.wl`, `probe3.wls`, `build2.log`, `check3.wls`
  - Window captures: `cap/`, `cap2/`, `cap3/`, `cap4/`, `cap5/`
- This log: `<repo>/tests/runs/2026-10-22/paclet-docs/run-log.md`

Written outside the working folder by the tools: MarkdownToNotebook's example-output cache in `~/.Wolfram/Objects/Persistence/MarkdownToNotebook/ExampleOutput/` (shared with other sessions, and it already held entries from earlier attempts), plus normal paclet-manager and front-end bookkeeping under `~/.Wolfram/`.

Not changed: `PacletInfo.wl`, the kernel code, `build.wls`, `docs/MazeWalkTime.md`, the guide `docs/DocPageExamples.md`, and all other existing `docs/*.md`.

## 4. WLJS notebook

- Current (round 3): `<repo>/tests/runs/2026-10-22/paclet-docs/work/DocPageExamples-reference-pages-review_3.wln`. This is notebook 080, window `llm-0e5.wln`, left open. I also opened four projected "Application" windows (the round-2 summary and maze plot, and the round-3 summary and padded-maze plot) and left them open.
- Round 2: `<repo>/tests/runs/2026-10-22/paclet-docs/work/DocPageExamples-MazeGenerate-review.wln`
- Round 1: `<repo>/tests/runs/2026-10-22/paclet-docs/work/DocPageExamples-docs-scope.wln`

## 5. Answer

All three exported functions of DocPageExamples now have reference pages. The two I wrote, **MazeGenerate** and **MazeParse**, are built into `DocPageExamples/Documentation/English/ReferencePages/Symbols/`, next to your existing MazeWalkTime page, which I left alone.

- **Sources:** `docs/MazeGenerate.md` (the page you approved) and `docs/MazeParse.md`, in the same layout.
- **Build:** the paclet's own `build.wls`, offline in a fresh kernel. It built 14 pages plus the index and search index, with no build errors or warnings.
- **MazeParse page:**
  - Usage `MazeParse[lines]`, 7 notes, and 15 examples (Basic Examples, Scope, Applications, Properties and Relations, Possible Issues).
  - One intended `MazeParse::ragged` message in Basic Examples, and no stray `General::stop`.
  - Possible Issues documents three things:
    - A line longer than the first is cut, which can lose the goal, and the message then wrongly names line 1.
    - Characters outside the MAZE format are kept without a message.
    - A single string stays unevaluated.
- **Checks:**
  - Every output on both pages matches direct tests.
  - **The MazeParse links on the MazeGenerate page now resolve.** Its See Also lists MazeParse again, and with the paclet folder loaded all 6 `paclet:` links on the two new pages resolve to built files.
- The summary and a drawing of a padded maze are in the WLJS notebook `DocPageExamples-reference-pages-review_3.wln`.

As you asked, nothing was installed and the F1 / Documentation Center checks were skipped. The guide is unchanged. It still lists MazeGenerate and MazeParse as plain text, and you may want to turn those into links now that the pages exist.

## 6. Problems

- **Round-2 MazeParse links, now resolved.** In round 2 the MazeGenerate See Also link to MazeParse was removed by DocumentationBuild with a warning, and the inline MazeParse links pointed to a page that did not exist. After round 3 the See Also link is back and `ref/MazeParse` resolves.
- **Stray `General::stop` on the author's message page.** It appeared in the round-2 build (`ragged.nb`: ragged, stop, ragged) and not in the round-3 build (2 message cells). The cause is not established; `ROUTES.md` points to `build.wls` converting each page twice in one kernel. My pages are not involved, and I did not change the author's page.
- **Message counting.** In a single-evaluation session, the third `MazeParse::ragged` triggers `General::stop` (seen in my probe). The MazeParse page therefore shows the message only once and quiets it in the other examples. So the Possible Issues example about the misleading line number states the message text in the caption and does not show it.
- **Expected messages from the offline build** (both runs):
  - `PacletInstall::notavail` for WFRCrosslinks, with `Get::noopen`, `Needs::nocont` and 2 `General::stop` about those.
  - `EntityValue::conopen`/`nodat`, `WolframLanguageData::notent`, and a cascade of `Keys`/`KeyTake`/`Lookup`/`Values`/`AssociationThread`/`Set::pspec1` messages from the search-index step.
  - 16 `Localized::nokey`.
  - `CheckboxesCell::autofail` (ResourceDefinition).
  - Many front-end "autorelease" lines.

  The index and search index were still written.
- **`CitationPopupData -> $Failed`** in each page's metadata (offline build). MazeWalkTime's page has the same.
- **WLJS `.md` cell failed once** in round 2. A literal `<< >>` made the WLX parser fail (`ast::nonballanced` and others). It was reworded and then rendered.
- **Wait loop never ended.** A wait loop of mine matched its own command line in `pgrep` and kept running after the build finished. I stopped it with `pkill`; the background task reported exit code 144. The build had already finished with exit 0.
- **Shared cache.** The MarkdownToNotebook example cache in `~/.Wolfram/Objects/Persistence` is shared and keyed by code hash, so some outputs may have come from the cache. Every output was checked against my own fresh-kernel probes.
- **Not done:**
  - A visual check of the built `.nb` pages, because rasterizing in a headless front end risks hangs (`ROUTES.md`). The maze plots were checked in WLJS.
  - The docked Check lint.
  - The installed-paclet resolution check (no install).
  - F1 / Documentation Center checks (skipped at the owner's request).
