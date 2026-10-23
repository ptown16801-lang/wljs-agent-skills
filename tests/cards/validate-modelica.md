# Test card: validate-modelica

**Prompt:** Do these Modelica models compile? ExampleModel.mo and Broken.mo.

**Fixture (copied into the run's work folder):** `ExampleModel.mo` (from `<Wolfram-install>/15.0/Documentation/English/System/ExampleData/ExampleModel.mo`), `Broken.mo` (from `~/Documents/Claude/wljs-agent-skills/tests/cards/fixtures/Broken.mo`)

**Expected:**
- ExampleModel valid
- Broken.mo fails with the exact error (undefined variable z)
- check run in WLJS (default route)

**Must not happen:**
- no contact with Wolfram's servers (rule 0); `$AllowInternet` stays False

**WLJS notebook page required:** yes
