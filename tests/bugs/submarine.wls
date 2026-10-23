$AllowInternet = False;
f = "<Wolfram-install>/15.0/Documentation/English/System/ExampleData/Submarine.mo";
Import[f];
r = SystemModelSimulate[SystemModel["Submarine"], 50];
Print["standalone ExampleData Submarine: ", Head[r]];
r2 = SystemModelSimulate["DocumentationExamples.Control.Submarine", 50];
Print["bundled library model: ", Head[r2]];
