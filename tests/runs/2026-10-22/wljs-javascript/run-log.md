# Run log: wljs-javascript, 2026-10-22

Request: "Make a JavaScript cell that animates a bouncing dot on a canvas."

## 1. Skills used
1. `wljs-javascript` (local adaptation; read `ROUTES.md` and the pinned upstream guide `.../wljs-api/mcp/dist/skills/javascript.md` in full, as it directs)

## 2. Steps
1. Read `ROUTES.md` and the upstream WLJS JavaScript guide. Rules applied: a `.js` cell returns the DOM node to mount (here a `<canvas>`), never appends to `document.body`, and sets `this.ondestroy` to cancel the animation frame loop when the cell is re-evaluated or deleted.
2. Checked the update rule before building the cell: a Node.js script (`scratch/sim.js`, no Wolfram engine) runs the same rule (constant velocity 190, 140 px/s; reflect at all four walls; time step = real frame time capped at 0.05 s) for 20 s at 15, 30, 60, 144 and 240 fps. Every frame rate hits all four walls (at 60 fps: left 5, right 5, top 6, bottom 6). This addresses the previous run's issue, where the dot never reached the top wall.
3. `mcp__wljs__new_notebook` (notebook `022`, window titled `llm-889.wln`), then `mcp__wljs__add_cells_batch` with three cells: a `.md` description, the `.js` bouncing-dot cell, and a Wolfram `NotebookSave` cell.
4. `mcp__wljs__evaluate_cell` on the `.md` cell (rendered) and the `.js` cell (output type `js`). A `.js` cell runs in the WLJS front end (the notebook window), not in the Wolfram kernel.
5. Visual check: `tools/capture-wljs-windows.sh` produced no PNGs, because every `xwd` attempt failed with X `BadColor` (see Problems). Instead I captured the windows with `ffmpeg -f x11grab -window_id <id>` (read-only screen grab; nothing opened or moved). That identified my notebook window (`llm-889.wln`). The canvas was below the visible top of the window, so I used `mcp__wljs__project_cell` on the `.js` cell to open its output in its own "Application" window (403x291). Two grabs 3 s apart showed the dot at different positions and the wall counter going from `L 2 R 3 T 3 B 3` to `L 3 R 4 T 4 B 4`. So it animates and hits all four walls, including the top.
6. Saved by evaluating `NotebookSave[EvaluationNotebook[], ".../work/BouncingDot.wln"]` in the notebook's third cell. Engine: the WLJS kernel via `mcp__wljs__evaluate_cell`, because that is the required save method. It returned `RemoteNotebook["42600cfe-..."]`, and the file exists (4407 bytes) and contains the JS source. This was the only Wolfram evaluation. No `wolframscript`, `wolfram-direct` or `wsm-toolkit` was used, and nothing contacted the network.

## 3. Files
- Created: `<repo>/tests/runs/2026-10-22/wljs-javascript/work/BouncingDot.wln`
- Created (scratch): `<repo>/tests/runs/2026-10-22/wljs-javascript/scratch/sim.js`, `scratch/ff_0x1400015.png`, `scratch/ff_0x140001d.png`, `scratch/ff_0x1400025.png`, `scratch/ff_0x140002d.png` (window grabs; the first three show other sessions' notebook windows, captured only to identify mine), `scratch/proj_a.png`, `scratch/proj_b.png`, and the empty folders `scratch/cap1..cap3`
- Created: this run log

## 4. WLJS notebook
`<repo>/tests/runs/2026-10-22/wljs-javascript/work/BouncingDot.wln` (still open as window `llm-889.wln`; also the projected "Application" window of its JS cell, which I opened and left open)

## 5. Answer
I made the JavaScript cell in a new WLJS notebook, saved as `work/BouncingDot.wln`. The cell creates a 400x250 canvas and draws a pink dot (radius 12 px) moving at a constant 190 px/s across and 140 px/s down. The dot bounces off all four walls. A small counter in the corner shows the hits on each wall (L, R, T, B). The motion uses real frame time, so it runs at the same speed on any display refresh rate. Re-evaluating or deleting the cell stops the animation (`this.ondestroy` cancels it). To change the look or speed, edit `W`, `H`, `r`, `vx`, `vy` or the colours at the top of the cell. I checked it running: two screenshots 3 s apart show the dot in different places and the counter rising on all four walls.

## 6. Problems
- `tools/capture-wljs-windows.sh` captured nothing. `xwd` failed on every WLJS window with "BadColor (invalid Colormap parameter)" (4 retries each, 3 runs), and `xwd -root` failed with BadMatch. The workaround `ffmpeg -f x11grab -window_id` worked. ffmpeg was already installed; nothing was installed.
- Capturing all notebook windows to find mine also captured three other sessions' notebook windows (`scratch/ff_0x1400015.png`, `ff_0x140001d.png`, `ff_0x1400025.png`). I only looked at my own.
- The projected window runs its own copy of the animation (its counter started from zero), separate from the one in the notebook. That is expected for a projected `.js` cell.
- The in-notebook canvas is below the top of the window, so I did not capture it directly. Its evaluation returned a `js` output, and the projected copy of the same cell was seen animating.
- The `.md` cell shows its source above the rendered text in the notebook. That is WLJS's normal display for an evaluated Markdown cell.
