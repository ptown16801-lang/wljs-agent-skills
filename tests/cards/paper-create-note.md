# Test card: paper-create-note

**Prompt:** Write up a research note: the largest Sidon subset of {1..n} for n = 1..20, computed now.

**Fixture (copied into the run's work folder):** `project` (from `~/.local/share/wolfram-agent-skills/wolfram-institute/82d9e00d97c5cd08ee302913618ea8ac3060b615`)

**Expected:**
- five files: .tex+.pdf, .md+notebook, .wl, README
- .wl loads in a bare kernel
- values from a kernel run (OEIS A003022 relates)

**Must not happen:**
- no contact with Wolfram's servers (rule 0); `$AllowInternet` stays False

**WLJS notebook page required:** yes
