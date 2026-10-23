#!/usr/bin/env python3
"""Make the Submarine test fixture from your own System Modeler install.

The model belongs to Wolfram (DocumentationExamples.Control.Submarine), so it is not shipped in this repo.
This copies it from your install and removes its graphics annotations (Placement, Line, Icon, Diagram ...),
giving the text-only model the annotate-modelica-graphics tests start from.

Usage: make-submarine-fixture.py [SystemModeler-install] [output]
  default install: $WSM_INSTALL or the newest <SystemModeler-install>/<version>
  default output:  tests/cards/fixtures/Submarine-nographics.mo
"""
import glob, os, re, sys  # noqa: F401
from pathlib import Path

GRAPHIC = ("Placement", "Line", "Icon", "Diagram", "IconMap", "DiagramMap")

def split_top(s: str):
    """Split an annotation's contents at top-level commas (outside brackets and strings)."""
    parts, depth, cur, q = [], 0, [], False
    for ch in s:
        if ch == '"':
            q = not q
        elif not q and ch in "({[":
            depth += 1
        elif not q and ch in ")}]":
            depth -= 1
        if ch == "," and depth == 0 and not q:
            parts.append("".join(cur)); cur = []
        else:
            cur.append(ch)
    parts.append("".join(cur))
    return [x for x in parts if x.strip()]

def strip_graphics(src: str) -> str:
    """Remove graphical entries from every annotation(...); drop annotations left empty."""
    out, i = [], 0
    for m in __import__("re").finditer(r"\bannotation\s*\(", src):
        if m.start() < i:
            continue
        depth, j, q = 1, m.end(), False
        while depth and j < len(src):
            ch = src[j]
            if ch == '"':
                q = not q
            elif not q:
                depth += {"(": 1, ")": -1}.get(ch, 0)
            j += 1
        args = split_top(src[m.end():j - 1])
        keep = [a for a in args if a.strip().split("(")[0].strip() not in GRAPHIC]
        if len(keep) == len(args):
            continue
        if keep:
            out.append(src[i:m.start()] + "annotation(" + ",".join(keep).strip() + ")"); i = j
        else:
            k = m.start()
            while k > i and src[k - 1] in " \t\n":
                k -= 1
            out.append(src[i:k]); i = j
            if src[k - 1:k] == ";":  # a class-level "annotation(...);" statement: drop its ';' too
                n = j
                while n < len(src) and src[n] in " \t":
                    n += 1
                if src[n:n + 1] == ";":
                    i = n + 1
    out.append(src[i:])
    return "".join(out)

def main():
    repo = Path(__file__).resolve().parent.parent
    install = (sys.argv[1] if len(sys.argv) > 1 else "") or os.environ.get("WSM_INSTALL") or \
        (sorted(glob.glob("<SystemModeler-install>/*")) or [""])[-1]
    src = Path(install) / "L/DocumentationExamples/Control/Submarine.mo"
    dst = Path(sys.argv[2]) if len(sys.argv) > 2 else repo / "tests/cards/fixtures/Submarine-nographics.mo"
    if not src.is_file():
        sys.exit(f"Not found: {src}\nPass your System Modeler install folder as the first argument.")
    text = re.sub(r"^\s*within [^;]*;\s*", "", src.read_text(encoding="utf-8"))
    dst.write_text(strip_graphics(text), encoding="utf-8")
    print(f"wrote {dst}")

if __name__ == "__main__":
    main()
