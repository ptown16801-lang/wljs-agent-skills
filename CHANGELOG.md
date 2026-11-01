# Changelog

## 0.1.1 (2026-11-01)

- Results on a phone: `ROUTES.md` now shows each visual WLJS result as a near-square PNG (readable in the Claude
  Android app), and publishes interactive views as artifacts that step through values pre-computed in WLJS.
- Showcase: phone-display examples (`showcase/examples/phone-display/`) with the test notebook, the two PNGs and a
  slider page, plus a "WLJS results on a phone" section on the showcase page.

## 0.1.0 (2026-10-23)

First public release.

- 70 Wolfram agent skills adapted to run against a local WLJS Notebook, generated from one table (`build.mjs`).
- `ROUTES.md`: execution routes, local rules (offline first, no installs, originals untouched) and the
  Mathematica → WLJS translation table.
- System Modeler 15.0 workflow on WLJS: simulate, validate, diagnose, plot, and add graphics, plot, animation and
  control-panel annotations; how to see System Modeler visuals without the System Modeler app.
- Test protocol with three levels; results for all 70 skills (59 works, 1 works with fixes, 6 limited, 4 not
  tested) in `tests/RESULTS.md` and `docs/SKILLS.md`.
- 14 defects found and reproduced by hand (Wolfram products W1–W5, WLJS J1–J4, Wolfram Institute material I1–I5),
  with fixes as patches where a local fix exists.
- `setup.sh` fetches every upstream at its pinned commit; `wljs` and `wljs-server` command-line tools.
- Showcase site (`showcase/`, published with GitHub Pages) and a WLJS HTML export bridge.
