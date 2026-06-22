$ErrorActionPreference = "Stop"

$glowDir = Join-Path $env:USERPROFILE ".claude\glow"
$settingsPath = Join-Path $env:USERPROFILE ".claude\settings.json"

$pidFile = Join-Path $glowDir "glow.pid"
if (Test-Path $pidFile) {
    $existingPid = Get-Content $pidFile -ErrorAction SilentlyContinue
    if ($existingPid) {
        Stop-Process -Id $existingPid -ErrorAction SilentlyContinue
    }
}

if (Test-Path $settingsPath) {
    $backup = "$settingsPath.bak." + (Get-Date -Format "yyyyMMddHHmmss")
    Copy-Item $settingsPath $backup -Force

    $json = Get-Content $settingsPath -Raw | ConvertFrom-Json

    if ($json.PSObject.Properties['hooks']) {
        foreach ($eventName in @("UserPromptSubmit", "Stop")) {
            if ($json.hooks.PSObject.Properties[$eventName]) {
                $filtered = @($json.hooks.$eventName | Where-Object {
                    $entry = $_
                    -not (@($entry.hooks) | Where-Object { $_.command -like "*.claude\glow\*" })
                })
                $json.hooks.$eventName = $filtered
            }
        }
    }

    $json | ConvertTo-Json -Depth 20 | Set-Content -Path $settingsPath -Encoding UTF8
    Write-Host "Removed glow hooks from settings.json (backup saved to $backup)"
}

if (Test-Path $glowDir) {
    Remove-Item $glowDir -Recurse -Force
}

Write-Host ""
Write-Host "Uninstall complete."
Write-Host "Open a NEW Claude Code session (or run /hooks once) so the change takes effect."
