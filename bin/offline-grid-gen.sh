#!/bin/sh
script=`readlink -f "$0"`
script_dir=`dirname "$script"`
script_name=`basename "$script" .sh`
script_pid="$script_dir/$script_name.pid"
script_txt="$PWD/$script_name.txt"

stop_start_script() {
  if [ -f "$script_dir/$1-$script_name.pid" ]; then kill `cat "$script_dir/$1-$script_name.pid"` >/dev/null 2>&1; fi
  nohup node --experimental-modules "$script_dir"/../src/offline/generate.mjs --size $1 >"$PWD/$1-$script_name.txt" 2>&1 &
  echo "$!" >"$script_dir/$1-$script_name.pid"
}

stop_start_script 9
stop_start_script 10
stop_start_script 12
stop_start_script 14
stop_start_script 15
stop_start_script 16
