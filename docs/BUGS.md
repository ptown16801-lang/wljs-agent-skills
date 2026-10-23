# Defects found (summary)

Full reports, with reproduction steps, actual vs expected and cause: [tests/bugs/BUGS.md](../tests/bugs/BUGS.md).
Every item was reproduced by hand, offline.

| ID | Product | Defect | Fix |
|---|---|---|---|
| W1 | Mathematica 15.0 example data | `ExampleData/Submarine.mo` does not build on its own (missing `noEvent`) | workaround: use `DocumentationExamples.Control.Submarine` |
| W2 | Mathematica 15.0 | ServiceFramework refuses every request while `$AllowInternet` is False, including local services | documented; no local fix |
| W3 | Mathematica 15.0 | loading the documentation-build package triggers a paclet download attempt | documented; no local fix |
| W4 | System Modeler AI toolkit | automatic diagram layout draws lines to guessed, wrong connector positions | [patch](../patches/W4-wsm-toolkit-pins.diff), [write-up](../tests/bugs/fixes/W4.md) |
| W5 | AgentTools `WolframDebugging` | `FailedAssertions` reports 0 failures after the first call | [patch](../patches/W5-failedassertions.diff), [write-up](../tests/bugs/fixes/W5.md) |
| J1 | WLJS 3.1.4 | saving from the kernel triggers a false "File hash mismatch" dialog | local patch, described in BUGS.md |
| J2 | WLJS 3.1.4 | dialogs open on the primary monitor, not over their window | local patch, described in BUGS.md |
| J3 | WLJS 3.1.4 | saving from the kernel does not store graphics; plots show "Loading..." after restart | local patch, described in BUGS.md |
| J4 | WLJS 3.1.4 | notebooks created through the API/MCP get none of the extensions' listeners | local patch, described in BUGS.md |
| I1 | MarkdownToNotebook example | `build.wls` leaves stray `General::stop` cells on built pages | [patch](../patches/I1-build-stray-general-stop.diff), [write-up](../tests/bugs/fixes/I1.md) |
| I2 | MarkdownToNotebook example | `DocPageExamples` paclet: three functional defects | [patch](../patches/I2-docpageexamples-maze-defects.diff), [write-up](../tests/bugs/fixes/I2.md) |
| I3 | MarkdownToNotebook example | `BlochSphereGates` Demonstration: four factual errors | [patch](../patches/I3-bloch-sphere-text-errors.diff), [write-up](../tests/bugs/fixes/I3.md) |
| I4 | MarkdownToNotebook | converter drops a symbol page's Keywords | [patch](../patches/I4-symbol-page-keywords.diff), [write-up](../tests/bugs/fixes/I4.md) |
| I5 | `wolfram-data-repository` skill | category list says 34 but lists 35 | [patch](../patches/I5-data-repository-category-count.diff), [write-up](../tests/bugs/fixes/I5.md) |
