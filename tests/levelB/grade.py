#!/usr/bin/env python3
"""Objective checks for a Level B run, from the agent's own session record (not its self-report).

  python3 grade.py <skill>   -> tests/runs/<DATE>/<skill>/auto-checks.json and a one-line summary

Check 1 (triggered): Skill tool calls in the record. Check 3 (rules): forbidden patterns in the agent's tool inputs.
Check 4 (notebook, partial): .wln files under the run. Checks 2, 5, 6 need the evidence read by a person/reviewer.
"""
import json, re, sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
DATE = '2026-10-22'
TASKS = Path('<tmp>/-home-<user>-Documents-Claude/<session-id>/tasks')
FORBIDDEN = {
    'wolfram server address': r'(?:https?://|\b(?:curl|wget)\s[^;&|]*?)(?:[\w-]+\.)*(?:wolfram\.com|wolframcloud\.com|wolframalpha\.com)\b',
    'internet switched on': r'\$AllowInternet\s*=\s*True|wljs-server online on',
    'paclet install / remote paclet': r'PacletInstall\[|PacletFindRemote|PacletSiteUpdate',
    'Wolfram|Alpha / cloud / resources': r'WolframAlpha\[|CloudDeploy|CloudConnect|CloudPublish|ResourceFunction\[|ResourceObject\[|ResourceSubmit|SubmitPaclet',
    'push / publish': r'git push|Artifact.*publish|claude mcp add',
}


PASSIVE = {'grep', 'egrep', 'rg', 'sed', 'awk', 'cat', 'head', 'tail', 'ls', 'find', 'echo', 'printf', 'wc', 'diff', 'sort', 'cut', 'tr'}

def active_shell(cmd):
    """Shell segments that do something: read-only text search/display segments (grep, sed, cat ...) are dropped,
    because searching FOR a word is not using it. Quote-aware; falls back to the whole command if it cannot parse."""
    import shlex
    try:
        lex = shlex.shlex(cmd, posix=True, punctuation_chars=';&|')
        lex.whitespace_split = True
        tokens = list(lex)
    except ValueError:
        return cmd
    segments, cur = [], []
    for t in tokens:
        if t in (';', '&&', '||', '|', '&', ';;'):
            segments.append(cur); cur = []
        else:
            cur.append(t)
    segments.append(cur)
    keep = []
    for seg in segments:
        words = [w for w in seg if not re.match(r'^[A-Za-z_]\w*=', w)]
        if words and words[0].split('/')[-1] in PASSIVE:
            continue
        keep.append(' '.join(seg))
    return ' ; '.join(keep)

def tool_calls(record):
    for line in record.read_text(errors='replace').splitlines():
        try: ev = json.loads(line)
        except json.JSONDecodeError: continue
        msg = ev.get('message') or {}
        for part in msg.get('content') or []:
            if isinstance(part, dict) and part.get('type') == 'tool_use':
                yield part.get('name'), json.dumps(part.get('input'))

def grade(skill):
    agent = json.loads((Path(__file__).parent / 'agents.json').read_text())[skill]
    record = TASKS / f'{agent}.output'
    calls = list(tool_calls(record))
    skills = [json.loads(i).get('skill') for n, i in calls if n == 'Skill']
    def executed(name, inp):
        """Only inputs that run something or reach the network count; text an agent writes into files does not."""
        d = json.loads(inp) if inp else {}
        if name == 'Bash':
            return active_shell(d.get('command', ''))
        if name and name.startswith('mcp__wljs'): return ' '.join(str(d.get(k, '')) for k in ('Expression', 'Content'))
        if name in ('WebFetch', 'WebSearch') or (name and 'navigate' in name): return json.dumps(d)
        if name and (name.startswith('mcp__Wolfram') or name == 'Artifact'): return name + ' ' + json.dumps(d)
        return ''
    runs = [executed(n, i) for n, i in calls]
    hits = {k: sorted({m.group(0) for i in runs for m in re.finditer(p, i)}) for k, p in FORBIDDEN.items()}
    hits['publishing tool used'] = sorted({n for n, _ in calls if n == 'Artifact' or (n or '').startswith('mcp__Wolfram')})
    run = REPO / 'tests/runs' / DATE / skill
    out = {
        'skill': skill, 'tool_calls': len(calls),
        'check1_triggered': {'pass': skill in skills, 'skills_loaded': skills},
        'check3_rules_auto': {'pass': not any(hits.values()), 'hits': {k: v for k, v in hits.items() if v}},
        'check4_notebooks_found': sorted(str(p.relative_to(run)) for p in run.rglob('*.wln')),
        'engines_seen': sorted({n for n, _ in calls if n and (n.startswith('mcp__wljs') or n.startswith('mcp__Wolfram'))} |
                               {m.group(2) for n, i in calls if n == 'Bash'
                                for m in re.finditer(r'(^|[;&|(/]\s*|\s)(wolframscript|wolfram-direct|wsm-toolkit|wljs eval|lake|latexmk|typst)\b',
                                                     json.loads(i).get('command', ''))}),
        'run_log': (run / 'run-log.md').exists(),
    }
    (run / 'auto-checks.json').write_text(json.dumps(out, indent=1))
    print(f"{skill}: skill loaded={out['check1_triggered']['pass']} {skills}; rule hits={out['check3_rules_auto']['hits'] or 'none'}; "
          f"notebooks={len(out['check4_notebooks_found'])}; engines={out['engines_seen']}; calls={len(calls)}")

for s in sys.argv[1:]: grade(s)
