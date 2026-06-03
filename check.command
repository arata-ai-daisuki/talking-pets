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
          echo "config: unsupported key ($key)"
          clear_config
          return 1
          ;;
      esac
      export "$key=$value"
    else
      echo "config: invalid format (.talking-pets.local.env)"
      echo "invalid line: $line_number"
      clear_config
      return 1
    fi
  done < "$CONFIG_FILE"
}

redact_endpoint_for_log() {
  case "$1" in
    http://127.0.0.1:*|http://localhost:*|http://[::1]:*)
      echo "$1"
      ;;
    *)
      echo "<redacted endpoint>"
      ;;
  esac
}

echo "Talking Pets check"
echo "=================="
echo "platform: macOS $(sw_vers -productVersion 2>/dev/null || echo unknown) / $(uname -m)"

config_status=0
clear_config
if [[ -f "$CONFIG_FILE" ]]; then
  if load_config; then
    echo "config: .talking-pets.local.env"
    echo "config source: local file (.talking-pets.local.env)"
    echo "tts: ${TALKING_PETS_TTS:-unset}"
    echo "speech language: ${TALKING_PETS_SPEECH_LANGUAGE:-auto}"
  else
    config_status=1
    echo "config source: invalid local file (.talking-pets.local.env)"
    echo "tts: unset"
    echo "speech language: auto"
  fi
else
  echo "config: not found"
  echo "config source: none"
  echo "tts: unset"
  echo "speech language: auto"
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

if command -v node >/dev/null 2>&1 && [[ "${node_major:-0}" -ge 22 ]]; then
  node --no-warnings "$ROOT_DIR/scripts/check-node-runtime.mjs" || true
else
  echo "node runtime: skipped -> Node.js 22 or later is required"
fi

if [[ -d node_modules ]]; then
  echo "node_modules: found"
else
  echo "node_modules: not found -> run npm ci if you use Kokoro.js"
fi

voicevox_url="${TALKING_PETS_VOICEVOX_URL:-http://127.0.0.1:50021}"
voicevox_url_for_log="$(redact_endpoint_for_log "$voicevox_url")"
if curl -fsS "$voicevox_url/version" >/dev/null 2>&1; then
  echo "VOICEVOX: ok ($voicevox_url_for_log)"
  echo "VOICEVOX speakers: ./scripts/pet-rollout-monitor.command --tts voicevox --list-voices"
else
  echo "VOICEVOX: not reachable ($voicevox_url_for_log) -> start VOICEVOX Engine or choose another TTS"
fi

irodori_url="${TALKING_PETS_IRODORI_URL:-http://127.0.0.1:8088}"
irodori_voice="${TALKING_PETS_IRODORI_VOICE:-none}"
if [[ "${TALKING_PETS_TTS:-}" == "irodori" ]]; then
  if curl -fsS "$irodori_url/health" >/dev/null 2>&1; then
    echo "Irodori-TTS Server: ok ($irodori_url)"
    echo "Irodori voice: $irodori_voice"
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
echo "compat:"
if command -v node >/dev/null 2>&1 && [[ "${node_major:-0}" -ge 22 ]]; then
  node --no-warnings "$ROOT_DIR/scripts/check-codex-compat.mjs" --no-state || true
else
  echo "compat: skipped -> Node.js 22 or later is required"
fi

echo
echo "audio path:"
if command -v node >/dev/null 2>&1 && [[ "${node_major:-0}" -ge 22 ]]; then
  node --no-warnings "$ROOT_DIR/scripts/check-audio-path.mjs" || true
else
  echo "audio path: skipped -> Node.js 22 or later is required"
fi

echo
echo "config files:"
if command -v node >/dev/null 2>&1 && [[ "${node_major:-0}" -ge 22 ]]; then
  if ! node --no-warnings "$ROOT_DIR/scripts/check-config-files.mjs"; then
    config_status=1
  fi
else
  echo "config files: skipped -> Node.js 22 or later is required"
fi

echo
echo "dry run:"
"$ROOT_DIR/scripts/pet-rollout-monitor.command" --once --dry-run --rollout test/fixtures/assistant-rollout.jsonl || true
echo
echo "This check skips local Codex state paths. Run npm run check:compat separately for stateful local Codex verification, then sanitize before sharing."
echo "For manual local dry-run debugging, pass --cwd, --thread-id, --rollout, or --state-db to the monitor directly."
echo "Before sharing this output publicly, remove private paths, conversation text, local env values, credentials, credential env/header values, local SQLite DBs such as state_5.sqlite, private rollout JSONL, generated audio, local recordings, archives, macOS metadata, and downloaded model files. Known public fixture rollout paths may remain visible as evidence."
if [[ "$config_status" -ne 0 ]]; then
  echo "check: failed -> fix .talking-pets.local.env and rerun ./install.command or npm run check:config"
  exit "$config_status"
fi
