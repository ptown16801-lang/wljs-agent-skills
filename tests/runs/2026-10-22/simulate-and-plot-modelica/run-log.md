# Run log: simulate-and-plot-modelica (2026-10-22)

## 1. Skills used
- simulate-and-plot-modelica (local WLJS adaptation; read `ROUTES.md` and the pinned upstream `SKILL.md` as it instructs)

## 2. Steps
All Wolfram evaluations ran in the **WLJS kernel** (the skill's local default engine: System Modeler runs inside it and `SystemModelPlot` renders live in a WLJS notebook). No `wolframscript`, `wolfram-direct` or `wsm-toolkit` was used; the upstream DyMat/Python path is only the fallback when no kernel is available.

1. Read `ROUTES.md` and the upstream skill. Created the scratch folder.
2. `mcp__wljs__kernel_evaluate`: checked `$AllowInternet` (False) and listed `SystemModels["IntroductoryExamples.Hierarchical.*"]`. Runnable examples there: FlatTank, TankPI, TankPID, TankSystem. Chose **TankPID**.
3. `kernel_evaluate`: read its simulation settings (StartTime 0, StopTime 350 from its `experiment` annotation), description, components, and the Modelica source of TankPID, Tank and LiquidSource. The model stores a figure "Disturbance rejection" plotting `pidControl.ref`, `tank.h` and `tank.qIn`, `tank.qOut`; I used those as the main outputs.
4. `kernel_evaluate`: test simulation; checked variable names (`tank.qIn`/`tank.qOut` are the variables, not `.lflow`).
5. `kernel_evaluate`: second simulation; values at key times, parameter values, the level maximum (`FindMaximum`).
6. WLJS notebook (`new_notebook`, `add_cells_batch`, `evaluate_cell`): intro `.md` cell, `SystemModelSimulate` cell (third simulation, kept as `tankPIDRun`sim`), two `SystemModelPlot` cells, a results `.md` cell, and a `NotebookSave` cell.
7. `kernel_evaluate` (twice): checked outflow saturation and tank-empty intervals against `tankPIDRun`sim`.
8. Captured the windows with `tools/capture-wljs-windows.sh`, then projected the level plot (`project_cell`). It showed that `SystemModelPlot`'s default plot range cut the level curve at 0.35 m, hiding both peaks. I added `PlotRange -> All` to both plot cells, corrected the results text, re-evaluated, re-saved, re-projected both plot cells and checked the captures (both plots correct).
9. `kernel_evaluate`: `Remove["tankPIDRun`*"]`; confirmed `$AllowInternet` is still False.

## 3. Files
- Created `<repo>/tests/runs/2026-10-22/simulate-and-plot-modelica/work/TankPID.wln`
- Created the screen captures in `<repo>/tests/runs/2026-10-22/simulate-and-plot-modelica/scratch/cap`, `cap2` … `cap5` (scratch)
- Created this file, `run-log.md`
- Simulation build files were written by System Modeler under `/tmp/WolframSystemModeler-<user>-15.0/` (its own default location; not chosen by me)

## 4. WLJS notebook
`<repo>/tests/runs/2026-10-22/simulate-and-plot-modelica/work/TankPID.wln`

## 5. Answer
I chose `IntroductoryExamples.Hierarchical.TankPID` and simulated it for its default experiment (0 to 350 s). In this model, a PID controller (K = 0.1, T = 10 s, Td = 5 s) works the tank's outflow valve to hold the level at ref = 0.25 m. The valve is limited to 0–0.5 m³/s. The inflow is 0.15 m³/s and triples to 0.45 m³/s at t = 150 s. I plotted the curves the model's own stored figure uses: tank level against the reference, and inflow against outflow. The plots are in the WLJS notebook `TankPID.wln`.

- **Start-up:** the tank starts empty. The level overshoots to 0.996 m at t = 17.75 s, dips to about 0.07 m near t = 60 s, and is at 0.240 m by t = 149 s, with the outflow equal to the inflow (0.150 m³/s).
- **After the step:** the outflow lags behind the new inflow. The level peaks at **1.712 m at t = 165.55 s**, which matches the "maximum overshoot" marker stored in the model. The controller then holds the valve at its 0.5 m³/s limit from about t = 172 s to 202.5 s. This drains the tank completely: the level stays at 0 from about t = 203 s to 235 s, and the outflow is limited to the inflow during that time. The level then recovers to 0.252 m at t = 350 s, with the outflow at 0.450 m³/s.
- Both the valve and the level hit their limits, as the model's own figure caption says.

## 6. Problems
- `SystemModelPlot` without a `PlotRange` cut the level plot at about 0.35 m, hiding both overshoot peaks (seen in the first projected window). Fixed with `PlotRange -> All`.
- My first draft of the results text came before that check and called the valve "saturated" at the overshoot peak; I verified the numbers and corrected it before the final save.
- `evaluate_cell` on the second `.md` cell once returned `$TimedOut`, but the markdown output was created; the second evaluation returned normally.
- Messages seen, both from my own probing code and harmless: `StringStartsQ::strse` (derivative variable names are not strings), `SystemModelSimulationData::urvs` for the guessed names `tank.qIn.lflow` and `"EventTimes"`.
- The capture script printed an X error (`BadColor`) for one window and left an empty `.xwd` for another "Application" window that is not mine; my windows captured fine.
- I left open the three projected "Application" windows I opened (one shows the clipped first version of the level plot) and the notebook window; I closed nothing.
- In the projected plots, the legend label "reference" wraps onto two lines (cosmetic).
- The model was simulated three times in the shared kernel (probe, values, notebook cell); each took well under the 220 s limit.
