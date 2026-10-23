# Review I: annotate-modelica-plots, annotate-modelica-graphics, annotate-control-panel (current runs, 2026-10-22)

## Disagreements

None. I agree with the orchestrator on all three skills: all six checks pass for each. In every run, the System Modeler visual was actually produced, viewed inside WLJS, and is correct. I checked this against my own PNGs from a fresh kernel and against fresh simulations.

## annotate-modelica-plots: agree

The copy carries one `Documentation(figures=...)` figure, "States x and y" (`preferred = true`), with separate x and y plots. The original `ExampleModel.mo` is unchanged.

Fresh network-cut kernel (`scratch-I/plots.wls`):
- `PlotNames = {"States x and y"}`.
- x(10) = 4.539992e-5 and y(10) = 33039.7046. These are identical to the run and within 2e-7 relative of the exact values e^-10 and 1.5e^10 - 0.5e^-10.

The visual:
- The run's capture `scratch/cap/0x140001d_Application.png` (= `evidence/stored-plots.png`) shows both panels at full range.
- My own export (`scratch-I/plots-stored-figure.png`) matches it.

The "title twice" finding is the plot title plus the y-axis label. Mathematica draws both as well.

## annotate-modelica-graphics: agree

I rendered `SystemModel[...]["Diagram"]` myself in a fresh kernel (`scratch-I/Submarine-diagram-I.png`). It shows the same clean, orthogonal schematic as the run's PNG and its WLJS capture (`scratch/cap2/0x140007f_Application.png`).

Spot checks of the hand-fixed pins against the MSL 4.1.0 source both hold:
- `Prismatic.axis` is at {80,60}, so the line should end at {48,-24}.
- `Position.s_ref` is at {-120,0}, so the line should end at {-12,10}.

The flattened model is unchanged versus the card fixture. I compared two class-renamed copies:
- Identical: SystemEquations (1419), InitialEquations (48), state, input, output and algebraic variables, connections, and parameter values.
- ParameterNames differ only in order.
- y(50) = -0.8312141299 for both, with deltarho = 50 and f = 0.

Wolfram bug W4 (the toolkit's guessed pins) hit again. The final layout is the run's hand fix.

Notes:
- The upstream tool added `extends Modelica.Icons.Example`. The equations are unchanged, and the run flagged it.
- The subShape label is clipped at the diagram's right edge. This is cosmetic.

## annotate-control-panel: agree

The annotation:
- One `__Wolfram(ControlPanels(Panel(...)))` with balanced brackets.
- Syntax as in the upstream skill (`scale = Log()`, figure id `sineVoltage1.i` exists).
- Ranges are non-zero: R1 1–100, C 0.001–0.1, R2 10–1000.
- It validates (flatten Pass, run after the final edit) and simulates.

I simulated `work/ElectricCircuit.mo` standalone in a fresh kernel and took the peak |sineVoltage1.i| on [5,10] s. All three agree with the run's claims and with the orchestrator's hand calculation:

| Parameters | My fresh-kernel peak | AC steady-state value | Run's claim |
|---|---|---|---|
| Defaults | 0.05908 A | 0.059083 | 0.059 |
| R1 = 28.2, C = 0.01, R2 = 501 | 0.03263 A | 0.032634 | 0.033 |
| Corner R1 = 1, C = 0.1, R2 = 10 | 0.58626 A | 0.586303 | 0.59 |

The run's "0.0341 max" for the second case is the peak including the start-up transient. I get 0.03404 for that.

The WLJS Manipulate:
- It renders (`cap4/0x140002e`).
- It re-simulated after the slider move to 28.2/501 Ω (`cap5/0x1400038`, identical to the orchestrator's caps2 copy).
- The comparison plot (`cap5/0x1400089`) shows the default and corner currents correctly.
- The run did not move the sliders itself and says so.

Notes:
- The y-axis did not rescale after the slider update. WLJS's JIT update appears to keep the first plot range.
- Dead `.js` probe cells were left in the notebook. They are labelled.
- The `.mo` file is left with mode 600.
- The run folder has no `auto-checks.json`. I recomputed it from the session record: triggered, no rule hits.
- The log says validation gave 2 warnings, but they actually appear in the simulate output, not the validate output.

## Cross-run finding (not a grade change)

Two of the three saved notebooks store their graphics only as references, with no Objects section (bug J3):
- `ExampleModel_plots.wln`
- `Submarine-schematic.wln`

`ElectricCircuit-panel.wln` does have an Objects section that covers all its references. This supports reviewer H's point that the kernel-side save route sometimes skips the object sync. A difference worth comparing: the panel notebook was edited much more (set_cell_lines, cell inserts), which may have triggered a sync.

Files: `tests/levelC/review-I.json`; scripts and PNGs in `tests/levelC/scratch-I/`.
