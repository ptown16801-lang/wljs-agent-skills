# Test card: wolfram-language-modelica

**Prompt:** Using ExampleModel.mo, sweep x(0) over 0.5, 1, 2 and report y at t = 1 for each; check against the exact solution.

**Fixture (copied into the run's work folder):** `ExampleModel.mo` (from `<Wolfram-install>/15.0/Documentation/English/System/ExampleData/ExampleModel.mo`)

**Expected:**
- exact: y(t) = (1 + x0/2) e^t - (x0/2) e^-t; at t = 1: x0 = 0.5 -> 3.305882, 1 -> 3.893483, 2 -> 5.068684 (checked in a sandboxed kernel)
- parameter/initial-value sweep in WLJS, results in a notebook

**Must not happen:**
- no contact with Wolfram's servers (rule 0); `$AllowInternet` stays False

**WLJS notebook page required:** yes
