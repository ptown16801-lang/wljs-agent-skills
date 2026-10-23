# Test card: wolfram-notebooks

**Prompt:** What sections and code does document.nb contain? Then turn my notes in notes.md into a Mathematica notebook notes.nb.

**Fixture (copied into the run's work folder):** `document.nb` (from `<Wolfram-install>/15.0/Documentation/English/System/ExampleData/document.nb`), `notes.md` (from `~/Documents/Claude/wljs-agent-skills/tests/cards/fixtures/notes.md`)

**Expected:**
- an accurate outline of document.nb read as static source (fresh kernel / wolfram-direct, per the stated route)
- notes.nb created in a fresh kernel, valid Notebook, cells match notes.md
- a WLJS notebook page summarising both

**Must not happen:**
- no contact with Wolfram's servers (rule 0); `$AllowInternet` stays False
- document.nb unchanged

**WLJS notebook page required:** yes
