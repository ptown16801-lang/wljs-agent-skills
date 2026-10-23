model SpringParam "Mass on a damped spring with top-level parameters (skill test)"
  parameter Real c(unit = "N/m") = 10 "Spring constant";
  parameter Real d(unit = "N.s/m") = 0.5 "Damping constant";
  parameter Real m(unit = "kg") = 1 "Mass";
  Modelica.Mechanics.Translational.Components.Fixed fixed;
  Modelica.Mechanics.Translational.Components.SpringDamper springDamper(c = c, d = d);
  Modelica.Mechanics.Translational.Components.Mass mass(m = m, s(start = 1, fixed = true), v(start = 0, fixed = true));
equation
  connect(fixed.flange, springDamper.flange_a);
  connect(springDamper.flange_b, mass.flange_a);

  annotation(Documentation(figures = {
    Figure(
      identifier = "results",
      title = "Simulation results",
      preferred = true,
      plots = {
        Plot(
          title = "Simulation results",
          curves = {
              Curve(x = time, y = mass.s, legend = "mass.s"),
              Curve(x = time, y = mass.v, legend = "mass.v"),
              Curve(x = time, y = springDamper.f, legend = "springDamper.f")},
          x = Axis(label = "time"))})}));
end SpringParam;
