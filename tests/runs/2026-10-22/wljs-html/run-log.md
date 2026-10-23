# Run log: wljs-html (2026-10-22)

## 1. Skills used
- wljs-html

## 2. Steps
1. Loaded the `wljs-html` skill. Read `ROUTES.md` and the pinned upstream guide `.../wljs-api/mcp/dist/skills/html.md`.
2. Checked the kernel and the reference value with `mcp__wljs__kernel_evaluate` (WLJS kernel; this was a quick check the user does not need to see): `{$AllowInternet, Prime[1000], PrimeQ[Prime[1000]]}` returned `{False, 7919, True}`.
3. Created a WLJS notebook with `mcp__wljs__new_notebook` (id `011`). Added two cells with `mcp__wljs__add_cells_batch`:
   - a `.md` cell with a heading and one line of explanation (cell `017`);
   - a `.html` cell (cell `018`): a styled card (blue gradient, large number) whose number comes from `<?wsp Prime[1000] ?>` and a footer line from `<?wsp ToString[PrimeQ[Prime[1000]]] ?>`.
4. Evaluated both cells with `mcp__wljs__evaluate_cell` (WLJS kernel; the result belongs in the visible notebook). The `.md` output is `020` (markdown). The `.html` output is `021` (html). Read `021` back with `mcp__wljs__read_content`: the WSP templates were filled in with `7919` and `True`.
5. Saved the notebook by adding and evaluating a cell `NotebookSave[EvaluationNotebook[], ".../work/PrimeCard.wln"]` (WLJS kernel, cell `023`). It returned `RemoteNotebook["8596bbcd-..."]`. The file exists (2781 bytes) and contains the HTML source and the rendered output with 7919.
6. Tried to see the rendering with `tools/capture-wljs-windows.sh` (3 attempts) and once with a direct `xwd`. Every attempt failed with an X error (see Problems), so no PNG was produced. I did not project the cell into its own window: the capture would fail in the same way, and the projected window would stay open.

No `wolframscript` / `wolfram-direct` / `wsm-toolkit` runs. Nothing contacted the network.

## 3. Files
- Created: `<repo>/tests/runs/2026-10-22/wljs-html/work/PrimeCard.wln`
- Created: `<repo>/tests/runs/2026-10-22/wljs-html/scratch/cap/` (empty folder, made by the capture script)
- Created and then deleted: `scratch/root.xwd` (empty file from the failed root capture)
- Created: this run log

## 4. WLJS notebook
`<repo>/tests/runs/2026-10-22/wljs-html/work/PrimeCard.wln` (left open in the WLJS app on the second monitor)

## 5. Answer
The new WLJS notebook on your second monitor, saved as `work/PrimeCard.wln`, has an HTML cell that draws a card titled "The 1000th prime". The number on the card is not typed in: Wolfram computes it when the cell is evaluated, through the template `<?wsp Prime[1000] ?>`. The card shows **7919**, with a footer "Prime[1000] · PrimeQ: True". Here is the cell:

```html
.html
<div style="max-width:320px;margin:12px auto;padding:20px 24px;border-radius:14px;background:linear-gradient(135deg,#1e3a8a,#4f46e5);color:#fff;font-family:system-ui,sans-serif;box-shadow:0 6px 18px rgba(0,0,0,0.25);text-align:center">
  <div style="font-size:13px;letter-spacing:0.12em;text-transform:uppercase;opacity:0.8">The 1000th prime</div>
  <div style="font-size:56px;font-weight:700;margin:8px 0"><?wsp Prime[1000] ?></div>
  <div style="font-size:13px;opacity:0.85">Prime[1000] &middot; PrimeQ: <?wsp ToString[PrimeQ[Prime[1000]]] ?></div>
</div>
```

I read the cell's output back and it contains 7919. I could not take a screenshot of the window, so I have not seen how the card looks on screen.

## 6. Problems
- Window capture failed. `capture-wljs-windows.sh` produced no PNG in 3 runs. Running `xwd -id <window>` directly fails with `BadColor (invalid Colormap parameter)`, X_QueryColors, resource id 0x0. Running `xwd -root` fails with `BadMatch`, X_GetImage. So I checked the output only as text (the filled-in HTML), not as rendered pixels.
- Several WLJS notebook windows were open with temporary names (`llm-*.wln`, two "Application" windows), probably from other sessions. I could not tell which one is mine without a capture. I closed none of them.
- No other messages or warnings. `$AllowInternet` was `False` in the WLJS kernel.
