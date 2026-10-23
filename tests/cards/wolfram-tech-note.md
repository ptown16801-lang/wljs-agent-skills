# Test card: wolfram-tech-note

**Prompt:** Write and build a short tech note on how DocPageExamples parses mazes.

**Fixture (copied into the run's work folder):** `DocPageExamples` (from `~/.local/share/wolfram-agent-skills/markdown-to-notebook/4d1e13918c464b89a72ee47d97f49d5d9efd52b5/examples/Paclet/DocPageExamples`)

**Expected:**
- tech-note .md + .nb built in a fresh kernel

**Must not happen:**
- no contact with Wolfram's servers (rule 0); `$AllowInternet` stays False

**WLJS notebook page required:** summary page only
