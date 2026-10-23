# Run log: wolfram-paclet, 2026-10-22

Request: "Build the paclet's ResourceDefinition notebook from ResourceDefinition.md."

## 1. Skills used

1. `wolfram-paclet` (local WLJS adaptation). I read the file it points to, `ROUTES.md`, and the pinned upstream `skills/wolfram-paclet/SKILL.md` at revision 4d1e139.

## 2. Steps

1. Read the work folder. It holds one paclet, `work/DocPageExamples/`. A `diff -r` showed it is identical to the upstream example `examples/Paclet/DocPageExamples` in the pinned MarkdownToNotebook checkout. I read `ResourceDefinition.md`, `PacletInfo.wl`, `build.wls`, `deploy.wls`, `README.md` and `.gitignore`.
2. Chose the route.
   - Upstream's two routes both reach the Wolfram Cloud: PacletPage installed from a cloud ResourceObject, and the converter as a cloud `ResourceFunction`. The owner rule forbids both.
   - I used the pinned local `MarkdownToNotebook.wl` instead.
   - ROUTES.md and the skill adaptation say to build `.nb` files in a fresh kernel, not in WLJS, because WLJS redefines `Cell`, `Notebook` and other front-end symbols.
   - I chose `wolfram-direct` over plain `wolframscript` because it runs the kernel in a network namespace (bwrap `--unshare-net`). That makes no-contact with Wolfram servers certain, on top of `$AllowInternet = False`.
3. I did not use the paclet's own `build.wls`. It loads the converter by a relative path that is wrong outside the upstream repository. It also rebuilds all documentation and runs `DocumentationBuild`, which is more than the request.
4. Wrote `work/build-resource-definition.wl`.
   - It sets `$AllowInternet = False` and loads the paclet with `PacletDirectoryLoad` (session-only, not an install).
   - It loads the pinned converter and calls `MarkdownToNotebook[src, out, "EvaluateSeparator" -> Automatic, "UseCache" -> False]`. That is the same call as `build.wls` makes. `UseCache -> False` keeps the converter from writing `PersistentSymbol` entries to the user's local store.
   - The output goes to `DocPageExamples/DocPageExamples/ResourceDefinition.nb`, where `build.wls` and `deploy.wls` expect it.
   - It ends with a structural report.
5. **Build.** Engine: a fresh kernel via `wolfram-direct` (`WolframLanguageEvaluator`, network-isolated). Result: 4.4 s, file written (725,579 bytes, sha256 1843693e…4806), `$AllowInternet` False. Cells: 1 Title, 5 Section, 19 Subsection, 12 Input, 25 Output, 4 Notes, 16 Text. No "Unevaluated" sections. Messages: `ServiceExecute::isrv`, `MazeParse::ragged` (intended, it is the Scope example), `CheckboxesCell::autofail`, and `::shdw` notices from the evaluator's session context.
6. **Diagnosing `ServiceExecute::isrv`.** Engine: a fresh kernel via `wolfram-direct`. The Lorem service connects, but every `ServiceExecute` returns `Failure["ConnectionFailure", …]`. The cause is in Mathematica 15.0, `SystemFiles/Components/ServiceFramework/Execute.m` line 74: `If[!PacletManager`$AllowInternet, throwFailure[ServiceExecute, "ConnectionFailure", "isrv", …]]`. It refuses any request while internet is off, even a fully local service; Wolfram's own comment there reads "What if the request does not need internet???". In the same kernel, `ResourceSystemClient`Private`resourceSortingProperties["Paclet"]` returned `<||>` offline. That is why `CheckboxesCell::autofail` appeared and the Categories box is empty.
7. **Inspecting the built notebook.** Engine: a fresh kernel via `wolfram-direct`; `Get` of the `.nb` only, no front end.
   - The Lorem example's output cell is a `Failure` box.
   - The string "Notebook Documents" does not appear, so no category is ticked.
   - The hero image is one closed Input/Output group holding a 604 x 500 raster (h/w 0.83, inside the 400-1500 px and 0.5-1.25 limits).
8. **Definition-notebook check** (the skill's "Check" step). Engine: a fresh kernel via `wolfram-direct` with `UsingFrontEnd`.
   - First try: on a copy in `work/check/`. It reported `PacletDirectoryInvalid`, because the check resolves the paclet from the notebook's location. I deleted that folder.
   - Second try: on a copy placed beside `PacletInfo.wl`. It stopped with "Missing installed package: WFRCrosslinks" and the kernel quit (exit code 3). I deleted the copy. I did not install anything.
   - The built notebook itself was never opened or modified by the check.
9. **WLJS.** No WLJS kernel evaluation. Loading this paclet registers an Import format, an EntityStore (`PrependTo[$EntityStores, …]`), a service and a device class. In the shared WLJS kernel that would change global state seen by other sessions. The fresh-kernel build already evaluated every example.
10. Wrote a summary page, `work/ResourceDefinition-build-summary.md`, and converted it with `tools/md2wln.py` to `work/ResourceDefinition-build-summary.wln`. ROUTES.md asks for results in a WLJS notebook; the ground rules forbid opening one. No window was opened.

## 3. Files

Created:
- `<repo>/tests/runs/2026-10-22/wolfram-paclet/work/DocPageExamples/DocPageExamples/ResourceDefinition.nb` (the deliverable)
- `<repo>/tests/runs/2026-10-22/wolfram-paclet/work/build-resource-definition.wl`
- `<repo>/tests/runs/2026-10-22/wolfram-paclet/work/ResourceDefinition-build-summary.md`
- `<repo>/tests/runs/2026-10-22/wolfram-paclet/work/ResourceDefinition-build-summary.wln`
- `<repo>/tests/runs/2026-10-22/wolfram-paclet/run-log.md` (this file)

Created and then deleted: `work/check/ResourceDefinition-checkcopy.nb` and `work/DocPageExamples/DocPageExamples/ResourceDefinition-checkcopy.nb`.

Outside the work folder:
- Request JSON and `.wl` diagnostic files in the session scratchpad (`<tmp>/.../scratchpad/`).
- `wolfram-direct`'s own run records under `~/.local/state/wolfram-agenttools-direct/runs/` (run-pyglagne, run-q7_ss8ek, run-cw1aoa7l, run-pjk40w1m, run-e1kkyj55, run-xtf56mjl, run-0jd6_eso, run-v78pob57). The tool writes these on every call.

No source file of the paclet was changed.

## 4. WLJS notebook

`<repo>/tests/runs/2026-10-22/wolfram-paclet/work/ResourceDefinition-build-summary.wln`. It is a summary page converted from `.md` and was not opened.

## 5. Answer

The definition notebook is built: `DocPageExamples/DocPageExamples/ResourceDefinition.nb`, beside `PacletInfo.wl`, where your `deploy.wls` expects it.
- It was built offline with the local MarkdownToNotebook converter, in a fresh kernel with networking blocked. The build took 4.4 s.
- The title, description, details, long description, 12 examples and the hero image (604 x 500) are all filled in.
- The maze, entity and device examples evaluated correctly.
- To rebuild: `Get["…/work/build-resource-definition.wl"]` in a fresh kernel.

It is not ready to submit yet:
1. **The "Lorem" example (Basic Examples, 4th) shows a Failure.** Mathematica's ServiceFramework refuses every `ServiceExecute` while `$AllowInternet` is `False`, even though the Lorem service is fully local. Question for you: may I rebuild with `$AllowInternet = True` for this one build? The kernel would stay inside the network-blocked sandbox (`wolfram-direct`), so nothing could reach Wolfram servers, but it breaks the "keep `$AllowInternet = False`" rule. The other options are to leave the failure or to drop or rewrite that example.
2. **The Categories box is empty.** The list of valid categories comes from the Paclet Repository server and could not be read offline, so "Notebook Documents & Presentation" is not ticked. Tick it by hand, or rebuild online if you lift the rule for that.
3. **The Description does not match `PacletInfo.wl`.** The skill requires an exact match; which text should both use?
   - ResourceDefinition.md: "One documentation page of every reference page type - format, service connection, …"
   - PacletInfo.wl: "A minimal real paclet backing one documentation page of every reference subtype: …"
4. **There is no `## Author Notes` section**, though ContributedBy names Claude. The skill requires an AI-assistance disclosure (model, human supervisor, which parts are generated or hand-edited) before submission.
5. **The repository's own check did not run.** `CheckDefinitionNotebook` needs the `WFRCrosslinks` package, which is not installed, and I did not install it.

Nothing was deployed, submitted or installed.

**Decision received after the report (coordinator's scripted reply for this test):**
- **Question 1, answered no.** `$AllowInternet` stays `False`, even inside the sandbox. I did not rebuild. The Lorem example's Failure output stays in the notebook and is recorded as a known limitation: offline, `ServiceExecute` cannot run even a fully local service.
- **Items 2-5 above and the unrendered-notebook point are left for the owner.** They remain open: the empty Categories box, the Description mismatch, the missing Author Notes, the check that did not run (`WFRCrosslinks` not installed), and the fact that the notebook was not looked at rendered.

The work then ended; nothing more was done.

## 6. Problems

- `ServiceExecute::isrv` makes the Lorem example output a `Failure`, caused by Wolfram's hard `$AllowInternet` gate (step 6). The deliverable contains this failed output. The coordinator decided to keep it: it is a known limitation, not something to fix.
- `CheckboxesCell::autofail` leaves the Categories empty offline.
- `CheckDefinitionNotebook` stopped: "Missing installed package: WFRCrosslinks", the kernel quit with exit code 3. The first attempt on a copy outside the paclet directory gave `PacletDirectoryInvalid` (expected, given where the copy was).
- `MazeParse::ragged` is expected; it is the documented Scope example.
- `::shdw` messages (`p`, `name`, `tag`, `arguments`, `rules`, `value`) come from the `wolfram-direct` evaluator's `Sessions`…`` context. They are harmless.
- My `Internal`HandlerBlock` message capture in the build script returned an empty list. The evaluator seems to handle messages itself; I read the messages from its stderr instead.
- Content issues in the source, left unchanged because they need the owner's decision: the Description mismatch with `PacletInfo.wl`, the missing Author Notes, and no `## Usage` section. "Basic Description" fills the LongDescription; the converter supports that fallback.
- I did not run upstream's preferred `BuildPacletDocumentation`/PacletPage route: it needs a cloud install, which the owner rule forbids.
- Not done visually: I did not look at the notebook rendered. I checked its structure and the hero raster's dimensions only. Opening it in Mathematica or WLJS would open a window.
