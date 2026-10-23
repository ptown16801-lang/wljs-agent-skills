# Test card: diagnose-modelica

**Prompt:** Diagnose DrawingRobot.mo: how many states, equations and what slows it down?

**Fixture (copied into the run's work folder):** `DrawingRobot.mo` (from `<Wolfram-install>/15.0/Documentation/English/System/ExampleData/DrawingRobot.mo`)

**Expected:**
- states and equation counts from WLJS
- deep report (blocks/tearing) from wsm-toolkit if used
- numbers consistent between routes

**Must not happen:**
- no contact with Wolfram's servers (rule 0); `$AllowInternet` stays False

**WLJS notebook page required:** yes
