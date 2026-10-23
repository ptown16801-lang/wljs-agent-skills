# Run log: wljs-html (2026-10-22)

## 1. Skills used
1. wljs-html

## 2. Steps
1. Loaded the `wljs-html` skill. Read `<repo>/ROUTES.md` and the upstream guide `~/.local/opt/wljs/app/resources/app/modules/wljs-api/mcp/dist/skills/html.md` (`.html` first line; `<?wsp ... ?>` embeds a Wolfram expression; output only fragment content, no `<html>/<body>`).
2. `mcp__wljs__kernel_evaluate` (WLJS kernel): `{$AllowInternet, Prime[1000]}` returned `{False, 7919}`. Why: confirm internet is off in the shared kernel and check the value before building the cell; nothing for the user to see.
3. `mcp__wljs__new_notebook` made notebook `017` (WLJS desktop app window, the second monitor).
4. `mcp__wljs__add_cells_batch` added three input cells: a `.md` title/explanation cell (019), the `.html` card cell (020), and a `NotebookSave[...]` Wolfram cell (021).
5. `mcp__wljs__evaluate_cell` on 019 (WLJS kernel; renders the Markdown) gave a markdown output cell (024).
6. `mcp__wljs__evaluate_cell` on 020 (WLJS kernel; the WSP templates `<?wsp Prime[1000] ?>` and `<?wsp ToString[PrimeQ[Prime[1000]]] ?>` are evaluated by the kernel) gave an html output cell (025). `read_content` on 025 showed the rendered HTML with `7919` and `PrimeQ check: True` in place of the templates.
7. `mcp__wljs__evaluate_cell` on 021 (WLJS kernel) ran `NotebookSave[EvaluationNotebook[], ".../work/Prime1000Card.wln"]`, which returned `RemoteNotebook["ed9db259-..."]`. Checked on disk: the file exists (3115 bytes) and holds the WSP source and the 7919 output.

No `wolframscript`, `wolfram-direct` or `wsm-toolkit` was used, and nothing contacted Wolfram's servers.

## 3. Files
- Created: `<repo>/tests/runs/2026-10-22/wljs-html/work/Prime1000Card.wln`
- Created: `<repo>/tests/runs/2026-10-22/wljs-html/run-log.md` (this file)

## 4. WLJS notebook
`<repo>/tests/runs/2026-10-22/wljs-html/work/Prime1000Card.wln` (open in the WLJS app as notebook 017)

## 5. Answer
I added an HTML cell to a new WLJS notebook (open on your second monitor, saved as `work/Prime1000Card.wln`). It shows a blue gradient card titled "The 1000th prime" with **7919** in large type. The number isn't typed into the HTML: the kernel computes it from the WSP template `<?wsp Prime[1000] ?>` each time the cell is evaluated. The card also shows `PrimeQ` of the value (True). Cell source:

```html
.html
<div style="max-width:320px;margin:12px auto;padding:20px 24px;border-radius:14px;background:linear-gradient(135deg,#1f3b73,#3a6fd8);color:#fff;font-family:system-ui,sans-serif;box-shadow:0 6px 18px rgba(0,0,0,0.25);text-align:center">
  <div style="font-size:13px;letter-spacing:0.12em;text-transform:uppercase;opacity:0.8">The 1000th prime</div>
  <div style="font-size:56px;font-weight:700;margin:8px 0"><?wsp Prime[1000] ?></div>
  <div style="font-size:13px;opacity:0.85">Computed by Wolfram: <code style="background:rgba(255,255,255,0.15);padding:1px 6px;border-radius:4px">Prime[1000]</code></div>
  <div style="font-size:12px;opacity:0.7;margin-top:6px">PrimeQ check: <?wsp ToString[PrimeQ[Prime[1000]]] ?></div>
</div>
```

## 6. Problems
- No visual check: I took no screenshot of the rendered card, because the run rules say not to open browsers and the skill's check uses the browser pane (`wljs nb url`). The rendered output was checked as HTML text only (`read_content` on the output cell shows 7919 substituted).
- According to ROUTES.md, WLJS may show a "File hash mismatch: File was changed outside" dialog a few seconds after `NotebookSave`. I did not see it (no screenshot). If it appears, Cancel keeps what is on screen.
- The notebook was left open (I opened it; I closed nothing).
