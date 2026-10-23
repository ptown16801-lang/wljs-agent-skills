# Test plan: all 70 skills in WLJS (draft for the owner, Oct 22, 2026)

**Goal.** Every skill is installed with what it needs, invoked the way a real session would invoke it, and checked
against known answers, with its result in a WLJS notebook. Nothing is marked as tested unless it ran under this
protocol. What could not run is listed with its reason and the decision that would unblock it.

**What was wrong with the Oct 21 record** (why this plan exists):
1. No skill was invoked. Workflows were carried out by hand from the upstream instructions, so the installed skill
   files (`~/.claude/skills/*/SKILL.md`, including the route notes written on Oct 21) were never followed as written.
2. About 25 statuses were carried over from earlier sessions without a re-run (the 11 `wljs-*` guides, 8 authoring
   builds, `wolfram-language`, `wolfram-debugging` and others).
3. Missing dependencies were recorded as "limited" instead of being installed.

## Phase 0: reset the record (first, before anything else)

- Every status in `build.mjs` becomes `not tested (protocol v2)`; the Oct 21 notes move to a "prior evidence" column.
- `TESTING.md` gains a header saying the Oct 21 results are hand-run evidence, not skill tests.
- Commit on branch `skills-in-wljs`.

## Phase 1: install dependencies (owner-approved Oct 22: internet for these)

All user-local, from the official source, each recorded with source, version, size, SHA-256 and an uninstall line in
`DEPENDENCIES.md`. Each install ends with its own check.

| # | Item | Source | Check after install |
|---|---|---|---|
| 1 | Wolfram/PacletCICD 0.36.2 | Wolfram Paclet Repository (`PacletInstall`, internet for that call only) | local `CheckPaclet.wls` runs on the test paclet |
| 2 | TinyTeX + latexmk, biber, amsart, biblatex | TinyTeX GitHub releases; `tlmgr` | the test paper and journal compile to PDF |
| 3 | Typst | typst/typst GitHub release | a `--typst` paper compiles |
| 4 | MathNotebook paclet | the cloud URL named in `paper-create-notebook/mathnotebook.md` (plugin author's Wolfram Cloud) | its post-processing loads in a fresh kernel |
| 5 | PacletPage | Wolfram Institute cloud resource named in `create-wolfram-documentation` | `PublishPacletPage[..., "DryRun" -> True]` on the test paclet |
| 6 | Lean 4 (elan), a Mathlib project with the prebuilt cache, `lean-lsp-mcp` | Lean's official installer, Mathlib cache, PyPI via `uvx` | `lake build` proves a small lemma; MCP registration is the **owner's command** if the app blocks it |
| 7 | Wolfram's official test suites (AgentTools `Tests/`, toolkit evals) | WolframResearch GitHub, pinned by commit | files present, SHA recorded |
| 8 | Hydraulic library | **blocked**: Wolfram's form fails; owner asks Wolfram support | installs from the owner's `.sma`; until then `create-hydraulic-model` is "not tested: library unavailable" |

Also fixed in this phase: WLJS's docs search returns "No results" although its corpus file exists
(`wljs-editor/dist/llm.txt`); find out why and fix or record it.

## Phase 2: the test harness

### Level A: official suites (the tools underneath the skills)

Run each in the WLJS kernel **and** a fresh kernel, record pass counts for both, explain every difference:

- AgentTools `Tests/`: the ones a skill relies on (`WolframDebuggingSkill`, `AgentSkills`, `PacletTools`,
  `PacletDocumentationTools`, `SymbolDefinition`, `CodeInspectorTool`, `Tools`, `Graphics`, `WolframAlpha-UI`,
  `NotebookViewer`). Server and installer suites (`InstallMCPServer`, `CloudDeployment`, ...) are out of scope and
  listed as such.
- MarkdownToNotebook `tests.wls` (174 tests).
- System Modeler toolkit: `docs --eval`, plus each skill's bundled examples.

### Level B: skill invocation (the skills themselves)

For each of the 70 skills, one **test card** (`tests/cards/<skill>.md`):

- **Prompt**: the request a user would type, worded to trigger the skill by its description (not by naming files).
- **Fixture: Wolfram's and the skill authors' own example material, not hand-made data** (owner, Oct 22). A fresh copy
  of it is made for every run (`tests/fixtures/`):
  - Mathematica documentation example data (`.../Documentation/English/System/ExampleData`, 401 files: notebooks such
    as `document.nb` and `ExampleTestFile.nb`, Modelica models `ExampleModel.mo`, `DrawingRobot.mo`,
    `ExampleModelTotal.sma`, `Collatz.wl`) and reference-page examples;
  - System Modeler's bundled example libraries (IntroductoryExamples, EducationExamples, IndustryExamples,
    DocumentationExamples) and the Modelica Standard Library examples;
  - the Wolfram Institute plugin's own `Wiki/`, `Work/`, `Research/` as the project for the 27 Institute skills;
  - MarkdownToNotebook's `examples/` (essay, data, demonstration, example, function, prompt, the DocPageExamples
    paclet) for the authoring and paclet skills;
  - the code examples in WLJS's own guides for the 11 `wljs-*` skills.
- **Expected results**: the documented behaviour of that material (reference-page outputs, model documentation,
  upstream example outputs, Wolfram's test expectations). Values computed here (`tests/cards/reference-values.json`,
  network-sandboxed fresh kernel) are only cross-checks where an example states no answer.
- **Checks** (all must pass for "works"):
  1. **Triggered**: the skill loaded from `~/.claude/skills/` (seen in the run log).
  2. **Route**: Wolfram code ran in WLJS, or in a fresh kernel only where the skill file states the reason.
  3. **Rules**: no install, network call, publish or overwrite without the gate the skill file names.
  4. **Notebook**: a WLJS notebook page exists for the result, opens, its cells evaluate without messages, and a
     screenshot is saved.
  5. **Correct**: outputs match the card's expected values.
  6. **Clean**: no errors or Wolfram messages left unexplained.
- **Evidence**: `tests/runs/<date>/<skill>/` with the run log, produced files, the notebook, the screenshot and
  `checks.json` (one line per check: pass/fail and why).

**Fresh context.** Each card runs in a session that has not seen this work, so the skill file alone guides it.
Options (owner decides, see below): (a) one background subagent per card, (b) headless `claude -p` per card,
(c) in this session with the skill invoked through the Skill tool (cheapest, weakest: this session already knows the
answers).

### Level C: independent review

A separate reviewer (a fresh agent, or the owner on a sample) reads every `checks.json` against its evidence and may
overturn any pass. Disagreements are re-run, not argued.

## Phase 3: fix loop

A failing check leads to a fix in `build.mjs` / `ROUTES.md` (never in the pinned upstream files), regeneration, and a
re-run of that card. The status records "works with fixes" only after the re-run passes; the fix is named.

## Phase 4: report

- `TESTING.md` and every skill's status are generated from the `checks.json` files, not written by hand.
- One WLJS summary notebook, a DEVLOG entry in `wolfram-live-panels-mcp`, commits on the branch; merge to `master`
  on the owner's word.

## Status rubric (strict)

| Status | Meaning |
|---|---|
| works | all six checks pass through skill invocation, and Level C agrees |
| works with fixes | passes only after a named change to the skill file; re-run passed |
| limited | passes except for an external gap named in the status (e.g. a library Wolfram does not provide) |
| fails | a check fails and no local fix exists; reason stated |
| not tested | only with a named blocker and the owner decision that would remove it |

## Owner decisions (Oct 22, 2026)

0. **No contact with Wolfram's servers** (owner rule, Oct 22; widened from "no license or machine identifiers"). Nothing
   reaches wolfram.com, wolframcloud.com, wolframalpha.com or Wolfram's paclet/resource servers, from a kernel or any other
   tool. Consequences: MathNotebook, PacletPage and the Hydraulic library are not fetched in any form; Wolfram|Alpha,
   Wolfram data, Function Repository and Wolfram Cloud tests do not run, and those skills record "not tested: owner rule".
   Already happened before the rule: the Oct 21 Wolfram|Alpha query; on Oct 22 two `PacletFindRemote` searches, the
   PacletCICD install, and loading Wolfram's download-form page (nothing was submitted).

1. **Lean: include.**
2. **Runner: background subagents** (option a), one per test card, in batches of about 10; model and effort stated
   before each batch; included subscription usage only, stop if it runs out.
3. **Online test calls:** non-Wolfram sources only (arXiv/DOI, OEIS/MathWorld, GitHub); Wolfram|Alpha and Wolfram data
   are excluded by rule 0.
4. **Publishing:** open. Proposed: Wolfram Paclet Repository submission in dry-run only; Wolfram Cloud publishing
   only after the owner signs in and the free plan's limits are checked; the backlog board as a private claude.ai page.

## Effort

Phase 0 and installs: medium. Writing the 70 test cards and the harness, Level C review and fixes: high.
