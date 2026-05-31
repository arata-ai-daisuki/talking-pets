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

if (-not (Test-Path $Config)) {
  throw "設定ファイルがありません。先に .\install.ps1 を実行してください。"
}

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  throw "Node.js 22 or later is required for Windows support."
}

$NodeVersion = & node --version
$NodeMajor = [int](& node -p "Number(process.versions.node.split('.')[0])")
if ($NodeMajor -lt 22) {
  throw "Node.js 22 or later is required for Windows support; found $NodeVersion."
}

node --no-warnings scripts/check-config-files.mjs | Out-Null

Clear-LocalConfig
$LineNumber = 0
Get-Content $Config | ForEach-Object {
  $LineNumber += 1
  $Line = $_
  if ($LineNumber -eq 1) {
    $Line = $Line.TrimStart([char]0xFEFF)
  }
  if ($Line -match '^([A-Z0-9_]+)="([^"]*)"$') {
    if ($AllowedConfigKeys -notcontains $Matches[1]) {
      Clear-LocalConfig
      throw "未対応の設定キーです: $($Matches[1])"
    }
    [Environment]::SetEnvironmentVariable($Matches[1], $Matches[2], "Process")
  } elseif ($Line.Trim()) {
    Clear-LocalConfig
    throw "設定ファイルの形式が不正です: .talking-pets.local.env (line $LineNumber)"
  }
}

$tts = if ($env:TALKING_PETS_TTS) { $env:TALKING_PETS_TTS } else { "auto" }
$routeArg = if ($env:TALKING_PETS_LANGUAGE_ROUTE -eq "0") { "--no-language-route" } else { "--language-route" }

$args = @(
  "scripts/pet-rollout-monitor.mjs",
  "--tts", $tts,
  "--voicebox-url", $(if ($env:TALKING_PETS_VOICEVOX_URL) { $env:TALKING_PETS_VOICEVOX_URL } else { "http://127.0.0.1:50021" }),
  "--voicebox-mode", $(if ($env:TALKING_PETS_VOICEBOX_MODE) { $env:TALKING_PETS_VOICEBOX_MODE } else { "voicevox" }),
  "--voicebox-speaker", $(if ($env:TALKING_PETS_VOICEVOX_SPEAKER) { $env:TALKING_PETS_VOICEVOX_SPEAKER } else { "3" }),
  "--kokoro-voice", $(if ($env:TALKING_PETS_KOKORO_VOICE) { $env:TALKING_PETS_KOKORO_VOICE } else { "af_heart" }),
  "--voice", $(if ($env:TALKING_PETS_SAY_VOICE) { $env:TALKING_PETS_SAY_VOICE } else { "Kyoko" }),
  $routeArg,
  "--skip-existing"
)

if ($env:TALKING_PETS_SPEECH_LANGUAGE) {
  $args += @("--speech-language", $env:TALKING_PETS_SPEECH_LANGUAGE)
}

if ($env:TALKING_PETS_VOICEBOX_PROFILE) {
  $args += @("--voicebox-profile", $env:TALKING_PETS_VOICEBOX_PROFILE)
}
if ($env:TALKING_PETS_VOICEBOX_LANGUAGE) {
  $args += @("--voicebox-language", $env:TALKING_PETS_VOICEBOX_LANGUAGE)
}

node --no-warnings @args
