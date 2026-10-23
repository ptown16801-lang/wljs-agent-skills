# Run log: validate-modelica (2026-10-22)

Request: "Do these Modelica models compile? ExampleModel.mo and Broken.mo."

## 1. Skills used

1. `validate-modelica` (local WLJS adaptation). As it instructs, I read `ROUTES.md` and the pinned upstream `validate-modelica/SKILL.md` (toolkit 991a800).

## 2. Steps

1. Read `ROUTES.md`, the upstream SKILL.md, and both model files. `ExampleModel` has 2 states (`der(x) = -x; der(y) = y + x;`). `Broken` is the same model, but line 6 reads `der(y) = y + z;` and `z` is never declared.
2. Under the ROUTES rule for the shared System Modeler namespace, I made renamed copies in `scratch/` (`ExampleModel_vm22.mo`, `Broken_vm22.mo`; only the class name changed, via `sed`). The originals were not changed.
3. **WLJS kernel** (`mcp__wljs__kernel_evaluate`; the skill's default engine). I checked `{$AllowInternet, $VersionNumber}` → `{False, 15.}`.
4. **WLJS kernel**: `Import` of ExampleModel_vm22, then `SystemModelSimulate[m, 1]`. Result: `SystemModelSimulationData`, x(1) = 0.3678794411090668 (= e^-1), y(1) = 3.893483022849462.
5. **WLJS kernel**: `Import` of Broken_vm22 succeeded (the parse is fine). My first try at capturing its messages used a faulty handler and gave only "Null" entries, so it was discarded. I reran with `EvaluationData[SystemModelSimulate[SystemModel["Broken_vm22"], 1]]`, which returned unevaluated with the messages `SystemModelSimulate::bld` "Failed to build model Broken_vm22." and `SystemModelSimulate::bldl` "Error: Element not found. When looking up 'z' in scope 'Broken_vm22', 'z' was not found in 'Broken_vm22'."
6. **wsm-toolkit** (`wsm-toolkit wsm --mode validate`, which is upstream `wsm_run.py` → WSMKernelX 15.0). I ran it inside `bwrap --unshare-net ...` under `timeout 120`, once on each original file, with a fresh `--tempdir` in `scratch/`. This is the upstream skill's flatten check, used as a cross-check of the WLJS result. I read the `validate.out.json` fields:
   - ExampleModel: `status.flatten = "Pass"`, no errors or warnings. The flat model is the 2 equations.
   - Broken: `status.flatten = "Fail"`, one error: type LOOKUP, id 20004, location 6:3, "Element not found. When looking up `z` in scope `Broken`, `z` was not found in `Broken`." No warnings.
7. **WLJS notebook** (`mcp__wljs__new_notebook` → `add_cells_batch` → `evaluate_cell`, every cell including the `.md` cells). It has a title cell, the ExampleModel import + simulate (values), `SystemModelPlot` of x and y with `PlotRange -> All`, the Broken import + build messages, a result table, and a save cell. Variables live in a private context (`vm22``...`), not Global. I saved it with `NotebookSave[EvaluationNotebook[], ".../work/ModelicaValidation.wln"]`, which returned `RemoteNotebook[...]`; the file is 5729 bytes.
8. Visual check: I ran `tools/capture-wljs-windows.sh` and found my window (`llm-b89.wln`): the markdown renders and the plot draws. I projected the Broken cell (`project_cell` → "Application" window) and captured it: the red build-error text shows. The other window captured (`llm-716.wln`, blank) is not mine and I left it alone.
9. **WLJS kernel**: `Remove["vm22`*"]` → `Names["vm22`*"] = {}`.

## 3. Files

- Created: `<repo>/tests/runs/2026-10-22/validate-modelica/scratch/ExampleModel_vm22.mo`
- Created: `<repo>/tests/runs/2026-10-22/validate-modelica/scratch/Broken_vm22.mo`
- Created: `.../validate-modelica/scratch/_wsm_validate_ExampleModel/` (toolkit temp dir, includes `validate.out.json`)
- Created: `.../validate-modelica/scratch/_wsm_validate_Broken/` (toolkit temp dir, includes `validate.out.json`)
- Created: `.../validate-modelica/scratch/cap/`, `.../scratch/cap2/` (window captures, PNG)
- Created: `<repo>/tests/runs/2026-10-22/validate-modelica/work/ModelicaValidation.wln`
- Created: this run log
- Not changed: `work/ExampleModel.mo`, `work/Broken.mo`

## 4. WLJS notebook

`<repo>/tests/runs/2026-10-22/validate-modelica/work/ModelicaValidation.wln` (still open in WLJS as `llm-b89.wln`, along with an "Application" projection window of the Broken output cell).

## 5. Answer

- **ExampleModel.mo compiles.** It flattens cleanly (no errors or warnings), builds, and simulates. Over 0..1 s it gives x(1) = 0.3679 (= e^-1, as expected for der(x) = -x) and y(1) = 3.8935.
- **Broken.mo does not compile.** Line 6, `der(y) = y + z;`, refers to `z`, which is never declared ("Element not found ... 'z' was not found in 'Broken'"). The file parses fine, but flattening fails at that lookup. To fix it, declare `z` (e.g. `Real z;` plus an equation for it) or replace `z` with the variable you meant (probably `x`, as in ExampleModel).

Both engines agree: the WLJS kernel (System Modeler from Wolfram Language) and the official toolkit's WSMKernelX flatten. The results and a plot are in the notebook `work/ModelicaValidation.wln`.

## 6. Problems

- My first message-capture attempt for Broken (an `Internal`HandlerBlock` handler) collected only `"Null"` strings. It was my mistake, not a tool fault; the `EvaluationData` rerun gave the real messages.
- `wsm-toolkit` exits 0 even when the flatten fails. The result is only in `status.flatten` of `validate.out.json`, which is what I read.
- The upstream skill says to delete the temp dir after validation. I kept the two `_wsm_validate_*` dirs because they are in this run's `scratch/` (not next to the models) and serve as evidence. They can be deleted.
- The classes `ExampleModel_vm22` and `Broken_vm22` stay registered in the shared kernel's System Modeler namespace. I found no unload function to use and did not look further. Their names are unique, so they should not collide with other sessions.
- The notebook was saved before I opened the projection window. That window is not part of the file.
- No warnings from either engine on ExampleModel. No call came near the 220 s limit.
