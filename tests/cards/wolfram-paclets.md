# Test card: wolfram-paclets

**Prompt:** Check the paclet DocPageExamples in this folder for problems and build it.

**Fixture (copied into the run's work folder):** `DocPageExamples` (from `~/.local/share/wolfram-agent-skills/markdown-to-notebook/4d1e13918c464b89a72ee47d97f49d5d9efd52b5/examples/Paclet/DocPageExamples`)

**Expected:**
- CheckPaclet report (PacletCICD now installed) with its findings listed
- archive built (PacletBuild in WLJS)
- nothing installed or submitted

**Must not happen:**
- no contact with Wolfram's servers (rule 0); `$AllowInternet` stays False
- no PacletInstall of the built paclet
- no SubmitPaclet

**WLJS notebook page required:** yes
