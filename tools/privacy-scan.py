#!/usr/bin/env python3
"""Fail if the repository contains personal or machine-specific details.

Checks every tracked file (or every file under the given folder) for: absolute home-folder paths, Wolfram
install paths, agent scratch paths, e-mail addresses, session IDs, Wolfram licence/activation details, private
network addresses, common secret formats, and text metadata in PNG images. Run before every push; CI runs it too.

Usage: privacy-scan.py [folder]     exit 0 = clean, 1 = findings (listed)
"""
import re, struct, subprocess, sys
from pathlib import Path

CHECKS = {
    "home folder path": r"/home/(?!<)[A-Za-z0-9_.-]+/|/Users/(?!<)[A-Za-z0-9_.-]+/",
    "Wolfram install path": r"/usr/local/Wolfram/",
    "agent scratch path": r"/tmp/claude-\d+",
    "e-mail address": r"[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}",
    "session id (UUID)": r"\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b",
    "Wolfram machine id": r"\b\d{4}-\d{5}-\d{5}\b",
    "Wolfram activation key": r"\b\d{4}-\d{4}-[0-9A-Z]{6}\b",
    "Wolfram licence file": r"(?i)\bmathpass\b.*[0-9]{4}-",
    "private network address": r"\b(?:10\.\d{1,3}|192\.168|172\.(?:1[6-9]|2\d|3[01]))\.\d{1,3}\.\d{1,3}\b",
    "secret token": r"ghp_[A-Za-z0-9]{20,}|github_pat_|sk-ant-|AKIA[0-9A-Z]{16}|xox[bpa]-|-----BEGIN [A-Z ]*PRIVATE KEY",
}
ALLOWED_EMAILS = {"noreply@anthropic.com", "git@github.com",
                  # credits of JavaScript libraries bundled into WLJS HTML exports
                  "me@michelemorrone.eu", "brutpitt@gmail.com"}
ALLOWED_EMAIL_DOMAINS = ("example.com", "example.org")
UUID_OK_SUFFIXES = (".wln", ".html")  # WLJS notebooks and their HTML exports use UUIDs as cell ids

def files(root: Path):
    try:
        out = subprocess.run(["git", "-C", str(root), "ls-files", "-z"], capture_output=True, check=True).stdout
        names = [n for n in out.decode().split("\0") if n]
        if names:
            return [root / n for n in names]
    except Exception:
        pass
    return [p for p in root.rglob("*") if p.is_file() and ".git" not in p.parts]

def png_text(path: Path):
    d = path.read_bytes(); i = 8; out = []
    while i + 8 <= len(d):
        n, t = struct.unpack(">I4s", d[i:i + 8])
        if t in (b"tEXt", b"iTXt", b"zTXt"):
            out.append(d[i + 8:i + 8 + n].decode("latin-1", "replace"))
        i += 12 + n
    return "\n".join(out)

def main():
    root = Path(sys.argv[1] if len(sys.argv) > 1 else ".").resolve()
    me = Path(__file__).resolve()
    findings = []
    for p in files(root):
        if p.resolve() == me or not p.is_file():
            continue
        if p.suffix.lower() == ".png":
            text = png_text(p)
        else:
            raw = p.read_bytes()
            if b"\0" in raw[:4096]:
                findings.append((p, "binary file", "")); continue
            text = raw.decode("utf-8", "replace")
        for name, pat in CHECKS.items():
            for m in re.finditer(pat, text):
                hit = m.group(0)
                if name == "e-mail address" and (hit.lower() in ALLOWED_EMAILS or hit.lower().endswith(ALLOWED_EMAIL_DOMAINS)):
                    continue
                if name == "session id (UUID)" and p.suffix in UUID_OK_SUFFIXES:
                    continue
                line = text.count("\n", 0, m.start()) + 1
                findings.append((p, name, f"line {line}: {hit[:60]}"))
    for p, name, where in findings:
        print(f"{p.relative_to(root)}: {name} {where}")
    print(f"{len(findings)} finding(s) in {len(set(f[0] for f in findings))} file(s)" if findings else "privacy scan: clean")
    sys.exit(1 if findings else 0)

if __name__ == "__main__":
    main()
