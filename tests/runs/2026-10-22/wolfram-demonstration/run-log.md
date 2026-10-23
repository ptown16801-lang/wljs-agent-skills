# Run log: wolfram-demonstration, 2026-10-22

## 1. Skills used

1. `wolfram-demonstration` (local WLJS adaptation). Following it, I read `ROUTES.md`, the pinned upstream `skills/wolfram-demonstration/SKILL.md`, the "Demonstration" section of the pinned `docs/resource-notebooks.md`, and the pinned `examples/build.wls` and `check.wls`. I fetched no online pages: the upstream skill links to demonstrations.wolfram.com and reference.wolfram.com, and the owner rule forbids contacting Wolfram servers.

## 2. Steps

1. **Read the source.** `work/Demonstration/` holds `BlochSphereGates.md` (the source), `BlochSphereGates-out.md` and `images/` (an upstream round-trip twin, which I did not use). The `.md` is identical to the pinned upstream example.
2. **Built the `.nb`.** Engine: a fresh kernel through `wolframscript`, inside the network cut (`bwrap --unshare-net --unshare-pid --die-with-parent ...`), run under `timeout -s KILL 600`. `$AllowInternet = False` was the first line. Script: `scratch/build.wl`. Why a fresh kernel: ROUTES.md says `.nb` builds belong in a fresh kernel, because WLJS redefines `Cell`, `Notebook` and other front-end symbols. Settings: `MarkdownToNotebook[src, out, "EvaluateSeparator" -> None, "UseCache" -> False]`.
   - `None` keeps the Initialization definitions alive for the Manipulate and Snapshot cells, as in the upstream `build.wls`.
   - `UseCache -> False` forced a cold evaluation. I did not clear the shared PersistentObjects cache the way `build.wls` does, because other sessions may use it.
   - Result: the build finished in 9.7 s. The notebook has 123 cells, 0 unfilled `TemplateSlot`s, 0 Message cells, no `General::stop` and no `$Failed`. There are 7 Output cells; 4 of them are `DynamicModuleBox` panels (the Manipulate and 3 snapshots). Wolfram/Parser 1.3.1 was found, so math typesets.
3. **Inspected the built `.nb`.** Engine: fresh `wolframscript` kernel inside the cut. Script: `scratch/inspect.wl`. Why: reading a `.nb` also belongs in a fresh kernel.
4. **Ran the submission lint.** Engine: fresh `wolframscript` kernel inside the cut, under `timeout 300`, using the front end (`UsingFrontEnd`). It ran `DefinitionNotebookClient`CheckDefinitionNotebook` on a scratch copy (`scratch/check-copy.nb`), so the deliverable's CellIDs were not changed. Script: `scratch/check.wl`. Result: 2 warnings, `SnapshotSettingsNotFound` and `UnableToUseCell`, both with empty parameters. Afterwards no `WolframNB` or `wolframscript` process of mine was left running.
5. **Built the live WLJS preview and summary page.** Engine: the WLJS kernel through `mcp__wljs__new_notebook` (notebook `002`, window `llm-716.wln`), `add_cells_batch` and `evaluate_cell`. All `.md` cells were evaluated. Why: ROUTES.md requires a Demonstration to be prototyped live in WLJS, with results in a WLJS notebook.
   - The WLJS version has the three ROUTES.md fixes: control lists computed through `With`, a single `Graphics3D`, and no `Delimiter`/`Appearance`/`ControlType`/`SaveDefinitions`.
   - All symbols are in the `bsg22`` context because the kernel is shared.
   - I checked the result in screen captures from `tools/capture-wljs-windows.sh`, plus `mcp__wljs__project_cell` on the Manipulate cell and the snapshot cell. The Manipulate renders with its sliders and gate menus and the JIT indicator showing. All 3 snapshot scenes render.
6. **Checked the source's text numerically.** Engine: the WLJS kernel through `mcp__wljs__kernel_evaluate`, which was quick and needed nothing the user had to see. Four statements in the source are wrong (see Problems).
7. **Saved the notebook.** I evaluated `NotebookSave[EvaluationNotebook[], ".../work/BlochSphereGates-preview.wln"]` in a cell of the notebook.
8. **Cleaned up.** I ran `Remove["bsg22`*"]` through `kernel_evaluate`. Afterwards `Names["bsg22`*"]` was `{}`.

## 3. Files

Created:
- `<repo>/tests/runs/2026-10-22/wolfram-demonstration/work/Demonstration/BlochSphereGates.nb`: the deliverable.
- `<repo>/tests/runs/2026-10-22/wolfram-demonstration/work/BlochSphereGates-preview.wln`
- `<repo>/tests/runs/2026-10-22/wolfram-demonstration/scratch/`, containing `build.wl`, `build.log`, `inspect.wl`, `inspect.log`, `check.wl`, `check.log`, `check-copy.nb`, and the `cap/`, `cap2/` and `cap3/` screen captures.
- `<repo>/tests/runs/2026-10-22/wolfram-demonstration/run-log.md`: this file.

Changed: none. The source `.md` was not modified.

## 4. WLJS notebook

`<repo>/tests/runs/2026-10-22/wolfram-demonstration/work/BlochSphereGates-preview.wln`

## 5. Answer

I built the Demonstration. The authoring notebook is `work/Demonstration/BlochSphereGates.nb`. It is the official Demonstration template with the docked toolbar and 123 cells: title, caption, initialization, the evaluated Manipulate, 3 evaluated snapshots, details, references, and metadata (keywords, links, submission notes). I built it offline in a fresh kernel.

A live WLJS preview with a summary is in `work/BlochSphereGates-preview.wln`. In it the Manipulate runs live: sliders for θ and φ and three gate menus.

Before you submit:
- **Categories are empty.** The converter could not fill the Categories checkbox grid offline (`CheckboxesCell::autofail`). Tick Physical Sciences, Quantum Mechanics and Computation by hand in Mathematica.
- **Generate the thumbnail and snapshots.** Click *UPDATE THUMBNAIL AND SNAPSHOTS* in Mathematica. The lint warns `SnapshotSettingsNotFound` until that is done, and also warns `UnableToUseCell`.
- **Fix the text.** Four statements in the source are wrong, and I built them as written:
  1. "eight single-qubit gates": there are 7.
  2. Snapshot 2: three $T$ gates do not reach the point a single $S$ would. $T^2 = S$, so two $T$ gates do; three end at azimuth $3\pi/4$.
  3. Snapshot 3: $Y|+\rangle = -i|-\rangle$, which is the opposite Bloch point, not "$-|+\rangle$, same point". $Y$ is a $\pi$ rotation about $\hat y$, not a flip across $\hat x$.
  4. Snapshot 1: the path goes pole → +x → +x → −x as straight chords, so it does not "walk around the equator".

  Should I correct these in the `.md` and rebuild?
- **Rule conflict.** The skill's own rules say "no function that returns a Manipulate", but the Manipulate cell is `blochDemo[]`. Moving the `Manipulate[...]` into that cell would follow the rule.
- **Submitting** (*UPLOAD* to the Demonstrations Project) needs your explicit OK. I did not submit.

## 6. Problems

- **Build message:** `CheckboxesCell::autofail`: "Could not determine checkbox items automatically for resource type Demonstration and property Categories." The Categories field is empty offline. The skill's test status already records this.
- **Lint warnings:** `SnapshotSettingsNotFound` and `UnableToUseCell`, both with no parameters, so the lint did not say which cell is affected. From `DefinitionNotebookClient/Kernel/Scraping.m`, one path that raises `UnableToUseCell` is a missing hero image or thumbnail, which suggests both warnings come from the snapshots not having been generated. I have not proven that.
- **Source text:** the 4 factual errors above, verified numerically in the WLJS kernel.
  - Gate count: 7.
  - `T.T == S` is True; `T^3 == S` is False.
  - The Bloch vector of $Y|+\rangle$ is {−1, 0, 0}.
  - The snapshot 1 path is {{0,0,1},{1,0,0},{1,0,0},{−1,0,0}}.

  I did not change the source, because the request was to build it.
- **Rule conflict:** the source's Manipulate cell is `blochDemo[]`, a function that returns a Manipulate, which the upstream skill's own rules forbid. The build and lint did not object.
- **Visual check of the `.nb`:** not done. I did not render the built `.nb` in Mathematica's front end; only its structure was checked. The live look was checked with the WLJS version.
- **Open window after cleanup:** after `Remove["bsg22`*"]`, the open WLJS window `llm-716.wln` still shows its panels, but moving the controls will no longer recompute until the cells are evaluated again.
- **Other processes:** another session's `wolframscript` (PID 2184211) was running throughout. I did not touch it.
- **WLJS calls:** none stayed pending.
