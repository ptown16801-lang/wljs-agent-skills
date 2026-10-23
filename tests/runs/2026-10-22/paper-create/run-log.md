# Run log: paper-create (2026-10-22)

Request: "Add a LaTeX paper on the Sidon-set bound to this project."
Project: `<repo>/tests/runs/2026-10-22/paper-create/work/project`

## 1. Skills used

1. `paper-create` (local WLJS adaptation), which pointed to `ROUTES.md`, the pinned upstream `paper-create/SKILL.md`, `paper-create-notebook/style.md` and `notebook-create/artifacts.md` (read as references, not loaded as skills).

No other skill was loaded.

## 2. Steps

1. Read `ROUTES.md`, the upstream skill, `style.md`, `artifacts.md`, the upstream `scaffold-paper.sh` and the LaTeX templates before running anything.
2. Surveyed the project. `Research/` held no paper (only `Research/Artifacts/SidonBound_260821.md` / `.nb`, the project's existing notebook on this topic), so step 0's "beside or subfolder" question did not apply. No `Paper/` folder. Project CLAUDE.md: semantic line breaks **on**; no `Scientific journal:` toggle, so the journal is **off**.
3. Ran the upstream `scripts/scaffold-paper.sh --name SidonBound` with every argument given explicitly: operator `ptown16801-lang` and email `<owner-noreply-email>` (from the project's git config), model `Claude Opus 5.5 (claude-opus-5-5)`, freedom `Open exploration`, a one-sentence prompt summary, and the date `22 October 2026`. The script wrote `Research/SidonBound.tex`, `macros.sty`, `references.bib`, `.latexmkrc` and `figures/`. It only copies templates and runs `sed`: nothing was installed or downloaded.
4. Checked the WLJS kernel: `$AllowInternet` False, version 15.0, WLJS kernel. All evaluations ran in the **WLJS kernel via `mcp__wljs__kernel_evaluate`** (the default route; the work is plain computation and needed no isolation, and the coordinator's mid-run rule forbade opening notebooks):
   - Defined the source notebook's functions (`bound`, `sidonQ`, `maxSidon`, `hasSidonK`, `maxSidonBT`). The first attempt used `Begin[...]` inside one input. That did not keep everything local (see Problems). I redefined them under `Block[{$Context = "sidonPaper2610`", $ContextPath = {..., "System`"}}, ToExpression[...]]` and checked that they lived in that private context.
   - Checked the examples: the differences of {0,1,3} in Z_7 are {1,...,6}; `maxSidon[7]` = {3,{0,1,3}}; b(22) = 5; C(21,4) = 5985.
   - Proposition: `maxSidon[n]` attains b(n) for every 2 ≤ n ≤ 21 (including n = 2, which the source left out), and every returned set passes `sidonQ`. `maxSidon[21]` = {5,{0,1,4,14,16}}, `maxSidon[22]` = {4,{0,1,3,7}}.
   - Ruliology: both searches for 2 ≤ n ≤ 40 (direct 16.5 s, backtracking 1.2 s) agree on the whole range, and s(n) < b(n) exactly at n = 22, 32, 33, 34.
   - The retained Mian–Chowla item: `maxSidon[25]` and `maxSidon[26]` both return {0,1,3,7,12}, which is not Sidon in Z_21, while {0,1,4,14,16} is.
   - At the end, removed my private context (`Remove["sidonPaper2610`*"]`) and confirmed `$AllowInternet` is still False.
5. Wrote the paper body into `Research/SidonBound.tex`. The content comes from the project's own `SidonBound_260821.md`, written to `style.md`, with these changes:
   - Theorem 2.5 now states the full counting inequality |A|(|A|−1) ≤ n−1.
   - The integer form is a Corollary with its own proof (the source used a Remark).
   - The proposition is widened to 2 ≤ n ≤ 21.
   - The proof now includes the table of example sets, which the source said were "listed in Ruliology" but never listed. It also shows the 12 differences of {0,1,3,7} mod 22.
   - The Ruliology entry now covers 2 ≤ n ≤ 40 and has a data table. The source said the two searches agree only up to n = 26; I found they agree on the whole range.
   - The banned word "witnesses" is gone.
   - The code is in Appendix A.
   - The three items below the settled tier sit in a terminal "Retained material (no journal)" section, as `remark`s that open with the literal "[ Retained — no journal ]".
   - The source file uses one sentence per line, and `\printbibliography` / the table of contents stay commented out.
6. Added `\cyc`, `\sid` and `\bd` to `Research/macros.sty`, and appended the `Research/**/*.{aux,bbl,bcf,blg,fdb_latexmk,fls,log,out,run.xml,synctex.gz,toc,pdf}` patterns to `.gitignore`.
7. Compiled with the already-installed TinyTeX: `latexmk -pdf -outdir=<scratchpad>`, so no build files went into the project. The first build showed the retained marker parsed as the remark's optional argument, so I fixed it with `{[} ... {]}` and rebuilt. Result: exit 0, 5 pages, no errors, no overfull boxes. I checked all pages visually.
8. Wrote the companion/summary page `Research/Artifacts/SidonBoundPaperComputations_261022.md` (the files added, the recorded kernel results, the code). Converted it with `tools/md2wln.py` to `.wln`, without opening a window, as the coordinator's rule required.

## 3. Files

Created:
- `work/project/Research/SidonBound.tex`
- `work/project/Research/macros.sty`
- `work/project/Research/references.bib` (contains only `% References`)
- `work/project/Research/.latexmkrc`
- `work/project/Research/figures/` (empty directory)
- `work/project/Research/Artifacts/SidonBoundPaperComputations_261022.md`
- `work/project/Research/Artifacts/SidonBoundPaperComputations_261022.wln`
- `tests/runs/2026-10-22/paper-create/run-log.md` (this file)

Changed:
- `work/project/.gitignore` (14 lines appended)

Outside the project (scratch only): the PDF and build files in `<scratch>/sidonbuild/`.

Nothing was committed.

## 4. WLJS notebook

`work/project/Research/Artifacts/SidonBoundPaperComputations_261022.wln` was built from the `.md` with `md2wln.py`. It is unevaluated and was not opened or saved through the app. No notebook was opened with `mcp__wljs__new_notebook`, before or after the coordinator's rule change.

## 5. Answer

I added the paper as `Research/SidonBound.tex`, the first paper in `Research/`, sharing a new `Research/macros.sty` and `references.bib`. It is titled *The counting bound for Sidon sets in cyclic groups, and where it is attained*. The author is Claude Opus 5.5, and the footnote names you as operator, marked **Open exploration**.

It covers:
- the counting bound |A|(|A|−1) ≤ n−1, so s(n) ≤ ⌊(1+√(4n−3))/2⌋, with a complete proof;
- attainment for every 2 ≤ n ≤ 21, with an example set for each n;
- the first failure, s(22) = 4 < 5, settled by a finite enumeration;
- a Ruliology section with s(n) for n ≤ 40 (failures at 22, 32, 33, 34);
- the open question whether the failures are finite in number;
- the code in an appendix.

The material comes from your earlier notebook `Research/Artifacts/SidonBound_260821.md`. I re-ran every computation in the WLJS kernel, and fixed a gap: the example sets the proof promised were never listed, and now they are. It compiles cleanly with `cd Research && latexmk -pdf SidonBound.tex` (5 pages). A summary page with the computations is `Research/Artifacts/SidonBoundPaperComputations_261022.wln`.

**One decision needs you.** Three items fall below the settled tier:
- a hedged claim about n = k²−k+1;
- the dead Mian–Chowla route;
- Singer's theorem, cited without a source read, still marked `[lookup]`.

The scientific journal is off in this project. As the style guide prescribes for an unattended run, I kept them in a marked "Retained material (no journal)" section at the end of the paper. The question I would ask:

> The paper has three items that are not settled results (the hedged k²−k+1 claim, the failed Mian–Chowla attempt, and the unverified Singer's-theorem `[lookup]`). The journal is off. Should I (1) turn the scientific journal on and move them there, (2) keep them in the paper's marked "Retained material" section, or (3) drop them from the paper? They stay in `SidonBound_260821.md` either way.

Two smaller questions:
- Did you want only an empty scaffold rather than the carried-over content?
- Should the footnote name you differently than the git handle `ptown16801-lang` and its noreply email?

## 6. Problems

- **Shared-kernel symbol leak (my mistake, contained):** my first `kernel_evaluate` call wrapped the definitions in `Begin["sidonPaper2610`"] ... End[]`. Because `Global`` stays on `$ContextPath`, the name `sidonQ` resolved to an already-existing `Global`sidonQ` (present before my run, together with `Global`sidonQ$269459`, so probably from another session or an earlier test). That symbol received my definition, which is identical to the source notebook's. I could not see its previous definition, so I may have replaced a different one. I left `Global`sidonQ` as it is (removing it might break whoever created it). My later definitions went into a private context, which I removed at the end. The Module-local names `res`/`ext` are localized and changed nothing global. To avoid this, the adaptation's "keep your symbols local" advice should say that `Begin` alone is not enough when a name already exists in `Global``.
- **Skill text contradicts the machine:** the local adaptation says "No LaTeX or Typst is installed, so no PDF is built". `ROUTES.md`/`DEPENDENCIES.md` say TinyTeX is installed, and it is: `latexmk`, `pdflatex` and `biber` are in `~/.local/bin`. I compiled, to the scratchpad only. The adaptation line looks out of date.
- **Upstream script escaping:** `\_` in the prompt argument lost its backslash through `sed`, so the scaffolded footnote contained a bare `_` (`SidonBound_260821`), which would have broken compilation. I fixed it by hand in the paper (`\texttt{SidonBound\_260821}`). The script's `sed` substitution also breaks on `&` or `|` in titles and prompts.
- **Retained marker:** writing `[ Retained --- no journal ]` directly after `\begin{remark}` makes amsthm read it as the optional note, which renders it in parentheses. I fixed it with `{[}...{]}`. The upstream skill/style guide does not mention this trap on the LaTeX path.
- **LaTeX warnings (harmless):** `aliascnt` reports "package is obsolete" (it comes from the shipped template), and there are rsfs font size substitutions.
- **Tier ruling taken by default:** the style guide asks for the operator's ruling at the tier sort. No one was available, so I applied the prescribed unattended default (retain and report). The guide says the list goes into a work item's `## Hand-off`, but there is no work item for this request, so the list is in this log and in the Answer above.
- **Unsure:**
  - The upstream skill says it "scaffolds and edits; it does not write the paper". I read "a paper on the Sidon-set bound" as a request to fill it with the project's existing Sidon material. That was a judgment call.
  - I widened the proposition to include n = 2 (verified).
  - I did not check the retained hedged claim's value s(43) = 6.
  - `Research/Artifacts/` has no index `README.md`, and I did not create one.
  - The companion `.wln` cells are unevaluated, so the outputs are recorded as prose. Its code, if evaluated, defines its names in the kernel's current context.
- No Wolfram servers were contacted, nothing was installed, published or pushed, and no window or app was opened or closed.
