# Run log: project-provenance, 2026-10-22

## 1. Skills used

1. `project-provenance` (local WLJS adaptation). It points to `ROUTES.md` and the pinned upstream `skills/project-provenance/SKILL.md`, and I read both in full.

No other skill was loaded.
I also read the project's own `skills/paper-create-notebook/SKILL.md` and `build.md` (provenance passages only), `skills/notebook-create/SKILL.md` (Provenance section), `scripts/generate_notebooks.wls` (the comment parser) and `Wiki/Concepts/TaggingRulesRegistry.md`, to match the format the project's generators expect.

## 2. Steps

1. **Read and checked the project.** I read the routes, the upstream skill and the project (`CLAUDE.md`, `Wiki/Index.md`, `Research/Artifacts/`, git state).
   The project had no `## Provenance` section, so tracking was off.
   The git tree was clean at the fixture commit 19d362f.
   The only research note is `Research/Artifacts/SidonBound_260821.md` with its generated `.nb`.
   The `.nb` was committed (not gitignored here) and had a `"ResearchNotebook"` key in `TaggingRules` but no `"Provenance"` key and no cell `"SourceLines"`.
2. **Turned tracking on** (upstream § *Turning it on*).
   I added `## Provenance` with `Prompt tracking: **on**` to `CLAUDE.md`, created `Wiki/Prompts.md` with the ledger header, and added a `## Prompts` section to `Wiki/Index.md`.
   The upstream `grep` toggle check now prints `on`.
3. **Backfilled the SidonBound record** (upstream § *Backfilling*).
   - **Ledger entry** for `Research/Artifacts/SidonBound_260821.nb`.
     It gives the intent (distilled from the frontmatter's `prompt:` summary), the generator (`paper-create-notebook · claude-opus-5`, from the frontmatter and `Wiki/Status.md`), the source `.md`, and a `Recorded:` line saying it was backfilled.
     There is no `Prompt:` line, because no verbatim prompt survives.
   - **`.md` back-pointer:** an `<!-- provenance: ... -->` comment placed directly **after** the YAML frontmatter.
     Upstream says "leading", but putting it before the frontmatter would break the frontmatter, which the paper build turns into the head cells.
   - **`.nb` back-pointer:** the `"Provenance"` key merged into the notebook `TaggingRules` next to `"ResearchNotebook"`.
     I tried three times, all with **wolfram-direct** (a fresh, network-blocked kernel).
     ROUTES says any `.nb` reading or building goes to a fresh kernel, because WLJS redefines `Notebook`/`Cell`/`NotebookSave`.
     a. `Get` the `.nb`, then `stampTaggingRule` (upstream helper), then `Export[..., "NB"]` to a **scratch** copy, then `Get` it back.
        Cells and the `"ResearchNotebook"` fingerprint stayed identical, but the other options did not.
     b. A second wolfram-direct call compared the options.
        `Export` had rewritten `FrontEndVersion` (Mac ARM became Linux x86) and dropped `Visible -> False` from the embedded `StyleDefinitions`.
        The diff was 284 lines.
        I rejected this route.
     c. Instead I inserted the key into the original file's text with one 6-line edit (Python, scratch copy).
        A third wolfram-direct call parsed it: `Head` is `Notebook`, the cells are identical, all non-`TaggingRules` options are identical, `"ResearchNotebook"` is identical, the keys are `{"ResearchNotebook", "Provenance"}`, the provenance read-back is correct, and `$AllowInternet` is `False`.
     Then I copied the checked file over the project `.nb`.
     The `"Provenance"` value is the association parsed from the `.md` comment with the parser logic of `scripts/generate_notebooks.wls`, plus `"source"`.
   - **Document provenance file** `SidonBound_260821.provenance.md` (upstream § *Document provenance*, always on).
     It has an empty `## Rules` and an empty `## Rounds`.
     `## Requests` holds the v1 request, summarised from the frontmatter and marked with the baseline commit 19d362f (the fixture import, not a generator commit), and today's chat request.
4. **WLJS summary page** (local adaptation: a skill whose result is files ends with a WLJS page).
   Following the coordinator's mid-run rule change, I did **not** call `mcp__wljs__new_notebook` or open any notebook.
   I wrote `Research/Artifacts/ProvenanceSummary_261022.md`, which has its own provenance comment and `[ LLM Generated ]` marker, plus its own ledger entry, because tracking is now on.
   I converted it with `tools/md2wln.py` (no window, no kernel).
   The provenance comment became a hidden first `.md` cell, as the adaptation requires.
   I deleted and rebuilt the `.wln` once (it was a file I had made a minute earlier) after fixing one sentence in the source.
   The read-back snippet is in a plain fence, not a `wolfram` fence, so it is not an Input cell: `Get` of a `.nb` must not run in WLJS.

Wolfram evaluations: 3, all with wolfram-direct, for the reason given in step 3.
There were no WLJS kernel evaluations (`mcp__wljs__*` / `wljs eval`), no `wolframscript` calls and no `wsm-toolkit` calls.
Nothing was installed, committed or pushed, and nothing contacted any network.

## 3. Files

Changed (project at `<repo>/tests/runs/2026-10-22/project-provenance/work/project/`):
- `CLAUDE.md`
- `Wiki/Index.md`
- `Research/Artifacts/SidonBound_260821.md`
- `Research/Artifacts/SidonBound_260821.nb`

Created:
- `Wiki/Prompts.md`
- `Research/Artifacts/SidonBound_260821.provenance.md`
- `Research/Artifacts/ProvenanceSummary_261022.md`
- `Research/Artifacts/ProvenanceSummary_261022.wln`
- this run log: `<repo>/tests/runs/2026-10-22/project-provenance/run-log.md`
- scratch only (outside the project): `<scratch>/` (`stamp.wl/.json`, `diff.wl/.json`, `verify.wl/.json`, `orig.nb`, `stamped.nb`, and the rejected `Export`ed `SidonBound_260821.nb`)
- wolfram-direct run records under `~/.local/state/wolfram-agenttools-direct/runs/` (`run-dy1u8fm9`, `run-zvj7tabw`, `run-ntmovkl7`), written by the tool itself

## 4. WLJS notebook

`<repo>/tests/runs/2026-10-22/project-provenance/work/project/Research/Artifacts/ProvenanceSummary_261022.wln`

It was built with `md2wln.py` and not saved from the WLJS app.
I did not open it in a window and did not evaluate it.
No WLJS notebook was opened at any point in this run.

## 5. Answer

Prompt tracking is now on for this project (`CLAUDE.md` § *Provenance*).
The new prompt ledger is `Wiki/Prompts.md`, linked from `Wiki/Index.md`.

The research note `SidonBound_260821` now carries its provenance in three places:
- the ledger entry: intent, `paper-create-notebook` with `claude-opus-5` on 2026-08-21, and the source `.md`;
- a hidden `<!-- provenance: ... -->` comment in the `.md` (after the frontmatter);
- a `"Provenance"` key in the `.nb`'s `TaggingRules`, merged next to the existing `"ResearchNotebook"` fingerprint.

No cell, option or fingerprint of the notebook changed, which I checked in a fresh offline kernel.
The original prompt was not kept verbatim anywhere, so the ledger records a distilled intent and says that it was backfilled today.
I also started the note's document provenance file, `SidonBound_260821.provenance.md`.
A summary page is at `Research/Artifacts/ProvenanceSummary_261022.wln`.

Nothing is committed.
Please review the diff and commit these files before the next revision round on SidonBound, or that round will read the new comment as a hand edit: `CLAUDE.md`, `Wiki/Index.md`, `Wiki/Prompts.md`, the SidonBound `.md`, `.nb` and `.provenance.md`, and the summary `.md`/`.wln`.

## 6. Problems

- **Kernel `Export` changes a `.nb` beyond the stamp.**
  Exporting the stamped notebook from a fresh kernel rewrote `FrontEndVersion` and dropped `Visible -> False` from the embedded stylesheet, so upstream's "stamp before `ExportString`" is not change-free for an existing notebook.
  I used a text insertion instead, checked by parsing.
  As a side effect the `.nb`'s "Internal cache information" header (`NotebookDataLength` and the byte offsets) is now stale by about 6 lines.
  I expect the Mathematica front end to discard a stale cache and read the file normally, but I did not open it in a front end to confirm.
- **In-place change of the `.nb`.**
  ROUTES rule 3 says to write new outputs unless replacing a file is agreed.
  I read "record provenance for the research note" as covering the note's own files, as the skill specifies.
  The original is preserved in git (19d362f).
  If that reading is wrong, `git checkout -- Research/Artifacts/SidonBound_260821.nb` restores it, and the `.md` comment plus the ledger still hold the record.
- **The helper's option order.**
  The parsed result is not `===` to what `stampTaggingRule` would build, only because the helper puts `TaggingRules` last while this file has it first.
  The contents match.
- **Comment placement.** It is after the frontmatter, not at line 1 (see step 3).
  I did not test whether MarkdownToNotebook drops an HTML comment in that position on a rebuild.
  `Wiki/Concepts/NotebookCommentRound.md` reports HTML comments convert cleanly, and `notebook-create` strips the provenance comment before conversion in any case.
- **Uncertain facts.**
  The model id `claude-opus-5` and the generator come from the frontmatter (`Claude Opus 5 (claude-opus-5[1m])`) and `Wiki/Status.md`/`Wiki/Concepts/CutWithNoJournal.md`.
  Those name the source as `NotebooksLLM/SidonBound.md`, an older location, while the fixture holds it as `Research/Artifacts/SidonBound_260821.md`.
  The v1 baseline in the provenance file is the fixture commit, not a generator commit.
- **Things I did not do.**
  I did not commit: the project's protocol is "present, wait", and no user was available.
  I did not update `Wiki/Status.md` (`wiki-update` was not requested).
  I did not render the `.wln` to look at it, because no windows were allowed.
- **Rule change.** The coordinator changed the rule mid-run (no `mcp__wljs__new_notebook`, no opening notebooks).
  It arrived before any WLJS notebook was opened, so none was.
