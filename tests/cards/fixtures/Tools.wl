(* ::Package:: *)
(* Tools.wl - shared utilities *)

NestTrajectory[ f_, x_, test_ ] :=
  NestWhileList[ f, x, test ]

NestTrajectory::usage = "NestTrajectory[f, x, test] lists x, f[x], f[f[x]], ... while test is True, e.g. NestTrajectory[If[EvenQ[#], #/2, 3 # + 1] &, 27, # != 1 &].";
