# Run log: wiki-update (2026-10-22)

Request: "I just added a NestTrajectory function to Code/Tools.wl. Update the wiki."

## 1. Skills used

1. `wiki-update` (local WLJS adaptation; read `ROUTES.md` and the pinned upstream `wiki-update/SKILL.md` as it instructs; also read parts of upstream `wiki-init/SKILL.md` and `wiki-check` for folder and marker conventions, without invoking them)

## 2. Steps

1. Read `ROUTES.md`, the pinned upstream `wiki-update/SKILL.md`, the project `CLAUDE.md` (semantic line breaks on; no prompt-tracking or scientific-journal toggle, so upstream steps 6 and 7 were skipped), `Wiki/Index.md`, `Wiki/Status.md`, `Code/Tools.wl`, and one existing article for house style.
   `Code/Tools.wl` holds one function: `NestTrajectory[f_, x_, test_] := NestWhileList[f, x, test]` plus a usage message. It is part of the fixture's single commit; the working tree was clean.
2. Checked the function's behaviour. Engine: **WLJS kernel via `mcp__wljs__kernel_evaluate`** (the routes' default; a short computation the user does not need to see). To avoid touching the shared kernel's `Global` context, the file text was read, `NestTrajectory` renamed to ``wikiupd`NestTrajectory``, evaluated with `ToExpression`, tested, then `Remove["wikiupd`*"]`. A second `kernel_evaluate` confirmed `Names["wikiupd`*"]` and `Names["Global`NestTrajectory"]` were both empty afterwards. `$AllowInternet` was `False`.
   Results: Collatz from 27 gives 112 elements (`27, 82, 41, 124, 62, …, 4, 2, 1`), maximum 9232; identical to `NestWhileList`; start 1 gives `{1}`; `NestTrajectory[#/2 &, 64, # > 1 &]` gives `{64, 32, 16, 8, 4, 2, 1}`; a four-argument call stays unevaluated; the usage message is set.
3. Wrote the article `Wiki/Code/Tools.md` (new `Code/` wiki folder, one article per code file), added a `## Code` section to `Wiki/Index.md`, and a 2026-10-22 line under *Recent changes* in `Wiki/Status.md`.
   Cross-links: no existing wiki article relates to `Code/`, so no backlinks were added; the article's *See also* points to the `project-create` template `tools_starter.wl`.
4. Built the summary page the adaptation asks for. Engine: **WLJS kernel via `mcp__wljs__new_notebook`, `add_cells_batch`, `evaluate_cell`** (a visible notebook on the user's second monitor). One `.md` cell (evaluated) listing the changed files and the checks, and one cell evaluating `NotebookSave[EvaluationNotebook[], ".../WikiUpdate_NestTrajectory.wln"]` (returned `RemoteNotebook[...]`; file written, 2701 bytes). Captured the window with `tools/capture-wljs-windows.sh` and looked at the PNG: the Markdown cell rendered.

No `wolframscript`, `wolfram-direct` or `wsm-toolkit` was used. Nothing was installed, committed or pushed.

## 3. Files

- Created: `<repo>/tests/runs/2026-10-22/wiki-update/work/project/Wiki/Code/Tools.md`
- Changed: `<repo>/tests/runs/2026-10-22/wiki-update/work/project/Wiki/Index.md`
- Changed: `<repo>/tests/runs/2026-10-22/wiki-update/work/project/Wiki/Status.md`
- Created: `<repo>/tests/runs/2026-10-22/wiki-update/work/project/WikiUpdate_NestTrajectory.wln`
- Created: `<repo>/tests/runs/2026-10-22/wiki-update/scratch/cap/*.png` (window captures)
- Created: this run log

## 4. WLJS notebook

`<repo>/tests/runs/2026-10-22/wiki-update/work/project/WikiUpdate_NestTrajectory.wln` (left open; it was the only notebook opened).

## 5. Answer

The wiki now documents `NestTrajectory`.
I added an article, `Wiki/Code/Tools.md`, which covers `Code/Tools.wl` and its new function, put it in a new **Code** section of `Wiki/Index.md`, and added a dated line to the *Recent changes* list in `Wiki/Status.md`.
Before writing it I ran the function in the WLJS kernel, so the article describes what it actually does:

- It returns exactly what `NestWhileList[f, x, test]` returns.
- Your usage example (Collatz from 27) gives 112 elements ending `4, 2, 1`, with a peak of 9232.
- The list ends with the first value that fails `test`, and that value is included. If `x` itself fails the test, the result is `{x}`.
- Only the three-argument form is defined, so a call with a step limit stays unevaluated. A test that never fails therefore runs forever.

Two small things you may want to change in the code (I did not touch it): the usage text "while test is True" doesn't say that the last element is the first one that fails. And because there's no `BeginPackage`, `NestTrajectory` lands in whatever context is current when the file is loaded.

There is also a one-page WLJS summary, `WikiUpdate_NestTrajectory.wln`, in the project folder.

## 6. Problems

- **Scope judgement:** this repo's `CLAUDE.md` limits its wiki to "external dependencies and cross-cutting concepts" and keeps plugin architecture out. `Code/Tools.wl` is project code rather than plugin architecture, and the request explicitly asked for a wiki update, so I added it. I created a new `Wiki/Code/` folder and Index section for it, a structural choice the user did not specify. Alternatives would have been `Concepts/`, or no article at all.
- **Marker inconsistency:** the upstream skill and the project `CLAUDE.md` both specify `*[[ LLM Generated ]]*`, but all 22 existing articles use `*[ LLM Generated ]*` (single brackets). The new article follows the written spec (double brackets), so the wiki now has both forms. Existing articles were not changed.
- The WLJS Markdown cell shows its source above the rendered output, which is normal WLJS display, not an error.
- No warnings or messages from the kernel. No call came near the 220 s limit.
