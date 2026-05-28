# Implementation Notes

## 2026-05-27 MVP

- Codex Pet の `pet.json` はスプライト指定だけで、音声用フィールドは見つからなかった。
- Codex.app 本体には `openPetOverlay` / `petOverlay.*` の文字列があるが、署名付きアプリ本体を直接変更するのはMVPの範囲外にした。
- `/Users/tsukuyomi/Documents/Projects/talking-pets` が空だったため、後で本体へ差し込みやすい独立JSアドオンとして作成した。
- 表示文と読み上げ文は別物として扱う。`speechText` がある場合はそれを優先し、ない場合だけ表示文を簡易変換する。
- 可愛い声はブラウザ標準の範囲で選ぶ。日本語ボイス、`Kyoko`、`Sayaka`、`Haruka` などを優先し、選択結果は `localStorage` に保存する。
- MVPでは外部TTSや有料APIは使わない。

## 2026-05-27 Demo Visibility And Audio Diagnostics

- Codex in-app browser では右下固定パネルが見えづらいため、デモでは `panelMount` でページ内に音声コントロールを表示する方式へ変更した。
- 音声が出ない原因を切り分けるため、`talking-pet:speech-status` イベントで `queued` / `start` / `end` / `error` / `unsupported` を画面に出すようにした。
- ページ全体のDOM監視はステータス表示やパネル生成でも読み上げを誘発するため、吹き出し要素だけを監視する方式へ変更した。

## 2026-05-27 Duplicate Speech Fix

- デモでは吹き出し変更と読み上げ専用イベントが両方走ると二重読み上げになるため、`observeBubble: false` を追加して自動監視を切れるようにした。
- デモの各ボタンは、表示文を書き換えたあと、対応する `speechText` を1回だけ送る方式にした。

## 2026-05-27 Preview Both Texts

- デモで画面表示文と読み上げ文を同時に確認できるよう、吹き出し下に2つのプレビュー欄を追加した。

## 2026-05-27 Codex Pet Voice Bridge

- `hatch-pet` の `pet.json` 契約は `id` / `displayName` / `description` / `spritesheetPath` のみで、音声JSを直接同梱するフィールドはない。
- そのため、`src/codex-pet-voice-bridge.js` を追加し、Pet吹き出しDOMの変化を監視して `TalkingPetMVP.speak({ displayText, speechText })` へ渡す方式にした。
- 実際のCodex Pet本体へ入れるには、アプリ側のWebViewへJSを差し込める公式またはローカルのフックが必要。
- Codex.app の asar 内では Pet は `avatar-overlay-page` として実装され、通知トレイ周辺に `data-avatar-overlay-size='notification-tray-list'` / `data-avatar-overlay-measure='notification-tray-row'` があることを確認した。

## 2026-05-27 Voice Selection Fix

- 声の保存を `voice.name` だけではなく `voice.voiceURI` 優先に変更した。ブラウザによって同名や近い名前の声があり、`name` だけだと選択が反映されない可能性があるため。
- ボイス一覧は日本語っぽい声だけに絞らず、全ボイスを表示し、日本語候補を上に並べる方式にした。

## 2026-05-27 In-Memory Voice Selection Fix

- `file://` や埋め込みブラウザで `localStorage` が不安定でも声変更が即反映されるよう、選択中の `voiceURI` / `voiceName` をメモリにも保持するようにした。
- Bridgeデモの診断欄に、選択中の声と実際に発話要求へ渡した声を表示するようにした。

## 2026-05-27 External OCR MVP

- Codex本体の `pet.json` と overlay IPC には、吹き出し文面を外部JSへ渡す公式フックが見つからなかった。
- 本体改造を避けるMVPとして、`scripts/pet-ocr-monitor.swift` を追加した。
- 画面右下を `screencapture` で撮影し、macOS Vision OCRで文字認識して、前回と違う文だけ `say` で読み上げる。
- 初回実行では、実行元アプリにmacOSの画面収録権限が必要になる。

## 2026-05-27 OCR Region Tracking

- 固定座標だと `hatch-pet` を移動した時に読み上げ範囲が追従しないため、`~/.codex/.codex-global-state.json` の `electron-avatar-overlay-bounds` を読む方式を追加した。
- `tray` のローカル座標を overlay の `x` / `y` に足して、吹き出しトレイだけを小さくOCRする。`--region` が指定された場合は手動指定を優先する。
- 追従位置は起動時だけでなく、各OCRループで再解決する。ペットを動かした後も次回キャプチャから新しい位置を読む。
- 自動追従が不要な時の退避として `--no-state-region` を追加した。

## 2026-05-28 OCR Bubble Guard And Repeat Suppression

- Petを動かした先に背景文字があると、透明な overlay 領域越しにOCRが背景を拾うことがあった。
- 1行目のタイトルは読み上げ対象からは外したまま、`petを喋らせる` 系の文字がOCR結果に含まれる時だけ本物の吹き出しとして扱うようにした。
- 日本語を含まない断片や、`-53` のような数字だけのOCR断片はノイズとして捨てる。
- 同じ吹き出しがOCR揺れで少し違う文になっても、直近20件との先頭一致・部分一致・bigram類似度で重複として捨てる。
- ペット移動直後は overlay の保存座標と描画が一時的にズレるため、デフォルトで2回分の読み取りを捨てる `--settle-reads` を追加した。
- 重複判定は日本語部分だけを主キーにし、背景由来の英数字や記号が混ざっても同じ発話として扱いやすくした。

## 2026-05-28 Rollout-Based Speech MVP

- OCRは背景文字や移動直後の描画ズレに弱いため、非OCRルートを追加した。
- Codex Pet の `avatar-overlay-page` は、ローカル会話の `turns/items` から通知の `title` と `subtitle/body` を組み立てている。
- `~/.codex/.codex-global-state.json` には overlay の位置情報はあるが、吹き出し本文は保存されていない。
- `~/.codex/state_5.sqlite` の `threads.rollout_path` から対象スレッドの JSONL を見つけ、`event_msg:agent_message` または `response_item:message` の最新 assistant 発話を全文取得する方式にした。
- 本体改造なしの安全なMVPとして `scripts/pet-rollout-monitor.swift` / `.command` を追加した。
- デフォルトでは取得した全文をそのまま読まず、耳で聞きやすい短いセリフへ要約して `say` に渡す。`--no-summary` で全文読み上げへ切り替えられる。
- 初期の要約は「マスター、...って感じだよ」に偏ったため、呼びかけ重複を除去し、複数テンプレートから安定選択する方式へ変更した。
- テンプレート付与前に `だよ` / `だね` / `かな` などの語尾を落として、「だよかな」のような不自然な接続を避ける。

## 2026-05-28 Local TTS Provider Direction

- ChatGPT/Codex利用者に追加API課金を求めない公開方針にするため、TTSはローカル実行を基本にした。
- `kokoro-js` をデフォルトTTSとして追加し、`scripts/tts-kokoro.mjs` でWAV生成と `afplay` 再生を行う。
- Node版の `kokoro-js` は `device: "wasm"` ではなく `device: "cpu"` を使う必要があったため、既定値を `cpu` にした。
- `--list-voices` はKokoro本体の `list_voices()` が表出力専用で終了時に不安定だったため、MVPでは静的なボイス一覧をJSONで返す。
- `pet-rollout-monitor.swift` のデフォルトTTSを `kokoro` に変更し、失敗時のみmacOS `say` へフォールバックする。
- Voiceboxは別途ローカルアプリを起動しているユーザー向けのオプションとして、`scripts/tts-voicebox.mjs` からREST APIへ投げる形にした。
- 現在のKokoro同梱ボイスは英語系が中心。日本語の自然さと可愛い声質を優先する場合、Voiceboxや別ローカルTTSをオプションとして足せる構造を維持する。
- 読み上げ文の要約テンプレートは、不自然な「〜で進めるね」「〜が大事そう」連結を避け、取得した文を短く自然に言い直す方向へ寄せた。

## 2026-05-28 VOICEVOX Option

- 日本語の可愛い声を試すため、`tts-voicebox.mjs` を VOICEVOX エンジン互換に拡張した。
- デフォルトURLは `http://127.0.0.1:50021`、デフォルトspeakerは `3`。ローカルの `/speakers` で `ずんだもん / ノーマル / id: 3` を確認した。
- `--tts voicevox` を追加し、既存の `--tts voicebox` は互換名として残した。
- VOICEVOXでは `/audio_query` の後に `/synthesis` を呼び、生成したWAVを `afplay` で再生する。
- 汎用HTTP APIへ投げたい場合は `--voicebox-mode generic` を指定する。

## 2026-05-28 Installer MVP

- 公開前提ではローカルTTSの選択が必要なため、`install.command` を追加した。
- インストーラーでは `VOICEVOX` / `Kokoro.js` / `macOS say` を選べる。
- 選択結果は `.talking-pets.local.env` に保存し、`start-selected-tts.command` がその設定を読んで起動する。
- `check.command` で Node / npm / node_modules / VOICEVOX疎通 / macOS say / rollout dry-run を確認できる。
- VOICEVOX本体は同梱せず、ローカル起動済みエンジンの検出と案内に留める。

## 2026-05-28 Multilingual Routing MVP

- 多言語公開の土台として `--tts auto` を追加した。
- `--tts auto` では、短い文字種ベースの言語判定で `ja -> voicevox`、`en -> kokoro`、その他は `say` に振り分ける。
- `--speech-language ja|en|ko|other` で言語判定を手動上書きできる。
- `--no-language-route` で言語別ルーティングを止め、指定TTSだけを使える。
- インストーラーのデフォルト選択肢を自動ルーティングにし、VOICEVOX/Kokoro/sayも明示的に選べるようにした。
- 将来の設定UIやGitHub公開用の正本として `presets/voices.json` を追加した。

## 2026-05-28 Node Monitor Port

- macOS安定版の Swift monitor は残したまま、移植用の `scripts/pet-rollout-monitor.mjs` を追加した。
- Node版は `node:sqlite` で `~/.codex/state_5.sqlite` を読み、rollout JSONLから最新assistant発話を取得する。
- 既存Swift版と同じ主要オプション、要約、重複抑制、`--tts auto` ルーティングを実装した。
- macOSで安全に試すため、`scripts/pet-rollout-monitor-node.command` を追加した。切り戻しは従来の `scripts/pet-rollout-monitor.command` を使うだけ。
- Windows向けの初期版として `install.ps1` / `start-selected-tts.ps1` / `check.ps1` を追加した。
- `tts-kokoro.mjs` と `tts-voicebox.mjs` の再生処理を、macOS `afplay` 固定から、Windows PowerShell `SoundPlayer`、Linux `aplay` / `paplay` / `ffplay` へ広げた。
- Node版はローカルdry-runまで確認済み。PowerShellはこのmacOS環境に `pwsh` がないため未実行。

## 2026-05-28 Speech Template Cleanup

- 「進めたよ、。」のように、呼びかけ除去後の読点と句点が続くケースを後処理で潰すようにした。
- 「あたしも追えてるよ。」が多く感じられたため、Swift版とNode版の要約テンプレートから外した。
- 現在のテンプレートは短く、元文を大きく言い換えすぎない形に寄せている。
- 追加で、最終出力直前にも句読点連続と「あたしも追えてるよ」を消す `cleanSpeechLine` を入れた。
- VOICEVOX失敗時のログ表示が `Voicebox failed` だったため、`VOICEVOX failed` に直した。
