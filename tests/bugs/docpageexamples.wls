$AllowInternet = False;
PacletDirectoryLoad["~/.local/share/wolfram-agent-skills/markdown-to-notebook/4d1e13918c464b89a72ee47d97f49d5d9efd52b5/examples/Paclet/DocPageExamples/DocPageExamples"]; Needs["WolframInstitute`DocPageExamples`"];
Print["1 MazeParse long 2nd line: ", MazeParse[{"#####", "#S..G##"}]];
Print["2 MazeGenerate[{1,1}]: ", MazeGenerate[{1, 1}]];
f = FileNameJoin[{$TemporaryDirectory, "t.maze"}]; Export[f, "###\n#SG\n###", "Text"];
Print["3 Import without format: ", Import[f], "   with MAZE: ", Import[f, "MAZE"]];
Print["4 ServiceExecute Lorem: ", Quiet[Check[ServiceExecute[ServiceConnect["Lorem"], "Words", {"Count" -> 3}], $Failed, ServiceExecute::isrv]], " msgs:", $MessageList];
