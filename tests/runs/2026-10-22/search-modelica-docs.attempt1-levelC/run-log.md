# Run log: search-modelica-docs (2026-10-22)

## 1. Skills used
- search-modelica-docs (local WLJS adaptation; it points to ROUTES.md and the pinned upstream SKILL.md at commit 991a800, both read in full)

## 2. Steps
1. Read `<repo>/ROUTES.md` and the pinned upstream `search-modelica-docs/SKILL.md`.
2. `wsm-toolkit help`, then `wsm-toolkit docs --query "translational spring damper parallel" --corpus msl --k 8`. Engine: wsm-toolkit (pinned offline BM25 docs search, Python only, no kernel). Why: the adaptation names `wsm-toolkit docs` as the route for the bundled docs search. Top hit: `SpringDamper`, "Linear 1D translational spring and damper in parallel".
3. `wsm-toolkit docs --show "modelica://Modelica.Mechanics/SpringDamper-4"` to read the full source (parameters `c`, `d`, `s_rel0`; extends `Translational.Interfaces.PartialCompliantWithRelativeStates` and `PartialElementaryConditionalHeatPortWithoutT`).
4. Two more `wsm-toolkit docs` queries (`--full`) for the two base classes, to get the inherited parameters `stateSelect`, `s_nominal`, `useHeatPort`.
5. Wolfram evaluation, engine: WLJS kernel via `mcp__wljs__kernel_evaluate`. Why: default engine per the adaptation; the docs corpus records only leaf class names, so I confirmed the full path in System Modeler. Evaluated `$AllowInternet` (False) and `SystemModel["Modelica.Mechanics.Translational.Components.SpringDamper"]` -> "Description", "ParameterNames", "ParameterValues". Result: description matches; ParameterValues `s_nominal -> 0.0001, c -> 1, d -> 1, s_rel0 -> 0`. All symbols local (Module).
6. Result notebook (ROUTES: results go in a WLJS notebook), engine: WLJS kernel via `mcp__wljs__new_notebook`, `add_cells_batch`, `set_cell_lines`, `evaluate_cell`: a `.md` cell with the answer table, a WL cell repeating the SystemModel check (QuantityVariable replaced by the name), and a cell `NotebookSave[EvaluationNotebook[], "/abs/.../SpringDamperLookup.wln"]` (no global `nb` symbol). Checked the saved file exists (3656 bytes) and contains the content.

## 3. Files
- `<repo>/tests/runs/2026-10-22/search-modelica-docs/work/SpringDamperLookup.wln` (created)
- `<repo>/tests/runs/2026-10-22/search-modelica-docs/run-log.md` (this file)

## 4. WLJS notebook
`<repo>/tests/runs/2026-10-22/search-modelica-docs/work/SpringDamperLookup.wln`

## 5. Answer
The component is **`Modelica.Mechanics.Translational.Components.SpringDamper`** ("Linear 1D translational spring and damper in parallel", MSL 4.0). Force law: `f = c*(s_rel - s_rel0) + d*v_rel`, between `flange_a` and `flange_b`.

Its own parameters:
- `c`: spring constant, `Modelica.Units.SI.TranslationalSpringConstant` (N/m), `final min = 0`, `start = 1` (no default binding, so you must set it)
- `d`: damping constant, `Modelica.Units.SI.TranslationalDampingConstant` (N.s/m), `final min = 0`, `start = 1` (must be set)
- `s_rel0`: unstretched spring length, `Modelica.Units.SI.Position`, default 0

Inherited parameters:
- `stateSelect` = `StateSelect.prefer` (priority to use `s_rel`, `v_rel` as states), from `PartialCompliantWithRelativeStates`
- `s_nominal` = 1e-4 m (nominal value of `s_rel` for scaling), from the same base class
- `useHeatPort` = false (enable a heat port for the dissipated power), from `PartialElementaryConditionalHeatPortWithoutT`

Related: `Translational.Components.SpringDamperNoRelativeStates` (same element, relative quantities not used as states); the rotational `Rotational.Components.SpringDamper`; `MultiBody.Forces.SpringDamperParallel` for 3D line forces.

Source: bundled MSL 4.0 reference via the offline docs search (class `SpringDamper`), confirmed in the System Modeler kernel (WLJS).

## 6. Problems
- No failures or kernel messages.
- The docs corpus keys entries by leaf name only (`modelica://Modelica.Mechanics/SpringDamper-4`); the full path came from the `extends` clause, the text of the `SpringDamperNoRelativeStates` entry, and the SystemModel check.
- `SystemModel[...]["ParameterNames"]` lists only `s_nominal, c, d, s_rel0`; it leaves out `stateSelect` and `useHeatPort` (non-real/structural). It reports `c = 1` and `d = 1`, which are the `start` values; the source has no default binding for them.
- `mcp__wljs__new_notebook` created a new notebook in the running WLJS app (the documented ROUTES workflow). I did not start, stop or restart any application. The notebook is still open in the app; I did not close it.
