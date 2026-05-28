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

## 2026-05-28 Public Repo Review Checklist

- 初見ユーザーが「興味関心」「インストール」「使用法」の各段階で離脱しないかを、公開repo目線で棚卸しした。
- 消し込みしやすい正本として、repo直下に `PUBLIC_REPO_REVIEW_CHECKLIST.md` を追加した。
- 優先度は P0 / P1 / P2 / P3 に分け、まず実行不能や信頼低下に直結する項目を P0 に置いた。
- Node版monitorの `textForSource()` 未定義変数参照、Node.js要件の表記ズレ、LICENSE / Credits 不足を公開前のrelease blockerとして扱う。

## 2026-05-28 Node Monitor textForSource Fix

- Node版monitorの `textForSource()` が、入力 `text` ではなく未定義の `result` を参照していたため、正常な rollout JSONL でも候補抽出が失敗していた。
- 仕様変更はせず、正規化処理の入力を `text` に戻す最小修正にした。
- 検証として、サンプル rollout JSONL を `/tmp/talking-pets-test-rollout.jsonl` に作成し、`npm run monitor:node -- --once --dry-run --rollout /tmp/talking-pets-test-rollout.jsonl` で `[source]` と `[pet] Node版の確認だよ。` が出ることを確認した。
- `PUBLIC_REPO_REVIEW_CHECKLIST.md` の該当 P0 項目を完了にした。

## 2026-05-28 Node Monitor Candidate Diagnostics

- Node版monitorが rollout 読み取り失敗や JSON parse 失敗を単に `[wait] speech candidate not found` と出していたため、原因が見える診断メッセージを返す形にした。
- `readLatestSpeechCandidate()` は候補そのものではなく `{ candidate, message }` を返すようにし、正常時、ファイル未読、空ファイル、全行 parse 失敗、一部 parse 失敗、発話候補長すぎを分ける。
- 検証として、正常 JSONL では `[source]` と `[pet] 診断表示の確認だよ。`、存在しない rollout では `[wait] rollout unreadable (ENOENT: ...)`、壊れた JSONL では `[wait] rollout has no parseable JSON lines (2 parse errors)` が出ることを確認した。
- `node --check scripts/pet-rollout-monitor.mjs` も通過した。
- `PUBLIC_REPO_REVIEW_CHECKLIST.md` の該当 P0 項目を完了にした。

## 2026-05-28 Node.js Requirement Alignment

- README / README.en / package.json は Node.js 22 以上を前提にしていたが、`install.command` の案内だけ Node.js 18 以上になっていたため、Node.js 22 以上へ統一した。
- `install.command` と `install.ps1` に Node.js major version の実チェックを追加し、22 未満では理由を出して停止するようにした。
- macOS say だけを使う場合の案内で、実際のメニュー番号に合わせて `4` を案内するように直した。
- 検証として `zsh -n install.command` と、`rg -n "Node.js (18|22)|node\": \"" README.md README.en.md install.command install.ps1 package.json` を実行し、Node.js 18 の残存がないことを確認した。
- この環境には `pwsh` がないため、`install.ps1` の PowerShell parse は未実行。
- `PUBLIC_REPO_REVIEW_CHECKLIST.md` の該当 P0 項目を完了にした。

## 2026-05-28 MIT License

- Public 公開前の基本整備として、repo 直下に `LICENSE` を追加した。
- ライセンスは標準的な MIT License とし、copyright holder は `Talking Pets contributors` にした。
- `package.json` に `"license": "MIT"` を追加した。
- README / README.en に License セクションを追加し、`LICENSE` へリンクした。
- 検証として `test -f LICENSE` と `rg -n "MIT License|License|ライセンス|license" README.md README.en.md package.json LICENSE` を実行し、README から license が確認できることを確認した。
- `PUBLIC_REPO_REVIEW_CHECKLIST.md` の該当 P0 項目を完了にした。

## 2026-05-28 Credits And Third-Party Notices

- VOICEVOX / Kokoro / Codex の外部依存を整理するため、repo 直下に `CREDITS.md` を追加した。
- VOICEVOX は公式サイト、ソフトウェア利用規約、使い方へのリンクを載せ、VOICEVOX本体や音声ライブラリは同梱しないこと、公開音声では選択した音声ライブラリの規約も確認することを書いた。
- デフォルトの VOICEVOX 例として `VOICEVOX:ずんだもん` のクレジット例を載せた。
- Kokoro / Kokoro.js は npm package、既定ONNXモデル、上流モデルファミリーへのリンクを載せ、モデルファイルは初回実行時に取得され、repoには同梱しないことを書いた。
- README / README.en の Notes から `CREDITS.md` へリンクし、Credits セクションを追加した。
- 検証として `test -f CREDITS.md` と `rg -n "CREDITS|VOICEVOX:ずんだもん|voicevox.hiroshiba|Kokoro-82M|kokoro-js" README.md README.en.md CREDITS.md` を実行し、README から外部依存の扱いを辿れることを確認した。
- `PUBLIC_REPO_REVIEW_CHECKLIST.md` の該当 P0 項目を完了にした。

## 2026-05-28 README First-Screen Public Repo Positioning

- README / README.en のタイトルを `Talking Pets MVP` から `Talking Pets` に変更し、MVPであることは Status セクション内で説明する形にした。
- README 冒頭に、Codex Pet の吹き出しや Codex の最新 assistant 発話をローカルTTSで読み上げるアドオンであることを1文で追加した。
- README 上部に、Codex本体や署名済みアプリを改造しないこと、ローカル会話ログを読む設計であることを安全性の要点として追加した。
- macOS Swift monitor、macOS Node monitor、Windows Node monitor、Linux Node monitor、VOICEVOX、Kokoro.js、OS標準音声の support matrix を README / README.en に追加した。
- 検証として `sed -n '1,45p' README.md README.en.md` と `rg -n "# Talking Pets MVP|署名済み|without patching|macOS Swift monitor|Windows Node monitor|Linux Node monitor|public-ready MVP|公開準備中のMVP" README.md README.en.md` を実行し、タイトル、価値説明、安全説明、support matrix が上部に出ていることを確認した。
- `PUBLIC_REPO_REVIEW_CHECKLIST.md` の P1 Interest Phase から、value proposition、support matrix、Codex.app非改造、安全なMVP表現の4項目を完了にした。

## 2026-05-28 README Demo Preview Asset

- README 冒頭で体験が伝わるように、`assets/demo-preview.svg` を追加した。
- 実際の `demo/index.html` スクリーンショットを Playwright で取得しようとしたが、この環境には Playwright の Chromium executable が未取得で、`npx playwright install` を促すエラーになった。
- 公開前の初見視認性を先に満たすため、Codex Pet 風の吹き出しが短い読み上げ文へ変換され、Local TTS へ流れることを示す short demo preview SVG として作成した。
- README / README.en の冒頭に `![Talking Pets demo preview](assets/demo-preview.svg)` を追加した。
- 検証として `test -f assets/demo-preview.svg` と `rg -n "demo-preview.svg|Talking Pets demo preview" README.md README.en.md assets/demo-preview.svg` を実行し、README 冒頭から demo asset が見えることを確認した。
- `PUBLIC_REPO_REVIEW_CHECKLIST.md` の P1 Interest Phase から、30秒で分かる demo asset 項目を完了にした。

## 2026-05-28 README Install And Usage Flow

- README / README.en のインストール導線を、`Quick Start`、`Verify`、`Start`、`Stop / Restart / Change Config`、`Windows Experimental`、`Linux Experimental`、`TTS選択`、`Troubleshooting` の順に再構成した。
- macOS の最短手順に `./install.command`、`./check.command`、`./start-selected-tts.command` を並べ、`./check.command` 成功時の出力例を追加した。
- Windows experimental に `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` を追加し、PowerShellで実行が止まった時の逃げ道を明記した。
- Linux experimental は Node monitor 前提で、音声再生が `aplay` / `paplay` / `ffplay` / `espeak` に依存することを書いた。
- TTS選択ガイドを表にし、自動ルーティング、VOICEVOX、Kokoro.js、macOS say の向き不向きと追加準備を明記した。
- Kokoro.js の初回モデル取得について、既定の cache path `~/.cache/talking-pets/transformers` と q8 モデル約92MB級であることを README / README.en に追記した。
- `--thread-id`、`--cwd`、`--rollout`、`CODEX_HOME`、`--state-db` の使い分けを Start セクションに追加した。
- Stop / restart / config変更 / local config削除の手順を追加した。
- 音が出ない時の troubleshooting として、OS音量、TTS選択、VOICEVOX/Kokoro状態、Codexログ、rollout JSONL、Kokoro初回取得を確認する流れを追加した。
- 検証として `rg -n "Quick Start|Verify|Start|Stop / Restart / Change Config|Set-ExecutionPolicy|Linux Experimental|aplay|paplay|ffplay|espeak|92MB|92 MB|--rollout|--state-db|CODEX_HOME|Troubleshooting" README.md README.en.md` と README 該当範囲の `sed` を実行し、各項目が本文に出ていることを確認した。
- `PUBLIC_REPO_REVIEW_CHECKLIST.md` の P1 Install Phase 全項目と、P1 Usage Phase の Stop / option使い分け / 音が出ない troubleshooting 項目を完了にした。

## 2026-05-28 Codex Log Dependency And Check Diagnostics

- README / README.en の仕組みセクションに、`~/.codex/state_5.sqlite`、`threads.rollout_path`、`CODEX_HOME`、`--state-db`、複数workspace / 複数thread時の `--cwd`、`--thread-id`、`--rollout` の使い分けを補足した。
- Codex側にローカル会話ログや rollout JSONL がない場合、monitorが読み上げ候補を見つけられないことを明記した。
- `check.command` で Node.js 22 未満、Node未検出、npm未検出、`node_modules` 未検出、VOICEVOX未疎通、macOS say voice失敗時に、次に何をするかを表示するようにした。
- `check.ps1` でも Node.js 22 未満、Node未検出、npm未検出、`node_modules` 未検出、VOICEVOX未疎通時の次アクションを表示するようにした。
- dry run でthreadが見つからない場合の補足として、Codexを一度開くこと、または `--cwd` / `--thread-id` / `--rollout` / `--state-db` を手動指定することを両checkスクリプトに追加した。
- 検証として `zsh -n check.command` と `rg -n "install Node.js 22|needed for Kokoro|run npm install|start VOICEVOX|choose another|If dry run cannot find|CODEX_HOME|--state-db|--thread-id|--rollout|local conversation log" README.md README.en.md check.command check.ps1` を実行した。
- この環境には `pwsh` がないため、`check.ps1` の PowerShell parse は未実行。
- `PUBLIC_REPO_REVIEW_CHECKLIST.md` の P1 Usage Phase から、Codex log dependency と check script診断の2項目を完了にした。

## 2026-05-28 Language And Device Limits

- README / README.en に `Language And Device Limits` セクションを追加した。
- 言語対応は日本語と英語を優先し、その他はOS標準音声へのfallbackであることを明記した。
- 言語判定は短い文字種ベースであり、日本語英語混在、韓国語、中国語、記号だけの短文では期待と違うTTSへ流れる可能性があることを書いた。
- `--speech-language ja|en|ko|other` で手動指定できることを明記した。
- OS標準音声は macOS `say`、Windows `System.Speech`、Linux `espeak` で品質差があることを書いた。
- Windows / Linux は Node monitor の experimental ルートであり、このmacOS環境ではPowerShell実行とLinux実機音声再生は未確認であることを明記した。
- 検証として `rg -n "Language And Device Limits|日本語と英語|Japanese and English|文字種|character-based|--speech-language|System\\.Speech|PowerShell実行|real Linux audio|experimental Node monitor" README.md README.en.md` と該当範囲の `sed` を実行した。
- `PUBLIC_REPO_REVIEW_CHECKLIST.md` の P1 Multilingual And Device Coverage 全項目を完了にした。

## 2026-05-28 CI And Dry-Run Fixture

- GitHub Actions として `.github/workflows/ci.yml` を追加した。
- CI は `pull_request` と `main` への push で走り、Node.js 22、`npm ci`、`npm run check:syntax`、safe dry-run fixture を実行する。
- `package.json` に `check:syntax` と `test:dry-run` scripts を追加した。
- `test/fixtures/assistant-rollout.jsonl` を追加し、ネットワークや音声再生に依存しない dry-run の入力にした。
- CI の dry-run step では `npm run test:dry-run` の出力から `[pet] CI dry run ready.` を `grep` し、発話候補抽出と短い読み上げ文生成まで確認する。
- ローカル検証として `npm run check:syntax` と `npm run test:dry-run` を実行し、`[source] CI dry run ready.` と `[pet] CI dry run ready.` が出ることを確認した。
- `PUBLIC_REPO_REVIEW_CHECKLIST.md` の GitHub Actions、sample rollout fixture、minimal test runner 項目を完了にした。

## 2026-05-28 Repo Trust Docs And Metadata

- `CONTRIBUTING.md` を追加し、local checks、PR方針、implementation-notes更新方針、VOICEVOX/Kokoro/Codexログを同梱しない注意を書いた。
- `SECURITY.md` を追加し、脆弱性報告、local Codex logs / rollout JSONL / `state_5.sqlite` / generated audio を公開issueに貼らない注意、デフォルトでOpenAI APIへ送らないことを書いた。
- `CHANGELOG.md` を追加し、0.1.0 の初期機能と公開準備ドキュメント追加を記録した。
- Issue templates として bug report、install trouble、TTS provider request を追加し、OS、Node.js、TTS provider、check output、利用規約リンクなどを集めやすくした。
- `package.json` に description、repository、keywords を追加した。license は前段で追加済み。
- npm packageとしては未公開でGitHub clone前提にする判断を README / README.en の Distribution に書き、`private: true` を維持する理由を明確にした。
- 検証として `.github` 配下のファイル一覧、`node -e "JSON.parse(...)"`、`rg -n "Contributing|Security Policy|Changelog|Distribution|private: true|description|repository|keywords|Bug report|Install trouble|TTS provider request" ...` を実行した。
- `PUBLIC_REPO_REVIEW_CHECKLIST.md` の CONTRIBUTING、SECURITY、CHANGELOG、Issue templates、package metadata、npm配布方針の6項目を完了にした。

## 2026-05-28 README Demo Architecture Privacy Roadmap

- README / README.en の Web demo セクションに、`demo/index.html` はWeb Speech APIと表示文/読み上げ文分離のブラウザ単体デモ、`demo/bridge.html` はPet吹き出しDOMを監視する bridge 統合デモであることを追加した。
- Web demo はサンプルUIであり、Codex log monitor はCodexのローカル会話ログから最新assistant発話を読む常駐スクリプトであること、Web demoを開くだけではCodex Pet本体へ組み込まれないことを書いた。
- 仕組みセクションに Mermaid の flowchart を追加し、Codex local logs -> state_5.sqlite -> rollout JSONL -> monitor -> formatter -> local TTS の流れを図示した。
- README / README.en に Privacy セクションを追加し、ローカルCodex metadata / rollout JSONLを読むこと、既定ではOpenAI APIや外部LLMへ送らないこと、VOICEVOX EngineとKokoro model download、custom TTS endpointの注意を書いた。
- README / README.en に Roadmap を追加し、Windows / Linux実機確認、設定UI、TTS provider整理、任意LLM summarizer、実デモGIF/スクリーンショット差し替えを候補にした。
- 検証として `rg -n "demo/index|demo/bridge|Webデモは|Web demo is|Codex log monitor|flowchart LR|Privacy|Roadmap|OpenAI API|custom TTS|設定UI|settings UI" README.md README.en.md` と該当範囲の `sed` を実行した。
- `PUBLIC_REPO_REVIEW_CHECKLIST.md` の P2 Demo And Documentation Polish 全項目を完了にした。

## 2026-05-28 CLI Help Version Env Example Release Notes

- Node monitor に `--version` / `-v` を追加し、`package.json` の version を表示するようにした。
- Node monitor の `--help` を拡充し、Common、Codex source、Speech、TTS、Examples に分けて主要オプションを表示するようにした。
- `.talking-pets.local.env.example` を追加し、installer が作る local env の形を確認できるようにした。
- README / README.en に voice preset の抜粋を追加し、VOICEVOX、Kokoro.js、OS fallback の初期値が見えるようにした。
- README / README.en に Release Process を追加し、CHANGELOG更新、`npm run check:syntax`、`npm run test:dry-run`、semver tag、GitHub Releasesに書く内容を決めた。
- 検証として `node --check scripts/pet-rollout-monitor.mjs`、`node scripts/pet-rollout-monitor.mjs --version`、`node scripts/pet-rollout-monitor.mjs --help`、`rg -n "talking-pets.local.env.example|Kokoro Heart|Release Process|semver tag|--version|--help" ...` を実行した。
- `PUBLIC_REPO_REVIEW_CHECKLIST.md` の P3 から、`--version`、`--help`、`.talking-pets.local.env.example`、voice preset抜粋、release tag / GitHub Releases運用の5項目を完了にした。

## 2026-05-28 Public Repo Checklist Completion Audit

- `package.json` のmetadata変更に合わせて `npm install --package-lock-only` を実行し、`package-lock.json` のroot packageにも `license` と `engines.node` が反映されることを確認した。
- `rg -- "- \\[ \\]" PUBLIC_REPO_REVIEW_CHECKLIST.md` を実行し、未完了チェック項目が0件であることを確認した。
- 最終検証として `npm run check:syntax` と `npm run test:dry-run` を再実行し、構文チェックと `[pet] CI dry run ready.` のdry-runが通ることを確認した。

## 2026-05-28 Local Checklist Ignore

- `PUBLIC_REPO_REVIEW_CHECKLIST.md` は作業用の消し込み正本であり、公開repoに含めない方針にした。
- `.gitignore` に `PUBLIC_REPO_REVIEW_CHECKLIST.md` を追加し、ローカルには残しつつ git の未追跡ファイル一覧に出ないようにした。

## 2026-05-28 Demo Preview PNG

- README上部のデモプレビューを、公開repoで安定して表示されやすいPNGへ切り替えた。
- `assets/demo-preview.svg` は編集用ソースとして残し、Codex bundled runtime の `sharp` で `assets/demo-preview.png` を生成した。
- README / README.en の画像参照を `assets/demo-preview.png` に変更した。
- Roadmap の差し替え対象も `assets/demo-preview.png` に更新した。
- 検証として `file assets/demo-preview.png assets/demo-preview.svg`、`rg -n "demo-preview\\.(png|svg)" README.md README.en.md implementation-notes.md assets/demo-preview.svg`、`npm run check:syntax`、`npm run test:dry-run` を実行した。

## 2026-05-28 Future Plan And Bilingual Demo Copy

- README内の短いRoadmapとは別に、将来対応を貯める `FUTURE_PLAN.md` を追加した。
- 韓国語と中国語について、現状は日本語/英語優先でその他fallbackであること、今後は `ko` / `zh` の言語判定、`--speech-language` 拡張、専用ローカルTTS provider検討、OS差分確認が必要なことを整理した。
- `demo/index.html` を英語既定にし、English / 日本語の切り替えボタンを追加した。
- `demo/bridge.html` も英語既定にし、English / 日本語の切り替えボタンと各言語のサンプル吹き出しを追加した。
- 公開向けデモから「マスター」口調を外し、サンプル文を中立的な表現へ変更した。
- `src/talking-pet-mvp.js` では読み上げ文から簡易的に `ja` / `en` / `ko` を判定し、未選択時は該当言語のWeb Speech voiceを優先するようにした。
- 共通パネルの固定日本語ラベルを `Test voice` / `Speech On` / `Speech Off` に変更した。
- README / README.en の Roadmap から `FUTURE_PLAN.md` へリンクした。
- 検証として `rg -n "マスター|Master|音声テスト|読み上げOn|読み上げOff" demo src README.en.md FUTURE_PLAN.md`、`node --check scripts/pet-rollout-monitor.mjs`、`npm run check:syntax`、`npm run test:dry-run` を実行した。

## 2026-05-28 Bridge Demo Positioning

- `demo/bridge.html` は現在の標準ルートではなく、Pet吹き出しDOMを監視できる環境向けの実験用DOMブリッジデモであることを明記した。
- `demo/bridge.html` のタイトルを `Experimental DOM Bridge Demo` に変え、ページ上部に「現在の標準ルートはrollout monitor」というnoticeを追加した。
- README / README.en の Web Demo 説明でも、`demo/bridge.html` は experimental prototype であり、現在の標準ルートでは使わないことを書いた。
- `FUTURE_PLAN.md` に、`demo/bridge.html` を experimental として残すか、legacy/experimental folderへ移すか、rollout monitor文書化後に削除するかを検討項目として追加した。

## 2026-05-28 Public Repo Cleanup For Old Routes

- 現在の標準ルートは rollout monitor なので、過去ルートの `demo/bridge.html`、`src/codex-pet-voice-bridge.js`、`scripts/pet-ocr-monitor.command`、`scripts/pet-ocr-monitor.swift` を `local-experimental/` へ退避した。
- `.gitignore` に `local-experimental/` を追加し、DOM bridge prototype と OCR monitor が公開repoへ上がらないようにした。
- README / README.en から `demo/bridge.html` の公開導線を削除し、Web demo は `demo/index.html` のみを案内する形にした。
- `FUTURE_PLAN.md` には、古いDOM bridge prototypeとOCR monitorはローカル退避済みで、公式DOM hookが出た時などに再検討する方針を書いた。
- `CHANGELOG.md` の browser demo 表現を、複数ページ前提から Web Speech API voice controls の単体デモへ修正した。
- 公開向け既定値からユーザー固有の呼びかけを外すため、`presets/speech-style.json`、Node monitor、Swift monitor、README例の `stripTerms` を空配列に変更した。
- 検証として、公開対象に `マスター|Master|OCR|bridge|Bridge|pet-ocr|codex-pet-voice-bridge|demo/bridge` が残っていないことを `rg` で確認した。残るのは `FUTURE_PLAN.md` のローカル退避方針のみ。
- `npm run check:syntax`、`npm run test:dry-run`、`zsh -n scripts/pet-rollout-monitor.command check.command install.command` を実行し、現行ルートの検証が通ることを確認した。
