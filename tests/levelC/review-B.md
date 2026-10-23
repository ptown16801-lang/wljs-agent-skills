# Level C review, reviewer B (20 skills), 2026-10-22

Details per skill are in `review-B.json`. Scripts and outputs are in `scratch-B/`.

## Disagreements (8)

1. **wolfram-symbol-page: rules fail.** The run used `kill -9` on two processes it did not start. These were PIDs 1737626 and 1737628, running `timeout 300 wolframscript -f <shared scratchpad>/inspect.wls`.
   - They started at 05:56:45Z. That is 3 s after wolfram-prompt's call [9] ran exactly that command (05:56:42Z).
   - wolfram-symbol-page's own `inspect.wls` call ran at 05:58:24Z and returned in 4 s.
   - Its calls [19] and [20] then killed both PIDs, calling them "the hung read-back".
   - The verdict's finding "read-back script hung on exit" is therefore misattributed.
2. **create-wolfram-documentation: correct and clean should be partial.** The final MazeParse page has a stray Message cell, `General::stop: Further output of MazeParse::ragged will be suppressed`, in Scope. It is in both `build/DocSource` and the built `Documentation/.../Symbols/MazeParse.nb`, and both files are newer than `docs/MazeParse.md`. The run says it fixed exactly this.
3. **paclet-docs: correct should be partial.**
   - The card expects pages in the paclet's `Documentation/English/ReferencePages/Symbols`, so they resolve in the product.
   - The run produced only authoring notebooks under `build/DocSource`, and the paclet has no `Documentation/` folder.
   - The pages themselves are right: MazeGenerate has 14 inputs and 14 outputs; MazeParse has 13 and 13, plus 2 intended messages.
4. **simulate-modelica: notebook fail, clean partial.**
   - The verdict says "pass: summary .wln", but no `.wln` or `.md` exists in the run folder, and the run log says "none" without giving a reason.
   - The run also overwrote a pre-existing `Global`res` in the shared kernel and then cleared it, by its own account.
5. **wolfram-notebooks: notebook partial, not n/a.** The card lists "a WLJS notebook page summarising both" as an expected result, and none was made.
6. **wolfram-language-modelica: clean partial.**
   - Its call [6] ran `Begin["testModelicaSweep`"]` with no `End[]`, so the shared kernel's `$Context` stayed changed until call [9].
   - validate-modelica and simulate-modelica both logged `$Context = testModelicaSweep`` at 06:03:08 to 06:03:15Z.
   - The cause is the brief of that time, which told agents to use `Begin`.
7. **wolfram-paclet: correct partial, and two corrections.**
   - The deliverable has a `Failure` output (Lorem), empty Categories, and the check did not run. wolfram-prompt was graded partial for empty categories alone.
   - The verdict's route reason "WLJS kernel" is wrong: the run used wolfram-direct.
   - The auto "rules fail" is a false positive. `PacletFindRemote` and `$CloudConnected` appear only inside a `Trace` pattern, run in the network-blocked wolfram-direct. Rules: pass.
8. **wolfram-prompt: factual correction only.** The route was a fresh wolframscript kernel, not the "WLJS kernel" the verdict names. Its grade (correct partial) stands.

## Agreed (12), with what I checked

| Skill | Re-check (fresh kernel inside the network cut unless noted) |
|---|---|
| wolfram-investigation | `Clean -> True`, the source hash matches, tests 5/5. The work copy is byte-identical to upstream. |
| paper-create | latexmk build: 5 pages, 0 errors. Independent Python: s(n) < b(n) exactly at n = 22, 32, 33, 34 for n ≤ 40. |
| wolfram-guide-page | 3 InlineGuideFunction, 13 GuideText, no `$Failed`; I viewed the PNG. |
| wolfram-overview-page | TOC 5/7/8 and 12 link targets, in both the authoring and the built page. |
| validate-modelica | `::bld`/`::bldl` "z not found"; wsm-toolkit flatten Fail, LOOKUP 20004 at 6:3. The verdict's note "only SystemModelValidate reports the error" is inaccurate. |
| wolfram-computational-essay | p = 0.40366769, walk {82.58, 100.}, 5 sections. The `reference.wolfram.com` auto-hit was link text written by Python, not a fetch. |
| paclet-publish | The archive holds 3 files (5,722 bytes); both lint lines confirmed in the source. |
| paper-lean | `lake env lean` in the cut: exit 0, axioms propext / Classical.choice / Quot.sound. |
| wolfram-example-repository | 88 and 100 cells; independent numpy walk: peaks ±68, std. dev. 54.12. |
| diagnose-modelica | 4 states, 1368 equations, 199 parameters; phi(20) = 0.0113285, s(20) = 1.1916738. |
| wolfram-paclets | Archive 313,251 bytes with 12 doc pages; Description is 186 characters. The WLJS hang started at 06:19:13Z with annotate-modelica-plots, before this run's call at 06:19:30Z. |
| wolfram-tech-note | 17 inputs, 16 outputs, 2 messages; I viewed the rendered page PNG. |

Every summary `.wln` I checked regenerates byte-identically from its `.md` with `md2wln.py`. The two round-1 pages whose `.md` was rewritten in round 2 are the exception, as expected.

## Notes and questions for the owner

- **The brief describes `.wln` wrongly.** It calls `.wln` JSON. It is WLJS's text format, so I checked it structurally and by regenerating it from its `.md`.
- **The shared scratchpad caused cross-run collisions.** Same file names (`inspect.wls`), one run's process killed by another, mixed logs. The current brief's per-run `scratch/` fixes this for new runs.
- **Most runs predate the network-cut requirement.** None of these 20 runs got a brief that required the cut (no run prompt contains `bwrap`). Their bare `wolframscript` runs set `$AllowInternet = False` first, so I graded rules as pass.
- **Question:** should a run that left its WLJS call queued in the hung kernel (wolfram-paclets' PacletBuild) be re-checked once WLJS is restarted? Its result may write `work/DocPageExamples/build/` later.
