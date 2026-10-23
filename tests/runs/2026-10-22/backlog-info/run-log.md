# Run log: backlog-info, 2026-10-22

## 1. Skills used

1. `backlog-info` (local WLJS adaptation, `~/.claude/skills/backlog-info/SKILL.md`). Following it I read `ROUTES.md`, the pinned upstream `backlog-info/SKILL.md`, and the two upstream files it says to read first: `document-revise/SKILL.md` and `backlog-add/SKILL.md`. Those two were read as files, not loaded as skills.

## 2. Steps

All steps were read-only, in `work/project` (git repo, branch `master`, one commit `47bd1d0` "Fixture: Wolfram Institute plugin example project").

1. Read `ROUTES.md`, the upstream `backlog-info` skill, and the upstream `document-revise` and `backlog-add` skills.
2. Gather:
   - Listed the repo. `Work/` has Backlog (4), Active (3), Done (19) and Dropped (3). There is no `Ready/` and no `UnderReview/`.
   - Read all 4 Backlog items in full (AutoSetup, ConversationStyle, PaperVerification, WorkDashboard), the 3 Active items in full (BacklogLifecycle, DocumentationSite, ParallelSessions), `Work/README.md`, `Wiki/Status.md` and `Wiki/Concepts/SkillNames.md`.
   - Branches: `git branch --list 'work/*' 'auto/*'` (merged and unmerged) returned none; the only branch is `master`.
   - Worktrees: `git worktree list --porcelain` shows only the main checkout.
   - Board: `.claude/work-board.json` does not exist, so there was no board to read.
   - Ages: ran the skill's awk command on each item's last `## Progress` line.
3. Premise checks. The fixture has only `Wiki/`, `Work/` and `Research/`: no `skills/`, `scripts/`, `commands/` or `README.md`. `diff -rq` shows its `Work/` and `Wiki/` are identical to those in the pinned plugin source (`~/.local/share/wolfram-agent-skills/wolfram-institute/82d9e00…`, computational-research 6.0.0). So I checked the cited files, skill names and README sections against that pinned source, read-only, with `ls` and `grep`:
   - `skills/revise` and `skills/board` no longer exist.
   - There is no `output-styles/` folder.
   - `scripts/check-env.sh` still looks for the npm `wolfram-mcp` package.
   - `skills/paclet-docs/SKILL.md:25` still says guide pages are out of scope.
   - `README.md` still marks the AutoSetup, PaperVerification, DocumentationSite and ParallelSessions sections as "in design".
4. Judged and wrote the report (section 5), then stopped. The skill says to wait for the user's word before any move, and no user is available.

Wolfram evaluations: **none**. This task reads markdown and git state only, so no engine was used: no WLJS kernel, wolframscript, wolfram-direct or wsm-toolkit. Nothing contacted any network service.

## 3. Files

- Created: `<repo>/tests/runs/2026-10-22/backlog-info/run-log.md` (this file).
- Changed in the project: none. `git status --porcelain` is empty and there are no commits.

## 4. WLJS notebook

none. See Problems for why.

## 5. Answer

**Waits on you**
1. Four Backlog drafts say `Waiting on: you`, each needing a refine sitting: AutoSetup, PaperVerification, ConversationStyle, WorkDashboard. Command: `/backlog-refine <Item>`.
2. BacklogLifecycle has only T4 (human) left: try one backlog check and one review of a real item. Today's check could count as the first half; that is your call. Its Hand-off also leaves you three jobs that only you can do:
   - copy the `version`, `description` and `keywords` of `plugin.json` into the marketplace repo's `marketplace.json`;
   - commit and push both repos;
   - commit and publish the blog post's *Version 6.0* entry.
3. ParallelSessions has a question you haven't answered yet (in its Hand-off): should a session working on an item's branch stop editing `Wiki/Status.md` and `Work/README.md`? In the parallel trial, the second merge conflicted in exactly those files.
4. One decision has never been filed as an item, open since 2026-07-28 (in `Wiki/Status.md` § Open questions): should `/backlog-run-scheduled` stop inheriting your `~/.claude/settings.json` allow rules? It changes how much an unattended run may do.
5. Nothing else: nothing under review, nothing Ready, no `work/*` or `auto/*` branches, no leftover worktrees, no board set up.

**Stale**
- By age (no Progress for 30 days): none yet.
  - AutoSetup, PaperVerification and WorkDashboard last moved on 2026-09-26 (26 days ago; 30 days on 2026-10-26).
  - ConversationStyle has no Progress line at all. Its prompts are dated 2026-09-27; the git date is just the date the fixture was committed.
- Premise gone:
  - **WorkDashboard**: mostly delivered. The board skill shipped on 2026-09-26 (now `backlog-board`), and the item's own Hand-off asks whether to close it. ParallelSessions settled the phone and session-control question on 2026-10-04 (Agent View plus Remote Control). The item also points to `skills/board/SKILL.md` and `/auto-run`, which no longer exist under those names.
  - **ConversationStyle**: names `skills/revise/SKILL.md` (now `document-revise`) and the old skill names next-session, autolab, work, revise and new-paper.
  - **PaperVerification**: names lean, new-paper, journal and autolab (now paper-lean, paper-create, paper-journal, backlog-autolab). Its open question 1 ("given the Artifacts rule") was written before FolderRule (Done 2026-10-04), which changed that rule.
  - **AutoSetup**: names `/refine` and `check-env` (now `backlog-refine`, `project-check-env`). Its check-env complaint still holds. Its point that the setup must offer the MCP profile with paclet-docs' symbol tools is being removed by DocumentationSite.

**Overlaps**
- **AutoSetup and DocumentationSite**: both decide which Wolfram MCP tools paclet-docs needs. DocumentationSite decided on 2026-10-06 to stop using them.
- **WorkDashboard and ParallelSessions**: both cover how you watch and steer work from the browser or phone. ParallelSessions chose Agent View and put off linking the board to sessions.

**Next**
1. **Drop WorkDashboard**: the board skill delivered it. File the leftovers (local server, wiki view, run digests) as a new item only if you still want them.
2. **Refine AutoSetup**: three open questions. Remove the paclet-docs profile point in light of DocumentationSite.
3. **Refine PaperVerification**: six open questions. Re-ask question 1 under the new folder rule.
4. **Refine ConversationStyle**: the Acceptance criteria and three open questions. Its Progress is empty and its skill names need updating.
5. **Answer** the ParallelSessions question in Waits on you, item 3.
6. **Fix the Active table in `Work/README.md`**: it says DocumentationSite's next task is T2 (human), but T2 was settled on 2026-10-06 and T3 is next. It says ParallelSessions' next task is T3 (human), but T6 is next.
7. **Resume** DocumentationSite (T3) and ParallelSessions (T6), with `/backlog-run <Item>` or `/backlog-autolab`. No session has run on either since 2026-10-06, and both are marked `Autonomous: allowed`.

Counts: Backlog 4, Ready 0, Active 3, UnderReview 0, Done 19, Dropped 3.

What I would ask: **"Which of 1–7 shall I do?"** For a drop or a fix, I would `git mv` the item into `Dropped/` with the date prefix, update `Work/README.md`, and commit `docs(work): backlog info — <what moved>`, without pushing. Refine, answer and resume are other skills' sittings; I would only name the command.

## 6. Problems

- **Stopped at the approval point, as the skill requires.** Nothing was moved, dropped or fixed. Even the stale `Work/README.md` table (Next 6) was left for the owner's word.
- **The project code is not in the fixture.** The premise checks used the pinned plugin source instead. Its `Work/` and `Wiki/` are identical to the fixture's, and it is version 6.0.0. If the owner's live repo has moved past that commit, some findings may differ.
- **Mac paths not checked.** Several items point to paths on the owner's Mac (`~/Library/CloudStorage/...`, `~/...`), such as s1paper, InfraGeometry, PureMath and the blog post. They are not on this Linux machine, so I could not check them.
- **One item's age is guessed.** ConversationStyle has no Progress line, and its git date (2026-10-22) is just the fixture's commit date. I used its Prompt history dates (2026-09-27) instead.
- **The 30-day line is a guess too.** BacklogLifecycle's own Hand-off says the 30-day threshold is "a guess". All three dated Backlog items cross it within four days.
- **A trial link points at Wolfram's servers, and I did not open it.** DocumentationSite's T1 Test instructions link wolframcloud.com pages. Opening them would break the owner's no-Wolfram-servers rule.
- **No WLJS notebook.** The local adaptation says a skill whose result is files ends with a WLJS notebook summary, but this run's result is a chat report and no files were produced. A summary `.wln` would have meant:
  - writing an untracked file into the repo, against backlog-info's "changes nothing until the user says so";
  - or using `mcp__wljs__new_notebook`, which opens a window in the shared desktop app, against the ground rules.

  I chose not to make one. If the owner wants it, the report above can go into a `.wln` with `tools/md2wln.py`, with no window needed.
- **Did not count this as BacklogLifecycle T4.** This run could serve as the "one backlog check" half of that trial, but I did not tick or touch the item.
