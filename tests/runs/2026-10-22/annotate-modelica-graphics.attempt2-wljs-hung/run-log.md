# Run log: annotate-modelica-graphics (Submarine.mo), 2026-10-22

## 1. Skills used
1. annotate-modelica-graphics (local WLJS adaptation; it points to ROUTES.md and the pinned upstream SKILL.md at
   `~/.local/share/wolfram-system-modeler-ai-toolkit/991a800.../annotate-modelica-graphics/SKILL.md`, both read in full)

## 2. Steps
1. Read `work/Submarine.mo`: top-level model `Submarine` with a nested `BuoyancyDynamics` block, 7 component instances
   (MultiBody World, Prismatic, Body, FixedShape, Rectangle visualizer; Translational Position; BuoyancyDynamics),
   3 top-level connectors (`f`, `deltarho`, `y`), 9 `connect` equations, no graphical annotations.
2. Backed up the original as `work/Submarine.orig.mo`.
3. `wsm-toolkit schematic --analyze` (pinned upstream Python annotator; no Wolfram engine). Result: `Submarine` =
   composite/runnable example (gets `extends Modelica.Icons.Example` + diagram); `BuoyancyDynamics` = leaf with an
   unrecognized domain (needs an authored glyph).
4. Authored a glyph for `BuoyancyDynamics` in `work/glyphs.json` (water box with wavy surface, grey hull with sail,
   green buoyancy arrow "B" up, red gravity arrow "G" down; ports f, deltarho left, y right).
5. `wsm-toolkit schematic --annotate --glyphs-file` dry run, reviewed the diff, then `--write`.
6. Reviewed the auto layout against the MSL 4.1.0 sources in `<SystemModeler-install>/15.0/L/Modelica 4.1.0`
   (connector Placements of Position, Prismatic, PartialTwoFrames, World, Body, PartialVisualizer). The auto layout
   was not clean: several line endpoints were on the wrong pins (Position.flange drawn at the s_ref side;
   Prismatic.frame_b and Prismatic.axis both drawn at frame_a; World.frame_b drawn on the left of World), the
   buoyancy output line ran through the World icon, and the f/deltarho lines crossed. Hand-tuned with a short
   Python edit script (no Wolfram engine):
   - Two rows: signal row on top (inputs f, deltarho -> buoyancyDynamics -> position, with output y branching to
     the top-right), mechanical row below (world -> prismatic -> subBody), visualizers (fluidSurface under world,
     subShape under subBody) at the bottom.
   - Every line endpoint now sits on the true MSL pin (e.g. Prismatic.axis at {38,6}, from its
     `extent={{90,50},{70,70}}`); all routes are orthogonal; no line crosses an icon.
   - Signal lines blue {0,0,127}, translational flange line green {0,127,0}, MultiBody frame lines thick grey.
   - BuoyancyDynamics connectors enlarged to the MSL block style (f upper-left, deltarho lower-left, y right).
   - Submarine's own icon pins: f upper-left, deltarho lower-left, y right.
   - Diagram coordinate system `{{-120,-60},{120,80}}`.
7. Re-ran the annotator dry run: "No changes (already annotated)" (idempotent, no --force used).
8. Validation gate, `wsm-toolkit wsm --mode validate` (fresh WSMKernelX process; upstream's gate, fresh temp dirs in the
   scratchpad) on the original and on the annotated model: both `flatten: Pass`, 0 errors, the same 3 MSL
   `cardinality` deprecation warnings. Diffed the two flat models: the only differences are the Placement
   annotations carried onto the connector variables (the equations are identical).
9. WLJS kernel via `mcp__wljs__kernel_evaluate` (the adaptation's default engine): `Import` of the model +
   `SystemModelSimulate[m, 50]`, to confirm it still builds in WLJS. The call returned "still pending after 220 s";
   three later trivial calls (including `$AllowInternet`) also stayed pending. The kernel looked busy or stuck
   (`wljs status` says ready, kernel 001 shared with other sessions' notebooks). I did not restart it: the rules
   forbid that, and a restart would close the owner's notebooks.
10. In its place, `wsm-toolkit wsm --mode simulate` (fresh WSMKernelX process) on the annotated model, to 50 s:
    flatten/build/result all Pass, 0 errors, 2 events, integration 0.05 s. Notifications: `prismatic.s` and
    `prismatic.v` were picked as states and start from their start values (same as the original model's structure).

## 3. Files
- Changed: `work/Submarine.mo` (annotations only; mode restored to 664)
- Created: `work/Submarine.orig.mo` (backup of the original), `work/glyphs.json` (BuoyancyDynamics icon glyph, can be
  reused by the annotator)
- Scratch only (outside the work folder, session scratchpad): validate/simulate temp dirs and flat-model dumps

## 4. WLJS notebook
none

## 5. Answer
I added a laid-out diagram and icons to Submarine.mo. The model's equations are unchanged: it flattens to the same
equations as before, builds and simulates to 50 s in System Modeler's kernel, and has no errors.

- **Diagram:** the signal path is on the top row. The inputs f and deltarho feed buoyancyDynamics. Its output drives
  the Position source and also goes to the output y at the top right. The mechanics are on the row below:
  world → prismatic → subBody. The position source drives the prismatic joint's axis flange from above. The fluid-surface and
  submarine-shape visualizers sit under the frames they attach to. All connections are right-angled, start and end
  on the real connector pins, and do not cross any component. Lines are coloured by domain: blue for signals,
  green for the translational flange, thick grey for MultiBody frames.
- **BuoyancyDynamics** now has its own icon: a hull in water, with a green buoyancy arrow up and a red gravity arrow
  down. Its inputs are on the left and its output y is on the right.
- **Submarine** gets the standard MSL Example icon (it has an `experiment` annotation), with f and deltarho on the
  left and y on the right.
- I hand-tuned the automatic layout. As generated, several lines were attached to the wrong pins of the MSL
  components and a few lines crossed icons.
- The original is kept as Submarine.orig.mo.
- I could not look at the rendered diagram. That needs the System Modeler desktop app, which I may not open.
  Please open the model there to check it, and move anything you want.

## 6. Problems
- The WLJS kernel did not answer `mcp__wljs__kernel_evaluate` (4 calls, each "still pending after 220 s", the last a bare
  `$AllowInternet`). I could not confirm `$AllowInternet` is False, or that the Import/simulate in WLJS succeeded. My
  first call (Import + SystemModelSimulate of `Submarine`) may still be queued or running in the shared kernel; if it
  finishes it defines the model `Submarine` in that kernel's System Modeler session. I did not restart the kernel
  (rules; it would close other sessions' notebooks). The same model was simulated with WSMKernelX instead (Pass).
- No visual check of the rendered diagram: headless tools cannot rasterize System Modeler diagrams, and I may not
  open the desktop app. The layout was checked against the MSL connector coordinates and icon label extents only.
- The automatic annotator's pin table was wrong for Position, Prismatic (frame_b, axis) and World.frame_b in this
  model, so its raw output was not clean; I hand-corrected it. Worth noting for the skill's test record.
- Judgement call: the annotator classed Submarine as a runnable example (`extends Modelica.Icons.Example`), but it also
  has unconnected top-level inputs, so it can serve as a component. I kept the Example icon; a custom submarine icon is
  the alternative if the owner prefers.
- Validation warnings: 3 MSL-internal "Use of `cardinality` is deprecated" warnings, present before and after.
- Nothing contacted the network. The `modelica://DocumentationExamples/Resources/Submarine.stl` shape resolves to the
  locally installed DocumentationExamples library.
