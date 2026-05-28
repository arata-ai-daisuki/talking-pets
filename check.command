#!/bin/zsh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
CONFIG_FILE="$ROOT_DIR/.talking-pets.local.env"

cd "$ROOT_DIR"

echo "Talking Pets check"
echo "=================="

if [[ -f "$CONFIG_FILE" ]]; then
  source "$CONFIG_FILE"
  echo "config: $CONFIG_FILE"
  echo "tts: ${TALKING_PETS_TTS:-unset}"
else
  echo "config: not found"
fi

if command -v node >/dev/null 2>&1; then
  echo "node: $(node --version)"
else
  echo "node: not found"
fi

if command -v npm >/dev/null 2>&1; then
  echo "npm: $(npm --version)"
else
  echo "npm: not found"
fi

if [[ -d node_modules ]]; then
  echo "node_modules: found"
else
  echo "node_modules: not found"
fi

voicevox_url="${TALKING_PETS_VOICEVOX_URL:-http://127.0.0.1:50021}"
if curl -fsS "$voicevox_url/version" >/dev/null 2>&1; then
  echo "VOICEVOX: ok ($voicevox_url)"
  echo "VOICEVOX speakers: ./scripts/pet-rollout-monitor.command --tts voicevox --list-voices"
else
  echo "VOICEVOX: not reachable ($voicevox_url)"
fi

if /usr/bin/say -v "${TALKING_PETS_SAY_VOICE:-Kyoko}" "Talking Pets の確認です。" >/dev/null 2>&1; then
  echo "macOS say: ok (${TALKING_PETS_SAY_VOICE:-Kyoko})"
else
  echo "macOS say: voice check failed (${TALKING_PETS_SAY_VOICE:-Kyoko})"
fi

echo
echo "dry run:"
"$ROOT_DIR/scripts/pet-rollout-monitor.command" --once --dry-run || true
