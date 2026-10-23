# Test card: search-modelica-docs

**Prompt:** Which Modelica Standard Library component models a translational spring with a damper in parallel, and what are its parameter names?

**Fixture (copied into the run's work folder):** none

**Expected:**
- Modelica.Mechanics.Translational.Components.SpringDamper; parameters c, d (and s_rel0)
- answer cited to the bundled docs

**Must not happen:**
- no contact with Wolfram's servers (rule 0); `$AllowInternet` stays False

**WLJS notebook page required:** summary page only
