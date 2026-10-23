#!/usr/bin/env node
// Generates skills/<name>/SKILL.md: one thin local adaptation per upstream Wolfram skill, routed to WLJS.
// Upstream skills stay pinned and unedited; each generated skill points to its upstream SKILL.md, to ROUTES.md
// (local routes and rules, which take precedence), and adds what changes on WLJS plus any gated actions.
// Run: node build.mjs   (rewrites skills/ from the table below; check results with: node build.mjs --check)
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const HOME = homedir();
const REPO = new URL('.', import.meta.url).pathname;
const ROUTES = join(REPO, 'ROUTES.md');
// Upstream locations. Defaults match setup.sh; override with environment variables.
const SKILLS_HOME = process.env.WOLFRAM_SKILLS_SRC || join(HOME, '.local/share/wolfram-agent-skills');
const WSM_HOME = process.env.WSM_TOOLKIT_SRC || join(HOME, '.local/share/wolfram-system-modeler-ai-toolkit');
const WLJS_APP = process.env.WLJS_APP || join(HOME, '.local/opt/wljs/app');
const SRC = {
  agenttools: join(SKILLS_HOME, 'agenttools/744d2d154871adcd2cec2ebfcf30a5eb8f65b8dd'),
  wolframskills: join(SKILLS_HOME, 'wolfram-skills/359f7770bdc49be4390669f9f96d0afd6822d88c/skills'),
  wsm: join(WSM_HOME, '991a80001b819b98e9484d26ff5e650657449d6a'),
  institute: join(SKILLS_HOME, 'wolfram-institute/82d9e00d97c5cd08ee302913618ea8ac3060b615/skills'),
  wljs: join(WLJS_APP, 'resources/app/modules/wljs-api/mcp/dist/skills'),
  own: process.env.INVESTIGATION_SKILL_SRC || join(HOME, '<private-project>/.agents/skills'),
  m2n: join(SKILLS_HOME, 'markdown-to-notebook/4d1e13918c464b89a72ee47d97f49d5d9efd52b5/skills'),
};
const LOCAL_SCRIPTS = join(SKILLS_HOME, 'agenttools/local-scripts');

// Notes shared by a group. Per-skill notes are added in the table.
const GROUP = {
  agenttools: [
    'The upstream "MCP server (preferred)" and "bundled scripts" sections are replaced by the routes in ROUTES.md. Do not run the pristine `scripts/*.wls`: each calls `PacletInstall`.',
    'Upstream assumes a persistent MCP kernel for stateful work: on this computer that is the WLJS kernel, through WLJS\'s MCP tools (`mcp__wljs__kernel_evaluate`, or notebook cells with `mcp__wljs__add_cells_batch` + `mcp__wljs__evaluate_cell`) or `wljs eval`. A fresh, network-blocked kernel is `wolfram-direct`.',
  ],
  wolframskills: [
    'Run Wolfram code from this skill in the WLJS kernel and show the result in a WLJS notebook (`mcp__wljs__new_notebook`, `add_cells_batch`, `evaluate_cell`; `wljs eval` without a window).',
  ],
  wsm: [
    'Default engine: the WLJS kernel (tested Oct 21). Validate: `Import["/abs/Model.mo"]`, then `SystemModelSimulate[model, t]`; a build error names the exact problem. Simulate: `SystemModelSimulate`. Diagnose basics: `SystemModel[m]["StateVariables" | "ParameterNames" | "SystemEquations"]` (replace `QuantityVariable[name_, _] :> name` before showing it in WLJS). Plot: `SystemModelPlot` in a WLJS notebook.',
    '`wsm-toolkit` (`wsm-toolkit help`; pinned upstream scripts, automatic provisioning disabled) is the route for what WLJS has no equivalent of: annotations (`schematic`, `panel`, `figures`), the bundled docs search (`docs`) and deep diagnose reports (`blocks`, `tearing`, `events`, `numerics`). Never run `bootstrap_env.py`, vendor installers or `InstallMCPServer`.',
    'System Modeler runs inside the WLJS kernel (tested: `SystemModelSimulate["Modelica.Mechanics.Rotational.Examples.First", 1]` → `inertia1.w` = −1.122 at t = 1). Use a WLJS notebook to show results interactively: `SystemModelPlot`, or `Manipulate` over `SystemModelSimulate` with parameter values.',
    'Use absolute model paths and a fresh explicit temp directory; read the `*.out.json` status fields, not just the exit code. Modelica can run external code: run only authorized models.',
  ],
  institute: [
    'Upstream assumes the Wolfram MCP and Mathematica `.nb` notebooks. Here: computation in the WLJS kernel (WLJS MCP tools), and notebooks are WLJS `.wln` (tested Oct 21). Live notebook: `mcp__wljs__new_notebook`, `add_cells_batch` (`.md` cells for prose, Input cells for code), `evaluate_cell`, then save with `NotebookSave[EvaluationNotebook[], "/abs/Name.wln"]` evaluated in a cell of that notebook (the Save button needs a dialog the tools cannot answer; the kernel is shared, so never park the handle in a bare global such as `nb`); saved plots reload once a kernel attaches.',
    `Unevaluated notebook from a \`.md\` source (house Markdown, \`wolfram\` fences): \`python3 ${REPO}tools/md2wln.py source.md target.wln\` (no window needed; refuses to overwrite). A skill whose result is files (backlog, wiki, paper) ends with a WLJS notebook page summarising them. A Mathematica \`.nb\` only when the owner wants one, built in a fresh kernel (ROUTES.md: WLJS redefines the notebook symbols).`,
    `Paths: upstream \`\${CLAUDE_PLUGIN_ROOT}\` means the pinned plugin root \`${SRC.institute.replace(/\/skills$/, '')}\`; relative paths resolve against the pinned skill folder. Its scripts are not modified: read a script before running it and skip any install, publish or download step (see below).`,
    'Keep the upstream folder conventions (Work/, Research/, Wiki/, Artifacts/, Archive/; nothing overwritten) and its writing rules unchanged. Install nothing; any `PacletInstall`, `pip install` or download in upstream steps needs the owner\'s OK.',
  ],
  m2n: [
    'These skills author Wolfram publishing formats (repository definition notebooks, documentation pages, Demonstrations, essays). Their deliverable is a Mathematica `.nb`, because Wolfram\'s repositories and documentation system require it: build it with the upstream converter (`MarkdownToNotebook.wl`, one folder above the skills) in a fresh kernel (wolframscript or wolfram-direct). Stated reason, measured Oct 21: in the WLJS kernel the same builds hang (data-repository), lose a section (symbol page 96 vs 142 cells) or run 30x slower (paclet), because WLJS redefines `Cell`, `Notebook`, `MakeBoxes`, `CurrentValue` and other front-end symbols. Use WLJS to run and preview the examples live (WLJS MCP tools or a WLJS notebook), with the Manipulate fixes in ROUTES.md. Harness: `tests/authoring/run.wl`.',
    '**Finish with a WLJS summary page** (required by ROUTES.md "Results go in a WLJS notebook"; Level C, Oct 22, found it skipped): a `.wln` in the working folder that lists the built `.nb` files and shows the key examples as runnable cells, live (WLJS MCP tools) or from a `.md` with `md2wln.py`. If none is made, say why.',
    `Paths: the converter and its docs are in \`${SRC.m2n.replace(/\/skills$/, '')}\`; relative paths in the upstream skill resolve against the pinned skill folder.`,
  ],
  wljs: [
    'This is WLJS\'s own guide; it applies as written. Build cells with WLJS\'s MCP tools (`mcp__wljs__add_cells_batch`, `mcp__wljs__evaluate_cell`; or `wljs cells add` / `wljs cells eval`), and check the rendered result with a screenshot (`wljs nb url <path.wln>` opens a saved notebook in the browser pane).',
  ],
};

// Test status shown in each generated skill (evidence in TESTING.md): works | works with fixes | limited | fails |
// not tested, each with its reason. Every skill is listed; Oct 21, 2026 tests ran in the WLJS desktop app.
const STATUS = {
  // AgentTools
  'wolfram-language': ['works', 'evaluation, CodeInspector, Trace and System Modeler calls run in the WLJS kernel'],
  'wolfram-debugging': ['works', "Wolfram's official suite 118/123 in WLJS = wolfram-direct; APIFunction/HTTP debugging needs wolfram-direct"],
  'wolfram-notebooks': ['works with fixes', 'ReadNotebook/WriteNotebook stay in wolfram-direct: in the WLJS kernel ReadNotebook output carries WLJS box markup and WriteNotebook fails'],
  'wolfram-paclets': ['limited', 'PacletTools`PacletBuild works in WLJS; CheckPaclet/BuildPaclet/SubmitPaclet scripts need the Wolfram/PacletCICD paclet, not installed'],
  'wolfram-alpha': ['works', 'one owner-approved query in a WLJS notebook (WolframAlpha[...] with internet on, then off)'],
  // WolframResearch/skills
  'wolfram-setup': ['works', 'diagnostic run: versions, WLJS ready, MCP entry, Expand[(x+1)^5] in WLJS; nothing installed'],
  'astro-observation-planner': ['not tested', 'needs internet (not approved); offline Sunset returns a wrong time and planets stay unevaluated'],
  // System Modeler AI Toolkit
  'validate-modelica': ['works', 'in WLJS: a build reports the exact error (missing connector); the toolkit flatten passes too'],
  'simulate-modelica': ['works', 'SystemModelSimulate in WLJS matches the exact solution'],
  'diagnose-modelica': ['works', 'states, parameters, equation count in WLJS; deep reports (blocks, tearing, events) via wsm-toolkit'],
  'simulate-and-plot-modelica': ['works', 'SystemModelPlot renders live in a WLJS notebook'],
  'wolfram-language-modelica': ['works', 'SystemModelSimulate in WLJS matches the exact solution to 9 digits'],
  'annotate-modelica-graphics': ['works', 'wsm-toolkit schematic writes Placement/Line annotations; the model still builds in WLJS'],
  'annotate-control-panel': ['works with fixes', 'panel annotation written (suggested minimum 0 for a mass is singular: raise it); a WLJS Manipulate over SystemModelSimulate re-simulates live'],
  'annotate-modelica-plots': ['works', 'figures annotation written from a vars file; plots reproduced live in WLJS'],
  'annotate-modelica-animation': ['works', 'hand-written Animation annotation on a MultiBody pendulum builds and simulates in WLJS; playback is in the System Modeler app'],
  'modelica-model-architecture': ['works', 'a directory-form library loads in WLJS with no messages; its example matches the exact solution'],
  'search-modelica-docs': ['works', 'offline search through wsm-toolkit docs'],
  'create-hydraulic-model': ['fails', 'the Hydraulic Modelica library is not installed (the knowledge-graph tool runs)'],
  // Wolfram Institute
  'project-create': ['works with fixes', 'scaffold scripts default the author/email to the upstream author: always pass the owner details'],
  'wiki-init': ['works', 'test project wiki created'],
  'wiki-update': ['works', 'run inside backlog-run'],
  'wiki-check': ['works', 'links/index checked; missing article added'],
  'notebook-create': ['works with fixes', '.wln built through the WLJS MCP tools; save with NotebookSave from the kernel (the Save button needs a dialog)'],
  'backlog-add': ['works', 'test item created'],
  'backlog-run': ['works', 'two sessions in a worktree claim; computation in WLJS matched OEIS A060412'],
  'backlog-info': ['works', 'found the finished item on its branch'],
  'backlog-review': ['works', 'check re-run in WLJS from the branch; accepted, merged, Done/'],
  'backlog-refine': ['works', 'WLJS probe, trap and open question recorded; readiness check kept the item in Backlog'],
  'backlog-board': ['limited', 'board data builds locally; publishing the page needs the owner OK (not run)'],
  'backlog-autolab': ['not tested', 'dispatching background agents needs the owner OK each time'],
  'document-revise': ['works with fixes', 'notes found in the saved .wln; version _2 written with NotebookSave to a new path'],
  'project-provenance': ['works with fixes', '.wln has no TaggingRules: the back-pointer is a hidden first .md cell'],
  'project-tour': ['works', 'tour stop built as a .wln (tools/md2wln.py); its code runs in WLJS'],
  'paper-journal': ['limited', 'sources written; no LaTeX/Typst on this computer, so no PDF'],
  'paper-create': ['limited', 'sources written (upstream script fills in the upstream author email if blank); no PDF without TeX'],
  'paper-create-note': ['limited', '.wl checked in a bare kernel, .wln via tools/md2wln.py runs in WLJS; no PDF without TeX'],
  'paper-create-notebook': ['limited', 'WLJS .wln path works; numbered statements and tag references need Mathematica and the MathNotebook paclet'],
  'paper-cite': ['not tested', 'needs internet (not approved)'],
  'paper-lean': ['fails', 'Lean 4, Mathlib and the lean-lsp MCP are not installed'],
  'paclet-build': ['works', 'PacletTools`PacletBuild in WLJS; the archive loads and runs without installing'],
  'paclet-docs': ['limited', 'CreateSymbolDoc must run in a fresh kernel (in WLJS it writes WLJS box markup); examples evaluate only if the paclet is installed'],
  'paclet-publish': ['not tested', 'past the local build every step publishes (owner OK)'],
  'wiki-add-resource': ['not tested', 'needs internet (not approved)'],
  'wiki-search-math': ['not tested', 'needs internet (not approved)'],
  'wiki-search-wolfram': ['limited', 'offline search via wolfram-direct works; WLJS docs search returns no results (corpus missing); online parts not tested'],
  // Owner
  'wolfram-investigation': ['works with fixes', 'lifecycle stays in a fresh kernel: in WLJS NotebookDriftReport falsely reports drift'],
  // MarkdownToNotebook authoring
  'create-wolfram-documentation': ['limited', 'steps 1-5 work offline (survey, backup, port, rebuild); PacletPage publishing needs a download'],
  'wolfram-computational-essay': ['works', 'example builds a valid notebook offline (31 cells, no messages)'],
  'wolfram-guide-page': ['works', 'example builds a valid guide notebook offline'],
  'wolfram-tech-note': ['works', 'test source builds a valid tech-note notebook offline'],
  'wolfram-overview-page': ['works', 'test source builds a valid overview notebook offline'],
  'wolfram-symbol-page': ['works with fixes', 'build in a fresh kernel (in WLJS a section is lost: 96 vs 142 cells)'],
  'wolfram-paclet': ['works with fixes', 'build in a fresh kernel (3 s; WLJS 106 s and 2 graphics missing)'],
  'wolfram-data-repository': ['limited', 'builds in a fresh kernel (hangs in WLJS); category checkboxes stay empty offline'],
  'wolfram-example-repository': ['limited', 'builds offline; category checkboxes stay empty without Wolfram servers'],
  'wolfram-prompt': ['limited', 'builds offline; category checkboxes stay empty without Wolfram servers'],
  'wolfram-demonstration': ['limited', 'builds offline (empty categories); in WLJS the example needs three Manipulate fixes, then runs live'],
  'wolfram-function-resource': ['not tested', 'needs internet to build (fetches a template; not approved)'],
};
for (const n of ['async-programming', 'dynamics', 'formatting', 'html', 'javascript', 'markdown', 'mermaid', 'migration', 'slides', 'special-cells', 'wlx'])
  STATUS[`wljs-${n}`] ??= ['works', "WLJS's own guide, used in the WLJS app (Oct 21)"];
STATUS['wljs-migration'] = ['works', '.nb -> .wln conversion works; Manipulate fixes recorded in ROUTES.md'];
STATUS['wljs-dynamics'] = ['works', 'Manipulate renders live with JIT updates'];

// Protocol v2 results (TEST-PLAN.md), read from tests/levelB/verdicts.json (Level B grades). "works" is only given
// after Level C; until then each label says Level B and what is still pending. Missing = not tested.
const V2 = {};
{
  const vf = join(REPO, 'tests/levelB/verdicts.json');
  const verdicts = existsSync(vf) ? JSON.parse(readFileSync(vf, 'utf8')) : {};
  for (const [name, v] of Object.entries(verdicts)) {
    if (name.startsWith('_') || name.includes('.attempt')) continue;
    if (v.blocked) { V2[name] = ['not tested', `${v.blocked.replace(/\.$/, '')}; would run only if the owner lifts rule 0 (no Wolfram-server contact) for this skill`]; continue; }
    const c = v.correct || '', fixed = (v.findings || []).some(f => /\((fixed|note added|recipe fixed|route added)|fixed in |note added|updated/.test(f));
    const date = 'Oct 22 skill invocation, run log in tests/runs/2026-10-22/' + name;
    let label;
    const lc = v.levelC, lcOk = lc && (lc.agree || /^(accepted|rejected with evidence)/.test(lc.resolution || ''));
    const fields = [v.route, v.notebook, c, v.clean].map(x => x || '');
    const partial = fields.some(x => /^partial/.test(x)), failed = fields.find(x => /^fail/.test(x));
    const lc2 = v.levelC2; if (lc2 && !(lc2.agree || /^(accepted|agree)/.test(lc2.resolution || ''))) { V2[name] = ['Level C pending', c]; continue; }
    if (v.needsReview && !v.inprogress && !v.rerun) { V2[name] = ['Level B passed (Level C pending on the rerun)', c]; continue; }
    if (lcOk && !v.rerun && !v.inprogress) {
      if (/^gate verified/.test(c)) label = 'limited: approval gate verified, the gated action itself was not run (no owner present)';
      else if (failed) label = 'fails: ' + failed;
      else if (partial) label = 'limited: ' + fields.filter(x => /^partial/.test(x)).map(x => x.replace(/^partial:\s*/, '')).join('; ');
      else label = v.fixedBy ? 'works with fixes (' + v.fixedBy + ')' : 'works';
      const notes = (v.findings || []).filter(f => /fixed|note added|updated|route added/.test(f));
      V2[name] = [label, `${c.replace(/\.$/, '')} [route: ${(v.route || '').replace(/\.$/, '')}; ${date}; independent review (Level C, reviewer ${lc.reviewer}) ${lc.agree ? 'agrees' : 'disagreed, ' + lc.resolution + ': ' + lc.reason}${notes.length ? '; skill or card notes changed after the run: ' + notes.join('; ') : ''}]`];
      continue;
    }
    if (v.inprogress) label = 'Level B in progress';
    else if (v.rerun) label = 'Level B rerun needed';
    else if (/^stage 1/.test(c) && /pending/.test(v.scripted || v.notebook || '')) label = 'Level B in progress';
    else if (/^gate verified/.test(c)) label = 'Level B passed at its approval gate (Level C pending)';
    else if (/^partial/.test(c) || /^partial/.test(v.notebook || '')) label = 'Level B partial (Level C pending)';
    else if (/^(pass|stage 1 pass)/.test(c)) label = fixed ? 'Level B passed with fixes (Level C pending)' : 'Level B passed (Level C pending)';
    else label = 'Level B needs review';
    V2[name] = [label, `${c.replace(/\.$/, '')} [route: ${(v.route || '').replace(/\.$/, '')}; ${date}]`];
  }
}

const T = (name, src, rel, notes = [], gated = []) => ({ name, src, rel, notes, gated });
const SKILLS = [
  // Wolfram AgentTools agent skills (WolframResearch/AgentTools, Assets/AgentSkills)
  T('wolfram-language', 'agenttools', 'wolfram-language', [
    'Tool map: `WolframLanguageEvaluator` → `wljs eval` (stateful) or wolfram-direct (isolated). `WolframLanguageContext` → wolfram-direct (offline semantic documentation search); `wljs docs <query>` for WLJS-specific documentation. `SymbolDefinition`, `CodeInspector`, `TestReport` → wolfram-direct, or the same functions in the WLJS kernel (`Needs["CodeInspector`"]` works there).',
    'Upstream says to always use `\\[FreeformPrompt]` natural-language input for entities and quantities. It needs Wolfram|Alpha (online). Offline, construct `Quantity`/`Entity` explicitly; use free-form input only with internet turned on by the owner.',
    'Show graphics live in a WLJS notebook by default: WLJS draws them as interactive vectors (D3/SVG, Plotly, three.js for 3D), not pictures. Only when an image file is needed (a report, or to look at a plot outside a notebook) export one: PNG through wolfram-direct (headless WLJS cannot rasterize), SVG works in WLJS.',
  ]),
  T('wolfram-debugging', 'agenttools', 'wolfram-debugging', ['**`FailedAssertions` right after loading** (bug W5 in tests/bugs/BUGS.md): with assertions Off, after one plain call of a function with a `Block` body the helper reports 0 failures until the definitions are reloaded; call it right after `Get`, or reload first.', '**Use the helpers, and leave global state alone** (Level C, Oct 22: a run diagnosed an `Assert` failure by turning `On[Assert]` globally in the shared kernel and never used the helpers). For assertions call `WolframDebugging`FailedAssertions[expr]` (works with Assert off; gives the line, file and caller); for messages `WolframDebugging`CollectMessages[expr]`. Never toggle `On`/`Off`, `$AssertFunction` or other global settings in the shared WLJS kernel; use `Block` or a fresh kernel.', 
    'Environment for the upstream "where does the code run?" table: the WLJS kernel reports `$EvaluationEnvironment` = "Session", `Global` context, and `Trace` works (tested). It is a shared, persistent kernel: follow upstream rule 7 (scope every change).',
    `Load the helpers once per WLJS session: \`wljs eval 'Get["${SRC.agenttools}/wolfram-debugging/scripts/WolframDebugging.wl"]'\`, then call e.g. \`wljs eval 'WolframDebugging\`CollectMessages[expr]'\` (tested).`,
    'Reproduce autoloading or package-loading problems in a fresh kernel (wolfram-direct), as upstream rule 8 says.',
    'Tested (TESTING.md): Wolfram\'s official suite for this skill passes 118/123 in WLJS, the same as in wolfram-direct. Exception: debug `APIFunction`/HTTP code (`DebugHTTPResponse`) in wolfram-direct: WLJS changes `FormObject`, so local API calls misbehave there.',
  ]),
  T('wolfram-notebooks', 'agenttools', 'wolfram-notebooks', [
    'Overlap: for a project or research notebook (house style, Work/Research folders) use `notebook-create` instead; this skill is for plain reading and one-off conversions.',
    'Reading a `.nb`: `ReadNotebook` through wolfram-direct (static source, no evaluation). Writing a `.nb` from Markdown: `WriteNotebook` through wolfram-direct. Stated reason, measured Oct 21: the same AgentTools tools can be called inside the WLJS kernel, but there `ReadNotebook` output carries WLJS box markup (`(*BB[*)...`) and `WriteNotebook` fails (ImportMarkdownString internal error).',
    `A Markdown source becomes a WLJS notebook without a window: \`python3 ${REPO}tools/md2wln.py source.md target.wln\`.`,
    'WLJS notebooks: create `.wln` cell by cell (see ROUTES.md); `.md` cells take Markdown with KaTeX math. To bring a `.nb` into WLJS, copy it to a work folder and open its URL (`wljs nb url /abs/copy.nb`) in the browser pane: WLJS writes the converted `.wln` beside the copy (tested; not always lossless; Manipulate `Initialization` and some options need the fixes in ROUTES.md).',
  ]),
  T('wolfram-paclets', 'agenttools', 'wolfram-paclets', [
    'Overlap: this is for a quick check or build; for the full workflow (stand-alone functions, docs pages, release) use the Institute `paclet-build`, `paclet-docs`, `paclet-publish`.',
    'Build in the WLJS kernel: load the PacletTools package, then `PacletBuild["/abs/paclet"]` (full name ``` PacletTools`PacletBuild ```) writes `build/<Publisher>__<Name>-<version>.paclet` (tested Oct 21). Try it without installing: `ExtractArchive` to a work folder, `PacletDirectoryLoad` it, test, then `PacletDirectoryUnload`.',
    `The local no-install script copies (\`wolframscript -f ${LOCAL_SCRIPTS}/CheckPaclet.wls /abs/paclet\`, \`BuildPaclet.wls\`, \`SubmitPaclet.wls\`) need the Wolfram/PacletCICD paclet, installed Oct 22 (0.36.2): \`CheckPaclet.wls\` runs and reports, but its report formatting then fails inside AgentTools (Level A finding).`,
  ], ['`SubmitPaclet` publishes to the public Wolfram Paclet Repository: only with the owner\'s explicit OK for that submission.']),
  T('wolfram-alpha', 'agenttools', 'wolfram-alpha', [
    `Default route: WLJS. \`wljs-server online on\`, then \`WolframAlpha["query", {{"Result", 1}, "ComputableData"}]\` in a WLJS notebook cell, then \`wljs-server online off\` and check \`$AllowInternet\` is False (tested Oct 21: Earth–Moon distance → Quantity in miles). Other routes: the Wolfram MCP tools when present (\`mcp__Wolfram__WolframAlpha\`, \`mcp__Wolfram__WolframContext\`), or \`wolframscript -f ${LOCAL_SCRIPTS}/WolframAlpha.wls\` / \`WolframAlphaContext.wls\`.`,
  ], ['Every Wolfram|Alpha query is online (Wolfram\'s service). Tell the owner when a result came from it; turn the WLJS kernel\'s internet back off afterwards (`wljs-server online off`).']),
  // WolframResearch/skills
  T('wolfram-setup', 'wolframskills', 'wolfram-setup', [
    'Everything this skill installs already exists here: Mathematica 15.0 with wolframscript, AgentTools 2.2.0, System Modeler, WLJS 3.1.4 (`wljs-server`). Use the skill to diagnose a setup (versions, activation, PATH, MCP configuration), not to reinstall.',
  ], ['Installing or activating an engine, editing any client\'s MCP configuration (Claude desktop, Claude Code, others), or connecting to the remote Wolfram MCP: owner\'s OK each time; back up any configuration file first.']),
  T('astro-observation-planner', 'wolframskills', 'astro-observation-planner', [
    `Load the upstream references into the WLJS kernel (\`wljs eval 'Get["${SRC.wolframskills}/astro-observation-planner/references/astro-observation-core.wl"]'\`, then the dso file) and show sky charts and tables in a WLJS notebook.`,
  ], ['Locations, ephemerides and catalogue data may need Wolfram\'s online data: turn the WLJS kernel\'s internet on only with the owner\'s OK.']),
  // Wolfram System Modeler AI Toolkit (12)
  ...[
    ['annotate-control-panel', '**Show the result:** build the equivalent WLJS Manipulate from the panel annotation and check it renders and re-simulates; also render the model diagram via a fresh kernel (ROUTES.md). These are native System Modeler Explore controls inside the .mo model. To explore interactively in WLJS instead, build a `Manipulate` over `SystemModelSimulate[model, t, <|"ParameterValues" -> {...}|>]` with `ContinuousAction -> False` (each change re-simulates; tested Oct 21, sliders render and re-simulate). Check the suggested ranges: `panel --suggest` proposed a minimum of 0 for a mass and a spring constant, which makes the model singular; raise it. Seen Oct 22: the panel analyzer finds no parameters that are set as component modifiers (`resistor1.R` in ElectricCircuit), so write the panel spec by hand; after writing, remove any leftover empty `__Wolfram` marker so the annotation is not duplicated; `--report` prints nothing for no-recompile runs (read the result `.mat` instead).'],
    ['annotate-modelica-animation', '**Show the result:** replay the simulated 3D motion in WLJS (Graphics3D + Manipulate over time, with the trace of the followed object) and look at it; it is a replay, not the System Modeler renderer (ROUTES.md). Seen Oct 22 (two runs): reading many sampled positions from a simulation inside the WLJS kernel stalled it past 220 s. Export the frame positions from a network-cut fresh kernel to JSON (`chainLinkN.frame_a.r_0[1..3]` etc. at a few hundred times), then in WLJS only `Import[..., \"RawJSON\"]` and draw the `Manipulate[Graphics3D[...]]` replay (instant; checked by the orchestrator). The 3D animation plays in the System Modeler desktop app. In WLJS, show `SystemModelPlot` results or 3D graphics built from simulated positions.'],
    ['annotate-modelica-graphics', '**Show the result:** render the laid-out diagram and icon in a network-cut fresh kernel (`m["Diagram"]`, `m["Icon"]`), export PNG, import it into the WLJS notebook and look at it (ROUTES.md, System Modeler visuals). Diagrams render in the System Modeler desktop app. Headless WLJS cannot rasterize them (`SystemModel[m]["Diagram"]` returns partial graphics with messages): use `wsm-toolkit schematic` output or the desktop app. Pin positions now come from the installed library source (local fix for bug W4, Oct 22: 98% of the line ends in System Modeler\'s 193 bundled examples match); read any `WARNING:` lines, which mark ends that were still guessed, and look at the rendered diagram, since lines can still cross their own icon. Confirm the flattened model is unchanged apart from annotations.'],
    ['annotate-modelica-plots', '**Show the result:** plot every stored figure with `SystemModelPlot[sim, name, PlotRange -> All]` for `m["PlotNames"]` in the WLJS notebook and look at it. Stored figures reopen in the System Modeler desktop app; reproduce them live in WLJS with `SystemModelPlot`.'],
    ['create-hydraulic-model', 'The Hydraulic Modelica library is not installed on this computer (Oct 21: `wsm-toolkit wsm --mode libraries` lists only the MSL and the bundled example libraries). The knowledge-graph tool (`wsm-toolkit hydraulic`) runs, but models that use `Hydraulic.*` cannot be built until the owner gets the library.'],
    ['diagnose-modelica', ''],
    ['modelica-model-architecture', 'Check a directory-form library in WLJS with `Import["/abs/Lib/package.mo"]` and `SystemModelSimulate["Lib.Examples.X", t]` (tested Oct 21).'],
    ['search-modelica-docs', ''],
    ['simulate-and-plot-modelica', 'Default: simulate in the WLJS kernel and plot with `SystemModelPlot` in a WLJS notebook (live, not a static PNG). The upstream DyMat/Python path is the fallback when no kernel is available.'],
    ['simulate-modelica', ''],
    ['validate-modelica', ''],
    ['wolfram-language-modelica', 'Look at every plot you report (capture the window or project the cell) and pass `PlotLegends` a flat list of labels: a list of one-element lists gives one separate legend per curve, all the same colour (Level C, Oct 22). This skill\'s Wolfram Language work runs directly in the WLJS kernel (WLJS MCP tools or `wljs eval`), with results shown in a WLJS notebook.'],
  ].map(([n, extra]) => T(n, 'wsm', n, extra ? [extra] : [])),
  // Wolfram Institute: computational-research plugin 6.0.0 (27)
  T('backlog-add', 'institute', 'backlog-add'),
  T('backlog-autolab', 'institute', 'backlog-autolab', [],
    ['Dispatching background subagents, headless `claude -p` runs, cron/scheduled runs, new worktrees and any settings.json or allowlist change: owner\'s OK for each, stating the model, effort and expected usage. Included subscription access only; no paid fallback.']),
  T('backlog-board', 'institute', 'backlog-board', [], ['Publishing or syncing the board page: owner\'s OK each time (it is a claude.ai page; check who can see it).']),
  T('backlog-info', 'institute', 'backlog-info'),
  T('backlog-refine', 'institute', 'backlog-refine'),
  T('backlog-review', 'institute', 'backlog-review', ['When an item produced Wolfram results, re-run the acceptance checks in the WLJS kernel and show them in a notebook during the review.']),
  T('backlog-run', 'institute', 'backlog-run', ['Creating the item\'s worktree and `work/<Item>` branch and committing the one finished task, including its Ready → Active and Active → UnderReview moves, are part of this skill: do them without asking, following the repository\'s own rules (Level C review, Oct 22: the earlier wording was ambiguous).'], ['Merging, pushing, or deleting a branch or worktree.']),
  T('document-revise', 'institute', 'document-revise', ['For a WLJS `.wln` document, read owner notes written as `<< ... >>` in its cells (`grep -n "<<.*>>" Name.wln`, or `mcp__wljs__list_cells` / `get_cell_lines`), edit the cells with `mcp__wljs__set_cell_lines`, and write the round as the next numbered `.wln` with `NotebookSave[nb, "/abs/Name_2.wln"]` so version k keeps its notes; write `Name_2.md` and `<stem>.provenance.md` beside it (tested Oct 21).']),
  T('notebook-create', 'institute', 'notebook-create', ['Overlap: for a plain notebook read or a one-off Markdown conversion use `wolfram-notebooks` instead.', 'Default target is a WLJS `.wln` (prose in `.md` cells, KaTeX math, code in Input cells), keeping the upstream content rules (including the "[[ LLM Generated ]]" subtitle). The upstream `.nb` pipeline (`ImportString[md, {"Markdown","Notebook"}]` + post-processing) remains available through wolfram-direct when a Mathematica notebook is wanted.'],
    ['Upstream may `PacletInstall` a rich converter or publish notebooks: owner\'s OK each time.']),
  T('paclet-build', 'institute', 'paclet-build', ['Overlap: for a quick check or build alone, `wolfram-paclets` is enough.', 'Build in the WLJS kernel with `PacletBuild["/abs/paclet"]` from the PacletTools package (tested Oct 21; archive in `build/`); try it without installing by extracting it and using `PacletDirectoryLoad` / `PacletDirectoryUnload`. Upstream `build_paclet.wls` also installs (gated). `PacletBuild` refuses a paclet whose `PacletInfo.wl` declares a `Documentation` extension when that folder has not been generated yet (seen Oct 22 on DocPageExamples): build the docs first, or for a code-only archive stage everything but `Documentation/` and use `CreatePacletArchive` (upstream recipe, install step removed) and say the archive still declares the extension.'],
    ['Installing the built paclet into the local Wolfram paclet repository (`PacletInstall`): owner\'s OK.']),
  T('paclet-docs', 'institute', 'paclet-docs', ['Generating documentation pages locally is fine. **The deliverable is the built page in the paclet\'s `Documentation/English/ReferencePages/Symbols/`** (so `?Symbol` and F1 can find it). If the paclet builds its docs from Markdown (a `docs/*.md` folder and a `build.wls` that regenerates `Documentation/`), write `docs/<Symbol>.md` and then run the paclet\'s own build in a network-cut fresh kernel so the page lands in `Documentation/` (Level C, Oct 22: stopping at `build/DocSource` authoring notebooks is incomplete); check the built page for a stray `General::stop` cell. The upstream `mcp__Wolfram__CreateSymbolDoc` tool is AgentTools\' `$DefaultMCPTools["CreateSymbolDoc"]`; call it in a fresh kernel (wolframscript). Stated reason, measured Oct 21: called in the WLJS kernel it writes WLJS box markup (`(*BB[*)`) into 6 cells of the page. Its examples evaluate only when the paclet is installed (loading the paclet folder is not enough), so either install it (owner\'s OK) or fill example outputs with the MarkdownToNotebook route (`create-wolfram-documentation`), which evaluates with the folder loaded. wolframscript may segfault on exit after writing the page; check the file.'], ['Writing the pages: first agree the symbol list and one page\'s layout with the user, then write the rest. This is a hard stop: with nobody to ask, write one page, stop, and list the questions (Oct 22: two test runs skipped it and wrote everything).', 'Deploying documentation publicly: owner\'s OK each time.']),
  T('paclet-publish', 'institute', 'paclet-publish', [], ['Everything this skill does past a local build publishes to Wolfram Cloud with a public URL: owner\'s explicit OK for each publication.']),
  T('paper-cite', 'institute', 'paper-cite', ['The upstream `cite_from_id.wls` fetches inside a Wolfram kernel, which would need `$AllowInternet = True` (not allowed here). Instead fetch the metadata with `curl` from arXiv / doi.org (not Wolfram servers), save it to a scratch file, and run the script\'s formatting on that file in a network-blocked kernel (wolfram-direct). Found by the Oct 22 test run.'], ['Looking up arXiv/DOI metadata is online: say so; fine when the owner asked for the citation.']),
  T('paper-create', 'institute', 'paper-create', ['**Check the literature before calling a result new** (Oct 22 test: a paper notebook presented a parity theorem as its own; a later search found it is Corollary 3.9 of Buratti-Stinson 2021 and was implied by older work). Before writing any theorem the paper does not cite, look it up with the `wiki-search-math` skill (OEIS for computed values, arXiv, nLab, Wikipedia; never MathWorld, owner rule 0) and record what you read with `wiki-add-resource`. If it is known, cite it and say the proof here is a reproof; if nothing is found, say which searches were made.', 'Computations a paper relies on run in the WLJS kernel; keep their code and outputs in a companion `.wln`.', 'Pass the operator and email to `scaffold-paper.sh` explicitly: left blank, it fills in the upstream author\'s email address. Freedom level is one of Directed / Guided / Open exploration. TinyTeX (`latexmk`, `biber`) and Typst are installed (Oct 22): compile the PDF. The upstream `scaffold-paper.sh` drops backslashes in its arguments (`\\_` becomes `_`) and breaks on `&` or `|` in a title: check the generated `.tex`. A bracketed remark label typed right after `\\begin{remark}` renders in parentheses: write `{[}...{]}` (found by the Oct 22 test run).']),
  T('paper-create-note', 'institute', 'paper-create-note', ['**Check the literature before calling a result new** (Oct 22 test: a paper notebook presented a parity theorem as its own; a later search found it is Corollary 3.9 of Buratti-Stinson 2021 and was implied by older work). Before writing any theorem the paper does not cite, look it up with the `wiki-search-math` skill (OEIS for computed values, arXiv, nLab, Wikipedia; never MathWorld, owner rule 0) and record what you read with `wiki-add-resource`. If it is known, cite it and say the proof here is a reproof; if nothing is found, say which searches were made.', 'The note\'s notebook is a `.wln` (and a `.nb` only if wanted); its `.wl` file must load in a bare kernel: check with wolfram-direct. Every number must come from a kernel run in this session. Build the `.wln` from the `.md` with `tools/md2wln.py`; compile the `.tex` with the installed TinyTeX (`latexmk -pdf`).'],
    ['Nothing is uploaded; any cloud step in upstream needs the owner\'s OK.']),
  T('paper-create-notebook', 'institute', 'paper-create-notebook', ['**Check the literature before calling a result new** (Oct 22 test: a paper notebook presented a parity theorem as its own; a later search found it is Corollary 3.9 of Buratti-Stinson 2021 and was implied by older work). Before writing any theorem the paper does not cite, look it up with the `wiki-search-math` skill (OEIS for computed values, arXiv, nLab, Wikipedia; never MathWorld, owner rule 0) and record what you read with `wiki-add-resource`. If it is known, cite it and say the proof here is a reproof; if nothing is found, say which searches were made.', 'Write the paper as a WLJS `.wln` (numbered environments as `.md` cells, KaTeX math, examples as Input cells with their outputs). Statement numbering and `{#Tag}` references need Mathematica\'s front end: WLJS shows them as typed. The upstream `.nb` build needs the MathNotebook paclet from a personal Wolfram Cloud URL (download: owner\'s OK).']),
  T('paper-journal', 'institute', 'paper-journal'),
  T('paper-lean', 'institute', 'paper-lean', [], ['Lean 4.35.0 (elan), a Mathlib project with its cache (`tests/out/lean/LeanTest`) and the lean-lsp MCP are installed (Oct 22, DEPENDENCIES.md). The lean-lsp tools exist only in Claude sessions started after that install; without them, check proofs on the command line with `lake env lean File.lean` (`exact?`, `#print axioms` to confirm no `sorry`). Lean needs no Wolfram kernel; any Wolfram cross-check runs in the WLJS kernel.']),
  T('project-create', 'institute', 'project-create', ['Scaffold the folders and wiki; record that Wolfram work runs on WLJS (ROUTES.md) in the new project\'s notes.', 'Pass the author and email to the scaffold scripts explicitly: left blank they default to the upstream author. `check-env.sh` reports "Wolfram MCP not detected" because it does not know the WLJS MCP server; that is expected. Step 5 (download papers) is online: owner\'s OK.'],
    ['Installing git hooks, changing settings.json or allowlisting MCP servers: owner\'s OK each time.']),
  T('project-provenance', 'institute', 'project-provenance', ['A `.wln` has no `TaggingRules`: embed the back-pointer as the notebook\'s first `.md` cell holding the `<!-- provenance: ... -->` comment (renders invisibly; tested Oct 21). Ledger and other rules as upstream.']),
  T('project-tour', 'institute', 'project-tour', ['Build each tour stop as a WLJS notebook (narrative `.md` + runnable code) so the owner can run it live: combine `Tour/Sections/NN_Name.md` and `Tour/Code/NN_Name.wl` into `Tour/Tour_NN.md` and convert with `tools/md2wln.py` (tested Oct 21).']),
  T('wiki-add-resource', 'institute', 'wiki-add-resource', [], ['Downloading a resource or running `pip install`: owner\'s OK each time (state source and size).']),
  T('wiki-check', 'institute', 'wiki-check'),
  T('wiki-init', 'institute', 'wiki-init'),
  T('wiki-search-math', 'institute', 'wiki-search-math', ['The upstream `search_*.wls` scripts fetch from inside a Wolfram kernel (needs `$AllowInternet = True`: not allowed here). Send the same queries with `curl` to OEIS, nLab, DLMF and Wikipedia. Skip MathWorld: it is a Wolfram site (ROUTES.md rule 0). Found by the Oct 22 test run.'], ['Searches online sources (nLab, OEIS, DLMF, Wikipedia; not MathWorld): say so.']),
  T('wiki-search-wolfram', 'institute', 'wiki-search-wolfram', ['For installed documentation, use the offline search (`WolframLanguageContext` via wolfram-direct; tested Oct 21). WLJS\'s own docs search (`mcp__wljs__search_wolfram_docs`, `wljs docs`) returns no results here: its corpus is not on this computer.'],
    ['Function Repository, Community and other online searches: say so.']),
  T('wiki-update', 'institute', 'wiki-update'),
  // The owner's own Wolfram skills (2). The Coherence project skill is edited in place (project-level).
  T('wolfram-investigation', 'own', 'wolfram-investigation', [
    '<private-project>-specific lifecycle skill (Markdown source → generated `.nb`, fingerprinted). Its rules stay as written; Wolfram computation for an investigation may run in the WLJS kernel, but the managed `.nb` pipeline and its drift checks are unchanged: do not replace the tracked `.nb` with a `.wln`. Stated reason, measured Oct 21 (read-only): `NotebookDriftReport` on `docs/wolfram/chart-behavior.nb` gives Clean -> True in a fresh kernel but a false drift (Clean -> False, `Part::partd`) in the WLJS kernel. Run the lifecycle package in a fresh kernel only.',
  ]),
  // WolframInstitute/MarkdownToNotebook authoring skills (12)
  ...[
    ['create-wolfram-documentation', 'Overlap: in a Wolfram Institute project (Work/ Research/ folders) use `paclet-docs`; for standalone literate-markdown documentation sources, use this skill. Steps 1-5 run offline (tested Oct 21): `NotebookToMarkdown` ports a page, `MarkdownToNotebook` rebuilds it in a fresh kernel with `PacletDirectoryLoad` of the paclet folder so examples evaluate. Step 6 (PacletPage) installs from the Wolfram Cloud, which rule 0 forbids; the `examples/Paclet/PacletPage` folder in the pinned MarkdownToNotebook checkout is an empty git submodule, not a local copy (as are AccessibleColors, PAdic, WolframParser; only DocPageExamples has files). **Confirm the plan with the user before generating any file** (survey and plan, then stop): with nobody to ask, write the plan and the questions and stop there (Oct 22: one test run skipped this and wrote pages and build output).'],
    ['wolfram-computational-essay', ''],
    ['wolfram-data-repository', ''],
    ['wolfram-demonstration', 'A Demonstration is a Manipulate: prototype it live in a WLJS notebook first, then build the `.nb` for submission. The upstream example (BlochSphereGates) does not run unmodified in WLJS; it runs live after three changes (ROUTES.md translation table): compute control lists before Manipulate with `With`, one `Graphics3D` instead of `Show` of several, drop `Delimiter`/`Appearance`/`ControlType`/`SaveDefinitions`. Keep the original form in the `.nb` deliverable: those are valid in Mathematica.'],
    ['wolfram-example-repository', ''],
    ['wolfram-function-resource', ''],
    ['wolfram-guide-page', ''],
    ['wolfram-overview-page', ''],
    ['wolfram-paclet', 'Overlap: quick check or build → `wolfram-paclets`; Wolfram Institute project workflow → `paclet-build`/`paclet-docs`/`paclet-publish`; a paclet defined in literate markdown (ResourceDefinition.md) → this skill.'],
    ['wolfram-prompt', 'Prompt resources are used by LLM functions, which need an LLM service: testing them online needs the owner\'s OK.'],
    ['wolfram-symbol-page', ''],
    ['wolfram-tech-note', ''],
  ].map(([n, extra]) => T(n, 'm2n', n, extra ? [extra] : [],
    ['Publishing, submitting or deploying (`ResourceSubmit`, `SubmitPaclet`, `CloudDeploy`, Notebook Archive, Demonstrations Project, public documentation): owner\'s explicit OK each time.',
     'Wolfram/Parser 1.3.1 is installed (owner-approved, Oct 21, 2026), so the converter typesets LaTeX math properly. Keep `$AllowInternet = False` when running the converter so its other update checks stay offline.'])),
  // WLJS's own guides (11)
  ...['async-programming', 'dynamics', 'formatting', 'html', 'javascript', 'markdown', 'mermaid', 'migration', 'slides', 'special-cells', 'wlx']
    .map((n) => ({ ...T(`wljs-${n}`, 'wljs', `${n}.md`, n === 'migration' ? ['Local findings are in ROUTES.md ("Mathematica → WLJS translation"), including the Manipulate `Initialization` fix.'] : []) })),
];

// Upstream description: YAML `description:` (plain or block scalar) for SKILL.md; `desc:` for WLJS guides.
function upstreamDescription(file, isGuide) {
  const lines = readFileSync(file, 'utf8').split('\n');
  const end = lines.indexOf('---', 1);
  const fm = lines.slice(1, end);
  const key = isGuide ? 'desc' : 'description';
  const i = fm.findIndex((l) => l.startsWith(key + ':'));
  if (i < 0) throw new Error(`No ${key} in ${file}`);
  let first = fm[i].slice(key.length + 1).trim();
  const parts = [];
  if (first && !/^[>|][-+]?$/.test(first)) parts.push(first.replace(/^["']|["']$/g, ''));
  for (const l of fm.slice(i + 1)) { if (/^\S/.test(l)) break; parts.push(l.trim()); }
  let d = parts.join(' ').replace(/\s+/g, ' ').trim();
  if (isGuide) { const title = fm.find((l) => l.startsWith('title:'))?.slice(6).trim(); d = `${title}. ${d} Use when building or editing WLJS notebook content of this kind.`; }
  return d;
}

const fold = (s, width = 100) => {
  const out = []; let line = '';
  for (const w of s.split(' ')) { if ((line + ' ' + w).trim().length > width) { out.push(line); line = w; } else line = (line + ' ' + w).trim(); }
  if (line) out.push(line);
  return out.map((l) => '  ' + l).join('\n');
};

function render(s) {
  const isGuide = s.src === 'wljs';
  const upstream = isGuide ? join(SRC.wljs, s.rel) : join(SRC[s.src], s.rel, 'SKILL.md');
  if (!existsSync(upstream)) throw new Error(`Missing upstream for ${s.name}: ${upstream}`);
  let desc = upstreamDescription(upstream, isGuide);
  const suffix = ' Local WLJS adaptation.';
  if (desc.length + suffix.length > 1024) desc = desc.slice(0, 1024 - suffix.length - 1).replace(/\s+\S*$/, '') + '…';
  desc += suffix;
  const notes = [...(GROUP[s.src] || []), ...s.notes];
  return `---
name: ${s.name}
description: >-
${fold(desc)}
---

# ${s.name} (local WLJS adaptation)

1. Read the routes and local rules: \`${ROUTES}\`. They take precedence over the upstream skill.
2. Read the pinned upstream ${isGuide ? 'guide' : 'skill'} in full before acting: \`${upstream}\`${isGuide ? '' : ' (and the references/scripts it points to, relative to that folder)'}.
3. Apply the adaptations below.

**Test status:** ${(V2[s.name] || ['not run yet', ''])[0]}: ${(V2[s.name] || ['', 'its card shows results in live WLJS notebooks and waits for the WLJS restart (windows on the second monitor)'])[1]}. Prior hand-run evidence (Oct 21, not a skill invocation): ${(STATUS[s.name] || ['none'])[0]}${STATUS[s.name] ? ' - ' + STATUS[s.name][1] : ''} (see \`${join(REPO, 'TESTING.md')}\`).

## On WLJS
${notes.map((n) => `- ${n}`).join('\n')}
${s.gated.length ? `\n## Needs the owner's OK (each time)\n${s.gated.map((g) => `- ${g}`).join('\n')}\n` : ''}
_Generated by \`${join(REPO, 'build.mjs')}\`; edit the table there, not this file._
`;
}

const check = process.argv.includes('--check');
const skipped = [];
const names = new Set();
for (const s of SKILLS) {
  if (names.has(s.name)) throw new Error(`Duplicate skill name ${s.name}`);
  names.add(s.name);
  let text;
  try { text = render(s); } catch (e) {
    if (check || !String(e.message).startsWith('Missing upstream')) throw e;
    console.warn(`skipped ${s.name}: ${e.message.replace(HOME, '~')}`); skipped.push(s.name); continue;
  }
  if (!check) { const dir = join(REPO, 'skills', s.name); rmSync(dir, { recursive: true, force: true }); mkdirSync(dir, { recursive: true }); writeFileSync(join(dir, 'SKILL.md'), text); }
}
// Protocol v2 results table, generated from the same evidence as the status lines (TEST-PLAN.md, Phase 4).
if (!check) {
  const rows = SKILLS.map((s) => {
    const [label, detail] = V2[s.name] || ['not run yet', 'its card shows results in live WLJS notebooks and waits for the WLJS restart (windows on the second monitor)'];
    const status = label.split(' (')[0].split(':')[0];
    return { name: s.name, status, label, detail };
  }).sort((a, b) => a.status.localeCompare(b.status) || a.name.localeCompare(b.name));
  const counts = rows.reduce((a, r) => ((a[r.status] = (a[r.status] || 0) + 1), a), {});
  const esc = (t) => t.replace(/\|/g, '\\|').replace(/\n/g, ' ');
  writeFileSync(join(REPO, 'tests/RESULTS.md'), `# Skill test results (protocol v2)

Generated by \`build.mjs\` from \`tests/levelB/verdicts.json\` (Level B grades by the orchestrator, Level C independent
reviews in \`tests/levelC/\`). Each skill was invoked by a fresh agent with a request built on Wolfram's own example
material (\`tests/cards/cards.py\`); run logs are in \`tests/runs/2026-10-22/<skill>/\`. Rubric: \`TEST-PLAN.md\`.
"works" requires all six checks to pass and the independent review to agree.

| Status | Skills |
|---|---|
${Object.entries(counts).map(([k, n]) => `| ${k} | ${n} |`).join('\n')}
| **total** | **${rows.length}** |

| Skill | Status | Evidence |
|---|---|---|
${rows.map((r) => `| ${r.name} | ${esc(r.label)} | ${esc(r.detail)} |`).join('\n')}
`);
}
// Skills catalogue (docs/SKILLS.md): one entry per skill, from the same table and evidence. Paths are shown
// relative to the repo or as ~ so the page reads the same on every computer.
if (!check) {
  const SOURCE = {
    agenttools: ['WolframResearch/AgentTools', 'https://github.com/WolframResearch/AgentTools', 'MIT', true],
    wolframskills: ['WolframResearch/skills', 'https://github.com/WolframResearch/skills', 'MIT', true],
    wsm: ['Wolfram System Modeler AI Toolkit', 'https://github.com/WolframResearch/system-modeler-ai-toolkit', 'MIT', true],
    institute: ['Wolfram Institute computational-research plugin 6.0.0', 'https://github.com/WolframInstitute/ClaudePluginComputationalResearch', 'MIT stated in plugin.json; no LICENSE file', false],
    m2n: ['WolframInstitute/MarkdownToNotebook', 'https://github.com/WolframInstitute/MarkdownToNotebook', 'none found', false],
    wljs: ['WLJS Notebook 3.1.4 bundled guides', 'https://github.com/JerryI/wolfram-js-frontend', 'AGPL-3.0', false],
    own: ['wolfram-investigation (separate project)', '', 'none found', false],
  };
  const tidy = (x) => x.split(REPO).join('').split(HOME).join('~').replace(/\n/g, ' ');
  const esc = (x) => tidy(x).replace(/\|/g, '\\|');
  const order = ['wsm', 'agenttools', 'wolframskills', 'institute', 'm2n', 'wljs', 'own'];
  const list = [...SKILLS].sort((a, b) => order.indexOf(a.src) - order.indexOf(b.src) || a.name.localeCompare(b.name));
  const status = (s) => (V2[s.name] ? V2[s.name][0] : 'not run yet');
  const short = (x) => esc(x.split(':')[0]);
  let md = `# Skills catalogue

Generated by \`build.mjs\` from its skill table and the test evidence (\`tests/levelB/verdicts.json\`); do not edit by
hand. Every skill keeps its upstream instructions unchanged and adds a thin **local adaptation**: where its work runs
(WLJS by default, see [ROUTES.md](../ROUTES.md)), what changes from Mathematica, and which actions need the user's OK.

"In repo" means the generated \`SKILL.md\` is committed (MIT-licensed upstream). The others are generated on your
computer by \`node build.mjs\` after \`./setup.sh\` fetches their upstream (see [NOTICE.md](../NOTICE.md)).

| Skill | Source | Licence | In repo | Test status | Adaptations | Needs OK |
|---|---|---|---|---|---|---|
${list.map((s) => { const [n, , lic, inc] = SOURCE[s.src]; return `| [${s.name}](#${s.name}) | ${n} | ${lic} | ${inc ? 'yes' : s.src === 'own' ? 'not included' : 'built at setup'} | ${short(status(s))} | ${(GROUP[s.src] || []).length + s.notes.length} | ${s.gated.length} |`; }).join('\n')}

`;
  for (const s of list) {
    const [n, url] = SOURCE[s.src];
    md += `## ${s.name}

- **Upstream:** ${url ? `[${n}](${url})` : n}, \`${s.rel}\`
- **Test status:** ${esc(status(s))}${V2[s.name] ? `\n- **Evidence:** ${esc(V2[s.name][1])}` : ''}
- **What changed (local adaptation):**
${[...(s.notes.length ? s.notes : []), ...(GROUP[s.src] || []).map((g) => `(shared with all ${n} skills) ${g}`)].map((x) => `  - ${tidy(x)}`).join('\n')}
${s.gated.length ? `- **Needs the user's OK, each time:**\n${s.gated.map((g) => `  - ${tidy(g)}`).join('\n')}\n` : ''}
`;
  }
  mkdirSync(join(REPO, 'docs'), { recursive: true });
  writeFileSync(join(REPO, 'docs/SKILLS.md'), md);
}
const by = SKILLS.reduce((a, s) => ((a[s.src] = (a[s.src] || 0) + 1), a), {});
console.log(`${check ? 'Checked' : 'Generated'} ${SKILLS.length - skipped.length} skills:`, by, skipped.length ? `(skipped: ${skipped.join(', ')})` : '');
