# Run log: wljs-special-cells (2026-10-22)

## 1. Skills used
1. `wljs-special-cells`

## 2. Steps
1. Loaded the `wljs-special-cells` skill. Read `ROUTES.md` and the pinned upstream guide `.../wljs-api/mcp/dist/skills/special-cells.md` in full. Per the guide, `.sh` cells run with the working directory set to `NotebookDirectory[]`, and `.latex` cells take raw KaTeX with no `$` delimiters or extra escaping.
2. The working folder was empty and contained no notebook, so I created a WLJS notebook with `mcp__wljs__new_notebook` (id `052`). It opened on the second monitor.
3. Added four input cells with `mcp__wljs__add_cells_batch`:
   - `.md`: a title and a one-line description
   - `.sh`: `pwd` and `ls -la`
   - `.latex`: `e^{i\pi} + 1 = 0`
   - a Wolfram cell: `NotebookSave[EvaluationNotebook[], ".../work/SpecialCells.wln"]`
4. Checked `$AllowInternet` with `mcp__wljs__kernel_evaluate` (WLJS kernel), because the ground rules require it to be off. Result: `False`.
5. Evaluated the save cell first (WLJS kernel via `mcp__wljs__evaluate_cell`), so that `NotebookDirectory[]` would be the working folder before the shell cell ran. Result: `RemoteNotebook["35a32ae4-..."]` and no messages.
6. Evaluated the `.md`, `.sh` and `.latex` cells with `mcp__wljs__evaluate_cell` (rendered by WLJS: markdown, a shell subprocess and KaTeX). No Wolfram code is involved. I read the outputs with `mcp__wljs__read_content`:
   - The shell output starts with `pwd` = `<repo>/tests/runs/2026-10-22/wljs-special-cells/work` and lists `.`, `..` and `SpecialCells.wln`.
   - The LaTeX output is `e^{i\pi} + 1 = 0`.
7. Evaluated the save cell again (WLJS kernel) so the saved file contains the outputs. Checked the `.wln` text: all three outputs are present.
8. Ran `tools/capture-wljs-windows.sh` into `scratch/cap` and found my window (`llm-e0b.wln.png`) by its content. The heading renders. The shell output lists the work folder. Euler's identity renders as typeset math: e^{iπ} + 1 = 0.

## 3. Files
- Created: `<repo>/tests/runs/2026-10-22/wljs-special-cells/work/SpecialCells.wln`
- Created: `<repo>/tests/runs/2026-10-22/wljs-special-cells/scratch/cap/*.png` (window captures, including other sessions' windows, which the capture script takes as well)
- Created: this run log

## 4. WLJS notebook
`<repo>/tests/runs/2026-10-22/wljs-special-cells/work/SpecialCells.wln` (open on the second monitor, window title `llm-e0b.wln`)

## 5. Answer
I added both cells to a new WLJS notebook, saved as `work/SpecialCells.wln`:
- **Shell cell** (`.sh` / `pwd` / `ls -la`): it runs in the notebook's folder and lists the `work` folder. At the moment that folder holds only `SpecialCells.wln`.
- **LaTeX cell** (`.latex` / `e^{i\pi} + 1 = 0`): it renders Euler's identity as typeset math.

There is also a short markdown title cell and a `NotebookSave[...]` cell that saves the notebook to that path.

## 6. Problems
- No failures or kernel messages.
- The notebook was unsaved when created, and a shell cell runs in `NotebookDirectory[]`. To make sure the listing was of the work folder, I saved the notebook first and then ran the shell cell. `pwd` confirmed the directory.
- The window title still shows WLJS's temporary name (`llm-e0b.wln`) after `NotebookSave`. The file on disk is correct.
- The listing reflects the folder at the time it ran, so it does not show this run log (which is outside `work/`) or later changes. Re-evaluate the shell cell to refresh it.
- The upstream instruction to check the result in the browser pane (`wljs nb url`) was not followed, because the ground rules forbid opening browsers. I used the window-capture script instead.
