# Run log: wolfram-language-modelica (2026-10-22)

Request: "Using ExampleModel.mo, sweep x(0) over 0.5, 1, 2 and report y at t = 1 for each; check against the exact solution."

## 1. Skills used

1. `wolfram-language-modelica` (local WLJS adaptation; read `ROUTES.md` and the pinned upstream `SKILL.md` as it instructs)

## 2. Steps

1. Read `ROUTES.md`, the upstream skill, and `work/ExampleModel.mo` (`der(x) = -x; der(y) = y + x; x(start=1), y(start=1)`).
2. Worked out the exact solution by hand: x = x0 e^-t, y = (1 + x0/2) e^t - (x0/2) e^-t, so y(1) = (1 + x0/2) e - x0/(2e).
3. **WLJS kernel via `mcp__wljs__kernel_evaluate`**: checked `{$AllowInternet, $Version}` → `{False, "15.0.0 ..."}`. Engine choice: WLJS is the skill's default route.
4. **WLJS kernel via `mcp__wljs__new_notebook` / `add_cells_batch` / `evaluate_cell`** (visible notebook, as the rules require for results the user sees). Cells:
   - `.md` cell: the model and the exact solution (evaluated).
   - `Import[".../ExampleModel.mo", "MO"]`, then one `SystemModelSimulate[model, {0, 1}, <|"InitialValues" -> {"x" -> {0.5, 1., 2.}}|>, ProgressReporting -> False]`, which returned 3 `SystemModelSimulationData` objects. The first version of this cell displayed the `SystemModel` object inside a list. That gave a huge box dump and the messages `Set::shape`, `Part::partd`, `General::stop`, `OptionValue::nodef`. I changed the last line to a compact summary (number of simulations and each configuration) and evaluated it again: no messages.
   - Comparison table: simulated x(0) and y(1) next to the exact y(1) and the difference. The first version, a `Grid` of `NumberForm`s, showed as "Too long to display" in WLJS. I rewrote it with string-formatted numbers and it renders as a grid (seen in a projected window).
   - `SystemModelPlot[sims, {"y"}, PlotRange -> All, PlotLegends -> ...]`: returned a `Legended[Graphics[...]]` with three curves.
   - `NotebookSave[EvaluationNotebook[], ".../work/ExampleModelSweep.wln"]`: evaluated twice, the second time after the table fix.
5. **WLJS kernel via `mcp__wljs__kernel_evaluate`**: checked the sweep outside the notebook. The configurations were x = 0.5, 1., 2. and y(1) = {3.3058824258927495, 3.893483022849462, 5.068684216663753}. This was a check that the messages in step 4 came from displaying the result, not from the simulation.
6. Captured the WLJS windows with `tools/capture-wljs-windows.sh` and found my notebook (`llm-38b.wln`) by its content. Projected the table cell with `mcp__wljs__project_cell` and captured it: the grid shows correctly.
7. **WLJS kernel via `mcp__wljs__kernel_evaluate`**: `Remove["wlmSweep`*"]` to clean up the shared kernel (`Names` → `{}`).

No `wolframscript`, `wolfram-direct` or `wsm-toolkit` run was needed.

## 3. Files

- Created: `<repo>/tests/runs/2026-10-22/wolfram-language-modelica/work/ExampleModelSweep.wln`
- Created: `<repo>/tests/runs/2026-10-22/wolfram-language-modelica/run-log.md`
- Created (scratch, window captures): `<repo>/tests/runs/2026-10-22/wolfram-language-modelica/scratch/cap*/` (PNGs, plus empty `.xwd` leftovers that I deleted)
- Not changed: `work/ExampleModel.mo`
- Created by System Modeler itself (not by me directly): result files `/tmp/WolframSystemModeler-<user>-15.0/WL/wsml_ExampleModel_lsim_*.mat`

## 4. WLJS notebook

`<repo>/tests/runs/2026-10-22/wolfram-language-modelica/work/ExampleModelSweep.wln` (window title `llm-38b.wln`, left open).

## 5. Answer

I simulated `ExampleModel` over t ∈ [0, 1] three times, once for each starting value x(0) = 0.5, 1 and 2 (y(0) = 1 each time).

The exact solution is x(t) = x0·e^(−t) and y(t) = (1 + x0/2)·e^t − (x0/2)·e^(−t). That gives y(1) = (1 + x0/2)·e − x0/(2e).

| x(0) | y(1) simulated | y(1) exact | simulated − exact |
|---|---|---|---|
| 0.5 | 3.30588242589 | 3.30588242528 | 6.1e-10 |
| 1 | 3.89348302285 | 3.89348302210 | 7.5e-10 |
| 2 | 5.06868421666 | 5.06868421575 | 9.2e-10 |

The simulation matches the exact solution to about 9 significant digits, a relative error of about 2e-10. The x0 = 1 case is the model's default start value.

The notebook `ExampleModelSweep.wln` in the work folder has the sweep, this table, and a plot of y(t) for the three runs.

## 6. Problems

- If the notebook cell's output is a `SystemModel` object inside a list, WLJS shows a large box dump and four messages: `Set::shape`, `Part::partd`, `General::stop`, `OptionValue::nodef`. The simulation was unaffected (checked separately). I replaced that output with a compact summary.
- A `Grid` of `NumberForm[..., 10]` entries showed as "Too long to display" (5.91 kB) in WLJS. String-formatted numbers fixed it.
- `capture-wljs-windows.sh` worked intermittently: `xwd` often failed with `X Error ... BadColor (invalid Colormap parameter)` and left empty `.xwd` files. The projected plot window (`0x140007a`) never captured after 5 direct tries. **I did not see the plot**. The saved notebook does contain the plot output: a `Legended[...]` graphics output, stored compressed.
- Shared kernel: another session's notebook (`llm-dd3.wln`) imported `ExampleModel_plots.mo`. It appears to be a copy of the same model, also named `ExampleModel`. A Modelica class name loaded later replaces the earlier one in the kernel, so in principle my `SystemModel["ExampleModel"]` could have pointed to their copy. The equations are the same, and the results match the exact solution for this model, so the numbers are not affected. For future runs a unique model name would avoid this.
- I opened three projected "Application" windows and left them open, along with the notebook window: `0x1400049` (the table's first version), `0x1400055` (the fixed table) and `0x140007a` (the plot). I closed no windows.
- I did not delete System Modeler's `.mat` result files in `/tmp/WolframSystemModeler-<user>-15.0/WL/`. They are created by the kernel's own temp directory handling.
