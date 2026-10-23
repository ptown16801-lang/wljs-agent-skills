(* Authoring-skill builds: one real source per MarkdownToNotebook skill, converted offline to its Wolfram format.
   Runs in any kernel. In WLJS: Get this file, then authoringRun[outDir] or authoringRun[outDir, {"skill", ...}].
   Sources: the pinned upstream examples (copied to outDir/examples first, so the pinned copy stays untouched)
   plus tests/authoring/sources. Writes outDir/results.json and returns one summary line per skill. *)

authoringM2N = FileNameJoin[{$HomeDirectory,
  ".local/share/wolfram-agent-skills/markdown-to-notebook/4d1e13918c464b89a72ee47d97f49d5d9efd52b5"}];
authoringSources = DirectoryName[$InputFileName] <> "sources";

authoringCases[ex_] := {
  {"wolfram-computational-essay", ex <> "/ComputationalEssay/PiIsMostlyRandom.md"},
  {"wolfram-data-repository", ex <> "/Data/WallpaperGroups.md"},
  {"wolfram-demonstration", ex <> "/Demonstration/BlochSphereGates.md"},
  {"wolfram-example-repository", ex <> "/Example/PrimeSpiralPoints.md"},
  {"wolfram-function-resource", ex <> "/FunctionResource/Memoize.md"},
  {"wolfram-prompt", ex <> "/Prompt/AdaLovelace.md"},
  {"wolfram-symbol-page", ex <> "/Paclet/DocPageExamples/docs/MazeWalkTime.md"},
  {"wolfram-guide-page", ex <> "/Paclet/DocPageExamples/docs/DocPageExamples.md"},
  {"wolfram-paclet", ex <> "/Paclet/DocPageExamples/ResourceDefinition.md"},
  {"wolfram-tech-note", authoringSources <> "/TechNoteTest.md"},
  {"wolfram-overview-page", authoringSources <> "/OverviewTest.md"}};

authoringOne[outDir_, {skill_, src_}, limit_] := Module[{out = FileNameJoin[{outDir, skill <> ".nb"}], t0 = AbsoluteTime[], ed, nb, styles},
  Quiet[DeleteFile[out]];
  ed = EvaluationData[TimeConstrained[MarkdownToNotebook[src, out], limit, $TimedOut]];
  nb = If[FileExistsQ[out], Quiet @ Get[out], $Failed];
  styles = If[Head[nb] === Notebook, Counts[Cases[nb, Cell[_, s_String, ___] :> s, Infinity]], <||>];
  <|"skill" -> skill, "ok" -> Head[nb] === Notebook, "result" -> ToString[Short[ed["Result"], 1]],
    "bytes" -> If[FileExistsQ[out], FileByteCount[out], 0], "cells" -> Total[styles],
    "images" -> If[Head[nb] === Notebook, Count[nb, _GraphicsBox | _Graphics3DBox | _RasterBox, Infinity], 0],
    "secs" -> Round[AbsoluteTime[] - t0, 0.1], "messages" -> Length[ed["MessagesText"]],
    "firstMessages" -> Take[DeleteDuplicates[StringTake[#, UpTo[150]] & /@ ed["MessagesText"]], UpTo[4]]|>];

authoringRun[outDir_, only_ : All, limit_ : 300] := Block[{$AllowInternet = False},
  Module[{ex = FileNameJoin[{outDir, "examples"}], cases, results},
    If[!DirectoryQ[ex], CreateDirectory[outDir, CreateIntermediateDirectories -> True];
      CopyDirectory[FileNameJoin[{authoringM2N, "examples"}], ex]];
    Get[FileNameJoin[{authoringM2N, "MarkdownToNotebook.wl"}]];
    cases = authoringCases[ex];
    If[only =!= All, cases = Select[cases, MemberQ[only, First[#]] &]];
    results = authoringOne[outDir, #, limit] & /@ cases;
    Export[FileNameJoin[{outDir, "results.json"}], results, "RawJSON"];
    StringRiffle[(#skill <> ": " <> If[#ok, "OK", "FAIL"] <> "  cells=" <> ToString[#cells] <> "  images=" <>
      ToString[#images] <> "  msgs=" <> ToString[#messages] <> "  " <> ToString[#secs] <> "s") & /@ results, "\n"]]];
