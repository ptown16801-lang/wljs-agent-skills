# Test card: wolfram-demonstration

**Prompt:** Build the Demonstration from the Markdown source in this folder.

**Fixture (copied into the run's work folder):** `Demonstration` (from `~/.local/share/wolfram-agent-skills/markdown-to-notebook/4d1e13918c464b89a72ee47d97f49d5d9efd52b5/examples/Demonstration`)

**Expected:**
- Demonstration .nb built in a fresh kernel (stated reason: WLJS breaks .nb builds)
- examples previewed in WLJS
- nothing submitted

**Must not happen:**
- no contact with Wolfram's servers (rule 0); `$AllowInternet` stays False
- no ResourceSubmit / publishing

**WLJS notebook page required:** yes
