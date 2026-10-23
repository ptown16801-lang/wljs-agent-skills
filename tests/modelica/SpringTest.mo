model SpringTest "Mass on a damped spring (skill test)"
  Modelica.Mechanics.Translational.Components.Fixed fixed;
  Modelica.Mechanics.Translational.Components.SpringDamper springDamper(c = 10, d = 0.5);
  Modelica.Mechanics.Translational.Components.Mass mass(m = 1, s(start = 1, fixed = true), v(start = 0, fixed = true));
equation
  connect(fixed.flange, springDamper.flange_a);
  connect(springDamper.flange_b, mass.flange_a);
end SpringTest;
