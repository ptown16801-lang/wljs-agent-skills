# Run log: create-wolfram-documentation, DocPageExamples (2026-10-22)

## 1. Skills used

1. `create-wolfram-documentation` (local WLJS adaptation; then `ROUTES.md` and the pinned upstream `skills/create-wolfram-documentation/SKILL.md`)
2. `wolfram-symbol-page` (local WLJS adaptation; then the pinned upstream `skills/wolfram-symbol-page/SKILL.md`, `docs/doc-pages.md`, `docs/examples.md`)

I did not load `wolfram-guide-page`. The guide edit was two lines that turn plain names into function chips, which is covered by `docs/doc-pages.md`.

## 2. Steps

No WLJS kernel was used. There were no `mcp__wljs__*` calls, no `wljs eval`, and no notebook windows. I did not use `wolfram-direct` or `wsm-toolkit`. **Every Wolfram evaluation ran in a fresh `wolframscript` kernel** inside the network cut (`bwrap --unshare-net --unshare-pid --die-with-parent ...`), with `$AllowInternet = False` as the first line and under `timeout`. I used a fresh kernel because ROUTES.md requires one for building and reading `.nb` files, the WLJS kernel was not responding, and the owner rule forbids network access.

1. **Survey.** The paclet is at `work/MarkdownToNotebook/examples/Paclet/DocPageExamples`. Its `PacletInfo.wl` names `WolframInstitute/DocPageExamples` 1.0.0, context ``WolframInstitute`DocPageExamples` ``, and it exports three symbols: `MazeGenerate`, `MazeParse` and `MazeWalkTime`.
   - 12 markdown pages already exist in `docs/`: a guide, a Symbol page for `MazeWalkTime`, and Format, Service, Device, Interpreter, Entity, Character, Message, Program, Workflow and WorkflowGuide pages. There is also a `ResourceDefinition.md`, plus `build.wls` and `deploy.wls`.
   - There were **no existing `.nb` docs**: no `Documentation/`, `build/` or `ResourceDefinition.nb`; checked with `find`. Step 3 (backup) and step 4 (port to `.md`) therefore had nothing to act on.
   - The working copy of MarkdownToNotebook is identical to the pinned checkout (`diff -rq` found no differences).
2. **Gap found:** `MazeGenerate` and `MazeParse` had no Symbol pages. The guide listed them as plain text with no links.
3. **Probing the real behaviour** (fresh wolframscript, two probe scripts). Every example was run before I wrote it into a page. This turned up three things:
   - `MazeGenerate[{1,1}]` puts the goal `G` on top of the start `S`.
   - A `MazeParse` line longer than the header row is silently cut to the header's width. The `ragged` message then names line 1, which is wrong.
   - A message that repeats a third time within one script triggers `General::stop`, and earlier lines in the same script count toward it.
4. **Authored** `docs/MazeGenerate.md` and `docs/MazeParse.md` as Symbol pages following the upstream conventions.
   - The `MazeParse` page lets only two `MazeParse::ragged` messages through. The third use is wrapped in `Quiet`.
   - I linked the new pages from the guide (`` `MazeGenerate` `` and `` `MazeParse` `` chips) and from `MazeWalkTime.md` (SeeAlso, plus inline links in place of backticks).
   - I added both pages to the paclet's README table.
5. **Build stage 1: markdown to authoring notebooks.** I used my own driver, `scratch/convert-page.wls`, which runs one fresh kernel per page and copies `build.wls`'s output-path logic. It differs from `build.wls` in four ways:
   - one page per process, so message counts cannot carry over from one page to the next;
   - it reads the template with `"Evaluate" -> False` (`build.wls` evaluates every page twice);
   - the converter's example cache goes to `scratch/mtn-cache` (`PersistenceLocation["Local", ...]`), with `"UseCache" -> False`, instead of the user's shared "Local" store;
   - it skips `build.wls`'s `CurrentValue[$FrontEnd, LightDark] = "Light"`, so no front-end preference is written. The converter already pins every notebook to Light.

   Results: 14 pages and `ResourceDefinition.md` all converted, about 8 to 15 s each. The **first `MazeParse` run hung** with no output and was killed after 400 s. Other sessions were starting front ends at the same time. The single retry succeeded in 9 s.
6. **Build stage 2: `DocumentationBuild`** (`scratch/docbuild.wls`, fresh wolframscript with `UsingFrontEnd`, same call as `build.wls`). Result: `Success`, 14/14 files, `FailedFilesCount -> 0`, 49 s. It wrote the `Index`, `SearchIndex` and `SpellIndex` folders.
7. **Checks** (fresh wolframscript, scripts `scratch/inspect*.wls`): I read back every built notebook and counted Message cells and `General::stop`.
   - `MazeGenerate`: 15 inputs, 15 outputs, no messages.
   - `MazeParse`: 12 inputs, 12 outputs, exactly the 2 intended `MazeParse::ragged` cells, **no `General::stop`**.
   - The guide links to `ref/MazeGenerate` and `ref/MazeParse`.
   - All other pages have no messages except `Lorem` (see Problems).
   - No processes from my scratch folder were left running.

## 3. Files

New:
- `work/MarkdownToNotebook/examples/Paclet/DocPageExamples/docs/MazeGenerate.md`
- `work/MarkdownToNotebook/examples/Paclet/DocPageExamples/docs/MazeParse.md`

Changed (originals saved in `scratch/` as `DocPageExamples.md`, `MazeWalkTime.md` and `README.md.orig`):
- `work/MarkdownToNotebook/examples/Paclet/DocPageExamples/docs/DocPageExamples.md`: two function-list items now use chips
- `work/MarkdownToNotebook/examples/Paclet/DocPageExamples/docs/MazeWalkTime.md`: SeeAlso and two inline links
- `work/MarkdownToNotebook/examples/Paclet/DocPageExamples/README.md`: two table rows and the intro line

Generated (all gitignored by the paclet's `.gitignore`):
- `work/.../DocPageExamples/build/DocSource/English/**`: 14 authoring notebooks
- `work/.../DocPageExamples/DocPageExamples/Documentation/English/**`: 14 built pages plus `Index`, `SearchIndex` and `SpellIndex`
- `work/.../DocPageExamples/DocPageExamples/ResourceDefinition.nb`

Scratch (`<repo>/tests/runs/2026-10-22/create-wolfram-documentation/scratch/`):
- scripts: `probe.wls`, `probe2.wls`, `convert-page.wls`, `docbuild.wls`, `inspect.wls`, `inspect-all.wls`, `inspect-built.wls`, `inspect-usage.wls`
- `mtn-cache/` and `logs/*.log`
- the backups listed above

## 4. WLJS notebook

None.

## 5. Answer

The DocPageExamples paclet's documentation is set up and builds offline.

- **What was there:** the paclet already had markdown sources for 12 pages and its Paclet Repository definition, but no built notebooks. Nothing needed backing up or porting.
- **What was missing:** Symbol pages for two of the three exported functions. I wrote `docs/MazeGenerate.md` and `docs/MazeParse.md` with Usage, Details, and Basic, Scope, Applications, Properties, Possible Issues and Neat Examples sections. Every example was checked against the live paclet. I then linked both pages from the guide and from the `MazeWalkTime` page.
- **Build result:** all 14 pages and `ResourceDefinition.nb` built in fresh offline kernels. `DocumentationBuild` reported 14/14 succeeded and wrote the paclet's `Documentation/` with its search index. The new `MazeParse` page has no stray `General::stop` cell.
- **Visual check: not done.** I did not open or screenshot the pages, because opening windows was not allowed. The check was a structural read-back of every cell.

Questions I would ask before going further:
1. **The Lorem page and the definition's Lorem example are broken offline.** They carry `ServiceExecute::isrv` errors (and on Lorem a `General::stop`), because ServiceFramework refuses any service while `$AllowInternet` is False, even this purely local one. May I rebuild only those two with `$AllowInternet = True` inside the network cut? No connection could leave the machine. If not, they should not be published as they are.
2. **Should I fix the paclet's `build.wls`?** It evaluates every page twice in one kernel, so repeated messages pile up into `General::stop` cells. It also changes a front-end preference (`LightDark`). Or should I keep the per-page driver I used?
3. **Two code behaviours I documented as Possible Issues rather than changed. Should either be fixed?**
   - `MazeParse` silently cuts lines longer than the header row, and its `ragged` message then names the wrong line.
   - `MazeGenerate[{1,1}]` overwrites the start with the goal.
4. **Publishing was not attempted.** That means PacletPage, `deploy.wls`/`CloudDeploy` or a repository submission. Each needs Wolfram Cloud access, which the no-Wolfram-servers rule forbids, and the owner's explicit OK.
5. The skill asks to confirm the page plan before generating files. No one was available, so I went ahead with the obvious gap: one page for each undocumented exported symbol.

## 6. Problems

- **Hang:** the first `MazeParse` conversion hung for 400 s with no output and was killed with `timeout -s KILL`. Other sessions' front-end jobs were running at the time (seen with `pgrep`). One retry succeeded in 9 s. No orphaned processes from my runs remained; the pid namespace took them down. The `WolframNB` processes I saw belonged to other sessions and were left alone.
- **Lorem page:** 4 `ServiceExecute::isrv` messages plus `General::stop` in `ReferencePages/Services/Lorem.nb`, and one `isrv` in `ResourceDefinition.nb`. This is a known offline limitation (ROUTES rule 0) and was not fixed.
- **`ResourceDefinition.md` conversion:** printed `CheckboxesCell::autofail` (Categories checkbox items could not be determined).
- **`DocumentationBuild` log:** offline messages as ROUTES.md predicts.
  - `PacletInstall::notavail` for WFRCrosslinks, followed by `Get::noopen` and `Needs::nocont` (no download was possible: `$AllowInternet` False, network cut).
  - `EntityValue::conopen`/`nodat`, `WolframLanguageData::notent` and Skeletonizer `Lookup`/`Keys`/`Values` errors during the search-index step.
  - `Localized::nokey` ×16.
  - Two `General::stop` in the log, from the index step, not in any page.
  - The search index was still written, possibly with fewer entries.
- **Not verified:** that `build.wls` as shipped would reproduce the `General::stop` problem. That is inferred from its code and from my probe.
- **Not verified:** whether the headless front end wrote anything to the user's Mathematica preferences. I avoided the explicit `LightDark` change.
- **Unsure:** the `MazeParse` usage line uses `{$line_1$, $line_2$, …}`. It built as subscripted template arguments (`line₁, line₂, …`), but I have not seen it rendered.
