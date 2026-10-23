# Run log: annotate-modelica-animation (2026-10-22)

Request: "Copy IntroductoryExamples.CustomComponent.ChainPendulum here and store an animation with a camera following the last link and a trace path."

## 1. Skills used

1. `annotate-modelica-animation` (local WLJS adaptation; read `ROUTES.md` and the pinned upstream `SKILL.md` it points to)

## 2. Steps

1. Read `ROUTES.md` and the upstream skill (`~/.local/share/wolfram-system-modeler-ai-toolkit/991a8000.../annotate-modelica-animation/SKILL.md`).
2. Found the source at `<SystemModeler-install>/15.0/L/IntroductoryExamples/CustomComponent/ChainPendulum.mo` (and `ChainLink.mo`). Copied it to `work/ChainPendulum.mo` as a top-level `model ChainPendulum`. I removed the `within IntroductoryExamples.CustomComponent;` line. The copy still uses `IntroductoryExamples.CustomComponent.ChainLink` from the installed library. A pristine copy is in `scratch/ChainPendulum.orig.mo`.
3. Simulated the unmodified copy for 5 s to get the motion extents. Engine: **fresh kernel via `wolframscript`** inside `bwrap --unshare-net`, with `$AllowInternet = False` first and run under `timeout 300`. I used a fresh kernel because the skill notes say that reading many sampled positions in the WLJS kernel stalled it. Result: the motion stays in the x-y plane (z = 0) with gravity along -y. x ranges from -3.67 to 4 m and y from -3.93 to 0.38 m. The tip starts at (4, 0).
4. Looked up the visualizer instance names in the MSL 4.1.0 source. `Parts.BodyBox` contains `FixedTranslation frameTranslation`, which has `Visualizers.Advanced.Shape shape`. `Visualizers.FixedShape` has `Advanced.Shape vis`.
5. Edited `work/ChainPendulum.mo`:
   - Replaced the existing `__Wolfram(Animation(...))` with an edited one (no second annotation):
     - camera `FollowLastLink`: `follow = chainLink4.bodyBox1.frameTranslation.shape`, `followMode = "NODE_CENTER"`, `rotation = {0,0,0,1}` (front view of the x-y plane, the same orientation as the original camera), `distance = 7`;
     - the original `Default` overview camera, kept unchanged;
     - window `Default`: `camera = "FollowLastLink"`, `preferred = true`, `autoPlay = true`, `repeat = true`, `timeScale = 1`, `trace = {tipMarker.vis}`.
   - Added `tipMarker`, a `Visualizers.FixedShape` red sphere 0.15 m across, centred on `chainLink4.frame_b` (the free end of the chain). It gives the trace a cref at the chain end; the link's own shape origin is the joint between links 3 and 4.
   - Added `ground`, a thin green `FixedShape` box spanning x from -5 to 5 m, with its top at y = -4.24 m (the upstream workflow's step 2). The lowest point of the motion is y = -3.93 m.
   - Added two `connect` lines with diagram placements and widened the Diagram extent to `{{10,-20},{230,50}}`.
   - Left the experiment, Icon, Documentation and figures untouched.
6. Validated and simulated the annotated model, then exported the frame positions: joints of links 1-4 and the tip, x/y at 251 times over 0-5 s. Engine: **fresh kernel via `wolframscript`**, network-cut and under `timeout`, for the same reason as step 3. Results:
   - Import gave `SystemModel[ChainPendulum, True]`; the simulation returned `SystemModelSimulationData`.
   - `tipMarker.*`, `ground.*` and `chainLink4.bodyBox1.frameTranslation.shape.*` variables exist.
   - The tip position equals `tipMarker.frame_a.r_0`.
   - The tip at t = 5 is (-1.8919, -2.0686).
   - The file contains exactly one `Animation(`.
   - The positions were written to `work/ChainPendulum-frames.json`.
7. Checked the model in the WLJS kernel as well, the skill's default validation engine. Engine: **WLJS kernel via `mcp__wljs__kernel_evaluate`**, one call. I imported a copy renamed `ChainPendulum_amaTest1022` (`scratch/`) so it would not collide with another session's model in the shared namespace, then ran `SystemModelSimulate` for 5 s. Results: `SystemModel["ChainPendulum_amaTest1022", True]`, and the tip at t = 5 is (-1.89187, -2.06863), the same as the fresh kernel. `$AllowInternet` was checked first: `False`.
8. Built the WLJS notebook. Engine: **WLJS kernel via `mcp__wljs__new_notebook` / `add_cells_batch` / `evaluate_cell`**, plus one `kernel_evaluate` that tested the scene function at frame 200. It has four parts:
   - a `.md` summary cell, evaluated;
   - `Import` of the JSON;
   - helper definitions in the private context `` chainPendulumReplay` ``;
   - a `Manipulate` replay in `Graphics3D` with a frame slider and a "follow last link" toggle. With follow on, the scene is shifted so the last link's centre is at the origin and clipped to a 6 m x 6 m viewport.
9. Looked at the result with `tools/capture-wljs-windows.sh` and `mcp__wljs__project_cell`:
   - First attempt: WLJS ignored `PlotRange`, so the "follow" view showed the whole scene. I replaced that with shifting and clipping.
   - Final capture (`scratch/cap3/0x14000b8_Application.png`, frame 251, follow on): the yellow chain, the red tip sphere, the red trace (clipped to the viewport), the green ground line and the gray viewport frame, with the last link centred.
10. Saved the notebook by evaluating `NotebookSave[EvaluationNotebook[], ".../work/ChainPendulum-animation.wln"]` in the last cell. The saved file holds the markdown output, the Import output and the Manipulate output, which is stored as a reference (bug J3).

## 3. Files

- `work/ChainPendulum.mo`: created (the copy), then edited (annotation, `tipMarker`, `ground`).
- `work/ChainPendulum-frames.json`: created (simulated positions for the replay).
- `work/ChainPendulum-animation.wln`: created (WLJS notebook).
- `scratch/ChainPendulum.orig.mo`: pristine copy of the library file.
- `scratch/ChainPendulum_amaTest1022.mo`: renamed copy for the shared WLJS kernel.
- `scratch/extents.wls`, `scratch/validate_export.wls`: fresh-kernel scripts.
- `scratch/cap/`, `scratch/cap2/`, `scratch/cap3/`: window captures. They include other sessions' windows, which the capture tool grabs as well.
- `run-log.md`: this file.

## 4. WLJS notebook

`<repo>/tests/runs/2026-10-22/annotate-modelica-animation/work/ChainPendulum-animation.wln`

## 5. Answer

`ChainPendulum` is copied to `work/ChainPendulum.mo` with a stored animation:

- **Follow camera** `FollowLastLink`: tracks the box of the last link (`chainLink4.bodyBox1.frameTranslation.shape`). It stays in "Object Center" mode and keeps the front view of the swing plane, 7 m away. It is the window's camera, and the window is preferred, so the animation opens with it after the first simulation, auto-plays and repeats.
- **Trace path** of the chain's free end. I added a small red marker sphere `tipMarker` at the end of link 4, and the window traces `tipMarker.vis`.
- The original overview camera `Default` is kept, so you can switch to it in the animation window.
- A thin green floor just below the lowest point of the swing gives a fixed reference while the camera moves.

The model validates and simulates in a fresh kernel and in the WLJS kernel (5 s; the tip ends at (-1.89, -2.07) m). The WLJS notebook `ChainPendulum-animation.wln` shows a replay of the simulated motion with the trace and a follow-the-last-link view. It is a replay of the positions, not System Modeler's renderer. The real animation plays when you simulate the model in System Modeler's Simulation Center; please check the camera and trace there. After a WLJS restart, re-evaluate the notebook's cells to redraw the replay (saved graphics are not stored).

## 6. Problems

- **Not checked in System Modeler itself.** Per the ground rules no desktop application was started. Whether Simulation Center accepts the follow cref and the trace cref, and how the view looks, is unverified. The crefs follow the upstream skill's naming rules and the MSL 4.1.0 source.
- **Trace point unsure.** I do not know whether System Modeler traces the shape's frame origin or its `r_shape` offset. The marker is centred on the tip with `r_shape = {-0.075,0,0}`, so in the worst case the trace runs 7.5 cm inside the link end.
- **Follow mode choice.** I chose `NODE_CENTER` over the upstream suggestion `NODE_CENTER_AND_AZIM` because the pendulum swings in a vertical plane with gravity along -y, and I am unsure which axis System Modeler uses for azimuth here. `NODE_CENTER` keeps the view fixed in orientation.
- **Additions beyond the request:** the components `tipMarker` and `ground`. They change the model slightly by adding visualizers only, with no dynamics change; the tip trajectory is unchanged.
- **`StringStartsQ::strse`** messages (3 plus `General::stop`) in `validate_export.wls`. They came from my own variable-name filter hitting derivative names like `(x)'`. They are harmless and did not affect results.
- **WLJS ignored `PlotRange`** in `Graphics3D`, so a follow view by `PlotRange` did not work. I replaced it with shifting and clipping the scene.
- **Cell ordering:** inserting the helper cell after the Import cell first put it between that input and its output. Re-evaluating fixed the order before saving.
- **Leftover windows:** the first projected "Application" window (`0x14000ac`, stale replay) is still open. I opened it, but no tool is available to close it.
- **Shared kernel:** the `` chainPendulumReplay` `` definitions are left in place, deliberately, so the visible notebook's Manipulate stays live. The ground rule asks to `Remove` them at the end; that would break the user's notebook until it is re-evaluated. `ChainPendulum_amaTest1022` also stays registered in the shared kernel's System Modeler namespace.
- No WLJS call stayed pending; the longest was the single simulation call.
