# Run log: annotate-modelica-animation (ChainPendulum follow camera + trace)

## 1. Skills used
1. annotate-modelica-animation (local WLJS adaptation). It points to `ROUTES.md` and the pinned upstream `SKILL.md` (toolkit 991a800), and I read both.

## 2. Steps
1. Read `ROUTES.md` and the upstream skill.
2. Found the source: `<SystemModeler-install>/15.0/L/IntroductoryExamples/CustomComponent/ChainPendulum.mo` (and `ChainLink.mo`). The last link is `chainLink4`. Its visual is a `Parts.BodyBox` named `bodyBox1`. I checked the MSL 4.1.0 source: inside `BodyBox`, `body` has `animation=false`, and the box is drawn by `frameTranslation` (a `FixedTranslation` that holds `Visualizers.Advanced.Shape shape`). So the follow/trace cref is `chainLink4.bodyBox1.frameTranslation.shape`.
3. Looked up how follow modes and trace work in the bundled System Modeler documentation with `wsm-toolkit docs` (offline search, no kernel). Source: UserGuide/SimulationCenter3DAnimation, sections "Attach Camera" and "Trace Path".
4. Copied the model into `work/ChainPendulum.mo` as a top-level model: I removed the `within IntroductoryExamples.CustomComponent;` line and left everything else unchanged. It still uses `IntroductoryExamples.CustomComponent.ChainLink` from the installed library. In its existing `__Wolfram(Animation(...))`:
   - I kept the original `Default` camera.
   - I added a `FollowLastLink` camera: follow = `chainLink4.bodyBox1.frameTranslation.shape`, followMode = "NODE_CENTER", distance = 7, rotation = {0,0,0,1}. This is the same orientation as the original camera, looking at the x-y swing plane.
   - I changed the `Default` window to: camera = "FollowLastLink", preferred, autoPlay, repeat, timeScale = 1, trace = {chainLink4.bodyBox1.frameTranslation.shape}.
5. Made a renamed copy for the shared kernel, `scratch/ChainPendulum_anim1022.mo` (model `ChainPendulum_anim1022`), so it cannot clash with other sessions' models.
6. Evaluations, all in the **WLJS kernel via `mcp__wljs__*`** (the default route; the kernel was answering, with `$AllowInternet` = False, version 15.0):
   - `kernel_evaluate`: a sanity check `{1+1, $AllowInternet, $VersionNumber}` → `{2, False, 15.}`.
   - `kernel_evaluate`: `Import` of the scratch copy → `SystemModel["ChainPendulum_anim1022", True]` (builds).
   - `kernel_evaluate`: `SystemModelSimulate[..., 5]` → SystemModelSimulationData, 1270 variables. The shape variables `chainLink4.bodyBox1.frameTranslation.shape.{rvisobj, rxvisobj, ryvisobj, size, Form, ...}` are in the results, which confirms the cref names a real visualizer. Chain end x: 4 → -1.89 m, y: 0 → -2.07 m over 0–5 s. (My variable filter in this call raised harmless `StringStartsQ::strse` messages; see Problems.)
   - WLJS notebook (`new_notebook`, `add_cells_batch`, `evaluate_cell`):
     - a `.md` summary;
     - the stored annotation lines;
     - Import + `SystemModelSimulate` (5 s);
     - a `ListLinePlot` of the last link's centre path and the chain end path;
     - `NotebookSave`.
     I checked the plot by projecting it (`project_cell`) and capturing the window.
   - `kernel_evaluate`: `Remove["cpAnim1022`*"]`, to clean up my names in the shared kernel.
7. No `wolframscript`, `wolfram-direct` or `wsm-toolkit wsm` kernel runs were needed.

## 3. Files
- `work/ChainPendulum.mo` (created: annotated copy)
- `work/ChainPendulumAnimation.wln` (created: WLJS notebook)
- `scratch/ChainPendulum_anim1022.mo` (created: renamed copy for the shared kernel)
- `scratch/cap/*.png`, `scratch/cap2/*.png` (window captures)
- `run-log.md` (this file)

## 4. WLJS notebook
`<repo>/tests/runs/2026-10-22/annotate-modelica-animation/work/ChainPendulumAnimation.wln`. It is open as window "llm-696.wln". I also opened a projected plot window ("Application") from cell 005 and left it open.

## 5. Answer
I copied `IntroductoryExamples.CustomComponent.ChainPendulum` to `work/ChainPendulum.mo` and stored an animation in it.
- **Follow camera:** a new camera `FollowLastLink` follows the box of the last link (`chainLink4.bodyBox1.frameTranslation.shape`). It uses Object Center mode, 7 m away, looking at the swing plane.
- **Animation window:** the `Default` window now opens with that camera and traces the path of the last link. It opens automatically after the first simulation (preferred), auto-plays and repeats at real-time speed.
- **Overview camera:** the original `Default` camera is still there, so you can switch back to it.

The model builds and simulates for 5 s in the WLJS kernel, and the shape I follow and trace is in the results.

`work/ChainPendulumAnimation.wln` shows the stored annotation and a plot of the last link's path. The 3D animation itself plays in System Modeler: open the `.mo` there, simulate, and the animation opens with the follow camera and the trace.

## 6. Problems
- **Animation not checked visually:** playback happens only in System Modeler, which I did not open (rule: start no desktop apps). It is not confirmed that Simulation Center attaches the camera and draws the trace.
- **Trace point not confirmed:** the System Modeler docs say the trace follows "the path of the selected animation object". I did not confirm whether it follows the object's origin or its centre. The origin of the box shape is the link's joint end (frame_a), and its centre is mid-link. Neither is exactly the free tip of the chain. If you want the trace exactly on the tip, a massless `FixedShape` marker on `chainLink4.frame_b` could be added and traced instead. I did not add one because it goes beyond the request.
- **Harmless messages in one call:** `StringStartsQ::strse` messages came from my own filter in the second simulation call (derivative names in `VariableNames` are not strings). The result was not affected.
- **Plot cell timed out once:** the first plot cell (`ParametricPlot`, which calls the simulation data at every point) returned `$Aborted`. I rewrote it to extract the interpolating functions once and plot sampled points, and the rewrite worked.
- **Standalone copy depends on the installed library:** the copy has no `within` clause and depends on the installed `IntroductoryExamples` library (for `ChainLink` and the documentation images).
- **Earlier attempt folder:** there is an earlier attempt at `tests/runs/2026-10-22/annotate-modelica-animation.attempt2-wljs-hung/`. I did not use or change it.
