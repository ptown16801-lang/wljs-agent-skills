#!/usr/bin/env python3
"""Level B test cards (TEST-PLAN.md): one per skill, built on Wolfram's and the skill authors' own example material.

  python3 cards.py write            -> tests/cards/<skill>.md (one card per skill)
  python3 cards.py prepare <skill>  -> tests/runs/<DATE>/<skill>/work with a fresh copy of the card's fixture

Fields: prompt (what a user would type; never names the skill), fixture (copied into the run's work folder),
expect (documented behaviour / known answers), gates (what must NOT happen without the owner), blocked (rule-0 or
missing-dependency reason: the card is recorded, not run).
"""
import json, os, shutil, sys
from pathlib import Path

HOME = Path.home()
REPO = Path(__file__).resolve().parents[2]
DATE = '2026-10-22'
EX = Path('<Wolfram-install>/15.0/Documentation/English/System/ExampleData')
SM = Path('<SystemModeler-install>/15.0/L')
INST = HOME / '.local/share/wolfram-agent-skills/wolfram-institute/82d9e00d97c5cd08ee302913618ea8ac3060b615'
M2N = HOME / '.local/share/wolfram-agent-skills/markdown-to-notebook/4d1e13918c464b89a72ee47d97f49d5d9efd52b5/examples'
STATS = HOME / '<private-project>'
LEAN = REPO / 'tests/out/lean/LeanTest'
REF = json.loads((Path(__file__).parent / 'reference-values.json').read_text())

# Fixture helpers: each returns a list of (source, destination-inside-work) pairs.
def files(*names, src=EX): return [(src / n, n) for n in names]
def tree(src, dst): return [(src, dst)]
PROJECT = tree(INST, 'project')   # the whole plugin repo: its Work items refer to its own skills/ and scripts/
DOCPAGE = tree(M2N.parent, 'MarkdownToNotebook')   # whole repo: build.wls loads ../../../MarkdownToNotebook.wl; paclet at examples/Paclet/DocPageExamples

C = {}
def card(skill, prompt, fixture, expect, gates=(), blocked=None, notebook=True):
    C[skill] = dict(skill=skill, prompt=prompt, fixture=fixture, expect=list(expect), gates=list(gates),
                    blocked=blocked, notebook=notebook)

NO_WOLFRAM = "no contact with Wolfram's servers (rule 0); `$AllowInternet` stays False"

# ---------------- Wolfram AgentTools skills ----------------
card('wolfram-language', "Load the package Collatz.wl in this folder and use it: give me the Collatz iterates of 27, how many "
     "steps they take, and the largest value, and show the trajectory as a plot I can look at.",
     files('Collatz.wl'), ["Collatz[27] has 112 terms (111 steps) and maximum 9232 (cross-check: reference total27/peak27)",
     "computation in the WLJS kernel; plot shown live in a WLJS notebook"], [NO_WOLFRAM])
card('wolfram-debugging', "FunctionWithAssert.wl defines Compute. Compute[1] behaves differently from Compute[3]. Find out "
     "why with evidence, without changing the file.",
     files('FunctionWithAssert.wl'), ["identifies the Assert[y > 5] failing for x = 1 (y = 1) and passing for x = 3",
     "uses the skill's helpers (e.g. CollectMessages / assertion capture) in WLJS; evidence shown",
     "file unchanged"], [NO_WOLFRAM, "no edit to FunctionWithAssert.wl"])
card('wolfram-notebooks', "What sections and code does document.nb contain? Then turn my notes in notes.md into a "
     "Mathematica notebook notes.nb.",
     files('document.nb') + [(Path(__file__).parent / 'fixtures/notes.md', 'notes.md')],
     ["an accurate outline of document.nb read as static source (fresh kernel / wolfram-direct, per the stated route)",
      "notes.nb created in a fresh kernel, valid Notebook, cells match notes.md", "a WLJS notebook page summarising both"],
     [NO_WOLFRAM, "document.nb unchanged"])
card('wolfram-paclets', "Check the paclet DocPageExamples in this folder for problems and build it.",
     DOCPAGE, ["CheckPaclet report (PacletCICD now installed) with its findings listed", "archive built (PacletBuild in WLJS)",
     "nothing installed or submitted"], [NO_WOLFRAM, "no PacletInstall of the built paclet", "no SubmitPaclet"])
card('wolfram-alpha', "What is the distance from Earth to the Moon according to Wolfram|Alpha?", [], [], blocked="rule 0: "
     "every Wolfram|Alpha query goes to Wolfram's servers")

# ---------------- WolframResearch/skills ----------------
card('wolfram-setup', "Is my Wolfram setup working for AI coding? Check what is installed and whether you can evaluate "
     "Wolfram code, but don't change anything.", [], ["reports Wolfram 15.0, WLJS ready, MCP servers present",
     "verifies an evaluation (e.g. Expand[(x+1)^5])", "no install, no config edit"], [NO_WOLFRAM, "no install / config change"],
     notebook=False)
card('astro-observation-planner', "I'm going stargazing from State College, PA tomorrow night. What's up?", [], [],
     blocked="rule 0: sky and location data come from Wolfram's servers; offline results are wrong (Sunset returned midnight)")

# ---------------- System Modeler AI Toolkit ----------------
card('validate-modelica', "Do these Modelica models compile? ExampleModel.mo and Broken.mo.",
     files('ExampleModel.mo') + [(Path(__file__).parent / 'fixtures/Broken.mo', 'Broken.mo')],
     ["ExampleModel valid", "Broken.mo fails with the exact error (undefined variable z)", "check run in WLJS (default route)"],
     [NO_WOLFRAM])
card('simulate-modelica', "Simulate ExampleModel.mo for 2 seconds and give me x and y at t = 1 and t = 2.",
     files('ExampleModel.mo'), ["x(1) = e^-1 = 0.367879, y(1) = 1.5e - 0.5/e = 3.893483; x(2) = 0.135335, y(2) = 11.015917 "
     "(exact solution of der(x) = -x, der(y) = y + x, x(0) = y(0) = 1)", "simulated in WLJS"], [NO_WOLFRAM], notebook=False)
card('simulate-and-plot-modelica', "Simulate System Modeler's IntroductoryExamples.Hierarchical example of your choice "
     "for its default time and plot its main outputs.", [],
     ["a model from IntroductoryExamples simulated in WLJS", "SystemModelPlot shown live in a WLJS notebook"], [NO_WOLFRAM])
card('diagnose-modelica', "Diagnose DrawingRobot.mo: how many states, equations and what slows it down?",
     files('DrawingRobot.mo'), ["states and equation counts from WLJS", "deep report (blocks/tearing) from wsm-toolkit if used",
     "numbers consistent between routes"], [NO_WOLFRAM])
card('wolfram-language-modelica', "Using ExampleModel.mo, sweep x(0) over 0.5, 1, 2 and report y at t = 1 for each; "
     "check against the exact solution.", files('ExampleModel.mo'),
     ["exact: y(t) = (1 + x0/2) e^t - (x0/2) e^-t; at t = 1: x0 = 0.5 -> 3.305882, 1 -> 3.893483, 2 -> 5.068684 "
      "(checked in a sandboxed kernel)", "parameter/initial-value sweep in WLJS, results in a notebook"], [NO_WOLFRAM])
card('annotate-modelica-graphics', "Submarine.mo has no proper diagram. Lay it out so it renders as a clean schematic.",
     [(Path(__file__).parent / 'fixtures/Submarine-nographics.mo', 'Submarine.mo')],  # bundled DocumentationExamples.Control.Submarine, 'within' + Placement/Line/Icon/Diagram removed (ExampleData copy is already laid out and lacks noEvent, so it does not build alone)
     ["Placement/Line annotations written to the copy", "model still validates in WLJS"], [NO_WOLFRAM],
     notebook=False)
card('annotate-control-panel', "Add an Explore control panel to IntroductoryExamples' ElectricCircuit (copy it here) "
     "so I can tune its resistor and capacitor values with sliders.", [],
     ["ControlPanels annotation with sensible (non-zero) ranges", "model still validates", "a WLJS slider explorer as the "
      "live equivalent"], [NO_WOLFRAM])
card('annotate-modelica-plots', "Store default result plots in a copy of ExampleModel.mo for x and y.",
     files('ExampleModel.mo'), ["figures annotation with x and y curves", "model still validates"], [NO_WOLFRAM], notebook=False)
card('annotate-modelica-animation', "Copy IntroductoryExamples.CustomComponent.ChainPendulum here and store an "
     "animation with a camera following the last link and a trace path.", [],
     ["__Wolfram(Animation(...)) annotation in the class annotation", "model still builds and simulates in WLJS"],
     [NO_WOLFRAM], notebook=False)
card('modelica-model-architecture', "Restructure the ComponentBased examples (copy IntroductoryExamples.ComponentBased "
     "here) as a small reusable library with one class per file.", [],
     ["directory form: package.mo + package.order per level, one class per file", "loads in WLJS without messages; an "
      "example simulates"], [NO_WOLFRAM], notebook=False)
card('search-modelica-docs', "Which Modelica Standard Library component models a translational spring with a damper in "
     "parallel, and what are its parameter names?", [], ["Modelica.Mechanics.Translational.Components.SpringDamper; "
     "parameters c, d (and s_rel0)", "answer cited to the bundled docs"], [NO_WOLFRAM], notebook=False)
card('create-hydraulic-model', "Build a hydraulic circuit with a pump driving a cylinder.", [],
     [], blocked="Hydraulic Modelica library not installed (Wolfram download; rule 0)")

# ---------------- Wolfram Institute plugin (project = the plugin's own Wiki/Work/Research) ----------------
P = PROJECT
card('project-create', "Start a new research project here about prime gaps (a short one, no paper yet).", [],
     ["scaffold with Wiki/, Work/, Code/, Research/, CLAUDE.md", "author/email not the upstream defaults",
      "Wolfram notes say WLJS", "paper downloads not done without asking"], [NO_WOLFRAM, "no git hooks/settings change unasked"])
card('wiki-init', "Set up a knowledge base in this repo (the code in code/ is about Collatz trajectories).",
     files('Collatz.wl'), ["Wiki/Index.md, Status.md, Concepts/, Resources/", "CLAUDE.md wiki section"], [], notebook=False)
card('wiki-update', "I just added a NestTrajectory function to Code/Tools.wl. Update the wiki.",
     P + [(Path(__file__).parent / 'fixtures/Tools.wl', 'project/Code/Tools.wl')],
     ["article created/updated, Index and Status updated, cross-links"], [], notebook=False)
card('wiki-check', "Check the wiki's health.", P, ["reports stale/missing/broken links found in the plugin's real wiki",
     "fixes index gaps"], [], notebook=False)
card('wiki-add-resource', "Add the paper arXiv:1706.03762 to the wiki (summary and recover info; you may download its "
     "PDF from arXiv).", P, ["Wiki/Resources entry with citation, summary and Recover section", "PDF only from arxiv.org"],
     [NO_WOLFRAM], notebook=False)
card('wiki-search-math', "Search the online math references (not MathWorld) for the 'Sidon set' definition and add the "
     "best result to the wiki.", P, ["results from OEIS / nLab / Wikipedia / DLMF", "MathWorld (a Wolfram site) skipped"],
     [NO_WOLFRAM + " (MathWorld is wolfram.com)"], notebook=False)
card('wiki-search-wolfram', "What Wolfram Language functions exist for iterating a function until a condition fails? "
     "Search the installed documentation only.", P, ["NestWhile / NestWhileList / FixedPoint found offline",
     "online Wolfram searches not attempted"], [NO_WOLFRAM], notebook=False)
card('backlog-add', "Plan a work item: a notebook comparing Sidon-set constructions for n up to 50.", P,
     ["Work/Backlog/<Name>.md with Summary..Technical details, prompt history, routed tasks", "waits for approval; not "
      "moved to Ready"], ["no move out of Backlog"], notebook=False)
card('backlog-refine', "Let's refine the ConversationStyle backlog item.", P,
     ["reads the item, records open questions, writes technical details", "readiness check reported", "item stays in Backlog"],
     ["no move to Ready"], notebook=False)
card('backlog-run', "Work the next task of the IndexSync item.",
     P + [(Path(__file__).parent / 'fixtures/IndexSync.md', 'project/Work/Active/IndexSync.md')],
     ["one task only, worktree claim on work/<Item>, Progress line, test instructions, commit on the item branch, stop"],
     ["exactly one task"], notebook=False)
card('backlog-info', "Go through the backlog: what waits on me and what's stale?", P,
     ["report: waits on you / stale / overlaps / proposals for the plugin's real items", "changes nothing"],
     ["no file changes"], notebook=False)
card('backlog-review', "Review the item under review.", P,
     ["finds UnderReview item (or says none), walks acceptance criteria, runs checks", "stops for the owner's verdict"],
     ["no merge or move without a verdict"], notebook=False)
card('backlog-autolab', "Run the backlog autonomously while I'm away.", P,
     ["preflight: states model/effort/usage and asks for the owner's OK before dispatching"],
     ["no subagent dispatched"], notebook=False)
card('backlog-board', "Publish the work board.", P, ["board data built locally", "stops before publishing and asks"],
     ["no publish"], notebook=False)
card('document-revise', "I left notes in the research note (notes marked << >>). Do a revision round.",
     P + [(Path(__file__).parent / 'fixtures/SidonBound_notes.md', 'project/Research/Artifacts/SidonBound_260821.md')],
     ["next version _2 written beside; v1 untouched; notes resolved; provenance file"], ["v1 not modified"])
card('notebook-create', "Make a notebook exploring the Collatz package in this folder: trajectories of 27 and 97 "
     "and their step counts.", files('Collatz.wl'), ["WLJS .wln (Code/Artifacts or given folder) with .md source",
     "[[ LLM Generated ]]", "27 -> 111 steps, 97 -> 118 steps", "cells evaluate without messages"], [NO_WOLFRAM])
card('project-provenance', "Turn on prompt tracking and record provenance for the research note.", P,
     ["CLAUDE.md toggle on, Wiki/Prompts.md ledger, back-pointer"], [], notebook=False)
card('project-tour', "Give me a tour of this project.", P,
     ["Tour/Tour.md plan; first section as narrative + runnable code in a WLJS notebook; stops for feedback"], [])
card('paper-create', "Add a LaTeX paper on the Sidon-set bound to this project.", P,
     ["Research/<Name>.tex from the template, compiles to PDF with TinyTeX", "model as author, operator not upstream email"],
     [NO_WOLFRAM], notebook=False)
card('paper-create-note', "Write up a research note: the largest Sidon subset of {1..n} for n = 1..20, computed now.",
     P, ["five files: .tex+.pdf, .md+notebook, .wl, README", ".wl loads in a bare kernel", "values from a kernel run "
      "(OEIS A003022 relates)"], [NO_WOLFRAM])
card('paper-create-notebook', "Write the Sidon-bound result up as a research paper notebook.", P,
     ["notices MathNotebook is unavailable (rule 0) and says so; WLJS .wln path if it proceeds"], [NO_WOLFRAM])
card('paper-journal', "Keep a journal for this project and journal the Sidon bound.", P,
     ["Journal/ scaffold, toggle on, dated entry, compiles with TinyTeX"], [], notebook=False)
card('paper-cite', "BibTeX for arXiv:1706.03762, please.", P,
     ["entry: Vaswani et al., 'Attention Is All You Need', 2017, eprint 1706.03762", "metadata from arxiv.org only"],
     [NO_WOLFRAM], notebook=False)
card('paper-lean', "Prove in Lean that the sum of the first n odd numbers is n^2.",
     tree(LEAN, 'LeanTest'), ["Lean proof checked (lean-lsp or lake)", "formalization checklist"], [], notebook=False)
card('paclet-build', "Build the paclet in DocPageExamples.", DOCPAGE,
     ["archive built", "local install only after asking"], ["no PacletInstall without OK"], notebook=False)
card('paclet-docs', "Document the exported functions of DocPageExamples as reference pages.", DOCPAGE,
     ["symbol pages in Documentation/English/ReferencePages/Symbols, made in a fresh kernel (no (*BB[*) markup)"],
     [NO_WOLFRAM], notebook=False)
card('paclet-publish', "Publish DocPageExamples.", DOCPAGE, ["builds; stops before any cloud step and asks"],
     ["no cloud publish (rule 0)"], notebook=False)

# ---------------- owner's own ----------------
card('wolfram-investigation', "Is the chart-behavior investigation notebook clean, or has it drifted?",
     [(STATS / '.agents', '<private-project>/.agents'), (STATS / 'docs/wolfram', '<private-project>/docs/wolfram')], ["NotebookDriftReport in a fresh kernel: Clean -> True for docs/wolfram/chart-behavior.nb",
     "no file changed"], ["no edits; read-only"], notebook=False)

# ---------------- MarkdownToNotebook authoring skills (sources = upstream examples) ----------------
for skill, src, what in [
    ('wolfram-computational-essay', 'ComputationalEssay', 'computational essay'),
    ('wolfram-data-repository', 'Data', 'Data Repository definition notebook'),
    ('wolfram-demonstration', 'Demonstration', 'Demonstration'),
    ('wolfram-example-repository', 'Example', 'Example Repository entry'),
    ('wolfram-prompt', 'Prompt', 'Prompt Repository entry')]:
    card(skill, f"Build the {what} from the Markdown source in this folder.", tree(M2N / src, src),
         [f"{what} .nb built in a fresh kernel (stated reason: WLJS breaks .nb builds)", "examples previewed in WLJS",
          "nothing submitted"], [NO_WOLFRAM, "no ResourceSubmit / publishing"])
card('wolfram-function-resource', "Build the Function Repository definition notebook from the source in this folder.",
     tree(M2N / 'FunctionResource', 'FunctionResource'), [], blocked="rule 0: the build fetches a template from Wolfram")
card('wolfram-symbol-page', "Build the reference page for MazeWalkTime from its Markdown source.", DOCPAGE,
     ["symbol page .nb built in a fresh kernel with the paclet loaded; examples evaluate"], [NO_WOLFRAM], notebook=False)
card('wolfram-guide-page', "Build the DocPageExamples guide page from its Markdown source.", DOCPAGE,
     ["guide page .nb built in a fresh kernel"], [NO_WOLFRAM], notebook=False)
card('wolfram-tech-note', "Write and build a short tech note on how DocPageExamples parses mazes.", DOCPAGE,
     ["tech-note .md + .nb built in a fresh kernel"], [NO_WOLFRAM], notebook=False)
card('wolfram-overview-page', "Write and build an overview page for the DocPageExamples paclet.", DOCPAGE,
     ["overview .md + .nb built in a fresh kernel"], [NO_WOLFRAM], notebook=False)
card('wolfram-paclet', "Build the paclet's ResourceDefinition notebook from ResourceDefinition.md.", DOCPAGE,
     ["ResourceDefinition.nb built in a fresh kernel", "nothing submitted"], [NO_WOLFRAM, "no SubmitPaclet"], notebook=False)
card('create-wolfram-documentation', "Set up documentation for the DocPageExamples paclet in this folder.",
     DOCPAGE,
     ["survey, doc-set plan, backup of existing .nb, .md sources, build in a fresh kernel",
      "PacletPage step reported as blocked (its example copy is an empty submodule; fetching it is rule 0)"], [NO_WOLFRAM], notebook=False)

# ---------------- WLJS guides (examples = the guides' own) ----------------
for skill, prompt in [
    ('wljs-async-programming', "Make a button in a notebook that runs a 3-second computation without freezing the notebook."),
    ('wljs-dynamics', "Make a slider that live-updates a plot of Sin[k x] as k changes."),
    ('wljs-formatting', "Show the first 10 primes in a styled table with a highlighted header."),
    ('wljs-html', "Make an HTML cell showing a card with the 1000th prime computed by Wolfram."),
    ('wljs-javascript', "Make a JavaScript cell that animates a bouncing dot on a canvas."),
    ('wljs-markdown', "Write a Markdown cell with a KaTeX formula for the Collatz map and a small table."),
    ('wljs-mermaid', "Draw the Collatz map's decision as a Mermaid flowchart."),
    ('wljs-migration', "Convert ExampleTestFile.nb to a WLJS notebook."),
    ('wljs-slides', "Make a 3-slide presentation about the Collatz conjecture with a live plot on slide 2."),
    ('wljs-special-cells', "Add a shell cell listing the folder and a LaTeX cell with Euler's identity."),
    ('wljs-wlx', "Make a WLX component that renders a list of the first 5 primes as cards.")]:
    card(skill, prompt, files('ExampleTestFile.nb') if skill == 'wljs-migration' else [],
         ["cell(s) created with the right first-line marker per the guide", "renders correctly (screenshot)",
          "evaluates without errors"] + (["original .nb untouched; converted from a copy"] if skill == 'wljs-migration' else []),
         [NO_WOLFRAM])

def write():
    out = Path(__file__).parent
    for s, c in sorted(C.items()):
        lines = [f"# Test card: {s}", "", f"**Prompt:** {c['prompt']}", ""]
        if c['blocked']:
            lines += [f"**Blocked:** {c['blocked']}. Recorded as not tested; not run.", ""]
        else:
            lines += ["**Fixture (copied into the run's work folder):** " +
                      (', '.join(f"`{d}` (from `{str(sr).replace(str(HOME), '~')}`)" for sr, d in c['fixture']) or 'none'), "",
                      "**Expected:**", *[f"- {e}" for e in c['expect']], "",
                      "**Must not happen:**", *([f"- {g}" for g in c['gates']] or ["- (none beyond ROUTES.md)"]), "",
                      f"**WLJS notebook page required:** {'yes' if c['notebook'] else 'summary page only'}", ""]
        (out / f"{s}.md").write_text('\n'.join(lines))
    print(len(C), 'cards')

def prepare(skill):
    c = C[skill]; work = REPO / 'tests/runs' / DATE / skill / 'work'
    if work.exists(): shutil.rmtree(work)
    work.mkdir(parents=True)
    for src, dst in c['fixture']:
        d = work / dst; d.parent.mkdir(parents=True, exist_ok=True)
        (shutil.copytree(src, d, symlinks=True) if Path(src).is_dir() else shutil.copy2(src, d))
    if skill == 'wiki-init':
        (work / 'code').mkdir(exist_ok=True); shutil.move(str(work / 'Collatz.wl'), str(work / 'code/Collatz.wl'))
    if (work / 'project').is_dir():   # the plugin's example project becomes its own git repository
        import subprocess
        g = lambda *a: subprocess.run(['git', '-C', str(work / 'project'), *a], check=True, capture_output=True)
        g('init', '-q'); g('add', '-A')
        g('-c', 'user.name=Test Fixture', '-c', 'user.email=fixture@localhost', 'commit', '-q', '-m',
          'Fixture: Wolfram Institute plugin example project (Wiki, Work, Research)')
    print(workdir(skill))

def workdir(skill):
    """Folder the agent works in: the project root for project fixtures, else the work folder."""
    work = REPO / 'tests/runs' / DATE / skill / 'work'
    return work / 'project' if any(d == 'project' or d.startswith('project/') for _, d in C[skill]['fixture']) else work

def prompt(skill, brief_file='AGENT-BRIEF.md'):
    run = REPO / 'tests/runs' / DATE / skill
    brief = (Path(__file__).parent / brief_file).read_text().split('Request:\n')[0] + 'Request:\n'
    brief = brief.split('\n', 2)[2] if brief.startswith('# Brief') else brief
    return brief.replace('{work}', str(workdir(skill))).replace('{run}', str(run)) + C[skill]['prompt']

if __name__ == '__main__':
    {'write': lambda: write(), 'prepare': lambda: prepare(sys.argv[2]), 'prompt': lambda: print(prompt(sys.argv[2])),
     'promptw': lambda: print(prompt(sys.argv[2], 'AGENT-BRIEF-WINDOWS.md'))}[sys.argv[1]]()
