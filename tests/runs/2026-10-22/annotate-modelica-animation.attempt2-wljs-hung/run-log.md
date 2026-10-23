# Run log: annotate-modelica-animation (2026-10-22)

## 1. Skills used
1. `annotate-modelica-animation` (local WLJS adaptation; read `ROUTES.md` and the pinned upstream `SKILL.md` at `~/.local/share/wolfram-system-modeler-ai-toolkit/991a800.../annotate-modelica-animation/SKILL.md`, as it instructs).

## 2. Steps
1. Read `ROUTES.md` and the upstream skill (no references or scripts in that skill folder; it has no generator engine, so the annotation is hand-written).
2. Found the source at `<SystemModeler-install>/15.0/L/IntroductoryExamples/CustomComponent/ChainPendulum.mo` and read it plus `ChainLink.mo`. The model already had a `__Wolfram(Animation(...))` with one fixed camera `"Default"` and one window `"Default"`.
3. Copied it to `work/ChainPendulum.mo` as a standalone top-level model: dropped only the `within IntroductoryExamples.CustomComponent;` line; the body is byte-identical (checked with `diff`). It still uses `IntroductoryExamples.CustomComponent.ChainLink` from the installed library.
4. Found the visualizer cref for the last link: `ChainLink.bodyBox1` is a `Parts.BodyBox`, whose shape is `frameTranslation.shape` (`Visualizers.Advanced.Shape` in `FixedTranslation`, MSL 4.1.0 source). So the cref is `chainLink4.bodyBox1.frameTranslation.shape`.
5. Edited the existing `Animation(...)` in place (no second annotation or `__Wolfram`): added camera `FollowLastLink` (`follow = chainLink4.bodyBox1.frameTranslation.shape`, `followMode = "NODE_CENTER"`, `distance = 6`, `rotation = {0, 0, 0, 1}`, which is the original camera's view onto the x–y swing plane), kept the original `Default` camera, and changed the `Default` window to `camera = "FollowLastLink", preferred = true, autoPlay = true, repeat = true, trace = {chainLink4.bodyBox1.frameTranslation.shape}`.
6. Wolfram evaluations:
   - **WLJS kernel via `mcp__wljs__kernel_evaluate`** (default route): (a) `Import` + `SystemModelSimulate[..., 5]` of the copy, to get the motion extents; (b) and (c) a trivial `{$AllowInternet, DateString[]}` probe. All three returned "still pending after 220 s". The shared kernel was busy or blocked (other sessions' notebooks are attached to it). I did not restart it, following the ground rules. The calls may still run later. They are wrapped in `Module` and write nothing.
   - **`wsm-toolkit wsm --mode simulate`** (fallback, because the WLJS kernel did not respond; this runs a fresh WSMKernelX), with `--load-library IntroductoryExamples` and a fresh tempdir in the session scratchpad: `flatten` Pass, `build` Pass, `result` Pass, `errors` [], simulation exit code 0.
   - **`wsm-toolkit summary`** on the result `.mat`: end of last link (`chainLink4.frame_b.r_0`) x ∈ [−3.67, 4], y ∈ [−3.93, 0], z = 0. The joint of the last link (`frame_a`) has x ∈ [−2.87, 3], y ∈ [−2.99, 0.21]. Motion is in the x–y plane, so a camera looking down −z (`{0,0,0,1}`) is correct. Distance 6 m frames a 1 m link and its neighbours.
   - Confirmed in the result file that `chainLink4.bodyBox1.frameTranslation.shape.*` variables exist, so the cref resolves.

## 3. Files
- Created `<repo>/tests/runs/2026-10-22/annotate-modelica-animation/work/ChainPendulum.mo`, a copy with the edited animation annotation.
- Created this log `<repo>/tests/runs/2026-10-22/annotate-modelica-animation/run-log.md`.
- Scratch only (outside the work folder): `<scratch>/wsm_sim_chain_1792650685/`, the wsm-toolkit build and results.
- The installed library is unchanged.

## 4. WLJS notebook
none. The 3D animation plays only in the System Modeler app. The WLJS kernel was not responding, so I made no results notebook.

## 5. Answer
I copied `IntroductoryExamples.CustomComponent.ChainPendulum` to `work/ChainPendulum.mo` as a standalone model named `ChainPendulum`. Its links still come from the installed IntroductoryExamples library. I edited the model's existing stored animation:

```modelica
__Wolfram(Animation(
  cameras = {
    Camera(name = "FollowLastLink", distance = 6, rotation = {0, 0, 0, 1},
           follow = chainLink4.bodyBox1.frameTranslation.shape, followMode = "NODE_CENTER"),
    Camera(name = "Default", center = {0.28, -0.85, 0}, distance = 17.37, rotation = {0, 0, 0, 1})},
  windows = {
    Window(name = "Default", camera = "FollowLastLink", preferred = true,
           autoPlay = true, repeat = true,
           trace = {chainLink4.bodyBox1.frameTranslation.shape})}))
```

When you simulate it in System Modeler, the animation opens by itself. It plays on a loop, with the camera centred on the fourth link and a trace path drawn behind it. The original overview camera is still there as "Default" if you want the whole chain. The model builds and simulates cleanly (wsm-toolkit: flatten, build and result all Pass, no errors). Please check the view once in Simulation Center. If it looks off, set the camera there and store it. A store from the GUI rewrites the window settings, so autoPlay, repeat and trace may need to be put back afterwards.

## 6. Problems
- **WLJS kernel did not respond:** three `mcp__wljs__kernel_evaluate` calls, including a trivial one, timed out at 220 s ("still pending"). I could not check `$AllowInternet` in that kernel. I did not restart it (ground rules). I used `wsm-toolkit` instead. The pending calls may still run in the shared kernel. They are Module-scoped, read the model file and simulate, and write no files.
- **Not checked visually:** the animation is not checked by eye. Simulation Center playback is not available from here. The camera distance and follow mode are reasoned from the simulated extents, not seen.
- **Trace point not confirmed:** I am not sure which point of the shape System Modeler traces, possibly the shape's origin at the link's joint (`frame_a`) rather than the free end of the chain. If you want the exact tip path, a small `Visualizers.FixedShape` sphere on `chainLink4.frame_b`, traced instead (cref `<name>.vis`), would give it. I did not add one, to keep the copy faithful.
- **Follow mode:** I chose `"NODE_CENTER"`, not the upstream example's `"NODE_CENTER_AND_AZIM"`. The motion is planar in x–y and this keeps the original camera orientation. Azimuth tracking about the world's vertical axis (−y here, since gravity points along −y) could rotate the view in unclear ways.
- **No ground plane:** I added no ground plane (upstream workflow step 2). The request did not ask for one, the original model turns off world animation, and the trace and the other links give a fixed reference.
- **Deprecation warnings:** wsm-toolkit reported 4 MSL deprecation warnings (`cardinality`, `Connections.rooted` inside MSL Revolute/FixedTranslation). They come from the library, not from this model.
