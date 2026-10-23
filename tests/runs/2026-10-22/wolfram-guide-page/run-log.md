# Run log: wolfram-guide-page (2026-10-22)

## 1. Skills used

1. `wolfram-guide-page` (local WLJS adaptation). Following it, I read `ROUTES.md`, the pinned upstream `skills/wolfram-guide-page/SKILL.md` and its referenced `docs/doc-pages.md`. I loaded no other skill.

## 2. Steps

1. Listed the work folder. It holds the `DocPageExamples` paclet example. The guide source is `DocPageExamples/docs/DocPageExamples.md` (`Template: Guide`).
2. Read the source, `build.wls`, `README.md`, `ResourceDefinition.md` and `PacletInfo.wl`. `diff -r` against the pinned upstream `examples/Paclet/DocPageExamples` showed the work copy is identical to upstream.
3. Picked the build method:
   - The upstream skill's Build step uses `ResourceFunction[ResourceObject["https://www.wolframcloud.com/..."]]`. The no-Wolfram-servers rule forbids that, so I used the pinned local `MarkdownToNotebook.wl` instead.
   - The paclet's `build.wls` was not run:
     - It loads the converter from `../../../MarkdownToNotebook.wl`, which does not exist here.
     - It rebuilds every page, the ResourceDefinition and `DocumentationBuild`, which is more than the request asked for.
   - I copied its output layout instead: `build/DocSource/English/<$docTemplateDirectories["Guide"]>/DocPageExamples.nb`, with `EvaluateSeparator -> None`, after `PacletDirectoryLoad` of the paclet.
4. **Build 1, source as given.** Ran in a fresh kernel through `wolfram-direct` (`WolframLanguageEvaluator`, script in the scratchpad), with `$AllowInternet = False`.
   - Engine choice: ROUTES says anything that builds or reads a Mathematica `.nb` uses a fresh kernel, not WLJS. `wolfram-direct` also guarantees no network, through a network namespace.
   - Result: valid `Notebook`, 0 messages from the build, 1.3 s.
   - But only 1 `InlineGuideFunction` chip was built. `MazeGenerate` and `MazeParse` came out as plain `GuideText` strings with no link: the source lines `- MazeGenerate - …` and `- MazeParse - …` lack the backticks the skill requires ("The backticked symbol at the start is required for the link").
5. Inspected the built cells, again in a fresh kernel through `wolfram-direct`, because this reads a `.nb`.
6. **Source fix.** In `docs/DocPageExamples.md`, changed those two items to `` - `MazeGenerate` generate … `` and `` - `MazeParse` parse … ``. That is the same form as the `MazeWalkTime` item, and nothing else changed. The original is kept at `<scratchpad>/DocPageExamples.orig.md`.
7. **Build 2.** Same engine and settings.
   - Result: valid `Notebook`, 83 cells, 0 messages, 1.6 s.
   - 3 `InlineGuideFunction` chips, linking `paclet:WolframInstitute/DocPageExamples/ref/MazeGenerate`, `.../ref/MazeParse` and `.../ref/MazeWalkTime`. No plain-string `GuideText` is left.
   - 3 `GuideFunctionsSubsection`s (Symbols, Reference Pages, Workflows) and 13 `GuideText` entries.
   - The other 10 entries are `RefLinkPlain` links to the format, service, device, interpreter, entity, character, message, program, workflow and workflowguide URIs.
   - Also present: Related Links (the MarkdownToNotebook GitHub link) and 11 Keywords.
8. **Visual check.** Rasterized the built notebook with Mathematica's own front end, in a fresh kernel through `wolfram-direct` (`UsingFrontEnd`, `NotebookOpen[..., Visible -> False]`). The WLJS kernel cannot render Mathematica notebook styles, and headless WLJS has no rasterizer.
   - I looked at the 715×1037 PNG. Title, abstract, the three subsections with linked chips, empty Tech Notes and Related Guides, Related Links and Metadata all render correctly.
9. Wrote a results summary as Markdown and converted it with `tools/md2wln.py` to a WLJS notebook, following the ROUTES rule that results go in a WLJS notebook. I did not open any notebook or window.
10. Not used:
    - The WLJS kernel (`mcp__wljs__*`): the page has no example code to preview live.
    - `wolframscript`.
    - `DocumentationBuild`: not asked for. It is the paclet-wide step in `build.wls`.
    - The `CheckDefinitionNotebook` lint: the skill calls it a pre-submission step, and it may contact Wolfram services.

## 3. Files

- Changed: `work/DocPageExamples/docs/DocPageExamples.md` (two list items backticked).
- Created: `work/DocPageExamples/build/DocSource/English/Guides/DocPageExamples.nb` (the guide authoring notebook, the deliverable).
- Created: `work/DocPageExamples/build/preview/DocPageExamples-guide.png` (front-end rendering of the built page).
- Created: `work/GuideBuildSummary.md` and `work/GuideBuildSummary.wln` (results summary, Markdown source and WLJS notebook).
- Scratchpad only (outside the work folder): `buildguide.wl`, `inspect.wl`, `inspect2.wl`, `raster.wl`, `req*.json`, `guide.png`, `DocPageExamples.orig.md` in `<scratch>/`.
- `wolfram-direct` keeps its own run records under `~/.local/state/wolfram-agenttools-direct/runs/` (by design of the tool).

(`work/` = `<repo>/tests/runs/2026-10-22/wolfram-guide-page/work`)

## 4. WLJS notebook

`<repo>/tests/runs/2026-10-22/wolfram-guide-page/work/GuideBuildSummary.wln` (converted from Markdown with `md2wln.py`, not opened). It is a summary notebook. The guide page itself is a Mathematica `.nb`, as Wolfram's documentation system requires.

## 5. Answer

The DocPageExamples guide page is built. The file is `DocPageExamples/build/DocSource/English/Guides/DocPageExamples.nb`, and a preview is in `build/preview/DocPageExamples-guide.png`.

It has:
- The title "Documentation Page Examples" and the abstract.
- **Symbols**: `MazeGenerate`, `MazeParse` and `MazeWalkTime` as linked function chips.
- **Reference Pages**: links to the 8 reference subtype pages.
- **Workflows**: links to the 2 workflow pages.
- The MarkdownToNotebook related link and 11 keywords.

The build ran offline (fresh kernel, network blocked, `$AllowInternet = False`) with no messages.

One fix to the source: the `MazeGenerate` and `MazeParse` lines had no backticks. A guide entry needs a backticked symbol to become a linked chip, so those two came out as plain, unlinked text. I backticked them; the wording is unchanged.

To decide:
- **Missing pages.** `docs/` has no symbol pages for `MazeGenerate` and `MazeParse`, so their new links will not resolve when `DocumentationBuild` runs. Should I write those two symbol pages?
- **Empty sections.** Tech Notes and Related Guides are empty (`RelatedTutorials: []`, no `RelatedGuides`).
- **Full build.** To build the paclet's finished documentation (`DocumentationBuild`, navigation and search index), `build.wls` needs its converter path corrected first. It currently points at `../../../MarkdownToNotebook.wl`, which does not exist here.

## 6. Problems

- **Unlinked entries in the source as given:** `MazeGenerate` and `MazeParse` had no backticks, so they had no chip or link. Fixed by editing the source. That was my judgment call on the owner's file. The original is saved in the scratchpad, and upstream has the same defect.
- **Unresolved links:** no `docs/MazeGenerate.md` or `docs/MazeParse.md` exists, so the links will not resolve at `DocumentationBuild`. The doc-pages conventions say to create such pages in the same pass. I did not, because that is outside "build the guide page". Question for the owner: write them?
- **Shadowing messages:** the first `wolfram-direct` call printed `p::shdw`, `name::shdw`, `tag::shdw`, `arguments::shdw`, `p$::shdw`, `rules::shdw` and `value::shdw` (`Sessions`…` vs `Global``), plus `General::messages`. They came from the tool's session setup or the paclet load, not from the conversion: `EvaluationData` of the `MarkdownToNotebook` call recorded 0 messages. The second build printed only `General::messages`.
- **Style deviations kept as written:**
  - Inline `` `Quantity` ``, `` `MazeParse` `` and `` `MarkdownToNotebook` `` render as unlinked code. The conventions prefer `[Quantity]()` links.
  - The reference-page entries keep a literal " - " separator rather than the " — " chip separator.
- **Not run:** `DocumentationBuild` and the `CheckDefinitionNotebook` lint (see Steps 10). The metadata "New in: XX" placeholder is the template default.
- **No Wolfram server contact:** every kernel ran under `wolfram-direct`'s network namespace with `$AllowInternet = False`. The upstream cloud `ResourceFunction` route was not used.
