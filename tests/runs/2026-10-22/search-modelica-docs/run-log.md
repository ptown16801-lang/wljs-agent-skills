# Run log: search-modelica-docs (2026-10-22)

## 1. Skills used
1. search-modelica-docs (local WLJS adaptation; read ROUTES.md and the pinned upstream SKILL.md at 991a800)

## 2. Steps
1. Read `<repo>/ROUTES.md` and the upstream skill `.../wolfram-system-modeler-ai-toolkit/991a8000.../search-modelica-docs/SKILL.md`.
2. Offline docs search with `wsm-toolkit docs` (pinned toolkit, pure-Python BM25, no network, no Wolfram kernel), routed to `--corpus msl`:
   - query "translational spring damper parallel" (k=6): top hit `Modelica.Mechanics: SpringDamper` "Linear 1D translational spring and damper in parallel" (score 30.3). Other hits: `SpringDamperNoRelativeStates` (variant without relative states), the FMU-oriented input/output block `SpringDamper` (also has c, d, s_rel0), and the rotational `SpringDamper`.
   - `--show modelica://Modelica.Mechanics/SpringDamper-4`: full source, own parameters `c`, `d`, `s_rel0`; extends `Translational.Interfaces.PartialCompliantWithRelativeStates` and `Thermal.HeatTransfer.Interfaces.PartialElementaryConditionalHeatPortWithoutT`.
   - query on `PartialCompliantWithRelativeStates` (inherited `stateSelect`, `s_nominal`) and on `PartialElementaryConditionalHeatPortWithoutT` (inherited `useHeatPort`).
3. Cross-check in the **WLJS kernel via `mcp__wljs__kernel_evaluate`** (default engine per the skill; System Modeler runs there): `{$AllowInternet, SystemModel["Modelica.Mechanics.Translational.Components.SpringDamper"]["ParameterNames"]}` returned `{False, {"s_nominal","c","d","s_rel0"}}`. This also confirms the full dotted path, which the docs corpus does not record.
4. Visible result in a **WLJS notebook** (`mcp__wljs__new_notebook` id 001, `add_cells_batch`, `evaluate_cell` on all three cells): a `.md` answer cell, a WL cell re-running the `ParameterNames` check (WLJS kernel, same output), and a `NotebookSave` cell (WLJS kernel). Checked the window with `tools/capture-wljs-windows.sh` (window `llm-f84.wln`): heading and table render.

## 3. Files
- `<repo>/tests/runs/2026-10-22/search-modelica-docs/work/SpringDamperLookup.wln` (created)
- `<repo>/tests/runs/2026-10-22/search-modelica-docs/scratch/docs-query1.txt`, `docs-show-SpringDamper-4.txt`, `docs-query2.txt`, `docs-query3.txt` (search output)
- `<repo>/tests/runs/2026-10-22/search-modelica-docs/scratch/cap/*.png` (window captures; one is another session's notebook, `llm-5e7.wln`, only captured, not touched)
- `<repo>/tests/runs/2026-10-22/search-modelica-docs/run-log.md` (this file)

## 4. WLJS notebook
`<repo>/tests/runs/2026-10-22/search-modelica-docs/work/SpringDamperLookup.wln` (left open, not closed)

## 5. Answer
Use **`Modelica.Mechanics.Translational.Components.SpringDamper`** ("Linear 1D translational spring and damper in parallel", MSL 4.0). Force: `f = c*(s_rel - s_rel0) + d*v_rel`.

Its own parameters:
- `c`: spring constant, `TranslationalSpringConstant` [N/m], no default (start = 1, min = 0)
- `d`: damping constant, `TranslationalDampingConstant` [N.s/m], no default (start = 1, min = 0)
- `s_rel0`: unstretched spring length, `Position` [m], default 0

Inherited: `stateSelect` (default `StateSelect.prefer`), `s_nominal` (default 1e-4 m, scaling of s_rel), `useHeatPort` (default false). Connectors `flange_a`, `flange_b` (plus `heatPort` when enabled).

Related: `SpringDamperNoRelativeStates` (same element, relative quantities not used as states); a signal-interface (FMU) `SpringDamper` block also exists with c = 1e4, d = 1, s_rel0 = 0. Source: bundled MSL 4.0 reference (class SpringDamper), confirmed by System Modeler's `ParameterNames` in the WLJS kernel.

## 6. Problems
- None failed. The docs corpus keys entries by leaf name only, so the full path came from the doc text of `SpringDamperNoRelativeStates` ("Translational.Components.SpringDamper") and was confirmed by `SystemModel` in the kernel.
- `ParameterNames` does not list `stateSelect` or `useHeatPort` (enumeration/Boolean structural parameters); those come from the docs source only.
- The FMU-oriented signal block `SpringDamper` was not checked for its full package path (not needed for the answer).
