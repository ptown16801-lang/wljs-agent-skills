within SpringLib.Components;
model Oscillator "Mass on a damped spring attached to a fixed point"
  parameter Modelica.Units.SI.TranslationalSpringConstant c = 10 "Spring constant";
  parameter Modelica.Units.SI.TranslationalDampingConstant d = 0.5 "Damping constant";
  parameter Modelica.Units.SI.Mass m = 1 "Mass";
  parameter Modelica.Units.SI.Position s0 = 1 "Initial position";
  Modelica.Mechanics.Translational.Components.Fixed fixed;
  Modelica.Mechanics.Translational.Components.SpringDamper springDamper(c = c, d = d);
  Modelica.Mechanics.Translational.Components.Mass mass(m = m, s(start = s0, fixed = true), v(start = 0, fixed = true));
equation
  connect(fixed.flange, springDamper.flange_a);
  connect(springDamper.flange_b, mass.flange_a);
end Oscillator;
