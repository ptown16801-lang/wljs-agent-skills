#!/bin/bash
# PreToolUse hook (Bash): a non-blocking reminder when a command runs Wolfram the old way (fresh kernel).
# Adds a note to Claude's context and never blocks; the command runs normally. Owner-approved Oct 22, 2026.
cmd=$(jq -r '.tool_input.command // ""')
if printf '%s' "$cmd" | grep -qE 'wolframscript|wolfram-direct'; then
  jq -n '{hookSpecificOutput: {hookEventName: "PreToolUse", additionalContext:
    "Workflow reminder: WLJS is the default engine (load the matching skill, compute through the WLJS MCP, save results in a WLJS notebook, show them in chat). A fresh kernel (wolframscript / wolfram-direct) is only for the exceptions in ~/Documents/Claude/wljs-agent-skills/ROUTES.md; state which one applies, and keep it inside the network cut with $AllowInternet = False."}}'
fi
exit 0
