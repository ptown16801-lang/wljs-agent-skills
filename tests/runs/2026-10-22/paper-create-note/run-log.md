# Run log: paper-create-note, "largest Sidon subset of {1..n} for n = 1..20"

## 1. Skills used

1. `paper-create-note` (local WLJS adaptation), which pointed to `ROUTES.md`, the pinned upstream `skills/paper-create-note/SKILL.md`, `skills/notebook-create/artifacts.md` and the "Document provenance" section of `skills/project-provenance/SKILL.md` (read as references, not loaded as skills).

## 2. Steps

1. Read `ROUTES.md`, the upstream skill and its references; looked at the fixture project (`work/project`). `Research/Artifacts/` held `SidonBound_260821.md/.nb`, which is about Sidon sets in the cyclic group Z_n, a different question, so I treated this as a new artifact rather than a revisit and archived nothing. No `README.md` index existed; I created one.
2. Fixed the stem `LargestSidonSubsetsUpToTwenty_261022` and the freedom level **Directed** (the operator fixed the object and the range; the method, proofs and layout are the model's).
3. Wrote the seven shipping definitions (`sidonNumber`, `largestSidonSets`, `sidonSets`, `extensions`, `sidonQ`, `countingBound`, `bruteSidonSets`) to a scratch file and loaded them into the **WLJS kernel via `mcp__wljs__kernel_evaluate`**, with every name rewritten into a private context `sidonNote261022`` (shared kernel: no Global definitions, no `$Context` changes). Engine: the WLJS kernel, because it is the default route. Computed there:
   - s(n), the counting bound, the number of Sidon subsets, the number of largest ones, and the first largest set, for n = 1..20;
   - the growing search compared with the full 2^n-subset search for every n ≤ 20 (identical after sorting; 17..20 took 36 s);
   - the sum definition compared with the difference test on all 2^14 subsets of {1..14} (agree);
   - mirror-closure of the largest sets, thresholds 1, 2, 4, 7, 12, 18, failures of the bound {11, 16, 17};
   - the difference lists of the witnesses W3..W6; all largest sets at n = 4, 7, 12, 18; 0 of the 462 five-subsets of {1..11} and 0 of the 12376 six-subsets of {1..17} are Sidon.
   At the end I ran `Remove["sidonNote261022`*"]`; `$AllowInternet` was `False` in that kernel.
4. Wrote the notebook source `.md` (21 code cells) and extracted the `.wl` from its first seven fences, verbatim.
5. Ran the `.wl` plus all 14 demonstration cells in a **fresh kernel via `wolframscript`** (`timeout 300 bwrap --unshare-net ... wolframscript -f scratch/runall.wls`, `$AllowInternet = False` first). This was a bare-kernel check that the shipped files work without the WLJS session. All cells gave the expected values, with no messages (`$MessageList` = {}); the slowest cell (brute check for 17..20) took 37.8 s. My first run of the harness printed `DownValues::sym` messages, but those came from my diagnostic line, not from the shipped code; I fixed the line and ran again cleanly.
6. Checked that the `.wl` loads in a bare kernel via **`wolfram-direct`** (`WolframLanguageEvaluator`), as the adaptation requires: `sidonNumber /@ Range[20]` and `countingBound /@ Range[20]` returned the expected values, `$MessageList` = {}.
7. Built the `.wln` with `tools/md2wln.py`. Cell census: 42 Input records (21 code + 21 hidden `.md` inputs) and 21 Output records, all `Display: markdown` (rendered prose). No evaluated code outputs.
8. Wrote the `.tex` (shared counter, `xcolor` before `hyperref`, a disclosure footnote; no abstract or prose outside environments). Compiled with TinyTeX `pdflatex` twice. The first log had `hyperref` "Token not allowed in a PDF string" warnings from math in the title and headings; I fixed them with `\texorpdfstring`. After that the log had no errors, no undefined references and no overfull boxes; the PDF is 6 pages. I looked at the pages as PNG (`pdftoppm`) and deleted the build litter. TinyTeX generated `tcrm` fonts locally with `mktexpk` (METAFONT, nothing downloaded).
9. Wrote `Research/Artifacts/README.md` (the index, with rows for both artifacts) and `<stem>.provenance.md` (the first Request).
10. **WLJS notebook (visible):** `mcp__wljs__new_notebook` (id 004), with a `.md` summary cell, a `Module`-wrapped cell that recomputes the catalogue table with local definitions only, and a `NotebookSave` cell. I evaluated all three. Engine: the WLJS kernel. The table matches step 3. I captured the windows with `capture-wljs-windows.sh` (my window is `llm-dee.wln`) and projected the table cell (`mcp__wljs__project_cell`, window "Application") to check that the Grid renders.
11. Made a local git commit `7d4167b` in the fixture repo: `.tex`, `.md`, `.wl`, `.provenance.md`, `README.md`, staged by name. Nothing pushed.

## 3. Files

Created in `work/project/Research/Artifacts/`:
- `LargestSidonSubsetsUpToTwenty_261022.tex`
- `LargestSidonSubsetsUpToTwenty_261022.pdf`
- `LargestSidonSubsetsUpToTwenty_261022.md`
- `LargestSidonSubsetsUpToTwenty_261022.wln` (generated, unevaluated, not committed)
- `LargestSidonSubsetsUpToTwenty_261022.wl`
- `LargestSidonSubsetsUpToTwenty_261022.provenance.md`
- `LargestSidonSubsetsUpToTwenty_261022.summary.wln` (the saved WLJS summary page, not committed)
- `README.md` (new index)

Git: commit `7d4167b` in `work/project` (local only).

Scratch (`tests/runs/2026-10-22/paper-create-note/scratch/`): `draft.wl`, `cells.txt`, `runall.wls`, `runall.out`, `runall2.out`, `wd.json`, `pg-1..6.png`, `cap/`, `cap2/`.

This log: `tests/runs/2026-10-22/paper-create-note/run-log.md`.

## 4. WLJS notebook

`<repo>/tests/runs/2026-10-22/paper-create-note/work/project/Research/Artifacts/LargestSidonSubsetsUpToTwenty_261022.summary.wln` (open as window `llm-dee.wln`, plus a projected "Application" window holding the table). The note's own notebook, `LargestSidonSubsetsUpToTwenty_261022.wln`, was built with `md2wln.py` and was not opened.

## 5. Answer

The research note is in `work/project/Research/Artifacts/`, stem `LargestSidonSubsetsUpToTwenty_261022` (`.tex`/`.pdf` 6 pages, `.md`/`.wln` notebook with 21 unevaluated code cells, `.wl` definitions, index row, provenance). Nothing was uploaded.

| n | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| s(n) | 1 | 2 | 2 | 3 | 3 | 3 | 4 | 4 | 4 | 4 | 4 | 5 | 5 | 5 | 5 | 5 | 5 | 6 | 6 | 6 |
| largest sets | 1 | 1 | 3 | 2 | 6 | 14 | 2 | 10 | 26 | 60 | 110 | 4 | 22 | 68 | 156 | 320 | 584 | 8 | 24 | 80 |

- Example largest sets: {1,2,4} (n=4), {1,2,5,7} (n=7), {1,2,5,10,12} (n=12), {1,2,5,11,13,18} (n=18).
- The size first reaches k = 1..6 at n = 1, 2, 4, 7, 12, 18.
- The counting bound floor((1+sqrt(8n-7))/2) is reached for every n ≤ 20 except n = 11, 16 and 17, where it misses by one.
- Proved by hand: every value except the upper bound s(16), s(17) ≤ 5, using witnesses, the counting bound and a parity argument at n = 11. The bound at n = 16, 17 rests on an exhaustive search (none of the 12376 six-subsets of {1..17} is Sidon) and is marked as a measured observation.
- Every count was checked against a full search over all 2^n subsets.

**Left unproved by hand:** s(16) ≤ 5 and s(17) ≤ 5 (Observation 3.4), and the counts of Sidon sets and of largest sets (Observations 2.4 and 4.1). Nothing is claimed for n > 20.

## 6. Problems

- **Deviations from upstream (by the local adaptation):** there is a `.wln` instead of a Mathematica `.nb`. Computation ran on the WLJS kernel, `wolframscript` and `wolfram-direct`, not on the Wolfram MCP. The upstream `.nb` census in the kernel was replaced by a record census of the `.wln` file.
- The `.pdf` is not committed because the fixture's `.gitignore` ignores `*.pdf`, which conflicts with the convention's "every file of the stem is tracked". I did not force-add it.
- The upstream skill says to commit version 1, while the general harness guidance says to commit only when asked. I followed the skill and made one local commit, with a one-off `-c user.name/user.email` identity. It is easy to undo (`git reset --soft HEAD~1`).
- The footnote names the operator as "the project owner", since no name was given. The freedom level "Directed" is my judgement.
- Kept the summary page `.summary.wln` beside the stem in `Research/Artifacts/`. Its placement is my choice; the convention does not name such a file.
- The projected "Application" window and my notebook window remain open, because there is no close tool and I did not close anything else. A capture also showed other sessions' notebooks (`llm-d24.wln`, `llm-2bf.wln`), which I left untouched.
- First fresh-kernel harness run: `DownValues::sym` messages from my own diagnostic line (not the shipped code); fixed and rerun clean. `hyperref` PDF-string warnings fixed. No other warnings.
- No WLJS call was slow (longest about 36 s); no hangs.
