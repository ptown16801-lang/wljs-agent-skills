# Run log: annotate-modelica-graphics (Submarine.mo), 2026-10-22

## 1. Skills used
1. annotate-modelica-graphics (local WLJS adaptation, then ROUTES.md and the pinned upstream SKILL.md at toolkit commit 991a800)

## 2. Steps
1. Read `ROUTES.md`, the local skill file and the upstream `SKILL.md`. Copied the original model to `scratch/Submarine.orig.mo`.
2. `wsm-toolkit schematic --analyze` (pure Python, no Wolfram engine): Submarine = composite (7 instances, 3 connectors, 9 connects); BuoyancyDynamics = leaf with an unrecognized glyph.
3. Wrote `scratch/glyphs.json` (BuoyancyDynamics icon) and ran `wsm-toolkit schematic --annotate --glyphs-file` as a dry run only. I did not apply it. The automatic layout put `position.s_ref`, `prismatic.axis` and `world.frame_b` lines on the wrong pin coordinates: for example, s_ref was put at x=-86 instead of the left side of `position`, and the axis line ended at `frame_a`. The local adaptation warns about this. It also put `f` and `deltarho` in a different vertical order in the diagram than in the icon, which crosses the lines, and it gave the model `extends Modelica.Icons.Example`, although the model has inputs and an output.
4. Read the pin positions from the installed MSL 4.1.0 source (`<SystemModeler-install>/15.0/L/Modelica 4.1.0/`): Position s_ref {{-140,-20},{-100,20}}, flange {{90,-10},{110,10}}; Prismatic frame_a/frame_b ±100, axis {{90,50},{70,70}}, support {{-30,50},{-50,70}}; World frame_b {{84,-16},{116,16}}; Body, FixedShape and Visualizers.Rectangle frame_a {{-116,-16},{-84,16}}. I also checked their `%name` label extents.
5. Laid out the diagram by hand with `scratch/annotate.py`, which does exact, unique string replacements on the original and writes `scratch/Submarine.annot.mo`:
   - Signal row on top: `f` and `deltarho` lead into `buoyancyDynamics` (40x40). Its output goes to `position.s_ref`, with a branch up to the output `y`. `position.flange` drives `prismatic.axis` from above.
   - MultiBody row below: `world` → `prismatic` → `subBody`, with `fluidSurface` (on `world.frame_b`) and `subShape` (on `subBody.frame_a`) one row lower.
   - Every connection Line starts and ends on the real pin centres and is orthogonal. Colours follow MSL: signals {0,0,127}, translational {0,127,0}, MultiBody {95,95,95} thickness 0.5. Diagram extent {{-120,-60},{120,80}}.
   - Custom icon for `BuoyancyDynamics`: water, waterline, hull with sail, a buoyancy arrow up and a weight arrow down, pin labels f / Δρ / y. Its connector placements are f upper left, deltarho lower left, y right.
   - Custom icon for `Submarine`: sea, waterline, hull with sail and fin, pin labels. Its iconTransformations use the same pin order as BuoyancyDynamics. I added no `extends Modelica.Icons.Example`.
   - I kept the existing `preferredView="text"`, `experiment`, `Documentation` and `figures` annotations unchanged.
6. Validated the original and the annotated file with `wsm-toolkit wsm --mode validate` (WSMKernelX; run under `bwrap --unshare-net` and `timeout`, separate `--tempdir` folders `scratch/val_orig` and `scratch/val_annot`). I used it because it returns the flattened model as text for an exact before/after comparison. Both gave `flatten: Pass` with 0 errors and the same 3 MSL warnings (deprecated `cardinality` in the MSL). After removing `annotation(...)` and normalizing whitespace, the two flattened models are identical: the only remaining difference was a space before `;`.
7. Copied the result to `work/Submarine.mo`. A dry run of `wsm-toolkit schematic --annotate` on it reports "No changes (already annotated)", so a later toolkit run will not duplicate or overwrite the layout.
8. WLJS kernel (`mcp__wljs__kernel_evaluate`, the default engine for validate/simulate): checked `$AllowInternet` = False. In a new WLJS notebook (`mcp__wljs__new_notebook`, `add_cells_batch`, `evaluate_cell`) I imported a copy renamed `Submarine_amg1022` (`scratch/Submarine_amg1022.mo`, so the model name is unique in the shared kernel) and ran `SystemModelSimulate` for 50 s: it built and simulated.
   - With f = 0 and deltarho = 0 the model sits at its equilibrium, y = 0 for the whole run. That is correct because rho = 2 rho0, so the submarine floats half submerged.
   - So the notebook's plot cell runs again with deltarho = 50 kg/m³. y and subBody.r_0[3] settle together near −0.83 m at t = 50 s (−1.21 m at t = 10 s). I checked these values with `kernel_evaluate`.
   - Another notebook cell draws a box-and-line preview of the stored Placement/Line annotations. I saved the notebook by evaluating `NotebookSave[...]` in a cell. At the end I ran `Remove["amg1022`*"]` in the kernel.
9. Visual check: `capture-wljs-windows.sh` wrote 0-byte files for every notebook window (X error BadColor, twice). I opened the layout-preview cell in its own window with `mcp__wljs__project_cell` and captured that instead (`scratch/cap3/0x1400051_Application.png`). It shows no overlapping boxes, no line crossing through a component, and every line ending on a pin.

## 3. Files
- Changed: `work/Submarine.mo` (annotations only)
- Created: `work/SubmarineLayout.wln`
- Created in `scratch/`: `Submarine.orig.mo` (original backup), `Submarine.mo` (toolkit dry-run copy, unchanged), `glyphs.json`, `annotate.py`, `Submarine.annot.mo`, `Submarine_amg1022.mo`, `val_orig/`, `val_annot/`, `val_annot.log`, `cap/`, `cap2/`, `cap3/`
- Created: `run-log.md` (this file)

## 4. WLJS notebook
`<repo>/tests/runs/2026-10-22/annotate-modelica-graphics/work/SubmarineLayout.wln`

## 5. Answer
Submarine.mo now has a laid-out diagram and icons, and it should render as a clean schematic in System Modeler.
- **Layout:** signals run along the top: f and Δρ go into the buoyancy block, whose position output drives a Position source and the model output y. The mechanics run along the bottom: world → prismatic joint (driven through its axis flange from above) → submarine body, with the fluid-surface and hull-shape visualizers attached below.
- **Lines:** every connection is right-angled and ends on the component's real pin. I read the pin positions from the installed MSL rather than using the toolkit's automatic layout, which put several lines on the wrong pins.
- **Icons:** BuoyancyDynamics and Submarine each have their own icon (hull at the waterline). On both, f and Δρ are on the left and y is on the right.
- **Model unchanged:** apart from the annotations, the flattened model is identical to the original. It builds and simulates for 50 s. With zero inputs it stays at its equilibrium, y = 0; with Δρ = 50 kg/m³ it settles at about −0.83 m.
- **Not done:** I could not view the real diagram here. Please open the model in System Modeler to see the icons as drawn. You can move components there if you want a different arrangement.
- **Notebook:** the checks and a box-and-line preview of the layout are in `SubmarineLayout.wln`.

## 6. Problems
- I did not use the toolkit's automatic layout, because of the wrong pin coordinates described in step 3. I laid out the diagram by hand instead.
- No real rendering of the System Modeler diagram: headless WLJS cannot draw it and I may not start System Modeler. The icon graphics are checked only by the flatten pass and by reading them, not by eye. The preview in the notebook shows boxes and lines, not the MSL icons.
- `capture-wljs-windows.sh` produced 0-byte captures of every notebook window ("X Error of failed request: BadColor (invalid Colormap parameter)"). Only projected "Application" windows were captured. The projected preview window I opened is still open.
- The simulation warning `SystemModelSimulate::nsi` (input f not specified) appeared once in a `kernel_evaluate` check. The notebook cell sets both inputs, so it does not appear there.
- `SystemModelSimulationData::urvs` came from my own mistaken `sim["Messages"]` query, not from the model.
- Validation warnings are the 3 MSL `cardinality` deprecation warnings, and they appear for the original as well.
- Choice the user may want to revisit: the pin labels use the UTF-8 "Δρ". I chose a custom Submarine icon instead of the toolkit's `extends Modelica.Icons.Example`.
