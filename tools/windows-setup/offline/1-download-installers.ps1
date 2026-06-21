# 事前ダウンロードスクリプト（ネット接続のあるPCで1回だけ実行）
#
# Git / GitHub CLI / Node.js / Python のインストーラーと、
# Claude Code CLI 用の npm オフラインキャッシュを
# このスクリプトと同じ場所の "installers" フォルダにまとめます。
#
# 完成した installers フォルダを丸ごとUSBメモリ等にコピーし、
# オフラインのPCでは 2-install-offline.ps1 (install-offline.bat) を実行してください。
#
# 注意: Claude Desktop アプリは自動ダウンロードに対応していません。
#       https://claude.ai/download から手動でダウンロードし、
#       installers フォルダに保存してください。

$ErrorActionPreference = "Stop"

$root = $PSScriptRoot
$installersDir = Join-Path $root "installers"
$npmCacheDir = Join-Path $installersDir "npm-cache"
$npmTempPrefix = Join-Path $installersDir "_npm-temp"

New-Item -ItemType Directory -Force -Path $installersDir | Out-Null

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

function Get-LatestGitHubAsset {
    param([string]$Repo, [string]$Pattern)
    $api = "https://api.github.com/repos/$Repo/releases/latest"
    $headers = @{ "User-Agent" = "pikaichi-setup-script" }
    $release = Invoke-RestMethod -Uri $api -Headers $headers
    return $release.assets | Where-Object { $_.name -match $Pattern } | Select-Object -First 1
}

function Save-FileFromUrl {
    param([string]$Url, [string]$OutFile)
    Write-Host "    ダウンロード中: $Url"
    Invoke-WebRequest -Uri $Url -OutFile $OutFile -UseBasicParsing
    Write-Ok "保存しました: $OutFile"
}

# --- Git for Windows ---
Write-Step "Git for Windows のインストーラーをダウンロード"
try {
    $asset = Get-LatestGitHubAsset -Repo "git-for-windows/git" -Pattern "64-bit\.exe$"
    Save-FileFromUrl -Url $asset.browser_download_url -OutFile (Join-Path $installersDir $asset.name)
} catch {
    Write-Warn "Git のダウンロードに失敗しました: $_"
}

# --- GitHub CLI ---
Write-Step "GitHub CLI のインストーラーをダウンロード"
try {
    $asset = Get-LatestGitHubAsset -Repo "cli/cli" -Pattern "windows_amd64\.msi$"
    Save-FileFromUrl -Url $asset.browser_download_url -OutFile (Join-Path $installersDir $asset.name)
} catch {
    Write-Warn "GitHub CLI のダウンロードに失敗しました: $_"
}

# --- Node.js (LTS) ---
Write-Step "Node.js (LTS) のインストーラーをダウンロード"
try {
    $index = Invoke-RestMethod -Uri "https://nodejs.org/dist/index.json"
    $lts = $index | Where-Object { $_.lts -ne $false } | Select-Object -First 1
    $fileName = "node-$($lts.version)-x64.msi"
    Save-FileFromUrl -Url "https://nodejs.org/dist/$($lts.version)/$fileName" -OutFile (Join-Path $installersDir $fileName)
} catch {
    Write-Warn "Node.js のダウンロードに失敗しました: $_"
}

# --- Python ---
Write-Step "Python のインストーラーをダウンロード"
# python.org には「常に最新版」を指す固定URLが無いため、バージョンを直接指定しています。
# 新しいバージョンを使いたい場合は下の行の番号を書き換えてください。
$pythonVersion = "3.12.7"
try {
    $fileName = "python-$pythonVersion-amd64.exe"
    Save-FileFromUrl -Url "https://www.python.org/ftp/python/$pythonVersion/$fileName" -OutFile (Join-Path $installersDir $fileName)
} catch {
    Write-Warn "Python のダウンロードに失敗しました: $_"
}

# --- Claude Desktop (手動) ---
Write-Step "Claude Desktop"
Write-Warn "Claude Desktop は自動ダウンロードに対応していません。"
Write-Host "    以下のページからWindows版インストーラーを手動でダウンロードし、"
Write-Host "    次のフォルダに保存してください:"
Write-Host "    $installersDir"
Write-Host "    https://claude.ai/download"

# --- Claude Code CLI 用 npm オフラインキャッシュ ---
Write-Step "Claude Code CLI 用の npm オフラインキャッシュを作成"
if (Get-Command npm -ErrorAction SilentlyContinue) {
    New-Item -ItemType Directory -Force -Path $npmCacheDir | Out-Null
    npm install -g "@anthropic-ai/claude-code" --cache "$npmCacheDir" --prefix "$npmTempPrefix"
    if ($LASTEXITCODE -eq 0) {
        $installedVersion = (& "$npmTempPrefix\claude.cmd" --version 2>$null)
        $pkgJsonPath = Join-Path $npmTempPrefix "node_modules\@anthropic-ai\claude-code\package.json"
        if (Test-Path $pkgJsonPath) {
            $version = (Get-Content $pkgJsonPath -Raw | ConvertFrom-Json).version
            Set-Content -Path (Join-Path $installersDir "claude-code-version.txt") -Value $version -NoNewline
            Write-Ok "npm キャッシュを作成しました (claude-code v$version): $npmCacheDir"
        } else {
            Write-Ok "npm キャッシュを作成しました: $npmCacheDir"
        }
        Remove-Item -Recurse -Force $npmTempPrefix -ErrorAction SilentlyContinue
    } else {
        Write-Warn "npm キャッシュの作成に失敗しました。"
    }
} else {
    Write-Warn "npm が見つかりません。このPCに一度Node.jsをインストールしてから再実行してください。"
}

# --- 完了 ---
Write-Step "ダウンロード完了"
Write-Host ""
Write-Host "次のフォルダをUSBメモリ等にコピーしてください:" -ForegroundColor Cyan
Write-Host "    $installersDir"
Write-Host ""
Write-Host "オフラインのPCでは、offline フォルダ全体をコピーした上で"
Write-Host "install-offline.bat (2-install-offline.ps1) を実行してください。"
Write-Host ""
Read-Host "Enter キーを押すと終了します"
