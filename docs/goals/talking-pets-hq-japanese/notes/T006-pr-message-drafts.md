# T006 PR本文・commit message案

Owner role: 相庭 愛

## 目的

Masterが `PR分割/commitを優先` を選んだ時に、そのまま使えるPR本文案とcommit message案を用意する。

まだcommit、push、PR作成はしていない。

## PR 1: レイテンシ計測とrouting diagnostics

### branch案

```text
codex/talking-pets-latency-routing-diagnostics
```

### commit message案

```text
Add latency and routing diagnostics
```

### PR title案

```text
Add latency profiling and routing diagnostics
```

### PR body案

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

Diagnostics are dry-run only. They do not play audio or call external providers.
```

## PR 2: 多言語fallback claimとfixtures

### branch案

```text
codex/talking-pets-multilingual-fallback-fixtures
```

### commit message案

```text
Align multilingual fallback docs and fixtures
```

### PR title案

```text
Align multilingual fallback claims and fixtures
```

### PR body案

```markdown
## Summary

- document `ko` and `zh` as first-class OS speech fallback paths, not dedicated TTS provider support
- align README preset excerpts with `presets/voices.json`
- add rollout fixtures for Japanese, English, Korean, Simplified Chinese, Traditional Chinese, and symbol-only text

## Verification

- `npm run test:dry-run`
- `node --no-warnings scripts/pet-rollout-monitor.mjs --once --dry-run --diagnose-routing --rollout test/fixtures/ko-rollout.jsonl`
- `node --no-warnings scripts/pet-rollout-monitor.mjs --once --dry-run --diagnose-routing --rollout test/fixtures/zh-traditional-rollout.jsonl`

## Notes

This does not claim dedicated Korean or Chinese TTS support. Both currently route to OS speech fallback.
```

## PR 3: Roadmap / GoalBuddy / outreach docs

### branch案

```text
codex/talking-pets-roadmap-goalbuddy-outreach
```

### commit message案

```text
Add roadmap, GoalBuddy boards, and outreach notes
```

### PR title案

```text
Add roadmap, GoalBuddy HQ, and outreach planning
```

### PR body案

```markdown
## Summary

- add the Japanese Talking Pets roadmap and STELLAVOX operating model
- add GoalBuddy boards and receipts for roadmap, latency/growth, routing diagnostics, and sherpa-onnx design
- add respectful manual outreach strategy and X/Reddit/GitHub message drafts
- add sherpa-onnx design notes without installing dependencies or downloading models

## Verification

- `node <goalbuddy-check> docs/goals/talking-pets-hq-japanese/state.yaml`
- `curl -s http://goalbuddy.localhost:41737/api/boards`

## Notes

No outreach was sent. No paid/API TTS was executed. No sherpa-onnx dependency or model was installed.
```

## まだPRに含めない候補

```text
docs/demo/talking-pets-overlay-2026-05-28-x-1280x720-speedramps-x4.mp4
docs/demo/talking-pets-overlay-2026-05-28-x-1280x720.mp4
docs/demo/talking-pets-overlay-2026-05-28-x4-frame.png
docs/goals/.DS_Store
```

## あいちゃんメモ

最初に切るならPR 1が一番安全。

理由:

- 実装中心で、成果が検証コマンドに直結している。
- outreachやGoalBuddy docsよりレビューしやすい。
- PR 1が通ると、PR 2の多言語fallback claimも説得力が出る。
