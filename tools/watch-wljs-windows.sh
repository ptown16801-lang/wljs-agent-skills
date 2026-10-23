#!/usr/bin/env bash
# Log every viewable WLJS window and where it is; flag any on monitor 1 (x < MON2_X). Runs until killed.
MON2_X=${MON2_X:-1600}; seen=""
while true; do
  while read -r id rest; do
    geo=$(xwininfo -id "$id" 2>/dev/null); st=$(awk '/Map State/{print $3}' <<<"$geo"); [ "$st" = IsViewable ] || continue
    x=$(awk '/Absolute upper-left X/{print $4}' <<<"$geo"); w=$(awk '/Width/{print $2}' <<<"$geo")
    [ "${w:-0}" -lt 300 ] && continue
    key="$id:$x"; case " $seen " in *" $key "*) continue;; esac; seen="$seen $key"
    name=$(awk -F'"' '/xwininfo: Window id/{print $2}' <<<"$geo")
    if [ "$x" -ge "$MON2_X" ]; then echo "$(date +%T) monitor 2: $id x=$x \"$name\""; else echo "$(date +%T) MONITOR 1: $id x=$x \"$name\""; fi
  done < <(xwininfo -root -tree 2>/dev/null | grep -i '("wljs' | awk '{print $1, $0}')
  sleep 2
done
