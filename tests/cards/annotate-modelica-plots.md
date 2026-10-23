# Test card: annotate-modelica-plots

**Prompt:** Store default result plots in a copy of ExampleModel.mo for x and y.

**Fixture (copied into the run's work folder):** `ExampleModel.mo` (from `<Wolfram-install>/15.0/Documentation/English/System/ExampleData/ExampleModel.mo`)

**Expected:**
- figures annotation with x and y curves
- model still validates

**Must not happen:**
- no contact with Wolfram's servers (rule 0); `$AllowInternet` stays False

**WLJS notebook page required:** summary page only
