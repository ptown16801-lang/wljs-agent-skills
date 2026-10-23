# Run log: annotate-control-panel (2026-10-22)

## 1. Skills used
1. `annotate-control-panel`: the local WLJS adaptation, which pointed to `ROUTES.md` and the pinned upstream `SKILL.md` at commit 991a800. I read both.

No other skills.

## 2. Steps
1. Read `ROUTES.md` and the upstream skill. The work folder was empty.
2. Found the library at `<SystemModeler-install>/15.0/L/IntroductoryExamples/ComponentBased/ElectricCircuit.mo`. Copied it to `work/ElectricCircuit.mo` and removed its `within IntroductoryExamples.ComponentBased;` line, so the copy is a top-level model named `ElectricCircuit` that loads on its own. The original file is unchanged.
3. Ran `wsm-toolkit panel --analyze` (pure Python, no Wolfram engine). It found 0 controllable parameters, because R and C are component modifiers (`resistor1(R = 10)`), not top-level parameters. The user had named what to control ("resistor and capacitor values"), so I used upstream Mode A and wrote `work/panels.json` by hand:
   - one panel, `rcTuning`, titled "Resistor and capacitor values"
   - log sliders: `resistor1.R` 1 to 100 Ω (default 10), `capacitor1.C` 0.001 to 0.1 F (default 0.01), `resistor2.R` 10 to 1000 Ω (default 100)
   - linked figure: the model's existing stored figure `sineVoltage1.i` ("Output current")
   - every minimum is positive, so no slider can reach C = 0 (singular)
4. Baseline simulation, engine WSMKernelX through `wsm-toolkit wsm --mode simulate` with a fresh `--tempdir` in the scratchpad. Why: upstream needs the `.sim` file for the `--sim-file` check, and WSMKernelX writes it. Result: flatten, build and result all Pass.
5. Ran `wsm-toolkit panel --annotate --sim-file <.sim>` as a dry run: no warnings, so all three variables exist and can be tuned at run time. Then ran the same with `--write`.
6. The tool left the original empty `__Wolfram` annotation in place beside the new `__Wolfram(ControlPanels(...))`. That makes two modifiers of the same annotation element. I removed the empty `__Wolfram, ` (it carried no content), so the file now has one `__Wolfram`.
7. Validation, engine WSMKernelX through `wsm-toolkit wsm --mode validate` with a fresh tempdir (the upstream validate gate). Result: `status.flatten == "Pass"`, no errors. `panel --analyze` now reports `[HAS control panels]`.
8. Range check in the WLJS kernel (`mcp__wljs__kernel_evaluate`). Why: it is the default route, and I wanted to simulate the 8 slider-range corners with `SystemModelSimulate`. The call passed the 220 s MCP timeout ("still pending"), and later trivial calls (`{$AllowInternet, DateString[]}`) also stayed pending, 3 tries over about 15 min. The kernel is shared, and other sessions' processes were active (a 47-minute-old WSMKernelX `+i`, several AgentTools kernels). I did not stop or restart anything. I never got a result from the WLJS kernel, so I could not read `$AllowInternet` there.
9. Range check again, engine WSMKernelX through `wsm-toolkit wsm --mode simulate --override ...`, once per corner (8 runs, fresh tempdir each). Why: the WLJS kernel was unavailable, and `--override` re-runs the compiled model without recompiling, which is how a slider behaves. I read the result `.mat` files with Python/scipy (no Wolfram engine). All 8 runs reach t = 10 with finite `sineVoltage1.i`, and the overridden values appear in the results. For example, R1=1, C=0.1, R2=10 gives max|i| = 0.587 A; the baseline gives 0.0592 A.
10. Wrote the WLJS notebook as Markdown (`ElectricCircuitExplore.md`): the panel described, plus an equivalent WLJS `Manipulate` over `SystemModelSimulate` with `ContinuousAction -> False`. Converted it with `md2wln.py`. No notebook was opened and no window was created.

## 3. Files
- `work/ElectricCircuit.mo` (created: copy of the library model, `within` removed, empty `__Wolfram` removed, control panel added)
- `work/panels.json` (created: the control-panel spec)
- `work/ElectricCircuitExplore.md` (created: notebook source)
- `work/ElectricCircuitExplore.wln` (created: WLJS notebook)
- `run-log.md` (this file)
- Scratchpad only, outside the work folder: `sim1/`, `val1/`, `corner1/` to `corner8/` (kernel temp dirs, kept as evidence) and `ElectricCircuit.before.mo` (a pre-annotation copy).

Paths in this section are relative to `<repo>/tests/runs/2026-10-22/annotate-control-panel/`.

## 4. WLJS notebook
`<repo>/tests/runs/2026-10-22/annotate-control-panel/work/ElectricCircuitExplore.wln`. It was written by `md2wln.py`, not saved from a live notebook, and its `Manipulate` cell has not been evaluated.

## 5. Answer
I copied `IntroductoryExamples.ComponentBased.ElectricCircuit` to `work/ElectricCircuit.mo` and added a native System Modeler Explore panel, **"Resistor and capacitor values"**. It has three log-scale sliders:
- Resistor 1 (`resistor1.R`, 1 to 100 Ω)
- Capacitor (`capacitor1.C`, 0.001 to 0.1 F)
- Resistor 2 (`resistor2.R`, 10 to 1000 Ω)

Next to them it shows the model's stored "Output current" plot. Open the file in System Modeler, simulate it, and choose that panel in Simulation Center's Explore view.

The model still validates (flatten Pass). All three parameters can be changed at run time without a rebuild. Simulations at every combination of the slider limits run cleanly.

Two changes to the copy:
- I removed its `within` line so it stands alone.
- I removed an empty `__Wolfram` marker that would have duplicated the new annotation.

`ElectricCircuitExplore.wln` gives the same three sliders as a WLJS `Manipulate`. Those sliders are linear, because WLJS has no log scale. I haven't run that cell because the shared WLJS kernel wasn't responding.

## 6. Problems
- **WLJS kernel unresponsive.** `mcp__wljs__kernel_evaluate` calls stayed "pending" for about 15 min, including trivial ones. Cause unknown: possibly my 8-run `SystemModelSimulate` call, possibly other sessions' work queued ahead of it. My first call may still be running in the kernel; it defines no global symbols, since everything is inside `Module`. Not restarted (owner rule). As a result, the WLJS `Manipulate` cell has not been run, and I could not check `$AllowInternet` in the WLJS kernel this session. If the app has to be restarted, ROUTES says to use `wljs-server stop` then `wljs-server desktop`, and to ask the owner first.
- **Upstream tool behaviour.** `panel --annotate` adds `__Wolfram(ControlPanels(...))` but leaves an existing bare `__Wolfram` beside it, which duplicates the annotation element. I fixed this by hand. `panel --analyze` / `--suggest` do not see component modifiers such as `resistor1.R`, so Mode B (suggest) would not have worked for this model.
- **Not checked visually.** I did not open the panel in System Modeler: no desktop app may be started, and no window opened. The annotation follows the upstream format, and WSMKernelX flattens it without warnings, but nobody has seen it render.
- **Warnings inherited from the original model.** WSMKernelX reports "Unbound parameter" for `sineVoltage1.V` and `sineVoltage1.f` (start values used) and an underdetermined initialization (`inductor1.i`, `capacitor1.v` taken from start values). These are not caused by the panel.
- **Image in the model documentation.** The Documentation HTML still links an image inside the IntroductoryExamples library (`modelica://IntroductoryExamples/Resources/...`). It displays only when that library is loaded, which it is by default in System Modeler.
- **Upstream `--report` option.** It printed no summary under `--override`, and the override run writes no `simulate.out.json`, so I read the `.mat` files directly with scipy.
- No Wolfram servers were contacted. Nothing was installed or published.
