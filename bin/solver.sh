#!/bin/sh
script=`readlink -f "$0"`
script_dir=`dirname "$script"`
script_name=`basename "$script" .sh`
script_pid="$script_dir/$script_name.pid"
script_txt="$PWD/$script_name.txt"

stop_script() {
  if [ -f "$script_pid" ]; then kill `cat "$script_pid"` >/dev/null 2>&1; fi
}

start_script() {
  nohup node --experimental-modules "$script_dir"/../solver/src/start.mjs >"$script_txt" 2>&1 &
  echo "$!" >"$script_pid"
}

case "$1" in
'stop')
  stop_script
  ;;
'start')
  start_script
  ;;
*)
  stop_script
  start_script
  ;;
esac
