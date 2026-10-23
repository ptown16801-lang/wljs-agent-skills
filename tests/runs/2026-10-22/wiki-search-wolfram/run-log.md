# Run log: wiki-search-wolfram, 2026-10-22

Request: "What Wolfram Language functions exist for iterating a function until a condition fails? Search the installed documentation only."

## 1. Skills used

1. `wiki-search-wolfram` (local WLJS adaptation; read ROUTES.md and the pinned upstream SKILL.md)
2. `wolfram-language` (local WLJS adaptation; read the pinned upstream SKILL.md). Loaded because ROUTES.md's overlap table routes "Installed Wolfram documentation" to `wolfram-language` (offline search) rather than `wiki-search-wolfram`.

## 2. Steps

1. Read `<repo>/ROUTES.md`, the upstream `wiki-search-wolfram` SKILL.md and the upstream `wolfram-language` SKILL.md, and the `wolfram-direct` dispatcher source before running it.
2. Skipped upstream steps 2-5 of `wiki-search-wolfram` (Function Repository, Community, Stephen Wolfram's writings, Physics Project): the request says installed documentation only, and they would contact Wolfram servers (forbidden by the owner rule). Did not run the upstream `search_wolfram_docs.wls` script (its guide/tutorial part is a web search; the adaptation says to use `WolframLanguageContext` via wolfram-direct instead).
3. Documentation search: `WolframLanguageContext` via **wolfram-direct** (fresh, network-blocked kernel). Why: ROUTES.md names it as the offline documentation search; WLJS's own docs search returns no results on this computer. Run record: `~/.local/state/wolfram-agenttools-direct/runs/run-_n0q6k4r`. Results came from guides Functional Iteration, Looping Constructs, Iterated Maps & Fractals and tutorials Applying Functions Repeatedly, Loops and Control Structures.
4. Usage messages and small examples (`NestWhile`, `NestWhileList`, `FixedPoint`, `FixedPointList`, `While`, `For`, `TakeWhile`, `LengthWhile`): `WolframLanguageEvaluator` via **wolfram-direct**, `$AllowInternet = False`. Why: isolated offline kernel for a quick check, no shared state. Run `run-xg4gigr2`.
5. Located the installed documentation on disk (`~/.Wolfram/Documentation/15.0/en-us/Documentation/English/System/`) with `find`, confirmed the symbol pages exist, and listed every `paclet:ref/...` link in the local guide notebooks `FunctionalIteration.nb` and `LoopingConstructs.nb` (grep, no kernel). This found `Until`, `FoldWhile`, `FoldWhileList`, which the semantic search had not surfaced.
6. Usage messages and examples for `Until`, `FoldWhile`, `FoldWhileList` and the `max` argument of `NestWhile`: `WolframLanguageEvaluator` via **wolfram-direct**, `$AllowInternet = False` (same reason). Run `run-j27oy8jv`. `$VersionNumber` = 15.
7. Wrote the wiki article (upstream step 1: "If Wiki/ exists, create `Wiki/Resources/WolframDocumentation_<Topic>.md`") and added it to `Wiki/Index.md`.
8. WLJS notebook (ROUTES.md: results land in a WLJS notebook): checked `$AllowInternet` in the **WLJS kernel** via `mcp__wljs__kernel_evaluate` (False); `mcp__wljs__new_notebook`, added a `.md` summary cell and one Input cell with the examples, evaluated both with `mcp__wljs__evaluate_cell` (**WLJS kernel**; results identical to wolfram-direct), then saved with `NotebookSave[EvaluationNotebook[], ...]` from a cell of that notebook (**WLJS kernel**). No global symbols defined (examples use pure functions and `Module`).

## 3. Files

- Created: `<repo>/tests/runs/2026-10-22/wiki-search-wolfram/work/project/Wiki/Resources/WolframDocumentation_IterateWhile.md`
- Changed: `<repo>/tests/runs/2026-10-22/wiki-search-wolfram/work/project/Wiki/Index.md` (one line added under Resources)
- Created: `<repo>/tests/runs/2026-10-22/wiki-search-wolfram/work/project/IterateWhile.wln`
- Created: this run log
- Scratch (outside the project): request/response JSON in the session scratchpad; wolfram-direct run records under `~/.local/state/wolfram-agenttools-direct/runs/` (written by the dispatcher itself)

## 4. WLJS notebook

`<repo>/tests/runs/2026-10-22/wiki-search-wolfram/work/project/IterateWhile.wln` (left open in the WLJS app; notebook id 019).

## 5. Answer

From the installed Wolfram Language 15.0 documentation:

**Apply a function repeatedly while a test holds**
- `NestWhile[f, expr, test]` applies `f` until `test` applied to the result no longer gives `True`, and returns that result. `NestWhileList` returns every step. Extra arguments: `m` (the test gets the last `m` results, or `All`), `max` (at most `max` steps), and `n` (`n` extra steps after the test fails, or `-n` to go back `n` steps).
- `FixedPoint[f, expr]` / `FixedPointList` stop when the result stops changing. This is `NestWhile[f, expr, UnsameQ, 2]`. `FixedPoint[f, expr, n]` caps the steps.

**Related**
- `FoldWhile` / `FoldWhileList`: a fold that stops at the first result failing `test`.
- `TakeWhile`, `LengthWhile`: the leading list elements (or how many) while `crit` holds.

**Procedural loops**
- `While[test, body]` checks first, stops when `test` fails. `For[start, test, incr, body]` works the same way.
- `Until[test, body]` runs the body first, stops when `test` gives `True`.
- `Do` with `Break[]`, or `Catch`/`Throw`, to stop a loop or a `Nest`/`Map` early.

Checked offline, for example `NestWhileList[#/2 &, 123456, EvenQ]` gives `{123456, 61728, 30864, 15432, 7716, 3858, 1929}`. Nothing was searched online.

## 6. Problems

- The semantic search (`WolframLanguageContext`) did not return `Until`, `FoldWhile` or `FoldWhileList`. I found them only by reading the local guide pages. Someone relying on the search alone would miss them.
- My first check for doc files used `$InstallationDirectory/Documentation/...` and returned False for every symbol. The docs are installed under `~/.Wolfram/Documentation/15.0/en-us/` instead.
- wolfram-direct printed "Pass session=... in future calls" reminders. Its dispatcher starts a fresh kernel per call, so I ignored them.
- The search results cite `reference.wolfram.com` URLs. They are labels from the local index: the kernel's network was blocked, and nothing contacted Wolfram servers. The wiki article uses the same URLs as links.
- `Until.nb` and `FoldWhile.nb` contain the strings "13.1" and "12.2". These are probably the version each function was introduced in, but I did not check, so I left them out.
- The saved `.wln` stores the Dataset output as a compressed `FrontEndRef`. It is not plain text, and it redraws once a kernel attaches (as ROUTES.md describes). The header has `HaveToSaveAs: true`.
- Coordinator rule change, received after the notebook was already created, evaluated and saved: do not call `mcp__wljs__new_notebook` or open any WLJS notebook, because each one opens a window on the user's working monitor. Use `kernel_evaluate` and `md2wln.py` instead. Notebook 019 (`IterateWhile.wln`) had already opened a window in the WLJS app. Per the instruction I left it open and made no further notebook calls.
- Judgement calls: I loaded `wolfram-language` in addition to the requested skill, following the ROUTES overlap table. I also wrote a wiki article into the project's `Wiki/`. That wiki documents the plugin itself, so the article does not fit its stated scope well. I wrote it because the upstream skill says to when `Wiki/` exists.
