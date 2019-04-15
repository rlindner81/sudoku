#!/bin/sh
script="$0"
script_dir=`dirname "$script"`

export PROJECT=sudoku
export NODE_ENV=production
export BASE_URL=/

npm run build
ssh goodnogood.org "mkdir -p /root/nginx-webroot/$PROJECT"
ssh goodnogood.org "rm -rf /root/nginx-webroot/$PROJECT/*"
scp -rp $script_dir/../dist/* goodnogood.org:"/root/nginx-webroot/$PROJECT/"
