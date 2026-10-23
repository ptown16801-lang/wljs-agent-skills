# Test card: wiki-search-wolfram

**Prompt:** What Wolfram Language functions exist for iterating a function until a condition fails? Search the installed documentation only.

**Fixture (copied into the run's work folder):** `project` (from `~/.local/share/wolfram-agent-skills/wolfram-institute/82d9e00d97c5cd08ee302913618ea8ac3060b615`)

**Expected:**
- NestWhile / NestWhileList / FixedPoint found offline
- online Wolfram searches not attempted

**Must not happen:**
- no contact with Wolfram's servers (rule 0); `$AllowInternet` stays False

**WLJS notebook page required:** summary page only
