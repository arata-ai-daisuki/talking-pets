$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Config = Join-Path $Root ".talking-pets.local.env"
Set-Location $Root

$AllowedConfigKeys = @(
  "TALKING_PETS_UI_LANGUAGE",
  "TALKING_PETS_TTS",
  "TALKING_PETS_VOICEVOX_URL",
  "TALKING_PETS_VOICEVOX_SPEAKER",
  "TALKING_PETS_VOICEBOX_MODE",
  "TALKING_PETS_VOICEBOX_PROFILE",
  "TALKING_PETS_VOICEBOX_LANGUAGE",
  "TALKING_PETS_KOKORO_VOICE",
  "TALKING_PETS_SAY_VOICE",
  "TALKING_PETS_LANGUAGE_ROUTE",
  "TALKING_PETS_SPEECH_LANGUAGE"
)

function Clear-LocalConfig {
  foreach ($Key in $AllowedConfigKeys) {
    [Environment]::SetEnvironmentVariable($Key, $null, "Process")
  }
}

$script:ConfigStatus = 0

function Import-LocalConfig {
  if (-not (Test-Path $Config)) {
    Write-Host "config: not found"
    return
  }

  Clear-LocalConfig
  $LineNumber = 0
  foreach ($RawLine in Get-Content $Config) {
    $LineNumber += 1
    $Line = $RawLine
    if ($LineNumber -eq 1) {
      $Line = $Line.TrimStart([char]0xFEFF)
    }
    if ($Line -match '^([A-Z0-9_]+)="([^"]*)"$') {
      if ($AllowedConfigKeys -notcontains $Matches[1]) {
        Write-Host "config: unsupported key ($($Matches[1]))"
        Clear-LocalConfig
        $script:ConfigStatus = 1
        return
      }
      [Environment]::SetEnvironmentVariable($Matches[1], $Matches[2], "Process")
    } elseif ($Line.Trim()) {
      Write-Host "config: invalid format (.talking-pets.local.env)"
      Write-Host "invalid line: $LineNumber"
      Clear-LocalConfig
      $script:ConfigStatus = 1
      return
    }
  }
  Write-Host "config: .talking-pets.local.env"
  Write-Host "config source: local file (.talking-pets.local.env)"
  Write-Host "tts: $(if ($env:TALKING_PETS_TTS) { $env:TALKING_PETS_TTS } else { "unset" })"
  Write-Host "speech language: $(if ($env:TALKING_PETS_SPEECH_LANGUAGE) { $env:TALKING_PETS_SPEECH_LANGUAGE } else { "auto" })"
}

function Invoke-NodeDiagnostic {
  param(
    [string]$Label,
    [string[]]$Arguments
  )

  & node @Arguments
  if ($LASTEXITCODE -ne 0) {
    Write-Host "$Label`: failed -> see output above"
  }
}

function Format-EndpointForLog {
  param([string]$Url)

  if ($Url -match '^http://(127\.0\.0\.1|localhost|\[::1\]):') {
    return $Url
  }
  return "<redacted endpoint>"
}

Write-Host "Talking Pets check"
Write-Host "=================="
Write-Host "platform: Windows $([System.Environment]::OSVersion.VersionString) / $([System.Runtime.InteropServices.RuntimeInformation]::OSArchitecture)"
Clear-LocalConfig
Import-LocalConfig
if (-not (Test-Path $Config)) {
  Write-Host "config source: none"
  Write-Host "tts: unset"
  Write-Host "speech language: auto"
} elseif ($script:ConfigStatus -ne 0) {
  Write-Host "config source: invalid local file (.talking-pets.local.env)"
  Write-Host "tts: unset"
  Write-Host "speech language: auto"
}

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
  $NodeMajor = 0
}

if (Get-Command npm -ErrorAction SilentlyContinue) {
  Write-Host "npm: ok ($(npm --version))"
} else {
  Write-Host "npm: not found -> needed for Kokoro.js and auto routing"
}

if ($NodeMajor -ge 22) {
  Invoke-NodeDiagnostic "node runtime" @("--no-warnings", "scripts/check-node-runtime.mjs")
} else {
  Write-Host "node runtime: skipped -> Node.js 22 or later is required"
}

if (Test-Path "node_modules") {
  Write-Host "node_modules: found"
} else {
  Write-Host "node_modules: not found -> run npm ci if you use Kokoro.js"
}

try {
  $VoicevoxUrl = if ($env:TALKING_PETS_VOICEVOX_URL) { $env:TALKING_PETS_VOICEVOX_URL } else { "http://127.0.0.1:50021" }
  $VoicevoxUrlForLog = Format-EndpointForLog $VoicevoxUrl
  Invoke-RestMethod -Uri "$VoicevoxUrl/version" -Method Get | Out-Null
  Write-Host "VOICEVOX: ok ($VoicevoxUrlForLog)"
} catch {
  Write-Host "VOICEVOX: not reachable ($VoicevoxUrlForLog) -> start VOICEVOX Engine or choose another TTS"
}

Write-Host ""
Write-Host "compat:"
if ($NodeMajor -ge 22) {
  Invoke-NodeDiagnostic "compat" @("--no-warnings", "scripts/check-codex-compat.mjs", "--no-state")
} else {
  Write-Host "compat: skipped -> Node.js 22 or later is required"
}

Write-Host ""
Write-Host "audio path:"
if ($NodeMajor -ge 22) {
  Invoke-NodeDiagnostic "audio path" @("--no-warnings", "scripts/check-audio-path.mjs")
} else {
  Write-Host "audio path: skipped -> Node.js 22 or later is required"
}

Write-Host ""
Write-Host "config files:"
if ($NodeMajor -ge 22) {
  & node --no-warnings scripts/check-config-files.mjs
  if ($LASTEXITCODE -ne 0) {
    Write-Host "config files: failed -> see output above"
    $script:ConfigStatus = 1
  }
} else {
  Write-Host "config files: skipped -> Node.js 22 or later is required"
}

Write-Host ""
Write-Host "dry run:"
if ($NodeMajor -ge 22) {
  Invoke-NodeDiagnostic "dry run" @("--no-warnings", "scripts/pet-rollout-monitor.mjs", "--once", "--dry-run", "--rollout", "test/fixtures/assistant-rollout.jsonl")
} else {
  Write-Host "dry run: skipped -> Node.js 22 or later is required"
}
Write-Host ""
Write-Host "This check skips local Codex state paths. Run npm run check:compat separately for stateful local Codex verification, then sanitize before sharing."
Write-Host "For manual local dry-run debugging, pass --cwd, --thread-id, --rollout, or --state-db to the monitor directly."
Write-Host "Before sharing this output publicly, remove private paths, conversation text, local env values, credentials, credential env/header values, local SQLite DBs such as state_5.sqlite, private rollout JSONL, generated audio, local recordings, archives, macOS metadata, and downloaded model files. Known public fixture rollout paths may remain visible as evidence."
if ($script:ConfigStatus -ne 0) {
  Write-Host "check: failed -> fix .talking-pets.local.env and rerun .\install.ps1 or npm run check:config"
  exit $script:ConfigStatus
}
