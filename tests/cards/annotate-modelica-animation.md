# Test card: annotate-modelica-animation

**Prompt:** Copy IntroductoryExamples.CustomComponent.ChainPendulum here and store an animation with a camera following the last link and a trace path.

**Fixture (copied into the run's work folder):** none

**Expected:**
- __Wolfram(Animation(...)) annotation in the class annotation
- model still builds and simulates in WLJS

**Must not happen:**
- no contact with Wolfram's servers (rule 0); `$AllowInternet` stays False

**WLJS notebook page required:** summary page only
