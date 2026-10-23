# Run log: wolfram-notebooks, 2026-10-22

## 1. Skills used

1. `wolfram-notebooks` (local WLJS adaptation). As it instructs, I read `ROUTES.md` and the pinned upstream `wolfram-notebooks/SKILL.md` plus `references/Scripts.md`. I ran none of the upstream `scripts/*.wls`, because they call `PacletInstall`.

## 2. Steps

1. Listed the work folder: `document.nb` (19538 bytes) and `notes.md` (195 bytes).
2. Read the skill wrapper, `ROUTES.md`, the upstream SKILL.md, `references/Scripts.md` and the `wolfram-direct` dispatcher source. Per the skill and ROUTES.md, reading and writing a `.nb` goes through **wolfram-direct**, not WLJS: in the WLJS kernel `ReadNotebook` output carries WLJS box markup and `WriteNotebook` fails. The run rules also forbid every `mcp__wljs__*` call and `wljs eval`.
3. **Read document.nb**: I ran `wolfram-direct` with tool `ReadNotebook` (request `scratch/read.json`). In this dispatcher, `ReadNotebook` starts no kernel: it returns the static file source (`mode: static-source`, `evaluated: false`, sha256 `119598ff…c028b`). I read the outline from the cell structure in that source.
4. **Wrote notes.nb**: I ran `wolfram-direct` with tool `WriteNotebook` (request `scratch/write.json`, markdown = full text of `notes.md`, `file` = `work/notes.nb`, no overwrite). Engine: a fresh Mathematica kernel inside the dispatcher's network namespace (bwrap `--unshare-net`). Why: the route ROUTES.md prescribes for writing `.nb` from Markdown. Exit 0.
5. **Checked the Collatz claim in the notes**: I ran `wolfram-direct` with tool `WolframLanguageEvaluator` and code `$AllowInternet = False; {$AllowInternet, NestWhileList[...] // Length}`. Engine: a fresh kernel, network-blocked. Why: an isolated, offline evaluation (WLJS was off limits). Result: `{False, 112}`.
6. **Checked notes.nb's structure**: I ran `scratch/check.wls` (first line `$AllowInternet = False`) with `timeout 120 bwrap --unshare-net --unshare-pid --die-with-parent --dev-bind / / --proc /proc wolframscript -f …`. Engine: a fresh wolframscript kernel inside the network cut. Why: to load the written file with `Get` and list its cell styles. Result: `Notebook` with cells Title "Collatz notes", Text, Input (the NestWhileList code as BoxData), Text "The trajectory of 27 takes 111 steps."
7. **WLJS result page**: ROUTES.md says every result goes in a WLJS notebook, and the run rules forbid opening one. So I wrote `work/summary.md` and converted it with `python3 tools/md2wln.py work/summary.md work/summary.wln`. That is plain Python and evaluates nothing. Exit 0.
8. Checked that none of my processes were left running (none) and that `document.nb` still had its original sha256 (unchanged).

No Wolfram evaluation ran in the WLJS kernel, and nothing contacted Wolfram servers. The one kernel evaluation I checked confirmed `$AllowInternet` was `False`.

## 3. Files

Created:
- `<repo>/tests/runs/2026-10-22/wolfram-notebooks/work/notes.nb`
- `<repo>/tests/runs/2026-10-22/wolfram-notebooks/work/summary.md`
- `<repo>/tests/runs/2026-10-22/wolfram-notebooks/work/summary.wln`
- `<repo>/tests/runs/2026-10-22/wolfram-notebooks/scratch/read.json`, `read-out.json`, `write.json`, `eval.json`, `check.wls`
- `<repo>/tests/runs/2026-10-22/wolfram-notebooks/run-log.md` (this file)
- `wolfram-direct` saved its own records of the two kernel runs (outside the work folder, created by the tool): `~/.local/state/wolfram-agenttools-direct/runs/run-rzo7if2n` (WriteNotebook) and `run-1k1u9ffj` (evaluator).

Unchanged: `work/document.nb`, `work/notes.md`.

## 4. WLJS notebook

`<repo>/tests/runs/2026-10-22/wolfram-notebooks/work/summary.wln`. I generated it with md2wln.py and never opened or saved it in WLJS. Its code cell is not evaluated.

## 5. Answer

**document.nb** (created in Wolfram 14.3 on Windows) has four sections, each with saved outputs:

1. **Text**: the text "A line of text.", then a subsection **Subsection** holding "one two three" and "alpha beta gamma delta epsilon …".
2. **Expressions**:
   - `2+2`, output `4`
   - `N[GoldenRatio, 80]`, output 1.6180339887498948482045868343656381177203091798057628621354486227052604628189 (80 digits)
   - `Nest[Style[{#, y}, FontColor -> Hue[Depth[#]/18, 1, .9]] &, x, 6]`, output `{{{{{{x,y},y},y},y},y},y}` with each nesting level in a different hue
3. **Graphics**:
   - `Graphics3D[Sphere[], ImageSize -> Tiny]`, output a sphere
   - `Plot[Abs[x], {x, -2, 2}, ImageSize -> Small, AspectRatio -> Automatic]`, output the V-shaped plot of |x|
4. **Dynamic Objects**:
   - `Slider[Dynamic[x]]`, output a slider
   - `Dynamic[x]`, output a live display of x

**notes.nb** is in the same folder as your notes. It has a title "Collatz notes", your two text lines and the `NestWhileList` code as an Input cell, not yet evaluated. Your note's claim checks out: the code returns 112, the length of the list, which includes both 27 and the final 1. That is 111 steps. A short summary page is also in `summary.wln`.

## 6. Problems

- None failed, and there were no Wolfram messages.
- `ReadNotebook` through wolfram-direct returns raw `.nb` source rather than the upstream markdown rendering. I worked out the outline from the cell expressions myself. The outputs are the ones saved in the file; I re-evaluated none of them.
- `WriteNotebook` turned the `#` heading into a **Title** cell, not a Section. The first Text cell keeps a trailing space from the line break in the source. I judged both acceptable and changed neither.
- In the notes, the code computes the *length* (112) and the text says "111 steps". The two agree, since length = steps + 1, but a reader might find it confusing. I left your text as written.
- I could not look at `notes.nb` or `summary.wln` in a front end or WLJS window, because the run rules forbid opening windows. I checked them only by loading the file (`Get`) and reading the `.wln` text.
