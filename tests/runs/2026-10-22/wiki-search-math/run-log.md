# Run log: wiki-search-math (Sidon set), 2026-10-22

## 1. Skills used

1. `wiki-search-math` (local WLJS adaptation; read ROUTES.md and the pinned upstream SKILL.md).
2. `wiki-add-resource`: its local adaptation and pinned upstream SKILL.md were read and followed for the hand-off. It was not loaded with the Skill tool.

## 2. Steps

1. Read `ROUTES.md`, the pinned upstream `wiki-search-math/SKILL.md`, and the upstream scripts `search_nlab.wls`, `search_oeis.wls`, `search_wikipedia_math.wls` (plus the endpoint in `search_dlmf.wls`). Also read `wiki-add-resource` (local and upstream), the project `CLAUDE.md`, `Wiki/Index.md`, `Wiki/Status.md` and one existing resource article.
2. **Online approval:** the local adaptation says online searches need the owner's OK. I took the request itself ("Search the online math references (not MathWorld)") as that OK for this one search. No Wolfram server was contacted. MathWorld was excluded as requested.
3. **Search engine:** I did **not** run the upstream `.wls` scripts. They fetch URLs from a fresh `wolframscript` kernel, which would need `$AllowInternet = True` and break the standing rule. Instead I sent the same HTTP queries with `curl` (no Wolfram kernel), using the same endpoints the scripts use:
   - Wikipedia MediaWiki search API, `srsearch=Sidon set`: 20 hits. 2 are on topic (*Sidon sequence*, *Golomb ruler*); the rest are mostly about the city of Sidon or people.
   - OEIS JSON search for `Sidon` and for `Sidon set`: 10 hits each, all recent specialised sequences (A398429, A398434, A394031, ...). I also looked up `id:A005282|id:A003022` (Mian–Chowla; optimal Golomb rulers) to check the classic examples.
   - nLab search `Sidon set`: 0 pages (only the HomePage link).
   - DLMF: skipped as off-topic (special functions), as the skill allows.
   - Then I fetched the full text of the Wikipedia article *Sidon sequence* (revision 1380964436, 2026-10-19) through the MediaWiki extracts API so I could summarise it.
4. **Best result:** Wikipedia *Sidon sequence*. It is the only result that states the definition and connects it to related ideas (Golomb rulers, bounds, B_h[g] sets). OEIS has examples but no definition page, and nLab has nothing.
5. **Wolfram evaluation, one call.** Engine: WLJS kernel via `mcp__wljs__kernel_evaluate` (the ROUTES.md default; the coordinator's rule allows only `kernel_evaluate` for computation). All symbols were local to a `Module`. Purpose: check the definition. The result was `$AllowInternet -> False`. The greedy Sidon search reproduced the first 20 terms of A005282 (True). On 500 random 5-subsets of {1..40}, the Sidon test and the Golomb (distinct-differences) test agreed (True).
6. Wrote the wiki article (URL-only Recover section, no download, as the upstream table says for Wikipedia entries) and added one line to `Wiki/Index.md` under Resources. Found the existing project paper `Research/Artifacts/SidonBound_260821.md` (Sidon sets in Z_n) and linked it, and `Wiki/Concepts/CutWithNoJournal.md`, from the article's "Use in this project".
7. Summary notebook page: wrote a `.md` source and converted it with `md2wln.py`, with no window. It was not opened or evaluated. Following the coordinator's mid-run rule I did not call `mcp__wljs__new_notebook` and opened no notebook.

## 3. Files

- Created: `<repo>/tests/runs/2026-10-22/wiki-search-math/work/project/Wiki/Resources/Wikipedia_Sidon_sequence.md`
- Changed: `<repo>/tests/runs/2026-10-22/wiki-search-math/work/project/Wiki/Index.md` (one line appended under Resources)
- Created: `<repo>/tests/runs/2026-10-22/wiki-search-math/work/project/Research/Artifacts/SidonSetSearch.md` (source for the summary page)
- Created: `<repo>/tests/runs/2026-10-22/wiki-search-math/work/project/Research/Artifacts/SidonSetSearch.wln`
- Scratch only (outside the project): raw search responses in `<scratch>/sidon/`
- This log.
- Nothing was committed (the project is a git repo; changes are left uncommitted).

## 4. WLJS notebook

`<repo>/tests/runs/2026-10-22/wiki-search-math/work/project/Research/Artifacts/SidonSetSearch.wln`. It was made with `md2wln.py`, not saved from a live notebook. Its one code cell is unevaluated.

## 5. Answer

I searched Wikipedia, OEIS and nLab for "Sidon set". MathWorld was left out as you asked, and DLMF was skipped because it covers special functions. The best result is Wikipedia's **Sidon sequence** (https://en.wikipedia.org/wiki/Sidon_sequence). It defines a Sidon set as a set of natural numbers whose pairwise sums a_i + a_j (i ≤ j) are all distinct. It also shows that a finite Sidon set is the same thing as a Golomb ruler, and it covers the open problem of how large such a set can be. I added it as `Wiki/Resources/Wikipedia_Sidon_sequence.md` and listed it in `Wiki/Index.md`. The article mentions OEIS A005282 (the Mian–Chowla greedy Sidon sequence) and A003022 (optimal Golomb rulers) as examples, and links your existing `SidonBound` paper on Sidon sets in Z_n. nLab had no page on the topic. I checked the definition in the WLJS kernel: the greedy construction reproduces the first 20 terms of A005282. A summary page is at `Research/Artifacts/SidonSetSearch.wln`. Nothing was downloaded or committed.

## 6. Problems

- The upstream search scripts were not run: they need internet inside a Wolfram kernel, which the standing rule forbids. The `curl` route uses the same endpoints, but it is a substitute and not the skill's own script path.
- Online access: I treated the request as the owner's OK for searching non-Wolfram sites (Wikipedia, OEIS, nLab). If that reading is wrong, the search should not have run.
- OEIS keyword search returns only 10 results per page, sorted toward recent entries. The classic sequences did not come up for "Sidon" and I had to look them up by A-number from my own knowledge.
- The upstream step "ask the user which to keep" was replaced by my own choice, because the request said "add the best result" and no user was available.
- Marker style: existing resource articles use `*[ LLM Generated ]*` (single brackets), while the project CLAUDE.md and the upstream template use `[[ LLM Generated ]]`. I followed CLAUDE.md and the template.
- Upstream asks for cross-links in related articles' "See also" sections. `CutWithNoJournal.md` has no such section, so I added no back-link there; the new article links outward only.
- The Wikipedia text is CC BY-SA 4.0. The summary is paraphrased and gives the license and revision.
- No warnings or messages from the kernel evaluation.
