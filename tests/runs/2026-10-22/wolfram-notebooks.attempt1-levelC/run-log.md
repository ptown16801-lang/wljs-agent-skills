# Run log: wolfram-notebooks, 2026-10-22

## 1. Skills used
1. `wolfram-notebooks` (local WLJS adaptation). As it instructs, I read `ROUTES.md` and the pinned upstream `wolfram-notebooks/SKILL.md` with `references/Scripts.md`.

## 2. Steps
1. Listed the work folder and read `notes.md` (shell).
2. Loaded the skill and read ROUTES.md, the upstream SKILL.md and Scripts.md. Route chosen: ROUTES.md and the skill say a `.nb` is read and written with `ReadNotebook`/`WriteNotebook` through **wolfram-direct**, not the WLJS kernel, because WLJS redefines `Cell`/`Notebook`/box symbols, so ReadNotebook output gets `(*BB[*)` markup and WriteNotebook fails there. The pristine upstream `scripts/*.wls` were not run because they call `PacletInstall`.
3. **ReadNotebook on `document.nb`**: engine **wolfram-direct** (fresh, network-blocked kernel). Reason: reading a `.nb`. It returned `mode: static-source, evaluated: false` and the raw notebook source, not Markdown. I worked out the section and cell structure from that source. Nothing was evaluated, and `document.nb` was not modified.
4. **WriteNotebook from `notes.md` to `notes.nb`**: engine **wolfram-direct**. Reason: writing a `.nb` from Markdown. It wrote `notes.nb` (2996 bytes).
5. **Check**: engine **wolfram-direct** `WolframLanguageEvaluator` (fresh kernel, `$AllowInternet = False` set and confirmed `False`). Reason: reading back a `.nb` belongs in a fresh kernel (ROUTES.md), and the evaluator also checked the notes' claim in the same call. It ran `Get` on `notes.nb` and listed its cells, then evaluated the notes' code. Result: 4 cells (Title, Text, Input, Text), and the code returns `112`.
6. I did not use the WLJS kernel (`mcp__wljs__*`): every Wolfram step in this task reads or writes a `.nb`, and ROUTES.md sends that to a fresh kernel. No WLJS notebook was opened or created, and no windows were opened.

## 3. Files
- Created: `<repo>/tests/runs/2026-10-22/wolfram-notebooks/work/notes.nb`
- Created: `<repo>/tests/runs/2026-10-22/wolfram-notebooks/run-log.md` (this file)
- Scratch only, outside the project: `read.json`, `write.json`, `check.wl` and `check.json` in the session scratchpad. wolfram-direct also kept its own run records in `~/.local/state/wolfram-agenttools-direct/runs/run-504sdtgt` and `run-1i5txy7k`.
- Unchanged: `document.nb`, `notes.md`.

## 4. WLJS notebook
none

## 5. Answer

**document.nb** (saved by Wolfram 14.3 for Windows) has four sections. Every input cell has a saved output.

1. **Text**
   - Text: "A line of text."
   - Subsection **Subsection**, with the text cells "one two three" and "alpha beta gamma delta epsilon …"
2. **Expressions**
   - `2 + 2`, output `4`
   - `N[GoldenRatio, 80]`, output 1.6180339887498948482045868343656381177203091798057628621354486227052604628189024497 (80 digits)
   - `Nest[Style[{#, y}, FontColor -> Hue[Depth[#]/18, 1, .9]] &, x, 6]`, output `{x, y}` nested six levels deep, each level a different color
3. **Graphics**
   - `Graphics3D[Sphere[], ImageSize -> Tiny]`, output a small 3D sphere
   - `Plot[Abs[x], {x, -2, 2}, ImageSize -> Small, AspectRatio -> Automatic]`, output a V-shaped plot
4. **Dynamic Objects**
   - `Slider[Dynamic[x]]`, output a slider
   - `Dynamic[x]`, output a live display of `x`

**notes.nb** is now beside your notes, at `work/notes.nb`. It has four cells:
- Title "Collatz notes"
- a text cell with the iteration rule
- an Input cell with `NestWhileList[If[EvenQ[#], #/2, 3 # + 1] &, 27, # != 1 &] // Length`, not yet evaluated
- a text cell: "The trajectory of 27 takes 111 steps."

One thing to look at: run that code and it returns **112**, not 111. Both numbers are correct, because the list holds 112 numbers (27 through 1) and those are 111 steps apart. Still, a reader may find the output and the sentence below it confusing. I left your notes as they are. If you want them to match, you could change the code to `... // Length // # - 1 &`, or change the sentence to say the list has 112 values.

## 6. Problems
- wolfram-direct's `ReadNotebook` returned the raw static source (`mode: static-source`), not the Markdown summary the upstream skill describes. I read the structure from the Box source by hand, so the output descriptions (sphere, plot, slider) come from the box types, not from rendering.
- The Markdown `#` heading became a **Title** cell, not a Section cell. That is WriteNotebook's default.
- The code cell is not evaluated, so `notes.nb` contains no output.
- No warnings or messages came from any kernel. `$AllowInternet` was `False` in the fresh kernel. Nothing contacted the network.
