@echo off
set "GIT_PATH=%~dp0scratch\MinGit\cmd\git.exe"
cd /d "%~dp0"
echo ========================================================
echo Enviando projeto para o GitHub...
echo ========================================================
"%GIT_PATH%" push -u origin main
echo.
pause
