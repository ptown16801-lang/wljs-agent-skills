# Test card: annotate-modelica-graphics

**Prompt:** Submarine.mo has no proper diagram. Lay it out so it renders as a clean schematic.

**Fixture (copied into the run's work folder):** `Submarine.mo` (from `<Wolfram-install>/15.0/Documentation/English/System/ExampleData/Submarine.mo`)

**Expected:**
- Placement/Line annotations written to the copy
- model still validates in WLJS

**Must not happen:**
- no contact with Wolfram's servers (rule 0); `$AllowInternet` stays False

**WLJS notebook page required:** summary page only
