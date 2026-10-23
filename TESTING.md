# Skill test record

> **Read first (Oct 22, 2026).** The Oct 21 results below were **hand-run**: the workflows were carried out directly
> from the upstream instructions, and **no skill was invoked**; about 25 statuses were carried over from earlier
> sessions without a re-run. They are kept as prior evidence. **Current results are protocol v2**
> ([TEST-PLAN.md](TEST-PLAN.md): skill invoked by a fresh agent, six checks, independent review), generated into
> [tests/RESULTS.md](tests/RESULTS.md) and into each skill's status line; this file is not their source.

Evidence for how each adapted skill behaves on WLJS. Newest first. Status per skill: **works**, **works with
fixes** (works once the stated local change is followed), **limited** (works with stated gaps), **fails** (cannot
work here; reason given) or **not tested** (reason given). The same status is printed in every skill file
(`build.mjs`, table `STATUS`).

## All 70 skills in WLJS (Oct 21, 2026, WLJS 3.1.4 desktop app)

**Count:** 39 works, 9 works with fixes, 13 limited, 2 fails, 7 not tested.
Online use: one Wolfram|Alpha query, approved by the owner; every other test ran offline. Nothing was installed.

**Test fixtures** (throwaway, in the gitignored `tests/out/`): the research project `institute/CollatzTrial` (its own
git repo: scaffold, wiki, two work items, journal, paper, research note, tour), the paclet `institute/CollatzTools`,
the authoring builds `authoring-wljs/` and `authoring-direct/`. Tracked: `tests/authoring/` (build harness and two
sources), `tests/modelica/` (spring models, annotated copies, a directory-form library), `tests/overrides/` (lists
the System symbols a kernel has redefined), `tools/md2wln.py`.

**Main finding:** WLJS redefines notebook and front-end symbols (`Cell`, `Notebook`, `MakeBoxes`, `CurrentValue`,
`Rasterize`, ...). Computation, System Modeler, plots and paclet builds work in WLJS; anything that builds or reads a
Mathematica `.nb` must use a fresh kernel (details in ROUTES.md).

| Skill | Status | Result |
|---|---|---|
| annotate-modelica-animation | works | hand-written Animation annotation on a MultiBody pendulum builds and simulates in WLJS; playback is in the System Modeler app |
| annotate-modelica-graphics | works | wsm-toolkit schematic writes Placement/Line annotations; the model still builds in WLJS |
| annotate-modelica-plots | works | figures annotation written from a vars file; plots reproduced live in WLJS |
| backlog-add | works | test item created |
| backlog-info | works | found the finished item on its branch |
| backlog-refine | works | WLJS probe, trap and open question recorded; readiness check kept the item in Backlog |
| backlog-review | works | check re-run in WLJS from the branch; accepted, merged, Done/ |
| backlog-run | works | two sessions in a worktree claim; computation in WLJS matched OEIS A060412 |
| diagnose-modelica | works | states, parameters, equation count in WLJS; deep reports (blocks, tearing, events) via wsm-toolkit |
| modelica-model-architecture | works | a directory-form library loads in WLJS with no messages; its example matches the exact solution |
| paclet-build | works | PacletTools`PacletBuild in WLJS; the archive loads and runs without installing |
| project-tour | works | tour stop built as a .wln (tools/md2wln.py); its code runs in WLJS |
| search-modelica-docs | works | offline search through wsm-toolkit docs |
| simulate-and-plot-modelica | works | SystemModelPlot renders live in a WLJS notebook |
| simulate-modelica | works | SystemModelSimulate in WLJS matches the exact solution |
| validate-modelica | works | in WLJS: a build reports the exact error (missing connector); the toolkit flatten passes too |
| wiki-check | works | links/index checked; missing article added |
| wiki-init | works | test project wiki created |
| wiki-update | works | run inside backlog-run |
| wljs-async-programming | works | WLJS's own guide, used in the WLJS app (Oct 21) |
| wljs-dynamics | works | Manipulate renders live with JIT updates |
| wljs-formatting | works | WLJS's own guide, used in the WLJS app (Oct 21) |
| wljs-html | works | WLJS's own guide, used in the WLJS app (Oct 21) |
| wljs-javascript | works | WLJS's own guide, used in the WLJS app (Oct 21) |
| wljs-markdown | works | WLJS's own guide, used in the WLJS app (Oct 21) |
| wljs-mermaid | works | WLJS's own guide, used in the WLJS app (Oct 21) |
| wljs-migration | works | .nb -> .wln conversion works; Manipulate fixes recorded in ROUTES.md |
| wljs-slides | works | WLJS's own guide, used in the WLJS app (Oct 21) |
| wljs-special-cells | works | WLJS's own guide, used in the WLJS app (Oct 21) |
| wljs-wlx | works | WLJS's own guide, used in the WLJS app (Oct 21) |
| wolfram-alpha | works | one owner-approved query in a WLJS notebook (WolframAlpha[...] with internet on, then off) |
| wolfram-computational-essay | works | example builds a valid notebook offline (31 cells, no messages) |
| wolfram-debugging | works | Wolfram's official suite 118/123 in WLJS = wolfram-direct; APIFunction/HTTP debugging needs wolfram-direct |
| wolfram-guide-page | works | example builds a valid guide notebook offline |
| wolfram-language | works | evaluation, CodeInspector, Trace and System Modeler calls run in the WLJS kernel |
| wolfram-language-modelica | works | SystemModelSimulate in WLJS matches the exact solution to 9 digits |
| wolfram-overview-page | works | test source builds a valid overview notebook offline |
| wolfram-setup | works | diagnostic run: versions, WLJS ready, MCP entry, Expand[(x+1)^5] in WLJS; nothing installed |
| wolfram-tech-note | works | test source builds a valid tech-note notebook offline |
| annotate-control-panel | works with fixes | panel annotation written (suggested minimum 0 for a mass is singular: raise it); a WLJS Manipulate over SystemModelSimulate re-simulates live |
| document-revise | works with fixes | notes found in the saved .wln; version _2 written with NotebookSave to a new path |
| notebook-create | works with fixes | .wln built through the WLJS MCP tools; save with NotebookSave from the kernel (the Save button needs a dialog) |
| project-create | works with fixes | scaffold scripts default the author/email to the upstream author: always pass the owner details |
| project-provenance | works with fixes | .wln has no TaggingRules: the back-pointer is a hidden first .md cell |
| wolfram-investigation | works with fixes | lifecycle stays in a fresh kernel: in WLJS NotebookDriftReport falsely reports drift |
| wolfram-notebooks | works with fixes | ReadNotebook/WriteNotebook stay in wolfram-direct: in the WLJS kernel ReadNotebook output carries WLJS box markup and WriteNotebook fails |
| wolfram-paclet | works with fixes | build in a fresh kernel (3 s; WLJS 106 s and 2 graphics missing) |
| wolfram-symbol-page | works with fixes | build in a fresh kernel (in WLJS a section is lost: 96 vs 142 cells) |
| backlog-board | limited | board data builds locally; publishing the page needs the owner OK (not run) |
| create-wolfram-documentation | limited | steps 1-5 work offline (survey, backup, port, rebuild); PacletPage publishing needs a download |
| paclet-docs | limited | CreateSymbolDoc must run in a fresh kernel (in WLJS it writes WLJS box markup); examples evaluate only if the paclet is installed |
| paper-create | limited | sources written (upstream script fills in the upstream author email if blank); no PDF without TeX |
| paper-create-note | limited | .wl checked in a bare kernel, .wln via tools/md2wln.py runs in WLJS; no PDF without TeX |
| paper-create-notebook | limited | WLJS .wln path works; numbered statements and tag references need Mathematica and the MathNotebook paclet |
| paper-journal | limited | sources written; no LaTeX/Typst on this computer, so no PDF |
| wiki-search-wolfram | limited | offline search via wolfram-direct works; WLJS docs search returns no results (corpus missing); online parts not tested |
| wolfram-data-repository | limited | builds in a fresh kernel (hangs in WLJS); category checkboxes stay empty offline |
| wolfram-demonstration | limited | builds offline (empty categories); in WLJS the example needs three Manipulate fixes, then runs live |
| wolfram-example-repository | limited | builds offline; category checkboxes stay empty without Wolfram servers |
| wolfram-paclets | limited | PacletTools`PacletBuild works in WLJS; CheckPaclet/BuildPaclet/SubmitPaclet scripts need the Wolfram/PacletCICD paclet, not installed |
| wolfram-prompt | limited | builds offline; category checkboxes stay empty without Wolfram servers |
| create-hydraulic-model | fails | the Hydraulic Modelica library is not installed (the knowledge-graph tool runs) |
| paper-lean | fails | Lean 4, Mathlib and the lean-lsp MCP are not installed |
| astro-observation-planner | not tested | needs internet (not approved); offline Sunset returns a wrong time and planets stay unevaluated |
| backlog-autolab | not tested | dispatching background agents needs the owner OK each time |
| paclet-publish | not tested | past the local build every step publishes (owner OK) |
| paper-cite | not tested | needs internet (not approved) |
| wiki-add-resource | not tested | needs internet (not approved) |
| wiki-search-math | not tested | needs internet (not approved) |
| wolfram-function-resource | not tested | needs internet to build (fetches a template; not approved) |

### Evidence, skill by skill (working notes from the session)

- Graphics clipping (follow-up, Oct 21; tested on BarChart and plain Graphics). Observed: `BarChart` category labels are drawn (SVG text present) but inside a clip-path equal to the plot area, so under 1 px shows; with `PlotRangeClipping` set, WLJS honours it (`True` hides an outside `Text`, `False` shows it). The `Graphics` returned by `BarChart[..., PlotRangeClipping -> False]` has no `PlotRangeClipping` option in the WLJS kernel and in a plain Mathematica kernel alike, so dropping it is Wolfram's `BarChart`; `Show[chart, PlotRangeClipping -> False]` restores the labels. Inferred, not verified: WLJS clips when the option is unset in general.
- authoring re-test: data-repository hangs in WLJS (fresh kernel 13 s); symbol-page WLJS 96 vs 142 cells; paclet WLJS 106 s vs 3 s. Cause: WLJS redefines Cell, Notebook, CurrentValue, StyleBox, Rasterize ... Route: .nb build in fresh kernel.
- project-create: works. check-env.sh + scaffold-project.sh ran; scaffold defaults the author to the upstream author (pass Author). check-env reports "MCP not detected" (it looks for the Wolfram MCP; WLJS MCP not recognised) - harmless.
- wiki-init: works (files only).
- notebook-create: works with fixes. .wln built cell by cell via mcp__wljs__*; .md source kept. Save: NotebookSave[RemoteNotebook, path] from the kernel (Save button needs a prompt() the tools cannot answer). Saved plots reload once a kernel attaches. A handle cell (EvaluationNotebook[]) remains in the notebook.
- backlog-add: works. commit-msg hook enforces 72-char subjects.
- backlog-run: works (two sessions T1, T2; worktree claim ~/.cache/autolab; WLJS kernel for the computation; result matches OEIS A060412).
- wiki-update: works (run inside backlog-run).
- backlog-info: works (gathers unmerged branch, UnderReview on branch).
- backlog-review: works (merge-tree check, check re-run in WLJS from the branch worktree, accept, Done/, branch deleted). Verdict given by Claude for the test (owner's word in real use).
- wiki-check: works (link/index checks scripted; added the missing core-functions article).
- paper-journal: works for sources (scaffold-journal.sh, toggle, day-file, \input line, bib entry). PDF not built: no LaTeX/Typst on this computer (installing needs the owner's OK).
- project-provenance: works with a WLJS adaptation: .wln has no TaggingRules, so the back-pointer is a first `.md` cell holding the `<!-- provenance: ... -->` comment (renders invisibly); ledger Wiki/Prompts.md as upstream.
- document-revise: works with a WLJS adaptation: notes `<< ... >>` found by grep in the saved .wln; the cell edited with mcp__wljs__set_cell_lines; version _2 written with NotebookSave to a new path (v1 keeps the note); _2.md and <stem>.provenance.md beside it.
- paper-create: works for sources (scaffold-paper.sh; content written). Upstream script defaults the operator email to the upstream author's address when blank: pass the owner's details or edit (fixed in the test paper). No PDF (no TeX).
- paper-create-note: works with a WLJS adaptation: .wl checked in a bare offline kernel (wolfram-direct, same result); .md -> .wln with tools/md2wln.py (new; no window needed), which opens rendered in WLJS and evaluates to the same records; .tex source; no PDF (no TeX).
- paper-create-notebook: limited. The WLJS .wln path works as for paper-create-note (prose, KaTeX, code). Numbered statements and {#Tag} references need Mathematica's front end and the MathNotebook paclet (personal-cloud download: owner's OK); not run.
- wolfram-alpha: works (owner-approved online use): WolframAlpha["distance from Earth to the Moon", {{"Result",1},"ComputableData"}] in a WLJS notebook -> Quantity[242499.9, "Miles"]; internet off again ($AllowInternet False).
- Online uses not approved today (marked not tested: needs internet): wolfram-function-resource, astro-observation-planner, wiki-search-wolfram online parts, paper-cite, wiki-search-math, wiki-add-resource.
- backlog-board: limited. Board data builds locally (work-board-build.py -> 1 item, 1 project); publishing/syncing the claude.ai page not run (owner's OK each time).
- paclet-build: works in WLJS with PacletTools`PacletBuild[dir] (archive built; extracted archive loads via PacletDirectoryLoad and returns the records; unloaded afterwards; nothing installed). The local CheckPaclet.wls / BuildPaclet.wls need the Wolfram/PacletCICD paclet, which is not installed (install = internet + owner's OK): they fail offline.
- wolfram-paclets: same finding: CheckPaclet fails (PacletCICD missing); building works with PacletTools`PacletBuild in WLJS.
- paclet-docs: limited. AgentTools' CreateSymbolDoc tool can be called inside WLJS (Wolfram`AgentTools`$DefaultMCPTools["CreateSymbolDoc"][...]) but the page then carries WLJS box markup "(*BB[*)" in 6 cells (usage/notes) - unusable in Mathematica. In a fresh kernel (wolframscript) the page is clean, but the example evaluates only if the paclet is installed (PacletDirectoryLoad not enough); the kernel also segfaults on exit after writing the file. Route: fresh kernel, paclet installed (owner's OK) or examples filled later.
- wolfram-notebooks: in the WLJS kernel ReadNotebook output contains WLJS box markup and WriteNotebook fails (ImportMarkdownString internal error). Keep wolfram-direct (tested: clean static read).
- General finding: WLJS redefines MakeBoxes, Cell, Notebook, StyleBox, CurrentValue, Rasterize, ToString and other front-end symbols, so anything that builds a Mathematica .nb must run in a fresh kernel.
- wiki-search-wolfram: offline part works through wolfram-direct WolframLanguageContext (relevant NestWhile/NestWhileList snippets). WLJS's own docs search (mcp__wljs__search_wolfram_docs, `wljs docs`) returns "No results" for every topic (even Plot): its llms-full.txt corpus is not on this computer. Online searches not run (not approved).
- project-tour: works with the WLJS adaptation: Tour/Tour.md plan; section 1 narrative (.md) + code (.wl) combined into Tour/Tour_01.wln with tools/md2wln.py; opens rendered, code evaluates in WLJS ({111, 9232, ...}).
- backlog-refine: works: one sitting turn on a new Backlog item (TrajectoryPeaks): human sections left to the owner with `> Waiting on: you`, a WLJS probe (peaks below 10^4 match OEIS A006884; 16 s for 10^5), an off-by-one trap recorded, one open question; readiness check fails as it should (item stays in Backlog).
- backlog-autolab: not run: dispatching background agents and worktrees needs the owner's OK each time (model, effort, expected usage).
- paclet-publish: not run past the local build (paclet-build tested); every further step publishes to Wolfram Cloud (owner's OK).
- paper-lean: fails here: Lean 4, Mathlib and the lean-lsp MCP are not installed (large downloads; owner's OK).
- paper-cite, wiki-search-math, wiki-add-resource: not tested: need internet (not approved Oct 21).
- Modelica in WLJS (validate / diagnose / simulate / simulate-and-plot): validate = Import + SystemModelSimulate build: a broken connector gives SystemModelSimulate::bldl "Element not found ... 'flange_x' was not found" (precise); ModelicaString 0.02 s (first call slow: 20 s cell limit hit once). diagnose basics: states, parameters, equation count from SystemModel[...]; QuantityVariable boxes show raw in WLJS -> map to names. simulate: mass.s(1) within 2e-6 of exact (3 s run). SystemModelPlot renders live. Deep diagnose reports (blocks, tearing, events, numerics) only in wsm-toolkit.
- annotate-modelica-graphics: works: wsm-toolkit schematic --annotate --write (3 Placement, 2 Line); model still builds in WLJS. Diagram itself shows only in the System Modeler app.
- annotate-control-panel: works: panel --suggest (fix: suggested min 0 for mass/spring is singular -> 0.1/0.5), --annotate --write; model builds in WLJS; WLJS equivalent: Manipulate over SystemModelSimulate with "ParameterValues" -> sliders render, moving c re-simulates (screenshot checked).
- annotate-modelica-plots: works: figures --suggest from a vars file, --annotate --write; model builds in WLJS; plots reproduced live with SystemModelPlot.
- annotate-modelica-animation: works (annotation written by hand per upstream on a MultiBody pendulum; builds and simulates in WLJS; swing plotted). The stored animation plays only in System Modeler (not opened). Test-model trap: BodyShape needs r_CM or it does not swing.
- search-modelica-docs: works offline through wsm-toolkit docs (relevant MSL spring examples with code). No WLJS equivalent (bundled corpus is the toolkit's).
- create-hydraulic-model: fails here: the Hydraulic Modelica library is not installed (wsm --mode libraries lists only MSL and the bundled example libraries; SystemModel["Hydraulic.Examples..."] is not a loaded model). The knowledge-graph tool itself runs (hydraulic --stats/--examples/--rag). Getting the library is the owner's call.
- modelica-model-architecture: works: a directory-form library (package.mo + package.order per level, one class per file, GettingStarted/Examples/Components, SI unit types) loads in WLJS with no messages; Examples.Ringing gives x(1) = 0.904673 (exact 0.904672).
- wolfram-setup: works as a diagnostic (Wolfram 15.0 at <Wolfram-install>/15.0; WLJS ready; wljs MCP registered; Step 5 verify Expand[(x+1)^5] correct in WLJS). Nothing installed.
- wolfram-investigation: read-only test (<private-project> repo unchanged): NotebookDriftReport on docs/wolfram/chart-behavior.nb -> fresh kernel Clean -> True; WLJS kernel Clean -> False with Part::partd ("date[[1]]") - a false drift alarm caused by WLJS's notebook/date overrides. Route: the managed .nb lifecycle stays in a fresh kernel (stated reason); WLJS only for exploratory computation.
- create-wolfram-documentation: steps 1-5 work offline (survey, backup to docs-backup-<ts>, NotebookToMarkdown port of the symbol page, .md edited, MarkdownToNotebook rebuild in a fresh kernel with the paclet folder loaded -> example evaluates to the records, no WLJS markup). Step 6 (PacletPage) needs a cloud download: not run. wolframscript segfaults on exit after notebook tooling (file already written).
- astro-observation-planner: not tested (internet not approved). Offline check is misleading: Sunset[...] returns 00:00 instead of failing; MoonPhase and AstroPosition stay unevaluated. Never present offline results from this skill.

## MarkdownToNotebook authoring skills and the notebook converter: tested (Oct 21, 2026)
**Wolfram/Parser 1.3.1 installed** (owner-approved; 19 MB; internet allowed for that one install command only).

**Converter suite** (`tests.wls`, MarkdownToNotebook @ 4d1e1391; regressions plus round trips of every example
document), offline (`$AllowInternet = False`):

| | Passed |
|---|---|
| without Wolfram/Parser | 107 / 174 (failures caused by the missing paclet: math 26, round trips 22, text/box 19) |
| **with Wolfram/Parser 1.3.1** | **174 / 174** |

**Skill builds:** one real source per skill converted offline to its Wolfram format (`run.wls`; examples from the
repo, plus two small sources written from the tech-note and overview templates), output checked to be a `Notebook`.

| Skill | Built | Cells | Notes |
|---|---|---|---|
| wolfram-computational-essay (PiIsMostlyRandom) | yes | 31 | clean |
| wolfram-data-repository (WallpaperGroups) | yes | 150 | category checkboxes empty offline |
| wolfram-demonstration (BlochSphereGates) | yes | 123 | category checkboxes empty offline |
| wolfram-example-repository (PrimeSpiralPoints) | yes | 88 | category checkboxes empty offline |
| wolfram-function-resource (Memoize) | **no** | – | **needs the internet**: fetches a template (`URLFetch::offline`), times out after 300 s |
| wolfram-prompt (AdaLovelace) | yes | 158 | category checkboxes empty offline |
| wolfram-symbol-page (MazeWalkTime) | yes | 142 | example code needs its paclet loaded (test setup) |
| wolfram-guide-page (DocPageExamples) | yes | 60 | clean |
| wolfram-paclet (ResourceDefinition) | yes | 239 | example code needs its paclet loaded (test setup) |
| wolfram-tech-note (test source) | yes | 23 | clean |
| wolfram-overview-page (test source) | yes | 16 | clean |

`create-wolfram-documentation` orchestrates the page skills above; not run on its own.

**Demonstration in WLJS:** the BlochSphereGates `Manipulate` does not run unmodified in WLJS (stays unevaluated,
`Last::normal`; `Show` of 3D scenes not merged). After three changes it runs live with 3D graphics and gate menus:
control lists computed before `Manipulate` (`With`), one `Graphics3D`, unsupported control options dropped.
Recorded in ROUTES.md.

## System Modeler (validate / simulate / diagnose / wolfram-language-modelica): tested (Oct 21, 2026)
**Test model:** `SpringTest.mo`, a 1 kg mass on a spring-damper (c = 10 N/m, d = 0.5 N·s/m), x(0) = 1 m, built from
the Modelica Standard Library 4.1.0. Exact solution x(1 s) = −0.7794217181.

| Route | Result |
|---|---|
| `wsm-toolkit wsm --mode validate` | flatten: Pass; no errors or warnings |
| `wsm-toolkit wsm --mode simulate` + `summary --at 1` | flatten/build/result: Pass; mass.s(1) = −0.77942 |
| `wsm-toolkit wsm --mode diagnose` | Pass; states springDamper.s_rel, springDamper.v_rel |
| WLJS kernel: `SystemModelSimulate[Import["SpringTest.mo"], 1]` | mass.s(1) = −0.7794217189 (exact to 9 digits) |

**Verdict:** the toolkit route and the WLJS route agree with each other and with the exact solution.

## wolfram-debugging: tested (Oct 21, 2026)
**Test data:** Wolfram's official suite for the skill, `Tests/WolframDebuggingSkill.wlt` (WolframResearch/AgentTools
@ 744d2d15, 136 tests, 123 run; the rest are skipped by the suite's own conditions). Pinned with the AgentTools test
layout at `~/.local/share/wolfram-agent-skills/agenttools/tests-744d2d…/`. Local change: the shared helper `Common.wl`
installs PacletCICD from GitHub; the local copy replaces that with print stand-ins for its four console functions
(original kept as `Common.upstream.wl`).

| Environment | Passed | Time |
|---|---|---|
| wolfram-direct (fresh kernel, no network) | 118 / 123 | 17.6 s |
| WLJS kernel (`wljs eval`, persistent session) | 118 / 123 | 52 s |

| Failing test | direct | WLJS | Cause |
|---|---|---|---|
| GetDefinitions, Cleanup-NoStateLeft | fail | fail | harness: expects a full AgentTools checkout; local helper stand-in |
| TaskReport-SubmitAndWait, SubmitAndWait-OuterTimeLimit | fail | fail | a timed-out task remains in `Tasks[]` afterwards (skill helper behaviour, both environments) |
| Load-NoMessagesNoGlobalSymbols | fail | pass | wolfram-direct preloads GeneralUtilities, which messages on load |
| DebugHTTPResponse | pass | **fail** | **WLJS-specific:** WLJS overrides `FormObject`, so local `APIFunction` evaluation breaks (`Function::slot1`) |

**Verdict:** works on WLJS. Debug `APIFunction`/HTTP code in wolfram-direct.
