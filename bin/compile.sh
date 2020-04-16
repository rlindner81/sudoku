#!/bin/sh
script="$0"
script_dir=`dirname "$script"`
cweb_dir=$script_dir/../cweb
temp_dir=$script_dir/../temp

rm -rf $temp_dir
mkdir $temp_dir

cp $cweb_dir/* $cweb_dir/sgb/* $temp_dir 2>/dev/null
cd $temp_dir

process() {
  echo processing $1
  ctangle $1.w
  cweave $1.w
  pdftex $1.tex
  clang -O3 $1.c -o $1
}

process_with_change() {
  echo processing $1 with change $2
  ctangle $1.w $2.ch
  cweave $1.w $2.ch
  pdftex $1.tex
  clang -O3 $1.c $3.c -o $1
}

process gb_flip
process_with_change dlx1 dlx1-sudoku gb_flip
process sudoku-general-dlx
process sudoku-dlx
