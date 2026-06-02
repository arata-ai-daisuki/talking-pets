# Talking Pets 成長とレイテンシ第三波

## 目的

Talking Petsを「ロードマップがある」状態から、GoalBuddy看板で追える実行状態へ進める。

レイテンシ計測を比較可能にし、outreach候補をスパム化せず手動実行できる状態にし、次のTTS/API/多言語判断材料を揃える。

## 完了条件

- GoalBuddy `state.yaml` がエラーなしで検証できる。
- 少なくとも1つの実装sliceがローカルコマンドで検証済み。
- outreach、TTS/API、多言語のfollow-up noteが `notes/` に存在する。
- 公開アクション判断はMasterに残り、outreachは自動化されていない。
- 次に推奨するtaskが明確。

## 制約

- Master向け説明は日本語優先。
- local-first / privacy-first。
- 同一turnの明示承認なしに有料API系実行をしない。
- Xの自動reply、DM、follow、like、scraping、非公開データ収集は禁止。
- API TTSはopt-inのみ。
- 変更は小さく戻せる形に保つ。

## 看板

看板:

`docs/goals/talking-pets-growth-latency-wave/.goalbuddy-board/index.html`

## 開始コマンド

`/goal Follow docs/goals/talking-pets-growth-latency-wave/goal.md.`
