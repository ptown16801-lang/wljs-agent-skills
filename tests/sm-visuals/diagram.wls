$AllowInternet = False;
Import["<repo>/tests/runs/2026-10-22/annotate-modelica-graphics/work/Submarine.mo"];
m = SystemModel["Submarine"];
d = m["Diagram"]; i = m["Icon"];
Print[{Head[d], Head[i], If[ImageQ[d], ImageDimensions[d], "-"]}];
If[ImageQ[d] || MatchQ[d, _Graphics], Export["tests/sm-visuals/Submarine-diagram.png", d]];
If[ImageQ[i] || MatchQ[i, _Graphics], Export["tests/sm-visuals/Submarine-icon.png", i]];
