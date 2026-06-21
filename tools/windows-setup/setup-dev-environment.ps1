# 新しいWindows PC用 開発環境セットアップスクリプト
# インストール対象: Git, GitHub CLI, Python, Node.js, Claude Code CLI, Claude Desktop
#
# 使い方: setup.bat をダブルクリックするか、PowerShellで以下を実行
#   powershell -ExecutionPolicy Bypass -File setup-dev-environment.ps1

$ErrorActionPreference = "Stop"

function Write-Step($message) {
    Write-Host ""
    Write-Host "==> $message" -ForegroundColor Cyan
}

function Write-Ok($message) {
    Write-Host "    OK: $message" -ForegroundColor Green
}

function Write-Warn($message) {
    Write-Host "    WARNING: $message" -ForegroundColor Yellow
}

function Test-WingetAvailable {
    return [bool](Get-Command winget -ErrorAction SilentlyContinue)
}

function Update-SessionPath {
    $machinePath = [Environment]::GetEnvironmentVariable("Path", "Machine")
    $userPath = [Environment]::GetEnvironmentVariable("Path", "User")
    $env:Path = "$machinePath;$userPath"
}

function Install-WingetPackage {
    param(
        [Parameter(Mandatory)] [string[]]$Ids,
        [Parameter(Mandatory)] [string]$DisplayName
    )

    foreach ($id in $Ids) {
        $installed = winget list --id $id --exact 2>$null | Select-String -SimpleMatch $id
        if ($installed) {
            Write-Ok "$DisplayName ($id) はすでにインストールされています"
            return $true
        }
    }

    foreach ($id in $Ids) {
        Write-Host "    試行中: $id ..."
        winget install --id $id --exact --silent --accept-source-agreements --accept-package-agreements
        if ($LASTEXITCODE -eq 0) {
            Write-Ok "$DisplayName をインストールしました ($id)"
            return $true
        }
    }

    Write-Warn "$DisplayName のインストールに失敗しました。手動でのインストールが必要です。"
    return $false
}

# --- 0. 前提チェック ---
Write-Step "winget の確認"
if (-not (Test-WingetAvailable)) {
    Write-Warn "winget が見つかりません。Microsoft Store から「アプリ インストーラー」を更新してください。"
    Write-Host "    https://apps.microsoft.com/detail/9nblggh4nns1"
    Read-Host "Enter キーで終了します"
    exit 1
}
Write-Ok "winget が利用可能です"

# --- 1. Git ---
Write-Step "Git をインストール"
Install-WingetPackage -Ids @("Git.Git") -DisplayName "Git"

# --- 2. GitHub CLI ---
Write-Step "GitHub CLI (gh) をインストール"
Install-WingetPackage -Ids @("GitHub.cli") -DisplayName "GitHub CLI"

# --- 3. Python ---
Write-Step "Python をインストール"
Install-WingetPackage -Ids @("Python.Python.3.13", "Python.Python.3.12", "Python.Python.3.11") -DisplayName "Python"

# --- 4. Node.js (Claude Code CLI の実行に必要) ---
Write-Step "Node.js (LTS) をインストール"
Install-WingetPackage -Ids @("OpenJS.NodeJS.LTS") -DisplayName "Node.js"

Update-SessionPath

# --- 5. Claude Desktop ---
Write-Step "Claude Desktop アプリをインストール"
$claudeDesktopOk = Install-WingetPackage -Ids @("Anthropic.Claude") -DisplayName "Claude Desktop"
if (-not $claudeDesktopOk) {
    Write-Warn "winget での自動インストールができなかったため、以下から手動インストールしてください:"
    Write-Host "    https://claude.ai/download"
}

# --- 6. Claude Code CLI ---
Write-Step "Claude Code CLI をインストール (npm)"
Update-SessionPath
if (Get-Command npm -ErrorAction SilentlyContinue) {
    npm install -g @anthropic-ai/claude-code
    if ($LASTEXITCODE -eq 0) {
        Write-Ok "Claude Code CLI をインストールしました"
    } else {
        Write-Warn "Claude Code CLI のインストールに失敗しました。新しいターミナルを開いて次のコマンドを再実行してください:"
        Write-Host "    npm install -g @anthropic-ai/claude-code"
    }
} else {
    Write-Warn "npm が見つかりません。新しいターミナルを開いてから次を実行してください:"
    Write-Host "    npm install -g @anthropic-ai/claude-code"
}

# --- 7. Git の初期設定 ---
Write-Step "Git の初期設定"
Update-SessionPath
if (Get-Command git -ErrorAction SilentlyContinue) {
    $currentName = git config --global user.name 2>$null
    $currentEmail = git config --global user.email 2>$null

    if (-not $currentName) {
        $name = Read-Host "Git で使う名前を入力してください (例: Taro Yamada)"
        if ($name) { git config --global user.name "$name" }
    } else {
        Write-Ok "user.name は既に設定済みです: $currentName"
    }

    if (-not $currentEmail) {
        $email = Read-Host "Git で使うメールアドレスを入力してください"
        if ($email) { git config --global user.email "$email" }
    } else {
        Write-Ok "user.email は既に設定済みです: $currentEmail"
    }
} else {
    Write-Warn "git コマンドが見つかりません。PCを再起動してから再実行してください。"
}

# --- 8. GitHub 認証 ---
Write-Step "GitHub にログイン (gh auth login)"
if (Get-Command gh -ErrorAction SilentlyContinue) {
    gh auth status 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Ok "GitHub には既にログイン済みです"
    } else {
        Write-Host "    ブラウザが開きます。画面の指示に従ってログインしてください。"
        gh auth login --web --git-protocol https
    }
} else {
    Write-Warn "gh コマンドが見つかりません。PCを再起動してから次を実行してください: gh auth login"
}

# --- 完了 ---
Write-Step "セットアップ完了"
Write-Host ""
Write-Host "インストールしたツール:" -ForegroundColor Cyan
Write-Host "  - Git"
Write-Host "  - GitHub CLI (gh)"
Write-Host "  - Python"
Write-Host "  - Node.js"
Write-Host "  - Claude Code CLI (npm パッケージ)"
Write-Host "  - Claude Desktop アプリ"
Write-Host ""
Write-Host "次のステップ:" -ForegroundColor Cyan
Write-Host "  1. 一度 PC を再起動するか、新しいターミナルを開いてください (PATHの反映のため)"
Write-Host "  2. 新しいターミナルで 'claude' と入力してログインしてください"
Write-Host "  3. 'gh auth status' でGitHubログイン状態を確認できます"
Write-Host ""
Read-Host "Enter キーを押すと終了します"
