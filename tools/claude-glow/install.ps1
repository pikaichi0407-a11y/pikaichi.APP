$ErrorActionPreference = "Stop"

$scriptDir = $PSScriptRoot
$glowDir = Join-Path $env:USERPROFILE ".claude\glow"
New-Item -ItemType Directory -Path $glowDir -Force | Out-Null

Copy-Item -Path (Join-Path $scriptDir "glow.ps1") -Destination $glowDir -Force
Copy-Item -Path (Join-Path $scriptDir "show-glow.ps1") -Destination $glowDir -Force
Copy-Item -Path (Join-Path $scriptDir "hide-glow.ps1") -Destination $glowDir -Force

$settingsDir = Join-Path $env:USERPROFILE ".claude"
New-Item -ItemType Directory -Path $settingsDir -Force | Out-Null
$settingsPath = Join-Path $settingsDir "settings.json"

if (Test-Path $settingsPath) {
    $backup = "$settingsPath.bak." + (Get-Date -Format "yyyyMMddHHmmss")
    Copy-Item $settingsPath $backup -Force
    Write-Host "Existing settings backed up to: $backup"
    $json = Get-Content $settingsPath -Raw | ConvertFrom-Json
} else {
    $json = [PSCustomObject]@{}
}

if (-not $json.PSObject.Properties['hooks']) {
    $json | Add-Member -MemberType NoteProperty -Name 'hooks' -Value ([PSCustomObject]@{})
}

$showCommand = '& "' + (Join-Path $glowDir 'show-glow.ps1') + '"'
$hideCommand = '& "' + (Join-Path $glowDir 'hide-glow.ps1') + '"'

function Add-GlowHook {
    param($json, $eventName, $command)

    if (-not $json.hooks.PSObject.Properties[$eventName]) {
        $json.hooks | Add-Member -MemberType NoteProperty -Name $eventName -Value @()
    }

    $existing = @($json.hooks.$eventName)
    $hasIt = $false
    foreach ($entry in $existing) {
        foreach ($h in @($entry.hooks)) {
            if ($h.command -eq $command) { $hasIt = $true }
        }
    }

    if (-not $hasIt) {
        $newEntry = [PSCustomObject]@{
            hooks = @(
                [PSCustomObject]@{
                    type    = "command"
                    shell   = "powershell"
                    command = $command
                    async   = $true
                    timeout = 5
                }
            )
        }
        $existing += $newEntry
    }

    $json.hooks.$eventName = $existing
}

Add-GlowHook -json $json -eventName "UserPromptSubmit" -command $showCommand
Add-GlowHook -json $json -eventName "Stop" -command $hideCommand

$json | ConvertTo-Json -Depth 20 | Set-Content -Path $settingsPath -Encoding UTF8

Write-Host ""
Write-Host "============================================"
Write-Host " Claude glow effect installed"
Write-Host "============================================"
Write-Host ""
Write-Host "Scripts copied to: $glowDir"
Write-Host "Hooks added to:    $settingsPath"
Write-Host ""
Write-Host "Open a NEW Claude Code session (or run /hooks once in an open session)"
Write-Host "so the updated settings are picked up."
