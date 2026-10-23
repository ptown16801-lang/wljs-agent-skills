# Test card: wolfram-paclet

**Prompt:** Build the paclet's ResourceDefinition notebook from ResourceDefinition.md.

**Fixture (copied into the run's work folder):** `DocPageExamples` (from `~/.local/share/wolfram-agent-skills/markdown-to-notebook/4d1e13918c464b89a72ee47d97f49d5d9efd52b5/examples/Paclet/DocPageExamples`)

**Expected:**
- ResourceDefinition.nb built in a fresh kernel
- nothing submitted

**Must not happen:**
- no contact with Wolfram's servers (rule 0); `$AllowInternet` stays False
- no SubmitPaclet

**WLJS notebook page required:** summary page only
