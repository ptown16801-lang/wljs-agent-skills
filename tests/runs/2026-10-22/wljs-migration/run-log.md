# Run log: wljs-migration (2026-10-22)

## 1. Skills used
1. `wljs-migration` (local WLJS adaptation). As it says, I read `ROUTES.md` and the pinned upstream guide `.../wljs-api/mcp/dist/skills/migration.md` in full.

## 2. Steps
1. Read `ROUTES.md` and the upstream migration guide. The guide's Manipulate/Dynamic rules don't apply here because the source contains no dynamic code.
2. **Inspected the source** `work/ExampleTestFile.nb`. Engine: a fresh kernel via `wolframscript` (`scratch/dump.wls`, run under `bwrap --unshare-net`, `timeout 120`, `$AllowInternet = False` first). I used a fresh kernel because ROUTES.md says to read Mathematica `.nb` files there, not in the WLJS kernel, which redefines `Cell`/`Notebook` and similar symbols. Result: an **MUnit testing notebook** (StyleDefinitions MUnit.nb, created with Mathematica 13.2) with 31 cells:
   - one Title and two Sections
   - 8 tests, each made of `VerificationTest` + `ExpectedOutput` cells, 4 of them with a `TestOptions` cell
   - 8 `BottomCell` MUnit button bars (front-end controls only)
3. **Tried a baseline with `TestReport` on a copy of the .nb.** Engine: a fresh kernel via `wolframscript` (inside the network cut). It failed with `FrontEndObject::notavail` and `TestReport::rnterr` ("Invalid VerificationTest Options"), because reading MUnit .nb tests needs a front end. Following ROUTES.md (front-end calls in the network cut can hang), I did not retry with a front end. I deleted the copy.
4. **Baseline as a `.wlt`.** Engine: a fresh kernel via `wolframscript` (inside the network cut). I wrote the 8 tests to `scratch/wlt/ExampleTestFile.wlt` and ran `TestReport` on it. Result: 4 passed and 4 failed:
   - pass: Expand, RandomInteger/MatchQ, myTestID, `$TestFileName`
   - fail: `Sin[E] < Cos[E]` gives False; `1/0` raises `Power::infy` (MessagesFailure); the 0.01 kB MemoryConstraint is exceeded; the 1 s TimeConstraint on Simplify is exceeded
5. **Checked the WLJS kernel state.** Engine: WLJS kernel via `mcp__wljs__kernel_evaluate`. I did this because the kernel is shared and could hold values that change the test results. `$AllowInternet` is False; `x`, `y`, `z`, `t` have no values; `$TestFileName` is `""`.
6. **Built the WLJS notebook.** Tools: `mcp__wljs__new_notebook` (notebook 076), then `add_cells_batch` with 13 cells:
   - `.md` title
   - `.md` conversion note
   - 8 `VerificationTest[input, expected, options]` cells, with the "Options" and "Additional Examples" `.md` headings in their original places
   - a `NotebookSave` cell
   Each MUnit test became one `VerificationTest` call: ExpectedOutput is the 2nd argument and TestOptions become options. Option names are kept exactly as written, including the string `"MemoryConstraint"`. The MUnit button bars were dropped.
7. **Evaluated every cell.** Engine: WLJS kernel via `mcp__wljs__evaluate_cell`, because the result must be visible to the owner. Outcomes, read with `read_content`, match the baseline for 7 of 8 tests. The `$TestFileName` test fails in the notebook, as expected: `$TestFileName` is set only by `TestReport[file]`. A `.md` note above that test explains this.
8. **Saved** by evaluating `NotebookSave[EvaluationNotebook[], ".../work/ExampleTestFile.wln"]` in the last cell (WLJS kernel). I checked the file on disk: all 13 inputs and their outputs are present.
9. **Visual check.** I ran `tools/capture-wljs-windows.sh` (`scratch/cap`, `scratch/cap2`). My window is `llm-4ca.wln`. It shows the title, the note and the tests with WLJS's `TestObject` summary boxes ("Outcome: Success/Failure", "Test ID"). No dialog appeared after saving.

## 3. Files
- Created: `<repo>/tests/runs/2026-10-22/wljs-migration/work/ExampleTestFile.wln`
- Created (scratch): `.../wljs-migration/scratch/dump.wls`, `scratch/dump.txt`, `scratch/baseline.wls`, `scratch/wlt/ExampleTestFile.wlt`, `scratch/cap/*.png`, `scratch/cap2/*.png`
- Created and then deleted (scratch): `scratch/baseline-ExampleTestFile.nb`, a copy of the source
- Created: this run log
- Unchanged: `work/ExampleTestFile.nb` (still dated Oct 1)

## 4. WLJS notebook
`<repo>/tests/runs/2026-10-22/wljs-migration/work/ExampleTestFile.wln` (left open in WLJS; its window title is the temporary name `llm-4ca.wln`)

## 5. Answer
I converted `ExampleTestFile.nb` to `ExampleTestFile.wln` in the same folder. The original was not changed.

The `.nb` is an MUnit test notebook. In WLJS:
- the title and the "Options" and "Additional Examples" sections are Markdown cells
- each of the 8 tests is one `VerificationTest[input, expected, options]` cell, with the test options (SameTest, MemoryConstraint, TestID, TimeConstraint) kept exactly as written
- the MUnit "Add Messages / Add Options / ..." button bars were left out, because they are Mathematica front-end controls with no WLJS equivalent

Every cell has been evaluated, so each test shows its result.

**Results.** 4 tests pass and 4 fail. A clean Mathematica kernel gives the same results for the same tests (run as a `.wlt`), except for one test (see the last point). The failures are in the original tests, not caused by the conversion:
- `Sin[E] < Cos[E]` is False.
- `1/0` raises a `Power::infy` message that the test does not expect.
- `Range[10]` exceeds the 0.01 kB memory limit.
- `Simplify[...]` exceeds the 1-second time limit.
- `FileBaseName[$TestFileName]` passes when the tests run from a file with `TestReport`, but fails inside the notebook, where `$TestFileName` is empty. A note in the notebook says so.

If you want a version that runs as a test suite (for example with `TestReport`), I can write the same tests to a `.wlt` file.

## 6. Problems
- Running `TestReport` on the original `.nb` in a fresh kernel without a front end failed (`FrontEndObject::notavail`, `TestReport::rnterr`). I did not test the original with a front end, so the baseline is a `.wlt` of the tests as I read them from the `.nb`, not MUnit's own run of the notebook.
- In the test notebook the `$TestFileName` test always fails because of the notebook context. I kept it unchanged so the conversion stays faithful.
- `"MemoryConstraint"` is a string option name in the original. VerificationTest accepted it; it shows as `MemoryConstraint -> Quantity[1/100, "Kilobytes"]` in the result.
- The RandomInteger test passes by pattern, so its actual value changes from run to run. The Simplify test depends on machine speed (1 s limit), so it could pass on a faster machine.
- Visual details: the `>` blockquote in the note renders as a plain paragraph. WLJS shows Markdown sources above their rendered output. The TestObject summary boxes have a small, mostly blank icon. Only the top of the notebook was captured; I checked the lower cells' outputs with `read_content`, not by screenshot.
- The saved file's header contains `HaveToSaveAs: true`, which WLJS writes itself. I don't know whether it matters.
- A new "Application" window (`0x1400097`) appeared between the two captures. I did not open it (I did not use `project_cell`); it belongs to another session.
