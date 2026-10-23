(* Level A runner (TEST-PLAN.md): runs one Wolfram .wlt test file with internet off and writes a JSON summary.
   Fresh kernel: wolframscript -f run-suite.wls <suite.wlt> <out.json>
   WLJS kernel:  Get this file, then levelARun["/abs/suite.wlt", "/abs/out.json"]. Rule 0: $AllowInternet stays False. *)

levelARun[ suite_String, out_String ] := Block[ { $AllowInternet = False },
    Module[ { t0 = AbsoluteTime[ ], ed, report, results, summary },
        ed = EvaluationData[ TestReport[ suite ] ];
        report = ed[ "Result" ];
        results = If[ Head[ report ] === TestReportObject, Values @ report[ "TestResults" ], { } ];
        summary = <|
            "suite" -> FileBaseName[ suite ],
            "kernel" -> If[ TrueQ[ Quiet @ Internal`Kernel`WLJSQ ], "WLJS", "fresh" ],
            "ok" -> Head[ report ] === TestReportObject,
            "tests" -> Length[ results ],
            "passed" -> Count[ results, r_ /; r[ "Outcome" ] === "Success" ],
            "failed" -> Map[
                <| "id" -> ToString[ #[ "TestID" ] ], "outcome" -> ToString[ #[ "Outcome" ] ] |> &,
                Select[ results, #[ "Outcome" ] =!= "Success" & ] ],
            "seconds" -> Round[ AbsoluteTime[ ] - t0, 0.1 ],
            "messages" -> Take[ DeleteDuplicates[ StringTake[ #, UpTo[ 160 ] ] & /@ ed[ "MessagesText" ] ], UpTo[ 8 ] ]
        |>;
        Export[ out, summary, "RawJSON" ];
        summary[ "suite" ] <> " (" <> summary[ "kernel" ] <> "): " <> ToString[ summary[ "passed" ] ] <> "/" <>
            ToString[ summary[ "tests" ] ] <> " passed, " <> ToString[ summary[ "seconds" ] ] <> " s"
    ]
]
