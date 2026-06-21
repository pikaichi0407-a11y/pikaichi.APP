@echo off
REM ダブルクリックで開発環境セットアップを実行するランチャー
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0setup-dev-environment.ps1"
pause
