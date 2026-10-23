# Run log: diagnose-modelica, 2026-10-22

## 1. Skills used

1. `diagnose-modelica` (local WLJS adaptation). As it instructs, I read `ROUTES.md` and the pinned upstream `diagnose-modelica/SKILL.md`. No other skill was loaded.

## 2. Steps

1. I read `ROUTES.md`, the upstream SKILL.md, `DrawingRobot.mo` (model `DrawingRobot`, MultiBody cart and pendulum, MSL 4.x), and `wsm-toolkit help` and `--help` for `wsm`, `blocks`, `tearing`, `events` and `numerics`.
2. **WLJS kernel (`mcp__wljs__kernel_evaluate`)**, the adaptation's default engine for the basic diagnosis: `Import` of the `.mo`, then `SystemModel[...]` `"StateVariables"`, `"SystemEquations"`, `"ParameterNames"`, `"InputVariables"`, `"OutputVariables"` inside a `Module`. Results: `$AllowInternet` = False; 4 states (`slider.s`, `slider.v`, `revolute.phi`, `revolute.w`); 1368 equations; 199 parameter names; inputs `f`, `tau`; outputs `x`, `y`.
3. **`wsm-toolkit wsm --mode diagnose`** (WSMKernelX 15.0, MSL 4.1.0), with a fresh `--tempdir work/_wsm_diagnose_temp` and `--timeout 300`. I used it because the adaptation names wsm-toolkit as the route for deep reports (blocks, tearing, events, numerics), which WLJS cannot produce. Exit 0. `diagnose.out.json` status: flatten, build and result all Pass; 0 errors, 14 warnings, 23 notifications.
4. **`wsm-toolkit blocks`** (`--summary` and the full report), **`tearing`**, **`numerics`** and **`events`** on the build artifacts. These are Python report scripts; no Wolfram evaluation. I also used Python to read `diagnose.mos`, the `.sim` header (DASSL, 0 to 20 s, step 0.01, 2000 output steps) and the 8 ODE blocks in `_blockdebug.json`.
5. **WLJS kernel**: timed `SystemModelSimulate[SystemModel["DrawingRobot"], 20]` (6.02 s, compile included, all states stay at 0 because the inputs default to 0), then the same call with inputs `f = 0.5 Sin[2t]` and `tau = 0.05 Cos[3t]` (0.62 s, the compiled model was reused; at t = 20, phi = 0.0113, s = 1.19). I used the WLJS kernel because it is the default engine for simulation and this gave real runtime numbers with non-zero inputs.
6. **WLJS kernel**: the same input run again to read `"Method"` (Automatic, tolerance 1e-6), `"NumberOfEvents"` (2), `"Events"` ({0, 20}) and `"ExitCode"` (0).
7. I deleted `work/_wsm_diagnose_temp/`, as upstream step 6 says.
8. I wrote the report as `DrawingRobot-diagnosis.md` and converted it with `tools/md2wln.py` into `DrawingRobot-diagnosis.wln`, which I did not open: there was no window and no `new_notebook` call. After I softened two unverified claims I deleted the first `.wln` and converted again, since md2wln refuses to overwrite.

No call reached Wolfram's servers. `$AllowInternet` was False. Nothing was installed and no window was opened.

## 3. Files

- Created: `<repo>/tests/runs/2026-10-22/diagnose-modelica/work/DrawingRobot-diagnosis.md`
- Created: `<repo>/tests/runs/2026-10-22/diagnose-modelica/work/DrawingRobot-diagnosis.wln`
- Created, then deleted: `.../work/_wsm_diagnose_temp/` (build artifacts)
- Scratch, outside the project: `<scratch>/diagnose.log` and `blocks_full.txt`
- Created: this run log.
- `DrawingRobot.mo` was not changed.

## 4. WLJS notebook

`<repo>/tests/runs/2026-10-22/diagnose-modelica/work/DrawingRobot-diagnosis.wln`. It was generated from Markdown by md2wln and was not opened or evaluated; its single Wolfram cell is unevaluated.

## 5. Answer

DrawingRobot builds and simulates cleanly.

- **States: 4** continuous (`slider.s`, `slider.v`, `revolute.phi`, `revolute.w`), 0 discrete.
- **Equations: 1368** in the flattened model. After the compiler sorts them into blocks: 405 initialization equations (391 blocks), **22 at each integration step** (8 blocks), and 74 output equations. There are 1156 algebraic variables, 457 numeric parameters (+15 string), and 74 aliases were eliminated.
- **Per-step work:** a single coupled block: 15 linear equations (the cart and pendulum accelerations and the joint forces). Tearing brings it down to 2 iteration variables, and its Jacobian is analytic. There are no nonlinear systems, no numeric Jacobians and 0 zero crossings. The only 2 events are the start and the end of the run.
- **What slows it down: the compile, not the simulation.** The first `SystemModelSimulate` took 6.0 s. A re-run with real inputs took 0.62 s, and the kernel's own integration time is 0.04 s (4046 function evaluations over 20 s). The large variable count comes from MultiBody bookkeeping and the animation shapes. Turning off animation on `cart`, `pendulumRod`, `ball` and `shape` should shrink the model and the build (not tested). For repeated runs, reuse the compiled model.
- **Warnings:** `ball.r_CM` has no binding, so its start value is used. The deprecated `cardinality` and `Connections.rooted` notices all come from inside MSL.

## 6. Problems

- None failed.
- Count differences between engines: the WLJS `"ParameterNames"` lists 199 parameters, while the kernel header gives NP = 457. Most likely the kernel also counts internal parameters (not checked).
- `report_blocks.py --summary` prints "coupled nonlinear systems=2", but the full report, `tearing` and `numerics` all say both systems are analytic **linear**. They are one system that appears twice, once in initialization and once in the ODE section. I reported them as linear.
- The claim that animation parts cause much of the variable count is inferred from variable names; I did not count it. The effect of turning animation off is untested. I did not test for stiffness separately.
- The 6.0 s first-run time includes compilation in the shared WLJS kernel, so other sessions' load may have affected the timing.
- The `.sim` file showed no tolerance attribute in the part I read; the WLJS run reports tolerance 1e-6.
