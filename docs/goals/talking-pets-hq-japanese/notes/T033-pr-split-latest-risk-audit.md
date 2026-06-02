# T033 PR分割 最新リスク監査

Owner role: 白瀬 怜奈

## 目的

T032時点の最新差分を見て、PR1 / PR2 / PR3 の分割境界がまだ崩れていないか確認する。

このメモでは `git add`、commit、push、PR作成はしない。

## 現在の差分

tracked差分:

```text
FUTURE_PLAN.md
README.en.md
README.md
implementation-notes.md
package.json
presets/speech-style.json
presets/voices.json
scripts/pet-rollout-monitor.mjs
scripts/tts-kokoro.mjs
scripts/tts-voicebox.mjs
```

untracked差分:

```text
docs/ROADMAP.md
docs/demo/talking-pets-overlay-2026-05-28-x-1280x720-speedramps-x4.mp4
docs/demo/talking-pets-overlay-2026-05-28-x-1280x720.mp4
docs/demo/talking-pets-overlay-2026-05-28-x4-frame.png
docs/goals/
docs/performance.md
docs/research/
scripts/latency-benchmark.mjs
test/fixtures/en-rollout.jsonl
test/fixtures/ja-rollout.jsonl
test/fixtures/ko-rollout.jsonl
test/fixtures/symbol-only-rollout.jsonl
test/fixtures/zh-rollout.jsonl
test/fixtures/zh-traditional-rollout.jsonl
```

## PR1境界

PR1候補:

```text
package.json
scripts/pet-rollout-monitor.mjs
scripts/tts-kokoro.mjs
scripts/tts-voicebox.mjs
scripts/latency-benchmark.mjs
docs/performance.md
```

注意:

- `scripts/latency-benchmark.mjs` と `docs/performance.md` はuntrackedなので、`git diff --stat` には出ない。
- stage前に `test -f` で存在確認する。
- README / fixtures / GoalBuddy / demo素材を混ぜない。

PR1候補6ファイルは存在確認済み。

## PR2境界

PR2候補:

```text
README.md
README.en.md
FUTURE_PLAN.md
presets/speech-style.json
presets/voices.json
test/fixtures/ja-rollout.jsonl
test/fixtures/en-rollout.jsonl
test/fixtures/ko-rollout.jsonl
test/fixtures/zh-rollout.jsonl
test/fixtures/zh-traditional-rollout.jsonl
test/fixtures/symbol-only-rollout.jsonl
```

注意:

- PR2はPR1の `--diagnose-routing` 実装に依存する。
- 韓国語/中国語を専用TTS対応済みとは書かない。
- fixtureはrouting/fallback証拠であり、自然な多言語TTS品質保証ではない。

## PR3境界

PR3候補:

```text
docs/ROADMAP.md
docs/research/**
docs/goals/** の正本ファイル
implementation-notes.md
```

除外:

```text
docs/goals/**/.goalbuddy-board/**
docs/goals/.DS_Store
docs/demo/*.mp4
docs/demo/*.png
```

現時点の数:

```text
.goalbuddy-board生成物: 24 files
GoalBuddy正本候補: 66 files
```

注意:

- GoalBuddy正本は増えているので、PR3 stage時に `.goalbuddy-board` を混ぜないこと。
- demo mp4/pngは未追跡のまま。投稿素材としては使えるが、PR1/2/3へは混ぜない。

## 最新リスク

1. PR1候補の2ファイルがuntrackedなので、stage漏れしやすい。
2. PR3候補のGoalBuddy正本が増えているので、`.goalbuddy-board` 生成物を混ぜやすい。
3. demo素材が未追跡で目立つため、誤stageしやすい。
4. READMEの多言語説明はPR2向けで、PR1へ混ぜると実装PRが大きくなる。
5. `implementation-notes.md` は全体履歴なのでPR3へ寄せる。

## stage前チェック

PR1を切る直前:

```bash
for f in package.json scripts/pet-rollout-monitor.mjs scripts/tts-kokoro.mjs scripts/tts-voicebox.mjs scripts/latency-benchmark.mjs docs/performance.md; do test -f "$f" || exit 1; done
git status --short
```

stage後:

```bash
git diff --cached --name-only
```

期待値:

```text
docs/performance.md
package.json
scripts/latency-benchmark.mjs
scripts/pet-rollout-monitor.mjs
scripts/tts-kokoro.mjs
scripts/tts-voicebox.mjs
```

## 判断

PR分割境界はまだ有効。

次にMasterがPR1を承認したら、branch作成、PR1候補6ファイルのstage、検証、commitへ進める。

T006のMaster判断待ちは継続。
