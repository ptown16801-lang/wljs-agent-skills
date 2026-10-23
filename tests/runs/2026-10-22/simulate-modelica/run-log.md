# Run log: simulate-modelica (2026-10-22)

## 1. Skills used
- simulate-modelica (local WLJS adaptation; read `ROUTES.md` and the pinned upstream `simulate-modelica/SKILL.md` as it directs)

## 2. Steps
1. Read `ROUTES.md` and the upstream SKILL.md. The local adaptation names the WLJS kernel (`SystemModelSimulate`) as the default engine, so the upstream `wsm_run.py` launcher was not used.
2. Read `work/ExampleModel.mo`: `model ExampleModel`, `x(start=1)`, `y(start=1)`, `der(x) = -x`, `der(y) = y + x`. Plain equations, no external code; no experiment annotation.
3. `mcp__wljs__kernel_evaluate` (WLJS kernel): `{$AllowInternet, $VersionNumber}` returned `{False, 15.}`. Checked that internet was off before running anything.
4. `mcp__wljs__new_notebook` created notebook 023. `add_cells_batch` added 5 cells. The simulation result was held in the qualified name ``simModelicaRun`sim`` so it would not clash with other sessions in the shared kernel.
5. Evaluated in the WLJS kernel via `mcp__wljs__evaluate_cell`, because the results should be visible to the user in a notebook:
   - `.md` title cell.
   - `` simModelicaRun`sim = Module[{m = Import["/abs/.../ExampleModel.mo"]}, SystemModelSimulate[m, 2]] `` returned a `SystemModelSimulationData` (StartTime 0, StopTime 2, Tolerance 1e-6, 2000 interpolation points). There were no messages.
   - A table of x and y at t = 1 and t = 2, with the exact solution next to them (x = e^-t, y = 3/2 e^t - 1/2 e^-t).
   - `SystemModelPlot[..., {"x","y"}, PlotRange -> All]`.
   - `NotebookSave[EvaluationNotebook[], ".../work/ExampleModelSimulation.wln"]`.
6. Ran `tools/capture-wljs-windows.sh` and read the PNG of the notebook window (llm-d7b.wln). The table shows correctly. Opened the plot cell with `mcp__wljs__project_cell` and captured the "Application" window: x decays from 1 to about 0.14 and y grows from 1 to about 11, as expected.
7. `mcp__wljs__kernel_evaluate` (WLJS kernel): `` Remove["simModelicaRun`*"] `` cleared the temporary symbol. To re-run the saved notebook, evaluate its cells in order.

No `wolframscript`, `wolfram-direct` or `wsm-toolkit` was used.

## 3. Files
- Created: `<repo>/tests/runs/2026-10-22/simulate-modelica/work/ExampleModelSimulation.wln`
- Created: `<repo>/tests/runs/2026-10-22/simulate-modelica/scratch/cap/*.png`, `scratch/cap2/*.png` (window captures)
- Created: this run log
- Not changed: `work/ExampleModel.mo`
- System Modeler wrote its own build/result files under `/tmp/WolframSystemModeler-<user>-15.0/` (its default location; `wsml_ExampleModel_lsim_...` .mat/.sim/.exe).

## 4. WLJS notebook
`<repo>/tests/runs/2026-10-22/simulate-modelica/work/ExampleModelSimulation.wln` (still open on the second monitor, plus the projected "Application" plot window)

## 5. Answer
I simulated ExampleModel from t = 0 to 2 s with System Modeler in the WLJS kernel. The tolerance was 1e-6.

| t | x | y |
|---|---|---|
| 1 | 0.367879 | 3.89348 |
| 2 | 0.135335 | 11.0159 |

These match the exact solution, x = e^-t and y = 3/2 e^t - 1/2 e^-t. The largest difference is 1.2e-9 (y at t = 2). The notebook with the table and a plot of x and y is saved as `work/ExampleModelSimulation.wln`.

## 6. Problems
- None in the simulation: no messages, warnings or failures.
- The model file has no `experiment` annotation, so the stop time of 2 s came from the request. The solver settings were the `SystemModelSimulate` defaults (tolerance 1e-6, 2000 output points).
- The upstream skill's step for cleaning up `_wsm_simulate_temp/` does not apply, because the launcher was not used. The intermediate files from `SystemModelSimulate` were left in System Modeler's own `/tmp/WolframSystemModeler-<user>-15.0/` folder, which it manages itself. I did not delete them.
- I did not close the projected "Application" plot window. I opened it, but the instructions do not say to close it.
