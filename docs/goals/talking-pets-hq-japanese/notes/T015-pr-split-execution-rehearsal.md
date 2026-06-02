# T015 PR分割実行リハーサル

Owner role: 相庭 愛

## 目的

Masterが `PR分割/commitを優先` を承認した時に、PR 1から順番にstage/commit/PR化できるようにする。

このメモではまだ `git add`、commit、push、PR作成はしない。

## 推奨順

1. PR 1: レイテンシ計測とrouting diagnostics
2. PR 2: 多言語fallback claimとfixtures
3. PR 3: Roadmap / GoalBuddy / outreach docs

理由:

- PR 1が実装中心で、検証コマンドに直結している。
- PR 2のREADME diagnostics説明はPR 1の実装に依存する。
- PR 3はdocs/GoalBuddy/outreachの履歴束なので最後にまとめる方が読みやすい。

## PR 1実行案

branch:

```text
codex/talking-pets-latency-routing-diagnostics
```

stage:

```bash
git add package.json scripts/pet-rollout-monitor.mjs scripts/tts-kokoro.mjs scripts/tts-voicebox.mjs scripts/latency-benchmark.mjs docs/performance.md
```

commit:

```bash
git commit -m "Add latency and routing diagnostics"
```

verification:

```bash
npm run check:syntax
npm run test:dry-run
npm run benchmark:latency -- --runs 5
node --no-warnings scripts/pet-rollout-monitor.mjs --once --dry-run --diagnose-routing --rollout test/fixtures/zh-rollout.jsonl
```

PR title:

```text
Add latency profiling and routing diagnostics
```

PR body:

```markdown
## Summary

- add `--profile-latency` timing output for the Node rollout monitor and TTS helpers
- add repeated dry-run benchmark support with `scripts/latency-benchmark.mjs`
- add `--diagnose-routing` JSON output for local language/TTS routing checks

## Verification

- `npm run check:syntax`
- `npm run test:dry-run`
- `npm run benchmark:latency -- --runs 5`
- `node --no-warnings scripts/pet-rollout-monitor.mjs --once --dry-run --diagnose-routing --rollout test/fixtures/zh-rollout.jsonl`

## Notes

Diagnostics are dry-run only. They do not play audio or call external providers. The benchmark values only cover the dry-run monitor path, not real audio generation, model loading, provider cold start, or playback latency.
```

## PR 2実行案

branch:

```text
codex/talking-pets-multilingual-fallback-fixtures
```

stage:

```bash
git add README.md README.en.md FUTURE_PLAN.md presets/speech-style.json presets/voices.json test/fixtures/ja-rollout.jsonl test/fixtures/en-rollout.jsonl test/fixtures/ko-rollout.jsonl test/fixtures/zh-rollout.jsonl test/fixtures/zh-traditional-rollout.jsonl test/fixtures/symbol-only-rollout.jsonl
```

commit:

```bash
git commit -m "Align multilingual fallback docs and fixtures"
```

verification:

```bash
npm run check:syntax
npm run test:dry-run
node --no-warnings scripts/pet-rollout-monitor.mjs --once --dry-run --diagnose-routing --rollout test/fixtures/ko-rollout.jsonl
node --no-warnings scripts/pet-rollout-monitor.mjs --once --dry-run --diagnose-routing --rollout test/fixtures/zh-traditional-rollout.jsonl
node --no-warnings scripts/pet-rollout-monitor.mjs --once --dry-run --diagnose-routing --rollout test/fixtures/symbol-only-rollout.jsonl
```

PR title:

```text
Align multilingual fallback claims and fixtures
```

PR body:

```markdown
## Summary

- document `ko` and `zh` as first-class OS speech fallback paths, not dedicated TTS provider support
- align README preset excerpts with `presets/voices.json`
- add rollout fixtures for Japanese, English, Korean, Simplified Chinese, Traditional Chinese, and symbol-only text

## Verification

- `npm run check:syntax`
- `npm run test:dry-run`
- `node --no-warnings scripts/pet-rollout-monitor.mjs --once --dry-run --diagnose-routing --rollout test/fixtures/ko-rollout.jsonl`
- `node --no-warnings scripts/pet-rollout-monitor.mjs --once --dry-run --diagnose-routing --rollout test/fixtures/zh-traditional-rollout.jsonl`
- `node --no-warnings scripts/pet-rollout-monitor.mjs --once --dry-run --diagnose-routing --rollout test/fixtures/symbol-only-rollout.jsonl`

## Notes

This does not claim dedicated Korean or Chinese TTS support. Both currently route to OS speech fallback. The Traditional Chinese fixture proves routing/fallback behavior, not natural end-to-end Chinese speech quality.
```

## PR 3実行案

branch:

```text
codex/talking-pets-roadmap-goalbuddy-outreach
```

stage:

```bash
git add docs/ROADMAP.md docs/research/sns-outreach-strategy.md docs/research/x-outreach-targets.md docs/research/sherpa-onnx-design.md implementation-notes.md
find docs/goals -type f ! -path '*/.goalbuddy-board/*' ! -name '.DS_Store' -print0 | xargs -0 git add
```

commit:

```bash
git commit -m "Add roadmap, GoalBuddy receipts, and outreach notes"
```

verification:

```bash
node /Users/tsukuyomi/.codex/plugins/cache/goalbuddy/goalbuddy/0.3.8/skills/goalbuddy/scripts/check-goal-state.mjs docs/goals/talking-pets-hq-japanese/state.yaml
find docs/goals -type f -path '*/.goalbuddy-board/*' | wc -l
find docs/goals -type f ! -path '*/.goalbuddy-board/*' ! -name '.DS_Store' | wc -l
rg -n -i "star|自動返信|自動dm|dm policy|first week plan|watch only|手動|do not automate|do not dm|do not ask" docs/research/x-outreach-targets.md docs/research/sns-outreach-strategy.md
rg -n "sherpa|onnx|Master|承認|依存追加|model download|API call|PR 1|PR 2|PR 3" implementation-notes.md docs/research/sherpa-onnx-design.md docs/goals/talking-pets-hq-japanese/notes/T006-stage-manifest.md
```

PR title:

```text
Add roadmap, GoalBuddy HQ, and outreach planning
```

PR body:

```markdown
## Summary

- add the Japanese Talking Pets roadmap and STELLAVOX operating model
- add GoalBuddy goal/state/notes receipts for roadmap, latency/growth, routing diagnostics, sherpa-onnx design, and the Japanese HQ board
- add respectful manual outreach strategy and X/Reddit/GitHub message drafts
- add sherpa-onnx design notes without installing dependencies or downloading models

## Verification

- `node /Users/tsukuyomi/.codex/plugins/cache/goalbuddy/goalbuddy/0.3.8/skills/goalbuddy/scripts/check-goal-state.mjs docs/goals/talking-pets-hq-japanese/state.yaml`
- `find docs/goals -type f -path '*/.goalbuddy-board/*' | wc -l`
- `find docs/goals -type f ! -path '*/.goalbuddy-board/*' ! -name '.DS_Store' | wc -l`
- `rg -n -i "star|自動返信|自動dm|dm policy|first week plan|watch only|手動|do not automate|do not dm|do not ask" docs/research/x-outreach-targets.md docs/research/sns-outreach-strategy.md`
- `rg -n "sherpa|onnx|Master|承認|依存追加|model download|API call|PR 1|PR 2|PR 3" implementation-notes.md docs/research/sherpa-onnx-design.md docs/goals/talking-pets-hq-japanese/notes/T006-stage-manifest.md`

## Notes

No outreach was sent. No paid/API TTS was executed. No sherpa-onnx dependency or model was installed. `.goalbuddy-board/` generated files, `.DS_Store`, and unreviewed demo mp4/png files are intentionally excluded from this PR.
```

## stage前の赤信号

- `git status --short` で `docs/demo/*.mp4` / `docs/demo/*.png` がstage対象に混ざっている。
- `docs/goals/**/.goalbuddy-board/**` がstage対象に混ざっている。
- `docs/goals/.DS_Store` がstage対象に混ざっている。
- PR 1にREADMEやGoalBuddy docsが混ざっている。
- PR 2にlatency実装やoutreach docsが混ざっている。
- PR 3に実装変更が混ざっている。

## 現在の判断

3本ともstage準備はできている。

次にMaster確認が必要:

- `PR分割/commitを優先` で進めるか。
- 進めるならPR 1からbranch作成、stage、commit、push、PR作成まで進めてよいか。
