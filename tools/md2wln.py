#!/usr/bin/env python3
"""Convert a house-style Markdown notebook source to a WLJS notebook (.wln), without a window.

Prose blocks become `.md` cells (input hidden, its rendered markdown stored as the output, so prose shows on open);
```wolfram / ```wl / ```mathematica fences become Input cells, unevaluated. An HTML comment at the top (a
provenance back-pointer) becomes a hidden `.md` cell of its own. Heading `#`/`##` lines start a new prose cell.

Usage: md2wln.py source.md target.wln   (refuses to overwrite target)
Format: the text layout WLJS 3.1.4 writes (checked against notebooks saved by NotebookSave).
"""
import re
import sys
from pathlib import Path

RULE = '%' + '-' * 73 + '%'
HEADER = ('%-------------------------------%Notebook%--------------------------------%\n'
          'HaveToSaveAs: false\nObjectFields:\nQuick: false\n' + RULE + '\n\n\n'
          '%---------------------------------%Cells%---------------------------------%\n')
FOOTER = '%------------------------------%EndOfCells%-------------------------------%\n' + '\n' * 5 + \
    '%-----------------------------%EndOfNotebook%-----------------------------%'
CODE_FENCE = re.compile(r'^```(wolfram|wl|mathematica)\s*$')


def blocks(text):
    """Yield ('md', text) and ('code', text) blocks in document order."""
    lines, prose, i = text.split('\n'), [], 0

    def flush():
        body = '\n'.join(prose).strip('\n')
        prose.clear()
        return [('md', body)] if body.strip() else []

    while i < len(lines):
        line = lines[i]
        if CODE_FENCE.match(line):
            yield from flush()
            j = i + 1
            while j < len(lines) and lines[j].strip() != '```':
                j += 1
            yield ('code', '\n'.join(lines[i + 1:j]))
            i = j + 1
            continue
        if line.startswith('<!--') and not prose:
            j = i
            while '-->' not in lines[j]:
                j += 1
            yield ('md', '\n'.join(lines[i:j + 1]))
            i = j + 1
            continue
        if re.match(r'^#{1,2} ', line) and prose:
            yield from flush()
        prose.append(line)
        i += 1
    yield from flush()


def cell(kind, body):
    """Cell records, without the separator lines between them."""
    if kind == 'code':
        return [f'Props:\n  Hidden: false\nType: Input\n{RULE}\n{body}\n\n']
    return [f'Props:\n  Hidden: true\nType: Input\n{RULE}\n.md\n{body}\n\n',
            f'Display: markdown\nType: Output\n{RULE}\n{body}\n\n']


def main(source, target):
    target = Path(target)
    if target.exists():
        sys.exit(f'refusing to overwrite {target}')
    text = Path(source).read_text()
    records = [r for k, b in blocks(text) for r in cell(k, b)]
    target.write_text(HEADER + (RULE + '\n').join(records) + FOOTER)
    print(f'wrote {target}')


if __name__ == '__main__':
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(*sys.argv[1:])
