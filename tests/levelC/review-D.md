# Level C review, reviewer D (Oct 22, 2026)

I reviewed 18 skills against their run folders, the session records (`tasks/<agent>.output`), the cards and the Level B verdicts.
I agree with 17 and disagree with 1. Every computed value I re-derived holds. Both papers' proofs are correct as written.

## Disagreements

| Skill | Check | Orchestrator | Mine | Evidence |
|---|---|---|---|---|
| wljs-javascript | correct | pass | partial | The run tells the user the dot "bounces off all four walls". It never reaches the top wall. I re-simulated the cell's exact update rule in node at 30, 60, 144 and 240 fps, at dt = 0.05 s and with jittered frames, for up to 1 h of simulated time. Every run had 0 top-wall hits, and the highest point was y = 22 to 43 px against contact at y = 12. The dot starts at rest at y = 22, and its energy does not grow. Nobody saw the canvas animate: the owner's screenshot shows only the input cell under the hash-mismatch dialog. The request ("a bouncing dot") is met, but the description given to the user is wrong. |

## Agreements, with what I checked myself

- **wolfram-language**: fresh kernel, Collatz[27] gives 112 terms, 111 steps, max 9232 at step 77.
- **wljs-markdown**: the table for n = 1..9 matches a fresh-kernel recomputation. Every formula in the cell renders with WLJS's own bundled KaTeX 0.16.10 (7/7).
- **wljs-mermaid**: WLJS's own Mermaid flowchart parser accepts the saved source: 6 nodes and 7 labelled edges, and the logic is correct.
- **wljs-html**: 7919 is substituted in the stored html output, and a fresh kernel gives Prime[1000] = 7919.
- **wljs-formatting**: the projected capture shows the table: primes 2..29, blue header with bold white text, stripes and dividers.
- **wljs-dynamics**: the capture shows the heading and the k slider. The plot and live updating were never seen.
- **wljs-async-programming**: the session record shows a separate evaluation answered 2.65 s into the run at "88%". `panel.wl` is byte-identical to the notebook cell, and the capture shows the bar at about 87% with "Pings: 1".
- **wljs-slides**: captures cap3 and cap4 show the plot changing from n = 27 to n = 97. The fresh kernel confirms 97 → 118 steps as the longest below 100, and that every peak below 100 is at most 9232. 2^68 ≈ 2.95e20.
- **wljs-special-cells** and **wljs-wlx**: the captures show the rendered output. The WLX output holds 1..5 → 2, 3, 5, 7, 11.
- **wljs-migration**: the original `.nb` is byte-identical to ExampleData. Its 8 tests, expected outputs and 4 option sets match the `.wln`. Running the 8 tests in a fresh kernel gives the notebook's outcomes (S, F, MF, S, F, S, F, F).
- **notebook-create**: 97 peaks at step 84, the merge is at 94 (step 6 / step 13), and 27 and 97 are both step records. The `.md` source matches the `.wln` cells.
- **document-revise**: v1 `.md` and `.nb` are byte-identical to the fixture. The v1/v2 diff contains only the two notes. In `_2.nb` only cell 7 changed, and cells 50, 51 and 52 are new and in the right places, with no `$Failed`. 0 of the 5985 five-subsets of Z_22 that contain 0 are Sidon.
- **project-tour**: 27 skills by area, 31 commands, 6 agents, 32 scripts. An independent Python recount gives 166 mentions with the same top six.
- **paper-create-note**: an independent Python search matches s(n), the counts of all Sidon sets and of largest sets, the first largest sets and all of Table 2. 0/462 and 0/12376 confirmed. The shipped `.wl` loads cleanly in a bare network-cut kernel. The `.tex` recompiles with 0 warnings to 6 pages. I read every proof, and none has a gap.
- **paper-create-notebook**: I read the new Thm:Parity line by line, and it is correct: D = Z_n∖{0, n/2}, 2eo = m − ε, (e − o)² = k − 2 + 2ε, with ε = 1 iff k ≡ 0, 1 (mod 4). The corollary (k ≡ 5 mod 8), Lem:Ruler and Prop:Small are also correct. Python confirms:
  - the failures in 2..40 are exactly {22, 32, 33, 34};
  - s(43) = 6;
  - Z_44 has no 7-set and Z_58 has no 8-set.
- **simulate-and-plot-modelica**: a fresh network-cut kernel reproduces every quoted figure, beyond what the orchestrator checked:
  - first peak 0.996 m at 17.7 s;
  - dip 0.067 m;
  - second peak 1.712 m at 165.55 s;
  - valve saturated 172–203 s;
  - tank empty 203–235 s;
  - final values 0.252 m and 0.450 m³/s.

## Notes for the owner

1. **Screenshots missing for the first six runs.** wolfram-language, wljs-markdown, wljs-mermaid, wljs-html, wljs-javascript and wljs-formatting ran before the capture tool was in the brief (their prompts do not mention it). Their notebooks were closed by the 03:51 restart and never appear in later captures, except formatting's. The card's "renders correctly (screenshot)" is unmet for markdown, mermaid, html and javascript. My parser checks (KaTeX, Mermaid) are a substitute, not a rendering check. A re-capture after reopening the saved `.wln` files would close this.
2. **Shared-kernel leftovers.** These were all disclosed and are needed by the deliverables:
   - wljs-slides and wljs-wlx leave Global definitions;
   - wolfram-language's requested `Get` leaves `Collatz`` on `$ContextPath`;
   - several runs left projected windows open.

   I did not count these against "rules".
3. **Saved files without rendered output.** `CollatzMarkdown.wln` stores only the input cell, and `CollatzSlides.wln` has no deck output. Both show their source until re-evaluated.
4. **Git identities differ.** document-revise committed with the user's global git identity, and paper-create-note used a one-off identity.

Evidence and scripts are in `tests/levelC/scratch-D/`:

| What | Script | Output |
|---|---|---|
| Collatz, primes, migration | `check1.wls` | `check1.out` |
| `.wl` and `_2.nb` | `check2.wls`, `check3.wls` | `check2.out` |
| Sidon search | `sidon.py` | `sidon.out` |
| TankPID simulation | `tank.wls` | `tank.out` |
| Bouncing dot | `bounce*.cjs` | `bounce.out` |
| KaTeX parsing | `katex.mjs` | `katex.out` |
| Mermaid parsing | `mm/t2.mjs` (needs a copy of the WLJS mermaid bundle with DOMPurify stubbed) | |
| Session-record scans | `rules.py`, `globals.py`, `dump.py` | |
