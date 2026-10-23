# Run log: wolfram-demonstration (2026-10-22)

## 1. Skills used

1. `wolfram-demonstration` (local WLJS adaptation; I read the pinned upstream SKILL.md at `markdown-to-notebook/4d1e1391.../skills/wolfram-demonstration/`, `ROUTES.md`, the Demonstration section of the converter's `docs/resource-notebooks.md`, `examples/build.wls`, `tests/authoring/run.wl` and the Demonstration notes in `TESTING.md`)

## 2. Steps

1. Read the source `work/Demonstration/BlochSphereGates.md`. It is the upstream BlochSphereGates example: frontmatter, Caption, Initialization, Manipulate, 3 Snapshots (`#| input: false`), Details, References.
2. **Build** (`scratch/build.wl`). Engine: **a fresh kernel via `wolframscript`**, run inside the network cut (`timeout 600 bwrap --unshare-net ... wolframscript -f`) with `$AllowInternet = False` as the first line. Reason: ROUTES.md and the skill say a Mathematica `.nb` must be built in a fresh kernel, because WLJS redefines `Cell`/`Notebook`/`MakeBoxes`. Call: `MarkdownToNotebook[src, out, "EvaluateSeparator" -> None, "UseCache" -> False]`, the same separator setting as upstream `examples/build.wls`, and no cache so the examples were evaluated again. Result: `BlochSphereGates.nb` in 13.4 s. It is a `Notebook` with 123 cells (7 Output, 2 Input), 0 unfilled `TemplateSlot`s, 0 Message cells, no stray `General::stop` cells. The Manipulate panel and the three snapshot panels are present as `DynamicModuleBox` outputs. One message: `CheckboxesCell::autofail` (the Categories checkbox list could not be fetched offline).
3. **Inspected the structure** of the built `.nb` (`scratch/inspect.wl`). Engine: **fresh kernel via `wolframscript`** in the network cut, for the same reason (reading a `.nb`). Every slot is filled: caption, initialization code, Manipulate + output, 3 snapshot outputs, author, details, 3 references, submission notes, 7 keywords, 2 links. Categories are empty. Related Demonstrations shows the template placeholder because the source list is empty.
4. **Lint** (the skill's Check step, `scratch/check.wl`, run on a copy `scratch/check-copy.nb` so the built file stays as the converter wrote it). Engine: **fresh kernel via `wolframscript` + front end** (`UsingFrontEnd`, `DefinitionNotebookClient`CheckDefinitionNotebook`) in the network cut, under `timeout 300`. Finished normally with 2 warnings: `SnapshotSettingsNotFound` and `UnableToUseCell`, both with no parameters. No front-end process was left running by me.
5. **Checked the physics claims** in the captions. Engine: **WLJS kernel via `mcp__wljs__kernel_evaluate`**: a quick computation the user does not need to see; all names local to a `Module`.
6. **Live preview in WLJS** (the skill and ROUTES require prototyping the Manipulate live and a WLJS summary page). Engine: **WLJS kernel via `mcp__wljs__new_notebook` / `add_cells_batch` / `evaluate_cell`** (`.md` cells evaluated too). Contents: a summary of the built files; the Initialization in WLJS form (the three ROUTES fixes: control list computed with `With` before `Manipulate`, one `Graphics3D` instead of `Show`, no `Delimiter`/`Appearance`/`ControlType`/`SaveDefinitions`; also `N[...]` on the points and `ContinuousAction -> True`); helpers in a `BlochSphereGates`` context because the kernel is shared. Then the Manipulate, the three snapshot Manipulates, a table of exact Bloch vectors, a static scene and a findings cell. All cells evaluated without messages. The Manipulates returned WLJS `ManipulateHelper` panels. A projected window shows the sliders (polar angle θ = 1.0472, azimuthal angle φ = 0.523599) and gate menus (gate 1 = H).
7. **Visual check of the 3D scene: not possible.** In WLJS windows every `Graphics3D` output, even `Graphics3D[Sphere[]]`, shows only "…", while a 2D `Graphics[Disk[]]` in the same cell draws normally. `Rasterize[Graphics3D[Sphere[]]]` in the WLJS kernel also returns a 44×34 "…" image (a 2D plot rasterizes at 376×229). A temporary test cell I added at the top of my notebook for this check now holds a `.md` note recording it. I did not delete it, because the delete tool is reserved for user-requested deletions.
8. Saved the notebook by evaluating `NotebookSave[EvaluationNotebook[], ".../work/BlochSphereGates-preview.wln"]` in its last cell (WLJS kernel). Then I ran `Remove["BlochSphereGates`*"]` through `mcp__wljs__kernel_evaluate`, as the shared-kernel rule requires. Re-evaluating the Initialization cell brings the definitions back. Window captures came from `tools/capture-wljs-windows.sh` (into `scratch/cap*/`).

## 3. Files

Created:
- `work/Demonstration/BlochSphereGates.nb`: the deliverable (Demonstrations authoring notebook)
- `work/BlochSphereGates-preview.wln`: the WLJS summary and live-preview notebook
- `scratch/build.wl`, `scratch/build.log`, `scratch/inspect.wl`, `scratch/check.wl`, `scratch/check.log`, `scratch/check-copy.nb` (the lint copy, with CellIDs stamped and saved by the front end), `scratch/scene-default.png` (the failed 3D rasterization), `scratch/cap/` … `scratch/cap9/` (window captures)
- `run-log.md` (this file)

Not changed: `work/Demonstration/BlochSphereGates.md`, `BlochSphereGates-out.md`, `images/`.

## 4. WLJS notebook

`<repo>/tests/runs/2026-10-22/wolfram-demonstration/work/BlochSphereGates-preview.wln`. It is still open on the second monitor (temporary title `llm-870.wln`). Two projected "Application" windows from `project_cell` are also open.

## 5. Answer

I built the Demonstration offline into `work/Demonstration/BlochSphereGates.nb`. It is the official Demonstrations authoring notebook with the docked toolbar. It has 123 cells, and every slot from the Markdown is filled: caption, initialization, the Manipulate with its evaluated panel, three snapshots, details, references, keywords, links and submission notes. A live WLJS preview of the Manipulate and a summary are in `work/BlochSphereGates-preview.wln`.

Before you submit it in Mathematica:
- **Tick Categories by hand.** The list is empty, because the checkbox list comes from Wolfram's servers and this build was offline.
- **Click UPDATE THUMBNAIL AND SNAPSHOTS.** The lint warns `SnapshotSettingsNotFound` (and `UnableToUseCell`).
- **The source has some errors.** I computed them exactly and did not change the source. Shall I fix them in the Markdown and rebuild?
  - The Initialization text says "eight" gates; there are seven (I, H, X, Y, Z, S, T).
  - Snapshot 2 says three T gates reach the point a single S would. In fact two T gates do (T² = S), and the third ends at (−1/√2, 1/√2, 0).
  - Snapshot 3 says Y takes |+⟩ to −|+⟩ (the same Bloch point). In fact Y|+⟩ = −i|−⟩, the opposite point (−1, 0, 0).
  - Snapshot 1 says the trajectory "walks around the equator". The path is |0⟩ → +x → +x → −x, drawn as straight chords, with the last one through the centre of the sphere.

Uploading to the Demonstrations Project needs your OK, and I have not done it.

## 6. Problems

- `CheckboxesCell::autofail` during the build: Categories are empty offline. This is expected, and the same as the Oct 21 test.
- Lint: 2 warnings (`SnapshotSettingsNotFound`, `UnableToUseCell`, no parameters). I did not find out which cell `UnableToUseCell` refers to.
- **The 3D scene was not checked by eye.** `Graphics3D` shows "…" in WLJS windows and in WLJS `Rasterize` this session, even a bare sphere. The Oct 21 hand run reported 3D rendering in WLJS, so this may be a WLJS/WebGL display problem now. The cause was not investigated. The Mathematica rendering of the `.nb` was not looked at either: no screenshot of the `.nb` was made, because front-end rasterization in the network cut is known to hang.
- The Manipulate outputs in the `.nb` hold symbols in the converter's evaluation context (`MTNB$1nr8cc9vmwuo3``). Mathematica should regenerate them when the user clicks UPDATE THUMBNAIL AND SNAPSHOTS or re-evaluates. Not verified in a Mathematica window.
- The WLJS preview cells created empty Global symbols in the shared kernel, from pattern and control names (`g1`, `g10`, …; no values set). I did not remove them, because other sessions may use the same names. `BlochSphereGates`*` was removed, so the live panels in the open preview need the Initialization cell re-evaluated before they respond.
- A `WolframNB` front end (started 03:59, before this run) and several kernels belong to other sessions. I left them alone.
- The build ran with `"UseCache" -> False`, so it also wrote fresh entries to the converter's local persistent cache (`MarkdownToNotebook/ExampleOutput/Bloch_Sphere_...`), as the converter does normally.
