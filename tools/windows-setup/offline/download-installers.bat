@echo off
REM ネット接続のあるPCで1回だけ実行: インストーラー一式をダウンロードします
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp01-download-installers.ps1"
pause
