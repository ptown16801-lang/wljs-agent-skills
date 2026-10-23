#!/usr/bin/env bash
# wljs-server: start, stop or check a headless WLJS Notebook server on this computer (127.0.0.1 only).
# The server is WLJS's own Scripts/start.wls run by wolframscript, without the Electron window.
# Open notebooks at http://127.0.0.1:20560 in any browser (or the Claude desktop browser pane).
set -euo pipefail
APP="${WLJS_APP:-$HOME/.local/opt/wljs/app/resources/app}"
STATE="${XDG_STATE_HOME:-$HOME/.local/state}/wljs"
PIDFILE="$STATE/server.pid"
LOG="$STATE/server.log"
mkdir -p "$STATE"

ports() { ss -ltnp 2>/dev/null | grep -E '127\.0\.0\.1:(20559|20560|20563|20564)\b' || true; }
ready() { wljs call ready/ >/dev/null 2>&1; }

case "${1:-status}" in
  start)
    if ready; then echo "WLJS already running at http://127.0.0.1:20560"; exit 0; fi
    [ -f "$APP/Scripts/start.wls" ] || { echo "WLJS not found at $APP"; exit 1; }
    cd "$APP"
    setsid nohup wolframscript -f Scripts/start.wls >"$LOG" 2>&1 < /dev/null &
    echo $! > "$PIDFILE"
    # The HTTP server answers before its evaluation kernel is up; wait for a kernel that evaluates.
    for _ in $(seq 1 90); do sleep 2; ready && wljs eval '1+1' >/dev/null 2>&1 && { "$0" online off; echo "WLJS ready at http://127.0.0.1:20560 (log: $LOG)"; exit 0; }; done
    echo "WLJS did not become ready within 180 s; see $LOG"; exit 1 ;;
  online)
    # Session-only switch for Wolfram's own internet functions in the WLJS evaluation kernel.
    # Off by default (offline-first). It is not a sandbox: arbitrary code can still open sockets.
    case "${2:-}" in
      on)  wljs eval '$AllowInternet = True' >/dev/null && echo "WLJS kernel internet: on (this session)" ;;
      off) wljs eval '$AllowInternet = False' >/dev/null && echo "WLJS kernel internet: off (this session)" ;;
      *)   echo "WLJS kernel internet: $(wljs eval '$AllowInternet')" ;;
    esac ;;
  desktop)
    # Start the WLJS desktop app (Electron): same server and ports, plus a window, a rasterizer (Rasterize/Export
    # to images), native dialogs, and WLJS's own MCP server on 127.0.0.1:20564.
    if ready; then echo "WLJS already running (stop it first to switch modes)"; exit 0; fi
    cd "$APP/../.." && setsid nohup ./wljs-notebook --ozone-platform=x11 --ignore-gpu-blocklist >"$STATE/desktop.log" 2>&1 < /dev/null &
    for _ in $(seq 1 90); do sleep 2; ready && wljs eval '1+1' >/dev/null 2>&1 && { "$0" online off; echo "WLJS desktop app ready (window title: WLJS Notebook); MCP on http://127.0.0.1:20564/"; exit 0; }; done
    echo "WLJS desktop app did not become ready within 180 s; see $STATE/desktop.log"; exit 1 ;;
  stop)
    # Stop the process group we started, then any kernels still holding WLJS ports.
    if [ -f "$PIDFILE" ]; then kill -- -"$(cat "$PIDFILE")" 2>/dev/null || kill "$(cat "$PIDFILE")" 2>/dev/null || true; rm -f "$PIDFILE"; fi
    sleep 2
    for p in $(ports | grep -o 'pid=[0-9]*' | cut -d= -f2 | sort -u); do kill "$p" 2>/dev/null || true; done
    sleep 3
    # WolframKernel can ignore TERM while its socket loop runs; force the ones still holding WLJS ports.
    for p in $(ports | grep -o 'pid=[0-9]*' | cut -d= -f2 | sort -u); do kill -9 "$p" 2>/dev/null || true; done
    sleep 1; [ -z "$(ports)" ] && echo "WLJS stopped" || { echo "Some WLJS ports are still open:"; ports; exit 1; } ;;
  status)
    if ready; then wljs status; else echo "WLJS is not running"; ports; fi ;;
  *) echo "usage: wljs-server desktop|start|stop|status|online [on|off]   (desktop = app with window; start = headless)"; exit 2 ;;
esac
