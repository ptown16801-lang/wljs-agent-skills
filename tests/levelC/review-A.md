# Level C review, reviewer A (Oct 22, 2026)

19 skills reviewed against their run folders, session records (`tasks/<agent>.output`), cards and the Level B verdicts.
Agree: 13. Disagree: 6. Four of the six are downgrades (a rules check that should be partial). Two are upgrades (a notebook check graded too harshly).
Every result I re-checked holds. No skill's answer was wrong.

## Disagreements

| Skill | Check | Orchestrator | Mine | Evidence |
|---|---|---|---|---|
| wiki-update | rules | pass (auto) | partial | Called `mcp__wljs__new_notebook`, which opens a WLJS window. The brief in force said "Do not open, start, stop or restart any desktop application or window". Also left `Global`nb` set in the shared kernel. |
| search-modelica-docs | rules | pass (auto) | partial | Same window opening (`new_notebook` in the session record). The verdict's "before the rule change" excuse does not hold, because the original brief already said "window". |
| wiki-search-wolfram | rules | pass (auto) | partial | Same window opening (notebook 019). |
| backlog-review | rules | pass (auto) | partial | The second scripted reply said "Finish the send-back (steps 1-5, no push)". The agent also ran step 6, `git branch -d work/IndexSync`. It is safe (the branch was merged) and the agent stated it, but it went beyond the approval. |
| backlog-info | notebook | partial | pass | The result is a chat report, not files, and the agent gave a reason for having no page. The rubric accepts "a stated reason why none". |
| wolfram-setup | notebook | fail-then-rule | pass / n-a | The card has `notebook=False`. The agent stated its reason (no windows, change nothing). |

In all six, the skill's result itself is correct.

## Agreements (with what I checked myself)

- **wiki-init**: in a fresh kernel, Collatz 27 → 111 steps, peak 9232. 97/871/837799/63728127 → 118/178/524/949. 2^1030 hits the recursion limit. All of these match the wiki table.
- **wiki-check**: my own link checker finds the same 3 broken links in the snapshot, and 0 after the fixes.
- **backlog-add**: the item has all the template sections and stays in Backlog. The routing wording is the skill's own.
- **backlog-refine**: the user-owned sections are byte-identical before and after. The claimed CLI strings are present in the Claude Code binary.
- **backlog-board**: re-running `work-board-build.py` gives the same 29 items. The only differences are the timestamp and the id prefix.
- **backlog-autolab**: no Agent call, worktree or branch exists.
- **paper-cite**: the upstream script, run unmodified on the agent's saved XML, produces a byte-identical BibTeX entry.
- **backlog-run**: the README rows on `work/IndexSync` match the first unchecked task of each item (T4/T3/T6).
- **paper-journal**: the journal recompiles (2 pages, no errors). An independent search confirms the failures {22,32,33,34} for n ≤ 40 and s(43)=6. The orchestrator's "warning" already covers the Global symbol leak.
- **wiki-add-resource**: the PDF's SHA-256 matches, it has 15 pages, and both BLEU figures are in the text.
- **wiki-search-math**: only Wikipedia, OEIS and nLab were contacted. Mian–Chowla reproduces A005282 (20 terms).
- **project-create**: 18 record gaps, the last 114 at 492113. The other statistics match too, and the project's own code gives the same.
- **project-provenance**: the edited `.nb` has cells and non-TaggingRules options identical to HEAD, and the fingerprint is unchanged. I agree with the orchestrator's open question about the in-place edit.

## Notes and questions for the owner

1. **The brief says `.wln` is JSON. It is not.** It is WLJS's own text format (`%---%Notebook%---%` blocks). I checked the files with a small parser instead: header and footer present, Input/Output counts, no `$Failed`.
2. **Window rule.** Several agents (wolfram-setup, backlog-info) read the original brief's "window" rule as covering `new_notebook`, and three did not. Should the earlier window openings count against the run (my view) or be excused?
3. **Fixture drift.** The wiki-check, backlog-info, backlog-autolab and backlog-refine fixtures had only `Wiki/Work/Research`. The paper-cite, paper-journal and project-provenance fixtures had the whole plugin repo, which is what `cards.py` now builds. The agents compensated with the pinned snapshot.
4. **backlog-run adaptation.** It lists branch and commit under "Needs the owner's OK" and also says "follow the repository's own rules". The card expects a commit. Worth making unambiguous in `build.mjs`.
5. **Results that depend on scripted replies:** wiki-init, wiki-update and backlog-review. backlog-autolab and backlog-board test only their gates.

Evidence and scripts: `tests/levelC/scratch-A/` (`check1b.wls`/`check1.out`, `check2.wls`/`check2.out`, `cite_local.wls`/`cite.out`, `journal/`, `board.json`, `calls.py`, `wln.py`).
