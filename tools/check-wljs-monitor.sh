#!/usr/bin/env bash
# After a WLJS restart: are the WLJS windows on monitor 2 (x >= MON2_X), and is the kernel offline?
# Usage: tools/check-wljs-monitor.sh   (exit 0 = all WLJS windows on monitor 2 and $AllowInternet False)
set -u
MON2_X=${MON2_X:-1600}
ok=0
mapfile -t wins < <(xwininfo -root -tree 2>/dev/null | grep -i -E '"[^"]*".*\("?wljs' | grep -o '^ *0x[0-9a-f]*')
if [ ${#wins[@]} -eq 0 ]; then echo "no WLJS windows found"; ok=1; fi
for w in "${wins[@]}"; do
  info=$(xwininfo -id "$w" 2>/dev/null)
  x=$(awk '/Absolute upper-left X/ {print $4}' <<<"$info")
  y=$(awk '/Absolute upper-left Y/ {print $4}' <<<"$info")
  name=$(awk -F'"' '/xwininfo: Window id/ {print $2}' <<<"$info")
  state=$(awk '/Map State/ {print $3}' <<<"$info")
  [ "$state" = IsViewable ] || continue
  if [ "${x:-0}" -ge "$MON2_X" ]; then echo "monitor 2: $w x=$x y=$y \"$name\""; else echo "MONITOR 1: $w x=$x y=$y \"$name\""; ok=1; fi
done
net=$(timeout 60 wljs eval '$AllowInternet' 2>&1 | tail -1)
echo "WLJS \$AllowInternet: $net"
[ "$net" = False ] || ok=1
exit $ok
