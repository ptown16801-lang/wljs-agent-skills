# Run log: wolfram-language-modelica, 2026-10-22

## 1. Skills used

1. `wolfram-language-modelica` (local WLJS adaptation; read `ROUTES.md` and the pinned upstream `SKILL.md` as it instructs)

## 2. Steps

1. Read `work/ExampleModel.mo`: `der(x) = -x`, `der(y) = y + x`, `x(start = 1)`, `y(start = 1)`, no parameters. Derived the exact solution by hand: `x = x0 e^-t`, `y = (1 + x0/2) e^t - (x0/2) e^-t`, so `y(1) = e + x0 sinh(1)`.
2. Following the ROUTES.md shared-namespace rule, wrote a renamed copy `scratch/ExampleModel_wlmSweep1022.mo` (only the class name changed, via `sed`). The original was not modified.
3. **WLJS kernel via `mcp__wljs__kernel_evaluate`** (quick check, nothing the user needs to see): `$AllowInternet` -> `False`, `$VersionNumber` -> 15., `Import[..., "MO"]` -> `SystemModel["ExampleModel_wlmSweep1022", True]`.
4. Created WLJS notebook (`mcp__wljs__new_notebook`, id 001), added cells with `add_cells_batch`, evaluated with `evaluate_cell`. All evaluations ran in the **WLJS kernel** (the default engine in the skill, and the user should see the result):
   - `.md` cell: model, sweep and exact solution (evaluated; KaTeX renders).
   - Import cell (`wlmSweep1022`model = Import[...]`).
   - Sweep cell: one `SystemModelSimulate[model, {0, 1}, <|"InitialValues" -> {"x" -> {0.5, 1., 2.}}|>, ProgressReporting -> False]`, returning 3 simulations; `Configuration` of each confirms x = 0.5, 1., 2.
   - Table cell: `y(1)` from each simulation vs `N[E + x0 Sinh[1], 16]`, with the difference, and a check that `x(0)` was applied.
   - Plot cell: `y(t)` for the three runs, `PlotRange -> All`, flat `PlotLegends` list.
   - Save cell (last): `NotebookSave[EvaluationNotebook[], ".../work/ExampleModelSweep.wln"]`.
5. Looked at the notebook with `tools/capture-wljs-windows.sh` (top of notebook: markdown renders) and projected the table and plot cells with `mcp__wljs__project_cell` and captured them: the plot shows three increasing curves ending at about 3.31, 3.89, 5.07 with a correct three-colour legend; the final table displays correctly.
6. Checked the saved `.wln` contains the outputs (grep found the simulated and exact values and the `Legended` plot).
7. **WLJS kernel via `kernel_evaluate`**: `Remove["wlmSweep1022`*"]` (cleanup of my fully qualified symbols in the shared kernel); `Names` returned `{}`.

No `wolframscript`, `wolfram-direct` or `wsm-toolkit` was used; nothing contacted the network.

## 3. Files

- Created `<repo>/tests/runs/2026-10-22/wolfram-language-modelica/scratch/ExampleModel_wlmSweep1022.mo` (renamed model copy)
- Created `<repo>/tests/runs/2026-10-22/wolfram-language-modelica/scratch/cap/`, `cap2/` ... `cap5/` (window captures, PNG)
- Created `<repo>/tests/runs/2026-10-22/wolfram-language-modelica/work/ExampleModelSweep.wln` (saved notebook)
- Created `<repo>/tests/runs/2026-10-22/wolfram-language-modelica/run-log.md` (this file)
- `work/ExampleModel.mo` unchanged.

## 4. WLJS notebook

`<repo>/tests/runs/2026-10-22/wolfram-language-modelica/work/ExampleModelSweep.wln` (still open in the WLJS app, window title `llm-66d.wln`; plus projected "Application" windows of the table and plot cells).

## 5. Answer

Sweeping the start value of `x` in `ExampleModel` (simulated 0 to 1 s in System Modeler from the WLJS kernel):

| x(0) | y(1) simulated | y(1) exact = e + x(0)·sinh(1) | sim - exact |
|---|---|---|---|
| 0.5 | 3.30588242589 | 3.30588242528 | 6.1e-10 |
| 1   | 3.89348302285 | 3.89348302210 | 7.5e-10 |
| 2   | 5.06868421666 | 5.06868421575 | 9.2e-10 |

Exact solution: with y(0) = 1, `y(t) = (1 + x0/2) e^t - (x0/2) e^-t`, so `y(1) = e + x0 sinh(1)`. The simulation agrees to better than 1e-9 (relative about 2e-10, the solver's default tolerance). y(1) is linear in x(0) with slope sinh(1) ≈ 1.1752, as expected. The notebook with the table and a plot of y(t) for the three cases is saved as `work/ExampleModelSweep.wln`.

## 6. Problems

- The first evaluation of the Import cell (which displayed the `SystemModel` object) returned `$TimedOut` from `evaluate_cell` with no output, although the assignment had happened. Re-evaluating it rendered the model object but raised messages in WLJS: `Set::shape`, `Part::partd`, `General::stop`, `OptionValue::nodef` (from WSM's `SystemModel` box typesetting in WLJS, not from the import). Fixed by ending the assignment with `;` and showing `InputForm[model]`; that evaluation was clean.
- Deleting a misplaced save cell (inserted after the plot input, i.e. between the input and its output) also deleted the plot output (WLJS treated it as belonging to the deleted cell); re-evaluated the plot cell, then saved last.
- A table version with `NumberForm` around every entry displayed as "Too long to display" in WLJS (5.9 kB box); replaced the x(0) column with plain strings and it displays correctly. In an earlier version, machine reals showed with a trailing backtick (`0.5``) in the Grid.
- The model class `ExampleModel_wlmSweep1022` stays loaded in the shared kernel's System Modeler namespace (no unload call used); my `wlmSweep1022`` symbols were removed, so the open notebook's cells need re-running in order if re-evaluated.
- Projected "Application" windows (4, one stale) and the notebook window were left open, per the rule not to close windows I was not asked to close; they are mine and the user may close them.
