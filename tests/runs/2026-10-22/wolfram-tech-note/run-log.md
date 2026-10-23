# Run log: wolfram-tech-note, "Write and build a short tech note on how DocPageExamples parses mazes"

## 1. Skills used

1. `wolfram-tech-note`, the local WLJS adaptation. It sent me to `ROUTES.md` and the pinned upstream `skills/wolfram-tech-note/SKILL.md`, which I read with `docs/doc-pages.md` and the start of `docs/examples.md`.

No other skill was loaded.

## 2. Steps

1. **Read the rules and the skill.** I read `ROUTES.md` and the upstream SKILL.md. I did not use the upstream build path, `ResourceFunction[ResourceObject["https://www.wolframcloud.com/..."]]`, because it contacts Wolfram Cloud, which the owner's rule forbids. Following the local adaptation, I used the pinned `MarkdownToNotebook.wl` in a fresh kernel instead.
2. **Read the paclet.** I read the paclet source and its pages: `README.md`, `build.wls`, `PacletInfo.wl`, `Kernel/DocPageExamples.wl`, `docs/MAZE.md`, `docs/MazeParse-ragged.md` and `docs/DocPageExamples.md`.
   - Mazes are parsed in two places. The MAZE import converter (`importMaze`) is `Characters /@ ReadList[source, String]`. `MazeParse` pads each line with `StringPadRight` to the header row's width, and issues `MazeParse::ragged` when the line lengths differ.
3. **Checked the claims (fresh kernels, `wolframscript -f`, `$AllowInternet = False`).** Scripts: `probe.wls`, `probe2.wls`, `probe3.wls` and `probe4.wls`, in the session scratchpad.
   - **Why a fresh kernel and not WLJS:** loading the paclet registers an Import format, an EntityStore, a device class and a service connection. Those are global registrations, and in the shared WLJS kernel I could not cleanly undo them. Isolation mattered, so I used a fresh kernel.
   - **What was confirmed:**
     - Import keeps ragged rows ragged: the `"Dimensions"` element is `{3}`, and `MazeWalkTime` stays unevaluated on the result.
     - Import drops empty lines.
     - `MazeParse` cuts lines that are longer than the header. In one case this cut off the goal, and `MazeWalkTime` then gives `Missing["NotReachable"]`.
     - In that case the message names line 1, the header itself.
     - `Import["x.maze"]` without a format name gives `FileFormat` `"Table"`. `Import[f, "MAZE"]` works.
4. **Wrote the tech note:** `docs/ParsingMazes.md`, Template `TechNote`. It has four sections: Importing MAZE Text, Parsing Lines with MazeParse, Ragged Input: Where the Two Differ, and Possible Issues. It has 17 example cells and a comparison table. As the skill asks, I listed the note in the paclet guide (`RelatedTutorials: [ParsingMazes]`).
5. **Built it (fresh kernel, `wolframscript -f` inside `bwrap --unshare-net`, `$AllowInternet = False`).** This route is required for `.nb` builds because MarkdownToNotebook breaks in the WLJS kernel. The network namespace also guarantees nothing reaches a Wolfram server.
   - **Build script:** a copy of the paclet's own `build.wls`, kept in the scratchpad with three changes:
     - it loads the pinned converter path;
     - it sets `"UseCache" -> False` and `"LightDark" -> "Light"` through `SetOptions`, so nothing is written to the user's PersistentObjects;
     - it drops the `CurrentValue[$FrontEnd, LightDark] = "Light"` line, which sets a front-end preference.
   - **What it built:** all 13 `docs/*.md` pages into `build/DocSource`, then `DocumentationBuildNotebooks` into `DocPageExamples/Documentation` (index and search index). It took 77 s and exited with code 0.
   - **First attempts hung.** See Problems; the cause was found and fixed in the source. I also changed one example from `StringSplit[..., "\n"]` to `ImportString[..., "Lines"]` so the input cell reads cleanly, then rebuilt.
6. **Checked the result (fresh kernel, `wolframscript`, bwrap).** Scripts: `inspect.wls` and `render.wls`.
   - **Authoring notebook:** 17 Input cells, 16 Output cells (the `DeleteFile` cell gives no output), 2 Message cells (the intended `MazeParse::ragged` ones) and 1 ArrayPlot graphic.
   - **Outputs:** every output matches the expected-output comment in the source.
   - **Built page:** it has the jump box, the Related Guides footer and the guide's link to `paclet:WolframInstitute/DocPageExamples/tutorial/ParsingMazes`.
   - **Rendering:** I rasterized the built page to PNG and looked at both halves; it renders correctly.
7. **Made a WLJS preview notebook without a window.** I wrote `ParsingMazes-preview.md` (no frontmatter, plus a cell that loads the paclet) and converted it with `python3 tools/md2wln.py` into `ParsingMazes.wln`. Its cells are unevaluated. I opened no window and called no `mcp__wljs__*` tool.

**Engines used:** fresh Mathematica 15.0 kernels via `wolframscript` (probes, build, inspection, rasterizing), each with `$AllowInternet = False`; the build and inspection ran inside `bwrap --unshare-net`. WLJS kernel: not used.

## 3. Files

**Created, in `work/DocPageExamples/`:**
- `docs/ParsingMazes.md`: the tech note source.
- `build/DocSource/English/Tutorials/ParsingMazes.nb`: the tech note's authoring notebook.
- `DocPageExamples/Documentation/English/Tutorials/ParsingMazes.nb`: the built tutorial page.
- The rest of `build/DocSource/` (12 other authoring notebooks), all of `DocPageExamples/Documentation/` (12 other built pages, Index, SearchIndex, SpellIndex) and `DocPageExamples/ResourceDefinition.nb`. These are regenerated by the paclet's own build pipeline, and the paclet's `.gitignore` excludes them.

**Created, in `work/`:**
- `ParsingMazes-preview.md`
- `ParsingMazes.wln`

**Changed:**
- `work/DocPageExamples/docs/DocPageExamples.md`: `RelatedTutorials: []` became `RelatedTutorials: [ParsingMazes]`.

**Scratch files (outside the work folder):** `<scratch>/technote-parsingmazes-1767465/`, holding the build, inspect, render and trace scripts, logs and PNGs. There are also `probe*.wls` files in the scratchpad root, and `build-local.wls`, which I moved into the folder above.

**Temporary files:** a few were written to `/tmp` while checking examples, and all were deleted. `/tmp/example.maze` is not mine.

## 4. WLJS notebook

`<repo>/tests/runs/2026-10-22/wolfram-tech-note/work/ParsingMazes.wln`

It was converted from Markdown with `md2wln.py` and is not evaluated; it was never opened in WLJS.

## 5. Answer

I wrote the tech note "Parsing Mazes" (`DocPageExamples/docs/ParsingMazes.md`) and built it with the paclet's own pipeline, offline. The built page is `DocPageExamples/DocPageExamples/Documentation/English/Tutorials/ParsingMazes.nb`, and the paclet guide now links to it. All 17 examples ran during the build, and each result matches what the note says.

DocPageExamples has two ways to read maze text:

- **The MAZE import format** (`ImportString[text, "MAZE"]`, `Import[file, "MAZE"]`):
  - It reads the text line by line and splits each line into characters. It does nothing else.
  - Empty lines are dropped.
  - Rows of different lengths stay ragged, so the result is not a matrix: the `"Dimensions"` element gives `{3}`, and `MazeWalkTime` won't evaluate on it.
- **`MazeParse[lines]`:**
  - The first line sets the width.
  - Shorter lines are padded with walls (`"#"`), so the result is always a rectangular matrix.
  - When the line lengths differ it issues `MazeParse::ragged` once, naming the shortest line.

The note also covers two pitfalls:

- **`MazeParse` cuts lines longer than the first line.** In the note's example this cuts off the goal, so `MazeWalkTime` gives `Missing["NotReachable"]`. The message then names line 1, the header.
- **`Import["level.maze"]` without `"MAZE"` gets the wrong format.** The format doesn't register the `.maze` extension, so `Import` guesses `"Table"`. The paclet's own MAZE format page says `Import["file.maze"]` works, which is wrong; you may want to fix that page or register the extension.

## 6. Problems

- **The converter hangs on certain expected-output comments.** The first three builds hung before any example ran: killed after 590 s, 400 s and 300 s. Bisecting showed the cause: an expected-output comment of the form `<!-- => MazeParse::ragged: Line 2 is shorter … -->`. With those two comments removed or reworded (to `<!-- => message: … -->`) it builds in about 8 s. The other pages and a trivial tech note built fine under the same setup. This looks like a bug in the pinned converter; I did not find the cause in its code. I reworded the comments in the source.
- **Timed-out builds left orphaned processes.** When `timeout` killed `bwrap`, the `wolframscript` process (with no kernel left) kept running. I found two of mine (`build-local.wls`, `build-technote.wls`) and one trace run, and killed them with SIGKILL. I did not touch other sessions' Wolfram processes, including a `wolframscript` and a front end started at 00:36 and 00:55.
- **The scratchpad is shared with other test sessions running at the same time.** My first `build.log` was overwritten and mixed with another session's output: NUL bytes, and a "built 13 documentation notebooks" line that was not mine. After that I worked in a unique subfolder. The `probe*.wls` files in the scratchpad root may since have been overwritten by other sessions.
- **The upstream converter tried an install.** Loading it printed `PacletInstall::notavail: No appropriate paclet named WFRCrosslinks …`. It tried to install that paclet itself. The attempt was refused offline (`$AllowInternet = False`, plus the network namespace), so nothing was installed and no server was contacted.
- **Messages during `DocumentationBuild`:**
  - `EntityValue::conopen` / `EntityValue::nodat` and a flood of `Values::invrl` / `Lookup::invrl` / `Skeletonizer` messages. The search-index step wanted `WolframLanguageData`, which was blocked offline. The search index was still written.
  - `Localized::nokey` for the non-standard page types.
  - `CheckboxesCell::autofail` while building `ResourceDefinition.nb`.
  - These come from the paclet's existing pages and pipeline, not from the tech note.
- **The paclet's `build.wls` changes a front-end setting.** It runs `UsingFrontEnd[CurrentValue[$FrontEnd, LightDark] = "Light"]`, which may persist as a front-end preference. I removed that line from my copy and passed `"LightDark" -> "Light"` to the converter instead. I also used `"UseCache" -> False` to avoid writing PersistentObjects. The paclet's own `build.wls` is unchanged.
- **Display quirks in the built page:**
  - `"\n"` inside string literals is shown as real line breaks in Input cells. It reads well for the maze strings, so I kept it, and I removed it where it looked odd.
  - In the rasterized PNG the message text shows "isshorter" without a space. This looks like rasterization only; the cell text is correct.
- **Things I did not do:**
  - `MazeParse` has no symbol page, so the note writes it in backticks rather than as a link. The doc-pages convention would ask for a page to be created; I did not, to keep the note short.
  - I did not run the docked Check (`CheckDefinitionNotebook`). It needs to open the notebook in the front end and save CellIDs into it.
  - I did not fetch the AccessibleColors example tutorial from GitHub, so I had no reference model for the note. GitHub is allowed, but downloads need the owner's approval.
- **No publishing, installs or cloud calls.** The paclet's `deploy.wls` (CloudDeploy) was not run.
