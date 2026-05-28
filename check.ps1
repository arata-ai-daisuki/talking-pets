$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $Root

Write-Host "Talking Pets check"
Write-Host "=================="

if (Get-Command node -ErrorAction SilentlyContinue) {
  Write-Host "node: $(node --version)"
} else {
  Write-Host "node: not found"
}

if (Get-Command npm -ErrorAction SilentlyContinue) {
  Write-Host "npm: $(npm --version)"
} else {
  Write-Host "npm: not found"
}

if (Test-Path "node_modules") {
  Write-Host "node_modules: found"
} else {
  Write-Host "node_modules: not found"
}

try {
  Invoke-RestMethod -Uri "http://127.0.0.1:50021/version" -Method Get | Out-Null
  Write-Host "VOICEVOX: ok"
} catch {
  Write-Host "VOICEVOX: not reachable"
}

Write-Host ""
Write-Host "dry run:"
node scripts/pet-rollout-monitor.mjs --once --dry-run
