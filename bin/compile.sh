#!/bin/sh
script="$0"
script_dir=`dirname "$script"`
misc_dir=$script_dir/../misc

process() {
  echo processing $1
  ctangle $misc_dir/$1.w
  cweave $misc_dir/$1.w
  pdftex $1.tex
}

process_with_change() {
  echo processing $1 with change $2
  ctangle $misc_dir/$1.w $misc_dir/$2.ch
  cweave $misc_dir/$1.w $misc_dir/$2.ch
  pdftex $1.tex
}

process sudoku-general-dlx
process sudoku-dlx
process_with_change dlx1 dlx1-sudoku
