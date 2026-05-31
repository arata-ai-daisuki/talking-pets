param(
  [ValidateSet("en", "ja")]
  [string]$Language = "en",
  [ValidateSet("auto", "voicevox", "voicebox", "kokoro", "say")]
  [string]$Tts = "auto",
  [string]$VoicevoxUrl = "http://127.0.0.1:50021",
  [string]$VoicevoxSpeaker = "3",
  [ValidateSet("voicevox", "generic")]
  [string]$VoiceboxMode = "voicevox",
  [string]$VoiceboxProfile = "",
  [string]$VoiceboxLanguage = "",
  [string]$KokoroVoice = "af_heart",
  [string]$SayVoice = "Kyoko",
  [ValidateSet("auto", "ja", "en", "ko", "zh", "other")]
  [string]$SpeechLanguage = "auto"
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Config = Join-Path $Root ".talking-pets.local.env"

Set-Location $Root

function Write-Localized {
  param(
    [string]$English,
    [string]$Japanese
  )
  if ($Language -eq "ja") {
    Write-Host $Japanese
  } else {
    Write-Host $English
  }
}

function Throw-Localized {
  param(
    [string]$English,
    [string]$Japanese
  )
  if ($Language -eq "ja") {
    throw $Japanese
  } else {
    throw $English
  }
}

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Throw-Localized "Node.js was not found. Windows support requires Node.js 22 or later." "Node.js が見つかりません。Windows版は Node.js 22 以上が必要です。"
}

$NodeMajor = [int](& node -p "Number(process.versions.node.split('.')[0])")
if ($NodeMajor -lt 22) {
  Throw-Localized "Node.js 22 or later is required. Current version: $(& node --version)" "Node.js 22 以上が必要です。現在のバージョン: $(& node --version)"
}

if ($Tts -eq "auto" -or $Tts -eq "kokoro") {
  if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Throw-Localized "npm was not found. Kokoro requires npm." "npm が見つかりません。Kokoro を使うには npm が必要です。"
  }
  npm ci
}

if ($Tts -eq "auto" -or $Tts -eq "voicevox") {
  try {
    Invoke-RestMethod -Uri "$VoicevoxUrl/version" -Method Get | Out-Null
    Write-Localized "VOICEVOX engine is reachable." "VOICEVOX engine を確認しました。"
  } catch {
    Write-Localized "VOICEVOX engine was not reachable. Start VOICEVOX and then run check.ps1." "VOICEVOX engine に接続できませんでした。VOICEVOXを起動してから check.ps1 を実行してください。"
  }
}

$VoiceboxConfig = ""
if ($Tts -eq "voicebox") {
  $VoiceboxConfig = @"
TALKING_PETS_VOICEBOX_MODE="$VoiceboxMode"
"@
  if ($VoiceboxProfile) {
    $VoiceboxConfig += "`nTALKING_PETS_VOICEBOX_PROFILE=`"$VoiceboxProfile`""
  }
  if ($VoiceboxLanguage) {
    $VoiceboxConfig += "`nTALKING_PETS_VOICEBOX_LANGUAGE=`"$VoiceboxLanguage`""
  }
}

@"
TALKING_PETS_UI_LANGUAGE="$Language"
TALKING_PETS_TTS="$Tts"
TALKING_PETS_VOICEVOX_URL="$VoicevoxUrl"
TALKING_PETS_VOICEVOX_SPEAKER="$VoicevoxSpeaker"
$VoiceboxConfig
TALKING_PETS_KOKORO_VOICE="$KokoroVoice"
TALKING_PETS_SAY_VOICE="$SayVoice"
TALKING_PETS_LANGUAGE_ROUTE="$(if ($Tts -eq "auto") { "1" } else { "0" })"
TALKING_PETS_SPEECH_LANGUAGE="$SpeechLanguage"
"@ | Set-Content -Encoding UTF8 $Config

Write-Localized "Saved config: .talking-pets.local.env" "設定を保存しました: .talking-pets.local.env"
Write-Localized "Start: .\start-selected-tts.ps1" "起動: .\start-selected-tts.ps1"
