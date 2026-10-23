# Run log: backlog-refine, ConversationStyle (2026-10-22)

## 1. Skills used

1. `backlog-refine` (local WLJS adaptation). Following it, I read ROUTES.md, the pinned upstream `backlog-refine/SKILL.md`, the upstream `backlog-add/SKILL.md` (item format, routing) and `document-revise` (local wrapper and upstream SKILL.md, which backlog-refine says to read first). I read these as files; I did not invoke them as separate skills.

## 2. Steps

1. Read `ROUTES.md`, the upstream `backlog-refine`, `backlog-add` and `document-revise` skills.
2. Read `Work/Backlog/ConversationStyle.md`, `Work/README.md`, `Wiki/Index.md`, `Wiki/Concepts/SkillNames.md` and `Wiki/Concepts/HookContract.md`. The fixture's `Work/` and `Wiki/` are byte-identical to the pinned plugin repo (`diff -rq`), so I researched the plugin code in the pinned copy (`~/.local/share/wolfram-agent-skills/wolfram-institute/82d9e00…`). I only read it.
3. Research in the plugin code (grep/sed):
   - skill names: the item uses pre-6.0.0 names;
   - which skills load `document-revise`;
   - the report steps of each skill;
   - the hooks (there is only a `PreToolUse` Read hook);
   - `scripts/auto-run.sh`, which writes the run digest in bash.
4. Research in Claude Code itself: I ran `strings` on the local Claude Code 2.1.296 executable and read the bundled JS around `output-styles`, `outputStyles`, `force-for-plugin` and `keep-coding-instructions`. No network was used. This answered the item's old open question 2.
5. Wrote `Wiki/Concepts/PluginOutputStyles.md` and added a line for it to `Wiki/Index.md`.
6. Edited the item:
   - rewrote Technical details (the LLM-owned part);
   - replaced the open questions with six numbered ones (the old Q2 is answered);
   - updated the `> Waiting on:` line;
   - reworded T1, since the lookup half is done and it now confirms the facts live;
   - updated T3 with the exact report sites and an explicit editing-rule part, so that Acceptance criterion 7 is served.

   I did not touch the user-owned sections (Title, Summary, Motivation, Acceptance criteria, Prompt history).
7. Ran the readiness check. Not ready, so the item stays in `Work/Backlog/`. There was no move and no `Work/README.md` change.
8. Wrote a summary page (`.md`) and converted it to a WLJS notebook with `tools/md2wln.py`, which needs no window and no kernel.
9. Committed locally: `208d560 docs(work): refine ConversationStyle, record plugin output styles`. No push. The generated `.wln` was left untracked, following the house rule that generated notebooks stay out of git.

**Wolfram evaluations:** none. The item is about Claude Code plugin behaviour, so nothing needed a kernel. I did not use the WLJS kernel, wolframscript, wolfram-direct or wsm-toolkit.

## 3. Files

All paths are under `<repo>/tests/runs/2026-10-22/backlog-refine/work/project/`:

- `Work/Backlog/ConversationStyle.md` (changed)
- `Wiki/Concepts/PluginOutputStyles.md` (new)
- `Wiki/Index.md` (changed, one line)
- `Work/Artifacts/ConversationStyleRefine_261022.md` (new, the summary source)
- `Work/Artifacts/ConversationStyleRefine_261022.wln` (new, generated, untracked)

Also this log: `<repo>/tests/runs/2026-10-22/backlog-refine/run-log.md`.

Scratch, outside the project: `<scratch>/cc-strings.txt` (the `strings` dump of the CLI).

## 4. WLJS notebook

`<repo>/tests/runs/2026-10-22/backlog-refine/work/project/Work/Artifacts/ConversationStyleRefine_261022.wln`

It was generated with md2wln.py, not saved from a live session. I did not open it or take a screenshot, because the rules say not to open windows.

## 5. Answer

**Task:** refine ConversationStyle.

**Before:**
- Three open questions.
- T1 was "find out whether plugins can ship output styles".
- Technical details used pre-6.0.0 skill names.

**After:**
- ✅ A plugin can ship output styles. I read this from Claude Code 2.1.296's code; it has not been seen live yet.
  - They go in `output-styles/` or in `outputStyles` in `plugin.json`.
  - Each one is named `computational-research:<name>`.
  - A user picks one in `/config`.
  - `force-for-plugin: true` turns one on for everyone while the plugin is enabled. The key is marked `@internal` and leaves no opt-out except disabling the plugin.
- ⚠️ A style replaces Claude Code's coding instructions unless the style file sets `keep-coding-instructions: true`.
- ⚠️ `document-revise` is not loaded in every session, only by skills that read it first, so it cannot be the only home for the rule.
- Technical details now list:
  - the four candidate homes and what each costs;
  - the exact report sites, by skill and section;
  - the digest edge case: `auto-run.sh` writes the digest in bash, so changing it is a script change.
- The facts are in the new wiki article `Wiki/Concepts/PluginOutputStyles.md`.
- T1 is now a live check of those facts. T3 names the report sites and the editing rule.

**Readiness:**
- ❌ Six open questions remain.
- ❌ You have not re-read the Acceptance criteria, and one of them uses stale skill names.
- ✅ Every criterion is served by a task.
- ✅ Every task is routed or marked `(human)`.
- ⚠️ The home for the rule stays open until T2.

The item stays in Backlog.

**Test instructions:**
- Open `Work/Backlog/ConversationStyle.md`, section *Technical details*, and read *Open questions* 1–6.
- Open `Wiki/Concepts/PluginOutputStyles.md` and check the table of routes.

**Questions for you (also in the file):**
1. Where should the rule live: a forced plugin output style, an opt-in output style, a `SessionStart` hook, or `document-revise` only? My lean is the `SessionStart` hook, with report templates in the skills. It reaches everyone, is documented, and can honour an opt-out.
2. Should users be able to opt out in their project `CLAUDE.md`? If yes, that rules out the forced style.
3. Shall I take the rule from the Prompt history alone? The alternative is that you paste your "How to Talk to Me" section into the item. A cold session cannot read your `~/.claude/CLAUDE.md`.
4. Does "the release steps" mean the `paclet-publish` report, the plugin's version bump and marketplace sync, or both?
5. Should the run digest files change shape too, or only the chat summary?
6. Will you update the Acceptance criteria to the 6.0.0 names (`backlog-run`, `backlog-autolab`, `backlog-add`, `document-revise`)? They are your lines, so I left them as they are.

**Next:** answer the questions in chat or in the file, then run `/backlog-refine ConversationStyle` again. When you say it is ready, I move it to `Work/Ready/`.

## 6. Problems

- The plugin output-style facts come from reading minified code in the CLI binary. I did not run a session, so none of them has been seen live. `force-for-plugin` is marked `@internal` and may change or vanish.
- I saw that the code switches output styles off in one restricted mode (it looks like the SDK or isolated mode), but I could not tell which mode. Whether a style reaches `claude -p`, subagents or the Desktop app is unknown. These checks are now T1.
- The string `pluginInstructionFiles` / `tengu_instruction_files_from_plugins` suggests that plugins might be able to ship instruction files, which would be another possible home. I did not follow this up, and it is not in the item.
- I had to interpret "release steps" (open question 4).
- An out-of-scope finding in the pinned upstream `scripts/auto-run.sh`: line 290 (`AUTONOMY_NOTICE`) still says "the `revise` skill", a pre-6.0.0 name. I did not change it, because the upstream copy is pinned and read-only.
- md2wln.py wrote the `.wln`, but I did not view it in WLJS (no window was opened).
- `ugrep` refused the first regex searches of the binary ("exceeds complexity limits"). I switched to `strings` plus Python. This had no effect on the results.
- I did not add a `## Progress` line. The skill does not ask for one in a refinement sitting, and Progress is for task sessions.
