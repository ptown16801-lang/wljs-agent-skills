(* Lists System` symbols that carry definitions (Own/Down/Up/Sub/Format values) in this kernel, with a hash per
   symbol. Run in WLJS and in a plain kernel, then diff: what WLJS changes in the built-in language. *)
systemDefinitions[] := Association @ Map[
  name |-> With[{s = ToExpression[name, InputForm, HoldComplete]},
    name -> Hash[Replace[s, HoldComplete[x_] :> {OwnValues[x], DownValues[x], UpValues[x], SubValues[x], FormatValues[x]}]]],
  Select[Names["System`*"], name |-> ToExpression[name, InputForm,
    Function[x, Quiet[Length[OwnValues[x]] + Length[DownValues[x]] + Length[UpValues[x]] + Length[SubValues[x]] + Length[FormatValues[x]] > 0], HoldAll]]]]
