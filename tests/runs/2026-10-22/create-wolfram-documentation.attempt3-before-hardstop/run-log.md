# Run log: create-wolfram-documentation, "Set up documentation for the DocPageExamples paclet in this folder"

Date: 2026-10-22. Working folder: `tests/runs/2026-10-22/create-wolfram-documentation/work`.
Paclet: `work/MarkdownToNotebook/examples/Paclet/DocPageExamples` (abbreviated `DPE/` below).

## 1. Skills used

1. `create-wolfram-documentation` (local wrapper, then `ROUTES.md` and the pinned upstream `SKILL.md`)
2. `wolfram-symbol-page` (local wrapper, then the pinned upstream `SKILL.md`). The pinned upstream `wolfram-guide-page/SKILL.md`, `docs/doc-pages.md` and `docs/examples.md` were also read as references; `wolfram-guide-page` was not loaded as a skill.

## 2. Steps

1. **Survey (file reads only).** Read `DPE/DocPageExamples/PacletInfo.wl`, `Kernel/DocPageExamples.wl`, `Scripts/mazegen.wls`, `build.wls`, `deploy.wls`, `README.md`, `.gitignore`, `ResourceDefinition.md` and all `docs/*.md`. Findings:
   - The paclet exports 3 symbols: `MazeGenerate`, `MazeParse` and `MazeWalkTime`. Only `MazeWalkTime` had a symbol page.
   - The guide `docs/DocPageExamples.md` listed `MazeGenerate` and `MazeParse` as plain text, with no link.
   - `ResourceDefinition.md` links `[MazeGenerate]()` and `[MazeParse]()`, but neither link had a page to point to.
   - There were no existing `.nb` docs (no `Documentation/` folder and no `ResourceDefinition.nb`). So step 3 (back up) and step 4 (port `.nb` to `.md`) had nothing to do.
   - The work copy of MarkdownToNotebook is identical to the pinned checkout (`diff -rq` printed nothing).
2. **Planned the doc set.** Add 2 symbol pages (`MazeGenerate`, `MazeParse`), link them from the guide, rebuild all pages, and rebuild `ResourceDefinition.nb`. Not done: publishing/deploying (upstream step 6, PacletPage and `deploy.wls`), because they need the Wolfram Cloud and the no-Wolfram-server rule forbids it. There was no user to confirm the plan with; I judged that adding local markdown pages and rebuilding was within the request.
3. **Probed the real behaviour** before writing any expected value. Engine: **fresh kernel via `wolframscript`** inside `bwrap --unshare-net`, with `$AllowInternet = False` and under `timeout` (`scratch/probe.wls`, `scratch/probe2.wls`). I used a fresh kernel so the shared WLJS kernel was not touched and the network stayed cut. Findings that went into the pages:
   - `MazeGenerate[{1,1}]` has no `"S"`: the goal overwrites the start, so `MazeWalkTime` returns `Missing["NotReachable"]`.
   - `MazeParse` cuts a line that is longer than the first line, and the `ragged` message then names line 1.
   - `ImportString[..., "MAZE"]` does not pad ragged lines; `MazeParse` does.
   - Non-positive sizes leave `MazeGenerate` unevaluated, and a non-list argument leaves `MazeParse` unevaluated.
4. **Wrote the pages:**
   - `DPE/docs/MazeGenerate.md`: Usage, Details, Basic Examples, Scope, Applications, Properties and Relations, Possible Issues, Neat Examples.
   - `DPE/docs/MazeParse.md`: the same sections, except Neat Examples. It has exactly 2 intended `MazeParse::ragged` messages (Scope and Possible Issues); the other ragged example uses `Quiet`.
   - `DPE/docs/DocPageExamples.md` (guide): `MazeGenerate` and `MazeParse` are now backticked chips, so they link.
   - Every `<!-- => -->` hint is a value measured in step 3.
5. **Built every page, one fresh kernel per page.** Engine: **`wolframscript`** in the network cut, with `$AllowInternet = False` (`scratch/buildpage.wls`, run by `scratch/buildall.sh`).
   - Why not `build.wls`: it converts each page twice in one kernel, which ROUTES.md says adds a stray `General::stop` cell to the `ragged` page. Why not WLJS: ROUTES.md says MarkdownToNotebook builds are unreliable in the WLJS kernel.
   - Same output layout and options as `build.wls` (`"EvaluateSeparator" -> None`, `$docTemplateDirectories`). I left out `build.wls`'s `CurrentValue[$FrontEnd, LightDark] = "Light"` line, because it changes a front-end setting.
   - Result: all 14 pages built with no `$Failed` and no `General::stop`. MazeGenerate: 223 cells, 17 inputs, 17 outputs, 0 messages. MazeParse: 189 cells, 11 inputs, 11 outputs, 2 messages (the intended ones).
   - Read back every caption and output of the two new pages (`scratch/inspect.wls`, fresh kernel). They match the probes.
6. **Built `ResourceDefinition.nb`.** Engine: **`wolframscript`** in the network cut (`scratch/buildrd.wls`, `"EvaluateSeparator" -> Automatic` as in `build.wls`). Result: 413 cells, 25 outputs, 0 Message cells, no `General::stop`, 1 `ServiceExecute::isrv` failure output (the Lorem example).
7. **Ran DocumentationBuild** on `build/DocSource` into `DPE/DocPageExamples/Documentation`. Engine: **`wolframscript` + `UsingFrontEnd`** in the network cut, with `timeout -s KILL 600` (`scratch/docbuild.wls`).
   - Before starting, I waited until no other front-end job was running, as ROUTES.md advises. (My first wait loop matched its own command line and waited the full 590 s for nothing.)
   - Result: `Success` in 41.7 s. 14 notebooks plus `Index`, `SearchIndex` and `SpellIndex`.
   - Cross-links checked: the guide links `ref/MazeGenerate` and `ref/MazeParse`, and both new pages link each other, `MazeWalkTime`, and the guide.
   - No orphaned `WolframNB` remained. Two defunct `WolframNB` entries were seen briefly and were gone on the next check.
8. **Made the WLJS summary notebook.** Engine: **WLJS kernel via `mcp__wljs__*`**, because ROUTES.md says results go in a WLJS notebook.
   - Steps: `new_notebook`, then `add_cells_batch` with `.md` cells, a live listing of the 14 built pages, `PacletDirectoryLoad` + `Needs` of the paclet, and 4 examples. Then evaluated every cell, including the `.md` ones.
   - Results matched the build: the maze plot for seed 42; `TreeGraphQ` gave `True`; `MazeWalkTime` gave 10 s; the ragged example showed its message.
   - Saved with `NotebookSave[EvaluationNotebook[], ".../work/DocPageExamples-docs-summary.wln"]`.
   - Captured the window with `capture-wljs-windows.sh` (the markdown renders) and projected the maze cell (the plot matches the seed-42 maze: green S top left, red G bottom right).
   - One WLJS call earlier (`kernel_evaluate`) only checked `$AllowInternet` (False).

## 3. Files

Created or changed in the paclet (`DPE/` = `work/MarkdownToNotebook/examples/Paclet/DocPageExamples/`):
- `DPE/docs/MazeGenerate.md` (new)
- `DPE/docs/MazeParse.md` (new)
- `DPE/docs/DocPageExamples.md` (changed: 2 list lines now backtick `MazeGenerate` / `MazeParse`; the original is saved as `scratch/DocPageExamples.md.orig`)
- `DPE/build/DocSource/English/**` (generated: 14 authoring notebooks; gitignored by `build/`)
- `DPE/DocPageExamples/Documentation/English/**` (generated: 14 built pages + `Index`, `SearchIndex`, `SpellIndex`; gitignored)
- `DPE/DocPageExamples/ResourceDefinition.nb` (generated; gitignored by `*.nb`)

Other files in the working folder:
- `work/DocPageExamples-docs-summary.wln` (WLJS summary notebook)

Scratch (`tests/runs/2026-10-22/create-wolfram-documentation/scratch/`):
- `probe.wls`, `probe2.wls`, `buildpage.wls`, `buildall.sh`, `buildall.log`, `inspect.wls`, `buildrd.wls`, `docbuild.wls`, `docbuild.log`, `DocPageExamples.md.orig`, `cap/`, `cap2/` (window captures)

Written outside the folder by Wolfram itself (not by my code directly):
- MarkdownToNotebook's example-output cache in `~/.Wolfram/Objects/Persistence/MarkdownToNotebook/ExampleOutput/<PageName>/…`. The cache is shared with other sessions.
- The usual paclet-manager and front-end cache files under `~/.Wolfram`.

This log: `tests/runs/2026-10-22/create-wolfram-documentation/run-log.md`.

## 4. WLJS notebook

`<repo>/tests/runs/2026-10-22/create-wolfram-documentation/work/DocPageExamples-docs-summary.wln` (left open in WLJS; window title `llm-d3d.wln`).

## 5. Answer

The DocPageExamples documentation is set up and builds offline.

- **What was missing:** the paclet exports three functions, but only `MazeWalkTime` had a reference page. I wrote markdown symbol pages for **`MazeGenerate`** and **`MazeParse`** (`docs/MazeGenerate.md`, `docs/MazeParse.md`) and linked both from the guide.
- **Checked against the real code:** every example on the new pages was run against the actual paclet, and every expected value in them is a measured result.
- **Build:** I rebuilt everything without network access, giving 14 documentation pages with navigation, search and spell indexes in `DocPageExamples/Documentation`, plus `ResourceDefinition.nb`. The new pages have no failures and no stray `General::stop` cells.
- **Summary notebook:** `work/DocPageExamples-docs-summary.wln` (open in WLJS) lists the built pages and runs the main examples live.

Things you should know:
- **Nothing was published.** `deploy.wls` and PacletPage need the Wolfram Cloud. Deploying needs your explicit OK, and it would have to be an exception to the no-Wolfram-servers rule.
- **Lorem page shows failures offline.** The Lorem service page, and one example in `ResourceDefinition.nb`, show `ServiceExecute::isrv` failures instead of placeholder text. ServiceFramework refuses every service call while `$AllowInternet` is False. Getting real output would need internet switched on for the build, which the current rule does not allow.
- **Possible bug in `MazeParse`:** a line longer than the first line is cut silently to the first line's width, and the `ragged` message then says "Line 1 is shorter than the header row", which is wrong. The page documents this under Possible Issues. I did not change the paclet code. Do you want it fixed, either by padding to the longest line or by reporting the long line?
- **Avoid the stock `build.wls` for rebuilds.** It converts each page twice in one kernel, which can add a stray `General::stop` cell to the `MazeParse::ragged` page (seen in an earlier run). It also sets the front end's light/dark preference. I built with a one-kernel-per-page driver instead (`scratch/buildpage.wls` + `buildall.sh`) and did not change `build.wls`. Do you want that driver moved into the project?

## 6. Problems

- **Lorem failures (offline limit):** the Lorem page has 5 Message cells and `Failure["ConnectionFailure", ServiceExecute::isrv]` outputs; `ResourceDefinition.nb` has 1 such failure. Expected offline (ROUTES.md rule 0). Not fixed.
- **Offline messages during the build:**
  - `PacletInstall::notavail` / `Get::noopen` / `Needs::nocont` for `WFRCrosslinks`, during conversion of the guide page and during DocumentationBuild. This is the known automatic `PacletInstall`, blocked offline.
  - The DocumentationBuild search-index step issued `EntityValue::conopen` / `EntityValue::nodat`, `WolframLanguageData`-related `Lookup`/`Keys`/`Values`/`AssociationThread`/`Set::pspec1` messages, and 16 `Localized::nokey` messages (for the Character, Entity, Format, Interpreter, Message, Program, Service Connection and Workflow page types). The indexes were still written; they may have fewer entries than an online build.
- **`ResourceDefinition.nb`:** the build printed `DefinitionNotebookClient`CheckboxesCell::autofail` (could not set the Categories checkboxes automatically).
- **Garbled log line, not reproduced:** in `buildall.log` the `mazegen.md` line printed as "AllowInternet False / -> …Programs/mazegen.nb" instead of the file name and template. Rebuilt that page alone: normal output, same counts (120 cells, 0 messages). Cause unknown (possibly interleaved terminal output).
- **Visual check of the built `.nb` pages not done.** No front-end rasterizing of the pages, because ROUTES.md reports front-end rasterize hangs in the network cut. The check was structural only (cell types, captions, outputs, links). The WLJS summary was checked visually.
- **Shared converter cache:** the MarkdownToNotebook evaluation cache is keyed by page name plus a cumulative source hash and is shared across sessions. Some outputs may have come from cache, but the read-back outputs match my fresh-kernel probes.
- **Global side effects in the shared WLJS kernel:** the summary notebook ran `PacletDirectoryLoad` + `Needs` of DocPageExamples in that kernel. This registers the MAZE format, the RandomSignal device class, the WallpaperGroup entity store and the Lorem service there. I left them loaded so the saved notebook stays runnable. Examples used `BlockRandom` so the shared random state was not changed, except for the ragged example (no randomness).
- **Wasted wait:** my first "wait for other front ends" loop used `pgrep -f` with a pattern that matched its own command line, so it waited the full 590 s timeout (no harm).
- **Plan not confirmed:** upstream says to confirm the plan with the user; no user was available. I would have asked: "The paclet's MazeGenerate and MazeParse have no reference pages. Shall I add symbol pages for them, link them from the guide and rebuild everything offline? (Publishing to the Wolfram Cloud is excluded.)"
