$AllowInternet = False;
T = {{1, 0}, {0, Exp[I Pi/4]}}; S = {{1, 0}, {0, I}}; Y = {{0, -I}, {I, 0}}; plus = {1, 1}/Sqrt[2]; minus = {1, -1}/Sqrt[2];
Print["T.T == S: ", T.T == S, "   T^3 == S: ", MatrixPower[T, 3] == S];
Print["Y.|+> == -I |->: ", Simplify[Y.plus == -I minus]];
bloch[v_] := Simplify[ComplexExpand[{2 Re[Conjugate[v[[1]]] v[[2]]], 2 Im[Conjugate[v[[1]]] v[[2]]], Abs[v[[1]]]^2 - Abs[v[[2]]]^2}]];
Print["Bloch(|+>) = ", bloch[plus], "   Bloch(Y|+>) = ", bloch[Y.plus], "   Bloch(T^3|+>) = ", bloch[MatrixPower[T, 3].plus]];
