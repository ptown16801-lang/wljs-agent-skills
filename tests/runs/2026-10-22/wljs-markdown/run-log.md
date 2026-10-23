# Run log: wljs-markdown (2026-10-22)

## 1. Skills used
- wljs-markdown

## 2. Steps
1. Loaded the `wljs-markdown` skill. Read `ROUTES.md` and the pinned upstream guide
   `~/.local/opt/wljs/app/resources/app/modules/wljs-api/mcp/dist/skills/markdown.md`. The guide says that KaTeX
   backslashes must be escaped (`\\`) inside `.md` cells, so the cell source does that.
2. Computed the table values. Engine: **WLJS kernel via `mcp__wljs__kernel_evaluate`**, because this is computation the
   user does not need to see. Everything was wrapped in `Module` and no globals were left behind. The same call
   returned `$AllowInternet` as `False`. Result for n = 1..9 as {n, steps to 1, peak}:
   {1,0,1}, {2,1,2}, {3,7,16}, {4,2,4}, {5,5,16}, {6,8,16}, {7,16,52}, {8,3,8}, {9,19,52}.
3. Created a WLJS notebook (`mcp__wljs__new_notebook`, id 001) and added 2 cells with `add_cells_batch`:
   - cell 003, a `.md` cell containing: a heading; a display KaTeX `cases` formula
     $T(n) = n/2$ for even n and $3n+1$ for odd n; one sentence stating the conjecture and defining stopping time and
     peak (inline KaTeX, a `==highlight==`); a right-aligned Markdown table for n = 1..9; and an `:::info` note
     saying where the values come from.
   - cell 004, a Wolfram cell with `NotebookSave[EvaluationNotebook[], ".../work/CollatzMarkdown.wln"]`.
4. Evaluated both cells (`mcp__wljs__evaluate_cell`, **WLJS kernel**). The `.md` cell produced a markdown output
   cell (013). The save cell returned `RemoteNotebook[...]` and the file was written (2455 bytes).
5. Visual check. Ran `tools/capture-wljs-windows.sh`, which captured the top of the notebook (input source only). Used
   `mcp__wljs__project_cell` on cell 003 to open the rendered output in its own window. The next 3 capture attempts
   wrote no files: `xwd` failed with an X `BadColor` error. A capture attempt about 20 s later succeeded. The projected
   window (`scratch/cap5/0x1400035_Application.png`) shows the rendered formula, the highlighted text, the table and
   the info box, all correct.
6. While captures were failing, I also parsed the four formulas with WLJS's bundled KaTeX 0.16.10
   (`modules/wljs-sharedlib-mk/dist/katex-*.js`) in Node, using `scratch/katex-check.mjs`. All four parsed without
   errors. No Wolfram engine was involved, and the script made no network calls.

## 3. Files
- Created: `<repo>/tests/runs/2026-10-22/wljs-markdown/work/CollatzMarkdown.wln`
- Created (scratch): `.../wljs-markdown/scratch/katex-check.mjs`, `.../scratch/katex-check.cjs` (a first attempt that failed),
  and capture PNGs in `.../scratch/cap/` and `.../scratch/cap5/`. The folders `cap2`, `cap3` and `cap4` are empty.
- Created: this run log.

## 4. WLJS notebook
`<repo>/tests/runs/2026-10-22/wljs-markdown/work/CollatzMarkdown.wln`
(notebook 001, still open on the second monitor; WLJS's window title is `llm-0f7.wln`. The projected "Application" window of
cell 003 is also still open.)

## 5. Answer
Your notebook has a new Markdown cell, saved as `work/CollatzMarkdown.wln`. Cell source:

```
.md
# The Collatz map

For a positive integer $n$, the Collatz map is

$$
T(n) = \\begin{cases} \\dfrac{n}{2}, & n \\equiv 0 \\pmod{2}, \\\\[4pt] 3n + 1, & n \\equiv 1 \\pmod{2}. \\end{cases}
$$

The ==Collatz conjecture== says that for every $n \\ge 1$ some iterate $T^{k}(n)$ equals $1$. ...

| $n$ | steps to reach 1 | peak value |
|---:|---:|---:|
| 1 | 0 | 1 |
...
| 9 | 19 | 52 |
```

The backslashes are doubled because WLJS Markdown cells require it. The table values (steps to reach 1 and the
largest value on the way, for n = 1..9; for example 7 takes 16 steps and peaks at 52, 9 takes 19 steps) were computed
in the WLJS kernel. I checked the rendered cell in a screenshot: the formula, table and info box all display correctly.

## 6. Problems
- `tools/capture-wljs-windows.sh` produced no images 3 times in a row. A direct `xwd` call failed with
  `X Error ... BadColor (invalid Colormap parameter)`, and `xwd2png.py` then hit a struct error on the empty file. A
  retry about 20 s later worked. This was probably interference from other sessions capturing at the same time; I did
  not establish the cause.
- My first KaTeX check (`katex-check.cjs`, loading `wljs-revealjs/src/katex/katex.js`) failed because that file
  imports the missing `svg-path-properties` package. The `.mjs` check against the sharedlib build worked. Node printed
  a harmless `MODULE_TYPELESS_PACKAGE_JSON` warning.
- Small cosmetic issue: at the projected window's width, the full stop after the inline `\max` formula wraps onto its
  own line. I left it as is.
- The `HaveToSaveAs: true` header in the saved `.wln` comes from WLJS. I made no further saves.
