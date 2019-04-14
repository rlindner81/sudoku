@ECHO OFF
SETLOCAL

SET PROJECT=sudoku
SET SSH=plink -batch -load "goodnogood.org"
SET SCP=pscp
SET NODE_ENV=production
SET BASE_URL=/

PUSHD %~dp0..\

CALL npm run build
%SSH% ^
  mkdir -p /root/nginx-webroot/%PROJECT% ^&^& ^
  rm -rf /root/nginx-webroot/%PROJECT%/*
%SCP% -r dist/ goodnogood.org:/root/nginx-webroot/%PROJECT%/

POPD

ENDLOCAL
