#!/usr/bin/env python3
"""Fail if a Markdown file links to a repository file that does not exist (relative links only)."""
import re, subprocess, sys
from pathlib import Path

root = Path(sys.argv[1] if len(sys.argv) > 1 else ".").resolve()
bad = 0
try:
    names = subprocess.run(["git", "-C", str(root), "ls-files", "*.md"], capture_output=True, check=True,
                           text=True).stdout.split()
except Exception:
    names = []
mds = [root / n for n in names] or [p for p in root.rglob("*.md") if ".git" not in p.parts]
for md in mds:
    if "tests/runs/" in md.as_posix() or not md.exists():  # run logs quote paths from the run, not repo links
        continue
    for target in re.findall(r"\]\(([^)\s]+)\)", md.read_text(encoding="utf-8", errors="replace")):
        if re.match(r"[a-z]+:|#|<", target) or not re.search(r"[./]", target):  # URLs, anchors, symbol refs
            continue
        path = (md.parent / target.split("#")[0]).resolve()
        if not path.exists():
            print(f"{md.relative_to(root)}: broken link {target}"); bad += 1
print("links: ok" if not bad else f"{bad} broken link(s)")
sys.exit(1 if bad else 0)
