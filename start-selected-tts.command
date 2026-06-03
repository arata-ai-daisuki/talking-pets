#!/bin/zsh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
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
    (( line_number += 1 ))
    line="${line%$'\r'}"
    [[ "$line_number" -eq 1 ]] && line="${line#$'\xef\xbb\xbf'}"
    [[ -z "$line" ]] && continue
    if [[ "$line" =~ '^([A-Z0-9_]+)="([^"]*)"$' ]]; then
      key="${match[1]}"
      value="${match[2]}"
      case "$key" in
        TALKING_PETS_UI_LANGUAGE|TALKING_PETS_TTS|TALKING_PETS_VOICEVOX_URL|TALKING_PETS_VOICEVOX_SPEAKER|TALKING_PETS_VOICEBOX_MODE|TALKING_PETS_VOICEBOX_PROFILE|TALKING_PETS_VOICEBOX_LANGUAGE|TALKING_PETS_KOKORO_VOICE|TALKING_PETS_SAY_VOICE|TALKING_PETS_LANGUAGE_ROUTE|TALKING_PETS_SPEECH_LANGUAGE) ;;
        *)
          echo "未対応の設定キーです: $key"
          clear_config
          exit 2
          ;;
      esac
      export "$key=$value"
    else
      echo "設定ファイルの形式が不正です: .talking-pets.local.env"
      echo "問題の行番号: $line_number"
      clear_config
      exit 2
    fi
  done < "$CONFIG_FILE"
}

if [[ -f "$CONFIG_FILE" ]]; then
  if command -v node >/dev/null 2>&1; then
    node --no-warnings "$ROOT_DIR/scripts/check-config-files.mjs" >/dev/null
  fi
  load_config
else
  echo "設定ファイルがありません。先に ./install.command を実行してください。"
  exit 2
fi

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
    exec "$ROOT_DIR/scripts/pet-rollout-monitor.command" \
      --tts auto \
      "${voicebox_config_args[@]}" \
      --kokoro-voice "${TALKING_PETS_KOKORO_VOICE:-af_heart}" \
      --irodori-url "${TALKING_PETS_IRODORI_URL:-http://127.0.0.1:8088}" \
      --irodori-voice "${TALKING_PETS_IRODORI_VOICE:-none}" \
      --voice "${TALKING_PETS_SAY_VOICE:-Kyoko}" \
      "${speech_args[@]}" \
      "${route_args[@]}" \
      --skip-existing
    ;;
  voicevox)
    exec "$ROOT_DIR/scripts/pet-rollout-monitor.command" \
      --tts voicevox \
      --voicebox-url "${TALKING_PETS_VOICEVOX_URL:-http://127.0.0.1:50021}" \
      --voicebox-mode "${TALKING_PETS_VOICEBOX_MODE:-voicevox}" \
      --voicebox-speaker "${TALKING_PETS_VOICEVOX_SPEAKER:-3}" \
      "${speech_args[@]}" \
      "${route_args[@]}" \
      --skip-existing
    ;;
  voicebox)
    exec "$ROOT_DIR/scripts/pet-rollout-monitor.command" \
      --tts voicebox \
      "${voicebox_config_args[@]}" \
      "${speech_args[@]}" \
      "${route_args[@]}" \
      --skip-existing
    ;;
  kokoro)
    exec "$ROOT_DIR/scripts/pet-rollout-monitor.command" \
      --tts kokoro \
      --kokoro-voice "${TALKING_PETS_KOKORO_VOICE:-af_heart}" \
      "${speech_args[@]}" \
      "${route_args[@]}" \
      --skip-existing
    ;;
  irodori)
    exec "$ROOT_DIR/scripts/pet-rollout-monitor.command" \
      --tts irodori \
      --irodori-url "${TALKING_PETS_IRODORI_URL:-http://127.0.0.1:8088}" \
      --irodori-voice "${TALKING_PETS_IRODORI_VOICE:-none}" \
      "${route_args[@]}" \
      --skip-existing
    ;;
  say)
    exec "$ROOT_DIR/scripts/pet-rollout-monitor.command" \
      --tts say \
      --voice "${TALKING_PETS_SAY_VOICE:-Kyoko}" \
      "${speech_args[@]}" \
      "${route_args[@]}" \
      --skip-existing
    ;;
  *)
    echo "未対応のTTSです: $tts"
    exit 2
    ;;
esac
