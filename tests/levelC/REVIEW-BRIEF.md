# Level C review brief

You are an independent reviewer. Another session (the orchestrator) ran each skill below through a fresh agent and
graded the run. Your job is to check those grades against the evidence and overturn any that the evidence does not
support. Do not trust the orchestrator's verdicts or the run agents' own reports: check the files.

Repository: `<repo>`.

## For each skill in your list

Read:
- the card: `python3 tests/cards/cards.py prompt <skill>` (the request) and the `card('<skill>', ...)` entry in
  `tests/cards/cards.py` (the expected results);
- `tests/runs/2026-10-22/<skill>/run-log.md` and `auto-checks.json`, and the files in `work/` the log names;
- the orchestrator's grade: `tests/levelB/verdicts.json` entry `<skill>`;
- the rules: `TEST-PLAN.md` (six checks, status rubric) and `ROUTES.md` (routes, rule 0, results in a WLJS notebook).

Judge the six checks: **triggered** (the right skill loaded), **route** (WLJS by default, any other engine with a
stated reason), **rules** (no Wolfram-server contact, `$AllowInternet = False`, no installs/publishing, approval
gates respected), **notebook** (a WLJS notebook with the result, or a stated reason why none), **correct** (the
result is right: compare against the card's expectations and `tests/cards/reference-values.json`), **clean** (no
unexplained messages or failures).

Re-check at least one key result yourself for every skill whose result is a computation, a built file or a model:
- Wolfram values: a fresh kernel inside the network cut only, first line `$AllowInternet = False;`:
  `timeout 300 bwrap --unshare-net --unshare-pid --die-with-parent --dev-bind / / --proc /proc wolframscript -f <script>`.
- Built `.nb`: read it back the same way (`Get` it, count cells, look for `$Failed`).
- `.wln`: WLJS's own text format (not JSON); check it parses and holds the cells the log claims.
- Files claimed as created or unchanged: check they exist / compare with the source (`cmp`, `sha256sum`).
- Text results (wiki, backlog, papers): read the produced files and check the claims in the log against them.

## Ground rules

- Nothing may contact Wolfram's servers, from a kernel or any tool. No installs, no publishing, no pushes.
- Do NOT use the WLJS kernel or any `mcp__wljs__*` tool (test runs are using it), and open no windows or apps. To see what a run showed on screen, read the PNG captures in its `scratch/cap*/` folders (made with `tools/capture-wljs-windows.sh`).
- Write only inside `tests/levelC/` and `tests/levelC/scratch-<you>/`. Do not change run folders, verdicts, cards
  or skills. Kill only processes you started.
- No user is available; record questions instead of asking.

## Output

Write `tests/levelC/review-<you>.json`: an object keyed by skill, each value
`{"agree": true|false, "checks": {"triggered": "...", "route": "...", "rules": "...", "notebook": "...",
"correct": "...", "clean": "..."}, "rechecked": "what you re-ran or compared, with the values", "overturn": "why,
if agree is false", "notes": "..."}`. Each check value starts with `pass`, `fail`, `partial` or `n/a`, then the
reason. Then write `tests/levelC/review-<you>.md`: a short summary listing every disagreement first.
