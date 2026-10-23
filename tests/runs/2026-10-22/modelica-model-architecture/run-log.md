# Run log: modelica-model-architecture, 2026-10-22

Request: "Restructure the ComponentBased examples (copy IntroductoryExamples.ComponentBased here) as a small reusable library with one class per file."

The run had two phases:
- **Phase 1:** stopped at the skill's approval gate with a numbered plan and three questions.
- **Phase 2:** the coordinator sent the scripted user reply:
  1. approved, one-shot;
  2. name it `SimpleCircuits`;
  3. do not copy the Wolfram images, use HTML text and stored plots.

  It also confirmed the reading of "restructure", and asked me to validate every example against the reference results, sampling between whole seconds and checking messages on all three. I then built the library, validated it, and wrote a summary notebook.

## 1. Skills used

In load order:

1. `modelica-model-architecture` (phase 1)
2. `search-modelica-docs`
3. `validate-modelica`
4. `annotate-modelica-graphics`
5. `annotate-modelica-plots`
6. `simulate-modelica`

For each I read the local adaptation, `ROUTES.md` and the pinned upstream `SKILL.md` at `~/.local/share/wolfram-system-modeler-ai-toolkit/991a8000.../<skill>/SKILL.md`.

## 2. Steps

### Phase 1 (before approval)

1. Found the library at `<SystemModeler-install>/15.0/L/IntroductoryExamples` and read every file of `ComponentBased/` (Bash). It was already directory form with one class per file, three flat models.
2. Copied `ComponentBased/` and `Resources/ComponentBased/` unchanged into `work/source/`. A sha256 check found 0 mismatches. I re-checked at the end of the run: the copy and the install are still identical.
3. Recorded reference results. **Engine: WLJS kernel (`mcp__wljs__kernel_evaluate`)**, the default route. `$AllowInternet` was False. `SystemModelSimulate` of the three originals over 10 s, plus a message check (`$MessageList` empty).
4. Wrote the plan and stopped (the skill requires approval before edits).

### Phase 2 (after approval)

5. **Grounded the MSL names** with the skill's offline search (`wsm-toolkit docs --show`, Bash): `SineVoltage` (V, f), `TwoPin`, `OnePort`, `PositivePin`, `SISO`, `Integrator`, `Capacitor`, `Inductor`, `SignalVoltage`, `Feedback`, `Add`, `Sine`, `Gain`.
   - The corpus has no `Modelica.Icons` entries, so I listed `SystemModels["Modelica.Icons.*"]` in the **WLJS kernel** (to confirm `Example`, `ExamplesPackage`, `Information`, `Package` and `InterfacesPackage` exist).
   - From reading `OnePort` I changed the design: the branches extend `TwoPin`, because `OnePort`'s `0 = p.i + n.i` would be wrong once `mid` carries current.
6. **Wrote the library** `work/SimpleCircuits/`:
   - root `package.mo`/`package.order`, opening with GettingStarted, Conventions, Examples
   - `GettingStarted`, `Conventions` (info-only models)
   - `Examples` (`ElectricCircuit`, `BlockCircuit`, `ElectricCircuit2`)
   - `Components` (`RCBranch`, `RLBranch`)
   - `Blocks` (`RCBranchAdmittance`, `RLBranchAdmittance`, built from MSL `Feedback`/`Gain`/`Integrator`)
   - `Interfaces` (`PartialSeriesBranch`)

   Then wrote the test library `work/SimpleCircuitsTests/`: `RCBranchTest`, `RLBranchTest`, `MidpointTest`.
7. **First check, WLJS kernel**: `Import` of `SimpleCircuits/package.mo`, then `SystemModelSimulate` of the three examples. No messages. The comparison with the originals at 11 times (including 0.05, 0.13, 0.37, 1.25, 2.5, 4.75, 7.3, 9.9 s) and on a 0.01 s grid gave these largest differences:
   - `ElectricCircuit`: 0
   - `ElectricCircuit2`: 2.1e-15
   - `BlockCircuit`: 1.4e-12

   I corrected two amplitude statements in the documentation from these results (0.059 A; 0.087 A for `ElectricCircuit2`).
8. **Flatten check, `wsm-toolkit wsm --mode validate`** (fresh WSMKernelX per class, offline). Used for the `messages.warnings` field, which the WLJS route does not show. All 9 library classes passed with no errors, warnings or notifications.
9. **Graphics** (`annotate-modelica-graphics`):
   - `wsm-toolkit schematic --analyze` and a dry run on the library classes. Its layout handles inherited connectors (`TwoPin.p/n`, `SISO.u/y`) as zero-length stubs, and its example layouts overlapped wires. I therefore hand-wrote the icons and diagrams for the library classes:
     - branch icons: resistor, capacitor plates or inductor arcs, `%name` in {64, 64, 64}, `mid` pin on top
     - block icons: "RC"/"RL" and "u -> i" text
     - diagrams for the inner parts of all branches and blocks, and for the three examples
   - The original example icons were kept for `ElectricCircuit` and `BlockCircuit`.
   - For the three tests I ran `wsm-toolkit schematic --annotate --write`.
10. **Plots** (`annotate-modelica-plots`): the `figures=` annotations were written by hand (Mode A, user-specified curves) and checked with `wsm-toolkit figures --analyze`, which reports "HAS figures" for all three examples. I removed `preferred = true` from `ElectricCircuit2`'s own figure, because it also inherits the preferred figure of `ElectricCircuit`.
11. **Re-validation after annotation**, `wsm-toolkit wsm --mode validate`: all 12 instantiable classes pass with 0 errors, 0 warnings, 0 notifications. That is 9 library classes plus the 3 tests (loaded with `--load SimpleCircuits/package.mo`).
12. **Second WLJS-kernel run: failed.** One `kernel_evaluate` (re-import of both libraries, three comparisons, three tests and a mutation run) returned "still pending after 220 s". Every later call, even `1 + 1`, also timed out.
    - `ps`/`top` showed the WLJS kernel (PID 1680320) and the WSM SessionManager/WSMKernelX (PIDs 1724921/1724935) idle at 0 % CPU, so the kernel is blocked, not computing.
    - Under the ground rules I did not Quit or restart anything.
13. **Final validation instead with `wsm-toolkit wsm --mode simulate`** (`simulate-modelica`; fresh WSMKernelX per model, compiled with gcc, offline). I simulated the 3 new examples, the 3 originals and the 3 tests, then compared the `.mat` files with DyMat/numpy in the toolkit venv (`scratchpad/compare.py`).
    - All runs: flatten, build and result Pass.
    - New examples: 0 errors, 0 warnings. Notifications only: states selected, start values used.
    - The originals have 2 warnings each in `ElectricCircuit`/`ElectricCircuit2` and 1 in `BlockCircuit`: "Unbound parameter `sineVoltage1.f` / `sineVoltage1.V`" in `ElectricCircuit`, which the new models avoid by setting V and f.
    - Same largest differences on the 0.01 s grid as step 7, and the same values at all 11 sample times to 10 digits.
    - Tests: all three run to t = 10 s. `RCBranchTest`/`RLBranchTest` `difference` max = 0. `MidpointTest` `balanceError` = 0, `midpointError` max = 1.1e-16, with up to 0.0149 A flowing out through `mid`.
    - Mutation check: `RCBranchTest` with `--override "admittance.R=11"` stops at t = 0.005 s with difference 2.7e-4 > 1e-6, so the assertion does catch a mismatch.
14. Wrote `work/SimpleCircuits-summary.md` and converted it with `python3 tools/md2wln.py` to `work/SimpleCircuits-summary.wln`. It holds prose cells plus 4 unevaluated Wolfram cells that re-run the comparison and plot in WLJS. No window was opened and no notebook was evaluated.

## 3. Files

All under `<repo>/tests/runs/2026-10-22/modelica-model-architecture/`.

Created in `work/`:
- `source/ComponentBased/*` (5 files) and `source/Resources/ComponentBased/*.png` (10 files): unchanged copies
- `SimpleCircuits/package.mo`, `package.order`, `GettingStarted.mo`, `Conventions.mo`
- `SimpleCircuits/Examples/package.mo`, `package.order`, `ElectricCircuit.mo`, `ElectricCircuit2.mo`, `BlockCircuit.mo`
- `SimpleCircuits/Components/package.mo`, `package.order`, `RCBranch.mo`, `RLBranch.mo`
- `SimpleCircuits/Blocks/package.mo`, `package.order`, `RCBranchAdmittance.mo`, `RLBranchAdmittance.mo`
- `SimpleCircuits/Interfaces/package.mo`, `package.order`, `PartialSeriesBranch.mo`
- `SimpleCircuitsTests/package.mo`, `package.order`, `RCBranchTest.mo`, `RLBranchTest.mo`, `MidpointTest.mo`
- `SimpleCircuits-summary.md`, `SimpleCircuits-summary.wln`

Created outside `work/`:
- this run log

Scratch files, kept as evidence, are in the session scratchpad `<tmp>/-home-<user>-Documents-Claude/1984fc22-.../scratchpad/`: `val1/`, `val2/`, `sim/`, `mut/` (toolkit temp dirs and `out.json`), `glyphs.json`, `compare.py`, `copy.sha`.

## 4. WLJS notebook

`work/SimpleCircuits-summary.wln`, converted from `SimpleCircuits-summary.md` with `md2wln.py`. It was not opened and its code cells are unevaluated.

## 5. Answer (what I would tell the user)

The `SimpleCircuits` library is built and checked against the originals: all three examples reproduce them, including between whole seconds, and nothing produces errors or warnings. The library is in `work/SimpleCircuits/`, one class per file. The tests are in `work/SimpleCircuitsTests/`. The unchanged original is in `work/source/`.

**What it contains:**
- **`Components`:** `RCBranch` and `RLBranch`, electrical branches with pins `p`, `n` and a midpoint pin `mid`. Both extend `Interfaces.PartialSeriesBranch` (TwoPin + series resistor + `mid` + current `i`).
- **`Blocks`:** `RCBranchAdmittance` and `RLBranchAdmittance`, the same branches as voltage-in, current-out signal blocks.
- **`Examples`:** the three originals rebuilt from these parts. `ElectricCircuit2` still extends `ElectricCircuit` and adds its capacitor between `rcBranch.mid` and `rlBranch.mid`.
- **`GettingStarted` and `Conventions`:** the circuit, equations and conventions as HTML text; no Wolfram images were copied. Each example has a stored "Output current" figure.

**Checks:**
- All 12 classes validate with no errors and no warnings. The originals had "Unbound parameter" warnings, which are now gone because the source amplitude and frequency are set explicitly.
- Over 0 to 10 s on a 0.01 s grid, the examples match the originals to these largest differences:

  | Example | Largest difference | Value at t = 10 s |
  |---|---|---|
  | `ElectricCircuit` | 0 | -0.0449849 |
  | `ElectricCircuit2` | 2.1e-15 | -0.0480203 |
  | `BlockCircuit` | 1.4e-12 | -0.0449849 |

  Values at in-between times (0.05, 0.13, 0.37, 1.25, 2.5, 4.75, 7.3, 9.9 s) agree to 10 digits.
- The three unit tests pass. A deliberately wrong branch resistance makes `RCBranchTest` fail at once.

**Kernel problem:** the WLJS kernel stopped responding midway (step 12). The final checks were therefore done with System Modeler's own kernel (`wsm-toolkit`). The summary notebook's cells are written but not yet run. The kernel needs a restart: `wljs-server stop`, then `wljs-server desktop`. That closes your open WLJS notebooks, so I did not do it. Shall I?

## 6. Problems

- **WLJS kernel hang (unresolved).** After a combined `kernel_evaluate` call, the kernel stopped answering. Every later call returned "still pending after 220 s", including `1 + 1` with `TimeLimit -> 10`. The kernel and the WSM processes were idle at 0 % CPU.
  - Cause not established. Candidates:
    - the mutation simulation, whose assertion fails and might leave `SystemModelSimulate` waiting on the SessionManager
    - the re-`Import` of an already loaded library
    - interleaved calls from other sessions (several other Wolfram jobs were running on the machine)
  - Not restarted, per the ground rules. The restart needs the owner's OK because it closes open notebooks.
  - Consequence: the final validation used `wsm-toolkit` (WSMKernelX) instead of the default WLJS route, and the summary notebook is unevaluated.
- **Notifications, not warnings:** every model reports "initialization problem is underdetermined ... initialized from their start values" (capacitor voltage, inductor current) and "selected as states". The original does the same. I did not add `fixed = true`, because that could over-determine circuits in which a user connects branches into loops.
- **Test diagrams:** auto-laid-out by `wsm-toolkit schematic`. Some connection lines run across component icons (for example in `MidpointTest`). Cosmetic, not tidied.
- **Diagram geometry not viewed:** the hand-written library diagrams and icons were checked only by flattening, not by looking at them. Under the ground rules I did not open the System Modeler GUI. The flipped placement of `rlBranch` (extent `{{-10, 10}, {10, -10}}` with rotation 270, to put its `mid` pin on the left) should be checked visually.
- **Deviations from the approved plan:**
  - The branch base extends `TwoPin`, not `OnePort` (step 5).
  - There is no `Icons` subpackage: MSL `Modelica.Icons.*` bases are used instead.
  - `ElectricCircuit2`'s own figure is not marked preferred (it inherits a preferred one).
  - The `Blocks` hide their internal gains and integrators as `protected`, so they do not appear in results or plots.
- **Plot annotations written by hand:** `wsm-toolkit figures` was used only for `--analyze`, not to generate the annotations. No `.sim`-based protected-variable check was run on the curves. All curves use public variables (`sineVoltage.i`, `sourceCurrent.y`).
- **Platforms:** Linux tested only. Mac and Windows are stated as "expected", not tested.
- No Wolfram server was contacted. `$AllowInternet` was False when last readable. Nothing was installed, no window was opened, and the installed library is unchanged.
