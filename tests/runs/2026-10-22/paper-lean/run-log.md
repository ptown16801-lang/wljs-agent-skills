# Run log: paper-lean, "Prove in Lean that the sum of the first n odd numbers is n^2" (2026-10-22)

## 1. Skills used

1. `paper-lean` (local WLJS adaptation; it points to `ROUTES.md` and the pinned upstream `paper-lean/SKILL.md`, both read in full, plus the upstream `project-create/assets/formalization_checklist_template.md`).

## 2. Steps

1. Read `ROUTES.md`, the upstream `paper-lean` SKILL.md and the formalization checklist template.
2. Setup check (upstream "Setup check"): `LeanTest/` has `lakefile.toml` (not `lakefile.lean`), toolchain `leanprover/lean4:v4.35.0`, `lake-manifest.json` requires `mathlib` (rev v4.35.0), and `.lake/packages/mathlib/.lake/build/lib/lean/Mathlib.olean` exists. `lean`, `lake`, `elan` are in `~/.local/bin`.
3. Checked for the `lean-lsp` MCP: `ToolSearch` for "lean" found no tools in this session (DEPENDENCIES.md says it is registered for sessions started after Oct 22). Fell back to the command line: `lake env lean <file>` in `LeanTest/`, which uses the already-built local Mathlib and downloads nothing.
4. Lemma search: a temporary file `LeanTest/LeanTest/Probe.lean` with `exact?` on the goal (48 s). Result: `exact?` could not close the goal, so no single Mathlib lemma states it. File deleted.
5. Wrote `LeanTest/LeanTest/OddSum.lean`: `theorem LeanTest.sum_first_n_odd (n : ℕ) : ∑ i ∈ Finset.range n, (2 * i + 1) = n ^ 2`, by induction (`simp`; `rw [sum_range_succ, ih]`; `ring`), an `example` checking n = 10 by `decide`, and `#print axioms`. `lake env lean LeanTest/OddSum.lean`: no errors, no warnings; axioms `[propext, Classical.choice, Quot.sound]`.
6. Printed the goal states with `trace_state` in a scratchpad copy (`<scratchpad>/Goals.lean`, outside the work folder) to report the goals before and after each tactic.
7. Wrote the formalization checklist to `Work/Done/Formalize-SumOfFirstNOdd.md` (finished, so `Done/`).
8. Wrote a summary page `Summary.md` and converted it with `python3 .../tools/md2wln.py Summary.md Summary.wln` (no window).

Wolfram evaluations: none. The proof was checked by Lean; the WLJS summary notebook contains one Wolfram cross-check cell that was written but not evaluated. No Wolfram kernel was used, so no engine applies and `$AllowInternet` was never touched.

## 3. Files

Created:
- `<repo>/tests/runs/2026-10-22/paper-lean/work/LeanTest/LeanTest/OddSum.lean`
- `<repo>/tests/runs/2026-10-22/paper-lean/work/Work/Done/Formalize-SumOfFirstNOdd.md`
- `<repo>/tests/runs/2026-10-22/paper-lean/work/Summary.md`
- `<repo>/tests/runs/2026-10-22/paper-lean/work/Summary.wln`
- `<repo>/tests/runs/2026-10-22/paper-lean/run-log.md` (this file)

Created and deleted: `work/LeanTest/LeanTest/Probe.lean` (the `exact?` probe). Scratch, outside the work folder: `<scratch>/Goals.lean`.
No existing file was changed (`LeanTest.lean` was not edited to import the new module).

## 4. WLJS notebook

`<repo>/tests/runs/2026-10-22/paper-lean/work/Summary.wln` (made with md2wln.py from `Summary.md`; not opened, not evaluated).

## 5. Answer

Proved and checked in Lean 4 (v4.35.0) with Mathlib, in `LeanTest/LeanTest/OddSum.lean`:

```lean
theorem sum_first_n_odd (n : ℕ) : ∑ i ∈ range n, (2 * i + 1) = n ^ 2 := by
  induction n with
  | zero => simp
  | succ k ih =>
    rw [sum_range_succ, ih]
    ring
```

The odd numbers are written as `2 * i + 1` for `i = 0, …, n - 1`.
- Base case. Goal before: `∑ i ∈ range 0, (2 * i + 1) = 0 ^ 2`. `simp` closes it (the empty sum is 0).
- Step. Goal before: `∑ i ∈ range (k + 1), (2 * i + 1) = (k + 1) ^ 2`, with `ih : ∑ i ∈ range k, (2 * i + 1) = k ^ 2`. After `rw [Finset.sum_range_succ, ih]`: `k ^ 2 + (2 * k + 1) = (k + 1) ^ 2`. `ring` closes it.
- Mathlib used: `Finset.sum_range_succ` (a sum over `range (n+1)` splits off its last term) and `Finset.sum_range_zero` (through `simp`). `exact?` found no lemma that proves the statement in one step.
- Check: `lake env lean LeanTest/OddSum.lean` gives no errors or warnings. `#print axioms` lists only `propext`, `Classical.choice`, `Quot.sound` (no `sorryAx`).

The checklist is in `Work/Done/Formalize-SumOfFirstNOdd.md` and the summary notebook is `Summary.wln`.

## 6. Problems

- The `lean-lsp` MCP tools the skill relies on (`lean_goal`, `lean_verify`, the search tools) were not available in this session. I used `lake env lean`, `exact?`, `trace_state` and `#print axioms` instead. These checks are equivalent here, but the MCP path itself was not tested.
- The paper-lean adaptation file says Lean, Mathlib and lean-lsp are "not installed"; ROUTES.md and DEPENDENCIES.md say they were installed on Oct 22. The local installation works, so the adaptation file's test-status note is out of date.
- Upstream says the project must have a `Lean/` folder with `lakefile.lean`. Here it is `LeanTest/` with `lakefile.toml`. I treated that as equivalent.
- Upstream says to walk through the checklist with the user before writing Lean code, and to present proof code and wait (document-revise). No user was available, and the request asked directly for the proof with an unambiguous statement, so I wrote the proof and filled in the checklist afterwards. If the owner wanted the checklist reviewed first, I would ask: "Is the statement `∑ i ∈ Finset.range n, (2 * i + 1) = n ^ 2` over ℕ the one you want (rather than, say, ∑_{i=1}^{n} (2i − 1), or a version over ℤ)?"
- The `exact?` probe took about 48 s. The first `lake env lean` run took about 10 s. No other warnings.
- `OddSum.lean` is not imported from `LeanTest.lean`, so `lake build` does not build it. Check it with `lake env lean LeanTest/OddSum.lean`.
