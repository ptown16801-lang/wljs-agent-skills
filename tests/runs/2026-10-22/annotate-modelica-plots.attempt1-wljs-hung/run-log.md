# Run log: annotate-modelica-plots (2026-10-22)

## 1. Skills used
1. annotate-modelica-plots (local WLJS adaptation; read `ROUTES.md` and the pinned upstream `SKILL.md` at toolkit commit 991a800 as it directs)

## 2. Steps
1. Read `work/ExampleModel.mo`: one model, `ExampleModel`, with states `x` and `y` (`der(x) = -x; der(y) = y + x;`, both start at 1), and an existing Diagram and Icon annotation. No experiment annotation and no figures.
2. Copied it to `work/ExampleModelWithPlots.mo`. The original was not touched (still 1015 bytes, dated Oct 1, sha256 `280f9dde...c016`).
3. `wsm-toolkit figures --analyze` on the copy: one instantiable class, `ExampleModel`, no figures. (Pure-Python source transform, no Wolfram engine.)
4. Upstream Mode A, since the user named the variables. Wrote the figures spec `work/figs.json`: one figure "States x and y" (identifier `states`, `preferred = true`, so it opens by default), with two plots, `x` vs time and `y` vs time, empty axis units, and a caption that links both variables. Wrote `work/vars.txt` (`x`, `y`, `time`) by hand from the model's declarations, for the membership check.
5. `wsm-toolkit figures ... --annotate` as a dry run: the diff added only `Documentation(figures = {...})` to the class annotation and printed no warnings. Then ran it again with `--write`. `--analyze` now reports `[has Documentation, HAS figures]`. A second `--annotate` is a no-op ("skipped"), so the change is idempotent.
6. Validation gate: `wsm-toolkit wsm --mode validate` (WSMKernelX through the pinned launcher, fresh `--tempdir`), the upstream skill's gate. Result `status.flatten = "Pass"`, with no errors or warnings. The flat model shows the same two equations as before.
7. Tried to check the result in the WLJS kernel (`mcp__wljs__kernel_evaluate`: `Import` the copy, `SystemModelSimulate[m, 1]`, compare with the analytic values), since the adaptation names WLJS as the default engine. The call came back "still pending after 220 s". Two later trivial calls (`{$AllowInternet, 1+1}` and `{$AllowInternet, 2+2}`) were also still pending after 220 s, so the shared WLJS kernel was not answering. I did not restart it (that is forbidden in this run).
8. Fallback check: `wsm-toolkit wsm --mode simulate` (WSMKernelX, fresh `--tempdir`). flatten, build and result all `Pass`. The two notifications were only informational: initialized from start values; states `x`, `y`. `wsm-toolkit plot --list` showed `x` and `y` in the result (non-protected STATE variables in the `.sim`), so the stored curves will not render blank. `wsm-toolkit summary` gave final values at the default stop time of 10 s: x = 4.54e-05 and y = 33040. These match the analytic e^-10 and 1.5e^10 - 0.5e^-10 ≈ 33039.7.
9. Removed the launcher temp folders `_wsm_validate_temp` and `_wsm_simulate_temp`, as the skill says.

No Wolfram-server contact was made. No installs. No notebook or window opened.

## 3. Files
- Created: `<repo>/tests/runs/2026-10-22/annotate-modelica-plots/work/ExampleModelWithPlots.mo` (the annotated copy)
- Created: `<repo>/tests/runs/2026-10-22/annotate-modelica-plots/work/figs.json` (figures spec)
- Created: `<repo>/tests/runs/2026-10-22/annotate-modelica-plots/work/vars.txt` (variable list for the membership check)
- Created then deleted: `work/_wsm_validate_temp/`, `work/_wsm_simulate_temp/`
- Created: this run log
- Unchanged: `work/ExampleModel.mo`

## 4. WLJS notebook
none. The run rules forbid opening a notebook. The WLJS kernel was not responding, so I did not reproduce the plot live with `SystemModelPlot`.

## 5. Answer
I made a copy, `ExampleModelWithPlots.mo`, and stored a default result figure in it. The original `ExampleModel.mo` is unchanged.

- **The figure:** "States x and y", marked `preferred = true` so System Modeler opens it by default. It has two stacked plots: `x` over time and `y` over time.
- **Caption:** "x decays exponentially while y, driven by x, grows exponentially."
- **Check:** the model still flattens, builds and simulates with WSMKernelX. Both `x` and `y` are public result variables. The values at 10 s match the exact solution (x = e^-10, y ≈ 33040).
- **Viewing it:** open the copy in System Modeler's Simulation Center and simulate; the figure appears in the model's figure list.
- **Spec:** the figure definition is in `figs.json`, in case you want to change it.
- **No stop time:** the model has no experiment annotation, so it uses System Modeler's default of 10 s. Over that range y grows to about 33,000. If you want a shorter, more readable range, I can add `experiment(StopTime = ...)`.

## 6. Problems
- **WLJS kernel not responding.** All three `mcp__wljs__kernel_evaluate` calls (including `1+1`) returned "still pending after 220 s". The first call, `Import` + `SystemModelSimulate` of the copy, may still be queued or running in the shared kernel. If it runs, it will load a class named `ExampleModel` into that kernel's System Modeler session. It does not change any files. I did not restart WLJS (not allowed in this run).
- **Verification route:** because of that, verification used `wsm-toolkit` (WSMKernelX) instead of the WLJS default.
- **vars.txt:** written by hand from the model's declarations before simulating. The simulation later confirmed the variables exist.
- **Layout choice:** two separate plots in one figure, instead of one plot with both curves. I chose this because the scales differ widely (x ≤ 1, y up to ~3.3e4). The request did not specify a layout.
- **Not checked visually:** the figure has not been looked at in the System Modeler GUI, because opening desktop applications is not allowed in this run.
