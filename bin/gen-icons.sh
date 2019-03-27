#!/bin/sh
script="$0"
script_dir=`pwd`/`dirname "$script"`

export PROJECT=sudoku
inkscape=/Applications/Inkscape.app/Contents/Resources/bin/inkscape
source="$script_dir"/../assets/"$PROJECT".svg
target_dir="$script_dir"/../public/img/icons

# PNG
gen_png() {
  $inkscape -z -e "$target_dir"/"$1".png -w "$2" -h "$2" "$source"
}

gen_png android-chrome-192x192 192
gen_png android-chrome-512x512 512
gen_png apple-touch-icon-60x60 60
gen_png apple-touch-icon-76x76 76
gen_png apple-touch-icon-120x120 120
gen_png apple-touch-icon-152x152 152
gen_png apple-touch-icon-180x180 180
gen_png apple-touch-icon 180
gen_png favicon-16x16 16
gen_png favicon-32x32 32
gen_png msapplication-icon-144x144 144
gen_png mstile-150x150 150

# SVG
cp "$source" "$target_dir"/safari-pinned-tab.svg

# ICO
convert -resize x16 -gravity center -crop 16x16+0+0 -flatten -colors 256 "$target_dir"/favicon-16x16.png "$target_dir"/favicon-16x16.ico
convert -resize x32 -gravity center -crop 32x32+0+0 -flatten -colors 256 "$target_dir"/favicon-32x32.png "$target_dir"/favicon-32x32.ico
convert "$target_dir"/favicon-16x16.ico "$target_dir"/favicon-32x32.ico "$target_dir"/../../favicon.ico
rm "$target_dir"/favicon-16x16.ico "$target_dir"/favicon-32x32.ico