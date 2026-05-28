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

need_node() {
  if ! command -v node >/dev/null 2>&1; then
    echo "Node.js が見つかりません。Kokoro / VOICEVOX 連携には Node.js 22 以上が必要です。"
    echo "macOS say だけで使う場合は、TTS選択で 4 を選んでください。"
    return 1
  fi

  node_major="$(node -p "Number(process.versions.node.split('.')[0])" 2>/dev/null || echo 0)"
  if [[ "$node_major" -lt 22 ]]; then
    echo "Node.js 22 以上が必要です。現在のバージョン: $(node --version)"
    echo "macOS say だけで使う場合は、TTS選択で 4 を選んでください。"
    return 1
  fi
}

need_npm() {
  if ! command -v npm >/dev/null 2>&1; then
    echo "npm が見つかりません。Kokoro を使うには npm が必要です。"
    return 1
  fi
}

write_config() {
  cat > "$CONFIG_FILE" <<EOF
TALKING_PETS_TTS="$1"
TALKING_PETS_VOICEVOX_URL="$2"
TALKING_PETS_VOICEVOX_SPEAKER="$3"
TALKING_PETS_KOKORO_VOICE="$4"
TALKING_PETS_SAY_VOICE="$5"
TALKING_PETS_LANGUAGE_ROUTE="$6"
EOF
}

print_header

echo "使うローカルTTSを選んでください。"
echo "1) 自動ルーティング（日本語=VOICEVOX / 英語=Kokoro / その他=say）"
echo "2) VOICEVOX / ずんだもん ノーマル（日本語おすすめ）"
echo "3) Kokoro.js（ローカル、英語系ボイス中心）"
echo "4) macOS say（追加インストールなし）"
printf "選択 [1]: "
read choice
choice="${choice:-1}"

voicevox_url="http://127.0.0.1:50021"
voicevox_speaker="3"
kokoro_voice="af_heart"
say_voice="Kyoko"
language_route="1"

case "$choice" in
  1)
    need_node
    need_npm
    printf "VOICEVOX URL [%s]: " "$voicevox_url"
    read input
    voicevox_url="${input:-$voicevox_url}"
    printf "VOICEVOX speaker/style id [%s = ずんだもん ノーマル]: " "$voicevox_speaker"
    read input
    voicevox_speaker="${input:-$voicevox_speaker}"
    printf "Kokoro voice [%s]: " "$kokoro_voice"
    read input
    kokoro_voice="${input:-$kokoro_voice}"

    echo "npm install を実行します。初回は少し時間がかかることがあります。"
    npm install

    if curl -fsS "$voicevox_url/version" >/dev/null 2>&1; then
      echo "VOICEVOX engine を確認しました。"
    else
      echo "VOICEVOX engine に接続できませんでした。"
      echo "日本語読み上げを使う場合は、VOICEVOXを起動してから ./check.command を実行してください。"
    fi

    write_config "auto" "$voicevox_url" "$voicevox_speaker" "$kokoro_voice" "$say_voice" "$language_route"
    ;;
  2)
    need_node
    printf "VOICEVOX URL [%s]: " "$voicevox_url"
    read input
    voicevox_url="${input:-$voicevox_url}"
    printf "VOICEVOX speaker/style id [%s = ずんだもん ノーマル]: " "$voicevox_speaker"
    read input
    voicevox_speaker="${input:-$voicevox_speaker}"

    if curl -fsS "$voicevox_url/version" >/dev/null 2>&1; then
      echo "VOICEVOX engine を確認しました。"
    else
      echo "VOICEVOX engine に接続できませんでした。"
      echo "VOICEVOXを起動してから、あとで ./check.command を実行してください。"
    fi

    write_config "voicevox" "$voicevox_url" "$voicevox_speaker" "$kokoro_voice" "$say_voice" "0"
    ;;
  3)
    need_node
    need_npm
    printf "Kokoro voice [%s]: " "$kokoro_voice"
    read input
    kokoro_voice="${input:-$kokoro_voice}"
    echo "npm install を実行します。初回は少し時間がかかることがあります。"
    npm install
    write_config "kokoro" "$voicevox_url" "$voicevox_speaker" "$kokoro_voice" "$say_voice" "0"
    ;;
  4)
    printf "macOS say voice [%s]: " "$say_voice"
    read input
    say_voice="${input:-$say_voice}"
    if ! /usr/bin/say -v "$say_voice" "Talking Pets の音声テストです。" >/dev/null 2>&1; then
      echo "指定した say voice が使えない可能性があります。あとで ./check.command で確認してください。"
    fi
    write_config "say" "$voicevox_url" "$voicevox_speaker" "$kokoro_voice" "$say_voice" "0"
    ;;
  *)
    echo "不明な選択です: $choice"
    exit 2
    ;;
esac

chmod +x "$ROOT_DIR/scripts/pet-rollout-monitor.command" 2>/dev/null || true
chmod +x "$ROOT_DIR/start-selected-tts.command" 2>/dev/null || true
chmod +x "$ROOT_DIR/check.command" 2>/dev/null || true

echo
echo "設定を保存しました: $CONFIG_FILE"
echo "起動するには次を実行してください。"
echo
echo "  ./start-selected-tts.command"
echo
