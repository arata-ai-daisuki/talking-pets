#!/bin/zsh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
CONFIG_FILE="$ROOT_DIR/.talking-pets.local.env"

cd "$ROOT_DIR"

print_header() {
  echo
  echo "Talking Pets installer"
  echo "======================"
}

default_ui_lang() {
  case "${LANG:-}" in
    ja*) echo "ja" ;;
    *) echo "en" ;;
  esac
}

is_ja() {
  [[ "${ui_lang:-en}" == "ja" ]]
}

say_line() {
  if is_ja; then
    echo "$2"
  else
    echo "$1"
  fi
}

prompt_line() {
  if is_ja; then
    printf "%s" "$2"
  else
    printf "%s" "$1"
  fi
}

prompt_format() {
  if is_ja; then
    printf "$2" "$3"
  else
    printf "$1" "$3"
  fi
}

need_node() {
  if ! command -v node >/dev/null 2>&1; then
    say_line "Node.js was not found. Kokoro / VOICEVOX integration requires Node.js 22 or later." "Node.js が見つかりません。Kokoro / VOICEVOX 連携には Node.js 22 以上が必要です。"
    say_line "If you only want macOS say, choose option 4." "macOS say だけで使う場合は、TTS選択で 4 を選んでください。"
    return 1
  fi

  node_major="$(node -p "Number(process.versions.node.split('.')[0])" 2>/dev/null || echo 0)"
  if [[ "$node_major" -lt 22 ]]; then
    say_line "Node.js 22 or later is required. Current version: $(node --version)" "Node.js 22 以上が必要です。現在のバージョン: $(node --version)"
    say_line "If you only want macOS say, choose option 4." "macOS say だけで使う場合は、TTS選択で 4 を選んでください。"
    return 1
  fi
}

need_npm() {
  if ! command -v npm >/dev/null 2>&1; then
    say_line "npm was not found. Kokoro requires npm." "npm が見つかりません。Kokoro を使うには npm が必要です。"
    return 1
  fi
}

write_config() {
  cat > "$CONFIG_FILE" <<EOF
TALKING_PETS_UI_LANGUAGE="$7"
TALKING_PETS_TTS="$1"
TALKING_PETS_VOICEVOX_URL="$2"
TALKING_PETS_VOICEVOX_SPEAKER="$3"
TALKING_PETS_KOKORO_VOICE="$4"
TALKING_PETS_SAY_VOICE="$5"
TALKING_PETS_LANGUAGE_ROUTE="$6"
TALKING_PETS_IRODORI_URL="${8:-http://127.0.0.1:8088}"
TALKING_PETS_IRODORI_VOICE="${9:-none}"
EOF
}

print_header

ui_lang="$(default_ui_lang)"
printf "Language / 表示言語 [en/ja] [%s]: " "$ui_lang"
read input
case "${input:-$ui_lang}" in
  ja|jp|日本語|2) ui_lang="ja" ;;
  *) ui_lang="en" ;;
esac

say_line "Choose a local TTS provider." "使うローカルTTSを選んでください。"
say_line "1) Auto routing (Japanese=VOICEVOX / English=Kokoro / other=say)" "1) 自動ルーティング（日本語=VOICEVOX / 英語=Kokoro / その他=say）"
say_line "2) VOICEVOX / Zundamon Normal (recommended for Japanese)" "2) VOICEVOX / ずんだもん ノーマル（日本語おすすめ）"
say_line "3) Kokoro.js (local, mostly English voices)" "3) Kokoro.js（ローカル、英語系ボイス中心）"
say_line "4) macOS say (no extra install)" "4) macOS say（追加インストールなし）"
say_line "5) Irodori-TTS Server (experimental, start server separately)" "5) Irodori-TTS Server（実験的、別途サーバー起動）"
prompt_line "Choice [1]: " "選択 [1]: "
read choice
choice="${choice:-1}"

voicevox_url="http://127.0.0.1:50021"
voicevox_speaker="3"
kokoro_voice="af_heart"
irodori_url="http://127.0.0.1:8088"
irodori_voice="none"
say_voice="Kyoko"
language_route="1"

case "$choice" in
  1)
    need_node
    need_npm
    printf "VOICEVOX URL [%s]: " "$voicevox_url"
    read input
    voicevox_url="${input:-$voicevox_url}"
    prompt_format "VOICEVOX speaker/style id [%s = Zundamon Normal]: " "VOICEVOX speaker/style id [%s = ずんだもん ノーマル]: " "$voicevox_speaker"
    read input
    voicevox_speaker="${input:-$voicevox_speaker}"
    printf "Kokoro voice [%s]: " "$kokoro_voice"
    read input
    kokoro_voice="${input:-$kokoro_voice}"

    say_line "Running npm install. The first run may take a little while." "npm install を実行します。初回は少し時間がかかることがあります。"
    npm install

    if curl -fsS "$voicevox_url/version" >/dev/null 2>&1; then
      say_line "VOICEVOX engine is reachable." "VOICEVOX engine を確認しました。"
    else
      say_line "VOICEVOX engine was not reachable." "VOICEVOX engine に接続できませんでした。"
      say_line "For Japanese speech, start VOICEVOX and then run ./check.command." "日本語読み上げを使う場合は、VOICEVOXを起動してから ./check.command を実行してください。"
    fi

    write_config "auto" "$voicevox_url" "$voicevox_speaker" "$kokoro_voice" "$say_voice" "$language_route" "$ui_lang"
    ;;
  2)
    need_node
    printf "VOICEVOX URL [%s]: " "$voicevox_url"
    read input
    voicevox_url="${input:-$voicevox_url}"
    prompt_format "VOICEVOX speaker/style id [%s = Zundamon Normal]: " "VOICEVOX speaker/style id [%s = ずんだもん ノーマル]: " "$voicevox_speaker"
    read input
    voicevox_speaker="${input:-$voicevox_speaker}"

    if curl -fsS "$voicevox_url/version" >/dev/null 2>&1; then
      say_line "VOICEVOX engine is reachable." "VOICEVOX engine を確認しました。"
    else
      say_line "VOICEVOX engine was not reachable." "VOICEVOX engine に接続できませんでした。"
      say_line "Start VOICEVOX and run ./check.command later." "VOICEVOXを起動してから、あとで ./check.command を実行してください。"
    fi

    write_config "voicevox" "$voicevox_url" "$voicevox_speaker" "$kokoro_voice" "$say_voice" "0" "$ui_lang"
    ;;
  3)
    need_node
    need_npm
    printf "Kokoro voice [%s]: " "$kokoro_voice"
    read input
    kokoro_voice="${input:-$kokoro_voice}"
    say_line "Running npm install. The first run may take a little while." "npm install を実行します。初回は少し時間がかかることがあります。"
    npm install
    write_config "kokoro" "$voicevox_url" "$voicevox_speaker" "$kokoro_voice" "$say_voice" "0" "$ui_lang"
    ;;
  4)
    printf "macOS say voice [%s]: " "$say_voice"
    read input
    say_voice="${input:-$say_voice}"
    if ! /usr/bin/say -v "$say_voice" "Talking Pets の音声テストです。" >/dev/null 2>&1; then
      say_line "The selected say voice may not be available. Run ./check.command later." "指定した say voice が使えない可能性があります。あとで ./check.command で確認してください。"
    fi
    write_config "say" "$voicevox_url" "$voicevox_speaker" "$kokoro_voice" "$say_voice" "0" "$ui_lang"
    ;;
  5)
    need_node
    printf "Irodori-TTS Server URL [%s]: " "$irodori_url"
    read input
    irodori_url="${input:-$irodori_url}"
    printf "Irodori voice id [%s]: " "$irodori_voice"
    read input
    irodori_voice="${input:-$irodori_voice}"
    if curl -fsS "$irodori_url/health" >/dev/null 2>&1; then
      say_line "Irodori-TTS Server is reachable." "Irodori-TTS Server を確認しました。"
    else
      say_line "Irodori-TTS Server was not reachable." "Irodori-TTS Server に接続できませんでした。"
      say_line "Start Irodori-TTS-Server separately, then run ./check.command." "Irodori-TTS-Serverを別途起動してから ./check.command を実行してください。"
    fi
    write_config "irodori" "$voicevox_url" "$voicevox_speaker" "$kokoro_voice" "$say_voice" "0" "$ui_lang" "$irodori_url" "$irodori_voice"
    ;;
  *)
    say_line "Unknown choice: $choice" "不明な選択です: $choice"
    exit 2
    ;;
esac

chmod +x "$ROOT_DIR/scripts/pet-rollout-monitor.command" 2>/dev/null || true
chmod +x "$ROOT_DIR/start-selected-tts.command" 2>/dev/null || true
chmod +x "$ROOT_DIR/check.command" 2>/dev/null || true

echo
say_line "Saved config: $CONFIG_FILE" "設定を保存しました: $CONFIG_FILE"
say_line "Start Talking Pets with:" "起動するには次を実行してください。"
echo
echo "  ./start-selected-tts.command"
echo
