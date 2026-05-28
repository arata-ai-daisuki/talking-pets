param(
  [ValidateSet("auto", "voicevox", "kokoro", "say")]
  [string]$Tts = "auto",
  [string]$VoicevoxUrl = "http://127.0.0.1:50021",
  [string]$VoicevoxSpeaker = "3",
  [string]$KokoroVoice = "af_heart",
  [string]$SayVoice = ""
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Config = Join-Path $Root ".talking-pets.local.env"

Set-Location $Root

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  throw "Node.js が見つかりません。Windows版は Node.js 22 以上が必要です。"
}

$NodeMajor = [int](& node -p "Number(process.versions.node.split('.')[0])")
if ($NodeMajor -lt 22) {
  throw "Node.js 22 以上が必要です。現在のバージョン: $(& node --version)"
}

if ($Tts -eq "auto" -or $Tts -eq "kokoro") {
  if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    throw "npm が見つかりません。Kokoro を使うには npm が必要です。"
  }
  npm install
}

if ($Tts -eq "auto" -or $Tts -eq "voicevox") {
  try {
    Invoke-RestMethod -Uri "$VoicevoxUrl/version" -Method Get | Out-Null
    Write-Host "VOICEVOX engine を確認しました。"
  } catch {
    Write-Host "VOICEVOX engine に接続できませんでした。VOICEVOXを起動してから check.ps1 を実行してください。"
  }
}

@"
TALKING_PETS_TTS="$Tts"
TALKING_PETS_VOICEVOX_URL="$VoicevoxUrl"
TALKING_PETS_VOICEVOX_SPEAKER="$VoicevoxSpeaker"
TALKING_PETS_KOKORO_VOICE="$KokoroVoice"
TALKING_PETS_SAY_VOICE="$SayVoice"
TALKING_PETS_LANGUAGE_ROUTE="$(if ($Tts -eq "auto") { "1" } else { "0" })"
"@ | Set-Content -Encoding UTF8 $Config

Write-Host "設定を保存しました: $Config"
Write-Host "起動: .\start-selected-tts.ps1"
