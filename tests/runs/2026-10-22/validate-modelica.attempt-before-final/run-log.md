# Run log: validate-modelica (2026-10-22)

## 1. Skills used
1. validate-modelica (local WLJS adaptation; it points to `ROUTES.md` and the pinned upstream
   `wolfram-system-modeler-ai-toolkit/991a800.../validate-modelica/SKILL.md`, both read in full)

## 2. Steps
1. Read `ROUTES.md` and the pinned upstream SKILL.md. Listed the work folder and read both models:
   - `ExampleModel.mo`: `model ExampleModel`, two states, `der(x) = -x; der(y) = y + x;`, plus graphics annotations.
   - `Broken.mo`: `model Broken`, the same model, but line 6 is `der(y) = y + z;`, and `z` is never declared.
2. **WLJS kernel via `mcp__wljs__kernel_evaluate`**: the adaptation names it as the default engine.
   For each file I ran `Import["/abs/<file>.mo"]` and then `SystemModelSimulate[model, 1]` (a full build
   and a 1 s simulation, with a 60 s `TimeConstrained`), and recorded `$MessageList` for each step.
   `$AllowInternet` was `False`.
   - My first attempt put `Begin["test`validateModelica`"]` inside a single compound expression. The
     whole input is parsed before `Begin` runs, so one symbol (`Global`dir`) was created in `Global``
     and its returned value printed as an unevaluated symbol. I re-ran the check as one self-contained
     `Module` with no global state. Results:
     - ExampleModel: Import gave `SystemModel["ExampleModel"]` with no messages. Simulation returned
       `SystemModelSimulationData` with no messages. At t = 1: x = 0.367879, y = 3.893483. These match
       the analytic solution: x = e^-1 = 0.367879, and y = 1.5e − 0.5/e = 3.893483.
     - Broken: Import gave `SystemModel["Broken"]` with no messages, because Import only parses.
       The simulation failed, returning `SystemModelSimulate` unevaluated, with
       `SystemModelSimulate::bld` "Failed to build model Broken." and `SystemModelSimulate::bldl`
       "Error: Element not found. When looking up 'z' in scope 'Broken', 'z' was not found in 'Broken'."
3. **`wsm-toolkit wsm --mode validate`** (the pinned System Modeler toolkit launcher with WSMKernelX 15.0,
   a separate kernel process). The upstream skill's check is a flatten, and this toolkit is the tool for
   it, so I ran it as a second check. I used a fresh `--tempdir` for each model in the session scratchpad,
   not next to the `.mo` files, so the work folder stayed unchanged. Results are from `validate.out.json`
   (`[0].status`):
   - ExampleModel: `status.flatten = "Pass"`, no errors, no warnings, no notifications. The flat model is
     the two equations.
   - Broken: `status.flatten = "Fail"`, with one error: type LOOKUP, id 20004, location 6:3,
     "Element not found. When looking up `z` in scope `Broken`, `z` was not found in `Broken`."
4. Cleanup: removed the toolkit temp directories, `Remove["test`validateModelica`*"]`, and removed
   `Global`dir` (its value was my work-folder path, so it was mine). Confirmed `$AllowInternet` was still `False`.

## 3. Files
- Created: `<repo>/tests/runs/2026-10-22/validate-modelica/run-log.md` (this file)
- Temporary, created and then deleted: `<scratchpad>/wsm_validate_ExampleModel/`, `<scratchpad>/wsm_validate_Broken/`
- The model files were not changed.

## 4. WLJS notebook
none. The request is a yes/no compile check, and the run rules forbid opening notebook windows.

## 5. Answer
- **ExampleModel.mo compiles.** It flattens with no errors or warnings (System Modeler toolkit), and it
  builds and simulates in the WLJS kernel. At t = 1, x = 0.3679 and y = 3.8935, which match the exact
  solution.
- **Broken.mo does not compile.** Line 6, `der(y) = y + z;`, uses a variable `z` that is not declared.
  The error is "Element not found. When looking up `z` in scope `Broken`". The flatten fails, and so does
  the build. To fix it, declare `z` (with an equation that defines it), or replace it with the variable
  you meant. If you meant `x`, the model becomes the same as ExampleModel.

## 6. Problems
- `Import` of Broken.mo succeeds without any message, because it only parses. The error appears only at
  flatten or build time. A successful `Import` alone does not show that a model is valid.
- Shared-kernel context: the first evaluation's `Begin[...]` inside one compound input did not scope the
  symbols created at parse time (`Global`dir` was created; it is removed now). Before my run, the
  kernel's `$Context` was `testModelicaSweep``, which another session had left open. During the run it
  changed to `Global`` without any action of mine. I did not touch either. `Global`res`, `Global`msgs`
  and `Global`r` exist in the kernel. I could not confirm they were mine (`Global`r` clearly belongs to
  another session), so I left them in place.
- The `wsm-toolkit` shell exit codes I saw were those of `tail` in a pipe. I relied on the JSON status fields instead.
- The toolkit reported "MSL None", which is correct: neither model uses the Modelica Standard Library.
