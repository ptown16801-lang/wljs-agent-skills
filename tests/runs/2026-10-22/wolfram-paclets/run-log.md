# Run log: wolfram-paclets, "Check the paclet DocPageExamples in this folder for problems and build it"

## 1. Skills used
1. `wolfram-paclets` (local WLJS adaptation). As it instructs, I read `ROUTES.md`, the pinned upstream `wolfram-paclets/SKILL.md` and the local `CheckPaclet.wls` copy. No other skill was loaded.

## 2. Steps
1. Read every source file in `work/DocPageExamples`: PacletInfo.wl, Kernel/DocPageExamples.wl, Scripts/mazegen.wls, build.wls, deploy.wls, README.md, ResourceDefinition.md and the docs/*.md pages. I did not run deploy.wls, because it does CloudConnect and CloudDeploy.
2. **CodeInspector** on the kernel file, mazegen.wls and PacletInfo.wl. Engine: `wolfram-direct` (fresh kernel, no network), which is the route ROUTES gives for AgentTools' CodeInspector. Result: 2 warnings in the kernel file, none in the other two.
3. Copied the project to `work/check-copy/` so that checks and builds would not write into the originals.
4. **CheckPaclet**, first try: `Wolfram`PacletCICD`CheckPaclet[dir]` and the AgentTools CheckPaclet tool. Engine: `wolfram-direct`. Both fail: CheckPaclet needs a definition notebook (`CheckPaclet::invfile`, then an AgentTools internal error in `formatCheckResult`).
5. Built the definition notebook `ResourceDefinition.nb` in the copy with the pinned `MarkdownToNotebook.wl`. Engine: `wolfram-direct` (a fresh kernel; ROUTES says .nb builds must not run in WLJS). Took 6.8 s, with the offline Categories-checkbox message.
6. **CheckPaclet** on that notebook (`File[...]`). Under `wolfram-direct` it timed out at the 120 s limit. I re-ran it as `bwrap --unshare-net ... wolframscript -file` (a fresh kernel in the same kind of network-less sandbox as wolfram-direct, with a longer time limit). It finished in 19 s with 3 errors and 1 warning (see Answer).
7. **Functional tests** of every registered component: MAZE format, MazeParse, MazeGenerate, MazeWalkTime, the RandomSignal device, the WallpaperGroup entity store, the Lorem service, and the asset location. Engine: fresh kernel, `bwrap --unshare-net` + wolframscript. I chose a fresh kernel because loading the paclet registers a format, a device class, a service and an entity store globally, and the shared WLJS kernel must not get those.
8. **mazegen.wls** run 6 ways (-f with -h, -f without -h, shebang style, -script, a bad integer, the same seed twice). Engine: fresh kernel, `bwrap --unshare-net` + wolframscript, because it is a command-line script.
9. **Docs build check**: in the copy I loaded MarkdownToNotebook first, then ran `Get[build.wls]`. Engine: fresh kernel, `bwrap --unshare-net` + wolframscript, because it builds .nb files and uses UsingFrontEnd. Took 249 s. The guide page failed in DocumentationBuild (11 of 12), and no Index or SearchIndex was written. I tried rebuilding the guide page alone; it hung for more than 400 s and was killed (timeout 400). Its cause is not found.
10. **PacletBuild in the WLJS kernel**, as the skill says (`mcp__wljs__kernel_evaluate`, private context `testDocPageExamplesBuild``, output to `work/DocPageExamples/build`). The call stayed pending past 220 s. A trivial `{$AllowInternet, DateString[], MemoryInUse[]}` call also stayed pending, and `wljs eval '1+1'` timed out after 40 s. The WLJS evaluation kernel was at 0 % CPU and nothing was written to the output folder, so my build had probably not started. I could not abort it: WLJS has no abort API, and restarting the app is not allowed.
11. **PacletBuild in a fresh kernel** instead (`bwrap --unshare-net` + wolframscript, `PacletTools`PacletBuild`):
    - On the original source, output to the scratchpad: it fails. `Documentation` extension root does not exist.
    - On the copy, with the built Documentation from step 9: the reported result is Success, but the archive has no docs. PacletBuild runs DocumentationBuild again on the built pages, finds no URIs, and gives `FileHash::noopen`. The archive is 8.8 KB. I extracted it and loaded it with `PacletDirectoryLoad`; the code works and 0 docs are present.
    - On the copy, with the authoring notebooks (`build/DocSource`) as `Documentation/` and ResourceDefinition.nb moved out of the paclet folder: Success in 43 s. The archive is 313 KB with 12 doc pages, Index, SearchIndex and SpellIndex. I extracted it to the scratchpad, loaded it with PacletDirectoryLoad, tested it (import, MazeWalkTime, asset path, 12 docs), then ran PacletDirectoryUnload. Nothing was installed.
12. Checked the built notebooks for message cells and wrong outputs with grep: Lorem shows 4 `isrv` failures, FindDevices gives `{}`, and `Highlighted[...]` stays unevaluated in ResourceDefinition.nb.
13. Checked symbol names and the description length. Engine: `wolfram-direct`. `ImportData` is not in System`; the description is 186 characters.
14. Wrote a results summary as `.md` and converted it with `tools/md2wln.py` to a WLJS notebook. I opened no window.

`$AllowInternet` was False in every kernel I started (printed at the end of each run).

## 3. Files
Created (the originals in `work/DocPageExamples/` were not changed):
- `work/check-copy/DocPageExamples/` (a copy of the project) with generated content:
  - `build/DocSource/...`: 12 authoring notebooks.
  - `DocPageExamples/Documentation/`: the authoring notebooks copied from DocSource.
- `work/check-copy/Documentation-prebuilt/`: 11 pages built by build.wls's DocumentationBuild.
- `work/check-copy/ResourceDefinition.nb`: the definition notebook, built from ResourceDefinition.md.
- `work/check-copy/archive/WolframInstitute__DocPageExamples-1.0.0.paclet`: the test archive (313 KB), plus `archive/WolframInstitute__DocPageExamples/` and `archive/incremental/`, which PacletBuild writes.
- `work/DocPageExamples-check.md` and `work/DocPageExamples-check.wln`: the results summary.
- `run-log.md` (this file).
- Scratchpad (`<tmp>/.../scratchpad/`): request JSON and .wl/.wls test scripts and their outputs, `pbuild-out/` (the failed source build), `extracted/` (the unpacked archive), `guideonly/`.
- wolfram-direct wrote its usual run records under `~/.local/state/wolfram-agenttools-direct/runs/`.

## 4. WLJS notebook
`<repo>/tests/runs/2026-10-22/wolfram-paclets/work/DocPageExamples-check.wln` was converted from the .md and has never been opened or evaluated. No live WLJS notebook was created.

## 5. Answer
**The build:** the paclet does not build as it stands. `PacletBuild` stops because `PacletInfo.wl` declares a Documentation extension and `Documentation/` does not exist. The docs are generated and git-ignored.

- `build.wls` cannot run here: it loads `../../../MarkdownToNotebook.wl`, which is missing.
- When I loaded MarkdownToNotebook first, build.wls's DocumentationBuild failed on the guide page (11 of 12) and wrote no search index.
- Feeding those built pages to PacletBuild drops every doc page from the archive.

The build that works puts the authoring notebooks (`build/DocSource`) in `Documentation/` and lets PacletBuild build the docs. That test archive is `work/check-copy/archive/WolframInstitute__DocPageExamples-1.0.0.paclet` (313 KB, 12 doc pages plus indexes). It loads and runs. Because it was built offline, the Lorem page shows failures, so don't release it.

**CheckPaclet** (on the definition notebook built from ResourceDefinition.md):
- Error: the Description is 186 characters; the limit is 128.
- Error: the MainGuide file is missing until the docs are built.
- Error: NoPacletInfoFileCell, which is expected for a Markdown-built notebook.
- Warning: the Categories cell is empty offline.

**Bugs:**
1. `MazeParse` cuts lines longer than the header row without warning, and names the wrong line. `MazeParse[{"##","#S.G#"}]` says "Line 1 is shorter than the header row" and turns row 2 into `#S`.
2. `wolframscript -f mazegen.wls -w 9 -h 5` prints wolframscript's help, because wolframscript takes `-h` itself. The shebang form and `-script` work. The script is not executable.
3. `FindDevices["RandomSignal"]` returns `{}`, but the device page says the class is discoverable. Probably a FindFunction is missing in `DeviceClassRegister` (not tested).
4. The Lorem service cannot run with `$AllowInternet = False`: ServiceFramework 0.1.7 rejects every ServiceExecute in that case, so "no network needed" is not true offline.
5. Small issues:
   - The kernel comment about Amplitude does not match the code.
   - There is no `;` at the end of the package.
   - CodeInspector reports an ambiguous `Return` and a private-symbol warning.

**Documentation:**
- The ResourceDefinition `Highlighted[plot, n]` example stays unevaluated and never shows the path.
- `MazeGenerate` and `MazeParse` have no symbol pages, so their links have no target.
- `SeeAlso: [ImportData]` points to a symbol that does not exist.
- The descriptions leave out the MazeWalkTime page, and "ten pages" is out of date.

**Questions for the owner:**
- (a) Should I fix these in the source? I changed nothing.
- (b) May I set `$AllowInternet = True` in a network-less sandbox, only to confirm that Lorem works when the flag is on?
- (c) Where should `build.wls` find MarkdownToNotebook.wl? Should the build feed `build/DocSource` to PacletBuild?
- (d) The shared WLJS kernel is not responding. It needs your OK to restart (`wljs-server stop` then `wljs-server desktop`), which closes open WLJS notebooks.

## 6. Problems
- **The WLJS kernel is not responding.** `mcp__wljs__kernel_evaluate` and `wljs eval` time out, and the kernel process sits at 0 % CPU. My PacletBuild call (and two trivial probes) are still queued.
  - If they run later, the build will create `work/DocPageExamples/build/WolframInstitute__DocPageExamples/PacletInfo.wl` and return a Failure. It will also leave `testDocPageExamplesBuild`res` in the shared kernel. To clean up: `Remove["testDocPageExamplesBuild`*"]`.
  - I could not tell whether my call or another session caused the hang. Nothing had been written, which suggests the kernel was busy before my call.
- The skill says to build in WLJS. That was impossible, so I built in a fresh, network-less wolframscript kernel.
- CheckPaclet under `wolfram-direct` timed out (120 s limit). I re-ran it with bwrap + wolframscript under the same no-network sandbox, with a longer timeout. This is a route I put together myself, not one listed in ROUTES.
- **Attempted Wolfram server contact, blocked:** DocumentationBuild (inside the front end) tried `PacletInstall` of `WFRCrosslinks`. The search indexer called `EntityValue`/`WolframLanguageData`. Both failed offline (`PacletInstall::notavail`, `EntityValue::conopen`). The network namespace and `$AllowInternet = False` blocked them, and no connection was made. As a result, the search index may lack WolframLanguageData-derived fields, and the WallpaperGroup entity type is unknown to the indexer.
- DocumentationBuild printed `Localized::nokey` for the page types Character Name, Entity, Format, Interpreter, Message, Program, Service Connection and Workflow.
- The guide page failure in build.wls's DocumentationBuild was not diagnosed. Rebuilding it alone hung for more than 400 s.
- The test archive includes a `SearchIndex/5/write.lock` file.
- The local `CheckPaclet.wls` script was not used as is: on a directory it fails inside AgentTools (`formatCheckResult`), as recorded in the skill. I called PacletCICD directly instead.
- In the wolfram-direct runs, `::shdw` warnings come from that tool's session context, not from the paclet.
- Unsure: whether DocumentationBuild in this kernel (15.0) supports these page types fully. Whether the Lorem service works with `$AllowInternet = True` (not tried, by the owner rule).
