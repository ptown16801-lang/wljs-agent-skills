# Level C review F: 17 reruns (2026-10-22)

Reviewer F. I checked the current run in `tests/runs/2026-10-22/<skill>/` for each skill, against its card, `TEST-PLAN.md`,
`ROUTES.md`, the earlier attempts and the earlier reviews. For each run I read the session record
(`subagents/agent-<id>.jsonl`), the files in `work/`, and every PNG capture I cite. I re-ran the key results myself:
`wsm-toolkit wsm --mode validate` and fresh `wolframscript` kernels, all inside
`bwrap --unshare-net` with `$AllowInternet = False`. My scripts and outputs are in `tests/levelC/scratch-F/`.
I did not use the WLJS kernel or any `mcp__wljs__*` tool, and I opened no windows.

## Disagreements (2 of 17)

1. **wolfram-language-modelica: notebook should be partial, not pass.**
   - The y(1) values are right; I reproduced them exactly.
   - The plot in `ExampleModelSweep.wln` has a wrong legend, and nobody looked at it. The run says "I did not see the plot". The
     capture of a y plot to t = 10 is from annotate-modelica-plots, not this run.
   - Cause: the cell passes `PlotLegends -> ({"x(0) = " <> ToString[#]} & /@ x0s)`, which is a list of one-element lists.
   - Result, stored in the saved `.wln` and reproduced in a fresh kernel: three separate legends (After/Below/Above), each
     with the same blue swatch, while the three curves are blue, orange and green. With a flat list of labels, the same call
     gives one correct legend.
2. **wolfram-debugging: correct should be partial and rules should be partial, not pass.**
   - The diagnosis is right.
   - The card expects the run to use the skill's helpers (CollectMessages or assertion capture). The session record has
     zero uses of `WolframDebugging``, `Internal`HandlerBlock`, `FailedAssertions` or `CollectMessages`.
   - Instead, the run turned `On[Assert]` on globally in the shared WLJS kernel and switched it back to Off without checking
     its earlier state. This was done in one kernel call, and also in notebook cell 012, which is saved and repeats the switch
     whenever it is re-run.
   - The brief says "never change global settings". Upstream rule 7 forbids changing `Off` globally in a shared kernel.
   - I checked in a fresh kernel that the skill's own `WolframDebugging`FailedAssertions[Compute[1]]` gives the full
     evidence (the assertion, line 5, the file and the caller) with Assert left Off.

## Agreements, with notes

- **wljs-html, wljs-mermaid**: the rendering is correct, but these reruns did not see it themselves; their captures
  failed.
  - What I viewed is the orchestrator's capture in the session scratchpad: `capx/0x1400025_llm-e02.wln.png` (card showing
    7919) and `capx/0x140003e_Application.png` (whole flowchart; the bottom of the two process boxes is cut off at the window
    edge).
  - These files are under `/tmp` and are not in the run folders. Copy them into the run folders, or the
    "screenshot saved" evidence is lost.
- **wolfram-demonstration**: I agree with "limited" (clean is partial because Categories cannot be filled offline).
  - The build rewrote 5 entries of the shared cache `~/.Wolfram/Objects/Persistence/MarkdownToNotebook/ExampleOutput/Bloch_Sphere_with_a_Quantum_Gate_Sequence/`
    (mtime 05:27:57).
  - The run log says "Changed: none" and that it left the shared cache alone, so this should be added to the log.
- **wolfram-symbol-page**: the run left the DocPageExamples package loaded in the shared WLJS kernel, with the MAZE format,
  the Lorem service and the RandomSignal device class registered. It reported this and gave its reason. It is minor, but
  the brief says to Remove names at the end.
- **backlog-review**: the run did all six send-back steps, and the scripted reply asked for the full path. The task
  routing (sonnet, high) was not ruled on by the owner, although upstream step 2 says to wait for that ruling; the run
  said so. The review notebook is stale and untracked in the project root.
- **Shared System Modeler namespace**: annotate-modelica-plots and wolfram-language-modelica imported a class named
  `ExampleModel` without renaming it, at the same time (09:00 UTC). The rule to rename was added to ROUTES at 05:06 EDT,
  after these runs, and both copies have the same equations, so this is not a violation.

## Did each rerun fix the earlier failure?

| Skill | Earlier failure | Fixed? |
|---|---|---|
| annotate-control-panel | WLJS hung, Manipulate never evaluated | yes (live Manipulate seen in a capture) |
| annotate-modelica-animation | WLJS hung, no WLJS build | yes |
| annotate-modelica-graphics | fixture already annotated; then WLJS hung | yes (fixture has 0 Placement/Line; WLJS simulation) |
| annotate-modelica-plots | WLJS hung, no notebook | yes |
| backlog-review | branch deleted beyond a steps-1-5 reply (A) | yes (this reply asked for the full path) |
| search-modelica-docs | window opened under a no-window brief (A) | yes (the brief now allows windows) |
| simulate-modelica | no notebook, Global`res overwritten (B) | yes |
| validate-modelica | no summary page | yes |
| wiki-update | window under a no-window brief, Global`nb left (A) | yes |
| wljs-html | rendering never seen (D) | only through the orchestrator's capture; the run's own capture failed |
| wljs-javascript | top wall never hit (D) | yes (constant speed; T counter rises in the captures) |
| wljs-markdown | no screenshot (D) | yes (the run's own capture) |
| wljs-mermaid | rendering never seen (D) | only through the orchestrator's capture; the run saw the top only |
| wolfram-debugging | WLJS hung, no notebook | yes; new issue: no skill helpers, global On[Assert] |
| wolfram-demonstration | 3D not checked | yes (Bloch spheres and snapshots render) |
| wolfram-language-modelica | kernel left in a private context (B) | yes; new issue: unseen plot with a wrong legend |
| wolfram-symbol-page | killed processes (B); no summary page | yes |

## What I re-ran (values)

- **ExampleModel**: x(1) = 0.36787944113444454, y(1) = 3.893483022568041, x(2) = 0.13533528322298682,
  y(2) = 11.01591650799995. These are identical to the simulate-modelica table.
- **Sweep**: y(1) = 3.3058824258927495, 3.893483022849462 and 5.068684216663753, matching the exact values to about 1e-9.
- **ElectricCircuit control-panel corners**: peak |i| = 0.5872, 0.09965, 0.01115 and 0.005922.
- **Submarine**: y = 0 with zero inputs. With deltarho = 50: y(10) = -1.2073 and y(50) = -0.83121. The flattened model is
  identical before and after the annotation (268,902 characters each).
- **ChainPendulum**: the end of the chain moves from (4, 0) to (-1.8919, -2.0686). There are 15 variables for the traced
  shape.
- **wsm-toolkit validate**:
  - Pass: plots copy, control-panel copy, Submarine, ExampleModel, and ChainPendulum (with IntroductoryExamples loaded).
  - Fail: Broken, with "`z` not found" at 6:3.
- **NestTrajectory**: 112 elements with maximum 9232; the other claims in the wiki article also hold.
- **Collatz table** for n = 1 to 9: matches the markdown cell.
- **backlog-review git**: fast-forward merge to dae2638, then commit 536d4c3. Only `master` remains; no worktree and no
  remote. The acceptance check holds: T4/T3/T6 match the index rows.
- **BlochSphereGates.nb**: 123 cells, 7 outputs, 0 Message cells and 0 `$Failed`.
- **MazeWalkTime.nb**: 141 cells, 12 Input and 11 Output cells, 0 `$Failed`. The outputs are as expected. There are no
  Keywords cells; the keywords appear only in the metadata (bug I4).
