# Run log: notebook-create (2026-10-22)

## 1. Skills used

1. `notebook-create` (local WLJS adaptation; read `ROUTES.md`, the pinned upstream `SKILL.md`, `artifacts.md`, `markdown-mapping.md`, and the `computation` template section of `templates.md`)

## 2. Steps

1. Read the skill, `ROUTES.md`, the upstream skill and references, and `work/Collatz.wl` (package `Collatz`` with one function `Collatz[n]` giving the 3n+1 trajectory from n down to 1, recursive, defined only for positive integers).
2. **WLJS kernel via `mcp__wljs__kernel_evaluate`**: checked `$AllowInternet` (False), that no `Collatz`` symbols were loaded, and that no `Global`Collatz` existed (other sessions have `Global`CollatzPlot`, `CollatzSlider`, etc.; no clash). Why: shared-kernel safety check, not something the user needs to see.
3. **WLJS kernel via `mcp__wljs__kernel_evaluate`**: loaded the package inside `Block[{$ContextPath = $ContextPath}, Get[...]]` and computed the facts the prose relies on: 27 takes 111 steps, peak 9232 at step 77; 97 takes 118 steps, peak 9232 at step 84; first common value 94 (step 6 from 27, step 13 from 97). Confirmed `$ContextPath` was restored. Why: verify claims before writing the narrative.
4. Destination per upstream `artifacts.md`: a one-off notebook about the project's code goes to `Code/Artifacts/` with a dated stem and an index. Created `work/Code/Artifacts/` (and the scratch folder).
5. **WLJS kernel via the visible notebook** (`mcp__wljs__new_notebook` -> notebook `077`, `add_cells_batch`, `evaluate_cell`): 16 cells: title + "[[ LLM Generated ]]" (.md), Setup (.md + load cell), `Collatz[27]` (.md + `ListLinePlot`), `Collatz[97]` (.md + `ListLinePlot`), Step counts (.md + `Grid` of n / steps / peak), Where the trajectories meet (.md + `ListLogPlot` of both aligned at the end, .md + `Grid` of the meeting value and steps), Step counts up to 120 (.md + `ListPlot` of s(n) for n <= 120 with 27 and 97 highlighted), and a `NotebookSave[EvaluationNotebook[], ".../CollatzTrajectories_261022.wln"]` cell. Every cell, including .md cells, was evaluated. Why: the user asked for a notebook; WLJS notebook is the default target. The package is loaded with `Block[{$ContextPath = $ContextPath}, Get[...]]` and called as `Collatz`Collatz` so the shared kernel's context path is not changed.
6. Checked the result with `tools/capture-wljs-windows.sh` (notebook window `llm-460.wln`) and `mcp__wljs__project_cell` on the merge plot, the step-count plot and both grids. Fixes after looking:
   - The display formula used `\begin{cases}...\\...`; the Markdown renderer ate the row break and showed one run-on line. Replaced with a plain two-part formula; re-rendered correctly.
   - The two highlighted points (27, 97) in the step-count plot were invisible at default point size; added `PlotStyle -> {Automatic, PointSize[0.03]}`.
   - Grid columns were cramped; added `Spacings -> {2, 1}`.
   Re-evaluated the changed cells and the save cell (all in the WLJS notebook).
7. Wrote the Markdown source `CollatzTrajectories_261022.md` (same content as the notebook, `wolfram` fences) and the `Code/Artifacts/README.md` index, per the upstream two-layer / index convention.
8. **WLJS kernel via `mcp__wljs__kernel_evaluate`**: final check: `$AllowInternet` False, `Collatz`` not on `$ContextPath`, only `Collatz`Collatz` defined.

No `wolframscript`, `wolfram-direct`, or `wsm-toolkit` was used. Nothing contacted any network service.

## 3. Files

Created:
- `<repo>/tests/runs/2026-10-22/notebook-create/work/Code/Artifacts/CollatzTrajectories_261022.wln` (saved WLJS notebook with outputs)
- `<repo>/tests/runs/2026-10-22/notebook-create/work/Code/Artifacts/CollatzTrajectories_261022.md` (Markdown source)
- `<repo>/tests/runs/2026-10-22/notebook-create/work/Code/Artifacts/README.md` (artifact index)
- `<repo>/tests/runs/2026-10-22/notebook-create/scratch/cap*/` (window captures, temporary)
- `<repo>/tests/runs/2026-10-22/notebook-create/run-log.md` (this file)

Not changed: `work/Collatz.wl`.

## 4. WLJS notebook

`<repo>/tests/runs/2026-10-22/notebook-create/work/Code/Artifacts/CollatzTrajectories_261022.wln` (open in WLJS as `llm-460.wln`, MCP id `077`).

## 5. Answer

I made a WLJS notebook, `Code/Artifacts/CollatzTrajectories_261022.wln`, that loads your `Collatz.wl` and works through:

- the trajectories of 27 and 97, each plotted;
- their step counts: 27 reaches 1 in 111 steps, 97 in 118 steps; both peak at 9232;
- where they meet: 97 runs into 27's trajectory at 94 (step 13 from 97, step 6 from 27), and from there on the two are identical. That is why the counts differ by exactly 7 and the peaks are equal. A log plot with the two aligned at the end shows this;
- step counts for every start up to 120, with 27 and 97 highlighted: both are records (every smaller start needs fewer steps).

The Markdown source sits next to it (`CollatzTrajectories_261022.md`), and `Code/Artifacts/README.md` lists the artifact. The package is loaded without adding `Collatz`` to the kernel's context path (the kernel is shared), so the notebook calls the function as `Collatz`Collatz[n]`.

## 6. Problems

- The `\begin{cases}` display formula did not render in a WLJS .md cell (row break `\\` was consumed by Markdown); replaced with a simpler formula. Writing `\\\\` would probably work but was not tested.
- In the log plot, WLJS clips the top y-tick label (shows ".00e+3" instead of "1.00e+3"). Cosmetic, left as is.
- In the merge plot the orange curve (97) is drawn over the blue one (27) after they merge, so only orange is visible there; the text describes this.
- The .md input cells show their source above the rendered text in the window (WLJS default); I did not hide them.
- The save cell (`NotebookSave[...]`) is part of the notebook, as the local rules require for saving.
- I opened 5 projected "Application" windows (`project_cell`) to inspect outputs and have no tool to close them; they are still open on the second monitor. The notebook window itself is also left open.
- The `.md` source was written by hand to match the notebook; the `.wln` was built live through the MCP tools, not generated from the `.md` with `md2wln.py`.
- `Collatz`Collatz` remains defined in the shared kernel (the notebook uses it); it is not on `$ContextPath`.
- Upstream rules (no labels on graphics, no numbers in prose) were followed in the notebook; colours are named in the text instead of legends.
