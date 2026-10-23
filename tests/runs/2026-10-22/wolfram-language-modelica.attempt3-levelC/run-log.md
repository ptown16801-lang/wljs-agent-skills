# Run log: wolfram-language-modelica (2026-10-22)

## 1. Skills used
1. wolfram-language-modelica (local WLJS adaptation; read ROUTES.md and the pinned upstream SKILL.md as it directs)

## 2. Steps
1. Read `work/ExampleModel.mo` (der(x) = -x, der(y) = y + x, x(start=1), y(start=1)), `ROUTES.md` and the upstream skill.
2. Because the WLJS kernel's System Modeler namespace is shared (ROUTES.md), made a renamed copy `scratch/ExampleModel_wlmSweep1022.mo` (only the class name changed, via `sed`).
3. **WLJS kernel via `mcp__wljs__kernel_evaluate`** (default route; no notebook needed for the first check): `Import[..., "MO"]`, then one `SystemModelSimulate[m, {0, 1}, <|"InitialValues" -> {"x" -> {0.5, 1., 2.}}|>, ProgressReporting -> False]` sweep (3 runs), read `x(1)`, `y(1)`, compared with the exact solution. Confirmed `$AllowInternet` = False and that each run's `"Configuration"` carried the intended x(0).
4. **WLJS kernel via `mcp__wljs__new_notebook` / `add_cells_batch` / `evaluate_cell`** (visible notebook for the user): `.md` cell (model, exact solution), import + sweep cell, results table cell (simulated vs exact y(1)), `SystemModelPlot` of y for the three runs (`PlotRange -> All`), and a `NotebookSave[EvaluationNotebook[], ...]` cell. All cells evaluated, including the `.md` cell. Variables used fully qualified names (`wlmSweep1022`...`), removed with `Remove` at the end via `mcp__wljs__kernel_evaluate`.
5. Checked the notebook visually: `tools/capture-wljs-windows.sh` (notebook top, window `llm-959.wln`), then `mcp__wljs__project_cell` on the table cell and the plot cell and captured again (both "Application" windows look correct).

Exact solution used for the check: x(t) = x0 e^-t; y' - y = x0 e^-t with y(0)=1 gives y(t) = (1 + x0/2) e^t - (x0/2) e^-t, so y(1) = (1 + x0/2) e - x0/(2e).

## 3. Files
- Created `scratch/ExampleModel_wlmSweep1022.mo` (renamed copy of the model)
- Created `scratch/cap/`, `scratch/cap2/`, `scratch/cap3/` (window captures, PNG)
- Created `work/ExampleModelSweep.wln` (saved WLJS notebook)
- Created this `run-log.md`
- `work/ExampleModel.mo` unchanged.

(All paths relative to `<repo>/tests/runs/2026-10-22/wolfram-language-modelica/`.)

## 4. WLJS notebook
`<repo>/tests/runs/2026-10-22/wolfram-language-modelica/work/ExampleModelSweep.wln` (window titled `llm-959.wln` on the second monitor; left open, plus two projected "Application" windows for the table and the plot).

## 5. Answer
Sweep of x(0) with SystemModelSimulate (t from 0 to 1, y(0) = 1):

| x(0) | y(1) simulated | y(1) exact = (1 + x0/2)e - x0/(2e) | difference |
|---|---|---|---|
| 0.5 | 3.30588242589 | 3.30588242528 | 6.1e-10 |
| 1   | 3.89348302285 | 3.89348302210 | 7.5e-10 |
| 2   | 5.06868421666 | 5.06868421575 | 9.2e-10 |

The simulation matches the exact solution to about 9 significant digits (relative error ~2e-10) in all three cases; x(1) also matches x0/e to ~1e-10. y(1) is linear in x0 (slope (e - 1/e)/2 = sinh(1) = 1.1752), as the exact formula predicts. Notebook with the table and plot: `work/ExampleModelSweep.wln`.

## 6. Problems
- No errors or kernel messages. No WLJS call came near the time limit.
- Cosmetic: in the table the x(0) column shows machine-precision backtick marks (`0.5``, `1.``, `2.``) in WLJS's Grid display; values are correct.
- The model was simulated from a renamed copy (`ExampleModel_wlmSweep1022`) to avoid the shared-kernel name clash noted in ROUTES.md; equations are identical. The imported class stays registered in the kernel's System Modeler session (no clean way to unload it; harmless).
- The notebook was saved before the two cells were projected; projecting does not change the notebook content.
