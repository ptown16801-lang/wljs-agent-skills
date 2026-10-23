# Run log: wljs-dynamics, 2026-10-22

## 1. Skills used
1. wljs-dynamics

## 2. Steps
1. Loaded the `wljs-dynamics` skill. Read `<repo>/ROUTES.md` and the pinned upstream guide `~/.local/opt/wljs/app/resources/app/modules/wljs-api/mcp/dist/skills/dynamics.md` in full.
2. Created the scratch folder `.../wljs-dynamics/scratch/` (nothing was written to it).
3. `{$AllowInternet, $VersionNumber}`: **WLJS kernel via `mcp__wljs__kernel_evaluate`**, to confirm internet is off before doing anything. Result `{False, 15.}`.
4. `mcp__wljs__new_notebook` gave notebook `005` (opens on the second monitor). `mcp__wljs__add_cells_batch` added two cells:
   - `008`, a `.md` cell with a title and a two-sentence explanation;
   - `009`, the Manipulate:
     ```wolfram
     Manipulate[
      Plot[Sin[k x], {x, 0, 2 Pi}, PlotRange -> {{0, 2 Pi}, {-1.1, 1.1}}, ImageSize -> 400, AxesLabel -> {"x", "Sin[k x]"}],
      {{k, 1, "k"}, 0.1, 10, 0.1},
      ContinuousAction -> True
     ]
     ```
     As the guide says, I used `ContinuousAction -> True` so it updates during a drag, and fixed `PlotRange` and `ImageSize` so the output structure stays the same and WLJS can do granular (JIT) updates.
5. `mcp__wljs__evaluate_cell` on `008` (**WLJS kernel**, to render the Markdown): output `010`, display markdown.
6. `mcp__wljs__evaluate_cell` on `009` (**WLJS kernel**, so the live control shows in the visible notebook): output `011` is a `CoffeeLiqueur`Extensions`Manipulate`Internal`ManipulateHelper[...]` containing a `"JIT" -> Offload[...]` entry. That means WLJS took the in-place-update path, not full re-evaluation. No messages.
7. Added cell `013` with `NotebookSave[EvaluationNotebook[], "<repo>/tests/runs/2026-10-22/wljs-dynamics/work/SinSlider.wln"]` and evaluated it (**WLJS kernel**; this is the only way to save to a path, per ROUTES.md). It returned `RemoteNotebook["d60fe190-..."]`. Checked the file with Bash: 2265 bytes, contains the `.md` cell and the Manipulate input.
8. Nothing was run with wolframscript, wolfram-direct or wsm-toolkit: none was needed.

## 3. Files
- Created: `<repo>/tests/runs/2026-10-22/wljs-dynamics/work/SinSlider.wln`
- Created: `<repo>/tests/runs/2026-10-22/wljs-dynamics/run-log.md` (this file)
- Created (empty folder): `<repo>/tests/runs/2026-10-22/wljs-dynamics/scratch/`

## 4. WLJS notebook
`<repo>/tests/runs/2026-10-22/wljs-dynamics/work/SinSlider.wln` (open as notebook `005`; left open).

## 5. Answer
The slider is in a new WLJS notebook on your second monitor, saved as `work/SinSlider.wln`. Drag **k** (0.1 to 10, step 0.1) and the plot of Sin[k x] over 0 to 2π redraws while you drag:

```wolfram
Manipulate[
 Plot[Sin[k x], {x, 0, 2 Pi}, PlotRange -> {{0, 2 Pi}, {-1.1, 1.1}}, ImageSize -> 400, AxesLabel -> {"x", "Sin[k x]"}],
 {{k, 1, "k"}, 0.1, 10, 0.1},
 ContinuousAction -> True
]
```

Because the plot range and size are fixed, WLJS updates the curve in place instead of rebuilding the plot. WLJS's guide also gives a shorter form, `ManipulatePlot[Sin[k x], {x, 0, 2 Pi}, {k, 0.1, 10}]` (from the guide; not run here).

## 6. Problems
- **No visual check.** The skill says to confirm the rendered notebook with a screenshot (`wljs nb url` in the browser pane), but this run's ground rules forbid opening browsers. The evidence that it renders and updates live is indirect: the evaluated output is WLJS's Manipulate widget with its `JIT` (in-place update) entry, and no messages appeared. I did not see the slider being dragged.
- The saved `.wln` holds the input cells; I did not check whether it also stores the Manipulate output. ROUTES.md says saved graphics redraw once a kernel attaches, so re-evaluate cell 2 after reopening the file.
- ROUTES.md mentions a once-possible false "File hash mismatch" dialog about 3 s after `NotebookSave` (patched Oct 22). I could not see the window to confirm it did not appear.
- No warnings or messages from any evaluation.
