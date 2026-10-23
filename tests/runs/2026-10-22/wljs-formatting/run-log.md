# Run log: wljs-formatting, 2026-10-22

## 1. Skills used
1. wljs-formatting

## 2. Steps
1. Loaded the `wljs-formatting` skill. Read `ROUTES.md` and the pinned upstream guide `formatting.md` (WLJS's own formatting guide).
2. `mcp__wljs__kernel_evaluate` (WLJS kernel): `{$AllowInternet, Prime[Range[10]]}` gave `{False, {2, 3, 5, 7, 11, 13, 17, 19, 23, 29}}`. I used it to confirm internet was off and to check the data.
3. `mcp__wljs__new_notebook` created notebook `004` (window on the WLJS app). `add_cells_batch` added a `.md` cell (006) and a Wolfram cell (007). My first draft assigned a bare global `primes`. I changed it to `With[...]` before evaluating, because the kernel is shared.
4. `evaluate_cell` 006 and 007 (WLJS kernel, notebook cells, so the user can see them). The first version used `Grid[..., Frame -> All, Background -> {None, {headerColor, {stripes}}}]`.
5. Check: `read_content` returns only the plain data, so I looked at the box form with `kernel_evaluate` (WLJS kernel: `ToBoxes`, then `Uncompress` of the decorator). The Grid decorator was a bare `ViewDecorator["Grid"]`, with no Background and no Frame. WLJS source `wljs-editor/src/BoxesWorkarounds.wl` line 371 confirms this: `GridBox` keeps only `BaselinePosition, Selectable, GridBoxDividers, GridBoxAlignment, GridBoxSpacings, ImageSize`. So the header highlight in the first version would not have shown in WLJS.
6. Checked another approach with `kernel_evaluate` (WLJS kernel). `Item[Style[..., Bold, White], Background -> c]` and `Dividers -> All` keep their settings (`ViewDecorator["Item", Background -> ...]`, `ViewDecorator["Grid", GridBoxDividers -> ...]`). The frontend `boxes.js` `ViewDecorator.Item` passes these on to `StyleDecorator`, which sets `backgroundColor`.
7. Rewrote cell 007 to give each cell its own `Item` background: a blue header (RGB 0.18, 0.36, 0.62) with bold white text, alternating light-blue/white row stripes, `Dividers -> All`, `Alignment -> Center`, `Spacings -> {2, 0.8}`. Updated the `.md` text to match. Re-evaluated both cells (WLJS kernel).
8. Added cell 018 `NotebookSave[EvaluationNotebook[], ".../work/PrimesTable.wln"]` and evaluated it (WLJS kernel). It returned `RemoteNotebook[...]`, and the file exists (7574 bytes).

No wolframscript, wolfram-direct or wsm-toolkit runs. No files outside `work/` other than this log.

## 3. Files
- Created `<repo>/tests/runs/2026-10-22/wljs-formatting/work/PrimesTable.wln`
- Created `<repo>/tests/runs/2026-10-22/wljs-formatting/run-log.md`

## 4. WLJS notebook
`<repo>/tests/runs/2026-10-22/wljs-formatting/work/PrimesTable.wln` (open in the WLJS app as notebook `004`, left open)

## 5. Answer
The first 10 primes (2, 3, 5, 7, 11, 13, 17, 19, 23, 29) are in the WLJS notebook `PrimesTable.wln` (on your second monitor). The table has two columns, n and Prime(n). The header row is blue with bold white text, the rows alternate light-blue and white, and dividers separate all cells. Code:

```wolfram
With[{primes = Prime[Range[10]],
      headerBg = RGBColor[0.18, 0.36, 0.62],
      stripe = RGBColor[0.92, 0.95, 1.]},
 Grid[
  Prepend[
   MapIndexed[
    Function[{row, pos},
     Item[#, Background -> If[EvenQ[First[pos]], stripe, White]] & /@ row],
    Transpose[{Range[10], primes}]],
   Item[Style[#, Bold, White], Background -> headerBg] & /@ {"n", "Prime(n)"}],
  Dividers -> All, Alignment -> Center, Spacings -> {2, 0.8}]]
```

WLJS note: the usual Mathematica form `Grid[..., Background -> {None, {headerColor}}, Frame -> All]` loses its colours and frame in WLJS. WLJS's Grid display passes only Dividers, Alignment, Spacings and ImageSize to the screen. That is why the colours are set on each `Item`.

## 6. Problems
- I did not take a screenshot of the rendered table (the run rules say not to open browsers). I checked the styling from the box form and the WLJS frontend source, not visually. I expect the header and stripes to render, but I have not seen them on screen.
- The first draft (Grid-level `Background`/`Frame`) would have lost the highlight in WLJS. I found this from the box form and replaced the draft before saving. The upstream formatting guide does not mention this limitation. It only says to check options that WLJS might not support.
- `read_content` / `evaluate_cell` show the output only as plain data (`{{"n","Prime(n)"},{1,2},...}`). That is a text summary of the Grid, not an error.
- The notebook id returned by `new_notebook` was `004`, a short id. All later calls worked with it.
