@ECHO OFF
SETLOCAL
CALL :Process sudoku-general-dlx
CALL :Process sudoku-dlx
CALL :ProcessWithChange dlx1 dlx1-sudoku
EXIT /B %ERRORLEVEL%

:Process
ECHO processing %~1
ctangle %~dp0%~1.w
cweave %~dp0%~1.w
pdftex %~dp0%~1.tex
EXIT /B 0

:ProcessWithChange
ECHO processing %~1 with change %~2
ctangle %~dp0%~1.w %~dp0%~2.ch
cweave %~dp0%~1.w %~dp0%~2.ch
pdftex %~dp0%~1.tex
EXIT /B 0
