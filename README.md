# Talking Pets MVP

Codex Pet の吹き出し内容を、ローカルTTSで読み上げるための最小アドオンです。

English: [README.en.md](README.en.md)

## 現在の状態

- macOS: 対応中。Swift版monitorが安定版です。
- Windows: experimental。Node版monitorとPowerShellスクリプトを用意しています。
- Linux: experimental。Node版monitorを前提に今後調整します。

## 前提条件

必須:

- Codex Desktop / Codex CLI がローカル会話ログを保存していること
- Node.js 22 以上
- npm

macOS安定版:

- macOS
- Swift 実行環境
- 音声再生用の `afplay`
- フォールバック用の macOS `say`

日本語音声を使う場合:

- VOICEVOX Engine
- VOICEVOX Engine が `http://127.0.0.1:50021` で起動していること
- デフォルト音声: ずんだもん ノーマル `speaker=3`

英語音声を使う場合:

- `kokoro-js`
- 初回実行時にKokoroモデルを取得できるネットワーク環境

Windows experimental:

- Node.js 22 以上
- PowerShell
- VOICEVOX Engine または Kokoro
- Codex の `state_5.sqlite` がユーザーホーム配下に存在すること

## インストール

macOS:

```bash
cd /path/to/talking-pets
./install.command
./start-selected-tts.command
```

インストーラーでは、使うローカルTTSを選べます。

- 自動ルーティング: 日本語はVOICEVOX、英語はKokoro、それ以外はmacOS say
- VOICEVOX: 日本語向け。デフォルトは ずんだもん ノーマル `speaker=3`
- Kokoro.js: ローカル実行。英語系ボイス中心
- macOS say: 追加インストールなし

状態確認:

```bash
./check.command
```

Windows experimental:

```powershell
.\install.ps1
.\start-selected-tts.ps1
.\check.ps1
```

## 手動起動

macOS安定版:

```bash
./scripts/pet-rollout-monitor.command --tts auto --skip-existing
```

Node版 experimental:

```bash
./scripts/pet-rollout-monitor-node.command --tts auto --skip-existing
npm run monitor:node -- --once --dry-run
```

切り戻しは、macOSでは従来のSwift版を使うだけです。

```bash
./scripts/pet-rollout-monitor.command --tts auto --skip-existing
```

## TTS選択

VOICEVOX:

```bash
./scripts/pet-rollout-monitor.command --tts voicevox --voicebox-speaker 3 --skip-existing
./scripts/pet-rollout-monitor.command --tts voicevox --list-voices
```

Kokoro:

```bash
./scripts/pet-rollout-monitor.command --tts kokoro --kokoro-voice af_heart --skip-existing
./scripts/pet-rollout-monitor.command --tts kokoro --list-voices
```

macOS say:

```bash
./scripts/pet-rollout-monitor.command --tts say --voice Kyoko --skip-existing
```

多言語自動ルーティング:

```bash
./scripts/pet-rollout-monitor.command --tts auto --skip-existing
./scripts/pet-rollout-monitor.command --tts auto --speech-language ja --skip-existing
./scripts/pet-rollout-monitor.command --tts kokoro --no-language-route --skip-existing
```

声プリセットの初期案は [presets/voices.json](presets/voices.json) にあります。

## 話し方のカスタマイズ

既定の読み上げ整形は、LLMを使わないローカル処理です。
固定のキャラクター口調は持たせず、[presets/speech-style.json](presets/speech-style.json) で差し替えられるようにしています。

```json
{
  "languages": {
    "ja": {
      "fallback": "新しいメッセージがあります。",
      "templates": ["{text}"],
      "stripPrefixes": [],
      "stripTerms": ["マスター"]
    }
  }
}
```

- `templates`: 読み上げ文のテンプレートです。`{text}` が本文に置き換わります。
- `stripPrefixes`: 先頭から落としたい短い相づちを指定します。
- `stripTerms`: 呼びかけや特定語を削りたい時に使います。

独自ファイルを使う場合:

```bash
./scripts/pet-rollout-monitor-node.command --speech-style ./my-speech-style.json --tts auto --skip-existing
```

現時点で `--speech-style` を読むのはNode版monitorです。macOS安定版のSwift monitorは、同じ既定スタイルを内蔵しています。

## LLM要約について

現在のMVPは、CodexやChatGPT APIを追加で呼び出して要約する設計ではありません。
Codexのローカル会話ログに保存された assistant 発話を読み、ローカルのルールで短く整形します。

そのため、読み上げ整形だけなら追加のOpenAI API料金は不要です。

将来的にLLM要約を追加する場合は、任意のsummarizerとして分離する予定です。

- Codex / ChatGPT: 利用可否と上限はChatGPTプランに依存します。OpenAI Help Centerでは、CodexはPlus / Pro / Business / Enterprise / Eduに含まれ、期間限定でFree / Goにも含まれると案内されています。最新情報は [Using Codex with your ChatGPT plan](https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan) を確認してください。
- OpenAI API: ChatGPTプランとは別課金です。
- 他のLLM: ローカルLLMや他社LLMでも、同じsummarizerインターフェースに接続できる設計にする予定です。

## 動作確認

最新発話を読み上げずに確認:

```bash
./scripts/pet-rollout-monitor.command --once --dry-run
```

特定スレッドを指定:

```bash
./scripts/pet-rollout-monitor.command --thread-id THREAD_ID --dry-run
```

特定の作業ディレクトリで絞り込み:

```bash
./scripts/pet-rollout-monitor.command --cwd /path/to/workspace --dry-run
```

## 仕組み

Talking Pets は、Codex がローカルへ保存している会話ログを読みます。

1. `~/.codex/state_5.sqlite` の `threads.rollout_path` を読む
2. 最新スレッドの rollout JSONL を見つける
3. 最新の assistant 発話を取得する
4. 耳で聞きやすい短いセリフへ整形する
5. ローカルTTSへ渡す

Codex本体の改造や署名済みアプリの変更はしません。

## Webデモ

ブラウザだけで読み上げUIを試せます。

```bash
open demo/index.html
open demo/bridge.html
```

HTMLへ直接組み込む場合:

```html
<script src="/path/to/talking-pet-mvp.js"></script>
<script>
  TalkingPetMVP.init({
    bubbleSelector: "[data-pet-bubble]",
    observeBubble: true
  });
</script>
```

表示文と読み上げ文を分ける場合:

```js
window.dispatchEvent(new CustomEvent("codex-pet:message", {
  detail: {
    displayText: "画面にはこの文章を出す",
    speechText: "これは読み上げ用の短い文です。"
  }
}));
```

## 注意

- VOICEVOX本体は同梱していません。
- VOICEVOXや各音声ライブラリの利用規約に従ってください。
- Kokoroの初回実行ではモデル取得が走ります。
- Windows版はまだ experimental です。
- Public公開前にライセンスとクレジット表記を整理する予定です。
