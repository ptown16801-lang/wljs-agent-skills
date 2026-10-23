# Run log: wljs-javascript (2026-10-22)

## 1. Skills used
1. wljs-javascript (local WLJS adaptation; read ROUTES.md and the pinned upstream guide `wljs-api/mcp/dist/skills/javascript.md`)

## 2. Steps
1. Loaded the `wljs-javascript` skill; read `<repo>/ROUTES.md` and the upstream JavaScript cell guide in full. Key rules applied: a `.js` cell runs as an isolated function and returns a DOM node to mount; do not append to `document.body`; set `this.ondestroy` to cancel animation frames.
2. `mcp__wljs__new_notebook` -> notebook id `018` (opens in the WLJS desktop app on the second monitor).
3. `mcp__wljs__add_cells_batch`: a `.md` description cell (`022`) and the `.js` cell (`023`). The JS cell creates a 400x260 canvas, animates a red dot (radius 12) with `requestAnimationFrame`, uses gravity (900 px/s^2) and elastic bounces off all four walls, caps the time step at 50 ms (so a backgrounded tab does not make the dot jump through walls), and sets `this.ondestroy = () => cancelAnimationFrame(frame)`.
4. `mcp__wljs__evaluate_cell` on `022` (markdown output `026`) and `023` (js output `027`). Engine: WLJS frontend (JS runs in the notebook window, not in a Wolfram kernel); the markdown cell is rendered by WLJS.
5. Added and evaluated a Wolfram cell (`029`) with `NotebookSave[EvaluationNotebook[], ".../work/BouncingDot.wln"]`. Engine: WLJS kernel via `mcp__wljs__evaluate_cell`, because ROUTES.md says saving to a path must be done from a cell of that notebook. Result: `RemoteNotebook["a4d217ff-..."]`; the file was written (4007 bytes).
6. Checked the saved file with `grep` (cells present, `ondestroy` present) and syntax-checked the JS cell body with `node --check` (wrapped in a function, since `.js` cells run as a function body): SYNTAX_OK. No Wolfram evaluation was involved in this check.

## 3. Files
- Created: `<repo>/tests/runs/2026-10-22/wljs-javascript/work/BouncingDot.wln`
- Created (temporary): `<repo>/tests/runs/2026-10-22/wljs-javascript/scratch/body.txt`, `.../scratch/check.js`
- Created: `<repo>/tests/runs/2026-10-22/wljs-javascript/run-log.md`

## 4. WLJS notebook
`<repo>/tests/runs/2026-10-22/wljs-javascript/work/BouncingDot.wln` (open in WLJS as notebook `018`; left open).

## 5. Answer
I added a JavaScript cell to a new WLJS notebook (`BouncingDot.wln`, open on your second monitor) and evaluated it. It draws a red dot on a 400x260 canvas that falls under gravity and bounces off all four walls with no energy loss. To change the motion, edit `vx` (sideways speed), `g` (gravity) or `damping` (set it below 1, for example 0.9, so the bounces die down). The cell cancels its animation loop when you re-evaluate or delete it, so re-running it never leaves two loops going. The notebook also has a description cell and the `NotebookSave` cell I used to save it.

## 6. Problems
- I did not see the animation running. The skill says to check the result with a screenshot via `wljs nb url` and the browser pane, but this run's rules say not to open browsers, so I took no screenshot. What I did check: both cells evaluated without error (the JS output cell `027` exists), the saved `.wln` contains the cell, and `node --check` found no syntax errors. The canvas was not looked at on screen.
- The saved `.wln` holds the description text twice (lines 15 and 22: the input cell and its rendered output) and the JS source twice (input and output). This looks like WLJS's normal way of storing outputs, not a problem.
- ROUTES.md mentions a "File hash mismatch" dialog that WLJS may show about 3 s after `NotebookSave`. I could not see the screen, so I don't know whether it appeared; if it did, Cancel keeps what is on screen.
