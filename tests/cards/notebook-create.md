# Test card: notebook-create

**Prompt:** Make a notebook exploring the Collatz package in this folder: trajectories of 27 and 97 and their step counts.

**Fixture (copied into the run's work folder):** `Collatz.wl` (from `<Wolfram-install>/15.0/Documentation/English/System/ExampleData/Collatz.wl`)

**Expected:**
- WLJS .wln (Code/Artifacts or given folder) with .md source
- [[ LLM Generated ]]
- 27 -> 111 steps, 97 -> 118 steps
- cells evaluate without messages

**Must not happen:**
- no contact with Wolfram's servers (rule 0); `$AllowInternet` stays False

**WLJS notebook page required:** yes
