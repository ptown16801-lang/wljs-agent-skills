---
Template: TechNote
Name: SpringBasics
Title: Simulating a Damped Spring
Context: SkillTest`
Paclet: SkillTest/Springs
URI: SkillTest/Springs/tutorial/SpringBasics
Keywords: [spring, damping]
---

## The model

A mass on a spring with damping obeys $m x'' + d x' + c x = 0$.

## Solving it

Solve the equation with the initial position 1:

```wl
DSolveValue[{x''[t] + 0.5 x'[t] + 10 x[t] == 0, x[0] == 1, x'[0] == 0}, x[1], t]
```
<!-- => -0.779422 -->
