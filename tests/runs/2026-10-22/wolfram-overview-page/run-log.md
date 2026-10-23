# Run log: wolfram-overview-page (2026-10-22)

Request: "Write and build an overview page for the DocPageExamples paclet."

## 1. Skills used

1. `wolfram-overview-page` (local WLJS adaptation). Following its instructions I read `ROUTES.md` and the pinned upstream `skills/wolfram-overview-page/SKILL.md`. No other skill was loaded.

## 2. Steps

1. Read `<repo>/ROUTES.md` and the pinned upstream skill (`~/.local/share/wolfram-agent-skills/markdown-to-notebook/4d1e1391.../skills/wolfram-overview-page/SKILL.md`).
2. Looked at the paclet in `work/DocPageExamples`: `build.wls`, `README.md`, `PacletInfo.wl`, the frontmatter of all 12 `docs/*.md` pages, and the guide page `docs/DocPageExamples.md`. The work copy is identical to the pinned upstream example `examples/Paclet/DocPageExamples` (checked with `diff -r`).
3. Read the converter's Overview builder (`overviewNotebook`, `tocCellContent`, `$docTemplateDirectories` in the pinned `MarkdownToNotebook.wl`). Checked that it calls `PacletInstall` only when Wolfram/Parser is missing; Parser 1.3.1 is installed, so no install was attempted.
4. Wrote `docs/Overview.md` (`Template: Overview`, `URI: WolframInstitute/DocPageExamples/tutorial/Overview`). It has five chapters: Guide (1 link), Symbols (MazeWalkTime), Reference Pages (3 topic sections with 8 links: MAZE, Lorem, RandomSignal / Integer, WallpaperGroup, CirclePlus / MazeParse::ragged, mazegen), Workflows (Filter a Dataset) and Workflow Guides (Data Wrangling). That makes 12 links, and each one points to a page the paclet builds. MazeGenerate and MazeParse are left out because they have no ref pages (the guide lists them as plain text too). The paclet has no tutorials, so there is no Tutorials chapter.
5. Made three changes to `build.wls`. The original is kept at `<scratchpad>/build.wls.orig`.
   - Overview pages now take their file name from `FileBaseName[srcFile]`, as the skill says (otherwise `Name: DocPageExamples` would have produced `Tutorials/DocPageExamples.nb`). `outPath` now also takes `srcFile`.
   - The converter is loaded from `../../../MarkdownToNotebook.wl` as before. If that file does not exist, it is loaded from `$MARKDOWN_TO_NOTEBOOK`. In this copy the relative path does not exist.
   - `CurrentValue[$FrontEnd, LightDark] = "Light"` became `CurrentValue[$FrontEndSession, LightDark] = "Light"`. The `$FrontEnd` form can be saved into the user's front-end preferences (`~/.Wolfram/FrontEnd/init.m`), which would change a system setting. The session form only affects the build's own front end.
6. Built the paclet documentation. **Engine: a fresh kernel via `wolframscript`**, with `MARKDOWN_TO_NOTEBOOK` set to the pinned converter, running `wolframscript -code '$AllowInternet = False; Get[".../build.wls"]'`. It took 79 s and exited with 0. Why: ROUTES.md and the skill adaptation say to build `.nb` files in a fresh kernel, because WLJS redefines `Cell`/`Notebook`/`MakeBoxes` and these builds break there. I did not use wolfram-direct because the whole build (13 pages, examples evaluated, DocumentationBuild) takes longer than its 120 s limit. `$AllowInternet` was still `False` at the end. The build uses a headless front end (`UsingFrontEnd`); no window was opened.
7. Checked the result. **Engine: a fresh kernel via `wolframscript`** (`$AllowInternet = False`), which read both Overview notebooks with `Get`. Why: inspecting a `.nb` belongs in a fresh kernel, not WLJS.
   - Authoring notebook: title `DocPageExamples`; 5 TOCChapter, 7 TOCSection, 8 TOCSubsection cells; 12 ButtonBox links with the right `paclet:` targets; Categorization: Entity Type Overview, Paclet Name, Context, URI `WolframInstitute/DocPageExamples/tutorial/Overview`; 13 keywords.
   - Built page: same TOC structure. DocumentationBuild turned every link into a resolved link template (`RefLinkPlain` / `PackageLink` / `StringTypeLink` / `EntityTypeLink`). It gave no warnings about unresolved links. Metadata: type Overview, uri `.../tutorial/Overview`, label "Wolfram Institute/ Doc Page Examples Overview".
   - The navigation `Index` holds `WolframInstitute/DocPageExamples/tutorial/Overview` (found with `strings`).
   - `~/.Wolfram/FrontEnd/init.m` has the same md5 checksum before and after the build (`de48749d0da3a82d7a22497fa168189e`).
8. Wrote a short summary page (`OverviewBuildSummary.md`) and converted it to a WLJS notebook with `python3 tools/md2wln.py` (no window opened, no WLJS kernel used).

The WLJS kernel was not used: the overview page has no runnable examples to preview.

## 3. Files

Created:
- `work/DocPageExamples/docs/Overview.md` (the source)
- `work/DocPageExamples/build/DocSource/English/...` (13 authoring notebooks, including `Tutorials/Overview.nb`; the other 12 are the existing pages, rebuilt)
- `work/DocPageExamples/DocPageExamples/Documentation/English/...` (13 built pages, including `Tutorials/Overview.nb`, plus `Index/`, `SearchIndex/`, `SpellIndex/`)
- `work/DocPageExamples/DocPageExamples/ResourceDefinition.nb` (written by `build.wls` as part of the full build)
- `work/OverviewBuildSummary.md`, `work/OverviewBuildSummary.wln`
- `$TemporaryDirectory/filtered.csv`: written outside the work folder by the existing FilterADataset workflow page's example, which runs during the build (this was already the page's behaviour)
- Scratchpad: `build.wls.orig`, `build.log`, `build.clean.log`

Changed:
- `work/DocPageExamples/build.wls` (the three edits in step 5)

## 4. WLJS notebook

`<repo>/tests/runs/2026-10-22/wolfram-overview-page/work/OverviewBuildSummary.wln` (converted from Markdown with md2wln.py, never opened or evaluated).

## 5. Answer

I wrote the overview page and built it into the paclet's documentation.

- Source: `DocPageExamples/docs/Overview.md`. It is the paclet's table of contents in five chapters: Guide, Symbols (MazeWalkTime), Reference Pages (grouped as Formats, Services and Devices / Interpreters, Entities and Characters / Messages and Programs), Workflows and Workflow Guides. It has 12 clickable links, one for every page the paclet ships.
- Built page: `DocPageExamples/DocPageExamples/Documentation/English/Tutorials/Overview.nb` (URI `WolframInstitute/DocPageExamples/tutorial/Overview`). All 12 links resolved, and the page is in the paclet's documentation index.
- `build.wls` changes:
  - Overview pages are now named after their source file (`Overview.nb`).
  - The script can find the converter through `$MARKDOWN_TO_NOTEBOOK` when it is run outside the MarkdownToNotebook repository.
  - The light-appearance setting now applies only to the build session, so it is not saved to your Mathematica preferences.
- To rebuild: `MARKDOWN_TO_NOTEBOOK=<path to MarkdownToNotebook.wl> wolframscript -f build.wls`.
- Optional, not done: the guide page's `RelatedTutorials: []` could list the overview so the guide links to it.

## 6. Problems

- **Offline search-index warnings** (not caused by the overview): while building the search index, DocumentationBuild calls `WolframLanguageData` (Wolfram Knowledgebase). With `$AllowInternet = False` this failed with `EntityValue::conopen` (x3) and `EntityValue::nodat`, followed by `Values/Lookup/Keys::invrl`, `Set::pspec1`, `AssociationThread::invrk` and `processWolframLanguageData::msgs` (for the properties Frequencies and Options). The SearchIndex was still written (`SearchIndex/5`, 45 KB). It may be missing the built-in-language enrichment data (autocompletion phrases and frequencies). This is the expected effect of the no-Wolfram-servers rule.
- `Localized::nokey` (x4) for the keys "Service Connection" and "Workflow". These come from the existing Lorem and Workflow pages, not the overview.
- The build's own progress `Print` lines (per-page "... -> ..." and "running DocumentationBuild") are not in the captured log; only the final "built 13 documentation notebooks" line is. All 13 output notebooks exist with the build's timestamps, so I think this is a quirk of the output capture, not a failure. I am not certain of the cause.
- The log also has many `autorelease() called with no AutoreleasePool` lines from the headless front end, and a stray printed CSV fragment ("Name","Subject","Score" / "Faraday","Physics",82). It most likely comes from the FilterADataset example output.
- The built Overview page carries `CitationPopupData -> {$Failed, ...}` in its TaggingRules (a DocumentationBuild default, probably because citation data needs a network). I did not investigate further.
- The edits to `build.wls` go slightly beyond writing the page. Two were needed to build in this location (the converter path, and naming Overview pages by file name as the skill instructs). The `$FrontEndSession` change protects the user's preferences. If the owner prefers the original `$FrontEnd` line, it should be reverted, keeping in mind that it may write `LightDark` into `init.m`.
- The upstream skill suggests `docs/Tutorials/Overview.md`. This paclet's `build.wls` only scans `docs/*.md`, so I put the file at `docs/Overview.md`. The output path is the same (`Tutorials/Overview.nb`).
