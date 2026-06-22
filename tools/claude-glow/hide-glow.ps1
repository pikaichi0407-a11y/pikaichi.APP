# Stops the glow overlay if it's running. Called by the Stop hook.

$glowRoot = $PSScriptRoot
$pidFile = Join-Path $glowRoot "glow.pid"

if (Test-Path $pidFile) {
    $existingPid = Get-Content $pidFile -ErrorAction SilentlyContinue
    if ($existingPid) {
        Stop-Process -Id $existingPid -ErrorAction SilentlyContinue
    }
    Remove-Item $pidFile -ErrorAction SilentlyContinue
}
