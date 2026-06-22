@echo off
setlocal

echo ============================================
echo  Windows Dev Setup
echo  Git / GitHub CLI / Python / Node.js / Claude
echo ============================================
echo.

where winget >nul 2>nul
if errorlevel 1 (
    echo winget was not found.
    echo Please update "App Installer" from the Microsoft Store:
    echo https://apps.microsoft.com/detail/9nblggh4nns1
    pause
    exit /b 1
)

echo [1/6] Installing Git...
winget install --id Git.Git -e --silent --accept-source-agreements --accept-package-agreements

echo.
echo [2/6] Installing GitHub CLI...
winget install --id GitHub.cli -e --silent --accept-source-agreements --accept-package-agreements

echo.
echo [3/6] Installing Python...
winget install --id Python.Python.3.13 -e --silent --accept-source-agreements --accept-package-agreements
if errorlevel 1 winget install --id Python.Python.3.12 -e --silent --accept-source-agreements --accept-package-agreements
if errorlevel 1 winget install --id Python.Python.3.11 -e --silent --accept-source-agreements --accept-package-agreements

echo.
echo [4/6] Installing Node.js...
winget install --id OpenJS.NodeJS.LTS -e --silent --accept-source-agreements --accept-package-agreements

echo.
echo [5/6] Installing Claude Desktop...
winget install --id Anthropic.Claude -e --silent --accept-source-agreements --accept-package-agreements
if errorlevel 1 (
    echo   NOTE: Could not install Claude Desktop automatically.
    echo   Please download it manually from https://claude.ai/download
)

echo.
echo Refreshing PATH for this window...
set "PATH=%PATH%;C:\Program Files\Git\cmd"
set "PATH=%PATH%;C:\Program Files\GitHub CLI\"
set "PATH=%PATH%;C:\Program Files\nodejs\"

echo.
echo [6/6] Installing Claude Code CLI (npm)...
call npm install -g @anthropic-ai/claude-code
if errorlevel 1 (
    echo   NOTE: If this failed, restart your PC, open a new Command Prompt, and run:
    echo   npm install -g @anthropic-ai/claude-code
)

echo.
echo ============================================
echo  Setup complete
echo ============================================
echo.
echo Next steps (need internet access):
echo   1. Restart your PC (so newly installed tools are available)
echo   2. Open a new Command Prompt and run once:
echo        git config --global user.name "Your Name"
echo        git config --global user.email "you@example.com"
echo   3. gh auth login      (sign in to GitHub)
echo   4. claude             (sign in to Claude Code)
echo.
pause
