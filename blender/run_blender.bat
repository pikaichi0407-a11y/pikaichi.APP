@echo off
REM ============================================================
REM  釣り人3Dモデル 自動生成ランチャー
REM  このファイルをダブルクリックするだけで、
REM  Blender が自動起動してモデルが生成されます。
REM ============================================================
chcp 65001 >nul
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0run_blender.ps1" %*
echo.
echo 終了するには何かキーを押してください...
pause >nul
