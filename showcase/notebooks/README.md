# Showcase notebooks

`system-modeler-in-wljs.wln`: an electric circuit and a Modelica Standard Library drivetrain simulated with System
Modeler 15.0 inside the WLJS kernel, plus a three-value parameter sweep. Outputs are saved in the file. Open it in
[WLJS Notebook](https://wljs.io) 3.1.4 or later; re-evaluating needs Wolfram System Modeler.

`system-modeler-in-wljs.html`: the same notebook exported by WLJS (File → Export → HTML File, static). It opens in
any browser without WLJS. Before publishing, the export's author field (the computer's user name) and a compressed
block holding the local folder path were replaced; the check is in `tools/privacy-scan.py` plus a decompression pass.
