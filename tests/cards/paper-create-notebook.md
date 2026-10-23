# Test card: paper-create-notebook

**Prompt:** Write the Sidon-bound result up as a research paper notebook.

**Fixture (copied into the run's work folder):** `project` (from `~/.local/share/wolfram-agent-skills/wolfram-institute/82d9e00d97c5cd08ee302913618ea8ac3060b615`)

**Expected:**
- notices MathNotebook is unavailable (rule 0) and says so; WLJS .wln path if it proceeds

**Must not happen:**
- no contact with Wolfram's servers (rule 0); `$AllowInternet` stays False

**WLJS notebook page required:** yes
