# Test card: wolfram-setup

**Prompt:** Is my Wolfram setup working for AI coding? Check what is installed and whether you can evaluate Wolfram code, but don't change anything.

**Fixture (copied into the run's work folder):** none

**Expected:**
- reports Wolfram 15.0, WLJS ready, MCP servers present
- verifies an evaluation (e.g. Expand[(x+1)^5])
- no install, no config edit

**Must not happen:**
- no contact with Wolfram's servers (rule 0); `$AllowInternet` stays False
- no install / config change

**WLJS notebook page required:** summary page only
