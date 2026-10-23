# Run log: create-wolfram-documentation (2026-10-22)

## 1. Skills used

1. `create-wolfram-documentation` (local WLJS adaptation). I read `ROUTES.md` and the pinned upstream `skills/create-wolfram-documentation/SKILL.md`.
2. `wolfram-symbol-page` (local WLJS adaptation), loaded in round 2 after your OK. I read the pinned upstream `skills/wolfram-symbol-page/SKILL.md`, plus `docs/doc-pages.md` and `docs/examples.md` from the pinned repo.

## 2. Steps

**Engines.** Every Wolfram evaluation ran in a fresh kernel via `wolframscript` under `bwrap --unshare-net --unshare-pid --die-with-parent`, with `$AllowInternet = False`, and every run was wrapped in `timeout`.
- **Why a fresh kernel:** ROUTES.md requires one for building or reading Mathematica `.nb` files, because WLJS redefines `Cell`/`Notebook`/`MakeBoxes`.
- **Why `bwrap`:** it guarantees no network.
- **Why not `wolfram-direct`:** the same sandbox, but with a 120 s limit, too short for the build.
- I used no WLJS kernel (`mcp__wljs__*`), so the shared kernel needed no cleanup.

### Round 1 (survey, then stop for the plan)

1. **Survey.** I read the README, `build.wls`, `deploy.wls`, `PacletInfo.wl`, the kernel source, `Scripts/mazegen.wls` and several `docs/*.md`.
   - `diff -r` against the pinned upstream `examples/Paclet/DocPageExamples` found the folder identical.
   - There were no `.nb` docs, so the backup and port steps were not needed.
2. **`verify.wls`.** Converted all 13 markdown sources into the scratchpad: 13 of 13 OK.
   - `PacletFind["WolframInstitute/PacletPage"]` (local lookup) gave `{}`: PacletPage is not installed.
3. **`lorem.wls`.** `ServiceConnect["Lorem"]` works; `ServiceExecute` fails with `ServiceExecute::isrv`.
4. **Full `build.wls` on a scratch copy**, with the converter path fixed and the LightDark line removed. `DocumentationBuild` processed 8 of 12 pages (`DocumentationBuild::error`) in 13 min 15 s.
5. **Stopped** at the skill's "confirm the plan" step and wrote `docs-setup-summary.md` / `.wln` with four questions.

### Round 2 (your answers: add both pages, route (a), build into the paclet, leave Lorem)

6. **`probe.wls`.** Ran every planned example for `MazeGenerate` and `MazeParse` to get the real outputs, and found these edge cases:
   - `MazeGenerate[{1, 1}]` gives `{"###","#G#","###"}`: the goal overwrites the start.
   - Invalid sizes return the call unevaluated.
   - The maze graph is a tree: `TreeGraphQ` is True.
   - `MazeParse` cuts lines longer than the first one. When the first line is the short one, it reports line 1.
   - `MazeParse` of a bare string returns unevaluated.
   - `ImportString[..., "MAZE"]` keeps ragged rows.
7. **Pages.** Wrote `docs/MazeGenerate.md` and `docs/MazeParse.md` following the symbol-page skill: frontmatter, a `<code>` usage line, Details, one demonstration per cell, `---` between demonstrations, and hints pasted from the real results.
   - In `docs/DocPageExamples.md`, `MazeGenerate` and `MazeParse` now carry backticks, so they become linked function entries.
8. **`new.wls`.** Converted the two new pages and the guide into the scratchpad and inspected the outputs and links.
   - A `General::stop` showed up in MazeParse's Possible Issues, because messages accumulate across sections with `EvaluateSeparator -> None`.
   - Fix: the Properties & Relations "ragged" example now uses `Quiet[..., MazeParse::ragged]`.
   - I also moved the `Quiet` demonstration into Scope.
9. **`diag.wls`.** `DocumentationBuildNotebooks` limited to the Guide, CirclePlus, RandomSignal and WallpaperGroup pages (plus DataWrangling), with `ProcessedFiles` printed.
   - All five gave `Success["ProcessedNotebook", "Action" -> "Build"]` in 32 s.
   - Conclusion: the round-1 failures were not in the docs sources. Those four were the first files processed while the front-end link was failing (`LinkConnect::linkc` x2, a 13 min run).
10. **Edited `build.wls`** (three commented local changes):
    - load the pinned `MarkdownToNotebook.wl`;
    - set `$AllowInternet = False` in place of the global `LightDark` front-end setting;
    - keep the `DocumentationBuild` result and print each failed page with its message.
11. **Real build into the paclet folder.** Command: `timeout -k 30 1500 bwrap ... wolframscript -f build.wls`.
    - 15 conversions OK, then `DocumentationBuild: Success`: 14 notebooks plus Index, SpellIndex and SearchIndex, in 1 min 10 s.
12. **`check.wls` / `check2.wls`.** Read the built MazeGenerate, MazeParse and Guide notebooks back.
    - Each symbol page has its Examples sections and 12 outputs, and the links between the three Maze pages are present.
    - The one `$Failed` per page is `"CitationPopupData" -> $Failed`, the same as on the existing MazeWalkTime page.
13. **`png.wls`.** Rasterized the built MazeGenerate and MazeParse pages to PNG (scratchpad) and looked at them.
    - Both have a header, usage line, collapsible Details, an Examples section with Basic Examples open (string and maze outputs, ArrayPlot pictures), the remaining example sections, See Also and Related Guides.
14. **Processes.** I compared Wolfram process lists before and after the build: nothing of mine was left. The long-running `WolframNB` (PID 1699362/1699368) started at 00:55, before this session, under another kernel, so I left it alone.
15. **Summary.** Rewrote `docs-setup-summary.md` and converted it to the new `docs-setup-summary-2.wln` (md2wln refuses to overwrite).

## 3. Files

Created or changed in `work/`:
- `DocPageExamples/docs/MazeGenerate.md` (new)
- `DocPageExamples/docs/MazeParse.md` (new)
- `DocPageExamples/docs/DocPageExamples.md` (changed: two backtick links)
- `DocPageExamples/build.wls` (changed: three marked local changes)
- `DocPageExamples/build/DocSource/English/**` (generated, 14 authoring notebooks)
- `DocPageExamples/DocPageExamples/Documentation/English/**` (generated, 14 pages plus Index, SpellIndex, SearchIndex)
- `DocPageExamples/DocPageExamples/ResourceDefinition.nb` (generated)
- `docs-setup-summary.md` (round 1, rewritten in round 2)
- `docs-setup-summary.wln` (round 1, now outdated)
- `docs-setup-summary-2.wln` (round 2)

Outside `work/`:
- `run-log.md` (this file)

Scratchpad only (`<scratch>/`):
- `verify/` (verify, lorem, new, check, check2 and png scripts, notebooks, PNGs)
- `probe/probe.wls`
- `buildcopy/` (round-1 copy, `diag.wls`, logs)
- `build-real.log`, `pids-before.txt`, `pids-after.txt`

## 4. WLJS notebook

- `<repo>/tests/runs/2026-10-22/create-wolfram-documentation/work/docs-setup-summary-2.wln` (current)
- `.../work/docs-setup-summary.wln` (the round-1 plan)

Both were made from `.md` with `md2wln.py`; neither was opened in WLJS.

## 5. Answer

The DocPageExamples documentation is set up and builds offline.

- **New pages.** I added symbol pages for `MazeGenerate` and `MazeParse`, every example run for real, and linked them from the guide. The links to them in `ResourceDefinition.md` now resolve.
- **`build.wls`.** It now loads the local MarkdownToNotebook and keeps the kernel offline. It no longer sets the global LightDark front-end option. It names any page that fails.
- **Build.** Run inside the network cut, the build gives `DocumentationBuild: Success` with all 14 pages, the indexes and `ResourceDefinition.nb`, in about 1 minute.
- **The four failing pages.** Guide, CirclePlus, RandomSignal and WallpaperGroup were not broken. They were the first files processed while the front end failed to connect. When I rebuilt them alone they passed, and the full build then passed too. Nothing in their sources needed fixing.
- **Lorem page.** Left as is: its `ServiceExecute` examples fail offline (`ServiceExecute::isrv`). This is noted in the summary.
- **Wolfram server contact.** `DocumentationBuild` itself tries to reach Wolfram's servers: an automatic install of the `WFRCrosslinks` paclet, and `EntityValue`/`WolframLanguageData` while building the search index. The network cut blocked both, so keep building inside it.
- **Not done.** Deploy, PacletPage and submission were not run; each needs your OK.

## 6. Problems

- **Round-1 full build:** `DocumentationBuild::error` (8/12 pages) and `LinkConnect::linkc` x2, in 13 min. These were front-end connection failures and did not recur. Cause beyond "the front end did not connect" not determined.
- **Lorem page:** `ServiceExecute::isrv` on every Lorem request, offline. Cause inferred, not verified: ServiceFramework requires internet.
- **Blocked attempts to reach Wolfram's servers:**
  - `PacletInstall::notavail` for `WFRCrosslinks`, plus `Get::noopen` / `Needs::nocont`. This comes from DocumentationBuild's `Make.wl` (`Needs["WFRCrosslinks`"]`).
  - `EntityValue::conopen` / `EntityValue::nodat`, then follow-on `KeyTake::invru`, `Lookup::invrl`, `Values::invrl`, `Keys::invrl`, `AssociationThread::invrk`, `Set::pspec1`, `WolframLanguageData::notent` and `DocumentationSearch`Skeletonizer`Private`processWolframLanguageData::msgs`. These come from the search-index build (DocumentationSearch Skeletonizer).
  - Both were blocked by the network cut and `$AllowInternet = False`. The search index was written, but may lack the entries those lookups would have added (not checked).
- **Other build output:**
  - `Localized::nokey` (16 times) for non-symbol page-type labels.
  - `CheckboxesCell::autofail` (Paclet Categories) on `ResourceDefinition.md`.
  - Many `autorelease() called with no AutoreleasePool` front-end console lines.
- **`$Failed` in built pages:** every built page carries `"CitationPopupData" -> $Failed` (MAZE: `{$Failed, ""}`). Probably online citation data; it was already so on the upstream pages.
- **MazeParse page messages:** the page shows `MazeParse::ragged` message cells where intended: Scope "padded with a message", and Possible Issues "short first line".
- **LightDark line removed.** The upstream build pinned the front end to Light so rasterized graphics do not invert under a Dark theme. The pictures I looked at are light, but a front end set to Dark could invert them.
- **Unsure:** whether the en dash in "MAZE–format" in the MazeParse usage line (converter typography) is acceptable.
- **Not tested:** the docked Check (`CheckDefinitionNotebook`) lint was not run on the new pages.
