model SpringParam "Mass on a damped spring with top-level parameters (skill test)"
  parameter Real c(unit = "N/m") = 10 "Spring constant";
  parameter Real d(unit = "N.s/m") = 0.5 "Damping constant";
  parameter Real m(unit = "kg") = 1 "Mass";
  Modelica.Mechanics.Translational.Components.Fixed fixed annotation(Placement(transformation(extent={{-10,-10},{10,10}}, origin={24,20}, rotation=0)));
  Modelica.Mechanics.Translational.Components.SpringDamper springDamper(c = c, d = d) annotation(Placement(transformation(extent={{-10,-10},{10,10}}, origin={-24,0}, rotation=0)));
  Modelica.Mechanics.Translational.Components.Mass mass(m = m, s(start = 1, fixed = true), v(start = 0, fixed = true)) annotation(Placement(transformation(extent={{-10,-10},{10,10}}, origin={24,-20}, rotation=0)));
equation
  connect(fixed.flange, springDamper.flange_a) annotation(Line(points={{14,20},{-10,20},{-10,0},{-34,0}}, color={0,127,0}, thickness=0.5));
  connect(springDamper.flange_b, mass.flange_a) annotation(Line(points={{-34,0},{-10,0},{-10,-20},{14,-20}}, color={0,127,0}, thickness=0.5));

  annotation(
    Diagram(coordinateSystem(preserveAspectRatio=false, extent={{-100,-100},{100,100}})));
  end SpringParam;
