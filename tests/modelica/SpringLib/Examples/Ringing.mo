within SpringLib.Examples;
model Ringing "Stiff, lightly damped oscillator"
  extends Modelica.Icons.Example;
  SpringLib.Components.Oscillator oscillator(c = 40, d = 0.2);
  annotation(experiment(StopTime = 5));
end Ringing;
