<#
  釣り人3Dモデル 自動生成ランチャー (Windows / PowerShell)
  ======================================================
  Blender を自動で探して起動し、fisherman.py を実行して
  assets/models/character1.glb を書き出します。

  使い方:
    ・run_blender.bat をダブルクリック（一番かんたん）
    ・または PowerShell で:  .\run_blender.ps1

  オプション:
    -Headless   画面を出さずに .glb だけ書き出す（速い）
    -BlenderExe "C:\path\to\blender.exe"   自動検出に失敗した時に手動指定
#>

param(
    [switch]$Headless,
    [string]$BlenderExe = ""
)

$ErrorActionPreference = "Stop"

# --- パス解決 ---------------------------------------------------------
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoRoot  = Split-Path -Parent $ScriptDir
$PyScript  = Join-Path $ScriptDir "fisherman.py"
$OutDir    = Join-Path $RepoRoot "assets\models"
$OutFile   = Join-Path $OutDir "character1.glb"

Write-Host ""
Write-Host "=== 釣り人3Dモデル 自動生成 ===" -ForegroundColor Cyan

if (-not (Test-Path $PyScript)) {
    Write-Host "エラー: fisherman.py が見つかりません: $PyScript" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $OutDir)) {
    New-Item -ItemType Directory -Path $OutDir -Force | Out-Null
}

# --- Blender を探す ---------------------------------------------------
function Find-Blender {
    # 1) 手動指定が最優先
    if ($BlenderExe -and (Test-Path $BlenderExe)) { return $BlenderExe }

    # 2) PATH に通っている場合
    $cmd = Get-Command blender.exe -ErrorAction SilentlyContinue
    if ($cmd) { return $cmd.Source }

    # 3) よくあるインストール先を新しいバージョン順に探索
    $roots = @(
        "$env:ProgramFiles\Blender Foundation",
        "${env:ProgramFiles(x86)}\Blender Foundation",
        "$env:ProgramFiles\Steam\steamapps\common\Blender",
        "${env:ProgramFiles(x86)}\Steam\steamapps\common\Blender",
        "$env:LOCALAPPDATA\Programs\Blender Foundation",
        "$env:LOCALAPPDATA\Microsoft\WindowsApps"
    )
    foreach ($root in $roots) {
        if (Test-Path $root) {
            $found = Get-ChildItem -Path $root -Filter "blender.exe" -Recurse `
                        -ErrorAction SilentlyContinue |
                     Sort-Object FullName -Descending |
                     Select-Object -First 1
            if ($found) { return $found.FullName }
        }
    }
    return $null
}

Write-Host "Blender を探しています..." -ForegroundColor Gray
$blender = Find-Blender

if (-not $blender) {
    Write-Host ""
    Write-Host "Blender が見つかりませんでした。" -ForegroundColor Red
    Write-Host "blender.exe の場所を指定して実行してください:" -ForegroundColor Yellow
    Write-Host '  .\run_blender.ps1 -BlenderExe "C:\Program Files\Blender Foundation\Blender 4.2\blender.exe"'
    exit 1
}

Write-Host "見つかりました: $blender" -ForegroundColor Green

# --- 実行 -------------------------------------------------------------
# --factory-startup: アドオン等の影響を受けずクリーンな状態で実行
$blenderArgs = @("--factory-startup")
if ($Headless) { $blenderArgs += "--background" }
$blenderArgs += @("--python", $PyScript, "--", "--out", $OutFile)

Write-Host "Blender を起動してモデルを生成します..." -ForegroundColor Gray
Write-Host ""

& $blender @blenderArgs
$code = $LASTEXITCODE

Write-Host ""
if (Test-Path $OutFile) {
    $size = [math]::Round((Get-Item $OutFile).Length / 1KB, 1)
    Write-Host "完了しました: $OutFile ($size KB)" -ForegroundColor Green
    Write-Host "エクスプローラーで開きます..." -ForegroundColor Gray
    explorer.exe "/select,`"$OutFile`""
} else {
    Write-Host ".glb が生成されませんでした (Blender 終了コード: $code)" -ForegroundColor Red
    Write-Host "上に出ているエラーメッセージを Claude に貼り付けてください。" -ForegroundColor Yellow
}
