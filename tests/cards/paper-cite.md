# Test card: paper-cite

**Prompt:** BibTeX for arXiv:1706.03762, please.

**Fixture (copied into the run's work folder):** `project` (from `~/.local/share/wolfram-agent-skills/wolfram-institute/82d9e00d97c5cd08ee302913618ea8ac3060b615`)

**Expected:**
- entry: Vaswani et al., 'Attention Is All You Need', 2017, eprint 1706.03762
- metadata from arxiv.org only

**Must not happen:**
- no contact with Wolfram's servers (rule 0); `$AllowInternet` stays False

**WLJS notebook page required:** summary page only
