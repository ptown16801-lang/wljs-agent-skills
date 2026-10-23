# AgentTools scripts without automatic installs

Copies of five scripts from [WolframResearch/AgentTools](https://github.com/WolframResearch/AgentTools)
(commit `744d2d1`, `Assets/AgentSkills/*/scripts/`), MIT licence ([../licenses/AgentTools-LICENSE](../licenses/AgentTools-LICENSE)).
The only change in each is that its `PacletInstall` call was replaced, so running a script never downloads or
installs anything. The first line of each file names the original. `setup.sh` copies them to where the generated
skills expect them.
