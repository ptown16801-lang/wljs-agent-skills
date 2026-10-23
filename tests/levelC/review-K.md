# Review K: local fixes to vendored Wolfram material (W4, W5, I1-I5)

Reviewer K, Oct 22, 2026. Read-only review. I changed none of the reviewed files. Everything I re-ran is in
`tests/levelC/scratch-K/`. Python ran under `bwrap --unshare-net`. Every Wolfram run used a fresh
`wolframscript` under `bwrap --unshare-net --unshare-pid`, with `$AllowInternet = False;` as the first line.
From the I-bug runs on, the wrapper `scratch-K/wk.sh` also bound scratch copies over `~/.Wolfram/{ApplicationData,
FrontEnd, Logs, Paclets/Configuration, Paclets/Temporary, Objects/Persistence}`. The deviations are listed at the end.

## Verdicts

| Bug | Verdict | One line |
|---|---|---|
| W4 | **agree with notes** | The pins are now right: Submarine went from 8 OK / 6 wrong to 14 OK / 0 wrong, and 98.0% of SM-drawn ends match. An undisclosed side effect: 223 component rotations change in 77 of the 193 files. |
| W5 | **agree with notes** | Before → after: 1/0/1 → 1/1/1. The suite passes 123/123 both before and after. BUGS.md calls the mechanism "found", but the note says it is inferred. |
| I1 | **agree** | General::stop cells go 1 → 0 in both page trees. The converter part is needed: without it the stop cell moves to Lorem. Tests 174/174 before and after. |
| I2 | **agree** | All three defects are fixed as described. `.maze` relies on an undocumented internal, which the fix discloses. |
| I3 | **agree** | All four text errors are fixed and the arithmetic checks out. The code blocks are byte-identical. |
| I4 | **agree** | Keywords go from {} to 5. The guide, the tutorial and a symbol page without Keywords are identical. |
| I5 | **agree with notes** | 35 is right and matches the shipped template. The new sentence still says the 35 come "from" the online registry, which was not checked. |

There are no disagreements.

## Step 1: do the diffs match the backups and the live files? (all bugs)

I restored every `*.orig-2026-10-22` into scratch trees (`scratch-K/pc/{w4,w5,mi}`) and applied the seven
`patches/*.diff` to them. All seven applied cleanly; I4 applied with offset 6 after I1. The results are
**byte-identical to the live vendored files**: 6/6 W4 files, 1/1 W5 file and 9/9 I files.

- Against the vendored `MANIFEST.sha256` files, the only mismatches are exactly the patched files. Every backup
  equals its manifest (original) hash. There are no stray files besides the backups.
- Toolkit (it has no manifest): the only files newer than Oct 2 are the six W4 files. There is no `__pycache__`.

## W4: schematic pins (agree with notes)

**Before/after reproduction.** I copied the toolkit twice (`tk-orig` restored from the backups, `tk-new` = live)
and ran the REPORT.md commands on fresh copies of `Submarine-nographics.mo` through `WSM_TOOLKIT_ROOT=`.

- `--analyze` output is identical before and after.
- The original's `check_pins.txt` equals the report's file byte for byte: **8 OK, 6 WRONG, 4 n/a**.
- Fixed: **14 OK, 0 WRONG, 4 n/a**. The ends now land where System Modeler draws them: s_ref (-88,0), flange (-66,0),
  axis (-16,-14), frame_b (-14,-20), world.frame_b (34,20) twice.

**Fallback.** With `WSM_HOME=/nonexistent`, the connect lines are identical to the original output and 10 per-end
`WARNING:` lines are printed, plus a count line.

**Check against SM's own drawings.** I re-ran `check_vs_sm.py` with the live libpins. The numbers are identical
to the fixer's: 6174 ends, 532 unresolved, **5529/5642 = 98.0%** (new) against **1991/5642 = 35.3%** (old).
- The script reuses libpins' parsing helpers, so the method is not fully independent.
- The ground truth (the Line ends SM stored) is independent, though, and a systematic error could not reach 98%.

**Regression, four bundled models** (`--annotate --force --write`, old vs new):

| Model | Result |
|---|---|
| ElectricCircuit | **byte-identical**, 0 warnings |
| BlockCircuit | all 12 lines change |
| DCMotor | 1 rotation and 7 lines change |
| MultiBody Pendulum | 1 rotation and 3 lines change |

I hand-checked every BlockCircuit end against the MSL 4.1.0 placements: Add u1/u2 at (-120,±60), y at 110, and
SISO u at -120, including the rotations 90, 180 and 270. All 24 ends are correct. In DCMotor, SignalVoltage.v
(origin 0,120), SpeedSensor.w (110) and the EMF p/n/flange are correct.

**Bulk.** I regenerated all 193 bundled examples with both toolkits myself:
- 386/386 runs exit 0.
- My outputs are byte-identical to the fixer's `bulk/orig` and `bulk/new` (0 differences).
- There are 408 per-end warnings in 13 files. Every one traces to a library that is not installed
  (PlanarMechanics, BioChem or ModelPlug, directly or through an in-file base).

**Code.**
- `routing._port_offset` tries the own icon, then libpins, then the guess, and the guess adds a warning.
- `place()` replaces `_rot` and adds flips and non-integer pins.
- Exceptions on the install lookup and on parsing are caught. One residual risk: `pin_offset` has no catch-all
  around `_find_class`/`_find_pin`. The bulk run hit no crash.

**Not disclosed (risk/side effect).**
- Because `layout._orient_two_ports` now sees real L/R pins, the upstream "stand two-port components up" step
  fires far more often. Component rotations change for **223 of 2352 instances in 77 of 193 files**. Origins are
  unchanged.
  - Example: DCMotor's `inertiaWithDamper` becomes rotation 90 in a horizontal chain. Both flange lines then run
    from the icon centre to its top/bottom pins.
- Overall this is still an improvement on a crude metric: lines whose path enters an instance icon's interior. In
  the 135 single-class files that count went from 708 to 592 of 1042 lines (56 files better, 26 worse). DCMotor
  went from 8 to 6.
- It is still a layout change that BUGS.md/W4.md do not mention. W4.md only reports `--analyze` as identical and
  the line-level effects.
- SKILL.md keeps "leaves it perpendicular to that edge", which the known open limit (pin direction is ignored)
  contradicts.

**Overstatement (minor).** "98.0% of 5,642 ends" is accurate, but those are 5,642 of 6,174 ends. 532 (8.6%)
cannot be resolved because their libraries are not installed. BUGS.md says this only implicitly.

## W5: FailedAssertions after a plain call (agree with notes)

`scratch-K/w5/repro.wls` uses copies of the helper and the backup:
- Original: fresh 1 / **after a plain call 0** / after reload 1. Block 1/**0**, Module 1/1.
- Patched: **1/1/1**, Block 1/1, Module 1/1.

My own extra cases:
- `g3[x_] := (Assert[$z > 5]; x)` with no Block: 0 → 1.
- A nested `outer[x_] := x + inner[]`, where `inner` holds the Assert: 0 → 1.
- A passing call still counts 0. `"Result"` is unchanged.
- After `FailedAssertions`, a plain call still gives no message and `Assert[False]` stays inert, so the Off state is
  intact.

**Suite.** I ran `run-suite.wls` on scratch copies of the fixer's `.wlt`, with the helper path pointed at my copies.
The upstream suite's own helper equals the original byte for byte. Result: **original 123/123, patched 123/123**.

**Fix.** One line, `Update @ Assert`, before the handler block. It is minimal, it changes no global state, and the
cost is negligible.

**Overstatement.** BUGS.md says "mechanism found". W5.md says the explanation is *inferred*, because the
evaluated-mark flag cannot be inspected. The observations fit, but the wording in BUGS.md is stronger than the
evidence. The WLJS kernel was not re-run, which W5.md discloses.

## I1: stray General::stop (agree)

I made full repo copies, `scratch-K/i/before` (backups restored; passes the manifest) and `after` (live), and ran
the fixer's `run-build.wls` and `count-stop.wls`. Both builds were the full `build.wls`, including
DocumentationBuild, and each took about 70 s.

| Build | build/DocSource | DocPageExamples/Documentation |
|---|---|---|
| before | **1** (`ragged.nb`) | **1** (`ragged.nb`) |
| after | **0** | **0** |
| build.wls part only, original converter (`bonly`) | 1 (moved to `Lorem.nb`) | 1 (`Lorem.nb`) |

The `bonly` row confirms the reason given for the converter part.

**Page comparison** (IDs and change times stripped):
- 6 of 12 authoring pages are identical.
- `ragged.nb` gains the I2 example (+ExampleText, +Input, +Output), and its stop cell is gone.
- `MazeWalkTime` gains +5 Keywords (I4). The guide has one GuideText line changed (I2).
- `Lorem.nb` differs only by the run-specific ServiceObject UUID (ce09ad9f… vs 603db160…).

**Tests.** `tests.wls` passes **174/174 before and 174/174 after**. The build-log message sets before and after are
the same offline noise (EntityValue, WFRCrosslinks).

**Code.** `$MessageList = {}` per cell mirrors notebook semantics, and nothing else in the converter reads
`$MessageList`. The `exportDeterministicNB` dependency is internal, which the fix discloses.

## I2: DocPageExamples defects (agree)

`scratch-K/i/i2.wls` was run on the before and after copies.

| Check | Before | After |
|---|---|---|
| Ragged message | "Line 1 is shorter" | "Line 2 is longer … (7 instead of 5 characters)" |
| `MazeGenerate[{1,1}]` | the G-only grid | `MazeGenerate::small`, unevaluated |
| `Import["t.maze"]` | table `{{###},…}` | MAZE matrix |
| `FileFormat` | Table | MAZE |
| `Export["u.maze", …]` | `$Failed` | writes `#S\nG#` |

- The ragged message is also correct for a short line 3 and a long line 4. The before version said "Line 1" there
  too, so the old bug was wider than BUGS.md states: it always named the shortest line.
- `{1,2}`, `{2,1}` and `{4,5}` are unchanged (one S and one G each). `MazeWalkTime[{1,2}]` = 2 s.
- `.txt`, `.csv` and `.wl` are still Text, CSV and WL. After a reload there is exactly 1 MAZE entry.
- The documented limits hold: the undocumented `FileFormatDump` internals, and that the `.maze` extension works
  only after the paclet is loaded.

## I3: Bloch-sphere text (agree)

- `bloch.wls`: `T.T == S` True, `T^3 == S` False, `Y.|+> == -I|->` True. Bloch(Y|+>) = (-1,0,0), Bloch(T³|+>) =
  (-1/√2, 1/√2, 0).
- I ran the edited .md's own initialization block in a fresh kernel. It gave 7 gates (I, H, X, Y, Z, S, T) and
  these trajectories:
  - H,X,Z from |0>: (0,0,1) → (1,0,0) → (1,0,0) → (−1,0,0)
  - T,T,T: … → (0,1,0) → (−1/√2, 1/√2, 0)
  - Y: (1,0,0) → (−1,0,0)
- All four `blochDemo` calls return Manipulate.
- The code fences are identical between backup and live in both `.md` and `-out.md` (45 and 42 code lines). The
  extra wording changes (SubmissionNotes, Details) are disclosed and correct.

## I4: symbol-page Keywords (agree)

`scratch-K/i4` builds with the before and after converters (after = I1+I4, the deployed state) from identical
sources:

| Page | Result |
|---|---|
| MazeWalkTime | Keywords {} → {maze, walking time, shortest path, quantity, units}. Equal to before once the new closed Keywords group is dropped. |
| MazeWalkTime with its Keywords line removed | identical |
| Guide | identical (60 cells) |
| TechNote tutorial | identical |

In the full build, the built page's metadata `"keywords"` goes from {} to the 5 words. The fix is minimal: it is
the same `fillDocList` call the other builders make, and it is a no-op for an empty list.

## I5: category count (agree with notes)

- SKILL.md lists 35 unique names.
- `DataResourceDefinition.nb` (Wolfram 15.0, identical in WolframEngine) has 45 `CheckboxBox` entries. The first
  35 equal the SKILL list set-for-set, and the last 10 are the content types.
- **Note:** the patched sentence reads "exactly these 35 (from `resourceSortingProperties[]`…, and the same 35 as
  the … template)". The online registry was not consulted, so the "from" attribution now asserts a count for a
  source nobody checked. I5.md admits this, but SKILL.md does not.

## Rule deviations by this reviewer (disclosed)

- My first runs were wrapped only in the prescribed bwrap line, without the `~/.Wolfram` binds: the W5 repro and
  W5 suite at 09:26–09:28. They wrote to `~/.Wolfram`:
  - empty `Logs/AgentTools/Output/Wolfram_2026-10-22_09-27-*.log` files (5 of them);
  - an update to `ApplicationData/Wolfram/AgentTools/Servers/Wolfram/Log.wl` (09:27:46);
  - `Paclets/Configuration`, `Paclets/Temporary` and `ApplicationData/ProcessLink/Streams` (09:27:50–09:28:12).

  I left them in place.
- A probe meant to test the binds wrote `~/.Wolfram/Objects/kprobe.m` because `Objects` itself was not bound. I
  deleted that one file of mine right away, which left the directory's mtime changed.
- `~/.Wolfram/Autoload/PacletManager/Configuration/FrontEnd/init_15.0.0.0.m` and
  `SystemFiles/FrontEnd/StyleSheets/Wolfram` changed at 09:37 during my third docs build. Those paths were not
  bound. Other kernels were running at the same time, so this may or may not have been mine.
- No vendored file was written. No network, git, WLJS or windows were used.
