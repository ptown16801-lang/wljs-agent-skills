# Run log: annotate-control-panel (2026-10-22)

## 1. Skills used
1. annotate-control-panel (local WLJS adaptation; read ROUTES.md and the pinned upstream SKILL.md at `~/.local/share/wolfram-system-modeler-ai-toolkit/991a800.../annotate-control-panel/SKILL.md`)

## 2. Steps
1. Read `ROUTES.md` and the upstream skill. Found the source model at `<SystemModeler-install>/15.0/L/IntroductoryExamples/ComponentBased/ElectricCircuit.mo` (not modified).
2. Copied it to `work/ElectricCircuit.mo`, removing only the `within IntroductoryExamples.ComponentBased;` line so the copy is a stand-alone top-level model `ElectricCircuit`. Everything else (graphics, Documentation, stored figure `sineVoltage1.i`) is unchanged.
3. `wsm-toolkit panel --analyze` (Python engine, no kernel): reported 0 controllable parameters, as the adaptation note predicts (R and C are set as component modifiers `resistor1(R = 10)` etc.). So the spec was written by hand (Mode A): `work/panels.json`, one panel `rcTuning` "Resistor and capacitor values" with three log-scale sliders:
   - `resistor1.R` 1 to 100 Ohm (default 10)
   - `capacitor1.C` 0.001 to 0.1 F (default 0.01)
   - `resistor2.R` 10 to 1000 Ohm (default 100)
   - figures = {"sineVoltage1.i"} (the figure already stored in the model). Inductor and source were left out (not asked for). All minimums are > 0 (no singular values).
4. `wsm-toolkit panel --annotate` dry run (diff reviewed, no warnings), then `--write`. Removed the leftover empty `__Wolfram,` marker from `annotation(__Wolfram, experiment(...))` so there is exactly one `__Wolfram(ControlPanels(...))` in the file.
5. Engine check (WLJS kernel via `mcp__wljs__kernel_evaluate`, default route): `{1+1, $AllowInternet}` -> `{2, False}`. Then `Import` of a uniquely renamed scratch copy (`ElectricCircuit_acp1022`, because the kernel's model namespace is shared) and `SystemModelSimulate[m, 10]`: simulated to t = 10, parameters R1 = 10, C = 0.01, R2 = 100, `sineVoltage1.i(10)` = -0.04498.
6. Runtime-tunability check (`wsm-toolkit panel --annotate --force --sim-file <.sim from step 5>`, dry run on a scratch copy `scratch/simcheck.mo`, nothing written): no warnings, so all three variables exist in the built model and are not structural.
7. Validation gate (`wsm-toolkit wsm --mode validate`, WSMKernelX 15.0, MSL 4.1.0, run inside `bwrap --unshare-net` under `timeout 150`, tempdir `scratch/validate`): `status.flatten = Pass`, 0 errors, 2 warnings (unbound `sineVoltage1.f` and `sineVoltage1.V`). The unmodified original (`scratch/orig`, validated the same way into `scratch/validate-orig`) gives the same Pass and the same 2 warnings, so they come from the original model, not from the annotation. Reason for this engine: the skill's validation gate is this launcher; WLJS has no flatten-only check.
8. WLJS notebook (WLJS kernel via `mcp__wljs__new_notebook` / `add_cells_batch` / `evaluate_cell`): a `.md` explanation cell; a cell that imports `work/ElectricCircuit.mo` renamed in memory to `ElectricCircuit_acp1022` via `ImportString[..., "MO"]` and shows the three default values; a `Manipulate` over `SystemModelSimulate[m, 10, <|"ParameterValues" -> {...}|>]` with `SystemModelPlot` of `sineVoltage1.i`, three sliders on log10 of R1, C, R2 (same ranges as the panel), `ContinuousAction -> False`; a `NotebookSave` cell. Checked visually with `capture-wljs-windows.sh` and `mcp__wljs__project_cell` (window "Application"): sliders and plot render, label "R1 = 10 Ω, C = 0.01 F, R2 = 100 Ω".
9. Range check (WLJS kernel via `kernel_evaluate`, one simulation per call): four slider-range corners all simulate to t = 10 with the requested values; peak |i| = 0.0996 A (all minimums), 0.0111 A (all maximums), 0.587 A (R1=1, C=0.1, R2=10), 0.0059 A (R1=100, C=0.001, R2=1000). So changing the values changes the response without rebuilding.
10. Saved the notebook by evaluating `NotebookSave[EvaluationNotebook[], ".../work/ElectricCircuitExplore.wln"]`. Removed the kernel symbol `acp1022`ecModel` afterwards (`Names["acp1022`*"]` -> `{}`).

## 3. Files
- Created: `work/ElectricCircuit.mo` (annotated copy), `work/panels.json` (panel spec), `work/ElectricCircuitExplore.wln` (WLJS notebook), this `run-log.md`.
- Scratch (temporary): `scratch/ElectricCircuit_acp1022.mo`, `scratch/simcheck.mo`, `scratch/orig/ElectricCircuit.mo`, `scratch/validate/`, `scratch/validate-orig/`, `scratch/cap*/` (window captures).
- System Modeler also wrote its usual build files under `/tmp/WolframSystemModeler-<user>-15.0/` (WLJS `SystemModelSimulate`; not chosen by me).

## 4. WLJS notebook
`<repo>/tests/runs/2026-10-22/annotate-control-panel/work/ElectricCircuitExplore.wln`

## 5. Answer
I copied `IntroductoryExamples.ComponentBased.ElectricCircuit` to `work/ElectricCircuit.mo` (as a stand-alone model `ElectricCircuit`) and added an Explore control panel, "Resistor and capacitor values", with three logarithmic sliders:
- Resistor 1 (RC branch) `resistor1.R`: 1 to 100 Ω (default 10)
- Capacitor `capacitor1.C`: 0.001 to 0.1 F (default 0.01)
- Resistor 2 (RL branch) `resistor2.R`: 10 to 1000 Ω (default 100)

The panel shows the model's existing "Output current" plot (`sineVoltage1.i`). Open the `.mo` in System Modeler, simulate, and use Simulation Center's Explore view to drag the sliders. The model still validates (same result as the original), all three values can be changed without recompiling, and the corners of the ranges simulate cleanly. The same sliders also work in the WLJS notebook `work/ElectricCircuitExplore.wln`: each change re-simulates and replots the current. The spec is in `work/panels.json` if you want different ranges. The inductor and the source are not on the panel. Say if you want them added.

## 6. Problems
- `panel --analyze` / `--suggest` cannot see parameters set as component modifiers (0 found), so I wrote the spec by hand, as the adaptation note says.
- The annotator left the original empty `__Wolfram,` marker in place; I removed it by hand (sed).
- The validation warnings (unbound `sineVoltage1.V`, `sineVoltage1.f`, start values used) are in the original model too.
- The first `evaluate_cell` of the `.md` cell returned `$TimedOut`, but the rendered output was there (checked with `list_cells` and a screenshot).
- Showing the `SystemModel` object as cell output in WLJS raised display messages (`Set::shape`, `Part::partd`, `OptionValue::nodef`, `General::stop`), not seen with `kernel_evaluate`. I changed the cell to hide the object and show the three parameter values instead (no messages after that).
- The first plot label (`StringForm`/`NumberForm`) showed raw escaped text in WLJS; replaced with a plain string.
- I could not drag the sliders myself (no browser/input); re-simulation was checked with direct `SystemModelSimulate` calls using the slider-corner values and by viewing the rendered Manipulate at its defaults. The System Modeler Explore panel itself was not viewed (the System Modeler GUI was not opened).
- `mcp__wljs__project_cell` was used twice; the first projected window ("Application", 0x140003d) shows the older version with the bad label and is still open. I had no tool to close it.
- The Manipulate sliders are on log10 values (WLJS Manipulate has no log scale option); the System Modeler panel uses real log-scale sliders.
- `wsm-toolkit panel --write` left the `.mo` with mode 600; I set it to 664 like the other files.
