@echo off
REM Double-click this file to install the glow effect.
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0install.ps1"
pause
