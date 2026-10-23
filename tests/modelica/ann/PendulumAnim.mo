model PendulumAnim "Simple MultiBody pendulum with a stored animation (skill test)"
  inner Modelica.Mechanics.MultiBody.World world;
  Modelica.Mechanics.MultiBody.Joints.Revolute revolute(phi(start = 1, fixed = true), w(start = 0, fixed = true));
  Modelica.Mechanics.MultiBody.Parts.BodyShape bodyShape(r = {1, 0, 0}, r_CM = {0.5, 0, 0}, m = 1);
equation
  connect(world.frame_b, revolute.frame_a);
  connect(revolute.frame_b, bodyShape.frame_a);
  annotation(
    experiment(StopTime = 5),
    __Wolfram(Animation(
      cameras = {
        Camera(name = "Front", distance = 4, rotation = {0, 0, 0, 1})},
      windows = {
        Window(name = "Default", camera = "Front", preferred = true,
               autoPlay = true, repeat = true, timeScale = 1,
               trace = {bodyShape.shape1})})));
end PendulumAnim;
