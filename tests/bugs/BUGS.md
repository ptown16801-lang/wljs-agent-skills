# Defects found while testing Wolfram agent skills (Oct 22, 2026)

Found during automated testing of 70 Wolfram agent skills on the WLJS notebook engine (fresh Claude agents ran each
skill on Wolfram's own example material; independent reviewers re-checked the results). Every item below was then
**reproduced by hand** with the script or command given, offline (`$AllowInternet = False`, network namespace cut).
Items that were reported by a test agent but not reproduced are listed separately at the end and are not claimed.

Environment: Wolfram Mathematica 15.0 and Wolfram System Modeler 15.0 on Linux x86-64.

## Wolfram products (Mathematica / System Modeler 15.0, and Wolfram's System Modeler AI toolkit)

### W1. Sample model `ExampleData/Submarine.mo` does not build on its own
- **Where:** `<Mathematica 15.0>/Documentation/English/System/ExampleData/Submarine.mo` (also returned by `FindFile["ExampleData/Submarine.mo"]`).
- **Reproduce:** `tests/bugs/submarine.wls`:
  `Import[".../ExampleData/Submarine.mo"]; SystemModelSimulate[SystemModel["Submarine"], 50]`
- **Actual:** `SystemModelSimulate::bldl: Invalid discrete-time construct. 'buoyancyDynamics.y <= (-1) *
  buoyancyDynamics.R' is a real elementary relation, it cannot occur in a construct whose switching condition is
  non-discrete-time.`
- **Expected:** builds, like the bundled library copy `DocumentationExamples.Control.Submarine`, which simulates.
- **Cause:** the sample file's equation reads `... else if y <= (-1) * R then V0 else 0`; the library copy has
  `else if noEvent(y <= (-1) * R) then ...`. The sample file was not updated with that fix.
- **Impact:** low. The documentation pages (`SystemModel`, `ConnectSystemModelController`) use the library model,
  not this file; a user who imports the sample file gets a build error.
- **Not fixed locally:** the file is part of the root-owned Wolfram installation (`<Wolfram-install-root>`); changing it needs administrator rights, which this work does not use. Workaround (in use): the library copy `DocumentationExamples.Control.Submarine`, or the test fixture `tests/cards/fixtures/Submarine-nographics.mo`.

### W2. ServiceFramework refuses every request while `$AllowInternet` is False, including local services
- **Where:** `SystemFiles/Components/ServiceFramework/Execute.m`, line 74 (same in paclet ServiceFramework 0.1.7):
  ```
  (* What if the request does not need internet??? *)
  If[!PacletManager`$AllowInternet,
      throwFailure[ServiceExecute, "ConnectionFailure", "isrv", {service}]
  ];
  ```
- **Reproduce:** `tests/bugs/docpageexamples.wls` (item 4): load a paclet that defines a purely local service
  (the Wolfram Institute `DocPageExamples` "Lorem" service), then `ServiceExecute[ServiceConnect["Lorem"], ...]`
  with `$AllowInternet = False` returns `$Failed` with `ServiceExecute::isrv`.
- **Expected:** a service that needs no network runs offline.
- **Note:** the developers' own comment above the check records the open question. Impact: medium for offline or
  air-gapped use; documentation examples built offline show connection errors.
- **Not fixed locally:** the file is part of the root-owned Wolfram installation (`<Wolfram-install-root>`); changing it needs administrator rights, which this work does not use. Workaround: call a local service's own functions directly instead of `ServiceExecute`, or allow internet for that one call if the owner agrees.

### W3. Loading the documentation-build package triggers a paclet download attempt
- **Where:** `SystemFiles/Components/PacletTools/DocumentationBuild/Kernel/Export.wl`, line 14:
  `PacletInstall["WFRCrosslinks"];` runs unconditionally when the package loads, so every documentation build (and
  `PacletBuild` of a paclet with documentation) asks the paclet server for `WFRCrosslinks`.
- **Observed:** offline it fails with `PacletInstall::notavail`; with `$AllowInternet = False` an `strace` of the
  whole process tree showed no DNS query and no internet connection (so the setting does guard it).
- **Impact:** low, design: an unannounced network call during a local build, a concern for offline or
  privacy-sensitive builds. Not a crash.
- **Not fixed locally:** the file is part of the root-owned Wolfram installation (`<Wolfram-install-root>`); changing it needs administrator rights, which this work does not use. Harmless in this setup: with `$AllowInternet = False` the download is never attempted (strace).

### W4. System Modeler AI toolkit: automatic diagram layout draws lines to the wrong connector positions
- **Where:** Wolfram's official System Modeler AI toolkit (commit `991a800`),
  `annotate-modelica-graphics/Schematic/routing.py:34-68` (`_lib_edge`, fallback `return "L"` at line 68).
- **Reproduce and full analysis:** `tests/bugs/wsm-schematic/REPORT.md` (three commands, pure Python).
- **Actual:** on the Submarine model, 5 of 7 MSL connector ends are drawn at the wrong place (`position.flange`,
  `prismatic.axis`, `prismatic.frame_b`, `world.frame_b`, and `position.s_ref` by 2 units); lines cross icons.
- **Cause:** library connector positions are guessed from port names; unknown names fall back to the left-edge
  midpoint, and offsets are always edge midpoints. The skill text says lines terminate "exactly on the pin".
- **Impact:** medium for this tool: generated diagrams look wrong for mechanics/MultiBody models and need hand fixes.
- **Fix (applied locally Oct 22, verified):** new `Schematic/libpins.py` reads each connector's `Placement` from the
  installed library source (following `extends`, flips and rotation, the class's icon coordinate system); the name
  guess is kept only as a fallback that now prints a warning per guessed end. Submarine: every checkable end OK (was
  8 OK / 6 wrong), re-run by the orchestrator. Against the line ends stored in all 193 bundled example models: 98.0% of
  5,642 ends match (old guess 35.3%). Still open: lines can cross their own icon (routing ignores pin direction)
  (`patches/W4-wsm-toolkit-pins.diff`, `fixes/W4.md`).
- **Independent review (K):** agree with notes. Not disclosed at first: since the layout now sees the real pins, it rotates more components (223 of 2,352 components in 77 of 193 files; e.g. DCMotor stands one part upright with both lines into its centre). Overall fewer lines cross icons (708 -> 592 of 1,042 lines in the 135 single-model files). The toolkit's SKILL.md claimed every line leaves its pin perpendicular; that sentence now states the routing limit instead.

### W5. AgentTools `WolframDebugging`FailedAssertions` reports 0 failures after the function was called once
- **Where:** Wolfram's AgentTools `wolfram-debugging` helper `WolframDebugging.wl` (commit `744d2d1`), with Wolfram
  Language 15.0. Found by a test agent, confirmed by an independent reviewer, reproduced by the orchestrator.
- **Reproduce:** `tests/bugs/assert-helper.wls` (assertions Off throughout, network-cut fresh kernel). For
  `Compute[x_] := Block[{y}, y = x^2; Assert[y > 5]; Sin[y]]` (Wolfram's `ExampleData/FunctionWithAssert.wl`):
  `FailedAssertions[Compute[1]]["Count"]` is 1 right after `Get`, **0 after one plain call `Compute[1]`**, and 1 again
  after reloading the file. Same for a typed function with a `Block` body; a `Module` body is not affected.
- **Impact:** medium for debugging: the helper can report "no failed assertions" for code that does fail one. An
  On/Off toggle resets it; `ClearSystemCache[]` does not (reviewer G). Mechanism not established.
- **Workaround:** call `FailedAssertions` right after (re)loading the definitions.
- **Fix (applied locally Oct 22, verified):** mechanism (inferred from behaviour; the kernel's internal state cannot be inspected): with `Assert` Off and no handler, `Assert[test]` evaluates to
  itself, the evaluator marks that stored node as fully evaluated, and later calls skip it without calling `Assert`, so
  the handler is never reached; a stored definition shares that node across calls when the arguments do not appear in
  it (e.g. a `Block` body). `Update[Assert]` clears the marks (as `On`/`Off[Assert]` do). One line added before the handler
  block in `FailedAssertions` (`patches/W5-failedassertions.diff`, note `fixes/W5.md`). Reproduction now 1 / 1 / 1 (was
  1 / 0 / 1), re-run by the orchestrator; Wolfram's own suite 123/123 before and after.
- **Independent review (K):** agree with notes; 1/0/1 -> 1/1/1 confirmed, two extra cases (no `Block`, nested call) 0 -> 1, Assert Off state unchanged, suite 123/123.

## WLJS Notebook 3.1.4 (open source, wljs.io)

### J1. Saving a notebook from the kernel triggers a false "File hash mismatch" dialog
- **Where:** `modules/wljs-editor/src/RemoteCells.wl`, `exportNotebook[notebook_, savingPath_, "wln"]`.
- **Reproduce:** in a WLJS notebook evaluate `NotebookSave[EvaluationNotebook[], "/abs/x.wln"]`; within about 3 s the
  editor shows "File hash mismatch: File was changed outside" (Reload / Cancel), every time.
- **Cause:** the export sets `notebook["Path"]` and writes the file but never updates `notebook["FileHash"]`; the
  editor's periodic check (`dumpHashCheckUpdate`, `Frontend/App.wlx:82`) then compares the stale hash with the file it
  just wrote and reports an outside change.
- **Fix (applied locally, verified):** after `Close[stream]` add `notebook["FileHash"] = FileHash[savingPath];`. With
  it, the same save raises no dialog (checked for 15 s; before the fix it appeared in ~3 s, 4 times in 4 saves).

### J2. WLJS dialogs open on the primary monitor, not over their window
- **Where:** `Electron/main.js`: `dialog.showMessageBox(...)` / `showOpenDialog` / `showSaveDialog` are called without a
  parent window (e.g. the IPC handler `showMessageBox` used by the editor), so the window manager centres them on the
  primary display. Fix applied locally: pass the focused (or a visible) WLJS window as parent; verified (dialogs now
  open over the WLJS window).

### J3. Saving a notebook from the kernel does not store its graphics; plots show "Loading..." after a restart
- **Where:** `modules/wljs-editor/src/RemoteCells.wl`, kernel-side `saveNotebook` / `exportNotebook`. The GUI save fires
  `OnBeforeSave` (`FrontendObjectSync.wl:145`), which fetches every graphics object from the window into the file's
  `Objects` section; the kernel-side `NotebookSave[EvaluationNotebook[], path]` skips it.
- **Reproduce:** `tests/bugs/wln-save-test/`: a notebook with `Plot[Sin[x], {x, 0, 6}]` saved from a cell is 1276 bytes,
  holds one `FrontEndRef[...]` and an empty `ObjectFields:`; after a WLJS restart the reopened plot stays "Loading..."
  (`after-restart.png`, checked after 20 s). Found by Level C reviewer H from the source; confirmed by the orchestrator.
- **Impact:** high for agents: every plot saved this way is lost once the app restarts (the cell code is kept, so
  re-evaluating redraws it).
- **Fix (applied locally by the owner, verified Oct 22):** `wln-save-test/J3-proposed-patch.md` /
  `RemoteCells.wl.patched`: write the file as before, then fire `OnBeforeSave` with the notebook's window
  (`notebook["Socket"]`) and write again. Verified on a notebook opened from disk: the cell save logged
  `OnBefore Save` / `Number of requests to resolve: 1`, the file grew from 2.4 KB to 24 KB with `ObjectFields: Objects,
  Symbols`; after a full WLJS restart the reopened notebook drew the plot without re-evaluation (log
  `FrontendObject`Sync >> restored!`). Before: `wln-save-test/J3-reopen-before.png` ("Loading..."); after:
  `wln-save-test/J3-after-restart-fixed.png`. Together with J4 (below) this also covers notebooks created through
  the API/MCP.

### J4. Notebooks created through the WLJS API / MCP get none of the extensions' listeners (graphics never stored)
- **Where:** `modules/wljs-api/src/Frontend.wl:300`, `apiCall[..., "/api/notebook/new/"]` calls
  `saveNotebook[nb]` (`loader`save`) without `"Events"`, so `Loader:NewNotebook` goes to the default `"Blackhole"`
  (`Kernel/Loader.wl:238`) instead of `AppExtensions`AppEvents`. The GUI passes `"Events" -> AppEvent`
  (`Frontend/ExtendedApp.wlx:70`, set to `AppExtensions`AppEvents` in `Scripts/start.wls:389`).
- **Effect:** the listeners that extensions attach on `Loader:NewNotebook` never attach: the frontend-object sync
  (`wljs-editor/src/FrontendObjectSync.wl:118`, so no save, GUI or kernel, stores the notebook's graphics), the table of
  contents (`wljs-toc`) and the print redirect (`wljs-print-redirect-fix`); also `start.wls`'s handler that exposes the
  notebook's directory. Every notebook an AI agent makes through the WLJS MCP (`new_notebook`) is affected.
- **Reproduce:** after a restart, `mcp__wljs__new_notebook`, add a plot and save it: the server log
  (`~/.local/state/wljs/desktop.log`) shows `filepath: /tmp/wljs_quicknotes/llm-....wln` but never `Attach event
  listeners to notebook from EXTENSION`, and the saved file has an empty `ObjectFields:` even with J3 fixed
  (`wln-save-test/J3-after-patch.wln`). Opening a `.wln` from disk does log the four `Attach event listeners` lines
  and saves objects (`J3-reopen.wln`). Found and confirmed by the orchestrator, Oct 22.
- **Fix (one line; installed by the owner, verified Oct 22):** `wljs-api-events/Frontend.wl.patched`:
  `Then[saveNotebook[nb, "Events" -> AppExtensions`AppEvents], Echo];`. After a restart, `mcp__wljs__new_notebook`
  logs the six `Attach event listeners` lines; a plot saved from a cell gave a 20 KB file with `ObjectFields: Objects,
  Symbols`, and after a second full restart the reopened notebook drew the plot without re-evaluation
  (`wljs-api-events/J4-after-restart.png`).

## Wolfram Institute example material (MarkdownToNotebook repository, commit `4d1e139`)

### I1. Example `build.wls` leaves stray `General::stop` cells on built documentation pages
- **Where:** `examples/Paclet/DocPageExamples/build.wls`.
- **Observed:** the build converts every page twice in one kernel; a message issued a third time then adds a
  "Further output of ... will be suppressed" (`General::stop`) message cell to the finished page. The paclet's
  `ReferencePages/Messages/MazeParse/ragged.nb` has 1 such cell after `build.wls` and 0 when each page is converted
  in its own fresh kernel (both builds read back and counted).
- **Impact:** low; visible noise on a published reference page.
- **Fix (applied locally Oct 22, verified):** `build.wls` writes each page from its first conversion; message state is reset
  per page and per example cell (`captureCellRun`). `General::stop` cells 1 -> 0 in authoring and built pages; other pages
  unchanged; converter tests 174/174 before and after (`patches/I1-build-stray-general-stop.diff`, `fixes/I1.md`).
- **Independent review (K):** agree (re-run; see `tests/levelC/review-K.md`).

### I2. `DocPageExamples` example paclet: three functional defects
Reproduce all with `tests/bugs/docpageexamples.wls`:
1. `MazeParse[{"#####", "#S..G##"}]` cuts the longer second line to the first line's width without saying so,
   and its message reads `MazeParse::ragged: Line 1 is shorter than the header row`, naming the wrong line (line 1
   is the header; line 2 is the longer one).
2. `MazeGenerate[{1, 1}]` returns `{{#,#,#},{#,G,#},{#,#,#}}`: the goal overwrites the start, so the maze has no
   start cell (`MazeWalkTime` then returns `Missing["NotReachable"]`).
3. The MAZE format page (`docs/MAZE.md`, line 28) says `Import["file.maze"]` imports a maze; the format does not
   register the `.maze` extension, so `Import["t.maze"]` reads it as a table of strings. `Import[f, "MAZE"]` works.
- **Fix (applied locally Oct 22, verified):** the ragged-row message names the right line and says longer/shorter with both
  lengths (docs updated); `MazeGenerate[{1,1}]` now issues `MazeGenerate::small` (docs: at least two cells); the `.maze`
  extension is registered (via `FileFormatDump\`AddFormat`, undocumented, checked on 15.0), so `Import["t.maze"]` and
  `Export["u.maze", ...]` work (`patches/I2-docpageexamples-maze-defects.diff`, `fixes/I2.md`).
- **Independent review (K):** agree. The old ragged-row message always named the shortest line, so the defect was wider than stated above.

### I3. `BlochSphereGates` example Demonstration: four factual errors in the text
Source: `examples/Demonstration/BlochSphereGates.md`. Reproduce the arithmetic with `tests/bugs/bloch.wls`.
1. Line 20 says "the eight single-qubit gates"; the code (lines 24-30) defines seven: I, H, X, Y, Z, S, T.
2. Line 80 says three T gates "reach the same point a single S would (since T^2 = S)": two do (`T.T == S` is True,
   `T^3 == S` is False); three take |+> to the Bloch point (-1/Sqrt[2], 1/Sqrt[2], 0).
3. Line 89 says Y takes |+> to -|+> ("same Bloch point"): Y.|+> = -I |->, the opposite point (-1, 0, 0).
4. Line 71 says the H, X, Z path "walks around the equator": the drawn path is straight chords (+z -> +x -> +x -> -x),
   the last through the centre of the sphere.
- **Fix (applied locally Oct 22, verified):** text only (code byte-identical): seven gates; two T gates equal S, the third
  reaches (-1/Sqrt[2], 1/Sqrt[2], 0); Y|+> is the opposite point; the H,X,Z path is straight chords. `bloch.wls` re-run by
  the orchestrator; the Demonstration's code runs with no messages (`patches/I3-bloch-sphere-text-errors.diff`).
- **Independent review (K):** agree (re-run; see `tests/levelC/review-K.md`).

### I4. MarkdownToNotebook drops a symbol page's Keywords
- **Where:** `MarkdownToNotebook.wl` (commit `4d1e139`): the guide, tutorial and overview builders fill the Keywords
  cells (`fillDocList[nb, "Keywords", ...]` at lines 4609, 4656, 4822, inside `guideNotebook`, `tutorialNotebook`,
  `overviewNotebook`); the symbol-page builder never does.
- **Reproduce:** build `examples/Paclet/DocPageExamples/docs/MazeWalkTime.md` (front matter
  `Keywords: [maze, walking time, shortest path, quantity, units]`) and read the page back with `tests/bugs/symbol-keywords.wls`:
  `Cases[nb, Cell[c_, "Keywords", ___] :> c, Infinity]` gives `{}`; the words appear only in hidden metadata.
- **Impact:** low-medium: reference pages lose their search keywords in the Documentation Center.
- **Fix (applied locally Oct 22, verified):** `fillDocList[nb, "Keywords", ...]` added to `symbolNotebook`; MazeWalkTime's
  Keywords {} -> {maze, walking time, shortest path, quantity, units}; guide and tutorial pages identical before/after
  (`patches/I4-symbol-page-keywords.diff`, `fixes/I4.md`).
- **Independent review (K):** agree (re-run; see `tests/levelC/review-K.md`).

### I5. `wolfram-data-repository` skill: the category list says 34 but lists 35 (minor, documentation)
- **Where:** MarkdownToNotebook `skills/wolfram-data-repository/SKILL.md`, lines 90-97: "The valid set is exactly these
  34" followed by 35 comma-separated names (counted). Which one is extra cannot be checked offline (the authoritative
  list comes from Wolfram's resource system).
- **Fix (applied locally Oct 22):** the definition-notebook template shipped with Mathematica 15.0
  (`SystemFiles/Links/DataResource/Kernel/Templates/DataResourceDefinition.nb`) has exactly these 35 categories, so the
  text now says 35 and cites the template (`patches/I5-data-repository-category-count.diff`). The online list was not checked (offline rule).
- **Independent review (K):** agree with notes (35 matches the 15.0 template). The edited sentence still credited the online registry; it now cites only the template and says the online list was not checked.

## Reported by test agents, not reproduced (not claimed)
- MarkdownToNotebook hangs when an expected-output comment quotes a message text.
- `wsm-toolkit` diagnose summary counts one linear system as "2 coupled nonlinear systems".
- `FindDevices["RandomSignal"]` returns `{}`; `mazegen.wls -h` collides with wolframscript's own `-h`.

None of this has been reported to Wolfram or the Wolfram Institute; under the owner's rule nothing was sent.
