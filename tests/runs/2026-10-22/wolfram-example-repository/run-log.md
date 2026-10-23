# Run log: wolfram-example-repository (2026-10-22)

## 1. Skills used

1. `wolfram-example-repository` (local WLJS adaptation). Following it, I read `ROUTES.md` and the pinned upstream `SKILL.md`, plus the upstream `build.wls`, `examples/build.wls`, `check.wls` and the Example section of `docs/resource-notebooks.md`.

## 2. Steps

1. Listed the working folder. `work/Example/` holds two Example sources, `PrimeSpiralPoints.md` and `QuantumWalk.md`, each with a generated `-out.md` twin and PNGs in `images/`. The request says "the Markdown source", singular, but two sources are present and both are Example templates. Building both changes nothing that already exists, so I built both instead of stopping to ask. The `-out.md` twins and `images/` were left untouched (no `build-out.wls` run).
2. **Preview in the WLJS kernel** (`mcp__wljs__kernel_evaluate`, private context `test`exrepo``, removed afterwards). The skill and ROUTES say to use WLJS for running and checking examples. Results: 200 prime spiral points. The quantum walk evolution is 101 x 201, the total probability is 1, the peaks are at x = ±68 (expected near ±100/√2 ≈ 70.7), and the std. dev. is 54.1 against 10.0 for the classical walk. The plots and the hero return `Graphics`. `$AllowInternet` was `False`.
3. **Build the definition notebooks in a fresh kernel**: `wolframscript` run inside `bwrap --unshare-net`, a network-less sandbox, with `$AllowInternet = False` set first. The script is `scratchpad/build-example.wls`. It loads the pinned `MarkdownToNotebook.wl` and calls `MarkdownToNotebook[src, out, "EvaluateSeparator" -> None]`, the same option the upstream `examples/build.wls` uses. Why a fresh kernel: ROUTES and the skill require it for building `.nb`, because WLJS redefines `Cell`, `Notebook` and the other front-end symbols. Why the sandbox: it guarantees no contact with Wolfram servers. Cloud deploy steps were not run.
   - First attempt: it stalled for about 10 minutes with no front end started and almost no CPU use, and printed nothing (output was buffered through `tail`). I killed only my own processes. Several other sessions were running Wolfram kernels at the same time, so it may have been waiting for a license slot. That is not verified.
   - Second attempt, same script logging to a file: finished in about 20 s, exit 0. PrimeSpiralPoints took 4.5 s and QuantumWalk 13.2 s.
4. **Inspect and lint** in a fresh `wolframscript` kernel, also in the `bwrap --unshare-net` sandbox with `$AllowInternet = False` (`scratchpad/exinspect.wls`). The lint ran on copies in `scratchpad/exlint/`, so the delivered notebooks were not re-saved. The script listed the Input/Output cells, stamped CellIDs and ran `DefinitionNotebookClient`CheckDefinitionNotebook`, which the skill names as the pre-submission check.
5. Checked the built `.nb` files for metadata strings with `grep`, to see whether the category names were present.
6. Wrote a summary page with live-preview cells, `work/ExampleRepositoryBuild.md`, and converted it with `tools/md2wln.py` to `ExampleRepositoryBuild.wln`. I did not open any notebook or window.
7. Checked the WLJS kernel afterwards (`mcp__wljs__kernel_evaluate`): `Names["test`exrepo`*"]` is `{}`, `$Context` is `Global``, `$AllowInternet` is `False`.

## 3. Files

Created:
- `work/Example/PrimeSpiralPoints.nb` (304 468 bytes)
- `work/Example/QuantumWalk.nb` (574 277 bytes)
- `work/ExampleRepositoryBuild.md`
- `work/ExampleRepositoryBuild.wln`
- `run-log.md` (this file)
- Scratch only, outside the work folder: `scratchpad/build-example.wls`, `build-example.log`, `exinspect.wls`, `exinspect.log`, `exlint/*.nb` (lint copies)

Changed: none. The sources, the `-out.md` twins and `images/` were not modified.

## 4. WLJS notebook

`<repo>/tests/runs/2026-10-22/wolfram-example-repository/work/ExampleRepositoryBuild.wln`. It was written by `md2wln.py`, not opened or saved through WLJS, and its cells are unevaluated.

## 5. Answer

I built the Example Repository definition notebooks from both Markdown sources in `work/Example/`, offline:

- `Example/PrimeSpiralPoints.nb`: 88 cells. It has the "Points" content cell (tagged DefaultContent), 2 evaluated examples (200 points and the spiral plot) and the hero image. No `$Failed` outputs and no unfilled template slots.
- `Example/QuantumWalk.nb`: 100 cells. It has the `quantumWalk` definition, the "TimeEvolution" and "FinalDistribution" content cells, 3 evaluated plot examples separated by an example delimiter, and the ArrayPlot hero. No `$Failed` outputs and no unfilled slots.

Before submitting:
- **Categories are empty in both notebooks.** The checkbox list could not be built offline (`CheckboxesCell::autofail`) because it comes from Wolfram's servers. Tick the categories by hand in Mathematica: Visualization & Graphics plus Puzzles and Recreation for Prime Spiral Points, Quantum Computation plus Visualization & Graphics for the Quantum Walk.
- The lint gave a `UnableToUseCell` warning on both notebooks with no details. It also gave `RasterizeDynamics` suggestions, and for QuantumWalk a `HeroImageSquashed` suggestion: the hero aspect ratio is 0.60, while the lint suggests about 0.9. 0.60 is still inside the 0.5–1.25 guideline. If you want a squarer hero, change `AspectRatio -> 3/5` in the source.
- Nothing was deployed or submitted. `ResourceSubmit`, `CloudDeploy` and the Submit button need your explicit OK and access to Wolfram's servers.

If you meant only one of the two sources, the other notebook is a separate file and can simply be deleted.

## 6. Problems

- The first sandboxed build stalled about 10 minutes with no output and was killed. The cause is unknown; perhaps license contention with other sessions' kernels. The rerun worked.
- `CheckboxesCell::autofail` on both builds: the Categories group is empty. This is a known offline limitation (TESTING.md).
- Lint: `[Warning] UnableToUseCell {}` on both notebooks, with no parameters, so I could not tell which cell it means. It may be a headless or offline artifact; not verified. `RasterizeDynamics` (suggestion) on 1 cell in PrimeSpiralPoints and 3 in QuantumWalk. The QuantumWalk hints list showed the same three cell IDs three times. `HeroImageSquashed` (suggestion) on QuantumWalk: 721/1200 against an expected 0.9.
- Unsure: the request says "the Markdown source", singular, but the folder has two sources. I built both rather than guess.
- In the inspection output, the "Output" cell count includes cells from the template itself (InterpretationBox/TagBox outputs) as well as the example outputs. My counts of evaluated examples come from the Input/Output listing, not from the raw count.
