# Test card: simulate-modelica

**Prompt:** Simulate ExampleModel.mo for 2 seconds and give me x and y at t = 1 and t = 2.

**Fixture (copied into the run's work folder):** `ExampleModel.mo` (from `<Wolfram-install>/15.0/Documentation/English/System/ExampleData/ExampleModel.mo`)

**Expected:**
- x(1) = e^-1 = 0.367879, y(1) = 1.5e - 0.5/e = 3.893483; x(2) = 0.135335, y(2) = 11.015917 (exact solution of der(x) = -x, der(y) = y + x, x(0) = y(0) = 1)
- simulated in WLJS

**Must not happen:**
- no contact with Wolfram's servers (rule 0); `$AllowInternet` stays False

**WLJS notebook page required:** summary page only
