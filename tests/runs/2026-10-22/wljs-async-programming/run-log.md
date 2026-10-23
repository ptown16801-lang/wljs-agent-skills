# Run log: wljs-async-programming (2026-10-22)

Request: "Make a button in a notebook that runs a 3-second computation without freezing the notebook."

## 1. Skills used
1. wljs-async-programming
2. wljs-dynamics (for `InputButton`/`EventHandler` and `Offload` display updates)

## 2. Steps
- Read `ROUTES.md`, the pinned WLJS guides `async-programming.md` and `dynamics.md`, and WLJS's own `Packages/Misc/Kernel/Async.wl` (to confirm `AsyncFunction`, `Await`, `WhileAsync`, `PauseAsync` semantics: `asyncTransform` handles `Module`, `If`, `CompoundExpression`, `Set`, `Return`, `WhileAsync`). No evaluation.
- Checked kernel state: `$AllowInternet` (False), `Kernels[]` (0 subkernels), contexts of `ParallelSubmitAsync`/`PauseAsync`/`AsyncFunction`. Engine: WLJS kernel via `mcp__wljs__kernel_evaluate` (quick, user does not need to see it).
- Design choice: run the computation in the main kernel in short chunks inside an `AsyncFunction` with a `WhileAsync` loop, yielding with `PauseAsync[0.02] // Await` between chunks. I did not use `ParallelSubmitAsync` because it needs `LaunchKernels`, which would add subkernels to the kernel that other sessions share.
- Created WLJS notebook (`mcp__wljs__new_notebook`, id 030), added a `.md` explanation cell and the button cell (`add_cells_batch`), evaluated both (`evaluate_cell`). Engine: WLJS kernel, so the user sees it live. The button cell has no messages; it returns the two buttons plus a progress bar, status text and ping counter (all `Offload`-driven, Module-local state).
- Responsiveness test (WLJS kernel via `mcp__wljs__kernel_evaluate`): fired the Run button's event (`EventFire[id, True]`). The call returned after 0.013 s with status "Running... 0%". A *separate* later kernel evaluation, 2.6 s after Run, was accepted and answered while the computation was still at "Running... 88%", and its Ping event updated the counter immediately. So the kernel kept taking new evaluations and events during the run. Final status: "Done: π ≈ 3.14222 from 13000000 points in 3.00 s".
- Visual check: the first window capture showed only the top of notebook 030 (heading and source; the output is below the captured area). So I opened a small check notebook (id 039) with one short cell, `Get[".../scratch/panel.wl"]` (the same code), evaluated it, fired Run + Ping, and captured during the run. Screenshot `scratch/cap2/0x1400051_llm-cfd.wln.png` shows the "Run 3-second computation" and "Ping" buttons, a blue progress bar at about 87%, "Running... 87%" and "Pings: 1". Final state read back: "Done: π ≈ 3.14158 from 13000000 points in 3.03 s". Engine: WLJS kernel (notebook + `kernel_evaluate`).
- Saved notebook 030 by evaluating `NotebookSave[EvaluationNotebook[], ".../work/AsyncButton.wln"]` in a new cell of it (WLJS kernel). The file exists (5125 bytes).
- Cleanup: `Remove["test`asyncbtn`*"]` (my timing symbol); `$AllowInternet` still False. No wolframscript or fresh-kernel runs were needed.

## 3. Files
- Created: `<repo>/tests/runs/2026-10-22/wljs-async-programming/work/AsyncButton.wln`
- Created: `<repo>/tests/runs/2026-10-22/wljs-async-programming/scratch/panel.wl` (copy of the button cell for the visual check)
- Created: `.../scratch/cap/*.png`, `.../scratch/cap2/*.png` (window captures)
- Created: this run log.

## 4. WLJS notebook
`<repo>/tests/runs/2026-10-22/wljs-async-programming/work/AsyncButton.wln` (still open in WLJS as window "llm-ac4.wln"). The unsaved check notebook "llm-cfd.wln" (id 039) is also still open; I had no tool to close it.

## 5. Answer
The notebook `work/AsyncButton.wln` has a **Run 3-second computation** button and a **Ping** button. Run starts a Monte Carlo estimate of π that runs for 3 seconds. A progress bar and a status line update while it runs, and it ends with the result (for example "π ≈ 3.1416 from 13,000,000 points in 3.0 s"). The notebook does not freeze for two reasons:
- The handler is an `AsyncFunction`, so the button returns right away.
- The work runs in short chunks in a `WhileAsync` loop. After each chunk, `PauseAsync[0.02] // Await` hands control back to the kernel's event loop.

During a run, Ping still updates at once and other cells still evaluate (tested: an evaluation sent mid-run was answered at 88% progress). A second press of Run during a run is ignored. If one computation cannot be split into chunks, the alternative is `ParallelSubmitAsync[expr]` after `LaunchKernels[1]` with a `Then` callback. That runs it on a subkernel. I did not set this up because it starts subkernels in the shared kernel.

## 6. Problems
- No messages or errors from any evaluation.
- The window capture only shows the top of a notebook, so I could not see the button output in notebook 030 directly. I checked the identical code rendered in a separate small check notebook instead. Button presses were simulated with `EventFire` on the buttons' event ids, not with real mouse clicks.
- Each `PauseAsync[0.02]` adds a little idle time per chunk, so slightly less than 3 s of the 3-second window is spent computing. That is the cost of staying responsive. A chunk (200000 points, a few ms) is the longest the kernel is ever busy without a break.
- `mcp__wljs__new_notebook` returned short ids ("030", "039") rather than hashes; they worked with all tools.
