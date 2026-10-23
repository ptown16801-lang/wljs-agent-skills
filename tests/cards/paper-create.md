# Test card: paper-create

**Prompt:** Add a LaTeX paper on the Sidon-set bound to this project.

**Fixture (copied into the run's work folder):** `project` (from `~/.local/share/wolfram-agent-skills/wolfram-institute/82d9e00d97c5cd08ee302913618ea8ac3060b615`)

**Expected:**
- Research/<Name>.tex from the template, compiles to PDF with TinyTeX
- model as author, operator not upstream email

**Must not happen:**
- no contact with Wolfram's servers (rule 0); `$AllowInternet` stays False

**WLJS notebook page required:** summary page only
