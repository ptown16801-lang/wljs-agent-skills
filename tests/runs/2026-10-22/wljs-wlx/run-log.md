# Run log: wljs-wlx (2026-10-22)

## 1. Skills used
1. `wljs-wlx`

## 2. Steps
1. Loaded the `wljs-wlx` skill. Read `ROUTES.md` and the pinned upstream WLJS guide `wlx.md` in full.
2. `mcp__wljs__kernel_evaluate` (WLJS kernel): `{$AllowInternet, Prime[Range[5]]}` returned `{False, {2, 3, 5, 7, 11}}`. This checked the offline setting and the expected values. No notebook was needed for it.
3. `mcp__wljs__new_notebook` created notebook `060` (WLJS temporary name `llm-f95.wln`, on the second monitor).
4. `mcp__wljs__add_cells_batch` added three cells:
   - `064`: a `.md` title and description.
   - `065`: the `.wlx` component cell. It defines `PrimeCard[Num_, Pos_]` (one card: a small "prime #k" label and the prime in large type) and `PrimeCardList[Len_]` (a flex row of `Table[PrimeCard[Prime[k], k], {k, Len}]`), and renders `<PrimeCardList>5</PrimeCardList>`.
   - `066`: `NotebookSave[...]`.
5. Edited line 7 of cell `065` before evaluating it, to rename the pattern variable `N_` to `Len_`. `N` is a System symbol.
6. `mcp__wljs__evaluate_cell` on `064` (Markdown), on `065` (WLX, WLJS kernel), and on `066` (save, WLJS kernel). These ran in the WLJS kernel because the user should see the result in a live notebook, as the skill requires.
7. `mcp__wljs__read_content` on output `070` showed the generated HTML: 5 cards labelled prime #1 to #5 with values 2, 3, 5, 7, 11.
8. Ran `tools/capture-wljs-windows.sh` into `scratch/cap` and looked at `0x1400061_llm-f95.wln.png`. Five rounded indigo cards (2, 3, 5, 7, 11) appear in one row under the WLX cell.
9. Ran `grep` on the saved `.wln`. It contains the component cell and the rendered output (prime #1 to #5).

No wolframscript or wolfram-direct runs. Nothing contacted the network.

## 3. Files
- Created `<repo>/tests/runs/2026-10-22/wljs-wlx/work/PrimeCards.wln`
- Created `<repo>/tests/runs/2026-10-22/wljs-wlx/scratch/cap/*.png` (window captures; the script captured every visible WLJS window, including other sessions' windows)
- Created this run log

## 4. WLJS notebook
`<repo>/tests/runs/2026-10-22/wljs-wlx/work/PrimeCards.wln` (still open in WLJS as `llm-f95.wln`)

## 5. Answer
The component is in a `.wlx` cell of `PrimeCards.wln`:

```
.wlx
PrimeCard[Num_, Pos_] := <div style="...card styles...">
  <div style="...small label...">prime #<Pos/></div>
  <div style="...large number...">  <Num/></div>
</div>;

PrimeCardList[Len_] := With[{Cards = Table[PrimeCard[Prime[k], k], {k, ToExpression[Len]}]},
  <div style="display: flex; flex-wrap: wrap; gap: 12px; padding: 8px 0;"><Cards/></div>
];

<PrimeCardList>5</PrimeCardList>
```

It renders five cards in a row: 2, 3, 5, 7, 11, each labelled "PRIME #k". `PrimeCard` is one card. `PrimeCardList` takes the count as its child, so `<PrimeCardList>10</PrimeCardList>` shows the first ten primes. Both can also be used from Markdown or slide cells.

## 6. Problems
- No errors or messages.
- `PrimeCard` and `PrimeCardList` are defined in the shared kernel's `Global` context. WLX needs this: a capitalized tag is a Global symbol. Pattern variables (`Num`, `Pos`, `Len`, `Cards`) are local to their definitions.
- The text child "5" reaches `PrimeCardList` as a string, so the code converts it with `ToExpression`.
- The capture script also wrote PNGs of other sessions' WLJS windows into my scratch folder. I only looked at my own (`llm-f95`).
