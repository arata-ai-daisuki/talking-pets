# T006 stage候補manifest

Owner role: 相庭 愛

## 目的

Masterが `PR分割/commitを優先` を選んだ時に、迷わずstageできるように候補を明確にする。

このmanifestは準備だけ。まだ `git add`、commit、pushはしていない。

## PR 1: レイテンシ計測とrouting diagnostics

### stage候補

```text
package.json
scripts/pet-rollout-monitor.mjs
scripts/tts-kokoro.mjs
scripts/tts-voicebox.mjs
scripts/latency-benchmark.mjs
docs/performance.md
```

### 関連するimplementation notes

`implementation-notes.md` は複数PRにまたがるため、PR 1に全部入れるか、最後のdocs PRにまとめるか判断が必要。

推奨:

- PR 1では入れない。
- PR 3でまとめて入れる。

理由:

- notesは今回のGoalBuddy/docs作業も含むため、PR 1に入れると範囲が広く見える。

### 検証

```bash
npm run check:syntax
npm run test:dry-run
npm run benchmark:latency -- --runs 5
node --no-warnings scripts/pet-rollout-monitor.mjs --once --dry-run --diagnose-routing --rollout test/fixtures/zh-rollout.jsonl
```

## PR 2: 多言語fallback claimとfixtures

### stage候補

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

### 注意

`README.md` / `README.en.md` はPR 1のdiagnostics説明も含むため、PR 1とPR 2で衝突しやすい。

推奨:

- PR 1: README変更を含めないで実装中心。
- PR 2: READMEの言語/diagnostics説明をまとめて含める。

### 検証

```bash
npm run test:dry-run
node --no-warnings scripts/pet-rollout-monitor.mjs --once --dry-run --diagnose-routing --rollout test/fixtures/ko-rollout.jsonl
node --no-warnings scripts/pet-rollout-monitor.mjs --once --dry-run --diagnose-routing --rollout test/fixtures/zh-traditional-rollout.jsonl
```

## PR 3: Roadmap / GoalBuddy / outreach docs

### stage候補

```text
docs/ROADMAP.md
docs/research/sns-outreach-strategy.md
docs/research/x-outreach-targets.md
docs/research/sherpa-onnx-design.md
docs/goals/talking-pets-roadmap/
docs/goals/talking-pets-next-tranche/
docs/goals/talking-pets-growth-latency-wave/
docs/goals/talking-pets-routing-diagnostics/
docs/goals/talking-pets-sherpa-onnx-design/
docs/goals/talking-pets-hq-japanese/
implementation-notes.md
```

### 注意

`.goalbuddy-board/` の生成物をPRに入れるかは判断が必要。

推奨:

- 日本語で追う目的があるので、今回のHQ boardだけは含めてもよい。
- 完了済みboardの `.goalbuddy-board/` は重くなるなら除外し、`state.yaml` / `goal.md` / `notes/` だけでもよい。

ただし現状 `.goalbuddy-board` はuntracked配下に含まれるため、PR化前に方針決定が必要。

### 検証

```bash
node /Users/tsukuyomi/.codex/plugins/cache/goalbuddy/goalbuddy/0.3.8/skills/goalbuddy/scripts/check-goal-state.mjs docs/goals/talking-pets-hq-japanese/state.yaml
curl -s http://goalbuddy.localhost:41737/api/boards
```

## PRに入れない

```text
docs/demo/talking-pets-overlay-2026-05-28-x-1280x720-speedramps-x4.mp4
docs/demo/talking-pets-overlay-2026-05-28-x-1280x720.mp4
docs/demo/talking-pets-overlay-2026-05-28-x4-frame.png
docs/goals/.DS_Store
```

## cleanup候補

`.DS_Store` はPRには不要。

ただし、このmanifest作成時点では削除していない。削除するなら、PR分割作業の最初に `docs/goals/.DS_Store` だけを確認して消す。

## あいちゃんの推奨stage順

1. PR 1を小さく作る。
2. PR 2でREADMEとfixtureを揃える。
3. PR 3でGoalBuddy/docs/researchをまとめる。

この順なら、実装の確認が先にできて、SNS/outreach docsは後から安心して見せられる。
