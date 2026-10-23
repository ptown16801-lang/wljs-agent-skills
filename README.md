# Wolfram agent skills on WLJS

**70 Wolfram agent skills, including the System Modeler AI toolkit, adapted to run against a local
[WLJS Notebook](https://wljs.io) from Claude Code, tested one by one, with 14 defects found and documented.**

**Live showcase:** https://ptown16801-lang.github.io/wljs-agent-skills/ · [a System Modeler notebook exported from WLJS](https://ptown16801-lang.github.io/wljs-agent-skills/notebooks/system-modeler-in-wljs.html)

![tests](https://img.shields.io/badge/skills%20tested-70-blue) ![works](https://img.shields.io/badge/works-60%2F70-brightgreen) ![license](https://img.shields.io/badge/license-MIT-lightgrey)

Wolfram publishes agent skills that assume the Wolfram MCP server and Mathematica `.nb` notebooks. WLJS is an
open-source, browser-based notebook for Wolfram Language with live, interactive graphics. This project adds the
missing layer: where each skill's work runs on a computer that uses WLJS, what changes from Mathematica, and which
actions need the user's approval. The upstream skills stay unedited and pinned; every adaptation is generated from
one table. When this started (Oct 21, 2026) no published port of Wolfram's agent skills to WLJS was found.

## Highlights
- **System Modeler without the System Modeler app.** Simulate, validate, diagnose and plot Modelica models inside the
  WLJS kernel; add graphics, stored-plot, 3D-animation and control-panel annotations; render diagrams to images.
  See "Seeing System Modeler visuals" in [ROUTES.md](ROUTES.md#starting-and-checking-wljs).
- **One source of truth.** [`build.mjs`](build.mjs) generates all 70 skills, the [skills catalogue](docs/SKILLS.md)
  and the [test results](tests/RESULTS.md) from the same table and evidence.
- **Tested in three levels.** Official suites, then each skill invoked by a fresh agent on Wolfram's own example
  material (six checks), then independent review. Result: 59 works, 1 works with fixes, 6 limited, 4 not tested.
- **Defects found and fixed.** 14 defects in Wolfram products, the System Modeler toolkit, WLJS and Wolfram
  Institute material, each reproduced by hand; patches where a local fix exists ([summary](docs/BUGS.md)).
- **Offline and gated.** Kernels run with internet off; installs, publishing and network use need the user's OK.

## Quick start
Requirements: Linux, Wolfram Mathematica 15.0 (System Modeler 15.0 for the Modelica skills),
[WLJS Notebook 3.1.4](https://wljs.io), Node 18+, git, Claude Code.

```bash
git clone https://github.com/ptown16801-lang/wljs-agent-skills.git
cd wljs-agent-skills
./setup.sh --apply-patches        # fetch the pinned upstreams from GitHub, apply the fixes, generate the skills
ln -s "$PWD"/skills/* ~/.claude/skills/
```

Then ask Claude Code something like "simulate this Modelica model and plot x and y"; the matching skill loads, runs
the work in the WLJS kernel and shows the result in a WLJS notebook.

## Repository layout
| Path | What it is |
|---|---|
| [`ROUTES.md`](ROUTES.md) | The guide every skill points to: execution routes, local rules, Mathematica → WLJS translation |
| [`build.mjs`](build.mjs) | Generates `skills/`, `docs/SKILLS.md` and `tests/RESULTS.md` from one table |
| [`skills/`](skills) | Generated skills whose upstream is MIT (19); `setup.sh` generates 50 more locally (one, from a private project, is not included) |
| [`showcase/`](showcase) | A one-page visual summary (`showcase/index.html`) with the key results |
| [`docs/`](docs) | [Skills catalogue](docs/SKILLS.md), [defects](docs/BUGS.md), [how it was built](docs/HOW-IT-WAS-BUILT.md) |
| [`tools/`](tools) | `wljs` CLI for the WLJS HTTP API, `wljs-server` (headless WLJS), `wljs-export-bridge.js` (HTML export without the desktop dialogs), privacy scan, helpers |
| [`patches/`](patches) | Fixes for upstream defects, applied by `setup.sh --apply-patches` |
| [`tests/`](tests) | Test plan, cards, run logs, independent reviews, Modelica test models, bug reproductions |
| [`third_party/`](third_party) | Upstream licences and the AgentTools scripts with automatic installs removed |

## Skill sources
| Source | Skills | Licence |
|---|---|---|
| [Wolfram System Modeler AI Toolkit](https://github.com/WolframResearch/system-modeler-ai-toolkit) | 12 | MIT |
| [WolframResearch/AgentTools](https://github.com/WolframResearch/AgentTools) `Assets/AgentSkills` | 5 | MIT |
| [WolframResearch/skills](https://github.com/WolframResearch/skills) | 2 | MIT |
| [WolframInstitute/ClaudePluginComputationalResearch](https://github.com/WolframInstitute/ClaudePluginComputationalResearch) 6.0.0 | 27 | MIT (declared) |
| [WolframInstitute/MarkdownToNotebook](https://github.com/WolframInstitute/MarkdownToNotebook) authoring skills | 12 | none found |
| WLJS 3.1.4 bundled guides | 11 | AGPL-3.0 |
| `wolfram-investigation` (separate project) | 1 | not included |

Exact commits and what is included are in [NOTICE.md](NOTICE.md).

## Verified environment
Ubuntu 24.04, Mathematica 15.0, System Modeler 15.0, WLJS 3.1.4 (desktop and headless), Node 24. In the WLJS kernel:
`Trace`, `CodeInspector`, Wolfram's debugging helpers and `SystemModelSimulate` work; with internet off, `URLRead`
and `WolframAlpha` are blocked as intended; a `Manipulate` created through `wljs` renders live.

## License
MIT for this project's code and documentation ([LICENSE](LICENSE)). Upstream projects keep their own licences
([NOTICE.md](NOTICE.md)). Not affiliated with Wolfram Research or the Wolfram Institute.
