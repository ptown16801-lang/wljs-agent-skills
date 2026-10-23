# Run log: annotate-control-panel (ElectricCircuit), 2026-10-22

## 1. Skills used
1. annotate-control-panel (local WLJS adaptation; read ROUTES.md and the pinned upstream SKILL.md as it directs)
2. wljs-javascript (loaded to write `.js` cells for an attempt to drive the sliders from a script; read WLJS's `javascript.md` guide)

## 2. Steps
1. Read `ROUTES.md` and the pinned upstream `annotate-control-panel/SKILL.md`.
2. Found `IntroductoryExamples/ComponentBased/ElectricCircuit.mo` in the System Modeler install (`~/sudo/SystemFiles/Components/WSMCore/SystemModeler/L/...`) and copied it to `work/ElectricCircuit.mo`, removing the `within IntroductoryExamples.ComponentBased;` line so the copy stands alone. Nothing else changed.
3. `wsm-toolkit panel --analyze` (Python, no Wolfram engine): it found 0 controllable parameters, because R and C are set as component modifiers (`resistor1(R = 10)`). This matches the known limitation, so I wrote the spec by hand in `work/panels.json`. It has one panel, "Resistor and capacitor values" (id `rcValues`), with three log-scale sliders: `resistor1.R` 1–100 Ω, `capacitor1.C` 0.001–0.1 F and `resistor2.R` 10–1000 Ω. The panel shows the model's existing stored figure `sineVoltage1.i`.
4. `wsm-toolkit panel --annotate`: did a dry run, checked the diff, then ran with `--write`. Afterwards I removed the leftover empty `__Wolfram` marker (`annotation(__Wolfram, experiment(...` became `annotation(experiment(...`), so the file now has exactly one `__Wolfram(ControlPanels(...))`.
5. Validate: `wsm-toolkit wsm --mode validate` (WSMKernelX 15.0, MSL 4.1.0) inside the network cut (bwrap --unshare-net) with timeout. Result: `flatten = Pass`, no errors, 2 warnings (see Problems).
6. Simulate: `wsm-toolkit wsm --mode simulate` (WSMKernelX, network cut). Result: flatten, build and result all Pass. The `.sim` file lists `resistor1.R`, `capacitor1.C` and `resistor2.R` as `MACRO_TUNABLE`. I also ran `panel --annotate --sim-file` on a panel-free scratch copy: it raised no warnings, so all three sliders can be tuned without a rebuild.
7. Diagram: ran `SystemModel[m]["Diagram"]` → PNG in a fresh kernel (`wolframscript` inside bwrap, `$AllowInternet = False`, timeout), because it fails in the WLJS kernel (ROUTES). I checked the PNG: the circuit is drawn correctly.
8. WLJS kernel (`mcp__wljs__kernel_evaluate`), for checks the user does not need to see. I imported the renamed scratch copy `ElectricCircuit_acp1022` (renamed because the kernel and its model namespace are shared) and ran one simulation with default values: `$AllowInternet` False, i(10) = −0.0450 A, peak |i| 0.0591 A. Later I ran one more simulation at R1 = 10^1.45, R2 = 10^2.7 to cross-check the live panel (max 0.0341 A, min −0.0326 A).
9. WLJS notebook (`mcp__wljs__new_notebook`, `add_cells_batch`, `evaluate_cell`; WLJS kernel). Contents: an intro `.md`; the diagram; the panel rebuilt as a `Manipulate` over `SystemModelSimulate` (three log10 sliders with the same ranges, `ContinuousAction -> False`, `SystemModelPlot` of `sineVoltage1.i` with `PlotRange -> All`); a table of the range corners; a plot comparing the default values with the high-current corner; and a save cell placed last.
10. Looked at the result: `capture-wljs-windows.sh` plus `mcp__wljs__project_cell` on the Manipulate and comparison cells. The Manipulate renders its sliders and plot. The first version's title came out as raw StringForm box code, so I replaced it with a plain string. In a projected panel window the sliders were later at R1 = 28.2 Ω, R2 = 501 Ω (moved by someone else, see Problems). The plot had re-simulated: peak ≈ 0.034 A, which matches my independent kernel simulation at those values (0.0341 / −0.0326 A).
11. Tried to move the sliders myself from a `.js` cell. It failed: no range inputs were reachable in the notebook DOM. I labelled those cells in the notebook as a check that did not work and left them there (the MCP delete tool is for user-requested deletions only).
12. Saved with `NotebookSave[EvaluationNotebook[], ...]` from the last cell. I checked that the `.wln` holds the Manipulate, the table and the comparison plot.

## 3. Files
- Created `work/ElectricCircuit.mo`: standalone copy with the control panel annotation
- Created `work/panels.json`: the panel spec
- Created `work/ElectricCircuit-diagram.png`: model diagram (fresh kernel)
- Created `work/ElectricCircuit-panel.wln`: WLJS notebook
- Scratch, all in `scratch/`: `ElectricCircuit_acp1022.mo` (renamed copy for the WLJS kernel), `ElectricCircuit_orig.mo` (panel-free copy for the `--sim-file` check), `diagram.wls`/`diagram.log`, `validate/`, `validate.log`, `simulate/`, `simulate.log`, `cap/`…`cap5/` (screenshots)
- This run log

## 4. WLJS notebook
`<repo>/tests/runs/2026-10-22/annotate-control-panel/work/ElectricCircuit-panel.wln`

## 5. Answer
I copied ElectricCircuit to `work/ElectricCircuit.mo` (standalone, no `within`) and gave it a System Modeler Explore panel, **"Resistor and capacitor values"**:

- Resistor 1 R: `resistor1.R`, 1–100 Ω, log scale (default 10)
- Capacitor C: `capacitor1.C`, 0.001–0.1 F, log scale (default 0.01)
- Resistor 2 R: `resistor2.R`, 10–1000 Ω, log scale (default 100)

The panel shows the model's existing "Output current" plot (`sineVoltage1.i`). The model still validates and simulates in System Modeler's kernel. All three parameters are runtime-tunable, so dragging a slider in Simulation Center re-simulates without a rebuild. Open the model in System Modeler and go to Simulation Center → Explore to use it.

To show it working without System Modeler's GUI, the WLJS notebook `work/ElectricCircuit-panel.wln` (open on your second monitor) has the same panel as a live `Manipulate`. Each slider release re-simulates the model and redraws the current. Its sliders move in powers of ten, and the plot title shows the actual values. In one panel window the sliders were moved to R1 = 28.2 Ω, R2 = 501 Ω, and the plot re-simulated correctly: peak ≈ 0.034 A, matching an independent simulation. Across the slider ranges the peak source current goes from 0.006 A (R1 = 100, C = 0.001, R2 = 1000) to 0.59 A (R1 = 1, C = 0.1, R2 = 10).

If WLJS is restarted, the saved plots show "Loading…" until you re-evaluate their cells; the code to redraw them is in the notebook.

## 6. Problems
- `panel --analyze` / `--suggest` found no parameters (they are component modifiers), so I wrote the spec by hand. Known limitation.
- After `--write`, the original empty `__Wolfram` marker was still in the annotation. I removed it by hand.
- Validation warnings that were already in the original model: `sineVoltage1.V` and `sineVoltage1.f` have no binding, so their start values are used. Unrelated to the panel.
- The WLJS Manipulate has no log-scale slider option, so its sliders run over log10 of each value instead (same ranges). It is a stand-in. I did not see the native Explore panel itself: the System Modeler GUI was not opened.
- I could not drive the sliders myself. From a `.js` cell no range inputs could be found in the notebook DOM (output probably not mounted or a custom element), and no X input tool (xdotool) is installed. The live re-simulation I saw came from slider moves I did not make, in projected window 0x1400038, probably the user. I did not cause it, but the plot matched my kernel check at those values.
- I added the `.md` note cell with "Before 025", and afterwards several cells' outputs (the Manipulate, the corners table) were missing from `list_cells`. Re-evaluating them restored the outputs. The `.js` probe cells' outputs and cell 025 were left unevaluated (harmless).
- I opened three projected windows with `project_cell` (two of the Manipulate and one of the comparison plot). I did not close them because there is no tool for it; they are titled "Application" on the second monitor. One other "Application" window (a buoyancy/submarine diagram) belongs to another session; I left it alone.
- The first Manipulate title used `StringForm`/`NumberForm` and rendered as raw box code in WLJS. Replaced with a plain string.
