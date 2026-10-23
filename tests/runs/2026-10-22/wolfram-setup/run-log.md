# Run log: wolfram-setup (2026-10-22)

Request: "Is my Wolfram setup working for AI coding? Check what is installed and whether you can evaluate Wolfram code, but don't change anything."

## 1. Skills used

1. `wolfram-setup` (local WLJS adaptation; followed its pointers to `ROUTES.md` and the pinned upstream `SKILL.md` plus `references/get-wolfram-engine.md` and `references/setup-mcp-server.md`)

## 2. Steps

1. Loaded the skill. Read `<repo>/ROUTES.md`, the upstream `SKILL.md` and both reference files. The upstream skill installs, activates and configures things. I used only its diagnostic part (Step 2A and the Step 5 check): no installs, activation or MCP config edits.
2. Shell checks (no Wolfram evaluation):
   - `which -a`: `wolframscript` (/usr/bin, links to `/opt/Wolfram/WolframScript/bin/wolframscript`), `wolfram`, `WolframKernel`, `math` (/usr/local/bin), `wljs`, `wljs-server`, `wolfram-direct`, `wsm-toolkit` (~/.local/bin).
   - `wolframscript -version`: WolframScript 1.14.0. Read `~/.config/Wolfram/WolframScript/WolframScript.conf` (the KERNELPATH line is commented out, so the default kernel is used).
   - Install folders: `<Wolfram-install>/15.0`, `<WolframEngine-install>/15.0`, `<SystemModeler-install>/15.0` (bin has ModelCenter, SimulationCenter, SessionManager, WSMKernelX).
   - Paclets in `~/.Wolfram/Paclets/Repository` (folder listing): Wolfram__AgentTools-2.2.0, Wolfram__Parser-1.3.1, Wolfram__PacletCICD-0.36.2, GrammaticalParser-0.1.
   - Read the MCP configurations without changing them, with env and header values left out of the output (`~/.claude.json`, `~/.config/Claude/claude_desktop_config.json`, `~/.claude/settings.json`, project `.mcp.json` files: there are none). I did not run `claude mcp list`, because its health check would also connect to the configured servers.
   - `wljs status` / `wljs-server status`: server `http://127.0.0.1:20560` ready, kernel 001 "shekel", no open notebooks. WLJS app `package.json` version 3.1.4. `wsm-toolkit help` answers (toolkit pinned at 991a800).
3. Wolfram evaluations:
   - **WLJS kernel via `mcp__wljs__kernel_evaluate`** (2 calls). I used it because it is the default route (ROUTES.md) and because it tests the WLJS MCP connection that AI coding in Claude Code relies on. Call 1 checked `$AllowInternet`, `$Version`, `$InstallationDirectory`, `Internal`Kernel`WLJSQ`, whether a license ID is present, `Expand[(x+1)^5]` and `PacletFind["Wolfram/AgentTools"]`. Call 2 listed the AgentTools paclet locations and removed the one helper symbol call 1 had left in Global (`Global`x$local`). I confirmed it was gone and `$AllowInternet` was still False. No global settings were changed.
   - **Fresh kernel via `wolfram-direct`** (`WolframLanguageEvaluator`, network blocked). I used it to check that a clean standalone kernel and the AgentTools evaluator work outside WLJS. The request file was in the session scratchpad. Run record: `~/.local/state/wolfram-agenttools-direct/runs/run-9i32g0e0` (wolfram-direct writes this record automatically).
   - **wolframscript, fresh kernel, inside `bwrap --unshare-net`** (network blocked). This is the skill's own smoke test (`Print[$InstallationDirectory]; Print[$Version]` plus `1+1`), with `$AllowInternet = False` set first. I ran it in a network sandbox because a plain `wolframscript` call is not network-blocked.
4. I did not call any `mcp__Wolfram__*` tool, the second Wolfram connector (`mcp__dd3a913a-...__Wolfram*`, which appears to be a hosted Wolfram connector), `mcp__wljs__wolfram_alpha` or `mcp__wljs__search_wolfram_docs`. The hosted connector and Wolfram|Alpha would contact Wolfram's servers, and the local `Wolfram` MCP server's kernel is not network-sandboxed, so I could not guarantee `$AllowInternet = False` there.

## 3. Files

- Created: `<repo>/tests/runs/2026-10-22/wolfram-setup/run-log.md` (this file)
- Created (scratch, outside the work folder): `<scratch>/req.json` (wolfram-direct request)
- Created automatically by wolfram-direct: `~/.local/state/wolfram-agenttools-direct/runs/run-9i32g0e0/` (run record)
- Nothing else was created or changed. The work folder `.../wolfram-setup/work` is still empty.

## 4. WLJS notebook

none. The local rules say results go in a WLJS notebook, but `mcp__wljs__new_notebook` opens a notebook window in the running WLJS app. The ground rules forbid opening windows, and the user asked for nothing to be changed, so results came from `kernel_evaluate` instead.

## 5. Answer

Yes. Your Wolfram setup works for AI coding, and I changed nothing.

- **Installed:** Mathematica / Wolfram 15.0.0 (Linux x86-64, May 19 2026) at `<Wolfram-install>/15.0`, plus Wolfram Engine 15.0 and System Modeler 15.0. WolframScript 1.14.0 is on PATH. Paclets: AgentTools 2.2.0 (the built-in 2.1.17 is also present), Parser 1.3.1, PacletCICD 0.36.2. WLJS 3.1.4 and the pinned System Modeler toolkit (`wsm-toolkit`) are installed.
- **Licensed and running:** every kernel I started reported a license, and `1+1` returned `2`.
- **Evaluation works on all three local routes:** the WLJS kernel through the WLJS MCP tools, a fresh kernel with no network (`wolfram-direct`), and `wolframscript` itself. `Expand[(x+1)^5]` returned `1 + 5x + 10x^2 + 10x^3 + 5x^4 + x^5`. `$AllowInternet` was `False` in every kernel.
- **Claude Code MCP setup (user scope):** `wljs` (WLJS's own MCP server at `http://127.0.0.1:20564/`) is connected and answering. `Wolfram` is the local AgentTools server, started from the Mathematica 15.0 kernel. Its tools are listed in this session, but I did not call them, because that kernel is not network-sandboxed. Claude Desktop only has the `coherence-panels-selftest` server configured.

Nothing needs installing or fixing for AI coding.

## 6. Problems

- No failures. The WLJS kernel calls returned no messages.
- In the WLJS kernel, `PacletFind["Wolfram/AgentTools"]` finds a test build first: `~/.local/share/wolfram-agent-skills/agenttools/tests-release-9c99e2da5286c2ff7ac2298956107cd9334c6e90/build/Wolfram__AgentTools` (2.2.0). It comes ahead of the installed 2.2.0 and the built-in 2.1.17, so it has probably been attached to the shared kernel by another session or a test. A fresh kernel finds only the installed 2.2.0 and the built-in 2.1.17. This is not a problem as long as the test build matches the release. I left it alone, because the kernel is shared.
- ROUTES.md says the Wolfram/PacletCICD paclet "is not installed", but `~/.Wolfram/Paclets/Repository/Wolfram__PacletCICD-0.36.2` exists. I did not check whether it loads. ROUTES.md may need updating.
- My first call left a helper symbol (`Global`x$local`) in the shared WLJS kernel. I removed it in the next call and confirmed it was gone.
- In the wolfram-direct call I asked for `$ProductIDName`, which is not a real symbol, so it came back unevaluated. That was my mistake, not a setup problem.
- I did not test the local `Wolfram` MCP server's tools (see Steps 4) or WLJS docs search. ROUTES.md says WLJS docs search returns "No results" for every topic, and testing it could reach wljs.io.
- I did not open the WLJS notebook view that the local rules ask for (see section 4).
- I left `~/.claude.json` and the Claude Desktop config untouched. I printed only server names, commands and URLs, and kept env values out of the output. The env values of the local `Wolfram` server are paths only.
