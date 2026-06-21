# オフラインインストールスクリプト（ネット接続なしのPCで実行可能）
#
# 1-download-installers.ps1 で作成した "installers" フォルダを
# このスクリプトと同じ場所に置いた状態で実行してください。
#
# インストール自体はオフラインで完了しますが、以下の手順は
# ネット接続が必要なため、このPCがネットに繋がったタイミングで
# 別途実行してください:
#   - git config (ユーザー名・メールアドレス)
#   - gh auth login (GitHubログイン)
#   - claude (Claude Codeへのログイン)
#   - Claude Desktop アプリへのログイン

$ErrorActionPreference = "Stop"

$root = $PSScriptRoot
$installersDir = Join-Path $root "installers"
$npmCacheDir = Join-Path $installersDir "npm-cache"
$versionFile = Join-Path $installersDir "claude-code-version.txt"

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

function Update-SessionPath {
    $machinePath = [Environment]::GetEnvironmentVariable("Path", "Machine")
    $userPath = [Environment]::GetEnvironmentVariable("Path", "User")
    $env:Path = "$machinePath;$userPath"
}

function Find-Installer($pattern) {
    return Get-ChildItem -Path $installersDir -Filter $pattern -ErrorAction SilentlyContinue | Select-Object -First 1
}

if (-not (Test-Path $installersDir)) {
    Write-Warn "installers フォルダが見つかりません: $installersDir"
    Write-Host "    先にネット接続のあるPCで 1-download-installers.ps1 を実行し、"
    Write-Host "    生成された installers フォルダをこのスクリプトと同じ場所に置いてください。"
    Read-Host "Enter キーを押すと終了します"
    exit 1
}

# --- Git ---
Write-Step "Git をインストール"
$git = Find-Installer "Git-*-64-bit.exe"
if ($git) {
    Start-Process -FilePath $git.FullName -ArgumentList "/VERYSILENT", "/NORESTART" -Wait
    Write-Ok "Git をインストールしました"
} else {
    Write-Warn "installers フォルダに Git のインストーラーが見つかりません"
}

# --- GitHub CLI ---
Write-Step "GitHub CLI をインストール"
$gh = Find-Installer "gh_*_windows_amd64.msi"
if ($gh) {
    Start-Process -FilePath "msiexec.exe" -ArgumentList "/i", $gh.FullName, "/quiet", "/norestart" -Wait
    Write-Ok "GitHub CLI をインストールしました"
} else {
    Write-Warn "installers フォルダに GitHub CLI のインストーラーが見つかりません"
}

# --- Python ---
Write-Step "Python をインストール"
$python = Find-Installer "python-*-amd64.exe"
if ($python) {
    Start-Process -FilePath $python.FullName -ArgumentList "/quiet", "InstallAllUsers=1", "PrependPath=1" -Wait
    Write-Ok "Python をインストールしました"
} else {
    Write-Warn "installers フォルダに Python のインストーラーが見つかりません"
}

# --- Node.js ---
Write-Step "Node.js をインストール"
$node = Find-Installer "node-*-x64.msi"
if ($node) {
    Start-Process -FilePath "msiexec.exe" -ArgumentList "/i", $node.FullName, "/quiet", "/norestart" -Wait
    Write-Ok "Node.js をインストールしました"
} else {
    Write-Warn "installers フォルダに Node.js のインストーラーが見つかりません"
}

Update-SessionPath

# --- Claude Desktop ---
Write-Step "Claude Desktop をインストール"
$claudeDesktop = Find-Installer "Claude*.exe"
if ($claudeDesktop) {
    Write-Host "    インストーラーを起動します。画面の指示に従ってください。"
    Start-Process -FilePath $claudeDesktop.FullName -Wait
    Write-Ok "Claude Desktop のインストーラーを実行しました"
} else {
    Write-Warn "installers フォルダに Claude Desktop のインストーラーが見つかりません。"
    Write-Host "    ネット接続のあるPCで https://claude.ai/download からダウンロードし、"
    Write-Host "    installers フォルダに入れて再実行するか、手動でインストールしてください。"
}

# --- Claude Code CLI (npm offline) ---
Write-Step "Claude Code CLI をインストール (npm オフラインキャッシュ使用)"
Update-SessionPath
if ((Get-Command npm -ErrorAction SilentlyContinue) -and (Test-Path $npmCacheDir)) {
    $pkg = "@anthropic-ai/claude-code"
    if (Test-Path $versionFile) {
        $version = (Get-Content $versionFile -Raw).Trim()
        if ($version) { $pkg = "@anthropic-ai/claude-code@$version" }
    }
    npm install -g $pkg --cache "$npmCacheDir" --offline
    if ($LASTEXITCODE -eq 0) {
        Write-Ok "Claude Code CLI をインストールしました"
    } else {
        Write-Warn "オフラインインストールに失敗しました。ネット接続後に次を実行してください:"
        Write-Host "    npm install -g @anthropic-ai/claude-code"
    }
} else {
    Write-Warn "npm または npm-cache フォルダが見つかりません。Node.jsのインストールを確認してください。"
}

# --- 完了 ---
Write-Step "オフラインインストール完了"
Write-Host ""
Write-Host "ここまではネット接続なしで完了します。" -ForegroundColor Cyan
Write-Host "このPCがネットに繋がったら、以下を実行してください:" -ForegroundColor Cyan
Write-Host "  1. 新しいターミナルで以下を実行 (初回のみ):"
Write-Host "       git config --global user.name `"あなたの名前`""
Write-Host "       git config --global user.email `"あなたのメールアドレス`""
Write-Host "  2. gh auth login   (GitHubへログイン)"
Write-Host "  3. claude          (Claude Codeへログイン)"
Write-Host "  4. Claude Desktop アプリを起動してログイン"
Write-Host ""
Read-Host "Enter キーを押すと終了します"
