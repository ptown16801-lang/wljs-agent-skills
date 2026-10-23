# Level C review, reviewer C (Oct 22, 2026)

Skills reviewed: `paclet-build`, `modelica-model-architecture`, `wolfram-data-repository`. All three ran in two stages, and I reviewed the final state.

## Disagreements

1. **modelica-model-architecture: the cause of the WLJS kernel hang.**
   - The verdict blames the hang on this run's combined call. Its route says "possibly by this run's combined call", and it lists the finding "possible cause ... combined reload + failing-assert simulation call". The session records contradict both.
   - Across all subagent records, the last WLJS call that returned was this run's comparison call (06:18:53Z, returned 06:19:09Z).
   - The next call never returned: annotate-modelica-plots' plain Import + SystemModelSimulate at 06:19:13Z.
   - Five more first calls went pending before this run's combined call at 06:23:26Z: annotate-modelica-animation, wolfram-paclets, annotate-control-panel, annotate-modelica-graphics and paclet-build.
   - So that call cannot have caused the hang.
   - The `ROUTES.md` note "Kernel hung Oct 22 (~02:20) ... Best candidate" needs the same correction. I did not edit it because it is outside my write scope.
2. **modelica-model-architecture: route partial → pass, notebook partial → pass.**
   - Route: WLJS was the default, and every WLJS call before the hang returned without messages. The run then switched to `wsm-toolkit`, the listed route for model files, and stated why.
   - Notebook: the card sets `notebook=False`, and md2wln (unevaluated cells) was the method the brief prescribed.
3. **wolfram-data-repository: correct pass → partial.**
   - The card's "examples previewed in WLJS" was not met, because the kernel was hung.
   - The source's `Categories` and `ContentTypes` are missing from both built notebooks (`CheckboxesCell::autofail` offline).
   - Both causes are external, so the rubric grade is "limited", not "works".
   - The claim "no unfilled slots" is imprecise. WallpaperGroups has 3 template-default placeholder cells tagged `MTNUnfilled` and TPTP has 2. These are optional sections the sources leave empty, so this is by design and not an error.
   - The skill's status line ("Level B partial") stays correct.

No disagreement with paclet-build.

## What I checked myself

All Wolfram runs were fresh kernels with `$AllowInternet = False;` as the first line, inside `bwrap --unshare-net --unshare-pid`. `wsm-toolkit` ran inside `bwrap --unshare-net`. All output is in `scratch-C/`.

- **paclet-build:**
  - Both `.paclet` SHA-256 values match the run log.
  - I extracted the with-docs archive myself; it is `diff -r` identical to the source paclet. The paclet resolves only to my copy.
  - MazeGenerate, MazeWalkTime and the MazeParse `::ragged` message all work.
  - All 12 doc URIs resolve inside my copy.
  - The 12 pages and `ResourceDefinition.nb` load as Notebook with no `General::stop`. Message cells appear only on the ragged page (intended) and the Lorem page (`isrv`).
  - The real FE `init.m` is unchanged (`a885e026...`), and nothing was installed.
  - Unreported but benign:
    - every page has `CitationPopupData -> {$Failed, ""}`;
    - the archive ships a stale `SearchIndex/5/write.lock`.
- **modelica-model-architecture:**
  - Layout: one class per file, and `package.order` at every level.
  - The installed source copy is unchanged.
  - I simulated new and original ElectricCircuit2 and BlockCircuit. Largest differences on a 0.01 s grid:

    | Model | Largest difference |
    |---|---|
    | ElectricCircuit2 | 2.10e-15 |
    | BlockCircuit | 1.38e-12 |

  - The values at t = 10 s are -0.0480203 and -0.0449849.
  - The new models give 0 warnings; the originals give the stated "Unbound parameter" warnings.
  - MidpointTest: balanceError 0, midpointError 1.1e-16.
  - The R=11 mutation fails its assert at t = 0.005 s, as the log says.
- **wolfram-data-repository:**
  - From the index I get 26264 problems, 4565 at the frontier, and GRP ratings min 0, median 0.18, max 1 over 1207 problems. These equal the source's expected outputs.
  - The two notebooks have 150 and 223 cells (12/10 and 17/13 Input/Output), with no Message cells.
  - Outputs include 17, {0,0,0,0,0,0} and `<|0 -> 17|>`.
  - The `$Failed` hits are Dataset internals.
  - The process kills were of the run's own processes. Each had the run's files open, or started 12 s after its own launch, with no other front-end launch at that time.
  - Its `Begin[...]` WLJS call followed the brief it was given at the time.

## Notes for the orchestrator

- paclet-build left a with-docs CreatePacletArchive call queued in the hung WLJS kernel. If the kernel resumes without a restart, `PD/build/with-docs/` will appear.
- The wolfram-data-repository run left a call queued that contains `Begin` and `res = ...` in one input. If the evaluator parses the whole input first, `Global`res` would be left set: the same pattern review B saw clobber another session's value.
- Questions, since no user is available:
  - Was the WLJS kernel restarted after 06:19Z? If yes, both queued calls are gone and these notes are moot.
  - Should `ROUTES.md`'s hang note be rewritten from this timeline?
