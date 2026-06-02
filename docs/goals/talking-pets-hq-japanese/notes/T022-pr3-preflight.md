# T022 PR 3 preflight

Owner role: 白瀬 怜奈

## 目的

MasterがPR 3実行を許可した時に、stage直前でGoalBuddy生成物やdemo素材が混ざらないか確認する。

このメモではまだ `git add`、commit、push、PR作成はしない。

## PR 3候補

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

## 現在の差分状態

tracked差分:

```text
implementation-notes.md
```

untrackedだがPR 3に入れる:

```text
docs/ROADMAP.md
docs/research/**
docs/goals/**/goal.md
docs/goals/**/state.yaml
docs/goals/**/notes/**
```

現在のGoalBuddy正本:

```text
56 files
```

現在のGoalBuddy生成物:

```text
24 files under docs/goals/**/.goalbuddy-board/**
```

PR 3から除外する:

```text
docs/goals/**/.goalbuddy-board/**
docs/goals/.DS_Store
docs/demo/talking-pets-overlay-2026-05-28-x-1280x720-speedramps-x4.mp4
docs/demo/talking-pets-overlay-2026-05-28-x-1280x720.mp4
docs/demo/talking-pets-overlay-2026-05-28-x4-frame.png
```

## stage前チェック

- [ ] `docs/ROADMAP.md` をstageする。
- [ ] `docs/research/**` をstageする。
- [ ] `implementation-notes.md` をstageする。
- [ ] `docs/goals/**/goal.md` をstageする。
- [ ] `docs/goals/**/state.yaml` をstageする。
- [ ] `docs/goals/**/notes/**` をstageする。
- [ ] `docs/goals/**/.goalbuddy-board/**` はstageしない。
- [ ] `docs/goals/.DS_Store` はstageしない。
- [ ] `docs/demo/*.mp4` / `docs/demo/*.png` はstageしない。
- [ ] PR 1のlatency実装ファイルはstageしない。
- [ ] PR 2のREADME/presets/fixturesはstageしない。

## stageコマンド

Master承認後にだけ実行する。

```bash
git add docs/ROADMAP.md docs/research/sns-outreach-strategy.md docs/research/x-outreach-targets.md docs/research/sherpa-onnx-design.md implementation-notes.md
find docs/goals -type f ! -path '*/.goalbuddy-board/*' ! -name '.DS_Store' -print0 | xargs -0 git add
```

## stage後の確認コマンド

stageした後に実行する。

```bash
git diff --cached --name-only
```

期待:

- `docs/goals/**/.goalbuddy-board/**` が出ない。
- `docs/goals/.DS_Store` が出ない。
- `docs/demo/*.mp4` / `docs/demo/*.png` が出ない。
- `package.json` や `scripts/**` や `README.md` が出ない。
- GoalBuddy正本、research docs、roadmap、implementation-notesだけが出る。

## PR 3検証コマンド

```bash
node <goalbuddy-check> docs/goals/talking-pets-hq-japanese/state.yaml
find docs/goals -type f ! -path '*/.goalbuddy-board/*' ! -name '.DS_Store' | wc -l
find docs/goals -type f -path '*/.goalbuddy-board/*' | wc -l
find docs/goals -type f -name '.DS_Store'
rg -n -i "star|自動返信|自動dm|dm policy|first week plan|watch only|手動|do not automate|do not dm|do not ask" docs/research/x-outreach-targets.md docs/research/sns-outreach-strategy.md
rg -n "sherpa|onnx|Master|承認|依存追加|model download|API call|PR 1|PR 2|PR 3" implementation-notes.md docs/research/sherpa-onnx-design.md docs/goals/talking-pets-hq-japanese/notes/T006-stage-manifest.md
```

## 実行済み確認

- GoalBuddy state check: pass。`goal_status: active` / `active_task: T006` のまま。
- GoalBuddy正本: 56 files。
- `.goalbuddy-board` 生成物: 24 files。PR 3から除外する。
- `docs/goals/.DS_Store`: 存在するがPR 3から除外する。
- outreach guardrails: pass。手動運用、自動返信/自動DM禁止、初回Star依頼禁止、watch-only対象が確認できた。
- sherpa-onnx guardrails: pass。設計のみで、依存追加、model download、API callはしていない。

## commit案

```bash
git commit -m "Add roadmap, GoalBuddy receipts, and outreach notes"
```

## 赤信号

- `.goalbuddy-board` がstage対象に混ざる。
- `.DS_Store` がstage対象に混ざる。
- demo mp4/pngがstage対象に混ざる。
- PR 1実装やPR 2 README/fixturesがstage対象に混ざる。
- outreach docsが自動投稿や初手Star依頼に読める。
- sherpa-onnxを実験済み、依存追加済み、model download済みのように書いている。

## 現在の判断

PR 3はpreflight上ready。

ただしPR 3はPR 1/PR 2の保存点後に進める方が自然。
