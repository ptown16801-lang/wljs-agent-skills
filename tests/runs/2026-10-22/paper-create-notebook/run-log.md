# Run log: paper-create-notebook, 2026-10-22

## 1. Skills used

1. `paper-create-notebook` (local WLJS adaptation). Following it, I read `ROUTES.md`, the pinned upstream `SKILL.md` and `style.md`, `notebook-create/artifacts.md`, the `paper-journal` toggle section, and `project-provenance` § Document provenance.

No other skill was loaded. I read the WLJS bundled guide `markdown.md` as a file, not as a skill.

## 2. Steps

1. **Read the source material.** I read `work/project/Research/Artifacts/SidonBound_260821.md`, the earlier Sidon-bound paper and the only "Sidon-bound result" in the project, along with the project `CLAUDE.md`, `Wiki/Status.md` and `Work/README.md`. The journal is off: `CLAUDE.md` has no `Scientific journal: on` line and there is no `Journal/` folder. Prompt tracking is also off.
2. **Checked the mathematics** in the WLJS kernel (`mcp__wljs__kernel_evaluate`, all code inside `Module`, `$AllowInternet` confirmed `False`). This was computation the user does not need to see.
   - A backtracking search for 2 ≤ n ≤ 40 gives s(n) = b(n) except at n = 22, 32, 33, 34, as the old paper said.
   - Direct enumeration agrees with it for 2 ≤ n ≤ 26.
   - {0,1,4,14,16} is a Sidon set in Z_21, {0,1,3,7} is one in Z_22, and {0,1,3,7,12} is not one in Z_21.
   - The first lexicographic maximum set at n = 25 and n = 26 is {0,1,3,7,12}.
   - For the retained claim: s(43) = 6 (no 7-set), and s(31) = 6.
3. **Found a gap in the old paper and a stronger result.**
   - The gap: the old proof of `Prop:First` said "the nineteen sets are listed in Ruliology", but they were not listed.
   - The stronger result: a parity argument proves s(22) < b(22) by hand, and the argument extends. At n = k²−k+2 a Sidon set of size k would have difference set exactly Z_n∖{0, n/2}. Counting odd differences then forces (e−o)² = k (when k ≡ 0,1 mod 4) or k−2 (when k ≡ 2,3 mod 4). So s(n) < b(n) whenever that number is not a perfect square. This holds for every k ≡ 5 or 7 (mod 8), so infinitely many n fail.
   - This answers the old paper's open question (`Q:Finite`, "is the set of failures finite?"): no.
   - Kernel checks that agree with the theorem: no 7-set in Z_44 (3 s) and no 8-set in Z_58 (36 s). The case the theorem does not reach, k = 9 (n = 74), did not finish in 90 s.
4. **Sorted by tier** (style.md). Everything settled went into the body. The experiments went into *Ruliology*. Three items are below the settled tier: the hedged prime-power claim, the failed Mian–Chowla route, and the unresolved Singer `[lookup]`. With the journal off, the rule is to stop and ask the operator. The earlier version records the operator's ruling "retain" (option 2) for exactly these three items, and the skill's rule for runs with no one to ask is also "retain and report". So I kept them in a marked *Retained material (no journal)* block and put the question below (§5).
5. **Wrote the source** `Research/Artifacts/SidonBoundFailsInfinitelyOften_261022.md` in house Markdown, with semantic line breaks. It has a head, abstract, introduction, three mathematical sections, Ruliology, Outlook, the retained block and Initialization.
   - Statements: two Definitions, `Thm:Bound`, `Lem:Ruler`, `Prop:Small`, `Thm:Parity`, `Cor:Infinite`, and one Question (`Q:Silent`).
   - Each statement has one example. Proofs are complete prose.
   - The positive half (2 ≤ n ≤ 21) is now proved by hand with `Lem:Ruler` and three explicit integer sets, plus the explicit n = 21 set.
6. **Built the live WLJS notebook** (WLJS kernel via `mcp__wljs__*`) and evaluated every cell, `.md` cells included:
   - `new_notebook` (id 008) and `add_cells_batch`, giving 47 cells plus one save cell.
   - I evaluated the Initialization cell before *Ruliology*, since the Ruliology calls need its functions.
   - Long cells were run with `TimeLimit`. The first try of the `{hasSidonK[44,7], hasSidonK[58,8]}` cell returned `$Aborted`. A re-evaluation with `TimeLimit -> 200` gave `{False, False}`.
   - All outputs match the text. There were no messages.
   - The Initialization helpers live in the context ``SidonPaper` ``. I removed them with `Remove["SidonPaper`*"]` (via `kernel_evaluate`) after saving.
7. **Checked the rendering.** I took screenshots with `tools/capture-wljs-windows.sh` and projected cells with `mcp__wljs__project_cell`. The head cell, KaTeX (`\{…\}`, `\setminus`, primes, display math) and the long parity proof all render correctly. The 21-gon picture was clipped at the edges, so I added `PlotRange -> 1.1`, re-evaluated and checked it again.
8. **Saved** by evaluating `NotebookSave[EvaluationNotebook[], ".../Research/Artifacts/SidonBoundFailsInfinitelyOften_261022.wln"]` in a final cell of the notebook. The saved file has 48 input cells and every expected output.
9. **Folder conventions.** I moved the earlier artifact (`SidonBound_260821.md` and `.nb`) to `Research/Artifacts/Archive/` with `git mv`. I wrote the `Artifacts/README.md` index and `<stem>.provenance.md`. I committed version 1 locally (`4342c1b`): the `.md`, the provenance file, the index and the archive move. The `.wln` was not committed, following the generated-notebook rule. Nothing was pushed.
10. **Skipped:**
    - The MarkdownToNotebook/MathNotebook `.nb` build: the adaptation says WLJS `.wln`, and an `.nb` is made only when the owner wants one.
    - Wolfram Cloud deployment and the README cloud-link row: forbidden by the owner rule against contacting Wolfram's servers.
    - The fingerprint stamp: it belongs to the `.nb` path.

Every Wolfram evaluation in this run used the WLJS kernel through `mcp__wljs__kernel_evaluate` or `mcp__wljs__evaluate_cell`. No `wolframscript`, `wolfram-direct` or `wsm-toolkit` was used.

## 3. Files

Created:
- `work/project/Research/Artifacts/SidonBoundFailsInfinitelyOften_261022.md` (source)
- `work/project/Research/Artifacts/SidonBoundFailsInfinitelyOften_261022.wln` (evaluated WLJS notebook)
- `work/project/Research/Artifacts/SidonBoundFailsInfinitelyOften_261022.provenance.md`
- `work/project/Research/Artifacts/README.md` (index)

Moved:
- `work/project/Research/Artifacts/SidonBound_260821.{md,nb}` → `work/project/Research/Artifacts/Archive/`

Git: one local commit `4342c1b` in `work/project`.

Scratch (temporary):
- `scratch/split.py`
- `scratch/cells.json`
- `scratch/cap/*.png` (screenshots)

This log: `run-log.md`.

## 4. WLJS notebook

`<repo>/tests/runs/2026-10-22/paper-create-notebook/work/project/Research/Artifacts/SidonBoundFailsInfinitelyOften_261022.wln` (open in WLJS as notebook 008, window titled `llm-d24.wln`).

## 5. Answer

The Sidon-bound paper is written up as a WLJS research notebook: `Research/Artifacts/SidonBoundFailsInfinitelyOften_261022.wln`. Its source is the `.md` beside it, and it is open on your second monitor. Every example and experiment was evaluated in the notebook with no messages.

What it proves:
- **The bound.** s(n) ≤ b(n) = ⌊(1+√(4n−3))/2⌋, by counting differences.
- **Attained for 2 ≤ n ≤ 21.** The proof is now by hand: three integer sets with distinct differences ({0,1}, {0,1,3}, {0,1,4,6}) are Sidon sets modulo every n ≥ 2L+1, plus the explicit set {0,1,4,14,16} for n = 21. The old version pointed to a list of sets in *Ruliology* that was never there.
- **New: the bound fails for infinitely many n.** At n = k²−k+2, a Sidon set of size k would have to use every difference except 0 and n/2. Counting odd differences then forces k (if k ≡ 0,1 mod 4) or k−2 (if k ≡ 2,3 mod 4) to be a perfect square. So the bound fails for every k ≡ 5 or 7 (mod 8), and the least failure is n = 22, with s(22) = 4. This replaces the computer search for n = 22 with a proof. It also answers the old paper's open question "is the set of failures finite?": no. I have not checked whether this argument is already in the literature on cyclic difference sets.
- **Experiments.** The *Ruliology* section reproduces the search over 2 ≤ n ≤ 40 (failures at 22, 32, 33, 34). It also checks n = 44 and n = 58 against the new theorem.
- **Open question.** For which k that the theorem does not cover does Z_{k²−k+2} have a Sidon set of size k? Yes for k = 3 and 4, no for k = 6, and k = 9 (n = 74) is the first open case.

Three questions for you:
1. **The retained material.** Three items are not settled: the prime-power claim, the failed Mian–Chowla route, and the unread Singer citation. The journal is off, so the paper should not hold them as content. I kept them in a marked "Retained material (no journal)" block at the end, as you ruled for the earlier version. Should I keep them, turn the journal on and move them there, or drop them?
2. **The new result.** The paper now goes beyond the original result, since the parity theorem answers its open question. Do you want that in this paper? I could instead keep the original scope and put the parity result in a separate artifact.
3. **The operator line.** The footnote says the operator is "not named in this session", with the freedom label **Open exploration**. What name should it carry? The earlier version named Pavel Hájek as operator.

## 6. Problems

- **Retained block kept without a fresh ruling.** style.md requires the operator to rule on the material below the settled tier, once per document and before the build. Nobody was available to ask, so I applied the earlier version's ruling (retain) and the skill's rule for runs with no one to ask. In the third retained remark I removed the clause saying `Q:Finite` "leans on" Singer's theorem, because `Q:Finite` no longer exists. The rest of the retained text is unchanged.
- **Scope.** The parity theorem, the corollary that infinitely many n fail, `Lem:Ruler`, and the new question `Q:Silent` were not in the source. I added them because style.md says to state each result at the generality its proof reaches, and the hand proof for n = 22 reaches the whole family. Possibly more than the user wanted (question 2 above). The theorem has not been compared with the literature; the paper says so.
- **Numbering and references.** Statement numbers, `{#Tag}` labels and `[Tag]` references are not resolved in WLJS; they show as typed, as the adaptation notes. That needs Mathematica's front end and the MathNotebook paclet, which was not available and would need a download from a personal Wolfram Cloud URL.
- **Code is not folded.** Upstream hides the code with a `{2}` group state, and WLJS has no equivalent through the MCP tools, so example code cells show their input. Every example is 1–3 lines.
- **Initialization order.** The Initialization section is last, as upstream requires. WLJS does not run initialization cells on open, so a reader re-running *Ruliology* must evaluate the Initialization cell first. The Examples are self-contained and do not need it.
- **Save cell.** The `NotebookSave` call is the last input cell of the saved notebook, because saving needs a cell in that notebook. Its output was not yet written when the file was saved.
- **Cell timeout.** The first evaluation of the `hasSidonK[58, 8]` cell returned `$Aborted`, even with `TimeLimit -> 180`, probably because the shared kernel was busy. The retry succeeded. The "about 3 and 36 seconds" timings in the text come from a separate `kernel_evaluate` run.
- **Windows I opened.** Four "Application" projection windows from `mcp__wljs__project_cell` (cells 013, 021 twice, 040) are still open on the second monitor, and there is no tool to close them. Notebook 008 also stays open. Cell 013 began as a rendering test cell; I overwrote it with the Introduction rather than delete it, because the delete tool is for explicit user requests only.
- **Screenshot errors.** The screenshot script printed X `BadColor` errors for some other sessions' windows. My windows captured correctly.
- **Skipped upstream steps:** the `.nb` build (MathNotebook), the fingerprint stamp, Wolfram Cloud deploy and the README cloud link. The cloud steps are forbidden by the owner rule.
- **Git.** I made a local commit, because the skill's provenance step asks for one. Nothing was pushed.
