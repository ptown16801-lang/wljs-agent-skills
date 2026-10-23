# Run log: Collatz iterates of 27 (2026-10-22)

## 1. Skills used
1. `wolfram-language` (local WLJS adaptation). Following its instructions I read `ROUTES.md` and the pinned upstream `wolfram-language/SKILL.md`.

## 2. Steps
1. Read `work/Collatz.wl` with `cat` (a `BeginPackage["Collatz`"]` package defining `Collatz[n]`, the 3n+1 iterates from n down to 1).
2. Pre-check, **WLJS kernel via `mcp__wljs__kernel_evaluate`** (computation the user does not need to see): `$AllowInternet` = False, version 15.0.0, no existing `*`Collatz` symbols, `$Context` = ``Global` ``.
3. Created a visible WLJS notebook (`mcp__wljs__new_notebook`, id 001), added cells with `add_cells_batch`, and evaluated each one with `evaluate_cell`. **Engine: WLJS kernel**, chosen because the user wanted a plot to look at and ROUTES.md says results go live in a WLJS notebook. The cells:
   - `.md` title (evaluated).
   - `Get["/abs/.../work/Collatz.wl"]` returned context ``Collatz` `` and the usage message, with no errors.
   - ``collatzRun`c27 = Collatz[27]`` gave the full list of 112 iterates. I used a private context so as not to create a global in the shared kernel.
   - Summary association: 112 iterates, 111 steps, maximum 9232 at step 77. The list matches an independent `NestWhileList` implementation (`True`).
   - `ListLinePlot` of the trajectory (step against value, mesh points, maximum marked in red), drawn as a live WLJS graphic.
   - `.md` result summary (evaluated).
   - `NotebookSave[EvaluationNotebook[], ".../work/Collatz27.wln"]` returned `RemoteNotebook[...]`, and the file exists (5076 bytes).
4. Visual check of the plot, since I may not open a browser to screenshot the notebook:
   - **WLJS kernel** `Export[png, Rasterize[plot]]` wrote only a 44×34 PNG containing a "..." placeholder, so this attempt failed.
   - **WLJS kernel** `Export[svg, plot]` wrote a 50 KB SVG. No SVG-to-PNG converter is installed, so I could not view it.
   - **Fresh kernel via `wolfram-direct`** (`WolframLanguageEvaluator`, network-blocked, `$AllowInternet = False` first line) loaded `Collatz.wl` on its own and returned `{111, 9232, 77}`, which independently confirms the results. It exported `scratch/collatz27-check-fe.png` with Mathematica's front end. I viewed that PNG: correct trajectory, peak 9232 at step 77 marked, axes labelled.
5. Cleanup, **WLJS kernel via `kernel_evaluate`**: ``Remove["collatzRun`c27"]``. Confirmed `$AllowInternet` is still False and `$Context` is ``Global` ``. The `Collatz`` package stays loaded in the WLJS kernel, as requested.

## 3. Files
- Created `<repo>/tests/runs/2026-10-22/wolfram-language/work/Collatz27.wln` (WLJS notebook).
- Created in scratch (`<repo>/tests/runs/2026-10-22/wolfram-language/scratch/`): `collatz27-check.png` (failed placeholder), `collatz27-check.svg`, `collatz27-check-fe.png` (the verified plot image), `req-plot.json` (wolfram-direct request).
- Created this log: `<repo>/tests/runs/2026-10-22/wolfram-language/run-log.md`.
- `work/Collatz.wl` was not changed.
- wolfram-direct kept its own run record at `~/.local/state/wolfram-agenttools-direct/runs/run-5jo_05z3`.

## 4. WLJS notebook
`<repo>/tests/runs/2026-10-22/wolfram-language/work/Collatz27.wln` (it is still open in the WLJS app as notebook 001, on the second monitor).

## 5. Answer
I loaded `Collatz.wl` and ran `Collatz[27]`:

- **Iterates** (112 values, from 27 down to 1):
  27, 82, 41, 124, 62, 31, 94, 47, 142, 71, 214, 107, 322, 161, 484, 242, 121, 364, 182, 91, 274, 137, 412, 206, 103, 310, 155, 466, 233, 700, 350, 175, 526, 263, 790, 395, 1186, 593, 1780, 890, 445, 1336, 668, 334, 167, 502, 251, 754, 377, 1132, 566, 283, 850, 425, 1276, 638, 319, 958, 479, 1438, 719, 2158, 1079, 3238, 1619, 4858, 2429, 7288, 3644, 1822, 911, 2734, 1367, 4102, 2051, 6154, 3077, 9232, 4616, 2308, 1154, 577, 1732, 866, 433, 1300, 650, 325, 976, 488, 244, 122, 61, 184, 92, 46, 23, 70, 35, 106, 53, 160, 80, 40, 20, 10, 5, 16, 8, 4, 2, 1
- **Steps:** 111 steps to reach 1. That is 112 values if you count the starting 27.
- **Largest value:** 9232, reached at step 77.
- **Plot:** the live trajectory plot is in the WLJS notebook `work/Collatz27.wln` (open on your second monitor), with the peak marked in red. A PNG copy is at `scratch/collatz27-check-fe.png`.
- An independent `NestWhileList` implementation and a fresh kernel both gave the same numbers.

## 6. Problems
- `Rasterize` + PNG export in the WLJS desktop kernel produced only a 44×34 "..." placeholder image, with no error message. I made the PNG with wolfram-direct instead.
- After my SVG export in the WLJS kernel, a headless Mathematica front end (`WolframNB`, PIDs 1850201/1850207, started 03:36:32) appeared as a child of the shared WLJS kernel (PID 1843411). Most likely my export started it (timing match, not proven). I did not kill it because it belongs to the shared kernel; it may stay running.
- Loading the package runs its own `BeginPackage`/`Begin`/`End`, which changes `$Context` briefly inside the shared kernel during the `Get`. That is inherent to loading the requested package. `$Context` was ``Global` `` afterwards.
- The package defines `Collatz` only for positive integers. Other inputs stay unevaluated. No issue for 27.
- I did not take a screenshot of the notebook window (no browser allowed). The plot was checked through the identical PNG from wolfram-direct, not in the WLJS window itself.
