# T014 PR 3 stage精査メモ

Owner role: 文月 栞里

## 対象

PR 3: Roadmap / GoalBuddy / outreach docs

## 差分確認

PR 3候補:

```text
docs/ROADMAP.md
docs/research/sns-outreach-strategy.md
docs/research/x-outreach-targets.md
docs/research/sherpa-onnx-design.md
docs/goals/**/goal.md
docs/goals/**/state.yaml
docs/goals/**/notes/**
implementation-notes.md
```

`docs/goals/` 全体は約12MB。主な重さは各boardの `.goalbuddy-board/` 生成物。

正本だけに絞る場合:

```text
docs/goals/**/goal.md
docs/goals/**/state.yaml
docs/goals/**/notes/**
```

この場合は47ファイル程度で、経緯とreceiptは追える。

## PR 3に入れてよい理由

- `docs/ROADMAP.md` は日本語HQ/ロードマップの全体像とSTELLAVOX担当を残す正本。
- `docs/research/sns-outreach-strategy.md` は手動outreachのguardrail、候補segment、文面、週次運用を整理している。
- `docs/research/x-outreach-targets.md` は対象別の返信/DM可否と文案を整理している。自動投稿や初手Star依頼はしない。
- `docs/research/sherpa-onnx-design.md` はlocal TTS候補の設計だけを残しており、依存追加、model download、API callをしていない。
- `docs/goals/**/goal.md` / `state.yaml` / `notes/**` はGoalBuddyの履歴と証跡の正本。
- `implementation-notes.md` は今回の判断、妥協、検証、Master承認待ちをまとめる航海日誌。

## PR 3に入れないもの

```text
docs/goals/**/.goalbuddy-board/**
docs/goals/.DS_Store
docs/demo/talking-pets-overlay-2026-05-28-x-1280x720-speedramps-x4.mp4
docs/demo/talking-pets-overlay-2026-05-28-x-1280x720.mp4
docs/demo/talking-pets-overlay-2026-05-28-x4-frame.png
```

理由:

- `.goalbuddy-board/` はローカル表示用生成物で、各boardごとに約1.2MBから2.1MBある。PRを重くしやすい。
- GoalBuddyの経緯は `goal.md` / `state.yaml` / `notes/**` で追える。
- `.DS_Store` はPR不要。
- demo mp4/pngは未追跡で、PR 3のRoadmap/outreach docsとは別判断。

## stageするならこのコマンド

まだ実行していない。Masterが `PR分割/commitを優先` を選んだ後に使う。

```bash
git add docs/ROADMAP.md docs/research/sns-outreach-strategy.md docs/research/x-outreach-targets.md docs/research/sherpa-onnx-design.md implementation-notes.md
find docs/goals -type f ! -path '*/.goalbuddy-board/*' ! -name '.DS_Store' -print0 | xargs -0 git add
```

## PR 3検証コマンド

```bash
node <goalbuddy-check> docs/goals/talking-pets-hq-japanese/state.yaml
find docs/goals -type f -path '*/.goalbuddy-board/*' | wc -l
find docs/goals -type f ! -path '*/.goalbuddy-board/*' ! -name '.DS_Store' | wc -l
rg -n -i "star|自動返信|自動dm|dm policy|first week plan|watch only|手動|do not automate|do not dm|do not ask" docs/research/x-outreach-targets.md docs/research/sns-outreach-strategy.md
rg -n "sherpa|onnx|Master|承認|依存追加|model download|API call|PR 1|PR 2|PR 3" implementation-notes.md docs/research/sherpa-onnx-design.md docs/goals/talking-pets-hq-japanese/notes/T006-stage-manifest.md
```

## 実行済み確認

- GoalBuddy state check: pass。`goal_status: active` / `active_task: T006` のまま。
- `.goalbuddy-board` 生成物: 24ファイル。各boardで約1.2MBから2.1MBあり、PR 3から除外する方針。
- GoalBuddy正本: 48ファイル。`goal.md` / `state.yaml` / `notes/**` で経緯を追える。
- outreach guardrails: pass。手動運用、自動返信/自動DM禁止、初回Star依頼禁止、watch-only対象が確認できた。
- sherpa-onnx guardrails: pass。設計のみで、依存追加、model download、API callはしていない。実験はMaster承認待ち。

## 判断

PR 3はstage方針を絞れば切れる。

推奨:

- `.goalbuddy-board/` はPRに入れない。
- `docs/goals/.DS_Store` はPRに入れない。
- demo mp4/pngはPRに入れない。
- GoalBuddyの正本は `goal.md` / `state.yaml` / `notes/**` として入れる。

注意:

- `implementation-notes.md` は過去の作業履歴も含むため、PR 3の説明で「今回のdocs/outreach/GoalBuddy履歴をまとめるため」と明記する。
- sherpa-onnxは設計だけ。依存追加、model download、実験実行はMaster承認待ち。
- outreachは手動運用。自動返信、自動DM、初手Star依頼はしない。
