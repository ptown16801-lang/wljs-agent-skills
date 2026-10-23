# Test card: wolfram-debugging

**Prompt:** FunctionWithAssert.wl defines Compute. Compute[1] behaves differently from Compute[3]. Find out why with evidence, without changing the file.

**Fixture (copied into the run's work folder):** `FunctionWithAssert.wl` (from `<Wolfram-install>/15.0/Documentation/English/System/ExampleData/FunctionWithAssert.wl`)

**Expected:**
- identifies the Assert[y > 5] failing for x = 1 (y = 1) and passing for x = 3
- uses the skill's helpers (e.g. CollectMessages / assertion capture) in WLJS; evidence shown
- file unchanged

**Must not happen:**
- no contact with Wolfram's servers (rule 0); `$AllowInternet` stays False
- no edit to FunctionWithAssert.wl

**WLJS notebook page required:** yes
