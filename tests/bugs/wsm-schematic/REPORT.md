# wsm-toolkit schematic: connection lines end in the wrong place on MSL components

Oct 22, 2026. Wolfram System Modeler AI toolkit pinned at `991a80001b819b98e9484d26ff5e650657449d6a`
(`annotate-modelica-graphics/Schematic/`), run through `~/.local/bin/wsm-toolkit`; MSL 4.1.0 (System Modeler 15.0).
Investigated by a verification agent; the comparison output (`check_pins.txt`) and the code locations below were
re-checked by the orchestrator (line numbers corrected against the file).

## Verdict: confirmed

The automatic layout draws the line end in the wrong place for 5 of the 7 MSL connector ends in the test model:
`position.flange`, `prismatic.axis`, `prismatic.frame_b`, `world.frame_b` (both of its connections) and, by 2 diagram
units, `position.s_ref`. The ends that come out right (`prismatic.frame_a`, `subBody.frame_a`, the visualizers'
`frame_a`) are right only because the fallback guess happens to match. The model's own connectors are correct.

**Cause:** the tool does not read where an MSL connector is placed; it guesses an icon edge from the port name and
falls back to the left-edge midpoint `(-100, 0)` for every port it has no rule for.

## Reproduce (pure Python, no kernel)

```bash
D=<repo>/tests/bugs/wsm-schematic
cp <repo>/tests/cards/fixtures/Submarine-nographics.mo $D/Submarine.mo
B="bwrap --unshare-net --unshare-pid --die-with-parent --dev-bind / / --proc /proc"
$B wsm-toolkit schematic --file $D/Submarine.mo --analyze
$B wsm-toolkit schematic --file $D/Submarine.mo --annotate --write
$B python3 $D/check_pins.py $D/Submarine.mo      # prints drawn vs expected for every connect() end
```

Test model: System Modeler's bundled `DocumentationExamples.Control.Submarine` with its graphics annotations removed
(`tests/cards/fixtures/Submarine-nographics.mo`).

## Expected vs drawn

Every instance got `extent={{-10,-10},{10,10}}`, rotation 0, no flips, so a connector whose box centre is `(px,py)`
in the ±100 icon frame lands at `origin + 0.1*(px,py)`. MSL paths are under
`<SystemModeler-install>/15.0/L/Modelica 4.1.0/Modelica/Mechanics/`.

| End | MSL placement (file:line) | Box centre | Expected | Drawn | Result |
|---|---|---|---|---|---|
| position.s_ref | Translational/Sources/Position.mo:20-22 `{{-140,-20},{-100,20}}` | (-120,0) | (-88,0) | (-86,0) | 2 units off: box edge, not centre |
| position.flange | Translational/Interfaces/PartialElementaryOneFlangeAndSupport2.mo:12-13 `{{90,-10},{110,10}}` | (100,0) | (-66,0) | (-86,0) | wrong side (same point as s_ref) |
| prismatic.axis | MultiBody/Joints/Prismatic.mo:6-8 `{{90,50},{70,70}}` | (80,60) | (-16,-14) | (-34,-20) | wrong |
| prismatic.frame_b | MultiBody/Interfaces/PartialElementaryJoint.mo:6 `{{84,-16},{116,16}}` | (100,0) | (-14,-20) | (-34,-20) | wrong (same point as frame_a) |
| world.frame_b (2 lines) | MultiBody/package.mo:15-17 `{{84,-16},{116,16}}` | (100,0) | (34,20) | (14,20) | wrong side |
| prismatic.frame_a, subBody.frame_a, visualizers' frame_a | `{{-116,-16},{-84,16}}` | (-100,0) | = drawn | | correct (fallback matches) |

Visible effect: the `frame_b → subBody` line runs straight across the prismatic icon, the `flange → axis` line has
both ends wrong, and the `fluidSurface` line crosses the World icon.

System Modeler's own layout (the original bundled model) uses the box centres: `s_ref` at origin − 12, `flange` and
`frame_b` at origin + 10, `axis` at origin + (8, 6), matching the "Expected" column.

## Cause in the code (`annotate-modelica-graphics/Schematic/`)

1. `routing.py:34-68`, `_lib_edge()`: a name-based guess table (ground, electrical OnePort `p`/`n`, fluid ports,
   heat ports, block inputs/outputs). No rule matches `flange*`, `frame_a`/`frame_b`, `axis`, `support` or `s_ref`,
   so they reach the fallback `return "L"` (line 68).
2. `routing.py:27`, `_EDGE_PT`, used by `routing.py:82`, `_port_offset()`: the offset is always an edge midpoint,
   so a pin off the midpoint (`axis` at (80,60)) or a box that sticks out past the icon (`s_ref`, centre -120)
   cannot be represented.
3. `layout.py:164`, `_port_edge()`: the same guess decides whether to rotate a component (no effect in this model).
4. Rotation and flips are not involved (`routing.py:71`, `_rot()`, handles rotations; the tool writes no flips).

**Partly documented:** the module docstring (`routing.py:12`) and `SKILL.md:187` say library pins come from "a
heuristic table"; `SKILL.md:184` also says each line "terminates exactly on the pin", which this run shows is not
the case for MultiBody frames, translational flanges and pins away from an edge midpoint.

**Possible fix (not tested):** read each connector's `Placement` from the MSL source; a cheaper partial fix is
name rules for `frame_b`/`flange_b`/`flange` → right edge, which would still miss `axis`, `support` and protruding
boxes.

## Limits

Line end points compared with connector-box centres (no rendering); one model, rotation 0; the annotated copy was
not flattened (annotations do not affect flattening).
