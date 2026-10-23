"""Compare every connect() Line end point written by `wsm-toolkit schematic` with the
connector's true position: MSL connector Placement centre (icon frame, +-100) mapped through
the instance Placement the toolkit wrote. Read-only; pure Python; no network.

Usage: python3 check_pins.py Submarine.mo
"""
import re
import sys

# Connector centres in the component's icon coordinate system ({{-100,-100},{100,100}} for
# all classes below). Source: MSL 4.1.0 under <SystemModeler-install>/15.0/L/.
MSL = "<SystemModeler-install>/15.0/L/Modelica 4.1.0/Modelica/Mechanics/"
PINS = {
    ("Modelica.Mechanics.Translational.Sources.Position", "s_ref"):
        ((-140, -20, -100, 20),"Translational/Sources/Position.mo:20-22"),
    ("Modelica.Mechanics.Translational.Sources.Position", "flange"):
        ((90, -10, 110, 10), "Translational/Interfaces/PartialElementaryOneFlangeAndSupport2.mo:12-13"),
    ("Modelica.Mechanics.MultiBody.Joints.Prismatic", "axis"):
        ((90, 50, 70, 70), "MultiBody/Joints/Prismatic.mo:6-8"),
    ("Modelica.Mechanics.MultiBody.Joints.Prismatic", "frame_a"):
        ((-116, -16, -84, 16), "MultiBody/Interfaces/PartialElementaryJoint.mo:5"),
    ("Modelica.Mechanics.MultiBody.Joints.Prismatic", "frame_b"):
        ((84, -16, 116, 16), "MultiBody/Interfaces/PartialElementaryJoint.mo:6"),
    ("Modelica.Mechanics.MultiBody.World", "frame_b"):
        ((84, -16, 116, 16), "MultiBody/package.mo:15-17"),
    ("Modelica.Mechanics.MultiBody.Parts.Body", "frame_a"):
        ((-116, -16, -84, 16), "MultiBody/Parts/Body.mo:9-11"),
    ("Modelica.Mechanics.MultiBody.Visualizers.Rectangle", "frame_a"):
        ((-116, -16, -84, 16), "MultiBody/Interfaces/PartialVisualizer.mo:5"),
    ("Modelica.Mechanics.MultiBody.Visualizers.FixedShape", "frame_a"):
        ((-116, -16, -84, 16), "MultiBody/Interfaces/PartialVisualizer.mo:5"),
}

text = open(sys.argv[1], encoding="utf-8").read()
top = text[text.index("end BuoyancyDynamics;"):]          # the Submarine class body

num = r"(-?\d+(?:\.\d+)?)"
inst = {}
for m in re.finditer(r"\n\s*(?:inner\s+)?([\w.]+)\s+(\w+)\b[^\n]*?annotation\(Placement\("
                     r"transformation\(extent=\{\{" + num + "," + num + r"\},\{" + num + "," + num +
                     r"\}\}(?:, origin=\{" + num + "," + num + r"\}, rotation=" + num + r")?\)",
                     top):
    typ, name, x1, y1, x2, y2, ox, oy, rot = m.groups()
    inst[name] = dict(type=typ, ext=tuple(map(float, (x1, y1, x2, y2))),
                      origin=(float(ox or 0), float(oy or 0)), rot=float(rot or 0))


def class_connector_centre(name):
    x1, y1, x2, y2 = inst[name]["ext"]
    return ((x1 + x2) / 2, (y1 + y2) / 2), "diagram Placement of class connector"


def instance_pin(name, port):
    i = inst[name]
    key = (i["type"], port)
    if key not in PINS:
        return None, "no MSL table entry (in-file class)"
    (cx1, cy1, cx2, cy2), src = PINS[key]
    px, py = (cx1 + cx2) / 2, (cy1 + cy2) / 2         # connector centre, icon frame
    x1, y1, x2, y2 = i["ext"]
    sx, sy = (x2 - x1) / 200.0, (y2 - y1) / 200.0     # icon frame 200 wide -> instance extent
    cx, cy = (x1 + x2) / 2, (y1 + y2) / 2             # extent centre (0,0 here)
    lx, ly = cx + px * sx, cy + py * sy               # flips would be negative sx/sy
    assert i["rot"] == 0, "rotation not handled in this checker (none occur here)"
    ox, oy = i["origin"]
    return (ox + lx, oy + ly), "%s centre (%g,%g) -> origin (%g,%g) + (%g*%g, %g*%g)" % (
        src, px, py, ox, oy, px, sx, py, sy)


rows = []
for m in re.finditer(r"connect\(([\w.]+),\s*([\w.]+)\)\s*annotation\(Line\(points=\{(.*?)\}, color",
                     top):
    a, b, pts = m.groups()
    pts = [tuple(map(float, p.split(","))) for p in re.findall(r"\{(-?[\d.]+,-?[\d.]+)\}", pts)]
    for end, drawn in ((a, pts[0]), (b, pts[-1])):
        if "." in end:
            n, p = end.split(".", 1)
            exp, how = instance_pin(n, p)
        else:
            exp, how = class_connector_centre(end)
        ok = "n/a" if exp is None else ("OK" if exp == drawn else "WRONG")
        rows.append((m.group(0).split(")")[0] + ")", end, drawn, exp, ok, how))

for r in rows:
    conn, end, drawn, exp, ok, how = r
    print("%-48s %-22s drawn=%-14s expected=%-14s %-5s %s" % (
        conn, end, "(%g,%g)" % drawn, "-" if exp is None else "(%g,%g)" % exp, ok, how))
