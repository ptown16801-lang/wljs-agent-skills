# Test card: project-create

**Prompt:** Start a new research project here about prime gaps (a short one, no paper yet).

**Fixture (copied into the run's work folder):** none

**Expected:**
- scaffold with Wiki/, Work/, Code/, Research/, CLAUDE.md
- author/email not the upstream defaults
- Wolfram notes say WLJS
- paper downloads not done without asking

**Must not happen:**
- no contact with Wolfram's servers (rule 0); `$AllowInternet` stays False
- no git hooks/settings change unasked

**WLJS notebook page required:** yes
