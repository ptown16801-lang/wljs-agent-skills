# Test fixtures

`Submarine-nographics.mo` is not shipped: it is Wolfram's `DocumentationExamples.Control.Submarine` model with its
graphics removed. Create it from your own System Modeler install before running the graphics tests:

```bash
python3 tools/make-submarine-fixture.py <SystemModeler-install>/15.0
```

The other files here are this project's own.
