#!/usr/bin/env wolframscript
(* Reference answers for the test cards, computed offline (network-sandboxed fresh kernel). *)
$AllowInternet = False;
step[n_] := If[EvenQ[n], n/2, 3 n + 1];
total[n_] := Length[NestWhileList[step, n, # != 1 &]] - 1;
stop[n_] := Length[NestWhileList[step, step[n], # >= n &]];
peak[n_] := Max[NestWhileList[step, n, # != 1 &]];
records[f_, lo_, hi_] := Module[{best = -Infinity}, Select[Range[lo, hi], With[{v = f[#]}, If[v > best, best = v; True, False]] &]];
osc[c_, d_, m_, t_] := Module[{x, s}, x[t] /. First @ NDSolve[{m x''[s] + d x'[s] + c x[s] == 0, x[0] == 1, Derivative[1][x][0] == 0}, x, {s, 0, 10},
  PrecisionGoal -> 12, AccuracyGoal -> 12, WorkingPrecision -> 30]];
num[v_] := ToString[NumberForm[N[v], 10]];
ref = <|
  "prime1000" -> Prime[1000],
  "total27" -> total[27], "total97" -> total[97], "peak27" -> peak[27],
  "stopRecords1e5" -> records[stop, 2, 99999],
  "totalRecords1e4" -> records[total, 1, 9999],
  "peakRecords1e4" -> records[peak, 1, 9999],
  "spring_c10_d0.5_m1_x1" -> num[osc[10, 1/2, 1, 1]],
  "spring_c10_d0.1_m1_x1" -> num[osc[10, 1/10, 1, 1]],
  "spring_c10_d1_m1_x1" -> num[osc[10, 1, 1, 1]],
  "ringing_c40_d0.2_m1_x1" -> num[osc[40, 1/5, 1, 1]],
  "sumFirstOdd_1to6" -> Table[Sum[2 k - 1, {k, n}], {n, 6}]
|>;
Export[FileNameJoin[{DirectoryName[$InputFileName], "reference-values.json"}], ref, "RawJSON"];
Print[ref];
