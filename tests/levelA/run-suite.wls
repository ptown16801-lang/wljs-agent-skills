#!/usr/bin/env wolframscript
$AllowInternet = False;
Get[ FileNameJoin[ { DirectoryName[ $InputFileName ], "run-suite.wl" } ] ];
Print[ levelARun[ $ScriptCommandLine[[ 2 ]], $ScriptCommandLine[[ 3 ]] ] ];
