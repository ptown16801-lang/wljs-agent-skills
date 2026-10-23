# How this was built

**Who:** designed, directed and reviewed by the repository owner; written with
[Claude Code](https://claude.com/claude-code) (Anthropic) as the coding agent. Commits that Claude helped write
carry a `Co-Authored-By: Claude` trailer.

**When:** October 21–23, 2026, on one Linux workstation (Ubuntu 24.04, Wolfram Mathematica 15.0, Wolfram System
Modeler 15.0, WLJS Notebook 3.1.4, Node 24).

## Approach
1. **Pin, don't fork.** Every upstream skill collection was fetched once at a fixed commit and checksummed. The
   upstream files are never edited; each generated skill points to its upstream and adds a thin local layer.
2. **One source of truth.** `build.mjs` holds a table of all 70 skills: where each comes from, what changes on WLJS,
   and which actions need the user's OK. It writes every `skills/*/SKILL.md`, `tests/RESULTS.md` and
   `docs/SKILLS.md`, so documentation cannot drift from the skills.
3. **Offline by rule.** Wolfram kernels ran with `$AllowInternet = False`, and fresh kernels ran in a network
   namespace with no network. The one exception came first: on Oct 22, before the offline rule, one Wolfram paclet
   (PacletCICD) was installed from Wolfram's paclet repository for the test setup ([DEPENDENCIES.md](../DEPENDENCIES.md)).
   Features that need Wolfram's servers are marked as not tested.
4. **Results you can open.** Each result was saved as a WLJS notebook and shown to the owner, not only described.

## Testing (three levels; details in [TEST-PLAN.md](../TEST-PLAN.md))
- **Level A:** the official test suites under the skills: eight Wolfram AgentTools suites, run in both the WLJS
  kernel and a fresh kernel with every difference explained ([tests/levelA/RESULTS.md](../tests/levelA/RESULTS.md)),
  and MarkdownToNotebook's 174 converter tests (174/174, [TESTING.md](../TESTING.md)).
- **Level B:** each of the 70 skills invoked by a fresh agent that had not seen this work, on Wolfram's own example
  material, graded on six checks (triggered, route, rules, notebook, correct, clean). Run logs in `tests/runs/`.
- **Level C:** independent reviewer agents re-read every verdict against its evidence and could overturn it
  (`tests/levelC/`). Failed and stalled attempts are kept next to the final run, so retries are visible.

Result: 59 works, 1 works with fixes, 6 limited (an external gap is named), 4 not tested (a named blocker).

## Defects
Fourteen defects were found and then reproduced by hand, offline, before being claimed
([tests/bugs/BUGS.md](../tests/bugs/BUGS.md)); reports from test agents that could not be reproduced are listed
separately and not claimed. Where a local fix exists it is a patch in `patches/`, with a write-up in
`tests/bugs/fixes/` showing the before/after evidence. None of these has been reported upstream yet.

## Review
Each phase ended with a short post-action review: what was agreed, what was done, where it drifted and the rule
that prevents the drift next time. Those rules are in [ROUTES.md](../ROUTES.md) under "Local rules".

## Publishing
The public repository is a clean copy of a private working repository: files enter through an allowlist, personal
paths and identifiers are replaced by placeholders, and an automated scan (`tools/privacy-scan.py`, also run in CI)
blocks the upload if anything personal remains.
