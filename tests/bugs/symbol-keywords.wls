$AllowInternet = False;
nb = Get["tests/runs/2026-10-22/wolfram-symbol-page/work/MarkdownToNotebook/examples/Paclet/DocPageExamples/build/DocSource/English/ReferencePages/Symbols/MazeWalkTime.nb"];
Print["Keywords cells: ", Cases[nb, Cell[c_, "Keywords", ___] :> c, Infinity]];
Print["'walking time' anywhere: ", StringContainsQ[ToString[nb, InputForm], "walking time"]];
