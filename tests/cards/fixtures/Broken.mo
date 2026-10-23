model Broken "ExampleModel with an undefined variable (test fixture)"
  Real x(start = 1);
  Real y(start = 1);
equation
  der(x) = -x;
  der(y) = y + z;
end Broken;
