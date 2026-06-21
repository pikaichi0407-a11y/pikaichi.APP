@echo off
REM オフラインのPCで実行: installers フォルダの内容をインストールします
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp02-install-offline.ps1"
pause
