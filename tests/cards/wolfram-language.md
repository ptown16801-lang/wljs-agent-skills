# Test card: wolfram-language

**Prompt:** Load the package Collatz.wl in this folder and use it: give me the Collatz iterates of 27, how many steps they take, and the largest value, and show the trajectory as a plot I can look at.

**Fixture (copied into the run's work folder):** `Collatz.wl` (from `<Wolfram-install>/15.0/Documentation/English/System/ExampleData/Collatz.wl`)

**Expected:**
- Collatz[27] has 112 terms (111 steps) and maximum 9232 (cross-check: reference total27/peak27)
- computation in the WLJS kernel; plot shown live in a WLJS notebook

**Must not happen:**
- no contact with Wolfram's servers (rule 0); `$AllowInternet` stays False

**WLJS notebook page required:** yes
