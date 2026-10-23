# Run log: wiki-update, 2026-10-22

## 1. Skills used

1. `wiki-update` (local WLJS adaptation, `~/.claude/skills/wiki-update/SKILL.md`), which pointed to
   `<repo>/ROUTES.md` and the pinned upstream
   `~/.local/share/wolfram-agent-skills/wolfram-institute/82d9e00d97c5cd08ee302913618ea8ac3060b615/skills/wiki-update/SKILL.md` (both read in full).

## 2. Steps

1. Loaded `wiki-update`; read ROUTES.md and the upstream SKILL.md.
2. Listed the project (`find`, `ls -la`, `git status`, `git log --all`). The working tree is clean, one commit
   (`47bd1d0 Fixture: Wolfram Institute plugin example project (Wiki, Work, Research)`), no stashes.
3. Looked for the function the request names: there is **no `Code/` folder** and no `Code/Tools.wl` in the project;
   `grep -rn NestTrajectory` over the project (excluding `.git`) finds nothing; no other branch or commit holds it.
   The only hit for `Tools.wl` is a sample line in `Wiki/Concepts/ItemFileFormat.md` (an example task "sweep the renames through `Tools.wl`"), unrelated.
4. Read `Wiki/Index.md` and `Wiki/Status.md`. The wiki describes itself as the knowledge base for the
   ComputationalResearch plugin itself ("not a research project"); it has no code/function articles.
5. Stopped: the upstream skill's step 2 needs the changed entity's actual content (signature, behaviour), and
   there is nothing to read. Writing an article from the function's name alone would invent documentation.
   No user is available, so the question is recorded below instead.

Wolfram evaluations: **none**. No kernel was used (no WLJS kernel, no wolframscript / wolfram-direct, no wsm-toolkit):
there was no code to load or test.

## 3. Files

- Created: `<repo>/tests/runs/2026-10-22/wiki-update/run-log.md` (this file).
- No project file was created or changed (`Wiki/`, `Work/`, `Research/` untouched; `git status` clean).

## 4. WLJS notebook

none (no wiki files were produced, so there was nothing for a summary page to list).

## 5. Answer

I couldn't find `NestTrajectory`, so I haven't changed the wiki. There is no `Code/` folder in this project at all,
and `NestTrajectory` appears nowhere in the project or its git history (one commit, clean working tree). It may
not have been saved yet, or it may be in a different project or folder.

What I would ask:

> I can't find `Code/Tools.wl` or any `NestTrajectory` definition in
> `.../wiki-update/work/project`. Which file holds it? Is it saved, or in another repo or folder? Once I can read it,
> I'll load it in the WLJS kernel to check a small example, then:
> (a) add `Wiki/Concepts/NestTrajectory.md` (or a `Wiki/Code/` article, if you'd rather keep code separate from
> concepts), (b) add an Index entry, (c) add a "Recent changes" line to `Wiki/Status.md`, and (d) cross-link related articles.
> Also: this wiki says it covers the plugin itself, not a research project. Should a project function be documented here at all?

## 6. Problems

- The request's premise didn't hold: `Code/Tools.wl` and `NestTrajectory` don't exist in the working folder.
- A file `<repo>/tests/out/institute/CollatzTrial/Code/Tools.wl` exists
  outside the working folder (seen in a filesystem `find` for `Code/Tools.wl`). I didn't open or use it, because the
  task is limited to the working folder and nothing ties that project to this request.
- `Wiki/Status.md` was read but not checked against `Work/README.md`, since no update was made.

## After the user's reply

The user's reply: the file hadn't been saved. `Code/Tools.wl` is now in the project (uncommitted), and it should be documented in this wiki.

### Skills used

No new skill was loaded. I continued under `wiki-update` (already loaded, with ROUTES.md and the upstream SKILL.md read).

### Steps

1. Read `Code/Tools.wl` (286 bytes, untracked). It holds `NestTrajectory[f_, x_, test_] := NestWhileList[f, x, test]` and a `::usage` message. It has no `BeginPackage`.
2. **WLJS kernel via `mcp__wljs__kernel_evaluate`** (ROUTES default; the function is plain computation). I loaded the file with `Get` inside `Block[{$Context = "wikiUpdNT`", $ContextPath = {"System`"}}, ...]`, so its symbols didn't land in the shared `Global`` context. Checks: `$AllowInternet` False; Collatz from 27 gives 112 elements, starts `27, 82, 41, 124, 62`, peaks at 9232 and ends `4, 2, 1`; `test` false at the start gives `{5}`; halving from 64 gives `{64, …, 1}`; the result `===` the matching `NestWhileList`; no `Global`NestTrajectory` was created. Then `Remove["wikiUpdNT`*"]`; afterwards no names were left.
3. **WLJS kernel via `mcp__wljs__kernel_evaluate`**, second call in context `wikiUpdNT2``, also removed afterwards: `Get` issued no messages (`Check`); the usage string reads back exactly; a 4-argument call stays unevaluated; no attributes.
4. Wrote the article `Wiki/Code/NestTrajectory.md` in the upstream format: title, `*[[ LLM Generated ]]*`, summary, Details, See also. Updated `Wiki/Index.md` with a new `## Code` section and entry, and extended the scope sentence. Updated `Wiki/Status.md` with a scope line in *Current state* and a dated *Recent changes* entry. Checked that the relative links resolve.
5. Cross-links: no existing wiki article relates to this function. `Concepts/ItemFileFormat.md` mentions a `Tools.wl` only in a made-up example task, so I added no back-links. The article's See also points to the source file.
6. Steps 6–7 of the skill (provenance, journal) were skipped. The project has no `CLAUDE.md`, so neither toggle is on.
7. Summary page, **WLJS MCP tools**: `mcp__wljs__new_notebook` (id 009), `add_cells_batch` (a `.md` summary cell and `nb = EvaluationNotebook[]`), `evaluate_cell` on both. Saved with `NotebookSave[RemoteNotebook["b4d37c3b-…"], "/abs/…/WikiUpdate_261022.wln"]` through `kernel_evaluate`. The file appeared right after the call; I checked it with `ls` and `head`.

### Files

- Created: `<repo>/tests/runs/2026-10-22/wiki-update/work/project/Wiki/Code/NestTrajectory.md` (new folder `Wiki/Code/`)
- Changed: `<repo>/tests/runs/2026-10-22/wiki-update/work/project/Wiki/Index.md`
- Changed: `<repo>/tests/runs/2026-10-22/wiki-update/work/project/Wiki/Status.md`
- Created: `<repo>/tests/runs/2026-10-22/wiki-update/work/project/WikiUpdate_261022.wln` (summary page)
- Changed: this run log
- Not changed: `Code/Tools.wl`. Nothing was committed.

### WLJS notebook

`<repo>/tests/runs/2026-10-22/wiki-update/work/project/WikiUpdate_261022.wln` (still open in WLJS as notebook 009).

### Answer

I've updated the wiki. There's a new article, `Wiki/Code/NestTrajectory.md`, under a new **Code** section in the Index, and `Status.md` notes the change and that the wiki now also covers `Code/`. The article covers:
- the definition (an alias of `NestWhileList[f, x, test]`), and that `Get` puts it in the current context because `Tools.wl` has no package wrapper
- the behaviour: `test` sees only the latest element, the result ends with the first element that fails `test`, and it is `{x}` if `x` already fails
- that there is no iteration cap: a 4th argument isn't accepted, so a test that never fails runs until aborted
- your Collatz example: 112 terms from 27, peak 9232

I checked all of this by loading `Tools.wl` in the WLJS kernel, in a private context that I removed afterwards. A summary page is at `WikiUpdate_261022.wln`. Nothing is committed, and `Code/Tools.wl` is still untracked.

### Problems

- First `kernel_evaluate` call: my own test code raised `Set::shape` (a wrong `Reap` destructuring) and read the usage message wrongly. It wasn't a problem with `Tools.wl`. The second call repeated those checks properly: no messages from `Get`, and the usage text was correct.
- `NotebookSave` returned before writing: `FileExistsQ` was False right after the call, but the file was there when I checked with `ls` straight afterwards.
- The summary notebook's cell `nb = EvaluationNotebook[]` (the method ROUTES.md gives) set `Global`nb` in the shared kernel. I left it set rather than clear a name another session might use.
- Location choices I made myself: `Wiki/Code/` as a new folder (the wiki had only `Concepts/` and `Resources/`), and the summary `.wln` at the project root (no folder convention covers it).
- The existing articles use the marker `*[ LLM Generated ]*` (single brackets), while the upstream skill specifies `*[[ LLM Generated ]]*`. I followed upstream, so the wiki is now inconsistent on this.
- The usage message says "while test is True", but the result also includes the first element that fails `test`. The article states this explicitly. I didn't change the code.
