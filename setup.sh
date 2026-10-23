#!/usr/bin/env bash
# Fetch the upstream skill sources at the exact commits this repo was built and tested against, then generate the
# local skills. Everything is fetched from GitHub; nothing is installed system-wide and no Wolfram server is contacted.
#
#   ./setup.sh                 fetch upstreams, copy the no-install AgentTools scripts, run build.mjs
#   ./setup.sh --apply-patches also apply this repo's fixes (patches/) to the fetched copies
#
# Locations (override with environment variables; build.mjs reads the same ones):
#   WOLFRAM_SKILLS_SRC  default ~/.local/share/wolfram-agent-skills
#   WSM_TOOLKIT_SRC     default ~/.local/share/wolfram-system-modeler-ai-toolkit
#   WLJS_APP            default ~/.local/opt/wljs/app  (WLJS Notebook 3.1.4, installed separately: https://wljs.io)
# Requires git, node (18+) and patch; Wolfram Mathematica / System Modeler 15.0 to run the skills.
set -euo pipefail
REPO="$(cd "$(dirname "$0")" && pwd)"
SKILLS_HOME="${WOLFRAM_SKILLS_SRC:-$HOME/.local/share/wolfram-agent-skills}"
WSM_HOME="${WSM_TOOLKIT_SRC:-$HOME/.local/share/wolfram-system-modeler-ai-toolkit}"
WLJS_APP="${WLJS_APP:-$HOME/.local/opt/wljs/app}"
APPLY_PATCHES=0
[[ "${1:-}" == "--apply-patches" ]] && APPLY_PATCHES=1

# fetch <github owner/repo> <commit> <destination> [subfolder to keep]
fetch() {
  local repo="$1" rev="$2" dest="$3" sub="${4:-}"
  if [[ -e "$dest" ]]; then echo "present: $dest"; return; fi
  local tmp; tmp="$(mktemp -d)"
  git -C "$tmp" init -q
  git -C "$tmp" fetch -q --depth 1 "https://github.com/$repo.git" "$rev"
  git -C "$tmp" checkout -q FETCH_HEAD
  mkdir -p "$(dirname "$dest")"
  if [[ -n "$sub" ]]; then cp -r "$tmp/$sub" "$dest"; else rm -rf "$tmp/.git"; cp -r "$tmp" "$dest"; fi
  printf 'repository https://github.com/%s %srevision %s fetched %s\n' "$repo" "${sub:+path $sub }" "$rev" "$(date +%F)" > "$dest/SOURCE.txt"
  rm -rf "$tmp"
  echo "fetched: $repo@${rev:0:7} -> $dest"
}

fetch WolframResearch/AgentTools 744d2d154871adcd2cec2ebfcf30a5eb8f65b8dd \
  "$SKILLS_HOME/agenttools/744d2d154871adcd2cec2ebfcf30a5eb8f65b8dd" Assets/AgentSkills
fetch WolframResearch/skills 359f7770bdc49be4390669f9f96d0afd6822d88c \
  "$SKILLS_HOME/wolfram-skills/359f7770bdc49be4390669f9f96d0afd6822d88c"
fetch WolframResearch/system-modeler-ai-toolkit 991a80001b819b98e9484d26ff5e650657449d6a \
  "$WSM_HOME/991a80001b819b98e9484d26ff5e650657449d6a"
fetch WolframInstitute/ClaudePluginComputationalResearch 82d9e00d97c5cd08ee302913618ea8ac3060b615 \
  "$SKILLS_HOME/wolfram-institute/82d9e00d97c5cd08ee302913618ea8ac3060b615"
fetch WolframInstitute/MarkdownToNotebook 4d1e13918c464b89a72ee47d97f49d5d9efd52b5 \
  "$SKILLS_HOME/markdown-to-notebook/4d1e13918c464b89a72ee47d97f49d5d9efd52b5"

mkdir -p "$SKILLS_HOME/agenttools/local-scripts"
cp "$REPO"/third_party/agenttools-local-scripts/*.wls "$SKILLS_HOME/agenttools/local-scripts/"

if [[ $APPLY_PATCHES == 1 ]]; then
  # apply <patch> <directory> <strip level>; skipped if already applied
  apply() {
    if patch -d "$2" -p"$3" -R --dry-run -s -f < "$1" >/dev/null 2>&1; then echo "already applied: $(basename "$1")"
    else patch -d "$2" -p"$3" -s -f -b -z .orig < "$1" && echo "applied: $(basename "$1")"; fi
  }
  apply "$REPO/patches/W4-wsm-toolkit-pins.diff" "$WSM_HOME/991a80001b819b98e9484d26ff5e650657449d6a" 0
  apply "$REPO/patches/W5-failedassertions.diff" "$SKILLS_HOME/agenttools/744d2d154871adcd2cec2ebfcf30a5eb8f65b8dd" 1
  for p in "$REPO"/patches/I[1-5]-*.diff; do
    apply "$p" "$SKILLS_HOME/markdown-to-notebook/4d1e13918c464b89a72ee47d97f49d5d9efd52b5" 1
  done
fi

if [[ ! -d "$WLJS_APP/resources/app/modules/wljs-api/mcp/dist/skills" ]]; then
  echo "WLJS not found at $WLJS_APP: install WLJS Notebook 3.1.4 (https://wljs.io) or set WLJS_APP, then run: node build.mjs"
  exit 0
fi
WOLFRAM_SKILLS_SRC="$SKILLS_HOME" WSM_TOOLKIT_SRC="$WSM_HOME" WLJS_APP="$WLJS_APP" node "$REPO/build.mjs"
echo "Done. Link the skills into Claude Code with: ln -s \"$REPO\"/skills/* ~/.claude/skills/"
