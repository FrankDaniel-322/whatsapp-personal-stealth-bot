@echo off
cd /d "%~dp0"
npm run stop
npm run relink
pause
