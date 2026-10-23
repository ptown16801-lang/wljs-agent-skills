# Run log: wolfram-debugging (2026-10-22)

## 1. Skills used

1. `wolfram-debugging` (local WLJS adaptation). As it instructs, I read `ROUTES.md` and the pinned upstream `wolfram-debugging/SKILL.md`, and grepped the helper package `scripts/WolframDebugging.wl` and `references/HelperFunctions.md`.

## 2. Steps

1. Read `work/FunctionWithAssert.wl` with `cat -A` (read-only). It is 7 lines. Line 1 is blank and line 5 is `Assert[ y > 5];`:
   ```
   Compute[x_] := Block[{y}, y = x^2; Assert[y > 5]; Sin[y]]
   ```
2. **WLJS kernel via `mcp__wljs__kernel_evaluate`** (the route ROUTES.md gives by default). I sent one read-only probe (`$AllowInternet`, `$EvaluationEnvironment`, `$Context`, whether Trace works, `$AssertFunction`, `NameQ` checks). It did not return: "WLJS operation is still pending after 220030 ms".
3. **WLJS kernel via `wljs eval --time 20`** with the same probe: "Timed out after 50000 ms waiting for kernel/evaluate/". `wljs status` showed the server ready, kernel 001 alive and several notebooks from other sessions open. The shared kernel was busy or stuck. The ground rules forbid restarting the app, so I stopped using WLJS.
4. **Fresh kernel via `wolframscript`**, the fallback. I ran it inside the network cut, `timeout -s KILL 180 bwrap --unshare-net --unshare-pid --die-with-parent --dev-bind / / --proc /proc wolframscript -f scratch/probe.wl`, with `$AllowInternet = False` as the first line. A fresh kernel also fits this task: loading the file defines `Global`Compute`, and a private kernel keeps that out of the shared one. The script:
   - loaded the upstream helper package (checked first: it contains no `PacletInstall`) and then the file with `Get`;
   - printed the environment checks: `$AllowInternet` False, environment "Script", Trace works;
   - printed `DownValues[Compute]`;
   - ran `EvaluationData` and `Trace` on `Compute[1]` and `Compute[3]` with assertions in their default state;
   - ran them again after `On[Assert]` (in this throwaway kernel only), using `EvaluationData` and `WolframDebugging`CollectMessages`;
   - ran a scoped `Block[{$AssertFunction = Throw[...]&}, ...]` probe, a boundary table for x = 2, Sqrt[5], 2.3 and 3, and a Real argument.

## 3. Files

- Created `<repo>/tests/runs/2026-10-22/wolfram-debugging/scratch/probe.wl` (the diagnostic script).
- Created `<repo>/tests/runs/2026-10-22/wolfram-debugging/run-log.md` (this file).
- `work/FunctionWithAssert.wl` was not changed (only read).

## 4. WLJS notebook

none

## 5. Answer

**The difference is the `Assert`.** The function computes `y = x^2` and asserts `y > 5`:

| call | y | `y > 5` | result |
|---|---|---|---|
| `Compute[1]` | 1 | False: assertion fails | `Sin[1]` |
| `Compute[3]` | 9 | True: assertion passes | `Sin[9]` |

**What you see depends on whether assertions are on.**

- **Default (assertions off; `$AssertFunction` is unset).**
  - Both calls run cleanly: `Compute[1]` gives `Sin[1]` and `Compute[3]` gives `Sin[9]`.
  - `EvaluationData` shows no messages and `"Success" -> True` for both.
  - `Trace[Compute[1]]` contains no `Assert` evaluation: with assertions off, `Assert` (which holds its argument) is skipped without testing `y > 5`. So the failing check is silently ignored.
- **With `On[Assert]` (`$AssertFunction` becomes `Automatic`).**
  - `Compute[1]` issues `Assert::asrtfl: Assertion y > 5 at line 5 in .../FunctionWithAssert.wl failed.` and `EvaluationData` reports `"Success" -> False`.
  - `CollectMessages` gives the call chain `Compute[1]` → `Block[{y}, y = 1^2; ...]` → `Assert[y > 5, {5, file}]`.
  - `Compute[3]` issues no message (`MessageCount` 0).
- **Even when the assertion fails, `Compute[1]` still returns `Sin[1]`** (0.841…). `Assert` only reports the failure through `$AssertFunction`; it does not stop the function. With a custom handler, `Block[{$AssertFunction = Throw[...]&}, ...]`, `Compute[1]` throws `HoldComplete[Assert[y > 5, {5, file}]]` and `Compute[3]` returns `Sin[9]`.

**Other evidence:**
- `Get` rewrote the definition to `Assert[y > 5, {5, "<file>"}]`, so the message names line 5 of the file.
- Boundary check: the assertion fails exactly when x^2 <= 5, i.e. |x| <= Sqrt[5] ≈ 2.236. It fails for 2 and Sqrt[5] and passes for 2.3 and 3.

**In short:** `Compute[1]` breaks the function's own precondition (`x^2 > 5`) and `Compute[3]` does not. You only see this when assertions are on (`On[Assert]` or a `$AssertFunction`). Even then, `Compute[1]` still returns a value.

## 6. Problems

- **The WLJS kernel did not respond.** `mcp__wljs__kernel_evaluate` was still pending after 220 s, and `wljs eval` timed out after 50 s. The server reported ready and the kernel was shared with other sessions' open notebooks. I did not restart anything (forbidden). My read-only probe may still be queued there and could run later; it changes nothing. As a result, **I could not check `$AssertFunction` in the WLJS kernel itself.** If it is set there (by another session or a startup file), `Compute[1]` would show the message in WLJS by default. Under the default settings measured above it would not.
- **`General::stop` in the last test** ("Further output of Assert::asrtfl will be suppressed"). It appeared on the Real-argument test because a `-f` script keeps one message list for the whole run, and that was the fourth `Assert::asrtfl` in the script. It is not a problem in the file.
- **Uncertain:** the request does not say which "different behavior" the user saw (a message, versus a different value). I covered both: the values differ (`Sin[1]` vs `Sin[9]`), and only `Compute[1]` fails the assertion.
