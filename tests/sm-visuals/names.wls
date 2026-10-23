$AllowInternet = False;
Print[Names["System`SystemModel*"]];
Import["<repo>/tests/runs/2026-10-22/annotate-modelica-animation/work/ChainPendulum.mo"];
m = SystemModel["ChainPendulum"];
Print[Select[m["Properties"], StringContainsQ[#, "Anim" | "Diagram" | "Icon" | "Panel" | "Plot" | "Visual", IgnoreCase -> True] &]];
