# Run log: wolfram-symbol-page (MazeWalkTime), 2026-10-22

## 1. Skills used

1. `wolfram-symbol-page` (local WLJS adaptation). Following it, I read `ROUTES.md`, the pinned upstream `skills/wolfram-symbol-page/SKILL.md` and the pinned `docs/doc-pages.md`. No other skill was loaded.

## 2. Steps

1. Read the source `work/DocPageExamples/docs/MazeWalkTime.md`, the paclet's `build.wls`, `README.md`, `PacletInfo.wl` and the `MazeWalkTime` definitions. A `diff -rq` showed the work copy is identical to the pinned upstream `examples/Paclet/DocPageExamples`.
2. Checked the converter (`MarkdownToNotebook.wl`) for network use. It calls `PacletInstall["Wolfram/Parser"]` only when the Parser is missing. Parser 1.3.1 is installed, so that path did not run, and `$AllowInternet = False` was set anyway. I picked `"UseCache" -> False` so every example would be evaluated fresh rather than read from an older cache entry.
3. **Build.** Engine: a fresh kernel via `wolframscript -f` (script in the scratchpad). Reason: ROUTES.md and the skill adaptation require a fresh kernel for any `.nb` build, because WLJS redefines `Cell`/`Notebook`/`MakeBoxes` and loses a section of this very page. The script set `$AllowInternet = False`, pinned the front end to Light, ran `PacletDirectoryLoad` on the paclet folder, loaded the pinned `MarkdownToNotebook.wl`, ran `Needs["WolframInstitute`DocPageExamples`"]`, then called `MarkdownToNotebook[src, out, "EvaluateSeparator" -> None, "UseCache" -> False]`. `None` matches the paclet's own `build.wls`: the page's sections share `maze`. Result: the file was written in 10.2 s. Wolfram/Parser was loaded and `$AllowInternet` was still `False` at the end.
4. **Read-back.** Engine: a fresh kernel via `wolframscript` (`Get` of the `.nb`), for the same reason. Results:
   - 141 cells, 0 message cells, no `$Failed`, no `(*BB[*)` WLJS markup.
   - Usage, 6 Notes, the options table (`3ColumnTableMod`), See Also, Related Guides (`Documentation Page Examples`) and the `Needs` initialization are all present, along with every example section.
   - Every output matches the source's `<!-- => -->` hints: 15.7143 s, 396/25 s, 48.5714 s, 7.85714 s, {15.7143 s, 6.28571 s}, True, True, `Missing["NotReachable"]`, and the unevaluated kilogram call. Basic Examples has the ArrayPlot graphic and Neat Examples has the ListLinePlot.
   - The script printed everything and then did not exit. I stopped it later (see Problems).
5. **Second stage, attempted.** Engine: a fresh kernel via `wolframscript`, `UsingFrontEnd @ DocumentationBuild`DocumentationBuildNotebook[None, Get[authoring nb]]` with `$AllowInternet = False`. Purpose: the published `ref/` page described in doc-pages.md "Build and inspect". It printed nothing for 10 minutes. `timeout`'s SIGTERM was ignored, so I ended my own processes with `kill -9` (PIDs 1741062, 1741065, 1741133, plus the hung read-back 1737626/1737628). I removed the empty `build/Documentation/...` folders it had created. No other process was touched.
6. **WLJS summary notebook.** I wrote `work/MazeWalkTime-preview.md` (build summary, output table, a paclet-load cell and three example cells, all unevaluated) and converted it with `python3 tools/md2wln.py`. The WLJS kernel was **not used** for any evaluation. Running the examples there would need `PacletDirectoryLoad` and `Needs` in the shared kernel, a global change the ground rules forbid. The fresh-kernel build had already evaluated every example. No WLJS notebook or window was opened.

## 3. Files

- Created: `<repo>/tests/runs/2026-10-22/wolfram-symbol-page/work/DocPageExamples/build/DocSource/English/ReferencePages/Symbols/MazeWalkTime.nb` (58,641 bytes; the built page). This is the same location the paclet's `build.wls` uses, and `build/` is gitignored.
- Created: `<repo>/tests/runs/2026-10-22/wolfram-symbol-page/work/MazeWalkTime-preview.md`
- Created: `<repo>/tests/runs/2026-10-22/wolfram-symbol-page/work/MazeWalkTime-preview.wln`
- Created: this run log.
- Scratchpad only, outside the work folder: `build-mazewalktime.wls`, `inspect.wls`, `docbuild.wls`.
- No source file was changed.

## 4. WLJS notebook

`<repo>/tests/runs/2026-10-22/wolfram-symbol-page/work/MazeWalkTime-preview.wln`. It was converted from Markdown with `md2wln.py`, not saved from a running notebook, and its cells are unevaluated.

## 5. Answer

The MazeWalkTime reference page is built: `DocPageExamples/build/DocSource/English/ReferencePages/Symbols/MazeWalkTime.nb`. It is the DocumentationTools authoring notebook. It was built offline in a fresh Wolfram kernel from `docs/MazeWalkTime.md`, the same way the paclet's `build.wls` builds it.

I read it back. It has the usage line, details, the `"CellSize"` options table, See Also and Related Guides, and every example section with real outputs. All outputs match the expected values written in the source (for example 15.7143 seconds at 1.4 m/s, an exact 396/25 seconds at 5 km/h, and `Missing["NotReachable"]` for a walled-off goal). There are no error messages in the page.

I could not complete one optional step: the further `DocumentationBuild` pass that turns this into the final rendered `ref/` page hung for 10 minutes, so I stopped it. If you want that page, the next thing to try is the paclet's full `build.wls` in a fresh kernel. That script runs the whole documentation set, so expect it to take time. A summary with runnable examples is in `MazeWalkTime-preview.wln`. Nothing was published.

## 6. Problems

- **DocumentationBuild hung.** `DocumentationBuildNotebook[None, nb]` under `UsingFrontEnd` produced no output for 600 s and was killed. Cause not established. Possibilities: the front end failing to start alongside the other concurrent wolframscript/front-end sessions on this machine, or a blocked network wait (`$AllowInternet = False`). Not verified.
- **wolframscript did not exit** after the read-back script finished printing (`Get` of the `.nb` only). `timeout 300` did not end it and SIGTERM was ignored; `kill -9` was needed. This matches the earlier TESTING.md note that wolframscript hangs or segfaults on exit after notebook tooling.
- **Cell count 141 vs 142** in the Oct 21 hand run (TESTING.md). The source is unchanged. The likely reason is that the harness used the default `"EvaluateSeparator" -> Automatic` and I used `None`, as the paclet's `build.wls` does, but I did not check this. With `Automatic`, the sections after Basic Examples would not see `maze`.
- **Check lint not run.** The skill's Check step (`DefinitionNotebookClient`CheckDefinitionNotebook`) targets resource definition notebooks and needs a front end. I did not run it on this authoring notebook.
- **Upstream conflict, resolved locally.** The upstream skill says to build with the cloud-deployed `ResourceFunction[...MarkdownToNotebook]`. That contacts Wolfram Cloud, which the owner rule forbids, so I used the pinned local `MarkdownToNotebook.wl` instead.
- **Other runs on the machine.** Another wolframscript run using a `docbuild.wls` path in this same scratchpad (under `bwrap`, PID 1762458) was running concurrently. It was not mine and I did not touch it.
