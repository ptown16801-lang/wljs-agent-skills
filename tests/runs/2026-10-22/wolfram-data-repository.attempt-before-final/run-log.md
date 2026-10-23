# Run log: wolfram-data-repository (2026-10-22)

Request: "Build the Data Repository definition notebook from the Markdown source in this folder."

## 1. Skills used

1. `wolfram-data-repository` (local WLJS adaptation). It points to `ROUTES.md` and the pinned upstream
   `skills/wolfram-data-repository/SKILL.md` (MarkdownToNotebook @ 4d1e1391). I read both, plus upstream
   `docs/data-repository.md` and `examples/build.wls`.

No other skills were loaded.

## 2. Steps

1. Listed `work/`. It holds two Data-template sources, both byte-identical to the pinned upstream
   `examples/Data/` copies: `WallpaperGroups.md` and `TPTPProblemLibrary.md` (with its sidecar
   `TPTPProblemLibrary-index.wl`). `WallpaperGroups-out.md` is generated output, not a source. The request says
   "the Markdown source" (one), but there are two. No user was available to ask, and building writes only new
   files, so I built both.
2. Read the TPTP source fully. Its only network cell, which fetches from tptp.org (not a Wolfram server), is
   `#| eval: false`, so the build does not run it. Every other example uses the local index only.
3. Engine choice: a **fresh kernel via `wolframscript`**, run inside `bwrap --unshare-net` (a network
   namespace with no network access) with `$AllowInternet = False`. Why: the skill's local rule says to build `.nb` files in a fresh
   kernel, because the WLJS kernel redefines `Cell`/`Notebook`/`CurrentValue`/etc. and this build hangs
   there. The network namespace guarantees that nothing reaches Wolfram's servers. Scripts are in the
   scratchpad (`build-data.wls`). The call was
   `MarkdownToNotebook[src, out, "EvaluateSeparator" -> None, "UseCache" -> False]`:
   - `EvaluateSeparator -> None`, as upstream `build.wls` uses, so the `## Content` definitions stay in scope
     for the examples.
   - `UseCache -> False` so nothing is written to the user's PersistentObject store.
4. First WallpaperGroups attempt (fresh kernel): timed out after 540 s with no messages and no file.
   Diagnosis, in fresh kernels:
   - A small front-end test (`UsingFrontEnd`) passed in 4 s.
   - A debug run with a stack-printing ScheduledTask showed the converter blocked in `LinkConnect` inside
     `UsingFrontEnd` (the headless front end had started but never connected).
   - At the same time, other test sessions were starting their own headless front ends, and one of theirs was
     stuck the same way.
   Conclusion: the front-end launch hangs intermittently. It is not a converter or source problem.
   Concurrent front-end or kernel launches are the likely cause (not proven).
   I killed the orphaned headless `WolframNB` front ends (two pairs) that my own runs left behind. I matched
   each one by its open file handles and start time.
5. I added a front-end round-trip check at the start of the build script and a log file that is flushed after
   every line, then reran the WallpaperGroups build (fresh kernel, network sandbox). It succeeded in 14 s.
6. TPTP build (fresh kernel, network sandbox):
   - First attempt hung at the front-end start and was killed at 600 s. I found its orphaned kernel by its open
     handle to my `tptp.out` and stopped it.
   - Second attempt succeeded in 11.7 s.
7. Inspected both `.nb` files with `wolframscript` in the network sandbox (fresh kernel; `Get` of the file, no
   front end): cell styles, Input/Output pairs, tags, unfilled slots, `$Failed` occurrences, and whether the
   index is embedded.
8. Ran the Data Repository lint, `DefinitionNotebookClient`CheckDefinitionNotebook`, in a fresh kernel and
   the network sandbox (`check.wls`). It ran on **copies** in the scratchpad (`checkcopy/`), because stamping
   CellIDs and saving changes the file. The notebook was opened with `Visible -> False`, so no window
   appeared.
9. Tried to cross-check the TPTP expected values live in the **WLJS kernel** (`mcp__wljs__kernel_evaluate`, in
   the private context `testDataRepo``, which the call itself ends and removes). The skill says to use WLJS to
   preview examples. The call stayed "pending" after 220 s, and a trivial follow-up call (`{$Context, ...}`)
   also stayed pending, so the shared kernel was busy or unresponsive. `wljs status` showed it serving many
   other sessions' notebooks. I did not restart anything. If those two queued calls run later, they only read
   files, and the first removes its own context. No WLJS notebook was opened.

## 3. Files

Created (deliverables):
- `<repo>/tests/runs/2026-10-22/wolfram-data-repository/work/Data/WallpaperGroups.nb`
  (432,578 bytes)
- `<repo>/tests/runs/2026-10-22/wolfram-data-repository/work/Data/TPTPProblemLibrary.nb`
  (655,878 bytes)
- `<repo>/tests/runs/2026-10-22/wolfram-data-repository/run-log.md` (this file)

Scratch only (session scratchpad `<scratch>/`):
- Scripts: `build-data.wls`, `inspect.wls`, `inspect2.wls`, `inspect3.wls`, `check.wls`, `dbg.wls`,
  `fe-test.wls`, `fe-test2.wls`
- Logs and outputs: `wallpaper.log`, `tptp.log`, `check-*.log`, `*.out`
- Lint copies: `checkcopy/*.nb`

No source file was changed. Outside these paths, the Wolfram front end appended its usual startup lines to
`~/.Wolfram/Logs/FrontEnd/system.log`.

## 4. WLJS notebook

None.

## 5. Answer

I built the Data Repository definition notebooks. There are two Data-template Markdown sources in `work/Data`,
so I built both:

| | WallpaperGroups.nb | TPTPProblemLibrary.nb |
|---|---|---|
| Build | OK, 14 s | OK, 11.7 s |
| Cells (by style) | 150 | 223 |
| Evaluated examples (Output cells) | 10 | 13 |
| Unfilled template slots | 0 | 0 |
| Content cells tagged `DefaultContent` | 4 (data + primary + `ByLattice`, `ByPointGroup`) | 6 (index + primary + 4 named elements) |

- Both notebooks use the official Data template with the docked toolbar. All four example sections are filled
  (Basic Examples, Scope & Additional Elements, Visualizations, Analysis).
- The expected values in the sources match the evaluated outputs:
  - WallpaperGroups: 17 groups; orbifold characteristic 0 for all 17.
  - TPTP: 26,264 problems; 4,565 frontier problems; GRP ratings min 0, median 0.18, max 1 over 1,207 problems.
- The 216 KB compressed TPTP index is embedded as a closed initialization cell tagged `DefaultContent`.
- The tptp.org fetch example is shown, not run (`eval: false`).

Before submission:
- **Categories and Content Types checkboxes are empty in both notebooks.** Offline, the converter cannot load
  the official checkbox lists (`CheckboxesCell::autofail`). Tick them in Mathematica, or rebuild with the
  resource system reachable:
  - WallpaperGroups: Mathematics; Numerical Data, Entity Store.
  - TPTP: Mathematics, Computer Systems; Numerical Data, Text.
- Lint hints (`CheckDefinitionNotebook`, run offline on copies):
  - WallpaperGroups:
    - `DescriptionTooLong` (Warning): the Description is over the 128-character limit, so shorten it in the source.
    - `UnableToUseCell` (Warning, twice): probably the two empty checkbox grids.
    - `RasterizeDynamics` (Suggestion): the Dataset outputs.
  - TPTP:
    - `ThreeDotEllipsis` and `FoundUnformattedCode` ("File") (Suggestions).
    - `UnableToUseCell` (Warning, twice).
    - `RasterizeDynamics` (Suggestion).
- I did not deploy or submit anything. That needs your OK each time.

## 6. Problems

- **Ambiguous request:** two sources, so I built both. If only one was meant, the other `.nb` can be deleted.
  It is a new file and nothing was overwritten.
- **Intermittent front-end hang:** 2 of 4 build attempts (and both debug runs) hung in `LinkConnect` while the headless front end
  started. It ran fine on retry. Other sessions were starting front ends at the same time, and one of theirs
  hung the same way. Cause not proven; concurrent launches are the likely one.
  - `timeout` killing `bwrap` left orphaned `WolframNB` and `WolframKernel` processes from my runs. They
    ignored SIGTERM, so I stopped them with SIGKILL after confirming they were mine. Lesson: watch the build
    with a short front-end check and clean up after it.
  - An attempt to add `--unshare-pid` (so the processes die with the sandbox) was refused by the
    permission classifier.
- Messages during both builds: `CheckboxesCell::autofail` for Categories and for ContentTypes. Nothing else.
- `$Failed` appears inside Dataset output boxes. It is the Dataset display's own internal placeholder code
  (`tmpGrid$ = $Failed`), not a failed evaluation.
- **WLJS kernel unresponsive:** `mcp__wljs__kernel_evaluate` calls stayed pending (220 s) on the shared kernel,
  so the optional live WLJS preview of the examples was not done. The fresh-kernel build had already
  evaluated every runnable example. I did not restart WLJS, which needs the owner's OK.
- **Unsure:** that `UnableToUseCell` refers to the empty checkbox grids is inferred, because the lint gave no
  parameters. The lint's own requirements for statistical-metadata fields were not checked beyond what it
  reported.
- `$AllowInternet` was `False` at the start and end of every fresh-kernel run, and every one of them ran inside a
  network namespace with no network access (`bwrap --unshare-net`).
