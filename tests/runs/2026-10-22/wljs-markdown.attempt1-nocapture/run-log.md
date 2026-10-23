# Run log: wljs-markdown (2026-10-22)

## 1. Skills used
1. wljs-markdown

## 2. Steps
1. Loaded the `wljs-markdown` skill. Read `ROUTES.md` and the pinned upstream guide (`.../wljs-api/mcp/dist/skills/markdown.md`). The guide's rules used here: start the cell with `.md`, use `$...$` and `$$...$$` for KaTeX, and double every backslash in Markdown (`\\begin`, `\\\\` for a KaTeX line break).
2. Checked the table values with `mcp__wljs__kernel_evaluate` (WLJS kernel). This was a background check the user does not need to see. Code: `Module` with local `c`/`traj`, so no globals were left. It returned `$AllowInternet = False` and, for n = 1..9, C(n), the number of steps to reach 1, and the largest value on the trajectory.
3. Created a WLJS notebook with `mcp__wljs__new_notebook` (id `002`). Added one `.md` cell (`008`) with `mcp__wljs__add_cells_batch`. It holds a heading, the Collatz map as a display `cases` formula, one sentence on the conjecture, and a right-aligned 9-row table.
4. The orchestrator reported a WLJS app restart at 03:51. I ran `mcp__wljs__list_notebooks` and `list_cells`: notebook `002` was still open and still had cell `008`, so I carried on in it.
5. Evaluated the `.md` cell with `mcp__wljs__evaluate_cell` (WLJS kernel/front end). It gave markdown output cell `013`. `read_content` on it returned the Markdown source, which the front end renders.
6. Added a Wolfram cell (`015`) holding `NotebookSave[EvaluationNotebook[], ".../work/CollatzMarkdown.wln"]` and evaluated it (WLJS kernel). It returned `RemoteNotebook[...]`. I checked the saved file with `cat`, and its contents are correct.

No `wolframscript`, `wolfram-direct` or `wsm-toolkit` was used.

## 3. Files
- Created: `<repo>/tests/runs/2026-10-22/wljs-markdown/work/CollatzMarkdown.wln`
- Created: `<repo>/tests/runs/2026-10-22/wljs-markdown/run-log.md`
- Nothing in `scratch/` was used.

## 4. WLJS notebook
`<repo>/tests/runs/2026-10-22/wljs-markdown/work/CollatzMarkdown.wln` (open in WLJS as notebook `002` on the second monitor)

## 5. Answer
I added a Markdown cell to a new WLJS notebook, evaluated it, and saved the notebook as `work/CollatzMarkdown.wln`. The cell source:

```markdown
.md
## The Collatz map

For a positive integer $n$, the Collatz map is

$$
C(n) = \\begin{cases} \\dfrac{n}{2}, & n \\equiv 0 \\pmod{2} \\\\[4pt] 3n + 1, & n \\equiv 1 \\pmod{2} \\end{cases}
$$

The Collatz conjecture says that iterating $C$ from any $n \\ge 1$ eventually reaches $1$.

| $n$ | $C(n)$ | steps to reach 1 | largest value on the way |
|---:|---:|---:|---:|
| 1 | 4 | 0 | 1 |
| 2 | 1 | 1 | 2 |
| 3 | 10 | 7 | 16 |
...
| 9 | 28 | 19 | 52 |
```

Backslashes are doubled because WLJS Markdown needs that for KaTeX. All table values were computed in the kernel, not typed from memory.

## 6. Problems
- The orchestrator restarted the WLJS app at 03:51, which I did not control. My notebook `002` survived it (checked with `list_notebooks` / `list_cells`). `list_notebooks` showed `Kernel: "Missing"` for both open notebooks, but evaluation still worked.
- **I did not check the rendering visually.** The run rules forbid opening a browser, so I took no screenshot of the formula or table. `evaluate_cell` returned a markdown output cell with no error, but I could not confirm that KaTeX displays the `cases` environment and the `\\[4pt]` row spacing correctly.
- The saved `.wln` stores only the input cells (no output cell). The Markdown renders again when the cell is evaluated.
- The guide says a save may be followed by a "File hash mismatch" dialog in WLJS. I could not see the window, so I don't know whether it appeared. If it did, Cancel keeps what is on screen.
- Notebook `001` (`/tmp/wljs_quicknotes/llm-d87.wln`) belongs to another session. I left it alone.
