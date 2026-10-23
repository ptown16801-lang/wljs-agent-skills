$AllowInternet = False;
cnt[e_] := Module[{n = 0}, Internal`HandlerBlock[{"Assertions", (n++) &}, e]; n];
SetAttributes[cnt, HoldFirst];
bm[x_] := Block[{y}, y = x^2; Assert[y > 5]; y];
Print["bm before: ", cnt[bm[1]]];
Print["Trace fresh: ", Trace[bm[1]] // InputForm];
bm[1];
Print["bm after plain: ", cnt[bm[1]]];
Print["Trace after: ", Trace[bm[1]] // InputForm];
Print["DownValues: ", DownValues[bm] // InputForm];
(* direct Assert at top level *)
Print["top-level Assert: ", cnt[Assert[1 > 5]]];
(* Block not in definition *)
f2 := Block[{y}, y = 1; Assert[y > 5]; y];
Print["ownvalue block before ", cnt[f2]]; f2; Print["after ", cnt[f2]];
(* Block without Assert pattern *)
g[x_] := Block[{}, Assert[x > 5]; x];
Print["g block no locals before ", cnt[g[1]]]; g[1]; Print["after ", cnt[g[1]]];
h[x_] := (Assert[x > 5]; x);
Print["h no block before ", cnt[h[1]]]; h[1]; Print["after ", cnt[h[1]]];
