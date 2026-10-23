# Run log: annotate-modelica-graphics (Submarine.mo), 2026-10-22

## 1. Skills used
1. annotate-modelica-graphics (local WLJS adaptation). I read `ROUTES.md` and the pinned upstream `SKILL.md` it points to.

## 2. Steps
1. Read `<repo>/ROUTES.md` and the upstream skill
   `~/.local/share/wolfram-system-modeler-ai-toolkit/991a800.../annotate-modelica-graphics/SKILL.md`.
2. Read `work/Submarine.mo`. It already has graphics: every component and connector has a `Placement`, all 9 `connect` statements have a routed `Line`, there is a `Diagram(coordinateSystem(extent={{-15,-85},{115,45}}, grid={5,5}))`, and both `Submarine` and `BuoyancyDynamics` have detailed hand-drawn icons (submarine with water surface; fluid block with an arrow).
3. `wsm-toolkit schematic --file <abs>/Submarine.mo --analyze` (pure-Python annotator, no Wolfram kernel). Result: `Submarine` composite, "icon already present", diagram already there; `BuoyancyDynamics` leaf, "icon already present". No unrecognized classes.
4. `wsm-toolkit schematic --file <abs>/Submarine.mo --annotate` (dry run). Result: both classes "skip"; "No changes (already annotated...). Use --force to regenerate."
5. `--annotate --force` **dry run on a scratch copy** (no `--write`), only to see what a regeneration would do. It would:
   - delete both hand-drawn icons: `BuoyancyDynamics` gets a generic grey rounded box showing `%class`, and `Submarine` gets `extends Modelica.Icons.Example` in place of its submarine icon;
   - move the icon pins of `BuoyancyDynamics` and `Submarine` (and swap the vertical order of `f` and `deltarho` on the `Submarine` icon), which changes how the model looks wherever it is used as a component;
   - replace all 7 component placements, 3 connector placements and 9 hand-routed lines with an automatic layout on a `{{-156,-100},{156,100}}` canvas.
   The upstream skill says `--force` deletes hand-written graphics and must not be used without the user's confirmation. No user was available, so I stopped here.
6. No Wolfram evaluation ran: no WLJS kernel call, no wolframscript or wolfram-direct. The model file is unchanged, so the post-edit validation gate (step 5 of the skill) was not needed.

## 3. Files
- Created: `<repo>/tests/runs/2026-10-22/annotate-modelica-graphics/run-log.md` (this file).
- Scratch only (outside the work folder; dry-run evidence): `<scratch>/forcepreview/Submarine.mo` (an unmodified copy) and `.../forcepreview/force.diff` (the `--force` dry-run diff).
- `work/Submarine.mo`: **not changed**.

## 4. WLJS notebook
none

## 5. Answer
I haven't changed Submarine.mo. It already has a full, hand-made diagram: every component and input/output is placed, all 9 connections have routed lines, and the model and its BuoyancyDynamics part have custom icons. Since the diagram is already there, the annotator skips it ("already annotated").

The only way to get a new layout from the tool is `--force`, which removes all the existing graphics and rebuilds them. I tried it as a dry run on a copy. It would replace the submarine icon with the generic "Example" icon and the BuoyancyDynamics icon with a plain grey box. It would also move the input/output pins on both icons and swap `f` and `deltarho`, and redraw the diagram with its own automatic layout. To me that looks worse than what you have now, and it can't be undone without a backup.

What I would ask you:
1. What looks wrong when you open Submarine in System Modeler? Overlapping blocks, crossing lines, the canvas cut off, or something else? Or were you looking at a different file?
2. If you do want the whole layout regenerated: may I run `--force`, knowing it deletes the hand-drawn submarine and BuoyancyDynamics icons and changes the pin positions? (I would keep a backup copy first.) Or should I keep the icons and only tidy the diagram by hand?

Small things I noticed that I could fix by hand without touching the icons:
- The inputs `f` and `deltarho` at x = -10 stick out past the left edge of the diagram canvas (x = -15). Widening the canvas to `{{-25,-85},{115,45}}` fixes that.
- Inside BuoyancyDynamics, the output `y` has only an icon position and no diagram position, and the class opens in text view.

## 6. Problems
- What the request says ("no proper diagram") doesn't match the file: the file already has a complete diagram. I can't tell what the user saw as wrong, so this is an open question for the user, not a tool failure.
- Not done, because each step needed the user's OK: `--force --write` and any hand edit of the layout. I also couldn't check the rendering: headless WLJS can't draw System Modeler diagrams, and the System Modeler app must not be started in this run.
- No warnings or errors from `wsm-toolkit schematic`. No Wolfram kernel ran, so `$AllowInternet` was never involved and no network access was attempted.
- Not checked: whether the model simulates. `subShape` points at `modelica://DocumentationExamples/Resources/Submarine.stl`, which is not in the work folder. That only matters for animation, but I did not test it.
