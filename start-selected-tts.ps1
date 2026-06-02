$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Config = Join-Path $Root ".talking-pets.local.env"

Set-Location $Root

if (-not (Test-Path $Config)) {
  throw "設定ファイルがありません。先に .\install.ps1 を実行してください。"
}

Get-Content $Config | ForEach-Object {
  if ($_ -match '^([^=]+)="(.*)"$') {
    [Environment]::SetEnvironmentVariable($Matches[1], $Matches[2], "Process")
  }
}

$tts = if ($env:TALKING_PETS_TTS) { $env:TALKING_PETS_TTS } else { "auto" }
$routeArg = if ($env:TALKING_PETS_LANGUAGE_ROUTE -eq "1") { "--language-route" } else { "--no-language-route" }

$args = @(
  "scripts/pet-rollout-monitor.mjs",
  "--tts", $tts,
  "--voicebox-url", $(if ($env:TALKING_PETS_VOICEVOX_URL) { $env:TALKING_PETS_VOICEVOX_URL } else { "http://127.0.0.1:50021" }),
  "--voicebox-speaker", $(if ($env:TALKING_PETS_VOICEVOX_SPEAKER) { $env:TALKING_PETS_VOICEVOX_SPEAKER } else { "3" }),
  "--kokoro-voice", $(if ($env:TALKING_PETS_KOKORO_VOICE) { $env:TALKING_PETS_KOKORO_VOICE } else { "af_heart" }),
  "--irodori-url", $(if ($env:TALKING_PETS_IRODORI_URL) { $env:TALKING_PETS_IRODORI_URL } else { "http://127.0.0.1:8088" }),
  "--irodori-voice", $(if ($env:TALKING_PETS_IRODORI_VOICE) { $env:TALKING_PETS_IRODORI_VOICE } else { "none" }),
  $routeArg,
  "--skip-existing"
)

node @args
