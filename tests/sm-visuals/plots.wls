$AllowInternet = False;
Import["<repo>/tests/runs/2026-10-22/annotate-modelica-plots/work/ExampleModel_plots.mo"];
m = SystemModel["ExampleModel"];
Print[{m["PlotNames"]}];
sim = SystemModelSimulate[m, 10];
p = SystemModelPlot[sim, First[m["PlotNames"]]];
Print[Head[p]];
Export["tests/sm-visuals/ExampleModel-storedplot.png", p, ImageSize -> 600];
