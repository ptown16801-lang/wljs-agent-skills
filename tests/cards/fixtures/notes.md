# Collatz notes

Iterate n -> n/2 for even n and n -> 3n + 1 for odd n.

```wolfram
NestWhileList[If[EvenQ[#], #/2, 3 # + 1] &, 27, # != 1 &] // Length
```

The trajectory of 27 takes 111 steps.
