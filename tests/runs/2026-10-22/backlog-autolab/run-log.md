# Run log: backlog-autolab, 2026-10-22

Request: "Run the backlog autonomously while I'm away."
Project: `<repo>/tests/runs/2026-10-22/backlog-autolab/work/project`

## 1. Skills used

1. `backlog-autolab` (local WLJS adaptation), which pointed to `ROUTES.md` and the pinned upstream
   `.../wolfram-institute/82d9e00d.../skills/backlog-autolab/SKILL.md`. I read both in full.

No other skill was loaded.

## 2. Steps

No Wolfram evaluation was run. No engine was used (no WLJS kernel, no wolframscript, no wolfram-direct, no wsm-toolkit),
because selection and preflight only read files and git state.

1. Read `ROUTES.md` and the upstream `backlog-autolab` SKILL.md. Also read the worker definition
   `agents/autolab-worker-high.md` in the pinned plugin.
2. **Select (upstream step 1).** The project is a git repo on `master` (`47bd1d0`), with a clean tree, no `.gitmodules`
   and no other worktrees or branches. `Work/Ready/` does not exist (the README says "Ready: None"). No items were named,
   so the queue is every `Work/Active/*.md` that carries `> Autonomous: allowed`, in `Work/README.md` order:
   | Item | First unchecked task | Routing | Runnable? |
   |---|---|---|---|
   | BacklogLifecycle | T4 (human), the trial | none | **No**: the task is `(human)` |
   | DocumentationSite | T3, the docs build script | `model: opus, effort: high` | parses; see blockers |
   | ParallelSessions | T6, the claim in a paclet-dev repo | `model: opus, effort: high` | parses; see blockers |
   No item has a `needs-human` line in its `## Hand-off`. No `work/<Item>` or `auto/<Item>` branch exists, so each
   item's state was read from the checkout.
3. **Preflight (upstream step 2).** Settings checked: `~/.claude/settings.json` has only `switchModelsOnFlag` and
   `theme`, so there are no allow, ask or deny rules and no `defaultMode`. The session directory
   `<repo>` has no `.claude/` folder. That leaves every need below without a
   rule (see Problems).
4. Stopped before **Isolate (step 3)** and **Dispatch (step 4)**, because the local adaptation requires the owner's OK
   for each worktree and each background subagent, and no owner is available. No worktree, branch, commit or subagent
   was created.

## 3. Files

- Created: `<repo>/tests/runs/2026-10-22/backlog-autolab/run-log.md`
  (this file).
- Nothing in the project was changed. Its tree is still clean on `master` at `47bd1d0`.

## 4. WLJS notebook

none. Nothing ran, so there are no result files to summarise.

## 5. Answer

I did not start the run. Here is the queue, the blockers, and what I need from you.

**Queue (dry run):**
- **BacklogLifecycle**: skipped. Its only task left is T4 (human), the trial.
- **DocumentationSite T3**: branch `work/DocumentationSite`, worktree `~/.cache/autolab/project/DocumentationSite`,
  worker `autolab-worker-high`, model opus.
- **ParallelSessions T6**: branch `work/ParallelSessions`, worktree `~/.cache/autolab/project/ParallelSessions`,
  worker `autolab-worker-high`, model opus.

**Blockers, beyond needing your approval:**
1. **The code the tasks change is not in this repo.** The project has only `Work/`, `Wiki/` and `Research/`. It has no
   `skills/`, `scripts/`, `commands/` or `.claude-plugin/`. DocumentationSite T3 targets `skills/paclet-docs`,
   `skills/paclet-publish` and `scripts/deploy_paclet_docs.wl`. ParallelSessions T6 needs
   `skills/backlog-run/paclet-worktree.md`, `scripts/scaffold-paclet-dev.sh` and `scripts/test-auto-run-routing.sh`.
   A worker would produce `no-commit` or `fault`.
2. **External paths are missing.** DocumentationSite's Hand-off depends on InfraGeometry under `~/Library/CloudStorage/...`
   and on PureMath and MarkdownToNotebook clones under `~/...`. None of these exist on this machine.
3. **Downloads and Wolfram servers.** T3 moves the MarkdownToNotebook clone to `3462fc5`, which needs a fetch from
   GitHub (a download, so it needs your OK). With the default cap of 3 tasks, DocumentationSite would reach T5. T5 is
   "a public paclet resource" and at most a private deploy, which means the Wolfram Cloud. Your no-Wolfram-servers rule
   forbids that, so the cap for this item would have to be 2 or less.
4. **The worker agent types are not registered.** The upstream dispatch uses
   `subagent_type: computational-research:autolab-worker-high`, but this session only offers `claude`,
   `general-purpose`, `Explore`, `Plan` and the like. A worker would have to run as `general-purpose` with the upstream
   worker prompt.
5. **There are no permission rules.** Every worker would need these: `Skill`, `Bash(git status|add|commit|mv|log|diff|show|rev-parse:*)`,
   `Bash(cd ~/.cache/autolab/project/*)`, `Bash(bash scripts/*)`, and
   `Read`/`Edit`/`Write(~/.cache/autolab/**)`. Without them an unattended run cannot be left alone, unless this session
   is in auto mode, where the classifier might still deny calls. You add them with `/permissions`; I never write
   settings myself.

**What I would ask you:**
> May I run `/backlog-autolab` on DocumentationSite (T3 only, `--max-tasks 1`) and ParallelSessions (T6, T5:
> `--max-tasks 2`), `--parallel 1`? That means two git worktrees under `~/.cache/autolab/project/`, branches
> `work/DocumentationSite` and `work/ParallelSessions`, and one background `general-purpose` subagent per task (3 in
> total), each on **opus** at **high** effort. Expected usage is about 0.5–1.5M tokens per task, roughly 2–4M in
> total, on included subscription access only, with no paid fallback. Before that: (a) is this the right repo, given it
> has no `skills/` or `scripts/`? Should the run target the plugin repo instead? (b) Do you approve the GitHub fetch
> of MarkdownToNotebook `3462fc5`? (c) Will you add the permission rules listed above?

## 6. Problems

- I stopped at the approval gate, as the local adaptation requires. Nothing ran.
- The fixture repo does not have the code that the queued tasks change, and the external paths in the items' Hand-offs
  (macOS `/Users/pavel`, `~/Library/CloudStorage`) do not exist here.
- `computational-research:autolab-worker*` agent types are not available in this session.
- I could not tell the permission mode from the settings files (no `defaultMode`). A tool-server instruction in this
  session says "While auto mode is active", which suggests auto mode, but that is not confirmed.
- `Work/README.md` lists DocumentationSite's next task as T2 (human), but the item file has T2 done and T3 next. The
  README index is out of date. I did not change it.
- `~/.cache/autolab/CollatzTrial` exists from another run. It is unrelated and was not touched.
- Unsure: I read `--max-tokens` and the usage estimate as provisional (upstream calls it provisional until a real task
  is measured). The token figures above are rough guesses.
