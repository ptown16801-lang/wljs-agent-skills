# Level A results (Oct 22, 2026)

Wolfram's official AgentTools test suites, from the commit that matches the installed AgentTools 2.2.0
(`9c99e2d`), run against the installed paclet. Fresh kernels ran inside a network sandbox (`bwrap --unshare-net`), so
nothing could reach Wolfram's servers (rule 0); WLJS ran with `$AllowInternet = False` (checked: WLJS refuses
`URLRead`/`URLFetch`/`Import` of a web address with the "offline" message).

| Suite | Fresh kernel | WLJS kernel | Fresh-kernel failures explained | Fails only in WLJS |
|---|---|---|---|---|
| SymbolDefinition | 79/79 | 79/79 | 0 need Wolfram's servers | none |
| PacletTools | 60/60 | 60/60 | 0 need Wolfram's servers | none |
| PacletDocumentationTools | 93/93 | 91/93 | 0 need Wolfram's servers | EditSymbolPacletDocumentation-SetDetailsTable-BasicFunctionality, EditSymbolPacletDocumentation-SetSeeAlso-EmptyCreatesPlaceholder |
| CodeInspectorTool | 265/265 | 265/265 | 0 need Wolfram's servers | none |
| NotebookViewer | 24/24 | 24/24 | 0 need Wolfram's servers | none |
| Tools | 66/74 | 66/74 | 8 need Wolfram's servers | none |
| Graphics | 33/42 | 25/42 | 9 need Wolfram's servers | extractImageContent-AssociationOfGraphics, extractImageContent-ListOfGraphics, extractImageContent-SingleGraphics, graphicsQ-Labeled, graphicsToImageContent-Graphics, graphicsToImageContent-HasBase64Data, graphicsToImageContent-ValidBase64, resultToContent-Graphics, resultToContent-GraphicsTypes |
| WolframDebuggingSkill (newer suite, commit `744d2d1`, source tree) | 123/123 | 118/123 | 0 | CapturePrints-Notebooks, Cleanup-NoStateLeft, DebugHTTPResponse, SubmitAndWait-OuterTimeLimit, TaskReport-SubmitAndWait |

**Every fresh-kernel failure needs Wolfram's servers** (Wolfram|Alpha queries and images, the online semantic
documentation search, map tiles); blocked on purpose.

**WLJS-only failures** (real WLJS differences):
- WolframDebuggingSkill: tasks left in `Tasks[]` and local `APIFunction` evaluation (WLJS redefines `FormObject`, `Function::slot1`); debug HTTP/API code in a fresh kernel (ROUTES.md).
- Graphics: converting graphics to image content times out inside WLJS ("Promise Timeout"); image files go through a
  fresh kernel (ROUTES.md).
- PacletDocumentationTools: AgentTools' Markdown importer crashes inside WLJS (same cause as `WriteNotebook`); symbol
  pages are made in a fresh kernel (ROUTES.md).

**Mistakes made and corrected during the run:**
- First run used the newest tests (`744d2d1`) against the AgentTools source tree, which fetches helper functions from
  Wolfram's Function Repository at load: many false failures. Re-run with the release-matched tests and the installed
  paclet.
- One WLJS run wrapped the suites in `Quiet`, which hid the "offline" messages that the network tests fail on, so they
  looked like passes. That run was discarded and repeated without `Quiet`.
