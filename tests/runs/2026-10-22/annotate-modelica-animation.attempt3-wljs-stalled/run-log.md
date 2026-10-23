# Run log: annotate-modelica-animation (2026-10-22)

Request: copy IntroductoryExamples.CustomComponent.ChainPendulum here, store an animation with a camera following the last link and a trace path, and show the animation.

## 1. Skills used

1. `annotate-modelica-animation` (local WLJS adaptation; read `ROUTES.md` and the pinned upstream `SKILL.md` it points to)

## 2. Steps

1. Read `ROUTES.md` and the upstream skill (`~/.local/share/wolfram-system-modeler-ai-toolkit/991a8000.../annotate-modelica-animation/SKILL.md`).
2. Found the source at `<SystemModeler-install>/15.0/L/IntroductoryExamples/CustomComponent/ChainPendulum.mo` (and `ChainLink.mo`). The model has four `ChainLink`s, each with a `Parts.BodyBox bodyBox1`; it already carried a minimal `__Wolfram(Animation(...))` with one fixed camera "Default".
3. Looked up the low-level visualizer cref in MSL 4.0.0 source: `BodyBox` contains `FixedTranslation frameTranslation`, which contains `Visualizers.Advanced.Shape shape`. So the cref for the last link is `chainLink4.bodyBox1.frameTranslation.shape` (not `chainLink4`).
4. Wrote `work/ChainPendulum.mo` (Python text edit, no Wolfram engine): removed the `within IntroductoryExamples.CustomComponent;` line so the copy is a stand-alone top-level model (it still uses `IntroductoryExamples.CustomComponent.ChainLink` from the installed library), and replaced the existing `Animation(...)` (edited in place, not duplicated) with:
   - camera `FollowLastLink`: `follow = chainLink4.bodyBox1.frameTranslation.shape`, `followMode = "NODE_CENTER"`, `distance = 6`, `rotation = {0, 0, 0, 1}` (looks down -z onto the x-y swing plane, same orientation as the original camera; `NODE_CENTER_AND_AZIM` not used because the swing is not an azimuth rotation in this y-up world);
   - the original camera `Default` kept unchanged as a second stored view;
   - window `Default`: `camera = "FollowLastLink"`, `preferred = true`, `autoPlay = true`, `repeat = true`, `trace = {chainLink4.bodyBox1.frameTranslation.shape}`.
   Everything else (experiment StopTime = 5, figures, Diagram, Icon, Documentation) unchanged.
5. Made a renamed copy `scratch/ChainPendulum_annAnim1022.mo` (shared-kernel namespace rule).
6. WLJS kernel (`mcp__wljs__kernel_evaluate`), default engine per the skill:
   - first combined call (import + simulate + extract) returned `$Aborted` without a result;
   - `{$AllowInternet, 1+1}` -> `{False, 2}` (internet off confirmed);
   - `Import` of the renamed copy -> `SystemModel["ChainPendulum_annAnim1022", True]` (0.07 s);
   - `SystemModelSimulate[..., 5]` -> `SystemModelSimulationData` (5.7 s, 1270 points); result stored as `annAnim1022`sim`;
   - a short follow-up query (variable names + positions at 501 time points) stayed **pending past 220 s**. Per the run rules I stopped using WLJS from that point.
7. Fresh kernel via `wolframscript` inside the network cut (`bwrap --unshare-net ...`, `$AllowInternet = False` first line, `timeout 300`), script `scratch/sim.wls`: imported and simulated the renamed copy for 5 s, confirmed the visualizer `chainLink4.bodyBox1.frameTranslation.shape` exists in the compiled model (15 result variables, e.g. `...shape.rvisobj[1..3]`), and exported the frame positions of all links at 251 times (0..5 s, step 0.02) to `scratch/positions.json`. Chain tip: starts at (4, 0, 0), at t = 5 s at (-1.89, -2.07, 0); x range -3.67..4 m, y range -3.93..0 m, z = 0 (planar).
8. Replay rendered with local Python/matplotlib (`scratch/render.py`, no Wolfram engine; used because WLJS was off-limits after step 6 and front-end rasterizing in a fresh kernel is known to hang): GIF with two panels side by side, left = view centred on the chainLink4 box each frame (follow camera, same orientation), right = full view like the original Default camera, orange = trace of the chainLink4 box centre. Looked at frames t = 2.5 s and t = 5 s: link 4 stays centred in the left panel, the trace grows correctly.

## 3. Files

- Created `work/ChainPendulum.mo` (annotated copy, the deliverable)
- Created `work/ChainPendulum-animation.gif` (replay, 251 frames at 25 fps, about 10 s, 3.0 MB)
- Created `scratch/ChainPendulum_annAnim1022.mo` (renamed copy for simulation)
- Created `scratch/sim.wls`, `scratch/positions.json`, `scratch/render.py`, `scratch/frame_000.png`, `scratch/frame_060.png`, `scratch/frame_125.png`, `scratch/frame_250.png`
- Created this `run-log.md`

## 4. WLJS notebook

none (the WLJS kernel stopped answering before the notebook step; see Problems)

## 5. Answer

I copied ChainPendulum to `work/ChainPendulum.mo` as a stand-alone model and stored the animation in it. The new camera "FollowLastLink" follows the box of the last link (`chainLink4.bodyBox1.frameTranslation.shape`) from 6 m away, looking at the swing plane. The Default animation window now opens automatically after simulating, with that camera, auto-play and repeat on, and a trace of the last link. The original overview camera is still there as "Default". The model builds and simulates for 5 s. The stored animation itself plays only in System Modeler's Simulation Center, which I did not start.

To show you the motion I made a replay from the simulation results: `work/ChainPendulum-animation.gif`. On the left the view stays centred on the last link; on the right is the full view. Orange is the path of the last link's centre. This is my own replay drawn from the simulated positions, not System Modeler's 3D renderer. I could not put it in a WLJS notebook because the WLJS kernel stopped answering.

## 6. Problems

- **WLJS kernel stopped answering:** a short `mcp__wljs__kernel_evaluate` query (reading variable names and 501 sampled positions from the simulation just made) stayed pending past 220 s ("WLJS operation is still pending after 220060 ms"). Before that, a combined import + simulate call returned `$Aborted` (no message saying why). Per the run rules I stopped using WLJS. So there is no WLJS notebook, and the symbol `annAnim1022`sim` (and the imported class `ChainPendulum_annAnim1022`) are still in the shared kernel and were not removed. Other sessions may have been using the kernel at the same time.
- The replay is a 2D matplotlib drawing (the motion is planar, z = 0, and the camera looks down -z), not a WLJS `Graphics3D` replay and not System Modeler's renderer. I did not check how System Modeler places the follow-camera centre or which point it traces; the replay uses the box centre for both.
- The annotation fields (follow cref, followMode, trace) are not checked by the Modelica compiler. That the model compiles and that the cref names a real visualizer instance in the result set are good signs, but only Simulation Center shows whether the camera and trace work. Not checked in System Modeler.
- The simulation was run on the renamed copy (`ChainPendulum_annAnim1022`), which differs from `work/ChainPendulum.mo` only in the class name.
- The `wolframscript` run printed `StringStartsQ::strse` (x3) and `General::stop`. These came from my own filter running over derivative entries in `VariableNames`, not from the model.
- The copied Documentation still links to `modelica://IntroductoryExamples/...` images and pages. They resolve while the IntroductoryExamples library is loaded.
