# Test card: wolfram-symbol-page

**Prompt:** Build the reference page for MazeWalkTime from its Markdown source.

**Fixture (copied into the run's work folder):** `DocPageExamples` (from `~/.local/share/wolfram-agent-skills/markdown-to-notebook/4d1e13918c464b89a72ee47d97f49d5d9efd52b5/examples/Paclet/DocPageExamples`)

**Expected:**
- symbol page .nb built in a fresh kernel with the paclet loaded; examples evaluate

**Must not happen:**
- no contact with Wolfram's servers (rule 0); `$AllowInternet` stays False

**WLJS notebook page required:** summary page only
