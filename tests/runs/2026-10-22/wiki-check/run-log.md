# Run log: wiki-check, 2026-10-22

## 1. Skills used

1. `wiki-check`, the local WLJS adaptation. Following it, I read `ROUTES.md` and the pinned upstream `skills/wiki-check/SKILL.md` at plugin revision `82d9e00`.

No other skill was loaded.

## 2. Steps

1. I read `ROUTES.md` and the upstream skill. The upstream skill has no references or scripts of its own.
2. I listed the project. It holds only `Wiki/`, `Work/` and `Research/`, plus a git repo with one fixture commit. There are no `skills/`, `scripts/`, `commands/`, `ARCHITECTURE.md` or `README.md`, although the wiki links to them.
   - `diff -rq` showed that the fixture's `Wiki/`, `Work/` and `Research/` are byte-identical to the pinned plugin snapshot `~/.local/share/wolfram-agent-skills/wolfram-institute/82d9e00…/`.
   - I therefore checked references to code against that snapshot (read-only). For the final link check I used a scratch overlay: symlinks to the snapshot's code plus a copy of the fixture's edited folders.
3. **Step 1 (load state):** I read `Wiki/Index.md` and `Wiki/Status.md`.
4. **Step 4 (links):** I wrote a Python link checker in the scratchpad. It checks relative Markdown links and `#anchors` outside code fences. It found 3 broken links in `Wiki/`:
   - two to `Work/Active/JournalAsPaperSink.md`, which is now in `Work/Done/2026-08-21-JournalAsPaperSink.md`;
   - one to a gitignored `Work/Runs/` digest.
   It also found 55 broken links in `Work/` items. After the fixes, `Wiki/` has 0 broken links.
5. **Step 2 (stale articles):**
   - Every backticked `skills/`, `scripts/`, `commands/`, `hooks/` and `agents/` path in the wiki exists in the snapshot. The only exceptions are globs and PureMath's own `build_notebooks.wls`, which is external.
   - Every backticked `<area>-<word>` skill name exists. The exception is `paclet-dev`, which names a repo type, not a skill.
   - I grepped for skill names from before 6.0.0. Only `research-notebook` turned up, in `Status.md`: once in *Current state* (fixed) and five times in dated log entries (left alone, they are history).
   - CamelCase identifiers missing from the plugin code all belong to external repos (MathNotebook, MarkdownToNotebook, PureMath, InfraGeometry) or to harness fields. I could not verify them offline.
   - I ran the hook test set from `HookContract.md` against the snapshot's `hooks/check-nb-read.sh` with bash and piped JSON. A `.nb` path exits 2 with 4 lines on stderr, a `.md` path exits 0, and non-JSON input exits 0. This matches the article.
   - `CutWithNoJournal.md` was stale in two places. It gave the document's path as `NotebooksLLM/SidonBound.md`, which is now `Research/Artifacts/SidonBound_260821.md`. It also said the `.nb` is gitignored, but it is tracked and no ignore rule covers it.
6. **Step 3 (missing articles):**
   - All 22 `Concepts/` and `Resources/` `.md` files are in the index.
   - The `.py` measurement scripts in `Concepts/` are each referenced by the articles that use them.
   - By its own Index statement, the wiki leaves code coverage to `ARCHITECTURE.md`/`README.md`. Every skill, script and command in the snapshot is named there. `hooks.json` and `check-nb-read.sh` are covered by `HookContract.md`.
   - No new article was needed.
7. **Step 4 (cross-links):** I counted inbound and outbound links per article. `PaperStyleExercise.md` had no outbound wiki links, so I added a *See also* section with 4 links.
8. **Step 5 (resources):** All 3 resources have a `## Recover` section with `Clone:` and `Target:`.
   - MathNotebook and PureMath are private SSH URLs.
   - Two pins are older than the latest reading the articles describe.
   - I read `scripts/recover_resources.sh`: it does not use `Commit:`. I did not test whether the URLs are reachable, because the skill says to do that only if the user asks for a deep check.
9. **Step 6 (index):** The index is complete, so nothing was added.
10. **Step 7 (work items):** I read `Work/README.md` and the 3 Active items.
    - None is stalled: the last Progress entries are from 2026-10-05/06, 16 days ago. Each waits on a `(human)` task or a ruling.
    - Two index rows are out of date: DocumentationSite names T2, which is done (next is T3); ParallelSessions names T3, but the item runs T6 first.
    - I only reported these, following the skill.
11. **Result page:** I wrote `Artifacts/WikiCheck_261022.md` and converted it with `tools/md2wln.py`, after reading the script, to `Artifacts/WikiCheck_261022.wln`. I deleted and regenerated my own `.wln` three times to correct the text: the Work-link count, a wording fix, and the broken-link count 4 → 3.
12. I did not commit anything. The upstream skill does not ask for a commit, and the fixture repo is left with the changes uncommitted.

**Wolfram evaluations: none.** No step of this skill needed a kernel. No WLJS kernel, `wolframscript`, `wolfram-direct` or `wsm-toolkit` was used, and nothing contacted the network.

## 3. Files

Changed, in the working folder `…/wiki-check/work/project/`:
- `Wiki/Concepts/CutWithNoJournal.md`: link retargeted; SidonBound path updated; "gitignored" claim removed.
- `Wiki/Concepts/PaperStyleExercise.md`: link retargeted; *See also* section added.
- `Wiki/Concepts/AutonomousPipeline.md`: link to the gitignored digest turned into a plain path.
- `Wiki/Status.md`: `paper-create-notebook` (`research-notebook` before 6.0.0) in *Current state*.

Created:
- `Artifacts/WikiCheck_261022.md`: summary source.
- `Artifacts/WikiCheck_261022.wln`: WLJS summary page.
- `<repo>/tests/runs/2026-10-22/wiki-check/run-log.md`: this file.
- In the scratchpad, outside the project: `links.py`, an `overlay/` folder (symlinks to the snapshot and a copy of the fixture) and a stderr capture file.

## 4. WLJS notebook

`<repo>/tests/runs/2026-10-22/wiki-check/work/project/Artifacts/WikiCheck_261022.wln`

It was written by `md2wln.py`, not saved from a live notebook. It is unevaluated and has 4 `.md` cells and no code.

## 5. Answer

Wiki health check:
- Articles checked: 22, all of them in the index.
- Stale articles fixed: 2.
  - `CutWithNoJournal.md`: SidonBound now lives at `Research/Artifacts/SidonBound_260821.md`, and its `.nb` is not gitignored.
  - `Status.md`: *Current state* still used the pre-6.0.0 name `research-notebook`.
- New articles created: 0.
- Broken links fixed: 3. Two pointed to `JournalAsPaperSink` in `Active/` (it is now in `Done/`) and one to a gitignored run digest. `Wiki/` now has no broken links.
- Cross-links added: a *See also* section in `PaperStyleExercise.md`.
- Missing index entries added: 0.
- Resource issues: 2.
  - MathNotebook's Recover pin `5f68f30` lags the article's last reading at `b99cde6`.
  - PureMath's pin `17baf04` lags its cited `6e9d9c55`.
  - `recover_resources.sh` ignores `Commit:` either way.
- Stalled work items: 0. All 3 active items wait on you: BacklogLifecycle T4, DocumentationSite T3 onward, and ParallelSessions T6 then your T3. Two `Work/README.md` rows name the wrong next task.

Needs your attention:
- `Status.md` says generated `.nb` files are not committed, yet `Research/Artifacts/SidonBound_260821.nb` is tracked. Should it be untracked, or the rule restated?
- Should the resource pins be bumped to the latest reading?
- 55 old links in `Work/` items, mostly in `Done/`/`Dropped/`, use names from before 6.0.0 or point to gitignored digests. Should they be updated or left as history?

The wiki edits are uncommitted.

## 6. Problems

- The fixture has no plugin code, so the 25 wiki links into `skills/` and `scripts/`, plus `ARCHITECTURE.md`/`README.md`, do not resolve inside the working folder. I checked them against the pinned snapshot instead. This assumes the snapshot is the code the fixture's wiki describes, which the byte-identical `Wiki/`/`Work/`/`Research/` support.
- The stale-article check is mechanical:
  - It checks that paths, skill names, old names and identifiers exist, plus one behavioural test of the hook.
  - I did not re-verify every prose claim in about 300 kB of articles.
  - Claims about external repos (MathNotebook, MarkdownToNotebook, PureMath, InfraGeometry) cannot be checked offline without clones.
- My anchor checker uses a GitHub-style slug approximation. It reported only the two `#landing-autoitem-on-main` anchors, in `Work/Done/2026-08-20-ModelRouting.md`, where the heading is now *Landing `work/<Item>` on `main`*. It may miss unusual headings.
- The first draft of the summary said 58 Work links. That count wrongly included the 3 wiki links, and I corrected it to 55 before finishing.
- I did not look at the `.wln` in WLJS. Opening it would need a browser or app window, which the ground rules forbid. I checked its structure only: header, 4 Input cells, footer.
- I did not commit. If the owner expects wiki fixes to be committed, that is still to do.
- No warnings or kernel messages: no kernel was used.
