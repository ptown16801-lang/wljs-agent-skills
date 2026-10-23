#!/usr/bin/env bash
# Capture every visible WLJS notebook window (X11/XWayland) to PNG without opening or moving anything (tools/xcapture.py).
# Usage: tools/capture-wljs-windows.sh OUTDIR   -> OUTDIR/<window-id>_<title>.png (top of each window as shown)
set -eu
out=${1:?output folder}; mkdir -p "$out"; here=$(dirname "$(readlink -f "$0")")
xwininfo -root -tree | grep '("wljs-notebook" "wljs-notebook")' | while read -r id rest; do
  title=$(sed -E 's/^"([^"]*)".*/\1/' <<<"$rest"); [ "$title" = "WLJS Notebooks" ] && continue
  st=$(xwininfo -id "$id" | awk '/Map State/{print $3}'); [ "$st" = IsViewable ] || continue
  f="$out/${id}_${title//[^A-Za-z0-9._-]/_}"
  # xcapture.py reads pixels with XGetImage; xwd fails on these TrueColor windows (BadColor in X_QueryColors)
  for try in 1 2 3; do
    if python3 "$here/xcapture.py" "$id" "$f.png" >/dev/null 2>&1 && [ -s "$f.png" ]; then echo "$f.png"; break; fi
    sleep 1
  done
done
