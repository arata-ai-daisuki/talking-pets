$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $Root

Write-Host "Talking Pets check"
Write-Host "=================="

if (Get-Command node -ErrorAction SilentlyContinue) {
  $NodeVersion = & node --version
  $NodeMajor = [int](& node -p "Number(process.versions.node.split('.')[0])")
  if ($NodeMajor -ge 22) {
    Write-Host "node: ok ($NodeVersion)"
  } else {
    Write-Host "node: too old ($NodeVersion) -> install Node.js 22 or later"
  }
} else {
  Write-Host "node: not found -> install Node.js 22 or later"
}

if (Get-Command npm -ErrorAction SilentlyContinue) {
  Write-Host "npm: ok ($(npm --version))"
} else {
  Write-Host "npm: not found -> needed for Kokoro.js and auto routing"
}

if (Test-Path "node_modules") {
  Write-Host "node_modules: found"
} else {
  Write-Host "node_modules: not found -> run npm install if you use Kokoro.js"
}

try {
  Invoke-RestMethod -Uri "http://127.0.0.1:50021/version" -Method Get | Out-Null
  Write-Host "VOICEVOX: ok"
} catch {
  Write-Host "VOICEVOX: not reachable -> start VOICEVOX Engine or choose another TTS"
}

Write-Host ""
Write-Host "dry run:"
node scripts/pet-rollout-monitor.mjs --once --dry-run
Write-Host ""
Write-Host "If dry run cannot find a thread, open Codex once or pass --cwd, --thread-id, --rollout, or --state-db manually."
