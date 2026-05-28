# Talking Pets MVP

Codex Pet の吹き出し表示とは別に、読み上げ専用の話し言葉を扱うための最小アドオンです。

## Files

- `src/talking-pet-mvp.js`: Web Speech API を使う本体
- `src/codex-pet-voice-bridge.js`: Codex Pet の吹き出しDOMを監視して読み上げへ渡すブリッジ
- `scripts/pet-ocr-monitor.swift`: Codex本体を改造せず、画面右下をOCRして読み上げる外部MVP
- `scripts/pet-rollout-monitor.swift`: OCRを使わず、Codexのrollout JSONLから最新発話を読み上げる外部MVP
- `demo/index.html`: ブラウザで動作確認するための最小デモ
- `demo/bridge.html`: hatch-pet 風の吹き出し監視デモ
- `implementation-notes.md`: 今回の判断メモ

## What It Does

- 日本語ボイスを自動候補にする
- 声の選択を `localStorage` に保存する
- 表示文をそのまま読まず、短い話し言葉へ寄せる
- `speechText` が渡された場合は、それを優先して読む
- 吹き出しDOMを監視して、文が変わったら読む

## Usage

HTML に読み込んで初期化します。

```html
<script src="/path/to/talking-pet-mvp.js"></script>
<script>
  TalkingPetMVP.init({
    bubbleSelector: "[data-pet-bubble]",
    observeBubble: true
  });
</script>
```

デモでは二重読み上げを避けるため、吹き出しDOMの自動監視を切っています。

```js
TalkingPetMVP.init({
  panelMount: "[data-voice-controls]",
  observeBubble: false
});
```

表示用と読み上げ用を分けたい場合は、イベントで渡します。

```js
window.dispatchEvent(new CustomEvent("codex-pet:message", {
  detail: {
    displayText: "画面にはこの文章を出す",
    speechText: "マスター、こっちは耳で聞く用の話し方だよ。"
  }
}));
```

## Check

`demo/index.html` をブラウザで開きます。右下のパネルで声を選び、`Test` を押すと読み上げ確認ができます。

ブリッジの確認は `demo/bridge.html` を開きます。吹き出し文を変更すると、ブリッジが表示文を拾って読み上げ文へ変換します。

## Codex Pet Bridge

`hatch-pet` の `pet.json` はスプライト指定だけなので、現時点では音声JSをペットパッケージへ直接同梱できません。
Codex Pet 本体へ差し込み口がある場合、以下の順で読み込ませます。

```html
<script src="/path/to/talking-pet-mvp.js"></script>
<script src="/path/to/codex-pet-voice-bridge.js"></script>
<script>
  TalkingPetMVP.init({ observeBubble: false });
  CodexPetVoiceBridge.start({
    selectors: [
      "[data-avatar-overlay-measure='notification-tray-row']",
      "[data-avatar-overlay-size='notification-tray-list']",
      "[data-pet-bubble]"
    ]
  });
</script>
```

実際の吹き出しセレクタが違う場合は、ブラウザコンソールで候補を確認できます。

```js
CodexPetVoiceBridge.findCandidates()
```

現時点で確認できた Codex 本体側の Pet 実装名は `avatar-overlay-page` で、通知/吹き出し周辺には `data-avatar-overlay-size='notification-tray-list'` や `data-avatar-overlay-measure='notification-tray-row'` が使われています。
ただし、デモページから本物の `/pet` オーバーレイDOMは読めません。本物を喋らせるには、同じ WebView 内へこの2つのJSを読み込ませるフックが必要です。

## External OCR MVP

Codex本体を改造しない場合は、画面右下のPet吹き出しをmacOS Vision OCRで読み取り、`say` で読み上げます。

```bash
cd /Users/tsukuyomi/Documents/Projects/talking-pets
./scripts/pet-ocr-monitor.command --voice Kyoko
```

声の候補は以下で確認できます。

```bash
./scripts/pet-ocr-monitor.command --list-voices
```

デフォルトでは、Codex が保存している `electron-avatar-overlay-bounds` を読んで、`hatch-pet` の吹き出しトレイ位置へ追従します。
ペットを動かした場合も、次の読み取りから新しい位置を使います。

読み取り位置を手動固定したい場合は、`x,y,w,h` で範囲を指定します。

```bash
./scripts/pet-ocr-monitor.command --region 1010,548,410,320 --voice Kyoko
```

自動追従を使わず、以前の右下固定フォールバックだけにしたい場合は `--no-state-region` を付けます。

初回はmacOSの画面収録権限が必要です。失敗した場合は、システム設定の「プライバシーとセキュリティ > 画面収録」で、このコマンドを起動したアプリ、たとえば Terminal や Codex を許可します。音声だけ確認したい場合は `--dry-run` を付けると、読み取った文字を表示するだけになります。

```bash
./scripts/pet-ocr-monitor.command --once --dry-run
```

読み取り範囲が合っているか見るには、クロップ画像を保存します。

```bash
./scripts/pet-ocr-monitor.command --once --dry-run --save-image /tmp/pet-ocr-crop.png
open /tmp/pet-ocr-crop.png
```

デフォルトでは、`--dry-run` や `Kyoko` などコマンド/UI断片っぽいOCR結果は読み上げず、`--dry-run` 時は `[skip] ...` と表示します。
Pet吹き出しの1行目はタイトルとして読み飛ばします。本文側に `考え中` が出ているだけの時も読み上げません。
ただし、1行目のタイトルは「本物のPet吹き出しかどうか」の判定には使います。
背景や別アプリの文字だけを拾った場合は、吹き出しタイトルがないため読み上げません。
OCRの揺れで少しだけ違う文として認識された場合も、直近で読んだ文と似ていれば繰り返しません。
ペットを移動した直後は、背景文字や途中描画を拾わないように、デフォルトで2回分だけ読み取りを捨てます。
待ちを短くしたい場合は `--settle-reads 1`、長くしたい場合は `--settle-reads 3` のように指定します。

## External Rollout MVP

OCRの代わりに、Codexがローカルへ保存している会話ログを読みます。
`~/.codex/state_5.sqlite` の `threads.rollout_path` から最新スレッドの JSONL を見つけ、最新の assistant 発話を取得して読み上げます。

### Platform Support

現在の安定版は macOS の Swift monitor です。

```bash
./scripts/pet-rollout-monitor.command --tts auto --skip-existing
```

Windows / Linux 対応に向けた実験版として、Node.js monitor もあります。Node.js 22 以上を推奨します。

```bash
./scripts/pet-rollout-monitor-node.command --tts auto --skip-existing
npm run monitor:node -- --once --dry-run
```

切り戻しは簡単で、macOSでは従来の `pet-rollout-monitor.command` を使えば Swift版へ戻れます。

Windows向けの初期スクリプトも用意しています。

```powershell
.\install.ps1
.\start-selected-tts.ps1
.\check.ps1
```

Windows版はまだ experimental です。VOICEVOXは `http://127.0.0.1:50021`、KokoroはNode.js経由で使います。

初回セットアップでは、使うローカルTTSを選べます。

```bash
cd /Users/tsukuyomi/Documents/Projects/talking-pets
./install.command
./start-selected-tts.command
```

インストーラーの選択肢は以下です。

- `自動ルーティング`: 日本語はVOICEVOX、英語はKokoro、それ以外はmacOS say
- `VOICEVOX`: 日本語向け。デフォルトは ずんだもん ノーマル `speaker=3`
- `Kokoro.js`: ローカル実行。英語系ボイス中心
- `macOS say`: 追加インストールなし

状態確認は以下でできます。

```bash
./check.command
```

手動で起動する場合は以下です。

```bash
cd /Users/tsukuyomi/Documents/Projects/talking-pets
npm install
./scripts/pet-rollout-monitor.command --skip-existing
```

動作確認だけなら `--dry-run` を付けます。

```bash
./scripts/pet-rollout-monitor.command --once --dry-run
```

特定のスレッドだけを読みたい場合は `--thread-id`、特定の作業ディレクトリで絞りたい場合は `--cwd` を使います。

```bash
./scripts/pet-rollout-monitor.command --thread-id 019e6964-9424-7a01-a939-cb3c7cd2039a --dry-run
./scripts/pet-rollout-monitor.command --cwd /Users/tsukuyomi/Documents/Codex/2026-05-27/codex-pet --dry-run
```

デフォルトでは全文を取得した上で、耳で聞きやすい短いセリフへ寄せて読み上げます。
全文をそのまま読みたい場合は `--no-summary` を付けます。

多言語向けには `--tts auto` が使えます。短い言語判定で、日本語はVOICEVOX、英語はKokoro、それ以外はmacOS `say` に振り分けます。

```bash
./scripts/pet-rollout-monitor.command --tts auto --skip-existing
./scripts/pet-rollout-monitor.command --tts auto --speech-language ja --skip-existing
./scripts/pet-rollout-monitor.command --tts kokoro --no-language-route --skip-existing
```

声プリセットの初期案は `presets/voices.json` にあります。

TTSはデフォルトでローカル実行の Kokoro を使います。Kokoro の声を変える場合は `--kokoro-voice` を指定します。

```bash
./scripts/pet-rollout-monitor.command --kokoro-voice af_bella --skip-existing
./scripts/pet-rollout-monitor.command --tts kokoro --list-voices
```

Node実行ではKokoroのdeviceはデフォルトで `cpu` です。初回だけモデル取得のため少し時間がかかります。
現時点の `kokoro-js` 同梱ボイスは英語系が中心なので、日本語の自然さや可愛い声質は実機確認しながら選びます。

macOS標準音声へ戻す場合は `--tts say` を使います。

```bash
./scripts/pet-rollout-monitor.command --tts say --voice Kyoko --skip-existing
```

VOICEVOXをローカルで起動している場合は、オプションでVOICEVOXへ投げられます。
デフォルトは `http://127.0.0.1:50021` の `ずんだもん ノーマル`、つまり `speaker=3` です。

```bash
./scripts/pet-rollout-monitor.command --tts voicevox --voicebox-speaker 3 --skip-existing
./scripts/pet-rollout-monitor.command --tts voicevox --list-voices
```

以前の汎用Voicebox風HTTP APIへ投げたい場合は、互換用に `--tts voicebox --voicebox-mode generic` を使えます。
