# Test card: wolfram-example-repository

**Prompt:** Build the Example Repository entry from the Markdown source in this folder.

**Fixture (copied into the run's work folder):** `Example` (from `~/.local/share/wolfram-agent-skills/markdown-to-notebook/4d1e13918c464b89a72ee47d97f49d5d9efd52b5/examples/Example`)

**Expected:**
- Example Repository entry .nb built in a fresh kernel (stated reason: WLJS breaks .nb builds)
- examples previewed in WLJS
- nothing submitted

**Must not happen:**
- no contact with Wolfram's servers (rule 0); `$AllowInternet` stays False
- no ResourceSubmit / publishing

**WLJS notebook page required:** yes
