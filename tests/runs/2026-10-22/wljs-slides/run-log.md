# Run log: wljs-slides (2026-10-22)

Request: "Make a 3-slide presentation about the Collatz conjecture with a live plot on slide 2."

## 1. Skills used

1. `wljs-slides`
2. `wljs-dynamics`

(Read for them: `ROUTES.md`, WLJS guides `slides.md` and `dynamics.md`. I also read the WLJS source `modules/wljs-revealjs/src/Frontend.wl` to see how `.slides` merges cells.)

## 2. Steps

All Wolfram evaluations ran in the **WLJS kernel through `mcp__wljs__*`**. Slides and live dynamics only work there, and the user should see the result in a WLJS notebook. No `wolframscript`, `wolfram-direct` or `wsm-toolkit` was used.

1. `kernel_evaluate`: checked `$AllowInternet` (False), `$VersionNumber` (15.) and the `InputRange` usage. WLJS kernel, so I could check the environment without a notebook.
2. `kernel_evaluate`: checked the numbers quoted on slide 2 (n = 27: 111 steps, peak 9232; below 100 the longest is n = 97 with 118 steps; every peak below 100 is at most 9232, so a log10 y-range of 0 to 4.6 and an x-range of 0 to 120 hold every orbit). WLJS kernel, in a `Module` with no globals.
3. `new_notebook` gave notebook `020` (window `llm-f44.wln`). `add_cells_batch` added these cells:
   - a Wolfram cell that defines `CollatzSlidesSeq` and `CollatzSlidesUpdate`, plus `CollatzSlider` (`EventHandler[InputRange[1,100,1,27], CollatzSlidesUpdate]`) and `CollatzPlot` (`Graphics` with `Line[CollatzSlidesPts // Offload]` and `Text[CollatzSlidesLabel // Offload]`, fixed PlotRange)
   - `.slide` 1: the rule (KaTeX `cases`) and the conjecture
   - `.slide` 2: `<CollatzSlider/>` and `<CollatzPlot/>` in a flex column
   - a `.md` note
   - `.slides`: merges the two slide cells and adds its own text as slide 3
   - a `NotebookSave` cell

   Every cell was evaluated with `evaluate_cell`, including the `.md` cell. All of this ran in the WLJS kernel.
4. My first `.slides` cell held only the line `.slides`, and evaluating it returned nothing. The WLJS source only matches `".slides\n"~~___`, and it joins the `.slide` cells and the `.slides` cell's own text with `---`. An empty `.slides` cell would therefore add a blank 4th slide. So the `.slides` cell now carries slide 3 itself, and the former slide-3 cell became the `.md` note. Evaluating `.slides` removes the separate slide outputs and leaves one 3-slide deck. I read the merged output with `read_content` and confirmed 3 sections separated by `---`. I also added a blank line before each `---` so the line above it is not read as a setext heading.
5. I opened a second small notebook `035` (window `llm-4ab.wln`) to check each slide visually, because the window capture shows only the top of a notebook. I evaluated one `.slide` cell at a time in it and captured with `tools/capture-wljs-windows.sh`:
   - Slide 1: KaTeX renders correctly, including the `cases` block. Backslashes are doubled as the guide says.
   - Slide 2: the plot and the slider render. A flex-column wrapper puts the slider centered above the plot; without it the slider sat on the left.
   - **Live update test:** `kernel_evaluate` `CollatzSlidesUpdate[97]`. Without re-evaluating anything, the captured plot changed to the n = 97 orbit (118 steps) and its label to "n = 97 | steps to reach 1: 118 | peak: 9232". So the Offload push works inside a slide. Re-evaluating the definitions cell then reset it to n = 27.
   - Slide 3: with Markdown list items plus `<!-- .element: class="fragment" -->`, the fragment class landed on the wrong element: the bold "no proof" was hidden and the last bullet showed without it. I switched to an HTML `<ul>` with `<li class="fragment fade-up">`. After that the slide shows the title with all 4 bullets hidden until advanced, which is normal Reveal behaviour.
6. I removed a `Point[... // Offload]` layer that did not show and added `AbsoluteThickness[2]` to the line. Then I re-evaluated the definitions cell, slides 1–2, the `.md` note and `.slides` in notebook 020 (WLJS kernel).
7. Saved by evaluating `NotebookSave[EvaluationNotebook[], ".../work/CollatzSlides.wln"]` in notebook 020 (WLJS kernel). The file is there (12,289 bytes, 156 lines) and contains the `.slide`/`.slides` cells. A capture after saving showed no error dialog.

## 3. Files

- Created: `<repo>/tests/runs/2026-10-22/wljs-slides/work/CollatzSlides.wln`
- Created: `<repo>/tests/runs/2026-10-22/wljs-slides/run-log.md` (this file)
- Created (scratch, window captures): `<repo>/tests/runs/2026-10-22/wljs-slides/scratch/cap*/` (PNG)

## 4. WLJS notebook

`<repo>/tests/runs/2026-10-22/wljs-slides/work/CollatzSlides.wln` (open as window `llm-f44.wln`, notebook id 020).

The check notebook (id 035, window `llm-4ab.wln`) was not saved and is still open. It holds only a copy of slide 3.

## 5. Answer

I made a 3-slide Collatz presentation and saved it as `work/CollatzSlides.wln`. It is open in WLJS on your second monitor.

- **Slide 1, The Collatz conjecture:** the n/2 or 3n+1 rule, the conjecture (Collatz, 1937) and the example 6 → … → 1.
- **Slide 2, A live trajectory:** a slider for the starting value n (1–100) and a plot of its orbit on a log scale. The plot redraws while you drag, and a label shows n, the number of steps and the peak. A note gives n = 27 (111 steps, peak 9232) and n = 97 (118 steps, the longest below 100).
- **Slide 3, Where things stand:** the computer check below 2^68 (Barina, 2020), Terras 1976, Tao 2019, and the fact that it is still unproven. The 4 points appear one at a time.

**To present:**
1. Evaluate the first (definitions) cell, so slide 2 has its data after you reopen the file.
2. Evaluate the `.slides` cell.
3. Use the deck it produces; the arrow keys step through the slides and the bullets.

## 6. Problems

- An empty `.slides` cell (just `.slides`) gives no output; it needs a newline and content. Working around this changed the layout from "three `.slide` cells plus `.slides`" to "two `.slide` cells plus a `.slides` cell that holds slide 3" (step 4).
- Markdown `<!-- .element: class="fragment" -->` after list items attached the fragment to the wrong element when the item held inline markup. I replaced it with an HTML list (step 5). As a result, slide 3 writes its math in plain HTML (2<sup>68</sup> ≈ 2.95 × 10<sup>20</sup>) instead of KaTeX.
- **Not verified visually:**
  - the merged `.slides` deck as a whole: it sits below the captured area, so I checked it only through `read_content` and through each slide rendered on its own;
  - the fragments revealing one by one: I cannot press keys in the deck;
  - dragging the slider by hand: liveness was shown by pushing a new value from the kernel; the slider calls the same `CollatzSlidesUpdate` function.
- The plot's symbols (`CollatzSlider`, `CollatzPlot`, `CollatzSlidesPts`, `CollatzSlidesLabel`, `CollatzSlidesSeq`, `CollatzSlidesUpdate`) are in the shared kernel's `Global` context. WLX slide tags need plain symbol names. I gave them distinctive names to avoid clashes with other sessions and did not `Remove` them, because the live slide needs them.
- Facts on slide 3 come from memory, not from a lookup (no web access was used): Barina 2020 (2^68), Terras 1976, Tao 2019. "Pushed further since" is deliberately vague; I believe newer work reached about 2^71 but did not confirm it.
- After saving, the window title is still WLJS's temporary name `llm-f44.wln`, and the save icon is drawn in red. The file on disk is complete.
- The check notebook `llm-4ab.wln` is still open. I have no tool to close windows, and the rules say not to close windows.
