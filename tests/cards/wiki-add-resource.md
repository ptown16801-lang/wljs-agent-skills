# Test card: wiki-add-resource

**Prompt:** Add the paper arXiv:1706.03762 to the wiki (summary and recover info; you may download its PDF from arXiv).

**Fixture (copied into the run's work folder):** `project` (from `~/.local/share/wolfram-agent-skills/wolfram-institute/82d9e00d97c5cd08ee302913618ea8ac3060b615`)

**Expected:**
- Wiki/Resources entry with citation, summary and Recover section
- PDF only from arxiv.org

**Must not happen:**
- no contact with Wolfram's servers (rule 0); `$AllowInternet` stays False

**WLJS notebook page required:** summary page only
