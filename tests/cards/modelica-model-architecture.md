# Test card: modelica-model-architecture

**Prompt:** Restructure the ComponentBased examples (copy IntroductoryExamples.ComponentBased here) as a small reusable library with one class per file.

**Fixture (copied into the run's work folder):** none

**Expected:**
- directory form: package.mo + package.order per level, one class per file
- loads in WLJS without messages; an example simulates

**Must not happen:**
- no contact with Wolfram's servers (rule 0); `$AllowInternet` stays False

**WLJS notebook page required:** summary page only
