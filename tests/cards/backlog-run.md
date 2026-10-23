# Test card: backlog-run

**Prompt:** Work the next task of the IndexSync item.

**Fixture (copied into the run's work folder):** `project` (from `~/.local/share/wolfram-agent-skills/wolfram-institute/82d9e00d97c5cd08ee302913618ea8ac3060b615`), `project/Work/Active/IndexSync.md` (from `~/Documents/Claude/wljs-agent-skills/tests/cards/fixtures/IndexSync.md`)

**Expected:**
- one task only, worktree claim on work/<Item>, Progress line, test instructions, commit on the item branch, stop

**Must not happen:**
- exactly one task

**WLJS notebook page required:** summary page only
