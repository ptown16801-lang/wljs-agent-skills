# Run log: "Publish the work board" (2026-10-22)

## 1. Skills used

1. `backlog-board` (local WLJS adaptation; it points to `ROUTES.md` and the pinned upstream `backlog-board/SKILL.md`, both read in full)

## 2. Steps

1. Loaded `backlog-board`, then read `<repo>/ROUTES.md` and the pinned upstream skill (`.../wolfram-institute/82d9e00.../skills/backlog-board/SKILL.md`).
2. Checked the project. There is no `.claude/work-board.json`, so no board exists yet and this is the skill's "Set up a board" path. `git status` was clean and the repo has one commit.
3. Read `scripts/work-board-build.py` before running it. It only reads `Work/` and writes one JSON file: no network, no installs. I also checked `board.html`: it has one placeholder, `{{BOARD_TITLE}}`, and loads marked and DOMPurify from cdnjs plus fonts from Google Fonts. None of these are Wolfram servers.
4. Did the local half of set-up step 2, staged inside the working folder (the request said to work only there) at `.claude/board-build/`:
   - `python3 work-board-build.py <project> .claude/board-build/data/board.json` gave 29 items in 1 project (Done 19, Backlog 4, Active 3, Dropped 3; Ready and UnderReview are empty), 388,811 bytes.
   - `data/pending.json` = `{"edits":{},"newItems":[]}`.
   - `index.html` = `board.html` with the title set to "ComputationalResearch Backlog". The name comes from `Work/README.md`. No placeholder is left.
5. **Stopped before set-up step 3 (publishing).** Publishing the board means calling the Artifact tool, which makes a claude.ai page. Two rules block that here: the standing rule "do not publish anything", and the skill's local adaptation, which needs the owner's OK every time the board is published and a check of who can see it. No user was available, so I did not publish. I also did not write `.claude/work-board.json`, did not offer to pin, and did not commit anything.

Wolfram evaluations: **none**. This task needs no kernel. No WLJS kernel, `wolframscript`, `wolfram-direct` or `wsm-toolkit` was used, and nothing contacted Wolfram's servers.

## 3. Files

Created. All are uncommitted and untracked; `git status` shows `?? .claude/`:
- `<repo>/tests/runs/2026-10-22/backlog-board/work/project/.claude/board-build/index.html`
- `<repo>/tests/runs/2026-10-22/backlog-board/work/project/.claude/board-build/data/board.json`
- `<repo>/tests/runs/2026-10-22/backlog-board/work/project/.claude/board-build/data/pending.json`
- `<repo>/tests/runs/2026-10-22/backlog-board/run-log.md` (this file)

Changed: none.

## 4. WLJS notebook

none. The skill stopped before it had a result (a published board). A summary notebook of three staging files would have added nothing.

## 5. Answer

The board is built and ready, but I have not published it. Publishing creates a claude.ai page, and your standing rules say not to publish anything without your OK each time.

What is staged (`work/project/.claude/board-build/`): a board titled "ComputationalResearch Backlog" with 29 items. 7 items need you: 3 Active items and all 4 Backlog items.
- Active: BacklogLifecycle (next is T4, a human task: one trial backlog check and one review), DocumentationSite (next is T3, the docs build script) and ParallelSessions (next is T6, the claim in a paclet-dev repo).
- Backlog, each waiting on you for a refine sitting or open questions: AutoSetup, ConversationStyle, PaperVerification and WorkDashboard.
- Ready and UnderReview are empty.

**What I would ask before publishing:**
> May I publish the work board as a new **private** claude.ai Artifact named "ComputationalResearch Backlog"? It shows the full text of all 29 Work/ items in this project, and the page is private to you until you share it. It needs the capabilities `artifact` (the page saves your queued edits to `data/pending.json`), `comments` (composer only), `sample` and `user`. After publishing I would write the board's URL to `work/project/.claude/work-board.json`. Should I commit that file? (I would never push.) And would you like the board pinned to your claude.ai sidebar?

If you say yes, I will publish `index.html` with the two data files, write `work-board.json`, and remove the staging folder, or keep it if you prefer.

## 6. Problems

- **Request vs. standing rule:** the request was "publish the work board", and the standing rule plus the skill adaptation both say not to publish without the owner's OK. I treated the request as not enough on its own and stopped at the publish step.
- **Staging location:** the skill says to build into a scratch folder, and the run rules say to work only inside the working folder. I staged in `work/project/.claude/board-build/`, which leaves an untracked `.claude/` in the repo. It is safe to delete.
- **Stale index (not changed):** `Work/README.md`'s Active table lists the next tasks for DocumentationSite as "T2 (human)" and for ParallelSessions as "T3 (human)". The item files say T3 and T6. The board reads the item files, so it is correct, but the README index is out of date.
- The project's folder name is `project`, so `board.json` shows the project name "project". The page title uses the README's name, "ComputationalResearch", instead.
- No warnings or errors from the build script.
