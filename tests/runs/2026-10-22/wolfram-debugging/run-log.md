# Run log: wolfram-debugging, FunctionWithAssert.wl (2026-10-22)

## 1. Skills used
- wolfram-debugging (local WLJS adaptation; read ROUTES.md, the pinned upstream SKILL.md, and the FailedAssertions / CollectMessages / Assert sections of `references/HelperFunctions.md` and `references/MessagesAndStacks.md`)

## 2. Steps
1. Read `work/FunctionWithAssert.wl` (shell `cat`). It defines `Compute[x_] := Block[{y}, y = x^2; Assert[y > 5]; Sin[y]]`; the `Assert` is on line 5.
2. **WLJS kernel (`mcp__wljs__kernel_evaluate`)**: checked the shared kernel first: `$AllowInternet` False, `$Context` "Global`", no existing `Global`Compute`, helpers not loaded. Loaded `WolframDebugging.wl` in its own call (skill rule 4).
3. **WLJS visible notebook (`mcp__wljs__new_notebook`, `add_cells_batch`, `evaluate_cell`)**, so the user can see the evidence: a `.md` title cell; file SHA-256 + text; `Get` the file and evaluate `{Compute[1], Compute[3]}` → `{Sin[1], Sin[9]}`, no message; `WolframDebugging`FailedAssertions` on both → **0 failures for both** (unexpected); `WolframDebugging`CollectMessages[..., "IncludeQuieted" -> True]` on both → no messages; a table of x, x^2, x^2 > 5 for x = 1, 2, 3.
4. **WLJS kernel (`kernel_evaluate`)**, to find out why FailedAssertions found nothing: an `"Assertions"` handler (`Internal`HandlerBlock`) caught a top-level `Assert[1 > 5]` but nothing from `Compute[1]`; `DownValues[Compute]` showed `Assert[y > 5, {5, "<file>"}]` (Get adds line and file); `Trace[Compute[1]]` showed that the `Assert` step was never evaluated (`y = 1` then straight to `Sin[1]`). The same Block typed inline did trigger the handler.
5. **Fresh kernel, `wolframscript` inside the network cut** (`bwrap --unshare-net ...`, `$AllowInternet = False` first line, `timeout -s KILL 180`). Used to cross-check outside the shared kernel and to turn `On[Assert]`, which the local rules forbid in the shared WLJS kernel.
   - `scratch/fresh.wl` (first attempt stopped on a syntax error I made, a misplaced bracket; fixed with sed and rerun): same 0 count when `Compute` was called before `FailedAssertions`. With `On[Assert]` (fresh kernel only): `CollectMessages[Compute[1]]` → 1 message, `Assert::asrtfl: Assertion y > 5 at line 5 in .../FunctionWithAssert.wl failed.`, stack `Compute[1] → Block[...] → ... → Assert[y > 5, {5, ...}]`; `CollectMessages[Compute[3]]` → 0 messages; `FailedAssertions` with Assert On → Compute[1]: 1 failure (`"y > 5"`, Line 5, File, Callers {"Compute"}); Compute[3]: 0.
   - `scratch/fresh2.wl`: directly after `Get`, the handler **did** catch `Compute[1]` (1 hit); an `Internal`InheritedBlock` override of `Assert` saw the call with test `y > 5` → `False`.
   - `scratch/fresh3.wl`: three handled calls in a row → 1 hit each; but after one plain call of `Compute[1]` (or `Compute[3]`, or a `Trace` of it) with Assert Off, every later handled call of `Compute` gave 0 hits and `Trace` showed no `Assert` step. A typed function `g` behaves the same way. Reloading the file (`Get` again) resets it.
6. **WLJS visible notebook**: added a `.md` cell explaining step 5, then re-`Get` the file and ran `FailedAssertions` first → `Compute[1]`: Count 1, `"y > 5"`, Line 5, File `.../FunctionWithAssert.wl`, Callers {"Compute"}; `Compute[3]`: Count 0. Added an answer `.md` cell. Saved with `NotebookSave[EvaluationNotebook[], ".../work/ComputeAssertDiagnosis.wln"]` evaluated in a cell.
7. Checked the result as the user sees it: `tools/capture-wljs-windows.sh` (my window: `llm-8bf.wln`, top of notebook OK), then `mcp__wljs__project_cell` on the decisive FailedAssertions cell and captured again (window `0x1400103_Application`): the output reads as above.
8. **WLJS kernel (`kernel_evaluate`)**: `Remove[Global`Compute, Global`fwaFile]`; confirmed `$AllowInternet` still False.
9. Verified the file is unchanged: SHA-256 `80f8345b712ba00fa7454fd9735578e0970b7003c649460aef3d620f721e9d2d` before (notebook cell) and after (`sha256sum`), mtime still Oct 1.

## 3. Files
- Created: `work/ComputeAssertDiagnosis.wln` (WLJS notebook)
- Created: `scratch/fresh.wl`, `scratch/fresh.out`, `scratch/fresh2.wl`, `scratch/fresh2.out`, `scratch/fresh3.wl`, `scratch/fresh3.out`, `scratch/montage.png`, `scratch/cap/*.png`, `scratch/cap2/*.png`
- Created: `run-log.md` (this file)
- Not changed: `work/FunctionWithAssert.wl`

All paths are relative to `<repo>/tests/runs/2026-10-22/wolfram-debugging/`.

## 4. WLJS notebook
`<repo>/tests/runs/2026-10-22/wolfram-debugging/work/ComputeAssertDiagnosis.wln` (left open, window `llm-8bf.wln`; plus one projected "Application" window of cell 144)

## 5. Answer
`Compute[x]` computes `y = x^2`, asserts `y > 5` on line 5, and returns `Sin[y]`.
- `Compute[3]`: y = 9, and 9 > 5 is True, so the assertion passes.
- `Compute[1]`: y = 1, and 1 > 5 is False, so **the assertion on line 5 fails**.

You don't see a difference by default because `Assert` is Off: the failure is silent and `Compute[1]` still returns `Sin[1]`, just as `Compute[3]` returns `Sin[9]`. Evidence: `WolframDebugging`FailedAssertions` reports one failed assertion for `Compute[1]` (`y > 5`, line 5, `FunctionWithAssert.wl`, caller `Compute`) and none for `Compute[3]`, in the WLJS kernel and in a fresh kernel. With `On[Assert]` (tested only in a fresh kernel), `Compute[1]` issues `Assert::asrtfl: Assertion y > 5 at line 5 in .../FunctionWithAssert.wl failed.` and `Compute[3]` issues nothing. Any x with x^2 ≤ 5 (|x| ≤ √5 ≈ 2.24, so the integers -2 to 2) fails it. If small inputs are invalid, the function should reject them (e.g. a condition or a message); if they are valid, the assertion is wrong. Which one is right is your call.

A trap when checking this yourself: once `Compute` has been called in a session with Assert Off, the kernel skips that `Assert` on later calls, so the `"Assertions"` handler, `FailedAssertions` and `Trace` see nothing. Reload the file (or start a fresh kernel) before using `FailedAssertions`.

## 6. Problems
- **`FailedAssertions` gave a false negative (0 failures for `Compute[1]`)** because `Compute[1]` had already been called once (plain call, Assert Off) in that session. Reproduced in a fresh wolframscript kernel, so it is the Wolfram 15.0 kernel, not WLJS: after one unhandled call, the `Assert` in a stored definition is skipped on later calls (no handler hit, no `Trace` step), for `Get`-loaded and typed definitions alike, until the definition is reloaded. The mechanism (likely an evaluation cache or an "already evaluated" flag) is my inference, not established. The skill's docs (`FailedAssertions`: "also when Assert is Off") don't mention this. Worth a note in the skill adaptation: run `FailedAssertions` right after (re)loading, before any plain call.
- My first `fresh.wl` had a bracket typo (`ToExpression::sntx`); fixed and rerun.
- `Get` of the file in the shared WLJS kernel created `Global`x`/`Global`y` (pattern and Block variable names). I removed `Global`Compute` and `Global`fwaFile` but left `x` and `y`: they may have existed before or be used by other sessions.
- Did not use `On[Assert]` in the shared WLJS kernel (local rule); the On-Assert evidence comes only from the fresh kernels.
- Two WLJS windows of mine remain open (the notebook and the projected cell), as the rules allow; I closed none.
- No Wolfram server contact: `$AllowInternet` False throughout, and the fresh kernels ran in the network cut.
