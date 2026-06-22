# Fullscreen click-through overlay: pulsing red border around the screen edge.
# Launched by show-glow.ps1, killed by hide-glow.ps1. Not meant to be run directly.

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

Add-Type @"
using System;
using System.Runtime.InteropServices;
public class GlowNative {
    [DllImport("user32.dll")]
    public static extern int GetWindowLong(IntPtr hWnd, int nIndex);
    [DllImport("user32.dll")]
    public static extern int SetWindowLong(IntPtr hWnd, int nIndex, int dwNewLong);
}
"@

$borderWidth = 16
$bounds = [System.Windows.Forms.SystemInformation]::VirtualScreen

$form = New-Object System.Windows.Forms.Form
$form.FormBorderStyle = [System.Windows.Forms.FormBorderStyle]::None
$form.ShowInTaskbar = $false
$form.TopMost = $true
$form.StartPosition = [System.Windows.Forms.FormStartPosition]::Manual
$form.Location = New-Object System.Drawing.Point($bounds.X, $bounds.Y)
$form.ClientSize = New-Object System.Drawing.Size($bounds.Width, $bounds.Height)
$form.BackColor = [System.Drawing.Color]::Black
$form.TransparencyKey = [System.Drawing.Color]::Black

$form.Add_Paint({
    param($sender, $e)
    $rect = $sender.ClientRectangle
    $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::Red, $borderWidth)
    $half = [int]($borderWidth / 2)
    $e.Graphics.DrawRectangle($pen, $half, $half, $rect.Width - $borderWidth, $rect.Height - $borderWidth)
    $pen.Dispose()
})

# Make the window click-through so it never blocks mouse/keyboard input to other apps.
$form.Add_Shown({
    $GWL_EXSTYLE = -20
    $WS_EX_LAYERED = 0x80000
    $WS_EX_TRANSPARENT = 0x20
    $style = [GlowNative]::GetWindowLong($form.Handle, $GWL_EXSTYLE)
    [GlowNative]::SetWindowLong($form.Handle, $GWL_EXSTYLE, $style -bor $WS_EX_LAYERED -bor $WS_EX_TRANSPARENT)
})

$script:phase = 0.0
$timer = New-Object System.Windows.Forms.Timer
$timer.Interval = 40
$timer.Add_Tick({
    $script:phase += 0.08
    $opacity = 0.20 + 0.20 * [Math]::Sin($script:phase)
    if ($opacity -lt 0.05) { $opacity = 0.05 }
    $form.Opacity = $opacity
})
$timer.Start()

[System.Windows.Forms.Application]::Run($form)
