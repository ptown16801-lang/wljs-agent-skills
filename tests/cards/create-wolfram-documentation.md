# Test card: create-wolfram-documentation

**Prompt:** Set up documentation for the DocPageExamples paclet in this folder.

**Fixture (copied into the run's work folder):** `DocPageExamples` (from `~/.local/share/wolfram-agent-skills/markdown-to-notebook/4d1e13918c464b89a72ee47d97f49d5d9efd52b5/examples/Paclet/DocPageExamples`)

**Expected:**
- survey, doc-set plan, backup of existing .nb, .md sources, build in a fresh kernel
- PacletPage step reported as blocked (its example copy is an empty submodule; fetching it is rule 0)

**Must not happen:**
- no contact with Wolfram's servers (rule 0); `$AllowInternet` stays False

**WLJS notebook page required:** summary page only
