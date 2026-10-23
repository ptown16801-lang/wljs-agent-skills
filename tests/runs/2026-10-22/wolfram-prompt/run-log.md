# Run log: wolfram-prompt (2026-10-22)

## 1. Skills used
1. `wolfram-prompt` (local WLJS adaptation). Following its instructions I read `<repo>/ROUTES.md` and the pinned upstream `skills/wolfram-prompt/SKILL.md` (plus the "Prompt" section of `docs/resource-notebooks.md`, `build.wls`, `examples/build.wls` and the converter's parser-loading code). I loaded no other skill.

## 2. Steps
1. Listed the working folder. The only source is `work/Prompt/AdaLovelace.md`, a Persona prompt. It matches the pinned upstream example `examples/Prompt/AdaLovelace.md` byte for byte (checked with `diff`). The folder also holds the upstream `AdaLovelace-out.md` twin and its `images/`; I did not touch them.
2. Checked the converter for network access. `MarkdownToNotebook.wl` calls `PacletInstall["Wolfram/Parser"]` only when the parser is missing. Wolfram/Parser 1.3.1 is installed, so that call is never reached, and `$AllowInternet = False` blocks it anyway. I did not use upstream `build.wls` or `examples/build.wls`, because they call `PacletInstall`/`CloudConnect`/`CloudDeploy`. I wrote my own build script in the scratchpad instead.
3. **Build** (engine: **fresh kernel via `wolframscript`**, Mathematica 15.0, `$AllowInternet = False` at the start and still False at the end). I used a fresh kernel because ROUTES.md and the skill adaptation say `.nb` builds must not run in the WLJS kernel: WLJS redefines `Cell`, `Notebook` and other front-end symbols, and that breaks MarkdownToNotebook builds. The script loads the pinned `MarkdownToNotebook.wl`, runs `MarkdownToNotebook[src, "Association", "EvaluateSeparator" -> None]` for the statistics, then `MarkdownToNotebook[src, ".../Prompt/AdaLovelace.nb", "EvaluateSeparator" -> None]`. Results:
   - Template `Prompt`, Name `AdaLovelace`.
   - Sections: prompt, details and options, chat examples, basic examples, scope, applications, properties and relations, possible issues, neat examples (all 9 in the source).
   - Unfilled `TemplateSlot`s: 0. The file reads back as a `Notebook`: 333,147 bytes, 314 cells, 2 docked cells (toolbar).
4. **Inspection** (engine: **fresh kernel via `wolframscript`**, `$AllowInternet = False`; I used a fresh kernel because the task reads a `.nb`). Findings:
   - The prompt body is present.
   - All 8 example Input cells are present and unevaluated. They are `eval: false` and need the deployed prompt plus an LLM.
   - The 8 "Output" cells are template metadata (Topics grid and similar), not example results. There are no `$Failed` outputs.
   - The strings "Fictional Characters" and "Writers" do not appear anywhere in the notebook, so the Categories are not recorded.
   - My first inspection attempt hung. `ToString[nb, InputForm]` on the whole notebook was too slow, and I killed it. A side effect of `pkill -f` was that it killed that bash call itself. I then killed the processes by PID and reran a lighter script.
5. **Lint** (`DefinitionNotebookClient`CheckDefinitionNotebook` through `UsingFrontEnd`, on a copy in the scratchpad): **not run**. The Claude Code permission classifier denied the command ("Interfere With Workloads"), I believe because it starts a front end. I did not try to get around the denial.
6. Wrote a short build summary as Markdown and converted it to a WLJS notebook with `python3 tools/md2wln.py`, as ROUTES.md asks for results that are files. I opened no WLJS notebook or window and made no `mcp__wljs__*` calls; the WLJS kernel was not used. Nothing was deployed or submitted, and nothing contacted Wolfram servers.

## 3. Files
- Created: `<repo>/tests/runs/2026-10-22/wolfram-prompt/work/Prompt/AdaLovelace.nb` (the deliverable)
- Created: `<repo>/tests/runs/2026-10-22/wolfram-prompt/work/Prompt/AdaLovelace-build-summary.md`
- Created: `<repo>/tests/runs/2026-10-22/wolfram-prompt/work/Prompt/AdaLovelace-build-summary.wln`
- Created: `<repo>/tests/runs/2026-10-22/wolfram-prompt/run-log.md` (this file)
- Scratchpad only (outside the project): `build-prompt.wls`, `inspect.wls`, `inspect2.wls`, `inspect2.out` in `<scratch>/`
- No source file was changed.

## 4. WLJS notebook
`<repo>/tests/runs/2026-10-22/wolfram-prompt/work/Prompt/AdaLovelace-build-summary.wln` (a summary page, converted from Markdown with md2wln.py; never opened). The Prompt Repository deliverable itself is the Mathematica `.nb`, which the repository requires.

## 5. Answer
The Prompt Repository definition notebook is built: `work/Prompt/AdaLovelace.nb`. It is a Persona prompt named AdaLovelace, and it has the docked Deploy/Submit toolbar. All nine sections from the Markdown are filled (the prompt body, Details & Options, Chat Examples and the six example sections) along with the metadata: Keywords, Topics, Related Symbols, Related Resources, Links, Sources and Contributed By. No template slots are left empty. I built it offline in a fresh Wolfram kernel with internet off, and nothing was deployed or submitted.

Three things are left for you before submission:
1. **Categories are not ticked.** The converter gets the Prompt category list from Wolfram's servers and could not do that offline. Open the notebook in Mathematica and tick *Fictional Characters* and *Writers* by hand.
2. **The examples have not been run.** They are marked `eval: false` on purpose, because they need the published prompt and an LLM connection. Running them needs your OK (it uses an LLM service).
3. **The docked *Check* lint has not been run.** I was blocked from starting the headless front end it needs. Click *Check* in the notebook toolbar yourself, or allow the headless check.

Submitting (`ResourceSubmit` / the toolbar's Submit button) needs your explicit OK each time.

## 6. Problems
- Warning on both conversion passes: `CheckboxesCell::autofail: Could not determine checkbox items automatically for resource type Prompt and property Categories.` As a result the Categories checkbox grid has no items, and the source's categories are missing from the notebook. This is the limitation TESTING.md already records ("category checkboxes stay empty without Wolfram servers").
- The `CheckDefinitionNotebook` lint was denied by the permission classifier, so I cannot say whether the notebook passes the submission lint.
- My first inspection script hung on `ToString[..., InputForm]` of the whole notebook and had to be killed. `pkill -f inspect.wls` also killed the bash call that ran it, so I then killed the remaining processes by PID. There was no other effect.
- I did not regenerate the `AdaLovelace-out.md` GitHub twin. It was not asked for, and upstream's `build-out.wls` sets the front end to dark mode globally.
- Unsure: the 14 `CheckboxBox`es in the notebook belong to other template controls. I did not identify each one.
