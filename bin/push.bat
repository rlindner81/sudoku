@ECHO OFF
SETLOCAL

SET PROJECT=sudoku
SET SSH=plink -batch -load "goodnogood.org"
SET SCP=pscp

CALL npm run build
%SSH% ^
  mkdir -p /root/nginx-webroot/%PROJECT% ^&^& ^
  rm -rf /root/nginx-webroot/%PROJECT%/*
%SCP% -r %~dp0../dist/ goodnogood.org:/root/nginx-webroot/%PROJECT%/

ENDLOCAL
