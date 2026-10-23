# Run log: wolfram-computational-essay (2026-10-22)

## 1. Skills used
1. wolfram-computational-essay (local WLJS adaptation, which points to ROUTES.md and the pinned upstream SKILL.md at MarkdownToNotebook @ 4d1e1391)

## 2. Steps
1. Listed the working folder. The only source is `work/ComputationalEssay/PiIsMostlyRandom.md` ("How Random Is Pi?", `Template: ComputationalEssay`). The `-out.md` and `images/*.png` files next to it date from Oct 20 (the upstream example). I left them alone.
2. Read ROUTES.md, the local skill file, the upstream SKILL.md, the upstream `build.wls` and `examples/build.wls`, and `tests/authoring/run.wl`. I did not use the upstream build scripts. Both call `PacletInstall`/`CloudConnect`/`CloudDeploy`, which would contact Wolfram's servers and publish. I wrote a small offline build script in the scratchpad instead (`build-essay.wl`). It sets `$AllowInternet = False`, loads `MarkdownToNotebook.wl`, points the converter's example cache (`$cacheLocation`) at a scratchpad folder so nothing is written to the user's persistence store, and runs `MarkdownToNotebook[src, out, "UseCache" -> False]`.
3. **Build attempt 1, wolfram-direct** (`WolframLanguageEvaluator`, fresh kernel, network blocked). Chosen because the skill says to build `.nb` files in a fresh kernel, not WLJS, and this route guarantees no network. Result: `Failure["EvaluationTimeExceeded"]` at its 110 s limit. No file was written.
4. **Build attempt 2, fresh `wolframscript` kernel** run under `bwrap --unshare-net` (the same network isolation wolfram-direct uses, without its time limit), with `$AllowInternet = False`. It finished in 14.3 s with no messages. Output `PiIsMostlyRandom.nb` (447,709 bytes), which reads back as a `Notebook`. Wolfram/Parser loaded from the local install (`$parserReady` True). Cells: Title 1, Author 1, Abstract 1, Section 5, Text 6, CodeText 5, Input 5, Output 5 (plus 2 InlineFormula), 2 graphics. There are no `$Failed` outputs and no unfilled template slots. Outputs: first 20 digits 3,1,4,1,5,9,2,6,5,3,5,8,9,7,9,3,2,3,8,4; bar chart; chi-square p = 0.40367; walk plot; {82.58, 100.}.
5. **Render attempt, fresh `wolframscript` kernel** under `bwrap --unshare-net`: `Rasterize` of the built notebook, as a visual check. It hung until my 300 s `timeout` killed it, probably because the front end cannot connect inside the network namespace. No PNG was made, and no leftover processes remained.
6. **WLJS kernel via `mcp__wljs__kernel_evaluate`**: ran the essay's examples as a live cross-check, as the local adaptation asks. First call, inside `Begin["test`essayPreview`"]`: the values computed, but `Rasterize`/`Export` to PNG failed with `FilterRules::rep`, `ReplaceAll::reps`, `Rasterize::needraster` and then "Promise >> Timeout!" / `$Aborted`. Because of the abort, `End[]` did not run, and the shared kernel was left in my private context. Second call: `End[]` and `Remove["test`essayPreview`*"]`, then confirmed `$Context` = `Global``, no leftover symbols, and `$AllowInternet` = False. Third call (Module locals only, no images): first 20 digits, frequencies, chi-square p = 0.40366769139384584 and {82.58, 100.}, all identical to the built notebook. Fourth call: a parse-only check (`ToExpression[..., HoldComplete]`) of the changed BarChart line used in the WLJS preview.
7. **WLJS notebook (no window):** wrote `PiIsMostlyRandom-wljs.md`. It has a title, byline and abstract instead of the YAML frontmatter, the empty `[RealDigits]()` link filled with its reference URL, and the BarChart cell wrapped in `Show[#, PlotRangeClipping -> False] &` (the ROUTES.md workaround for WLJS hiding category labels). I converted it with `python3 tools/md2wln.py` to `PiIsMostlyRandom.wln`, which has 5 code cells, unevaluated. I did not open it.

## 3. Files
Created (none changed):
- `work/ComputationalEssay/PiIsMostlyRandom.nb`: the built computational essay (deliverable)
- `work/ComputationalEssay/PiIsMostlyRandom-wljs.md`: WLJS preview source
- `work/ComputationalEssay/PiIsMostlyRandom.wln`: WLJS notebook converted from it
- `run-log.md` (this file)
- Scratchpad only (`<tmp>/.../scratchpad/`): `build-essay.wl`, `run-build.wls`, `render.wls`, `req-build.json`, `build.log`, `m2ncache/` (converter example cache)
- Outside the work folder, written by the tool itself: wolfram-direct's run record `~/.local/state/wolfram-agenttools-direct/runs/run-seuxcy1r/`

## 4. WLJS notebook
`<repo>/tests/runs/2026-10-22/wolfram-computational-essay/work/ComputationalEssay/PiIsMostlyRandom.wln` (converted with md2wln.py, not opened, not evaluated). No notebook was saved from a WLJS window.

## 5. Answer
The essay "How Random Is Pi?" is built: `work/ComputationalEssay/PiIsMostlyRandom.nb`. I built it from `PiIsMostlyRandom.md` with MarkdownToNotebook in a fresh, network-isolated Wolfram kernel. It took 14 s with no messages. It has a title, a byline ("Claude • 2026"), the abstract, 5 sections, 5 captioned inputs with their evaluated outputs (digits, a digit-frequency bar chart, chi-square p ≈ 0.404, a 2D digit walk, end distance 82.6 against √n = 100) and the references. It has no `$Failed` outputs and no unfilled slots. I ran the same examples in the WLJS kernel and got identical numbers. Nothing was deployed or published. The upstream build scripts would `CloudDeploy`, which needs your OK and internet access. A WLJS version is at `PiIsMostlyRandom.wln` if you want to run it live.

Points in the source you may want to fix (I did not change your text):
- The closing section says "five plotting commands and a statistical test", but the essay has two plots and one test.
- Reference [3] (Y. Kanada, "The world record computation of pi", University of Tokyo, 2025) looks doubtful. To my knowledge Kanada died in 2020. I could not check this offline.
- The `Sources` and `Links` frontmatter entries do not appear in the built notebook. The ComputationalEssay template does not render them.

## 6. Problems
- wolfram-direct timed out at 110 s on a build that takes 14 s in plain wolframscript. The cause is unknown: possibly start-up overhead in the AgentTools evaluator, or something waiting on the blocked network. I switched to wolframscript under `bwrap --unshare-net`.
- No visual check of the `.nb` rendering. A front-end `Rasterize` hung under network isolation (killed after 300 s). A WLJS `Rasterize` from `kernel_evaluate` failed (no notebook context: `FilterRules::rep`, `ReplaceAll::reps`, `Rasterize::needraster`, then a timeout). The check covers structure and values only: cell styles, GraphicsBox count, output values. I did not try a non-isolated front end, because it might make update or news checks to Wolfram.
- The aborted WLJS call left the shared kernel in `test`essayPreview`` for a moment. I restored it (`$Context` = `Global``, symbols removed, `$AllowInternet` False).
- The built notebook keeps `In[n]:=`/`Out[n]=` cell labels (sequential 1–5). This is the converter's normal output. The checklist warns only against stray ones, so I left them.
- The abstract is 91 words, within the ~100-word guideline.
- The `.wln` preview's BarChart cell differs from the source (the `PlotRangeClipping -> False` wrapper). I checked that it parses, but did not run it in a WLJS notebook.
