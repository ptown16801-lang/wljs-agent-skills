# Run log: simulate-modelica (2026-10-22)

## 1. Skills used
1. simulate-modelica (local WLJS adaptation)

## 2. Steps
1. Loaded the `simulate-modelica` skill. Read `ROUTES.md` and the pinned upstream `simulate-modelica/SKILL.md` (System Modeler AI Toolkit, commit 991a800...). The local adaptation names the WLJS kernel as the default engine (`Import` the `.mo`, then `SystemModelSimulate`), so I did not use `wsm_run.py` or `wsm-toolkit`.
2. Read `work/ExampleModel.mo`: `model ExampleModel`, with `x(start=1)`, `y(start=1)`, `der(x) = -x`, `der(y) = y + x`. It has no MSL dependency and no external code.
3. **WLJS kernel via `mcp__wljs__kernel_evaluate`** (the default route; no notebook was opened). In one call I ran `Import["/abs/.../ExampleModel.mo"]` → `SystemModel["ExampleModel", True]`, then `SystemModelSimulate[m, 2]` → `SystemModelSimulationData`, and sampled `sim[{"x","y"}, t]` at t = 1 and t = 2. In the same call I computed the exact solution, x = e^-t and y = 1.5 e^t - 0.5 e^-t, to check the numbers. `$AllowInternet` was `False`. No messages were raised.
4. **WLJS kernel via `mcp__wljs__kernel_evaluate`**: checked `$Context` and `Context[res]` (see Problems), then ran `ClearAll[Global`res]`. `$AllowInternet` was still `False`.
5. **WLJS kernel via `mcp__wljs__kernel_evaluate`**: ran `Remove["testSimMo`*"]`. The check afterwards found no symbols left in that context.

## 3. Files
- Created: `<repo>/tests/runs/2026-10-22/simulate-modelica/run-log.md` (this file).
- Nothing else was created or changed. `work/ExampleModel.mo` was only read, and no temp directory was made.

## 4. WLJS notebook
none

## 5. Answer
I simulated ExampleModel for 2 s in System Modeler, running in the WLJS kernel. It ran with no errors or warnings.

| t | x | y |
|---|---|---|
| 1 | 0.367879 | 3.89348 |
| 2 | 0.135335 | 11.0159 |

These match the exact solution, x = e^-t and y = 1.5 e^t - 0.5 e^-t (exact: 0.3678794412, 3.893483022, 0.1353352832, 11.01591651). The relative error is about 1e-10.

## 6. Problems
- **Context slip in the shared kernel.** I wrapped the code in `Begin["testSimMo`"] ... End[]` inside a single `kernel_evaluate` expression. The whole input is parsed before `Begin` runs, so the symbol `res` was resolved in the context that was current at that moment, not in `testSimMo``. That context was `testModelicaSweep``, left current by another session. `Global`res` already existed, so my assignment **overwrote an existing `Global`res`** whose earlier value I don't know and could not restore. I then ran `ClearAll[Global`res]`. Any other session that relied on `Global`res` will find it undefined. Lesson: send `Begin[...]` as its own call, or use fully qualified names, or keep everything inside `Module`.
- When I first checked, `$Context` was `testModelicaSweep`` (another session's private context, not mine). By the next call it was `Global`` again, so another session is using the kernel at the same time. I did not change `$Context`.
- `Import` of the `.mo` loads `ExampleModel` into the kernel's System Modeler model store, and it stays there. I know no clean way to unload it and left it.
- The values come from interpolating the simulation result at t = 1 and t = 2, with the default solver settings. They agree with the exact solution, so I was not concerned.
