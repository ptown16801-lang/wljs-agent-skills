# Run log: paper-cite, arXiv:1706.03762 (2026-10-22)

## 1. Skills used

1. `paper-cite` (local WLJS adaptation, `~/.claude/skills/paper-cite/SKILL.md`)

## 2. Steps

1. Loaded `paper-cite`. Read `<repo>/ROUTES.md` and the pinned upstream skill `~/.local/share/wolfram-agent-skills/wolfram-institute/82d9e00d97c5cd08ee302913618ea8ac3060b615/skills/paper-cite/SKILL.md`.
2. Read the script the upstream skill wraps, `work/project/scripts/cite_from_id.wls`, before deciding how to run it. It fetches `https://export.arxiv.org/api/query?id_list=<id>` from inside a Wolfram kernel using `Import`. It has no install, publish or download step.
3. Decided not to run the script as written. Fetching from inside a Wolfram kernel would need `$AllowInternet = True`, and the standing rule is to keep `$AllowInternet = False` in every kernel. arXiv is not a Wolfram server, and the skill adaptation says the online metadata lookup is fine when the owner asked for the citation, which they did. So I split the work in two:
   - **Fetch (no Wolfram kernel):** `curl` got the arXiv Atom API response for `id_list=1706.03762` (HTTP 200, 2965 bytes). It was saved to the session scratchpad as `arxiv_1706.03762.xml`. This was the only network contact: export.arxiv.org, no Wolfram host.
   - **Format (Wolfram evaluation):** **engine: wolfram-direct** (`~/.local/bin/wolfram-direct`, tool `WolframLanguageEvaluator`, a fresh kernel with networking blocked by bwrap `--unshare-net`). It ran the script's own `arxivBibtex` logic unchanged (same XML patterns, key rule, field order and 1000-character abstract cap) on the local XML file, inside `Block[{$AllowInternet = False}, ...]`. The output confirmed `$AllowInternet` was `False`. Why this engine: the job needed a clean kernel that is guaranteed offline, and it did not need the shared WLJS kernel's state. The run record is kept at `~/.local/state/wolfram-agenttools-direct/runs/run-icuta75b`.
4. Step 3 of the skill (where the entry goes): `Research/` holds only `Artifacts/`, with no `references.bib` and no paper. There is no `Journal/` folder and no `references.bib` anywhere in the project. Per the skill, the entry is therefore given on stdout only and nothing is appended. A `Wiki/Resources/` article (wiki-add-resource) was not asked for.
5. No WLJS kernel was used. The `mcp__wljs__*` tools and `wljs eval` were not called.

## 3. Files

- Created: `<repo>/tests/runs/2026-10-22/paper-cite/run-log.md` (this file).
- Scratch only, outside the project: `<scratch>/{arxiv_1706.03762.xml, cite.wl, req.json}`.
- Nothing in `work/project` was changed. `git status` there is clean.

## 4. WLJS notebook

none. The result is a single BibTeX entry given on stdout, not files. The skill's "stdout only" case applies, so no summary notebook page was made.

## 5. Answer

I fetched the metadata from arXiv's export API. This is an online lookup, made because you asked for the citation. The entry was then built offline with the skill's own formatting logic:

```bibtex
@article{Vaswani2017,
  author        = {Ashish Vaswani and Noam Shazeer and Niki Parmar and Jakob Uszkoreit and Llion Jones and Aidan N. Gomez and Lukasz Kaiser and Illia Polosukhin},
  title         = {Attention Is All You Need},
  year          = {2017},
  eprint        = {1706.03762},
  archivePrefix = {arXiv},
  url           = {https://arxiv.org/abs/1706.03762},
  abstract      = {The dominant sequence transduction models are based on complex recurrent or convolutional neural networks in an encoder-decoder configuration. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable and requiring significantly less time to train. Our model achieves 28.4 BLEU on the WMT 2014 English-to-German translation task, improving over the existing best results, including ensembles by over 2 BLEU. On the WMT 2014 English-to-French translation task, our model establishes a new single-model state-of-the-art BLEU score of 41.8 after training for 3.5 days on eight GPUs, a small fraction of the training costs of the best models from the literature. We show that the Transforme},
}
```

Notes:
- The abstract is cut off mid-word ("Transforme") because the skill caps it at 1000 characters. You may want to drop the `abstract` field or finish the sentence.
- The arXiv record is version v7 (updated 2023-08-02), first submitted 2017-06-12. Its categories are cs.CL and cs.LG.
- `@article` has no `journal`, so biber/BibTeX may warn about it. `@misc` (or biblatex `@online`) avoids the warning. You could also cite the NeurIPS 2017 proceedings version instead.
- The project has no `Research/references.bib` or `Journal/references.bib`, so nothing was written to a file. Tell me where to append it if you want it saved.

## 6. Problems

- The upstream script was not run as written, because it fetches from inside a Wolfram kernel, which would break the `$AllowInternet = False` rule. Its logic was reproduced exactly in an offline kernel instead. Because of this, the script's own `% arXiv fetch failed` path was not exercised.
- The upstream skill's license-seat check (`$MaxLicenseProcesses - $LicenseProcesses`) was not run. The skill asks for it before spawning `wolframscript`, and `wolframscript` was not used. wolfram-direct started one fresh kernel, which ran without a license error.
- The 1000-character abstract cap cuts a word in half. This is upstream behaviour and was left as is.
- No warnings or messages came back from the kernel run.
