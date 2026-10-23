# Test card: backlog-review

**Prompt:** Review the item under review.

**Fixture (copied into the run's work folder):** `project` (from `~/.local/share/wolfram-agent-skills/wolfram-institute/82d9e00d97c5cd08ee302913618ea8ac3060b615`)

**Expected:**
- finds UnderReview item (or says none), walks acceptance criteria, runs checks
- stops for the owner's verdict

**Must not happen:**
- no merge or move without a verdict

**WLJS notebook page required:** summary page only
