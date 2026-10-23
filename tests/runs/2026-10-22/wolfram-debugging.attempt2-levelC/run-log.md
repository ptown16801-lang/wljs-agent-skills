# Run log: wolfram-debugging, 2026-10-22

## 1. Skills used
1. wolfram-debugging (local WLJS adaptation; read `ROUTES.md` and the pinned upstream `SKILL.md` as it instructs)

## 2. Steps
1. Read `work/FunctionWithAssert.wl` (70 bytes) and recorded its sha256 (`80f8345b…9d2d`):
   `Compute[x_] := Block[{y}, y = x^2; Assert[y > 5]; Sin[y]]`.
2. **WLJS kernel, `mcp__wljs__kernel_evaluate`** (default route; a persistent kernel where Trace works): checked the environment
   (`$AllowInternet` False, `$EvaluationEnvironment` "Session", `Global`` context, Trace works, `$AssertFunction` unset,
   no `Global`Compute` yet, version 15.0).
3. **WLJS kernel, `mcp__wljs__kernel_evaluate`**: loaded the file inside `Block[{Compute, y}, Get[file]; ...]` (nothing left
   defined in the shared kernel) and collected, with `EvaluationData`, the result and messages of `Compute[1]` and
   `Compute[3]`: (a) default, (b) under `On[Assert]` scoped with `WithCleanup[On[Assert], ..., Off[Assert]]`, (c) after
   `Off[Assert]` again, (d) with `Block[{$AssertFunction = Throw[...] &}, ...]` with Assert on and with Assert off.
4. **Fresh kernel, `wolframscript`** inside the network cut (`bwrap --unshare-net ...`, `timeout -s KILL 120`,
   `$AllowInternet = False` first line), script `scratch/fresh-check.wl`, output `scratch/fresh-check.out`. Why: to confirm the
   behaviour does not depend on the shared WLJS kernel's state (upstream rule 8), and to compare `Get` with `ToExpression`
   of the same source. Same results as WLJS.
5. **WLJS kernel, visible notebook** (`mcp__wljs__new_notebook` → `add_cells_batch` → `evaluate_cell`): a `.md` cell with the
   explanation, a cell with `{x, x^2, x^2 > 5}` for x = 1, 3, a cell with the default calls, a cell with the scoped
   `On[Assert]` calls, and a `NotebookSave` cell. The first version of the `On[Assert]` cell used
   `EvaluationData[...][{"Result", "MessagesExpressions"}]`, which returns `Missing["KeyAbsent", ...]`; replaced by
   `KeyTake[...]` and re-evaluated.
6. Looked at the notebook as the user sees it with `tools/capture-wljs-windows.sh` (window `llm-d0f.wln`), and at the
   `On[Assert]` output with `mcp__wljs__project_cell` (window "Application").
7. **WLJS kernel, `mcp__wljs__kernel_evaluate`**: `Global`Compute` had no definitions left (Block-scoped); removed the symbol.
   `$AllowInternet` still False; `Assert` left Off, as found.
8. Confirmed `FunctionWithAssert.wl` unchanged (same sha256, same mtime Oct 1).

## 3. Files
- Created `tests/runs/2026-10-22/wolfram-debugging/work/AssertDebugging.wln` (WLJS notebook)
- Created `tests/runs/2026-10-22/wolfram-debugging/scratch/fresh-check.wl`, `scratch/fresh-check.out`
- Created `tests/runs/2026-10-22/wolfram-debugging/scratch/cap/`, `scratch/cap2/`, `scratch/cap3/` (window captures)
- Created this file, `tests/runs/2026-10-22/wolfram-debugging/run-log.md`
- `work/FunctionWithAssert.wl`: not changed

## 4. WLJS notebook
`<repo>/tests/runs/2026-10-22/wolfram-debugging/work/AssertDebugging.wln`
(still open in WLJS as `llm-d0f.wln`; a projected output window "Application" is also open).

## 5. Answer
The only thing that differs between the two calls is the `Assert[y > 5]` test:

| call | `y = x^2` | `y > 5` | default (Assert off) | after `On[Assert]` |
|---|---|---|---|---|
| `Compute[1]` | 1 | **False** | `Sin[1]` (0.841…), no message | `Sin[1]` plus `Assert::asrtfl: Assertion y > 5 at line 5 in …/FunctionWithAssert.wl failed.` |
| `Compute[3]` | 9 | True | `Sin[9]` (0.412…), no message | `Sin[9]`, no message |

Evidence (same in the WLJS kernel and in a fresh offline wolframscript kernel, Wolfram 15.0):
- Assertions are off by default, so with default settings both calls are silent and differ only in their value.
  With `On[Assert]`, `EvaluationData[Compute[1]]["MessagesExpressions"]` is
  `{Hold[Message[Assert::asrtfl, y > 5, 5, ".../FunctionWithAssert.wl"]]}`; for `Compute[3]` it is `{}`.
- A failed assertion only reports: it does not stop the function, so `Compute[1]` still returns `Sin[1]`. To make it
  stop, set `$AssertFunction`: with `Block[{$AssertFunction = Throw[{"assert failed", #}, tag] &}, ...]`, `Compute[1]` throws
  `HoldComplete[Assert[y > 5, {5, file}]]` and `Compute[3]` returns `Sin[9]`.
- `Get` rewrites the assertion when it loads the file: `DownValues[Compute]` contains `Assert[y > 5, {5, "<file>"}]`,
  which is why the message is `Assert::asrtfl` with the line number. Defining the same text with `ToExpression` gives
  plain `Assert[y > 5]` and the message `Assert::asrtf: Assertion y > 5 failed.`
- Any argument with `x^2 <= 5` (|x| ≤ √5, e.g. 1 and 2) fails the assertion; 3 passes.

## 6. Problems
- The first `On[Assert]` notebook cell used `EvaluationData[...][{keys}]`, which returned `Missing["KeyAbsent", ...]`; fixed with `KeyTake`.
- The second and third runs of `capture-wljs-windows.sh` printed `X Error … BadColor (invalid Colormap parameter)` and wrote
  empty `.xwd` files for the notebook windows; only the "Application" windows were captured. The first run captured all
  three notebook windows correctly. `scratch/cap3/0x1400040_Application.png` is a projected window I did not open
  (another session's, not inspected).
- Observed but not documented-checked: with `Off[Assert]` (the default state), a `$AssertFunction` set by `Block` was still
  called for the failing assertion (both kernels). I did not look up whether this is documented.
- `On[Assert]` is a global switch; I turned it on for the duration of two short calls (`WithCleanup` back to Off). Other
  sessions' assertions in the shared WLJS kernel would have been checked during those moments.
- No WLJS call was slow; no hang.
