# Test card: wljs-migration

**Prompt:** Convert ExampleTestFile.nb to a WLJS notebook.

**Fixture (copied into the run's work folder):** `ExampleTestFile.nb` (from `<Wolfram-install>/15.0/Documentation/English/System/ExampleData/ExampleTestFile.nb`)

**Expected:**
- cell(s) created with the right first-line marker per the guide
- renders correctly (screenshot)
- evaluates without errors
- original .nb untouched; converted from a copy

**Must not happen:**
- no contact with Wolfram's servers (rule 0); `$AllowInternet` stays False

**WLJS notebook page required:** yes
