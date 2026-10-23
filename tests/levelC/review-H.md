# Review H: wolfram-language-modelica (current run, 2026-10-22 06:31–06:38)

## Disagreements

None. I agree with the orchestrator's grade: all six checks pass. The notebook check carries a caveat about the save route (below).

## What was checked

- **Legend (review F):** fixed.
  - The plot cell now passes a flat `PlotLegends -> {"x(0) = 0.5", "x(0) = 1", "x(0) = 2"}`.
  - The run viewed the plot it saved: `scratch/cap3/0x1400037_Application.png` was captured after the final plot evaluation. It shows three rising curves ending at about 3.31 (blue), 3.89 (orange) and 5.07 (green), with one legend in matching colours.
  - The saved output's legend is a single `LineLegend` with the three default colours. My fresh-kernel run of the same `Plot` produces the same thing.
- **Plot output in the saved `.wln` (review G):** fixed.
  - `work/ExampleModelSweep.wln` has 11 cells: five input/output pairs, then the save input last.
  - The plot's output cell comes directly after its input.
  - The table's output holds all simulated and exact values inline.
- **y(1):** re-run in a fresh network-cut kernel (`scratch-H/wlm.wls`).
  - Results: 3.3058824258927495, 3.893483022849462 and 5.068684216663753. They are identical to the run.
  - The exact values (1 + x0/2)e − x0/(2e) are 3.30588242528, 3.89348302210 and 5.06868421575.
  - The differences are below 1e-9 and match the card.
- **Rules:**
  - The run used the visible-notebook route. The prompt actually sent to it allowed this.
  - `tests/cards/AGENT-BRIEF.md` still says not to call `new_notebook`. That file is out of date for this run.
  - The run used a renamed model copy and qualified symbols, removed them at the end, and left the source `.mo` unchanged.

## Finding outside the grade: the saved plot depends on the running app

The plot output is stored as `ToExpression[FrontEndRef["F3a21c737-..."]]` plus a legend. The file's `ObjectFields:` is empty and it has no `Objects` section, so the curve data is not in the file.

The cause is in WLJS. Kernel-side `NotebookSave` writes through `exportNotebook` → `SerializeToStream` (`modules/wljs-editor/src/RemoteCells.wl`). That path skips the `OnBeforeSave` object sync in `FrontendObjectSync.wl`. Notebooks saved from the GUI, such as `Demos/Release notes/3.1.4.wln`, do have an `Objects` section with one key per `FrontEndRef`.

Reopening the file now, in the same app session, should show the plot. After a WLJS restart, only the legend would likely draw. I inferred this from the source and did not open the notebook, because the brief forbids it.

This is a problem in the save route (ROUTES / tooling), not something a rerun of this skill would fix. It also applies to attempt2 and to any other run that saves graphics this way.

Question for the owner: should the notebook check require a saved `.wln` to redraw after an app restart? If so, the save route needs an object sync, or a check that every `FrontEndRef` has an `Objects` key.

Files: `tests/levelC/review-H.json`, `tests/levelC/scratch-H/` (`wlm.wls`, `ExampleModel_revH.mo`, `plot-vb.txt`).
