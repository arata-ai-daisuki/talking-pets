#!/bin/zsh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
CONFIG_FILE="$ROOT_DIR/.talking-pets.local.env"

cd "$ROOT_DIR"

if [[ -f "$CONFIG_FILE" ]]; then
  source "$CONFIG_FILE"
else
  echo "設定ファイルがありません。先に ./install.command を実行してください。"
  exit 2
fi

tts="${TALKING_PETS_TTS:-auto}"
language_route="${TALKING_PETS_LANGUAGE_ROUTE:-1}"
route_args=()

if [[ "$language_route" == "1" ]]; then
  route_args+=(--language-route)
else
  route_args+=(--no-language-route)
fi

case "$tts" in
  auto)
    exec "$ROOT_DIR/scripts/pet-rollout-monitor.command" \
      --tts auto \
      --voicebox-url "${TALKING_PETS_VOICEVOX_URL:-http://127.0.0.1:50021}" \
      --voicebox-speaker "${TALKING_PETS_VOICEVOX_SPEAKER:-3}" \
      --kokoro-voice "${TALKING_PETS_KOKORO_VOICE:-af_heart}" \
      --voice "${TALKING_PETS_SAY_VOICE:-Kyoko}" \
      "${route_args[@]}" \
      --skip-existing
    ;;
  voicevox)
    exec "$ROOT_DIR/scripts/pet-rollout-monitor.command" \
      --tts voicevox \
      --voicebox-url "${TALKING_PETS_VOICEVOX_URL:-http://127.0.0.1:50021}" \
      --voicebox-speaker "${TALKING_PETS_VOICEVOX_SPEAKER:-3}" \
      "${route_args[@]}" \
      --skip-existing
    ;;
  kokoro)
    exec "$ROOT_DIR/scripts/pet-rollout-monitor.command" \
      --tts kokoro \
      --kokoro-voice "${TALKING_PETS_KOKORO_VOICE:-af_heart}" \
      "${route_args[@]}" \
      --skip-existing
    ;;
  say)
    exec "$ROOT_DIR/scripts/pet-rollout-monitor.command" \
      --tts say \
      --voice "${TALKING_PETS_SAY_VOICE:-Kyoko}" \
      "${route_args[@]}" \
      --skip-existing
    ;;
  *)
    echo "未対応のTTSです: $tts"
    exit 2
    ;;
esac
