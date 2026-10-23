# Run log: annotate-modelica-graphics (Submarine.mo), 2026-10-22

## 1. Skills used
1. annotate-modelica-graphics (local WLJS adaptation; read ROUTES.md and the pinned upstream SKILL.md as it instructs)

## 2. Steps
1. Read `work/Submarine.mo` (top-level `model Submarine` with nested `model BuoyancyDynamics`, 7 component instances, 9 `connect`s, 3 top-level connectors `f`, `deltarho`, `y`; no graphics). Backed it up as `scratch/Submarine.orig.mo`.
2. `wsm-toolkit schematic --analyze` (pure Python, no Wolfram engine): Submarine = composite → `Modelica.Icons.Example` + diagram; BuoyancyDynamics = leaf with unrecognized domain → needs an authored glyph.
3. Wrote `scratch/glyphs.json` with a BuoyancyDynamics icon (submarine hull and sail below a wavy water surface, buoyancy arrow, dashed vertical-position line labelled `y`; ports `f`, `deltarho` left, `y` right). Previewed the diff with `wsm-toolkit schematic --annotate --glyphs-file`, then applied with `--write` (copy of that output kept as `scratch/Submarine.auto.mo`).
4. Checked the automatic layout against the installed MSL 4.1.0 source (`<SystemModeler-install>/15.0/L/Modelica 4.1.0/...`). As the skill warned, its pin positions were wrong: `position.s_ref`/`position.flange` both drawn on the left, `world.frame_b` on the left, `prismatic.axis` on `frame_a`. Real pins: Position s_ref {-120,0}, flange {100,0}; Prismatic frame_a {-100,0}, frame_b {100,0}, axis {80,60}; World frame_b {100,0}; Body / FixedShape / Visualizers.Rectangle frame_a {-100,0}.
5. Replaced every Placement and connection Line with a hand layout (`scratch/fix_layout.py`, exact-match replacements that assert each target occurs once): signal row on top (`f`, `deltarho` → enlarged `buoyancyDynamics` → output `y`, branch to `position`), mechanics row below (`position.flange` drops onto `prismatic.axis`; `world` → `prismatic` → `subBody`; `fluidSurface` on `world`, `subShape` on `subBody`). All lines orthogonal and ending on the real pins; MultiBody lines in MSL grey {95,95,95}, signal lines blue, translational green. Diagram extent {{-140,-80},{140,80}}. BuoyancyDynamics inputs moved to standard RealInput extents at ±40. Later shortened the icon's dashed line so it no longer crosses the sail. Restored file mode 664 (the tool's write had left it 600).
6. Validation (engine: `wsm-toolkit wsm --mode validate`, WSMKernelX; it is the skill's validation gate): original and annotated both `flatten: Pass`, 0 errors, same 3 MSL warnings. Compared the two flat models after stripping annotation/Placement/Line fragments: identical (242,544 characters each). Final file re-validated after the icon tweak: Pass, 0 errors, 3 warnings.
7. Rendering (engine: fresh kernel via `wolframscript` inside `bwrap --unshare-net`, `$AllowInternet = False`, under `timeout`; ROUTES.md says System Modeler diagrams only render in a fresh kernel, not in WLJS): `SystemModel["Submarine"]["Diagram"]` and `["ModelicaIcon"]` (the `"Icon"` property is not valid; first attempt returned an unevaluated `SystemModel[Submarine, Icon]` that was exported as text and then replaced) exported to PNG. Looked at each PNG.
8. Simulation check (engine: WLJS kernel via `mcp__wljs__kernel_evaluate`; default engine for simulation): imported a copy renamed `Submarine_amg1022` (shared-kernel namespace rule), `$AllowInternet` = False. With `deltarho` = 50, `f` = 0: y(50) = subBody.r_0[3](50) = -0.8312 m (matches the earlier -0.83 m). First attempt passed constants instead of functions as inputs (`SystemModelSimulate::invf`); fixed with `(50 &)`.
9. WLJS notebook (engine: WLJS kernel via `mcp__wljs__new_notebook`/`add_cells_batch`/`evaluate_cell`): Markdown intro, the diagram PNG, the two icon PNGs, a `SystemModelPlot` of `y` (PlotRange -> All), save cell last. Saved, checked the .wln contains the cells, captured the notebook window with `tools/capture-wljs-windows.sh` and projected the diagram cell (`mcp__wljs__project_cell`, window "Application") to confirm the diagram shows as intended.

## 3. Files
- Changed: `work/Submarine.mo` (annotations only, plus `extends Modelica.Icons.Example;`)
- Created: `work/Submarine-diagram.png`, `work/Submarine-icon.png`, `work/BuoyancyDynamics-icon.png`, `work/Submarine-schematic.wln`
- Scratch: `scratch/Submarine.orig.mo`, `scratch/Submarine.auto.mo`, `scratch/glyphs.json`, `scratch/fix_layout.py`, `scratch/render.wls`, `scratch/render_icon.wls`, `scratch/Submarine_amg1022.mo`, `scratch/val_orig/`, `scratch/val_new/`, `scratch/val_final/` (+ `.log`), `scratch/flat_orig.txt`, `scratch/flat_new.txt`, `scratch/cap/`, `scratch/cap2/`
- This log.

## 4. WLJS notebook
`<repo>/tests/runs/2026-10-22/annotate-modelica-graphics/work/Submarine-schematic.wln`

## 5. Answer
Submarine.mo now has a proper diagram. The signals run along the top: `f` and `deltarho` go into `buoyancyDynamics`, and its output `y` goes to the model output and drives `position`. The mechanics run along the bottom: `position` moves the prismatic joint's axis, and the chain goes `world` → `prismatic` → `subBody`. The two visualizers sit on `world` (`fluidSurface`) and on `subBody` (`subShape`). Every line is right-angled and ends on the component's real connector.

`BuoyancyDynamics` has a new icon: a submarine under a water surface, with a buoyancy arrow. The top-level model uses the standard Example icon.

I checked that only the drawing changed. Before and after, the model passes the validation check with the same 3 warnings from the standard library. Once the drawing annotations are removed, the flattened models are identical. A test run gives the same result as before: with the submarine 50 kg/m³ denser than average, it sinks to -0.83 m after 50 s.

The diagram is open in a WLJS notebook (Submarine-schematic.wln) and saved as Submarine-diagram.png, with the icons in Submarine-icon.png and BuoyancyDynamics-icon.png. The automatic layout tool had put several connectors on the wrong side, so I placed every component and line by hand. You can still move things around in System Modeler.

## 6. Problems
- The automatic layout put lines on the wrong pins for `Position`, `Prismatic` and `World.frame_b` (known issue); fixed by hand, so the final layout is hand-authored, not the tool's.
- The tool labels Submarine a "runnable example" and gives it `Modelica.Icons.Example`, although the model has input/output connectors. Kept as upstream decides; a custom submarine icon would be an alternative if the model is meant to be used as a block.
- `SystemModel[...]["Icon"]` is not a property in this version (use `"ModelicaIcon"`). First input-function attempt raised `SystemModelSimulate::invf` (my mistake, fixed).
- The 3 validation warnings are MSL's deprecated `cardinality` operator (present before and after).
- `subShape` refers to `modelica://DocumentationExamples/Resources/Submarine.stl`, which is not in this folder; this affects only the 3D animation, which I did not check.
- The WLJS kernel does not keep graphics in the saved .wln (bug J3). After a WLJS restart, the plot cell must be evaluated again. The PNG files on disk are not affected.
- The projected "Application" window for the diagram cell (opened by me) and the notebook window are left open.
- The diagram was checked only as rendered by Wolfram Language's System Modeler renderer, not in the System Modeler desktop app.
