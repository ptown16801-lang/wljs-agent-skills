# Run log: project-create (prime gaps), Oct 22, 2026

## 1. Skills used

1. project-create
2. wiki-init
3. notebook-create

## 2. Steps

1. Read `ROUTES.md`, the local adaptation, the pinned upstream `project-create/SKILL.md` and `research.md`, `TESTING.md`, and the upstream `check-env.sh` and `scaffold-project.sh` before running anything.
2. Questionnaire: no user was available, so I used the request and the upstream defaults.
   Type **research**; name **PrimeGaps**; depth **short** ("a short one"); **no paper** ("no paper yet"); code directory `Code/`; prompt tracking off; scientific journal off; wiki domain folders `Conjectures/` and `Experiments/` (I picked these for the topic).
3. Environment check, done by hand instead of running `check-env.sh`.
   The script runs `wolframscript -code "1+1"`, which starts a fresh kernel with default settings, and I could not make sure `$AllowInternet = False` held in that kernel.
   I ran the script's other checks myself: `wolframscript` is at `/usr/bin/wolframscript`, and there is no Wolfram MCP entry in `~/.claude` config (expected: the WLJS MCP is the one used here).
   The `1+1` check ran in the **WLJS kernel via `mcp__wljs__kernel_evaluate`** (the default route): it returned `{2, False, 15.}` for `{1+1, $AllowInternet, $VersionNumber}`.
4. Scaffold: ran the upstream `scaffold-project.sh "PrimeGaps" "<topic>" "." "ptown16801-lang" "<owner-email>" "Code"` in the working folder, passing the owner's details explicitly (TESTING.md fix).
   I grepped the output for the upstream author's name and email: no match.
   The hook was copied to `.githooks/` but not activated: there is no git repo, I did not run `git init`, and activating hooks needs the owner's OK.
5. wiki-init: created `Wiki/` (`Index.md`, `Status.md`, `Concepts/`, `Resources/`, `Conjectures/`, `Experiments/.gitkeep`).
   Appended the upstream wiki section to `CLAUDE.md`, plus a section **"Wolfram environment on this computer (WLJS)"** that records the WLJS route, `.wln` notebooks and the offline rule.
   Created `.gitignore` with `Tour/` and `Resources/`.
   Checked every relative link in the wiki: none is broken.
6. Code: wrote `Code/PrimeGaps.wl` (`PrimeGapSequence`, `PrimeGapCounts`, `MaximalPrimeGaps`, `NormalizedPrimeGaps`) and `Code/PrimeGapsVisualization.wl` (`PrimeGapHistogram`, `MaximalPrimeGapPlot`) in the project's code style.
   I checked that none of the names collides with a System symbol (**WLJS kernel**, `kernel_evaluate`).
   Then I tested them in the **WLJS kernel** (`kernel_evaluate`), loading inside `Block[{$ContextPath = $ContextPath}, ...]` so the shared kernel's context path was left as it was.
   Results: the first gaps are `{1,2,2,4,2,4,2,4,6,2}`.
   There are 18 record gaps up to p = 1299721, from (2,1) to (492113,114); they match the start of OEIS A002386/A005250 as I remember it (not checked online).
   Mean of g/log p over the first 10^5 gaps: 1.0011. Largest: 8.735, at 370261.
   Most frequent gap: 6 (16989 times), then 2 (10250) and 4 (10213).
   Largest record Cramér ratio for p ≥ 23: 0.681, at 370261.
   Both plot functions return `Graphics`, and a negative argument stays unevaluated.
   All of these ran in the **WLJS kernel** (`kernel_evaluate`): it is the default route, and the work is plain computation.
7. Wiki articles: wrote `Concepts/PrimeGap.md`, `Concepts/MaximalPrimeGap.md` and `Conjectures/CramerConjecture.md`, and filled in Index and Status.
   Each measured number is marked "measured". Literature facts are marked as not yet backed by a source in `Wiki/Resources/`.
8. Step 5, reference papers: **not done.** It needs downloads, which need the owner's OK (see Problems).
9. Step 6, notebook (notebook-create): wrote the source `Code/Artifacts/PrimeGapsFirstLook_261022.md`.
   I had first planned a live notebook, but a coordinator message during the run said **not to call `mcp__wljs__new_notebook` or open any WLJS notebook**.
   So no notebook window was opened. I converted the source with `tools/md2wln.py` into an unevaluated `.wln`.
   Each code cell of the source was evaluated separately in the **WLJS kernel** (`kernel_evaluate`, inside a `Block` on `$ContextPath`): Null, then Graphics ×3, no messages.
10. Summary page (the adaptation asks for a WLJS page that summarises the files): wrote `Code/Artifacts/ProjectSetupSummary_261022.md` and converted it with md2wln.py.
    The first version loaded the packages and called `PrimeGapSequence[10]` in one cell. That fails, because the cell is parsed before `Get` runs: it returned the call unevaluated, and the parse created `Global`PrimeGapSequence` in the shared kernel.
    I removed that symbol (`Remove`, **WLJS kernel**) and split the cell in two. I deleted the `.wln` I had just generated and regenerated it from the fixed source; md2wln.py refuses to overwrite, and a generated file may be rebuilt from its source.
    Re-check in the **WLJS kernel**: `{Null, {1,2,2,4,2,4,2,4,6,2}}`, no `Global` leftovers, and `$AllowInternet` is still `False`.
11. Added both artifacts to `Code/Artifacts/README.md`.

No fresh kernel (`wolframscript` / `wolfram-direct`) and no `wsm-toolkit` was used. Nothing contacted Wolfram's servers, nothing was installed, and nothing was published or pushed.

## 3. Files

All under `<repo>/tests/runs/2026-10-22/project-create/work/PrimeGaps/`:

- Created by `scaffold-project.sh`: `README.md`, `CLAUDE.md`, `Code/Tools.wl`, `Code/Artifacts/README.md`, `Research/Artifacts/README.md`, `Work/README.md`, `Scripts/recover_resources.sh`, `Scripts/generate_notebooks.wls`, `Scripts/publish_notebooks.wls`, `.githooks/commit-msg`, and the empty `Resources/`.
- Changed by me: `CLAUDE.md` (wiki and WLJS sections appended), `Code/Artifacts/README.md` (two rows).
- Created by me: `.gitignore`, `Code/PrimeGaps.wl`, `Code/PrimeGapsVisualization.wl`, `Code/Artifacts/PrimeGapsFirstLook_261022.md`, `Code/Artifacts/PrimeGapsFirstLook_261022.wln`, `Code/Artifacts/ProjectSetupSummary_261022.md`, `Code/Artifacts/ProjectSetupSummary_261022.wln`, `Wiki/Index.md`, `Wiki/Status.md`, `Wiki/Concepts/PrimeGap.md`, `Wiki/Concepts/MaximalPrimeGap.md`, `Wiki/Conjectures/CramerConjecture.md`, `Wiki/Experiments/.gitkeep`, and the empty `Wiki/Resources/`.
- This log: `<repo>/tests/runs/2026-10-22/project-create/run-log.md`.

## 4. WLJS notebook

No notebook was created or saved through the WLJS app; no window was opened.
Two `.wln` files were written without a window by `tools/md2wln.py`. Both are unevaluated.

- `<repo>/tests/runs/2026-10-22/project-create/work/PrimeGaps/Code/Artifacts/PrimeGapsFirstLook_261022.wln`
- `<repo>/tests/runs/2026-10-22/project-create/work/PrimeGaps/Code/Artifacts/ProjectSetupSummary_261022.wln`

## 5. Answer

I've set up a short research project on prime gaps in `PrimeGaps/`, without a paper.

- **Folders:** `Code/` (with `Artifacts/`), `Research/` (with `Artifacts/`), `Resources/`, `Scripts/`, `Work/` and `Wiki/`. `README.md` and `CLAUDE.md` hold the conventions, and `CLAUDE.md` also notes that Wolfram work runs in WLJS and stays offline.
- **Code:** `Code/PrimeGaps.wl` gives the gap sequence, gap counts, record (maximal) gaps and gaps divided by log p. `Code/PrimeGapsVisualization.wl` draws the gap histogram and the record gaps against the Cramér scale (log p)^2.
  I tested both in the WLJS kernel on the first 100,000 gaps. Please look over the code before we build on it.
- **Wiki:** articles on the prime gap, maximal prime gaps and Cramér's conjecture, plus the index and status pages.
  First results (measured, not proved):
  - There are 18 record gaps below 1.3 million, the last one 114 at 492113.
  - Gaps divided by log p average 1.001.
  - 6 is the most common gap.
  - Every record above 23 stays under 0.7 (log p)^2.
- **Notebooks:** `Code/Artifacts/PrimeGapsFirstLook_261022.wln` is a first look at the gaps (histogram, gaps divided by log p, records against the Cramér scale). `ProjectSetupSummary_261022.wln` lists what was set up. Both are unevaluated: open them in WLJS and evaluate the cells.
- **Not done yet, waiting on you:**
  - No reference paper has been downloaded.
  - The folder is not a git repository yet.
  - Prompt tracking and the scientific journal are off.
- **Next steps:**
  - Add the key paper, if you approve the download.
  - Extend the record table to larger ranges with a segmented sieve.
  - Compare the gaps divided by log p with the exponential law of Cramér's model.
- **Useful skills:** wiki-add-resource, paper-cite, notebook-create, backlog-add / backlog-run, wiki-update, wiki-check, project-tour, and paper-create when you want a paper.

What I would ask you:

1. **Reference paper (step 5 of project-create; short depth = 1 paper):** "May I download one key paper to `Resources/`? I suggest A. Granville, *Harald Cramér and the distribution of prime numbers* (1995), or a recent survey of prime gaps from arXiv. That would be one PDF of a few hundred KB from arxiv.org or the publisher. No Wolfram server is involved."
2. "Should I run `git init` here and activate the commit-message hook (`git config core.hooksPath .githooks`)?"
3. "Do you want prompt tracking or the scientific journal turned on? Both are off by default."
4. "Is `PrimeGaps` the name you want, and are the wiki folders `Conjectures/` and `Experiments/` right?"
5. "For author lines, should I use the GitHub handle `ptown16801-lang` or your real name?"

## 6. Problems

- **`check-env.sh` was not run as a script.** It starts a fresh kernel through `wolframscript -code "1+1"`, and I could not guarantee `$AllowInternet = False` there.
  I did its checks by hand and evaluated `1+1` in the WLJS kernel instead. As TESTING.md says, the script would also report "Wolfram MCP not detected".
- **Author name:** I don't know the owner's real name. I passed the git `user.name` `ptown16801-lang` and the email from the session context, `<owner-email>`.
  This scaffold script does not write either one into any file. Its default would have been the upstream author.
- **Step 5 (papers) skipped:** downloads need the owner's OK. The literature facts in the wiki are written from memory and marked as not yet backed by a source in `Wiki/Resources/`: Bertrand, Baker–Harman–Pintz, Westzynthius, Zhang, Maynard/Polymath, Cramér 1936, Granville 1995.
  The match with OEIS A002386/A005250 is also from memory, not checked.
- **Coordinator rule change mid-run:** "do NOT call mcp__wljs__new_notebook or open any WLJS notebook".
  I had not opened one yet, so none was opened. The notebooks are unevaluated `.wln` files from md2wln.py and have no outputs.
  I did not look at the rendered `.wln` files (no screenshot, since no window was allowed), so the plots have not been checked visually in WLJS.
- **Shared kernel side effects:**
  - Loading the packages defined the `` PrimeGaps` `` context in the shared WLJS kernel. `$ContextPath` was kept unchanged with `Block`.
  - One mistake, fixed: a single-cell "load then call" created `Global`PrimeGapSequence`. I removed it, and no `Global` symbol matching `*Prime*Gap*` remains.
  - Evaluating the Setup cell of either notebook later will put `` PrimeGaps` `` on that kernel's `$ContextPath`, which is normal for a notebook.
- **Pitfall found:** in the first summary page, loading a package and using its symbols in the same cell fails (the cell is parsed before `Get`). The fixed notebooks keep the load in a cell of its own.
- **Upstream text left as is:** the `CLAUDE.md` § *MCP usage* text (official Wolfram MCP, arXiv MCP) and the `.nb` wording in § *Notebooks* are kept. The appended WLJS section says it overrides them.
  The scaffolded `Scripts/generate_notebooks.wls` and `publish_notebooks.wls` target `.nb` and Wolfram Cloud and should not be used here without the owner's OK. I did not run them.
- `Wiki/Resources/` is an empty folder, so git will not track it until a resource is added (upstream convention: no `.gitkeep` there).
