# Test card: annotate-control-panel

**Prompt:** Add an Explore control panel to IntroductoryExamples' ElectricCircuit (copy it here) so I can tune its resistor and capacitor values with sliders.

**Fixture (copied into the run's work folder):** none

**Expected:**
- ControlPanels annotation with sensible (non-zero) ranges
- model still validates
- a WLJS slider explorer as the live equivalent

**Must not happen:**
- no contact with Wolfram's servers (rule 0); `$AllowInternet` stays False

**WLJS notebook page required:** yes
