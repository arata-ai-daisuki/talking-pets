#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="$ROOT_DIR/.talking-pets.local.env"

cd "$ROOT_DIR"

clear_config() {
  unset TALKING_PETS_UI_LANGUAGE
  unset TALKING_PETS_TTS
  unset TALKING_PETS_VOICEVOX_URL
  unset TALKING_PETS_VOICEVOX_SPEAKER
  unset TALKING_PETS_VOICEBOX_MODE
  unset TALKING_PETS_VOICEBOX_PROFILE
  unset TALKING_PETS_VOICEBOX_LANGUAGE
  unset TALKING_PETS_KOKORO_VOICE
  unset TALKING_PETS_SAY_VOICE
  unset TALKING_PETS_LANGUAGE_ROUTE
  unset TALKING_PETS_SPEECH_LANGUAGE
}

load_config() {
  local line key value line_number
  line_number=0
  clear_config
  while IFS= read -r line || [[ -n "$line" ]]; do
    line_number=$((line_number + 1))
    line="${line%$'\r'}"
    [[ "$line_number" -eq 1 ]] && line="${line#$'\xef\xbb\xbf'}"
    [[ -z "$line" ]] && continue
    if [[ "$line" =~ ^([A-Z0-9_]+)=\"([^\"]*)\"$ ]]; then
      key="${BASH_REMATCH[1]}"
      value="${BASH_REMATCH[2]}"
      case "$key" in
        TALKING_PETS_UI_LANGUAGE|TALKING_PETS_TTS|TALKING_PETS_VOICEVOX_URL|TALKING_PETS_VOICEVOX_SPEAKER|TALKING_PETS_VOICEBOX_MODE|TALKING_PETS_VOICEBOX_PROFILE|TALKING_PETS_VOICEBOX_LANGUAGE|TALKING_PETS_KOKORO_VOICE|TALKING_PETS_SAY_VOICE|TALKING_PETS_LANGUAGE_ROUTE|TALKING_PETS_SPEECH_LANGUAGE) ;;
        *)
          echo "Unsupported config key: $key"
          clear_config
          exit 2
          ;;
      esac
      export "$key=$value"
    else
      echo "Invalid config format: .talking-pets.local.env"
      echo "Invalid line number: $line_number"
      clear_config
      exit 2
    fi
  done < "$CONFIG_FILE"
}

if [[ ! -f "$CONFIG_FILE" ]]; then
  echo "Config file not found. Create one first, for example:"
  echo "cp presets/examples/privacy-first-say.env .talking-pets.local.env"
  exit 2
fi

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js 22 or later is required for Linux support."
  exit 2
fi

node_major="$(node -p "Number(process.versions.node.split('.')[0])" 2>/dev/null || echo 0)"
if [[ "$node_major" -lt 22 ]]; then
  echo "Node.js 22 or later is required for Linux support."
  exit 2
fi

node --no-warnings "$ROOT_DIR/scripts/check-config-files.mjs" >/dev/null
load_config

tts="${TALKING_PETS_TTS:-auto}"
language_route="${TALKING_PETS_LANGUAGE_ROUTE:-1}"
route_args=()
speech_args=()
voicebox_config_args=(
  --voicebox-url "${TALKING_PETS_VOICEVOX_URL:-http://127.0.0.1:50021}"
  --voicebox-mode "${TALKING_PETS_VOICEBOX_MODE:-voicevox}"
  --voicebox-speaker "${TALKING_PETS_VOICEVOX_SPEAKER:-3}"
)

if [[ "$language_route" == "1" ]]; then
  route_args+=(--language-route)
else
  route_args+=(--no-language-route)
fi

if [[ -n "${TALKING_PETS_SPEECH_LANGUAGE:-}" ]]; then
  speech_args+=(--speech-language "$TALKING_PETS_SPEECH_LANGUAGE")
fi
[[ -n "${TALKING_PETS_VOICEBOX_PROFILE:-}" ]] && voicebox_config_args+=(--voicebox-profile "$TALKING_PETS_VOICEBOX_PROFILE")
[[ -n "${TALKING_PETS_VOICEBOX_LANGUAGE:-}" ]] && voicebox_config_args+=(--voicebox-language "$TALKING_PETS_VOICEBOX_LANGUAGE")

case "$tts" in
  auto)
    exec node --no-warnings "$ROOT_DIR/scripts/pet-rollout-monitor.mjs" \
      --tts auto \
      "${voicebox_config_args[@]}" \
      --kokoro-voice "${TALKING_PETS_KOKORO_VOICE:-af_heart}" \
      --voice "${TALKING_PETS_SAY_VOICE:-Kyoko}" \
      "${speech_args[@]}" \
      "${route_args[@]}" \
      --skip-existing
    ;;
  voicevox)
    exec node --no-warnings "$ROOT_DIR/scripts/pet-rollout-monitor.mjs" \
      --tts voicevox \
      --voicebox-url "${TALKING_PETS_VOICEVOX_URL:-http://127.0.0.1:50021}" \
      --voicebox-mode "${TALKING_PETS_VOICEBOX_MODE:-voicevox}" \
      --voicebox-speaker "${TALKING_PETS_VOICEVOX_SPEAKER:-3}" \
      "${speech_args[@]}" \
      "${route_args[@]}" \
      --skip-existing
    ;;
  voicebox)
    exec node --no-warnings "$ROOT_DIR/scripts/pet-rollout-monitor.mjs" \
      --tts voicebox \
      "${voicebox_config_args[@]}" \
      "${speech_args[@]}" \
      "${route_args[@]}" \
      --skip-existing
    ;;
  kokoro)
    exec node --no-warnings "$ROOT_DIR/scripts/pet-rollout-monitor.mjs" \
      --tts kokoro \
      --kokoro-voice "${TALKING_PETS_KOKORO_VOICE:-af_heart}" \
      "${speech_args[@]}" \
      "${route_args[@]}" \
      --skip-existing
    ;;
  say)
    exec node --no-warnings "$ROOT_DIR/scripts/pet-rollout-monitor.mjs" \
      --tts say \
      --voice "${TALKING_PETS_SAY_VOICE:-Kyoko}" \
      "${speech_args[@]}" \
      "${route_args[@]}" \
      --skip-existing
    ;;
  *)
    echo "Unsupported TTS: $tts"
    exit 2
    ;;
esac
