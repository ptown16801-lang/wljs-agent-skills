# Run log: wljs-mermaid (2026-10-22)

## 1. Skills used
1. `wljs-mermaid`

## 2. Steps
1. Loaded `wljs-mermaid`. Read `<repo>/ROUTES.md` and the pinned upstream guide `~/.local/opt/wljs/app/resources/app/modules/wljs-api/mcp/dist/skills/mermaid.md` (a `.mermaid` first line makes the cell a Mermaid cell).
2. Created a WLJS notebook with `mcp__wljs__new_notebook` (id `001`). Added 5 input cells with `mcp__wljs__add_cells_batch`:
   - `.md`: title and the map, $T(n) = n/2$ for even $n$, $3n+1$ for odd $n$.
   - `.mermaid`: the flowchart (Start, then "n = 1?" with Yes going to Stop, then "n even?" with Yes going to n ← n/2 and No going to n ← 3n+1, and both looping back to the "n = 1?" check).
   - `.md`: a one-line note introducing the check.
   - Wolfram cell: the same rule inside `Module` (no global names), iterated from 6 with `NestWhileList`.
   - Wolfram cell: `NotebookSave[EvaluationNotebook[], ".../work/CollatzFlowchart.wln"]`.
3. Got the coordinator's notice that the WLJS app was restarted at 03:51. Checked with `mcp__wljs__list_notebooks` and `mcp__wljs__list_cells`: notebook `001` was still open and still had all 5 cells, so I did not recreate it.
4. WLJS kernel via `mcp__wljs__kernel_evaluate`: `{$AllowInternet, $VersionNumber}` returned `{False, 15.}`. I ran this to confirm internet was still off after the restart.
5. WLJS kernel via `mcp__wljs__evaluate_cell`: evaluated all 5 cells in order (WLJS notebook route, because the user should see the result).
   - The two `.md` cells gave markdown outputs.
   - The `.mermaid` cell gave a `mermaid` output. Reading it back with `read_content` showed the exact diagram source.
   - The check cell returned `{6, 3, 10, 5, 16, 8, 4, 2, 1}`, which is the correct Collatz trajectory of 6.
   - The save cell returned `RemoteNotebook[...]`.
6. Bash: confirmed the `.wln` file exists (3530 bytes) and contains the Mermaid input and output. Looked for a local Mermaid CLI (`mmdc`) to check the syntax offline; none is installed.

No `wolframscript`, `wolfram-direct` or `wsm-toolkit` runs.

## 3. Files
- Created `<repo>/tests/runs/2026-10-22/wljs-mermaid/work/CollatzFlowchart.wln`
- Created `<repo>/tests/runs/2026-10-22/wljs-mermaid/run-log.md` (this file)
- WLJS also keeps its own quick-note file for the notebook, `/tmp/wljs_quicknotes/llm-d87.wln` (WLJS created this automatically, not me).

## 4. WLJS notebook
`<repo>/tests/runs/2026-10-22/wljs-mermaid/work/CollatzFlowchart.wln` (open in WLJS as notebook `001`)

## 5. Answer
The flowchart is in a WLJS notebook on your second monitor, saved as `work/CollatzFlowchart.wln`. Its Mermaid source:

```
flowchart TD
  S(["Start: positive integer n"]) --> C{"n = 1?"}
  C -->|Yes| E(["Stop: reached 1"])
  C -->|No| P{"n even?"}
  P -->|"Yes (n mod 2 = 0)"| H["n ← n / 2"]
  P -->|"No (n mod 2 = 1)"| T["n ← 3n + 1"]
  H --> C
  T --> C
```

The Collatz map's own decision is the "n even?" diamond: halve n if it is even, and send it to 3n + 1 if it is odd. The "n = 1?" check and the loop show the usual iteration that stops at 1. The notebook also has a short Wolfram check: starting from 6, the same rule gives 6, 3, 10, 5, 16, 8, 4, 2, 1.

## 6. Problems
- The orchestrator reported that the WLJS app was restarted at 03:51, which I did not control. Afterwards my notebook `001` was still listed as open with all its cells, `list_notebooks` showed its kernel as "Missing" before the first evaluation, and `$AllowInternet` was `False`. All evaluations then worked.
- I did not check the rendered diagram visually. The skill says to take a screenshot (for example with `wljs nb url` in the browser pane), but this run's rules forbid opening browsers. My only evidence that it renders is that WLJS produced an output cell of type `mermaid` holding the right source. No Mermaid CLI is installed, so I could not check the syntax independently either.
- The save cell ran before its own output existed, so the saved file does not contain the `RemoteNotebook[...]` output of the save cell. That is expected and harmless. The ROUTES file says a "File hash mismatch" dialog may appear about 3 s after a save. I could not see whether one appeared.
- No warnings or messages came back from any evaluation.
