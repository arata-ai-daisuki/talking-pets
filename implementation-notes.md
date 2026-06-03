# Implementation Notes

## 2026-05-31 Verification Status Refresh

- 現在の `sw_vers` / `uname -m` / `node --version` / `npm --version` / `codex --version` に合わせ、`docs/verification-status.md` の snapshot date と macOS release evidence draft を更新した。`codex --version` は PATH 更新 warning を出したが `codex-cli 0.135.0` は取得できたため、release evidence の既知情報として採用する。release readiness の固定チェックと CHANGELOG も同じ値へ同期した。

## 2026-05-31 Audio Triage Issue Fields

- `.github/ISSUE_TEMPLATE/bug_report.yml` と `.github/ISSUE_TEMPLATE/install_trouble.yml` に任意の `speech_language` / `config_source` 欄を追加した。CONTRIBUTINGでは音声・platform系の相談に speech-language value と config source を求めているが、通常のbug / install issueでは入力欄がなく落ちやすかったため。release readiness と unit test でも欄の存在と任意扱いを検査する。

## 2026-05-31 Command Wrapper Required Files

- `scripts/check-release-readiness.mjs` の `requiredFiles` に `check.command` / `install.command` / `start-selected-tts.command` を追加した。これらは `executableFiles` で実行権限と存在を確認していたが、公開前の必須ファイル一覧からは抜けていたため、release readiness の意図を package files / docs と揃える。
- 同じ理由で `scripts/pet-rollout-monitor.command` / `scripts/pet-rollout-monitor-node.command` も `requiredFiles` に追加した。package scope では必須になっているため、release readiness の通常ファイル存在チェックでも明示する。

## 2026-05-31 Markdown Link HTML Comment Skip

- `scripts/check-markdown-links.mjs` の link extraction でHTMLコメント部分を除外するようにした。fenced code block と同じく、コメントアウトした参考リンクや一時的なTODOリンクを実リンクとして扱うと false positive になりやすいため。通常のMarkdown link、reference-style link、HTML `href/src` はコメント外では引き続き検査する。
- HTMLコメント内の ``` / ~~~ が fenced code block 状態を誤って切り替えないよう、fence判定はコメント除去後の可視行に対して行う。コメントで一時的にコード例を隠した時に、その後の通常リンク検査が丸ごと止まらないようにするため。

## 2026-05-31 Verification Status Voicevox Note

- `npm run check:compat` の stateful 確認と `./check.command` の fixture-only 確認を再実行し、どちらも通ることを確認した。現環境では VOICEVOX Engine が未起動だったため、`docs/verification-status.md` に「VOICEVOX未起動は現在の macOS say 証跡の blocker ではない」と追記した。release evidence の audible TTS path が `macOS say` であることを明確にするため。
- `./scripts/pet-rollout-monitor.command --once --dry-run` と `npm run check:audio:strict` も再実行し、stateful dry-run とmacOS audio pathが通ることを確認した。stateful dry-run はlocal thread title / rollout path / conversation text を含むため、`docs/verification-status.md` に「公開へそのまま貼らず、sanitize と手動確認が必要」と追記した。

## 2026-05-31 PowerShell Starter Voicebox Guard

- `start-selected-tts.ps1` は `TALKING_PETS_VOICEBOX_PROFILE` / `TALKING_PETS_VOICEBOX_LANGUAGE` を monitor 引数へ渡していたが、release readiness の退行検出は macOS/Linux starter ほど明示的ではなかった。Windows starter でも `--voicebox-profile` / `--voicebox-language` が消えた場合に検出できるよう、`scripts/check-release-readiness.mjs` の固定チェックを追加した。

## 2026-05-31 Issue Template Field Regression Tests

- bug report / install trouble の `speech_language` / `config_source` 欄は release readiness で必須IDとして扱っていたが、unit test は欄の本文確認に寄っていた。
- それぞれのissue templateから `id: speech_language` または `id: config_source` が消えた場合に `githubTemplateIssues()` が落ちるmutation testを追加し、音声・設定ソースのtriage欄が将来の編集で静かに抜けないようにした。

## 2026-05-31 Space-Containing Secret Sanitizer

- `scripts/sanitize-public-output.mjs` は未クォートの `TALKING_PETS_*` 値や credential env 値を空白手前まで伏せる実装だったため、`TALKING_PETS_SAY_VOICE=Private Voice Name` や `SPACE_PASSWORD=private password with spaces` のようなログでは後続語が残る可能性があった。
- 公開issueへ貼るログの安全側へ寄せ、未クォート値は行末まで伏せるようにした。必要以上にその行の補足テキストを消す可能性はあるが、公開証跡用sanitizerでは漏えい防止を優先する。

## 2026-05-31 Public Preview Release Boundary

- 初回公開方針を macOS stable / Windows・Linux experimental の public preview として明文化した。Windows / Linux の audible TTS 実機証跡は公開後に Platform verification issue で集めるが、experimental 解除には使わない。
- README日英、release notes template、verification status、public repo checklist に同じ境界を追加し、release readiness でもこの文言が残ることを検査する。公開可否と platform graduation 条件を分けて、リリース直前に「Win実機がないから公開できない」と誤解しないようにするため。
- `docs/release-notes-template.md` の空の `What's Changed` / `Upgrade Notes` bullet を、初回 public preview 用の実文へ置き換えた。GitHub Release作成時に空bulletが残るのを避けるため、release readiness でも release notes template 内の空bulletを検出する。
- GitHub公開面では `implementation-notes.md` も見えるため、過去メモに残っていた maintainer のローカル絶対パスを `<old codex worktree>` / `<project workspace>` へ一般化した。release readiness でも maintainer home path / project path が公開テキストへ戻らないことを検査する。

## 2026-05-29 Public Check Endpoint Redaction

- `check.command` / `check.sh` / `check.ps1` は公開証跡へ貼られやすいため、VOICEVOX疎通ログでカスタムendpoint URLをそのまま出さないようにした。
- `127.0.0.1` / `localhost` / `[::1]` のローカルendpointだけは表示し、それ以外は `<redacted endpoint>` として出す。
- `scripts/check-release-readiness.mjs` と `test/monitor.test.mjs` に、checkスクリプトからendpoint redactionが消えた時に検出するガードを追加した。

## 2026-05-29 Public Output Sanitizer

- 外部contributorが実機検証やinstall troubleのログをpublic issueへ貼る前に使える `scripts/sanitize-public-output.mjs` と `npm run sanitize:public-output` を追加した。
- sanitizer は `[source]` / `[pet]` の本文、絶対パス、`TALKING_PETS_*` env値、外部endpoint URL、`state_5.sqlite`、rollout JSONL、生成音声、ローカル録画、archive、モデルファイル名を伏せる。
- README日英、platform verification issue、install trouble issue、real-device verification、release notes template、SECURITYから sanitizer へ誘導し、release readiness と unit test で退行を検出する。
- CIにも sanitizer の smoke check を追加し、CONTRIBUTING と public repo checklist に公開Issueへ貼る前の利用手順を追記した。

## 2026-05-29 Starter Voicebox Argument Alignment

- PowerShell版は全TTSモードで Voicebox互換設定を monitor へ渡していたが、macOS / Linux の shell starter は `auto` で `TALKING_PETS_VOICEBOX_MODE` / profile / language を渡していなかった。
- `start-selected-tts.command` と `start-selected-tts.sh` に `voicebox_config_args` を追加し、`auto` と `voicebox` で保存済み Voicebox-compatible endpoint 設定を一貫して渡すようにした。
- `voicevox` 明示指定でも `--voicebox-mode` を渡すようにし、保存済み設定とmonitor引数の見え方を揃えた。
- release readiness で shell starter から `voicebox_config_args` / `--voicebox-profile` / `--voicebox-language` が消えた場合を検出する。

## 2026-05-29 Sanitizer Pack Scope Guard

- `package.json` の `scripts/` allowlist により sanitizer は npm pack に含まれるが、`scripts/check-npm-pack.mjs` の必須ファイル一覧には未追加だった。
- `scripts/sanitize-public-output.mjs` を npm pack の required path に追加し、配布物から sanitizer が抜けた場合に `npm run check:pack` と unit test で検出するようにした。

## 2026-05-29 Voicebox Error URL Fragment Redaction

- `scripts/tts-voicebox.mjs` の `safeURLForLog()` は query string を落としていたが、URL fragment は残る可能性があった。
- endpoint URL の `#token` などに秘密値を入れてしまう利用者もあり得るため、`parsed.hash = ""` を追加し、parse不能URLでも `?` と `#` 以降を伏せるようにした。
- unit test と release readiness で、VOICEVOX / Voicebox error URLから query と fragment の両方が落ちることを固定した。

## 2026-05-29 Bug Report Sanitizer Hint

- install trouble と platform verification には `npm run sanitize:public-output` の案内があったが、通常の bug report には未追加だった。
- bug report はコマンド出力を貼る頻度が高いため、同じ sanitizer 導線を追記し、release readiness で消えた場合を検出する。

## 2026-05-29 Issue Template Voicebox Choice Alignment

- README / installer / config examples では Voicebox-compatible endpoint を正式なTTS経路として扱っているが、bug report と platform verification のTTS選択肢には直接の項目がなかった。
- 利用者が `Other local TTS` に逃げずに同じ名前で報告できるよう、`Voicebox-compatible endpoint` を issue template に追加した。
- install trouble の詰まり箇所placeholderにも Voicebox endpoint check を追加し、release readiness でこれらの文言が消えた場合を検出する。

## 2026-05-28 580c Worktree Recovery

- `<old codex worktree>/talking-pets` は古い `3104812` 由来の detached worktree で、現 `origin/main` に対して公開準備ファイルや旧実験ルートが混在していたため、worktree全体は取り込まない方針にした。
- 有益な差分として、macOS / Windows installer の表示言語切り替えと、日英混在の短いデモ文を最初の1文で切らず2文まで残す speech summary 改善だけを現 main ベースへ移植した。
- 現 main で追加済みの Node.js 22 major version check、`check:syntax` / `test:dry-run`、YAML issue template、実Pet overlay demo asset は維持した。
- README / README.en には、macOS installer の `en` / `ja` 選択と Windows `-Language ja` の使い方だけを追記した。
- `test/fixtures/mixed-ja-en-rollout.jsonl` を追加し、`Talking Pets` のように日本語文中へ英字が入るデモ文でも2文目が落ちないことを dry-run で確認できるようにした。

## 2026-05-27 MVP

- Codex Pet の `pet.json` はスプライト指定だけで、音声用フィールドは見つからなかった。
- Codex.app 本体には `openPetOverlay` / `petOverlay.*` の文字列があるが、署名付きアプリ本体を直接変更するのはMVPの範囲外にした。
- `<project workspace>/talking-pets` が空だったため、後で本体へ差し込みやすい独立JSアドオンとして作成した。
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
- README / README.en の冒頭に demo preview SVG のMarkdown画像参照を追加した。
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

## 2026-05-28 Cross-Platform Hardening And Safety Docs

- `scripts/pet-rollout-monitor.mjs` を直接実行時だけ `main()` が動く形へ変え、rollout抽出、言語判定、TTS routing、要約整形を `node:test` から import できるようにした。
- `test/monitor.test.mjs` を追加し、`event_msg:agent_message`、`response_item:message`、壊れたJSONL、巨大発話、日英混在要約、非assistant message除外を単体テストで確認できるようにした。
- `scripts/check-codex-compat.mjs` と `npm run check:compat` を追加し、fixtureとローカル `state_5.sqlite` / `threads.rollout_path` / rollout JSONL の互換性を検査できるようにした。CIやCodex未使用環境では `--no-state` でローカルDB検査を明示的にskipする。
- `scripts/check-audio-path.mjs` と `npm run check:audio` / `check:audio:strict` を追加し、macOS `afplay` / `say`、Windows PowerShell / `System.Speech`、Linux `aplay` / `paplay` / `ffplay` / `espeak` の見つかり方を音声再生前に診断できるようにした。
- Windowsの音声診断は `powershell.exe` または `pwsh.exe` を許可していたが、再生側が `powershell.exe` 固定だったため、`scripts/audio-platform.mjs` を追加してPowerShell選択を共通化した。
- Kokoro / VOICEVOX generated WAV playback と Node monitor の OS speech fallback は、`powershell.exe` を優先し、無ければ `pwsh.exe` を使う。
- `node:sqlite` が使えない Node.js build だと Codex local metadata を読めないため、`scripts/check-node-runtime.mjs` と `npm run check:runtime` を追加した。
- `check.command` / `check.ps1` からも runtime、compat、audio path 診断を呼び、利用者が通常のcheckだけでNode機能、Codex保存形式、音声再生前提を確認できるようにした。
- `docs/real-device-verification.md` を追加し、macOS / Windows / Linux ごとの実機release証跡フォーマット、実行コマンド、pass criteriaを固定した。
- `docs/release-notes-template.md` を追加し、GitHub Releasesへ貼る verified platforms、verified commands、known limits、credits/terms の雛形を固定した。
- install trouble issue template に `npm run check:audio` output 欄を追加し、音が出ない報告でOS側の再生パスを確認しやすくした。
- `assets/demo-preview.png` を生成previewから実録画の still frame に差し替え、未参照になった `assets/demo-preview.svg` は削除した。
- `scripts/check-markdown-links.mjs` と `npm run check:docs` を追加し、README / docs のローカルMarkdownリンク切れをCIとrelease前チェックで検出できるようにした。
- `scripts/check-release-readiness.mjs` と `npm run check:release` を追加し、公開前に必要なファイル、package metadata、demo asset、`.command` の実行権限、古い `assets/demo-preview.svg` の残存を検出できるようにした。
- release readiness の必須ファイルに core monitor、Swift monitor、TTS scripts、diagnostic scripts、PowerShell scripts、unit test file を追加し、package scripts も `check:syntax` / `check:release` / `check:audio:strict` / TTS entrypoints まで必須化した。
- `scripts/check-config-files.mjs` と `npm run check:config` を追加し、`presets/speech-style.json`、`presets/voices.json`、`.talking-pets.local.env.example`、`presets/examples/*.env` の形式と必須値を検査できるようにした。
- `check.command` / `check.ps1` にも config files セクションを追加し、通常のcheck導線だけでもプリセット破損に気づけるようにした。
- `scripts/check-config-files.mjs` は `.talking-pets.local.env` が存在する場合だけ任意検査するようにし、ユーザーが実際に使うローカル設定の形式破損も検出できるようにした。
- `start-selected-tts.command` はNodeがある時だけ起動前に `scripts/check-config-files.mjs` を実行する。macOS sayだけのNodeなし導線を壊さないため、Node未導入時は既存通り設定を読む。
- `start-selected-tts.ps1` はWindowsでNode必須のため、起動前に `scripts/check-config-files.mjs` を必ず実行する。
- `scripts/check-release-readiness.mjs` は `.github/workflows/ci.yml` 内の `npm run check:config` と、`package.json` の `check:all` に含まれる `npm run check:config` も検査するようにした。
- Windows / Linux は実機の audible TTS 未確認なので、README / README.en / release notes template / real-device verification docs の Experimental 表記を `scripts/check-release-readiness.mjs` で必須化した。
- `scripts/check-release-readiness.mjs` に公開禁止artifact検査を追加し、`.talking-pets.local.env`、`state_5.sqlite`、fixture以外のJSONL、generated wav、log/tmp、`node_modules/`、`local-experimental/` がrepo内にある場合は失敗するようにした。
- `scripts/check-release-readiness.mjs` を直接実行時だけ `main()` が動く形にし、公開禁止artifactの分類を `forbiddenArtifactLabel()` として単体テストできるようにした。
- `.gitignore` の `.talking-pets.local.env` / `*.wav` / `*.log` / `local-experimental/` と、`SECURITY.md` の private Codex logs / `state_5.sqlite` / generated audio 注意を release readiness で必須化した。
- `scripts/check-markdown-links.mjs` はMarkdownリンクだけでなく、Markdown/HTML内の local `src` / `href` も検査するようにし、READMEの `<video src>` や `demo/index.html` のscript参照のリンク切れを検出できるようにした。
- `scripts/check-markdown-links.mjs` を直接実行時だけ `main()` が動く形にし、MarkdownリンクとHTML `src` / `href` 抽出を単体テストできるようにした。
- `scripts/check-release-readiness.mjs` に GitHub issue form の基本構造、private text removal注意、PR template のcheck / docs / safety / real-device evidence 項目の検査を追加した。
- Node monitor の OS speech fallback が失敗した時に無言で終わらないよう、`runProcess` で command、exit code、signal、ENOENT を会話本文なしで表示するようにした。
- `.github/ISSUE_TEMPLATE/platform_verification.yml` を追加し、Windows / Linux / macOS の実機確認を bug report ではなく release evidence として集められるようにした。
- `.github/pull_request_template.md` を追加し、PR時に `npm run check:all`、README日英同期、CHANGELOG、implementation-notes、安全項目、real-device evidence を確認できるようにした。
- `start-selected-tts.ps1` の未設定時language routeをmacOS版と同じく有効側に倒し、`TALKING_PETS_SAY_VOICE` を `--voice` としてNode monitorへ渡すようにした。`install.ps1` の既定 `SayVoice` も `Kyoko` に揃えた。
- GitHub Actionsを `ubuntu-latest` / `macos-latest` / `windows-latest` matrixへ広げ、syntax、unit test、compat fixture、dry-run、shell / PowerShell parse、macOS Swift parseを走らせる形にした。
- CIの個別ステップにも `npm run check:runtime` を追加し、`node:sqlite` の利用可否が全OS matrixで明示的に見えるようにした。
- `scripts/check-release-readiness.mjs` でも workflow 内の `npm run check:runtime` を必須化し、runtime check がCIから外れたら公開前checkで検出できるようにした。
- `scripts/check-release-readiness.mjs` で `package.json` の `check:all` が syntax、runtime、unit test、compat、audio、config、docs、release、dry-run をすべて含むことを検査するようにした。
- 同じく `check:syntax` が core monitor、TTS scripts、diagnostic scripts、release/docs checkers の `node --check` をすべて含むことを検査するようにし、新しい `.mjs` entrypoint を追加した時の検証漏れを見つけやすくした。
- `docs/public-repo-review-checklist.md` の CI 説明を、runtime / audio / config / docs / release / shell / PowerShell / Swift parse まで含む現在の workflow に合わせた。
- `FUTURE_PLAN.md` の browser demo 記述を、公開導線が `demo/index.html` のみになった現在の状態に合わせ、旧 bridge demo 前提の "both browser demos" 表現を外した。
- `check.ps1` が `.talking-pets.local.env` を読み、保存済みTTS設定とVOICEVOX URLを診断へ反映するようにした。
- Windowsの `check.ps1` では runtime、compat、audio、config、dry-run を `Invoke-NodeDiagnostic` 経由で実行し、1項目が失敗しても残りの診断を続けるようにした。Node 22未満ではdry-runをskipする。
- `check.ps1` のdry-runにも `--no-warnings` を付け、`node:sqlite` のExperimentalWarningで診断出力が読みにくくならないようにした。
- `scripts/check-release-readiness.mjs` で、`check.ps1` が local config import、Node診断ラッパー、Node不足時dry-run skipを持つことを必須化した。
- `.gitignore` と `scripts/check-release-readiness.mjs` に、`.env` / `.env.*`、`.DS_Store`、SQLite DB、`.mp3` / `.m4a` / `.aac` / `.flac`、`.onnx` / `.safetensors` / `.gguf` の公開混入ガードを追加した。
- 公開してよいenv例外は `.talking-pets.local.env.example` と `presets/examples/*.env` のみにした。release-readiness の単体テストにも許可例外と禁止例を追加した。
- `SECURITY.md` に local env files と downloaded model files を公開issueへ含めない注意として追記した。
- `check.command` と `start-selected-tts.command` は `.talking-pets.local.env` を `source` せず、`KEY="value"` 形式だけを読む `load_config` へ切り替えた。Nodeが無いmacOS say導線でも、設定ファイル内のshell構文を実行しない。
- `scripts/check-release-readiness.mjs` で、macOS launcher / check script に `load_config` が存在し、`source "$CONFIG_FILE"` に戻っていないことを検査するようにした。
- macOS / Windows の config loader と `scripts/check-config-files.mjs` で、設定キーを既知の `TALKING_PETS_*` 7項目だけに制限した。`NODE_OPTIONS` など無関係な環境変数が `.talking-pets.local.env` から子プロセスへ流れないようにするため。
- `scripts/check-release-readiness.mjs` でも、macOS / Windows scripts と config validator に未知キー拒否の実装が残っていることを検査するようにした。
- `src/talking-pet-mvp.js` は README から案内される browser demo の本体なので、`package.json` の `check:syntax` に `node --check src/talking-pet-mvp.js` を追加した。
- `scripts/check-release-readiness.mjs` の必須ファイルに `demo/index.html` と `src/talking-pet-mvp.js` を追加し、demo HTML が `../src/talking-pet-mvp.js` を参照し、JSが `window.TalkingPetMVP` を公開していることも検査するようにした。
- `scripts/check-config-files.mjs` を import-safe にし、`allowedEnvKeys` と `validateEnvText()` を export して `node:test` から直接検証できるようにした。
- `test/monitor.test.mjs` に、`NODE_OPTIONS` のような無関係な環境変数を拒否し、`KEY="value"` 以外の形式を弾く単体テストを追加した。
- `scripts/check-release-readiness.mjs` に `checkWorkflow()` を追加し、CI workflow が ubuntu / macOS / Windows matrix、主要npm checks、dry-run fixture、shell parse、PowerShell parse、Swift parse を含むことを検査するようにした。
- `docs/real-device-verification.md` と `docs/release-notes-template.md` の verified commands に `check:config` / `check:docs` / `check:release` を追加し、公開証跡のsanitize項目も local env files / generated audio / downloaded model files まで明記した。
- `.github/ISSUE_TEMPLATE/platform_verification.yml` の commands欄にも、runtime / config / docs / release check と、private path、conversation text、local env values、`state_5.sqlite`、rollout JSONL、generated audio、model files を除く注意を追加した。
- `scripts/check-release-readiness.mjs` で、release notes / real-device verification / platform verification issue template に上記コマンドとsanitize注意が残っていることを検査するようにした。
- README / README.en の Privacy に、local env は `KEY="value"` data として既知 `TALKING_PETS_*` key のみ受け付けること、公開issue/release証跡へ local env、`state_5.sqlite`、rollout JSONL、generated audio、downloaded model files を添付しないことを追記した。
- README / README.en の Release Process に `npm run check:config` を追加し、`scripts/check-release-readiness.mjs` でも README 日英が config validation とsanitize注意を含むことを検査するようにした。
- `check.command` / `start-selected-tts.command` に `clear_config`、`check.ps1` / `start-selected-tts.ps1` に `Clear-LocalConfig` を追加し、local config 読み込み前とparse failure時に既知 `TALKING_PETS_*` process env を消すようにした。途中まで読んだ設定で診断や起動が続くのを避けるため。
- `scripts/check-release-readiness.mjs` でも macOS / Windows launcher と check script に config clear 処理が残っていることを検査するようにした。
- `scripts/check-codex-compat.mjs` を import-safe にし、既定のcompat検査で `test/fixtures/assistant-rollout.jsonl` と `test/fixtures/mixed-ja-en-rollout.jsonl` の両方を読むようにした。`--fixture` は複数回指定できる上書き用途として残した。
- `docs/public-repo-review-checklist.md` と `scripts/check-release-readiness.mjs` でも、mixed Japanese / English rollout fixture を互換性チェックの継続対象として見張るようにした。
- Node monitor の `--tts` / `--voicebox-mode` / `--speech-language` は許可値だけを受け付けるようにし、`--interval` / `--rate` は正の数、`--max-source-chars` は正の整数だけを受け付けるようにした。`NaN` や未知TTS名で監視ループやfallback挙動が曖昧になるのを避けるため。
- `test/monitor.test.mjs` に CLI option validation の単体テストを追加し、大文字入力の正規化と不正値の拒否を確認できるようにした。
- README / README.en の Troubleshooting に、CLI option validation で出るエラー時の指定値を追記した。
- `scripts/tts-voicebox.mjs` の接続失敗 / HTTP失敗ログは、`audio_query?text=...` のような会話本文入りqueryを落として表示するようにした。VOICEVOX未起動時に話す予定だった本文がterminalやissue貼り付けログへ混ざるのを避けるため。
- `scripts/tts-voicebox.mjs` を import-safe にし、`safeURLForLog()` を単体テストから検証できるようにした。
- `scripts/tts-kokoro.mjs` も直接実行時だけ `main()` が動く形へ変え、`KOKORO_VOICES` と `parseArgs()` を単体テストから検証できるようにした。Kokoro model を読み込まずにCLI surfaceを確認できる。
- `scripts/tts-kokoro.mjs` のCLI parserは未知optionと位置引数を拒否するようにした。入力ミスを静かに無視して別の音声やstdin待ちになるのを避けるため。
- `scripts/tts-kokoro.mjs` が直接 `@huggingface/transformers` の `env.cacheDir` を使うため、`package.json` / `package-lock.json` に直接依存として明記し、release readiness でも欠落を検査するようにした。
- `scripts/check-config-files.mjs` は形式だけでなく、`TALKING_PETS_VOICEVOX_URL` が http(s) URL であること、`TALKING_PETS_VOICEVOX_SPEAKER` が数値であること、Kokoro / say voice が空でないことも検査するようにした。
- `validateEnvValues()` と `isHTTPURL()` を export し、壊れた設定値の検出を単体テストで確認できるようにした。
- Node monitor の help で `--tts voicebox` が抜けていたため、実際の許可値 `auto|voicevox|voicebox|kokoro|say` と一致させた。
- Swift monitor でも `--tts` / `--voicebox-mode` / `--speech-language` の許可値検証、`--interval` / `--rate` / `--max-source-chars` の正値検証を追加し、macOS安定版とNode版のCLI surfaceを揃えた。
- Swift monitor のCLI parse失敗は `fatalError` ではなく `error: ...` と exit 2 で終わる `die()` に寄せた。利用者が入力ミスしただけでSwiftのstack dumpが出るのを避けるため。
- `scripts/check-swift-cli.mjs` と `npm run check:swift-cli` を追加し、macOS CIでSwift monitorの不正CLI値が短い `error:` だけで終わり、`Stack dump` / `Fatal error` を含まないことを検査するようにした。
- GitHub Actions のmacOS jobに `npm run check:swift-cli` を追加し、release readinessでもこのCI stepとscriptの存在を必須化した。
- `scripts/check-release-readiness.mjs` の package / workflow 検査を `packageIssues()` / `workflowIssues()` として切り出し、unit test から直接検証できるようにした。
- `test/monitor.test.mjs` に release-readiness drift test を追加し、`check:swift-cli` が `package.json` や GitHub Actions から外れた時に単体テストでも検出できるようにした。
- Linux experimental 導線として `check.sh` と `start-selected-tts.sh` を追加した。macOSの `.command` と同じく `.talking-pets.local.env` を `source` せず、既知キーだけを `KEY="value"` として読み、Node monitorへ渡す。
- CIに `bash -n check.sh start-selected-tts.sh` を追加し、release readiness でもLinux scriptsの存在、実行権限、config loader、CI構文チェックを必須化した。Ubuntuで `zsh` 前提にならないよう、`.command` の zsh parse はmacOS jobだけで走らせる形に分けた。
- Node monitor のCLIは `--tts voicebox`、`--voicebox-mode`、`--voicebox-profile`、`--voicebox-language` を持っていたが、local config validator と start scripts が受けられなかったため、`TALKING_PETS_VOICEBOX_MODE` / `PROFILE` / `LANGUAGE` を既知キーに追加した。
- macOS / Windows / Linux の start scripts から Voicebox-compatible 設定を Node monitor へ渡すようにし、`TALKING_PETS_TTS="voicebox"` が設定ファイル経由でも使える状態へ揃えた。
- `presets/examples/generic-voicebox.env` を追加し、Voicebox-compatible endpoint 向けの設定例も `npm run check:config` と release readiness の対象にした。
- `scripts/check-config-files.mjs` に `checkLauncherConfigKeys()` を追加し、config validator の既知キーと macOS / Linux / Windows launcher の許可キーがずれたら `npm run check:config` で検出するようにした。
- Linux experimental の実機検証手順と release notes template に `./check.sh` を追加し、platform verification issue template でも `./check.command` / `.\check.ps1` / `./check.sh` のどれを貼るべきか明示した。
- `scripts/check-platform-scripts.mjs` と `npm run check:platform-scripts` を追加し、`check:all` から現在OSで使う `.sh` / `.command` / `.ps1` / Swift scripts の構文検査を走らせるようにした。CI専用だったplatform script parseをローカルrelease gateにも寄せるため。
- `platformChecks()` を単体テストから確認し、Linux は bash、macOS は bash / zsh / Swift parse / Swift CLI、Windows は PowerShell parse を選ぶことを固定した。
- Windows の platform script parse も `scripts/audio-platform.mjs` の `windowsPowerShellCommand()` を使うようにし、`powershell.exe` がある環境ではそちらを優先し、無ければ `pwsh.exe` にfallbackする既存方針と揃えた。
- release readiness の単体テストで、GitHub Actions から `npm run check:platform-scripts` が外れた場合も `workflowIssues()` が検出することを確認するようにした。
- README / README.en に、既存Codex Petへ声を足す位置づけ、Safety Model表、`npm run check:compat`、`presets/examples/` の手動設定例、`npm run check:all` release gateを追加した。
- bug / install / platform verification / TTS provider request のGitHub issue templateに、private conversation text、local env values、`state_5.sqlite`、rollout JSONL、generated audio、downloaded model files、credentials類を公開issueへ貼らない注意を揃えた。
- `scripts/check-release-readiness.mjs` に `githubTemplateIssues()` を追加し、issue form構造とprivacy guidanceが抜けた場合をrelease readinessと単体テストの両方で検出できるようにした。
- `docs/real-device-verification.md` のsanitize表記も `downloaded model files` に揃え、release readinessでこの文言が抜けた場合を検出するようにした。
- `CONTRIBUTING.md` に Linux experimental の `./check.sh` / `npm run monitor:node -- --once --dry-run` を追加し、issue報告時のcheck output候補にも `./check.sh` を含めた。release readinessでもこの導線を必須化した。
- `npm pack --dry-run` を実行したところ、`.npmignore` が無いため `.github/`、test、`implementation-notes.md`、デモ動画までtarball対象になることを確認した。npm公開はまだ `private: true` だが、将来の誤packに備えて `.npmignore` を追加し、release readiness でも存在と主要除外項目を必須化した。
- npm tarball の対象を `.npmignore` だけに任せず、`package.json` の `files` allowlist でも明示した。release readiness と単体テストで、allowlist欠落や `implementation-notes.md` の混入を検出するようにした。
- `scripts/check-npm-pack.mjs` と `npm run check:pack` を追加し、`npm pack --dry-run --json` の結果から package size、entry count、必須ファイル、禁止ファイル、実行bitを検査するようにした。ユーザー環境の `~/.npm` 権限問題を避けるため、checker内部では一時cacheを使う。
- GitHub Actions の Node matrix に `npm run check:pack` を追加し、`workflowIssues()` と単体テストでもCIからpack checkが外れた場合を検出するようにした。
- README / README.en、CONTRIBUTING、release notes template、real-device verification、public readiness checklist に `npm run check:pack` を追加し、release readinessでも記載漏れを検出するようにした。
- `scripts/check-npm-pack.mjs` の必須ファイルを拡張し、`package.json`、診断用check scripts、`scripts/pet-rollout-monitor.command` / `scripts/pet-rollout-monitor-node.command` がtarballから落ちた場合も検出できるようにした。
- `scripts/check-npm-pack.mjs` では Windows の `npm.cmd` を直接spawnするとCIで失敗する可能性があるため、Windowsのみshell経由で実行する `shouldUseShellForNPM()` を追加し、単体テストでplatform別挙動を固定した。
- `check:pack` の必須ファイルに全example env、`presets/speech-style.json`、`presets/voices.json` を追加し、軽量プリセット一式がtarballから落ちた場合も検出できるようにした。
- `npm pack --json` のmode値はWindows CIでUnix実行bitを反映しない可能性があるため、`shouldCheckExecutableMode()` を追加し、実行bit検査はmacOS / Linuxでのみ行うようにした。Windowsではファイル存在とscope検査を継続する。
- `docs/public-repo-review-checklist.md` のtag前コマンドに `npm run check:config` / `npm run check:docs` を追加し、`CONTRIBUTING.md` の個別check一覧にも `npm run check:platform-scripts` を追加した。release readinessでもこれらの記載漏れを検出するようにした。
- `docs/public-repo-review-checklist.md` のCI説明とKeep Watchingにも `npm run check:pack` を反映し、`FUTURE_PLAN.md` のrelease前確認方針も `check:all` / `check:audio:strict` / `check:pack` / platform check script の現行形に更新した。
- `.github/pull_request_template.md` の Checks に `npm run check:platform-scripts` と `npm run check:pack` を追加し、launcherやtarball scopeを触るPRで個別確認が見えるようにした。release readinessでもこれらの項目を必須化した。
- `scripts/check-release-readiness.mjs` に `packageLockIssues()` を追加し、`package-lock.json` の top-level name/version、lockfileVersion、requires、root package の name/version/license/engines.node/dependencies が `package.json` とずれた場合を検出するようにした。依存追加やNode要件変更時に `npm install` / `npm ci` の更新忘れを早めに見つけるため。
- `test/monitor.test.mjs` に package-lock root metadata drift の単体テストを追加し、engine、既存dependency、余計なdependencyのズレをそれぞれ検出できることを固定した。
- `docs/public-repo-review-checklist.md` と `docs/release-notes-template.md` のrelease evidenceコマンド先頭に `npm ci` を追加した。lockfile drift検査だけでなく、実際にlockfileからclean installできることも公開前証跡に残すため。
- `scripts/check-release-readiness.mjs` でも public readiness checklist と release notes template に `npm ci` が残っていることを検査するようにした。
- README / README.en の Release Process にも `npm ci` を追加し、READMEを読んだ利用者やメンテナーがclean lockfile installを飛ばさないようにした。release readinessでも日英READMEの `npm ci` 記載を必須化した。
- `.github/pull_request_template.md` の Checks にも `npm ci` を追加した。CONTRIBUTINGやrelease docsだけでなく、PR作成画面でもlockfile再現性の確認が見えるようにするため。release readiness でもPR template内の `npm ci` を必須化した。
- 実際に `npm ci` 後に `npm run check:all` を実行したところ、`check:release` がローカルに作られた `node_modules/` を forbidden dependency folder として全件検出して失敗した。release手順として `npm ci` を求める以上、working tree上の ignored install tree は正常なので、`scripts/check-release-readiness.mjs` の recursive scan は `.git` と同じく `node_modules` を降りないようにした。tarball混入は引き続き `.npmignore` / `package.json.files` / `check:pack` で検査する。
- 上記の前提を保つため、release readiness で `.gitignore` に `node_modules/` が残っていることも検査するようにした。
- FUTURE_PLAN の中国語項目のうち、この環境で確認できる範囲として、Node / Swift monitor の文字種判定を更新した。かな文字を含む文は `ja`、ハングルを含む文は `ko`、漢字だけのCJK文は `zh` とし、`--speech-language zh` も許可した。中国語専用TTS providerは追加せず、現時点ではOS speech fallbackへ流す。
- `presets/speech-style.json` と `presets/voices.json` に `zh` を追加し、`scripts/check-config-files.mjs` でも `zh` entry の存在を検査するようにした。README / README.en には、漢字だけの日本語短文は中国語扱いになる可能性があることを明記した。
- `test/monitor.test.mjs` に中国語判定と `zh` CLI hint の単体テストを追加し、release readiness でも日英README、Node/Swift monitor、テストに `zh` の記載が残ることを検査するようにした。
- `scripts/check-swift-cli.mjs` に `--speech-language fr` の短いerror確認と、`--speech-language zh` の dry-run success 確認を追加した。macOS安定版のSwift monitorでも `zh` 追加が実際にCLIとして受け付けられることをplatform checkで固定するため。
- 韓国語は既にハングル判定で `ko` になっていたが、speech style / voice presets では fallback 任せだったため、`ko` の明示entryを追加した。専用TTS providerはまだ追加せず、現時点ではOS speech fallbackへ流す。
- Node / Swift monitor の内蔵speech styleにも `ko` fallback文を追加し、`scripts/check-config-files.mjs` と release readiness で `ko` preset が残ることを検査するようにした。
- `test/fixtures/ko-zh-rollout.jsonl` を追加し、既定の `npm run check:compat` が韓国語 / 中国語を含む rollout fixture も読むようにした。`test/monitor.test.mjs` では `fixturePaths({ fixtures: [] })` にこのfixtureが残ることを固定した。
- 保存済み `.talking-pets.local.env` から言語を固定できるように、任意キー `TALKING_PETS_SPEECH_LANGUAGE` を追加した。macOS / Linux / Windows の start scripts は値がある時だけ `--speech-language` として monitor へ渡す。既存のlocal configとの互換性を保つため required key にはしない。
- `presets/examples/ko-say-fallback.env` と `presets/examples/zh-say-fallback.env` を追加し、`TALKING_PETS_SPEECH_LANGUAGE="ko"` / `"zh"` でOS speech fallbackを試せるようにした。release readiness と npm pack check でもこの2つのexampleが残ることを検査する。

## 2026-05-29 Installer Speech Language Config

- 新規インストールで生成される `.talking-pets.local.env` にも `TALKING_PETS_SPEECH_LANGUAGE="auto"` を書くようにした。exampleや手動設定だけに存在すると、新規ユーザーが「言語固定できる設定キー」を見つけにくいため。
- `install.ps1` には `-SpeechLanguage auto|ja|en|ko|zh|other` を追加し、Windowsでもインストール時に言語ヒントを明示できるようにした。macOSの対話式installerは初期値 `auto` を生成するだけに留め、追加質問は増やしていない。
- README / README.en の Windows Experimental に `.\install.ps1 -SpeechLanguage ja` の例を追加し、Windowsのインストール時オプションが埋もれないようにした。
- release readiness で `install.command` / `install.ps1` の `TALKING_PETS_SPEECH_LANGUAGE` 記載を検査するようにした。起動スクリプトだけでなく、生成元のinstallerから設定キーが落ちる退行を防ぐため。

## 2026-05-29 Platform Evidence Speech Language Fields

- `docs/real-device-verification.md` の証跡項目に speech language hint と config source を追加した。`TALKING_PETS_SPEECH_LANGUAGE` や `--speech-language` を追加したため、音が出た証跡だけでは再現条件が弱くなるのを避けるため。
- Windows / Linux の実機検証コマンドに `ko-zh-rollout.jsonl` を使った `--speech-language ko` / `--speech-language zh` のOS speech fallback確認例を追加した。韓国語/中国語fallbackを「ある」と言う場合は、どのhintとfixture/sourceで確認したかを残す。
- platform verification issue template に `Speech language hint` と `Config source` を追加し、release notes template の platform evidence にも `speech-language: auto|ja|en|ko|zh|other` を含めた。
- release readiness で real-device verification、release notes template、platform verification issue template に speech language / config source の証跡項目が残ることを検査するようにした。
- `githubTemplateIssues()` でも platform verification issue template の `id: speech_language` と `id: config_source` を検査し、単体テストでそれぞれの欠落を検出できるようにした。文字列だけのrelease gateより、issue formの退行を早く見つけるため。
- release evidence の必須コマンド検査を `npm run check:all`、`npm run check:runtime`、`npm run check:audio:strict` まで広げた。runtime と実機audio pathは公開前証跡として重要なので、release notes / real-device verification / platform verification issue template から落ちた場合に `check:release` で検出する。
- release evidence のコマンド検査を `releaseEvidenceIssues()` として切り出し、単体テストから `check:audio:strict` と `check:runtime` の欠落を直接検出できるようにした。
- `releaseEvidenceIssues()` に package scripts も渡せるようにし、docsに載せている `npm run ...` が `package.json` の実在scriptを指していることも検査するようにした。特に `check:audio:strict` のような実機証跡用scriptが消えた場合を単体テストで固定した。
- Platform verification issue template の commands欄に `npm ci` を追加し、外部OS証跡でも clean install 再現性を残すようにした。`releaseEvidenceIssues()` の必須コマンドにも `npm ci` を加え、docs / issue template から抜けた場合を単体テストで検出する。
- `githubTemplateIssues()` で issue template ごとの必須 field id を検査するようにした。Bug report の `commands`、Install trouble の `audio_check`、Platform verification の `speech_language` / `config_source`、TTS provider request の `terms` など、 triage に必要な入力欄が名前変更や削除で抜けた時に単体テストで検出できる。
- `githubTemplateIssues()` で必須回答が必要なfieldの `required: true` も検査するようにした。Platform verification の `audible` などが任意に変わると実機証跡として弱くなるため。`audio_check` や `notes` は任意fieldとして残す。
- PR template の real-device evidence checklist に、speech language hint と config source が証跡へ含まれることを追加した。release readiness でもこの文言を検査し、platform verification issue 側だけでなくPRレビュー時にも見えるようにした。
- `scripts/check-npm-pack.mjs` の必須tarballファイルに `CHANGELOG.md`、`CONTRIBUTING.md`、`FUTURE_PLAN.md`、`SECURITY.md` を追加した。`package.json` の files allowlist では公開対象にしていたため、実際の `npm pack --dry-run` 結果でも落ちていないことを検査する。
- release readiness でも `scripts/check-npm-pack.mjs` が上記4ファイルを必須tarballファイルとして見ていることを検査するようにした。`package.json` allowlist と実pack検査がまたずれないようにするため。
- `npm run check:all` は公開repoの総合チェックとして再現性を優先し、ユーザー固有の `~/.codex/state_5.sqlite` を読まない `npm run check:compat -- --no-state` を使う形へ変更した。実ローカルCodex互換の確認は引き続き `npm run check:compat` を単独で実行する。
- 実機release evidence では `npm run check:all` だけだとローカル Codex state DB 互換を見ないため、`docs/real-device-verification.md`、`docs/release-notes-template.md`、platform verification issue template、public checklist に stateful `npm run check:compat` を必須コマンドとして追加した。release readiness と単体テストでもこの記載漏れを検出する。
- `.github/pull_request_template.md` の Checks にも stateful `npm run check:compat` を追加した。release evidence だけでなく、PR作成時にも Codex local storage 互換確認が必要な変更だと分かるようにするため。`githubTemplateIssues()` と単体テストでもPR templateから抜けた場合を検出する。
- `check.command` / `check.ps1` / `check.sh` の出力に `speech language: ...` を追加した。実機証跡では speech language hint が必須なので、通常のcheck outputを貼るだけで再現条件が残るようにするため。release readiness でも3つのcheck scriptにこの出力が残ることを検査する。
- `check.command` / `check.ps1` / `check.sh` は、`.talking-pets.local.env` が無い場合でも既知 `TALKING_PETS_*` process env を最初にクリアするようにした。親シェルから残った設定で、証跡の `tts` や `speech language` が実際の local config とずれるのを避けるため。release readiness でも config file 存在判定前のclear処理を検査する。
- `check.command` / `check.ps1` / `check.sh` の出力に `platform: <OS/version> / <arch>` を追加した。real-device verification の必須項目である OS/version と CPU architecture を、通常のcheck outputからそのまま転記できるようにするため。release readiness でも3つのcheck scriptに platform output が残ることを検査する。
- `check.command` / `check.ps1` / `check.sh` の出力に `config source: ...` を追加した。実際のpreset名までは自動判定しないが、local config file を読んだか、設定なしで動いたかを証跡ログへ残せるようにするため。release readiness でも3つのcheck scriptに config source output が残ることを検査する。
- `check.command` / `check.ps1` / `check.sh` は `.talking-pets.local.env` が無い場合も `tts: unset` を出すようにした。Platform verification の TTS path 欄を埋める時に、設定未指定だったことがcheck outputから分かるようにするため。release readiness でも no-config 分岐の `tts: unset` を検査する。
- `check.command` / `check.ps1` / `check.sh` の末尾に、公開共有前に private paths、conversation text、local env values、`state_5.sqlite`、rollout JSONL、generated audio、downloaded model files を除く注意を追加した。Platform verification issue の commands欄へcheck outputを貼る直前に、sanitize条件が再表示されるようにするため。release readiness でも3つのcheck scriptにこの注意が残ることを検査する。
- `check.command` / `check.ps1` / `check.sh` の dry-run は、実ローカル thread ではなく `test/fixtures/assistant-rollout.jsonl` を読む安全な fixture dry-run に変更した。実表示確認で live dry-run が rollout path と会話文を出すことを確認したため、通常check outputをPlatform verification issueへ貼る時のsanitize負担を下げる。実ローカルCodex state互換は `npm run check:compat` に分離する。
- macOS / Linux の fixture dry-run は絶対パスではなく `test/fixtures/assistant-rollout.jsonl` の相対パスを渡すようにした。`check.command` の実表示確認で、絶対パスを渡すと workspace path が `[rollout]` に出ることを確認したため。release readiness でも `$ROOT_DIR/test/fixtures/...` に戻らないことを検査する。
- `check.command` / `check.ps1` / `check.sh` 内の compat も `scripts/check-codex-compat.mjs --no-state` に変更した。stateful compat は失敗時に `rollout_path` などのprivate pathを出す可能性があるため、通常check outputではfixture互換のみを確認し、実ローカルCodex state互換は `npm run check:compat` を別途実行してsanitizeする分担にした。release readiness でもcheck scripts内の `--no-state` を検査する。
- README / README.en、real-device verification、public checklist も上記分担に合わせ、通常の platform check scripts は公開向けfixture出力、stateful Codex互換は `npm run check:compat` として明示した。release readiness でも README の `npm run check:compat` と private path 注意、real-device verification の fixture-only compatibility 表記、public checklist の分担表記を検査する。
- `npm run check:compat` のstateful検査も、失敗時の `state_5.sqlite` や `rollout_path` を既定で `<redacted path>` 表示にした。ローカル調査で実パスが必要な場合だけ `--show-private-paths` を明示して戻せるようにし、公開issueへ貼る前のsanitize負担を下げた。単体テストとrelease readinessでもこのredactionが残ることを検査する。

## 2026-05-29 Voicebox Evidence Label Alignment

- Real-device checklist and release-notes platform evidence now use the same `Voicebox-compatible endpoint` label as the issue templates, so TTS evidence does not drift between report forms and release artifacts.
- Release-readiness checks now guard the explicit macOS, Windows, and Linux TTS evidence labels in both the release template and real-device release-note snippet, plus the checklist wording.

## 2026-05-29 Sanitizer Release Gate Input

- The public checklist and contributor check block previously listed `npm run sanitize:public-output` as if it were a standalone check, but the sanitizer is a filter that needs stdin or an input file.
- Updated those release-gate examples to pipe `./check.command` output into the sanitizer, and added release-readiness guards so the input-bearing example stays visible.
- Added explicit macOS, Windows PowerShell, and Linux sanitizer pipe examples to the real-device verification and release-notes templates so external platform evidence does not rely on translating the macOS command mentally.

## 2026-05-29 Platform Verification Sanitization Field

- Platform verification issues are intended to become linkable release evidence, so privacy cleanup should be an explicit required field rather than text hidden in the commands description.
- Added a required `Public evidence sanitized?` dropdown and release-readiness guards for the field id, label, and sanitizer command reference.
- Clarified that `sanitized = No` or `audible = No` reports are still useful for follow-up, but do not count as release evidence for graduating Windows / Linux from experimental.
- Added a short contributor request checklist to `docs/real-device-verification.md` so maintainers can ask for Windows / Linux evidence without rewriting the full verification instructions each time.
- Linked that quick request path from `CONTRIBUTING.md` and the public repo checklist, with release-readiness guards, so contributors and maintainers can find the short path from the usual entrypoints.
- Mirrored the real-device docs' `check:compat` exception into the Platform verification issue template: if a verifier has no local Codex state yet, they should paste the stateful result, record the limitation, and treat `--no-state` as supplemental fixture evidence only.

## 2026-05-29 Release Evidence Links

- Release notes had per-platform evidence text but no place to link the supporting Platform verification issue, which makes Windows / Linux graduation harder to audit later.
- Added an `Evidence link` column to the release-notes platform table and documented that sanitized Platform verification issue URLs should be copied there.
- Release readiness now guards the release-note link column, the real-device verification instruction, and the public checklist wording.
- Added the same public evidence sanitization requirement to the pull request checklist so reviewers see it before release-note links are accepted.
- README / README.en release-process notes now also mention sanitized Platform verification issue URLs and the `Evidence link` column, so the top-level release instructions match the detailed templates.
- Added a pull request checklist guard for platform status changes: only sanitized evidence with one audible spoken line counts, while follow-up reports stay out of graduation decisions.
- README / README.en の `./check.command` 成功例を、現在の出力に合わせて `platform`、`config source`、`speech language`、fixture-only compat、relative fixture dry-run を含む形へ更新した。初回利用者が実際の出力とREADME例の差で迷わないようにし、release readinessでもこの例が古い形へ戻らないよう検査する。
- `scripts/check-codex-compat.mjs` の引数エラーを、Node.js のstack traceではなく `compat: ...` の短い診断と exit 2 で終えるようにした。未知optionや値不足は利用者の入力ミスなので、実装ファイルパスやstackを見せずに直せる形へ寄せた。単体テストでは未知option時に `at parseArgs` が出ないことを確認する。
- `scripts/check-audio-path.mjs` の引数エラーも、`audio path: ...` の短い診断と exit 2 で終えるようにした。実機検証で利用者が触る `npm run check:audio` / `check:audio:strict` は、入力ミス時もstack traceを出さない方が報告ログとして扱いやすいため。単体テストとrelease readinessでこの挙動を固定した。
- `scripts/tts-voicebox.mjs` のCLI parserを許可option方式へ変更した。以前は未知の `--foo value` を黙って受け取れてしまい、typo時に意図しない既定値で音声生成へ進む可能性があったため、Kokoro CLIと同じく未知optionと位置引数を拒否する。単体テストでは `--list-voices` や `--profile-id` の受理、未知option / 値不足 / 位置引数の拒否をモデルやendpointへ触れずに確認する。
- 値を取るCLI optionが、直後の既知flagを誤って値として飲み込まないようにした。Node monitor、stateful compat、Kokoro、Voicebox で `--voice --once`、`--fixture --no-state`、`--url --play` のような入力を値欠損として扱う。発話本文などが `--hello` のように始まる可能性もあるため、単純に `--` 始まりを全部拒否するのではなく、既知flagだけを値欠損判定に使う。
- macOS安定版のSwift monitorにも同じ既知flagベースの値欠損判定を入れた。`--voice --once` のような入力を `--voice requires a value` として短く落とし、`scripts/check-swift-cli.mjs` と release readiness でこの退行を検出する。
- `check.command` / `check.sh` / `check.ps1` は、壊れた `.talking-pets.local.env` を見つけた場合も診断表示自体は続けるが、最後に `check: failed -> fix .talking-pets.local.env ...` を出して非0終了するようにした。公開証跡や実機検証で、設定ファイルが壊れているのにcheck成功扱いになるのを避けるため。release readinessでも各check scriptに invalid config source と final failure が残ることを検査する。
- `scripts/check-platform-scripts.mjs` は、Windows以外でも `pwsh` / `pwsh.exe` が見つかる環境ではPowerShell scriptsをparseするようにした。macOS開発環境にPowerShell Coreが入っている場合、Windows実機を待たずに `install.ps1` / `check.ps1` / `start-selected-tts.ps1` の構文退行を拾えるようにするため。`scripts/audio-platform.mjs` も `pwsh` コマンド名を認識するようにした。
- README / README.en と real-device verification に、壊れた `.talking-pets.local.env` では platform check script が `check: failed -> fix .talking-pets.local.env ...` で非0終了することを追記した。実装だけでなく、利用者とrelease証跡のpass criteriaからも設定破損を見落とさないようにするため。release readinessでもこの文言を必須化した。
- Windowsの `start-selected-tts.ps1` はNode monitor専用なので、起動前に `Get-Command node` と Node major version を確認し、Node.js 22未満または未導入なら短いエラーで停止するようにした。最後のmonitor起動も `node --no-warnings @args` に変え、`node:sqlite` のExperimentalWarningが通常ログへ混ざらないようにした。README / README.en と release readiness でもこの前提を固定する。
- Windows installer の `-Tts` に `voicebox` を追加し、`-VoiceboxMode voicevox|generic`、`-VoiceboxProfile`、`-VoiceboxLanguage` を保存できるようにした。`presets/examples/generic-voicebox.env` と start scripts は既に Voicebox 互換endpointを扱えるため、Windowsだけinstallerから設定生成できないズレを解消する。README / README.en に `.\install.ps1 -Tts voicebox -VoiceboxMode generic ...` の例を追加し、release readinessでも生成キーとdocsを検査する。
- macOS installerにも `5) Voicebox-compatible endpoint` を追加し、endpoint URL、mode、profile、languageを `.talking-pets.local.env` へ保存できるようにした。`start-selected-tts.command` は既に `TALKING_PETS_VOICEBOX_*` を読むため、生成元の欠落を埋める変更。README / README.en のTTS選択表にも Voicebox-compatible endpoint を追加し、release readinessでmacOS installerの生成キーを検査する。
- `scripts/check-installer-configs.mjs` を追加し、macOS installer と PowerShell installer が Voicebox-compatible endpoint 設定を実際に `.talking-pets.local.env` へ生成できることを一時ディレクトリ上で検査するようにした。生成結果は `check-config-files.mjs` の env parser / validator で検証し、repo直下にはlocal envを残さない。`check:installers` として `check:all`、syntax、release readiness、npm pack scopeにも組み込んだ。
- CIは個別ステップ構成で `check:all` 自体を実行しないため、`npm run check:installers` をGitHub Actionsにも明示的に追加した。あわせて README / README.en、CONTRIBUTING、public checklist、real-device verification、release notes template、platform verification issue、PR template にも installer-generated config check を追加し、release readiness / release evidence command検査から抜けを検出できるようにした。
- `scripts/check-installer-configs.mjs` は、Linuxなど対象installer runtimeが無い環境ではskipを許容するが、macOSではmacOS installer、WindowsではPowerShell installerの生成検査が実行済みであることを必須にした。CI matrixで各native platformのinstaller生成がskip成功に見える退行を避けるため。単体テストと release readiness でもこの必須条件を固定した。
- Linux実機検証で「install」を手動 `cp presets/...` だけに頼らないよう、`install.sh` を追加した。対話式に auto / VOICEVOX / Kokoro / Linux espeak / Voicebox-compatible endpoint を選び、既存と同じ `.talking-pets.local.env` 形式を生成する。`check-installer-configs.mjs` でも Voicebox-compatible endpoint 経路の生成を一時ディレクトリで検査し、Linux CIでは native installer check として必須にした。
- `check:installers` の説明を macOS / Windows / Linux installer に更新し、real-device verification と release notes template には macOS `./install.command`、Windows `.\install.ps1`、Linux `./install.sh` をすべて明示した。Platform verification issue は install / dry-run / audible TTS evidence を要求するため、OS別docsでも installer command が証跡から抜けないようにする。
- `npm run check:compat` を stateful で実行し、このローカル環境の Codex state DB から最新 rollout を読めることを確認した。`check:all` では公開向けに `--no-state` を使うが、release evidence では stateful compat も必要なため、現時点の証跡として残す。
- `test/monitor.test.mjs` の release-readiness drift test に `check:installers` を追加し、package scripts や GitHub Actions から installer-generated config check が外れた時に単体テストでも検出できるようにした。
- `scripts/check-installer-configs.mjs` は Voicebox-compatible endpoint だけでなく、Linux `say`（実体は `espeak` fallback）と Windows `say` の生成設定も検査するようにした。macOS `say` installer は自動実行すると実音声を鳴らすため、自動検査では触らず、音を鳴らさないOS speech系経路だけを追加した。
- `test/monitor.test.mjs` に、Linux platform script check が `install.sh` / `check.sh` / `start-selected-tts.sh` をまとめてparse対象にすることと、npm pack scope から `install.sh` が抜けた場合に検出することを追加した。release readiness だけでなく単体テストでも Linux installer の混入漏れを拾うため。
- `scripts/check-config-files.mjs` の env parser は、先頭の UTF-8 BOM を無視するようにした。Windows PowerShell 5 系の `Set-Content -Encoding UTF8` で `.talking-pets.local.env` がBOM付きになる可能性があるため。未知キー拒否や `KEY="value"` 形式検査は維持し、単体テストでもBOM付き先頭行を固定した。
- macOS / Linux の shell config loader も先頭の UTF-8 BOM を無視するようにした。`check.command`、`start-selected-tts.command`、`check.sh`、`start-selected-tts.sh` はNode validatorを通る前後に独自で `.talking-pets.local.env` を読むため、Windows生成configを持ち回った場合でも先頭キーを誤って unsupported key にしないようにする。
- PowerShell側の `check.ps1` と `start-selected-tts.ps1` も、先頭行の UTF-8 BOM を明示的に除去してからlocal configを読むようにした。PowerShell runtimeによって `Get-Content` のBOM扱いが変わっても、同じ `.talking-pets.local.env` を安定して読めるようにするため。
- PowerShell側のlocal config正規表現も JS / zsh / bash と同じ `^([A-Z0-9_]+)="([^"]*)"$` に揃えた。以前の `^([^=]+)="(.*)"$` は値中の `"` まで受け取り得たため、validatorとloaderで形式解釈がずれる余地があった。
- `scripts/check-installer-configs.mjs` の生成env検査を、期待キーの部分一致から完全一致へ強化した。Voicebox経路の期待値にも共通キー（speaker / Kokoro voice / say voice）を含め、`say` 経路にVoicebox専用キーが混ざるような退行も検出できるようにした。
- README / README.en の制限表現を、macOS上でのPowerShell構文・生成設定検査と、未確認のWindows実機PowerShell実行を区別する表現へ直した。
- release readiness でも `scripts/check-installer-configs.mjs` が共通キー（`TALKING_PETS_VOICEVOX_SPEAKER` / `TALKING_PETS_KOKORO_VOICE` / `TALKING_PETS_SAY_VOICE`）を期待envに含めていることを検査し、installer生成envの完全一致チェックが弱く戻らないようにした。
- README / README.en のTTS選択例を、macOS専用寄りの `./scripts/pet-rollout-monitor.command` から cross-platform な `npm run monitor:node -- ...` へ変更した。macOS安定版のSwift monitorを使う場合だけ `.command` に置き換えられる、と補足した。
- release readiness でも README / README.en の direct TTS examples が `npm run monitor:node -- --tts voicevox|kokoro|say` を案内していることを検査するようにした。
- `docs/release-notes-template.md` のmacOS verified commandsに dry-run と audible `say` 例を追加し、release note側でも install / check だけでなく「dry-runで読み取れる」「1行 audible TTS が鳴る」まで証跡コマンドとして残せるようにした。
- Windows の real-device / release note コマンド例を `node scripts/pet-rollout-monitor.mjs ...` 直呼びから `npm run monitor:node -- ...` に揃えた。READMEのTTS選択例と同じ入口にして、Windows / Linux の experimental Node monitor 導線が分裂しないようにするため。
- release readiness でも release notes template に macOS dry-run / audible TTS、Windows `npm run monitor:node --` dry-run / Korean fallback TTS が残ることを検査するようにした。
- `releaseEvidenceIssues()` に platform evidence command 検査を追加し、release notes template / real-device verification から macOS dry-run、macOS audible `say`、Windows/Linux Node dry-run、Korean/Chinese OS speech fallback 例が抜けた場合を単体テストでも検出できるようにした。
- Windows / Linux で同じ `npm run monitor:node -- --once --dry-run ...` を使うため、platform evidence command 検査は必要出現回数も見るようにした。片方のOSだけdry-run例が抜けても、もう片方の同じ文字列で検査が通らないようにするため。
- README / README.en のデモ動画リンクを、tarballに含めない大きな `.mov` への相対リンクから GitHub URL へ変更した。静止画はtarballにも含めるが、3MB級の動画は `.npmignore` で除外して軽量性を保つため。
- `scripts/check-npm-pack.mjs` に package document link 検査を追加し、npm tarballに含まれる Markdown / HTML が、tarballに含まれない相対リンクを指した場合に `check:pack` で失敗するようにした。単体テストでは README から `docs/demo/...frame.png` が抜けた場合を検出する。
- package document link 検査で README / README.en から `docs/public-repo-review-checklist.md` へのリンクがtarball内で欠けることを検出したため、この公開準備チェックリストも package allowlist に含め、`.npmignore` から除外指定を外した。公開読者がREADMEから辿る継続チェックなので、内部専用扱いではなく配布対象にする判断。
- package document link 検査は、tarball内ドキュメントから `../...` や絶対パスでpackage外へ逃げる相対リンクも失敗扱いにした。配布物の読者が辿れないローカル前提リンクを見逃さないため。
- `scripts/check-config-files.mjs` の config key coverage 対象に `install.command` / `install.sh` / `install.ps1` も追加した。check / start scripts だけでなく、設定を生成するinstaller側も全 `TALKING_PETS_*` キーを認識・出力できる状態を `npm run check:config` で見張るため。
- example / preset env の必須キーに `TALKING_PETS_SPEECH_LANGUAGE` を追加した。実機証跡と多言語fallbackの再現条件に関わるため、配布する設定例から抜けた場合は `npm run check:config` で検出する。既存ユーザーのローカル `.talking-pets.local.env` だけは互換のため missing を許容する。
- platform check scripts の config 表示を絶対パスから `config: .talking-pets.local.env` へ変更した。公開証跡へ貼る前提の出力なので、private path を減らすため。
- shell launcher / check script の設定形式エラーでは、問題の行そのものではなく行番号だけを出すようにした。壊れた `.talking-pets.local.env` の値をエラー出力へ漏らさないため。
- PowerShell の `check.ps1` / `start-selected-tts.ps1` でも、壊れたlocal configのエラーを絶対パスではなく `.talking-pets.local.env` と行番号だけに寄せた。Windows実機証跡を公開issueへ貼る時のsanitize負担を下げるため。
- 壊れた `.talking-pets.local.env` を一時環境で再現し、shell側の `config: invalid format ($CONFIG_FILE)` が絶対パスを出すことを確認したため、`check.command` / `check.sh` / `start-selected-tts.command` / `start-selected-tts.sh` も相対名表示に揃えた。
- `scripts/check-release-readiness.mjs` に `localConfigFailureLogIssues()` を追加し、壊れた `.talking-pets.local.env` のエラー表示が「相対ファイル名 + 行番号」だけになっていることを6つのplatform scriptでまとめて検査するようにした。単体テストでも `$CONFIG_FILE` や raw line 表示へ戻った場合を検出する。
- CHANGELOGの初期要約を Linux installer / check / starter 追加後の状態に合わせ、macOS / experimental Windows / experimental Linux の3系統として読めるように直した。README.en の Windows Experimental 見出し直下に残っていた重複行も削除した。
- `CONTRIBUTING.md` のOS別手順も real-device verification と同じ入口へ揃え、macOS は `./install.command`、Windows は `.\install.ps1` と `npm run monitor:node -- --once --dry-run` を使う形に直した。public checklist には、platform stability を変える前に installer / dry-run / audible TTS evidence を `docs/real-device-verification.md` で残す注意を追加した。
- 追加確認として、現在のmacOS環境で `npm run check:compat` が実Codex state DBまで読み、`npm run check:audio:strict` が `afplay` / `say` をOKとし、`./check.command` が fixture-only compatibility と dry-run `[source]` / `[pet]` まで通ることを確認した。
- Swift monitor CLI のstack dump退行を見落としにくくするため、README / README.en の release process、CONTRIBUTING の compatibility checks、PR template に `npm run check:swift-cli` を明示した。release readiness でもこれらの導線から抜けた場合を検出する。
- README / README.en の Quick Start に、macOS say を選ぶ非対話インストール例（`printf ... | ./install.command`）を追加した。初回利用者や検証者が追加TTS providerなしで同じ設定を再現できるようにし、release readiness でもこの例が抜けないようにした。
- `install.command` / `install.sh` / `install.ps1` の保存完了メッセージを絶対パスから `.talking-pets.local.env` 表示へ変更した。実機検証やinstall troubleでinstaller outputを貼る時にホームディレクトリなどのprivate pathが混ざりにくくなるようにし、release readiness でも `$CONFIG_FILE` / `$Config` 表示へ戻らないことを検査する。
- `scripts/check-installer-configs.mjs` に installer 実行outputの安全性検査を追加した。生成envの中身だけでなく、stdout/stderrに一時作業dirや絶対 `.talking-pets.local.env` path が出ていないことも `npm run check:installers` と単体テストで確認する。
- `npm run check:swift-cli` を real-device verification と release notes template の verified commands / pass criteria に追加した。Swift monitor CLI の短いエラー表示はmacOS安定版の品質条件なので、READMEやPRテンプレだけでなくrelease evidence側でも必須にした。
- Platform verification issue template の commands 欄にも `npm run check:swift-cli` を追加した。外部contributorが実機証跡を送る入口でも、release notes / real-device verification と同じチェック粒度になるようにした。
- `releaseEvidenceIssues()` の共通必須コマンドにも `npm run check:swift-cli` を追加した。個別の文字列検査だけでなく、release evidence docs / platform verification issue template の横断検査と単体テストでSwift CLI品質条件の抜けを検出するため。
- `npm run check:all` にも `npm run check:swift-cli` を追加した。macOS以外ではskipして0終了するためクロスプラットフォーム性は保ちつつ、名前通りの一括チェックでSwift monitor CLIのstack dump退行を拾えるようにする。
- README / README.en の前提条件に Linux experimental section を追加し、Node.js 22、bash、`aplay` / `paplay` / `ffplay` / `espeak`、ローカルTTS環境の要件を明記した。platform表とLinux install/check/start scriptsを追加した状態に、初回読者向けのrequirementsを揃えるため。release readinessでもこのsectionを必須化した。
- npm tarball の必須配布物として `README.en.md` と `LICENSE` を `package.json.files`、`scripts/check-npm-pack.mjs`、release readiness の package allowlist 検査に明示した。npmの自動同梱に頼らず、英語READMEとライセンスが配布物から抜けた場合を単体テストで検出するため。
- `CREDITS.md` に Voicebox-compatible / custom local TTS endpoint の注意を追加した。`--tts voicebox` で任意endpointを呼べるため、endpoint本体・音声データ・生成音声をrepoに含めないこと、公開音声ではendpoint software / voice / model terms と credit notation を確認すること、custom endpointへ会話文が送られ得ることを明記した。README日英とrelease notes templateもこの注意へリンクする表現へ更新し、release readinessで退行を検出する。
- TTS provider request issue template に `Offline and privacy behavior` 欄を追加した。新しい音声provider候補では、完全local/offlineか、初回model downloadがあるか、会話文がlocal/remote endpointへ送られるかが実装判断に直結するため。`githubTemplateIssues()` と単体テストでも `privacy` field と説明文の欠落を検出する。
- `package.json` に `packageManager: npm@11.6.4` を追加した。release evidence で `npm ci` を必須にしているため、どのnpmでclean installを検証しているかをmanifest側にも残す。release readiness と単体テストでも packageManager が曖昧に戻らないようにした。
- GitHub Actions でも `npm install -g npm@11.6.4` を実行し、`npm ci` 前に `node --version` / `npm --version` を表示するようにした。`packageManager` で固定したnpm版とCIのclean install証跡を一致させるため。`workflowIssues()` と単体テストでもCIからpinned npm stepが外れた場合を検出する。
- README / README.en に `TALKING_PETS_SAY_VOICE` / `--voice` はmacOS `say` 用で、Windows `System.Speech` と Linux `espeak` のOS音声fallbackでは現状voice選択に使われないことを追記した。設定例に `Kyoko` が残っていてもLinux/Windowsの必須voiceではないと分かるようにするため。release readinessでもこの注意が消えないようにした。
- Node monitor の診断出力は、絶対rollout pathを既定で `<redacted path>` にするようにした。`readLatestSpeechCandidate()` の unreadable error と `[rollout]` 表示の両方でprivate pathが公開issueへ混ざりにくくするため。ローカルデバッグ用には `--show-private-paths` を追加し、README日英とrelease readinessで導線を固定した。
- README / README.en の末尾注意を Windows 単独の experimental 表現から Windows / Linux 両方の experimental 表現へ揃えた。Linux installer / check / starter を追加した後も、実機 install / dry-run / audible TTS evidence が出るまでは両OSを同じ扱いにするため。release readiness でもこの末尾注意を検査する。
- `docs/public-repo-review-checklist.md` の Release Gate に Windows `.\check.ps1 2>&1 | npm run sanitize:public-output` と Linux `./check.sh 2>&1 | npm run sanitize:public-output` を追加した。real-device verification / release notes template と同じく、公開issueへ貼る前のsanitize例をOS別に見せるため。release readinessでも3OS分のsanitize例を検査する。
- `docs/public-repo-review-checklist.md` の Release Gate を、common local release gate、macOS evidence commands、Windows evidence commands、Linux evidence commands に分割した。ひとつのbash code blockにPowerShellコマンドが混ざると外部検証者が実行場所を間違えやすいため。release readiness でも各見出しとOS別check commandを検査する。
- Platform verification issue template に任意の `codex_version` 欄を追加した。`docs/real-device-verification.md` では Codex Desktop / CLI version を記録対象にしていたため、GitHub issue側にも貼り先を用意する。必須にすると外部検証者がversionを取れない場合に報告できなくなるので `required: false` とし、release notes template には「分かる場合は evidence に含める」と書いた。
- `docs/release-notes-template.md` の Verified Platforms 表と `docs/real-device-verification.md` の Release Note Snippet に `Codex: <version|unknown>` placeholder を追加した。本文だけの注意だとrelease notes作成時に落ちやすいため、実際にコピーする証跡行へ入れる。release readinessでもこのplaceholderを検査する。
- Platform verification issue template の TTS 選択肢を、汎用 `OS speech` から `macOS say`、`Windows OS speech`、`Linux espeak` に分割した。release notes のTTS表記はOS別なので、issueから転記する時にどのOS音声fallbackを使ったか曖昧にならないようにする。`docs/real-device-verification.md` の記録項目と release readiness も同じ選択肢へ揃えた。
- `docs/release-notes-template.md` と `docs/real-device-verification.md` のmacOS TTS placeholderを `say` から `macOS say` へ揃えた。Platform verification issue の選択肢をそのままrelease notesへ転記できるようにするため。issue template のnotes例も、汎用 `OS speech` ではなく `Linux espeak` として具体化した。
- `githubTemplateIssues()` で、`macOS say` / `Windows OS speech` / `Linux espeak` が Platform verification issue の `tts` dropdown ブロック内に残っていることを検査するようにした。単なる全文検索だとnotes例に文字列が残っているだけで通るため、選択肢自体の退行を単体テストで捕まえる。
- `.github/pull_request_template.md` と `docs/public-repo-review-checklist.md` の実機証跡チェックを、Platform verification issue の現在の項目に合わせた。TTS path tested、speech language hint、config source、Codex Desktop / CLI version if known をPRレビュー時にも見えるようにし、release readinessでもこの文言を検査する。
- `docs/release-notes-template.md` と `docs/real-device-verification.md` のWindows / Linux TTS placeholderを `Windows OS speech` / `Linux espeak` に揃えた。Platform verification issue の選択肢からrelease notesへ転記する時に、`OS speech` や `espeak` へ手で言い換える必要をなくすため。
- `githubTemplateIssues()` で、GitHub issue template ごとの必須labelも検査するようにした。`platform_verification.yml` の `verification`、`tts_provider_request.yml` の `enhancement` / `tts` などが外れると公開運用時に証跡issueやprovider依頼を追いにくくなるため。単体テストでは `verification` label の退行を検出する。
- `CONTRIBUTING.md` の public log sanitizer 例を macOS だけでなく Windows `.\check.ps1` と Linux `./check.sh` にも広げた。real-device verification や public review checklist と同じ3OS導線にし、外部contributorが自分のOSのcheck outputをsanitizeしやすくするため。release readinessでも3OS分の例を検査する。
- `CONTRIBUTING.md` の Issues 節に、Bug report / Install trouble / Platform verification / TTS provider request の使い分けを追加した。実機証跡やprovider要望が通常bugへ流れるとtriageとrelease evidenceが追いにくくなるため。release readinessでも4テンプレの使い分け文を検査する。
- README / README.en の Release Process に、bug報告、install相談、TTS provider要望、platform verification の使い分けは `CONTRIBUTING.md` の Issues guideを見る導線を追加した。初見の公開利用者がREADMEから直接適切なissue templateへ進めるようにするため。release readinessでも日英の導線を検査する。
- README / README.en の issue guide リンクを `CONTRIBUTING.md#issues` に変更した。`CONTRIBUTING.md` 全体ではなく該当節へ直接飛ばし、報告テンプレの使い分けへ最短で辿れるようにするため。
- `scripts/check-markdown-links.mjs` と `scripts/check-npm-pack.mjs` で Markdown / HTML document link の `#anchor` も検査するようにした。README から `CONTRIBUTING.md#issues` へ直接リンクするため、ファイル存在だけではなく見出しanchorが実際に残っていることまで `npm run check:docs` / `npm run check:pack` で守る。単体テストでは valid anchor と missing packaged anchor の両方を確認する。
- `scripts/sanitize-public-output.mjs` で `$HOME/...`、`${HOME}/...`、`~/...`、`%USERPROFILE%\\...` 形式のprivate pathも伏せるようにした。check script本体は絶対パスを出しにくくしているが、ユーザーが手元ログやshell出力を混ぜてissueへ貼る可能性があるため、sanitizer側でも環境変数展開前のpath表現を守る。
- README / README.en の Status 文言を「公開レビュー可能なMVP」/ `public-review-ready MVP` に揃えた。日本語だけ「公開準備中」と読むと、英語のpublic-ready表現や公開レビュー用checklistと温度差が出るため、公開済み安定版ではなくレビュー可能なMVPであることを日英同じ粒度で示す。
- README / README.en の手動セットアップ説明を `npm install` から `npm ci` へ寄せた。release evidence、CONTRIBUTING、CI は lockfile 再現性のため `npm ci` を標準にしているため、Linux手順、TTS選択表、troubleshootingでも同じ導線に揃える。`install.command` 内の `npm install` は対話installerが依存をその場で補う実装なので今回は維持した。
- `.gitignore` / `.npmignore` / release readiness / npm pack guard / sanitizer に、追加音声形式（ogg/oga/opus）、ローカル録画（mp4/webm/mkv）、archive（zip/tgz/tar/tar.gz）を追加した。README用の正規デモ `docs/demo/talking-pets-overlay-2026-05-28.mov` はrepo内に残し、それ以外の録画・配布前archive・生成音声が公開repoやpublic issueへ混ざるのを防ぐため。
- README / README.en / SECURITY / real-device verification / release notes / issue templates のpublic privacy guidanceも、local recordings と archives を明示するように揃えた。コード側のsanitizerやforbidden artifact guardだけが強くなっても、外部contributorが添付してよいものを誤解すると公開issueに残るため。
- GitHub Actions の public-output sanitizer smoke に `private-demo.mp4` と `talking-pets-release.zip` を追加し、`<redacted artifact>` と元ファイル名非表示を確認するようにした。録画/archiveを説明とガードに追加しただけでCI上の実例が古いままだと、sanitizer退行を見逃しやすいため。
- sanitizer の artifact 拡張子へ `.mov` を追加し、CI smoke と unit test でも `private-demo.mov` が伏せられることを固定した。release readiness は `.mov` をローカル録画として禁止しているため、public issueへファイル名だけ貼られた場合も同じ扱いにする。
- CONTRIBUTING と PR template の安全チェックにも、local recordings、archives、local env files を明示した。実装側の forbidden artifact guard と公開issue guidance が強くても、レビュー時の人間チェックリストが古いと添付漏れを見逃しやすいため、release readiness で退行検出する。
- `.gitignore` に `*.mov` を追加し、公式デモ `docs/demo/talking-pets-overlay-2026-05-28.mov` だけ例外にした。release readiness と sanitizer は `.mov` をローカル録画扱いしていたため、手元録画がgitに乗りにくい状態へ揃える。`.npmignore` は全 `.mov` を配布外にし、npm tarballの動画除外方針を単純化した。
- release readiness は `*.sqlite` / `*.sqlite3` / `*.db` を禁止していたが、ignore、sanitizer、公開向け注意は `state_5.sqlite` 中心だったため、ローカルSQLite DB全般を同じ保護範囲へ広げた。Codex以外のcache DBや一時DBも会話・利用環境情報を含み得るため。
- README日英の sanitizer 説明と GitHub Actions smoke にも SQLite DB filename の例を追加した。ガードだけ広がっても、利用者とCIが見る実例が古いままだと `metadata.sqlite3` のようなcache DB名の漏れを見逃しやすいため。
- `scripts/check-npm-pack.mjs` の forbiddenPatterns にも SQLite DB を追加した。`.npmignore` と release readiness だけでは、将来 `package.json.files` 側の変更でtarballへDBが入る可能性を直接検出できないため、pack checker本体で拒否する。
- `scripts/check-npm-pack.mjs` の forbiddenPatterns に `local-experimental/` と `node_modules/` も追加した。release readiness はrepo直下で禁止していたが、pack checker本体にも入れることで、package allowlistが変わった時のtarball混入を直接検出できる。
- `scripts/check-npm-pack.mjs` の forbiddenPatterns に `.DS_Store` と `.jsonl` も追加した。macOSメタデータとrollout記録は `.npmignore` で除外しているが、package allowlist変更時にもtarball側で直接止めるため。
- `.github/ISSUE_TEMPLATE/install_trouble.yml` の `audio_check` 欄も、他の公開ログ欄と同じprivacy checklistへ揃えた。音が出ない報告では `npm run check:audio` の出力だけ貼られる可能性があり、そこでSQLite DB名やrollout JSONL名の注意が落ちるのを避けるため。
- `scripts/sanitize-public-output.mjs` でも `.DS_Store` を `<redacted artifact>` に伏せるようにした。pack/release guardでは禁止していたが、公開issueへ貼るログのsanitizer smokeには実例がなかったため、CIと単体テストにも追加した。
- `scripts/sanitize-public-output.mjs` で、引用なしの `TALKING_PETS_*=` env値も伏せるようにした。`.env` 本体は `KEY="value"` 形式だが、shellやdebug logでは引用なしで表示される可能性があり、endpoint URLやlocal設定値がpublic issueへ残り得るため。
- `docs/release-notes-template.md` の Windows / Linux verified commands に通常の `npm run monitor:node -- --tts say --once --rollout test/fixtures/assistant-rollout.jsonl` を追加した。real-device verification では通常OS音声と ko/zh fallback の両方を見るが、release note template は fallback 側だけだったため、証跡作成時に通常TTS確認が抜ける可能性があった。
- `check.command` / `check.sh` / `check.ps1` の最後に出る公開前注意を、issue template と README のprivacy checklistに合わせた。古い文言は `state_5.sqlite`、rollout JSONL、生成音声、モデルファイル中心で、local SQLite DB全般、local recordings、archives、macOS metadataが抜けていたため。
- README / README.en の `./check.command` 成功例を、現在の実出力に合わせて更新した。mixed-ja-en / ko-zh fixture、audio path の `[ok]` 行、dry-run の `[thread]` 行が例から抜けていたため、初回ユーザーが実出力と見比べた時に余計な不安が出ないようにする。
- README / README.en の Windows experimental 説明を、VOICEVOX / Kokoro 前提ではなく Windows OS speech、VOICEVOX、Kokoro、Voicebox-compatible endpoint の選択肢として書き直した。あわせて CONTRIBUTING と README の直接dry-run例は `--rollout test/fixtures/assistant-rollout.jsonl` を明示し、初回確認や公開証跡でローカルCodex stateへ不用意に触れにくくした。
- GitHub issue templates と real-device verification のprivacy guidanceにも `macOS metadata` を追加した。README / check scripts / sanitizer は `.DS_Store` を扱うようになっていたが、公開Issueへ貼る入口の注意が古いままだと添付前レビューで見落としやすいため。
- Pull request checklist に `npm run check:release` を明示した。`check:all` には含まれるが、README / issue template / release gate / package scope のような公開準備差分では、release-readiness を直接意識できるほうがレビュー時の抜け漏れが少ないため。
- release readiness でも PR template に `npm run check:release` が残ることを検査するようにした。
- bug report / install trouble / platform verification / real-device verification の公開証跡注意に `credentials` を追加した。SECURITY と release notes では credentials をpublic issueへ貼らない方針になっていたが、実際のログ貼り付け欄から抜けていたため。
- release readiness の issue template privacy guidance と platform verification field 検査にも `credentials` を追加し、公開Issue入口の注意が古く戻った場合に検出する。
- GitHub Actions に `npm run check:all` を直接実行するstepを追加した。個別チェックstepは失敗箇所を見やすくするため残しつつ、ローカル主ゲートとして案内している aggregate script 自体がCIで壊れていないことも確認するため。
- `workflowIssues()` と単体テストでも CI から `npm run check:all` が外れた場合を検出するようにした。
- README / README.en / CONTRIBUTING の公開ログ案内に、credentials は sanitizer だけでは自動判定しきれないため手動確認する注意を追加した。issue template と SECURITY 側の `credentials` 禁止方針に、初見導線のREADME/CONTRIBUTINGも揃えるため。
- release readiness でも README日英と CONTRIBUTING に credentials の手動確認注意が残ることを検査するようにした。
- `docs/real-device-verification.md` の Quick Contributor Request と sanitizer 説明を、platform check output だけでなく公開する全コマンド出力へ広げた。実機証跡では `npm ci`、`check:compat`、dry-run、audible TTS output も貼るため、check script だけをsanitizeすれば十分と読まれないようにするため。
- Platform verification issue template と release notes template も「every command output」をsanitizeする表現へ揃え、release readiness でこの注意が残ることを検査する。
- `scripts/sanitize-public-output.mjs` で、`OPENAI_API_KEY=...`、`ACCESS_TOKEN=...`、`Authorization: Bearer ...` のような典型的な credential env/header pattern も `<redacted credential>` に伏せるようにした。完全なsecret検出はできないためREADME/CONTRIBUTINGの手動確認注意は残しつつ、よくある貼り付け事故を機械的に減らす。
- unit test、GitHub Actions sanitizer smoke、release readiness に credential redaction の実例を追加した。
- sanitizer が対応している `X-Api-Key: ...` と `LOCAL_PASSWORD='...'` 形式も unit test と GitHub Actions smoke に追加した。実装だけが広く、証跡例が狭い状態だとheader系credentialの退行を見落としやすいため。
- `workflowIssues()` でも `X-Api-Key` / password-like env の redacted output と元secret非表示チェックがCI smokeに残ることを検査する。
- `.talking-pets.local.env.example` に `TALKING_PETS_UI_LANGUAGE="en"` を追加した。installer生成configと `presets/examples/*` はすでにUI languageを持っているため、手動コピー元だけが省略形だと、初回設定とinstaller設定の差分が分かりにくくなるため。
- `scripts/check-config-files.mjs` でも root env example の `TALKING_PETS_UI_LANGUAGE` を必須にし、release readiness でこの期待が残ることを検査する。
- `package.json.files` と `.npmignore` を調整し、`test/fixtures/*.jsonl` だけは npm pack 対象に含めるようにした。`package.json` の `test:dry-run`、README、release evidence docs が fixture rollout を使うため、配布物からfixtureだけ抜けると packaged command が壊れるため。
- `scripts/check-npm-pack.mjs` では `test/fixtures/*.jsonl` を required path に追加し、private rollout JSONL / test files 禁止ルールから public fixture だけを除外した。単体テストでも fixture JSONL は forbidden 扱いにならず、通常の private JSONL は引き続き禁止されることを固定する。
- `check.command` / `check.sh` / `check.ps1` の公開前warningにも `credentials` と `credential env/header values` を追加した。README / CONTRIBUTING / issue templates ではcredential注意を追加済みだったが、実際にユーザーが貼りがちなcheck output末尾の警告が古いままだったため。
- release readiness でも3つのcheck scriptに credential warning が残ることを検査するようにした。
- npm pack と release readiness の fixture JSONL 例外を `test/fixtures/` ディレクトリ単位から、既知の `assistant-rollout.jsonl` / `mixed-ja-en-rollout.jsonl` / `ko-zh-rollout.jsonl` の3ファイル単位へ絞った。`test/fixtures/private-rollout.jsonl` のようなファイルが将来増えた場合に、private rollout JSONLとして止めるため。
- release readiness の SQLite DB 禁止も `test/fixtures/` 例外を外し、fixture配下でも `.sqlite` / `.db` は禁止するようにした。JSONL fixtureを許可したいだけでDB fixtureを公開対象にする意図はないため。
- `docs/public-repo-review-checklist.md` に、npm packageへ入れてよい `test/` 配下は既知のpublic rollout fixture 3本だけだと明記した。コード側のallowlistだけだと、人間の公開レビュー時に「fixture配下なら追加してよい」と読まれる余地が残るため。
- release readiness でも上記の public review checklist 文言を検査するようにした。pack guard と release guard の意図がドキュメントから落ちた時に検出するため。
- `scripts/sanitize-public-output.mjs` は、private rollout JSONL を伏せつつ、既知の public fixture path 3本だけは証跡として残すようにした。sanitized check output から fixture名まで消えると、公開証跡がどの入力を読んだか追いにくくなるため。
- README 日英と CONTRIBUTING に、sanitizer が private rollout JSONL を伏せ、public fixture path は残すことを明記した。挙動とドキュメントがずれると、外部contributorが「rollout JSONLは全部伏せるべき」と誤解しやすいため。
- SECURITY、issue templates、real-device verification、release notes の公開添付注意も、単なる `rollout JSONL` 禁止から `private rollout JSONL` 禁止へ寄せた。public fixture は証跡として残す一方、実ユーザーのCodex会話ログ由来JSONLは引き続き公開しない方針を明確にするため。
- release readiness の issue template / docs 検査も `private rollout JSONL` と public fixture evidence の文言を要求するようにした。privacy guidance の粒度が戻った場合に検出するため。
- PR template の safety checklist も `private rollout JSONL` 禁止へ揃えた。レビュー時だけ古い「rollout JSONL全般禁止」表現が残ると、public fixtureを使う証跡方針と矛盾するため。
- GitHub Actions の public-output sanitizer smoke に、public fixture path が残り、private relative / absolute rollout JSONL が伏せられる実例を追加した。単体テストだけでなくCI上の貼り付けログ例でも同じ方針を確認するため。
- `docs/public-repo-review-checklist.md` の sanitizer 注意を、platform check output だけでなく check / dry-run / installer / TTS の公開出力全般へ広げた。real-device verification や issue template では全コマンド出力を対象にしているため、公開レビューchecklistだけ狭く読まれないようにするため。
- release readiness でも上記の public review checklist 文言を検査するようにした。証跡sanitize範囲が古い表現へ戻った場合に検出するため。
- CONTRIBUTING の macOS / Windows / Linux 手動チェックに、fixture dry-run だけでなく1回だけ音声を出すTTS確認コマンドを追加した。real-device evidence は audible TTS を要求しているため、contributorがローカル確認だけで終わらせて音声証跡を取り忘れないようにするため。
- release readiness でも CONTRIBUTING のOS別TTS確認コマンドを検査するようにした。release evidence docs と contributor導線のズレを検出するため。
- `docs/public-repo-review-checklist.md` のOS別 evidence command block に、dry-run と audible fixture TTS コマンドを追加した。release evidence の必須条件は installer / check だけでは満たせないため、公開レビューchecklistからも実行コマンドを直接追えるようにするため。
- `FUTURE_PLAN.md` の release evidence 方針も installer/check/dry-run/audible TTS の script set として書き直した。将来作業メモだけ古い「installer/check」中心の表現に残ると、Windows / Linux graduation 条件とずれるため。
- `check.command` / `check.sh` / `check.ps1` の公開前warningも、`rollout JSONL` 全般禁止から `private rollout JSONL` 禁止へ寄せ、known public fixture path は証跡として残ってよいと明記した。sanitizer とissue template側の方針に、実際にユーザーが貼りがちなcheck output末尾の注意を揃えるため。
- release readiness でも3つのcheck scriptに `private rollout JSONL` と public fixture evidence 文言が残ることを検査するようにした。
- `docs/verification-status.md` を追加し、2026-05-29時点のmacOSローカル検証済み項目と、Windows / Linuxの実機未検証項目を分けて記録した。`docs/real-device-verification.md` は再利用可能な手順、status文書は現在地という役割に分けるため。
- README日英と public review checklist から verification status へリンクし、package allowlist / npm pack guard / release readiness でも同梱と内容を検査するようにした。公開レビュー時に「何が済んでいて何が実機待ちか」を一箇所で確認できるようにするため。
- `docs/verification-status.md` に `check:pack` / `check:release` と update rules を追加し、release evidence の横断検査対象にも含めた。status文書だけがrelease gateやplatform graduation条件から遅れないようにするため。
- PR template の Documentation checklist に `docs/verification-status.md` 更新項目を追加した。verification state、release gate、platform status を触ったPRで、status文書だけ更新漏れになるのを防ぐため。
- release readiness でも PR template に verification-status 更新項目が残ることを検査するようにした。
- `docs/release-notes-template.md` の冒頭にも `docs/verification-status.md` を先に確認・更新する注意を追加した。README / PR template / public review checklist にはstatus導線があったが、実際にGitHub Release本文を作るテンプレートだけが現在地の確認を明示していなかったため。
- release readiness でも release notes template の verification-status 導線を検査するようにした。release直前の証跡更新ループからstatus文書が外れないようにするため。
- `docs/public-repo-review-checklist.md` の Windows / Linux evidence commands に、`ko-zh-rollout.jsonl` を使う `--speech-language ko` / `--speech-language zh` のOS音声fallback確認を追加した。real-device verification と release notes template は多言語fallback証跡まで要求していたが、公開レビューchecklistのコマンド一覧だけ通常fixture TTSで止まっていたため。
- release readiness でも public review checklist に ko / zh fallback 証跡コマンドが残ることを検査するようにした。レビュー用一覧と実機検証手順のズレを再発させないため。
- `docs/real-device-verification.md` のsanitize説明を、`check, dry-run, or TTS logs` から `check, dry-run, installer, or TTS logs` へ広げた。Quick Contributor Request と public review checklist は全コマンド出力やinstaller出力も対象にしているため、詳細説明だけが狭く読まれないようにするため。
- CONTRIBUTING の Windows / Linux manual checks にも、`ko-zh-rollout.jsonl` を使う `--speech-language ko` / `--speech-language zh` のOS音声fallback確認を追加した。実機検証手順と公開レビューchecklistだけが多言語fallbackを要求し、通常のcontributor導線から抜ける状態を避けるため。
- release readiness でも、real-device verification のinstaller sanitize文言と CONTRIBUTING の ko / zh fallback コマンドを検査するようにした。
- `package.json.files` に `README.md` を明示した。npmはREADMEを自動同梱するため `check:pack` 上はすでに含まれていたが、allowlist側では `README.en.md` だけが見えており、配布対象の意図が読み手に伝わりにくかったため。
- release readiness でも `package.json.files` に `README.md` が残ることを検査するようにした。npmの暗黙挙動ではなくrepo側の明示allowlistで公開配布意図を固定するため。
- `test/monitor.test.mjs` の npm pack scope drift テストを補強し、完全なpack fixtureに `docs/verification-status.md` を含め、`missing required file` が出ないことも確認するようにした。既存テストは forbidden artifact を見ていた一方、完全fixture側で required file 欠落を見逃せる形だったため。
- `test/monitor.test.mjs` の release readiness package drift テストにも、`package.json.files` から `README.md` が消えた場合を追加した。前ターンでREADMEの明示allowlist化を入れたが、unit側でその退行を直接見ていなかったため。
- CONTRIBUTING に、audio failure や audible line なしの Platform verification issue は follow-up evidence として残すが、Windows / Linux のexperimental解除証跡には数えないことを追加した。`docs/real-device-verification.md` では明記済みだったが、外部協力者が最初に読む contributor 導線にも同じ判断基準を置くため。
- release readiness でも CONTRIBUTING の inaudible/failure follow-up 文言を検査するようにした。実機証跡の扱いが contributor guide だけ薄く戻らないようにするため。
- Platform verification issue template のTTS選択肢に合わせ、`docs/real-device-verification.md` と `docs/release-notes-template.md` の証跡ラベルを `Kokoro` / `other` から `Kokoro.js` / `Other local TTS` へ揃えた。フォームの選択値とrelease evidence表記が微妙に違うと、外部実機報告をrelease notesへ転記する時に判断が増えるため。
- release readiness の Platform verification TTS option検査を、macOS / Windows / Linux OS音声だけでなく、`VOICEVOX`、`Kokoro.js`、`Voicebox-compatible endpoint`、`Other local TTS` まで広げた。issue template のTTS選択肢がdocs側の証跡ラベルからズレても検出できるようにするため。
- `docs/verification-status.md` の Windows / Linux platform graduation 必須項目に、TTS path tested、speech language hint、config source、Codex Desktop / CLI version if known を追加した。real-device verification と Platform verification issue では記録必須にしているが、status文書の「Still Required」だけが install/check/dry-run/audible/link に圧縮されていたため。
- release readiness でも verification status の上記4項目を検査するようにした。platform graduation条件がstatus文書だけ粗く戻らないようにするため。
- `.github/ISSUE_TEMPLATE/bug_report.yml` の TTS provider 選択肢に `Other local TTS` を追加した。Platform verification では custom local TTS を分類できるが、bug report 側では Voicebox-compatible endpoint 以外のローカル音声統合を選びにくかったため。
- release readiness でも bug report template に `Other local TTS` が残ることを検査するようにした。TTS選択肢の粒度がreport template間でズレないようにするため。
- README日英の Windows 音声説明を、issue template / release notes / real-device docs と同じ `Kokoro.js` / `Other local TTS` 表記へ揃えた。入口のREADMEだけ `Kokoro` / Voicebox-compatible endpoint止まりだと、custom local TTSの報告・証跡ラベルと対応が見えにくくなるため。
- release readiness でも README日英の Windows audio guidance が上記ラベルを含むことを検査するようにした。
- release readiness の bug report TTS provider 検査を、ファイル全体の文字列チェックから `tts` field block 内の選択肢チェックへ強めた。`Other local TTS` が説明文など別の場所に残っていても、実際のdropdownから消えた場合に検出するため。
- `test/monitor.test.mjs` に、bug report の `Other local TTS` dropdown option が消えた場合を検出する退行テストを追加した。
- `test/monitor.test.mjs` に、Platform verification の `Other local TTS` dropdown option が消えた場合を検出する退行テストも追加した。release readiness 実装は全TTS選択肢を見ているが、unit側で代表例がOS音声の `Linux espeak` に寄っていたため、custom local TTSの選択肢も直接守るため。
- `test/monitor.test.mjs` の release evidence drift テスト対象に `docs/verification-status.md` を追加し、status文書から `npm run check:release` が消えた場合を検出するケースを入れた。`check-release-readiness.mjs` 本体ではstatus文書も横断検査していたが、unit fixture側が release notes / real-device / platform issue だけで止まっていたため。
- `test/monitor.test.mjs` の package drift / npm pack scope drift テストに、`docs/verification-status.md` が `package.json.files` とpack artifactから消えた場合を直接検出するケースを追加した。実装側では既にrequired fileだったが、unit側でstatus文書の公開同梱だけを狙った退行検出が薄かったため。
- `.github/ISSUE_TEMPLATE/tts_provider_request.yml` の API / privacy 欄にも `npm run sanitize:public-output` 導線を追加した。TTS provider提案ではローカルAPIやコマンド例にcredential / endpoint / conversation text が混ざりやすいが、bug report や platform verification と違ってsanitizer導線が薄かったため。
- release readiness と unit test でも TTS provider request の sanitizer導線が残ることを検査するようにした。安全注意の文言だけ追加しても、将来のテンプレート整理で消えた場合に検出できないため。
- `.github/pull_request_template.md` の Safety checklist に `macOS metadata` と `downloaded model files` を追加した。Issue templates、check scripts、sanitizer、pack guard は既にこの2種類を公開前の注意対象として扱っていたが、PRレビュー時の最終確認欄だけが少し粗かったため。
- release readiness と unit test でも PR template から `macOS metadata` / `downloaded model files` が消えた場合を検出するようにした。公開前レビューのチェックリストが他の安全ガードより弱く戻らないようにするため。
- `SECURITY.md` のpublic issue禁止リストに `macOS metadata` を追加し、sanitizer説明も private paths、conversation text、local env values、credential env/header、generated audio、recording/archive names、local SQLite DB names、model filenames まで明記した。Issue templates / README / check scripts と比べてSecurity policyだけ説明粒度が古く、外部報告者が最初に読む正本として弱かったため。
- release readiness でも `SECURITY.md` の expanded sanitizer scope を検査するようにした。security文書だけが古いsanitize説明へ戻ると、公開Issueに何を貼ってよいかの判断が揺れるため。
- `.github/ISSUE_TEMPLATE/install_trouble.yml` の check output / audio output 欄にも `conversation text` を除く注意を追加した。install trouble はsetup停止点の報告が主目的だが、check outputやdry-run由来ログに発話本文が混ざる可能性があり、bug report / platform verification と比べて privacy guidance が1項目だけ薄かったため。
- `githubTemplateIssues()` の共通privacy guidance検査にも `conversation text` を追加し、unit test で install trouble からこの注意が消えた場合を検出するようにした。
- README日英の Release Process と `docs/public-repo-review-checklist.md` の common release gate に `npm run test:dry-run` を明示した。`check:all` には含まれているが、Talking Pets の核はCodex発話抽出なので、monitor extraction / fixture behavior を触ったPRでdry-run確認を人間が見落としにくくするため。
- release readiness でも README日英と public review checklist に `npm run test:dry-run` が残ることを検査するようにした。
- CONTRIBUTING の Issues 共通リストに、audio / platform verification では speech language hint と config source、platform verification では Codex Desktop / CLI version if known を含める案内を追加した。詳細手順やPlatform verification issue templateには既にあるが、外部contributorが最初に読むIssue入口だけがOS/Node/TTS provider中心で、実機証跡フィールドを見落としやすかったため。
- release readiness でも CONTRIBUTING の上記フィールド案内が残ることを検査するようにした。
- CONTRIBUTING の Pull Requests 安全チェックにも `downloaded model files` と `macOS metadata` を追加した。PR template / SECURITY / issue templates / sanitizer は既にこの2種類を公開前注意対象として扱っていたが、contributor guideだけが古い粒度のままだったため。
- release readiness でも CONTRIBUTING の PR安全チェックに `downloaded model files` / `macOS metadata` が残ることを検査するようにした。
- `scripts/check-config-files.mjs` で `presets/examples/generic-voicebox.env` の `TALKING_PETS_VOICEBOX_PROFILE="default"`、`TALKING_PETS_VOICEBOX_LANGUAGE="en"`、`TALKING_PETS_SPEECH_LANGUAGE="en"` も期待値として検査するようにした。Voicebox-compatible endpoint のexampleは profile / language が利用者の接続条件に直結するが、以前は `TALKING_PETS_VOICEBOX_MODE="generic"` までしか固定していなかったため。
- release readiness でも `expectedVoiceboxProfile` / `expectedVoiceboxLanguage` の検査が残ることを確認するようにした。
- `test/monitor.test.mjs` に、config checker が `generic-voicebox.env` の `expectedVoiceboxProfile: "default"`、`expectedVoiceboxLanguage: "en"`、`expectedSpeechLanguage: "en"` を持つことを確認する退行テストを追加した。release readinessだけでなくunit側でも、Voicebox-compatible example の重要値固定が落ちた時に検出するため。
- `test/monitor.test.mjs` で `presets/examples/generic-voicebox.env` の実ファイルも読み、`TALKING_PETS_TTS="voicebox"`、`TALKING_PETS_VOICEBOX_MODE="generic"`、profile / language / speech-language の値を直接確認するようにした。checker側の期待値だけ残っていても、example file自体がズレた場合にunitで検出するため。
- `test/monitor.test.mjs` の example env 実ファイル確認を、`generic-voicebox.env` だけでなく `en-kokoro-heart.env`、`ja-voicevox-zundamon.env`、`ko-say-fallback.env`、`privacy-first-say.env`、`zh-say-fallback.env` まで広げた。`npm run check:config` では検出できるが、unit側でも各exampleのTTS / UI language / speech-language が意図した組み合わせからずれた場合に早く見えるようにするため。
- README日英の `presets/examples/` セクションに、各example envの用途を短く追加した。ファイル名一覧だけだと、`privacy-first-say.env` と `generic-voicebox.env` の違いや ko/zh fallback の意図が初見で分かりにくかったため。
- release readiness でも README日英に `privacy-first-say.env` と `generic-voicebox.env` の用途説明が残ることを検査するようにした。example一覧がファイル名だけに戻ると、手動設定の選び方が弱くなるため。
- `docs/public-repo-review-checklist.md` にも、`privacy-first-say.env` は OS speech / `auto` speech-language / model downloadなし、`generic-voicebox.env` は generic mode / profile `default` / language `en` の Voicebox-compatible endpoint 用だと明記した。READMEだけに用途説明があると、公開レビューchecklistから設定例の意図を確認しにくいため。
- release readiness でも public review checklist の example用途説明が残ることを検査するようにした。
- `docs/verification-status.md` の Verified Locally に `npm run test:dry-run` を追加した。README日英と public review checklist では release導線として明示済みだったが、現在地snapshotだけが `check:all` 内包と monitor command 表記に寄っていたため、release gate commandの一覧として揃える。
- release readiness でも verification status に `npm run test:dry-run` が残ることを検査するようにした。
- `test/monitor.test.mjs` の workflow drift テストに、CI から `npm run test:dry-run` が消えた場合の退行検出を追加した。`workflowIssues()` 本体では必須コマンドとして見ているが、unit側の代表ケースが `check:all` までで止まっていたため、fixture dry-run のCI証跡を直接守る。
- `docs/real-device-verification.md`、`docs/release-notes-template.md`、Platform verification issue template に `npm run test:dry-run` を明示した。`check:all` に含まれるだけだと、実機証跡を読む人が fixture extraction の単独結果を見落としやすいため。release readiness と unit test でもこの明示が消えたら検知する。
- PR template の Checks に `npm run test:dry-run` を追加した。monitor extraction、rollout fixture、public evidence command を触るPRでは、`check:all` の一部としてだけでなく dry-run の出力を直接見る必要があるため。
- `docs/public-repo-review-checklist.md` のOS別 evidence commands に `./install.command`、`.\\install.ps1`、`./install.sh` を追加した。実機卒業条件ではinstall証跡が必須だが、公開レビュー用のコマンドブロックがcheckから始まっていたため、証跡採取時の抜けを防ぐ。
- `CONTRIBUTING.md` に installer output 用の sanitizer 例を追加した。Platform verification では install 証跡も貼るため、check output だけを sanitize する案内だと local path や config 関連の出力を貼る時に抜けが出やすい。
- sanitizer の unit test に installer output で出やすい local config path と `TALKING_PETS_*` 値を追加した。installer 側は相対表示へ寄せているが、platform verification で貼られる実ログに絶対パスやlocal voice名が混ざった場合も regression で守るため。
- `docs/real-device-verification.md` の sanitizer example に install command の pipe 例を追加した。本文では installer logs も sanitize 対象としているため、check command だけの例だと実機担当者が install output をそのまま貼る可能性が残るため。
- `docs/release-notes-template.md` の Verified Platforms 表に `sanitized: yes|no` placeholder を追加した。Platform verification issue では public evidence sanitized が必須確認だが、release note の行へ転記する時に audible だけが見えて sanitize 状態が埋もれないようにするため。
- `docs/verification-status.md` の Windows / Linux platform graduation 条件に `audible: yes` と `sanitized: yes` を追加した。release notes template では同じ判定語を使うため、現在地メモからrelease evidenceへ転記する時に判断基準がズレないようにする。
- README / README.en の Release Process に `audible: yes` / `sanitized: yes` を追加した。実機release前の短い導線でも、verification status と release notes template と同じ判定語を使えるようにするため。
- PR template の Real-Device Evidence 欄にも `audible: yes` / `sanitized: yes` を追加した。レビュー画面だけ別表現だと、status / release notes へ転記する時に判断語が揺れるため。
- `docs/real-device-verification.md` の Release Note Snippet を、曖昧な `<result>` から `speech-language: ...`、`audible: yes|no`、`sanitized: yes|no` へ置き換えた。release notes template の Verified Platforms 表と同じ判断軸にするため。
- `docs/public-repo-review-checklist.md` の real-device reports 項目にも `audible: yes` / `sanitized: yes` を追加した。公開レビューの棚卸し時にも README / status / PR / release notes と同じ判断語を使えるようにするため。
- `docs/public-repo-review-checklist.md` の `--no-state` 補足に、real-device verifier に local Codex state がない場合は Platform verification issue に制限として記録し、`npm run check:compat -- --no-state` は stateful Codex verification ではなく supplemental fixture evidence と扱うことを追加した。
- `docs/release-notes-template.md` の Known Limits に、local Codex state がない検証者の `npm run check:compat -- --no-state` は supplemental fixture evidence であり、platform graduation 用の stateful Codex verification ではないことを追加した。
- `docs/verification-status.md` に macOS の release evidence draft 行を追加した。現在地メモから `docs/release-notes-template.md` へ転記する時に、OS/version/arch/TTS/speech-language/audible/sanitized を再構成しなくて済むようにするため。
- 公開証跡用の sanitizer pipe 例を dry-run と audible TTS コマンドまで広げた。install/check だけが pipe 例になっていると、Platform verification issue に貼るべき monitor 出力が未sanitizeのまま残るリスクがあるため。
- `docs/real-device-verification.md` に Windows/Linux 実機検証を依頼するための copy-paste request を追加した。残タスクが実機協力者待ちになった時、依頼文の組み立てで抜ける `audible: yes` / `sanitized: yes` / no local Codex state の扱いを明文化するため。
- `docs/verification-status.md` に evidence 受領後の確認リストを追加し、release notes template からも「先に verification status を更新してから昇格する」流れを明記した。Platform verification issue のURLだけで Windows/Linux をstable扱いにしてしまう事故を防ぐため。
- `docs/verification-status.md` に Windows/Linux の release evidence row template を追加した。実機証跡が来たあと、TTS path / speech-language / audible / sanitized / evidence link を別々に転記して欠落するのを避けるため。
- CI / fixture / `--no-state` / package check は release gate であり、Windows/Linux の platform graduation evidence ではないことを docs に明記した。`check:all` が通っていることと「実機で音が出た」は別の証拠なので、レビュー時に混同しないようにするため。
- README / README.en の Release Process と `FUTURE_PLAN.md` の graduation 条件を、`docs/verification-status.md` と同じ `audible: yes` / `sanitized: yes` / Platform verification issue link 付きの条件へ揃えた。入口文書や将来メモだけを読んだ時に、古い短縮条件でWindows/Linuxを昇格させないため。
- `.github/ISSUE_TEMPLATE/platform_verification.yml` と `.github/pull_request_template.md` にも CI-only / fixture-only / `--no-state` / package check は release gate であり、Windows/Linux graduation evidence ではないことを追加した。実際の投稿フォームとレビュー checklist で同じ境界を見せるため。
- `.github/pull_request_template.md` の Real-Device Evidence に install / platform check / dry-run / audible TTS command output を追加した。Platform verification issue では必須にしている証跡粒度が、PRレビュー側で抜けないようにするため。
- `docs/verification-status.md` の macOS Verified Locally に audible fixture TTS command を追加した。Release Evidence Draft では `audible: yes` としているため、現在地文書の検証済みコマンド一覧にも同じ証跡粒度を持たせるため。
- `CONTRIBUTING.md` の Platform verification 説明に platform check と CI-only / fixture-only / `--no-state` / package-check の境界を追加した。外部協力者が最初に読む文書だけ古い短縮条件に戻らないようにするため。
- `scripts/sanitize-public-output.mjs` に引用符付きローカルパスの先行redactionを追加した。既存のパスredactionは空白区切りのため、`/Users/Jane Doe/...` や `C:\Users\Jane Doe\...` のようにユーザー名や録画名に空白がある実機ログでは途中まで残る可能性があったため。unit test には空白入りの state DB、local path、recording、private rollout JSONL を追加した。
- CI の `Check public output sanitizer` smoke test にも空白入りの引用符付き recording / private rollout JSONL を追加し、`Jane Doe`、`private demo.mov`、`private rollout.jsonl` が残らないことを確認するようにした。unitだけでなくGitHub Actions上の公開ログsanitizer例としても退行を検出するため。
- `test/monitor.test.mjs` の workflow drift テストにも、CI sanitizer smoke から `Jane Doe`、`private demo.mov`、`private rollout.jsonl` が消えた場合の検出を追加した。release readiness 実装に文字列を足すだけだと、その実装自体の退行を unit で代表検出できなかったため。
- `docs/release-notes-template.md` の Known Limits の Windows / Linux experimental 条件を、`install, dry-run, one audible TTS path` から `install, platform check, dry-run, one audible TTS path, audible: yes, sanitized: yes, sanitized Platform verification issue link` へ広げた。Verified Platforms セクションや verification status と比べて Known Limits だけ条件が短く、release直前に制限欄だけ読んだ場合に platform check / sanitized evidence を見落とす可能性があったため。release readiness と unit test でもこの文言が落ちた場合を検出する。
- `CONTRIBUTING.md` の release evidence 文を、install / platform check / dry-run / audible TTS command だけでなく、TTS path tested、speech language hint、config source、Codex Desktop / CLI version if known、`audible: yes`、`sanitized: yes`、sanitized Platform verification issue link まで含める形へ広げた。README / verification status / release notes では要求済みだったが、外部協力者向けの短い入口だけが圧縮されていたため。release readiness でもこの詳細が残ることを検査する。
- `docs/public-repo-review-checklist.md` の Real-device reports 文にも、install、platform check、dry-run、one audible TTS command output を追加した。TTS path / speech language / config / Codex version / audible / sanitized は既にあったが、公開レビューの棚卸し表だけ「どのコマンド出力が必要か」が短くなっていたため。release readiness でもこの条件が残ることを検査する。
- `.github/pull_request_template.md` の Real-Device Evidence にある evidence link 行を、単なる `Platform verification issue` から `sanitized Platform verification issue for release notes` へ明確化した。PR review画面では sanitized 確認とissue linkが別行だったため、release notesへ貼るリンクがsanitize済みのPlatform verification issueであることを一目で確認できるようにする。release readiness と unit test でもこの表現が残ることを検査する。
- `.github/ISSUE_TEMPLATE/platform_verification.yml` の description を `install, dry-run, and audio playback evidence` から `install, platform check, dry-run, and audible TTS evidence` へ更新した。GitHub のtemplate選択画面で最初に見える短い説明だけ platform check が抜けていたため。release readiness と unit test でもこの説明が残ることを検査する。
- `codex --version` で `codex-cli 0.130.0` を確認できたため、`docs/verification-status.md` の macOS release evidence draft を `Codex: unknown` から `Codex CLI: 0.130.0` へ更新した。コマンドは PATH 更新 warning を出したがversion自体は取得できたため、release evidence の既知情報として採用する。release readiness でもこのmacOS証跡行を検査する。
- `docs/verification-status.md`、`docs/release-notes-template.md`、`docs/real-device-verification.md` の実際にコピーする evidence row / snippet に `config source` を追加した。本文では config source を必須にしていたが、転記用の行から抜けると release notes 作成時に落ちやすいため。release readiness と unit test でもこのplaceholderが戻らないよう検査する。
- README日英と `FUTURE_PLAN.md` の release evidence 要約に `TTS path tested` と `Codex Desktop / CLI version if known` を追加した。詳細docs / PR template / public checklist では必須項目になっているが、最初に読む短いrelease導線だけが圧縮されていたため。release readiness でもこの2項目がREADME日英とfuture planに残ることを検査する。
- README日英と `docs/public-repo-review-checklist.md` に、`npm run check:pack` は npm publish 準備ではなく package-scope audit であり、`package.json` は意図的な公開まで `private: true` のままにすることを追記した。GitHub clone前提の配布方針と、tarball scope検査を強く要求しているrelease gateが初見で矛盾して見えないようにするため。release readiness でもこの説明が残ることを検査する。
- `./check.command` の現在の成功出力に合わせて、README日英の check output example に local Codex state skip、manual dry-run debugging、public evidence sanitization のfooter 3行を追加した。実コマンドには表示されるのにREADME例から抜けていると、初見ユーザーが成功/失敗の判断で迷うため。release readiness でもこのfooter文言がREADME日英に残ることを検査する。
- README日英の Windows / Linux experimental セクションに、`check.ps1` / `check.sh` の compat 出力は公開証跡向けの fixture-only 確認であり、stateful Codex verification は `npm run check:compat` で別途確認することを追加した。実スクリプトは footer で同じ注意を出しているが、OS別導線だけを読んだ時にも同じ境界が分かるようにするため。release readiness でもこの説明が残ることを検査する。
- `.github/ISSUE_TEMPLATE/platform_verification.yml` の sanitized / audible dropdown 説明に、Yes を release evidence の `sanitized: yes` / `audible: yes` として転記できる条件だと明記した。Issue上の Yes/No と release notes / verification status の判定語が頭の中で変換されるだけだと、転記時に揺れるため。release readiness でもこの説明が残ることを検査する。
- `docs/real-device-verification.md` の Release Note Snippet 内 Known limits が古い `install, dry-run, one audible TTS path` 条件のままだったため、platform check、`audible: yes`、`sanitized: yes`、sanitized Platform verification issue link まで含む現行条件に揃えた。release notes template だけ厳しくても、実機検証docsからsnippetをコピーした場合に条件が短縮されるため。`releaseEvidenceIssues()` と unit test でも real-device verification 側の短縮を検出する。
- `docs/public-repo-review-checklist.md` の release gate 末尾の注意文を、`installer, dry-run, and audible TTS evidence` から `installer, platform check, dry-run, and audible TTS evidence` に揃えた。本文では platform check を要求しているが、締めの一文だけ短縮されていると公開レビュー時に `./check.*` 証跡を取り忘れやすいため。release readiness でもこの表現を検査する。
- README日英のデモ録画リンクは canonical GitHub URL のまま維持し、静止画だけrepo内相対リンクとして検査するよう release readiness を強化した。`.mov` は npm tarball から除外する方針のため、READMEから相対 `.mov` を参照すると `check:pack` が壊れる。動画は外部URL、packaged still frame は相対リンク、という境界を明示的に守る判断。
- CI内に直接書いていた public-output sanitizer smoke を `scripts/check-public-output-sanitizer.mjs` と `npm run check:sanitize` に切り出し、`check:all` に含めた。公開ログredactionはrelease safetyの中核なので、CIのbash断片だけでなくローカルでも同じ smoke を実行できるようにするため。README日英、CONTRIBUTING、release docs、verification status、future planにも release gate として追加し、release readiness / npm pack / unit test で抜けを検出する。
- `.github/pull_request_template.md` の Checks に `npm run check:sanitize` を追加した。sanitizer本体だけでなく、issue template、release evidence、sanitizer exampleを触るPRでも公開ログredaction smokeをレビュー画面で思い出せるようにするため。release readiness でもこのPR項目を検査する。
- 素の `npm pack --dry-run --json` がローカル `~/.npm` cache の権限問題で失敗する環境がある一方、`scripts/check-npm-pack.mjs` は一時npm cacheを使って同じauditを実行できる。README日英と public review checklist にこの違いを追記し、初見ユーザーが `npm pack` 直叩きのcache errorをpackage scope問題と誤解しないようにした。release readinessでも説明が残ることを検査する。
- `check.command` / `check.ps1` / `check.sh` の `node_modules` 不在ヒントを `npm install` から `npm ci` に揃えた。README、release evidence、PR template はlockfile再現性のため `npm ci` を標準にしているため、check出力だけが古い手動導線を示さないようにする判断。
- `install.command` / `install.ps1` / `install.sh` の Auto / Kokoro 依存セットアップも `npm install` から `npm ci` に変更した。`package-lock.json` を同梱し、release evidenceでも clean install を求めているため、installerが作る依存環境も同じlockfile再現性に寄せる。release readiness で `npm install` へ戻らないことを検査する。
- `.github/ISSUE_TEMPLATE/install_trouble.yml` の setup 停止箇所 placeholder も `npm ci` に揃えた。ユーザーがissue作成時に見る導線だけ古い `npm install` を示すと、README / installer / release evidence と食い違うため。release readiness で issue template に `npm ci` が残り、`npm install` が戻らないことを検査する。
- `docs/release-notes-template.md` と `docs/real-device-verification.md` の Known Limits も、TTS path tested、speech-language value、config source、Codex Desktop / CLI version if known まで含む Windows / Linux graduation 条件へ揃えた。本文や verification status では必須にしているが、Known Limits だけ短縮されていると release 直前に証跡欄を読み落とすため。release readiness と unit test でも短縮を検出する。
- `CONTRIBUTING.md` と `docs/public-repo-review-checklist.md` の contributor / public-review 向け短文にも、Platform verification issue template と同じ OS/version、CPU architecture、Node.js and npm versions を明記した。実機証跡の入口文だけが Node.js 単体表記だと、npm version やCPU architectureを取り忘れて release evidence row を埋められなくなるため。release readiness でこれらの短文も検査する。
- README日英、`FUTURE_PLAN.md`、`docs/verification-status.md` の release / graduation 条件にも OS/version、CPU architecture、Node.js and npm versions を反映した。`docs/verification-status.md` の macOS release evidence draft は現環境で確認した `node v24.2.0`、`npm 11.6.4`、`arm64` を含める形へ更新し、Windows/Linux row template も Node/npm placeholder を持つようにした。
- `docs/release-notes-template.md` の Verified Platforms 表と `docs/real-device-verification.md` の Release Note Snippet も Node.js / npm placeholder 付きへ更新した。status row だけが詳細で、実際にコピーされる release notes template / snippet が古いと、最終成果物から Node/npm 証跡が落ちるため。release readiness と unit test の known-limit guard も OS/version、CPU architecture、Node.js and npm versions を含む全文条件へ更新した。
- `.github/ISSUE_TEMPLATE/bug_report.yml` と `.github/ISSUE_TEMPLATE/install_trouble.yml` の `node` field label / placeholder を `Node.js and npm versions` に揃えた。Platform verification だけ npm version を求めても、通常のbug / install相談では setup や npm cache / lockfile 系の切り分けに必要な npm version が落ちやすいため。release readiness と unit test で issue template の node field 文言を検査する。
- `.github/ISSUE_TEMPLATE/tts_provider_request.yml` に `languages` と `requirements` field を追加した。TTS provider 追加判断では利用可能な言語/声と、導入に必要なアプリ・CLI・モデルdownload・local server・CPU/GPU前提が必須だが、既存fieldでは privacy / API / license に混ざりやすかったため。release readiness と unit test でこの2fieldが必須のまま残ることを検査する。
- real-device evidence の表現を `speech language hint` から `speech-language value` へ揃えた。Platform verification label、PR template、real-device verification、verification status、README の example config 説明が揺れると release row へ転記する語がぶれるため。release readiness の期待文言も `speech-language value` に更新した。
- `docs/verification-status.md` の graduation checklist / evidence review 文も `Node/npm versions` から `Node.js and npm versions` へ揃えた。issue template、README、CONTRIBUTING、public review checklist では同じ語に統一済みのため、status更新時だけ別表記に戻らないよう release readiness でも検査する。
- `.github/ISSUE_TEMPLATE/bug_report.yml` と `.github/ISSUE_TEMPLATE/install_trouble.yml` に `arch` field を追加した。CONTRIBUTING では問題報告にも CPU architecture を求めていたが、通常のbug / install相談フォームには入力欄がなく、Apple Silicon / Intel や Windows ARM / x64 の切り分けに必要な情報が落ちやすかったため。release readiness と unit test で `arch` field を必須として検査する。
- `.github/ISSUE_TEMPLATE/bug_report.yml` と `.github/ISSUE_TEMPLATE/install_trouble.yml` に任意の `codex_version` field を追加した。Platform verification では Codex Desktop / CLI version を聞いている一方、通常のbug / install相談では同じ情報が落ちやすく、Codex保存形式やDesktop/CLI差分の切り分けが遅れるため。必須にすると初回報告の負担が増えるので任意欄にし、release readiness と unit test で欄の存在だけを検査する。
- `CONTRIBUTING.md` の issue 報告リストも、Codex Desktop / CLI version を platform verification 限定ではなく通常の problem report 共通項目へ広げた。bug / install trouble template に任意欄を追加した後も contributor guide だけ古い条件のままだと、通常報告で version が落ちるため。release readiness の期待文言も同じ共通表現に更新する。
- `scripts/check-public-output-sanitizer.mjs` の smoke sample が、空白入りユーザー名・録画名・private rollout JSONL・credential header を含み続けることを release readiness と unit test で固定した。サンプルと禁止リストを同時に弱めると `npm run check:sanitize` だけでは退行に気づけないため、サンプル自体の守備範囲も検査対象にする。
- `releaseEvidenceIssues()` が release evidence docs 内の `npm run ...` 参照を抽出し、`package.json` の script 実在性を横断検査するようにした。従来は必須gate一覧だけを照合していたため、`npm run monitor:node -- ...` のような引数付き実機証跡コマンドは docs に残っていても package script 側の削除を検出しにくかった。`npmRunScriptName()` も引数付きコマンドから script 名を抜けるようにし、unit test で `monitor:node` 削除を検出する。
- README日英、CONTRIBUTING、公開docs、issue / PR templates に書かれた `npm run ...` 参照も、`package.json` の scripts と照合するようにした。release evidence docs 以外にも利用者が直接コピペするコマンドが多いため、`npm run test:dry-run` などのscript削除と公開案内のズレを `check:release` と unit test で検出する。
- `scripts/check-markdown-links.mjs` の Markdown link parser を、GitHub Markdown の angle-bracket link target 形式にも対応させた。通常の単語path linkだけだと、将来スペース入りファイル名へのリンクを使った時に `check:docs` / `check:pack` がリンクを拾えず見逃すため。unit test で抽出結果と package document link 検査の両方を固定する。
- `scripts/check-markdown-links.mjs` が Markdown reference-style link 定義も抽出するようにした。公開docsが増えると `[label]: docs/file.md` 形式を使う可能性があり、inline link と HTML `href/src` だけでは package 外リンクや欠落ファイルを見逃すため。unit test では通常定義と angle-bracket target 定義を両方固定する。
- `scripts/check-markdown-links.mjs` の link extraction は fenced code block 内を無視するようにした。README や実機手順docsではコード例として placeholder path や架空リンクを書く可能性があり、それを実リンクとして扱うと false positive になるため。通常のMarkdown link、reference-style link、HTML `href/src` は fence 外では引き続き検査する。

## 2026-05-29 Public Artifact Cleanup

- `presets/examples/ja-voicevox-zundamon.env`、`en-kokoro-heart.env`、`privacy-first-say.env` を追加し、GUIを作る前の軽量な設定プリセットとして使えるようにした。
- 以前のroot checklistは `.gitignore` 対象のため、公開repoで追跡できる継続版として `docs/public-repo-review-checklist.md` を追加した。
- README / README.en から `demo/bridge.html` の公開導線を削除し、Web demo は `demo/index.html` のみを案内する形にした。
- `FUTURE_PLAN.md` には、古いDOM bridge prototypeとOCR monitorはローカル退避済みで、公式DOM hookが出た時などに再検討する方針を書いた。
- `CHANGELOG.md` の browser demo 表現を、複数ページ前提から Web Speech API voice controls の単体デモへ修正した。
- 公開向け既定値からユーザー固有の呼びかけを外すため、`presets/speech-style.json`、Node monitor、Swift monitor、README例の `stripTerms` を空配列に変更した。
- 検証として、公開対象に `マスター|Master|OCR|bridge|Bridge|pet-ocr|codex-pet-voice-bridge|demo/bridge` が残っていないことを `rg` で確認した。残るのは `FUTURE_PLAN.md` のローカル退避方針のみ。
- `npm run check:syntax`、`npm run test:dry-run`、`zsh -n scripts/pet-rollout-monitor.command check.command install.command` を実行し、現行ルートの検証が通ることを確認した。

## 2026-05-28 Install-To-Overlay Demo Verification

- 公開前の実機検証として、追加依存が不要な `macOS say` / `Kyoko` を選んで `install.command` を通した。
- `check.command` では config、Node、npm、VOICEVOX疎通、macOS say、rollout dry-run を確認した。`node_modules` は `say` 選択では不要なため未作成のままにした。
- `start-selected-tts.command` を起動し、このCodexスレッドへデモ文を送信したところ、monitorが `source` と `pet` を検出して読み上げ候補へ変換した。
- 最初に作った画面収録は音声なしだったため、手動確認時の録画へ差し替えた。
- その後、パスやrollout IDが見える録画を避けるため、Pet overlay と通知中心の構図で撮り直した約25秒の録画を採用した。
- 採用動画は `docs/demo/talking-pets-overlay-2026-05-28.mov`。H.264、2242x476、AAC stereo、約25秒で保存した。`volumedetect` では `mean_volume: -44.6 dB` / `max_volume: -17.1 dB` を確認した。
- 収録内容の確認用に、採用動画の10秒地点から `docs/demo/talking-pets-overlay-2026-05-28-frame.png` を抽出し、READMEから参照できるようにした。
- 最初に `screencapture -v -V 8` を試したが、macOS側が `dispatch_source_create returned NULL` で失敗した。`-V8` に直し、GUI権限つきで実行して解決した。

## 2026-05-28 README Demo Recording And Compatibility Notes

- README / README.en の冒頭付近に、実機デモ動画を `<video>` と静止画リンクの両方で参照する `Demo Recording` セクションを追加した。
- GitHub環境によって `<video>` が表示されない場合に備え、同じ動画へ飛ぶ静止画リンクと直接リンクも残した。
- デモ録画内のPetキャラクターは作者のローカル環境のもので、repoにはPet画像、Live2D素材、アバター素材、キャラクターアートを含めないことを明記した。
- Talking Pets は公開Codex APIではなく、`state_5.sqlite` と rollout JSONL というローカル保存形式に依存するMVPであり、今後のCodexアップデートで壊れる可能性があることを明記した。
- 互換性が怪しい時は `check.command` と `--once --dry-run` で最新assistant発話の取得可否を確認する流れを案内した。

## 2026-06-02 STELLAVOX Roadmap And Latency Probe

- Talking Pets の中長期ロードマップ管理として `docs/ROADMAP.md` を追加し、STELLAVOX / 星声機構のHQ体制、担当、進捗状態、guardrail、次PR候補を日本語で整理した。
- GoalBuddy用に `docs/goals/talking-pets-roadmap/goal.md` / `state.yaml` / `notes/` を追加し、TTS、多言語、レイテンシ、SNS/成長、リスクをScoutしたreceiptを残した。
- ロードマップでは local-first、no paid API by default、privacy first、small PR を強い制約として扱い、API TTSや外部endpointは明示opt-inかつMaster確認後にする方針にした。

## 2026-06-02 Outreach, Helper Latency, And Multilingual Fallback

- 次トランシェのGoalBuddy正本として `docs/goals/talking-pets-next-tranche/` を追加し、TTS helper計測、多言語fallback、SNS/outreach調査、final auditのreceiptを残した。
- 韓国語と中国語を「専用TTS対応済み」とは言わず、`ko` / `zh` のfirst-class fallbackとして扱う方針を整理した。
- `docs/research/sns-outreach-strategy.md` を追加し、X/GitHub/Redditでの手動outreach候補、送信テンプレ、週次リズム、スパム化しないguardrailを整理した。自動DM、自動reply、非公開連絡先収集はしない方針にした。

## 2026-06-02 X Outreach Targets And Latency Benchmark Summary

- `docs/research/x-outreach-targets.md` を追加し、Xで見るべき候補、返信できる文脈、DM可否、リプ文案、初週の手動運用を整理した。
- 候補はCodex avatar / local TTS / AI VTuber / local-first agent UXに限定し、DMは相手が明示的に許可した場合か、公開返信後のフォローアップだけにした。
- レイテンシ計測はPR1で `scripts/latency-benchmark.mjs` と `npm run benchmark:latency` として保存済み。PR3では運用記録とroadmap側のreceiptを保存する。

## 2026-06-02 GoalBuddy Waves And Routing Diagnostics

- GoalBuddy第三波として `docs/goals/talking-pets-growth-latency-wave/` を追加し、レイテンシ比較、day-1 outreach queue、TTS候補Scout、多言語routing Scout、final auditを完了させた。
- `docs/goals/talking-pets-routing-diagnostics/` を追加し、routing diagnostics の設計・検証receiptを保存した。実装本体はPR1で保存済み。
- `docs/goals/talking-pets-sherpa-onnx-design/` と `docs/research/sherpa-onnx-design.md` を追加し、`sherpa-onnx-node` を次のlocal TTS候補として設計だけ行った。依存追加、model download、API callはしていない。
- npm cache権限問題のため一時的に静的看板を使ったが、その後 `npx goalbuddy board <absolute-goal-dir>` で local hub に `growth-latency-wave`、`routing-diagnostics`、`sherpa-onnx-design` を登録できることを確認した。
