#!/bin/sh -x
script="$0"
script_dir=`dirname "$script"`

PROJECT=sudoku
NODE_ENV=production
BASE_URL=/sudoku/

npm run build
ssh goodnogood.org "mkdir -p /root/nginx-webroot/$PROJECT && rm -rf /root/nginx-webroot/$PROJECT/*"
scp -r $script_dir/../dist/ goodnogood.org:"/root/nginx-webroot/$PROJECT/"
