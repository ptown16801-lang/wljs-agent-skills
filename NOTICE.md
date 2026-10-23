# Third-party notices

This repository's own code and documentation are under the [MIT License](LICENSE). It builds on the projects
below. Each is used at the exact commit listed; `setup.sh` fetches them from GitHub.

| Project | Commit / version | Licence | In this repo |
|---|---|---|---|
| [WolframResearch/system-modeler-ai-toolkit](https://github.com/WolframResearch/system-modeler-ai-toolkit) | `991a800` | MIT, © Wolfram Research ([licence](third_party/licenses/system-modeler-ai-toolkit-LICENSE)) | 12 generated skills in `skills/` (descriptions quoted from upstream); fix `patches/W4-*` |
| [WolframResearch/AgentTools](https://github.com/WolframResearch/AgentTools) (`Assets/AgentSkills`) | `744d2d1` | MIT, © Wolfram Research ([licence](third_party/licenses/AgentTools-LICENSE)) | 5 generated skills; 5 scripts with installs removed (`third_party/agenttools-local-scripts/`); fix `patches/W5-*` |
| [WolframResearch/skills](https://github.com/WolframResearch/skills) | `359f777` | MIT, © Wolfram Research ([licence](third_party/licenses/WolframResearch-skills-LICENSE)) | 2 generated skills |
| [WolframInstitute/ClaudePluginComputationalResearch](https://github.com/WolframInstitute/ClaudePluginComputationalResearch) | `82d9e00` (plugin 6.0.0) | `plugin.json` declares MIT; the repository has no LICENSE file | none: its 27 skills are generated locally after `setup.sh` |
| [WolframInstitute/MarkdownToNotebook](https://github.com/WolframInstitute/MarkdownToNotebook) | `4d1e139` | no licence file found | none: its 12 skills are generated locally; fixes `patches/I1-*` … `I5-*` are small diffs applied to your own copy |
| [WLJS Notebook](https://github.com/JerryI/wolfram-js-frontend) bundled guides | 3.1.4 | AGPL-3.0 with a Wolfram Engine interop permission | none: its 11 guide skills are generated locally from your WLJS install |

Not included and not redistributed: Wolfram Mathematica, Wolfram System Modeler, the Wolfram Engine and their
example files (for instance the Submarine model, which `tools/make-submarine-fixture.py` reads from your own
install). You need your own licensed copies to run the skills.

"Wolfram", "Mathematica" and "System Modeler" are trademarks of Wolfram Research, Inc. This project is independent
and not affiliated with or endorsed by Wolfram Research or the Wolfram Institute.
