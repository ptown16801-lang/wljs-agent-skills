# Run log: annotate-modelica-plots (2026-10-22)

Request: "Store default result plots in a copy of ExampleModel.mo for x and y, and show me the stored plots."

## 1. Skills used
1. `annotate-modelica-plots` (local WLJS adaptation), which pointed to `ROUTES.md` and the pinned upstream skill `~/.local/share/wolfram-system-modeler-ai-toolkit/991a800.../annotate-modelica-plots/SKILL.md`. I read both.

## 2. Steps
1. Read `work/ExampleModel.mo`. It has two states, `x(start=1)` with `der(x) = -x` and `y(start=1)` with `der(y) = y + x`. It already had Diagram and Icon annotations but no `figures`.
2. Copied it to `work/ExampleModel_plots.mo` (class name kept as `ExampleModel`). The original was not changed (md5 3115bee2de2e6c610ea7bbd20be3b9a3, timestamp Oct 1).
3. `wsm-toolkit figures --analyze`: one instantiable class, `ExampleModel`. No Wolfram engine; pinned upstream Python, PlotAnnotate.
4. Wrote the spec `scratch/figs.json` (Mode A: the user named the variables). It has one figure, `identifier="states"`, title "States x and y", `preferred = true`, with a caption. The figure has two plots, "x" and "y", each with one curve against time. I used separate plots because the scales differ by about nine orders of magnitude at t = 10.
5. `wsm-toolkit figures --annotate` dry-run diff, then `--write`. A rerun without `--force` gave "skipped / nothing to do", so the step is idempotent. No Wolfram engine.
6. Validated with `wsm-toolkit wsm --mode validate --tempdir scratch/validate`. Engine: **wsm-toolkit** (WSMKernelX 15.0), the skill's validation gate. Result `status.flatten = "Pass"`, with no errors, warnings or notifications.
7. Made `scratch/ExampleModel_amp1022.mo`. It is identical to the copy except the class is renamed `ExampleModel_amp1022`, because the shared WLJS kernel has a single System Modeler class namespace (ROUTES.md).
8. Ran `Import` + `SystemModelSimulate[m, 10]` + `m["PlotNames"]` in **WLJS kernel via `mcp__wljs__kernel_evaluate`** as a quick check before building the notebook. Results: `$AllowInternet = False`, PlotNames = {"States x and y"}, x(10) = 4.539992e-5 and y(10) = 33039.7046. The analytic values are e^-10 = 4.539993e-5 and 1.5e^10 - 0.5e^-10 = 33039.6987, which agree to solver tolerance.
9. Opened a WLJS notebook (`mcp__wljs__new_notebook`, id 002) and added 3 cells: a `.md` explanation, the import/simulate cell, and `SystemModelPlot[sim, "States x and y", PlotRange -> All]`. I evaluated them with `mcp__wljs__evaluate_cell`. Engine: **WLJS kernel**, because the result is meant for the user to see. Symbols were fully qualified (`exampleAmp`m`, `exampleAmp`sim`).
10. Opened the plot output in its own window with `mcp__wljs__project_cell` and captured it with `tools/capture-wljs-windows.sh scratch/cap`. I looked at both PNGs. The notebook shows the rendered Markdown and the values. The projected plot shows the stored figure as two panels: x decaying from 1 to about 0, and y rising to about 33 000 at t = 10, with legends "x" and "y" and the x axis labelled "time".
11. Added a save cell last, `NotebookSave[EvaluationNotebook[], ".../work/ExampleModel_plots.wln"]`, and evaluated it (WLJS kernel). I checked the file: it contains all input cells, the Markdown output, the numeric output, and the plot output (as a `FrontEndRef`).
12. Ran `Remove["exampleAmp`m", "exampleAmp`sim"]` via `mcp__wljs__kernel_evaluate` to clean up the shared kernel.

## 3. Files
- Created: `work/ExampleModel_plots.mo` (the annotated copy)
- Created: `work/ExampleModel_plots.wln` (WLJS notebook)
- Created: `scratch/figs.json`, `scratch/ExampleModel_amp1022.mo`, `scratch/validate/validate.mos`, `scratch/validate/validate.out.json`, `scratch/cap/*.png` (3 window captures)
- Created: `run-log.md` (this file)
- Not changed: `work/ExampleModel.mo`

## 4. WLJS notebook
`<repo>/tests/runs/2026-10-22/annotate-modelica-plots/work/ExampleModel_plots.wln` (open on the second monitor as `llm-f4b.wln`; the projected plot window is titled "Application")

## 5. Answer
I made a copy, `work/ExampleModel_plots.mo`, and added a standard Modelica `Documentation(figures = ...)` annotation to it. It holds one default figure (`preferred = true`) called **"States x and y"**, with two plots:
- **x**: `Curve(x = time, y = x)`, which decays from 1 to about 4.5e-5 at t = 10 (e^-t)
- **y**: `Curve(x = time, y = y)`, which grows from 1 to about 33 040 at t = 10 (1.5e^t - 0.5e^-t)

The figure caption explains the two curves. The copy still flattens (Pass, no warnings). Your original `ExampleModel.mo` is unchanged. When you open the copy in System Modeler, this figure appears as the model's default stored plot.

The stored figure is drawn live in the WLJS notebook `work/ExampleModel_plots.wln` with `SystemModelPlot[sim, "States x and y"]`. Note that the notebook imports a copy whose class is renamed `ExampleModel_amp1022`, because the WLJS kernel is shared; it is otherwise identical. After a WLJS restart, the saved plot shows "Loading..." until you evaluate its cells again: graphics are saved as references, not images. Re-run the import cell first, then the plot cell.

## 6. Problems
- `mcp__wljs__evaluate_cell` returned `$TimedOut` for the `.md` cell and for the `NotebookSave` cell. Both still worked: the Markdown rendered (output cell 006), and the `.wln` was written and verified.
- In WLJS each panel shows its title twice above the plot (the Plot title "x" and the axis label "x" both appear near the top). This is how WLJS renders it, not a problem with the annotation. I could not check how System Modeler renders it, because the System Modeler app was not opened (ground rules).
- `SystemModelPlot` does not show the figure caption, so the caption was checked only in the `.mo` source.
- The saved `.wln` stores the plot as a `FrontEndRef` (known bug J3). It needs re-evaluation after a WLJS restart.
- I removed the kernel symbols `exampleAmp`m` and `exampleAmp`sim` after saving. To redraw, run the import cell before the plot cell.
