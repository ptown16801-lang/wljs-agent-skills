# Dependencies installed for skill testing (TEST-PLAN.md, Phase 1)

All user-local; nothing system-wide. Owner rule 0 applies (ROUTES.md): nothing is fetched from Wolfram's servers after
Oct 22, 2026, in any form.

| Item | Version | Source | Where | Checksum (download) | Check after install | Remove |
|---|---|---|---|---|---|---|
| Wolfram/PacletCICD | 0.36.2 | Wolfram Paclet Repository (installed Oct 22 **before** rule 0) | `~/.Wolfram/Paclets/Repository/Wolfram__PacletCICD-0.36.2` | (paclet manager) | `CheckPaclet.wls` now loads and reports on a definition notebook; its report formatting then fails inside AgentTools (Phase 2 finding) | `PacletUninstall["Wolfram/PacletCICD"]` |
| AgentTools official tests | commit `744d2d1` (= pinned AgentTools) | GitHub WolframResearch/AgentTools, sparse clone of `Tests/` | `~/.local/share/wolfram-agent-skills/agenttools/tests-full-744d2d…/` | `MANIFEST.sha256` (42 files) | files present | delete the folder |
| Typst | 0.15.1 | GitHub typst/typst release, `typst-x86_64-unknown-linux-musl.tar.xz` | `~/.local/bin/typst` | `a6d077d0a95eed5a2eba715b2dae06be954f624ccbf85758a03f389ded33118c` | a one-page Typst document compiles | `rm ~/.local/bin/typst` |
| TinyTeX | v2026.10 (`TinyTeX-linux-x86_64`) | GitHub rstudio/tinytex-releases; packages from the TinyTeX/CTAN mirror | `~/.TinyTeX`, links in `~/.local/bin` (`tlmgr path add`) | `54fec1c79ab437d2d52e2f918bdb738c85779d654a93e62cc44f022e227692b5` | the test paper, journal (with biber bibliography) and research note compile to PDF | `~/.TinyTeX/bin/x86_64-linux/tlmgr path remove; rm -rf ~/.TinyTeX` |
| TeX packages added | — | `tlmgr install` | `~/.TinyTeX` | — | needed by the upstream paper template: `biblatex`, `newpx`, `tikz-cd`, `aliascnt`, `txfonts`, `newtx` (plus `tlmgr update --self`) | removed with TinyTeX |
| Lean 4 (elan), Mathlib project + cache | Lean 4.35.0 (`leanprover/lean4:stable`), Mathlib cache 9,031 files | GitHub leanprover/elan `elan-init.sh` (`a620ff16…bf53`, 377 lines, no sudo, run with `--no-modify-path`); Mathlib cache | `~/.elan`, links in `~/.local/bin`; project `tests/out/lean/LeanTest`; cache `~/.cache/mathlib` | — | `lake env lean LeanTest/Check.lean` checks two proofs (`decide`; Mathlib `sq_nonneg`): passed. Size: `~/.elan` 3.0 GB, cache 453 MB | `rm -rf ~/.elan ~/.cache/mathlib tests/out/lean; rm ~/.local/bin/{elan,lean,lake}` |
| lean-lsp-mcp | 0.31.0 | PyPI via `uvx --from lean-lsp-mcp` | uv cache; registered in Claude Code (user scope) as `lean-lsp` (`~/.claude.json`) | — | `claude mcp list`: connected. Tools appear in sessions started after Oct 22 | `claude mcp remove lean-lsp --scope user` |

## Not installed

| Item | Why |
|---|---|
| MathNotebook paclet | hosted on Wolfram Cloud: rule 0 |
| PacletPage | Wolfram Cloud resource: rule 0 |
| Hydraulic Modelica library | Wolfram download (form also broken): rule 0 |

## Desktop (not a test dependency)

| Item | Where | Purpose | Remove |
|---|---|---|---|
| GNOME Shell extension `claude-monitor2@local` (written by Claude, 1 file of code) | `~/.local/share/gnome-shell/extensions/claude-monitor2@local`; added to `org.gnome.shell enabled-extensions` | opens windows of WLJS / Mathematica / System Modeler on the second monitor (owner's request); active after the next log-in | delete the folder and remove the entry from `enabled-extensions` |
| WLJS `main.js` local patch (two parts) | `~/.local/opt/wljs/app/resources/app/Electron/main.js` (backups `main.js.orig-2026-10-22`, `main.js.bak-before-dialogs-2026-10-22`) | (1) every WLJS window opens centred on the non-primary display; (2) every native dialog gets a parent window so it opens over it on the second monitor (owner's request; the first part missed dialogs) | restore `main.js.orig-2026-10-22` |
| WLJS `RemoteCells.wl` local patch | `~/.local/opt/wljs/app/resources/app/modules/wljs-editor/src/RemoteCells.wl` (backup `.orig-2026-10-22`) | kernel-side `NotebookSave` updates the stored file hash, so WLJS no longer shows a false "File hash mismatch" dialog after each save (bug J1 in `tests/bugs/BUGS.md`); and (installed by the owner Oct 22, backup `.bak-before-J3-2026-10-22`) it syncs the window's graphics into the file before writing, so plots survive a restart (bug J3) | restore the `.orig` file |
| WLJS `wljs-api` local patch (J4; installed by the owner Oct 22, verified) | `~/.local/opt/wljs/app/resources/app/modules/wljs-api/src/Frontend.wl` (original saved as `tests/bugs/wljs-api-events/Frontend.wl.orig`) | notebooks created through the API/MCP get the extensions' listeners (graphics sync, TOC, print redirect) (bug J4) | copy `Frontend.wl.orig` back |

## Local patches to vendored Wolfram material (Oct 22, 2026; each changed file has a `.orig-2026-10-22` backup beside it)

| Bug | Vendored copy | Diff | Undo |
|---|---|---|---|
| W5 `FailedAssertions` count | `~/.local/share/wolfram-agent-skills/agenttools/744d2d1.../wolfram-debugging/scripts/WolframDebugging.wl` | `patches/W5-failedassertions.diff` | copy the `.orig-2026-10-22` file back |
| W4 System Modeler toolkit diagram pins | `~/.local/share/wolfram-system-modeler-ai-toolkit/991a800.../annotate-modelica-graphics/` (6 files incl. new `Schematic/libpins.py`) | `patches/W4-wsm-toolkit-pins.diff` | copy the `.orig-2026-10-22` files back; delete `libpins.py` |
| I1-I5 MarkdownToNotebook examples/converter | `~/.local/share/wolfram-agent-skills/markdown-to-notebook/4d1e139.../` | `patches/I1...I5-*.diff` | copy each `.orig-2026-10-22` file back |

The vendored copies' `MANIFEST.sha256` files were left unchanged on purpose, so the edits stay visible.
