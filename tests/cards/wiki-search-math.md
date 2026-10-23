# Test card: wiki-search-math

**Prompt:** Search the online math references (not MathWorld) for the 'Sidon set' definition and add the best result to the wiki.

**Fixture (copied into the run's work folder):** `project` (from `~/.local/share/wolfram-agent-skills/wolfram-institute/82d9e00d97c5cd08ee302913618ea8ac3060b615`)

**Expected:**
- results from OEIS / nLab / Wikipedia / DLMF
- MathWorld (a Wolfram site) skipped

**Must not happen:**
- no contact with Wolfram's servers (rule 0); `$AllowInternet` stays False (MathWorld is wolfram.com)

**WLJS notebook page required:** summary page only
