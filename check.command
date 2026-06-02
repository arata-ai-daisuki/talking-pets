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
  node_version="$(node --version)"
  node_major="$(node -p "Number(process.versions.node.split('.')[0])" 2>/dev/null || echo 0)"
  if [[ "$node_major" -ge 22 ]]; then
    echo "node: ok ($node_version)"
  else
    echo "node: too old ($node_version) -> install Node.js 22 or later"
  fi
else
  echo "node: not found -> install Node.js 22 or later"
fi

if command -v npm >/dev/null 2>&1; then
  echo "npm: ok ($(npm --version))"
else
  echo "npm: not found -> needed for Kokoro.js and auto routing"
fi

if [[ -d node_modules ]]; then
  echo "node_modules: found"
else
  echo "node_modules: not found -> run npm install if you use Kokoro.js"
fi

voicevox_url="${TALKING_PETS_VOICEVOX_URL:-http://127.0.0.1:50021}"
if curl -fsS "$voicevox_url/version" >/dev/null 2>&1; then
  echo "VOICEVOX: ok ($voicevox_url)"
  echo "VOICEVOX speakers: ./scripts/pet-rollout-monitor.command --tts voicevox --list-voices"
else
  echo "VOICEVOX: not reachable ($voicevox_url) -> start VOICEVOX Engine or choose another TTS"
fi

irodori_url="${TALKING_PETS_IRODORI_URL:-http://127.0.0.1:8088}"
if [[ "${TALKING_PETS_TTS:-}" == "irodori" ]]; then
  if curl -fsS "$irodori_url/health" >/dev/null 2>&1; then
    echo "Irodori-TTS Server: ok ($irodori_url)"
  else
    echo "Irodori-TTS Server: not reachable ($irodori_url) -> start Irodori-TTS-Server or choose another TTS"
  fi
fi

if /usr/bin/say -v "${TALKING_PETS_SAY_VOICE:-Kyoko}" "Talking Pets の確認です。" >/dev/null 2>&1; then
  echo "macOS say: ok (${TALKING_PETS_SAY_VOICE:-Kyoko})"
else
  echo "macOS say: voice check failed (${TALKING_PETS_SAY_VOICE:-Kyoko}) -> choose another say voice"
fi

echo
echo "dry run:"
"$ROOT_DIR/scripts/pet-rollout-monitor.command" --once --dry-run || true
echo
echo "If dry run cannot find a thread, open Codex once or pass --cwd, --thread-id, --rollout, or --state-db manually."
