# Starts the glow overlay if it isn't already running. Called by the UserPromptSubmit hook.

$glowRoot = $PSScriptRoot
$pidFile = Join-Path $glowRoot "glow.pid"

if (Test-Path $pidFile) {
    $existingPid = Get-Content $pidFile -ErrorAction SilentlyContinue
    if ($existingPid -and (Get-Process -Id $existingPid -ErrorAction SilentlyContinue)) {
        exit 0
    }
}

$proc = Start-Process -FilePath "powershell.exe" `
    -ArgumentList @(
        "-NoProfile", "-NonInteractive", "-STA",
        "-WindowStyle", "Hidden",
        "-ExecutionPolicy", "Bypass",
        "-File", (Join-Path $glowRoot "glow.ps1")
    ) `
    -WindowStyle Hidden -PassThru

Set-Content -Path $pidFile -Value $proc.Id
