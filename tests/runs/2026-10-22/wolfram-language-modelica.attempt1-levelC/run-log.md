# Run log: wolfram-language-modelica, 2026-10-22

## 1. Skills used
1. wolfram-language-modelica (local WLJS adaptation; I read ROUTES.md and the pinned upstream SKILL.md at
   `~/.local/share/wolfram-system-modeler-ai-toolkit/991a80001b819b98e9484d26ff5e650657449d6a/wolfram-language-modelica/SKILL.md`)

## 2. Steps
1. Read `work/ExampleModel.mo`: `der(x) = -x; der(y) = y + x;` with `x(start=1)`, `y(start=1)`. It has no parameters, so the sweep is over the start value of x.
2. **WLJS kernel via `mcp__wljs__kernel_evaluate`** (the skill's default engine; System Modeler runs in the WLJS kernel). Inside the private context `testModelicaSweep``:
   checked `$AllowInternet` (False), then `Import[".../ExampleModel.mo", "MO"]` returned `SystemModel["ExampleModel", True]`.
3. **WLJS kernel via `mcp__wljs__kernel_evaluate`**: ran a single `SystemModelSimulate[model, {"x","y"}, {0,1}, <|"InitialValues" -> {"x" -> {0.5, 1., 2.}}|>, ProgressReporting -> False]`.
   It returned 3 simulations, with configurations x = 0.5, 1, 2 and no messages. I read y(1) and x(1) from each one and compared them with the closed form e + x0·sinh(1).
   Then `End[]`.
4. **WLJS kernel via `mcp__wljs__kernel_evaluate`**: checked the closed form with `DSolveValue`, which gave y(t) = Cosh[t] + (1 + a) Sinh[t] with no messages. `FullSimplify` confirmed y(1) == E + a Sinh[1] (True).
5. **WLJS kernel via `mcp__wljs__kernel_evaluate`**: cleanup. `Remove["testModelicaSweep`*"]` left no symbols, `$Context` is "Global`" again, and `$AllowInternet` is still False.
6. Wrote the notebook source `ExampleModelSweep.md` and converted it with `tools/md2wln.py` (no window, no `new_notebook`). Its code cells are not evaluated. Running them reproduces the sweep, the DSolve check and a `SystemModelPlot` of y.

No wolframscript, wolfram-direct or wsm-toolkit runs. Nothing contacted any network service.

## 3. Files
- Created `work/ExampleModelSweep.md` (notebook source)
- Created `work/ExampleModelSweep.wln` (WLJS notebook, converted from the .md)
- Created `run-log.md` (this file)
- `work/ExampleModel.mo` unchanged

## 4. WLJS notebook
`<repo>/tests/runs/2026-10-22/wolfram-language-modelica/work/ExampleModelSweep.wln` (made with md2wln.py, never opened, cells not evaluated)

## 5. Answer
ExampleModel is x' = -x, y' = y + x, y(0) = 1. Exact solution: x = x0·e^-t and y(t) = cosh t + (1 + x0) sinh t, so y(1) = e + x0·sinh 1.

| x(0) | y(1) simulated | y(1) exact | sim - exact |
|---|---|---|---|
| 0.5 | 3.30588242589 | 3.30588242528 | 6.1e-10 |
| 1   | 3.89348302285 | 3.89348302210 | 7.5e-10 |
| 2   | 5.06868421666 | 5.06868421575 | 9.2e-10 |

The simulation matches the exact solution to about 9 significant digits, with relative error about 2e-10. x(1) also matches x0/e to about 1e-10. The error grows linearly with x0, as expected from solver tolerance.
The notebook `work/ExampleModelSweep.wln` reproduces this and plots y(t) for the three cases.

## 6. Problems
- My first attempt at the exact solution, `DSolveValue[{..., x[0]==a, yy[0]==1}, yy[1], {x, yy}, t]`, came back unevaluated, and the `$MessageList` capture showed no message. I did not investigate why. Possibly the `yy[1]` target in that form is the cause, or a name clash with the `x` symbol in my private context. Solving for `yf[s]` with other symbol names worked.
- The first `Begin["testModelicaSweep`"]` lasted across `kernel_evaluate` calls. For one call the shared kernel's `$Context` was my private context, until `End[]` in the next call. It is restored now.
- The `.wln` cells are unevaluated and the notebook was not opened (per the ground rules). Its plot cell has not been viewed.
- The notebook's code cells use plain names (`model`, `sims`, `x0s`, ...) in whatever context the notebook uses when the owner evaluates it.
