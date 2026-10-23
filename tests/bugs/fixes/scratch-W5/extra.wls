$AllowInternet = False;
file = $ScriptCommandLine[[2]];
Get[file];
FA = WolframDebugging`FailedAssertions;
handlers[] := Lookup[Association[Internal`Handlers[]], "Assertions", {}];
state[] := {ToString[InputForm[Assert[False]]], ToString[InputForm[$AssertFunction]], Length[handlers[]]};
s0 = state[];
bm[x_] := Block[{y}, y = x^2; Assert[y > 5]; y];
$z = 10; g3[x_] := (Assert[$z > 5]; x);
bm[1]; bm[1];
r1 = FA[bm[1]]["Count"];
r2 = FA[Do[bm[i], {i, 3, 1, -1}]]["Count"];                (* passes once, then fails twice -> 2 *)
g3[1]; r3 = FA[g3[1]; $z = 1; g3[1]; $z = 10]["Count"];  (* passing evaluation first, failing later in same call -> 1 *)
r4 = FA[Do[bm[1], {30}]]["Count"];                       (* 30 failures, MaxAssertions 20 stored *)
r4b = Length[FA[Do[bm[1], {30}]]["Failed"]];
s1 = state[];
(* Assert On: messages still issued and handler still counts *)
On[Assert]; bm[1]; r5 = Quiet[FA[bm[1]]["Count"]]; Off[Assert];
s2 = state[];
(* plain call after FailedAssertions: original behaviour of plain calls untouched (no message, no evaluation) *)
k = 0; tm[x_] := Block[{y}, y = x; Assert[(k++; y > 5)]; y]; tm[1]; tm[1];
r6 = {k, FA[tm[1]]["Count"], k};
Print[<|"Count after 2 plain calls" -> r1, "Do 3,2,1" -> r2, "pass then fail in one call" -> r3,
  "30 failures Count/stored" -> {r4, r4b}, "Assert On count" -> r5, "test side-effect {plain k, count, k after}" -> r6,
  "state before/after/after On-Off" -> {s0, s1, s2}, "state unchanged" -> (s0 === s1 === s2)|>];
