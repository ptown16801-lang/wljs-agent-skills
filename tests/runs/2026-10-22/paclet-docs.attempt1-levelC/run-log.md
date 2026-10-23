# Run log: paclet-docs, 2026-10-22

Request: "Document the exported functions of DocPageExamples as reference pages."

## 1. Skills used

1. `paclet-docs` (local wrapper, then the pinned upstream `skills/paclet-docs/SKILL.md`, plus `ROUTES.md`)
2. `wolfram-symbol-page` (local wrapper, then the pinned upstream MarkdownToNotebook `skills/wolfram-symbol-page/SKILL.md`, with `docs/doc-pages.md` and `docs/examples.md`)

I also read, without loading them as skills: the local `create-wolfram-documentation` wrapper and the upstream `document-revise` protocol. `paclet-docs` points to `document-revise`.

## 2. Steps

1. Surveyed `work/DocPageExamples`: README, `build.wls`, `deploy.wls`, `PacletInfo.wl`, `Kernel/DocPageExamples.wl`, `Scripts/mazegen.wls`, all 12 `docs/*.md`. The work copy is byte-identical to the pinned upstream `examples/Paclet/DocPageExamples` (checked with `diff -r`).
2. Scope: the Kernel extension's `"Symbols"` list in `PacletInfo.wl` (the source `paclet-docs` prefers) exports `MazeGenerate`, `MazeParse` and `MazeWalkTime`. `MazeWalkTime` already has a Symbol page (`docs/MazeWalkTime.md`). `MazeGenerate` and `MazeParse` have none. The guide lists both as plain unlinked lines. `docs/MazeParse-ragged.md` is a Message page and does not count as a function page.
3. Choosing the route: upstream `paclet-docs` writes `.nb` pages into `Documentation/` with `CreateSymbolDoc`. I did not use that route, for two reasons:
   - The `ROUTES.md` overlap table sends standalone literate-markdown sources to `create-wolfram-documentation` and the page skills. This is the MarkdownToNotebook example paclet, not an Institute project.
   - This paclet's `build.wls` deletes `DocPageExamples/Documentation/` and rebuilds it from `docs/*.md`, so pages written there directly would be wiped by the next build.

   So I authored a `Symbol`-template markdown page in `docs/`, following `wolfram-symbol-page` and modelled on `MazeWalkTime.md`.
4. Example probing: **wolfram-direct** (`WolframLanguageEvaluator`, a fresh kernel with the network namespace blocked, `$AllowInternet = False`), two calls.
   - Why this engine: loading this paclet registers an Import/Export format, an entity store, a device class and a service connection globally, and that should not happen in the shared WLJS kernel. A fresh kernel keeps all of that isolated.
   - Call 1 failed as a probe: the symbols were parsed into the session context before `Needs` ran, which gave `::shdw` messages.
   - Call 2 (the probe body loaded with `Get` after `Needs`) gave all the results I used. These include a finding: `MazeGenerate[{1, 1}]` has no `S`, because `G` overwrites it.
5. Wrote `docs/MazeGenerate.md`. It has Usage, Details & Options (8 notes) and 14 captioned examples across Basic Examples, Scope, Applications, Properties and Relations, Possible Issues and Neat Examples.
6. Build and read-back: **a fresh kernel via `wolframscript`**, run under `bwrap --unshare-net` with `$AllowInternet = False`, script at `<scratchpad>/buildMG.wls`.
   - Why this engine: the `wolfram-symbol-page` adaptation and `ROUTES.md` require MarkdownToNotebook builds in a fresh kernel, because WLJS redefines notebook symbols and loses sections.
   - The script loaded the pinned `MarkdownToNotebook.wl`, ran `MarkdownToNotebook[src, out, "EvaluateSeparator" -> None]` (the same option as `build.wls`), then read the `.nb` back.
   - Result: no messages, 14 Input and 14 Output cells, 2 graphics, every output matching its `<!-- => -->` hint, 8 Notes cells, and a RelatedGuides link to `guide/DocPageExamples`.
7. Stopped at the approval gate. `paclet-docs` step 1 and `document-revise` say: generate one page first, present it, and wait until its shape is approved. I did not write `MazeParse.md`.
8. Wrote a review page `paclet-docs-review.md` and converted it with `md2wln.py` to `paclet-docs-review.wln`. This is a results summary page, as `ROUTES.md` requires. It was converted without opening a window and has no code cells.

### Round 2: after the owner's answers

The owner's answers, scripted for this test and relayed by the coordinator:
1. The shape of `MazeGenerate.md` is right; write `MazeParse.md` the same way and check it the same way.
2. Leave the guide page alone.
3. Install nothing; skip the in-product checks and list them as still to do.

9. Probed `MazeParse` with **wolfram-direct** (fresh, network-blocked kernel, `$AllowInternet = False`), two calls, for the same isolation reason as step 4.
   - Call 3: return values for 23 cases.
   - Call 4: tried to attribute messages per case with a message handler. The handler captured nothing, but the printed message order matched the cases.
   - Findings:
     - The first line sets the width, so a longer line is cut short (it can lose `G`).
     - A longer line also triggers `MazeParse::ragged`, which then says "Line 1 is shorter than the header row".
     - An empty line becomes a row of walls.
     - `ImportString[..., "MAZE"]` does not pad ragged text (`MatrixQ` gives `False`).
     - `MazeParse[{}]`, a non-string element, and a single string all stay unevaluated.
10. Wrote `docs/MazeParse.md` in the approved shape: Usage, 7 notes, and 13 examples across Basic Examples, Scope, Applications, Properties and Relations and Possible Issues.
11. Built and read it back in **a fresh kernel via `wolframscript`** under `bwrap --unshare-net`, with `$AllowInternet = False` and `"EvaluateSeparator" -> None` as in `build.wls`. Script: `<scratchpad>/buildMP.wls`; read-back script: `<scratchpad>/readMP.wls`. The reason is the same as step 6.
   - Build 1: 13 outputs as expected, but 6 Message cells, one of them a stray `General::stop`. The build run counts repeated `MazeParse::ragged` messages across cells, so the third one is followed by `General::stop`.
   - Build 2: I made the dimensions example rectangular. The `General::stop` still came, now after a different example.
   - Build 3: I wrapped the two examples whose message is incidental in `Quiet[..., MazeParse::ragged]` (the empty-line example in Scope and the truncation example in Possible Issues). Result: 13 Input and 13 Output cells, every output as expected, and only the 2 intended `MazeParse::ragged` cells (Basic Examples, and the misleading-message example in Possible Issues). No `General::stop`, no other messages.
12. Updated `work/paclet-docs-review.md` for round 2 and converted it with `md2wln.py` to the new name `paclet-docs-review_2.wln`. The first `.wln` is kept, because `md2wln.py` refuses to overwrite. Following the owner, I did not edit the guide, installed nothing and ran no in-product check.

No WLJS kernel evaluation (`mcp__wljs__*` / `wljs eval`) was used. No notebook window, browser or application was opened.

## 3. Files

Created inside the work folder:
- `<repo>/tests/runs/2026-10-22/paclet-docs/work/DocPageExamples/docs/MazeGenerate.md` (the page source)
- `<repo>/tests/runs/2026-10-22/paclet-docs/work/DocPageExamples/build/DocSource/English/ReferencePages/Symbols/MazeGenerate.nb` (built authoring notebook; `build/` is gitignored)
- `<repo>/tests/runs/2026-10-22/paclet-docs/work/paclet-docs-review.md`
- `<repo>/tests/runs/2026-10-22/paclet-docs/work/paclet-docs-review.wln`
- `<repo>/tests/runs/2026-10-22/paclet-docs/work/DocPageExamples/docs/MazeParse.md` (round 2, the page source)
- `<repo>/tests/runs/2026-10-22/paclet-docs/work/DocPageExamples/build/DocSource/English/ReferencePages/Symbols/MazeParse.nb` (round 2, built authoring notebook)
- `<repo>/tests/runs/2026-10-22/paclet-docs/work/paclet-docs-review_2.wln` (round 2 review notebook)
- `<repo>/tests/runs/2026-10-22/paclet-docs/run-log.md` (this file)

Changed in round 2: `work/paclet-docs-review.md` (rewritten for round 2; round 1's text survives in `paclet-docs-review.wln`) and this run log.

Scratch, outside the work folder: `<scratch>/` (`probe1.json`, `probe1.wl`, `probe2.json`, `buildMG.wls`, then in round 2 `probe3.json`, `probe3.wl`, `probe4.json`, `probe4.wl`, `buildMP.wls`, `readMP.wls`).

Written as side effects of the Wolfram kernels, outside the work folder (see Problems):
- `~/.Wolfram/Objects/Persistence/MarkdownToNotebook/ExampleOutput/MazeGenerate/*` and `.../ExampleOutput/MazeParse/*` (MarkdownToNotebook's example-output cache)
- `~/.Wolfram/Paclets/Configuration/managerData_15.0.0.0.pmd2`
- Front end caches and logs under `~/.Wolfram/FrontEnd/` and `~/.Wolfram/Logs/`, including `~/.Wolfram/Logs/ServiceFramework/Log`
- wolfram-direct run records in `~/.local/state/wolfram-agenttools-direct/runs/` (`run-mm733zwk`, `run-ybocengw`, `run-_wza5uy9`, `run-llw7d293`)

No file that existed before this run was changed. The guide, `MazeWalkTime.md`, the paclet code and the build scripts are untouched.

## 4. WLJS notebook

- Round 2 (current): `<repo>/tests/runs/2026-10-22/paclet-docs/work/paclet-docs-review_2.wln`
- Round 1: `<repo>/tests/runs/2026-10-22/paclet-docs/work/paclet-docs-review.wln`

Both are summary pages converted from markdown with `md2wln.py`, never opened or saved through WLJS.

## 5. Answer

All three exported functions of DocPageExamples now have reference pages in `docs/`:
- `MazeWalkTime.md` already existed and is unchanged.
- `MazeGenerate.md` is the new page whose shape you approved.
- `MazeParse.md` is new, in the same shape.

Both new pages were built offline in a fresh kernel and every example was checked: `MazeGenerate` has 14 outputs and no messages; `MazeParse` has 13 outputs and only its two intended `MazeParse::ragged` messages.

Writing the pages turned up four quirks in the paclet. The pages report them and the code is unchanged:
- `MazeGenerate[{1, 1}]` has no start cell, because the goal is written over it.
- `MazeParse` cuts any line longer than the first, and can lose the `G`.
- For a longer line, `MazeParse::ragged` names line 1 as "shorter than the header row", even though line 1 is the header row.
- `ImportString[..., "MAZE"]` does not pad ragged text, unlike `MazeParse`.

As you asked, I left the guide alone and installed nothing. Still to do:
- Run the full `DocumentationBuild`. `build.wls`'s path to `MarkdownToNotebook.wl` does not exist in this work copy.
- Install the paclet and check that `ref/MazeGenerate` and `ref/MazeParse` resolve: `?MazeGenerate`, F1 and Documentation Center search.
- Optionally, turn the guide's plain `MazeGenerate` and `MazeParse` lines into linked chips.

## 6. Problems

- Round 1 stopped at the approval gate. Round 2 finished `MazeParse.md` after the owner's answers.
- **Still to do, per the owner (no installs):** the in-product resolution check (paclet-docs step 4: `?Symbol`, F1, Documentation Center) and the full `DocumentationBuild`.
- I generated one page before scope agreement. Upstream step 1 says to agree scope before generating anything. I read the request as already fixing the scope (all exported functions) and took the protocol's "generate one page first, show it" as the next step. The owner may have wanted to be asked before even that page.
- I did not follow the upstream `paclet-docs` `CreateSymbolDoc` route (see Steps 3).
- The first wolfram-direct probe returned unevaluated results with `::shdw` messages: my probe parsed the symbols before `Needs`. The second probe fixed this. Neither is a paclet problem.
- The second probe printed `Import::noelem` for an `ImportString[..., "Dimensions"]` call with the wrong element syntax. That was my mistake, and the result is not used on the page.
- The MarkdownToNotebook build wrote its example cache and front-end and paclet-manager state under `~/.Wolfram`, outside the work folder. This is normal converter behaviour, but it is outside the "work only inside" boundary. I did not delete any of it.
- `build.wls` in the work copy loads `MarkdownToNotebook.wl` from `../../../` relative to itself. That path exists in the upstream repository layout but not in this work folder, so `build.wls` would fail here as is. I did not run it.
- Round 1 linked `MazeParse` before its page existed. That page now exists, so those links have a target. They are unverified until a DocumentationBuild runs.
- The full `DocumentationBuild` was not run, and the docked Check lint was not run.
- Round 2, MazeParse build: the converter evaluates the page's cells in one run, so a third `MazeParse::ragged` in a build put a stray `General::stop` Message cell on the page (builds 1 and 2). An interactive reader would not see this, because each cell is its own evaluation.
  - My fix: two examples whose message is incidental now use `Quiet[..., MazeParse::ragged]`, which leaves two message-issuing cells.
  - Not verified: exactly where the converter's message count resets. I did not edit the pinned converter, and I did not clear its example cache (that would delete files).
  - Possible issue: a page with three or more examples that issue the same message will show the same `General::stop`. This is a possible converter issue to report upstream.
- Round 2, probe call 4: the `Internal`HandlerBlock` message handler captured nothing in wolfram-direct. I matched the printed messages to the cases by their order, and build 3's read-back confirmed which examples issue messages.
- `docs/MazeParse.md` describes the paclet's current behaviour, including the misleading line number in `MazeParse::ragged`. If the code is fixed later, the Possible Issues examples will need updating.
