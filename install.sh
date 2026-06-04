#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="$ROOT_DIR/.talking-pets.local.env"

cd "$ROOT_DIR"

default_ui_lang() {
  case "${LANG:-}" in
    ja*) echo "ja" ;;
    *) echo "en" ;;
  esac
}

need_node() {
  if ! command -v node >/dev/null 2>&1; then
    echo "Node.js was not found. Linux support requires Node.js 22 or later."
    return 1
  fi
  node_major="$(node -p "Number(process.versions.node.split('.')[0])" 2>/dev/null || echo 0)"
  if [[ "$node_major" -lt 22 ]]; then
    echo "Node.js 22 or later is required. Current version: $(node --version)"
    return 1
  fi
}

need_npm() {
  if ! command -v npm >/dev/null 2>&1; then
    echo "npm was not found. Kokoro requires npm."
    return 1
  fi
}

write_config() {
  local speech_language="${8:-auto}"
  local voicebox_mode="${9:-}"
  local voicebox_profile="${10:-}"
  local voicebox_language="${11:-}"
  local irodori_url="${12:-}"
  local irodori_voice="${13:-}"
  cat > "$CONFIG_FILE" <<EOF
TALKING_PETS_UI_LANGUAGE="$7"
TALKING_PETS_TTS="$1"
TALKING_PETS_VOICEVOX_URL="$2"
TALKING_PETS_VOICEVOX_SPEAKER="$3"
EOF
  if [[ -n "$voicebox_mode" ]]; then
    cat >> "$CONFIG_FILE" <<EOF
TALKING_PETS_VOICEBOX_MODE="$voicebox_mode"
EOF
  fi
  if [[ -n "$voicebox_profile" ]]; then
    cat >> "$CONFIG_FILE" <<EOF
TALKING_PETS_VOICEBOX_PROFILE="$voicebox_profile"
EOF
  fi
  if [[ -n "$voicebox_language" ]]; then
    cat >> "$CONFIG_FILE" <<EOF
TALKING_PETS_VOICEBOX_LANGUAGE="$voicebox_language"
EOF
  fi
  cat >> "$CONFIG_FILE" <<EOF
TALKING_PETS_KOKORO_VOICE="$4"
TALKING_PETS_SAY_VOICE="$5"
TALKING_PETS_LANGUAGE_ROUTE="$6"
TALKING_PETS_SPEECH_LANGUAGE="$speech_language"
EOF
  if [[ -n "$irodori_url" ]]; then
    cat >> "$CONFIG_FILE" <<EOF
TALKING_PETS_IRODORI_URL="$irodori_url"
EOF
  fi
  if [[ -n "$irodori_voice" ]]; then
    cat >> "$CONFIG_FILE" <<EOF
TALKING_PETS_IRODORI_VOICE="$irodori_voice"
EOF
  fi
}

echo
echo "Talking Pets Linux installer"
echo "============================"

ui_lang="$(default_ui_lang)"
printf "Language / 表示言語 [en/ja] [%s]: " "$ui_lang"
read -r input
case "${input:-$ui_lang}" in
  ja|jp|日本語|2) ui_lang="ja" ;;
  *) ui_lang="en" ;;
esac

echo "Choose a local TTS provider."
echo "1) Auto routing (Japanese=VOICEVOX / English=Kokoro / other=Linux espeak)"
echo "2) VOICEVOX / Zundamon Normal (recommended for Japanese)"
echo "3) Kokoro.js (local, mostly English voices)"
echo "4) Linux espeak (no npm model download)"
echo "5) Voicebox-compatible endpoint"
echo "6) Irodori-TTS Server (experimental, start server separately)"
printf "Choice [1]: "
read -r choice
choice="${choice:-1}"

voicevox_url="http://127.0.0.1:50021"
voicevox_speaker="3"
kokoro_voice="af_heart"
say_voice="Kyoko"
language_route="1"
voicebox_mode="generic"
voicebox_profile="default"
voicebox_language="en"
irodori_url="http://127.0.0.1:8088"
irodori_voice="none"

case "$choice" in
  1)
    need_node
    need_npm
    printf "VOICEVOX URL [%s]: " "$voicevox_url"
    read -r input
    voicevox_url="${input:-$voicevox_url}"
    printf "VOICEVOX speaker/style id [%s = Zundamon Normal]: " "$voicevox_speaker"
    read -r input
    voicevox_speaker="${input:-$voicevox_speaker}"
    printf "Kokoro voice [%s]: " "$kokoro_voice"
    read -r input
    kokoro_voice="${input:-$kokoro_voice}"
    echo "Running npm ci. The first run may take a little while."
    npm ci
    if command -v curl >/dev/null 2>&1 && curl -fsS "$voicevox_url/version" >/dev/null 2>&1; then
      echo "VOICEVOX engine is reachable."
    else
      echo "VOICEVOX engine was not reachable. Start VOICEVOX and then run ./check.sh."
    fi
    write_config "auto" "$voicevox_url" "$voicevox_speaker" "$kokoro_voice" "$say_voice" "$language_route" "$ui_lang" "auto"
    ;;
  2)
    need_node
    printf "VOICEVOX URL [%s]: " "$voicevox_url"
    read -r input
    voicevox_url="${input:-$voicevox_url}"
    printf "VOICEVOX speaker/style id [%s = Zundamon Normal]: " "$voicevox_speaker"
    read -r input
    voicevox_speaker="${input:-$voicevox_speaker}"
    if command -v curl >/dev/null 2>&1 && curl -fsS "$voicevox_url/version" >/dev/null 2>&1; then
      echo "VOICEVOX engine is reachable."
    else
      echo "VOICEVOX engine was not reachable. Start VOICEVOX and run ./check.sh later."
    fi
    write_config "voicevox" "$voicevox_url" "$voicevox_speaker" "$kokoro_voice" "$say_voice" "0" "$ui_lang" "auto"
    ;;
  3)
    need_node
    need_npm
    printf "Kokoro voice [%s]: " "$kokoro_voice"
    read -r input
    kokoro_voice="${input:-$kokoro_voice}"
    echo "Running npm ci. The first run may take a little while."
    npm ci
    write_config "kokoro" "$voicevox_url" "$voicevox_speaker" "$kokoro_voice" "$say_voice" "0" "$ui_lang" "auto"
    ;;
  4)
    need_node
    if ! command -v espeak >/dev/null 2>&1; then
      echo "Linux espeak was not found. Install espeak or choose another TTS provider."
    fi
    write_config "say" "$voicevox_url" "$voicevox_speaker" "$kokoro_voice" "$say_voice" "0" "$ui_lang" "auto"
    ;;
  5)
    need_node
    printf "Voicebox endpoint URL [%s]: " "http://127.0.0.1:8080"
    read -r input
    voicevox_url="${input:-http://127.0.0.1:8080}"
    printf "Voicebox mode [generic/voicevox] [%s]: " "$voicebox_mode"
    read -r input
    voicebox_mode="${input:-$voicebox_mode}"
    case "$voicebox_mode" in
      generic|voicevox) ;;
      *)
        echo "Voicebox mode must be generic or voicevox."
        exit 2
        ;;
    esac
    printf "Voicebox profile [%s]: " "$voicebox_profile"
    read -r input
    voicebox_profile="${input:-$voicebox_profile}"
    printf "Voicebox language [%s]: " "$voicebox_language"
    read -r input
    voicebox_language="${input:-$voicebox_language}"
    write_config "voicebox" "$voicevox_url" "$voicevox_speaker" "$kokoro_voice" "$say_voice" "0" "$ui_lang" "auto" "$voicebox_mode" "$voicebox_profile" "$voicebox_language"
    ;;
  6)
    need_node
    printf "Irodori-TTS Server URL [%s]: " "$irodori_url"
    read -r input
    irodori_url="${input:-$irodori_url}"
    printf "Irodori voice id [%s]: " "$irodori_voice"
    read -r input
    irodori_voice="${input:-$irodori_voice}"
    if command -v curl >/dev/null 2>&1 && curl -fsS "$irodori_url/health" >/dev/null 2>&1; then
      echo "Irodori-TTS Server is reachable."
    else
      echo "Irodori-TTS Server was not reachable. Start Irodori-TTS-Server and run ./check.sh later."
    fi
    write_config "irodori" "$voicevox_url" "$voicevox_speaker" "$kokoro_voice" "$say_voice" "0" "$ui_lang" "auto" "" "" "" "$irodori_url" "$irodori_voice"
    ;;
  *)
    echo "Unknown choice: $choice"
    exit 2
    ;;
esac

chmod +x "$ROOT_DIR/check.sh" 2>/dev/null || true
chmod +x "$ROOT_DIR/start-selected-tts.sh" 2>/dev/null || true

echo
echo "Saved config: .talking-pets.local.env"
echo "MeloTTS is not installed by this installer. If you already run an external MeloTTS runtime, health-check it with:"
echo "  npm run monitor:node -- --tts melotts --list-voices --melotts-url http://127.0.0.1:3399/health"
echo "Start Talking Pets with:"
echo
echo "  ./start-selected-tts.sh"
echo
