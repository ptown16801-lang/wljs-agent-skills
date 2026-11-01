# Showing WLJS results on a phone

Tested Oct 24, 2026 on an Android phone following a desktop Claude Code session through the Claude app.
Claude's inline HTML widgets do not render there (the phone shows their source code), so two other routes were
tested. Both keep the Wolfram kernel on the desktop and send nothing to Wolfram's servers.

| Route | What the phone shows | Files |
|---|---|---|
| Plot rasterized in WLJS, opened by Claude's Read tool | The picture inline in the chat; tap for full size | `wljs-plot.png`, `wljs-plot-square.png` |
| Values pre-computed in WLJS, built into a published Claude artifact | A working slider and plot in the Claude app's artifact viewer | `damped-wave-slider.html`, `artifact-samples.json` |

## Files

- `phone-display-test.wln`: the WLJS notebook. It draws the plot, rasterizes it (`Export[file, Rasterize[plot]]`,
  which needs the WLJS desktop app) and saves itself in its last cell.
- `wljs-plot.png` (699×371): the wide version. The phone's preview is a centre square crop, which cut off the
  y-axis and the legend; tapping opened the full image.
- `wljs-plot-square.png` (508×424): `AspectRatio -> 0.85` with the legend below. Its preview showed the curves, the
  x-axis and the legend.
- `artifact-samples.json`: `Sin[k x] Exp[-x/5]` for k = 1 to 5 in steps of 0.25 (17 frames, 121 points each),
  computed in the WLJS kernel.
- `damped-wave-slider.html`: a self-contained page with those values built in. It redraws from the stored data, so
  it cannot run new calculations. It opens in any browser.

The research behind the routes, and the routes that were ruled out, are summarised in `ROUTES.md` under
"Showing results vs. saving image files".
