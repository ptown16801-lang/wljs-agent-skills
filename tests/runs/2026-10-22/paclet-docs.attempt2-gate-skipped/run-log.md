# Run log: paclet-docs, "Document the exported functions of DocPageExamples as reference pages" (2026-10-22)

## 1. Skills used

1. `paclet-docs` (local WLJS adaptation; read ROUTES.md and the pinned upstream `paclet-docs/SKILL.md`)
2. `wolfram-symbol-page` (local WLJS adaptation; read the pinned upstream `wolfram-symbol-page/SKILL.md`, plus `MarkdownToNotebook/docs/doc-pages.md` and `docs/examples.md` in the working folder)

## 2. Steps

1. Found the paclet at `work/MarkdownToNotebook/examples/Paclet/DocPageExamples/`. Its own README and `build.wls` show it builds docs from Markdown (`docs/*.md` -> `build/DocSource` -> `DocumentationBuild` -> `DocPageExamples/Documentation/`). The adaptation says to use that route here, not `CreateSymbolDoc`.
2. Got the exported symbols from the Kernel extension's `"Symbols"` list in `PacletInfo.wl` (the author's own list): `MazeGenerate`, `MazeParse`, `MazeWalkTime`. `docs/MazeWalkTime.md` already existed. `MazeGenerate` and `MazeParse` had no pages. The `Documentation` extension is already declared (`{"Documentation", "Language" -> "English"}`), so nothing needed adding to `PacletInfo.wl`.
3. Read the kernel source (`Kernel/DocPageExamples.wl`) and the existing pages (`MazeWalkTime.md`, `MazeParse-ragged.md`, `MAZE.md`, `mazegen.md`, the guide) for behaviour and house style.
4. Probed the behaviour of both functions (`scratch/probe.wls`, `scratch/probe2.wls`). **Engine: a fresh kernel through `wolframscript`, inside the network cut (`bwrap --unshare-net ...`), with `$AllowInternet = False` first, under `timeout`.** Why: the WLJS kernel was not responding and must not be used, and a fresh offline kernel is the required route anyway. Findings used in the pages:
   - `MazeGenerate[{r, c}]` gives a (2r+1)×(2c+1) matrix. Its open cells form a tree (checked with `TreeGraphQ`). It can be reproduced with `SeedRandom`/`BlockRandom`. Bad sizes return unevaluated with no message. `MazeGenerate[{1, 1}]` has a `G` but no `S` (the goal overwrites the start), so `MazeWalkTime` gives `Missing["NotReachable"]`.
   - `MazeParse`: the first line sets the width. Short lines are padded with `#`. Longer lines are **truncated**, and the message then says "Line 1 is shorter than the header row". A single string or `{}` returns unevaluated. Characters are not validated. `ImportString[..., "MAZE"]` keeps ragged rows, while `MazeParse` pads them.
   - Messages count toward `General::stop` across the whole build session, and the build converts `MazeParse.md` right before `MazeParse-ragged.md`. So every ragged call on the new page is wrapped in `Quiet[..., MazeParse::ragged]` (tested: quieted messages do not count; `scratch/quiettest.wls`).
5. Wrote `docs/MazeGenerate.md` and `docs/MazeParse.md` (Template: Symbol), modelled on `MazeWalkTime.md`. Paclet symbols are written as `[Name]()` links, and the message page and `mazegen` are linked by `paclet:` URI.
6. Ran the paclet's own build: `scratch/build-wrapper.wls` sets `$AllowInternet = False` and then `Get`s the unmodified `build.wls`. **Engine: fresh kernel (`wolframscript`), network cut, `timeout 1500`.** Why: ROUTES requires a fresh kernel for `.nb` builds (WLJS redefines notebook symbols), and the adaptation says to run the paclet's own build so the pages land in `Documentation/`.
   - Run 1 (03:02–03:07): all 14 authoring notebooks were written. `DocumentationBuild` then lost a parallel subkernel (`LinkRead::time`, `KernelObject::rdead`, `LaunchKernels::final`) and reported `DocumentationBuild::error: 13/14 files`. The Workflows page `FilterADataset` was missing and Index/SearchIndex were empty.
   - Run 2, a single retry as ROUTES allows (03:08–03:09): 14/14 pages built, with Index, SearchIndex and SpellIndex present.
7. Read the built pages back (`scratch/inspect.wls`, `scratch/readback.wls`). **Engine: fresh kernel, `wolframscript`, network cut**, reading the `.nb` as an expression with no front end. Every Input/Output pair matched the probed results. The pages contain no Message cells, no `General::stop`, no `$Failed` and no `(*BB[*)` markup. All paclet links point to `paclet:WolframInstitute/DocPageExamples/ref/...`.
   - MazeGenerate.nb: 128 cells, 15 outputs. Sections: Usage, Details (9 notes), Basic Examples (2), Scope (3), Applications (2), Properties & Relations (4), Possible Issues (3), Neat Examples (1), See Also, Related Guides.
   - MazeParse.nb: 111 cells, 12 outputs. Sections: Usage, Details (8 notes), Basic Examples (2), Scope (2), Applications (2), Properties & Relations (4), Possible Issues (2), See Also, Related Guides.
8. Resolution check (`scratch/resolve.wls`). **Engine: fresh kernel, `wolframscript`, network cut.** With `PacletDirectoryLoad` of the paclet folder, `Documentation`ResolveLink` resolved all of these to the built files in `Documentation/`: `ref/MazeGenerate`, `ref/MazeParse`, `ref/MazeWalkTime`, `ref/message/MazeParse/ragged` and `guide/DocPageExamples` (5/5; 3/3 exported symbols). The upstream check (`CreatePacletArchive` + `PacletInstall`) was **not** run, because installing needs the owner's OK.
9. The built page `ReferencePages/Messages/MazeParse/ragged.nb` (the author's existing page) contains a `General::stop` Message cell in its first example. I tested whether my new page causes it (`scratch/raggedtest.wls`, `scratch/raggedtest3.wls`; **engine: fresh kernel, `wolframscript`, network cut**):
   - The message page alone gives 2 `MazeParse::ragged` cells and no stop.
   - `MazeParse.md` followed by the message page in one session: `MazeParse.md` adds 0 messages, and the message page is again clean.
   - So the new page does not cause it. The cause in the full build was not established (see Problems).
   - A third test, which repeated build.wls's "Association" pass followed by the file pass, hung and was killed by `timeout` at 400 s. No orphaned processes from my runs remained (I checked process lists; `--die-with-parent` cleaned up).
10. Checked that `~/.Wolfram/FrontEnd/init.m` is unchanged (md5 identical before and after). `build.wls` sets `CurrentValue[$FrontEnd, LightDark]`, and I wanted to be sure no front-end preference was saved.
11. Wrote a summary page `work/DocPageExamples-reference-pages.md` and converted it with `tools/md2wln.py` to `.wln` (no window opened, no WLJS call).

No `mcp__wljs__*` calls, no `wljs eval`, no `wolfram-direct`, no `wsm-toolkit`. Nothing was installed, published or deployed (`deploy.wls`, which does a `CloudDeploy`, was read but not run).

## 3. Files

Created (sources, by me):
- `work/MarkdownToNotebook/examples/Paclet/DocPageExamples/docs/MazeGenerate.md`
- `work/MarkdownToNotebook/examples/Paclet/DocPageExamples/docs/MazeParse.md`
- `work/DocPageExamples-reference-pages.md`
- `work/DocPageExamples-reference-pages.wln`

Generated by the paclet's `build.wls` (none existed before; all are in the paclet's `.gitignore`):
- `work/MarkdownToNotebook/examples/Paclet/DocPageExamples/build/DocSource/English/**` (14 authoring notebooks)
- `work/MarkdownToNotebook/examples/Paclet/DocPageExamples/DocPageExamples/Documentation/English/**`: 14 built pages, including **`ReferencePages/Symbols/MazeGenerate.nb`** and **`ReferencePages/Symbols/MazeParse.nb`**, plus `Index/`, `SearchIndex/5/`, `SpellIndex/`
- `work/MarkdownToNotebook/examples/Paclet/DocPageExamples/DocPageExamples/ResourceDefinition.nb`

Scratch (`tests/runs/2026-10-22/paclet-docs/scratch/`): `probe.wls`, `probe2.wls`, `quiettest.wls`, `build-wrapper.wls`, `build.log`, `build2.log`, `inspect.wls`, `readback.wls`, `resolve.wls`, `raggedtest.wls`, `raggedtest2.wls`, `raggedtest3.wls`, `raggedcheck.wls`, `raggedtest/{a.nb, c-MazeParse.nb, c-ragged.nb}`, `init.m.before`, empty dirs `localbase{,2,3,4}/`.

Outside the working folder (side effect, not intended): MarkdownToNotebook's example-output cache wrote entries to the shared `~/.Wolfram/Objects/Persistence/MarkdownToNotebook/ExampleOutput/` (folders `MazeGenerate/`, `MazeParse/`, `MazeParse__ragged/`, `Lorem/` and others, timestamps 03:02–03:17). My attempt to redirect it to scratch with `$LocalBase` had no effect. I did not delete these entries.

This run log: `tests/runs/2026-10-22/paclet-docs/run-log.md`.

## 4. WLJS notebook

`<repo>/tests/runs/2026-10-22/paclet-docs/work/DocPageExamples-reference-pages.wln` (converted from Markdown with md2wln.py and not opened or evaluated, as the rules require).

## 5. Answer

I wrote reference pages for the two exported functions that had none, **MazeGenerate** and **MazeParse**, as `docs/MazeGenerate.md` and `docs/MazeParse.md`. Then I ran the paclet's own `build.wls`, offline. The built pages are at `DocPageExamples/Documentation/English/ReferencePages/Symbols/MazeGenerate.nb` and `MazeParse.nb`. The third export, MazeWalkTime, already had a page and I left it alone.

- Each page has the usage line, Details, and examples under Basic Examples, Scope, Applications, Properties & Relations and Possible Issues; MazeGenerate also has a Neat Examples section.
- I read every example's output back from the built pages and checked it against direct tests. There are no failed examples and no stray messages.
- The Possible Issues sections record two real quirks of the code:
  - `MazeGenerate[{1, 1}]` has no start, so `MazeWalkTime` cannot find a path.
  - `MazeParse` cuts off any line longer than the first line, and its message then wrongly names line 1 as the short line.
- With the paclet folder loaded, all three exported symbols' page links (`paclet:` URIs) resolve to the built files.
- The first build lost a parallel kernel and left out one page (Filter a Dataset) and the search index. One retry built all 14 pages and the index.

Still owed by you:
- **(a)** Press F1 on MazeGenerate and MazeParse in Mathematica and search the Documentation Center for them; this can't be checked headlessly.
- **(b)** Approve the page shape, or leave `<< >>` notes. The skill wanted one page approved before I wrote the second; with nobody to ask, I followed the shape of your MazeWalkTime page.
- **(c)** Decide whether to install the paclet for a full installed check. I didn't install it.

Optional: your guide and the MazeWalkTime page mention MazeGenerate and MazeParse as plain text, and these could now be links. I didn't change them, because the guide is yours to write.

Questions I would have asked if someone were available:
1. "Is the page shape OK (sections, number of examples), using MazeWalkTime.md as the model? Approve it before I treat it as final."
2. "May I install the paclet locally (`CreatePacletArchive` + `PacletInstall[..., ForceVersionInstall -> True]`) to run the installed-paclet docs check?"
3. "Your existing message page `MazeParse::ragged` shows a stray `General::stop` cell in the full build. Do you want me to look into it? It is not caused by the new pages."

## 6. Problems

- **The first build failed partway.** `DocumentationBuild` lost a parallel subkernel (`LinkRead::time`, `KernelObject::rdead`, `LaunchKernels::final`, then `DocumentationBuild::error: 92.8571% (13/14) of files were processed successfully`, `LinkConnect::linkc`). FilterADataset.nb was missing and the index was empty. Another session was running a front-end conversion at the same time, which may be related (not proven). The single retry succeeded.
- **Stray `General::stop` in the author's message page** `ReferencePages/Messages/MazeParse/ragged.nb` (first example: `MazeParse::ragged`, then `General::stop`). It was present in both build runs. It is not caused by the new pages: built alone or right after `MazeParse.md`, that page is clean.
  - The cause is not established. Two candidates: build.wls converting each page twice in one session (an "Association" pass and then the file pass), or cached outputs from another session's earlier build in the shared example-output cache (entries for this paclet's pages dated 02:33, before my run).
  - My test of the double pass hung (killed at 400 s).
- **The shared cache was used.** MarkdownToNotebook's example-output cache is in `~/.Wolfram/Objects/Persistence` and is shared with other sessions; setting `$LocalBase` did not redirect it. My builds therefore wrote entries there, and they could have served cached outputs written by other sessions. For the two new pages this does not matter: every output was checked against my own fresh-kernel probes.
- **Expected offline build messages:** `PacletInstall::notavail` for WFRCrosslinks (plus `Get::noopen`/`Needs::nocont`); `EntityValue::conopen`/`EntityValue::nodat` and a cascade of `Keys`/`KeyTake`/`Lookup` messages from the search-index skeletonizer; `Localized::nokey` for non-symbol page types; `CheckboxesCell::autofail` for the ResourceDefinition categories; many `autorelease()` lines from the headless front end. The Lorem ServiceConnection page cannot evaluate offline (ROUTES: `ServiceExecute::isrv`); I did not look into that page.
- **Not done:**
  - A visual check of the graphics outputs (ArrayPlots). I saw only that they are graphics; I rendered no images, to avoid front-end rasterization hangs.
  - The installed-paclet docs check (needs an install).
  - F1 / Documentation Center confirmation (needs a person).
  - The docked Check lint (`CheckDefinitionNotebook`).
- **Departed from upstream:**
  - The upstream skill says to stop and agree the symbol list before generating, and to get one page approved before the rest. With no user available, I took the request plus the PacletInfo `"Symbols"` list as the agreed scope and wrote both pages. Page-shape approval is still open (question 1).
  - Upstream's `CreateSymbolDoc` route was not used; the local adaptation says to use the paclet's Markdown build.
- **Basic Examples on the MazeParse page are quieted.** Its examples Quiet every `MazeParse::ragged` (to avoid adding `General::stop` cells in the shared build session), so the page itself never shows the message text. The dedicated message page shows it.
